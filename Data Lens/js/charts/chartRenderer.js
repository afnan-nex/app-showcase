/**
 * DataLens - Bespoke Vector SVG Charting Engine
 * High-performance, zero-dependency analytical charts:
 * Bar, Horizontal Bar, Line, Area, Pie, Donut, Scatter, and KPI Cards.
 */

class ChartRenderer {
  static PALETTE = [
    '#3b82f6', // Classic BI Blue
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#f97316', // Orange
    '#14b8a6', // Teal
    '#6366f1', // Indigo
    '#84cc16'  // Lime
  ];

  /**
   * Main entry point to render a chart into a container element.
   * @param {HTMLElement} container 
   * @param {Object} config - { type, data, xCol, yCol, groupCol, aggType, title, options }
   * @param {Array<Object>} columnsMeta 
   */
  static render(container, config, columnsMeta = []) {
    if (!container) return;
    container.innerHTML = '';

    if (!config || !config.data || config.data.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-title">No Data Available</div>
          <div class="empty-state-desc">Select valid dimensions and metrics to generate a chart.</div>
        </div>
      `;
      return;
    }

    const chartType = config.type || 'bar';

    if (chartType === 'kpi') {
      this.renderKPICard(container, config, columnsMeta);
      return;
    }

    const rect = container.getBoundingClientRect();
    const w = Math.max(rect.width || 400, 280);
    const h = Math.max(rect.height || 300, 200);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'bi-chart-svg');
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', `${config.title || 'Chart'}: ${chartType} visualization`);

    // Create Tooltip Overlay
    let tooltip = container.querySelector('.bi-chart-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'bi-chart-tooltip';
      container.appendChild(tooltip);
    }

    switch (chartType) {
      case 'bar':
        this.renderBarChart(svg, tooltip, w, h, config, columnsMeta);
        break;
      case 'horizontal_bar':
        this.renderHorizontalBarChart(svg, tooltip, w, h, config, columnsMeta);
        break;
      case 'line':
        this.renderLineChart(svg, tooltip, w, h, config, columnsMeta, false);
        break;
      case 'area':
        this.renderLineChart(svg, tooltip, w, h, config, columnsMeta, true);
        break;
      case 'pie':
      case 'donut':
        this.renderPieDonutChart(svg, tooltip, w, h, config, columnsMeta, chartType === 'donut');
        break;
      case 'scatter':
        this.renderScatterPlot(svg, tooltip, w, h, config, columnsMeta);
        break;
      default:
        this.renderBarChart(svg, tooltip, w, h, config, columnsMeta);
    }

    container.appendChild(svg);
  }

  /**
   * Prepares aggregated dataset for chart rendering.
   */
  static prepareChartData(config, columnsMeta = []) {
    const { data, xCol, yCol, groupCol, aggType } = config;
    if (!xCol || !yCol) return [];

    const groupCols = [xCol];
    if (groupCol && groupCol !== xCol) {
      groupCols.push(groupCol);
    }

    const aggs = [{ metricCol: yCol, aggType: aggType || 'sum', outputCol: 'metricValue' }];
    const aggregated = DataEngine.aggregate(data, groupCols, aggs, columnsMeta);

    return aggregated;
  }

  /**
   * Vertical Bar Chart
   */
  static renderBarChart(svg, tooltip, width, height, config, columnsMeta) {
    const margin = { top: 25, right: 25, bottom: 55, left: 65 };
    const chartW = width - margin.left - margin.right;
    const chartH = height - margin.top - margin.bottom;

    const prepData = this.prepareChartData(config, columnsMeta);
    if (prepData.length === 0) return;

    // Extract Categories (X-Axis) and Groups (Series)
    const categories = Array.from(new Set(prepData.map(d => String(d[config.xCol]))));
    const groups = config.groupCol ? Array.from(new Set(prepData.map(d => String(d[config.groupCol])))) : ['Default'];

    // Find Max Value for Y-Scale
    const maxVal = Math.max(...prepData.map(d => d.metricValue || 0), 1) * 1.15;
    const minVal = Math.min(0, ...prepData.map(d => d.metricValue || 0));

    // Draw Grid & Y-Axis Ticks
    this.drawYAxis(svg, margin, chartW, chartH, minVal, maxVal, config.yCol, columnsMeta);

    // Draw X-Axis Baseline
    const axisGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    axisGroup.setAttribute('class', 'bi-chart-axis');
    const xZeroY = margin.top + chartH - ((-minVal) / (maxVal - minVal)) * chartH;

    const baseLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    baseLine.setAttribute('x1', margin.left);
    baseLine.setAttribute('y1', xZeroY);
    baseLine.setAttribute('x2', margin.left + chartW);
    baseLine.setAttribute('y2', xZeroY);
    axisGroup.appendChild(baseLine);
    svg.appendChild(axisGroup);

    // Render Bars
    const catBand = chartW / categories.length;
    const barPadding = 0.2;
    const groupPadding = 0.05;
    const innerBand = catBand * (1 - barPadding);
    const barWidth = innerBand / groups.length;

    categories.forEach((cat, catIdx) => {
      const catX = margin.left + catIdx * catBand + (catBand * barPadding) / 2;

      // X Tick Label
      const tickText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      tickText.setAttribute('class', 'bi-chart-tick-label');
      tickText.setAttribute('x', catX + innerBand / 2);
      tickText.setAttribute('y', margin.top + chartH + 18);
      tickText.setAttribute('text-anchor', 'middle');
      
      const labelStr = cat.length > 14 ? cat.slice(0, 12) + '…' : cat;
      tickText.textContent = labelStr;

      if (categories.length > 6) {
        tickText.setAttribute('transform', `rotate(-30, ${catX + innerBand / 2}, ${margin.top + chartH + 18})`);
      }
      svg.appendChild(tickText);

      // Render Series Bars for this category
      groups.forEach((grp, grpIdx) => {
        const item = prepData.find(d => String(d[config.xCol]) === cat && (!config.groupCol || String(d[config.groupCol]) === grp));
        const val = item ? item.metricValue : 0;
        const color = this.PALETTE[grpIdx % this.PALETTE.length];

        const barH = (Math.abs(val) / (maxVal - minVal)) * chartH;
        const barX = catX + grpIdx * barWidth + (barWidth * groupPadding);
        const barY = val >= 0 ? xZeroY - barH : xZeroY;

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('class', 'bi-chart-series-bar');
        rect.setAttribute('x', barX);
        rect.setAttribute('y', barY);
        rect.setAttribute('width', Math.max(barWidth * (1 - groupPadding * 2), 2));
        rect.setAttribute('height', Math.max(barH, 1));
        rect.setAttribute('fill', color);
        rect.setAttribute('rx', '2');

        // Tooltip events
        this.attachTooltip(rect, tooltip, {
          title: cat,
          group: config.groupCol ? grp : null,
          metricLabel: config.yCol,
          value: this.formatValueWithMeta(val, config.yCol, columnsMeta)
        });

        svg.appendChild(rect);
      });
    });
  }

  /**
   * Horizontal Bar Chart
   */
  static renderHorizontalBarChart(svg, tooltip, width, height, config, columnsMeta) {
    const margin = { top: 20, right: 35, bottom: 40, left: 110 };
    const chartW = width - margin.left - margin.right;
    const chartH = height - margin.top - margin.bottom;

    const prepData = this.prepareChartData(config, columnsMeta).slice(0, 15);
    if (prepData.length === 0) return;

    const maxVal = Math.max(...prepData.map(d => d.metricValue || 0), 1) * 1.15;
    const rowH = chartH / prepData.length;
    const barH = rowH * 0.65;

    prepData.forEach((item, idx) => {
      const cat = String(item[config.xCol]);
      const val = item.metricValue || 0;
      const barW = (val / maxVal) * chartW;
      const y = margin.top + idx * rowH + (rowH - barH) / 2;
      const color = this.PALETTE[idx % this.PALETTE.length];

      // Y Label
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('class', 'bi-chart-tick-label');
      label.setAttribute('x', margin.left - 8);
      label.setAttribute('y', y + barH / 2 + 4);
      label.setAttribute('text-anchor', 'end');
      label.textContent = cat.length > 16 ? cat.slice(0, 14) + '…' : cat;
      svg.appendChild(label);

      // Bar Rect
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('class', 'bi-chart-series-bar');
      rect.setAttribute('x', margin.left);
      rect.setAttribute('y', y);
      rect.setAttribute('width', Math.max(barW, 2));
      rect.setAttribute('height', barH);
      rect.setAttribute('fill', color);
      rect.setAttribute('rx', '2');

      // Value label at bar end
      const valLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      valLabel.setAttribute('class', 'bi-chart-tick-label');
      valLabel.setAttribute('x', margin.left + barW + 6);
      valLabel.setAttribute('y', y + barH / 2 + 4);
      valLabel.setAttribute('text-anchor', 'start');
      valLabel.textContent = TypeDetector.formatCompactNumber(val);
      svg.appendChild(valLabel);

      this.attachTooltip(rect, tooltip, {
        title: cat,
        metricLabel: config.yCol,
        value: this.formatValueWithMeta(val, config.yCol, columnsMeta)
      });

      svg.appendChild(rect);
    });
  }

  /**
   * Line & Area Chart
   */
  static renderLineChart(svg, tooltip, width, height, config, columnsMeta, isArea = false) {
    const margin = { top: 25, right: 30, bottom: 55, left: 65 };
    const chartW = width - margin.left - margin.right;
    const chartH = height - margin.top - margin.bottom;

    const prepData = this.prepareChartData(config, columnsMeta);
    if (prepData.length === 0) return;

    const categories = Array.from(new Set(prepData.map(d => String(d[config.xCol]))));
    const groups = config.groupCol ? Array.from(new Set(prepData.map(d => String(d[config.groupCol])))) : ['Default'];

    const maxVal = Math.max(...prepData.map(d => d.metricValue || 0), 1) * 1.15;
    const minVal = Math.min(0, ...prepData.map(d => d.metricValue || 0));

    this.drawYAxis(svg, margin, chartW, chartH, minVal, maxVal, config.yCol, columnsMeta);

    const stepX = chartW / Math.max(categories.length - 1, 1);

    // Render X Tick Labels
    categories.forEach((cat, idx) => {
      if (categories.length > 12 && idx % Math.ceil(categories.length / 8) !== 0) return;
      const x = margin.left + idx * stepX;
      const tick = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      tick.setAttribute('class', 'bi-chart-tick-label');
      tick.setAttribute('x', x);
      tick.setAttribute('y', margin.top + chartH + 18);
      tick.setAttribute('text-anchor', 'middle');
      tick.textContent = cat.length > 12 ? cat.slice(0, 10) + '…' : cat;
      svg.appendChild(tick);
    });

    // Render Series Lines
    groups.forEach((grp, grpIdx) => {
      const color = this.PALETTE[grpIdx % this.PALETTE.length];
      const points = [];

      categories.forEach((cat, catIdx) => {
        const item = prepData.find(d => String(d[config.xCol]) === cat && (!config.groupCol || String(d[config.groupCol]) === grp));
        const val = item ? item.metricValue : 0;
        const x = margin.left + catIdx * stepX;
        const y = margin.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
        points.push({ x, y, val, cat });
      });

      if (points.length === 0) return;

      const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

      // Area Fill
      if (isArea) {
        const zeroY = margin.top + chartH;
        const areaData = `${pathData} L ${points[points.length - 1].x} ${zeroY} L ${points[0].x} ${zeroY} Z`;
        const areaPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        areaPath.setAttribute('class', 'bi-chart-series-area');
        areaPath.setAttribute('d', areaData);
        areaPath.setAttribute('fill', color);
        svg.appendChild(areaPath);
      }

      // Line Path
      const linePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      linePath.setAttribute('class', 'bi-chart-series-line');
      linePath.setAttribute('d', pathData);
      linePath.setAttribute('stroke', color);
      svg.appendChild(linePath);

      // Points
      points.forEach(p => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('class', 'bi-chart-point');
        circle.setAttribute('cx', p.x);
        circle.setAttribute('cy', p.y);
        circle.setAttribute('r', '4');
        circle.setAttribute('fill', color);
        circle.setAttribute('stroke', '#ffffff');
        circle.setAttribute('stroke-width', '1.5');

        this.attachTooltip(circle, tooltip, {
          title: p.cat,
          group: config.groupCol ? grp : null,
          metricLabel: config.yCol,
          value: this.formatValueWithMeta(p.val, config.yCol, columnsMeta)
        });

        svg.appendChild(circle);
      });
    });
  }

  /**
   * Pie & Donut Chart
   */
  static renderPieDonutChart(svg, tooltip, width, height, config, columnsMeta, isDonut = false) {
    const prepData = this.prepareChartData(config, columnsMeta).slice(0, 10);
    if (prepData.length === 0) return;

    const totalVal = prepData.reduce((acc, d) => acc + Math.max(0, d.metricValue || 0), 0);
    if (totalVal === 0) return;

    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.38;
    const innerRadius = isDonut ? radius * 0.58 : 0;

    let currentAngle = -Math.PI / 2;

    prepData.forEach((item, idx) => {
      const val = Math.max(0, item.metricValue || 0);
      const sliceAngle = (val / totalVal) * 2 * Math.PI;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      const color = this.PALETTE[idx % this.PALETTE.length];
      const cat = String(item[config.xCol]);
      const pctStr = ((val / totalVal) * 100).toFixed(1) + '%';

      // Arc coordinates
      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const x2 = cx + radius * Math.cos(endAngle);
      const y2 = cy + radius * Math.sin(endAngle);

      const x3 = cx + innerRadius * Math.cos(endAngle);
      const y3 = cy + innerRadius * Math.sin(endAngle);
      const x4 = cx + innerRadius * Math.cos(startAngle);
      const y4 = cy + innerRadius * Math.sin(startAngle);

      const largeArc = sliceAngle > Math.PI ? 1 : 0;

      const d = isDonut
        ? `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`
        : `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('class', 'bi-chart-slice');
      path.setAttribute('d', d);
      path.setAttribute('fill', color);
      path.setAttribute('stroke', 'var(--bg-app)');
      path.setAttribute('stroke-width', '1.5');

      this.attachTooltip(path, tooltip, {
        title: cat,
        metricLabel: `${config.yCol} (${pctStr})`,
        value: this.formatValueWithMeta(val, config.yCol, columnsMeta)
      });

      svg.appendChild(path);
      currentAngle += sliceAngle;
    });

    if (isDonut) {
      const centerVal = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      centerVal.setAttribute('x', cx);
      centerVal.setAttribute('y', cy + 4);
      centerVal.setAttribute('text-anchor', 'middle');
      centerVal.setAttribute('fill', 'var(--text-primary)');
      centerVal.setAttribute('font-size', '14px');
      centerVal.setAttribute('font-weight', '700');
      centerVal.setAttribute('font-family', 'var(--font-mono)');
      centerVal.textContent = TypeDetector.formatCompactNumber(totalVal);
      svg.appendChild(centerVal);

      const centerLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      centerLabel.setAttribute('x', cx);
      centerLabel.setAttribute('y', cy + 18);
      centerLabel.setAttribute('text-anchor', 'middle');
      centerLabel.setAttribute('fill', 'var(--text-muted)');
      centerLabel.setAttribute('font-size', '10px');
      centerLabel.setAttribute('text-transform', 'uppercase');
      centerLabel.textContent = 'Total';
      svg.appendChild(centerLabel);
    }
  }

  /**
   * Scatter Plot
   */
  static renderScatterPlot(svg, tooltip, width, height, config, columnsMeta) {
    const margin = { top: 25, right: 30, bottom: 50, left: 65 };
    const chartW = width - margin.left - margin.right;
    const chartH = height - margin.top - margin.bottom;

    const { data, xCol, yCol, groupCol } = config;
    const colXMeta = columnsMeta.find(c => c.name === xCol);
    const colYMeta = columnsMeta.find(c => c.name === yCol);

    const points = [];
    data.forEach(r => {
      const xVal = TypeDetector.parseRawValue(r[xCol], colXMeta ? colXMeta.type : DATA_TYPES.NUMBER);
      const yVal = TypeDetector.parseRawValue(r[yCol], colYMeta ? colYMeta.type : DATA_TYPES.NUMBER);
      if (xVal !== null && yVal !== null) {
        points.push({ x: xVal, y: yVal, group: groupCol ? String(r[groupCol]) : 'All', row: r });
      }
    });

    if (points.length === 0) return;

    const minX = Math.min(...points.map(p => p.x));
    const maxX = Math.max(...points.map(p => p.x)) * 1.05;
    const minY = Math.min(0, ...points.map(p => p.y));
    const maxY = Math.max(...points.map(p => p.y)) * 1.1;

    this.drawYAxis(svg, margin, chartW, chartH, minY, maxY, yCol, columnsMeta);

    // Scatter Dots
    const groups = Array.from(new Set(points.map(p => p.group)));

    points.forEach(p => {
      const cx = margin.left + ((p.x - minX) / (maxX - minX || 1)) * chartW;
      const cy = margin.top + chartH - ((p.y - minY) / (maxY - minY || 1)) * chartH;
      const grpIdx = groups.indexOf(p.group);
      const color = this.PALETTE[grpIdx % this.PALETTE.length];

      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('class', 'bi-chart-point');
      dot.setAttribute('cx', cx);
      dot.setAttribute('cy', cy);
      dot.setAttribute('r', '5');
      dot.setAttribute('fill', color);
      dot.setAttribute('opacity', '0.75');
      dot.setAttribute('stroke', '#ffffff');
      dot.setAttribute('stroke-width', '1');

      this.attachTooltip(dot, tooltip, {
        title: groupCol ? `${groupCol}: ${p.group}` : 'Data Point',
        group: `${xCol}: ${this.formatValueWithMeta(p.x, xCol, columnsMeta)}`,
        metricLabel: yCol,
        value: this.formatValueWithMeta(p.y, yCol, columnsMeta)
      });

      svg.appendChild(dot);
    });
  }

  /**
   * KPI Metric Card Renderer
   */
  static renderKPICard(container, config, columnsMeta) {
    const { data, yCol, aggType, title } = config;
    const colMeta = columnsMeta.find(c => c.name === yCol);
    const colType = colMeta ? colMeta.type : DATA_TYPES.NUMBER;

    const values = [];
    for (const r of data) {
      const val = TypeDetector.parseRawValue(r[yCol], colType);
      if (val !== null) values.push(val);
    }

    const metricVal = DataEngine.computeMetric(values, aggType || 'sum', data.length);
    const formattedVal = TypeDetector.formatValue(metricVal, colType);

    container.innerHTML = `
      <div class="kpi-card">
        <div class="kpi-title">${title || `${(aggType || 'SUM').toUpperCase()} of ${yCol}`}</div>
        <div class="kpi-value-row">
          <span class="kpi-main-value">${formattedVal}</span>
          <span class="kpi-delta-badge positive">+12.4%</span>
        </div>
        <div class="kpi-subtext">Across ${data.length.toLocaleString()} total records</div>
      </div>
    `;
  }

  /**
   * Helper: Draws Y-Axis Grid & Labels
   */
  static drawYAxis(svg, margin, chartW, chartH, minVal, maxVal, yColName, columnsMeta) {
    const ticksCount = 5;
    const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gridGroup.setAttribute('class', 'bi-chart-grid');

    const colMeta = columnsMeta.find(c => c.name === yColName);
    const isCurrency = colMeta && colMeta.type === DATA_TYPES.CURRENCY;
    const isPercent = colMeta && colMeta.type === DATA_TYPES.PERCENTAGE;

    for (let i = 0; i <= ticksCount; i++) {
      const tickVal = minVal + ((maxVal - minVal) / ticksCount) * i;
      const y = margin.top + chartH - (i / ticksCount) * chartH;

      // Grid line
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', margin.left);
      line.setAttribute('y1', y);
      line.setAttribute('x2', margin.left + chartW);
      line.setAttribute('y2', y);
      gridGroup.appendChild(line);

      // Tick Text
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('class', 'bi-chart-tick-label');
      text.setAttribute('x', margin.left - 8);
      text.setAttribute('y', y + 4);
      text.setAttribute('text-anchor', 'end');
      text.textContent = TypeDetector.formatCompactNumber(tickVal, isCurrency ? '$' : '', isPercent ? '%' : '');
      svg.appendChild(text);
    }

    svg.appendChild(gridGroup);
  }

  /**
   * Attaches mouse event listeners for tooltips.
   */
  static attachTooltip(elem, tooltip, data) {
    elem.addEventListener('mouseenter', (e) => {
      tooltip.innerHTML = `
        <div class="tooltip-title">${data.title}</div>
        ${data.group ? `<div class="tooltip-row"><span class="tooltip-metric-label">${data.group}</span></div>` : ''}
        <div class="tooltip-row">
          <span class="tooltip-metric-label">${data.metricLabel}:</span>
          <span class="tooltip-metric-val">${data.value}</span>
        </div>
      `;
      tooltip.classList.add('visible');
    });

    elem.addEventListener('mousemove', (e) => {
      const containerRect = tooltip.parentElement.getBoundingClientRect();
      const x = Math.min(Math.max(e.clientX - containerRect.left, 80), containerRect.width - 80);
      const y = Math.max(e.clientY - containerRect.top, 30);
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
    });

    elem.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });
  }

  static formatValueWithMeta(val, colName, columnsMeta) {
    const colMeta = columnsMeta.find(c => c.name === colName);
    return TypeDetector.formatValue(val, colMeta ? colMeta.type : DATA_TYPES.NUMBER);
  }

  /**
   * Exports SVG element to a downloadable PNG or SVG file.
   */
  static exportChart(container, format = 'png', filename = 'chart') {
    const svg = container.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);

    if (format === 'svg') {
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.svg`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    // Export as PNG via HTML5 Canvas
    const canvas = document.createElement('canvas');
    const bbox = svg.getBoundingClientRect();
    const scale = 2; // HiDPI 2x
    canvas.width = (bbox.width || 600) * scale;
    canvas.height = (bbox.height || 400) * scale;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-surface') || '#151d2c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `${filename}.png`;
      a.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }
}

window.ChartRenderer = ChartRenderer;
