/**
 * NoteSpace - Settings & Workspace Customization Modal
 * Controls theme, typography, workspace metadata, storage stats, backup export/import validator.
 */

import { store } from '../state/store.js';
import { db } from '../db/idb.js';
import { Icons, getIcon } from '../icons/icons.js';
import { exportWorkspace, readJSONFile } from '../utils/exportImport.js';
import { createElement, escapeHTML } from '../utils/dom.js';

export class SettingsModal {
  constructor() {
    this.backdropEl = null;
  }

  async open() {
    document.querySelectorAll('.ns-settings-modal-backdrop').forEach(m => m.remove());

    this.backdropEl = createElement('div', 'ns-modal-backdrop ns-settings-modal-backdrop');
    const modal = createElement('div', 'ns-settings-modal');

    const stats = await db.getStorageStats();
    const currentTheme = store.getSetting('theme', 'dark');
    const currentFont = store.getSetting('fontFamily', 'sans');
    const fullWidth = store.getSetting('fullWidth', false);
    const wsName = store.getSetting('workspaceName', 'My Workspace');
    const wsIcon = store.getSetting('workspaceIcon', '🪐');

    modal.innerHTML = `
      <div class="ns-modal-header">
        <div class="ns-modal-title">
          ${Icons.settings}
          <span>Settings & Preferences</span>
        </div>
        <button class="ns-modal-close-btn">${Icons.x}</button>
      </div>

      <div class="ns-modal-body ns-settings-body">
        
        <!-- Workspace Section -->
        <div class="ns-settings-section">
          <div class="ns-settings-title">Workspace Profile</div>
          <div class="ns-settings-grid">
            <div class="ns-form-group">
              <label class="ns-form-label">Workspace Icon</label>
              <input type="text" class="ns-input ns-ws-icon-inp" value="${escapeHTML(wsIcon)}" style="width: 70px; text-align: center; font-size: 1.2rem;" />
            </div>
            <div class="ns-form-group" style="flex:1;">
              <label class="ns-form-label">Workspace Name</label>
              <input type="text" class="ns-input ns-ws-name-inp" value="${escapeHTML(wsName)}" />
            </div>
          </div>
        </div>

        <div class="ns-settings-divider"></div>

        <!-- Appearance Section -->
        <div class="ns-settings-section">
          <div class="ns-settings-title">Appearance & Typography</div>
          
          <div class="ns-setting-row">
            <div class="ns-setting-info">
              <div class="ns-setting-name">Theme</div>
              <div class="ns-setting-desc">Choose between dark slate mode and crisp light mode.</div>
            </div>
            <div class="ns-theme-switch-group">
              <button class="ns-btn-toggle-opt ${currentTheme === 'dark' ? 'is-selected' : ''}" data-theme="dark">
                ${Icons.moon} Dark
              </button>
              <button class="ns-btn-toggle-opt ${currentTheme === 'light' ? 'is-selected' : ''}" data-theme="light">
                ${Icons.sun} Light
              </button>
            </div>
          </div>

          <div class="ns-setting-row">
            <div class="ns-setting-info">
              <div class="ns-setting-name">Font Family</div>
              <div class="ns-setting-desc">Select typography style for writing and headers.</div>
            </div>
            <div class="ns-font-switch-group">
              <button class="ns-btn-toggle-opt ${currentFont === 'sans' ? 'is-selected' : ''}" data-font="sans">Default Sans</button>
              <button class="ns-btn-toggle-opt ${currentFont === 'serif' ? 'is-selected' : ''}" data-font="serif">Serif Editorial</button>
              <button class="ns-btn-toggle-opt ${currentFont === 'mono' ? 'is-selected' : ''}" data-font="mono">Mono Technical</button>
            </div>
          </div>

          <div class="ns-setting-row">
            <div class="ns-setting-info">
              <div class="ns-setting-name">Full Width Canvas</div>
              <div class="ns-setting-desc">Expand editor content across full window width.</div>
            </div>
            <input type="checkbox" class="ns-fullwidth-toggle" ${fullWidth ? 'checked' : ''} />
          </div>
        </div>

        <div class="ns-settings-divider"></div>

        <!-- Storage & Data Section -->
        <div class="ns-settings-section">
          <div class="ns-settings-title">Storage & Persistence</div>
          <div class="ns-storage-stats-box">
            <div class="ns-stat-card">
              <div class="ns-stat-val">${stats.pagesCount}</div>
              <div class="ns-stat-lbl">Active Pages</div>
            </div>
            <div class="ns-stat-card">
              <div class="ns-stat-val">${stats.databasesCount}</div>
              <div class="ns-stat-lbl">Databases</div>
            </div>
            <div class="ns-stat-card">
              <div class="ns-stat-val">${stats.historyCount}</div>
              <div class="ns-stat-lbl">Snapshots</div>
            </div>
            <div class="ns-stat-card">
              <div class="ns-stat-val">${stats.approxSizeKB} KB</div>
              <div class="ns-stat-lbl">Data Size</div>
            </div>
          </div>

          <div class="ns-backup-actions">
            <button class="ns-btn ns-btn-secondary ns-btn-export-backup">
              ${Icons.download} Export Workspace JSON
            </button>
            <label class="ns-btn ns-btn-secondary ns-btn-import-backup">
              ${Icons.upload} Restore from JSON
              <input type="file" accept=".json" class="ns-import-file-inp" style="display:none;" />
            </label>
          </div>
          <div class="ns-import-status" style="display:none;"></div>
        </div>

        <div class="ns-settings-divider"></div>

        <!-- Danger Zone Section -->
        <div class="ns-settings-section">
          <div class="ns-settings-title ns-danger-title">Danger Zone</div>
          <div class="ns-setting-row">
            <div class="ns-setting-info">
              <div class="ns-setting-name">Reset Workspace</div>
              <div class="ns-setting-desc">Revert to starter sample tutorial pages & roadmap database.</div>
            </div>
            <button class="ns-btn ns-btn-danger ns-btn-reset-defaults">Reset to Starter</button>
          </div>
        </div>

      </div>
    `;

    this.backdropEl.appendChild(modal);
    document.body.appendChild(this.backdropEl);

    // Bind Workspace Name & Icon
    const wsNameInp = modal.querySelector('.ns-ws-name-inp');
    const wsIconInp = modal.querySelector('.ns-ws-icon-inp');

    wsNameInp.addEventListener('change', () => {
      store.setSetting('workspaceName', wsNameInp.value.trim() || 'My Workspace');
    });
    wsIconInp.addEventListener('change', () => {
      store.setSetting('workspaceIcon', wsIconInp.value.trim() || '🪐');
    });

    // Theme selector
    modal.querySelectorAll('[data-theme]').forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        store.setSetting('theme', theme);
        modal.querySelectorAll('[data-theme]').forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        document.documentElement.setAttribute('data-theme', theme);
      });
    });

    // Font selector
    modal.querySelectorAll('[data-font]').forEach(btn => {
      btn.addEventListener('click', () => {
        const font = btn.dataset.font;
        store.setSetting('fontFamily', font);
        modal.querySelectorAll('[data-font]').forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        document.documentElement.setAttribute('data-font', font);
      });
    });

    // Full width toggle
    const fwToggle = modal.querySelector('.ns-fullwidth-toggle');
    fwToggle.addEventListener('change', (e) => {
      store.setSetting('fullWidth', e.target.checked);
      document.body.classList.toggle('canvas-fullwidth', e.target.checked);
    });

    // Export backup
    modal.querySelector('.ns-btn-export-backup').addEventListener('click', () => {
      exportWorkspace();
    });

    // Import backup
    const importInp = modal.querySelector('.ns-import-file-inp');
    const importStatus = modal.querySelector('.ns-import-status');

    importInp.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      importStatus.style.display = 'block';
      importStatus.className = 'ns-import-status ns-status-loading';
      importStatus.innerText = 'Validating and restoring workspace...';

      try {
        const json = await readJSONFile(file);
        const res = await store.importWorkspaceJSON(json);
        importStatus.className = 'ns-import-status ns-status-success';
        importStatus.innerText = `Successfully restored ${res.pagesCount} pages and ${res.databasesCount} databases!`;
        setTimeout(() => this.close(), 1200);
      } catch (err) {
        importStatus.className = 'ns-import-status ns-status-error';
        importStatus.innerText = `Import failed: ${err.message}`;
      }
    });

    // Reset defaults
    modal.querySelector('.ns-btn-reset-defaults').addEventListener('click', async () => {
      if (confirm('Are you sure you want to reset workspace to starter data? All existing notes will be overwritten.')) {
        await store.resetToDefaults();
        this.close();
      }
    });

    // Close
    modal.querySelector('.ns-modal-close-btn').addEventListener('click', () => this.close());
    this.backdropEl.addEventListener('click', (e) => {
      if (e.target === this.backdropEl) this.close();
    });
  }

  close() {
    if (this.backdropEl) {
      this.backdropEl.remove();
      this.backdropEl = null;
    }
  }
}
