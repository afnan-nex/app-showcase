/**
 * BudgetOS - Budgets View Controller
 * Manage category monthly budgets, monitor progress, analyze rollovers, and set warning thresholds.
 */

import state from '../state.js';
import { getIcon } from '../icons.js';
import { formatCurrency, formatPercent, getMonthKey, formatMonthKey, addMonths } from '../formatters.js';
import { calculateBudgetPerformance } from '../calculations/budgets.js';

let selectedMonth = getMonthKey();

export function renderBudgetsView(container) {
  const { budgets, categories, transactions } = state;
  const budgetData = calculateBudgetPerformance(selectedMonth, budgets, categories, transactions);
  const previousMonthKey = getMonthKey(addMonths(selectedMonth + '-01', -1));
  const hasPreviousBudgets = budgets.some(b => b.monthKey === previousMonthKey);

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">Monthly Budgets</h1>
        <p class="view-subtitle">Allocations and real-time spending for <strong>${formatMonthKey(selectedMonth)}</strong></p>
      </div>
      <div class="view-actions">
        <!-- Month Navigation -->
        <div class="month-selector-group">
          <button class="btn btn-sm btn-secondary" id="btn-prev-month" title="Previous Month">
            ${getIcon('arrowLeft', 'icon-xs')}
          </button>
          <span class="month-label font-medium">${formatMonthKey(selectedMonth)}</span>
          <button class="btn btn-sm btn-secondary" id="btn-next-month" title="Next Month">
            ${getIcon('arrowRight', 'icon-xs')}
          </button>
        </div>

        ${hasPreviousBudgets && budgetData.categories.filter(c => c.isBudgetSet).length === 0 ? `
          <button class="btn btn-secondary" id="btn-copy-prev-budgets">
            ${getIcon('copy', 'icon-sm')} Copy from Last Month
          </button>
        ` : ''}

        <button class="btn btn-primary" id="btn-add-budget">
          ${getIcon('plus', 'icon-sm')} Set Category Budget
        </button>
      </div>
    </div>

    <!-- Monthly Budget Summary Card -->
    <div class="card budget-summary-card">
      <div class="budget-kpi-row">
        <div class="kpi-block">
          <span class="kpi-lbl">Total Budgeted</span>
          <span class="kpi-val text-primary font-bold">${formatCurrency(budgetData.summary.totalBudgeted)}</span>
        </div>
        <div class="kpi-divider"></div>
        <div class="kpi-block">
          <span class="kpi-lbl">Total Spent</span>
          <span class="kpi-val ${budgetData.summary.isOverBudget ? 'text-rose' : 'text-primary'} font-bold">
            ${formatCurrency(budgetData.summary.totalSpent)}
          </span>
        </div>
        <div class="kpi-divider"></div>
        <div class="kpi-block">
          <span class="kpi-lbl">Remaining Available</span>
          <span class="kpi-val text-emerald font-bold">${formatCurrency(budgetData.summary.overallRemaining)}</span>
        </div>
        <div class="kpi-divider"></div>
        <div class="kpi-block">
          <span class="kpi-lbl">Overall Usage</span>
          <span class="kpi-val ${budgetData.summary.isOverBudget ? 'text-rose' : 'text-primary'} font-mono">
            ${formatPercent(budgetData.summary.overallPercentage)}
          </span>
        </div>
      </div>

      <!-- Large Master Progress Bar -->
      <div class="progress-bar-bg mt-4" style="height: 10px;">
        <div
          class="progress-bar-fill"
          style="width: ${Math.min(100, budgetData.summary.overallPercentage)}%; background-color: ${budgetData.summary.isOverBudget ? 'var(--accent-rose)' : 'var(--accent-primary)'};"
        ></div>
      </div>
    </div>

    <!-- Category Budgets Grid -->
    <div class="budget-cards-grid mt-6">
      ${budgetData.categories.length === 0 ? `
        <div class="card p-8 text-center text-muted col-span-full">
          <p>No categories configured yet.</p>
        </div>
      ` : budgetData.categories.map(cat => {
        let statusBadge = '';
        let barColor = 'var(--accent-primary)';

        if (cat.status === 'danger') {
          barColor = 'var(--accent-rose)';
          statusBadge = `<span class="badge badge-danger">Over Budget by ${formatCurrency(Math.abs(cat.remaining))}</span>`;
        } else if (cat.status === 'warning') {
          barColor = 'var(--warning)';
          statusBadge = `<span class="badge badge-warning">Approaching Limit</span>`;
        } else if (cat.status === 'unbudgeted') {
          statusBadge = `<span class="badge badge-secondary">No Budget Set</span>`;
        } else {
          statusBadge = `<span class="badge badge-success">${formatCurrency(cat.remaining)} left</span>`;
        }

        return `
          <div class="card budget-card ${cat.status === 'danger' ? 'border-danger' : ''}">
            <div class="budget-card-header">
              <div class="budget-cat-meta">
                <span class="cat-color-dot" style="background-color: ${cat.categoryColor || '#64748b'};"></span>
                <span class="budget-cat-name font-semibold text-primary">${cat.categoryName}</span>
              </div>
              <div class="budget-card-actions">
                <button class="btn-icon btn-edit-category-budget" data-id="${cat.categoryId}" title="Edit Budget">
                  ${getIcon('edit', 'icon-xs')}
                </button>
              </div>
            </div>

            <div class="budget-card-body">
              <div class="budget-numbers-row">
                <div>
                  <span class="text-xs text-muted">Spent</span>
                  <div class="font-mono text-lg font-bold ${cat.status === 'danger' ? 'text-rose' : 'text-primary'}">
                    ${formatCurrency(cat.spent)}
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-xs text-muted">Budgeted</span>
                  <div class="font-mono text-lg text-secondary">
                    ${formatCurrency(cat.budgeted)}
                  </div>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="progress-bar-bg mt-3 mb-2">
                <div
                  class="progress-bar-fill"
                  style="width: ${Math.min(100, cat.percentage)}%; background-color: ${barColor};"
                ></div>
              </div>

              <div class="budget-card-footer-info">
                <span class="text-xs text-muted font-mono">${formatPercent(cat.percentage)} used</span>
                ${statusBadge}
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // --- Handlers ---
  container.querySelector('#btn-prev-month')?.addEventListener('click', () => {
    selectedMonth = getMonthKey(addMonths(selectedMonth + '-01', -1));
    renderBudgetsView(container);
  });

  container.querySelector('#btn-next-month')?.addEventListener('click', () => {
    selectedMonth = getMonthKey(addMonths(selectedMonth + '-01', 1));
    renderBudgetsView(container);
  });

  container.querySelector('#btn-copy-prev-budgets')?.addEventListener('click', async () => {
    await state.copyBudgetsFromMonth(previousMonthKey, selectedMonth);
    renderBudgetsView(container);
  });

  container.querySelector('#btn-add-budget')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('OPEN_BUDGET_MODAL', { detail: { monthKey: selectedMonth } }));
  });

  container.querySelectorAll('.btn-edit-category-budget').forEach(btn => {
    btn.addEventListener('click', () => {
      const categoryId = btn.dataset.id;
      window.dispatchEvent(new CustomEvent('OPEN_BUDGET_MODAL', { detail: { monthKey: selectedMonth, categoryId } }));
    });
  });
}
