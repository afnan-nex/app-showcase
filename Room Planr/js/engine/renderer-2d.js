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
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
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
    const w = this.canvas.width;
    const h = this.canvas.height;

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

    // 4. Draw Furniture Items (Lowest Z to Highest Z)
    for (const item of items) {
      const isSelected = item.id === selectedItemId;
      const isOverlapping = overlappingItemIds.has(item.id);
      this.drawFurnitureItem(ctx, item, scale, isSelected, isOverlapping);
    }

    // 5. Draw Perimeter Walls & Openings (Doors / Windows)
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
  }

  drawGrid(ctx, w, h, scale) {
    ctx.save();
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.35)';
    ctx.lineWidth = 1;

    // 1-meter major grid lines
    const startX = -10;
    const endX = 20;
    const startY = -10;
    const endY = 20;

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

    if (mat.tile) {
      const tileSize = 0.6 * scale;
      for (let x = 0; x <= rw; x += tileSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, rd); ctx.stroke();
      }
      for (let y = 0; y <= rd; y += tileSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(rw, y); ctx.stroke();
      }
    } else {
      const plankW = 0.25 * scale;
      for (let x = 0; x <= rw; x += plankW) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, rd); ctx.stroke();
      }
    }
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
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    // Item Body Fill
    ctx.fillStyle = item.color || '#475569';
    ctx.fillRect(-iw / 2, -id / 2, iw, id);
    ctx.shadowColor = 'transparent';

    // Outline
    ctx.strokeStyle = isOverlapping ? '#f59e0b' : (isSelected ? '#38bdf8' : '#0f172a');
    ctx.lineWidth = isSelected ? 2.5 : 1.5;
    ctx.strokeRect(-iw / 2, -id / 2, iw, id);

    // CAD Details
    this.drawCADDetails(ctx, item, iw, id);

    // Selection Handles (Corner squares & top rotation knob)
    if (isSelected) {
      this.drawSelectionHandles(ctx, iw, id);
    }

    ctx.restore();
  }

  drawCADDetails(ctx, item, iw, id) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1;

    // Sofa Cushions
    if (item.type && item.type.includes('sofa')) {
      ctx.strokeRect(-iw / 2 + 4, -id / 2 + 4, iw - 8, id - 8);
      ctx.beginPath();
      ctx.moveTo(-iw / 6, -id / 2 + 4); ctx.lineTo(-iw / 6, id / 2 - 4);
      ctx.moveTo(iw / 6, -id / 2 + 4); ctx.lineTo(iw / 6, id / 2 - 4);
      ctx.stroke();
    }
    // Bed Pillows
    else if (item.type && item.type.includes('bed')) {
      const pilW = iw * 0.38;
      const pilH = id * 0.22;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillRect(-iw / 2 + 6, -id / 2 + 6, pilW, pilH);
      ctx.fillRect(iw / 2 - pilW - 6, -id / 2 + 6, pilW, pilH);
    }
    // Door Swing Arc
    else if (item.isDoor) {
      ctx.strokeStyle = '#38bdf8';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(-iw / 2, id / 2, iw, -Math.PI / 2, 0);
      ctx.stroke();
    }
    // Window Glass Pane
    else if (item.isWindow) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-iw / 2, 0); ctx.lineTo(iw / 2, 0);
      ctx.stroke();
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
      ctx.fillText(formatDimension(dist.left, unit), ix / 2, iy - 4);
    }

    // Right line to wall
    if (dist.right > 0.05) {
      ctx.beginPath();
      ctx.moveTo(ix + (item.width * scale) / 2, iy); ctx.lineTo(room.width * scale, iy);
      ctx.stroke();
      ctx.fillText(formatDimension(dist.right, unit), (ix + room.width * scale) / 2, iy - 4);
    }

    // Top line to wall
    if (dist.top > 0.05) {
      ctx.beginPath();
      ctx.moveTo(ix, 0); ctx.lineTo(ix, iy - (item.depth * scale) / 2);
      ctx.stroke();
      ctx.fillText(formatDimension(dist.top, unit), ix + 24, iy / 2);
    }

    // Bottom line to wall
    if (dist.bottom > 0.05) {
      ctx.beginPath();
      ctx.moveTo(ix, iy + (item.depth * scale) / 2); ctx.lineTo(ix, room.depth * scale);
      ctx.stroke();
      ctx.fillText(formatDimension(dist.bottom, unit), ix + 24, (iy + room.depth * scale) / 2);
    }

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
    ctx.fillText(`Width: ${formatDimension(room.width, unit)}`, rw / 2, -offset - 6);

    // Left Dimension Line (Depth)
    ctx.save();
    ctx.translate(-offset, rd / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(-rd / 2, 0); ctx.lineTo(rd / 2, 0);
    ctx.moveTo(-rd / 2, -5); ctx.lineTo(-rd / 2, 5);
    ctx.moveTo(rd / 2, -5); ctx.lineTo(rd / 2, 5);
    ctx.stroke();
    ctx.fillText(`Depth: ${formatDimension(room.depth, unit)}`, 0, -8);
    ctx.restore();

    ctx.restore();
  }
}
