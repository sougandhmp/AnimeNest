import {
  clearCache,
  formatAgo,
  purgeStaleCache,
  readCache,
  writeCache,
} from '@/lib/cache';
import { setItem } from '@/lib/storage';

describe('cache', () => {
  beforeEach(() => {
    clearCache();
  });

  it('round-trips a value with a timestamp', () => {
    const before = Date.now();
    const savedAt = writeCache('home', { a: 1 });
    const entry = readCache<{ a: number }>('home');
    expect(entry?.value).toEqual({ a: 1 });
    expect(entry?.savedAt).toBe(savedAt);
    expect(savedAt).toBeGreaterThanOrEqual(before);
  });

  it('returns undefined for a missing key', () => {
    expect(readCache('nope')).toBeUndefined();
  });

  it('clears everything it wrote', () => {
    writeCache('a', 1);
    writeCache('b', 2);
    expect(clearCache()).toBe(2);
    expect(readCache('a')).toBeUndefined();
  });

  it('keeps only the most recent detail pages', () => {
    for (let i = 0; i < 90; i++) {
      writeCache(`detail:${i}`, i);
    }
    expect(readCache('detail:89')?.value).toBe(89);
    // The oldest were pruned to stay within the cap.
    expect(readCache('detail:0')).toBeUndefined();
  });
});

describe('purgeStaleCache', () => {
  it('drops entries from older cache versions but keeps current ones', () => {
    clearCache();
    setItem('cache:detail:1', '{"savedAt":1,"value":{}}');
    setItem('cache:v1:detail:2', '{"savedAt":1,"value":{}}');
    writeCache('detail:3', 3);
    expect(purgeStaleCache()).toBe(2);
    expect(readCache('detail:3')?.value).toBe(3);
  });
});

describe('formatAgo', () => {
  const now = 1_000_000_000;
  it.each([
    [now - 10_000, 'just now'],
    [now - 5 * 60_000, '5 min ago'],
    [now - 3 * 3_600_000, '3 h ago'],
    [now - 2 * 86_400_000, '2 d ago'],
  ])('%i -> %s', (ts, expected) => {
    expect(formatAgo(ts, now)).toBe(expected);
  });
});
