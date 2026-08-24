/* ==========================================================================
   CANVASFLOW — Smart Connector Tool
   Connects shapes dynamically via magnetic anchor points
   ========================================================================== */

import { BaseTool } from './base-tool.js';
import { appState } from '../state/state.js';
import { createCanvasObject } from '../state/document-model.js';
import { getClosestAnchor, isPointInObject, distance } from '../utils/math.js';

export class ConnectorTool extends BaseTool {
  constructor(app) {
    super('connector', app);
    this.isConnecting = false;
    this.startBinding = null;
    this.draftObject = null;
    this.hoveredAnchor = null;
  }

  activate() {
    super.activate();
    this.app.setCursor('crosshair');
  }

  deactivate() {
    super.deactivate();
    this.isConnecting = false;
    this.draftObject = null;
    this.startBinding = null;
    this.app.renderer.hoveredAnchor = null;
  }

  onPointerDown(e, worldPt) {
    this.isConnecting = true;
    const zoom = appState.viewport.zoom;

    // Find if starting from a shape anchor
    const candidate = this._findTargetShape(worldPt, zoom);
    let startX = worldPt.x;
    let startY = worldPt.y;
    let startBinding = null;

    if (candidate) {
      const { anchor } = getClosestAnchor(candidate, worldPt);
      startX = anchor.x;
      startY = anchor.y;
      startBinding = { elementId: candidate.id, anchor: anchor.id };
    }

    this.draftObject = createCanvasObject('connector', {
      x: startX,
      y: startY,
      x2: startX,
      y2: startY,
      startBinding,
      routing: 'curved',
      arrowHeadEnd: 'triangle'
    });

    appState.addObject(this.draftObject, false);
  }

  onPointerMove(e, worldPt) {
    const zoom = appState.viewport.zoom;

    if (!this.isConnecting || !this.draftObject) {
      // Hover feedback for anchors
      const candidate = this._findTargetShape(worldPt, zoom);
      if (candidate) {
        const { anchor } = getClosestAnchor(candidate, worldPt);
        this.app.renderer.hoveredAnchor = { ...anchor, elementId: candidate.id };
      } else {
        this.app.renderer.hoveredAnchor = null;
      }
      this.app.renderer.requestRender();
      return;
    }

    // Dragging connector
    const candidate = this._findTargetShape(worldPt, zoom);
    let endX = worldPt.x;
    let endY = worldPt.y;
    let endBinding = null;

    if (candidate && (!this.draftObject.startBinding || candidate.id !== this.draftObject.startBinding.elementId)) {
      const { anchor } = getClosestAnchor(candidate, worldPt);
      endX = anchor.x;
      endY = anchor.y;
      endBinding = { elementId: candidate.id, anchor: anchor.id };
      this.app.renderer.hoveredAnchor = { ...anchor, elementId: candidate.id };
    } else {
      this.app.renderer.hoveredAnchor = null;
    }

    this.draftObject.x2 = endX;
    this.draftObject.y2 = endY;
    this.draftObject.endBinding = endBinding;

    this.app.renderer.requestRender();
  }

  onPointerUp(e, worldPt) {
    if (!this.isConnecting || !this.draftObject) return;
    this.isConnecting = false;

    const d = distance({ x: this.draftObject.x, y: this.draftObject.y }, { x: this.draftObject.x2, y: this.draftObject.y2 });

    if (d > 10) {
      appState.history.push(appState.getObjects(), 'Create Connector');
      appState.setSelection(this.draftObject.id);
    } else {
      appState.removeObject(this.draftObject.id, false);
    }

    this.draftObject = null;
    this.app.renderer.hoveredAnchor = null;
    appState.setActiveTool('select');
  }

  _findTargetShape(worldPt, zoom) {
    const objects = [...appState.getObjects()].reverse();
    for (const obj of objects) {
      if (obj.visible === false || ['pencil', 'highlighter', 'connector', 'line', 'arrow'].includes(obj.type)) continue;
      if (isPointInObject(worldPt, obj, 20 / zoom)) {
        return obj;
      }
    }
    return null;
  }
}
