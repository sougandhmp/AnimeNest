import { useRoute, type RouteProp } from '@react-navigation/native';

import { EntityScreen } from '@/components/entity-screen';
import { fetchStaff } from '@/features/anime/api/queries';
import { useAsync } from '@/hooks/use-async';
import type { RootStackParamList } from '@/navigation/types';

export default function StaffScreen() {
  const { params } = useRoute<RouteProp<RootStackParamList, 'Staff'>>();
  const { data, error, loading, fetching, reload } = useAsync(
    signal => fetchStaff(params.id, signal),
    [params.id],
    { cacheKey: 'staff:${params.id}' },
  );
  return (
    <EntityScreen
      title="Staff"
      sectionTitle="Works"
      data={data}
      error={error}
      loading={loading}
      fetching={fetching}
      reload={reload}
    />
  );
}
