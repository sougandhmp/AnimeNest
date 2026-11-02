import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { SectionHeader } from '@/components/ui/section-header';
import { Tag } from '@/components/ui/tag';
import { Colors, Spacing } from '@/constants/theme';
import { InfoRow } from '@/features/anime/components/info-row';
import {
  cleanDescription,
  formatAirDate,
  formatAirTime,
  formatLabel,
  formatScore,
  seasonLabel,
  titleCase,
} from '@/features/anime/format';
import type { AnimeDetail } from '@/features/anime/types';
import { openGenre } from '@/lib/navigation';

export function DetailOverview({ anime }: { anime: AnimeDetail }) {
  const [expanded, setExpanded] = useState(false);
  const season = seasonLabel(anime.season, anime.seasonYear) ?? anime.seasonYear?.toString() ?? '—';

  return (
    <View style={styles.section}>
      <View style={styles.block}>
        <SectionHeader title="Synopsis" />
        <ThemedText type="small" numberOfLines={expanded ? undefined : 5}>
          {cleanDescription(anime.description)}
        </ThemedText>
        <Pressable onPress={() => setExpanded((e) => !e)} accessibilityRole="button">
          <ThemedText type="smallBold" style={{ color: Colors.dark.accent }}>
            {expanded ? 'Show Less' : 'Read More'}
          </ThemedText>
        </Pressable>
      </View>

      {anime.genres.length ? (
        <View style={styles.tags}>
          {anime.genres.map((g) => (
            <Tag key={g} onPress={() => openGenre(g)}>
              {g}
            </Tag>
          ))}
        </View>
      ) : null}

      <View style={styles.block}>
        <SectionHeader title="Information" />
        <InfoRow label="Studio" value={anime.studios.nodes.map((s) => s.name).join(', ') || '—'} />
        <InfoRow label="Season" value={season} />
        <InfoRow label="Format" value={formatLabel(anime.format) ?? '—'} />
        <InfoRow label="Episodes" value={anime.episodes?.toString() ?? '—'} />
        <InfoRow label="Status" value={titleCase(anime.status)} />
        {anime.nextAiringEpisode ? (
          <InfoRow
            label="Next ep."
            value={`Ep ${anime.nextAiringEpisode.episode} · ${formatAirDate(anime.nextAiringEpisode.airingAt)}, ${formatAirTime(anime.nextAiringEpisode.airingAt)}`}
          />
        ) : null}
        <InfoRow label="Source" value={titleCase(anime.source)} />
        <InfoRow
          label="Rating"
          value={formatScore(anime.averageScore) ? `${formatScore(anime.averageScore)} / 10` : 'N/A'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.four },
  block: { gap: Spacing.two },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
});
