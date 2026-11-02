import { useRoute, type RouteProp } from '@react-navigation/native';

import { EntityScreen } from '@/components/entity-screen';
import { fetchStudio } from '@/features/anime/api/queries';
import { useAsync } from '@/hooks/use-async';
import type { RootStackParamList } from '@/navigation/types';

export default function StudioScreen() {
  const { params } = useRoute<RouteProp<RootStackParamList, 'Studio'>>();
  const { data, error, loading, fetching, reload } = useAsync(
    signal => fetchStudio(params.id, signal),
    [params.id],
    { cacheKey: 'studio:${params.id}' },
  );
  return (
    <EntityScreen
      title="Studio"
      sectionTitle="Productions"
      data={data}
      error={error}
      loading={loading}
      fetching={fetching}
      reload={reload}
    />
  );
}
