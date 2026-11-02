import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

/** Centered, max-width, safe-area page wrapper shared by the tab screens. */
export function Screen({
  children,
  fullWidth = false,
}: {
  children: ReactNode;
  /** Drop the max-width cap (used by tablet two-pane layouts). */
  fullWidth?: boolean;
}) {
  return (
    <View style={styles.container}>
      <SafeAreaView
        style={[styles.safeArea, fullWidth && styles.fullWidth]}
        edges={['top']}
      >
        {children}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullWidth: { maxWidth: undefined },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.three,
  },
});
