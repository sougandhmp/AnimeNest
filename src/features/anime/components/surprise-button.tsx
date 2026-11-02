import { useState } from 'react';
import { Alert } from 'react-native';

import { Button } from '@/components/ui/button';
import { fetchRandomAnimeId } from '@/features/anime/api/queries';
import { openAnime } from '@/lib/navigation';

/** Opens the detail page of a random well-rated anime. */
export function SurpriseButton() {
  const [busy, setBusy] = useState(false);

  const onPress = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const id = await fetchRandomAnimeId();
      if (id) {
        openAnime(id);
      } else {
        Alert.alert('Nothing found', 'Please try again.');
      }
    } catch {
      Alert.alert('Could not load', 'Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      label={busy ? 'Finding something…' : 'Surprise me'}
      variant="outline"
      symbol="shuffle"
      onPress={onPress}
    />
  );
}
