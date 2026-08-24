/* ==========================================================================
   WIREFRAMELAB - COMMAND PALETTE (CTRL+K)
   ========================================================================== */

import { state } from './state.js';
import { COMPONENT_DEFINITIONS, ARTBOARD_PRESETS, createObjectFromType, generateId } from './models.js';

export class CommandPaletteController {
  constructor(overlayEl, searchInputEl, resultsListEl) {
    this.overlayEl = overlayEl;
    this.searchInputEl = searchInputEl;
    this.resultsListEl = resultsListEl;
    this.selectedIndex = 0;
    this.commands = [];

    this.buildCommands();
    this.initEvents();
  }

  buildCommands() {
    this.commands = [
      // Tools
      { id: 'tool-select', title: 'Select Tool', group: 'Tools', shortcut: 'V', action: () => state.setActiveTool('select') },
      { id: 'tool-hand', title: 'Hand / Pan Tool', group: 'Tools', shortcut: 'H / Space', action: () => state.setActiveTool('hand') },
      { id: 'tool-artboard', title: 'Add New Artboard', group: 'Tools', shortcut: 'A', action: () => state.setActiveTool('artboard') },
      { id: 'tool-box', title: 'Draw Rectangle', group: 'Tools', shortcut: 'R', action: () => state.setActiveTool('box') },
      { id: 'tool-text', title: 'Add Text Block', group: 'Tools', shortcut: 'T', action: () => state.setActiveTool('text') },

      // Actions
      { id: 'act-undo', title: 'Undo', group: 'Edit', shortcut: 'Ctrl+Z', action: () => state.undo() },
      { id: 'act-redo', title: 'Redo', group: 'Edit', shortcut: 'Ctrl+Y', action: () => state.redo() },
      { id: 'act-duplicate', title: 'Duplicate Selection', group: 'Edit', shortcut: 'Ctrl+D', action: () => state.duplicateSelection() },
      { id: 'act-delete', title: 'Delete Selection', group: 'Edit', shortcut: 'Delete', action: () => state.deleteSelection() },
      { id: 'act-group', title: 'Group Selection', group: 'Edit', shortcut: 'Ctrl+G', action: () => state.groupObjects(Array.from(state.selection)) },
      
      // View & Mode
      { id: 'view-proto', title: 'Toggle Prototype Mode', group: 'View', shortcut: 'Shift+E', action: () => state.setMode(state.mode === 'design' ? 'prototype' : 'design') },
      { id: 'view-theme', title: 'Toggle Light / Dark Theme', group: 'View', shortcut: '', action: () => state.setTheme(state.theme === 'theme-dark' ? 'theme-light' : 'theme-dark') },
      { id: 'view-fit', title: 'Zoom to Fit All Artboards', group: 'View', shortcut: 'Shift+1', action: () => window.appCanvasCtrl?.zoomToFitAll() },
      { id: 'view-100', title: 'Zoom to 100%', group: 'View', shortcut: 'Shift+0', action: () => window.appCanvasCtrl?.resetZoom() },

      // Presets & Artboards
      ...Object.entries(ARTBOARD_PRESETS).map(([key, preset]) => ({
        id: `ab-preset-${key}`,
        title: `Insert Artboard: ${preset.name} (${preset.width}×${preset.height})`,
        group: 'Artboards',
        shortcut: '',
        action: () => {
          const ab = {
            id: generateId('ab'),
            name: `${preset.name} — ${preset.width} × ${preset.height}`,
            preset: key,
            x: 100,
            y: 80,
            width: preset.width,
            height: preset.height,
            background: '#ffffff',
            locked: false,
            hidden: false
          };
          state.addArtboard(ab);
        }
      })),

      // Insert Components
      ...COMPONENT_DEFINITIONS.map(comp => ({
        id: `insert-${comp.type}`,
        title: `Insert Component: ${comp.name}`,
        group: 'Components',
        shortcut: '',
        action: () => {
          const obj = createObjectFromType(comp.type);
          const page = state.getActivePage();
          const firstAb = page.artboards[0];
          if (firstAb) {
            obj.x = Math.round((firstAb.width - obj.width) / 2);
            obj.y = Math.round((firstAb.height - obj.height) / 2);
            state.addObject(obj, firstAb.id);
          } else {
            obj.x = 200;
            obj.y = 200;
            state.addObject(obj, null);
          }
        }
      }))
    ];
  }

  initEvents() {
    // Open palette on Ctrl+K or Cmd+K
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.open();
      }
    });

    if (!this.overlayEl) return;

    this.overlayEl.addEventListener('click', (e) => {
      if (e.target === this.overlayEl) this.close();
    });

    this.searchInputEl.addEventListener('input', () => this.filterResults());
    this.searchInputEl.addEventListener('keydown', (e) => this.onInputKeyDown(e));
  }

  open() {
    this.overlayEl.classList.add('active');
    this.searchInputEl.value = '';
    this.selectedIndex = 0;
    this.filterResults();
    setTimeout(() => this.searchInputEl.focus(), 50);
  }

  close() {
    this.overlayEl.classList.remove('active');
  }

  filterResults() {
    const query = this.searchInputEl.value.trim().toLowerCase();
    const filtered = this.commands.filter(cmd => 
      cmd.title.toLowerCase().includes(query) || cmd.group.toLowerCase().includes(query)
    );

    this.renderResults(filtered);
  }

  renderResults(results) {
    this.resultsListEl.innerHTML = '';
    if (results.length === 0) {
      this.resultsListEl.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 12px;">
          No matching actions found.
        </div>
      `;
      return;
    }

    let currentGroup = '';
    results.forEach((cmd, idx) => {
      if (cmd.group !== currentGroup) {
        currentGroup = cmd.group;
        const groupEl = document.createElement('div');
        groupEl.className = 'palette-group-title';
        groupEl.textContent = currentGroup;
        this.resultsListEl.appendChild(groupEl);
      }

      const item = document.createElement('div');
      item.className = `palette-item ${idx === this.selectedIndex ? 'active' : ''}`;
      item.dataset.index = idx;
      item.innerHTML = `
        <div class="palette-item-left">
          <span>${escapeHTML(cmd.title)}</span>
        </div>
        ${cmd.shortcut ? `<kbd>${cmd.shortcut}</kbd>` : ''}
      `;

      item.addEventListener('click', () => {
        this.close();
        cmd.action();
      });

      this.resultsListEl.appendChild(item);
    });
  }

  onInputKeyDown(e) {
    const items = this.resultsListEl.querySelectorAll('.palette-item');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.selectedIndex = Math.min(items.length - 1, this.selectedIndex + 1);
      this.updateActiveItem();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.selectedIndex = Math.max(0, this.selectedIndex - 1);
      this.updateActiveItem();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const activeEl = items[this.selectedIndex];
      if (activeEl) activeEl.click();
    } else if (e.key === 'Escape') {
      this.close();
    }
  }

  updateActiveItem() {
    const items = this.resultsListEl.querySelectorAll('.palette-item');
    items.forEach((it, idx) => {
      if (idx === this.selectedIndex) {
        it.classList.add('active');
        it.scrollIntoView({ block: 'nearest' });
      } else {
        it.classList.remove('active');
      }
    });
  }
}

function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
