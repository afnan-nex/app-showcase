/**
 * PixelForge - Animation Timeline Filmstrip Component
 * Frame thumbnail reel, playhead controls, FPS speed, loop/ping-pong modes,
 * frame reordering, duplicate, delete, and onion-skin toggling.
 */

import { getIcon, escapeHTML } from '../core/icons.js';

export function renderTimeline(container, {
  frames = [],
  activeFrameIndex = 0,
  isPlaying = false,
  fps = 8,
  playMode = 'loop', // 'loop', 'pingpong', 'once'
  showOnionSkin = false,
  projectWidth = 32,
  projectHeight = 32,
  onSelectFrame = null,
  onAddFrame = null,
  onDuplicateFrame = null,
  onDeleteFrame = null,
  onMoveFrame = null,
  onReverseFrames = null,
  onTogglePlay = null,
  onStepNext = null,
  onStepPrev = null,
  onFPSChange = null,
  onPlayModeChange = null,
  onToggleOnion = null
}) {
  if (!container) return;

  container.innerHTML = `
    <!-- Top Playback Toolbar -->
    <div class="timeline-controls-bar flex items-center justify-between px-3 py-1 border-b">
      <!-- Playhead & Navigation -->
      <div class="flex items-center gap-1">
        <button class="btn btn-xs btn-secondary" id="btn-timeline-prev" title="Previous Frame (Left Arrow)">
          ${getIcon('stepPrev', 'icon-xs')}
        </button>

        <button class="btn btn-xs ${isPlaying ? 'btn-primary' : 'btn-secondary'}" id="btn-timeline-play" title="Play / Pause Animation (Space)">
          ${getIcon(isPlaying ? 'pause' : 'play', 'icon-xs')}
          <span>${isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        <button class="btn btn-xs btn-secondary" id="btn-timeline-next" title="Next Frame (Right Arrow)">
          ${getIcon('stepNext', 'icon-xs')}
        </button>

        <div class="toolbar-divider"></div>

        <!-- Playback Mode (Loop, Ping-Pong, Once) -->
        <select id="select-play-mode" class="form-control form-control-sm w-24 text-xs" title="Animation Loop Mode">
          <option value="loop" ${playMode === 'loop' ? 'selected' : ''}>Loop</option>
          <option value="pingpong" ${playMode === 'pingpong' ? 'selected' : ''}>Ping-Pong</option>
          <option value="once" ${playMode === 'once' ? 'selected' : ''}>Play Once</option>
        </select>

        <button class="btn btn-xs ${showOnionSkin ? 'btn-primary' : 'btn-secondary'}" id="btn-timeline-onion" title="Toggle Onion Skinning (Past Cyan / Next Red)">
          ${getIcon('onion', 'icon-xs')}
          <span>Onion</span>
        </button>
      </div>

      <!-- FPS Speed Controller -->
      <div class="flex items-center gap-2">
        <span class="text-xs text-muted font-mono font-semibold">FPS:</span>
        <input type="range" min="1" max="60" id="input-timeline-fps" class="form-control form-control-sm p-0 w-20" value="${fps}" title="Frames Per Second (1 - 60)" />
        <span class="text-xs font-mono font-bold text-primary w-6 text-center" id="fps-label">${fps}</span>

        <div class="flex gap-1 ml-1">
          <button class="btn btn-xs btn-secondary btn-fps-preset ${fps === 4 ? 'active' : ''}" data-fps="4">4</button>
          <button class="btn btn-xs btn-secondary btn-fps-preset ${fps === 8 ? 'active' : ''}" data-fps="8">8</button>
          <button class="btn btn-xs btn-secondary btn-fps-preset ${fps === 12 ? 'active' : ''}" data-fps="12">12</button>
          <button class="btn btn-xs btn-secondary btn-fps-preset ${fps === 24 ? 'active' : ''}" data-fps="24">24</button>
        </div>
      </div>

      <!-- Frame Actions -->
      <div class="flex items-center gap-1">
        ${frames.length > 1 ? `
          <button class="btn btn-xs btn-secondary" id="btn-reverse-frames" title="Reverse Animation Frames Order">
            ${getIcon('reverse', 'icon-xs')} Reverse
          </button>
        ` : ''}
        <button class="btn btn-xs btn-primary" id="btn-add-frame" title="Add New Blank Frame">
          ${getIcon('plus', 'icon-xs')} New Frame
        </button>
      </div>
    </div>

    <!-- Frames Filmstrip Scroll Container -->
    <div class="timeline-filmstrip-scroll flex items-center gap-2 p-2 overflow-x-auto flex-1">
      ${frames.map((frame, idx) => {
        const isActive = idx === activeFrameIndex;

        return `
          <div class="timeline-frame-card ${isActive ? 'active' : ''}" data-idx="${idx}">
            <div class="frame-card-header flex items-center justify-between px-1">
              <span class="font-mono text-xs font-bold text-muted">#${idx + 1}</span>
              <div class="frame-card-actions flex items-center gap-0.5">
                <button class="btn-icon-xs btn-move-frame-left" data-idx="${idx}" title="Move Frame Left" ${idx === 0 ? 'disabled' : ''}>&larr;</button>
                <button class="btn-icon-xs btn-move-frame-right" data-idx="${idx}" title="Move Frame Right" ${idx === frames.length - 1 ? 'disabled' : ''}>&rarr;</button>
                <button class="btn-icon-xs btn-dupe-frame" data-idx="${idx}" title="Duplicate Frame">
                  ${getIcon('copy', 'icon-xs')}
                </button>
                ${frames.length > 1 ? `
                  <button class="btn-icon-xs text-rose btn-del-frame" data-idx="${idx}" title="Delete Frame">
                    ${getIcon('trash', 'icon-xs')}
                  </button>
                ` : ''}
              </div>
            </div>

            <!-- Canvas Thumbnail -->
            <div class="frame-thumbnail-wrapper cursor-pointer frame-select-target" title="Select Frame #${idx + 1}">
              <canvas class="frame-thumb-canvas" width="48" height="48" data-idx="${idx}"></canvas>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Draw thumbnails for all frames
  container.querySelectorAll('.frame-thumb-canvas').forEach(canvas => {
    const idx = parseInt(canvas.dataset.idx, 10);
    const frame = frames[idx];
    if (frame) {
      drawFrameThumbnail(canvas, frame, projectWidth, projectHeight);
    }
  });

  // --- Attach Handlers ---
  container.querySelector('#btn-timeline-play')?.addEventListener('click', () => {
    if (onTogglePlay) onTogglePlay();
  });

  container.querySelector('#btn-timeline-prev')?.addEventListener('click', () => {
    if (onStepPrev) onStepPrev();
  });

  container.querySelector('#btn-timeline-next')?.addEventListener('click', () => {
    if (onStepNext) onStepNext();
  });

  container.querySelector('#btn-timeline-onion')?.addEventListener('click', () => {
    if (onToggleOnion) onToggleOnion();
  });

  container.querySelector('#select-play-mode')?.addEventListener('change', (e) => {
    if (onPlayModeChange) onPlayModeChange(e.target.value);
  });

  const fpsSlider = container.querySelector('#input-timeline-fps');
  const fpsLabel = container.querySelector('#fps-label');
  fpsSlider?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    fpsLabel.textContent = val;
    if (onFPSChange) onFPSChange(val);
  });

  container.querySelectorAll('.btn-fps-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.dataset.fps, 10);
      fpsSlider.value = val;
      fpsLabel.textContent = val;
      if (onFPSChange) onFPSChange(val);
    });
  });

  container.querySelector('#btn-reverse-frames')?.addEventListener('click', () => {
    if (onReverseFrames) onReverseFrames();
  });

  container.querySelector('#btn-add-frame')?.addEventListener('click', () => {
    if (onAddFrame) onAddFrame();
  });

  container.querySelectorAll('.frame-select-target').forEach(el => {
    el.addEventListener('click', () => {
      const card = el.closest('.timeline-frame-card');
      const idx = parseInt(card.dataset.idx, 10);
      if (onSelectFrame) onSelectFrame(idx);
    });
  });

  container.querySelectorAll('.btn-dupe-frame').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx, 10);
      if (onDuplicateFrame) onDuplicateFrame(idx);
    });
  });

  container.querySelectorAll('.btn-del-frame').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx, 10);
      if (onDeleteFrame) onDeleteFrame(idx);
    });
  });

  container.querySelectorAll('.btn-move-frame-left').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx, 10);
      if (onMoveFrame) onMoveFrame(idx, -1);
    });
  });

  container.querySelectorAll('.btn-move-frame-right').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx, 10);
      if (onMoveFrame) onMoveFrame(idx, 1);
    });
  });
}

function drawFrameThumbnail(canvas, frame, pw, ph) {
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const cw = canvas.width;
  const ch = canvas.height;

  // Checkerboard pattern
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? '#181b24' : '#222634';
      ctx.fillRect(x * 6, y * 6, 6, 6);
    }
  }

  // Draw layers
  const scaleX = cw / pw;
  const scaleY = ch / ph;

  for (const layer of (frame.layers || [])) {
    if (layer.visible === false || !layer.pixels) continue;
    ctx.save();
    if (layer.opacity !== undefined) ctx.globalAlpha = Math.max(0, Math.min(1, layer.opacity));

    for (let y = 0; y < ph; y++) {
      for (let x = 0; x < pw; x++) {
        const col = layer.pixels[y * pw + x];
        if (col && col !== 'transparent') {
          ctx.fillStyle = col;
          ctx.fillRect(x * scaleX, y * scaleY, scaleX + 0.2, scaleY + 0.2);
        }
      }
    }
    ctx.restore();
  }
}
