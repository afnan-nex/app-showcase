/**
 * FlowPilot Command Palette (Ctrl+K / Cmd+K)
 */

class CommandPalette {
  constructor(app) {
    this.app = app;
    this.modal = null;
    this.input = null;
    this.resultsList = null;
    this.selectedIndex = 0;
    this.filteredCommands = [];

    this.init();
  }

  init() {
    this.modal = document.createElement('div');
    this.modal.className = 'modal-overlay';
    this.modal.id = 'modal-command-palette';

    this.modal.innerHTML = `
      <div class="modal-card command-palette-card" style="width: 540px;">
        <div class="palette-input-wrapper">
          <span>🔍</span>
          <input type="text" id="palette-search-input" placeholder="Type a command (e.g. 'Run', 'Add Webhook', 'Database', 'Theme')..." autocomplete="off" />
          <button class="btn btn-ghost btn-sm" id="btn-close-palette" style="padding:2px 6px;">Esc</button>
        </div>
        <div class="palette-results" id="palette-results-list"></div>
      </div>
    `;

    document.body.appendChild(this.modal);

    this.input = this.modal.querySelector('#palette-search-input');
    this.resultsList = this.modal.querySelector('#palette-results-list');

    // Close events
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
    this.modal.querySelector('#btn-close-palette').addEventListener('click', () => this.close());

    // Search input typing
    this.input.addEventListener('input', () => {
      this.selectedIndex = 0;
      this.filterAndRender();
    });

    // Keyboard navigation
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, this.filteredCommands.length - 1);
        this.updateSelection();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        this.updateSelection();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.executeSelected();
      } else if (e.key === 'Escape') {
        this.close();
      }
    });

    // Global shortcut Ctrl+K / Cmd+K
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  getCommands() {
    const list = [
      // Workflow Management
      { id: 'workflows', title: 'Manage & Switch Saved Workflows', icon: '🗂️', category: 'Workflows', action: () => this.app.openWorkflowManager() },
      { id: 'new_flow', title: 'Create New Blank Workflow', icon: '➕', category: 'Workflows', action: () => this.app.createNewWorkflow() },

      // Execution Actions
      { id: 'run', title: 'Run Workflow Simulation', icon: '▶', category: 'Execution', shortcut: 'Ctrl+Enter', action: () => this.app.runWorkflow() },
      { id: 'step', title: 'Step Next in Simulation', icon: '⏭', category: 'Execution', action: () => this.app.stepNext() },
      { id: 'stop', title: 'Stop Workflow Simulation', icon: '⏹', category: 'Execution', action: () => this.app.stopWorkflow() },

      // View & Canvas
      { id: 'fit', title: 'Fit Workflow to Viewport', icon: '⤢', category: 'Canvas', shortcut: 'Shift+1', action: () => this.app.fitToView() },
      { id: 'zoom_in', title: 'Zoom In', icon: '🔍+', category: 'Canvas', shortcut: 'Ctrl+=', action: () => this.app.canvasController.zoomIn() },
      { id: 'zoom_out', title: 'Zoom Out', icon: '🔍-', category: 'Canvas', shortcut: 'Ctrl+-', action: () => this.app.canvasController.zoomOut() },
      { id: 'zoom_reset', title: 'Reset Zoom (100%)', icon: '1:1', category: 'Canvas', shortcut: 'Ctrl+0', action: () => this.app.canvasController.resetZoom() },
      { id: 'toggle_grid', title: 'Cycle Grid Mode (Dots/Lines/Off)', icon: '▦', category: 'Canvas', action: () => this.app.canvasController.toggleGrid() },
      { id: 'toggle_snap', title: 'Toggle Snap to Grid', icon: '🧲', category: 'Canvas', action: () => this.app.canvasController.toggleSnap() },
      { id: 'toggle_minimap', title: 'Toggle Minimap', icon: '🗺️', category: 'Canvas', action: () => this.app.toggleMinimap() },

      // Modals & Panels
      { id: 'templates', title: 'Browse Workflow Templates Gallery', icon: '📁', category: 'Templates', action: () => this.app.openTemplatesModal() },
      { id: 'history', title: 'Workflow Version Snapshots & Restore', icon: '⏱️', category: 'History', action: () => this.app.openVersionHistoryModal() },
      { id: 'db_viewer', title: 'Simulated Database Tables Inspector', icon: '💾', category: 'Tools', action: () => this.app.openDatabaseViewer() },
      { id: 'email_inbox', title: 'Simulated Sent Emails Inbox', icon: '✉️', category: 'Tools', action: () => this.app.openEmailViewer() },
      { id: 'shortcuts', title: 'Keyboard Shortcuts Cheat Sheet', icon: '⌨️', category: 'Help', shortcut: '?', action: () => this.app.openShortcutsModal() },
      { id: 'theme', title: 'Toggle Dark / Light Theme', icon: '🌓', category: 'Appearance', action: () => this.app.toggleTheme() },
      { id: 'export_json', title: 'Export Workflow as JSON', icon: '⬇️', category: 'File', action: () => this.app.exportWorkflowJSON() },
      { id: 'import_json', title: 'Import Workflow JSON File', icon: '⬆️', category: 'File', action: () => this.app.openImportModal() },
      { id: 'save', title: 'Save Workflow Version Snapshot', icon: '💾', category: 'File', shortcut: 'Ctrl+S', action: () => this.app.saveWorkflowVersion() }
    ];

    // Add all 12 Node Types as commands
    for (const [typeKey, def] of Object.entries(NODE_REGISTRY)) {
      list.push({
        id: `add_node_${typeKey}`,
        title: `Add ${def.title} Node`,
        icon: def.icon || '📦',
        category: 'Add Node',
        action: () => {
          const center = this.app.canvasController.screenToCanvas(window.innerWidth / 2, window.innerHeight / 2);
          this.app.addNode(typeKey, { x: Math.round(center.x - 110), y: Math.round(center.y - 60) });
        }
      });
    }

    return list;
  }

  toggle() {
    if (this.modal.classList.contains('active')) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.modal.classList.add('active');
    this.input.value = '';
    this.selectedIndex = 0;
    this.filterAndRender();
    setTimeout(() => this.input.focus(), 50);
  }

  close() {
    this.modal.classList.remove('active');
  }

  filterAndRender() {
    const query = this.input.value.toLowerCase().trim();
    const all = this.getCommands();

    this.filteredCommands = all.filter(c => {
      if (!query) return true;
      return (
        c.title.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query) ||
        (c.id && c.id.toLowerCase().includes(query))
      );
    });

    if (this.filteredCommands.length === 0) {
      this.resultsList.innerHTML = '<div style="color:var(--text-muted); padding:16px; text-align:center; font-size:12px;">No matching commands found.</div>';
      return;
    }

    let html = '';
    this.filteredCommands.forEach((cmd, idx) => {
      const activeClass = idx === this.selectedIndex ? 'active' : '';
      const shortcutHtml = cmd.shortcut ? `<span class="palette-item-shortcut">${cmd.shortcut}</span>` : '';

      html += `
        <div class="palette-item ${activeClass}" data-index="${idx}">
          <div class="palette-item-left">
            <span style="font-size:14px; width:20px; text-align:center;">${cmd.icon}</span>
            <span>${this.escape(cmd.title)}</span>
            <span style="font-size:10px; color:var(--text-muted); background:var(--bg-input); padding:2px 6px; border-radius:4px;">${cmd.category}</span>
          </div>
          ${shortcutHtml}
        </div>
      `;
    });

    this.resultsList.innerHTML = html;

    this.resultsList.querySelectorAll('.palette-item').forEach(item => {
      item.addEventListener('click', () => {
        this.selectedIndex = parseInt(item.dataset.index, 10);
        this.executeSelected();
      });
    });
  }

  updateSelection() {
    const items = this.resultsList.querySelectorAll('.palette-item');
    items.forEach((item, idx) => {
      if (idx === this.selectedIndex) {
        item.classList.add('active');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('active');
      }
    });
  }

  executeSelected() {
    const cmd = this.filteredCommands[this.selectedIndex];
    if (cmd && cmd.action) {
      this.close();
      cmd.action();
    }
  }

  escape(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}

window.CommandPalette = CommandPalette;
