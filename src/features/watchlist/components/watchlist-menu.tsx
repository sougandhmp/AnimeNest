import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Colors, Spacing } from '@/constants/theme';
import type { AnimeSummary } from '@/features/anime/types';
import { useWatchEntry } from '@/features/watchlist/hooks/use-watchlist';
import {
  STATUS_LABEL,
  type WatchStatus,
  addToWatchlist,
  removeFromWatchlist,
  setStatus,
} from '@/features/watchlist/store';

const STATUSES = Object.keys(STATUS_LABEL) as WatchStatus[];

/**
 * One tap adds the anime (as "Plan to Watch"). Once added, the status can be
 * changed with the chips below, or the entry removed.
 */
export function WatchlistMenu({ anime }: { anime: AnimeSummary }) {
  const entry = useWatchEntry(anime.id);

  if (!entry) {
    return (
      <Button
        label="Add to Watchlist"
        symbol={{ ios: 'plus', android: 'add' }}
        onPress={() => addToWatchlist(anime)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Button
        label="In your Watchlist"
        variant="outline"
        symbol={{ ios: 'checkmark', android: 'check' }}
      />
      <View style={styles.statuses}>
        {STATUSES.map((s) => (
          <Chip
            key={s}
            label={STATUS_LABEL[s]}
            selected={entry.status === s}
            onPress={() => setStatus(anime, s)}
          />
        ))}
      </View>
      <Pressable
        onPress={() => removeFromWatchlist(anime.id)}
        accessibilityRole="button"
        hitSlop={8}
        style={styles.remove}>
        <ThemedText type="small" style={{ color: Colors.dark.danger }}>
          Remove from Watchlist
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.two },
  statuses: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  remove: { alignSelf: 'flex-start', paddingVertical: Spacing.one },
});
