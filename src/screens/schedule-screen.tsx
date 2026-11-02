import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { MasterDetail } from '@/components/master-detail';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Chip } from '@/components/ui/chip';
import { EmptyState, ErrorState, Loading } from '@/components/ui/states';
import { Spacing } from '@/constants/theme';
import { ScheduleRow } from '@/features/schedule/components/schedule-row';
import { buildDays, itemsForDay } from '@/features/schedule/days';
import { formatAgo } from '@/lib/cache';
import { useSchedule } from '@/features/schedule/hooks/use-schedule';
import { useIsTwoPane } from '@/lib/layout';

function Separator() {
  return <View style={styles.separator} />;
}

export default function ScheduleScreen() {
  const twoPane = useIsTwoPane();
  const days = useMemo(() => buildDays(), []);
  const [dayIndex, setDayIndex] = useState(0);
  const { data, error, loading, fetching, reload, updatedAt } = useSchedule();
  const items = data ? itemsForDay(data.items, days[dayIndex]) : [];

  return (
    <Screen fullWidth={twoPane}>
      <AppHeader />
      <MasterDetail
        master={
          <>
            <ThemedText type="title" style={styles.title}>
              Airing Schedule
            </ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chips}
              contentContainerStyle={styles.chipsContent}
            >
              {days.map((d, i) => (
                <Chip
                  key={d.key}
                  label={d.label}
                  selected={i === dayIndex}
                  onPress={() => setDayIndex(i)}
                />
              ))}
            </ScrollView>
            {updatedAt ? (
              <ThemedText
                type="small"
                themeColor="textSecondary"
                style={styles.updated}
              >
                {error ? 'Offline · showing saved schedule from ' : 'Updated '}
                {formatAgo(updatedAt)}
              </ThemedText>
            ) : null}

            {loading ? (
              <Loading />
            ) : !data ? (
              <ErrorState message={error?.message} onRetry={reload} />
            ) : (
              <FlatList
                data={items}
                keyExtractor={i => String(i.id)}
                renderItem={({ item }) => (
                  <ScheduleRow item={item} now={data?.fetchedAt ?? 0} />
                )}
                ItemSeparatorComponent={Separator}
                contentContainerStyle={styles.list}
                refreshing={fetching && !!data}
                onRefresh={reload}
                ListEmptyComponent={
                  <EmptyState
                    title="Nothing airing"
                    hint="No episodes are scheduled for this day."
                  />
                }
              />
            )}
          </>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  updated: { marginBottom: Spacing.two },
  title: { fontSize: 28, lineHeight: 34, marginTop: Spacing.two },
  chips: { flexGrow: 0, flexShrink: 0, marginVertical: Spacing.three },
  chipsContent: { gap: Spacing.two },
  separator: { height: Spacing.two },
  list: { paddingBottom: Spacing.four, flexGrow: 1 },
});
