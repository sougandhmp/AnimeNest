import { searchVariables } from '@/features/anime/api/queries';
import { countActiveFilters } from '@/features/anime/components/search-filters';
import {
  pickTitle,
  streamingLinks,
  trailerEmbedUrl,
} from '@/features/anime/format';

describe('searchVariables', () => {
  it('ranks by relevance when there is a search term', () => {
    expect(searchVariables('naruto', {}).sort).toEqual([
      'SEARCH_MATCH',
      'POPULARITY_DESC',
    ]);
  });

  it('falls back to popularity without a term', () => {
    expect(searchVariables('  ', {}).sort).toEqual(['POPULARITY_DESC']);
    expect(searchVariables('  ', {}).search).toBeUndefined();
  });

  it('lets an explicit sort win over the Top Rated chip', () => {
    expect(
      searchVariables('', { topRated: true, sort: 'TRENDING_DESC' }).sort,
    ).toEqual(['TRENDING_DESC']);
    expect(searchVariables('', { topRated: true }).sort).toEqual([
      'SCORE_DESC',
    ]);
  });

  it('maps filters onto GraphQL variables', () => {
    expect(
      searchVariables('', {
        genre: 'Comedy',
        format: 'TV',
        season: 'FALL',
        year: 2024,
        status: 'FINISHED',
      }),
    ).toMatchObject({
      genre: 'Comedy',
      format: 'TV',
      season: 'FALL',
      seasonYear: 2024,
      status: 'FINISHED',
    });
  });
});

describe('countActiveFilters', () => {
  it('counts only the filters that are set', () => {
    expect(countActiveFilters({})).toBe(0);
    expect(countActiveFilters({ year: 2020, sort: 'SCORE_DESC' })).toBe(2);
  });
});

describe('pickTitle', () => {
  const title = {
    romaji: 'Shingeki no Kyojin',
    english: 'Attack on Titan',
    native: '進撃の巨人',
  };

  it('uses the preferred language', () => {
    expect(pickTitle(title, 'english')).toBe('Attack on Titan');
    expect(pickTitle(title, 'romaji')).toBe('Shingeki no Kyojin');
    expect(pickTitle(title, 'native')).toBe('進撃の巨人');
  });

  it('falls back when the preferred one is missing', () => {
    expect(pickTitle({ romaji: 'X', english: null }, 'english')).toBe('X');
    expect(pickTitle({ romaji: null, english: null }, 'native')).toBe(
      'Untitled',
    );
  });
});

describe('streamingLinks', () => {
  it('keeps one streaming link per site', () => {
    const links = [
      { id: 1, site: 'Crunchyroll', type: 'STREAMING', url: 'a' },
      { id: 2, site: 'Crunchyroll', type: 'STREAMING', url: 'b' },
      { id: 3, site: 'Twitter', type: 'SOCIAL', url: 'c' },
      { id: 4, site: 'Netflix', type: 'STREAMING', url: 'd' },
    ];
    expect(streamingLinks(links).map(l => l.id)).toEqual([1, 4]);
  });
});

describe('trailerEmbedUrl', () => {
  it('builds embeds for supported sites only', () => {
    expect(trailerEmbedUrl('youtube', 'abc')).toContain(
      'youtube.com/embed/abc',
    );
    expect(trailerEmbedUrl('dailymotion', 'xyz')).toContain('/embed/video/xyz');
    expect(trailerEmbedUrl('vimeo', '1')).toBeNull();
  });
});
