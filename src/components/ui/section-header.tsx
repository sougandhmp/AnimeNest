import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';

type Props = { title: string; onSeeAll?: () => void };

export function SectionHeader({ title, onSeeAll }: Props) {
  return (
    <View style={styles.row}>
      <ThemedText
        type="smallBold"
        themeColor="textSecondary"
        numberOfLines={1}
        style={styles.title}
      >
        {title.toUpperCase()}
      </ThemedText>
      {onSeeAll ? (
        <Pressable
          onPress={onSeeAll}
          accessibilityRole="button"
          accessibilityLabel={`See all ${title}`}
          hitSlop={8}
        >
          <ThemedText type="smallBold" style={styles.seeAll}>
            See all
          </ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  title: { flex: 1, letterSpacing: 0.5 },
  seeAll: { color: Colors.dark.accent },
});
