import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV({ id: 'animenest' });

export function getItem(key: string): string | null {
  return storage.getString(key) ?? null;
}

export function setItem(key: string, value: string): void {
  storage.set(key, value);
}

export function removeItem(key: string): void {
  storage.remove(key);
}

export function keysWithPrefix(prefix: string): string[] {
  return storage.getAllKeys().filter(k => k.startsWith(prefix));
}
