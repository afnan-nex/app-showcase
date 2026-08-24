/* ==========================================================================
   CANVASFLOW — Main Application Orchestrator
   Initialization, Global Events, Inline Text Editor, File Handling & Gestures
   ========================================================================== */

import { appState } from './state/state.js';
import { storage } from './state/storage.js';
import { eventBus } from './state/event-bus.js';
import { CanvasRenderer } from './renderer/canvas-renderer.js';
import { ToolManager } from './tools/tool-manager.js';
import { Toolbar } from './ui/toolbar.js';
import { PropertiesPanel } from './ui/properties-panel.js';
import { LayersPanel } from './ui/layers-panel.js';
import { Minimap } from './ui/minimap.js';
import { Rulers } from './ui/rulers.js';
import { ContextMenu } from './ui/context-menu.js';
import { CommandPalette } from './ui/command-palette.js';
import { ModalManager } from './ui/modals.js';
import { ToastManager } from './ui/toast.js';
import { createSampleBoard } from './ui/sample-board.js';
import { createCanvasObject, generateId } from './state/document-model.js';
import { getObjectBounds, clamp } from './utils/math.js';
import { exportBoardToSVG } from './utils/svg-exporter.js';

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
