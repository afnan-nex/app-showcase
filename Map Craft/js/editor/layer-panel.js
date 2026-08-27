/**
 * MapCraft - Layer Management Panel
 * Complete layer hierarchy management with visibility, lock, reorder, duplicate, and deletion.
 */

import { getIcon, escapeHTML } from '../core/icons.js';

export function renderLayerPanel(container, {
  layers = [],
  activeLayerId,
  objects = [],
  onSelectLayer = null,
  onAddLayer = null,
  onRenameLayer = null,
  onDuplicateLayer = null,
  onDeleteLayer = null,
  onToggleVisibility = null,
  onToggleLock = null,
  onMoveLayer = null
}) {
  container.innerHTML = `
    <div class="panel-section-header flex items-center justify-between p-3 border-b">
      <div class="flex items-center gap-2">
        ${getIcon('layers', 'icon-sm text-primary')}
        <span class="text-xs font-bold uppercase text-muted">Map Layers (${layers.length})</span>
      </div>
      <button class="btn btn-xs btn-primary" id="btn-add-map-layer" title="Create New Map Layer">
        ${getIcon('plus', 'icon-xs')} Add Layer
      </button>
    </div>

    <div class="layers-list-scroll p-2 flex flex-col gap-1 overflow-y-auto flex-1">
      ${layers.map((layer, idx) => {
        const isActive = layer.id === activeLayerId;
        const layerObjs = objects.filter(o => o.layerId === layer.id);
        const count = layerObjs.length;

        return `
          <div class="layer-item-row card p-2 flex items-center justify-between ${isActive ? 'active' : ''}" data-id="${layer.id}">
            <div class="flex items-center gap-2 flex-1 cursor-pointer layer-select-target min-w-0" title="Click to activate layer">
              <span class="layer-index-badge text-muted font-mono text-xs">#${idx + 1}</span>
              <span class="layer-name font-semibold text-xs truncate flex-1">${escapeHTML(layer.name)}</span>
              <span class="badge badge-secondary text-xs font-mono" title="${count} objects on this layer">${count}</span>
            </div>

            <div class="layer-actions flex items-center gap-1 ml-2">
              <button class="btn-icon-xs btn-move-layer-up" data-idx="${idx}" title="Move Layer Up" ${idx === 0 ? 'disabled' : ''}>&uarr;</button>
              <button class="btn-icon-xs btn-move-layer-down" data-idx="${idx}" title="Move Layer Down" ${idx === layers.length - 1 ? 'disabled' : ''}>&darr;</button>
              <button class="btn-icon-xs btn-layer-vis ${layer.visible === false ? 'text-muted' : 'text-primary'}" data-id="${layer.id}" title="Toggle Visibility">
                ${getIcon(layer.visible !== false ? 'eye' : 'eyeOff', 'icon-xs')}
              </button>
              <button class="btn-icon-xs btn-layer-lock ${layer.locked ? 'text-amber' : 'text-muted'}" data-id="${layer.id}" title="Toggle Lock">
                ${getIcon(layer.locked ? 'lock' : 'unlock', 'icon-xs')}
              </button>
              <button class="btn-icon-xs btn-layer-dupe text-muted" data-id="${layer.id}" title="Duplicate Layer & Objects">
                ${getIcon('copy', 'icon-xs')}
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
    const name = prompt('Enter new layer name (e.g. Landmarks, Trade Routes, Hazards, Biomes):', 'New Layer');
    if (name && name.trim()) {
      if (onAddLayer) onAddLayer(name.trim());
    }
  });

  container.querySelectorAll('.layer-select-target').forEach(el => {
    el.addEventListener('click', () => {
      const row = el.closest('.layer-item-row');
      if (onSelectLayer) onSelectLayer(row.dataset.id);
    });

    // Double click to rename layer
    el.addEventListener('dblclick', () => {
      const row = el.closest('.layer-item-row');
      const layer = layers.find(l => l.id === row.dataset.id);
      if (!layer) return;
      const newName = prompt('Rename layer:', layer.name);
      if (newName && newName.trim() && onRenameLayer) {
        onRenameLayer(layer.id, newName.trim());
      }
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
      if (confirm('Delete this layer? All map elements placed on this layer will also be removed.')) {
        if (onDeleteLayer) onDeleteLayer(btn.dataset.id);
      }
    });
  });
}
