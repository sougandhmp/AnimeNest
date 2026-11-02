import { useAsync } from '@/hooks/use-async';
import { fetchSchedule } from '@/features/schedule/api';
import { buildDays } from '@/features/schedule/days';

export function useSchedule(dayCount = 7) {
  return useAsync(
    async signal => {
      const days = buildDays(dayCount);
      const items = await fetchSchedule(
        days[0].start,
        days[days.length - 1].end,
        signal,
      );
      // Captured at fetch time (not render time) so "Aired" labels stay pure and stable.
      return { items, fetchedAt: Math.floor(Date.now() / 1000) };
    },
    [dayCount],
  );
}
