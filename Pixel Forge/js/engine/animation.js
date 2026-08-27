/**
 * PixelForge - Animation Playback, Sprite Sheet, Animated SVG & Video Exporter Engine
 * Supports Loop, Ping-Pong, and Once playback modes, custom FPS, Sprite Sheet + JSON Atlas export,
 * infinite animated vector SVG, and MediaRecorder video recording.
 */

export class AnimationEngine {
  constructor(app) {
    this.app = app;
    this.isPlaying = false;
    this.fps = 8;
    this.playMode = 'loop'; // 'loop', 'pingpong', 'once'
    this.playDirection = 1; // 1 = forward, -1 = backward (for pingpong)
    this.lastTime = 0;
    this.accumulatedTime = 0;
    this.animId = null;
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.lastTime = performance.now();
    this.accumulatedTime = 0;
    this.loop = this.loop.bind(this);
    this.animId = requestAnimationFrame(this.loop);
  }

  pause() {
    this.isPlaying = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  togglePlay() {
    if (this.isPlaying) this.pause();
    else this.play();
  }

  loop(currentTime) {
    if (!this.isPlaying) return;

    const dt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    this.accumulatedTime += dt;

    const frameDuration = 1 / Math.max(1, this.fps);
    if (this.accumulatedTime >= frameDuration) {
      this.accumulatedTime -= frameDuration;
      this.stepNext();
    }

    this.animId = requestAnimationFrame(this.loop);
  }

  stepNext() {
    const totalFrames = (this.app.project.frames || []).length;
    if (totalFrames <= 1) return;

    if (this.playMode === 'pingpong') {
      let nextIdx = this.app.activeFrameIndex + this.playDirection;
      if (nextIdx >= totalFrames) {
        this.playDirection = -1;
        nextIdx = totalFrames - 2;
      } else if (nextIdx < 0) {
        this.playDirection = 1;
        nextIdx = 1;
      }
      this.app.setFrame(Math.max(0, Math.min(totalFrames - 1, nextIdx)));
    } else if (this.playMode === 'once') {
      if (this.app.activeFrameIndex < totalFrames - 1) {
        this.app.setFrame(this.app.activeFrameIndex + 1);
      } else {
        this.pause();
      }
    } else {
      // Loop mode
      if (this.app.activeFrameIndex < totalFrames - 1) {
        this.app.setFrame(this.app.activeFrameIndex + 1);
      } else {
        this.app.setFrame(0);
      }
    }
  }

  stepPrev() {
    const totalFrames = (this.app.project.frames || []).length;
    if (totalFrames <= 1) return;

    if (this.app.activeFrameIndex > 0) {
      this.app.setFrame(this.app.activeFrameIndex - 1);
    } else {
      this.app.setFrame(totalFrames - 1);
    }
  }

  // --- Frame Renderer Helper ---
  renderFrameToCanvas(frame, width, height, scale = 1, backgroundColor = null) {
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    if (backgroundColor && backgroundColor !== 'transparent') {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const layers = frame.layers || [];
    for (const layer of layers) {
      if (layer.visible === false || !layer.pixels) continue;
      ctx.save();
      if (layer.blendMode && layer.blendMode !== 'normal') {
        ctx.globalCompositeOperation = layer.blendMode;
      }
      if (layer.opacity !== undefined) {
        ctx.globalAlpha = Math.max(0, Math.min(1, layer.opacity));
      }

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const color = layer.pixels[y * width + x];
          if (color && color !== 'transparent') {
            ctx.fillStyle = color;
            ctx.fillRect(x * scale, y * scale, scale, scale);
          }
        }
      }
      ctx.restore();
    }

    return canvas;
  }

  // --- Sprite Sheet Generator ---
  generateSpriteSheet(columns = null, scale = 1, padding = 0, backgroundColor = null) {
    const project = this.app.project;
    const frames = project.frames || [];
    const numFrames = frames.length;
    const fw = project.width * scale;
    const fh = project.height * scale;

    const cols = columns || numFrames;
    const rows = Math.ceil(numFrames / cols);

    const sheetCanvas = document.createElement('canvas');
    sheetCanvas.width = cols * (fw + padding) - padding;
    sheetCanvas.height = rows * (fh + padding) - padding;
    const ctx = sheetCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    if (backgroundColor && backgroundColor !== 'transparent') {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, sheetCanvas.width, sheetCanvas.height);
    }

    const framesMeta = [];

    frames.forEach((frame, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const destX = col * (fw + padding);
      const destY = row * (fh + padding);

      const frameCanvas = this.renderFrameToCanvas(frame, project.width, project.height, scale, null);
      ctx.drawImage(frameCanvas, destX, destY);

      framesMeta.push({
        filename: `frame_${idx}`,
        frame: { x: destX, y: destY, w: fw, h: fh },
        duration: Math.round(1000 / this.fps)
      });
    });

    const atlasJSON = {
      meta: {
        app: 'PixelForge',
        version: '1.0',
        image: (project.name || 'spritesheet').toLowerCase().replace(/\s+/g, '_') + '_sheet.png',
        format: 'RGBA8888',
        size: { w: sheetCanvas.width, h: sheetCanvas.height },
        scale: scale,
        fps: this.fps,
        totalFrames: numFrames
      },
      frames: framesMeta
    };

    return { canvas: sheetCanvas, atlasJSON };
  }

  // --- Animated SVG Generator ---
  generateAnimatedSVG(scale = 10) {
    const project = this.app.project;
    const pw = project.width;
    const ph = project.height;
    const frames = project.frames || [];
    const numFrames = frames.length;
    const duration = (numFrames / Math.max(1, this.fps)).toFixed(3);

    const svgWidth = pw * scale;
    const svgHeight = ph * scale;

    let keyframesCSS = '';
    let framesSVG = '';

    frames.forEach((frame, idx) => {
      const startPercent = ((idx / numFrames) * 100).toFixed(2);
      const endPercent = (((idx + 1) / numFrames) * 100).toFixed(2);

      keyframesCSS += `
        @keyframes anim_frame_${idx} {
          0%, ${startPercent}% { opacity: 0; }
          ${(Number(startPercent) + 0.01).toFixed(2)}%, ${endPercent}% { opacity: 1; }
          ${(Number(endPercent) + 0.01).toFixed(2)}%, 100% { opacity: 0; }
        }
        .pf-frame-${idx} {
          animation: anim_frame_${idx} ${duration}s infinite step-end;
        }
      `;

      let frameRects = '';
      const layers = frame.layers || [];
      for (const layer of layers) {
        if (layer.visible === false || !layer.pixels) continue;
        const opacity = layer.opacity !== undefined ? layer.opacity : 1;

        for (let y = 0; y < ph; y++) {
          for (let x = 0; x < pw; x++) {
            const color = layer.pixels[y * pw + x];
            if (color && color !== 'transparent') {
              frameRects += `<rect x="${x * scale}" y="${y * scale}" width="${scale}" height="${scale}" fill="${color}" ${opacity < 1 ? `opacity="${opacity}"` : ''} shape-rendering="crispEdges" />`;
            }
          }
        }
      }

      framesSVG += `
        <g class="pf-frame pf-frame-${idx}" id="frame_${idx}">
          ${frameRects}
        </g>
      `;
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}" shape-rendering="crispEdges">
  <style>
    .pf-frame { opacity: 0; }
    ${keyframesCSS}
  </style>
  ${framesSVG}
</svg>`;
  }

  // --- Video Recording via Canvas Stream & MediaRecorder ---
  async recordVideo(scale = 8, loops = 3) {
    const project = this.app.project;
    const frames = project.frames || [];
    if (frames.length === 0) return null;

    const pw = project.width * scale;
    const ph = project.height * scale;

    const recCanvas = document.createElement('canvas');
    recCanvas.width = pw;
    recCanvas.height = ph;
    const ctx = recCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    if (typeof MediaRecorder === 'undefined' || !recCanvas.captureStream) {
      throw new Error('MediaRecorder video capture is not supported in this browser.');
    }

    const stream = recCanvas.captureStream(Math.max(1, this.fps));
    let mimeType = 'video/webm;codecs=vp9';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/mp4';
      }
    }

    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    const chunks = [];

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    const recordPromise = new Promise((resolve, reject) => {
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType || 'video/webm' });
        resolve(blob);
      };
      recorder.onerror = (err) => reject(err);
    });

    recorder.start();

    const frameDelay = 1000 / Math.max(1, this.fps);

    for (let loop = 0; loop < loops; loop++) {
      for (let f = 0; f < frames.length; f++) {
        const fCanvas = this.renderFrameToCanvas(frames[f], project.width, project.height, scale);
        ctx.clearRect(0, 0, pw, ph);
        ctx.drawImage(fCanvas, 0, 0);

        await new Promise(r => setTimeout(r, frameDelay));
      }
    }

    recorder.stop();
    return await recordPromise;
  }
}
