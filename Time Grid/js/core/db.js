/**
 * TimeGrid - IndexedDB Storage Engine & Snapshot History
 * Persists time blocks, unscheduled task backlog, scenarios, and provides multi-level undo snapshots.
 */

import { getSampleScheduleData } from '../engine/sample-data.js';

const DB_NAME = 'TimeGrid_DB';
const DB_VERSION = 1;
const MAX_UNDO_STACK = 30;

class TimeGridDB {
  constructor() {
    this.db = null;
    this.undoStack = [];
  }

  async init() {
    return new Promise((resolve) => {
      try {
        const req = indexedDB.open(DB_NAME, DB_VERSION);

        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains('blocks')) {
            const store = db.createObjectStore('blocks', { keyPath: 'id' });
            store.createIndex('date', 'date', { unique: false });
          }
          if (!db.objectStoreNames.contains('backlog')) {
            db.createObjectStore('backlog', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('scenarios')) {
            db.createObjectStore('scenarios', { keyPath: 'id' });
          }
        };

        req.onsuccess = async (e) => {
          this.db = e.target.result;
          // Check if database is empty; if so populate with sample data
          const blocks = await this.getAllBlocks();
          if (blocks.length === 0) {
            const { blocks: sampleBlocks, backlogTasks } = getSampleScheduleData();
            for (const b of sampleBlocks) await this.saveBlock(b);
            for (const t of backlogTasks) await this.saveBacklogTask(t);
          }
          resolve(this.db);
        };

        req.onerror = () => {
          console.warn('IndexedDB unavailable, falling back to localStorage');
          this.initLocalStorageFallback();
          resolve(null);
        };
      } catch (err) {
        console.warn('IndexedDB open error, using localStorage fallback', err);
        this.initLocalStorageFallback();
        resolve(null);
      }
    });
  }

  initLocalStorageFallback() {
    try {
      const stored = localStorage.getItem('timegrid_blocks');
      if (!stored) {
        const { blocks, backlogTasks } = getSampleScheduleData();
        localStorage.setItem('timegrid_blocks', JSON.stringify(blocks));
        localStorage.setItem('timegrid_backlog', JSON.stringify(backlogTasks));
      }
    } catch (e) {
      console.error('LocalStorage error', e);
    }
  }

  pushUndoSnapshot(blocks, backlogTasks) {
    if (!Array.isArray(blocks) || !Array.isArray(backlogTasks)) return;
    this.undoStack.push({
      blocks: JSON.parse(JSON.stringify(blocks)),
      backlogTasks: JSON.parse(JSON.stringify(backlogTasks))
    });
    if (this.undoStack.length > MAX_UNDO_STACK) {
      this.undoStack.shift();
    }
  }

  hasUndoSnapshot() {
    return this.undoStack.length > 0;
  }

  popUndoSnapshot() {
    return this.undoStack.pop() || null;
  }

  async getAllBlocks() {
    if (!this.db) {
      try {
        const str = localStorage.getItem('timegrid_blocks');
        return str ? JSON.parse(str) : [];
      } catch (e) {
        console.warn('Corrupted localStorage timegrid_blocks, resetting', e);
        return [];
      }
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('blocks', 'readonly');
        const store = tx.objectStore('blocks');
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      } catch (e) {
        resolve([]);
      }
    });
  }

  async saveBlock(block) {
    if (!this.db) {
      const all = await this.getAllBlocks();
      const idx = all.findIndex(b => b.id === block.id);
      if (idx >= 0) all[idx] = block;
      else all.push(block);
      localStorage.setItem('timegrid_blocks', JSON.stringify(all));
      return block;
    }
    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction('blocks', 'readwrite');
        const store = tx.objectStore('blocks');
        store.put(block);
        tx.oncomplete = () => resolve(block);
        tx.onerror = () => reject(tx.error);
      } catch (e) {
        reject(e);
      }
    });
  }

  async deleteBlock(id) {
    if (!this.db) {
      let all = await this.getAllBlocks();
      all = all.filter(b => b.id !== id);
      localStorage.setItem('timegrid_blocks', JSON.stringify(all));
      return;
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('blocks', 'readwrite');
        const store = tx.objectStore('blocks');
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (e) {
        resolve();
      }
    });
  }

  async replaceAllBlocks(blocks) {
    if (!this.db) {
      localStorage.setItem('timegrid_blocks', JSON.stringify(blocks));
      return;
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('blocks', 'readwrite');
        const store = tx.objectStore('blocks');
        store.clear();
        for (const b of blocks) store.put(b);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (e) {
        resolve();
      }
    });
  }

  async getAllBacklogTasks() {
    if (!this.db) {
      try {
        const str = localStorage.getItem('timegrid_backlog');
        return str ? JSON.parse(str) : [];
      } catch (e) {
        console.warn('Corrupted localStorage timegrid_backlog, resetting', e);
        return [];
      }
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('backlog', 'readonly');
        const store = tx.objectStore('backlog');
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      } catch (e) {
        resolve([]);
      }
    });
  }

  async saveBacklogTask(task) {
    if (!this.db) {
      const all = await this.getAllBacklogTasks();
      const idx = all.findIndex(t => t.id === task.id);
      if (idx >= 0) all[idx] = task;
      else all.push(task);
      localStorage.setItem('timegrid_backlog', JSON.stringify(all));
      return task;
    }
    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction('backlog', 'readwrite');
        const store = tx.objectStore('backlog');
        store.put(task);
        tx.oncomplete = () => resolve(task);
        tx.onerror = () => reject(tx.error);
      } catch (e) {
        reject(e);
      }
    });
  }

  async deleteBacklogTask(id) {
    if (!this.db) {
      let all = await this.getAllBacklogTasks();
      all = all.filter(t => t.id !== id);
      localStorage.setItem('timegrid_backlog', JSON.stringify(all));
      return;
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('backlog', 'readwrite');
        const store = tx.objectStore('backlog');
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (e) {
        resolve();
      }
    });
  }

  async replaceAllBacklogTasks(tasks) {
    if (!this.db) {
      localStorage.setItem('timegrid_backlog', JSON.stringify(tasks));
      return;
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('backlog', 'readwrite');
        const store = tx.objectStore('backlog');
        store.clear();
        for (const t of tasks) store.put(t);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (e) {
        resolve();
      }
    });
  }

  async resetToSampleData() {
    const { blocks: sampleBlocks, backlogTasks } = getSampleScheduleData();
    if (!this.db) {
      localStorage.setItem('timegrid_blocks', JSON.stringify(sampleBlocks));
      localStorage.setItem('timegrid_backlog', JSON.stringify(backlogTasks));
      return;
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction(['blocks', 'backlog'], 'readwrite');
        tx.objectStore('blocks').clear();
        tx.objectStore('backlog').clear();
        for (const b of sampleBlocks) tx.objectStore('blocks').put(b);
        for (const t of backlogTasks) tx.objectStore('backlog').put(t);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (e) {
        resolve();
      }
    });
  }
}

export const db = new TimeGridDB();
