/**
 * NoteSpace - Global Command Palette & Unified Search
 * Triggered via Ctrl+K or Cmd+K. Searches page titles, block contents, databases, and workspace actions.
 */

import { store } from '../state/store.js';
import { Icons, getIcon } from '../icons/icons.js';
import { createElement, escapeHTML } from '../utils/dom.js';

export class CommandPalette {
  constructor(actions = {}) {
    this.actions = actions;
    this.backdropEl = null;
    this.isOpen = false;
    this.selectedIndex = 0;
    this.results = [];
    this.query = '';

    this.bindGlobalShortcut();
  }

  bindGlobalShortcut() {
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.query = '';
    this.selectedIndex = 0;
    this.render();

    const inp = this.backdropEl.querySelector('.ns-palette-input');
    setTimeout(() => inp.focus(), 30);
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    if (this.backdropEl) {
      this.backdropEl.remove();
      this.backdropEl = null;
    }
  }

  render() {
    if (this.backdropEl) this.backdropEl.remove();

    this.backdropEl = createElement('div', 'ns-modal-backdrop ns-palette-backdrop');
    const palette = createElement('div', 'ns-command-palette');

    palette.innerHTML = `
      <div class="ns-palette-input-wrap">
        <span class="ns-palette-search-icon">${Icons.search}</span>
        <input type="text" class="ns-palette-input" placeholder="Search pages, notes, or run a command..." value="${escapeHTML(this.query)}" />
        <kbd class="ns-kbd-esc">ESC</kbd>
      </div>
      <div class="ns-palette-results-list"></div>
      <div class="ns-palette-footer">
        <div class="ns-palette-hint"><kbd>↑</kbd><kbd>↓</kbd> Navigate</div>
        <div class="ns-palette-hint"><kbd>↵</kbd> Select</div>
        <div class="ns-palette-hint"><kbd>ESC</kbd> Close</div>
      </div>
    `;

    this.backdropEl.appendChild(palette);
    document.body.appendChild(this.backdropEl);

    const input = palette.querySelector('.ns-palette-input');
    const resultsContainer = palette.querySelector('.ns-palette-results-list');

    input.addEventListener('input', (e) => {
      this.query = e.target.value;
      this.selectedIndex = 0;
      this.computeResults();
      this.renderResultsList(resultsContainer);
    });

    input.addEventListener('keydown', (e) => {
      this.handleKeyDown(e);
    });

    this.backdropEl.addEventListener('click', (e) => {
      if (e.target === this.backdropEl) this.close();
    });

    this.computeResults();
    this.renderResultsList(resultsContainer);
  }

  computeResults() {
    const q = this.query.trim().toLowerCase();
    const results = [];

    const pages = store.getAllPages().filter(p => !p.isTrash);

    // 1. Matched Pages
    pages.forEach(p => {
      const titleMatch = (p.title || 'Untitled').toLowerCase().includes(q);
      let matchedBlockSnippet = '';

      if (!titleMatch && q) {
        // Search inside block contents
        for (const b of (p.blocks || [])) {
          const content = (b.content || '').replace(/<[^>]*>/g, '');
          if (content.toLowerCase().includes(q)) {
            const idx = content.toLowerCase().indexOf(q);
            const start = Math.max(0, idx - 20);
            const snippet = content.substring(start, start + 70);
            matchedBlockSnippet = (start > 0 ? '...' : '') + snippet + '...';
            break;
          }
        }
      }

      if (!q || titleMatch || matchedBlockSnippet) {
        results.push({
          type: 'page',
          id: p.id,
          title: p.title || 'Untitled',
          icon: p.icon || '📄',
          snippet: matchedBlockSnippet,
          action: () => store.setActivePage(p.id)
        });
      }
    });

    // 2. System Commands
    const commands = [
      {
        id: 'cmd-new-page',
        label: 'Create New Page',
        category: 'Action',
        icon: 'plus',
        action: () => store.createPage({ title: 'Untitled' })
      },
      {
        id: 'cmd-new-db',
        label: 'Create New Database',
        category: 'Action',
        icon: 'database',
        action: () => {
          store.createDatabase({ title: 'New Database' }).then(db => {
            store.createPage({
              title: db.title,
              icon: '📊',
              databaseId: db.id,
              blocks: [{ id: 'b-1', type: 'database', content: '', metadata: { databaseId: db.id } }]
            });
          });
        }
      },
      {
        id: 'cmd-theme',
        label: 'Toggle Dark / Light Theme',
        category: 'Preferences',
        icon: 'moon',
        action: () => {
          const cur = store.getSetting('theme', 'dark');
          const next = cur === 'dark' ? 'light' : 'dark';
          store.setSetting('theme', next);
        }
      },
      {
        id: 'cmd-export-json',
        label: 'Export Workspace (JSON Backup)',
        category: 'Data',
        icon: 'download',
        action: () => {
          if (this.actions.onExportWorkspace) this.actions.onExportWorkspace();
        }
      },
      {
        id: 'cmd-export-md',
        label: 'Export Current Page as Markdown',
        category: 'Data',
        icon: 'fileText',
        action: () => {
          if (this.actions.onExportMarkdown) this.actions.onExportMarkdown();
        }
      },
      {
        id: 'cmd-settings',
        label: 'Open Settings & Preferences',
        category: 'Navigation',
        icon: 'settings',
        action: () => {
          if (this.actions.onOpenSettings) this.actions.onOpenSettings();
        }
      },
      {
        id: 'cmd-trash',
        label: 'Open Trash',
        category: 'Navigation',
        icon: 'trash',
        action: () => {
          if (this.actions.onOpenTrash) this.actions.onOpenTrash();
        }
      },
      {
        id: 'cmd-history',
        label: 'View Page Revision History',
        category: 'History',
        icon: 'history',
        action: () => {
          if (this.actions.onOpenHistory) this.actions.onOpenHistory();
        }
      }
    ];

    commands.forEach(cmd => {
      if (!q || cmd.label.toLowerCase().includes(q) || cmd.category.toLowerCase().includes(q)) {
        results.push({
          type: 'command',
          id: cmd.id,
          title: cmd.label,
          category: cmd.category,
          icon: getIcon(cmd.icon),
          action: cmd.action
        });
      }
    });

    this.results = results;
  }

  renderResultsList(containerEl) {
    containerEl.innerHTML = '';

    if (this.results.length === 0) {
      containerEl.innerHTML = `
        <div class="ns-palette-no-results">
          <p>No results found for "${escapeHTML(this.query)}"</p>
        </div>
      `;
      return;
    }

    this.results.forEach((item, index) => {
      const row = createElement('div', `ns-palette-item ${index === this.selectedIndex ? 'is-selected' : ''}`);

      if (item.type === 'page') {
        row.innerHTML = `
          <div class="ns-pal-icon">${item.icon}</div>
          <div class="ns-pal-info">
            <div class="ns-pal-title">${this.highlightMatch(item.title, this.query)}</div>
            ${item.snippet ? `<div class="ns-pal-snippet">${this.highlightMatch(item.snippet, this.query)}</div>` : ''}
          </div>
          <div class="ns-pal-badge">Page</div>
        `;
      } else {
        row.innerHTML = `
          <div class="ns-pal-icon">${item.icon}</div>
          <div class="ns-pal-info">
            <div class="ns-pal-title">${this.highlightMatch(item.title, this.query)}</div>
          </div>
          <div class="ns-pal-badge ns-badge-cmd">${item.category}</div>
        `;
      }

      row.addEventListener('mouseenter', () => {
        this.selectedIndex = index;
        this.updateSelection(containerEl);
      });

      row.addEventListener('click', () => {
        this.executeSelected();
      });

      containerEl.appendChild(row);
    });
  }

  highlightMatch(text, query) {
    if (!query) return escapeHTML(text);
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return escapeHTML(text).replace(regex, '<mark class="ns-mark">$1</mark>');
  }

  updateSelection(containerEl) {
    const items = containerEl.querySelectorAll('.ns-palette-item');
    items.forEach((item, i) => {
      if (i === this.selectedIndex) {
        item.classList.add('is-selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('is-selected');
      }
    });
  }

  handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.results.length > 0) {
        this.selectedIndex = (this.selectedIndex + 1) % this.results.length;
        const list = this.backdropEl.querySelector('.ns-palette-results-list');
        if (list) this.updateSelection(list);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.results.length > 0) {
        this.selectedIndex = (this.selectedIndex - 1 + this.results.length) % this.results.length;
        const list = this.backdropEl.querySelector('.ns-palette-results-list');
        if (list) this.updateSelection(list);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      this.executeSelected();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
    }
  }

  executeSelected() {
    const item = this.results[this.selectedIndex];
    if (item && item.action) {
      this.close();
      item.action();
    }
  }
}
