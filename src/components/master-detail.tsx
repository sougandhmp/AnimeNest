import { type ReactNode, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/ui/states';
import { Colors, Spacing } from '@/constants/theme';
import { AnimeDetailView } from '@/features/anime/components/anime-detail-view';
import { useIsTwoPane } from '@/lib/layout';
import { OpenAnimeContext } from '@/lib/open-anime';

/** Width of the list pane on tablets. */
export const MASTER_WIDTH = 380;

type Props = { master: ReactNode };

/**
 * Phone: just the list; tapping an item pushes the detail screen as before.
 * Tablet: the list sits on the left and the tapped anime opens on the right.
 */
export function MasterDetail({ master }: Props) {
  const twoPane = useIsTwoPane();
  const [selected, setSelected] = useState<number | undefined>();

  if (!twoPane) {
    return <>{master}</>;
  }

  return (
    <OpenAnimeContext.Provider value={setSelected}>
      <View style={styles.row}>
        <View style={styles.master}>{master}</View>
        <View style={styles.detail}>
          {selected === undefined ? (
            <EmptyState
              title="Select an anime"
              hint="Pick a title from the list to see its details here."
            />
          ) : (
            // key resets tabs and scroll position when the selection changes.
            <AnimeDetailView key={selected} id={selected} embedded />
          )}
        </View>
      </View>
    </OpenAnimeContext.Provider>
  );
}

const styles = StyleSheet.create({
  row: { flex: 1, flexDirection: 'row', gap: Spacing.three },
  master: { width: MASTER_WIDTH },
  detail: {
    flex: 1,
    borderRadius: Spacing.three,
    overflow: 'hidden',
    backgroundColor: Colors.dark.background,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.dark.backgroundSelected,
  },
});
