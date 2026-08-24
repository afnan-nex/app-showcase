/**
 * NoteSpace - Reactive Application State Manager
 * Centralized event-driven architecture, undo/redo history stack, and autosave.
 */
class StateManager {
  constructor() {
    this.workspace = null;
    this.pages = [];
    this.activePageId = null;
    this.activePage = null;
    this.blocks = [];
    this.database = null;
    this.recentPageIds = [];
    
    this.theme = 'dark';
    this.font = 'sans';
    this.sidebarCollapsed = false;
    this.sidebarWidth = 260;

    // Undo / Redo Stacks for Block Editor
    this.undoStack = [];
    this.redoStack = [];
    this.maxHistory = 50;

    // Autosave debouncer
    this.saveTimeout = null;
    this.isSaving = false;

    // Event Bus Emitters
    this.listeners = new Map();
  }

  // --- Reactive Event Bus ---
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    this.listeners.set(event, this.listeners.get(event).filter(cb => cb !== callback));
  }

  emit(event, payload) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try {
          cb(payload);
        } catch (err) {
          console.error(`[NoteSpace State] Error in listener for ${event}:`, err);
        }
      });
    }
  }

  // --- Initialization ---
  async init() {
    await NoteSpaceDB.ensureReady();

    // Load settings
    this.theme = await NoteSpaceDB.getSetting('theme', 'dark');
    this.font = await NoteSpaceDB.getSetting('font', 'sans');
    this.sidebarCollapsed = await NoteSpaceDB.getSetting('sidebarCollapsed', false);
    this.sidebarWidth = await NoteSpaceDB.getSetting('sidebarWidth', 260);
    this.recentPageIds = await NoteSpaceDB.getSetting('recentPages', []);

    // Apply initial theme & font
    this.applyTheme(this.theme);
    this.applyFont(this.font);
    if (this.sidebarWidth) {
      document.documentElement.style.setProperty('--sidebar-width', `${this.sidebarWidth}px`);
    }
    if (this.sidebarCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    }

    // Load workspaces
    let workspaces = await NoteSpaceDB.getAll('workspaces');
    let pages = await NoteSpaceDB.getAll('pages');

    if (!workspaces || workspaces.length === 0 || !pages || pages.length === 0) {
      // Seed sample data
      await this.seedSampleData();
      workspaces = await NoteSpaceDB.getAll('workspaces');
    }

    this.workspace = workspaces[0] || { id: 'ws_main', name: 'Acme Cloud Infrastructure', icon: '⚡' };

    // Load pages for workspace
    await this.refreshPages();

    // Check URL hash for direct page navigation
    const hash = window.location.hash.replace('#', '');
    let initialPage = null;
    if (hash) {
      initialPage = this.pages.find(p => p.id === hash && !p.inTrash);
    }

    if (!initialPage) {
      initialPage = this.pages.find(p => !p.inTrash && !p.parentId) || this.pages.find(p => !p.inTrash) || this.pages[0];
    }

    if (initialPage) {
      await this.setActivePage(initialPage.id, false);
    }

    this.emit('init', { workspace: this.workspace, pages: this.pages, activePage: this.activePage });
  }

  async seedSampleData() {
    const ws = SampleData.getWorkspace();
    const extraWs = SampleData.getAdditionalWorkspaces ? SampleData.getAdditionalWorkspaces() : [];
    const pages = SampleData.getPages();
    const blocksMap = SampleData.getBlocks();
    const dbs = SampleData.getDatabases();

    await NoteSpaceDB.put('workspaces', ws);
    for (const extra of extraWs) {
      await NoteSpaceDB.put('workspaces', extra);
    }
    await NoteSpaceDB.putMany('pages', pages);

    for (const [pageId, blocks] of Object.entries(blocksMap)) {
      await NoteSpaceDB.saveBlocks(pageId, blocks);
    }

    for (const db of dbs) {
      await NoteSpaceDB.saveDatabase(db);
    }
  }

  async refreshPages() {
    if (!this.workspace) return;
    this.pages = await NoteSpaceDB.getPages(this.workspace.id);
    if (this.pages.length === 0) {
      // Fallback: load all non-trash pages
      this.pages = await NoteSpaceDB.getAll('pages');
    }
    this.emit('pages:updated', this.pages);
  }

  // --- Page Navigation & Selection ---
  async setActivePage(pageId, updateHash = true) {
    if (!pageId) return;
    
    // Check if moving to trash view
    if (pageId === '__trash__') {
      this.activePageId = '__trash__';
      this.activePage = { id: '__trash__', title: 'Trash', icon: 'trash', inTrash: false };
      this.blocks = [];
      this.database = null;
      if (updateHash) window.location.hash = '__trash__';
      this.emit('page:changed', { page: this.activePage, blocks: [], database: null, isTrash: true });
      return;
    }

    let page = this.pages.find(p => p.id === pageId);
    if (!page) {
      page = await NoteSpaceDB.getPage(pageId);
      if (page) {
        this.pages.push(page);
      }
    }
    if (!page) {
      console.warn(`[NoteSpace] Page ${pageId} not found.`);
      return;
    }

    this.activePageId = pageId;
    this.activePage = page;
    
    if (updateHash) {
      window.location.hash = pageId;
    }

    // Update recents
    if (!page.inTrash) {
      this.recentPageIds = [pageId, ...this.recentPageIds.filter(id => id !== pageId)].slice(0, 10);
      NoteSpaceDB.setSetting('recentPages', this.recentPageIds);
    }

    // Load blocks and database
    this.blocks = await NoteSpaceDB.getBlocks(pageId);
    this.database = await NoteSpaceDB.getDatabase(pageId);

    // If page has no blocks and is not a database, create default paragraph block
    if ((!this.blocks || this.blocks.length === 0) && !this.database && !page.isDatabase) {
      this.blocks = [
        {
          id: 'b_' + Date.now() + '_1',
          type: 'paragraph',
          content: '',
          metadata: {},
          order: 0,
          pageId
        }
      ];
      await NoteSpaceDB.saveBlocks(pageId, this.blocks);
    }

    // Reset undo/redo for new page
    this.undoStack = [];
    this.redoStack = [];

    this.emit('page:changed', {
      page: this.activePage,
      blocks: this.blocks,
      database: this.database,
      isTrash: false
    });
  }

  // --- Page CRUD Operations ---
  async createPage(parentId = null, title = 'Untitled', isDatabase = false) {
    const newId = 'page_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    const siblings = this.pages.filter(p => p.parentId === parentId && !p.inTrash);
    
    const newPage = {
      id: newId,
      workspaceId: this.workspace ? this.workspace.id : 'ws_main',
      parentId: parentId || null,
      title: title || 'Untitled',
      icon: isDatabase ? '📊' : '📄',
      cover: null,
      isFavorite: false,
      isLocked: false,
      isDatabase: !!isDatabase,
      fullWidth: false,
      inTrash: false,
      order: siblings.length,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await NoteSpaceDB.savePage(newPage);

    if (isDatabase) {
      const newDb = {
        id: 'db_' + Date.now(),
        pageId: newId,
        viewType: 'table',
        properties: [
          { id: 'prop_title', name: 'Name', type: 'title' },
          { 
            id: 'prop_status', 
            name: 'Status', 
            type: 'status', 
            options: [
              { id: 'opt_todo', label: 'To Do', color: 'gray' },
              { id: 'opt_inprogress', label: 'In Progress', color: 'blue' },
              { id: 'opt_done', label: 'Done', color: 'green' }
            ] 
          },
          { id: 'prop_date', name: 'Date', type: 'date' }
        ],
        rows: [
          { id: 'row_1', values: { prop_title: 'First Item', prop_status: 'opt_todo' }, order: 0 }
        ],
        groupBy: 'prop_status',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      await NoteSpaceDB.saveDatabase(newDb);
    } else {
      const initialBlocks = [
        {
          id: 'b_' + Date.now() + '_1',
          type: 'paragraph',
          content: '',
          metadata: {},
          order: 0,
          pageId: newId
        }
      ];
      await NoteSpaceDB.saveBlocks(newId, initialBlocks);
    }

    await this.refreshPages();
    await this.setActivePage(newId);
    return newPage;
  }

  async updatePage(pageId, updates) {
    if (!pageId || pageId === '__trash__') return;

    let page = this.pages.find(p => p.id === pageId);
    if (!page && this.activePage?.id === pageId) {
      page = this.activePage;
    }
    if (!page) {
      page = await NoteSpaceDB.getPage(pageId);
      if (page) this.pages.push(page);
    }
    if (!page) return;

    Object.assign(page, updates, { updatedAt: Date.now() });
    await NoteSpaceDB.savePage(page);

    if (this.activePageId === pageId) {
      this.activePage = page;
    }

    this.emit('page:updated', page);
    this.emit('pages:updated', this.pages);
  }

  async duplicatePage(pageId) {
    const page = this.pages.find(p => p.id === pageId);
    if (!page) return;

    const newId = 'page_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    const clonedPage = {
      ...JSON.parse(JSON.stringify(page)),
      id: newId,
      title: `${page.title} (Copy)`,
      order: page.order + 1,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await NoteSpaceDB.savePage(clonedPage);

    // Duplicate blocks or database
    if (page.isDatabase) {
      const db = await NoteSpaceDB.getDatabase(pageId);
      if (db) {
        const clonedDb = {
          ...JSON.parse(JSON.stringify(db)),
          id: 'db_' + Date.now(),
          pageId: newId
        };
        await NoteSpaceDB.saveDatabase(clonedDb);
      }
    } else {
      const blocks = await NoteSpaceDB.getBlocks(pageId);
      if (blocks && blocks.length) {
        const clonedBlocks = blocks.map(b => ({
          ...JSON.parse(JSON.stringify(b)),
          id: 'b_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
          pageId: newId
        }));
        await NoteSpaceDB.saveBlocks(newId, clonedBlocks);
      }
    }

    await this.refreshPages();
    await this.setActivePage(newId);
  }

  async deletePage(pageId, permanent = false) {
    const getAllDescendantIds = (parentId) => {
      const children = this.pages.filter(p => p.parentId === parentId);
      let ids = children.map(c => c.id);
      children.forEach(c => {
        ids = ids.concat(getAllDescendantIds(c.id));
      });
      return ids;
    };

    const targetIds = [pageId, ...getAllDescendantIds(pageId)];

    if (permanent) {
      for (const id of targetIds) {
        await NoteSpaceDB.delete('pages', id);
        const blocks = await NoteSpaceDB.getBlocks(id);
        for (const b of blocks) await NoteSpaceDB.delete('blocks', b.id);
        const db = await NoteSpaceDB.getDatabase(id);
        if (db) await NoteSpaceDB.delete('databases', db.id);
      }
    } else {
      const now = Date.now();
      for (const id of targetIds) {
        const p = this.pages.find(page => page.id === id);
        if (p) {
          p.inTrash = true;
          p.trashDate = now;
          await NoteSpaceDB.savePage(p);
        }
      }
    }

    await this.refreshPages();

    if (targetIds.includes(this.activePageId)) {
      const fallback = this.pages.find(p => !p.inTrash && !p.parentId) || this.pages.find(p => !p.inTrash);
      if (fallback) {
        await this.setActivePage(fallback.id);
      } else {
        await this.createPage(null, 'Untitled');
      }
    }
  }

  async restorePage(pageId) {
    const page = this.pages.find(p => p.id === pageId);
    if (!page) return;

    // Check if parent is in trash; if so, promote restored page to root parentId: null
    let newParentId = page.parentId;
    if (newParentId) {
      const parent = this.pages.find(p => p.id === newParentId);
      if (!parent || parent.inTrash) {
        newParentId = null;
      }
    }

    const getAllDescendantIds = (pId) => {
      const children = this.pages.filter(p => p.parentId === pId);
      let ids = children.map(c => c.id);
      children.forEach(c => {
        ids = ids.concat(getAllDescendantIds(c.id));
      });
      return ids;
    };
    const targetIds = [pageId, ...getAllDescendantIds(pageId)];

    for (const id of targetIds) {
      const p = this.pages.find(item => item.id === id);
      if (p) {
        p.inTrash = false;
        p.trashDate = null;
        if (p.id === pageId) p.parentId = newParentId;
        await NoteSpaceDB.savePage(p);
      }
    }

    await this.refreshPages();
    await this.setActivePage(pageId);
  }

  async emptyTrash() {
    const trashed = this.pages.filter(p => p.inTrash);
    for (const p of trashed) {
      await this.deletePage(p.id, true);
    }
    await this.refreshPages();
  }

  async toggleFavorite(pageId) {
    const page = this.pages.find(p => p.id === pageId);
    if (page) {
      await this.updatePage(pageId, { isFavorite: !page.isFavorite });
    }
  }

  async movePage(pageId, newParentId, newOrder = 0) {
    const page = this.pages.find(p => p.id === pageId);
    if (!page || page.id === newParentId) return;

    // Cycle check: verify newParentId is not pageId or a descendant of pageId
    if (newParentId) {
      let curr = this.pages.find(p => p.id === newParentId);
      const visited = new Set();
      while (curr) {
        if (curr.id === pageId) {
          console.warn('[NoteSpace] Cannot move page into its own descendant.');
          return;
        }
        if (visited.has(curr.id)) break;
        visited.add(curr.id);
        curr = this.pages.find(p => p.id === curr.parentId);
      }
    }

    page.parentId = newParentId || null;
    page.order = newOrder;
    page.updatedAt = Date.now();

    await NoteSpaceDB.savePage(page);
    await this.refreshPages();
  }

  // --- Block Updates & Autosave Engine ---
  updateBlocks(newBlocks, immediateSave = false) {
    if (!this.activePageId || this.activePage?.isDatabase) return;

    // Record Undo Snapshot
    if (this.blocks.length > 0) {
      this.undoStack.push(JSON.stringify(this.blocks));
      if (this.undoStack.length > this.maxHistory) this.undoStack.shift();
      this.redoStack = []; // clear redo on new edits
    }

    this.blocks = newBlocks;
    this.scheduleAutosave(immediateSave);
  }

  async updateDatabase(newDatabase, immediateSave = false) {
    this.database = newDatabase;
    this.emit('save:status', 'saving');
    
    clearTimeout(this.saveTimeout);
    if (immediateSave) {
      await NoteSpaceDB.saveDatabase(this.database);
      this.emit('save:status', 'saved');
    } else {
      this.saveTimeout = setTimeout(async () => {
        await NoteSpaceDB.saveDatabase(this.database);
        this.emit('save:status', 'saved');
      }, 300);
    }
  }

  scheduleAutosave(immediate = false) {
    this.emit('save:status', 'saving');
    clearTimeout(this.saveTimeout);

    const performSave = async () => {
      this.isSaving = true;
      if (this.activePageId && this.blocks) {
        await NoteSpaceDB.saveBlocks(this.activePageId, this.blocks);
        
        // Auto-save revision snapshot periodically
        if (Math.random() < 0.25) {
          await NoteSpaceDB.saveRevision(this.activePageId, {
            title: this.activePage?.title,
            icon: this.activePage?.icon,
            cover: this.activePage?.cover,
            blocks: this.blocks
          });
        }
      }
      this.isSaving = false;
      this.emit('save:status', 'saved');
    };

    if (immediate) {
      performSave();
    } else {
      this.saveTimeout = setTimeout(performSave, 500);
    }
  }

  // --- Undo / Redo Operations ---
  undo() {
    if (this.undoStack.length === 0) return null;
    const current = JSON.stringify(this.blocks);
    this.redoStack.push(current);
    const previous = JSON.parse(this.undoStack.pop());
    this.blocks = previous;
    this.scheduleAutosave(true);
    this.emit('blocks:restored', this.blocks);
    return this.blocks;
  }

  redo() {
    if (this.redoStack.length === 0) return null;
    const current = JSON.stringify(this.blocks);
    this.undoStack.push(current);
    const next = JSON.parse(this.redoStack.pop());
    this.blocks = next;
    this.scheduleAutosave(true);
    this.emit('blocks:restored', this.blocks);
    return this.blocks;
  }

  // --- Settings & UI Appearance ---
  applyTheme(theme) {
    this.theme = theme;
    document.documentElement?.setAttribute('data-theme', theme);
    NoteSpaceDB.setSetting('theme', theme);
    this.emit('theme:changed', theme);
  }

  applyFont(font) {
    this.font = font;
    document.documentElement?.setAttribute('data-font', font);
    NoteSpaceDB.setSetting('font', font);
    this.emit('font:changed', font);
  }

  toggleSidebar(forceState = null) {
    this.sidebarCollapsed = forceState !== null ? forceState : !this.sidebarCollapsed;
    NoteSpaceDB.setSetting('sidebarCollapsed', this.sidebarCollapsed);
    this.emit('sidebar:toggled', this.sidebarCollapsed);
  }

  setSidebarWidth(width) {
    this.sidebarWidth = width;
    NoteSpaceDB.setSetting('sidebarWidth', width);
  }

  // --- Full-Text Search Engine ---
  async search(query) {
    if (!query || query.trim() === '') return [];
    const q = query.trim();
    const qLower = q.toLowerCase();
    const safeRegex = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const results = [];

    // Search across Pages
    const allPages = await NoteSpaceDB.getAll('pages');
    allPages.filter(p => !p.inTrash).forEach(p => {
      if ((p.title || '').toLowerCase().includes(qLower)) {
        results.push({
          type: 'page',
          pageId: p.id,
          title: p.title || 'Untitled',
          icon: p.icon || '📄',
          snippet: `Page Title match`
        });
      }
    });

    // Search across Blocks
    const allBlocks = await NoteSpaceDB.getAll('blocks');
    allBlocks.forEach(b => {
      const text = (b.content || '').replace(/<[^>]*>/g, '');
      if (text.toLowerCase().includes(qLower)) {
        const page = allPages.find(p => p.id === b.pageId && !p.inTrash);
        if (page) {
          // Highlight snippet
          const idx = text.toLowerCase().indexOf(qLower);
          const start = Math.max(0, idx - 25);
          const end = Math.min(text.length, idx + q.length + 35);
          const rawSnippet = text.substring(start, end);
          let highlighted = rawSnippet;
          try {
            highlighted = rawSnippet.replace(new RegExp(`(${safeRegex})`, 'gi'), '<mark>$1</mark>');
          } catch (e) {
            highlighted = rawSnippet;
          }

          results.push({
            type: 'block',
            pageId: b.pageId,
            title: page.title || 'Untitled',
            icon: page.icon || '📄',
            snippet: (start > 0 ? '...' : '') + highlighted + (end < text.length ? '...' : '')
          });
        }
      }
    });

    // Search across Databases
    const allDatabases = await NoteSpaceDB.getAll('databases');
    allDatabases.forEach(db => {
      const page = allPages.find(p => p.id === db.pageId && !p.inTrash);
      if (page && db.rows) {
        db.rows.forEach(r => {
          const rowText = Object.values(r.values || {}).join(' ');
          if (rowText.toLowerCase().includes(qLower)) {
            const rowTitle = r.values?.prop_title || 'Database Item';
            results.push({
              type: 'database',
              pageId: db.pageId,
              title: `${page.title} / ${rowTitle}`,
              icon: '📊',
              snippet: `Database record match`
            });
          }
        });
      }
    });

    return results;
  }
}

window.State = new StateManager();
