/* ==========================================================================
   CANVASFLOW — Hand / Pan Tool
   ========================================================================== */

import { BaseTool } from './base-tool.js';
import { appState } from '../state/state.js';

export class HandTool extends BaseTool {
  constructor(app) {
    super('hand', app);
    this.isPanning = false;
    this.startX = 0;
    this.startY = 0;
  }

  activate() {
    super.activate();
    this.app.setCursor('grab');
  }

  deactivate() {
    super.deactivate();
    this.isPanning = false;
    this.app.setCursor('default');
  }

  onPointerDown(e) {
    this.isPanning = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.app.setCursor('grabbing');
  }

  onPointerMove(e) {
    if (!this.isPanning) return;
    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;
    this.startX = e.clientX;
    this.startY = e.clientY;

    appState.panBy(dx, dy);
  }

  onPointerUp() {
    this.isPanning = false;
    this.app.setCursor('grab');
  }
}
