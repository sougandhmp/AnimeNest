import { getItem, keysWithPrefix, removeItem, setItem } from '@/lib/storage';

/** Bump when a cached response gains or changes fields, so old-shaped entries are dropped. */
const CACHE_VERSION = 2;
const ROOT = 'cache:';
const PREFIX = `${ROOT}v${CACHE_VERSION}:`;
/** Detail pages are the only unbounded cache group, so cap them. */
const DETAIL_PREFIX = `${PREFIX}detail:`;
const MAX_DETAIL_ENTRIES = 80;

export type CacheEntry<T> = { savedAt: number; value: T };

export function readCache<T>(key: string): CacheEntry<T> | undefined {
  try {
    const raw = getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as CacheEntry<T>) : undefined;
  } catch {
    return undefined;
  }
}

export function writeCache<T>(key: string, value: T): number {
  const savedAt = Date.now();
  try {
    setItem(PREFIX + key, JSON.stringify({ savedAt, value }));
    if ((PREFIX + key).startsWith(DETAIL_PREFIX)) {
      pruneDetailCache();
    }
  } catch {
    // Cache is best-effort; never break the app because storage failed.
  }
  return savedAt;
}

function pruneDetailCache() {
  const keys = keysWithPrefix(DETAIL_PREFIX);
  if (keys.length <= MAX_DETAIL_ENTRIES) {
    return;
  }
  const dated = keys.map(k => {
    try {
      return {
        k,
        at:
          (JSON.parse(getItem(k) ?? '{}') as { savedAt?: number }).savedAt ?? 0,
      };
    } catch {
      return { k, at: 0 };
    }
  });
  dated.sort((a, b) => a.at - b.at);
  dated
    .slice(0, keys.length - MAX_DETAIL_ENTRIES)
    .forEach(d => removeItem(d.k));
}

/** Removes entries written by older cache versions. Safe to call on every launch. */
export function purgeStaleCache(): number {
  const stale = keysWithPrefix(ROOT).filter(k => !k.startsWith(PREFIX));
  stale.forEach(removeItem);
  return stale.length;
}

export function clearCache(): number {
  const keys = keysWithPrefix(ROOT);
  keys.forEach(removeItem);
  return keys.length;
}

/** "just now", "5 min ago", "3 h ago", "2 d ago". */
export function formatAgo(timestamp: number, now = Date.now()): string {
  const seconds = Math.max(0, Math.floor((now - timestamp) / 1000));
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return `${Math.floor(hours / 24)} d ago`;
}
