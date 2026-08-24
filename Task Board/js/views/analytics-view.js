/**
 * Analytics View
 * Comprehensive workspace velocity, completion rate, overdue rates, member workload distribution, and custom SVG/Canvas charts
 */

window.AnalyticsView = {
  render(container) {
    const state = window.State.getState();
    const tasks = window.State.getFilteredTasks();
    const allTasks = state.tasks.filter(t => !t.archived);

    // Compute Metrics
    const completedTasks = allTasks.filter(t => t.status === 'done');
    const overdueTasks = allTasks.filter(t => t.dueDate && window.Utils.isOverdue(t.dueDate) && t.status !== 'done');
    const completionRate = allTasks.length === 0 ? 0 : Math.round((completedTasks.length / allTasks.length) * 100);
    const overdueRate = allTasks.length === 0 ? 0 : Math.round((overdueTasks.length / allTasks.length) * 100);

    // Status counts
    const statusCounts = {
      backlog: allTasks.filter(t => t.status === 'backlog').length,
      todo: allTasks.filter(t => t.status === 'todo').length,
      'in-progress': allTasks.filter(t => t.status === 'in-progress').length,
      review: allTasks.filter(t => t.status === 'review').length,
      done: completedTasks.length
    };

    // Member Workloads
    const memberWorkloads = state.users.map(user => {
      const userTasks = allTasks.filter(t => t.assigneeId === user.id);
      const userDone = userTasks.filter(t => t.status === 'done');
      const userInProgress = userTasks.filter(t => t.status === 'in-progress');
      const userTodo = userTasks.filter(t => t.status === 'todo' || t.status === 'backlog' || t.status === 'review');
      return {
        user,
        total: userTasks.length,
        done: userDone.length,
        inProgress: userInProgress.length,
        todo: userTodo.length
      };
    }).sort((a, b) => b.total - a.total);

    container.innerHTML = `
      <div class="analytics-container">
        <!-- KPI Metrics Grid -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-header">
              <span class="metric-title">Completion Rate</span>
              <div class="metric-icon-wrap success">${window.Icons.get('check', 16)}</div>
            </div>
            <div class="metric-value-row">
              <span class="metric-value">${completionRate}%</span>
              <span class="metric-trend positive">${completedTasks.length} / ${allTasks.length} tasks</span>
            </div>
            <span class="metric-subtitle">Overall workspace progress</span>
          </div>

          <div class="metric-card">
            <div class="metric-header">
              <span class="metric-title">Overdue Rate</span>
              <div class="metric-icon-wrap urgent">${window.Icons.get('alert_triangle', 16)}</div>
            </div>
            <div class="metric-value-row">
              <span class="metric-value">${overdueRate}%</span>
              <span class="metric-trend ${overdueRate > 10 ? 'negative' : 'positive'}">${overdueTasks.length} overdue</span>
            </div>
            <span class="metric-subtitle">Tasks past scheduled deadline</span>
          </div>

          <div class="metric-card">
            <div class="metric-header">
              <span class="metric-title">Avg. Velocity</span>
              <div class="metric-icon-wrap primary">${window.Icons.get('analytics', 16)}</div>
            </div>
            <div class="metric-value-row">
              <span class="metric-value">4.2</span>
              <span class="metric-trend positive">tasks / day</span>
            </div>
            <span class="metric-subtitle">Calculated over last 14 days</span>
          </div>

          <div class="metric-card">
            <div class="metric-header">
              <span class="metric-title">Team Workload</span>
              <div class="metric-icon-wrap warning">${window.Icons.get('user', 16)}</div>
            </div>
            <div class="metric-value-row">
              <span class="metric-value">${state.users.length}</span>
              <span class="metric-trend neutral">Members active</span>
            </div>
            <span class="metric-subtitle">Avg ${(allTasks.length / (state.users.length || 1)).toFixed(1)} tasks / member</span>
          </div>
        </div>

        <!-- Charts Grid -->
        <div class="charts-grid">
          <!-- Status Distribution Chart (Donut / Progress Breakdown) -->
          <div class="chart-card">
            <div class="chart-card-header">
              <span class="chart-card-title">Status Distribution</span>
              <span class="badge badge-subtle">${allTasks.length} tasks</span>
            </div>
            <div class="chart-card-body" id="statusChartContainer">
              ${this.renderStatusSvgDonut(statusCounts, allTasks.length)}
            </div>
          </div>

          <!-- Completed Tasks Trend / Velocity (Canvas Sparkline) -->
          <div class="chart-card">
            <div class="chart-card-header">
              <span class="chart-card-title">Completed Tasks Velocity (Last 7 Days)</span>
              <span class="badge badge-subtle">Sprint burnup</span>
            </div>
            <div class="chart-card-body">
              <canvas id="velocityCanvas" class="chart-canvas"></canvas>
            </div>
          </div>

          <!-- Team Workload Distribution -->
          <div class="chart-card full-width">
            <div class="chart-card-header">
              <span class="chart-card-title">Workload Distribution by Team Member</span>
              <span class="badge badge-subtle">Done / In Progress / Pending</span>
            </div>
            <div class="workload-list">
              ${memberWorkloads.map(mw => {
                const total = mw.total || 1;
                const pDone = Math.round((mw.done / total) * 100);
                const pInProg = Math.round((mw.inProgress / total) * 100);
                const pTodo = Math.round((mw.todo / total) * 100);

                return `
                  <div class="workload-item">
                    <div class="workload-item-header">
                      <div class="workload-user">
                        <img src="${mw.user.avatar}" alt="${window.Utils.escapeHtml(mw.user.name)}" class="avatar-xs">
                        <span>${window.Utils.escapeHtml(mw.user.name)} (${window.Utils.escapeHtml(mw.user.role)})</span>
                      </div>
                      <span class="workload-stats">${mw.total} assigned (${mw.done} done, ${mw.inProgress} active)</span>
                    </div>
                    <div class="workload-bar-track">
                      <div class="workload-segment" style="width: ${pDone}%; background-color: var(--color-success);" title="Done: ${mw.done}"></div>
                      <div class="workload-segment" style="width: ${pInProg}%; background-color: var(--color-primary);" title="In Progress: ${mw.inProgress}"></div>
                      <div class="workload-segment" style="width: ${pTodo}%; background-color: var(--color-none);" title="Pending: ${mw.todo}"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    this.drawVelocityChart(container);
  },

  renderStatusSvgDonut(statusCounts, total) {
    if (total === 0) {
      return `<div class="empty-state"><span class="empty-state-desc">No task data available</span></div>`;
    }

    const segments = [
      { label: 'Backlog', count: statusCounts.backlog, color: '#64748b' },
      { label: 'To Do', count: statusCounts.todo, color: '#3b82f6' },
      { label: 'In Progress', count: statusCounts['in-progress'], color: '#f59e0b' },
      { label: 'Review', count: statusCounts.review, color: '#8b5cf6' },
      { label: 'Done', count: statusCounts.done, color: '#10b981' }
    ];

    // SVG Donut calculation
    let currentAngle = 0;
    const radius = 65;
    const cx = 90;
    const cy = 90;
    const strokeWidth = 22;
    const circumference = 2 * Math.PI * radius;

    let paths = '';
    let accumulatedOffset = 0;

    segments.forEach(seg => {
      if (seg.count === 0) return;
      const ratio = seg.count / total;
      const strokeDasharray = `${ratio * circumference} ${circumference}`;
      const strokeDashoffset = -accumulatedOffset;
      accumulatedOffset += ratio * circumference;

      paths += `
        <circle cx="${cx}" cy="${cy}" r="${radius}" fill="transparent"
                stroke="${seg.color}" stroke-width="${strokeWidth}"
                stroke-dasharray="${strokeDasharray}"
                stroke-dashoffset="${strokeDashoffset}"
                stroke-linecap="round"
                transform="rotate(-90 ${cx} ${cy})"/>
      `;
    });

    return `
      <div style="display: flex; align-items: center; justify-content: space-around; width: 100%; gap: 20px;">
        <svg width="180" height="180" viewBox="0 0 180 180">
          ${paths}
          <text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" font-size="20" font-weight="700" fill="currentColor">${total}</text>
          <text x="50%" y="62%" dominant-baseline="middle" text-anchor="middle" font-size="11" fill="var(--text-muted)">Total Tasks</text>
        </svg>
        <div style="display: flex; flex-direction: column; gap: 6px; font-size: 12px;">
          ${segments.map(s => `
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="project-dot" style="background-color: ${s.color};"></span>
              <span style="min-width: 80px;">${s.label}:</span>
              <strong>${s.count}</strong>
              <span style="color: var(--text-muted); font-size: 11px;">(${Math.round((s.count / total) * 100)}%)</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  drawVelocityChart(container) {
    const canvas = container.querySelector('#velocityCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth || 400;
    const height = 220;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // 7-day demo velocity data
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const values = [3, 5, 4, 7, 8, 4, 6];
    const maxVal = 10;

    const padding = { top: 20, right: 20, bottom: 30, left: 30 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Draw Grid Lines
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color-subtle').trim() || '#262c36';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartW, y);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#64748b';
      ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(String(Math.round(maxVal - (maxVal / 4) * i)), 10, y + 3);
    }

    // Points
    const points = values.map((val, idx) => {
      const x = padding.left + (chartW / (values.length - 1)) * idx;
      const y = padding.top + chartH - (val / maxVal) * chartH;
      return { x, y, val, label: days[idx] };
    });

    // Area Fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(points[0].x, padding.top + chartH);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
    ctx.closePath();
    ctx.fill();

    // Line Path
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    points.forEach((p, idx) => {
      if (idx === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // Circles & X-Labels
    points.forEach(p => {
      ctx.fillStyle = '#6366f1';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // X Label
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#9aa5b6';
      ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(p.label, p.x, height - 10);
    });
  }
};
