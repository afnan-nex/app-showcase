/**
 * PixelForge - Color Picker & Palette Manager Component
 * Primary/Secondary color swatches, HSV color input, curated retro palettes, and recent history.
 */

import { getIcon, escapeHTML } from '../core/icons.js';
import { PALETTES } from '../core/palettes.js';
import { hexToRgb, rgbToHex } from '../core/math-draw.js';

export function renderColorPanel(container, {
  primaryColor = '#58a6ff',
  secondaryColor = '#000000',
  currentPaletteId = 'pico8',
  customPalette = [],
  recentColors = [],
  onColorChange = null,
  onPaletteChange = null
}) {
  const currentPalette = PALETTES[currentPaletteId] || { name: 'Custom', colors: customPalette };

  container.innerHTML = `
    <!-- Top Primary & Secondary Swatches -->
    <div class="color-swatches-master flex items-center justify-between p-3 border-b">
      <div class="flex items-center gap-3">
        <!-- Dual Color Box -->
        <div class="dual-color-container relative w-12 h-10">
          <div class="color-box secondary-swatch absolute" style="background-color: ${secondaryColor};" title="Secondary Color (Right Click)"></div>
          <div class="color-box primary-swatch absolute" style="background-color: ${primaryColor};" title="Primary Color (Left Click)"></div>
        </div>

        <div class="flex flex-col">
          <span class="font-mono text-xs font-bold uppercase text-primary" id="primary-hex-label">${primaryColor}</span>
          <span class="text-xs text-muted">Primary / Alt</span>
        </div>
      </div>

      <button class="btn-icon-xs text-muted" id="btn-swap-colors" title="Swap Colors (X)">
        ${getIcon('swap', 'icon-xs')}
      </button>
    </div>

    <!-- Color Inputs & Native Pickers -->
    <div class="p-3 border-b flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <input type="color" id="native-color-picker" class="p-0 w-8 h-7 cursor-pointer border-none rounded" value="${primaryColor}" />
        <input type="text" id="input-hex-val" class="form-control form-control-sm font-mono flex-1 text-center" value="${primaryColor}" />
      </div>
    </div>

    <!-- Palette Selection & Swatches -->
    <div class="p-3 flex-1 overflow-y-auto flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <select id="select-palette-preset" class="form-control form-control-sm flex-1 font-semibold">
          ${Object.values(PALETTES).map(p => `<option value="${p.id}" ${currentPaletteId === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
        </select>
      </div>

      <!-- Swatches Grid -->
      <div class="palette-swatches-grid">
        ${currentPalette.colors.map(col => `
          <div class="swatch-tile ${col.toLowerCase() === primaryColor.toLowerCase() ? 'selected' : ''}" style="background-color: ${col};" data-color="${col}" title="${col}"></div>
        `).join('')}
      </div>

      <!-- Recent Colors -->
      ${recentColors.length > 0 ? `
        <div class="border-t pt-2 mt-2">
          <span class="text-xs font-bold uppercase text-muted block mb-1">Recent Colors</span>
          <div class="flex flex-wrap gap-1">
            ${recentColors.slice(0, 12).map(c => `
              <div class="swatch-tile-mini" style="background-color: ${c};" data-color="${c}" title="${c}"></div>
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

  // Change Palette Preset
  container.querySelector('#select-palette-preset')?.addEventListener('change', (e) => {
    if (onPaletteChange) onPaletteChange(e.target.value);
  });
}
