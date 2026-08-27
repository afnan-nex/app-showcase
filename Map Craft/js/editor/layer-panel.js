/**
 * MapCraft - Layer Management Panel
 * Layer hierarchy with visibility, lock, reorder, and layer assignments.
 */

import { getIcon, escapeHTML } from '../core/icons.js';

export function renderLayerPanel(container, {
  layers = [],
  activeLayerId,
  objects = [],
  onSelectLayer = null,
  onAddLayer = null,
  onDeleteLayer = null,
  onToggleVisibility = null,
  onToggleLock = null,
  onMoveLayer = null
}) {
  container.innerHTML = `
    <div class="panel-section-header flex items-center justify-between p-3 border-b">
      <div class="flex items-center gap-2">
        ${getIcon('layers', 'icon-sm')}
        <span class="text-xs font-bold uppercase text-muted">Map Layers (${layers.length})</span>
      </div>
      <button class="btn btn-xs btn-primary" id="btn-add-map-layer">
        ${getIcon('plus', 'icon-xs')} Add Layer
      </button>
    </div>

    <div class="layers-list-scroll p-2 flex flex-col gap-1">
      ${layers.map((layer, idx) => {
        const isActive = layer.id === activeLayerId;
        const count = objects.filter(o => o.layerId === layer.id).length;

        return `
          <div class="layer-item-row card p-2 flex items-center justify-between ${isActive ? 'active' : ''}" data-id="${layer.id}">
            <div class="flex items-center gap-2 flex-1 cursor-pointer layer-select-target">
              <span class="layer-drag-handle text-muted font-mono text-xs">#${idx + 1}</span>
              <span class="layer-name font-semibold text-xs truncate">${escapeHTML(layer.name)}</span>
              <span class="badge badge-secondary text-xs font-mono">${count}</span>
            </div>

            <div class="layer-actions flex items-center gap-1">
              <button class="btn-icon-xs btn-move-layer-up" data-idx="${idx}" title="Move Up" ${idx === 0 ? 'disabled' : ''}>&uarr;</button>
              <button class="btn-icon-xs btn-move-layer-down" data-idx="${idx}" title="Move Down" ${idx === layers.length - 1 ? 'disabled' : ''}>&darr;</button>
              <button class="btn-icon-xs btn-layer-vis" data-id="${layer.id}" title="Toggle Visibility">
                ${getIcon(layer.visible !== false ? 'eye' : 'eyeOff', 'icon-xs')}
              </button>
              <button class="btn-icon-xs btn-layer-lock" data-id="${layer.id}" title="Toggle Lock">
                ${getIcon(layer.locked ? 'lock' : 'unlock', 'icon-xs')}
              </button>
              ${layers.length > 1 ? `
                <button class="btn-icon-xs text-rose btn-layer-del" data-id="${layer.id}" title="Delete Layer">
                  ${getIcon('trash', 'icon-xs')}
                </button>
              ` : ''}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // --- Attach Handlers ---
  container.querySelector('#btn-add-map-layer')?.addEventListener('click', () => {
    const name = prompt('Enter new layer name (e.g. Landmarks, Trade Routes, Hazards):', 'New Layer');
    if (name && name.trim()) {
      if (onAddLayer) onAddLayer(name.trim());
    }
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

  container.querySelectorAll('.btn-move-layer-up').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      if (onMoveLayer) onMoveLayer(idx, -1);
    });
  });

  container.querySelectorAll('.btn-move-layer-down').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      if (onMoveLayer) onMoveLayer(idx, 1);
    });
  });

  container.querySelectorAll('.btn-layer-del').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Delete this layer? Objects on this layer will also be removed.')) {
        if (onDeleteLayer) onDeleteLayer(btn.dataset.id);
      }
    });
  });
}
