import { useRoute, type RouteProp } from '@react-navigation/native';

import { AnimeDetailView } from '@/features/anime/components/anime-detail-view';
import type { RootStackParamList } from '@/navigation/types';

export default function AnimeDetailScreen() {
  const { params } = useRoute<RouteProp<RootStackParamList, 'AnimeDetail'>>();
  return <AnimeDetailView id={params.id} />;
}
