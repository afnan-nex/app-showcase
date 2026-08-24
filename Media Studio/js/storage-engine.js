/**
 * MediaStudio — IndexedDB Storage Engine & Project File Serialization
 */

const DB_NAME = 'MediaStudio_DB';
const DB_VERSION = 1;
const STORE_NAME = 'projects';

class StorageEngine {
  constructor() {
    this.db = null;
    this.initPromise = this._initDb();
    this.currentProjectId = 'proj_' + Date.now();
    this.autoSaveTimer = null;
  }

  async _initDb() {
    if (typeof indexedDB === 'undefined') {
      return null;
    }
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('updatedAt', 'updatedAt', { unique: false });
          store.createIndex('name', 'name', { unique: false });
        }
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };

      request.onerror = (e) => {
        console.warn('IndexedDB failed to open, falling back to in-memory/localStorage:', e);
        resolve(null);
      };
    });
  }

  /**
   * Save or update project in IndexedDB
   */
  async saveProject(projectData) {
    await this.initPromise;
    if (!this.db) {
      // Fallback
      try {
        localStorage.setItem(`mediastudio_${projectData.id}`, JSON.stringify(projectData));
      } catch (err) {
        console.warn('LocalStorage save failed:', err);
      }
      return projectData.id;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction([STORE_NAME], 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const record = {
          ...projectData,
          id: projectData.id || this.currentProjectId,
          updatedAt: Date.now(),
          createdAt: projectData.createdAt || Date.now()
        };
        const req = store.put(record);

        req.onsuccess = () => resolve(record.id);
        req.onerror = (e) => reject(e);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Retrieve project by ID
   */
  async getProject(id) {
    await this.initPromise;
    if (!this.db) {
      const item = localStorage.getItem(`mediastudio_${id}`);
      return item ? JSON.parse(item) : null;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction([STORE_NAME], 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(id);

        req.onsuccess = () => resolve(req.result || null);
        req.onerror = (e) => reject(e);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * List all saved projects ordered by updated date descending
   */
  async listProjects() {
    await this.initPromise;
    if (!this.db) {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('mediastudio_'));
      return keys.map(k => JSON.parse(localStorage.getItem(k)));
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction([STORE_NAME], 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();

        req.onsuccess = () => {
          const list = req.result || [];
          list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
          resolve(list);
        };
        req.onerror = (e) => reject(e);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Delete a project by ID
   */
  async deleteProject(id) {
    await this.initPromise;
    if (!this.db) {
      localStorage.removeItem(`mediastudio_${id}`);
      return true;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction([STORE_NAME], 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);

        req.onsuccess = () => resolve(true);
        req.onerror = (e) => reject(e);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Export full project data as a downloadable `.mediastudio` JSON file
   */
  exportProjectFile(projectData) {
    const jsonStr = JSON.stringify(projectData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = (projectData.name || 'project').replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
    a.href = url;
    a.download = `${safeName}.mediastudio`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Parse an imported .mediastudio JSON file
   */
  async importProjectFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (!parsed.width || !parsed.height || !Array.isArray(parsed.layers)) {
            throw new Error('Invalid MediaStudio project format.');
          }
          resolve(parsed);
        } catch (err) {
          reject(new Error('Failed to parse project file: ' + err.message));
        }
      };
      reader.onerror = () => reject(new Error('Could not read file.'));
      reader.readAsText(file);
    });
  }

  /**
   * Auto-save debouncer
   */
  queueAutoSave(getProjectDataFn, onStatusChange) {
    if (this.autoSaveTimer) clearTimeout(this.autoSaveTimer);
    if (onStatusChange) onStatusChange('saving');

    this.autoSaveTimer = setTimeout(async () => {
      try {
        const data = getProjectDataFn();
        if (data) {
          await this.saveProject(data);
          if (onStatusChange) onStatusChange('saved');
        }
      } catch (err) {
        console.warn('Auto-save failed:', err);
        if (onStatusChange) onStatusChange('error');
      }
    }, 1200);
  }
}

export const storageEngine = new StorageEngine();
