import { useRoute, type RouteProp } from '@react-navigation/native';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import { Screen } from '@/components/screen';
import { NavHeader } from '@/components/ui/nav-header';
import { EmptyState, ErrorState, Loading } from '@/components/ui/states';
import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { Poster } from '@/features/anime/components/poster';
import { getCategory } from '@/features/anime/categories';
import { useCategoryList } from '@/features/anime/hooks/use-category-list';
import type { RootStackParamList } from '@/navigation/types';

const COLUMNS = 3;

export default function AnimeListScreen() {
  const { params } = useRoute<RouteProp<RootStackParamList, 'AnimeList'>>();
  const category = getCategory(params.category);
  const { items, error, loading, loadingMore, loadMore, reload } =
    useCategoryList(category.id);
  const { width } = useWindowDimensions();

  const contentWidth = Math.min(width, MaxContentWidth) - Spacing.three * 2;
  const itemWidth = Math.floor(
    (contentWidth - Spacing.two * (COLUMNS - 1)) / COLUMNS,
  );

  return (
    <Screen>
      <NavHeader title={category.title} />
      {loading ? (
        <Loading />
      ) : !items ? (
        <ErrorState message={error?.message} onRetry={reload} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={i => String(i.id)}
          numColumns={COLUMNS}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => (
            <Poster
              anime={item}
              width={itemWidth}
              rank={category.ranked ? index + 1 : undefined}
              hideRating={category.hideRating}
            />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.6}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footer}>
                <ActivityIndicator color={Colors.dark.accent} />
              </View>
            ) : undefined
          }
          ListEmptyComponent={<EmptyState title="Nothing here yet" />}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  column: { gap: Spacing.two, marginBottom: Spacing.three },
  list: { paddingTop: Spacing.two, paddingBottom: Spacing.four, flexGrow: 1 },
  footer: { paddingVertical: Spacing.three },
});
