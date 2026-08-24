/* ==========================================================================
   CANVASFLOW — Storage & Persistence
   IndexedDB Engine, LocalStorage Preferences, and JSON File Import/Export
   ========================================================================== */

import { validateBoardDocument, generateId } from './document-model.js';
import { eventBus } from './event-bus.js';

const DB_NAME = 'canvasflow_db';
const DB_VERSION = 1;
const STORE_BOARDS = 'boards';
const PREFS_KEY = 'canvasflow_preferences';

class StorageManager {
  constructor() {
    this.db = null;
    this.dbReady = this._initIndexedDB();
    this.autoSaveTimer = null;
  }

  /**
   * Initialize IndexedDB
   */
  async _initIndexedDB() {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        resolve(null);
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_BOARDS)) {
          const store = db.createObjectStore(STORE_BOARDS, { keyPath: 'id' });
          store.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('IndexedDB open error:', event.target.error);
        resolve(null);
      };
    });
  }

  /**
   * Save a board document into IndexedDB
   */
  async saveBoard(boardDoc) {
    await this.dbReady;
    boardDoc.updatedAt = Date.now();

    if (!this.db) {
      try {
        localStorage.setItem(`canvasflow_board_${boardDoc.id}`, JSON.stringify(boardDoc));
      } catch (e) {
        console.warn('Storage quota exceeded in fallback:', e);
      }
      return boardDoc;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([STORE_BOARDS], 'readwrite');
      const store = tx.objectStore(STORE_BOARDS);
      const req = store.put(boardDoc);

      req.onsuccess = () => {
        eventBus.emit('storage:saved', { id: boardDoc.id, time: boardDoc.updatedAt });
        resolve(boardDoc);
      };

      req.onerror = (e) => {
        console.error('Failed to save board:', e.target.error);
        reject(e.target.error);
      };
    });
  }

  /**
   * Load a board document by ID
   */
  async loadBoard(id) {
    await this.dbReady;

    if (!this.db) {
      const data = localStorage.getItem(`canvasflow_board_${id}`);
      return data ? JSON.parse(data) : null;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([STORE_BOARDS], 'readonly');
      const store = tx.objectStore(STORE_BOARDS);
      const req = store.get(id);

      req.onsuccess = () => {
        resolve(req.result || null);
      };

      req.onerror = (e) => {
        console.error('Failed to load board:', e.target.error);
        reject(e.target.error);
      };
    });
  }

  /**
   * List all stored boards metadata
   */
  async listBoards() {
    await this.dbReady;

    if (!this.db) {
      const boards = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('canvasflow_board_')) {
          try {
            const b = JSON.parse(localStorage.getItem(key));
            boards.push({ id: b.id, title: b.title, updatedAt: b.updatedAt, objectCount: b.objects?.length || 0 });
          } catch (err) {}
        }
      }
      return boards.sort((a, b) => b.updatedAt - a.updatedAt);
    }

    return new Promise((resolve) => {
      const tx = this.db.transaction([STORE_BOARDS], 'readonly');
      const store = tx.objectStore(STORE_BOARDS);
      const req = store.getAll();

      req.onsuccess = () => {
        const list = (req.result || []).map(b => ({
          id: b.id,
          title: b.title,
          updatedAt: b.updatedAt || 0,
          objectCount: b.objects?.length || 0
        })).sort((a, b) => b.updatedAt - a.updatedAt);
        resolve(list);
      };

      req.onerror = () => resolve([]);
    });
  }

  /**
   * Delete a board by ID
   */
  async deleteBoard(id) {
    await this.dbReady;

    if (!this.db) {
      localStorage.removeItem(`canvasflow_board_${id}`);
      return true;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([STORE_BOARDS], 'readwrite');
      const store = tx.objectStore(STORE_BOARDS);
      const req = store.delete(id);

      req.onsuccess = () => resolve(true);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  /**
   * Duplicate a board
   */
  async duplicateBoard(id) {
    const original = await this.loadBoard(id);
    if (!original) throw new Error('Board not found');

    const duplicate = JSON.parse(JSON.stringify(original));
    duplicate.id = generateId('board');
    duplicate.title = `${original.title} (Copy)`;
    duplicate.createdAt = Date.now();
    duplicate.updatedAt = Date.now();

    await this.saveBoard(duplicate);
    return duplicate;
  }

  /**
   * Debounced Auto-save
   */
  scheduleAutoSave(boardDoc, delay = 800) {
    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer);
    }

    eventBus.emit('storage:saving');

    this.autoSaveTimer = setTimeout(async () => {
      try {
        await this.saveBoard(boardDoc);
      } catch (err) {
        console.error('Auto-save error:', err);
      }
    }, delay);
  }

  /**
   * Preferences (localStorage)
   */
  getPreferences() {
    try {
      const prefs = localStorage.getItem(PREFS_KEY);
      return prefs ? JSON.parse(prefs) : {};
    } catch (e) {
      return {};
    }
  }

  savePreferences(prefs) {
    try {
      const existing = this.getPreferences();
      const merged = { ...existing, ...prefs };
      localStorage.setItem(PREFS_KEY, JSON.stringify(merged));
    } catch (e) {
      console.warn('Could not save preferences to localStorage:', e);
    }
  }

  /**
   * Export board as JSON file download
   */
  exportToJSONFile(boardDoc) {
    const jsonStr = JSON.stringify(boardDoc, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(boardDoc.title || 'board').toLowerCase().replace(/\s+/g, '-')}.canvasflow.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Parse JSON string and import board
   */
  importFromJSONString(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      const sanitized = validateBoardDocument(parsed);
      return sanitized;
    } catch (err) {
      throw new Error(`Failed to parse JSON board file: ${err.message}`);
    }
  }
}

export const storage = new StorageManager();
