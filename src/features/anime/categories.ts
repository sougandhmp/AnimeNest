export type CategoryId =
  | 'trending'
  | 'airing'
  | 'popularSeason'
  | 'popular'
  | 'topRated'
  | 'topMovies'
  | 'upcoming'
  | 'recentlyFinished';

export type CategoryDef = {
  id: CategoryId;
  title: string;
  /** Show #1, #2... instead of the rating. */
  ranked?: boolean;
  /** Hide the rating badge (unreleased titles have no score). */
  hideRating?: boolean;
  /** AniList filters used by the "See all" list. */
  filter: {
    sort: string[];
    status?: string;
    formats?: string[];
    /** Restrict to the current season. */
    seasonal?: boolean;
  };
};

export const CATEGORIES: CategoryDef[] = [
  {
    id: 'trending',
    title: 'Trending this season',
    filter: { sort: ['TRENDING_DESC'], seasonal: true },
  },
  {
    id: 'airing',
    title: 'Top airing now',
    filter: { sort: ['POPULARITY_DESC'], status: 'RELEASING' },
  },
  {
    id: 'popularSeason',
    title: 'Popular this season',
    filter: { sort: ['POPULARITY_DESC'], seasonal: true },
  },
  {
    id: 'popular',
    title: 'All-time popular',
    ranked: true,
    filter: { sort: ['POPULARITY_DESC'] },
  },
  { id: 'topRated', title: 'Top rated', filter: { sort: ['SCORE_DESC'] } },
  {
    id: 'topMovies',
    title: 'Top movies',
    filter: { sort: ['SCORE_DESC'], formats: ['MOVIE'] },
  },
  {
    id: 'upcoming',
    title: 'Coming soon',
    hideRating: true,
    filter: { sort: ['POPULARITY_DESC'], status: 'NOT_YET_RELEASED' },
  },
  {
    id: 'recentlyFinished',
    title: 'Recently finished',
    filter: {
      sort: ['END_DATE_DESC'],
      status: 'FINISHED',
      formats: ['TV', 'MOVIE', 'ONA', 'OVA'],
    },
  },
];

export function getCategory(id: CategoryId): CategoryDef {
  return CATEGORIES.find(c => c.id === id) ?? CATEGORIES[0];
}
