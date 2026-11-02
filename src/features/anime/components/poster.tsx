import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Rating } from '@/components/ui/rating';
import { Colors, Spacing } from '@/constants/theme';
import { displayTitle } from '@/features/anime/format';
import type { AnimeSummary } from '@/features/anime/types';
import { openAnime } from '@/lib/navigation';

const c = Colors.dark;

type Props = {
  anime: Pick<AnimeSummary, 'id' | 'title'> & {
    coverImage: { large: string | null; color?: string | null };
    averageScore?: number | null;
  };
  width?: number;
  rank?: number;
};

export function Poster({ anime, width = 120, rank }: Props) {
  return (
    <Pressable onPress={() => openAnime(anime.id)} style={{ width }} accessibilityRole="button">
      <View>
        <Image
          source={anime.coverImage.large}
          style={[
            styles.poster,
            { width, height: width * 1.45, backgroundColor: anime.coverImage.color ?? c.backgroundElement },
          ]}
          contentFit="cover"
          transition={200}
        />
        {rank ? (
          <View style={styles.badge}>
            <ThemedText type="smallBold">#{rank}</ThemedText>
          </View>
        ) : (
          <View style={styles.badge}>
            <Rating score={anime.averageScore} size="sm" />
          </View>
        )}
      </View>
      <ThemedText type="small" numberOfLines={2} style={styles.title}>
        {displayTitle(anime.title)}
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
