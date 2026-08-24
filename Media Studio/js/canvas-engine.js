/**
 * MediaStudio — Canvas Engine
 * Master viewport renderer, coordinate transformation, pan & zoom, high-DPI scaling, rulers, and composition pipeline.
 */

export class CanvasEngine {
  constructor(app) {
    this.app = app;

    // Canvas Artboard Dimensions
    this.width = 1920;
    this.height = 1080;
    this.backgroundColor = '#ffffff';
    this.isTransparent = false;

    // Viewport Pan & Zoom
    this.zoom = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.minZoom = 0.05;
    this.maxZoom = 32.0;

    // DOM Elements
    this.viewportContainer = document.getElementById('viewport-container');
    this.viewportSurface = document.getElementById('viewport-surface');
    this.artboardContainer = document.getElementById('artboard-container');
    this.artboardBox = document.getElementById('artboard-box');
    this.artboardCheckerboard = document.getElementById('artboard-checkerboard');
    this.mainCanvas = document.getElementById('main-canvas');
    this.overlayCanvas = document.getElementById('overlay-canvas');
    this.rulerH = document.getElementById('ruler-horizontal');
    this.rulerV = document.getElementById('ruler-vertical');

    // Pan state
    this.isPanning = false;
    this.panStartMouse = { x: 0, y: 0 };
    this.panStartOffset = { x: 0, y: 0 };
    this.isSpacePressed = false;

    // Render scheduling
    this.renderScheduled = false;
    this.dpr = window.devicePixelRatio || 1;

    // Current mouse pos
    this.currentMousePos = { clientX: 0, clientY: 0, worldX: 0, worldY: 0 };

    this._initDom();
    this._attachEventListeners();
  }

  _initDom() {
    this.resizeCanvas(this.width, this.height, false);
    this.fitCanvasToViewport();
  }

  _attachEventListeners() {
    // Window Resize
    window.addEventListener('resize', () => {
      this.dpr = window.devicePixelRatio || 1;
      this.updateRulers();
      this.requestRender();
    });

    // Viewport Mouse & Pointer Events
    this.viewportSurface.addEventListener('pointerdown', (e) => this._onPointerDown(e));
    window.addEventListener('pointermove', (e) => this._onPointerMove(e));
    window.addEventListener('pointerup', (e) => this._onPointerUp(e));

    // Mouse Wheel (Zoom & Pan)
    this.viewportSurface.addEventListener('wheel', (e) => this._onWheel(e), { passive: false });

    // Track cursor on rulers
    this.viewportSurface.addEventListener('mousemove', (e) => {
      const world = this.screenToWorld(e.clientX, e.clientY);
      this.currentMousePos = { clientX: e.clientX, clientY: e.clientY, worldX: world.x, worldY: world.y };
      this.updateRulers();
      this.app.updateStatusCoords(world.x, world.y);
    });

    // Multi-touch gestures (Pinch-to-zoom and two-finger pan)
    let touchStartDist = 0;
    let touchStartZoom = 1;
    let touchStartCenter = { x: 0, y: 0 };
    let touchStartPan = { x: 0, y: 0 };

    this.viewportSurface.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        touchStartDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        touchStartZoom = this.zoom;
        touchStartCenter = {
          x: (t1.clientX + t2.clientX) / 2,
          y: (t1.clientY + t2.clientY) / 2
        };
        touchStartPan = { x: this.panX, y: this.panY };
      }
    }, { passive: false });

    this.viewportSurface.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && touchStartDist > 0) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const scale = currentDist / touchStartDist;
        const currentCenter = {
          x: (t1.clientX + t2.clientX) / 2,
          y: (t1.clientY + t2.clientY) / 2
        };
        const dx = currentCenter.x - touchStartCenter.x;
        const dy = currentCenter.y - touchStartCenter.y;

        this.panX = touchStartPan.x + dx;
        this.panY = touchStartPan.y + dy;
        this.setZoom(touchStartZoom * scale, currentCenter.x, currentCenter.y);
      }
    }, { passive: false });

    this.viewportSurface.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) {
        touchStartDist = 0;
      }
    });

    // Spacebar Key Handlers for Hand Tool Pan
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !this.isSpacePressed && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        this.isSpacePressed = true;
        this.updateCursor();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        this.isSpacePressed = false;
        this.updateCursor();
      }
    });
  }

  /* ==========================================================================
     COORDINATE CONVERSION & MATRICES
     ========================================================================== */

  /**
   * Convert Screen / Client (px) to Artboard World (px)
   */
  screenToWorld(clientX, clientY) {
    const rect = this.viewportSurface.getBoundingClientRect();
    const surfaceX = clientX - rect.left;
    const surfaceY = clientY - rect.top;

    const worldX = (surfaceX - this.panX) / this.zoom;
    const worldY = (surfaceY - this.panY) / this.zoom;

    return { x: worldX, y: worldY };
  }

  /**
   * Convert Artboard World (px) to Screen (px)
   */
  worldToScreen(worldX, worldY) {
    const rect = this.viewportSurface.getBoundingClientRect();
    return {
      clientX: rect.left + this.panX + worldX * this.zoom,
      clientY: rect.top + this.panY + worldY * this.zoom
    };
  }

  /* ==========================================================================
     PAN & ZOOM MANAGEMENT
     ========================================================================== */

  setZoom(newZoom, centerX = null, centerY = null) {
    const clamped = Math.max(this.minZoom, Math.min(this.maxZoom, newZoom));
    if (Math.abs(this.zoom - clamped) < 0.0001) return;

    const rect = this.viewportSurface.getBoundingClientRect();
    const cx = centerX !== null ? centerX - rect.left : rect.width / 2;
    const cy = centerY !== null ? centerY - rect.top : rect.height / 2;

    // Zoom towards point
    const worldX = (cx - this.panX) / this.zoom;
    const worldY = (cy - this.panY) / this.zoom;

    this.zoom = clamped;
    this.panX = cx - worldX * this.zoom;
    this.panY = cy - worldY * this.zoom;

    this.applyTransform();
    this.updateRulers();
    this.app.syncZoomUI(this.zoom);
    this.requestRender();
  }

  zoomIn() {
    this.setZoom(this.zoom * 1.25);
  }

  zoomOut() {
    this.setZoom(this.zoom / 1.25);
  }

  zoomTo(zoomPercent) {
    this.setZoom(zoomPercent / 100);
  }

  fitCanvasToViewport() {
    const rect = this.viewportSurface.getBoundingClientRect();
    const padding = 60;
    const availW = Math.max(100, rect.width - padding * 2);
    const availH = Math.max(100, rect.height - padding * 2);

    const scaleW = availW / this.width;
    const scaleH = availH / this.height;
    const fitZoom = Math.min(scaleW, scaleH, 1.0); // Don't exceed 100% on initial fit unless requested

    this.zoom = Math.max(this.minZoom, fitZoom);
    this.panX = (rect.width - this.width * this.zoom) / 2;
    this.panY = (rect.height - this.height * this.zoom) / 2;

    this.applyTransform();
    this.updateRulers();
    this.app.syncZoomUI(this.zoom);
    this.requestRender();
  }

  centerCanvas() {
    const rect = this.viewportSurface.getBoundingClientRect();
    this.panX = (rect.width - this.width * this.zoom) / 2;
    this.panY = (rect.height - this.height * this.zoom) / 2;

    this.applyTransform();
    this.updateRulers();
    this.requestRender();
  }

  startPan(clientX, clientY) {
    this.isPanning = true;
    this.panStartMouse = { x: clientX, y: clientY };
    this.panStartOffset = { x: this.panX, y: this.panY };
    this.setCursor('grabbing');
  }

  updatePan(clientX, clientY) {
    if (!this.isPanning) return;
    const dx = clientX - this.panStartMouse.x;
    const dy = clientY - this.panStartMouse.y;
    this.panX = this.panStartOffset.x + dx;
    this.panY = this.panStartOffset.y + dy;

    this.applyTransform();
    this.updateRulers();
  }

  endPan() {
    this.isPanning = false;
    this.updateCursor();
  }

  applyTransform() {
    // Transform Artboard Container
    this.artboardContainer.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
  }

  _onWheel(e) {
    e.preventDefault();

    if (e.ctrlKey || e.metaKey) {
      // Zoom with wheel
      const zoomFactor = Math.pow(0.995, e.deltaY);
      this.setZoom(this.zoom * zoomFactor, e.clientX, e.clientY);
    } else {
      // Pan with wheel
      this.panX -= e.deltaX;
      this.panY -= e.deltaY;
      this.applyTransform();
      this.updateRulers();
      this.requestRender();
    }
  }

  _onPointerDown(e) {
    const world = this.screenToWorld(e.clientX, e.clientY);
    this.app.toolEngine.onPointerDown(world.x, world.y, e);
  }

  _onPointerMove(e) {
    const world = this.screenToWorld(e.clientX, e.clientY);
    this.app.toolEngine.onPointerMove(world.x, world.y, e);
  }

  _onPointerUp(e) {
    const world = this.screenToWorld(e.clientX, e.clientY);
    this.app.toolEngine.onPointerUp(world.x, world.y, e);
  }

  /* ==========================================================================
     CANVAS SIZING & RESIZE
     ========================================================================== */

  resizeCanvas(newWidth, newHeight, scaleContent = false) {
    const prevW = this.width;
    const prevH = this.height;

    this.width = Math.max(50, Math.round(newWidth));
    this.height = Math.max(50, Math.round(newHeight));

    // Update DOM containers
    this.artboardBox.style.width = `${this.width}px`;
    this.artboardBox.style.height = `${this.height}px`;

    // Scale canvas elements
    this.mainCanvas.width = this.width;
    this.mainCanvas.height = this.height;

    this.overlayCanvas.width = this.width;
    this.overlayCanvas.height = this.height;

    // Scale content if requested
    if (scaleContent && prevW > 0 && prevH > 0) {
      const scaleX = this.width / prevW;
      const scaleY = this.height / prevH;

      for (const layer of this.app.layers) {
        layer.x = Math.round(layer.x * scaleX);
        layer.y = Math.round(layer.y * scaleY);
        layer.width = Math.round(layer.width * scaleX);
        layer.height = Math.round(layer.height * scaleY);
        if (layer.type === 'drawing') {
          layer.initCanvas();
        }
      }
    }

    this.updateBackgroundStyle();
    this.app.syncCanvasSizeUI(this.width, this.height);
    this.requestRender();
  }

  setBackground(color, isTransparent = false) {
    this.backgroundColor = color;
    this.isTransparent = isTransparent;
    this.updateBackgroundStyle();
    this.requestRender();
  }

  updateBackgroundStyle() {
    if (this.isTransparent) {
      this.artboardCheckerboard.style.backgroundColor = 'transparent';
    } else {
      this.artboardCheckerboard.style.backgroundColor = this.backgroundColor;
    }
  }

  /* ==========================================================================
     COMPOSITION & RENDERING PIPELINE
     ========================================================================== */

  requestRender() {
    if (!this.renderScheduled) {
      this.renderScheduled = true;
      requestAnimationFrame(() => {
        this.renderScheduled = false;
        this.render();
      });
    }
  }

  render() {
    const mainCtx = this.mainCanvas.getContext('2d');
    const overlayCtx = this.overlayCanvas.getContext('2d');

    // 1. Clear canvases
    mainCtx.clearRect(0, 0, this.width, this.height);
    overlayCtx.clearRect(0, 0, this.width, this.height);

    // 2. Draw background on main canvas if not transparent
    if (!this.isTransparent) {
      mainCtx.fillStyle = this.backgroundColor;
      mainCtx.fillRect(0, 0, this.width, this.height);
    }

    // 3. Render all visible layers in stack order (bottom to top)
    for (const layer of this.app.layers) {
      if (layer.visible) {
        layer.render(mainCtx);
      }
    }

    // 4. Render Grid on overlay if enabled
    if (this.app.showGrid) {
      this.renderGrid(overlayCtx);
    }

    // 5. Render Transform handles & guides for selected layer
    if (this.app.selectedLayer && this.app.toolEngine.activeTool === 'select') {
      this.app.transformEngine.renderOverlay(
        overlayCtx,
        [this.app.selectedLayer],
        this.width,
        this.height
      );
    }

    // 6. Render Marquee selection box
    this.app.toolEngine.renderMarquee(overlayCtx);

    // 7. Render Crop overlay
    this.app.toolEngine.renderCropOverlay(overlayCtx);
  }

  renderGrid(ctx) {
    const gridSize = 40;
    const zoom = this.zoom;

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1 / zoom;

    ctx.beginPath();
    for (let x = 0; x <= this.width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
    }
    for (let y = 0; y <= this.height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  /* ==========================================================================
     INTERACTIVE RULERS
     ========================================================================== */

  updateRulers() {
    if (!this.rulerH || !this.rulerV || !this.app.showRulers) return;

    const rect = this.viewportSurface.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    // Resize ruler canvases to viewport size
    if (this.rulerH.width !== w) this.rulerH.width = w;
    if (this.rulerV.height !== h) this.rulerV.height = h;

    const ctxH = this.rulerH.getContext('2d');
    const ctxV = this.rulerV.getContext('2d');

    ctxH.clearRect(0, 0, w, 20);
    ctxV.clearRect(0, 0, 20, h);

    // Styling
    ctxH.fillStyle = '#18181b';
    ctxH.fillRect(0, 0, w, 20);
    ctxV.fillStyle = '#18181b';
    ctxV.fillRect(0, 0, 20, h);

    ctxH.strokeStyle = '#3f3f46';
    ctxV.strokeStyle = '#3f3f46';
    ctxH.fillStyle = '#71717a';
    ctxV.fillStyle = '#71717a';
    ctxH.font = '9px "Fira Code", monospace';
    ctxV.font = '9px "Fira Code", monospace';

    // Step calculation based on zoom
    let step = 100;
    if (this.zoom > 3.0) step = 10;
    else if (this.zoom > 1.5) step = 25;
    else if (this.zoom > 0.6) step = 50;
    else if (this.zoom > 0.3) step = 100;
    else step = 200;

    // Horizontal Ruler
    const startWorldX = Math.floor((-this.panX / this.zoom) / step) * step;
    const endWorldX = Math.ceil(((w - this.panX) / this.zoom) / step) * step;

    for (let x = startWorldX; x <= endWorldX; x += step) {
      const screenX = this.panX + x * this.zoom;
      if (screenX < 0 || screenX > w) continue;

      ctxH.beginPath();
      ctxH.moveTo(screenX, 12);
      ctxH.lineTo(screenX, 20);
      ctxH.stroke();

      if (x % (step * 2) === 0) {
        ctxH.fillText(`${x}`, screenX + 2, 10);
      }
    }

    // Vertical Ruler
    const startWorldY = Math.floor((-this.panY / this.zoom) / step) * step;
    const endWorldY = Math.ceil(((h - this.panY) / this.zoom) / step) * step;

    for (let y = startWorldY; y <= endWorldY; y += step) {
      const screenY = this.panY + y * this.zoom;
      if (screenY < 0 || screenY > h) continue;

      ctxV.beginPath();
      ctxV.moveTo(12, screenY);
      ctxV.lineTo(20, screenY);
      ctxV.stroke();

      if (y % (step * 2) === 0) {
        ctxV.save();
        ctxV.translate(10, screenY + 2);
        ctxV.rotate(-Math.PI / 2);
        ctxV.fillText(`${y}`, 0, 0);
        ctxV.restore();
      }
    }

    // Cursor Track Ticks on Rulers
    const curScreenX = this.panX + this.currentMousePos.worldX * this.zoom;
    const curScreenY = this.panY + this.currentMousePos.worldY * this.zoom;

    ctxH.strokeStyle = '#3b82f6';
    ctxH.lineWidth = 1;
    ctxH.beginPath();
    ctxH.moveTo(curScreenX, 0);
    ctxH.lineTo(curScreenX, 20);
    ctxH.stroke();

    ctxV.strokeStyle = '#3b82f6';
    ctxV.lineWidth = 1;
    ctxV.beginPath();
    ctxV.moveTo(0, curScreenY);
    ctxV.lineTo(20, curScreenY);
    ctxV.stroke();
  }

  /* ==========================================================================
     CURSORS
     ========================================================================== */

  setCursor(cursorStyle) {
    this.viewportSurface.style.cursor = cursorStyle;
  }

  updateCursor() {
    if (this.isSpacePressed || this.app.toolEngine.activeTool === 'hand') {
      this.setCursor(this.isPanning ? 'grabbing' : 'grab');
      return;
    }

    switch (this.app.toolEngine.activeTool) {
      case 'select':
        this.setCursor('default');
        break;
      case 'crop':
        this.setCursor('crosshair');
        break;
      case 'brush':
      case 'eraser':
        this.setCursor('crosshair');
        break;
      case 'text':
        this.setCursor('text');
        break;
      case 'shape':
        this.setCursor('crosshair');
        break;
      case 'eyedropper':
        this.setCursor('crosshair');
        break;
      default:
        this.setCursor('default');
        break;
    }
  }
}
