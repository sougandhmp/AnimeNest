import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export function SectionHeader({ title }: { title: string }) {
  return (
    <ThemedText type="smallBold" themeColor="textSecondary" style={styles.header}>
      {title.toUpperCase()}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  header: { letterSpacing: 0.5, marginBottom: Spacing.two },
});
