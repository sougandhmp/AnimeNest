import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { STATUS_LABEL, type WatchEntry, changeProgress } from '@/features/watchlist/store';
import { openAnime } from '@/lib/navigation';

function Stepper({ symbol, label, onPress }: { symbol: string; label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      style={styles.step}>
      <ThemedText type="smallBold">{symbol}</ThemedText>
    </Pressable>
  );
}

export function WatchlistRow({ entry }: { entry: WatchEntry }) {
  const total = entry.episodes;
  const pct = total ? Math.min(1, entry.progress / total) : 0;
  const episodeText = total ? ` · Ep ${entry.progress} / ${total}` : entry.progress ? ` · Ep ${entry.progress}` : '';

  return (
    <Pressable onPress={() => openAnime(entry.id)} style={styles.row}>
      <Image source={entry.cover} style={styles.cover} contentFit="cover" />
      <View style={styles.body}>
        <ThemedText type="smallBold" numberOfLines={2}>
          {entry.title}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {STATUS_LABEL[entry.status]}
          {episodeText}
        </ThemedText>
        <View style={styles.progressRow}>
          {entry.status !== 'PLANNING' ? (
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${pct * 100}%` }]} />
            </View>
          ) : (
            <View style={styles.flex} />
          )}
          {entry.status !== 'PLANNING' ? (
            <Stepper symbol="−" label="Previous episode" onPress={() => changeProgress(entry.id, -1)} />
          ) : null}
          <Stepper symbol="+" label="Next episode" onPress={() => changeProgress(entry.id, 1)} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.two,
    borderRadius: Spacing.three,
    backgroundColor: Colors.dark.backgroundElement,
  },
  cover: { width: 64, height: 92, borderRadius: Spacing.two, backgroundColor: Colors.dark.backgroundSelected },
  body: { flex: 1, gap: Spacing.one, justifyContent: 'center' },
  flex: { flex: 1 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginTop: Spacing.one },
  track: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.dark.backgroundSelected,
    overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: Colors.dark.accent },
  step: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.accent,
  },
});
