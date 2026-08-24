/**
 * NoteSpace - IndexedDB Storage Engine (Bulletproof with LocalStorage Fallback)
 * Handles persistent client-side storage for pages, databases, history, and workspace settings.
 */

const DB_NAME = 'NoteSpaceDB';
const DB_VERSION = 2; // Incremented to ensure schema upgrade

class IDBService {
  constructor() {
    this.db = null;
    this.useLocalStorageFallback = false;
  }

  async init() {
    return new Promise((resolve) => {
      let resolved = false;

      // 1. Fallback timer if IndexedDB hangs in restricted browser environments
      const timer = setTimeout(() => {
        if (!resolved) {
          console.warn('IndexedDB initialization timed out, using LocalStorage fallback.');
          this.useLocalStorageFallback = true;
          resolved = true;
          resolve(this);
        }
      }, 1200);

      const safeResolve = () => {
        if (!resolved) {
          clearTimeout(timer);
          resolved = true;
          resolve(this);
        }
      };

      if (!window.indexedDB) {
        console.warn('IndexedDB not supported, falling back to LocalStorage');
        this.useLocalStorageFallback = true;
        safeResolve();
        return;
      }

      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          try {
            const db = event.target.result;

            // Pages store
            if (!db.objectStoreNames.contains('pages')) {
              const pageStore = db.createObjectStore('pages', { keyPath: 'id' });
              pageStore.createIndex('parentId', 'parentId', { unique: false });
              pageStore.createIndex('isTrash', 'isTrash', { unique: false });
              pageStore.createIndex('isFavorite', 'isFavorite', { unique: false });
              pageStore.createIndex('updatedAt', 'updatedAt', { unique: false });
            }

            // Databases store
            if (!db.objectStoreNames.contains('databases')) {
              db.createObjectStore('databases', { keyPath: 'id' });
            }

            // Settings store
            if (!db.objectStoreNames.contains('settings')) {
              db.createObjectStore('settings', { keyPath: 'key' });
            }

            // History store
            if (!db.objectStoreNames.contains('history')) {
              const historyStore = db.createObjectStore('history', { keyPath: 'id' });
              historyStore.createIndex('pageId', 'pageId', { unique: false });
              historyStore.createIndex('timestamp', 'timestamp', { unique: false });
            }
          } catch (e) {
            console.warn('Error during IDB onupgradeneeded', e);
          }
        };

        request.onsuccess = (event) => {
          this.db = event.target.result;
          
          // Verify that required object stores exist in database
          if (!this.db.objectStoreNames.contains('pages')) {
            console.warn('IDB missing required stores, falling back to LocalStorage.');
            this.useLocalStorageFallback = true;
          }
          safeResolve();
        };

        request.onerror = (event) => {
          console.warn('IndexedDB open error, falling back to LocalStorage:', event.target ? event.target.error : event);
          this.useLocalStorageFallback = true;
          safeResolve();
        };

        request.onblocked = () => {
          console.warn('IndexedDB open blocked, using LocalStorage fallback.');
          this.useLocalStorageFallback = true;
          safeResolve();
        };
      } catch (err) {
        console.warn('Exception during IndexedDB setup:', err);
        this.useLocalStorageFallback = true;
        safeResolve();
      }
    });
  }

  // --- Generic Store Operations ---

  async get(storeName, key) {
    if (this.useLocalStorageFallback || !this.db) {
      try {
        const data = localStorage.getItem(`notespace_${storeName}_${key}`);
        return data ? JSON.parse(data) : null;
      } catch (e) {
        return null;
      }
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction([storeName], 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => {
          // Fallback to localStorage on request error
          try {
            const data = localStorage.getItem(`notespace_${storeName}_${key}`);
            resolve(data ? JSON.parse(data) : null);
          } catch (e) {
            resolve(null);
          }
        };
      } catch (err) {
        // Fallback to localStorage on tx creation error
        try {
          const data = localStorage.getItem(`notespace_${storeName}_${key}`);
          resolve(data ? JSON.parse(data) : null);
        } catch (e) {
          resolve(null);
        }
      }
    });
  }

  async getAll(storeName) {
    if (this.useLocalStorageFallback || !this.db) {
      try {
        const items = [];
        const prefix = `notespace_${storeName}_`;
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(prefix)) {
            items.push(JSON.parse(localStorage.getItem(k)));
          }
        }
        return items;
      } catch (e) {
        return [];
      }
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction([storeName], 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => {
          this.getAllFromLocalStorage(storeName).then(resolve);
        };
      } catch (err) {
        this.getAllFromLocalStorage(storeName).then(resolve);
      }
    });
  }

  async getAllFromLocalStorage(storeName) {
    try {
      const items = [];
      const prefix = `notespace_${storeName}_`;
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) {
          items.push(JSON.parse(localStorage.getItem(k)));
        }
      }
      return items;
    } catch (e) {
      return [];
    }
  }

  async put(storeName, value) {
    const key = value.id || value.key;

    // Always mirror to localStorage for resilience
    try {
      localStorage.setItem(`notespace_${storeName}_${key}`, JSON.stringify(value));
    } catch (e) {
      // Ignore quota error if storage full
    }

    if (this.useLocalStorageFallback || !this.db) {
      return value;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction([storeName], 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.put(value);
        req.onsuccess = () => resolve(value);
        req.onerror = () => resolve(value);
      } catch (err) {
        resolve(value);
      }
    });
  }

  async putBatch(storeName, values) {
    if (!values || !Array.isArray(values)) return values;

    // Mirror to localStorage
    try {
      values.forEach(v => {
        const key = v.id || v.key;
        localStorage.setItem(`notespace_${storeName}_${key}`, JSON.stringify(v));
      });
    } catch (e) {
      // Ignore
    }

    if (this.useLocalStorageFallback || !this.db) {
      return values;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction([storeName], 'readwrite');
        const store = tx.objectStore(storeName);
        values.forEach(v => {
          try {
            store.put(v);
          } catch (e) {}
        });
        tx.oncomplete = () => resolve(values);
        tx.onerror = () => resolve(values);
      } catch (err) {
        resolve(values);
      }
    });
  }

  async delete(storeName, key) {
    try {
      localStorage.removeItem(`notespace_${storeName}_${key}`);
    } catch (e) {}

    if (this.useLocalStorageFallback || !this.db) {
      return true;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction([storeName], 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.delete(key);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(true);
      } catch (err) {
        resolve(true);
      }
    });
  }

  async clear(storeName) {
    try {
      const prefix = `notespace_${storeName}_`;
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) keysToRemove.push(k);
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (e) {}

    if (this.useLocalStorageFallback || !this.db) {
      return true;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction([storeName], 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.clear();
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(true);
      } catch (err) {
        resolve(true);
      }
    });
  }

  async getStorageStats() {
    try {
      const pages = await this.getAll('pages');
      const databases = await this.getAll('databases');
      const history = await this.getAll('history');

      let totalChars = 0;
      pages.forEach(p => totalChars += JSON.stringify(p).length);
      databases.forEach(d => totalChars += JSON.stringify(d).length);
      history.forEach(h => totalChars += JSON.stringify(h).length);

      let quota = null;
      let usage = null;
      if (navigator.storage && navigator.storage.estimate) {
        try {
          const estimate = await navigator.storage.estimate();
          quota = estimate.quota;
          usage = estimate.usage;
        } catch (e) {}
      }

      return {
        pagesCount: pages.filter(p => !p.isTrash).length,
        trashCount: pages.filter(p => p.isTrash).length,
        databasesCount: databases.length,
        historyCount: history.length,
        approxSizeKB: (totalChars / 1024).toFixed(1),
        storageUsageMB: usage ? (usage / (1024 * 1024)).toFixed(2) : null,
        storageQuotaMB: quota ? (quota / (1024 * 1024)).toFixed(0) : null
      };
    } catch (e) {
      return {
        pagesCount: 0,
        trashCount: 0,
        databasesCount: 0,
        historyCount: 0,
        approxSizeKB: '0',
        storageUsageMB: null,
        storageQuotaMB: null
      };
    }
  }
}

export const db = new IDBService();
