import {
  computeStats,
  DEFAULT_EPISODE_MINUTES,
  entriesNeedingDetails,
  formatWatchTime,
} from '@/features/watchlist/stats';
import type { WatchEntry } from '@/features/watchlist/store';

const entry = (over: Partial<WatchEntry>): WatchEntry => ({
  id: 1,
  title: 'A',
  cover: null,
  format: 'TV',
  episodes: 12,
  averageScore: 70,
  status: 'WATCHING',
  progress: 0,
  addedAt: 0,
  ...over,
});

describe('computeStats', () => {
  it('handles an empty watchlist', () => {
    const s = computeStats([]);
    expect(s.total).toBe(0);
    expect(s.meanScore).toBeNull();
    expect(s.topGenres).toEqual([]);
    expect(s.minutesWatched).toBe(0);
  });

  it('counts statuses, episodes and watch time', () => {
    const s = computeStats([
      entry({ id: 1, status: 'WATCHING', progress: 5, duration: 24 }),
      entry({ id: 2, status: 'COMPLETED', progress: 12, duration: 30 }),
      entry({ id: 3, status: 'PLANNING', progress: 0 }),
    ]);
    expect(s.byStatus).toEqual({ WATCHING: 1, PLANNING: 1, COMPLETED: 1 });
    expect(s.episodesWatched).toBe(17);
    expect(s.minutesWatched).toBe(5 * 24 + 12 * 30);
  });

  it('assumes a default episode length when it is unknown', () => {
    const s = computeStats([entry({ progress: 2, duration: null })]);
    expect(s.minutesWatched).toBe(2 * DEFAULT_EPISODE_MINUTES);
  });

  it('averages only the scores you gave', () => {
    const s = computeStats([
      entry({ id: 1, score: 8 }),
      entry({ id: 2, score: 6 }),
      entry({ id: 3 }),
    ]);
    expect(s.meanScore).toBe(7);
  });

  it('ranks genres by count with stable ordering and a cap', () => {
    const s = computeStats(
      [
        entry({ id: 1, genres: ['Action', 'Drama'] }),
        entry({ id: 2, genres: ['Action', 'Comedy'] }),
        entry({ id: 3, genres: ['Comedy'] }),
      ],
      2,
    );
    expect(s.topGenres).toEqual([
      { genre: 'Action', count: 2 },
      { genre: 'Comedy', count: 2 },
    ]);
  });
});

describe('formatWatchTime', () => {
  it.each([
    [0, '0m'],
    [45, '45m'],
    [60, '1h'],
    [200, '3h 20m'],
    [24 * 60, '1d'],
    [(2 * 24 + 5) * 60, '2d 5h'],
  ])('%i minutes -> %s', (minutes, expected) => {
    expect(formatWatchTime(minutes)).toBe(expected);
  });
});

describe('entriesNeedingDetails', () => {
  it('lists entries missing genres or duration', () => {
    const list = [
      entry({ id: 1 }),
      entry({
        id: 2,
        genres: [],
        duration: null,
        titles: { romaji: 'x', english: null },
      }),
      entry({ id: 3, genres: ['Action'] }),
    ];
    expect(entriesNeedingDetails(list)).toEqual([1, 3]);
  });
});
