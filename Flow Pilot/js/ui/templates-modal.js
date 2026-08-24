/**
 * FlowPilot Templates Gallery Modal
 */

class TemplatesModal {
  constructor(app) {
    this.app = app;
    this.modal = null;
    this.init();
  }

  init() {
    this.modal = document.createElement('div');
    this.modal.className = 'modal-overlay';
    this.modal.id = 'modal-templates';

    this.modal.innerHTML = `
      <div class="modal-card" style="max-width:760px; max-height:85vh;">
        <div class="modal-header">
          <span class="modal-title">
            <span>📁</span> Pre-Built Automation Templates
          </span>
          <button class="btn btn-ghost btn-sm btn-icon" id="btn-close-templates">✕</button>
        </div>
        <div class="modal-body">
          <p style="font-size:12px; color:var(--text-secondary); margin-bottom:8px;">
            Jumpstart your automation with enterprise-grade workflow recipes. Click any template to clone it into your workspace.
          </p>
          <div class="templates-grid" id="templates-grid-list"></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" id="btn-cancel-templates">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(this.modal);

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
    this.modal.querySelector('#btn-close-templates').addEventListener('click', () => this.close());
    this.modal.querySelector('#btn-cancel-templates').addEventListener('click', () => this.close());
  }

  open() {
    this.renderTemplates();
    this.modal.classList.add('active');
  }

  close() {
    this.modal.classList.remove('active');
  }

  renderTemplates() {
    const grid = this.modal.querySelector('#templates-grid-list');
    let html = '';

    WORKFLOW_TEMPLATES.forEach(tpl => {
      html += `
        <div class="template-card" data-template-id="${tpl.id}">
          <div class="template-card-header">
            <span class="template-badge">${tpl.badge || tpl.category}</span>
            <span style="font-size:11px; color:var(--text-muted);">${tpl.category}</span>
          </div>
          <div class="template-title">${this.escape(tpl.name)}</div>
          <div class="template-description">${this.escape(tpl.description)}</div>
          <div class="template-nodes-preview">
            <span>⚡ Ready to load</span>
            <button class="btn btn-primary btn-sm" style="margin-left:auto;">Load Template →</button>
          </div>
        </div>
      `;
    });

    grid.innerHTML = html;

    grid.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.templateId;
        const tpl = WORKFLOW_TEMPLATES.find(t => t.id === id);
        if (tpl) {
          const newWf = tpl.createWorkflow();
          this.app.loadWorkflow(newWf);
          this.close();
          this.app.toast(`Loaded "${tpl.name}"`, 'Template Applied', 'success');
        }
      });
    });
  }

  escape(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}

window.TemplatesModal = TemplatesModal;
