import { useTitle } from '@/features/settings/use-title';
import { RemoteImage } from '@/components/ui/remote-image';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Rating } from '@/components/ui/rating';
import { Tag } from '@/components/ui/tag';
import { Colors, Spacing } from '@/constants/theme';
import {
  cleanDescription,
  formatLabel,
  seasonLabel,
} from '@/features/anime/format';
import type { AnimeSummary } from '@/features/anime/types';
import { useWatchEntry } from '@/features/watchlist/hooks/use-watchlist';
import { addToWatchlist } from '@/features/watchlist/store';
import { useOpenAnime } from '@/lib/open-anime';

export function SearchResultCard({ anime }: { anime: AnimeSummary }) {
  const openAnime = useOpenAnime();
  const getTitle = useTitle();
  const inList = !!useWatchEntry(anime.id);
  const meta = [
    formatLabel(anime.format),
    anime.episodes ? `${anime.episodes} eps` : null,
    seasonLabel(anime.season, anime.seasonYear),
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <View style={styles.card}>
      <RemoteImage
        uri={anime.coverImage.large}
        style={[
          styles.cover,
          {
            backgroundColor:
              anime.coverImage.color ?? Colors.dark.backgroundSelected,
          },
        ]}
      />
      <View style={styles.body}>
        <ThemedText type="smallBold" numberOfLines={2}>
          {getTitle(anime.title)}
        </ThemedText>
        {meta ? (
          <ThemedText type="small" themeColor="textSecondary">
            {meta}
          </ThemedText>
        ) : null}
        <View style={styles.tags}>
          {anime.genres.slice(0, 3).map(g => (
            <Tag key={g}>{g}</Tag>
          ))}
        </View>
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
          {cleanDescription(anime.description)}
        </ThemedText>
        <Rating score={anime.averageScore} />
        <View style={styles.actions}>
          <Button
            label={inList ? 'In List' : 'Add'}
            symbol={inList ? 'check' : 'add'}
            onPress={() => addToWatchlist(anime)}
            style={styles.action}
          />
          <Button
            label="Detail"
            variant="outline"
            onPress={() => openAnime(anime.id)}
            style={styles.action}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.two,
    borderRadius: Spacing.three,
    backgroundColor: Colors.dark.backgroundElement,
  },
  cover: { width: 92, height: 134, borderRadius: Spacing.two },
  body: { flex: 1, gap: Spacing.one },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one },
  actions: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.one },
  action: { flex: 1 },
});
