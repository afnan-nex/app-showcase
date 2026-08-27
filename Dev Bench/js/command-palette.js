/**
 * DevBench - Command Palette Module (Ctrl+K / Cmd+K / Ctrl+P)
 * Fast keyboard-driven command palette for instant tool switching, search, and actions.
 */

import { TOOLS } from './tool-registry.js';
import { getIcon, escapeHTML } from './icons.js';
import { getRecentTools, getFavorites, clearAllHistory } from './storage.js';

export class CommandPalette {
  constructor(onSelectTool, onAction) {
    this.onSelectTool = onSelectTool;
    this.onAction = onAction;
    this.dialog = document.getElementById('command-palette-dialog');
    this.input = document.getElementById('palette-search-input');
    this.resultsList = document.getElementById('palette-results-list');
    this.selectedIndex = 0;
    this.currentItems = [];

    this.initListeners();
  }

  initListeners() {
    // Keyboard shortcut Ctrl+K or Cmd+K or Ctrl+P
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K' || e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        this.open();
      }
      if (e.key === 'Escape' && this.isOpen()) {
        e.preventDefault();
        this.close();
      }
    });

    // Input filter
    this.input?.addEventListener('input', () => {
      this.filterResults(this.input.value.trim());
    });

    // Keyboard navigation inside palette
    this.input?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.moveSelection(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.moveSelection(-1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.executeSelected();
      }
    });

    // Backdrop click
    this.dialog?.addEventListener('click', (e) => {
      if (e.target === this.dialog) this.close();
    });
  }

  open() {
    if (!this.dialog) return;
    this.dialog.classList.add('active');
    if (this.input) {
      this.input.value = '';
      this.filterResults('');
      setTimeout(() => this.input.focus(), 40);
    }
  }

  close() {
    if (!this.dialog) return;
    this.dialog.classList.remove('active');
  }

  isOpen() {
    return this.dialog?.classList.contains('active');
  }

  filterResults(query) {
    const q = query.toLowerCase();
    const favorites = getFavorites();
    const recents = getRecentTools();

    let items = [];

    // Filter tools
    TOOLS.forEach(tool => {
      let score = 0;
      const titleLower = tool.title.toLowerCase();
      const descLower = tool.desc.toLowerCase();
      const catLower = tool.category.toLowerCase();

      if (!q) {
        if (favorites.includes(tool.id)) score = 100;
        else if (recents.includes(tool.id)) score = 50;
        else score = 10;
      } else {
        if (titleLower === q) score = 1000;
        else if (titleLower.startsWith(q)) score = 500;
        else if (titleLower.includes(q)) score = 200;
        else if (descLower.includes(q)) score = 50;
        else if (catLower.includes(q)) score = 30;
      }

      if (score > 0) {
        items.push({
          type: 'tool',
          id: tool.id,
          title: tool.title,
          desc: tool.desc,
          category: tool.category,
          icon: tool.icon,
          isFav: favorites.includes(tool.id),
          score
        });
      }
    });

    // Actions
    const actions = [
      { type: 'action', id: 'theme-dark', title: 'Theme: Switch to Dark Mode', desc: 'High-contrast charcoal IDE palette', icon: 'moon', category: 'Preferences' },
      { type: 'action', id: 'theme-light', title: 'Theme: Switch to Light Mode', desc: 'Crisp developer light palette', icon: 'sun', category: 'Preferences' },
      { type: 'action', id: 'clear-all-history', title: 'History: Clear All Tool Inputs', desc: 'Remove stored input history across all tools', icon: 'trash', category: 'Workspace' },
      { type: 'action', id: 'close-all-tabs', title: 'Tabs: Close Other Tabs', desc: 'Keep only the currently active tool tab open', icon: 'close', category: 'Workspace' }
    ];

    actions.forEach(act => {
      if (!q || act.title.toLowerCase().includes(q) || act.desc.toLowerCase().includes(q)) {
        items.push({ ...act, score: q ? 150 : 5 });
      }
    });

    // Sort by score
    items.sort((a, b) => b.score - a.score);
    this.currentItems = items.slice(0, 12);
    this.selectedIndex = 0;
    this.renderResults();
  }

  renderResults() {
    if (this.currentItems.length === 0) {
      this.resultsList.innerHTML = `<div class="palette-empty p-4 text-center text-muted text-xs">No matching utilities or commands found.</div>`;
      return;
    }

    this.resultsList.innerHTML = this.currentItems.map((item, idx) => {
      const isSelected = idx === this.selectedIndex;
      return `
        <div class="palette-item ${isSelected ? 'selected' : ''}" data-idx="${idx}" role="option" aria-selected="${isSelected}">
          <div class="palette-item-icon">${getIcon(item.icon, 'icon-sm')}</div>
          <div class="palette-item-text">
            <span class="palette-item-title font-medium">${escapeHTML(item.title)}</span>
            ${item.desc ? `<span class="palette-item-desc text-xs text-muted">${escapeHTML(item.desc)}</span>` : ''}
          </div>
          <span class="palette-category-badge badge badge-secondary font-mono text-xs">${escapeHTML(item.category)}</span>
        </div>
      `;
    }).join('');

    this.resultsList.querySelectorAll('.palette-item').forEach(el => {
      el.addEventListener('click', () => {
        this.selectedIndex = parseInt(el.dataset.idx, 10);
        this.executeSelected();
      });
    });
  }

  moveSelection(dir) {
    if (this.currentItems.length === 0) return;
    this.selectedIndex = (this.selectedIndex + dir + this.currentItems.length) % this.currentItems.length;
    this.renderResults();
    const selectedEl = this.resultsList.querySelector(`.palette-item[data-idx="${this.selectedIndex}"]`);
    selectedEl?.scrollIntoView({ block: 'nearest' });
  }

  executeSelected() {
    const item = this.currentItems[this.selectedIndex];
    if (!item) return;

    this.close();

    if (item.type === 'tool') {
      this.onSelectTool(item.id);
    } else if (item.id === 'theme-dark') {
      window.dispatchEvent(new CustomEvent('SET_THEME', { detail: { theme: 'dark' } }));
    } else if (item.id === 'theme-light') {
      window.dispatchEvent(new CustomEvent('SET_THEME', { detail: { theme: 'light' } }));
    } else if (item.id === 'clear-all-history') {
      clearAllHistory();
      window.dispatchEvent(new CustomEvent('SHOW_TOAST', { detail: { message: 'Cleared all tool input history', type: 'info' } }));
    } else if (item.id === 'close-all-tabs') {
      if (this.onAction) this.onAction('close-other-tabs');
    }
  }
}
