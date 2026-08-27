/**
 * GameSmith - Built-In Pixel Art Sprite Painter
 * Interactive 16x16 / 32x32 pixel editor for drawing custom game sprites.
 */

import { getIcon, escapeHTML } from '../core/icons.js';

const PALETTE = [
  '#000000', '#ffffff', '#58a6ff', '#3fb950', '#f85149', '#d29922',
  '#a371f7', '#f0883e', '#1f6feb', '#238636', '#da3633', '#9e6a03',
  '#8b949e', '#30363d', '#ff7b72', '#79c0ff', '#56d364', '#e3b341'
];

export class SpritePainterModal {
  constructor(modalContainer, onSaveSprite) {
    this.container = modalContainer;
    this.onSaveSprite = onSaveSprite;
    this.gridSize = 16;
    this.pixels = new Array(this.gridSize * this.gridSize).fill('transparent');
    this.currentColor = '#58a6ff';
    this.currentTool = 'pencil'; // pencil, eraser, fill
    this.isDrawing = false;
  }

  open(spriteToEdit = null) {
    if (spriteToEdit && spriteToEdit.pixels) {
      this.gridSize = spriteToEdit.size || 16;
      this.pixels = [...spriteToEdit.pixels];
      this.spriteName = spriteToEdit.name || 'Custom Sprite';
      this.spriteId = spriteToEdit.id;
    } else {
      this.gridSize = 16;
      this.pixels = new Array(this.gridSize * this.gridSize).fill('transparent');
      this.spriteName = 'Sprite_' + Math.floor(Math.random() * 1000);
      this.spriteId = 'sprite_' + Date.now();
    }

    this.render();
    this.container.classList.add('active');
  }

  close() {
    this.container.classList.remove('active');
  }

  render() {
    this.container.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-dialog sprite-painter-dialog">
        <div class="modal-header">
          <div class="flex items-center gap-2">
            ${getIcon('paint', 'icon-sm')}
            <span class="font-bold text-sm">Pixel Art Sprite Painter</span>
          </div>
          <button class="btn-icon-xs btn-modal-close">&times;</button>
        </div>

        <div class="modal-body p-4 flex gap-4">
          
          <!-- Drawing Canvas -->
          <div class="painter-canvas-container flex flex-col items-center">
            <canvas id="painter-canvas" width="288" height="288" class="painter-canvas cursor-crosshair"></canvas>
            <div class="flex gap-2 mt-3 items-center">
              <span class="text-xs text-muted">Grid:</span>
              <button class="btn btn-xs ${this.gridSize === 16 ? 'btn-primary' : 'btn-secondary'} btn-set-grid" data-size="16">16x16</button>
              <button class="btn btn-xs ${this.gridSize === 32 ? 'btn-primary' : 'btn-secondary'} btn-set-grid" data-size="32">32x32</button>
              <button class="btn btn-xs btn-ghost text-rose ml-auto btn-clear-canvas">${getIcon('trash', 'icon-xs')} Clear</button>
            </div>
          </div>

          <!-- Tools & Palette -->
          <div class="painter-tools-sidebar flex-1 flex flex-col justify-between">
            <div>
              <div class="form-group mb-3">
                <label class="form-label text-xs font-semibold">Sprite Name</label>
                <input type="text" id="painter-sprite-name" class="form-control form-control-sm" value="${escapeHTML(this.spriteName)}" />
              </div>

              <div class="tool-picker-row flex gap-2 mb-3">
                <button class="btn btn-sm ${this.currentTool === 'pencil' ? 'btn-primary' : 'btn-secondary'} btn-tool-select" data-tool="pencil">
                  Pencil
                </button>
                <button class="btn btn-sm ${this.currentTool === 'eraser' ? 'btn-primary' : 'btn-secondary'} btn-tool-select" data-tool="eraser">
                  Eraser
                </button>
                <button class="btn btn-sm ${this.currentTool === 'fill' ? 'btn-primary' : 'btn-secondary'} btn-tool-select" data-tool="fill">
                  Bucket
                </button>
              </div>

              <div class="palette-swatches-grid mb-3">
                ${PALETTE.map(c => `
                  <div class="swatch-btn ${this.currentColor === c ? 'selected' : ''}" style="background-color: ${c};" data-color="${c}"></div>
                `).join('')}
              </div>

              <div class="flex items-center gap-2 mb-4">
                <label class="text-xs text-muted">Custom:</label>
                <input type="color" id="painter-color-picker" class="form-control form-control-sm p-0 w-8 h-7 cursor-pointer" value="${this.currentColor}" />
              </div>
            </div>

            <!-- Preview -->
            <div class="card p-3 flex items-center justify-between">
              <span class="text-xs font-semibold text-muted">Preview</span>
              <canvas id="painter-preview" width="48" height="48" style="background: #0d1117; border-radius: 4px; border: 1px solid var(--border-subtle);"></canvas>
            </div>
          </div>

        </div>

        <div class="modal-footer p-3 border-t flex justify-end gap-2">
          <button class="btn btn-sm btn-secondary btn-modal-close">Cancel</button>
          <button class="btn btn-sm btn-primary" id="btn-save-painter-sprite">Save to Project</button>
        </div>
      </div>
    `;

    this.canvas = this.container.querySelector('#painter-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.previewCanvas = this.container.querySelector('#painter-preview');
    this.previewCtx = this.previewCanvas.getContext('2d');

    this.initCanvasEvents();
    this.redraw();

    // Close buttons
    this.container.querySelectorAll('.btn-modal-close, .modal-backdrop').forEach(b => {
      b.addEventListener('click', () => this.close());
    });

    // Tool selects
    this.container.querySelectorAll('.btn-tool-select').forEach(b => {
      b.addEventListener('click', () => {
        this.currentTool = b.dataset.tool;
        this.container.querySelectorAll('.btn-tool-select').forEach(x => x.className = 'btn btn-sm btn-secondary btn-tool-select');
        b.className = 'btn btn-sm btn-primary btn-tool-select';
      });
    });

    // Swatches
    this.container.querySelectorAll('.swatch-btn').forEach(b => {
      b.addEventListener('click', () => {
        this.currentColor = b.dataset.color;
        this.container.querySelectorAll('.swatch-btn').forEach(x => x.classList.remove('selected'));
        b.classList.add('selected');
        this.container.querySelector('#painter-color-picker').value = this.currentColor;
      });
    });

    this.container.querySelector('#painter-color-picker')?.addEventListener('input', (e) => {
      this.currentColor = e.target.value;
    });

    // Grid size switch
    this.container.querySelectorAll('.btn-set-grid').forEach(b => {
      b.addEventListener('click', () => {
        const size = parseInt(b.dataset.size, 10);
        if (size !== this.gridSize) {
          this.gridSize = size;
          this.pixels = new Array(size * size).fill('transparent');
          this.render();
        }
      });
    });

    // Clear
    this.container.querySelector('.btn-clear-canvas')?.addEventListener('click', () => {
      this.pixels.fill('transparent');
      this.redraw();
    });

    // Save Sprite
    this.container.querySelector('#btn-save-painter-sprite')?.addEventListener('click', () => {
      const name = this.container.querySelector('#painter-sprite-name').value || 'Sprite';
      const sprite = {
        id: this.spriteId,
        name: name.trim(),
        size: this.gridSize,
        pixels: [...this.pixels],
        primaryColor: this.pixels.find(c => c !== 'transparent') || '#58a6ff'
      };
      if (this.onSaveSprite) this.onSaveSprite(sprite);
      this.close();
    });
  }

  initCanvasEvents() {
    const handleDraw = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      const x = Math.floor(((clientX - rect.left) / rect.width) * this.gridSize);
      const y = Math.floor(((clientY - rect.top) / rect.height) * this.gridSize);

      if (x >= 0 && x < this.gridSize && y >= 0 && y < this.gridSize) {
        if (this.currentTool === 'fill') {
          this.floodFill(x, y, this.currentColor);
        } else {
          const color = this.currentTool === 'eraser' ? 'transparent' : this.currentColor;
          this.pixels[y * this.gridSize + x] = color;
        }
        this.redraw();
      }
    };

    this.canvas.addEventListener('mousedown', (e) => {
      this.isDrawing = true;
      handleDraw(e);
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDrawing) handleDraw(e);
    });

    window.addEventListener('mouseup', () => {
      this.isDrawing = false;
    });
  }

  floodFill(startX, startY, targetColor) {
    const startColor = this.pixels[startY * this.gridSize + startX];
    if (startColor === targetColor) return;

    const queue = [[startX, startY]];
    const visited = new Set();

    while (queue.length > 0) {
      const [x, y] = queue.pop();
      const key = `${x},${y}`;
      if (visited.has(key)) continue;
      visited.add(key);

      if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) continue;
      if (this.pixels[y * this.gridSize + x] !== startColor) continue;

      this.pixels[y * this.gridSize + x] = targetColor;

      queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
  }

  redraw() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const pSize = w / this.gridSize;

    // Checkerboard background for transparency
    ctx.clearRect(0, 0, w, h);
    for (let r = 0; r < this.gridSize; r++) {
      for (let c = 0; c < this.gridSize; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? '#161b22' : '#21262d';
        ctx.fillRect(c * pSize, r * pSize, pSize, pSize);

        const pixelColor = this.pixels[r * this.gridSize + c];
        if (pixelColor && pixelColor !== 'transparent') {
          ctx.fillStyle = pixelColor;
          ctx.fillRect(c * pSize, r * pSize, pSize, pSize);
        }
      }
    }

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= this.gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * pSize, 0);
      ctx.lineTo(i * pSize, h);
      ctx.moveTo(0, i * pSize);
      ctx.lineTo(w, i * pSize);
      ctx.stroke();
    }

    // Redraw preview
    if (this.previewCtx) {
      const pw = this.previewCanvas.width;
      const ph = this.previewCanvas.height;
      const prevPixel = pw / this.gridSize;
      this.previewCtx.clearRect(0, 0, pw, ph);

      for (let r = 0; r < this.gridSize; r++) {
        for (let c = 0; c < this.gridSize; c++) {
          const col = this.pixels[r * this.gridSize + c];
          if (col && col !== 'transparent') {
            this.previewCtx.fillStyle = col;
            this.previewCtx.fillRect(c * prevPixel, r * prevPixel, prevPixel + 0.5, prevPixel + 0.5);
          }
        }
      }
    }
  }
}
