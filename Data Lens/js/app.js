/**
 * DataLens - Main Application Controller
 * Coordinates IndexedDB, state management, view routing, import/export, and components.
 */

class DataLensApp {
  constructor() {
    this.datasets = [];
    this.activeDataset = null;
    this.activeDatasetId = null;

    this.currentData = [];
    this.currentColumns = [];
    this.pipelineSteps = [];

    this.activeTab = 'table'; // 'table', 'charts', 'dashboard', 'pipeline', 'stats'

    // View Components
    this.tableComponent = null;
    this.chartBuilder = null;
    this.dashboardView = null;
    this.cleaningView = null;
    this.statsView = null;

    this.resizeDebounceTimer = null;
  }

  async init() {
    try {
      // 1. Initialize Theme
      await window.ThemeManager.init();

      // 2. Initialize Database & Datasets
      await window.dataLensStorage.init();
      this.datasets = await window.dataLensStorage.getDatasets();

      // If database is empty, seed sample datasets
      if (this.datasets.length === 0) {
        await this.seedSampleDatasets();
        this.datasets = await window.dataLensStorage.getDatasets();
      }

      // 3. Load active dataset
      const savedActiveId = await window.dataLensStorage.getSetting('active_dataset_id');
      const found = this.datasets.find(d => d.id === savedActiveId);
      this.activeDataset = found || this.datasets[0];
      this.activeDatasetId = this.activeDataset.id;

      // 4. Initialize Views
      this.initViews();

      // 5. Load Active Dataset State
      await this.loadActiveDataset();

      // 6. Bind Global Header & Sidebar Events
      this.bindGlobalEvents();
      this.renderSidebar();
      this.updateStatusBar();
    } catch (err) {
      console.error('DataLens initialization error:', err);
      window.Toast.danger('App initialization failed: ' + err.message);
    }
  }

  async seedSampleDatasets() {
    for (const sample of window.SAMPLE_DATASETS) {
      const parsed = await DataParser.parseCSV(sample.csv);
      const dataset = {
        id: sample.id,
        name: sample.name,
        rawData: parsed.data,
        columns: parsed.columns,
        rowCount: parsed.data.length,
        createdAt: new Date().toISOString()
      };
      await window.dataLensStorage.saveDataset(dataset);
    }
  }

  initViews() {
    // 1. Table View
    this.tableComponent = new TableComponent('view-table-container');

    // 2. Chart Builder
    this.chartBuilder = new ChartBuilder('view-chart-container', (widgetConfig) => {
      this.dashboardView.addWidget(widgetConfig);
      this.switchTab('dashboard');
    });

    // 3. Dashboard View
    this.dashboardView = new DashboardView('view-dashboard-container');

    // 4. Data Cleaning View
    this.cleaningView = new CleaningView('view-pipeline-container', (transformedData, transformedColumns, steps) => {
      this.currentData = transformedData;
      this.currentColumns = transformedColumns;
      this.pipelineSteps = steps;

      // Save pipeline recipe
      window.dataLensStorage.saveRecipe(this.activeDatasetId, steps);

      // Update downstream views
      this.tableComponent.setDataset(this.currentData, this.currentColumns);
      this.chartBuilder.setDataset(this.currentData, this.currentColumns);
      this.dashboardView.setDataset(this.currentData, this.currentColumns);
      this.statsView.setDataset(this.currentData, this.currentColumns);

      this.renderSidebarSchema();
      this.updateStatusBar();
    });

    // 5. Statistics View
    this.statsView = new StatsView('view-stats-container');
  }

  async loadActiveDataset() {
    if (!this.activeDataset) return;

    // Load saved pipeline steps for this dataset
    this.pipelineSteps = await window.dataLensStorage.getRecipe(this.activeDataset.id) || [];

    // Run pipeline
    const result = PipelineEngine.executePipeline(this.activeDataset.rawData, this.activeDataset.columns, this.pipelineSteps);
    this.currentData = result.data;
    this.currentColumns = result.columns;

    // Pass data into all view components
    this.tableComponent.setDataset(this.currentData, this.currentColumns);
    this.chartBuilder.setDataset(this.currentData, this.currentColumns);
    await this.dashboardView.init(this.currentData, this.currentColumns);
    this.cleaningView.setDataset(this.activeDataset.rawData, this.activeDataset.columns, this.pipelineSteps);
    this.statsView.setDataset(this.currentData, this.currentColumns);

    this.renderSidebar();
    this.updateStatusBar();
    await window.dataLensStorage.saveSetting('active_dataset_id', this.activeDataset.id);
  }

  async switchDataset(datasetId) {
    const ds = this.datasets.find(d => d.id === datasetId);
    if (!ds) return;

    this.activeDataset = ds;
    this.activeDatasetId = ds.id;
    await this.loadActiveDataset();
    window.Toast.info(`Switched to dataset "${ds.name}"`);
  }

  switchTab(tabName) {
    this.activeTab = tabName;

    // Update Header Tab Buttons
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      const isActive = btn.dataset.tab === tabName;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Update Workspace Views
    document.querySelectorAll('.workspace-view').forEach(view => {
      view.classList.toggle('active', view.id === `view-${tabName}`);
    });

    // Trigger redraw for chart/dashboard views if opened
    if (tabName === 'charts') {
      this.chartBuilder.updatePreview();
    } else if (tabName === 'dashboard') {
      this.dashboardView.render();
    } else if (tabName === 'stats') {
      this.statsView.render();
    }
  }

  renderSidebar() {
    this.renderSidebarDatasets();
    this.renderSidebarSchema();
  }

  renderSidebarDatasets() {
    const listContainer = document.getElementById('sidebar-dataset-list');
    if (!listContainer) return;

    listContainer.innerHTML = this.datasets.map(ds => `
      <div class="dataset-item ${ds.id === this.activeDatasetId ? 'active' : ''}" data-dataset-id="${ds.id}" role="button" tabindex="0" aria-label="Select dataset ${this.escapeHtml(ds.name)}">
        <div class="dataset-meta">
          <div class="dataset-name" title="${this.escapeHtml(ds.name)}">${this.escapeHtml(ds.name)}</div>
          <div class="dataset-stats">${ds.rawData ? ds.rawData.length.toLocaleString() : 0} rows · ${(ds.columns || []).length} cols</div>
        </div>

        <button class="btn btn-ghost btn-sm btn-icon btn-delete-ds" data-delete-id="${ds.id}" title="Delete dataset" aria-label="Delete dataset" style="opacity: 0.6;" ${this.datasets.length <= 1 ? 'disabled' : ''}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    `).join('');

    // Bind dataset item clicks & keyboard Enter
    listContainer.querySelectorAll('.dataset-item').forEach(item => {
      const handleSelect = () => {
        const dsId = item.dataset.datasetId;
        if (dsId !== this.activeDatasetId) {
          this.switchDataset(dsId);
        }
      };

      item.addEventListener('click', (e) => {
        if (e.target.closest('.btn-delete-ds')) return;
        handleSelect();
      });

      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.target.closest('.btn-delete-ds')) {
          handleSelect();
        }
      });
    });

    // Bind delete buttons
    listContainer.querySelectorAll('.btn-delete-ds').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const dsId = btn.dataset.deleteId;
        const ds = this.datasets.find(d => d.id === dsId);
        if (confirm(`Delete dataset "${ds ? ds.name : 'this'}"?`)) {
          await window.dataLensStorage.deleteDataset(dsId);
          this.datasets = this.datasets.filter(d => d.id !== dsId);
          if (this.activeDatasetId === dsId) {
            this.activeDataset = this.datasets[0];
            this.activeDatasetId = this.activeDataset.id;
            await this.loadActiveDataset();
          } else {
            this.renderSidebar();
          }
          window.Toast.info('Dataset deleted');
        }
      });
    });
  }

  renderSidebarSchema() {
    const schemaContainer = document.getElementById('sidebar-schema-list');
    if (!schemaContainer) return;

    if (!this.currentColumns || this.currentColumns.length === 0) {
      schemaContainer.innerHTML = `<div style="padding: 10px; color: var(--text-muted); font-size: 11px;">No schema detected.</div>`;
      return;
    }

    schemaContainer.innerHTML = this.currentColumns.map(col => `
      <div class="column-tree-item" title="${this.escapeHtml(col.name)} (${col.type})">
        <div class="column-name-box">
          <span class="type-badge type-${col.type}">${col.type.slice(0, 3)}</span>
          <span class="column-name">${this.escapeHtml(col.name)}</span>
        </div>
      </div>
    `).join('');
  }

  updateStatusBar() {
    const dsNameEl = document.getElementById('status-dataset-name');
    const rowCountEl = document.getElementById('status-row-count');
    const colCountEl = document.getElementById('status-col-count');
    const memoryEl = document.getElementById('status-memory-size');

    if (dsNameEl && this.activeDataset) dsNameEl.textContent = this.activeDataset.name;
    if (rowCountEl) rowCountEl.textContent = `${this.currentData.length.toLocaleString()} rows`;
    if (colCountEl) colCountEl.textContent = `${this.currentColumns.length} columns`;

    if (memoryEl) {
      const approxBytes = JSON.stringify(this.currentData).length * 2;
      memoryEl.textContent = `${(approxBytes / 1024).toFixed(1)} KB`;
    }
  }

  bindGlobalEvents() {
    // Navigation Tabs
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchTab(btn.dataset.tab);
      });
    });

    // Import Dataset Button
    const importBtn = document.getElementById('btn-import-data');
    if (importBtn) {
      importBtn.addEventListener('click', () => {
        this.showImportModal();
      });
    }

    // Export Master Button
    const exportBtn = document.getElementById('btn-export-master');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        ExportModal.show(this.currentData, this.currentColumns, this.activeDataset ? this.activeDataset.name : 'dataset');
      });
    }

    // Sidebar Toggle
    const toggleSidebarBtn = document.getElementById('btn-toggle-sidebar');
    const sidebar = document.querySelector('.app-sidebar');
    if (toggleSidebarBtn && sidebar) {
      toggleSidebarBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
      });
    }

    // Global Esc key to close open modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modalBackdrop = document.getElementById('app-modal-backdrop');
        if (modalBackdrop && modalBackdrop.classList.contains('open')) {
          modalBackdrop.classList.remove('open');
        }
      }
    });

    // Debounced window resize handler
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeDebounceTimer);
      this.resizeDebounceTimer = setTimeout(() => {
        if (this.activeTab === 'charts') {
          this.chartBuilder.updatePreview();
        } else if (this.activeTab === 'dashboard') {
          this.dashboardView.render();
        }
      }, 150);
    });
  }

  showImportModal() {
    const modalBackdrop = document.getElementById('app-modal-backdrop');
    const modalDialog = document.getElementById('app-modal-dialog');
    if (!modalBackdrop || !modalDialog) return;

    modalDialog.innerHTML = `
      <div class="modal-header">
        <div class="modal-title">Import Dataset</div>
        <button class="btn btn-ghost btn-sm btn-icon" id="btn-close-modal" aria-label="Close dialog">✕</button>
      </div>
      <div class="modal-body">
        <!-- Sample Datasets Quick Selector -->
        <div class="form-group" style="margin-bottom: 12px;">
          <label class="form-label" for="modal-quick-sample">Load Pre-Configured Sample Dataset</label>
          <div style="display: flex; gap: 6px;">
            <select class="form-control" id="modal-quick-sample">
              ${window.SAMPLE_DATASETS.map(s => `<option value="${s.id}">${this.escapeHtml(s.name)}</option>`).join('')}
            </select>
            <button class="btn btn-secondary btn-sm" id="btn-load-sample-direct">Load Sample</button>
          </div>
        </div>

        <div style="text-align: center; margin: 10px 0; font-size: 11px; color: var(--text-muted); font-weight: 600;">— OR UPLOAD LOCAL FILE —</div>

        <!-- File Dropzone -->
        <div class="dropzone" id="modal-import-dropzone">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--primary-500); margin-bottom: 8px;">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <div style="font-size: 13px; font-weight: 600; margin-bottom: 4px;">Drag & Drop CSV / JSON file here</div>
          <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 12px;">or click to browse from your computer</div>
          <button class="btn btn-secondary btn-sm" id="btn-browse-file">Browse File</button>
          <input type="file" id="modal-file-picker" accept=".csv,.tsv,.json,.txt" style="display: none;">
        </div>

        <div style="text-align: center; margin: 12px 0; font-size: 11px; color: var(--text-muted); font-weight: 600;">— OR PASTE RAW DATA —</div>

        <div class="form-group">
          <label class="form-label" for="modal-paste-name">Dataset Name</label>
          <input type="text" class="form-control" id="modal-paste-name" placeholder="e.g. Q3 Regional Sales" value="Imported Dataset">
        </div>

        <div class="form-group">
          <label class="form-label" for="modal-paste-text">Paste CSV or JSON Content</label>
          <textarea class="form-control" id="modal-paste-text" placeholder="Paste comma/tab separated values or JSON array..." style="min-height: 90px; font-family: var(--font-mono); font-size: 11px;"></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="btn-cancel-modal">Cancel</button>
        <button class="btn btn-primary" id="btn-submit-import">Import Dataset</button>
      </div>
    `;

    modalBackdrop.classList.add('open');

    const closeModal = () => modalBackdrop.classList.remove('open');
    document.getElementById('btn-close-modal').onclick = closeModal;
    document.getElementById('btn-cancel-modal').onclick = closeModal;
    modalBackdrop.onclick = (e) => { if (e.target === modalBackdrop) closeModal(); };

    // Load sample direct
    document.getElementById('btn-load-sample-direct').onclick = async () => {
      const sampleId = document.getElementById('modal-quick-sample').value;
      const sample = window.SAMPLE_DATASETS.find(s => s.id === sampleId);
      if (sample) {
        const parsed = await DataParser.parseCSV(sample.csv);
        await this.createNewDatasetRecord(sample.name, parsed);
        closeModal();
      }
    };

    const filePicker = document.getElementById('modal-file-picker');
    const dropzone = document.getElementById('modal-import-dropzone');
    document.getElementById('btn-browse-file').onclick = () => filePicker.click();
    dropzone.onclick = (e) => {
      if (e.target !== document.getElementById('btn-browse-file')) filePicker.click();
    };

    dropzone.ondragover = (e) => { e.preventDefault(); dropzone.classList.add('dragover'); };
    dropzone.ondragleave = () => dropzone.classList.remove('dragover');
    dropzone.ondrop = async (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file) await this.processFileImport(file, closeModal);
    };

    filePicker.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) await this.processFileImport(file, closeModal);
    };

    document.getElementById('btn-submit-import').onclick = async () => {
      const name = document.getElementById('modal-paste-name').value.trim() || 'Imported Dataset';
      const text = document.getElementById('modal-paste-text').value.trim();

      if (!text) {
        window.Toast.warning('Please paste CSV/JSON content or select a file to import');
        return;
      }

      try {
        const parsed = await DataParser.parseFileContent(text, name);
        await this.createNewDatasetRecord(name, parsed);
        closeModal();
      } catch (err) {
        window.Toast.danger('Failed to parse pasted data: ' + err.message);
      }
    };
  }

  async processFileImport(file, closeModal) {
    try {
      window.Toast.info(`Parsing ${file.name}...`);
      const text = await file.text();
      const name = file.name.replace(/\.[^/.]+$/, "");
      const parsed = await DataParser.parseFileContent(text, file.name);

      await this.createNewDatasetRecord(name, parsed);
      closeModal();
    } catch (err) {
      window.Toast.danger('Failed to import file: ' + err.message);
    }
  }

  async createNewDatasetRecord(name, parsed) {
    const newDs = {
      id: 'ds-' + Date.now(),
      name,
      rawData: parsed.data,
      columns: parsed.columns,
      rowCount: parsed.data.length,
      createdAt: new Date().toISOString()
    };

    await window.dataLensStorage.saveDataset(newDs);
    this.datasets.push(newDs);
    this.activeDataset = newDs;
    this.activeDatasetId = newDs.id;

    await this.loadActiveDataset();
    window.Toast.success(`Successfully imported "${name}" (${parsed.data.length.toLocaleString()} rows)`);
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

// Instantiate app on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.dataLensApp = new DataLensApp();
  window.dataLensApp.init();
});
