/**
 * GameSmith - Canvas 2D Renderer & Particle System
 * High-performance 2D renderer for both editor viewport and play mode runtime with High-DPI & Pixel Art support.
 */

export class GameRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = { x: 0, y: 0, zoom: 1, shakeX: 0, shakeY: 0 };
    this.particles = [];
  }

  resize(width, height) {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
    this.viewportWidth = width;
    this.viewportHeight = height;
  }

  clear(bgColor = '#0d1117') {
    const ctx = this.ctx;
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, this.viewportWidth || this.canvas.width, this.viewportHeight || this.canvas.height);
  }

  // --- Editor Grid ---
  drawGrid(gridSize = 32, zoom = 1, panX = 0, panY = 0) {
    const ctx = this.ctx;
    const w = this.viewportWidth || this.canvas.width;
    const h = this.viewportHeight || this.canvas.height;

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
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

    // Origin crosshair axes
    ctx.strokeStyle = 'rgba(88, 166, 255, 0.35)';
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
  drawWorldBounds(bounds = { width: 1600, height: 800 }, camera = { zoom: 1 }) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 2 / (camera.zoom || 1);
    ctx.setLineDash([8, 8]);
    ctx.strokeRect(0, 0, bounds.width, bounds.height);

    // Label at top left of world
    ctx.fillStyle = 'rgba(88, 166, 255, 0.6)';
    ctx.font = "bold 11px 'JetBrains Mono', monospace";
    ctx.fillText(`World Bounds: ${bounds.width} x ${bounds.height}px`, 8, -8);

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
      ctx.globalAlpha = Math.max(0, Math.min(1, obj.opacity));
    }

    const halfW = obj.width / 2;
    const halfH = obj.height / 2;

    // 1. Draw Sprite or Procedural Geometry
    if (obj.spriteId && spriteLibrary[obj.spriteId]) {
      this.drawPixelSprite(spriteLibrary[obj.spriteId], -halfW, -halfH, obj.width, obj.height, obj.flipX);
    } else {
      this.drawDefaultShape(obj, -halfW, -halfH, obj.width, obj.height);
    }

    // 2. Collider Wireframe (in editor or debug mode)
    if (showColliders && obj.hasCollider) {
      ctx.strokeStyle = obj.isSolid ? '#3fb950' : '#d29922';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      if (obj.colliderShape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, Math.min(halfW, halfH), 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.strokeRect(-halfW, -halfH, obj.width, obj.height);
      }
    }

    // 3. Selection Bounding Box & 8 Handles (Editor Only)
    if (isSelected) {
      ctx.strokeStyle = '#58a6ff';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.strokeRect(-halfW - 2, -halfH - 2, obj.width + 4, obj.height + 4);

      // Name & Dimensions Badge
      ctx.fillStyle = '#58a6ff';
      ctx.font = "bold 10px 'Inter', sans-serif";
      const labelText = `${obj.name} (${Math.round(obj.width)}x${Math.round(obj.height)})`;
      const textWidth = ctx.measureText(labelText).width;
      ctx.fillRect(-halfW - 2, -halfH - 18, textWidth + 8, 16);
      ctx.fillStyle = '#0d1117';
      ctx.fillText(labelText, -halfW + 2, -halfH - 6);

      // Corner & Edge Resize Handles
      const hSize = 6;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0d1117';
      ctx.lineWidth = 1;

      const handles = [
        [-halfW - 2, -halfH - 2],       // NW
        [0, -halfH - 2],                // N
        [halfW + 2, -halfH - 2],        // NE
        [halfW + 2, 0],                 // E
        [halfW + 2, halfH + 2],         // SE
        [0, halfH + 2],                 // S
        [-halfW - 2, halfH + 2],        // SW
        [-halfW - 2, 0]                 // W
      ];

      for (const [hx, hy] of handles) {
        ctx.fillRect(hx - hSize / 2, hy - hSize / 2, hSize, hSize);
        ctx.strokeRect(hx - hSize / 2, hy - hSize / 2, hSize, hSize);
      }
    }

    ctx.restore();
  }

  drawDefaultShape(obj, x, y, w, h) {
    const ctx = this.ctx;
    const baseColor = obj.color || '#58a6ff';
    ctx.fillStyle = baseColor;

    switch (obj.shape || obj.drawMode) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();
        break;

      case 'spike':
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.lineTo(x + w / 2, y);
        ctx.lineTo(x + w, y + h);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#f85149';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        break;

      case 'coin':
        ctx.fillStyle = '#f1e05a';
        ctx.beginPath();
        ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#d29922';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Inner coin star/cross
        ctx.fillStyle = '#d29922';
        ctx.beginPath();
        ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 4, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'heart':
        this.drawHeart(x, y, w, h, baseColor);
        break;

      case 'portal':
        // Swirling warp portal
        ctx.fillStyle = baseColor;
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();
        break;

      case 'text':
        ctx.font = `bold ${obj.fontSize || 16}px 'JetBrains Mono', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = baseColor;
        ctx.fillText(obj.text || obj.name, x + w / 2, y + h / 2);
        break;

      case 'platform':
        // Top cap + platform body
        ctx.fillStyle = baseColor;
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(x, y, w, Math.min(6, h / 3));
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, w, h);
        break;

      case 'rect':
      default:
        const r = Math.min(6, w / 4, h / 4);
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, [r]);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
        break;
    }
  }

  drawHeart(x, y, w, h, color) {
    const ctx = this.ctx;
    ctx.fillStyle = color || '#f85149';
    ctx.beginPath();
    const topCurveHeight = h * 0.3;
    ctx.moveTo(x + w / 2, y + h * 0.2);
    ctx.bezierCurveTo(x + w / 2, y, x, y, x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y + (h + topCurveHeight) / 2, x + w / 2, y + (h + topCurveHeight) / 2, x + w / 2, y + h);
    ctx.bezierCurveTo(x + w / 2, y + (h + topCurveHeight) / 2, x + w, y + (h + topCurveHeight) / 2, x + w, y + topCurveHeight);
    ctx.bezierCurveTo(x + w, y, x + w / 2, y, x + w / 2, y + h * 0.2);
    ctx.closePath();
    ctx.fill();
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
          ctx.fillRect(Math.floor(x + col * pixelW), Math.floor(y + row * pixelH), Math.ceil(pixelW), Math.ceil(pixelH));
        }
      }
    }
    ctx.restore();
  }

  // --- Particle System ---
  spawnParticles(x, y, color = '#f85149', count = 16) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 220;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.4 + Math.random() * 0.4,
        maxLife: 0.8,
        color,
        size: 3 + Math.random() * 4
      });
    }
  }

  updateAndDrawParticles(dt = 1/60) {
    const ctx = this.ctx;
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 200 * dt; // slight gravity
      p.life -= dt;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // --- Play Mode HUD Overlay ---
  drawHUD(variables = {}, message = '', bounds = { width: 1600, height: 800 }, isPaused = false, fps = 60) {
    const ctx = this.ctx;
    const w = this.viewportWidth || this.canvas.width;
    const h = this.viewportHeight || this.canvas.height;

    ctx.save();

    // Top Modern HUD Bar
    const hudW = Math.min(360, w - 32);
    ctx.fillStyle = 'rgba(22, 27, 34, 0.9)';
    ctx.strokeStyle = '#30363d';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(16, 16, hudW, 40, [6]);
    ctx.fill();
    ctx.stroke();

    ctx.font = "bold 12px 'JetBrains Mono', monospace";
    ctx.fillStyle = '#f0f6fc';

    let varItems = [];
    if (variables.score !== undefined) varItems.push(`SCORE: ${variables.score}`);
    if (variables.lives !== undefined) varItems.push(`LIVES: ${variables.lives}`);
    if (variables.coins !== undefined) varItems.push(`COINS: ${variables.coins}`);
    if (variables.keys !== undefined) varItems.push(`KEYS: ${variables.keys}`);

    if (varItems.length === 0) {
      varItems = Object.entries(variables).slice(0, 3).map(([k, v]) => `${k.toUpperCase()}: ${v}`);
    }

    ctx.fillText(varItems.join('  •  ') || 'GAME RUNNING', 28, 41);

    // FPS Counter (top right)
    ctx.fillStyle = 'rgba(22, 27, 34, 0.75)';
    ctx.beginPath();
    ctx.roundRect(w - 90, 16, 74, 28, [4]);
    ctx.fill();
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.fillStyle = fps < 45 ? '#f85149' : '#3fb950';
    ctx.fillText(`${fps} FPS`, w - 76, 34);

    // Center Message Banner (Level Complete / Game Over / Alert)
    if (message) {
      const msgWidth = Math.min(520, w - 40);
      const msgX = (w - msgWidth) / 2;
      const msgY = h / 3;

      ctx.fillStyle = 'rgba(13, 17, 23, 0.95)';
      ctx.strokeStyle = '#58a6ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(msgX, msgY, msgWidth, 80, [8]);
      ctx.fill();
      ctx.stroke();

      ctx.font = "bold 18px 'Inter', sans-serif";
      ctx.fillStyle = '#f0f6fc';
      ctx.textAlign = 'center';
      ctx.fillText(message, msgX + msgWidth / 2, msgY + 38);

      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.fillStyle = '#8b949e';
      ctx.fillText('Press [R] to Restart Scene  •  [ESC] to Return to Editor', msgX + msgWidth / 2, msgY + 62);
    } else if (isPaused) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, w, h);

      ctx.font = "bold 24px 'Inter', sans-serif";
      ctx.fillStyle = '#f0f6fc';
      ctx.textAlign = 'center';
      ctx.fillText('GAME PAUSED', w / 2, h / 2);
    }

    ctx.restore();
  }
}
