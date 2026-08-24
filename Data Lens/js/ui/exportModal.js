/**
 * DataLens - Export & Backup Manager Modal
 */

class ExportModal {
  static show(currentData, currentColumns, activeDatasetName = 'dataset') {
    const modalBackdrop = document.getElementById('app-modal-backdrop');
    const modalDialog = document.getElementById('app-modal-dialog');
    if (!modalBackdrop || !modalDialog) return;

    modalDialog.innerHTML = `
      <div class="modal-header">
        <div class="modal-title">Export & Backup Center</div>
        <button class="btn btn-ghost btn-sm btn-icon" id="btn-close-modal">✕</button>
      </div>
      <div class="modal-body">
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <!-- Dataset Exports -->
          <div>
            <div class="form-label" style="margin-bottom: 6px; font-weight: 600;">ACTIVE DATASET EXPORT</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <button class="btn btn-secondary" id="btn-modal-export-csv" style="justify-content: flex-start; padding: 10px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                <div style="text-align: left; margin-left: 6px;">
                  <div style="font-weight: 600;">Export as CSV</div>
                  <div style="font-size: 10px; color: var(--text-muted);">Tabular format (.csv)</div>
                </div>
              </button>

              <button class="btn btn-secondary" id="btn-modal-export-json" style="justify-content: flex-start; padding: 10px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                <div style="text-align: left; margin-left: 6px;">
                  <div style="font-weight: 600;">Export as JSON</div>
                  <div style="font-size: 10px; color: var(--text-muted);">Formatted JSON records (.json)</div>
                </div>
              </button>
            </div>
          </div>

          <div class="dropdown-divider"></div>

          <!-- Project Backup -->
          <div>
            <div class="form-label" style="margin-bottom: 6px; font-weight: 600;">PROJECT BACKUP & RESTORE</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <button class="btn btn-secondary" id="btn-modal-export-project" style="justify-content: flex-start; padding: 10px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                <div style="text-align: left; margin-left: 6px;">
                  <div style="font-weight: 600;">Save DataLens Project</div>
                  <div style="font-size: 10px; color: var(--text-muted);">All datasets, dashboards & recipes (.datalens)</div>
                </div>
              </button>

              <button class="btn btn-secondary" id="btn-modal-import-project" style="justify-content: flex-start; padding: 10px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <div style="text-align: left; margin-left: 6px;">
                  <div style="font-weight: 600;">Restore Project</div>
                  <div style="font-size: 10px; color: var(--text-muted);">Upload .datalens backup package</div>
                </div>
              </button>
            </div>
            <input type="file" id="input-restore-project-file" accept=".datalens,.json" style="display: none;">
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="btn-cancel-modal">Close</button>
      </div>
    `;

    modalBackdrop.classList.add('open');

    const closeModal = () => modalBackdrop.classList.remove('open');
    document.getElementById('btn-close-modal').onclick = closeModal;
    document.getElementById('btn-cancel-modal').onclick = closeModal;

    // Export CSV
    document.getElementById('btn-modal-export-csv').onclick = () => {
      const csv = DataParser.exportToCSV(currentData, currentColumns);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeDatasetName.toLowerCase().replace(/\s+/g, '_')}_export.csv`;
      a.click();
      URL.revokeObjectURL(url);
      window.Toast.success('Dataset exported to CSV');
      closeModal();
    };

    // Export JSON
    document.getElementById('btn-modal-export-json').onclick = () => {
      const json = DataParser.exportToJSON(currentData);
      const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeDatasetName.toLowerCase().replace(/\s+/g, '_')}_export.json`;
      a.click();
      URL.revokeObjectURL(url);
      window.Toast.success('Dataset exported to JSON');
      closeModal();
    };

    // Export Project Backup (.datalens)
    document.getElementById('btn-modal-export-project').onclick = async () => {
      const backup = await window.dataLensStorage.exportFullBackup();
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `datalens_workspace_backup_${Date.now()}.datalens`;
      a.click();
      URL.revokeObjectURL(url);
      window.Toast.success('Complete project backup downloaded');
      closeModal();
    };

    // Restore Project
    const fileInput = document.getElementById('input-restore-project-file');
    document.getElementById('btn-modal-import-project').onclick = () => {
      fileInput.click();
    };

    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        await window.dataLensStorage.importFullBackup(parsed);
        window.Toast.success('Workspace restored successfully! Refreshing...');
        setTimeout(() => location.reload(), 800);
      } catch (err) {
        window.Toast.danger('Failed to restore backup: ' + err.message);
      }
    };
  }
}

window.ExportModal = ExportModal;
