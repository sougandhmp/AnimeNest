import { anilistQuery } from '@/features/anime/api/client';
import { currentSeason } from '@/features/anime/format';
import type { AnimeDetail, AnimeSummary } from '@/features/anime/types';

const CARD_FIELDS = /* GraphQL */ `
  fragment CardFields on Media {
    id
    title {
      romaji
      english
    }
    coverImage {
      large
      extraLarge
      color
    }
    bannerImage
    averageScore
    episodes
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
};

const HOME_QUERY = /* GraphQL */ `
  query Home($season: MediaSeason, $year: Int) {
    trending: Page(perPage: 8) {
      media(type: ANIME, season: $season, seasonYear: $year, sort: TRENDING_DESC, isAdult: false) {
        ...CardFields
      }
    }
    airing: Page(perPage: 15) {
      media(type: ANIME, status: RELEASING, sort: POPULARITY_DESC, isAdult: false) {
        ...CardFields
      }
    }
    popular: Page(perPage: 15) {
      media(type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
        ...CardFields
      }
    }
  }
  ${CARD_FIELDS}
`;

export async function fetchHomeFeed(signal?: AbortSignal): Promise<HomeFeed> {
  const { season, year } = currentSeason();
  const data = await anilistQuery<{
    trending: { media: AnimeSummary[] };
    airing: { media: AnimeSummary[] };
    popular: { media: AnimeSummary[] };
  }>(HOME_QUERY, { season, year }, signal);
  return {
    trending: data.trending.media,
    airing: data.airing.media,
    popular: data.popular.media,
  };
}

export type SearchFilter = { format?: 'TV' | 'MOVIE'; topRated?: boolean; genre?: string };

const SEARCH_QUERY = /* GraphQL */ `
  query Search($search: String, $format: MediaFormat, $genre: String, $sort: [MediaSort]) {
    Page(perPage: 25) {
      media(type: ANIME, search: $search, format: $format, genre: $genre, sort: $sort, isAdult: false) {
        ...CardFields
      }
    }
  }
  ${CARD_FIELDS}
`;

export async function searchAnime(
  search: string,
  filter: SearchFilter,
  signal?: AbortSignal,
): Promise<AnimeSummary[]> {
  const term = search.trim();
  const sort = filter.topRated
    ? ['SCORE_DESC']
    : term
      ? ['SEARCH_MATCH', 'POPULARITY_DESC']
      : ['POPULARITY_DESC'];
  const data = await anilistQuery<{ Page: { media: AnimeSummary[] } }>(
    SEARCH_QUERY,
    { search: term || undefined, format: filter.format, genre: filter.genre, sort },
    signal,
  );
  return data.Page.media;
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
            }
            coverImage {
              large
            }
          }
        }
      }
    }
  }
  ${CARD_FIELDS}
`;

export async function fetchAnimeDetail(id: number, signal?: AbortSignal): Promise<AnimeDetail> {
  const data = await anilistQuery<{ Media: AnimeDetail }>(DETAIL_QUERY, { id }, signal);
  return data.Media;
}
