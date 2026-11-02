import { RemoteImage } from '@/components/ui/remote-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { displayTitle, formatLabel, titleCase } from '@/features/anime/format';
import type { AnimeDetail } from '@/features/anime/types';
import { openAnime } from '@/lib/navigation';

const c = Colors.dark;

export function DetailRelated({ anime }: { anime: AnimeDetail }) {
  const items = anime.relations.edges.filter(e => e.node.type === 'ANIME');
  if (items.length === 0) {
    return (
      <ThemedText themeColor="textSecondary">No related anime.</ThemedText>
    );
  }
  return (
    <View style={styles.list}>
      {items.map(e => (
        <Pressable
          key={e.node.id}
          onPress={() => openAnime(e.node.id)}
          style={styles.row}
        >
          <RemoteImage uri={e.node.coverImage.large} style={styles.cover} />
          <View style={styles.flex}>
            <ThemedText type="small" style={{ color: c.accent }}>
              {titleCase(e.relationType)}
            </ThemedText>
            <ThemedText type="smallBold" numberOfLines={2}>
              {displayTitle(e.node.title)}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {[formatLabel(e.node.format), titleCase(e.node.status)]
                .filter(Boolean)
                .join(' · ')}
            </ThemedText>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.two,
    borderRadius: Spacing.three,
    backgroundColor: c.backgroundElement,
  },
  flex: { flex: 1 },
  cover: {
    width: 52,
    height: 76,
    borderRadius: Spacing.one,
    backgroundColor: c.backgroundSelected,
  },
});
