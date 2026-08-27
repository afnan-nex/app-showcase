/**
 * GameSmith - Built-In Pixel Art Sprite Studio
 * Full-featured 16x16 / 24x24 / 32x32 pixel editor with tools, palette, undo/redo, and live previews.
 */

import { getIcon, escapeHTML } from '../core/icons.js';

const PALETTE = [
  '#000000', '#ffffff', '#58a6ff', '#3fb950', '#f85149', '#d29922',
  '#a371f7', '#f0883e', '#1f6feb', '#238636', '#da3633', '#9e6a03',
  '#8b949e', '#30363d', '#ff7b72', '#79c0ff', '#56d364', '#e3b341',
  '#d2a8ff', '#ffab70', '#ffa198', '#161b22', '#0d1117', '#484f58'
];

export class SpritePainterModal {
  constructor(modalContainer, onSaveSprite) {
    this.container = modalContainer;
    this.onSaveSprite = onSaveSprite;
    this.gridSize = 16;
    this.pixels = new Array(this.gridSize * this.gridSize).fill('transparent');
    this.currentColor = '#58a6ff';
    this.currentTool = 'pencil'; // pencil, eraser, fill, picker
    this.isDrawing = false;

    this.undoStack = [];
    this.redoStack = [];
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

    this.undoStack = [];
    this.redoStack = [];
    this.saveStateToUndo();

    this.render();
    this.container.classList.add('active');
  }

  close() {
    this.container.classList.remove('active');
  }

  saveStateToUndo() {
    this.undoStack.push([...this.pixels]);
    if (this.undoStack.length > 30) this.undoStack.shift();
    this.redoStack = [];
  }

  undo() {
    if (this.undoStack.length > 1) {
      this.redoStack.push(this.undoStack.pop());
      this.pixels = [...this.undoStack[this.undoStack.length - 1]];
      this.redraw();
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const state = this.redoStack.pop();
      this.undoStack.push([...state]);
      this.pixels = [...state];
      this.redraw();
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-dialog sprite-painter-dialog" role="dialog" aria-modal="true" aria-labelledby="sprite-modal-title">
        <div class="modal-header">
          <div class="flex items-center gap-2">
            ${getIcon('paint', 'icon-sm text-primary')}
            <span class="font-bold text-sm" id="sprite-modal-title">Pixel Art Sprite Studio</span>
          </div>
          <button class="btn-icon-xs btn-modal-close" aria-label="Close dialog">&times;</button>
        </div>

        <div class="modal-body p-4 flex gap-4">
          
          <!-- Drawing Canvas -->
          <div class="painter-canvas-container flex flex-col items-center">
            <canvas id="painter-canvas" width="288" height="288" class="painter-canvas cursor-crosshair"></canvas>
            
            <div class="flex gap-2 mt-3 items-center w-full justify-between">
              <div class="flex items-center gap-1">
                <span class="text-xs text-muted">Grid:</span>
                <button class="btn btn-xs ${this.gridSize === 16 ? 'btn-primary' : 'btn-secondary'} btn-set-grid" data-size="16">16x16</button>
                <button class="btn btn-xs ${this.gridSize === 24 ? 'btn-primary' : 'btn-secondary'} btn-set-grid" data-size="24">24x24</button>
                <button class="btn btn-xs ${this.gridSize === 32 ? 'btn-primary' : 'btn-secondary'} btn-set-grid" data-size="32">32x32</button>
              </div>

              <div class="flex items-center gap-1">
                <button class="btn btn-xs btn-secondary btn-painter-undo" title="Undo (Ctrl+Z)">${getIcon('undo', 'icon-xs')}</button>
                <button class="btn btn-xs btn-secondary btn-painter-redo" title="Redo (Ctrl+Y)">${getIcon('redo', 'icon-xs')}</button>
                <button class="btn btn-xs btn-ghost text-rose btn-clear-canvas" title="Clear Canvas">${getIcon('trash', 'icon-xs')}</button>
              </div>
            </div>
          </div>

          <!-- Tools & Palette Sidebar -->
          <div class="painter-tools-sidebar flex-1 flex flex-col justify-between">
            <div>
              <div class="form-group mb-3">
                <label class="form-label text-xs font-semibold" for="painter-sprite-name">Sprite Identifier Name</label>
                <input type="text" id="painter-sprite-name" class="form-control form-control-sm" value="${escapeHTML(this.spriteName)}" />
              </div>

              <div class="tool-picker-row flex gap-1 mb-3">
                <button class="btn btn-sm flex-1 ${this.currentTool === 'pencil' ? 'btn-primary' : 'btn-secondary'} btn-tool-select" data-tool="pencil" title="Pencil Tool">
                  Pencil
                </button>
                <button class="btn btn-sm flex-1 ${this.currentTool === 'eraser' ? 'btn-primary' : 'btn-secondary'} btn-tool-select" data-tool="eraser" title="Eraser Tool">
                  Eraser
                </button>
                <button class="btn btn-sm flex-1 ${this.currentTool === 'fill' ? 'btn-primary' : 'btn-secondary'} btn-tool-select" data-tool="fill" title="Fill Bucket">
                  Bucket
                </button>
                <button class="btn btn-sm flex-1 ${this.currentTool === 'picker' ? 'btn-primary' : 'btn-secondary'} btn-tool-select" data-tool="picker" title="Color Picker">
                  Picker
                </button>
              </div>

              <div class="palette-swatches-grid mb-3">
                ${PALETTE.map(c => `
                  <div class="swatch-btn ${this.currentColor === c ? 'selected' : ''}" style="background-color: ${c};" data-color="${c}" title="${c}"></div>
                `).join('')}
              </div>

              <div class="flex items-center gap-2 mb-3">
                <label class="text-xs text-muted" for="painter-color-picker">Custom Color:</label>
                <input type="color" id="painter-color-picker" class="form-control form-control-sm p-0 w-8 h-7 cursor-pointer" value="${this.currentColor}" />
                <input type="text" id="painter-color-hex" class="form-control form-control-sm font-mono w-24" value="${this.currentColor}" />
              </div>

              <div class="flex gap-2 mb-3">
                <button class="btn btn-xs btn-secondary flex-1 btn-mirror-h" title="Mirror Horizontally">Mirror X</button>
                <button class="btn btn-xs btn-secondary flex-1 btn-export-png" title="Download Sprite as PNG">Export PNG</button>
              </div>
            </div>

            <!-- Preview Card -->
            <div class="card p-3 flex items-center justify-between">
              <div class="flex flex-col">
                <span class="text-xs font-semibold text-primary">Live Preview</span>
                <span class="text-xs text-muted">1x, 2x, 4x Scale</span>
              </div>
              <div class="flex items-center gap-3">
                <canvas id="painter-preview" width="32" height="32" style="background: #0d1117; border-radius: 4px; border: 1px solid var(--border-subtle);"></canvas>
                <canvas id="painter-preview-lg" width="48" height="48" style="background: #0d1117; border-radius: 4px; border: 1px solid var(--border-subtle);"></canvas>
              </div>
            </div>
          </div>

        </div>

        <div class="modal-footer p-3 border-t flex justify-end gap-2">
          <button class="btn btn-sm btn-secondary btn-modal-close">Cancel</button>
          <button class="btn btn-sm btn-primary" id="btn-save-painter-sprite">Save Sprite to Project</button>
        </div>
      </div>
    `;

    this.canvas = this.container.querySelector('#painter-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.previewCanvas = this.container.querySelector('#painter-preview');
    this.previewCtx = this.previewCanvas.getContext('2d');
    this.previewLgCanvas = this.container.querySelector('#painter-preview-lg');
    this.previewLgCtx = this.previewLgCanvas.getContext('2d');

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
        this.container.querySelectorAll('.btn-tool-select').forEach(x => x.className = 'btn btn-sm flex-1 btn-secondary btn-tool-select');
        b.className = 'btn btn-sm flex-1 btn-primary btn-tool-select';
      });
    });

    // Swatches
    this.container.querySelectorAll('.swatch-btn').forEach(b => {
      b.addEventListener('click', () => {
        this.currentColor = b.dataset.color;
        this.container.querySelectorAll('.swatch-btn').forEach(x => x.classList.remove('selected'));
        b.classList.add('selected');
        this.container.querySelector('#painter-color-picker').value = this.currentColor;
        this.container.querySelector('#painter-color-hex').value = this.currentColor;
      });
    });

    // Custom Color picker
    const picker = this.container.querySelector('#painter-color-picker');
    const hexInput = this.container.querySelector('#painter-color-hex');
    picker?.addEventListener('input', (e) => {
      this.currentColor = e.target.value;
      if (hexInput) hexInput.value = e.target.value;
    });
    hexInput?.addEventListener('input', (e) => {
      this.currentColor = e.target.value;
      if (picker) picker.value = e.target.value;
    });

    // Undo & Redo
    this.container.querySelector('.btn-painter-undo')?.addEventListener('click', () => this.undo());
    this.container.querySelector('.btn-painter-redo')?.addEventListener('click', () => this.redo());

    // Grid size switch
    this.container.querySelectorAll('.btn-set-grid').forEach(b => {
      b.addEventListener('click', () => {
        const size = parseInt(b.dataset.size, 10);
        if (size !== this.gridSize) {
          this.gridSize = size;
          this.pixels = new Array(size * size).fill('transparent');
          this.saveStateToUndo();
          this.render();
        }
      });
    });

    // Mirror Horizontal
    this.container.querySelector('.btn-mirror-h')?.addEventListener('click', () => {
      const newPixels = new Array(this.gridSize * this.gridSize);
      for (let r = 0; r < this.gridSize; r++) {
        for (let c = 0; c < this.gridSize; c++) {
          newPixels[r * this.gridSize + (this.gridSize - 1 - c)] = this.pixels[r * this.gridSize + c];
        }
      }
      this.pixels = newPixels;
      this.saveStateToUndo();
      this.redraw();
    });

    // Export PNG
    this.container.querySelector('.btn-export-png')?.addEventListener('click', () => {
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = this.gridSize * 16;
      exportCanvas.height = this.gridSize * 16;
      const expCtx = exportCanvas.getContext('2d');
      expCtx.imageSmoothingEnabled = false;

      const pSize = 16;
      for (let r = 0; r < this.gridSize; r++) {
        for (let c = 0; c < this.gridSize; c++) {
          const col = this.pixels[r * this.gridSize + c];
          if (col && col !== 'transparent') {
            expCtx.fillStyle = col;
            expCtx.fillRect(c * pSize, r * pSize, pSize, pSize);
          }
        }
      }

      const a = document.createElement('a');
      a.href = exportCanvas.toDataURL('image/png');
      a.download = (this.container.querySelector('#painter-sprite-name').value || 'sprite').toLowerCase().replace(/\s+/g, '_') + '.png';
      a.click();
    });

    // Clear
    this.container.querySelector('.btn-clear-canvas')?.addEventListener('click', () => {
      this.pixels.fill('transparent');
      this.saveStateToUndo();
      this.redraw();
    });

    // Save Sprite
    this.container.querySelector('#btn-save-painter-sprite')?.addEventListener('click', () => {
      const name = this.container.querySelector('#painter-sprite-name').value || 'Sprite';
      const primaryCol = this.pixels.find(c => c && c !== 'transparent') || '#58a6ff';
      const sprite = {
        id: this.spriteId,
        name: name.trim(),
        size: this.gridSize,
        pixels: [...this.pixels],
        primaryColor: primaryCol
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
        if (this.currentTool === 'picker') {
          const picked = this.pixels[y * this.gridSize + x];
          if (picked && picked !== 'transparent') {
            this.currentColor = picked;
            const p = this.container.querySelector('#painter-color-picker');
            const h = this.container.querySelector('#painter-color-hex');
            if (p) p.value = picked;
            if (h) h.value = picked;
          }
          return;
        }

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
      if (this.isDrawing) {
        this.isDrawing = false;
        this.saveStateToUndo();
      }
    });

    // Touch events
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.isDrawing = true;
      handleDraw(e);
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (this.isDrawing) handleDraw(e);
    }, { passive: false });

    this.canvas.addEventListener('touchend', () => {
      if (this.isDrawing) {
        this.isDrawing = false;
        this.saveStateToUndo();
      }
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

    // Redraw previews
    const renderToPreview = (pCtx, pCanvas) => {
      if (!pCtx || !pCanvas) return;
      const pw = pCanvas.width;
      const ph = pCanvas.height;
      const prevPixel = pw / this.gridSize;
      pCtx.clearRect(0, 0, pw, ph);

      for (let r = 0; r < this.gridSize; r++) {
        for (let c = 0; c < this.gridSize; c++) {
          const col = this.pixels[r * this.gridSize + c];
          if (col && col !== 'transparent') {
            pCtx.fillStyle = col;
            pCtx.fillRect(c * prevPixel, r * prevPixel, prevPixel + 0.5, prevPixel + 0.5);
          }
        }
      }
    };

    renderToPreview(this.previewCtx, this.previewCanvas);
    renderToPreview(this.previewLgCtx, this.previewLgCanvas);
  }
}
