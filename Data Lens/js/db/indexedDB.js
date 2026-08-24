/**
 * DataLens - IndexedDB Persistence Layer
 * Handles robust local storage for datasets, dashboards, cleaning pipelines, and settings.
 * Includes in-memory and localStorage fallback if IndexedDB is unavailable or restricted.
 */

const DB_NAME = 'DataLensDB';
const DB_VERSION = 1;

class StorageService {
  constructor() {
    this.db = null;
    this.useFallback = false;
    this.fallbackStore = {
      datasets: {},
      dashboards: {},
      recipes: {},
      settings: {}
    };
  }

  async init() {
    if (this.db) return this.db;
    if (this.useFallback) return null;

    if (typeof indexedDB === 'undefined') {
      console.warn('IndexedDB unavailable; using fallback storage.');
      this.useFallback = true;
      this.loadFromLocalStorage();
      return null;
    }

    return new Promise((resolve) => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;

          // Datasets store
          if (!db.objectStoreNames.contains('datasets')) {
            const datasetStore = db.createObjectStore('datasets', { keyPath: 'id' });
            datasetStore.createIndex('name', 'name', { unique: false });
            datasetStore.createIndex('updatedAt', 'updatedAt', { unique: false });
          }

          // Dashboards store
          if (!db.objectStoreNames.contains('dashboards')) {
            const dashStore = db.createObjectStore('dashboards', { keyPath: 'id' });
            dashStore.createIndex('updatedAt', 'updatedAt', { unique: false });
          }

          // Recipes / Pipeline store
          if (!db.objectStoreNames.contains('recipes')) {
            db.createObjectStore('recipes', { keyPath: 'datasetId' });
          }

          // Settings / App state store
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', { keyPath: 'key' });
          }
        };

        request.onsuccess = (event) => {
          this.db = event.target.result;
          resolve(this.db);
        };

        request.onerror = (event) => {
          console.warn('IndexedDB failed to open; falling back to memory/localStorage:', event.target.error);
          this.useFallback = true;
          this.loadFromLocalStorage();
          resolve(null);
        };
      } catch (err) {
        console.warn('IndexedDB initialization exception:', err);
        this.useFallback = true;
        this.loadFromLocalStorage();
        resolve(null);
      }
    });
  }

  loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('datalens_fallback_store');
      if (saved) {
        this.fallbackStore = JSON.parse(saved);
      }
    } catch (e) {
      // Ignore private mode errors
    }
  }

  persistFallback() {
    try {
      localStorage.setItem('datalens_fallback_store', JSON.stringify(this.fallbackStore));
    } catch (e) {
      // In-memory only if localStorage is full or blocked
    }
  }

  /* Dataset Operations */
  async saveDataset(dataset) {
    await this.init();
    const item = {
      ...dataset,
      updatedAt: new Date().toISOString()
    };

    if (this.useFallback || !this.db) {
      this.fallbackStore.datasets[item.id] = item;
      this.persistFallback();
      return item;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('datasets', 'readwrite');
      const store = tx.objectStore('datasets');
      const req = store.put(item);
      req.onsuccess = () => resolve(item);
      req.onerror = () => reject(req.error);
    });
  }

  async getDatasets() {
    await this.init();
    if (this.useFallback || !this.db) {
      return Object.values(this.fallbackStore.datasets);
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('datasets', 'readonly');
      const store = tx.objectStore('datasets');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async getDataset(id) {
    await this.init();
    if (this.useFallback || !this.db) {
      return this.fallbackStore.datasets[id] || null;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('datasets', 'readonly');
      const store = tx.objectStore('datasets');
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async deleteDataset(id) {
    await this.init();
    if (this.useFallback || !this.db) {
      delete this.fallbackStore.datasets[id];
      delete this.fallbackStore.recipes[id];
      this.persistFallback();
      return true;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(['datasets', 'recipes'], 'readwrite');
      tx.objectStore('datasets').delete(id);
      tx.objectStore('recipes').delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  /* Dashboard Operations */
  async saveDashboard(dashboard) {
    await this.init();
    const item = {
      ...dashboard,
      updatedAt: new Date().toISOString()
    };

    if (this.useFallback || !this.db) {
      this.fallbackStore.dashboards[item.id] = item;
      this.persistFallback();
      return item;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('dashboards', 'readwrite');
      const store = tx.objectStore('dashboards');
      const req = store.put(item);
      req.onsuccess = () => resolve(item);
      req.onerror = () => reject(req.error);
    });
  }

  async getDashboards() {
    await this.init();
    if (this.useFallback || !this.db) {
      return Object.values(this.fallbackStore.dashboards);
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('dashboards', 'readonly');
      const store = tx.objectStore('dashboards');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async getDashboard(id) {
    await this.init();
    if (this.useFallback || !this.db) {
      return this.fallbackStore.dashboards[id] || null;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('dashboards', 'readonly');
      const store = tx.objectStore('dashboards');
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async deleteDashboard(id) {
    await this.init();
    if (this.useFallback || !this.db) {
      delete this.fallbackStore.dashboards[id];
      this.persistFallback();
      return true;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('dashboards', 'readwrite');
      const store = tx.objectStore('dashboards');
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  /* Recipe / Pipeline Operations */
  async saveRecipe(datasetId, steps) {
    await this.init();
    if (this.useFallback || !this.db) {
      this.fallbackStore.recipes[datasetId] = { datasetId, steps, updatedAt: new Date().toISOString() };
      this.persistFallback();
      return true;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('recipes', 'readwrite');
      const store = tx.objectStore('recipes');
      const req = store.put({ datasetId, steps, updatedAt: new Date().toISOString() });
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  async getRecipe(datasetId) {
    await this.init();
    if (this.useFallback || !this.db) {
      return this.fallbackStore.recipes[datasetId] ? this.fallbackStore.recipes[datasetId].steps : [];
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('recipes', 'readonly');
      const store = tx.objectStore('recipes');
      const req = store.get(datasetId);
      req.onsuccess = () => resolve(req.result ? req.result.steps : []);
      req.onerror = () => reject(req.error);
    });
  }

  /* App Settings Operations */
  async saveSetting(key, value) {
    await this.init();
    if (this.useFallback || !this.db) {
      this.fallbackStore.settings[key] = { key, value };
      this.persistFallback();
      return value;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('settings', 'readwrite');
      const store = tx.objectStore('settings');
      const req = store.put({ key, value });
      req.onsuccess = () => resolve(value);
      req.onerror = () => reject(req.error);
    });
  }

  async getSetting(key, defaultValue = null) {
    await this.init();
    if (this.useFallback || !this.db) {
      return this.fallbackStore.settings[key] ? this.fallbackStore.settings[key].value : defaultValue;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('settings', 'readonly');
      const store = tx.objectStore('settings');
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ? req.result.value : defaultValue);
      req.onerror = () => reject(req.error);
    });
  }

  /* Full Workspace Backup / Restore */
  async exportFullBackup() {
    const datasets = await this.getDatasets();
    const dashboards = await this.getDashboards();
    return {
      version: '1.0',
      appName: 'DataLens',
      exportedAt: new Date().toISOString(),
      datasets,
      dashboards
    };
  }

  async importFullBackup(backupData) {
    if (!backupData || !backupData.datasets) {
      throw new Error('Invalid DataLens project backup file');
    }
    for (const ds of backupData.datasets) {
      await this.saveDataset(ds);
    }
    if (Array.isArray(backupData.dashboards)) {
      for (const db of backupData.dashboards) {
        await this.saveDashboard(db);
      }
    }
    return true;
  }
}

// Global singleton instance
window.dataLensStorage = new StorageService();
