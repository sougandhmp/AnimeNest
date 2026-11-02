import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Colors, Spacing } from '@/constants/theme';

export function Loading() {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={Colors.dark.accent} />
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry: () => void }) {
  return (
    <View style={styles.center}>
      <ThemedText themeColor="textSecondary" style={styles.centerText}>
        {message ?? 'Something went wrong.'}
      </ThemedText>
      <Button label="Retry" onPress={onRetry} style={styles.retry} />
    </View>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <View style={styles.center}>
      <ThemedText type="smallBold">{title}</ThemedText>
      {hint ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
          {hint}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
  },
  centerText: { textAlign: 'center' },
  retry: { paddingHorizontal: Spacing.four },
});
