import { createPersistedStore } from '@/lib/persisted-store';

const MAX_RECENT = 8;

export const searchHistoryStore = createPersistedStore(
  'animenest.search-history.v1',
  { recent: [] as string[] },
);

export const useRecentSearches = () => searchHistoryStore.useStore().recent;

/** Adds a term to the front, de-duplicating case-insensitively and capping the list. */
export function addRecentSearch(term: string) {
  const clean = term.trim();
  if (clean.length < 2) return;
  const rest = searchHistoryStore
    .get()
    .recent.filter(t => t.toLowerCase() !== clean.toLowerCase());
  searchHistoryStore.set({ recent: [clean, ...rest].slice(0, MAX_RECENT) });
}

export function clearRecentSearches() {
  searchHistoryStore.set({ recent: [] });
}
