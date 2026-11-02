import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Icon, type IconName } from '@/components/ui/icon';
import { Colors } from '@/constants/theme';
import type { TabParamList } from '@/navigation/types';
import HomeScreen from '@/screens/home-screen';
import LibraryScreen from '@/screens/library-screen';
import ProfileScreen from '@/screens/profile-screen';
import ScheduleScreen from '@/screens/schedule-screen';
import SearchScreen from '@/screens/search-screen';

const Tab = createBottomTabNavigator<TabParamList>();
const c = Colors.dark;

type TabIconProps = { color: string; size: number };
const tabIcon =
  (name: IconName) =>
  ({ color, size }: TabIconProps) =>
    <Icon name={name} color={color} size={size} />;

// Defined once at module level so React never sees a new icon component type per render.
const TAB_ICONS: Record<
  keyof TabParamList,
  (p: TabIconProps) => React.JSX.Element
> = {
  Home: tabIcon('home'),
  Schedule: tabIcon('calendar'),
  Search: tabIcon('search'),
  Library: tabIcon('library'),
  Profile: tabIcon('person'),
};

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: c.accent,
        tabBarInactiveTintColor: c.textSecondary,
        tabBarStyle: {
          backgroundColor: c.backgroundElement,
          borderTopColor: c.backgroundSelected,
        },
        sceneStyle: { backgroundColor: c.background },
        tabBarIcon: TAB_ICONS[route.name],
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
