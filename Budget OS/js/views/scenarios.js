/**
 * BudgetOS - Scenario Builder & What-If Simulator View Controller
 * Sandboxed financial modeling environment comparing baseline forecast vs hypothetical scenario.
 */

import state from '../state.js';
import { getIcon } from '../icons.js';
import { formatCurrency, formatPercent } from '../formatters.js';
import { runScenarioSimulation } from '../calculations/scenarios.js';
import { renderScenarioComparisonChart } from '../charts/svg-charts.js';

let scenarioState = {
  incomePercentChange: 0,
  incomeFixedChange: 0,
  cutExpenseIds: [],
  addedExpenses: [
    { name: '', amount: 0, frequency: 'monthly' }
  ],
  horizonDays: 180
};

export function renderScenariosView(container) {
  const { accounts, transactions, recurring, goals } = state;

  const simulation = runScenarioSimulation({
    accounts,
    transactions,
    recurring,
    goals,
    scenarioParams: scenarioState,
    horizonDays: scenarioState.horizonDays
  });

  const recurringExpenses = recurring.filter(r => r.type === 'expense');

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <div class="sandbox-badge">
          <span class="badge badge-scenario font-mono">SANDBOX SIMULATOR</span>
        </div>
        <h1 class="view-title">Financial Scenario Builder</h1>
        <p class="view-subtitle">Hypothetical modeling sandbox &bull; Safe testing with zero real database modifications</p>
      </div>
      <div class="view-actions">
        <button class="btn btn-secondary" id="btn-reset-scenario">
          ${getIcon('refresh', 'icon-sm')} Reset Sandbox
        </button>
      </div>
    </div>

    <!-- Comparative Delta Scorecard -->
    <div class="metrics-grid scenario-delta-grid">
      <!-- Ending Balance Delta -->
      <div class="metric-card scenario-metric-card">
        <span class="metric-label">Simulated Ending Balance</span>
        <div class="metric-value ${simulation.delta.endingBalanceDelta >= 0 ? 'text-emerald' : 'text-rose'} font-bold">
          ${formatCurrency(simulation.simulated.endingBalance)}
        </div>
        <div class="metric-meta">
          <span>Baseline: ${formatCurrency(simulation.baseline.endingBalance)}</span>
          <span>&bull;</span>
          <span class="font-bold font-mono ${simulation.delta.endingBalanceDelta >= 0 ? 'text-emerald' : 'text-rose'}">
            ${simulation.delta.endingBalanceDelta >= 0 ? '+' : ''}${formatCurrency(simulation.delta.endingBalanceDelta)}
          </span>
        </div>
      </div>

      <!-- Net Cash Flow Delta -->
      <div class="metric-card scenario-metric-card">
        <span class="metric-label">Net Flow Delta (over ${scenarioState.horizonDays}D)</span>
        <div class="metric-value font-mono ${simulation.delta.netCashFlowDelta >= 0 ? 'text-emerald' : 'text-rose'} font-bold">
          ${simulation.delta.netCashFlowDelta >= 0 ? '+' : ''}${formatCurrency(simulation.delta.netCashFlowDelta)}
        </div>
        <div class="metric-meta">
          <span>Income: ${formatCurrency(simulation.delta.incomeDelta, { showSign: true })}</span>
          <span>&bull;</span>
          <span>Spend: ${formatCurrency(simulation.delta.expenseDelta, { showSign: true })}</span>
        </div>
      </div>

      <!-- Lowest Trough Balance -->
      <div class="metric-card scenario-metric-card">
        <span class="metric-label">Simulated Lowest Point</span>
        <div class="metric-value ${simulation.simulated.lowestBalance < 500 ? 'text-warning' : 'text-primary'}">
          ${formatCurrency(simulation.simulated.lowestBalance)}
        </div>
        <div class="metric-meta">
          <span>Baseline lowest: ${formatCurrency(simulation.baseline.lowestBalance)}</span>
        </div>
      </div>

      <!-- Horizon Selector -->
      <div class="metric-card scenario-metric-card">
        <span class="metric-label">Simulation Horizon</span>
        <select id="scenario-horizon-select" class="form-control mt-1">
          <option value="90" ${scenarioState.horizonDays === 90 ? 'selected' : ''}>90 Days (3 Months)</option>
          <option value="180" ${scenarioState.horizonDays === 180 ? 'selected' : ''}>180 Days (6 Months)</option>
          <option value="365" ${scenarioState.horizonDays === 365 ? 'selected' : ''}>365 Days (1 Year)</option>
        </select>
      </div>
    </div>

    <!-- Dual Line Comparison Chart -->
    <div class="card scenario-chart-card mt-6">
      <div class="card-header">
        <div>
          <h2 class="card-title">Trajectory Comparison: Current Plan vs Scenario</h2>
          <p class="card-subtitle">Visualizing divergence in future liquid capital</p>
        </div>
      </div>
      <div class="card-body">
        ${renderScenarioComparisonChart({
          baselineTimeline: simulation.baseline.timeline,
          simulatedTimeline: simulation.simulated.timeline,
          width: 800,
          height: 260
        })}
      </div>
    </div>

    <!-- Levers & Adjustments Grid -->
    <div class="scenario-levers-grid mt-6">
      
      <!-- Lever 1: Income Adjustments -->
      <div class="card lever-card">
        <div class="card-header">
          <h3 class="card-title">${getIcon('salary', 'icon-sm')} Adjust Income</h3>
        </div>
        <div class="card-body">
          <div class="form-group mb-4">
            <label class="form-label text-xs">Income Percentage Change: <strong id="val-income-percent">${scenarioState.incomePercentChange}%</strong></label>
            <input
              type="range"
              id="slider-income-percent"
              class="form-range"
              min="-50"
              max="50"
              step="5"
              value="${scenarioState.incomePercentChange}"
            />
            <div class="range-marks text-xs text-muted">
              <span>-50%</span>
              <span>0%</span>
              <span>+50%</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label text-xs">Or Fixed Monthly Amount (+/-)</label>
            <input
              type="number"
              id="input-income-fixed"
              class="form-control"
              placeholder="e.g. 500 for raise, -300 for drop"
              value="${scenarioState.incomeFixedChange || ''}"
            />
          </div>
        </div>
      </div>

      <!-- Lever 2: Cut Existing Recurring Expenses -->
      <div class="card lever-card">
        <div class="card-header">
          <h3 class="card-title">${getIcon('trash', 'icon-sm')} Cut Recurring Expenses</h3>
        </div>
        <div class="card-body">
          ${recurringExpenses.length === 0 ? `
            <p class="text-muted text-sm">No recurring expenses found to cut.</p>
          ` : `
            <div class="checkbox-list">
              ${recurringExpenses.map(r => {
                const isCut = scenarioState.cutExpenseIds.includes(r.id);
                return `
                  <label class="checkbox-row ${isCut ? 'item-cut' : ''}">
                    <input
                      type="checkbox"
                      class="chk-cut-expense"
                      data-id="${r.id}"
                      ${isCut ? 'checked' : ''}
                    />
                    <span class="chk-label font-medium">${r.name}</span>
                    <span class="chk-amount font-mono text-rose">-${formatCurrency(r.amount)}</span>
                  </label>
                `;
              }).join('')}
            </div>
          `}
        </div>
      </div>

      <!-- Lever 3: Add Hypothetical Ongoing Expenses -->
      <div class="card lever-card col-span-full">
        <div class="card-header">
          <h3 class="card-title">${getIcon('plus', 'icon-sm')} Add Hypothetical Expenses</h3>
          <button class="btn btn-sm btn-secondary" id="btn-add-hypothetical-row">
            + Add Another Expense
          </button>
        </div>
        <div class="card-body">
          <div class="hypo-expenses-list">
            ${scenarioState.addedExpenses.map((exp, idx) => `
              <div class="hypo-expense-row mb-3" data-idx="${idx}">
                <input
                  type="text"
                  class="form-control hypo-name"
                  placeholder="Expense description (e.g. Car Lease, Studio Rent)"
                  value="${exp.name}"
                />
                <input
                  type="number"
                  class="form-control hypo-amount"
                  placeholder="Amount ($)"
                  value="${exp.amount || ''}"
                />
                <select class="form-control hypo-freq">
                  <option value="monthly" ${exp.frequency === 'monthly' ? 'selected' : ''}>Monthly</option>
                  <option value="weekly" ${exp.frequency === 'weekly' ? 'selected' : ''}>Weekly</option>
                  <option value="yearly" ${exp.frequency === 'yearly' ? 'selected' : ''}>Yearly</option>
                </select>
                <button class="btn-icon btn-icon-danger btn-remove-hypo" data-idx="${idx}">
                  ${getIcon('close', 'icon-xs')}
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

    </div>

    <!-- Impact on Goals Table -->
    ${simulation.goalImpacts.length > 0 ? `
      <div class="card scenario-goals-card mt-6">
        <div class="card-header">
          <h2 class="card-title">Impact on Savings Goals</h2>
          <p class="card-subtitle">How this scenario accelerates or delays your targeted milestones</p>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table finance-table">
              <thead>
                <tr>
                  <th>Goal Milestone</th>
                  <th>Target Amount</th>
                  <th>Baseline Time to Goal</th>
                  <th>Simulated Time to Goal</th>
                  <th>Impact</th>
                </tr>
              </thead>
              <tbody>
                ${simulation.goalImpacts.map(g => `
                  <tr>
                    <td class="font-medium text-primary">${g.goalName}</td>
                    <td class="font-mono">${formatCurrency(g.targetAmount)}</td>
                    <td class="font-mono text-muted">${g.baselineMonthsNeeded} months</td>
                    <td class="font-mono font-semibold text-primary">${g.simulatedMonthsNeeded} months</td>
                    <td>
                      ${g.monthsSaved > 0 ? `
                        <span class="badge badge-success font-mono font-semibold">
                          ${getIcon('trendUp', 'icon-xs')} Reached ${g.monthsSaved} mo earlier
                        </span>
                      ` : g.monthsSaved < 0 ? `
                        <span class="badge badge-danger font-mono font-semibold">
                          ${getIcon('trendDown', 'icon-xs')} Delayed by ${Math.abs(g.monthsSaved)} mo
                        </span>
                      ` : `<span class="badge badge-secondary">No change</span>`}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ` : ''}
  `;

  // --- Handlers ---
  container.querySelector('#slider-income-percent')?.addEventListener('input', (e) => {
    scenarioState.incomePercentChange = parseInt(e.target.value, 10);
    renderScenariosView(container);
  });

  container.querySelector('#input-income-fixed')?.addEventListener('change', (e) => {
    scenarioState.incomeFixedChange = parseFloat(e.target.value) || 0;
    renderScenariosView(container);
  });

  container.querySelector('#scenario-horizon-select')?.addEventListener('change', (e) => {
    scenarioState.horizonDays = parseInt(e.target.value, 10);
    renderScenariosView(container);
  });

  container.querySelectorAll('.chk-cut-expense').forEach(chk => {
    chk.addEventListener('change', (e) => {
      const id = chk.dataset.id;
      if (e.target.checked) {
        if (!scenarioState.cutExpenseIds.includes(id)) {
          scenarioState.cutExpenseIds.push(id);
        }
      } else {
        scenarioState.cutExpenseIds = scenarioState.cutExpenseIds.filter(x => x !== id);
      }
      renderScenariosView(container);
    });
  });

  container.querySelector('#btn-add-hypothetical-row')?.addEventListener('click', () => {
    scenarioState.addedExpenses.push({ name: '', amount: 0, frequency: 'monthly' });
    renderScenariosView(container);
  });

  container.querySelectorAll('.hypo-expense-row').forEach(row => {
    const idx = parseInt(row.dataset.idx, 10);
    row.querySelector('.hypo-name')?.addEventListener('change', (e) => {
      scenarioState.addedExpenses[idx].name = e.target.value;
      renderScenariosView(container);
    });
    row.querySelector('.hypo-amount')?.addEventListener('change', (e) => {
      scenarioState.addedExpenses[idx].amount = parseFloat(e.target.value) || 0;
      renderScenariosView(container);
    });
    row.querySelector('.hypo-freq')?.addEventListener('change', (e) => {
      scenarioState.addedExpenses[idx].frequency = e.target.value;
      renderScenariosView(container);
    });
    row.querySelector('.btn-remove-hypo')?.addEventListener('click', () => {
      scenarioState.addedExpenses.splice(idx, 1);
      renderScenariosView(container);
    });
  });

  container.querySelector('#btn-reset-scenario')?.addEventListener('click', () => {
    scenarioState = {
      incomePercentChange: 0,
      incomeFixedChange: 0,
      cutExpenseIds: [],
      addedExpenses: [{ name: '', amount: 0, frequency: 'monthly' }],
      horizonDays: 180
    };
    renderScenariosView(container);
  });
}
