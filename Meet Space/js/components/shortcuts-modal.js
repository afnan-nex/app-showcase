/**
 * MeetSpace - Keyboard Shortcuts Modal & Facilitator Guide
 * Triggered via '?' key or command palette
 */

class ShortcutsHelper {
  constructor() {
    this.modal = null;
  }

  init() {
    this._renderModal();
    window.addEventListener('keydown', (e) => {
      // If user presses '?' and not typing in an input/textarea
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName) && !e.target.isContentEditable) {
        e.preventDefault();
        this.open();
      }
    });
  }

  _renderModal() {
    let backdrop = document.getElementById('shortcuts-modal-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'shortcuts-modal-backdrop';
      backdrop.className = 'modal-backdrop';
      backdrop.innerHTML = `
        <div class="modal-dialog" style="max-width: 600px;">
          <div class="modal-header">
            <h3 class="modal-title flex items-center gap-2">${Icons.helpCircle(20)} Facilitator Keyboard Shortcuts</h3>
            <button class="btn btn-ghost btn-icon-only modal-close-btn">${Icons.x(18)}</button>
          </div>
          <div class="modal-body" style="display:flex; flex-direction:column; gap:16px;">
            <div>
              <h4 style="font-size:0.85rem; text-transform:uppercase; color:var(--text-dim); margin-bottom:8px; letter-spacing:0.05em;">Global Navigation</h4>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
                <div class="flex items-center justify-between" style="padding:6px 10px; background:var(--bg-subtle); border-radius:var(--radius-sm);">
                  <span style="font-size:0.85rem;">Command Palette</span>
                  <span class="kbd-badge">Cmd + K</span>
                </div>
                <div class="flex items-center justify-between" style="padding:6px 10px; background:var(--bg-subtle); border-radius:var(--radius-sm);">
                  <span style="font-size:0.85rem;">Shortcuts Reference</span>
                  <span class="kbd-badge">?</span>
                </div>
                <div class="flex items-center justify-between" style="padding:6px 10px; background:var(--bg-subtle); border-radius:var(--radius-sm);">
                  <span style="font-size:0.85rem;">Close Modals / Overlays</span>
                  <span class="kbd-badge">ESC</span>
                </div>
                <div class="flex items-center justify-between" style="padding:6px 10px; background:var(--bg-subtle); border-radius:var(--radius-sm);">
                  <span style="font-size:0.85rem;">Print Minutes / PDF</span>
                  <span class="kbd-badge">Cmd + P</span>
                </div>
              </div>
            </div>

            <div>
              <h4 style="font-size:0.85rem; text-transform:uppercase; color:var(--text-dim); margin-bottom:8px; letter-spacing:0.05em;">Live Meeting Facilitator Mode</h4>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
                <div class="flex items-center justify-between" style="padding:6px 10px; background:var(--bg-subtle); border-radius:var(--radius-sm);">
                  <span style="font-size:0.85rem;">Play / Pause Timer</span>
                  <span class="kbd-badge">Space</span>
                </div>
                <div class="flex items-center justify-between" style="padding:6px 10px; background:var(--bg-subtle); border-radius:var(--radius-sm);">
                  <span style="font-size:0.85rem;">Next Agenda Topic</span>
                  <span class="kbd-badge">N</span>
                </div>
                <div class="flex items-center justify-between" style="padding:6px 10px; background:var(--bg-subtle); border-radius:var(--radius-sm);">
                  <span style="font-size:0.85rem;">Previous Agenda Topic</span>
                  <span class="kbd-badge">P</span>
                </div>
                <div class="flex items-center justify-between" style="padding:6px 10px; background:var(--bg-subtle); border-radius:var(--radius-sm);">
                  <span style="font-size:0.85rem;">Add +1 Minute</span>
                  <span class="kbd-badge">+</span>
                </div>
              </div>
            </div>

            <div>
              <h4 style="font-size:0.85rem; text-transform:uppercase; color:var(--text-dim); margin-bottom:8px; letter-spacing:0.05em;">Notes Formatting (When inside editor)</h4>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
                <div class="flex items-center justify-between" style="padding:6px 10px; background:var(--bg-subtle); border-radius:var(--radius-sm);">
                  <span style="font-size:0.85rem;">Bold</span>
                  <span class="kbd-badge">Cmd + B</span>
                </div>
                <div class="flex items-center justify-between" style="padding:6px 10px; background:var(--bg-subtle); border-radius:var(--radius-sm);">
                  <span style="font-size:0.85rem;">Italic</span>
                  <span class="kbd-badge">Cmd + I</span>
                </div>
                <div class="flex items-center justify-between" style="padding:6px 10px; background:var(--bg-subtle); border-radius:var(--radius-sm);">
                  <span style="font-size:0.85rem;">Insert Bullet List</span>
                  <span class="kbd-badge">Cmd + Shift + 8</span>
                </div>
                <div class="flex items-center justify-between" style="padding:6px 10px; background:var(--bg-subtle); border-radius:var(--radius-sm);">
                  <span style="font-size:0.85rem;">Autosave</span>
                  <span style="font-size:0.75rem; color:var(--success-text); font-weight:600;">Continuous</span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary modal-close-btn">Got It</button>
          </div>
        </div>
      `;
      document.body.appendChild(backdrop);
    }

    this.modal = backdrop;

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal || e.target.closest('.modal-close-btn')) {
        this.close();
      }
    });
  }

  open() {
    if (!this.modal) this._renderModal();
    this.modal.classList.add('open');
  }

  close() {
    if (this.modal) {
      this.modal.classList.remove('open');
    }
  }
}

const Shortcuts = new ShortcutsHelper();
const ShortcutsHelper_Singleton = Shortcuts;
