/**
 * MediaStudio — Layer Engine
 * Core object model for Image, Text, Shape, and Freehand Drawing layers.
 */

import { FilterEngine } from './filter-engine.js';

/**
 * Base Layer class
 */
export class Layer {
  constructor(options = {}) {
    this.id = options.id || 'layer_' + Math.random().toString(36).substr(2, 9);
    this.name = options.name || 'Layer';
    this.type = options.type || 'base';

    // Position & Transform
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.width = options.width || 100;
    this.height = options.height || 100;
    this.rotation = options.rotation || 0; // in degrees
    this.flipH = options.flipH || false;
    this.flipV = options.flipV || false;

    // Blending & State
    this.opacity = options.opacity !== undefined ? options.opacity : 1.0;
    this.blendMode = options.blendMode || 'normal';
    this.visible = options.visible !== undefined ? options.visible : true;
    this.locked = options.locked !== undefined ? options.locked : false;

    this.isDirty = true;
  }

  /**
   * Get 4 corners in canvas coordinate space taking rotation & position into account
   */
  getCorners() {
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;
    const rad = (this.rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const hw = this.width / 2;
    const hh = this.height / 2;

    const localCorners = [
      { x: -hw, y: -hh }, // Top-Left
      { x: hw, y: -hh },  // Top-Right
      { x: hw, y: hh },   // Bottom-Right
      { x: -hw, y: hh }   // Bottom-Left
    ];

    return localCorners.map(pt => ({
      x: cx + (pt.x * cos - pt.y * sin),
      y: cy + (pt.x * sin + pt.y * cos)
    }));
  }

  /**
   * Get axis-aligned bounding box encompassing rotated layer
   */
  getAxisAlignedBounds() {
    const corners = this.getCorners();
    const xs = corners.map(c => c.x);
    const ys = corners.map(c => c.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  /**
   * Transform a point from world (canvas) space to layer local space
   */
  worldToLocal(px, py) {
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;
    const rad = (-this.rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const dx = px - cx;
    const dy = py - cy;

    return {
      x: dx * cos - dy * sin + this.width / 2,
      y: dx * sin + dy * cos + this.height / 2
    };
  }

  /**
   * Point-in-polygon hit test
   */
  containsPoint(px, py) {
    if (!this.visible) return false;
    const local = this.worldToLocal(px, py);
    return local.x >= 0 && local.x <= this.width && local.y >= 0 && local.y <= this.height;
  }

  /**
   * Pre-render transform setup
   */
  applyTransform(ctx) {
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;

    ctx.save();
    ctx.translate(cx, cy);

    if (this.rotation !== 0) {
      ctx.rotate((this.rotation * Math.PI) / 180);
    }

    const scaleX = this.flipH ? -1 : 1;
    const scaleY = this.flipV ? -1 : 1;
    if (scaleX !== 1 || scaleY !== 1) {
      ctx.scale(scaleX, scaleY);
    }

    ctx.globalAlpha = this.opacity;
    ctx.globalCompositeOperation = this.blendMode;
  }

  restoreTransform(ctx) {
    ctx.restore();
  }

  render(ctx) {
    // Override in subclass
  }

  async getThumbnail(targetWidth = 64, targetHeight = 48) {
    const thumbCanvas = document.createElement('canvas');
    thumbCanvas.width = targetWidth;
    thumbCanvas.height = targetHeight;
    const tCtx = thumbCanvas.getContext('2d');

    // Scale layer content to fit thumbnail
    const scale = Math.min(targetWidth / Math.max(1, this.width), targetHeight / Math.max(1, this.height));
    const tx = (targetWidth - this.width * scale) / 2;
    const ty = (targetHeight - this.height * scale) / 2;

    tCtx.save();
    tCtx.translate(tx, ty);
    tCtx.scale(scale, scale);
    this.drawContent(tCtx);
    tCtx.restore();

    return thumbCanvas.toDataURL('image/png');
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      rotation: this.rotation,
      flipH: this.flipH,
      flipV: this.flipV,
      opacity: this.opacity,
      blendMode: this.blendMode,
      visible: this.visible,
      locked: this.locked
    };
  }
}

/**
 * Image Layer
 */
export class ImageLayer extends Layer {
  constructor(options = {}) {
    super({ ...options, type: 'image' });
    this.image = options.image || null;
    this.src = options.src || '';
    this.naturalWidth = options.naturalWidth || (this.image ? this.image.naturalWidth || this.image.width : this.width);
    this.naturalHeight = options.naturalHeight || (this.image ? this.image.naturalHeight || this.image.height : this.height);

    // Adjustments
    this.adjustments = {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      exposure: 0,
      warmth: 0,
      blur: 0,
      sharpen: 0,
      vignette: 0,
      grayscale: 0,
      sepia: 0,
      invert: 0,
      hueRotate: 0,
      ...(options.adjustments || {})
    };

    this.activeFilterPreset = options.activeFilterPreset || 'original';
    this.cachedProcessedCanvas = null;

    if (this.image) {
      this.updateCache();
    }
  }

  updateCache() {
    if (!this.image) return;

    // Create raw offscreen canvas for image source
    const rawCanvas = document.createElement('canvas');
    rawCanvas.width = this.naturalWidth || this.image.width || 100;
    rawCanvas.height = this.naturalHeight || this.image.height || 100;
    const rawCtx = rawCanvas.getContext('2d');
    rawCtx.drawImage(this.image, 0, 0, rawCanvas.width, rawCanvas.height);

    // Apply adjustments through filter engine
    this.cachedProcessedCanvas = FilterEngine.applyAdjustments(rawCanvas, this.adjustments);
    this.isDirty = false;
  }

  drawContent(ctx) {
    if (!this.cachedProcessedCanvas && this.image) {
      this.updateCache();
    }

    if (this.cachedProcessedCanvas) {
      ctx.drawImage(
        this.cachedProcessedCanvas,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
    }
  }

  render(ctx) {
    if (!this.visible) return;
    this.applyTransform(ctx);
    this.drawContent(ctx);
    this.restoreTransform(ctx);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      src: this.src || (this.cachedProcessedCanvas ? this.cachedProcessedCanvas.toDataURL('image/png') : ''),
      naturalWidth: this.naturalWidth,
      naturalHeight: this.naturalHeight,
      adjustments: { ...this.adjustments },
      activeFilterPreset: this.activeFilterPreset
    };
  }

  static async fromJSON(data) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = data.src;
    });

    return new ImageLayer({
      ...data,
      image: img
    });
  }
}

/**
 * Text Layer
 */
export class TextLayer extends Layer {
  constructor(options = {}) {
    super({ ...options, type: 'text' });
    this.text = options.text || 'Double click to edit text';
    this.fontFamily = options.fontFamily || 'Inter';
    this.fontSize = options.fontSize || 48;
    this.fontWeight = options.fontWeight || '400';
    this.fontStyle = options.fontStyle || 'normal';
    this.textAlign = options.textAlign || 'left';
    this.lineHeight = options.lineHeight || 1.2;
    this.letterSpacing = options.letterSpacing || 0;

    // Styling
    this.fillColor = options.fillColor || '#ffffff';
    this.strokeColor = options.strokeColor || '#000000';
    this.strokeWidth = options.strokeWidth || 0;

    // Drop shadow
    this.shadow = {
      enabled: false,
      color: '#000000',
      blur: 8,
      offsetX: 0,
      offsetY: 4,
      ...(options.shadow || {})
    };

    this.recalculateDimensions();
  }

  recalculateDimensions() {
    const helperCanvas = document.createElement('canvas');
    const ctx = helperCanvas.getContext('2d');
    ctx.font = `${this.fontStyle} ${this.fontWeight} ${this.fontSize}px "${this.fontFamily}", sans-serif`;

    const lines = this.text.split('\n');
    let maxLineWidth = 0;

    for (const line of lines) {
      const metrics = ctx.measureText(line);
      const textWidth = metrics.width + (line.length - 1) * this.letterSpacing;
      if (textWidth > maxLineWidth) maxLineWidth = textWidth;
    }

    const lineH = this.fontSize * this.lineHeight;
    const totalHeight = lines.length * lineH;

    this.width = Math.max(30, Math.ceil(maxLineWidth + 20));
    this.height = Math.max(20, Math.ceil(totalHeight + 10));
  }

  drawContent(ctx) {
    ctx.font = `${this.fontStyle} ${this.fontWeight} ${this.fontSize}px "${this.fontFamily}", sans-serif`;
    ctx.textBaseline = 'top';

    const lines = this.text.split('\n');
    const lineH = this.fontSize * this.lineHeight;
    const startY = -this.height / 2 + 5;

    // Setup Shadow
    if (this.shadow.enabled) {
      ctx.shadowColor = this.shadow.color;
      ctx.shadowBlur = this.shadow.blur;
      ctx.shadowOffsetX = this.shadow.offsetX;
      ctx.shadowOffsetY = this.shadow.offsetY;
    } else {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }

    lines.forEach((line, index) => {
      let startX = -this.width / 2 + 10;
      const lineWidth = ctx.measureText(line).width + (line.length - 1) * this.letterSpacing;

      if (this.textAlign === 'center') {
        startX = -lineWidth / 2;
      } else if (this.textAlign === 'right') {
        startX = this.width / 2 - lineWidth - 10;
      }

      const y = startY + index * lineH;

      // Draw Stroke if configured
      if (this.strokeWidth > 0) {
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.strokeWidth;
        ctx.lineJoin = 'round';
        this._renderTextWithSpacing(ctx, line, startX, y, true);
      }

      // Draw Fill
      ctx.fillStyle = this.fillColor;
      this._renderTextWithSpacing(ctx, line, startX, y, false);
    });
  }

  _renderTextWithSpacing(ctx, line, startX, y, isStroke) {
    if (this.letterSpacing === 0) {
      if (isStroke) ctx.strokeText(line, startX, y);
      else ctx.fillText(line, startX, y);
      return;
    }

    let currentX = startX;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (isStroke) ctx.strokeText(char, currentX, y);
      else ctx.fillText(char, currentX, y);
      currentX += ctx.measureText(char).width + this.letterSpacing;
    }
  }

  render(ctx) {
    if (!this.visible) return;
    this.applyTransform(ctx);
    this.drawContent(ctx);
    this.restoreTransform(ctx);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      text: this.text,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      fontWeight: this.fontWeight,
      fontStyle: this.fontStyle,
      textAlign: this.textAlign,
      lineHeight: this.lineHeight,
      letterSpacing: this.letterSpacing,
      fillColor: this.fillColor,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      shadow: { ...this.shadow }
    };
  }

  static fromJSON(data) {
    return new TextLayer(data);
  }
}

/**
 * Vector Shape Layer
 */
export class ShapeLayer extends Layer {
  constructor(options = {}) {
    super({ ...options, type: 'shape' });
    this.shapeType = options.shapeType || 'rectangle'; // rectangle, rounded-rect, ellipse, star, polygon, line, arrow, heart, bubble
    this.fillType = options.fillType || 'solid'; // solid, linear-gradient, radial-gradient, none
    this.fillColor = options.fillColor || '#3b82f6';
    
    // Gradient settings
    this.gradientConfig = {
      c1: '#3b82f6',
      c2: '#8b5cf6',
      angle: 45,
      ...(options.gradientConfig || {})
    };

    // Stroke
    this.strokeColor = options.strokeColor || '#ffffff';
    this.strokeWidth = options.strokeWidth !== undefined ? options.strokeWidth : 0;
    this.strokeStyle = options.strokeStyle || 'solid'; // solid, dashed, dotted

    // Shape attributes
    this.cornerRadius = options.cornerRadius !== undefined ? options.cornerRadius : (this.shapeType === 'rounded-rect' ? 16 : 0);
    this.polygonSides = options.polygonSides || 5;
    this.starPoints = options.starPoints || 5;
  }

  getFillStyle(ctx) {
    if (this.fillType === 'none') return 'transparent';
    if (this.fillType === 'solid') return this.fillColor;

    const hw = this.width / 2;
    const hh = this.height / 2;

    if (this.fillType === 'linear-gradient') {
      const rad = (this.gradientConfig.angle * Math.PI) / 180;
      const x1 = -hw * Math.cos(rad);
      const y1 = -hh * Math.sin(rad);
      const x2 = hw * Math.cos(rad);
      const y2 = hh * Math.sin(rad);

      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, this.gradientConfig.c1);
      grad.addColorStop(1, this.gradientConfig.c2);
      return grad;
    }

    if (this.fillType === 'radial-gradient') {
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(hw, hh));
      grad.addColorStop(0, this.gradientConfig.c1);
      grad.addColorStop(1, this.gradientConfig.c2);
      return grad;
    }

    return this.fillColor;
  }

  drawContent(ctx) {
    const hw = this.width / 2;
    const hh = this.height / 2;

    ctx.fillStyle = this.getFillStyle(ctx);
    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = this.strokeWidth;

    if (this.strokeStyle === 'dashed') {
      ctx.setLineDash([8, 6]);
    } else if (this.strokeStyle === 'dotted') {
      ctx.setLineDash([2, 4]);
    } else {
      ctx.setLineDash([]);
    }

    ctx.beginPath();

    switch (this.shapeType) {
      case 'rectangle':
      case 'rounded-rect':
        if (this.cornerRadius > 0) {
          const r = Math.min(this.cornerRadius, hw, hh);
          ctx.roundRect(-hw, -hh, this.width, this.height, r);
        } else {
          ctx.rect(-hw, -hh, this.width, this.height);
        }
        break;

      case 'ellipse':
        ctx.ellipse(0, 0, hw, hh, 0, 0, Math.PI * 2);
        break;

      case 'star':
        this._drawStarPath(ctx, hw, hh, this.starPoints);
        break;

      case 'polygon':
        this._drawPolygonPath(ctx, hw, hh, this.polygonSides);
        break;

      case 'line':
        ctx.moveTo(-hw, hh);
        ctx.lineTo(hw, -hh);
        break;

      case 'arrow':
        this._drawArrowPath(ctx, hw, hh);
        break;

      case 'heart':
        this._drawHeartPath(ctx, hw, hh);
        break;

      case 'bubble':
        this._drawBubblePath(ctx, hw, hh);
        break;

      default:
        ctx.rect(-hw, -hh, this.width, this.height);
        break;
    }

    if (this.fillType !== 'none' && this.shapeType !== 'line') {
      ctx.fill();
    }

    if (this.strokeWidth > 0) {
      ctx.stroke();
    }
  }

  _drawStarPath(ctx, hw, hh, points = 5) {
    const innerRadius = Math.min(hw, hh) * 0.45;
    const outerRadius = Math.min(hw, hh);
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / points;

    ctx.moveTo(0, -outerRadius);
    for (let i = 0; i < points; i++) {
      let x = Math.cos(rot) * outerRadius;
      let y = Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = Math.cos(rot) * innerRadius;
      y = Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.closePath();
  }

  _drawPolygonPath(ctx, hw, hh, sides = 5) {
    const radius = Math.min(hw, hh);
    const angleStep = (Math.PI * 2) / sides;
    const startAngle = -Math.PI / 2;

    ctx.moveTo(radius * Math.cos(startAngle), radius * Math.sin(startAngle));
    for (let i = 1; i < sides; i++) {
      const angle = startAngle + i * angleStep;
      ctx.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
    }
    ctx.closePath();
  }

  _drawArrowPath(ctx, hw, hh) {
    const headSize = Math.min(24, hw * 0.5);
    ctx.moveTo(-hw, 0);
    ctx.lineTo(hw, 0);
    ctx.lineTo(hw - headSize, -headSize * 0.6);
    ctx.moveTo(hw, 0);
    ctx.lineTo(hw - headSize, headSize * 0.6);
  }

  _drawHeartPath(ctx, hw, hh) {
    const topCurveHeight = hh * 0.3;
    ctx.moveTo(0, hh * 0.8);
    // Left curve
    ctx.bezierCurveTo(-hw * 1.1, 0, -hw * 0.9, -hh * 0.9, 0, -topCurveHeight);
    // Right curve
    ctx.bezierCurveTo(hw * 0.9, -hh * 0.9, hw * 1.1, 0, 0, hh * 0.8);
    ctx.closePath();
  }

  _drawBubblePath(ctx, hw, hh) {
    const r = Math.min(12, hw * 0.2);
    const bodyH = hh * 0.75;
    ctx.roundRect(-hw, -hh, this.width, bodyH * 2, r);
    // Tail
    ctx.moveTo(-hw * 0.4, bodyH);
    ctx.lineTo(-hw * 0.6, hh);
    ctx.lineTo(-hw * 0.1, bodyH);
  }

  render(ctx) {
    if (!this.visible) return;
    this.applyTransform(ctx);
    this.drawContent(ctx);
    this.restoreTransform(ctx);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      shapeType: this.shapeType,
      fillType: this.fillType,
      fillColor: this.fillColor,
      gradientConfig: { ...this.gradientConfig },
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      strokeStyle: this.strokeStyle,
      cornerRadius: this.cornerRadius,
      polygonSides: this.polygonSides,
      starPoints: this.starPoints
    };
  }

  static fromJSON(data) {
    return new ShapeLayer(data);
  }
}

/**
 * Freehand Drawing Layer
 */
export class DrawingLayer extends Layer {
  constructor(options = {}) {
    super({ ...options, type: 'drawing' });
    this.strokes = options.strokes || [];
    this.drawingCanvas = null;
    this.initCanvas();
  }

  initCanvas() {
    this.drawingCanvas = document.createElement('canvas');
    this.drawingCanvas.width = Math.max(10, this.width);
    this.drawingCanvas.height = Math.max(10, this.height);
    this.redrawAllStrokes();
  }

  addStroke(stroke) {
    this.strokes.push(stroke);
    this.drawSingleStroke(this.drawingCanvas.getContext('2d'), stroke);
  }

  clear() {
    this.strokes = [];
    if (this.drawingCanvas) {
      const ctx = this.drawingCanvas.getContext('2d');
      ctx.clearRect(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);
    }
  }

  redrawAllStrokes() {
    if (!this.drawingCanvas) return;
    const ctx = this.drawingCanvas.getContext('2d');
    ctx.clearRect(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);

    for (const stroke of this.strokes) {
      this.drawSingleStroke(ctx, stroke);
    }
  }

  drawSingleStroke(ctx, stroke) {
    const pts = stroke.points;
    if (!pts || pts.length < 1) return;

    ctx.save();
    if (stroke.isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = stroke.color;
      ctx.fillStyle = stroke.color;
    }

    ctx.globalAlpha = stroke.opacity !== undefined ? stroke.opacity : 1.0;
    ctx.lineWidth = stroke.size || 12;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (pts.length === 1) {
      ctx.beginPath();
      ctx.arc(pts[0].x, pts[0].y, (stroke.size || 12) / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);

      for (let i = 1; i < pts.length - 1; i++) {
        const xc = (pts[i].x + pts[i + 1].x) / 2;
        const yc = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
      }

      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawContent(ctx) {
    if (this.drawingCanvas) {
      ctx.drawImage(
        this.drawingCanvas,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
    }
  }

  render(ctx) {
    if (!this.visible) return;
    this.applyTransform(ctx);
    this.drawContent(ctx);
    this.restoreTransform(ctx);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      strokes: JSON.parse(JSON.stringify(this.strokes))
    };
  }

  static fromJSON(data) {
    const layer = new DrawingLayer(data);
    return layer;
  }
}
