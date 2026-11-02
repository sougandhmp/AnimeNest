import type { ReactNode } from 'react';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';

const c = Colors.dark;

type Props = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline';
  /** Optional leading symbol, e.g. { ios: 'plus', android: 'add' }. */
  symbol?: IconName;
  icon?: ReactNode;
  style?: ViewStyle;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  symbol,
  icon,
  style,
}: Props) {
  const primary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      hitSlop={8}
      style={({ pressed }) => [
        styles.button,
        primary ? { backgroundColor: c.accent } : styles.outline,
        pressed && { opacity: 0.75 },
        style,
      ]}
    >
      {symbol ? (
        <Icon name={symbol} size={16} color={primary ? c.accentText : c.text} />
      ) : (
        icon
      )}
      <ThemedText
        type="smallBold"
        style={{ color: primary ? c.accentText : c.text }}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    minHeight: 40,
    paddingVertical: 8,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
  },
  outline: { borderWidth: 1.5, borderColor: c.accent },
});
