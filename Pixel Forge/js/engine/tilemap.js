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
    const currentFrame = project.frames[this.app.activeFrameIndex || 0];
    if (!currentFrame) return;

    const pw = project.width;
    const ph = project.height;
    const cols = Math.floor(pw / tileSize);
    const rows = Math.floor(ph / tileSize);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tilePixels = new Array(tileSize * tileSize).fill('transparent');
        for (let ty = 0; ty < tileSize; ty++) {
          for (let tx = 0; tx < tileSize; tx++) {
            const srcX = c * tileSize + tx;
            const srcY = r * tileSize + ty;

            // Merge layers for this pixel
            for (const layer of currentFrame.layers) {
              if (layer.visible === false) continue;
              const color = layer.pixels[srcY * pw + srcX];
              if (color && color !== 'transparent') {
                tilePixels[ty * tileSize + tx] = color;
              }
            }
          }
        }
        this.tiles.push({ id: this.tiles.length, pixels: tilePixels });
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
      tileSize: this.tileSize,
      cols: this.mapCols,
      rows: this.mapRows,
      data: [...this.tilemapData]
    }, null, 2);
  }
}
