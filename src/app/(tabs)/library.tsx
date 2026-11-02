import { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/states';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { WatchlistRow } from '@/features/watchlist/components/watchlist-row';
import { useWatchlist } from '@/features/watchlist/hooks/use-watchlist';
import { STATUS_LABEL, type WatchStatus } from '@/features/watchlist/store';

type Tab = 'ALL' | WatchStatus;
const TABS: Tab[] = ['ALL', 'WATCHING', 'PLANNING', 'COMPLETED'];
const tabLabel = (t: Tab) => (t === 'ALL' ? 'All' : STATUS_LABEL[t]);

function Separator() {
  return <View style={styles.separator} />;
}

export default function LibraryScreen() {
  const entries = useWatchlist();
  const [tab, setTab] = useState<Tab>('ALL');

  const countFor = (t: Tab) => (t === 'ALL' ? entries.length : entries.filter((e) => e.status === t).length);
  const shown = tab === 'ALL' ? entries : entries.filter((e) => e.status === tab);

  return (
    <Screen>
      <AppHeader />
      <ThemedText type="title" style={styles.title}>
        My Watchlist
      </ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chips}
        contentContainerStyle={styles.chipsContent}>
        {TABS.map((t) => (
          <Chip key={t} label={`${tabLabel(t)} (${countFor(t)})`} selected={tab === t} onPress={() => setTab(t)} />
        ))}
      </ScrollView>
      <FlatList
        data={shown}
        keyExtractor={(e) => String(e.id)}
        renderItem={({ item }) => <WatchlistRow entry={item} />}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            title={tab === 'ALL' ? 'Your watchlist is empty' : `Nothing in ${tabLabel(tab)}`}
            hint="Find an anime in Search or Home and tap Add to List."
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, lineHeight: 34, marginTop: Spacing.two },
  chips: { flexGrow: 0, flexShrink: 0, marginVertical: Spacing.three },
  chipsContent: { gap: Spacing.two },
  separator: { height: Spacing.two },
  list: { paddingBottom: BottomTabInset + Spacing.four, flexGrow: 1 },
});
