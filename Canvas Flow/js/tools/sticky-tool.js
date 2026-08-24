/* ==========================================================================
   CANVASFLOW — Sticky Note Tool
   ========================================================================== */

import { BaseTool } from './base-tool.js';
import { appState } from '../state/state.js';
import { createCanvasObject } from '../state/document-model.js';

export class StickyTool extends BaseTool {
  constructor(app) {
    super('sticky', app);
  }

  activate() {
    super.activate();
    this.app.setCursor('crosshair');
  }

  deactivate() {
    super.deactivate();
  }

  onPointerDown(e, worldPt) {
    const stickyObj = createCanvasObject('sticky', {
      x: worldPt.x - 80,
      y: worldPt.y - 80,
      width: 160,
      height: 160,
      fill: '#fef08a',
      color: '#713f12',
      text: ''
    });

    appState.addObject(stickyObj, true);
    appState.setSelection(stickyObj.id);
    appState.setActiveTool('select');

    setTimeout(() => {
      this.app.openInlineTextEditor(stickyObj);
    }, 10);
  }
}
