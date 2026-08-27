/**
 * QueryLab - Tabular Results Grid Component
 * Renders SQL query output with interactive column sorting, in-grid search,
 * cell copy, Markdown/CSV/JSON export, execution timing, and formatted data types.
 */

import { getIcon, escapeHTML } from '../core/icons.js';

let sortColumn = null;
let sortDirection = 'ASC'; // 'ASC', 'DESC'
let resultsFilter = '';

export function renderResultsGrid(container, result, error = null) {
  if (error) {
    container.innerHTML = `
      <div class="results-header-bar flex items-center justify-between px-3 py-1 border-b">
        <div class="flex items-center gap-2">
          <span class="badge badge-danger font-mono text-xs">QUERY ERROR</span>
        </div>
      </div>
      <div class="p-4">
        <div class="card p-3 font-mono text-xs flex flex-col gap-2" style="border-color: var(--accent-rose); background-color: var(--accent-rose-subtle); color: #ff7b72;">
          <div class="flex items-center gap-2 font-bold">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <span>Execution Error</span>
          </div>
          <div class="p-2 rounded font-mono" style="background-color: rgba(0,0,0,0.3); line-height: 1.5;">
            ${escapeHTML(error.message || String(error))}
          </div>
          <div class="text-xs text-muted">
            Tip: Check keyword spelling, table or column names, or missing commas/semicolons.
          </div>
        </div>
      </div>
    `;
    return;
  }

  if (!result) {
    container.innerHTML = `
      <div class="results-header-bar flex items-center justify-between px-3 py-1 border-b">
        <span class="text-xs text-muted font-mono font-semibold">QUERY RESULTS</span>
      </div>
      <div class="p-8 text-center text-muted text-xs font-mono flex flex-col items-center justify-center gap-2 flex-1">
        ${getIcon('code', 'icon-sm opacity-40')}
        <span>Write a SQL query above and click "Run Query" (Ctrl+Enter) to view results.</span>
      </div>
    `;
    return;
  }

  // DML / DDL result (Insert, Update, Delete, Create, Drop, Alter, Truncate)
  if (result.type !== 'SELECT') {
    container.innerHTML = `
      <div class="results-header-bar flex items-center justify-between px-3 py-1 border-b">
        <div class="flex items-center gap-2">
          <span class="badge badge-success font-mono text-xs">SUCCESS</span>
          <span class="text-xs text-muted font-mono">Executed in ${result.executionTimeMs || '0'}ms</span>
        </div>
      </div>
      <div class="p-4">
        <div class="card p-3 font-mono text-xs flex items-center gap-2 text-emerald" style="border-color: var(--accent-emerald); background-color: var(--accent-emerald-subtle);">
          ${getIcon('check', 'icon-xs')}
          <span>${escapeHTML(result.message || 'Statement executed successfully.')}</span>
        </div>
      </div>
    `;
    return;
  }

  // SELECT query result
  const columns = result.columns || [];
  let rows = [...(result.rows || [])];

  // Apply in-grid text search
  const q = resultsFilter.toLowerCase().trim();
  if (q) {
    rows = rows.filter(r => {
      return columns.some(c => {
        const val = r[c.name];
        return val !== null && val !== undefined && String(val).toLowerCase().includes(q);
      });
    });
  }

  // Apply column sorting
  if (sortColumn) {
    rows.sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];

      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'ASC' ? valA - valB : valB - valA;
      }
      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      return sortDirection === 'ASC' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
  }

  container.innerHTML = `
    <!-- Top Result Action Bar -->
    <div class="results-header-bar flex items-center justify-between px-3 py-1 border-b flex-wrap gap-2">
      <div class="flex items-center gap-2">
        <span class="badge badge-success font-mono text-xs">SUCCESS</span>
        <span class="text-xs text-secondary font-mono font-semibold">
          ${rows.length}${rows.length !== (result.rows || []).length ? ` of ${(result.rows || []).length}` : ''} row(s)
        </span>
        <span class="text-xs text-muted font-mono">&bull; ${result.executionTimeMs || '0'}ms</span>
      </div>

      <!-- Quick Results Search & Exporters -->
      <div class="flex items-center gap-1.5 flex-wrap">
        <div class="relative flex items-center">
          <input 
            type="text" 
            id="input-results-filter" 
            class="form-control form-control-sm font-mono text-xs" 
            style="width: 140px; padding-left: 20px;" 
            placeholder="Filter results..." 
            value="${escapeHTML(resultsFilter)}"
            aria-label="Filter result rows"
          />
          <span class="absolute" style="left: 5px; color: var(--text-muted); pointer-events: none;">
            ${getIcon('search', 'icon-xs')}
          </span>
        </div>

        <button class="btn btn-xs btn-secondary" id="btn-copy-markdown" title="Copy as Markdown Table">
          ${getIcon('fileText', 'icon-xs')} Markdown
        </button>
        <button class="btn btn-xs btn-secondary" id="btn-export-results-csv" title="Export Results as CSV">
          ${getIcon('download', 'icon-xs')} CSV
        </button>
        <button class="btn btn-xs btn-secondary" id="btn-export-results-json" title="Export Results as JSON">
          ${getIcon('code', 'icon-xs')} JSON
        </button>
      </div>
    </div>

    <!-- Data Table Container -->
    <div class="results-table-container flex-1 overflow-auto">
      ${rows.length === 0 ? `
        <div class="p-6 text-center text-muted text-xs font-mono">
          ${q ? `No rows match filter "${escapeHTML(q)}".` : 'Query returned 0 rows.'}
        </div>
      ` : `
        <table class="data-grid-table font-mono text-xs">
          <thead>
            <tr>
              <th class="row-index-col">#</th>
              ${columns.map(c => {
                const isSorted = sortColumn === c.name;
                return `
                  <th class="data-col-header cursor-pointer select-none" data-col="${escapeHTML(c.name)}" title="Click to sort by ${escapeHTML(c.name)}">
                    <div class="flex items-center justify-between gap-1.5">
                      <span class="truncate">${escapeHTML(c.name)}</span>
                      <span class="text-muted" style="font-size: 10px;">
                        ${isSorted ? (sortDirection === 'ASC' ? '&uarr;' : '&darr;') : ''}
                      </span>
                    </div>
                  </th>
                `;
              }).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map((row, rIdx) => `
              <tr>
                <td class="row-index-col">${rIdx + 1}</td>
                ${columns.map(c => {
                  const val = row[c.name];
                  return `<td class="data-grid-cell" data-cell-value="${escapeHTML(val !== null && val !== undefined ? String(val) : '')}" title="Click to copy value">${formatCellValue(val)}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    </div>
  `;

  // Attach filter handler
  const filterInp = container.querySelector('#input-results-filter');
  filterInp?.addEventListener('input', (e) => {
    resultsFilter = e.target.value;
    renderResultsGrid(container, result, error);
    const newInp = container.querySelector('#input-results-filter');
    if (newInp) {
      newInp.focus();
      newInp.selectionStart = newInp.selectionEnd = resultsFilter.length;
    }
  });

  // Attach column sort handler
  container.querySelectorAll('.data-col-header').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.dataset.col;
      if (sortColumn === col) {
        if (sortDirection === 'ASC') {
          sortDirection = 'DESC';
        } else {
          sortColumn = null;
          sortDirection = 'ASC';
        }
      } else {
        sortColumn = col;
        sortDirection = 'ASC';
      }
      renderResultsGrid(container, result, error);
    });
  });

  // Attach cell click-to-copy handler
  container.querySelectorAll('.data-grid-cell').forEach(td => {
    td.addEventListener('click', () => {
      const val = td.dataset.cellValue;
      if (val !== '') {
        navigator.clipboard.writeText(val).then(() => {
          td.style.backgroundColor = 'var(--accent-primary-subtle)';
          setTimeout(() => { td.style.backgroundColor = ''; }, 300);
        });
      }
    });
  });

  // Attach Markdown / CSV / JSON exporters
  container.querySelector('#btn-copy-markdown')?.addEventListener('click', (e) => {
    const md = exportToMarkdown(columns, rows);
    navigator.clipboard.writeText(md).then(() => {
      const btn = e.currentTarget;
      const oldHTML = btn.innerHTML;
      btn.innerHTML = `${getIcon('check', 'icon-xs text-emerald')} Copied!`;
      setTimeout(() => { btn.innerHTML = oldHTML; }, 1500);
    });
  });

  container.querySelector('#btn-export-results-csv')?.addEventListener('click', () => {
    exportToCSV(columns, rows);
  });

  container.querySelector('#btn-export-results-json')?.addEventListener('click', () => {
    exportToJSON(rows);
  });
}

function formatCellValue(val) {
  if (val === null || val === undefined) {
    return `<span class="cell-null">NULL</span>`;
  }
  if (typeof val === 'boolean') {
    return `<span class="badge ${val ? 'badge-success' : 'badge-secondary'}" style="font-size: 9px; padding: 1px 4px;">${val ? 'TRUE' : 'FALSE'}</span>`;
  }
  if (typeof val === 'number') {
    return `<span class="cell-number">${val}</span>`;
  }
  return escapeHTML(String(val));
}

function exportToMarkdown(columns, rows) {
  if (rows.length === 0) return '';
  const header = '| ' + columns.map(c => c.name).join(' | ') + ' |';
  const sep = '| ' + columns.map(() => '---').join(' | ') + ' |';
  const body = rows.map(r => '| ' + columns.map(c => {
    const v = r[c.name];
    return v === null || v === undefined ? 'NULL' : String(v).replace(/\|/g, '\\|');
  }).join(' | ') + ' |').join('\n');

  return `${header}\n${sep}\n${body}`;
}

function exportToCSV(columns, rows) {
  const colNames = columns.map(c => `"${c.name}"`).join(',');
  const rowLines = rows.map(r => columns.map(c => {
    const v = r[c.name];
    if (v === null || v === undefined) return '';
    return `"${String(v).replace(/"/g, '""')}"`;
  }).join(','));

  const csv = [colNames, ...rowLines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `query_results_${Date.now()}.csv`;
  a.click();
}

function exportToJSON(rows) {
  const json = JSON.stringify(rows, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `query_results_${Date.now()}.json`;
  a.click();
}
