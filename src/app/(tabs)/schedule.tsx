import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Chip } from '@/components/ui/chip';
import { EmptyState, ErrorState, Loading } from '@/components/ui/states';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { ScheduleRow } from '@/features/schedule/components/schedule-row';
import { buildDays, itemsForDay } from '@/features/schedule/days';
import { useSchedule } from '@/features/schedule/hooks/use-schedule';

function Separator() {
  return <View style={styles.separator} />;
}

export default function ScheduleScreen() {
  const days = useMemo(() => buildDays(), []);
  const [dayIndex, setDayIndex] = useState(0);
  const { data, error, loading, reload } = useSchedule();
  const items = data ? itemsForDay(data.items, days[dayIndex]) : [];

  return (
    <Screen>
      <AppHeader />
      <ThemedText type="title" style={styles.title}>
        Airing Schedule
      </ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chips}
        contentContainerStyle={styles.chipsContent}>
        {days.map((d, i) => (
          <Chip key={d.key} label={d.label} selected={i === dayIndex} onPress={() => setDayIndex(i)} />
        ))}
      </ScrollView>

      {loading ? (
        <Loading />
      ) : !data ? (
        <ErrorState message={error?.message} onRetry={reload} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => String(i.id)}
          renderItem={({ item }) => <ScheduleRow item={item} now={data?.fetchedAt ?? 0} />}
          ItemSeparatorComponent={Separator}
          contentContainerStyle={styles.list}
          refreshing={false}
          onRefresh={reload}
          ListEmptyComponent={<EmptyState title="Nothing airing" hint="No episodes are scheduled for this day." />}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, lineHeight: 34, marginTop: Spacing.two },
  chips: { flexGrow: 0, flexShrink: 0, marginVertical: Spacing.three },
  chipsContent: { gap: Spacing.two },
  separator: { height: Spacing.two },
  list: { paddingBottom: BottomTabInset + Spacing.four, flexGrow: 1 },
});
