import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RemoteImage } from '@/components/ui/remote-image';
import { Colors, Spacing } from '@/constants/theme';
import type { AnimeDetail } from '@/features/anime/types';
import { openStaff } from '@/lib/navigation';

export function DetailStaff({ anime }: { anime: AnimeDetail }) {
  if (anime.staff.edges.length === 0) {
    return (
      <ThemedText themeColor="textSecondary">
        No staff information available.
      </ThemedText>
    );
  }
  return (
    <View style={styles.list}>
      {anime.staff.edges.map(edge => (
        <Pressable
          key={`${edge.node.id}-${edge.role}`}
          onPress={() => openStaff(edge.node.id)}
          accessibilityRole="button"
          style={styles.row}
        >
          <RemoteImage uri={edge.node.image.large} style={styles.avatar} />
          <View style={styles.flex}>
            <ThemedText type="smallBold" numberOfLines={1}>
              {edge.node.name.full}
            </ThemedText>
            <ThemedText
              type="small"
              themeColor="textSecondary"
              numberOfLines={2}
            >
              {edge.role ?? 'Staff'}
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
    backgroundColor: Colors.dark.backgroundElement,
  },
  flex: { flex: 1 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.dark.backgroundSelected,
  },
});
