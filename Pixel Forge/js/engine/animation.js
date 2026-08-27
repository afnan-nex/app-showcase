/**
 * PixelForge - Animation Playback, Sprite Sheet, Animated SVG & Video Exporter
 * Frame playback loop, FPS timing, animated SVG generation, and MediaRecorder video export.
 */

export class AnimationEngine {
  constructor(app) {
    this.app = app;
    this.isPlaying = false;
    this.fps = 8;
    this.isLooping = true;
    this.currentFrame = 0;
    this.timer = null;
    this.lastTime = 0;
    this.accumulatedTime = 0;
  }

  play() {
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

    const frameDuration = 1 / this.fps;
    if (this.accumulatedTime >= frameDuration) {
      this.accumulatedTime -= frameDuration;
      this.stepNext();
    }

    this.animId = requestAnimationFrame(this.loop);
  }

  stepNext() {
    const totalFrames = (this.app.project.frames || []).length;
    if (totalFrames <= 1) return;

    if (this.app.activeFrameIndex < totalFrames - 1) {
      this.app.setFrame(this.app.activeFrameIndex + 1);
    } else if (this.isLooping) {
      this.app.setFrame(0);
    } else {
      this.pause();
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

  // --- Sprite Sheet Generator ---
  generateSpriteSheet(columns = null, scale = 1) {
    const project = this.app.project;
    const frames = project.frames || [];
    const numFrames = frames.length;
    const fw = project.width * scale;
    const fh = project.height * scale;

    const cols = columns || numFrames;
    const rows = Math.ceil(numFrames / cols);

    const sheetCanvas = document.createElement('canvas');
    sheetCanvas.width = cols * fw;
    sheetCanvas.height = rows * fh;
    const ctx = sheetCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    frames.forEach((frame, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const frameCanvas = this.renderFrameToCanvas(frame, project.width, project.height, scale);
      ctx.drawImage(frameCanvas, col * fw, row * fh);
    });

    return sheetCanvas;
  }

  renderFrameToCanvas(frame, width, height, scale = 1) {
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const layers = frame.layers || [];
    for (const layer of layers) {
      if (layer.visible === false) continue;
      ctx.save();
      if (layer.opacity !== undefined) ctx.globalAlpha = layer.opacity;

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

  // --- Animated SVG Generator ---
  generateAnimatedSVG(scale = 10) {
    const project = this.app.project;
    const pw = project.width;
    const ph = project.height;
    const frames = project.frames || [];
    const numFrames = frames.length;
    const duration = (numFrames / this.fps).toFixed(2);

    const svgWidth = pw * scale;
    const svgHeight = ph * scale;

    let keyframesCSS = '';
    let framesSVG = '';

    frames.forEach((frame, idx) => {
      const startPercent = ((idx / numFrames) * 100).toFixed(1);
      const endPercent = (((idx + 1) / numFrames) * 100).toFixed(1);

      keyframesCSS += `
        @keyframes anim_frame_${idx} {
          0%, ${startPercent}% { opacity: 0; }
          ${(Number(startPercent) + 0.01).toFixed(2)}%, ${endPercent}% { opacity: 1; }
          ${(Number(endPercent) + 0.01).toFixed(2)}%, 100% { opacity: 0; }
        }
        .frame-${idx} {
          animation: anim_frame_${idx} ${duration}s infinite step-end;
        }
      `;

      let frameRects = '';
      const layers = frame.layers || [];
      for (const layer of layers) {
        if (layer.visible === false) continue;
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
        <g class="frame frame-${idx}" id="frame_${idx}">
          ${frameRects}
        </g>
      `;
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">
  <style>
    .frame { opacity: 0; }
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

    // Check MediaRecorder support
    if (typeof MediaRecorder === 'undefined' || !recCanvas.captureStream) {
      throw new Error('MediaRecorder video capture is not supported in this browser.');
    }

    const stream = recCanvas.captureStream(this.fps);
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

    const recordPromise = new Promise((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType || 'video/webm' });
        resolve(blob);
      };
    });

    recorder.start();

    // Render each frame in sequence for the designated loop count
    const frameDelay = 1000 / this.fps;

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
