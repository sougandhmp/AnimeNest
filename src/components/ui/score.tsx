import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';

export function Score({ value }: { value: number | null }) {
  if (!value) return null;
  return (
    <ThemedText type="smallBold" style={{ color: Colors.dark.star }}>
      ★ {(value / 10).toFixed(2)}
    </ThemedText>
  );
}
