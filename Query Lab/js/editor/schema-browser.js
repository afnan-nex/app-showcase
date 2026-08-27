/**
 * QueryLab - Database Explorer / Schema Browser Panel
 * Tree view displaying database tables, columns, data types, constraints, and quick queries.
 */

import { getIcon, escapeHTML } from '../core/icons.js';

export function renderSchemaBrowser(container, {
  database,
  onTableSelect = null,
  onQuickQuery = null,
  onOpenTableDesigner = null,
  onDropTable = null
}) {
  const tables = Object.values(database.tables || {});

  container.innerHTML = `
    <!-- Header -->
    <div class="panel-section-header flex items-center justify-between p-3 border-b">
      <div class="flex items-center gap-2">
        ${getIcon('database', 'icon-sm text-primary')}
        <span class="text-xs font-bold uppercase text-muted truncate">${escapeHTML(database.name)}</span>
      </div>
      <button class="btn btn-xs btn-primary" id="btn-open-designer" title="Create New Table Visually">
        ${getIcon('plus', 'icon-xs')} Table
      </button>
    </div>

    <!-- Tree View -->
    <div class="schema-tree-scroll p-2 flex flex-col gap-1 flex-1 overflow-y-auto">
      ${tables.length === 0 ? `
        <div class="text-xs text-muted text-center p-4">No tables in database. Click "+ Table" or run CREATE TABLE.</div>
      ` : tables.map(t => {
        const numRows = (t.rows || []).length;

        return `
          <div class="schema-table-node card p-2 mb-1" data-table="${escapeHTML(t.name)}">
            <!-- Table Header Row -->
            <div class="flex items-center justify-between cursor-pointer table-header-row mb-1">
              <div class="flex items-center gap-2 flex-1">
                <span class="text-primary">${getIcon('table', 'icon-xs')}</span>
                <span class="font-bold text-xs text-primary">${escapeHTML(t.name)}</span>
                <span class="badge badge-secondary text-xs font-mono" style="font-size: 10px;">${numRows} rows</span>
              </div>

              <div class="flex items-center gap-1">
                <button class="btn-icon-xs btn-table-quick-select" data-table="${escapeHTML(t.name)}" title="Query: SELECT * FROM ${escapeHTML(t.name)}">
                  ${getIcon('play', 'icon-xs text-emerald')}
                </button>
                <button class="btn-icon-xs text-rose btn-table-drop" data-table="${escapeHTML(t.name)}" title="Drop Table">
                  ${getIcon('trash', 'icon-xs')}
                </button>
              </div>
            </div>

            <!-- Columns List -->
            <div class="table-columns-list pl-3 flex flex-col gap-1 border-t pt-1 mt-1">
              ${t.columns.map(c => {
                const isPK = c.isPrimaryKey;
                const isFK = (t.foreignKeys || []).some(fk => fk.column === c.name);

                return `
                  <div class="column-item-row flex items-center justify-between text-xs py-0.5">
                    <div class="flex items-center gap-1.5 truncate">
                      ${isPK ? `<span class="badge badge-primary font-mono" style="font-size: 9px; padding: 1px 3px;">PK</span>` : ''}
                      ${isFK ? `<span class="badge badge-secondary font-mono text-amber" style="font-size: 9px; padding: 1px 3px;">FK</span>` : ''}
                      <span class="font-mono text-secondary">${escapeHTML(c.name)}</span>
                    </div>
                    <span class="text-muted font-mono" style="font-size: 10px;">${c.type || 'TEXT'}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // --- Attach Handlers ---
  container.querySelector('#btn-open-designer')?.addEventListener('click', () => {
    if (onOpenTableDesigner) onOpenTableDesigner();
  });

  container.querySelectorAll('.btn-table-quick-select').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tName = btn.dataset.table;
      if (onQuickQuery) onQuickQuery(`SELECT * FROM ${tName} LIMIT 50;`);
    });
  });

  container.querySelectorAll('.btn-table-drop').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tName = btn.dataset.table;
      if (confirm(`Are you sure you want to DROP TABLE '${tName}'?`)) {
        if (onDropTable) onDropTable(tName);
      }
    });
  });
}
