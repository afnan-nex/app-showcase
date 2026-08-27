/**
 * ReceiptVault - Document Inspection & Interactive Image Studio Component
 * Pan/zoom/rotate receipt canvas, high-contrast filters, warranty countdowns, serial copy actions, and full metadata editor.
 */

import { getIcon, escapeHTML } from '../core/icons.js';
import { getWarrantyInfo, getReturnInfo, WARRANTY_STATUS, RETURN_STATUS } from '../core/warranty.js';
import { generateReceiptCanvas } from '../engine/sample-data.js';

export class DocumentViewer {
  constructor(container, onSaveDoc, onDeleteDoc, onClose = null) {
    this.container = container;
    this.onSaveDoc = onSaveDoc;
    this.onDeleteDoc = onDeleteDoc;
    this.onClose = onClose;
    this.currentDoc = null;

    // Viewport transform state
    this.zoom = 1;
    this.rotation = 0; // 0, 90, 180, 270
    this.pan = { x: 0, y: 0 };
    this.isPanning = false;
    this.panStart = { x: 0, y: 0 };
    this.filterMode = 'normal'; // 'normal', 'invert', 'contrast'
    this.activeTab = 'details'; // 'details', 'warranty', 'items'
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
    this.filterMode = 'normal';
  }

  render() {
    if (!this.currentDoc) {
      this.container.innerHTML = `
        <div class="empty-viewer-state flex flex-col items-center justify-center p-8 text-center text-muted h-full">
          <div class="mb-3 text-muted" style="opacity: 0.4;">
            ${getIcon('receipt', 'icon-lg')}
          </div>
          <span class="font-bold text-sm text-secondary">No Document Selected</span>
          <p class="text-xs text-muted mt-1 max-w-xs">Select a receipt from the library to inspect image details, warranty coverage, and purchase metadata.</p>
        </div>
      `;
      return;
    }

    const doc = this.currentDoc;
    const wInfo = getWarrantyInfo(doc.warrantyExpirationDate, new Date(), doc.purchaseDate);
    const rInfo = getReturnInfo(doc.returnDeadlineDate);

    this.container.innerHTML = `
      <!-- Top Inspector Header -->
      <div class="viewer-header-bar flex items-center justify-between px-3 py-2 border-b bg-panel">
        <div class="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
          ${getIcon('receipt', 'icon-sm text-primary flex-shrink-0')}
          <span class="font-bold text-xs truncate text-primary" title="${escapeHTML(doc.title)}">${escapeHTML(doc.title)}</span>
        </div>
        <div class="flex items-center gap-1 flex-shrink-0">
          <button class="btn btn-xs btn-primary" id="btn-viewer-save" title="Save Metadata Changes (Ctrl+S)">
            ${getIcon('check', 'icon-xs')} Save
          </button>
          <button class="btn btn-xs btn-secondary" id="btn-viewer-print" title="Print Document Voucher">
            ${getIcon('printer', 'icon-xs')}
          </button>
          <button class="btn btn-xs text-rose btn-secondary" id="btn-viewer-delete" title="Delete Document">
            ${getIcon('trash', 'icon-xs')}
          </button>
          ${this.onClose ? `
            <button class="btn btn-xs btn-secondary" id="btn-viewer-close" title="Close Inspector">
              ${getIcon('close', 'icon-xs')}
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Scrollable Inspector Content -->
      <div class="viewer-body-scroll flex-1 overflow-y-auto flex flex-col">
        
        <!-- Image Canvas Viewport & Floating Controls -->
        <div class="receipt-canvas-viewport-wrap relative">
          <canvas id="receipt-preview-canvas" class="receipt-preview-canvas"></canvas>

          <!-- Floating Image Controls Overlay -->
          <div class="viewer-floating-controls absolute flex items-center gap-1 p-1 rounded">
            <button class="btn-icon-xs" id="btn-zoom-out" title="Zoom Out" aria-label="Zoom Out">${getIcon('zoomOut', 'icon-xs')}</button>
            <span class="font-mono text-xs text-muted w-10 text-center select-none" id="viewer-zoom-label">${Math.round(this.zoom * 100)}%</span>
            <button class="btn-icon-xs" id="btn-zoom-in" title="Zoom In" aria-label="Zoom In">${getIcon('zoomIn', 'icon-xs')}</button>
            <button class="btn-icon-xs" id="btn-rotate" title="Rotate 90°" aria-label="Rotate 90°">${getIcon('rotate', 'icon-xs')}</button>
            <button class="btn-icon-xs" id="btn-filter-toggle" title="Toggle Contrast Filter (Normal / Invert / Contrast)" aria-label="Contrast Filter">${getIcon('contrast', 'icon-xs')}</button>
            <button class="btn-icon-xs" id="btn-download-img" title="Download Receipt Image" aria-label="Download Image">${getIcon('download', 'icon-xs')}</button>
            <button class="btn-icon-xs" id="btn-fit-reset" title="Fit to Viewport" aria-label="Fit Viewport">${getIcon('eye', 'icon-xs')}</button>
          </div>
        </div>

        <!-- Quick Summary Bar: Warranty & Return Statuses -->
        <div class="p-3 border-b flex flex-col gap-2 bg-elevated">
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <!-- Warranty Badge -->
            <div class="flex items-center gap-1">
              ${doc.warrantyExpirationDate ? `
                <span class="badge ${wInfo.status === WARRANTY_STATUS.ACTIVE ? 'badge-success' : (wInfo.status === WARRANTY_STATUS.EXPIRING_SOON ? 'badge-warning' : 'badge-secondary')} flex items-center gap-1">
                  ${getIcon(wInfo.status === WARRANTY_STATUS.EXPIRING_SOON ? 'shieldAlert' : 'shieldCheck', 'icon-xs')}
                  <span>${escapeHTML(wInfo.label)}</span>
                </span>
              ` : `
                <span class="badge badge-secondary text-muted">No Warranty</span>
              `}

              <!-- Return Badge -->
              ${doc.returnDeadlineDate ? `
                <span class="badge ${rInfo.status === RETURN_STATUS.OPEN ? 'badge-primary' : (rInfo.status === RETURN_STATUS.CLOSING_SOON ? 'badge-warning' : 'badge-secondary')} flex items-center gap-1">
                  ${getIcon('clock', 'icon-xs')}
                  <span>${escapeHTML(rInfo.label)}</span>
                </span>
              ` : ''}
            </div>

            <!-- Total Amount -->
            <span class="font-mono font-bold text-sm text-primary">${doc.currency || '$'}${Number(doc.amount || 0).toFixed(2)}</span>
          </div>

          <!-- Warranty Progress Bar (if active warranty) -->
          ${doc.warrantyExpirationDate && wInfo.status !== WARRANTY_STATUS.NONE ? `
            <div class="w-full flex flex-col gap-1 mt-1">
              <div class="flex items-center justify-between text-xs text-muted font-mono" style="font-size: 10px;">
                <span>Warranty Timeline</span>
                <span>${wInfo.progressPercent}% elapsed</span>
              </div>
              <div class="w-full bg-input rounded h-1 overflow-hidden" style="height: 4px; background: rgba(255,255,255,0.08);">
                <div class="h-full rounded" style="width: ${wInfo.progressPercent}%; background-color: ${wInfo.status === WARRANTY_STATUS.ACTIVE ? 'var(--accent-emerald)' : (wInfo.status === WARRANTY_STATUS.EXPIRING_SOON ? 'var(--accent-amber)' : 'var(--text-muted)')};"></div>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Quick Copy Actions (Serial Number, Invoice ID, Support Portal) -->
        ${(doc.serialNumber || doc.invoiceNumber || doc.supportUrl) ? `
          <div class="px-3 py-2 border-b bg-panel flex flex-wrap gap-2 items-center text-xs">
            ${doc.serialNumber ? `
              <button class="btn btn-xs btn-secondary flex items-center gap-1" id="btn-copy-serial" data-val="${escapeHTML(doc.serialNumber)}" title="Copy Serial Number">
                ${getIcon('copy', 'icon-xs')}
                <span>SN: <strong class="font-mono text-primary">${escapeHTML(doc.serialNumber)}</strong></span>
              </button>
            ` : ''}
            ${doc.invoiceNumber ? `
              <button class="btn btn-xs btn-secondary flex items-center gap-1" id="btn-copy-invoice" data-val="${escapeHTML(doc.invoiceNumber)}" title="Copy Invoice Number">
                ${getIcon('copy', 'icon-xs')}
                <span>Inv: <strong class="font-mono text-primary">${escapeHTML(doc.invoiceNumber)}</strong></span>
              </button>
            ` : ''}
            ${doc.supportUrl ? `
              <a href="${escapeHTML(doc.supportUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-xs btn-secondary flex items-center gap-1 text-primary" title="Open Manufacturer Support Portal">
                ${getIcon('externalLink', 'icon-xs')}
                <span>Support Portal</span>
              </a>
            ` : ''}
          </div>
        ` : ''}

        <!-- Editable Metadata Form -->
        <div class="p-3 flex flex-col gap-3">
          
          <!-- Document Title -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted" for="edit-doc-title">Document Title / Description</label>
            <input type="text" id="edit-doc-title" class="form-control form-control-sm font-semibold" value="${escapeHTML(doc.title)}" />
          </div>

          <!-- Merchant & Amount -->
          <div class="grid grid-cols-2 gap-2">
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted" for="edit-doc-vendor">Merchant / Vendor</label>
              <input type="text" id="edit-doc-vendor" class="form-control form-control-sm" value="${escapeHTML(doc.vendor)}" />
            </div>
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted" for="edit-doc-amount">Total Amount (${doc.currency || '$'})</label>
              <input type="number" step="0.01" id="edit-doc-amount" class="form-control form-control-sm font-mono font-bold" value="${doc.amount}" />
            </div>
          </div>

          <!-- Invoice # & Serial Number -->
          <div class="grid grid-cols-2 gap-2">
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted" for="edit-doc-invoice">Invoice / Order #</label>
              <input type="text" id="edit-doc-invoice" class="form-control form-control-sm font-mono" value="${escapeHTML(doc.invoiceNumber || '')}" placeholder="e.g. INV-99201" />
            </div>
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted" for="edit-doc-serial">Serial / License #</label>
              <input type="text" id="edit-doc-serial" class="form-control form-control-sm font-mono" value="${escapeHTML(doc.serialNumber || '')}" placeholder="e.g. SN-8829103" />
            </div>
          </div>

          <!-- Purchase Date & Category -->
          <div class="grid grid-cols-2 gap-2">
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted" for="edit-doc-date">Purchase Date</label>
              <input type="date" id="edit-doc-date" class="form-control form-control-sm font-mono" value="${doc.purchaseDate || ''}" />
            </div>
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted" for="edit-doc-category">Category</label>
              <select id="edit-doc-category" class="form-control form-control-sm font-semibold">
                ${['Electronics', 'Home', 'Clothing', 'Groceries', 'Software', 'Subscriptions', 'Travel', 'Other'].map(c => `
                  <option value="${c}" ${doc.category === c ? 'selected' : ''}>${c}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- Payment Method & Sales Tax -->
          <div class="grid grid-cols-2 gap-2">
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted" for="edit-doc-payment">Payment Method</label>
              <select id="edit-doc-payment" class="form-control form-control-sm">
                ${['Credit Card', 'Debit Card', 'Apple Pay', 'PayPal', 'Bank Transfer', 'Cash', 'Other'].map(p => `
                  <option value="${p}" ${doc.paymentMethod && doc.paymentMethod.includes(p) ? 'selected' : (doc.paymentMethod === p ? 'selected' : '')}>${p}</option>
                `).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted" for="edit-doc-tax">Tax Amount (${doc.currency || '$'})</label>
              <input type="number" step="0.01" id="edit-doc-tax" class="form-control form-control-sm font-mono" value="${doc.taxAmount || 0}" placeholder="0.00" />
            </div>
          </div>

          <!-- Warranty Expiry & Quick Date Chips -->
          <div class="form-group">
            <div class="flex items-center justify-between">
              <label class="form-label text-xs font-semibold text-muted" for="edit-doc-warranty">Warranty Expiration Date</label>
              <div class="flex items-center gap-1">
                <button type="button" class="btn-xs btn-secondary btn-quick-warranty" data-months="12" title="Set to 1 Year from Purchase">+1 Yr</button>
                <button type="button" class="btn-xs btn-secondary btn-quick-warranty" data-months="24" title="Set to 2 Years from Purchase">+2 Yr</button>
                <button type="button" class="btn-xs btn-secondary btn-quick-warranty" data-months="36" title="Set to 3 Years from Purchase">+3 Yr</button>
              </div>
            </div>
            <input type="date" id="edit-doc-warranty" class="form-control form-control-sm font-mono" value="${doc.warrantyExpirationDate || ''}" />
          </div>

          <!-- Return Deadline & Quick Chips -->
          <div class="form-group">
            <div class="flex items-center justify-between">
              <label class="form-label text-xs font-semibold text-muted" for="edit-doc-return">Return Deadline Date</label>
              <div class="flex items-center gap-1">
                <button type="button" class="btn-xs btn-secondary btn-quick-return" data-days="14" title="+14 Days">+14d</button>
                <button type="button" class="btn-xs btn-secondary btn-quick-return" data-days="30" title="+30 Days">+30d</button>
                <button type="button" class="btn-xs btn-secondary btn-quick-return" data-days="60" title="+60 Days">+60d</button>
              </div>
            </div>
            <input type="date" id="edit-doc-return" class="form-control form-control-sm font-mono" value="${doc.returnDeadlineDate || ''}" />
          </div>

          <!-- Warranty Terms & Support Details -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted" for="edit-doc-warranty-type">Warranty Coverage Terms / Policy</label>
            <input type="text" id="edit-doc-warranty-type" class="form-control form-control-sm" value="${escapeHTML(doc.warrantyType || '')}" placeholder="e.g. 3-Year AppleCare+ or 12-Year Commercial" />
          </div>

          <!-- Notes & Metadata -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted" for="edit-doc-notes">Notes & Filing Metadata</label>
            <textarea id="edit-doc-notes" class="form-control form-control-sm font-sans" rows="3" placeholder="Order ID, support case numbers, warranty terms, or location...">${escapeHTML(doc.notes || '')}</textarea>
          </div>

          <!-- Tags -->
          <div class="form-group mb-2">
            <label class="form-label text-xs font-semibold text-muted" for="edit-doc-tags">Tags (Comma-separated)</label>
            <input type="text" id="edit-doc-tags" class="form-control form-control-sm font-mono" value="${escapeHTML((doc.tags || []).join(', '))}" placeholder="e.g. work, hardware, tax-deductible" />
          </div>

        </div>

      </div>
    `;

    this.initCanvasAndEvents();
  }

  initCanvasAndEvents() {
    const canvas = this.container.querySelector('#receipt-preview-canvas');
    if (!canvas) return;

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
      this.zoom = Math.min(3.5, this.zoom * 1.25);
      this.updateZoomLabel();
      this.drawCanvas(canvas);
    });

    this.container.querySelector('#btn-zoom-out')?.addEventListener('click', () => {
      this.zoom = Math.max(0.35, this.zoom * 0.8);
      this.updateZoomLabel();
      this.drawCanvas(canvas);
    });

    this.container.querySelector('#btn-rotate')?.addEventListener('click', () => {
      this.rotation = (this.rotation + 90) % 360;
      this.drawCanvas(canvas);
    });

    this.container.querySelector('#btn-filter-toggle')?.addEventListener('click', () => {
      if (this.filterMode === 'normal') this.filterMode = 'contrast';
      else if (this.filterMode === 'contrast') this.filterMode = 'invert';
      else this.filterMode = 'normal';
      this.drawCanvas(canvas);
    });

    this.container.querySelector('#btn-fit-reset')?.addEventListener('click', () => {
      this.resetTransform();
      this.updateZoomLabel();
      this.drawCanvas(canvas);
    });

    this.container.querySelector('#btn-download-img')?.addEventListener('click', () => {
      this.downloadCanvasImage();
    });

    this.container.querySelector('#btn-viewer-print')?.addEventListener('click', () => {
      this.printDocumentVoucher();
    });

    // Copy buttons
    this.container.querySelectorAll('#btn-copy-serial, #btn-copy-invoice').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.val;
        if (val && navigator.clipboard) {
          navigator.clipboard.writeText(val);
          const originalHTML = btn.innerHTML;
          btn.innerHTML = `${getIcon('check', 'icon-xs text-emerald')} <span class="text-emerald font-bold">Copied!</span>`;
          setTimeout(() => { btn.innerHTML = originalHTML; }, 2000);
        }
      });
    });

    // Quick Date Calculator Chips
    this.container.querySelectorAll('.btn-quick-warranty').forEach(btn => {
      btn.addEventListener('click', () => {
        const months = parseInt(btn.dataset.months, 10);
        const purchaseInput = this.container.querySelector('#edit-doc-date');
        const baseDate = purchaseInput?.value ? new Date(purchaseInput.value) : new Date();
        if (!isNaN(baseDate.getTime())) {
          baseDate.setMonth(baseDate.getMonth() + months);
          const targetInp = this.container.querySelector('#edit-doc-warranty');
          if (targetInp) targetInp.value = baseDate.toISOString().split('T')[0];
        }
      });
    });

    this.container.querySelectorAll('.btn-quick-return').forEach(btn => {
      btn.addEventListener('click', () => {
        const days = parseInt(btn.dataset.days, 10);
        const purchaseInput = this.container.querySelector('#edit-doc-date');
        const baseDate = purchaseInput?.value ? new Date(purchaseInput.value) : new Date();
        if (!isNaN(baseDate.getTime())) {
          baseDate.setDate(baseDate.getDate() + days);
          const targetInp = this.container.querySelector('#edit-doc-return');
          if (targetInp) targetInp.value = baseDate.toISOString().split('T')[0];
        }
      });
    });

    // Save & Delete & Close buttons
    this.container.querySelector('#btn-viewer-save')?.addEventListener('click', () => {
      this.collectAndSave();
    });

    this.container.querySelector('#btn-viewer-delete')?.addEventListener('click', () => {
      if (confirm(`Are you sure you want to permanently delete "${this.currentDoc.title}"?`)) {
        if (this.onDeleteDoc) this.onDeleteDoc(this.currentDoc.id);
      }
    });

    this.container.querySelector('#btn-viewer-close')?.addEventListener('click', () => {
      if (this.onClose) this.onClose();
    });
  }

  drawCanvas(canvas) {
    const parent = canvas.parentElement;
    const w = parent.clientWidth || 340;
    const h = 240;
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);

    ctx.save();
    ctx.translate(w / 2 + this.pan.x, h / 2 + this.pan.y);
    ctx.scale(this.zoom, this.zoom);
    ctx.rotate((this.rotation * Math.PI) / 180);

    const docCanvas = generateReceiptCanvas(this.currentDoc, 280, 390, { filterMode: this.filterMode });
    ctx.drawImage(docCanvas, -140, -195, 280, 390);

    ctx.restore();
  }

  updateZoomLabel() {
    const zLabel = this.container.querySelector('#viewer-zoom-label');
    if (zLabel) zLabel.textContent = `${Math.round(this.zoom * 100)}%`;
  }

  downloadCanvasImage() {
    if (!this.currentDoc) return;
    const highResCanvas = generateReceiptCanvas(this.currentDoc, 480, 680, { filterMode: this.filterMode });
    const url = highResCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.currentDoc.vendor.replace(/\s+/g, '_')}_Receipt_${this.currentDoc.purchaseDate || 'document'}.png`;
    a.click();
  }

  printDocumentVoucher() {
    if (!this.currentDoc) return;
    window.print();
  }

  collectAndSave() {
    if (!this.currentDoc) return;

    this.currentDoc.title = this.container.querySelector('#edit-doc-title').value.trim() || 'Untitled Document';
    this.currentDoc.vendor = this.container.querySelector('#edit-doc-vendor').value.trim() || 'Unknown Vendor';
    this.currentDoc.amount = parseFloat(this.container.querySelector('#edit-doc-amount').value) || 0;
    this.currentDoc.taxAmount = parseFloat(this.container.querySelector('#edit-doc-tax').value) || 0;
    this.currentDoc.invoiceNumber = this.container.querySelector('#edit-doc-invoice').value.trim();
    this.currentDoc.serialNumber = this.container.querySelector('#edit-doc-serial').value.trim();
    this.currentDoc.purchaseDate = this.container.querySelector('#edit-doc-date').value || '';
    this.currentDoc.category = this.container.querySelector('#edit-doc-category').value;
    this.currentDoc.paymentMethod = this.container.querySelector('#edit-doc-payment').value;
    this.currentDoc.warrantyType = this.container.querySelector('#edit-doc-warranty-type').value.trim();
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
