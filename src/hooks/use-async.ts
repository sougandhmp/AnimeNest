import { type DependencyList, useCallback, useEffect, useState } from 'react';

/** Runs an abortable async loader; re-runs when `deps` change or `reload()` is called. */
export function useAsync<T>(
  loader: (signal: AbortSignal) => Promise<T>,
  deps: DependencyList,
  { enabled = true }: { enabled?: boolean } = {},
) {
  const [data, setData] = useState<T | undefined>();
  const [error, setError] = useState<Error | undefined>();
  const [settledKey, setSettledKey] = useState<string | undefined>();
  const [reloadKey, setReloadKey] = useState(0);

  const key = JSON.stringify([...deps, reloadKey]);

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    loader(controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setData(result);
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

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);
  const fetching = enabled && settledKey !== key;

  return { data, error, fetching, loading: enabled && data === undefined && !error, reload };
}
