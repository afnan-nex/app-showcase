/**
 * BudgetOS - Cash-Flow Forecast View Controller
 * Full timeline simulation, time horizon picker, safe buffer warning alerts,
 * interactive SVG trajectory graph, and scheduled cash flow events.
 */

import state from '../state.js';
import { getIcon } from '../icons.js';
import { formatCurrency, formatDate } from '../formatters.js';
import { generateCashFlowForecast } from '../calculations/forecast.js';
import { renderForecastChart, attachForecastChartInteractivity } from '../charts/svg-charts.js';

let forecastHorizon = 90;
let safeBufferSetting = 500;
let includeDiscretionarySetting = false;

export function renderForecastView(container) {
  const { accounts, transactions, recurring, categories } = state;
  const catMap = {};
  categories.forEach(c => { catMap[c.id] = c; });

  const forecast = generateCashFlowForecast({
    horizonDays: forecastHorizon,
    accounts,
    transactions,
    recurring,
    safeBuffer: safeBufferSetting,
    includeDiscretionary: includeDiscretionarySetting
  });

  // Extract scheduled event dates
  const scheduledDays = forecast.timeline.filter(t => t.events && t.events.length > 0);

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">Cash-Flow Forecast</h1>
        <p class="view-subtitle">Simulated liquid account balance timeline from ${formatDate(forecast.startDate, 'medium')} to ${formatDate(forecast.endDate, 'medium')}</p>
      </div>
      <div class="view-actions">
        <!-- Horizon Selector -->
        <div class="segmented-control" id="forecast-horizon-tabs">
          <button class="segment-btn ${forecastHorizon === 30 ? 'active' : ''}" data-horizon="30">30D</button>
          <button class="segment-btn ${forecastHorizon === 60 ? 'active' : ''}" data-horizon="60">60D</button>
          <button class="segment-btn ${forecastHorizon === 90 ? 'active' : ''}" data-horizon="90">90D</button>
          <button class="segment-btn ${forecastHorizon === 180 ? 'active' : ''}" data-horizon="180">180D</button>
          <button class="segment-btn ${forecastHorizon === 365 ? 'active' : ''}" data-horizon="365">1 Year</button>
        </div>
      </div>
    </div>

    <!-- Threshold Alert Banner if cash dips below safe buffer -->
    ${forecast.lowestBalance < safeBufferSetting ? `
      <div class="alert alert-warning mb-6">
        <div class="alert-icon">${getIcon('alert', 'icon-md')}</div>
        <div class="alert-content">
          <div class="alert-title">Low Cash-Flow Buffer Warning</div>
          <p class="alert-desc">
            Your projected liquid balance drops to <strong>${formatCurrency(forecast.lowestBalance)}</strong> on ${formatDate(forecast.lowestBalanceDate, 'medium')}, which is below your safe reserve buffer of ${formatCurrency(safeBufferSetting)}.
          </p>
        </div>
      </div>
    ` : ''}

    <!-- Forecast Scorecard Grid -->
    <div class="metrics-grid">
      <div class="metric-card">
        <span class="metric-label">Current Liquid Cash</span>
        <div class="metric-value text-primary">${formatCurrency(forecast.startBalance)}</div>
        <div class="metric-meta"><span>Checking + Savings + Cash</span></div>
      </div>
      <div class="metric-card">
        <span class="metric-label">Projected Ending Balance</span>
        <div class="metric-value font-bold ${forecast.endingBalance >= forecast.startBalance ? 'text-emerald' : 'text-rose'}">
          ${formatCurrency(forecast.endingBalance)}
        </div>
        <div class="metric-meta">
          <span>Net change: <strong class="${forecast.netChange >= 0 ? 'text-emerald' : 'text-rose'}">${formatCurrency(forecast.netChange, { showSign: true })}</strong></span>
        </div>
      </div>
      <div class="metric-card">
        <span class="metric-label">Lowest Projected Point</span>
        <div class="metric-value ${forecast.lowestBalance < safeBufferSetting ? 'text-warning' : 'text-primary'}">
          ${formatCurrency(forecast.lowestBalance)}
        </div>
        <div class="metric-meta"><span>Occurs on ${formatDate(forecast.lowestBalanceDate, 'short')}</span></div>
      </div>
      <div class="metric-card">
        <span class="metric-label">Projected Net Flow</span>
        <div class="metric-value text-primary font-mono">
          In: <span class="text-emerald">${formatCurrency(forecast.totalProjectedIncome, { hideDecimals: true })}</span>
        </div>
        <div class="metric-meta">
          <span>Out: <span class="text-rose">${formatCurrency(forecast.totalProjectedExpense, { hideDecimals: true })}</span></span>
        </div>
      </div>
    </div>

    <!-- Main Chart Card -->
    <div class="card forecast-main-chart-card mt-6">
      <div class="card-header">
        <div>
          <h2 class="card-title">Projected Balance Timeline</h2>
          <p class="card-subtitle">Deterministic balance evolution factoring in recurring transactions</p>
        </div>
        <div class="forecast-settings-inline">
          <label class="toggle-label text-xs">
            <input type="checkbox" id="toggle-discretionary" ${includeDiscretionarySetting ? 'checked' : ''} />
            Include Discretionary Spending Trend
          </label>
        </div>
      </div>
      <div class="card-body">
        ${renderForecastChart({
          timeline: forecast.timeline,
          safeBuffer: safeBufferSetting,
          width: 800,
          height: 280
        })}
      </div>
    </div>

    <!-- Scheduled Cash Flow Events Feed -->
    <div class="card scheduled-events-card mt-6">
      <div class="card-header">
        <h2 class="card-title">Scheduled Timeline Inflows & Outflows</h2>
        <span class="text-muted text-xs">${scheduledDays.length} transaction dates in horizon</span>
      </div>
      <div class="card-body p-0">
        ${scheduledDays.length === 0 ? `
          <div class="p-5 text-muted text-center">No recurring events scheduled in this period.</div>
        ` : `
          <div class="table-responsive">
            <table class="table finance-table">
              <thead>
                <tr>
                  <th>Scheduled Date</th>
                  <th>Event Name / Rule</th>
                  <th>Category</th>
                  <th>Frequency</th>
                  <th class="text-right">Projected Amount</th>
                  <th class="text-right">Balance After Event</th>
                </tr>
              </thead>
              <tbody>
                ${scheduledDays.slice(0, 15).map(day => {
                  return day.events.map(evt => {
                    const cat = catMap[evt.categoryId] || { name: 'Scheduled', color: '#94a3b8', icon: 'tag' };
                    const isIncome = evt.type === 'income';
                    return `
                      <tr>
                        <td class="font-mono text-xs text-muted">${formatDate(day.date, 'medium')}</td>
                        <td class="font-medium text-primary">${evt.name}</td>
                        <td>
                          <span class="badge badge-category" style="--cat-color: ${cat.color};">
                            ${getIcon(cat.icon, 'icon-xs')} ${cat.name}
                          </span>
                        </td>
                        <td><span class="badge badge-secondary text-xs uppercase">${evt.frequency}</span></td>
                        <td class="text-right font-mono font-semibold ${isIncome ? 'text-emerald' : 'text-rose'}">
                          ${isIncome ? '+' : '-'}${formatCurrency(evt.amount)}
                        </td>
                        <td class="text-right font-mono text-primary">${formatCurrency(day.balance)}</td>
                      </tr>
                    `;
                  }).join('');
                }).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    </div>
  `;

  // Attach interactive SVG forecast chart tooltips
  attachForecastChartInteractivity(container);

  // Attach Handlers
  container.querySelectorAll('#forecast-horizon-tabs .segment-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      forecastHorizon = parseInt(btn.dataset.horizon, 10);
      renderForecastView(container);
    });
  });

  container.querySelector('#toggle-discretionary')?.addEventListener('change', (e) => {
    includeDiscretionarySetting = e.target.checked;
    renderForecastView(container);
  });
}
