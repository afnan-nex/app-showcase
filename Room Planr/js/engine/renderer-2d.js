/**
 * RoomPlanr - 2D Architectural CAD Floor Plan Renderer
 * Precision top-down CAD drafting with floor materials, wall thicknesses, door arcs, and dimension annotations.
 */

import { formatDimension, UNITS } from '../core/units.js';
import { FLOOR_MATERIALS } from './catalog.js';
import { getDistancesToWalls } from './collision.js';

export class Renderer2D {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = { x: 0, y: 0, zoom: 70 }; // pixels per meter
    this.wallThickness = 0.20; // 20cm outer wall thickness
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

  render({
    room,
    items = [],
    selectedItemId = null,
    overlappingItemIds = new Set(),
    unit = UNITS.METERS,
    showGrid = true,
    showDimensions = true
  }) {
    const ctx = this.ctx;
    const w = this.logicalWidth;
    const h = this.logicalHeight;

    ctx.save();
    ctx.scale(this.dpr, this.dpr);

    // 1. Clear Viewport Background
    ctx.fillStyle = '#080c14';
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(this.camera.x, this.camera.y);
    const scale = this.camera.zoom;

    // 2. Draw Background Grid
    if (showGrid) {
      this.drawGrid(ctx, w, h, scale);
    }

    // 3. Draw Room Floor Material
    this.drawRoomFloor(ctx, room, scale);

    // 4. Draw Furniture Items (Lowest Z to Highest Z, Rugs first)
    const sorted = [...items].sort((a, b) => {
      const aRug = a.type === 'rug_large' ? -1 : 0;
      const bRug = b.type === 'rug_large' ? -1 : 0;
      return aRug - bRug;
    });

    for (const item of sorted) {
      const isSelected = item.id === selectedItemId;
      const isOverlapping = overlappingItemIds.has(item.id);
      this.drawFurnitureItem(ctx, item, scale, isSelected, isOverlapping);
    }

    // 5. Draw Perimeter Walls & Openings
    this.drawWalls(ctx, room, scale);

    // 6. Draw Selected Item Dimension Clearance Lines
    if (selectedItemId && showDimensions) {
      const activeItem = items.find(i => i.id === selectedItemId);
      if (activeItem) {
        this.drawClearanceDimensions(ctx, activeItem, room, scale, unit);
      }
    }

    // 7. Draw Room Dimension Annotations
    if (showDimensions) {
      this.drawRoomDimensions(ctx, room, scale, unit);
    }

    ctx.restore();
    ctx.restore();
  }

  drawGrid(ctx, w, h, scale) {
    ctx.save();

    // 0.2m minor grid lines
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.15)';
    ctx.lineWidth = 0.5;
    const startX = -10;
    const endX = 25;
    const startY = -10;
    const endY = 25;

    for (let x = startX; x <= endX; x += 0.2) {
      ctx.beginPath();
      ctx.moveTo(x * scale, startY * scale);
      ctx.lineTo(x * scale, endY * scale);
      ctx.stroke();
    }
    for (let y = startY; y <= endY; y += 0.2) {
      ctx.beginPath();
      ctx.moveTo(startX * scale, y * scale);
      ctx.lineTo(endX * scale, y * scale);
      ctx.stroke();
    }

    // 1-meter major grid lines
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
    ctx.lineWidth = 1;

    for (let x = startX; x <= endX; x += 1) {
      ctx.beginPath();
      ctx.moveTo(x * scale, startY * scale);
      ctx.lineTo(x * scale, endY * scale);
      ctx.stroke();
    }
    for (let y = startY; y <= endY; y += 1) {
      ctx.beginPath();
      ctx.moveTo(startX * scale, y * scale);
      ctx.lineTo(endX * scale, y * scale);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawRoomFloor(ctx, room, scale) {
    const rw = room.width * scale;
    const rd = room.depth * scale;
    const mat = FLOOR_MATERIALS[room.floorMaterial] || FLOOR_MATERIALS.oak;

    ctx.save();
    // Floor Base Fill
    ctx.fillStyle = mat.color;
    ctx.fillRect(0, 0, rw, rd);

    // Floor Plank / Tile lines
    ctx.strokeStyle = mat.stroke;
    ctx.lineWidth = 1;

    if (mat.id === 'walnut') {
      // Herringbone pattern
      const step = 0.3 * scale;
      for (let x = -rd; x <= rw + rd; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + rd, rd);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + step, 0);
        ctx.lineTo(x - rd + step, rd);
        ctx.stroke();
      }
    } else if (mat.tile) {
      const tileSize = 0.6 * scale;
      for (let x = 0; x <= rw; x += tileSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, rd); ctx.stroke();
      }
      for (let y = 0; y <= rd; y += tileSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(rw, y); ctx.stroke();
      }
    } else {
      const plankW = 0.22 * scale;
      for (let x = 0; x <= rw; x += plankW) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, rd); ctx.stroke();
      }
    }

    // Inner shadow border
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, rw, rd);

    ctx.restore();
  }

  drawWalls(ctx, room, scale) {
    const rw = room.width * scale;
    const rd = room.depth * scale;
    const wt = this.wallThickness * scale;
    const wallColor = room.wallColor || '#1e293b';

    ctx.save();
    ctx.fillStyle = wallColor;
    ctx.strokeStyle = '#080c14';
    ctx.lineWidth = 2;

    // Top Wall
    ctx.fillRect(-wt, -wt, rw + wt * 2, wt);
    ctx.strokeRect(-wt, -wt, rw + wt * 2, wt);

    // Bottom Wall
    ctx.fillRect(-wt, rd, rw + wt * 2, wt);
    ctx.strokeRect(-wt, rd, rw + wt * 2, wt);

    // Left Wall
    ctx.fillRect(-wt, 0, wt, rd);
    ctx.strokeRect(-wt, 0, wt, rd);

    // Right Wall
    ctx.fillRect(rw, 0, wt, rd);
    ctx.strokeRect(rw, 0, wt, rd);

    // Inner Corner lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, rw, rd);

    ctx.restore();
  }

  drawFurnitureItem(ctx, item, scale, isSelected, isOverlapping) {
    const ix = item.x * scale;
    const iy = item.y * scale;
    const iw = (item.width || 1) * scale;
    const id = (item.depth || 1) * scale;
    const rot = ((item.rotation || 0) * Math.PI) / 180;

    ctx.save();
    ctx.translate(ix, iy);
    ctx.rotate(rot);

    // Drop Shadow
    if (item.type !== 'rug_large') {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 1.5;
      ctx.shadowOffsetY = 1.5;
    }

    // Item Body Fill
    ctx.fillStyle = item.color || '#475569';
    ctx.fillRect(-iw / 2, -id / 2, iw, id);
    ctx.shadowColor = 'transparent';

    // Outline
    ctx.strokeStyle = isOverlapping ? '#f59e0b' : (isSelected ? '#38bdf8' : 'rgba(15, 23, 42, 0.8)');
    ctx.lineWidth = isSelected ? 2.5 : 1.5;
    ctx.strokeRect(-iw / 2, -id / 2, iw, id);

    // CAD Details & Symbols
    this.drawCADDetails(ctx, item, iw, id);

    // Selection Handles (Corner squares & top rotation knob)
    if (isSelected) {
      this.drawSelectionHandles(ctx, iw, id);
    }

    ctx.restore();
  }

  drawCADDetails(ctx, item, iw, id) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;

    const t = item.type || '';

    // 1. Sofas & Armchairs
    if (t.includes('sofa') || t.includes('armchair') || t.includes('club')) {
      const armW = Math.min(12, iw * 0.12);
      // Armrests
      ctx.strokeRect(-iw / 2, -id / 2, armW, id);
      ctx.strokeRect(iw / 2 - armW, -id / 2, armW, id);
      // Backrest
      const backD = Math.min(14, id * 0.22);
      ctx.strokeRect(-iw / 2 + armW, -id / 2, iw - armW * 2, backD);
      // Cushion split lines
      if (t === 'sofa_3seat' || iw > 80) {
        const segW = (iw - armW * 2) / 3;
        ctx.beginPath();
        ctx.moveTo(-iw / 2 + armW + segW, -id / 2 + backD); ctx.lineTo(-iw / 2 + armW + segW, id / 2);
        ctx.moveTo(-iw / 2 + armW + segW * 2, -id / 2 + backD); ctx.lineTo(-iw / 2 + armW + segW * 2, id / 2);
        ctx.stroke();
      }
    }
    // 2. Beds
    else if (t.includes('bed')) {
      // Headboard
      const hbD = Math.min(10, id * 0.12);
      ctx.fillRect(-iw / 2, -id / 2, iw, hbD);
      // Pillows
      const pilW = iw * 0.38;
      const pilH = id * 0.22;
      ctx.strokeRect(-iw / 2 + 4, -id / 2 + hbD + 4, pilW, pilH);
      ctx.strokeRect(iw / 2 - pilW - 4, -id / 2 + hbD + 4, pilW, pilH);
      // Duvet turn-down line
      ctx.beginPath();
      ctx.setLineDash([4, 2]);
      ctx.moveTo(-iw / 2 + 4, -id / 2 + hbD + pilH + 10);
      ctx.lineTo(iw / 2 - 4, -id / 2 + hbD + pilH + 10);
      ctx.stroke();
    }
    // 3. Desks & Workstations
    else if (t.includes('desk')) {
      // Bevel boundary
      ctx.strokeRect(-iw / 2 + 3, -id / 2 + 3, iw - 6, id - 6);
      // Cable grommet
      ctx.beginPath();
      ctx.arc(iw / 2 - 12, -id / 2 + 12, 3, 0, Math.PI * 2);
      ctx.stroke();
    }
    // 4. Task Chair
    else if (t === 'office_chair') {
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(iw, id) * 0.35, 0, Math.PI * 2);
      ctx.stroke();
      // 5-point star casters
      for (let a = 0; a < 5; a++) {
        const rad = (a * 72 * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(rad) * iw * 0.45, Math.sin(rad) * id * 0.45);
        ctx.stroke();
      }
    }
    // 5. Kitchen Island & Stove
    else if (t.includes('kitchen_island')) {
      // Sink outline
      ctx.strokeRect(-iw / 2 + 10, -id / 2 + 6, iw * 0.35, id - 12);
      ctx.beginPath();
      ctx.arc(-iw / 2 + 10 + (iw * 0.35) / 2, 0, 3, 0, Math.PI * 2);
      ctx.stroke();
    }
    else if (t.includes('stove_oven')) {
      // 4 Cooktop rings
      const r = Math.min(iw, id) * 0.15;
      [
        [-iw / 4, -id / 4], [iw / 4, -id / 4],
        [-iw / 4, id / 4], [iw / 4, id / 4]
      ].forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      });
    }
    // 6. Bathtub & Toilet
    else if (t === 'bath_tub') {
      ctx.beginPath();
      ctx.roundRect(-iw / 2 + 6, -id / 2 + 6, iw - 12, id - 12, 16);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(iw / 2 - 16, 0, 4, 0, Math.PI * 2);
      ctx.stroke();
    }
    else if (t === 'toilet') {
      // Tank
      ctx.strokeRect(-iw / 2, -id / 2, iw, id * 0.35);
      // Bowl oval
      ctx.beginPath();
      ctx.ellipse(0, id * 0.15, iw * 0.4, id * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    // 7. Door Swing Arc
    else if (item.isDoor) {
      ctx.strokeStyle = '#38bdf8';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(-iw / 2, id / 2, iw, -Math.PI / 2, 0);
      ctx.stroke();
      // Door leaf
      ctx.setLineDash([]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-iw / 2, id / 2);
      ctx.lineTo(-iw / 2, -id / 2 - iw + id);
      ctx.stroke();
    }
    // 8. Window Glass Pane
    else if (item.isWindow) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-iw / 2, -id / 4); ctx.lineTo(iw / 2, -id / 4);
      ctx.moveTo(-iw / 2, id / 4); ctx.lineTo(iw / 2, id / 4);
      ctx.stroke();
    }
    // 9. Plants
    else if (t.includes('plant')) {
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(iw, id) * 0.35, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 6; i++) {
        const rad = (i * 60 * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(rad) * iw * 0.45, Math.sin(rad) * id * 0.45);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  drawSelectionHandles(ctx, iw, id) {
    const handleSize = 8;
    ctx.fillStyle = '#38bdf8';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;

    // 4 Corner Resize Handles
    [
      [-iw / 2, -id / 2],
      [iw / 2, -id / 2],
      [iw / 2, id / 2],
      [-iw / 2, id / 2]
    ].forEach(([hx, hy]) => {
      ctx.fillRect(hx - handleSize / 2, hy - handleSize / 2, handleSize, handleSize);
      ctx.strokeRect(hx - handleSize / 2, hy - handleSize / 2, handleSize, handleSize);
    });

    // Top Rotation Knob
    const rotDist = 24;
    ctx.beginPath();
    ctx.moveTo(0, -id / 2);
    ctx.lineTo(0, -id / 2 - rotDist);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, -id / 2 - rotDist, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  drawClearanceDimensions(ctx, item, room, scale, unit) {
    const dist = getDistancesToWalls(item, room.width, room.depth);
    const ix = item.x * scale;
    const iy = item.y * scale;

    ctx.save();
    ctx.strokeStyle = '#38bdf8';
    ctx.fillStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.font = "bold 10px 'JetBrains Mono', monospace";
    ctx.textAlign = 'center';

    // Left line to wall
    if (dist.left > 0.05) {
      ctx.beginPath();
      ctx.moveTo(0, iy); ctx.lineTo(ix - (item.width * scale) / 2, iy);
      ctx.stroke();
      this.drawDimensionBadge(ctx, formatDimension(dist.left, unit), ix / 2, iy - 4);
    }

    // Right line to wall
    if (dist.right > 0.05) {
      ctx.beginPath();
      ctx.moveTo(ix + (item.width * scale) / 2, iy); ctx.lineTo(room.width * scale, iy);
      ctx.stroke();
      this.drawDimensionBadge(ctx, formatDimension(dist.right, unit), (ix + room.width * scale) / 2, iy - 4);
    }

    // Top line to wall
    if (dist.top > 0.05) {
      ctx.beginPath();
      ctx.moveTo(ix, 0); ctx.lineTo(ix, iy - (item.depth * scale) / 2);
      ctx.stroke();
      this.drawDimensionBadge(ctx, formatDimension(dist.top, unit), ix + 24, iy / 2);
    }

    // Bottom line to wall
    if (dist.bottom > 0.05) {
      ctx.beginPath();
      ctx.moveTo(ix, iy + (item.depth * scale) / 2); ctx.lineTo(ix, room.depth * scale);
      ctx.stroke();
      this.drawDimensionBadge(ctx, formatDimension(dist.bottom, unit), ix + 24, (iy + room.depth * scale) / 2);
    }

    ctx.restore();
  }

  drawDimensionBadge(ctx, text, x, y) {
    ctx.save();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    const textWidth = ctx.measureText(text).width;
    ctx.fillRect(x - textWidth / 2 - 4, y - 10, textWidth + 8, 14);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  drawRoomDimensions(ctx, room, scale, unit) {
    const rw = room.width * scale;
    const rd = room.depth * scale;
    const offset = 26;

    ctx.save();
    ctx.strokeStyle = '#94a3b8';
    ctx.fillStyle = '#f8fafc';
    ctx.lineWidth = 1.5;
    ctx.font = "bold 11px 'JetBrains Mono', monospace";
    ctx.textAlign = 'center';

    // Top Dimension Line (Width)
    ctx.beginPath();
    ctx.moveTo(0, -offset); ctx.lineTo(rw, -offset);
    ctx.moveTo(0, -offset - 5); ctx.lineTo(0, -offset + 5);
    ctx.moveTo(rw, -offset - 5); ctx.lineTo(rw, -offset + 5);
    ctx.stroke();

    // Top dimension text badge
    ctx.save();
    const wText = `Width: ${formatDimension(room.width, unit)}`;
    const twW = ctx.measureText(wText).width;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(rw / 2 - twW / 2 - 6, -offset - 16, twW + 12, 16);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(wText, rw / 2, -offset - 4);
    ctx.restore();

    // Left Dimension Line (Depth)
    ctx.save();
    ctx.translate(-offset, rd / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(-rd / 2, 0); ctx.lineTo(rd / 2, 0);
    ctx.moveTo(-rd / 2, -5); ctx.lineTo(-rd / 2, 5);
    ctx.moveTo(rd / 2, -5); ctx.lineTo(rd / 2, 5);
    ctx.stroke();

    const dText = `Depth: ${formatDimension(room.depth, unit)}`;
    const twD = ctx.measureText(dText).width;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-twD / 2 - 6, -18, twD + 12, 16);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(dText, 0, -6);
    ctx.restore();

    ctx.restore();
  }
}
