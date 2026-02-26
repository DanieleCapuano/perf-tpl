/**
 * Storage Manager - Unified interface for LocalStorage and IndexedDB
 * 
 * Features:
 * - Automatic fallback from IndexedDB to LocalStorage
 * - Type-safe operations
 * - Expiration support
 * - Storage quota management
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface StorageSchema extends DBSchema {
  keyval: {
    key: string;
    value: {
      data: any;
      timestamp: number;
      expires?: number;
    };
  };
}

class Storage {
  private db: IDBPDatabase<StorageSchema> | null = null;
  private dbName = 'perf-tpl-storage';
  private useIndexedDB = true;
  private initialized = false;

  /**
   * Initialize storage
   */
  async init(): Promise<void> {
    if (this.initialized) return;

    try {
      // Check if IndexedDB is available
      if (!('indexedDB' in window)) {
        this.useIndexedDB = false;
        console.warn('IndexedDB not available, falling back to LocalStorage');
        return;
      }

      // Open IndexedDB
      this.db = await openDB<StorageSchema>(this.dbName, 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('keyval')) {
            db.createObjectStore('keyval');
          }
        },
      });

      this.initialized = true;
      console.log('Storage initialized with IndexedDB');
    } catch (error) {
      console.error('Failed to initialize IndexedDB:', error);
      this.useIndexedDB = false;
      console.warn('Falling back to LocalStorage');
    }
  }

  /**
   * Set item in storage
   */
  async set(key: string, value: any, expiresInMs?: number): Promise<void> {
    await this.init();

    const data = {
      data: value,
      timestamp: Date.now(),
      expires: expiresInMs ? Date.now() + expiresInMs : undefined,
    };

    if (this.useIndexedDB && this.db) {
      try {
        await this.db.put('keyval', data, key);
      } catch (error) {
        console.error('IndexedDB set failed:', error);
        this._setLocalStorage(key, data);
      }
    } else {
      this._setLocalStorage(key, data);
    }
  }

  /**
   * Get item from storage
   */
  async get<T = any>(key: string): Promise<T | null> {
    await this.init();

    if (this.useIndexedDB && this.db) {
      try {
        const item = await this.db.get('keyval', key);

        if (!item) return null;

        // Check expiration
        if (item.expires && Date.now() > item.expires) {
          await this.delete(key);
          return null;
        }

        return item.data as T;
      } catch (error) {
        console.error('IndexedDB get failed:', error);
        return this._getLocalStorage<T>(key);
      }
    } else {
      return this._getLocalStorage<T>(key);
    }
  }

  /**
   * Delete item from storage
   */
  async delete(key: string): Promise<void> {
    await this.init();

    if (this.useIndexedDB && this.db) {
      try {
        await this.db.delete('keyval', key);
      } catch (error) {
        console.error('IndexedDB delete failed:', error);
        this._deleteLocalStorage(key);
      }
    } else {
      this._deleteLocalStorage(key);
    }
  }

  /**
   * Clear all storage
   */
  async clear(): Promise<void> {
    await this.init();

    if (this.useIndexedDB && this.db) {
      try {
        await this.db.clear('keyval');
      } catch (error) {
        console.error('IndexedDB clear failed:', error);
        this._clearLocalStorage();
      }
    } else {
      this._clearLocalStorage();
    }
  }

  /**
   * Get all keys
   */
  async keys(): Promise<string[]> {
    await this.init();

    if (this.useIndexedDB && this.db) {
      try {
        return (await this.db.getAllKeys('keyval')) as string[];
      } catch (error) {
        console.error('IndexedDB keys failed:', error);
        return this._getLocalStorageKeys();
      }
    } else {
      return this._getLocalStorageKeys();
    }
  }

  /**
   * Get storage usage
   */
  async getUsage(): Promise<{ usage: number; quota: number; percentage: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const percentage = quota > 0 ? (usage / quota) * 100 : 0;

      return { usage, quota, percentage };
    }

    return { usage: 0, quota: 0, percentage: 0 };
  }

  /**
   * Check if storage is persisted
   */
  async isPersisted(): Promise<boolean> {
    if ('storage' in navigator && 'persisted' in navigator.storage) {
      return await navigator.storage.persisted();
    }
    return false;
  }

  /**
   * Request persistent storage
   */
  async requestPersistence(): Promise<boolean> {
    if ('storage' in navigator && 'persist' in navigator.storage) {
      return await navigator.storage.persist();
    }
    return false;
  }

  // LocalStorage fallback methods

  private _setLocalStorage(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('LocalStorage set failed:', error);
    }
  }

  private _getLocalStorage<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const parsed = JSON.parse(item);

      // Check expiration
      if (parsed.expires && Date.now() > parsed.expires) {
        this._deleteLocalStorage(key);
        return null;
      }

      return parsed.data as T;
    } catch (error) {
      console.error('LocalStorage get failed:', error);
      return null;
    }
  }

  private _deleteLocalStorage(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('LocalStorage delete failed:', error);
    }
  }

  private _clearLocalStorage(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('LocalStorage clear failed:', error);
    }
  }

  private _getLocalStorageKeys(): string[] {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('LocalStorage keys failed:', error);
      return [];
    }
  }
}

// Singleton instance
let instance: Storage | null = null;

export class StorageManager {
  static getInstance(): Storage {
    if (!instance) {
      instance = new Storage();
    }
    return instance;
  }
}

export default StorageManager;
