-- 1. EXTENSIONS (Pre vektory a UUID)
create extension if not exists "uuid-ossp";

-- 2. TABLES
-- Profily používateľov (majitelia e-shopov / operátori)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  role text check (role in ('admin', 'operator')) default 'operator',
  created_at timestamptz default now()
);

-- Skladové zásoby a produkty
create table if not exists public.products (
  id uuid default uuid_generate_v4() primary key,
  sku text unique not null,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  stock_quantity integer default 0,
  is_active boolean default true,
  updated_at timestamptz default now()
);

-- Konverzácie (Sessions)
create table if not exists public.conversations (
  id uuid default uuid_generate_v4() primary key,
  customer_email text,
  status text check (status in ('active', 'escalated', 'closed')) default 'active',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Jednotlivé správy v čete
create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.conversations on delete cascade not null,
  role text check (role in ('user', 'assistant', 'system')) not null,
  content text not null,
  created_at timestamptz default now()
);

-- Eskalácie (Záchranná brzda)
create table if not exists public.escalations (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.conversations on delete cascade not null,
  reason text not null,
  priority text check (priority in ('low', 'medium', 'high', 'critical')) default 'medium',
  resolved_at timestamptz,
  created_at timestamptz default now()
);

-- 3. SECURITY (Row Level Security)
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.escalations enable row level security;

-- 4. POLICIES (Pravidlá prístupu)
-- Produkty sú verejne čitateľné
do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Products are viewable by everyone') then
    create policy "Products are viewable by everyone" on public.products for select using (true);
  end if;
  
  if not exists (select 1 from pg_policies where policyname = 'Only admins can modify products') then
    create policy "Only admins can modify products" on public.products 
      using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );
  end if;

  if not exists (select 1 from pg_policies where policyname = 'Operators can see all conversations') then
    create policy "Operators can see all conversations" on public.conversations for all
      using ( exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'operator')) );
  end if;
end $$;

-- 5. AUTOMATION (Trigger pre nové profily)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
