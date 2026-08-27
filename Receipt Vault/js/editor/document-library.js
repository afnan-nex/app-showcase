/**
 * ReceiptVault - Document Library & Multi-Filter Component
 * Compact professional table listing receipts, warranties, amounts, categories, and quick actions.
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

  container.innerHTML = `
    <!-- Top Filter Controls Bar -->
    <div class="library-filter-bar p-3 border-b flex flex-wrap items-center justify-between gap-2">
      <!-- Search Input -->
      <div class="flex items-center gap-2 flex-1 min-w-[200px]">
        <div class="relative flex-1">
          <input type="text" id="lib-search-input" class="form-control form-control-sm pl-8 font-sans" placeholder="Search vendor, item, notes, tags..." value="${escapeHTML(filters.search || '')}" />
          <span class="absolute left-2 top-2 text-muted pointer-events-none">${getIcon('search', 'icon-xs')}</span>
        </div>
      </div>

      <!-- Category Filter -->
      <div class="flex items-center gap-2">
        <select id="lib-filter-category" class="form-control form-control-sm font-semibold">
          <option value="">All Categories</option>
          ${['Electronics', 'Home', 'Clothing', 'Groceries', 'Software', 'Subscriptions', 'Travel', 'Other'].map(c => `
            <option value="${c}" ${filters.category === c ? 'selected' : ''}>${c}</option>
          `).join('')}
        </select>

        <!-- Warranty Status Filter -->
        <select id="lib-filter-warranty" class="form-control form-control-sm font-semibold">
          <option value="">All Warranties</option>
          <option value="ACTIVE" ${filters.warranty === 'ACTIVE' ? 'selected' : ''}>Active Protection</option>
          <option value="EXPIRING_SOON" ${filters.warranty === 'EXPIRING_SOON' ? 'selected' : ''}>Expiring Soon (&le;30d)</option>
          <option value="EXPIRED" ${filters.warranty === 'EXPIRED' ? 'selected' : ''}>Expired</option>
        </select>

        <!-- Sort Order -->
        <select id="lib-sort-by" class="form-control form-control-sm font-semibold">
          <option value="date_desc" ${filters.sort === 'date_desc' ? 'selected' : ''}>Date: Newest First</option>
          <option value="date_asc" ${filters.sort === 'date_asc' ? 'selected' : ''}>Date: Oldest First</option>
          <option value="amount_desc" ${filters.sort === 'amount_desc' ? 'selected' : ''}>Amount: High to Low</option>
          <option value="amount_asc" ${filters.sort === 'amount_asc' ? 'selected' : ''}>Amount: Low to High</option>
          <option value="title_asc" ${filters.sort === 'title_asc' ? 'selected' : ''}>Title: A to Z</option>
        </select>
      </div>
    </div>

    <!-- Documents Data Grid -->
    <div class="library-table-wrapper flex-1 overflow-auto">
      ${filtered.length === 0 ? `
        <div class="p-8 text-center text-muted font-sans text-xs">
          No receipts match the current search filters. Click "New Receipt" to add a document.
        </div>
      ` : `
        <table class="data-grid-table font-sans text-xs w-full">
          <thead>
            <tr>
              <th class="w-8 text-center">Type</th>
              <th>Vendor & Document Title</th>
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
              const wInfo = getWarrantyInfo(doc.warrantyExpirationDate);
              const rInfo = getReturnInfo(doc.returnDeadlineDate);

              return `
                <tr class="document-row cursor-pointer ${isSelected ? 'active' : ''}" data-id="${doc.id}">
                  <td class="text-center text-muted">
                    ${getIcon('receipt', 'icon-xs')}
                  </td>
                  <td>
                    <div class="flex flex-col">
                      <span class="font-bold text-primary">${escapeHTML(doc.title)}</span>
                      <span class="text-xs text-muted">${escapeHTML(doc.vendor)}</span>
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
                      <span class="badge ${wInfo.status === WARRANTY_STATUS.ACTIVE ? 'badge-success' : (wInfo.status === WARRANTY_STATUS.EXPIRING_SOON ? 'badge-warning' : 'badge-secondary')}">
                        ${escapeHTML(wInfo.label)}
                      </span>
                    ` : `<span class="text-muted text-xs">-</span>`}
                  </td>
                  <td>
                    ${doc.returnDeadlineDate ? `
                      <span class="badge ${rInfo.status === RETURN_STATUS.OPEN ? 'badge-primary' : (rInfo.status === RETURN_STATUS.CLOSING_SOON ? 'badge-warning' : 'badge-secondary')}">
                        ${escapeHTML(rInfo.label)}
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

    <!-- Table Footer Stats -->
    <div class="library-footer-bar px-3 py-1 border-t flex items-center justify-between text-xs text-muted font-mono">
      <span>Showing <strong>${filtered.length}</strong> of <strong>${documents.length}</strong> records</span>
      <span>Filtered Total: <strong>$${filtered.reduce((sum, d) => sum + (Number(d.amount) || 0), 0).toFixed(2)}</strong></span>
    </div>
  `;

  // Attach Handlers
  container.querySelectorAll('.document-row').forEach(row => {
    row.addEventListener('click', () => {
      if (onSelectDoc) onSelectDoc(row.dataset.id);
    });
  });

  const searchInput = container.querySelector('#lib-search-input');
  searchInput?.addEventListener('input', (e) => {
    if (onFilterChange) onFilterChange({ ...filters, search: e.target.value });
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
}

export function filterDocuments(documents, filters = {}) {
  let list = [...documents];

  // 1. Text Search
  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(d =>
      (d.title && d.title.toLowerCase().includes(q)) ||
      (d.vendor && d.vendor.toLowerCase().includes(q)) ||
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

  // 4. Sorting
  const sortKey = filters.sort || 'date_desc';
  list.sort((a, b) => {
    if (sortKey === 'date_desc') return new Date(b.purchaseDate || 0) - new Date(a.purchaseDate || 0);
    if (sortKey === 'date_asc') return new Date(a.purchaseDate || 0) - new Date(b.purchaseDate || 0);
    if (sortKey === 'amount_desc') return (b.amount || 0) - (a.amount || 0);
    if (sortKey === 'amount_asc') return (a.amount || 0) - (b.amount || 0);
    if (sortKey === 'title_asc') return (a.title || '').localeCompare(b.title || '');
    return 0;
  });

  return list;
}
