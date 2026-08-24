/**
 * Command Palette (Ctrl+K / Cmd+K)
 * Fast keyboard-first search, navigation, and actions
 */

window.CommandPalette = {
  overlay: null,
  input: null,
  resultsEl: null,
  isOpen: false,
  selectedIndex: 0,
  currentItems: [],

  init() {
    this.overlay = document.getElementById('commandPaletteOverlay');
    this.input = document.getElementById('commandPaletteInput');
    this.resultsEl = document.getElementById('commandResults');

    if (!this.overlay) return;

    this.input.addEventListener('input', () => this.handleSearch());
    this.input.addEventListener('keydown', (e) => this.handleKeyDown(e));

    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    const triggerBtn = document.getElementById('commandPaletteTrigger');
    if (triggerBtn) {
      triggerBtn.addEventListener('click', () => this.open());
    }
  },

  open() {
    this.isOpen = true;
    this.overlay.classList.remove('hidden');
    this.input.value = '';
    this.input.focus();
    this.selectedIndex = 0;
    this.renderDefaultActions();
  },

  close() {
    this.isOpen = false;
    this.overlay.classList.add('hidden');
    this.input.value = '';
  },

  renderDefaultActions() {
    const state = window.State.getState();
    const actions = [
      {
        id: 'new_task',
        title: 'Create New Task...',
        badge: 'Action',
        icon: 'plus',
        action: () => window.Modals.openNewTaskModal()
      },
      {
        id: 'new_project',
        title: 'Create New Project...',
        badge: 'Action',
        icon: 'projects',
        action: () => window.Modals.openProjectModal()
      },
      {
        id: 'nav_dashboard',
        title: 'Go to Dashboard',
        badge: 'Navigation',
        icon: 'dashboard',
        action: () => window.State.setActiveView('dashboard')
      },
      {
        id: 'nav_board',
        title: 'Go to Kanban Board',
        badge: 'Navigation',
        icon: 'board',
        action: () => window.State.setActiveView('board')
      },
      {
        id: 'nav_list',
        title: 'Go to List View',
        badge: 'Navigation',
        icon: 'list',
        action: () => window.State.setActiveView('list')
      },
      {
        id: 'nav_calendar',
        title: 'Go to Calendar',
        badge: 'Navigation',
        icon: 'calendar',
        action: () => window.State.setActiveView('calendar')
      },
      {
        id: 'nav_analytics',
        title: 'Go to Analytics',
        badge: 'Navigation',
        icon: 'analytics',
        action: () => window.State.setActiveView('analytics')
      },
      {
        id: 'toggle_theme',
        title: `Switch to ${state.theme === 'dark' ? 'Light' : 'Dark'} Mode`,
        badge: 'Theme',
        icon: state.theme === 'dark' ? 'clock' : 'check',
        action: () => window.State.toggleTheme()
      },
      {
        id: 'export_data',
        title: 'Export Workspace to JSON',
        badge: 'Settings',
        icon: 'download',
        action: () => {
          const data = window.State.exportWorkspace();
          window.Utils.downloadJSON(data, 'taskboard-workspace.json');
          window.Notifications.success('Workspace exported successfully!');
        }
      }
    ];

    this.currentItems = actions;
    this.renderList();
  },

  handleSearch() {
    const query = this.input.value.trim().toLowerCase();
    if (!query) {
      this.renderDefaultActions();
      return;
    }

    const state = window.State.getState();
    const results = [];

    // Search tasks
    state.tasks.forEach(task => {
      if (task.title.toLowerCase().includes(query) || (task.key && task.key.toLowerCase().includes(query)) || (task.description && task.description.toLowerCase().includes(query))) {
        results.push({
          id: `task_${task.id}`,
          title: `${task.key || 'Task'}: ${task.title}`,
          badge: `Task (${task.status})`,
          icon: 'board',
          action: () => window.Modals.openTaskModal(task.id)
        });
      }
    });

    // Search projects
    state.projects.forEach(proj => {
      if (proj.name.toLowerCase().includes(query) || (proj.description && proj.description.toLowerCase().includes(query))) {
        results.push({
          id: `proj_${proj.id}`,
          title: `Project: ${proj.name}`,
          badge: 'Project',
          icon: 'projects',
          action: () => {
            window.State.setActiveProject(proj.id);
            window.State.setActiveView('board');
          }
        });
      }
    });

    // Match static commands
    const commands = [
      { id: 'c_new_task', title: 'Create New Task', badge: 'Action', icon: 'plus', action: () => window.Modals.openNewTaskModal() },
      { id: 'c_new_proj', title: 'Create New Project', badge: 'Action', icon: 'projects', action: () => window.Modals.openProjectModal() },
      { id: 'c_theme', title: 'Toggle Light / Dark Theme', badge: 'Theme', icon: 'check', action: () => window.State.toggleTheme() },
      { id: 'c_shortcuts', title: 'Open Keyboard Shortcuts Cheatsheet', badge: 'Help', icon: 'clock', action: () => window.Modals.openShortcutsModal() }
    ];

    commands.forEach(cmd => {
      if (cmd.title.toLowerCase().includes(query)) {
        results.push(cmd);
      }
    });

    this.currentItems = results;
    this.selectedIndex = 0;
    this.renderList();
  },

  renderList() {
    if (this.currentItems.length === 0) {
      this.resultsEl.innerHTML = `
        <div class="empty-state" style="padding: 24px;">
          <span class="empty-state-desc">No matching tasks or commands found</span>
        </div>
      `;
      return;
    }

    this.resultsEl.innerHTML = this.currentItems.map((item, idx) => {
      const isSelected = idx === this.selectedIndex;
      const iconSvg = window.Icons.get(item.icon, 16);
      return `
        <div class="command-item ${isSelected ? 'active' : ''}" data-index="${idx}">
          <div class="command-item-left">
            ${iconSvg}
            <span>${window.Utils.escapeHtml(item.title)}</span>
          </div>
          <span class="command-item-badge">${window.Utils.escapeHtml(item.badge)}</span>
        </div>
      `;
    }).join('');

    // Attach click listeners
    this.resultsEl.querySelectorAll('.command-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-index'), 10);
        this.executeItem(idx);
      });
    });

    // Scroll active item into view
    const activeEl = this.resultsEl.querySelector('.command-item.active');
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  },

  handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.currentItems.length > 0) {
        this.selectedIndex = (this.selectedIndex + 1) % this.currentItems.length;
        this.renderList();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.currentItems.length > 0) {
        this.selectedIndex = (this.selectedIndex - 1 + this.currentItems.length) % this.currentItems.length;
        this.renderList();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (this.currentItems.length > 0) {
        this.executeItem(this.selectedIndex);
      }
    } else if (e.key === 'Escape') {
      this.close();
    }
  },

  executeItem(index) {
    const item = this.currentItems[index];
    if (item && item.action) {
      this.close();
      item.action();
    }
  }
};
