// In-memory stand-in for react-native-mmkv so storage-backed code can run in Jest.
const stores = new Map();

function createMMKV({ id = 'default' } = {}) {
  if (!stores.has(id)) {
    stores.set(id, new Map());
  }
  const data = stores.get(id);
  return {
    getString: key => (data.has(key) ? data.get(key) : undefined),
    set: (key, value) => {
      data.set(key, value);
    },
    remove: key => data.delete(key),
    contains: key => data.has(key),
    getAllKeys: () => [...data.keys()],
    clearAll: () => data.clear(),
  };
}

module.exports = { createMMKV };
