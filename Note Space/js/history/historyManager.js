/**
 * NoteSpace - Page Revision History Manager
 * Inspect past snapshots of the active document and restore previous versions.
 */

import { store } from '../state/store.js';
import { Icons, getIcon } from '../icons/icons.js';
import { createElement, escapeHTML, formatDate } from '../utils/dom.js';

export class HistoryManager {
  constructor() {
    this.backdropEl = null;
  }

  async open(pageId) {
    const page = store.getPage(pageId);
    if (!page) return;

    const revisions = await store.getPageHistory(pageId);

    document.querySelectorAll('.ns-history-modal-backdrop').forEach(m => m.remove());

    this.backdropEl = createElement('div', 'ns-modal-backdrop ns-history-modal-backdrop');
    const modal = createElement('div', 'ns-history-modal');

    modal.innerHTML = `
      <div class="ns-modal-header">
        <div class="ns-modal-title">
          ${Icons.history}
          <span>Version History: <strong>${escapeHTML(page.title || 'Untitled')}</strong></span>
        </div>
        <button class="ns-modal-close-btn">${Icons.x}</button>
      </div>

      <div class="ns-history-body">
        <div class="ns-history-sidebar">
          <div class="ns-history-list-title">Past Snapshots (${revisions.length})</div>
          <div class="ns-history-list"></div>
        </div>
        <div class="ns-history-preview-panel">
          <div class="ns-history-preview-header">
            <div class="ns-preview-meta">Select a version from the left to preview.</div>
            <button class="ns-btn ns-btn-primary ns-btn-restore-version" style="display:none;">Restore this version</button>
          </div>
          <div class="ns-history-preview-content"></div>
        </div>
      </div>
    `;

    this.backdropEl.appendChild(modal);
    document.body.appendChild(this.backdropEl);

    const listContainer = modal.querySelector('.ns-history-list');
    const previewContent = modal.querySelector('.ns-history-preview-content');
    const previewMeta = modal.querySelector('.ns-preview-meta');
    const restoreBtn = modal.querySelector('.ns-btn-restore-version');

    let selectedRevision = null;

    if (revisions.length === 0) {
      listContainer.innerHTML = `<div class="ns-history-empty">No historical snapshots recorded yet. Snapshots are created as you write.</div>`;
    } else {
      revisions.forEach((rev, idx) => {
        const item = createElement('div', `ns-history-item ${idx === 0 ? 'is-selected' : ''}`);
        const dateStr = new Date(rev.timestamp).toLocaleString();

        item.innerHTML = `
          <div class="ns-rev-date">${dateStr}</div>
          <div class="ns-rev-note">${rev.note || 'Snapshot'} • ${(rev.blocks || []).length} blocks</div>
        `;

        item.addEventListener('click', () => {
          listContainer.querySelectorAll('.ns-history-item').forEach(i => i.classList.remove('is-selected'));
          item.classList.add('is-selected');
          selectRevision(rev);
        });

        listContainer.appendChild(item);
      });

      // Select first by default
      selectRevision(revisions[0]);
    }

    function selectRevision(rev) {
      selectedRevision = rev;
      restoreBtn.style.display = 'inline-flex';
      previewMeta.innerHTML = `Snapshot from <strong>${new Date(rev.timestamp).toLocaleString()}</strong> (${(rev.blocks || []).length} blocks)`;

      // Render simplified preview
      let html = `<h1 class="ns-preview-title">${escapeHTML(rev.title || 'Untitled')}</h1>`;
      (rev.blocks || []).forEach(b => {
        html += `<div class="ns-preview-block">${b.content || ''}</div>`;
      });
      previewContent.innerHTML = html;
    }

    restoreBtn.addEventListener('click', async () => {
      if (!selectedRevision) return;
      if (confirm(`Restore version from ${new Date(selectedRevision.timestamp).toLocaleString()}? Current unsaved edits will be saved as a new snapshot.`)) {
        await store.restorePageRevision(selectedRevision.id);
        this.close();
      }
    });

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
