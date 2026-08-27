/**
 * QueryLab - Tabular Results Grid Component
 * Renders SQL query output, execution timing, sortable columns, errors, and CSV/JSON export.
 */

import { getIcon, escapeHTML } from '../core/icons.js';

export function renderResultsGrid(container, result, error = null) {
  if (error) {
    container.innerHTML = `
      <div class="results-header-bar flex items-center justify-between px-3 py-1 border-b">
        <div class="flex items-center gap-2">
          <span class="badge badge-danger font-mono text-xs">QUERY ERROR</span>
        </div>
      </div>
      <div class="p-4">
        <div class="card p-3 border-rose bg-rose-subtle text-rose font-mono text-xs" style="border-color: var(--accent-rose); background-color: var(--accent-rose-subtle);">
          <strong>Error:</strong> ${escapeHTML(error.message || String(error))}
        </div>
      </div>
    `;
    return;
  }

  if (!result) {
    container.innerHTML = `
      <div class="results-header-bar flex items-center justify-between px-3 py-1 border-b">
        <span class="text-xs text-muted font-mono">RESULTS</span>
      </div>
      <div class="p-6 text-center text-muted text-xs font-mono">
        Write a SQL query and click "Run Query" (Ctrl+Enter) to view results.
      </div>
    `;
    return;
  }

  // DML / DDL result (Insert, Update, Delete, Create, Drop)
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
  const rows = result.rows || [];

  container.innerHTML = `
    <!-- Top Result Action Bar -->
    <div class="results-header-bar flex items-center justify-between px-3 py-1 border-b">
      <div class="flex items-center gap-2">
        <span class="badge badge-success font-mono text-xs">SUCCESS</span>
        <span class="text-xs text-secondary font-mono font-semibold">${rows.length} row(s) returned</span>
        <span class="text-xs text-muted font-mono">in ${result.executionTimeMs || '0'}ms</span>
      </div>

      <div class="flex items-center gap-2">
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
        <div class="p-6 text-center text-muted text-xs font-mono">Query returned 0 rows.</div>
      ` : `
        <table class="data-grid-table font-mono text-xs">
          <thead>
            <tr>
              <th class="row-index-col">#</th>
              ${columns.map(c => `<th class="data-col-header" data-col="${escapeHTML(c.name)}">${escapeHTML(c.name)}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map((row, rIdx) => `
              <tr>
                <td class="row-index-col">${rIdx + 1}</td>
                ${columns.map(c => {
                  const val = row[c.name];
                  return `<td>${formatCellValue(val)}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    </div>
  `;

  // Attach CSV / JSON exporters
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
    return `<span class="badge ${val ? 'badge-success' : 'badge-secondary'}" style="font-size: 9px;">${val ? 'TRUE' : 'FALSE'}</span>`;
  }
  if (typeof val === 'number') {
    return `<span class="cell-number">${val}</span>`;
  }
  return escapeHTML(String(val));
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
  a.download = 'query_results.csv';
  a.click();
}

function exportToJSON(rows) {
  const json = JSON.stringify(rows, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'query_results.json';
  a.click();
}
