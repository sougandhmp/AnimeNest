import { useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { SectionHeader } from '@/components/ui/section-header';
import { Chip } from '@/components/ui/chip';
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
  streamingLinks,
  titleCase,
} from '@/features/anime/format';
import type { AnimeDetail } from '@/features/anime/types';
import { openGenre, openStudio } from '@/lib/navigation';

function StudioRow({ anime }: { anime: AnimeDetail }) {
  // Animation studios first; producers/licensors after.
  const studios = [...anime.allStudios.nodes].sort(
    (a, b) => Number(b.isAnimationStudio) - Number(a.isAnimationStudio),
  );
  return (
    <View style={styles.studioRow}>
      <ThemedText type="small" themeColor="textSecondary" style={styles.label}>
        Studio
      </ThemedText>
      {studios.length === 0 ? (
        <ThemedText type="small">—</ThemedText>
      ) : (
        <View style={styles.studios}>
          {studios.slice(0, 6).map(st => (
            <Tag key={st.id} onPress={() => openStudio(st.id)}>
              {st.name}
            </Tag>
          ))}
        </View>
      )}
    </View>
  );
}

function WhereToWatch({ anime }: { anime: AnimeDetail }) {
  const links = streamingLinks(anime.externalLinks);
  if (links.length === 0) {
    return null;
  }
  return (
    <View style={styles.block}>
      <SectionHeader title="Where to watch" />
      <View style={styles.tags}>
        {links.map(l => (
          <Chip
            key={l.id}
            label={l.site}
            onPress={() => Linking.openURL(l.url)}
          />
        ))}
      </View>
    </View>
  );
}

export function DetailOverview({ anime }: { anime: AnimeDetail }) {
  const [expanded, setExpanded] = useState(false);
  const season =
    seasonLabel(anime.season, anime.seasonYear) ??
    anime.seasonYear?.toString() ??
    '—';

  return (
    <View style={styles.section}>
      <View style={styles.block}>
        <SectionHeader title="Synopsis" />
        <ThemedText type="small" numberOfLines={expanded ? undefined : 5}>
          {cleanDescription(anime.description)}
        </ThemedText>
        <Pressable
          onPress={() => setExpanded(e => !e)}
          accessibilityRole="button"
        >
          <ThemedText type="smallBold" style={{ color: Colors.dark.accent }}>
            {expanded ? 'Show Less' : 'Read More'}
          </ThemedText>
        </Pressable>
      </View>

      {anime.genres.length ? (
        <View style={styles.tags}>
          {anime.genres.map(g => (
            <Tag key={g} onPress={() => openGenre(g)}>
              {g}
            </Tag>
          ))}
        </View>
      ) : null}

      <View style={styles.block}>
        <SectionHeader title="Information" />
        <StudioRow anime={anime} />
        <InfoRow label="Season" value={season} />
        <InfoRow label="Format" value={formatLabel(anime.format) ?? '—'} />
        <InfoRow label="Episodes" value={anime.episodes?.toString() ?? '—'} />
        <InfoRow label="Status" value={titleCase(anime.status)} />
        {anime.nextAiringEpisode ? (
          <InfoRow
            label="Next ep."
            value={`Ep ${anime.nextAiringEpisode.episode} · ${formatAirDate(
              anime.nextAiringEpisode.airingAt,
            )}, ${formatAirTime(anime.nextAiringEpisode.airingAt)}`}
          />
        ) : null}
        <InfoRow label="Source" value={titleCase(anime.source)} />
        <InfoRow
          label="Rating"
          value={
            formatScore(anime.averageScore)
              ? `${formatScore(anime.averageScore)} / 10`
              : 'N/A'
          }
        />
      </View>

      <WhereToWatch anime={anime} />
    </View>
  );
}

const styles = StyleSheet.create({
  studioRow: { flexDirection: 'row', gap: Spacing.two },
  label: { width: 90 },
  studios: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  section: { gap: Spacing.four },
  block: { gap: Spacing.two },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
});
