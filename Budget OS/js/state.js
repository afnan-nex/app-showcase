/**
 * BudgetOS - Central Reactive State Store & Undo Manager
 */

import * as DB from './db.js';
import { setCurrencyConfig } from './formatters.js';

class StateStore {
  constructor() {
    this.accounts = [];
    this.categories = [];
    this.transactions = [];
    this.budgets = [];
    this.goals = [];
    this.recurring = [];
    this.settings = {};
    
    this.activeView = 'dashboard';
    this.selectedMonthKey = null; // defaults to current month
    this.isLoaded = false;
    
    this.listeners = new Map();
    this.undoStack = [];
    this.maxUndoStack = 10;
  }

  /**
   * Subscribe to state change events
   * @param {string} event - event name or '*' for all
   * @param {Function} callback
   */
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.listeners.get(event)?.delete(callback);
  }

  /**
   * Emit an event to subscribers
   */
  notify(event, payload = {}) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => cb(payload, this));
    }
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach(cb => cb({ event, payload }, this));
    }
  }

  /**
   * Load all data from IndexedDB into memory
   */
  async loadFromDB() {
    try {
      this.accounts = await DB.getAll(DB.STORES.ACCOUNTS);
      this.categories = await DB.getAll(DB.STORES.CATEGORIES);
      this.transactions = await DB.getAll(DB.STORES.TRANSACTIONS);
      this.budgets = await DB.getAll(DB.STORES.BUDGETS);
      this.goals = await DB.getAll(DB.STORES.GOALS);
      this.recurring = await DB.getAll(DB.STORES.RECURRING);
      
      const settingsList = await DB.getAll(DB.STORES.SETTINGS);
      this.settings = {};
      settingsList.forEach(s => { this.settings[s.key] = s.value; });

      // Apply currency config
      if (this.settings.currency) {
        setCurrencyConfig(this.settings.currency);
      }

      this.isLoaded = true;
      this.notify('DATA_LOADED');
    } catch (err) {
      console.error('Failed to load state from IndexedDB:', err);
    }
  }

  // --- Transactions Actions ---
  async addTransaction(tx) {
    await DB.putItem(DB.STORES.TRANSACTIONS, tx);
    this.transactions.unshift(tx);
    this.notify('TRANSACTION_ADDED', tx);
    this.notify('STATE_UPDATED');
    return tx;
  }

  async updateTransaction(tx) {
    const prev = this.transactions.find(t => t.id === tx.id);
    await DB.putItem(DB.STORES.TRANSACTIONS, tx);
    const idx = this.transactions.findIndex(t => t.id === tx.id);
    if (idx !== -1) {
      this.transactions[idx] = tx;
    }
    if (prev) {
      this.pushUndoAction({
        type: 'UPDATE_TRANSACTION',
        description: `Edit transaction "${tx.description}"`,
        undo: async () => {
          await DB.putItem(DB.STORES.TRANSACTIONS, prev);
          const i = this.transactions.findIndex(t => t.id === prev.id);
          if (i !== -1) this.transactions[i] = prev;
          this.notify('STATE_UPDATED');
        }
      });
    }
    this.notify('TRANSACTION_UPDATED', tx);
    this.notify('STATE_UPDATED');
    return tx;
  }

  async deleteTransaction(txId) {
    const tx = this.transactions.find(t => t.id === txId);
    if (!tx) return;

    await DB.deleteItem(DB.STORES.TRANSACTIONS, txId);
    this.transactions = this.transactions.filter(t => t.id !== txId);

    this.pushUndoAction({
      type: 'DELETE_TRANSACTION',
      description: `Delete transaction "${tx.description}"`,
      undo: async () => {
        await DB.putItem(DB.STORES.TRANSACTIONS, tx);
        this.transactions.push(tx);
        this.notify('TRANSACTION_ADDED', tx);
        this.notify('STATE_UPDATED');
      }
    });

    this.notify('TRANSACTION_DELETED', { id: txId });
    this.notify('STATE_UPDATED');
  }

  // --- Accounts Actions ---
  async saveAccount(acc) {
    await DB.putItem(DB.STORES.ACCOUNTS, acc);
    const idx = this.accounts.findIndex(a => a.id === acc.id);
    if (idx !== -1) {
      this.accounts[idx] = acc;
    } else {
      this.accounts.push(acc);
    }
    this.notify('ACCOUNT_SAVED', acc);
    this.notify('STATE_UPDATED');
    return acc;
  }

  async deleteAccount(accId) {
    const acc = this.accounts.find(a => a.id === accId);
    if (!acc) return;

    await DB.deleteItem(DB.STORES.ACCOUNTS, accId);
    this.accounts = this.accounts.filter(a => a.id !== accId);

    this.pushUndoAction({
      type: 'DELETE_ACCOUNT',
      description: `Delete account "${acc.name}"`,
      undo: async () => {
        await DB.putItem(DB.STORES.ACCOUNTS, acc);
        this.accounts.push(acc);
        this.notify('ACCOUNT_SAVED', acc);
        this.notify('STATE_UPDATED');
      }
    });

    this.notify('ACCOUNT_DELETED', { id: accId });
    this.notify('STATE_UPDATED');
  }

  // --- Budgets Actions ---
  async saveBudget(budget) {
    await DB.putItem(DB.STORES.BUDGETS, budget);
    const idx = this.budgets.findIndex(b => b.id === budget.id || (b.monthKey === budget.monthKey && b.categoryId === budget.categoryId));
    if (idx !== -1) {
      this.budgets[idx] = budget;
    } else {
      this.budgets.push(budget);
    }
    this.notify('BUDGET_SAVED', budget);
    this.notify('STATE_UPDATED');
    return budget;
  }

  async copyBudgetsFromMonth(fromMonthKey, toMonthKey) {
    const sourceBudgets = this.budgets.filter(b => b.monthKey === fromMonthKey);
    const newBudgets = sourceBudgets.map(b => ({
      ...b,
      id: `bg_${toMonthKey}_${b.categoryId}`,
      monthKey: toMonthKey
    }));
    await DB.putBatch(DB.STORES.BUDGETS, newBudgets);
    await this.loadFromDB();
    this.notify('BUDGETS_COPIED');
    this.notify('STATE_UPDATED');
  }

  // --- Goals Actions ---
  async saveGoal(goal) {
    await DB.putItem(DB.STORES.GOALS, goal);
    const idx = this.goals.findIndex(g => g.id === goal.id);
    if (idx !== -1) {
      this.goals[idx] = goal;
    } else {
      this.goals.push(goal);
    }
    this.notify('GOAL_SAVED', goal);
    this.notify('STATE_UPDATED');
    return goal;
  }

  async deleteGoal(goalId) {
    const goal = this.goals.find(g => g.id === goalId);
    if (!goal) return;

    await DB.deleteItem(DB.STORES.GOALS, goalId);
    this.goals = this.goals.filter(g => g.id !== goalId);

    this.pushUndoAction({
      type: 'DELETE_GOAL',
      description: `Delete goal "${goal.name}"`,
      undo: async () => {
        await DB.putItem(DB.STORES.GOALS, goal);
        this.goals.push(goal);
        this.notify('GOAL_SAVED', goal);
        this.notify('STATE_UPDATED');
      }
    });

    this.notify('GOAL_DELETED', { id: goalId });
    this.notify('STATE_UPDATED');
  }

  // --- Recurring Rules Actions ---
  async saveRecurring(rule) {
    await DB.putItem(DB.STORES.RECURRING, rule);
    const idx = this.recurring.findIndex(r => r.id === rule.id);
    if (idx !== -1) {
      this.recurring[idx] = rule;
    } else {
      this.recurring.push(rule);
    }
    this.notify('RECURRING_SAVED', rule);
    this.notify('STATE_UPDATED');
    return rule;
  }

  async deleteRecurring(ruleId) {
    const rule = this.recurring.find(r => r.id === ruleId);
    if (!rule) return;

    await DB.deleteItem(DB.STORES.RECURRING, ruleId);
    this.recurring = this.recurring.filter(r => r.id !== ruleId);

    this.pushUndoAction({
      type: 'DELETE_RECURRING',
      description: `Delete recurring "${rule.name}"`,
      undo: async () => {
        await DB.putItem(DB.STORES.RECURRING, rule);
        this.recurring.push(rule);
        this.notify('RECURRING_SAVED', rule);
        this.notify('STATE_UPDATED');
      }
    });

    this.notify('RECURRING_DELETED', { id: ruleId });
    this.notify('STATE_UPDATED');
  }

  // --- Settings Actions ---
  async saveSetting(key, value) {
    await DB.setSetting(key, value);
    this.settings[key] = value;
    if (key === 'currency') {
      setCurrencyConfig(value);
    }
    this.notify('SETTING_CHANGED', { key, value });
    this.notify('STATE_UPDATED');
  }

  // --- Undo System ---
  pushUndoAction(action) {
    this.undoStack.unshift({
      ...action,
      timestamp: Date.now()
    });
    if (this.undoStack.length > this.maxUndoStack) {
      this.undoStack.pop();
    }
    this.notify('UNDO_AVAILABLE', { action: this.undoStack[0] });
  }

  async executeUndo() {
    if (this.undoStack.length === 0) return null;
    const action = this.undoStack.shift();
    if (action && typeof action.undo === 'function') {
      await action.undo();
      this.notify('UNDO_EXECUTED', { action });
      return action;
    }
    return null;
  }
}

export const state = new StateStore();
export default state;
