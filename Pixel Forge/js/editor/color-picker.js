/**
 * PixelForge - Color Picker & Palette Manager Component
 * Primary/Secondary color swatches, Hex/RGB/HSV readouts, curated retro palettes,
 * add color to palette, palette manager trigger, and recent color history.
 */

import { getIcon, escapeHTML } from '../core/icons.js';
import { PALETTES } from '../core/palettes.js';
import { hexToRgb, rgbToHsv } from '../core/math-draw.js';

export function renderColorPanel(container, {
  primaryColor = '#58a6ff',
  secondaryColor = '#000000',
  currentPaletteId = 'pico8',
  customPalette = [],
  recentColors = [],
  ditherThreshold = 8,
  onColorChange = null,
  onPaletteChange = null,
  onAddColorToPalette = null,
  onOpenPaletteManager = null,
  onDitherThresholdChange = null
}) {
  if (!container) return;

  const currentPalette = PALETTES[currentPaletteId] || { name: 'Custom Palette', colors: customPalette };
  const primaryRgb = hexToRgb(primaryColor);
  const primaryHsv = rgbToHsv(primaryRgb.r, primaryRgb.g, primaryRgb.b);

  container.innerHTML = `
    <!-- Top Primary & Secondary Swatches -->
    <div class="color-swatches-master flex items-center justify-between p-3 border-b">
      <div class="flex items-center gap-3">
        <!-- Dual Color Box -->
        <div class="dual-color-container relative w-12 h-10" title="Primary (Left Click) / Secondary (Right Click)">
          <div class="color-box secondary-swatch absolute" style="background-color: ${secondaryColor};" title="Secondary Color (Right Click)"></div>
          <div class="color-box primary-swatch absolute" style="background-color: ${primaryColor};" title="Primary Color (Left Click)"></div>
        </div>

        <div class="flex flex-col">
          <span class="font-mono text-xs font-bold uppercase text-primary" id="primary-hex-label">${primaryColor}</span>
          <span class="text-xs text-muted font-mono" style="font-size: 10px;">RGB(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})</span>
        </div>
      </div>

      <div class="flex items-center gap-1">
        <button class="btn-icon-xs text-muted" id="btn-swap-colors" title="Swap Colors (X)">
          ${getIcon('swap', 'icon-xs')}
        </button>
        <button class="btn-icon-xs text-muted" id="btn-add-swatch" title="Add Current Color to Palette">
          ${getIcon('plus', 'icon-xs')}
        </button>
      </div>
    </div>

    <!-- Color Inputs & Native Pickers -->
    <div class="p-3 border-b flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <input type="color" id="native-color-picker" class="p-0 w-8 h-7 cursor-pointer border-none rounded" value="${primaryColor}" title="Open Native Color Picker" />
        <input type="text" id="input-hex-val" class="form-control form-control-sm font-mono flex-1 text-center" value="${primaryColor}" placeholder="#RRGGBB" maxlength="7" />
      </div>

      <!-- Dither Threshold Slider -->
      <div class="flex items-center gap-2 pt-1">
        <span class="text-xs text-muted font-mono" style="font-size: 10px;">Dither:</span>
        <select id="select-dither-threshold" class="form-control form-control-sm flex-1 text-xs">
          <option value="4" ${ditherThreshold === 4 ? 'selected' : ''}>25% Density</option>
          <option value="8" ${ditherThreshold === 8 ? 'selected' : ''}>50% Density (Checker)</option>
          <option value="12" ${ditherThreshold === 12 ? 'selected' : ''}>75% Density</option>
        </select>
      </div>
    </div>

    <!-- Palette Selection & Swatches -->
    <div class="p-3 flex-1 overflow-y-auto flex flex-col gap-3">
      <div class="flex items-center justify-between gap-1">
        <select id="select-palette-preset" class="form-control form-control-sm flex-1 font-semibold">
          ${Object.values(PALETTES).map(p => `
            <option value="${p.id}" ${currentPaletteId === p.id ? 'selected' : ''}>${escapeHTML(p.name)}</option>
          `).join('')}
        </select>
        <button class="btn-icon-xs" id="btn-open-palette-mgr" title="Import / Export Palettes">
          ${getIcon('palette', 'icon-xs')}
        </button>
      </div>

      <!-- Swatches Grid -->
      <div class="palette-swatches-grid" id="palette-swatches-grid">
        ${currentPalette.colors.map(col => `
          <div class="swatch-tile ${col.toLowerCase() === primaryColor.toLowerCase() ? 'selected' : ''}" style="background-color: ${col};" data-color="${col}" title="${col} (Left: Primary, Right: Secondary)"></div>
        `).join('')}
      </div>

      <!-- Recent Colors History -->
      ${recentColors.length > 0 ? `
        <div class="border-t pt-2 mt-2">
          <span class="text-xs font-bold uppercase text-muted block mb-1">Recent Colors</span>
          <div class="flex flex-wrap gap-1">
            ${recentColors.slice(0, 16).map(c => `
              <div class="swatch-tile-mini ${c.toLowerCase() === primaryColor.toLowerCase() ? 'selected' : ''}" style="background-color: ${c};" data-color="${c}" title="${c}"></div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  // --- Attach Handlers ---
  const nativePicker = container.querySelector('#native-color-picker');
  const hexInput = container.querySelector('#input-hex-val');

  nativePicker?.addEventListener('input', (e) => {
    hexInput.value = e.target.value;
    container.querySelector('#primary-hex-label').textContent = e.target.value;
    container.querySelector('.primary-swatch').style.backgroundColor = e.target.value;
    if (onColorChange) onColorChange(e.target.value, false);
  });

  hexInput?.addEventListener('input', (e) => {
    let val = e.target.value;
    if (!val.startsWith('#')) val = '#' + val;
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      nativePicker.value = val;
      container.querySelector('#primary-hex-label').textContent = val;
      container.querySelector('.primary-swatch').style.backgroundColor = val;
      if (onColorChange) onColorChange(val, false);
    }
  });

  // Swatch click (Left click = Primary, Right click = Secondary)
  container.querySelectorAll('.swatch-tile, .swatch-tile-mini').forEach(tile => {
    tile.addEventListener('click', () => {
      const col = tile.dataset.color;
      nativePicker.value = col;
      hexInput.value = col;
      if (onColorChange) onColorChange(col, false);
    });

    tile.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const col = tile.dataset.color;
      if (onColorChange) onColorChange(col, true);
    });
  });

  // Swap Colors
  container.querySelector('#btn-swap-colors')?.addEventListener('click', () => {
    if (window.pixelForgeApp) {
      window.pixelForgeApp.swapColors();
    }
  });

  // Add Color to Palette
  container.querySelector('#btn-add-swatch')?.addEventListener('click', () => {
    if (onAddColorToPalette) onAddColorToPalette(primaryColor);
  });

  // Open Palette Manager
  container.querySelector('#btn-open-palette-mgr')?.addEventListener('click', () => {
    if (onOpenPaletteManager) onOpenPaletteManager();
  });

  // Change Palette Preset
  container.querySelector('#select-palette-preset')?.addEventListener('change', (e) => {
    if (onPaletteChange) onPaletteChange(e.target.value);
  });

  // Dither Threshold
  container.querySelector('#select-dither-threshold')?.addEventListener('change', (e) => {
    const val = parseInt(e.target.value, 10);
    if (onDitherThresholdChange) onDitherThresholdChange(val);
  });
}
