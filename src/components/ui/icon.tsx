import { SymbolView, type SymbolViewProps } from 'expo-symbols';

import { Colors } from '@/constants/theme';

type Props = { ios: string; android: string; size?: number; color?: string };

/** Cross-platform symbol (SF Symbols on iOS, Material on Android/web). */
export function Icon({ ios, android, size = 20, color = Colors.dark.text }: Props) {
  const name = { ios, android, web: android } as unknown as SymbolViewProps['name'];
  return <SymbolView tintColor={color} name={name} size={size} />;
}
