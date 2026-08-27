/**
 * PixelForge - High-Performance Canvas 2D Pixel Art Renderer
 * Renders pixel-accurate grid, multi-layer compositing, blend modes, onion skinning,
 * symmetry lines, selection marquees, and floating paste previews.
 */

export class CanvasRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = { x: 0, y: 0, zoom: 16 }; // Default 16x pixel zoom
    this.ctx.imageSmoothingEnabled = false;
    this.marqueeOffset = 0;
  }

  resize(width, height) {
    if (!this.canvas) return;
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
    onionSkinOpacity = 0.3,
    symmetryMode = 'none', // none, horizontal, vertical, both
    activePreviewPixels = [],
    selection = null,
    floatingSelection = null,
    cursorPos = null,
    brushSize = 1,
    backgroundColor = 'transparent'
  }) {
    if (!this.ctx || !project) return;

    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const pw = project.width || 32;
    const ph = project.height || 32;
    const zoom = Math.max(1, this.camera.zoom);

    // 1. Clear Viewport background
    ctx.fillStyle = '#0a0c10';
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    // 2. Camera Transform (Pan & Zoom)
    ctx.translate(Math.round(this.camera.x), Math.round(this.camera.y));
    ctx.scale(zoom, zoom);

    // 3. Canvas Bounds Shadow & Border
    ctx.fillStyle = '#141722';
    ctx.fillRect(0, 0, pw, ph);

    // 4. Background Fill or Checkerboard Transparency Pattern
    if (backgroundColor && backgroundColor !== 'transparent') {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, pw, ph);
    } else {
      this.drawCheckerboard(pw, ph);
    }

    // 5. Onion Skinning (Previous Frame in Cyan / Next in Red)
    if (showOnionSkin && project.frames && project.frames.length > 1) {
      this.drawOnionSkin(project, activeFrameIndex, onionSkinOpacity);
    }

    // 6. Composite Active Frame Layers
    const currentFrame = project.frames ? project.frames[activeFrameIndex] : null;
    if (currentFrame && currentFrame.layers) {
      for (const layer of currentFrame.layers) {
        if (layer.visible === false) continue;
        this.renderLayer(layer, pw, ph);
      }
    }

    // 7. Floating Selection (Paste / Move preview)
    if (floatingSelection && floatingSelection.pixels) {
      this.renderFloatingSelection(floatingSelection, pw, ph);
    }

    // 8. Active Tool Drawing Preview
    if (activePreviewPixels && activePreviewPixels.length > 0) {
      for (const p of activePreviewPixels) {
        if (p.x >= 0 && p.x < pw && p.y >= 0 && p.y < ph) {
          ctx.fillStyle = p.color || '#58a6ff';
          ctx.fillRect(p.x, p.y, 1, 1);
        }
      }
    }

    // 9. Selection Marquee
    if (selection) {
      this.drawSelectionMarquee(selection, zoom);
    }

    // 10. Symmetry Mirror Guidelines
    if (symmetryMode !== 'none') {
      this.drawSymmetryLines(pw, ph, symmetryMode, zoom);
    }

    // 11. Pixel Grid Overlay (when zoom >= 6x)
    if (showGrid && zoom >= 5) {
      this.drawPixelGrid(pw, ph, zoom);
    }

    // 12. Cursor Hover Indicator (Brush Box)
    if (cursorPos && cursorPos.x >= 0 && cursorPos.x < pw && cursorPos.y >= 0 && cursorPos.y < ph) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1 / zoom;
      const offset = Math.floor(brushSize / 2);
      ctx.strokeRect(cursorPos.x - offset, cursorPos.y - offset, brushSize, brushSize);
      ctx.restore();
    }

    // 13. Canvas Outer Border
    ctx.save();
    ctx.strokeStyle = 'rgba(88, 166, 255, 0.5)';
    ctx.lineWidth = 1 / zoom;
    ctx.strokeRect(0, 0, pw, ph);
    ctx.restore();

    ctx.restore();
  }

  // --- Checkerboard Transparency ---
  drawCheckerboard(pw, ph) {
    const ctx = this.ctx;
    for (let y = 0; y < ph; y++) {
      for (let x = 0; x < pw; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? '#181c28' : '#23293a';
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  // --- Single Layer Renderer ---
  renderLayer(layer, pw, ph) {
    if (!layer || !layer.pixels) return;
    const ctx = this.ctx;
    ctx.save();

    if (layer.blendMode && layer.blendMode !== 'normal') {
      ctx.globalCompositeOperation = layer.blendMode;
    }
    if (layer.opacity !== undefined) {
      ctx.globalAlpha = Math.max(0, Math.min(1, layer.opacity));
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

  // --- Floating Selection Preview ---
  renderFloatingSelection(sel, pw, ph) {
    const ctx = this.ctx;
    ctx.save();
    const { x, y, width, height, pixels } = sel;
    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        const targetX = x + px;
        const targetY = y + py;
        if (targetX >= 0 && targetX < pw && targetY >= 0 && targetY < ph) {
          const col = pixels[py * width + px];
          if (col && col !== 'transparent') {
            ctx.fillStyle = col;
            ctx.fillRect(targetX, targetY, 1, 1);
          }
        }
      }
    }
    ctx.restore();
  }

  // --- Onion Skinning ---
  drawOnionSkin(project, activeIndex, opacity = 0.3) {
    const ctx = this.ctx;
    const pw = project.width;
    const ph = project.height;

    // Previous Frame (Cyan)
    if (activeIndex > 0) {
      const prevFrame = project.frames[activeIndex - 1];
      if (prevFrame && prevFrame.layers) {
        ctx.save();
        ctx.globalAlpha = opacity;
        for (const l of prevFrame.layers) {
          if (l.visible === false || !l.pixels) continue;
          for (let y = 0; y < ph; y++) {
            for (let x = 0; x < pw; x++) {
              const col = l.pixels[y * pw + x];
              if (col && col !== 'transparent') {
                ctx.fillStyle = '#00e5ff';
                ctx.fillRect(x, y, 1, 1);
              }
            }
          }
        }
        ctx.restore();
      }
    }

    // Next Frame (Red)
    if (activeIndex < project.frames.length - 1) {
      const nextFrame = project.frames[activeIndex + 1];
      if (nextFrame && nextFrame.layers) {
        ctx.save();
        ctx.globalAlpha = opacity;
        for (const l of nextFrame.layers) {
          if (l.visible === false || !l.pixels) continue;
          for (let y = 0; y < ph; y++) {
            for (let x = 0; x < pw; x++) {
              const col = l.pixels[y * pw + x];
              if (col && col !== 'transparent') {
                ctx.fillStyle = '#ff1744';
                ctx.fillRect(x, y, 1, 1);
              }
            }
          }
        }
        ctx.restore();
      }
    }
  }

  // --- Pixel Grid ---
  drawPixelGrid(pw, ph, zoom) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)';
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
    ctx.setLineDash([3 / zoom, 3 / zoom]);

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
  drawSelectionMarquee(sel, zoom) {
    const ctx = this.ctx;
    ctx.save();

    const minX = Math.min(sel.x0, sel.x1);
    const minY = Math.min(sel.y0, sel.y1);
    const w = Math.abs(sel.x1 - sel.x0) + 1;
    const h = Math.abs(sel.y1 - sel.y0) + 1;

    // Fill tinted selection
    ctx.fillStyle = 'rgba(88, 166, 255, 0.18)';
    ctx.fillRect(minX, minY, w, h);

    // Dashed border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1 / zoom;
    ctx.setLineDash([3 / zoom, 3 / zoom]);
    ctx.strokeRect(minX, minY, w, h);

    // Inner contrasting dash
    ctx.strokeStyle = '#000000';
    ctx.lineDashOffset = 3 / zoom;
    ctx.strokeRect(minX, minY, w, h);

    ctx.restore();
  }
}
