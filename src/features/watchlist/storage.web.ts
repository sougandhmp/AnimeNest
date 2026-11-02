// expo-sqlite's web build needs wasm; plain localStorage is enough for a small list.
export function getItem(key: string): string | null {
  return typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
}

export function setItem(key: string, value: string): void {
  if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
}
