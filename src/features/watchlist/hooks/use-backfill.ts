import { useEffect } from 'react';

import { fetchEntryDetails } from '@/features/anime/api/queries';
import { useWatchlist } from '@/features/watchlist/hooks/use-watchlist';
import { entriesNeedingDetails } from '@/features/watchlist/stats';
import { patchEntries } from '@/features/watchlist/store';

/**
 * Fills in titles, genres and episode length for entries saved by older versions of the app,
 * so the stats are complete. Runs once per set of missing ids; failures are ignored
 * (it simply tries again next time).
 */
export function useBackfillEntries() {
  const entries = useWatchlist();
  const missing = entriesNeedingDetails(entries).join(',');

  useEffect(() => {
    if (!missing) {
      return;
    }
    const controller = new AbortController();
    fetchEntryDetails(missing.split(',').map(Number), controller.signal)
      .then(details => {
        const patches: Parameters<typeof patchEntries>[0] = {};
        details.forEach(d => {
          patches[d.id] = {
            genres: d.genres,
            duration: d.duration,
            titles: d.title,
          };
        });
        patchEntries(patches);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [missing]);
}
