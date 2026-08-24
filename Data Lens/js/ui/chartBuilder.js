/**
 * DataLens - Visual Chart Studio & Builder Component
 * Lets users visually configure chart types, dimensions, metrics, groupings, and aggregations.
 */

class ChartBuilder {
  constructor(containerId, onAddToDashboard = null) {
    this.container = document.getElementById(containerId);
    this.onAddToDashboard = onAddToDashboard;

    this.dataset = [];
    this.columns = [];

    this.config = {
      type: 'bar',
      title: 'Sales by Category',
      xCol: '',
      yCol: '',
      groupCol: '',
      aggType: 'sum',
      palette: 'classic'
    };
  }

  setDataset(data, columns) {
    this.dataset = data || [];
    this.columns = columns || [];

    if (this.columns.length > 0) {
      const textCols = this.columns.filter(c => !c.isNumeric);
      const numCols = this.columns.filter(c => c.isNumeric);

      this.config.xCol = textCols.length > 0 ? textCols[0].name : this.columns[0].name;
      this.config.yCol = numCols.length > 0 ? numCols[0].name : this.columns[0].name;
      this.config.groupCol = '';
      this.config.title = `${this.config.yCol} by ${this.config.xCol}`;
    }

    this.render();
  }

  render() {
    if (!this.container) return;

    if (!this.dataset || this.dataset.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-title">No Data Loaded</div>
          <div class="empty-state-desc">Load a dataset to start building visual charts.</div>
        </div>
      `;
      return;
    }

    const chartTypes = [
      { id: 'bar', label: 'Bar', icon: '<rect x="3" y="10" width="4" height="11"/><rect x="10" y="4" width="4" height="17"/><rect x="17" y="14" width="4" height="7"/>' },
      { id: 'horizontal_bar', label: 'Horiz Bar', icon: '<rect x="3" y="4" width="17" height="4"/><rect x="3" y="10" width="11" height="4"/><rect x="3" y="16" width="7" height="4"/>' },
      { id: 'line', label: 'Line', icon: '<polyline points="3 17 9 10 15 14 21 6"/>' },
      { id: 'area', label: 'Area', icon: '<path d="M3 18 L9 11 L15 15 L21 7 L21 21 L3 21 Z"/>' },
      { id: 'pie', label: 'Pie', icon: '<circle cx="12" cy="12" r="9"/><path d="M12 3 v9 h9"/>' },
      { id: 'donut', label: 'Donut', icon: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3 v5"/>' },
      { id: 'scatter', label: 'Scatter', icon: '<circle cx="6" cy="16" r="2"/><circle cx="12" cy="8" r="2"/><circle cx="18" cy="13" r="2"/><circle cx="15" cy="5" r="2"/>' },
      { id: 'kpi', label: 'KPI Card', icon: '<rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="9" x2="17" y2="9"/><line x1="7" y1="14" x2="12" y2="14"/>' }
    ];

    let html = `
      <div class="chart-builder-container">
        <!-- Left Config Panel -->
        <div class="chart-config-panel">
          <div class="sidebar-header" style="padding: 0 0 6px 0;">Chart Configuration</div>

          <div class="form-group">
            <label class="form-label" for="cb-chart-title">Chart Title</label>
            <input type="text" class="form-control" id="cb-chart-title" value="${this.escapeHtml(this.config.title)}" aria-label="Chart title">
          </div>

          <div class="form-group">
            <label class="form-label">Chart Type</label>
            <div class="chart-type-grid" role="radiogroup" aria-label="Select chart type">
              ${chartTypes.map(t => `
                <button type="button" class="chart-type-btn ${t.id === this.config.type ? 'active' : ''}" data-type="${t.id}" role="radio" aria-checked="${t.id === this.config.type}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${t.icon}</svg>
                  <span>${t.label}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="form-group" id="cb-group-x" ${this.config.type === 'kpi' ? 'style="display:none;"' : ''}>
            <label class="form-label" for="cb-select-x">X-Axis / Category Dimension</label>
            <select class="form-control" id="cb-select-x" aria-label="Select X-Axis Dimension">
              ${this.columns.map(c => `<option value="${this.escapeHtml(c.name)}" ${c.name === this.config.xCol ? 'selected' : ''}>${this.escapeHtml(c.name)} (${c.type})</option>`).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="cb-select-y">Y-Axis / Metric Column</label>
            <select class="form-control" id="cb-select-y" aria-label="Select Y-Axis Metric">
              ${this.columns.map(c => `<option value="${this.escapeHtml(c.name)}" ${c.name === this.config.yCol ? 'selected' : ''}>${this.escapeHtml(c.name)} (${c.type})</option>`).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="cb-select-agg">Aggregation Function</label>
            <select class="form-control" id="cb-select-agg" aria-label="Select Aggregation Function">
              <option value="sum" ${this.config.aggType === 'sum' ? 'selected' : ''}>Sum (Total)</option>
              <option value="avg" ${this.config.aggType === 'avg' ? 'selected' : ''}>Average (Mean)</option>
              <option value="count" ${this.config.aggType === 'count' ? 'selected' : ''}>Count (Rows)</option>
              <option value="unique_count" ${this.config.aggType === 'unique_count' ? 'selected' : ''}>Distinct / Unique Count</option>
              <option value="min" ${this.config.aggType === 'min' ? 'selected' : ''}>Minimum</option>
              <option value="max" ${this.config.aggType === 'max' ? 'selected' : ''}>Maximum</option>
              <option value="median" ${this.config.aggType === 'median' ? 'selected' : ''}>Median</option>
              <option value="std_dev" ${this.config.aggType === 'std_dev' ? 'selected' : ''}>Standard Deviation</option>
            </select>
          </div>

          <div class="form-group" id="cb-group-series" ${['pie', 'donut', 'kpi', 'horizontal_bar'].includes(this.config.type) ? 'style="display:none;"' : ''}>
            <label class="form-label" for="cb-select-group">Group By / Series (Optional)</label>
            <select class="form-control" id="cb-select-group" aria-label="Select Grouping Dimension">
              <option value="">(None - Single Series)</option>
              ${this.columns.map(c => `<option value="${this.escapeHtml(c.name)}" ${c.name === this.config.groupCol ? 'selected' : ''}>${this.escapeHtml(c.name)} (${c.type})</option>`).join('')}
            </select>
          </div>

          <div style="margin-top: auto; display: flex; flex-direction: column; gap: 8px;">
            <button class="btn btn-primary" id="btn-add-chart-to-dashboard" style="width: 100%;" aria-label="Add visualization to dashboard">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
              <span>Add to Dashboard</span>
            </button>
          </div>
        </div>

        <!-- Right Live Preview Canvas -->
        <div class="chart-preview-panel">
          <div class="chart-preview-header">
            <span style="font-size: 13px; font-weight: 600;" id="cb-preview-title">${this.escapeHtml(this.config.title)}</span>
            <div class="toolbar-group">
              <button class="btn btn-secondary btn-sm" id="btn-export-chart-png" aria-label="Export chart image as PNG">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span>Export PNG</span>
              </button>
              <button class="btn btn-secondary btn-sm" id="btn-export-chart-svg" aria-label="Export chart vector as SVG">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                <span>Export SVG</span>
              </button>
            </div>
          </div>

          <div class="chart-canvas-wrapper" id="chart-live-canvas"></div>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
    this.bindEvents();
    this.updatePreview();
  }

  bindEvents() {
    // Title Input
    const titleInput = document.getElementById('cb-chart-title');
    if (titleInput) {
      titleInput.addEventListener('input', (e) => {
        this.config.title = e.target.value;
        const titleEl = document.getElementById('cb-preview-title');
        if (titleEl) titleEl.textContent = this.config.title;
      });
    }

    // Chart Type Selector
    const typeButtons = this.container.querySelectorAll('.chart-type-btn');
    typeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        typeButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        this.config.type = btn.dataset.type;

        // Toggle Grouping visibility
        const groupEl = document.getElementById('cb-group-series');
        const xGroupEl = document.getElementById('cb-group-x');
        if (groupEl) groupEl.style.display = ['pie', 'donut', 'kpi', 'horizontal_bar'].includes(this.config.type) ? 'none' : 'flex';
        if (xGroupEl) xGroupEl.style.display = this.config.type === 'kpi' ? 'none' : 'flex';

        this.updatePreview();
      });
    });

    // Select X
    const selectX = document.getElementById('cb-select-x');
    if (selectX) {
      selectX.addEventListener('change', (e) => {
        this.config.xCol = e.target.value;
        this.updatePreview();
      });
    }

    // Select Y
    const selectY = document.getElementById('cb-select-y');
    if (selectY) {
      selectY.addEventListener('change', (e) => {
        this.config.yCol = e.target.value;
        this.updatePreview();
      });
    }

    // Select Agg
    const selectAgg = document.getElementById('cb-select-agg');
    if (selectAgg) {
      selectAgg.addEventListener('change', (e) => {
        this.config.aggType = e.target.value;
        this.updatePreview();
      });
    }

    // Select Group
    const selectGroup = document.getElementById('cb-select-group');
    if (selectGroup) {
      selectGroup.addEventListener('change', (e) => {
        this.config.groupCol = e.target.value;
        this.updatePreview();
      });
    }

    // Add to Dashboard
    const addBtn = document.getElementById('btn-add-chart-to-dashboard');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        if (this.onAddToDashboard) {
          this.onAddToDashboard({
            ...this.config,
            id: 'widget-' + Date.now(),
            colSpan: this.config.type === 'kpi' ? 3 : 6
          });
        }
      });
    }

    // Export PNG
    const expPngBtn = document.getElementById('btn-export-chart-png');
    if (expPngBtn) {
      expPngBtn.addEventListener('click', () => {
        const canvasWrapper = document.getElementById('chart-live-canvas');
        ChartRenderer.exportChart(canvasWrapper, 'png', this.config.title.toLowerCase().replace(/\s+/g, '_'));
        window.Toast.success('Chart image exported as PNG');
      });
    }

    // Export SVG
    const expSvgBtn = document.getElementById('btn-export-chart-svg');
    if (expSvgBtn) {
      expSvgBtn.addEventListener('click', () => {
        const canvasWrapper = document.getElementById('chart-live-canvas');
        ChartRenderer.exportChart(canvasWrapper, 'svg', this.config.title.toLowerCase().replace(/\s+/g, '_'));
        window.Toast.success('Chart exported as SVG vector');
      });
    }
  }

  updatePreview() {
    const canvasWrapper = document.getElementById('chart-live-canvas');
    if (!canvasWrapper) return;

    const renderConfig = {
      ...this.config,
      data: this.dataset
    };

    ChartRenderer.render(canvasWrapper, renderConfig, this.columns);
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

window.ChartBuilder = ChartBuilder;
