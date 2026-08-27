/**
 * PixelForge - IndexedDB Persistence Engine
 * Saves pixel art projects, multi-frame animations, layers, and custom color palettes.
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
        tx.objectStore(STORES.PROJECTS).put(project);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    }

    try {
      localStorage.setItem('pixelforge_proj_' + project.id, JSON.stringify(project));
      localStorage.setItem('pixelforge_last_project_id', project.id);
    } catch (e) {}
  }

  async loadProject(id) {
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction([STORES.PROJECTS], 'readonly');
        const req = tx.objectStore(STORES.PROJECTS).get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    }

    try {
      const raw = localStorage.getItem('pixelforge_proj_' + id);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  async getAllProjects() {
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction([STORES.PROJECTS], 'readonly');
        const req = tx.objectStore(STORES.PROJECTS).getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    }

    const list = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('pixelforge_proj_')) {
          list.push(JSON.parse(localStorage.getItem(key)));
        }
      }
    } catch (e) {}
    return list;
  }
}

export const db = new PixelForgeDatabase();
export default db;
