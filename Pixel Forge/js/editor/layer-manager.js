/**
 * PixelForge - Layer Manager Component
 * Multi-layer stack controller with opacity sliders, blend modes, lock, visibility,
 * layer renaming, reordering, duplicate, and merge down.
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
  onBlendModeChange = null,
  onRenameLayer = null,
  onMoveLayer = null,
  onMergeDown = null,
  onFlatten = null
}) {
  if (!container) return;

  container.innerHTML = `
    <div class="panel-section-header flex items-center justify-between p-3 border-b">
      <div class="flex items-center gap-2">
        ${getIcon('layers', 'icon-sm')}
        <span class="text-xs font-bold uppercase text-muted">Layers (${layers.length})</span>
      </div>
      <div class="flex items-center gap-1">
        ${layers.length > 1 ? `
          <button class="btn btn-xs btn-secondary" id="btn-flatten-layers" title="Flatten All Visible Layers">
            ${getIcon('flatten', 'icon-xs')} Flatten
          </button>
        ` : ''}
        <button class="btn btn-xs btn-primary" id="btn-add-layer" title="Create New Layer">
          ${getIcon('plus', 'icon-xs')} New Layer
        </button>
      </div>
    </div>

    <!-- Scrollable Layers Stack (Top layer first in visual stack) -->
    <div class="layers-list-scroll p-2 flex flex-col gap-1 flex-1 overflow-y-auto">
      ${[...layers].reverse().map((layer, reverseIdx) => {
        const actualIdx = layers.length - 1 - reverseIdx;
        const isActive = layer.id === activeLayerId;

        return `
          <div class="layer-item-row card p-2 flex flex-col gap-2 ${isActive ? 'active' : ''}" data-id="${layer.id}" data-idx="${actualIdx}">
            <div class="flex items-center justify-between">
              <!-- Select / Rename Target -->
              <div class="flex items-center gap-2 flex-1 cursor-pointer layer-select-target truncate" title="Click to select, double-click to rename">
                <span class="layer-name font-semibold text-xs truncate" data-id="${layer.id}">${escapeHTML(layer.name)}</span>
              </div>

              <!-- Quick Action Icons -->
              <div class="layer-actions flex items-center gap-1">
                <button class="btn-icon-xs btn-move-layer-up" data-idx="${actualIdx}" title="Move Up in Stack" ${actualIdx === layers.length - 1 ? 'disabled' : ''}>&uarr;</button>
                <button class="btn-icon-xs btn-move-layer-down" data-idx="${actualIdx}" title="Move Down in Stack" ${actualIdx === 0 ? 'disabled' : ''}>&darr;</button>
                <button class="btn-icon-xs btn-layer-vis" data-id="${layer.id}" title="Toggle Visibility">
                  ${getIcon(layer.visible !== false ? 'eye' : 'eyeOff', 'icon-xs')}
                </button>
                <button class="btn-icon-xs btn-layer-lock" data-id="${layer.id}" title="Toggle Lock (Prevent Edits)">
                  ${getIcon(layer.locked ? 'lock' : 'unlock', 'icon-xs')}
                </button>
                <button class="btn-icon-xs btn-layer-dupe" data-id="${layer.id}" title="Duplicate Layer">
                  ${getIcon('copy', 'icon-xs')}
                </button>
                ${actualIdx > 0 ? `
                  <button class="btn-icon-xs btn-layer-merge" data-id="${layer.id}" data-idx="${actualIdx}" title="Merge Down with Lower Layer">
                    ${getIcon('merge', 'icon-xs')}
                  </button>
                ` : ''}
                ${layers.length > 1 ? `
                  <button class="btn-icon-xs text-rose btn-layer-del" data-id="${layer.id}" title="Delete Layer">
                    ${getIcon('trash', 'icon-xs')}
                  </button>
                ` : ''}
              </div>
            </div>

            <!-- Layer Controls: Blend Mode & Opacity -->
            <div class="flex items-center gap-2">
              <select class="form-control form-control-sm layer-blend-select w-20 text-xs p-0" data-id="${layer.id}" title="Layer Blend Mode">
                <option value="normal" ${(!layer.blendMode || layer.blendMode === 'normal') ? 'selected' : ''}>Normal</option>
                <option value="multiply" ${layer.blendMode === 'multiply' ? 'selected' : ''}>Multiply</option>
                <option value="screen" ${layer.blendMode === 'screen' ? 'selected' : ''}>Screen</option>
                <option value="overlay" ${layer.blendMode === 'overlay' ? 'selected' : ''}>Overlay</option>
                <option value="darken" ${layer.blendMode === 'darken' ? 'selected' : ''}>Darken</option>
                <option value="lighten" ${layer.blendMode === 'lighten' ? 'selected' : ''}>Lighten</option>
              </select>

              <input type="range" min="0" max="1" step="0.05" class="form-control form-control-sm p-0 layer-opacity-slider flex-1" data-id="${layer.id}" value="${layer.opacity !== undefined ? layer.opacity : 1}" title="Layer Opacity" />
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

  container.querySelector('#btn-flatten-layers')?.addEventListener('click', () => {
    if (onFlatten) onFlatten();
  });

  container.querySelectorAll('.layer-select-target').forEach(el => {
    el.addEventListener('click', () => {
      const row = el.closest('.layer-item-row');
      if (onSelectLayer) onSelectLayer(row.dataset.id);
    });

    el.addEventListener('dblclick', () => {
      const nameSpan = el.querySelector('.layer-name');
      const curName = nameSpan.textContent;
      const newName = prompt('Enter new layer name:', curName);
      if (newName && newName.trim() && onRenameLayer) {
        onRenameLayer(nameSpan.dataset.id, newName.trim());
      }
    });
  });

  container.querySelectorAll('.btn-layer-vis').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (onToggleVisibility) onToggleVisibility(btn.dataset.id);
    });
  });

  container.querySelectorAll('.btn-layer-lock').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (onToggleLock) onToggleLock(btn.dataset.id);
    });
  });

  container.querySelectorAll('.btn-layer-dupe').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (onDuplicateLayer) onDuplicateLayer(btn.dataset.id);
    });
  });

  container.querySelectorAll('.btn-layer-merge').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx, 10);
      if (onMergeDown) onMergeDown(idx);
    });
  });

  container.querySelectorAll('.btn-layer-del').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (onDeleteLayer) onDeleteLayer(btn.dataset.id);
    });
  });

  container.querySelectorAll('.btn-move-layer-up').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx, 10);
      if (onMoveLayer) onMoveLayer(idx, 1);
    });
  });

  container.querySelectorAll('.btn-move-layer-down').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx, 10);
      if (onMoveLayer) onMoveLayer(idx, -1);
    });
  });

  container.querySelectorAll('.layer-blend-select').forEach(sel => {
    sel.addEventListener('change', (e) => {
      if (onBlendModeChange) onBlendModeChange(sel.dataset.id, e.target.value);
    });
  });

  container.querySelectorAll('.layer-opacity-slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      const row = slider.closest('.layer-item-row');
      const label = row?.querySelector('.opacity-label');
      if (label) label.textContent = Math.round(val * 100) + '%';
      if (onOpacityChange) onOpacityChange(slider.dataset.id, val);
    });
  });
}
