/**
 * RoomPlanr - Master Architectural Workstation Orchestrator
 * Integrates 2D CAD Floor Plan, 3D Isometric Renderer, Collision Engine, Catalog, Multi-Scenarios, Modals, and Exports.
 */

import { getIcon, escapeHTML } from './core/icons.js';
import { db } from './core/db.js';
import { UNITS, formatDimension, formatArea, formatPrice, snapToGrid } from './core/units.js';
import { FURNITURE_CATALOG, FLOOR_MATERIALS } from './engine/catalog.js';
import { Renderer2D } from './engine/renderer-2d.js';
import { Renderer3D } from './engine/renderer-3d.js';
import { checkFurnitureOverlap, checkOutsideRoom, isPointInsideRotatedItem } from './engine/collision.js';
import { SAMPLE_ROOMS } from './engine/sample-rooms.js';
import { renderFurnitureCatalog } from './editor/furniture-catalog.js';
import { renderPropertyInspector } from './editor/property-inspector.js';

class RoomPlanrApp {
  constructor() {
    this.canvas = document.getElementById('planr-canvas');
    this.renderer2D = new Renderer2D(this.canvas);
    this.renderer3D = new Renderer3D(this.canvas);

    // Active project state
    this.room = JSON.parse(JSON.stringify(SAMPLE_ROOMS.studio));
    this.activeScenarioId = this.room.activeScenarioId || 'scenario_a';
    this.selectedItemId = this.getCurrentItems()[0]?.id || null;

    // View & Editor Settings
    this.viewMode = '2D'; // '2D' or '3D'
    this.unit = UNITS.METERS;
    this.currency = 'USD';
    this.gridSnap = 0.10; // 10cm grid
    this.showGrid = true;
    this.showDimensions = true;

    // UI Drawer state (Mobile / Responsive)
    this.catalogCategory = 'All';
    this.catalogSearch = '';
    this.inspectorTab = 'properties';
    this.isCatalogDrawerOpen = false;
    this.isInspectorDrawerOpen = false;

    // Pointer Interaction Modes
    this.interactionMode = 'none'; // 'none', 'move', 'rotate', 'pan'
    this.panStart = { x: 0, y: 0 };
    this.dragOffset = { x: 0, y: 0 };
    this.initialTransform = { x: 0, y: 0, width: 1, depth: 1, rotation: 0 };

    // Touch gesture state
    this.touchPinchDist = 0;
    this.touchStartPoint = { x: 0, y: 0 };

    // History stack
    this.undoStack = [];
    this.redoStack = [];
  }

  async init() {
    await db.init();

    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    this.setupToolbar();
    this.setupCanvasInteractions();
    this.setupTouchInteractions();
    this.setupShortcuts();
    this.setupModals();
    this.renderAll();
    this.centerCamera();
    this.updateUndoRedoButtons();
  }

  getCurrentItems() {
    if (!this.room.scenarios || !this.room.scenarios[this.activeScenarioId]) {
      const firstId = Object.keys(this.room.scenarios || {})[0] || 'scenario_a';
      if (!this.room.scenarios || Object.keys(this.room.scenarios).length === 0) {
        this.room.scenarios = { scenario_a: { id: 'scenario_a', name: 'Layout A', items: [] } };
        this.activeScenarioId = 'scenario_a';
      } else {
        this.activeScenarioId = firstId;
      }
    }
    return this.room.scenarios[this.activeScenarioId].items || [];
  }

  handleResize() {
    const container = document.getElementById('canvas-workspace-wrap');
    if (container && this.canvas) {
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 600;
      this.renderer2D.resize(w, h);
      this.renderer3D.resize(w, h);
      this.requestRender();
    }
  }

  requestRender() {
    const items = this.getCurrentItems();
    const overlappingIds = new Set();

    // Check collisions
    for (let i = 0; i < items.length; i++) {
      if (checkOutsideRoom(items[i], this.room.width, this.room.depth)) {
        overlappingIds.add(items[i].id);
      }
      for (let j = i + 1; j < items.length; j++) {
        if (checkFurnitureOverlap(items[i], items[j])) {
          overlappingIds.add(items[i].id);
          overlappingIds.add(items[j].id);
        }
      }
    }

    if (this.viewMode === '2D') {
      this.renderer2D.render({
        room: this.room,
        items,
        selectedItemId: this.selectedItemId,
        overlappingItemIds: overlappingIds,
        unit: this.unit,
        showGrid: this.showGrid,
        showDimensions: this.showDimensions
      });
    } else {
      this.renderer3D.render({
        room: this.room,
        items,
        selectedItemId: this.selectedItemId
      });
    }

    this.updateStatusBar(overlappingIds.size);
  }

  renderAll() {
    this.renderCatalog();
    this.renderInspector();
    this.updateScenarioTabs();
    this.updateUndoRedoButtons();
    this.requestRender();
  }

  centerCamera() {
    const cw = this.renderer2D.logicalWidth || 800;
    const ch = this.renderer2D.logicalHeight || 600;
    const rw = this.room.width;
    const rd = this.room.depth;
    const zoom = this.renderer2D.camera.zoom;

    this.renderer2D.camera.x = Math.round((cw - rw * zoom) / 2);
    this.renderer2D.camera.y = Math.round((ch - rd * zoom) / 2);
    this.renderer3D.camera.x = 0;
    this.renderer3D.camera.y = 0;
    this.requestRender();
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type} animate-fade-in`;
    toast.innerHTML = `
      <span>${escapeHTML(message)}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-fade-out');
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }

  // --- Toolbar Setup ---
  setupToolbar() {
    // 2D / 3D Mode Toggle Buttons
    const btn2d = document.getElementById('btn-mode-2d');
    const btn3d = document.getElementById('btn-mode-3d');

    btn2d?.addEventListener('click', () => {
      this.viewMode = '2D';
      btn2d.classList.add('active');
      btn3d?.classList.remove('active');
      this.requestRender();
      this.showToast('Switched to 2D CAD Floor Plan View');
    });

    btn3d?.addEventListener('click', () => {
      this.viewMode = '3D';
      btn3d.classList.add('active');
      btn2d?.classList.remove('active');
      this.requestRender();
      this.showToast('Switched to 3D Isometric Perspective Preview');
    });

    // Sample Room Selector
    document.getElementById('select-sample-room')?.addEventListener('change', (e) => {
      const key = e.target.value;
      if (SAMPLE_ROOMS[key]) {
        this.recordHistory('Load Sample Room');
        this.room = JSON.parse(JSON.stringify(SAMPLE_ROOMS[key]));
        this.activeScenarioId = this.room.activeScenarioId || Object.keys(this.room.scenarios)[0];
        this.selectedItemId = this.getCurrentItems()[0]?.id || null;
        this.centerCamera();
        this.renderAll();
        this.autoSave();
        this.showToast(`Loaded: ${this.room.name}`);
      }
    });

    // Unit Selector
    document.getElementById('select-display-unit')?.addEventListener('change', (e) => {
      this.unit = e.target.value;
      this.renderAll();
      this.showToast(`Unit changed to ${this.unit.toUpperCase()}`);
    });

    // Grid Snapping Selector
    document.getElementById('select-grid-snap')?.addEventListener('change', (e) => {
      this.gridSnap = parseFloat(e.target.value);
      this.showToast(`Grid snap: ${this.gridSnap === 0 ? 'Disabled' : `${this.gridSnap * 100} cm`}`);
    });

    // Toggle Grid
    document.getElementById('btn-toggle-grid')?.addEventListener('click', (e) => {
      this.showGrid = !this.showGrid;
      e.currentTarget.classList.toggle('active', this.showGrid);
      this.requestRender();
    });

    // Toggle Dimensions
    document.getElementById('btn-toggle-dims')?.addEventListener('click', (e) => {
      this.showDimensions = !this.showDimensions;
      e.currentTarget.classList.toggle('active', this.showDimensions);
      this.requestRender();
    });

    // Undo / Redo
    document.getElementById('btn-undo')?.addEventListener('click', () => this.undo());
    document.getElementById('btn-redo')?.addEventListener('click', () => this.redo());

    // Zoom Controls
    document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
      this.renderer2D.camera.zoom = Math.min(220, this.renderer2D.camera.zoom * 1.2);
      this.renderer3D.camera.zoom = Math.min(120, this.renderer3D.camera.zoom * 1.2);
      this.requestRender();
    });
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
      this.renderer2D.camera.zoom = Math.max(15, this.renderer2D.camera.zoom * 0.8);
      this.renderer3D.camera.zoom = Math.max(12, this.renderer3D.camera.zoom * 0.8);
      this.requestRender();
    });
    document.getElementById('btn-center-room')?.addEventListener('click', () => {
      this.centerCamera();
      this.showToast('Camera centered on room');
    });

    // Mobile Drawer Toggles
    document.getElementById('btn-mobile-catalog')?.addEventListener('click', () => {
      this.toggleCatalogDrawer();
    });
    document.getElementById('btn-mobile-inspector')?.addEventListener('click', () => {
      this.toggleInspectorDrawer();
    });

    // Shortcuts / Help Modal Trigger
    document.getElementById('btn-open-help')?.addEventListener('click', () => {
      this.openModal('modal-shortcuts');
    });

    // Export Blueprint Modal Trigger
    document.getElementById('btn-open-export-modal')?.addEventListener('click', () => {
      this.openModal('modal-export-blueprint');
    });

    // Save JSON Backup
    document.getElementById('btn-export-plan-json')?.addEventListener('click', () => {
      const json = JSON.stringify(this.room, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (this.room.name || 'room_project').toLowerCase().replace(/[^a-z0-9]+/g, '_') + '.roomplanr.json';
      a.click();
      this.showToast('Project JSON downloaded successfully', 'success');
    });

    // Import Project JSON
    const importInput = document.getElementById('file-import-plan');
    document.getElementById('btn-import-plan-json')?.addEventListener('click', () => importInput?.click());
    importInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          if (parsed && typeof parsed.width === 'number' && parsed.scenarios) {
            this.recordHistory('Import Project');
            this.room = parsed;
            this.activeScenarioId = this.room.activeScenarioId || Object.keys(this.room.scenarios)[0];
            this.selectedItemId = this.getCurrentItems()[0]?.id || null;
            this.centerCamera();
            this.renderAll();
            this.autoSave();
            this.showToast(`Imported project: ${this.room.name || 'Custom Plan'}`, 'success');
          } else {
            this.showToast('Invalid RoomPlanr project file format', 'error');
          }
        } catch (err) {
          this.showToast('Failed to parse JSON file: ' + err.message, 'error');
        }
      };
      reader.readAsText(file);
      importInput.value = '';
    });
  }

  toggleCatalogDrawer() {
    this.isCatalogDrawerOpen = !this.isCatalogDrawerOpen;
    document.getElementById('furniture-catalog-container')?.classList.toggle('drawer-open', this.isCatalogDrawerOpen);
    if (this.isCatalogDrawerOpen && this.isInspectorDrawerOpen) {
      this.toggleInspectorDrawer();
    }
  }

  toggleInspectorDrawer() {
    this.isInspectorDrawerOpen = !this.isInspectorDrawerOpen;
    document.getElementById('property-inspector-container')?.classList.toggle('drawer-open', this.isInspectorDrawerOpen);
    if (this.isInspectorDrawerOpen && this.isCatalogDrawerOpen) {
      this.toggleCatalogDrawer();
    }
  }

  // --- Pointer & Spatial Interactions ---
  setupCanvasInteractions() {
    const canvas = this.canvas;

    const screenToWorld = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const sx = clientX - rect.left;
      const sy = clientY - rect.top;
      const scale = this.renderer2D.camera.zoom;
      const wx = (sx - this.renderer2D.camera.x) / scale;
      const wy = (sy - this.renderer2D.camera.y) / scale;
      return { wx, wy, sx, sy };
    };

    canvas.addEventListener('mousedown', (e) => {
      const { wx, wy, sx, sy } = screenToWorld(e.clientX, e.clientY);

      // Pan with Middle Click or Space/Shift/Alt Drag
      if (e.button === 1 || e.shiftKey || e.altKey || e.spaceKey) {
        this.interactionMode = 'pan';
        this.panStart = { x: sx, y: sy };
        return;
      }

      if (e.button !== 0) return; // Left Click only

      if (this.viewMode === '3D') {
        this.interactionMode = 'pan';
        this.panStart = { x: sx, y: sy };
        return;
      }

      const items = this.getCurrentItems();
      const activeItem = items.find(i => i.id === this.selectedItemId);

      // 1. Check if clicked rotation handle on active item
      if (activeItem) {
        const scale = this.renderer2D.camera.zoom;
        const rad = ((activeItem.rotation || 0) * Math.PI) / 180;
        const rotDist = 24 / scale;
        const hx = activeItem.x + Math.sin(rad) * (activeItem.depth / 2 + rotDist);
        const hy = activeItem.y - Math.cos(rad) * (activeItem.depth / 2 + rotDist);

        const distToRot = Math.hypot(wx - hx, wy - hy);
        if (distToRot <= 14 / scale) {
          this.recordHistory('Rotate Item');
          this.interactionMode = 'rotate';
          this.initialTransform = { ...activeItem };
          return;
        }
      }

      // 2. Check if clicked furniture item (Rotated hit test)
      let clickedItem = null;
      for (let i = items.length - 1; i >= 0; i--) {
        if (isPointInsideRotatedItem(wx, wy, items[i])) {
          clickedItem = items[i];
          break;
        }
      }

      if (clickedItem) {
        this.recordHistory('Move Item');
        this.selectedItemId = clickedItem.id;
        this.interactionMode = 'move';
        this.dragOffset = { x: wx - clickedItem.x, y: wy - clickedItem.y };
        this.inspectorTab = 'properties';
        this.renderAll();
      } else {
        this.selectedItemId = null;
        this.interactionMode = 'none';
        this.renderAll();
      }
    });

    window.addEventListener('mousemove', (e) => {
      const { wx, wy, sx, sy } = screenToWorld(e.clientX, e.clientY);

      if (this.interactionMode === 'pan') {
        if (this.viewMode === '2D') {
          this.renderer2D.camera.x += sx - this.panStart.x;
          this.renderer2D.camera.y += sy - this.panStart.y;
        } else {
          this.renderer3D.camera.x += sx - this.panStart.x;
          this.renderer3D.camera.y += sy - this.panStart.y;
        }
        this.panStart = { x: sx, y: sy };
        this.requestRender();
        return;
      }

      if (this.interactionMode === 'move' && this.selectedItemId) {
        const activeItem = this.getCurrentItems().find(i => i.id === this.selectedItemId);
        if (activeItem) {
          let targetX = wx - this.dragOffset.x;
          let targetY = wy - this.dragOffset.y;

          if (this.gridSnap > 0) {
            targetX = snapToGrid(targetX, this.gridSnap);
            targetY = snapToGrid(targetY, this.gridSnap);
          }

          activeItem.x = targetX;
          activeItem.y = targetY;
          this.requestRender();
          this.renderInspector();
        }
        return;
      }

      if (this.interactionMode === 'rotate' && this.selectedItemId) {
        const activeItem = this.getCurrentItems().find(i => i.id === this.selectedItemId);
        if (activeItem) {
          const angleRad = Math.atan2(wy - activeItem.y, wx - activeItem.x);
          let degrees = Math.round((angleRad * 180) / Math.PI) + 90;
          if (degrees < 0) degrees += 360;

          // Snap to 15 degrees unless holding Shift
          if (!e.shiftKey) {
            degrees = Math.round(degrees / 15) * 15;
          }
          activeItem.rotation = degrees % 360;
          this.requestRender();
          this.renderInspector();
        }
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.interactionMode === 'move' || this.interactionMode === 'rotate') {
        this.autoSave();
        this.renderAll();
      }
      this.interactionMode = 'none';
    });

    // Zoom on mouse wheel
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;

      if (this.viewMode === '2D') {
        const { sx, sy } = screenToWorld(e.clientX, e.clientY);
        const oldZoom = this.renderer2D.camera.zoom;
        const newZoom = Math.max(15, Math.min(220, oldZoom * zoomFactor));

        this.renderer2D.camera.x = sx - (sx - this.renderer2D.camera.x) * (newZoom / oldZoom);
        this.renderer2D.camera.y = sy - (sy - this.renderer2D.camera.y) * (newZoom / oldZoom);
        this.renderer2D.camera.zoom = newZoom;
      } else {
        this.renderer3D.camera.zoom = Math.max(12, Math.min(120, this.renderer3D.camera.zoom * zoomFactor));
      }

      this.requestRender();
    });
  }

  // --- Touch Support for Mobile & Tablets ---
  setupTouchInteractions() {
    const canvas = this.canvas;
    if (!canvas) return;

    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const sx = touch.clientX - rect.left;
        const sy = touch.clientY - rect.top;
        const scale = this.renderer2D.camera.zoom;
        const wx = (sx - this.renderer2D.camera.x) / scale;
        const wy = (sy - this.renderer2D.camera.y) / scale;

        const items = this.getCurrentItems();
        let clickedItem = null;
        for (let i = items.length - 1; i >= 0; i--) {
          if (isPointInsideRotatedItem(wx, wy, items[i])) {
            clickedItem = items[i];
            break;
          }
        }

        if (clickedItem) {
          this.recordHistory('Touch Move Item');
          this.selectedItemId = clickedItem.id;
          this.interactionMode = 'move';
          this.dragOffset = { x: wx - clickedItem.x, y: wy - clickedItem.y };
          this.renderAll();
        } else {
          this.interactionMode = 'pan';
          this.panStart = { x: sx, y: sy };
        }
      } else if (e.touches.length === 2) {
        this.interactionMode = 'pinch';
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        this.touchPinchDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      }
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();

      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const sx = touch.clientX - rect.left;
        const sy = touch.clientY - rect.top;
        const scale = this.renderer2D.camera.zoom;
        const wx = (sx - this.renderer2D.camera.x) / scale;
        const wy = (sy - this.renderer2D.camera.y) / scale;

        if (this.interactionMode === 'move' && this.selectedItemId) {
          const activeItem = this.getCurrentItems().find(i => i.id === this.selectedItemId);
          if (activeItem) {
            let targetX = wx - this.dragOffset.x;
            let targetY = wy - this.dragOffset.y;
            if (this.gridSnap > 0) {
              targetX = snapToGrid(targetX, this.gridSnap);
              targetY = snapToGrid(targetY, this.gridSnap);
            }
            activeItem.x = targetX;
            activeItem.y = targetY;
            this.requestRender();
          }
        } else if (this.interactionMode === 'pan') {
          this.renderer2D.camera.x += sx - this.panStart.x;
          this.renderer2D.camera.y += sy - this.panStart.y;
          this.panStart = { x: sx, y: sy };
          this.requestRender();
        }
      } else if (e.touches.length === 2 && this.interactionMode === 'pinch') {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        const factor = dist / (this.touchPinchDist || dist);
        this.touchPinchDist = dist;

        if (this.viewMode === '2D') {
          this.renderer2D.camera.zoom = Math.max(15, Math.min(220, this.renderer2D.camera.zoom * factor));
        } else {
          this.renderer3D.camera.zoom = Math.max(12, Math.min(120, this.renderer3D.camera.zoom * factor));
        }
        this.requestRender();
      }
    }, { passive: false });

    canvas.addEventListener('touchend', () => {
      if (this.interactionMode === 'move') {
        this.autoSave();
        this.renderAll();
      }
      this.interactionMode = 'none';
    });
  }

  setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      const activeItem = this.getCurrentItems().find(i => i.id === this.selectedItemId);

      // Rotate with 'R'
      if ((e.key === 'r' || e.key === 'R') && activeItem) {
        this.recordHistory('Rotate Item');
        activeItem.rotation = ((activeItem.rotation || 0) + 45) % 360;
        this.renderAll();
        this.autoSave();
        this.showToast(`Rotated to ${activeItem.rotation}°`);
      }

      // Delete with 'Delete' / 'Backspace'
      if ((e.key === 'Delete' || e.key === 'Backspace') && activeItem) {
        this.deleteSelectedItem();
      }

      // Duplicate with 'Ctrl+D'
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        if (activeItem) this.duplicateSelectedItem();
      }

      // Undo / Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        this.redo();
      }

      // Deselect with 'Escape'
      if (e.key === 'Escape') {
        this.closeAllModals();
        if (this.selectedItemId) {
          this.selectedItemId = null;
          this.renderAll();
        }
      }

      // Help with '?'
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        this.openModal('modal-shortcuts');
      }

      // Center with 'C'
      if ((e.key === 'c' || e.key === 'C') && !e.ctrlKey && !e.metaKey) {
        this.centerCamera();
      }

      // Switch 2D/3D with 1 / 2
      if (e.key === '1') {
        document.getElementById('btn-mode-2d')?.click();
      }
      if (e.key === '2') {
        document.getElementById('btn-mode-3d')?.click();
      }
    });
  }

  // --- Scenario Management ---
  updateScenarioTabs() {
    const container = document.getElementById('scenarios-tab-bar');
    if (!container) return;

    const scenarios = Object.values(this.room.scenarios || {});

    container.innerHTML = `
      <div class="flex items-center gap-1" role="tablist" aria-label="Layout scenarios">
        ${scenarios.map(sc => `
          <button class="btn btn-xs ${this.activeScenarioId === sc.id ? 'btn-primary' : 'btn-secondary'} btn-scenario-tab" data-id="${sc.id}" role="tab" aria-selected="${this.activeScenarioId === sc.id}">
            ${escapeHTML(sc.name)}
          </button>
        `).join('')}
        <button class="btn btn-xs btn-secondary" id="btn-add-scenario" title="Duplicate Current Scenario into New Layout">+ Scenario</button>
      </div>
    `;

    container.querySelectorAll('.btn-scenario-tab').forEach(b => {
      b.addEventListener('click', () => {
        this.activeScenarioId = b.dataset.id;
        this.selectedItemId = this.getCurrentItems()[0]?.id || null;
        this.renderAll();
        this.autoSave();
        this.showToast(`Switched to: ${this.room.scenarios[this.activeScenarioId]?.name || 'Layout'}`);
      });
    });

    container.querySelector('#btn-add-scenario')?.addEventListener('click', () => {
      this.duplicateScenario();
    });
  }

  duplicateScenario() {
    this.recordHistory('Duplicate Scenario');
    const current = this.room.scenarios[this.activeScenarioId];
    const newId = 'scenario_' + Math.random().toString(36).substr(2, 6);
    const count = Object.keys(this.room.scenarios).length + 1;

    this.room.scenarios[newId] = {
      id: newId,
      name: `Layout ${String.fromCharCode(64 + count)}`,
      items: JSON.parse(JSON.stringify(current.items || []))
    };

    this.activeScenarioId = newId;
    this.renderAll();
    this.autoSave();
    this.showToast(`Created Layout ${String.fromCharCode(64 + count)}`, 'success');
  }

  // --- Panels ---
  renderCatalog() {
    const container = document.getElementById('furniture-catalog-container');
    if (!container) return;

    renderFurnitureCatalog(container, {
      unit: this.unit,
      currency: this.currency,
      activeCategory: this.catalogCategory,
      searchQuery: this.catalogSearch,
      onCategoryChange: (cat) => {
        this.catalogCategory = cat;
        this.renderCatalog();
      },
      onSearchChange: (q) => {
        this.catalogSearch = q;
        this.renderCatalog();
      },
      onAddItem: (itemDef) => {
        this.recordHistory('Add Furniture Item');
        const newItem = {
          ...itemDef,
          id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          x: snapToGrid(this.room.width / 2, this.gridSnap),
          y: snapToGrid(this.room.depth / 2, this.gridSnap),
          rotation: 0
        };
        this.getCurrentItems().push(newItem);
        this.selectedItemId = newItem.id;
        this.inspectorTab = 'properties';
        this.renderAll();
        this.autoSave();
        this.showToast(`Added ${newItem.name} to plan`, 'success');
      },
      onOpenCustomModal: () => {
        this.openModal('modal-custom-item');
      }
    });
  }

  renderInspector() {
    const container = document.getElementById('property-inspector-container');
    if (!container) return;

    const activeItem = this.getCurrentItems().find(i => i.id === this.selectedItemId);

    renderPropertyInspector(container, {
      room: this.room,
      selectedItem: activeItem,
      activeTab: this.inspectorTab,
      unit: this.unit,
      currency: this.currency,
      onTabChange: (tab) => {
        this.inspectorTab = tab;
        this.renderInspector();
      },
      onUpdateRoom: () => {
        this.renderAll();
        this.autoSave();
      },
      onUpdateItem: () => {
        this.requestRender();
        this.autoSave();
      },
      onDuplicateItem: () => this.duplicateSelectedItem(),
      onDeleteItem: () => this.deleteSelectedItem(),
      onExportBOM: () => this.exportBOMCSV(),
      onCopyBOM: () => this.copyBOMToClipboard(),
      onOpenProjectModal: () => this.openModal('modal-project-info')
    });
  }

  duplicateSelectedItem() {
    const items = this.getCurrentItems();
    const target = items.find(i => i.id === this.selectedItemId);
    if (!target) return;

    this.recordHistory('Duplicate Item');
    const clone = JSON.parse(JSON.stringify(target));
    clone.id = 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    clone.x = Math.min(this.room.width - (clone.width || 1) / 2, target.x + 0.3);
    clone.y = Math.min(this.room.depth - (clone.depth || 1) / 2, target.y + 0.3);

    items.push(clone);
    this.selectedItemId = clone.id;
    this.renderAll();
    this.autoSave();
    this.showToast(`Duplicated: ${clone.name}`, 'success');
  }

  deleteSelectedItem() {
    const items = this.getCurrentItems();
    const target = items.find(i => i.id === this.selectedItemId);
    if (!target) return;

    this.recordHistory('Delete Item');
    this.room.scenarios[this.activeScenarioId].items = items.filter(i => i.id !== this.selectedItemId);
    this.selectedItemId = this.getCurrentItems()[0]?.id || null;
    this.renderAll();
    this.autoSave();
    this.showToast(`Removed: ${target.name}`);
  }

  // --- Bill of Materials Takeoff Exports ---
  exportBOMCSV() {
    const items = this.getCurrentItems();
    const floorMat = FLOOR_MATERIALS[this.room.floorMaterial] || FLOOR_MATERIALS.oak;
    const floorArea = (this.room.width * this.room.depth).toFixed(2);
    const floorCost = (floorArea * (floorMat.costPerSqM || 100)).toFixed(2);

    let csv = `Item No,Item Name,Category,Width (m),Depth (m),Height (m),Finish/Material,Unit Price (${this.currency}),SKU\n`;
    items.forEach((it, idx) => {
      csv += `${idx + 1},"${it.name}","${it.category || 'General'}",${it.width},${it.depth},${it.height || 0.8},"${it.material || 'Standard'}",${it.price || 0},"${it.sku || 'N/A'}"\n`;
    });
    csv += `\nFlooring Finish,"${floorMat.name}",Finishes,${this.room.width},${this.room.depth},0,"${floorMat.name}",${floorCost},"FLR-${floorMat.id.toUpperCase()}"\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(this.room.name || 'room').toLowerCase().replace(/[^a-z0-9]+/g, '_')}_takeoff_schedule.csv`;
    a.click();
    this.showToast('Schedule exported as CSV', 'success');
  }

  copyBOMToClipboard() {
    const items = this.getCurrentItems();
    let text = `ROOMPLANR SCHEDULE: ${this.room.name || 'Room Project'}\n`;
    text += `Client: ${this.room.client || 'Private Client'} | Firm: ${this.room.firm || 'Studio Kōva'}\n`;
    text += `Room: ${this.room.width.toFixed(2)}m × ${this.room.depth.toFixed(2)}m (${(this.room.width * this.room.depth).toFixed(1)} m²)\n\n`;
    text += `ITEMS TAKEOFF:\n`;

    let total = 0;
    items.forEach((it, idx) => {
      text += `${idx + 1}. ${it.name} — ${it.width}m × ${it.depth}m (${it.material || 'Standard'}) - ${formatPrice(it.price || 0, this.currency)}\n`;
      total += (it.price || 0);
    });
    text += `\nTotal Furnishing Cost: ${formatPrice(total, this.currency)}\n`;

    navigator.clipboard.writeText(text).then(() => {
      this.showToast('Takeoff copied to clipboard', 'success');
    }).catch(() => {
      this.showToast('Failed to copy to clipboard', 'error');
    });
  }

  // --- Modal Management ---
  setupModals() {
    // Backdrop click / Close buttons
    document.querySelectorAll('.modal-backdrop, .modal-close-btn').forEach(el => {
      el.addEventListener('click', () => this.closeAllModals());
    });

    document.querySelectorAll('.modal-dialog-content').forEach(el => {
      el.addEventListener('click', (e) => e.stopPropagation());
    });

    // Custom Item Form Submit
    const customForm = document.getElementById('form-create-custom-item');
    customForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('custom-item-name')?.value || 'Custom Fixture';
      const category = document.getElementById('custom-item-cat')?.value || 'Custom';
      const width = parseFloat(document.getElementById('custom-item-width')?.value) || 1.2;
      const depth = parseFloat(document.getElementById('custom-item-depth')?.value) || 0.8;
      const height = parseFloat(document.getElementById('custom-item-height')?.value) || 0.75;
      const material = document.getElementById('custom-item-material')?.value || 'Bespoke Finish';
      const color = document.getElementById('custom-item-color')?.value || '#38bdf8';
      const price = parseFloat(document.getElementById('custom-item-price')?.value) || 500;

      const customItem = {
        id: 'custom_' + Date.now(),
        type: 'custom',
        name,
        category,
        width,
        depth,
        height,
        material,
        color,
        price,
        sku: 'CUS-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
        x: snapToGrid(this.room.width / 2, this.gridSnap),
        y: snapToGrid(this.room.depth / 2, this.gridSnap),
        rotation: 0
      };

      this.recordHistory('Create Custom Item');
      this.getCurrentItems().push(customItem);
      this.selectedItemId = customItem.id;
      this.inspectorTab = 'properties';
      this.renderAll();
      this.autoSave();
      this.closeAllModals();
      this.showToast(`Custom item "${name}" created and placed`, 'success');
    });

    // Project Info Form Submit
    const projectForm = document.getElementById('form-project-settings');
    projectForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.recordHistory('Edit Project Info');
      this.room.name = document.getElementById('proj-input-name')?.value || 'Architectural Project';
      this.room.client = document.getElementById('proj-input-client')?.value || 'Client';
      this.room.firm = document.getElementById('proj-input-firm')?.value || 'Studio Kōva Architecture';
      this.room.address = document.getElementById('proj-input-address')?.value || '';
      this.room.notes = document.getElementById('proj-input-notes')?.value || '';

      this.renderAll();
      this.autoSave();
      this.closeAllModals();
      this.showToast('Project specification updated', 'success');
    });

    // Export High-Res Blueprint
    document.getElementById('btn-export-highres-png')?.addEventListener('click', () => {
      this.exportHighResBlueprint();
      this.closeAllModals();
    });

    // Print Blueprint Sheet
    document.getElementById('btn-print-blueprint')?.addEventListener('click', () => {
      window.print();
    });
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    if (modalId === 'modal-project-info') {
      const nameInp = document.getElementById('proj-input-name');
      const clientInp = document.getElementById('proj-input-client');
      const firmInp = document.getElementById('proj-input-firm');
      const addrInp = document.getElementById('proj-input-address');
      const notesInp = document.getElementById('proj-input-notes');

      if (nameInp) nameInp.value = this.room.name || '';
      if (clientInp) clientInp.value = this.room.client || '';
      if (firmInp) firmInp.value = this.room.firm || '';
      if (addrInp) addrInp.value = this.room.address || '';
      if (notesInp) notesInp.value = this.room.notes || '';
    }

    modal.classList.add('modal-visible');
  }

  closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('modal-visible'));
  }

  exportHighResBlueprint() {
    // Generate high-resolution branded architectural export
    const exportCanvas = document.createElement('canvas');
    const widthPx = 2400;
    const heightPx = 1600;
    exportCanvas.width = widthPx;
    exportCanvas.height = heightPx;
    const ctx = exportCanvas.getContext('2d');

    // Background
    ctx.fillStyle = '#080c14';
    ctx.fillRect(0, 0, widthPx, heightPx);

    // Architectural Border & Title Block
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, widthPx - 60, heightPx - 60);

    // Title Block Box (Bottom)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(30, heightPx - 160, widthPx - 60, 130);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, heightPx - 160, widthPx - 60, 130);

    // Title Block Content
    ctx.fillStyle = '#f8fafc';
    ctx.font = "bold 26px 'Inter', sans-serif";
    ctx.fillText(this.room.name || 'Architectural Floor Plan', 60, heightPx - 105);

    ctx.fillStyle = '#94a3b8';
    ctx.font = "16px 'Inter', sans-serif";
    ctx.fillText(`Client: ${this.room.client || 'Private Residence'}  |  Firm: ${this.room.firm || 'Studio Kōva Architecture'}`, 60, heightPx - 65);
    ctx.fillText(`Location: ${this.room.address || 'Standard Specification'}  |  Active Layout: ${this.room.scenarios[this.activeScenarioId]?.name || 'Layout A'}`, 60, heightPx - 38);

    ctx.fillStyle = '#38bdf8';
    ctx.font = "bold 18px 'JetBrains Mono', monospace";
    ctx.textAlign = 'right';
    ctx.fillText(`Area: ${formatArea(this.room.width * this.room.depth, this.unit)}  |  Scale 1:50 @ A3`, widthPx - 60, heightPx - 105);
    ctx.fillStyle = '#64748b';
    ctx.font = "14px 'JetBrains Mono', monospace";
    ctx.fillText(`Generated by RoomPlanr Spatial Workstation  |  ${new Date().toLocaleDateString()}`, widthPx - 60, heightPx - 65);
    ctx.textAlign = 'left';

    // Render Room into High-Res Center
    const exportRenderer = new Renderer2D(exportCanvas);
    exportRenderer.camera.zoom = Math.min(
      (widthPx - 300) / this.room.width,
      (heightPx - 350) / this.room.depth
    ) * 0.82;
    exportRenderer.camera.x = Math.round((widthPx - this.room.width * exportRenderer.camera.zoom) / 2);
    exportRenderer.camera.y = Math.round((heightPx - 160 - this.room.depth * exportRenderer.camera.zoom) / 2);

    exportRenderer.render({
      room: this.room,
      items: this.getCurrentItems(),
      unit: this.unit,
      showGrid: true,
      showDimensions: true
    });

    const url = exportCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(this.room.name || 'blueprint').toLowerCase().replace(/[^a-z0-9]+/g, '_')}_blueprint.png`;
    a.click();
    this.showToast('High-resolution architectural blueprint exported', 'success');
  }

  // --- History & Persistence ---
  recordHistory(action = 'Edit') {
    this.undoStack.push(JSON.stringify(this.room));
    if (this.undoStack.length > 30) this.undoStack.shift();
    this.redoStack = [];
    this.updateUndoRedoButtons();
  }

  undo() {
    if (this.undoStack.length === 0) return;
    this.redoStack.push(JSON.stringify(this.room));
    this.room = JSON.parse(this.undoStack.pop());
    this.renderAll();
    this.autoSave();
    this.showToast('Undo performed');
  }

  redo() {
    if (this.redoStack.length === 0) return;
    this.undoStack.push(JSON.stringify(this.room));
    this.room = JSON.parse(this.redoStack.pop());
    this.renderAll();
    this.autoSave();
    this.showToast('Redo performed');
  }

  updateUndoRedoButtons() {
    const btnUndo = document.getElementById('btn-undo');
    const btnRedo = document.getElementById('btn-redo');
    if (btnUndo) btnUndo.disabled = this.undoStack.length === 0;
    if (btnRedo) btnRedo.disabled = this.redoStack.length === 0;
  }

  autoSave() {
    db.saveRoom(this.room);
  }

  updateStatusBar(overlapCount = 0) {
    const statusEl = document.getElementById('status-bar-readout');
    if (statusEl) {
      const items = this.getCurrentItems();
      const area = (this.room.width * this.room.depth).toFixed(1);
      statusEl.innerHTML = `Room: <strong>${formatDimension(this.room.width, this.unit)} &times; ${formatDimension(this.room.depth, this.unit)}</strong> (${area} m&sup2;) &bull; Fixtures: <strong>${items.length} items</strong> ${overlapCount > 0 ? `&bull; <span class="text-amber font-bold">&Delta; ${overlapCount} Collision / Boundary Warnings</span>` : ''}`;
    }
  }
}

// Bootstrap
function startRoomPlanr() {
  const app = new RoomPlanrApp();
  window.roomPlanrApp = app;
  app.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startRoomPlanr);
} else {
  startRoomPlanr();
}
