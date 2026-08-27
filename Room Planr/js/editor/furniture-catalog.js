/**
 * RoomPlanr - Furniture Catalog & Custom Item Creator
 * Left sidebar catalog with category filtering, search, real-world dimensions, pricing, and custom item creation.
 */

import { getIcon, escapeHTML } from '../core/icons.js';
import { FURNITURE_CATALOG } from '../engine/catalog.js';
import { formatDimension, formatPrice, UNITS } from '../core/units.js';

export function renderFurnitureCatalog(container, {
  unit = UNITS.METERS,
  currency = 'USD',
  activeCategory = 'All',
  searchQuery = '',
  onAddItem = null,
  onCategoryChange = null,
  onSearchChange = null,
  onOpenCustomModal = null
}) {
  const categories = ['All', 'Living', 'Bedroom', 'Office', 'Dining', 'Kitchen', 'Bathroom', 'Decor', 'Structure'];

  const filtered = FURNITURE_CATALOG.filter(item => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.material && item.material.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  container.innerHTML = `
    <!-- Top Header -->
    <div class="panel-section-header flex items-center justify-between p-3 border-b">
      <div class="flex items-center gap-2">
        ${getIcon('sofa', 'icon-sm text-primary')}
        <span class="text-xs font-bold uppercase text-muted" style="letter-spacing: 0.5px;">Furniture Catalog</span>
      </div>
      <button class="btn btn-xs btn-primary" id="btn-open-custom-item" title="Create Custom Furniture Dimension">
        ${getIcon('plus', 'icon-xs')} Custom
      </button>
    </div>

    <!-- Search Bar -->
    <div class="p-2 border-b">
      <div class="relative">
        <input type="text" id="catalog-search-input" class="form-control form-control-sm pl-8 font-sans w-full" placeholder="Search items, finishes, SKUs..." value="${escapeHTML(searchQuery)}" aria-label="Search furniture catalog" />
        <span class="absolute left-2.5 top-2 text-muted pointer-events-none">${getIcon('search', 'icon-xs')}</span>
        ${searchQuery ? `<button id="btn-clear-search" class="absolute right-2 top-1.5 btn-icon-xs text-muted" title="Clear search">${getIcon('close', 'icon-xs')}</button>` : ''}
      </div>
    </div>

    <!-- Category Pill Filter -->
    <div class="p-2 border-b flex flex-wrap gap-1" role="tablist" aria-label="Furniture categories">
      ${categories.map(c => `
        <button class="badge ${activeCategory === c ? 'badge-primary' : 'badge-secondary'} cursor-pointer cat-pill-btn" data-cat="${c}" role="tab" aria-selected="${activeCategory === c}">
          ${c}
        </button>
      `).join('')}
    </div>

    <!-- Scrollable Items List -->
    <div class="catalog-items-scroll p-2 flex flex-col gap-1.5 flex-1 overflow-y-auto" role="list">
      ${filtered.length === 0 ? `
        <div class="text-xs text-muted text-center p-6 flex flex-col items-center gap-2">
          ${getIcon('search', 'icon-sm text-muted')}
          <span>No furniture found matching "${escapeHTML(searchQuery)}".</span>
          <button class="btn btn-xs btn-secondary mt-1" id="btn-reset-catalog-filter">Reset Filters</button>
        </div>
      ` : filtered.map(item => `
        <div class="catalog-item-card card p-2 flex items-center justify-between hover-elevated" role="listitem" tabindex="0">
          <div class="flex items-center gap-2.5 truncate">
            <div class="item-icon-box flex items-center justify-center rounded p-1" style="background-color: var(--bg-elevated); color: ${item.color || 'var(--accent-primary)'};">
              ${getIcon(item.icon || 'sofa', 'icon-sm')}
            </div>
            <div class="flex flex-col truncate">
              <span class="font-bold text-xs text-primary truncate">${escapeHTML(item.name)}</span>
              <div class="flex items-center gap-1.5 font-mono text-muted text-xs" style="font-size: 10px;">
                <span>${formatDimension(item.width, unit)} &times; ${formatDimension(item.depth, unit)}</span>
                ${item.price ? `<span class="text-emerald font-semibold">&bull; ${formatPrice(item.price, currency)}</span>` : ''}
              </div>
            </div>
          </div>

          <button class="btn btn-xs btn-secondary btn-add-catalog-item" data-type="${item.type}" title="Add ${escapeHTML(item.name)} to room" aria-label="Add ${escapeHTML(item.name)} to floor plan">
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

  container.querySelector('#btn-clear-search')?.addEventListener('click', () => {
    if (onSearchChange) onSearchChange('');
  });

  container.querySelector('#btn-reset-catalog-filter')?.addEventListener('click', () => {
    if (onCategoryChange) onCategoryChange('All');
    if (onSearchChange) onSearchChange('');
  });

  container.querySelectorAll('.cat-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onCategoryChange) onCategoryChange(btn.dataset.cat);
    });
  });

  container.querySelectorAll('.btn-add-catalog-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
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
