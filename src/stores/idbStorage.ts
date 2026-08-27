import type { StateStorage } from 'zustand/middleware';
import { openDB, type IDBPDatabase } from 'idb';

const DEFAULT_DB_NAME = 'naskh_db';
const DEFAULT_DB_VERSION = 1;
const DEFAULT_STORE_NAME = 'keyval';

let defaultDbPromise: Promise<IDBPDatabase> | null = null;

function getDefaultDb(): Promise<IDBPDatabase> {
  if (!defaultDbPromise) {
    defaultDbPromise = openDB(DEFAULT_DB_NAME, DEFAULT_DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(DEFAULT_STORE_NAME)) {
          db.createObjectStore(DEFAULT_STORE_NAME);
        }
      },
    });
  }
  return defaultDbPromise;
}

/**
 * Default StateStorage implementation using IndexedDB via the `idb` library.
 * Persists serialized Zustand state strings.
 */
export const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return null;
    }
    try {
      const db = await getDefaultDb();
      const value = await db.get(DEFAULT_STORE_NAME, name);
      return typeof value === 'string' ? value : null;
    } catch (error) {
      console.error(`[idbStorage] Error reading key "${name}":`, error);
      return null;
    }
  },

  setItem: async (name: string, value: string): Promise<void> => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return;
    }
    try {
      const db = await getDefaultDb();
      await db.put(DEFAULT_STORE_NAME, value, name);
    } catch (error) {
      console.error(`[idbStorage] Error writing key "${name}":`, error);
    }
  },

  removeItem: async (name: string): Promise<void> => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return;
    }
    try {
      const db = await getDefaultDb();
      await db.delete(DEFAULT_STORE_NAME, name);
    } catch (error) {
      console.error(`[idbStorage] Error deleting key "${name}":`, error);
    }
  },
};

/**
 * Creates an isolated IndexedDB StateStorage adapter with custom database and store names.
 *
 * @param storeName - Name of the IndexedDB object store
 * @param dbName - Name of the IndexedDB database
 * @param dbVersion - Version of the IndexedDB database
 */
export function createIdbStorage(
  storeName: string = DEFAULT_STORE_NAME,
  dbName: string = DEFAULT_DB_NAME,
  dbVersion: number = DEFAULT_DB_VERSION
): StateStorage {
  let dbPromise: Promise<IDBPDatabase> | null = null;

  const getDb = (): Promise<IDBPDatabase> => {
    if (!dbPromise) {
      dbPromise = openDB(dbName, dbVersion, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName);
          }
        },
      });
    }
    return dbPromise;
  };

  return {
    getItem: async (name: string): Promise<string | null> => {
      if (typeof window === 'undefined' || !('indexedDB' in window)) {
        return null;
      }
      try {
        const db = await getDb();
        const value = await db.get(storeName, name);
        return typeof value === 'string' ? value : null;
      } catch (error) {
        console.error(`[createIdbStorage:${storeName}] Error reading "${name}":`, error);
        return null;
      }
    },

    setItem: async (name: string, value: string): Promise<void> => {
      if (typeof window === 'undefined' || !('indexedDB' in window)) {
        return;
      }
      try {
        const db = await getDb();
        await db.put(storeName, value, name);
      } catch (error) {
        console.error(`[createIdbStorage:${storeName}] Error writing "${name}":`, error);
      }
    },

    removeItem: async (name: string): Promise<void> => {
      if (typeof window === 'undefined' || !('indexedDB' in window)) {
        return;
      }
      try {
        const db = await getDb();
        await db.delete(storeName, name);
      } catch (error) {
        console.error(`[createIdbStorage:${storeName}] Error deleting "${name}":`, error);
      }
    },
  };
}

export default idbStorage;
