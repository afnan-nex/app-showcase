/**
 * ReceiptVault - Document Inspection & Image Preview Component
 * Interactive pan/zoom/rotate receipt image canvas, warranty countdowns, and metadata editor.
 */

import { getIcon, escapeHTML } from '../core/icons.js';
import { getWarrantyInfo, getReturnInfo, WARRANTY_STATUS, RETURN_STATUS } from '../core/warranty.js';
import { generateReceiptCanvas } from '../engine/sample-data.js';

export class DocumentViewer {
  constructor(container, onSaveDoc, onDeleteDoc) {
    this.container = container;
    this.onSaveDoc = onSaveDoc;
    this.onDeleteDoc = onDeleteDoc;
    this.currentDoc = null;

    // Viewport transform state
    this.zoom = 1;
    this.rotation = 0; // 0, 90, 180, 270
    this.pan = { x: 0, y: 0 };
    this.isPanning = false;
    this.panStart = { x: 0, y: 0 };
    this.imageSource = null;
  }

  setDocument(doc) {
    this.currentDoc = doc ? JSON.parse(JSON.stringify(doc)) : null;
    this.resetTransform();
    this.render();
  }

  resetTransform() {
    this.zoom = 1;
    this.rotation = 0;
    this.pan = { x: 0, y: 0 };
  }

  render() {
    if (!this.currentDoc) {
      this.container.innerHTML = `
        <div class="empty-viewer-state flex flex-col items-center justify-center p-8 text-center text-muted h-full">
          <div class="mb-3 text-muted" style="opacity: 0.5;">
            ${getIcon('receipt', 'icon-lg')}
          </div>
          <span class="font-bold text-sm text-secondary">No Document Selected</span>
          <p class="text-xs text-muted mt-1 max-w-xs">Select a receipt from the library to inspect image details, warranty status, and purchase metadata.</p>
        </div>
      `;
      return;
    }

    const doc = this.currentDoc;
    const wInfo = getWarrantyInfo(doc.warrantyExpirationDate);
    const rInfo = getReturnInfo(doc.returnDeadlineDate);

    this.container.innerHTML = `
      <!-- Top Inspector Header -->
      <div class="viewer-header-bar flex items-center justify-between px-3 py-2 border-b">
        <div class="flex items-center gap-2 truncate">
          ${getIcon('receipt', 'icon-sm text-primary')}
          <span class="font-bold text-xs truncate">${escapeHTML(doc.title)}</span>
        </div>
        <div class="flex items-center gap-1">
          <button class="btn btn-xs btn-secondary" id="btn-viewer-save" title="Save Metadata Changes">
            ${getIcon('check', 'icon-xs')} Save
          </button>
          <button class="btn btn-xs text-rose btn-secondary" id="btn-viewer-delete" title="Delete Document">
            ${getIcon('trash', 'icon-xs')}
          </button>
        </div>
      </div>

      <!-- Scrollable Inspector Content (Top: Canvas Preview, Bottom: Metadata Form) -->
      <div class="viewer-body-scroll flex-1 overflow-y-auto flex flex-col">
        
        <!-- Image Canvas Viewport & Controls -->
        <div class="receipt-canvas-viewport-wrap relative">
          <!-- Canvas -->
          <canvas id="receipt-preview-canvas" class="receipt-preview-canvas"></canvas>

          <!-- Floating Image Controls Overlay -->
          <div class="viewer-floating-controls absolute flex items-center gap-1 p-1 rounded">
            <button class="btn-icon-xs" id="btn-zoom-out" title="Zoom Out">${getIcon('zoomOut', 'icon-xs')}</button>
            <span class="font-mono text-xs text-muted w-10 text-center" id="viewer-zoom-label">${Math.round(this.zoom * 100)}%</span>
            <button class="btn-icon-xs" id="btn-zoom-in" title="Zoom In">${getIcon('zoomIn', 'icon-xs')}</button>
            <button class="btn-icon-xs" id="btn-rotate" title="Rotate 90°">${getIcon('rotate', 'icon-xs')}</button>
            <button class="btn-icon-xs" id="btn-fit-reset" title="Fit to Viewport">${getIcon('eye', 'icon-xs')}</button>
          </div>
        </div>

        <!-- Status Badges Bar -->
        <div class="p-3 border-b flex flex-wrap gap-2 items-center bg-elevated">
          <!-- Warranty Badge -->
          ${doc.warrantyExpirationDate ? `
            <div class="badge ${wInfo.status === WARRANTY_STATUS.ACTIVE ? 'badge-success' : (wInfo.status === WARRANTY_STATUS.EXPIRING_SOON ? 'badge-warning' : 'badge-secondary')} flex items-center gap-1">
              ${getIcon('shield', 'icon-xs')}
              <span>Warranty: ${escapeHTML(wInfo.label)}</span>
            </div>
          ` : `
            <div class="badge badge-secondary text-muted">No Warranty</div>
          `}

          <!-- Return Deadline Badge -->
          ${doc.returnDeadlineDate ? `
            <div class="badge ${rInfo.status === RETURN_STATUS.OPEN ? 'badge-primary' : (rInfo.status === RETURN_STATUS.CLOSING_SOON ? 'badge-warning' : 'badge-secondary')} flex items-center gap-1">
              ${getIcon('clock', 'icon-xs')}
              <span>Return: ${escapeHTML(rInfo.label)}</span>
            </div>
          ` : ''}
        </div>

        <!-- Editable Metadata Form -->
        <div class="p-3 flex flex-col gap-3">
          <!-- Title & Vendor -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Document Title</label>
            <input type="text" id="edit-doc-title" class="form-control form-control-sm font-semibold" value="${escapeHTML(doc.title)}" />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Vendor / Merchant</label>
              <input type="text" id="edit-doc-vendor" class="form-control form-control-sm" value="${escapeHTML(doc.vendor)}" />
            </div>
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Amount (${doc.currency || '$'})</label>
              <input type="number" step="0.01" id="edit-doc-amount" class="form-control form-control-sm font-mono font-bold" value="${doc.amount}" />
            </div>
          </div>

          <!-- Purchase Date & Category -->
          <div class="grid grid-cols-2 gap-2">
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Purchase Date</label>
              <input type="date" id="edit-doc-date" class="form-control form-control-sm font-mono" value="${doc.purchaseDate || ''}" />
            </div>
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Category</label>
              <select id="edit-doc-category" class="form-control form-control-sm">
                ${['Electronics', 'Home', 'Clothing', 'Groceries', 'Software', 'Subscriptions', 'Travel', 'Other'].map(c => `
                  <option value="${c}" ${doc.category === c ? 'selected' : ''}>${c}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Payment Method</label>
            <select id="edit-doc-payment" class="form-control form-control-sm">
              ${['Credit Card', 'Debit Card', 'Cash', 'PayPal', 'Bank Transfer', 'Other'].map(p => `
                <option value="${p}" ${doc.paymentMethod === p ? 'selected' : ''}>${p}</option>
              `).join('')}
            </select>
          </div>

          <!-- Warranty Expiration & Return Deadline -->
          <div class="grid grid-cols-2 gap-2">
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Warranty Expiry Date</label>
              <input type="date" id="edit-doc-warranty" class="form-control form-control-sm font-mono" value="${doc.warrantyExpirationDate || ''}" />
            </div>
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Return Deadline</label>
              <input type="date" id="edit-doc-return" class="form-control form-control-sm font-mono" value="${doc.returnDeadlineDate || ''}" />
            </div>
          </div>

          <!-- Notes -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Notes / Warranty Details</label>
            <textarea id="edit-doc-notes" class="form-control form-control-sm" rows="3" placeholder="Add serial numbers, warranty terms, or order IDs...">${escapeHTML(doc.notes || '')}</textarea>
          </div>

          <!-- Tags -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Tags (Comma-separated)</label>
            <input type="text" id="edit-doc-tags" class="form-control form-control-sm font-mono" value="${escapeHTML((doc.tags || []).join(', '))}" placeholder="e.g. work, hardware, applecare" />
          </div>
        </div>

      </div>
    `;

    this.initCanvasAndEvents();
  }

  initCanvasAndEvents() {
    const canvas = this.container.querySelector('#receipt-preview-canvas');
    if (!canvas) return;

    // Render receipt into canvas
    this.drawCanvas(canvas);

    // Canvas panning & zooming
    canvas.addEventListener('mousedown', (e) => {
      this.isPanning = true;
      this.panStart = { x: e.clientX - this.pan.x, y: e.clientY - this.pan.y };
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isPanning) {
        this.pan.x = e.clientX - this.panStart.x;
        this.pan.y = e.clientY - this.panStart.y;
        this.drawCanvas(canvas);
      }
    });

    window.addEventListener('mouseup', () => {
      this.isPanning = false;
    });

    // Zoom Buttons
    this.container.querySelector('#btn-zoom-in')?.addEventListener('click', () => {
      this.zoom = Math.min(3, this.zoom * 1.25);
      this.updateZoomLabel();
      this.drawCanvas(canvas);
    });

    this.container.querySelector('#btn-zoom-out')?.addEventListener('click', () => {
      this.zoom = Math.max(0.4, this.zoom * 0.8);
      this.updateZoomLabel();
      this.drawCanvas(canvas);
    });

    this.container.querySelector('#btn-rotate')?.addEventListener('click', () => {
      this.rotation = (this.rotation + 90) % 360;
      this.drawCanvas(canvas);
    });

    this.container.querySelector('#btn-fit-reset')?.addEventListener('click', () => {
      this.resetTransform();
      this.updateZoomLabel();
      this.drawCanvas(canvas);
    });

    // Save & Delete buttons
    this.container.querySelector('#btn-viewer-save')?.addEventListener('click', () => {
      this.collectAndSave();
    });

    this.container.querySelector('#btn-viewer-delete')?.addEventListener('click', () => {
      if (confirm(`Delete receipt "${this.currentDoc.title}"?`)) {
        if (this.onDeleteDoc) this.onDeleteDoc(this.currentDoc.id);
      }
    });
  }

  drawCanvas(canvas) {
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth || 320;
    canvas.height = 240;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2 + this.pan.x, canvas.height / 2 + this.pan.y);
    ctx.scale(this.zoom, this.zoom);
    ctx.rotate((this.rotation * Math.PI) / 180);

    // Render simulated or user-provided receipt image
    const receiptImgCanvas = generateReceiptCanvas(this.currentDoc, 280, 380);
    ctx.drawImage(receiptImgCanvas, -140, -190, 280, 380);

    ctx.restore();
  }

  updateZoomLabel() {
    const zLabel = this.container.querySelector('#viewer-zoom-label');
    if (zLabel) zLabel.textContent = `${Math.round(this.zoom * 100)}%`;
  }

  collectAndSave() {
    if (!this.currentDoc) return;

    this.currentDoc.title = this.container.querySelector('#edit-doc-title').value.trim() || 'Untitled Document';
    this.currentDoc.vendor = this.container.querySelector('#edit-doc-vendor').value.trim() || 'Unknown Vendor';
    this.currentDoc.amount = parseFloat(this.container.querySelector('#edit-doc-amount').value) || 0;
    this.currentDoc.purchaseDate = this.container.querySelector('#edit-doc-date').value || '';
    this.currentDoc.category = this.container.querySelector('#edit-doc-category').value;
    this.currentDoc.paymentMethod = this.container.querySelector('#edit-doc-payment').value;
    this.currentDoc.warrantyExpirationDate = this.container.querySelector('#edit-doc-warranty').value || null;
    this.currentDoc.returnDeadlineDate = this.container.querySelector('#edit-doc-return').value || null;
    this.currentDoc.notes = this.container.querySelector('#edit-doc-notes').value.trim();

    const tagsRaw = this.container.querySelector('#edit-doc-tags').value;
    this.currentDoc.tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

    if (this.onSaveDoc) {
      this.onSaveDoc(this.currentDoc);
    }
  }
}
