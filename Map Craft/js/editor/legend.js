/**
 * MapCraft - Map Legend & Object Search View
 * Dynamic legend generator and real-time element search index.
 */

import { getIcon, escapeHTML } from '../core/icons.js';

export function renderLegendPanel(container, {
  project,
  onSelectObject = null,
  onCenterObject = null
}) {
  const objects = project.objects || [];

  // Group objects by category
  const categories = {};
  for (const obj of objects) {
    const cat = obj.category || obj.type || 'General';
    if (!categories[cat]) {
      categories[cat] = {
        name: cat,
        items: [],
        color: obj.color || obj.fillColor || '#58a6ff'
      };
    }
    categories[cat].items.push(obj);
  }

  container.innerHTML = `
    <div class="p-3 border-b">
      <!-- Search Input -->
      <div class="search-input-wrapper flex items-center gap-2 card p-1 px-2 mb-3">
        ${getIcon('search', 'icon-xs text-muted')}
        <input type="text" id="map-search-input" class="search-input font-sans text-xs flex-1 bg-transparent border-none outline-none" placeholder="Search markers, routes, regions..." />
        <button class="btn-icon-xs text-muted" id="btn-clear-search" style="display: none;">&times;</button>
      </div>

      <div class="flex items-center justify-between">
        <span class="text-xs font-bold uppercase text-muted">Map Legend & Catalog</span>
        <span class="badge badge-secondary text-xs">${objects.length} Total</span>
      </div>
    </div>

    <!-- Scrollable Categories & Items List -->
    <div class="legend-scroll-body p-3 overflow-y-auto flex-1 flex flex-col gap-3" id="legend-items-container">
      ${renderLegendCategories(categories)}
    </div>
  `;

  // Search input handler
  const searchInput = container.querySelector('#map-search-input');
  const clearBtn = container.querySelector('#btn-clear-search');
  const itemsContainer = container.querySelector('#legend-items-container');

  searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    clearBtn.style.display = query ? 'inline-flex' : 'none';

    if (!query) {
      itemsContainer.innerHTML = renderLegendCategories(categories);
      attachItemClickHandlers(container, project, onSelectObject, onCenterObject);
      return;
    }

    const filtered = objects.filter(o =>
      (o.name && o.name.toLowerCase().includes(query)) ||
      (o.category && o.category.toLowerCase().includes(query)) ||
      (o.notes && o.notes.toLowerCase().includes(query)) ||
      (o.text && o.text.toLowerCase().includes(query))
    );

    if (filtered.length === 0) {
      itemsContainer.innerHTML = `<div class="text-xs text-muted text-center p-4">No matching map elements found.</div>`;
    } else {
      itemsContainer.innerHTML = `
        <div class="text-xs text-muted mb-1">Found ${filtered.length} results:</div>
        <div class="flex flex-col gap-1">
          ${filtered.map(obj => `
            <div class="card p-2 flex items-center justify-between cursor-pointer search-result-item" data-id="${obj.id}">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full" style="background: ${obj.color || obj.fillColor || '#58a6ff'};"></span>
                <span class="font-semibold text-xs">${escapeHTML(obj.name || obj.text || obj.type)}</span>
              </div>
              <span class="badge badge-secondary text-xs uppercase">${obj.type}</span>
            </div>
          `).join('')}
        </div>
      `;
      attachItemClickHandlers(container, project, onSelectObject, onCenterObject);
    }
  });

  clearBtn?.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    itemsContainer.innerHTML = renderLegendCategories(categories);
    attachItemClickHandlers(container, project, onSelectObject, onCenterObject);
  });

  attachItemClickHandlers(container, project, onSelectObject, onCenterObject);
}

function renderLegendCategories(categories) {
  const keys = Object.keys(categories);
  if (keys.length === 0) {
    return `<div class="text-xs text-muted text-center p-4">Map has no elements yet.</div>`;
  }

  return keys.map(catKey => {
    const cat = categories[catKey];
    return `
      <div class="legend-category-group card p-2">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="legend-color-dot" style="background-color: ${cat.color};"></span>
            <span class="font-bold text-xs uppercase text-primary">${escapeHTML(cat.name)}</span>
          </div>
          <span class="badge badge-secondary text-xs font-mono">${cat.items.length}</span>
        </div>

        <div class="legend-cat-items flex flex-col gap-1">
          ${cat.items.map(obj => `
            <div class="legend-item-row flex items-center justify-between p-1 rounded hover:bg-hover cursor-pointer" data-id="${obj.id}">
              <span class="text-xs text-secondary truncate flex-1">${escapeHTML(obj.name || obj.text || 'Unnamed')}</span>
              <span class="text-muted text-xs font-mono ml-2">${obj.type}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function attachItemClickHandlers(container, project, onSelectObject, onCenterObject) {
  container.querySelectorAll('.search-result-item, .legend-item-row').forEach(row => {
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
