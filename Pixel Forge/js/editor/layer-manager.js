/**
 * PixelForge - Layer Manager Component
 * Multi-layer stack controller with opacity sliders, visibility, lock, and reordering.
 */

import { getIcon, escapeHTML } from '../core/icons.js';

export function renderLayerPanel(container, {
  layers = [],
  activeLayerId,
  onSelectLayer = null,
  onAddLayer = null,
  onDuplicateLayer = null,
  onDeleteLayer = null,
  onToggleVisibility = null,
  onToggleLock = null,
  onOpacityChange = null,
  onMoveLayer = null,
  onMergeDown = null
}) {
  container.innerHTML = `
    <div class="panel-section-header flex items-center justify-between p-3 border-b">
      <div class="flex items-center gap-2">
        ${getIcon('layers', 'icon-sm')}
        <span class="text-xs font-bold uppercase text-muted">Layers (${layers.length})</span>
      </div>
      <button class="btn btn-xs btn-primary" id="btn-add-layer">
        ${getIcon('plus', 'icon-xs')} New Layer
      </button>
    </div>

    <!-- Scrollable Layers Stack (Top layer first in Z-Order) -->
    <div class="layers-list-scroll p-2 flex flex-col gap-1 flex-1 overflow-y-auto">
      ${[...layers].reverse().map((layer, reverseIdx) => {
        const actualIdx = layers.length - 1 - reverseIdx;
        const isActive = layer.id === activeLayerId;

        return `
          <div class="layer-item-row card p-2 flex flex-col gap-2 ${isActive ? 'active' : ''}" data-id="${layer.id}">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 flex-1 cursor-pointer layer-select-target">
                <span class="layer-name font-semibold text-xs truncate">${escapeHTML(layer.name)}</span>
              </div>

              <div class="layer-actions flex items-center gap-1">
                <button class="btn-icon-xs btn-move-layer-up" data-idx="${actualIdx}" title="Move Up in Stack" ${actualIdx === layers.length - 1 ? 'disabled' : ''}>&uarr;</button>
                <button class="btn-icon-xs btn-move-layer-down" data-idx="${actualIdx}" title="Move Down in Stack" ${actualIdx === 0 ? 'disabled' : ''}>&darr;</button>
                <button class="btn-icon-xs btn-layer-vis" data-id="${layer.id}" title="Toggle Visibility">
                  ${getIcon(layer.visible !== false ? 'eye' : 'eyeOff', 'icon-xs')}
                </button>
                <button class="btn-icon-xs btn-layer-lock" data-id="${layer.id}" title="Toggle Lock">
                  ${getIcon(layer.locked ? 'lock' : 'unlock', 'icon-xs')}
                </button>
                <button class="btn-icon-xs btn-layer-dupe" data-id="${layer.id}" title="Duplicate Layer">
                  ${getIcon('copy', 'icon-xs')}
                </button>
                ${layers.length > 1 ? `
                  <button class="btn-icon-xs text-rose btn-layer-del" data-id="${layer.id}" title="Delete Layer">
                    ${getIcon('trash', 'icon-xs')}
                  </button>
                ` : ''}
              </div>
            </div>

            <!-- Layer Opacity Slider -->
            <div class="flex items-center gap-2">
              <span class="text-xs text-muted font-mono" style="font-size: 10px;">Opacity</span>
              <input type="range" min="0" max="1" step="0.05" class="form-control form-control-sm p-0 layer-opacity-slider flex-1" data-id="${layer.id}" value="${layer.opacity !== undefined ? layer.opacity : 1}" />
              <span class="text-xs font-mono text-muted w-8 text-right opacity-label" style="font-size: 10px;">${Math.round((layer.opacity !== undefined ? layer.opacity : 1) * 100)}%</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // --- Attach Handlers ---
  container.querySelector('#btn-add-layer')?.addEventListener('click', () => {
    if (onAddLayer) onAddLayer();
  });

  container.querySelectorAll('.layer-select-target').forEach(el => {
    el.addEventListener('click', () => {
      const row = el.closest('.layer-item-row');
      if (onSelectLayer) onSelectLayer(row.dataset.id);
    });
  });

  container.querySelectorAll('.btn-layer-vis').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onToggleVisibility) onToggleVisibility(btn.dataset.id);
    });
  });

  container.querySelectorAll('.btn-layer-lock').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onToggleLock) onToggleLock(btn.dataset.id);
    });
  });

  container.querySelectorAll('.btn-layer-dupe').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onDuplicateLayer) onDuplicateLayer(btn.dataset.id);
    });
  });

  container.querySelectorAll('.btn-layer-del').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onDeleteLayer) onDeleteLayer(btn.dataset.id);
    });
  });

  container.querySelectorAll('.btn-move-layer-up').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      if (onMoveLayer) onMoveLayer(idx, 1);
    });
  });

  container.querySelectorAll('.btn-move-layer-down').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      if (onMoveLayer) onMoveLayer(idx, -1);
    });
  });

  container.querySelectorAll('.layer-opacity-slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      const row = slider.closest('.layer-item-row');
      row.querySelector('.opacity-label').textContent = Math.round(val * 100) + '%';
      if (onOpacityChange) onOpacityChange(slider.dataset.id, val);
    });
  });
}
