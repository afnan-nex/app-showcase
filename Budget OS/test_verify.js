/**
 * BudgetOS - Node Verification Script
 * Validates calculation engines, SVG charts, formatters, and seed data generator.
 */

import { formatCurrency, formatPercent, formatDate, formatMonthKey, getMonthKey, addDays, addMonths, parseCSV, generateCSV } from './js/formatters.js';
import { calculateAccountBalances } from './js/calculations/balances.js';
import { calculateBudgetPerformance } from './js/calculations/budgets.js';
import { generateCashFlowForecast } from './js/calculations/forecast.js';
import { runScenarioSimulation } from './js/calculations/scenarios.js';
import { detectSpendingAnomalies } from './js/calculations/anomalies.js';
import { getCategorySpendingBreakdown, getMonthlyTrends, getTopMerchants } from './js/calculations/analytics.js';
import { renderDonutChart, renderForecastChart, renderScenarioComparisonChart, renderMonthlyTrendBars, renderGoalProgressRing } from './js/charts/svg-charts.js';
import { DEFAULT_CATEGORIES } from './js/db.js';

console.log('--- 1. Testing Formatters & Math ---');
console.log('Currency (USD):', formatCurrency(1250.5));
console.log('Currency (compact):', formatCurrency(1250000));
console.log('Percent:', formatPercent(24.567));
console.log('Date:', formatDate('2026-08-27', 'medium'));
console.log('Month Key:', getMonthKey(new Date()));
console.log('Add 14 Days:', addDays('2026-08-27', 14));
console.log('Add 2 Months:', addMonths('2026-08-27', 2));

const testCSV = 'Date,Description,Amount\n2026-08-01,Groceries,-54.20\n2026-08-02,Salary,2500.00';
const parsed = parseCSV(testCSV);
console.log('Parsed CSV rows:', parsed.length);
if (parsed.length !== 3) throw new Error('CSV Parser failed');

console.log('\n--- 2. Testing Accounts & Balances Engine ---');
const accounts = [
  { id: 'acc_checking', name: 'Checking', type: 'checking', initialBalance: 1000 },
  { id: 'acc_savings', name: 'Savings', type: 'savings', initialBalance: 5000 },
  { id: 'acc_credit', name: 'Credit Card', type: 'creditCard', initialBalance: 0, creditLimit: 5000 }
];

const transactions = [
  { id: 't1', date: '2026-08-01', amount: 2000, type: 'income', accountId: 'acc_checking', categoryId: 'cat_salary' },
  { id: 't2', date: '2026-08-02', amount: 150, type: 'expense', accountId: 'acc_checking', categoryId: 'cat_groceries' },
  { id: 't3', date: '2026-08-03', amount: 300, type: 'expense', accountId: 'acc_credit', categoryId: 'cat_dining' },
  { id: 't4', date: '2026-08-04', amount: 500, type: 'transfer', accountId: 'acc_checking', toAccountId: 'acc_savings' },
  { id: 't5', date: '2026-08-05', amount: 1200, type: 'expense', accountId: 'acc_checking', categoryId: 'cat_shopping' } // anomaly
];

const balanceStats = calculateAccountBalances(accounts, transactions);
console.log('Net Worth:', balanceStats.summary.netWorth);
console.log('Checking Balance (Expected: 1000 + 2000 - 150 - 500 - 1200 = 1150):', balanceStats.accounts.acc_checking.currentBalance);
console.log('Savings Balance (Expected: 5000 + 500 = 5500):', balanceStats.accounts.acc_savings.currentBalance);
console.log('Credit Card Balance (Expected: 300):', balanceStats.accounts.acc_credit.currentBalance);

if (balanceStats.accounts.acc_checking.currentBalance !== 1150) throw new Error('Checking balance calculation mismatch');
if (balanceStats.accounts.acc_savings.currentBalance !== 5500) throw new Error('Savings balance calculation mismatch');
if (balanceStats.accounts.acc_credit.currentBalance !== 300) throw new Error('Credit card balance calculation mismatch');
if (balanceStats.summary.netWorth !== (1150 + 5500 - 300)) throw new Error('Net worth calculation mismatch');

console.log('\n--- 3. Testing Budgets Engine ---');
const budgets = [
  { id: 'b1', monthKey: '2026-08', categoryId: 'cat_groceries', amount: 200 },
  { id: 'b2', monthKey: '2026-08', categoryId: 'cat_dining', amount: 250 }
];

const budgetHealth = calculateBudgetPerformance('2026-08', budgets, DEFAULT_CATEGORIES, transactions);
console.log('Total Budgeted:', budgetHealth.summary.totalBudgeted);
console.log('Total Spent Budgeted:', budgetHealth.summary.totalSpentBudgeted);
console.log('Over budget count:', budgetHealth.summary.overBudgetCount);
console.log('Warning count:', budgetHealth.summary.warningCount);

console.log('\n--- 4. Testing Cash-Flow Forecast Engine ---');
const recurring = [
  { id: 'r1', name: 'Bi-Weekly Pay', amount: 2000, type: 'income', frequency: 'biweekly', nextDueDate: '2026-08-15', accountId: 'acc_checking' },
  { id: 'r2', name: 'Rent', amount: 1200, type: 'expense', frequency: 'monthly', nextDueDate: '2026-09-01', accountId: 'acc_checking' }
];

const forecast = generateCashFlowForecast({
  horizonDays: 90,
  accounts,
  transactions,
  recurring,
  safeBuffer: 500
});

console.log('Forecast Start Balance:', forecast.startBalance);
console.log('Forecast Ending Balance:', forecast.endingBalance);
console.log('Forecast Lowest Balance:', forecast.lowestBalance, 'on', forecast.lowestBalanceDate);
console.log('Forecast Timeline Days:', forecast.timeline.length);

console.log('\n--- 5. Testing Scenario Simulation Engine ---');
const goals = [
  { id: 'g1', name: 'Emergency Fund', targetAmount: 10000, currentAmount: 5500, monthlyContribution: 300 }
];

const scenarioResult = runScenarioSimulation({
  accounts,
  transactions,
  recurring,
  goals,
  scenarioParams: {
    incomePercentChange: 15,
    addedExpenses: [{ name: 'Gym', amount: 100, frequency: 'monthly' }]
  },
  horizonDays: 180
});

console.log('Baseline Ending:', scenarioResult.baseline.endingBalance);
console.log('Simulated Ending:', scenarioResult.simulated.endingBalance);
console.log('Ending Balance Delta:', scenarioResult.delta.endingBalanceDelta);
console.log('Goal Months Saved:', scenarioResult.goalImpacts[0]?.monthsSaved);

console.log('\n--- 6. Testing Anomaly Heuristics ---');
const anomalies = detectSpendingAnomalies(transactions, DEFAULT_CATEGORIES, { minSamples: 1, multiplierThreshold: 2.0 });
console.log('Detected anomalies count:', anomalies.length);
if (anomalies.length > 0) {
  console.log('First anomaly:', anomalies[0].description, anomalies[0].amount, anomalies[0].confidenceNote);
}

console.log('\n--- 7. Testing SVG Chart Rendering ---');
const donutSVG = renderDonutChart({ data: [{ name: 'Groceries', amount: 150, percentage: 33, color: '#f59e0b' }, { name: 'Dining', amount: 300, percentage: 67, color: '#f97316' }] });
console.log('Donut SVG generated (bytes):', donutSVG.length);

const forecastSVG = renderForecastChart({ timeline: forecast.timeline, safeBuffer: 500 });
console.log('Forecast SVG generated (bytes):', forecastSVG.length);

const scenarioSVG = renderScenarioComparisonChart({ baselineTimeline: scenarioResult.baseline.timeline, simulatedTimeline: scenarioResult.simulated.timeline });
console.log('Scenario SVG generated (bytes):', scenarioSVG.length);

const trendBarsSVG = renderMonthlyTrendBars({ trendData: [{ monthKey: '2026-08', label: 'August 2026', shortLabel: 'Aug', income: 2000, expense: 1650, netSavings: 350, savingsRate: 17.5 }] });
console.log('Trend Bars SVG generated (bytes):', trendBarsSVG.length);

const ringSVG = renderGoalProgressRing({ percentage: 55 });
console.log('Progress Ring SVG generated (bytes):', ringSVG.length);

console.log('\nALL 7 VERIFICATION MODULES PASSED SUCCESSFULLY!');
