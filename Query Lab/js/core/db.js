/**
 * QueryLab - IndexedDB Persistence Engine
 * Saves custom databases, query execution logs, and saved snippets offline.
 */

const DB_NAME = 'QueryLab_DB';
const DB_VERSION = 1;

class QueryLabDB {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('databases')) {
          db.createObjectStore('databases', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('history')) {
          db.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };

      request.onerror = (e) => {
        console.warn('IndexedDB unavailable, falling back to in-memory/localStorage', e);
        resolve(null);
      };
    });
  }

  async saveDatabase(databaseJSON) {
    if (!this.db) {
      localStorage.setItem('querylab_db_' + databaseJSON.id, JSON.stringify(databaseJSON));
      return;
    }
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('databases', 'readwrite');
      const store = tx.objectStore('databases');
      store.put(databaseJSON);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async loadDatabase(id) {
    if (!this.db) {
      const item = localStorage.getItem('querylab_db_' + id);
      return item ? JSON.parse(item) : null;
    }
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('databases', 'readonly');
      const store = tx.objectStore('databases');
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async addHistoryLog(log) {
    if (!this.db) return;
    return new Promise((resolve) => {
      const tx = this.db.transaction('history', 'readwrite');
      const store = tx.objectStore('history');
      store.add({ ...log, timestamp: Date.now() });
      tx.oncomplete = () => resolve();
    });
  }
}

export const db = new QueryLabDB();
