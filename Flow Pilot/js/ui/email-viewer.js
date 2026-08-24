/**
 * FlowPilot Simulated Email Inbox Modal
 */

class EmailViewerModal {
  constructor(app) {
    this.app = app;
    this.modal = null;
    this.init();
  }

  init() {
    this.modal = document.createElement('div');
    this.modal.className = 'modal-overlay';
    this.modal.id = 'modal-email-viewer';

    this.modal.innerHTML = `
      <div class="modal-card" style="max-width:740px; max-height:85vh;">
        <div class="modal-header">
          <span class="modal-title">
            <span>✉️</span> Simulated Sent Email Inbox
          </span>
          <button class="btn btn-ghost btn-sm btn-icon" id="btn-close-email-modal">✕</button>
        </div>
        <div class="modal-body">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:11px; color:var(--text-muted);">Emails dispatched by "Email" nodes during simulations</span>
            <button class="btn btn-ghost btn-sm" id="btn-clear-emails">Clear Inbox</button>
          </div>

          <div id="email-inbox-list" style="display:flex; flex-direction:column; gap:8px; max-height:400px; overflow-y:auto;">
            <div style="color:var(--text-muted); font-size:11px; text-align:center; padding:20px;">No emails dispatched yet.</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" id="btn-close-email-footer">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(this.modal);

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
    this.modal.querySelector('#btn-close-email-modal').addEventListener('click', () => this.close());
    this.modal.querySelector('#btn-close-email-footer').addEventListener('click', () => this.close());

    this.modal.querySelector('#btn-clear-emails').addEventListener('click', () => {
      window.flowEmailInbox = [];
      this.renderEmails();
    });
  }

  open() {
    this.modal.classList.add('active');
    this.renderEmails();
  }

  close() {
    this.modal.classList.remove('active');
  }

  renderEmails() {
    const listEl = this.modal.querySelector('#email-inbox-list');
    const emails = window.flowEmailInbox || [];

    if (emails.length === 0) {
      listEl.innerHTML = '<div style="color:var(--text-muted); font-size:11px; text-align:center; padding:20px;">No emails dispatched yet. Run a workflow with an Email node to see mock dispatches.</div>';
      return;
    }

    let html = '';
    emails.forEach(em => {
      const timeStr = new Date(em.sentAt).toLocaleString();
      html += `
        <div class="template-card" style="padding:10px 14px; gap:6px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-weight:700; font-size:12px; color:var(--text-primary);">${this.escape(em.subject)}</span>
            <span style="font-size:10px; color:var(--text-muted);">${timeStr}</span>
          </div>
          <div style="font-size:11px; color:var(--text-muted);">
            To: <strong style="color:var(--text-secondary);">${this.escape(em.to)}</strong> | From: ${this.escape(em.from)}
          </div>
          <div class="code-editor-area" style="min-height:auto; max-height:90px; overflow:auto; margin-top:4px; font-size:11px; white-space:pre-wrap;">${this.escape(em.body)}</div>
        </div>
      `;
    });

    listEl.innerHTML = html;
  }

  escape(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}

window.EmailViewerModal = EmailViewerModal;
