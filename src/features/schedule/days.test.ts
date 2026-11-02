import { buildDays, itemsForDay } from '@/features/schedule/days';
import type { ScheduleItem } from '@/features/schedule/api';

describe('buildDays', () => {
  const now = new Date(2026, 10, 2, 15, 30);

  it('returns consecutive local days starting today', () => {
    const days = buildDays(7, now);
    expect(days).toHaveLength(7);
    expect(days[0].label).toBe('Today');
    expect(days[1].label).toBe('Tomorrow');
    for (let i = 1; i < days.length; i++) {
      expect(days[i].start).toBe(days[i - 1].end);
    }
  });
});

describe('itemsForDay', () => {
  it('keeps only episodes airing inside the day window', () => {
    const [today] = buildDays(1, new Date(2026, 10, 2, 9, 0));
    const make = (airingAt: number) => ({ airingAt } as ScheduleItem);
    const inside = make(today.start + 3600);
    const before = make(today.start - 1);
    const after = make(today.end);
    expect(itemsForDay([before, inside, after], today)).toEqual([inside]);
  });
});
