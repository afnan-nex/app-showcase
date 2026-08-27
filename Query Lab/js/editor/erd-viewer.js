/**
 * QueryLab - Visual ERD (Entity-Relationship Diagram) Viewer
 * Interactive Canvas 2D schema visualizer with draggable table cards,
 * dynamic Foreign Key Bezier connectors, zoom/pan controls, and PNG export.
 */

import { getIcon } from '../core/icons.js';

export class ERDViewer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = { x: 40, y: 40, zoom: 1 };
    this.database = null;
    this.tablePositions = {};
    this.isPanning = false;
    this.draggingTableKey = null;
    this.dragOffset = { x: 0, y: 0 };
    this.lastMouse = { x: 0, y: 0 };
    this.hoveredTable = null;

    this.initListeners();
  }

  resize(width, height) {
    if (!width || !height) return;
    this.canvas.width = width;
    this.canvas.height = height;
    this.render();
  }

  setDatabase(database) {
    this.database = database;
    this.calculateLayout();
    this.render();
  }

  initListeners() {
    const canvas = this.canvas;

    canvas.addEventListener('mousedown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Convert mouse coords to world coords
      const worldX = (mouseX - this.camera.x) / this.camera.zoom;
      const worldY = (mouseY - this.camera.y) / this.camera.zoom;

      // Check if clicked inside a table card
      let clickedKey = null;
      for (const [tKey, pos] of Object.entries(this.tablePositions)) {
        if (
          worldX >= pos.x &&
          worldX <= pos.x + pos.width &&
          worldY >= pos.y &&
          worldY <= pos.y + pos.height
        ) {
          clickedKey = tKey;
          break;
        }
      }

      if (clickedKey) {
        this.draggingTableKey = clickedKey;
        this.dragOffset = {
          x: worldX - this.tablePositions[clickedKey].x,
          y: worldY - this.tablePositions[clickedKey].y
        };
        canvas.style.cursor = 'grabbing';
      } else {
        this.isPanning = true;
        this.lastMouse = { x: e.clientX, y: e.clientY };
        canvas.style.cursor = 'grab';
      }
    });

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const worldX = (mouseX - this.camera.x) / this.camera.zoom;
      const worldY = (mouseY - this.camera.y) / this.camera.zoom;

      if (this.draggingTableKey && this.tablePositions[this.draggingTableKey]) {
        this.tablePositions[this.draggingTableKey].x = worldX - this.dragOffset.x;
        this.tablePositions[this.draggingTableKey].y = worldY - this.dragOffset.y;
        this.render();
        return;
      }

      if (this.isPanning) {
        const dx = e.clientX - this.lastMouse.x;
        const dy = e.clientY - this.lastMouse.y;
        this.camera.x += dx;
        this.camera.y += dy;
        this.lastMouse = { x: e.clientX, y: e.clientY };
        this.render();
        return;
      }

      // Update hover state
      let hoverKey = null;
      for (const [tKey, pos] of Object.entries(this.tablePositions)) {
        if (
          worldX >= pos.x &&
          worldX <= pos.x + pos.width &&
          worldY >= pos.y &&
          worldY <= pos.y + pos.height
        ) {
          hoverKey = tKey;
          break;
        }
      }
      if (this.hoveredTable !== hoverKey) {
        this.hoveredTable = hoverKey;
        canvas.style.cursor = hoverKey ? 'move' : 'default';
        this.render();
      }
    });

    window.addEventListener('mouseup', () => {
      this.isPanning = false;
      this.draggingTableKey = null;
      canvas.style.cursor = this.hoveredTable ? 'move' : 'default';
    });

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      this.setZoom(this.camera.zoom * zoomFactor, e.clientX, e.clientY);
    });
  }

  setZoom(newZoom, centerX = null, centerY = null) {
    const clamped = Math.max(0.3, Math.min(2.5, newZoom));
    if (centerX !== null && centerY !== null) {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = centerX - rect.left;
      const mouseY = centerY - rect.top;

      const worldX = (mouseX - this.camera.x) / this.camera.zoom;
      const worldY = (mouseY - this.camera.y) / this.camera.zoom;

      this.camera.zoom = clamped;
      this.camera.x = mouseX - worldX * clamped;
      this.camera.y = mouseY - worldY * clamped;
    } else {
      this.camera.zoom = clamped;
    }
    this.render();
  }

  resetView() {
    this.camera = { x: 50, y: 50, zoom: 1 };
    this.calculateLayout();
    this.render();
  }

  calculateLayout() {
    if (!this.database) return;
    const tables = Object.values(this.database.tables || {});
    this.tablePositions = {};

    const cardWidth = 260;
    const spacingX = 100;
    const spacingY = 70;
    const cols = Math.min(3, Math.max(1, Math.ceil(Math.sqrt(tables.length))));

    tables.forEach((t, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const cardHeight = 44 + t.columns.length * 24 + 12;

      this.tablePositions[t.name.toLowerCase()] = {
        x: col * (cardWidth + spacingX) + 60,
        y: row * (cardHeight + spacingY) + 60,
        width: cardWidth,
        height: cardHeight,
        table: t
      };
    });
  }

  exportAsPNG() {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.canvas.width;
    tempCanvas.height = this.canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(this.canvas, 0, 0);

    const a = document.createElement('a');
    a.download = `${(this.database?.name || 'database').toLowerCase().replace(/\s+/g, '_')}_schema_erd.png`;
    a.href = tempCanvas.toDataURL('image/png');
    a.click();
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // 1. Clear background & draw subtle grid dots
    ctx.fillStyle = '#0a0e17';
    ctx.fillRect(0, 0, w, h);

    // Draw background dot grid
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    const gridSize = 24 * this.camera.zoom;
    const offsetX = (this.camera.x % gridSize);
    const offsetY = (this.camera.y % gridSize);

    for (let x = offsetX; x < w; x += gridSize) {
      for (let y = offsetY; y < h; y += gridSize) {
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    }

    if (!this.database) return;

    ctx.save();
    ctx.translate(this.camera.x, this.camera.y);
    ctx.scale(this.camera.zoom, this.camera.zoom);

    // 2. Draw Foreign Key Bezier Connectors
    this.drawRelationshipLines();

    // 3. Draw Schema Table Cards
    for (const [tKey, pos] of Object.entries(this.tablePositions)) {
      this.drawTableCard(pos, tKey === this.hoveredTable);
    }

    ctx.restore();
  }

  drawTableCard(pos, isHovered = false) {
    const ctx = this.ctx;
    const { x, y, width, height, table } = pos;

    ctx.save();

    // Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = isHovered ? 12 : 6;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;

    // Card Body Background
    ctx.fillStyle = isHovered ? '#1a2233' : '#111726';
    ctx.strokeStyle = isHovered ? '#58a6ff' : '#242f47';
    ctx.lineWidth = isHovered ? 2 : 1.5;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, [6]);
    ctx.fill();
    ctx.stroke();

    ctx.shadowColor = 'transparent';

    // Card Header Bar
    ctx.fillStyle = '#182030';
    ctx.beginPath();
    ctx.roundRect(x, y, width, 36, [6, 6, 0, 0]);
    ctx.fill();
    ctx.strokeStyle = '#242f47';
    ctx.beginPath();
    ctx.moveTo(x, y + 36);
    ctx.lineTo(x + width, y + 36);
    ctx.stroke();

    // Table Header Icon & Name
    ctx.fillStyle = '#58a6ff';
    ctx.font = "bold 13px 'JetBrains Mono', Consolas, monospace";
    ctx.fillText(table.name, x + 12, y + 23);

    // Row count indicator
    ctx.fillStyle = '#8b949e';
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.textAlign = 'right';
    ctx.fillText(`${(table.rows || []).length} rows`, x + width - 12, y + 23);
    ctx.textAlign = 'left';

    // Columns list
    let colY = y + 56;
    table.columns.forEach((c) => {
      const isPK = c.isPrimaryKey;
      const isFK = (table.foreignKeys || []).some(fk => fk.column === c.name);

      let labelX = x + 12;

      // PK Badge
      if (isPK) {
        ctx.fillStyle = '#58a6ff';
        ctx.font = "bold 9px 'JetBrains Mono', monospace";
        ctx.fillText('PK', labelX, colY);
        labelX += 22;
      } else if (isFK) {
        ctx.fillStyle = '#d29922';
        ctx.font = "bold 9px 'JetBrains Mono', monospace";
        ctx.fillText('FK', labelX, colY);
        labelX += 22;
      }

      // Column Name
      ctx.fillStyle = isPK ? '#f0f6fc' : '#c9d1d9';
      ctx.font = `${isPK ? '600 ' : '400 '}11px 'JetBrains Mono', monospace`;
      ctx.fillText(c.name, labelX, colY);

      // Data Type
      ctx.fillStyle = '#8b949e';
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.textAlign = 'right';
      ctx.fillText(c.type || 'TEXT', x + width - 12, colY);
      ctx.textAlign = 'left';

      colY += 24;
    });

    ctx.restore();
  }

  drawRelationshipLines() {
    const ctx = this.ctx;

    for (const [tKey, pos] of Object.entries(this.tablePositions)) {
      const table = pos.table;
      if (!table.foreignKeys || table.foreignKeys.length === 0) continue;

      for (const fk of table.foreignKeys) {
        const targetPos = this.tablePositions[fk.refTable.toLowerCase()];
        if (!targetPos) continue;

        // Source column vertical anchor
        const colIdx = table.columns.findIndex(c => c.name === fk.column);
        const srcY = pos.y + 56 + (colIdx >= 0 ? colIdx : 0) * 24 - 4;
        const srcX = pos.x + pos.width;

        // Target table/column vertical anchor
        const targetColIdx = targetPos.table.columns.findIndex(c => c.name === fk.refColumn);
        const dstY = targetPos.y + 56 + (targetColIdx >= 0 ? targetColIdx : 0) * 24 - 4;
        const dstX = targetPos.x;

        // Draw Bezier Curve
        ctx.save();
        ctx.strokeStyle = '#58a6ff';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 4]);

        const dx = Math.abs(dstX - srcX);
        const cpX1 = srcX + Math.max(40, dx * 0.4);
        const cpX2 = dstX - Math.max(40, dx * 0.4);

        ctx.beginPath();
        ctx.moveTo(srcX, srcY);
        ctx.bezierCurveTo(cpX1, srcY, cpX2, dstY, dstX, dstY);
        ctx.stroke();

        // Source Connection Point
        ctx.fillStyle = '#58a6ff';
        ctx.beginPath();
        ctx.arc(srcX, srcY, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Target Arrow / Point
        ctx.fillStyle = '#3fb950';
        ctx.beginPath();
        ctx.arc(dstX, dstY, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }
  }
}
