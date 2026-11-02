export const ANILIST_URL = 'https://graphql.anilist.co';

export class AniListError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = 'AniListError';
  }
}

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

export async function anilistQuery<T>(
  query: string,
  variables?: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(ANILIST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ query, variables }),
      signal,
    });
  } catch (e) {
    if (signal?.aborted) throw e;
    throw new AniListError('Network error. Check your connection and try again.');
  }

  const json = (await response.json().catch(() => ({}))) as GraphQLResponse<T>;

  if (!response.ok || json.errors?.length || !json.data) {
    const message = json.errors?.[0]?.message ?? `Request failed (HTTP ${response.status})`;
    throw new AniListError(message, response.status);
  }
  return json.data;
}
