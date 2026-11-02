import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { navigationRef } from '@/navigation/navigation-ref';
import { RootNavigator } from '@/navigation/root-navigator';

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.dark.background,
    card: Colors.dark.background,
    primary: Colors.dark.accent,
    text: Colors.dark.text,
    border: Colors.dark.backgroundElement,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <NavigationContainer ref={navigationRef} theme={theme}>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
