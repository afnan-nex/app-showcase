/**
 * NoteSpace - Trash Management Modal
 * Allows viewing trashed pages, restoring them to original tree or root, and permanent deletion.
 */

import { store } from '../state/store.js';
import { Icons, getIcon } from '../icons/icons.js';
import { createElement, escapeHTML, formatDate } from '../utils/dom.js';

export class TrashModal {
  constructor() {
    this.backdropEl = null;
  }

  open() {
    document.querySelectorAll('.ns-trash-modal-backdrop').forEach(m => m.remove());

    this.backdropEl = createElement('div', 'ns-modal-backdrop ns-trash-modal-backdrop');
    const modal = createElement('div', 'ns-trash-modal');

    this.renderModal(modal);

    this.backdropEl.appendChild(modal);
    document.body.appendChild(this.backdropEl);

    this.backdropEl.addEventListener('click', (e) => {
      if (e.target === this.backdropEl) this.close();
    });
  }

  renderModal(modal) {
    const trashed = store.getAllPages().filter(p => p.isTrash);

    modal.innerHTML = `
      <div class="ns-modal-header">
        <div class="ns-modal-title">
          ${Icons.trash}
          <span>Trash (${trashed.length})</span>
        </div>
        <div class="ns-modal-header-actions">
          ${trashed.length > 0 ? `<button class="ns-btn ns-btn-danger ns-btn-empty-trash">Empty Trash</button>` : ''}
          <button class="ns-modal-close-btn">${Icons.x}</button>
        </div>
      </div>

      <div class="ns-modal-body">
        <div class="ns-trash-search-wrap">
          ${Icons.search}
          <input type="text" class="ns-input ns-trash-search-inp" placeholder="Filter trashed pages..." />
        </div>
        <div class="ns-trash-list"></div>
      </div>
    `;

    const listContainer = modal.querySelector('.ns-trash-list');
    const searchInp = modal.querySelector('.ns-trash-search-inp');

    const renderList = (filter = '') => {
      listContainer.innerHTML = '';
      const filtered = trashed.filter(p => (p.title || 'Untitled').toLowerCase().includes(filter.toLowerCase()));

      if (filtered.length === 0) {
        listContainer.innerHTML = `
          <div class="ns-trash-empty">
            <div class="ns-empty-icon">${Icons.trash}</div>
            <p>${trashed.length === 0 ? 'Trash is empty' : 'No matching trashed pages found'}</p>
          </div>
        `;
        return;
      }

      filtered.forEach(page => {
        const item = createElement('div', 'ns-trash-item');
        const deletedStr = page.trashDate ? formatDate(page.trashDate) : 'Recently';

        item.innerHTML = `
          <div class="ns-trash-item-info">
            <span class="ns-trash-icon">${page.icon || '📄'}</span>
            <span class="ns-trash-title">${escapeHTML(page.title || 'Untitled')}</span>
            <span class="ns-trash-date">Deleted ${deletedStr}</span>
          </div>
          <div class="ns-trash-item-actions">
            <button class="ns-btn-sm ns-btn-restore" title="Restore Page">${Icons.refreshCw} Restore</button>
            <button class="ns-btn-sm ns-btn-danger ns-btn-delete-perm" title="Delete permanently">${Icons.trash} Delete</button>
          </div>
        `;

        item.querySelector('.ns-btn-restore').addEventListener('click', async () => {
          await store.restoreFromTrash(page.id);
          this.renderModal(modal);
        });

        item.querySelector('.ns-btn-delete-perm').addEventListener('click', async () => {
          if (confirm(`Permanently delete "${page.title || 'Untitled'}"? This action cannot be undone.`)) {
            await store.deletePermanently(page.id);
            this.renderModal(modal);
          }
        });

        listContainer.appendChild(item);
      });
    };

    renderList();

    searchInp.addEventListener('input', (e) => {
      renderList(e.target.value.trim());
    });

    const emptyBtn = modal.querySelector('.ns-btn-empty-trash');
    if (emptyBtn) {
      emptyBtn.addEventListener('click', async () => {
        if (confirm('Permanently delete all items in trash? This cannot be undone.')) {
          await store.emptyTrash();
          this.renderModal(modal);
        }
      });
    }

    modal.querySelector('.ns-modal-close-btn').addEventListener('click', () => this.close());
  }

  close() {
    if (this.backdropEl) {
      this.backdropEl.remove();
      this.backdropEl = null;
    }
  }
}
