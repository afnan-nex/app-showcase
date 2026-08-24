/**
 * DataLens - Multi-Widget Interactive Dashboard Grid
 * Supports KPI cards, dynamic charts, table snippets, markdown notes,
 * drag reordering, resizing, cross-filtering, fullscreen, and executive report printing.
 */

class DashboardView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.dashboards = [];
    this.activeDashboard = null;
    this.dataset = [];
    this.columns = [];
    this.globalFilter = null; // { column, value }
  }

  async init(dataset, columns) {
    this.dataset = dataset || [];
    this.columns = columns || [];

    // Load dashboards from IndexedDB
    this.dashboards = await window.dataLensStorage.getDashboards();

    if (this.dashboards.length === 0) {
      const defaultDash = this.createDefaultDashboard();
      this.dashboards.push(defaultDash);
      await window.dataLensStorage.saveDashboard(defaultDash);
    }

    const savedActiveId = await window.dataLensStorage.getSetting('active_dashboard_id');
    this.activeDashboard = this.dashboards.find(d => d.id === savedActiveId) || this.dashboards[0];

    this.render();
  }

  setDataset(dataset, columns) {
    this.dataset = dataset || [];
    this.columns = columns || [];
    this.render();
  }

  createDefaultDashboard() {
    const numCols = this.columns.filter(c => c.isNumeric);
    const textCols = this.columns.filter(c => !c.isNumeric);

    const primaryMetric = numCols.length > 0 ? numCols[0].name : (this.columns[0] ? this.columns[0].name : 'Value');
    const secondaryMetric = numCols.length > 1 ? numCols[1].name : primaryMetric;
    const categoryDim = textCols.length > 0 ? textCols[0].name : (this.columns[0] ? this.columns[0].name : 'Category');
    const regionDim = textCols.length > 1 ? textCols[1].name : categoryDim;

    return {
      id: 'dash-' + Date.now(),
      name: 'Executive BI Overview',
      widgets: [
        {
          id: 'w-kpi-1',
          type: 'kpi',
          title: `Total ${primaryMetric}`,
          yCol: primaryMetric,
          aggType: 'sum',
          colSpan: 3
        },
        {
          id: 'w-kpi-2',
          type: 'kpi',
          title: `Average ${secondaryMetric}`,
          yCol: secondaryMetric,
          aggType: 'avg',
          colSpan: 3
        },
        {
          id: 'w-kpi-3',
          type: 'kpi',
          title: 'Total Records Count',
          yCol: primaryMetric,
          aggType: 'count',
          colSpan: 3
        },
        {
          id: 'w-kpi-4',
          type: 'kpi',
          title: `Peak ${primaryMetric}`,
          yCol: primaryMetric,
          aggType: 'max',
          colSpan: 3
        },
        {
          id: 'w-chart-1',
          type: 'bar',
          title: `${primaryMetric} Breakdown by ${categoryDim}`,
          xCol: categoryDim,
          yCol: primaryMetric,
          aggType: 'sum',
          colSpan: 6
        },
        {
          id: 'w-chart-2',
          type: 'donut',
          title: `${secondaryMetric} Distribution by ${regionDim}`,
          xCol: regionDim,
          yCol: secondaryMetric,
          aggType: 'sum',
          colSpan: 6
        }
      ]
    };
  }

  addWidget(widgetConfig) {
    if (!this.activeDashboard) return;
    this.activeDashboard.widgets.push(widgetConfig);
    this.saveCurrentDashboard();
    this.render();
    window.Toast.success(`Widget "${widgetConfig.title}" added to dashboard`);
  }

  async saveCurrentDashboard() {
    if (!this.activeDashboard) return;
    await window.dataLensStorage.saveDashboard(this.activeDashboard);
    await window.dataLensStorage.saveSetting('active_dashboard_id', this.activeDashboard.id);
  }

  render() {
    if (!this.container) return;

    if (!this.activeDashboard) {
      this.container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-title">No Active Dashboard</div>
          <button class="btn btn-primary" id="btn-create-dash-empty">Create New Dashboard</button>
        </div>
      `;
      const btn = document.getElementById('btn-create-dash-empty');
      if (btn) {
        btn.onclick = () => this.createNewDashboard();
      }
      return;
    }

    const filteredData = this.globalFilter
      ? this.dataset.filter(r => String(r[this.globalFilter.column]) === String(this.globalFilter.value))
      : this.dataset;

    let html = `
      <div class="dashboard-view-container" id="dashboard-view-wrapper">
        <!-- Top Dashboard Control Toolbar -->
        <div class="dashboard-toolbar">
          <div class="toolbar-group">
            <select class="form-control form-control-sm" id="select-active-dashboard" style="width: 180px; font-weight: 600;" aria-label="Switch Dashboard">
              ${this.dashboards.map(d => `<option value="${d.id}" ${d.id === this.activeDashboard.id ? 'selected' : ''}>${this.escapeHtml(d.name)}</option>`).join('')}
            </select>

            <input type="text" class="dashboard-title-input" id="input-dash-name" value="${this.escapeHtml(this.activeDashboard.name)}" title="Click to rename dashboard" aria-label="Dashboard title">

            <button class="btn btn-ghost btn-sm" id="btn-new-dashboard" title="Create New Dashboard">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
              <span>New</span>
            </button>

            <button class="btn btn-ghost btn-sm" id="btn-duplicate-dashboard" title="Duplicate Dashboard">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <span>Duplicate</span>
            </button>
          </div>

          <div class="toolbar-group">
            ${this.renderGlobalFilterDropdown()}

            <button class="btn btn-secondary btn-sm" id="btn-add-quick-widget">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span>Add Widget</span>
            </button>

            <button class="btn btn-secondary btn-sm btn-icon" id="btn-fullscreen-dashboard" title="Toggle Fullscreen" aria-label="Toggle fullscreen mode">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
            </button>

            <button class="btn btn-secondary btn-sm btn-icon" id="btn-print-dashboard" title="Print Executive BI Report" aria-label="Print executive report">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            </button>

            <button class="btn btn-danger btn-sm btn-icon" id="btn-delete-dashboard" title="Delete Dashboard" aria-label="Delete dashboard" ${this.dashboards.length <= 1 ? 'disabled' : ''}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>

        <!-- Scrollable Dashboard Grid Canvas -->
        <div class="dashboard-canvas">
          <div class="dashboard-grid" id="main-dashboard-grid">
            ${this.activeDashboard.widgets.length === 0 ? `
              <div style="grid-column: span 12; padding: 40px; text-align: center;">
                <div class="empty-state-title">No widgets on this dashboard</div>
                <div class="empty-state-desc">Click "Add Widget" or use the Chart Builder to add visualizations here.</div>
              </div>
            ` : this.activeDashboard.widgets.map((widget, idx) => this.renderWidgetShell(widget, idx)).join('')}
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
    this.bindEvents();

    // Render individual charts/KPIs into their widget bodies
    this.activeDashboard.widgets.forEach(widget => {
      const widgetBody = document.getElementById(`widget-body-${widget.id}`);
      if (widgetBody) {
        ChartRenderer.render(widgetBody, { ...widget, data: filteredData }, this.columns);
      }
    });
  }

  renderGlobalFilterDropdown() {
    const textCols = this.columns.filter(c => !c.isNumeric);
    if (textCols.length === 0) return '';

    const firstCol = textCols[0].name;
    const distinctVals = Array.from(new Set(this.dataset.map(r => String(r[firstCol] || '')))).slice(0, 10);

    return `
      <div style="display: flex; align-items: center; gap: 4px;">
        <span style="font-size: 11px; color: var(--text-muted);">Cross-Filter:</span>
        <select class="form-control form-control-sm" id="select-global-dash-filter" style="width: 140px;" aria-label="Global cross filter">
          <option value="">All (${firstCol})</option>
          ${distinctVals.map(v => `<option value="${this.escapeHtml(v)}" ${this.globalFilter && this.globalFilter.value === v ? 'selected' : ''}>${this.escapeHtml(v)}</option>`).join('')}
        </select>
      </div>
    `;
  }

  renderWidgetShell(widget, idx) {
    const span = widget.colSpan || 6;
    const isKPI = widget.type === 'kpi';

    return `
      <div class="dashboard-widget col-span-${span} ${isKPI ? 'widget-kpi' : ''}" id="widget-card-${widget.id}">
        <div class="widget-header">
          <div class="widget-title-area">
            <span class="widget-title">${this.escapeHtml(widget.title || 'Widget')}</span>
            <span class="widget-badge">${widget.type.toUpperCase()}</span>
          </div>

          <div class="widget-actions">
            <!-- Colspan Resize Selector -->
            <select class="form-control form-control-sm widget-span-select" data-widget-id="${widget.id}" style="width: 54px; height: 22px; padding: 1px 4px; font-size: 10px;" aria-label="Widget column span">
              <option value="3" ${span === 3 ? 'selected' : ''}>1/4</option>
              <option value="4" ${span === 4 ? 'selected' : ''}>1/3</option>
              <option value="6" ${span === 6 ? 'selected' : ''}>1/2</option>
              <option value="8" ${span === 8 ? 'selected' : ''}>2/3</option>
              <option value="12" ${span === 12 ? 'selected' : ''}>Full</option>
            </select>

            <!-- Move Left/Up -->
            <button class="btn btn-ghost btn-sm btn-icon" data-action="move-widget-left" data-index="${idx}" title="Move left / up" aria-label="Move widget left" ${idx === 0 ? 'disabled' : ''}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>

            <!-- Move Right/Down -->
            <button class="btn btn-ghost btn-sm btn-icon" data-action="move-widget-right" data-index="${idx}" title="Move right / down" aria-label="Move widget right" ${idx === this.activeDashboard.widgets.length - 1 ? 'disabled' : ''}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>

            <!-- Export Image -->
            <button class="btn btn-ghost btn-sm btn-icon" data-action="export-widget-img" data-widget-id="${widget.id}" title="Export Image" aria-label="Export widget image">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </button>

            <!-- Remove Widget -->
            <button class="btn btn-ghost btn-sm btn-icon" data-action="delete-widget" data-index="${idx}" title="Remove Widget" aria-label="Remove widget">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <div class="widget-body" id="widget-body-${widget.id}"></div>
      </div>
    `;
  }

  bindEvents() {
    // Switch Dashboard Selector
    const dashSelect = document.getElementById('select-active-dashboard');
    if (dashSelect) {
      dashSelect.addEventListener('change', (e) => {
        const found = this.dashboards.find(d => d.id === e.target.value);
        if (found) {
          this.activeDashboard = found;
          this.saveCurrentDashboard();
          this.render();
        }
      });
    }

    // Rename Dashboard
    const nameInput = document.getElementById('input-dash-name');
    if (nameInput) {
      nameInput.addEventListener('change', (e) => {
        if (e.target.value.trim()) {
          this.activeDashboard.name = e.target.value.trim();
          this.saveCurrentDashboard();
          this.render();
          window.Toast.info(`Dashboard renamed to "${this.activeDashboard.name}"`);
        }
      });
    }

    // New Dashboard
    const newDashBtn = document.getElementById('btn-new-dashboard');
    if (newDashBtn) {
      newDashBtn.addEventListener('click', () => this.createNewDashboard());
    }

    // Duplicate Dashboard
    const dupDashBtn = document.getElementById('btn-duplicate-dashboard');
    if (dupDashBtn) {
      dupDashBtn.addEventListener('click', () => {
        const duplicated = {
          ...JSON.parse(JSON.stringify(this.activeDashboard)),
          id: 'dash-' + Date.now(),
          name: `${this.activeDashboard.name} (Copy)`
        };
        this.dashboards.push(duplicated);
        this.activeDashboard = duplicated;
        this.saveCurrentDashboard();
        this.render();
        window.Toast.success('Dashboard duplicated');
      });
    }

    // Delete Dashboard
    const delDashBtn = document.getElementById('btn-delete-dashboard');
    if (delDashBtn) {
      delDashBtn.addEventListener('click', async () => {
        if (this.dashboards.length <= 1) return;
        if (confirm(`Delete dashboard "${this.activeDashboard.name}"?`)) {
          const toDeleteId = this.activeDashboard.id;
          await window.dataLensStorage.deleteDashboard(toDeleteId);
          this.dashboards = this.dashboards.filter(d => d.id !== toDeleteId);
          this.activeDashboard = this.dashboards[0];
          this.saveCurrentDashboard();
          this.render();
          window.Toast.info('Dashboard deleted');
        }
      });
    }

    // Global filter select
    const globalFilterSelect = document.getElementById('select-global-dash-filter');
    if (globalFilterSelect) {
      globalFilterSelect.addEventListener('change', (e) => {
        const textCols = this.columns.filter(c => !c.isNumeric);
        const col = textCols.length > 0 ? textCols[0].name : '';
        if (e.target.value) {
          this.globalFilter = { column: col, value: e.target.value };
        } else {
          this.globalFilter = null;
        }
        this.render();
      });
    }

    // Add quick widget
    const addWidgetBtn = document.getElementById('btn-add-quick-widget');
    if (addWidgetBtn) {
      addWidgetBtn.addEventListener('click', () => this.showAddWidgetModal());
    }

    // Fullscreen Toggle
    const fullscreenBtn = document.getElementById('btn-fullscreen-dashboard');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        const wrapper = document.getElementById('dashboard-view-wrapper');
        wrapper.classList.toggle('fullscreen');
      });
    }

    // Print Executive Report
    const printBtn = document.getElementById('btn-print-dashboard');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Widget span selects
    this.container.querySelectorAll('.widget-span-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const wId = e.target.dataset.widgetId;
        const widget = this.activeDashboard.widgets.find(w => w.id === wId);
        if (widget) {
          widget.colSpan = parseInt(e.target.value, 10);
          this.saveCurrentDashboard();
          this.render();
        }
      });
    });

    // Move left
    this.container.querySelectorAll('[data-action="move-widget-left"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.dataset.index, 10);
        if (idx > 0) {
          const temp = this.activeDashboard.widgets[idx];
          this.activeDashboard.widgets[idx] = this.activeDashboard.widgets[idx - 1];
          this.activeDashboard.widgets[idx - 1] = temp;
          this.saveCurrentDashboard();
          this.render();
        }
      });
    });

    // Move right
    this.container.querySelectorAll('[data-action="move-widget-right"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.dataset.index, 10);
        if (idx < this.activeDashboard.widgets.length - 1) {
          const temp = this.activeDashboard.widgets[idx];
          this.activeDashboard.widgets[idx] = this.activeDashboard.widgets[idx + 1];
          this.activeDashboard.widgets[idx + 1] = temp;
          this.saveCurrentDashboard();
          this.render();
        }
      });
    });

    // Export widget image
    this.container.querySelectorAll('[data-action="export-widget-img"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const wId = btn.dataset.widgetId;
        const bodyEl = document.getElementById(`widget-body-${wId}`);
        const widget = this.activeDashboard.widgets.find(w => w.id === wId);
        ChartRenderer.exportChart(bodyEl, 'png', (widget ? widget.title : 'widget').toLowerCase().replace(/\s+/g, '_'));
        window.Toast.success('Widget image exported as PNG');
      });
    });

    // Delete widget
    this.container.querySelectorAll('[data-action="delete-widget"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.dataset.index, 10);
        this.activeDashboard.widgets.splice(idx, 1);
        this.saveCurrentDashboard();
        this.render();
      });
    });
  }

  createNewDashboard() {
    const newDash = {
      id: 'dash-' + Date.now(),
      name: `Dashboard ${this.dashboards.length + 1}`,
      widgets: []
    };
    this.dashboards.push(newDash);
    this.activeDashboard = newDash;
    this.saveCurrentDashboard();
    this.render();
    window.Toast.success('Created new dashboard');
  }

  showAddWidgetModal() {
    const modalBackdrop = document.getElementById('app-modal-backdrop');
    const modalDialog = document.getElementById('app-modal-dialog');
    if (!modalBackdrop || !modalDialog) return;

    modalDialog.innerHTML = `
      <div class="modal-header">
        <div class="modal-title">Add Dashboard Widget</div>
        <button class="btn btn-ghost btn-sm btn-icon" id="btn-close-modal" aria-label="Close dialog">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label" for="modal-widget-title">Widget Title</label>
          <input type="text" class="form-control" id="modal-widget-title" placeholder="Widget Title..." value="New Visualization">
        </div>

        <div class="form-group">
          <label class="form-label" for="modal-widget-type">Widget Type</label>
          <select class="form-control" id="modal-widget-type">
            <option value="bar">Bar Chart</option>
            <option value="horizontal_bar">Horizontal Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="area">Area Chart</option>
            <option value="pie">Pie Chart</option>
            <option value="donut">Donut Chart</option>
            <option value="kpi">KPI Metric Card</option>
          </select>
        </div>

        <div class="form-group" id="modal-widget-x-group">
          <label class="form-label" for="modal-widget-x">Dimension (X-Axis / Category)</label>
          <select class="form-control" id="modal-widget-x">
            ${this.columns.map(c => `<option value="${this.escapeHtml(c.name)}">${this.escapeHtml(c.name)} (${c.type})</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="modal-widget-y">Metric (Y-Axis / Target Value)</label>
          <select class="form-control" id="modal-widget-y">
            ${this.columns.map(c => `<option value="${this.escapeHtml(c.name)}">${this.escapeHtml(c.name)} (${c.type})</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="modal-widget-agg">Aggregation</label>
          <select class="form-control" id="modal-widget-agg">
            <option value="sum">Sum</option>
            <option value="avg">Average</option>
            <option value="count">Count</option>
            <option value="unique_count">Unique Count</option>
            <option value="min">Min</option>
            <option value="max">Max</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="btn-cancel-modal">Cancel</button>
        <button class="btn btn-primary" id="btn-save-new-widget">Add to Dashboard</button>
      </div>
    `;

    modalBackdrop.classList.add('open');

    const closeModal = () => modalBackdrop.classList.remove('open');
    document.getElementById('btn-close-modal').onclick = closeModal;
    document.getElementById('btn-cancel-modal').onclick = closeModal;
    modalBackdrop.onclick = (e) => { if (e.target === modalBackdrop) closeModal(); };

    const typeSelect = document.getElementById('modal-widget-type');
    const xGroup = document.getElementById('modal-widget-x-group');
    typeSelect.onchange = () => {
      xGroup.style.display = typeSelect.value === 'kpi' ? 'none' : 'flex';
    };

    document.getElementById('btn-save-new-widget').onclick = () => {
      const title = document.getElementById('modal-widget-title').value || 'New Visualization';
      const type = document.getElementById('modal-widget-type').value;
      const xCol = document.getElementById('modal-widget-x').value;
      const yCol = document.getElementById('modal-widget-y').value;
      const aggType = document.getElementById('modal-widget-agg').value;

      this.addWidget({
        id: 'widget-' + Date.now(),
        type,
        title,
        xCol,
        yCol,
        aggType,
        colSpan: type === 'kpi' ? 3 : 6
      });

      closeModal();
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

window.DashboardView = DashboardView;
