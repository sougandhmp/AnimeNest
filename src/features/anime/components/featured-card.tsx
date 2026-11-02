import { useTitle } from '@/features/settings/use-title';
import { RemoteImage } from '@/components/ui/remote-image';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Rating } from '@/components/ui/rating';
import { Tag } from '@/components/ui/tag';
import { Colors, Spacing } from '@/constants/theme';
import { trailerUrl } from '@/features/anime/format';
import type { AnimeSummary } from '@/features/anime/types';
import { useWatchEntry } from '@/features/watchlist/hooks/use-watchlist';
import { addToWatchlist } from '@/features/watchlist/store';
import { openAnime, openTrailer } from '@/lib/navigation';

export function FeaturedCard({
  anime,
  width,
}: {
  anime: AnimeSummary;
  width: number;
}) {
  const getTitle = useTitle();
  const inList = !!useWatchEntry(anime.id);
  const trailer = trailerUrl(anime.trailer);

  return (
    <View style={{ width, paddingRight: Spacing.two }}>
      <RemoteImage
        uri={
          anime.bannerImage ??
          anime.coverImage.extraLarge ??
          anime.coverImage.large
        }
        style={styles.image}
      />
      <View style={styles.overlay}>
        <ThemedText
          type="subtitle"
          numberOfLines={1}
          style={styles.title}
          onPress={() => openAnime(anime.id)}
        >
          {getTitle(anime.title)}
        </ThemedText>
        <View style={styles.row}>
          {anime.genres.slice(0, 3).map(g => (
            <Tag key={g}>{g}</Tag>
          ))}
          <View style={styles.spacer} />
          <Rating score={anime.averageScore} />
        </View>
        <View style={styles.row}>
          <Button
            label={inList ? 'In List' : 'Add to List'}
            symbol={inList ? 'check' : 'add'}
            onPress={() => addToWatchlist(anime)}
            style={styles.flex}
          />
          <Button
            label="Trailer"
            symbol={'play'}
            variant="outline"
            onPress={() =>
              trailer
                ? openTrailer(anime.trailer, getTitle(anime.title))
                : openAnime(anime.id)
            }
            style={styles.flex}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 260,
    borderRadius: Spacing.three,
    backgroundColor: Colors.dark.backgroundElement,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: Spacing.two,
    bottom: 0,
    gap: Spacing.two,
    padding: Spacing.three,
    borderBottomLeftRadius: Spacing.three,
    borderBottomRightRadius: Spacing.three,
    backgroundColor: 'rgba(18,16,43,0.78)',
  },
  title: { fontSize: 20, lineHeight: 26 },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  spacer: { flex: 1 },
  flex: { flex: 1 },
});
