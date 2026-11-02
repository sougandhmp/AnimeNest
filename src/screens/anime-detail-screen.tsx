import { RemoteImage } from '@/components/ui/remote-image';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { ErrorState, Loading } from '@/components/ui/states';
import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { DetailCharacters } from '@/features/anime/components/detail-characters';
import { DetailHero } from '@/features/anime/components/detail-hero';
import { DetailOverview } from '@/features/anime/components/detail-overview';
import { DetailRelated } from '@/features/anime/components/detail-related';
import type { RootStackParamList } from '@/navigation/types';
import { useAnimeDetail } from '@/features/anime/hooks/use-anime-detail';
import { WatchlistMenu } from '@/features/watchlist/components/watchlist-menu';

const c = Colors.dark;
const TABS = ['Overview', 'Characters', 'Related'] as const;
type Tab = (typeof TABS)[number];

function BackButton() {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() =>
        navigation.canGoBack()
          ? navigation.goBack()
          : navigation.navigate('Tabs')
      }
      accessibilityRole="button"
      accessibilityLabel="Back"
      style={styles.back}
    >
      <Icon name="chevron-left" />
    </Pressable>
  );
}

export default function AnimeDetailScreen() {
  const { params } = useRoute<RouteProp<RootStackParamList, 'AnimeDetail'>>();
  const { data: anime, error, loading, reload } = useAnimeDetail(params.id);
  const [tab, setTab] = useState<Tab>('Overview');

  if (!anime) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <BackButton />
          {loading ? (
            <Loading />
          ) : (
            <ErrorState
              message={error?.message ?? 'Anime not found.'}
              onRetry={reload}
            />
          )}
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.banner}>
          <RemoteImage
            uri={anime.bannerImage ?? anime.coverImage.extraLarge}
            style={StyleSheet.absoluteFill}
          />
          <View style={[StyleSheet.absoluteFill, styles.scrim]} />
          <SafeAreaView edges={['top']}>
            <BackButton />
          </SafeAreaView>
        </View>

        <View style={styles.body}>
          <DetailHero anime={anime} />
          <WatchlistMenu anime={anime} />
          <View style={styles.tabs}>
            {TABS.map(t => (
              <Chip
                key={t}
                label={t}
                selected={tab === t}
                onPress={() => setTab(t)}
              />
            ))}
          </View>
          {tab === 'Overview' ? (
            <DetailOverview anime={anime} />
          ) : tab === 'Characters' ? (
            <DetailCharacters anime={anime} />
          ) : (
            <DetailRelated anime={anime} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
  },
  scroll: { paddingBottom: Spacing.six },
  banner: { width: '100%', height: 170, backgroundColor: c.backgroundElement },
  scrim: { backgroundColor: 'rgba(18,16,43,0.6)' },
  back: { padding: Spacing.three, alignSelf: 'flex-start' },
  body: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
    marginTop: -70,
  },
  tabs: { flexDirection: 'row', gap: Spacing.two },
});
