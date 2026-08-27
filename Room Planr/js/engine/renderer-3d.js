/**
 * RoomPlanr - 3D Isometric Perspective Preview Renderer
 * Pure Canvas 2D pseudo-3D isometric projection rendering elevated walls, floor textures, ambient shading, and 3D furniture blocks.
 */

import { FLOOR_MATERIALS } from './catalog.js';

export class Renderer3D {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = { x: 0, y: 0, zoom: 45 };
    this.isoAngle = Math.PI / 6; // 30 degrees
    this.dpr = window.devicePixelRatio || 1;
    this.logicalWidth = 800;
    this.logicalHeight = 600;
  }

  resize(width, height) {
    this.dpr = window.devicePixelRatio || 1;
    this.logicalWidth = width;
    this.logicalHeight = height;
    this.canvas.width = Math.round(width * this.dpr);
    this.canvas.height = Math.round(height * this.dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }

  toIso(x, y, z = 0, scale = 1) {
    const cos = Math.cos(this.isoAngle);
    const sin = Math.sin(this.isoAngle);
    const screenX = (x - y) * cos * scale;
    const screenY = (x + y) * sin * scale - z * scale;
    return { x: screenX, y: screenY };
  }

  render({
    room,
    items = [],
    selectedItemId = null
  }) {
    const ctx = this.ctx;
    const w = this.logicalWidth;
    const h = this.logicalHeight;

    ctx.save();
    ctx.scale(this.dpr, this.dpr);

    // 1. Clear Viewport
    ctx.fillStyle = '#080c14';
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    // Center isometric room origin
    ctx.translate(w / 2 + this.camera.x, h / 2 - 30 + this.camera.y);
    const scale = this.camera.zoom;

    // 2. Draw Isometric Floor Plane
    this.drawIsometricFloor(ctx, room, scale);

    // 3. Draw Isometric Back & Left Walls (Extruded Upwards)
    this.drawIsometricWalls(ctx, room, scale);

    // 4. Draw Furniture Items Sorted by Isometric Depth (Painter's Algorithm)
    const sortedItems = [...items].sort((a, b) => {
      // Rugs always at bottom
      if (a.type === 'rug_large') return -1;
      if (b.type === 'rug_large') return 1;
      return (a.x + a.y) - (b.x + b.y);
    });

    for (const item of sortedItems) {
      const isSelected = item.id === selectedItemId;
      this.drawIsometricFurnitureBlock(ctx, item, scale, isSelected);
    }

    ctx.restore();
    ctx.restore();
  }

  drawIsometricFloor(ctx, room, scale) {
    const rw = room.width;
    const rd = room.depth;
    const mat = FLOOR_MATERIALS[room.floorMaterial] || FLOOR_MATERIALS.oak;

    const p0 = this.toIso(0, 0, 0, scale);
    const p1 = this.toIso(rw, 0, 0, scale);
    const p2 = this.toIso(rw, rd, 0, scale);
    const p3 = this.toIso(0, rd, 0, scale);

    ctx.save();
    ctx.fillStyle = mat.color;
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = mat.stroke;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Isometric Floor Planks / Tiles Grid
    const step = mat.tile ? 0.6 : 0.4;
    for (let x = 0; x <= rw; x += step) {
      const start = this.toIso(x, 0, 0, scale);
      const end = this.toIso(x, rd, 0, scale);
      ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(end.x, end.y); ctx.stroke();
    }
    for (let y = 0; y <= rd; y += step) {
      const start = this.toIso(0, y, 0, scale);
      const end = this.toIso(rw, y, 0, scale);
      ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(end.x, end.y); ctx.stroke();
    }

    // Floor Base Edge Shadow
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p3.x, p3.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();

    ctx.restore();
  }

  drawIsometricWalls(ctx, room, scale) {
    const rw = room.width;
    const rd = room.depth;
    const wh = room.height || 2.85; // Standard architectural ceiling
    const wallColor = room.wallColor || '#1e293b';

    ctx.save();

    // 1. Back-Left Wall (Along Y-axis from 0,0 to 0,rd)
    const wl0_b = this.toIso(0, 0, 0, scale);
    const wl1_b = this.toIso(0, rd, 0, scale);
    const wl1_t = this.toIso(0, rd, wh, scale);
    const wl0_t = this.toIso(0, 0, wh, scale);

    ctx.fillStyle = adjustBrightness(wallColor, -25); // Left wall shaded darker
    ctx.beginPath();
    ctx.moveTo(wl0_b.x, wl0_b.y);
    ctx.lineTo(wl1_b.x, wl1_b.y);
    ctx.lineTo(wl1_t.x, wl1_t.y);
    ctx.lineTo(wl0_t.x, wl0_t.y);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 2. Back-Top Wall (Along X-axis from 0,0 to rw,0)
    const wt0_b = this.toIso(0, 0, 0, scale);
    const wt1_b = this.toIso(rw, 0, 0, scale);
    const wt1_t = this.toIso(rw, 0, wh, scale);
    const wt0_t = this.toIso(0, 0, wh, scale);

    ctx.fillStyle = adjustBrightness(wallColor, 12); // Back-Top wall lit lighter
    ctx.beginPath();
    ctx.moveTo(wt0_b.x, wt0_b.y);
    ctx.lineTo(wt1_b.x, wt1_b.y);
    ctx.lineTo(wt1_t.x, wt1_t.y);
    ctx.lineTo(wt0_t.x, wt0_t.y);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Wall Join Corner Line (Ambient Occlusion effect)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(wl0_b.x, wl0_b.y);
    ctx.lineTo(wl0_t.x, wl0_t.y);
    ctx.stroke();

    ctx.restore();
  }

  drawIsometricFurnitureBlock(ctx, item, scale, isSelected) {
    const hw = (item.width || 1) / 2;
    const hd = (item.depth || 1) / 2;
    const h = item.height || 0.8;
    const baseColor = item.color || '#475569';

    // Calculate rotated 4 base corner vertices
    const rad = ((item.rotation || 0) * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const corners = [
      { x: -hw, y: -hd },
      { x: hw, y: -hd },
      { x: hw, y: hd },
      { x: -hw, y: hd }
    ];

    const worldPts = corners.map(pt => ({
      x: item.x + (pt.x * cos - pt.y * sin),
      y: item.y + (pt.x * sin + pt.y * cos)
    }));

    // Iso bottom vertices (z=0)
    const b0 = this.toIso(worldPts[0].x, worldPts[0].y, 0, scale);
    const b1 = this.toIso(worldPts[1].x, worldPts[1].y, 0, scale);
    const b2 = this.toIso(worldPts[2].x, worldPts[2].y, 0, scale);
    const b3 = this.toIso(worldPts[3].x, worldPts[3].y, 0, scale);

    // Iso top vertices (z=h)
    const t0 = this.toIso(worldPts[0].x, worldPts[0].y, h, scale);
    const t1 = this.toIso(worldPts[1].x, worldPts[1].y, h, scale);
    const t2 = this.toIso(worldPts[2].x, worldPts[2].y, h, scale);
    const t3 = this.toIso(worldPts[3].x, worldPts[3].y, h, scale);

    const b = [b0, b1, b2, b3];
    const t = [t0, t1, t2, t3];

    ctx.save();

    // Rug flat drawing
    if (item.type === 'rug_large') {
      ctx.fillStyle = baseColor;
      ctx.beginPath();
      ctx.moveTo(b0.x, b0.y);
      ctx.lineTo(b1.x, b1.y);
      ctx.lineTo(b2.x, b2.y);
      ctx.lineTo(b3.x, b3.y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = isSelected ? '#38bdf8' : 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.stroke();
      ctx.restore();
      return;
    }

    // Drop shadow under 3D block
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.moveTo(b0.x + 2, b0.y + 2);
    ctx.lineTo(b1.x + 2, b1.y + 2);
    ctx.lineTo(b2.x + 2, b2.y + 2);
    ctx.lineTo(b3.x + 2, b3.y + 2);
    ctx.closePath();
    ctx.fill();

    // Draw 4 Side Walls
    for (let i = 0; i < 4; i++) {
      const next = (i + 1) % 4;
      const shade = i % 2 === 0 ? -28 : -14;

      ctx.fillStyle = adjustBrightness(baseColor, shade);
      ctx.beginPath();
      ctx.moveTo(b[i].x, b[i].y);
      ctx.lineTo(b[next].x, b[next].y);
      ctx.lineTo(t[next].x, t[next].y);
      ctx.lineTo(t[i].x, t[i].y);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = isSelected ? '#38bdf8' : 'rgba(0, 0, 0, 0.35)';
      ctx.lineWidth = isSelected ? 1.5 : 0.8;
      ctx.stroke();
    }

    // Top Face (t0 -> t1 -> t2 -> t3)
    ctx.fillStyle = adjustBrightness(baseColor, 22);
    ctx.beginPath();
    ctx.moveTo(t0.x, t0.y);
    ctx.lineTo(t1.x, t1.y);
    ctx.lineTo(t2.x, t2.y);
    ctx.lineTo(t3.x, t3.y);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = isSelected ? '#38bdf8' : 'rgba(0, 0, 0, 0.35)';
    ctx.lineWidth = isSelected ? 2 : 1;
    ctx.stroke();

    // Selected 3D highlight marker
    if (isSelected) {
      ctx.fillStyle = '#38bdf8';
      const centerT = {
        x: (t0.x + t1.x + t2.x + t3.x) / 4,
        y: (t0.y + t1.y + t2.y + t3.y) / 4
      };
      ctx.beginPath();
      ctx.arc(centerT.x, centerT.y - 12, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

/**
 * Adjust hex color brightness with fallback
 */
function adjustBrightness(colorStr, percent) {
  if (!colorStr) return '#475569';

  let hex = colorStr.trim();
  if (hex.startsWith('#')) hex = hex.slice(1);
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  let num = parseInt(hex, 16);
  if (isNaN(num)) return colorStr;

  let r = (num >> 16) + Math.round(255 * (percent / 100));
  let g = ((num >> 8) & 0x00FF) + Math.round(255 * (percent / 100));
  let b = (num & 0x0000FF) + Math.round(255 * (percent / 100));

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  const pad = (n) => n.toString(16).padStart(2, '0');
  return `#${pad(r)}${pad(g)}${pad(b)}`;
}
