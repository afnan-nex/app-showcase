/**
 * VaultPass - Storage Engine (IndexedDB with LocalStorage fallback)
 * 
 * Manages persistent encrypted storage across object stores:
 * - vault_meta (Salt, Verifier payload, iterations, metadata)
 * - vault_entries (Encrypted entry records)
 * - vault_folders (Folder definitions)
 * - vault_settings (User preferences: auto-lock, clipboard delay, theme)
 */

const VaultStorage = (() => {
  'use strict';

  const DB_NAME = 'VaultPassDB';
  const DB_VERSION = 1;
  let dbInstance = null;

  // Initialize IndexedDB
  function openDB() {
    return new Promise((resolve, reject) => {
      if (dbInstance) {
        return resolve(dbInstance);
      }

      if (!window.indexedDB) {
        console.warn('IndexedDB not supported, falling back to LocalStorage');
        return resolve(null);
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains('vault_meta')) {
          db.createObjectStore('vault_meta', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('vault_entries')) {
          db.createObjectStore('vault_entries', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('vault_folders')) {
          db.createObjectStore('vault_folders', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('vault_settings')) {
          db.createObjectStore('vault_settings', { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        dbInstance = event.target.result;
        resolve(dbInstance);
      };

      request.onerror = (event) => {
        console.error('IndexedDB open error:', event.target.error);
        resolve(null); // Fallback to localStorage
      };
    });
  }

  // Generic IndexedDB Put
  async function dbPut(storeName, item) {
    const db = await openDB();
    if (!db) {
      // LocalStorage fallback
      const key = `vp_${storeName}_${item.id}`;
      localStorage.setItem(key, JSON.stringify(item));
      return item;
    }

    return new Promise((resolve, reject) => {
      const tx = db.transaction([storeName], 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(item);
      req.onsuccess = () => resolve(item);
      req.onerror = () => reject(req.error);
    });
  }

  // Generic IndexedDB Get
  async function dbGet(storeName, id) {
    const db = await openDB();
    if (!db) {
      const item = localStorage.getItem(`vp_${storeName}_${id}`);
      return item ? JSON.parse(item) : null;
    }

    return new Promise((resolve, reject) => {
      const tx = db.transaction([storeName], 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  // Generic IndexedDB GetAll
  async function dbGetAll(storeName) {
    const db = await openDB();
    if (!db) {
      const results = [];
      const prefix = `vp_${storeName}_`;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          results.push(JSON.parse(localStorage.getItem(key)));
        }
      }
      return results;
    }

    return new Promise((resolve, reject) => {
      const tx = db.transaction([storeName], 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  // Generic IndexedDB Delete
  async function dbDelete(storeName, id) {
    const db = await openDB();
    if (!db) {
      localStorage.removeItem(`vp_${storeName}_${id}`);
      return true;
    }

    return new Promise((resolve, reject) => {
      const tx = db.transaction([storeName], 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  // Clear an entire store
  async function dbClear(storeName) {
    const db = await openDB();
    if (!db) {
      const prefix = `vp_${storeName}_`;
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      return true;
    }

    return new Promise((resolve, reject) => {
      const tx = db.transaction([storeName], 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.clear();
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  // --- High-Level Vault Operations ---

  // Check if vault has been initialized
  async function hasVault() {
    const meta = await dbGet('vault_meta', 'meta');
    return !!(meta && meta.salt && meta.verifier);
  }

  // Get Vault Metadata (salt, verifier, hint, etc.)
  async function getVaultMeta() {
    return await dbGet('vault_meta', 'meta');
  }

  // Save Vault Metadata
  async function saveVaultMeta(meta) {
    return await dbPut('vault_meta', { id: 'meta', ...meta });
  }

  // Save Encrypted Entry
  async function saveEntry(entry) {
    return await dbPut('vault_entries', entry);
  }

  // Save Batch Entries
  async function saveEntries(entries) {
    for (const entry of entries) {
      await saveEntry(entry);
    }
  }

  // Get All Encrypted Entries
  async function getAllEntries() {
    return await dbGetAll('vault_entries');
  }

  // Delete Entry
  async function deleteEntry(id) {
    return await dbDelete('vault_entries', id);
  }

  // Save Folder
  async function saveFolder(folder) {
    return await dbPut('vault_folders', folder);
  }

  // Get All Folders
  async function getAllFolders() {
    return await dbGetAll('vault_folders');
  }

  // Delete Folder
  async function deleteFolder(id) {
    return await dbDelete('vault_folders', id);
  }

  // Get Settings
  async function getSettings() {
    const s = await dbGet('vault_settings', 'settings');
    return s || {
      id: 'settings',
      autoLockMinutes: 5,
      clipboardClearSeconds: 30,
      theme: 'dark',
      lockOnVisibilityHidden: true,
      showPasswordStrength: true
    };
  }

  // Save Settings
  async function saveSettings(settings) {
    return await dbPut('vault_settings', { id: 'settings', ...settings });
  }

  // Wipe Entire Database
  async function wipeDatabase() {
    try {
      await dbClear('vault_meta');
      await dbClear('vault_entries');
      await dbClear('vault_folders');
      await dbClear('vault_settings');
    } catch (e) {
      console.error('Error clearing stores:', e);
    }

    // Also clear localStorage keys matching prefix
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('vp_') || key.startsWith('vaultpass_'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  }

  return {
    openDB,
    hasVault,
    getVaultMeta,
    saveVaultMeta,
    saveEntry,
    saveEntries,
    getAllEntries,
    deleteEntry,
    saveFolder,
    getAllFolders,
    deleteFolder,
    getSettings,
    saveSettings,
    wipeDatabase
  };
})();
