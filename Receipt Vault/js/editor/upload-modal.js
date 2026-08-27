/**
 * ReceiptVault - Upload & Document Entry Modal
 * Handles local receipt file selection, image data reading, manual metadata entry, quick date calculators, and duplicate conflict checks.
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
    this.customImageData = null;
  }

  setExistingDocs(docs) {
    this.existingDocs = docs;
  }

  getEmptyDoc() {
    return {
      id: 'doc_' + Date.now(),
      title: '',
      vendor: '',
      vendorAddress: '',
      invoiceNumber: '',
      serialNumber: '',
      amount: '',
      taxAmount: '',
      currency: '$',
      purchaseDate: new Date().toISOString().split('T')[0],
      category: 'Electronics',
      paymentMethod: 'Credit Card',
      warrantyType: '',
      warrantyExpirationDate: '',
      returnDeadlineDate: '',
      supportUrl: '',
      notes: '',
      tags: [],
      fileName: '',
      items: []
    };
  }

  open() {
    this.docData = this.getEmptyDoc();
    this.duplicateWarning = null;
    this.customImageData = null;
    this.render();
    this.container.classList.add('active');

    // Focus initial input
    setTimeout(() => {
      this.container.querySelector('#up-doc-title')?.focus();
    }, 100);
  }

  close() {
    this.container.classList.remove('active');
  }

  render() {
    this.container.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-dialog upload-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        
        <!-- Modal Header -->
        <div class="modal-header flex items-center justify-between p-3 border-b bg-panel">
          <div class="flex items-center gap-2">
            ${getIcon('upload', 'icon-sm text-primary')}
            <span class="font-bold text-sm text-primary" id="modal-title">Add New Receipt / Document</span>
          </div>
          <button class="btn-icon-xs btn-modal-close" aria-label="Close dialog">${getIcon('close', 'icon-xs')}</button>
        </div>

        <!-- Modal Body Scrollable -->
        <div class="modal-body p-4 flex flex-col gap-3 overflow-y-auto" style="max-height: 78vh;">
          
          <!-- File Drop Zone & Image Preview -->
          <div class="upload-dropzone p-4 border border-dashed rounded text-center cursor-pointer relative" id="dropzone-file">
            <input type="file" id="input-receipt-file" accept="image/*,.pdf" style="display: none;" />
            <div class="flex flex-col items-center gap-1 text-muted" id="dropzone-content">
              ${getIcon('upload', 'icon-md text-primary')}
              <span class="font-bold text-xs text-primary">Drag & drop receipt image / click to browse</span>
              <span class="text-xs text-muted">PNG, JPG, WebP &bull; 100% processed locally on your machine</span>
              <span class="text-xs font-mono text-emerald mt-1 font-bold" id="label-selected-file">${this.docData.fileName ? escapeHTML(this.docData.fileName) : ''}</span>
            </div>
            ${this.customImageData ? `
              <div class="mt-2 flex items-center justify-center">
                <img src="${this.customImageData}" alt="Receipt thumbnail" class="rounded border" style="max-height: 80px; object-fit: contain;" />
              </div>
            ` : ''}
          </div>

          <!-- Duplicate Conflict Warning Banner -->
          <div id="duplicate-warning-banner" class="card p-3 border-amber bg-amber-subtle text-amber font-sans text-xs ${this.duplicateWarning ? '' : 'hidden'}">
            <div class="flex items-center gap-2 font-bold mb-1">
              ${getIcon('alertTriangle', 'icon-xs')}
              <span>Potential Duplicate Record Detected</span>
            </div>
            <p id="duplicate-reason-text">${this.duplicateWarning ? escapeHTML(this.duplicateWarning.reason) : ''}</p>
          </div>

          <!-- Document Metadata Form -->
          <div class="flex flex-col gap-3">
            
            <!-- Document Title -->
            <div class="form-group">
              <label class="form-label text-xs font-semibold" for="up-doc-title">Document Title / Product Name *</label>
              <input type="text" id="up-doc-title" class="form-control form-control-sm font-semibold" placeholder="e.g. Sony WH-1000XM5 Wireless Headphones" value="${escapeHTML(this.docData.title)}" required />
            </div>

            <!-- Merchant & Total Amount -->
            <div class="grid grid-cols-2 gap-2">
              <div class="form-group">
                <label class="form-label text-xs font-semibold" for="up-doc-vendor">Merchant / Vendor *</label>
                <input type="text" id="up-doc-vendor" class="form-control form-control-sm" placeholder="e.g. Best Buy" value="${escapeHTML(this.docData.vendor)}" required />
              </div>
              <div class="form-group">
                <label class="form-label text-xs font-semibold" for="up-doc-amount">Total Amount ($) *</label>
                <input type="number" step="0.01" id="up-doc-amount" class="form-control form-control-sm font-mono font-bold" placeholder="0.00" value="${this.docData.amount}" required />
              </div>
            </div>

            <!-- Invoice # & Serial # -->
            <div class="grid grid-cols-2 gap-2">
              <div class="form-group">
                <label class="form-label text-xs font-semibold" for="up-doc-invoice">Invoice / Receipt #</label>
                <input type="text" id="up-doc-invoice" class="form-control form-control-sm font-mono" placeholder="e.g. INV-2024-9910" value="${escapeHTML(this.docData.invoiceNumber)}" />
              </div>
              <div class="form-group">
                <label class="form-label text-xs font-semibold" for="up-doc-serial">Serial / License #</label>
                <input type="text" id="up-doc-serial" class="form-control form-control-sm font-mono" placeholder="e.g. SN-8829103" value="${escapeHTML(this.docData.serialNumber)}" />
              </div>
            </div>

            <!-- Date & Category -->
            <div class="grid grid-cols-2 gap-2">
              <div class="form-group">
                <label class="form-label text-xs font-semibold" for="up-doc-date">Purchase Date *</label>
                <input type="date" id="up-doc-date" class="form-control form-control-sm font-mono" value="${this.docData.purchaseDate}" />
              </div>
              <div class="form-group">
                <label class="form-label text-xs font-semibold" for="up-doc-category">Category</label>
                <select id="up-doc-category" class="form-control form-control-sm font-semibold">
                  ${['Electronics', 'Home', 'Clothing', 'Groceries', 'Software', 'Subscriptions', 'Travel', 'Other'].map(c => `
                    <option value="${c}" ${this.docData.category === c ? 'selected' : ''}>${c}</option>
                  `).join('')}
                </select>
              </div>
            </div>

            <!-- Payment Method & Sales Tax -->
            <div class="grid grid-cols-2 gap-2">
              <div class="form-group">
                <label class="form-label text-xs font-semibold" for="up-doc-payment">Payment Method</label>
                <select id="up-doc-payment" class="form-control form-control-sm">
                  ${['Credit Card', 'Debit Card', 'Apple Pay', 'PayPal', 'Bank Transfer', 'Cash', 'Other'].map(p => `
                    <option value="${p}" ${this.docData.paymentMethod === p ? 'selected' : ''}>${p}</option>
                  `).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label text-xs font-semibold" for="up-doc-tax">Sales Tax / VAT ($)</label>
                <input type="number" step="0.01" id="up-doc-tax" class="form-control form-control-sm font-mono" placeholder="0.00" value="${this.docData.taxAmount}" />
              </div>
            </div>

            <!-- Warranty Expiry & Quick Date Chips -->
            <div class="form-group">
              <div class="flex items-center justify-between">
                <label class="form-label text-xs font-semibold" for="up-doc-warranty">Warranty Expiration Date</label>
                <div class="flex items-center gap-1">
                  <button type="button" class="btn-xs btn-secondary btn-modal-warranty" data-months="12" title="Set to 1 Year">+1 Yr</button>
                  <button type="button" class="btn-xs btn-secondary btn-modal-warranty" data-months="24" title="Set to 2 Years">+2 Yr</button>
                  <button type="button" class="btn-xs btn-secondary btn-modal-warranty" data-months="36" title="Set to 3 Years">+3 Yr</button>
                </div>
              </div>
              <input type="date" id="up-doc-warranty" class="form-control form-control-sm font-mono" value="${this.docData.warrantyExpirationDate}" />
            </div>

            <!-- Return Deadline & Quick Date Chips -->
            <div class="form-group">
              <div class="flex items-center justify-between">
                <label class="form-label text-xs font-semibold" for="up-doc-return">Return Deadline Date</label>
                <div class="flex items-center gap-1">
                  <button type="button" class="btn-xs btn-secondary btn-modal-return" data-days="14" title="+14 Days">+14d</button>
                  <button type="button" class="btn-xs btn-secondary btn-modal-return" data-days="30" title="+30 Days">+30d</button>
                  <button type="button" class="btn-xs btn-secondary btn-modal-return" data-days="60" title="+60 Days">+60d</button>
                </div>
              </div>
              <input type="date" id="up-doc-return" class="form-control form-control-sm font-mono" value="${this.docData.returnDeadlineDate}" />
            </div>

            <!-- Warranty Terms / Notes -->
            <div class="form-group">
              <label class="form-label text-xs font-semibold" for="up-doc-warranty-type">Warranty Policy / Terms</label>
              <input type="text" id="up-doc-warranty-type" class="form-control form-control-sm" placeholder="e.g. 2-Year Manufacturer Warranty or AppleCare+" value="${escapeHTML(this.docData.warrantyType)}" />
            </div>

            <!-- Notes -->
            <div class="form-group">
              <label class="form-label text-xs font-semibold" for="up-doc-notes">Notes & Support Details</label>
              <textarea id="up-doc-notes" class="form-control form-control-sm" rows="2" placeholder="Order ID, support link, serial numbers, or location...">${escapeHTML(this.docData.notes)}</textarea>
            </div>

            <!-- Tags -->
            <div class="form-group">
              <label class="form-label text-xs font-semibold" for="up-doc-tags">Tags (Comma-separated)</label>
              <input type="text" id="up-doc-tags" class="form-control form-control-sm font-mono" placeholder="work, applecare, tax-deductible" value="${escapeHTML(this.docData.tags.join(', '))}" />
            </div>

          </div>

        </div>

        <!-- Modal Footer -->
        <div class="modal-footer p-3 border-t bg-panel flex justify-end gap-2">
          <button class="btn btn-sm btn-secondary btn-modal-close" type="button">Cancel</button>
          <button class="btn btn-sm btn-primary" id="btn-submit-document" type="button">Save to Vault</button>
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

    // Drag and Drop handlers
    dropzone?.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('border-primary');
    });
    dropzone?.addEventListener('dragleave', () => {
      dropzone.classList.remove('border-primary');
    });
    dropzone?.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('border-primary');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        this.handleFileSelected(e.dataTransfer.files[0]);
      }
    });

    fileInput?.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        this.handleFileSelected(e.target.files[0]);
      }
    });

    // Quick Date Calculator Chips
    this.container.querySelectorAll('.btn-modal-warranty').forEach(btn => {
      btn.addEventListener('click', () => {
        const months = parseInt(btn.dataset.months, 10);
        const purchaseInput = this.container.querySelector('#up-doc-date');
        const baseDate = purchaseInput?.value ? new Date(purchaseInput.value) : new Date();
        if (!isNaN(baseDate.getTime())) {
          baseDate.setMonth(baseDate.getMonth() + months);
          const targetInp = this.container.querySelector('#up-doc-warranty');
          if (targetInp) targetInp.value = baseDate.toISOString().split('T')[0];
        }
      });
    });

    this.container.querySelectorAll('.btn-modal-return').forEach(btn => {
      btn.addEventListener('click', () => {
        const days = parseInt(btn.dataset.days, 10);
        const purchaseInput = this.container.querySelector('#up-doc-date');
        const baseDate = purchaseInput?.value ? new Date(purchaseInput.value) : new Date();
        if (!isNaN(baseDate.getTime())) {
          baseDate.setDate(baseDate.getDate() + days);
          const targetInp = this.container.querySelector('#up-doc-return');
          if (targetInp) targetInp.value = baseDate.toISOString().split('T')[0];
        }
      });
    });

    // Real-time Duplicate Check
    const checkDuplicate = () => {
      const vendor = this.container.querySelector('#up-doc-vendor')?.value.trim();
      const amount = parseFloat(this.container.querySelector('#up-doc-amount')?.value) || 0;
      const purchaseDate = this.container.querySelector('#up-doc-date')?.value;
      const invoiceNumber = this.container.querySelector('#up-doc-invoice')?.value.trim();

      const dup = findPotentialDuplicate({ vendor, amount, purchaseDate, invoiceNumber }, this.existingDocs);
      const banner = this.container.querySelector('#duplicate-warning-banner');
      const reasonEl = this.container.querySelector('#duplicate-reason-text');

      if (dup) {
        this.duplicateWarning = dup;
        banner?.classList.remove('hidden');
        if (reasonEl) reasonEl.textContent = dup.reason;
      } else {
        this.duplicateWarning = null;
        banner?.classList.add('hidden');
      }
    };

    this.container.querySelector('#up-doc-vendor')?.addEventListener('input', checkDuplicate);
    this.container.querySelector('#up-doc-amount')?.addEventListener('input', checkDuplicate);
    this.container.querySelector('#up-doc-date')?.addEventListener('input', checkDuplicate);
    this.container.querySelector('#up-doc-invoice')?.addEventListener('input', checkDuplicate);

    // Save Submit
    this.container.querySelector('#btn-submit-document')?.addEventListener('click', () => {
      this.submitDocument();
    });

    // Enter key submit in input fields
    this.container.querySelectorAll('input').forEach(inp => {
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.submitDocument();
        }
      });
    });
  }

  handleFileSelected(file) {
    this.docData.fileName = file.name;
    const label = this.container.querySelector('#label-selected-file');
    if (label) label.textContent = file.name;

    // Auto-fill title if empty
    const titleInp = this.container.querySelector('#up-doc-title');
    if (titleInp && !titleInp.value) {
      titleInp.value = file.name.replace(/\.[^/.]+$/, '').replace(/[_|-]/g, ' ');
    }

    // Read image if image file
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.customImageData = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  submitDocument() {
    const title = this.container.querySelector('#up-doc-title')?.value.trim();
    const vendor = this.container.querySelector('#up-doc-vendor')?.value.trim();
    const amount = parseFloat(this.container.querySelector('#up-doc-amount')?.value);
    const purchaseDate = this.container.querySelector('#up-doc-date')?.value;

    if (!title) {
      this.container.querySelector('#up-doc-title')?.focus();
      return alert('Please enter a document title / description.');
    }
    if (!vendor) {
      this.container.querySelector('#up-doc-vendor')?.focus();
      return alert('Please enter a vendor / merchant name.');
    }
    if (isNaN(amount) || amount <= 0) {
      this.container.querySelector('#up-doc-amount')?.focus();
      return alert('Please enter a valid total amount (greater than 0).');
    }

    const newDoc = {
      id: 'doc_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      title,
      vendor,
      amount,
      taxAmount: parseFloat(this.container.querySelector('#up-doc-tax')?.value) || 0,
      currency: '$',
      invoiceNumber: this.container.querySelector('#up-doc-invoice')?.value.trim() || '',
      serialNumber: this.container.querySelector('#up-doc-serial')?.value.trim() || '',
      purchaseDate: purchaseDate || new Date().toISOString().split('T')[0],
      category: this.container.querySelector('#up-doc-category')?.value || 'Other',
      paymentMethod: this.container.querySelector('#up-doc-payment')?.value || 'Credit Card',
      warrantyType: this.container.querySelector('#up-doc-warranty-type')?.value.trim() || '',
      warrantyExpirationDate: this.container.querySelector('#up-doc-warranty')?.value || null,
      returnDeadlineDate: this.container.querySelector('#up-doc-return')?.value || null,
      notes: this.container.querySelector('#up-doc-notes')?.value.trim() || '',
      tags: (this.container.querySelector('#up-doc-tags')?.value || '').split(',').map(t => t.trim()).filter(Boolean),
      fileName: this.docData.fileName || `${vendor.replace(/\s+/g, '_')}_Receipt.png`,
      customImageData: this.customImageData || null,
      items: [{ name: title, qty: 1, price: amount }]
    };

    if (this.onSaveDocument) {
      this.onSaveDocument(newDoc);
    }
    this.close();
  }
}
