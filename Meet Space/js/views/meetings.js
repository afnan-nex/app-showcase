/**
 * MeetSpace - Meetings Explorer & Workspace Hub
 * List and grid views with search, tags, sort controls, and pre-configured templates
 */

const MeetingViews = {
  currentFilter: 'all',
  searchQuery: '',
  selectedTag: 'all',
  sortBy: 'date-asc', // 'date-asc', 'date-desc', 'duration-desc', 'title'
  layoutMode: 'list',

  render(container) {
    let meetings = Store.getMeetings(this.currentFilter);

    // Filter query
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      meetings = meetings.filter(m =>
        m.title.toLowerCase().includes(q) ||
        (m.organizer && m.organizer.toLowerCase().includes(q)) ||
        (m.location && m.location.toLowerCase().includes(q)) ||
        (m.tags && m.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Filter tag
    if (this.selectedTag !== 'all') {
      meetings = meetings.filter(m => m.tags && m.tags.includes(this.selectedTag));
    }

    // Sort meetings
    meetings.sort((a, b) => {
      if (this.sortBy === 'date-asc') {
        return new Date(`${a.date}T${a.startTime || '00:00'}`) - new Date(`${b.date}T${b.startTime || '00:00'}`);
      } else if (this.sortBy === 'date-desc') {
        return new Date(`${b.date}T${b.startTime || '00:00'}`) - new Date(`${a.date}T${a.startTime || '00:00'}`);
      } else if (this.sortBy === 'duration-desc') {
        return (b.duration || 0) - (a.duration || 0);
      } else if (this.sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    const allTags = new Set();
    Store.meetings.forEach(m => {
      (m.tags || []).forEach(t => allTags.add(t));
    });

    container.innerHTML = `
      <div class="flex-col gap-6">
        <!-- View Header -->
        <div class="view-header">
          <div class="view-title-group">
            <h1 class="view-title">${Icons.calendar(22)} Meetings Workspace</h1>
            <p class="view-subtitle">Manage structured agendas, facilitator live sessions, decisions, and minutes</p>
          </div>
          <div class="view-actions">
            <button class="btn btn-primary" id="btn-create-meeting">
              ${Icons.plus(15)} New Meeting
            </button>
          </div>
        </div>

        <!-- Filter, Sort & Search Toolbar -->
        <div class="card" style="padding: 10px 16px;">
          <div class="flex items-center justify-between gap-3 flex-wrap">
            <!-- Filter Tabs -->
            <div class="tabs-nav" style="margin-bottom: 0; border-bottom: none;">
              <button class="tab-btn ${this.currentFilter === 'all' ? 'active' : ''}" onclick="window.MeetingViews.setFilter('all')">
                All (${Store.meetings.length})
              </button>
              <button class="tab-btn ${this.currentFilter === 'upcoming' ? 'active' : ''}" onclick="window.MeetingViews.setFilter('upcoming')">
                Upcoming (${Store.getMeetings('upcoming').length})
              </button>
              <button class="tab-btn ${this.currentFilter === 'past' ? 'active' : ''}" onclick="window.MeetingViews.setFilter('past')">
                Past Archive (${Store.getMeetings('past').length})
              </button>
            </div>

            <!-- Search, Tag, Sort & Layout Switcher -->
            <div class="flex items-center gap-2 flex-wrap">
              <div style="position: relative; min-width: 200px;">
                <input type="text" id="meeting-search-input" class="form-input" placeholder="Search title, host, tag..." value="${this._escape(this.searchQuery)}" style="padding-left: 30px; font-size: 0.825rem;" />
                <span style="position: absolute; left: 9px; top: 9px; color: var(--text-dim);">${Icons.search(14)}</span>
              </div>

              <select class="form-select" style="font-size: 0.825rem; width: auto;" onchange="window.MeetingViews.setTag(this.value)">
                <option value="all" ${this.selectedTag === 'all' ? 'selected' : ''}>All Tags</option>
                ${Array.from(allTags).map(t => `<option value="${this._escape(t)}" ${this.selectedTag === t ? 'selected' : ''}>${this._escape(t)}</option>`).join('')}
              </select>

              <select class="form-select" style="font-size: 0.825rem; width: auto;" onchange="window.MeetingViews.setSort(this.value)">
                <option value="date-asc" ${this.sortBy === 'date-asc' ? 'selected' : ''}>Date: Soonest First</option>
                <option value="date-desc" ${this.sortBy === 'date-desc' ? 'selected' : ''}>Date: Latest First</option>
                <option value="duration-desc" ${this.sortBy === 'duration-desc' ? 'selected' : ''}>Duration: Longest</option>
                <option value="title" ${this.sortBy === 'title' ? 'selected' : ''}>Alphabetical</option>
              </select>

              <div class="flex items-center" style="background: var(--bg-subtle); border-radius: var(--radius-sm); border: 1px solid var(--border-default); padding: 2px;">
                <button class="btn btn-ghost btn-sm btn-icon-only ${this.layoutMode === 'list' ? 'active' : ''}" onclick="window.MeetingViews.setLayout('list')" title="List View">
                  ${Icons.agenda(15)}
                </button>
                <button class="btn btn-ghost btn-sm btn-icon-only ${this.layoutMode === 'grid' ? 'active' : ''}" onclick="window.MeetingViews.setLayout('grid')" title="Grid View">
                  ${Icons.dashboard(15)}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Output List or Grid -->
        ${meetings.length === 0 ? `
          <div class="card empty-state">
            <div class="empty-state-icon">${Icons.calendar(36)}</div>
            <h3 class="empty-state-title">No matching meetings found</h3>
            <p class="empty-state-desc">Try clearing your filters or create a new meeting with a structured agenda.</p>
            <button class="btn btn-primary btn-sm" onclick="window.MeetingViews.showNewMeetingModal()">${Icons.plus(13)} Schedule Meeting</button>
          </div>
        ` : `
          <div class="${this.layoutMode === 'grid' ? 'stats-grid' : 'meeting-list-stack'}">
            ${meetings.map(m => this._renderMeetingCard(m)).join('')}
          </div>
        `}
      </div>
    `;

    const searchInput = container.querySelector('#meeting-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.render(container);
      });
    }

    const createBtn = container.querySelector('#btn-create-meeting');
    if (createBtn) {
      createBtn.addEventListener('click', () => this.showNewMeetingModal());
    }
  },

  _renderMeetingCard(m) {
    const d = new Date(`${m.date}T${m.startTime || '00:00'}`);
    const month = d.toLocaleString('en-US', { month: 'short' });
    const day = d.getDate();

    if (this.layoutMode === 'grid') {
      return `
        <div class="card card-hover" style="cursor: pointer; display:flex; flex-direction:column; justify-content:space-between;" onclick="AppRouter.navigate('/meeting/${m.id}')">
          <div>
            <div class="flex items-center justify-between" style="margin-bottom: 10px;">
              <span class="badge ${m.status === 'in-progress' ? 'badge-declined' : (m.status === 'completed' ? 'badge-done' : 'badge-neutral')}">${m.status.toUpperCase()}</span>
              <span class="text-muted font-mono" style="font-size: 0.75rem;">${m.duration} mins</span>
            </div>
            <h3 style="font-size: 0.95rem; font-weight: 600; margin-bottom: 6px;" class="truncate">${this._escape(m.title)}</h3>
            <p class="text-muted" style="font-size: 0.8rem; margin-bottom: 12px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              ${this._escape(m.description || 'No description provided.')}
            </p>
          </div>

          <div class="flex items-center justify-between" style="border-top: 1px solid var(--border-subtle); padding-top: 10px; font-size: 0.75rem; color: var(--text-muted);">
            <span>${Icons.clock(12)} ${m.date} at ${m.startTime || '10:00'}</span>
            <div class="avatar-group">
              ${(m.participants || []).slice(0, 3).map(p => `<div class="avatar avatar-xs">${(p.name || 'U').charAt(0)}</div>`).join('')}
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="meeting-card" onclick="AppRouter.navigate('/meeting/${m.id}')">
        <div class="meeting-card-left">
          <div class="meeting-date-badge">
            <span class="meeting-date-month">${month}</span>
            <span class="meeting-date-day">${day}</span>
          </div>
          <div class="meeting-meta-col">
            <div class="meeting-card-title">
              <span>${this._escape(m.title)}</span>
              ${m.status === 'in-progress' ? '<span class="badge badge-declined" style="font-size:0.65rem;">LIVE</span>' : ''}
              ${(m.tags || []).map(t => `<span class="badge badge-tag" style="font-size:0.7rem;">${this._escape(t)}</span>`).join('')}
            </div>
            <div class="meeting-card-info">
              <span>${Icons.clock(13)} ${m.startTime || '10:00'} (${m.duration} mins)</span>
              <span>•</span>
              <span>${Icons.user(13)} ${this._escape(m.organizer)}</span>
              <span>•</span>
              <span>${Icons.agenda(13)} ${(m.agenda || []).length} topics</span>
              <span>•</span>
              <div class="avatar-group">
                ${(m.participants || []).slice(0, 4).map(p => `
                  <div class="avatar avatar-xs" title="${this._escape(p.name)}">${(p.name || 'U').charAt(0)}</div>
                `).join('')}
                ${(m.participants || []).length > 4 ? `<div class="avatar avatar-xs">+${m.participants.length - 4}</div>` : ''}
              </div>
            </div>
          </div>
        </div>

        <div class="meeting-card-right" onclick="event.stopPropagation();">
          ${(m.status === 'scheduled' || m.status === 'in-progress') ? `
            <button class="btn btn-primary btn-sm" onclick="window.LiveMeetingRunner.start('${m.id}')" title="Start Live Facilitator Mode">
              ${Icons.play(13)} Live Mode
            </button>
          ` : ''}
          <button class="btn btn-ghost btn-sm btn-icon-only" onclick="window.MeetingViews.duplicateMeeting('${m.id}')" title="Duplicate Meeting">
            ${Icons.copy(14)}
          </button>
          <button class="btn btn-ghost btn-sm btn-icon-only text-dim" onclick="window.MeetingViews.deleteMeeting('${m.id}')" title="Delete Meeting">
            ${Icons.trash(14)}
          </button>
          <a href="#/meeting/${m.id}" class="btn btn-secondary btn-sm btn-icon-only" title="Open Workspace">
            ${Icons.chevronRight(14)}
          </a>
        </div>
      </div>
    `;
  },

  setFilter(filter) {
    this.currentFilter = filter;
    this.render(document.getElementById('main-content-view'));
  },

  setTag(tag) {
    this.selectedTag = tag;
    this.render(document.getElementById('main-content-view'));
  },

  setSort(sort) {
    this.sortBy = sort;
    this.render(document.getElementById('main-content-view'));
  },

  setLayout(layout) {
    this.layoutMode = layout;
    this.render(document.getElementById('main-content-view'));
  },

  async duplicateMeeting(id) {
    const dup = await Store.duplicateMeeting(id);
    if (dup) {
      Notifier.show('Meeting Duplicated', `Created "${dup.title}"`, 'success');
      this.render(document.getElementById('main-content-view'));
    }
  },

  async deleteMeeting(id) {
    const m = Store.getMeeting(id);
    if (!m) return;
    if (confirm(`Are you sure you want to delete "${m.title}"?`)) {
      await Store.deleteMeeting(id);
      Notifier.show('Meeting Deleted', 'Meeting removed from schedule.', 'info');
      this.render(document.getElementById('main-content-view'));
    }
  },

  async createFromTemplate(templateType) {
    const todayStr = new Date().toISOString().split('T')[0];
    let meetingData = {};

    if (templateType === '1on1') {
      meetingData = {
        title: '1-on-1 Performance & Career Sync',
        date: todayStr,
        startTime: '11:00',
        duration: 30,
        tags: ['1:1', 'People', 'Sync'],
        description: 'Bi-weekly 1:1 check-in: current blockers, project progress, career goals, and feedback.',
        agenda: [
          { title: 'Personal Check-in & General Well-being', duration: 5, completed: false, presenter: 'Elena Vance' },
          { title: 'Project Milestones & Roadblock Clearance', duration: 15, completed: false, presenter: 'Marcus Chen' },
          { title: 'Feedback & Career Growth Discussion', duration: 7, completed: false, presenter: 'Elena Vance' },
          { title: 'Action Items & Next Steps', duration: 3, completed: false, presenter: 'Marcus Chen' }
        ]
      };
    } else if (templateType === 'sprint') {
      meetingData = {
        title: 'Sprint 26 Planning & Story Point Estimation',
        date: todayStr,
        startTime: '10:00',
        duration: 45,
        tags: ['Sprint', 'Agile', 'Engineering'],
        description: 'Sprint planning session to commit to sprint goal, estimate story points, and assign deliverables.',
        agenda: [
          { title: 'Sprint Goal & Priority Overview', duration: 10, completed: false, presenter: 'Elena Vance' },
          { title: 'User Stories Sizing & Capacity Review', duration: 25, completed: false, presenter: 'David Kim' },
          { title: 'Dependencies & Risks Alignment', duration: 10, completed: false, presenter: 'Marcus Chen' }
        ]
      };
    } else if (templateType === 'retro') {
      meetingData = {
        title: 'Sprint 25 Team Retrospective & Health Check',
        date: todayStr,
        startTime: '16:00',
        duration: 45,
        tags: ['Retrospective', 'Culture', 'Process'],
        description: 'What went well? What could be improved? Actionable experiments for next sprint.',
        agenda: [
          { title: 'Icebreaker & Mood Pulse', duration: 5, completed: false, presenter: 'David Kim' },
          { title: 'What Went Well (Celebrate Wins)', duration: 15, completed: false, presenter: 'Team' },
          { title: 'What Could Be Improved (Pains & Blockers)', duration: 15, completed: false, presenter: 'Team' },
          { title: 'Action Item Commitments', duration: 10, completed: false, presenter: 'David Kim' }
        ]
      };
    }

    const created = await Store.createMeeting(meetingData);
    Notifier.show('Meeting Created', `Generated from ${templateType} template`, 'success');
    AppRouter.navigate(`/meeting/${created.id}`);
  },

  showNewMeetingModal() {
    let modal = document.getElementById('new-meeting-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'new-meeting-modal';
      modal.className = 'modal-backdrop';
      document.body.appendChild(modal);
    }

    const todayStr = new Date().toISOString().split('T')[0];

    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title">Create New Meeting</h3>
          <button class="btn btn-ghost btn-icon-only modal-close-btn">${Icons.x(16)}</button>
        </div>
        <form id="new-meeting-form">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label" for="nm-title">Meeting Title *</label>
              <input type="text" id="nm-title" class="form-input" placeholder="e.g. Q4 Product Architecture Alignment" required />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="nm-date">Date *</label>
                <input type="date" id="nm-date" class="form-input" value="${todayStr}" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="nm-time">Start Time *</label>
                <input type="time" id="nm-time" class="form-input" value="10:00" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="nm-duration">Duration (Minutes)</label>
                <input type="number" id="nm-duration" class="form-input" value="30" min="5" max="480" step="5" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="nm-organizer">Organizer</label>
                <input type="text" id="nm-organizer" class="form-input" value="${Store.getCurrentUser().name}" />
              </div>
              <div class="form-group">
                <label class="form-label" for="nm-location">Location / Link</label>
                <input type="text" id="nm-location" class="form-input" placeholder="Virtual / Google Meet Alpha" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="nm-tags">Tags (comma separated)</label>
              <input type="text" id="nm-tags" class="form-input" placeholder="Strategy, Architecture, Product" />
            </div>

            <div class="form-group">
              <label class="form-label" for="nm-desc">Description / Purpose</label>
              <textarea id="nm-desc" class="form-textarea" rows="2" placeholder="State the objective and expected outcomes of this meeting..."></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary modal-close-btn">Cancel</button>
            <button type="submit" class="btn btn-primary">Create Meeting</button>
          </div>
        </form>
      </div>
    `;

    modal.classList.add('open');
    modal.querySelectorAll('.modal-close-btn').forEach(b => b.onclick = () => modal.classList.remove('open'));

    const form = modal.querySelector('#new-meeting-form');
    form.onsubmit = async (e) => {
      e.preventDefault();
      const title = modal.querySelector('#nm-title').value.trim();
      const date = modal.querySelector('#nm-date').value;
      const startTime = modal.querySelector('#nm-time').value;
      const duration = parseInt(modal.querySelector('#nm-duration').value, 10) || 30;
      const organizer = modal.querySelector('#nm-organizer').value.trim();
      const location = modal.querySelector('#nm-location').value.trim();
      const tags = modal.querySelector('#nm-tags').value.split(',').map(s => s.trim()).filter(Boolean);
      const description = modal.querySelector('#nm-desc').value.trim();

      const created = await Store.createMeeting({
        title,
        date,
        startTime,
        duration,
        organizer,
        location,
        tags,
        description
      });

      modal.classList.remove('open');
      Notifier.show('Meeting Created', `"${created.title}" added to schedule`, 'success');
      AppRouter.navigate(`/meeting/${created.id}`);
    };
  },

  _escape(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

window.MeetingViews = MeetingViews;
