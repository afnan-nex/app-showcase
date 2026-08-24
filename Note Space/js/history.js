/**
 * NoteSpace - Page Revision History & Snapshot Restore
 */
class HistoryManager {
  constructor() {
    this.modal = null;
    this.pageId = null;
    this.revisions = [];
    this.selectedRevision = null;
    this.init();
  }

  init() {
    if (document.body) {
      this.createModalElement();
    } else {
      document.addEventListener('DOMContentLoaded', () => this.createModalElement());
    }
  }

  createModalElement() {
    this.modal = document.createElement('div');
    this.modal.className = 'history-modal-backdrop';
    this.modal.innerHTML = `
      <div class="history-drawer">
        <div class="history-header">
          <div class="history-title-wrap">
            ${Icons.get('history', 'icon-sm', 16)}
            <h3>Page Revision History</h3>
          </div>
          <button class="history-close-btn" title="Close">${Icons.get('x', 'icon-sm', 16)}</button>
        </div>
        <div class="history-body">
          <div class="history-timeline-list"></div>
          <div class="history-preview-panel">
            <div class="history-preview-header">
              <div class="preview-meta">Select a snapshot to preview</div>
              <button class="btn-sm btn-primary restore-rev-btn" style="display:none;">Restore This Version</button>
            </div>
            <div class="history-preview-content"></div>
          </div>
        </div>
      </div>
    `;

    this.modal?.querySelector('.history-close-btn')?.addEventListener('click', () => this.close());
    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    document.body.appendChild(this.modal);
  }

  async open(pageId) {
    if (!pageId || pageId === '__trash__') return;
    this.pageId = pageId;
    this.modal.classList.add('is-open');

    this.revisions = await NoteSpaceDB.getRevisions(pageId);

    // If no revisions exist yet, record a baseline revision right now
    if (this.revisions.length === 0 && State.activePageId === pageId) {
      await NoteSpaceDB.saveRevision(pageId, {
        title: State.activePage?.title,
        icon: State.activePage?.icon,
        cover: State.activePage?.cover,
        blocks: State.blocks,
        database: State.database
      });
      this.revisions = await NoteSpaceDB.getRevisions(pageId);
    }

    this.renderTimeline();

    if (this.revisions.length > 0) {
      this.selectRevision(this.revisions[0]);
    } else {
      this.modal.querySelector('.history-preview-content').innerHTML = `
        <div class="empty-state">No previous snapshots recorded yet. Changes will appear here as you edit.</div>
      `;
    }
  }

  close() {
    this.modal.classList.remove('is-open');
  }

  renderTimeline() {
    const list = this.modal.querySelector('.history-timeline-list');
    list.innerHTML = '';

    if (this.revisions.length === 0) {
      list.innerHTML = '<div class="timeline-empty">No history snapshots</div>';
      return;
    }

    this.revisions.forEach((rev, idx) => {
      const item = document.createElement('div');
      item.className = `timeline-item ${this.selectedRevision?.id === rev.id ? 'is-active' : ''}`;
      
      const date = new Date(rev.timestamp);
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });

      item.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-item-info">
          <div class="timeline-time">${dateStr} at ${timeStr}</div>
          <div class="timeline-summary">${rev.blocks?.length || 0} blocks</div>
        </div>
      `;

      item.addEventListener('click', () => {
        this.selectRevision(rev);
      });

      list.appendChild(item);
    });
  }

  selectRevision(rev) {
    this.selectedRevision = rev;
    this.renderTimeline();

    const previewPanel = this.modal.querySelector('.history-preview-content');
    const restoreBtn = this.modal.querySelector('.restore-rev-btn');
    const metaEl = this.modal.querySelector('.preview-meta');

    const date = new Date(rev.timestamp);
    metaEl.textContent = `Snapshot from ${date.toLocaleString()}`;
    restoreBtn.style.display = 'inline-flex';

    // Render snapshot preview
    let previewHtml = `<div class="rev-preview-doc">`;
    previewHtml += `<h1 class="rev-title">${rev.icon ? rev.icon + ' ' : ''}${rev.title || 'Untitled'}</h1>`;

    (rev.blocks || []).forEach(b => {
      if (b.type === 'h1') previewHtml += `<h1>${b.content || ''}</h1>`;
      else if (b.type === 'h2') previewHtml += `<h2>${b.content || ''}</h2>`;
      else if (b.type === 'h3') previewHtml += `<h3>${b.content || ''}</h3>`;
      else if (b.type === 'quote') previewHtml += `<blockquote>${b.content || ''}</blockquote>`;
      else if (b.type === 'code') previewHtml += `<pre><code>${b.content || ''}</code></pre>`;
      else if (b.type === 'checkList') previewHtml += `<div class="rev-check">${b.metadata?.checked ? '☑' : '☐'} ${b.content || ''}</div>`;
      else if (b.type === 'bulletList') previewHtml += `<li>${b.content || ''}</li>`;
      else previewHtml += `<p>${b.content || ''}</p>`;
    });

    previewHtml += `</div>`;
    previewPanel.innerHTML = previewHtml;

    restoreBtn.onclick = () => this.restoreCurrentSelection();
  }

  async restoreCurrentSelection() {
    if (!this.selectedRevision || !this.pageId) return;

    const confirm = window.confirm(`Restore document to snapshot from ${new Date(this.selectedRevision.timestamp).toLocaleString()}?`);
    if (!confirm) return;

    // Update page
    await State.updatePage(this.pageId, {
      title: this.selectedRevision.title,
      icon: this.selectedRevision.icon,
      cover: this.selectedRevision.cover
    });

    // Update blocks
    if (this.selectedRevision.blocks) {
      await NoteSpaceDB.saveBlocks(this.pageId, this.selectedRevision.blocks);
      State.blocks = this.selectedRevision.blocks;
    }

    // Update database
    if (this.selectedRevision.database) {
      await NoteSpaceDB.saveDatabase(this.selectedRevision.database);
      State.database = this.selectedRevision.database;
    }

    // Force re-activation and immediate UI refresh
    await State.setActivePage(this.pageId, false);

    this.close();
    window.App?.showToast('Revision restored successfully!');
  }
}

window.HistoryManager = new HistoryManager();
