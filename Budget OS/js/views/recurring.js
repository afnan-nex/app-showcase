/**
 * BudgetOS - Recurring Transactions & Bills View Controller
 * Manage recurring income, fixed bills, subscriptions, and automated transfers.
 */

import state from '../state.js';
import { getIcon } from '../icons.js';
import { formatCurrency, formatDate, formatRelativeDate, getTodayISO, addDays } from '../formatters.js';
import { getNextOccurrence } from '../calculations/forecast.js';

export function renderRecurringView(container) {
  const { recurring, categories, accounts } = state;
  const catMap = {};
  categories.forEach(c => { catMap[c.id] = c; });
  const accMap = {};
  accounts.forEach(a => { accMap[a.id] = a; });

  const activeRules = recurring.filter(r => !r.isPaused);
  const pausedRules = recurring.filter(r => r.isPaused);

  // Group by Income vs Expenses
  let monthlyTotalIncome = 0;
  let monthlyTotalExpenses = 0;

  activeRules.forEach(r => {
    const amt = Number(r.amount) || 0;
    // Normalize to monthly
    let monthlyEquiv = amt;
    if (r.frequency === 'weekly') monthlyEquiv = amt * 4.33;
    else if (r.frequency === 'biweekly') monthlyEquiv = amt * 2.16;
    else if (r.frequency === 'daily') monthlyEquiv = amt * 30;
    else if (r.frequency === 'yearly') monthlyEquiv = amt / 12;

    if (r.type === 'income') monthlyTotalIncome += monthlyEquiv;
    else if (r.type === 'expense') monthlyTotalExpenses += monthlyEquiv;
  });

  const netMonthlyRecurring = monthlyTotalIncome - monthlyTotalExpenses;

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">Recurring Bills & Income</h1>
        <p class="view-subtitle">Automated schedules feeding cash-flow projections and reminders</p>
      </div>
      <div class="view-actions">
        <button class="btn btn-primary" id="btn-add-recurring">
          ${getIcon('plus', 'icon-sm')} Add Recurring Rule
        </button>
      </div>
    </div>

    <!-- Recurring Totals Card -->
    <div class="card recurring-summary-card">
      <div class="recurring-kpi-block">
        <span class="kpi-lbl">Monthly Fixed Income</span>
        <span class="kpi-val text-emerald font-bold">${formatCurrency(monthlyTotalIncome, { hideDecimals: true })}/mo</span>
      </div>
      <div class="kpi-divider"></div>
      <div class="recurring-kpi-block">
        <span class="kpi-lbl">Monthly Fixed Expenses</span>
        <span class="kpi-val text-rose font-bold">${formatCurrency(monthlyTotalExpenses, { hideDecimals: true })}/mo</span>
      </div>
      <div class="kpi-divider"></div>
      <div class="recurring-kpi-block">
        <span class="kpi-lbl">Net Recurring Margin</span>
        <span class="kpi-val ${netMonthlyRecurring >= 0 ? 'text-emerald' : 'text-rose'} font-bold">
          ${formatCurrency(netMonthlyRecurring, { hideDecimals: true, showSign: true })}/mo
        </span>
      </div>
    </div>

    <!-- Recurring Items Table -->
    <div class="card recurring-table-card mt-6">
      <div class="table-responsive">
        <table class="table finance-table">
          <thead>
            <tr>
              <th>Name / Payee</th>
              <th>Category</th>
              <th>Account</th>
              <th>Frequency</th>
              <th>Next Due Date</th>
              <th class="text-right">Amount</th>
              <th class="text-center" style="width: 140px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${activeRules.length === 0 ? `
              <tr>
                <td colspan="7" class="text-center p-5 text-muted">
                  No active recurring rules found.
                </td>
              </tr>
            ` : activeRules.map(rule => {
              const cat = catMap[rule.categoryId] || { name: 'Bill', color: '#94a3b8', icon: 'tag' };
              const acc = accMap[rule.accountId] || { name: 'Account' };
              const toAcc = rule.toAccountId ? accMap[rule.toAccountId] : null;

              const isIncome = rule.type === 'income';
              const isTransfer = rule.type === 'transfer';
              const amountClass = isIncome ? 'text-emerald font-semibold' : 'text-rose font-semibold';
              const sign = isIncome ? '+' : isTransfer ? '⇆ ' : '-';

              return `
                <tr class="recurring-row" data-id="${rule.id}">
                  <td>
                    <div class="font-medium text-primary">${rule.name}</div>
                    <div class="text-xs text-muted">Started ${formatDate(rule.startDate, 'short')}</div>
                  </td>
                  <td>
                    <span class="badge badge-category" style="--cat-color: ${cat.color};">
                      ${getIcon(cat.icon, 'icon-xs')} ${cat.name}
                    </span>
                  </td>
                  <td class="text-secondary text-sm">
                    ${isTransfer && toAcc ? `${acc.name} &rarr; ${toAcc.name}` : acc.name}
                  </td>
                  <td>
                    <span class="badge badge-secondary text-xs uppercase">${rule.frequency}</span>
                  </td>
                  <td>
                    <span class="font-mono text-sm font-medium text-primary">${formatDate(rule.nextDueDate, 'short')}</span>
                    <div class="text-xs text-muted">${formatRelativeDate(rule.nextDueDate)}</div>
                  </td>
                  <td class="text-right font-mono ${amountClass}">
                    ${sign}${formatCurrency(rule.amount)}
                  </td>
                  <td class="text-center">
                    <div class="table-actions-group">
                      <button class="btn btn-sm btn-outline btn-post-now" data-id="${rule.id}" title="Post transaction to ledger now and advance due date">
                        ${getIcon('play', 'icon-xs')} Post
                      </button>
                      <button class="btn-icon btn-edit-recurring" data-id="${rule.id}" title="Edit">
                        ${getIcon('edit', 'icon-xs')}
                      </button>
                      <button class="btn-icon btn-icon-danger btn-delete-recurring" data-id="${rule.id}" title="Delete">
                        ${getIcon('trash', 'icon-xs')}
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // --- Attach Handlers ---
  container.querySelector('#btn-add-recurring')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('OPEN_RECURRING_MODAL'));
  });

  container.querySelectorAll('.btn-edit-recurring').forEach(btn => {
    btn.addEventListener('click', () => {
      const rule = recurring.find(r => r.id === btn.dataset.id);
      if (rule) {
        window.dispatchEvent(new CustomEvent('OPEN_RECURRING_MODAL', { detail: { rule } }));
      }
    });
  });

  container.querySelectorAll('.btn-delete-recurring').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (confirm('Delete this recurring schedule?')) {
        await state.deleteRecurring(id);
        renderRecurringView(container);
      }
    });
  });

  // Post to Ledger Now
  container.querySelectorAll('.btn-post-now').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const rule = recurring.find(r => r.id === id);
      if (!rule) return;

      // 1. Create transaction in ledger
      const newTx = {
        id: 'tx_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        date: rule.nextDueDate || getTodayISO(),
        description: rule.name,
        merchant: rule.name,
        amount: Number(rule.amount) || 0,
        type: rule.type,
        categoryId: rule.categoryId,
        accountId: rule.accountId,
        toAccountId: rule.toAccountId,
        recurringId: rule.id,
        isCleared: true,
        notes: `Automated post from recurring schedule (${rule.frequency})`
      };

      // 2. Advance next due date
      const updatedRule = {
        ...rule,
        nextDueDate: getNextOccurrence(rule.nextDueDate || getTodayISO(), rule.frequency)
      };

      await state.addTransaction(newTx);
      await state.saveRecurring(updatedRule);
      renderRecurringView(container);
    });
  });
}
