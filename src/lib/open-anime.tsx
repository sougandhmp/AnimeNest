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
