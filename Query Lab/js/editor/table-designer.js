/**
 * QueryLab - Visual Table Designer Modal
 * Visual UI to design database tables, columns, data types, and primary key constraints.
 */

import { getIcon, escapeHTML } from '../core/icons.js';

export class TableDesignerModal {
  constructor(modalContainer, onSaveTable) {
    this.container = modalContainer;
    this.onSaveTable = onSaveTable;
    this.tableName = 'new_table';
    this.columns = [
      { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true, isUnique: false, defaultValue: '' },
      { name: 'name', type: 'TEXT', isPrimaryKey: false, isNotNull: true, isUnique: false, defaultValue: '' }
    ];
  }

  open() {
    this.tableName = 'table_' + Math.floor(Math.random() * 1000);
    this.columns = [
      { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true, isUnique: false, defaultValue: '' },
      { name: 'name', type: 'TEXT', isPrimaryKey: false, isNotNull: true, isUnique: false, defaultValue: '' }
    ];
    this.render();
    this.container.classList.add('active');
  }

  close() {
    this.container.classList.remove('active');
  }

  render() {
    this.container.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-dialog table-designer-dialog">
        <div class="modal-header flex items-center justify-between p-3 border-b">
          <div class="flex items-center gap-2">
            ${getIcon('table', 'icon-sm text-primary')}
            <span class="font-bold text-sm">Visual Table Designer</span>
          </div>
          <button class="btn-icon-xs btn-modal-close">&times;</button>
        </div>

        <div class="modal-body p-4 flex flex-col gap-3">
          <!-- Table Name -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold">Table Name</label>
            <input type="text" id="designer-table-name" class="form-control form-control-sm font-bold font-mono" value="${escapeHTML(this.tableName)}" />
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
                  <th>Column Name</th>
                  <th>Type</th>
                  <th>PK</th>
                  <th>Not Null</th>
                  <th>Unique</th>
                  <th>Default</th>
                  <th></th>
                </tr>
              </thead>
              <tbody id="designer-columns-body">
                ${this.columns.map((col, idx) => `
                  <tr>
                    <td>
                      <input type="text" class="form-control form-control-sm font-mono col-prop-name" data-idx="${idx}" value="${escapeHTML(col.name)}" />
                    </td>
                    <td>
                      <select class="form-control form-control-sm font-mono col-prop-type" data-idx="${idx}">
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
                      <input type="text" class="form-control form-control-sm font-mono col-prop-def" data-idx="${idx}" value="${escapeHTML(col.defaultValue || '')}" placeholder="NULL" />
                    </td>
                    <td class="text-center">
                      ${this.columns.length > 1 ? `
                        <button class="btn-icon-xs text-rose btn-designer-del-col" data-idx="${idx}">&times;</button>
                      ` : ''}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="modal-footer p-3 border-t flex justify-end gap-2">
          <button class="btn btn-sm btn-secondary btn-modal-close">Cancel</button>
          <button class="btn btn-sm btn-primary" id="btn-save-designed-table">Create Table</button>
        </div>
      </div>
    `;

    this.initEvents();
  }

  initEvents() {
    this.container.querySelectorAll('.btn-modal-close, .modal-backdrop').forEach(b => {
      b.addEventListener('click', () => this.close());
    });

    this.container.querySelector('#designer-table-name')?.addEventListener('input', (e) => {
      this.tableName = e.target.value;
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
      });
    });
    this.container.querySelectorAll('.col-prop-type').forEach(sel => {
      sel.addEventListener('change', (e) => {
        this.columns[parseInt(e.target.dataset.idx, 10)].type = e.target.value;
      });
    });
    this.container.querySelectorAll('.col-prop-pk').forEach(chk => {
      chk.addEventListener('change', (e) => {
        this.columns[parseInt(e.target.dataset.idx, 10)].isPrimaryKey = e.target.checked;
      });
    });
    this.container.querySelectorAll('.col-prop-nn').forEach(chk => {
      chk.addEventListener('change', (e) => {
        this.columns[parseInt(e.target.dataset.idx, 10)].isNotNull = e.target.checked;
      });
    });
    this.container.querySelectorAll('.col-prop-uq').forEach(chk => {
      chk.addEventListener('change', (e) => {
        this.columns[parseInt(e.target.dataset.idx, 10)].isUnique = e.target.checked;
      });
    });
    this.container.querySelectorAll('.col-prop-def').forEach(inp => {
      inp.addEventListener('input', (e) => {
        this.columns[parseInt(e.target.dataset.idx, 10)].defaultValue = e.target.value;
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
      const name = this.container.querySelector('#designer-table-name').value.trim();
      if (!name) return alert('Please enter a table name.');

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
          }))
        });
      }
      this.close();
    });
  }
}
