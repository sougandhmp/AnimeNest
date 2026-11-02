import { RemoteImage } from '@/components/ui/remote-image';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { SectionHeader } from '@/components/ui/section-header';
import { Colors, Spacing } from '@/constants/theme';
import { Poster } from '@/features/anime/components/poster';
import { titleCase } from '@/features/anime/format';
import type { AnimeDetail } from '@/features/anime/types';
import { openCharacter, openStaff } from '@/lib/navigation';

const c = Colors.dark;

export function DetailCharacters({ anime }: { anime: AnimeDetail }) {
  const recommendations = anime.recommendations.nodes
    .map(n => n.mediaRecommendation)
    .filter((m): m is NonNullable<typeof m> => !!m);

  return (
    <View style={styles.section}>
      {anime.characters.edges.length === 0 ? (
        <ThemedText themeColor="textSecondary">
          No character information available.
        </ThemedText>
      ) : (
        <View style={styles.list}>
          {anime.characters.edges.map(edge => {
            const va = edge.voiceActors[0];
            return (
              <View key={edge.node.id} style={styles.row}>
                <Pressable
                  onPress={() => openCharacter(edge.node.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Character ${edge.node.name.full}`}
                  style={styles.side}
                >
                  <RemoteImage
                    uri={edge.node.image.large}
                    style={styles.avatar}
                  />
                  <View style={styles.flex}>
                    <ThemedText type="smallBold" numberOfLines={1}>
                      {edge.node.name.full}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {titleCase(edge.role)}
                    </ThemedText>
                  </View>
                </Pressable>
                {va ? (
                  <Pressable
                    onPress={() => openStaff(va.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Voice actor ${va.name.full}`}
                    style={[styles.side, styles.sideEnd]}
                  >
                    <View style={[styles.flex, styles.end]}>
                      <ThemedText type="smallBold" numberOfLines={1}>
                        {va.name.full}
                      </ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">
                        Japanese VA
                      </ThemedText>
                    </View>
                    <RemoteImage uri={va.image.large} style={styles.avatar} />
                  </Pressable>
                ) : null}
              </View>
            );
          })}
        </View>
      )}

      {recommendations.length ? (
        <View>
          <SectionHeader title="Recommendations" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recs}
          >
            {recommendations.map(m => (
              <Poster key={m.id} anime={m} width={100} />
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.four },
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
  side: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  sideEnd: { justifyContent: 'flex-end' },
  end: { alignItems: 'flex-end' },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: c.backgroundSelected,
  },
  recs: { gap: Spacing.two },
});
