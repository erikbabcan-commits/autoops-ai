import { cachedMock } from '@/api/client'
import { analyticsPoints } from '@/api/mock-data'

export const analyticsApi = {
  points: () => cachedMock('autoops:analytics:points', () => analyticsPoints),
}
