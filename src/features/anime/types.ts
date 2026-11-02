export type Title = { romaji: string | null; english: string | null };

export type AnimeSummary = {
  id: number;
  title: Title;
  coverImage: {
    large: string | null;
    extraLarge?: string | null;
    color: string | null;
  };
  bannerImage: string | null;
  averageScore: number | null;
  episodes: number | null;
  format: string | null;
  status: string | null;
  season: string | null;
  seasonYear: number | null;
  genres: string[];
  description: string | null;
  studios: { nodes: { name: string }[] };
  trailer: { id: string | null; site: string | null } | null;
};

export type Character = {
  role: string;
  node: { id: number; name: { full: string }; image: { large: string | null } };
  voiceActors: {
    id: number;
    name: { full: string };
    image: { large: string | null };
  }[];
};

export type RelatedMedia = {
  relationType: string;
  node: {
    id: number;
    type: string;
    format: string | null;
    status: string | null;
    title: Title;
    coverImage: { large: string | null };
  };
};

export type Recommendation = {
  mediaRecommendation: {
    id: number;
    title: Title;
    coverImage: { large: string | null };
  } | null;
};

export type NextAiring = {
  episode: number;
  airingAt: number;
  timeUntilAiring: number;
};

export type AnimeDetail = AnimeSummary & {
  nextAiringEpisode: NextAiring | null;
  title: Title & { native: string | null };
  source: string | null;
  popularity: number | null;
  rankings: {
    rank: number;
    type: string;
    allTime: boolean | null;
    context: string;
  }[];
  characters: { edges: Character[] };
  relations: { edges: RelatedMedia[] };
  recommendations: { nodes: Recommendation[] };
};
