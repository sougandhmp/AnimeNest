import { useWindowDimensions } from 'react-native';

/** Shortest side at or above this is a tablet (same rule as Android's sw600dp). */
export const TABLET_MIN_SHORT_SIDE = 600;
/** Two panes only fit when the window is at least this wide (e.g. not a 7" tablet in portrait). */
export const TWO_PANE_MIN_WIDTH = 700;

/**
 * True on tablets with enough room for a list beside a detail pane.
 * Phones, including in landscape, always get the single-pane layout.
 */
export function isTwoPaneLayout(width: number, height: number): boolean {
  return (
    Math.min(width, height) >= TABLET_MIN_SHORT_SIDE &&
    width >= TWO_PANE_MIN_WIDTH
  );
}

export function useIsTwoPane(): boolean {
  const { width, height } = useWindowDimensions();
  return isTwoPaneLayout(width, height);
}
