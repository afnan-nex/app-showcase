/**
 * QueryLab - Code Editor Component
 * Monospaced SQL editor with line numbers, syntax highlighting, autocomplete, and query formatting.
 */

import { getIcon, escapeHTML } from '../core/icons.js';
import { QUICK_QUERIES } from './sample-data.js';

export class SQLEditor {
  constructor(container, onExecuteQuery) {
    this.container = container;
    this.onExecuteQuery = onExecuteQuery;
    this.value = QUICK_QUERIES[0].sql;
    this.render();
  }

  getValue() {
    return this.textarea ? this.textarea.value : this.value;
  }

  setValue(newVal) {
    this.value = newVal;
    if (this.textarea) {
      this.textarea.value = newVal;
      this.updateLineNumbers();
      this.updateHighlighting();
    }
  }

  render() {
    this.container.innerHTML = `
      <!-- Editor Top Action Bar -->
      <div class="editor-header-bar flex items-center justify-between px-3 py-1 border-b">
        <div class="flex items-center gap-2">
          <span class="badge badge-primary font-mono text-xs">SQL EDITOR</span>
          <select id="select-quick-query" class="form-control form-control-sm w-48 font-semibold">
            <option value="">-- Load Sample Query --</option>
            ${QUICK_QUERIES.map((q, idx) => `<option value="${idx}">${q.name}</option>`).join('')}
          </select>
        </div>

        <div class="flex items-center gap-2">
          <button class="btn btn-xs btn-secondary" id="btn-format-sql" title="Format SQL (Indent & Uppercase Keywords)">
            ${getIcon('format', 'icon-xs')} Format
          </button>
          <button class="btn btn-xs btn-secondary" id="btn-clear-sql" title="Clear Editor">
            ${getIcon('trash', 'icon-xs')} Clear
          </button>
          <button class="btn btn-xs btn-primary" id="btn-run-query" title="Execute Query (Ctrl+Enter)">
            ${getIcon('play', 'icon-xs')} Run Query
          </button>
        </div>
      </div>

      <!-- Editor Body with Line Numbers -->
      <div class="editor-textarea-wrapper flex-1 relative flex overflow-hidden">
        <!-- Line Numbers Gutter -->
        <div class="editor-line-numbers font-mono text-muted select-none" id="editor-gutters">1</div>

        <!-- Syntax Highlight Overlay -->
        <pre class="editor-highlight-overlay font-mono" id="editor-highlight" aria-hidden="true"></pre>

        <!-- Main Editable Textarea -->
        <textarea id="sql-code-input" class="editor-textarea font-mono" spellcheck="false" placeholder="Write your SQL queries here... (e.g. SELECT * FROM customers;)">${escapeHTML(this.value)}</textarea>
      </div>
    `;

    this.textarea = this.container.querySelector('#sql-code-input');
    this.gutter = this.container.querySelector('#editor-gutters');
    this.highlight = this.container.querySelector('#editor-highlight');

    this.initEvents();
    this.updateLineNumbers();
    this.updateHighlighting();
  }

  initEvents() {
    this.textarea.addEventListener('input', () => {
      this.updateLineNumbers();
      this.updateHighlighting();
    });

    this.textarea.addEventListener('scroll', () => {
      this.gutter.scrollTop = this.textarea.scrollTop;
      this.highlight.scrollTop = this.textarea.scrollTop;
      this.highlight.scrollLeft = this.textarea.scrollLeft;
    });

    // Run Query Shortcut (Ctrl+Enter or Cmd+Enter)
    this.textarea.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (this.onExecuteQuery) this.onExecuteQuery(this.getValue());
      }
    });

    this.container.querySelector('#btn-run-query')?.addEventListener('click', () => {
      if (this.onExecuteQuery) this.onExecuteQuery(this.getValue());
    });

    this.container.querySelector('#btn-format-sql')?.addEventListener('click', () => {
      this.formatSQL();
    });

    this.container.querySelector('#btn-clear-sql')?.addEventListener('click', () => {
      this.setValue('');
    });

    this.container.querySelector('#select-quick-query')?.addEventListener('change', (e) => {
      const idx = e.target.value;
      if (idx !== '' && QUICK_QUERIES[idx]) {
        this.setValue(QUICK_QUERIES[idx].sql);
      }
    });
  }

  updateLineNumbers() {
    const lines = this.textarea.value.split('\n').length;
    let numbers = '';
    for (let i = 1; i <= lines; i++) numbers += i + '\n';
    this.gutter.textContent = numbers;
  }

  updateHighlighting() {
    const code = this.textarea.value;
    const highlighted = this.highlightSQL(code);
    this.highlight.innerHTML = highlighted + '\n';
  }

  highlightSQL(code) {
    if (!code) return '';

    const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'ON', 'GROUP', 'BY', 'HAVING', 'ORDER', 'LIMIT', 'OFFSET', 'AS', 'DISTINCT', 'ASC', 'DESC', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'DROP', 'ALTER', 'ADD', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'NOT', 'NULL', 'UNIQUE', 'DEFAULT', 'AND', 'OR', 'LIKE', 'IN', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'INTEGER', 'TEXT', 'REAL', 'BOOLEAN', 'DATE'];

    let escaped = escapeHTML(code);

    // Comments
    escaped = escaped.replace(/(--.*$)/gm, '<span class="sql-comment">$1</span>');

    // Strings
    escaped = escaped.replace(/(&quot;.*?&quot;|&#039;.*?&#039;|'.*?'|`.*?`)/g, '<span class="sql-string">$1</span>');

    // Keywords (Regex with word boundaries)
    const kwRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
    escaped = escaped.replace(kwRegex, (match) => `<span class="sql-keyword">${match.toUpperCase()}</span>`);

    // Numbers
    escaped = escaped.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="sql-number">$1</span>');

    return escaped;
  }

  formatSQL() {
    let sql = this.getValue().trim();
    if (!sql) return;

    const keywords = ['SELECT', 'FROM', 'WHERE', 'INNER JOIN', 'LEFT JOIN', 'JOIN', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'OFFSET', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'DROP TABLE'];

    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      sql = sql.replace(regex, '\n' + kw.toUpperCase() + ' ');
    });

    sql = sql.trim().replace(/\n\s*\n/g, '\n');
    this.setValue(sql);
  }
}
