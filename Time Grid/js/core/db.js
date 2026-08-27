/**
 * TimeGrid - IndexedDB Storage Engine
 * Persists time blocks, unscheduled task backlog, scenarios, and custom routines.
 */

import { getSampleScheduleData } from '../engine/sample-data.js';

const DB_NAME = 'TimeGrid_DB';
const DB_VERSION = 1;

class TimeGridDB {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve) => {
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
        resolve(null);
      };
    });
  }

  async getAllBlocks() {
    if (!this.db) {
      const str = localStorage.getItem('timegrid_blocks');
      return str ? JSON.parse(str) : [];
    }
    return new Promise((resolve) => {
      const tx = this.db.transaction('blocks', 'readonly');
      const store = tx.objectStore('blocks');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }

  async saveBlock(block) {
    if (!this.db) {
      const all = await this.getAllBlocks();
      const idx = all.findIndex(b => b.id === block.id);
      if (idx >= 0) all[idx] = block;
      else all.push(block);
      localStorage.setItem('timegrid_blocks', JSON.stringify(all));
      return;
    }
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('blocks', 'readwrite');
      const store = tx.objectStore('blocks');
      store.put(block);
      tx.oncomplete = () => resolve(block);
      tx.onerror = () => reject(tx.error);
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
      const tx = this.db.transaction('blocks', 'readwrite');
      const store = tx.objectStore('blocks');
      store.delete(id);
      tx.oncomplete = () => resolve();
    });
  }

  async getAllBacklogTasks() {
    if (!this.db) {
      const str = localStorage.getItem('timegrid_backlog');
      return str ? JSON.parse(str) : [];
    }
    return new Promise((resolve) => {
      const tx = this.db.transaction('backlog', 'readonly');
      const store = tx.objectStore('backlog');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }

  async saveBacklogTask(task) {
    if (!this.db) {
      const all = await this.getAllBacklogTasks();
      const idx = all.findIndex(t => t.id === task.id);
      if (idx >= 0) all[idx] = task;
      else all.push(task);
      localStorage.setItem('timegrid_backlog', JSON.stringify(all));
      return;
    }
    return new Promise((resolve) => {
      const tx = this.db.transaction('backlog', 'readwrite');
      const store = tx.objectStore('backlog');
      store.put(task);
      tx.oncomplete = () => resolve(task);
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
      const tx = this.db.transaction('backlog', 'readwrite');
      const store = tx.objectStore('backlog');
      store.delete(id);
      tx.oncomplete = () => resolve();
    });
  }

  async resetToSampleData() {
    const { blocks: sampleBlocks, backlogTasks } = getSampleScheduleData();
    if (!this.db) {
      localStorage.setItem('timegrid_blocks', JSON.stringify(sampleBlocks));
      localStorage.setItem('timegrid_backlog', JSON.stringify(backlogTasks));
      return;
    }
    const tx = this.db.transaction(['blocks', 'backlog'], 'readwrite');
    tx.objectStore('blocks').clear();
    tx.objectStore('backlog').clear();
    for (const b of sampleBlocks) tx.objectStore('blocks').put(b);
    for (const t of backlogTasks) tx.objectStore('backlog').put(t);
    return new Promise(resolve => {
      tx.oncomplete = () => resolve();
    });
  }
}

export const db = new TimeGridDB();
