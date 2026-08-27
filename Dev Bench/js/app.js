/**
 * DevBench - Main Workstation Orchestrator
 * Tab management, sidebar navigation, history & snippet drawers, shortcuts, theme engine.
 */

import { TOOLS, TOOL_CATEGORIES, getToolById } from './tool-registry.js';
import { getIcon, escapeHTML } from './icons.js';
import {
  getTheme,
  setTheme,
  getFavorites,
  toggleFavorite,
  getRecentTools,
  recordRecentTool,
  getOpenTabs,
  saveOpenTabs,
  getActiveTab,
  saveActiveTab,
  getToolHistory,
  clearToolHistory,
  getSavedSnippets,
  saveSnippet,
  deleteSnippet
} from './storage.js';
import { CommandPalette } from './command-palette.js';

class DevBenchApp {
  constructor() {
    this.sidebarNav = document.getElementById('sidebar-tools-list');
    this.favoritesList = document.getElementById('sidebar-favorites-list');
    this.recentsList = document.getElementById('sidebar-recents-list');
    this.tabBar = document.getElementById('editor-tab-bar');
    this.workspace = document.getElementById('active-tool-workspace');
    this.sidebarFilter = document.getElementById('sidebar-search-input');
    this.drawer = document.getElementById('side-drawer');
    this.modal = document.getElementById('devbench-modal-container');

    this.openTabs = getOpenTabs();
    this.activeTabId = getActiveTab();
    if (!this.openTabs.includes(this.activeTabId)) {
      this.openTabs.unshift(this.activeTabId);
    }

    this.commandPalette = new CommandPalette((toolId) => this.openTool(toolId));
  }

  init() {
    // 1. Apply Theme
    const theme = getTheme();
    document.documentElement.setAttribute('data-theme', theme);
    this.updateThemeButton(theme);

    // 2. Render Sidebar Navigation & Tabs
    this.renderSidebar();
    this.renderTabs();
    this.renderActiveTool();

    // 3. Setup Global Listeners
    this.setupListeners();
    this.setupShortcuts();
  }

  setupListeners() {
    // Theme toggle
    document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      setTheme(next);
      this.updateThemeButton(next);
    });

    window.addEventListener('SET_THEME', (e) => {
      const t = e.detail?.theme || 'dark';
      document.documentElement.setAttribute('data-theme', t);
      setTheme(t);
      this.updateThemeButton(t);
    });

    // Sidebar search input
    this.sidebarFilter?.addEventListener('input', (e) => {
      this.renderSidebar(e.target.value.trim().toLowerCase());
    });

    // Top search bar trigger command palette
    document.getElementById('topbar-search-trigger')?.addEventListener('click', () => {
      this.commandPalette.open();
    });

    // Favorites event
    window.addEventListener('TOGGLE_FAVORITE', (e) => {
      const toolId = e.detail?.toolId;
      if (toolId) {
        toggleFavorite(toolId);
        this.renderSidebar(this.sidebarFilter?.value.trim().toLowerCase());
        this.renderActiveTool(); // refresh star
      }
    });

    // History drawer event
    window.addEventListener('OPEN_HISTORY_DRAWER', (e) => {
      const toolId = e.detail?.toolId || this.activeTabId;
      this.openHistoryDrawer(toolId);
    });

    // Save snippet modal event
    window.addEventListener('OPEN_SAVE_SNIPPET_MODAL', (e) => {
      const toolId = e.detail?.toolId || this.activeTabId;
      this.openSaveSnippetModal(toolId);
    });

    // Mobile sidebar toggle
    document.getElementById('btn-mobile-sidebar-toggle')?.addEventListener('click', () => {
      document.getElementById('app-sidebar')?.classList.toggle('open');
    });
  }

  setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Ctrl+W: close active tab
      if ((e.ctrlKey || e.metaKey) && (e.key === 'w' || e.key === 'W') && !e.shiftKey) {
        if (!['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
          e.preventDefault();
          this.closeTab(this.activeTabId);
        }
      }
    });
  }

  updateThemeButton(theme) {
    const btn = document.getElementById('btn-theme-toggle');
    if (btn) {
      btn.innerHTML = theme === 'dark' ? getIcon('sun', 'icon-sm') : getIcon('moon', 'icon-sm');
      btn.setAttribute('title', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
    }
  }

  // --- Sidebar Rendering ---
  renderSidebar(filterQuery = '') {
    const favorites = getFavorites();
    const recents = getRecentTools();

    // 1. Favorites List
    const favTools = TOOLS.filter(t => favorites.includes(t.id));
    if (this.favoritesList) {
      if (favTools.length === 0) {
        this.favoritesList.innerHTML = `<span class="text-xs text-muted px-3">No pinned tools</span>`;
      } else {
        this.favoritesList.innerHTML = favTools.map(t => this.renderSidebarItem(t)).join('');
      }
    }

    // 2. Recents List
    const recentTools = recents.map(id => getToolById(id)).filter(Boolean);
    if (this.recentsList) {
      this.recentsList.innerHTML = recentTools.slice(0, 5).map(t => this.renderSidebarItem(t)).join('');
    }

    // 3. Category Groups
    let html = '';
    Object.values(TOOL_CATEGORIES).forEach(categoryName => {
      const catTools = TOOLS.filter(t => {
        if (t.category !== categoryName) return false;
        if (!filterQuery) return true;
        return t.title.toLowerCase().includes(filterQuery) || t.desc.toLowerCase().includes(filterQuery);
      });

      if (catTools.length > 0) {
        html += `
          <div class="sidebar-category-group">
            <div class="sidebar-cat-title font-mono text-xs uppercase text-muted">${categoryName} (${catTools.length})</div>
            <div class="sidebar-cat-items">
              ${catTools.map(t => this.renderSidebarItem(t)).join('')}
            </div>
          </div>
        `;
      }
    });

    if (this.sidebarNav) {
      this.sidebarNav.innerHTML = html || `<div class="p-3 text-xs text-muted text-center">No tools matched "${escapeHTML(filterQuery)}"</div>`;
    }

    // Bind sidebar clicks
    document.querySelectorAll('.sidebar-tool-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const toolId = item.dataset.toolId;
        this.openTool(toolId);
        document.getElementById('app-sidebar')?.classList.remove('open');
      });
    });
  }

  renderSidebarItem(tool) {
    const isActive = tool.id === this.activeTabId;
    return `
      <a href="#${tool.id}" class="sidebar-tool-item ${isActive ? 'active' : ''}" data-tool-id="${tool.id}">
        <span class="tool-item-icon">${getIcon(tool.icon, 'icon-sm')}</span>
        <span class="tool-item-label">${tool.title}</span>
      </a>
    `;
  }

  // --- Tab Management ---
  openTool(toolId) {
    if (!this.openTabs.includes(toolId)) {
      this.openTabs.push(toolId);
      saveOpenTabs(this.openTabs);
    }
    this.activeTabId = toolId;
    saveActiveTab(this.activeTabId);
    recordRecentTool(toolId);

    this.renderSidebar(this.sidebarFilter?.value.trim().toLowerCase());
    this.renderTabs();
    this.renderActiveTool();
  }

  closeTab(toolId) {
    if (this.openTabs.length <= 1) return; // Keep at least one tab open
    const idx = this.openTabs.indexOf(toolId);
    if (idx !== -1) {
      this.openTabs.splice(idx, 1);
      saveOpenTabs(this.openTabs);
      if (this.activeTabId === toolId) {
        const nextIdx = Math.max(0, idx - 1);
        this.activeTabId = this.openTabs[nextIdx];
        saveActiveTab(this.activeTabId);
      }
      this.renderTabs();
      this.renderActiveTool();
      this.renderSidebar(this.sidebarFilter?.value.trim().toLowerCase());
    }
  }

  renderTabs() {
    if (!this.tabBar) return;
    this.tabBar.innerHTML = this.openTabs.map(toolId => {
      const tool = getToolById(toolId);
      const isActive = toolId === this.activeTabId;
      return `
        <div class="editor-tab ${isActive ? 'active' : ''}" data-tool-id="${tool.id}">
          <span class="tab-icon">${getIcon(tool.icon, 'icon-xs')}</span>
          <span class="tab-title text-xs font-medium">${tool.title}</span>
          ${this.openTabs.length > 1 ? `
            <button class="tab-close-btn" data-close-id="${tool.id}" title="Close Tab (Ctrl+W)">&times;</button>
          ` : ''}
        </div>
      `;
    }).join('');

    // Tab clicks
    this.tabBar.querySelectorAll('.editor-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-close-btn')) {
          e.stopPropagation();
          const closeId = e.target.dataset.closeId;
          this.closeTab(closeId);
          return;
        }
        const toolId = tab.dataset.toolId;
        this.openTool(toolId);
      });
    });
  }

  renderActiveTool() {
    if (!this.workspace) return;
    const tool = getToolById(this.activeTabId);
    this.workspace.innerHTML = '';
    tool.render(this.workspace, tool);

    // Update star state in tool header
    const favorites = getFavorites();
    const favBtn = this.workspace.querySelector('.btn-fav-toggle');
    if (favBtn) {
      const isFav = favorites.includes(tool.id);
      favBtn.innerHTML = isFav ? getIcon('starFilled', 'icon-sm') : getIcon('star', 'icon-sm');
      favBtn.classList.toggle('text-warning', isFav);
    }
  }

  // --- History Drawer ---
  openHistoryDrawer(toolId) {
    const tool = getToolById(toolId);
    const history = getToolHistory(toolId);

    this.drawer.innerHTML = `
      <div class="drawer-header">
        <div class="flex items-center gap-2">
          ${getIcon('history', 'icon-sm')}
          <span class="font-bold text-sm">${tool.title} &mdash; Input History</span>
        </div>
        <button class="btn-icon-xs btn-drawer-close">&times;</button>
      </div>
      <div class="drawer-body p-4 overflow-y-auto flex-1">
        ${history.length === 0 ? `
          <div class="text-muted text-xs text-center p-6">No saved history for this tool yet. Recent inputs will automatically appear here.</div>
        ` : `
          <div class="history-list flex flex-col gap-3">
            ${history.map(item => `
              <div class="card p-3 history-card cursor-pointer hover:border-primary" data-val="${escapeHTML(item.value)}">
                <div class="flex justify-between text-xs text-muted mb-1 font-mono">
                  <span>${new Date(item.timestamp).toLocaleTimeString()}</span>
                  <span class="text-primary font-bold">Restore &rarr;</span>
                </div>
                <div class="font-mono text-xs text-secondary truncate">${escapeHTML(item.snippet)}</div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
      <div class="drawer-footer p-3 border-t flex justify-between">
        <button class="btn btn-sm btn-ghost text-rose btn-clear-history">${getIcon('trash', 'icon-xs')} Clear History</button>
        <button class="btn btn-sm btn-secondary btn-drawer-close">Close</button>
      </div>
    `;

    this.drawer.classList.add('active');

    this.drawer.querySelectorAll('.btn-drawer-close').forEach(b => {
      b.addEventListener('click', () => this.drawer.classList.remove('active'));
    });

    this.drawer.querySelectorAll('.history-card').forEach(card => {
      card.addEventListener('click', () => {
        const val = card.dataset.val;
        // Inject into current active tool editor
        const primaryInput = this.workspace.querySelector('textarea, input[type="text"]');
        if (primaryInput) {
          primaryInput.value = val;
          primaryInput.dispatchEvent(new Event('input'));
        }
        this.drawer.classList.remove('active');
      });
    });

    this.drawer.querySelector('.btn-clear-history')?.addEventListener('click', () => {
      clearToolHistory(toolId);
      this.openHistoryDrawer(toolId);
    });
  }

  // --- Saved Snippets Modal ---
  openSaveSnippetModal(toolId) {
    const tool = getToolById(toolId);
    const primaryInput = this.workspace.querySelector('textarea, input[type="text"]');
    const content = primaryInput ? primaryInput.value : '';
    const existingSnippets = getSavedSnippets(toolId);

    this.modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-dialog">
        <div class="modal-header">
          <div class="flex items-center gap-2">
            ${getIcon('bookmark', 'icon-sm')}
            <span class="font-bold text-sm">Save Snippet for ${tool.title}</span>
          </div>
          <button class="btn-icon-xs btn-modal-close">&times;</button>
        </div>
        <div class="modal-body p-4">
          <div class="form-group mb-3">
            <label class="form-label text-xs font-semibold">Snippet Title / Label *</label>
            <input type="text" id="snippet-title-input" class="form-control" placeholder="e.g. Standard Auth Payload, Sample JWT" required />
          </div>
          <div class="form-group mb-4">
            <label class="form-label text-xs font-semibold">Content</label>
            <textarea id="snippet-content-input" class="code-editor font-mono text-xs" rows="4">${escapeHTML(content)}</textarea>
          </div>

          ${existingSnippets.length > 0 ? `
            <div class="border-t pt-3 mt-3">
              <span class="text-xs font-semibold text-muted block mb-2">Saved Snippets (${existingSnippets.length})</span>
              <div class="flex flex-col gap-2 max-h-40 overflow-y-auto">
                ${existingSnippets.map(s => `
                  <div class="card p-2 flex justify-between items-center text-xs">
                    <span class="font-medium cursor-pointer text-primary btn-load-snip" data-content="${escapeHTML(s.content)}">${escapeHTML(s.title)}</span>
                    <button class="btn-icon-xs text-rose btn-del-snip" data-id="${s.id}">&times;</button>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
        <div class="modal-footer p-3 border-t flex justify-end gap-2">
          <button class="btn btn-sm btn-secondary btn-modal-close">Cancel</button>
          <button class="btn btn-sm btn-primary" id="btn-confirm-save-snippet">Save Snippet</button>
        </div>
      </div>
    `;

    this.modal.classList.add('active');

    this.modal.querySelectorAll('.btn-modal-close, .modal-backdrop').forEach(b => {
      b.addEventListener('click', () => this.modal.classList.remove('active'));
    });

    this.modal.querySelector('#btn-confirm-save-snippet')?.addEventListener('click', () => {
      const title = this.modal.querySelector('#snippet-title-input').value;
      const text = this.modal.querySelector('#snippet-content-input').value;
      if (title.trim() && text) {
        saveSnippet(toolId, title, text);
        this.modal.classList.remove('active');
      }
    });

    this.modal.querySelectorAll('.btn-load-snip').forEach(b => {
      b.addEventListener('click', () => {
        if (primaryInput) {
          primaryInput.value = b.dataset.content;
          primaryInput.dispatchEvent(new Event('input'));
        }
        this.modal.classList.remove('active');
      });
    });

    this.modal.querySelectorAll('.btn-del-snip').forEach(b => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteSnippet(b.dataset.id);
        this.openSaveSnippetModal(toolId);
      });
    });
  }
}



// Bootstrap
function startDevBench() {
  const app = new DevBenchApp();
  app.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startDevBench);
} else {
  startDevBench();
}
