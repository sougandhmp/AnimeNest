import type { AnimeSummary, Title } from '@/features/anime/types';

export function displayTitle(title: Title): string {
  return title.english ?? title.romaji ?? 'Untitled';
}

export function cleanDescription(html: string | null): string {
  if (!html) return 'No synopsis available.';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#039;/g, "'")
    .trim();
}

export function formatLabel(format: string | null): string | null {
  if (!format) return null;
  const map: Record<string, string> = { TV_SHORT: 'TV Short', MOVIE: 'Movie', SPECIAL: 'Special' };
  return map[format] ?? format.replace(/_/g, ' ');
}

export function titleCase(value: string | null): string {
  if (!value) return '—';
  return value
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function currentSeason(date = new Date()) {
  const m = date.getMonth();
  const season = m < 3 ? 'WINTER' : m < 6 ? 'SPRING' : m < 9 ? 'SUMMER' : 'FALL';
  return { season, year: date.getFullYear() };
}

export function trailerUrl(trailer: AnimeSummary['trailer']): string | null {
  if (!trailer?.id) return null;
  if (trailer.site === 'youtube') return `https://www.youtube.com/watch?v=${trailer.id}`;
  if (trailer.site === 'dailymotion') return `https://www.dailymotion.com/video/${trailer.id}`;
  return null;
}

export function seasonLabel(season: string | null, year: number | null): string | null {
  if (!season || !year) return null;
  return `${titleCase(season)} ${year}`;
}

export function formatCountdown(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${Math.max(m, 1)}m`;
}

export function formatAirTime(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function formatAirDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/** Genres offered in the app (AniList's adult-only genre is intentionally left out). */
export const GENRES = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Ecchi',
  'Fantasy',
  'Horror',
  'Mahou Shoujo',
  'Mecha',
  'Music',
  'Mystery',
  'Psychological',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
  'Thriller',
] as const;

/** AniList scores are 0-100; show them as 0-10 with one decimal ("8.7"). Null/0 means unrated. */
export function formatScore(score: number | null | undefined): string | null {
  if (!score) return null;
  return (score / 10).toFixed(1);
}
