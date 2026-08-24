/**
 * NoteSpace - IndexedDB & LocalStorage Hybrid Storage Engine
 * High-performance, offline-ready with automatic schema creation and robust fallback.
 */
class NoteSpaceDB {
  constructor() {
    this.dbName = 'NoteSpaceDB';
    this.dbVersion = 3;
    this.db = null;
    this.useLocalStorage = false;
    this.readyPromise = this.init();
  }

  async init() {
    if (!window.indexedDB) {
      console.warn('[NoteSpace DB] IndexedDB not supported. Falling back to LocalStorage.');
      this.useLocalStorage = true;
      return true;
    }

    return new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(this.dbName, this.dbVersion);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          
          const storeNames = ['workspaces', 'pages', 'blocks', 'databases', 'revisions', 'settings'];
          storeNames.forEach(name => {
            if (!db.objectStoreNames.contains(name)) {
              db.createObjectStore(name, { keyPath: name === 'settings' ? 'key' : 'id' });
            }
          });
        };

        request.onsuccess = (event) => {
          this.db = event.target.result;
          resolve(true);
        };

        request.onerror = (event) => {
          console.error('[NoteSpace DB] IndexedDB error, falling back to LocalStorage:', event.target.error);
          this.useLocalStorage = true;
          resolve(false);
        };
      } catch (err) {
        console.error('[NoteSpace DB] Exception initializing IndexedDB:', err);
        this.useLocalStorage = true;
        resolve(false);
      }
    });
  }

  async ensureReady() {
    await this.readyPromise;
  }

  // --- Generic Store Operations ---

  async getAll(storeName) {
    await this.ensureReady();
    if (this.useLocalStorage) {
      try {
        const data = localStorage.getItem(`ns_${storeName}`);
        return data ? JSON.parse(data) : [];
      } catch (e) {
        return [];
      }
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => {
          console.warn(`[NoteSpace DB] Read error for ${storeName}, falling back to localStorage`);
          this.useLocalStorage = true;
          this.getAll(storeName).then(resolve);
        };
      } catch (e) {
        this.useLocalStorage = true;
        this.getAll(storeName).then(resolve);
      }
    });
  }

  async get(storeName, key) {
    await this.ensureReady();
    if (this.useLocalStorage) {
      const items = await this.getAll(storeName);
      return items.find(item => (item.id === key || item.key === key)) || null;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => {
          this.useLocalStorage = true;
          this.get(storeName, key).then(resolve);
        };
      } catch (e) {
        this.useLocalStorage = true;
        this.get(storeName, key).then(resolve);
      }
    });
  }

  async put(storeName, item) {
    await this.ensureReady();
    if (this.useLocalStorage) {
      const items = await this.getAll(storeName);
      const keyProp = item.id !== undefined ? 'id' : 'key';
      const idx = items.findIndex(i => i[keyProp] === item[keyProp]);
      if (idx >= 0) items[idx] = item;
      else items.push(item);
      localStorage.setItem(`ns_${storeName}`, JSON.stringify(items));
      return item;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.put(item);
        req.onsuccess = () => resolve(item);
        req.onerror = () => {
          this.useLocalStorage = true;
          this.put(storeName, item).then(resolve);
        };
      } catch (e) {
        this.useLocalStorage = true;
        this.put(storeName, item).then(resolve);
      }
    });
  }

  async putMany(storeName, items) {
    await this.ensureReady();
    if (!items || items.length === 0) return [];

    if (this.useLocalStorage) {
      const existing = await this.getAll(storeName);
      const keyProp = items[0] && items[0].id !== undefined ? 'id' : 'key';
      const map = new Map(existing.map(i => [i[keyProp], i]));
      items.forEach(i => map.set(i[keyProp], i));
      localStorage.setItem(`ns_${storeName}`, JSON.stringify(Array.from(map.values())));
      return items;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        items.forEach(item => store.put(item));
        tx.oncomplete = () => resolve(items);
        tx.onerror = () => {
          this.useLocalStorage = true;
          this.putMany(storeName, items).then(resolve);
        };
      } catch (e) {
        this.useLocalStorage = true;
        this.putMany(storeName, items).then(resolve);
      }
    });
  }

  async delete(storeName, key) {
    await this.ensureReady();
    if (this.useLocalStorage) {
      const items = await this.getAll(storeName);
      const filtered = items.filter(i => (i.id !== key && i.key !== key));
      localStorage.setItem(`ns_${storeName}`, JSON.stringify(filtered));
      return true;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.delete(key);
        req.onsuccess = () => resolve(true);
        req.onerror = () => {
          this.useLocalStorage = true;
          this.delete(storeName, key).then(resolve);
        };
      } catch (e) {
        this.useLocalStorage = true;
        this.delete(storeName, key).then(resolve);
      }
    });
  }

  // --- High Level Domain Operations ---

  async getPages(workspaceId) {
    const pages = await this.getAll('pages');
    return pages
      .filter(p => !workspaceId || p.workspaceId === workspaceId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async getPage(pageId) {
    return await this.get('pages', pageId);
  }

  async savePage(page) {
    page.updatedAt = Date.now();
    if (!page.createdAt) page.createdAt = Date.now();
    return await this.put('pages', page);
  }

  async getBlocks(pageId) {
    const blocks = await this.getAll('blocks');
    return blocks
      .filter(b => b.pageId === pageId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async saveBlocks(pageId, blocks) {
    await this.ensureReady();
    const existing = await this.getAll('blocks');
    const oldForPage = existing.filter(b => b.pageId === pageId);
    
    // Assign correct pageId and order
    const now = Date.now();
    const updated = (blocks || []).map((b, idx) => ({
      ...b,
      pageId,
      order: idx,
      updatedAt: now,
      createdAt: b.createdAt || now
    }));

    if (this.useLocalStorage) {
      const keep = existing.filter(b => b.pageId !== pageId);
      localStorage.setItem('ns_blocks', JSON.stringify([...keep, ...updated]));
      return updated;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('blocks', 'readwrite');
        const store = tx.objectStore('blocks');
        
        // Delete previous blocks for this page by ID
        oldForPage.forEach(b => {
          if (b.id) store.delete(b.id);
        });

        // Insert updated blocks
        updated.forEach(b => store.put(b));

        tx.oncomplete = () => resolve(updated);
        tx.onerror = () => {
          this.useLocalStorage = true;
          this.saveBlocks(pageId, blocks).then(resolve);
        };
      } catch (e) {
        this.useLocalStorage = true;
        this.saveBlocks(pageId, blocks).then(resolve);
      }
    });
  }

  async getDatabase(pageId) {
    const databases = await this.getAll('databases');
    return databases.find(d => d.pageId === pageId) || null;
  }

  async saveDatabase(database) {
    if (!database) return null;
    database.updatedAt = Date.now();
    return await this.put('databases', database);
  }

  // --- Revisions ---
  async saveRevision(pageId, snapshot) {
    const rev = {
      id: 'rev_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      pageId,
      title: snapshot.title || 'Untitled',
      icon: snapshot.icon || null,
      cover: snapshot.cover || null,
      blocks: snapshot.blocks || [],
      database: snapshot.database || null,
      timestamp: Date.now()
    };
    await this.put('revisions', rev);

    // Keep only last 30 revisions per page
    const revisions = await this.getRevisions(pageId);
    if (revisions.length > 30) {
      const toDelete = revisions.slice(30);
      for (const r of toDelete) {
        await this.delete('revisions', r.id);
      }
    }
    return rev;
  }

  async getRevisions(pageId) {
    const revs = await this.getAll('revisions');
    return revs
      .filter(r => r.pageId === pageId)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  // --- Settings ---
  async getSetting(key, defaultValue = null) {
    const item = await this.get('settings', key);
    return item ? item.value : defaultValue;
  }

  async setSetting(key, value) {
    return await this.put('settings', { key, value });
  }

  // --- Full Workspace Export & Import ---
  async exportFullData() {
    const workspaces = await this.getAll('workspaces');
    const pages = await this.getAll('pages');
    const blocks = await this.getAll('blocks');
    const databases = await this.getAll('databases');
    const settings = await this.getAll('settings');

    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      appName: 'NoteSpace',
      data: {
        workspaces,
        pages,
        blocks,
        databases,
        settings
      }
    };
  }

  async importFullData(importObj) {
    if (!importObj || !importObj.data) {
      throw new Error('Invalid NoteSpace backup file format');
    }

    const { workspaces, pages, blocks, databases, settings } = importObj.data;

    if (!Array.isArray(pages) || !Array.isArray(blocks)) {
      throw new Error('Invalid backup schema: missing pages or blocks array');
    }

    if (workspaces && workspaces.length) await this.putMany('workspaces', workspaces);
    if (pages && pages.length) await this.putMany('pages', pages);
    if (blocks && blocks.length) await this.putMany('blocks', blocks);
    if (databases && databases.length) await this.putMany('databases', databases);
    if (settings && settings.length) await this.putMany('settings', settings);

    return true;
  }

  async clearAll() {
    await this.ensureReady();
    const stores = ['workspaces', 'pages', 'blocks', 'databases', 'revisions', 'settings'];
    if (this.useLocalStorage) {
      stores.forEach(s => localStorage.removeItem(`ns_${s}`));
      return true;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction(stores, 'readwrite');
        stores.forEach(s => tx.objectStore(s).clear());
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }
}

window.NoteSpaceDB = new NoteSpaceDB();
