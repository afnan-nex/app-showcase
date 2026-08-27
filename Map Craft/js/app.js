/**
 * MapCraft - Master Cartography Workstation Orchestrator
 * Integrates Canvas 2D Renderer, Tools, Layer Hierarchy, Properties Inspector,
 * SVG & PNG Exporters, IndexedDB persistence, and Responsive Studio Workspace.
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
    this.activeLayerId = this.project.layers[0]?.id || 'layer_territories';
    this.selectedObjectId = null;
    this.selectedObject = null;
    this.hoveredObjectId = null;
    this.activeDrawing = null;

    // UI state
    this.activeSidebarTab = 'layers'; // layers, legend
    this.showGrid = true;
    this.snapToGridEnabled = false;
    this.showCompass = true;
    this.showScaleRuler = true;
    this.isSpacePressed = false;

    // History stack (Undo / Redo)
    this.undoStack = [];
    this.redoStack = [];
    this.maxHistory = 40;
  }

  async init() {
    await db.init();

    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    // Load saved project if exists
    try {
      const lastId = localStorage.getItem('mapcraft_last_project_id');
      if (lastId) {
        const saved = await db.loadProject(lastId);
        if (saved && saved.layers && saved.layers.length > 0) {
          this.project = saved;
          this.activeLayerId = this.project.layers[0]?.id || 'layer_default';
        }
      }
    } catch (e) {
      console.warn('Storage load error:', e);
    }

    this.setupToolbar();
    this.setupShortcuts();
    this.setupModals();
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
      selectedVertexIndex: this.interaction.selectedVertexIndex,
      hoveredObjectId: this.hoveredObjectId,
      activeDrawing: this.activeDrawing,
      scaleRatio: this.project.scaleRatio || 10,
      scaleUnit: this.project.scaleUnit || 'km',
      themeId: this.project.themeId || 'parchment',
      gridType: this.project.gridType || 'square',
      gridSize: this.project.gridSize || 50,
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
        this.showToast(`Theme changed to ${e.target.options[e.target.selectedIndex].text}`);
      });
    }

    // Template selector
    const templateSelect = document.getElementById('select-map-template');
    if (templateSelect) {
      templateSelect.addEventListener('change', (e) => {
        const key = e.target.value;
        if (MAP_TEMPLATES[key]) {
          if (confirm(`Load template "${MAP_TEMPLATES[key].name}"? Unsaved changes in the current map will be replaced.`)) {
            this.loadProject(JSON.parse(JSON.stringify(MAP_TEMPLATES[key])));
            this.showToast(`Loaded map template "${MAP_TEMPLATES[key].name}"`);
          }
        }
      });
    }

    // Undo / Redo
    document.getElementById('btn-undo')?.addEventListener('click', () => this.undo());
    document.getElementById('btn-redo')?.addEventListener('click', () => this.redo());

    // Zoom buttons
    document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
      this.renderer.camera.zoom = Math.min(12, this.renderer.camera.zoom * 1.25);
      this.requestRender();
      this.updateZoomLabel();
    });
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
      this.renderer.camera.zoom = Math.max(0.08, this.renderer.camera.zoom * 0.8);
      this.requestRender();
      this.updateZoomLabel();
    });
    document.getElementById('btn-zoom-percentage-label')?.addEventListener('click', () => {
      this.renderer.camera.zoom = 1;
      this.requestRender();
      this.updateZoomLabel();
    });
    document.getElementById('btn-fit-content')?.addEventListener('click', () => this.centerContent());

    // Grid toggle & Snap toggle
    const gridBtn = document.getElementById('btn-toggle-grid');
    gridBtn?.addEventListener('click', () => {
      this.showGrid = !this.showGrid;
      gridBtn.classList.toggle('active', this.showGrid);
      this.requestRender();
      this.showToast(this.showGrid ? 'Cartographic grid visible' : 'Cartographic grid hidden');
    });

    const snapBtn = document.getElementById('btn-toggle-snap');
    snapBtn?.addEventListener('click', () => {
      this.snapToGridEnabled = !this.snapToGridEnabled;
      snapBtn.classList.toggle('active', this.snapToGridEnabled);
      this.showToast(this.snapToGridEnabled ? 'Snap to Grid ON' : 'Snap to Grid OFF');
    });

    // Modals trigger buttons
    document.getElementById('btn-open-export-modal')?.addEventListener('click', () => this.openModal('modal-export'));
    document.getElementById('btn-open-settings-modal')?.addEventListener('click', () => this.openModal('modal-settings'));
    document.getElementById('btn-open-help-modal')?.addEventListener('click', () => this.openModal('modal-help'));

    // Sidebar Toggles for Responsive View
    document.getElementById('btn-toggle-left-sidebar')?.addEventListener('click', () => {
      document.querySelector('.map-sidebar-left')?.classList.toggle('collapsed');
      setTimeout(() => this.handleResize(), 200);
    });
    document.getElementById('btn-toggle-right-inspector')?.addEventListener('click', () => {
      document.querySelector('.map-inspector-right')?.classList.toggle('collapsed');
      setTimeout(() => this.handleResize(), 200);
    });

    // Import File input
    const importInput = document.getElementById('file-import-map');
    importInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          if (parsed && parsed.layers && Array.isArray(parsed.objects)) {
            this.loadProject(parsed);
            this.showToast(`Imported project: "${parsed.name || 'Map'}"`);
          } else {
            alert('Invalid MapCraft project structure.');
          }
        } catch (err) {
          alert('Failed to parse map JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
      importInput.value = '';
    });
  }

  setTool(toolName) {
    this.interaction.activeTool = toolName;
    document.querySelectorAll('.btn-map-tool').forEach(b => {
      b.classList.toggle('active', b.dataset.tool === toolName);
    });

    const cursorMap = {
      select: 'default',
      hand: 'grab',
      marker: 'crosshair',
      route: 'crosshair',
      region: 'crosshair',
      circle: 'crosshair',
      label: 'text',
      measure: 'crosshair'
    };
    const vp = document.getElementById('map-viewport-container');
    if (vp) vp.style.cursor = cursorMap[toolName] || 'crosshair';
  }

  setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      // Spacebar pan mode
      if (e.code === 'Space' && !this.isSpacePressed) {
        this.isSpacePressed = true;
        const vp = document.getElementById('map-viewport-container');
        if (vp) vp.style.cursor = 'grab';
      }

      // Escape -> Cancel selection or active drawing
      if (e.key === 'Escape') {
        this.selectObject(null);
        this.interaction.finishDrawing();
        this.closeAllModals();
      }

      // Enter -> Complete active drawing
      if (e.key === 'Enter' && this.interaction.drawingPoints.length > 0) {
        if (this.interaction.activeTool === 'route' && this.interaction.drawingPoints.length >= 2) {
          this.createRoute(this.interaction.drawingPoints);
          this.interaction.finishDrawing();
        } else if (this.interaction.activeTool === 'region' && this.interaction.drawingPoints.length >= 3) {
          this.createRegion(this.interaction.drawingPoints);
          this.interaction.finishDrawing();
        } else if (this.interaction.activeTool === 'measure') {
          this.interaction.finishDrawing();
        }
      }

      // Delete -> Delete selected object
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (this.interaction.drawingPoints.length > 0) {
          this.interaction.drawingPoints.pop();
          if (this.interaction.drawingPoints.length === 0) this.interaction.finishDrawing();
          else this.requestRender();
          return;
        }
        if (this.selectedObjectId) {
          this.deleteObject(this.selectedObjectId);
        }
      }

      // Duplicate (Ctrl+D)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (this.selectedObjectId) {
          this.duplicateObject(this.selectedObjectId);
        }
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

      // Arrow keys micro-nudge selected object
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && this.selectedObject) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const dx = e.key === 'ArrowLeft' ? -step : (e.key === 'ArrowRight' ? step : 0);
        const dy = e.key === 'ArrowUp' ? -step : (e.key === 'ArrowDown' ? step : 0);

        if (this.selectedObject.points) {
          this.selectedObject.points.forEach(p => { p.x += dx; p.y += dy; });
        } else {
          this.selectedObject.x = (this.selectedObject.x || 0) + dx;
          this.selectedObject.y = (this.selectedObject.y || 0) + dy;
        }
        this.requestRender();
        this.renderInspector();
        this.autoSave();
      }

      // Tool hotkeys
      if (e.key === 'v' || e.key === 'V') this.setTool('select');
      if (e.key === 'h' || e.key === 'H') this.setTool('hand');
      if (e.key === 'm' || e.key === 'M') this.setTool('marker');
      if (e.key === 'r' || e.key === 'R') this.setTool('route');
      if (e.key === 'p' || e.key === 'P') this.setTool('region');
      if (e.key === 'c' || e.key === 'C') this.setTool('circle');
      if (e.key === 't' || e.key === 'T') this.setTool('label');
      if (e.key === 'x' || e.key === 'X') this.setTool('measure');
      if (e.key === 's' || e.key === 'S') {
        this.snapToGridEnabled = !this.snapToGridEnabled;
        document.getElementById('btn-toggle-snap')?.classList.toggle('active', this.snapToGridEnabled);
        this.showToast(this.snapToGridEnabled ? 'Snap ON' : 'Snap OFF');
      }
      if (e.key === 'g' || e.key === 'G') {
        this.showGrid = !this.showGrid;
        document.getElementById('btn-toggle-grid')?.classList.toggle('active', this.showGrid);
        this.requestRender();
      }
      if (e.key === '?') this.openModal('modal-help');
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        this.isSpacePressed = false;
        this.setTool(this.interaction.activeTool);
      }
    });
  }

  // --- Modals Setup ---
  setupModals() {
    // Close modal triggers
    document.querySelectorAll('.btn-close-modal, .modal-backdrop').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target === el) this.closeAllModals();
      });
    });

    // Export Modal Actions
    document.getElementById('btn-do-export-png-1x')?.addEventListener('click', () => {
      this.exportPNG(1);
      this.closeAllModals();
    });
    document.getElementById('btn-do-export-png-2x')?.addEventListener('click', () => {
      this.exportPNG(2);
      this.closeAllModals();
    });
    document.getElementById('btn-do-export-svg')?.addEventListener('click', () => {
      this.exportSVG();
      this.closeAllModals();
    });
    document.getElementById('btn-do-export-json')?.addEventListener('click', () => {
      this.exportJSON();
      this.closeAllModals();
    });
    document.getElementById('btn-do-export-geojson')?.addEventListener('click', () => {
      this.exportGeoJSON();
      this.closeAllModals();
    });
    document.getElementById('btn-do-print')?.addEventListener('click', () => {
      window.print();
      this.closeAllModals();
    });
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
    }
  }

  closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  }

  // --- Object Creation Actions ---
  createMarkerAt(wx, wy) {
    this.recordHistory('Add Marker');
    const marker = {
      id: 'm_' + Date.now(),
      name: 'Marker ' + (this.project.objects.length + 1),
      type: 'marker',
      layerId: this.activeLayerId,
      category: 'Landmark',
      icon: 'pin',
      color: '#38bdf8',
      size: 28,
      x: wx,
      y: wy,
      notes: ''
    };
    this.project.objects.push(marker);
    this.selectObject(marker.id);
    this.renderAll();
    this.autoSave();
    this.showToast(`Placed Marker: "${marker.name}"`);
  }

  createRoute(points) {
    this.recordHistory('Add Route');
    const route = {
      id: 'route_' + Date.now(),
      name: 'Route ' + (this.project.objects.length + 1),
      type: 'route',
      layerId: this.activeLayerId,
      category: 'Trail',
      color: '#e63946',
      width: 3.5,
      style: 'solid',
      hasArrow: true,
      points: JSON.parse(JSON.stringify(points)),
      notes: ''
    };
    this.project.objects.push(route);
    this.selectObject(route.id);
    this.renderAll();
    this.autoSave();
    this.showToast(`Created Route with ${points.length} waypoints`);
  }

  createRegion(points) {
    this.recordHistory('Add Region');
    const region = {
      id: 'reg_' + Date.now(),
      name: 'Region ' + (this.project.objects.length + 1),
      type: 'region',
      layerId: this.activeLayerId,
      category: 'Territory',
      fillColor: '#38bdf8',
      strokeColor: '#0284c7',
      strokeWidth: 2,
      opacity: 0.35,
      pattern: 'solid',
      points: JSON.parse(JSON.stringify(points)),
      notes: ''
    };
    this.project.objects.push(region);
    this.selectObject(region.id);
    this.renderAll();
    this.autoSave();
    this.showToast(`Drawn Region with ${points.length} vertices`);
  }

  createCircle(x, y, radius) {
    this.recordHistory('Add Circle Zone');
    const circle = {
      id: 'circ_' + Date.now(),
      name: 'Zone ' + (this.project.objects.length + 1),
      type: 'circle',
      layerId: this.activeLayerId,
      category: 'Zone',
      fillColor: '#38bdf8',
      strokeColor: '#0284c7',
      strokeWidth: 2,
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
    this.showToast(`Placed Circular Zone (${radius}px radius)`);
  }

  createLabelAt(wx, wy) {
    this.recordHistory('Add Label');
    const label = {
      id: 'lbl_' + Date.now(),
      name: 'Text Label',
      type: 'label',
      layerId: this.activeLayerId,
      text: 'New Label',
      fontSize: 16,
      fontFamily: "'Inter', sans-serif",
      color: '#0f172a',
      x: wx,
      y: wy,
      rotation: 0,
      isBold: true
    };
    this.project.objects.push(label);
    this.selectObject(label.id);
    this.renderAll();
    this.autoSave();
    this.showToast(`Placed Label: "${label.text}"`);
  }

  selectObject(id) {
    this.selectedObjectId = id;
    this.selectedObject = id ? this.project.objects.find(o => o.id === id) || null : null;
    this.interaction.selectedVertexIndex = null;
    this.renderInspector();
    this.requestRender();
  }

  deleteObject(id) {
    this.recordHistory('Delete Element');
    const idx = this.project.objects.findIndex(o => o.id === id);
    if (idx !== -1) {
      const removed = this.project.objects.splice(idx, 1)[0];
      this.selectObject(null);
      this.renderAll();
      this.autoSave();
      this.showToast(`Deleted "${removed.name || removed.type}"`);
    }
  }

  duplicateObject(id) {
    const obj = this.project.objects.find(o => o.id === id);
    if (!obj) return;

    this.recordHistory('Duplicate Element');
    const clone = JSON.parse(JSON.stringify(obj));
    clone.id = obj.type.slice(0, 3) + '_' + Date.now();
    clone.name = (obj.name || 'Element') + ' (Copy)';

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
    this.showToast(`Duplicated "${clone.name}"`);
  }

  reorderObject(id, action) {
    const objs = this.project.objects;
    const idx = objs.findIndex(o => o.id === id);
    if (idx === -1) return;

    this.recordHistory('Reorder Stacking');
    const item = objs.splice(idx, 1)[0];

    if (action === 'front') {
      objs.push(item);
    } else if (action === 'back') {
      objs.unshift(item);
    } else if (action === 'forward') {
      const target = Math.min(objs.length, idx + 1);
      objs.splice(target, 0, item);
    } else if (action === 'backward') {
      const target = Math.max(0, idx - 1);
      objs.splice(target, 0, item);
    }

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

    const cw = this.canvas.width / this.renderer.dpr;
    const ch = this.canvas.height / this.renderer.dpr;
    this.renderer.camera.x = cw / 2 - targetX * this.renderer.camera.zoom;
    this.renderer.camera.y = ch / 2 - targetY * this.renderer.camera.zoom;
    this.requestRender();
  }

  centerContent() {
    const objects = this.project.objects || [];
    const cw = this.canvas.width / this.renderer.dpr;
    const ch = this.canvas.height / this.renderer.dpr;

    if (objects.length === 0) {
      this.renderer.camera.x = cw / 2;
      this.renderer.camera.y = ch / 2;
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
        const r = obj.radius || obj.size || 25;
        minX = Math.min(minX, obj.x - r); maxX = Math.max(maxX, obj.x + r);
        minY = Math.min(minY, obj.y - r); maxY = Math.max(maxY, obj.y + r);
      }
    }

    const pad = 100;
    const contentW = Math.max(100, (maxX - minX) + pad * 2);
    const contentH = Math.max(100, (maxY - minY) + pad * 2);

    const zoom = Math.min(2.5, Math.max(0.15, Math.min(cw / contentW, ch / contentH)));
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
          this.showToast(`Added layer "${name}"`);
        },
        onRenameLayer: (id, name) => {
          const l = this.project.layers.find(x => x.id === id);
          if (l) {
            this.recordHistory('Rename Layer');
            l.name = name;
            this.renderSidebar();
            this.autoSave();
          }
        },
        onDuplicateLayer: (id) => {
          const l = this.project.layers.find(x => x.id === id);
          if (!l) return;
          this.recordHistory('Duplicate Layer');
          const newId = 'layer_' + Date.now();
          const cloneLayer = { ...l, id: newId, name: l.name + ' (Copy)' };
          this.project.layers.push(cloneLayer);

          // Duplicate all objects on this layer
          const layerObjs = this.project.objects.filter(o => o.layerId === id);
          for (const o of layerObjs) {
            const cloneObj = JSON.parse(JSON.stringify(o));
            cloneObj.id = o.type.slice(0, 3) + '_' + Math.random().toString(36).substr(2, 9);
            cloneObj.layerId = newId;
            if (cloneObj.points) {
              cloneObj.points.forEach(p => { p.x += 20; p.y += 20; });
            } else {
              cloneObj.x = (cloneObj.x || 0) + 20;
              cloneObj.y = (cloneObj.y || 0) + 20;
            }
            this.project.objects.push(cloneObj);
          }

          this.activeLayerId = newId;
          this.renderAll();
          this.autoSave();
          this.showToast(`Duplicated layer "${cloneLayer.name}"`);
        },
        onDeleteLayer: (id) => {
          this.recordHistory('Delete Layer');
          this.project.layers = this.project.layers.filter(l => l.id !== id);
          this.project.objects = this.project.objects.filter(o => o.layerId !== id);
          this.activeLayerId = this.project.layers[0]?.id || 'layer_default';
          this.renderAll();
          this.autoSave();
          this.showToast('Layer deleted');
        },
        onToggleVisibility: (id) => {
          const l = this.project.layers.find(x => x.id === id);
          if (l) {
            l.visible = l.visible === false ? true : false;
            this.renderAll();
          }
        },
        onToggleLock: (id) => {
          const l = this.project.layers.find(x => x.id === id);
          if (l) {
            l.locked = !l.locked;
            this.renderSidebar();
          }
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
      onCenterObject: (obj) => this.centerOnObject(obj),
      onReorderObject: (id, action) => this.reorderObject(id, action)
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
    this.showToast('Undo');
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
    this.showToast('Redo');
  }

  updateUndoRedoUI() {
    const uBtn = document.getElementById('btn-undo');
    const rBtn = document.getElementById('btn-redo');
    if (uBtn) uBtn.disabled = this.undoStack.length === 0;
    if (rBtn) rBtn.disabled = this.redoStack.length === 0;
  }

  // --- Export Engines ---
  exportPNG(scaleMultiplier = 1) {
    const originalDpr = this.renderer.dpr;
    const cw = this.canvas.width / originalDpr;
    const ch = this.canvas.height / originalDpr;

    // Create off-screen canvas at requested scale
    const offCanvas = document.createElement('canvas');
    offCanvas.width = Math.round(cw * scaleMultiplier);
    offCanvas.height = Math.round(ch * scaleMultiplier);

    const offRenderer = new MapRenderer(offCanvas);
    offRenderer.dpr = scaleMultiplier;
    offRenderer.camera = { ...this.renderer.camera };

    offRenderer.render({
      project: this.project,
      activeLayerId: this.activeLayerId,
      selectedObjectId: null,
      hoveredObjectId: null,
      activeDrawing: null,
      scaleRatio: this.project.scaleRatio || 10,
      scaleUnit: this.project.scaleUnit || 'km',
      themeId: this.project.themeId || 'parchment',
      gridType: this.project.gridType || 'square',
      gridSize: this.project.gridSize || 50,
      showGrid: this.showGrid,
      showCompass: this.showCompass,
      showScaleRuler: this.showScaleRuler
    });

    const url = offCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = (this.project.name || 'map').toLowerCase().replace(/\s+/g, '_') + `@${scaleMultiplier}x.png`;
    a.click();
    this.showToast(`Exported ${scaleMultiplier}x High-Res PNG`);
  }

  exportSVG() {
    const w = this.canvas.width / this.renderer.dpr;
    const h = this.canvas.height / this.renderer.dpr;
    const cam = this.renderer.camera;

    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">\n`;
    svgContent += `  <rect width="100%" height="100%" fill="#f2e6cf" />\n`;
    svgContent += `  <g transform="translate(${cam.x}, ${cam.y}) scale(${cam.zoom})">\n`;

    for (const obj of this.project.objects || []) {
      if (obj.visible === false) continue;

      if (obj.type === 'region' && obj.points) {
        const ptsStr = obj.points.map(p => `${p.x},${p.y}`).join(' ');
        svgContent += `    <polygon points="${ptsStr}" fill="${obj.fillColor || '#38bdf8'}" fill-opacity="${obj.opacity || 0.35}" stroke="${obj.strokeColor || '#0284c7'}" stroke-width="${obj.strokeWidth || 2}" />\n`;
      } else if (obj.type === 'circle') {
        svgContent += `    <circle cx="${obj.x}" cy="${obj.y}" r="${obj.radius || 50}" fill="${obj.fillColor || '#38bdf8'}" fill-opacity="${obj.opacity || 0.35}" stroke="${obj.strokeColor || '#0284c7'}" stroke-width="${obj.strokeWidth || 2}" />\n`;
      } else if (obj.type === 'route' && obj.points) {
        const ptsStr = obj.points.map(p => `${p.x},${p.y}`).join(' ');
        svgContent += `    <polyline points="${ptsStr}" fill="none" stroke="${obj.color || '#e63946'}" stroke-width="${obj.width || 3.5}" stroke-linecap="round" stroke-linejoin="round" />\n`;
      } else if (obj.type === 'marker') {
        svgContent += `    <g transform="translate(${obj.x}, ${obj.y})">\n`;
        svgContent += `      <circle cx="0" cy="-14" r="14" fill="${obj.color || '#38bdf8'}" />\n`;
        svgContent += `      <text x="0" y="14" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#000">${escapeHTML(obj.name || '')}</text>\n`;
        svgContent += `    </g>\n`;
      } else if (obj.type === 'label') {
        svgContent += `    <text x="${obj.x}" y="${obj.y}" font-family="${obj.fontFamily || 'sans-serif'}" font-size="${obj.fontSize || 16}" font-weight="${obj.isBold !== false ? 'bold' : 'normal'}" text-anchor="middle" fill="${obj.color || '#000'}">${escapeHTML(obj.text || '')}</text>\n`;
      }
    }

    svgContent += `  </g>\n</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (this.project.name || 'map').toLowerCase().replace(/\s+/g, '_') + '.svg';
    a.click();
    this.showToast('Exported Standalone SVG Vector Map');
  }

  exportJSON() {
    const json = JSON.stringify(this.project, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (this.project.name || 'map').toLowerCase().replace(/\s+/g, '_') + '.mapcraft.json';
    a.click();
    this.showToast('Exported MapCraft Project JSON');
  }

  exportGeoJSON() {
    const geo = {
      type: 'FeatureCollection',
      name: this.project.name || 'MapCraft Project',
      features: (this.project.objects || []).map(obj => {
        let geometry = null;
        if (obj.type === 'marker' || obj.type === 'label') {
          geometry = { type: 'Point', coordinates: [obj.x, obj.y] };
        } else if (obj.type === 'route' && obj.points) {
          geometry = { type: 'LineString', coordinates: obj.points.map(p => [p.x, p.y]) };
        } else if (obj.type === 'region' && obj.points) {
          const closed = [...obj.points, obj.points[0]];
          geometry = { type: 'Polygon', coordinates: [closed.map(p => [p.x, p.y])] };
        }

        return {
          type: 'Feature',
          properties: {
            id: obj.id,
            name: obj.name || obj.text,
            type: obj.type,
            category: obj.category,
            notes: obj.notes,
            color: obj.color || obj.fillColor
          },
          geometry
        };
      }).filter(f => f.geometry !== null)
    };

    const blob = new Blob([JSON.stringify(geo, null, 2)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (this.project.name || 'map').toLowerCase().replace(/\s+/g, '_') + '.geojson';
    a.click();
    this.showToast('Exported Standard GeoJSON Dataset');
  }

  loadProject(projectData) {
    this.project = projectData;
    this.activeLayerId = this.project.layers[0]?.id || 'layer_default';
    this.selectObject(null);
    this.undoStack = [];
    this.redoStack = [];

    // Sync theme select dropdown
    const themeSelect = document.getElementById('select-map-theme');
    if (themeSelect && this.project.themeId) {
      themeSelect.value = this.project.themeId;
    }

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

  showToast(msg) {
    let container = document.getElementById('map-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'map-toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-bubble';
    toast.textContent = msg;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 2400);
  }
}

// Bootstrap Application
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
