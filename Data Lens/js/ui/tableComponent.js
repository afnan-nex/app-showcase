/**
 * DataLens - Spreadsheet Data Table Component
 * Features: virtualized pagination, column resizing, multi-column sorting,
 * quick filtering, column visibility toggles, and formatted cell rendering.
 */

class TableComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.rawData = [];
    this.filteredData = [];
    this.columns = [];
    this.hiddenColumns = new Set();
    
    this.currentPage = 1;
    this.pageSize = 50;
    this.searchQuery = '';
    this.sortCriteria = []; // Array of { column, direction: 'asc'|'desc' }
    this.activeFilters = []; // Array of { column, operator, value, value2 }

    this.columnWidths = {};
    this.resizingCol = null;
    this.startX = 0;
    this.startWidth = 0;

    this.initEventListeners();
  }

  setDataset(data, columns) {
    this.rawData = data || [];
    this.columns = columns || [];
    this.currentPage = 1;
    this.sortCriteria = [];
    this.activeFilters = [];
    this.searchQuery = '';
    this.applyDataPipeline();
  }

  applyDataPipeline() {
    let result = [...this.rawData];

    // Global Search
    if (this.searchQuery) {
      result = DataEngine.searchRows(result, this.searchQuery);
    }

    // Filters
    if (this.activeFilters.length > 0) {
      result = DataEngine.filterRows(result, this.activeFilters, this.columns);
    }

    // Sorts
    if (this.sortCriteria.length > 0) {
      result = DataEngine.sortRows(result, this.sortCriteria, this.columns);
    }

    this.filteredData = result;
    this.render();
  }

  render() {
    if (!this.container) return;

    if (!this.rawData || this.rawData.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 3h18v18H3zM3 9h18M9 21V9"/>
          </svg>
          <div class="empty-state-title">No Dataset Loaded</div>
          <div class="empty-state-desc">Import a CSV/JSON file or choose a sample dataset from the top bar.</div>
        </div>
      `;
      return;
    }

    const visibleCols = this.columns.filter(c => !this.hiddenColumns.has(c.name));
    const totalRows = this.filteredData.length;
    const totalPages = Math.max(1, Math.ceil(totalRows / this.pageSize));
    this.currentPage = Math.min(Math.max(1, this.currentPage), totalPages);

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const pageRows = this.filteredData.slice(startIndex, startIndex + this.pageSize);

    let html = `
      <div class="table-view-container">
        <!-- Toolbar & Filter Pills Bar -->
        <div class="view-toolbar">
          <div class="toolbar-group" style="flex: 1; max-width: 320px;">
            <div class="search-input-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" class="search-input" id="table-search-input" placeholder="Search table (all columns)..." value="${this.escapeHtml(this.searchQuery)}" aria-label="Search spreadsheet table">
            </div>
          </div>

          <div class="toolbar-group">
            <button class="btn btn-secondary btn-sm" id="btn-add-table-filter" aria-label="Open filter dialog">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              <span>Filter (${this.activeFilters.length})</span>
            </button>

            <button class="btn btn-secondary btn-sm" id="btn-column-visibility" aria-label="Toggle column visibility">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <span>Columns (${visibleCols.length}/${this.columns.length})</span>
            </button>

            <button class="btn btn-secondary btn-sm" id="btn-copy-table-data" title="Copy visible rows to clipboard">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <span>Copy</span>
            </button>

            <button class="btn btn-secondary btn-sm" id="btn-export-table-csv" aria-label="Export table as CSV">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        ${this.renderActiveFilterChips()}

        <!-- Scrollable Spreadsheet Grid -->
        <div class="table-scroll-area" id="table-scroll-container">
          <table class="data-table" id="main-data-table" role="grid" aria-label="Data Table Grid">
            <thead>
              <tr role="row">
                <th class="row-index-cell" scope="col">#</th>
                ${visibleCols.map(col => this.renderHeaderCell(col)).join('')}
              </tr>
            </thead>
            <tbody>
              ${pageRows.map((row, idx) => this.renderRow(row, visibleCols, startIndex + idx + 1)).join('')}
            </tbody>
          </table>
        </div>

        <!-- Pagination Bar -->
        <div class="table-pagination">
          <div class="pagination-info">
            Showing <strong>${totalRows > 0 ? (startIndex + 1).toLocaleString() : 0}</strong> to <strong>${Math.min(startIndex + this.pageSize, totalRows).toLocaleString()}</strong> of <strong>${totalRows.toLocaleString()}</strong> rows
            ${totalRows !== this.rawData.length ? ` (filtered from ${this.rawData.length.toLocaleString()})` : ''}
          </div>

          <div class="pagination-controls">
            <label class="form-label" style="margin: 0; font-size: 11px;">Rows per page:</label>
            <select class="form-control form-control-sm" id="select-page-size" style="width: 70px;" aria-label="Select rows per page">
              ${[25, 50, 100, 250, 500].map(s => `<option value="${s}" ${s === this.pageSize ? 'selected' : ''}>${s}</option>`).join('')}
            </select>

            <button class="btn btn-secondary btn-sm btn-icon" id="btn-prev-page" aria-label="Previous Page" ${this.currentPage <= 1 ? 'disabled' : ''}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>

            <span class="pagination-info">Page <strong>${this.currentPage}</strong> of <strong>${totalPages}</strong></span>

            <button class="btn btn-secondary btn-sm btn-icon" id="btn-next-page" aria-label="Next Page" ${this.currentPage >= totalPages ? 'disabled' : ''}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
    this.bindDynamicEvents();
  }

  renderHeaderCell(col) {
    const sort = this.sortCriteria.find(s => s.column === col.name);
    let sortSymbol = '';
    let ariaSort = 'none';
    if (sort) {
      sortSymbol = sort.direction === 'asc' ? ' ▲' : ' ▼';
      ariaSort = sort.direction === 'asc' ? 'ascending' : 'descending';
    }

    const widthStyle = this.columnWidths[col.name] ? `style="width: ${this.columnWidths[col.name]}px; min-width: ${this.columnWidths[col.name]}px;"` : '';

    return `
      <th data-col-name="${this.escapeHtml(col.name)}" ${widthStyle} scope="col" aria-sort="${ariaSort}">
        <div class="th-content">
          <div class="th-title-group" data-action="sort" tabindex="0" role="button" title="Click to sort by ${this.escapeHtml(col.name)}">
            <span class="type-badge type-${col.type}">${col.type.slice(0, 3)}</span>
            <span class="th-column-name">${this.escapeHtml(col.name)}</span>
            <span class="sort-icon">${sortSymbol}</span>
          </div>
        </div>
        <div class="col-resize-handle" data-col-name="${this.escapeHtml(col.name)}" title="Drag to resize column"></div>
      </th>
    `;
  }

  renderRow(row, visibleCols, rowNum) {
    return `
      <tr role="row">
        <td class="row-index-cell">${rowNum}</td>
        ${visibleCols.map(col => {
          const rawVal = row[col.name];
          const isNull = rawVal === undefined || rawVal === null || String(rawVal).trim() === '';
          const formatted = isNull ? '(blank)' : TypeDetector.formatValue(rawVal, col.type);
          const alignClass = col.isNumeric ? 'align-right' : (col.type === DATA_TYPES.BOOLEAN ? 'align-center' : '');
          const nullClass = isNull ? 'null-value' : '';

          return `<td class="${alignClass} ${nullClass}" title="${this.escapeHtml(String(rawVal || ''))}">${this.escapeHtml(formatted)}</td>`;
        }).join('')}
      </tr>
    `;
  }

  renderActiveFilterChips() {
    if (this.activeFilters.length === 0) return '';

    return `
      <div class="table-filter-bar">
        <span style="font-size: 11px; color: var(--text-muted); font-weight: 600;">ACTIVE FILTERS:</span>
        ${this.activeFilters.map((f, idx) => `
          <div class="filter-chip">
            <strong>${this.escapeHtml(f.column)}</strong> ${f.operator.replace('_', ' ')} "${this.escapeHtml(String(f.value || ''))}"
            <span class="filter-chip-remove" data-action="remove-filter" data-index="${idx}" role="button" aria-label="Remove filter">×</span>
          </div>
        `).join('')}
        <button class="btn btn-ghost btn-sm" id="btn-clear-all-filters" style="font-size: 10px; padding: 2px 6px;">Clear All</button>
      </div>
    `;
  }

  bindDynamicEvents() {
    // Search input
    const searchInput = document.getElementById('table-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.currentPage = 1;
        this.applyDataPipeline();
      });
    }

    // Page size change
    const pageSizeSelect = document.getElementById('select-page-size');
    if (pageSizeSelect) {
      pageSizeSelect.addEventListener('change', (e) => {
        this.pageSize = parseInt(e.target.value, 10);
        this.currentPage = 1;
        this.render();
      });
    }

    // Page navigation
    const prevBtn = document.getElementById('btn-prev-page');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.render();
        }
      });
    }

    const nextBtn = document.getElementById('btn-next-page');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(this.filteredData.length / this.pageSize);
        if (this.currentPage < totalPages) {
          this.currentPage++;
          this.render();
        }
      });
    }

    // Copy to Clipboard
    const copyBtn = document.getElementById('btn-copy-table-data');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const visibleCols = this.columns.filter(c => !this.hiddenColumns.has(c.name));
        const tsv = this.filteredData.slice(0, 500).map(r => visibleCols.map(c => r[c.name] || '').join('\t')).join('\n');
        navigator.clipboard.writeText(tsv).then(() => {
          window.Toast.success('Copied 500 rows to clipboard (TSV format)');
        }).catch(() => {
          window.Toast.warning('Clipboard access restricted');
        });
      });
    }

    // Export CSV
    const exportBtn = document.getElementById('btn-export-table-csv');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const csv = DataParser.exportToCSV(this.filteredData, this.columns.filter(c => !this.hiddenColumns.has(c.name)));
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `datalens_export_${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        window.Toast.success('Table exported to CSV successfully');
      });
    }

    // Filter button & chip remove
    const addFilterBtn = document.getElementById('btn-add-table-filter');
    if (addFilterBtn) {
      addFilterBtn.addEventListener('click', () => this.showFilterModal());
    }

    const clearAllFiltersBtn = document.getElementById('btn-clear-all-filters');
    if (clearAllFiltersBtn) {
      clearAllFiltersBtn.addEventListener('click', () => {
        this.activeFilters = [];
        this.applyDataPipeline();
      });
    }

    const removeChips = this.container.querySelectorAll('[data-action="remove-filter"]');
    removeChips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        this.activeFilters.splice(idx, 1);
        this.applyDataPipeline();
      });
    });

    // Column visibility button
    const colVisBtn = document.getElementById('btn-column-visibility');
    if (colVisBtn) {
      colVisBtn.addEventListener('click', () => this.showColumnVisibilityModal());
    }

    // Column Sort Headers
    const sortHeaders = this.container.querySelectorAll('[data-action="sort"]');
    sortHeaders.forEach(th => {
      const handleSort = () => {
        const colTh = th.closest('th');
        const colName = colTh.dataset.colName;
        this.toggleSort(colName);
      };

      th.addEventListener('click', handleSort);
      th.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSort();
        }
      });
    });

    // Column Resize Handles
    const resizeHandles = this.container.querySelectorAll('.col-resize-handle');
    resizeHandles.forEach(handle => {
      handle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        this.resizingCol = handle.dataset.colName;
        const th = handle.closest('th');
        this.startX = e.pageX;
        this.startWidth = th.offsetWidth;
        handle.classList.add('active');
        document.body.style.cursor = 'col-resize';
      });
    });
  }

  initEventListeners() {
    document.addEventListener('mousemove', (e) => {
      if (!this.resizingCol) return;
      const diff = e.pageX - this.startX;
      const newWidth = Math.max(70, this.startWidth + diff);
      this.columnWidths[this.resizingCol] = newWidth;

      const th = this.container.querySelector(`th[data-col-name="${CSS.escape(this.resizingCol)}"]`);
      if (th) {
        th.style.width = `${newWidth}px`;
        th.style.minWidth = `${newWidth}px`;
      }
    });

    document.addEventListener('mouseup', () => {
      if (this.resizingCol) {
        const handles = this.container.querySelectorAll('.col-resize-handle');
        handles.forEach(h => h.classList.remove('active'));
        this.resizingCol = null;
        document.body.style.cursor = '';
      }
    });
  }

  toggleSort(colName) {
    const existing = this.sortCriteria.find(s => s.column === colName);
    if (!existing) {
      this.sortCriteria = [{ column: colName, direction: 'asc' }];
    } else if (existing.direction === 'asc') {
      existing.direction = 'desc';
    } else {
      this.sortCriteria = [];
    }
    this.applyDataPipeline();
  }

  showFilterModal() {
    const modalBackdrop = document.getElementById('app-modal-backdrop');
    const modalDialog = document.getElementById('app-modal-dialog');
    if (!modalBackdrop || !modalDialog) return;

    modalDialog.innerHTML = `
      <div class="modal-header">
        <div class="modal-title">Filter Dataset</div>
        <button class="btn btn-ghost btn-sm btn-icon" id="btn-close-modal" aria-label="Close dialog">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label" for="modal-filter-col">Column</label>
          <select class="form-control" id="modal-filter-col">
            ${this.columns.map(c => `<option value="${this.escapeHtml(c.name)}">${this.escapeHtml(c.name)} (${c.type})</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="modal-filter-op">Operator</label>
          <select class="form-control" id="modal-filter-op">
            <option value="equals">Equals</option>
            <option value="not_equals">Not Equals</option>
            <option value="contains" selected>Contains</option>
            <option value="not_contains">Does Not Contain</option>
            <option value="starts_with">Starts With</option>
            <option value="ends_with">Ends With</option>
            <option value="gt">Greater Than (&gt;)</option>
            <option value="gte">Greater or Equal (&gt;=)</option>
            <option value="lt">Less Than (&lt;)</option>
            <option value="lte">Less or Equal (&lt;=)</option>
            <option value="is_empty">Is Blank / Empty</option>
            <option value="is_not_empty">Is Not Blank</option>
          </select>
        </div>

        <div class="form-group" id="filter-val-group">
          <label class="form-label" for="modal-filter-val">Value</label>
          <input type="text" class="form-control" id="modal-filter-val" placeholder="Filter value...">
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="btn-cancel-modal">Cancel</button>
        <button class="btn btn-primary" id="btn-apply-filter-modal">Add Filter</button>
      </div>
    `;

    modalBackdrop.classList.add('open');

    const closeModal = () => modalBackdrop.classList.remove('open');
    document.getElementById('btn-close-modal').onclick = closeModal;
    document.getElementById('btn-cancel-modal').onclick = closeModal;
    modalBackdrop.onclick = (e) => { if (e.target === modalBackdrop) closeModal(); };

    const valInput = document.getElementById('modal-filter-val');
    valInput.focus();
    valInput.onkeydown = (e) => {
      if (e.key === 'Enter') document.getElementById('btn-apply-filter-modal').click();
    };

    document.getElementById('btn-apply-filter-modal').onclick = () => {
      const col = document.getElementById('modal-filter-col').value;
      const op = document.getElementById('modal-filter-op').value;
      const val = document.getElementById('modal-filter-val').value;

      this.activeFilters.push({ column: col, operator: op, value: val });
      closeModal();
      this.applyDataPipeline();
      window.Toast.info(`Filter added for "${col}"`);
    };
  }

  showColumnVisibilityModal() {
    const modalBackdrop = document.getElementById('app-modal-backdrop');
    const modalDialog = document.getElementById('app-modal-dialog');
    if (!modalBackdrop || !modalDialog) return;

    modalDialog.innerHTML = `
      <div class="modal-header">
        <div class="modal-title">Manage Column Visibility</div>
        <button class="btn btn-ghost btn-sm btn-icon" id="btn-close-modal" aria-label="Close dialog">✕</button>
      </div>
      <div class="modal-body" style="max-height: 400px; overflow-y: auto;">
        <div style="display: flex; gap: 8px; margin-bottom: 12px;">
          <button class="btn btn-secondary btn-sm" id="btn-show-all-cols">Show All</button>
          <button class="btn btn-secondary btn-sm" id="btn-hide-all-cols">Hide All</button>
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          ${this.columns.map(col => `
            <label style="display: flex; align-items: center; gap: 8px; font-size: 12px; cursor: pointer;">
              <input type="checkbox" class="col-vis-checkbox" data-col="${this.escapeHtml(col.name)}" ${!this.hiddenColumns.has(col.name) ? 'checked' : ''}>
              <span class="type-badge type-${col.type}">${col.type.slice(0, 3)}</span>
              <span>${this.escapeHtml(col.name)}</span>
            </label>
          `).join('')}
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="btn-cancel-modal">Cancel</button>
        <button class="btn btn-primary" id="btn-save-col-vis">Apply</button>
      </div>
    `;

    modalBackdrop.classList.add('open');

    const closeModal = () => modalBackdrop.classList.remove('open');
    document.getElementById('btn-close-modal').onclick = closeModal;
    document.getElementById('btn-cancel-modal').onclick = closeModal;
    modalBackdrop.onclick = (e) => { if (e.target === modalBackdrop) closeModal(); };

    document.getElementById('btn-show-all-cols').onclick = () => {
      modalDialog.querySelectorAll('.col-vis-checkbox').forEach(cb => cb.checked = true);
    };

    document.getElementById('btn-hide-all-cols').onclick = () => {
      modalDialog.querySelectorAll('.col-vis-checkbox').forEach((cb, idx) => cb.checked = idx === 0);
    };

    document.getElementById('btn-save-col-vis').onclick = () => {
      this.hiddenColumns.clear();
      modalDialog.querySelectorAll('.col-vis-checkbox').forEach(cb => {
        if (!cb.checked) {
          this.hiddenColumns.add(cb.dataset.col);
        }
      });
      closeModal();
      this.render();
    };
  }

  escapeHtml(str) {
    if (str === undefined || str === null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

window.TableComponent = TableComponent;
