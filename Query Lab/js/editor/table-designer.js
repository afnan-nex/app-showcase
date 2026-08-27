/**
 * QueryLab - Visual Table Designer Modal
 * Visual UI to design database tables, columns, constraints, foreign keys,
 * with real-time SQL DDL preview and validation.
 */

import { getIcon, escapeHTML } from '../core/icons.js';

export class TableDesignerModal {
  constructor(modalContainer, onSaveTable) {
    this.container = modalContainer;
    this.onSaveTable = onSaveTable;
    this.tableName = 'new_table';
    this.database = null;
    this.columns = [
      { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true, isUnique: false, defaultValue: '' },
      { name: 'name', type: 'TEXT', isPrimaryKey: false, isNotNull: true, isUnique: false, defaultValue: '' },
      { name: 'created_at', type: 'DATE', isPrimaryKey: false, isNotNull: false, isUnique: false, defaultValue: '' }
    ];
    this.foreignKeys = [];
  }

  setDatabase(database) {
    this.database = database;
  }

  open(defaultName = '') {
    this.tableName = defaultName || 'table_' + Math.floor(100 + Math.random() * 900);
    this.columns = [
      { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true, isUnique: false, defaultValue: '' },
      { name: 'name', type: 'TEXT', isPrimaryKey: false, isNotNull: true, isUnique: false, defaultValue: '' },
      { name: 'created_at', type: 'DATE', isPrimaryKey: false, isNotNull: false, isUnique: false, defaultValue: '' }
    ];
    this.foreignKeys = [];
    this.render();
    this.container.classList.add('active');

    setTimeout(() => {
      const nameInp = this.container.querySelector('#designer-table-name');
      if (nameInp) nameInp.focus();
    }, 50);
  }

  close() {
    this.container.classList.remove('active');
  }

  generatePreviewSQL() {
    const name = (this.tableName || 'new_table').trim();
    const colDefs = this.columns.map(c => {
      let def = `  ${c.name || 'column_name'} ${c.type || 'TEXT'}`;
      if (c.isPrimaryKey) def += ' PRIMARY KEY';
      if (c.isNotNull) def += ' NOT NULL';
      if (c.isUnique && !c.isPrimaryKey) def += ' UNIQUE';
      if (c.defaultValue) {
        const isNum = !isNaN(Number(c.defaultValue)) && typeof c.defaultValue !== 'boolean';
        def += ` DEFAULT ${isNum ? c.defaultValue : `'${c.defaultValue}'`}`;
      }
      return def;
    });

    if (this.foreignKeys && this.foreignKeys.length > 0) {
      for (const fk of this.foreignKeys) {
        if (fk.column && fk.refTable && fk.refColumn) {
          colDefs.push(`  FOREIGN KEY (${fk.column}) REFERENCES ${fk.refTable}(${fk.refColumn})`);
        }
      }
    }

    return `CREATE TABLE ${name} (\n${colDefs.join(',\n')}\n);`;
  }

  render() {
    const existingTables = this.database ? Object.values(this.database.tables || {}) : [];

    this.container.innerHTML = `
      <div class="modal-backdrop" aria-hidden="true"></div>
      <div class="modal-dialog table-designer-dialog" role="dialog" aria-modal="true" aria-labelledby="designer-modal-title">
        <div class="modal-header flex items-center justify-between p-3 border-b">
          <div class="flex items-center gap-2">
            ${getIcon('table', 'icon-sm text-primary')}
            <span id="designer-modal-title" class="font-bold text-sm">Visual Table Designer</span>
          </div>
          <button class="btn-icon-xs btn-modal-close" aria-label="Close dialog">&times;</button>
        </div>

        <div class="modal-body p-4 flex flex-col gap-3 overflow-y-auto" style="max-height: 70vh;">
          <!-- Table Name Input -->
          <div class="form-group">
            <label for="designer-table-name" class="form-label text-xs font-semibold text-secondary">Table Name</label>
            <input 
              type="text" 
              id="designer-table-name" 
              class="form-control form-control-sm font-bold font-mono text-primary w-full" 
              value="${escapeHTML(this.tableName)}" 
              placeholder="e.g. products, customers"
            />
          </div>

          <!-- Columns Grid -->
          <div class="flex items-center justify-between mt-1">
            <span class="text-xs font-bold uppercase text-muted">Columns Specification</span>
            <button class="btn btn-xs btn-secondary" id="btn-designer-add-col">
              ${getIcon('plus', 'icon-xs')} Add Column
            </button>
          </div>

          <div class="designer-columns-table-wrap card overflow-hidden">
            <table class="data-grid-table font-mono text-xs w-full">
              <thead>
                <tr>
                  <th style="width: 28%;">Column Name</th>
                  <th style="width: 22%;">Data Type</th>
                  <th style="width: 8%; text-align: center;" title="Primary Key">PK</th>
                  <th style="width: 8%; text-align: center;" title="Not Null">Not Null</th>
                  <th style="width: 8%; text-align: center;" title="Unique">Unique</th>
                  <th style="width: 20%;">Default</th>
                  <th style="width: 6%;"></th>
                </tr>
              </thead>
              <tbody id="designer-columns-body">
                ${this.columns.map((col, idx) => `
                  <tr>
                    <td>
                      <input type="text" class="form-control form-control-sm font-mono col-prop-name w-full" data-idx="${idx}" value="${escapeHTML(col.name)}" placeholder="col_name" />
                    </td>
                    <td>
                      <select class="form-control form-control-sm font-mono col-prop-type w-full" data-idx="${idx}">
                        <option value="INTEGER" ${col.type === 'INTEGER' ? 'selected' : ''}>INTEGER</option>
                        <option value="TEXT" ${col.type === 'TEXT' ? 'selected' : ''}>TEXT</option>
                        <option value="REAL" ${col.type === 'REAL' ? 'selected' : ''}>REAL</option>
                        <option value="BOOLEAN" ${col.type === 'BOOLEAN' ? 'selected' : ''}>BOOLEAN</option>
                        <option value="DATE" ${col.type === 'DATE' ? 'selected' : ''}>DATE</option>
                      </select>
                    </td>
                    <td class="text-center">
                      <input type="checkbox" class="col-prop-pk" data-idx="${idx}" ${col.isPrimaryKey ? 'checked' : ''} />
                    </td>
                    <td class="text-center">
                      <input type="checkbox" class="col-prop-nn" data-idx="${idx}" ${col.isNotNull ? 'checked' : ''} />
                    </td>
                    <td class="text-center">
                      <input type="checkbox" class="col-prop-uq" data-idx="${idx}" ${col.isUnique ? 'checked' : ''} />
                    </td>
                    <td>
                      <input type="text" class="form-control form-control-sm font-mono col-prop-def w-full" data-idx="${idx}" value="${escapeHTML(col.defaultValue || '')}" placeholder="NULL" />
                    </td>
                    <td class="text-center">
                      ${this.columns.length > 1 ? `
                        <button class="btn-icon-xs text-rose btn-designer-del-col" data-idx="${idx}" title="Remove Column">&times;</button>
                      ` : ''}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Real-Time SQL DDL Preview -->
          <div class="flex flex-col gap-1 mt-1">
            <span class="text-xs font-bold uppercase text-muted">Generated SQL Statement</span>
            <pre class="font-mono text-xs text-primary p-2.5 rounded border" style="background-color: var(--bg-input); border-color: var(--border-subtle); margin: 0; line-height: 1.5; max-height: 120px; overflow-y: auto;" id="designer-sql-preview">${escapeHTML(this.generatePreviewSQL())}</pre>
          </div>
        </div>

        <div class="modal-footer p-3 border-t flex justify-end gap-2">
          <button class="btn btn-sm btn-secondary btn-modal-close">Cancel</button>
          <button class="btn btn-sm btn-primary" id="btn-save-designed-table">
            ${getIcon('check', 'icon-xs')} Create Table
          </button>
        </div>
      </div>
    `;

    this.initEvents();
  }

  initEvents() {
    this.container.querySelectorAll('.btn-modal-close, .modal-backdrop').forEach(b => {
      b.addEventListener('click', () => this.close());
    });

    const updatePreview = () => {
      const pre = this.container.querySelector('#designer-sql-preview');
      if (pre) pre.textContent = this.generatePreviewSQL();
    };

    this.container.querySelector('#designer-table-name')?.addEventListener('input', (e) => {
      this.tableName = e.target.value;
      updatePreview();
    });

    this.container.querySelector('#btn-designer-add-col')?.addEventListener('click', () => {
      this.columns.push({
        name: 'col_' + (this.columns.length + 1),
        type: 'TEXT',
        isPrimaryKey: false,
        isNotNull: false,
        isUnique: false,
        defaultValue: ''
      });
      this.render();
    });

    // Column property updates
    this.container.querySelectorAll('.col-prop-name').forEach(inp => {
      inp.addEventListener('input', (e) => {
        this.columns[parseInt(e.target.dataset.idx, 10)].name = e.target.value;
        updatePreview();
      });
    });
    this.container.querySelectorAll('.col-prop-type').forEach(sel => {
      sel.addEventListener('change', (e) => {
        this.columns[parseInt(e.target.dataset.idx, 10)].type = e.target.value;
        updatePreview();
      });
    });
    this.container.querySelectorAll('.col-prop-pk').forEach(chk => {
      chk.addEventListener('change', (e) => {
        this.columns[parseInt(e.target.dataset.idx, 10)].isPrimaryKey = e.target.checked;
        updatePreview();
      });
    });
    this.container.querySelectorAll('.col-prop-nn').forEach(chk => {
      chk.addEventListener('change', (e) => {
        this.columns[parseInt(e.target.dataset.idx, 10)].isNotNull = e.target.checked;
        updatePreview();
      });
    });
    this.container.querySelectorAll('.col-prop-uq').forEach(chk => {
      chk.addEventListener('change', (e) => {
        this.columns[parseInt(e.target.dataset.idx, 10)].isUnique = e.target.checked;
        updatePreview();
      });
    });
    this.container.querySelectorAll('.col-prop-def').forEach(inp => {
      inp.addEventListener('input', (e) => {
        this.columns[parseInt(e.target.dataset.idx, 10)].defaultValue = e.target.value;
        updatePreview();
      });
    });

    this.container.querySelectorAll('.btn-designer-del-col').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        this.columns.splice(idx, 1);
        this.render();
      });
    });

    // Create Table Commit
    this.container.querySelector('#btn-save-designed-table')?.addEventListener('click', () => {
      const name = (this.container.querySelector('#designer-table-name')?.value || '').trim();
      if (!name) return alert('Please enter a valid table name.');

      const invalidCol = this.columns.find(c => !c.name || !c.name.trim());
      if (invalidCol) return alert('All columns must have a valid column name.');

      if (this.onSaveTable) {
        this.onSaveTable({
          name,
          columns: this.columns.map(c => ({
            name: c.name.trim(),
            type: c.type,
            isPrimaryKey: !!c.isPrimaryKey,
            isNotNull: !!c.isNotNull,
            isUnique: !!c.isUnique,
            defaultValue: c.defaultValue ? c.defaultValue.trim() : null
          })),
          foreignKeys: this.foreignKeys
        });
      }
      this.close();
    });
  }
}
