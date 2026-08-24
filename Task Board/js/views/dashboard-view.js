/**
 * Dashboard View
 * Displays high-level workspace health, metrics, upcoming deadlines, project progress, and live activity feed
 */

window.DashboardView = {
  render(container) {
    const state = window.State.getState();
    const tasks = window.State.getFilteredTasks();
    const allTasks = state.tasks.filter(t => !t.archived);

    // Compute Metrics
    const completedTasks = allTasks.filter(t => t.status === 'done');
    const overdueTasks = allTasks.filter(t => t.dueDate && window.Utils.isOverdue(t.dueDate) && t.status !== 'done');
    const inProgressTasks = allTasks.filter(t => t.status === 'in-progress');
    const completionRate = allTasks.length === 0 ? 0 : Math.round((completedTasks.length / allTasks.length) * 100);

    // Upcoming deadlines (next 7 days, not done)
    const upcomingDeadlines = allTasks
      .filter(t => t.dueDate && !window.Utils.isOverdue(t.dueDate) && t.status !== 'done')
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);

    container.innerHTML = `
      <div class="dashboard-container">
        <!-- Top Metrics Cards Grid -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-header">
              <span class="metric-title">Tasks Completed</span>
              <div class="metric-icon-wrap success">${window.Icons.get('check', 16)}</div>
            </div>
            <div class="metric-value-row">
              <span class="metric-value">${completedTasks.length}</span>
              <span class="metric-trend positive">${completionRate}% done</span>
            </div>
            <span class="metric-subtitle">${allTasks.length - completedTasks.length} pending items</span>
          </div>

          <div class="metric-card">
            <div class="metric-header">
              <span class="metric-title">Overdue Tasks</span>
              <div class="metric-icon-wrap urgent">${window.Icons.get('alert_triangle', 16)}</div>
            </div>
            <div class="metric-value-row">
              <span class="metric-value">${overdueTasks.length}</span>
              <span class="metric-trend ${overdueTasks.length > 0 ? 'negative' : 'positive'}">
                ${overdueTasks.length > 0 ? 'Requires attention' : 'All on track'}
              </span>
            </div>
            <span class="metric-subtitle">Across active projects</span>
          </div>

          <div class="metric-card">
            <div class="metric-header">
              <span class="metric-title">In Progress</span>
              <div class="metric-icon-wrap primary">${window.Icons.get('arrow_up_down', 16)}</div>
            </div>
            <div class="metric-value-row">
              <span class="metric-value">${inProgressTasks.length}</span>
              <span class="metric-trend neutral">Active sprint</span>
            </div>
            <span class="metric-subtitle">${state.users.length} assignees working</span>
          </div>

          <div class="metric-card">
            <div class="metric-header">
              <span class="metric-title">Active Projects</span>
              <div class="metric-icon-wrap warning">${window.Icons.get('projects', 16)}</div>
            </div>
            <div class="metric-value-row">
              <span class="metric-value">${state.projects.filter(p => p.status === 'active').length}</span>
              <span class="metric-trend positive">Healthy</span>
            </div>
            <span class="metric-subtitle">${state.projects.length} total initiatives</span>
          </div>
        </div>

        <!-- Two Column Main Dashboard Body -->
        <div class="dashboard-columns">
          <!-- Left Main Column: Project Progress & Upcoming Deadlines -->
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <!-- Project Progress Breakdown -->
            <div class="chart-card">
              <div class="chart-card-header">
                <span class="chart-card-title">Project Progress Overview</span>
                <button class="text-btn-sm" id="dashViewAllProjectsBtn">View all projects</button>
              </div>
              <div class="project-progress-list">
                ${state.projects.map(p => {
                  const projTasks = allTasks.filter(t => t.projectId === p.id);
                  const projDone = projTasks.filter(t => t.status === 'done');
                  const pPercent = projTasks.length === 0 ? 0 : Math.round((projDone.length / projTasks.length) * 100);
                  return `
                    <div class="project-progress-item" data-project-id="${p.id}" style="cursor: pointer;">
                      <div class="project-progress-header">
                        <div class="project-progress-title">
                          <span class="project-dot" style="background-color: ${p.color};"></span>
                          <span>${window.Utils.escapeHtml(p.name)}</span>
                        </div>
                        <span class="project-progress-percent">${pPercent}% (${projDone.length}/${projTasks.length})</span>
                      </div>
                      <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${pPercent}%; background-color: ${p.color};"></div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Upcoming Deadlines Card -->
            <div class="chart-card">
              <div class="chart-card-header">
                <span class="chart-card-title">Upcoming Deadlines</span>
                <button class="text-btn-sm" id="dashViewCalendarBtn">Open calendar</button>
              </div>
              <div class="upcoming-deadlines-list" style="display: flex; flex-direction: column; gap: 8px;">
                ${upcomingDeadlines.length === 0 ? `
                  <div class="empty-state" style="padding: 16px;">
                    <span class="empty-state-desc">No upcoming deadlines this week!</span>
                  </div>
                ` : upcomingDeadlines.map(t => {
                  const project = window.State.getProjectById(t.projectId);
                  const assignee = window.State.getUserById(t.assigneeId);
                  const isDueToday = window.Utils.isToday(t.dueDate);
                  return `
                    <div class="list-row upcoming-task-row" data-task-id="${t.id}" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-radius: var(--radius-md); background: var(--bg-surface-subtle); cursor: pointer;">
                      <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                        <span class="priority-badge priority-${t.priority}">${t.priority}</span>
                        <span style="font-weight: 500; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${window.Utils.escapeHtml(t.title)}</span>
                      </div>
                      <div style="display: flex; align-items: center; gap: 10px; flex-shrink: 0;">
                        <span class="task-due-badge ${isDueToday ? 'today' : ''}">
                          ${window.Icons.get('clock', 12)}
                          ${window.Utils.formatShortDate(t.dueDate)}
                        </span>
                        ${assignee ? `<img src="${assignee.avatar}" alt="${window.Utils.escapeHtml(assignee.name)}" class="avatar-xs">` : ''}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <!-- Right Column: Real-time Activity Feed -->
          <div class="chart-card">
            <div class="chart-card-header">
              <span class="chart-card-title">Live Activity Feed</span>
              <span class="badge badge-subtle">Real-time</span>
            </div>
            <div class="activity-feed-list" style="max-height: 480px; overflow-y: auto;">
              ${(!state.activities || state.activities.length === 0) ? `
                <div class="empty-state" style="padding: 24px;">
                  <span class="empty-state-desc">No activity recorded yet</span>
                </div>
              ` : state.activities.slice(0, 15).map(act => {
                const user = window.State.getUserById(act.userId) || { name: 'Staff Member', avatar: '' };
                return `
                  <div class="activity-item">
                    <img src="${user.avatar}" alt="${window.Utils.escapeHtml(user.name)}" class="avatar-sm">
                    <div class="activity-item-content">
                      <div class="activity-item-text">
                        <strong>${window.Utils.escapeHtml(user.name)}</strong>
                        ${act.taskTitle ? ` on <em>"${window.Utils.escapeHtml(act.taskTitle)}"</em>` : ''}
                        <div>${window.Utils.escapeHtml(act.detail)}</div>
                      </div>
                      <span class="activity-item-time">${window.Utils.relativeTime(act.timestamp)}</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    // Event listeners
    const viewAllProj = container.querySelector('#dashViewAllProjectsBtn');
    if (viewAllProj) {
      viewAllProj.addEventListener('click', () => window.State.setActiveView('projects'));
    }

    const viewCal = container.querySelector('#dashViewCalendarBtn');
    if (viewCal) {
      viewCal.addEventListener('click', () => window.State.setActiveView('calendar'));
    }

    container.querySelectorAll('.project-progress-item').forEach(el => {
      el.addEventListener('click', () => {
        const pId = el.getAttribute('data-project-id');
        window.State.setActiveProject(pId);
        window.State.setActiveView('board');
      });
    });

    container.querySelectorAll('.upcoming-task-row').forEach(el => {
      el.addEventListener('click', () => {
        const taskId = el.getAttribute('data-task-id');
        window.Modals.openTaskModal(taskId);
      });
    });
  }
};
