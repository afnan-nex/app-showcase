/**
 * MeetSpace - Command Palette (Cmd+K / Ctrl+K)
 * Spotlight / Raycast style search across meetings, action items, decisions, notes and actions
 */

class CommandPalette {
  constructor() {
    this.isOpen = false;
    this.backdrop = null;
    this.input = null;
    this.resultsList = null;
    this.selectedIndex = 0;
    this.currentItems = [];
  }

  init() {
    this._renderModal();
    this._bindKeyboardShortcuts();
  }

  _renderModal() {
    let backdrop = document.getElementById('cmd-palette-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'cmd-palette-backdrop';
      backdrop.className = 'cmd-palette-backdrop';
      backdrop.innerHTML = `
        <div class="cmd-palette" role="dialog" aria-modal="true" aria-label="Command Palette">
          <div class="cmd-search-box">
            <span class="text-muted">${Icons.search(18)}</span>
            <input type="text" id="cmd-search-input" class="cmd-search-input" placeholder="Type a command or search meetings, actions, notes..." autocomplete="off" spellcheck="false" />
            <span class="kbd-badge">ESC</span>
          </div>
          <ul id="cmd-results-list" class="cmd-results-list"></ul>
          <div class="cmd-footer">
            <div class="flex items-center gap-2">
              <span>Navigate <span class="kbd-badge">↑</span> <span class="kbd-badge">↓</span></span>
              <span>Select <span class="kbd-badge">↵</span></span>
            </div>
            <span>MeetSpace Spotlight</span>
          </div>
        </div>
      `;
      document.body.appendChild(backdrop);
    }

    this.backdrop = backdrop;
    this.input = document.getElementById('cmd-search-input');
    this.resultsList = document.getElementById('cmd-results-list');

    // Events
    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) this.close();
    });

    this.input.addEventListener('input', () => {
      this._handleSearch(this.input.value);
    });

    this.input.addEventListener('keydown', (e) => {
      this._handleKeyDown(e);
    });

    // Global trigger buttons
    document.querySelectorAll('.cmd-k-trigger').forEach(btn => {
      btn.addEventListener('click', () => this.open());
    });
  }

  _bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
      }

      // Escape to close
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  open(initialQuery = '') {
    this.isOpen = true;
    this.backdrop.classList.add('open');
    this.input.value = initialQuery;
    this.selectedIndex = 0;
    this._handleSearch(initialQuery);
    setTimeout(() => this.input.focus(), 50);
  }

  close() {
    this.isOpen = false;
    this.backdrop.classList.remove('open');
    this.input.value = '';
    this.input.blur();
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  _handleSearch(query) {
    const q = query.trim().toLowerCase();
    this.currentItems = [];

    // Base Application Commands
    const baseCommands = [
      { id: 'cmd-new-meeting', title: 'Create New Meeting', category: 'Actions', icon: 'plus', action: () => { window.MeetingViews.showNewMeetingModal(); } },
      { id: 'cmd-dash', title: 'Go to Dashboard', category: 'Navigation', icon: 'dashboard', action: () => AppRouter.navigate('/dashboard') },
      { id: 'cmd-meetings', title: 'Browse All Meetings', category: 'Navigation', icon: 'calendar', action: () => AppRouter.navigate('/meetings') },
      { id: 'cmd-actions', title: 'View Action Items Hub', category: 'Navigation', icon: 'checkSquare', action: () => AppRouter.navigate('/actions') },
      { id: 'cmd-decisions', title: 'View Decisions Log', category: 'Navigation', icon: 'decision', action: () => AppRouter.navigate('/decisions') },
      { id: 'cmd-analytics', title: 'View Analytics & Metrics', category: 'Navigation', icon: 'analytics', action: () => AppRouter.navigate('/analytics') },
      { id: 'cmd-theme', title: 'Toggle Light / Dark Mode', category: 'Preferences', icon: 'sun', action: () => Store.toggleTheme() },
      { id: 'cmd-shortcuts', title: 'Keyboard Shortcuts Reference', category: 'Help', icon: 'helpCircle', action: () => ShortcutsHelper.open() },
      { id: 'cmd-reset', title: 'Reset to Sample Data', category: 'Preferences', icon: 'rotateCcw', action: () => { if (confirm('Reset all data to default demo meetings?')) Store.resetToSampleData(); } }
    ];

    if (!q) {
      // Default: Quick actions + Upcoming meetings
      const upcoming = Store.getMeetings('upcoming').slice(0, 4);
      upcoming.forEach(m => {
        this.currentItems.push({
          id: `m-${m.id}`,
          title: m.title,
          subtitle: `${m.date} at ${m.startTime || '10:00'} • ${m.duration} mins`,
          category: 'Upcoming Meetings',
          icon: 'calendar',
          badge: m.status,
          action: () => AppRouter.navigate(`/meeting/${m.id}`)
        });
      });

      baseCommands.forEach(c => this.currentItems.push(c));
    } else {
      // Filter commands
      baseCommands.forEach(c => {
        if (c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)) {
          this.currentItems.push(c);
        }
      });

      // Search state
      const searchRes = Store.globalSearch(q);

      // Add matching meetings
      searchRes.meetings.forEach(m => {
        this.currentItems.push({
          id: `m-${m.id}`,
          title: m.title,
          subtitle: `${m.date} • Organizer: ${m.organizer}`,
          category: 'Meetings',
          icon: 'calendar',
          badge: m.status,
          action: () => AppRouter.navigate(`/meeting/${m.id}`)
        });
      });

      // Add matching action items
      searchRes.actionItems.forEach(a => {
        this.currentItems.push({
          id: `a-${a.id}`,
          title: a.task,
          subtitle: `Assignee: ${a.assignee} • In: ${a.meetingTitle || 'Meeting'}`,
          category: 'Action Items',
          icon: 'checkSquare',
          badge: a.priority,
          action: () => {
            if (a.meetingId) AppRouter.navigate(`/meeting/${a.meetingId}?tab=actions`);
            else AppRouter.navigate('/actions');
          }
        });
      });

      // Add matching decisions
      searchRes.decisions.forEach(d => {
        this.currentItems.push({
          id: `d-${d.id}`,
          title: d.title,
          subtitle: `Decided by: ${d.decidedBy} • ${d.rationale}`,
          category: 'Decisions',
          icon: 'decision',
          badge: d.impact,
          action: () => {
            if (d.meetingId) AppRouter.navigate(`/meeting/${d.meetingId}?tab=decisions`);
            else AppRouter.navigate('/decisions');
          }
        });
      });
    }

    this.selectedIndex = Math.min(this.selectedIndex, Math.max(0, this.currentItems.length - 1));
    this._renderResults();
  }

  _renderResults() {
    if (this.currentItems.length === 0) {
      this.resultsList.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--text-muted);">
          No matching commands, meetings, or action items found.
        </div>
      `;
      return;
    }

    // Group items by category
    const groups = {};
    this.currentItems.forEach((item, index) => {
      const cat = item.category || 'Results';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push({ ...item, globalIndex: index });
    });

    let html = '';
    for (const cat in groups) {
      html += `<div class="cmd-result-group-title">${cat}</div>`;
      groups[cat].forEach(item => {
        const isSelected = item.globalIndex === this.selectedIndex;
        html += `
          <li class="cmd-item ${isSelected ? 'selected' : ''}" data-index="${item.globalIndex}">
            <span class="cmd-item-icon">${Icons.svg(item.icon || 'chevronRight', 16)}</span>
            <div class="flex-1 truncate">
              <div class="truncate">${this._escape(item.title)}</div>
              ${item.subtitle ? `<div class="text-muted" style="font-size:0.75rem;">${this._escape(item.subtitle)}</div>` : ''}
            </div>
            ${item.badge ? `<span class="badge badge-tag">${this._escape(item.badge)}</span>` : ''}
          </li>
        `;
      });
    }

    this.resultsList.innerHTML = html;

    // Attach click listeners to items
    this.resultsList.querySelectorAll('.cmd-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-index'), 10);
        this._executeItem(idx);
      });
    });

    // Ensure selected item is scrolled into view
    const selectedEl = this.resultsList.querySelector('.cmd-item.selected');
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest' });
    }
  }

  _handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.selectedIndex = (this.selectedIndex + 1) % Math.max(1, this.currentItems.length);
      this._renderResults();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.selectedIndex = (this.selectedIndex - 1 + this.currentItems.length) % Math.max(1, this.currentItems.length);
      this._renderResults();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      this._executeItem(this.selectedIndex);
    }
  }

  _executeItem(index) {
    if (this.currentItems[index]) {
      const item = this.currentItems[index];
      this.close();
      if (typeof item.action === 'function') {
        item.action();
      }
    }
  }

  _escape(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

const Palette = new CommandPalette();
