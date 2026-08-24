/**
 * MeetSpace - IndexedDB & Local Storage Persistence Layer
 * Full CRUD, transaction management, schema migrations, and backup/restore
 */

const DB_NAME = 'MeetSpaceDB';
const DB_VERSION = 1;

class Database {
  constructor() {
    this.db = null;
    this.useLocalStorage = false;
  }

  async init() {
    if (!window.indexedDB) {
      console.warn('IndexedDB not supported, falling back to LocalStorage');
      this.useLocalStorage = true;
      return true;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Store for Meetings
        if (!db.objectStoreNames.contains('meetings')) {
          const meetingStore = db.createObjectStore('meetings', { keyPath: 'id' });
          meetingStore.createIndex('date', 'date', { unique: false });
          meetingStore.createIndex('status', 'status', { unique: false });
        }

        // Store for Action Items
        if (!db.objectStoreNames.contains('actionItems')) {
          const actionStore = db.createObjectStore('actionItems', { keyPath: 'id' });
          actionStore.createIndex('meetingId', 'meetingId', { unique: false });
          actionStore.createIndex('status', 'status', { unique: false });
          actionStore.createIndex('assignee', 'assignee', { unique: false });
        }

        // Store for Decisions
        if (!db.objectStoreNames.contains('decisions')) {
          const decisionStore = db.createObjectStore('decisions', { keyPath: 'id' });
          decisionStore.createIndex('meetingId', 'meetingId', { unique: false });
        }

        // Store for Polls
        if (!db.objectStoreNames.contains('polls')) {
          const pollStore = db.createObjectStore('polls', { keyPath: 'id' });
          pollStore.createIndex('meetingId', 'meetingId', { unique: false });
        }

        // Store for Settings & Metadata
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(true);
      };

      request.onerror = (event) => {
        console.error('IndexedDB init error, fallback to LocalStorage', event);
        this.useLocalStorage = true;
        resolve(true);
      };
    });
  }

  // Generic Put / Save
  async put(storeName, item) {
    if (this.useLocalStorage) {
      const all = this._getLocal(storeName);
      const idx = all.findIndex(x => (storeName === 'settings' ? x.key === item.key : x.id === item.id));
      if (idx >= 0) all[idx] = item;
      else all.push(item);
      this._setLocal(storeName, all);
      return item;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(item);
      req.onsuccess = () => resolve(item);
      req.onerror = (e) => reject(e);
    });
  }

  // Generic Get
  async get(storeName, key) {
    if (this.useLocalStorage) {
      const all = this._getLocal(storeName);
      return all.find(x => (storeName === 'settings' ? x.key === key : x.id === key)) || null;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = (e) => reject(e);
    });
  }

  // Generic GetAll
  async getAll(storeName) {
    if (this.useLocalStorage) {
      return this._getLocal(storeName);
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = (e) => reject(e);
    });
  }

  // Generic Delete
  async delete(storeName, key) {
    if (this.useLocalStorage) {
      let all = this._getLocal(storeName);
      all = all.filter(x => (storeName === 'settings' ? x.key !== key : x.id !== key));
      this._setLocal(storeName, all);
      return true;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(key);
      req.onsuccess = () => resolve(true);
      req.onerror = (e) => reject(e);
    });
  }

  // Clear Store
  async clear(storeName) {
    if (this.useLocalStorage) {
      localStorage.removeItem(`meetspace_${storeName}`);
      return true;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.clear();
      req.onsuccess = () => resolve(true);
      req.onerror = (e) => reject(e);
    });
  }

  // Full DB Export
  async exportFullDatabase() {
    const stores = ['meetings', 'actionItems', 'decisions', 'polls', 'settings'];
    const dump = {
      version: 1,
      exportedAt: new Date().toISOString(),
      data: {}
    };

    for (const s of stores) {
      dump.data[s] = await this.getAll(s);
    }
    return dump;
  }

  // Full DB Import
  async importFullDatabase(dump) {
    if (!dump || !dump.data) throw new Error('Invalid backup format');
    const stores = ['meetings', 'actionItems', 'decisions', 'polls', 'settings'];

    for (const s of stores) {
      await this.clear(s);
      const items = dump.data[s] || [];
      for (const item of items) {
        await this.put(s, item);
      }
    }
    return true;
  }

  // LocalStorage Fallback Helpers
  _getLocal(storeName) {
    try {
      const raw = localStorage.getItem(`meetspace_${storeName}`);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  _setLocal(storeName, data) {
    try {
      localStorage.setItem(`meetspace_${storeName}`, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage write failed:', e);
    }
  }
}

const AppDB = new Database();
