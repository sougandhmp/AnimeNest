import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/states';
import { SectionHeader } from '@/components/ui/section-header';
import { Spacing } from '@/constants/theme';
import { PosterRow } from '@/features/anime/components/poster-row';
import { useHomeFeed } from '@/features/anime/hooks/use-home-feed';
import {
  setLibrarySort,
  useSettings,
  type LibrarySort,
} from '@/features/settings/store';
import { useTitle } from '@/features/settings/use-title';
import { SORT_LABEL, sortEntries } from '@/features/watchlist/sort';
import { WatchlistRow } from '@/features/watchlist/components/watchlist-row';
import { useWatchlist } from '@/features/watchlist/hooks/use-watchlist';
import { STATUS_LABEL, type WatchStatus } from '@/features/watchlist/store';

type Tab = 'ALL' | WatchStatus;
const TABS: Tab[] = ['ALL', 'WATCHING', 'PLANNING', 'COMPLETED'];
const tabLabel = (t: Tab) => (t === 'ALL' ? 'All' : STATUS_LABEL[t]);

const SORTS: LibrarySort[] = ['recent', 'title', 'score', 'progress'];

function EmptyWatchlist() {
  // Cached by the Home screen, so this is usually instant.
  const { data } = useHomeFeed();
  return (
    <View style={styles.empty}>
      <EmptyState
        title="Your watchlist is empty"
        hint="Add anime from Search or Home, or start with something popular:"
      />
      {data ? (
        <View>
          <SectionHeader title="Popular right now" />
          <PosterRow items={data.airing} />
        </View>
      ) : null}
    </View>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

export default function LibraryScreen() {
  const entries = useWatchlist();
  const { librarySort } = useSettings();
  const getTitle = useTitle();
  const [tab, setTab] = useState<Tab>('ALL');

  const countFor = (t: Tab) =>
    t === 'ALL' ? entries.length : entries.filter(e => e.status === t).length;
  const shown = useMemo(() => {
    const filtered =
      tab === 'ALL' ? entries : entries.filter(e => e.status === tab);
    return sortEntries(filtered, librarySort, e =>
      e.titles ? getTitle(e.titles) : e.title,
    );
  }, [entries, tab, librarySort, getTitle]);

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
        contentContainerStyle={styles.chipsContent}
      >
        {TABS.map(t => (
          <Chip
            key={t}
            label={`${tabLabel(t)} (${countFor(t)})`}
            selected={tab === t}
            onPress={() => setTab(t)}
          />
        ))}
      </ScrollView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.sorts}
        contentContainerStyle={styles.chipsContent}
      >
        {SORTS.map(sort => (
          <Chip
            key={sort}
            label={SORT_LABEL[sort]}
            selected={librarySort === sort}
            onPress={() => setLibrarySort(sort)}
          />
        ))}
      </ScrollView>
      <FlatList
        data={shown}
        keyExtractor={e => String(e.id)}
        renderItem={({ item }) => <WatchlistRow entry={item} />}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          entries.length === 0 ? (
            <EmptyWatchlist />
          ) : (
            <EmptyState title={`Nothing in ${tabLabel(tab)}`} />
          )
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, lineHeight: 34, marginTop: Spacing.two },
  chips: {
    flexGrow: 0,
    flexShrink: 0,
    marginTop: Spacing.three,
    marginBottom: Spacing.two,
  },
  sorts: { flexGrow: 0, flexShrink: 0, marginBottom: Spacing.three },
  empty: { gap: Spacing.four, paddingTop: Spacing.four },
  chipsContent: { gap: Spacing.two },
  separator: { height: Spacing.two },
  list: { paddingBottom: Spacing.four, flexGrow: 1 },
});
