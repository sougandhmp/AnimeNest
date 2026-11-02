import type { NavigatorScreenParams } from '@react-navigation/native';

import type { CategoryId } from '@/features/anime/categories';

export type TabParamList = {
  Home: undefined;
  Schedule: undefined;
  Search: { genre?: string } | undefined;
  Library: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  AnimeDetail: { id: number };
  AnimeList: { category: CategoryId };
  Character: { id: number };
  Staff: { id: number };
  Studio: { id: number };
  Settings: undefined;
  Trailer: { site: string; id: string; title: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
