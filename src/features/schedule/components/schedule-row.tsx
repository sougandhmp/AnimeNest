import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Rating } from '@/components/ui/rating';
import { Colors, Spacing } from '@/constants/theme';
import { displayTitle, formatAirTime, formatLabel } from '@/features/anime/format';
import type { ScheduleItem } from '@/features/schedule/api';
import { openAnime } from '@/lib/navigation';

const c = Colors.dark;

export function ScheduleRow({ item, now }: { item: ScheduleItem; now: number }) {
  const { media } = item;
  const aired = item.airingAt <= now;
  const meta = [formatLabel(media.format), media.episodes ? `${media.episodes} eps` : null]
    .filter(Boolean)
    .join(' · ');

  return (
    <Pressable onPress={() => openAnime(media.id)} style={[styles.row, aired && styles.aired]}>
      <View style={styles.time}>
        <ThemedText
          type="smallBold"
          numberOfLines={1}
          adjustsFontSizeToFit
          style={{ color: aired ? c.textSecondary : c.accent }}>
          {formatAirTime(item.airingAt)}
        </ThemedText>
        {aired ? (
          <ThemedText style={styles.airedLabel} themeColor="textSecondary">
            Aired
          </ThemedText>
        ) : null}
      </View>
      <Image
        source={media.coverImage.large}
        style={[styles.cover, { backgroundColor: media.coverImage.color ?? c.backgroundSelected }]}
        contentFit="cover"
      />
      <View style={styles.body}>
        <ThemedText type="smallBold" numberOfLines={2}>
          {displayTitle(media.title)}
        </ThemedText>
        <ThemedText type="small" style={{ color: c.accent }}>
          Episode {item.episode}
        </ThemedText>
        {meta ? (
          <ThemedText type="small" themeColor="textSecondary">
            {meta}
          </ThemedText>
        ) : null}
      </View>
      <Rating score={media.averageScore} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.two,
    borderRadius: Spacing.three,
    backgroundColor: c.backgroundElement,
  },
  aired: { opacity: 0.6 },
  time: { width: 78, alignItems: 'center' },
  airedLabel: { fontSize: 11 },
  cover: { width: 48, height: 68, borderRadius: Spacing.one },
  body: { flex: 1, gap: 2 },
});
