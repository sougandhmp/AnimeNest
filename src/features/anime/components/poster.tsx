import { useTitle } from '@/features/settings/use-title';
import { RemoteImage } from '@/components/ui/remote-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Rating } from '@/components/ui/rating';
import { Colors, Spacing } from '@/constants/theme';
import {} from '@/features/anime/format';
import type { AnimeSummary } from '@/features/anime/types';
import { useOpenAnime } from '@/lib/open-anime';

const c = Colors.dark;

type Props = {
  anime: Pick<AnimeSummary, 'id' | 'title'> & {
    coverImage: { large: string | null; color?: string | null };
    /** null = unrated (shows N/A); undefined = not loaded, so no badge. */
    averageScore?: number | null;
  };
  width?: number;
  rank?: number;
  /** Hide the rating badge (e.g. unreleased titles, which have no score yet). */
  hideRating?: boolean;
};

export function Poster({ anime, width = 120, rank, hideRating }: Props) {
  const openAnime = useOpenAnime();
  const getTitle = useTitle();
  return (
    <Pressable
      onPress={() => openAnime(anime.id)}
      style={{ width }}
      accessibilityRole="button"
    >
      <View>
        <RemoteImage
          uri={anime.coverImage.large}
          style={[
            styles.poster,
            {
              width,
              height: width * 1.45,
              backgroundColor: anime.coverImage.color ?? c.backgroundElement,
            },
          ]}
        />
        {rank ? (
          <View style={styles.badge}>
            <ThemedText type="smallBold">#{rank}</ThemedText>
          </View>
        ) : hideRating || anime.averageScore === undefined ? null : (
          <View style={styles.badge}>
            <Rating score={anime.averageScore} size="sm" />
          </View>
        )}
      </View>
      <ThemedText type="small" numberOfLines={2} style={styles.title}>
        {getTitle(anime.title)}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  poster: { borderRadius: Spacing.two },
  title: { marginTop: Spacing.one },
  badge: {
    position: 'absolute',
    top: Spacing.one,
    left: Spacing.one,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Spacing.one,
    backgroundColor: 'rgba(18,16,43,0.85)',
  },
});
