/**
 * TaskBoard Main Application Bootstrap & Controller
 * Complete interaction binding, keyboard shortcuts, view router, and real-time state synchronization
 */

window.App = {
  async init() {
    // Initialize UI subsystems
    window.Notifications.init();
    window.ContextMenu.init();
    window.CommandPalette.init();
    window.Modals.init();

    // Initialize State Store
    await window.State.init();

    // Setup DOM Listeners & UI Binding
    this.setupNavigation();
    this.setupTopBar();
    this.setupFilters();
    this.setupUserSwitcher();
    this.setupShortcuts();

    // Subscribe to state changes
    window.State.subscribe((event, payload, state) => {
      this.handleStateChange(event, payload, state);
    });

    // Initial render
    this.syncTheme();
    this.updateSidebarProjects();
    this.updateTopbarProjectSelector();
    this.updateCurrentUserDisplay();
    this.renderCurrentView();
  },

  syncTheme() {
    const state = window.State.getState();
    document.documentElement.setAttribute('data-theme', state.theme || 'dark');
  },

  setupNavigation() {
    // Sidebar view links
    document.querySelectorAll('.sidebar-nav .nav-link, .sidebar-footer-link[data-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        if (view) {
          window.State.setActiveView(view);
          // Close mobile drawer if open
          document.getElementById('sidebar')?.classList.remove('mobile-open');
        }
      });
    });

    // View tabs in topbar
    document.querySelectorAll('.view-tabs .view-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        if (view) window.State.setActiveView(view);
      });
    });

    // Sidebar collapse button
    const sidebar = document.getElementById('sidebar');
    const collapseBtn = document.getElementById('sidebarCollapseBtn');
    if (collapseBtn && sidebar) {
      collapseBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
      });
    }

    // Mobile Menu Button
    const mobileBtn = document.getElementById('mobileMenuBtn');
    if (mobileBtn && sidebar) {
      mobileBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
    }

    // New task primary buttons
    const sidebarNewTask = document.getElementById('sidebarNewTaskBtn');
    const topbarNewTask = document.getElementById('topbarNewTaskBtn');
    if (sidebarNewTask) sidebarNewTask.addEventListener('click', () => window.Modals.openNewTaskModal());
    if (topbarNewTask) topbarNewTask.addEventListener('click', () => window.Modals.openNewTaskModal());

    // Add project button
    const addProjBtn = document.getElementById('sidebarAddProjectBtn');
    if (addProjBtn) addProjBtn.addEventListener('click', () => window.Modals.openProjectModal());
  },

  setupTopBar() {
    // Theme toggle
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        window.State.toggleTheme();
      });
    }

    // Project Dropdown Selector
    const trigger = document.getElementById('projectDropdownTrigger');
    const menu = document.getElementById('projectSelectMenu');
    if (trigger && menu) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('hidden');
        trigger.setAttribute('aria-expanded', !menu.classList.contains('hidden'));
      });

      document.addEventListener('click', () => {
        menu.classList.add('hidden');
        trigger.setAttribute('aria-expanded', 'false');
      });

      const createProjBtn = document.getElementById('dropdownCreateProjectBtn');
      if (createProjBtn) {
        createProjBtn.addEventListener('click', () => {
          menu.classList.add('hidden');
          window.Modals.openProjectModal();
        });
      }
    }
  },

  setupUserSwitcher() {
    const userWidget = document.getElementById('currentUserWidget');
    const userMenu = document.getElementById('userSelectMenu');
    const userDropdownItems = document.getElementById('userDropdownItems');

    if (userWidget && userMenu && userDropdownItems) {
      userWidget.addEventListener('click', (e) => {
        e.stopPropagation();
        const state = window.State.getState();
        
        userDropdownItems.innerHTML = state.users.map(u => `
          <div class="dropdown-item ${state.currentUserId === u.id ? 'active' : ''}" data-user-id="${u.id}">
            <img src="${u.avatar}" alt="${window.Utils.escapeHtml(u.name)}" class="avatar-xs">
            <div style="display: flex; flex-direction: column; min-width: 0;">
              <span style="font-weight: 600; font-size: 12px;">${window.Utils.escapeHtml(u.name)}</span>
              <span style="font-size: 10px; color: var(--text-muted);">${window.Utils.escapeHtml(u.role)}</span>
            </div>
          </div>
        `).join('');

        userDropdownItems.querySelectorAll('.dropdown-item').forEach(item => {
          item.addEventListener('click', (ie) => {
            ie.stopPropagation();
            const uId = item.getAttribute('data-user-id');
            window.State.setCurrentUser(uId);
            userMenu.classList.add('hidden');
            window.Notifications.info(`Switched active profile to ${window.State.getUserById(uId)?.name}`);
          });
        });

        userMenu.classList.toggle('hidden');
      });

      document.addEventListener('click', () => userMenu.classList.add('hidden'));
    }
  },

  setupFilters() {
    const trigger = document.getElementById('filterDropdownTrigger');
    const popover = document.getElementById('filterPopover');
    const resetBtn = document.getElementById('resetFiltersBtn');
    const clearAllBtn = document.getElementById('clearAllFiltersBtn');

    if (trigger && popover) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        popover.classList.toggle('hidden');
        trigger.setAttribute('aria-expanded', !popover.classList.contains('hidden'));
      });

      document.addEventListener('click', (e) => {
        if (!popover.contains(e.target) && !trigger.contains(e.target)) {
          popover.classList.add('hidden');
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Filter controls
    const fAssignee = document.getElementById('filterAssignee');
    const fPriority = document.getElementById('filterPriority');
    const fStatus = document.getElementById('filterStatus');
    const fLabel = document.getElementById('filterLabel');
    const fDueDate = document.getElementById('filterDueDate');

    if (fAssignee) fAssignee.addEventListener('change', () => window.State.setFilter('assigneeId', fAssignee.value));
    if (fPriority) fPriority.addEventListener('change', () => window.State.setFilter('priority', fPriority.value));
    if (fStatus) fStatus.addEventListener('change', () => window.State.setFilter('status', fStatus.value));
    if (fLabel) fLabel.addEventListener('change', () => window.State.setFilter('labelId', fLabel.value));
    if (fDueDate) fDueDate.addEventListener('change', () => window.State.setFilter('dueDate', fDueDate.value));

    if (resetBtn) resetBtn.addEventListener('click', () => window.State.resetFilters());
    if (clearAllBtn) clearAllBtn.addEventListener('click', () => window.State.resetFilters());

    this.updateFilterDropdownOptions();
  },

  updateFilterDropdownOptions() {
    const state = window.State.getState();
    const fAssignee = document.getElementById('filterAssignee');
    const fLabel = document.getElementById('filterLabel');

    if (fAssignee) {
      fAssignee.innerHTML = `<option value="">All Members</option>` + state.users.map(u => `
        <option value="${u.id}">${window.Utils.escapeHtml(u.name)}</option>
      `).join('');
    }

    if (fLabel) {
      fLabel.innerHTML = `<option value="">All Labels</option>` + state.labels.map(l => `
        <option value="${l.id}">${window.Utils.escapeHtml(l.name)}</option>
      `).join('');
    }
  },

  updateActiveFilterPills() {
    const state = window.State.getState();
    const bar = document.getElementById('activeFilterBar');
    const container = document.getElementById('activeFilterPills');
    const badge = document.getElementById('activeFilterBadge');
    const filters = state.filters || {};

    const activeList = [];

    if (filters.search) activeList.push({ key: 'search', label: `Search: "${filters.search}"` });
    if (filters.assigneeId) {
      const u = window.State.getUserById(filters.assigneeId);
      activeList.push({ key: 'assigneeId', label: `Assignee: ${u?.name || 'User'}` });
    }
    if (filters.priority) activeList.push({ key: 'priority', label: `Priority: ${filters.priority}` });
    if (filters.status) activeList.push({ key: 'status', label: `Status: ${filters.status}` });
    if (filters.labelId) {
      const l = window.State.getLabelById(filters.labelId);
      activeList.push({ key: 'labelId', label: `Label: ${l?.name || 'Label'}` });
    }
    if (filters.dueDate) activeList.push({ key: 'dueDate', label: `Due: ${filters.dueDate}` });

    if (activeList.length > 0) {
      bar.classList.remove('hidden');
      badge.classList.remove('hidden');
      badge.textContent = activeList.length;

      container.innerHTML = activeList.map(item => `
        <span class="filter-pill">
          <span>${window.Utils.escapeHtml(item.label)}</span>
          <span class="filter-pill-remove" data-filter-key="${item.key}" role="button" aria-label="Remove filter">×</span>
        </span>
      `).join('');

      container.querySelectorAll('.filter-pill-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          const k = btn.getAttribute('data-filter-key');
          window.State.setFilter(k, '');
        });
      });
    } else {
      bar.classList.add('hidden');
      badge.classList.add('hidden');
    }
  },

  setupShortcuts() {
    document.addEventListener('keydown', (e) => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable;

      // Command Palette (Ctrl+K or Cmd+K)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        window.CommandPalette.open();
        return;
      }

      // Undo (Ctrl+Z or Cmd+Z)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z') && !isInput) {
        e.preventDefault();
        window.State.undo().then(action => {
          if (action) window.Notifications.info(`Undone: ${action}`);
        });
        return;
      }

      // Toggle Sidebar (Ctrl+\)
      if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
        e.preventDefault();
        document.getElementById('sidebar')?.classList.toggle('collapsed');
        return;
      }

      // If typing in an active form field, do not trigger single-key navigation
      if (isInput) return;

      // Navigation Shortcuts (1-6)
      if (e.key === '1') { e.preventDefault(); window.State.setActiveView('dashboard'); }
      else if (e.key === '2') { e.preventDefault(); window.State.setActiveView('board'); }
      else if (e.key === '3') { e.preventDefault(); window.State.setActiveView('list'); }
      else if (e.key === '4') { e.preventDefault(); window.State.setActiveView('calendar'); }
      else if (e.key === '5') { e.preventDefault(); window.State.setActiveView('analytics'); }
      else if (e.key === '6') { e.preventDefault(); window.State.setActiveView('projects'); }

      // Action Shortcuts
      else if (e.key === 'c' || e.key === 'C' || e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        window.Modals.openNewTaskModal();
      }
      else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        window.State.toggleTheme();
      }
      else if (e.key === '/') {
        e.preventDefault();
        window.CommandPalette.open();
      }
      else if (e.key === '?') {
        e.preventDefault();
        window.Modals.openShortcutsModal();
      }
      else if (e.key === 'Escape') {
        window.ContextMenu.hide();
        window.CommandPalette.close();
        window.Modals.closeTaskModal();
        document.getElementById('projectModalOverlay')?.classList.add('hidden');
        document.getElementById('shortcutsModalOverlay')?.classList.add('hidden');
        document.getElementById('confirmModalOverlay')?.classList.add('hidden');
        document.getElementById('projectSelectMenu')?.classList.add('hidden');
        document.getElementById('filterPopover')?.classList.add('hidden');
        document.getElementById('userSelectMenu')?.classList.add('hidden');
        document.getElementById('sidebar')?.classList.remove('mobile-open');
      }
    });
  },

  updateSidebarProjects() {
    const state = window.State.getState();
    const projectList = document.getElementById('sidebarProjectList');
    const favoritesList = document.getElementById('sidebarFavoritesList');
    if (!projectList || !favoritesList) return;

    projectList.innerHTML = state.projects.map(p => `
      <li class="nav-item">
        <div class="sidebar-project-item ${state.activeProjectId === p.id ? 'active' : ''}" data-project-id="${p.id}">
          <span class="project-dot" style="background-color: ${p.color};"></span>
          <span style="flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${window.Utils.escapeHtml(p.name)}</span>
        </div>
      </li>
    `).join('');

    const favorites = state.projects.filter(p => p.isFavorite);
    if (favorites.length === 0) {
      favoritesList.innerHTML = `<li style="padding: 4px 8px; font-size: 11px; color: var(--text-muted);">No favorites pinned</li>`;
    } else {
      favoritesList.innerHTML = favorites.map(p => `
        <li class="nav-item">
          <div class="sidebar-project-item ${state.activeProjectId === p.id ? 'active' : ''}" data-project-id="${p.id}">
            <span class="project-dot" style="background-color: ${p.color};"></span>
            <span style="flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${window.Utils.escapeHtml(p.name)}</span>
          </div>
        </li>
      `).join('');
    }

    // Click handler for project items
    document.querySelectorAll('.sidebar-project-item').forEach(el => {
      el.addEventListener('click', () => {
        const pId = el.getAttribute('data-project-id');
        window.State.setActiveProject(pId);
        if (['dashboard', 'projects'].includes(window.State.getState().activeView)) {
          window.State.setActiveView('board');
        }
        document.getElementById('sidebar')?.classList.remove('mobile-open');
      });
    });
  },

  updateTopbarProjectSelector() {
    const state = window.State.getState();
    const activeProject = window.State.getProjectById(state.activeProjectId);
    const colorDot = document.getElementById('activeProjectColor');
    const nameDisplay = document.getElementById('activeProjectName');
    const dropdownItems = document.getElementById('projectDropdownItems');

    if (colorDot && nameDisplay) {
      if (activeProject) {
        colorDot.className = 'project-color-dot';
        colorDot.style.backgroundColor = activeProject.color;
        nameDisplay.textContent = activeProject.name;
      } else {
        colorDot.className = 'project-color-dot all-projects-dot';
        colorDot.style.backgroundColor = '';
        nameDisplay.textContent = 'All Projects';
      }
    }

    if (dropdownItems) {
      dropdownItems.innerHTML = state.projects.map(p => `
        <div class="dropdown-item ${state.activeProjectId === p.id ? 'active' : ''}" data-project-id="${p.id}">
          <span class="project-dot" style="background-color: ${p.color};"></span>
          <span class="dropdown-item-title">${window.Utils.escapeHtml(p.name)}</span>
        </div>
      `).join('');

      dropdownItems.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
          const pId = item.getAttribute('data-project-id');
          window.State.setActiveProject(pId);
          document.getElementById('projectSelectMenu')?.classList.add('hidden');
        });
      });

      const allProjectsItem = document.querySelector('.dropdown-item[data-project-id="all"]');
      if (allProjectsItem) {
        allProjectsItem.addEventListener('click', () => {
          window.State.setActiveProject('all');
          document.getElementById('projectSelectMenu')?.classList.add('hidden');
        });
      }
    }
  },

  updateCurrentUserDisplay() {
    const state = window.State.getState();
    const currentUser = window.State.getUserById(state.currentUserId);
    const avatar = document.getElementById('currentUserAvatar');
    const name = document.getElementById('currentUserName');
    const workspaceName = document.getElementById('workspaceNameDisplay');

    if (currentUser) {
      if (avatar) avatar.src = currentUser.avatar;
      if (name) name.textContent = currentUser.name;
    }
    if (workspaceName && state.workspace) {
      workspaceName.textContent = state.workspace.name;
    }
  },

  renderCurrentView() {
    const state = window.State.getState();
    const viewName = state.activeView || 'dashboard';
    const mainContent = document.getElementById('mainContent');
    const viewTitle = document.getElementById('currentViewTitle');

    // Update active nav links in sidebar
    document.querySelectorAll('.sidebar-nav .nav-link, .sidebar-footer-link[data-view]').forEach(link => {
      const v = link.getAttribute('data-view');
      link.classList.toggle('active', v === viewName);
    });

    // Update topbar view switcher tabs
    document.querySelectorAll('.view-tabs .view-tab').forEach(tab => {
      const v = tab.getAttribute('data-view');
      tab.classList.toggle('active', v === viewName);
    });

    if (viewTitle) {
      const titles = {
        dashboard: 'Dashboard',
        board: 'Kanban Board',
        list: 'List View',
        calendar: 'Calendar',
        analytics: 'Analytics',
        projects: 'All Projects',
        settings: 'Settings'
      };
      viewTitle.textContent = titles[viewName] || 'Overview';
    }

    // Render corresponding view
    if (viewName === 'dashboard') {
      window.DashboardView.render(mainContent);
    } else if (viewName === 'board') {
      window.BoardView.render(mainContent);
    } else if (viewName === 'list') {
      window.ListView.render(mainContent);
    } else if (viewName === 'calendar') {
      window.CalendarView.render(mainContent);
    } else if (viewName === 'analytics') {
      window.AnalyticsView.render(mainContent);
    } else if (viewName === 'projects') {
      window.ProjectsView.render(mainContent);
    } else if (viewName === 'settings') {
      window.SettingsView.render(mainContent);
    }

    this.updateActiveFilterPills();
  },

  handleStateChange(event, payload, state) {
    if (event === 'theme_changed') {
      this.syncTheme();
    } else if (event === 'user_changed') {
      this.updateCurrentUserDisplay();
      this.renderCurrentView();
    } else if (event === 'project_changed') {
      this.updateSidebarProjects();
      this.updateTopbarProjectSelector();
      this.renderCurrentView();
    } else if (event === 'view_changed') {
      this.renderCurrentView();
    } else if (event === 'filter_changed') {
      this.renderCurrentView();
    } else if (event === 'project_created' || event === 'project_updated' || event === 'project_deleted') {
      this.updateSidebarProjects();
      this.updateTopbarProjectSelector();
      this.renderCurrentView();
    } else if (event === 'users_updated' || event === 'labels_updated') {
      this.updateFilterDropdownOptions();
      this.updateCurrentUserDisplay();
      this.renderCurrentView();
    } else {
      this.renderCurrentView();
    }
  }
};

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});
