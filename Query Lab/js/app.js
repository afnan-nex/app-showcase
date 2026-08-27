/**
 * QueryLab - Master Application Orchestrator
 * Integrates SQL Lexer, Parser, Evaluator, Schema Browser, Results Grid, ERD Visualizer, and Table Designer.
 */

import { getIcon, escapeHTML } from './core/icons.js';
import { db } from './core/db.js';
import { tokenize } from './engine/lexer.js';
import { SQLParser } from './engine/parser.js';
import { executeQuery } from './engine/evaluator.js';
import { Database } from './engine/database.js';
import { SAMPLE_DATABASES, QUICK_QUERIES } from './editor/sample-data.js';
import { SQLEditor } from './editor/editor.js';
import { renderSchemaBrowser } from './editor/schema-browser.js';
import { renderResultsGrid } from './editor/results-grid.js';
import { ERDViewer } from './editor/erd-viewer.js';
import { TableDesignerModal } from './editor/table-designer.js';

class QueryLabApp {
  constructor() {
    this.activeDatabaseKey = 'shopmart';
    this.database = Database.fromJSON(SAMPLE_DATABASES.shopmart);
    this.activeTab = 'editor'; // 'editor', 'erd', 'history'
    this.queryHistory = [];
    this.lastResult = null;
    this.lastError = null;
  }

  async init() {
    await db.init();

    // Setup Sub-Components
    const editorContainer = document.getElementById('sql-editor-container');
    this.editor = new SQLEditor(editorContainer, (sql) => this.runSQL(sql));

    const erdCanvas = document.getElementById('erd-canvas');
    this.erdViewer = new ERDViewer(erdCanvas);

    const modalContainer = document.getElementById('table-designer-modal-container');
    this.tableDesigner = new TableDesignerModal(modalContainer, (tableDef) => {
      try {
        this.database.createTable(tableDef);
        this.autoSave();
        this.renderAll();
        this.runSQL(`SELECT * FROM ${tableDef.name};`);
      } catch (err) {
        alert('Failed to create table: ' + err.message);
      }
    });

    this.setupTopToolbar();
    this.setupTabs();
    this.setupSplitter();
    this.renderAll();
    this.handleResize();

    window.addEventListener('resize', () => this.handleResize());
  }

  handleResize() {
    const erdWrap = document.getElementById('tab-content-erd');
    if (erdWrap && this.erdViewer.canvas) {
      this.erdViewer.resize(erdWrap.clientWidth, erdWrap.clientHeight);
    }
  }

  renderAll() {
    this.renderSidebar();
    this.renderResults();
    this.erdViewer.setDatabase(this.database);
    this.renderHistory();
  }

  // --- SQL Execution Pipeline ---
  runSQL(sqlText) {
    const sql = sqlText.trim();
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
      this.addHistoryEntry(sql, true, finalRes.executionTimeMs, finalRes.type === 'SELECT' ? `${finalRes.rowCount} rows` : finalRes.message);
      this.autoSave();
    } catch (err) {
      this.lastError = err;
      this.addHistoryEntry(sql, false, 0, err.message);
    }

    // Switch to Editor tab if in ERD / History
    if (this.activeTab !== 'editor') {
      this.setTab('editor');
    }

    this.renderAll();
  }

  // --- Top Toolbar Setup ---
  setupTopToolbar() {
    // Database Switcher
    const dbSelect = document.getElementById('select-active-database');
    dbSelect?.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === '__new__') {
        const name = prompt('Enter new database name:', 'My Custom DB');
        if (name) {
          const newDb = new Database({ name });
          this.database = newDb;
          this.activeDatabaseKey = newDb.id;
          this.renderAll();
          this.autoSave();
        }
      } else if (SAMPLE_DATABASES[val]) {
        this.activeDatabaseKey = val;
        this.database = Database.fromJSON(SAMPLE_DATABASES[val]);
        this.renderAll();
        this.autoSave();
      }
    });

    // Reset Demo Database
    document.getElementById('btn-reset-demo-db')?.addEventListener('click', () => {
      if (confirm('Reset active database to original demo schema and data?')) {
        if (SAMPLE_DATABASES[this.activeDatabaseKey]) {
          this.database = Database.fromJSON(SAMPLE_DATABASES[this.activeDatabaseKey]);
          this.renderAll();
          this.autoSave();
        }
      }
    });

    // Export Database JSON
    document.getElementById('btn-export-database-json')?.addEventListener('click', () => {
      const json = JSON.stringify(this.database.toJSON(), null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (this.database.name || 'database').toLowerCase().replace(/\s+/g, '_') + '.querylab.json';
      a.click();
    });

    // Import Database JSON
    const importInput = document.getElementById('file-import-database');
    document.getElementById('btn-import-database-json')?.addEventListener('click', () => importInput?.click());
    importInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          if (parsed && parsed.tables) {
            this.database = Database.fromJSON(parsed);
            this.renderAll();
            this.autoSave();
          } else {
            alert('Invalid QueryLab database JSON structure.');
          }
        } catch (err) {
          alert('Failed to parse database JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
    });
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

  // --- Resizable Vertical Splitter ---
  setupSplitter() {
    const splitter = document.getElementById('editor-results-splitter');
    const editorPane = document.getElementById('sql-editor-container');
    const resultsPane = document.getElementById('sql-results-container');
    if (!splitter || !editorPane || !resultsPane) return;

    let isDragging = false;
    let startY = 0;
    let startEditorH = 0;

    splitter.addEventListener('mousedown', (e) => {
      isDragging = true;
      startY = e.clientY;
      startEditorH = editorPane.offsetHeight;
      document.body.style.cursor = 'row-resize';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dy = e.clientY - startY;
      const newH = Math.max(120, Math.min(600, startEditorH + dy));
      editorPane.style.height = `${newH}px`;
      editorPane.style.flex = 'none';
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        document.body.style.cursor = '';
      }
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
          this.renderAll();
          this.autoSave();
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

    if (this.queryHistory.length === 0) {
      container.innerHTML = `
        <div class="p-8 text-center text-muted font-mono text-xs">
          No executed queries yet. Run a query from the editor to view execution logs.
        </div>
      `;
      return;
    }

    container.innerHTML = this.queryHistory.map((h, idx) => `
      <div class="card p-3 mb-2 flex flex-col gap-1 cursor-pointer history-entry-row" data-idx="${idx}">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="badge ${h.success ? 'badge-success' : 'badge-danger'} font-mono" style="font-size: 9px;">
              ${h.success ? 'SUCCESS' : 'ERROR'}
            </span>
            <span class="font-mono text-xs text-muted">${h.timeStr}</span>
            <span class="font-mono text-xs text-muted">(${h.duration}ms)</span>
          </div>
          <span class="font-mono text-xs text-secondary">${escapeHTML(h.summary)}</span>
        </div>
        <pre class="font-mono text-xs text-primary p-2 rounded" style="background-color: var(--bg-elevated); margin: 0; overflow-x: auto;">${escapeHTML(h.sql)}</pre>
      </div>
    `).join('');

    container.querySelectorAll('.history-entry-row').forEach(row => {
      row.addEventListener('click', () => {
        const item = this.queryHistory[parseInt(row.dataset.idx, 10)];
        if (item) {
          this.editor.setValue(item.sql);
          this.setTab('editor');
        }
      });
    });
  }

  addHistoryEntry(sql, success, duration, summary) {
    const timeStr = new Date().toLocaleTimeString();
    this.queryHistory.unshift({ sql, success, duration, summary, timeStr });
    if (this.queryHistory.length > 50) this.queryHistory.pop();
    db.addHistoryLog({ sql, success, duration, summary });
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
