import { sortEntries } from '@/features/watchlist/sort';
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

const ids = (list: WatchEntry[]) => list.map(e => e.id);

describe('sortEntries', () => {
  it('sorts by most recently added first', () => {
    const list = [
      entry({ id: 1, addedAt: 10 }),
      entry({ id: 2, addedAt: 30 }),
      entry({ id: 3, addedAt: 20 }),
    ];
    expect(ids(sortEntries(list, 'recent'))).toEqual([2, 3, 1]);
  });

  it('sorts titles alphabetically using the supplied title function', () => {
    const list = [
      entry({ id: 1, title: 'Zebra' }),
      entry({ id: 2, title: 'Apple' }),
    ];
    expect(ids(sortEntries(list, 'title'))).toEqual([2, 1]);
    // Honours the title-language override.
    expect(
      ids(sortEntries(list, 'title', e => (e.id === 1 ? 'A' : 'B'))),
    ).toEqual([1, 2]);
  });

  it('sorts by your score, then the AniList average, with unscored last', () => {
    const list = [
      entry({ id: 1, averageScore: 90 }),
      entry({ id: 2, score: 6, averageScore: 50 }),
      entry({ id: 3, score: 9, averageScore: 40 }),
      entry({ id: 4, averageScore: 95 }),
    ];
    expect(ids(sortEntries(list, 'score'))).toEqual([3, 2, 4, 1]);
  });

  it('sorts by completion percentage', () => {
    const list = [
      entry({ id: 1, progress: 3, episodes: 12 }),
      entry({ id: 2, progress: 10, episodes: 12 }),
      entry({ id: 3, progress: 5, episodes: null }),
    ];
    expect(ids(sortEntries(list, 'progress'))).toEqual([2, 1, 3]);
  });

  it('does not mutate its input', () => {
    const list = [entry({ id: 1, addedAt: 1 }), entry({ id: 2, addedAt: 2 })];
    sortEntries(list, 'recent');
    expect(ids(list)).toEqual([1, 2]);
  });
});
