/**
 * QueryLab - Master Application Orchestrator
 * Integrates SQL Lexer, Parser, Evaluator, Schema Browser, Results Grid, ERD Visualizer,
 * Table Designer, Snippet Manager, and Database Storage.
 */

import { getIcon, escapeHTML } from './core/icons.js';
import { db } from './core/db.js';
import { tokenize } from './engine/lexer.js';
import { SQLParser } from './engine/parser.js';
import { executeQuery } from './engine/evaluator.js';
import { Database } from './engine/database.js';
import { SAMPLE_DATABASES } from './editor/sample-data.js';
import { SQLEditor } from './editor/editor.js';
import { renderSchemaBrowser } from './editor/schema-browser.js';
import { renderResultsGrid } from './editor/results-grid.js';
import { ERDViewer } from './editor/erd-viewer.js';
import { TableDesignerModal } from './editor/table-designer.js';

class QueryLabApp {
  constructor() {
    this.activeDatabaseKey = 'shopmart';
    this.database = Database.fromJSON(SAMPLE_DATABASES.shopmart);
    this.activeTab = 'editor'; // 'editor', 'erd', 'history', 'snippets'
    this.queryHistory = [];
    this.savedSnippets = [];
    this.lastResult = null;
    this.lastError = null;
    this.isSidebarOpen = true;
    this.historyFilter = 'ALL'; // 'ALL', 'SUCCESS', 'ERROR'
    this.historySearch = '';
  }

  async init() {
    await db.init();

    // Load saved database or fallback to sample
    const savedCustomDB = await db.loadDatabase(this.activeDatabaseKey);
    if (savedCustomDB) {
      this.database = Database.fromJSON(savedCustomDB);
    }

    // Load saved history & snippets
    this.queryHistory = await db.loadHistory();
    this.savedSnippets = await db.loadSnippets();

    // Setup Sub-Components
    const editorContainer = document.getElementById('sql-editor-container');
    this.editor = new SQLEditor(
      editorContainer,
      (sql) => this.runSQL(sql),
      (sql) => this.openSaveSnippetDialog(sql)
    );
    this.editor.setActiveDatabase(this.database);

    const erdCanvas = document.getElementById('erd-canvas');
    this.erdViewer = new ERDViewer(erdCanvas);

    const modalContainer = document.getElementById('table-designer-modal-container');
    this.tableDesigner = new TableDesignerModal(modalContainer, (tableDef) => {
      try {
        this.database.createTable(tableDef);
        this.autoSave();
        this.editor.setActiveDatabase(this.database);
        this.renderAll();
        this.runSQL(`SELECT * FROM ${tableDef.name};`);
      } catch (err) {
        alert('Failed to create table: ' + err.message);
      }
    });
    this.tableDesigner.setDatabase(this.database);

    this.setupTopToolbar();
    this.setupTabs();
    this.setupSplitter();
    this.setupKeyboardShortcuts();
    this.setupERDControls();
    this.renderAll();
    this.handleResize();

    window.addEventListener('resize', () => this.handleResize());
  }

  handleResize() {
    const erdWrap = document.getElementById('tab-content-erd');
    if (erdWrap && this.erdViewer && this.erdViewer.canvas) {
      this.erdViewer.resize(erdWrap.clientWidth, erdWrap.clientHeight);
    }
  }

  renderAll() {
    this.renderSidebar();
    this.renderResults();
    this.erdViewer.setDatabase(this.database);
    this.renderHistory();
    this.renderSnippets();
    this.updateStatusReadout();
  }

  updateStatusReadout() {
    const readout = document.getElementById('status-engine-readout');
    if (readout) {
      const tableCount = Object.keys(this.database.tables || {}).length;
      readout.innerHTML = `Active DB: <strong>${escapeHTML(this.database.name)}</strong> &bull; Engine: <strong>Relational Memory Engine v2.0</strong> &bull; ${tableCount} Tables`;
    }
  }

  // --- SQL Execution Pipeline ---
  runSQL(sqlText) {
    const sql = (sqlText || '').trim();
    if (!sql) return;

    this.lastError = null;
    this.lastResult = null;

    try {
      const tokens = tokenize(sql);
      const parser = new SQLParser(tokens);
      const statements = parser.parse();

      if (statements.length === 0) {
        throw new Error('No executable SQL statements found.');
      }

      // Execute each statement in sequence
      let finalRes = null;
      for (const stmt of statements) {
        finalRes = executeQuery(stmt, this.database);
      }

      this.lastResult = finalRes;
      const summaryText = finalRes.type === 'SELECT' ? `${finalRes.rowCount} row(s) returned` : finalRes.message;
      this.addHistoryEntry(sql, true, finalRes.executionTimeMs, summaryText);
      this.autoSave();
    } catch (err) {
      this.lastError = err;
      this.addHistoryEntry(sql, false, 0, err.message || 'Syntax/Execution Error');
    }

    // Switch to Editor tab if in ERD / History
    if (this.activeTab !== 'editor') {
      this.setTab('editor');
    }

    this.editor.setActiveDatabase(this.database);
    this.renderAll();
  }

  // --- Top Toolbar Setup ---
  setupTopToolbar() {
    // Database Switcher
    const dbSelect = document.getElementById('select-active-database');
    dbSelect?.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === '__new__') {
        const name = prompt('Enter new database name:', 'Custom Database');
        if (name && name.trim()) {
          const newDb = new Database({ name: name.trim() });
          this.database = newDb;
          this.activeDatabaseKey = newDb.id;
          this.editor.setActiveDatabase(this.database);
          this.tableDesigner.setDatabase(this.database);
          this.renderAll();
          this.autoSave();
        } else {
          dbSelect.value = this.activeDatabaseKey;
        }
      } else if (SAMPLE_DATABASES[val]) {
        this.activeDatabaseKey = val;
        this.database = Database.fromJSON(SAMPLE_DATABASES[val]);
        this.editor.setActiveDatabase(this.database);
        this.tableDesigner.setDatabase(this.database);
        this.renderAll();
        this.autoSave();
      }
    });

    // Reset Demo Database
    document.getElementById('btn-reset-demo-db')?.addEventListener('click', () => {
      if (confirm(`Reset active database '${this.database.name}' to original demo schema and data?`)) {
        if (SAMPLE_DATABASES[this.activeDatabaseKey]) {
          this.database = Database.fromJSON(SAMPLE_DATABASES[this.activeDatabaseKey]);
          this.editor.setActiveDatabase(this.database);
          this.tableDesigner.setDatabase(this.database);
          this.renderAll();
          this.autoSave();
        }
      }
    });

    // Export Database Modal / Actions
    document.getElementById('btn-export-database-json')?.addEventListener('click', () => {
      const choice = prompt(`Export Database Options for '${this.database.name}':\n1. Export as SQL Dump (.sql)\n2. Export as JSON (.json)\nEnter 1 or 2:`, '1');
      if (choice === '1') {
        const sql = this.database.dumpSQL();
        const blob = new Blob([sql], { type: 'text/plain;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = (this.database.name || 'database').toLowerCase().replace(/\s+/g, '_') + '_dump.sql';
        a.click();
      } else if (choice === '2') {
        const json = JSON.stringify(this.database.toJSON(), null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = (this.database.name || 'database').toLowerCase().replace(/\s+/g, '_') + '.querylab.json';
        a.click();
      }
    });

    // Import Database (.json or .sql)
    const importInput = document.getElementById('file-import-database');
    document.getElementById('btn-import-database-json')?.addEventListener('click', () => importInput?.click());
    importInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target.result;
        try {
          if (file.name.endsWith('.sql') || !content.trim().startsWith('{')) {
            // Import via SQL execution
            this.runSQL(content);
            alert('Successfully executed imported SQL script.');
          } else {
            // Import JSON
            const parsed = JSON.parse(content);
            if (parsed && parsed.tables) {
              this.database = Database.fromJSON(parsed);
              this.editor.setActiveDatabase(this.database);
              this.tableDesigner.setDatabase(this.database);
              this.renderAll();
              this.autoSave();
              alert(`Successfully imported database '${this.database.name}'.`);
            } else {
              alert('Invalid QueryLab database JSON structure.');
            }
          }
        } catch (err) {
          alert('Failed to import database: ' + err.message);
        }
      };
      reader.readAsText(file);
    });

    // Sidebar Toggle
    document.getElementById('btn-toggle-sidebar')?.addEventListener('click', () => {
      this.toggleSidebar();
    });

    // Shortcuts Modal Trigger
    document.getElementById('btn-open-shortcuts')?.addEventListener('click', () => {
      this.openShortcutsModal();
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    const sidebar = document.getElementById('schema-browser-container');
    if (sidebar) {
      sidebar.classList.toggle('collapsed', !this.isSidebarOpen);
    }
  }

  // --- Tabs Management ---
  setupTabs() {
    document.querySelectorAll('.tab-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setTab(btn.dataset.tab);
      });
    });
  }

  setTab(tabKey) {
    this.activeTab = tabKey;
    document.querySelectorAll('.tab-nav-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tabKey);
    });

    document.querySelectorAll('.workspace-tab-pane').forEach(p => {
      p.classList.toggle('active', p.id === `tab-content-${tabKey}`);
    });

    if (tabKey === 'erd') {
      this.handleResize();
      this.erdViewer.render();
    }
  }

  // --- ERD Floating Controls ---
  setupERDControls() {
    const erdWrap = document.getElementById('tab-content-erd');
    if (!erdWrap) return;

    // Create floating control toolbar on canvas
    const ctrlBar = document.createElement('div');
    ctrlBar.className = 'erd-floating-toolbar';
    ctrlBar.innerHTML = `
      <button class="btn btn-xs btn-secondary" id="btn-erd-zoom-in" title="Zoom In (+)">
        ${getIcon('zoomIn', 'icon-xs')} Zoom In
      </button>
      <button class="btn btn-xs btn-secondary" id="btn-erd-zoom-out" title="Zoom Out (-)">
        ${getIcon('zoomOut', 'icon-xs')} Zoom Out
      </button>
      <button class="btn btn-xs btn-secondary" id="btn-erd-reset" title="Reset View (1:1)">
        ${getIcon('zoomReset', 'icon-xs')} Reset View
      </button>
      <button class="btn btn-xs btn-primary" id="btn-erd-export-png" title="Export ERD Diagram as PNG">
        ${getIcon('image', 'icon-xs')} Export Diagram
      </button>
    `;
    erdWrap.appendChild(ctrlBar);

    ctrlBar.querySelector('#btn-erd-zoom-in')?.addEventListener('click', () => {
      this.erdViewer.setZoom(this.erdViewer.camera.zoom * 1.2);
    });
    ctrlBar.querySelector('#btn-erd-zoom-out')?.addEventListener('click', () => {
      this.erdViewer.setZoom(this.erdViewer.camera.zoom * 0.8);
    });
    ctrlBar.querySelector('#btn-erd-reset')?.addEventListener('click', () => {
      this.erdViewer.resetView();
    });
    ctrlBar.querySelector('#btn-erd-export-png')?.addEventListener('click', () => {
      this.erdViewer.exportAsPNG();
    });
  }

  // --- Resizable Vertical Splitter ---
  setupSplitter() {
    const splitter = document.getElementById('editor-results-splitter');
    const editorPane = document.getElementById('sql-editor-container');
    if (!splitter || !editorPane) return;

    let isDragging = false;
    let startY = 0;
    let startEditorH = 0;

    const onPointerDown = (clientY) => {
      isDragging = true;
      startY = clientY;
      startEditorH = editorPane.offsetHeight;
      document.body.style.cursor = 'row-resize';
    };

    const onPointerMove = (clientY) => {
      if (!isDragging) return;
      const dy = clientY - startY;
      const newH = Math.max(100, Math.min(window.innerHeight - 200, startEditorH + dy));
      editorPane.style.height = `${newH}px`;
      editorPane.style.flex = 'none';
    };

    const onPointerUp = () => {
      if (isDragging) {
        isDragging = false;
        document.body.style.cursor = '';
      }
    };

    splitter.addEventListener('mousedown', (e) => onPointerDown(e.clientY));
    window.addEventListener('mousemove', (e) => onPointerMove(e.clientY));
    window.addEventListener('mouseup', onPointerUp);

    splitter.addEventListener('touchstart', (e) => onPointerDown(e.touches[0].clientY), { passive: true });
    window.addEventListener('touchmove', (e) => onPointerMove(e.touches[0].clientY), { passive: true });
    window.addEventListener('touchend', onPointerUp);
  }

  // --- Global Keyboard Shortcuts ---
  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        this.openShortcutsModal();
      }
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-container.active').forEach(m => m.classList.remove('active'));
      }
    });
  }

  openShortcutsModal() {
    let modal = document.getElementById('shortcuts-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'shortcuts-modal';
      modal.className = 'modal-container';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-backdrop" aria-hidden="true"></div>
      <div class="modal-dialog" style="max-width: 520px;" role="dialog" aria-modal="true" aria-labelledby="shortcuts-modal-title">
        <div class="modal-header flex items-center justify-between p-3 border-b">
          <div class="flex items-center gap-2 font-bold text-sm">
            ${getIcon('keyboard', 'icon-sm text-primary')}
            <span id="shortcuts-modal-title">Keyboard Shortcuts & Commands</span>
          </div>
          <button class="btn-icon-xs btn-modal-close" aria-label="Close">&times;</button>
        </div>
        <div class="modal-body p-4 flex flex-col gap-2.5 font-mono text-xs">
          <div class="flex items-center justify-between py-1 border-b border-muted">
            <span class="text-secondary">Run Query (Selection or Full)</span>
            <kbd class="badge badge-secondary">Ctrl + Enter</kbd>
          </div>
          <div class="flex items-center justify-between py-1 border-b border-muted">
            <span class="text-secondary">Autocomplete Suggestions</span>
            <kbd class="badge badge-secondary">Ctrl + Space</kbd>
          </div>
          <div class="flex items-center justify-between py-1 border-b border-muted">
            <span class="text-secondary">Save Query Snippet</span>
            <kbd class="badge badge-secondary">Ctrl + S</kbd>
          </div>
          <div class="flex items-center justify-between py-1 border-b border-muted">
            <span class="text-secondary">Format & Beautify SQL</span>
            <kbd class="badge badge-secondary">Shift + Alt + F</kbd>
          </div>
          <div class="flex items-center justify-between py-1 border-b border-muted">
            <span class="text-secondary">Indent / Unindent Lines</span>
            <kbd class="badge badge-secondary">Tab / Shift + Tab</kbd>
          </div>
          <div class="flex items-center justify-between py-1 border-b border-muted">
            <span class="text-secondary">Close Modals / Popups</span>
            <kbd class="badge badge-secondary">Esc</kbd>
          </div>
          <div class="flex items-center justify-between py-1">
            <span class="text-secondary">Open Shortcuts Guide</span>
            <kbd class="badge badge-secondary">?</kbd>
          </div>
        </div>
        <div class="modal-footer p-3 border-t flex justify-end">
          <button class="btn btn-sm btn-primary btn-modal-close">Got it</button>
        </div>
      </div>
    `;

    modal.classList.add('active');
    modal.querySelectorAll('.btn-modal-close, .modal-backdrop').forEach(b => {
      b.addEventListener('click', () => modal.classList.remove('active'));
    });
  }

  // --- Snippet Library Management ---
  openSaveSnippetDialog(defaultSQL) {
    const title = prompt('Enter a name for this SQL snippet:', 'Saved Query ' + (this.savedSnippets.length + 1));
    if (!title || !title.trim()) return;

    const snippet = {
      id: 'snip_' + Date.now(),
      title: title.trim(),
      sql: defaultSQL.trim(),
      createdAt: new Date().toLocaleDateString()
    };

    this.savedSnippets.unshift(snippet);
    db.saveSnippet(snippet);
    this.renderSnippets();
    alert(`Saved snippet "${snippet.title}" to your offline library.`);
  }

  renderSnippets() {
    const container = document.getElementById('query-snippets-list');
    if (!container) return;

    if (this.savedSnippets.length === 0) {
      container.innerHTML = `
        <div class="p-8 text-center text-muted font-mono text-xs flex flex-col items-center gap-2">
          ${getIcon('bookmark', 'icon-sm opacity-40')}
          <span>No saved snippets yet. Click "Save" in the SQL editor to bookmark queries.</span>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-bold uppercase text-muted">Saved Query Snippets (${this.savedSnippets.length})</span>
      </div>
      <div class="flex flex-col gap-2">
        ${this.savedSnippets.map((s, idx) => `
          <div class="card p-3 flex flex-col gap-1.5 snippet-entry-row cursor-pointer" data-idx="${idx}">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-primary font-bold text-xs font-mono">${escapeHTML(s.title)}</span>
                <span class="font-mono text-muted" style="font-size: 10px;">${s.createdAt || ''}</span>
              </div>
              <div class="flex items-center gap-1" onclick="event.stopPropagation();">
                <button class="btn-icon-xs text-rose btn-delete-snippet" data-id="${s.id}" title="Delete Snippet">&times;</button>
              </div>
            </div>
            <pre class="font-mono text-xs text-primary p-2 rounded" style="background-color: var(--bg-input); margin: 0; overflow-x: auto; max-height: 80px;">${escapeHTML(s.sql)}</pre>
          </div>
        `).join('')}
      </div>
    `;

    container.querySelectorAll('.snippet-entry-row').forEach(row => {
      row.addEventListener('click', () => {
        const item = this.savedSnippets[parseInt(row.dataset.idx, 10)];
        if (item) {
          this.editor.setValue(item.sql);
          this.setTab('editor');
        }
      });
    });

    container.querySelectorAll('.btn-delete-snippet').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        if (confirm('Delete this saved snippet?')) {
          this.savedSnippets = this.savedSnippets.filter(s => s.id !== id);
          db.deleteSnippet(id);
          this.renderSnippets();
        }
      });
    });
  }

  // --- Panels Rendering ---
  renderSidebar() {
    const container = document.getElementById('schema-browser-container');
    if (!container) return;

    renderSchemaBrowser(container, {
      database: this.database,
      onQuickQuery: (sql) => {
        this.editor.setValue(sql);
        this.runSQL(sql);
      },
      onOpenTableDesigner: () => {
        this.tableDesigner.open();
      },
      onDropTable: (tName) => {
        try {
          this.database.dropTable(tName);
          this.editor.setActiveDatabase(this.database);
          this.renderAll();
          this.autoSave();
        } catch (err) {
          alert(err.message);
        }
      },
      onTruncateTable: (tName) => {
        try {
          const removed = this.database.truncateTable(tName);
          this.renderAll();
          this.autoSave();
          alert(`Truncated table '${tName}' (${removed} rows deleted).`);
        } catch (err) {
          alert(err.message);
        }
      }
    });
  }

  renderResults() {
    const container = document.getElementById('sql-results-container');
    if (!container) return;
    renderResultsGrid(container, this.lastResult, this.lastError);
  }

  renderHistory() {
    const container = document.getElementById('query-history-list');
    if (!container) return;

    const q = this.historySearch.toLowerCase().trim();
    const filteredHistory = this.queryHistory.filter(h => {
      if (this.historyFilter === 'SUCCESS' && !h.success) return false;
      if (this.historyFilter === 'ERROR' && h.success) return false;
      if (q && !h.sql.toLowerCase().includes(q) && !(h.summary || '').toLowerCase().includes(q)) return false;
      return true;
    });

    container.innerHTML = `
      <!-- History Top Controls -->
      <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold uppercase text-muted">Execution History (${filteredHistory.length})</span>
          <div class="flex items-center gap-1">
            <button class="btn btn-xs ${this.historyFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'} btn-hist-filter" data-filter="ALL">All</button>
            <button class="btn btn-xs ${this.historyFilter === 'SUCCESS' ? 'btn-primary' : 'btn-secondary'} btn-hist-filter" data-filter="SUCCESS">Success</button>
            <button class="btn btn-xs ${this.historyFilter === 'ERROR' ? 'btn-primary' : 'btn-secondary'} btn-hist-filter" data-filter="ERROR">Errors</button>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <input 
            type="text" 
            id="input-history-search" 
            class="form-control form-control-sm font-mono text-xs" 
            placeholder="Search history..." 
            value="${escapeHTML(this.historySearch)}"
            style="width: 160px;"
          />
          <button class="btn btn-xs btn-secondary" id="btn-clear-history">
            ${getIcon('trash', 'icon-xs')} Clear Logs
          </button>
        </div>
      </div>

      <!-- History Items -->
      ${filteredHistory.length === 0 ? `
        <div class="p-8 text-center text-muted font-mono text-xs">
          ${q ? `No history matches "${escapeHTML(q)}".` : 'No executed queries yet. Run a query to view execution logs.'}
        </div>
      ` : filteredHistory.map((h, idx) => `
        <div class="card p-3 mb-2 flex flex-col gap-1.5 cursor-pointer history-entry-row" data-idx="${idx}">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="badge ${h.success ? 'badge-success' : 'badge-danger'} font-mono" style="font-size: 9px;">
                ${h.success ? 'SUCCESS' : 'ERROR'}
              </span>
              <span class="font-mono text-xs text-muted">${h.timeStr}</span>
              <span class="font-mono text-xs text-muted">(${h.duration}ms)</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-mono text-xs text-secondary truncate" style="max-width: 250px;">${escapeHTML(h.summary)}</span>
              <button class="btn btn-xs btn-secondary btn-rerun-hist" data-idx="${idx}" title="Load & Execute" onclick="event.stopPropagation();">
                ${getIcon('play', 'icon-xs text-emerald')} Run
              </button>
            </div>
          </div>
          <pre class="font-mono text-xs text-primary p-2 rounded" style="background-color: var(--bg-input); margin: 0; overflow-x: auto; max-height: 80px;">${escapeHTML(h.sql)}</pre>
        </div>
      `).join('')}
    `;

    // History filter handlers
    container.querySelectorAll('.btn-hist-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        this.historyFilter = btn.dataset.filter;
        this.renderHistory();
      });
    });

    const searchInp = container.querySelector('#input-history-search');
    searchInp?.addEventListener('input', (e) => {
      this.historySearch = e.target.value;
      this.renderHistory();
      const newInp = container.querySelector('#input-history-search');
      if (newInp) {
        newInp.focus();
        newInp.selectionStart = newInp.selectionEnd = this.historySearch.length;
      }
    });

    container.querySelector('#btn-clear-history')?.addEventListener('click', () => {
      if (confirm('Clear all query execution history?')) {
        this.queryHistory = [];
        db.clearHistory();
        this.renderHistory();
      }
    });

    container.querySelectorAll('.history-entry-row').forEach(row => {
      row.addEventListener('click', () => {
        const item = filteredHistory[parseInt(row.dataset.idx, 10)];
        if (item) {
          this.editor.setValue(item.sql);
          this.setTab('editor');
        }
      });
    });

    container.querySelectorAll('.btn-rerun-hist').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const item = filteredHistory[parseInt(btn.dataset.idx, 10)];
        if (item) {
          this.editor.setValue(item.sql);
          this.runSQL(item.sql);
        }
      });
    });
  }

  addHistoryEntry(sql, success, duration, summary) {
    const timeStr = new Date().toLocaleTimeString();
    const entry = { sql, success, duration, summary, timeStr, timestamp: Date.now() };
    this.queryHistory.unshift(entry);
    if (this.queryHistory.length > 60) this.queryHistory.pop();
    db.addHistoryLog(entry);
  }

  autoSave() {
    db.saveDatabase(this.database.toJSON());
  }
}

// Bootstrap
function startQueryLab() {
  const app = new QueryLabApp();
  window.queryLabApp = app;
  app.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startQueryLab);
} else {
  startQueryLab();
}
