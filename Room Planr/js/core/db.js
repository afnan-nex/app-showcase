/**
 * RoomPlanr - IndexedDB Storage Engine
 * Persists room projects, layout scenarios, and custom furniture offline.
 */

import { SAMPLE_ROOMS } from '../engine/sample-rooms.js';

const DB_NAME = 'RoomPlanr_DB';
const DB_VERSION = 1;

class RoomPlanrDB {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('rooms')) {
          db.createObjectStore('rooms', { keyPath: 'id' });
        }
      };

      req.onsuccess = async (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };

      req.onerror = () => {
        console.warn('IndexedDB unavailable, falling back to localStorage');
        resolve(null);
      };
    });
  }

  async saveRoom(room) {
    if (!this.db) {
      localStorage.setItem('roomplanr_room_' + room.id, JSON.stringify(room));
      return;
    }
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('rooms', 'readwrite');
      const store = tx.objectStore('rooms');
      store.put(room);
      tx.oncomplete = () => resolve(room);
      tx.onerror = () => reject(tx.error);
    });
  }

  async loadRoom(id) {
    if (!this.db) {
      const str = localStorage.getItem('roomplanr_room_' + id);
      return str ? JSON.parse(str) : null;
    }
    return new Promise((resolve) => {
      const tx = this.db.transaction('rooms', 'readonly');
      const store = tx.objectStore('rooms');
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  }
}

export const db = new RoomPlanrDB();
