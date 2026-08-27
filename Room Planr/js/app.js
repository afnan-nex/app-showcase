/**
 * RoomPlanr - Master Application Orchestrator
 * Integrates 2D CAD Floor Plan, 3D Isometric Renderer, Collision Engine, Catalog, and Scenarios.
 */

import { getIcon, escapeHTML } from './core/icons.js';
import { db } from './core/db.js';
import { UNITS, formatDimension, snapToGrid } from './core/units.js';
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
    this.gridSnap = 0.10; // 10cm grid
    this.showGrid = true;
    this.showDimensions = true;

    // Pointer Interaction Modes
    this.interactionMode = 'none'; // 'none', 'move', 'rotate', 'resize', 'pan'
    this.resizeCorner = null; // 'nw', 'ne', 'se', 'sw'
    this.panStart = { x: 0, y: 0 };
    this.dragOffset = { x: 0, y: 0 };
    this.initialTransform = { x: 0, y: 0, width: 1, depth: 1, rotation: 0 };

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
    this.setupShortcuts();
    this.renderAll();
    this.centerCamera();
  }

  getCurrentItems() {
    if (!this.room.scenarios || !this.room.scenarios[this.activeScenarioId]) {
      this.room.scenarios = { scenario_a: { id: 'scenario_a', name: 'Layout A', items: [] } };
      this.activeScenarioId = 'scenario_a';
    }
    return this.room.scenarios[this.activeScenarioId].items || [];
  }

  handleResize() {
    const container = document.getElementById('canvas-workspace-wrap');
    if (container && this.canvas) {
      this.renderer2D.resize(container.clientWidth, container.clientHeight);
      this.renderer3D.resize(container.clientWidth, container.clientHeight);
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
    this.requestRender();
  }

  centerCamera() {
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    const rw = this.room.width;
    const rd = this.room.depth;
    const zoom = this.renderer2D.camera.zoom;

    this.renderer2D.camera.x = Math.round((cw - rw * zoom) / 2);
    this.renderer2D.camera.y = Math.round((ch - rd * zoom) / 2);
    this.renderer3D.camera.x = 0;
    this.renderer3D.camera.y = 0;
    this.requestRender();
  }

  // --- Toolbar Setup ---
  setupToolbar() {
    // 2D / 3D Mode Toggle Buttons
    document.getElementById('btn-mode-2d')?.addEventListener('click', () => {
      this.viewMode = '2D';
      document.getElementById('btn-mode-2d').classList.add('active');
      document.getElementById('btn-mode-3d').classList.remove('active');
      this.requestRender();
    });

    document.getElementById('btn-mode-3d')?.addEventListener('click', () => {
      this.viewMode = '3D';
      document.getElementById('btn-mode-3d').classList.add('active');
      document.getElementById('btn-mode-2d').classList.remove('active');
      this.requestRender();
    });

    // Sample Room Selector
    document.getElementById('select-sample-room')?.addEventListener('change', (e) => {
      const key = e.target.value;
      if (SAMPLE_ROOMS[key]) {
        this.room = JSON.parse(JSON.stringify(SAMPLE_ROOMS[key]));
        this.activeScenarioId = this.room.activeScenarioId || Object.keys(this.room.scenarios)[0];
        this.selectedItemId = this.getCurrentItems()[0]?.id || null;
        this.centerCamera();
        this.renderAll();
        this.autoSave();
      }
    });

    // Unit Selector
    document.getElementById('select-display-unit')?.addEventListener('change', (e) => {
      this.unit = e.target.value;
      this.renderAll();
    });

    // Grid Snapping Selector
    document.getElementById('select-grid-snap')?.addEventListener('change', (e) => {
      this.gridSnap = parseFloat(e.target.value);
    });

    // Undo / Redo
    document.getElementById('btn-undo')?.addEventListener('click', () => this.undo());
    document.getElementById('btn-redo')?.addEventListener('click', () => this.redo());

    // Zoom Controls
    document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
      this.renderer2D.camera.zoom = Math.min(180, this.renderer2D.camera.zoom * 1.2);
      this.renderer3D.camera.zoom = Math.min(100, this.renderer3D.camera.zoom * 1.2);
      this.requestRender();
    });
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
      this.renderer2D.camera.zoom = Math.max(20, this.renderer2D.camera.zoom * 0.8);
      this.renderer3D.camera.zoom = Math.max(15, this.renderer3D.camera.zoom * 0.8);
      this.requestRender();
    });
    document.getElementById('btn-center-room')?.addEventListener('click', () => this.centerCamera());

    // Export Floor Plan Snapshot
    document.getElementById('btn-export-plan-image')?.addEventListener('click', () => {
      const url = this.canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = (this.room.name || 'room_plan').toLowerCase().replace(/\s+/g, '_') + `_${this.viewMode.toLowerCase()}.png`;
      a.click();
    });

    // Export Project JSON
    document.getElementById('btn-export-plan-json')?.addEventListener('click', () => {
      const json = JSON.stringify(this.room, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (this.room.name || 'room_project').toLowerCase().replace(/\s+/g, '_') + '.roomplanr.json';
      a.click();
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
          if (parsed && parsed.width && parsed.scenarios) {
            this.room = parsed;
            this.activeScenarioId = this.room.activeScenarioId || Object.keys(this.room.scenarios)[0];
            this.selectedItemId = this.getCurrentItems()[0]?.id || null;
            this.centerCamera();
            this.renderAll();
            this.autoSave();
          } else {
            alert('Invalid RoomPlanr project structure.');
          }
        } catch (err) {
          alert('Failed to parse project JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
    });
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

      // Pan with Middle Click or Shift/Alt Drag
      if (e.button === 1 || e.shiftKey || e.altKey) {
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
        // Rotation handle world pos
        const hx = activeItem.x + Math.sin(rad) * (activeItem.depth / 2 + rotDist);
        const hy = activeItem.y - Math.cos(rad) * (activeItem.depth / 2 + rotDist);

        const distToRot = Math.hypot(wx - hx, wy - hy);
        if (distToRot <= 12 / scale) {
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

          // Snap to 15 degrees
          degrees = Math.round(degrees / 15) * 15;
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
        const newZoom = Math.max(20, Math.min(180, oldZoom * zoomFactor));

        this.renderer2D.camera.x = sx - (sx - this.renderer2D.camera.x) * (newZoom / oldZoom);
        this.renderer2D.camera.y = sy - (sy - this.renderer2D.camera.y) * (newZoom / oldZoom);
        this.renderer2D.camera.zoom = newZoom;
      } else {
        this.renderer3D.camera.zoom = Math.max(15, Math.min(100, this.renderer3D.camera.zoom * zoomFactor));
      }

      this.requestRender();
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
    });
  }

  // --- Scenario Management ---
  updateScenarioTabs() {
    const container = document.getElementById('scenarios-tab-bar');
    if (!container) return;

    const scenarios = Object.values(this.room.scenarios || {});

    container.innerHTML = `
      <div class="flex items-center gap-1">
        ${scenarios.map(sc => `
          <button class="btn btn-xs ${this.activeScenarioId === sc.id ? 'btn-primary' : 'btn-secondary'} btn-scenario-tab" data-id="${sc.id}">
            ${escapeHTML(sc.name)}
          </button>
        `).join('')}
        <button class="btn btn-xs btn-secondary" id="btn-add-scenario" title="Duplicate Active Scenario">+ Scenario</button>
      </div>
    `;

    container.querySelectorAll('.btn-scenario-tab').forEach(b => {
      b.addEventListener('click', () => {
        this.activeScenarioId = b.dataset.id;
        this.selectedItemId = this.getCurrentItems()[0]?.id || null;
        this.renderAll();
        this.autoSave();
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
  }

  // --- Panels ---
  renderCatalog() {
    const container = document.getElementById('furniture-catalog-container');
    if (!container) return;

    renderFurnitureCatalog(container, {
      unit: this.unit,
      onAddItem: (itemDef) => {
        this.recordHistory('Add Item');
        const newItem = {
          ...itemDef,
          id: 'item_' + Date.now(),
          x: snapToGrid(this.room.width / 2, this.gridSnap),
          y: snapToGrid(this.room.depth / 2, this.gridSnap),
          rotation: 0
        };
        this.getCurrentItems().push(newItem);
        this.selectedItemId = newItem.id;
        this.renderAll();
        this.autoSave();
      },
      onOpenCustomModal: () => {
        const name = prompt('Enter custom furniture name:', 'Custom Work Desk');
        if (!name) return;
        const w = parseFloat(prompt('Enter width in meters:', '1.50')) || 1.5;
        const d = parseFloat(prompt('Enter depth in meters:', '0.80')) || 0.8;

        const customItem = {
          id: 'item_' + Date.now(),
          type: 'custom',
          name,
          category: 'Custom',
          width: w,
          depth: d,
          height: 0.85,
          color: '#38bdf8',
          material: 'Custom Finish',
          x: snapToGrid(this.room.width / 2, this.gridSnap),
          y: snapToGrid(this.room.depth / 2, this.gridSnap),
          rotation: 0
        };

        this.getCurrentItems().push(customItem);
        this.selectedItemId = customItem.id;
        this.renderAll();
        this.autoSave();
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
      unit: this.unit,
      onUpdateRoom: () => {
        this.renderAll();
        this.autoSave();
      },
      onUpdateItem: () => {
        this.requestRender();
        this.autoSave();
      },
      onDuplicateItem: () => this.duplicateSelectedItem(),
      onDeleteItem: () => this.deleteSelectedItem()
    });
  }

  duplicateSelectedItem() {
    const items = this.getCurrentItems();
    const target = items.find(i => i.id === this.selectedItemId);
    if (!target) return;

    this.recordHistory('Duplicate Item');
    const clone = JSON.parse(JSON.stringify(target));
    clone.id = 'item_' + Date.now();
    clone.x = Math.min(this.room.width - clone.width / 2, target.x + 0.3);
    clone.y = Math.min(this.room.depth - clone.depth / 2, target.y + 0.3);

    items.push(clone);
    this.selectedItemId = clone.id;
    this.renderAll();
    this.autoSave();
  }

  deleteSelectedItem() {
    const items = this.getCurrentItems();
    this.recordHistory('Delete Item');
    this.room.scenarios[this.activeScenarioId].items = items.filter(i => i.id !== this.selectedItemId);
    this.selectedItemId = this.getCurrentItems()[0]?.id || null;
    this.renderAll();
    this.autoSave();
  }

  // --- History & Persistence ---
  recordHistory(action = 'Edit') {
    this.undoStack.push(JSON.stringify(this.room));
    if (this.undoStack.length > 25) this.undoStack.shift();
    this.redoStack = [];
  }

  undo() {
    if (this.undoStack.length === 0) return;
    this.redoStack.push(JSON.stringify(this.room));
    this.room = JSON.parse(this.undoStack.pop());
    this.renderAll();
    this.autoSave();
  }

  redo() {
    if (this.redoStack.length === 0) return;
    this.undoStack.push(JSON.stringify(this.room));
    this.room = JSON.parse(this.redoStack.pop());
    this.renderAll();
    this.autoSave();
  }

  autoSave() {
    db.saveRoom(this.room);
  }

  updateStatusBar(overlapCount = 0) {
    const statusEl = document.getElementById('status-bar-readout');
    if (statusEl) {
      const items = this.getCurrentItems();
      statusEl.innerHTML = `Room: <strong>${formatDimension(this.room.width, this.unit)} &times; ${formatDimension(this.room.depth, this.unit)}</strong> (${(this.room.width * this.room.depth).toFixed(1)} m&sup2;) &bull; Furniture: <strong>${items.length} items</strong> ${overlapCount > 0 ? `&bull; <span class="text-amber font-bold">&Delta; ${overlapCount} Collision/Boundary Overlaps</span>` : ''}`;
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
