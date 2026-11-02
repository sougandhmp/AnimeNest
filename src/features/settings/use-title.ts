import { useCallback } from 'react';

import { pickTitle } from '@/features/anime/format';
import { useSettings } from '@/features/settings/store';
import type { Title } from '@/features/anime/types';

/** Returns a function that renders a title in the user's chosen language. */
export function useTitle() {
  const { titleLanguage } = useSettings();
  return useCallback(
    (title: Title) => pickTitle(title, titleLanguage),
    [titleLanguage],
  );
}
