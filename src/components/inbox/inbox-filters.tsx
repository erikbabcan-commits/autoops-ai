import { useAtom } from 'jotai'
import { Button } from '@/components/ui/button'
import { selectedInboxCategoryAtom } from '@/store/atoms'
import { cn } from '@/lib/utils'
import type { InboxCategory } from '@/types/domain'

const filters: Array<{ value: InboxCategory | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'complaint', label: 'Complaints' },
  { value: 'invoice', label: 'Invoices' },
  { value: 'shipping', label: 'Shipping' },
  { value: 'returns', label: 'Returns' },
  { value: 'lead', label: 'Leads' },
  { value: 'vip', label: 'VIP' },
]

export function InboxFilters() {
  const [selected, setSelected] = useAtom(selectedInboxCategoryAtom)

  return (
    <div className="mobile-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          type="button"
          variant={selected === filter.value ? 'neon' : 'outline'}
          size="sm"
          className={cn('shrink-0', selected === filter.value && 'shadow-glow')}
          onClick={() => setSelected(filter.value)}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  )
}
