import { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Colors, Spacing } from '@/constants/theme';
import type { AnimeSummary } from '@/features/anime/types';
import { useWatchEntry } from '@/features/watchlist/hooks/use-watchlist';
import {
  STATUS_LABEL,
  type WatchEntry,
  type WatchStatus,
  addToWatchlist,
  removeFromWatchlist,
  setNote,
  setScore,
  setStatus,
} from '@/features/watchlist/store';

const STATUSES = Object.keys(STATUS_LABEL) as WatchStatus[];
const SCORES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function ScorePicker({ entry }: { entry: WatchEntry }) {
  return (
    <View style={styles.block}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        YOUR SCORE
      </ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scores}
      >
        {SCORES.map(n => (
          <Chip
            key={n}
            label={String(n)}
            selected={entry.score === n}
            // Tapping the current score clears it.
            onPress={() =>
              setScore(entry.id, entry.score === n ? undefined : n)
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}

function NoteField({ entry }: { entry: WatchEntry }) {
  const [text, setText] = useState(entry.note ?? '');
  const latest = useRef({ id: entry.id, text, saved: entry.note ?? '' });
  latest.current = { id: entry.id, text, saved: entry.note ?? '' };

  // Save shortly after typing stops, so a note is never lost if you navigate away.
  useEffect(() => {
    const t = setTimeout(() => {
      const { id, text: current, saved } = latest.current;
      if (current.trim() !== saved) {
        setNote(id, current);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [text]);

  // ...and flush any pending edit when the screen closes.
  useEffect(
    () => () => {
      const { id, text: current, saved } = latest.current;
      if (current.trim() !== saved) {
        setNote(id, current);
      }
    },
    [],
  );

  return (
    <View style={styles.block}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        NOTES
      </ThemedText>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Add a private note…"
        placeholderTextColor={Colors.dark.textSecondary}
        multiline
        maxLength={500}
        style={styles.note}
      />
    </View>
  );
}

/**
 * One tap adds the anime (as "Plan to Watch"). Once added, the status, your
 * own score and a private note can be edited here, or the entry removed.
 */
export function WatchlistMenu({ anime }: { anime: AnimeSummary }) {
  const entry = useWatchEntry(anime.id);

  if (!entry) {
    return (
      <Button
        label="Add to Watchlist"
        symbol="add"
        onPress={() => addToWatchlist(anime)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Button label="In your Watchlist" variant="outline" symbol="check" />
      <View style={styles.statuses}>
        {STATUSES.map(s => (
          <Chip
            key={s}
            label={STATUS_LABEL[s]}
            selected={entry.status === s}
            onPress={() => setStatus(anime, s)}
          />
        ))}
      </View>
      <ScorePicker entry={entry} />
      <NoteField key={entry.id} entry={entry} />
      <Pressable
        onPress={() => removeFromWatchlist(anime.id)}
        accessibilityRole="button"
        hitSlop={8}
        style={styles.remove}
      >
        <ThemedText type="small" style={styles.removeText}>
          Remove from Watchlist
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.two },
  statuses: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  block: { gap: Spacing.one },
  scores: { gap: Spacing.two },
  note: {
    minHeight: 64,
    borderRadius: Spacing.two,
    padding: Spacing.two,
    backgroundColor: Colors.dark.backgroundElement,
    color: Colors.dark.text,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  remove: { alignSelf: 'flex-start', paddingVertical: Spacing.one },
  removeText: { color: Colors.dark.danger },
});
