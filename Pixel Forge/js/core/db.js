/**
 * PixelForge - IndexedDB & LocalStorage Persistence Engine
 * Saves pixel art projects, multi-frame animations, layers, and custom palettes.
 * Robust fallback for offline and file:/// environments with corrupted data recovery.
 */

const DB_NAME = 'PixelForge_DB';
const DB_VERSION = 1;
const STORES = {
  PROJECTS: 'projects',
  SETTINGS: 'settings'
};

class PixelForgeDatabase {
  constructor() {
    this.db = null;
    this.memoryStore = new Map();
  }

  async init() {
    if (typeof indexedDB === 'undefined') {
      return null;
    }

    return new Promise((resolve) => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(STORES.PROJECTS)) {
            db.createObjectStore(STORES.PROJECTS, { keyPath: 'id' });
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
        console.warn('IndexedDB initialization error, using LocalStorage fallback:', err);
        resolve(null);
      }
    });
  }

  async saveProject(project) {
    if (!project || !project.id) return false;
    project.updatedAt = new Date().toISOString();

    if (this.db) {
      return new Promise((resolve) => {
        try {
          const tx = this.db.transaction([STORES.PROJECTS], 'readwrite');
          tx.objectStore(STORES.PROJECTS).put(project);
          tx.oncomplete = () => {
            try { localStorage.setItem('pixelforge_last_project_id', project.id); } catch(e) {}
            resolve(true);
          };
          tx.onerror = () => resolve(false);
        } catch (e) {
          resolve(false);
        }
      });
    }

    try {
      localStorage.setItem('pixelforge_proj_' + project.id, JSON.stringify(project));
      localStorage.setItem('pixelforge_last_project_id', project.id);
      return true;
    } catch (e) {
      this.memoryStore.set('pixelforge_proj_' + project.id, JSON.stringify(project));
      return true;
    }
  }

  async loadProject(id) {
    if (!id) return null;

    if (this.db) {
      return new Promise((resolve) => {
        try {
          const tx = this.db.transaction([STORES.PROJECTS], 'readonly');
          const req = tx.objectStore(STORES.PROJECTS).get(id);
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => resolve(null);
        } catch (e) {
          resolve(null);
        }
      });
    }

    try {
      const raw = localStorage.getItem('pixelforge_proj_' + id);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      const mem = this.memoryStore.get('pixelforge_proj_' + id);
      return mem ? JSON.parse(mem) : null;
    }
  }

  async deleteProject(id) {
    if (!id) return false;

    if (this.db) {
      return new Promise((resolve) => {
        try {
          const tx = this.db.transaction([STORES.PROJECTS], 'readwrite');
          tx.objectStore(STORES.PROJECTS).delete(id);
          tx.oncomplete = () => resolve(true);
          tx.onerror = () => resolve(false);
        } catch (e) {
          resolve(false);
        }
      });
    }

    try {
      localStorage.removeItem('pixelforge_proj_' + id);
      this.memoryStore.delete('pixelforge_proj_' + id);
      return true;
    } catch (e) {
      return false;
    }
  }

  async getAllProjects() {
    if (this.db) {
      return new Promise((resolve) => {
        try {
          const tx = this.db.transaction([STORES.PROJECTS], 'readonly');
          const req = tx.objectStore(STORES.PROJECTS).getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve([]);
        } catch (e) {
          resolve([]);
        }
      });
    }

    const list = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('pixelforge_proj_')) {
          try {
            const item = JSON.parse(localStorage.getItem(key));
            if (item && item.id) list.push(item);
          } catch (err) {}
        }
      }
    } catch (e) {}

    return list;
  }
}

export const db = new PixelForgeDatabase();
export default db;
