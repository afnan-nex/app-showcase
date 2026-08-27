/**
 * RoomPlanr - Property Inspector & Takeoff Panel
 * Right sidebar for room dimensions, floor materials, wall colors, selected object transform controls, and live BOM takeoff.
 */

import { getIcon, escapeHTML } from '../core/icons.js';
import { formatDimension, formatArea, formatPrice, UNITS } from '../core/units.js';
import { FLOOR_MATERIALS } from '../engine/catalog.js';
import { getDistancesToWalls } from '../engine/collision.js';

export function renderPropertyInspector(container, {
  room,
  selectedItem = null,
  activeTab = 'properties', // 'properties', 'room', 'takeoff'
  unit = UNITS.METERS,
  currency = 'USD',
  onTabChange = null,
  onUpdateRoom = null,
  onUpdateItem = null,
  onDuplicateItem = null,
  onDeleteItem = null,
  onExportBOM = null,
  onCopyBOM = null,
  onOpenProjectModal = null
}) {
  const dist = selectedItem ? getDistancesToWalls(selectedItem, room.width, room.depth) : null;
  const items = (room.scenarios && room.scenarios[room.activeScenarioId || 'scenario_a']?.items) || [];

  // Calculate BOM & Area stats
  const totalFloorArea = room.width * room.depth;
  const floorMat = FLOOR_MATERIALS[room.floorMaterial] || FLOOR_MATERIALS.oak;
  const flooringCost = totalFloorArea * (floorMat.costPerSqM || 100);

  let furnitureTotalCost = 0;
  items.forEach(i => {
    furnitureTotalCost += (i.price || 0);
  });
  const grandTotalCost = flooringCost + furnitureTotalCost;

  container.innerHTML = `
    <!-- Top Inspector Tabs -->
    <div class="panel-section-header flex items-center justify-between border-b p-1" style="background-color: var(--bg-elevated);">
      <div class="flex items-center gap-1 w-full" role="tablist">
        <button class="btn btn-xs ${activeTab === 'properties' ? 'btn-primary' : 'btn-secondary'} flex-1 inspector-tab-btn" data-tab="properties" role="tab" aria-selected="${activeTab === 'properties'}">
          ${getIcon('sofa', 'icon-xs')} Object
        </button>
        <button class="btn btn-xs ${activeTab === 'room' ? 'btn-primary' : 'btn-secondary'} flex-1 inspector-tab-btn" data-tab="room" role="tab" aria-selected="${activeTab === 'room'}">
          ${getIcon('room', 'icon-xs')} Room
        </button>
        <button class="btn btn-xs ${activeTab === 'takeoff' ? 'btn-primary' : 'btn-secondary'} flex-1 inspector-tab-btn" data-tab="takeoff" role="tab" aria-selected="${activeTab === 'takeoff'}">
          ${getIcon('bom', 'icon-xs')} Takeoff
        </button>
      </div>
    </div>

    <!-- Inspector Body Scroll -->
    <div class="inspector-body-scroll p-3 flex flex-col gap-3 flex-1 overflow-y-auto">
      
      <!-- TAB 1: OBJECT PROPERTIES -->
      ${activeTab === 'properties' ? `
        ${selectedItem ? `
          <div class="card p-3 flex flex-col gap-2.5">
            <div class="flex items-center justify-between border-b pb-2">
              <div class="flex items-center gap-1.5 truncate">
                <span class="font-bold text-xs text-primary truncate">${escapeHTML(selectedItem.name)}</span>
              </div>
              <div class="flex items-center gap-1">
                <button class="btn-icon-xs" id="btn-inspect-dupe" title="Duplicate (Ctrl+D)" aria-label="Duplicate item">${getIcon('copy', 'icon-xs')}</button>
                <button class="btn-icon-xs text-rose" id="btn-inspect-del" title="Delete (Delete)" aria-label="Delete item">${getIcon('trash', 'icon-xs')}</button>
              </div>
            </div>

            <!-- Dimensions (W x D x H) -->
            <div class="grid grid-cols-2 gap-2">
              <div class="form-group">
                <label class="form-label text-xs font-semibold text-muted">Width (${unit})</label>
                <input type="number" step="0.05" min="0.1" max="20" id="inp-item-width" class="form-control form-control-sm font-mono" value="${selectedItem.width}" />
              </div>
              <div class="form-group">
                <label class="form-label text-xs font-semibold text-muted">Depth (${unit})</label>
                <input type="number" step="0.05" min="0.1" max="20" id="inp-item-depth" class="form-control form-control-sm font-mono" value="${selectedItem.depth}" />
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
                <input type="range" min="0" max="360" step="15" id="slider-item-rot" class="form-control form-control-sm p-0 flex-1" value="${selectedItem.rotation || 0}" aria-label="Item rotation angle" />
                <button class="btn btn-xs btn-secondary" id="btn-quick-rot" title="Rotate +45°">+45&deg;</button>
              </div>
            </div>

            <!-- Color & Material -->
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Color & Material</label>
              <div class="flex items-center gap-2">
                <input type="color" id="inp-item-color" class="p-0 w-8 h-7 cursor-pointer border-none rounded" value="${selectedItem.color || '#475569'}" aria-label="Item color" />
                <input type="text" id="inp-item-mat" class="form-control form-control-sm flex-1 font-mono text-xs" value="${escapeHTML(selectedItem.material || 'Standard Finish')}" />
              </div>
            </div>

            <!-- Estimated Price -->
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Unit Cost (${currency})</label>
              <input type="number" step="50" min="0" id="inp-item-price" class="form-control form-control-sm font-mono" value="${selectedItem.price || 0}" />
            </div>

            <!-- Wall Clearances Readout -->
            ${dist ? `
              <div class="border-t pt-2 mt-1">
                <span class="text-xs font-bold uppercase text-muted block mb-1.5" style="font-size: 10px;">Perpendicular Clearances</span>
                <div class="grid grid-cols-2 gap-1.5 font-mono text-xs text-muted" style="font-size: 10.5px;">
                  <div class="card p-1 text-center">Left: <strong class="text-primary">${formatDimension(dist.left, unit)}</strong></div>
                  <div class="card p-1 text-center">Right: <strong class="text-primary">${formatDimension(dist.right, unit)}</strong></div>
                  <div class="card p-1 text-center">Top: <strong class="text-primary">${formatDimension(dist.top, unit)}</strong></div>
                  <div class="card p-1 text-center">Bottom: <strong class="text-primary">${formatDimension(dist.bottom, unit)}</strong></div>
                </div>
              </div>
            ` : ''}
          </div>
        ` : `
          <div class="card p-4 text-center text-muted text-xs flex flex-col items-center gap-2">
            ${getIcon('sofa', 'icon-sm text-muted')}
            <span>Select any furniture item on the canvas to inspect and edit its spatial properties.</span>
          </div>
        `}
      ` : ''}

      <!-- TAB 2: ROOM DIMENSIONS & SPECIFICATION -->
      ${activeTab === 'room' ? `
        <div class="card p-3 flex flex-col gap-2.5">
          <div class="flex items-center justify-between border-b pb-2">
            <span class="font-bold text-xs text-primary uppercase" style="letter-spacing: 0.5px;">Room Specification</span>
            <button class="btn btn-xs btn-secondary" id="btn-open-proj-settings" title="Edit Client & Project Title Block">
              ${getIcon('settings', 'icon-xs')} Project Info
            </button>
          </div>

          <!-- Dimensions (W x D x H) -->
          <div class="grid grid-cols-2 gap-2">
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Room Width (${unit})</label>
              <input type="number" step="0.2" min="2" max="40" id="inp-room-width" class="form-control form-control-sm font-mono font-bold" value="${room.width}" />
            </div>
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Room Depth (${unit})</label>
              <input type="number" step="0.2" min="2" max="40" id="inp-room-depth" class="form-control form-control-sm font-mono font-bold" value="${room.depth}" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Ceiling Clearance Height (${unit})</label>
            <input type="number" step="0.1" min="1.8" max="10" id="inp-room-height" class="form-control form-control-sm font-mono" value="${room.height || 2.85}" />
          </div>

          <!-- Floor Area Stats -->
          <div class="card p-2 flex items-center justify-between bg-elevated text-xs font-mono">
            <span class="text-muted">Floor Area:</span>
            <strong class="text-primary">${formatArea(totalFloorArea, unit)}</strong>
          </div>

          <!-- Flooring Material -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Floor Finish</label>
            <select id="select-floor-material" class="form-control form-control-sm font-semibold">
              ${Object.values(FLOOR_MATERIALS).map(mat => `
                <option value="${mat.id}" ${room.floorMaterial === mat.id ? 'selected' : ''}>${mat.name} (${formatPrice(mat.costPerSqM, currency)}/m²)</option>
              `).join('')}
            </select>
          </div>

          <!-- Wall Paint Color -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Wall Paint Finish</label>
            <div class="flex items-center gap-2">
              <input type="color" id="inp-wall-color" class="p-0 w-8 h-7 cursor-pointer border-none rounded" value="${room.wallColor || '#1e293b'}" aria-label="Wall paint color" />
              <span class="font-mono text-xs text-secondary" id="lbl-wall-color-hex">${room.wallColor || '#1e293b'}</span>
            </div>
          </div>

          <!-- Client & Project Metadata Box -->
          <div class="border-t pt-2 mt-1">
            <span class="text-xs font-bold uppercase text-muted block mb-1" style="font-size: 10px;">Project Metadata</span>
            <div class="text-xs text-muted flex flex-col gap-0.5" style="font-size: 11px;">
              <div><strong>Project:</strong> ${escapeHTML(room.name || 'Custom Room')}</div>
              <div><strong>Client:</strong> ${escapeHTML(room.client || 'Private Client')}</div>
              <div><strong>Firm:</strong> ${escapeHTML(room.firm || 'Studio Kōva Architecture')}</div>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- TAB 3: BILL OF MATERIALS & TAKEOFF -->
      ${activeTab === 'takeoff' ? `
        <div class="card p-3 flex flex-col gap-2.5">
          <div class="flex items-center justify-between border-b pb-2">
            <span class="font-bold text-xs text-primary uppercase" style="letter-spacing: 0.5px;">Schedule & Takeoff</span>
            <div class="flex items-center gap-1">
              <button class="btn btn-xs btn-secondary" id="btn-copy-takeoff" title="Copy schedule to clipboard">${getIcon('copy', 'icon-xs')} Copy</button>
              <button class="btn btn-xs btn-primary" id="btn-export-bom-csv" title="Export CSV spreadsheet">${getIcon('download', 'icon-xs')} CSV</button>
            </div>
          </div>

          <!-- Cost Summary Badges -->
          <div class="grid grid-cols-2 gap-1.5 font-mono text-xs">
            <div class="card p-2 flex flex-col">
              <span class="text-muted" style="font-size: 10px;">Flooring Finish</span>
              <strong class="text-primary">${formatPrice(flooringCost, currency)}</strong>
            </div>
            <div class="card p-2 flex flex-col">
              <span class="text-muted" style="font-size: 10px;">Furnishing Total</span>
              <strong class="text-primary">${formatPrice(furnitureTotalCost, currency)}</strong>
            </div>
          </div>

          <div class="card p-2 flex items-center justify-between font-mono bg-elevated">
            <span class="text-xs font-bold text-muted">Grand Total:</span>
            <strong class="text-sm text-emerald font-bold">${formatPrice(grandTotalCost, currency)}</strong>
          </div>

          <!-- Items Table -->
          <div class="border-t pt-2">
            <span class="text-xs font-bold uppercase text-muted block mb-1.5" style="font-size: 10px;">Itemized Schedule (${items.length} fixtures)</span>
            <div class="flex flex-col gap-1 max-h-64 overflow-y-auto">
              ${items.map((it, idx) => `
                <div class="card p-1.5 flex items-center justify-between hover-elevated text-xs font-mono">
                  <div class="flex flex-col truncate">
                    <span class="font-bold text-primary truncate" style="font-size: 11px;">${idx + 1}. ${escapeHTML(it.name)}</span>
                    <span class="text-muted" style="font-size: 9.5px;">${formatDimension(it.width, unit)} &times; ${formatDimension(it.depth, unit)} &bull; ${escapeHTML(it.material || 'Standard')}</span>
                  </div>
                  <strong class="text-secondary ml-2 font-mono">${formatPrice(it.price || 0, currency)}</strong>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      ` : ''}

    </div>
  `;

  // Attach Tab Switcher Handlers
  container.querySelectorAll('.inspector-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onTabChange) onTabChange(btn.dataset.tab);
    });
  });

  // Attach Item Handlers
  if (selectedItem && activeTab === 'properties') {
    container.querySelector('#inp-item-width')?.addEventListener('change', (e) => {
      selectedItem.width = Math.max(0.1, parseFloat(e.target.value) || 1);
      if (onUpdateItem) onUpdateItem(selectedItem);
    });
    container.querySelector('#inp-item-depth')?.addEventListener('change', (e) => {
      selectedItem.depth = Math.max(0.1, parseFloat(e.target.value) || 1);
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
    container.querySelector('#inp-item-price')?.addEventListener('change', (e) => {
      selectedItem.price = Math.max(0, parseFloat(e.target.value) || 0);
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

  // Attach Room Handlers
  if (activeTab === 'room') {
    container.querySelector('#inp-room-width')?.addEventListener('change', (e) => {
      room.width = Math.max(2, parseFloat(e.target.value) || 5);
      if (onUpdateRoom) onUpdateRoom(room);
    });
    container.querySelector('#inp-room-depth')?.addEventListener('change', (e) => {
      room.depth = Math.max(2, parseFloat(e.target.value) || 4);
      if (onUpdateRoom) onUpdateRoom(room);
    });
    container.querySelector('#inp-room-height')?.addEventListener('change', (e) => {
      room.height = Math.max(1.8, parseFloat(e.target.value) || 2.85);
      if (onUpdateRoom) onUpdateRoom(room);
    });
    container.querySelector('#select-floor-material')?.addEventListener('change', (e) => {
      room.floorMaterial = e.target.value;
      if (onUpdateRoom) onUpdateRoom(room);
    });
    container.querySelector('#inp-wall-color')?.addEventListener('input', (e) => {
      room.wallColor = e.target.value;
      const lbl = container.querySelector('#lbl-wall-color-hex');
      if (lbl) lbl.textContent = e.target.value;
      if (onUpdateRoom) onUpdateRoom(room);
    });
    container.querySelector('#btn-open-proj-settings')?.addEventListener('click', () => {
      if (onOpenProjectModal) onOpenProjectModal();
    });
  }

  // Attach Takeoff Handlers
  if (activeTab === 'takeoff') {
    container.querySelector('#btn-export-bom-csv')?.addEventListener('click', () => {
      if (onExportBOM) onExportBOM();
    });
    container.querySelector('#btn-copy-takeoff')?.addEventListener('click', () => {
      if (onCopyBOM) onCopyBOM();
    });
  }
}
