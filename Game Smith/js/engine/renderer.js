/**
 * GameSmith - Canvas 2D Renderer & Particle System
 * High-performance 2D renderer for both editor viewport and play mode runtime.
 */

export class GameRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = { x: 0, y: 0, zoom: 1 };
    this.particles = [];
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  clear(bgColor = '#0d1117') {
    this.ctx.fillStyle = bgColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // --- Editor Grid ---
  drawGrid(gridSize = 32, zoom = 1, panX = 0, panY = 0) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    const scaledGrid = gridSize * zoom;
    const startX = (panX % scaledGrid);
    const startY = (panY % scaledGrid);

    ctx.beginPath();
    for (let x = startX; x < w; x += scaledGrid) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = startY; y < h; y += scaledGrid) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();

    // Origin crosshair
    ctx.strokeStyle = 'rgba(88, 166, 255, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(panX, 0);
    ctx.lineTo(panX, h);
    ctx.moveTo(0, panY);
    ctx.lineTo(w, panY);
    ctx.stroke();

    ctx.restore();
  }

  // --- Scene World Bounds ---
  drawWorldBounds(bounds = { width: 1280, height: 720 }, camera) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 2 / camera.zoom;
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(0, 0, bounds.width, bounds.height);
    ctx.restore();
  }

  // --- Render Single Object ---
  renderObject(obj, isSelected = false, showColliders = false, spriteLibrary = {}) {
    if (obj.visible === false) return;

    const ctx = this.ctx;
    ctx.save();
    ctx.translate(obj.x + obj.width / 2, obj.y + obj.height / 2);
    if (obj.rotation) {
      ctx.rotate((obj.rotation * Math.PI) / 180);
    }
    if (obj.opacity !== undefined) {
      ctx.globalAlpha = obj.opacity;
    }

    const halfW = obj.width / 2;
    const halfH = obj.height / 2;

    // 1. Draw Sprite or Geometry
    if (obj.spriteId && spriteLibrary[obj.spriteId]) {
      this.drawPixelSprite(spriteLibrary[obj.spriteId], -halfW, -halfH, obj.width, obj.height, obj.flipX);
    } else {
      this.drawDefaultShape(obj, -halfW, -halfH, obj.width, obj.height);
    }

    // 2. Collider Wireframe (in editor or debug mode)
    if (showColliders && obj.hasCollider) {
      ctx.strokeStyle = obj.isSolid ? '#3fb950' : '#d29922';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      if (obj.colliderShape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, Math.min(halfW, halfH), 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.strokeRect(-halfW, -halfH, obj.width, obj.height);
      }
    }

    // 3. Selection Bounding Box & Handles (Editor Only)
    if (isSelected) {
      ctx.strokeStyle = '#58a6ff';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.strokeRect(-halfW - 2, -halfH - 2, obj.width + 4, obj.height + 4);

      // Corner handles
      const hSize = 6;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-halfW - 2 - hSize / 2, -halfH - 2 - hSize / 2, hSize, hSize);
      ctx.fillRect(halfW + 2 - hSize / 2, -halfH - 2 - hSize / 2, hSize, hSize);
      ctx.fillRect(halfW + 2 - hSize / 2, halfH + 2 - hSize / 2, hSize, hSize);
      ctx.fillRect(-halfW - 2 - hSize / 2, halfH + 2 - hSize / 2, hSize, hSize);
    }

    ctx.restore();
  }

  drawDefaultShape(obj, x, y, w, h) {
    const ctx = this.ctx;
    ctx.fillStyle = obj.color || '#58a6ff';

    switch (obj.shape || obj.drawMode) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'spike':
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.lineTo(x + w / 2, y);
        ctx.lineTo(x + w, y + h);
        ctx.closePath();
        ctx.fill();
        break;

      case 'coin':
        ctx.fillStyle = '#f1e05a';
        ctx.beginPath();
        ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#d29922';
        ctx.lineWidth = 2;
        ctx.stroke();
        break;

      case 'text':
        ctx.font = `${obj.fontSize || 16}px 'JetBrains Mono', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(obj.text || obj.name, x + w / 2, y + h / 2);
        break;

      case 'platform':
      case 'rect':
      default:
        // Rounded rectangle
        const r = Math.min(4, w / 4, h / 4);
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, [r]);
        ctx.fill();
        break;
    }
  }

  // --- Pixel Art Sprite Renderer ---
  drawPixelSprite(spriteData, x, y, w, h, flipX = false) {
    if (!spriteData || !spriteData.pixels) return;
    const ctx = this.ctx;
    const gridDim = spriteData.size || 16;
    const pixelW = w / gridDim;
    const pixelH = h / gridDim;

    ctx.save();
    if (flipX) {
      ctx.scale(-1, 1);
      x = -x - w;
    }

    for (let row = 0; row < gridDim; row++) {
      for (let col = 0; col < gridDim; col++) {
        const color = spriteData.pixels[row * gridDim + col];
        if (color && color !== 'transparent') {
          ctx.fillStyle = color;
          ctx.fillRect(x + col * pixelW, y + row * pixelH, pixelW + 0.5, pixelH + 0.5);
        }
      }
    }
    ctx.restore();
  }

  // --- Particle System ---
  spawnParticles(x, y, color = '#f85149', count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 160;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.4 + Math.random() * 0.3,
        maxLife: 0.6,
        color,
        size: 3 + Math.random() * 4
      });
    }
  }

  updateAndDrawParticles(dt) {
    const ctx = this.ctx;
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // --- Play Mode HUD Overlay ---
  drawHUD(variables = {}, message = '', bounds = { width: 1280, height: 720 }) {
    const ctx = this.ctx;
    ctx.save();

    // Top Bar HUD
    ctx.fillStyle = 'rgba(22, 27, 34, 0.85)';
    ctx.fillRect(16, 16, 260, 48);
    ctx.strokeStyle = '#30363d';
    ctx.lineWidth = 1;
    ctx.strokeRect(16, 16, 260, 48);

    ctx.font = "bold 13px 'JetBrains Mono', monospace";
    ctx.fillStyle = '#f0f6fc';

    let varText = '';
    if (variables.score !== undefined) varText += `Score: ${variables.score}  `;
    if (variables.lives !== undefined) varText += `Lives: ${variables.lives}  `;
    if (variables.coins !== undefined) varText += `Coins: ${variables.coins}  `;

    if (!varText) {
      varText = Object.entries(variables).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join('  ');
    }

    ctx.fillText(varText || 'Game Running', 30, 45);

    // On-screen message banner
    if (message) {
      const msgWidth = Math.min(500, this.canvas.width - 40);
      const msgX = (this.canvas.width - msgWidth) / 2;
      const msgY = this.canvas.height / 3;

      ctx.fillStyle = 'rgba(13, 17, 23, 0.95)';
      ctx.strokeStyle = '#58a6ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(msgX, msgY, msgWidth, 70, [8]);
      ctx.fill();
      ctx.stroke();

      ctx.font = "bold 20px 'Inter', sans-serif";
      ctx.fillStyle = '#f0f6fc';
      ctx.textAlign = 'center';
      ctx.fillText(message, msgX + msgWidth / 2, msgY + 42);
    }

    ctx.restore();
  }
}
