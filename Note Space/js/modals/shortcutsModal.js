/**
 * NoteSpace - Keyboard Shortcuts Modal Cheatsheet
 */

import { Icons } from '../icons/icons.js';
import { createElement } from '../utils/dom.js';

export class ShortcutsModal {
  constructor() {
    this.backdropEl = null;
    this.bindShortcut();
  }

  bindShortcut() {
    window.addEventListener('keydown', (e) => {
      // Shift + ? or Ctrl + /
      if ((e.key === '?' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT' && !document.activeElement.isContentEditable) ||
          ((e.ctrlKey || e.metaKey) && e.key === '/')) {
        e.preventDefault();
        this.open();
      }
    });
  }

  open() {
    document.querySelectorAll('.ns-shortcuts-backdrop').forEach(m => m.remove());

    this.backdropEl = createElement('div', 'ns-modal-backdrop ns-shortcuts-backdrop');
    const modal = createElement('div', 'ns-shortcuts-modal');

    modal.innerHTML = `
      <div class="ns-modal-header">
        <div class="ns-modal-title">
          ${Icons.sparkles}
          <span>Keyboard Shortcuts & Markdown Reference</span>
        </div>
        <button class="ns-modal-close-btn" aria-label="Close">${Icons.x}</button>
      </div>

      <div class="ns-modal-body ns-shortcuts-body">
        
        <div class="ns-shortcuts-grid">
          
          <div class="ns-shortcut-col">
            <div class="ns-sc-group-title">Navigation & Actions</div>
            
            <div class="ns-sc-row">
              <span class="ns-sc-label">Search & Command Palette</span>
              <span class="ns-sc-keys"><kbd>Ctrl</kbd> + <kbd>K</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Toggle Sidebar</span>
              <span class="ns-sc-keys"><kbd>Ctrl</kbd> + <kbd>\\</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Open Shortcuts Cheatsheet</span>
              <span class="ns-sc-keys"><kbd>?</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Close Popup / Modal</span>
              <span class="ns-sc-keys"><kbd>Esc</kbd></span>
            </div>

            <div class="ns-sc-group-title" style="margin-top:16px;">Rich Text Formatting</div>
            
            <div class="ns-sc-row">
              <span class="ns-sc-label">Bold text</span>
              <span class="ns-sc-keys"><kbd>Ctrl</kbd> + <kbd>B</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Italic text</span>
              <span class="ns-sc-keys"><kbd>Ctrl</kbd> + <kbd>I</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Underline text</span>
              <span class="ns-sc-keys"><kbd>Ctrl</kbd> + <kbd>U</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Inline Code</span>
              <span class="ns-sc-keys"><kbd>Ctrl</kbd> + <kbd>E</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Insert Link</span>
              <span class="ns-sc-keys"><kbd>Ctrl</kbd> + <kbd>K</kbd></span>
            </div>
          </div>

          <div class="ns-shortcut-col">
            <div class="ns-sc-group-title">Markdown Shortcuts at line start</div>
            
            <div class="ns-sc-row">
              <span class="ns-sc-label">Heading 1</span>
              <span class="ns-sc-keys"><kbd>#</kbd> <kbd>Space</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Heading 2</span>
              <span class="ns-sc-keys"><kbd>##</kbd> <kbd>Space</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Heading 3</span>
              <span class="ns-sc-keys"><kbd>###</kbd> <kbd>Space</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Bulleted List</span>
              <span class="ns-sc-keys"><kbd>-</kbd> or <kbd>*</kbd> <kbd>Space</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Numbered List</span>
              <span class="ns-sc-keys"><kbd>1.</kbd> <kbd>Space</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">To-do Checklist</span>
              <span class="ns-sc-keys"><kbd>[]</kbd> <kbd>Space</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Quote block</span>
              <span class="ns-sc-keys"><kbd>&gt;</kbd> <kbd>Space</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Divider rule</span>
              <span class="ns-sc-keys"><kbd>---</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Code block</span>
              <span class="ns-sc-keys"><kbd>\`\`\`</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Slash Commands Menu</span>
              <span class="ns-sc-keys"><kbd>/</kbd></span>
            </div>
          </div>

        </div>

      </div>
    `;

    this.backdropEl.appendChild(modal);
    document.body.appendChild(this.backdropEl);

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
