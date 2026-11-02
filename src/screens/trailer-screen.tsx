import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import { useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/states';
import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { trailerEmbedHtml, trailerUrl } from '@/features/anime/format';
import type { RootStackParamList } from '@/navigation/types';

export default function TrailerScreen() {
  const { params } = useRoute<RouteProp<RootStackParamList, 'Trailer'>>();
  const navigation = useNavigation();
  const [failed, setFailed] = useState(false);
  const embed = trailerEmbedHtml(params.site, params.id);
  const external = trailerUrl({ id: params.id, site: params.site });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText type="smallBold" numberOfLines={1} style={styles.title}>
            {params.title}
          </ThemedText>
          <Button
            label="Close"
            variant="outline"
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.player}>
          {embed && !failed ? (
            <WebView
              source={{ html: embed.html, baseUrl: embed.baseUrl }}
              originWhitelist={['*']}
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              allowsFullscreenVideo
              startInLoadingState
              renderLoading={() => <Loading />}
              onError={() => setFailed(true)}
              onHttpError={() => setFailed(true)}
              style={styles.web}
            />
          ) : (
            <View style={styles.fallback}>
              <ThemedText themeColor="textSecondary" style={styles.center}>
                This trailer can't be played inside the app.
              </ThemedText>
            </View>
          )}
        </View>
        {external ? (
          <Button
            label="Open in browser"
            variant="outline"
            onPress={() => Linking.openURL(external)}
          />
        ) : null}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    padding: Spacing.three,
    gap: Spacing.three,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  title: { flex: 1 },
  player: {
    aspectRatio: 16 / 9,
    width: '100%',
    borderRadius: Spacing.two,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  web: { flex: 1, backgroundColor: '#000' },
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  center: { textAlign: 'center' },
});
