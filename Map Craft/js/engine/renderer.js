/**
 * MapCraft - Canvas 2D Cartography Renderer
 * Renders multi-layer maps: regions, routes, markers with icons, haloed labels, measurement tools, and scale bars.
 */

import { getTheme } from './themes.js';
import { formatScaledDistance, formatScaledArea } from '../core/math.js';

export class MapRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = { x: 0, y: 0, zoom: 1 };
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  render({
    project,
    activeLayerId,
    selectedObjectId,
    hoveredObjectId,
    activeDrawing,
    scaleRatio = 10,
    scaleUnit = 'km',
    themeId = 'parchment',
    showGrid = true,
    showCompass = true,
    showScaleRuler = true
  }) {
    const ctx = this.ctx;
    const theme = getTheme(themeId || project.themeId);

    // 1. Clear & Paint Theme Background
    ctx.fillStyle = theme.bgColor;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 2. Cartographic Grid Overlay
    if (showGrid) {
      this.drawCartographicGrid(theme);
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
        this.renderMapObject(obj, theme, isSelected, isHovered, scaleRatio, scaleUnit);
      }
    }

    // 5. Render Active Drawing Preview
    if (activeDrawing) {
      this.renderActiveDrawing(activeDrawing, theme, scaleRatio, scaleUnit);
    }

    ctx.restore();

    // 6. Viewport Overlays (Compass Rose & Scale Ruler)
    if (showCompass) {
      this.drawCompassRose(theme);
    }
    if (showScaleRuler) {
      this.drawScaleRuler(scaleRatio, scaleUnit, theme);
    }
  }

  // --- Grid & Coordinates ---
  drawCartographicGrid(theme) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const gridSize = 100 * this.camera.zoom;

    const startX = (this.camera.x % gridSize);
    const startY = (this.camera.y % gridSize);

    ctx.save();
    ctx.strokeStyle = theme.gridColor;
    ctx.lineWidth = 1;

    ctx.beginPath();
    for (let x = startX; x < w; x += gridSize) {
      ctx.moveTo(x, 0); ctx.lineTo(x, h);
    }
    for (let y = startY; y < h; y += gridSize) {
      ctx.moveTo(0, y); ctx.lineTo(w, y);
    }
    ctx.stroke();

    ctx.restore();
  }

  // --- Map Object Dispatcher ---
  renderMapObject(obj, theme, isSelected, isHovered, scaleRatio, scaleUnit) {
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

    // Selection highlight handles
    if (isSelected) {
      this.drawSelectionHandles(obj);
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

    // Fill with opacity
    ctx.globalAlpha = obj.opacity !== undefined ? obj.opacity : 0.35;
    ctx.fillStyle = obj.fillColor || theme.defaultRegionColor;
    ctx.fill();

    // Stroke outline
    ctx.globalAlpha = isHovered ? 1.0 : (obj.opacity !== undefined ? Math.min(1.0, obj.opacity + 0.3) : 0.8);
    ctx.strokeStyle = obj.strokeColor || obj.fillColor || theme.accentColor;
    ctx.lineWidth = (obj.strokeWidth || 2) / (isSelected ? 1 : 1);
    if (obj.strokeDash === 'dashed') ctx.setLineDash([6, 6]);
    ctx.stroke();

    // Draw region label in center if provided
    if (obj.name) {
      const center = this.getPolygonCenter(pts);
      this.drawHaloText(obj.name, center.x, center.y, {
        fontSize: obj.fontSize || 14,
        fontFamily: "'Inter', sans-serif",
        color: obj.labelColor || theme.textColor,
        haloColor: theme.textHaloColor,
        isBold: true
      });
    }

    ctx.restore();
  }

  // --- 2. Circle Zone ---
  drawCircle(obj, theme, isSelected, isHovered) {
    const ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.radius || 50, 0, Math.PI * 2);

    ctx.globalAlpha = obj.opacity !== undefined ? obj.opacity : 0.3;
    ctx.fillStyle = obj.fillColor || theme.defaultRegionColor;
    ctx.fill();

    ctx.globalAlpha = isHovered ? 1.0 : 0.8;
    ctx.strokeStyle = obj.strokeColor || obj.fillColor || theme.accentColor;
    ctx.lineWidth = obj.strokeWidth || 2;
    if (obj.strokeDash === 'dashed') ctx.setLineDash([4, 4]);
    ctx.stroke();

    if (obj.name) {
      this.drawHaloText(obj.name, obj.x, obj.y, {
        fontSize: 13,
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
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }

    ctx.strokeStyle = obj.color || theme.defaultRouteColor;
    ctx.lineWidth = (obj.width || 3) * (isHovered ? 1.4 : 1);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (obj.style === 'dashed') ctx.setLineDash([8, 6]);
    if (obj.style === 'dotted') ctx.setLineDash([2, 5]);

    ctx.stroke();

    // Draw vertex waypoint nodes
    for (let i = 0; i < pts.length; i++) {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = obj.color || theme.defaultRouteColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pts[i].x, pts[i].y, i === 0 || i === pts.length - 1 ? 4.5 : 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Label along midpoint
    if (obj.name) {
      const mid = pts[Math.floor(pts.length / 2)];
      this.drawHaloText(obj.name, mid.x, mid.y - 10, {
        fontSize: 11.5,
        color: theme.textColor,
        haloColor: theme.textHaloColor,
        isBold: true
      });
    }

    ctx.restore();
  }

  // --- 4. Marker Pin & Icon ---
  drawMarker(obj, theme, isSelected, isHovered) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(obj.x, obj.y);

    const size = (obj.size || 28) * (isHovered ? 1.15 : 1);
    const color = obj.color || theme.accentColor;

    // Pin Body
    ctx.fillStyle = color;
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;

    ctx.beginPath();
    ctx.arc(0, -size / 2, size / 2, Math.PI, 0, false);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    // Inner White Icon Dot or Emblem
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -size / 2, size / 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Marker Label below pin
    if (obj.name) {
      this.drawHaloText(obj.name, 0, 14, {
        fontSize: 12,
        fontFamily: "'Inter', sans-serif",
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
      fontFamily: obj.fontFamily || "'Inter', sans-serif",
      color: obj.color || theme.textColor,
      haloColor: theme.textHaloColor,
      isBold: obj.isBold !== false
    });

    ctx.restore();
  }

  // --- Helper: Halo Text (Stroke outline behind text for contrast) ---
  drawHaloText(text, x, y, { fontSize = 13, fontFamily = "'Inter', sans-serif", color = '#000000', haloColor = '#ffffff', isBold = false }) {
    const ctx = this.ctx;
    ctx.font = `${isBold ? 'bold ' : ''}${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Halo stroke
    ctx.strokeStyle = haloColor;
    ctx.lineWidth = Math.max(3, fontSize / 3.5);
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
      ctx.strokeStyle = '#f85149';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5, 5]);

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();

      for (const p of pts) {
        ctx.fillStyle = '#f85149';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Live measurement badge at end
      const last = pts[pts.length - 1];
      const dist = formatScaledDistance(drawing.totalDist || 0, scaleRatio, scaleUnit);
      let badgeText = `Dist: ${dist}`;
      if (drawing.totalArea) {
        badgeText += ` | Area: ${formatScaledArea(drawing.totalArea, scaleRatio, scaleUnit)}`;
      }
      this.drawHaloText(badgeText, last.x, last.y - 16, { fontSize: 12, color: '#f85149', haloColor: '#ffffff', isBold: true });
      ctx.restore();
    }

    else if (drawing.type === 'route' && pts.length > 0) {
      ctx.save();
      ctx.strokeStyle = theme.defaultRouteColor;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
      ctx.restore();
    }

    else if (drawing.type === 'region' && pts.length > 0) {
      ctx.save();
      ctx.strokeStyle = theme.accentColor;
      ctx.fillStyle = 'rgba(88, 166, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }

  // --- Selection Handles ---
  drawSelectionHandles(obj) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 2 / this.camera.zoom;
    ctx.fillStyle = '#ffffff';

    if (obj.points) {
      for (const p of obj.points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4.5 / this.camera.zoom, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    } else if (obj.x !== undefined && obj.y !== undefined) {
      ctx.strokeRect(obj.x - 16, obj.y - 32, 32, 40);
    }
    ctx.restore();
  }

  // --- Overlays (Compass & Scale Ruler) ---
  drawCompassRose(theme) {
    const ctx = this.ctx;
    const cx = this.canvas.width - 45;
    const cy = 45;
    const r = 24;

    ctx.save();
    ctx.translate(cx, cy);

    // North Star
    ctx.fillStyle = theme.accentColor;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r / 3.5, 0);
    ctx.lineTo(0, r);
    ctx.lineTo(-r / 3.5, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = theme.textColor;
    ctx.font = "bold 11px 'Inter', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('N', 0, -r - 2);

    ctx.restore();
  }

  drawScaleRuler(scaleRatio, unit, theme) {
    const ctx = this.ctx;
    const barPx = 100 * this.camera.zoom; // 100px width on screen
    const x = 20;
    const y = this.canvas.height - 24;

    ctx.save();
    ctx.strokeStyle = theme.textColor;
    ctx.lineWidth = 2;

    // Ruler Line & Ticks
    ctx.beginPath();
    ctx.moveTo(x, y - 6); ctx.lineTo(x, y);
    ctx.lineTo(x + barPx, y);
    ctx.lineTo(x + barPx, y - 6);
    ctx.stroke();

    ctx.fillStyle = theme.textColor;
    ctx.font = "bold 11px 'JetBrains Mono', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(`0`, x, y - 8);
    ctx.fillText(`${scaleRatio} ${unit}`, x + barPx, y - 8);

    ctx.restore();
  }

  getPolygonCenter(pts) {
    let x = 0, y = 0;
    pts.forEach(p => { x += p.x; y += p.y; });
    return { x: x / pts.length, y: y / pts.length };
  }
}
