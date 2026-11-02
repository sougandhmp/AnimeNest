import { type Href, router } from 'expo-router';

export function openAnime(id: number) {
  router.push(`/anime/${id}` as Href);
}

export function openGenre(genre: string) {
  router.navigate({ pathname: '/search', params: { genre } } as Href);
}
