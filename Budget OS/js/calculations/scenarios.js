/**
 * BudgetOS - Financial Scenario Engine
 * Models hypothetical "What-If" modifications against baseline cash-flow projections
 * without modifying real financial records.
 */

import { generateCashFlowForecast } from './forecast.js';
import { addDays, getTodayISO } from '../formatters.js';

/**
 * Run a comparative scenario simulation
 * @param {Object} params
 * @param {Array} params.accounts - Real accounts
 * @param {Array} params.transactions - Real transactions
 * @param {Array} params.recurring - Real recurring rules
 * @param {Array} params.goals - Real goals
 * @param {Object} params.scenarioParams - What-If levers
 * @param {number} [params.horizonDays=180]
 * @returns {Object} Comparative outcome with baseline, simulated, and delta metrics
 */
export function runScenarioSimulation({
  accounts = [],
  transactions = [],
  recurring = [],
  goals = [],
  scenarioParams = {},
  horizonDays = 180
}) {
  // 1. Calculate baseline projection
  const baselineForecast = generateCashFlowForecast({
    horizonDays,
    accounts,
    transactions,
    recurring,
    safeBuffer: 500,
    includeDiscretionary: false
  });

  // 2. Clone recurring list and apply scenario adjustments
  const simulatedRecurring = JSON.parse(JSON.stringify(recurring));

  // A. Modify existing income percentage or fixed bump
  const incomePercentChange = Number(scenarioParams.incomePercentChange) || 0;
  const incomeFixedChange = Number(scenarioParams.incomeFixedChange) || 0;

  if (incomePercentChange !== 0 || incomeFixedChange !== 0) {
    simulatedRecurring.forEach(r => {
      if (r.type === 'income') {
        const base = Number(r.amount) || 0;
        let adjusted = base * (1 + incomePercentChange / 100) + incomeFixedChange;
        r.amount = Math.max(0, Math.round(adjusted * 100) / 100);
      }
    });
  }

  // B. Remove / Pause specific recurring expenses (e.g. cut subscriptions)
  const cutExpenseIds = scenarioParams.cutExpenseIds || [];
  if (cutExpenseIds.length > 0) {
    simulatedRecurring.forEach(r => {
      if (cutExpenseIds.includes(r.id)) {
        r.isPaused = true;
      }
    });
  }

  // C. Add hypothetical new recurring expenses
  const addedExpenses = scenarioParams.addedExpenses || [];
  addedExpenses.forEach((exp, idx) => {
    if (exp.amount > 0) {
      simulatedRecurring.push({
        id: `sim_exp_${idx}`,
        name: exp.name || 'Simulated Expense',
        amount: Number(exp.amount),
        type: 'expense',
        frequency: exp.frequency || 'monthly',
        nextDueDate: exp.startDate || getTodayISO(),
        isPaused: false
      });
    }
  });

  // D. Add hypothetical one-time events (windfalls or big purchases)
  const oneTimeEvents = scenarioParams.oneTimeEvents || [];
  const extraTransactions = [];
  oneTimeEvents.forEach((evt, idx) => {
    if (evt.amount > 0 && evt.date) {
      extraTransactions.push({
        id: `sim_event_${idx}`,
        date: evt.date,
        amount: Number(evt.amount),
        type: evt.type || 'expense',
        description: evt.name || 'Simulated One-Time Event',
        accountId: accounts[0]?.id || 'acc_checking'
      });
    }
  });

  // 3. Calculate simulated forecast
  const simulatedForecast = generateCashFlowForecast({
    horizonDays,
    accounts,
    transactions: [...transactions, ...extraTransactions],
    recurring: simulatedRecurring,
    safeBuffer: 500,
    includeDiscretionary: false
  });

  // 4. Calculate comparative delta metrics
  const endingBalanceDelta = simulatedForecast.endingBalance - baselineForecast.endingBalance;
  const incomeDelta = simulatedForecast.totalProjectedIncome - baselineForecast.totalProjectedIncome;
  const expenseDelta = simulatedForecast.totalProjectedExpense - baselineForecast.totalProjectedExpense;
  const netCashFlowDelta = simulatedForecast.netChange - baselineForecast.netChange;
  const lowestBalanceDelta = simulatedForecast.lowestBalance - baselineForecast.lowestBalance;

  // 5. Impact on Goals
  const goalImpacts = goals.map(goal => {
    const target = Number(goal.targetAmount) || 0;
    const current = Number(goal.currentAmount) || 0;
    const remaining = Math.max(0, target - current);
    const baseMonthlyContrib = Number(goal.monthlyContribution) || 0;

    // Monthly delta per month in scenario
    const monthlyNetDelta = netCashFlowDelta / (horizonDays / 30);
    const boostedMonthlyContrib = Math.max(0, baseMonthlyContrib + (monthlyNetDelta > 0 ? monthlyNetDelta * 0.4 : 0));

    const baselineMonthsNeeded = baseMonthlyContrib > 0 ? remaining / baseMonthlyContrib : null;
    const simulatedMonthsNeeded = boostedMonthlyContrib > 0 ? remaining / boostedMonthlyContrib : null;

    let monthsSaved = 0;
    if (baselineMonthsNeeded !== null && simulatedMonthsNeeded !== null) {
      monthsSaved = Math.round((baselineMonthsNeeded - simulatedMonthsNeeded) * 10) / 10;
    }

    return {
      goalId: goal.id,
      goalName: goal.name,
      targetAmount: target,
      currentAmount: current,
      baseMonthlyContrib,
      boostedMonthlyContrib: Math.round(boostedMonthlyContrib),
      baselineMonthsNeeded: baselineMonthsNeeded ? Math.round(baselineMonthsNeeded * 10) / 10 : 'N/A',
      simulatedMonthsNeeded: simulatedMonthsNeeded ? Math.round(simulatedMonthsNeeded * 10) / 10 : 'N/A',
      monthsSaved
    };
  });

  return {
    horizonDays,
    baseline: baselineForecast,
    simulated: simulatedForecast,
    delta: {
      endingBalanceDelta: Math.round(endingBalanceDelta * 100) / 100,
      incomeDelta: Math.round(incomeDelta * 100) / 100,
      expenseDelta: Math.round(expenseDelta * 100) / 100,
      netCashFlowDelta: Math.round(netCashFlowDelta * 100) / 100,
      lowestBalanceDelta: Math.round(lowestBalanceDelta * 100) / 100
    },
    goalImpacts
  };
}
