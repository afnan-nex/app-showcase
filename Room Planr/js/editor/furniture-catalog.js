/**
 * RoomPlanr - Furniture Catalog & Custom Item Creator
 * Left sidebar catalog with category filtering, real dimensions, and custom item modal.
 */

import { getIcon, escapeHTML } from '../core/icons.js';
import { FURNITURE_CATALOG } from '../engine/catalog.js';
import { formatDimension, UNITS } from '../core/units.js';

export function renderFurnitureCatalog(container, {
  unit = UNITS.METERS,
  activeCategory = 'All',
  searchQuery = '',
  onAddItem = null,
  onCategoryChange = null,
  onSearchChange = null,
  onOpenCustomModal = null
}) {
  const categories = ['All', 'Living', 'Bedroom', 'Office', 'Dining', 'Kitchen', 'Decor', 'Structure'];

  const filtered = FURNITURE_CATALOG.filter(item => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  container.innerHTML = `
    <!-- Top Header -->
    <div class="panel-section-header flex items-center justify-between p-3 border-b">
      <div class="flex items-center gap-2">
        ${getIcon('sofa', 'icon-sm text-primary')}
        <span class="text-xs font-bold uppercase text-muted">Furniture Catalog</span>
      </div>
      <button class="btn btn-xs btn-primary" id="btn-open-custom-item" title="Create Custom Furniture Dimension">
        ${getIcon('plus', 'icon-xs')} Custom
      </button>
    </div>

    <!-- Search Bar -->
    <div class="p-2 border-b">
      <div class="relative">
        <input type="text" id="catalog-search-input" class="form-control form-control-sm pl-8 font-sans" placeholder="Search furniture, sofas, beds..." value="${escapeHTML(searchQuery)}" />
        <span class="absolute left-2 top-2 text-muted pointer-events-none">${getIcon('search', 'icon-xs')}</span>
      </div>
    </div>

    <!-- Category Pill Filter -->
    <div class="p-2 border-b flex flex-wrap gap-1">
      ${categories.map(c => `
        <button class="badge ${activeCategory === c ? 'badge-primary' : 'badge-secondary'} cursor-pointer cat-pill-btn" data-cat="${c}">
          ${c}
        </button>
      `).join('')}
    </div>

    <!-- Scrollable Items List -->
    <div class="catalog-items-scroll p-2 flex flex-col gap-1.5 flex-1 overflow-y-auto">
      ${filtered.length === 0 ? `
        <div class="text-xs text-muted text-center p-6">No matching furniture items found.</div>
      ` : filtered.map(item => `
        <div class="catalog-item-card card p-2 flex items-center justify-between hover-elevated">
          <div class="flex items-center gap-2.5 truncate">
            <div class="item-icon-box flex items-center justify-center rounded p-1" style="background-color: var(--bg-elevated); color: ${item.color || 'var(--accent-primary)'};">
              ${getIcon(item.icon || 'sofa', 'icon-sm')}
            </div>
            <div class="flex flex-col truncate">
              <span class="font-bold text-xs text-primary truncate">${escapeHTML(item.name)}</span>
              <span class="font-mono text-muted text-xs" style="font-size: 10px;">
                ${formatDimension(item.width, unit)} &times; ${formatDimension(item.depth, unit)}
              </span>
            </div>
          </div>

          <button class="btn btn-xs btn-secondary btn-add-catalog-item" data-type="${item.type}" title="Add to Room">
            ${getIcon('plus', 'icon-xs')} Add
          </button>
        </div>
      `).join('')}
    </div>
  `;

  // Attach Handlers
  container.querySelector('#catalog-search-input')?.addEventListener('input', (e) => {
    if (onSearchChange) onSearchChange(e.target.value);
  });

  container.querySelectorAll('.cat-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onCategoryChange) onCategoryChange(btn.dataset.cat);
    });
  });

  container.querySelectorAll('.btn-add-catalog-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      const tpl = FURNITURE_CATALOG.find(i => i.type === type);
      if (tpl && onAddItem) {
        onAddItem(JSON.parse(JSON.stringify(tpl)));
      }
    });
  });

  container.querySelector('#btn-open-custom-item')?.addEventListener('click', () => {
    if (onOpenCustomModal) onOpenCustomModal();
  });
}
