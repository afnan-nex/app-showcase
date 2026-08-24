/**
 * DataLens - Comprehensive Data Profiling & Statistical Health Studio
 * Automated dataset audits, distribution histograms, and statistical profiling.
 */

class StatsView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.dataset = [];
    this.columns = [];
  }

  setDataset(dataset, columns) {
    this.dataset = dataset || [];
    this.columns = columns || [];
    this.render();
  }

  render() {
    if (!this.container) return;

    if (!this.dataset || this.dataset.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-title">No Dataset Loaded</div>
          <div class="empty-state-desc">Load a dataset to view automated statistical profiles and data health metrics.</div>
        </div>
      `;
      return;
    }

    const profile = DataEngine.profileDataset(this.dataset, this.columns);
    const approxMemory = ((JSON.stringify(this.dataset).length * 2) / 1024).toFixed(1); // KB

    let html = `
      <div class="stats-view-container">
        <!-- Dataset Health Scorecard -->
        <div class="stats-summary-grid">
          <div class="stats-card">
            <div class="stats-card-label">Total Rows</div>
            <div class="stats-card-value">${profile.totalRows.toLocaleString()}</div>
            <div class="stats-card-sub">Total data records</div>
          </div>

          <div class="stats-card">
            <div class="stats-card-label">Total Columns</div>
            <div class="stats-card-value">${profile.totalCols}</div>
            <div class="stats-card-sub">${this.columns.filter(c => c.isNumeric).length} Numeric · ${this.columns.filter(c => !c.isNumeric).length} Categorical</div>
          </div>

          <div class="stats-card">
            <div class="stats-card-label">Missing Data</div>
            <div class="stats-card-value" style="color: ${profile.overallMissingPct > 5 ? 'var(--color-warning)' : 'var(--color-success)'};">
              ${profile.overallMissingPct.toFixed(1)}%
            </div>
            <div class="stats-card-sub">${profile.totalMissing.toLocaleString()} missing / blank cells</div>
          </div>

          <div class="stats-card">
            <div class="stats-card-label">Memory Footprint</div>
            <div class="stats-card-value">${approxMemory} KB</div>
            <div class="stats-card-sub">In-browser client memory</div>
          </div>
        </div>

        <!-- Column Profiles Grid -->
        <div class="sidebar-header" style="padding: 8px 0 0 0; color: var(--text-primary); font-size: 13px;">
          Column Profiling & Distributions (${profile.columns.length})
        </div>

        <div class="column-profiling-grid">
          ${profile.columns.map(col => this.renderColumnCard(col)).join('')}
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  }

  renderColumnCard(col) {
    return `
      <div class="col-profile-card">
        <div class="col-profile-header">
          <div style="display: flex; align-items: center; gap: 6px; overflow: hidden;">
            <span class="type-badge type-${col.type}">${col.type.slice(0, 3)}</span>
            <span class="col-profile-name" title="${this.escapeHtml(col.name)}">${this.escapeHtml(col.name)}</span>
          </div>
          <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-muted);">${col.uniqueCount} distinct</span>
        </div>

        <table class="col-stats-table">
          <tbody>
            <tr>
              <td>Valid / Non-Null:</td>
              <td>${col.nonNullCount.toLocaleString()} (${(100 - col.nullRatio).toFixed(1)}%)</td>
            </tr>
            <tr>
              <td>Missing / Blank:</td>
              <td style="${col.nullCount > 0 ? 'color: var(--color-warning);' : ''}">${col.nullCount.toLocaleString()} (${col.nullRatio.toFixed(1)}%)</td>
            </tr>
            ${col.isNumeric ? `
              <tr>
                <td>Sum:</td>
                <td>${TypeDetector.formatValue(col.sum, col.type)}</td>
              </tr>
              <tr>
                <td>Average (Mean):</td>
                <td>${TypeDetector.formatValue(col.avg, col.type)}</td>
              </tr>
              <tr>
                <td>Median:</td>
                <td>${TypeDetector.formatValue(col.median, col.type)}</td>
              </tr>
              <tr>
                <td>Min / Max:</td>
                <td>${TypeDetector.formatValue(col.min, col.type)} / ${TypeDetector.formatValue(col.max, col.type)}</td>
              </tr>
              <tr>
                <td>Std Deviation:</td>
                <td>${col.stdDev.toFixed(2)}</td>
              </tr>
            ` : `
              <tr>
                <td>Unique Values:</td>
                <td>${col.uniqueCount.toLocaleString()} (${col.uniqueRatio.toFixed(1)}%)</td>
              </tr>
            `}
          </tbody>
        </table>

        <!-- Visual Distribution -->
        ${col.isNumeric && col.histogram && col.histogram.length > 0 ? `
          <div style="font-size: 10px; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Distribution Histogram</div>
          <div class="mini-histogram-bar-container">
            ${col.histogram.map(b => `<div class="mini-histogram-bar" style="height: ${Math.max(b.heightPct, 8)}%;" title="${b.count} records"></div>`).join('')}
          </div>
        ` : ''}

        ${!col.isNumeric && col.topValues && col.topValues.length > 0 ? `
          <div style="font-size: 10px; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Top Frequent Values</div>
          <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 2px;">
            ${col.topValues.map(tv => `
              <div style="display: flex; flex-direction: column; gap: 1px;">
                <div style="display: flex; justify-content: space-between; font-size: 11px;">
                  <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 180px;">${this.escapeHtml(tv.value || '(Blank)')}</span>
                  <span style="font-family: var(--font-mono); color: var(--text-muted);">${tv.pct.toFixed(1)}%</span>
                </div>
                <div style="height: 3px; background-color: var(--border-subtle); border-radius: 2px; overflow: hidden;">
                  <div style="height: 100%; width: ${tv.pct}%; background-color: var(--primary-500);"></div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
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

window.StatsView = StatsView;
