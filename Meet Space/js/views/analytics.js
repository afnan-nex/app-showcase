/**
 * MeetSpace - Analytics & Workspace Effectiveness View
 * Interactive SVG visual charts, duration accuracy, completion rates, and attendance statistics
 */

const AnalyticsView = {
  render(container) {
    const data = Store.getAnalyticsData();

    container.innerHTML = `
      <div class="flex-col gap-6">
        <!-- View Header -->
        <div class="view-header">
          <div class="view-title-group">
            <h1 class="view-title">${Icons.analytics(24)} Meeting Analytics & Insights</h1>
            <p class="view-subtitle">Workspace productivity metrics, duration precision, and action-item velocity</p>
          </div>
        </div>

        <!-- KPI Metrics Grid -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <span>Completed Meetings</span>
              <div class="stat-icon">${Icons.calendar(18)}</div>
            </div>
            <div class="stat-value">${data.completedMeetings} <span style="font-size:1rem; color:var(--text-muted); font-weight:normal;">/ ${data.totalMeetings}</span></div>
            <div class="stat-footer">
              <span class="badge badge-done">${Math.round((data.completedMeetings / Math.max(1, data.totalMeetings)) * 100)}% execution rate</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <span>Action Completion</span>
              <div class="stat-icon">${Icons.checkSquare(18)}</div>
            </div>
            <div class="stat-value">${data.actionCompletionRate}%</div>
            <div class="stat-footer">
              <span class="text-muted">${data.completedActions} of ${data.totalActions} closed</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <span>Avg Meeting Length</span>
              <div class="stat-icon">${Icons.clock(18)}</div>
            </div>
            <div class="stat-value">${data.avgDuration} <span style="font-size:1rem; color:var(--text-muted); font-weight:normal;">mins</span></div>
            <div class="stat-footer">
              <span class="text-muted">${data.totalDurationHours} cumulative hours</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <span>Attendance Rate</span>
              <div class="stat-icon">${Icons.users(18)}</div>
            </div>
            <div class="stat-value">${data.attendanceRate}%</div>
            <div class="stat-footer">
              <span class="badge badge-confirmed">Confirmed RSVPs</span>
            </div>
          </div>
        </div>

        <!-- Visual SVG Charts Grid -->
        <div class="analytics-grid">
          <!-- Chart 1: Action Items by Priority -->
          <div class="chart-card">
            <div class="card-header">
              <h3 class="card-title">${Icons.checkSquare(18)} Action Items by Priority</h3>
            </div>
            <div class="chart-container" id="chart-priority">
              ${this._renderPriorityBarChart(data.priorityCount)}
            </div>
          </div>

          <!-- Chart 2: Meetings by Category Tag -->
          <div class="chart-card">
            <div class="card-header">
              <h3 class="card-title">${Icons.tag(18)} Meeting Categories</h3>
            </div>
            <div class="chart-container" id="chart-categories">
              ${this._renderCategoryDonutChart(data.tagsCount)}
            </div>
          </div>
        </div>

        <!-- Meeting Duration Accuracy Table -->
        <div class="card" style="padding: 0; overflow-x: auto;">
          <div class="card-header" style="padding: 16px 20px; margin-bottom: 0;">
            <h3 class="card-title">${Icons.clock(18)} Meeting Agenda Precision Log</h3>
          </div>
          <table>
            <thead>
              <tr style="background: var(--bg-subtle); border-bottom: 1px solid var(--border-default); text-align: left; font-size: 0.775rem; color: var(--text-muted); text-transform: uppercase;">
                <th style="padding: 10px 16px;">Meeting Title</th>
                <th style="padding: 10px 16px;">Date</th>
                <th style="padding: 10px 16px;">Allotted Time</th>
                <th style="padding: 10px 16px;">Agenda Items</th>
                <th style="padding: 10px 16px;">Planned Agenda Sum</th>
                <th style="padding: 10px 16px;">Variance</th>
                <th style="padding: 10px 16px;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${Store.meetings.map(m => {
                const totalAgenda = (m.agenda || []).reduce((s, a) => s + (a.duration || 0), 0);
                const variance = totalAgenda - (m.duration || 0);
                return `
                  <tr style="border-bottom: 1px solid var(--border-subtle); font-size: 0.875rem;">
                    <td style="padding: 10px 16px; font-weight: 500;">
                      <a href="#/meeting/${m.id}">${this._escape(m.title)}</a>
                    </td>
                    <td style="padding: 10px 16px; color: var(--text-muted);">${m.date}</td>
                    <td style="padding: 10px 16px; font-family: var(--font-mono);">${m.duration} mins</td>
                    <td style="padding: 10px 16px;">${(m.agenda || []).length} topics</td>
                    <td style="padding: 10px 16px; font-family: var(--font-mono);">${totalAgenda} mins</td>
                    <td style="padding: 10px 16px;">
                      ${variance === 0
                        ? '<span class="badge badge-done" style="font-size:0.7rem;">Exact (0m)</span>'
                        : (variance > 0
                            ? `<span class="badge badge-declined" style="font-size:0.7rem;">+${variance}m over</span>`
                            : `<span class="badge badge-info" style="font-size:0.7rem;">${Math.abs(variance)}m buffer</span>`
                          )
                      }
                    </td>
                    <td style="padding: 10px 16px;">
                      <span class="badge ${m.status === 'completed' ? 'badge-done' : 'badge-neutral'}">${m.status}</span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  _renderPriorityBarChart(priorityCount) {
    const total = Object.values(priorityCount).reduce((a, b) => a + b, 0) || 1;
    const items = [
      { label: 'Urgent', count: priorityCount.Urgent || 0, color: '#ef4444' },
      { label: 'High', count: priorityCount.High || 0, color: '#f59e0b' },
      { label: 'Medium', count: priorityCount.Medium || 0, color: '#0284c7' },
      { label: 'Low', count: priorityCount.Low || 0, color: '#64748b' }
    ];

    return `
      <div style="width: 100%; display: flex; flex-direction: column; gap: 12px;">
        ${items.map(item => {
          const pct = Math.round((item.count / total) * 100);
          return `
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div class="flex items-center justify-between" style="font-size: 0.8rem;">
                <span style="font-weight: 500;">${item.label}</span>
                <span class="text-muted">${item.count} items (${pct}%)</span>
              </div>
              <div class="progress-bar-wrap" style="height: 8px;">
                <div style="height: 100%; width: ${pct}%; background: ${item.color}; border-radius: 9999px; transition: width 0.4s ease;"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  _renderCategoryDonutChart(tagsCount) {
    const tags = Object.keys(tagsCount);
    if (tags.length === 0) {
      return `<div class="text-muted">No category data recorded.</div>`;
    }

    const total = Object.values(tagsCount).reduce((a, b) => a + b, 0);
    const colors = ['#4f46e5', '#10b981', '#f59e0b', '#8b5cf6', '#0284c7', '#ef4444'];

    return `
      <div style="display: flex; align-items: center; justify-content: space-around; width: 100%; gap: 16px;">
        <svg width="140" height="140" viewBox="0 0 42 42">
          <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="var(--bg-subtle)" stroke-width="6"></circle>
          ${(() => {
            let offset = 0;
            return tags.map((t, idx) => {
              const val = tagsCount[t];
              const pct = (val / total) * 100;
              const strokeDasharray = `${pct} ${100 - pct}`;
              const strokeDashoffset = 100 - offset;
              offset += pct;
              const color = colors[idx % colors.length];
              return `
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="${color}" stroke-width="6" stroke-dasharray="${strokeDasharray}" stroke-dashoffset="${strokeDashoffset}"></circle>
              `;
            }).join('');
          })()}
        </svg>

        <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.8rem;">
          ${tags.map((t, idx) => {
            const count = tagsCount[t];
            const pct = Math.round((count / total) * 100);
            const color = colors[idx % colors.length];
            return `
              <div class="flex items-center gap-2">
                <span style="width: 10px; height: 10px; border-radius: 50%; background: ${color}; display: inline-block;"></span>
                <span><strong>${this._escape(t)}:</strong> ${count} (${pct}%)</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  _escape(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

window.AnalyticsView = AnalyticsView;
