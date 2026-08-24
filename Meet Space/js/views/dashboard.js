/**
 * MeetSpace - Dashboard View
 * Executive summary, KPI metrics, upcoming meetings, pending action items, recent decisions
 */

const DashboardView = {
  render(container) {
    const analytics = Store.getAnalyticsData();
    const upcomingMeetings = Store.getMeetings('upcoming').slice(0, 5);
    const urgentActions = Store.actionItems.filter(a => a.status !== 'Done').slice(0, 5);
    const recentDecisions = Store.decisions.slice(0, 4);

    container.innerHTML = `
      <div class="dashboard-grid">
        <!-- View Header -->
        <div class="view-header">
          <div class="view-title-group">
            <h1 class="view-title">
              <span>Workspace Dashboard</span>
            </h1>
            <p class="view-subtitle">Real-time overview of upcoming meetings, team decisions, and open action items</p>
          </div>
          <div class="view-actions">
            <button class="btn btn-primary" id="dash-new-meeting-btn">
              ${Icons.plus(16)} New Meeting
            </button>
          </div>
        </div>

        <!-- KPI Metric Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <span>Upcoming Meetings</span>
              <div class="stat-icon">${Icons.calendar(18)}</div>
            </div>
            <div class="stat-value">${upcomingMeetings.length}</div>
            <div class="stat-footer">
              <span class="text-muted">${analytics.totalMeetings} scheduled in total</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <span>Action Completion</span>
              <div class="stat-icon">${Icons.checkSquare(18)}</div>
            </div>
            <div class="stat-value">${analytics.actionCompletionRate}%</div>
            <div class="stat-footer">
              <span class="badge badge-done" style="font-size:0.7rem;">${analytics.completedActions} of ${analytics.totalActions} closed</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <span>Average Duration</span>
              <div class="stat-icon">${Icons.clock(18)}</div>
            </div>
            <div class="stat-value">${analytics.avgDuration} <span style="font-size:1rem; font-weight:500; color:var(--text-muted);">min</span></div>
            <div class="stat-footer">
              <span class="text-muted">${analytics.totalDurationHours} hrs total discussion</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <span>Attendance Rate</span>
              <div class="stat-icon">${Icons.users(18)}</div>
            </div>
            <div class="stat-value">${analytics.attendanceRate}%</div>
            <div class="stat-footer">
              <span class="badge badge-confirmed" style="font-size:0.7rem;">High engagement</span>
            </div>
          </div>
        </div>

        <!-- Two Column Workspace Layout -->
        <div class="dashboard-split">
          <!-- Left Column: Upcoming Meetings & Live Facilitator Shortcut -->
          <div class="flex-col gap-4">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">${Icons.calendar(18)} Upcoming Schedule</h3>
                <a href="#/meetings" class="btn btn-ghost btn-sm">View All ${Icons.chevronRight(14)}</a>
              </div>

              ${upcomingMeetings.length === 0 ? `
                <div style="padding: 32px 16px; text-align: center; color: var(--text-muted);">
                  <p>No upcoming meetings scheduled for today.</p>
                  <button class="btn btn-secondary btn-sm" style="margin-top: 12px;" onclick="window.MeetingViews.showNewMeetingModal()">Schedule a Meeting</button>
                </div>
              ` : `
                <div class="meeting-list-stack">
                  ${upcomingMeetings.map(m => this._renderMeetingCard(m)).join('')}
                </div>
              `}
            </div>

            <!-- Recent Decisions Log Card -->
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">${Icons.decision(18)} Recent Team Decisions</h3>
                <a href="#/decisions" class="btn btn-ghost btn-sm">Decisions Hub ${Icons.chevronRight(14)}</a>
              </div>
              ${recentDecisions.length === 0 ? `
                <p class="text-muted" style="padding: 12px 0;">No decisions logged yet.</p>
              ` : `
                <div class="decision-stream">
                  ${recentDecisions.map(d => `
                    <div class="decision-card" style="padding:10px 14px;">
                      <div class="decision-header">
                        <span class="decision-title" style="font-size:0.875rem;">${this._escape(d.title)}</span>
                        <span class="badge badge-tag" style="font-size:0.7rem;">${d.impact || 'Decision'}</span>
                      </div>
                      <div class="decision-body" style="font-size:0.8rem;">${this._escape(d.rationale)}</div>
                      <div class="decision-footer">
                        <span>Decided by: <strong>${this._escape(d.decidedBy)}</strong></span>
                        <span class="text-dim">${this._formatDate(d.timestamp)}</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>
          </div>

          <!-- Right Column: Priority Action Items & Quick Tools -->
          <div class="flex-col gap-4">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">${Icons.checkSquare(18)} Urgent Action Items</h3>
                <a href="#/actions" class="btn btn-ghost btn-sm">All Actions ${Icons.chevronRight(14)}</a>
              </div>
              ${urgentActions.length === 0 ? `
                <div style="padding: 24px; text-align: center; color: var(--text-muted);">
                  <p>All action items are completed! 🎉</p>
                </div>
              ` : `
                <div class="action-items-container">
                  ${urgentActions.map(act => `
                    <div class="action-item-row" data-action-id="${act.id}" style="padding: 8px 10px;">
                      <button class="agenda-check-btn ${act.status === 'Done' ? 'checked' : ''}" onclick="window.DashboardView.toggleActionStatus('${act.id}')">
                        ${Icons.check(12)}
                      </button>
                      <div class="action-item-content">
                        <div class="action-task-title" style="font-size:0.825rem;">${this._escape(act.task)}</div>
                        <div class="action-task-meta" style="font-size:0.725rem;">
                          <span>${act.assignee}</span>
                          <span>•</span>
                          <span class="${this._getPriorityClass(act.priority)}">${act.priority}</span>
                          <span>•</span>
                          <span>Due ${act.dueDate || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>

            <!-- Quick Template Launch -->
            <div class="card" style="background: var(--bg-subtle);">
              <h4 style="font-size:0.9rem; font-weight:600; margin-bottom:8px;">Quick Facilitation</h4>
              <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:12px;">Start a structured workspace instantly with pre-configured agenda templates:</p>
              <div class="flex flex-col gap-2">
                <button class="btn btn-secondary btn-sm justify-between" onclick="window.MeetingViews.createFromTemplate('1on1')">
                  <span>1-on-1 Sync Template</span>
                  <span class="text-dim">30m</span>
                </button>
                <button class="btn btn-secondary btn-sm justify-between" onclick="window.MeetingViews.createFromTemplate('sprint')">
                  <span>Sprint Planning Template</span>
                  <span class="text-dim">45m</span>
                </button>
                <button class="btn btn-secondary btn-sm justify-between" onclick="window.MeetingViews.createFromTemplate('retro')">
                  <span>Team Retrospective</span>
                  <span class="text-dim">45m</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind new meeting button
    const newMeetingBtn = container.querySelector('#dash-new-meeting-btn');
    if (newMeetingBtn) {
      newMeetingBtn.addEventListener('click', () => window.MeetingViews.showNewMeetingModal());
    }
  },

  _renderMeetingCard(meeting) {
    const d = new Date(`${meeting.date}T${meeting.startTime || '00:00'}`);
    const month = d.toLocaleString('en-US', { month: 'short' });
    const day = d.getDate();

    const isLiveEligible = meeting.status === 'in-progress' || meeting.status === 'scheduled';

    return `
      <div class="meeting-card" onclick="AppRouter.navigate('/meeting/${meeting.id}')">
        <div class="meeting-card-left">
          <div class="meeting-date-badge">
            <span class="meeting-date-month">${month}</span>
            <span class="meeting-date-day">${day}</span>
          </div>
          <div class="meeting-meta-col">
            <div class="meeting-card-title">
              <span>${this._escape(meeting.title)}</span>
              ${meeting.status === 'in-progress' ? '<span class="badge badge-declined" style="font-size:0.65rem;">LIVE</span>' : ''}
            </div>
            <div class="meeting-card-info">
              <span>${Icons.clock(14)} ${meeting.startTime || '10:00'} (${meeting.duration}m)</span>
              <span>•</span>
              <span>${Icons.user(14)} ${meeting.organizer}</span>
              <span>•</span>
              <div class="avatar-group">
                ${(meeting.participants || []).slice(0, 3).map(p => `
                  <div class="avatar avatar-xs" title="${this._escape(p.name)}">${p.name.charAt(0)}</div>
                `).join('')}
                ${(meeting.participants || []).length > 3 ? `<div class="avatar avatar-xs">+${meeting.participants.length - 3}</div>` : ''}
              </div>
            </div>
          </div>
        </div>

        <div class="meeting-card-right" onclick="event.stopPropagation();">
          ${isLiveEligible ? `
            <button class="btn btn-primary btn-sm" onclick="window.LiveMeetingRunner.start('${meeting.id}')" title="Start Fullscreen Live Facilitator Mode">
              ${Icons.play(14)} Start Meeting
            </button>
          ` : ''}
          <a href="#/meeting/${meeting.id}" class="btn btn-secondary btn-sm btn-icon-only" title="Open Workspace">
            ${Icons.chevronRight(16)}
          </a>
        </div>
      </div>
    `;
  },

  async toggleActionStatus(actionId) {
    const act = Store.actionItems.find(a => a.id === actionId);
    if (act) {
      const nextStatus = act.status === 'Done' ? 'To Do' : 'Done';
      await Store.updateActionItem(actionId, { status: nextStatus });
      this.render(document.getElementById('main-content-view'));
    }
  },

  _getPriorityClass(priority) {
    if (priority === 'Urgent') return 'priority-urgent';
    if (priority === 'High') return 'priority-high';
    if (priority === 'Medium') return 'priority-medium';
    return 'priority-low';
  },

  _formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch (e) {
      return '';
    }
  },

  _escape(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

window.DashboardView = DashboardView;
