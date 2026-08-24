/**
 * MeetSpace - Main Application Bootstrapper
 * Initializes database, reactive stores, routing, sidebar listeners, and command palette
 */

document.addEventListener('DOMContentLoaded', async () => {
  const contentView = document.getElementById('main-content-view');

  // Initialize UI Services
  Notifier.init();
  Palette.init();
  Shortcuts.init();
  Runner.init();

  // Initialize Reactive Store & IndexedDB
  await Store.init();

  // Update User Profile in Sidebar
  updateSidebarProfile();

  // Register Routes
  AppRouter.register('/dashboard', () => {
    setBreadcrumbs('Dashboard');
    DashboardView.render(contentView);
  });

  AppRouter.register('/meetings', () => {
    setBreadcrumbs('Meetings');
    MeetingViews.render(contentView);
  });

  AppRouter.register('/meeting/:id', (params) => {
    const meeting = Store.getMeeting(params.id);
    const title = meeting ? meeting.title : 'Meeting Detail';
    setBreadcrumbs('Meetings', title, '#/meetings');
    MeetingDetailView.render(contentView, params);
  });

  AppRouter.register('/actions', () => {
    setBreadcrumbs('Action Items');
    ActionItemsView.render(contentView);
  });

  AppRouter.register('/decisions', () => {
    setBreadcrumbs('Decisions Hub');
    DecisionsView.render(contentView);
  });

  AppRouter.register('/analytics', () => {
    setBreadcrumbs('Analytics');
    AnalyticsView.render(contentView);
  });

  AppRouter.register('/settings', () => {
    setBreadcrumbs('Settings');
    SettingsView.render(contentView);
  });

  // Setup Sidebar mini meetings and badges
  updateSidebarBadges();
  renderSidebarMiniMeetings();

  // Subscribe to state updates to refresh badges
  Store.subscribe('meetings:changed', () => {
    updateSidebarBadges();
    renderSidebarMiniMeetings();
  });
  Store.subscribe('actions:changed', () => updateSidebarBadges());

  // Setup Mobile Nav Drawer
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const sidebar = document.getElementById('app-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');

  if (mobileToggle && sidebar && backdrop) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      backdrop.classList.toggle('open');
    });

    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('open');
      backdrop.classList.remove('open');
    });
  }

  // Close mobile sidebar on nav link click
  document.querySelectorAll('.app-sidebar a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768 && sidebar && backdrop) {
        sidebar.classList.remove('open');
        backdrop.classList.remove('open');
      }
    });
  });

  // Quick New Meeting in Sidebar
  const sidebarNewBtn = document.getElementById('sidebar-new-meeting-btn');
  if (sidebarNewBtn) {
    sidebarNewBtn.addEventListener('click', () => window.MeetingViews.showNewMeetingModal());
  }

  // Topbar theme toggle button
  const topbarThemeBtn = document.getElementById('topbar-theme-toggle');
  if (topbarThemeBtn) {
    topbarThemeBtn.addEventListener('click', () => Store.toggleTheme());
  }

  // Topbar Notification Bell
  const bellBtn = document.getElementById('topbar-bell-btn');
  if (bellBtn) {
    bellBtn.addEventListener('click', () => {
      Notifier.togglePopover();
    });
  }

  // Start Router
  AppRouter.init();

  // Helper functions
  function setBreadcrumbs(section, detail = null, sectionUrl = null) {
    const bcSection = document.getElementById('breadcrumb-section');
    const bcSep = document.getElementById('breadcrumb-sep');
    const bcCurrent = document.getElementById('breadcrumb-current');

    if (detail) {
      if (bcSection) {
        bcSection.textContent = section;
        bcSection.classList.remove('hidden');
        if (sectionUrl) {
          bcSection.innerHTML = `<a href="${sectionUrl}" class="breadcrumb-item">${section}</a>`;
        }
      }
      if (bcSep) bcSep.classList.remove('hidden');
      if (bcCurrent) bcCurrent.textContent = detail;
    } else {
      if (bcSection) bcSection.classList.add('hidden');
      if (bcSep) bcSep.classList.add('hidden');
      if (bcCurrent) bcCurrent.textContent = section;
    }
  }

  function updateSidebarBadges() {
    const meetingsBadge = document.getElementById('badge-meetings-count');
    const actionsBadge = document.getElementById('badge-actions-count');

    if (meetingsBadge) {
      const upcoming = Store.getMeetings('upcoming').length;
      meetingsBadge.textContent = upcoming > 0 ? upcoming : '';
    }

    if (actionsBadge) {
      const openActions = Store.getActionItems('todo').length + Store.getActionItems('inprogress').length;
      actionsBadge.textContent = openActions > 0 ? openActions : '';
    }
  }

  function updateSidebarProfile() {
    const user = Store.getCurrentUser();
    const avatar = document.getElementById('sidebar-user-avatar');
    const name = document.getElementById('sidebar-user-name');
    const role = document.getElementById('sidebar-user-role');

    if (avatar) avatar.textContent = user.name ? user.name.charAt(0) : 'U';
    if (name) name.textContent = user.name || 'User';
    if (role) role.textContent = user.role || 'Facilitator';
  }

  function renderSidebarMiniMeetings() {
    const container = document.getElementById('sidebar-mini-meetings-list');
    if (!container) return;

    const upcoming = Store.getMeetings('upcoming').slice(0, 3);
    if (upcoming.length === 0) {
      container.innerHTML = `<div style="padding:4px 12px; font-size:0.75rem; color:var(--text-dim);">No upcoming meetings</div>`;
      return;
    }

    container.innerHTML = upcoming.map(m => `
      <a href="#/meeting/${m.id}" class="mini-meeting-link" title="${m.title}">
        <span class="mini-meeting-title">${m.title}</span>
        <span class="mini-meeting-time">${Icons.clock(11)} ${m.date} at ${m.startTime || '10:00'}</span>
      </a>
    `).join('');
  }
});
