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
