/**
 * MapCraft - High-DPI Canvas 2D Cartography Renderer
 * Renders multi-layer maps: vector-glyph markers, styled routes, patterned regions,
 * halo typography, hex/square grids, adaptive scale bars, and real-time measurement tools.
 */

import { getTheme } from './themes.js';
import { drawMarkerGlyph } from '../core/icons.js';
import { formatScaledDistance, formatScaledArea, calculateBearing, calculateDistance } from '../core/math.js';

export class MapRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = { x: 0, y: 0, zoom: 1 };
    this.dpr = window.devicePixelRatio || 1;
  }

  resize(cssWidth, cssHeight) {
    this.dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.round(cssWidth * this.dpr);
    this.canvas.height = Math.round(cssHeight * this.dpr);
    this.canvas.style.width = cssWidth + 'px';
    this.canvas.style.height = cssHeight + 'px';
  }

  render({
    project,
    activeLayerId,
    selectedObjectId,
    selectedVertexIndex = null,
    hoveredObjectId,
    activeDrawing,
    scaleRatio = 10,
    scaleUnit = 'km',
    themeId = 'parchment',
    gridType = 'square',
    gridSize = 50,
    showGrid = true,
    showCompass = true,
    showScaleRuler = true
  }) {
    const ctx = this.ctx;
    const theme = getTheme(themeId || project.themeId);
    const dpr = this.dpr;
    const w = this.canvas.width / dpr;
    const h = this.canvas.height / dpr;

    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. Clear & Paint Theme Background
    ctx.fillStyle = theme.bgColor;
    ctx.fillRect(0, 0, w, h);

    // 2. Cartographic Grid Overlay
    if (showGrid && gridType !== 'none') {
      this.drawGrid(theme, gridType || project.gridType || 'square', gridSize || project.gridSize || 50, w, h);
    }

    ctx.save();
    // 3. Apply Camera Transform (Pan & Zoom)
    ctx.translate(this.camera.x, this.camera.y);
    ctx.scale(this.camera.zoom, this.camera.zoom);

    // 4. Render Layers in Order
    const layers = project.layers || [];
    for (const layer of layers) {
      if (layer.visible === false) continue;

      const layerObjects = (project.objects || []).filter(o => o.layerId === layer.id);

      for (const obj of layerObjects) {
        if (obj.visible === false) continue;
        const isSelected = obj.id === selectedObjectId;
        const isHovered = obj.id === hoveredObjectId;
        this.renderMapObject(obj, theme, isSelected, isHovered, scaleRatio, scaleUnit, selectedVertexIndex);
      }
    }

    // 5. Render Active Drawing Preview
    if (activeDrawing) {
      this.renderActiveDrawing(activeDrawing, theme, scaleRatio, scaleUnit);
    }

    ctx.restore();

    // 6. Viewport Overlays (Compass Rose & Dynamic Scale Bar)
    if (showCompass) {
      this.drawCompassRose(theme, w, h);
    }
    if (showScaleRuler) {
      this.drawScaleRuler(scaleRatio, scaleUnit, theme, w, h);
    }

    ctx.restore();
  }

  // --- Grid Drawing ---
  drawGrid(theme, gridType, baseGridSize, w, h) {
    const ctx = this.ctx;
    const size = baseGridSize * this.camera.zoom;
    if (size < 12) return; // Prevent dense grid lag at extreme zoom-out

    ctx.save();
    ctx.strokeStyle = theme.gridColor;
    ctx.fillStyle = theme.gridColor;
    ctx.lineWidth = 1;

    if (gridType === 'dot') {
      const startX = (this.camera.x % size);
      const startY = (this.camera.y % size);
      for (let x = startX; x < w; x += size) {
        for (let y = startY; y < h; y += size) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (gridType === 'hex') {
      this.drawHexGrid(theme, size, w, h);
    } else {
      // Standard Square Grid
      const startX = (this.camera.x % size);
      const startY = (this.camera.y % size);

      ctx.beginPath();
      for (let x = startX; x < w; x += size) {
        ctx.moveTo(x, 0); ctx.lineTo(x, h);
      }
      for (let y = startY; y < h; y += size) {
        ctx.moveTo(0, y); ctx.lineTo(w, y);
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  drawHexGrid(theme, hexRadius, w, h) {
    const ctx = this.ctx;
    const r = hexRadius;
    const hexH = Math.sqrt(3) * r;
    const hexW = 1.5 * r;

    const startCol = Math.floor(-this.camera.x / hexW) - 1;
    const endCol = Math.ceil((w - this.camera.x) / hexW) + 1;
    const startRow = Math.floor(-this.camera.y / hexH) - 1;
    const endRow = Math.ceil((h - this.camera.y) / hexH) + 1;

    ctx.beginPath();
    for (let c = startCol; c <= endCol; c++) {
      const cx = c * hexW + this.camera.x;
      const yOffset = (c % 2 !== 0 ? hexH / 2 : 0);
      for (let row = startRow; row <= endRow; row++) {
        const cy = row * hexH + yOffset + this.camera.y;

        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 180) * (60 * i);
          const px = cx + r * Math.cos(angle);
          const py = cy + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
      }
    }
    ctx.stroke();
  }

  // --- Dispatcher ---
  renderMapObject(obj, theme, isSelected, isHovered, scaleRatio, scaleUnit, selectedVertexIndex) {
    switch (obj.type) {
      case 'region':
        this.drawRegion(obj, theme, isSelected, isHovered);
        break;
      case 'circle':
        this.drawCircle(obj, theme, isSelected, isHovered);
        break;
      case 'route':
        this.drawRoute(obj, theme, isSelected, isHovered);
        break;
      case 'marker':
        this.drawMarker(obj, theme, isSelected, isHovered);
        break;
      case 'label':
        this.drawLabel(obj, theme, isSelected, isHovered);
        break;
    }

    if (isSelected) {
      this.drawSelectionHandles(obj, theme, selectedVertexIndex);
    }
  }

  // --- 1. Region (Polygon) ---
  drawRegion(obj, theme, isSelected, isHovered) {
    const pts = obj.points || [];
    if (pts.length < 3) return;

    const ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.closePath();

    // Fill
    ctx.globalAlpha = obj.opacity !== undefined ? obj.opacity : 0.35;
    ctx.fillStyle = obj.fillColor || theme.defaultRegionColor;
    ctx.fill();

    // Optional Hatching Pattern
    if (obj.pattern === 'hatch') {
      this.drawHatchPattern(pts, obj.strokeColor || obj.fillColor || theme.accentColor);
    }

    // Stroke
    ctx.globalAlpha = isHovered ? 1.0 : (obj.opacity !== undefined ? Math.min(1.0, obj.opacity + 0.3) : 0.8);
    ctx.strokeStyle = obj.strokeColor || obj.fillColor || theme.accentColor;
    ctx.lineWidth = (obj.strokeWidth || 2);
    if (obj.strokeDash === 'dashed') ctx.setLineDash([8, 6]);
    if (obj.strokeDash === 'dotted') ctx.setLineDash([3, 5]);
    ctx.stroke();

    // Region Name Label in Center
    if (obj.name) {
      const center = this.getPolygonCenter(pts);
      this.drawHaloText(obj.name, center.x, center.y, {
        fontSize: obj.fontSize || 13,
        fontFamily: obj.fontFamily || theme.fontFamily,
        color: obj.labelColor || theme.textColor,
        haloColor: theme.textHaloColor,
        isBold: true
      });
    }

    ctx.restore();
  }

  drawHatchPattern(pts, color) {
    const ctx = this.ctx;
    ctx.save();
    ctx.clip();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.25;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    pts.forEach(p => {
      minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
    });

    const step = 14;
    for (let x = minX - (maxY - minY); x < maxX; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, minY);
      ctx.lineTo(x + (maxY - minY), maxY);
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- 2. Circle Zone ---
  drawCircle(obj, theme, isSelected, isHovered) {
    const ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.radius || 50, 0, Math.PI * 2);

    ctx.globalAlpha = obj.opacity !== undefined ? obj.opacity : 0.32;
    ctx.fillStyle = obj.fillColor || theme.defaultRegionColor;
    ctx.fill();

    ctx.globalAlpha = isHovered ? 1.0 : 0.85;
    ctx.strokeStyle = obj.strokeColor || obj.fillColor || theme.accentColor;
    ctx.lineWidth = obj.strokeWidth || 2;
    if (obj.strokeDash === 'dashed') ctx.setLineDash([6, 6]);
    ctx.stroke();

    if (obj.name) {
      this.drawHaloText(obj.name, obj.x, obj.y, {
        fontSize: 13,
        fontFamily: theme.fontFamily,
        color: theme.textColor,
        haloColor: theme.textHaloColor,
        isBold: true
      });
    }

    ctx.restore();
  }

  // --- 3. Route (Polyline) ---
  drawRoute(obj, theme, isSelected, isHovered) {
    const pts = obj.points || [];
    if (pts.length < 2) return;

    const ctx = this.ctx;
    ctx.save();

    const color = obj.color || theme.defaultRouteColor;
    const width = (obj.width || 3.5) * (isHovered ? 1.3 : 1);

    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (obj.style === 'dashed') ctx.setLineDash([10, 7]);
    if (obj.style === 'dotted') ctx.setLineDash([3, 6]);

    if (obj.style === 'railroad') {
      // Draw track rails
      ctx.stroke();
      this.drawRailroadTies(pts, color, width);
    } else {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.stroke();
    }

    // Directional Arrow at route terminus if requested
    if (obj.hasArrow !== false && pts.length >= 2) {
      const pLast = pts[pts.length - 1];
      const pPrev = pts[pts.length - 2];
      const angle = Math.atan2(pLast.y - pPrev.y, pLast.x - pPrev.x);
      this.drawArrowhead(ctx, pLast.x, pLast.y, angle, width * 2.5, color);
    }

    // Waypoint nodes
    for (let i = 0; i < pts.length; i++) {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pts[i].x, pts[i].y, i === 0 || i === pts.length - 1 ? 5 : 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Route Label at midpoint
    if (obj.name) {
      const midIdx = Math.floor(pts.length / 2);
      const mid = pts[midIdx];
      this.drawHaloText(obj.name, mid.x, mid.y - 12, {
        fontSize: 11.5,
        fontFamily: theme.fontFamily,
        color: theme.textColor,
        haloColor: theme.textHaloColor,
        isBold: true
      });
    }

    ctx.restore();
  }

  drawRailroadTies(pts, color, width) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    const tieSpacing = 16;
    const tieLen = width * 2.2;

    for (let i = 0; i < pts.length - 1; i++) {
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const segLen = calculateDistance(p1, p2);
      const steps = Math.floor(segLen / tieSpacing);
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      const perpAngle = angle + Math.PI / 2;

      for (let s = 1; s <= steps; s++) {
        const t = (s * tieSpacing) / segLen;
        const tx = p1.x + t * (p2.x - p1.x);
        const ty = p1.y + t * (p2.y - p1.y);
        ctx.beginPath();
        ctx.moveTo(tx - Math.cos(perpAngle) * tieLen / 2, ty - Math.sin(perpAngle) * tieLen / 2);
        ctx.lineTo(tx + Math.cos(perpAngle) * tieLen / 2, ty + Math.sin(perpAngle) * tieLen / 2);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  drawArrowhead(ctx, x, y, angle, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-size, -size / 2);
    ctx.lineTo(-size * 0.7, 0);
    ctx.lineTo(-size, size / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // --- 4. Marker Pin & Glyph ---
  drawMarker(obj, theme, isSelected, isHovered) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(obj.x, obj.y);

    const size = (obj.size || 28) * (isHovered ? 1.15 : 1);
    const color = obj.color || theme.accentColor;

    // Pin Drop Shadow
    ctx.shadowColor = 'rgba(0,0,0,0.38)';
    ctx.shadowBlur = 7;
    ctx.shadowOffsetY = 3;

    // Tear-Drop Cartographic Pin Body
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, -size / 2, size / 2, Math.PI, 0, false);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    // Inner White Disk for Glyph
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -size / 2, size / 3, 0, Math.PI * 2);
    ctx.fill();

    // Vector Icon Glyph inside disk
    const glyphScale = (size / 30);
    drawMarkerGlyph(ctx, obj.icon || 'pin', 0, -size / 2, glyphScale, color);

    // Marker Label below
    if (obj.name && obj.hideLabel !== true) {
      this.drawHaloText(obj.name, 0, 15, {
        fontSize: 12,
        fontFamily: theme.fontFamily,
        color: theme.textColor,
        haloColor: theme.textHaloColor,
        isBold: true
      });
    }

    ctx.restore();
  }

  // --- 5. Rich Halo Label ---
  drawLabel(obj, theme, isSelected, isHovered) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(obj.x, obj.y);
    if (obj.rotation) ctx.rotate((obj.rotation * Math.PI) / 180);

    this.drawHaloText(obj.text || 'Label', 0, 0, {
      fontSize: obj.fontSize || 16,
      fontFamily: obj.fontFamily || theme.fontFamily,
      color: obj.color || theme.textColor,
      haloColor: theme.textHaloColor,
      isBold: obj.isBold !== false
    });

    ctx.restore();
  }

  // --- Halo Text Rendering ---
  drawHaloText(text, x, y, { fontSize = 13, fontFamily = "'Inter', sans-serif", color = '#000000', haloColor = '#ffffff', isBold = false }) {
    const ctx = this.ctx;
    ctx.font = `${isBold ? 'bold ' : ''}${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Halo stroke for contrast
    ctx.strokeStyle = haloColor;
    ctx.lineWidth = Math.max(3.5, fontSize / 3.2);
    ctx.lineJoin = 'round';
    ctx.miterLimit = 2;
    ctx.strokeText(text, x, y);

    // Foreground text
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }

  // --- Active Drawing Preview ---
  renderActiveDrawing(drawing, theme, scaleRatio, scaleUnit) {
    const ctx = this.ctx;
    const pts = drawing.points || [];

    if (drawing.type === 'measure') {
      if (pts.length < 2) return;
      ctx.save();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 5]);

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Individual segment distance label
        if (i > 0) {
          const prev = pts[i - 1];
          const segDist = calculateDistance(prev, p);
          const segDistStr = formatScaledDistance(segDist, scaleRatio, scaleUnit);
          const midX = (prev.x + p.x) / 2;
          const midY = (prev.y + p.y) / 2;
          const bearing = calculateBearing(prev, p);
          this.drawHaloText(`${segDistStr} (${bearing}°)`, midX, midY - 10, { fontSize: 11, color: '#ef4444', haloColor: '#ffffff', isBold: true });
        }
      }

      // Live Total Badge at mouse point
      const last = pts[pts.length - 1];
      const dist = formatScaledDistance(drawing.totalDist || 0, scaleRatio, scaleUnit);
      let badgeText = `Total: ${dist}`;
      if (drawing.totalArea && pts.length >= 3) {
        badgeText += ` | Area: ${formatScaledArea(drawing.totalArea, scaleRatio, scaleUnit)}`;
      }
      this.drawHaloText(badgeText, last.x, last.y - 24, { fontSize: 12.5, color: '#b91c1c', haloColor: '#ffffff', isBold: true });
      ctx.restore();
    }

    else if (drawing.type === 'route' && pts.length > 0) {
      ctx.save();
      ctx.strokeStyle = theme.defaultRouteColor;
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
      ctx.restore();
    }

    else if (drawing.type === 'region' && pts.length > 0) {
      ctx.save();
      ctx.strokeStyle = theme.accentColor;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }

  // --- Selection Handles & Vertex Reshaping ---
  drawSelectionHandles(obj, theme, selectedVertexIndex = null) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = theme.selectionColor || '#38bdf8';
    ctx.lineWidth = 2 / this.camera.zoom;
    ctx.fillStyle = '#ffffff';

    if (obj.points) {
      for (let i = 0; i < obj.points.length; i++) {
        const p = obj.points[i];
        const isVertexSelected = i === selectedVertexIndex;
        ctx.fillStyle = isVertexSelected ? theme.accentColor : '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, (isVertexSelected ? 6.5 : 4.5) / this.camera.zoom, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    } else if (obj.type === 'circle') {
      // Radius handle at 3 o'clock position
      const rx = obj.x + (obj.radius || 50);
      const ry = obj.y;
      ctx.fillStyle = theme.accentColor;
      ctx.beginPath();
      ctx.arc(rx, ry, 5 / this.camera.zoom, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (obj.x !== undefined && obj.y !== undefined) {
      const size = obj.size || 28;
      ctx.strokeRect(obj.x - size / 2 - 4, obj.y - size - 4, size + 8, size + 16);
    }

    ctx.restore();
  }

  // --- Compass Rose ---
  drawCompassRose(theme, w, h) {
    const ctx = this.ctx;
    const cx = w - 46;
    const cy = 46;
    const r = 26;

    ctx.save();
    ctx.translate(cx, cy);

    // North Star Point
    ctx.fillStyle = theme.accentColor;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r / 3.5, 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(-r / 3.5, 0);
    ctx.closePath();
    ctx.fill();

    // South Star Point
    ctx.fillStyle = theme.textColor;
    ctx.beginPath();
    ctx.moveTo(0, r);
    ctx.lineTo(r / 3.5, 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(-r / 3.5, 0);
    ctx.closePath();
    ctx.fill();

    // East / West Minor Points
    ctx.fillStyle = theme.gridColor;
    ctx.beginPath();
    ctx.moveTo(r * 0.7, 0);
    ctx.lineTo(0, r / 4);
    ctx.lineTo(0, -r / 4);
    ctx.closePath();
    ctx.moveTo(-r * 0.7, 0);
    ctx.lineTo(0, r / 4);
    ctx.lineTo(0, -r / 4);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = theme.textColor;
    ctx.font = "bold 11px 'Inter', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('N', 0, -r - 2);

    ctx.restore();
  }

  // --- Dynamic Scale Bar ---
  drawScaleRuler(scaleRatio, unit, theme, w, h) {
    const ctx = this.ctx;
    const targetPx = 120 * this.camera.zoom;
    const realUnits = (targetPx / 100) * scaleRatio;

    // Round to convenient cartographic increments (1, 2, 5, 10, 25, 50, 100, 250, 500, etc.)
    const niceUnits = this.getNiceNumber(realUnits);
    const actualPx = (niceUnits / scaleRatio) * 100 * this.camera.zoom;

    const x = 24;
    const y = h - 22;

    ctx.save();
    ctx.strokeStyle = theme.textColor;
    ctx.lineWidth = 2;

    // Ruler line with ticks
    ctx.beginPath();
    ctx.moveTo(x, y - 6); ctx.lineTo(x, y);
    ctx.lineTo(x + actualPx, y);
    ctx.lineTo(x + actualPx, y - 6);
    // Midpoint tick
    ctx.moveTo(x + actualPx / 2, y);
    ctx.lineTo(x + actualPx / 2, y - 4);
    ctx.stroke();

    ctx.fillStyle = theme.textColor;
    ctx.font = "bold 11px 'JetBrains Mono', monospace";
    ctx.textAlign = 'center';
    ctx.fillText('0', x, y - 8);
    ctx.fillText(`${niceUnits} ${unit}`, x + actualPx, y - 8);

    ctx.restore();
  }

  getNiceNumber(val) {
    const exp = Math.floor(Math.log10(val));
    const frac = val / Math.pow(10, exp);
    let niceFrac;
    if (frac < 1.5) niceFrac = 1;
    else if (frac < 3.5) niceFrac = 2;
    else if (frac < 7.5) niceFrac = 5;
    else niceFrac = 10;
    return niceFrac * Math.pow(10, exp);
  }

  getPolygonCenter(pts) {
    let x = 0, y = 0;
    pts.forEach(p => { x += p.x; y += p.y; });
    return { x: x / pts.length, y: y / pts.length };
  }
}
