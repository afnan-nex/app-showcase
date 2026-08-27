/**
 * ReceiptVault - IndexedDB & LocalStorage Engine
 * Offline persistence for document records, image data URLs, tags, and settings.
 * Resilient against corrupted data and private browser restrictions.
 */

import { SAMPLE_DOCUMENTS } from '../engine/sample-data.js';

const DB_NAME = 'ReceiptVault_DB';
const DB_VERSION = 1;
const LOCALSTORAGE_KEY = 'receiptvault_documents_v1';

class ReceiptVaultDB {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve) => {
      try {
        if (!window.indexedDB) {
          console.warn('IndexedDB not supported, falling back to localStorage');
          this.initLocalStorageFallback();
          return resolve(null);
        }

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
          const docs = await this.getAllDocuments();
          if (docs.length === 0) {
            for (const doc of SAMPLE_DOCUMENTS) {
              await this.saveDocument(doc);
            }
          }
          resolve(this.db);
        };

        req.onerror = () => {
          console.warn('IndexedDB permission denied/unavailable, using localStorage fallback');
          this.initLocalStorageFallback();
          resolve(null);
        };
      } catch (err) {
        console.warn('IndexedDB init exception, using localStorage fallback', err);
        this.initLocalStorageFallback();
        resolve(null);
      }
    });
  }

  initLocalStorageFallback() {
    const existing = localStorage.getItem(LOCALSTORAGE_KEY);
    if (!existing) {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(SAMPLE_DOCUMENTS));
    }
  }

  async getAllDocuments() {
    if (!this.db) {
      try {
        const str = localStorage.getItem(LOCALSTORAGE_KEY);
        if (!str) return [...SAMPLE_DOCUMENTS];
        const parsed = JSON.parse(str);
        return Array.isArray(parsed) ? parsed : [...SAMPLE_DOCUMENTS];
      } catch (e) {
        console.warn('Corrupted localStorage, resetting to demo sample', e);
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(SAMPLE_DOCUMENTS));
        return [...SAMPLE_DOCUMENTS];
      }
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('documents', 'readonly');
        const store = tx.objectStore('documents');
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([...SAMPLE_DOCUMENTS]);
      } catch (err) {
        resolve([...SAMPLE_DOCUMENTS]);
      }
    });
  }

  async saveDocument(doc) {
    if (!doc || !doc.id) return null;

    // Sanitize document properties
    const sanitized = {
      id: String(doc.id),
      title: String(doc.title || 'Untitled Document').trim(),
      vendor: String(doc.vendor || 'Unknown Vendor').trim(),
      vendorAddress: doc.vendorAddress ? String(doc.vendorAddress).trim() : '',
      vendorPhone: doc.vendorPhone ? String(doc.vendorPhone).trim() : '',
      invoiceNumber: doc.invoiceNumber ? String(doc.invoiceNumber).trim() : '',
      serialNumber: doc.serialNumber ? String(doc.serialNumber).trim() : '',
      amount: parseFloat(doc.amount) || 0,
      taxAmount: parseFloat(doc.taxAmount) || 0,
      currency: doc.currency || '$',
      purchaseDate: doc.purchaseDate || new Date().toISOString().split('T')[0],
      category: doc.category || 'Other',
      paymentMethod: doc.paymentMethod || 'Credit Card',
      warrantyType: doc.warrantyType || '',
      warrantyProvider: doc.warrantyProvider || '',
      warrantyExpirationDate: doc.warrantyExpirationDate || null,
      returnDeadlineDate: doc.returnDeadlineDate || null,
      returnPolicy: doc.returnPolicy || '',
      supportUrl: doc.supportUrl || '',
      notes: doc.notes || '',
      tags: Array.isArray(doc.tags) ? doc.tags : [],
      fileName: doc.fileName || `${doc.vendor || 'receipt'}.png`,
      items: Array.isArray(doc.items) ? doc.items : [],
      customImageData: doc.customImageData || null
    };

    if (!this.db) {
      const all = await this.getAllDocuments();
      const idx = all.findIndex(d => d.id === sanitized.id);
      if (idx >= 0) all[idx] = sanitized;
      else all.unshift(sanitized);
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(all));
      return sanitized;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction('documents', 'readwrite');
        const store = tx.objectStore('documents');
        store.put(sanitized);
        tx.oncomplete = () => resolve(sanitized);
        tx.onerror = () => reject(tx.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  async deleteDocument(id) {
    if (!id) return;
    if (!this.db) {
      let all = await this.getAllDocuments();
      all = all.filter(d => d.id !== id);
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(all));
      return;
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('documents', 'readwrite');
        const store = tx.objectStore('documents');
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (err) {
        resolve();
      }
    });
  }

  async resetDemoData() {
    if (!this.db) {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(SAMPLE_DOCUMENTS));
      return;
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('documents', 'readwrite');
        const store = tx.objectStore('documents');
        store.clear();
        for (const doc of SAMPLE_DOCUMENTS) {
          store.put(doc);
        }
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (err) {
        resolve();
      }
    });
  }
}

export const db = new ReceiptVaultDB();
