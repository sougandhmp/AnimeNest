import { getItem, setItem } from '@/lib/storage';

import { displayTitle } from '@/features/anime/format';
import type { AnimeSummary, Title } from '@/features/anime/types';

export type WatchStatus = 'WATCHING' | 'PLANNING' | 'COMPLETED';

export const STATUS_LABEL: Record<WatchStatus, string> = {
  WATCHING: 'Watching',
  PLANNING: 'Plan to Watch',
  COMPLETED: 'Completed',
};

export type WatchEntry = {
  id: number;
  title: string;
  cover: string | null;
  format: string | null;
  episodes: number | null;
  averageScore: number | null;
  status: WatchStatus;
  progress: number;
  addedAt: number;
  /** Raw titles, so the list follows the title-language setting. Older entries only have `title`. */
  titles?: Title;
  genres?: string[];
  /** Minutes per episode. */
  duration?: number | null;
  /** Your own score, 1-10. */
  score?: number;
  note?: string;
};

const KEY = 'animenest.watchlist.v1';
const listeners = new Set<() => void>();
let cache: { raw: string | null; entries: WatchEntry[] } | null = null;

export function getWatchlist(): WatchEntry[] {
  let raw: string | null = null;
  try {
    raw = getItem(KEY);
  } catch {
    return cache?.entries ?? [];
  }
  if (cache && cache.raw === raw) return cache.entries;
  let entries: WatchEntry[] = [];
  try {
    entries = raw ? (JSON.parse(raw) as WatchEntry[]) : [];
  } catch {
    entries = [];
  }
  cache = { raw, entries };
  return entries;
}

function write(entries: WatchEntry[]) {
  const raw = JSON.stringify(entries);
  try {
    setItem(KEY, raw);
  } catch {
    // Storage unavailable: keep the in-memory copy so the session still works.
  }
  cache = { raw, entries };
  listeners.forEach(l => l());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setStatus(anime: AnimeSummary, status: WatchStatus) {
  const entries = getWatchlist();
  const existing = entries.find(e => e.id === anime.id);
  const total = anime.episodes;
  const progress =
    status === 'COMPLETED' && total
      ? total
      : status === 'PLANNING'
      ? 0
      : existing?.progress ?? 0;
  if (existing) {
    write(
      entries.map(e => (e.id === anime.id ? { ...e, status, progress } : e)),
    );
  } else {
    write([
      {
        id: anime.id,
        title: displayTitle(anime.title),
        titles: anime.title,
        genres: anime.genres,
        duration: anime.duration,
        cover: anime.coverImage.large,
        format: anime.format,
        episodes: anime.episodes,
        averageScore: anime.averageScore,
        status,
        progress,
        addedAt: Date.now(),
      },
      ...entries,
    ]);
  }
}

export function addToWatchlist(anime: AnimeSummary) {
  if (!getWatchlist().some(e => e.id === anime.id))
    setStatus(anime, 'PLANNING');
}

export function removeFromWatchlist(id: number) {
  write(getWatchlist().filter(e => e.id !== id));
}

export function changeProgress(id: number, delta: number) {
  write(
    getWatchlist().map(e => {
      if (e.id !== id) return e;
      const max = e.episodes ?? Number.POSITIVE_INFINITY;
      const progress = Math.min(max, Math.max(0, e.progress + delta));
      const status: WatchStatus =
        e.episodes && progress >= e.episodes
          ? 'COMPLETED'
          : e.status === 'PLANNING' && progress > 0
          ? 'WATCHING'
          : e.status === 'COMPLETED' && progress < (e.episodes ?? 0)
          ? 'WATCHING'
          : e.status;
      return { ...e, progress, status };
    }),
  );
}

export function clearWatchlist() {
  write([]);
}

export function setScore(id: number, score: number | undefined) {
  write(getWatchlist().map(e => (e.id === id ? { ...e, score } : e)));
}

export function setNote(id: number, note: string) {
  const trimmed = note.trim();
  write(
    getWatchlist().map(e =>
      e.id === id ? { ...e, note: trimmed ? trimmed : undefined } : e,
    ),
  );
}

/** Fill in details (genres, duration) for entries saved before those were stored. */
export function patchEntries(
  patches: Record<number, Pick<WatchEntry, 'genres' | 'duration' | 'titles'>>,
) {
  const entries = getWatchlist();
  if (!entries.some(e => patches[e.id])) return;
  write(entries.map(e => (patches[e.id] ? { ...e, ...patches[e.id] } : e)));
}
