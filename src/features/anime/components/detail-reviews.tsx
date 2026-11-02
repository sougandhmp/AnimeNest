import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RemoteImage } from '@/components/ui/remote-image';
import { Colors, Spacing } from '@/constants/theme';
import type { AnimeDetail, Review } from '@/features/anime/types';

function ReviewCard({ review }: { review: Review }) {
  const helpful =
    review.ratingAmount && review.rating !== null
      ? `${review.rating} of ${review.ratingAmount} found this helpful`
      : null;
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <RemoteImage uri={review.user?.avatar?.medium} style={styles.avatar} />
        <View style={styles.flex}>
          <ThemedText type="smallBold" numberOfLines={1}>
            {review.user?.name ?? 'Anonymous'}
          </ThemedText>
          {helpful ? (
            <ThemedText type="small" themeColor="textSecondary">
              {helpful}
            </ThemedText>
          ) : null}
        </View>
        {review.score ? (
          <View style={styles.score}>
            <ThemedText type="smallBold" style={styles.scoreText}>
              {review.score}/100
            </ThemedText>
          </View>
        ) : null}
      </View>
      {review.summary ? (
        <ThemedText type="small">{review.summary}</ThemedText>
      ) : null}
    </View>
  );
}

export function DetailReviews({ anime }: { anime: AnimeDetail }) {
  if (anime.reviews.nodes.length === 0) {
    return <ThemedText themeColor="textSecondary">No reviews yet.</ThemedText>;
  }
  return (
    <View style={styles.list}>
      {anime.reviews.nodes.map(r => (
        <ReviewCard key={r.id} review={r} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two },
  card: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    backgroundColor: Colors.dark.backgroundElement,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  flex: { flex: 1 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.dark.backgroundSelected,
  },
  score: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Spacing.one,
    backgroundColor: Colors.dark.backgroundSelected,
  },
  scoreText: { color: Colors.dark.star },
});
