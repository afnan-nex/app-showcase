/* ==========================================================================
   WIREFRAMELAB - INDEXEDDB STORAGE PERSISTENCE
   ========================================================================== */

const DB_NAME = 'WireframeLabDB';
const DB_VERSION = 1;
const STORE_PROJECTS = 'projects';
const STORE_SETTINGS = 'settings';

let dbInstance = null;

export async function initDB() {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_PROJECTS)) {
        db.createObjectStore(STORE_PROJECTS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
        db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
      reject(event.target.error);
    };
  });
}

export async function saveProject(project) {
  try {
    const db = await initDB();
    project.updatedAt = Date.now();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PROJECTS, 'readwrite');
      const store = tx.objectStore(STORE_PROJECTS);
      const req = store.put(project);

      req.onsuccess = () => resolve(project);
      req.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.warn('Fallback saving to localStorage:', err);
    try {
      localStorage.setItem(`wf_proj_${project.id}`, JSON.stringify(project));
      return project;
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
      return null;
    }
  }
}

export async function getProject(id) {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PROJECTS, 'readonly');
      const store = tx.objectStore(STORE_PROJECTS);
      const req = store.get(id);

      req.onsuccess = () => resolve(req.result || null);
      req.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    const data = localStorage.getItem(`wf_proj_${id}`);
    return data ? JSON.parse(data) : null;
  }
}

export async function getAllProjects() {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PROJECTS, 'readonly');
      const store = tx.objectStore(STORE_PROJECTS);
      const req = store.getAll();

      req.onsuccess = () => {
        const list = req.result || [];
        list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
        resolve(list);
      };
      req.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    const list = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('wf_proj_')) {
        try {
          list.push(JSON.parse(localStorage.getItem(key)));
        } catch (e) {}
      }
    }
    list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    return list;
  }
}

export async function deleteProject(id) {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PROJECTS, 'readwrite');
      const store = tx.objectStore(STORE_PROJECTS);
      const req = store.delete(id);

      req.onsuccess = () => resolve(true);
      req.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    localStorage.removeItem(`wf_proj_${id}`);
    return true;
  }
}

export async function setActiveProjectId(id) {
  try {
    const db = await initDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_SETTINGS, 'readwrite');
      const store = tx.objectStore(STORE_SETTINGS);
      store.put({ key: 'activeProjectId', value: id });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (err) {
    localStorage.setItem('wf_active_project_id', id);
  }
}

export async function getActiveProjectId() {
  try {
    const db = await initDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_SETTINGS, 'readonly');
      const store = tx.objectStore(STORE_SETTINGS);
      const req = store.get('activeProjectId');
      req.onsuccess = () => resolve(req.result ? req.result.value : null);
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    return localStorage.getItem('wf_active_project_id');
  }
}
