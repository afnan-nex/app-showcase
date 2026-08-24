/* ==========================================================================
   CANVASFLOW — Eraser Tool
   Interactive Object & Stroke Eraser
   ========================================================================== */

import { BaseTool } from './base-tool.js';
import { appState } from '../state/state.js';
import { isPointInObject } from '../utils/math.js';

export class EraserTool extends BaseTool {
  constructor(app) {
    super('eraser', app);
    this.isErasing = false;
    this.erasedCount = 0;
  }

  activate() {
    super.activate();
    this.app.setCursor('crosshair');
  }

  deactivate() {
    super.deactivate();
    this.isErasing = false;
    this.app.renderer.eraserTrail = null;
  }

  onPointerDown(e, worldPt) {
    this.isErasing = true;
    this.erasedCount = 0;
    appState.history.beginTransaction(appState.getObjects());
    this._eraseAt(worldPt, e);
  }

  onPointerMove(e, worldPt) {
    // Show eraser circle overlay
    this.app.renderer.eraserTrail = {
      x: e.clientX - this.app.canvasContainer.getBoundingClientRect().left,
      y: e.clientY - this.app.canvasContainer.getBoundingClientRect().top,
      radius: 12
    };
    this.app.renderer.requestRender();

    if (this.isErasing) {
      this._eraseAt(worldPt, e);
    }
  }

  onPointerUp() {
    if (this.isErasing) {
      this.isErasing = false;
      if (this.erasedCount > 0) {
        appState.history.commitTransaction(appState.getObjects(), `Erase ${this.erasedCount} object(s)`);
      } else {
        appState.history.cancelTransaction();
      }
    }
    this.app.renderer.eraserTrail = null;
    this.app.renderer.requestRender();
  }

  _eraseAt(worldPt, e) {
    const zoom = appState.viewport.zoom;
    const threshold = 14 / zoom;
    const objects = [...appState.getObjects()].reverse();

    for (const obj of objects) {
      if (obj.visible !== false && !obj.locked) {
        if (isPointInObject(worldPt, obj, threshold)) {
          appState.removeObject(obj.id, false);
          this.erasedCount++;
        }
      }
    }
  }
}
