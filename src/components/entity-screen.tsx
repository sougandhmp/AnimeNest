import { useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { NavHeader } from '@/components/ui/nav-header';
import { RemoteImage } from '@/components/ui/remote-image';
import { SectionHeader } from '@/components/ui/section-header';
import { ErrorState, Loading } from '@/components/ui/states';
import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import type { EntityPage } from '@/features/anime/api/queries';
import { Poster } from '@/features/anime/components/poster';
import { cleanDescription } from '@/features/anime/format';

const COLUMNS = 3;

type Props = {
  /** Shown in the header while the page is still loading. */
  title: string;
  sectionTitle: string;
  data: EntityPage | undefined;
  error: Error | undefined;
  loading: boolean;
  fetching: boolean;
  reload: () => void;
};

/** Shared layout for character, staff and studio pages. */
export function EntityScreen({
  title,
  sectionTitle,
  data,
  error,
  loading,
  fetching,
  reload,
}: Props) {
  const { width } = useWindowDimensions();
  const [expanded, setExpanded] = useState(false);
  const contentWidth = Math.min(width, MaxContentWidth) - Spacing.three * 2;
  const itemWidth = Math.floor(
    (contentWidth - Spacing.two * (COLUMNS - 1)) / COLUMNS,
  );

  return (
    <Screen>
      <NavHeader title={data?.name ?? title} />
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
          <View style={styles.top}>
            {data.image ? (
              <RemoteImage uri={data.image} style={styles.image} />
            ) : null}
            <View style={styles.info}>
              {data.nativeName ? (
                <ThemedText type="small" themeColor="textSecondary">
                  {data.nativeName}
                </ThemedText>
              ) : null}
              {data.facts.map(f => (
                <ThemedText key={f} type="small">
                  {f}
                </ThemedText>
              ))}
              {data.favourites ? (
                <ThemedText type="small" themeColor="textSecondary">
                  {data.favourites.toLocaleString()} favourites
                </ThemedText>
              ) : null}
            </View>
          </View>

          {data.description ? (
            <View style={styles.block}>
              <ThemedText type="small" numberOfLines={expanded ? undefined : 6}>
                {cleanDescription(data.description)}
              </ThemedText>
              <Pressable
                onPress={() => setExpanded(e => !e)}
                accessibilityRole="button"
              >
                <ThemedText type="smallBold" style={styles.more}>
                  {expanded ? 'Show Less' : 'Read More'}
                </ThemedText>
              </Pressable>
            </View>
          ) : null}

          <View>
            <SectionHeader title={sectionTitle} />
            <View style={styles.grid}>
              {data.items.map(item => (
                <Poster key={item.id} anime={item} width={itemWidth} />
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.four, paddingBottom: Spacing.five },
  top: { flexDirection: 'row', gap: Spacing.three },
  image: {
    width: 110,
    height: 160,
    borderRadius: Spacing.two,
    backgroundColor: Colors.dark.backgroundSelected,
  },
  info: { flex: 1, gap: Spacing.one, justifyContent: 'center' },
  block: { gap: Spacing.two },
  more: { color: Colors.dark.accent },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
});
