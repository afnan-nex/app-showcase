/**
 * FlowPilot Canvas Controller
 * Infinite canvas pan, zoom, grid snapping, coordinate conversions, and viewport fit
 */

class CanvasController {
  constructor(canvasWrapperEl, transformLayerEl, gridBgEl) {
    this.wrapper = canvasWrapperEl;
    this.layer = transformLayerEl;
    this.gridBg = gridBgEl;

    this.x = 80;
    this.y = 80;
    this.scale = 1.0;
    this.minScale = 0.2;
    this.maxScale = 2.5;

    this.isPanning = false;
    this.panStartX = 0;
    this.panStartY = 0;
    this.gridSize = 24;
    this.snapToGrid = true;
    this.gridMode = 'dots'; // 'dots', 'lines', 'off'

    this.isSpacePressed = false;
    this.listeners = [];

    this.initEvents();
    this.applyTransform();
  }

  initEvents() {
    // Wheel Zoom
    this.wrapper.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = this.wrapper.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      this.zoomAt(mouseX, mouseY, zoomFactor);
    }, { passive: false });

    // Track Space key for panning
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        this.isSpacePressed = true;
        this.wrapper.classList.add('panning');
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        this.isSpacePressed = false;
        if (!this.isPanning) {
          this.wrapper.classList.remove('panning');
        }
      }
    });

    // Pointer Events for Pan
    this.wrapper.addEventListener('pointerdown', (e) => {
      // Middle click (button 1) or Left click (button 0) when space is pressed or on canvas background
      if (e.button === 1 || (e.button === 0 && (this.isSpacePressed || e.target === this.wrapper || e.target === this.gridBg))) {
        this.isPanning = true;
        this.panStartX = e.clientX - this.x;
        this.panStartY = e.clientY - this.y;
        this.wrapper.classList.add('panning');
        this.wrapper.setPointerCapture(e.pointerId);
      }
    });

    this.wrapper.addEventListener('pointermove', (e) => {
      if (this.isPanning) {
        this.x = e.clientX - this.panStartX;
        this.y = e.clientY - this.panStartY;
        this.applyTransform();
        this.notifyChange();
      }
    });

    const stopPan = (e) => {
      if (this.isPanning) {
        this.isPanning = false;
        if (!this.isSpacePressed) {
          this.wrapper.classList.remove('panning');
        }
      }
    };

    this.wrapper.addEventListener('pointerup', stopPan);
    this.wrapper.addEventListener('pointercancel', stopPan);
  }

  zoomAt(screenX, screenY, factor) {
    const newScale = Math.min(Math.max(this.scale * factor, this.minScale), this.maxScale);
    if (newScale === this.scale) return;

    // Zoom centered around mouse coordinates
    this.x = screenX - (screenX - this.x) * (newScale / this.scale);
    this.y = screenY - (screenY - this.y) * (newScale / this.scale);
    this.scale = newScale;

    this.applyTransform();
    this.notifyChange();
  }

  zoomIn() {
    const rect = this.wrapper.getBoundingClientRect();
    this.zoomAt(rect.width / 2, rect.height / 2, 1.2);
  }

  zoomOut() {
    const rect = this.wrapper.getBoundingClientRect();
    this.zoomAt(rect.width / 2, rect.height / 2, 0.833);
  }

  resetZoom() {
    this.scale = 1.0;
    this.applyTransform();
    this.notifyChange();
  }

  setTransform(x, y, scale) {
    this.x = x;
    this.y = y;
    this.scale = Math.min(Math.max(scale, this.minScale), this.maxScale);
    this.applyTransform();
    this.notifyChange();
  }

  applyTransform() {
    this.layer.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) scale(${this.scale})`;
    // Sync grid background position and size
    if (this.gridBg) {
      const bgSize = this.gridSize * this.scale;
      this.gridBg.style.backgroundSize = `${bgSize}px ${bgSize}px`;
      this.gridBg.style.backgroundPosition = `${this.x}px ${this.y}px`;
    }
  }

  /**
   * Convert Screen coordinate to Canvas world coordinates
   */
  screenToCanvas(screenX, screenY) {
    const rect = this.wrapper.getBoundingClientRect();
    const relX = screenX - rect.left;
    const relY = screenY - rect.top;
    return {
      x: (relX - this.x) / this.scale,
      y: (relY - this.y) / this.scale
    };
  }

  /**
   * Convert Canvas world coordinate to Screen coordinates
   */
  canvasToScreen(canvasX, canvasY) {
    const rect = this.wrapper.getBoundingClientRect();
    return {
      x: rect.left + this.x + canvasX * this.scale,
      y: rect.top + this.y + canvasY * this.scale
    };
  }

  /**
   * Snap position to grid if enabled
   */
  snap(val) {
    if (!this.snapToGrid) return val;
    return Math.round(val / this.gridSize) * this.gridSize;
  }

  /**
   * Fit all nodes into viewport
   */
  fitToView(nodes) {
    if (!nodes || nodes.length === 0) {
      this.setTransform(80, 80, 1.0);
      return;
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach(node => {
      const x = node.position.x;
      const y = node.position.y;
      const w = 220; // default node width
      const h = 140; // approx node height
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x + w > maxX) maxX = x + w;
      if (y + h > maxY) maxY = y + h;
    });

    const padding = 100;
    const rect = this.wrapper.getBoundingClientRect();
    const boundWidth = (maxX - minX) + padding * 2;
    const boundHeight = (maxY - minY) + padding * 2;

    const scaleX = rect.width / boundWidth;
    const scaleY = rect.height / boundHeight;
    const targetScale = Math.min(Math.max(Math.min(scaleX, scaleY), this.minScale), 1.2);

    const centerX = minX + (maxX - minX) / 2;
    const centerY = minY + (maxY - minY) / 2;

    const newX = rect.width / 2 - centerX * targetScale;
    const newY = rect.height / 2 - centerY * targetScale;

    this.setTransform(newX, newY, targetScale);
  }

  toggleGrid() {
    if (this.gridMode === 'dots') {
      this.gridMode = 'lines';
      this.gridBg.className = 'canvas-grid-bg grid-lines';
    } else if (this.gridMode === 'lines') {
      this.gridMode = 'off';
      this.gridBg.className = 'canvas-grid-bg grid-off';
    } else {
      this.gridMode = 'dots';
      this.gridBg.className = 'canvas-grid-bg';
    }
    return this.gridMode;
  }

  toggleSnap() {
    this.snapToGrid = !this.snapToGrid;
    return this.snapToGrid;
  }

  onChange(cb) {
    this.listeners.push(cb);
  }

  notifyChange() {
    this.listeners.forEach(cb => cb({ x: this.x, y: this.y, scale: this.scale }));
  }
}

window.CanvasController = CanvasController;
