import { useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import { AppHeader } from '@/components/app-header';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ErrorState, Loading } from '@/components/ui/states';
import { SectionHeader } from '@/components/ui/section-header';
import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { GenreChips } from '@/features/anime/components/genre-chips';
import { FeaturedCard } from '@/features/anime/components/featured-card';
import { PosterRow } from '@/features/anime/components/poster-row';
import { useHomeFeed } from '@/features/anime/hooks/use-home-feed';
import { openGenre } from '@/lib/navigation';

export default function HomeScreen() {
  const { data, error, loading, fetching, reload } = useHomeFeed();
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width, MaxContentWidth) - Spacing.three * 2;
  const [page, setPage] = useState(0);

  return (
    <Screen>
      <AppHeader />
      {loading ? (
        <Loading />
      ) : !data ? (
        <ErrorState message={error?.message} onRetry={reload} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={fetching}
              onRefresh={reload}
              tintColor={Colors.dark.accent}
            />
          }
        >
          {error ? (
            <ThemedText type="small" themeColor="textSecondary">
              Couldn&apos;t refresh. Showing previous results.
            </ThemedText>
          ) : null}

          <View>
            <SectionHeader title="Trending this season" />
            <FlatList
              horizontal
              pagingEnabled
              snapToInterval={cardWidth}
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              data={data.trending}
              keyExtractor={i => String(i.id)}
              renderItem={({ item }) => (
                <FeaturedCard anime={item} width={cardWidth} />
              )}
              onScroll={e =>
                setPage(Math.round(e.nativeEvent.contentOffset.x / cardWidth))
              }
              scrollEventThrottle={32}
              style={styles.carousel}
            />
            <View style={styles.dots}>
              {data.trending.map((a, i) => (
                <View
                  key={a.id}
                  style={[styles.dot, i === page && styles.dotActive]}
                />
              ))}
            </View>
          </View>

          <View>
            <SectionHeader title="Browse by genre" />
            <GenreChips onSelect={openGenre} />
          </View>

          <View>
            <SectionHeader title="Top airing now" />
            <PosterRow items={data.airing} />
          </View>

          <View>
            <SectionHeader title="All-time popular" />
            <PosterRow items={data.popular} ranked />
          </View>
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.four, paddingBottom: Spacing.five },
  carousel: { marginRight: -Spacing.two },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: Spacing.two,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.dark.backgroundSelected,
  },
  dotActive: { backgroundColor: Colors.dark.accent },
});
