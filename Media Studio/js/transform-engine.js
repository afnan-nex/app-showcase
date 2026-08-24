/**
 * MediaStudio — Transform Engine
 * 8-handle transformation, rotation with angle snapping, aspect ratio locking, and smart alignment guides.
 */

export class TransformEngine {
  constructor(canvasEngine) {
    this.canvasEngine = canvasEngine;
    this.handleSize = 8; // in screen pixels
    this.rotationHandleDistance = 24; // in screen pixels
    this.activeHandle = null;
    this.transformState = null;
    this.snapThreshold = 6; // snap tolerance in canvas px
    this.activeGuides = []; // active guide lines for overlay
  }

  /**
   * Get handle definitions for a selected layer in canvas coordinates
   */
  getHandles(layer) {
    const hw = layer.width / 2;
    const hh = layer.height / 2;
    const cx = layer.x + hw;
    const cy = layer.y + hh;
    const rad = (layer.rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const localPoints = {
      nw: { x: -hw, y: -hh, cursorAngle: 315 },
      n:  { x: 0,   y: -hh, cursorAngle: 0 },
      ne: { x: hw,  y: -hh, cursorAngle: 45 },
      e:  { x: hw,  y: 0,   cursorAngle: 90 },
      se: { x: hw,  y: hh,  cursorAngle: 135 },
      s:  { x: 0,   y: hh,  cursorAngle: 180 },
      sw: { x: -hw, y: hh,  cursorAngle: 225 },
      w:  { x: -hw, y: 0,   cursorAngle: 270 },
      rot: { x: 0,  y: -hh - this.rotationHandleDistance / this.canvasEngine.zoom, cursorAngle: 0 }
    };

    const handles = {};
    for (const [key, pt] of Object.entries(localPoints)) {
      handles[key] = {
        x: cx + (pt.x * cos - pt.y * sin),
        y: cy + (pt.x * sin + pt.y * cos),
        cursorAngle: (pt.cursorAngle + layer.rotation) % 360
      };
    }

    return handles;
  }

  /**
   * Hit test against transform handles
   */
  hitTestHandles(layer, worldX, worldY) {
    if (!layer) return null;
    const handles = this.getHandles(layer);
    const hitRadius = (this.handleSize * 1.5) / this.canvasEngine.zoom;

    for (const [name, pos] of Object.entries(handles)) {
      const dx = worldX - pos.x;
      const dy = worldY - pos.y;
      if (Math.sqrt(dx * dx + dy * dy) <= hitRadius) {
        return name;
      }
    }
    return null;
  }

  /**
   * Get appropriate CSS cursor for a given handle based on rotated angle
   */
  getCursorForHandle(handleName, layer) {
    if (!handleName || !layer) return 'default';
    if (handleName === 'rot') return 'crosshair';

    const handles = this.getHandles(layer);
    const angle = handles[handleName].cursorAngle;
    const normalized = (angle + 360) % 180;

    if (normalized >= 22.5 && normalized < 67.5) return 'nesw-resize';
    if (normalized >= 67.5 && normalized < 112.5) return 'ew-resize';
    if (normalized >= 112.5 && normalized < 157.5) return 'nwse-resize';
    return 'ns-resize';
  }

  /**
   * Begin transform drag interaction
   */
  startTransform(handle, layer, startWorldX, startWorldY, options = {}) {
    this.activeHandle = handle;
    this.activeGuides = [];

    const hw = layer.width / 2;
    const hh = layer.height / 2;

    this.transformState = {
      handle,
      layer,
      startX: startWorldX,
      startY: startWorldY,
      initialLayerX: layer.x,
      initialLayerY: layer.y,
      initialWidth: layer.width,
      initialHeight: layer.height,
      initialRotation: layer.rotation,
      centerX: layer.x + hw,
      centerY: layer.y + hh,
      aspectRatio: layer.width / Math.max(1, layer.height),
      lockAspect: options.lockAspect !== undefined ? options.lockAspect : true
    };
  }

  /**
   * Process mouse movement during transform
   */
  updateTransform(currentWorldX, currentWorldY, event) {
    if (!this.transformState || !this.activeHandle) return null;

    const s = this.transformState;
    const layer = s.layer;
    const shiftKey = event.shiftKey;
    const altKey = event.altKey;

    if (this.activeHandle === 'rot') {
      // Rotation interaction
      const dx = currentWorldX - s.centerX;
      const dy = currentWorldY - s.centerY;
      let angleRad = Math.atan2(dy, dx);
      let angleDeg = (angleRad * 180) / Math.PI + 90; // Top is 0 deg

      if (angleDeg < 0) angleDeg += 360;
      angleDeg = angleDeg % 360;

      // 15 degree snapping with Shift key
      if (shiftKey) {
        angleDeg = Math.round(angleDeg / 15) * 15;
      }

      layer.rotation = Math.round(angleDeg);
      return { type: 'rotate', angle: layer.rotation };
    }

    // Scale interaction
    const rad = (-s.initialRotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    // Vector from initial center to current mouse in layer-local space
    const curDx = currentWorldX - s.centerX;
    const curDy = currentWorldY - s.centerY;
    const curLocalX = curDx * cos - curDy * sin;
    const curLocalY = curDx * sin + curDy * cos;

    let newW = s.initialWidth;
    let newH = s.initialHeight;
    let newCenterX = s.centerX;
    let newCenterY = s.centerY;

    const lockAspect = s.lockAspect || shiftKey;

    switch (this.activeHandle) {
      case 'e':
        newW = Math.max(10, curLocalX * 2);
        if (lockAspect) newH = newW / s.aspectRatio;
        break;
      case 'w':
        newW = Math.max(10, -curLocalX * 2);
        if (lockAspect) newH = newW / s.aspectRatio;
        break;
      case 's':
        newH = Math.max(10, curLocalY * 2);
        if (lockAspect) newW = newH * s.aspectRatio;
        break;
      case 'n':
        newH = Math.max(10, -curLocalY * 2);
        if (lockAspect) newW = newH * s.aspectRatio;
        break;
      case 'se':
        newW = Math.max(10, curLocalX * 2);
        newH = Math.max(10, curLocalY * 2);
        if (lockAspect) {
          const maxDim = Math.max(newW, newH * s.aspectRatio);
          newW = maxDim;
          newH = maxDim / s.aspectRatio;
        }
        break;
      case 'sw':
        newW = Math.max(10, -curLocalX * 2);
        newH = Math.max(10, curLocalY * 2);
        if (lockAspect) {
          const maxDim = Math.max(newW, newH * s.aspectRatio);
          newW = maxDim;
          newH = maxDim / s.aspectRatio;
        }
        break;
      case 'ne':
        newW = Math.max(10, curLocalX * 2);
        newH = Math.max(10, -curLocalY * 2);
        if (lockAspect) {
          const maxDim = Math.max(newW, newH * s.aspectRatio);
          newW = maxDim;
          newH = maxDim / s.aspectRatio;
        }
        break;
      case 'nw':
        newW = Math.max(10, -curLocalX * 2);
        newH = Math.max(10, -curLocalY * 2);
        if (lockAspect) {
          const maxDim = Math.max(newW, newH * s.aspectRatio);
          newW = maxDim;
          newH = maxDim / s.aspectRatio;
        }
        break;
    }

    layer.width = Math.round(newW);
    layer.height = Math.round(newH);
    layer.x = Math.round(newCenterX - layer.width / 2);
    layer.y = Math.round(newCenterY - layer.height / 2);

    if (layer.type === 'drawing') {
      layer.initCanvas();
    }

    return { type: 'resize', width: layer.width, height: layer.height };
  }

  /**
   * Move layer with magnetic Smart Guide snapping
   */
  moveLayerWithSnapping(layer, deltaX, deltaY, allLayers, canvasWidth, canvasHeight, enableSnap = true) {
    let targetX = layer.x + deltaX;
    let targetY = layer.y + deltaY;

    this.activeGuides = [];

    if (!enableSnap) {
      layer.x = Math.round(targetX);
      layer.y = Math.round(targetY);
      return;
    }

    const layerCenterX = targetX + layer.width / 2;
    const layerCenterY = targetY + layer.height / 2;
    const layerRight = targetX + layer.width;
    const layerBottom = targetY + layer.height;

    const snapThreshold = this.snapThreshold;

    // 1. Canvas Center Snap
    const canvasCenterX = canvasWidth / 2;
    const canvasCenterY = canvasHeight / 2;

    if (Math.abs(layerCenterX - canvasCenterX) <= snapThreshold) {
      targetX = canvasCenterX - layer.width / 2;
      this.activeGuides.push({ type: 'vertical', pos: canvasCenterX, color: '#ec4899' });
    }

    if (Math.abs(layerCenterY - canvasCenterY) <= snapThreshold) {
      targetY = canvasCenterY - layer.height / 2;
      this.activeGuides.push({ type: 'horizontal', pos: canvasCenterY, color: '#ec4899' });
    }

    // 2. Canvas Edge Snap
    if (Math.abs(targetX) <= snapThreshold) {
      targetX = 0;
      this.activeGuides.push({ type: 'vertical', pos: 0, color: '#3b82f6' });
    }
    if (Math.abs(layerRight - canvasWidth) <= snapThreshold) {
      targetX = canvasWidth - layer.width;
      this.activeGuides.push({ type: 'vertical', pos: canvasWidth, color: '#3b82f6' });
    }
    if (Math.abs(targetY) <= snapThreshold) {
      targetY = 0;
      this.activeGuides.push({ type: 'horizontal', pos: 0, color: '#3b82f6' });
    }
    if (Math.abs(layerBottom - canvasHeight) <= snapThreshold) {
      targetY = canvasHeight - layer.height;
      this.activeGuides.push({ type: 'horizontal', pos: canvasHeight, color: '#3b82f6' });
    }

    // 3. Other layers bounds snap
    for (const other of allLayers) {
      if (other.id === layer.id || !other.visible) continue;

      const oCenterX = other.x + other.width / 2;
      const oCenterY = other.y + other.height / 2;
      const oRight = other.x + other.width;
      const oBottom = other.y + other.height;

      // Vertical alignment
      if (Math.abs(layerCenterX - oCenterX) <= snapThreshold) {
        targetX = oCenterX - layer.width / 2;
        this.activeGuides.push({ type: 'vertical', pos: oCenterX, color: '#06b6d4' });
      } else if (Math.abs(targetX - other.x) <= snapThreshold) {
        targetX = other.x;
        this.activeGuides.push({ type: 'vertical', pos: other.x, color: '#06b6d4' });
      } else if (Math.abs(layerRight - oRight) <= snapThreshold) {
        targetX = oRight - layer.width;
        this.activeGuides.push({ type: 'vertical', pos: oRight, color: '#06b6d4' });
      }

      // Horizontal alignment
      if (Math.abs(layerCenterY - oCenterY) <= snapThreshold) {
        targetY = oCenterY - layer.height / 2;
        this.activeGuides.push({ type: 'horizontal', pos: oCenterY, color: '#06b6d4' });
      } else if (Math.abs(targetY - other.y) <= snapThreshold) {
        targetY = other.y;
        this.activeGuides.push({ type: 'horizontal', pos: other.y, color: '#06b6d4' });
      } else if (Math.abs(layerBottom - oBottom) <= snapThreshold) {
        targetY = oBottom - layer.height;
        this.activeGuides.push({ type: 'horizontal', pos: oBottom, color: '#06b6d4' });
      }
    }

    layer.x = Math.round(targetX);
    layer.y = Math.round(targetY);
  }

  endTransform() {
    this.activeHandle = null;
    this.transformState = null;
    this.activeGuides = [];
  }

  /**
   * Render handles, bounding boxes, and smart guides to overlay canvas
   */
  renderOverlay(ctx, selectedLayers, canvasWidth, canvasHeight) {
    if (!selectedLayers || selectedLayers.length === 0) return;

    const zoom = this.canvasEngine.zoom;

    // Render Smart Guides
    for (const guide of this.activeGuides) {
      ctx.save();
      ctx.strokeStyle = guide.color || '#ec4899';
      ctx.lineWidth = 1 / zoom;
      ctx.setLineDash([4 / zoom, 4 / zoom]);

      ctx.beginPath();
      if (guide.type === 'vertical') {
        ctx.moveTo(guide.pos, -5000);
        ctx.lineTo(guide.pos, 5000);
      } else {
        ctx.moveTo(-5000, guide.pos);
        ctx.lineTo(5000, guide.pos);
      }
      ctx.stroke();
      ctx.restore();
    }

    // Render Bounding Box and Handles for each selected layer
    for (const layer of selectedLayers) {
      const handles = this.getHandles(layer);
      const corners = layer.getCorners();
      const hw = layer.width / 2;
      const hh = layer.height / 2;
      const cx = layer.x + hw;
      const cy = layer.y + hh;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((layer.rotation * Math.PI) / 180);

      // Bounding Box outline
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1.5 / zoom;
      ctx.setLineDash([]);
      ctx.strokeRect(-hw, -hh, layer.width, layer.height);

      // Stem line for rotation handle
      const rotDist = this.rotationHandleDistance / zoom;
      ctx.beginPath();
      ctx.moveTo(0, -hh);
      ctx.lineTo(0, -hh - rotDist);
      ctx.strokeStyle = '#3b82f6';
      ctx.stroke();

      ctx.restore();

      // Draw 8 Scale Handles & 1 Rotation Handle in world coordinates
      const handleSize = this.handleSize / zoom;

      for (const [name, pos] of Object.entries(handles)) {
        ctx.save();
        ctx.translate(pos.x, pos.y);

        if (name === 'rot') {
          // Circle rotation handle
          ctx.beginPath();
          ctx.arc(0, 0, handleSize * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 1.5 / zoom;
          ctx.stroke();
        } else {
          // Square scaling handles
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-handleSize / 2, -handleSize / 2, handleSize, handleSize);
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 1.5 / zoom;
          ctx.strokeRect(-handleSize / 2, -handleSize / 2, handleSize, handleSize);
        }

        ctx.restore();
      }
    }
  }
}
