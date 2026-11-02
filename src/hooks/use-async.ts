import {
  type DependencyList,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { readCache, writeCache } from '@/lib/cache';

type Options = {
  enabled?: boolean;
  /**
   * When set, the last successful result is saved under this key. On the next
   * mount it is shown immediately (stale-while-revalidate) and also used when
   * the network request fails, so the screen keeps working offline.
   */
  cacheKey?: string;
};

type Result<T> = { key: string; value: T; at: number };

/** Runs an abortable async loader; re-runs when `deps` change or `reload()` is called. */
export function useAsync<T>(
  loader: (signal: AbortSignal) => Promise<T>,
  deps: DependencyList,
  { enabled = true, cacheKey }: Options = {},
) {
  const [result, setResult] = useState<Result<T> | undefined>();
  const [error, setError] = useState<Error | undefined>();
  const [settledKey, setSettledKey] = useState<string | undefined>();
  const [reloadKey, setReloadKey] = useState(0);

  const key = JSON.stringify([...deps, reloadKey]);
  const cached = useMemo(
    () => (cacheKey ? readCache<T>(cacheKey) : undefined),
    [cacheKey],
  );

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    loader(controller.signal)
      .then(value => {
        if (controller.signal.aborted) return;
        const at = cacheKey ? writeCache(cacheKey, value) : Date.now();
        setResult({ key, value, at });
        setError(undefined);
        setSettledKey(key);
      })
      .catch((e: Error) => {
        if (controller.signal.aborted) return;
        setError(e);
        setSettledKey(key);
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);

  const reload = useCallback(() => setReloadKey(k => k + 1), []);
  const fetching = enabled && settledKey !== key;

  // Fresh result for this request > cached copy > a previous request's result.
  const current = result?.key === key ? result : undefined;
  const data = current?.value ?? cached?.value ?? result?.value;
  const updatedAt = current?.at ?? cached?.savedAt ?? result?.at;

  return {
    data,
    error,
    fetching,
    loading: enabled && data === undefined && !error,
    reload,
    /** When `data` was fetched (or cached), in ms since the epoch. */
    updatedAt,
  };
}
