import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { inboxApi } from '@/api/inbox';
import { InboxFilters } from '@/components/inbox/inbox-filters';
import { InboxList } from '@/components/inbox/inbox-list';
import { Skeleton } from '@/components/ui/skeleton';
import { selectedInboxCategoryAtom } from '@/store/atoms';

export function InboxPage() {
  const selectedCategory = useAtomValue(selectedInboxCategoryAtom);
  const query = useQuery({
    queryKey: ['inbox', selectedCategory],
    queryFn: () => inboxApi.list(selectedCategory)
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-cyber-cyan">Inbox</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-white">AI triage center</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Auto-categorized communications with approval queues for sensitive replies, refunds and angry humans. Especially angry humans.
        </p>
      </div>
      <InboxFilters />
      {query.isPending ? <Skeleton className="h-[560px] rounded-3xl" /> : <InboxList items={query.data ?? []} />}
    </div>
  );
}
