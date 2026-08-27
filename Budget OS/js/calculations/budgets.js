/**
 * BudgetOS - Budget Calculation Engine
 * Evaluates monthly category spending vs budgets, calculates remaining balances,
 * usage percentages, warning status, and overall budget health.
 */

import { getMonthKey } from '../formatters.js';

/**
 * Calculate budget performance for a given month
 * @param {string} monthKey - "YYYY-MM"
 * @param {Array} budgets - List of budget objects
 * @param {Array} categories - List of category objects
 * @param {Array} transactions - All transactions
 * @returns {Object} Full breakdown of category budgets and monthly health metrics
 */
export function calculateBudgetPerformance(monthKey, budgets = [], categories = [], transactions = []) {
  const currentMonthKey = monthKey || getMonthKey();
  
  // Filter transactions for this specific month
  const monthTransactions = transactions.filter(tx => {
    return tx.date && tx.date.startsWith(currentMonthKey) && tx.type === 'expense';
  });

  // Calculate actual spending per category in this month
  const spendingPerCat = {};
  monthTransactions.forEach(tx => {
    const catId = tx.categoryId || 'cat_misc';
    spendingPerCat[catId] = (spendingPerCat[catId] || 0) + (Number(tx.amount) || 0);
  });

  // Get budgets configured for this month
  const activeBudgets = budgets.filter(b => b.monthKey === currentMonthKey);
  const budgetMap = {};
  activeBudgets.forEach(b => {
    budgetMap[b.categoryId] = Number(b.amount) || 0;
  });

  // Build category budget items
  const categoryResults = [];
  let totalBudgeted = 0;
  let totalSpentBudgeted = 0;
  let totalSpentUnbudgeted = 0;
  let overBudgetCount = 0;
  let warningCount = 0;

  // Expense categories
  const expenseCategories = categories.filter(c => c.type === 'expense');

  expenseCategories.forEach(cat => {
    const budgeted = budgetMap[cat.id] || 0;
    const spent = spendingPerCat[cat.id] || 0;
    const remaining = budgeted - spent;
    const percentage = budgeted > 0 ? (spent / budgeted) * 100 : (spent > 0 ? 100 : 0);

    let status = 'safe'; // 'safe', 'warning', 'danger'
    if (budgeted > 0) {
      if (percentage >= 100) {
        status = 'danger';
        overBudgetCount++;
      } else if (percentage >= 80) {
        status = 'warning';
        warningCount++;
      }
    } else if (spent > 0) {
      status = 'unbudgeted';
    }

    if (budgeted > 0) {
      totalBudgeted += budgeted;
      totalSpentBudgeted += spent;
    } else {
      totalSpentUnbudgeted += spent;
    }

    categoryResults.push({
      categoryId: cat.id,
      categoryName: cat.name,
      categoryColor: cat.color,
      categoryIcon: cat.icon,
      budgeted,
      spent,
      remaining,
      percentage: Number(percentage.toFixed(1)),
      status,
      isBudgetSet: budgeted > 0
    });
  });

  // Sort: Budgeted categories first (highest % used first), then unbudgeted
  categoryResults.sort((a, b) => {
    if (a.isBudgetSet && !b.isBudgetSet) return -1;
    if (!a.isBudgetSet && b.isBudgetSet) return 1;
    return b.percentage - a.percentage;
  });

  const totalSpent = totalSpentBudgeted + totalSpentUnbudgeted;
  const overallPercentage = totalBudgeted > 0 ? (totalSpentBudgeted / totalBudgeted) * 100 : 0;
  const overallRemaining = Math.max(0, totalBudgeted - totalSpentBudgeted);

  return {
    monthKey: currentMonthKey,
    categories: categoryResults,
    summary: {
      totalBudgeted,
      totalSpent,
      totalSpentBudgeted,
      totalSpentUnbudgeted,
      overallRemaining,
      overallPercentage: Number(overallPercentage.toFixed(1)),
      overBudgetCount,
      warningCount,
      isOverBudget: totalSpentBudgeted > totalBudgeted && totalBudgeted > 0
    }
  };
}
