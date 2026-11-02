import { useSyncExternalStore } from 'react';

import { getWatchlist, subscribe } from '@/features/watchlist/store';

export function useWatchlist() {
  return useSyncExternalStore(subscribe, getWatchlist, getWatchlist);
}

export function useWatchEntry(id: number) {
  return useWatchlist().find((e) => e.id === id);
}
