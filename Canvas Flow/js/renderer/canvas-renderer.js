/* ==========================================================================
   CANVASFLOW — Canvas Renderer Engine
   High Performance Multi-Layer 2D Canvas Renderer with HiDPI & Culling
   ========================================================================== */

import { appState } from '../state/state.js';
import { eventBus } from '../state/event-bus.js';
import {
  getObjectBounds,
  getSelectionHandles,
  getShapeAnchors,
  rotatePoint,
  catmullRomSpline,
  DEG_TO_RAD
} from '../utils/math.js';

export class CanvasRenderer {
  constructor(mainCanvas, overlayCanvas) {
    this.mainCanvas = mainCanvas;
    this.overlayCanvas = overlayCanvas;
    this.ctx = mainCanvas.getContext('2d');
    this.overlayCtx = overlayCanvas.getContext('2d');

    this.dpr = window.devicePixelRatio || 1;
    this.width = 0;
    this.height = 0;

    this.needsRender = true;
    this.isRendering = false;

    // Image Cache to prevent reloading image bitmaps every frame
    this.imageCache = new Map();

    // Transient interaction overlays
    this.selectionMarquee = null; // { x, y, width, height } in world coords
    this.hoveredAnchor = null;   // { x, y, elementId, anchor }
    this.connectorDraft = null;  // { x1, y1, x2, y2 } in world coords
    this.eraserTrail = null;     // { x, y, radius }

    // Performance tracking
    this.fps = 60;
    this.frameCount = 0;
    this.lastFpsTime = performance.now();

    this._setupEvents();
    this.resize();
    this._startRenderLoop();
  }

  _setupEvents() {
    eventBus.on('state:changed', () => this.requestRender());
    eventBus.on('viewport:changed', () => this.requestRender());
    eventBus.on('selection:changed', () => this.requestRender());
    eventBus.on('settings:changed', () => this.requestRender());
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const parent = this.mainCanvas.parentElement;
    if (!parent) return;

    this.width = parent.clientWidth;
    this.height = parent.clientHeight;
    this.dpr = window.devicePixelRatio || 1;

    // Scale main canvas for HiDPI
    this.mainCanvas.width = this.width * this.dpr;
    this.mainCanvas.height = this.height * this.dpr;
    this.mainCanvas.style.width = `${this.width}px`;
    this.mainCanvas.style.height = `${this.height}px`;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);

    // Scale overlay canvas for HiDPI
    this.overlayCanvas.width = this.width * this.dpr;
    this.overlayCanvas.height = this.height * this.dpr;
    this.overlayCanvas.style.width = `${this.width}px`;
    this.overlayCanvas.style.height = `${this.height}px`;
    this.overlayCtx.setTransform(1, 0, 0, 1, 0, 0);
    this.overlayCtx.scale(this.dpr, this.dpr);

    this.requestRender();
  }

  requestRender() {
    this.needsRender = true;
  }

  _startRenderLoop() {
    const loop = (timestamp) => {
      // Calculate FPS
      this.frameCount++;
      if (timestamp - this.lastFpsTime >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / (timestamp - this.lastFpsTime));
        this.frameCount = 0;
        this.lastFpsTime = timestamp;
        eventBus.emit('renderer:fps', this.fps);
      }

      if (this.needsRender) {
        this.render();
        this.needsRender = false;
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  /**
   * Convert Screen coordinate to World (Canvas) coordinate
   */
  screenToWorld(screenX, screenY) {
    const { panX, panY, zoom } = appState.viewport;
    return {
      x: (screenX - panX) / zoom,
      y: (screenY - panY) / zoom
    };
  }

  /**
   * Convert World (Canvas) coordinate to Screen coordinate
   */
  worldToScreen(worldX, worldY) {
    const { panX, panY, zoom } = appState.viewport;
    return {
      x: worldX * zoom + panX,
      y: worldY * zoom + panY
    };
  }

  /**
   * Main Render Pipeline
   */
  render() {
    const { ctx, overlayCtx, width, height } = this;
    const { panX, panY, zoom } = appState.viewport;
    const { theme, gridVisible, gridType } = appState.settings;

    // 1. Clear Viewports
    ctx.clearRect(0, 0, width, height);
    overlayCtx.clearRect(0, 0, width, height);

    // 2. Render Grid Background
    if (gridVisible && gridType !== 'none') {
      this.renderGrid(ctx, panX, panY, zoom, gridType, theme);
    }

    // 3. Render Objects with Viewport Frustum Culling
    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);

    // Calculate visible world bounding box for spatial culling
    const viewportBounds = {
      x: -panX / zoom - 50,
      y: -panY / zoom - 50,
      width: width / zoom + 100,
      height: height / zoom + 100
    };

    const objects = appState.getObjects();
    for (const obj of objects) {
      if (obj.visible === false) continue;
      const b = getObjectBounds(obj);
      // Culling check
      if (
        b.x + b.width >= viewportBounds.x &&
        b.x <= viewportBounds.x + viewportBounds.width &&
        b.y + b.height >= viewportBounds.y &&
        b.y <= viewportBounds.y + viewportBounds.height
      ) {
        this.renderObject(ctx, obj);
      }
    }

    ctx.restore();

    // 4. Render Interactive Overlays (Selection, Handles, Guides, Anchors)
    this.renderOverlays(overlayCtx, panX, panY, zoom);
  }

  /**
   * Render Infinite Grid (Dots or Lines)
   */
  renderGrid(ctx, panX, panY, zoom, type, theme) {
    const isDark = theme === 'dark';
    const baseGridSize = 24;
    let gridSize = baseGridSize * zoom;

    // Adaptive step multiplier to maintain comfortable dot spacing at extreme zooms
    while (gridSize < 12) gridSize *= 2;
    while (gridSize > 60) gridSize /= 2;

    const startX = panX % gridSize;
    const startY = panY % gridSize;

    ctx.save();

    if (type === 'dots') {
      ctx.fillStyle = isDark ? '#2a2d38' : '#d8dde6';
      const dotRadius = Math.max(1, Math.min(2, zoom));
      for (let x = startX; x < this.width; x += gridSize) {
        for (let y = startY; y < this.height; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (type === 'lines') {
      ctx.strokeStyle = isDark ? '#1e2129' : '#ebedf2';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = startX; x < this.width; x += gridSize) {
        ctx.moveTo(Math.floor(x) + 0.5, 0);
        ctx.lineTo(Math.floor(x) + 0.5, this.height);
      }
      for (let y = startY; y < this.height; y += gridSize) {
        ctx.moveTo(0, Math.floor(y) + 0.5);
        ctx.lineTo(this.width, Math.floor(y) + 0.5);
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Render a single canvas object
   */
  renderObject(ctx, obj) {
    ctx.save();

    // Global Object Properties
    ctx.globalAlpha = obj.opacity ?? 1;

    // Apply Stroke & Fill Styles
    ctx.strokeStyle = obj.stroke || '#3b82f6';
    ctx.fillStyle = obj.fill || 'transparent';
    ctx.lineWidth = obj.strokeWidth || 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (obj.strokeStyle === 'dashed') {
      ctx.setLineDash([8, 6]);
    } else if (obj.strokeStyle === 'dotted') {
      ctx.setLineDash([3, 4]);
    } else {
      ctx.setLineDash([]);
    }

    // Rotation transform if any
    const center = {
      x: obj.x + (obj.width || 0) / 2,
      y: obj.y + (obj.height || 0) / 2
    };

    if (obj.rotation) {
      ctx.translate(center.x, center.y);
      ctx.rotate(obj.rotation * DEG_TO_RAD);
      ctx.translate(-center.x, -center.y);
    }

    // Dispatch object type renderer
    switch (obj.type) {
      case 'rectangle':
      case 'rounded-rectangle':
        this._renderRectangle(ctx, obj);
        break;
      case 'ellipse':
        this._renderEllipse(ctx, obj);
        break;
      case 'diamond':
        this._renderDiamond(ctx, obj);
        break;
      case 'line':
        this._renderLine(ctx, obj);
        break;
      case 'arrow':
        this._renderArrow(ctx, obj);
        break;
      case 'connector':
        this._renderConnector(ctx, obj);
        break;
      case 'pencil':
        this._renderPencil(ctx, obj);
        break;
      case 'highlighter':
        this._renderHighlighter(ctx, obj);
        break;
      case 'text':
        this._renderText(ctx, obj);
        break;
      case 'sticky':
        this._renderSticky(ctx, obj);
        break;
      case 'image':
        this._renderImage(ctx, obj);
        break;
    }

    ctx.restore();
  }

  _renderRectangle(ctx, obj) {
    const { x, y, width, height, cornerRadius = 0 } = obj;
    ctx.beginPath();
    if (cornerRadius > 0 && ctx.roundRect) {
      ctx.roundRect(x, y, width, height, Math.min(cornerRadius, width / 2, height / 2));
    } else {
      ctx.rect(x, y, width, height);
    }
    if (obj.fill && obj.fill !== 'transparent') ctx.fill();
    if (obj.stroke && obj.stroke !== 'transparent' && obj.strokeWidth > 0) ctx.stroke();
  }

  _renderEllipse(ctx, obj) {
    const { x, y, width, height } = obj;
    const rx = width / 2;
    const ry = height / 2;
    ctx.beginPath();
    ctx.ellipse(x + rx, y + ry, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, Math.PI * 2);
    if (obj.fill && obj.fill !== 'transparent') ctx.fill();
    if (obj.stroke && obj.stroke !== 'transparent' && obj.strokeWidth > 0) ctx.stroke();
  }

  _renderDiamond(ctx, obj) {
    const { x, y, width, height } = obj;
    const cx = x + width / 2;
    const cy = y + height / 2;
    ctx.beginPath();
    ctx.moveTo(cx, y);
    ctx.lineTo(x + width, cy);
    ctx.lineTo(cx, y + height);
    ctx.lineTo(x, cy);
    ctx.closePath();
    if (obj.fill && obj.fill !== 'transparent') ctx.fill();
    if (obj.stroke && obj.stroke !== 'transparent' && obj.strokeWidth > 0) ctx.stroke();
  }

  _renderLine(ctx, obj) {
    const x2 = obj.x2 ?? obj.x;
    const y2 = obj.y2 ?? obj.y;
    ctx.beginPath();
    ctx.moveTo(obj.x, obj.y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  _renderArrow(ctx, obj) {
    const x1 = obj.x;
    const y1 = obj.y;
    const x2 = obj.x2 ?? obj.x;
    const y2 = obj.y2 ?? obj.y;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Arrowhead calculations
    if (obj.arrowHeadEnd === 'triangle') {
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const headLen = Math.max(12, (obj.strokeWidth || 2) * 4);
      ctx.fillStyle = obj.stroke || '#3b82f6';
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(
        x2 - headLen * Math.cos(angle - Math.PI / 6),
        y2 - headLen * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        x2 - headLen * Math.cos(angle + Math.PI / 6),
        y2 - headLen * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
    }
  }

  _renderConnector(ctx, obj) {
    // Resolve start/end positions based on bound objects if bound
    let startPt = { x: obj.x, y: obj.y };
    let endPt = { x: obj.x2 ?? obj.x + 100, y: obj.y2 ?? obj.y + 100 };

    if (obj.startBinding) {
      const target = appState.getObjectById(obj.startBinding.elementId);
      if (target) {
        const anchors = getShapeAnchors(target);
        const match = anchors.find(a => a.id === obj.startBinding.anchor);
        if (match) startPt = { x: match.x, y: match.y };
      }
    }

    if (obj.endBinding) {
      const target = appState.getObjectById(obj.endBinding.elementId);
      if (target) {
        const anchors = getShapeAnchors(target);
        const match = anchors.find(a => a.id === obj.endBinding.anchor);
        if (match) endPt = { x: match.x, y: match.y };
      }
    }

    const dx = endPt.x - startPt.x;
    const dy = endPt.y - startPt.y;

    ctx.beginPath();
    ctx.moveTo(startPt.x, startPt.y);

    if (obj.routing === 'curved') {
      const cp1x = startPt.x + dx * 0.5;
      const cp1y = startPt.y;
      const cp2x = startPt.x + dx * 0.5;
      const cp2y = endPt.y;
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endPt.x, endPt.y);
    } else if (obj.routing === 'stepped') {
      const midX = startPt.x + dx / 2;
      ctx.lineTo(midX, startPt.y);
      ctx.lineTo(midX, endPt.y);
      ctx.lineTo(endPt.x, endPt.y);
    } else {
      ctx.lineTo(endPt.x, endPt.y);
    }
    ctx.stroke();

    // Arrowhead on connector end
    if (obj.arrowHeadEnd === 'triangle') {
      const angle = Math.atan2(endPt.y - (obj.routing === 'curved' ? endPt.y : startPt.y), endPt.x - (startPt.x + dx * 0.5));
      const headLen = Math.max(10, (obj.strokeWidth || 2) * 3.5);
      ctx.fillStyle = obj.stroke || '#6b7280';
      ctx.beginPath();
      ctx.moveTo(endPt.x, endPt.y);
      ctx.lineTo(
        endPt.x - headLen * Math.cos(angle - Math.PI / 6),
        endPt.y - headLen * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        endPt.x - headLen * Math.cos(angle + Math.PI / 6),
        endPt.y - headLen * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
    }
  }

  _renderPencil(ctx, obj) {
    if (!obj.points || obj.points.length < 2) return;
    ctx.beginPath();
    catmullRomSpline(ctx, obj.points, 0.4);
    ctx.stroke();
  }

  _renderHighlighter(ctx, obj) {
    if (!obj.points || obj.points.length < 2) return;
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = obj.opacity ?? 0.4;
    ctx.lineWidth = obj.strokeWidth || 16;
    ctx.lineCap = 'square';
    ctx.beginPath();
    catmullRomSpline(ctx, obj.points, 0.4);
    ctx.stroke();
    ctx.restore();
  }

  _renderText(ctx, obj) {
    const { x, y, width, height, text = '', fontSize = 18, fontFamily, fontWeight = 'normal', fontStyle = 'normal', textAlign = 'left', color = '#f3f4f6' } = obj;
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = textAlign;
    ctx.textBaseline = 'top';

    const lines = text.split('\n');
    const lineHeight = fontSize * (obj.lineHeight || 1.35);

    let startX = x;
    if (textAlign === 'center') startX = x + width / 2;
    else if (textAlign === 'right') startX = x + width;

    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], startX, y + i * lineHeight);
    }
  }

  _renderSticky(ctx, obj) {
    const { x, y, width, height, fill = '#fef08a', text = '', color = '#713f12', fontSize = 15, fontFamily, textAlign = 'left' } = obj;

    // Drop Shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, width, height);
    ctx.restore();

    // Subtle border
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);

    // Text inside sticky note
    ctx.font = `500 ${fontSize}px ${fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'}`;
    ctx.fillStyle = color;
    ctx.textAlign = textAlign;
    ctx.textBaseline = 'top';

    const padding = 14;
    const availableWidth = width - padding * 2;
    let startX = x + padding;
    if (textAlign === 'center') startX = x + width / 2;
    else if (textAlign === 'right') startX = x + width - padding;

    // Auto-wrap text within sticky note width
    const words = text.split(' ');
    let line = '';
    let currY = y + padding;
    const lineHeight = fontSize * 1.35;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (words[n].includes('\n')) {
        const parts = words[n].split('\n');
        line += parts[0];
        ctx.fillText(line, startX, currY);
        currY += lineHeight;
        line = parts[1] + ' ';
        continue;
      }

      if (testWidth > availableWidth && n > 0) {
        ctx.fillText(line, startX, currY);
        line = words[n] + ' ';
        currY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, startX, currY);
  }

  _renderImage(ctx, obj) {
    const { x, y, width, height, src } = obj;
    if (!src) return;

    let img = this.imageCache.get(src);
    if (!img) {
      img = new Image();
      img.src = src;
      img.onload = () => this.requestRender();
      this.imageCache.set(src, img);
    }

    if (img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, x, y, width, height);
    } else {
      // Placeholder while image is decoding
      ctx.fillStyle = 'rgba(100, 100, 100, 0.2)';
      ctx.fillRect(x, y, width, height);
      ctx.strokeStyle = '#6b7280';
      ctx.strokeRect(x, y, width, height);
    }
  }

  /**
   * Render Interactive Overlays (Selection, Handles, Smart Guides, Anchors)
   */
  renderOverlays(ctx, panX, panY, zoom) {
    const selectedObjects = appState.getSelectedObjects();
    const isDark = appState.settings.theme === 'dark';

    // 1. Render Smart Alignment Guides
    if (appState.activeGuides && appState.activeGuides.length > 0) {
      ctx.save();
      ctx.strokeStyle = isDark ? '#f43f5e' : '#e11d48';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);

      for (const guide of appState.activeGuides) {
        ctx.beginPath();
        if (guide.type === 'vertical') {
          const screenX = guide.x * zoom + panX;
          const screenY1 = guide.y1 * zoom + panY;
          const screenY2 = guide.y2 * zoom + panY;
          ctx.moveTo(screenX, screenY1);
          ctx.lineTo(screenX, screenY2);
        } else if (guide.type === 'horizontal') {
          const screenY = guide.y * zoom + panY;
          const screenX1 = guide.x1 * zoom + panX;
          const screenX2 = guide.x2 * zoom + panX;
          ctx.moveTo(screenX1, screenY);
          ctx.lineTo(screenX2, screenY);
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    // 2. Render Selection Bounding Box & Handles
    if (selectedObjects.length > 0) {
      ctx.save();

      // If single selection, use object bounds & rotation
      if (selectedObjects.length === 1) {
        const obj = selectedObjects[0];
        const b = getObjectBounds(obj);
        const isLocked = obj.locked;

        const screenB = {
          x: b.x * zoom + panX,
          y: b.y * zoom + panY,
          width: b.width * zoom,
          height: b.height * zoom
        };

        const centerScreen = {
          x: screenB.x + screenB.width / 2,
          y: screenB.y + screenB.height / 2
        };

        ctx.translate(centerScreen.x, centerScreen.y);
        if (obj.rotation) {
          ctx.rotate(obj.rotation * DEG_TO_RAD);
        }
        ctx.translate(-centerScreen.x, -centerScreen.y);

        // Bounding Box
        ctx.strokeStyle = isLocked ? '#6b7280' : '#3b82f6';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(screenB.x, screenB.y, screenB.width, screenB.height);

        // Selection Handles (if not locked)
        if (!isLocked) {
          if (['line', 'arrow', 'connector'].includes(obj.type)) {
            const p1 = { x: obj.x * zoom + panX, y: obj.y * zoom + panY, id: 'start' };
            const p2 = { x: (obj.x2 ?? obj.x) * zoom + panX, y: (obj.y2 ?? obj.y) * zoom + panY, id: 'end' };
            this._drawEndpointHandles(ctx, [p1, p2], isDark);
          } else {
            const handles = getSelectionHandles(screenB, 0, 8);
            this._drawHandles(ctx, handles, isDark);
          }
        }

      } else {
        // Multi-selection: enclosing group bounds
        const totalBounds = appState.getSelectedBounds();
        if (totalBounds) {
          const screenB = {
            x: totalBounds.x * zoom + panX,
            y: totalBounds.y * zoom + panY,
            width: totalBounds.width * zoom,
            height: totalBounds.height * zoom
          };

          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 3]);
          ctx.strokeRect(screenB.x, screenB.y, screenB.width, screenB.height);
          ctx.setLineDash([]);

          const handles = getSelectionHandles(screenB, 0, 8);
          this._drawHandles(ctx, handles, isDark);
        }
      }

      ctx.restore();
    }

    // 3. Render Connector Anchors when connector tool is active or hovering
    if (appState.activeTool === 'connector' || this.hoveredAnchor) {
      ctx.save();
      const objects = appState.getObjects();
      for (const obj of objects) {
        if (obj.visible === false || ['pencil', 'highlighter'].includes(obj.type)) continue;
        const anchors = getShapeAnchors(obj);
        for (const anchor of anchors) {
          const screenX = anchor.x * zoom + panX;
          const screenY = anchor.y * zoom + panY;
          const isHovered = this.hoveredAnchor &&
            Math.hypot(this.hoveredAnchor.x - anchor.x, this.hoveredAnchor.y - anchor.y) < 5;

          ctx.fillStyle = isHovered ? '#3b82f6' : (isDark ? '#1e293b' : '#ffffff');
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(screenX, screenY, isHovered ? 6 : 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    // 4. Render Drag Selection Marquee
    if (this.selectionMarquee) {
      const { x, y, width, height } = this.selectionMarquee;
      const screenX = x * zoom + panX;
      const screenY = y * zoom + panY;
      const screenW = width * zoom;
      const screenH = height * zoom;

      ctx.save();
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1;
      ctx.fillRect(screenX, screenY, screenW, screenH);
      ctx.strokeRect(screenX, screenY, screenW, screenH);
      ctx.restore();
    }

    // 5. Render Eraser Trail Circle
    if (this.eraserTrail) {
      ctx.save();
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(this.eraserTrail.x, this.eraserTrail.y, this.eraserTrail.radius || 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }

  _drawHandles(ctx, handles, isDark) {
    const handleSize = 8;
    const half = handleSize / 2;

    for (const h of handles) {
      if (h.id === 'rot') {
        // Draw rotation stem line & round handle
        const nHandle = handles.find(item => item.id === 'n');
        if (nHandle) {
          ctx.beginPath();
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 1.5;
          ctx.moveTo(nHandle.x, nHandle.y);
          ctx.lineTo(h.x, h.y);
          ctx.stroke();
        }
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(h.x, h.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else {
        // Square Resize Handle
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1.5;
        ctx.fillRect(h.x - half, h.y - half, handleSize, handleSize);
        ctx.strokeRect(h.x - half, h.y - half, handleSize, handleSize);
      }
    }
  }

  _drawEndpointHandles(ctx, endpoints, isDark) {
    for (const ep of endpoints) {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ep.x, ep.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  /**
   * Render Canvas to Offscreen for Image Export (PNG / SVG)
   */
  renderToExportCanvas(options = {}) {
    const { scale = 2, bg = 'canvas', scope = 'all' } = options;
    const isDark = appState.settings.theme === 'dark';

    let targetObjects = appState.getObjects().filter(o => o.visible !== false);
    if (scope === 'selection') {
      const selected = appState.getSelectedObjects().filter(o => o.visible !== false);
      if (selected.length > 0) targetObjects = selected;
    }

    if (targetObjects.length === 0) return null;

    const bounds = unionBounds(targetObjects.map(o => getObjectBounds(o)));
    const padding = 40;
    const exportW = Math.max(100, Math.ceil(bounds.width + padding * 2));
    const exportH = Math.max(100, Math.ceil(bounds.height + padding * 2));

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = exportW * scale;
    exportCanvas.height = exportH * scale;
    const expCtx = exportCanvas.getContext('2d');

    expCtx.scale(scale, scale);

    // Fill background
    if (bg === 'canvas') {
      expCtx.fillStyle = isDark ? '#16171b' : '#ffffff';
      expCtx.fillRect(0, 0, exportW, exportH);
    } else if (bg === 'white') {
      expCtx.fillStyle = '#ffffff';
      expCtx.fillRect(0, 0, exportW, exportH);
    }
    // if 'transparent', leave blank

    expCtx.save();
    expCtx.translate(-bounds.x + padding, -bounds.y + padding);

    for (const obj of targetObjects) {
      this.renderObject(expCtx, obj);
    }

    expCtx.restore();
    return exportCanvas;
  }
}
