/**
 * MeetSpace - Workspace Settings & User Preferences View
 * Customization for themes, audio synthesizers, auto-advance timers, and backup/restore
 */

const SettingsView = {
  render(container) {
    const user = Store.getCurrentUser();
    const currentTheme = Store.getSetting('theme', 'light');
    const soundEnabled = Store.getSetting('soundEnabled', true);
    const soundVol = Store.getSetting('soundVolume', 0.6);
    const autoAdvance = Store.getSetting('autoAdvanceAgenda', true);

    container.innerHTML = `
      <div class="flex-col gap-6" style="max-width: 800px;">
        <!-- View Header -->
        <div class="view-header">
          <div class="view-title-group">
            <h1 class="view-title">${Icons.settings(24)} Workspace Preferences & Settings</h1>
            <p class="view-subtitle">Manage facilitator audio cues, theme appearance, profiles, and data backups</p>
          </div>
        </div>

        <!-- 1. Profile Settings -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">${Icons.user(18)} Facilitator Profile</h3>
          </div>
          <form id="settings-profile-form" onsubmit="window.SettingsView.saveProfile(event)">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="sp-name">Your Full Name</label>
                <input type="text" id="sp-name" class="form-input" value="${this._escape(user.name)}" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="sp-email">Work Email</label>
                <input type="email" id="sp-email" class="form-input" value="${this._escape(user.email)}" required />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="sp-role">Default Title / Role</label>
              <input type="text" id="sp-role" class="form-input" value="${this._escape(user.role)}" />
            </div>
            <button type="submit" class="btn btn-primary btn-sm">Save Profile Changes</button>
          </form>
        </div>

        <!-- 2. Appearance & Sound -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">${Icons.sun(18)} Theme & Audio Experience</h3>
          </div>
          <div class="flex-col gap-4">
            <!-- Theme Selection -->
            <div class="flex items-center justify-between" style="padding-bottom: 12px; border-bottom: 1px solid var(--border-subtle);">
              <div>
                <div class="font-semibold" style="font-size:0.9rem;">Interface Color Theme</div>
                <div class="text-muted" style="font-size:0.775rem;">Switch between clean Slate Light and deep Charcoal Dark modes</div>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="window.SettingsView.toggleTheme()">
                ${currentTheme === 'dark' ? Icons.sun(16) + ' Switch to Light Mode' : Icons.moon(16) + ' Switch to Dark Mode'}
              </button>
            </div>

            <!-- Sound Cues Toggle -->
            <div class="flex items-center justify-between" style="padding-bottom: 12px; border-bottom: 1px solid var(--border-subtle);">
              <div>
                <div class="font-semibold" style="font-size:0.9rem;">Facilitator Chimes & Sound Effects</div>
                <div class="text-muted" style="font-size:0.775rem;">Synthesized harmonic chime plays when agenda countdown timers complete</div>
              </div>
              <div class="flex items-center gap-2">
                <button class="btn btn-secondary btn-sm" onclick="AudioService.playTimerChime()" title="Test audio output">
                  ${Icons.volume2(14)} Test Chime
                </button>
                <input type="checkbox" id="sp-sound" ${soundEnabled ? 'checked' : ''} onchange="window.SettingsView.toggleSound(this.checked)" style="width: 20px; height: 20px; cursor: pointer;" />
              </div>
            </div>

            <!-- Auto-Advance Agenda Items -->
            <div class="flex items-center justify-between">
              <div>
                <div class="font-semibold" style="font-size:0.9rem;">Auto-Advance Agenda in Live Mode</div>
                <div class="text-muted" style="font-size:0.775rem;">Automatically progress to the next topic when the countdown reaches 0:00</div>
              </div>
              <input type="checkbox" id="sp-autoadvance" ${autoAdvance ? 'checked' : ''} onchange="window.SettingsView.toggleAutoAdvance(this.checked)" style="width: 20px; height: 20px; cursor: pointer;" />
            </div>
          </div>
        </div>

        <!-- 3. Backup, Restore & Reset -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">${Icons.download(18)} Data Persistence & Backup</h3>
          </div>
          <div class="flex-col gap-4">
            <p class="text-muted" style="font-size: 0.85rem;">
              MeetSpace operates 100% locally in your browser using IndexedDB. You can export complete snapshots of your meetings, decisions, and action items as JSON at any time.
            </p>

            <div class="flex items-center gap-3 flex-wrap">
              <button class="btn btn-secondary btn-sm" onclick="window.Exporter.exportJsonBackup()">
                ${Icons.download(14)} Export JSON Backup
              </button>

              <label class="btn btn-secondary btn-sm" style="margin-bottom:0; cursor:pointer;">
                ${Icons.upload(14)} Restore Backup
                <input type="file" id="import-backup-file" accept=".json" style="display:none;" onchange="window.SettingsView.handleImportBackup(this)" />
              </label>

              <button class="btn btn-danger btn-sm" onclick="window.SettingsView.resetDemoData()">
                ${Icons.rotateCcw(14)} Reset to Demo Data
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async saveProfile(e) {
    e.preventDefault();
    const name = document.getElementById('sp-name').value.trim();
    const email = document.getElementById('sp-email').value.trim();
    const role = document.getElementById('sp-role').value.trim();

    await Store.setSetting('currentUser', { id: 'u1', name, email, role });
    Notifier.show('Profile Saved', 'User information updated.', 'success');

    // Update sidebar user name if present
    const userLabel = document.getElementById('sidebar-user-name');
    if (userLabel) userLabel.textContent = name;
  },

  async toggleTheme() {
    const next = await Store.toggleTheme();
    Notifier.show('Theme Changed', `Switched to ${next} theme.`, 'info');
    this.render(document.getElementById('main-content-view'));
  },

  async toggleSound(enabled) {
    await Store.setSetting('soundEnabled', enabled);
    AudioService.setEnabled(enabled);
    Notifier.show('Sound Settings', enabled ? 'Sound cues enabled' : 'Sound cues muted', 'info');
  },

  async toggleAutoAdvance(enabled) {
    await Store.setSetting('autoAdvanceAgenda', enabled);
    Notifier.show('Facilitator Settings', enabled ? 'Auto-advance enabled' : 'Auto-advance disabled', 'info');
  },

  async handleImportBackup(input) {
    if (input.files && input.files[0]) {
      const file = input.files[0];
      await window.Exporter.importJsonBackup(file);
      this.render(document.getElementById('main-content-view'));
    }
  },

  async resetDemoData() {
    if (confirm('Are you sure you want to reset all data back to default sample meetings? This will overwrite changes.')) {
      await Store.resetToSampleData();
      Notifier.show('Sample Data Reset', 'Workspace reloaded with sample meetings.', 'success');
      this.render(document.getElementById('main-content-view'));
    }
  },

  _escape(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

window.SettingsView = SettingsView;
