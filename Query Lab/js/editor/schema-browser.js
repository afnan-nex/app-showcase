/**
 * QueryLab - Database Explorer / Schema Browser Panel
 * Tree view with live search, table node expansion, schema metadata, and contextual quick actions.
 */

import { getIcon, escapeHTML } from '../core/icons.js';

let filterQuery = '';
const expandedTables = new Set();

export function renderSchemaBrowser(container, {
  database,
  onTableSelect = null,
  onQuickQuery = null,
  onOpenTableDesigner = null,
  onDropTable = null,
  onTruncateTable = null
}) {
  const allTables = Object.values(database.tables || {});
  const totalRows = allTables.reduce((acc, t) => acc + (t.rows || []).length, 0);

  // Initialize all tables as expanded by default if set is empty
  if (expandedTables.size === 0) {
    allTables.forEach(t => expandedTables.add(t.name.toLowerCase()));
  }

  // Filter tables & columns based on search input
  const q = filterQuery.toLowerCase().trim();
  const visibleTables = allTables.filter(t => {
    if (!q) return true;
    if (t.name.toLowerCase().includes(q)) return true;
    return t.columns.some(c => c.name.toLowerCase().includes(q) || (c.type || '').toLowerCase().includes(q));
  });

  container.innerHTML = `
    <!-- Header with Database Name & New Table Button -->
    <div class="panel-section-header flex items-center justify-between p-2.5 border-b">
      <div class="flex items-center gap-2 min-w-0">
        ${getIcon('database', 'icon-sm text-primary flex-shrink-0')}
        <div class="flex flex-col min-w-0">
          <span class="text-xs font-bold text-primary truncate" title="${escapeHTML(database.name)}">${escapeHTML(database.name)}</span>
          <span class="text-muted font-mono" style="font-size: 10px;">${allTables.length} tables &bull; ${totalRows} total rows</span>
        </div>
      </div>
      <button class="btn btn-xs btn-primary" id="btn-open-designer" title="Create New Table Visually">
        ${getIcon('plus', 'icon-xs')} Table
      </button>
    </div>

    <!-- Search / Filter Input Bar -->
    <div class="p-2 border-b" style="background-color: var(--bg-panel);">
      <div class="relative flex items-center">
        <span class="absolute" style="left: 6px; color: var(--text-muted); pointer-events: none;">
          ${getIcon('search', 'icon-xs')}
        </span>
        <input 
          type="text" 
          id="input-filter-schema" 
          class="form-control form-control-sm w-full font-mono text-xs" 
          style="padding-left: 24px;" 
          placeholder="Filter tables & columns..." 
          value="${escapeHTML(filterQuery)}"
          aria-label="Filter tables and columns"
        />
        ${filterQuery ? `
          <button id="btn-clear-schema-filter" class="btn-icon-xs absolute" style="right: 4px;" title="Clear Filter">&times;</button>
        ` : ''}
      </div>
    </div>

    <!-- Tree View Scroll Container -->
    <div class="schema-tree-scroll p-2 flex flex-col gap-1.5 flex-1 overflow-y-auto">
      ${visibleTables.length === 0 ? `
        <div class="text-xs text-muted text-center p-4">
          ${q ? `No tables or columns match "${escapeHTML(q)}".` : 'No tables in database. Click "+ Table" to create one.'}
        </div>
      ` : visibleTables.map(t => {
        const numRows = (t.rows || []).length;
        const tKey = t.name.toLowerCase();
        const isExpanded = expandedTables.has(tKey);

        return `
          <div class="schema-table-node card p-2" data-table="${escapeHTML(t.name)}">
            <!-- Table Header Row -->
            <div class="flex items-center justify-between cursor-pointer table-header-row" data-table-toggle="${escapeHTML(tKey)}">
              <div class="flex items-center gap-1.5 flex-1 min-w-0">
                <span class="text-muted table-chevron-icon">
                  ${getIcon(isExpanded ? 'chevronDown' : 'chevronRight', 'icon-xs')}
                </span>
                <span class="text-primary">${getIcon('table', 'icon-xs')}</span>
                <span class="font-bold text-xs text-primary truncate" title="${escapeHTML(t.name)}">${escapeHTML(t.name)}</span>
                <span class="badge badge-secondary font-mono text-muted" style="font-size: 9.5px; padding: 1px 4px;">${numRows}</span>
              </div>

              <!-- Quick Actions -->
              <div class="flex items-center gap-0.5" onclick="event.stopPropagation();">
                <button class="btn-icon-xs btn-table-quick-select" data-table="${escapeHTML(t.name)}" title="Query: SELECT * FROM ${escapeHTML(t.name)} LIMIT 50">
                  ${getIcon('play', 'icon-xs text-emerald')}
                </button>
                <div class="table-actions-menu-wrapper relative">
                  <button class="btn-icon-xs btn-table-more-actions" data-table="${escapeHTML(t.name)}" title="Table Actions">
                    ${getIcon('code', 'icon-xs')}
                  </button>
                </div>
                <button class="btn-icon-xs text-rose btn-table-drop" data-table="${escapeHTML(t.name)}" title="Drop Table">
                  ${getIcon('trash', 'icon-xs')}
                </button>
              </div>
            </div>

            <!-- Columns List (Collapsible) -->
            <div class="table-columns-list pl-4 flex flex-col gap-1 border-t pt-1.5 mt-1.5" style="display: ${isExpanded ? 'flex' : 'none'};">
              ${t.columns.map(c => {
                const isPK = c.isPrimaryKey;
                const isFK = (t.foreignKeys || []).find(fk => fk.column === c.name);

                return `
                  <div class="column-item-row flex items-center justify-between text-xs py-0.5 cursor-pointer hover:bg-hover rounded px-1" data-col-quick="${escapeHTML(t.name)}.${escapeHTML(c.name)}" title="Click to insert '${escapeHTML(t.name)}.${escapeHTML(c.name)}'">
                    <div class="flex items-center gap-1.5 truncate">
                      ${isPK ? `<span class="badge badge-primary font-mono" style="font-size: 8.5px; padding: 1px 3px;">PK</span>` : ''}
                      ${isFK ? `<span class="badge badge-secondary font-mono text-amber" style="font-size: 8.5px; padding: 1px 3px;" title="References ${escapeHTML(isFK.refTable)}.${escapeHTML(isFK.refColumn)}">FK</span>` : ''}
                      <span class="font-mono text-secondary truncate">${escapeHTML(c.name)}</span>
                    </div>
                    <span class="text-muted font-mono" style="font-size: 9.5px;">${c.type || 'TEXT'}</span>
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
  const filterInput = container.querySelector('#input-filter-schema');
  filterInput?.addEventListener('input', (e) => {
    filterQuery = e.target.value;
    renderSchemaBrowser(container, { database, onTableSelect, onQuickQuery, onOpenTableDesigner, onDropTable, onTruncateTable });
    const newInp = container.querySelector('#input-filter-schema');
    if (newInp) {
      newInp.focus();
      newInp.selectionStart = newInp.selectionEnd = filterQuery.length;
    }
  });

  container.querySelector('#btn-clear-schema-filter')?.addEventListener('click', () => {
    filterQuery = '';
    renderSchemaBrowser(container, { database, onTableSelect, onQuickQuery, onOpenTableDesigner, onDropTable, onTruncateTable });
  });

  container.querySelector('#btn-open-designer')?.addEventListener('click', () => {
    if (onOpenTableDesigner) onOpenTableDesigner();
  });

  // Table expand/collapse toggle
  container.querySelectorAll('[data-table-toggle]').forEach(header => {
    header.addEventListener('click', () => {
      const tKey = header.dataset.tableToggle;
      if (expandedTables.has(tKey)) {
        expandedTables.delete(tKey);
      } else {
        expandedTables.add(tKey);
      }
      renderSchemaBrowser(container, { database, onTableSelect, onQuickQuery, onOpenTableDesigner, onDropTable, onTruncateTable });
    });
  });

  // Quick Select
  container.querySelectorAll('.btn-table-quick-select').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tName = btn.dataset.table;
      if (onQuickQuery) onQuickQuery(`SELECT * FROM ${tName} LIMIT 50;`);
    });
  });

  // Table More Actions menu / templates
  container.querySelectorAll('.btn-table-more-actions').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tName = btn.dataset.table;
      const table = database.getTable(tName);
      if (!table) return;

      const colList = table.columns.map(c => c.name).join(',\n  ');
      const action = prompt(`Quick SQL Generator for '${tName}':\n1. SELECT all columns\n2. INSERT template\n3. DESCRIBE schema\n4. TRUNCATE table\nEnter 1, 2, 3, or 4:`, '1');

      if (action === '1') {
        if (onQuickQuery) onQuickQuery(`SELECT \n  ${colList}\nFROM ${tName}\nLIMIT 50;`);
      } else if (action === '2') {
        const dummyVals = table.columns.map(c => c.type === 'INTEGER' || c.type === 'REAL' ? '0' : "'sample'").join(', ');
        if (onQuickQuery) onQuickQuery(`INSERT INTO ${tName} (${table.columns.map(c => c.name).join(', ')})\nVALUES (${dummyVals});`);
      } else if (action === '3') {
        if (onQuickQuery) onQuickQuery(`DESCRIBE ${tName};`);
      } else if (action === '4') {
        if (confirm(`Are you sure you want to TRUNCATE '${tName}' (delete all rows)?`)) {
          if (onTruncateTable) onTruncateTable(tName);
          else if (onQuickQuery) onQuickQuery(`TRUNCATE TABLE ${tName};`);
        }
      }
    });
  });

  // Column name quick insertion
  container.querySelectorAll('[data-col-quick]').forEach(row => {
    row.addEventListener('click', () => {
      const colRef = row.dataset.colQuick;
      if (window.queryLabApp && window.queryLabApp.editor) {
        const ed = window.queryLabApp.editor;
        const curVal = ed.getValue();
        ed.setValue(curVal + ' ' + colRef);
      }
    });
  });

  // Drop Table
  container.querySelectorAll('.btn-table-drop').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tName = btn.dataset.table;
      if (confirm(`Are you sure you want to DROP TABLE '${tName}'? All data in this table will be deleted.`)) {
        if (onDropTable) onDropTable(tName);
      }
    });
  });
}
