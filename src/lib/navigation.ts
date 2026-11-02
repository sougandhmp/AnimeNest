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

export function openCharacter(id: number) {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Character', { id });
  }
}

export function openStaff(id: number) {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Staff', { id });
  }
}

export function openStudio(id: number) {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Studio', { id });
  }
}

/** Plays a trailer in-app. Ignores trailers hosted on sites we can't embed. */
export function openTrailer(
  trailer: { id: string | null; site: string | null } | null | undefined,
  title: string,
) {
  if (trailer?.id && trailer.site && navigationRef.isReady()) {
    navigationRef.navigate('Trailer', {
      site: trailer.site,
      id: trailer.id,
      title,
    });
  }
}

export function openSettings() {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Settings');
  }
}
