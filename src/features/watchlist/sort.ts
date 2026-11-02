import type { LibrarySort } from '@/features/settings/store';
import type { WatchEntry } from '@/features/watchlist/store';

export const SORT_LABEL: Record<LibrarySort, string> = {
  recent: 'Recently added',
  title: 'A–Z',
  score: 'Score',
  progress: 'Progress',
};

function completion(e: WatchEntry): number {
  return e.episodes ? e.progress / e.episodes : 0;
}

/** Returns a new, sorted array. `titleOf` lets the caller honour the title-language setting. */
export function sortEntries(
  entries: WatchEntry[],
  sort: LibrarySort,
  titleOf: (e: WatchEntry) => string = e => e.title,
): WatchEntry[] {
  const list = [...entries];
  switch (sort) {
    case 'title':
      return list.sort((a, b) => titleOf(a).localeCompare(titleOf(b)));
    case 'score':
      // Your own score first, then the AniList average; unrated last.
      return list.sort(
        (a, b) =>
          (b.score ?? 0) - (a.score ?? 0) ||
          (b.averageScore ?? 0) - (a.averageScore ?? 0),
      );
    case 'progress':
      return list.sort((a, b) => completion(b) - completion(a));
    case 'recent':
    default:
      return list.sort((a, b) => b.addedAt - a.addedAt);
  }
}
