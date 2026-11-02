import { useCallback, useEffect, useRef, useState } from 'react';

type Page<T> = { items: T[]; hasNext: boolean };

type State<T> = { key: string; items: T[]; page: number; hasNext: boolean };

/**
 * Loads page 1 for `key`, then more pages on demand (`loadMore`).
 * `fetchPage` may change identity every render; the latest one is used.
 */
export function usePagedList<T extends { id: number }>(
  key: string,
  fetchPage: (page: number, signal?: AbortSignal) => Promise<Page<T>>,
) {
  const [state, setState] = useState<State<T> | undefined>();
  const [error, setError] = useState<Error | undefined>();
  const [loadingMore, setLoadingMore] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const fetchRef = useRef(fetchPage);
  const busy = useRef(false);

  useEffect(() => {
    fetchRef.current = fetchPage;
  });

  useEffect(() => {
    const controller = new AbortController();
    busy.current = false;
    fetchRef
      .current(1, controller.signal)
      .then(result => {
        setState({
          key,
          items: result.items,
          page: 1,
          hasNext: result.hasNext,
        });
        setError(undefined);
      })
      .catch((e: Error) => {
        if (!controller.signal.aborted) {
          setError(e);
        }
      });
    return () => controller.abort();
  }, [key, reloadKey]);

  const current = state?.key === key ? state : undefined;

  const loadMore = useCallback(() => {
    if (!current || !current.hasNext || busy.current) {
      return;
    }
    busy.current = true;
    setLoadingMore(true);
    fetchRef
      .current(current.page + 1)
      .then(result => {
        setState(prev => {
          if (!prev || prev.key !== key) {
            return prev;
          }
          // AniList pages can overlap when the ranking shifts; drop duplicates.
          const seen = new Set(prev.items.map(i => i.id));
          const fresh = result.items.filter(i => !seen.has(i.id));
          return {
            key,
            items: [...prev.items, ...fresh],
            page: prev.page + 1,
            hasNext: result.hasNext,
          };
        });
      })
      .catch((e: Error) => setError(e))
      .finally(() => {
        busy.current = false;
        setLoadingMore(false);
      });
  }, [current, key]);

  const reload = useCallback(() => {
    setError(undefined);
    setReloadKey(k => k + 1);
  }, []);

  return {
    items: current?.items,
    error,
    loading: !current && !error,
    loadingMore,
    hasNext: current?.hasNext ?? false,
    loadMore,
    reload,
  };
}
