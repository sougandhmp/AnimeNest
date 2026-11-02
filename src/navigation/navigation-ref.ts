import { createNavigationContainerRef } from '@react-navigation/native';

import type { RootStackParamList } from '@/navigation/types';

/** Lets non-component code (helpers, list items) navigate. */
export const navigationRef = createNavigationContainerRef<RootStackParamList>();
