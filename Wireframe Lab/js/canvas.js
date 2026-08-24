/* ==========================================================================
   WIREFRAMELAB - CANVAS VIEWPORT, PAN, ZOOM & RULERS
   ========================================================================== */

import { state } from './state.js';

export class CanvasController {
  constructor(viewportEl, rulerHEl, rulerVEl) {
    this.viewportEl = viewportEl;
    this.rulerHEl = rulerHEl;
    this.rulerVEl = rulerVEl;

    this.isPanning = false;
    this.panStartX = 0;
    this.panStartY = 0;
    this.spacePressed = false;

    this.initEvents();
    this.updateRulers();
  }

  initEvents() {
    // Wheel Pan / Zoom
    this.viewportEl.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });

    // Spacebar Panning toggle
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !this.spacePressed && !this.isEditingInput(e.target)) {
        this.spacePressed = true;
        this.viewportEl.classList.add('tool-hand');
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        this.spacePressed = false;
        if (state.activeTool !== 'hand') {
          this.viewportEl.classList.remove('tool-hand');
        }
      }
    });

    // Middle click pan or space-drag
    this.viewportEl.addEventListener('mousedown', (e) => {
      if (e.button === 1 || this.spacePressed || state.activeTool === 'hand') {
        e.preventDefault();
        this.startPan(e);
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isPanning) {
        this.doPan(e);
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.isPanning) {
        this.endPan();
      }
    });

    state.on('viewport:changed', () => this.updateRulers());
  }

  isEditingInput(target) {
    return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
  }

  onWheel(e) {
    e.preventDefault();

    if (e.ctrlKey || e.metaKey || e.altKey) {
      // Zoom centered at mouse cursor
      const rect = this.viewportEl.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      this.zoomAtPoint(mouseX, mouseY, zoomFactor);
    } else {
      // Trackpad / Wheel 2D Panning
      const newPanX = state.viewport.panX - e.deltaX;
      const newPanY = state.viewport.panY - e.deltaY;
      state.setViewport({ panX: newPanX, panY: newPanY });
    }
  }

  zoomAtPoint(screenX, screenY, factor) {
    const currentZoom = state.viewport.zoom;
    const newZoom = Math.min(Math.max(currentZoom * factor, 0.1), 8.0);

    // Canvas world point under mouse
    const worldX = (screenX - state.viewport.panX) / currentZoom;
    const worldY = (screenY - state.viewport.panY) / currentZoom;

    // Adjust pan so mouse point remains fixed
    const newPanX = screenX - worldX * newZoom;
    const newPanY = screenY - worldY * newZoom;

    state.setViewport({ zoom: newZoom, panX: newPanX, panY: newPanY });
  }

  zoomIn() {
    const rect = this.viewportEl.getBoundingClientRect();
    this.zoomAtPoint(rect.width / 2, rect.height / 2, 1.25);
  }

  zoomOut() {
    const rect = this.viewportEl.getBoundingClientRect();
    this.zoomAtPoint(rect.width / 2, rect.height / 2, 0.8);
  }

  resetZoom() {
    const rect = this.viewportEl.getBoundingClientRect();
    this.zoomAtPoint(rect.width / 2, rect.height / 2, 1 / state.viewport.zoom);
  }

  zoomToFitAll() {
    const page = state.getActivePage();
    const artboards = page.artboards || [];
    if (artboards.length === 0) {
      state.setViewport({ zoom: 1, panX: 100, panY: 100 });
      return;
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    artboards.forEach(ab => {
      minX = Math.min(minX, ab.x);
      minY = Math.min(minY, ab.y);
      maxX = Math.max(maxX, ab.x + ab.width);
      maxY = Math.max(maxY, ab.y + ab.height);
    });

    const rect = this.viewportEl.getBoundingClientRect();
    const padding = 80;
    const contentW = maxX - minX;
    const contentH = maxY - minY;

    const scaleX = (rect.width - padding * 2) / contentW;
    const scaleY = (rect.height - padding * 2) / contentH;
    const newZoom = Math.min(Math.max(Math.min(scaleX, scaleY), 0.15), 2.5);

    const newPanX = (rect.width - contentW * newZoom) / 2 - minX * newZoom;
    const newPanY = (rect.height - contentH * newZoom) / 2 - minY * newZoom;

    state.setViewport({ zoom: newZoom, panX: newPanX, panY: newPanY });
  }

  startPan(e) {
    this.isPanning = true;
    this.panStartX = e.clientX - state.viewport.panX;
    this.panStartY = e.clientY - state.viewport.panY;
  }

  doPan(e) {
    const newPanX = e.clientX - this.panStartX;
    const newPanY = e.clientY - this.panStartY;
    state.setViewport({ panX: newPanX, panY: newPanY });
  }

  endPan() {
    this.isPanning = false;
  }

  // --- Coordinate Transformations ---
  screenToCanvas(clientX, clientY) {
    const rect = this.viewportEl.getBoundingClientRect();
    const screenX = clientX - rect.left;
    const screenY = clientY - rect.top;

    return {
      x: (screenX - state.viewport.panX) / state.viewport.zoom,
      y: (screenY - state.viewport.panY) / state.viewport.zoom
    };
  }

  canvasToScreen(canvasX, canvasY) {
    const rect = this.viewportEl.getBoundingClientRect();
    return {
      x: canvasX * state.viewport.zoom + state.viewport.panX + rect.left,
      y: canvasY * state.viewport.zoom + state.viewport.panY + rect.top
    };
  }

  // --- Dynamic Rulers Rendering ---
  updateRulers() {
    if (!this.rulerHEl || !this.rulerVEl) return;

    const vp = state.viewport;
    const zoom = vp.zoom;

    // Horizontal Ruler
    const width = this.viewportEl.clientWidth;
    const height = this.viewportEl.clientHeight;

    const hCanvas = this.rulerHEl;
    hCanvas.width = width;
    hCanvas.height = 20;
    const ctxH = hCanvas.getContext('2d');
    ctxH.clearRect(0, 0, width, 20);

    const vCanvas = this.rulerVEl;
    vCanvas.width = 20;
    vCanvas.height = height;
    const ctxV = vCanvas.getContext('2d');
    ctxV.clearRect(0, 0, 20, height);

    ctxH.fillStyle = '#888888';
    ctxH.strokeStyle = '#444444';
    ctxH.font = '9px monospace';

    ctxV.fillStyle = '#888888';
    ctxV.strokeStyle = '#444444';
    ctxV.font = '9px monospace';

    // Step calculation based on zoom level
    let step = 100;
    if (zoom > 2) step = 20;
    else if (zoom > 1) step = 50;
    else if (zoom < 0.3) step = 500;
    else if (zoom < 0.6) step = 200;

    // Draw horizontal ticks
    const startX = -vp.panX / zoom;
    const endX = (width - vp.panX) / zoom;
    const firstTickX = Math.floor(startX / step) * step;

    for (let x = firstTickX; x <= endX; x += step) {
      const screenX = x * zoom + vp.panX;
      ctxH.beginPath();
      ctxH.moveTo(screenX, 12);
      ctxH.lineTo(screenX, 20);
      ctxH.stroke();
      ctxH.fillText(`${Math.round(x)}`, screenX + 2, 10);
    }

    // Draw vertical ticks
    const startY = -vp.panY / zoom;
    const endY = (height - vp.panY) / zoom;
    const firstTickY = Math.floor(startY / step) * step;

    for (let y = firstTickY; y <= endY; y += step) {
      const screenY = y * zoom + vp.panY;
      ctxV.beginPath();
      ctxV.moveTo(12, screenY);
      ctxV.lineTo(20, screenY);
      ctxV.stroke();

      ctxV.save();
      ctxV.translate(10, screenY + 2);
      ctxV.rotate(-Math.PI / 2);
      ctxV.fillText(`${Math.round(y)}`, 0, 0);
      ctxV.restore();
    }
  }
}
