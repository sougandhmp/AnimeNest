import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';

export function Tag({ children, onPress }: { children: ReactNode; onPress?: () => void }) {
  const label = (
    <ThemedText style={styles.text} themeColor="textSecondary">
      {children}
    </ThemedText>
  );
  if (!onPress) return <View style={styles.tag}>{label}</View>;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" hitSlop={6} style={styles.tag}>
      {label}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingVertical: 2,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.one,
    backgroundColor: Colors.dark.backgroundSelected,
  },
  text: { fontSize: 11 },
});
