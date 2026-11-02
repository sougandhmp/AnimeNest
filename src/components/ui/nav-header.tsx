import { useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Spacing } from '@/constants/theme';

/** Back button and title row for pushed screens. */
export function NavHeader({ title }: { title: string }) {
  const navigation = useNavigation();
  return (
    <View style={styles.row}>
      <Pressable
        onPress={() =>
          navigation.canGoBack()
            ? navigation.goBack()
            : navigation.navigate('Tabs')
        }
        accessibilityRole="button"
        accessibilityLabel="Back"
        hitSlop={8}
        style={styles.back}
      >
        <Icon name="chevron-left" size={24} />
      </Pressable>
      <ThemedText type="subtitle" numberOfLines={1} style={styles.title}>
        {title}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  back: { padding: Spacing.one, marginLeft: -Spacing.one },
  title: { flex: 1, fontSize: 22, lineHeight: 28 },
});
