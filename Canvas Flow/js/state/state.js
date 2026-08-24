/* ==========================================================================
   CANVASFLOW — Central Application State Store
   Reactive State, Selection, Viewport, Clipboard, History & Mutations
   ========================================================================== */

import { eventBus } from './event-bus.js';
import { HistoryManager } from './history.js';
import { storage } from './storage.js';
import { generateId, cloneObject, createCanvasObject } from './document-model.js';
import { getObjectBounds, unionBounds, clamp } from '../utils/math.js';

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

export const appState = new StateStore();
