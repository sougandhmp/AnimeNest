import { createPersistedStore } from '@/lib/persisted-store';

export type TitleLanguage = 'english' | 'romaji' | 'native';
export type LibrarySort = 'recent' | 'title' | 'score' | 'progress';

export const TITLE_LANGUAGES: {
  value: TitleLanguage;
  label: string;
  example: string;
}[] = [
  { value: 'english', label: 'English', example: 'Attack on Titan' },
  { value: 'romaji', label: 'Romaji', example: 'Shingeki no Kyojin' },
  { value: 'native', label: 'Native', example: '進撃の巨人' },
];

export const settingsStore = createPersistedStore('animenest.settings.v1', {
  titleLanguage: 'english' as TitleLanguage,
  librarySort: 'recent' as LibrarySort,
});

export const useSettings = settingsStore.useStore;

export function setTitleLanguage(titleLanguage: TitleLanguage) {
  settingsStore.set({ titleLanguage });
}

export function setLibrarySort(librarySort: LibrarySort) {
  settingsStore.set({ librarySort });
}
