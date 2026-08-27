/**
 * BudgetOS - Main Application Bootstrap & Orchestrator
 * Routing, Navigation, Theme Engine, Modal Management, Keyboard Shortcuts & Undo Toast.
 */

import state from './state.js';
import { initDB, seedDemoData } from './db.js';
import { getIcon } from './icons.js';
import { getTodayISO, formatCurrency } from './formatters.js';

// Views
import { renderDashboardView } from './views/dashboard.js';
import { renderTransactionsView } from './views/transactions.js';
import { renderAccountsView } from './views/accounts.js';
import { renderBudgetsView } from './views/budgets.js';
import { renderGoalsView } from './views/goals.js';
import { renderRecurringView } from './views/recurring.js';
import { renderForecastView } from './views/forecast.js';
import { renderScenariosView } from './views/scenarios.js';
import { renderReportsView } from './views/reports.js';
import { renderDataHubView } from './views/data-hub.js';

class BudgetOSApp {
  constructor() {
    this.viewContainer = document.getElementById('main-workspace');
    this.modalContainer = document.getElementById('modal-container');
    this.toastContainer = document.getElementById('toast-container');
    this.sidebar = document.getElementById('app-sidebar');
    this.backdrop = document.getElementById('sidebar-backdrop');
  }

  async init() {
    // 1. Set theme immediately
    const theme = localStorage.getItem('budgetos_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);

    // 2. Setup Navigation & UI Listeners immediately
    this.setupNavigation();
    this.setupGlobalListeners();
    this.setupModalEvents();
    this.setupShortcuts();

    // 3. Initialize DB and load state
    try {
      await initDB();
      await state.loadFromDB();

      // If first time launch and no accounts exist, offer to load demo data or initialize
      if (state.accounts.length === 0 && state.transactions.length === 0) {
        await seedDemoData();
        await state.loadFromDB();
      }
    } catch (err) {
      console.warn('Database initialization warning:', err);
    }

    // 4. Render initial view
    this.renderCurrentView();
  }

  setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = link.dataset.view;
        if (targetView && targetView !== state.activeView) {
          state.activeView = targetView;
          this.renderCurrentView();
        }
      });
    });

    // Theme Toggle
    const themeToggleBtn = document.getElementById('btn-theme-toggle');
    themeToggleBtn?.addEventListener('click', async () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      await state.saveSetting('theme', nextTheme);
      this.updateThemeIcon(nextTheme);
    });
    this.updateThemeIcon(document.documentElement.getAttribute('data-theme') || 'dark');

    // Mobile Sidebar Toggle
    const sidebarToggleBtn = document.getElementById('btn-mobile-sidebar-toggle');
    sidebarToggleBtn?.addEventListener('click', () => {
      const isOpen = this.sidebar.classList.toggle('open');
      this.backdrop?.classList.toggle('active', isOpen);
      sidebarToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Mobile Backdrop click to dismiss
    this.backdrop?.addEventListener('click', () => {
      this.sidebar?.classList.remove('open');
      this.backdrop?.classList.remove('active');
      sidebarToggleBtn?.setAttribute('aria-expanded', 'false');
    });

    // Topbar quick transaction button
    document.getElementById('btn-topbar-new-tx')?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('OPEN_TRANSACTION_MODAL'));
    });
  }

  updateThemeIcon(currentTheme) {
    const themeToggleBtn = document.getElementById('btn-theme-toggle');
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = currentTheme === 'dark' ? getIcon('sun', 'icon-sm') : getIcon('moon', 'icon-sm');
      themeToggleBtn.setAttribute('title', `Switch to ${currentTheme === 'dark' ? 'Light' : 'Dark'} mode`);
    }
  }

  renderCurrentView() {
    // Update active nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.dataset.view === state.activeView) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Close mobile sidebar if open
    this.sidebar?.classList.remove('open');
    this.backdrop?.classList.remove('active');
    document.getElementById('btn-mobile-sidebar-toggle')?.setAttribute('aria-expanded', 'false');

    // Scroll to top
    this.viewContainer.scrollTop = 0;

    // Route view
    switch (state.activeView) {
      case 'dashboard':
        renderDashboardView(this.viewContainer);
        break;
      case 'transactions':
        renderTransactionsView(this.viewContainer);
        break;
      case 'accounts':
        renderAccountsView(this.viewContainer);
        break;
      case 'budgets':
        renderBudgetsView(this.viewContainer);
        break;
      case 'goals':
        renderGoalsView(this.viewContainer);
        break;
      case 'recurring':
        renderRecurringView(this.viewContainer);
        break;
      case 'forecast':
        renderForecastView(this.viewContainer);
        break;
      case 'scenarios':
        renderScenariosView(this.viewContainer);
        break;
      case 'reports':
        renderReportsView(this.viewContainer);
        break;
      case 'data-hub':
        renderDataHubView(this.viewContainer);
        break;
      default:
        renderDashboardView(this.viewContainer);
    }
  }

  setupGlobalListeners() {
    state.subscribe('STATE_UPDATED', () => {
      this.renderCurrentView();
    });

    state.subscribe('VIEW_CHANGED', () => {
      this.renderCurrentView();
    });

    state.subscribe('UNDO_AVAILABLE', ({ action }) => {
      this.showUndoToast(action);
    });
  }

  setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      // ESC key closes active modal or mobile menu anywhere
      if (e.key === 'Escape') {
        if (this.modalContainer.classList.contains('active')) {
          this.closeModal();
          return;
        }
        if (this.sidebar.classList.contains('open')) {
          this.sidebar.classList.remove('open');
          this.backdrop?.classList.remove('active');
          document.getElementById('btn-mobile-sidebar-toggle')?.setAttribute('aria-expanded', 'false');
          return;
        }
      }

      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('OPEN_TRANSACTION_MODAL'));
      }
      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        state.activeView = 'transactions';
        this.renderCurrentView();
      }
      if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        state.activeView = 'dashboard';
        this.renderCurrentView();
      }
      if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        state.activeView = 'accounts';
        this.renderCurrentView();
      }
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        state.activeView = 'budgets';
        this.renderCurrentView();
      }
      if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        state.activeView = 'goals';
        this.renderCurrentView();
      }
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        state.activeView = 'forecast';
        this.renderCurrentView();
      }
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        state.activeView = 'reports';
        this.renderCurrentView();
      }
      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        state.executeUndo();
      }
    });
  }

  showUndoToast(action) {
    const toastId = 'toast_' + Date.now();
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = 'toast-alert';
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-desc">${action.description}</span>
      </div>
      <button class="btn btn-sm btn-outline-warning btn-undo-trigger">
        ${getIcon('undo', 'icon-xs')} Undo
      </button>
      <button class="toast-close-btn">&times;</button>
    `;

    toast.querySelector('.btn-undo-trigger')?.addEventListener('click', async () => {
      await state.executeUndo();
      toast.remove();
    });

    toast.querySelector('.toast-close-btn')?.addEventListener('click', () => {
      toast.remove();
    });

    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 7000);
  }

  // --- Modals Setup ---
  setupModalEvents() {
    // 1. Transaction Modal
    window.addEventListener('OPEN_TRANSACTION_MODAL', (e) => {
      const tx = e.detail?.transaction || null;
      this.showTransactionModal(tx);
    });

    // 2. Account Modal
    window.addEventListener('OPEN_ACCOUNT_MODAL', (e) => {
      const acc = e.detail?.account || null;
      this.showAccountModal(acc);
    });

    // 3. Budget Modal
    window.addEventListener('OPEN_BUDGET_MODAL', (e) => {
      const { monthKey, categoryId } = e.detail || {};
      this.showBudgetModal(monthKey, categoryId);
    });

    // 4. Goal Modal
    window.addEventListener('OPEN_GOAL_MODAL', (e) => {
      const goal = e.detail?.goal || null;
      this.showGoalModal(goal);
    });

    // 5. Deposit to Goal Modal
    window.addEventListener('OPEN_DEPOSIT_MODAL', (e) => {
      const goal = e.detail?.goal;
      if (goal) this.showDepositModal(goal);
    });

    // 6. Recurring Modal
    window.addEventListener('OPEN_RECURRING_MODAL', (e) => {
      const rule = e.detail?.rule || null;
      this.showRecurringModal(rule);
    });
  }

  closeModal() {
    this.modalContainer.innerHTML = '';
    this.modalContainer.classList.remove('active');
  }

  openModalMarkup(contentHTML) {
    this.modalContainer.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-dialog">
        ${contentHTML}
      </div>
    `;
    this.modalContainer.classList.add('active');

    this.modalContainer.querySelector('.modal-backdrop')?.addEventListener('click', () => this.closeModal());
    this.modalContainer.querySelector('.btn-modal-close')?.addEventListener('click', () => this.closeModal());
    this.modalContainer.querySelector('.btn-modal-cancel')?.addEventListener('click', () => this.closeModal());
  }

  // Transaction Modal Handler
  showTransactionModal(tx = null) {
    const isEdit = !!tx;
    const { categories, accounts } = state;
    const today = getTodayISO();

    const currentType = tx?.type || 'expense';
    const currentDate = tx?.date || today;
    const currentMerchant = tx?.merchant || tx?.description || '';
    const currentAmount = tx?.amount || '';
    const currentCategoryId = tx?.categoryId || categories.find(c => c.type === currentType)?.id || categories[0]?.id;
    const currentAccountId = tx?.accountId || accounts[0]?.id || '';
    const currentToAccountId = tx?.toAccountId || (accounts.length > 1 ? accounts[1].id : '');
    const currentNotes = tx?.notes || '';
    const currentCleared = tx ? tx.isCleared !== false : true;

    const content = `
      <div class="modal-header">
        <h2 class="modal-title">${isEdit ? 'Edit Transaction' : 'New Transaction'}</h2>
        <button class="btn-icon btn-modal-close">${getIcon('close', 'icon-sm')}</button>
      </div>
      <form id="form-transaction">
        <div class="modal-body">
          <!-- Type Segmented Selector -->
          <div class="form-group">
            <div class="segmented-control w-full" id="modal-tx-type">
              <button type="button" class="segment-btn ${currentType === 'expense' ? 'active' : ''}" data-type="expense">Expense</button>
              <button type="button" class="segment-btn ${currentType === 'income' ? 'active' : ''}" data-type="income">Income</button>
              <button type="button" class="segment-btn ${currentType === 'transfer' ? 'active' : ''}" data-type="transfer">Transfer</button>
            </div>
            <input type="hidden" id="tx-type-input" value="${currentType}" />
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Date *</label>
              <input type="date" id="tx-date-input" class="form-control" value="${currentDate}" required />
            </div>
            <div class="form-group flex-1">
              <label class="form-label">Amount ($) *</label>
              <input type="number" step="0.01" id="tx-amount-input" class="form-control font-mono font-bold" placeholder="0.00" value="${currentAmount}" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Merchant / Description *</label>
            <input type="text" id="tx-desc-input" class="form-control" placeholder="e.g. Whole Foods, Spotify, Acme Payroll" value="${currentMerchant}" required />
          </div>

          <div class="form-row" id="tx-category-row" style="${currentType === 'transfer' ? 'display: none;' : ''}">
            <div class="form-group flex-1">
              <label class="form-label">Category *</label>
              <select id="tx-category-select" class="form-control">
                ${categories.map(c => `
                  <option value="${c.id}" ${c.id === currentCategoryId ? 'selected' : ''}>${c.name}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label" id="lbl-source-acc">${currentType === 'transfer' ? 'Source Account *' : 'Account *'}</label>
              <select id="tx-account-select" class="form-control" required>
                ${accounts.map(a => `
                  <option value="${a.id}" ${a.id === currentAccountId ? 'selected' : ''}>${a.name} (${a.type})</option>
                `).join('')}
              </select>
            </div>

            <div class="form-group flex-1" id="tx-to-account-group" style="${currentType === 'transfer' ? '' : 'display: none;'}">
              <label class="form-label">Destination Account *</label>
              <select id="tx-to-account-select" class="form-control">
                ${accounts.map(a => `
                  <option value="${a.id}" ${a.id === currentToAccountId ? 'selected' : ''}>${a.name} (${a.type})</option>
                `).join('')}
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Notes (Optional)</label>
            <input type="text" id="tx-notes-input" class="form-control text-sm" placeholder="Additional details, memo, tag..." value="${currentNotes}" />
          </div>

          <div class="form-group">
            <label class="checkbox-row cursor-pointer">
              <input type="checkbox" id="tx-cleared-input" ${currentCleared ? 'checked' : ''} />
              <span class="text-sm font-medium">Cleared & Settled</span>
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-modal-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Save Changes' : 'Record Transaction'}</button>
        </div>
      </form>
    `;

    this.openModalMarkup(content);

    // Segmented type selector click
    const typeInput = this.modalContainer.querySelector('#tx-type-input');
    const catRow = this.modalContainer.querySelector('#tx-category-row');
    const toAccGroup = this.modalContainer.querySelector('#tx-to-account-group');
    const srcLbl = this.modalContainer.querySelector('#lbl-source-acc');

    this.modalContainer.querySelectorAll('#modal-tx-type .segment-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.modalContainer.querySelectorAll('#modal-tx-type .segment-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const selectedType = btn.dataset.type;
        typeInput.value = selectedType;

        if (selectedType === 'transfer') {
          catRow.style.display = 'none';
          toAccGroup.style.display = 'block';
          srcLbl.textContent = 'Source Account *';
        } else {
          catRow.style.display = 'block';
          toAccGroup.style.display = 'none';
          srcLbl.textContent = 'Account *';
        }
      });
    });

    // Form submit
    this.modalContainer.querySelector('#form-transaction')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const type = typeInput.value;
      const date = this.modalContainer.querySelector('#tx-date-input').value;
      const amount = Math.abs(parseFloat(this.modalContainer.querySelector('#tx-amount-input').value) || 0);
      const merchant = this.modalContainer.querySelector('#tx-desc-input').value.trim();
      const categoryId = type === 'transfer' ? 'cat_salary' : this.modalContainer.querySelector('#tx-category-select').value;
      const accountId = this.modalContainer.querySelector('#tx-account-select').value;
      const toAccountId = type === 'transfer' ? this.modalContainer.querySelector('#tx-to-account-select').value : null;
      const notes = this.modalContainer.querySelector('#tx-notes-input').value.trim();
      const isCleared = this.modalContainer.querySelector('#tx-cleared-input').checked;

      if (!merchant || amount <= 0 || !accountId) {
        alert('Please fill out all required fields with a valid amount.');
        return;
      }

      if (isEdit) {
        await state.updateTransaction({
          ...tx,
          date,
          amount,
          type,
          description: merchant,
          merchant,
          categoryId,
          accountId,
          toAccountId,
          notes,
          isCleared
        });
      } else {
        await state.addTransaction({
          id: 'tx_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
          date,
          amount,
          type,
          description: merchant,
          merchant,
          categoryId,
          accountId,
          toAccountId,
          notes,
          isCleared
        });
      }

      this.closeModal();
    });
  }

  // Account Modal
  showAccountModal(acc = null) {
    const isEdit = !!acc;
    const currentName = acc?.name || '';
    const currentType = acc?.type || 'checking';
    const currentBal = acc?.initialBalance || '';
    const currentLimit = acc?.creditLimit || '';
    const currentColor = acc?.color || '#3b82f6';
    const currentIcon = acc?.icon || (currentType === 'creditCard' ? 'creditCard' : 'bank');

    const content = `
      <div class="modal-header">
        <h2 class="modal-title">${isEdit ? 'Edit Account' : 'Add Financial Account'}</h2>
        <button class="btn-icon btn-modal-close">${getIcon('close', 'icon-sm')}</button>
      </div>
      <form id="form-account">
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Account Name *</label>
            <input type="text" id="acc-name-input" class="form-control" placeholder="e.g. Chase Sapphire, High-Yield Savings" value="${currentName}" required />
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Account Type *</label>
              <select id="acc-type-select" class="form-control">
                <option value="checking" ${currentType === 'checking' ? 'selected' : ''}>Checking</option>
                <option value="savings" ${currentType === 'savings' ? 'selected' : ''}>Savings</option>
                <option value="creditCard" ${currentType === 'creditCard' ? 'selected' : ''}>Credit Card</option>
                <option value="cash" ${currentType === 'cash' ? 'selected' : ''}>Cash Wallet</option>
              </select>
            </div>
            <div class="form-group flex-1">
              <label class="form-label">Initial Opening Balance ($)</label>
              <input type="number" step="0.01" id="acc-bal-input" class="form-control font-mono" placeholder="0.00" value="${currentBal}" />
            </div>
          </div>

          <div class="form-group" id="acc-limit-group" style="${currentType === 'creditCard' ? '' : 'display: none;'}">
            <label class="form-label">Credit Limit ($)</label>
            <input type="number" step="0.01" id="acc-limit-input" class="form-control font-mono" placeholder="10000.00" value="${currentLimit}" />
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Accent Color</label>
              <input type="color" id="acc-color-input" class="form-control" style="height: 38px; padding: 2px;" value="${currentColor}" />
            </div>
            <div class="form-group flex-1">
              <label class="form-label">Icon</label>
              <select id="acc-icon-select" class="form-control">
                <option value="bank" ${currentIcon === 'bank' ? 'selected' : ''}>Bank</option>
                <option value="creditCard" ${currentIcon === 'creditCard' ? 'selected' : ''}>Credit Card</option>
                <option value="shield" ${currentIcon === 'shield' ? 'selected' : ''}>Shield / Vault</option>
                <option value="cash" ${currentIcon === 'cash' ? 'selected' : ''}>Cash</option>
                <option value="investment" ${currentIcon === 'investment' ? 'selected' : ''}>Investment</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-modal-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Save Account' : 'Create Account'}</button>
        </div>
      </form>
    `;

    this.openModalMarkup(content);

    const typeSelect = this.modalContainer.querySelector('#acc-type-select');
    const limitGroup = this.modalContainer.querySelector('#acc-limit-group');
    typeSelect?.addEventListener('change', () => {
      limitGroup.style.display = typeSelect.value === 'creditCard' ? 'block' : 'none';
    });

    this.modalContainer.querySelector('#form-account')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = this.modalContainer.querySelector('#acc-name-input').value.trim();
      const type = typeSelect.value;
      const initialBalance = parseFloat(this.modalContainer.querySelector('#acc-bal-input').value) || 0;
      const creditLimit = parseFloat(this.modalContainer.querySelector('#acc-limit-input')?.value) || 0;
      const color = this.modalContainer.querySelector('#acc-color-input').value;
      const icon = this.modalContainer.querySelector('#acc-icon-select').value;

      if (!name) return;

      const accountPayload = {
        id: isEdit ? acc.id : 'acc_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
        name,
        type,
        initialBalance,
        creditLimit: type === 'creditCard' ? creditLimit : 0,
        color,
        icon,
        isArchived: isEdit ? !!acc.isArchived : false
      };

      await state.saveAccount(accountPayload);
      this.closeModal();
    });
  }

  // Budget Modal
  showBudgetModal(monthKey, categoryId = null) {
    const { categories, budgets } = state;
    const targetMonth = monthKey || new Date().toISOString().slice(0, 7);
    const existingBudget = categoryId ? budgets.find(b => b.monthKey === targetMonth && b.categoryId === categoryId) : null;
    const existingAmount = existingBudget ? existingBudget.amount : '';

    const content = `
      <div class="modal-header">
        <h2 class="modal-title">Set Monthly Category Budget</h2>
        <button class="btn-icon btn-modal-close">${getIcon('close', 'icon-sm')}</button>
      </div>
      <form id="form-budget">
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Category *</label>
            <select id="budget-cat-select" class="form-control">
              ${categories.filter(c => c.type === 'expense').map(c => `
                <option value="${c.id}" ${c.id === categoryId ? 'selected' : ''}>${c.name}</option>
              `).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Monthly Budget Limit ($) *</label>
            <input type="number" step="1" id="budget-amount-input" class="form-control font-mono font-bold" placeholder="e.g. 600" value="${existingAmount}" required />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-modal-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Budget</button>
        </div>
      </form>
    `;

    this.openModalMarkup(content);

    this.modalContainer.querySelector('#form-budget')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const catId = this.modalContainer.querySelector('#budget-cat-select').value;
      const amount = parseFloat(this.modalContainer.querySelector('#budget-amount-input').value) || 0;

      await state.saveBudget({
        id: `bg_${targetMonth}_${catId}`,
        monthKey: targetMonth,
        categoryId: catId,
        amount
      });

      this.closeModal();
    });
  }

  // Goal Modal
  showGoalModal(goal = null) {
    const isEdit = !!goal;
    const { accounts } = state;

    const content = `
      <div class="modal-header">
        <h2 class="modal-title">${isEdit ? 'Edit Savings Goal' : 'New Savings Goal'}</h2>
        <button class="btn-icon btn-modal-close">${getIcon('close', 'icon-sm')}</button>
      </div>
      <form id="form-goal">
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Goal Name *</label>
            <input type="text" id="goal-name-input" class="form-control" placeholder="e.g. Emergency Fund, New Car, Tokyo Trip" value="${goal?.name || ''}" required />
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Target Amount ($) *</label>
              <input type="number" step="1" id="goal-target-input" class="form-control font-mono" placeholder="10000" value="${goal?.targetAmount || ''}" required />
            </div>
            <div class="form-group flex-1">
              <label class="form-label">Current Saved ($)</label>
              <input type="number" step="1" id="goal-current-input" class="form-control font-mono" placeholder="0" value="${goal?.currentAmount || 0}" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Target Completion Date</label>
              <input type="date" id="goal-date-input" class="form-control" value="${goal?.targetDate || ''}" />
            </div>
            <div class="form-group flex-1">
              <label class="form-label">Monthly Target Contribution ($)</label>
              <input type="number" step="1" id="goal-monthly-input" class="form-control font-mono" placeholder="e.g. 500" value="${goal?.monthlyContribution || ''}" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Linked Account</label>
            <select id="goal-account-select" class="form-control">
              ${accounts.map(a => `
                <option value="${a.id}" ${a.id === goal?.accountId ? 'selected' : ''}>${a.name}</option>
              `).join('')}
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-modal-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Save Goal' : 'Create Goal'}</button>
        </div>
      </form>
    `;

    this.openModalMarkup(content);

    this.modalContainer.querySelector('#form-goal')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = this.modalContainer.querySelector('#goal-name-input').value.trim();
      const targetAmount = parseFloat(this.modalContainer.querySelector('#goal-target-input').value) || 0;
      const currentAmount = parseFloat(this.modalContainer.querySelector('#goal-current-input').value) || 0;
      const targetDate = this.modalContainer.querySelector('#goal-date-input').value;
      const monthlyContribution = parseFloat(this.modalContainer.querySelector('#goal-monthly-input').value) || 0;
      const accountId = this.modalContainer.querySelector('#goal-account-select').value;

      if (!name || targetAmount <= 0) return;

      await state.saveGoal({
        id: isEdit ? goal.id : 'goal_' + Date.now().toString(36),
        name,
        targetAmount,
        currentAmount,
        targetDate,
        monthlyContribution,
        accountId,
        color: goal?.color || '#10b981',
        icon: goal?.icon || 'shield',
        isCompleted: currentAmount >= targetAmount
      });

      this.closeModal();
    });
  }

  // Deposit to Goal Modal
  showDepositModal(goal) {
    const content = `
      <div class="modal-header">
        <h2 class="modal-title">Add Funds to ${goal.name}</h2>
        <button class="btn-icon btn-modal-close">${getIcon('close', 'icon-sm')}</button>
      </div>
      <form id="form-deposit">
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Deposit Amount ($) *</label>
            <input type="number" step="0.01" id="deposit-amount-input" class="form-control font-mono font-bold text-lg" placeholder="0.00" required />
          </div>
          <p class="text-xs text-muted">This will record the additional savings directly toward your target of ${formatCurrency(goal.targetAmount)}.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-modal-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary">Add Funds</button>
        </div>
      </form>
    `;

    this.openModalMarkup(content);

    this.modalContainer.querySelector('#form-deposit')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const depositAmt = parseFloat(this.modalContainer.querySelector('#deposit-amount-input').value) || 0;
      if (depositAmt <= 0) return;

      const newCurrent = (Number(goal.currentAmount) || 0) + depositAmt;
      await state.saveGoal({
        ...goal,
        currentAmount: newCurrent,
        isCompleted: newCurrent >= goal.targetAmount
      });

      this.closeModal();
    });
  }

  // Recurring Rule Modal
  showRecurringModal(rule = null) {
    const isEdit = !!rule;
    const { categories, accounts } = state;
    const today = getTodayISO();

    const currentType = rule?.type || 'expense';
    const currentName = rule?.name || '';
    const currentAmount = rule?.amount || '';
    const currentFrequency = rule?.frequency || 'monthly';
    const currentNextDate = rule?.nextDueDate || today;
    const currentCategoryId = rule?.categoryId || categories[0]?.id;
    const currentAccountId = rule?.accountId || accounts[0]?.id;

    const content = `
      <div class="modal-header">
        <h2 class="modal-title">${isEdit ? 'Edit Recurring Schedule' : 'New Recurring Bill / Income'}</h2>
        <button class="btn-icon btn-modal-close">${getIcon('close', 'icon-sm')}</button>
      </div>
      <form id="form-recurring">
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Name / Description *</label>
            <input type="text" id="rec-name-input" class="form-control" placeholder="e.g. Acme Payroll, Apartment Rent, Netflix" value="${currentName}" required />
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Type *</label>
              <select id="rec-type-select" class="form-control">
                <option value="expense" ${currentType === 'expense' ? 'selected' : ''}>Expense / Bill</option>
                <option value="income" ${currentType === 'income' ? 'selected' : ''}>Income / Payroll</option>
              </select>
            </div>
            <div class="form-group flex-1">
              <label class="form-label">Amount ($) *</label>
              <input type="number" step="0.01" id="rec-amount-input" class="form-control font-mono font-bold" placeholder="0.00" value="${currentAmount}" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Frequency *</label>
              <select id="rec-freq-select" class="form-control">
                <option value="daily" ${currentFrequency === 'daily' ? 'selected' : ''}>Daily</option>
                <option value="weekly" ${currentFrequency === 'weekly' ? 'selected' : ''}>Weekly</option>
                <option value="biweekly" ${currentFrequency === 'biweekly' ? 'selected' : ''}>Bi-Weekly</option>
                <option value="monthly" ${currentFrequency === 'monthly' ? 'selected' : ''}>Monthly</option>
                <option value="yearly" ${currentFrequency === 'yearly' ? 'selected' : ''}>Yearly</option>
              </select>
            </div>
            <div class="form-group flex-1">
              <label class="form-label">Next Due Date *</label>
              <input type="date" id="rec-next-date-input" class="form-control" value="${currentNextDate}" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Category</label>
              <select id="rec-cat-select" class="form-control">
                ${categories.map(c => `
                  <option value="${c.id}" ${c.id === currentCategoryId ? 'selected' : ''}>${c.name}</option>
                `).join('')}
              </select>
            </div>
            <div class="form-group flex-1">
              <label class="form-label">Account</label>
              <select id="rec-acc-select" class="form-control">
                ${accounts.map(a => `
                  <option value="${a.id}" ${a.id === currentAccountId ? 'selected' : ''}>${a.name}</option>
                `).join('')}
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-modal-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Save Schedule' : 'Create Schedule'}</button>
        </div>
      </form>
    `;

    this.openModalMarkup(content);

    this.modalContainer.querySelector('#form-recurring')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = this.modalContainer.querySelector('#rec-name-input').value.trim();
      const type = this.modalContainer.querySelector('#rec-type-select').value;
      const amount = parseFloat(this.modalContainer.querySelector('#rec-amount-input').value) || 0;
      const frequency = this.modalContainer.querySelector('#rec-freq-select').value;
      const nextDueDate = this.modalContainer.querySelector('#rec-next-date-input').value;
      const categoryId = this.modalContainer.querySelector('#rec-cat-select').value;
      const accountId = this.modalContainer.querySelector('#rec-acc-select').value;

      if (!name || amount <= 0 || !nextDueDate) return;

      await state.saveRecurring({
        id: isEdit ? rule.id : 'rec_' + Date.now().toString(36),
        name,
        type,
        amount,
        frequency,
        nextDueDate,
        startDate: isEdit ? rule.startDate : today,
        categoryId,
        accountId,
        isPaused: isEdit ? rule.isPaused : false,
        autoPost: true
      });

      this.closeModal();
    });
  }
}

// Bootstrap
function startBudgetOS() {
  const app = new BudgetOSApp();
  app.init().catch(err => console.error('BudgetOS startup error:', err));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startBudgetOS);
} else {
  startBudgetOS();
}
