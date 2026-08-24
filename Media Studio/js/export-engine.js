/**
 * MediaStudio — Export Engine
 * Generates high-resolution PNG, JPEG, and WebP artwork, single layer exports, and clipboard copy.
 */

export class ExportEngine {
  constructor(app) {
    this.app = app;
  }

  /**
   * Render composition to an offscreen export canvas at custom scale
   */
  renderExportCanvas(options = {}) {
    const {
      scale = 1.0,
      scope = 'canvas', // 'canvas' or 'selection'
      format = 'png',
      quality = 0.92,
      preserveTransparency = true
    } = options;

    const exportCanvas = document.createElement('canvas');
    const ctx = exportCanvas.getContext('2d');

    if (scope === 'selection' && this.app.selectedLayer) {
      // Export single layer
      const layer = this.app.selectedLayer;
      exportCanvas.width = Math.round(layer.width * scale);
      exportCanvas.height = Math.round(layer.height * scale);

      ctx.save();
      ctx.scale(scale, scale);
      ctx.translate(layer.width / 2, layer.height / 2);
      layer.drawContent(ctx);
      ctx.restore();
    } else {
      // Export full canvas
      const width = Math.round(this.app.canvasEngine.width * scale);
      const height = Math.round(this.app.canvasEngine.height * scale);

      exportCanvas.width = width;
      exportCanvas.height = height;

      // Draw background if not transparent or if JPEG
      if (!preserveTransparency || format === 'jpeg' || (!this.app.canvasEngine.isTransparent && this.app.canvasEngine.backgroundColor)) {
        ctx.fillStyle = this.app.canvasEngine.backgroundColor || '#ffffff';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.save();
      ctx.scale(scale, scale);

      // Render layers
      for (const layer of this.app.layers) {
        if (layer.visible) {
          layer.render(ctx);
        }
      }

      ctx.restore();
    }

    return exportCanvas;
  }

  /**
   * Download exported image file
   */
  async downloadExport(options = {}) {
    const {
      filename = 'untitled',
      format = 'png', // 'png', 'jpeg', 'webp'
      quality = 0.92,
      scale = 1.0
    } = options;

    const canvas = this.renderExportCanvas(options);
    const mimeType = format === 'jpeg' ? 'image/jpeg' : (format === 'webp' ? 'image/webp' : 'image/png');

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const ext = format === 'jpeg' ? 'jpg' : format;
      a.href = url;
      a.download = `${filename}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, mimeType, quality);
  }

  /**
   * Copy exported image directly to clipboard
   */
  async copyToClipboard(options = {}) {
    const canvas = this.renderExportCanvas({ ...options, format: 'png', scale: options.scale || 1.0 });

    return new Promise((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          reject(new Error('Failed to generate image blob.'));
          return;
        }

        try {
          if (navigator.clipboard && navigator.clipboard.write) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            resolve(true);
          } else {
            reject(new Error('Clipboard API not supported.'));
          }
        } catch (err) {
          reject(err);
        }
      }, 'image/png');
    });
  }

  /**
   * Update modal preview canvas
   */
  updateModalPreview(previewCanvas, options = {}) {
    if (!previewCanvas) return;
    const canvas = this.renderExportCanvas(options);

    previewCanvas.width = canvas.width;
    previewCanvas.height = canvas.height;
    const ctx = previewCanvas.getContext('2d');
    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    ctx.drawImage(canvas, 0, 0);

    // Calculate approx file size
    const estKB = Math.round((canvas.width * canvas.height * 4 * (options.quality || 0.8)) / 1024 / 4);
    return {
      width: canvas.width,
      height: canvas.height,
      estimatedKB: Math.max(10, estKB)
    };
  }
}
