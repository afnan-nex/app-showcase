/**
 * FlowPilot Main Application Coordinator
 */

class FlowPilotApp {
  constructor() {
    this.workflow = null;
    this.selectedNodeIds = new Set();
    this.selectedConnectionId = null;

    // History stack for Undo/Redo
    this.undoStack = [];
    this.redoStack = [];
    this.isDirty = false;
    this.autoSaveTimer = null;
    this.currentTheme = 'dark';

    this.initDOMRefs();
  }

  async init() {
    // 1. Initialize DB
    await window.flowDB.init();

    // 2. Load Theme Preference
    const savedTheme = await window.flowDB.getSetting('theme', 'dark');
    this.setTheme(savedTheme);

    // 3. Initialize Canvas & Viewport
    this.canvasController = new CanvasController(
      this.canvasWrapper,
      this.canvasTransformLayer,
      this.canvasGridBg
    );

    // 4. Initialize Minimap
    this.minimap = new FlowMinimap(
      this,
      this.minimapContainer,
      this.minimapCanvas,
      this.minimapViewportBox
    );
    this.canvasController.onChange(() => this.minimap.render());

    // 5. Initialize Connection Manager & Node Renderer
    this.connectionManager = new ConnectionManager(this, this.connectionsSvg);
    this.nodeRenderer = new NodeRenderer(this, this.nodesLayer);

    // 6. Initialize Drag & Drop & Marquee
    this.dragDrop = new DragDropManager(this, this.canvasController, this.marqueeSelectionBox);

    // 7. Initialize Property Panel & Execution Drawer
    this.propertyPanel = new PropertyPanel(this, this.sidebarRight);
    this.executionDrawer = new ExecutionDrawer(this, this.executionDrawerEl);

    // 8. Initialize Modals
    this.workflowManagerModal = new WorkflowManagerModal(this);
    this.commandPalette = new CommandPalette(this);
    this.templatesModal = new TemplatesModal(this);
    this.versionHistoryModal = new VersionHistoryModal(this);
    this.databaseViewerModal = new DatabaseViewerModal(this);
    this.emailViewerModal = new EmailViewerModal(this);
    this.shortcutsManager = new ShortcutsManager(this);

    // 9. Render Left Sidebar Node Library
    this.renderNodeLibrary();

    // 10. Wire Simulation Events
    this.wireSimulationEvents();

    // 11. Wire Topbar Controls & Canvas Buttons
    this.wireTopbarControls();
    this.wireCanvasControls();

    // 12. Load Last or Default Workflow
    await this.loadInitialWorkflow();

    // 13. Center & Fit Canvas
    setTimeout(() => {
      this.canvasController.fitToView(this.workflow.nodes);
      this.minimap.render();
    }, 150);

    console.log('FlowPilot enterprise application initialized.');
  }

  initDOMRefs() {
    this.appEl = document.getElementById('app');
    this.topbar = document.getElementById('topbar');
    this.sidebarLeft = document.getElementById('sidebar-left');
    this.sidebarRight = document.getElementById('sidebar-right');
    this.canvasWrapper = document.getElementById('canvas-wrapper');
    this.canvasTransformLayer = document.getElementById('canvas-transform-layer');
    this.canvasGridBg = document.getElementById('canvas-grid-bg');
    this.connectionsSvg = document.getElementById('connections-svg');
    this.nodesLayer = document.getElementById('nodes-layer');
    this.marqueeSelectionBox = document.getElementById('marquee-selection-box');
    this.executionDrawerEl = document.getElementById('execution-drawer');

    // Minimap elements
    this.minimapContainer = document.getElementById('minimap-container');
    this.minimapCanvas = document.getElementById('minimap-canvas');
    this.minimapViewportBox = document.getElementById('minimap-viewport-box');

    // Topbar inputs
    this.workflowTitleInput = document.getElementById('workflow-title-input');
    this.saveStatusEl = document.getElementById('save-status-indicator');
  }

  async loadInitialWorkflow() {
    const allWfs = await window.flowDB.getAllWorkflows();
    if (allWfs.length > 0) {
      this.loadWorkflow(allWfs[0], false);
    } else {
      const defaultWf = createDefaultWorkflow('Stripe Webhook & VIP Order Pipeline');
      await window.flowDB.saveWorkflow(defaultWf);
      this.loadWorkflow(defaultWf, false);
    }
  }

  loadWorkflow(wf, pushHistory = true) {
    this.workflow = JSON.parse(JSON.stringify(wf));
    if (!this.workflow.nodes) this.workflow.nodes = [];
    if (!this.workflow.connections) this.workflow.connections = [];
    if (!this.workflow.variables) this.workflow.variables = {};

    this.workflowTitleInput.value = this.workflow.name || 'Untitled Workflow';
    this.clearSelection();

    // Render nodes & connections
    this.nodeRenderer.renderAll(this.workflow.nodes);
    this.connectionManager.updateConnections();
    this.minimap.render();

    if (pushHistory) {
      this.saveHistoryState('Load Workflow');
      this.markDirty();
    }
  }

  createNewWorkflow() {
    const newWf = createDefaultWorkflow('New Automation Workflow');
    this.loadWorkflow(newWf);
    this.toast('Created new workflow', 'New Flow', 'success');
  }

  renderNodeLibrary() {
    const listContainer = document.getElementById('library-categories-list');
    const searchInput = document.getElementById('library-search-input');
    if (!listContainer) return;

    const render = (query = '') => {
      let html = '';
      NODE_CATEGORIES.forEach(cat => {
        const matchingTypes = cat.types.filter(t => {
          const def = NODE_REGISTRY[t];
          if (!query) return true;
          return def.title.toLowerCase().includes(query) || def.description.toLowerCase().includes(query);
        });

        if (matchingTypes.length > 0) {
          html += `
            <div class="category-group">
              <div class="category-group-header">${cat.name}</div>
              <div class="category-items">
          `;

          matchingTypes.forEach(t => {
            const def = NODE_REGISTRY[t];
            html += `
              <div class="library-node-item" draggable="true" data-node-type="${t}" title="${def.description}">
                <div class="library-item-icon" style="background:var(--cat-${def.category});">${def.icon}</div>
                <div class="library-item-info">
                  <div class="library-item-title">${def.title}</div>
                  <div class="library-item-desc">${def.description}</div>
                </div>
              </div>
            `;
          });

          html += `</div></div>`;
        }
      });

      listContainer.innerHTML = html;

      // Add dragstart handlers
      listContainer.querySelectorAll('.library-node-item').forEach(item => {
        item.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('application/flowpilot-node-type', item.dataset.nodeType);
          e.dataTransfer.effectAllowed = 'copy';
        });

        // Click to add at center
        item.addEventListener('click', () => {
          const center = this.canvasController.screenToCanvas(window.innerWidth / 2, window.innerHeight / 2);
          this.addNode(item.dataset.nodeType, { x: Math.round(center.x - 110), y: Math.round(center.y - 60) });
        });
      });
    };

    render('');

    searchInput?.addEventListener('input', (e) => {
      render(e.target.value.toLowerCase().trim());
    });
  }

  addNode(type, position = { x: 200, y: 200 }) {
    const reg = NODE_REGISTRY[type];
    if (!reg) return;

    const newNode = {
      id: 'node_' + Math.random().toString(36).substr(2, 6),
      type: type,
      title: reg.title,
      position: { ...position },
      configuration: JSON.parse(JSON.stringify(reg.defaultConfig || {}))
    };

    this.workflow.nodes.push(newNode);
    this.nodeRenderer.renderNode(newNode);
    this.selectSingleNode(newNode.id);
    this.connectionManager.updateConnections();
    this.minimap.render();
    this.markDirty();
    this.saveHistoryState(`Add ${reg.title}`);
    this.toast(`Added ${reg.title}`, 'Node Created', 'success');
  }

  addConnection(fromNodeId, fromPortId, toNodeId, toPortId) {
    const graph = new WorkflowGraph(this.workflow);
    const validation = graph.validateConnection(fromNodeId, fromPortId, toNodeId, toPortId);

    if (!validation.valid) {
      this.toast(validation.reason, 'Invalid Connection', 'warning');
      return;
    }

    const newConn = {
      id: 'conn_' + Math.random().toString(36).substr(2, 6),
      fromNodeId,
      fromPortId,
      toNodeId,
      toPortId
    };

    this.workflow.connections.push(newConn);
    this.connectionManager.updateConnections();
    this.minimap.render();
    this.markDirty();
    this.saveHistoryState('Connect Nodes');
  }

  deleteConnection(connId) {
    this.workflow.connections = this.workflow.connections.filter(c => c.id !== connId);
    this.connectionManager.updateConnections();
    this.minimap.render();
    this.markDirty();
    this.saveHistoryState('Delete Connection');
  }

  selectConnection(connId) {
    this.selectedConnectionId = connId;
    this.connectionsSvg.querySelectorAll('.connection-group').forEach(el => {
      if (el.dataset.connectionId === connId) {
        el.classList.add('selected');
      } else {
        el.classList.remove('selected');
      }
    });
  }

  getNodeById(id) {
    return (this.workflow.nodes || []).find(n => n.id === id);
  }

  selectSingleNode(nodeId) {
    this.clearSelection();
    this.selectedNodeIds.add(nodeId);
    this.updateSelectedNodeStyles();
    this.propertyPanel.showNode(nodeId);
  }

  toggleSelectNode(nodeId) {
    if (this.selectedNodeIds.has(nodeId)) {
      this.selectedNodeIds.delete(nodeId);
    } else {
      this.selectedNodeIds.add(nodeId);
    }
    this.updateSelectedNodeStyles();
    if (this.selectedNodeIds.size === 1) {
      this.propertyPanel.showNode(Array.from(this.selectedNodeIds)[0]);
    }
  }

  selectAllNodes() {
    this.selectedNodeIds.clear();
    (this.workflow.nodes || []).forEach(n => this.selectedNodeIds.add(n.id));
    this.updateSelectedNodeStyles();
  }

  clearSelection() {
    this.selectedNodeIds.clear();
    this.selectedConnectionId = null;
    this.updateSelectedNodeStyles();
    if (this.connectionsSvg) {
      this.connectionsSvg.querySelectorAll('.connection-group').forEach(el => el.classList.remove('selected'));
    }
  }

  updateSelectedNodeStyles() {
    this.nodesLayer.querySelectorAll('.flow-node').forEach(el => {
      const id = el.dataset.nodeId;
      if (this.selectedNodeIds.has(id)) {
        el.classList.add('selected');
      } else {
        el.classList.remove('selected');
      }
    });
  }

  duplicateNode(nodeId) {
    const orig = this.getNodeById(nodeId);
    if (!orig) return;

    const newId = 'node_' + Math.random().toString(36).substr(2, 6);
    const copyNode = {
      ...JSON.parse(JSON.stringify(orig)),
      id: newId,
      title: `${orig.title} (Copy)`,
      position: {
        x: orig.position.x + 30,
        y: orig.position.y + 30
      }
    };

    this.workflow.nodes.push(copyNode);
    this.nodeRenderer.renderNode(copyNode);
    this.selectSingleNode(newId);
    this.minimap.render();
    this.markDirty();
    this.saveHistoryState('Duplicate Node');
  }

  duplicateSelectedNodes() {
    this.shortcutsManager.copySelectedNodes();
    this.shortcutsManager.pasteCopiedNodes();
  }

  deleteNode(nodeId) {
    this.workflow.nodes = this.workflow.nodes.filter(n => n.id !== nodeId);
    this.workflow.connections = this.workflow.connections.filter(c => c.fromNodeId !== nodeId && c.toNodeId !== nodeId);

    this.nodeRenderer.removeNode(nodeId);
    this.selectedNodeIds.delete(nodeId);
    this.connectionManager.updateConnections();
    this.minimap.render();
    this.markDirty();
    this.saveHistoryState('Delete Node');
  }

  deleteSelectedNodes() {
    if (this.selectedNodeIds.size === 0) return;
    const count = this.selectedNodeIds.size;
    this.selectedNodeIds.forEach(id => {
      this.workflow.nodes = this.workflow.nodes.filter(n => n.id !== id);
      this.workflow.connections = this.workflow.connections.filter(c => c.fromNodeId !== id && c.toNodeId !== id);
      this.nodeRenderer.removeNode(id);
    });

    this.selectedNodeIds.clear();
    this.connectionManager.updateConnections();
    this.minimap.render();
    this.markDirty();
    this.saveHistoryState('Delete Selected');
    this.toast(`Deleted ${count} node(s)`, 'Nodes Removed', 'info');
  }

  // Simulation & Debugging Controls
  async runWorkflow(options = {}) {
    // Reset node visual status
    this.workflow.nodes.forEach(n => {
      this.nodeRenderer.updateNodeStatus(n.id, 'idle');
    });

    const execResult = await window.flowSimulation.runWorkflow(this.workflow, options);
    return execResult;
  }

  async testNode(nodeId) {
    const node = this.getNodeById(nodeId);
    if (!node) return;

    this.nodeRenderer.updateNodeStatus(nodeId, 'running');
    const result = await window.flowSimulation.testSingleNode(node);

    if (result.success) {
      this.nodeRenderer.updateNodeStatus(nodeId, 'success', result.durationMs);
      this.toast(`Test step passed (${result.durationMs}ms)`, node.title, 'success');
    } else {
      this.nodeRenderer.updateNodeStatus(nodeId, 'error', result.durationMs, result.error);
      this.toast(`Step error: ${result.error}`, node.title, 'error');
    }
  }

  stepNext() {
    window.flowSimulation.stepNext();
  }

  stopWorkflow() {
    window.flowSimulation.stopWorkflow();
    this.toast('Workflow execution stopped', 'Stopped', 'warning');
  }

  wireSimulationEvents() {
    const sim = window.flowSimulation;

    sim.on('start', (exec) => {
      this.executionDrawer.addExecution(exec);
      const runBtn = document.getElementById('btn-run-workflow');
      const stopBtn = document.getElementById('btn-stop-workflow');
      if (runBtn) runBtn.style.display = 'none';
      if (stopBtn) stopBtn.style.display = 'inline-flex';
    });

    sim.on('nodeStart', ({ node }) => {
      this.nodeRenderer.updateNodeStatus(node.id, 'running');
    });

    sim.on('nodeSuccess', ({ node, step }) => {
      this.nodeRenderer.updateNodeStatus(node.id, 'success', step.durationMs);
      this.executionDrawer.updateActiveExecution(sim.currentExecution);
    });

    sim.on('nodeError', ({ node, step }) => {
      this.nodeRenderer.updateNodeStatus(node.id, 'error', step.durationMs, step.error);
      this.executionDrawer.updateActiveExecution(sim.currentExecution);
    });

    sim.on('connectionActive', ({ connectionId }) => {
      this.connectionManager.animateActiveConnection(connectionId);
    });

    sim.on('complete', (exec) => {
      const runBtn = document.getElementById('btn-run-workflow');
      const stopBtn = document.getElementById('btn-stop-workflow');
      if (runBtn) runBtn.style.display = 'inline-flex';
      if (stopBtn) stopBtn.style.display = 'none';
      this.executionDrawer.updateActiveExecution(exec);
    });

    sim.on('aborted', () => {
      const runBtn = document.getElementById('btn-run-workflow');
      const stopBtn = document.getElementById('btn-stop-workflow');
      if (runBtn) runBtn.style.display = 'inline-flex';
      if (stopBtn) stopBtn.style.display = 'none';
    });
  }

  // History Undo / Redo
  saveHistoryState(actionName = 'Edit') {
    const snapshot = JSON.stringify(this.workflow);
    this.undoStack.push({ action: actionName, data: snapshot });
    if (this.undoStack.length > 40) this.undoStack.shift();
    this.redoStack = [];
    this.updateUndoRedoButtons();
  }

  undo() {
    if (this.undoStack.length <= 1) return;
    const current = this.undoStack.pop();
    this.redoStack.push(current);
    const prev = this.undoStack[this.undoStack.length - 1];
    if (prev) {
      this.loadWorkflow(JSON.parse(prev.data), false);
      this.updateUndoRedoButtons();
      this.toast(`Undo: ${current.action}`, 'History', 'info');
    }
  }

  redo() {
    if (this.redoStack.length === 0) return;
    const next = this.redoStack.pop();
    this.undoStack.push(next);
    this.loadWorkflow(JSON.parse(next.data), false);
    this.updateUndoRedoButtons();
    this.toast(`Redo: ${next.action}`, 'History', 'info');
  }

  updateUndoRedoButtons() {
    const btnUndo = document.getElementById('btn-undo');
    const btnRedo = document.getElementById('btn-redo');
    if (btnUndo) btnUndo.disabled = this.undoStack.length <= 1;
    if (btnRedo) btnRedo.disabled = this.redoStack.length === 0;
  }

  markDirty() {
    this.isDirty = true;
    if (this.saveStatusEl) {
      this.saveStatusEl.textContent = '• Unsaved';
      this.saveStatusEl.className = 'save-status-indicator dirty';
    }

    clearTimeout(this.autoSaveTimer);
    this.autoSaveTimer = setTimeout(async () => {
      await this.saveWorkflowToDB();
    }, 1000);
  }

  async saveWorkflowToDB() {
    if (!this.workflow) return;
    this.workflow.name = this.workflowTitleInput.value.trim() || 'Untitled Flow';
    await window.flowDB.saveWorkflow(this.workflow);
    this.isDirty = false;
    if (this.saveStatusEl) {
      this.saveStatusEl.textContent = '✓ Saved';
      this.saveStatusEl.className = 'save-status-indicator';
    }
  }

  async saveWorkflowVersion(name = null) {
    await this.saveWorkflowToDB();
    await window.flowDB.saveVersion(this.workflow.id, name, this.workflow);
    this.toast('Saved version snapshot', 'Version History', 'success');
  }

  // Viewport & Layout Helpers
  fitToView() {
    this.canvasController.fitToView(this.workflow.nodes);
    this.minimap.render();
  }

  toggleTheme() {
    const nextTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    window.flowDB.saveSetting('theme', theme);
    const themeBtn = document.getElementById('btn-toggle-theme');
    if (themeBtn) themeBtn.textContent = theme === 'dark' ? '🌙' : '☀️';
  }

  toggleMinimap() {
    this.minimapContainer.classList.toggle('hidden');
  }

  toggleSidebarLeft() {
    this.sidebarLeft.classList.toggle('collapsed');
  }

  // Modals Openers
  openWorkflowManager() { this.workflowManagerModal.open(); }
  openTemplatesModal() { this.templatesModal.open(); }
  openVersionHistoryModal() { this.versionHistoryModal.open(); }
  openDatabaseViewer() { this.databaseViewerModal.open(); }
  openEmailViewer() { this.emailViewerModal.open(); }
  openShortcutsModal() { this.shortcutsManager.open(); }
  openCommandPalette() { this.commandPalette.open(); }

  exportWorkflowJSON() {
    const jsonStr = JSON.stringify(this.workflow, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(this.workflow.name || 'workflow').toLowerCase().replace(/[^a-z0-9]/g, '_')}_export.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.toast('Workflow JSON downloaded', 'Export Complete', 'success');
  }

  openImportModal() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const imported = JSON.parse(evt.target.result);
          if (!imported.nodes || !imported.connections) {
            throw new Error('Invalid workflow JSON structure');
          }
          imported.id = 'wf_' + Date.now();
          this.loadWorkflow(imported);
          this.toast('Successfully imported workflow', 'Import Complete', 'success');
        } catch (err) {
          this.toast(`Import error: ${err.message}`, 'Invalid JSON', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  toast(msg, title, type) {
    if (window.flowToast) {
      window.flowToast.show(msg, title, type);
    }
  }

  wireTopbarControls() {
    // Brand click opens workflow manager
    document.getElementById('brand-logo')?.addEventListener('click', () => this.openWorkflowManager());

    // Workflow Title rename
    this.workflowTitleInput.addEventListener('input', () => {
      this.workflow.name = this.workflowTitleInput.value.trim();
      this.markDirty();
    });

    // Run & Stop & Step buttons
    document.getElementById('btn-run-workflow')?.addEventListener('click', () => this.runWorkflow());
    document.getElementById('btn-stop-workflow')?.addEventListener('click', () => this.stopWorkflow());
    document.getElementById('btn-step-workflow')?.addEventListener('click', () => {
      if (window.flowSimulation.status === 'idle') {
        this.runWorkflow({ stepMode: true });
      } else {
        this.stepNext();
      }
    });

    // Toggle Left Sidebar
    document.getElementById('btn-toggle-left-sidebar')?.addEventListener('click', () => this.toggleSidebarLeft());

    // Speed selector
    document.getElementById('select-sim-speed')?.addEventListener('change', (e) => {
      window.flowSimulation.setSpeed(Number(e.target.value));
    });

    // Undo / Redo
    document.getElementById('btn-undo')?.addEventListener('click', () => this.undo());
    document.getElementById('btn-redo')?.addEventListener('click', () => this.redo());

    // Modals
    document.getElementById('btn-open-wf-manager')?.addEventListener('click', () => this.openWorkflowManager());
    document.getElementById('btn-open-templates')?.addEventListener('click', () => this.openTemplatesModal());
    document.getElementById('btn-open-history')?.addEventListener('click', () => this.openVersionHistoryModal());
    document.getElementById('btn-open-db')?.addEventListener('click', () => this.openDatabaseViewer());
    document.getElementById('btn-open-emails')?.addEventListener('click', () => this.openEmailViewer());
    document.getElementById('btn-open-palette')?.addEventListener('click', () => this.openCommandPalette());
    document.getElementById('btn-toggle-theme')?.addEventListener('click', () => this.toggleTheme());
    document.getElementById('btn-export-json')?.addEventListener('click', () => this.exportWorkflowJSON());
    document.getElementById('btn-import-json')?.addEventListener('click', () => this.openImportModal());
    document.getElementById('btn-shortcuts-help')?.addEventListener('click', () => this.openShortcutsModal());
  }

  wireCanvasControls() {
    document.getElementById('btn-zoom-in')?.addEventListener('click', () => this.canvasController.zoomIn());
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => this.canvasController.zoomOut());
    document.getElementById('btn-zoom-reset')?.addEventListener('click', () => this.canvasController.resetZoom());
    document.getElementById('btn-fit-view')?.addEventListener('click', () => this.fitToView());
    document.getElementById('btn-toggle-grid')?.addEventListener('click', () => this.canvasController.toggleGrid());
    document.getElementById('btn-toggle-snap')?.addEventListener('click', () => this.canvasController.toggleSnap());
    document.getElementById('btn-toggle-minimap')?.addEventListener('click', () => this.toggleMinimap());
  }
}

// Instantiate on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  window.flowPilotApp = new FlowPilotApp();
  window.flowPilotApp.init();
});
