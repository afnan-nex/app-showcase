/* ==========================================================================
   CANVASFLOW — Base Tool Class
   ========================================================================== */

export class BaseTool {
  constructor(name, app) {
    this.name = name;
    this.app = app;
    this.isActive = false;
  }

  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }

  onPointerDown(e, worldPt) {}
  onPointerMove(e, worldPt) {}
  onPointerUp(e, worldPt) {}
  onDoubleClick(e, worldPt) {}
  onKeyDown(e) {}
  onKeyUp(e) {}
}
