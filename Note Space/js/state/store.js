/**
 * NoteSpace - Reactive Centralized Store
 * Coordinates in-memory state, IndexedDB persistence, auto-save debounce, and event dispatch.
 */

import { db } from '../db/idb.js';
import { generateStarterWorkspace } from '../db/defaultData.js';

class Store {
  constructor() {
    this.pages = new Map();
    this.databases = new Map();
    this.settings = new Map();
    this.activePageId = null;
    this.listeners = new Map();
    this.saveTimeout = null;
    this.saveStatus = 'saved'; // 'saved' | 'saving' | 'error'
    this.isInitialized = false;
  }

  // --- Event Pub/Sub ---

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try {
          cb(data);
        } catch (e) {
          console.error(`Error in event listener for "${event}":`, e);
        }
      });
    }
  }

  // --- Initialization ---

  async init() {
    try {
      await db.init();

      // Check if pages exist
      let pages = await db.getAll('pages');
      let databases = await db.getAll('databases');
      let settings = await db.getAll('settings');

      if (!pages || pages.length === 0) {
        const starter = generateStarterWorkspace();
        await db.putBatch('pages', starter.pages);
        await db.putBatch('databases', starter.databases);
        await db.putBatch('settings', starter.settings);

        pages = starter.pages;
        databases = starter.databases;
        settings = starter.settings;
      }

      // Populate in-memory maps
      pages.forEach(p => this.pages.set(p.id, p));
      databases.forEach(d => this.databases.set(d.id, d));
      settings.forEach(s => this.settings.set(s.key, s.value));
    } catch (err) {
      console.warn('Storage read exception, loading memory starter workspace:', err);
      const starter = generateStarterWorkspace();
      starter.pages.forEach(p => this.pages.set(p.id, p));
      starter.databases.forEach(d => this.databases.set(d.id, d));
      starter.settings.forEach(s => this.settings.set(s.key, s.value));
    }

    // Determine initial active page
    let activeId = this.getSetting('activePageId');
    const validPages = Array.from(this.pages.values()).filter(p => !p.isTrash);
    if (!activeId || !this.pages.has(activeId) || this.pages.get(activeId).isTrash) {
      activeId = validPages.length > 0 ? validPages[0].id : null;
    }

    this.activePageId = activeId;
    this.isInitialized = true;

    if (this.activePageId) {
      this.recordRecentPage(this.activePageId);
    }

    this.emit('initialized', { activePageId: this.activePageId });
  }

  // --- Settings Helpers ---

  getSetting(key, defaultValue = null) {
    return this.settings.has(key) ? this.settings.get(key) : defaultValue;
  }

  async setSetting(key, value) {
    this.settings.set(key, value);
    await db.put('settings', { key, value });
    this.emit(`setting:${key}`, value);
    this.emit('settings-updated', { key, value });
  }

  // --- Autosave & Save Status ---

  setSaveStatus(status) {
    this.saveStatus = status;
    this.emit('save-status', status);
  }

  scheduleSave(type, item) {
    this.setSaveStatus('saving');
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(async () => {
      try {
        if (type === 'page') {
          await db.put('pages', item);
        } else if (type === 'database') {
          await db.put('databases', item);
        }
        this.setSaveStatus('saved');
      } catch (err) {
        console.error('Autosave error:', err);
        this.setSaveStatus('error');
      }
    }, 400);
  }

  // --- Page Operations ---

  getPage(id) {
    return this.pages.get(id) || null;
  }

  getAllPages() {
    return Array.from(this.pages.values());
  }

  getActivePage() {
    return this.getPage(this.activePageId);
  }

  async setActivePage(id) {
    if (this.pages.has(id)) {
      this.activePageId = id;
      this.setSetting('activePageId', id);
      this.recordRecentPage(id);
      this.emit('active-page-changed', this.getPage(id));
    }
  }

  recordRecentPage(id) {
    let recents = this.getSetting('recentPageIds', []) || [];
    recents = recents.filter(pageId => pageId !== id && this.pages.has(pageId) && !this.pages.get(pageId).isTrash);
    recents.unshift(id);
    recents = recents.slice(0, 8); // Keep top 8 recent
    this.setSetting('recentPageIds', recents);
    this.emit('recents-updated', recents);
  }

  async createPage(options = {}) {
    const id = 'page-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const parentId = options.parentId || null;
    const title = options.title || 'Untitled';
    const icon = options.icon || '📄';
    const cover = options.cover || null;

    // Calculate order
    const siblings = this.getAllPages().filter(p => p.parentId === parentId && !p.isTrash);
    const order = siblings.length;

    const newPage = {
      id,
      title,
      icon,
      cover,
      parentId,
      order,
      isFavorite: false,
      isTrash: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      blocks: options.blocks || [
        {
          id: 'b-' + Date.now() + '-1',
          type: 'paragraph',
          content: ''
        }
      ],
      databaseId: options.databaseId || null
    };

    this.pages.set(id, newPage);
    await db.put('pages', newPage);

    // Save initial snapshot to history
    await this.createPageSnapshot(newPage, 'Page created');

    this.emit('page-created', newPage);
    this.emit('page-list-updated');
    await this.setActivePage(id);
    return newPage;
  }

  async updatePage(id, partial, skipHistory = false) {
    const page = this.pages.get(id);
    if (!page) return null;

    const oldBlocks = page.blocks;
    const updated = {
      ...page,
      ...partial,
      updatedAt: Date.now()
    };

    this.pages.set(id, updated);
    this.scheduleSave('page', updated);
    this.emit('page-updated', updated);

    // If title, icon, parentId or order changed, emit list updated
    if ('title' in partial || 'icon' in partial || 'parentId' in partial || 'order' in partial || 'isFavorite' in partial) {
      this.emit('page-list-updated');
    }

    // Trigger history snapshot if major content changes and not skipped
    if (!skipHistory && 'blocks' in partial && JSON.stringify(oldBlocks) !== JSON.stringify(partial.blocks)) {
      this.debouncedCreateSnapshot(updated);
    }

    return updated;
  }

  debouncedCreateSnapshot(page) {
    clearTimeout(this._snapTimeout);
    this._snapTimeout = setTimeout(() => {
      this.createPageSnapshot(page, 'Auto snapshot');
    }, 10000); // Snapshot every 10s of active editing
  }

  async createPageSnapshot(page, note = '') {
    try {
      const snap = {
        id: 'hist-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        pageId: page.id,
        title: page.title,
        icon: page.icon,
        cover: page.cover,
        blocks: JSON.parse(JSON.stringify(page.blocks)),
        timestamp: Date.now(),
        note
      };
      await db.put('history', snap);
      this.emit('history-updated', snap);
    } catch (e) {
      console.warn('Failed to save snapshot', e);
    }
  }

  async getPageHistory(pageId) {
    const allHistory = await db.getAll('history');
    return allHistory
      .filter(h => h.pageId === pageId)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  async restorePageRevision(revisionId) {
    const revision = await db.get('history', revisionId);
    if (!revision) return false;
    const page = this.pages.get(revision.pageId);
    if (!page) return false;

    // Create a snapshot of current state before restoring
    await this.createPageSnapshot(page, 'Before restoring revision');

    await this.updatePage(page.id, {
      title: revision.title,
      icon: revision.icon,
      cover: revision.cover,
      blocks: JSON.parse(JSON.stringify(revision.blocks))
    }, true);

    this.emit('page-restored-revision', page);
    return true;
  }

  async toggleFavorite(id) {
    const page = this.pages.get(id);
    if (!page) return;
    const isFavorite = !page.isFavorite;
    await this.updatePage(id, { isFavorite });
    return isFavorite;
  }

  async duplicatePage(id, targetParentId = undefined) {
    const original = this.pages.get(id);
    if (!original) return null;

    const parentId = targetParentId !== undefined ? targetParentId : original.parentId;
    const clone = await this.createPage({
      title: `${original.title} (Copy)`,
      icon: original.icon,
      cover: original.cover,
      parentId: parentId,
      blocks: JSON.parse(JSON.stringify(original.blocks)),
      databaseId: original.databaseId ? await this.duplicateDatabase(original.databaseId) : null
    });

    // Recursively clone subpages
    const children = this.getAllPages().filter(p => p.parentId === id && !p.isTrash);
    for (const child of children) {
      await this.duplicatePage(child.id, clone.id);
    }

    return clone;
  }

  async duplicateDatabase(dbId) {
    const origDb = this.databases.get(dbId);
    if (!origDb) return null;
    const newDbId = 'db-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const newDb = {
      ...JSON.parse(JSON.stringify(origDb)),
      id: newDbId
    };
    this.databases.set(newDbId, newDb);
    await db.put('databases', newDb);
    return newDbId;
  }

  async moveToTrash(id) {
    const page = this.pages.get(id);
    if (!page) return;

    const markTrashRecursive = (pageId) => {
      const p = this.pages.get(pageId);
      if (p) {
        p.isTrash = true;
        p.trashDate = Date.now();
        db.put('pages', p);
        const children = this.getAllPages().filter(c => c.parentId === pageId);
        children.forEach(c => markTrashRecursive(c.id));
      }
    };

    markTrashRecursive(id);

    // If active page was moved to trash, switch active page
    if (this.activePageId === id) {
      const remaining = this.getAllPages().filter(p => !p.isTrash);
      this.activePageId = remaining.length > 0 ? remaining[0].id : null;
      if (this.activePageId) {
        this.setSetting('activePageId', this.activePageId);
      }
    }

    this.emit('page-trashed', id);
    this.emit('page-list-updated');
    if (this.activePageId) {
      this.emit('active-page-changed', this.getPage(this.activePageId));
    }
  }

  async restoreFromTrash(id) {
    const page = this.pages.get(id);
    if (!page) return;

    // If parent is also in trash or does not exist, reset parent to root
    if (page.parentId) {
      const parent = this.pages.get(page.parentId);
      if (!parent || parent.isTrash) {
        page.parentId = null;
      }
    }

    page.isTrash = false;
    delete page.trashDate;
    await db.put('pages', page);

    this.emit('page-restored', page);
    this.emit('page-list-updated');
    await this.setActivePage(id);
  }

  async deletePermanently(id) {
    const deleteRecursive = async (pageId) => {
      const p = this.pages.get(pageId);
      if (p) {
        if (p.databaseId) {
          this.databases.delete(p.databaseId);
          await db.delete('databases', p.databaseId);
        }
        this.pages.delete(pageId);
        await db.delete('pages', pageId);

        const children = this.getAllPages().filter(c => c.parentId === pageId);
        for (const child of children) {
          await deleteRecursive(child.id);
        }
      }
    };

    await deleteRecursive(id);
    this.emit('page-permanently-deleted', id);
    this.emit('page-list-updated');
  }

  async emptyTrash() {
    const trashedPages = this.getAllPages().filter(p => p.isTrash);
    for (const p of trashedPages) {
      await this.deletePermanently(p.id);
    }
    this.emit('trash-emptied');
    this.emit('page-list-updated');
  }

  async reorderPages(draggedId, targetParentId, newIndex) {
    const dragged = this.pages.get(draggedId);
    if (!dragged) return;

    // Prevent dragging page into itself or its descendants
    const isDescendant = (parent, candidate) => {
      let cur = this.pages.get(candidate);
      while (cur && cur.parentId) {
        if (cur.parentId === parent) return true;
        cur = this.pages.get(cur.parentId);
      }
      return false;
    };

    if (draggedId === targetParentId || isDescendant(draggedId, targetParentId)) {
      return;
    }

    dragged.parentId = targetParentId;

    // Get all siblings in target parent
    let siblings = this.getAllPages()
      .filter(p => p.parentId === targetParentId && !p.isTrash && p.id !== draggedId)
      .sort((a, b) => a.order - b.order);

    siblings.splice(newIndex, 0, dragged);

    // Update orders
    for (let i = 0; i < siblings.length; i++) {
      siblings[i].order = i;
      await db.put('pages', siblings[i]);
    }

    this.emit('page-list-updated');
  }

  // --- Database Operations ---

  getDatabase(id) {
    return this.databases.get(id) || null;
  }

  async createDatabase(options = {}) {
    const id = 'db-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const newDb = {
      id,
      title: options.title || 'Untitled Database',
      pageId: options.pageId || null,
      currentView: 'table',
      views: [
        { id: 'v-' + Date.now() + '-1', name: 'Table', type: 'table' },
        { id: 'v-' + Date.now() + '-2', name: 'Board', type: 'board', groupBy: 'prop-status' },
        { id: 'v-' + Date.now() + '-3', name: 'List', type: 'list' }
      ],
      filter: { propertyId: 'all', value: '' },
      sort: { propertyId: 'prop-title', direction: 'asc' },
      properties: options.properties || [
        { id: 'prop-title', name: 'Name', type: 'title', width: 220 },
        {
          id: 'prop-status',
          name: 'Status',
          type: 'status',
          width: 140,
          options: [
            { id: 's1', label: 'Not Started', color: 'gray' },
            { id: 's2', label: 'In Progress', color: 'blue' },
            { id: 's3', label: 'Done', color: 'green' }
          ]
        },
        {
          id: 'prop-tags',
          name: 'Tags',
          type: 'multi-select',
          width: 160,
          options: [
            { id: 't1', label: 'Feature', color: 'blue' },
            { id: 't2', label: 'Bug', color: 'red' },
            { id: 't3', label: 'Task', color: 'green' }
          ]
        },
        { id: 'prop-date', name: 'Date', type: 'date', width: 130 }
      ],
      rows: options.rows || [
        {
          id: 'row-' + Date.now() + '-1',
          properties: {
            'prop-title': 'First Item',
            'prop-status': 'Not Started',
            'prop-tags': ['Task'],
            'prop-date': new Date().toISOString().split('T')[0]
          },
          contentBlocks: []
        }
      ]
    };

    this.databases.set(id, newDb);
    await db.put('databases', newDb);
    this.emit('database-created', newDb);
    return newDb;
  }

  async updateDatabase(id, partial) {
    const database = this.databases.get(id);
    if (!database) return null;

    const updated = {
      ...database,
      ...partial
    };

    this.databases.set(id, updated);
    this.scheduleSave('database', updated);
    this.emit('database-updated', updated);
    return updated;
  }

  async addDatabaseRow(dbId, initialProps = {}) {
    const database = this.databases.get(dbId);
    if (!database) return null;

    const newRow = {
      id: 'row-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      properties: {
        'prop-title': 'New Item',
        ...initialProps
      },
      contentBlocks: []
    };

    database.rows.push(newRow);
    await this.updateDatabase(dbId, { rows: database.rows });
    return newRow;
  }

  async updateDatabaseRow(dbId, rowId, properties, contentBlocks = undefined) {
    const database = this.databases.get(dbId);
    if (!database) return null;

    const row = database.rows.find(r => r.id === rowId);
    if (!row) return null;

    row.properties = { ...row.properties, ...properties };
    if (contentBlocks !== undefined) {
      row.contentBlocks = contentBlocks;
    }

    await this.updateDatabase(dbId, { rows: database.rows });
    return row;
  }

  async deleteDatabaseRow(dbId, rowId) {
    const database = this.databases.get(dbId);
    if (!database) return;

    database.rows = database.rows.filter(r => r.id !== rowId);
    await this.updateDatabase(dbId, { rows: database.rows });
  }

  async addDatabaseProperty(dbId, propDef) {
    const database = this.databases.get(dbId);
    if (!database) return;

    const propId = 'prop-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5);
    const newProp = {
      id: propId,
      name: propDef.name || 'New Property',
      type: propDef.type || 'text',
      width: 140,
      options: propDef.options || []
    };

    database.properties.push(newProp);
    await this.updateDatabase(dbId, { properties: database.properties });
    return newProp;
  }

  async deleteDatabaseProperty(dbId, propId) {
    const database = this.databases.get(dbId);
    if (!database) return;

    database.properties = database.properties.filter(p => p.id !== propId);
    database.rows.forEach(r => {
      delete r.properties[propId];
    });

    await this.updateDatabase(dbId, {
      properties: database.properties,
      rows: database.rows
    });
  }

  // --- Workspace Import / Export ---

  async exportWorkspaceJSON() {
    const pages = Array.from(this.pages.values());
    const databases = Array.from(this.databases.values());
    const settings = Array.from(this.settings.entries()).map(([k, v]) => ({ key: k, value: v }));
    const history = await db.getAll('history');

    return {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      appName: 'NoteSpace',
      workspace: {
        pages,
        databases,
        settings,
        history
      }
    };
  }

  async importWorkspaceJSON(jsonData) {
    // Validate schema
    if (!jsonData || typeof jsonData !== 'object') {
      throw new Error('Invalid JSON file format.');
    }
    if (!jsonData.workspace || !Array.isArray(jsonData.workspace.pages)) {
      throw new Error('Missing or invalid workspace pages array in import data.');
    }

    const { pages, databases = [], settings = [], history = [] } = jsonData.workspace;

    // Clear current database
    await db.clear('pages');
    await db.clear('databases');
    await db.clear('settings');
    await db.clear('history');

    // Batch insert imported data
    await db.putBatch('pages', pages);
    if (databases.length > 0) await db.putBatch('databases', databases);
    if (settings.length > 0) await db.putBatch('settings', settings);
    if (history.length > 0) await db.putBatch('history', history);

    // Reload state
    this.pages.clear();
    this.databases.clear();
    this.settings.clear();

    pages.forEach(p => this.pages.set(p.id, p));
    databases.forEach(d => this.databases.set(d.id, d));
    settings.forEach(s => this.settings.set(s.key, s.value));

    const validPages = pages.filter(p => !p.isTrash);
    this.activePageId = validPages.length > 0 ? validPages[0].id : null;

    this.emit('workspace-reloaded');
    this.emit('page-list-updated');
    if (this.activePageId) {
      this.emit('active-page-changed', this.getPage(this.activePageId));
    }

    return {
      pagesCount: pages.length,
      databasesCount: databases.length
    };
  }

  async resetToDefaults() {
    await db.clear('pages');
    await db.clear('databases');
    await db.clear('settings');
    await db.clear('history');

    this.pages.clear();
    this.databases.clear();
    this.settings.clear();

    await this.init();
    this.emit('workspace-reloaded');
    this.emit('page-list-updated');
    if (this.activePageId) {
      this.emit('active-page-changed', this.getPage(this.activePageId));
    }
  }
}

export const store = new Store();
