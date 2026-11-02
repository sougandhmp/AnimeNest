import { type Href, router } from 'expo-router';

export function openAnime(id: number) {
  router.push(`/anime/${id}` as Href);
}
