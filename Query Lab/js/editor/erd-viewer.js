/**
 * QueryLab - Visual ERD (Entity-Relationship Diagram) Viewer
 * Interactive Canvas 2D schema visualizer with schema cards and relationship bezier connectors.
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
    this.lastMouse = { x: 0, y: 0 };

    this.initListeners();
  }

  resize(width, height) {
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
      this.isPanning = true;
      this.lastMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isPanning) {
        const dx = e.clientX - this.lastMouse.x;
        const dy = e.clientY - this.lastMouse.y;
        this.camera.x += dx;
        this.camera.y += dy;
        this.lastMouse = { x: e.clientX, y: e.clientY };
        this.render();
      }
    });

    window.addEventListener('mouseup', () => {
      this.isPanning = false;
    });

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
      this.camera.zoom = Math.max(0.2, Math.min(3, this.camera.zoom * zoomFactor));
      this.render();
    });
  }

  calculateLayout() {
    if (!this.database) return;
    const tables = Object.values(this.database.tables || {});
    this.tablePositions = {};

    const cardWidth = 240;
    const spacingX = 80;
    const spacingY = 60;
    const cols = Math.min(3, Math.max(1, Math.ceil(Math.sqrt(tables.length))));

    tables.forEach((t, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const cardHeight = 40 + t.columns.length * 24 + 10;

      this.tablePositions[t.name.toLowerCase()] = {
        x: col * (cardWidth + spacingX) + 50,
        y: row * (cardHeight + spacingY) + 50,
        width: cardWidth,
        height: cardHeight,
        table: t
      };
    });
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // 1. Clear background
    ctx.fillStyle = '#0f1117';
    ctx.fillRect(0, 0, w, h);

    if (!this.database) return;

    ctx.save();
    ctx.translate(this.camera.x, this.camera.y);
    ctx.scale(this.camera.zoom, this.camera.zoom);

    // 2. Draw Foreign Key Bezier Connectors
    this.drawRelationshipLines();

    // 3. Draw Schema Table Cards
    for (const [tKey, pos] of Object.entries(this.tablePositions)) {
      this.drawTableCard(pos);
    }

    ctx.restore();
  }

  drawTableCard(pos) {
    const ctx = this.ctx;
    const { x, y, width, height, table } = pos;

    ctx.save();

    // Card Body Background
    ctx.fillStyle = '#161b22';
    ctx.strokeStyle = '#30363d';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, [6]);
    ctx.fill();
    ctx.stroke();

    // Card Header Bar
    ctx.fillStyle = '#21262d';
    ctx.beginPath();
    ctx.roundRect(x, y, width, 34, [6, 6, 0, 0]);
    ctx.fill();
    ctx.strokeStyle = '#30363d';
    ctx.beginPath();
    ctx.moveTo(x, y + 34); ctx.lineTo(x + width, y + 34);
    ctx.stroke();

    // Table Name
    ctx.fillStyle = '#58a6ff';
    ctx.font = "bold 13px 'JetBrains Mono', monospace";
    ctx.fillText(table.name, x + 12, y + 22);

    // Columns
    let colY = y + 54;
    table.columns.forEach((c) => {
      const isPK = c.isPrimaryKey;
      const isFK = (table.foreignKeys || []).some(fk => fk.column === c.name);

      ctx.fillStyle = isPK ? '#f0f6fc' : '#c9d1d9';
      ctx.font = `${isPK ? 'bold ' : ''}11px 'JetBrains Mono', monospace`;

      let labelX = x + 12;
      if (isPK) {
        ctx.fillStyle = '#58a6ff';
        ctx.fillText('PK', labelX, colY);
        labelX += 24;
      } else if (isFK) {
        ctx.fillStyle = '#d29922';
        ctx.fillText('FK', labelX, colY);
        labelX += 24;
      }

      ctx.fillStyle = '#f0f6fc';
      ctx.fillText(c.name, labelX, colY);

      // Type Badge
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
      if (!table.foreignKeys) continue;

      for (const fk of table.foreignKeys) {
        const targetPos = this.tablePositions[fk.refTable.toLowerCase()];
        if (!targetPos) continue;

        // Source column position
        const colIdx = table.columns.findIndex(c => c.name === fk.column);
        const srcY = pos.y + 54 + (colIdx >= 0 ? colIdx : 0) * 24 - 4;
        const srcX = pos.x + pos.width;

        // Target table position
        const targetColIdx = targetPos.table.columns.findIndex(c => c.name === fk.refColumn);
        const dstY = targetPos.y + 54 + (targetColIdx >= 0 ? targetColIdx : 0) * 24 - 4;
        const dstX = targetPos.x;

        // Draw Bezier Curve
        ctx.save();
        ctx.strokeStyle = '#58a6ff';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);

        const cpX1 = srcX + 40;
        const cpX2 = dstX - 40;

        ctx.beginPath();
        ctx.moveTo(srcX, srcY);
        ctx.bezierCurveTo(cpX1, srcY, cpX2, dstY, dstX, dstY);
        ctx.stroke();

        // Arrow Endpoint
        ctx.fillStyle = '#58a6ff';
        ctx.beginPath();
        ctx.arc(srcX, srcY, 4, 0, Math.PI * 2);
        ctx.arc(dstX, dstY, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }
  }
}
