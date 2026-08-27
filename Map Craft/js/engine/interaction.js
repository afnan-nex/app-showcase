/**
 * MapCraft - Interaction & Drawing Controller
 * Handles pointer events, multi-point route/polygon plotting, object dragging, and measurement.
 */

import { calculateDistance, calculatePolylineLength, calculatePolygonArea, pointInPolygon, pointNearPolyline } from '../core/math.js';

export class MapInteraction {
  constructor(canvas, app) {
    this.canvas = canvas;
    this.app = app;

    this.activeTool = 'select'; // select, hand, marker, route, region, circle, label, measure
    this.isPanning = false;
    this.isDraggingObject = false;
    this.dragStart = { x: 0, y: 0 };
    this.dragOffset = { x: 0, y: 0 };

    // Multi-point drawing state (route, polygon, measure)
    this.drawingPoints = [];
    this.activeCircle = null;

    this.initListeners();
  }

  screenToWorld(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const sx = clientX - rect.left;
    const sy = clientY - rect.top;
    const wx = (sx - this.app.renderer.camera.x) / this.app.renderer.camera.zoom;
    const wy = (sy - this.app.renderer.camera.y) / this.app.renderer.camera.zoom;
    return { wx, wy, sx, sy };
  }

  initListeners() {
    const canvas = this.canvas;

    canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    window.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    canvas.addEventListener('dblclick', (e) => this.handleDoubleClick(e));

    // Smooth mouse wheel zoom
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const { sx, sy } = this.screenToWorld(e.clientX, e.clientY);
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
      const oldZoom = this.app.renderer.camera.zoom;
      const newZoom = Math.max(0.1, Math.min(10, oldZoom * zoomFactor));

      // Zoom towards mouse pointer position
      this.app.renderer.camera.x = sx - (sx - this.app.renderer.camera.x) * (newZoom / oldZoom);
      this.app.renderer.camera.y = sy - (sy - this.app.renderer.camera.y) * (newZoom / oldZoom);
      this.app.renderer.camera.zoom = newZoom;

      this.app.requestRender();
      this.app.updateZoomLabel();
    });
  }

  handleMouseDown(e) {
    const { wx, wy, sx, sy } = this.screenToWorld(e.clientX, e.clientY);

    // Pan with middle click or Hand tool or Shift/Alt key
    if (e.button === 1 || this.activeTool === 'hand' || e.altKey || e.shiftKey) {
      this.isPanning = true;
      this.dragStart = { x: sx, y: sy };
      return;
    }

    if (e.button !== 0) return; // Left click only

    // 1. SELECT TOOL
    if (this.activeTool === 'select') {
      const hit = this.hitTestObject(wx, wy);
      if (hit) {
        this.app.selectObject(hit.id);
        this.isDraggingObject = true;
        this.dragStart = { x: wx, y: wy };
        this.dragOffset = {
          x: wx - (hit.x || (hit.points ? hit.points[0].x : 0)),
          y: wy - (hit.y || (hit.points ? hit.points[0].y : 0))
        };
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
    const { wx, wy, sx, sy } = this.screenToWorld(e.clientX, e.clientY);

    // Update bottom coordinates readout
    this.app.updateCoordinates(Math.round(wx), Math.round(wy));

    if (this.isPanning) {
      this.app.renderer.camera.x += sx - this.dragStart.x;
      this.app.renderer.camera.y += sy - this.dragStart.y;
      this.dragStart = { x: sx, y: sy };
      this.app.requestRender();
      return;
    }

    if (this.isDraggingObject && this.app.selectedObject) {
      const obj = this.app.selectedObject;
      const dx = wx - this.dragStart.x;
      const dy = wy - this.dragStart.y;

      if (obj.points) {
        obj.points.forEach(p => { p.x += dx; p.y += dy; });
      } else {
        obj.x += dx;
        obj.y += dy;
      }

      this.dragStart = { x: wx, y: wy };
      this.app.requestRender();
      this.app.renderInspector();
      return;
    }

    // Circle expansion
    if (this.isDrawingCircle && this.activeCircle) {
      this.activeCircle.radius = Math.max(10, calculateDistance(this.activeCircle, { x: wx, y: wy }));
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
    if (this.isDraggingObject) {
      this.app.recordHistory('Move Object');
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
  }

  handleDoubleClick(e) {
    const { wx, wy } = this.screenToWorld(e.clientX, e.clientY);

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

  updateActiveDrawing(currentWx, currentWy) {
    const tempPoints = [...this.drawingPoints, { x: currentWx, y: currentWy }];
    const totalDist = calculatePolylineLength(tempPoints);
    const totalArea = this.activeTool === 'region' || this.activeTool === 'measure' ? calculatePolygonArea(tempPoints) : 0;

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

  hitTestObject(wx, wy) {
    const objects = [...(this.app.project.objects || [])].reverse();

    for (const obj of objects) {
      if (obj.visible === false || obj.locked) continue;

      if (obj.type === 'marker') {
        const size = obj.size || 28;
        if (Math.abs(wx - obj.x) < size / 2 && wy >= obj.y - size && wy <= obj.y + 10) {
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
        if (pointNearPolyline({ x: wx, y: wy }, obj.points, (obj.width || 4) + 6)) {
          return obj;
        }
      } else if (obj.type === 'label') {
        if (Math.abs(wx - obj.x) < 50 && Math.abs(wy - obj.y) < 20) {
          return obj;
        }
      }
    }
    return null;
  }
}
