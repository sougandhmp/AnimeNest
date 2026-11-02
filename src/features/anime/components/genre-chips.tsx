import { ScrollView, StyleSheet } from 'react-native';

import { Chip } from '@/components/ui/chip';
import { Spacing } from '@/constants/theme';
import { GENRES } from '@/features/anime/format';

type Props = { selected?: string; onSelect: (genre: string) => void };

/** Horizontal genre picker. Pressing the selected genre calls onSelect with it again (caller toggles). */
export function GenreChips({ selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.content}
    >
      {GENRES.map(g => (
        <Chip
          key={g}
          label={g}
          selected={g === selected}
          onPress={() => onSelect(g)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 0, flexShrink: 0 },
  content: { gap: Spacing.two },
});
