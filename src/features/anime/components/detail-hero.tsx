import { openTrailer } from '@/lib/navigation';
import { useTitle } from '@/features/settings/use-title';
import { RemoteImage } from '@/components/ui/remote-image';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Rating } from '@/components/ui/rating';
import { Colors, Spacing } from '@/constants/theme';
import { formatCountdown, trailerUrl } from '@/features/anime/format';
import type { AnimeDetail } from '@/features/anime/types';

const c = Colors.dark;

function Stat({ children }: { children: string }) {
  return (
    <View style={styles.stat}>
      <ThemedText type="smallBold">{children}</ThemedText>
    </View>
  );
}

export function DetailHero({ anime }: { anime: AnimeDetail }) {
  const getTitle = useTitle();
  const rated = anime.rankings.find(r => r.type === 'RATED' && r.allTime);
  const popular = anime.rankings.find(r => r.type === 'POPULAR' && r.allTime);
  const trailer = trailerUrl(anime.trailer);

  return (
    <>
      <View style={styles.hero}>
        <RemoteImage
          uri={anime.coverImage.extraLarge ?? anime.coverImage.large}
          style={[
            styles.cover,
            { backgroundColor: anime.coverImage.color ?? c.backgroundElement },
          ]}
        />
        <View style={styles.info}>
          <ThemedText type="subtitle" style={styles.title} numberOfLines={4}>
            {getTitle(anime.title)}
          </ThemedText>
          {trailer ? (
            <Button
              label="Watch Trailer"
              symbol={'play'}
              variant="outline"
              onPress={() => openTrailer(anime.trailer, getTitle(anime.title))}
              style={styles.trailer}
            />
          ) : null}
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Rating score={anime.averageScore} />
        </View>
        {rated ? <Stat>{`#${rated.rank} Ranked`}</Stat> : null}
        {popular ? <Stat>{`Popularity #${popular.rank}`}</Stat> : null}
        {anime.nextAiringEpisode ? (
          <Stat>{`Ep ${anime.nextAiringEpisode.episode} in ${formatCountdown(
            anime.nextAiringEpisode.timeUntilAiring,
          )}`}</Stat>
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  hero: { flexDirection: 'row', gap: Spacing.three, alignItems: 'flex-end' },
  cover: { width: 120, height: 174, borderRadius: Spacing.two },
  info: { flex: 1, gap: Spacing.two, paddingBottom: Spacing.one },
  title: { fontSize: 22, lineHeight: 28 },
  trailer: { alignSelf: 'flex-start' },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  stat: {
    paddingVertical: 6,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    backgroundColor: c.backgroundElement,
  },
});
