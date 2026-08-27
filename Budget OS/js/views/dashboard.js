/**
 * BudgetOS - Dashboard View Controller
 * Presents high-signal financial overview: Net Worth, Monthly Cash Flow,
 * Savings Rate, Budget Health, Upcoming Bills, and Spending Anomalies.
 */

import state from '../state.js';
import { getIcon } from '../icons.js';
import { formatCurrency, formatPercent, formatDate, formatRelativeDate, getMonthKey, formatMonthKey } from '../formatters.js';
import { calculateAccountBalances } from '../calculations/balances.js';
import { calculateBudgetPerformance } from '../calculations/budgets.js';
import { detectSpendingAnomalies } from '../calculations/anomalies.js';
import { getMonthlyTrends } from '../calculations/analytics.js';
import { generateCashFlowForecast } from '../calculations/forecast.js';
import { renderForecastChart } from '../charts/svg-charts.js';

export function renderDashboardView(container) {
  const { accounts, transactions, budgets, categories, recurring, goals } = state;
  const currentMonthKey = getMonthKey();

  // 1. Calculations
  const balanceData = calculateAccountBalances(accounts, transactions);
  const budgetData = calculateBudgetPerformance(currentMonthKey, budgets, categories, transactions);
  const anomalies = detectSpendingAnomalies(transactions, categories);
  const monthlyTrends = getMonthlyTrends(transactions, 2);
  const currentMonthTrend = monthlyTrends[monthlyTrends.length - 1] || { income: 0, expense: 0, netSavings: 0, savingsRate: 0 };
  
  // Forecast mini preview (30 days)
  const forecastPreview = generateCashFlowForecast({
    horizonDays: 30,
    accounts,
    transactions,
    recurring,
    safeBuffer: 500
  });

  // Recent transactions (last 6)
  const recentTransactions = [...transactions]
    .sort((a, b) => (b.date > a.date ? 1 : -1))
    .slice(0, 6);

  // Upcoming bills in next 14 days
  const today = new Date().toISOString().split('T')[0];
  const upcomingBills = recurring
    .filter(r => !r.isPaused && r.type === 'expense' && r.nextDueDate >= today)
    .sort((a, b) => (a.nextDueDate > b.nextDueDate ? 1 : -1))
    .slice(0, 4);

  // Category map for quick lookup
  const catMap = {};
  categories.forEach(c => { catMap[c.id] = c; });
  const accMap = balanceData.accounts;

  // Build HTML
  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">Financial Dashboard</h1>
        <p class="view-subtitle">${formatMonthKey(currentMonthKey)} Overview &bull; Deterministic Cash Engine</p>
      </div>
      <div class="view-actions">
        <button class="btn btn-secondary" id="btn-quick-import">
          ${getIcon('upload', 'icon-sm')} Import CSV
        </button>
        <button class="btn btn-primary" id="btn-quick-transaction">
          ${getIcon('plus', 'icon-sm')} New Transaction
        </button>
      </div>
    </div>

    <!-- Anomaly Alert Banner (Heuristic Check) -->
    ${anomalies.length > 0 ? `
      <div class="anomaly-banner alert alert-warning">
        <div class="alert-icon">${getIcon('alert', 'icon-md')}</div>
        <div class="alert-content">
          <div class="alert-title">Spending Anomaly Detected (${anomalies.length})</div>
          <p class="alert-desc">${anomalies[0].confidenceNote}</p>
        </div>
        <button class="btn btn-sm btn-outline-warning" id="btn-view-anomalies">Review</button>
      </div>
    ` : ''}

    <!-- High Signal Metric Cards Grid (Prompt 10B: Restrained, Meaningful KPI Cards) -->
    <div class="metrics-grid">
      <!-- Net Worth -->
      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Net Worth</span>
          <span class="metric-icon-badge">${getIcon('shield', 'icon-sm')}</span>
        </div>
        <div class="metric-value ${balanceData.summary.netWorth >= 0 ? 'text-primary' : 'text-danger'}">
          ${formatCurrency(balanceData.summary.netWorth)}
        </div>
        <div class="metric-meta">
          <span>Assets: <strong class="text-emerald">${formatCurrency(balanceData.summary.totalAssets, { hideDecimals: true })}</strong></span>
          <span>&bull;</span>
          <span>Debt: <strong class="text-rose">${formatCurrency(balanceData.summary.totalLiabilities, { hideDecimals: true })}</strong></span>
        </div>
      </div>

      <!-- Monthly Cash Flow -->
      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Monthly Cash Flow</span>
          <span class="metric-icon-badge ${currentMonthTrend.netSavings >= 0 ? 'badge-emerald' : 'badge-rose'}">
            ${getIcon(currentMonthTrend.netSavings >= 0 ? 'trendUp' : 'trendDown', 'icon-sm')}
          </span>
        </div>
        <div class="metric-value ${currentMonthTrend.netSavings >= 0 ? 'text-emerald' : 'text-rose'}">
          ${formatCurrency(currentMonthTrend.netSavings, { showSign: true })}
        </div>
        <div class="metric-meta">
          <span>In: ${formatCurrency(currentMonthTrend.income, { hideDecimals: true })}</span>
          <span>&bull;</span>
          <span>Out: ${formatCurrency(currentMonthTrend.expense, { hideDecimals: true })}</span>
        </div>
      </div>

      <!-- Savings Rate -->
      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Savings Rate</span>
          <span class="metric-icon-badge">${getIcon('investment', 'icon-sm')}</span>
        </div>
        <div class="metric-value ${currentMonthTrend.savingsRate >= 20 ? 'text-emerald' : 'text-primary'}">
          ${formatPercent(currentMonthTrend.savingsRate)}
        </div>
        <div class="metric-meta">
          <span>Target benchmark: <strong>20.0%</strong></span>
        </div>
      </div>

      <!-- Budget Health Status -->
      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Budget Status</span>
          <span class="metric-icon-badge ${budgetData.summary.isOverBudget ? 'badge-rose' : 'badge-emerald'}">
            ${getIcon('budgets', 'icon-sm')}
          </span>
        </div>
        <div class="metric-value ${budgetData.summary.isOverBudget ? 'text-rose' : 'text-primary'}">
          ${formatPercent(budgetData.summary.overallPercentage)} Used
        </div>
        <div class="metric-meta">
          <span>${formatCurrency(budgetData.summary.overallRemaining, { hideDecimals: true })} remaining of ${formatCurrency(budgetData.summary.totalBudgeted, { hideDecimals: true })}</span>
        </div>
      </div>
    </div>

    <!-- Main Dashboard Workspace Grid -->
    <div class="dashboard-grid">
      <!-- Left Column: Forecast Timeline & Recent Transactions -->
      <div class="dashboard-main-col">
        
        <!-- 30-Day Cash Flow Projection Card -->
        <div class="card dashboard-card">
          <div class="card-header">
            <div>
              <h2 class="card-title">30-Day Cash-Flow Trajectory</h2>
              <p class="card-subtitle">Expected liquid balance progression based on recurring schedule</p>
            </div>
            <button class="btn btn-sm btn-ghost" id="btn-goto-forecast">
              Full Forecast ${getIcon('chevronRight', 'icon-xs')}
            </button>
          </div>
          <div class="card-body">
            ${renderForecastChart({
              timeline: forecastPreview.timeline,
              safeBuffer: forecastPreview.safeBuffer,
              width: 720,
              height: 220
            })}
            <div class="forecast-summary-bar">
              <div class="forecast-stat">
                <span class="stat-lbl">Starting Cash</span>
                <span class="stat-val">${formatCurrency(forecastPreview.startBalance)}</span>
              </div>
              <div class="forecast-stat">
                <span class="stat-lbl">Projected Lowest</span>
                <span class="stat-val ${forecastPreview.lowestBalance < 500 ? 'text-warning' : ''}">${formatCurrency(forecastPreview.lowestBalance)}</span>
              </div>
              <div class="forecast-stat">
                <span class="stat-lbl">Projected Ending</span>
                <span class="stat-val font-bold ${forecastPreview.endingBalance >= forecastPreview.startBalance ? 'text-emerald' : 'text-rose'}">
                  ${formatCurrency(forecastPreview.endingBalance)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Transactions Ledger Widget -->
        <div class="card dashboard-card">
          <div class="card-header">
            <div>
              <h2 class="card-title">Recent Transactions</h2>
              <p class="card-subtitle">Latest settled activity</p>
            </div>
            <button class="btn btn-sm btn-ghost" id="btn-goto-transactions">
              View All (${transactions.length}) ${getIcon('chevronRight', 'icon-xs')}
            </button>
          </div>
          <div class="card-body p-0">
            ${recentTransactions.length === 0 ? `
              <div class="empty-state p-4">
                <p>No transactions yet. Click "+ New Transaction" or import sample data.</p>
              </div>
            ` : `
              <div class="table-responsive">
                <table class="table finance-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Merchant / Payee</th>
                      <th>Category</th>
                      <th>Account</th>
                      <th class="text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${recentTransactions.map(tx => {
                      const cat = catMap[tx.categoryId] || { name: 'Other', color: '#94a3b8', icon: 'tag' };
                      const acc = accMap[tx.accountId] || { name: 'Account' };
                      const isIncome = tx.type === 'income';
                      const isTransfer = tx.type === 'transfer';
                      const amountClass = isIncome ? 'text-emerald font-semibold' : isTransfer ? 'text-primary' : 'text-primary';
                      const sign = isIncome ? '+' : isTransfer ? '' : '-';

                      return `
                        <tr class="tx-row" data-id="${tx.id}">
                          <td class="text-muted font-mono text-xs">${formatDate(tx.date, 'short')}</td>
                          <td>
                            <div class="tx-merchant font-medium">${tx.merchant || tx.description}</div>
                            ${tx.notes ? `<div class="tx-notes text-muted text-xs">${tx.notes}</div>` : ''}
                          </td>
                          <td>
                            <span class="badge badge-category" style="--cat-color: ${cat.color};">
                              ${getIcon(cat.icon, 'icon-xs')} ${cat.name}
                            </span>
                          </td>
                          <td class="text-muted text-xs">${acc.name}</td>
                          <td class="text-right ${amountClass} font-mono">
                            ${sign}${formatCurrency(tx.amount)}
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>
        </div>

      </div>

      <!-- Right Column: Budget Breakdown & Upcoming Bills -->
      <div class="dashboard-side-col">
        
        <!-- Category Budgets Health Widget -->
        <div class="card dashboard-card">
          <div class="card-header">
            <div>
              <h2 class="card-title">Top Budgets</h2>
              <p class="card-subtitle">Monthly allocations</p>
            </div>
            <button class="btn btn-sm btn-ghost" id="btn-goto-budgets">
              Manage ${getIcon('chevronRight', 'icon-xs')}
            </button>
          </div>
          <div class="card-body">
            ${budgetData.categories.length === 0 ? `
              <p class="text-muted text-sm">No category budgets created for this month.</p>
            ` : `
              <div class="budget-bars-list">
                ${budgetData.categories.slice(0, 5).map(bg => {
                  let progressColor = 'var(--accent-primary)';
                  if (bg.status === 'danger') progressColor = 'var(--accent-rose)';
                  else if (bg.status === 'warning') progressColor = 'var(--warning)';

                  return `
                    <div class="budget-mini-item">
                      <div class="budget-mini-header">
                        <span class="budget-mini-name font-medium text-sm">${bg.categoryName}</span>
                        <span class="budget-mini-values text-xs font-mono">
                          <strong>${formatCurrency(bg.spent, { hideDecimals: true })}</strong> / ${formatCurrency(bg.budgeted, { hideDecimals: true })}
                        </span>
                      </div>
                      <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${Math.min(100, bg.percentage)}%; background-color: ${progressColor};"></div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>
        </div>

        <!-- Upcoming Bills & Recurring Widget -->
        <div class="card dashboard-card">
          <div class="card-header">
            <div>
              <h2 class="card-title">Upcoming Bills</h2>
              <p class="card-subtitle">Scheduled within 14 days</p>
            </div>
            <button class="btn btn-sm btn-ghost" id="btn-goto-recurring">
              All Bills ${getIcon('chevronRight', 'icon-xs')}
            </button>
          </div>
          <div class="card-body p-0">
            ${upcomingBills.length === 0 ? `
              <div class="p-4 text-muted text-sm">No upcoming bills in the next 14 days.</div>
            ` : `
              <div class="bills-list">
                ${upcomingBills.map(bill => {
                  const cat = catMap[bill.categoryId] || { name: 'Bill', color: '#94a3b8', icon: 'tag' };
                  return `
                    <div class="bill-item">
                      <div class="bill-icon-box" style="background-color: ${cat.color}20; color: ${cat.color};">
                        ${getIcon(cat.icon, 'icon-sm')}
                      </div>
                      <div class="bill-info">
                        <div class="bill-name font-medium text-sm">${bill.name}</div>
                        <div class="bill-due text-muted text-xs">Due ${formatRelativeDate(bill.nextDueDate)}</div>
                      </div>
                      <div class="bill-amount font-mono text-sm font-semibold text-rose">
                        -${formatCurrency(bill.amount)}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>
        </div>

      </div>
    </div>
  `;

  // Attach event listeners
  container.querySelector('#btn-quick-transaction')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('OPEN_TRANSACTION_MODAL'));
  });

  container.querySelector('#btn-quick-import')?.addEventListener('click', () => {
    state.activeView = 'data-hub';
    state.notify('VIEW_CHANGED');
  });

  container.querySelector('#btn-goto-forecast')?.addEventListener('click', () => {
    state.activeView = 'forecast';
    state.notify('VIEW_CHANGED');
  });

  container.querySelector('#btn-goto-transactions')?.addEventListener('click', () => {
    state.activeView = 'transactions';
    state.notify('VIEW_CHANGED');
  });

  container.querySelector('#btn-goto-budgets')?.addEventListener('click', () => {
    state.activeView = 'budgets';
    state.notify('VIEW_CHANGED');
  });

  container.querySelector('#btn-goto-recurring')?.addEventListener('click', () => {
    state.activeView = 'recurring';
    state.notify('VIEW_CHANGED');
  });

  container.querySelector('#btn-view-anomalies')?.addEventListener('click', () => {
    state.activeView = 'reports';
    state.notify('VIEW_CHANGED');
  });
}
