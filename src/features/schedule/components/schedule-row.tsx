import { useTitle } from '@/features/settings/use-title';
import { RemoteImage } from '@/components/ui/remote-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Rating } from '@/components/ui/rating';
import { Colors, Spacing } from '@/constants/theme';
import { formatAirTime, formatLabel } from '@/features/anime/format';
import type { ScheduleItem } from '@/features/schedule/api';
import { useIsSelectedAnime, useOpenAnime } from '@/lib/open-anime';

const c = Colors.dark;

export function ScheduleRow({
  item,
  now,
}: {
  item: ScheduleItem;
  now: number;
}) {
  const openAnime = useOpenAnime();
  const getTitle = useTitle();
  const { media } = item;
  const selected = useIsSelectedAnime(media.id);
  const aired = item.airingAt <= now;
  const meta = [
    formatLabel(media.format),
    media.episodes ? `${media.episodes} eps` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <Pressable
      onPress={() => openAnime(media.id)}
      style={[styles.row, aired && styles.aired, selected && styles.selected]}
    >
      <View style={styles.time}>
        <ThemedText
          type="smallBold"
          numberOfLines={1}
          adjustsFontSizeToFit
          style={{ color: aired ? c.textSecondary : c.accent }}
        >
          {formatAirTime(item.airingAt)}
        </ThemedText>
        {aired ? (
          <ThemedText style={styles.airedLabel} themeColor="textSecondary">
            Aired
          </ThemedText>
        ) : null}
      </View>
      <RemoteImage
        uri={media.coverImage.large}
        style={[
          styles.cover,
          { backgroundColor: media.coverImage.color ?? c.backgroundSelected },
        ]}
      />
      <View style={styles.body}>
        <ThemedText type="smallBold" numberOfLines={2}>
          {getTitle(media.title)}
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
  // Open in the tablet detail pane. The border is always reserved (transparent) so rows don't shift.
  selected: { borderColor: Colors.dark.accent },
  row: {
    borderWidth: 2,
    borderColor: 'transparent',
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
