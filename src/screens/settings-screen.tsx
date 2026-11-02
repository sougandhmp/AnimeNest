import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Linking } from 'react-native';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { NavHeader } from '@/components/ui/nav-header';
import { SectionHeader } from '@/components/ui/section-header';
import { Colors, Spacing } from '@/constants/theme';
import { clearRecentSearches } from '@/features/search/history';
import {
  setTitleLanguage,
  TITLE_LANGUAGES,
  useSettings,
} from '@/features/settings/store';
import { useWatchlist } from '@/features/watchlist/hooks/use-watchlist';
import { clearWatchlist } from '@/features/watchlist/store';
import { clearCache } from '@/lib/cache';
import { version } from '../../package.json';

function Row({
  title,
  hint,
  onPress,
  danger,
  selected,
}: {
  title: string;
  hint?: string;
  onPress: () => void;
  danger?: boolean;
  selected?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={styles.row}
    >
      <View style={styles.rowText}>
        <ThemedText type="smallBold" style={danger ? styles.danger : undefined}>
          {title}
        </ThemedText>
        {hint ? (
          <ThemedText type="small" themeColor="textSecondary">
            {hint}
          </ThemedText>
        ) : null}
      </View>
      {selected ? <Icon name="check" color={Colors.dark.accent} /> : null}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { titleLanguage } = useSettings();
  const entries = useWatchlist();

  const confirm = (
    title: string,
    message: string,
    action: () => void,
    destructiveLabel: string,
  ) =>
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: destructiveLabel, style: 'destructive', onPress: action },
    ]);

  return (
    <Screen>
      <NavHeader title="Settings" />
      <ScrollView contentContainerStyle={styles.content}>
        <View>
          <SectionHeader title="Title language" />
          <View style={styles.card}>
            {TITLE_LANGUAGES.map(l => (
              <Row
                key={l.value}
                title={l.label}
                hint={l.example}
                selected={titleLanguage === l.value}
                onPress={() => setTitleLanguage(l.value)}
              />
            ))}
          </View>
        </View>

        <View>
          <SectionHeader title="Data" />
          <View style={styles.card}>
            <Row
              title="Clear cached data"
              hint="Frees space. Pages reload from AniList next time."
              onPress={() =>
                confirm(
                  'Clear cached data?',
                  'Saved Home, schedule and detail pages will be removed. Your watchlist is not affected.',
                  () => {
                    const n = clearCache();
                    Alert.alert(
                      'Done',
                      `Removed ${n} cached item${n === 1 ? '' : 's'}.`,
                    );
                  },
                  'Clear',
                )
              }
            />
            <Row
              title="Clear search history"
              onPress={() => {
                clearRecentSearches();
                Alert.alert('Done', 'Recent searches cleared.');
              }}
            />
            <Row
              title="Delete watchlist"
              hint={`${entries.length} title${
                entries.length === 1 ? '' : 's'
              } saved on this device`}
              danger
              onPress={() =>
                confirm(
                  'Delete your watchlist?',
                  'This removes every title, score and note from this device. It cannot be undone.',
                  clearWatchlist,
                  'Delete',
                )
              }
            />
          </View>
        </View>

        <View>
          <SectionHeader title="About" />
          <View style={styles.card}>
            <Row title="Version" hint={version} onPress={() => {}} />
            <Row
              title="Data from AniList"
              hint="anilist.co"
              onPress={() => Linking.openURL('https://anilist.co')}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.four, paddingBottom: Spacing.five },
  card: {
    borderRadius: Spacing.three,
    backgroundColor: Colors.dark.backgroundElement,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.dark.backgroundSelected,
  },
  rowText: { flex: 1, gap: 2 },
  danger: { color: Colors.dark.danger },
});
