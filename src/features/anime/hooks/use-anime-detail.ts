import { useAsync } from '@/hooks/use-async';
import { fetchAnimeDetail } from '@/features/anime/api/queries';

export function useAnimeDetail(id: number) {
  return useAsync(signal => fetchAnimeDetail(id, signal), [id], {
    enabled: Number.isFinite(id),
    cacheKey: `detail:${id}`,
  });
}
