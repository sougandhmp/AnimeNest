import { useAsync } from '@/hooks/use-async';
import { fetchHomeFeed } from '@/features/anime/api/queries';

export function useHomeFeed() {
  return useAsync(fetchHomeFeed, [], { cacheKey: 'home' });
}
