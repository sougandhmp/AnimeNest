import { StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { useWatchlist } from '@/features/watchlist/hooks/use-watchlist';
import { STATUS_LABEL, type WatchStatus } from '@/features/watchlist/store';

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

export default function ProfileScreen() {
  const entries = useWatchlist();
  const episodes = entries.reduce((sum, e) => sum + e.progress, 0);

  return (
    <Screen>
      <AppHeader />
      <ThemedText type="title" style={styles.title}>
        Profile
      </ThemedText>
      <View style={styles.grid}>
        <Stat label="In watchlist" value={entries.length} />
        <Stat label="Episodes watched" value={episodes} />
        {STATUSES.map(s => (
          <Stat
            key={s}
            label={STATUS_LABEL[s]}
            value={entries.filter(e => e.status === s).length}
          />
        ))}
      </View>
      <ThemedText type="small" themeColor="textSecondary" style={styles.note}>
        Your watchlist is stored on this device. Anime data is provided by
        AniList.
      </ThemedText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, lineHeight: 34, marginVertical: Spacing.three },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  stat: {
    width: '48.5%',
    padding: Spacing.three,
    borderRadius: Spacing.three,
    backgroundColor: Colors.dark.backgroundElement,
  },
  statValue: { fontSize: 32, lineHeight: 38 },
  note: { marginTop: Spacing.four },
});
