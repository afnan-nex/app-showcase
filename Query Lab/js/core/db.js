/**
 * QueryLab - IndexedDB Persistence Engine
 * Saves custom databases, query execution logs, and saved snippets offline.
 */

const DB_NAME = 'QueryLab_DB';
const DB_VERSION = 2;

class QueryLabDB {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve) => {
      try {
        if (typeof indexedDB === 'undefined') {
          console.warn('IndexedDB not supported, falling back to localStorage');
          resolve(null);
          return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains('databases')) {
            db.createObjectStore('databases', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('history')) {
            db.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
          }
          if (!db.objectStoreNames.contains('snippets')) {
            db.createObjectStore('snippets', { keyPath: 'id' });
          }
        };

        request.onsuccess = (e) => {
          this.db = e.target.result;
          resolve(this.db);
        };

        request.onerror = (e) => {
          console.warn('IndexedDB unavailable, falling back to localStorage', e);
          resolve(null);
        };
      } catch (err) {
        console.warn('IndexedDB init error:', err);
        resolve(null);
      }
    });
  }

  async saveDatabase(databaseJSON) {
    if (!databaseJSON || !databaseJSON.id) return;
    if (!this.db) {
      try {
        localStorage.setItem('querylab_db_' + databaseJSON.id, JSON.stringify(databaseJSON));
      } catch (e) {
        console.warn('localStorage saveDatabase failed:', e);
      }
      return;
    }
    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction('databases', 'readwrite');
        const store = tx.objectStore('databases');
        store.put(databaseJSON);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      } catch (e) {
        resolve();
      }
    });
  }

  async loadDatabase(id) {
    if (!id) return null;
    if (!this.db) {
      try {
        const item = localStorage.getItem('querylab_db_' + id);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        return null;
      }
    }
    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction('databases', 'readonly');
        const store = tx.objectStore('databases');
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      } catch (e) {
        resolve(null);
      }
    });
  }

  async addHistoryLog(log) {
    if (!log) return;
    const entry = { ...log, timestamp: Date.now() };
    if (!this.db) {
      try {
        const list = JSON.parse(localStorage.getItem('querylab_history') || '[]');
        list.unshift(entry);
        if (list.length > 50) list.pop();
        localStorage.setItem('querylab_history', JSON.stringify(list));
      } catch (e) {
        // ignore
      }
      return;
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('history', 'readwrite');
        const store = tx.objectStore('history');
        store.add(entry);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (e) {
        resolve();
      }
    });
  }

  async loadHistory() {
    if (!this.db) {
      try {
        return JSON.parse(localStorage.getItem('querylab_history') || '[]');
      } catch (e) {
        return [];
      }
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('history', 'readonly');
        const store = tx.objectStore('history');
        const req = store.getAll();
        req.onsuccess = () => {
          const list = req.result || [];
          list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          resolve(list.slice(0, 50));
        };
        req.onerror = () => resolve([]);
      } catch (e) {
        resolve([]);
      }
    });
  }

  async clearHistory() {
    if (!this.db) {
      try {
        localStorage.removeItem('querylab_history');
      } catch (e) {}
      return;
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('history', 'readwrite');
        const store = tx.objectStore('history');
        store.clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (e) {
        resolve();
      }
    });
  }

  // Snippets
  async saveSnippet(snippet) {
    if (!snippet || !snippet.id) return;
    if (!this.db) {
      try {
        const list = JSON.parse(localStorage.getItem('querylab_snippets') || '[]');
        const existingIdx = list.findIndex(s => s.id === snippet.id);
        if (existingIdx >= 0) list[existingIdx] = snippet;
        else list.unshift(snippet);
        localStorage.setItem('querylab_snippets', JSON.stringify(list));
      } catch (e) {}
      return;
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('snippets', 'readwrite');
        const store = tx.objectStore('snippets');
        store.put(snippet);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (e) {
        resolve();
      }
    });
  }

  async loadSnippets() {
    if (!this.db) {
      try {
        return JSON.parse(localStorage.getItem('querylab_snippets') || '[]');
      } catch (e) {
        return [];
      }
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('snippets', 'readonly');
        const store = tx.objectStore('snippets');
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      } catch (e) {
        resolve([]);
      }
    });
  }

  async deleteSnippet(id) {
    if (!id) return;
    if (!this.db) {
      try {
        let list = JSON.parse(localStorage.getItem('querylab_snippets') || '[]');
        list = list.filter(s => s.id !== id);
        localStorage.setItem('querylab_snippets', JSON.stringify(list));
      } catch (e) {}
      return;
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('snippets', 'readwrite');
        const store = tx.objectStore('snippets');
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (e) {
        resolve();
      }
    });
  }
}

export const db = new QueryLabDB();
