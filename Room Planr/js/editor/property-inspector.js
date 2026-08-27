/**
 * RoomPlanr - Property Inspector Panel
 * Right sidebar for room dimensions, floor materials, wall colors, and selected object transform controls.
 */

import { getIcon, escapeHTML } from '../core/icons.js';
import { formatDimension, UNITS, parseToMeters } from '../core/units.js';
import { FLOOR_MATERIALS } from '../engine/catalog.js';
import { getDistancesToWalls } from '../engine/collision.js';

export function renderPropertyInspector(container, {
  room,
  selectedItem = null,
  unit = UNITS.METERS,
  onUpdateRoom = null,
  onUpdateItem = null,
  onDuplicateItem = null,
  onDeleteItem = null
}) {
  const dist = selectedItem ? getDistancesToWalls(selectedItem, room.width, room.depth) : null;

  container.innerHTML = `
    <!-- Top Inspector Header -->
    <div class="panel-section-header flex items-center justify-between p-3 border-b">
      <div class="flex items-center gap-2">
        ${getIcon(selectedItem ? 'sofa' : 'room', 'icon-sm text-primary')}
        <span class="text-xs font-bold uppercase text-muted">
          ${selectedItem ? 'Object Properties' : 'Room Specification'}
        </span>
      </div>
    </div>

    <!-- Inspector Body Scroll -->
    <div class="inspector-body-scroll p-3 flex flex-col gap-3 flex-1 overflow-y-auto">
      
      <!-- Selected Furniture Properties -->
      ${selectedItem ? `
        <div class="card p-3 flex flex-col gap-2.5">
          <div class="flex items-center justify-between">
            <span class="font-bold text-xs text-primary truncate">${escapeHTML(selectedItem.name)}</span>
            <div class="flex items-center gap-1">
              <button class="btn-icon-xs" id="btn-inspect-dupe" title="Duplicate (Ctrl+D)">${getIcon('copy', 'icon-xs')}</button>
              <button class="btn-icon-xs text-rose" id="btn-inspect-del" title="Delete (Delete)">${getIcon('trash', 'icon-xs')}</button>
            </div>
          </div>

          <!-- Dimensions (W x D x H) -->
          <div class="grid grid-cols-2 gap-2">
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Width</label>
              <input type="number" step="0.05" id="inp-item-width" class="form-control form-control-sm font-mono" value="${selectedItem.width}" />
            </div>
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Depth</label>
              <input type="number" step="0.05" id="inp-item-depth" class="form-control form-control-sm font-mono" value="${selectedItem.depth}" />
            </div>
          </div>

          <!-- Position (X, Y) -->
          <div class="grid grid-cols-2 gap-2">
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Position X</label>
              <input type="number" step="0.05" id="inp-item-x" class="form-control form-control-sm font-mono" value="${selectedItem.x.toFixed(2)}" />
            </div>
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Position Y</label>
              <input type="number" step="0.05" id="inp-item-y" class="form-control form-control-sm font-mono" value="${selectedItem.y.toFixed(2)}" />
            </div>
          </div>

          <!-- Rotation -->
          <div class="form-group">
            <div class="flex items-center justify-between mb-1">
              <label class="form-label text-xs font-semibold text-muted">Rotation Angle</label>
              <span class="font-mono text-xs font-bold text-primary" id="lbl-item-rot">${selectedItem.rotation || 0}&deg;</span>
            </div>
            <div class="flex items-center gap-2">
              <input type="range" min="0" max="360" step="15" id="slider-item-rot" class="form-control form-control-sm p-0 flex-1" value="${selectedItem.rotation || 0}" />
              <button class="btn btn-xs btn-secondary" id="btn-quick-rot" title="Rotate +45°">+45&deg;</button>
            </div>
          </div>

          <!-- Color & Material -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Item Color</label>
            <div class="flex items-center gap-2">
              <input type="color" id="inp-item-color" class="p-0 w-8 h-7 cursor-pointer border-none rounded" value="${selectedItem.color || '#475569'}" />
              <input type="text" id="inp-item-mat" class="form-control form-control-sm flex-1 font-mono text-xs" value="${escapeHTML(selectedItem.material || 'Standard Finish')}" />
            </div>
          </div>

          <!-- Wall Clearances Readout -->
          ${dist ? `
            <div class="border-t pt-2 mt-1">
              <span class="text-xs font-bold uppercase text-muted block mb-1.5">Wall Clearances</span>
              <div class="grid grid-cols-2 gap-1.5 font-mono text-xs text-muted" style="font-size: 10px;">
                <div class="card p-1 text-center">Left: <strong class="text-primary">${formatDimension(dist.left, unit)}</strong></div>
                <div class="card p-1 text-center">Right: <strong class="text-primary">${formatDimension(dist.right, unit)}</strong></div>
                <div class="card p-1 text-center">Top: <strong class="text-primary">${formatDimension(dist.top, unit)}</strong></div>
                <div class="card p-1 text-center">Bottom: <strong class="text-primary">${formatDimension(dist.bottom, unit)}</strong></div>
              </div>
            </div>
          ` : ''}
        </div>
      ` : ''}

      <!-- Room Dimensions & Materials Card -->
      <div class="card p-3 flex flex-col gap-2.5">
        <span class="font-bold text-xs text-primary uppercase">Room Boundary & Dimensions</span>

        <div class="grid grid-cols-2 gap-2">
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Room Width</label>
            <input type="number" step="0.5" id="inp-room-width" class="form-control form-control-sm font-mono font-bold" value="${room.width}" />
          </div>
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Room Depth</label>
            <input type="number" step="0.5" id="inp-room-depth" class="form-control form-control-sm font-mono font-bold" value="${room.depth}" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label text-xs font-semibold text-muted">Ceiling Wall Height</label>
          <input type="number" step="0.1" id="inp-room-height" class="form-control form-control-sm font-mono" value="${room.height || 2.80}" />
        </div>

        <!-- Floor Material Selection -->
        <div class="form-group">
          <label class="form-label text-xs font-semibold text-muted">Flooring Material</label>
          <select id="select-floor-material" class="form-control form-control-sm font-semibold">
            ${Object.values(FLOOR_MATERIALS).map(mat => `
              <option value="${mat.id}" ${room.floorMaterial === mat.id ? 'selected' : ''}>${mat.name}</option>
            `).join('')}
          </select>
        </div>

        <!-- Wall Color -->
        <div class="form-group">
          <label class="form-label text-xs font-semibold text-muted">Wall Paint Finish</label>
          <div class="flex items-center gap-2">
            <input type="color" id="inp-wall-color" class="p-0 w-8 h-7 cursor-pointer border-none rounded" value="${room.wallColor || '#1e293b'}" />
            <span class="font-mono text-xs text-secondary" id="lbl-wall-color-hex">${room.wallColor || '#1e293b'}</span>
          </div>
        </div>
      </div>

    </div>
  `;

  // Attach Item Property Handlers
  if (selectedItem) {
    container.querySelector('#inp-item-width')?.addEventListener('change', (e) => {
      selectedItem.width = parseFloat(e.target.value) || 1;
      if (onUpdateItem) onUpdateItem(selectedItem);
    });
    container.querySelector('#inp-item-depth')?.addEventListener('change', (e) => {
      selectedItem.depth = parseFloat(e.target.value) || 1;
      if (onUpdateItem) onUpdateItem(selectedItem);
    });
    container.querySelector('#inp-item-x')?.addEventListener('change', (e) => {
      selectedItem.x = parseFloat(e.target.value) || 0;
      if (onUpdateItem) onUpdateItem(selectedItem);
    });
    container.querySelector('#inp-item-y')?.addEventListener('change', (e) => {
      selectedItem.y = parseFloat(e.target.value) || 0;
      if (onUpdateItem) onUpdateItem(selectedItem);
    });

    const rotSlider = container.querySelector('#slider-item-rot');
    const rotLabel = container.querySelector('#lbl-item-rot');
    rotSlider?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      selectedItem.rotation = val;
      if (rotLabel) rotLabel.innerHTML = `${val}&deg;`;
      if (onUpdateItem) onUpdateItem(selectedItem);
    });

    container.querySelector('#btn-quick-rot')?.addEventListener('click', () => {
      const newRot = ((selectedItem.rotation || 0) + 45) % 360;
      selectedItem.rotation = newRot;
      if (rotSlider) rotSlider.value = newRot;
      if (rotLabel) rotLabel.innerHTML = `${newRot}&deg;`;
      if (onUpdateItem) onUpdateItem(selectedItem);
    });

    container.querySelector('#inp-item-color')?.addEventListener('input', (e) => {
      selectedItem.color = e.target.value;
      if (onUpdateItem) onUpdateItem(selectedItem);
    });
    container.querySelector('#inp-item-mat')?.addEventListener('change', (e) => {
      selectedItem.material = e.target.value;
      if (onUpdateItem) onUpdateItem(selectedItem);
    });

    container.querySelector('#btn-inspect-dupe')?.addEventListener('click', () => {
      if (onDuplicateItem) onDuplicateItem(selectedItem.id);
    });
    container.querySelector('#btn-inspect-del')?.addEventListener('click', () => {
      if (onDeleteItem) onDeleteItem(selectedItem.id);
    });
  }

  // Attach Room Property Handlers
  container.querySelector('#inp-room-width')?.addEventListener('change', (e) => {
    room.width = Math.max(2, parseFloat(e.target.value) || 5);
    if (onUpdateRoom) onUpdateRoom(room);
  });
  container.querySelector('#inp-room-depth')?.addEventListener('change', (e) => {
    room.depth = Math.max(2, parseFloat(e.target.value) || 4);
    if (onUpdateRoom) onUpdateRoom(room);
  });
  container.querySelector('#inp-room-height')?.addEventListener('change', (e) => {
    room.height = Math.max(1.8, parseFloat(e.target.value) || 2.8);
    if (onUpdateRoom) onUpdateRoom(room);
  });
  container.querySelector('#select-floor-material')?.addEventListener('change', (e) => {
    room.floorMaterial = e.target.value;
    if (onUpdateRoom) onUpdateRoom(room);
  });
  container.querySelector('#inp-wall-color')?.addEventListener('input', (e) => {
    room.wallColor = e.target.value;
    container.querySelector('#lbl-wall-color-hex').textContent = e.target.value;
    if (onUpdateRoom) onUpdateRoom(room);
  });
}
