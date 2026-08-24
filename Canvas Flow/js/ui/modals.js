/* ==========================================================================
   CANVASFLOW — Modal Dialogs Manager
   Keyboard Shortcuts, Board Manager, PNG Export Preview & Confirm Dialog
   ========================================================================== */

import { appState } from '../state/state.js';
import { storage } from '../state/storage.js';
import { eventBus } from '../state/event-bus.js';
import { generateId } from '../state/document-model.js';

export class ModalManager {
  constructor(app) {
    this.app = app;

    this.modalShortcuts = document.getElementById('modal-shortcuts');
    this.modalBoardManager = document.getElementById('modal-board-manager');
    this.modalExport = document.getElementById('modal-export');
    this.modalConfirm = document.getElementById('modal-confirm');

    // Export Options state
    this.exportOptions = {
      scale: 2,
      bg: 'canvas',
      scope: 'all'
    };

    this.confirmCallback = null;

    this._setupListeners();
  }

  _setupListeners() {
    // Close on backdrop or close button
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.dataset.modal;
        if (modalId) {
          document.getElementById(modalId)?.classList.add('hidden');
        } else {
          btn.closest('.modal-backdrop')?.classList.add('hidden');
        }
      });
    });

    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.add('hidden');
        }
      });
    });

    // Board Manager Actions
    document.getElementById('btn-bm-new-board')?.addEventListener('click', () => {
      this.app.createNewBoard();
      this.modalBoardManager.classList.add('hidden');
    });

    document.getElementById('btn-bm-import-board')?.addEventListener('click', () => {
      document.getElementById('json-file-input').click();
      this.modalBoardManager.classList.add('hidden');
    });

    // Export Segmented Controls
    document.getElementById('export-scale-group')?.addEventListener('click', (e) => {
      const seg = e.target.closest('.btn-segment');
      if (!seg) return;
      document.querySelectorAll('#export-scale-group .btn-segment').forEach(b => b.classList.remove('active'));
      seg.classList.add('active');
      this.exportOptions.scale = Number(seg.dataset.scale);
      this.updateExportPreview();
    });

    document.getElementById('export-bg-group')?.addEventListener('click', (e) => {
      const seg = e.target.closest('.btn-segment');
      if (!seg) return;
      document.querySelectorAll('#export-bg-group .btn-segment').forEach(b => b.classList.remove('active'));
      seg.classList.add('active');
      this.exportOptions.bg = seg.dataset.bg;
      this.updateExportPreview();
    });

    document.getElementById('export-scope-group')?.addEventListener('click', (e) => {
      const seg = e.target.closest('.btn-segment');
      if (!seg) return;
      document.querySelectorAll('#export-scope-group .btn-segment').forEach(b => b.classList.remove('active'));
      seg.classList.add('active');
      this.exportOptions.scope = seg.dataset.scope;
      this.updateExportPreview();
    });

    // Download PNG Button
    document.getElementById('btn-confirm-export-png')?.addEventListener('click', () => {
      this.downloadPNG();
    });

    // Confirm Dialog buttons
    document.getElementById('confirm-dialog-cancel')?.addEventListener('click', () => {
      this.modalConfirm.classList.add('hidden');
      this.confirmCallback = null;
    });

    document.getElementById('confirm-dialog-confirm')?.addEventListener('click', () => {
      this.modalConfirm.classList.add('hidden');
      if (this.confirmCallback) {
        this.confirmCallback();
        this.confirmCallback = null;
      }
    });
  }

  openBoardManager() {
    this.modalBoardManager.classList.remove('hidden');
    this.renderBoardList();
  }

  async renderBoardList() {
    const container = document.getElementById('bm-board-items');
    if (!container) return;

    const boards = await storage.listBoards();
    if (boards.length === 0) {
      container.innerHTML = `<div style="padding:20px; text-align:center; color:var(--text-muted);">No saved boards found</div>`;
      return;
    }

    container.innerHTML = boards.map(b => {
      const isCurrent = b.id === appState.board.id;
      const dateStr = new Date(b.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      return `
        <div class="bm-board-row ${isCurrent ? 'active' : ''}" data-id="${b.id}" style="display:flex; align-items:center; justify-content:space-between; padding:10px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); margin-bottom:6px; background:var(--bg-surface);">
          <div style="cursor:pointer; flex:1;" class="bm-switch-target">
            <div style="font-weight:600; font-size:var(--text-sm); color:var(--text-primary);">${b.title} ${isCurrent ? '<span style="font-size:10px; color:var(--accent-primary); margin-left:6px;">(Current)</span>' : ''}</div>
            <div style="font-size:var(--text-2xs); color:var(--text-muted);">${b.objectCount} objects • Last edited ${dateStr}</div>
          </div>
          <div style="display:flex; gap:6px;">
            <button class="btn-icon-xs bm-btn-dup" title="Duplicate Board" data-id="${b.id}">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            </button>
            <button class="btn-icon-xs bm-btn-del" title="Delete Board" data-id="${b.id}" style="color:var(--accent-danger);">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.bm-switch-target').forEach(el => {
      el.addEventListener('click', async () => {
        const id = el.closest('.bm-board-row').dataset.id;
        const board = await storage.loadBoard(id);
        if (board) {
          appState.loadBoardDocument(board, false);
          this.modalBoardManager.classList.add('hidden');
          eventBus.emit('toast:show', { message: `Loaded "${board.title}"`, type: 'info' });
        }
      });
    });

    container.querySelectorAll('.bm-btn-dup').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        await storage.duplicateBoard(id);
        this.renderBoardList();
        eventBus.emit('toast:show', { message: 'Board duplicated', type: 'info' });
      });
    });

    container.querySelectorAll('.bm-btn-del').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        this.openConfirmDialog('Delete Board', 'Are you sure you want to permanently delete this board?', async () => {
          await storage.deleteBoard(id);
          if (id === appState.board.id) {
            this.app.createNewBoard();
          } else {
            this.renderBoardList();
          }
          eventBus.emit('toast:show', { message: 'Board deleted', type: 'info' });
        });
      });
    });
  }

  openExportModal() {
    this.modalExport.classList.remove('hidden');
    this.updateExportPreview();
  }

  updateExportPreview() {
    const canvas = this.app.renderer.renderToExportCanvas(this.exportOptions);
    const imgEl = document.getElementById('export-preview-img');
    if (canvas && imgEl) {
      imgEl.src = canvas.toDataURL('image/png');
    }
  }

  downloadPNG() {
    const canvas = this.app.renderer.renderToExportCanvas(this.exportOptions);
    if (!canvas) {
      eventBus.emit('toast:show', { message: 'Nothing to export on canvas', type: 'error' });
      return;
    }

    const link = document.createElement('a');
    link.download = `${(appState.board.title || 'board').toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    this.modalExport.classList.add('hidden');
    eventBus.emit('toast:show', { message: 'Exported PNG image successfully', type: 'success' });
  }

  openConfirmDialog(title, message, onConfirm) {
    document.getElementById('confirm-dialog-title').textContent = title;
    document.getElementById('confirm-dialog-message').textContent = message;
    this.confirmCallback = onConfirm;
    this.modalConfirm.classList.remove('hidden');
  }
}
