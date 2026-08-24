/**
 * FlowPilot Keyboard Shortcuts Manager & Help Modal
 */

class ShortcutsManager {
  constructor(app) {
    this.app = app;
    this.modal = null;
    this.clipboardNodes = [];

    this.initModal();
    this.initKeybindings();
  }

  initModal() {
    this.modal = document.createElement('div');
    this.modal.className = 'modal-overlay';
    this.modal.id = 'modal-shortcuts';

    this.modal.innerHTML = `
      <div class="modal-card" style="max-width:580px;">
        <div class="modal-header">
          <span class="modal-title">
            <span>⌨️</span> Keyboard Shortcuts
          </span>
          <button class="btn btn-ghost btn-sm btn-icon" id="btn-close-shortcuts">✕</button>
        </div>
        <div class="modal-body">
          <div class="shortcuts-grid">
            <div class="shortcut-row">
              <span class="shortcut-desc">Command Palette</span>
              <span class="shortcut-key">Ctrl + K</span>
            </div>
            <div class="shortcut-row">
              <span class="shortcut-desc">Run Workflow</span>
              <span class="shortcut-key">Ctrl + Enter</span>
            </div>
            <div class="shortcut-row">
              <span class="shortcut-desc">Undo / Redo</span>
              <span class="shortcut-key">Ctrl+Z / Ctrl+Y</span>
            </div>
            <div class="shortcut-row">
              <span class="shortcut-desc">Duplicate Selected</span>
              <span class="shortcut-key">Ctrl + D</span>
            </div>
            <div class="shortcut-row">
              <span class="shortcut-desc">Copy / Paste Nodes</span>
              <span class="shortcut-key">Ctrl+C / Ctrl+V</span>
            </div>
            <div class="shortcut-row">
              <span class="shortcut-desc">Delete Selected</span>
              <span class="shortcut-key">Delete / Backspace</span>
            </div>
            <div class="shortcut-row">
              <span class="shortcut-desc">Select All Nodes</span>
              <span class="shortcut-key">Ctrl + A</span>
            </div>
            <div class="shortcut-row">
              <span class="shortcut-desc">Fit to View</span>
              <span class="shortcut-key">Shift + 1</span>
            </div>
            <div class="shortcut-row">
              <span class="shortcut-desc">Pan Canvas</span>
              <span class="shortcut-key">Space + Drag</span>
            </div>
            <div class="shortcut-row">
              <span class="shortcut-desc">Zoom Canvas</span>
              <span class="shortcut-key">Mouse Wheel</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" id="btn-close-shortcuts-footer">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(this.modal);

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
    this.modal.querySelector('#btn-close-shortcuts').addEventListener('click', () => this.close());
    this.modal.querySelector('#btn-close-shortcuts-footer').addEventListener('click', () => this.close());
  }

  open() {
    this.modal.classList.add('active');
  }

  close() {
    this.modal.classList.remove('active');
  }

  initKeybindings() {
    window.addEventListener('keydown', (e) => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable;

      // Question mark for shortcuts modal
      if (e.key === '?' && !isInput) {
        e.preventDefault();
        this.open();
        return;
      }

      // Run workflow Ctrl+Enter / Cmd+Enter
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        this.app.runWorkflow();
        return;
      }

      // Save workflow version Ctrl+S
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        this.app.saveWorkflowVersion();
        return;
      }

      // Undo Ctrl+Z / Redo Ctrl+Y / Ctrl+Shift+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !isInput) {
        e.preventDefault();
        if (e.shiftKey) {
          this.app.redo();
        } else {
          this.app.undo();
        }
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y' && !isInput) {
        e.preventDefault();
        this.app.redo();
        return;
      }

      // Select All Ctrl+A
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a' && !isInput) {
        e.preventDefault();
        this.app.selectAllNodes();
        return;
      }

      // Duplicate Ctrl+D
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd' && !isInput) {
        e.preventDefault();
        this.app.duplicateSelectedNodes();
        return;
      }

      // Copy Ctrl+C / Paste Ctrl+V
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c' && !isInput) {
        e.preventDefault();
        this.copySelectedNodes();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v' && !isInput) {
        e.preventDefault();
        this.pasteCopiedNodes();
        return;
      }

      // Delete / Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isInput) {
        e.preventDefault();
        this.app.deleteSelectedNodes();
        return;
      }

      // Fit to View Shift+1
      if (e.shiftKey && e.key === '!' && !isInput) {
        e.preventDefault();
        this.app.fitToView();
        return;
      }
    });
  }

  copySelectedNodes() {
    this.clipboardNodes = [];
    this.app.selectedNodeIds.forEach(id => {
      const n = this.app.getNodeById(id);
      if (n) {
        this.clipboardNodes.push(JSON.parse(JSON.stringify(n)));
      }
    });
    if (this.clipboardNodes.length > 0) {
      this.app.toast(`Copied ${this.clipboardNodes.length} node(s)`, 'Clipboard', 'info');
    }
  }

  pasteCopiedNodes() {
    if (this.clipboardNodes.length === 0) return;

    this.app.clearSelection();
    const newIdsMap = new Map();

    this.clipboardNodes.forEach(orig => {
      const newId = 'node_' + Math.random().toString(36).substr(2, 6);
      newIdsMap.set(orig.id, newId);

      const copyNode = {
        ...orig,
        id: newId,
        title: `${orig.title} (Copy)`,
        position: {
          x: orig.position.x + 40,
          y: orig.position.y + 40
        }
      };

      this.app.workflow.nodes.push(copyNode);
      this.app.nodeRenderer.renderNode(copyNode);
      this.app.selectedNodeIds.add(newId);
    });

    this.app.updateSelectedNodeStyles();
    this.app.connectionManager.updateConnections();
    this.app.minimap.render();
    this.app.markDirty();
    this.app.saveHistoryState('Paste Nodes');
    this.app.toast(`Pasted ${this.clipboardNodes.length} node(s)`, 'Clipboard', 'success');
  }
}

window.ShortcutsManager = ShortcutsManager;
