import type { ScheduleItem } from '@/features/schedule/api';

export type ScheduleDay = { key: string; label: string; start: number; end: number };

const DAY_SECONDS = 86400;

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** The next `count` local days starting today. */
export function buildDays(count = 7, now = new Date()): ScheduleDay[] {
  const today = startOfDay(now);
  return Array.from({ length: count }, (_, i) => {
    const day = new Date(today);
    day.setDate(today.getDate() + i);
    const next = new Date(day);
    next.setDate(day.getDate() + 1);
    const label =
      i === 0
        ? 'Today'
        : i === 1
          ? 'Tomorrow'
          : day.toLocaleDateString([], { weekday: 'short', day: 'numeric' });
    return {
      key: day.toDateString(),
      label,
      start: Math.floor(day.getTime() / 1000),
      end: Math.floor(next.getTime() / 1000),
    };
  });
}

export function itemsForDay(items: ScheduleItem[], day: ScheduleDay): ScheduleItem[] {
  return items.filter((i) => i.airingAt >= day.start && i.airingAt < day.end);
}

export { DAY_SECONDS };
