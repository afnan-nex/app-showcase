/**
 * BudgetOS - Data Hub & CSV Import Wizard Controller
 * CSV transaction import with visual column mapping, full JSON database backup/restore,
 * demo dataset seeder, and regional currency settings.
 */

import state from '../state.js';
import { getIcon } from '../icons.js';
import { parseCSV, getSupportedCurrencies, getCurrencyConfig } from '../formatters.js';
import { exportAllData, importAllData, seedDemoData, resetAllData } from '../db.js';

let csvWizardState = {
  step: 1, // 1: upload, 2: map, 3: preview
  rawLines: [],
  headers: [],
  mappings: {
    date: 0,
    description: 1,
    amount: 2,
    category: -1,
    type: -1
  },
  targetAccountId: '',
  parsedRows: []
};

export function renderDataHubView(container) {
  const { accounts, categories, settings } = state;
  const currentCurrency = settings.currency || 'USD';
  const supportedCurrencies = getSupportedCurrencies();

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">Data Management & Import Wizard</h1>
        <p class="view-subtitle">CSV transaction ingestion, complete JSON backups, privacy controls, and sample profiles</p>
      </div>
    </div>

    <div class="data-hub-grid">
      
      <!-- Section 1: CSV Import Wizard Card -->
      <div class="card data-hub-card col-span-full">
        <div class="card-header">
          <div>
            <h2 class="card-title">${getIcon('upload', 'icon-sm')} CSV Transaction Import Wizard</h2>
            <p class="card-subtitle">Import bank or credit card exports with custom column mapping</p>
          </div>
          <span class="badge badge-primary">Step ${csvWizardState.step} of 3</span>
        </div>
        <div class="card-body">
          ${renderWizardStep(accounts, categories)}
        </div>
      </div>

      <!-- Section 2: Demo Data & Sample Profiles -->
      <div class="card data-hub-card">
        <div class="card-header">
          <h2 class="card-title">${getIcon('sparkles', 'icon-sm')} Demo Financial Profile</h2>
        </div>
        <div class="card-body">
          <p class="text-sm text-secondary mb-4">
            Populate BudgetOS with a realistic 90-day personal finance dataset including 4 accounts, 40+ transactions, active category budgets, savings goals, and recurring payroll/bills.
          </p>
          <button class="btn btn-secondary w-full" id="btn-seed-demo">
            ${getIcon('sparkles', 'icon-xs')} Load 90-Day Demo Profile
          </button>
        </div>
      </div>

      <!-- Section 3: Backup & Restore JSON -->
      <div class="card data-hub-card">
        <div class="card-header">
          <h2 class="card-title">${getIcon('dataHub', 'icon-sm')} Backup & Restore</h2>
        </div>
        <div class="card-body">
          <p class="text-sm text-secondary mb-4">
            BudgetOS stores all data locally in your browser's IndexedDB. Export a complete JSON snapshot for safe keeping or transfer to another device.
          </p>
          <div class="backup-actions-row">
            <button class="btn btn-secondary" id="btn-export-json">
              ${getIcon('download', 'icon-xs')} Export JSON Backup
            </button>
            <label class="btn btn-outline cursor-pointer mb-0">
              ${getIcon('upload', 'icon-xs')} Restore JSON
              <input type="file" id="input-restore-json" accept=".json" style="display: none;" />
            </label>
          </div>
        </div>
      </div>

      <!-- Section 4: Regional Currency Setting -->
      <div class="card data-hub-card">
        <div class="card-header">
          <h2 class="card-title">${getIcon('transactions', 'icon-sm')} Currency & Formatting</h2>
        </div>
        <div class="card-body">
          <div class="form-group mb-0">
            <label class="form-label text-xs">Active Display Currency</label>
            <select id="select-active-currency" class="form-control">
              ${supportedCurrencies.map(c => `
                <option value="${c.code}" ${c.code === currentCurrency ? 'selected' : ''}>
                  ${c.label}
                </option>
              `).join('')}
            </select>
          </div>
        </div>
      </div>

      <!-- Section 5: Reset Data -->
      <div class="card data-hub-card border-danger">
        <div class="card-header">
          <h2 class="card-title text-rose">${getIcon('trash', 'icon-sm')} Factory Reset</h2>
        </div>
        <div class="card-body">
          <p class="text-sm text-secondary mb-4">
            Erase all local accounts, transactions, budgets, and goals, restoring default empty state.
          </p>
          <button class="btn btn-danger w-full" id="btn-reset-db">
            Clear All Application Data
          </button>
        </div>
      </div>

    </div>
  `;

  // --- Wizard Step Renderer ---
  function renderWizardStep(accs, cats) {
    if (csvWizardState.step === 1) {
      return `
        <div class="wizard-step-1">
          <div class="dropzone-area" id="csv-dropzone">
            <div class="dropzone-icon">${getIcon('upload', 'icon-lg')}</div>
            <div class="dropzone-text font-medium">Drag & drop your bank CSV file here</div>
            <div class="dropzone-sub text-muted text-xs">or click to browse from computer</div>
            <input type="file" id="csv-file-input" accept=".csv,text/csv" style="display: none;" />
          </div>

          <div class="or-divider text-center my-4 text-xs text-muted">OR PASTE RAW CSV CONTENT</div>

          <div class="form-group">
            <textarea id="csv-paste-input" class="form-control font-mono text-xs" rows="4" placeholder="Date,Description,Amount&#10;2026-08-01,Groceries Supermarket,-45.50&#10;2026-08-03,Direct Deposit Payroll,2500.00"></textarea>
          </div>

          <div class="wizard-footer text-right">
            <button class="btn btn-primary" id="btn-wizard-step1-next">
              Next: Map Columns ${getIcon('arrowRight', 'icon-xs')}
            </button>
          </div>
        </div>
      `;
    }

    if (csvWizardState.step === 2) {
      const headers = csvWizardState.headers;
      return `
        <div class="wizard-step-2">
          <p class="text-sm text-secondary mb-4">
            Match the columns in your CSV file with the BudgetOS transaction fields:
          </p>

          <div class="form-group mb-4">
            <label class="form-label font-semibold text-xs">Assign Transactions to Account *</label>
            <select id="wizard-account-select" class="form-control">
              ${accs.map(a => `
                <option value="${a.id}" ${a.id === csvWizardState.targetAccountId ? 'selected' : ''}>
                  ${a.name} (${a.type})
                </option>
              `).join('')}
            </select>
          </div>

          <div class="mapping-grid">
            <div class="form-group">
              <label class="form-label text-xs font-semibold">Date Column *</label>
              <select class="form-control mapping-select" data-field="date">
                ${headers.map((h, i) => `
                  <option value="${i}" ${i === csvWizardState.mappings.date ? 'selected' : ''}>Column ${i + 1}: ${h}</option>
                `).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label text-xs font-semibold">Merchant / Description *</label>
              <select class="form-control mapping-select" data-field="description">
                ${headers.map((h, i) => `
                  <option value="${i}" ${i === csvWizardState.mappings.description ? 'selected' : ''}>Column ${i + 1}: ${h}</option>
                `).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label text-xs font-semibold">Amount Column *</label>
              <select class="form-control mapping-select" data-field="amount">
                ${headers.map((h, i) => `
                  <option value="${i}" ${i === csvWizardState.mappings.amount ? 'selected' : ''}>Column ${i + 1}: ${h}</option>
                `).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label text-xs font-semibold">Category Column (Optional)</label>
              <select class="form-control mapping-select" data-field="category">
                <option value="-1">-- Auto Assign / Default --</option>
                ${headers.map((h, i) => `
                  <option value="${i}" ${i === csvWizardState.mappings.category ? 'selected' : ''}>Column ${i + 1}: ${h}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <div class="wizard-footer flex justify-between mt-6">
            <button class="btn btn-secondary" id="btn-wizard-back-1">
              ${getIcon('arrowLeft', 'icon-xs')} Back
            </button>
            <button class="btn btn-primary" id="btn-wizard-step2-next">
              Preview Parsed Rows ${getIcon('arrowRight', 'icon-xs')}
            </button>
          </div>
        </div>
      `;
    }

    if (csvWizardState.step === 3) {
      const rows = csvWizardState.parsedRows;
      return `
        <div class="wizard-step-3">
          <p class="text-sm text-secondary mb-3">
            Review <strong>${rows.length}</strong> transactions ready for import:
          </p>

          <div class="table-responsive max-h-80 overflow-y-auto mb-4 border rounded">
            <table class="table finance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th class="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${rows.slice(0, 10).map(r => `
                  <tr>
                    <td class="font-mono text-xs">${r.date}</td>
                    <td class="font-medium">${r.description}</td>
                    <td><span class="badge ${r.type === 'income' ? 'badge-success' : 'badge-danger'}">${r.type}</span></td>
                    <td class="text-right font-mono font-semibold ${r.type === 'income' ? 'text-emerald' : 'text-rose'}">$${r.amount.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ${rows.length > 10 ? `<p class="text-xs text-muted text-center mb-4">...and ${rows.length - 10} more rows</p>` : ''}

          <div class="wizard-footer flex justify-between">
            <button class="btn btn-secondary" id="btn-wizard-back-2">
              ${getIcon('arrowLeft', 'icon-xs')} Back to Mapping
            </button>
            <button class="btn btn-primary" id="btn-wizard-execute-import">
              ${getIcon('check', 'icon-xs')} Confirm & Import ${rows.length} Transactions
            </button>
          </div>
        </div>
      `;
    }
  }

  // --- Attach Handlers ---

  // Dropzone click
  const dropzone = container.querySelector('#csv-dropzone');
  const fileInput = container.querySelector('#csv-file-input');
  dropzone?.addEventListener('click', () => fileInput?.click());

  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target.result;
        processCSVInput(text);
      };
      reader.readAsText(file);
    }
  });

  // Step 1 Next
  container.querySelector('#btn-wizard-step1-next')?.addEventListener('click', () => {
    const text = container.querySelector('#csv-paste-input')?.value;
    if (text && text.trim()) {
      processCSVInput(text);
    } else {
      alert('Please select a CSV file or paste CSV content first.');
    }
  });

  function processCSVInput(text) {
    const parsed = parseCSV(text);
    if (parsed.length < 2) {
      alert('CSV must contain a header row and at least 1 data row.');
      return;
    }
    csvWizardState.rawLines = parsed;
    csvWizardState.headers = parsed[0];
    csvWizardState.targetAccountId = accounts[0]?.id || '';

    // Auto guess column indices
    parsed[0].forEach((header, idx) => {
      const h = header.toLowerCase();
      if (h.includes('date')) csvWizardState.mappings.date = idx;
      if (h.includes('desc') || h.includes('merchant') || h.includes('name') || h.includes('payee')) csvWizardState.mappings.description = idx;
      if (h.includes('amount') || h.includes('total') || h.includes('price') || h.includes('sum')) csvWizardState.mappings.amount = idx;
      if (h.includes('cat')) csvWizardState.mappings.category = idx;
    });

    csvWizardState.step = 2;
    renderDataHubView(container);
  }

  // Step 2 Mapping selection
  container.querySelectorAll('.mapping-select').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const field = sel.dataset.field;
      csvWizardState.mappings[field] = parseInt(e.target.value, 10);
    });
  });

  container.querySelector('#wizard-account-select')?.addEventListener('change', (e) => {
    csvWizardState.targetAccountId = e.target.value;
  });

  container.querySelector('#btn-wizard-back-1')?.addEventListener('click', () => {
    csvWizardState.step = 1;
    renderDataHubView(container);
  });

  container.querySelector('#btn-wizard-step2-next')?.addEventListener('click', () => {
    // Parse rows based on mappings
    const rows = [];
    const { date: dIdx, description: descIdx, amount: amtIdx, category: catIdx } = csvWizardState.mappings;
    
    // Category lookup map
    const catLowerMap = {};
    categories.forEach(c => {
      catLowerMap[c.name.toLowerCase()] = c.id;
      catLowerMap[c.id.toLowerCase()] = c.id;
    });

    for (let i = 1; i < csvWizardState.rawLines.length; i++) {
      const line = csvWizardState.rawLines[i];
      if (!line || line.length <= 1) continue;

      let rawDate = (line[dIdx] || '').trim();
      let dateVal = new Date().toISOString().split('T')[0];

      if (rawDate) {
        if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(rawDate)) {
          const parts = rawDate.split(/[-/]/);
          dateVal = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
        } else if (/^\d{1,2}[-/]\d{1,2}[-/]\d{2,4}$/.test(rawDate)) {
          const parts = rawDate.split(/[-/]/);
          let y = parts[2];
          if (y.length === 2) y = '20' + y;
          // default assume MM/DD/YYYY unless month > 12
          let m = parseInt(parts[0], 10);
          let d = parseInt(parts[1], 10);
          if (m > 12 && d <= 12) {
            // Swap if DD/MM/YYYY
            const temp = m;
            m = d;
            d = temp;
          }
          dateVal = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        }
      }

      const descVal = (line[descIdx] || 'Imported Transaction').trim();
      let rawAmt = (line[amtIdx] || '0').trim();

      // Check accounting parentheses for negative e.g. (45.00)
      const isParenthesesNegative = rawAmt.startsWith('(') && rawAmt.endsWith(')');
      let cleanAmtStr = rawAmt.replace(/[^0-9.-]/g, '');
      let amtNum = parseFloat(cleanAmtStr) || 0;
      if (isParenthesesNegative) amtNum = -Math.abs(amtNum);

      const isNegative = amtNum < 0 || rawAmt.startsWith('-');
      const absAmount = Math.abs(amtNum);
      const type = isNegative ? 'expense' : 'income';

      // Auto assign category if column was mapped
      let resolvedCatId = type === 'income' ? 'cat_salary' : 'cat_misc';
      if (catIdx >= 0 && line[catIdx]) {
        const rawCat = line[catIdx].trim().toLowerCase();
        if (catLowerMap[rawCat]) {
          resolvedCatId = catLowerMap[rawCat];
        } else {
          // Fuzzy match against category names
          const found = categories.find(c => rawCat.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(rawCat));
          if (found) resolvedCatId = found.id;
        }
      }

      rows.push({
        id: 'tx_imp_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        date: dateVal,
        description: descVal,
        merchant: descVal,
        amount: absAmount,
        type,
        accountId: csvWizardState.targetAccountId || accounts[0]?.id || 'acc_checking',
        categoryId: resolvedCatId,
        isCleared: true,
        notes: 'Imported via CSV Wizard'
      });
    }

    csvWizardState.parsedRows = rows;
    csvWizardState.step = 3;
    renderDataHubView(container);
  });

  container.querySelector('#btn-wizard-back-2')?.addEventListener('click', () => {
    csvWizardState.step = 2;
    renderDataHubView(container);
  });

  container.querySelector('#btn-wizard-execute-import')?.addEventListener('click', async () => {
    for (const tx of csvWizardState.parsedRows) {
      await state.addTransaction(tx);
    }
    csvWizardState = {
      step: 1,
      rawLines: [],
      headers: [],
      mappings: { date: 0, description: 1, amount: 2, category: -1, type: -1 },
      targetAccountId: '',
      parsedRows: []
    };
    state.activeView = 'transactions';
    state.notify('VIEW_CHANGED');
  });

  // Seed demo data
  container.querySelector('#btn-seed-demo')?.addEventListener('click', async () => {
    if (confirm('Load demo 90-day financial profile? This will populate realistic sample accounts, budgets, and transactions.')) {
      await seedDemoData();
      await state.loadFromDB();
      state.activeView = 'dashboard';
      state.notify('VIEW_CHANGED');
    }
  });

  // JSON Export
  container.querySelector('#btn-export-json')?.addEventListener('click', async () => {
    const backup = await exportAllData();
    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BudgetOS_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // JSON Restore
  container.querySelector('#input-restore-json')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const payload = JSON.parse(evt.target.result);
          await importAllData(payload);
          await state.loadFromDB();
          alert('Backup restored successfully!');
          renderDataHubView(container);
        } catch (err) {
          alert('Failed to restore backup: Invalid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  });

  // Currency select
  container.querySelector('#select-active-currency')?.addEventListener('change', async (e) => {
    const newCurr = e.target.value;
    await state.saveSetting('currency', newCurr);
    renderDataHubView(container);
  });

  // Reset database
  container.querySelector('#btn-reset-db')?.addEventListener('click', async () => {
    if (confirm('WARNING: Are you sure you want to permanently clear all data and start completely fresh?')) {
      await resetAllData();
      await state.loadFromDB();
      state.activeView = 'dashboard';
      state.notify('VIEW_CHANGED');
    }
  });
}
