import { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { Screen } from '@/components/screen';
import { Chip } from '@/components/ui/chip';
import { EmptyState, ErrorState, Loading } from '@/components/ui/states';
import { BottomTabInset, Colors, Spacing } from '@/constants/theme';
import { SearchResultCard } from '@/features/anime/components/search-result-card';
import { useAnimeSearch } from '@/features/anime/hooks/use-anime-search';
import type { SearchFilter } from '@/features/anime/api/queries';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

const FILTERS: { label: string; value: SearchFilter }[] = [
  { label: 'All Types', value: {} },
  { label: 'TV', value: { format: 'TV' } },
  { label: 'Movie', value: { format: 'MOVIE' } },
  { label: 'Top Rated', value: { topRated: true } },
];

function Separator() {
  return <View style={styles.separator} />;
}

export default function SearchScreen() {
  const [text, setText] = useState('');
  const [filterIndex, setFilterIndex] = useState(0);
  const term = useDebouncedValue(text);
  const { data, error, loading, fetching, reload } = useAnimeSearch(term, FILTERS[filterIndex].value);

  return (
    <Screen>
      <AppHeader />
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Search anime"
        placeholderTextColor={Colors.dark.textSecondary}
        style={styles.input}
        returnKeyType="search"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chips}
        contentContainerStyle={styles.chipsContent}>
        {FILTERS.map((f, i) => (
          <Chip key={f.label} label={f.label} selected={i === filterIndex} onPress={() => setFilterIndex(i)} />
        ))}
      </ScrollView>

      {loading || (fetching && !!data) ? (
        <Loading />
      ) : !data ? (
        <ErrorState message={error?.message} onRetry={reload} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(i) => String(i.id)}
          renderItem={({ item }) => <SearchResultCard anime={item} />}
          ItemSeparatorComponent={Separator}
          contentContainerStyle={styles.list}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={<EmptyState title="No results" hint="Try a different title or clear the filter." />}
        />
      )}
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
  chips: { flexGrow: 0, marginVertical: Spacing.three },
  chipsContent: { gap: Spacing.two },
  separator: { height: Spacing.two },
  list: { paddingBottom: BottomTabInset + Spacing.four, flexGrow: 1 },
});
