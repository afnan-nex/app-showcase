/**
 * BudgetOS - Savings Goals View Controller
 * Manage savings goals, calculate required monthly contributions, deadline feasibility,
 * and record deposits.
 */

import state from '../state.js';
import { getIcon } from '../icons.js';
import { formatCurrency, formatPercent, formatDate, getDaysBetween } from '../formatters.js';
import { renderGoalProgressRing } from '../charts/svg-charts.js';

export function renderGoalsView(container) {
  const { goals, accounts } = state;
  const accMap = {};
  accounts.forEach(a => { accMap[a.id] = a; });

  const activeGoals = goals.filter(g => !g.isCompleted);
  const completedGoals = goals.filter(g => g.isCompleted);

  // Calculate totals
  let totalTarget = 0;
  let totalSaved = 0;
  goals.forEach(g => {
    totalTarget += Number(g.targetAmount) || 0;
    totalSaved += Number(g.currentAmount) || 0;
  });
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">Savings Goals</h1>
        <p class="view-subtitle">Track targeted savings milestones and required monthly contributions</p>
      </div>
      <div class="view-actions">
        <button class="btn btn-primary" id="btn-add-goal">
          ${getIcon('plus', 'icon-sm')} Create Goal
        </button>
      </div>
    </div>

    <!-- Goals Summary Banner -->
    <div class="card goals-summary-card">
      <div class="goals-kpi-block">
        <span class="kpi-lbl">Total Goal Targets</span>
        <span class="kpi-val text-primary font-bold">${formatCurrency(totalTarget)}</span>
      </div>
      <div class="kpi-divider"></div>
      <div class="goals-kpi-block">
        <span class="kpi-lbl">Total Accumulated</span>
        <span class="kpi-val text-emerald font-bold">${formatCurrency(totalSaved)}</span>
      </div>
      <div class="kpi-divider"></div>
      <div class="goals-kpi-block">
        <span class="kpi-lbl">Remaining Needed</span>
        <span class="kpi-val text-secondary font-bold">${formatCurrency(Math.max(0, totalTarget - totalSaved))}</span>
      </div>
      <div class="kpi-divider"></div>
      <div class="goals-kpi-block">
        <span class="kpi-lbl">Overall Completion</span>
        <span class="kpi-val text-primary font-mono">${formatPercent(overallProgress)}</span>
      </div>
    </div>

    <!-- Active Goals Grid -->
    <div class="goals-cards-grid mt-6">
      ${activeGoals.length === 0 ? `
        <div class="card p-8 text-center text-muted col-span-full">
          <p>No active savings goals yet. Create one to begin tracking progress!</p>
        </div>
      ` : activeGoals.map(goal => {
        const target = Number(goal.targetAmount) || 0;
        const current = Number(goal.currentAmount) || 0;
        const remaining = Math.max(0, target - current);
        const percent = target > 0 ? Math.min(100, (current / target) * 100) : 0;
        const linkedAcc = accMap[goal.accountId];

        // Math for monthly contribution needed
        let monthlyReq = Number(goal.monthlyContribution) || 0;
        let monthsLeft = 0;
        if (goal.targetDate) {
          const days = getDaysBetween(new Date().toISOString().split('T')[0], goal.targetDate);
          monthsLeft = Math.max(1, Math.round(days / 30));
          if (remaining > 0) {
            monthlyReq = remaining / monthsLeft;
          }
        }

        return `
          <div class="card goal-card" style="--goal-color: ${goal.color || '#10b981'};">
            <div class="goal-card-header">
              <div class="goal-icon-box" style="background-color: ${goal.color || '#10b981'}20; color: ${goal.color || '#10b981'};">
                ${getIcon(goal.icon || 'shield', 'icon-md')}
              </div>
              <div class="goal-meta-block">
                <h3 class="goal-name font-semibold text-primary">${goal.name}</h3>
                ${linkedAcc ? `<span class="goal-linked-acc text-xs text-muted">In ${linkedAcc.name}</span>` : ''}
              </div>
              <div class="goal-actions">
                <button class="btn-icon btn-edit-goal" data-id="${goal.id}" title="Edit Goal">
                  ${getIcon('edit', 'icon-xs')}
                </button>
                <button class="btn-icon btn-icon-danger btn-delete-goal" data-id="${goal.id}" title="Delete Goal">
                  ${getIcon('trash', 'icon-xs')}
                </button>
              </div>
            </div>

            <div class="goal-card-body">
              <div class="goal-progress-row">
                <div class="goal-progress-ring-box">
                  ${renderGoalProgressRing({
                    percentage: percent,
                    size: 64,
                    strokeWidth: 6,
                    color: goal.color || '#10b981'
                  })}
                  <span class="ring-percent-text text-xs font-bold font-mono">${formatPercent(percent, 0)}</span>
                </div>
                <div class="goal-amounts-box">
                  <div class="text-xs text-muted">Saved so far</div>
                  <div class="font-mono text-xl font-bold text-emerald">${formatCurrency(current)}</div>
                  <div class="text-xs text-muted">of ${formatCurrency(target)} target</div>
                </div>
              </div>

              <div class="goal-stats-panel mt-4">
                <div class="goal-stat-item">
                  <span class="text-xs text-muted">Target Deadline</span>
                  <span class="text-xs font-semibold text-primary">${goal.targetDate ? formatDate(goal.targetDate, 'medium') : 'No deadline'}</span>
                </div>
                <div class="goal-stat-item text-right">
                  <span class="text-xs text-muted">Req. Contribution</span>
                  <span class="text-xs font-semibold text-primary font-mono">${formatCurrency(monthlyReq, { hideDecimals: true })}/mo</span>
                </div>
              </div>
            </div>

            <div class="goal-card-footer">
              <button class="btn btn-secondary btn-sm w-full btn-deposit-goal" data-id="${goal.id}">
                ${getIcon('plus', 'icon-xs')} Add Funds
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    ${completedGoals.length > 0 ? `
      <div class="completed-goals-section mt-8">
        <h3 class="text-muted text-sm uppercase mb-3">Completed Goals (${completedGoals.length})</h3>
        <div class="goals-cards-grid opacity-75">
          ${completedGoals.map(goal => `
            <div class="card goal-card border-success">
              <div class="goal-card-header">
                <div class="goal-icon-box bg-emerald-light text-emerald">
                  ${getIcon('check', 'icon-md')}
                </div>
                <div class="goal-meta-block">
                  <h3 class="goal-name font-semibold text-primary">${goal.name}</h3>
                  <span class="badge badge-success text-xs">Completed!</span>
                </div>
                <span class="font-mono font-bold text-emerald">${formatCurrency(goal.targetAmount)}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;

  // --- Handlers ---
  container.querySelector('#btn-add-goal')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('OPEN_GOAL_MODAL'));
  });

  container.querySelectorAll('.btn-edit-goal').forEach(btn => {
    btn.addEventListener('click', () => {
      const goal = goals.find(g => g.id === btn.dataset.id);
      if (goal) {
        window.dispatchEvent(new CustomEvent('OPEN_GOAL_MODAL', { detail: { goal } }));
      }
    });
  });

  container.querySelectorAll('.btn-delete-goal').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (confirm('Delete this savings goal?')) {
        await state.deleteGoal(id);
        renderGoalsView(container);
      }
    });
  });

  container.querySelectorAll('.btn-deposit-goal').forEach(btn => {
    btn.addEventListener('click', () => {
      const goal = goals.find(g => g.id === btn.dataset.id);
      if (goal) {
        window.dispatchEvent(new CustomEvent('OPEN_DEPOSIT_MODAL', { detail: { goal } }));
      }
    });
  });
}
