/**
 * ReceiptVault - Master Application Orchestrator
 * Integrates Navigation, Document Library, Warranty Engine, Viewer Studio, Dashboard, and Reports.
 */

import { getIcon, escapeHTML } from './core/icons.js';
import { db } from './core/db.js';
import { renderDashboard } from './editor/dashboard.js';
import { renderDocumentLibrary } from './editor/document-library.js';
import { DocumentViewer } from './editor/document-viewer.js';
import { UploadModal } from './editor/upload-modal.js';
import { renderReports } from './editor/reports.js';

class ReceiptVaultApp {
  constructor() {
    this.documents = [];
    this.selectedDocId = null;
    this.activeTab = 'dashboard'; // 'dashboard', 'library', 'warranties', 'reports'
    this.filters = { search: '', category: '', warranty: '', sort: 'date_desc' };
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
      (docId) => this.deleteDocument(docId)
    );

    const uploadModalContainer = document.getElementById('upload-modal-container');
    this.uploadModal = new UploadModal(
      uploadModalContainer,
      this.documents,
      (newDoc) => this.saveDocument(newDoc)
    );

    this.setupNavigation();
    this.setupTopActions();
    this.setupSplitter();
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
      b.classList.toggle('active', b.dataset.tab === tabKey);
    });

    // Handle Warranties tab shortcut
    if (tabKey === 'warranties') {
      this.filters.warranty = 'ACTIVE';
    } else if (tabKey === 'library') {
      this.filters.warranty = '';
    }

    this.renderActiveTab();
  }

  setupTopActions() {
    // New Receipt Button
    document.getElementById('btn-new-receipt')?.addEventListener('click', () => {
      this.uploadModal.setExistingDocs(this.documents);
      this.uploadModal.open();
    });

    // Reset Demo Vault
    document.getElementById('btn-reset-demo-vault')?.addEventListener('click', async () => {
      if (confirm('Reset ReceiptVault to demo receipts and warranties?')) {
        await db.resetDemoData();
        this.documents = await db.getAllDocuments();
        this.selectedDocId = this.documents[0]?.id || null;
        this.renderActiveTab();
        this.updateInspector();
      }
    });

    // Export Backup JSON
    document.getElementById('btn-export-vault-json')?.addEventListener('click', () => {
      const json = JSON.stringify(this.documents, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receiptvault_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
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
          if (Array.isArray(parsed)) {
            for (const doc of parsed) {
              await db.saveDocument(doc);
            }
            this.documents = await db.getAllDocuments();
            this.selectedDocId = this.documents[0]?.id || null;
            this.renderActiveTab();
            this.updateInspector();
            alert(`Successfully imported ${parsed.length} document records.`);
          } else {
            alert('Invalid ReceiptVault backup JSON format.');
          }
        } catch (err) {
          alert('Failed to parse backup JSON: ' + err.message);
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
      const newW = Math.max(280, Math.min(600, startW + dx));
      viewerPane.style.width = `${newW}px`;
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        document.body.style.cursor = '';
      }
    });
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
        onNavigateTab: (tab) => this.setTab(tab)
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
      if (rightInspector) rightInspector.style.display = 'flex';
      if (splitter) splitter.style.display = 'block';

      renderDocumentLibrary(mainContainer, {
        documents: this.documents,
        selectedDocId: this.selectedDocId,
        filters: this.filters,
        onSelectDoc: (id) => {
          this.selectedDocId = id;
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

  async saveDocument(doc) {
    await db.saveDocument(doc);
    this.documents = await db.getAllDocuments();
    this.selectedDocId = doc.id;
    this.renderActiveTab();
    this.updateInspector();
  }

  async deleteDocument(id) {
    await db.deleteDocument(id);
    this.documents = await db.getAllDocuments();
    this.selectedDocId = this.documents[0]?.id || null;
    this.renderActiveTab();
    this.updateInspector();
  }

  exportCSV() {
    const headers = ['Title', 'Vendor', 'Amount', 'Currency', 'Purchase Date', 'Category', 'Payment Method', 'Warranty Expiration', 'Return Deadline', 'Tags', 'Notes'];
    const rows = this.documents.map(d => [
      `"${(d.title || '').replace(/"/g, '""')}"`,
      `"${(d.vendor || '').replace(/"/g, '""')}"`,
      d.amount || 0,
      `"${d.currency || '$'}"`,
      `"${d.purchaseDate || ''}"`,
      `"${d.category || ''}"`,
      `"${d.paymentMethod || ''}"`,
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
    a.download = `receiptvault_ledger_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
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
