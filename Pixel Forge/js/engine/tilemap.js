/**
 * PixelForge - Tilemap Editor Engine
 * Slices sprite art into tilesets, paints tilemap grids, and exports tile matrices.
 */

export class TilemapEngine {
  constructor(app) {
    this.app = app;
    this.tileSize = 16;
    this.mapCols = 20;
    this.mapRows = 15;
    this.selectedTileIndex = 0;
    this.tiles = [];
    this.tilemapData = new Array(this.mapCols * this.mapRows).fill(-1); // -1 = Empty
  }

  sliceTilesFromProject(tileSize = 16) {
    this.tileSize = tileSize;
    this.tiles = [];
    const project = this.app.project;
    if (!project || !project.frames) return;

    const currentFrame = project.frames[this.app.activeFrameIndex || 0];
    if (!currentFrame) return;

    const pw = project.width;
    const ph = project.height;
    const cols = Math.max(1, Math.floor(pw / tileSize));
    const rows = Math.max(1, Math.floor(ph / tileSize));

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tilePixels = new Array(tileSize * tileSize).fill('transparent');
        for (let ty = 0; ty < tileSize; ty++) {
          for (let tx = 0; tx < tileSize; tx++) {
            const srcX = c * tileSize + tx;
            const srcY = r * tileSize + ty;

            if (srcX < pw && srcY < ph) {
              for (const layer of currentFrame.layers) {
                if (layer.visible === false || !layer.pixels) continue;
                const color = layer.pixels[srcY * pw + srcX];
                if (color && color !== 'transparent') {
                  tilePixels[ty * tileSize + tx] = color;
                }
              }
            }
          }
        }
        this.tiles.push({
          id: this.tiles.length,
          col: c,
          row: r,
          pixels: tilePixels
        });
      }
    }

    if (this.selectedTileIndex >= this.tiles.length) {
      this.selectedTileIndex = 0;
    }
  }

  resizeMap(cols, rows) {
    const oldCols = this.mapCols;
    const oldRows = this.mapRows;
    const oldData = this.tilemapData;

    this.mapCols = cols;
    this.mapRows = rows;
    this.tilemapData = new Array(cols * rows).fill(-1);

    for (let r = 0; r < Math.min(oldRows, rows); r++) {
      for (let c = 0; c < Math.min(oldCols, cols); c++) {
        this.tilemapData[r * cols + c] = oldData[r * oldCols + c];
      }
    }
  }

  setTileAt(col, row, tileIndex) {
    if (col >= 0 && col < this.mapCols && row >= 0 && row < this.mapRows) {
      this.tilemapData[row * this.mapCols + col] = tileIndex;
    }
  }

  getTileAt(col, row) {
    if (col >= 0 && col < this.mapCols && row >= 0 && row < this.mapRows) {
      return this.tilemapData[row * this.mapCols + col];
    }
    return -1;
  }

  clearMap() {
    this.tilemapData.fill(-1);
  }

  fillMap(tileIndex) {
    this.tilemapData.fill(tileIndex);
  }

  renderTileToCanvas(tile, scale = 2) {
    const canvas = document.createElement('canvas');
    canvas.width = this.tileSize * scale;
    canvas.height = this.tileSize * scale;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Checkerboard
    for (let y = 0; y < this.tileSize; y++) {
      for (let x = 0; x < this.tileSize; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? '#181b24' : '#222634';
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    }

    if (tile && tile.pixels) {
      for (let ty = 0; ty < this.tileSize; ty++) {
        for (let tx = 0; tx < this.tileSize; tx++) {
          const color = tile.pixels[ty * this.tileSize + tx];
          if (color && color !== 'transparent') {
            ctx.fillStyle = color;
            ctx.fillRect(tx * scale, ty * scale, scale, scale);
          }
        }
      }
    }

    return canvas;
  }

  renderTilemapToCanvas(scale = 2) {
    const canvas = document.createElement('canvas');
    canvas.width = this.mapCols * this.tileSize * scale;
    canvas.height = this.mapRows * this.tileSize * scale;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    for (let r = 0; r < this.mapRows; r++) {
      for (let c = 0; c < this.mapCols; c++) {
        const tileIdx = this.tilemapData[r * this.mapCols + c];
        if (tileIdx >= 0 && this.tiles[tileIdx]) {
          const tile = this.tiles[tileIdx];
          for (let ty = 0; ty < this.tileSize; ty++) {
            for (let tx = 0; tx < this.tileSize; tx++) {
              const color = tile.pixels[ty * this.tileSize + tx];
              if (color && color !== 'transparent') {
                ctx.fillStyle = color;
                ctx.fillRect((c * this.tileSize + tx) * scale, (r * this.tileSize + ty) * scale, scale, scale);
              }
            }
          }
        }
      }
    }

    return canvas;
  }

  exportTilemapJSON() {
    return JSON.stringify({
      app: 'PixelForge Tilemap Engine',
      version: '1.0',
      tileSize: this.tileSize,
      cols: this.mapCols,
      rows: this.mapRows,
      totalTiles: this.tiles.length,
      data: [...this.tilemapData]
    }, null, 2);
  }
}
