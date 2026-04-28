import { safeJsonParse } from '@/lib/utils';

const SNAPSHOT_TTL_MS = 1000 * 60 * 60 * 24 * 7;

type Snapshot<T> = {
  value: T;
  savedAt: number;
};

export function sleep(ms = 420) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function isOffline() {
  return typeof navigator !== 'undefined' && navigator.onLine === false;
}

export function saveSnapshot<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify({ value, savedAt: Date.now() } satisfies Snapshot<T>));
}

export function readSnapshot<T>(key: string, fallback: T): T {
  const snapshot = safeJsonParse<Snapshot<T> | null>(localStorage.getItem(key), null);
  if (!snapshot) return fallback;
  if (Date.now() - snapshot.savedAt > SNAPSHOT_TTL_MS) return fallback;
  return snapshot.value;
}

export async function cachedMock<T>(key: string, producer: () => T | Promise<T>, delay = 420): Promise<T> {
  const cached = readSnapshot<T | null>(key, null);
  if (isOffline() && cached) return cached;

  await sleep(delay);
  const value = await producer();
  saveSnapshot(key, value);
  return value;
}
