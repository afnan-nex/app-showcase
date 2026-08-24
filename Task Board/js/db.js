/**
 * IndexedDB Database Wrapper for TaskBoard
 * Includes robust fallback to LocalStorage
 */

class TaskBoardDB {
  constructor() {
    this.dbName = 'TaskBoardDB';
    this.dbVersion = 1;
    this.db = null;
    this.useLocalStorage = false;
  }

  async init() {
    return new Promise((resolve) => {
      if (!window.indexedDB) {
        console.warn('IndexedDB not supported, falling back to LocalStorage');
        this.useLocalStorage = true;
        resolve(this);
        return;
      }

      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        // Key-Value store for entire state slices
        if (!db.objectStoreNames.contains('app_state')) {
          db.createObjectStore('app_state', { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this);
      };

      request.onerror = (event) => {
        console.warn('IndexedDB open failed, fallback to LocalStorage:', event.target.error);
        this.useLocalStorage = true;
        resolve(this);
      };
    });
  }

  async set(key, value) {
    if (this.useLocalStorage || !this.db) {
      try {
        localStorage.setItem(`taskboard_${key}`, JSON.stringify(value));
      } catch (e) {
        console.error('LocalStorage write error', e);
      }
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction('app_state', 'readwrite');
        const store = tx.objectStore('app_state');
        store.put({ key, value });
        tx.oncomplete = () => resolve();
        tx.onerror = (e) => reject(e.target.error);
      } catch (err) {
        // Fallback on transaction failure
        localStorage.setItem(`taskboard_${key}`, JSON.stringify(value));
        resolve();
      }
    });
  }

  async get(key) {
    if (this.useLocalStorage || !this.db) {
      const item = localStorage.getItem(`taskboard_${key}`);
      return item ? JSON.parse(item) : null;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('app_state', 'readonly');
        const store = tx.objectStore('app_state');
        const req = store.get(key);
        req.onsuccess = () => {
          resolve(req.result ? req.result.value : null);
        };
        req.onerror = () => {
          const item = localStorage.getItem(`taskboard_${key}`);
          resolve(item ? JSON.parse(item) : null);
        };
      } catch (err) {
        const item = localStorage.getItem(`taskboard_${key}`);
        resolve(item ? JSON.parse(item) : null);
      }
    });
  }

  async clearAll() {
    if (this.useLocalStorage || !this.db) {
      localStorage.clear();
      return;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('app_state', 'readwrite');
        const store = tx.objectStore('app_state');
        store.clear();
        tx.oncomplete = () => resolve();
      } catch (e) {
        localStorage.clear();
        resolve();
      }
    });
  }
}

window.DB = new TaskBoardDB();
