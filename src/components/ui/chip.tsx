import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';

const c = Colors.dark;

type Props = { label: string; selected?: boolean; onPress?: () => void };

export function Chip({ label, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      hitSlop={6}
      accessibilityState={{ selected }}
      style={[styles.chip, selected && { backgroundColor: c.accent }]}
    >
      <ThemedText
        type="small"
        style={{ color: selected ? c.accentText : c.textSecondary }}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 6,
    paddingHorizontal: Spacing.three,
    borderRadius: 999,
    backgroundColor: c.backgroundElement,
  },
});
