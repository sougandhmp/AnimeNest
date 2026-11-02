import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { AppHeader } from '@/components/app-header';
import { MasterDetail } from '@/components/master-detail';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { EmptyState, ErrorState, Loading } from '@/components/ui/states';
import { Colors, Spacing } from '@/constants/theme';
import type { SearchFilter } from '@/features/anime/api/queries';
import { GenreChips } from '@/features/anime/components/genre-chips';
import { SearchResultCard } from '@/features/anime/components/search-result-card';
import {
  countActiveFilters,
  SearchFilters,
  type AdvancedFilter,
} from '@/features/anime/components/search-filters';
import { useAnimeSearch } from '@/features/anime/hooks/use-anime-search';
import {
  addRecentSearch,
  clearRecentSearches,
  useRecentSearches,
} from '@/features/search/history';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import type { TabParamList } from '@/navigation/types';
import { useIsTwoPane } from '@/lib/layout';

const TYPES: { label: string; value: SearchFilter }[] = [
  { label: 'All Types', value: {} },
  { label: 'TV', value: { format: 'TV' } },
  { label: 'Movie', value: { format: 'MOVIE' } },
  { label: 'Top Rated', value: { topRated: true } },
];

function Separator() {
  return <View style={styles.separator} />;
}

function RecentSearches({ onPick }: { onPick: (term: string) => void }) {
  const recent = useRecentSearches();
  if (recent.length === 0) {
    return null;
  }
  return (
    <View style={styles.recent}>
      <View style={styles.recentHeader}>
        <ThemedText type="smallBold" themeColor="textSecondary">
          RECENT SEARCHES
        </ThemedText>
        <Pressable
          onPress={clearRecentSearches}
          accessibilityRole="button"
          hitSlop={8}
        >
          <ThemedText type="smallBold" style={styles.clear}>
            Clear
          </ThemedText>
        </Pressable>
      </View>
      <View style={styles.recentChips}>
        {recent.map(term => (
          <Chip key={term} label={term} onPress={() => onPick(term)} />
        ))}
      </View>
    </View>
  );
}

export default function SearchScreen() {
  const twoPane = useIsTwoPane();
  const [text, setText] = useState('');
  const [typeIndex, setTypeIndex] = useState(0);
  const [advanced, setAdvanced] = useState<AdvancedFilter>({});
  const [showFilters, setShowFilters] = useState(false);
  const route = useRoute<RouteProp<TabParamList, 'Search'>>();
  const navigation = useNavigation();
  const genre = route.params?.genre;
  const term = useDebouncedValue(text);
  const filter = useMemo<SearchFilter>(
    () => ({ ...TYPES[typeIndex].value, ...advanced, genre }),
    [typeIndex, advanced, genre],
  );
  const { data, error, loading, fetching, reload } = useAnimeSearch(
    term,
    filter,
  );
  const activeCount = countActiveFilters(advanced);

  const toggleGenre = (g: string) =>
    navigation.setParams({ genre: g === genre ? undefined : g } as never);

  return (
    <Screen fullWidth={twoPane}>
      <AppHeader />
      <MasterDetail
        master={
          <>
            <View style={styles.searchRow}>
              <TextInput
                value={text}
                onChangeText={setText}
                onSubmitEditing={() => addRecentSearch(text)}
                placeholder="Search anime"
                placeholderTextColor={Colors.dark.textSecondary}
                style={[styles.input, styles.inputFlex]}
                returnKeyType="search"
                autoCorrect={false}
                clearButtonMode="while-editing"
              />
              <Pressable
                onPress={() => setShowFilters(v => !v)}
                accessibilityRole="button"
                accessibilityLabel="Filters"
                accessibilityState={{ expanded: showFilters }}
                style={[
                  styles.filterButton,
                  (showFilters || activeCount > 0) && styles.filterButtonActive,
                ]}
              >
                <Icon name="tune" size={20} />
                {activeCount > 0 ? (
                  <View style={styles.badge}>
                    <ThemedText style={styles.badgeText}>
                      {activeCount}
                    </ThemedText>
                  </View>
                ) : null}
              </Pressable>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chips}
              contentContainerStyle={styles.chipsContent}
            >
              {TYPES.map((f, i) => (
                <Chip
                  key={f.label}
                  label={f.label}
                  selected={i === typeIndex}
                  onPress={() => setTypeIndex(i)}
                />
              ))}
            </ScrollView>
            <View style={styles.genres}>
              <GenreChips selected={genre} onSelect={toggleGenre} />
            </View>
            {showFilters ? (
              <SearchFilters value={advanced} onChange={setAdvanced} />
            ) : null}

            {loading || (fetching && !!data) ? (
              <Loading />
            ) : !data ? (
              <ErrorState message={error?.message} onRetry={reload} />
            ) : (
              <FlatList
                data={data}
                keyExtractor={i => String(i.id)}
                renderItem={({ item }) => <SearchResultCard anime={item} />}
                ItemSeparatorComponent={Separator}
                contentContainerStyle={styles.list}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
                ListHeaderComponent={
                  text.length === 0 ? (
                    <RecentSearches onPick={setText} />
                  ) : undefined
                }
                ListEmptyComponent={
                  <EmptyState
                    title="No results"
                    hint="Try a different title or clear the filters."
                  />
                }
              />
            )}
          </>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 44,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    backgroundColor: Colors.dark.backgroundElement,
    color: Colors.dark.text,
    fontSize: 16,
  },
  chips: {
    flexGrow: 0,
    flexShrink: 0,
    marginTop: Spacing.three,
    marginBottom: Spacing.two,
  },
  chipsContent: { gap: Spacing.two },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  inputFlex: { flex: 1 },
  filterButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.two,
    borderWidth: 1,
    borderColor: Colors.dark.backgroundSelected,
  },
  filterButtonActive: { borderColor: Colors.dark.accent },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.accent,
  },
  badgeText: { fontSize: 11, lineHeight: 14, fontWeight: '700' },
  separator: { height: Spacing.two },
  genres: { marginBottom: Spacing.three },
  list: { paddingBottom: Spacing.four, flexGrow: 1 },
  recent: { gap: Spacing.two, marginBottom: Spacing.three },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentChips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  clear: { color: Colors.dark.accent },
});
