/* ==========================================================================
   WIREFRAMELAB - CENTRAL REACTIVE STATE & HISTORY
   ========================================================================== */

import { createNewProject, generateId } from './models.js';
import { saveProject } from './db.js';

class AppState {
  constructor() {
    this.project = createNewProject('My Wireframe Project');
    this.selection = new Set(); // IDs of selected objects or artboards
    this.activeTool = 'select'; // 'select' | 'hand' | 'artboard' | 'box' | 'text' | componentType
    this.mode = 'design';       // 'design' | 'prototype'
    this.theme = 'theme-dark';  // 'theme-dark' | 'theme-light'
    this.viewport = { zoom: 1, panX: 120, panY: 80 };
    this.snapping = { enabled: true, grid: 8, snapToGuides: true, snapToObjects: true };
    this.clipboard = [];
    
    // Undo / Redo history
    this.undoStack = [];
    this.redoStack = [];
    this.maxHistory = 50;
    this.historyPaused = false;

    // Listeners
    this.listeners = new Map();
    
    // Auto-save debouncer
    this.saveTimeout = null;
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.listeners.get(event).delete(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try {
          cb(data);
        } catch (e) {
          console.error(`Error in event listener for ${event}:`, e);
        }
      });
    }
  }

  // --- Auto-Save ---
  scheduleAutoSave() {
    this.emit('save:status', { status: 'saving' });
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(async () => {
      await saveProject(this.project);
      this.emit('save:status', { status: 'saved' });
    }, 800);
  }

  // --- History Management ---
  pushHistory(description = 'Edit') {
    if (this.historyPaused) return;

    const snapshot = JSON.stringify({
      pages: this.project.pages,
      activePageId: this.project.activePageId
    });

    // Don't push identical snapshot
    if (this.undoStack.length > 0 && this.undoStack[this.undoStack.length - 1].snapshot === snapshot) {
      return;
    }

    this.undoStack.push({ description, snapshot });
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
    this.redoStack = []; // clear redo on new action
    this.emit('history:changed', { canUndo: this.canUndo(), canRedo: this.canRedo() });
    this.scheduleAutoSave();
  }

  canUndo() {
    return this.undoStack.length > 0;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }

  undo() {
    if (!this.canUndo()) return;
    const currentSnapshot = JSON.stringify({
      pages: this.project.pages,
      activePageId: this.project.activePageId
    });
    this.redoStack.push({ snapshot: currentSnapshot });

    const prev = this.undoStack.pop();
    const parsed = JSON.parse(prev.snapshot);
    this.project.pages = parsed.pages;
    this.project.activePageId = parsed.activePageId;

    this.emit('project:changed', this.project);
    this.emit('history:changed', { canUndo: this.canUndo(), canRedo: this.canRedo() });
    this.scheduleAutoSave();
  }

  redo() {
    if (!this.canRedo()) return;
    const currentSnapshot = JSON.stringify({
      pages: this.project.pages,
      activePageId: this.project.activePageId
    });
    this.undoStack.push({ snapshot: currentSnapshot });

    const next = this.redoStack.pop();
    const parsed = JSON.parse(next.snapshot);
    this.project.pages = parsed.pages;
    this.project.activePageId = parsed.activePageId;

    this.emit('project:changed', this.project);
    this.emit('history:changed', { canUndo: this.canUndo(), canRedo: this.canRedo() });
    this.scheduleAutoSave();
  }

  // --- Active Page Helpers ---
  getActivePage() {
    if (!this.project.pages || this.project.pages.length === 0) {
      this.project.pages = [{ id: 'page_1', name: 'Page 1', artboards: [], objects: [] }];
      this.project.activePageId = 'page_1';
    }
    let page = this.project.pages.find(p => p.id === this.project.activePageId);
    if (!page) {
      page = this.project.pages[0];
      this.project.activePageId = page.id;
    }
    return page;
  }

  getArtboards() {
    return this.getActivePage().artboards || [];
  }

  getObjects() {
    return this.getActivePage().objects || [];
  }

  // --- Project Operations ---
  setProject(project) {
    this.project = project;
    this.selection.clear();
    this.undoStack = [];
    this.redoStack = [];
    this.emit('project:changed', this.project);
    this.emit('selection:changed', Array.from(this.selection));
    this.emit('history:changed', { canUndo: false, canRedo: false });
    this.scheduleAutoSave();
  }

  setProjectName(name) {
    this.project.name = name;
    this.emit('project:nameChanged', name);
    this.scheduleAutoSave();
  }

  // --- Tool & Mode ---
  setActiveTool(tool) {
    this.activeTool = tool;
    this.emit('tool:changed', tool);
  }

  setMode(mode) {
    this.mode = mode;
    this.emit('mode:changed', mode);
  }

  setTheme(theme) {
    this.theme = theme;
    this.emit('theme:changed', theme);
  }

  setViewport(viewport) {
    this.viewport = { ...this.viewport, ...viewport };
    this.emit('viewport:changed', this.viewport);
  }

  // --- Selection Operations ---
  setSelection(ids) {
    const list = Array.isArray(ids) ? ids : [ids];
    this.selection = new Set(list.filter(Boolean));
    this.emit('selection:changed', Array.from(this.selection));
  }

  addToSelection(id) {
    if (!id) return;
    this.selection.add(id);
    this.emit('selection:changed', Array.from(this.selection));
  }

  removeFromSelection(id) {
    this.selection.delete(id);
    this.emit('selection:changed', Array.from(this.selection));
  }

  toggleSelection(id) {
    if (this.selection.has(id)) {
      this.selection.delete(id);
    } else {
      this.selection.add(id);
    }
    this.emit('selection:changed', Array.from(this.selection));
  }

  clearSelection() {
    if (this.selection.size === 0) return;
    this.selection.clear();
    this.emit('selection:changed', []);
  }

  getSelectedObjects() {
    const page = this.getActivePage();
    return page.objects.filter(obj => this.selection.has(obj.id));
  }

  getSelectedArtboards() {
    const page = this.getActivePage();
    return page.artboards.filter(ab => this.selection.has(ab.id));
  }

  // --- Artboard CRUD ---
  addArtboard(artboard) {
    this.pushHistory('Add Artboard');
    const page = this.getActivePage();
    page.artboards.push(artboard);
    this.setSelection([artboard.id]);
    this.emit('project:changed', this.project);
  }

  updateArtboard(id, changes, recordHistory = true) {
    if (recordHistory) this.pushHistory('Update Artboard');
    const page = this.getActivePage();
    const ab = page.artboards.find(a => a.id === id);
    if (ab) {
      Object.assign(ab, changes);
      this.emit('project:changed', this.project);
    }
  }

  deleteArtboard(id) {
    this.pushHistory('Delete Artboard');
    const page = this.getActivePage();
    // remove artboard and its child objects
    page.artboards = page.artboards.filter(a => a.id !== id);
    page.objects = page.objects.filter(o => o.artboardId !== id);
    this.selection.delete(id);
    this.emit('project:changed', this.project);
    this.emit('selection:changed', Array.from(this.selection));
  }

  // --- Object CRUD ---
  addObject(obj, artboardId = null) {
    this.pushHistory(`Add ${obj.name || 'Object'}`);
    const page = this.getActivePage();
    obj.artboardId = artboardId;
    page.objects.push(obj);
    this.setSelection([obj.id]);
    this.emit('project:changed', this.project);
  }

  updateObject(id, changes, recordHistory = true) {
    if (recordHistory) this.pushHistory('Update Object');
    const page = this.getActivePage();
    const obj = page.objects.find(o => o.id === id);
    if (obj) {
      if (changes.styles) {
        obj.styles = { ...obj.styles, ...changes.styles };
        delete changes.styles;
      }
      if (changes.props) {
        obj.props = { ...obj.props, ...changes.props };
        delete changes.props;
      }
      if (changes.constraints) {
        obj.constraints = { ...obj.constraints, ...changes.constraints };
        delete changes.constraints;
      }
      if (changes.prototype) {
        obj.prototype = { ...obj.prototype, ...changes.prototype };
        delete changes.prototype;
      }
      Object.assign(obj, changes);
      this.emit('project:changed', this.project);
    }
  }

  updateMultipleObjects(updatesMap, recordHistory = true) {
    if (recordHistory) this.pushHistory('Update Objects');
    const page = this.getActivePage();
    for (const [id, changes] of Object.entries(updatesMap)) {
      const obj = page.objects.find(o => o.id === id);
      if (obj) {
        if (changes.styles) {
          obj.styles = { ...obj.styles, ...changes.styles };
          delete changes.styles;
        }
        if (changes.props) {
          obj.props = { ...obj.props, ...changes.props };
          delete changes.props;
        }
        if (changes.constraints) {
          obj.constraints = { ...obj.constraints, ...changes.constraints };
          delete changes.constraints;
        }
        Object.assign(obj, changes);
      }
    }
    this.emit('project:changed', this.project);
  }

  deleteSelection() {
    if (this.selection.size === 0) return;
    this.pushHistory('Delete');
    const page = this.getActivePage();
    
    // delete selected objects
    page.objects = page.objects.filter(o => !this.selection.has(o.id));
    
    // delete selected artboards and their children
    const selectedArtboardIds = page.artboards.filter(a => this.selection.has(a.id)).map(a => a.id);
    if (selectedArtboardIds.length > 0) {
      page.artboards = page.artboards.filter(a => !this.selection.has(a.id));
      page.objects = page.objects.filter(o => !selectedArtboardIds.includes(o.artboardId));
    }

    this.clearSelection();
    this.emit('project:changed', this.project);
  }

  duplicateSelection() {
    if (this.selection.size === 0) return;
    this.pushHistory('Duplicate');
    const page = this.getActivePage();
    const newIds = [];

    // Duplicate objects
    const selectedObjs = page.objects.filter(o => this.selection.has(o.id));
    for (const obj of selectedObjs) {
      const clone = JSON.parse(JSON.stringify(obj));
      clone.id = generateId('obj');
      clone.name = `${obj.name} (copy)`;
      clone.x += 20;
      clone.y += 20;
      page.objects.push(clone);
      newIds.push(clone.id);
    }

    // Duplicate artboards
    const selectedArtboards = page.artboards.filter(a => this.selection.has(a.id));
    for (const ab of selectedArtboards) {
      const cloneAb = JSON.parse(JSON.stringify(ab));
      cloneAb.id = generateId('ab');
      cloneAb.name = `${ab.name} (copy)`;
      cloneAb.x += ab.width + 40;
      page.artboards.push(cloneAb);
      newIds.push(cloneAb.id);

      // clone child objects of this artboard
      const childObjs = page.objects.filter(o => o.artboardId === ab.id);
      for (const child of childObjs) {
        const childClone = JSON.parse(JSON.stringify(child));
        childClone.id = generateId('obj');
        childClone.artboardId = cloneAb.id;
        page.objects.push(childClone);
      }
    }

    this.setSelection(newIds);
    this.emit('project:changed', this.project);
  }

  // --- Z-Order / Layer Reordering ---
  reorderObject(id, direction) {
    const page = this.getActivePage();
    const index = page.objects.findIndex(o => o.id === id);
    if (index === -1) return;

    this.pushHistory('Reorder');
    const [obj] = page.objects.splice(index, 1);
    if (direction === 'front') {
      page.objects.push(obj);
    } else if (direction === 'back') {
      page.objects.unshift(obj);
    } else if (direction === 'forward') {
      const nextIndex = Math.min(page.objects.length, index + 1);
      page.objects.splice(nextIndex, 0, obj);
    } else if (direction === 'backward') {
      const prevIndex = Math.max(0, index - 1);
      page.objects.splice(prevIndex, 0, obj);
    }
    this.emit('project:changed', this.project);
  }

  // --- Group / Ungroup ---
  groupObjects(ids) {
    if (!ids || ids.length < 2) return;
    this.pushHistory('Group');
    const page = this.getActivePage();
    const groupId = generateId('grp');
    
    // find bounds of grouped elements
    const objs = page.objects.filter(o => ids.includes(o.id));
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    objs.forEach(o => {
      minX = Math.min(minX, o.x);
      minY = Math.min(minY, o.y);
      maxX = Math.max(maxX, o.x + o.width);
      maxY = Math.max(maxY, o.y + o.height);
    });

    const groupContainer = {
      id: groupId,
      type: 'group',
      name: 'Group',
      artboardId: objs[0].artboardId || null,
      parentId: null,
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      rotation: 0,
      locked: false,
      hidden: false,
      styles: { fill: 'transparent', stroke: 'transparent', strokeWidth: 0 },
      props: { childrenIds: ids },
      constraints: { horizontal: 'left', vertical: 'top' }
    };

    // Update parentId of children
    objs.forEach(o => {
      o.parentId = groupId;
      o.x -= minX;
      o.y -= minY;
    });

    page.objects.push(groupContainer);
    this.setSelection([groupId]);
    this.emit('project:changed', this.project);
  }

  ungroupObjects(groupId) {
    this.pushHistory('Ungroup');
    const page = this.getActivePage();
    const grp = page.objects.find(o => o.id === groupId);
    if (!grp) return;

    const children = page.objects.filter(o => o.parentId === groupId);
    children.forEach(c => {
      c.x += grp.x;
      c.y += grp.y;
      c.parentId = null;
      c.artboardId = grp.artboardId;
    });

    page.objects = page.objects.filter(o => o.id !== groupId);
    this.setSelection(children.map(c => c.id));
    this.emit('project:changed', this.project);
  }
}

export const state = new AppState();
