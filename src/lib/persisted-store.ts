import { useSyncExternalStore } from 'react';

import { getItem, setItem } from '@/lib/storage';

/**
 * A tiny persisted object store (MMKV) with a React hook.
 * `set` merges a partial update; the snapshot is referentially stable between changes.
 */
export function createPersistedStore<T extends object>(
  key: string,
  defaults: T,
) {
  let snapshot: T | undefined;
  let raw: string | null | undefined;
  const listeners = new Set<() => void>();

  function get(): T {
    let current: string | null = null;
    try {
      current = getItem(key);
    } catch {
      return snapshot ?? defaults;
    }
    if (snapshot && current === raw) {
      return snapshot;
    }
    raw = current;
    try {
      snapshot = { ...defaults, ...(current ? JSON.parse(current) : {}) };
    } catch {
      snapshot = defaults;
    }
    return snapshot as T;
  }

  function set(patch: Partial<T>) {
    const next = { ...get(), ...patch };
    const serialized = JSON.stringify(next);
    try {
      setItem(key, serialized);
    } catch {
      // Storage unavailable: keep the in-memory value for this session.
    }
    raw = serialized;
    snapshot = next;
    listeners.forEach(l => l());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  function useStore(): T {
    return useSyncExternalStore(subscribe, get, get);
  }

  return { get, set, subscribe, useStore };
}
