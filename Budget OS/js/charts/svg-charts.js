/**
 * BudgetOS - Pure Vanilla SVG Charting Engine
 * High-performance, accessible, responsive SVG chart generators with zero external dependencies.
 */

import { formatCurrency, formatCompactCurrency, formatDate } from '../formatters.js';

/**
 * Generate an interactive SVG Donut Chart
 * @param {Object} options
 * @param {Array} options.data - [{ name, amount, percentage, color }]
 * @param {number} [options.size=240]
 * @param {number} [options.strokeWidth=32]
 * @param {string} [options.centerTitle='Total']
 * @param {string} [options.centerValue='']
 * @returns {string} SVG HTML string
 */
export function renderDonutChart({
  data = [],
  size = 220,
  strokeWidth = 28,
  centerTitle = 'Total',
  centerValue = ''
}) {
  if (!data || data.length === 0) {
    return `<div class="chart-empty-state"><p>No spending data available</p></div>`;
  }

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let accumulatedPercent = 0;
  const paths = data.map((item, idx) => {
    if (item.percentage <= 0) return '';
    const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += item.percentage;

    return `
      <circle
        cx="${center}"
        cy="${center}"
        r="${radius}"
        fill="transparent"
        stroke="${item.color || '#3b82f6'}"
        stroke-width="${strokeWidth}"
        stroke-dasharray="${strokeDasharray}"
        stroke-dashoffset="${strokeDashoffset}"
        stroke-linecap="butt"
        class="donut-segment"
        data-name="${item.name}"
        data-amount="${formatCurrency(item.amount)}"
        data-percent="${item.percentage}%"
        style="transition: stroke-width 0.2s ease, opacity 0.2s ease; cursor: pointer;"
      >
        <title>${item.name}: ${formatCurrency(item.amount)} (${item.percentage}%)</title>
      </circle>
    `;
  }).join('');

  return `
    <div class="donut-chart-container" style="position: relative; width: ${size}px; height: ${size}px; margin: 0 auto;">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform: rotate(-90deg); overflow: visible;">
        <circle cx="${center}" cy="${center}" r="${radius}" fill="transparent" stroke="var(--border-subtle)" stroke-width="${strokeWidth}" />
        ${paths}
      </svg>
      <div class="donut-center-info" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; text-align: center;">
        <span class="donut-center-label" style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">${centerTitle}</span>
        <span class="donut-center-val" style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary); font-variant-numeric: tabular-nums;">${centerValue}</span>
      </div>
    </div>
  `;
}

/**
 * Generate a responsive SVG Area/Line Cash-Flow Forecast Chart
 * @param {Object} options
 * @param {Array} options.timeline - [{ date, balance, income, expense, isBelowBuffer }]
 * @param {number} [options.safeBuffer=500]
 * @param {number} [options.width=700]
 * @param {number} [options.height=260]
 * @returns {string} SVG HTML string with interactive data attributes
 */
export function renderForecastChart({
  timeline = [],
  safeBuffer = 500,
  width = 800,
  height = 260
}) {
  if (!timeline || timeline.length === 0) {
    return `<div class="chart-empty-state"><p>No forecast data available</p></div>`;
  }

  const padding = { top: 25, right: 30, bottom: 40, left: 65 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const balances = timeline.map(t => t.balance);
  let minVal = Math.min(...balances, safeBuffer, 0);
  let maxVal = Math.max(...balances, safeBuffer * 1.5);
  
  // Pad bounds
  const range = maxVal - minVal || 1;
  minVal = Math.floor(minVal - range * 0.05);
  maxVal = Math.ceil(maxVal + range * 0.05);

  const getX = (index) => padding.left + (index / (timeline.length - 1)) * chartW;
  const getY = (val) => padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

  // Build points path
  const points = timeline.map((pt, idx) => `${getX(idx)},${getY(pt.balance)}`);
  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${getX(timeline.length - 1)},${getY(minVal)} L ${getX(0)},${getY(minVal)} Z`;

  // Safe buffer line
  const bufferY = getY(safeBuffer);

  // Y Axis ticks (4 ticks)
  const yTicks = [0, 0.33, 0.66, 1].map(ratio => {
    const val = minVal + ratio * (maxVal - minVal);
    return {
      val,
      y: getY(val),
      label: formatCompactCurrency(val)
    };
  });

  // X Axis ticks (5 evenly spaced date labels)
  const xTickIndices = [
    0,
    Math.floor(timeline.length * 0.25),
    Math.floor(timeline.length * 0.5),
    Math.floor(timeline.length * 0.75),
    timeline.length - 1
  ];
  const xTicks = xTickIndices.map(idx => ({
    x: getX(idx),
    label: formatDate(timeline[idx].date, 'short')
  }));

  // Unique ID for gradients
  const gradId = 'forecast_grad_' + Math.random().toString(36).substr(2, 5);

  return `
    <div class="svg-chart-wrapper forecast-chart-wrapper" style="width: 100%; overflow-x: auto;">
      <svg viewBox="0 0 ${width} ${height}" class="forecast-svg" style="width: 100%; height: auto; display: block;" data-points='${JSON.stringify(timeline.map((t, i) => ({ x: getX(i), y: getY(t.balance), date: t.date, balance: t.balance, formattedBalance: formatCurrency(t.balance), events: t.events })))}'>
        <defs>
          <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--accent-primary, #3b82f6)" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="var(--accent-primary, #3b82f6)" stop-opacity="0.0"/>
          </linearGradient>
        </defs>

        <!-- Horizontal Gridlines & Y Axis Labels -->
        ${yTicks.map(t => `
          <line x1="${padding.left}" y1="${t.y}" x2="${width - padding.right}" y2="${t.y}" stroke="var(--border-subtle)" stroke-dasharray="3 3" />
          <text x="${padding.left - 10}" y="${t.y + 4}" fill="var(--text-muted)" font-size="11" text-anchor="end" font-family="monospace">${t.label}</text>
        `).join('')}

        <!-- Safe Buffer Guideline -->
        ${safeBuffer >= minVal && safeBuffer <= maxVal ? `
          <line x1="${padding.left}" y1="${bufferY}" x2="${width - padding.right}" y2="${bufferY}" stroke="var(--warning, #f59e0b)" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.8" />
          <text x="${width - padding.right - 5}" y="${bufferY - 6}" fill="var(--warning, #f59e0b)" font-size="10" text-anchor="end" font-weight="600">Safe Buffer (${formatCurrency(safeBuffer, { hideDecimals: true })})</text>
        ` : ''}

        <!-- Area Fill -->
        <path d="${areaD}" fill="url(#${gradId})" />

        <!-- Line Stroke -->
        <path d="${pathD}" fill="none" stroke="var(--accent-primary, #3b82f6)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

        <!-- X Axis Labels -->
        ${xTicks.map(t => `
          <text x="${t.x}" y="${height - 12}" fill="var(--text-muted)" font-size="11" text-anchor="middle">${t.label}</text>
        `).join('')}

        <!-- Interactive Crosshair overlay elements (controlled via JS) -->
        <g class="chart-crosshair-group" style="display: none;">
          <line class="crosshair-line" x1="0" y1="${padding.top}" x2="0" y2="${height - padding.bottom}" stroke="var(--text-secondary)" stroke-width="1" stroke-dasharray="2 2" />
          <circle class="crosshair-dot" cx="0" cy="0" r="5" fill="var(--accent-primary)" stroke="var(--bg-surface)" stroke-width="2" />
        </g>
      </svg>
      <div class="forecast-tooltip" style="display: none; position: absolute; pointer-events: none; z-index: 10;"></div>
    </div>
  `;
}

/**
 * Generate Scenario Comparison Dual-Line Chart (Baseline vs Scenario)
 */
export function renderScenarioComparisonChart({
  baselineTimeline = [],
  simulatedTimeline = [],
  width = 800,
  height = 280
}) {
  if (!baselineTimeline.length || !simulatedTimeline.length) {
    return `<div class="chart-empty-state"><p>No simulation data</p></div>`;
  }

  const padding = { top: 25, right: 30, bottom: 40, left: 65 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const allBalances = [
    ...baselineTimeline.map(t => t.balance),
    ...simulatedTimeline.map(t => t.balance)
  ];

  let minVal = Math.min(...allBalances, 0);
  let maxVal = Math.max(...allBalances);
  const range = maxVal - minVal || 1;
  minVal = Math.floor(minVal - range * 0.05);
  maxVal = Math.ceil(maxVal + range * 0.05);

  const getX = (index) => padding.left + (index / (baselineTimeline.length - 1)) * chartW;
  const getY = (val) => padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

  const basePoints = baselineTimeline.map((pt, idx) => `${getX(idx)},${getY(pt.balance)}`);
  const simPoints = simulatedTimeline.map((pt, idx) => `${getX(idx)},${getY(pt.balance)}`);

  const baseLineD = `M ${basePoints.join(' L ')}`;
  const simLineD = `M ${simPoints.join(' L ')}`;

  const yTicks = [0, 0.33, 0.66, 1].map(ratio => {
    const val = minVal + ratio * (maxVal - minVal);
    return { val, y: getY(val), label: formatCompactCurrency(val) };
  });

  const xTickIndices = [0, Math.floor(baselineTimeline.length * 0.5), baselineTimeline.length - 1];
  const xTicks = xTickIndices.map(idx => ({
    x: getX(idx),
    label: formatDate(baselineTimeline[idx].date, 'short')
  }));

  return `
    <div class="svg-chart-wrapper scenario-chart-wrapper" style="width: 100%; position: relative;">
      <div class="chart-legend-row" style="display: flex; gap: 16px; margin-bottom: 8px; font-size: 0.85rem;">
        <span style="display: inline-flex; align-items: center; gap: 6px;">
          <span style="width: 14px; height: 3px; background: var(--text-muted); border-radius: 2px;"></span>
          <span style="color: var(--text-secondary);">Current Plan (Baseline)</span>
        </span>
        <span style="display: inline-flex; align-items: center; gap: 6px;">
          <span style="width: 14px; height: 3px; background: var(--accent-emerald, #10b981); border-radius: 2px;"></span>
          <span style="color: var(--text-primary); font-weight: 600;">Simulated Scenario</span>
        </span>
      </div>

      <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: auto; display: block;">
        <!-- Gridlines -->
        ${yTicks.map(t => `
          <line x1="${padding.left}" y1="${t.y}" x2="${width - padding.right}" y2="${t.y}" stroke="var(--border-subtle)" stroke-dasharray="3 3" />
          <text x="${padding.left - 10}" y="${t.y + 4}" fill="var(--text-muted)" font-size="11" text-anchor="end">${t.label}</text>
        `).join('')}

        <!-- Baseline Path (Dashed/Subtle) -->
        <path d="${baseLineD}" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-dasharray="4 3" opacity="0.8" />

        <!-- Scenario Path (Vibrant Emerald) -->
        <path d="${simLineD}" fill="none" stroke="var(--accent-emerald, #10b981)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

        <!-- X Ticks -->
        ${xTicks.map(t => `
          <text x="${t.x}" y="${height - 12}" fill="var(--text-muted)" font-size="11" text-anchor="middle">${t.label}</text>
        `).join('')}
      </svg>
    </div>
  `;
}

/**
 * Generate Grouped Bar Chart for Monthly Income vs Expense
 */
export function renderMonthlyTrendBars({
  trendData = [],
  width = 600,
  height = 220
}) {
  if (!trendData.length) {
    return `<div class="chart-empty-state"><p>No historical trend data</p></div>`;
  }

  const padding = { top: 20, right: 20, bottom: 35, left: 55 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(...trendData.map(d => Math.max(d.income, d.expense)), 1000) * 1.1;
  const getH = (val) => (val / maxVal) * chartH;

  const groupWidth = chartW / trendData.length;
  const barWidth = Math.min(22, (groupWidth - 12) / 2);

  const bars = trendData.map((d, idx) => {
    const groupX = padding.left + idx * groupWidth;
    const incomeH = getH(d.income);
    const expenseH = getH(d.expense);

    const incX = groupX + (groupWidth / 2) - barWidth - 2;
    const expX = groupX + (groupWidth / 2) + 2;

    const incY = padding.top + chartH - incomeH;
    const expY = padding.top + chartH - expenseH;

    return `
      <g class="bar-group" data-month="${d.label}">
        <!-- Income Bar -->
        <rect x="${incX}" y="${incY}" width="${barWidth}" height="${incomeH}" rx="3" fill="var(--accent-emerald, #10b981)">
          <title>${d.label} Income: ${formatCurrency(d.income)}</title>
        </rect>
        <!-- Expense Bar -->
        <rect x="${expX}" y="${expY}" width="${barWidth}" height="${expenseH}" rx="3" fill="var(--accent-rose, #f43f5e)">
          <title>${d.label} Spending: ${formatCurrency(d.expense)}</title>
        </rect>
        <!-- X Axis Label -->
        <text x="${groupX + groupWidth / 2}" y="${height - 12}" fill="var(--text-muted)" font-size="11" text-anchor="middle">${d.shortLabel}</text>
      </g>
    `;
  }).join('');

  return `
    <div class="svg-chart-wrapper monthly-bars-wrapper" style="width: 100%;">
      <div class="chart-legend-row" style="display: flex; gap: 16px; margin-bottom: 8px; font-size: 0.85rem;">
        <span style="display: inline-flex; align-items: center; gap: 6px;">
          <span style="width: 10px; height: 10px; background: var(--accent-emerald, #10b981); border-radius: 2px;"></span>
          <span style="color: var(--text-secondary);">Income</span>
        </span>
        <span style="display: inline-flex; align-items: center; gap: 6px;">
          <span style="width: 10px; height: 10px; background: var(--accent-rose, #f43f5e); border-radius: 2px;"></span>
          <span style="color: var(--text-secondary);">Expenses</span>
        </span>
      </div>

      <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: auto; display: block;">
        <line x1="${padding.left}" y1="${padding.top + chartH}" x2="${width - padding.right}" y2="${padding.top + chartH}" stroke="var(--border-subtle)" />
        ${bars}
      </svg>
    </div>
  `;
}

/**
 * Generate a Circular Goal Progress Ring
 */
export function renderGoalProgressRing({
  percentage = 0,
  size = 56,
  strokeWidth = 5,
  color = '#10b981'
}) {
  const clamped = Math.min(100, Math.max(0, percentage));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const center = size / 2;

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform: rotate(-90deg);">
      <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="var(--border-subtle)" stroke-width="${strokeWidth}" />
      <circle
        cx="${center}"
        cy="${center}"
        r="${radius}"
        fill="none"
        stroke="${color}"
        stroke-width="${strokeWidth}"
        stroke-dasharray="${circumference}"
        stroke-dashoffset="${offset}"
        stroke-linecap="round"
        style="transition: stroke-dashoffset 0.4s ease;"
      />
    </svg>
  `;
}
