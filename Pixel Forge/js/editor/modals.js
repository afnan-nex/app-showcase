/**
 * PixelForge - Modal & Dialog Management System
 * Production-quality dialogs, tabbed export center, new canvas creator, filters,
 * tilemap studio, shortcuts cheat sheet, and non-blocking toast notifications.
 */

import { getIcon, escapeHTML } from '../core/icons.js';
import { PALETTES, parseHexPalette, exportHexPalette } from '../core/palettes.js';

// --- Toast Notifications ---
export function showToast(message, type = 'info', duration = 2800) {
  let container = document.getElementById('pf-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'pf-toast-container';
    container.className = 'pf-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `pf-toast pf-toast-${type}`;

  let iconName = 'info';
  if (type === 'success') iconName = 'check';
  if (type === 'warning' || type === 'error') iconName = 'info';

  toast.innerHTML = `
    <span class="pf-toast-icon">${getIcon(iconName, 'icon-xs')}</span>
    <span class="pf-toast-msg">${escapeHTML(message)}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

// --- Base Modal Helper ---
function createModal({ title, width = '480px', contentHTML, onClose }) {
  // Remove existing modals
  document.querySelectorAll('.pf-modal-backdrop').forEach(el => el.remove());

  const backdrop = document.createElement('div');
  backdrop.className = 'pf-modal-backdrop';

  backdrop.innerHTML = `
    <div class="pf-modal-dialog" style="max-width: ${width};" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="pf-modal-header">
        <h3 class="pf-modal-title" id="modal-title">${escapeHTML(title)}</h3>
        <button class="btn-icon-xs pf-modal-close" aria-label="Close Dialog">
          ${getIcon('close', 'icon-sm')}
        </button>
      </div>
      <div class="pf-modal-body">
        ${contentHTML}
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);

  const close = () => {
    backdrop.classList.add('closing');
    setTimeout(() => {
      backdrop.remove();
      if (onClose) onClose();
    }, 150);
  };

  backdrop.querySelector('.pf-modal-close').addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  // ESC key to close
  const onKey = (e) => {
    if (e.key === 'Escape') {
      window.removeEventListener('keydown', onKey);
      close();
    }
  };
  window.addEventListener('keydown', onKey);

  requestAnimationFrame(() => {
    backdrop.classList.add('show');
  });

  return { backdrop, close };
}

// --- 1. Confirm Modal ---
export function showConfirmModal({ title = 'Confirmation', message, confirmText = 'Confirm', cancelText = 'Cancel', isDanger = false, onConfirm }) {
  const contentHTML = `
    <p class="text-secondary text-sm mb-3">${escapeHTML(message)}</p>
    <div class="flex justify-end gap-2 mt-4">
      <button class="btn btn-secondary" id="btn-modal-cancel">${escapeHTML(cancelText)}</button>
      <button class="btn ${isDanger ? 'btn-danger' : 'btn-primary'}" id="btn-modal-confirm">${escapeHTML(confirmText)}</button>
    </div>
  `;

  const { backdrop, close } = createModal({ title, width: '400px', contentHTML });

  backdrop.querySelector('#btn-modal-cancel').addEventListener('click', close);
  backdrop.querySelector('#btn-modal-confirm').addEventListener('click', () => {
    close();
    if (onConfirm) onConfirm();
  });
}

// --- 2. New Project / Canvas Modal ---
export function showNewProjectModal(onCreate) {
  const contentHTML = `
    <div class="flex flex-col gap-3">
      <div>
        <label class="block text-xs font-semibold text-muted uppercase mb-1">Project Name</label>
        <input type="text" id="new-proj-name" class="form-control" value="Pixel Artwork" placeholder="Enter project name..." />
      </div>

      <!-- Quick Resolution Presets -->
      <div>
        <label class="block text-xs font-semibold text-muted uppercase mb-1">Resolution Presets</label>
        <div class="grid grid-cols-3 gap-1 mb-2">
          <button type="button" class="btn btn-xs btn-secondary btn-preset-size" data-w="16" data-h="16">16 × 16 (Icon)</button>
          <button type="button" class="btn btn-xs btn-secondary btn-preset-size" data-w="24" data-h="24">24 × 24 (Sprite)</button>
          <button type="button" class="btn btn-xs btn-secondary active btn-preset-size" data-w="32" data-h="32">32 × 32 (Standard)</button>
          <button type="button" class="btn btn-xs btn-secondary btn-preset-size" data-w="48" data-h="48">48 × 48 (Portrait)</button>
          <button type="button" class="btn btn-xs btn-secondary btn-preset-size" data-w="64" data-h="64">64 × 64 (Tileset)</button>
          <button type="button" class="btn btn-xs btn-secondary btn-preset-size" data-w="128" data-h="128">128 × 128 (Scene)</button>
        </div>
      </div>

      <div class="flex gap-2">
        <div class="flex-1">
          <label class="block text-xs font-semibold text-muted uppercase mb-1">Width (px)</label>
          <input type="number" id="new-proj-w" class="form-control font-mono" min="8" max="256" value="32" />
        </div>
        <div class="flex-1">
          <label class="block text-xs font-semibold text-muted uppercase mb-1">Height (px)</label>
          <input type="number" id="new-proj-h" class="form-control font-mono" min="8" max="256" value="32" />
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-muted uppercase mb-1">Background Fill</label>
        <select id="new-proj-bg" class="form-control">
          <option value="transparent">Transparent (Checkerboard)</option>
          <option value="#000000">Pure Black (#000000)</option>
          <option value="#ffffff">Pure White (#FFFFFF)</option>
          <option value="#090d16">Night Sky (#090D16)</option>
          <option value="#FFF1E8">Retro Cream (#FFF1E8)</option>
        </select>
      </div>

      <div>
        <label class="block text-xs font-semibold text-muted uppercase mb-1">Initial Color Palette</label>
        <select id="new-proj-palette" class="form-control">
          ${Object.values(PALETTES).map(p => `<option value="${p.id}">${escapeHTML(p.name)}</option>`).join('')}
        </select>
      </div>

      <div class="flex justify-end gap-2 mt-3 pt-2 border-t">
        <button class="btn btn-secondary" id="btn-cancel-new">Cancel</button>
        <button class="btn btn-primary" id="btn-create-new">Create Canvas</button>
      </div>
    </div>
  `;

  const { backdrop, close } = createModal({ title: 'Create New Canvas', width: '420px', contentHTML });

  const inputW = backdrop.querySelector('#new-proj-w');
  const inputH = backdrop.querySelector('#new-proj-h');

  backdrop.querySelectorAll('.btn-preset-size').forEach(btn => {
    btn.addEventListener('click', () => {
      backdrop.querySelectorAll('.btn-preset-size').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      inputW.value = btn.dataset.w;
      inputH.value = btn.dataset.h;
    });
  });

  backdrop.querySelector('#btn-cancel-new').addEventListener('click', close);
  backdrop.querySelector('#btn-create-new').addEventListener('click', () => {
    const name = backdrop.querySelector('#new-proj-name').value.trim() || 'Pixel Artwork';
    const w = parseInt(inputW.value, 10);
    const h = parseInt(inputH.value, 10);
    const bg = backdrop.querySelector('#new-proj-bg').value;
    const pal = backdrop.querySelector('#new-proj-palette').value;

    if (w < 8 || w > 256 || h < 8 || h > 256) {
      showToast('Canvas dimensions must be between 8x8 and 256x256 px.', 'warning');
      return;
    }

    close();
    if (onCreate) onCreate({ name, width: w, height: h, background: bg, paletteId: pal });
  });
}

// --- 3. Export Center Modal ---
export function showExportModal(app) {
  const project = app.project;
  const numFrames = (project.frames || []).length;
  const pw = project.width;
  const ph = project.height;

  const contentHTML = `
    <div class="pf-export-modal-tabs">
      <div class="pf-modal-tab-bar flex border-b mb-3">
        <button class="pf-tab-btn active" data-tab="png">Upscaled PNG</button>
        <button class="pf-tab-btn" data-tab="sheet">Sprite Sheet</button>
        <button class="pf-tab-btn" data-tab="svg">Vector SVG</button>
        <button class="pf-tab-btn" data-tab="video">Video Recording</button>
        <button class="pf-tab-btn" data-tab="json">Project JSON</button>
      </div>

      <!-- Tab 1: PNG -->
      <div class="pf-tab-panel active" id="tab-png">
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <span class="text-xs text-muted">Canvas Resolution:</span>
            <span class="font-mono text-xs font-bold text-primary">${pw} × ${ph} px</span>
          </div>

          <div>
            <label class="block text-xs font-semibold text-muted uppercase mb-1">Pixel Scale Factor</label>
            <div class="grid grid-cols-6 gap-1 mb-2">
              <button type="button" class="btn btn-xs btn-secondary btn-png-scale" data-scale="1">1×</button>
              <button type="button" class="btn btn-xs btn-secondary btn-png-scale" data-scale="2">2×</button>
              <button type="button" class="btn btn-xs btn-secondary btn-png-scale" data-scale="4">4×</button>
              <button type="button" class="btn btn-xs btn-secondary active btn-png-scale" data-scale="8">8×</button>
              <button type="button" class="btn btn-xs btn-secondary btn-png-scale" data-scale="16">16×</button>
              <button type="button" class="btn btn-xs btn-secondary btn-png-scale" data-scale="32">32×</button>
            </div>
            <div class="text-xs text-muted">Exported Image Dimensions: <strong class="text-primary font-mono" id="png-out-dim">${pw * 8} × ${ph * 8} px</strong></div>
          </div>

          <div class="flex items-center gap-2">
            <input type="checkbox" id="png-opt-current-only" checked />
            <label for="png-opt-current-only" class="text-xs text-secondary cursor-pointer">Export active frame only (#${app.activeFrameIndex + 1})</label>
          </div>

          <div class="mt-2 pt-2 border-t flex justify-end">
            <button class="btn btn-primary" id="btn-do-export-png">${getIcon('download', 'icon-xs')} Download PNG</button>
          </div>
        </div>
      </div>

      <!-- Tab 2: Sprite Sheet -->
      <div class="pf-tab-panel" id="tab-sheet">
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <span class="text-xs text-muted">Total Animation Frames:</span>
            <span class="font-mono text-xs font-bold text-primary">${numFrames} frame${numFrames === 1 ? '' : 's'}</span>
          </div>

          <div class="flex gap-2">
            <div class="flex-1">
              <label class="block text-xs font-semibold text-muted uppercase mb-1">Layout Columns</label>
              <input type="number" id="sheet-cols" class="form-control font-mono" min="1" max="${Math.max(1, numFrames)}" value="${numFrames}" />
            </div>
            <div class="flex-1">
              <label class="block text-xs font-semibold text-muted uppercase mb-1">Scale (1× - 8×)</label>
              <select id="sheet-scale" class="form-control font-mono">
                <option value="1" selected>1×</option>
                <option value="2">2×</option>
                <option value="4">4×</option>
                <option value="8">8×</option>
              </select>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <input type="checkbox" id="sheet-opt-atlas" checked />
            <label for="sheet-opt-atlas" class="text-xs text-secondary cursor-pointer">Include JSON Atlas Metadata (Godot/Phaser/Unity format)</label>
          </div>

          <div class="mt-2 pt-2 border-t flex justify-end gap-2">
            <button class="btn btn-primary" id="btn-do-export-sheet">${getIcon('download', 'icon-xs')} Download Sprite Sheet</button>
          </div>
        </div>
      </div>

      <!-- Tab 3: Animated SVG -->
      <div class="pf-tab-panel" id="tab-svg">
        <div class="flex flex-col gap-3">
          <p class="text-xs text-secondary">
            Exports a standalone, infinite vector SVG with CSS @keyframes animations embedded. Perfect for web graphics, badges, and high-DPI displays.
          </p>

          <div>
            <label class="block text-xs font-semibold text-muted uppercase mb-1">Vector Pixel Scale</label>
            <select id="svg-scale" class="form-control font-mono">
              <option value="5">5 px / pixel</option>
              <option value="10" selected>10 px / pixel (Standard)</option>
              <option value="16">16 px / pixel (HD)</option>
              <option value="24">24 px / pixel (Ultra)</option>
            </select>
          </div>

          <div class="mt-2 pt-2 border-t flex justify-end gap-2">
            <button class="btn btn-secondary" id="btn-copy-svg-code">${getIcon('copy', 'icon-xs')} Copy SVG</button>
            <button class="btn btn-primary" id="btn-do-export-svg">${getIcon('download', 'icon-xs')} Download SVG</button>
          </div>
        </div>
      </div>

      <!-- Tab 4: Video Recording -->
      <div class="pf-tab-panel" id="tab-video">
        <div class="flex flex-col gap-3">
          <p class="text-xs text-secondary">
            Records the active animation sequence into a WebM/MP4 video loop using client-side canvas streams.
          </p>

          <div class="flex gap-2">
            <div class="flex-1">
              <label class="block text-xs font-semibold text-muted uppercase mb-1">Scale</label>
              <select id="video-scale" class="form-control font-mono">
                <option value="4">4×</option>
                <option value="8" selected>8× (${pw * 8}×${ph * 8})</option>
                <option value="16">16× (${pw * 16}×${ph * 16})</option>
              </select>
            </div>
            <div class="flex-1">
              <label class="block text-xs font-semibold text-muted uppercase mb-1">Loop Count</label>
              <input type="number" id="video-loops" class="form-control font-mono" min="1" max="10" value="3" />
            </div>
          </div>

          <div class="mt-2 pt-2 border-t flex justify-end">
            <button class="btn btn-primary" id="btn-do-record-video">${getIcon('film', 'icon-xs')} Record & Download Video</button>
          </div>
        </div>
      </div>

      <!-- Tab 5: JSON Project -->
      <div class="pf-tab-panel" id="tab-json">
        <div class="flex flex-col gap-3">
          <p class="text-xs text-secondary">
            Exports the entire PixelForge project document including all frames, layer hierarchies, opacity, and palettes for backup and sharing.
          </p>

          <div class="mt-2 pt-2 border-t flex justify-end gap-2">
            <button class="btn btn-primary" id="btn-do-export-json">${getIcon('download', 'icon-xs')} Save Project (.pixelforge.json)</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const { backdrop, close } = createModal({ title: 'Export & Share Artwork', width: '520px', contentHTML });

  // Tab switching
  backdrop.querySelectorAll('.pf-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      backdrop.querySelectorAll('.pf-tab-btn').forEach(b => b.classList.remove('active'));
      backdrop.querySelectorAll('.pf-tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      backdrop.querySelector('#tab-' + btn.dataset.tab).classList.add('active');
    });
  });

  // Scale buttons for PNG
  let pngScale = 8;
  const dimLabel = backdrop.querySelector('#png-out-dim');
  backdrop.querySelectorAll('.btn-png-scale').forEach(btn => {
    btn.addEventListener('click', () => {
      backdrop.querySelectorAll('.btn-png-scale').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      pngScale = parseInt(btn.dataset.scale, 10);
      dimLabel.textContent = `${pw * pngScale} × ${ph * pngScale} px`;
    });
  });

  // Action Handlers
  backdrop.querySelector('#btn-do-export-png').addEventListener('click', () => {
    const activeOnly = backdrop.querySelector('#png-opt-current-only').checked;
    close();
    if (activeOnly) {
      app.exportPNG(pngScale);
    } else {
      app.exportAllFramesPNG(pngScale);
    }
  });

  backdrop.querySelector('#btn-do-export-sheet').addEventListener('click', () => {
    const cols = parseInt(backdrop.querySelector('#sheet-cols').value, 10) || numFrames;
    const scale = parseInt(backdrop.querySelector('#sheet-scale').value, 10) || 1;
    const includeAtlas = backdrop.querySelector('#sheet-opt-atlas').checked;
    close();
    app.exportSpriteSheetWithAtlas(cols, scale, includeAtlas);
  });

  backdrop.querySelector('#btn-do-export-svg').addEventListener('click', () => {
    const scale = parseInt(backdrop.querySelector('#svg-scale').value, 10) || 10;
    close();
    app.exportAnimatedSVG(scale);
  });

  backdrop.querySelector('#btn-copy-svg-code').addEventListener('click', () => {
    const scale = parseInt(backdrop.querySelector('#svg-scale').value, 10) || 10;
    const svgStr = app.animation.generateAnimatedSVG(scale);
    navigator.clipboard.writeText(svgStr).then(() => {
      showToast('Animated SVG copied to clipboard!', 'success');
    });
  });

  backdrop.querySelector('#btn-do-record-video').addEventListener('click', () => {
    const scale = parseInt(backdrop.querySelector('#video-scale').value, 10) || 8;
    const loops = parseInt(backdrop.querySelector('#video-loops').value, 10) || 3;
    close();
    showToast('Recording animation video...', 'info', 4000);
    app.exportVideo(scale, loops);
  });

  backdrop.querySelector('#btn-do-export-json').addEventListener('click', () => {
    close();
    app.exportProjectJSON();
  });
}

// --- 4. Canvas Resize & Rescale Modal ---
export function showResizeModal(app, onApply) {
  const pw = app.project.width;
  const ph = app.project.height;

  const contentHTML = `
    <div class="flex flex-col gap-3">
      <div class="pf-modal-tab-bar flex border-b mb-2">
        <button class="pf-tab-btn active" data-mode="canvas">Canvas Canvas Size (Crop / Extend)</button>
        <button class="pf-tab-btn" data-mode="pixel">Pixel Scale (Resample)</button>
      </div>

      <!-- Canvas Size Mode -->
      <div class="pf-resize-mode-panel active" id="mode-canvas">
        <div class="flex gap-2 mb-3">
          <div class="flex-1">
            <label class="block text-xs font-semibold text-muted uppercase mb-1">New Width</label>
            <input type="number" id="resize-w" class="form-control font-mono" min="8" max="256" value="${pw}" />
          </div>
          <div class="flex-1">
            <label class="block text-xs font-semibold text-muted uppercase mb-1">New Height</label>
            <input type="number" id="resize-h" class="form-control font-mono" min="8" max="256" value="${ph}" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-muted uppercase mb-1">Anchor Position</label>
          <div class="grid grid-cols-3 gap-1 w-36 mx-auto mb-2">
            <button class="btn btn-xs btn-secondary btn-anchor" data-anchor="top-left">&#8598;</button>
            <button class="btn btn-xs btn-secondary btn-anchor" data-anchor="top-center">&#8593;</button>
            <button class="btn btn-xs btn-secondary btn-anchor" data-anchor="top-right">&#8599;</button>
            <button class="btn btn-xs btn-secondary btn-anchor" data-anchor="mid-left">&#8592;</button>
            <button class="btn btn-xs btn-secondary active btn-anchor" data-anchor="center">&bull;</button>
            <button class="btn btn-xs btn-secondary btn-anchor" data-anchor="mid-right">&#8594;</button>
            <button class="btn btn-xs btn-secondary btn-anchor" data-anchor="bottom-left">&#8601;</button>
            <button class="btn btn-xs btn-secondary btn-anchor" data-anchor="bottom-center">&#8595;</button>
            <button class="btn btn-xs btn-secondary btn-anchor" data-anchor="bottom-right">&#8600;</button>
          </div>
        </div>
      </div>

      <!-- Pixel Scale Mode -->
      <div class="pf-resize-mode-panel" id="mode-pixel">
        <label class="block text-xs font-semibold text-muted uppercase mb-1">Resample Scale</label>
        <div class="grid grid-cols-4 gap-1 mb-2">
          <button class="btn btn-xs btn-secondary btn-resample-scale" data-scale="0.5">0.5×</button>
          <button class="btn btn-xs btn-secondary active btn-resample-scale" data-scale="2">2×</button>
          <button class="btn btn-xs btn-secondary btn-resample-scale" data-scale="3">3×</button>
          <button class="btn btn-xs btn-secondary btn-resample-scale" data-scale="4">4×</button>
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-3 pt-2 border-t">
        <button class="btn btn-secondary" id="btn-cancel-resize">Cancel</button>
        <button class="btn btn-primary" id="btn-apply-resize">Apply Resize</button>
      </div>
    </div>
  `;

  const { backdrop, close } = createModal({ title: 'Canvas Size & Rescaling', width: '420px', contentHTML });

  let mode = 'canvas';
  let anchor = 'center';
  let pixelScale = 2;

  backdrop.querySelectorAll('.pf-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      backdrop.querySelectorAll('.pf-tab-btn').forEach(b => b.classList.remove('active'));
      backdrop.querySelectorAll('.pf-resize-mode-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      mode = btn.dataset.mode;
      backdrop.querySelector('#mode-' + mode).classList.add('active');
    });
  });

  backdrop.querySelectorAll('.btn-anchor').forEach(btn => {
    btn.addEventListener('click', () => {
      backdrop.querySelectorAll('.btn-anchor').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      anchor = btn.dataset.anchor;
    });
  });

  backdrop.querySelectorAll('.btn-resample-scale').forEach(btn => {
    btn.addEventListener('click', () => {
      backdrop.querySelectorAll('.btn-resample-scale').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      pixelScale = parseFloat(btn.dataset.scale);
    });
  });

  backdrop.querySelector('#btn-cancel-resize').addEventListener('click', close);
  backdrop.querySelector('#btn-apply-resize').addEventListener('click', () => {
    const w = parseInt(backdrop.querySelector('#resize-w').value, 10);
    const h = parseInt(backdrop.querySelector('#resize-h').value, 10);
    close();
    if (onApply) onApply({ mode, width: w, height: h, anchor, pixelScale });
  });
}

// --- 5. Color Adjustments & Filters Modal ---
export function showFiltersModal(app, onApply) {
  const contentHTML = `
    <div class="flex flex-col gap-3">
      <div>
        <label class="block text-xs font-semibold text-muted uppercase mb-1">Target Scope</label>
        <select id="filter-scope" class="form-control">
          <option value="active-layer" selected>Active Layer Only</option>
          <option value="all-layers">All Layers in Active Frame</option>
          <option value="all-frames">All Frames & Layers (Project)</option>
        </select>
      </div>

      <!-- Brightness / Contrast -->
      <div class="border-t pt-2">
        <label class="block text-xs font-semibold text-muted uppercase mb-1">Brightness: <span id="val-bright" class="font-mono text-primary">0</span></label>
        <input type="range" id="filter-bright" min="-100" max="100" value="0" class="form-control form-control-sm p-0 w-full" />
      </div>

      <div>
        <label class="block text-xs font-semibold text-muted uppercase mb-1">Contrast: <span id="val-contrast" class="font-mono text-primary">0</span></label>
        <input type="range" id="filter-contrast" min="-100" max="100" value="0" class="form-control form-control-sm p-0 w-full" />
      </div>

      <!-- Quick Actions -->
      <div class="border-t pt-2">
        <label class="block text-xs font-semibold text-muted uppercase mb-1">Instant Effects</label>
        <div class="grid grid-cols-2 gap-2">
          <button class="btn btn-secondary btn-quick-filter" data-effect="invert">Invert Colors</button>
          <button class="btn btn-secondary btn-quick-filter" data-effect="grayscale">Grayscale</button>
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-3 pt-2 border-t">
        <button class="btn btn-secondary" id="btn-cancel-filters">Cancel</button>
        <button class="btn btn-primary" id="btn-apply-filters">Apply Adjustments</button>
      </div>
    </div>
  `;

  const { backdrop, close } = createModal({ title: 'Color Adjustments & Filters', width: '400px', contentHTML });

  const bSlider = backdrop.querySelector('#filter-bright');
  const cSlider = backdrop.querySelector('#filter-contrast');
  const bVal = backdrop.querySelector('#val-bright');
  const cVal = backdrop.querySelector('#val-contrast');

  bSlider.addEventListener('input', (e) => bVal.textContent = e.target.value);
  cSlider.addEventListener('input', (e) => cVal.textContent = e.target.value);

  backdrop.querySelectorAll('.btn-quick-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      const effect = btn.dataset.effect;
      const scope = backdrop.querySelector('#filter-scope').value;
      close();
      if (onApply) onApply({ effect, scope });
    });
  });

  backdrop.querySelector('#btn-cancel-filters').addEventListener('click', close);
  backdrop.querySelector('#btn-apply-filters').addEventListener('click', () => {
    const brightness = parseInt(bSlider.value, 10);
    const contrast = parseInt(cSlider.value, 10);
    const scope = backdrop.querySelector('#filter-scope').value;
    close();
    if (onApply) onApply({ brightness, contrast, scope });
  });
}

// --- 6. Tilemap Studio Modal ---
export function showTilemapModal(app) {
  const tilemap = app.tilemap;
  tilemap.sliceTilesFromProject(16);

  const contentHTML = `
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-xs text-muted">Tile Size:</span>
          <select id="tilemap-tile-size" class="form-control form-control-sm w-20">
            <option value="8">8×8</option>
            <option value="16" selected>16×16</option>
            <option value="24">24×24</option>
            <option value="32">32×32</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <button class="btn btn-xs btn-secondary" id="btn-tilemap-clear">Clear Map</button>
          <button class="btn btn-xs btn-secondary" id="btn-tilemap-fill">Fill Map</button>
          <button class="btn btn-xs btn-primary" id="btn-tilemap-export-png">${getIcon('download', 'icon-xs')} PNG</button>
          <button class="btn btn-xs btn-secondary" id="btn-tilemap-export-json">Save JSON</button>
        </div>
      </div>

      <div class="flex gap-3" style="min-height: 320px;">
        <!-- Left: Sliced Tiles Tray -->
        <div class="w-36 flex flex-col border-r pr-2">
          <span class="text-xs font-semibold text-muted uppercase mb-1">Tiles (${tilemap.tiles.length})</span>
          <div class="flex flex-wrap gap-1 overflow-y-auto flex-1 p-1" id="tilemap-tiles-tray">
            ${tilemap.tiles.map((tile, idx) => `
              <div class="tile-palette-card ${idx === tilemap.selectedTileIndex ? 'selected' : ''}" data-idx="${idx}" title="Tile #${idx + 1}">
                <canvas class="tile-preview-canvas" width="32" height="32" data-idx="${idx}"></canvas>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Right: Interactive Tilemap Canvas Grid -->
        <div class="flex-1 flex flex-col items-center justify-center overflow-auto bg-canvas p-2 rounded">
          <canvas id="tilemap-grid-canvas" class="border" style="cursor: crosshair; image-rendering: pixelated;"></canvas>
        </div>
      </div>
    </div>
  `;

  const { backdrop, close } = createModal({ title: 'Tilemap Studio (World Builder)', width: '740px', contentHTML });

  const gridCanvas = backdrop.querySelector('#tilemap-grid-canvas');
  const tray = backdrop.querySelector('#tilemap-tiles-tray');

  // Render tile previews in tray
  backdrop.querySelectorAll('.tile-preview-canvas').forEach(c => {
    const idx = parseInt(c.dataset.idx, 10);
    const tile = tilemap.tiles[idx];
    if (tile) {
      const tc = tilemap.renderTileToCanvas(tile, 32 / tilemap.tileSize);
      c.getContext('2d').drawImage(tc, 0, 0);
    }
  });

  const renderGrid = () => {
    const scale = 2;
    const cw = tilemap.mapCols * tilemap.tileSize * scale;
    const ch = tilemap.mapRows * tilemap.tileSize * scale;
    gridCanvas.width = cw;
    gridCanvas.height = ch;

    const ctx = gridCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Render tilemap
    const mapCanvas = tilemap.renderTilemapToCanvas(scale);
    ctx.drawImage(mapCanvas, 0, 0);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    for (let c = 0; c <= tilemap.mapCols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * tilemap.tileSize * scale, 0);
      ctx.lineTo(c * tilemap.tileSize * scale, ch);
      ctx.stroke();
    }
    for (let r = 0; r <= tilemap.mapRows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * tilemap.tileSize * scale);
      ctx.lineTo(cw, r * tilemap.tileSize * scale);
      ctx.stroke();
    }
  };

  renderGrid();

  // Tray selection
  tray.querySelectorAll('.tile-palette-card').forEach(card => {
    card.addEventListener('click', () => {
      tray.querySelectorAll('.tile-palette-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      tilemap.selectedTileIndex = parseInt(card.dataset.idx, 10);
    });
  });

  // Painting on grid canvas
  let isPainting = false;
  const paintTile = (e) => {
    const rect = gridCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / (tilemap.tileSize * 2));
    const row = Math.floor(y / (tilemap.tileSize * 2));

    if (e.buttons === 2) {
      tilemap.setTileAt(col, row, -1); // Erase
    } else {
      tilemap.setTileAt(col, row, tilemap.selectedTileIndex);
    }
    renderGrid();
  };

  gridCanvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    paintTile(e);
  });
  gridCanvas.addEventListener('mousemove', (e) => {
    if (isPainting) paintTile(e);
  });
  window.addEventListener('mouseup', () => isPainting = false);
  gridCanvas.addEventListener('contextmenu', (e) => e.preventDefault());

  // Size change
  backdrop.querySelector('#tilemap-tile-size').addEventListener('change', (e) => {
    tilemap.sliceTilesFromProject(parseInt(e.target.value, 10));
    showTilemapModal(app);
  });

  backdrop.querySelector('#btn-tilemap-clear').addEventListener('click', () => {
    tilemap.clearMap();
    renderGrid();
  });

  backdrop.querySelector('#btn-tilemap-fill').addEventListener('click', () => {
    tilemap.fillMap(tilemap.selectedTileIndex);
    renderGrid();
  });

  backdrop.querySelector('#btn-tilemap-export-png').addEventListener('click', () => {
    const canvas = tilemap.renderTilemapToCanvas(4);
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'tilemap_world.png';
    a.click();
  });

  backdrop.querySelector('#btn-tilemap-export-json').addEventListener('click', () => {
    const json = tilemap.exportTilemapJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'tilemap_matrix.json';
    a.click();
  });
}

// --- 7. Keyboard Shortcuts Cheat Sheet Modal ---
export function showShortcutsModal() {
  const shortcuts = [
    { cat: 'Tools', keys: [
      { key: 'B', desc: 'Pencil Tool (Pixel-Perfect)' },
      { key: 'E', desc: 'Eraser Tool' },
      { key: 'L', desc: 'Line Tool' },
      { key: 'U', desc: 'Rectangle Outline' },
      { key: 'C', desc: 'Circle Outline' },
      { key: 'G', desc: 'Paint Bucket Fill' },
      { key: 'I', desc: 'Eyedropper / Color Picker' },
      { key: 'D', desc: 'Bayer Dithering Brush' },
      { key: 'S', desc: 'Marquee Selection' },
      { key: 'M', desc: 'Pan / Hand Tool' },
      { key: 'R', desc: 'Color Replace Tool' }
    ]},
    { cat: 'Colors & Canvas', keys: [
      { key: 'X', desc: 'Swap Primary & Secondary Color' },
      { key: 'Alt + Click', desc: 'Quick Eyedropper in any tool' },
      { key: 'Space + Drag', desc: 'Smooth Pan Viewport' },
      { key: 'Mouse Wheel', desc: 'Zoom In / Out at Cursor' },
      { key: '[ / ]', desc: 'Decrease / Increase Brush Size' }
    ]},
    { cat: 'Animation & History', keys: [
      { key: 'Space', desc: 'Play / Pause Animation' },
      { key: 'Ctrl + Z', desc: 'Undo' },
      { key: 'Ctrl + Y', desc: 'Redo (or Ctrl+Shift+Z)' },
      { key: 'Ctrl + C', desc: 'Copy Marquee Selection' },
      { key: 'Ctrl + V', desc: 'Paste Selection Stamp' },
      { key: 'Delete / Backspace', desc: 'Clear Selection Pixels' },
      { key: 'Esc', desc: 'Deselect / Clear Marquee' }
    ]}
  ];

  const contentHTML = `
    <div class="flex flex-col gap-4 max-h-96 overflow-y-auto pr-1">
      ${shortcuts.map(s => `
        <div>
          <h4 class="text-xs font-bold uppercase text-primary mb-2">${escapeHTML(s.cat)}</h4>
          <div class="grid grid-cols-2 gap-2">
            ${s.keys.map(k => `
              <div class="flex items-center justify-between p-1 bg-elevated rounded border">
                <span class="text-xs text-secondary">${escapeHTML(k.desc)}</span>
                <kbd class="pf-kbd">${escapeHTML(k.key)}</kbd>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;

  createModal({ title: 'Keyboard Shortcuts Reference', width: '560px', contentHTML });
}

// --- 8. Palette Manager Modal ---
export function showPaletteManagerModal(app) {
  const contentHTML = `
    <div class="flex flex-col gap-3">
      <div class="flex gap-2">
        <textarea id="palette-hex-input" class="form-control font-mono text-xs flex-1" rows="8" placeholder="#000000\n#ffffff\n#58a6ff\n#e11d48..."></textarea>
      </div>

      <div class="flex justify-between items-center border-t pt-2">
        <button class="btn btn-xs btn-secondary" id="btn-load-cur-pal">Load Current Palette</button>
        <div class="flex gap-2">
          <button class="btn btn-secondary" id="btn-export-hex-file">${getIcon('download', 'icon-xs')} Export .hex</button>
          <button class="btn btn-primary" id="btn-import-hex-list">Apply Palette</button>
        </div>
      </div>
    </div>
  `;

  const { backdrop, close } = createModal({ title: 'Palette Manager & HEX Importer', width: '420px', contentHTML });

  const txt = backdrop.querySelector('#palette-hex-input');

  backdrop.querySelector('#btn-load-cur-pal').addEventListener('click', () => {
    const curColors = app.getCurrentPaletteColors();
    txt.value = curColors.join('\n');
  });

  backdrop.querySelector('#btn-export-hex-file').addEventListener('click', () => {
    const colors = parseHexPalette(txt.value);
    if (colors.length === 0) {
      showToast('No valid hex colors found.', 'warning');
      return;
    }
    const blob = new Blob([exportHexPalette(colors)], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'palette.hex';
    a.click();
  });

  backdrop.querySelector('#btn-import-hex-list').addEventListener('click', () => {
    const colors = parseHexPalette(txt.value);
    if (colors.length === 0) {
      showToast('No valid hex colors found.', 'warning');
      return;
    }
    app.setCustomPalette(colors);
    close();
    showToast(`Loaded ${colors.length} palette colors!`, 'success');
  });
}
