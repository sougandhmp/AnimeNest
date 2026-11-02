import { FlatList, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { Poster } from '@/features/anime/components/poster';
import type { AnimeSummary } from '@/features/anime/types';

function Separator() {
  return <View style={{ width: Spacing.two }} />;
}

export function PosterRow({
  items,
  ranked,
}: {
  items: AnimeSummary[];
  ranked?: boolean;
}) {
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={items}
      keyExtractor={i => String(i.id)}
      renderItem={({ item, index }) => (
        <Poster anime={item} rank={ranked ? index + 1 : undefined} />
      )}
      ItemSeparatorComponent={Separator}
    />
  );
}
