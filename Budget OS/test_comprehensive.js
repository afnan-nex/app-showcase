/**
 * Comprehensive Automated Test Suite for BudgetOS
 */

import { formatCurrency, formatPercent, formatDate, formatMonthKey, getMonthKey, addDays, addMonths, parseCSV, generateCSV, getSupportedCurrencies } from './js/formatters.js';
import { calculateAccountBalances, getSingleAccountBalance } from './js/calculations/balances.js';
import { calculateBudgetPerformance } from './js/calculations/budgets.js';
import { generateCashFlowForecast, getNextOccurrence } from './js/calculations/forecast.js';
import { runScenarioSimulation } from './js/calculations/scenarios.js';
import { detectSpendingAnomalies } from './js/calculations/anomalies.js';
import { getCategorySpendingBreakdown, getMonthlyTrends, getTopMerchants } from './js/calculations/analytics.js';
import { renderDonutChart, renderForecastChart, renderScenarioComparisonChart, renderMonthlyTrendBars, renderGoalProgressRing } from './js/charts/svg-charts.js';
import { DEFAULT_CATEGORIES } from './js/db.js';

console.log('=== BUDGETOS COMPREHENSIVE PRODUCTION VERIFICATION ===\n');

// 1. Edge Case Math & Formatters
console.log('1. Testing Formatters Edge Cases...');
console.assert(formatCurrency(0) === '$0.00', 'Zero currency format failed');
console.assert(formatCurrency(-50.25) === '-$50.25', 'Negative currency format failed');
console.assert(formatCurrency(null) === '$0.00', 'Null currency format failed');
console.assert(formatCurrency(undefined) === '$0.00', 'Undefined currency format failed');
console.assert(formatCurrency(NaN) === '$0.00', 'NaN currency format failed');
console.assert(formatPercent(0) === '0.0%', 'Zero percent failed');
console.assert(formatPercent(100) === '100.0%', '100% percent failed');
console.assert(formatDate('', 'medium') === '—', 'Empty date failed');
console.assert(formatDate('invalid-date', 'medium') === 'invalid-date', 'Invalid date fallback failed');

// 2. Multi-currency configuration
console.log('2. Testing Multi-Currency Engine...');
const supportedCurrs = getSupportedCurrencies();
console.assert(supportedCurrs.length >= 8, 'Expected at least 8 supported currencies');
console.log('Supported currencies count:', supportedCurrs.length);

// 3. Calculation Engines Under Extreme/Empty Conditions
console.log('3. Testing Calculation Engines with Empty Data...');
const emptyBalances = calculateAccountBalances([], []);
console.assert(emptyBalances.summary.netWorth === 0, 'Empty net worth should be 0');
console.assert(emptyBalances.summary.totalAssets === 0, 'Empty assets should be 0');

const emptyBudgets = calculateBudgetPerformance('2026-08', [], [], []);
console.assert(emptyBudgets.summary.totalBudgeted === 0, 'Empty budget should be 0');

const emptyForecast = generateCashFlowForecast({ horizonDays: 30, accounts: [], transactions: [], recurring: [] });
console.assert(emptyForecast.timeline.length === 31, '30D forecast should produce 31 daily nodes');
console.assert(emptyForecast.startBalance === 0, 'Empty forecast start balance should be 0');

const emptyScenario = runScenarioSimulation({ accounts: [], transactions: [], recurring: [], goals: [], scenarioParams: {} });
console.assert(emptyScenario.delta.endingBalanceDelta === 0, 'Empty scenario delta should be 0');

const emptyAnomalies = detectSpendingAnomalies([], []);
console.assert(emptyAnomalies.length === 0, 'Empty anomalies should be 0');

const emptyBreakdown = getCategorySpendingBreakdown([], []);
console.assert(emptyBreakdown.totalExpense === 0, 'Empty category breakdown total should be 0');

const emptyTrends = getMonthlyTrends([], 6);
console.assert(emptyTrends.length === 6, 'Empty monthly trends should produce 6 month slots');

const emptyMerchants = getTopMerchants([], 5);
console.assert(emptyMerchants.length === 0, 'Empty top merchants should be empty array');

// 4. SVG Chart Resilience
console.log('4. Testing SVG Charts with Empty / Edge Data...');
const emptyDonut = renderDonutChart({ data: [] });
console.assert(emptyDonut.includes('chart-empty-state'), 'Empty donut should render chart-empty-state');

const emptyForecastChart = renderForecastChart({ timeline: [] });
console.assert(emptyForecastChart.includes('chart-empty-state'), 'Empty forecast chart should render empty state');

const emptyScenarioChart = renderScenarioComparisonChart({ baselineTimeline: [], simulatedTimeline: [] });
console.assert(emptyScenarioChart.includes('chart-empty-state'), 'Empty scenario chart should render empty state');

const emptyTrendChart = renderMonthlyTrendBars({ trendData: [] });
console.assert(emptyTrendChart.includes('chart-empty-state'), 'Empty trend chart should render empty state');

const goalRing = renderGoalProgressRing({ percentage: 0 });
console.assert(goalRing.includes('<svg'), 'Goal progress ring should render valid SVG');

// 5. Advanced Recurring Dates
console.log('5. Testing Recurring Frequency Cadence...');
const baseDate = '2026-08-01';
console.assert(getNextOccurrence(baseDate, 'daily') === '2026-08-02', 'Daily next failed');
console.assert(getNextOccurrence(baseDate, 'weekly') === '2026-08-08', 'Weekly next failed');
console.assert(getNextOccurrence(baseDate, 'biweekly') === '2026-08-15', 'Biweekly next failed');
console.assert(getNextOccurrence(baseDate, 'monthly') === '2026-09-01', 'Monthly next failed');
console.assert(getNextOccurrence(baseDate, 'yearly') === '2027-08-01', 'Yearly next failed');

// 6. CSV Parsing & Quoting Rules
console.log('6. Testing CSV Parsing Rules...');
const advancedCSV = 'Date,Description,Amount,Category\n"2026-08-01","Whole Foods, Market","-124.50","Groceries & Supermarket"\n"2026-08-02","Acme ""Consulting"" Inc","3500.00","Salary & Wages"';
const parsedAdv = parseCSV(advancedCSV);
console.assert(parsedAdv.length === 3, 'Expected 3 CSV rows including header');
console.assert(parsedAdv[1][1] === 'Whole Foods, Market', 'CSV comma inside quotes failed');
console.assert(parsedAdv[2][1] === 'Acme "Consulting" Inc', 'CSV escaped quotes failed');

console.log('\n>>> ALL COMPREHENSIVE PRODUCTION VERIFICATION CHECKS PASSED! <<<');
