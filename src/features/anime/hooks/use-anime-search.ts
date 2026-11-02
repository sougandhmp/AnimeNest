import { useAsync } from '@/hooks/use-async';
import { type SearchFilter, searchAnime } from '@/features/anime/api/queries';

export function useAnimeSearch(term: string, filter: SearchFilter) {
  return useAsync(signal => searchAnime(term, filter, signal), [term, filter]);
}
