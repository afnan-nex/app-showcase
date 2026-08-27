/**
 * BudgetOS - Analytics & Reports Calculation Engine
 * Produces category breakdowns, monthly trend metrics, savings rates, and merchant leaderboards.
 */

import { formatMonthKey, getMonthKey, addMonths } from '../formatters.js';

/**
 * Generate spending breakdown by category for a given date range or month
 */
export function getCategorySpendingBreakdown(transactions = [], categories = [], filterMonthKey = null) {
  const categoryMap = {};
  categories.forEach(c => { categoryMap[c.id] = c; });

  let expenseTxs = transactions.filter(t => t.type === 'expense');
  if (filterMonthKey) {
    expenseTxs = expenseTxs.filter(t => t.date && t.date.startsWith(filterMonthKey));
  }

  const totals = {};
  let totalExpense = 0;

  expenseTxs.forEach(t => {
    const catId = t.categoryId || 'cat_misc';
    const amt = Number(t.amount) || 0;
    totals[catId] = (totals[catId] || 0) + amt;
    totalExpense += amt;
  });

  const breakdown = Object.keys(totals).map(catId => {
    const amount = totals[catId];
    const cat = categoryMap[catId] || { name: 'Miscellaneous', color: '#64748b', icon: 'tag' };
    const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
    return {
      categoryId: catId,
      name: cat.name,
      color: cat.color,
      icon: cat.icon,
      amount: Math.round(amount * 100) / 100,
      percentage: Number(percentage.toFixed(1))
    };
  });

  // Sort descending by spending amount
  breakdown.sort((a, b) => b.amount - a.amount);

  return {
    totalExpense: Math.round(totalExpense * 100) / 100,
    items: breakdown
  };
}

/**
 * Generate monthly historical trends (Income, Expense, Net Savings, Savings Rate)
 * @param {Array} transactions 
 * @param {number} [monthsCount=6] 
 */
export function getMonthlyTrends(transactions = [], monthsCount = 6) {
  const now = new Date();
  const monthKeys = [];

  for (let i = monthsCount - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mKey = getMonthKey(d);
    monthKeys.push(mKey);
  }

  const trendData = monthKeys.map(mKey => {
    const mTransactions = transactions.filter(t => t.date && t.date.startsWith(mKey));
    let income = 0;
    let expense = 0;

    mTransactions.forEach(t => {
      const amt = Number(t.amount) || 0;
      if (t.type === 'income') income += amt;
      if (t.type === 'expense') expense += amt;
    });

    const netSavings = income - expense;
    const savingsRate = income > 0 ? (netSavings / income) * 100 : 0;

    return {
      monthKey: mKey,
      label: formatMonthKey(mKey),
      shortLabel: new Date(mKey + '-01T00:00:00').toLocaleDateString('en-US', { month: 'short' }),
      income: Math.round(income * 100) / 100,
      expense: Math.round(expense * 100) / 100,
      netSavings: Math.round(netSavings * 100) / 100,
      savingsRate: Number(Math.max(-100, Math.min(100, savingsRate)).toFixed(1))
    };
  });

  return trendData;
}

/**
 * Get top spending merchants/payees
 */
export function getTopMerchants(transactions = [], limit = 5, filterMonthKey = null) {
  let expenseTxs = transactions.filter(t => t.type === 'expense');
  if (filterMonthKey) {
    expenseTxs = expenseTxs.filter(t => t.date && t.date.startsWith(filterMonthKey));
  }

  const merchantTotals = {};
  const merchantCounts = {};

  expenseTxs.forEach(t => {
    const name = t.merchant || t.description || 'Unknown Merchant';
    const amt = Number(t.amount) || 0;
    merchantTotals[name] = (merchantTotals[name] || 0) + amt;
    merchantCounts[name] = (merchantCounts[name] || 0) + 1;
  });

  const list = Object.keys(merchantTotals).map(name => ({
    name,
    total: Math.round(merchantTotals[name] * 100) / 100,
    count: merchantCounts[name]
  }));

  list.sort((a, b) => b.total - a.total);
  return list.slice(0, limit);
}
