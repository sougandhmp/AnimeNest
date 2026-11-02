import {
  cleanDescription,
  currentSeason,
  formatCountdown,
  formatScore,
  trailerUrl,
} from '@/features/anime/format';

describe('formatScore', () => {
  it('shows one decimal on a 0-10 scale', () => {
    expect(formatScore(87)).toBe('8.7');
    expect(formatScore(60)).toBe('6.0');
  });

  it('treats null, undefined and 0 as unrated', () => {
    expect(formatScore(null)).toBeNull();
    expect(formatScore(undefined)).toBeNull();
    expect(formatScore(0)).toBeNull();
  });
});

describe('formatCountdown', () => {
  it('uses days and hours for long waits', () => {
    expect(formatCountdown(2 * 86400 + 4 * 3600)).toBe('2d 4h');
  });

  it('uses hours and minutes under a day', () => {
    expect(formatCountdown(3 * 3600 + 20 * 60)).toBe('3h 20m');
  });

  it('never shows 0 minutes', () => {
    expect(formatCountdown(10)).toBe('1m');
  });
});

describe('cleanDescription', () => {
  it('strips tags and decodes common entities', () => {
    expect(cleanDescription('A<br>B &amp; <i>C</i> &quot;D&quot;')).toBe(
      'A\nB & C "D"',
    );
  });

  it('has a fallback for missing text', () => {
    expect(cleanDescription(null)).toBe('No synopsis available.');
  });
});

describe('currentSeason', () => {
  it('maps months to seasons', () => {
    expect(currentSeason(new Date(2026, 0, 15)).season).toBe('WINTER');
    expect(currentSeason(new Date(2026, 4, 15)).season).toBe('SPRING');
    expect(currentSeason(new Date(2026, 7, 15)).season).toBe('SUMMER');
    expect(currentSeason(new Date(2026, 10, 15)).season).toBe('FALL');
  });
});

describe('trailerUrl', () => {
  it('builds youtube links and ignores unknown sites', () => {
    expect(trailerUrl({ id: 'abc', site: 'youtube' })).toBe(
      'https://www.youtube.com/watch?v=abc',
    );
    expect(trailerUrl({ id: 'abc', site: 'vimeo' })).toBeNull();
    expect(trailerUrl(null)).toBeNull();
  });
});
