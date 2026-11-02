import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Chip } from '@/components/ui/chip';
import { Colors, Spacing } from '@/constants/theme';
import type {
  SearchFilter,
  SearchSeason,
  SearchSort,
  SearchStatus,
} from '@/features/anime/api/queries';

/** The filters this panel edits (the rest of SearchFilter lives in the main chips). */
export type AdvancedFilter = Pick<
  SearchFilter,
  'season' | 'year' | 'status' | 'sort'
>;

const SEASONS: { label: string; value: SearchSeason }[] = [
  { label: 'Winter', value: 'WINTER' },
  { label: 'Spring', value: 'SPRING' },
  { label: 'Summer', value: 'SUMMER' },
  { label: 'Fall', value: 'FALL' },
];
const STATUSES: { label: string; value: SearchStatus }[] = [
  { label: 'Airing', value: 'RELEASING' },
  { label: 'Finished', value: 'FINISHED' },
  { label: 'Upcoming', value: 'NOT_YET_RELEASED' },
];
const SORTS: { label: string; value: SearchSort }[] = [
  { label: 'Popular', value: 'POPULARITY_DESC' },
  { label: 'Trending', value: 'TRENDING_DESC' },
  { label: 'Top rated', value: 'SCORE_DESC' },
  { label: 'Newest', value: 'START_DATE_DESC' },
];

export function countActiveFilters(f: AdvancedFilter): number {
  return [f.season, f.year, f.status, f.sort].filter(v => v !== undefined)
    .length;
}

type Props = {
  value: AdvancedFilter;
  onChange: (next: AdvancedFilter) => void;
  /** Injected so tests and previews don't depend on today's date. */
  currentYear?: number;
};

function Group<T extends string | number>({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string;
  options: { label: string; value: T }[];
  selected: T | undefined;
  onSelect: (value: T | undefined) => void;
}) {
  return (
    <View style={styles.group}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        {title.toUpperCase()}
      </ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {options.map(o => (
          <Chip
            key={String(o.value)}
            label={o.label}
            selected={selected === o.value}
            // Tapping the selected option clears it.
            onPress={() => onSelect(selected === o.value ? undefined : o.value)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export function SearchFilters({
  value,
  onChange,
  currentYear = new Date().getFullYear(),
}: Props) {
  const years = Array.from({ length: 14 }, (_, i) => {
    const year = currentYear + 1 - i;
    return { label: String(year), value: year };
  });
  const set = (patch: AdvancedFilter) => onChange({ ...value, ...patch });

  return (
    <View style={styles.panel}>
      <Group
        title="Sort by"
        options={SORTS}
        selected={value.sort}
        onSelect={sort => set({ sort })}
      />
      <Group
        title="Status"
        options={STATUSES}
        selected={value.status}
        onSelect={status => set({ status })}
      />
      <Group
        title="Season"
        options={SEASONS}
        selected={value.season}
        onSelect={season => set({ season })}
      />
      <Group
        title="Year"
        options={years}
        selected={value.year}
        onSelect={year => set({ year })}
      />
      {countActiveFilters(value) > 0 ? (
        <Chip label="Clear filters" onPress={() => onChange({})} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: Spacing.three,
    padding: Spacing.three,
    marginBottom: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.dark.backgroundSelected,
    alignItems: 'flex-start',
  },
  group: { gap: Spacing.one, alignSelf: 'stretch' },
  row: { gap: Spacing.two },
});
