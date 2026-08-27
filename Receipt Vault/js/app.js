/**
 * ReceiptVault - Master Application Orchestrator
 * Integrates Navigation, Document Library, Warranty Engine, Viewer Studio, Dashboard, Reports, and Toast System.
 */

import { getIcon, escapeHTML } from './core/icons.js';
import { db } from './core/db.js';
import { renderDashboard } from './editor/dashboard.js';
import { renderDocumentLibrary } from './editor/document-library.js';
import { DocumentViewer } from './editor/document-viewer.js';
import { UploadModal } from './editor/upload-modal.js';
import { renderReports } from './editor/reports.js';
import { calculateVaultMetrics, getWarrantyInfo, WARRANTY_STATUS } from './core/warranty.js';

class ReceiptVaultApp {
  constructor() {
    this.documents = [];
    this.selectedDocId = null;
    this.activeTab = 'dashboard'; // 'dashboard', 'library', 'warranties', 'reports'
    this.filters = { search: '', category: '', warranty: '', quickTag: '', sort: 'date_desc' };
    this.recentlyDeleted = null;
    this.isMobileInspectorOpen = false;
  }

  async init() {
    await db.init();
    this.documents = await db.getAllDocuments();

    if (this.documents.length > 0) {
      this.selectedDocId = this.documents[0].id;
    }

    // Sub-components
    const viewerContainer = document.getElementById('document-viewer-container');
    this.viewer = new DocumentViewer(
      viewerContainer,
      (updatedDoc) => this.saveDocument(updatedDoc),
      (docId) => this.deleteDocument(docId),
      () => this.closeInspector()
    );

    const uploadModalContainer = document.getElementById('upload-modal-container');
    this.uploadModal = new UploadModal(
      uploadModalContainer,
      this.documents,
      (newDoc) => this.saveDocument(newDoc, true)
    );

    this.setupNavigation();
    this.setupTopActions();
    this.setupSplitter();
    this.setupKeyboardShortcuts();
    this.updateTabBadges();
    this.renderActiveTab();
    this.updateInspector();
  }

  setupNavigation() {
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setTab(btn.dataset.tab);
      });
    });
  }

  setTab(tabKey) {
    this.activeTab = tabKey;
    document.querySelectorAll('.nav-tab-btn').forEach(b => {
      const isActive = b.dataset.tab === tabKey;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Handle Warranties tab shortcut
    if (tabKey === 'warranties') {
      this.filters.warranty = 'ACTIVE';
      this.filters.quickTag = '';
    } else if (tabKey === 'library') {
      this.filters.warranty = '';
      this.filters.quickTag = '';
    }

    this.renderActiveTab();
  }

  setupTopActions() {
    // New Receipt Button
    document.getElementById('btn-new-receipt')?.addEventListener('click', () => {
      this.openNewReceiptModal();
    });

    // Reset Demo Vault
    document.getElementById('btn-reset-demo-vault')?.addEventListener('click', async () => {
      if (confirm('Reset ReceiptVault to default demonstration receipts and warranties?')) {
        await db.resetDemoData();
        this.documents = await db.getAllDocuments();
        this.selectedDocId = this.documents[0]?.id || null;
        this.updateTabBadges();
        this.renderActiveTab();
        this.updateInspector();
        this.showToast('Demo filing cabinet restored successfully.', 'info');
      }
    });

    // Export Backup JSON
    document.getElementById('btn-export-vault-json')?.addEventListener('click', () => {
      const json = JSON.stringify(this.documents, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const dateStr = new Date().toISOString().split('T')[0];
      a.download = `receiptvault_backup_${dateStr}.json`;
      a.click();
      this.showToast(`Exported backup (${this.documents.length} records)`, 'success');
    });

    // Import Backup JSON
    const importInput = document.getElementById('file-import-vault');
    document.getElementById('btn-import-vault-json')?.addEventListener('click', () => importInput?.click());
    importInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          if (Array.isArray(parsed) && parsed.length > 0) {
            for (const doc of parsed) {
              await db.saveDocument(doc);
            }
            this.documents = await db.getAllDocuments();
            this.selectedDocId = this.documents[0]?.id || null;
            this.updateTabBadges();
            this.renderActiveTab();
            this.updateInspector();
            this.showToast(`Successfully imported ${parsed.length} document records.`, 'success');
          } else {
            this.showToast('Invalid ReceiptVault backup JSON format.', 'error');
          }
        } catch (err) {
          this.showToast('Failed to parse backup JSON: ' + err.message, 'error');
        }
      };
      reader.readAsText(file);
    });
  }

  setupSplitter() {
    const splitter = document.getElementById('library-viewer-splitter');
    const viewerPane = document.getElementById('document-viewer-container');
    if (!splitter || !viewerPane) return;

    let isDragging = false;
    let startX = 0;
    let startW = 0;

    splitter.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startW = viewerPane.offsetWidth;
      document.body.style.cursor = 'col-resize';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = startX - e.clientX;
      const newW = Math.max(300, Math.min(650, startW + dx));
      viewerPane.style.width = `${newW}px`;
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        document.body.style.cursor = '';
      }
    });
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Ctrl+S / Cmd+S: Save current doc
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (this.viewer) this.viewer.collectAndSave();
      }

      // Ctrl+N / Cmd+N: New receipt
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        this.openNewReceiptModal();
      }

      // Escape: Close modals
      if (e.key === 'Escape') {
        if (this.uploadModal) this.uploadModal.close();
        if (window.innerWidth <= 1024) this.closeInspector();
      }
    });
  }

  openNewReceiptModal() {
    this.uploadModal.setExistingDocs(this.documents);
    this.uploadModal.open();
  }

  closeInspector() {
    const rightInspector = document.getElementById('document-viewer-container');
    if (rightInspector) {
      rightInspector.style.display = 'none';
    }
    this.isMobileInspectorOpen = false;
  }

  updateTabBadges() {
    const totalBadge = document.getElementById('badge-total-docs');
    if (totalBadge) {
      totalBadge.textContent = this.documents.length;
    }

    const expiringBadge = document.getElementById('badge-expiring-warranties');
    if (expiringBadge) {
      const expiringCount = this.documents.filter(d => getWarrantyInfo(d.warrantyExpirationDate).status === WARRANTY_STATUS.EXPIRING_SOON).length;
      if (expiringCount > 0) {
        expiringBadge.textContent = `${expiringCount} urgent`;
        expiringBadge.style.display = 'inline-flex';
      } else {
        expiringBadge.style.display = 'none';
      }
    }
  }

  renderActiveTab() {
    const mainContainer = document.getElementById('main-workspace-view');
    const rightInspector = document.getElementById('document-viewer-container');
    const splitter = document.getElementById('library-viewer-splitter');

    if (this.activeTab === 'dashboard') {
      if (rightInspector) rightInspector.style.display = 'none';
      if (splitter) splitter.style.display = 'none';

      renderDashboard(mainContainer, {
        documents: this.documents,
        onSelectDoc: (id) => {
          this.selectedDocId = id;
          this.setTab('library');
        },
        onNavigateTab: (tab) => this.setTab(tab),
        onNewReceipt: () => this.openNewReceiptModal()
      });
    } else if (this.activeTab === 'reports') {
      if (rightInspector) rightInspector.style.display = 'none';
      if (splitter) splitter.style.display = 'none';

      renderReports(mainContainer, {
        documents: this.documents,
        onExportCSV: () => this.exportCSV()
      });
    } else {
      // 'library' or 'warranties'
      const isMobile = window.innerWidth <= 1024;
      if (rightInspector) {
        rightInspector.style.display = isMobile ? (this.isMobileInspectorOpen ? 'flex' : 'none') : 'flex';
      }
      if (splitter) splitter.style.display = isMobile ? 'none' : 'block';

      renderDocumentLibrary(mainContainer, {
        documents: this.documents,
        selectedDocId: this.selectedDocId,
        filters: this.filters,
        onSelectDoc: (id) => {
          this.selectedDocId = id;
          if (isMobile) {
            this.isMobileInspectorOpen = true;
            if (rightInspector) rightInspector.style.display = 'flex';
          }
          this.renderActiveTab();
          this.updateInspector();
        },
        onFilterChange: (newFilters) => {
          this.filters = newFilters;
          this.renderActiveTab();
        }
      });
    }
  }

  updateInspector() {
    const doc = this.documents.find(d => d.id === this.selectedDocId) || this.documents[0] || null;
    this.viewer.setDocument(doc);
  }

  async saveDocument(doc, isNew = false) {
    const saved = await db.saveDocument(doc);
    this.documents = await db.getAllDocuments();
    this.selectedDocId = saved ? saved.id : doc.id;
    this.updateTabBadges();
    this.renderActiveTab();
    this.updateInspector();
    this.showToast(isNew ? `Added receipt "${doc.title}"` : `Saved changes to "${doc.title}"`, 'success');
  }

  async deleteDocument(id) {
    const deletedDoc = this.documents.find(d => d.id === id);
    this.recentlyDeleted = deletedDoc;

    await db.deleteDocument(id);
    this.documents = await db.getAllDocuments();
    this.selectedDocId = this.documents[0]?.id || null;
    this.updateTabBadges();
    this.renderActiveTab();
    this.updateInspector();

    this.showToast(`Deleted receipt record.`, 'warning', 6000, {
      label: 'Undo',
      onClick: async () => {
        if (this.recentlyDeleted) {
          await db.saveDocument(this.recentlyDeleted);
          this.documents = await db.getAllDocuments();
          this.selectedDocId = this.recentlyDeleted.id;
          this.updateTabBadges();
          this.renderActiveTab();
          this.updateInspector();
          this.showToast(`Restored "${this.recentlyDeleted.title}"`, 'success');
          this.recentlyDeleted = null;
        }
      }
    });
  }

  exportCSV() {
    const headers = [
      'Document ID',
      'Title',
      'Merchant/Vendor',
      'Invoice/Order #',
      'Serial/License #',
      'Amount',
      'Tax Amount',
      'Currency',
      'Purchase Date',
      'Category',
      'Payment Method',
      'Warranty Policy',
      'Warranty Expiration',
      'Return Deadline',
      'Tags',
      'Notes'
    ];

    const rows = this.documents.map(d => [
      `"${d.id}"`,
      `"${(d.title || '').replace(/"/g, '""')}"`,
      `"${(d.vendor || '').replace(/"/g, '""')}"`,
      `"${(d.invoiceNumber || '').replace(/"/g, '""')}"`,
      `"${(d.serialNumber || '').replace(/"/g, '""')}"`,
      Number(d.amount || 0).toFixed(2),
      Number(d.taxAmount || 0).toFixed(2),
      `"${d.currency || '$'}"`,
      `"${d.purchaseDate || ''}"`,
      `"${d.category || ''}"`,
      `"${d.paymentMethod || ''}"`,
      `"${(d.warrantyType || '').replace(/"/g, '""')}"`,
      `"${d.warrantyExpirationDate || ''}"`,
      `"${d.returnDeadlineDate || ''}"`,
      `"${(d.tags || []).join('; ')}"`,
      `"${(d.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    a.download = `receiptvault_ledger_${dateStr}.csv`;
    a.click();
    this.showToast(`Exported CSV ledger (${this.documents.length} records)`, 'success');
  }

  showToast(message, type = 'info', duration = 3500, action = null) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconName = 'info';
    if (type === 'success') iconName = 'check';
    if (type === 'warning') iconName = 'alertTriangle';
    if (type === 'error') iconName = 'close';

    toast.innerHTML = `
      <div class="flex items-center gap-2">
        ${getIcon(iconName, `icon-xs ${type === 'success' ? 'text-emerald' : (type === 'warning' ? 'text-amber' : (type === 'error' ? 'text-rose' : 'text-primary'))}`)}
        <span class="text-xs font-semibold text-primary">${escapeHTML(message)}</span>
      </div>
      <div class="flex items-center gap-2">
        ${action ? `<button class="btn btn-xs btn-primary font-bold toast-action-btn">${escapeHTML(action.label)}</button>` : ''}
        <button class="btn-icon-xs text-muted toast-close-btn" aria-label="Dismiss toast">${getIcon('close', 'icon-xs')}</button>
      </div>
    `;

    if (action) {
      toast.querySelector('.toast-action-btn')?.addEventListener('click', () => {
        action.onClick();
        toast.remove();
      });
    }

    toast.querySelector('.toast-close-btn')?.addEventListener('click', () => {
      toast.remove();
    });

    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.2s ease';
        setTimeout(() => toast.remove(), 200);
      }
    }, duration);
  }
}

// Bootstrap
function startReceiptVault() {
  const app = new ReceiptVaultApp();
  window.receiptVaultApp = app;
  app.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startReceiptVault);
} else {
  startReceiptVault();
}
