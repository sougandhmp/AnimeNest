import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { SectionHeader } from '@/components/ui/section-header';
import { Colors, Spacing } from '@/constants/theme';
import { useBackfillEntries } from '@/features/watchlist/hooks/use-backfill';
import { useWatchlist } from '@/features/watchlist/hooks/use-watchlist';
import {
  computeStats,
  formatWatchTime,
  type GenreCount,
} from '@/features/watchlist/stats';
import { STATUS_LABEL, type WatchStatus } from '@/features/watchlist/store';
import { openSettings } from '@/lib/navigation';

const STATUSES: WatchStatus[] = ['WATCHING', 'PLANNING', 'COMPLETED'];

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.stat}>
      <ThemedText type="title" style={styles.statValue}>
        {value}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
    </View>
  );
}

function GenreBars({ genres }: { genres: GenreCount[] }) {
  const max = genres[0]?.count ?? 1;
  return (
    <View style={styles.bars}>
      {genres.map(g => (
        <View key={g.genre} style={styles.barRow}>
          <ThemedText type="small" style={styles.barLabel} numberOfLines={1}>
            {g.genre}
          </ThemedText>
          <View style={styles.barTrack}>
            <View
              style={[styles.barFill, { width: `${(g.count / max) * 100}%` }]}
            />
          </View>
          <ThemedText type="smallBold" style={styles.barCount}>
            {g.count}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

export default function ProfileScreen() {
  const entries = useWatchlist();
  useBackfillEntries();
  const stats = computeStats(entries);

  return (
    <Screen>
      <AppHeader />
      <View style={styles.titleRow}>
        <ThemedText type="title" style={styles.title}>
          Profile
        </ThemedText>
        <Pressable
          onPress={openSettings}
          accessibilityRole="button"
          accessibilityLabel="Settings"
          hitSlop={8}
          style={styles.gear}
        >
          <Icon name="settings" size={24} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          <Stat label="In watchlist" value={stats.total} />
          <Stat label="Episodes watched" value={stats.episodesWatched} />
          <Stat
            label="Time watched"
            value={formatWatchTime(stats.minutesWatched)}
          />
          <Stat
            label="Your mean score"
            value={stats.meanScore ? stats.meanScore.toFixed(1) : '—'}
          />
          {STATUSES.map(s => (
            <Stat key={s} label={STATUS_LABEL[s]} value={stats.byStatus[s]} />
          ))}
        </View>

        {stats.topGenres.length > 0 ? (
          <View>
            <SectionHeader title="Your top genres" />
            <GenreBars genres={stats.topGenres} />
          </View>
        ) : null}

        <ThemedText type="small" themeColor="textSecondary">
          Your watchlist is stored on this device. Anime data is provided by
          AniList. Time watched is estimated from episode lengths.
        </ThemedText>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: Spacing.three,
  },
  title: { fontSize: 28, lineHeight: 34 },
  gear: { padding: Spacing.one },
  content: { gap: Spacing.four, paddingBottom: Spacing.four },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  stat: {
    width: '48.5%',
    padding: Spacing.three,
    borderRadius: Spacing.three,
    backgroundColor: Colors.dark.backgroundElement,
  },
  statValue: { fontSize: 30, lineHeight: 36 },
  bars: { gap: Spacing.two },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  barLabel: { width: 96 },
  barTrack: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.dark.backgroundElement,
    overflow: 'hidden',
  },
  barFill: { height: '100%', backgroundColor: Colors.dark.accent },
  barCount: { width: 24, textAlign: 'right' },
});
