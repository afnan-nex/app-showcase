/* ==========================================================================
   CANVASFLOW — Shape Creation Tool
   Rectangle, Rounded Rectangle, Ellipse, Diamond
   ========================================================================== */

import { BaseTool } from './base-tool.js';
import { appState } from '../state/state.js';
import { createCanvasObject } from '../state/document-model.js';
import { normalizeRect } from '../utils/math.js';
import { SnappingEngine } from '../utils/snapping.js';

export class ShapeTool extends BaseTool {
  constructor(name, app) {
    super(name, app);
    this.isDrawing = false;
    this.startPt = { x: 0, y: 0 };
    this.draftObject = null;
    this.snapping = new SnappingEngine();
  }

  activate() {
    super.activate();
    this.app.setCursor('crosshair');
  }

  deactivate() {
    super.deactivate();
    this.isDrawing = false;
    this.draftObject = null;
  }

  onPointerDown(e, worldPt) {
    this.isDrawing = true;
    let start = { ...worldPt };

    if (appState.settings.snapEnabled && !e.altKey) {
      start = this.snapping.snapPointToGrid(start);
    }

    this.startPt = start;

    this.draftObject = createCanvasObject(this.name, {
      x: start.x,
      y: start.y,
      width: 1,
      height: 1,
      stroke: appState.settings.defaultStrokeColor,
      fill: appState.settings.defaultFillColor,
      strokeWidth: appState.settings.defaultStrokeWidth
    });

    appState.addObject(this.draftObject, false);
  }

  onPointerMove(e, worldPt) {
    if (!this.isDrawing || !this.draftObject) return;

    let current = { ...worldPt };
    if (appState.settings.snapEnabled && !e.altKey) {
      current = this.snapping.snapPointToGrid(current);
    }

    let width = current.x - this.startPt.x;
    let height = current.y - this.startPt.y;

    // Shift key: lock 1:1 square/circle aspect ratio
    if (e.shiftKey) {
      const maxDim = Math.max(Math.abs(width), Math.abs(height));
      width = width < 0 ? -maxDim : maxDim;
      height = height < 0 ? -maxDim : maxDim;
    }

    const norm = normalizeRect(this.startPt.x, this.startPt.y, width, height);

    this.draftObject.x = norm.x;
    this.draftObject.y = norm.y;
    this.draftObject.width = Math.max(2, norm.width);
    this.draftObject.height = Math.max(2, norm.height);

    this.app.renderer.requestRender();
  }

  onPointerUp(e, worldPt) {
    if (!this.isDrawing || !this.draftObject) return;
    this.isDrawing = false;

    // If click without drag, create a standard sized shape (120x80)
    if (this.draftObject.width <= 5 && this.draftObject.height <= 5) {
      this.draftObject.width = 120;
      this.draftObject.height = this.name === 'ellipse' || this.name === 'diamond' ? 100 : 80;
      this.draftObject.x -= this.draftObject.width / 2;
      this.draftObject.y -= this.draftObject.height / 2;
    }

    appState.history.push(appState.getObjects(), `Create ${this.name}`);
    appState.setSelection(this.draftObject.id);
    appState.setActiveTool('select');
  }
}
