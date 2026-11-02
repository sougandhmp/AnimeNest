import { Platform } from 'react-native';

const palette = {
  text: '#ffffff',
  background: '#12102B',
  backgroundElement: '#1C1A3D',
  backgroundSelected: '#2A2756',
  textSecondary: '#A6A3C8',
  accent: '#8B7BF2',
  accentText: '#ffffff',
  star: '#FFC83D',
  danger: '#FF6B8B',
} as const;

// AnimeNest is a dark-only app: both schemes share the same palette.
export const Colors = {
  light: palette,
  dark: palette,
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = {
  mono: Platform.select({ ios: 'Menlo', default: 'monospace' }),
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const MaxContentWidth = 800;
