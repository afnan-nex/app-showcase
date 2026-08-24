/* ==========================================================================
   CANVASFLOW — Freehand Drawing Tool (Pencil & Highlighter)
   ========================================================================== */

import { BaseTool } from './base-tool.js';
import { appState } from '../state/state.js';
import { createCanvasObject } from '../state/document-model.js';
import { distance } from '../utils/math.js';

export class FreehandTool extends BaseTool {
  constructor(name, app) {
    super(name, app); // 'pencil' or 'highlighter'
    this.isDrawing = false;
    this.draftObject = null;
    this.lastPoint = null;
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
    this.lastPoint = { ...worldPt };

    const isHighlighter = this.name === 'highlighter';

    this.draftObject = createCanvasObject(this.name, {
      x: worldPt.x,
      y: worldPt.y,
      stroke: isHighlighter ? '#fef08a' : appState.settings.defaultStrokeColor,
      strokeWidth: isHighlighter ? 18 : (appState.settings.defaultStrokeWidth || 3),
      opacity: isHighlighter ? 0.4 : 1,
      points: [{ x: worldPt.x, y: worldPt.y }]
    });

    appState.addObject(this.draftObject, false);
  }

  onPointerMove(e, worldPt) {
    if (!this.isDrawing || !this.draftObject) return;

    // Minimum distance threshold between points to maintain high performance
    if (this.lastPoint && distance(this.lastPoint, worldPt) < 3) {
      return;
    }

    this.draftObject.points.push({ x: worldPt.x, y: worldPt.y });
    this.lastPoint = { ...worldPt };

    this.app.renderer.requestRender();
  }

  onPointerUp() {
    if (!this.isDrawing || !this.draftObject) return;
    this.isDrawing = false;

    if (this.draftObject.points.length > 1) {
      appState.history.push(appState.getObjects(), `Draw ${this.name}`);
    } else {
      appState.removeObject(this.draftObject.id, false);
    }

    this.draftObject = null;
    this.lastPoint = null;
  }
}
