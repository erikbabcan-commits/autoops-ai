# AutoOps AI

Autonomous Operations Agent PWA for small e-shops and SMBs. Built as a clean **Vite + React Router v7** app because offline-first mobile PWA does not need a framework cathedral just to render a dashboard.

## Stack

- React 19 + TypeScript + Vite 6
- React Router v7 with App Router-style route modules in `src/app/routes`
- Tailwind CSS + shadcn/ui-compatible local components + Radix UI
- TanStack Query v5 + Zustand + Jotai
- Vite PWA plugin, offline-ready, installable, 7-day cache policy
- Zod + React Hook Form
- Framer Motion + Tailwind Animate
- Recharts
- Supabase Auth magic link with mock fallback for local development

## Project setup commands

```bash
npm create vite@latest autoops-ai -- --template react-ts
cd autoops-ai

npm install \
  react@^19 react-dom@^19 react-router@^7 \
  @tanstack/react-query@^5 zustand jotai \
  zod react-hook-form @hookform/resolvers \
  @supabase/supabase-js \
  lucide-react framer-motion recharts \
  class-variance-authority clsx tailwind-merge tailwindcss-animate \
  @radix-ui/react-avatar @radix-ui/react-dialog @radix-ui/react-dropdown-menu \
  @radix-ui/react-label @radix-ui/react-progress @radix-ui/react-scroll-area \
  @radix-ui/react-separator @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs

npm install -D \
  vite@^6 @vitejs/plugin-react vite-plugin-pwa typescript \
  tailwindcss postcss autoprefixer \
  eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh \
  @types/react @types/react-dom @types/node

npx tailwindcss init -p
```

This ZIP already contains the final project files, so you do **not** need to run the scaffold commands again unless you want to reproduce the setup from scratch.

## Run locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:5173`.

Without Supabase env variables, the login form enters a local mock session. With Supabase configured, it sends email magic links and redirects to `/auth/callback`.

## Production build

```bash
npm run typecheck
npm run build
npm run preview
```

## Folder structure

```txt
src/
├── app/
│   ├── routes/
│   ├── globals.css
│   ├── providers.tsx
│   ├── pwa.ts
│   ├── router.tsx
│   └── runtime.tsx
├── components/
│   ├── ui/
│   ├── layout/
│   ├── dashboard/
│   ├── agent/
│   ├── workflows/
│   ├── integrations/
│   ├── inbox/
│   ├── analytics/
│   └── auth/
├── lib/
│   └── action-graph/
├── hooks/
├── store/
├── types/
├── api/
└── assets/
```

## MVP features included

- Protected routes
- Dashboard with saved hours, live activity, quick stats and agent status
- Agent chat sidebar with mock action execution and approval guardrails
- Visual Action Graph builder with drag/drop nodes
- Unified inbox with AI categories and approval actions
- Analytics charts
- Integration hub with realistic SK/CZ connector data
- Install prompt + offline banner
- Mobile-first PWA shell

## Architecture notes

### Auth

`src/api/auth.ts` abstracts Supabase magic-link auth and a local mock provider. The UI consumes `useSessionBootstrap()` and `useAuthActions()` only.

Production rule: real integration tokens must live on your backend. Do not put Shopify, Gmail, Packeta, GLS, SuperFaktúra or iDoklad secrets in Vite env variables. That would be less “autonomous ops” and more “public credential donation program”.

### Action Graph

The graph builder is intentionally dependency-light: native drag/drop, Jotai state, deterministic validation, and connector registry in:

```txt
src/lib/action-graph/connectors.ts
src/lib/action-graph/engine.ts
```

Replace mocked functions in `src/api/agent.ts` and `src/api/workflows.ts` with your backend Action Graph engine / LLM tool-router.

### Offline/PWA

`vite.config.ts` configures `vite-plugin-pwa` with:

- installable manifest
- auto-update service worker registration
- app-shell fallback to `/index.html`
- 7-day runtime cache policy
- image, static asset and API cache buckets

Mock API functions also persist 7-day snapshots to `localStorage`, so the app remains useful during offline dev/demo sessions.

## Suggested next production steps

1. Add a backend API boundary for integration secrets and OAuth token storage.
2. Add row-level authorization for workspaces and users.
3. Replace mock action execution with an audited queue, for example Temporal, Trigger.dev, BullMQ, or cloud-native workflows.
4. Add signed webhook ingestion for Shopify/WooCommerce/Gmail events.
5. Add OpenTelemetry traces for every autonomous action.
6. Require human approval for refunds, accounting mutations, negative sentiment complaints and low-confidence replies.
