import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';

export function AppHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.brand}>
        <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
        <ThemedText type="subtitle" style={styles.name}>
          Anime<ThemedText type="subtitle" style={{ color: Colors.dark.accent, fontSize: 20 }}>Nest</ThemedText>
        </ThemedText>
      </View>
      <Pressable
        onPress={() => router.navigate('/search')}
        accessibilityRole="button"
        accessibilityLabel="Search"
        style={styles.search}>
        <Icon ios="magnifyingglass" android="search" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.two,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  logo: { width: 28, height: 28, borderRadius: 7 },
  name: { fontSize: 20, lineHeight: 26 },
  search: { position: 'absolute', right: 0, padding: Spacing.two },
});
