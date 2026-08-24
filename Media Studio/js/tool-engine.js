/**
 * MediaStudio — Tool Engine
 * Handles user interactions for Select, Hand, Crop, Brush, Eraser, Text, Shape, and Eyedropper tools.
 */

import { ShapeLayer, TextLayer, DrawingLayer, ImageLayer } from './layer-engine.js';
import { FilterEngine } from './filter-engine.js';

export class ToolEngine {
  constructor(canvasEngine, app) {
    this.canvasEngine = canvasEngine;
    this.app = app;

    this.activeTool = 'select'; // select, hand, crop, brush, eraser, text, shape, eyedropper
    this.activeShapeType = 'rectangle';

    // Brush settings
    this.brush = {
      color: '#3b82f6',
      size: 12,
      opacity: 1.0,
      hardness: 80
    };

    // Crop state
    this.cropState = {
      active: false,
      aspectRatio: 'free', // free, 1:1, 16:9, 9:16, 4:3, 3:2, 2:1
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      activeHandle: null,
      startMouseX: 0,
      startMouseY: 0
    };

    // Tool interaction state
    this.isMouseDown = false;
    this.startWorldPos = { x: 0, y: 0 };
    this.currentDrawingStroke = null;
    this.tempShapeLayer = null;
    this.marqueeSelection = null; // { x, y, width, height }
  }

  setTool(toolName) {
    if (this.activeTool === toolName) return;

    // Clean up previous tool
    if (this.activeTool === 'crop' && toolName !== 'crop') {
      this.cancelCrop();
    }

    this.activeTool = toolName;
    this.canvasEngine.updateCursor();
    this.canvasEngine.requestRender();

    // If switching to crop tool, initialize crop box
    if (toolName === 'crop') {
      this.initCropBox();
    }
  }

  setShapeType(shapeType) {
    this.activeShapeType = shapeType;
    this.setTool('shape');
  }

  /* ==========================================================================
     POINTER / MOUSE EVENT DISPATCHERS
     ========================================================================== */

  onPointerDown(worldX, worldY, event) {
    this.isMouseDown = true;
    this.startWorldPos = { x: worldX, y: worldY };

    // Spacebar held down -> Hand pan mode override
    if (this.canvasEngine.isSpacePressed || event.button === 1 || this.activeTool === 'hand') {
      this.canvasEngine.startPan(event.clientX, event.clientY);
      return;
    }

    switch (this.activeTool) {
      case 'select':
        this._handleSelectPointerDown(worldX, worldY, event);
        break;

      case 'crop':
        this._handleCropPointerDown(worldX, worldY, event);
        break;

      case 'brush':
      case 'eraser':
        this._handleBrushPointerDown(worldX, worldY, event);
        break;

      case 'text':
        this._handleTextPointerDown(worldX, worldY, event);
        break;

      case 'shape':
        this._handleShapePointerDown(worldX, worldY, event);
        break;

      case 'eyedropper':
        this._handleEyedropperPointerDown(worldX, worldY, event);
        break;
    }

    this.canvasEngine.requestRender();
  }

  onPointerMove(worldX, worldY, event) {
    // 1. Pan Drag
    if (this.canvasEngine.isPanning) {
      this.canvasEngine.updatePan(event.clientX, event.clientY);
      return;
    }

    // 2. Eyedropper Hover Loupe
    if (this.activeTool === 'eyedropper') {
      this.updateEyedropperLoupe(event.clientX, event.clientY, worldX, worldY);
    }

    if (!this.isMouseDown) {
      // Hover handle checks for select tool
      if (this.activeTool === 'select') {
        const selected = this.app.selectedLayer;
        if (selected) {
          const handle = this.app.transformEngine.hitTestHandles(selected, worldX, worldY);
          if (handle) {
            this.canvasEngine.setCursor(this.app.transformEngine.getCursorForHandle(handle, selected));
            return;
          }
        }
        // Hover over layer check
        const hovered = this.app.getTopLayerAt(worldX, worldY);
        this.canvasEngine.setCursor(hovered ? 'move' : 'default');
      }
      return;
    }

    // Active drag interactions
    switch (this.activeTool) {
      case 'select':
        this._handleSelectPointerMove(worldX, worldY, event);
        break;

      case 'crop':
        this._handleCropPointerMove(worldX, worldY, event);
        break;

      case 'brush':
      case 'eraser':
        this._handleBrushPointerMove(worldX, worldY, event);
        break;

      case 'shape':
        this._handleShapePointerMove(worldX, worldY, event);
        break;
    }

    this.canvasEngine.requestRender();
  }

  onPointerUp(worldX, worldY, event) {
    if (this.canvasEngine.isPanning) {
      this.canvasEngine.endPan();
    }

    if (this.isMouseDown) {
      switch (this.activeTool) {
        case 'select':
          this._handleSelectPointerUp(worldX, worldY, event);
          break;

        case 'crop':
          this._handleCropPointerUp(worldX, worldY, event);
          break;

        case 'brush':
        case 'eraser':
          this._handleBrushPointerUp(worldX, worldY, event);
          break;

        case 'shape':
          this._handleShapePointerUp(worldX, worldY, event);
          break;
      }
    }

    this.isMouseDown = false;
    this.canvasEngine.requestRender();
  }

  /* ==========================================================================
     TOOL HANDLERS
     ========================================================================== */

  // 1. SELECT TOOL
  _handleSelectPointerDown(worldX, worldY, event) {
    const selected = this.app.selectedLayer;

    // Check if clicking transform handle
    if (selected && !selected.locked) {
      const handle = this.app.transformEngine.hitTestHandles(selected, worldX, worldY);
      if (handle) {
        this.app.transformEngine.startTransform(
          handle,
          selected,
          worldX,
          worldY,
          { lockAspect: this.app.lockAspectRatio }
        );
        return;
      }
    }

    // Hit test layers
    const hitLayer = this.app.getTopLayerAt(worldX, worldY);

    if (hitLayer) {
      this.app.selectLayer(hitLayer);
      if (!hitLayer.locked) {
        this.isMovingLayer = true;
        this.layerDragStartPos = { x: hitLayer.x, y: hitLayer.y };
      }
    } else {
      // Clicked on empty canvas background -> deselect & start marquee selection
      this.app.selectLayer(null);
      this.marqueeSelection = { x: worldX, y: worldY, width: 0, height: 0 };
    }
  }

  _handleSelectPointerMove(worldX, worldY, event) {
    // Transform handle drag
    if (this.app.transformEngine.activeHandle) {
      this.app.transformEngine.updateTransform(worldX, worldY, event);
      this.app.syncPropertiesUI();
      return;
    }

    // Move layer drag
    if (this.isMovingLayer && this.app.selectedLayer && !this.app.selectedLayer.locked) {
      const dx = worldX - this.startWorldPos.x;
      const dy = worldY - this.startWorldPos.y;

      const layer = this.app.selectedLayer;
      this.app.transformEngine.moveLayerWithSnapping(
        layer,
        (this.layerDragStartPos.x + dx) - layer.x,
        (this.layerDragStartPos.y + dy) - layer.y,
        this.app.layers,
        this.canvasEngine.width,
        this.canvasEngine.height,
        this.app.snapToGuides
      );

      this.app.syncPropertiesUI();
      return;
    }

    // Marquee selection drag
    if (this.marqueeSelection) {
      const minX = Math.min(this.startWorldPos.x, worldX);
      const minY = Math.min(this.startWorldPos.y, worldY);
      const w = Math.abs(worldX - this.startWorldPos.x);
      const h = Math.abs(worldY - this.startWorldPos.y);
      this.marqueeSelection = { x: minX, y: minY, width: w, height: h };
    }
  }

  _handleSelectPointerUp(worldX, worldY, event) {
    if (this.app.transformEngine.activeHandle) {
      this.app.transformEngine.endTransform();
      this.app.recordHistory('Transform Layer');
    } else if (this.isMovingLayer) {
      this.isMovingLayer = false;
      this.app.recordHistory('Move Layer');
    }

    if (this.marqueeSelection) {
      // Find layers inside marquee
      const m = this.marqueeSelection;
      if (m.width > 5 && m.height > 5) {
        for (let i = this.app.layers.length - 1; i >= 0; i--) {
          const l = this.app.layers[i];
          if (l.x >= m.x && l.x + l.width <= m.x + m.width &&
              l.y >= m.y && l.y + l.height <= m.y + m.height) {
            this.app.selectLayer(l);
            break;
          }
        }
      }
      this.marqueeSelection = null;
    }
  }

  // 2. BRUSH & ERASER TOOLS
  _handleBrushPointerDown(worldX, worldY, event) {
    // Ensure we have an active drawing layer
    let drawLayer = this.app.selectedLayer;
    if (!drawLayer || drawLayer.type !== 'drawing' || drawLayer.locked) {
      // Create new drawing layer
      drawLayer = new DrawingLayer({
        name: 'Drawing Layer ' + (this.app.layers.length + 1),
        x: 0,
        y: 0,
        width: this.canvasEngine.width,
        height: this.canvasEngine.height
      });
      this.app.addLayer(drawLayer);
    }

    const isEraser = this.activeTool === 'eraser';
    const local = drawLayer.worldToLocal(worldX, worldY);

    this.currentDrawingStroke = {
      points: [{ x: local.x, y: local.y }],
      color: this.app.primaryColor,
      size: this.brush.size,
      opacity: this.brush.opacity,
      hardness: this.brush.hardness,
      isEraser
    };

    drawLayer.addStroke(this.currentDrawingStroke);
  }

  _handleBrushPointerMove(worldX, worldY, event) {
    if (!this.currentDrawingStroke || !this.app.selectedLayer) return;
    const drawLayer = this.app.selectedLayer;
    const local = drawLayer.worldToLocal(worldX, worldY);

    this.currentDrawingStroke.points.push({ x: local.x, y: local.y });
    drawLayer.drawSingleStroke(drawLayer.drawingCanvas.getContext('2d'), this.currentDrawingStroke);
  }

  _handleBrushPointerUp(worldX, worldY, event) {
    if (this.currentDrawingStroke) {
      this.currentDrawingStroke = null;
      this.app.recordHistory(this.activeTool === 'eraser' ? 'Eraser Stroke' : 'Brush Stroke');
    }
  }

  // 3. TEXT TOOL
  _handleTextPointerDown(worldX, worldY, event) {
    const textLayer = new TextLayer({
      name: 'Text Layer ' + (this.app.layers.length + 1),
      text: 'Heading Text',
      x: Math.round(worldX),
      y: Math.round(worldY),
      fontSize: 48,
      fillColor: this.app.primaryColor
    });

    this.app.addLayer(textLayer);
    this.app.selectLayer(textLayer);
    this.setTool('select');
    this.app.recordHistory('Add Text');
  }

  // 4. SHAPE TOOL
  _handleShapePointerDown(worldX, worldY, event) {
    this.tempShapeLayer = new ShapeLayer({
      name: this.activeShapeType.charAt(0).toUpperCase() + this.activeShapeType.slice(1),
      shapeType: this.activeShapeType,
      x: worldX,
      y: worldY,
      width: 10,
      height: 10,
      fillColor: this.app.primaryColor,
      strokeColor: this.app.secondaryColor,
      strokeWidth: 0
    });

    this.app.addLayer(this.tempShapeLayer);
    this.app.selectLayer(this.tempShapeLayer);
  }

  _handleShapePointerMove(worldX, worldY, event) {
    if (!this.tempShapeLayer) return;

    const startX = this.startWorldPos.x;
    const startY = this.startWorldPos.y;

    let w = Math.abs(worldX - startX);
    let h = Math.abs(worldY - startY);

    if (event.shiftKey) {
      const maxDim = Math.max(w, h);
      w = maxDim;
      h = maxDim;
    }

    const minX = Math.min(startX, worldX);
    const minY = Math.min(startY, worldY);

    this.tempShapeLayer.x = minX;
    this.tempShapeLayer.y = minY;
    this.tempShapeLayer.width = Math.max(10, w);
    this.tempShapeLayer.height = Math.max(10, h);
  }

  _handleShapePointerUp(worldX, worldY, event) {
    if (this.tempShapeLayer) {
      if (this.tempShapeLayer.width < 15 && this.tempShapeLayer.height < 15) {
        // Default size on simple click
        this.tempShapeLayer.width = 160;
        this.tempShapeLayer.height = 160;
        this.tempShapeLayer.x = this.startWorldPos.x - 80;
        this.tempShapeLayer.y = this.startWorldPos.y - 80;
      }

      this.tempShapeLayer = null;
      this.setTool('select');
      this.app.recordHistory('Add Shape');
    }
  }

  // 5. EYEDROPPER TOOL
  _handleEyedropperPointerDown(worldX, worldY, event) {
    const color = this.sampleColorAtWorld(worldX, worldY);
    if (color) {
      this.app.setPrimaryColor(color.hex);
      this.app.showToast(`Sampled color: ${color.hex}`);
      this.setTool('select');
    }
  }

  sampleColorAtWorld(worldX, worldY) {
    const mainCanvas = this.canvasEngine.mainCanvas;
    if (worldX < 0 || worldX >= mainCanvas.width || worldY < 0 || worldY >= mainCanvas.height) {
      return null;
    }
    return FilterEngine.getPixelColor(mainCanvas, worldX, worldY);
  }

  updateEyedropperLoupe(clientX, clientY, worldX, worldY) {
    const loupe = document.getElementById('eyedropper-loupe');
    if (!loupe) return;

    loupe.classList.remove('hidden');
    loupe.style.left = `${clientX}px`;
    loupe.style.top = `${clientY}px`;

    const loupeCanvas = document.getElementById('loupe-canvas');
    const colorBadge = document.getElementById('loupe-color-hex');
    const lCtx = loupeCanvas.getContext('2d');

    const mainCanvas = this.canvasEngine.mainCanvas;
    lCtx.clearRect(0, 0, 90, 90);
    lCtx.imageSmoothingEnabled = false;

    // Draw 9x9 zoomed grid centered on pixel
    lCtx.drawImage(
      mainCanvas,
      Math.floor(worldX) - 4,
      Math.floor(worldY) - 4,
      9,
      9,
      0,
      0,
      90,
      90
    );

    const color = this.sampleColorAtWorld(worldX, worldY);
    if (color) {
      colorBadge.textContent = color.hex.toUpperCase();
      colorBadge.style.color = '#ffffff';
    }
  }

  hideEyedropperLoupe() {
    const loupe = document.getElementById('eyedropper-loupe');
    if (loupe) loupe.classList.add('hidden');
  }

  // 6. CROP TOOL
  initCropBox() {
    this.cropState.active = true;
    this.cropState.x = 0;
    this.cropState.y = 0;
    this.cropState.width = this.canvasEngine.width;
    this.cropState.height = this.canvasEngine.height;
    this.cropState.aspectRatio = 'free';

    const hud = document.getElementById('crop-hud-overlay');
    if (hud) hud.classList.remove('hidden');
  }

  setCropAspectRatio(aspectRatio) {
    this.cropState.aspectRatio = aspectRatio;
    if (aspectRatio === 'free') return;

    const parts = aspectRatio.split(':');
    if (parts.length === 2) {
      const ratio = parseFloat(parts[0]) / parseFloat(parts[1]);
      let newW = this.cropState.width;
      let newH = newW / ratio;

      if (newH > this.canvasEngine.height) {
        newH = this.canvasEngine.height;
        newW = newH * ratio;
      }

      this.cropState.width = Math.round(newW);
      this.cropState.height = Math.round(newH);
      this.cropState.x = Math.round((this.canvasEngine.width - newW) / 2);
      this.cropState.y = Math.round((this.canvasEngine.height - newH) / 2);
      this.canvasEngine.requestRender();
    }
  }

  _handleCropPointerDown(worldX, worldY, event) {
    const c = this.cropState;
    const hitHandle = this.hitTestCropHandles(worldX, worldY);

    if (hitHandle) {
      c.activeHandle = hitHandle;
      c.startMouseX = worldX;
      c.startMouseY = worldY;
      c.startX = c.x;
      c.startY = c.y;
      c.startW = c.width;
      c.startH = c.height;
    }
  }

  _handleCropPointerMove(worldX, worldY, event) {
    const c = this.cropState;
    if (!c.activeHandle) return;

    const dx = worldX - c.startMouseX;
    const dy = worldY - c.startMouseY;

    let x = c.startX;
    let y = c.startY;
    let w = c.startW;
    let h = c.startH;

    switch (c.activeHandle) {
      case 'se':
        w = Math.max(50, c.startW + dx);
        h = Math.max(50, c.startH + dy);
        break;
      case 'sw':
        w = Math.max(50, c.startW - dx);
        h = Math.max(50, c.startH + dy);
        x = c.startX + (c.startW - w);
        break;
      case 'ne':
        w = Math.max(50, c.startW + dx);
        h = Math.max(50, c.startH - dy);
        y = c.startY + (c.startH - h);
        break;
      case 'nw':
        w = Math.max(50, c.startW - dx);
        h = Math.max(50, c.startH - dy);
        x = c.startX + (c.startW - w);
        y = c.startY + (c.startH - h);
        break;
      case 'e':
        w = Math.max(50, c.startW + dx);
        break;
      case 'w':
        w = Math.max(50, c.startW - dx);
        x = c.startX + (c.startW - w);
        break;
      case 's':
        h = Math.max(50, c.startH + dy);
        break;
      case 'n':
        h = Math.max(50, c.startH - dy);
        y = c.startY + (c.startH - h);
        break;
      case 'move':
        x = c.startX + dx;
        y = c.startY + dy;
        break;
    }

    c.x = Math.round(x);
    c.y = Math.round(y);
    c.width = Math.round(w);
    c.height = Math.round(h);
  }

  _handleCropPointerUp(worldX, worldY, event) {
    this.cropState.activeHandle = null;
  }

  hitTestCropHandles(worldX, worldY) {
    const c = this.cropState;
    const threshold = 12 / this.canvasEngine.zoom;

    const handles = {
      nw: { x: c.x, y: c.y },
      ne: { x: c.x + c.width, y: c.y },
      se: { x: c.x + c.width, y: c.y + c.height },
      sw: { x: c.x, y: c.y + c.height },
      n:  { x: c.x + c.width / 2, y: c.y },
      s:  { x: c.x + c.width / 2, y: c.y + c.height },
      e:  { x: c.x + c.width, y: c.y + c.height / 2 },
      w:  { x: c.x, y: c.y + c.height / 2 }
    };

    for (const [name, pos] of Object.entries(handles)) {
      if (Math.abs(worldX - pos.x) <= threshold && Math.abs(worldY - pos.y) <= threshold) {
        return name;
      }
    }

    // Inside crop box
    if (worldX >= c.x && worldX <= c.x + c.width && worldY >= c.y && worldY <= c.y + c.height) {
      return 'move';
    }

    return null;
  }

  applyCrop() {
    const c = this.cropState;
    if (!c.active || c.width <= 0 || c.height <= 0) return;

    // Shift all layers relative to new crop origin
    const offsetX = -c.x;
    const offsetY = -c.y;

    for (const layer of this.app.layers) {
      layer.x += offsetX;
      layer.y += offsetY;
    }

    // Update canvas size
    this.canvasEngine.resizeCanvas(c.width, c.height, false);

    this.cancelCrop();
    this.app.recordHistory('Crop Canvas');
    this.app.showToast(`Cropped to ${c.width} × ${c.height} px`);
  }

  cancelCrop() {
    this.cropState.active = false;
    const hud = document.getElementById('crop-hud-overlay');
    if (hud) hud.classList.add('hidden');
    this.setTool('select');
  }

  /**
   * Render Crop overlay (dark shroud and rule-of-thirds grid)
   */
  renderCropOverlay(ctx) {
    if (!this.cropState.active) return;
    const c = this.cropState;
    const cw = this.canvasEngine.width;
    const ch = this.canvasEngine.height;
    const zoom = this.canvasEngine.zoom;

    // 1. Dark Shroud around cropped area
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';

    // Top
    ctx.fillRect(0, 0, cw, c.y);
    // Bottom
    ctx.fillRect(0, c.y + c.height, cw, ch - (c.y + c.height));
    // Left
    ctx.fillRect(0, c.y, c.x, c.height);
    // Right
    ctx.fillRect(c.x + c.width, c.y, cw - (c.x + c.width), c.height);

    // 2. Crop border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5 / zoom;
    ctx.strokeRect(c.x, c.y, c.width, c.height);

    // 3. Rule of Thirds grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1 / zoom;
    ctx.beginPath();
    // Vertical grid lines
    ctx.moveTo(c.x + c.width / 3, c.y);
    ctx.lineTo(c.x + c.width / 3, c.y + c.height);
    ctx.moveTo(c.x + (c.width / 3) * 2, c.y);
    ctx.lineTo(c.x + (c.width / 3) * 2, c.y + c.height);
    // Horizontal grid lines
    ctx.moveTo(c.x, c.y + c.height / 3);
    ctx.lineTo(c.x + c.width, c.y + c.height / 3);
    ctx.moveTo(c.x, c.y + (c.height / 3) * 2);
    ctx.lineTo(c.x + c.width, c.y + (c.height / 3) * 2);
    ctx.stroke();

    // 4. Crop handles (thick white L-corners and edge bars)
    const handleLen = 14 / zoom;
    const handleW = 3 / zoom;
    ctx.fillStyle = '#ffffff';

    // NW
    ctx.fillRect(c.x - handleW, c.y - handleW, handleLen, handleW * 2);
    ctx.fillRect(c.x - handleW, c.y - handleW, handleW * 2, handleLen);

    // NE
    ctx.fillRect(c.x + c.width - handleLen + handleW, c.y - handleW, handleLen, handleW * 2);
    ctx.fillRect(c.x + c.width - handleW, c.y - handleW, handleW * 2, handleLen);

    // SE
    ctx.fillRect(c.x + c.width - handleLen + handleW, c.y + c.height - handleW, handleLen, handleW * 2);
    ctx.fillRect(c.x + c.width - handleW, c.y + c.height - handleLen + handleW, handleW * 2, handleLen);

    // SW
    ctx.fillRect(c.x - handleW, c.y + c.height - handleW, handleLen, handleW * 2);
    ctx.fillRect(c.x - handleW, c.y + c.height - handleLen + handleW, handleW * 2, handleLen);

    ctx.restore();
  }

  /**
   * Render Marquee Selection box
   */
  renderMarquee(ctx) {
    if (!this.marqueeSelection) return;
    const m = this.marqueeSelection;
    const zoom = this.canvasEngine.zoom;

    ctx.save();
    ctx.strokeStyle = '#3b82f6';
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.lineWidth = 1 / zoom;
    ctx.setLineDash([4 / zoom, 3 / zoom]);

    ctx.fillRect(m.x, m.y, m.width, m.height);
    ctx.strokeRect(m.x, m.y, m.width, m.height);
    ctx.restore();
  }
}
