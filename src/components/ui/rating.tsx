import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Colors } from '@/constants/theme';
import { formatScore } from '@/features/anime/format';

type Props = {
  /** AniList average score (0-100), or null/undefined when the title is unrated. */
  score: number | null | undefined;
  size?: 'sm' | 'md';
};

/**
 * The single way a rating is shown in the app: a star icon followed by "8.7",
 * or a muted star and "N/A" when there is no score yet.
 */
export function Rating({ score, size = 'md' }: Props) {
  const value = formatScore(score);
  const color = value ? Colors.dark.star : Colors.dark.textSecondary;
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={value ? `Rating ${value} out of 10` : 'Not rated yet'}
    >
      <Icon name="star" size={iconSize} color={color} />
      <ThemedText
        type="smallBold"
        numberOfLines={1}
        style={[styles.text, size === 'sm' && styles.textSm, { color }]}
      >
        {value ?? 'N/A'}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  // flexShrink: 0 so the value is never squeezed into "N" or hidden by a neighbouring element.
  row: { flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 0 },
  text: { flexShrink: 0 },
  textSm: { fontSize: 12, lineHeight: 16 },
});
