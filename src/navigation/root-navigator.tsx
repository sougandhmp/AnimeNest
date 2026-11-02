import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Colors } from '@/constants/theme';
import { TabNavigator } from '@/navigation/tab-navigator';
import type { RootStackParamList } from '@/navigation/types';
import AnimeDetailScreen from '@/screens/anime-detail-screen';
import AnimeListScreen from '@/screens/anime-list-screen';
import CharacterScreen from '@/screens/character-screen';
import SettingsScreen from '@/screens/settings-screen';
import StaffScreen from '@/screens/staff-screen';
import StudioScreen from '@/screens/studio-screen';
import TrailerScreen from '@/screens/trailer-screen';

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
      <Stack.Screen name="Character" component={CharacterScreen} />
      <Stack.Screen name="Staff" component={StaffScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Studio" component={StudioScreen} />
      <Stack.Screen
        name="Trailer"
        component={TrailerScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
