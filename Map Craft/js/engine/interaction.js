/**
 * MapCraft - Pointer, Touch & Drawing Interaction Controller
 * Handles precise vector plotting, vertex reshaping, snap-to-grid, pinch-to-zoom, and object manipulation.
 */

import {
  calculateDistance,
  calculatePolylineLength,
  calculatePolygonArea,
  pointInPolygon,
  pointNearPolyline,
  snapToGrid
} from '../core/math.js';

export class MapInteraction {
  constructor(canvas, app) {
    this.canvas = canvas;
    this.app = app;

    this.activeTool = 'select'; // select, hand, marker, route, region, circle, label, measure
    this.isPanning = false;
    this.isDraggingObject = false;
    this.isDraggingVertex = false;
    this.isDraggingRadius = false;
    this.selectedVertexIndex = null;

    this.dragStart = { x: 0, y: 0 };
    this.dragOffset = { x: 0, y: 0 };

    // Multi-point drawing state (route, polygon, measure)
    this.drawingPoints = [];
    this.activeCircle = null;

    // Touch gesture state
    this.lastTouchDistance = null;

    this.initListeners();
  }

  screenToWorld(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const sx = clientX - rect.left;
    const sy = clientY - rect.top;
    let wx = (sx - this.app.renderer.camera.x) / this.app.renderer.camera.zoom;
    let wy = (sy - this.app.renderer.camera.y) / this.app.renderer.camera.zoom;

    const rawWx = wx;
    const rawWy = wy;

    if (this.app.snapToGridEnabled && !['hand'].includes(this.activeTool)) {
      const snapped = snapToGrid(wx, wy, this.app.project.gridSize || 50, this.app.project.gridType || 'square');
      wx = snapped.x;
      wy = snapped.y;
    }

    return { wx, wy, rawWx, rawWy, sx, sy };
  }

  initListeners() {
    const canvas = this.canvas;

    // Mouse Events
    canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    window.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    canvas.addEventListener('dblclick', (e) => this.handleDoubleClick(e));

    // Mouse Wheel Zoom towards cursor
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
      const oldZoom = this.app.renderer.camera.zoom;
      const newZoom = Math.max(0.08, Math.min(12, oldZoom * zoomFactor));

      this.app.renderer.camera.x = sx - (sx - this.app.renderer.camera.x) * (newZoom / oldZoom);
      this.app.renderer.camera.y = sy - (sy - this.app.renderer.camera.y) * (newZoom / oldZoom);
      this.app.renderer.camera.zoom = newZoom;

      this.app.requestRender();
      this.app.updateZoomLabel();
    }, { passive: false });

    // Touch Support (Single-touch pan/tap & Pinch-to-zoom)
    canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
    window.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
    window.addEventListener('touchend', (e) => this.handleTouchEnd(e));

    // Prevent default context menu on canvas for custom right-click actions
    canvas.addEventListener('contextmenu', (e) => {
      if (this.drawingPoints.length > 0) {
        e.preventDefault();
        this.drawingPoints.pop();
        if (this.drawingPoints.length === 0) this.finishDrawing();
        else this.app.requestRender();
      }
    });
  }

  handleMouseDown(e) {
    const { wx, wy, rawWx, rawWy, sx, sy } = this.screenToWorld(e.clientX, e.clientY);

    // Pan with middle click, Spacebar pressed, Hand tool, or Alt/Shift key
    if (e.button === 1 || this.activeTool === 'hand' || e.altKey || this.app.isSpacePressed) {
      this.isPanning = true;
      this.dragStart = { x: sx, y: sy };
      return;
    }

    if (e.button !== 0) return; // Left click only for tool execution

    // 1. SELECT TOOL
    if (this.activeTool === 'select') {
      const selectedObj = this.app.selectedObject;

      // Check if clicking an existing vertex on the selected object
      if (selectedObj && selectedObj.points) {
        const vIdx = this.hitTestVertex(rawWx, rawWy, selectedObj.points);
        if (vIdx !== -1) {
          this.isDraggingVertex = true;
          this.selectedVertexIndex = vIdx;
          this.dragStart = { x: wx, y: wy };
          this.app.requestRender();
          return;
        }
      }

      // Check if clicking circle radius handle
      if (selectedObj && selectedObj.type === 'circle') {
        const rx = selectedObj.x + (selectedObj.radius || 50);
        const ry = selectedObj.y;
        if (calculateDistance({ x: rawWx, y: rawWy }, { x: rx, y: ry }) < 10 / this.app.renderer.camera.zoom) {
          this.isDraggingRadius = true;
          this.dragStart = { x: wx, y: wy };
          return;
        }
      }

      // Hit-test any map element
      const hit = this.hitTestObject(rawWx, rawWy);
      if (hit) {
        this.app.selectObject(hit.id);
        this.isDraggingObject = true;
        this.dragStart = { x: wx, y: wy };
      } else {
        this.app.selectObject(null);
      }
      return;
    }

    // 2. MARKER TOOL
    if (this.activeTool === 'marker') {
      this.app.createMarkerAt(wx, wy);
      this.app.setTool('select');
      return;
    }

    // 3. LABEL TOOL
    if (this.activeTool === 'label') {
      this.app.createLabelAt(wx, wy);
      this.app.setTool('select');
      return;
    }

    // 4. CIRCLE TOOL
    if (this.activeTool === 'circle') {
      this.activeCircle = { x: wx, y: wy, radius: 10 };
      this.isDrawingCircle = true;
      return;
    }

    // 5. ROUTE / REGION / MEASURE TOOL (Multi-point click)
    if (['route', 'region', 'measure'].includes(this.activeTool)) {
      this.drawingPoints.push({ x: wx, y: wy });
      this.updateActiveDrawing(wx, wy);
      this.app.requestRender();
    }
  }

  handleMouseMove(e) {
    const { wx, wy, rawWx, rawWy, sx, sy } = this.screenToWorld(e.clientX, e.clientY);

    // Update bottom coordinates readout
    this.app.updateCoordinates(Math.round(wx), Math.round(wy));

    // Pan Viewport
    if (this.isPanning) {
      this.app.renderer.camera.x += sx - this.dragStart.x;
      this.app.renderer.camera.y += sy - this.dragStart.y;
      this.dragStart = { x: sx, y: sy };
      this.app.requestRender();
      return;
    }

    // Drag Single Vertex
    if (this.isDraggingVertex && this.app.selectedObject && this.selectedVertexIndex !== null) {
      const pts = this.app.selectedObject.points;
      if (pts && pts[this.selectedVertexIndex]) {
        pts[this.selectedVertexIndex] = { x: wx, y: wy };
        this.app.requestRender();
        this.app.renderInspector();
      }
      return;
    }

    // Drag Circle Radius
    if (this.isDraggingRadius && this.app.selectedObject) {
      const obj = this.app.selectedObject;
      obj.radius = Math.max(10, Math.round(calculateDistance({ x: obj.x, y: obj.y }, { x: wx, y: wy })));
      this.app.requestRender();
      this.app.renderInspector();
      return;
    }

    // Drag Entire Object
    if (this.isDraggingObject && this.app.selectedObject) {
      const obj = this.app.selectedObject;
      const dx = wx - this.dragStart.x;
      const dy = wy - this.dragStart.y;

      if (dx !== 0 || dy !== 0) {
        if (obj.points) {
          obj.points.forEach(p => { p.x += dx; p.y += dy; });
        } else {
          obj.x += dx;
          obj.y += dy;
        }
        this.dragStart = { x: wx, y: wy };
        this.app.requestRender();
        this.app.renderInspector();
      }
      return;
    }

    // Circle Expansion during creation
    if (this.isDrawingCircle && this.activeCircle) {
      this.activeCircle.radius = Math.max(10, Math.round(calculateDistance(this.activeCircle, { x: wx, y: wy })));
      this.app.activeDrawing = {
        type: 'circle',
        x: this.activeCircle.x,
        y: this.activeCircle.y,
        radius: this.activeCircle.radius
      };
      this.app.requestRender();
      return;
    }

    // Multi-point active line preview
    if (this.drawingPoints.length > 0) {
      this.updateActiveDrawing(wx, wy);
      this.app.requestRender();
    }
  }

  handleMouseUp(e) {
    if (this.isDraggingObject || this.isDraggingVertex || this.isDraggingRadius) {
      this.app.recordHistory('Modify Geometry');
      this.app.autoSave();
    }

    if (this.isDrawingCircle && this.activeCircle) {
      this.app.createCircle(this.activeCircle.x, this.activeCircle.y, this.activeCircle.radius);
      this.isDrawingCircle = false;
      this.activeCircle = null;
      this.app.activeDrawing = null;
      this.app.setTool('select');
    }

    this.isPanning = false;
    this.isDraggingObject = false;
    this.isDraggingVertex = false;
    this.isDraggingRadius = false;
  }

  handleDoubleClick(e) {
    if (this.activeTool === 'route' && this.drawingPoints.length >= 2) {
      this.app.createRoute(this.drawingPoints);
      this.finishDrawing();
    } else if (this.activeTool === 'region' && this.drawingPoints.length >= 3) {
      this.app.createRegion(this.drawingPoints);
      this.finishDrawing();
    } else if (this.activeTool === 'measure') {
      this.finishDrawing();
    }
  }

  // --- Touch Gestures ---
  handleTouchStart(e) {
    if (e.touches.length === 2) {
      // Pinch to zoom start
      e.preventDefault();
      const p1 = e.touches[0];
      const p2 = e.touches[1];
      this.lastTouchDistance = Math.hypot(p2.clientX - p1.clientX, p2.clientY - p1.clientY);
      return;
    }

    if (e.touches.length === 1) {
      const touch = e.touches[0];
      this.handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY, button: 0 });
    }
  }

  handleTouchMove(e) {
    if (e.touches.length === 2 && this.lastTouchDistance) {
      e.preventDefault();
      const p1 = e.touches[0];
      const p2 = e.touches[1];
      const dist = Math.hypot(p2.clientX - p1.clientX, p2.clientY - p1.clientY);
      const factor = dist / this.lastTouchDistance;

      const midX = (p1.clientX + p2.clientX) / 2;
      const midY = (p1.clientY + p2.clientY) / 2;
      const rect = this.canvas.getBoundingClientRect();
      const sx = midX - rect.left;
      const sy = midY - rect.top;

      const oldZoom = this.app.renderer.camera.zoom;
      const newZoom = Math.max(0.1, Math.min(10, oldZoom * factor));

      this.app.renderer.camera.x = sx - (sx - this.app.renderer.camera.x) * (newZoom / oldZoom);
      this.app.renderer.camera.y = sy - (sy - this.app.renderer.camera.y) * (newZoom / oldZoom);
      this.app.renderer.camera.zoom = newZoom;

      this.lastTouchDistance = dist;
      this.app.requestRender();
      this.app.updateZoomLabel();
      return;
    }

    if (e.touches.length === 1) {
      const touch = e.touches[0];
      this.handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    }
  }

  handleTouchEnd(e) {
    this.lastTouchDistance = null;
    this.handleMouseUp({});
  }

  updateActiveDrawing(currentWx, currentWy) {
    const tempPoints = [...this.drawingPoints, { x: currentWx, y: currentWy }];
    const totalDist = calculatePolylineLength(tempPoints);
    const totalArea = ['region', 'measure'].includes(this.activeTool) && tempPoints.length >= 3 ? calculatePolygonArea(tempPoints) : 0;

    this.app.activeDrawing = {
      type: this.activeTool,
      points: tempPoints,
      totalDist,
      totalArea
    };
  }

  finishDrawing() {
    this.drawingPoints = [];
    this.app.activeDrawing = null;
    this.app.setTool('select');
    this.app.requestRender();
  }

  hitTestVertex(wx, wy, points) {
    const threshold = 10 / this.app.renderer.camera.zoom;
    for (let i = 0; i < points.length; i++) {
      if (calculateDistance({ x: wx, y: wy }, points[i]) <= threshold) {
        return i;
      }
    }
    return -1;
  }

  hitTestObject(wx, wy) {
    const objects = [...(this.app.project.objects || [])].reverse();

    for (const obj of objects) {
      if (obj.visible === false || obj.locked) continue;

      if (obj.type === 'marker') {
        const size = obj.size || 28;
        if (Math.abs(wx - obj.x) < size / 2 && wy >= obj.y - size && wy <= obj.y + 12) {
          return obj;
        }
      } else if (obj.type === 'circle') {
        if (calculateDistance({ x: wx, y: wy }, { x: obj.x, y: obj.y }) <= (obj.radius || 50)) {
          return obj;
        }
      } else if (obj.type === 'region' && obj.points) {
        if (pointInPolygon({ x: wx, y: wy }, obj.points)) {
          return obj;
        }
      } else if (obj.type === 'route' && obj.points) {
        if (pointNearPolyline({ x: wx, y: wy }, obj.points, (obj.width || 4) + 8 / this.app.renderer.camera.zoom)) {
          return obj;
        }
      } else if (obj.type === 'label') {
        const len = (obj.text || '').length * 8;
        if (Math.abs(wx - obj.x) < Math.max(40, len) && Math.abs(wy - obj.y) < 22) {
          return obj;
        }
      }
    }
    return null;
  }
}
