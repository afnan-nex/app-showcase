/* ==========================================================================
   CANVASFLOW — Selection Tool
   Click, Marquee Select, Move, Resize, Rotate & Text Editing
   ========================================================================== */

import { BaseTool } from './base-tool.js';
import { appState } from '../state/state.js';
import { eventBus } from '../state/event-bus.js';
import { SnappingEngine } from '../utils/snapping.js';
import {
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
} from '../utils/math.js';

export class SelectTool extends BaseTool {
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
