/**
 * FlowPilot IndexedDB Storage Module
 */
class FlowDB {
  constructor() {
    this.dbName = 'FlowPilotDB';
    this.version = 1;
    this.db = null;
    this.isReady = false;
  }

  async init() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Workflows store
        if (!db.objectStoreNames.contains('workflows')) {
          const wfStore = db.createObjectStore('workflows', { keyPath: 'id' });
          wfStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }

        // Executions store
        if (!db.objectStoreNames.contains('executions')) {
          const execStore = db.createObjectStore('executions', { keyPath: 'id' });
          execStore.createIndex('workflowId', 'workflowId', { unique: false });
          execStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Workflow Version Snapshots store
        if (!db.objectStoreNames.contains('versions')) {
          const verStore = db.createObjectStore('versions', { keyPath: 'id' });
          verStore.createIndex('workflowId', 'workflowId', { unique: false });
          verStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Simulated Database Collections store
        if (!db.objectStoreNames.contains('sim_database')) {
          const dbSimStore = db.createObjectStore('sim_database', { keyPath: 'id' });
          dbSimStore.createIndex('table', 'table', { unique: false });
        }

        // App Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };

      request.onsuccess = async (event) => {
        this.db = event.target.result;
        this.isReady = true;
        await this.seedDefaultDataIfEmpty();
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('IndexedDB open error:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  async seedDefaultDataIfEmpty() {
    // Seed initial mock DB tables if empty
    const users = await this.dbTableFind('users', {});
    if (users.length === 0) {
      await this.dbTableInsert('users', { id: 'usr_1', name: 'Alice Smith', email: 'alice@example.com', role: 'admin', tier: 'VIP', active: true });
      await this.dbTableInsert('users', { id: 'usr_2', name: 'Bob Jones', email: 'bob@example.com', role: 'user', tier: 'Standard', active: true });
      await this.dbTableInsert('users', { id: 'usr_3', name: 'Charlie Ray', email: 'charlie@example.com', role: 'user', tier: 'Standard', active: false });
    }

    const orders = await this.dbTableFind('orders', {});
    if (orders.length === 0) {
      await this.dbTableInsert('orders', { id: 'ord_101', customerEmail: 'alice@example.com', amount: 150.00, items: ['Pro Subscription', 'Support Pack'], status: 'completed' });
      await this.dbTableInsert('orders', { id: 'ord_102', customerEmail: 'bob@example.com', amount: 49.99, items: ['Starter Pack'], status: 'pending' });
    }
  }

  // Workflows CRUD
  async saveWorkflow(workflow) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('workflows', 'readwrite');
      const store = tx.objectStore('workflows');
      const data = {
        ...workflow,
        updatedAt: new Date().toISOString()
      };
      const req = store.put(data);
      req.onsuccess = () => resolve(data);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async getWorkflow(id) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('workflows', 'readonly');
      const store = tx.objectStore('workflows');
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async getAllWorkflows() {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('workflows', 'readonly');
      const store = tx.objectStore('workflows');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async deleteWorkflow(id) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('workflows', 'readwrite');
      const store = tx.objectStore('workflows');
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  // Execution History
  async saveExecution(execution) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('executions', 'readwrite');
      const store = tx.objectStore('executions');
      const req = store.put(execution);
      req.onsuccess = () => resolve(execution);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async getExecutions(workflowId, limit = 30) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('executions', 'readonly');
      const store = tx.objectStore('executions');
      const index = store.index('workflowId');
      const req = index.getAll(workflowId);
      req.onsuccess = () => {
        const results = req.result || [];
        results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        resolve(results.slice(0, limit));
      };
      req.onerror = (e) => reject(e.target.error);
    });
  }

  // Version Snapshots
  async saveVersion(workflowId, versionName, workflowData) {
    await this.init();
    const versionEntry = {
      id: 'ver_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      workflowId,
      name: versionName || `Version ${new Date().toLocaleTimeString()}`,
      createdAt: new Date().toISOString(),
      data: JSON.parse(JSON.stringify(workflowData))
    };

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('versions', 'readwrite');
      const store = tx.objectStore('versions');
      const req = store.put(versionEntry);
      req.onsuccess = () => resolve(versionEntry);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async getVersions(workflowId) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('versions', 'readonly');
      const store = tx.objectStore('versions');
      const index = store.index('workflowId');
      const req = index.getAll(workflowId);
      req.onsuccess = () => {
        const results = req.result || [];
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        resolve(results);
      };
      req.onerror = (e) => reject(e.target.error);
    });
  }

  // Simulated Database Operations
  async dbTableInsert(table, record) {
    await this.init();
    const entry = {
      id: record.id || ('rec_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5)),
      table,
      data: record,
      createdAt: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('sim_database', 'readwrite');
      const store = tx.objectStore('sim_database');
      const req = store.put(entry);
      req.onsuccess = () => resolve(entry.data);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async dbTableFind(table, query = {}) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('sim_database', 'readonly');
      const store = tx.objectStore('sim_database');
      const index = store.index('table');
      const req = index.getAll(table);
      req.onsuccess = () => {
        let results = (req.result || []).map(r => r.data);
        if (query && Object.keys(query).length > 0) {
          results = results.filter(row => {
            return Object.entries(query).every(([k, v]) => {
              if (v === undefined || v === '') return true;
              return String(row[k]) === String(v);
            });
          });
        }
        resolve(results);
      };
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async dbTableUpdate(table, query = {}, updates = {}) {
    await this.init();
    const rows = await this.dbTableFindAllRaw(table);
    let updatedCount = 0;

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('sim_database', 'readwrite');
      const store = tx.objectStore('sim_database');

      rows.forEach(item => {
        const matches = Object.entries(query).every(([k, v]) => String(item.data[k]) === String(v));
        if (matches) {
          item.data = { ...item.data, ...updates };
          item.updatedAt = new Date().toISOString();
          store.put(item);
          updatedCount++;
        }
      });

      tx.oncomplete = () => resolve({ count: updatedCount });
      tx.onerror = (e) => reject(e.target.error);
    });
  }

  async dbTableDelete(table, query = {}) {
    await this.init();
    const rows = await this.dbTableFindAllRaw(table);
    let deletedCount = 0;

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('sim_database', 'readwrite');
      const store = tx.objectStore('sim_database');

      rows.forEach(item => {
        const matches = Object.entries(query).every(([k, v]) => String(item.data[k]) === String(v));
        if (matches) {
          store.delete(item.id);
          deletedCount++;
        }
      });

      tx.oncomplete = () => resolve({ count: deletedCount });
      tx.onerror = (e) => reject(e.target.error);
    });
  }

  async dbTableFindAllRaw(table) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('sim_database', 'readonly');
      const store = tx.objectStore('sim_database');
      const index = store.index('table');
      const req = index.getAll(table);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async dbGetAllTables() {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('sim_database', 'readonly');
      const store = tx.objectStore('sim_database');
      const req = store.getAll();
      req.onsuccess = () => {
        const tables = new Set();
        (req.result || []).forEach(r => tables.add(r.table));
        resolve(Array.from(tables));
      };
      req.onerror = (e) => reject(e.target.error);
    });
  }

  // App Settings
  async getSetting(key, defaultValue = null) {
    await this.init();
    return new Promise((resolve) => {
      const tx = this.db.transaction('settings', 'readonly');
      const store = tx.objectStore('settings');
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ? req.result.value : defaultValue);
      req.onerror = () => resolve(defaultValue);
    });
  }

  async saveSetting(key, value) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('settings', 'readwrite');
      const store = tx.objectStore('settings');
      const req = store.put({ key, value });
      req.onsuccess = () => resolve(value);
      req.onerror = (e) => reject(e.target.error);
    });
  }
}

// Global Singleton
window.flowDB = new FlowDB();
