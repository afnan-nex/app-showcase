/**
 * MapCraft - Object & Map Properties Inspector
 * Contextual properties editor for markers, routes, regions, labels, and project map settings.
 */

import { getIcon, escapeHTML } from '../core/icons.js';
import { MAP_THEMES } from '../engine/themes.js';
import { calculatePolylineLength, calculatePolygonArea, formatScaledDistance, formatScaledArea } from '../core/math.js';

export function renderInspector(container, {
  selectedObject,
  project,
  onObjectChange = null,
  onProjectChange = null,
  onDeleteObject = null,
  onDuplicateObject = null,
  onCenterObject = null
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
      <div class="stat-badge-row card p-2 mb-2 flex items-center justify-between text-xs">
        <span class="text-muted">Total Distance:</span>
        <span class="font-mono font-bold text-primary">${distStr} (${obj.points.length} waypoints)</span>
      </div>
    `;
  } else if (obj.type === 'region' && obj.points) {
    const pxArea = calculatePolygonArea(obj.points);
    const areaStr = formatScaledArea(pxArea, project.scaleRatio || 10, project.scaleUnit || 'km');
    geometryStatsHTML = `
      <div class="stat-badge-row card p-2 mb-2 flex items-center justify-between text-xs">
        <span class="text-muted">Calculated Area:</span>
        <span class="font-mono font-bold text-emerald">${areaStr} (${obj.points.length} vertices)</span>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="inspector-header p-3 border-b flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="badge badge-primary font-mono text-xs uppercase">${obj.type}</span>
        <input type="text" id="insp-name" class="form-control form-control-sm font-bold text-primary flex-1" value="${escapeHTML(obj.name || '')}" placeholder="Element Name" />
      </div>
    </div>

    <div class="inspector-scroll-body p-3 overflow-y-auto flex-1">
      ${geometryStatsHTML}

      <!-- General & Layer -->
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Layer & Category</div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Assigned Layer</label>
          <select id="insp-layer" class="form-control form-control-sm">
            ${layers.map(l => `<option value="${l.id}" ${obj.layerId === l.id ? 'selected' : ''}>${escapeHTML(l.name)}</option>`).join('')}
          </select>
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Category / Tag</label>
          <input type="text" id="insp-category" class="form-control form-control-sm font-mono" value="${escapeHTML(obj.category || '')}" placeholder="city, landmark, quest, nature" />
        </div>
      </div>

      <!-- Specific Type Styling -->
      ${renderTypeSpecificOptions(obj)}

      <!-- Notes & Description -->
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Notes & Lore</div>
        <textarea id="insp-notes" class="form-control form-control-sm font-sans" rows="3" placeholder="Add historical context, travel notes, or location guide details...">${escapeHTML(obj.notes || '')}</textarea>
      </div>

      <!-- Actions -->
      <div class="inspector-actions flex gap-2 border-t pt-3">
        <button class="btn btn-sm btn-secondary flex-1" id="btn-center-obj">
          ${getIcon('compass', 'icon-xs')} Center Map
        </button>
        <button class="btn btn-sm btn-secondary" id="btn-dupe-obj" title="Duplicate">
          ${getIcon('copy', 'icon-xs')}
        </button>
        <button class="btn btn-sm btn-danger" id="btn-del-obj" title="Delete">
          ${getIcon('trash', 'icon-xs')}
        </button>
      </div>
    </div>
  `;

  // --- Attach Handlers ---
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
  bind('insp-marker-icon', 'icon');

  // Route options
  bind('insp-route-width', 'width', Number);
  bind('insp-route-color', 'color');
  bind('insp-route-style', 'style');

  // Region options
  bind('insp-fill-color', 'fillColor');
  bind('insp-stroke-color', 'strokeColor');
  bind('insp-region-opacity', 'opacity', Number);

  // Label options
  bind('insp-label-text', 'text');
  bind('insp-font-size', 'fontSize', Number);
  bind('insp-label-color', 'color');
  bind('insp-label-rot', 'rotation', Number);

  container.querySelector('#insp-label-bold')?.addEventListener('change', (e) => {
    obj.isBold = e.target.checked;
    if (onObjectChange) onObjectChange(obj);
  });

  // Action buttons
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
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Marker Appearance</div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Pin Color</label>
          <input type="color" id="insp-marker-color" class="form-control form-control-sm p-0 w-full h-7 cursor-pointer" value="${obj.color || '#58a6ff'}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Pin Size</label>
          <input type="range" min="16" max="48" id="insp-marker-size" class="form-control form-control-sm" value="${obj.size || 28}" />
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
          <label class="form-label text-xs">Line Width</label>
          <input type="range" min="1" max="10" id="insp-route-width" class="form-control form-control-sm" value="${obj.width || 3}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Style</label>
          <select id="insp-route-style" class="form-control form-control-sm">
            <option value="solid" ${obj.style === 'solid' ? 'selected' : ''}>Solid Path</option>
            <option value="dashed" ${obj.style === 'dashed' ? 'selected' : ''}>Dashed Route</option>
            <option value="dotted" ${obj.style === 'dotted' ? 'selected' : ''}>Dotted Trail</option>
          </select>
        </div>
      </div>
    `;
  }

  if (obj.type === 'region' || obj.type === 'circle') {
    return `
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Region Appearance</div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Fill Color</label>
          <input type="color" id="insp-fill-color" class="form-control form-control-sm p-0 w-full h-7 cursor-pointer" value="${obj.fillColor || '#58a6ff'}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Stroke Color</label>
          <input type="color" id="insp-stroke-color" class="form-control form-control-sm p-0 w-full h-7 cursor-pointer" value="${obj.strokeColor || obj.fillColor || '#58a6ff'}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Opacity (${Math.round((obj.opacity !== undefined ? obj.opacity : 0.35) * 100)}%)</label>
          <input type="range" min="0.05" max="1" step="0.05" id="insp-region-opacity" class="form-control form-control-sm" value="${obj.opacity !== undefined ? obj.opacity : 0.35}" />
        </div>
      </div>
    `;
  }

  if (obj.type === 'label') {
    return `
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Typography</div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Label Text</label>
          <input type="text" id="insp-label-text" class="form-control form-control-sm font-bold" value="${escapeHTML(obj.text || '')}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Font Size</label>
          <input type="number" min="8" max="72" id="insp-font-size" class="form-control form-control-sm" value="${obj.fontSize || 16}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Font Color</label>
          <input type="color" id="insp-label-color" class="form-control form-control-sm p-0 w-full h-7 cursor-pointer" value="${obj.color || '#3b2f2f'}" />
        </div>
        <div class="form-group mb-2">
          <label class="checkbox-label text-xs">
            <input type="checkbox" id="insp-label-bold" ${obj.isBold !== false ? 'checked' : ''} /> Bold Font
          </label>
        </div>
      </div>
    `;
  }

  return '';
}

function renderMapSettingsInspector(container, project, onProjectChange) {
  container.innerHTML = `
    <div class="inspector-header p-3 border-b">
      <span class="badge badge-secondary font-mono text-xs">MAP SETTINGS</span>
    </div>

    <div class="inspector-scroll-body p-3 overflow-y-auto flex-1">
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Map Information</div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Project Title</label>
          <input type="text" id="insp-map-title" class="form-control form-control-sm font-bold text-primary" value="${escapeHTML(project.name || 'Untitled Map')}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Cartographic Theme</label>
          <select id="insp-map-theme" class="form-control form-control-sm font-semibold">
            ${Object.values(MAP_THEMES).map(t => `<option value="${t.id}" ${project.themeId === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Scale & Measurement</div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Scale Ratio (Real Units per 100px)</label>
          <input type="number" id="insp-scale-ratio" class="form-control form-control-sm" value="${project.scaleRatio || 10}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Scale Unit</label>
          <select id="insp-scale-unit" class="form-control form-control-sm">
            <option value="km" ${project.scaleUnit === 'km' ? 'selected' : ''}>Kilometers (km / km²)</option>
            <option value="mi" ${project.scaleUnit === 'mi' ? 'selected' : ''}>Miles (mi / sq mi)</option>
            <option value="m" ${project.scaleUnit === 'm' ? 'selected' : ''}>Meters (m / m²)</option>
          </select>
        </div>
      </div>

      <div class="p-3 text-xs text-muted">
        Select any marker, route, or region on the map to edit properties.
      </div>
    </div>
  `;

  container.querySelector('#insp-map-title')?.addEventListener('input', (e) => {
    project.name = e.target.value;
    if (onProjectChange) onProjectChange();
  });

  container.querySelector('#insp-map-theme')?.addEventListener('change', (e) => {
    project.themeId = e.target.value;
    if (onProjectChange) onProjectChange();
  });

  container.querySelector('#insp-scale-ratio')?.addEventListener('input', (e) => {
    project.scaleRatio = Number(e.target.value) || 10;
    if (onProjectChange) onProjectChange();
  });

  container.querySelector('#insp-scale-unit')?.addEventListener('change', (e) => {
    project.scaleUnit = e.target.value;
    if (onProjectChange) onProjectChange();
  });
}
