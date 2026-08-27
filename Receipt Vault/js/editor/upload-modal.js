/**
 * ReceiptVault - Upload & Manual Document Entry Modal
 * Handles local receipt image selection, manual metadata entry, and duplicate conflict review.
 */

import { getIcon, escapeHTML } from '../core/icons.js';
import { findPotentialDuplicate } from '../engine/duplicate.js';

export class UploadModal {
  constructor(container, existingDocs = [], onSaveDocument) {
    this.container = container;
    this.existingDocs = existingDocs;
    this.onSaveDocument = onSaveDocument;

    this.docData = this.getEmptyDoc();
    this.duplicateWarning = null;
  }

  setExistingDocs(docs) {
    this.existingDocs = docs;
  }

  getEmptyDoc() {
    return {
      id: 'doc_' + Date.now(),
      title: '',
      vendor: '',
      amount: '',
      currency: '$',
      purchaseDate: new Date().toISOString().split('T')[0],
      category: 'Electronics',
      paymentMethod: 'Credit Card',
      warrantyExpirationDate: '',
      returnDeadlineDate: '',
      notes: '',
      tags: [],
      fileName: ''
    };
  }

  open() {
    this.docData = this.getEmptyDoc();
    this.duplicateWarning = null;
    this.render();
    this.container.classList.add('active');
  }

  close() {
    this.container.classList.remove('active');
  }

  render() {
    this.container.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-dialog upload-modal-dialog">
        <div class="modal-header flex items-center justify-between p-3 border-b">
          <div class="flex items-center gap-2">
            ${getIcon('upload', 'icon-sm text-primary')}
            <span class="font-bold text-sm">Add New Receipt / Document</span>
          </div>
          <button class="btn-icon-xs btn-modal-close">&times;</button>
        </div>

        <div class="modal-body p-4 flex flex-col gap-3 overflow-y-auto" style="max-height: 75vh;">
          
          <!-- File Drop Zone -->
          <div class="upload-dropzone p-4 border border-dashed rounded text-center cursor-pointer" id="dropzone-file">
            <input type="file" id="input-receipt-file" accept="image/*,.pdf" style="display: none;" />
            <div class="flex flex-col items-center gap-1 text-muted">
              ${getIcon('upload', 'icon-md text-primary')}
              <span class="font-bold text-xs text-primary">Click to select receipt image / PDF</span>
              <span class="text-xs text-muted">PNG, JPG, WebP supported &bull; Processed 100% locally</span>
              <span class="text-xs font-mono text-emerald mt-1" id="label-selected-file">${this.docData.fileName ? escapeHTML(this.docData.fileName) : ''}</span>
            </div>
          </div>

          <!-- Duplicate Conflict Warning Banner -->
          <div id="duplicate-warning-banner" class="card p-3 border-amber bg-amber-subtle text-amber font-sans text-xs ${this.duplicateWarning ? '' : 'hidden'}">
            <div class="flex items-center gap-2 font-bold mb-1">
              ${getIcon('alertTriangle', 'icon-xs')}
              <span>Potential Duplicate Record Detected</span>
            </div>
            <p id="duplicate-reason-text">${this.duplicateWarning ? escapeHTML(this.duplicateWarning.reason) : ''}</p>
          </div>

          <!-- Manual Metadata Extraction Form -->
          <div class="flex flex-col gap-3 mt-1">
            <!-- Title & Vendor -->
            <div class="form-group">
              <label class="form-label text-xs font-semibold">Document Title / Description *</label>
              <input type="text" id="up-doc-title" class="form-control form-control-sm font-semibold" placeholder="e.g. Sony Wireless Headphones" value="${escapeHTML(this.docData.title)}" />
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div class="form-group">
                <label class="form-label text-xs font-semibold">Merchant / Vendor *</label>
                <input type="text" id="up-doc-vendor" class="form-control form-control-sm" placeholder="e.g. Best Buy" value="${escapeHTML(this.docData.vendor)}" />
              </div>
              <div class="form-group">
                <label class="form-label text-xs font-semibold">Total Amount *</label>
                <input type="number" step="0.01" id="up-doc-amount" class="form-control form-control-sm font-mono font-bold" placeholder="0.00" value="${this.docData.amount}" />
              </div>
            </div>

            <!-- Date & Category -->
            <div class="grid grid-cols-2 gap-2">
              <div class="form-group">
                <label class="form-label text-xs font-semibold">Purchase Date *</label>
                <input type="date" id="up-doc-date" class="form-control form-control-sm font-mono" value="${this.docData.purchaseDate}" />
              </div>
              <div class="form-group">
                <label class="form-label text-xs font-semibold">Category</label>
                <select id="up-doc-category" class="form-control form-control-sm">
                  ${['Electronics', 'Home', 'Clothing', 'Groceries', 'Software', 'Subscriptions', 'Travel', 'Other'].map(c => `
                    <option value="${c}" ${this.docData.category === c ? 'selected' : ''}>${c}</option>
                  `).join('')}
                </select>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="form-group">
              <label class="form-label text-xs font-semibold">Payment Method</label>
              <select id="up-doc-payment" class="form-control form-control-sm">
                ${['Credit Card', 'Debit Card', 'Cash', 'PayPal', 'Bank Transfer', 'Other'].map(p => `
                  <option value="${p}" ${this.docData.paymentMethod === p ? 'selected' : ''}>${p}</option>
                `).join('')}
              </select>
            </div>

            <!-- Warranty & Return Deadline -->
            <div class="grid grid-cols-2 gap-2">
              <div class="form-group">
                <label class="form-label text-xs font-semibold">Warranty Expiration Date</label>
                <input type="date" id="up-doc-warranty" class="form-control form-control-sm font-mono" value="${this.docData.warrantyExpirationDate}" />
              </div>
              <div class="form-group">
                <label class="form-label text-xs font-semibold">Return Deadline Date</label>
                <input type="date" id="up-doc-return" class="form-control form-control-sm font-mono" value="${this.docData.returnDeadlineDate}" />
              </div>
            </div>

            <!-- Notes & Tags -->
            <div class="form-group">
              <label class="form-label text-xs font-semibold">Notes & Serial Numbers</label>
              <textarea id="up-doc-notes" class="form-control form-control-sm" rows="2" placeholder="Order ID, serial numbers, warranty terms...">${escapeHTML(this.docData.notes)}</textarea>
            </div>

            <div class="form-group">
              <label class="form-label text-xs font-semibold">Tags (Comma-separated)</label>
              <input type="text" id="up-doc-tags" class="form-control form-control-sm font-mono" placeholder="work, applecare, electronics" value="${escapeHTML(this.docData.tags.join(', '))}" />
            </div>
          </div>

        </div>

        <div class="modal-footer p-3 border-t flex justify-end gap-2">
          <button class="btn btn-sm btn-secondary btn-modal-close">Cancel</button>
          <button class="btn btn-sm btn-primary" id="btn-submit-document">Save to Vault</button>
        </div>
      </div>
    `;

    this.initEvents();
  }

  initEvents() {
    this.container.querySelectorAll('.btn-modal-close, .modal-backdrop').forEach(b => {
      b.addEventListener('click', () => this.close());
    });

    const dropzone = this.container.querySelector('#dropzone-file');
    const fileInput = this.container.querySelector('#input-receipt-file');

    dropzone?.addEventListener('click', () => fileInput?.click());

    fileInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.docData.fileName = file.name;
        this.container.querySelector('#label-selected-file').textContent = file.name;

        // Auto-suggest title if blank
        const titleInp = this.container.querySelector('#up-doc-title');
        if (titleInp && !titleInp.value) {
          titleInp.value = file.name.replace(/\.[^/.]+$/, '').replace(/[_|-]/g, ' ');
        }
      }
    });

    // Real-time Duplicate Check
    const checkDuplicate = () => {
      const vendor = this.container.querySelector('#up-doc-vendor').value.trim();
      const amount = parseFloat(this.container.querySelector('#up-doc-amount').value) || 0;
      const purchaseDate = this.container.querySelector('#up-doc-date').value;

      const dup = findPotentialDuplicate({ vendor, amount, purchaseDate }, this.existingDocs);
      const banner = this.container.querySelector('#duplicate-warning-banner');
      const reasonEl = this.container.querySelector('#duplicate-reason-text');

      if (dup) {
        this.duplicateWarning = dup;
        banner.classList.remove('hidden');
        reasonEl.textContent = dup.reason;
      } else {
        this.duplicateWarning = null;
        banner.classList.add('hidden');
      }
    };

    this.container.querySelector('#up-doc-vendor')?.addEventListener('input', checkDuplicate);
    this.container.querySelector('#up-doc-amount')?.addEventListener('input', checkDuplicate);
    this.container.querySelector('#up-doc-date')?.addEventListener('input', checkDuplicate);

    // Save Submit
    this.container.querySelector('#btn-submit-document')?.addEventListener('click', () => {
      const title = this.container.querySelector('#up-doc-title').value.trim();
      const vendor = this.container.querySelector('#up-doc-vendor').value.trim();
      const amount = parseFloat(this.container.querySelector('#up-doc-amount').value);
      const purchaseDate = this.container.querySelector('#up-doc-date').value;

      if (!title) return alert('Please enter a document title.');
      if (!vendor) return alert('Please enter a vendor/merchant name.');
      if (isNaN(amount) || amount <= 0) return alert('Please enter a valid total amount.');

      const newDoc = {
        id: this.docData.id || 'doc_' + Date.now(),
        title,
        vendor,
        amount,
        currency: '$',
        purchaseDate: purchaseDate || new Date().toISOString().split('T')[0],
        category: this.container.querySelector('#up-doc-category').value,
        paymentMethod: this.container.querySelector('#up-doc-payment').value,
        warrantyExpirationDate: this.container.querySelector('#up-doc-warranty').value || null,
        returnDeadlineDate: this.container.querySelector('#up-doc-return').value || null,
        notes: this.container.querySelector('#up-doc-notes').value.trim(),
        tags: this.container.querySelector('#up-doc-tags').value.split(',').map(t => t.trim()).filter(Boolean),
        fileName: this.docData.fileName || `${vendor.replace(/\s+/g, '_')}_Receipt.png`
      };

      if (this.onSaveDocument) {
        this.onSaveDocument(newDoc);
      }
      this.close();
    });
  }
}
