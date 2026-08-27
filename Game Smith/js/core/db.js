/**
 * GameSmith - IndexedDB Persistence Engine
 * Saves game projects, scenes, custom sprites, and settings locally in the browser with full LocalStorage fallback.
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
    if (typeof indexedDB === 'undefined') return null;

    return new Promise((resolve) => {
      try {
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
      } catch (err) {
        console.warn('IndexedDB init error:', err);
        resolve(null);
      }
    });
  }

  async saveProject(project) {
    if (!project || !project.id) return false;
    project.updatedAt = new Date().toISOString();

    if (this.db) {
      try {
        return await new Promise((resolve) => {
          const tx = this.db.transaction([STORES.PROJECTS], 'readwrite');
          const store = tx.objectStore(STORES.PROJECTS);
          store.put(project);
          tx.oncomplete = () => {
            try {
              localStorage.setItem('gamesmith_last_project_id', project.id);
            } catch (e) {}
            resolve(true);
          };
          tx.onerror = () => resolve(false);
        });
      } catch (e) {
        // Fallback to localStorage
      }
    }

    // LocalStorage fallback
    try {
      localStorage.setItem('gamesmith_project_' + project.id, JSON.stringify(project));
      localStorage.setItem('gamesmith_last_project_id', project.id);
      return true;
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
      return false;
    }
  }

  async loadProject(id) {
    if (!id) return null;

    if (this.db) {
      try {
        const res = await new Promise((resolve) => {
          const tx = this.db.transaction([STORES.PROJECTS], 'readonly');
          const store = tx.objectStore(STORES.PROJECTS);
          const req = store.get(id);
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => resolve(null);
        });
        if (res) return res;
      } catch (e) {}
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
      try {
        const dbList = await new Promise((resolve) => {
          const tx = this.db.transaction([STORES.PROJECTS], 'readonly');
          const store = tx.objectStore(STORES.PROJECTS);
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve([]);
        });
        if (dbList && dbList.length > 0) return dbList;
      } catch (e) {}
    }

    const list = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('gamesmith_project_')) {
          try {
            list.push(JSON.parse(localStorage.getItem(key)));
          } catch (e) {}
        }
      }
    } catch (e) {}
    return list;
  }

  async deleteProject(id) {
    if (!id) return;
    if (this.db) {
      try {
        const tx = this.db.transaction([STORES.PROJECTS], 'readwrite');
        tx.objectStore(STORES.PROJECTS).delete(id);
      } catch (e) {}
    }
    try {
      localStorage.removeItem('gamesmith_project_' + id);
    } catch (e) {}
  }

  async saveCustomSprite(sprite) {
    if (!sprite || !sprite.id) return false;
    if (this.db) {
      try {
        return await new Promise((resolve) => {
          const tx = this.db.transaction([STORES.SPRITES], 'readwrite');
          tx.objectStore(STORES.SPRITES).put(sprite);
          tx.oncomplete = () => resolve(true);
          tx.onerror = () => resolve(false);
        });
      } catch (e) {}
    }
    return true;
  }

  async getCustomSprites() {
    if (this.db) {
      try {
        return await new Promise((resolve) => {
          const tx = this.db.transaction([STORES.SPRITES], 'readonly');
          const req = tx.objectStore(STORES.SPRITES).getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve([]);
        });
      } catch (e) {}
    }
    return [];
  }
}

export const db = new GameDatabase();
export default db;
