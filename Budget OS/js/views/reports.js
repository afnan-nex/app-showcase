/**
 * BudgetOS - Reports & Analytics View Controller
 * Comprehensive category breakdowns, monthly income/expense trends,
 * savings rate trajectories, top merchant stats, and printable statement generator.
 */

import state from '../state.js';
import { getIcon } from '../icons.js';
import { formatCurrency, formatPercent, getMonthKey, formatMonthKey, formatDate } from '../formatters.js';
import { getCategorySpendingBreakdown, getMonthlyTrends, getTopMerchants } from '../calculations/analytics.js';
import { detectSpendingAnomalies } from '../calculations/anomalies.js';
import { calculateAccountBalances } from '../calculations/balances.js';
import { renderDonutChart, renderMonthlyTrendBars, attachDonutChartInteractivity } from '../charts/svg-charts.js';

let reportPeriod = 'thisMonth'; // 'thisMonth', 'all'

export function renderReportsView(container) {
  const { transactions, categories, accounts } = state;
  const currentMonthKey = getMonthKey();
  const filterMonth = reportPeriod === 'thisMonth' ? currentMonthKey : null;

  const categoryBreakdown = getCategorySpendingBreakdown(transactions, categories, filterMonth);
  const monthlyTrends = getMonthlyTrends(transactions, 6);
  const topMerchants = getTopMerchants(transactions, 5, filterMonth);
  const anomalies = detectSpendingAnomalies(transactions, categories);
  const balanceData = calculateAccountBalances(accounts, transactions);

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">Financial Reports & Trends</h1>
        <p class="view-subtitle">Spending patterns, category allocations, and historical cash-flow velocity</p>
      </div>
      <div class="view-actions">
        <!-- Period Toggle -->
        <div class="segmented-control" id="report-period-tabs">
          <button class="segment-btn ${reportPeriod === 'thisMonth' ? 'active' : ''}" data-period="thisMonth">
            This Month (${formatMonthKey(currentMonthKey)})
          </button>
          <button class="segment-btn ${reportPeriod === 'all' ? 'active' : ''}" data-period="all">
            All Time
          </button>
        </div>

        <button class="btn btn-secondary" id="btn-print-report">
          ${getIcon('printer', 'icon-sm')} Print Statement
        </button>
      </div>
    </div>

    <!-- Reports Grid: Donut + Monthly Bars -->
    <div class="reports-main-grid">
      
      <!-- Category Spending Donut Chart Card -->
      <div class="card report-chart-card">
        <div class="card-header">
          <div>
            <h2 class="card-title">Spending by Category</h2>
            <p class="card-subtitle">Total: <strong class="text-rose font-mono">${formatCurrency(categoryBreakdown.totalExpense)}</strong></p>
          </div>
        </div>
        <div class="card-body">
          <div class="donut-and-legend-layout">
            <div class="donut-visual-col">
              ${renderDonutChart({
                data: categoryBreakdown.items,
                size: 210,
                strokeWidth: 26,
                centerTitle: 'Total Spent',
                centerValue: formatCurrency(categoryBreakdown.totalExpense, { hideDecimals: true })
              })}
            </div>
            <div class="category-legend-col">
              <div class="category-legend-list">
                ${categoryBreakdown.items.slice(0, 6).map(item => `
                  <div class="legend-row">
                    <div class="legend-meta">
                      <span class="cat-color-dot" style="background-color: ${item.color || '#3b82f6'};"></span>
                      <span class="legend-cat-name font-medium text-xs text-primary">${item.name}</span>
                    </div>
                    <div class="legend-values text-xs font-mono">
                      <strong>${formatCurrency(item.amount)}</strong>
                      <span class="text-muted">(${item.percentage}%)</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Trends Grouped Bar Chart -->
      <div class="card report-chart-card">
        <div class="card-header">
          <div>
            <h2 class="card-title">Income vs Expenses (Last 6 Months)</h2>
            <p class="card-subtitle">Historical cash-flow trajectory</p>
          </div>
        </div>
        <div class="card-body">
          ${renderMonthlyTrendBars({
            trendData: monthlyTrends,
            width: 540,
            height: 220
          })}
        </div>
      </div>

    </div>

    <!-- Second Row: Monthly Trends Table & Top Merchants -->
    <div class="reports-secondary-grid mt-6">
      
      <!-- Monthly Trend Breakdown Table -->
      <div class="card report-table-card">
        <div class="card-header">
          <h2 class="card-title">Historical Monthly Performance</h2>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table finance-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th class="text-right">Income</th>
                  <th class="text-right">Expenses</th>
                  <th class="text-right">Net Savings</th>
                  <th class="text-right">Savings Rate</th>
                </tr>
              </thead>
              <tbody>
                ${monthlyTrends.map(m => `
                  <tr>
                    <td class="font-medium text-primary">${m.label}</td>
                    <td class="text-right font-mono text-emerald">${formatCurrency(m.income)}</td>
                    <td class="text-right font-mono text-rose">${formatCurrency(m.expense)}</td>
                    <td class="text-right font-mono font-semibold ${m.netSavings >= 0 ? 'text-emerald' : 'text-rose'}">
                      ${formatCurrency(m.netSavings, { showSign: true })}
                    </td>
                    <td class="text-right font-mono ${m.savingsRate >= 20 ? 'text-emerald font-semibold' : 'text-primary'}">
                      ${formatPercent(m.savingsRate)}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Top Merchants Leaderboard -->
      <div class="card report-merchants-card">
        <div class="card-header">
          <h2 class="card-title">Top Merchant Outflows</h2>
          <span class="text-xs text-muted">Highest expense destinations</span>
        </div>
        <div class="card-body p-0">
          ${topMerchants.length === 0 ? `
            <div class="p-4 text-muted text-sm">No expenses recorded.</div>
          ` : `
            <div class="merchants-list">
              ${topMerchants.map((m, idx) => `
                <div class="merchant-rank-row">
                  <span class="merchant-rank-num font-mono text-muted text-xs">#${idx + 1}</span>
                  <div class="merchant-rank-info">
                    <span class="merchant-rank-name font-medium text-primary">${m.name}</span>
                    <span class="merchant-rank-count text-muted text-xs">${m.count} transactions</span>
                  </div>
                  <span class="merchant-rank-amt font-mono text-rose font-semibold">${formatCurrency(m.total)}</span>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>

    </div>

    <!-- Anomaly Review Section -->
    ${anomalies.length > 0 ? `
      <div class="card anomalies-report-card mt-6">
        <div class="card-header">
          <h2 class="card-title">${getIcon('alert', 'icon-sm')} Detected Spending Outliers (${anomalies.length})</h2>
          <p class="card-subtitle">Statistical outlier heuristic flags for your review</p>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table finance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Merchant / Item</th>
                  <th>Category</th>
                  <th class="text-right">Amount</th>
                  <th>Category Average</th>
                  <th>Anomaly Factor</th>
                </tr>
              </thead>
              <tbody>
                ${anomalies.map(a => `
                  <tr>
                    <td class="font-mono text-xs text-muted">${formatDate(a.date, 'medium')}</td>
                    <td class="font-medium text-primary">${a.merchant || a.description}</td>
                    <td>
                      <span class="badge badge-category" style="--cat-color: ${a.categoryColor};">
                        ${a.categoryName}
                      </span>
                    </td>
                    <td class="text-right font-mono font-bold text-rose">${formatCurrency(a.amount)}</td>
                    <td class="font-mono text-muted">${formatCurrency(a.categoryAverage)}</td>
                    <td>
                      <span class="badge badge-warning font-mono">
                        ${a.ratioMultiplier}x normal
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ` : ''}

    <!-- Hidden Print Container Formatted for Boardroom Statement -->
    <div id="print-statement-section" class="print-only">
      <div class="print-statement-header">
        <div class="print-brand">
          <h1>BudgetOS Financial Statement</h1>
          <p>Generated: ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}</p>
        </div>
        <div class="print-net-worth">
          <span class="print-lbl">Net Worth</span>
          <h2>${formatCurrency(balanceData.summary.netWorth)}</h2>
        </div>
      </div>

      <div class="print-accounts-grid">
        <h3>Accounts Summary</h3>
        <table class="print-table">
          <thead>
            <tr><th>Account</th><th>Type</th><th class="text-right">Balance</th></tr>
          </thead>
          <tbody>
            ${Object.values(balanceData.accounts).map(a => `
              <tr>
                <td>${a.name}</td>
                <td>${a.type.toUpperCase()}</td>
                <td class="text-right font-mono">${formatCurrency(a.currentBalance)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="print-trends-section mt-4">
        <h3>Monthly Performance (6 Months)</h3>
        <table class="print-table">
          <thead>
            <tr><th>Month</th><th class="text-right">Income</th><th class="text-right">Expenses</th><th class="text-right">Net Savings</th><th class="text-right">Savings Rate</th></tr>
          </thead>
          <tbody>
            ${monthlyTrends.map(m => `
              <tr>
                <td>${m.label}</td>
                <td class="text-right font-mono">${formatCurrency(m.income)}</td>
                <td class="text-right font-mono">${formatCurrency(m.expense)}</td>
                <td class="text-right font-mono font-bold">${formatCurrency(m.netSavings)}</td>
                <td class="text-right font-mono">${formatPercent(m.savingsRate)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Attach Donut interactive hover handlers
  attachDonutChartInteractivity(container);

  // Attach Handlers
  container.querySelectorAll('#report-period-tabs .segment-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      reportPeriod = btn.dataset.period;
      renderReportsView(container);
    });
  });

  container.querySelector('#btn-print-report')?.addEventListener('click', () => {
    window.print();
  });
}
