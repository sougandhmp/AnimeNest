import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';

export function Tag({ children }: { children: ReactNode }) {
  return (
    <View style={styles.tag}>
      <ThemedText style={styles.text} themeColor="textSecondary">
        {children}
      </ThemedText>
    </View>
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
