/**
 * ReceiptVault - IndexedDB Storage Engine
 * Offline persistence for document metadata, receipt images, tags, and settings.
 */

import { SAMPLE_DOCUMENTS } from '../engine/sample-data.js';

const DB_NAME = 'ReceiptVault_DB';
const DB_VERSION = 1;

class ReceiptVaultDB {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('documents')) {
          const store = db.createObjectStore('documents', { keyPath: 'id' });
          store.createIndex('category', 'category', { unique: false });
          store.createIndex('vendor', 'vendor', { unique: false });
          store.createIndex('purchaseDate', 'purchaseDate', { unique: false });
        }
      };

      req.onsuccess = async (e) => {
        this.db = e.target.result;
        // Check if database is empty, if so populate with demo receipts
        const docs = await this.getAllDocuments();
        if (docs.length === 0) {
          for (const doc of SAMPLE_DOCUMENTS) {
            await this.saveDocument(doc);
          }
        }
        resolve(this.db);
      };

      req.onerror = () => {
        console.warn('IndexedDB unavailable, falling back to localStorage');
        resolve(null);
      };
    });
  }

  async getAllDocuments() {
    if (!this.db) {
      const str = localStorage.getItem('receiptvault_docs');
      return str ? JSON.parse(str) : [...SAMPLE_DOCUMENTS];
    }
    return new Promise((resolve) => {
      const tx = this.db.transaction('documents', 'readonly');
      const store = tx.objectStore('documents');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }

  async saveDocument(doc) {
    if (!this.db) {
      const all = await this.getAllDocuments();
      const idx = all.findIndex(d => d.id === doc.id);
      if (idx >= 0) all[idx] = doc;
      else all.unshift(doc);
      localStorage.setItem('receiptvault_docs', JSON.stringify(all));
      return;
    }
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('documents', 'readwrite');
      const store = tx.objectStore('documents');
      store.put(doc);
      tx.oncomplete = () => resolve(doc);
      tx.onerror = () => reject(tx.error);
    });
  }

  async deleteDocument(id) {
    if (!this.db) {
      let all = await this.getAllDocuments();
      all = all.filter(d => d.id !== id);
      localStorage.setItem('receiptvault_docs', JSON.stringify(all));
      return;
    }
    return new Promise((resolve) => {
      const tx = this.db.transaction('documents', 'readwrite');
      const store = tx.objectStore('documents');
      store.delete(id);
      tx.oncomplete = () => resolve();
    });
  }

  async resetDemoData() {
    if (!this.db) {
      localStorage.setItem('receiptvault_docs', JSON.stringify(SAMPLE_DOCUMENTS));
      return;
    }
    const tx = this.db.transaction('documents', 'readwrite');
    const store = tx.objectStore('documents');
    store.clear();
    for (const doc of SAMPLE_DOCUMENTS) {
      store.put(doc);
    }
    return new Promise(resolve => {
      tx.oncomplete = () => resolve();
    });
  }
}

export const db = new ReceiptVaultDB();
