import { createContext, useContext } from 'react';

import { openAnime } from '@/lib/navigation';

type OpenAnime = (id: number) => void;

/**
 * How "open this anime" behaves. By default it pushes the detail screen; a
 * two-pane layout overrides it to show the anime in its own detail pane instead.
 */
export const OpenAnimeContext = createContext<OpenAnime>(openAnime);

export function useOpenAnime(): OpenAnime {
  return useContext(OpenAnimeContext);
}

/** The anime currently shown in a tablet detail pane, if any (always undefined on phones). */
export const SelectedAnimeContext = createContext<number | undefined>(
  undefined,
);

export function useIsSelectedAnime(id: number): boolean {
  return useContext(SelectedAnimeContext) === id;
}
