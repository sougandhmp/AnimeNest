import type { WatchEntry, WatchStatus } from '@/features/watchlist/store';

/** Used when an anime's episode length is unknown (typical TV episode). */
export const DEFAULT_EPISODE_MINUTES = 24;

export type GenreCount = { genre: string; count: number };

export type WatchStats = {
  total: number;
  byStatus: Record<WatchStatus, number>;
  episodesWatched: number;
  minutesWatched: number;
  /** Average of the scores you gave (1-10), or null if you haven't scored anything. */
  meanScore: number | null;
  topGenres: GenreCount[];
};

export function computeStats(entries: WatchEntry[], topN = 5): WatchStats {
  const byStatus: Record<WatchStatus, number> = {
    WATCHING: 0,
    PLANNING: 0,
    COMPLETED: 0,
  };
  const genreCounts = new Map<string, number>();
  let episodesWatched = 0;
  let minutesWatched = 0;
  const scores: number[] = [];

  for (const e of entries) {
    byStatus[e.status] += 1;
    episodesWatched += e.progress;
    minutesWatched += e.progress * (e.duration ?? DEFAULT_EPISODE_MINUTES);
    if (e.score) {
      scores.push(e.score);
    }
    for (const g of e.genres ?? []) {
      genreCounts.set(g, (genreCounts.get(g) ?? 0) + 1);
    }
  }

  const topGenres = [...genreCounts.entries()]
    .map(([genre, count]) => ({ genre, count }))
    // Most common first; alphabetical to keep ties stable.
    .sort((a, b) => b.count - a.count || a.genre.localeCompare(b.genre))
    .slice(0, topN);

  return {
    total: entries.length,
    byStatus,
    episodesWatched,
    minutesWatched,
    meanScore: scores.length
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : null,
    topGenres,
  };
}

/** "45m", "3h 20m", "2d 5h". */
export function formatWatchTime(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)}m`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    const rest = Math.round(minutes % 60);
    return rest ? `${hours}h ${rest}m` : `${hours}h`;
  }
  const days = Math.floor(hours / 24);
  const restHours = hours % 24;
  return restHours ? `${days}d ${restHours}h` : `${days}d`;
}

/** Entries saved before genres/duration were stored need a one-time lookup. */
export function entriesNeedingDetails(entries: WatchEntry[]): number[] {
  return entries
    .filter(
      e =>
        e.genres === undefined ||
        e.duration === undefined ||
        e.titles === undefined,
    )
    .map(e => e.id);
}
