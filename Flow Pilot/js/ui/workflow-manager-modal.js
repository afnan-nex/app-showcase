/**
 * FlowPilot Workflow Manager Modal
 * Switch between saved workflows, create new ones, duplicate and delete
 */

class WorkflowManagerModal {
  constructor(app) {
    this.app = app;
    this.modal = null;
    this.init();
  }

  init() {
    this.modal = document.createElement('div');
    this.modal.className = 'modal-overlay';
    this.modal.id = 'modal-workflow-manager';

    this.modal.innerHTML = `
      <div class="modal-card" style="max-width:680px; max-height:85vh;">
        <div class="modal-header">
          <span class="modal-title">
            <span>🗂️</span> Saved Workflows
          </span>
          <button class="btn btn-ghost btn-sm btn-icon" id="btn-close-wf-manager">✕</button>
        </div>
        <div class="modal-body">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <p style="font-size:12px; color:var(--text-secondary);">Manage and switch between your local automation workflows.</p>
            <button class="btn btn-primary btn-sm" id="btn-create-new-wf">+ New Workflow</button>
          </div>

          <div id="saved-workflows-list" style="display:flex; flex-direction:column; gap:8px; max-height:380px; overflow-y:auto; margin-top:6px;">
            <div style="color:var(--text-muted); font-size:11px; padding:20px; text-align:center;">Loading workflows...</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" id="btn-close-wf-footer">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(this.modal);

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
    this.modal.querySelector('#btn-close-wf-manager').addEventListener('click', () => this.close());
    this.modal.querySelector('#btn-close-wf-footer').addEventListener('click', () => this.close());

    this.modal.querySelector('#btn-create-new-wf').addEventListener('click', async () => {
      const name = prompt('Enter a name for the new workflow:', 'New Automation Flow');
      if (name) {
        const newWf = createDefaultWorkflow(name.trim());
        await window.flowDB.saveWorkflow(newWf);
        this.app.loadWorkflow(newWf);
        this.close();
        this.app.toast(`Created "${newWf.name}"`, 'Workflow Created', 'success');
      }
    });
  }

  async open() {
    this.modal.classList.add('active');
    await this.renderWorkflows();
  }

  close() {
    this.modal.classList.remove('active');
  }

  async renderWorkflows() {
    const listEl = this.modal.querySelector('#saved-workflows-list');
    const workflows = await window.flowDB.getAllWorkflows();

    if (workflows.length === 0) {
      listEl.innerHTML = '<div style="color:var(--text-muted); font-size:11px; padding:20px; text-align:center;">No saved workflows found.</div>';
      return;
    }

    // Sort by updatedAt desc
    workflows.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));

    let html = '';
    workflows.forEach(wf => {
      const isActive = this.app.workflow && this.app.workflow.id === wf.id;
      const nodeCount = wf.nodes ? wf.nodes.length : 0;
      const connCount = wf.connections ? wf.connections.length : 0;
      const updatedStr = new Date(wf.updatedAt || wf.createdAt || Date.now()).toLocaleDateString();

      html += `
        <div class="template-card" style="padding:10px 14px; ${isActive ? 'border-color: #3b82f6;' : ''}">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:14px;">⚡</span>
              <strong style="font-size:13px; color:var(--text-primary);">${this.escape(wf.name || 'Untitled')}</strong>
              ${isActive ? '<span class="badge badge-success">Active</span>' : ''}
            </div>
            <div style="display:flex; gap:6px;">
              ${!isActive ? `<button class="btn btn-primary btn-sm btn-switch-wf" data-wf-id="${wf.id}">Open</button>` : ''}
              <button class="btn btn-ghost btn-sm btn-dup-wf" data-wf-id="${wf.id}" title="Duplicate">❐</button>
              <button class="btn btn-danger btn-sm btn-del-wf" data-wf-id="${wf.id}" title="Delete">✕</button>
            </div>
          </div>
          <div style="font-size:11px; color:var(--text-muted); display:flex; gap:12px; margin-top:4px;">
            <span>${nodeCount} Nodes</span>
            <span>${connCount} Connections</span>
            <span>Updated ${updatedStr}</span>
          </div>
        </div>
      `;
    });

    listEl.innerHTML = html;

    listEl.querySelectorAll('.btn-switch-wf').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.wfId;
        const target = await window.flowDB.getWorkflow(id);
        if (target) {
          this.app.loadWorkflow(target);
          this.close();
          this.app.toast(`Switched to "${target.name}"`, 'Workflow Loaded', 'success');
        }
      });
    });

    listEl.querySelectorAll('.btn-dup-wf').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.wfId;
        const target = await window.flowDB.getWorkflow(id);
        if (target) {
          const duplicate = JSON.parse(JSON.stringify(target));
          duplicate.id = 'wf_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
          duplicate.name = `${target.name} (Copy)`;
          duplicate.createdAt = new Date().toISOString();
          duplicate.updatedAt = new Date().toISOString();
          await window.flowDB.saveWorkflow(duplicate);
          this.renderWorkflows();
          this.app.toast('Workflow duplicated', 'Duplicate Created', 'success');
        }
      });
    });

    listEl.querySelectorAll('.btn-del-wf').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.wfId;
        if (workflows.length <= 1) {
          alert('Cannot delete the only remaining workflow.');
          return;
        }
        if (confirm('Are you sure you want to delete this workflow?')) {
          await window.flowDB.deleteWorkflow(id);
          if (this.app.workflow && this.app.workflow.id === id) {
            const remaining = await window.flowDB.getAllWorkflows();
            if (remaining.length > 0) this.app.loadWorkflow(remaining[0]);
          }
          this.renderWorkflows();
          this.app.toast('Workflow deleted', 'Deleted', 'info');
        }
      });
    });
  }

  escape(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}

window.WorkflowManagerModal = WorkflowManagerModal;
