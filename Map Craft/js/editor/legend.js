/**
 * MapCraft - Map Legend & Dynamic Search Index
 * Instant full-text search across POIs, categories, notes, and layers with category toggles and focus camera.
 */

import { getIcon, escapeHTML } from '../core/icons.js';

export function renderLegendPanel(container, {
  project,
  onSelectObject = null,
  onCenterObject = null,
  onToggleCategoryVisibility = null
}) {
  const objects = project.objects || [];

  // Group objects by category
  const categories = {};
  for (const obj of objects) {
    const cat = obj.category || obj.type || 'Uncategorized';
    if (!categories[cat]) {
      categories[cat] = {
        name: cat,
        items: [],
        color: obj.color || obj.fillColor || '#38bdf8'
      };
    }
    categories[cat].items.push(obj);
  }

  container.innerHTML = `
    <div class="p-3 border-b">
      <!-- Search Input -->
      <div class="search-input-wrapper flex items-center gap-2 card p-1 px-2 mb-2">
        ${getIcon('search', 'icon-xs text-muted')}
        <input type="text" id="map-search-input" class="search-input font-sans text-xs flex-1 bg-transparent border-none outline-none" placeholder="Search markers, routes, notes, lore..." />
        <button class="btn-icon-xs text-muted" id="btn-clear-search" style="display: none;">&times;</button>
      </div>

      <!-- Type Filter Pills -->
      <div class="flex items-center gap-1 mb-2 overflow-x-auto pb-1" id="legend-type-filters">
        <button class="badge badge-primary cursor-pointer filter-pill active" data-type="all">All (${objects.length})</button>
        <button class="badge badge-secondary cursor-pointer filter-pill" data-type="marker">Markers</button>
        <button class="badge badge-secondary cursor-pointer filter-pill" data-type="route">Routes</button>
        <button class="badge badge-secondary cursor-pointer filter-pill" data-type="region">Regions</button>
        <button class="badge badge-secondary cursor-pointer filter-pill" data-type="label">Labels</button>
      </div>

      <div class="flex items-center justify-between">
        <span class="text-xs font-bold uppercase text-muted">Cartographic Index</span>
        <span class="badge badge-secondary text-xs font-mono">${Object.keys(categories).length} Categories</span>
      </div>
    </div>

    <!-- Scrollable Categories & Items List -->
    <div class="legend-scroll-body p-3 overflow-y-auto flex-1 flex flex-col gap-2" id="legend-items-container">
      ${renderLegendCategories(categories)}
    </div>
  `;

  // Search & Filter handlers
  const searchInput = container.querySelector('#map-search-input');
  const clearBtn = container.querySelector('#btn-clear-search');
  const itemsContainer = container.querySelector('#legend-items-container');
  let activeFilterType = 'all';

  const applyFilters = () => {
    const query = (searchInput.value || '').toLowerCase().trim();
    clearBtn.style.display = query ? 'inline-flex' : 'none';

    let filtered = objects;
    if (activeFilterType !== 'all') {
      filtered = filtered.filter(o => o.type === activeFilterType);
    }
    if (query) {
      filtered = filtered.filter(o =>
        (o.name && o.name.toLowerCase().includes(query)) ||
        (o.category && o.category.toLowerCase().includes(query)) ||
        (o.notes && o.notes.toLowerCase().includes(query)) ||
        (o.text && o.text.toLowerCase().includes(query))
      );
    }

    if (filtered.length === 0) {
      itemsContainer.innerHTML = `<div class="text-xs text-muted text-center p-4">No matching map elements found.</div>`;
      return;
    }

    // Regroup filtered
    const filteredCats = {};
    for (const obj of filtered) {
      const cat = obj.category || obj.type || 'Uncategorized';
      if (!filteredCats[cat]) {
        filteredCats[cat] = {
          name: cat,
          items: [],
          color: obj.color || obj.fillColor || '#38bdf8'
        };
      }
      filteredCats[cat].items.push(obj);
    }

    itemsContainer.innerHTML = renderLegendCategories(filteredCats);
    attachItemClickHandlers(container, project, onSelectObject, onCenterObject);
  };

  searchInput?.addEventListener('input', applyFilters);
  clearBtn?.addEventListener('click', () => {
    searchInput.value = '';
    applyFilters();
  });

  container.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      container.querySelectorAll('.filter-pill').forEach(p => {
        p.classList.remove('badge-primary', 'active');
        p.classList.add('badge-secondary');
      });
      pill.classList.remove('badge-secondary');
      pill.classList.add('badge-primary', 'active');
      activeFilterType = pill.dataset.type;
      applyFilters();
    });
  });

  attachItemClickHandlers(container, project, onSelectObject, onCenterObject);
}

function renderLegendCategories(categories) {
  const keys = Object.keys(categories);
  if (keys.length === 0) {
    return `<div class="text-xs text-muted text-center p-4">No elements in this map catalog.</div>`;
  }

  return keys.map(catKey => {
    const cat = categories[catKey];
    return `
      <div class="legend-category-group card p-2">
        <div class="flex items-center justify-between mb-1.5 pb-1 border-b">
          <div class="flex items-center gap-2">
            <span class="legend-color-dot" style="background-color: ${cat.color};"></span>
            <span class="font-bold text-xs uppercase text-primary">${escapeHTML(cat.name)}</span>
          </div>
          <span class="badge badge-secondary text-xs font-mono">${cat.items.length}</span>
        </div>

        <div class="legend-cat-items flex flex-col gap-0.5">
          ${cat.items.map(obj => `
            <div class="legend-item-row flex items-center justify-between p-1 rounded hover:bg-hover cursor-pointer" data-id="${obj.id}" title="${escapeHTML(obj.notes || 'Click to view & focus')}">
              <div class="flex items-center gap-2 flex-1 min-w-0">
                <span class="w-2 h-2 rounded-full flex-shrink-0" style="background: ${obj.color || obj.fillColor || '#38bdf8'};"></span>
                <span class="text-xs text-secondary truncate">${escapeHTML(obj.name || obj.text || 'Unnamed Element')}</span>
              </div>
              <span class="text-muted text-xs font-mono uppercase ml-2">${obj.type}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function attachItemClickHandlers(container, project, onSelectObject, onCenterObject) {
  container.querySelectorAll('.legend-item-row').forEach(row => {
    row.addEventListener('click', () => {
      const objId = row.dataset.id;
      const obj = (project.objects || []).find(o => o.id === objId);
      if (obj) {
        if (onSelectObject) onSelectObject(objId);
        if (onCenterObject) onCenterObject(obj);
      }
    });
  });
}
