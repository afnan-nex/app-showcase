/**
 * BudgetOS - Accounts View Controller
 * Manage checking, savings, cash, and credit card accounts with dynamic balances and reconciliation.
 */

import state from '../state.js';
import { getIcon } from '../icons.js';
import { formatCurrency, formatPercent } from '../formatters.js';
import { calculateAccountBalances } from '../calculations/balances.js';

function renderAccountCard(acc, stats = {}) {
  const isCredit = acc.type === 'creditCard';
  const balance = stats.currentBalance || 0;
  const cleared = stats.clearedBalance || 0;
  const creditLimit = Number(acc.creditLimit) || 0;
  const availableCredit = isCredit && creditLimit > 0 ? Math.max(0, creditLimit - balance) : 0;
  const creditUtilization = isCredit && creditLimit > 0 ? (balance / creditLimit) * 100 : 0;

  return `
    <div class="card account-card" style="--acc-color: ${acc.color || '#3b82f6'};">
      <div class="account-card-top">
        <div class="acc-badge-icon" style="background-color: ${acc.color || '#3b82f6'}20; color: ${acc.color || '#3b82f6'};">
          ${getIcon(acc.icon || (isCredit ? 'creditCard' : 'bank'), 'icon-md')}
        </div>
        <div class="acc-meta-block">
          <h3 class="acc-name">${acc.name}</h3>
          <span class="acc-type-pill text-xs">${acc.type.toUpperCase()}</span>
        </div>
        <div class="acc-card-actions">
          <button class="btn-icon btn-edit-account" data-id="${acc.id}" title="Edit Account">
            ${getIcon('edit', 'icon-xs')}
          </button>
          <button class="btn-icon btn-icon-danger btn-delete-account" data-id="${acc.id}" title="Delete Account">
            ${getIcon('trash', 'icon-xs')}
          </button>
        </div>
      </div>

      <div class="account-card-body">
        <div class="acc-balance-display">
          <span class="acc-bal-label text-muted text-xs">${isCredit ? 'Current Balance (Debt)' : 'Current Balance'}</span>
          <div class="acc-bal-amount font-mono ${isCredit ? 'text-rose' : 'text-primary'}">
            ${formatCurrency(balance)}
          </div>
        </div>

        ${isCredit && creditLimit > 0 ? `
          <div class="credit-util-section">
            <div class="util-header text-xs text-muted">
              <span>Available: <strong>${formatCurrency(availableCredit)}</strong></span>
              <span>${formatPercent(creditUtilization)} used</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${Math.min(100, creditUtilization)}%; background-color: ${creditUtilization > 70 ? 'var(--accent-rose)' : 'var(--accent-primary)'};"></div>
            </div>
          </div>
        ` : `
          <div class="acc-cleared-info text-xs text-muted">
            <span>Cleared: <strong class="text-primary">${formatCurrency(cleared)}</strong></span>
            <span>&bull;</span>
            <span>${stats.transactionCount || 0} transactions</span>
          </div>
        `}
      </div>

      <div class="account-card-footer">
        <button class="btn btn-sm btn-ghost w-full btn-view-acc-tx" data-id="${acc.id}">
          View Ledger ${getIcon('arrowRight', 'icon-xs')}
        </button>
      </div>
    </div>
  `;
}

export function renderAccountsView(container) {
  const { accounts, transactions } = state;
  const balanceData = calculateAccountBalances(accounts, transactions);
  const accMap = balanceData.accounts;

  // Group accounts by type
  const checkingAccs = accounts.filter(a => a.type === 'checking' && !a.isArchived);
  const savingsAccs = accounts.filter(a => a.type === 'savings' && !a.isArchived);
  const creditAccs = accounts.filter(a => a.type === 'creditCard' && !a.isArchived);
  const cashAccs = accounts.filter(a => a.type === 'cash' && !a.isArchived);
  const archivedAccs = accounts.filter(a => a.isArchived);

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">Accounts & Assets</h1>
        <p class="view-subtitle">Dynamic balances calculated across ${transactions.length} historical transactions</p>
      </div>
      <div class="view-actions">
        <button class="btn btn-primary" id="btn-add-account">
          ${getIcon('plus', 'icon-sm')} Add Account
        </button>
      </div>
    </div>

    <!-- Accounts High-Level Summary Banner -->
    <div class="card account-summary-banner">
      <div class="acc-summary-stat">
        <span class="stat-lbl">Total Net Worth</span>
        <span class="stat-val font-bold ${balanceData.summary.netWorth >= 0 ? 'text-primary' : 'text-danger'}">
          ${formatCurrency(balanceData.summary.netWorth)}
        </span>
      </div>
      <div class="acc-summary-divider"></div>
      <div class="acc-summary-stat">
        <span class="stat-lbl">Liquid Cash & Assets</span>
        <span class="stat-val text-emerald font-semibold">${formatCurrency(balanceData.summary.totalAssets)}</span>
      </div>
      <div class="acc-summary-divider"></div>
      <div class="acc-summary-stat">
        <span class="stat-lbl">Credit Card Liabilities</span>
        <span class="stat-val text-rose font-semibold">${formatCurrency(balanceData.summary.totalLiabilities)}</span>
      </div>
    </div>

    <!-- Account Cards Grid -->
    <div class="accounts-section-grid">
      
      <!-- Cash & Checking Group -->
      <div class="account-group">
        <div class="account-group-header">
          <h2 class="group-title">Cash & Depository Accounts</h2>
          <span class="group-count text-muted text-xs">${checkingAccs.length + cashAccs.length} accounts</span>
        </div>
        <div class="account-cards-list">
          ${[...checkingAccs, ...cashAccs].map(acc => renderAccountCard(acc, accMap[acc.id])).join('')}
          ${checkingAccs.length === 0 && cashAccs.length === 0 ? `
            <div class="empty-state-card"><p>No checking or cash accounts added yet.</p></div>
          ` : ''}
        </div>
      </div>

      <!-- Savings & Investments Group -->
      <div class="account-group">
        <div class="account-group-header">
          <h2 class="group-title">Savings & Reserves</h2>
          <span class="group-count text-muted text-xs">${savingsAccs.length} accounts</span>
        </div>
        <div class="account-cards-list">
          ${savingsAccs.map(acc => renderAccountCard(acc, accMap[acc.id])).join('')}
          ${savingsAccs.length === 0 ? `
            <div class="empty-state-card"><p>No savings accounts added yet.</p></div>
          ` : ''}
        </div>
      </div>

      <!-- Credit Cards Group -->
      <div class="account-group">
        <div class="account-group-header">
          <h2 class="group-title">Credit Cards & Lines</h2>
          <span class="group-count text-muted text-xs">${creditAccs.length} accounts</span>
        </div>
        <div class="account-cards-list">
          ${creditAccs.map(acc => renderAccountCard(acc, accMap[acc.id])).join('')}
          ${creditAccs.length === 0 ? `
            <div class="empty-state-card"><p>No credit cards configured.</p></div>
          ` : ''}
        </div>
      </div>

    </div>

    ${archivedAccs.length > 0 ? `
      <div class="archived-section mt-6">
        <h3 class="text-muted text-sm uppercase mb-3">Archived Accounts (${archivedAccs.length})</h3>
        <div class="account-cards-list opacity-60">
          ${archivedAccs.map(acc => renderAccountCard(acc, accMap[acc.id])).join('')}
        </div>
      </div>
    ` : ''}
  `;

  // --- Attach Handlers ---
  container.querySelector('#btn-add-account')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('OPEN_ACCOUNT_MODAL'));
  });

  container.querySelectorAll('.btn-edit-account').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const acc = accounts.find(a => a.id === btn.dataset.id);
      if (acc) {
        window.dispatchEvent(new CustomEvent('OPEN_ACCOUNT_MODAL', { detail: { account: acc } }));
      }
    });
  });

  container.querySelectorAll('.btn-delete-account').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      if (confirm('Are you sure you want to delete this account? Transactions will remain in ledger.')) {
        await state.deleteAccount(id);
        renderAccountsView(container);
      }
    });
  });

  container.querySelectorAll('.btn-view-acc-tx').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeView = 'transactions';
      state.notify('VIEW_CHANGED');
    });
  });
}
