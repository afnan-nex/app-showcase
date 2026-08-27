/**
 * PixelForge - High-Performance Canvas 2D Pixel Renderer
 * Renders pixel-accurate grid, multi-layer compositing, onion skinning, symmetry lines, and selection marquees.
 */

export class CanvasRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = { x: 0, y: 0, zoom: 16 }; // Default 16x pixel zoom

    // Disable image smoothing for ultra-crisp pixel art
    this.ctx.imageSmoothingEnabled = false;
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.imageSmoothingEnabled = false;
  }

  render({
    project,
    activeFrameIndex = 0,
    activeLayerId = null,
    showGrid = true,
    showOnionSkin = false,
    symmetryMode = 'none', // none, horizontal, vertical, both
    activePreviewPixels = [],
    selection = null,
    cursorPos = null,
    brushSize = 1
  }) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const pw = project.width || 32;
    const ph = project.height || 32;
    const zoom = this.camera.zoom;

    // 1. Clear Viewport
    ctx.fillStyle = '#0f1117';
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    // 2. Camera Transform (Pan & Zoom)
    ctx.translate(this.camera.x, this.camera.y);
    ctx.scale(zoom, zoom);

    // 3. Canvas Bounds Shadow & Border
    ctx.fillStyle = '#181b24';
    ctx.fillRect(0, 0, pw, ph);

    // 4. Checkerboard Transparency Pattern
    this.drawCheckerboard(pw, ph);

    // 5. Onion Skinning (Previous Frame in Cyan / Next in Red)
    if (showOnionSkin && project.frames && project.frames.length > 1) {
      this.drawOnionSkin(project, activeFrameIndex);
    }

    // 6. Composite Active Frame Layers
    const currentFrame = project.frames ? project.frames[activeFrameIndex] : null;
    if (currentFrame) {
      const layers = currentFrame.layers || [];
      for (const layer of layers) {
        if (layer.visible === false) continue;
        this.renderLayer(layer, pw, ph);
      }
    }

    // 7. Active Tool Drawing Preview
    if (activePreviewPixels && activePreviewPixels.length > 0) {
      for (const p of activePreviewPixels) {
        if (p.x >= 0 && p.x < pw && p.y >= 0 && p.y < ph) {
          ctx.fillStyle = p.color || '#ffffff';
          ctx.fillRect(p.x, p.y, 1, 1);
        }
      }
    }

    // 8. Selection Marquee
    if (selection) {
      this.drawSelectionMarquee(selection);
    }

    // 9. Symmetry Mirror Guidelines
    if (symmetryMode !== 'none') {
      this.drawSymmetryLines(pw, ph, symmetryMode, zoom);
    }

    // 10. Pixel Grid Overlay (when zoom >= 6x)
    if (showGrid && zoom >= 6) {
      this.drawPixelGrid(pw, ph, zoom);
    }

    // 11. Cursor Hover Indicator
    if (cursorPos && cursorPos.x >= 0 && cursorPos.x < pw && cursorPos.y >= 0 && cursorPos.y < ph) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1 / zoom;
      const offset = Math.floor(brushSize / 2);
      ctx.strokeRect(cursorPos.x - offset, cursorPos.y - offset, brushSize, brushSize);
    }

    ctx.restore();
  }

  // --- Checkerboard Transparency ---
  drawCheckerboard(pw, ph) {
    const ctx = this.ctx;
    for (let y = 0; y < ph; y++) {
      for (let x = 0; x < pw; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? '#1e2330' : '#282e3f';
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  // --- Single Layer Renderer ---
  renderLayer(layer, pw, ph) {
    if (!layer.pixels) return;
    const ctx = this.ctx;
    ctx.save();
    if (layer.opacity !== undefined) {
      ctx.globalAlpha = layer.opacity;
    }

    const pixels = layer.pixels;
    for (let y = 0; y < ph; y++) {
      for (let x = 0; x < pw; x++) {
        const color = pixels[y * pw + x];
        if (color && color !== 'transparent') {
          ctx.fillStyle = color;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
    ctx.restore();
  }

  // --- Onion Skinning ---
  drawOnionSkin(project, activeIndex) {
    const ctx = this.ctx;
    const pw = project.width;
    const ph = project.height;

    // Previous Frame
    if (activeIndex > 0) {
      const prevFrame = project.frames[activeIndex - 1];
      ctx.save();
      ctx.globalAlpha = 0.25;
      for (const l of prevFrame.layers) {
        if (l.visible === false) continue;
        for (let y = 0; y < ph; y++) {
          for (let x = 0; x < pw; x++) {
            const col = l.pixels[y * pw + x];
            if (col && col !== 'transparent') {
              ctx.fillStyle = '#00e5ff'; // Cyan tint for past frame
              ctx.fillRect(x, y, 1, 1);
            }
          }
        }
      }
      ctx.restore();
    }

    // Next Frame
    if (activeIndex < project.frames.length - 1) {
      const nextFrame = project.frames[activeIndex + 1];
      ctx.save();
      ctx.globalAlpha = 0.25;
      for (const l of nextFrame.layers) {
        if (l.visible === false) continue;
        for (let y = 0; y < ph; y++) {
          for (let x = 0; x < pw; x++) {
            const col = l.pixels[y * pw + x];
            if (col && col !== 'transparent') {
              ctx.fillStyle = '#ff1744'; // Red tint for future frame
              ctx.fillRect(x, y, 1, 1);
            }
          }
        }
      }
      ctx.restore();
    }
  }

  // --- Pixel Grid ---
  drawPixelGrid(pw, ph, zoom) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1 / zoom;

    ctx.beginPath();
    for (let x = 0; x <= pw; x++) {
      ctx.moveTo(x, 0); ctx.lineTo(x, ph);
    }
    for (let y = 0; y <= ph; y++) {
      ctx.moveTo(0, y); ctx.lineTo(pw, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  // --- Symmetry Guidelines ---
  drawSymmetryLines(pw, ph, mode, zoom) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 1.5 / zoom;
    ctx.setLineDash([2 / zoom, 2 / zoom]);

    if (mode === 'vertical' || mode === 'both') {
      const midX = pw / 2;
      ctx.beginPath();
      ctx.moveTo(midX, 0); ctx.lineTo(midX, ph);
      ctx.stroke();
    }
    if (mode === 'horizontal' || mode === 'both') {
      const midY = ph / 2;
      ctx.beginPath();
      ctx.moveTo(0, midY); ctx.lineTo(pw, midY);
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- Selection Marquee ---
  drawSelectionMarquee(sel) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1 / this.camera.zoom;
    ctx.setLineDash([3 / this.camera.zoom, 3 / this.camera.zoom]);

    const x = Math.min(sel.x0, sel.x1);
    const y = Math.min(sel.y0, sel.y1);
    const w = Math.abs(sel.x1 - sel.x0) + 1;
    const h = Math.abs(sel.y1 - sel.y0) + 1;

    ctx.fillStyle = 'rgba(88, 166, 255, 0.2)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);
    ctx.restore();
  }
}
