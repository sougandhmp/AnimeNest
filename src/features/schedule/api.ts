import { anilistQuery } from '@/features/anime/api/client';
import type { Title } from '@/features/anime/types';

export type ScheduleItem = {
  id: number;
  airingAt: number;
  episode: number;
  media: {
    id: number;
    title: Title;
    coverImage: { large: string | null; color: string | null };
    format: string | null;
    episodes: number | null;
    averageScore: number | null;
    isAdult: boolean;
  };
};

const SCHEDULE_QUERY = /* GraphQL */ `
  query Schedule($from: Int, $to: Int, $page: Int) {
    Page(page: $page, perPage: 50) {
      pageInfo {
        hasNextPage
      }
      airingSchedules(airingAt_greater: $from, airingAt_lesser: $to, sort: TIME) {
        id
        airingAt
        episode
        media {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
            color
          }
          format
          episodes
          averageScore
          isAdult
        }
      }
    }
  }
`;

const MAX_PAGES = 6;

/** Episodes airing between two unix timestamps (seconds), adult titles excluded. */
export async function fetchSchedule(
  from: number,
  to: number,
  signal?: AbortSignal,
): Promise<ScheduleItem[]> {
  const items: ScheduleItem[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const data = await anilistQuery<{
      Page: { pageInfo: { hasNextPage: boolean }; airingSchedules: ScheduleItem[] };
    }>(SCHEDULE_QUERY, { from, to, page }, signal);
    items.push(...data.Page.airingSchedules);
    if (!data.Page.pageInfo.hasNextPage) break;
  }
  return items.filter((i) => !i.media.isAdult);
}
