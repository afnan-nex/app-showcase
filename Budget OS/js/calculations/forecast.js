/**
 * BudgetOS - Cash-Flow Forecast Engine
 * Deterministically simulates future account balances day-by-day over 30-365 days
 * using current balances, active recurring rules, scheduled bills, and discretionary trends.
 */

import { addDays, addMonths, getTodayISO, getDaysBetween } from '../formatters.js';

/**
 * Generate future cash-flow timeline
 * @param {Object} params
 * @param {number} params.horizonDays - Number of days to simulate (e.g. 30, 60, 90, 180, 365)
 * @param {Array} params.accounts - Account list
 * @param {Array} params.transactions - Historical transactions
 * @param {Array} params.recurring - Recurring rules
 * @param {number} [params.safeBuffer=500] - Minimum safe cash balance warning threshold
 * @param {boolean} [params.includeDiscretionary=true] - Whether to factor in baseline daily discretionary spending
 * @returns {Object} Daily projection series and summary statistics
 */
export function generateCashFlowForecast({
  horizonDays = 90,
  accounts = [],
  transactions = [],
  recurring = [],
  safeBuffer = 500,
  includeDiscretionary = false
}) {
  const today = getTodayISO();

  // 1. Calculate current liquid starting balance (Checking + Savings + Cash)
  // We exclude credit card debt from starting liquid cash, but track net liquid
  let currentLiquidCash = 0;
  let totalNetWorth = 0;

  accounts.forEach(acc => {
    // Initial balance + transaction sum
    let bal = Number(acc.initialBalance) || 0;
    transactions.forEach(tx => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'income' && tx.accountId === acc.id) bal += amt;
      if (tx.type === 'expense' && tx.accountId === acc.id) {
        bal += (acc.type === 'creditCard' ? amt : -amt);
      }
      if (tx.type === 'transfer') {
        if (tx.accountId === acc.id) bal -= amt;
        if (tx.toAccountId === acc.id) {
          bal += (acc.type === 'creditCard' ? -amt : amt);
        }
      }
    });

    if (acc.type !== 'creditCard' && !acc.isArchived) {
      currentLiquidCash += bal;
      totalNetWorth += bal;
    } else if (acc.type === 'creditCard' && !acc.isArchived) {
      totalNetWorth -= Math.max(0, bal);
    }
  });

  // 2. Expand recurring schedule over horizon
  const activeRecurring = recurring.filter(r => !r.isPaused);
  const eventsByDate = {};

  activeRecurring.forEach(rule => {
    let cursorDate = rule.nextDueDate || today;
    const amount = Number(rule.amount) || 0;

    // Advance cursor if in the past
    while (cursorDate < today) {
      cursorDate = getNextOccurrence(cursorDate, rule.frequency);
    }

    const maxDate = addDays(today, horizonDays);
    while (cursorDate <= maxDate) {
      if (rule.endDate && cursorDate > rule.endDate) break;

      if (!eventsByDate[cursorDate]) {
        eventsByDate[cursorDate] = [];
      }

      eventsByDate[cursorDate].push({
        id: rule.id,
        name: rule.name,
        amount,
        type: rule.type,
        categoryId: rule.categoryId,
        frequency: rule.frequency
      });

      cursorDate = getNextOccurrence(cursorDate, rule.frequency);
    }
  });

  // 3. Optional: Estimate average daily discretionary spending from recent 30-day non-recurring expenses
  let estimatedDailyDiscretionary = 0;
  if (includeDiscretionary) {
    const thirtyDaysAgo = addDays(today, -30);
    const recentExpenses = transactions.filter(tx => {
      return tx.type === 'expense' && tx.date >= thirtyDaysAgo && tx.date <= today && !tx.recurringId;
    });
    const sumRecent = recentExpenses.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
    estimatedDailyDiscretionary = sumRecent / 30;
  }

  // 4. Simulate day by day
  const timeline = [];
  let runningBalance = currentLiquidCash;
  let totalProjectedIncome = 0;
  let totalProjectedExpense = 0;
  let lowestBalance = runningBalance;
  let lowestBalanceDate = today;
  let highestBalance = runningBalance;
  let belowBufferOccurrences = 0;

  for (let i = 0; i <= horizonDays; i++) {
    const date = addDays(today, i);
    const dayEvents = eventsByDate[date] || [];

    let dayIncome = 0;
    let dayExpense = 0;

    dayEvents.forEach(evt => {
      if (evt.type === 'income') {
        dayIncome += evt.amount;
      } else if (evt.type === 'expense') {
        dayExpense += evt.amount;
      }
      // Internal transfers don't change liquid total (checking <-> savings),
      // but if external, handled by income/expense.
    });

    if (includeDiscretionary && i > 0) {
      dayExpense += estimatedDailyDiscretionary;
    }

    runningBalance = runningBalance + dayIncome - dayExpense;
    totalProjectedIncome += dayIncome;
    totalProjectedExpense += dayExpense;

    if (runningBalance < lowestBalance) {
      lowestBalance = runningBalance;
      lowestBalanceDate = date;
    }
    if (runningBalance > highestBalance) {
      highestBalance = runningBalance;
    }
    if (runningBalance < safeBuffer) {
      belowBufferOccurrences++;
    }

    timeline.push({
      date,
      balance: Math.round(runningBalance * 100) / 100,
      income: dayIncome,
      expense: dayExpense,
      events: dayEvents,
      isBelowBuffer: runningBalance < safeBuffer
    });
  }

  const endingBalance = timeline[timeline.length - 1].balance;
  const netChange = endingBalance - currentLiquidCash;

  return {
    horizonDays,
    startDate: today,
    endDate: addDays(today, horizonDays),
    startBalance: Math.round(currentLiquidCash * 100) / 100,
    endingBalance: Math.round(endingBalance * 100) / 100,
    netChange: Math.round(netChange * 100) / 100,
    totalProjectedIncome: Math.round(totalProjectedIncome * 100) / 100,
    totalProjectedExpense: Math.round(totalProjectedExpense * 100) / 100,
    lowestBalance: Math.round(lowestBalance * 100) / 100,
    lowestBalanceDate,
    highestBalance: Math.round(highestBalance * 100) / 100,
    safeBuffer,
    belowBufferOccurrences,
    timeline
  };
}

/**
 * Calculate next occurrence date string given frequency
 */
export function getNextOccurrence(currentDateStr, frequency) {
  if (frequency === 'daily') {
    return addDays(currentDateStr, 1);
  }
  if (frequency === 'weekly') {
    return addDays(currentDateStr, 7);
  }
  if (frequency === 'biweekly') {
    return addDays(currentDateStr, 14);
  }
  if (frequency === 'monthly') {
    return addMonths(currentDateStr, 1);
  }
  if (frequency === 'yearly') {
    return addMonths(currentDateStr, 12);
  }
  return addDays(currentDateStr, 30);
}
