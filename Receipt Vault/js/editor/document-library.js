/**
 * ReceiptVault - Document Library & Multi-Filter Component
 * Compact professional table listing receipts, warranties, amounts, categories, quick chips, and keyboard navigation.
 */

import { getIcon, escapeHTML } from '../core/icons.js';
import { getWarrantyInfo, getReturnInfo, WARRANTY_STATUS, RETURN_STATUS } from '../core/warranty.js';

export function renderDocumentLibrary(container, {
  documents = [],
  selectedDocId = null,
  filters = {},
  onSelectDoc = null,
  onFilterChange = null
}) {
  const filtered = filterDocuments(documents, filters);

  const categories = ['Electronics', 'Home', 'Clothing', 'Groceries', 'Software', 'Subscriptions', 'Travel', 'Other'];

  // Calculate quick chip counts
  const expiringCount = documents.filter(d => getWarrantyInfo(d.warrantyExpirationDate).status === WARRANTY_STATUS.EXPIRING_SOON).length;
  const returnsCount = documents.filter(d => {
    const r = getReturnInfo(d.returnDeadlineDate);
    return r.status === RETURN_STATUS.OPEN || r.status === RETURN_STATUS.CLOSING_SOON;
  }).length;

  container.innerHTML = `
    <!-- Top Filter Controls Bar -->
    <div class="library-filter-bar p-3 border-b flex flex-col gap-2 bg-panel">
      
      <!-- Primary Controls Row -->
      <div class="flex flex-wrap items-center justify-between gap-2">
        <!-- Search Input -->
        <div class="flex items-center gap-2 flex-1 min-w-[200px]">
          <div class="relative flex-1">
            <input type="text" id="lib-search-input" class="form-control form-control-sm pl-8 font-sans w-full" placeholder="Search vendor, title, serial #, invoice #, tags..." value="${escapeHTML(filters.search || '')}" aria-label="Search documents" />
            <span class="absolute left-2 top-2 text-muted pointer-events-none">${getIcon('search', 'icon-xs')}</span>
            ${filters.search ? `
              <button class="absolute right-2 top-1.5 btn-icon-xs text-muted" id="btn-clear-search" title="Clear Search" aria-label="Clear Search">${getIcon('close', 'icon-xs')}</button>
            ` : ''}
          </div>
        </div>

        <!-- Filter Dropdowns Group -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- Category Filter -->
          <select id="lib-filter-category" class="form-control form-control-sm font-semibold" aria-label="Filter by Category">
            <option value="">All Categories (${documents.length})</option>
            ${categories.map(c => {
              const count = documents.filter(d => d.category === c).length;
              return `<option value="${c}" ${filters.category === c ? 'selected' : ''}>${c} (${count})</option>`;
            }).join('')}
          </select>

          <!-- Warranty Status Filter -->
          <select id="lib-filter-warranty" class="form-control form-control-sm font-semibold" aria-label="Filter by Warranty">
            <option value="">All Warranties</option>
            <option value="ACTIVE" ${filters.warranty === 'ACTIVE' ? 'selected' : ''}>Active Protection</option>
            <option value="EXPIRING_SOON" ${filters.warranty === 'EXPIRING_SOON' ? 'selected' : ''}>Expiring Soon (≤30d)</option>
            <option value="EXPIRED" ${filters.warranty === 'EXPIRED' ? 'selected' : ''}>Expired Coverage</option>
          </select>

          <!-- Sort Order -->
          <select id="lib-sort-by" class="form-control form-control-sm font-semibold" aria-label="Sort by">
            <option value="date_desc" ${filters.sort === 'date_desc' ? 'selected' : ''}>Date: Newest First</option>
            <option value="date_asc" ${filters.sort === 'date_asc' ? 'selected' : ''}>Date: Oldest First</option>
            <option value="amount_desc" ${filters.sort === 'amount_desc' ? 'selected' : ''}>Amount: High to Low</option>
            <option value="amount_asc" ${filters.sort === 'amount_asc' ? 'selected' : ''}>Amount: Low to High</option>
            <option value="warranty_urgent" ${filters.sort === 'warranty_urgent' ? 'selected' : ''}>Warranty: Urgent First</option>
            <option value="title_asc" ${filters.sort === 'title_asc' ? 'selected' : ''}>Title: A to Z</option>
          </select>
        </div>
      </div>

      <!-- Quick Filter Chips Row -->
      <div class="flex flex-wrap items-center gap-1 text-xs">
        <span class="text-muted font-semibold text-xs mr-1">Quick Filters:</span>
        <button class="btn btn-xs ${!filters.category && !filters.warranty && !filters.quickTag ? 'btn-primary' : 'btn-secondary'} btn-chip-all">All</button>
        <button class="btn btn-xs ${filters.warranty === 'EXPIRING_SOON' ? 'btn-primary' : 'btn-secondary'} btn-chip-expiring">
          ${getIcon('shieldAlert', 'icon-xs text-amber')} Expiring Soon (${expiringCount})
        </button>
        <button class="btn btn-xs ${filters.warranty === 'ACTIVE' ? 'btn-primary' : 'btn-secondary'} btn-chip-active">
          ${getIcon('shieldCheck', 'icon-xs text-emerald')} Active Warranties
        </button>
        <button class="btn btn-xs ${filters.quickTag === 'tax-deductible' ? 'btn-primary' : 'btn-secondary'} btn-chip-tax">
          Tax Deductible
        </button>
      </div>

    </div>

    <!-- Documents Data Grid / Table -->
    <div class="library-table-wrapper flex-1 overflow-auto bg-app">
      ${filtered.length === 0 ? `
        <div class="empty-filter-state flex flex-col items-center justify-center p-8 text-center text-muted h-full">
          <div class="mb-2 text-muted" style="opacity: 0.5;">${getIcon('search', 'icon-lg')}</div>
          <span class="font-bold text-sm text-secondary">No Matching Documents</span>
          <p class="text-xs text-muted mt-1 max-w-sm">No records match your active search and filter criteria.</p>
          <button class="btn btn-sm btn-secondary mt-3" id="btn-reset-filters">
            ${getIcon('refreshCw', 'icon-xs')} Clear All Filters
          </button>
        </div>
      ` : `
        <table class="data-grid-table font-sans text-xs w-full" id="documents-table">
          <thead>
            <tr>
              <th class="w-8 text-center">Type</th>
              <th>Vendor & Document Description</th>
              <th>Category</th>
              <th>Purchase Date</th>
              <th class="text-right">Amount</th>
              <th>Warranty Protection</th>
              <th>Return Deadline</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(doc => {
              const isSelected = doc.id === selectedDocId;
              const wInfo = getWarrantyInfo(doc.warrantyExpirationDate, new Date(), doc.purchaseDate);
              const rInfo = getReturnInfo(doc.returnDeadlineDate);

              return `
                <tr class="document-row cursor-pointer ${isSelected ? 'active' : ''}" data-id="${doc.id}" tabindex="0" role="row" aria-selected="${isSelected}">
                  <td class="text-center text-muted">
                    ${getIcon('receipt', 'icon-xs')}
                  </td>
                  <td>
                    <div class="flex flex-col">
                      <div class="flex items-center gap-1.5">
                        <span class="font-bold text-primary truncate max-w-md">${escapeHTML(doc.title)}</span>
                        ${doc.serialNumber ? `<span class="badge badge-secondary font-mono" style="font-size: 9.5px;" title="Serial #${escapeHTML(doc.serialNumber)}">SN</span>` : ''}
                      </div>
                      <div class="flex items-center gap-2 text-muted" style="font-size: 11px;">
                        <span>${escapeHTML(doc.vendor)}</span>
                        ${doc.invoiceNumber ? `<span>&bull; Inv: ${escapeHTML(doc.invoiceNumber)}</span>` : ''}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-secondary">${escapeHTML(doc.category)}</span>
                  </td>
                  <td class="font-mono text-secondary">
                    ${escapeHTML(doc.purchaseDate || '-')}
                  </td>
                  <td class="font-mono font-bold text-right text-primary">
                    ${doc.currency || '$'}${Number(doc.amount || 0).toFixed(2)}
                  </td>
                  <td>
                    ${doc.warrantyExpirationDate ? `
                      <span class="badge ${wInfo.status === WARRANTY_STATUS.ACTIVE ? 'badge-success' : (wInfo.status === WARRANTY_STATUS.EXPIRING_SOON ? 'badge-warning' : 'badge-secondary')} flex items-center gap-1 w-fit">
                        ${getIcon(wInfo.status === WARRANTY_STATUS.EXPIRING_SOON ? 'shieldAlert' : 'shieldCheck', 'icon-xs')}
                        <span>${escapeHTML(wInfo.label)}</span>
                      </span>
                    ` : `<span class="text-muted text-xs">-</span>`}
                  </td>
                  <td>
                    ${doc.returnDeadlineDate ? `
                      <span class="badge ${rInfo.status === RETURN_STATUS.OPEN ? 'badge-primary' : (rInfo.status === RETURN_STATUS.CLOSING_SOON ? 'badge-warning' : 'badge-secondary')} flex items-center gap-1 w-fit">
                        ${getIcon('clock', 'icon-xs')}
                        <span>${escapeHTML(rInfo.label)}</span>
                      </span>
                    ` : `<span class="text-muted text-xs">-</span>`}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `}
    </div>

    <!-- Table Footer Stats Bar -->
    <div class="library-footer-bar px-3 py-1.5 border-t flex items-center justify-between text-xs text-muted font-mono bg-elevated">
      <span>Showing <strong>${filtered.length}</strong> of <strong>${documents.length}</strong> records</span>
      <span>Filtered Spend: <strong class="text-primary">$${filtered.reduce((sum, d) => sum + (Number(d.amount) || 0), 0).toFixed(2)}</strong></span>
    </div>
  `;

  // Attach Row Selection & Keyboard Navigation Handlers
  container.querySelectorAll('.document-row').forEach(row => {
    row.addEventListener('click', () => {
      if (onSelectDoc) onSelectDoc(row.dataset.id);
    });

    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (onSelectDoc) onSelectDoc(row.dataset.id);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = row.nextElementSibling;
        if (next && next.classList.contains('document-row')) {
          next.focus();
          if (onSelectDoc) onSelectDoc(next.dataset.id);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = row.previousElementSibling;
        if (prev && prev.classList.contains('document-row')) {
          prev.focus();
          if (onSelectDoc) onSelectDoc(prev.dataset.id);
        }
      }
    });
  });

  // Filter Input Listeners
  const searchInput = container.querySelector('#lib-search-input');
  searchInput?.addEventListener('input', (e) => {
    if (onFilterChange) onFilterChange({ ...filters, search: e.target.value });
  });

  container.querySelector('#btn-clear-search')?.addEventListener('click', () => {
    if (onFilterChange) onFilterChange({ ...filters, search: '' });
  });

  const catSelect = container.querySelector('#lib-filter-category');
  catSelect?.addEventListener('change', (e) => {
    if (onFilterChange) onFilterChange({ ...filters, category: e.target.value });
  });

  const warSelect = container.querySelector('#lib-filter-warranty');
  warSelect?.addEventListener('change', (e) => {
    if (onFilterChange) onFilterChange({ ...filters, warranty: e.target.value });
  });

  const sortSelect = container.querySelector('#lib-sort-by');
  sortSelect?.addEventListener('change', (e) => {
    if (onFilterChange) onFilterChange({ ...filters, sort: e.target.value });
  });

  // Quick Chip Handlers
  container.querySelector('.btn-chip-all')?.addEventListener('click', () => {
    if (onFilterChange) onFilterChange({ search: '', category: '', warranty: '', quickTag: '', sort: filters.sort || 'date_desc' });
  });

  container.querySelector('.btn-chip-expiring')?.addEventListener('click', () => {
    if (onFilterChange) onFilterChange({ ...filters, warranty: 'EXPIRING_SOON', quickTag: '' });
  });

  container.querySelector('.btn-chip-active')?.addEventListener('click', () => {
    if (onFilterChange) onFilterChange({ ...filters, warranty: 'ACTIVE', quickTag: '' });
  });

  container.querySelector('.btn-chip-tax')?.addEventListener('click', () => {
    if (onFilterChange) onFilterChange({ ...filters, quickTag: 'tax-deductible' });
  });

  container.querySelector('#btn-reset-filters')?.addEventListener('click', () => {
    if (onFilterChange) onFilterChange({ search: '', category: '', warranty: '', quickTag: '', sort: 'date_desc' });
  });
}

export function filterDocuments(documents, filters = {}) {
  let list = [...documents];

  // 1. Text Search
  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(d =>
      (d.title && d.title.toLowerCase().includes(q)) ||
      (d.vendor && d.vendor.toLowerCase().includes(q)) ||
      (d.invoiceNumber && d.invoiceNumber.toLowerCase().includes(q)) ||
      (d.serialNumber && d.serialNumber.toLowerCase().includes(q)) ||
      (d.category && d.category.toLowerCase().includes(q)) ||
      (d.notes && d.notes.toLowerCase().includes(q)) ||
      (d.tags && d.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  // 2. Category
  if (filters.category) {
    list = list.filter(d => d.category === filters.category);
  }

  // 3. Warranty Status
  if (filters.warranty) {
    list = list.filter(d => {
      const wInfo = getWarrantyInfo(d.warrantyExpirationDate);
      return wInfo.status === filters.warranty;
    });
  }

  // 4. Quick Tag Filter
  if (filters.quickTag) {
    list = list.filter(d => d.tags && d.tags.includes(filters.quickTag));
  }

  // 5. Sorting
  const sortKey = filters.sort || 'date_desc';
  list.sort((a, b) => {
    if (sortKey === 'date_desc') return new Date(b.purchaseDate || 0) - new Date(a.purchaseDate || 0);
    if (sortKey === 'date_asc') return new Date(a.purchaseDate || 0) - new Date(b.purchaseDate || 0);
    if (sortKey === 'amount_desc') return (b.amount || 0) - (a.amount || 0);
    if (sortKey === 'amount_asc') return (a.amount || 0) - (b.amount || 0);
    if (sortKey === 'title_asc') return (a.title || '').localeCompare(b.title || '');
    if (sortKey === 'warranty_urgent') {
      const wA = getWarrantyInfo(a.warrantyExpirationDate).daysRemaining ?? 99999;
      const wB = getWarrantyInfo(b.warrantyExpirationDate).daysRemaining ?? 99999;
      return wA - wB;
    }
    return 0;
  });

  return list;
}
