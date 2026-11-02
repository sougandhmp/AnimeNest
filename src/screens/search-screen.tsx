import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import { useMemo, useState } from 'react';
import type { TabParamList } from '@/navigation/types';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { AppHeader } from '@/components/app-header';
import { Screen } from '@/components/screen';
import { Chip } from '@/components/ui/chip';
import { EmptyState, ErrorState, Loading } from '@/components/ui/states';
import { Colors, Spacing } from '@/constants/theme';
import { GenreChips } from '@/features/anime/components/genre-chips';
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
  const route = useRoute<RouteProp<TabParamList, 'Search'>>();
  const navigation = useNavigation();
  const genre = route.params?.genre;
  const term = useDebouncedValue(text);
  const filter = useMemo(
    () => ({ ...FILTERS[filterIndex].value, genre }),
    [filterIndex, genre],
  );
  const { data, error, loading, fetching, reload } = useAnimeSearch(
    term,
    filter,
  );

  const toggleGenre = (g: string) =>
    navigation.setParams({ genre: g === genre ? undefined : g } as never);

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
        contentContainerStyle={styles.chipsContent}
      >
        {FILTERS.map((f, i) => (
          <Chip
            key={f.label}
            label={f.label}
            selected={i === filterIndex}
            onPress={() => setFilterIndex(i)}
          />
        ))}
      </ScrollView>
      <View style={styles.genres}>
        <GenreChips selected={genre} onSelect={toggleGenre} />
      </View>

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
          ListEmptyComponent={
            <EmptyState
              title="No results"
              hint="Try a different title or clear the filter."
            />
          }
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
  chips: {
    flexGrow: 0,
    flexShrink: 0,
    marginTop: Spacing.three,
    marginBottom: Spacing.two,
  },
  chipsContent: { gap: Spacing.two },
  separator: { height: Spacing.two },
  genres: { marginBottom: Spacing.three },
  list: { paddingBottom: Spacing.four, flexGrow: 1 },
});
