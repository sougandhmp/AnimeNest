import { anilistQuery } from '@/features/anime/api/client';
import { getCategory, type CategoryId } from '@/features/anime/categories';
import { currentSeason } from '@/features/anime/format';
import type {
  AnimeDetail,
  AnimeSummary,
  PosterItem,
  Title,
} from '@/features/anime/types';

const CARD_FIELDS = /* GraphQL */ `
  fragment CardFields on Media {
    id
    title {
      romaji
      english
      native
    }
    coverImage {
      large
      extraLarge
      color
    }
    bannerImage
    averageScore
    episodes
    duration
    format
    status
    season
    seasonYear
    genres
    description(asHtml: false)
    studios(isMain: true) {
      nodes {
        name
      }
    }
    trailer {
      id
      site
    }
  }
`;

export type HomeFeed = {
  trending: AnimeSummary[];
  airing: AnimeSummary[];
  popular: AnimeSummary[];
  popularSeason: PosterItem[];
  topRated: PosterItem[];
  topMovies: PosterItem[];
  upcoming: PosterItem[];
  recentlyFinished: PosterItem[];
};

const POSTER_FIELDS = /* GraphQL */ `
  fragment PosterFields on Media {
    id
    title {
      romaji
      english
      native
    }
    coverImage {
      large
      color
    }
    averageScore
  }
`;

const HOME_QUERY = /* GraphQL */ `
  query Home($season: MediaSeason, $year: Int) {
    trending: Page(perPage: 8) {
      media(
        type: ANIME
        season: $season
        seasonYear: $year
        sort: TRENDING_DESC
        isAdult: false
      ) {
        ...CardFields
      }
    }
    airing: Page(perPage: 15) {
      media(
        type: ANIME
        status: RELEASING
        sort: POPULARITY_DESC
        isAdult: false
      ) {
        ...CardFields
      }
    }
    popular: Page(perPage: 15) {
      media(type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
        ...CardFields
      }
    }
    popularSeason: Page(perPage: 15) {
      media(
        type: ANIME
        season: $season
        seasonYear: $year
        sort: POPULARITY_DESC
        isAdult: false
      ) {
        ...PosterFields
      }
    }
    topRated: Page(perPage: 15) {
      media(type: ANIME, sort: SCORE_DESC, isAdult: false) {
        ...PosterFields
      }
    }
    topMovies: Page(perPage: 15) {
      media(type: ANIME, format: MOVIE, sort: SCORE_DESC, isAdult: false) {
        ...PosterFields
      }
    }
    upcoming: Page(perPage: 15) {
      media(
        type: ANIME
        status: NOT_YET_RELEASED
        sort: POPULARITY_DESC
        isAdult: false
      ) {
        ...PosterFields
      }
    }
    recentlyFinished: Page(perPage: 15) {
      media(
        type: ANIME
        status: FINISHED
        format_in: [TV, MOVIE, ONA, OVA]
        sort: END_DATE_DESC
        isAdult: false
      ) {
        ...PosterFields
      }
    }
  }
  ${CARD_FIELDS}
  ${POSTER_FIELDS}
`;

export async function fetchHomeFeed(signal?: AbortSignal): Promise<HomeFeed> {
  const { season, year } = currentSeason();
  const data = await anilistQuery<{
    trending: { media: AnimeSummary[] };
    airing: { media: AnimeSummary[] };
    popular: { media: AnimeSummary[] };
    popularSeason: { media: PosterItem[] };
    topRated: { media: PosterItem[] };
    topMovies: { media: PosterItem[] };
    upcoming: { media: PosterItem[] };
    recentlyFinished: { media: PosterItem[] };
  }>(HOME_QUERY, { season, year }, signal);
  return {
    trending: data.trending.media,
    airing: data.airing.media,
    popular: data.popular.media,
    popularSeason: data.popularSeason.media,
    topRated: data.topRated.media,
    topMovies: data.topMovies.media,
    upcoming: data.upcoming.media,
    recentlyFinished: data.recentlyFinished.media,
  };
}

export type SearchSort =
  | 'POPULARITY_DESC'
  | 'TRENDING_DESC'
  | 'SCORE_DESC'
  | 'START_DATE_DESC';
export type SearchSeason = 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL';
export type SearchStatus = 'RELEASING' | 'FINISHED' | 'NOT_YET_RELEASED';

export type SearchFilter = {
  format?: 'TV' | 'MOVIE';
  topRated?: boolean;
  genre?: string;
  season?: SearchSeason;
  year?: number;
  status?: SearchStatus;
  /** Overrides the default ordering. */
  sort?: SearchSort;
};

const SEARCH_QUERY = /* GraphQL */ `
  query Search(
    $search: String
    $format: MediaFormat
    $genre: String
    $season: MediaSeason
    $seasonYear: Int
    $status: MediaStatus
    $sort: [MediaSort]
  ) {
    Page(perPage: 25) {
      media(
        type: ANIME
        search: $search
        format: $format
        genre: $genre
        season: $season
        seasonYear: $seasonYear
        status: $status
        sort: $sort
        isAdult: false
      ) {
        ...CardFields
      }
    }
  }
  ${CARD_FIELDS}
`;

/** GraphQL variables for a search; exported so the ordering rules can be tested. */
export function searchVariables(search: string, filter: SearchFilter) {
  const term = search.trim();
  const sort = filter.sort
    ? [filter.sort]
    : filter.topRated
    ? ['SCORE_DESC']
    : term
    ? ['SEARCH_MATCH', 'POPULARITY_DESC']
    : ['POPULARITY_DESC'];
  return {
    search: term || undefined,
    format: filter.format,
    genre: filter.genre,
    season: filter.season,
    seasonYear: filter.year,
    status: filter.status,
    sort,
  };
}

export async function searchAnime(
  search: string,
  filter: SearchFilter,
  signal?: AbortSignal,
): Promise<AnimeSummary[]> {
  const data = await anilistQuery<{ Page: { media: AnimeSummary[] } }>(
    SEARCH_QUERY,
    searchVariables(search, filter),
    signal,
  );
  return data.Page.media;
}

const RANDOM_QUERY = /* GraphQL */ `
  query Random($page: Int) {
    Page(page: $page, perPage: 1) {
      media(
        type: ANIME
        sort: POPULARITY_DESC
        averageScore_greater: 65
        isAdult: false
      ) {
        id
      }
    }
  }
`;

/** Id of a random well-rated anime (picked from the ~200 most popular pages). */
export async function fetchRandomAnimeId(
  signal?: AbortSignal,
): Promise<number | undefined> {
  const pick = async (page: number) =>
    (
      await anilistQuery<{ Page: { media: { id: number }[] } }>(
        RANDOM_QUERY,
        { page },
        signal,
      )
    ).Page.media[0]?.id;
  const page = Math.floor(Math.random() * 200) + 1;
  return (await pick(page)) ?? (await pick(1));
}

const DETAIL_QUERY = /* GraphQL */ `
  query Detail($id: Int) {
    Media(id: $id, type: ANIME) {
      ...CardFields
      title {
        romaji
        english
        native
      }
      source
      popularity
      allStudios: studios {
        nodes {
          id
          name
          isAnimationStudio
        }
      }
      staff(perPage: 12, sort: RELEVANCE) {
        edges {
          role
          node {
            id
            name {
              full
            }
            image {
              large
            }
          }
        }
      }
      externalLinks {
        id
        url
        site
        type
      }
      reviews(limit: 6, sort: RATING_DESC) {
        nodes {
          id
          summary
          score
          rating
          ratingAmount
          user {
            name
            avatar {
              medium
            }
          }
        }
      }
      nextAiringEpisode {
        episode
        airingAt
        timeUntilAiring
      }
      rankings {
        rank
        type
        allTime
        context
      }
      characters(sort: ROLE, perPage: 12) {
        edges {
          role
          node {
            id
            name {
              full
            }
            image {
              large
            }
          }
          voiceActors(language: JAPANESE) {
            id
            name {
              full
            }
            image {
              large
            }
          }
        }
      }
      relations {
        edges {
          relationType(version: 2)
          node {
            id
            type
            format
            status
            title {
              romaji
              english
              native
            }
            coverImage {
              large
            }
          }
        }
      }
      recommendations(sort: RATING_DESC, perPage: 10) {
        nodes {
          mediaRecommendation {
            id
            title {
              romaji
              english
              native
            }
            coverImage {
              large
            }
            averageScore
          }
        }
      }
    }
  }
  ${CARD_FIELDS}
`;

export async function fetchAnimeDetail(
  id: number,
  signal?: AbortSignal,
): Promise<AnimeDetail> {
  const data = await anilistQuery<{ Media: AnimeDetail }>(
    DETAIL_QUERY,
    { id },
    signal,
  );
  return data.Media;
}

const CATEGORY_QUERY = /* GraphQL */ `
  query Category(
    $page: Int
    $sort: [MediaSort]
    $status: MediaStatus
    $formats: [MediaFormat]
    $season: MediaSeason
    $year: Int
  ) {
    Page(page: $page, perPage: 21) {
      pageInfo {
        hasNextPage
      }
      media(
        type: ANIME
        sort: $sort
        status: $status
        format_in: $formats
        season: $season
        seasonYear: $year
        isAdult: false
      ) {
        ...PosterFields
      }
    }
  }
  ${POSTER_FIELDS}
`;

export type CategoryPage = { items: PosterItem[]; hasNext: boolean };

/** One page (21 items) of a Home category, for the "See all" list. */
export async function fetchCategoryPage(
  id: CategoryId,
  page: number,
  signal?: AbortSignal,
): Promise<CategoryPage> {
  const { filter } = getCategory(id);
  const { season, year } = currentSeason();
  const data = await anilistQuery<{
    Page: { pageInfo: { hasNextPage: boolean }; media: PosterItem[] };
  }>(
    CATEGORY_QUERY,
    {
      page,
      sort: filter.sort,
      status: filter.status,
      formats: filter.formats,
      season: filter.seasonal ? season : undefined,
      year: filter.seasonal ? year : undefined,
    },
    signal,
  );
  return { items: data.Page.media, hasNext: data.Page.pageInfo.hasNextPage };
}

// ---------- Character, staff and studio pages ----------

export type EntityPage = {
  id: number;
  name: string;
  nativeName: string | null;
  image: string | null;
  facts: string[];
  description: string | null;
  favourites: number | null;
  items: PosterItem[];
};

const CHARACTER_QUERY = /* GraphQL */ `
  query Character($id: Int) {
    Character(id: $id) {
      id
      name {
        full
        native
      }
      image {
        large
      }
      description(asHtml: false)
      gender
      age
      dateOfBirth {
        month
        day
      }
      favourites
      media(type: ANIME, sort: POPULARITY_DESC, perPage: 24) {
        nodes {
          ...PosterFields
        }
      }
    }
  }
  ${POSTER_FIELDS}
`;

const STAFF_QUERY = /* GraphQL */ `
  query Staff($id: Int) {
    Staff(id: $id) {
      id
      name {
        full
        native
      }
      image {
        large
      }
      description(asHtml: false)
      primaryOccupations
      yearsActive
      homeTown
      favourites
      staffMedia(type: ANIME, sort: POPULARITY_DESC, perPage: 24) {
        nodes {
          ...PosterFields
        }
      }
    }
  }
  ${POSTER_FIELDS}
`;

const STUDIO_QUERY = /* GraphQL */ `
  query Studio($id: Int) {
    Studio(id: $id) {
      id
      name
      favourites
      media(sort: POPULARITY_DESC, perPage: 24) {
        nodes {
          ...PosterFields
        }
      }
    }
  }
  ${POSTER_FIELDS}
`;

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export async function fetchCharacter(
  id: number,
  signal?: AbortSignal,
): Promise<EntityPage> {
  const { Character: c } = await anilistQuery<{
    Character: {
      id: number;
      name: { full: string; native: string | null };
      image: { large: string | null };
      description: string | null;
      gender: string | null;
      age: string | null;
      dateOfBirth: { month: number | null; day: number | null } | null;
      favourites: number | null;
      media: { nodes: PosterItem[] };
    };
  }>(CHARACTER_QUERY, { id }, signal);
  const birthday =
    c.dateOfBirth?.month && c.dateOfBirth.day
      ? `Birthday: ${MONTHS[c.dateOfBirth.month - 1]} ${c.dateOfBirth.day}`
      : null;
  return {
    id: c.id,
    name: c.name.full,
    nativeName: c.name.native,
    image: c.image.large,
    facts: [
      c.gender && `Gender: ${c.gender}`,
      c.age && `Age: ${c.age}`,
      birthday,
    ].filter((f): f is string => !!f),
    description: c.description,
    favourites: c.favourites,
    items: c.media.nodes,
  };
}

export async function fetchStaff(
  id: number,
  signal?: AbortSignal,
): Promise<EntityPage> {
  const { Staff: s } = await anilistQuery<{
    Staff: {
      id: number;
      name: { full: string; native: string | null };
      image: { large: string | null };
      description: string | null;
      primaryOccupations: string[] | null;
      yearsActive: number[] | null;
      homeTown: string | null;
      favourites: number | null;
      staffMedia: { nodes: PosterItem[] };
    };
  }>(STAFF_QUERY, { id }, signal);
  const years = s.yearsActive?.length
    ? `Active: ${s.yearsActive[0]}–${s.yearsActive[1] ?? 'present'}`
    : null;
  return {
    id: s.id,
    name: s.name.full,
    nativeName: s.name.native,
    image: s.image.large,
    facts: [
      s.primaryOccupations?.length ? s.primaryOccupations.join(', ') : null,
      s.homeTown && `From: ${s.homeTown}`,
      years,
    ].filter((f): f is string => !!f),
    description: s.description,
    favourites: s.favourites,
    items: s.staffMedia.nodes,
  };
}

export async function fetchStudio(
  id: number,
  signal?: AbortSignal,
): Promise<EntityPage> {
  const { Studio: s } = await anilistQuery<{
    Studio: {
      id: number;
      name: string;
      favourites: number | null;
      media: { nodes: PosterItem[] };
    };
  }>(STUDIO_QUERY, { id }, signal);
  return {
    id: s.id,
    name: s.name,
    nativeName: null,
    image: null,
    facts: [],
    description: null,
    favourites: s.favourites,
    items: s.media.nodes,
  };
}

// ---------- Details for older watchlist entries ----------

const ENTRY_DETAILS_QUERY = /* GraphQL */ `
  query EntryDetails($ids: [Int]) {
    Page(perPage: 50) {
      media(id_in: $ids, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        genres
        duration
      }
    }
  }
`;

export type EntryDetails = {
  id: number;
  title: Title;
  genres: string[];
  duration: number | null;
};

/** Genres and episode length for up to 50 anime ids. */
export async function fetchEntryDetails(
  ids: number[],
  signal?: AbortSignal,
): Promise<EntryDetails[]> {
  const data = await anilistQuery<{ Page: { media: EntryDetails[] } }>(
    ENTRY_DETAILS_QUERY,
    { ids: ids.slice(0, 50) },
    signal,
  );
  return data.Page.media;
}
