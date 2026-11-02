import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Colors } from '@/constants/theme';
import { TabNavigator } from '@/navigation/tab-navigator';
import type { RootStackParamList } from '@/navigation/types';
import AnimeDetailScreen from '@/screens/anime-detail-screen';
import AnimeListScreen from '@/screens/anime-list-screen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.dark.background },
      }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="AnimeDetail" component={AnimeDetailScreen} />
      <Stack.Screen name="AnimeList" component={AnimeListScreen} />
    </Stack.Navigator>
  );
}
