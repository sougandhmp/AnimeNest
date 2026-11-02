import type { CategoryId } from '@/features/anime/categories';
import { navigationRef } from '@/navigation/navigation-ref';

export function openAnime(id: number) {
  if (navigationRef.isReady()) {
    navigationRef.navigate('AnimeDetail', { id });
  }
}

export function openGenre(genre: string) {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Tabs', { screen: 'Search', params: { genre } });
  }
}

export function openCategory(category: CategoryId) {
  if (navigationRef.isReady()) {
    navigationRef.navigate('AnimeList', { category });
  }
}
