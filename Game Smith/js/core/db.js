/**
 * GameSmith - IndexedDB Persistence Engine
 * Saves game projects, scenes, custom sprites, and settings locally in the browser.
 */

const DB_NAME = 'GameSmith_DB';
const DB_VERSION = 1;
const STORES = {
  PROJECTS: 'projects',
  SPRITES: 'custom_sprites',
  SETTINGS: 'settings'
};

class GameDatabase {
  constructor() {
    this.db = null;
  }

  async init() {
    if (typeof indexedDB === 'undefined') return;

    return new Promise((resolve) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORES.PROJECTS)) {
          db.createObjectStore(STORES.PROJECTS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.SPRITES)) {
          db.createObjectStore(STORES.SPRITES, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
        }
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };

      request.onerror = () => {
        console.warn('IndexedDB unavailable, using LocalStorage fallback.');
        resolve(null);
      };
    });
  }

  async saveProject(project) {
    if (!project || !project.id) return;
    project.updatedAt = new Date().toISOString();

    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction([STORES.PROJECTS], 'readwrite');
        const store = tx.objectStore(STORES.PROJECTS);
        store.put(project);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    }

    // LocalStorage fallback
    try {
      localStorage.setItem('gamesmith_project_' + project.id, JSON.stringify(project));
      localStorage.setItem('gamesmith_last_project_id', project.id);
    } catch (e) {}
  }

  async loadProject(id) {
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction([STORES.PROJECTS], 'readonly');
        const store = tx.objectStore(STORES.PROJECTS);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    }

    try {
      const raw = localStorage.getItem('gamesmith_project_' + id);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  async getAllProjects() {
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction([STORES.PROJECTS], 'readonly');
        const store = tx.objectStore(STORES.PROJECTS);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    }

    const list = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('gamesmith_project_')) {
          list.push(JSON.parse(localStorage.getItem(key)));
        }
      }
    } catch (e) {}
    return list;
  }

  async saveCustomSprite(sprite) {
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction([STORES.SPRITES], 'readwrite');
        tx.objectStore(STORES.SPRITES).put(sprite);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    }
  }

  async getCustomSprites() {
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction([STORES.SPRITES], 'readonly');
        const req = tx.objectStore(STORES.SPRITES).getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    }
    return [];
  }
}

export const db = new GameDatabase();
export default db;
