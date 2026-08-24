/**
 * FlowPilot Simulated Database Tables Inspector Modal
 */

class DatabaseViewerModal {
  constructor(app) {
    this.app = app;
    this.modal = null;
    this.activeTable = 'orders';
    this.init();
  }

  init() {
    this.modal = document.createElement('div');
    this.modal.className = 'modal-overlay';
    this.modal.id = 'modal-db-viewer';

    this.modal.innerHTML = `
      <div class="modal-card" style="max-width:800px; max-height:85vh;">
        <div class="modal-header">
          <span class="modal-title">
            <span>💾</span> Simulated Database Inspector (IndexedDB)
          </span>
          <button class="btn btn-ghost btn-sm btn-icon" id="btn-close-db-modal">✕</button>
        </div>
        <div class="modal-body">
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <div class="db-tabs" id="db-tables-tab-list">
              <button class="btn btn-sm btn-primary" data-table="orders">orders</button>
              <button class="btn btn-sm btn-ghost" data-table="users">users</button>
              <button class="btn btn-sm btn-ghost" data-table="logs">logs</button>
            </div>
            <div style="display:flex; gap:6px;">
              <button class="btn btn-ghost btn-sm" id="btn-db-refresh">⟳ Refresh</button>
              <button class="btn btn-primary btn-sm" id="btn-db-add-row">+ Add Record</button>
            </div>
          </div>

          <div class="db-table-container" style="max-height:360px; overflow:auto;">
            <table class="db-table" id="db-rendered-table">
              <thead><tr><th>ID</th><th>Data</th><th>Actions</th></tr></thead>
              <tbody><tr><td colspan="3" style="text-align:center; padding:16px;">Loading table records...</td></tr></tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" id="btn-close-db-footer">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(this.modal);

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
    this.modal.querySelector('#btn-close-db-modal').addEventListener('click', () => this.close());
    this.modal.querySelector('#btn-close-db-footer').addEventListener('click', () => this.close());

    this.modal.querySelector('#btn-db-refresh').addEventListener('click', () => this.loadTable(this.activeTable));

    this.modal.querySelectorAll('#db-tables-tab-list button').forEach(btn => {
      btn.addEventListener('click', () => {
        this.modal.querySelectorAll('#db-tables-tab-list button').forEach(b => {
          b.className = 'btn btn-sm btn-ghost';
        });
        btn.className = 'btn btn-sm btn-primary';
        this.activeTable = btn.dataset.table;
        this.loadTable(this.activeTable);
      });
    });

    this.modal.querySelector('#btn-db-add-row').addEventListener('click', async () => {
      const sample = prompt('Enter Record JSON to insert:', JSON.stringify({ name: 'New Item', amount: 99.00 }, null, 2));
      if (sample) {
        try {
          const parsed = JSON.parse(sample);
          await window.flowDB.dbTableInsert(this.activeTable, parsed);
          this.loadTable(this.activeTable);
          this.app.toast(`Inserted record into table "${this.activeTable}"`, 'DB Insert', 'success');
        } catch (e) {
          alert('Invalid JSON: ' + e.message);
        }
      }
    });
  }

  async open() {
    this.modal.classList.add('active');
    await this.loadTable(this.activeTable);
  }

  close() {
    this.modal.classList.remove('active');
  }

  async loadTable(tableName) {
    const tableEl = this.modal.querySelector('#db-rendered-table');
    const records = await window.flowDB.dbTableFind(tableName, {});

    if (records.length === 0) {
      tableEl.innerHTML = `
        <thead><tr><th>Status</th></tr></thead>
        <tbody><tr><td style="color:var(--text-muted); text-align:center; padding:20px;">No records in table "${tableName}".</td></tr></tbody>
      `;
      return;
    }

    // Collect all columns
    const columns = new Set(['id']);
    records.forEach(r => {
      if (typeof r === 'object' && r !== null) {
        Object.keys(r).forEach(k => columns.add(k));
      }
    });

    const colArray = Array.from(columns);

    let headHtml = '<thead><tr>';
    colArray.forEach(col => {
      headHtml += `<th>${this.escape(col)}</th>`;
    });
    headHtml += '<th style="width:60px;">Action</th></tr></thead>';

    let bodyHtml = '<tbody>';
    records.forEach(row => {
      bodyHtml += '<tr>';
      colArray.forEach(col => {
        let val = row[col];
        if (typeof val === 'object') val = JSON.stringify(val);
        bodyHtml += `<td>${this.escape(val !== undefined ? String(val) : '-')}</td>`;
      });
      bodyHtml += `
        <td>
          <button class="btn btn-danger btn-sm btn-del-db-row" data-id="${row.id || ''}">Delete</button>
        </td>
      </tr>`;
    });
    bodyHtml += '</tbody>';

    tableEl.innerHTML = headHtml + bodyHtml;

    tableEl.querySelectorAll('.btn-del-db-row').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        if (id) {
          await window.flowDB.dbTableDelete(this.activeTable, { id });
          this.loadTable(this.activeTable);
          this.app.toast('Deleted row', 'DB Record Removed', 'info');
        }
      });
    });
  }

  escape(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}

window.DatabaseViewerModal = DatabaseViewerModal;
