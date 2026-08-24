/* ==========================================================================
   CANVASFLOW — Line & Arrow Creation Tool
   ========================================================================== */

import { BaseTool } from './base-tool.js';
import { appState } from '../state/state.js';
import { createCanvasObject } from '../state/document-model.js';
import { SnappingEngine } from '../utils/snapping.js';
import { DEG_TO_RAD, RAD_TO_DEG } from '../utils/math.js';

export class LineTool extends BaseTool {
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
      x2: start.x + 1,
      y2: start.y + 1,
      stroke: appState.settings.defaultStrokeColor,
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

    let endX = current.x;
    let endY = current.y;

    // Shift key: snap angle to 45 degree increments
    if (e.shiftKey) {
      const dx = endX - this.startPt.x;
      const dy = endY - this.startPt.y;
      const dist = Math.hypot(dx, dy);
      let angle = Math.atan2(dy, dx) * RAD_TO_DEG;
      angle = this.snapping.snapAngle(angle, 45) * DEG_TO_RAD;

      endX = this.startPt.x + dist * Math.cos(angle);
      endY = this.startPt.y + dist * Math.sin(angle);
    }

    this.draftObject.x2 = endX;
    this.draftObject.y2 = endY;

    this.app.renderer.requestRender();
  }

  onPointerUp(e, worldPt) {
    if (!this.isDrawing || !this.draftObject) return;
    this.isDrawing = false;

    // If click without drag, create a default 100px line
    if (Math.hypot((this.draftObject.x2 || 0) - this.draftObject.x, (this.draftObject.y2 || 0) - this.draftObject.y) < 5) {
      this.draftObject.x2 = this.draftObject.x + 120;
      this.draftObject.y2 = this.draftObject.y;
    }

    appState.history.push(appState.getObjects(), `Create ${this.name}`);
    appState.setSelection(this.draftObject.id);
    appState.setActiveTool('select');
  }
}
