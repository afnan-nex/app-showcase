/* ==========================================================================
   CANVASFLOW — Searchable Command Palette (Ctrl+K)
   ========================================================================== */

import { appState } from '../state/state.js';
import { getIcon } from '../utils/icons.js';

export class CommandPalette {
  constructor(app) {
    this.app = app;
    this.modal = document.getElementById('modal-command-palette');
    this.input = document.getElementById('command-search-input');
    this.resultsList = document.getElementById('command-results-list');

    this.isOpen = false;
    this.selectedIndex = 0;
    this.filteredCommands = [];

    this._setupCommandsList();
    this._setupListeners();
  }

  _setupCommandsList() {
    this.allCommands = [
      // Tools
      { id: 'tool-select', title: 'Select Tool', category: 'Tools', shortcut: 'V', icon: 'select', action: () => appState.setActiveTool('select') },
      { id: 'tool-hand', title: 'Hand / Pan Tool', category: 'Tools', shortcut: 'H', icon: 'hand', action: () => appState.setActiveTool('hand') },
      { id: 'tool-rectangle', title: 'Rectangle Shape', category: 'Tools', shortcut: 'R', icon: 'rectangle', action: () => appState.setActiveTool('rectangle') },
      { id: 'tool-rounded-rect', title: 'Rounded Rectangle Shape', category: 'Tools', shortcut: 'U', icon: 'rounded-rectangle', action: () => appState.setActiveTool('rounded-rectangle') },
      { id: 'tool-ellipse', title: 'Ellipse / Circle Shape', category: 'Tools', shortcut: 'E', icon: 'ellipse', action: () => appState.setActiveTool('ellipse') },
      { id: 'tool-diamond', title: 'Diamond / Decision Shape', category: 'Tools', shortcut: 'D', icon: 'diamond', action: () => appState.setActiveTool('diamond') },
      { id: 'tool-arrow', title: 'Arrow Tool', category: 'Tools', shortcut: 'A', icon: 'arrow', action: () => appState.setActiveTool('arrow') },
      { id: 'tool-line', title: 'Line Tool', category: 'Tools', shortcut: 'L', icon: 'line', action: () => appState.setActiveTool('line') },
      { id: 'tool-connector', title: 'Smart Connector Tool', category: 'Tools', shortcut: 'C', icon: 'connector', action: () => appState.setActiveTool('connector') },
      { id: 'tool-pencil', title: 'Freehand Pencil', category: 'Tools', shortcut: 'P', icon: 'pencil', action: () => appState.setActiveTool('pencil') },
      { id: 'tool-highlighter', title: 'Highlighter Tool', category: 'Tools', shortcut: 'Shift+P', icon: 'highlighter', action: () => appState.setActiveTool('highlighter') },
      { id: 'tool-text', title: 'Text Tool', category: 'Tools', shortcut: 'T', icon: 'text', action: () => appState.setActiveTool('text') },
      { id: 'tool-sticky', title: 'Sticky Note Tool', category: 'Tools', shortcut: 'S', icon: 'sticky', action: () => appState.setActiveTool('sticky') },
      { id: 'tool-eraser', title: 'Eraser Tool', category: 'Tools', shortcut: 'X', icon: 'eraser', action: () => appState.setActiveTool('eraser') },

      // Navigation & Zoom
      { id: 'zoom-fit', title: 'Zoom to Fit All Content', category: 'View', shortcut: 'Shift+1', icon: 'select', action: () => {
        const { clientWidth, clientHeight } = this.app.canvasContainer;
        appState.zoomToFit(clientWidth, clientHeight);
      }},
      { id: 'zoom-selection', title: 'Zoom to Selected Objects', category: 'View', shortcut: 'Shift+2', icon: 'select', action: () => {
        const { clientWidth, clientHeight } = this.app.canvasContainer;
        appState.zoomToSelection(clientWidth, clientHeight);
      }},
      { id: 'zoom-reset', title: 'Reset Zoom (100%)', category: 'View', shortcut: 'Ctrl+0', icon: 'select', action: () => {
        const { clientWidth, clientHeight } = this.app.canvasContainer;
        appState.setViewport(clientWidth / 2, clientHeight / 2, 1.0);
      }},
      { id: 'toggle-grid', title: 'Toggle Grid Visible', category: 'View', shortcut: 'G', icon: 'select', action: () => {
        appState.settings.gridVisible = !appState.settings.gridVisible;
        this.app.renderer.requestRender();
      }},
      { id: 'toggle-snap', title: 'Toggle Snapping & Smart Guides', category: 'View', shortcut: 'S', icon: 'select', action: () => {
        appState.settings.snapEnabled = !appState.settings.snapEnabled;
      }},
      { id: 'toggle-rulers', title: 'Toggle Rulers', category: 'View', shortcut: 'Shift+R', icon: 'select', action: () => {
        appState.settings.rulersVisible = !appState.settings.rulersVisible;
        document.body.classList.toggle('show-rulers', appState.settings.rulersVisible);
        this.app.renderer.resize();
      }},
      { id: 'toggle-theme', title: 'Toggle Dark / Light Theme', category: 'View', shortcut: '', icon: 'select', action: () => {
        appState.applyTheme(appState.settings.theme === 'dark' ? 'light' : 'dark');
      }},

      // Editing & History
      { id: 'act-undo', title: 'Undo Last Action', category: 'Edit', shortcut: 'Ctrl+Z', icon: 'select', action: () => appState.undo() },
      { id: 'act-redo', title: 'Redo Action', category: 'Edit', shortcut: 'Ctrl+Shift+Z', icon: 'select', action: () => appState.redo() },
      { id: 'act-copy', title: 'Copy Selected', category: 'Edit', shortcut: 'Ctrl+C', icon: 'copy', action: () => appState.copySelected() },
      { id: 'act-paste', title: 'Paste from Clipboard', category: 'Edit', shortcut: 'Ctrl+V', icon: 'copy', action: () => appState.paste() },
      { id: 'act-duplicate', title: 'Duplicate Selected', category: 'Edit', shortcut: 'Ctrl+D', icon: 'duplicate', action: () => appState.duplicateSelected() },
      { id: 'act-group', title: 'Group Selected Objects', category: 'Edit', shortcut: 'Ctrl+G', icon: 'group', action: () => appState.groupSelected() },
      { id: 'act-ungroup', title: 'Ungroup Selected Objects', category: 'Edit', shortcut: 'Ctrl+Shift+G', icon: 'group', action: () => appState.ungroupSelected() },
      { id: 'act-lock', title: 'Lock / Unlock Selected', category: 'Edit', shortcut: 'Ctrl+L', icon: 'lock', action: () => appState.lockSelected() },
      { id: 'act-front', title: 'Bring to Front', category: 'Edit', shortcut: 'Ctrl+]', icon: 'bringFront', action: () => appState.bringToFront() },
      { id: 'act-back', title: 'Send to Back', category: 'Edit', shortcut: 'Ctrl+[', icon: 'sendBack', action: () => appState.sendToBack() },
      { id: 'act-delete', title: 'Delete Selected', category: 'Edit', shortcut: 'Del', icon: 'trash', action: () => appState.deleteSelected() },

      // Files & Export
      { id: 'file-export-png', title: 'Export Canvas as PNG Image...', category: 'File', shortcut: '', icon: 'image', action: () => this.app.modals.openExportModal() },
      { id: 'file-export-json', title: 'Export Board to JSON File', category: 'File', shortcut: '', icon: 'select', action: () => this.app.exportBoardJSON() },
      { id: 'file-import-json', title: 'Import Board JSON File...', category: 'File', shortcut: '', icon: 'select', action: () => document.getElementById('json-file-input').click() },
      { id: 'file-manage-boards', title: 'Open Board Manager...', category: 'File', shortcut: '', icon: 'select', action: () => this.app.modals.openBoardManager() },
      { id: 'help-shortcuts', title: 'View All Keyboard Shortcuts', category: 'Help', shortcut: '?', icon: 'info', action: () => document.getElementById('modal-shortcuts').classList.remove('hidden') }
    ];
  }

  _setupListeners() {
    // Open on Ctrl+K
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Close on backdrop click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    // Search input
    this.input.addEventListener('input', () => {
      this.filter(this.input.value.trim().toLowerCase());
    });

    // Arrow keys & Enter in palette
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.selectedIndex = (this.selectedIndex + 1) % Math.max(1, this.filteredCommands.length);
        this._updateHighlight();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.selectedIndex = (this.selectedIndex - 1 + this.filteredCommands.length) % Math.max(1, this.filteredCommands.length);
        this._updateHighlight();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this._executeSelected();
      }
    });
  }

  open() {
    this.isOpen = true;
    this.modal.classList.remove('hidden');
    this.input.value = '';
    this.filter('');
    this.input.focus();
  }

  close() {
    this.isOpen = false;
    this.modal.classList.add('hidden');
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  filter(query) {
    if (!query) {
      this.filteredCommands = [...this.allCommands];
    } else {
      this.filteredCommands = this.allCommands.filter(cmd => 
        cmd.title.toLowerCase().includes(query) ||
        cmd.category.toLowerCase().includes(query) ||
        (cmd.shortcut && cmd.shortcut.toLowerCase().includes(query))
      );
    }

    this.selectedIndex = 0;
    this.render();
  }

  render() {
    if (this.filteredCommands.length === 0) {
      this.resultsList.innerHTML = `<div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: var(--text-xs);">No matching actions found</div>`;
      return;
    }

    this.resultsList.innerHTML = this.filteredCommands.map((cmd, i) => `
      <div class="command-item ${i === this.selectedIndex ? 'active' : ''}" data-index="${i}">
        <div class="command-item-left">
          <span style="opacity:0.75">${getIcon(cmd.icon)}</span>
          <span>${cmd.title}</span>
        </div>
        ${cmd.shortcut ? `<kbd class="kbd-badge">${cmd.shortcut}</kbd>` : ''}
      </div>
    `).join('');

    this.resultsList.querySelectorAll('.command-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = Number(item.dataset.index);
        this.selectedIndex = idx;
        this._executeSelected();
      });
    });
  }

  _updateHighlight() {
    const items = this.resultsList.querySelectorAll('.command-item');
    items.forEach((item, i) => {
      item.classList.toggle('active', i === this.selectedIndex);
      if (i === this.selectedIndex) {
        item.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  _executeSelected() {
    const cmd = this.filteredCommands[this.selectedIndex];
    if (cmd && cmd.action) {
      this.close();
      cmd.action();
    }
  }
}
