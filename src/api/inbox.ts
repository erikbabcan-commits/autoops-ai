import { cachedMock, sleep } from '@/api/client';
import { inboxItems } from '@/api/mock-data';
import type { InboxCategory, UnifiedInboxItem } from '@/types/domain';

let items = inboxItems;

export const inboxApi = {
  async list(category: InboxCategory | 'all' = 'all') {
    return cachedMock<UnifiedInboxItem[]>(`autoops:inbox:${category}`, () => {
      return category === 'all' ? items : items.filter((item) => item.category === category);
    });
  },

  async autoReply(id: string) {
    await sleep(420);
    items = items.map((item) => (item.id === id ? { ...item, status: 'auto_replied' } : item));
    return items.find((item) => item.id === id) ?? null;
  }
};
