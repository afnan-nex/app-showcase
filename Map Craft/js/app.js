/**
 * MapCraft - Master Cartography Workstation Orchestrator
 * Integrates Canvas 2D Renderer, Tools, Layer System, Inspector, Legend, and Persistence.
 */

import { getIcon, escapeHTML } from './core/icons.js';
import { db } from './core/db.js';
import { MapRenderer } from './engine/renderer.js';
import { MapInteraction } from './engine/interaction.js';
import { renderLayerPanel } from './editor/layer-panel.js';
import { renderInspector } from './editor/inspector.js';
import { renderLegendPanel } from './editor/legend.js';
import { MAP_TEMPLATES } from './editor/templates.js';

class MapCraftApp {
  constructor() {
    this.canvas = document.getElementById('map-canvas');
    this.renderer = new MapRenderer(this.canvas);
    this.interaction = new MapInteraction(this.canvas, this);

    // Active project state
    this.project = JSON.parse(JSON.stringify(MAP_TEMPLATES.fantasy));
    this.activeLayerId = this.project.layers[0]?.id || 'layer_default';
    this.selectedObjectId = null;
    this.selectedObject = null;
    this.hoveredObjectId = null;
    this.activeDrawing = null;

    // UI state
    this.activeSidebarTab = 'layers'; // layers, legend
    this.showGrid = true;
    this.showCompass = true;
    this.showScaleRuler = true;

    // History stack (Undo / Redo)
    this.undoStack = [];
    this.redoStack = [];
    this.maxHistory = 30;
  }

  async init() {
    await db.init();

    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    // Load saved project if exists
    const lastId = localStorage.getItem('mapcraft_last_project_id');
    if (lastId) {
      const saved = await db.loadProject(lastId);
      if (saved && saved.layers && saved.layers.length > 0) {
        this.project = saved;
        this.activeLayerId = this.project.layers[0]?.id || 'layer_default';
      }
    }

    this.setupToolbar();
    this.setupShortcuts();
    this.renderAll();
    this.centerContent();
  }

  handleResize() {
    const container = document.getElementById('map-viewport-container');
    if (container && this.canvas) {
      this.renderer.resize(container.clientWidth, container.clientHeight);
      this.requestRender();
    }
  }

  requestRender() {
    this.renderer.render({
      project: this.project,
      activeLayerId: this.activeLayerId,
      selectedObjectId: this.selectedObjectId,
      hoveredObjectId: this.hoveredObjectId,
      activeDrawing: this.activeDrawing,
      scaleRatio: this.project.scaleRatio || 10,
      scaleUnit: this.project.scaleUnit || 'km',
      themeId: this.project.themeId || 'parchment',
      showGrid: this.showGrid,
      showCompass: this.showCompass,
      showScaleRuler: this.showScaleRuler
    });
  }

  renderAll() {
    this.renderSidebar();
    this.renderInspector();
    this.updateZoomLabel();
    this.updateStats();
    this.requestRender();
  }

  // --- Toolbar Setup ---
  setupToolbar() {
    // Tool buttons
    const toolBtns = document.querySelectorAll('.btn-map-tool');
    toolBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.dataset.tool;
        this.setTool(tool);
      });
    });

    // Theme selector
    const themeSelect = document.getElementById('select-map-theme');
    if (themeSelect) {
      themeSelect.value = this.project.themeId || 'parchment';
      themeSelect.addEventListener('change', (e) => {
        this.project.themeId = e.target.value;
        this.renderAll();
        this.autoSave();
      });
    }

    // Template selector
    document.getElementById('select-map-template')?.addEventListener('change', (e) => {
      const key = e.target.value;
      if (MAP_TEMPLATES[key]) {
        if (confirm(`Load template "${MAP_TEMPLATES[key].name}"? Unsaved changes in current map will be replaced.`)) {
          this.loadProject(JSON.parse(JSON.stringify(MAP_TEMPLATES[key])));
        }
      }
    });

    // Undo / Redo
    document.getElementById('btn-undo')?.addEventListener('click', () => this.undo());
    document.getElementById('btn-redo')?.addEventListener('click', () => this.redo());

    // Zoom buttons
    document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
      this.renderer.camera.zoom = Math.min(10, this.renderer.camera.zoom * 1.25);
      this.requestRender();
      this.updateZoomLabel();
    });
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
      this.renderer.camera.zoom = Math.max(0.1, this.renderer.camera.zoom * 0.8);
      this.requestRender();
      this.updateZoomLabel();
    });
    document.getElementById('btn-zoom-reset')?.addEventListener('click', () => {
      this.renderer.camera.zoom = 1;
      this.requestRender();
      this.updateZoomLabel();
    });
    document.getElementById('btn-fit-content')?.addEventListener('click', () => this.centerContent());

    // Grid toggle
    const gridBtn = document.getElementById('btn-toggle-grid');
    gridBtn?.addEventListener('click', () => {
      this.showGrid = !this.showGrid;
      gridBtn.classList.toggle('active', this.showGrid);
      this.requestRender();
    });

    // Export PNG Image
    document.getElementById('btn-export-png')?.addEventListener('click', () => this.exportPNG());

    // Export JSON
    document.getElementById('btn-export-json')?.addEventListener('click', () => {
      const json = JSON.stringify(this.project, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (this.project.name || 'map').toLowerCase().replace(/\s+/g, '_') + '.mapcraft.json';
      a.click();
    });

    // Import JSON
    const importInput = document.getElementById('file-import-map');
    document.getElementById('btn-import-json')?.addEventListener('click', () => importInput?.click());
    importInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          if (parsed && parsed.layers && Array.isArray(parsed.objects)) {
            this.loadProject(parsed);
          } else {
            alert('Invalid MapCraft project structure.');
          }
        } catch (err) {
          alert('Failed to parse map JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
    });

    // Print Map
    document.getElementById('btn-print-map')?.addEventListener('click', () => {
      window.print();
    });
  }

  setTool(toolName) {
    this.interaction.activeTool = toolName;
    document.querySelectorAll('.btn-map-tool').forEach(b => {
      b.classList.toggle('active', b.dataset.tool === toolName);
    });
  }

  setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      // Escape -> Cancel selection / drawing
      if (e.key === 'Escape') {
        this.selectObject(null);
        this.interaction.finishDrawing();
      }

      // Delete -> Delete selected object
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (this.selectedObjectId) {
          this.deleteObject(this.selectedObjectId);
        }
      }

      // Ctrl+Z / Ctrl+Y -> Undo / Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        this.redo();
      }

      // Tool shortcuts: V = Select, H = Hand, M = Marker, R = Route, P = Polygon, C = Circle, T = Label
      if (e.key === 'v' || e.key === 'V') this.setTool('select');
      if (e.key === 'h' || e.key === 'H') this.setTool('hand');
      if (e.key === 'm' || e.key === 'M') this.setTool('marker');
      if (e.key === 'r' || e.key === 'R') this.setTool('route');
      if (e.key === 'p' || e.key === 'P') this.setTool('region');
      if (e.key === 'c' || e.key === 'C') this.setTool('circle');
      if (e.key === 't' || e.key === 'T') this.setTool('label');
    });
  }

  // --- Object Creation Actions ---
  createMarkerAt(wx, wy) {
    this.recordHistory('Add Marker');
    const marker = {
      id: 'm_' + Date.now(),
      name: 'New Marker ' + (this.project.objects.length + 1),
      type: 'marker',
      layerId: this.activeLayerId,
      category: 'Landmark',
      icon: 'pin',
      color: '#58a6ff',
      size: 28,
      x: wx,
      y: wy,
      notes: ''
    };
    this.project.objects.push(marker);
    this.selectObject(marker.id);
    this.renderAll();
    this.autoSave();
  }

  createRoute(points) {
    this.recordHistory('Add Route');
    const route = {
      id: 'route_' + Date.now(),
      name: 'New Route ' + (this.project.objects.length + 1),
      type: 'route',
      layerId: this.activeLayerId,
      category: 'Trail',
      color: '#e63946',
      width: 3,
      style: 'solid',
      points: JSON.parse(JSON.stringify(points)),
      notes: ''
    };
    this.project.objects.push(route);
    this.selectObject(route.id);
    this.renderAll();
    this.autoSave();
  }

  createRegion(points) {
    this.recordHistory('Add Region');
    const region = {
      id: 'reg_' + Date.now(),
      name: 'New Region ' + (this.project.objects.length + 1),
      type: 'region',
      layerId: this.activeLayerId,
      category: 'Territory',
      fillColor: '#58a6ff',
      strokeColor: '#388bfd',
      opacity: 0.35,
      points: JSON.parse(JSON.stringify(points)),
      notes: ''
    };
    this.project.objects.push(region);
    this.selectObject(region.id);
    this.renderAll();
    this.autoSave();
  }

  createCircle(x, y, radius) {
    this.recordHistory('Add Circle');
    const circle = {
      id: 'circ_' + Date.now(),
      name: 'Zone ' + (this.project.objects.length + 1),
      type: 'circle',
      layerId: this.activeLayerId,
      category: 'Zone',
      fillColor: '#58a6ff',
      strokeColor: '#388bfd',
      radius,
      x,
      y,
      opacity: 0.35,
      notes: ''
    };
    this.project.objects.push(circle);
    this.selectObject(circle.id);
    this.renderAll();
    this.autoSave();
  }

  createLabelAt(wx, wy) {
    this.recordHistory('Add Label');
    const label = {
      id: 'lbl_' + Date.now(),
      name: 'Text Label',
      type: 'label',
      layerId: this.activeLayerId,
      text: 'Label',
      fontSize: 16,
      color: '#3b2f2f',
      x: wx,
      y: wy,
      isBold: true
    };
    this.project.objects.push(label);
    this.selectObject(label.id);
    this.renderAll();
    this.autoSave();
  }

  selectObject(id) {
    this.selectedObjectId = id;
    this.selectedObject = id ? this.project.objects.find(o => o.id === id) || null : null;
    this.renderInspector();
    this.requestRender();
  }

  deleteObject(id) {
    this.recordHistory('Delete Object');
    const idx = this.project.objects.findIndex(o => o.id === id);
    if (idx !== -1) {
      this.project.objects.splice(idx, 1);
      this.selectObject(null);
      this.renderAll();
      this.autoSave();
    }
  }

  duplicateObject(id) {
    const obj = this.project.objects.find(o => o.id === id);
    if (!obj) return;

    this.recordHistory('Duplicate Object');
    const clone = JSON.parse(JSON.stringify(obj));
    clone.id = obj.type.slice(0, 3) + '_' + Date.now();
    clone.name = (obj.name || 'Object') + ' (Copy)';

    if (clone.points) {
      clone.points.forEach(p => { p.x += 30; p.y += 30; });
    } else {
      clone.x = (clone.x || 0) + 30;
      clone.y = (clone.y || 0) + 30;
    }

    this.project.objects.push(clone);
    this.selectObject(clone.id);
    this.renderAll();
    this.autoSave();
  }

  centerOnObject(obj) {
    let targetX = obj.x || 0;
    let targetY = obj.y || 0;

    if (obj.points && obj.points.length > 0) {
      let sx = 0, sy = 0;
      obj.points.forEach(p => { sx += p.x; sy += p.y; });
      targetX = sx / obj.points.length;
      targetY = sy / obj.points.length;
    }

    const cw = this.canvas.width;
    const ch = this.canvas.height;
    this.renderer.camera.x = cw / 2 - targetX * this.renderer.camera.zoom;
    this.renderer.camera.y = ch / 2 - targetY * this.renderer.camera.zoom;
    this.requestRender();
  }

  centerContent() {
    const objects = this.project.objects || [];
    if (objects.length === 0) {
      this.renderer.camera.x = 100;
      this.renderer.camera.y = 100;
      this.renderer.camera.zoom = 1;
      this.requestRender();
      this.updateZoomLabel();
      return;
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const obj of objects) {
      if (obj.points) {
        obj.points.forEach(p => {
          minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
          minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
        });
      } else if (obj.x !== undefined && obj.y !== undefined) {
        const r = obj.radius || obj.size || 20;
        minX = Math.min(minX, obj.x - r); maxX = Math.max(maxX, obj.x + r);
        minY = Math.min(minY, obj.y - r); maxY = Math.max(maxY, obj.y + r);
      }
    }

    const pad = 80;
    const contentW = (maxX - minX) + pad * 2;
    const contentH = (maxY - minY) + pad * 2;
    const cw = this.canvas.width;
    const ch = this.canvas.height;

    const zoom = Math.min(2.5, Math.max(0.2, Math.min(cw / contentW, ch / contentH)));
    this.renderer.camera.zoom = zoom;
    this.renderer.camera.x = cw / 2 - ((minX + maxX) / 2) * zoom;
    this.renderer.camera.y = ch / 2 - ((minY + maxY) / 2) * zoom;

    this.requestRender();
    this.updateZoomLabel();
  }

  // --- Sidebar & Panels ---
  renderSidebar() {
    const container = document.getElementById('sidebar-panel-container');
    if (!container) return;

    if (this.activeSidebarTab === 'layers') {
      renderLayerPanel(container, {
        layers: this.project.layers || [],
        activeLayerId: this.activeLayerId,
        objects: this.project.objects || [],
        onSelectLayer: (id) => {
          this.activeLayerId = id;
          this.renderSidebar();
        },
        onAddLayer: (name) => {
          this.recordHistory('Add Layer');
          const newLayer = { id: 'layer_' + Date.now(), name, visible: true, locked: false };
          this.project.layers.push(newLayer);
          this.activeLayerId = newLayer.id;
          this.renderSidebar();
          this.autoSave();
        },
        onDeleteLayer: (id) => {
          this.recordHistory('Delete Layer');
          this.project.layers = this.project.layers.filter(l => l.id !== id);
          this.project.objects = this.project.objects.filter(o => o.layerId !== id);
          this.activeLayerId = this.project.layers[0]?.id || 'default';
          this.renderAll();
          this.autoSave();
        },
        onToggleVisibility: (id) => {
          const l = this.project.layers.find(x => x.id === id);
          if (l) { l.visible = l.visible === false ? true : false; this.renderAll(); }
        },
        onToggleLock: (id) => {
          const l = this.project.layers.find(x => x.id === id);
          if (l) { l.locked = !l.locked; this.renderSidebar(); }
        },
        onMoveLayer: (idx, dir) => {
          const target = idx + dir;
          if (target >= 0 && target < this.project.layers.length) {
            const temp = this.project.layers[idx];
            this.project.layers[idx] = this.project.layers[target];
            this.project.layers[target] = temp;
            this.renderAll();
            this.autoSave();
          }
        }
      });
    } else {
      renderLegendPanel(container, {
        project: this.project,
        onSelectObject: (id) => this.selectObject(id),
        onCenterObject: (obj) => this.centerOnObject(obj)
      });
    }
  }

  renderInspector() {
    const container = document.getElementById('inspector-panel-container');
    if (!container) return;

    renderInspector(container, {
      selectedObject: this.selectedObject,
      project: this.project,
      onObjectChange: () => {
        this.requestRender();
        this.autoSave();
      },
      onProjectChange: () => {
        this.renderAll();
        this.autoSave();
      },
      onDeleteObject: (id) => this.deleteObject(id),
      onDuplicateObject: (id) => this.duplicateObject(id),
      onCenterObject: (obj) => this.centerOnObject(obj)
    });
  }

  // --- History (Undo / Redo) ---
  recordHistory(actionName = 'Edit') {
    this.undoStack.push(JSON.stringify(this.project));
    if (this.undoStack.length > this.maxHistory) this.undoStack.shift();
    this.redoStack = [];
    this.updateUndoRedoUI();
  }

  undo() {
    if (this.undoStack.length === 0) return;
    this.redoStack.push(JSON.stringify(this.project));
    const previous = JSON.parse(this.undoStack.pop());
    this.project = previous;
    this.selectObject(null);
    this.renderAll();
    this.updateUndoRedoUI();
    this.autoSave();
  }

  redo() {
    if (this.redoStack.length === 0) return;
    this.undoStack.push(JSON.stringify(this.project));
    const next = JSON.parse(this.redoStack.pop());
    this.project = next;
    this.selectObject(null);
    this.renderAll();
    this.updateUndoRedoUI();
    this.autoSave();
  }

  updateUndoRedoUI() {
    const uBtn = document.getElementById('btn-undo');
    const rBtn = document.getElementById('btn-redo');
    if (uBtn) uBtn.disabled = this.undoStack.length === 0;
    if (rBtn) rBtn.disabled = this.redoStack.length === 0;
  }

  // --- Export PNG ---
  exportPNG() {
    const url = this.canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = (this.project.name || 'map').toLowerCase().replace(/\s+/g, '_') + '.png';
    a.click();
  }

  loadProject(projectData) {
    this.project = projectData;
    this.activeLayerId = this.project.layers[0]?.id || 'layer_default';
    this.selectObject(null);
    this.undoStack = [];
    this.redoStack = [];
    this.renderAll();
    this.centerContent();
    this.autoSave();
  }

  autoSave() {
    db.saveProject(this.project);
    this.updateStats();
  }

  updateZoomLabel() {
    const zLabel = document.getElementById('zoom-percentage-label');
    if (zLabel) {
      zLabel.textContent = Math.round(this.renderer.camera.zoom * 100) + '%';
    }
  }

  updateCoordinates(wx, wy) {
    const coordEl = document.getElementById('map-coordinates-readout');
    if (coordEl) {
      coordEl.textContent = `X: ${wx}, Y: ${wy}`;
    }
  }

  updateStats() {
    const statsEl = document.getElementById('map-stats-readout');
    if (statsEl) {
      const objCount = (this.project.objects || []).length;
      const layerCount = (this.project.layers || []).length;
      statsEl.innerHTML = `Elements: <strong>${objCount}</strong> &bull; Layers: <strong>${layerCount}</strong>`;
    }
  }
}

// Bootstrap
function startMapCraft() {
  const app = new MapCraftApp();
  window.mapCraftApp = app;
  app.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startMapCraft);
} else {
  startMapCraft();
}
