/* CanvasFlow Standalone Universal Bundle (Supports file:// and http://) */
(function() {
  const modules = {};
  const cache = {};

  function __require(id) {
    let normId = id;
    if (!normId.endsWith('.js')) normId += '.js';
    if (!normId.startsWith('./')) normId = './' + normId;
    normId = normId.replace(/\/\.\//g, '/');

    if (cache[normId]) {
      return cache[normId].exports;
    }

    if (!modules[normId]) {
      // Try resolving relative variations
      const keys = Object.keys(modules);
      const found = keys.find(k => k.endsWith(normId.replace(/^\.\//, '')) || normId.endsWith(k.replace(/^\.\//, '')));
      if (found) {
        normId = found;
        if (cache[normId]) return cache[normId].exports;
      } else {
        throw new Error('Cannot find module "' + id + '"');
      }
    }

    const module = { exports: {} };
    cache[normId] = module;
    modules[normId](module.exports, __require, module);
    return module.exports;
  }

modules["./app.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — Main Application Orchestrator
   Initialization, Global Events, Inline Text Editor, File Handling & Gestures
   ========================================================================== */

/* import { appState } from './state/state.js'; */
const appState = __require("./state/state.js").appState;
/* import { storage } from './state/storage.js'; */
const storage = __require("./state/storage.js").storage;
/* import { eventBus } from './state/event-bus.js'; */
const eventBus = __require("./state/event-bus.js").eventBus;
/* import { CanvasRenderer } from './renderer/canvas-renderer.js'; */
const CanvasRenderer = __require("./renderer/canvas-renderer.js").CanvasRenderer;
/* import { ToolManager } from './tools/tool-manager.js'; */
const ToolManager = __require("./tools/tool-manager.js").ToolManager;
/* import { Toolbar } from './ui/toolbar.js'; */
const Toolbar = __require("./ui/toolbar.js").Toolbar;
/* import { PropertiesPanel } from './ui/properties-panel.js'; */
const PropertiesPanel = __require("./ui/properties-panel.js").PropertiesPanel;
/* import { LayersPanel } from './ui/layers-panel.js'; */
const LayersPanel = __require("./ui/layers-panel.js").LayersPanel;
/* import { Minimap } from './ui/minimap.js'; */
const Minimap = __require("./ui/minimap.js").Minimap;
/* import { Rulers } from './ui/rulers.js'; */
const Rulers = __require("./ui/rulers.js").Rulers;
/* import { ContextMenu } from './ui/context-menu.js'; */
const ContextMenu = __require("./ui/context-menu.js").ContextMenu;
/* import { CommandPalette } from './ui/command-palette.js'; */
const CommandPalette = __require("./ui/command-palette.js").CommandPalette;
/* import { ModalManager } from './ui/modals.js'; */
const ModalManager = __require("./ui/modals.js").ModalManager;
/* import { ToastManager } from './ui/toast.js'; */
const ToastManager = __require("./ui/toast.js").ToastManager;
/* import { createSampleBoard } from './ui/sample-board.js'; */
const createSampleBoard = __require("./ui/sample-board.js").createSampleBoard;
/* import { createCanvasObject, generateId } from './state/document-model.js'; */
const createCanvasObject = __require("./state/document-model.js").createCanvasObject;
const generateId = __require("./state/document-model.js").generateId;
/* import { getObjectBounds, clamp } from './utils/math.js'; */
const getObjectBounds = __require("./utils/math.js").getObjectBounds;
const clamp = __require("./utils/math.js").clamp;
/* import { exportBoardToSVG } from './utils/svg-exporter.js'; */
const exportBoardToSVG = __require("./utils/svg-exporter.js").exportBoardToSVG;

class CanvasFlowApp {
  constructor() {
    // DOM Elements
    this.canvasContainer = document.getElementById('canvas-container');
    this.mainCanvas = document.getElementById('canvas-main');
    this.overlayCanvas = document.getElementById('canvas-overlay');

    // Inline Text Editor
    this.textEditorContainer = document.getElementById('text-editor-container');
    this.inlineTextEditor = document.getElementById('inline-text-editor');
    this.activeEditingObject = null;

    // Status Bar Elements
    this.statusCoords = document.getElementById('status-coords');
    this.statusSelection = document.getElementById('status-selection');
    this.statusObjectsCount = document.getElementById('status-objects-count');
    this.statusSaveState = document.getElementById('status-save-state');
    this.statusFps = document.getElementById('status-fps');

    // Gesture tracking for touch
    this.activeTouches = new Map();
    this.lastPinchDistance = null;
  }

  async init() {
    // 1. Initialize State & Storage
    await appState.init();

    // 2. Initialize UI Subsystems
    this.toast = new ToastManager();
    this.renderer = new CanvasRenderer(this.mainCanvas, this.overlayCanvas);
    this.toolManager = new ToolManager(this);
    this.toolbar = new Toolbar(this);
    this.propertiesPanel = new PropertiesPanel(this);
    this.layersPanel = new LayersPanel(this);
    this.minimap = new Minimap(this);
    this.rulers = new Rulers(this);
    this.contextMenu = new ContextMenu(this);
    this.commandPalette = new CommandPalette(this);
    this.modals = new ModalManager(this);

    // 3. Load First Launch Sample Board if empty
    const boards = await storage.listBoards();
    if (boards.length === 0) {
      const sample = createSampleBoard();
      await storage.saveBoard(sample);
      appState.loadBoardDocument(sample, false);
    } else if (!appState.board.objects || appState.board.objects.length === 0) {
      const latest = await storage.loadBoard(boards[0].id);
      if (latest) appState.loadBoardDocument(latest, false);
    }

    // 4. Setup Canvas Pointer, Keyboard & Gesture Listeners
    this._setupCanvasEvents();
    this._setupGlobalKeyboardShortcuts();
    this._setupDragDropAndClipboard();
    this._setupStatusBarEvents();
    this._setupInlineTextEditor();

    // 5. Initial Frame
    this.renderer.resize();
    this.renderer.requestRender();

    eventBus.emit('toast:show', { message: 'CanvasFlow Ready', type: 'info' });
  }

  setCursor(cursorStyle) {
    this.canvasContainer.setAttribute('data-cursor', cursorStyle);
  }

  // ------------------------------------------------------------------------
  // Pointer & Gesture Event Handlers
  // ------------------------------------------------------------------------

  _setupCanvasEvents() {
    const container = this.canvasContainer;

    // Pointer Down
    container.addEventListener('pointerdown', (e) => {
      if (e.target.closest('#text-editor-container') || e.target.closest('#quick-action-bar')) return;

      const rect = container.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      const worldPt = this.renderer.screenToWorld(screenX, screenY);

      this.closeInlineTextEditor();

      if (e.pointerType === 'touch') {
        this.activeTouches.set(e.pointerId, { x: screenX, y: screenY });
      }

      this.toolManager.onPointerDown(e, worldPt);
    });

    // Pointer Move
    window.addEventListener('pointermove', (e) => {
      const rect = container.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      const worldPt = this.renderer.screenToWorld(screenX, screenY);

      // Status Bar Coordinates update
      if (this.statusCoords) {
        this.statusCoords.textContent = `X: ${Math.round(worldPt.x)} | Y: ${Math.round(worldPt.y)}`;
      }

      // Handle multi-touch pinch zoom & pan
      if (e.pointerType === 'touch' && this.activeTouches.has(e.pointerId)) {
        this.activeTouches.set(e.pointerId, { x: screenX, y: screenY });

        if (this.activeTouches.size === 2) {
          const [t1, t2] = Array.from(this.activeTouches.values());
          const currentDist = Math.hypot(t2.x - t1.x, t2.y - t1.y);

          if (this.lastPinchDistance) {
            const zoomFactor = currentDist / this.lastPinchDistance;
            const midX = (t1.x + t2.x) / 2;
            const midY = (t1.y + t2.y) / 2;
            appState.zoomAt(midX, midY, zoomFactor);
          }
          this.lastPinchDistance = currentDist;
          return;
        }
      }

      this.toolManager.onPointerMove(e, worldPt);
    });

    // Pointer Up
    window.addEventListener('pointerup', (e) => {
      const rect = container.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      const worldPt = this.renderer.screenToWorld(screenX, screenY);

      if (e.pointerType === 'touch') {
        this.activeTouches.delete(e.pointerId);
        if (this.activeTouches.size < 2) {
          this.lastPinchDistance = null;
        }
      }

      this.toolManager.onPointerUp(e, worldPt);
    });

    // Double Click
    container.addEventListener('dblclick', (e) => {
      const rect = container.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      const worldPt = this.renderer.screenToWorld(screenX, screenY);

      this.toolManager.onDoubleClick(e, worldPt);
    });

    // Wheel Zoom & Wheel Pan (Touchpad)
    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      if (e.ctrlKey || e.metaKey) {
        // Pinch zoom or Ctrl+Wheel
        const zoomDelta = -e.deltaY * 0.005;
        const factor = Math.exp(zoomDelta);
        appState.zoomAt(screenX, screenY, factor);
      } else {
        // Standard two-finger or wheel pan
        appState.panBy(-e.deltaX, -e.deltaY);
      }
    }, { passive: false });
  }

  // ------------------------------------------------------------------------
  // Global Keyboard Shortcuts
  // ------------------------------------------------------------------------

  _setupGlobalKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      const isInputActive = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
      if (isInputActive) return;

      const isCtrl = e.ctrlKey || e.metaKey;

      // 1. Tool shortcuts
      if (!isCtrl && !e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'v': appState.setActiveTool('select'); break;
          case 'h': appState.setActiveTool('hand'); break;
          case 'r': appState.setActiveTool('rectangle'); break;
          case 'u': appState.setActiveTool('rounded-rectangle'); break;
          case 'e': appState.setActiveTool('ellipse'); break;
          case 'd': appState.setActiveTool('diamond'); break;
          case 'a': appState.setActiveTool('arrow'); break;
          case 'l': appState.setActiveTool('line'); break;
          case 'c': appState.setActiveTool('connector'); break;
          case 'p':
            if (e.shiftKey) appState.setActiveTool('highlighter');
            else appState.setActiveTool('pencil');
            break;
          case 'm': appState.setActiveTool('highlighter'); break;
          case 't': appState.setActiveTool('text'); break;
          case 's':
          case 'n':
            appState.setActiveTool('sticky'); break;
          case 'x': appState.setActiveTool('eraser'); break;
          case 'g':
            appState.settings.gridVisible = !appState.settings.gridVisible;
            document.getElementById('btn-toggle-grid')?.classList.toggle('active', appState.settings.gridVisible);
            this.renderer.requestRender();
            break;
          case '?':
            document.getElementById('modal-shortcuts')?.classList.remove('hidden');
            break;
          case 'delete':
          case 'backspace':
            appState.deleteSelected();
            break;
          case 'escape':
            appState.clearSelection();
            break;
        }
      }

      // 2. Control Shortcuts
      if (isCtrl) {
        switch (e.key.toLowerCase()) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) appState.redo();
            else appState.undo();
            break;
          case 'y':
            e.preventDefault();
            appState.redo();
            break;
          case 'c':
            if (appState.copySelected()) e.preventDefault();
            break;
          case 'x':
            e.preventDefault();
            appState.cutSelected();
            break;
          case 'v':
            e.preventDefault();
            appState.paste();
            break;
          case 'd':
            e.preventDefault();
            appState.duplicateSelected();
            break;
          case 'a':
            e.preventDefault();
            appState.selectAll();
            break;
          case 'g':
            e.preventDefault();
            if (e.shiftKey) appState.ungroupSelected();
            else appState.groupSelected();
            break;
          case 'l':
            e.preventDefault();
            appState.lockSelected();
            break;
          case ']':
            e.preventDefault();
            appState.bringToFront();
            break;
          case '[':
            e.preventDefault();
            appState.sendToBack();
            break;
          case '0':
            e.preventDefault();
            const { clientWidth, clientHeight } = this.canvasContainer;
            appState.setViewport(clientWidth / 2, clientHeight / 2, 1.0);
            break;
          case '=':
          case '+':
            e.preventDefault();
            appState.zoomAt(this.canvasContainer.clientWidth / 2, this.canvasContainer.clientHeight / 2, 1.25);
            break;
          case '-':
            e.preventDefault();
            appState.zoomAt(this.canvasContainer.clientWidth / 2, this.canvasContainer.clientHeight / 2, 0.8);
            break;
          case 'p':
            e.preventDefault();
            window.print();
            break;
        }
      }

      // 3. Shift Shortcuts
      if (e.shiftKey && !isCtrl) {
        if (e.key === '!') {
          // Shift+1: Zoom to fit
          appState.zoomToFit(this.canvasContainer.clientWidth, this.canvasContainer.clientHeight);
        } else if (e.key === '@') {
          // Shift+2: Zoom to selection
          appState.zoomToSelection(this.canvasContainer.clientWidth, this.canvasContainer.clientHeight);
        } else if (e.key.toLowerCase() === 'r') {
          // Shift+R: Toggle rulers
          appState.settings.rulersVisible = !appState.settings.rulersVisible;
          document.body.classList.toggle('show-rulers', appState.settings.rulersVisible);
          this.renderer.resize();
        }
      }

      // Route to active tool for nudging etc.
      this.toolManager.onKeyDown(e);
    });

    window.addEventListener('keyup', (e) => {
      this.toolManager.onKeyUp(e);
    });
  }

  // ------------------------------------------------------------------------
  // Drag & Drop File Imports & Clipboard Paste
  // ------------------------------------------------------------------------

  _setupDragDropAndClipboard() {
    const container = this.canvasContainer;

    container.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    });

    container.addEventListener('drop', (e) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      if (files.length === 0) return;

      const rect = container.getBoundingClientRect();
      const dropWorldPt = this.renderer.screenToWorld(e.clientX - rect.left, e.clientY - rect.top);

      for (const file of files) {
        if (file.type.startsWith('image/')) {
          this.insertImageFile(file, dropWorldPt);
        } else if (file.name.endsWith('.json') || file.name.endsWith('.canvasflow')) {
          this.importJSONFile(file);
        }
      }
    });

    // Paste Image from system clipboard
    window.addEventListener('paste', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            const { clientWidth, clientHeight } = this.canvasContainer;
            const centerPt = this.renderer.screenToWorld(clientWidth / 2, clientHeight / 2);
            this.insertImageFile(file, centerPt);
          }
        }
      }
    });

    // JSON file input listener
    document.getElementById('json-file-input')?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) this.importJSONFile(file);
      e.target.value = '';
    });
  }

  insertImageFile(file, position = null) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        const aspect = img.naturalWidth / img.naturalHeight;
        let width = Math.min(400, img.naturalWidth);
        let height = width / aspect;

        let x = position ? position.x - width / 2 : 0;
        let y = position ? position.y - height / 2 : 0;

        if (!position) {
          const { clientWidth, clientHeight } = this.canvasContainer;
          const center = this.renderer.screenToWorld(clientWidth / 2, clientHeight / 2);
          x = center.x - width / 2;
          y = center.y - height / 2;
        }

        const imgObj = createCanvasObject('image', {
          x,
          y,
          width,
          height,
          src: dataUrl,
          aspectRatio: aspect
        });

        appState.addObject(imgObj, true);
        appState.setSelection(imgObj.id);
        eventBus.emit('toast:show', { message: 'Image added to canvas', type: 'success' });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  importJSONFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = storage.importFromJSONString(e.target.result);
        parsed.id = generateId('board');
        parsed.title = file.name.replace(/\.(json|canvasflow)$/i, '');
        storage.saveBoard(parsed);
        appState.loadBoardDocument(parsed, false);
        eventBus.emit('toast:show', { message: `Imported "${parsed.title}" successfully`, type: 'success' });
      } catch (err) {
        eventBus.emit('toast:show', { message: `Import failed: ${err.message}`, type: 'error' });
      }
    };
    reader.readAsText(file);
  }

  exportBoardJSON() {
    storage.exportToJSONFile(appState.board);
    eventBus.emit('toast:show', { message: 'Board JSON downloaded', type: 'info' });
  }

  exportBoardSVG() {
    const svgStr = exportBoardToSVG(appState.board, {
      theme: appState.settings.theme,
      bg: 'canvas',
      scope: 'all'
    });

    if (!svgStr) {
      eventBus.emit('toast:show', { message: 'Nothing to export on canvas', type: 'error' });
      return;
    }

    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${(appState.board.title || 'board').toLowerCase().replace(/\s+/g, '-')}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    eventBus.emit('toast:show', { message: 'Exported SVG Vector file', type: 'success' });
  }

  createNewBoard() {
    const newBoard = {
      id: generateId('board'),
      title: 'Untitled Board',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      viewport: { panX: this.canvasContainer.clientWidth / 2, panY: this.canvasContainer.clientHeight / 2, zoom: 1.0 },
      settings: { ...appState.settings },
      objects: []
    };
    storage.saveBoard(newBoard);
    appState.loadBoardDocument(newBoard, false);
    eventBus.emit('toast:show', { message: 'New board created', type: 'success' });
  }

  async duplicateCurrentBoard() {
    try {
      const dup = await storage.duplicateBoard(appState.board.id);
      appState.loadBoardDocument(dup, false);
      eventBus.emit('toast:show', { message: `Duplicated "${dup.title}"`, type: 'success' });
      return dup;
    } catch (err) {
      eventBus.emit('toast:show', { message: `Could not duplicate board: ${err.message}`, type: 'error' });
      throw err;
    }
  }

  async updateBoardListMenu() {
    const menuContainer = document.getElementById('board-list-menu');
    if (!menuContainer) return;

    const boards = await storage.listBoards();
    menuContainer.innerHTML = boards.map(b => {
      const isCurrent = b.id === appState.board.id;
      return `
        <button class="dropdown-item ${isCurrent ? 'active' : ''}" data-id="${b.id}">
          <span>${b.title}</span>
          ${isCurrent ? '<span style="color:var(--accent-primary); font-size:10px;">✓ Active</span>' : ''}
        </button>
      `;
    }).join('');

    menuContainer.querySelectorAll('.dropdown-item').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const b = await storage.loadBoard(id);
        if (b) {
          appState.loadBoardDocument(b, false);
          document.getElementById('board-dropdown')?.classList.add('hidden');
        }
      });
    });

    document.getElementById('btn-create-board-fast')?.addEventListener('click', () => {
      this.createNewBoard();
      document.getElementById('board-dropdown')?.classList.add('hidden');
    });
  }

  // ------------------------------------------------------------------------
  // Inline Text Editor Overlay
  // ------------------------------------------------------------------------

  _setupInlineTextEditor() {
    const textarea = this.inlineTextEditor;

    textarea.addEventListener('input', () => {
      if (!this.activeEditingObject) return;
      this.activeEditingObject.text = textarea.value;

      // Auto-resize height for text boxes
      if (this.activeEditingObject.type === 'text') {
        textarea.style.height = 'auto';
        textarea.style.height = `${Math.max(36, textarea.scrollHeight)}px`;
        this.activeEditingObject.height = textarea.scrollHeight / appState.viewport.zoom;
      }

      this.renderer.requestRender();
    });

    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.closeInlineTextEditor();
      }
    });

    textarea.addEventListener('blur', () => {
      this.closeInlineTextEditor();
    });
  }

  openInlineTextEditor(obj) {
    this.activeEditingObject = obj;
    const { panX, panY, zoom } = appState.viewport;

    const isSticky = obj.type === 'sticky';
    const padding = isSticky ? 12 * zoom : 0;

    const screenX = obj.x * zoom + panX + (isSticky ? padding : 0);
    const screenY = obj.y * zoom + panY + (isSticky ? padding : 0);
    const screenW = (obj.width * zoom) - (isSticky ? padding * 2 : 0);
    const screenH = (obj.height * zoom) - (isSticky ? padding * 2 : 0);

    const container = this.textEditorContainer;
    container.style.left = `${screenX}px`;
    container.style.top = `${screenY}px`;
    container.style.width = `${screenW}px`;
    container.style.height = `${screenH}px`;

    if (obj.rotation) {
      container.style.transform = `rotate(${obj.rotation}deg)`;
      container.style.transformOrigin = 'center center';
    } else {
      container.style.transform = 'none';
    }

    const textarea = this.inlineTextEditor;
    textarea.value = obj.text || '';
    textarea.style.fontSize = `${(obj.fontSize || (isSticky ? 15 : 18)) * zoom}px`;
    textarea.style.fontFamily = obj.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    textarea.style.fontWeight = obj.fontWeight || (isSticky ? '500' : 'normal');
    textarea.style.fontStyle = obj.fontStyle || 'normal';
    textarea.style.color = obj.color || (appState.settings.theme === 'dark' ? '#f3f4f6' : '#111827');
    textarea.style.textAlign = obj.textAlign || 'left';
    textarea.style.lineHeight = String(obj.lineHeight || 1.35);

    container.classList.remove('hidden');
    textarea.focus();
    textarea.select();
  }

  closeInlineTextEditor() {
    if (!this.activeEditingObject) return;

    const obj = this.activeEditingObject;
    const finalVal = this.inlineTextEditor.value.trim();

    if (finalVal === '' && obj.type === 'text') {
      appState.removeObject(obj.id, true);
    } else {
      obj.text = this.inlineTextEditor.value;
      appState.updateObject(obj.id, { text: obj.text }, true);
    }

    this.activeEditingObject = null;
    this.textEditorContainer.style.transform = 'none';
    this.textEditorContainer.classList.add('hidden');
    this.renderer.requestRender();
  }

  // ------------------------------------------------------------------------
  // Status Bar Sync
  // ------------------------------------------------------------------------

  _setupStatusBarEvents() {
    eventBus.on('selection:changed', (selected) => {
      if (this.statusSelection) {
        if (selected.length === 0) {
          this.statusSelection.textContent = 'No items selected';
        } else if (selected.length === 1) {
          this.statusSelection.textContent = `1 ${selected[0].type} selected`;
        } else {
          this.statusSelection.textContent = `${selected.length} items selected`;
        }
      }
    });

    eventBus.on('state:changed', () => {
      if (this.statusObjectsCount) {
        const count = appState.getObjects().length;
        this.statusObjectsCount.textContent = `${count} object${count === 1 ? '' : 's'}`;
      }
    });

    eventBus.on('storage:saving', () => {
      if (this.statusSaveState) {
        this.statusSaveState.innerHTML = `<span>Saving...</span>`;
      }
    });

    eventBus.on('storage:saved', () => {
      if (this.statusSaveState) {
        this.statusSaveState.innerHTML = `
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          <span>Saved</span>
        `;
      }
    });

    eventBus.on('renderer:fps', (fps) => {
      if (this.statusFps) {
        this.statusFps.textContent = `${fps} FPS`;
      }
    });
  }
}

// Bootstrap on DOM Ready
function startCanvasFlow() {
  const app = new CanvasFlowApp();
  app.init().catch(err => console.error('CanvasFlow initialization error:', err));
  window.canvasFlow = app;
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', startCanvasFlow);
} else {
  startCanvasFlow();
}

};

modules["./renderer/canvas-renderer.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — Canvas Renderer Engine
   High Performance Multi-Layer 2D Canvas Renderer with HiDPI & Culling
   ========================================================================== */

/* import { appState } from '../state/state.js'; */
const appState = __require("./state/state.js").appState;
/* import { eventBus } from '../state/event-bus.js'; */
const eventBus = __require("./state/event-bus.js").eventBus;
/* import {
  getObjectBounds,
  getSelectionHandles,
  getShapeAnchors,
  rotatePoint,
  catmullRomSpline,
  DEG_TO_RAD
} from '../utils/math.js'; */
const getObjectBounds = __require("./utils/math.js").getObjectBounds;
const getSelectionHandles = __require("./utils/math.js").getSelectionHandles;
const getShapeAnchors = __require("./utils/math.js").getShapeAnchors;
const rotatePoint = __require("./utils/math.js").rotatePoint;
const catmullRomSpline = __require("./utils/math.js").catmullRomSpline;
const DEG_TO_RAD = __require("./utils/math.js").DEG_TO_RAD;

exports.CanvasRenderer = class CanvasRenderer {
  constructor(mainCanvas, overlayCanvas) {
    this.mainCanvas = mainCanvas;
    this.overlayCanvas = overlayCanvas;
    this.ctx = mainCanvas.getContext('2d');
    this.overlayCtx = overlayCanvas.getContext('2d');

    this.dpr = window.devicePixelRatio || 1;
    this.width = 0;
    this.height = 0;

    this.needsRender = true;
    this.isRendering = false;

    // Image Cache to prevent reloading image bitmaps every frame
    this.imageCache = new Map();

    // Transient interaction overlays
    this.selectionMarquee = null; // { x, y, width, height } in world coords
    this.hoveredAnchor = null;   // { x, y, elementId, anchor }
    this.connectorDraft = null;  // { x1, y1, x2, y2 } in world coords
    this.eraserTrail = null;     // { x, y, radius }

    // Performance tracking
    this.fps = 60;
    this.frameCount = 0;
    this.lastFpsTime = performance.now();

    this._setupEvents();
    this.resize();
    this._startRenderLoop();
  }

  _setupEvents() {
    eventBus.on('state:changed', () => this.requestRender());
    eventBus.on('viewport:changed', () => this.requestRender());
    eventBus.on('selection:changed', () => this.requestRender());
    eventBus.on('settings:changed', () => this.requestRender());
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const parent = this.mainCanvas.parentElement;
    if (!parent) return;

    this.width = parent.clientWidth;
    this.height = parent.clientHeight;
    this.dpr = window.devicePixelRatio || 1;

    // Scale main canvas for HiDPI
    this.mainCanvas.width = this.width * this.dpr;
    this.mainCanvas.height = this.height * this.dpr;
    this.mainCanvas.style.width = `${this.width}px`;
    this.mainCanvas.style.height = `${this.height}px`;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);

    // Scale overlay canvas for HiDPI
    this.overlayCanvas.width = this.width * this.dpr;
    this.overlayCanvas.height = this.height * this.dpr;
    this.overlayCanvas.style.width = `${this.width}px`;
    this.overlayCanvas.style.height = `${this.height}px`;
    this.overlayCtx.setTransform(1, 0, 0, 1, 0, 0);
    this.overlayCtx.scale(this.dpr, this.dpr);

    this.requestRender();
  }

  requestRender() {
    this.needsRender = true;
  }

  _startRenderLoop() {
    const loop = (timestamp) => {
      // Calculate FPS
      this.frameCount++;
      if (timestamp - this.lastFpsTime >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / (timestamp - this.lastFpsTime));
        this.frameCount = 0;
        this.lastFpsTime = timestamp;
        eventBus.emit('renderer:fps', this.fps);
      }

      if (this.needsRender) {
        this.render();
        this.needsRender = false;
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  /**
   * Convert Screen coordinate to World (Canvas) coordinate
   */
  screenToWorld(screenX, screenY) {
    const { panX, panY, zoom } = appState.viewport;
    return {
      x: (screenX - panX) / zoom,
      y: (screenY - panY) / zoom
    };
  }

  /**
   * Convert World (Canvas) coordinate to Screen coordinate
   */
  worldToScreen(worldX, worldY) {
    const { panX, panY, zoom } = appState.viewport;
    return {
      x: worldX * zoom + panX,
      y: worldY * zoom + panY
    };
  }

  /**
   * Main Render Pipeline
   */
  render() {
    const { ctx, overlayCtx, width, height } = this;
    const { panX, panY, zoom } = appState.viewport;
    const { theme, gridVisible, gridType } = appState.settings;

    // 1. Clear Viewports
    ctx.clearRect(0, 0, width, height);
    overlayCtx.clearRect(0, 0, width, height);

    // 2. Render Grid Background
    if (gridVisible && gridType !== 'none') {
      this.renderGrid(ctx, panX, panY, zoom, gridType, theme);
    }

    // 3. Render Objects with Viewport Frustum Culling
    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);

    // Calculate visible world bounding box for spatial culling
    const viewportBounds = {
      x: -panX / zoom - 50,
      y: -panY / zoom - 50,
      width: width / zoom + 100,
      height: height / zoom + 100
    };

    const objects = appState.getObjects();
    for (const obj of objects) {
      if (obj.visible === false) continue;
      const b = getObjectBounds(obj);
      // Culling check
      if (
        b.x + b.width >= viewportBounds.x &&
        b.x <= viewportBounds.x + viewportBounds.width &&
        b.y + b.height >= viewportBounds.y &&
        b.y <= viewportBounds.y + viewportBounds.height
      ) {
        this.renderObject(ctx, obj);
      }
    }

    ctx.restore();

    // 4. Render Interactive Overlays (Selection, Handles, Guides, Anchors)
    this.renderOverlays(overlayCtx, panX, panY, zoom);
  }

  /**
   * Render Infinite Grid (Dots or Lines)
   */
  renderGrid(ctx, panX, panY, zoom, type, theme) {
    const isDark = theme === 'dark';
    const baseGridSize = 24;
    let gridSize = baseGridSize * zoom;

    // Adaptive step multiplier to maintain comfortable dot spacing at extreme zooms
    while (gridSize < 12) gridSize *= 2;
    while (gridSize > 60) gridSize /= 2;

    const startX = panX % gridSize;
    const startY = panY % gridSize;

    ctx.save();

    if (type === 'dots') {
      ctx.fillStyle = isDark ? '#2a2d38' : '#d8dde6';
      const dotRadius = Math.max(1, Math.min(2, zoom));
      for (let x = startX; x < this.width; x += gridSize) {
        for (let y = startY; y < this.height; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (type === 'lines') {
      ctx.strokeStyle = isDark ? '#1e2129' : '#ebedf2';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = startX; x < this.width; x += gridSize) {
        ctx.moveTo(Math.floor(x) + 0.5, 0);
        ctx.lineTo(Math.floor(x) + 0.5, this.height);
      }
      for (let y = startY; y < this.height; y += gridSize) {
        ctx.moveTo(0, Math.floor(y) + 0.5);
        ctx.lineTo(this.width, Math.floor(y) + 0.5);
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Render a single canvas object
   */
  renderObject(ctx, obj) {
    ctx.save();

    // Global Object Properties
    ctx.globalAlpha = obj.opacity ?? 1;

    // Apply Stroke & Fill Styles
    ctx.strokeStyle = obj.stroke || '#3b82f6';
    ctx.fillStyle = obj.fill || 'transparent';
    ctx.lineWidth = obj.strokeWidth || 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (obj.strokeStyle === 'dashed') {
      ctx.setLineDash([8, 6]);
    } else if (obj.strokeStyle === 'dotted') {
      ctx.setLineDash([3, 4]);
    } else {
      ctx.setLineDash([]);
    }

    // Rotation transform if any
    const center = {
      x: obj.x + (obj.width || 0) / 2,
      y: obj.y + (obj.height || 0) / 2
    };

    if (obj.rotation) {
      ctx.translate(center.x, center.y);
      ctx.rotate(obj.rotation * DEG_TO_RAD);
      ctx.translate(-center.x, -center.y);
    }

    // Dispatch object type renderer
    switch (obj.type) {
      case 'rectangle':
      case 'rounded-rectangle':
        this._renderRectangle(ctx, obj);
        break;
      case 'ellipse':
        this._renderEllipse(ctx, obj);
        break;
      case 'diamond':
        this._renderDiamond(ctx, obj);
        break;
      case 'line':
        this._renderLine(ctx, obj);
        break;
      case 'arrow':
        this._renderArrow(ctx, obj);
        break;
      case 'connector':
        this._renderConnector(ctx, obj);
        break;
      case 'pencil':
        this._renderPencil(ctx, obj);
        break;
      case 'highlighter':
        this._renderHighlighter(ctx, obj);
        break;
      case 'text':
        this._renderText(ctx, obj);
        break;
      case 'sticky':
        this._renderSticky(ctx, obj);
        break;
      case 'image':
        this._renderImage(ctx, obj);
        break;
    }

    ctx.restore();
  }

  _renderRectangle(ctx, obj) {
    const { x, y, width, height, cornerRadius = 0 } = obj;
    ctx.beginPath();
    if (cornerRadius > 0 && ctx.roundRect) {
      ctx.roundRect(x, y, width, height, Math.min(cornerRadius, width / 2, height / 2));
    } else {
      ctx.rect(x, y, width, height);
    }
    if (obj.fill && obj.fill !== 'transparent') ctx.fill();
    if (obj.stroke && obj.stroke !== 'transparent' && obj.strokeWidth > 0) ctx.stroke();
  }

  _renderEllipse(ctx, obj) {
    const { x, y, width, height } = obj;
    const rx = width / 2;
    const ry = height / 2;
    ctx.beginPath();
    ctx.ellipse(x + rx, y + ry, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, Math.PI * 2);
    if (obj.fill && obj.fill !== 'transparent') ctx.fill();
    if (obj.stroke && obj.stroke !== 'transparent' && obj.strokeWidth > 0) ctx.stroke();
  }

  _renderDiamond(ctx, obj) {
    const { x, y, width, height } = obj;
    const cx = x + width / 2;
    const cy = y + height / 2;
    ctx.beginPath();
    ctx.moveTo(cx, y);
    ctx.lineTo(x + width, cy);
    ctx.lineTo(cx, y + height);
    ctx.lineTo(x, cy);
    ctx.closePath();
    if (obj.fill && obj.fill !== 'transparent') ctx.fill();
    if (obj.stroke && obj.stroke !== 'transparent' && obj.strokeWidth > 0) ctx.stroke();
  }

  _renderLine(ctx, obj) {
    const x2 = obj.x2 ?? obj.x;
    const y2 = obj.y2 ?? obj.y;
    ctx.beginPath();
    ctx.moveTo(obj.x, obj.y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  _renderArrow(ctx, obj) {
    const x1 = obj.x;
    const y1 = obj.y;
    const x2 = obj.x2 ?? obj.x;
    const y2 = obj.y2 ?? obj.y;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Arrowhead calculations
    if (obj.arrowHeadEnd === 'triangle') {
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const headLen = Math.max(12, (obj.strokeWidth || 2) * 4);
      ctx.fillStyle = obj.stroke || '#3b82f6';
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(
        x2 - headLen * Math.cos(angle - Math.PI / 6),
        y2 - headLen * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        x2 - headLen * Math.cos(angle + Math.PI / 6),
        y2 - headLen * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
    }
  }

  _renderConnector(ctx, obj) {
    // Resolve start/end positions based on bound objects if bound
    let startPt = { x: obj.x, y: obj.y };
    let endPt = { x: obj.x2 ?? obj.x + 100, y: obj.y2 ?? obj.y + 100 };

    if (obj.startBinding) {
      const target = appState.getObjectById(obj.startBinding.elementId);
      if (target) {
        const anchors = getShapeAnchors(target);
        const match = anchors.find(a => a.id === obj.startBinding.anchor);
        if (match) startPt = { x: match.x, y: match.y };
      }
    }

    if (obj.endBinding) {
      const target = appState.getObjectById(obj.endBinding.elementId);
      if (target) {
        const anchors = getShapeAnchors(target);
        const match = anchors.find(a => a.id === obj.endBinding.anchor);
        if (match) endPt = { x: match.x, y: match.y };
      }
    }

    const dx = endPt.x - startPt.x;
    const dy = endPt.y - startPt.y;

    ctx.beginPath();
    ctx.moveTo(startPt.x, startPt.y);

    if (obj.routing === 'curved') {
      const cp1x = startPt.x + dx * 0.5;
      const cp1y = startPt.y;
      const cp2x = startPt.x + dx * 0.5;
      const cp2y = endPt.y;
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endPt.x, endPt.y);
    } else if (obj.routing === 'stepped') {
      const midX = startPt.x + dx / 2;
      ctx.lineTo(midX, startPt.y);
      ctx.lineTo(midX, endPt.y);
      ctx.lineTo(endPt.x, endPt.y);
    } else {
      ctx.lineTo(endPt.x, endPt.y);
    }
    ctx.stroke();

    // Arrowhead on connector end
    if (obj.arrowHeadEnd === 'triangle') {
      const angle = Math.atan2(endPt.y - (obj.routing === 'curved' ? endPt.y : startPt.y), endPt.x - (startPt.x + dx * 0.5));
      const headLen = Math.max(10, (obj.strokeWidth || 2) * 3.5);
      ctx.fillStyle = obj.stroke || '#6b7280';
      ctx.beginPath();
      ctx.moveTo(endPt.x, endPt.y);
      ctx.lineTo(
        endPt.x - headLen * Math.cos(angle - Math.PI / 6),
        endPt.y - headLen * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        endPt.x - headLen * Math.cos(angle + Math.PI / 6),
        endPt.y - headLen * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
    }
  }

  _renderPencil(ctx, obj) {
    if (!obj.points || obj.points.length < 2) return;
    ctx.beginPath();
    catmullRomSpline(ctx, obj.points, 0.4);
    ctx.stroke();
  }

  _renderHighlighter(ctx, obj) {
    if (!obj.points || obj.points.length < 2) return;
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = obj.opacity ?? 0.4;
    ctx.lineWidth = obj.strokeWidth || 16;
    ctx.lineCap = 'square';
    ctx.beginPath();
    catmullRomSpline(ctx, obj.points, 0.4);
    ctx.stroke();
    ctx.restore();
  }

  _renderText(ctx, obj) {
    const { x, y, width, height, text = '', fontSize = 18, fontFamily, fontWeight = 'normal', fontStyle = 'normal', textAlign = 'left', color = '#f3f4f6' } = obj;
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = textAlign;
    ctx.textBaseline = 'top';

    const lines = text.split('\n');
    const lineHeight = fontSize * (obj.lineHeight || 1.35);

    let startX = x;
    if (textAlign === 'center') startX = x + width / 2;
    else if (textAlign === 'right') startX = x + width;

    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], startX, y + i * lineHeight);
    }
  }

  _renderSticky(ctx, obj) {
    const { x, y, width, height, fill = '#fef08a', text = '', color = '#713f12', fontSize = 15, fontFamily, textAlign = 'left' } = obj;

    // Drop Shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, width, height);
    ctx.restore();

    // Subtle border
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);

    // Text inside sticky note
    ctx.font = `500 ${fontSize}px ${fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'}`;
    ctx.fillStyle = color;
    ctx.textAlign = textAlign;
    ctx.textBaseline = 'top';

    const padding = 14;
    const availableWidth = width - padding * 2;
    let startX = x + padding;
    if (textAlign === 'center') startX = x + width / 2;
    else if (textAlign === 'right') startX = x + width - padding;

    // Auto-wrap text within sticky note width
    const words = text.split(' ');
    let line = '';
    let currY = y + padding;
    const lineHeight = fontSize * 1.35;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (words[n].includes('\n')) {
        const parts = words[n].split('\n');
        line += parts[0];
        ctx.fillText(line, startX, currY);
        currY += lineHeight;
        line = parts[1] + ' ';
        continue;
      }

      if (testWidth > availableWidth && n > 0) {
        ctx.fillText(line, startX, currY);
        line = words[n] + ' ';
        currY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, startX, currY);
  }

  _renderImage(ctx, obj) {
    const { x, y, width, height, src } = obj;
    if (!src) return;

    let img = this.imageCache.get(src);
    if (!img) {
      img = new Image();
      img.src = src;
      img.onload = () => this.requestRender();
      this.imageCache.set(src, img);
    }

    if (img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, x, y, width, height);
    } else {
      // Placeholder while image is decoding
      ctx.fillStyle = 'rgba(100, 100, 100, 0.2)';
      ctx.fillRect(x, y, width, height);
      ctx.strokeStyle = '#6b7280';
      ctx.strokeRect(x, y, width, height);
    }
  }

  /**
   * Render Interactive Overlays (Selection, Handles, Smart Guides, Anchors)
   */
  renderOverlays(ctx, panX, panY, zoom) {
    const selectedObjects = appState.getSelectedObjects();
    const isDark = appState.settings.theme === 'dark';

    // 1. Render Smart Alignment Guides
    if (appState.activeGuides && appState.activeGuides.length > 0) {
      ctx.save();
      ctx.strokeStyle = isDark ? '#f43f5e' : '#e11d48';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);

      for (const guide of appState.activeGuides) {
        ctx.beginPath();
        if (guide.type === 'vertical') {
          const screenX = guide.x * zoom + panX;
          const screenY1 = guide.y1 * zoom + panY;
          const screenY2 = guide.y2 * zoom + panY;
          ctx.moveTo(screenX, screenY1);
          ctx.lineTo(screenX, screenY2);
        } else if (guide.type === 'horizontal') {
          const screenY = guide.y * zoom + panY;
          const screenX1 = guide.x1 * zoom + panX;
          const screenX2 = guide.x2 * zoom + panX;
          ctx.moveTo(screenX1, screenY);
          ctx.lineTo(screenX2, screenY);
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    // 2. Render Selection Bounding Box & Handles
    if (selectedObjects.length > 0) {
      ctx.save();

      // If single selection, use object bounds & rotation
      if (selectedObjects.length === 1) {
        const obj = selectedObjects[0];
        const b = getObjectBounds(obj);
        const isLocked = obj.locked;

        const screenB = {
          x: b.x * zoom + panX,
          y: b.y * zoom + panY,
          width: b.width * zoom,
          height: b.height * zoom
        };

        const centerScreen = {
          x: screenB.x + screenB.width / 2,
          y: screenB.y + screenB.height / 2
        };

        ctx.translate(centerScreen.x, centerScreen.y);
        if (obj.rotation) {
          ctx.rotate(obj.rotation * DEG_TO_RAD);
        }
        ctx.translate(-centerScreen.x, -centerScreen.y);

        // Bounding Box
        ctx.strokeStyle = isLocked ? '#6b7280' : '#3b82f6';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(screenB.x, screenB.y, screenB.width, screenB.height);

        // Selection Handles (if not locked)
        if (!isLocked) {
          if (['line', 'arrow', 'connector'].includes(obj.type)) {
            const p1 = { x: obj.x * zoom + panX, y: obj.y * zoom + panY, id: 'start' };
            const p2 = { x: (obj.x2 ?? obj.x) * zoom + panX, y: (obj.y2 ?? obj.y) * zoom + panY, id: 'end' };
            this._drawEndpointHandles(ctx, [p1, p2], isDark);
          } else {
            const handles = getSelectionHandles(screenB, 0, 8);
            this._drawHandles(ctx, handles, isDark);
          }
        }

      } else {
        // Multi-selection: enclosing group bounds
        const totalBounds = appState.getSelectedBounds();
        if (totalBounds) {
          const screenB = {
            x: totalBounds.x * zoom + panX,
            y: totalBounds.y * zoom + panY,
            width: totalBounds.width * zoom,
            height: totalBounds.height * zoom
          };

          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 3]);
          ctx.strokeRect(screenB.x, screenB.y, screenB.width, screenB.height);
          ctx.setLineDash([]);

          const handles = getSelectionHandles(screenB, 0, 8);
          this._drawHandles(ctx, handles, isDark);
        }
      }

      ctx.restore();
    }

    // 3. Render Connector Anchors when connector tool is active or hovering
    if (appState.activeTool === 'connector' || this.hoveredAnchor) {
      ctx.save();
      const objects = appState.getObjects();
      for (const obj of objects) {
        if (obj.visible === false || ['pencil', 'highlighter'].includes(obj.type)) continue;
        const anchors = getShapeAnchors(obj);
        for (const anchor of anchors) {
          const screenX = anchor.x * zoom + panX;
          const screenY = anchor.y * zoom + panY;
          const isHovered = this.hoveredAnchor &&
            Math.hypot(this.hoveredAnchor.x - anchor.x, this.hoveredAnchor.y - anchor.y) < 5;

          ctx.fillStyle = isHovered ? '#3b82f6' : (isDark ? '#1e293b' : '#ffffff');
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(screenX, screenY, isHovered ? 6 : 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    // 4. Render Drag Selection Marquee
    if (this.selectionMarquee) {
      const { x, y, width, height } = this.selectionMarquee;
      const screenX = x * zoom + panX;
      const screenY = y * zoom + panY;
      const screenW = width * zoom;
      const screenH = height * zoom;

      ctx.save();
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1;
      ctx.fillRect(screenX, screenY, screenW, screenH);
      ctx.strokeRect(screenX, screenY, screenW, screenH);
      ctx.restore();
    }

    // 5. Render Eraser Trail Circle
    if (this.eraserTrail) {
      ctx.save();
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(this.eraserTrail.x, this.eraserTrail.y, this.eraserTrail.radius || 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }

  _drawHandles(ctx, handles, isDark) {
    const handleSize = 8;
    const half = handleSize / 2;

    for (const h of handles) {
      if (h.id === 'rot') {
        // Draw rotation stem line & round handle
        const nHandle = handles.find(item => item.id === 'n');
        if (nHandle) {
          ctx.beginPath();
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 1.5;
          ctx.moveTo(nHandle.x, nHandle.y);
          ctx.lineTo(h.x, h.y);
          ctx.stroke();
        }
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(h.x, h.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else {
        // Square Resize Handle
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1.5;
        ctx.fillRect(h.x - half, h.y - half, handleSize, handleSize);
        ctx.strokeRect(h.x - half, h.y - half, handleSize, handleSize);
      }
    }
  }

  _drawEndpointHandles(ctx, endpoints, isDark) {
    for (const ep of endpoints) {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ep.x, ep.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  /**
   * Render Canvas to Offscreen for Image Export (PNG / SVG)
   */
  renderToExportCanvas(options = {}) {
    const { scale = 2, bg = 'canvas', scope = 'all' } = options;
    const isDark = appState.settings.theme === 'dark';

    let targetObjects = appState.getObjects().filter(o => o.visible !== false);
    if (scope === 'selection') {
      const selected = appState.getSelectedObjects().filter(o => o.visible !== false);
      if (selected.length > 0) targetObjects = selected;
    }

    if (targetObjects.length === 0) return null;

    const bounds = unionBounds(targetObjects.map(o => getObjectBounds(o)));
    const padding = 40;
    const exportW = Math.max(100, Math.ceil(bounds.width + padding * 2));
    const exportH = Math.max(100, Math.ceil(bounds.height + padding * 2));

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = exportW * scale;
    exportCanvas.height = exportH * scale;
    const expCtx = exportCanvas.getContext('2d');

    expCtx.scale(scale, scale);

    // Fill background
    if (bg === 'canvas') {
      expCtx.fillStyle = isDark ? '#16171b' : '#ffffff';
      expCtx.fillRect(0, 0, exportW, exportH);
    } else if (bg === 'white') {
      expCtx.fillStyle = '#ffffff';
      expCtx.fillRect(0, 0, exportW, exportH);
    }
    // if 'transparent', leave blank

    expCtx.save();
    expCtx.translate(-bounds.x + padding, -bounds.y + padding);

    for (const obj of targetObjects) {
      this.renderObject(expCtx, obj);
    }

    expCtx.restore();
    return exportCanvas;
  }
}

};

modules["./state/document-model.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — Document Model & Object Schema
   Factory Functions, Types & Serialization
   ========================================================================== */

/**
 * Generate a unique ID (RFC4122 v4 compatible)
 */
exports.generateId = generateId;
function generateId(prefix = 'obj') {
  const rand = Math.random().toString(36).substring(2, 9);
  const time = Date.now().toString(36).slice(-4);
  return `${prefix}_${time}_${rand}`;
}

/**
 * Default common attributes for any canvas object
 */
const DEFAULT_OBJECT_PROPS = exports.DEFAULT_OBJECT_PROPS = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  rotation: 0,
  opacity: 1,
  stroke: '#3b82f6',
  strokeWidth: 2,
  strokeStyle: 'solid', // 'solid' | 'dashed' | 'dotted'
  fill: 'transparent',
  locked: false,
  visible: true,
  zIndex: 0,
  groupId: null,
  metadata: {}
};

/**
 * Factory function to create a new canvas object with type-specific defaults
 */
exports.createCanvasObject = createCanvasObject;
function createCanvasObject(type, props = {}) {
  const base = {
    id: generateId(type.substring(0, 4)),
    type,
    ...DEFAULT_OBJECT_PROPS,
    ...props
  };

  switch (type) {
    case 'rectangle':
      return {
        ...base,
        fill: props.fill || 'transparent',
        stroke: props.stroke || '#3b82f6',
        strokeWidth: props.strokeWidth ?? 2,
        cornerRadius: 0
      };

    case 'rounded-rectangle':
      return {
        ...base,
        fill: props.fill || 'transparent',
        stroke: props.stroke || '#3b82f6',
        strokeWidth: props.strokeWidth ?? 2,
        cornerRadius: 12
      };

    case 'ellipse':
      return {
        ...base,
        fill: props.fill || 'transparent',
        stroke: props.stroke || '#3b82f6',
        strokeWidth: props.strokeWidth ?? 2
      };

    case 'diamond':
      return {
        ...base,
        fill: props.fill || 'transparent',
        stroke: props.stroke || '#3b82f6',
        strokeWidth: props.strokeWidth ?? 2
      };

    case 'line':
      return {
        ...base,
        x2: props.x2 ?? base.x + 120,
        y2: props.y2 ?? base.y,
        stroke: props.stroke || '#3b82f6',
        strokeWidth: props.strokeWidth ?? 2,
        arrowHeadStart: 'none',
        arrowHeadEnd: 'none'
      };

    case 'arrow':
      return {
        ...base,
        x2: props.x2 ?? base.x + 120,
        y2: props.y2 ?? base.y,
        stroke: props.stroke || '#3b82f6',
        strokeWidth: props.strokeWidth ?? 2,
        arrowHeadStart: 'none',
        arrowHeadEnd: 'triangle' // 'triangle' | 'dot' | 'none'
      };

    case 'connector':
      return {
        ...base,
        x2: props.x2 ?? base.x + 100,
        y2: props.y2 ?? base.y + 100,
        stroke: props.stroke || '#6b7280',
        strokeWidth: props.strokeWidth ?? 2,
        strokeStyle: 'solid',
        arrowHeadStart: 'none',
        arrowHeadEnd: 'triangle',
        routing: 'curved', // 'curved' | 'straight' | 'stepped'
        startBinding: props.startBinding || null, // { elementId, anchor: 'top'|'right'|'bottom'|'left'|'center' }
        endBinding: props.endBinding || null
      };

    case 'pencil':
      return {
        ...base,
        stroke: props.stroke || '#3b82f6',
        strokeWidth: props.strokeWidth ?? 3,
        points: props.points || [{ x: base.x, y: base.y }],
        fill: 'transparent'
      };

    case 'highlighter':
      return {
        ...base,
        stroke: props.stroke || '#fef08a',
        strokeWidth: props.strokeWidth ?? 16,
        opacity: props.opacity ?? 0.45,
        points: props.points || [{ x: base.x, y: base.y }],
        fill: 'transparent'
      };

    case 'text':
      return {
        ...base,
        text: props.text ?? 'Double-click to edit',
        fontFamily: props.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: props.fontSize || 18,
        fontWeight: props.fontWeight || 'normal', // 'normal' | 'bold'
        fontStyle: props.fontStyle || 'normal',   // 'normal' | 'italic'
        textAlign: props.textAlign || 'left',     // 'left' | 'center' | 'right'
        lineHeight: props.lineHeight || 1.35,
        color: props.color || '#f3f4f6',
        stroke: 'transparent',
        fill: 'transparent',
        width: props.width || 180,
        height: props.height || 36
      };

    case 'sticky':
      return {
        ...base,
        text: props.text ?? 'Note...',
        color: props.color || '#713f12',
        fill: props.fill || '#fef08a',
        stroke: 'rgba(0,0,0,0.1)',
        strokeWidth: 1,
        fontFamily: props.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: props.fontSize || 15,
        textAlign: props.textAlign || 'left',
        width: props.width || 160,
        height: props.height || 160
      };

    case 'image':
      return {
        ...base,
        src: props.src || '',
        aspectRatio: props.aspectRatio || 1,
        stroke: 'transparent',
        fill: 'transparent'
      };

    case 'group':
      return {
        ...base,
        childIds: props.childIds || [],
        stroke: 'transparent',
        fill: 'transparent'
      };

    default:
      return base;
  }
}

/**
 * Deep clone a canvas object
 */
exports.cloneObject = cloneObject;
function cloneObject(obj) {
  if (!obj) return null;
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Validate and sanitize an imported board document
 */
exports.validateBoardDocument = validateBoardDocument;
function validateBoardDocument(doc) {
  if (!doc || typeof doc !== 'object') {
    throw new Error('Invalid board format: document is not an object.');
  }

  const sanitized = {
    version: 1,
    app: 'CanvasFlow',
    id: doc.id || generateId('board'),
    title: doc.title || 'Untitled Board',
    createdAt: doc.createdAt || Date.now(),
    updatedAt: Date.now(),
    viewport: {
      panX: Number(doc.viewport?.panX) || 0,
      panY: Number(doc.viewport?.panY) || 0,
      zoom: Number(doc.viewport?.zoom) || 1
    },
    settings: {
      gridVisible: doc.settings?.gridVisible ?? true,
      gridType: doc.settings?.gridType || 'dots',
      snapEnabled: doc.settings?.snapEnabled ?? true,
      rulersVisible: doc.settings?.rulersVisible ?? false,
      theme: doc.settings?.theme || 'dark'
    },
    objects: Array.isArray(doc.objects) ? doc.objects.filter(o => o && o.id && o.type) : []
  };

  return sanitized;
}

};

modules["./state/event-bus.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — Event Bus
   Lightweight Publisher / Subscriber Event Dispatcher
   ========================================================================== */

class EventBus {
  constructor() {
    this.listeners = new Map();
  }

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
      for (const callback of this.listeners.get(event)) {
        try {
          callback(data);
        } catch (err) {
          console.error(`Error in event listener for "${event}":`, err);
        }
      }
    }
  }
}

const eventBus = exports.eventBus = new EventBus();

};

modules["./state/history.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — History & Undo/Redo Engine
   Immutable Snapshot Management & Command Transactions
   ========================================================================== */

/* import { eventBus } from './event-bus.js'; */
const eventBus = __require("./state/event-bus.js").eventBus;

exports.HistoryManager = class HistoryManager {
  constructor(options = {}) {
    this.maxDepth = options.maxDepth || 60;
    this.undoStack = [];
    this.redoStack = [];
    this.isApplying = false;
    this.inTransaction = false;
    this.transactionInitialState = null;
  }

  /**
   * Push a new snapshot of objects onto the undo stack
   */
  push(objectsList, description = 'Edit') {
    if (this.isApplying || this.inTransaction) return;

    const snapshot = JSON.stringify(objectsList);

    // Don't push identical consecutive states
    if (this.undoStack.length > 0 && this.undoStack[this.undoStack.length - 1].data === snapshot) {
      return;
    }

    this.undoStack.push({
      data: snapshot,
      description,
      timestamp: Date.now()
    });

    if (this.undoStack.length > this.maxDepth) {
      this.undoStack.shift();
    }

    // Clear redo stack on new action
    this.redoStack = [];

    this._notify();
  }

  /**
   * Begin a multi-step user transaction (e.g. continuous dragging, resizing, or continuous drawing)
   */
  beginTransaction(currentObjectsList) {
    if (this.inTransaction) return;
    this.inTransaction = true;
    this.transactionInitialState = JSON.stringify(currentObjectsList);
  }

  /**
   * Commit a transaction when the user finishes (pointer up)
   */
  commitTransaction(finalObjectsList, description = 'Modify') {
    if (!this.inTransaction) return;
    this.inTransaction = false;

    const finalState = JSON.stringify(finalObjectsList);
    if (this.transactionInitialState && this.transactionInitialState !== finalState) {
      this.undoStack.push({
        data: this.transactionInitialState,
        description,
        timestamp: Date.now()
      });

      if (this.undoStack.length > this.maxDepth) {
        this.undoStack.shift();
      }

      this.redoStack = [];
      this._notify();
    }

    this.transactionInitialState = null;
  }

  /**
   * Cancel an in-progress transaction
   */
  cancelTransaction() {
    this.inTransaction = false;
    this.transactionInitialState = null;
  }

  /**
   * Undo to previous state
   */
  undo(currentObjectsList) {
    if (this.undoStack.length === 0) return null;

    this.isApplying = true;
    const currentState = JSON.stringify(currentObjectsList);
    const previousSnapshot = this.undoStack.pop();

    this.redoStack.push({
      data: currentState,
      description: previousSnapshot.description,
      timestamp: Date.now()
    });

    this._notify();
    this.isApplying = false;

    return JSON.parse(previousSnapshot.data);
  }

  /**
   * Redo to forward state
   */
  redo(currentObjectsList) {
    if (this.redoStack.length === 0) return null;

    this.isApplying = true;
    const currentState = JSON.stringify(currentObjectsList);
    const nextSnapshot = this.redoStack.pop();

    this.undoStack.push({
      data: currentState,
      description: nextSnapshot.description,
      timestamp: Date.now()
    });

    this._notify();
    this.isApplying = false;

    return JSON.parse(nextSnapshot.data);
  }

  canUndo() {
    return this.undoStack.length > 0;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
    this._notify();
  }

  _notify() {
    eventBus.emit('history:changed', {
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      undoCount: this.undoStack.length,
      redoCount: this.redoStack.length
    });
  }
}

};

modules["./state/state.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — Central Application State Store
   Reactive State, Selection, Viewport, Clipboard, History & Mutations
   ========================================================================== */

/* import { eventBus } from './event-bus.js'; */
const eventBus = __require("./state/event-bus.js").eventBus;
/* import { HistoryManager } from './history.js'; */
const HistoryManager = __require("./state/history.js").HistoryManager;
/* import { storage } from './storage.js'; */
const storage = __require("./state/storage.js").storage;
/* import { generateId, cloneObject, createCanvasObject } from './document-model.js'; */
const generateId = __require("./state/document-model.js").generateId;
const cloneObject = __require("./state/document-model.js").cloneObject;
const createCanvasObject = __require("./state/document-model.js").createCanvasObject;
/* import { getObjectBounds, unionBounds, clamp } from '../utils/math.js'; */
const getObjectBounds = __require("./utils/math.js").getObjectBounds;
const unionBounds = __require("./utils/math.js").unionBounds;
const clamp = __require("./utils/math.js").clamp;

class StateStore {
  constructor() {
    this.history = new HistoryManager();

    // Active Board State
    this.board = {
      id: generateId('board'),
      title: 'Untitled Board',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      objects: []
    };

    // Selection State
    this.selectedIds = new Set();

    // Active Tool
    this.activeTool = 'select'; // 'select', 'hand', 'rectangle', ...

    // Viewport Transformation State
    this.viewport = {
      panX: 0,
      panY: 0,
      zoom: 1.0
    };

    // User & View Settings
    this.settings = {
      theme: 'dark',
      gridVisible: true,
      gridType: 'dots', // 'dots' | 'lines' | 'none'
      snapEnabled: true,
      rulersVisible: false,
      minimapVisible: true,
      defaultStrokeColor: '#3b82f6',
      defaultFillColor: 'transparent',
      defaultStrokeWidth: 2
    };

    // Internal Clipboard
    this.clipboard = [];

    // Hovered object (for connectors/eraser/cursor)
    this.hoveredId = null;

    // Active snap guide lines for renderer
    this.activeGuides = [];
  }

  /**
   * Initialize state from preferences and load initial or last active board
   */
  async init() {
    const prefs = storage.getPreferences();
    if (prefs.theme) this.settings.theme = prefs.theme;
    if (prefs.gridVisible !== undefined) this.settings.gridVisible = prefs.gridVisible;
    if (prefs.gridType) this.settings.gridType = prefs.gridType;
    if (prefs.snapEnabled !== undefined) this.settings.snapEnabled = prefs.snapEnabled;
    if (prefs.rulersVisible !== undefined) this.settings.rulersVisible = prefs.rulersVisible;

    this.applyTheme(this.settings.theme);

    // Check last opened board
    if (prefs.lastBoardId) {
      try {
        const saved = await storage.loadBoard(prefs.lastBoardId);
        if (saved) {
          this.loadBoardDocument(saved, false);
          return;
        }
      } catch (e) {
        console.warn('Could not load last board:', e);
      }
    }
  }

  /**
   * Replace the entire active board document
   */
  loadBoardDocument(boardDoc, recordHistory = false) {
    this.board = {
      id: boardDoc.id || generateId('board'),
      title: boardDoc.title || 'Untitled Board',
      createdAt: boardDoc.createdAt || Date.now(),
      updatedAt: boardDoc.updatedAt || Date.now(),
      objects: boardDoc.objects || []
    };

    if (boardDoc.viewport) {
      this.viewport.panX = boardDoc.viewport.panX || 0;
      this.viewport.panY = boardDoc.viewport.panY || 0;
      this.viewport.zoom = boardDoc.viewport.zoom || 1.0;
    }

    if (boardDoc.settings) {
      this.settings = { ...this.settings, ...boardDoc.settings };
      this.applyTheme(this.settings.theme);
    }

    this.selectedIds.clear();
    this.history.clear();

    storage.savePreferences({ lastBoardId: this.board.id });
    eventBus.emit('board:loaded', this.board);
    eventBus.emit('selection:changed', this.getSelectedObjects());
    eventBus.emit('viewport:changed', this.viewport);
    eventBus.emit('state:changed');
  }

  /**
   * Apply Theme to DOM
   */
  applyTheme(theme) {
    this.settings.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = `theme-${theme} select-none ${this.settings.rulersVisible ? 'show-rulers' : ''}`;
    storage.savePreferences({ theme });
    eventBus.emit('settings:changed', this.settings);
  }

  // ------------------------------------------------------------------------
  // Object Query Helpers
  // ------------------------------------------------------------------------

  getObjects() {
    return this.board.objects;
  }

  getObjectById(id) {
    return this.board.objects.find(o => o.id === id) || null;
  }

  getSelectedObjects() {
    return this.board.objects.filter(o => this.selectedIds.has(o.id));
  }

  getSelectedBounds() {
    const selected = this.getSelectedObjects();
    if (selected.length === 0) return null;
    return unionBounds(selected.map(o => getObjectBounds(o)));
  }

  // ------------------------------------------------------------------------
  // Object Mutation API (with Auto-Save & History)
  // ------------------------------------------------------------------------

  addObject(obj, recordHistory = true) {
    this.board.objects.push(obj);
    if (recordHistory) {
      this.history.push(this.board.objects, `Add ${obj.type}`);
    }
    this._onModified();
    return obj;
  }

  addObjects(objs, recordHistory = true) {
    this.board.objects.push(...objs);
    if (recordHistory) {
      this.history.push(this.board.objects, `Add ${objs.length} objects`);
    }
    this._onModified();
  }

  updateObject(id, partialProps, recordHistory = true) {
    const obj = this.getObjectById(id);
    if (!obj) return;
    Object.assign(obj, partialProps);
    if (recordHistory) {
      this.history.push(this.board.objects, 'Update object');
    }
    this._onModified();
  }

  updateObjects(updatesMap, recordHistory = true) {
    // updatesMap: { [id]: partialProps }
    for (const [id, props] of Object.entries(updatesMap)) {
      const obj = this.getObjectById(id);
      if (obj) Object.assign(obj, props);
    }
    if (recordHistory) {
      this.history.push(this.board.objects, 'Update objects');
    }
    this._onModified();
  }

  removeObject(id, recordHistory = true) {
    const idx = this.board.objects.findIndex(o => o.id === id);
    if (idx !== -1) {
      this.board.objects.splice(idx, 1);
      this.selectedIds.delete(id);
      if (recordHistory) {
        this.history.push(this.board.objects, 'Delete object');
      }
      this._onModified();
      eventBus.emit('selection:changed', this.getSelectedObjects());
    }
  }

  removeObjects(ids, recordHistory = true) {
    const set = new Set(ids);
    this.board.objects = this.board.objects.filter(o => !set.has(o.id));
    for (const id of ids) {
      this.selectedIds.delete(id);
    }
    if (recordHistory) {
      this.history.push(this.board.objects, `Delete ${ids.length} objects`);
    }
    this._onModified();
    eventBus.emit('selection:changed', this.getSelectedObjects());
  }

  // ------------------------------------------------------------------------
  // Selection API
  // ------------------------------------------------------------------------

  setSelection(ids) {
    this.selectedIds.clear();
    const idArray = Array.isArray(ids) ? ids : [ids];
    for (const id of idArray) {
      if (this.getObjectById(id)) {
        this.selectedIds.add(id);
      }
    }
    eventBus.emit('selection:changed', this.getSelectedObjects());
    eventBus.emit('state:changed');
  }

  addToSelection(id) {
    if (this.getObjectById(id)) {
      this.selectedIds.add(id);
      eventBus.emit('selection:changed', this.getSelectedObjects());
      eventBus.emit('state:changed');
    }
  }

  removeFromSelection(id) {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
      eventBus.emit('selection:changed', this.getSelectedObjects());
      eventBus.emit('state:changed');
    }
  }

  toggleSelection(id) {
    if (this.selectedIds.has(id)) {
      this.removeFromSelection(id);
    } else {
      this.addToSelection(id);
    }
  }

  clearSelection() {
    if (this.selectedIds.size > 0) {
      this.selectedIds.clear();
      eventBus.emit('selection:changed', []);
      eventBus.emit('state:changed');
    }
  }

  selectAll() {
    const selectable = this.board.objects.filter(o => o.visible !== false && !o.locked);
    this.selectedIds = new Set(selectable.map(o => o.id));
    eventBus.emit('selection:changed', this.getSelectedObjects());
    eventBus.emit('state:changed');
  }

  // ------------------------------------------------------------------------
  // Tool & Viewport Management
  // ------------------------------------------------------------------------

  setActiveTool(toolName) {
    if (this.activeTool !== toolName) {
      this.activeTool = toolName;
      eventBus.emit('tool:changed', toolName);
    }
  }

  setViewport(panX, panY, zoom) {
    this.viewport.panX = panX;
    this.viewport.panY = panY;
    this.viewport.zoom = clamp(zoom, 0.05, 10.0);
    this.board.viewport = { ...this.viewport };
    eventBus.emit('viewport:changed', this.viewport);
    storage.scheduleAutoSave(this.board, 2000);
  }

  panBy(dx, dy) {
    this.setViewport(this.viewport.panX + dx, this.viewport.panY + dy, this.viewport.zoom);
  }

  zoomAt(screenX, screenY, zoomFactor) {
    const currentZoom = this.viewport.zoom;
    const newZoom = clamp(currentZoom * zoomFactor, 0.05, 10.0);
    if (newZoom === currentZoom) return;

    // Zoom centered on pointer coordinates
    const worldX = (screenX - this.viewport.panX) / currentZoom;
    const worldY = (screenY - this.viewport.panY) / currentZoom;

    const newPanX = screenX - worldX * newZoom;
    const newPanY = screenY - worldY * newZoom;

    this.setViewport(newPanX, newPanY, newZoom);
  }

  zoomToFit(viewportWidth, viewportHeight, padding = 80) {
    if (this.board.objects.length === 0) {
      this.setViewport(viewportWidth / 2, viewportHeight / 2, 1.0);
      return;
    }

    const bounds = unionBounds(this.board.objects.map(o => getObjectBounds(o)));
    if (bounds.width === 0 || bounds.height === 0) return;

    const availableW = viewportWidth - padding * 2;
    const availableH = viewportHeight - padding * 2;

    const scaleX = availableW / bounds.width;
    const scaleY = availableH / bounds.height;
    const zoom = clamp(Math.min(scaleX, scaleY, 1.5), 0.1, 3.0);

    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;

    const panX = viewportWidth / 2 - centerX * zoom;
    const panY = viewportHeight / 2 - centerY * zoom;

    this.setViewport(panX, panY, zoom);
  }

  zoomToSelection(viewportWidth, viewportHeight, padding = 80) {
    const bounds = this.getSelectedBounds();
    if (!bounds) {
      this.zoomToFit(viewportWidth, viewportHeight, padding);
      return;
    }

    const availableW = viewportWidth - padding * 2;
    const availableH = viewportHeight - padding * 2;

    const scaleX = availableW / bounds.width;
    const scaleY = availableH / bounds.height;
    const zoom = clamp(Math.min(scaleX, scaleY, 2.5), 0.2, 4.0);

    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;

    const panX = viewportWidth / 2 - centerX * zoom;
    const panY = viewportHeight / 2 - centerY * zoom;

    this.setViewport(panX, panY, zoom);
  }

  // ------------------------------------------------------------------------
  // Layer Reordering & Grouping
  // ------------------------------------------------------------------------

  bringToFront(ids = Array.from(this.selectedIds)) {
    if (ids.length === 0) return;
    const selectedSet = new Set(ids);
    const nonSelected = this.board.objects.filter(o => !selectedSet.has(o.id));
    const selected = this.board.objects.filter(o => selectedSet.has(o.id));
    this.board.objects = [...nonSelected, ...selected];
    this.history.push(this.board.objects, 'Bring to Front');
    this._onModified();
  }

  sendToBack(ids = Array.from(this.selectedIds)) {
    if (ids.length === 0) return;
    const selectedSet = new Set(ids);
    const nonSelected = this.board.objects.filter(o => !selectedSet.has(o.id));
    const selected = this.board.objects.filter(o => selectedSet.has(o.id));
    this.board.objects = [...selected, ...nonSelected];
    this.history.push(this.board.objects, 'Send to Back');
    this._onModified();
  }

  bringForward(ids = Array.from(this.selectedIds)) {
    if (ids.length === 0) return;
    const objs = [...this.board.objects];
    for (let i = objs.length - 2; i >= 0; i--) {
      if (ids.includes(objs[i].id) && !ids.includes(objs[i + 1].id)) {
        const temp = objs[i];
        objs[i] = objs[i + 1];
        objs[i + 1] = temp;
      }
    }
    this.board.objects = objs;
    this.history.push(this.board.objects, 'Bring Forward');
    this._onModified();
  }

  sendBackward(ids = Array.from(this.selectedIds)) {
    if (ids.length === 0) return;
    const objs = [...this.board.objects];
    for (let i = 1; i < objs.length; i++) {
      if (ids.includes(objs[i].id) && !ids.includes(objs[i - 1].id)) {
        const temp = objs[i];
        objs[i] = objs[i - 1];
        objs[i - 1] = temp;
      }
    }
    this.board.objects = objs;
    this.history.push(this.board.objects, 'Send Backward');
    this._onModified();
  }

  lockSelected() {
    const selected = this.getSelectedObjects();
    const shouldLock = selected.some(o => !o.locked);
    for (const obj of selected) {
      obj.locked = shouldLock;
    }
    this.history.push(this.board.objects, shouldLock ? 'Lock' : 'Unlock');
    this._onModified();
    eventBus.emit('selection:changed', this.getSelectedObjects());
  }

  groupSelected() {
    const selected = this.getSelectedObjects();
    if (selected.length < 2) return;

    const groupId = generateId('group');
    for (const obj of selected) {
      obj.groupId = groupId;
    }
    this.history.push(this.board.objects, 'Group');
    this._onModified();
    eventBus.emit('toast:show', { message: `Grouped ${selected.length} items`, type: 'info' });
  }

  ungroupSelected() {
    const selected = this.getSelectedObjects();
    let count = 0;
    for (const obj of selected) {
      if (obj.groupId) {
        obj.groupId = null;
        count++;
      }
    }
    if (count > 0) {
      this.history.push(this.board.objects, 'Ungroup');
      this._onModified();
      eventBus.emit('toast:show', { message: 'Ungrouped items', type: 'info' });
    }
  }

  // ------------------------------------------------------------------------
  // Clipboard Operations (Copy, Cut, Paste, Duplicate)
  // ------------------------------------------------------------------------

  copySelected() {
    const selected = this.getSelectedObjects();
    if (selected.length === 0) return false;
    this.clipboard = selected.map(o => cloneObject(o));
    eventBus.emit('toast:show', { message: `Copied ${selected.length} item(s)`, type: 'info' });
    return true;
  }

  cutSelected() {
    if (this.copySelected()) {
      this.deleteSelected();
    }
  }

  paste(offset = { x: 30, y: 30 }) {
    if (this.clipboard.length === 0) return [];

    const newObjects = [];
    const newIds = [];
    const idMap = new Map();

    for (const item of this.clipboard) {
      const cloned = cloneObject(item);
      const oldId = cloned.id;
      cloned.id = generateId(cloned.type.substring(0, 4));
      idMap.set(oldId, cloned.id);

      cloned.x += offset.x;
      cloned.y += offset.y;
      if (cloned.x2 !== undefined) cloned.x2 += offset.x;
      if (cloned.y2 !== undefined) cloned.y2 += offset.y;

      if (cloned.points) {
        cloned.points = cloned.points.map(p => ({ x: p.x + offset.x, y: p.y + offset.y }));
      }

      newObjects.push(cloned);
      newIds.push(cloned.id);
    }

    // Remap connector bindings
    for (const obj of newObjects) {
      if (obj.startBinding && idMap.has(obj.startBinding.elementId)) {
        obj.startBinding.elementId = idMap.get(obj.startBinding.elementId);
      }
      if (obj.endBinding && idMap.has(obj.endBinding.elementId)) {
        obj.endBinding.elementId = idMap.get(obj.endBinding.elementId);
      }
    }

    this.addObjects(newObjects, true);
    this.setSelection(newIds);
    return newObjects;
  }

  duplicateSelected() {
    if (this.copySelected()) {
      return this.paste({ x: 24, y: 24 });
    }
    return [];
  }

  deleteSelected() {
    const selected = this.getSelectedObjects().filter(o => !o.locked);
    if (selected.length === 0) return;
    this.removeObjects(selected.map(o => o.id), true);
  }

  // ------------------------------------------------------------------------
  // Align & Distribute
  // ------------------------------------------------------------------------

  alignSelected(direction) {
    const selected = this.getSelectedObjects().filter(o => !o.locked);
    if (selected.length < 2) return;

    const boundsList = selected.map(o => getObjectBounds(o));
    const totalBounds = unionBounds(boundsList);

    const updates = {};

    selected.forEach((obj, i) => {
      const b = boundsList[i];
      let newX = obj.x;
      let newY = obj.y;

      switch (direction) {
        case 'left':
          newX = totalBounds.x + (obj.x - b.x);
          break;
        case 'center':
          newX = (totalBounds.x + totalBounds.width / 2) - b.width / 2 + (obj.x - b.x);
          break;
        case 'right':
          newX = (totalBounds.x + totalBounds.width) - b.width + (obj.x - b.x);
          break;
        case 'top':
          newY = totalBounds.y + (obj.y - b.y);
          break;
        case 'middle':
          newY = (totalBounds.y + totalBounds.height / 2) - b.height / 2 + (obj.y - b.y);
          break;
        case 'bottom':
          newY = (totalBounds.y + totalBounds.height) - b.height + (obj.y - b.y);
          break;
      }

      const dx = newX - obj.x;
      const dy = newY - obj.y;

      const objUpdate = { x: newX, y: newY };
      if (obj.x2 !== undefined) objUpdate.x2 = obj.x2 + dx;
      if (obj.y2 !== undefined) objUpdate.y2 = obj.y2 + dy;
      if (obj.points) {
        objUpdate.points = obj.points.map(p => ({ x: p.x + dx, y: p.y + dy }));
      }

      updates[obj.id] = objUpdate;
    });

    this.updateObjects(updates, true);
  }

  distributeSelected(axis) {
    const selected = this.getSelectedObjects().filter(o => !o.locked);
    if (selected.length < 3) return;

    const boundsList = selected.map((o, i) => ({ obj: o, bounds: getObjectBounds(o), index: i }));

    if (axis === 'horizontal') {
      boundsList.sort((a, b) => a.bounds.x - b.bounds.x);
      const minX = boundsList[0].bounds.x;
      const maxX = boundsList[boundsList.length - 1].bounds.x + boundsList[boundsList.length - 1].bounds.width;
      const totalWidthOfObjects = boundsList.reduce((acc, curr) => acc + curr.bounds.width, 0);
      const totalGap = maxX - minX - totalWidthOfObjects;
      const gap = totalGap / (boundsList.length - 1);

      let currentX = minX;
      const updates = {};
      boundsList.forEach(item => {
        const dx = currentX - item.bounds.x;
        const objUpdate = { x: item.obj.x + dx };
        if (item.obj.x2 !== undefined) objUpdate.x2 = item.obj.x2 + dx;
        if (item.obj.points) {
          objUpdate.points = item.obj.points.map(p => ({ x: p.x + dx, y: p.y }));
        }
        updates[item.obj.id] = objUpdate;
        currentX += item.bounds.width + gap;
      });
      this.updateObjects(updates, true);
    } else {
      boundsList.sort((a, b) => a.bounds.y - b.bounds.y);
      const minY = boundsList[0].bounds.y;
      const maxY = boundsList[boundsList.length - 1].bounds.y + boundsList[boundsList.length - 1].bounds.height;
      const totalHeightOfObjects = boundsList.reduce((acc, curr) => acc + curr.bounds.height, 0);
      const totalGap = maxY - minY - totalHeightOfObjects;
      const gap = totalGap / (boundsList.length - 1);

      let currentY = minY;
      const updates = {};
      boundsList.forEach(item => {
        const dy = currentY - item.bounds.y;
        const objUpdate = { y: item.obj.y + dy };
        if (item.obj.y2 !== undefined) objUpdate.y2 = item.obj.y2 + dy;
        if (item.obj.points) {
          objUpdate.points = item.obj.points.map(p => ({ x: p.x, y: p.y + dy }));
        }
        updates[item.obj.id] = objUpdate;
        currentY += item.bounds.height + gap;
      });
      this.updateObjects(updates, true);
    }
  }

  // ------------------------------------------------------------------------
  // Undo / Redo
  // ------------------------------------------------------------------------

  undo() {
    const prevState = this.history.undo(this.board.objects);
    if (prevState) {
      this.board.objects = prevState;
      this._onModified(false);
    }
  }

  redo() {
    const nextState = this.history.redo(this.board.objects);
    if (nextState) {
      this.board.objects = nextState;
      this._onModified(false);
    }
  }

  // ------------------------------------------------------------------------
  // Internal Notification & AutoSave
  // ------------------------------------------------------------------------

  _onModified(autoSave = true) {
    this.board.updatedAt = Date.now();
    eventBus.emit('state:changed');
    if (autoSave) {
      storage.scheduleAutoSave(this.board);
    }
  }
}

const appState = exports.appState = new StateStore();

};

modules["./state/storage.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — Storage & Persistence
   IndexedDB Engine, LocalStorage Preferences, and JSON File Import/Export
   ========================================================================== */

/* import { validateBoardDocument, generateId } from './document-model.js'; */
const validateBoardDocument = __require("./state/document-model.js").validateBoardDocument;
const generateId = __require("./state/document-model.js").generateId;
/* import { eventBus } from './event-bus.js'; */
const eventBus = __require("./state/event-bus.js").eventBus;

const DB_NAME = 'canvasflow_db';
const DB_VERSION = 1;
const STORE_BOARDS = 'boards';
const PREFS_KEY = 'canvasflow_preferences';

class StorageManager {
  constructor() {
    this.db = null;
    this.dbReady = this._initIndexedDB();
    this.autoSaveTimer = null;
  }

  /**
   * Initialize IndexedDB
   */
  async _initIndexedDB() {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        resolve(null);
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_BOARDS)) {
          const store = db.createObjectStore(STORE_BOARDS, { keyPath: 'id' });
          store.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('IndexedDB open error:', event.target.error);
        resolve(null);
      };
    });
  }

  /**
   * Save a board document into IndexedDB
   */
  async saveBoard(boardDoc) {
    await this.dbReady;
    boardDoc.updatedAt = Date.now();

    if (!this.db) {
      try {
        localStorage.setItem(`canvasflow_board_${boardDoc.id}`, JSON.stringify(boardDoc));
      } catch (e) {
        console.warn('Storage quota exceeded in fallback:', e);
      }
      return boardDoc;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([STORE_BOARDS], 'readwrite');
      const store = tx.objectStore(STORE_BOARDS);
      const req = store.put(boardDoc);

      req.onsuccess = () => {
        eventBus.emit('storage:saved', { id: boardDoc.id, time: boardDoc.updatedAt });
        resolve(boardDoc);
      };

      req.onerror = (e) => {
        console.error('Failed to save board:', e.target.error);
        reject(e.target.error);
      };
    });
  }

  /**
   * Load a board document by ID
   */
  async loadBoard(id) {
    await this.dbReady;

    if (!this.db) {
      const data = localStorage.getItem(`canvasflow_board_${id}`);
      return data ? JSON.parse(data) : null;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([STORE_BOARDS], 'readonly');
      const store = tx.objectStore(STORE_BOARDS);
      const req = store.get(id);

      req.onsuccess = () => {
        resolve(req.result || null);
      };

      req.onerror = (e) => {
        console.error('Failed to load board:', e.target.error);
        reject(e.target.error);
      };
    });
  }

  /**
   * List all stored boards metadata
   */
  async listBoards() {
    await this.dbReady;

    if (!this.db) {
      const boards = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('canvasflow_board_')) {
          try {
            const b = JSON.parse(localStorage.getItem(key));
            boards.push({ id: b.id, title: b.title, updatedAt: b.updatedAt, objectCount: b.objects?.length || 0 });
          } catch (err) {}
        }
      }
      return boards.sort((a, b) => b.updatedAt - a.updatedAt);
    }

    return new Promise((resolve) => {
      const tx = this.db.transaction([STORE_BOARDS], 'readonly');
      const store = tx.objectStore(STORE_BOARDS);
      const req = store.getAll();

      req.onsuccess = () => {
        const list = (req.result || []).map(b => ({
          id: b.id,
          title: b.title,
          updatedAt: b.updatedAt || 0,
          objectCount: b.objects?.length || 0
        })).sort((a, b) => b.updatedAt - a.updatedAt);
        resolve(list);
      };

      req.onerror = () => resolve([]);
    });
  }

  /**
   * Delete a board by ID
   */
  async deleteBoard(id) {
    await this.dbReady;

    if (!this.db) {
      localStorage.removeItem(`canvasflow_board_${id}`);
      return true;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([STORE_BOARDS], 'readwrite');
      const store = tx.objectStore(STORE_BOARDS);
      const req = store.delete(id);

      req.onsuccess = () => resolve(true);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  /**
   * Duplicate a board
   */
  async duplicateBoard(id) {
    const original = await this.loadBoard(id);
    if (!original) throw new Error('Board not found');

    const duplicate = JSON.parse(JSON.stringify(original));
    duplicate.id = generateId('board');
    duplicate.title = `${original.title} (Copy)`;
    duplicate.createdAt = Date.now();
    duplicate.updatedAt = Date.now();

    await this.saveBoard(duplicate);
    return duplicate;
  }

  /**
   * Debounced Auto-save
   */
  scheduleAutoSave(boardDoc, delay = 800) {
    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer);
    }

    eventBus.emit('storage:saving');

    this.autoSaveTimer = setTimeout(async () => {
      try {
        await this.saveBoard(boardDoc);
      } catch (err) {
        console.error('Auto-save error:', err);
      }
    }, delay);
  }

  /**
   * Preferences (localStorage)
   */
  getPreferences() {
    try {
      const prefs = localStorage.getItem(PREFS_KEY);
      return prefs ? JSON.parse(prefs) : {};
    } catch (e) {
      return {};
    }
  }

  savePreferences(prefs) {
    try {
      const existing = this.getPreferences();
      const merged = { ...existing, ...prefs };
      localStorage.setItem(PREFS_KEY, JSON.stringify(merged));
    } catch (e) {
      console.warn('Could not save preferences to localStorage:', e);
    }
  }

  /**
   * Export board as JSON file download
   */
  exportToJSONFile(boardDoc) {
    const jsonStr = JSON.stringify(boardDoc, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(boardDoc.title || 'board').toLowerCase().replace(/\s+/g, '-')}.canvasflow.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Parse JSON string and import board
   */
  importFromJSONString(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      const sanitized = validateBoardDocument(parsed);
      return sanitized;
    } catch (err) {
      throw new Error(`Failed to parse JSON board file: ${err.message}`);
    }
  }
}

const storage = exports.storage = new StorageManager();

};

modules["./tools/base-tool.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — Base Tool Class
   ========================================================================== */

exports.BaseTool = class BaseTool {
  constructor(name, app) {
    this.name = name;
    this.app = app;
    this.isActive = false;
  }

  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }

  onPointerDown(e, worldPt) {}
  onPointerMove(e, worldPt) {}
  onPointerUp(e, worldPt) {}
  onDoubleClick(e, worldPt) {}
  onKeyDown(e) {}
  onKeyUp(e) {}
}

};

modules["./tools/connector-tool.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — Smart Connector Tool
   Connects shapes dynamically via magnetic anchor points
   ========================================================================== */

/* import { BaseTool } from './base-tool.js'; */
const BaseTool = __require("./tools/base-tool.js").BaseTool;
/* import { appState } from '../state/state.js'; */
const appState = __require("./state/state.js").appState;
/* import { createCanvasObject } from '../state/document-model.js'; */
const createCanvasObject = __require("./state/document-model.js").createCanvasObject;
/* import { getClosestAnchor, isPointInObject, distance } from '../utils/math.js'; */
const getClosestAnchor = __require("./utils/math.js").getClosestAnchor;
const isPointInObject = __require("./utils/math.js").isPointInObject;
const distance = __require("./utils/math.js").distance;

exports.ConnectorTool = class ConnectorTool extends BaseTool {
  constructor(app) {
    super('connector', app);
    this.isConnecting = false;
    this.startBinding = null;
    this.draftObject = null;
    this.hoveredAnchor = null;
  }

  activate() {
    super.activate();
    this.app.setCursor('crosshair');
  }

  deactivate() {
    super.deactivate();
    this.isConnecting = false;
    this.draftObject = null;
    this.startBinding = null;
    this.app.renderer.hoveredAnchor = null;
  }

  onPointerDown(e, worldPt) {
    this.isConnecting = true;
    const zoom = appState.viewport.zoom;

    // Find if starting from a shape anchor
    const candidate = this._findTargetShape(worldPt, zoom);
    let startX = worldPt.x;
    let startY = worldPt.y;
    let startBinding = null;

    if (candidate) {
      const { anchor } = getClosestAnchor(candidate, worldPt);
      startX = anchor.x;
      startY = anchor.y;
      startBinding = { elementId: candidate.id, anchor: anchor.id };
    }

    this.draftObject = createCanvasObject('connector', {
      x: startX,
      y: startY,
      x2: startX,
      y2: startY,
      startBinding,
      routing: 'curved',
      arrowHeadEnd: 'triangle'
    });

    appState.addObject(this.draftObject, false);
  }

  onPointerMove(e, worldPt) {
    const zoom = appState.viewport.zoom;

    if (!this.isConnecting || !this.draftObject) {
      // Hover feedback for anchors
      const candidate = this._findTargetShape(worldPt, zoom);
      if (candidate) {
        const { anchor } = getClosestAnchor(candidate, worldPt);
        this.app.renderer.hoveredAnchor = { ...anchor, elementId: candidate.id };
      } else {
        this.app.renderer.hoveredAnchor = null;
      }
      this.app.renderer.requestRender();
      return;
    }

    // Dragging connector
    const candidate = this._findTargetShape(worldPt, zoom);
    let endX = worldPt.x;
    let endY = worldPt.y;
    let endBinding = null;

    if (candidate && (!this.draftObject.startBinding || candidate.id !== this.draftObject.startBinding.elementId)) {
      const { anchor } = getClosestAnchor(candidate, worldPt);
      endX = anchor.x;
      endY = anchor.y;
      endBinding = { elementId: candidate.id, anchor: anchor.id };
      this.app.renderer.hoveredAnchor = { ...anchor, elementId: candidate.id };
    } else {
      this.app.renderer.hoveredAnchor = null;
    }

    this.draftObject.x2 = endX;
    this.draftObject.y2 = endY;
    this.draftObject.endBinding = endBinding;

    this.app.renderer.requestRender();
  }

  onPointerUp(e, worldPt) {
    if (!this.isConnecting || !this.draftObject) return;
    this.isConnecting = false;

    const d = distance({ x: this.draftObject.x, y: this.draftObject.y }, { x: this.draftObject.x2, y: this.draftObject.y2 });

    if (d > 10) {
      appState.history.push(appState.getObjects(), 'Create Connector');
      appState.setSelection(this.draftObject.id);
    } else {
      appState.removeObject(this.draftObject.id, false);
    }

    this.draftObject = null;
    this.app.renderer.hoveredAnchor = null;
    appState.setActiveTool('select');
  }

  _findTargetShape(worldPt, zoom) {
    const objects = [...appState.getObjects()].reverse();
    for (const obj of objects) {
      if (obj.visible === false || ['pencil', 'highlighter', 'connector', 'line', 'arrow'].includes(obj.type)) continue;
      if (isPointInObject(worldPt, obj, 20 / zoom)) {
        return obj;
      }
    }
    return null;
  }
}

};

modules["./tools/eraser-tool.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — Eraser Tool
   Interactive Object & Stroke Eraser
   ========================================================================== */

/* import { BaseTool } from './base-tool.js'; */
const BaseTool = __require("./tools/base-tool.js").BaseTool;
/* import { appState } from '../state/state.js'; */
const appState = __require("./state/state.js").appState;
/* import { isPointInObject } from '../utils/math.js'; */
const isPointInObject = __require("./utils/math.js").isPointInObject;

exports.EraserTool = class EraserTool extends BaseTool {
  constructor(app) {
    super('eraser', app);
    this.isErasing = false;
    this.erasedCount = 0;
  }

  activate() {
    super.activate();
    this.app.setCursor('crosshair');
  }

  deactivate() {
    super.deactivate();
    this.isErasing = false;
    this.app.renderer.eraserTrail = null;
  }

  onPointerDown(e, worldPt) {
    this.isErasing = true;
    this.erasedCount = 0;
    appState.history.beginTransaction(appState.getObjects());
    this._eraseAt(worldPt, e);
  }

  onPointerMove(e, worldPt) {
    // Show eraser circle overlay
    this.app.renderer.eraserTrail = {
      x: e.clientX - this.app.canvasContainer.getBoundingClientRect().left,
      y: e.clientY - this.app.canvasContainer.getBoundingClientRect().top,
      radius: 12
    };
    this.app.renderer.requestRender();

    if (this.isErasing) {
      this._eraseAt(worldPt, e);
    }
  }

  onPointerUp() {
    if (this.isErasing) {
      this.isErasing = false;
      if (this.erasedCount > 0) {
        appState.history.commitTransaction(appState.getObjects(), `Erase ${this.erasedCount} object(s)`);
      } else {
        appState.history.cancelTransaction();
      }
    }
    this.app.renderer.eraserTrail = null;
    this.app.renderer.requestRender();
  }

  _eraseAt(worldPt, e) {
    const zoom = appState.viewport.zoom;
    const threshold = 14 / zoom;
    const objects = [...appState.getObjects()].reverse();

    for (const obj of objects) {
      if (obj.visible !== false && !obj.locked) {
        if (isPointInObject(worldPt, obj, threshold)) {
          appState.removeObject(obj.id, false);
          this.erasedCount++;
        }
      }
    }
  }
}

};

modules["./tools/freehand-tool.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — Freehand Drawing Tool (Pencil & Highlighter)
   ========================================================================== */

/* import { BaseTool } from './base-tool.js'; */
const BaseTool = __require("./tools/base-tool.js").BaseTool;
/* import { appState } from '../state/state.js'; */
const appState = __require("./state/state.js").appState;
/* import { createCanvasObject } from '../state/document-model.js'; */
const createCanvasObject = __require("./state/document-model.js").createCanvasObject;
/* import { distance } from '../utils/math.js'; */
const distance = __require("./utils/math.js").distance;

exports.FreehandTool = class FreehandTool extends BaseTool {
  constructor(name, app) {
    super(name, app); // 'pencil' or 'highlighter'
    this.isDrawing = false;
    this.draftObject = null;
    this.lastPoint = null;
  }

  activate() {
    super.activate();
    this.app.setCursor('crosshair');
  }

  deactivate() {
    super.deactivate();
    this.isDrawing = false;
    this.draftObject = null;
  }

  onPointerDown(e, worldPt) {
    this.isDrawing = true;
    this.lastPoint = { ...worldPt };

    const isHighlighter = this.name === 'highlighter';

    this.draftObject = createCanvasObject(this.name, {
      x: worldPt.x,
      y: worldPt.y,
      stroke: isHighlighter ? '#fef08a' : appState.settings.defaultStrokeColor,
      strokeWidth: isHighlighter ? 18 : (appState.settings.defaultStrokeWidth || 3),
      opacity: isHighlighter ? 0.4 : 1,
      points: [{ x: worldPt.x, y: worldPt.y }]
    });

    appState.addObject(this.draftObject, false);
  }

  onPointerMove(e, worldPt) {
    if (!this.isDrawing || !this.draftObject) return;

    // Minimum distance threshold between points to maintain high performance
    if (this.lastPoint && distance(this.lastPoint, worldPt) < 3) {
      return;
    }

    this.draftObject.points.push({ x: worldPt.x, y: worldPt.y });
    this.lastPoint = { ...worldPt };

    this.app.renderer.requestRender();
  }

  onPointerUp() {
    if (!this.isDrawing || !this.draftObject) return;
    this.isDrawing = false;

    if (this.draftObject.points.length > 1) {
      appState.history.push(appState.getObjects(), `Draw ${this.name}`);
    } else {
      appState.removeObject(this.draftObject.id, false);
    }

    this.draftObject = null;
    this.lastPoint = null;
  }
}

};

modules["./tools/hand-tool.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — Hand / Pan Tool
   ========================================================================== */

/* import { BaseTool } from './base-tool.js'; */
const BaseTool = __require("./tools/base-tool.js").BaseTool;
/* import { appState } from '../state/state.js'; */
const appState = __require("./state/state.js").appState;

exports.HandTool = class HandTool extends BaseTool {
  constructor(app) {
    super('hand', app);
    this.isPanning = false;
    this.startX = 0;
    this.startY = 0;
  }

  activate() {
    super.activate();
    this.app.setCursor('grab');
  }

  deactivate() {
    super.deactivate();
    this.isPanning = false;
    this.app.setCursor('default');
  }

  onPointerDown(e) {
    this.isPanning = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.app.setCursor('grabbing');
  }

  onPointerMove(e) {
    if (!this.isPanning) return;
    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;
    this.startX = e.clientX;
    this.startY = e.clientY;

    appState.panBy(dx, dy);
  }

  onPointerUp() {
    this.isPanning = false;
    this.app.setCursor('grab');
  }
}

};

modules["./tools/line-tool.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — Line & Arrow Creation Tool
   ========================================================================== */

/* import { BaseTool } from './base-tool.js'; */
const BaseTool = __require("./tools/base-tool.js").BaseTool;
/* import { appState } from '../state/state.js'; */
const appState = __require("./state/state.js").appState;
/* import { createCanvasObject } from '../state/document-model.js'; */
const createCanvasObject = __require("./state/document-model.js").createCanvasObject;
/* import { SnappingEngine } from '../utils/snapping.js'; */
const SnappingEngine = __require("./utils/snapping.js").SnappingEngine;
/* import { DEG_TO_RAD, RAD_TO_DEG } from '../utils/math.js'; */
const DEG_TO_RAD = __require("./utils/math.js").DEG_TO_RAD;
const RAD_TO_DEG = __require("./utils/math.js").RAD_TO_DEG;

exports.LineTool = class LineTool extends BaseTool {
  constructor(name, app) {
    super(name, app);
    this.isDrawing = false;
    this.startPt = { x: 0, y: 0 };
    this.draftObject = null;
    this.snapping = new SnappingEngine();
  }

  activate() {
    super.activate();
    this.app.setCursor('crosshair');
  }

  deactivate() {
    super.deactivate();
    this.isDrawing = false;
    this.draftObject = null;
  }

  onPointerDown(e, worldPt) {
    this.isDrawing = true;
    let start = { ...worldPt };

    if (appState.settings.snapEnabled && !e.altKey) {
      start = this.snapping.snapPointToGrid(start);
    }

    this.startPt = start;

    this.draftObject = createCanvasObject(this.name, {
      x: start.x,
      y: start.y,
      x2: start.x + 1,
      y2: start.y + 1,
      stroke: appState.settings.defaultStrokeColor,
      strokeWidth: appState.settings.defaultStrokeWidth
    });

    appState.addObject(this.draftObject, false);
  }

  onPointerMove(e, worldPt) {
    if (!this.isDrawing || !this.draftObject) return;

    let current = { ...worldPt };
    if (appState.settings.snapEnabled && !e.altKey) {
      current = this.snapping.snapPointToGrid(current);
    }

    let endX = current.x;
    let endY = current.y;

    // Shift key: snap angle to 45 degree increments
    if (e.shiftKey) {
      const dx = endX - this.startPt.x;
      const dy = endY - this.startPt.y;
      const dist = Math.hypot(dx, dy);
      let angle = Math.atan2(dy, dx) * RAD_TO_DEG;
      angle = this.snapping.snapAngle(angle, 45) * DEG_TO_RAD;

      endX = this.startPt.x + dist * Math.cos(angle);
      endY = this.startPt.y + dist * Math.sin(angle);
    }

    this.draftObject.x2 = endX;
    this.draftObject.y2 = endY;

    this.app.renderer.requestRender();
  }

  onPointerUp(e, worldPt) {
    if (!this.isDrawing || !this.draftObject) return;
    this.isDrawing = false;

    // If click without drag, create a default 100px line
    if (Math.hypot((this.draftObject.x2 || 0) - this.draftObject.x, (this.draftObject.y2 || 0) - this.draftObject.y) < 5) {
      this.draftObject.x2 = this.draftObject.x + 120;
      this.draftObject.y2 = this.draftObject.y;
    }

    appState.history.push(appState.getObjects(), `Create ${this.name}`);
    appState.setSelection(this.draftObject.id);
    appState.setActiveTool('select');
  }
}

};

modules["./tools/select-tool.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — Selection Tool
   Click, Marquee Select, Move, Resize, Rotate & Text Editing
   ========================================================================== */

/* import { BaseTool } from './base-tool.js'; */
const BaseTool = __require("./tools/base-tool.js").BaseTool;
/* import { appState } from '../state/state.js'; */
const appState = __require("./state/state.js").appState;
/* import { eventBus } from '../state/event-bus.js'; */
const eventBus = __require("./state/event-bus.js").eventBus;
/* import { SnappingEngine } from '../utils/snapping.js'; */
const SnappingEngine = __require("./utils/snapping.js").SnappingEngine;
/* import {
  getObjectBounds,
  getSelectionHandles,
  unionBounds,
  isPointInObject,
  boundsIntersect,
  normalizeRect,
  rotatePoint,
  distance,
  DEG_TO_RAD,
  RAD_TO_DEG
} from '../utils/math.js'; */
const getObjectBounds = __require("./utils/math.js").getObjectBounds;
const getSelectionHandles = __require("./utils/math.js").getSelectionHandles;
const unionBounds = __require("./utils/math.js").unionBounds;
const isPointInObject = __require("./utils/math.js").isPointInObject;
const boundsIntersect = __require("./utils/math.js").boundsIntersect;
const normalizeRect = __require("./utils/math.js").normalizeRect;
const rotatePoint = __require("./utils/math.js").rotatePoint;
const distance = __require("./utils/math.js").distance;
const DEG_TO_RAD = __require("./utils/math.js").DEG_TO_RAD;
const RAD_TO_DEG = __require("./utils/math.js").RAD_TO_DEG;

exports.SelectTool = class SelectTool extends BaseTool {
  constructor(app) {
    super('select', app);
    this.snapping = new SnappingEngine();

    // Mode: 'idle' | 'marquee' | 'move' | 'resize' | 'rotate'
    this.mode = 'idle';

    this.startWorldPt = { x: 0, y: 0 };
    this.startScreenPt = { x: 0, y: 0 };
    this.lastWorldPt = { x: 0, y: 0 };

    this.activeHandle = null;
    this.initialBounds = null;
    this.initialObjectsState = new Map(); // id -> clone of object props
    this.hasMoved = false;
    this.isDuplicating = false;
  }

  activate() {
    super.activate();
    this.app.setCursor('default');
  }

  deactivate() {
    super.deactivate();
    this.mode = 'idle';
    this.activeHandle = null;
    this.initialBounds = null;
    this.initialObjectsState.clear();
    this.app.renderer.selectionMarquee = null;
  }

  _getContainerPoint(e) {
    const rect = this.app.canvasContainer.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  onPointerDown(e, worldPt) {
    this.startWorldPt = { ...worldPt };
    this.startScreenPt = { x: e.clientX, y: e.clientY };
    this.lastWorldPt = { ...worldPt };
    this.hasMoved = false;
    this.isDuplicating = false;

    const zoom = appState.viewport.zoom;
    const selectedObjects = appState.getSelectedObjects();
    const containerPt = this._getContainerPoint(e);

    // 1. Check Handle Hit Test (if items are selected)
    if (selectedObjects.length > 0) {
      const handle = this._findHitHandle(containerPt.x, containerPt.y);
      if (handle) {
        if (handle.id === 'rot') {
          this.mode = 'rotate';
          this.initialBounds = appState.getSelectedBounds();
          this._cacheInitialState();
          appState.history.beginTransaction(appState.getObjects());
          return;
        } else {
          this.mode = 'resize';
          this.activeHandle = handle;
          this.initialBounds = appState.getSelectedBounds();
          this._cacheInitialState();
          appState.history.beginTransaction(appState.getObjects());
          return;
        }
      }
    }

    // 2. Check Object Hit Test (from top z-index down to bottom)
    const objects = [...appState.getObjects()].reverse();
    let hitObject = null;

    for (const obj of objects) {
      if (obj.visible !== false && isPointInObject(worldPt, obj, 8 / zoom)) {
        hitObject = obj;
        break;
      }
    }

    if (hitObject) {
      // If object is locked, we can select it to view, but won't drag it
      if (e.shiftKey) {
        appState.toggleSelection(hitObject.id);
      } else {
        if (!appState.selectedIds.has(hitObject.id)) {
          appState.setSelection(hitObject.id);
        }
      }

      if (!hitObject.locked) {
        this.mode = 'move';
        this._cacheInitialState();
        appState.history.beginTransaction(appState.getObjects());

        // Alt+Drag for Instant Duplication
        if (e.altKey) {
          this.isDuplicating = true;
          appState.duplicateSelected();
          this._cacheInitialState();
        }
      }
      return;
    }

    // 3. Clicked on Empty Canvas -> Clear or start Marquee selection
    if (!e.shiftKey) {
      appState.clearSelection();
    }
    this.mode = 'marquee';
    this.app.renderer.selectionMarquee = { x: worldPt.x, y: worldPt.y, width: 0, height: 0 };
    this.app.renderer.requestRender();
  }

  onPointerMove(e, worldPt) {
    const dx = worldPt.x - this.startWorldPt.x;
    const dy = worldPt.y - this.startWorldPt.y;

    if (Math.hypot(dx, dy) > 2) {
      this.hasMoved = true;
    }

    if (this.mode === 'move') {
      this._handleMove(e, worldPt, dx, dy);
    } else if (this.mode === 'resize') {
      this._handleResize(e, worldPt);
    } else if (this.mode === 'rotate') {
      this._handleRotate(e, worldPt);
    } else if (this.mode === 'marquee') {
      this._handleMarquee(e, worldPt);
    } else {
      this._updateCursor(e);
    }

    this.lastWorldPt = { ...worldPt };
  }

  onPointerUp(e, worldPt) {
    if (this.mode === 'move' || this.mode === 'resize' || this.mode === 'rotate') {
      if (this.hasMoved) {
        appState.history.commitTransaction(appState.getObjects(), `Transform (${this.mode})`);
      } else {
        appState.history.cancelTransaction();
      }
    } else if (this.mode === 'marquee') {
      this.app.renderer.selectionMarquee = null;
    }

    this.mode = 'idle';
    this.activeHandle = null;
    this.initialBounds = null;
    this.initialObjectsState.clear();
    appState.activeGuides = [];
    this.app.renderer.requestRender();
  }

  onDoubleClick(e, worldPt) {
    const objects = [...appState.getObjects()].reverse();
    for (const obj of objects) {
      if (obj.visible !== false && isPointInObject(worldPt, obj)) {
        if (obj.type === 'text' || obj.type === 'sticky') {
          this.app.openInlineTextEditor(obj);
          break;
        }
      }
    }
  }

  onKeyDown(e) {
    const selected = appState.getSelectedObjects().filter(o => !o.locked);
    if (selected.length === 0) return;

    // Arrow keys nudge
    const step = e.shiftKey ? 10 : 1;
    let dx = 0;
    let dy = 0;

    if (e.key === 'ArrowLeft') dx = -step;
    else if (e.key === 'ArrowRight') dx = step;
    else if (e.key === 'ArrowUp') dy = -step;
    else if (e.key === 'ArrowDown') dy = step;

    if (dx !== 0 || dy !== 0) {
      e.preventDefault();
      const updates = {};
      for (const obj of selected) {
        const u = { x: obj.x + dx, y: obj.y + dy };
        if (obj.x2 !== undefined) u.x2 = obj.x2 + dx;
        if (obj.y2 !== undefined) u.y2 = obj.y2 + dy;
        if (obj.points) {
          u.points = obj.points.map(p => ({ x: p.x + dx, y: p.y + dy }));
        }
        updates[obj.id] = u;
      }
      appState.updateObjects(updates, true);
    }
  }

  _cacheInitialState() {
    this.initialObjectsState.clear();
    for (const obj of appState.getSelectedObjects()) {
      this.initialObjectsState.set(obj.id, JSON.parse(JSON.stringify(obj)));
    }
  }

  _handleMove(e, worldPt, rawDx, rawDy) {
    let finalDx = rawDx;
    let finalDy = rawDy;
    const zoom = appState.viewport.zoom;

    // Smart Snapping
    if (appState.settings.snapEnabled && !e.altKey) {
      const selected = appState.getSelectedObjects();
      const nonSelected = appState.getObjects().filter(o => !appState.selectedIds.has(o.id));
      const movingBounds = appState.getSelectedBounds();

      if (movingBounds) {
        const currentMoving = {
          x: movingBounds.x + rawDx,
          y: movingBounds.y + rawDy,
          width: movingBounds.width,
          height: movingBounds.height
        };

        const snapResult = this.snapping.calculateObjectSnaps(currentMoving, nonSelected, zoom);
        finalDx = rawDx + snapResult.deltaX;
        finalDy = rawDy + snapResult.deltaY;
        appState.activeGuides = snapResult.guides;
      }
    } else {
      appState.activeGuides = [];
    }

    const updates = {};
    for (const [id, initial] of this.initialObjectsState.entries()) {
      const objUpdate = {
        x: initial.x + finalDx,
        y: initial.y + finalDy
      };

      if (initial.x2 !== undefined) objUpdate.x2 = initial.x2 + finalDx;
      if (initial.y2 !== undefined) objUpdate.y2 = initial.y2 + finalDy;

      if (initial.points) {
        objUpdate.points = initial.points.map(p => ({
          x: p.x + finalDx,
          y: p.y + finalDy
        }));
      }

      updates[id] = objUpdate;
    }

    appState.updateObjects(updates, false);
    this.app.renderer.requestRender();
  }

  _handleResize(e, worldPt) {
    if (!this.initialBounds || !this.activeHandle) return;

    const selected = appState.getSelectedObjects();
    const isSingle = selected.length === 1;
    const initialObj = isSingle ? this.initialObjectsState.get(selected[0].id) : null;
    const handle = this.activeHandle.id;

    // Handle line / arrow / connector endpoint drag
    if (initialObj && ['line', 'arrow', 'connector'].includes(initialObj.type)) {
      const updates = {};
      if (handle === 'start') {
        updates[initialObj.id] = { x: worldPt.x, y: worldPt.y };
      } else if (handle === 'end') {
        updates[initialObj.id] = { x2: worldPt.x, y2: worldPt.y };
      }
      appState.updateObjects(updates, false);
      this.app.renderer.requestRender();
      return;
    }

    const rotation = (isSingle && initialObj) ? (initialObj.rotation || 0) : 0;
    const ib = this.initialBounds;

    // Center of initial bounding box
    const center = {
      x: ib.x + ib.width / 2,
      y: ib.y + ib.height / 2
    };

    // Transform world points into local unrotated coordinates
    const theta = rotation * DEG_TO_RAD;
    const localStart = rotatePoint(this.startWorldPt, center, -theta);
    const localCurrent = rotatePoint(worldPt, center, -theta);

    const dx = localCurrent.x - localStart.x;
    const dy = localCurrent.y - localStart.y;

    let left = ib.x;
    let right = ib.x + ib.width;
    let top = ib.y;
    let bottom = ib.y + ib.height;

    // Apply delta depending on handle
    if (handle.includes('e')) right = Math.max(left + 10, right + dx);
    if (handle.includes('w')) left = Math.min(right - 10, left + dx);
    if (handle.includes('s')) bottom = Math.max(top + 10, bottom + dy);
    if (handle.includes('n')) top = Math.min(bottom - 10, top + dy);

    // Aspect ratio lock with Shift key for corner handles
    if (e.shiftKey && ib.height > 0) {
      const targetAspect = ib.width / ib.height;
      const currentW = right - left;

      if (handle === 'se') {
        bottom = top + Math.max(10, currentW / targetAspect);
      } else if (handle === 'nw') {
        top = bottom - Math.max(10, currentW / targetAspect);
      } else if (handle === 'ne') {
        top = bottom - Math.max(10, currentW / targetAspect);
      } else if (handle === 'sw') {
        bottom = top + Math.max(10, currentW / targetAspect);
      }
    }

    const newW = Math.max(10, right - left);
    const newH = Math.max(10, bottom - top);

    // Compute new rotated center in world coordinates
    const localCenter = {
      x: left + newW / 2,
      y: top + newH / 2
    };
    const worldCenter = rotatePoint(localCenter, center, theta);

    const newX = worldCenter.x - newW / 2;
    const newY = worldCenter.y - newH / 2;

    const updates = {};
    for (const [id, initial] of this.initialObjectsState.entries()) {
      const relX = ib.width > 0 ? (initial.x - ib.x) / ib.width : 0;
      const relY = ib.height > 0 ? (initial.y - ib.y) / ib.height : 0;
      const relW = ib.width > 0 ? (initial.width || ib.width) / ib.width : 1;
      const relH = ib.height > 0 ? (initial.height || ib.height) / ib.height : 1;

      const objUpdate = {
        x: newX + relX * newW,
        y: newY + relY * newH,
        width: Math.max(10, relW * newW),
        height: Math.max(10, relH * newH)
      };

      if (initial.points && ib.width > 0 && ib.height > 0) {
        objUpdate.points = initial.points.map(p => ({
          x: newX + ((p.x - ib.x) / ib.width) * newW,
          y: newY + ((p.y - ib.y) / ib.height) * newH
        }));
      }

      updates[id] = objUpdate;
    }

    appState.updateObjects(updates, false);
    this.app.renderer.requestRender();
  }

  _handleRotate(e, worldPt) {
    if (!this.initialBounds) return;
    const center = {
      x: this.initialBounds.x + this.initialBounds.width / 2,
      y: this.initialBounds.y + this.initialBounds.height / 2
    };

    const angleRad = Math.atan2(worldPt.y - center.y, worldPt.x - center.x);
    let angleDeg = (angleRad * RAD_TO_DEG + 90) % 360;
    if (angleDeg < 0) angleDeg += 360;

    // Angle snapping to 15 degrees if Shift is held
    if (e.shiftKey) {
      angleDeg = this.snapping.snapAngle(angleDeg, 15);
    }

    const updates = {};
    for (const [id, initial] of this.initialObjectsState.entries()) {
      updates[id] = { rotation: Math.round(angleDeg) };
    }

    appState.updateObjects(updates, false);
    this.app.renderer.requestRender();
  }

  _handleMarquee(e, worldPt) {
    const rawBox = normalizeRect(
      this.startWorldPt.x,
      this.startWorldPt.y,
      worldPt.x - this.startWorldPt.x,
      worldPt.y - this.startWorldPt.y
    );

    this.app.renderer.selectionMarquee = rawBox;

    const matchedIds = [];
    for (const obj of appState.getObjects()) {
      if (obj.visible === false || obj.locked) continue;
      const b = getObjectBounds(obj);
      if (boundsIntersect(rawBox, b)) {
        matchedIds.push(obj.id);
      }
    }

    appState.setSelection(matchedIds);
    this.app.renderer.requestRender();
  }

  _findHitHandle(screenX, screenY) {
    const selected = appState.getSelectedObjects();
    if (selected.length === 0) return null;

    const zoom = appState.viewport.zoom;
    const panX = appState.viewport.panX;
    const panY = appState.viewport.panY;
    const hitThreshold = 14;

    // Line / arrow / connector endpoint handles
    if (selected.length === 1 && ['line', 'arrow', 'connector'].includes(selected[0].type)) {
      const obj = selected[0];
      const p1 = { x: obj.x * zoom + panX, y: obj.y * zoom + panY, id: 'start', cursor: 'crosshair' };
      const p2 = { x: (obj.x2 ?? obj.x) * zoom + panX, y: (obj.y2 ?? obj.y) * zoom + panY, id: 'end', cursor: 'crosshair' };

      if (Math.hypot(screenX - p1.x, screenY - p1.y) <= hitThreshold) return p1;
      if (Math.hypot(screenX - p2.x, screenY - p2.y) <= hitThreshold) return p2;
      return null;
    }

    const bounds = appState.getSelectedBounds();
    if (!bounds) return null;

    const screenB = {
      x: bounds.x * zoom + panX,
      y: bounds.y * zoom + panY,
      width: bounds.width * zoom,
      height: bounds.height * zoom
    };

    const rotation = selected.length === 1 ? (selected[0].rotation || 0) : 0;
    const handles = getSelectionHandles(screenB, rotation, 8);

    for (const h of handles) {
      if (Math.hypot(screenX - h.x, screenY - h.y) <= hitThreshold) {
        return h;
      }
    }

    return null;
  }

  _updateCursor(e) {
    const containerPt = this._getContainerPoint(e);
    const handle = this._findHitHandle(containerPt.x, containerPt.y);
    if (handle) {
      this.app.setCursor(handle.cursor || 'pointer');
    } else {
      this.app.setCursor('default');
    }
  }
}

};

modules["./tools/shape-tool.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — Shape Creation Tool
   Rectangle, Rounded Rectangle, Ellipse, Diamond
   ========================================================================== */

/* import { BaseTool } from './base-tool.js'; */
const BaseTool = __require("./tools/base-tool.js").BaseTool;
/* import { appState } from '../state/state.js'; */
const appState = __require("./state/state.js").appState;
/* import { createCanvasObject } from '../state/document-model.js'; */
const createCanvasObject = __require("./state/document-model.js").createCanvasObject;
/* import { normalizeRect } from '../utils/math.js'; */
const normalizeRect = __require("./utils/math.js").normalizeRect;
/* import { SnappingEngine } from '../utils/snapping.js'; */
const SnappingEngine = __require("./utils/snapping.js").SnappingEngine;

exports.ShapeTool = class ShapeTool extends BaseTool {
  constructor(name, app) {
    super(name, app);
    this.isDrawing = false;
    this.startPt = { x: 0, y: 0 };
    this.draftObject = null;
    this.snapping = new SnappingEngine();
  }

  activate() {
    super.activate();
    this.app.setCursor('crosshair');
  }

  deactivate() {
    super.deactivate();
    this.isDrawing = false;
    this.draftObject = null;
  }

  onPointerDown(e, worldPt) {
    this.isDrawing = true;
    let start = { ...worldPt };

    if (appState.settings.snapEnabled && !e.altKey) {
      start = this.snapping.snapPointToGrid(start);
    }

    this.startPt = start;

    this.draftObject = createCanvasObject(this.name, {
      x: start.x,
      y: start.y,
      width: 1,
      height: 1,
      stroke: appState.settings.defaultStrokeColor,
      fill: appState.settings.defaultFillColor,
      strokeWidth: appState.settings.defaultStrokeWidth
    });

    appState.addObject(this.draftObject, false);
  }

  onPointerMove(e, worldPt) {
    if (!this.isDrawing || !this.draftObject) return;

    let current = { ...worldPt };
    if (appState.settings.snapEnabled && !e.altKey) {
      current = this.snapping.snapPointToGrid(current);
    }

    let width = current.x - this.startPt.x;
    let height = current.y - this.startPt.y;

    // Shift key: lock 1:1 square/circle aspect ratio
    if (e.shiftKey) {
      const maxDim = Math.max(Math.abs(width), Math.abs(height));
      width = width < 0 ? -maxDim : maxDim;
      height = height < 0 ? -maxDim : maxDim;
    }

    const norm = normalizeRect(this.startPt.x, this.startPt.y, width, height);

    this.draftObject.x = norm.x;
    this.draftObject.y = norm.y;
    this.draftObject.width = Math.max(2, norm.width);
    this.draftObject.height = Math.max(2, norm.height);

    this.app.renderer.requestRender();
  }

  onPointerUp(e, worldPt) {
    if (!this.isDrawing || !this.draftObject) return;
    this.isDrawing = false;

    // If click without drag, create a standard sized shape (120x80)
    if (this.draftObject.width <= 5 && this.draftObject.height <= 5) {
      this.draftObject.width = 120;
      this.draftObject.height = this.name === 'ellipse' || this.name === 'diamond' ? 100 : 80;
      this.draftObject.x -= this.draftObject.width / 2;
      this.draftObject.y -= this.draftObject.height / 2;
    }

    appState.history.push(appState.getObjects(), `Create ${this.name}`);
    appState.setSelection(this.draftObject.id);
    appState.setActiveTool('select');
  }
}

};

modules["./tools/sticky-tool.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — Sticky Note Tool
   ========================================================================== */

/* import { BaseTool } from './base-tool.js'; */
const BaseTool = __require("./tools/base-tool.js").BaseTool;
/* import { appState } from '../state/state.js'; */
const appState = __require("./state/state.js").appState;
/* import { createCanvasObject } from '../state/document-model.js'; */
const createCanvasObject = __require("./state/document-model.js").createCanvasObject;

exports.StickyTool = class StickyTool extends BaseTool {
  constructor(app) {
    super('sticky', app);
  }

  activate() {
    super.activate();
    this.app.setCursor('crosshair');
  }

  deactivate() {
    super.deactivate();
  }

  onPointerDown(e, worldPt) {
    const stickyObj = createCanvasObject('sticky', {
      x: worldPt.x - 80,
      y: worldPt.y - 80,
      width: 160,
      height: 160,
      fill: '#fef08a',
      color: '#713f12',
      text: ''
    });

    appState.addObject(stickyObj, true);
    appState.setSelection(stickyObj.id);
    appState.setActiveTool('select');

    setTimeout(() => {
      this.app.openInlineTextEditor(stickyObj);
    }, 10);
  }
}

};

modules["./tools/text-tool.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — Text Tool
   ========================================================================== */

/* import { BaseTool } from './base-tool.js'; */
const BaseTool = __require("./tools/base-tool.js").BaseTool;
/* import { appState } from '../state/state.js'; */
const appState = __require("./state/state.js").appState;
/* import { createCanvasObject } from '../state/document-model.js'; */
const createCanvasObject = __require("./state/document-model.js").createCanvasObject;

exports.TextTool = class TextTool extends BaseTool {
  constructor(app) {
    super('text', app);
  }

  activate() {
    super.activate();
    this.app.setCursor('text');
  }

  deactivate() {
    super.deactivate();
  }

  onPointerDown(e, worldPt) {
    const textObj = createCanvasObject('text', {
      x: worldPt.x,
      y: worldPt.y,
      text: '',
      color: appState.settings.theme === 'dark' ? '#f3f4f6' : '#111827',
      fontSize: 18
    });

    appState.addObject(textObj, true);
    appState.setSelection(textObj.id);
    appState.setActiveTool('select');

    // Open inline text editor
    setTimeout(() => {
      this.app.openInlineTextEditor(textObj);
    }, 10);
  }
}

};

modules["./tools/tool-manager.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — Tool Manager
   Registers Tools & Routes Pointer / Keyboard Events
   ========================================================================== */

/* import { appState } from '../state/state.js'; */
const appState = __require("./state/state.js").appState;
/* import { eventBus } from '../state/event-bus.js'; */
const eventBus = __require("./state/event-bus.js").eventBus;
/* import { SelectTool } from './select-tool.js'; */
const SelectTool = __require("./tools/select-tool.js").SelectTool;
/* import { HandTool } from './hand-tool.js'; */
const HandTool = __require("./tools/hand-tool.js").HandTool;
/* import { ShapeTool } from './shape-tool.js'; */
const ShapeTool = __require("./tools/shape-tool.js").ShapeTool;
/* import { LineTool } from './line-tool.js'; */
const LineTool = __require("./tools/line-tool.js").LineTool;
/* import { FreehandTool } from './freehand-tool.js'; */
const FreehandTool = __require("./tools/freehand-tool.js").FreehandTool;
/* import { TextTool } from './text-tool.js'; */
const TextTool = __require("./tools/text-tool.js").TextTool;
/* import { StickyTool } from './sticky-tool.js'; */
const StickyTool = __require("./tools/sticky-tool.js").StickyTool;
/* import { ConnectorTool } from './connector-tool.js'; */
const ConnectorTool = __require("./tools/connector-tool.js").ConnectorTool;
/* import { EraserTool } from './eraser-tool.js'; */
const EraserTool = __require("./tools/eraser-tool.js").EraserTool;

exports.ToolManager = class ToolManager {
  constructor(app) {
    this.app = app;
    this.tools = new Map();
    this.currentTool = null;
    this.isSpacePressed = false;
    this.previousToolBeforeSpace = null;

    this._registerTools();
    this._setupListeners();
  }

  _registerTools() {
    this.tools.set('select', new SelectTool(this.app));
    this.tools.set('hand', new HandTool(this.app));
    this.tools.set('rectangle', new ShapeTool('rectangle', this.app));
    this.tools.set('rounded-rectangle', new ShapeTool('rounded-rectangle', this.app));
    this.tools.set('ellipse', new ShapeTool('ellipse', this.app));
    this.tools.set('diamond', new ShapeTool('diamond', this.app));
    this.tools.set('line', new LineTool('line', this.app));
    this.tools.set('arrow', new LineTool('arrow', this.app));
    this.tools.set('connector', new ConnectorTool(this.app));
    this.tools.set('pencil', new FreehandTool('pencil', this.app));
    this.tools.set('highlighter', new FreehandTool('highlighter', this.app));
    this.tools.set('text', new TextTool(this.app));
    this.tools.set('sticky', new StickyTool(this.app));
    this.tools.set('eraser', new EraserTool(this.app));

    this.setTool('select');
  }

  _setupListeners() {
    eventBus.on('tool:changed', (toolName) => {
      this.setTool(toolName);
    });

    // Space key for temporary Hand / Pan tool
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !this.isSpacePressed && !this._isEditingText()) {
        this.isSpacePressed = true;
        this.previousToolBeforeSpace = appState.activeTool;
        this.setTool('hand');
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space' && this.isSpacePressed) {
        this.isSpacePressed = false;
        const revertTo = this.previousToolBeforeSpace || 'select';
        this.previousToolBeforeSpace = null;
        this.setTool(revertTo);
      }
    });

    // Revert if window loses focus while holding Space
    window.addEventListener('blur', () => {
      if (this.isSpacePressed) {
        this.isSpacePressed = false;
        const revertTo = this.previousToolBeforeSpace || 'select';
        this.previousToolBeforeSpace = null;
        this.setTool(revertTo);
      }
    });
  }

  setTool(name) {
    const nextTool = this.tools.get(name);
    if (!nextTool) return;

    if (this.currentTool) {
      this.currentTool.deactivate();
    }

    this.currentTool = nextTool;
    this.currentTool.activate();
  }

  onPointerDown(e, worldPt) {
    // Middle click triggers Hand pan
    if (e.button === 1) {
      this.previousToolBeforeSpace = appState.activeTool;
      this.setTool('hand');
      this.currentTool.onPointerDown(e, worldPt);
      return;
    }

    if (this.currentTool) {
      this.currentTool.onPointerDown(e, worldPt);
    }
  }

  onPointerMove(e, worldPt) {
    if (this.currentTool) {
      this.currentTool.onPointerMove(e, worldPt);
    }
  }

  onPointerUp(e, worldPt) {
    if (this.currentTool) {
      this.currentTool.onPointerUp(e, worldPt);
    }

    if (e.button === 1 && this.previousToolBeforeSpace) {
      const revertTo = this.previousToolBeforeSpace || 'select';
      this.previousToolBeforeSpace = null;
      this.setTool(revertTo);
    }
  }

  onDoubleClick(e, worldPt) {
    if (this.currentTool) {
      this.currentTool.onDoubleClick(e, worldPt);
    }
  }

  onKeyDown(e) {
    if (this.currentTool && !this._isEditingText()) {
      this.currentTool.onKeyDown(e);
    }
  }

  onKeyUp(e) {
    if (this.currentTool && !this._isEditingText()) {
      this.currentTool.onKeyUp(e);
    }
  }

  _isEditingText() {
    const active = document.activeElement;
    return active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA');
  }
}

};

modules["./ui/command-palette.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — Searchable Command Palette (Ctrl+K)
   ========================================================================== */

/* import { appState } from '../state/state.js'; */
const appState = __require("./state/state.js").appState;
/* import { getIcon } from '../utils/icons.js'; */
const getIcon = __require("./utils/icons.js").getIcon;

exports.CommandPalette = class CommandPalette {
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

};

modules["./ui/context-menu.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — Desktop Context Menu
   Right-Click Actions for Canvas & Selected Objects
   ========================================================================== */

/* import { appState } from '../state/state.js'; */
const appState = __require("./state/state.js").appState;
/* import { isPointInObject, clamp } from '../utils/math.js'; */
const isPointInObject = __require("./utils/math.js").isPointInObject;
const clamp = __require("./utils/math.js").clamp;
/* import { ICONS } from '../utils/icons.js'; */
const ICONS = __require("./utils/icons.js").ICONS;

exports.ContextMenu = class ContextMenu {
  constructor(app) {
    this.app = app;
    this.menu = document.getElementById('context-menu');
    this.isOpen = false;

    this._setupListeners();
  }

  _setupListeners() {
    this.app.canvasContainer.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.open(e);
    });

    window.addEventListener('click', (e) => {
      if (this.isOpen && !e.target.closest('#context-menu')) {
        this.close();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  open(e) {
    const rect = this.app.canvasContainer.getBoundingClientRect();
    const worldPt = this.app.renderer.screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
    const zoom = appState.viewport.zoom;

    // Check if clicked on an object
    const objects = [...appState.getObjects()].reverse();
    let hitObject = null;
    for (const obj of objects) {
      if (obj.visible !== false && isPointInObject(worldPt, obj, 6 / zoom)) {
        hitObject = obj;
        break;
      }
    }

    if (hitObject && !appState.selectedIds.has(hitObject.id)) {
      appState.setSelection(hitObject.id);
    }

    this.renderMenu(hitObject);

    // Position menu safely within viewport
    const menuWidth = 200;
    const menuHeight = 280;
    const posX = clamp(e.clientX, 10, window.innerWidth - menuWidth - 10);
    const posY = clamp(e.clientY, 10, window.innerHeight - menuHeight - 10);

    this.menu.style.left = `${posX}px`;
    this.menu.style.top = `${posY}px`;
    this.menu.classList.remove('hidden');
    this.isOpen = true;
  }

  close() {
    this.menu.classList.add('hidden');
    this.isOpen = false;
  }

  renderMenu(targetObject) {
    const selected = appState.getSelectedObjects();
    const hasSelection = selected.length > 0;
    const hasClipboard = appState.clipboard.length > 0;

    let items = [];

    if (hasSelection) {
      const isLocked = selected.some(o => o.locked);
      const isGrouped = selected.some(o => o.groupId);

      items = [
        { label: 'Cut', shortcut: 'Ctrl+X', action: 'cut' },
        { label: 'Copy', shortcut: 'Ctrl+C', action: 'copy' },
        { label: 'Paste', shortcut: 'Ctrl+V', action: 'paste', disabled: !hasClipboard },
        { label: 'Duplicate', shortcut: 'Ctrl+D', action: 'duplicate' },
        { divider: true },
        { label: isGrouped ? 'Ungroup' : 'Group', shortcut: isGrouped ? 'Ctrl+Shift+G' : 'Ctrl+G', action: isGrouped ? 'ungroup' : 'group' },
        { label: isLocked ? 'Unlock' : 'Lock', shortcut: 'Ctrl+L', action: 'lock' },
        { divider: true },
        { label: 'Bring to Front', shortcut: 'Ctrl+]', action: 'bring-front' },
        { label: 'Send to Back', shortcut: 'Ctrl+[', action: 'send-back' },
        { divider: true },
        { label: 'Delete', shortcut: 'Del', action: 'delete', danger: true }
      ];
    } else {
      items = [
        { label: 'Paste', shortcut: 'Ctrl+V', action: 'paste', disabled: !hasClipboard },
        { label: 'Select All', shortcut: 'Ctrl+A', action: 'select-all' },
        { divider: true },
        { label: 'Zoom to Fit All', shortcut: 'Shift+1', action: 'zoom-fit' },
        { label: 'Reset Zoom (100%)', shortcut: 'Ctrl+0', action: 'zoom-reset' },
        { divider: true },
        { label: 'Add Sticky Note', shortcut: 'S', action: 'add-sticky' },
        { label: 'Add Rectangle', shortcut: 'R', action: 'add-rect' }
      ];
    }

    this.menu.innerHTML = items.map(item => {
      if (item.divider) return `<div class="dropdown-divider"></div>`;
      return `
        <button class="dropdown-item ${item.danger ? 'text-danger' : ''}" data-action="${item.action}" ${item.disabled ? 'disabled style="opacity:0.4"' : ''}>
          <span>${item.label}</span>
          ${item.shortcut ? `<kbd>${item.shortcut}</kbd>` : ''}
        </button>
      `;
    }).join('');

    this.menu.querySelectorAll('.dropdown-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        this._executeAction(action);
        this.close();
      });
    });
  }

  _executeAction(action) {
    const { clientWidth, clientHeight } = this.app.canvasContainer;

    switch (action) {
      case 'cut': appState.cutSelected(); break;
      case 'copy': appState.copySelected(); break;
      case 'paste': appState.paste(); break;
      case 'duplicate': appState.duplicateSelected(); break;
      case 'group': appState.groupSelected(); break;
      case 'ungroup': appState.ungroupSelected(); break;
      case 'lock': appState.lockSelected(); break;
      case 'bring-front': appState.bringToFront(); break;
      case 'send-back': appState.sendToBack(); break;
      case 'delete': appState.deleteSelected(); break;
      case 'select-all': appState.selectAll(); break;
      case 'zoom-fit': appState.zoomToFit(clientWidth, clientHeight); break;
      case 'zoom-reset': appState.setViewport(clientWidth / 2, clientHeight / 2, 1.0); break;
      case 'add-sticky': appState.setActiveTool('sticky'); break;
      case 'add-rect': appState.setActiveTool('rectangle'); break;
    }
  }
}

};

modules["./ui/layers-panel.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — Layers & Outline Panel
   Layer Hierarchy, Z-Order, Visibility, Lock & Selection Sync
   ========================================================================== */

/* import { appState } from '../state/state.js'; */
const appState = __require("./state/state.js").appState;
/* import { eventBus } from '../state/event-bus.js'; */
const eventBus = __require("./state/event-bus.js").eventBus;
/* import { getIcon, ICONS } from '../utils/icons.js'; */
const getIcon = __require("./utils/icons.js").getIcon;
const ICONS = __require("./utils/icons.js").ICONS;

exports.LayersPanel = class LayersPanel {
  constructor(app) {
    this.app = app;
    this.panel = document.getElementById('layers-panel');
    this.list = document.getElementById('layers-list');
    this.emptyState = document.getElementById('layers-empty');
    this.btnClose = document.getElementById('btn-close-layers');

    this._setupListeners();
    this.render();
  }

  _setupListeners() {
    this.btnClose.addEventListener('click', () => {
      this.panel.classList.add('hidden');
      document.getElementById('btn-toggle-layers').classList.remove('active');
    });

    eventBus.on('state:changed', () => this.render());
    eventBus.on('selection:changed', () => this.updateSelectionHighlight());
  }

  render() {
    const objects = [...appState.getObjects()].reverse(); // Top layer first

    if (objects.length === 0) {
      this.list.innerHTML = '';
      this.emptyState.classList.remove('hidden');
      return;
    }

    this.emptyState.classList.add('hidden');

    this.list.innerHTML = objects.map(obj => {
      const isSelected = appState.selectedIds.has(obj.id);
      const isLocked = obj.locked;
      const isVisible = obj.visible !== false;

      let label = obj.type;
      if (obj.text) {
        label = `"${obj.text.substring(0, 18)}${obj.text.length > 18 ? '...' : ''}"`;
      } else if (obj.groupId) {
        label = `Group Item (${obj.type})`;
      }

      return `
        <div class="layer-item ${isSelected ? 'selected' : ''}" data-id="${obj.id}">
          <span class="layer-icon">${getIcon(obj.type)}</span>
          <span class="layer-title">${label}</span>
          <div class="layer-actions">
            <button class="layer-btn btn-lock ${isLocked ? 'active' : ''}" title="${isLocked ? 'Unlock' : 'Lock'}">
              ${isLocked ? ICONS.lock : ICONS.unlock}
            </button>
            <button class="layer-btn btn-vis ${!isVisible ? 'active' : ''}" title="${isVisible ? 'Hide' : 'Show'}">
              ${isVisible ? ICONS.eye : ICONS.eyeOff}
            </button>
            <button class="layer-btn btn-del" title="Delete">
              ${ICONS.trash}
            </button>
          </div>
        </div>
      `;
    }).join('');

    this._attachItemEvents();
  }

  updateSelectionHighlight() {
    const items = this.list.querySelectorAll('.layer-item');
    items.forEach(item => {
      const id = item.dataset.id;
      item.classList.toggle('selected', appState.selectedIds.has(id));
    });
  }

  _attachItemEvents() {
    this.list.querySelectorAll('.layer-item').forEach(item => {
      const id = item.dataset.id;
      const obj = appState.getObjectById(id);
      if (!obj) return;

      // Click to select
      item.addEventListener('click', (e) => {
        if (e.target.closest('.layer-btn')) return;
        if (e.shiftKey) {
          appState.toggleSelection(id);
        } else {
          appState.setSelection(id);
        }
      });

      // Lock toggle
      item.querySelector('.btn-lock')?.addEventListener('click', (e) => {
        e.stopPropagation();
        appState.updateObject(id, { locked: !obj.locked }, true);
      });

      // Visibility toggle
      item.querySelector('.btn-vis')?.addEventListener('click', (e) => {
        e.stopPropagation();
        appState.updateObject(id, { visible: obj.visible === false ? true : false }, true);
      });

      // Delete item
      item.querySelector('.btn-del')?.addEventListener('click', (e) => {
        e.stopPropagation();
        appState.removeObject(id, true);
      });
    });
  }
}

};

modules["./ui/minimap.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — Interactive Minimap
   Mini Overview & Viewport Drag Navigation
   ========================================================================== */

/* import { appState } from '../state/state.js'; */
const appState = __require("./state/state.js").appState;
/* import { eventBus } from '../state/event-bus.js'; */
const eventBus = __require("./state/event-bus.js").eventBus;
/* import { getObjectBounds, unionBounds, clamp } from '../utils/math.js'; */
const getObjectBounds = __require("./utils/math.js").getObjectBounds;
const unionBounds = __require("./utils/math.js").unionBounds;
const clamp = __require("./utils/math.js").clamp;

exports.Minimap = class Minimap {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById('minimap-container');
    this.canvas = document.getElementById('canvas-minimap');
    this.ctx = this.canvas.getContext('2d');
    this.viewportBox = document.getElementById('minimap-viewport-box');
    this.btnToggle = document.getElementById('btn-toggle-minimap');

    this.isDragging = false;
    this.bounds = { x: -1000, y: -1000, width: 2000, height: 2000 };
    this.scale = 1;

    this._setupListeners();
    this.render();
  }

  _setupListeners() {
    this.btnToggle.addEventListener('click', () => {
      this.container.classList.toggle('minimized');
    });

    eventBus.on('state:changed', () => this.render());
    eventBus.on('viewport:changed', () => this.render());

    // Minimap Click & Drag Panning
    this.canvas.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this._panToMinimapCoord(e);
    });

    window.addEventListener('pointermove', (e) => {
      if (this.isDragging) {
        this._panToMinimapCoord(e);
      }
    });

    window.addEventListener('pointerup', () => {
      this.isDragging = false;
    });
  }

  _panToMinimapCoord(e) {
    const rect = this.canvas.getBoundingClientRect();
    const clickX = clamp(e.clientX - rect.left, 0, rect.width);
    const clickY = clamp(e.clientY - rect.top, 0, rect.height);

    const worldX = this.bounds.x + clickX / this.scale;
    const worldY = this.bounds.y + clickY / this.scale;

    const { clientWidth, clientHeight } = this.app.canvasContainer;
    const zoom = appState.viewport.zoom;

    const newPanX = clientWidth / 2 - worldX * zoom;
    const newPanY = clientHeight / 2 - worldY * zoom;

    appState.setViewport(newPanX, newPanY, zoom);
  }

  render() {
    const { ctx, canvas } = this;
    const objects = appState.getObjects().filter(o => o.visible !== false);
    const isDark = appState.settings.theme === 'dark';

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Compute enclosing bounding box of all objects + viewport
    const { clientWidth, clientHeight } = this.app.canvasContainer;
    const { panX, panY, zoom } = appState.viewport;

    const viewWorldX = -panX / zoom;
    const viewWorldY = -panY / zoom;
    const viewWorldW = clientWidth / zoom;
    const viewWorldH = clientHeight / zoom;

    const allBounds = objects.map(o => getObjectBounds(o));
    allBounds.push({ x: viewWorldX, y: viewWorldY, width: viewWorldW, height: viewWorldH });

    const totalBounds = unionBounds(allBounds);
    const padding = 100;
    this.bounds = {
      x: totalBounds.x - padding,
      y: totalBounds.y - padding,
      width: totalBounds.width + padding * 2,
      height: totalBounds.height + padding * 2
    };

    const scaleX = canvas.width / this.bounds.width;
    const scaleY = canvas.height / this.bounds.height;
    this.scale = Math.min(scaleX, scaleY);

    ctx.save();
    ctx.scale(this.scale, this.scale);
    ctx.translate(-this.bounds.x, -this.bounds.y);

    // Draw miniature objects
    for (const obj of objects) {
      const b = getObjectBounds(obj);
      ctx.fillStyle = obj.fill && obj.fill !== 'transparent' ? obj.fill : (obj.stroke || '#3b82f6');
      ctx.globalAlpha = 0.6;
      ctx.fillRect(b.x, b.y, b.width, b.height);
    }

    ctx.restore();

    // Position Viewport Rectangle
    const vpLeft = (viewWorldX - this.bounds.x) * this.scale;
    const vpTop = (viewWorldY - this.bounds.y) * this.scale;
    const vpWidth = viewWorldW * this.scale;
    const vpHeight = viewWorldH * this.scale;

    this.viewportBox.style.left = `${Math.max(0, vpLeft)}px`;
    this.viewportBox.style.top = `${Math.max(0, vpTop)}px`;
    this.viewportBox.style.width = `${Math.min(canvas.width, vpWidth)}px`;
    this.viewportBox.style.height = `${Math.min(canvas.height, vpHeight)}px`;
  }
}

};

modules["./ui/modals.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — Modal Dialogs Manager
   Keyboard Shortcuts, Board Manager, PNG Export Preview & Confirm Dialog
   ========================================================================== */

/* import { appState } from '../state/state.js'; */
const appState = __require("./state/state.js").appState;
/* import { storage } from '../state/storage.js'; */
const storage = __require("./state/storage.js").storage;
/* import { eventBus } from '../state/event-bus.js'; */
const eventBus = __require("./state/event-bus.js").eventBus;
/* import { generateId } from '../state/document-model.js'; */
const generateId = __require("./state/document-model.js").generateId;

exports.ModalManager = class ModalManager {
  constructor(app) {
    this.app = app;

    this.modalShortcuts = document.getElementById('modal-shortcuts');
    this.modalBoardManager = document.getElementById('modal-board-manager');
    this.modalExport = document.getElementById('modal-export');
    this.modalConfirm = document.getElementById('modal-confirm');

    // Export Options state
    this.exportOptions = {
      scale: 2,
      bg: 'canvas',
      scope: 'all'
    };

    this.confirmCallback = null;

    this._setupListeners();
  }

  _setupListeners() {
    // Close on backdrop or close button
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.dataset.modal;
        if (modalId) {
          document.getElementById(modalId)?.classList.add('hidden');
        } else {
          btn.closest('.modal-backdrop')?.classList.add('hidden');
        }
      });
    });

    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.add('hidden');
        }
      });
    });

    // Board Manager Actions
    document.getElementById('btn-bm-new-board')?.addEventListener('click', () => {
      this.app.createNewBoard();
      this.modalBoardManager.classList.add('hidden');
    });

    document.getElementById('btn-bm-import-board')?.addEventListener('click', () => {
      document.getElementById('json-file-input').click();
      this.modalBoardManager.classList.add('hidden');
    });

    // Export Segmented Controls
    document.getElementById('export-scale-group')?.addEventListener('click', (e) => {
      const seg = e.target.closest('.btn-segment');
      if (!seg) return;
      document.querySelectorAll('#export-scale-group .btn-segment').forEach(b => b.classList.remove('active'));
      seg.classList.add('active');
      this.exportOptions.scale = Number(seg.dataset.scale);
      this.updateExportPreview();
    });

    document.getElementById('export-bg-group')?.addEventListener('click', (e) => {
      const seg = e.target.closest('.btn-segment');
      if (!seg) return;
      document.querySelectorAll('#export-bg-group .btn-segment').forEach(b => b.classList.remove('active'));
      seg.classList.add('active');
      this.exportOptions.bg = seg.dataset.bg;
      this.updateExportPreview();
    });

    document.getElementById('export-scope-group')?.addEventListener('click', (e) => {
      const seg = e.target.closest('.btn-segment');
      if (!seg) return;
      document.querySelectorAll('#export-scope-group .btn-segment').forEach(b => b.classList.remove('active'));
      seg.classList.add('active');
      this.exportOptions.scope = seg.dataset.scope;
      this.updateExportPreview();
    });

    // Download PNG Button
    document.getElementById('btn-confirm-export-png')?.addEventListener('click', () => {
      this.downloadPNG();
    });

    // Confirm Dialog buttons
    document.getElementById('confirm-dialog-cancel')?.addEventListener('click', () => {
      this.modalConfirm.classList.add('hidden');
      this.confirmCallback = null;
    });

    document.getElementById('confirm-dialog-confirm')?.addEventListener('click', () => {
      this.modalConfirm.classList.add('hidden');
      if (this.confirmCallback) {
        this.confirmCallback();
        this.confirmCallback = null;
      }
    });
  }

  openBoardManager() {
    this.modalBoardManager.classList.remove('hidden');
    this.renderBoardList();
  }

  async renderBoardList() {
    const container = document.getElementById('bm-board-items');
    if (!container) return;

    const boards = await storage.listBoards();
    if (boards.length === 0) {
      container.innerHTML = `<div style="padding:20px; text-align:center; color:var(--text-muted);">No saved boards found</div>`;
      return;
    }

    container.innerHTML = boards.map(b => {
      const isCurrent = b.id === appState.board.id;
      const dateStr = new Date(b.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      return `
        <div class="bm-board-row ${isCurrent ? 'active' : ''}" data-id="${b.id}" style="display:flex; align-items:center; justify-content:space-between; padding:10px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); margin-bottom:6px; background:var(--bg-surface);">
          <div style="cursor:pointer; flex:1;" class="bm-switch-target">
            <div style="font-weight:600; font-size:var(--text-sm); color:var(--text-primary);">${b.title} ${isCurrent ? '<span style="font-size:10px; color:var(--accent-primary); margin-left:6px;">(Current)</span>' : ''}</div>
            <div style="font-size:var(--text-2xs); color:var(--text-muted);">${b.objectCount} objects • Last edited ${dateStr}</div>
          </div>
          <div style="display:flex; gap:6px;">
            <button class="btn-icon-xs bm-btn-dup" title="Duplicate Board" data-id="${b.id}">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            </button>
            <button class="btn-icon-xs bm-btn-del" title="Delete Board" data-id="${b.id}" style="color:var(--accent-danger);">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.bm-switch-target').forEach(el => {
      el.addEventListener('click', async () => {
        const id = el.closest('.bm-board-row').dataset.id;
        const board = await storage.loadBoard(id);
        if (board) {
          appState.loadBoardDocument(board, false);
          this.modalBoardManager.classList.add('hidden');
          eventBus.emit('toast:show', { message: `Loaded "${board.title}"`, type: 'info' });
        }
      });
    });

    container.querySelectorAll('.bm-btn-dup').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        await storage.duplicateBoard(id);
        this.renderBoardList();
        eventBus.emit('toast:show', { message: 'Board duplicated', type: 'info' });
      });
    });

    container.querySelectorAll('.bm-btn-del').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        this.openConfirmDialog('Delete Board', 'Are you sure you want to permanently delete this board?', async () => {
          await storage.deleteBoard(id);
          if (id === appState.board.id) {
            this.app.createNewBoard();
          } else {
            this.renderBoardList();
          }
          eventBus.emit('toast:show', { message: 'Board deleted', type: 'info' });
        });
      });
    });
  }

  openExportModal() {
    this.modalExport.classList.remove('hidden');
    this.updateExportPreview();
  }

  updateExportPreview() {
    const canvas = this.app.renderer.renderToExportCanvas(this.exportOptions);
    const imgEl = document.getElementById('export-preview-img');
    if (canvas && imgEl) {
      imgEl.src = canvas.toDataURL('image/png');
    }
  }

  downloadPNG() {
    const canvas = this.app.renderer.renderToExportCanvas(this.exportOptions);
    if (!canvas) {
      eventBus.emit('toast:show', { message: 'Nothing to export on canvas', type: 'error' });
      return;
    }

    const link = document.createElement('a');
    link.download = `${(appState.board.title || 'board').toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    this.modalExport.classList.add('hidden');
    eventBus.emit('toast:show', { message: 'Exported PNG image successfully', type: 'success' });
  }

  openConfirmDialog(title, message, onConfirm) {
    document.getElementById('confirm-dialog-title').textContent = title;
    document.getElementById('confirm-dialog-message').textContent = message;
    this.confirmCallback = onConfirm;
    this.modalConfirm.classList.remove('hidden');
  }
}

};

modules["./ui/properties-panel.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — Contextual Properties Panel
   Dynamically renders controls based on selected objects or canvas state
   ========================================================================== */

/* import { appState } from '../state/state.js'; */
const appState = __require("./state/state.js").appState;
/* import { eventBus } from '../state/event-bus.js'; */
const eventBus = __require("./state/event-bus.js").eventBus;
/* import { ICONS } from '../utils/icons.js'; */
const ICONS = __require("./utils/icons.js").ICONS;

exports.PropertiesPanel = class PropertiesPanel {
  constructor(app) {
    this.app = app;
    this.panel = document.getElementById('properties-panel');
    this.content = document.getElementById('properties-content');
    this.title = document.getElementById('prop-panel-title');
    this.btnCollapse = document.getElementById('btn-toggle-props-collapse');
    this.quickActionBar = document.getElementById('quick-action-bar');

    this._setupListeners();
    this.render();
  }

  _setupListeners() {
    this.btnCollapse.addEventListener('click', () => {
      this.panel.classList.toggle('collapsed');
      const isCollapsed = this.panel.classList.contains('collapsed');
      const minimap = document.getElementById('minimap-container');
      if (minimap) {
        minimap.classList.toggle('shifted', isCollapsed);
      }
      const topToggle = document.getElementById('btn-toggle-props');
      if (topToggle) {
        topToggle.classList.toggle('active', !isCollapsed);
        topToggle.setAttribute('aria-pressed', String(!isCollapsed));
      }
    });

    eventBus.on('selection:changed', () => {
      this.render();
      this.updateQuickActionBar();
    });

    eventBus.on('state:changed', () => {
      this.updateQuickActionBar();
    });

    eventBus.on('viewport:changed', () => {
      this.updateQuickActionBar();
    });

    this._bindQuickActions();
  }

  _bindQuickActions() {
    document.getElementById('qa-duplicate').addEventListener('click', () => appState.duplicateSelected());
    document.getElementById('qa-lock').addEventListener('click', () => appState.lockSelected());
    document.getElementById('qa-group').addEventListener('click', () => appState.groupSelected());
    document.getElementById('qa-bring-front').addEventListener('click', () => appState.bringToFront());
    document.getElementById('qa-delete').addEventListener('click', () => appState.deleteSelected());
  }

  updateQuickActionBar() {
    const selected = appState.getSelectedObjects();
    if (selected.length === 0 || appState.activeTool !== 'select') {
      this.quickActionBar.classList.add('hidden');
      return;
    }

    const bounds = appState.getSelectedBounds();
    if (!bounds) {
      this.quickActionBar.classList.add('hidden');
      return;
    }

    const { panX, panY, zoom } = appState.viewport;
    const screenX = (bounds.x + bounds.width / 2) * zoom + panX;
    const screenY = bounds.y * zoom + panY;

    // Clamp inside container
    const container = this.app.canvasContainer.getBoundingClientRect();
    const clampedX = Math.max(120, Math.min(container.width - 120, screenX));
    const clampedY = Math.max(40, screenY);

    this.quickActionBar.style.left = `${clampedX}px`;
    this.quickActionBar.style.top = `${clampedY}px`;
    this.quickActionBar.classList.remove('hidden');
  }

  render() {
    const selected = appState.getSelectedObjects();

    if (selected.length === 0) {
      this.title.textContent = 'Canvas Settings';
      this.renderCanvasProperties();
    } else if (selected.length === 1) {
      const obj = selected[0];
      this.title.textContent = this._formatTypeName(obj.type);
      this.renderSingleObjectProperties(obj);
    } else {
      this.title.textContent = `${selected.length} Objects Selected`;
      this.renderMultiSelectionProperties(selected);
    }
  }

  _formatTypeName(type) {
    return type.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  }

  /**
   * Render Canvas Level Properties (Grid, Snap, Theme, Defaults)
   */
  renderCanvasProperties() {
    const { gridVisible, gridType, snapEnabled, theme } = appState.settings;

    this.content.innerHTML = `
      <div class="prop-section">
        <span class="prop-section-title">Grid & Snapping</span>
        <div class="prop-row">
          <span class="prop-label">Grid Style</span>
          <select id="prop-grid-type" class="prop-select">
            <option value="dots" ${gridType === 'dots' ? 'selected' : ''}>Dots Pattern</option>
            <option value="lines" ${gridType === 'lines' ? 'selected' : ''}>Grid Lines</option>
            <option value="none" ${gridType === 'none' ? 'selected' : ''}>None (Blank)</option>
          </select>
        </div>
        <div class="prop-row">
          <span class="prop-label">Smart Snapping</span>
          <button id="prop-snap-toggle" class="btn-secondary" style="width:100%">
            ${snapEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>

      <div class="prop-section">
        <span class="prop-section-title">Canvas Theme</span>
        <div class="btn-group-segmented" id="prop-theme-segmented" style="width:100%">
          <button class="btn-segment ${theme === 'dark' ? 'active' : ''}" data-theme="dark">Dark Theme</button>
          <button class="btn-segment ${theme === 'light' ? 'active' : ''}" data-theme="light">Light Theme</button>
        </div>
      </div>

      <div class="prop-section">
        <span class="prop-section-title">Default Colors</span>
        <span class="prop-label">Default Accent</span>
        <div class="color-picker-grid" id="prop-default-colors">
          ${this._renderColorDots(['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6b7280'], appState.settings.defaultStrokeColor, 'custom-default-color')}
        </div>
      </div>
    `;

    // Listeners
    document.getElementById('prop-grid-type').addEventListener('change', (e) => {
      appState.settings.gridType = e.target.value;
      appState.settings.gridVisible = e.target.value !== 'none';
      this.app.renderer.requestRender();
    });

    document.getElementById('prop-snap-toggle').addEventListener('click', () => {
      appState.settings.snapEnabled = !appState.settings.snapEnabled;
      this.render();
    });

    document.getElementById('prop-theme-segmented').addEventListener('click', (e) => {
      const seg = e.target.closest('.btn-segment');
      if (seg && seg.dataset.theme) {
        appState.applyTheme(seg.dataset.theme);
        this.render();
      }
    });

    document.getElementById('prop-default-colors').addEventListener('click', (e) => {
      const dot = e.target.closest('.color-dot');
      if (dot && dot.dataset.color) {
        appState.settings.defaultStrokeColor = dot.dataset.color;
        this.render();
      }
    });

    document.getElementById('custom-default-color')?.addEventListener('input', (e) => {
      appState.settings.defaultStrokeColor = e.target.value;
      this.render();
    });
  }

  /**
   * Render Inspector for Single Object
   */
  renderSingleObjectProperties(obj) {
    const isDark = appState.settings.theme === 'dark';
    const isLocked = obj.locked;

    let html = `
      <div class="prop-section">
        <div class="prop-row">
          <span class="prop-label">Locked State</span>
          <button id="prop-btn-lock" class="btn-secondary" style="flex:1">
            ${isLocked ? 'Locked (Click to Unlock)' : 'Unlocked (Click to Lock)'}
          </button>
        </div>
      </div>
    `;

    // 1. Color Fills (if applicable)
    if (['rectangle', 'rounded-rectangle', 'ellipse', 'diamond', 'sticky'].includes(obj.type)) {
      const isSticky = obj.type === 'sticky';
      const fillPalette = isSticky
        ? ['#fef08a', '#bfdbfe', '#bbf7d0', '#fbcfe8', '#e9d5ff', '#fed7aa', '#334155']
        : ['transparent', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#22242b'];

      html += `
        <div class="prop-section">
          <span class="prop-section-title">Fill Color</span>
          <div class="color-picker-grid" id="prop-fill-colors">
            ${this._renderColorDots(fillPalette, obj.fill || 'transparent', 'custom-fill-color')}
          </div>
        </div>
      `;
    }

    // 2. Stroke / Border Colors
    if (!['text', 'sticky'].includes(obj.type)) {
      const strokePalette = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#f3f4f6', '#6b7280'];
      html += `
        <div class="prop-section">
          <span class="prop-section-title">Stroke Color</span>
          <div class="color-picker-grid" id="prop-stroke-colors">
            ${this._renderColorDots(strokePalette, obj.stroke || '#3b82f6', 'custom-stroke-color')}
          </div>
          
          <div class="prop-row" style="margin-top: 8px;">
            <span class="prop-label">Width</span>
            <div class="btn-group-segmented" id="prop-stroke-width-group">
              <button class="btn-segment ${obj.strokeWidth === 1 ? 'active' : ''}" data-width="1">1px</button>
              <button class="btn-segment ${obj.strokeWidth === 2 ? 'active' : ''}" data-width="2">2px</button>
              <button class="btn-segment ${obj.strokeWidth === 4 ? 'active' : ''}" data-width="4">4px</button>
              <button class="btn-segment ${obj.strokeWidth === 8 ? 'active' : ''}" data-width="8">8px</button>
            </div>
          </div>

          <div class="prop-row" style="margin-top: 6px;">
            <span class="prop-label">Style</span>
            <div class="btn-group-segmented" id="prop-stroke-style-group">
              <button class="btn-segment ${obj.strokeStyle === 'solid' ? 'active' : ''}" data-style="solid">Solid</button>
              <button class="btn-segment ${obj.strokeStyle === 'dashed' ? 'active' : ''}" data-style="dashed">Dashed</button>
              <button class="btn-segment ${obj.strokeStyle === 'dotted' ? 'active' : ''}" data-style="dotted">Dotted</button>
            </div>
          </div>
        </div>
      `;
    }

    // 3. Text Controls (if Text or Sticky)
    if (obj.type === 'text' || obj.type === 'sticky') {
      const textColors = ['#f3f4f6', '#111827', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#713f12'];
      html += `
        <div class="prop-section">
          <span class="prop-section-title">Typography</span>
          <div class="prop-row">
            <span class="prop-label">Font</span>
            <select id="prop-font-family" class="prop-select">
              <option value="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">Sans-Serif</option>
              <option value="ui-monospace, Menlo, Consolas, monospace">Monospace</option>
              <option value="Georgia, Cambria, 'Times New Roman', serif">Serif</option>
            </select>
          </div>

          <div class="prop-row">
            <span class="prop-label">Size</span>
            <div class="btn-group-segmented" id="prop-font-size-group">
              <button class="btn-segment ${obj.fontSize <= 14 ? 'active' : ''}" data-size="14">S</button>
              <button class="btn-segment ${obj.fontSize === 18 ? 'active' : ''}" data-size="18">M</button>
              <button class="btn-segment ${obj.fontSize === 24 ? 'active' : ''}" data-size="24">L</button>
              <button class="btn-segment ${obj.fontSize >= 32 ? 'active' : ''}" data-size="36">XL</button>
            </div>
          </div>

          <div class="prop-row">
            <span class="prop-label">Align</span>
            <div class="btn-group-segmented" id="prop-text-align-group">
              <button class="btn-segment ${obj.textAlign === 'left' ? 'active' : ''}" data-align="left">Left</button>
              <button class="btn-segment ${obj.textAlign === 'center' ? 'active' : ''}" data-align="center">Center</button>
              <button class="btn-segment ${obj.textAlign === 'right' ? 'active' : ''}" data-align="right">Right</button>
            </div>
          </div>

          <div class="color-picker-grid" id="prop-text-colors" style="margin-top: 8px;">
            ${this._renderColorDots(textColors, obj.color || '#f3f4f6', 'custom-text-color')}
          </div>
        </div>
      `;
    }

    // 4. Connector Controls
    if (obj.type === 'connector') {
      html += `
        <div class="prop-section">
          <span class="prop-section-title">Connector Routing</span>
          <div class="btn-group-segmented" id="prop-connector-routing" style="width:100%">
            <button class="btn-segment ${obj.routing === 'curved' ? 'active' : ''}" data-routing="curved">Curved</button>
            <button class="btn-segment ${obj.routing === 'stepped' ? 'active' : ''}" data-routing="stepped">Stepped</button>
            <button class="btn-segment ${obj.routing === 'straight' ? 'active' : ''}" data-routing="straight">Straight</button>
          </div>
        </div>
      `;
    }

    // 5. Opacity Slider & Corner Radius
    html += `
      <div class="prop-section">
        <span class="prop-section-title">Layout & Opacity</span>
        <div class="prop-row">
          <span class="prop-label">Opacity</span>
          <input type="range" id="prop-opacity" min="10" max="100" value="${Math.round((obj.opacity ?? 1) * 100)}" style="flex:1">
          <span id="prop-opacity-val" style="font-size:11px; width:30px; text-align:right;">${Math.round((obj.opacity ?? 1) * 100)}%</span>
        </div>
      </div>

      <div class="prop-section">
        <span class="prop-section-title">Arrange & Actions</span>
        <div class="prop-row">
          <button id="prop-bring-front" class="btn-secondary" style="flex:1">Bring Front</button>
          <button id="prop-send-back" class="btn-secondary" style="flex:1">Send Back</button>
        </div>
        <div class="prop-row" style="margin-top:4px;">
          <button id="prop-duplicate" class="btn-secondary" style="flex:1">Duplicate</button>
          <button id="prop-delete" class="btn-danger" style="flex:1">Delete</button>
        </div>
      </div>
    `;

    this.content.innerHTML = html;
    this._attachSingleObjectListeners(obj);
  }

  _attachSingleObjectListeners(obj) {
    document.getElementById('prop-btn-lock')?.addEventListener('click', () => appState.lockSelected());

    // Fill Colors
    document.getElementById('prop-fill-colors')?.addEventListener('click', (e) => {
      const dot = e.target.closest('.color-dot');
      if (dot && dot.dataset.color) {
        appState.updateObject(obj.id, { fill: dot.dataset.color }, true);
      }
    });

    document.getElementById('custom-fill-color')?.addEventListener('input', (e) => {
      appState.updateObject(obj.id, { fill: e.target.value }, true);
    });

    // Stroke Colors
    document.getElementById('prop-stroke-colors')?.addEventListener('click', (e) => {
      const dot = e.target.closest('.color-dot');
      if (dot && dot.dataset.color) {
        appState.updateObject(obj.id, { stroke: dot.dataset.color }, true);
      }
    });

    document.getElementById('custom-stroke-color')?.addEventListener('input', (e) => {
      appState.updateObject(obj.id, { stroke: e.target.value }, true);
    });

    // Stroke Width
    document.getElementById('prop-stroke-width-group')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-segment');
      if (btn && btn.dataset.width) {
        appState.updateObject(obj.id, { strokeWidth: Number(btn.dataset.width) }, true);
      }
    });

    // Stroke Style
    document.getElementById('prop-stroke-style-group')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-segment');
      if (btn && btn.dataset.style) {
        appState.updateObject(obj.id, { strokeStyle: btn.dataset.style }, true);
      }
    });

    // Font Family & Size
    document.getElementById('prop-font-family')?.addEventListener('change', (e) => {
      appState.updateObject(obj.id, { fontFamily: e.target.value }, true);
    });

    document.getElementById('prop-font-size-group')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-segment');
      if (btn && btn.dataset.size) {
        appState.updateObject(obj.id, { fontSize: Number(btn.dataset.size) }, true);
      }
    });

    document.getElementById('prop-text-align-group')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-segment');
      if (btn && btn.dataset.align) {
        appState.updateObject(obj.id, { textAlign: btn.dataset.align }, true);
      }
    });

    document.getElementById('prop-text-colors')?.addEventListener('click', (e) => {
      const dot = e.target.closest('.color-dot');
      if (dot && dot.dataset.color) {
        appState.updateObject(obj.id, { color: dot.dataset.color }, true);
      }
    });

    document.getElementById('custom-text-color')?.addEventListener('input', (e) => {
      appState.updateObject(obj.id, { color: e.target.value }, true);
    });

    // Connector Routing
    document.getElementById('prop-connector-routing')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-segment');
      if (btn && btn.dataset.routing) {
        appState.updateObject(obj.id, { routing: btn.dataset.routing }, true);
      }
    });

    // Opacity
    const opacityInput = document.getElementById('prop-opacity');
    if (opacityInput) {
      opacityInput.addEventListener('input', (e) => {
        const val = Number(e.target.value) / 100;
        document.getElementById('prop-opacity-val').textContent = `${e.target.value}%`;
        appState.updateObject(obj.id, { opacity: val }, false);
      });
      opacityInput.addEventListener('change', (e) => {
        const val = Number(e.target.value) / 100;
        appState.updateObject(obj.id, { opacity: val }, true);
      });
    }

    // Actions
    document.getElementById('prop-bring-front')?.addEventListener('click', () => appState.bringToFront());
    document.getElementById('prop-send-back')?.addEventListener('click', () => appState.sendToBack());
    document.getElementById('prop-duplicate')?.addEventListener('click', () => appState.duplicateSelected());
    document.getElementById('prop-delete')?.addEventListener('click', () => appState.deleteSelected());
  }

  /**
   * Render Multi-Selection Inspector
   */
  renderMultiSelectionProperties(selected) {
    this.content.innerHTML = `
      <div class="prop-section">
        <span class="prop-section-title">Alignment</span>
        <div class="prop-row">
          <button class="btn-secondary" id="align-left" style="flex:1" title="Align Left">Left</button>
          <button class="btn-secondary" id="align-center" style="flex:1" title="Align Horizontal Center">Center</button>
          <button class="btn-secondary" id="align-right" style="flex:1" title="Align Right">Right</button>
        </div>
        <div class="prop-row" style="margin-top:4px;">
          <button class="btn-secondary" id="align-top" style="flex:1" title="Align Top">Top</button>
          <button class="btn-secondary" id="align-middle" style="flex:1" title="Align Vertical Middle">Middle</button>
          <button class="btn-secondary" id="align-bottom" style="flex:1" title="Align Bottom">Bottom</button>
        </div>
      </div>

      <div class="prop-section">
        <span class="prop-section-title">Distribution</span>
        <div class="prop-row">
          <button class="btn-secondary" id="distribute-h" style="flex:1">Distribute Horizontally</button>
          <button class="btn-secondary" id="distribute-v" style="flex:1">Distribute Vertically</button>
        </div>
      </div>

      <div class="prop-section">
        <span class="prop-section-title">Group & Arrange</span>
        <div class="prop-row">
          <button class="btn-secondary" id="multi-group" style="flex:1">Group</button>
          <button class="btn-secondary" id="multi-ungroup" style="flex:1">Ungroup</button>
        </div>
        <div class="prop-row" style="margin-top:4px;">
          <button class="btn-secondary" id="multi-front" style="flex:1">Bring Front</button>
          <button class="btn-secondary" id="multi-back" style="flex:1">Send Back</button>
        </div>
        <div class="prop-row" style="margin-top:4px;">
          <button class="btn-secondary" id="multi-duplicate" style="flex:1">Duplicate</button>
          <button class="btn-danger" id="multi-delete" style="flex:1">Delete All</button>
        </div>
      </div>
    `;

    document.getElementById('align-left').addEventListener('click', () => appState.alignSelected('left'));
    document.getElementById('align-center').addEventListener('click', () => appState.alignSelected('center'));
    document.getElementById('align-right').addEventListener('click', () => appState.alignSelected('right'));
    document.getElementById('align-top').addEventListener('click', () => appState.alignSelected('top'));
    document.getElementById('align-middle').addEventListener('click', () => appState.alignSelected('middle'));
    document.getElementById('align-bottom').addEventListener('click', () => appState.alignSelected('bottom'));

    document.getElementById('distribute-h').addEventListener('click', () => appState.distributeSelected('horizontal'));
    document.getElementById('distribute-v').addEventListener('click', () => appState.distributeSelected('vertical'));

    document.getElementById('multi-group').addEventListener('click', () => appState.groupSelected());
    document.getElementById('multi-ungroup').addEventListener('click', () => appState.ungroupSelected());
    document.getElementById('multi-front').addEventListener('click', () => appState.bringToFront());
    document.getElementById('multi-back').addEventListener('click', () => appState.sendToBack());
    document.getElementById('multi-duplicate').addEventListener('click', () => appState.duplicateSelected());
    document.getElementById('multi-delete').addEventListener('click', () => appState.deleteSelected());
  }

  _renderColorDots(colors, activeColor, customInputId = '') {
    const dotsHtml = colors.map(c => `
      <div class="color-dot ${c === 'transparent' ? 'transparent-dot' : ''} ${c === activeColor ? 'active' : ''}"
           data-color="${c}"
           style="${c !== 'transparent' ? `background-color: ${c};` : ''}"
           title="${c}">
      </div>
    `).join('');

    if (customInputId) {
      const isCustomHex = activeColor && activeColor.startsWith('#') && !colors.includes(activeColor);
      return dotsHtml + `
        <label class="color-dot custom-picker-label ${isCustomHex ? 'active' : ''}" title="Custom Color Picker" style="overflow:hidden; display:flex; align-items:center; justify-content:center; background: ${isCustomHex ? activeColor : 'var(--bg-surface-hover)'}; border: 1px dashed var(--border-strong);">
          <input type="color" id="${customInputId}" value="${activeColor && activeColor.startsWith('#') ? activeColor : '#3b82f6'}" style="opacity:0; position:absolute; width:100%; height:100%; cursor:pointer;">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        </label>
      `;
    }

    return dotsHtml;
  }
}

};

modules["./ui/rulers.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — Interactive Rulers
   Top & Left Coordinate Rulers with Live Cursor Tracking
   ========================================================================== */

/* import { appState } from '../state/state.js'; */
const appState = __require("./state/state.js").appState;
/* import { eventBus } from '../state/event-bus.js'; */
const eventBus = __require("./state/event-bus.js").eventBus;

exports.Rulers = class Rulers {
  constructor(app) {
    this.app = app;
    this.rulerTop = document.getElementById('ruler-top');
    this.rulerLeft = document.getElementById('ruler-left');
    this.ctxTop = this.rulerTop.getContext('2d');
    this.ctxLeft = this.rulerLeft.getContext('2d');

    this.cursorX = 0;
    this.cursorY = 0;

    this._setupListeners();
    this.resize();
  }

  _setupListeners() {
    eventBus.on('viewport:changed', () => this.render());
    eventBus.on('settings:changed', () => this.render());

    window.addEventListener('pointermove', (e) => {
      if (!appState.settings.rulersVisible) return;
      const rect = this.app.canvasContainer.getBoundingClientRect();
      this.cursorX = e.clientX - rect.left;
      this.cursorY = e.clientY - rect.top;
      this.render();
    });
  }

  resize() {
    const parent = this.app.canvasContainer;
    const dpr = window.devicePixelRatio || 1;

    this.rulerTop.width = (parent.clientWidth - 20) * dpr;
    this.rulerTop.height = 20 * dpr;
    this.ctxTop.setTransform(1, 0, 0, 1, 0, 0);
    this.ctxTop.scale(dpr, dpr);

    this.rulerLeft.width = 20 * dpr;
    this.rulerLeft.height = (parent.clientHeight - 20) * dpr;
    this.ctxLeft.setTransform(1, 0, 0, 1, 0, 0);
    this.ctxLeft.scale(dpr, dpr);

    this.render();
  }

  render() {
    if (!appState.settings.rulersVisible) return;

    const { panX, panY, zoom } = appState.viewport;
    const isDark = appState.settings.theme === 'dark';

    const bg = isDark ? '#16171b' : '#fafbfc';
    const textCol = isDark ? '#6b7280' : '#9ca3af';
    const tickCol = isDark ? '#323642' : '#d1d5db';
    const guideCol = isDark ? '#3b82f6' : '#2563eb';

    const w = this.rulerTop.width / (window.devicePixelRatio || 1);
    const h = this.rulerLeft.height / (window.devicePixelRatio || 1);

    // 1. Top Ruler
    this.ctxTop.fillStyle = bg;
    this.ctxTop.fillRect(0, 0, w, 20);

    let step = 100;
    while (step * zoom < 40) step *= 2;
    while (step * zoom > 150) step /= 2;

    const startX = (panX - 20) % (step * zoom);
    const startWorldX = Math.floor((-panX + 20) / (step * zoom)) * step;

    this.ctxTop.font = '9px monospace';
    this.ctxTop.fillStyle = textCol;
    this.ctxTop.strokeStyle = tickCol;
    this.ctxTop.lineWidth = 1;

    let index = 0;
    for (let x = startX; x < w; x += step * zoom) {
      const worldVal = startWorldX + index * step;
      this.ctxTop.beginPath();
      this.ctxTop.moveTo(Math.floor(x) + 0.5, 10);
      this.ctxTop.lineTo(Math.floor(x) + 0.5, 20);
      this.ctxTop.stroke();

      if (worldVal % (step * 2) === 0) {
        this.ctxTop.fillText(`${worldVal}`, x + 3, 9);
      }
      index++;
    }

    // Top Cursor Hairline
    if (this.cursorX >= 20 && this.cursorX <= w + 20) {
      this.ctxTop.strokeStyle = guideCol;
      this.ctxTop.beginPath();
      this.ctxTop.moveTo(this.cursorX - 20, 0);
      this.ctxTop.lineTo(this.cursorX - 20, 20);
      this.ctxTop.stroke();
    }

    // 2. Left Ruler
    this.ctxLeft.fillStyle = bg;
    this.ctxLeft.fillRect(0, 0, 20, h);

    const startY = (panY - 20) % (step * zoom);
    const startWorldY = Math.floor((-panY + 20) / (step * zoom)) * step;

    this.ctxLeft.font = '9px monospace';
    this.ctxLeft.fillStyle = textCol;
    this.ctxLeft.strokeStyle = tickCol;
    this.ctxLeft.lineWidth = 1;

    let yIndex = 0;
    for (let y = startY; y < h; y += step * zoom) {
      const worldVal = startWorldY + yIndex * step;
      this.ctxLeft.beginPath();
      this.ctxLeft.moveTo(10, Math.floor(y) + 0.5);
      this.ctxLeft.lineTo(20, Math.floor(y) + 0.5);
      this.ctxLeft.stroke();

      if (worldVal % (step * 2) === 0) {
        this.ctxLeft.save();
        this.ctxLeft.translate(9, y + 3);
        this.ctxLeft.rotate(Math.PI / 2);
        this.ctxLeft.fillText(`${worldVal}`, 0, 0);
        this.ctxLeft.restore();
      }
      yIndex++;
    }

    // Left Cursor Hairline
    if (this.cursorY >= 20 && this.cursorY <= h + 20) {
      this.ctxLeft.strokeStyle = guideCol;
      this.ctxLeft.beginPath();
      this.ctxLeft.moveTo(0, this.cursorY - 20);
      this.ctxLeft.lineTo(20, this.cursorY - 20);
      this.ctxLeft.stroke();
    }
  }
}

};

modules["./ui/sample-board.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — Production Starter Board Template
   Realistic Distributed Systems Architecture, ADR Brainstorming & Metric Mockup
   ========================================================================== */

/* import { createCanvasObject } from '../state/document-model.js'; */
const createCanvasObject = __require("./state/document-model.js").createCanvasObject;

exports.createSampleBoard = createSampleBoard;
function createSampleBoard() {
  const objects = [];

  // --- Title & Header Section ---
  objects.push(createCanvasObject('text', {
    id: 'hdr_title',
    x: -520,
    y: -380,
    text: 'Nexus Engine — Event Ingestion & Stream Processing Pipeline',
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3b82f6',
    width: 780,
    height: 38
  }));

  objects.push(createCanvasObject('text', {
    id: 'hdr_subtitle',
    x: -520,
    y: -340,
    text: 'Architecture Review • Sprint 42 • Target SLA: P99 < 35ms @ 250k events/sec • Lead: Elena Rostova (Staff Architect)',
    fontSize: 13,
    color: '#9ca3af',
    width: 820,
    height: 24
  }));

  // --- System Architecture Diagram ---

  // 1. Edge Layer
  const boxEdge = createCanvasObject('rounded-rectangle', {
    id: 'arch_edge',
    x: -520,
    y: -240,
    width: 150,
    height: 72,
    fill: 'rgba(59, 130, 246, 0.08)',
    stroke: '#3b82f6',
    strokeWidth: 2,
    cornerRadius: 8
  });
  objects.push(boxEdge);

  objects.push(createCanvasObject('text', {
    id: 'txt_edge',
    x: -510,
    y: -222,
    text: 'Edge Ingress\n(Envoy Proxy / TLS)',
    fontSize: 12,
    textAlign: 'center',
    width: 130,
    height: 34
  }));

  // 2. Auth & Rate Limiter
  const boxAuth = createCanvasObject('diamond', {
    id: 'arch_auth',
    x: -300,
    y: -254,
    width: 120,
    height: 100,
    fill: 'rgba(245, 158, 11, 0.08)',
    stroke: '#f59e0b',
    strokeWidth: 2
  });
  objects.push(boxAuth);

  objects.push(createCanvasObject('text', {
    id: 'txt_auth',
    x: -285,
    y: -218,
    text: 'JWT Token\nRate Limiter',
    fontSize: 11,
    textAlign: 'center',
    width: 90,
    height: 30
  }));

  // 3. Kafka Stream Cluster
  const boxKafka = createCanvasObject('rounded-rectangle', {
    id: 'arch_kafka',
    x: -110,
    y: -240,
    width: 170,
    height: 72,
    fill: 'rgba(16, 185, 129, 0.08)',
    stroke: '#10b981',
    strokeWidth: 2,
    cornerRadius: 8
  });
  objects.push(boxKafka);

  objects.push(createCanvasObject('text', {
    id: 'txt_kafka',
    x: -100,
    y: -222,
    text: 'Kafka Event Bus\n(32 Partitions / Snappy)',
    fontSize: 12,
    textAlign: 'center',
    width: 150,
    height: 34
  }));

  // 4. Processing Workers
  const boxWorkers = createCanvasObject('rounded-rectangle', {
    id: 'arch_workers',
    x: 130,
    y: -240,
    width: 170,
    height: 72,
    fill: 'rgba(139, 92, 246, 0.08)',
    stroke: '#8b5cf6',
    strokeWidth: 2,
    cornerRadius: 8
  });
  objects.push(boxWorkers);

  objects.push(createCanvasObject('text', {
    id: 'txt_workers',
    x: 140,
    y: -222,
    text: 'Flink Stream Engine\n(Stateful Aggregations)',
    fontSize: 12,
    textAlign: 'center',
    width: 150,
    height: 34
  }));

  // 5. ClickHouse OLAP
  const boxOlap = createCanvasObject('ellipse', {
    id: 'arch_olap',
    x: 370,
    y: -290,
    width: 150,
    height: 70,
    fill: 'rgba(236, 72, 153, 0.08)',
    stroke: '#ec4899',
    strokeWidth: 2
  });
  objects.push(boxOlap);

  objects.push(createCanvasObject('text', {
    id: 'txt_olap',
    x: 380,
    y: -270,
    text: 'ClickHouse OLAP\n(Time-Series Analytics)',
    fontSize: 11,
    textAlign: 'center',
    width: 130,
    height: 30
  }));

  // 6. Redis Cache
  const boxRedis = createCanvasObject('ellipse', {
    id: 'arch_redis',
    x: 370,
    y: -190,
    width: 150,
    height: 70,
    fill: 'rgba(239, 68, 68, 0.08)',
    stroke: '#ef4444',
    strokeWidth: 2
  });
  objects.push(boxRedis);

  objects.push(createCanvasObject('text', {
    id: 'txt_redis',
    x: 380,
    y: -170,
    text: 'Redis Cluster\n(Realtime Counters)',
    fontSize: 11,
    textAlign: 'center',
    width: 130,
    height: 30
  }));

  // --- Dynamic Connectors ---
  objects.push(createCanvasObject('connector', {
    id: 'c_edge_auth',
    x: -370,
    y: -204,
    x2: -300,
    y2: -204,
    stroke: '#3b82f6',
    strokeWidth: 2,
    startBinding: { elementId: 'arch_edge', anchor: 'right' },
    endBinding: { elementId: 'arch_auth', anchor: 'left' }
  }));

  objects.push(createCanvasObject('connector', {
    id: 'c_auth_kafka',
    x: -180,
    y: -204,
    x2: -110,
    y2: -204,
    stroke: '#f59e0b',
    strokeWidth: 2,
    startBinding: { elementId: 'arch_auth', anchor: 'right' },
    endBinding: { elementId: 'arch_kafka', anchor: 'left' }
  }));

  objects.push(createCanvasObject('connector', {
    id: 'c_kafka_workers',
    x: 60,
    y: -204,
    x2: 130,
    y2: -204,
    stroke: '#10b981',
    strokeWidth: 2,
    startBinding: { elementId: 'arch_kafka', anchor: 'right' },
    endBinding: { elementId: 'arch_workers', anchor: 'left' }
  }));

  objects.push(createCanvasObject('connector', {
    id: 'c_workers_olap',
    x: 300,
    y: -204,
    x2: 370,
    y2: -255,
    stroke: '#8b5cf6',
    strokeWidth: 2,
    routing: 'curved',
    startBinding: { elementId: 'arch_workers', anchor: 'right' },
    endBinding: { elementId: 'arch_olap', anchor: 'left' }
  }));

  objects.push(createCanvasObject('connector', {
    id: 'c_workers_redis',
    x: 300,
    y: -204,
    x2: 370,
    y2: -155,
    stroke: '#8b5cf6',
    strokeWidth: 2,
    routing: 'curved',
    startBinding: { elementId: 'arch_workers', anchor: 'right' },
    endBinding: { elementId: 'arch_redis', anchor: 'left' }
  }));

  // --- Highlighter Annotations on SLA ---
  objects.push(createCanvasObject('highlighter', {
    id: 'hl_sla',
    x: -525,
    y: -330,
    stroke: '#3b82f6',
    strokeWidth: 18,
    opacity: 0.22,
    points: [
      { x: -525, y: -330 },
      { x: -280, y: -330 },
      { x: 200, y: -330 }
    ]
  }));

  // --- ADR & Architecture Decision Sticky Notes ---
  objects.push(createCanvasObject('sticky', {
    id: 'st_adr1',
    x: -520,
    y: -70,
    width: 170,
    height: 160,
    fill: '#fef08a',
    color: '#713f12',
    text: '📌 ADR-042: Kafka Partitions\n\nConfigured 32 partitions per topic with consistent hashing on tenant_id to prevent partition skew during traffic spikes.\n\nApproved: SRE Team'
  }));

  objects.push(createCanvasObject('sticky', {
    id: 'st_adr2',
    x: -320,
    y: -70,
    width: 170,
    height: 160,
    fill: '#bfdbfe',
    color: '#1e3a8a',
    text: '⚡ Latency Target Budget\n\n• TLS Handshake: <10ms\n• Envoy Ingress: <3ms\n• Kafka Publish: <8ms\n• Flink Window: <12ms\n\nTotal Budget: P99 < 35ms'
  }));

  objects.push(createCanvasObject('sticky', {
    id: 'st_adr3',
    x: -120,
    y: -70,
    width: 170,
    height: 160,
    fill: '#bbf7d0',
    color: '#14532d',
    text: '🛡️ Fallback Dead-Letter\n\nAny malformed JSON payload automatically routes to S3 DLQ bucket with 14-day retention for replay.\n\nOwner: Marcus Vance'
  }));

  objects.push(createCanvasObject('sticky', {
    id: 'st_adr4',
    x: 80,
    y: -70,
    width: 170,
    height: 160,
    fill: '#fbcfe8',
    color: '#831843',
    text: '🚀 Sprint 42 Milestones\n\n1. Deploy ClickHouse 24.3\n2. Run 300k RPS soak test\n3. Finalize Prometheus alerts\n4. Update Runbook docs'
  }));

  // --- Real-time Metrics Card Mockup (Wireframe Container) ---
  const boxCard = createCanvasObject('rounded-rectangle', {
    id: 'wf_card',
    x: 280,
    y: -70,
    width: 240,
    height: 160,
    fill: 'rgba(255, 255, 255, 0.03)',
    stroke: '#3b82f6',
    strokeWidth: 1.5,
    cornerRadius: 8
  });
  objects.push(boxCard);

  objects.push(createCanvasObject('text', {
    id: 'txt_card_title',
    x: 295,
    y: -55,
    text: 'Cluster Telemetry (Live)',
    fontSize: 13,
    fontWeight: 'bold',
    color: '#f3f4f6',
    width: 210,
    height: 20
  }));

  objects.push(createCanvasObject('text', {
    id: 'txt_card_stats',
    x: 295,
    y: -25,
    text: 'Throughput:  248,190 req/s\nP99 Latency: 22.4 ms\nError Rate:  0.0014%\nActive Nodes: 16 / 16 Healthy',
    fontSize: 11,
    fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
    color: '#10b981',
    lineHeight: 1.6,
    width: 210,
    height: 80
  }));

  return {
    id: 'sample_nexus_pipeline',
    title: 'Nexus Stream Architecture Review',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    viewport: {
      panX: 580,
      panY: 420,
      zoom: 1.0
    },
    settings: {
      gridVisible: true,
      gridType: 'dots',
      snapEnabled: true,
      rulersVisible: false,
      theme: 'dark'
    },
    objects
  };
}

};

modules["./ui/toast.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — Toast Notification System
   ========================================================================== */

/* import { eventBus } from '../state/event-bus.js'; */
const eventBus = __require("./state/event-bus.js").eventBus;
/* import { ICONS } from '../utils/icons.js'; */
const ICONS = __require("./utils/icons.js").ICONS;

exports.ToastManager = class ToastManager {
  constructor() {
    this.container = document.getElementById('toast-container');
    this._setupListeners();
  }

  _setupListeners() {
    eventBus.on('toast:show', ({ message, type = 'info', duration = 3200 }) => {
      this.show(message, type, duration);
    });
  }

  show(message, type = 'info', duration = 3200) {
    if (!this.container) return;

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;

    let iconHtml = ICONS.info;
    if (type === 'success') iconHtml = ICONS.check;
    else if (type === 'error') iconHtml = ICONS.error;

    toast.innerHTML = `
      <span class="toast-icon">${iconHtml}</span>
      <span class="toast-message">${message}</span>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'all 200ms ease';
      setTimeout(() => {
        if (toast.parentElement) {
          this.container.removeChild(toast);
        }
      }, 200);
    }, duration);
  }
}

};

modules["./ui/toolbar.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — Toolbar UI
   Top Header Bar & Left Floating Tool Rail Controller
   ========================================================================== */

/* import { appState } from '../state/state.js'; */
const appState = __require("./state/state.js").appState;
/* import { eventBus } from '../state/event-bus.js'; */
const eventBus = __require("./state/event-bus.js").eventBus;

exports.Toolbar = class Toolbar {
  constructor(app) {
    this.app = app;
    this._bindElements();
    this._setupListeners();
  }

  _bindElements() {
    // Board title
    this.boardNameInput = document.getElementById('board-name-input');
    this.btnBoardMenu = document.getElementById('btn-board-menu');
    this.boardDropdown = document.getElementById('board-dropdown');

    // Undo / Redo
    this.btnUndo = document.getElementById('btn-undo');
    this.btnRedo = document.getElementById('btn-redo');

    // Zoom
    this.btnZoomOut = document.getElementById('btn-zoom-out');
    this.btnZoomIn = document.getElementById('btn-zoom-in');
    this.btnZoomLevel = document.getElementById('btn-zoom-level');
    this.zoomText = document.getElementById('zoom-text');
    this.btnZoomFit = document.getElementById('btn-zoom-fit');
    this.zoomDropdown = document.getElementById('zoom-dropdown');

    // View Toggles
    this.btnToggleGrid = document.getElementById('btn-toggle-grid');
    this.btnToggleSnap = document.getElementById('btn-toggle-snap');
    this.btnToggleRulers = document.getElementById('btn-toggle-rulers');
    this.btnToggleLayers = document.getElementById('btn-toggle-layers');
    this.btnToggleProps = document.getElementById('btn-toggle-props');
    this.btnThemeToggle = document.getElementById('btn-theme-toggle');
    this.btnShortcutsHelp = document.getElementById('btn-shortcuts-help');
    this.btnCommandPalette = document.getElementById('btn-command-palette');
    this.btnExportMenu = document.getElementById('btn-export-menu');
    this.exportDropdown = document.getElementById('export-dropdown');

    // Tool rail buttons
    this.toolButtons = document.querySelectorAll('.tool-btn[data-tool]');
    this.btnInsertImage = document.getElementById('btn-insert-image');
    this.imageFileInput = document.getElementById('image-file-input');
  }

  _setupListeners() {
    // Board Name Rename
    this.boardNameInput.addEventListener('change', (e) => {
      appState.board.title = e.target.value.trim() || 'Untitled Board';
      appState.board.updatedAt = Date.now();
      eventBus.emit('board:renamed', appState.board);
      eventBus.emit('toast:show', { message: 'Board renamed', type: 'info' });
    });

    // Undo / Redo Buttons
    this.btnUndo.addEventListener('click', () => appState.undo());
    this.btnRedo.addEventListener('click', () => appState.redo());

    eventBus.on('history:changed', ({ canUndo, canRedo }) => {
      this.btnUndo.disabled = !canUndo;
      this.btnRedo.disabled = !canRedo;
    });

    // Zoom Buttons
    this.btnZoomIn.addEventListener('click', () => {
      const { clientWidth, clientHeight } = this.app.canvasContainer;
      appState.zoomAt(clientWidth / 2, clientHeight / 2, 1.25);
    });

    this.btnZoomOut.addEventListener('click', () => {
      const { clientWidth, clientHeight } = this.app.canvasContainer;
      appState.zoomAt(clientWidth / 2, clientHeight / 2, 0.8);
    });

    this.btnZoomFit.addEventListener('click', () => {
      const { clientWidth, clientHeight } = this.app.canvasContainer;
      appState.zoomToFit(clientWidth, clientHeight);
    });

    this.btnZoomLevel.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = this.zoomDropdown.classList.toggle('hidden');
      this.btnZoomLevel.setAttribute('aria-expanded', String(!isHidden));
    });

    eventBus.on('viewport:changed', (viewport) => {
      this.zoomText.textContent = `${Math.round(viewport.zoom * 100)}%`;
    });

    // Zoom Dropdown Items
    this.zoomDropdown.addEventListener('click', (e) => {
      const item = e.target.closest('.dropdown-item');
      if (!item) return;
      const action = item.dataset.action;
      const { clientWidth, clientHeight } = this.app.canvasContainer;

      if (action === 'zoom-reset') appState.setViewport(clientWidth / 2, clientHeight / 2, 1.0);
      else if (action === 'zoom-fit') appState.zoomToFit(clientWidth, clientHeight);
      else if (action === 'zoom-selection') appState.zoomToSelection(clientWidth, clientHeight);
      else if (action === 'zoom-50') appState.zoomAt(clientWidth / 2, clientHeight / 2, 0.5 / appState.viewport.zoom);
      else if (action === 'zoom-100') appState.zoomAt(clientWidth / 2, clientHeight / 2, 1.0 / appState.viewport.zoom);
      else if (action === 'zoom-200') appState.zoomAt(clientWidth / 2, clientHeight / 2, 2.0 / appState.viewport.zoom);
      else if (action === 'zoom-400') appState.zoomAt(clientWidth / 2, clientHeight / 2, 4.0 / appState.viewport.zoom);

      this.zoomDropdown.classList.add('hidden');
      this.btnZoomLevel.setAttribute('aria-expanded', 'false');
    });

    // Tool Rail Switching
    this.toolButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.dataset.tool;
        appState.setActiveTool(tool);
      });
    });

    eventBus.on('tool:changed', (toolName) => {
      this.toolButtons.forEach(btn => {
        const isActive = btn.dataset.tool === toolName;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
      });
    });

    // Insert Image Trigger
    this.btnInsertImage.addEventListener('click', () => {
      this.imageFileInput.click();
    });

    this.imageFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.app.insertImageFile(file);
      }
      this.imageFileInput.value = '';
    });

    // View Toggles
    this.btnToggleGrid.addEventListener('click', () => {
      appState.settings.gridVisible = !appState.settings.gridVisible;
      this.btnToggleGrid.classList.toggle('active', appState.settings.gridVisible);
      this.btnToggleGrid.setAttribute('aria-pressed', String(appState.settings.gridVisible));
      appState.applyTheme(appState.settings.theme);
      this.app.renderer.requestRender();
    });

    this.btnToggleSnap.addEventListener('click', () => {
      appState.settings.snapEnabled = !appState.settings.snapEnabled;
      this.btnToggleSnap.classList.toggle('active', appState.settings.snapEnabled);
      this.btnToggleSnap.setAttribute('aria-pressed', String(appState.settings.snapEnabled));
      eventBus.emit('toast:show', {
        message: appState.settings.snapEnabled ? 'Snapping enabled' : 'Snapping disabled',
        type: 'info'
      });
    });

    this.btnToggleRulers.addEventListener('click', () => {
      appState.settings.rulersVisible = !appState.settings.rulersVisible;
      this.btnToggleRulers.classList.toggle('active', appState.settings.rulersVisible);
      this.btnToggleRulers.setAttribute('aria-pressed', String(appState.settings.rulersVisible));
      document.body.classList.toggle('show-rulers', appState.settings.rulersVisible);
      this.app.renderer.resize();
    });

    this.btnToggleLayers.addEventListener('click', () => {
      const layersPanel = document.getElementById('layers-panel');
      const isHidden = layersPanel.classList.toggle('hidden');
      this.btnToggleLayers.classList.toggle('active', !isHidden);
      this.btnToggleLayers.setAttribute('aria-pressed', String(!isHidden));
    });

    // Properties Inspector Topbar Toggle
    this.btnToggleProps?.addEventListener('click', () => {
      const propsPanel = document.getElementById('properties-panel');
      const isCollapsed = propsPanel.classList.toggle('collapsed');
      this.btnToggleProps.classList.toggle('active', !isCollapsed);
      this.btnToggleProps.setAttribute('aria-pressed', String(!isCollapsed));
      const minimap = document.getElementById('minimap-container');
      if (minimap) {
        minimap.classList.toggle('shifted', isCollapsed);
      }
    });

    this.btnThemeToggle.addEventListener('click', () => {
      const newTheme = appState.settings.theme === 'dark' ? 'light' : 'dark';
      appState.applyTheme(newTheme);
      this.app.renderer.requestRender();
    });

    this.btnShortcutsHelp.addEventListener('click', () => {
      document.getElementById('modal-shortcuts').classList.remove('hidden');
    });

    this.btnCommandPalette.addEventListener('click', () => {
      this.app.commandPalette.open();
    });

    // Export Dropdown
    this.btnExportMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = this.exportDropdown.classList.toggle('hidden');
      this.btnExportMenu.setAttribute('aria-expanded', String(!isHidden));
    });

    this.exportDropdown.addEventListener('click', (e) => {
      const item = e.target.closest('.dropdown-item');
      if (!item) return;
      const action = item.dataset.action;

      if (action === 'export-png') {
        this.app.modals.openExportModal();
      } else if (action === 'export-svg') {
        this.app.exportBoardSVG();
      } else if (action === 'export-json') {
        this.app.exportBoardJSON();
      } else if (action === 'import-json') {
        document.getElementById('json-file-input').click();
      } else if (action === 'print-canvas') {
        window.print();
      }
      this.exportDropdown.classList.add('hidden');
      this.btnExportMenu.setAttribute('aria-expanded', 'false');
    });

    // Board Dropdown Trigger
    this.btnBoardMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = this.boardDropdown.classList.toggle('hidden');
      this.btnBoardMenu.setAttribute('aria-expanded', String(!isHidden));
      this.app.updateBoardListMenu();
    });

    // Board Dropdown Static Action Items (Manage Boards, Duplicate Board)
    this.boardDropdown.addEventListener('click', async (e) => {
      const item = e.target.closest('.dropdown-item[data-action]');
      if (!item) return;
      const action = item.dataset.action;

      if (action === 'manage-boards') {
        this.app.modals.openBoardManager();
        this.boardDropdown.classList.add('hidden');
        this.btnBoardMenu.setAttribute('aria-expanded', 'false');
      } else if (action === 'duplicate-board') {
        try {
          const dup = await this.app.duplicateCurrentBoard();
          this.boardDropdown.classList.add('hidden');
          this.btnBoardMenu.setAttribute('aria-expanded', 'false');
        } catch (err) {
          console.error(err);
        }
      }
    });

    // Global Click to close open dropdowns
    window.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown-menu') && !e.target.closest('.btn-pill') && !e.target.closest('#btn-export-menu') && !e.target.closest('#btn-board-menu')) {
        this.zoomDropdown.classList.add('hidden');
        this.exportDropdown.classList.add('hidden');
        this.boardDropdown.classList.add('hidden');
        this.btnZoomLevel?.setAttribute('aria-expanded', 'false');
        this.btnExportMenu?.setAttribute('aria-expanded', 'false');
        this.btnBoardMenu?.setAttribute('aria-expanded', 'false');
      }
    });

    eventBus.on('board:loaded', (board) => {
      this.boardNameInput.value = board.title || 'Untitled Board';
    });
  }
}

};

modules["./utils/icons.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — SVG Icons Library
   Consistent monochrome SVG icons for UI, Layers, Tools, and Context Menu
   ========================================================================== */

const ICONS = exports.ICONS = {
  select: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3l7 18 3-7 7-3L3 3z"/></svg>`,
  hand: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 11V6a2 2 0 00-2-2v0a2 2 0 00-2 2v3m0 0V4a2 2 0 00-2-2v0a2 2 0 00-2 2v7m0 0V5a2 2 0 00-2-2v0a2 2 0 00-2 2v9m0 0a6 6 0 0012 0v-3a2 2 0 00-2-2v0a2 2 0 00-2 2v2"/></svg>`,
  rectangle: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>`,
  'rounded-rectangle': `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="6"/></svg>`,
  ellipse: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>`,
  diamond: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 22 12 12 22 2 12 12 2"/></svg>`,
  line: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="19" x2="19" y2="5"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="19" x2="19" y2="5"/><polyline points="10 5 19 5 19 14"/></svg>`,
  pencil: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>`,
  highlighter: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l-6 6v3h3l6-6"/><path d="M22 7l-3-3-9 9 3 3 9-9z"/></svg>`,
  text: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`,
  sticky: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V9l-6-6z"/><path d="M14 3v6h6"/></svg>`,
  connector: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="4" cy="12" r="2"/><circle cx="20" cy="12" r="2"/><path d="M6 12h3c2 0 3-4 5-4s3 4 5 4h1"/></svg>`,
  image: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  eraser: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 20H7L3 16a2 2 0 010-2.83l9.17-9.17a2 2 0 012.83 0l6.17 6.17a2 2 0 010 2.83L14 20"/></svg>`,
  group: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/><path d="M7 11v6h6"/></svg>`,
  
  // Action icons
  lock: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>`,
  unlock: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 019.9-1"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>`,
  copy: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`,
  duplicate: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`,
  bringFront: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/></svg>`,
  sendBack: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 12 2 17 12 22 22 17 12 12"/><polyline points="2 7 12 2 22 7"/></svg>`,
  check: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
  info: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  error: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
};

exports.getIcon = getIcon;
function getIcon(name) {
  return ICONS[name] || ICONS.rectangle;
}

};

modules["./utils/math.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — Geometry & Math Utilities
   ========================================================================== */

const DEG_TO_RAD = exports.DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = exports.RAD_TO_DEG = 180 / Math.PI;

/**
 * Clamp a number between min and max
 */
exports.clamp = clamp;
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/**
 * Euclidean distance between two points
 */
exports.distance = distance;
function distance(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.hypot(dx, dy);
}

/**
 * Rotate a point around a center point by an angle in radians
 */
exports.rotatePoint = rotatePoint;
function rotatePoint(point, center, angleRad) {
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return {
    x: center.x + (dx * cos - dy * sin),
    y: center.y + (dx * sin + dy * cos)
  };
}

/**
 * Calculate the center point of a bounding box
 */
exports.getBoundsCenter = getBoundsCenter;
function getBoundsCenter(bounds) {
  return {
    x: bounds.x + bounds.width / 2,
    y: bounds.y + bounds.height / 2
  };
}

/**
 * Normalize rectangle coordinates so width and height are non-negative
 */
exports.normalizeRect = normalizeRect;
function normalizeRect(x, y, width, height) {
  let nx = x;
  let ny = y;
  let nw = width;
  let nh = height;

  if (nw < 0) {
    nx += nw;
    nw = Math.abs(nw);
  }
  if (nh < 0) {
    ny += nh;
    nh = Math.abs(nh);
  }

  return { x: nx, y: ny, width: nw, height: nh };
}

/**
 * Check if two AABB bounding boxes intersect
 */
exports.boundsIntersect = boundsIntersect;
function boundsIntersect(b1, b2) {
  return !(
    b2.x > b1.x + b1.width ||
    b2.x + b2.width < b1.x ||
    b2.y > b1.y + b1.height ||
    b2.y + b2.height < b1.y
  );
}

/**
 * Check if bounding box b1 completely contains b2
 */
exports.boundsContain = boundsContain;
function boundsContain(b1, b2) {
  return (
    b2.x >= b1.x &&
    b2.y >= b1.y &&
    b2.x + b2.width <= b1.x + b1.width &&
    b2.y + b2.height <= b1.y + b1.height
  );
}

/**
 * Combine multiple bounding boxes into an enclosing bounding box
 */
exports.unionBounds = unionBounds;
function unionBounds(boundsList) {
  if (!boundsList || boundsList.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const b of boundsList) {
    if (!b) continue;
    minX = Math.min(minX, b.x);
    minY = Math.min(minY, b.y);
    maxX = Math.max(maxX, b.x + b.width);
    maxY = Math.max(maxY, b.y + b.height);
  }

  if (minX === Infinity) return { x: 0, y: 0, width: 0, height: 0 };

  return {
    x: minX,
    y: minY,
    width: Math.max(1, maxX - minX),
    height: Math.max(1, maxY - minY)
  };
}

/**
 * Calculate the bounding box of an object
 */
exports.getObjectBounds = getObjectBounds;
function getObjectBounds(obj) {
  if (!obj) return { x: 0, y: 0, width: 0, height: 0 };

  switch (obj.type) {
    case 'line':
    case 'arrow':
    case 'connector': {
      const minX = Math.min(obj.x, obj.x2 ?? obj.x);
      const minY = Math.min(obj.y, obj.y2 ?? obj.y);
      const maxX = Math.max(obj.x, obj.x2 ?? obj.x);
      const maxY = Math.max(obj.y, obj.y2 ?? obj.y);
      const padding = (obj.strokeWidth || 2) + 4;
      return {
        x: minX - padding,
        y: minY - padding,
        width: Math.max(12, maxX - minX + padding * 2),
        height: Math.max(12, maxY - minY + padding * 2)
      };
    }

    case 'pencil':
    case 'highlighter': {
      if (!obj.points || obj.points.length === 0) {
        return { x: obj.x, y: obj.y, width: obj.width || 10, height: obj.height || 10 };
      }
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (const pt of obj.points) {
        minX = Math.min(minX, pt.x);
        minY = Math.min(minY, pt.y);
        maxX = Math.max(maxX, pt.x);
        maxY = Math.max(maxY, pt.y);
      }
      const padding = (obj.strokeWidth || 4) + 4;
      return {
        x: minX - padding,
        y: minY - padding,
        width: Math.max(8, maxX - minX + padding * 2),
        height: Math.max(8, maxY - minY + padding * 2)
      };
    }

    default: {
      return {
        x: obj.x,
        y: obj.y,
        width: Math.max(1, obj.width || 20),
        height: Math.max(1, obj.height || 20)
      };
    }
  }
}

/**
 * Distance from point to line segment
 */
exports.distToSegment = distToSegment;
function distToSegment(p, v, w) {
  const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
  if (l2 === 0) return distance(p, v);
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = clamp(t, 0, 1);
  return distance(p, {
    x: v.x + t * (w.x - v.x),
    y: v.y + t * (w.y - v.y)
  });
}

/**
 * Hit test for any object given a point in world coordinates
 */
exports.isPointInObject = isPointInObject;
function isPointInObject(p, obj, hitThreshold = 8) {
  if (!obj || obj.visible === false) return false;

  const center = {
    x: obj.x + (obj.width || 0) / 2,
    y: obj.y + (obj.height || 0) / 2
  };

  // If object is rotated, untranslate point to local coordinate space
  const localPoint = obj.rotation
    ? rotatePoint(p, center, -obj.rotation * DEG_TO_RAD)
    : p;

  switch (obj.type) {
    case 'rectangle':
    case 'rounded-rectangle':
    case 'sticky':
    case 'text':
    case 'image':
    case 'group': {
      return (
        localPoint.x >= obj.x - hitThreshold &&
        localPoint.x <= obj.x + obj.width + hitThreshold &&
        localPoint.y >= obj.y - hitThreshold &&
        localPoint.y <= obj.y + obj.height + hitThreshold
      );
    }

    case 'ellipse': {
      const rx = obj.width / 2;
      const ry = obj.height / 2;
      if (rx <= 0 || ry <= 0) return false;
      const dx = localPoint.x - center.x;
      const dy = localPoint.y - center.y;
      const val = (dx * dx) / ((rx + hitThreshold) * (rx + hitThreshold)) +
                  (dy * dy) / ((ry + hitThreshold) * (ry + hitThreshold));
      return val <= 1;
    }

    case 'diamond': {
      const rx = obj.width / 2;
      const ry = obj.height / 2;
      if (rx <= 0 || ry <= 0) return false;
      const dx = Math.abs(localPoint.x - center.x);
      const dy = Math.abs(localPoint.y - center.y);
      return (dx / (rx + hitThreshold) + dy / (ry + hitThreshold)) <= 1;
    }

    case 'line':
    case 'arrow':
    case 'connector': {
      const p1 = { x: obj.x, y: obj.y };
      const p2 = { x: obj.x2 ?? obj.x, y: obj.y2 ?? obj.y };
      const dist = distToSegment(p, p1, p2);
      return dist <= (obj.strokeWidth || 2) / 2 + hitThreshold;
    }

    case 'pencil':
    case 'highlighter': {
      if (!obj.points || obj.points.length < 2) {
        return distance(p, { x: obj.x, y: obj.y }) <= (obj.strokeWidth || 4) + hitThreshold;
      }
      const strokeDist = (obj.strokeWidth || 4) / 2 + hitThreshold;
      for (let i = 0; i < obj.points.length - 1; i++) {
        if (distToSegment(p, obj.points[i], obj.points[i + 1]) <= strokeDist) {
          return true;
        }
      }
      return false;
    }

    default: {
      const bounds = getObjectBounds(obj);
      return (
        p.x >= bounds.x - hitThreshold &&
        p.x <= bounds.x + bounds.width + hitThreshold &&
        p.y >= bounds.y - hitThreshold &&
        p.y <= bounds.y + bounds.height + hitThreshold
      );
    }
  }
}

/**
 * Returns connection anchor points on a shape (top, right, bottom, left, center)
 */
exports.getShapeAnchors = getShapeAnchors;
function getShapeAnchors(obj) {
  if (!obj) return [];
  const bounds = getObjectBounds(obj);
  const cx = bounds.x + bounds.width / 2;
  const cy = bounds.y + bounds.height / 2;

  const anchors = [
    { id: 'top', x: cx, y: bounds.y, normal: { x: 0, y: -1 } },
    { id: 'right', x: bounds.x + bounds.width, y: cy, normal: { x: 1, y: 0 } },
    { id: 'bottom', x: cx, y: bounds.y + bounds.height, normal: { x: 0, y: 1 } },
    { id: 'left', x: bounds.x, y: cy, normal: { x: -1, y: 0 } },
    { id: 'center', x: cx, y: cy, normal: { x: 0, y: 0 } }
  ];

  if (obj.rotation) {
    const centerPt = { x: cx, y: cy };
    return anchors.map(a => {
      const rotated = rotatePoint(a, centerPt, obj.rotation * DEG_TO_RAD);
      return { ...a, x: rotated.x, y: rotated.y };
    });
  }

  return anchors;
}

/**
 * Find closest anchor point on an object to a target point
 */
exports.getClosestAnchor = getClosestAnchor;
function getClosestAnchor(obj, targetPoint) {
  const anchors = getShapeAnchors(obj);
  let closest = anchors[0];
  let minD = Infinity;

  for (const anchor of anchors) {
    const d = distance(anchor, targetPoint);
    if (d < minD) {
      minD = d;
      closest = anchor;
    }
  }

  return { anchor: closest, distance: minD };
}

/**
 * Returns the 8 resize handle positions + rotation handle for a bounding box
 */
exports.getSelectionHandles = getSelectionHandles;
function getSelectionHandles(bounds, rotation = 0, handleSize = 8) {
  const { x, y, width, height } = bounds;
  const cx = x + width / 2;
  const cy = y + height / 2;
  const center = { x: cx, y: cy };

  const rawHandles = [
    { id: 'nw', x: x, y: y, cursor: 'nwse-resize' },
    { id: 'n',  x: cx, y: y, cursor: 'ns-resize' },
    { id: 'ne', x: x + width, y: y, cursor: 'nesw-resize' },
    { id: 'e',  x: x + width, y: cy, cursor: 'ew-resize' },
    { id: 'se', x: x + width, y: y + height, cursor: 'nwse-resize' },
    { id: 's',  x: cx, y: y + height, cursor: 'ns-resize' },
    { id: 'sw', x: x, y: y + height, cursor: 'nesw-resize' },
    { id: 'w',  x: x, y: cy, cursor: 'ew-resize' },
    { id: 'rot', x: cx, y: y - 24, cursor: 'grab' } // Rotation handle stalk
  ];

  if (!rotation) return rawHandles;

  return rawHandles.map(h => {
    const rotPt = rotatePoint({ x: h.x, y: h.y }, center, rotation * DEG_TO_RAD);
    return {
      ...h,
      x: rotPt.x,
      y: rotPt.y
    };
  });
}

/**
 * Smooth Catmull-Rom spline calculation for freehand curves
 */
exports.catmullRomSpline = catmullRomSpline;
function catmullRomSpline(ctx, points, tension = 0.5) {
  if (!points || points.length < 2) return;

  if (points.length === 2) {
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    return;
  }

  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < points.length - 2 ? points[i + 2] : p2;

    const cp1x = p1.x + ((p2.x - p0.x) / 6) * tension;
    const cp1y = p1.y + ((p2.y - p0.y) / 6) * tension;
    const cp2x = p2.x - ((p3.x - p1.x) / 6) * tension;
    const cp2y = p2.y - ((p3.y - p1.y) / 6) * tension;

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
  }
}

};

modules["./utils/snapping.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — Snapping & Smart Guides Engine
   Grid Snapping, Object-to-Object Alignment & Angle Snapping
   ========================================================================== */

/* import { getObjectBounds, DEG_TO_RAD, RAD_TO_DEG } from './math.js'; */
const getObjectBounds = __require("./utils/math.js").getObjectBounds;
const DEG_TO_RAD = __require("./utils/math.js").DEG_TO_RAD;
const RAD_TO_DEG = __require("./utils/math.js").RAD_TO_DEG;

exports.SnappingEngine = class SnappingEngine {
  constructor(options = {}) {
    this.gridSize = options.gridSize || 20;
    this.snapThreshold = options.snapThreshold || 8; // in screen/world pixels
    this.snapToGridEnabled = true;
    this.snapToObjectsEnabled = true;
  }

  /**
   * Snap a single scalar value to nearest grid multiple
   */
  snapValueToGrid(val, gridSize = this.gridSize) {
    return Math.round(val / gridSize) * gridSize;
  }

  /**
   * Snap a point to grid
   */
  snapPointToGrid(p, gridSize = this.gridSize) {
    return {
      x: this.snapValueToGrid(p.x, gridSize),
      y: this.snapValueToGrid(p.y, gridSize)
    };
  }

  /**
   * Snap angle to increments (e.g. 15, 45, 90 degrees)
   */
  snapAngle(angleDeg, step = 15) {
    return Math.round(angleDeg / step) * step;
  }

  /**
   * Calculate alignment snaps and active guide lines between moving bounds and other objects
   * @param {Object} movingBounds - Current bounds of dragged/resized selection {x, y, width, height}
   * @param {Array} otherObjects - List of stationary objects on the canvas
   * @param {number} zoom - Current canvas zoom factor (to scale threshold)
   * @returns {Object} { snappedX, snappedY, deltaX, deltaY, guides: Array }
   */
  calculateObjectSnaps(movingBounds, otherObjects, zoom = 1) {
    const guides = [];
    const threshold = this.snapThreshold / zoom;

    let deltaX = 0;
    let deltaY = 0;
    let minDiffX = threshold + 1;
    let minDiffY = threshold + 1;

    const movingLeft = movingBounds.x;
    const movingCenterX = movingBounds.x + movingBounds.width / 2;
    const movingRight = movingBounds.x + movingBounds.width;

    const movingTop = movingBounds.y;
    const movingCenterY = movingBounds.y + movingBounds.height / 2;
    const movingBottom = movingBounds.y + movingBounds.height;

    // Collect all candidate alignment lines from stationary objects
    for (const obj of otherObjects) {
      if (!obj || obj.visible === false) continue;
      const b = getObjectBounds(obj);

      const targetLeft = b.x;
      const targetCenterX = b.x + b.width / 2;
      const targetRight = b.x + b.width;

      const targetTop = b.y;
      const targetCenterY = b.y + b.height / 2;
      const targetBottom = b.y + b.height;

      // --- Horizontal X Alignment Checks ---
      const xChecks = [
        { moving: movingLeft, target: targetLeft, offset: targetLeft - movingLeft },
        { moving: movingLeft, target: targetRight, offset: targetRight - movingLeft },
        { moving: movingCenterX, target: targetCenterX, offset: targetCenterX - movingCenterX },
        { moving: movingRight, target: targetLeft, offset: targetLeft - movingRight },
        { moving: movingRight, target: targetRight, offset: targetRight - movingRight }
      ];

      for (const check of xChecks) {
        const diff = Math.abs(check.offset);
        if (diff < threshold && diff < minDiffX) {
          minDiffX = diff;
          deltaX = check.offset;
        }
      }

      // --- Vertical Y Alignment Checks ---
      const yChecks = [
        { moving: movingTop, target: targetTop, offset: targetTop - movingTop },
        { moving: movingTop, target: targetBottom, offset: targetBottom - movingTop },
        { moving: movingCenterY, target: targetCenterY, offset: targetCenterY - movingCenterY },
        { moving: movingBottom, target: targetTop, offset: targetTop - movingBottom },
        { moving: movingBottom, target: targetBottom, offset: targetBottom - movingBottom }
      ];

      for (const check of yChecks) {
        const diff = Math.abs(check.offset);
        if (diff < threshold && diff < minDiffY) {
          minDiffY = diff;
          deltaY = check.offset;
        }
      }
    }

    // Build visual guide line coordinates if snaps were found
    const finalLeft = movingBounds.x + deltaX;
    const finalCenterX = finalLeft + movingBounds.width / 2;
    const finalRight = finalLeft + movingBounds.width;

    const finalTop = movingBounds.y + deltaY;
    const finalCenterY = finalTop + movingBounds.height / 2;
    const finalBottom = finalTop + movingBounds.height;

    if (deltaX !== 0 || minDiffX <= threshold) {
      for (const obj of otherObjects) {
        const b = getObjectBounds(obj);
        const tL = b.x;
        const tC = b.x + b.width / 2;
        const tR = b.x + b.width;

        const alignedX = [tL, tC, tR].find(x => 
          Math.abs(x - finalLeft) < 0.5 ||
          Math.abs(x - finalCenterX) < 0.5 ||
          Math.abs(x - finalRight) < 0.5
        );

        if (alignedX !== undefined) {
          const minY = Math.min(finalTop, b.y) - 20;
          const maxY = Math.max(finalBottom, b.y + b.height) + 20;
          guides.push({
            type: 'vertical',
            x: alignedX,
            y1: minY,
            y2: maxY
          });
        }
      }
    }

    if (deltaY !== 0 || minDiffY <= threshold) {
      for (const obj of otherObjects) {
        const b = getObjectBounds(obj);
        const tT = b.y;
        const tC = b.y + b.height / 2;
        const tB = b.y + b.height;

        const alignedY = [tT, tC, tB].find(y => 
          Math.abs(y - finalTop) < 0.5 ||
          Math.abs(y - finalCenterY) < 0.5 ||
          Math.abs(y - finalBottom) < 0.5
        );

        if (alignedY !== undefined) {
          const minX = Math.min(finalLeft, b.x) - 20;
          const maxX = Math.max(finalRight, b.x + b.width) + 20;
          guides.push({
            type: 'horizontal',
            y: alignedY,
            x1: minX,
            x2: maxX
          });
        }
      }
    }

    return {
      deltaX,
      deltaY,
      snappedX: movingBounds.x + deltaX,
      snappedY: movingBounds.y + deltaY,
      guides
    };
  }
}

};

modules["./utils/svg-exporter.js"] = function(exports, __require, module) {
/* ==========================================================================
   CANVASFLOW — SVG Vector Exporter
   Generates clean, scalable, standalone SVG vector documents from board objects
   ========================================================================== */

/* import { getObjectBounds, unionBounds, DEG_TO_RAD, getShapeAnchors } from './math.js'; */
const getObjectBounds = __require("./utils/math.js").getObjectBounds;
const unionBounds = __require("./utils/math.js").unionBounds;
const DEG_TO_RAD = __require("./utils/math.js").DEG_TO_RAD;
const getShapeAnchors = __require("./utils/math.js").getShapeAnchors;

exports.exportBoardToSVG = exportBoardToSVG;
function exportBoardToSVG(board, options = {}) {
  const { bg = 'canvas', scope = 'all', theme = 'dark' } = options;
  const isDark = theme === 'dark';

  const objectsMap = new Map((board.objects || []).map(o => [o.id, o]));

  let targetObjects = (board.objects || []).filter(o => o.visible !== false);
  if (scope === 'selection' && options.selectedIds && options.selectedIds.size > 0) {
    targetObjects = targetObjects.filter(o => options.selectedIds.has(o.id));
  }

  if (targetObjects.length === 0) return null;

  const bounds = unionBounds(targetObjects.map(o => getObjectBounds(o)));
  const padding = 50;
  const width = Math.max(100, Math.ceil(bounds.width + padding * 2));
  const height = Math.max(100, Math.ceil(bounds.height + padding * 2));
  const minX = bounds.x - padding;
  const minY = bounds.y - padding;

  let bgColor = 'none';
  if (bg === 'canvas') {
    bgColor = isDark ? '#16171b' : '#ffffff';
  } else if (bg === 'white') {
    bgColor = '#ffffff';
  }

  let svgElements = '';

  for (const obj of targetObjects) {
    svgElements += renderObjectToSVG(obj, objectsMap);
  }

  const svgDocument = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <style>
      text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif; }
    </style>
    <marker id="arrow-triangle" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="context-stroke" />
    </marker>
    <filter id="sticky-shadow" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#000000" flood-opacity="0.18" />
    </filter>
  </defs>
  ${bgColor !== 'none' ? `<rect x="${minX}" y="${minY}" width="${width}" height="${height}" fill="${bgColor}" />` : ''}
  ${svgElements}
</svg>`;

  return svgDocument;
}

function renderObjectToSVG(obj, objectsMap = new Map()) {
  const stroke = obj.stroke || 'none';
  const fill = obj.fill || 'none';
  const strokeWidth = obj.strokeWidth ?? 2;
  const opacity = obj.opacity ?? 1;

  let dashArray = '';
  if (obj.strokeStyle === 'dashed') dashArray = 'stroke-dasharray="8 6"';
  else if (obj.strokeStyle === 'dotted') dashArray = 'stroke-dasharray="3 4"';

  let transform = '';
  if (obj.rotation) {
    const cx = obj.x + (obj.width || 0) / 2;
    const cy = obj.y + (obj.height || 0) / 2;
    transform = `transform="rotate(${obj.rotation} ${cx} ${cy})"`;
  }

  const commonAttrs = `opacity="${opacity}" stroke="${stroke}" fill="${fill}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" ${dashArray} ${transform}`;

  switch (obj.type) {
    case 'rectangle':
      return `<rect x="${obj.x}" y="${obj.y}" width="${obj.width}" height="${obj.height}" rx="${obj.cornerRadius || 0}" ${commonAttrs} />\n`;

    case 'rounded-rectangle':
      return `<rect x="${obj.x}" y="${obj.y}" width="${obj.width}" height="${obj.height}" rx="${obj.cornerRadius || 12}" ${commonAttrs} />\n`;

    case 'ellipse': {
      const rx = obj.width / 2;
      const ry = obj.height / 2;
      return `<ellipse cx="${obj.x + rx}" cy="${obj.y + ry}" rx="${rx}" ry="${ry}" ${commonAttrs} />\n`;
    }

    case 'diamond': {
      const cx = obj.x + obj.width / 2;
      const cy = obj.y + obj.height / 2;
      const points = `${cx},${obj.y} ${obj.x + obj.width},${cy} ${cx},${obj.y + obj.height} ${obj.x},${cy}`;
      return `<polygon points="${points}" ${commonAttrs} />\n`;
    }

    case 'line':
      return `<line x1="${obj.x}" y1="${obj.y}" x2="${obj.x2 ?? obj.x}" y2="${obj.y2 ?? obj.y}" ${commonAttrs} />\n`;

    case 'arrow': {
      const marker = obj.arrowHeadEnd === 'triangle' ? 'marker-end="url(#arrow-triangle)"' : '';
      return `<line x1="${obj.x}" y1="${obj.y}" x2="${obj.x2 ?? obj.x}" y2="${obj.y2 ?? obj.y}" ${marker} ${commonAttrs} />\n`;
    }

    case 'connector': {
      let x1 = obj.x;
      let y1 = obj.y;
      let x2 = obj.x2 ?? x1 + 100;
      let y2 = obj.y2 ?? y1 + 100;

      if (obj.startBinding && objectsMap.has(obj.startBinding.elementId)) {
        const target = objectsMap.get(obj.startBinding.elementId);
        const anchors = getShapeAnchors(target);
        const match = anchors.find(a => a.id === obj.startBinding.anchor);
        if (match) { x1 = match.x; y1 = match.y; }
      }

      if (obj.endBinding && objectsMap.has(obj.endBinding.elementId)) {
        const target = objectsMap.get(obj.endBinding.elementId);
        const anchors = getShapeAnchors(target);
        const match = anchors.find(a => a.id === obj.endBinding.anchor);
        if (match) { x2 = match.x; y2 = match.y; }
      }

      const dx = x2 - x1;
      const dy = y2 - y1;

      let d = `M ${x1} ${y1} L ${x2} ${y2}`;
      if (obj.routing === 'curved') {
        const cp1x = x1 + dx * 0.5;
        const cp1y = y1;
        const cp2x = x1 + dx * 0.5;
        const cp2y = y2;
        d = `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
      } else if (obj.routing === 'stepped') {
        const midX = x1 + dx / 2;
        d = `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
      }

      const marker = obj.arrowHeadEnd === 'triangle' ? 'marker-end="url(#arrow-triangle)"' : '';
      return `<path d="${d}" ${marker} ${commonAttrs} fill="none" />\n`;
    }

    case 'pencil':
    case 'highlighter': {
      if (!obj.points || obj.points.length < 2) return '';
      let pathD = `M ${obj.points[0].x} ${obj.points[0].y}`;
      for (let i = 1; i < obj.points.length; i++) {
        pathD += ` L ${obj.points[i].x} ${obj.points[i].y}`;
      }
      return `<path d="${pathD}" ${commonAttrs} fill="none" />\n`;
    }

    case 'text': {
      const lines = (obj.text || '').split('\n');
      const fontSize = obj.fontSize || 18;
      const lineHeight = fontSize * (obj.lineHeight || 1.35);
      const textAnchor = obj.textAlign === 'center' ? 'middle' : (obj.textAlign === 'right' ? 'end' : 'start');
      let textX = obj.x;
      if (obj.textAlign === 'center') textX = obj.x + obj.width / 2;
      else if (obj.textAlign === 'right') textX = obj.x + obj.width;

      let tspans = '';
      lines.forEach((line, i) => {
        tspans += `<tspan x="${textX}" dy="${i === 0 ? fontSize : lineHeight}">${escapeXml(line)}</tspan>`;
      });

      return `<text x="${textX}" y="${obj.y}" font-size="${fontSize}" font-weight="${obj.fontWeight || 'normal'}" font-style="${obj.fontStyle || 'normal'}" fill="${obj.color || '#f3f4f6'}" text-anchor="${textAnchor}" opacity="${opacity}" ${transform}>${tspans}</text>\n`;
    }

    case 'sticky': {
      const lines = (obj.text || '').split('\n');
      const fontSize = obj.fontSize || 15;
      const padding = 14;
      const lineHeight = fontSize * 1.35;
      let tspans = '';
      lines.forEach((line, i) => {
        tspans += `<tspan x="${obj.x + padding}" dy="${i === 0 ? fontSize : lineHeight}">${escapeXml(line)}</tspan>`;
      });

      return `
        <g filter="url(#sticky-shadow)" opacity="${opacity}" ${transform}>
          <rect x="${obj.x}" y="${obj.y}" width="${obj.width}" height="${obj.height}" rx="4" fill="${obj.fill || '#fef08a'}" stroke="rgba(0,0,0,0.1)" stroke-width="1" />
          <text x="${obj.x + padding}" y="${obj.y + padding}" font-size="${fontSize}" font-weight="500" fill="${obj.color || '#713f12'}">${tspans}</text>
        </g>\n`;
    }

    case 'image': {
      return `<image href="${obj.src}" x="${obj.x}" y="${obj.y}" width="${obj.width}" height="${obj.height}" opacity="${opacity}" ${transform} />\n`;
    }

    default:
      return '';
  }
}

function escapeXml(unsafe) {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

};


  // Execute Entry Point (app.js)
  __require('./app.js');
})();
