import { useRoute, type RouteProp } from '@react-navigation/native';

import { EntityScreen } from '@/components/entity-screen';
import { fetchCharacter } from '@/features/anime/api/queries';
import { useAsync } from '@/hooks/use-async';
import type { RootStackParamList } from '@/navigation/types';

export default function CharacterScreen() {
  const { params } = useRoute<RouteProp<RootStackParamList, 'Character'>>();
  const { data, error, loading, fetching, reload } = useAsync(
    signal => fetchCharacter(params.id, signal),
    [params.id],
    { cacheKey: 'character:${params.id}' },
  );
  return (
    <EntityScreen
      title="Character"
      sectionTitle="Appears in"
      data={data}
      error={error}
      loading={loading}
      fetching={fetching}
      reload={reload}
    />
  );
}
