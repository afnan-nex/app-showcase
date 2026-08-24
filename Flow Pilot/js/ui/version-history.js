/**
 * FlowPilot Workflow Version History & Snapshot Manager
 */

class VersionHistoryModal {
  constructor(app) {
    this.app = app;
    this.modal = null;
    this.init();
  }

  init() {
    this.modal = document.createElement('div');
    this.modal.className = 'modal-overlay';
    this.modal.id = 'modal-version-history';

    this.modal.innerHTML = `
      <div class="modal-card" style="max-width:620px;">
        <div class="modal-header">
          <span class="modal-title">
            <span>⏱️</span> Workflow Version History
          </span>
          <button class="btn btn-ghost btn-sm btn-icon" id="btn-close-versions">✕</button>
        </div>
        <div class="modal-body">
          <div style="display:flex; gap:8px; align-items:center;">
            <input type="text" id="input-version-name" placeholder="Snapshot description (e.g. 'Before VIP rule change')" style="flex:1;" />
            <button class="btn btn-primary btn-sm" id="btn-create-snapshot">Save Snapshot</button>
          </div>
          <div class="topbar-divider" style="width:100%; height:1px; margin:4px 0;"></div>

          <div class="property-section-title">Saved Versions</div>
          <div id="versions-history-list" style="display:flex; flex-direction:column; gap:6px; max-height:360px; overflow-y:auto;">
            <div style="color:var(--text-muted); font-size:11px; padding:16px; text-align:center;">Loading versions...</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" id="btn-close-ver-footer">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(this.modal);

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
    this.modal.querySelector('#btn-close-versions').addEventListener('click', () => this.close());
    this.modal.querySelector('#btn-close-ver-footer').addEventListener('click', () => this.close());

    this.modal.querySelector('#btn-create-snapshot').addEventListener('click', async () => {
      const nameInput = this.modal.querySelector('#input-version-name');
      const name = nameInput.value.trim() || `Version ${new Date().toLocaleTimeString()}`;
      await this.app.saveWorkflowVersion(name);
      nameInput.value = '';
      this.loadVersions();
    });
  }

  async open() {
    this.modal.classList.add('active');
    await this.loadVersions();
  }

  close() {
    this.modal.classList.remove('active');
  }

  async loadVersions() {
    const listEl = this.modal.querySelector('#versions-history-list');
    const versions = await window.flowDB.getVersions(this.app.workflow.id);

    if (versions.length === 0) {
      listEl.innerHTML = '<div style="color:var(--text-muted); font-size:11px; padding:16px; text-align:center;">No saved snapshots for this workflow. Create one above!</div>';
      return;
    }

    let html = '';
    versions.forEach(ver => {
      const nodeCount = ver.data && ver.data.nodes ? ver.data.nodes.length : 0;
      const connCount = ver.data && ver.data.connections ? ver.data.connections.length : 0;
      const dateStr = new Date(ver.createdAt).toLocaleString();

      html += `
        <div class="shortcut-row" style="padding:10px 12px; justify-content:space-between;">
          <div style="display:flex; flex-direction:column; gap:2px;">
            <span style="font-weight:600; font-size:12px; color:var(--text-primary);">${this.escape(ver.name)}</span>
            <span style="font-size:10px; color:var(--text-muted);">${dateStr} • ${nodeCount} nodes, ${connCount} connections</span>
          </div>
          <button class="btn btn-primary btn-sm btn-restore-version" data-version-id="${ver.id}">Restore</button>
        </div>
      `;
    });

    listEl.innerHTML = html;

    listEl.querySelectorAll('.btn-restore-version').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.versionId;
        const target = versions.find(v => v.id === id);
        if (target && target.data) {
          if (confirm(`Restore snapshot "${target.name}"? Current unsaved changes will be replaced.`)) {
            this.app.loadWorkflow(target.data);
            this.close();
            this.app.toast(`Restored snapshot: ${target.name}`, 'Version Restored', 'success');
          }
        }
      });
    });
  }

  escape(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}

window.VersionHistoryModal = VersionHistoryModal;
