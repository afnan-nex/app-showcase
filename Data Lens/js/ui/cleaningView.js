/**
 * DataLens - Data Cleaning & Transformation Pipeline UI
 * Reproducible step-by-step pipeline builder with live diff preview and history.
 */

class CleaningView {
  constructor(containerId, onPipelineUpdated = null) {
    this.container = document.getElementById(containerId);
    this.onPipelineUpdated = onPipelineUpdated;

    this.rawDataset = [];
    this.rawColumns = [];
    this.steps = [];

    this.transformedData = [];
    this.transformedColumns = [];
    this.stepLogs = [];

    this.tablePreviewComponent = null;
  }

  setDataset(rawData, rawColumns, savedSteps = []) {
    this.rawDataset = rawData || [];
    this.rawColumns = rawColumns || [];
    this.steps = savedSteps || [];
    this.runPipeline();
  }

  runPipeline() {
    const result = PipelineEngine.executePipeline(this.rawDataset, this.rawColumns, this.steps);
    this.transformedData = result.data;
    this.transformedColumns = result.columns;
    this.stepLogs = result.stepLogs;

    if (this.onPipelineUpdated) {
      this.onPipelineUpdated(this.transformedData, this.transformedColumns, this.steps);
    }

    this.render();
  }

  render() {
    if (!this.container) return;

    if (!this.rawDataset || this.rawDataset.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-title">No Dataset Selected</div>
          <div class="empty-state-desc">Import or select a dataset to build data cleaning pipelines.</div>
        </div>
      `;
      return;
    }

    const rowsBefore = this.rawDataset.length;
    const rowsAfter = this.transformedData.length;
    const colsBefore = this.rawColumns.length;
    const colsAfter = this.transformedColumns.length;

    let html = `
      <div class="pipeline-view-container">
        <!-- Left Steps Sidebar -->
        <div class="pipeline-sidebar">
          <div class="sidebar-header" style="border-bottom: 1px solid var(--border-subtle);">
            <span>Pipeline Steps (${this.steps.length})</span>
            <button class="btn btn-primary btn-sm" id="btn-add-pipeline-step" aria-label="Add transformation step">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span>Add Step</span>
            </button>
          </div>

          <div class="pipeline-steps-list">
            ${this.steps.length === 0 ? `
              <div style="padding: 24px 12px; text-align: center; color: var(--text-muted); font-size: 12px;">
                No cleaning steps added yet.<br>Click "Add Step" above to clean, format, or transform data.
              </div>
            ` : this.steps.map((step, idx) => this.renderStepCard(step, idx)).join('')}
          </div>

          <!-- Bottom Action Buttons -->
          <div style="padding: 10px; border-top: 1px solid var(--border-subtle); display: flex; gap: 8px;">
            <button class="btn btn-secondary btn-sm" id="btn-clear-all-steps" style="flex: 1;" ${this.steps.length === 0 ? 'disabled' : ''}>Clear All Steps</button>
          </div>
        </div>

        <!-- Right Main Preview Area -->
        <div class="pipeline-main-area">
          <div class="view-toolbar">
            <div class="toolbar-group">
              <span style="font-size: 12px; font-weight: 600;">TRANSFORMED OUTPUT PREVIEW</span>
              <span class="type-badge type-number">${rowsAfter.toLocaleString()} Rows (${rowsAfter - rowsBefore >= 0 ? '+' : ''}${rowsAfter - rowsBefore})</span>
              <span class="type-badge type-text">${colsAfter} Columns (${colsAfter - colsBefore >= 0 ? '+' : ''}${colsAfter - colsBefore})</span>
            </div>

            <div class="toolbar-group">
              <button class="btn btn-secondary btn-sm" id="btn-export-cleaned-csv" aria-label="Export cleaned CSV">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                <span>Export Cleaned CSV</span>
              </button>
            </div>
          </div>

          <div id="pipeline-table-preview" style="flex: 1; overflow: hidden;"></div>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
    this.bindEvents();

    // Render Preview Table
    this.tablePreviewComponent = new TableComponent('pipeline-table-preview');
    this.tablePreviewComponent.setDataset(this.transformedData, this.transformedColumns);
  }

  renderStepCard(step, idx) {
    const log = this.stepLogs.find(l => l.stepId === step.id);
    const summaryText = log ? log.summary : step.type.replace('_', ' ').toUpperCase();

    return `
      <div class="pipeline-step-card ${step.disabled ? 'disabled' : ''}" id="step-card-${step.id}">
        <div class="step-card-header">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span class="step-number">${idx + 1}</span>
            <span class="step-title">${this.getStepTitle(step.type)}</span>
          </div>

          <div style="display: flex; align-items: center; gap: 2px;">
            <button class="btn btn-ghost btn-sm btn-icon" data-action="toggle-step" data-index="${idx}" title="${step.disabled ? 'Enable Step' : 'Disable Step'}" aria-label="Toggle Step">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${step.disabled ? '<line x1="1" y1="1" x2="23" y2="23"/><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>' : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'}
              </svg>
            </button>

            <button class="btn btn-ghost btn-sm btn-icon" data-action="delete-step" data-index="${idx}" title="Delete Step" aria-label="Delete Step">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <div class="step-summary">${this.escapeHtml(summaryText)}</div>
      </div>
    `;
  }

  getStepTitle(type) {
    const titles = {
      rename_column: 'Rename Column',
      remove_columns: 'Remove Columns',
      remove_duplicates: 'Remove Duplicates',
      trim_whitespace: 'Trim Whitespace',
      find_replace: 'Find & Replace',
      convert_type: 'Convert Type',
      handle_blanks: 'Handle Blanks',
      calculated_column: 'Calculated Column',
      filter_rows: 'Filter Rows'
    };
    return titles[type] || 'Transform Step';
  }

  bindEvents() {
    // Add Step
    const addBtn = document.getElementById('btn-add-pipeline-step');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.showAddStepModal());
    }

    // Clear all
    const clearBtn = document.getElementById('btn-clear-all-steps');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Clear all data cleaning steps?')) {
          this.steps = [];
          this.runPipeline();
        }
      });
    }

    // Toggle step
    this.container.querySelectorAll('[data-action="toggle-step"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.index, 10);
        this.steps[idx].disabled = !this.steps[idx].disabled;
        this.runPipeline();
      });
    });

    // Delete step
    this.container.querySelectorAll('[data-action="delete-step"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.index, 10);
        this.steps.splice(idx, 1);
        this.runPipeline();
      });
    });

    // Export CSV
    const exportCleanCsv = document.getElementById('btn-export-cleaned-csv');
    if (exportCleanCsv) {
      exportCleanCsv.addEventListener('click', () => {
        const csv = DataParser.exportToCSV(this.transformedData, this.transformedColumns);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `datalens_cleaned_${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        window.Toast.success('Cleaned dataset exported to CSV');
      });
    }
  }

  showAddStepModal() {
    const modalBackdrop = document.getElementById('app-modal-backdrop');
    const modalDialog = document.getElementById('app-modal-dialog');
    if (!modalBackdrop || !modalDialog) return;

    modalDialog.innerHTML = `
      <div class="modal-header">
        <div class="modal-title">Add Data Transformation Step</div>
        <button class="btn btn-ghost btn-sm btn-icon" id="btn-close-modal" aria-label="Close dialog">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label" for="modal-step-type">Step Type</label>
          <select class="form-control" id="modal-step-type">
            <option value="remove_duplicates">Remove Duplicate Rows</option>
            <option value="trim_whitespace">Trim Whitespace</option>
            <option value="rename_column">Rename Column</option>
            <option value="remove_columns">Remove / Drop Columns</option>
            <option value="find_replace">Find & Replace Values</option>
            <option value="convert_type">Convert Column Type</option>
            <option value="handle_blanks">Handle Blank / Missing Cells</option>
            <option value="calculated_column">Create Calculated Column (Formula)</option>
          </select>
        </div>

        <div id="modal-step-params-container"></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="btn-cancel-modal">Cancel</button>
        <button class="btn btn-primary" id="btn-save-step">Apply Step</button>
      </div>
    `;

    modalBackdrop.classList.add('open');

    const closeModal = () => modalBackdrop.classList.remove('open');
    document.getElementById('btn-close-modal').onclick = closeModal;
    document.getElementById('btn-cancel-modal').onclick = closeModal;
    modalBackdrop.onclick = (e) => { if (e.target === modalBackdrop) closeModal(); };

    const typeSelect = document.getElementById('modal-step-type');
    const paramsContainer = document.getElementById('modal-step-params-container');

    const updateParamsForm = () => {
      const type = typeSelect.value;
      let formHtml = '';

      switch (type) {
        case 'remove_duplicates':
          formHtml = `
            <div class="form-group">
              <label class="form-label">Key Columns for Deduplication</label>
              <div style="max-height: 140px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px;">
                ${this.transformedColumns.map(c => `
                  <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; cursor: pointer;">
                    <input type="checkbox" class="dedupe-col-checkbox" value="${this.escapeHtml(c.name)}" checked>
                    <span>${this.escapeHtml(c.name)}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          `;
          break;

        case 'trim_whitespace':
          formHtml = `
            <div class="form-group">
              <label class="form-label" for="step-trim-mode">Trim Mode</label>
              <select class="form-control" id="step-trim-mode">
                <option value="both">Both Ends (Trim leading and trailing)</option>
                <option value="left">Left Only (TrimStart)</option>
                <option value="right">Right Only (TrimEnd)</option>
              </select>
            </div>
          `;
          break;

        case 'rename_column':
          formHtml = `
            <div class="form-group">
              <label class="form-label" for="step-rename-old">Select Column to Rename</label>
              <select class="form-control" id="step-rename-old">
                ${this.transformedColumns.map(c => `<option value="${this.escapeHtml(c.name)}">${this.escapeHtml(c.name)}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="step-rename-new">New Column Name</label>
              <input type="text" class="form-control" id="step-rename-new" placeholder="Enter new column name...">
            </div>
          `;
          break;

        case 'remove_columns':
          formHtml = `
            <div class="form-group">
              <label class="form-label">Select Columns to Remove</label>
              <div style="max-height: 160px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px;">
                ${this.transformedColumns.map(c => `
                  <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; cursor: pointer;">
                    <input type="checkbox" class="remove-col-checkbox" value="${this.escapeHtml(c.name)}">
                    <span>${this.escapeHtml(c.name)}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          `;
          break;

        case 'find_replace':
          formHtml = `
            <div class="form-group">
              <label class="form-label" for="step-fr-col">Target Column</label>
              <select class="form-control" id="step-fr-col">
                ${this.transformedColumns.map(c => `<option value="${this.escapeHtml(c.name)}">${this.escapeHtml(c.name)}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="step-fr-find">Find Text</label>
              <input type="text" class="form-control" id="step-fr-find" placeholder="Text to search...">
            </div>
            <div class="form-group">
              <label class="form-label" for="step-fr-replace">Replace With</label>
              <input type="text" class="form-control" id="step-fr-replace" placeholder="Replacement value...">
            </div>
            <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; cursor: pointer;">
              <input type="checkbox" id="step-fr-case"> Match Exact Case
            </label>
          `;
          break;

        case 'convert_type':
          formHtml = `
            <div class="form-group">
              <label class="form-label" for="step-conv-col">Target Column</label>
              <select class="form-control" id="step-conv-col">
                ${this.transformedColumns.map(c => `<option value="${this.escapeHtml(c.name)}">${this.escapeHtml(c.name)} (${c.type})</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="step-conv-type">Convert To Type</label>
              <select class="form-control" id="step-conv-type">
                <option value="text">Text (String)</option>
                <option value="number">Number</option>
                <option value="currency">Currency ($ USD)</option>
                <option value="percentage">Percentage (%)</option>
                <option value="date">Date</option>
                <option value="boolean">Boolean (True/False)</option>
              </select>
            </div>
          `;
          break;

        case 'handle_blanks':
          formHtml = `
            <div class="form-group">
              <label class="form-label" for="step-blank-col">Target Column</label>
              <select class="form-control" id="step-blank-col">
                ${this.transformedColumns.map(c => `<option value="${this.escapeHtml(c.name)}">${this.escapeHtml(c.name)}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="step-blank-action">Action</label>
              <select class="form-control" id="step-blank-action">
                <option value="drop_row">Drop Rows with Blanks</option>
                <option value="fill_value">Fill with Custom Value</option>
                <option value="fill_mean">Impute Mean (Numeric)</option>
                <option value="fill_median">Impute Median (Numeric)</option>
                <option value="ffill">Forward Fill (Last Valid)</option>
              </select>
            </div>
            <div class="form-group" id="step-blank-val-group" style="display: none;">
              <label class="form-label" for="step-blank-val">Custom Replacement Value</label>
              <input type="text" class="form-control" id="step-blank-val" placeholder="Value...">
            </div>
          `;
          break;

        case 'calculated_column':
          formHtml = `
            <div class="form-group">
              <label class="form-label" for="step-calc-name">New Column Name</label>
              <input type="text" class="form-control" id="step-calc-name" placeholder="e.g. ProfitMargin">
            </div>
            <div class="form-group">
              <label class="form-label" for="step-calc-formula">Formula Expression</label>
              <input type="text" class="form-control" id="step-calc-formula" placeholder="e.g. [Profit] / [Sales]">
              <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px;">
                ${this.transformedColumns.map(c => `<button type="button" class="btn btn-ghost btn-sm formula-chip" style="font-family: var(--font-mono); font-size: 10px; padding: 2px 4px;">[${this.escapeHtml(c.name)}]</button>`).join('')}
              </div>
            </div>
          `;
          break;
      }

      paramsContainer.innerHTML = formHtml;

      // Handle blank action toggle
      const blankAction = document.getElementById('step-blank-action');
      if (blankAction) {
        blankAction.onchange = () => {
          document.getElementById('step-blank-val-group').style.display = blankAction.value === 'fill_value' ? 'flex' : 'none';
        };
      }

      // Handle formula helper chips
      paramsContainer.querySelectorAll('.formula-chip').forEach(chip => {
        chip.onclick = () => {
          const formulaInput = document.getElementById('step-calc-formula');
          if (formulaInput) {
            formulaInput.value += chip.textContent;
            formulaInput.focus();
          }
        };
      });
    };

    typeSelect.onchange = updateParamsForm;
    updateParamsForm();

    document.getElementById('btn-save-step').onclick = () => {
      const type = typeSelect.value;
      const stepId = 'step-' + Date.now();
      let params = {};

      switch (type) {
        case 'remove_duplicates': {
          const checkedCols = Array.from(modalDialog.querySelectorAll('.dedupe-col-checkbox:checked')).map(cb => cb.value);
          params = { keyColumns: checkedCols };
          break;
        }
        case 'trim_whitespace': {
          params = { mode: document.getElementById('step-trim-mode').value };
          break;
        }
        case 'rename_column': {
          const oldName = document.getElementById('step-rename-old').value;
          const newName = document.getElementById('step-rename-new').value.trim();
          if (!newName) {
            window.Toast.warning('Please provide a new column name');
            return;
          }
          params = { oldName, newName };
          break;
        }
        case 'remove_columns': {
          const toRemove = Array.from(modalDialog.querySelectorAll('.remove-col-checkbox:checked')).map(cb => cb.value);
          if (toRemove.length === 0) {
            window.Toast.warning('Please select at least one column to remove');
            return;
          }
          params = { columns: toRemove };
          break;
        }
        case 'find_replace': {
          params = {
            column: document.getElementById('step-fr-col').value,
            find: document.getElementById('step-fr-find').value,
            replace: document.getElementById('step-fr-replace').value,
            matchCase: document.getElementById('step-fr-case').checked
          };
          break;
        }
        case 'convert_type': {
          params = {
            column: document.getElementById('step-conv-col').value,
            targetType: document.getElementById('step-conv-type').value
          };
          break;
        }
        case 'handle_blanks': {
          params = {
            column: document.getElementById('step-blank-col').value,
            action: document.getElementById('step-blank-action').value,
            fillValue: document.getElementById('step-blank-val') ? document.getElementById('step-blank-val').value : ''
          };
          break;
        }
        case 'calculated_column': {
          const newColName = document.getElementById('step-calc-name').value.trim();
          const formula = document.getElementById('step-calc-formula').value.trim();
          if (!newColName || !formula) {
            window.Toast.warning('Please provide a column name and formula');
            return;
          }
          params = { newColName, formula };
          break;
        }
      }

      this.steps.push({
        id: stepId,
        type,
        params,
        disabled: false
      });

      closeModal();
      this.runPipeline();
      window.Toast.success('Transformation step applied');
    };
  }

  escapeHtml(str) {
    if (str === undefined || str === null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

window.CleaningView = CleaningView;
