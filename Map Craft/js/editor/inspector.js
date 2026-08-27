/**
 * MapCraft - Object & Map Properties Inspector
 * Complete tactile properties editor for markers, routes, regions, labels, and global map settings.
 */

import { getIcon, escapeHTML, MARKER_ICONS_LIST } from '../core/icons.js';
import { MAP_THEMES } from '../engine/themes.js';
import {
  calculatePolylineLength,
  calculatePolygonArea,
  formatScaledDistance,
  formatScaledArea
} from '../core/math.js';

export function renderInspector(container, {
  selectedObject,
  project,
  onObjectChange = null,
  onProjectChange = null,
  onDeleteObject = null,
  onDuplicateObject = null,
  onCenterObject = null,
  onReorderObject = null
}) {
  if (!selectedObject) {
    renderMapSettingsInspector(container, project, onProjectChange);
    return;
  }

  const obj = selectedObject;
  const layers = project.layers || [];

  let geometryStatsHTML = '';
  if (obj.type === 'route' && obj.points) {
    const pxLen = calculatePolylineLength(obj.points);
    const distStr = formatScaledDistance(pxLen, project.scaleRatio || 10, project.scaleUnit || 'km');
    geometryStatsHTML = `
      <div class="stat-badge-row card p-2 mb-3 flex items-center justify-between text-xs">
        <span class="text-muted">Total Distance:</span>
        <span class="font-mono font-bold text-primary">${distStr} (${obj.points.length} waypoints)</span>
      </div>
    `;
  } else if (obj.type === 'region' && obj.points) {
    const pxArea = calculatePolygonArea(obj.points);
    const areaStr = formatScaledArea(pxArea, project.scaleRatio || 10, project.scaleUnit || 'km');
    geometryStatsHTML = `
      <div class="stat-badge-row card p-2 mb-3 flex items-center justify-between text-xs">
        <span class="text-muted">Enclosed Area:</span>
        <span class="font-mono font-bold text-emerald">${areaStr} (${obj.points.length} vertices)</span>
      </div>
    `;
  } else if (obj.type === 'circle') {
    const pxArea = Math.PI * (obj.radius || 50) ** 2;
    const areaStr = formatScaledArea(pxArea, project.scaleRatio || 10, project.scaleUnit || 'km');
    geometryStatsHTML = `
      <div class="stat-badge-row card p-2 mb-3 flex items-center justify-between text-xs">
        <span class="text-muted">Zone Radius / Area:</span>
        <span class="font-mono font-bold text-emerald">${obj.radius || 50}px &bull; ${areaStr}</span>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="inspector-header p-3 border-b flex items-center justify-between">
      <div class="flex items-center gap-2 flex-1">
        <span class="badge badge-primary font-mono text-xs uppercase">${obj.type}</span>
        <input type="text" id="insp-name" class="form-control form-control-sm font-bold text-primary flex-1" value="${escapeHTML(obj.name || '')}" placeholder="Element Name" />
      </div>
    </div>

    <div class="inspector-scroll-body p-3 overflow-y-auto flex-1">
      ${geometryStatsHTML}

      <!-- Layer & Category Assignment -->
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Layer & Classification</div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Assigned Layer</label>
          <select id="insp-layer" class="form-control form-control-sm">
            ${layers.map(l => `<option value="${l.id}" ${obj.layerId === l.id ? 'selected' : ''}>${escapeHTML(l.name)}</option>`).join('')}
          </select>
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Category Tag</label>
          <input type="text" id="insp-category" class="form-control form-control-sm font-mono" value="${escapeHTML(obj.category || '')}" placeholder="Landmark, Capital, Trail, Danger" />
        </div>
      </div>

      <!-- Type-Specific Styling -->
      ${renderTypeSpecificOptions(obj)}

      <!-- Z-Ordering -->
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Stacking Order</div>
        <div class="flex gap-1">
          <button class="btn btn-xs btn-secondary flex-1" id="btn-z-front" title="Bring to Front">To Front</button>
          <button class="btn btn-xs btn-secondary flex-1" id="btn-z-forward" title="Bring Forward">Forward</button>
          <button class="btn btn-xs btn-secondary flex-1" id="btn-z-backward" title="Send Backward">Backward</button>
          <button class="btn btn-xs btn-secondary flex-1" id="btn-z-back" title="Send to Back">To Back</button>
        </div>
      </div>

      <!-- Notes & Cartographic Lore -->
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Description, Notes & Lore</div>
        <textarea id="insp-notes" class="form-control form-control-sm font-sans" rows="3" placeholder="Add historical context, navigation notes, travel time, or secret lore...">${escapeHTML(obj.notes || '')}</textarea>
      </div>

      <!-- Action Buttons -->
      <div class="inspector-actions flex gap-2 border-t pt-3">
        <button class="btn btn-sm btn-secondary flex-1" id="btn-center-obj" title="Center Map on Element">
          ${getIcon('compass', 'icon-xs')} Center Map
        </button>
        <button class="btn btn-sm btn-secondary" id="btn-dupe-obj" title="Duplicate (Ctrl+D)">
          ${getIcon('copy', 'icon-xs')}
        </button>
        <button class="btn btn-sm btn-danger" id="btn-del-obj" title="Delete (Del)">
          ${getIcon('trash', 'icon-xs')}
        </button>
      </div>
    </div>
  `;

  // --- Attach Event Listeners ---
  const bind = (id, prop, parser = (v) => v) => {
    container.querySelector('#' + id)?.addEventListener('input', (e) => {
      obj[prop] = parser(e.target.value);
      if (onObjectChange) onObjectChange(obj);
    });
  };

  bind('insp-name', 'name');
  bind('insp-layer', 'layerId');
  bind('insp-category', 'category');
  bind('insp-notes', 'notes');

  // Marker options
  bind('insp-marker-size', 'size', Number);
  bind('insp-marker-color', 'color');
  container.querySelector('#insp-marker-hide-label')?.addEventListener('change', (e) => {
    obj.hideLabel = e.target.checked;
    if (onObjectChange) onObjectChange(obj);
  });

  // Marker icon grid picker
  container.querySelectorAll('.icon-picker-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      obj.icon = btn.dataset.icon;
      container.querySelectorAll('.icon-picker-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (onObjectChange) onObjectChange(obj);
    });
  });

  // Route options
  bind('insp-route-width', 'width', Number);
  bind('insp-route-color', 'color');
  bind('insp-route-style', 'style');
  container.querySelector('#insp-route-arrow')?.addEventListener('change', (e) => {
    obj.hasArrow = e.target.checked;
    if (onObjectChange) onObjectChange(obj);
  });

  // Region & Circle options
  bind('insp-fill-color', 'fillColor');
  bind('insp-stroke-color', 'strokeColor');
  bind('insp-stroke-width', 'strokeWidth', Number);
  bind('insp-region-opacity', 'opacity', Number);
  bind('insp-region-pattern', 'pattern');
  bind('insp-circle-radius', 'radius', Number);

  // Label options
  bind('insp-label-text', 'text');
  bind('insp-font-family', 'fontFamily');
  bind('insp-font-size', 'fontSize', Number);
  bind('insp-label-color', 'color');
  bind('insp-label-rot', 'rotation', Number);
  container.querySelector('#insp-label-bold')?.addEventListener('change', (e) => {
    obj.isBold = e.target.checked;
    if (onObjectChange) onObjectChange(obj);
  });

  // Stacking order actions
  container.querySelector('#btn-z-front')?.addEventListener('click', () => {
    if (onReorderObject) onReorderObject(obj.id, 'front');
  });
  container.querySelector('#btn-z-forward')?.addEventListener('click', () => {
    if (onReorderObject) onReorderObject(obj.id, 'forward');
  });
  container.querySelector('#btn-z-backward')?.addEventListener('click', () => {
    if (onReorderObject) onReorderObject(obj.id, 'backward');
  });
  container.querySelector('#btn-z-back')?.addEventListener('click', () => {
    if (onReorderObject) onReorderObject(obj.id, 'back');
  });

  // Actions
  container.querySelector('#btn-center-obj')?.addEventListener('click', () => {
    if (onCenterObject) onCenterObject(obj);
  });
  container.querySelector('#btn-dupe-obj')?.addEventListener('click', () => {
    if (onDuplicateObject) onDuplicateObject(obj.id);
  });
  container.querySelector('#btn-del-obj')?.addEventListener('click', () => {
    if (onDeleteObject) onDeleteObject(obj.id);
  });
}

function renderTypeSpecificOptions(obj) {
  if (obj.type === 'marker') {
    return `
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Cartographic Symbol</div>
        <div class="icon-picker-grid mb-2">
          ${MARKER_ICONS_LIST.map(item => `
            <button class="icon-picker-btn ${obj.icon === item.id ? 'active' : ''}" data-icon="${item.id}" title="${item.name}">
              ${getIcon(item.icon, 'icon-xs')}
            </button>
          `).join('')}
        </div>

        <div class="form-group mb-2">
          <label class="form-label text-xs">Pin Color</label>
          <input type="color" id="insp-marker-color" class="form-control form-control-sm p-0 w-full h-7 cursor-pointer" value="${obj.color || '#38bdf8'}" />
        </div>
        <div class="form-group mb-2">
          <div class="flex items-center justify-between">
            <label class="form-label text-xs">Pin Size</label>
            <span class="font-mono text-xs text-muted">${obj.size || 28}px</span>
          </div>
          <input type="range" min="18" max="48" id="insp-marker-size" class="form-control form-control-sm" value="${obj.size || 28}" />
        </div>
        <div class="form-group mb-2">
          <label class="checkbox-label text-xs">
            <input type="checkbox" id="insp-marker-hide-label" ${obj.hideLabel ? 'checked' : ''} /> Hide Text Label on Map
          </label>
        </div>
      </div>
    `;
  }

  if (obj.type === 'route') {
    return `
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Route Styling</div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Line Color</label>
          <input type="color" id="insp-route-color" class="form-control form-control-sm p-0 w-full h-7 cursor-pointer" value="${obj.color || '#e63946'}" />
        </div>
        <div class="form-group mb-2">
          <div class="flex items-center justify-between">
            <label class="form-label text-xs">Line Width</label>
            <span class="font-mono text-xs text-muted">${obj.width || 3.5}px</span>
          </div>
          <input type="range" min="1" max="10" step="0.5" id="insp-route-width" class="form-control form-control-sm" value="${obj.width || 3.5}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Route Line Style</label>
          <select id="insp-route-style" class="form-control form-control-sm">
            <option value="solid" ${obj.style === 'solid' ? 'selected' : ''}>Solid Paved Road</option>
            <option value="dashed" ${obj.style === 'dashed' ? 'selected' : ''}>Dashed Caravan Trail</option>
            <option value="dotted" ${obj.style === 'dotted' ? 'selected' : ''}>Dotted Footpath / Pass</option>
            <option value="railroad" ${obj.style === 'railroad' ? 'selected' : ''}>Railroad / Transit Track</option>
          </select>
        </div>
        <div class="form-group mb-2">
          <label class="checkbox-label text-xs">
            <input type="checkbox" id="insp-route-arrow" ${obj.hasArrow !== false ? 'checked' : ''} /> Show Directional Arrow at End
          </label>
        </div>
      </div>
    `;
  }

  if (obj.type === 'region') {
    return `
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Region Appearance</div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Fill Color</label>
          <input type="color" id="insp-fill-color" class="form-control form-control-sm p-0 w-full h-7 cursor-pointer" value="${obj.fillColor || '#38bdf8'}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Border Stroke Color</label>
          <input type="color" id="insp-stroke-color" class="form-control form-control-sm p-0 w-full h-7 cursor-pointer" value="${obj.strokeColor || obj.fillColor || '#38bdf8'}" />
        </div>
        <div class="form-group mb-2">
          <div class="flex items-center justify-between">
            <label class="form-label text-xs">Fill Opacity</label>
            <span class="font-mono text-xs text-muted">${Math.round((obj.opacity !== undefined ? obj.opacity : 0.35) * 100)}%</span>
          </div>
          <input type="range" min="0.05" max="1" step="0.05" id="insp-region-opacity" class="form-control form-control-sm" value="${obj.opacity !== undefined ? obj.opacity : 0.35}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Fill Pattern</label>
          <select id="insp-region-pattern" class="form-control form-control-sm">
            <option value="solid" ${obj.pattern !== 'hatch' ? 'selected' : ''}>Solid Tint</option>
            <option value="hatch" ${obj.pattern === 'hatch' ? 'selected' : ''}>Cartographic Diagonal Hatch</option>
          </select>
        </div>
      </div>
    `;
  }

  if (obj.type === 'circle') {
    return `
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Circular Zone Geometry</div>
        <div class="form-group mb-2">
          <div class="flex items-center justify-between">
            <label class="form-label text-xs">Zone Radius</label>
            <span class="font-mono text-xs text-muted">${obj.radius || 50}px</span>
          </div>
          <input type="range" min="15" max="300" id="insp-circle-radius" class="form-control form-control-sm" value="${obj.radius || 50}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Fill Color</label>
          <input type="color" id="insp-fill-color" class="form-control form-control-sm p-0 w-full h-7 cursor-pointer" value="${obj.fillColor || '#38bdf8'}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Stroke Color</label>
          <input type="color" id="insp-stroke-color" class="form-control form-control-sm p-0 w-full h-7 cursor-pointer" value="${obj.strokeColor || obj.fillColor || '#38bdf8'}" />
        </div>
        <div class="form-group mb-2">
          <div class="flex items-center justify-between">
            <label class="form-label text-xs">Opacity</label>
            <span class="font-mono text-xs text-muted">${Math.round((obj.opacity !== undefined ? obj.opacity : 0.35) * 100)}%</span>
          </div>
          <input type="range" min="0.05" max="1" step="0.05" id="insp-region-opacity" class="form-control form-control-sm" value="${obj.opacity !== undefined ? obj.opacity : 0.35}" />
        </div>
      </div>
    `;
  }

  if (obj.type === 'label') {
    return `
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Typography & Alignment</div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Label Text</label>
          <input type="text" id="insp-label-text" class="form-control form-control-sm font-bold" value="${escapeHTML(obj.text || '')}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Font Family</label>
          <select id="insp-font-family" class="form-control form-control-sm">
            <option value="'Cinzel', serif" ${obj.fontFamily?.includes('Cinzel') ? 'selected' : ''}>Cinzel (Classic / Fantasy Serif)</option>
            <option value="'Inter', sans-serif" ${obj.fontFamily?.includes('Inter') || !obj.fontFamily ? 'selected' : ''}>Inter (Clean Sans-Serif)</option>
            <option value="'JetBrains Mono', monospace" ${obj.fontFamily?.includes('Mono') ? 'selected' : ''}>JetBrains Mono (Technical)</option>
            <option value="'Georgia', serif" ${obj.fontFamily?.includes('Georgia') ? 'selected' : ''}>Georgia (Editorial Serif)</option>
          </select>
        </div>
        <div class="form-group mb-2">
          <div class="flex items-center justify-between">
            <label class="form-label text-xs">Font Size</label>
            <span class="font-mono text-xs text-muted">${obj.fontSize || 16}px</span>
          </div>
          <input type="range" min="9" max="64" id="insp-font-size" class="form-control form-control-sm" value="${obj.fontSize || 16}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Font Color</label>
          <input type="color" id="insp-label-color" class="form-control form-control-sm p-0 w-full h-7 cursor-pointer" value="${obj.color || '#3b2f2f'}" />
        </div>
        <div class="form-group mb-2">
          <div class="flex items-center justify-between">
            <label class="form-label text-xs">Rotation</label>
            <span class="font-mono text-xs text-muted">${obj.rotation || 0}&deg;</span>
          </div>
          <input type="range" min="-180" max="180" id="insp-label-rot" class="form-control form-control-sm" value="${obj.rotation || 0}" />
        </div>
        <div class="form-group mb-2">
          <label class="checkbox-label text-xs">
            <input type="checkbox" id="insp-label-bold" ${obj.isBold !== false ? 'checked' : ''} /> Bold Weight
          </label>
        </div>
      </div>
    `;
  }

  return '';
}

function renderMapSettingsInspector(container, project, onProjectChange) {
  const objCount = (project.objects || []).length;
  const layerCount = (project.layers || []).length;

  container.innerHTML = `
    <div class="inspector-header p-3 border-b flex items-center justify-between">
      <span class="badge badge-secondary font-mono text-xs">PROJECT SETTINGS</span>
      <span class="text-xs text-muted font-mono">${objCount} Elements &bull; ${layerCount} Layers</span>
    </div>

    <div class="inspector-scroll-body p-3 overflow-y-auto flex-1">
      <!-- General Map Info -->
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Map Information</div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Map Title</label>
          <input type="text" id="insp-map-title" class="form-control form-control-sm font-bold text-primary" value="${escapeHTML(project.name || 'Untitled Map')}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Description</label>
          <textarea id="insp-map-desc" class="form-control form-control-sm font-sans" rows="2" placeholder="Map overview or campaign premise...">${escapeHTML(project.description || '')}</textarea>
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Cartographic Theme</label>
          <select id="insp-map-theme" class="form-control form-control-sm font-semibold">
            ${Object.values(MAP_THEMES).map(t => `<option value="${t.id}" ${project.themeId === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}
          </select>
        </div>
      </div>

      <!-- Scale & Measurement Units -->
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Scale & Measurement Ratio</div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Scale Ratio (Real Units per 100px)</label>
          <input type="number" id="insp-scale-ratio" class="form-control form-control-sm font-mono" value="${project.scaleRatio || 10}" min="0.1" step="0.5" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Measurement Unit</label>
          <select id="insp-scale-unit" class="form-control form-control-sm font-semibold">
            <option value="km" ${project.scaleUnit === 'km' ? 'selected' : ''}>Kilometers (km / km&sup2;)</option>
            <option value="mi" ${project.scaleUnit === 'mi' ? 'selected' : ''}>Miles (mi / sq mi)</option>
            <option value="m" ${project.scaleUnit === 'm' ? 'selected' : ''}>Meters (m / m&sup2;)</option>
            <option value="nm" ${project.scaleUnit === 'nm' ? 'selected' : ''}>Nautical Miles (nm / sq nm)</option>
            <option value="leagues" ${project.scaleUnit === 'leagues' ? 'selected' : ''}>Leagues (Fantasy / Historical)</option>
            <option value="hexes" ${project.scaleUnit === 'hexes' ? 'selected' : ''}>Hex Grid Units (Tabletop RPG)</option>
          </select>
        </div>
      </div>

      <!-- Cartographic Grid Settings -->
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Grid & Coordinates</div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Grid Mesh Type</label>
          <select id="insp-grid-type" class="form-control form-control-sm">
            <option value="square" ${project.gridType === 'square' || !project.gridType ? 'selected' : ''}>Cartographic Square Grid</option>
            <option value="hex" ${project.gridType === 'hex' ? 'selected' : ''}>Hexagonal RPG Grid</option>
            <option value="dot" ${project.gridType === 'dot' ? 'selected' : ''}>Dot Matrix Drafting Grid</option>
            <option value="none" ${project.gridType === 'none' ? 'selected' : ''}>No Grid Overlay</option>
          </select>
        </div>
        <div class="form-group mb-2">
          <div class="flex items-center justify-between">
            <label class="form-label text-xs">Grid Cell Spacing</label>
            <span class="font-mono text-xs text-muted">${project.gridSize || 50}px</span>
          </div>
          <input type="range" min="25" max="150" step="5" id="insp-grid-size" class="form-control form-control-sm" value="${project.gridSize || 50}" />
        </div>
      </div>

      <div class="card p-3 text-xs text-muted leading-relaxed">
        <strong class="text-primary block mb-1">Quick Cartography Tips:</strong>
        &bull; Select any marker, route, or region to edit its properties.<br/>
        &bull; Drag vertex handles to reshape routes and borders.<br/>
        &bull; Use the <strong>Measure (X)</strong> tool for live route and area calculations.
      </div>
    </div>
  `;

  container.querySelector('#insp-map-title')?.addEventListener('input', (e) => {
    project.name = e.target.value;
    if (onProjectChange) onProjectChange();
  });

  container.querySelector('#insp-map-desc')?.addEventListener('input', (e) => {
    project.description = e.target.value;
    if (onProjectChange) onProjectChange();
  });

  container.querySelector('#insp-map-theme')?.addEventListener('change', (e) => {
    project.themeId = e.target.value;
    const themeSelect = document.getElementById('select-map-theme');
    if (themeSelect) themeSelect.value = e.target.value;
    if (onProjectChange) onProjectChange();
  });

  container.querySelector('#insp-scale-ratio')?.addEventListener('input', (e) => {
    project.scaleRatio = Math.max(0.01, Number(e.target.value) || 10);
    if (onProjectChange) onProjectChange();
  });

  container.querySelector('#insp-scale-unit')?.addEventListener('change', (e) => {
    project.scaleUnit = e.target.value;
    if (onProjectChange) onProjectChange();
  });

  container.querySelector('#insp-grid-type')?.addEventListener('change', (e) => {
    project.gridType = e.target.value;
    if (onProjectChange) onProjectChange();
  });

  container.querySelector('#insp-grid-size')?.addEventListener('input', (e) => {
    project.gridSize = Number(e.target.value) || 50;
    if (onProjectChange) onProjectChange();
  });
}
