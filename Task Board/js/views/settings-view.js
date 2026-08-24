/**
 * Settings View
 * Workspace info, member management, custom labels, JSON import/export, data reset
 */

window.SettingsView = {
  render(container) {
    const state = window.State.getState();

    container.innerHTML = `
      <div class="settings-container" style="padding: 24px; max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; overflow-y: auto;">
        <div>
          <h2 style="font-size: var(--font-size-xl); font-weight: 700;">Workspace Settings</h2>
          <span style="font-size: var(--font-size-sm); color: var(--text-muted);">Manage your workspace preferences, team members, labels, and backups.</span>
        </div>

        <!-- General Workspace Info Card -->
        <div class="chart-card">
          <div class="chart-card-header">
            <span class="chart-card-title">General Workspace</span>
          </div>
          <div class="form-group">
            <label class="form-label" for="settingsWorkspaceName">Workspace Name</label>
            <input type="text" class="form-input" id="settingsWorkspaceName" value="${window.Utils.escapeHtml(state.workspace.name)}">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Subscription Tier</label>
              <input type="text" class="form-input" value="${window.Utils.escapeHtml(state.workspace.plan)}" disabled>
            </div>
            <div class="form-group">
              <label class="form-label">Storage Backend</label>
              <input type="text" class="form-input" value="${window.DB.useLocalStorage ? 'LocalStorage (Fallback)' : 'IndexedDB (Offline Persistent)'}" disabled>
            </div>
          </div>
          <div style="display: flex; justify-content: flex-end;">
            <button class="btn btn-primary btn-sm" id="saveWorkspaceNameBtn">Save Changes</button>
          </div>
        </div>

        <!-- Team Members Card -->
        <div class="chart-card">
          <div class="chart-card-header">
            <span class="chart-card-title">Team Members (${state.users.length})</span>
            <button class="btn btn-secondary btn-xs" id="addNewMemberBtn">
              ${window.Icons.get('plus', 12)}
              <span>Add Member</span>
            </button>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${state.users.map(u => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: var(--bg-surface-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-color-subtle);">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <img src="${u.avatar}" alt="${window.Utils.escapeHtml(u.name)}" class="avatar-sm">
                  <div>
                    <div style="font-weight: 600; font-size: 13px;">${window.Utils.escapeHtml(u.name)}</div>
                    <div style="font-size: 11px; color: var(--text-muted);">${window.Utils.escapeHtml(u.role)} • ${window.Utils.escapeHtml(u.email)}</div>
                  </div>
                </div>
                <div>
                  ${state.users.length > 1 ? `
                    <button class="icon-btn-sm icon-btn-danger delete-user-btn" data-user-id="${u.id}" title="Remove Member">
                      ${window.Icons.get('trash', 14)}
                    </button>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Custom Labels Card -->
        <div class="chart-card">
          <div class="chart-card-header">
            <span class="chart-card-title">Labels & Tags (${state.labels.length})</span>
            <button class="btn btn-secondary btn-xs" id="addNewLabelBtn">
              ${window.Icons.get('plus', 12)}
              <span>New Label</span>
            </button>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${state.labels.map(l => `
              <div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: var(--radius-md); border: 1px solid ${l.color}40; background-color: ${l.color}15; color: ${l.color}; font-size: 12px; font-weight: 600;">
                <span class="project-dot" style="background-color: ${l.color};"></span>
                <span>${window.Utils.escapeHtml(l.name)}</span>
                <button class="icon-btn-sm delete-label-btn" data-label-id="${l.id}" style="color: ${l.color}; padding: 0;" title="Delete Label">
                  ${window.Icons.get('x', 12)}
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Backup & Migration (Export / Import JSON) -->
        <div class="chart-card">
          <div class="chart-card-header">
            <span class="chart-card-title">Data Backup & Migration</span>
          </div>
          <p style="font-size: var(--font-size-sm); color: var(--text-secondary);">
            Export your entire workspace including projects, tasks, checklists, comments, and activity audit trail into a portable JSON document.
          </p>
          <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 6px;">
            <button class="btn btn-secondary" id="exportWorkspaceBtn">
              ${window.Icons.get('download', 14)}
              <span>Export Workspace JSON</span>
            </button>
            <label class="btn btn-secondary" style="cursor: pointer;">
              ${window.Icons.get('upload', 14)}
              <span>Import Workspace JSON</span>
              <input type="file" id="importFileInput" accept=".json" class="hidden-file-input">
            </label>
            <button class="btn btn-ghost" id="resetDemoDataBtn" style="color: var(--color-danger); margin-left: auto;">
              <span>Reset to Sample Data</span>
            </button>
          </div>
        </div>
      </div>
    `;

    this.attachEvents(container);
  },

  attachEvents(container) {
    // Save workspace name
    const saveNameBtn = container.querySelector('#saveWorkspaceNameBtn');
    const nameInput = container.querySelector('#settingsWorkspaceName');
    if (saveNameBtn && nameInput) {
      saveNameBtn.addEventListener('click', async () => {
        const val = nameInput.value.trim();
        if (val) {
          window.State.getState().workspace.name = val;
          await window.State.persist();
          document.getElementById('workspaceNameDisplay').textContent = val;
          window.Notifications.success('Workspace name saved');
        }
      });
    }

    // Add Member
    const addMemberBtn = container.querySelector('#addNewMemberBtn');
    if (addMemberBtn) {
      addMemberBtn.addEventListener('click', async () => {
        const name = prompt('Enter team member full name:');
        if (!name || !name.trim()) return;
        const role = prompt('Enter role title (e.g. Backend Engineer):') || 'Engineer';
        const email = `${name.toLowerCase().replace(/\s+/g, '.')}@acme.corp`;
        await window.State.addUser(name, role, email);
        window.Notifications.success(`Added member "${name}"`);
        this.render(container);
      });
    }

    // Delete User
    container.querySelectorAll('.delete-user-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const userId = btn.getAttribute('data-user-id');
        const user = window.State.getUserById(userId);
        window.Modals.confirm({
          title: 'Remove Team Member',
          message: `Are you sure you want to remove "${user?.name}"? Any assigned tasks will become unassigned.`,
          onConfirm: async () => {
            await window.State.deleteUser(userId);
            window.Notifications.info(`Removed ${user?.name}`);
            this.render(container);
          }
        });
      });
    });

    // Add Label
    const addLabelBtn = container.querySelector('#addNewLabelBtn');
    if (addLabelBtn) {
      addLabelBtn.addEventListener('click', async () => {
        const name = prompt('Enter label name:');
        if (!name || !name.trim()) return;
        const colors = ['#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        await window.State.addLabel(name, randomColor);
        window.Notifications.success(`Created label "${name}"`);
        this.render(container);
      });
    }

    // Delete Label
    container.querySelectorAll('.delete-label-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const labelId = btn.getAttribute('data-label-id');
        await window.State.deleteLabel(labelId);
        window.Notifications.info('Label removed');
        this.render(container);
      });
    });

    // Export Workspace JSON
    const exportBtn = container.querySelector('#exportWorkspaceBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const data = window.State.exportWorkspace();
        window.Utils.downloadJSON(data, 'taskboard-workspace.json');
        window.Notifications.success('Workspace exported successfully');
      });
    }

    // Import Workspace JSON
    const importInput = container.querySelector('#importFileInput');
    if (importInput) {
      importInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            const data = await window.Utils.readJSONFile(file);
            await window.State.importWorkspace(data);
            window.Notifications.success('Workspace imported successfully!');
            this.render(container);
          } catch (err) {
            window.Notifications.error(`Import failed: ${err.message}`);
          }
          importInput.value = '';
        }
      });
    }

    // Reset to demo data
    const resetBtn = container.querySelector('#resetDemoDataBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        window.Modals.confirm({
          title: 'Reset to Sample Data',
          message: 'This will replace current workspace data with original sample data. Are you sure?',
          onConfirm: async () => {
            await window.State.resetToDemoData();
            window.Notifications.success('Reset workspace to demo data');
            this.render(container);
          }
        });
      });
    }
  }
};
