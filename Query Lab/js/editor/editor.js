/**
 * QueryLab - Code Editor Component
 * Monospaced SQL editor with line numbers, syntax highlighting, autocomplete Intellisense,
 * Tab indentation, selection execution, and query formatting.
 */

import { getIcon, escapeHTML } from '../core/icons.js';
import { QUICK_QUERIES } from './sample-data.js';

export class SQLEditor {
  constructor(container, onExecuteQuery, onSaveSnippet = null) {
    this.container = container;
    this.onExecuteQuery = onExecuteQuery;
    this.onSaveSnippet = onSaveSnippet;
    this.value = QUICK_QUERIES[0].sql;
    this.activeDatabase = null;
    this.autocompleteSuggestions = [];
    this.selectedSuggestionIdx = 0;
    this.isAutocompleteOpen = false;

    this.render();
  }

  setActiveDatabase(database) {
    this.activeDatabase = database;
  }

  getValue() {
    return this.textarea ? this.textarea.value : this.value;
  }

  getSelectedText() {
    if (!this.textarea) return '';
    const start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;
    if (start !== end) {
      return this.textarea.value.substring(start, end);
    }
    return '';
  }

  setValue(newVal) {
    this.value = newVal;
    if (this.textarea) {
      this.textarea.value = newVal;
      this.updateLineNumbers();
      this.updateHighlighting();
      this.updateCursorStatus();
    }
  }

  render() {
    this.container.innerHTML = `
      <!-- Editor Top Action Bar -->
      <div class="editor-header-bar flex items-center justify-between px-3 py-1 border-b">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="badge badge-primary font-mono text-xs">SQL EDITOR</span>
          <select id="select-quick-query" class="form-control form-control-sm font-semibold" style="max-width: 220px;" aria-label="Load Sample Query">
            <option value="">-- Load Sample Query --</option>
            ${QUICK_QUERIES.map((q, idx) => `<option value="${idx}">${escapeHTML(q.name)}</option>`).join('')}
          </select>
        </div>

        <div class="flex items-center gap-1.5 flex-wrap">
          <button class="btn btn-xs btn-secondary" id="btn-save-snippet" title="Save Query to Library (Ctrl+S)">
            ${getIcon('bookmark', 'icon-xs')} Save
          </button>
          <button class="btn btn-xs btn-secondary" id="btn-format-sql" title="Format SQL (Shift+Alt+F)">
            ${getIcon('format', 'icon-xs')} Format
          </button>
          <button class="btn btn-xs btn-secondary" id="btn-copy-sql" title="Copy SQL to Clipboard">
            ${getIcon('copy', 'icon-xs')} Copy
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
        <div class="editor-line-numbers font-mono text-muted select-none" id="editor-gutters" aria-hidden="true">1</div>

        <!-- Syntax Highlight Overlay -->
        <pre class="editor-highlight-overlay font-mono" id="editor-highlight" aria-hidden="true"></pre>

        <!-- Main Editable Textarea -->
        <textarea id="sql-code-input" class="editor-textarea font-mono" spellcheck="false" placeholder="Write your SQL queries here... (e.g. SELECT * FROM customers;)" aria-label="SQL Query Input">${escapeHTML(this.value)}</textarea>

        <!-- Autocomplete Intellisense Popup -->
        <div class="autocomplete-popup" id="editor-autocomplete-popup" style="display: none;"></div>
      </div>

      <!-- Editor Footer Status / Cursor Pos -->
      <div class="editor-footer-bar flex items-center justify-between px-3 py-0.5 border-t text-muted font-mono" style="font-size: 10.5px; height: 20px; background-color: var(--bg-panel);">
        <div class="flex items-center gap-3">
          <span id="cursor-pos-readout">Ln 1, Col 1</span>
          <span id="char-count-readout">${this.value.length} chars</span>
        </div>
        <div class="flex items-center gap-2">
          <span>Autocomplete: <strong>Ctrl+Space</strong></span>
          <span>&bull; Run Selection / All: <strong>Ctrl+Enter</strong></span>
        </div>
      </div>
    `;

    this.textarea = this.container.querySelector('#sql-code-input');
    this.gutter = this.container.querySelector('#editor-gutters');
    this.highlight = this.container.querySelector('#editor-highlight');
    this.autocompletePopup = this.container.querySelector('#editor-autocomplete-popup');
    this.cursorReadout = this.container.querySelector('#cursor-pos-readout');
    this.charCountReadout = this.container.querySelector('#char-count-readout');

    this.initEvents();
    this.updateLineNumbers();
    this.updateHighlighting();
    this.updateCursorStatus();
  }

  initEvents() {
    this.textarea.addEventListener('input', () => {
      this.updateLineNumbers();
      this.updateHighlighting();
      this.updateCursorStatus();
      this.checkAutocomplete();
    });

    this.textarea.addEventListener('scroll', () => {
      this.gutter.scrollTop = this.textarea.scrollTop;
      this.highlight.scrollTop = this.textarea.scrollTop;
      this.highlight.scrollLeft = this.textarea.scrollLeft;
    });

    this.textarea.addEventListener('click', () => {
      this.updateCursorStatus();
      this.closeAutocomplete();
    });

    this.textarea.addEventListener('keyup', (e) => {
      if (!['ArrowUp', 'ArrowDown', 'Enter', 'Escape', 'Tab'].includes(e.key)) {
        this.updateCursorStatus();
      }
    });

    // Keyboard Shortcuts & Navigation
    this.textarea.addEventListener('keydown', (e) => {
      // Autocomplete handling
      if (this.isAutocompleteOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.selectedSuggestionIdx = (this.selectedSuggestionIdx + 1) % this.autocompleteSuggestions.length;
          this.renderAutocomplete();
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.selectedSuggestionIdx = (this.selectedSuggestionIdx - 1 + this.autocompleteSuggestions.length) % this.autocompleteSuggestions.length;
          this.renderAutocomplete();
          return;
        }
        if (e.key === 'Enter' || e.key === 'Tab') {
          e.preventDefault();
          this.applySelectedSuggestion();
          return;
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          this.closeAutocomplete();
          return;
        }
      }

      // Explicit trigger autocomplete: Ctrl+Space
      if ((e.ctrlKey || e.metaKey) && e.key === ' ') {
        e.preventDefault();
        this.openAutocomplete(true);
        return;
      }

      // Save snippet: Ctrl+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (this.onSaveSnippet) this.onSaveSnippet(this.getValue());
        return;
      }

      // Format query: Shift+Alt+F
      if (e.shiftKey && e.altKey && e.key === 'F') {
        e.preventDefault();
        this.formatSQL();
        return;
      }

      // Run Query Shortcut (Ctrl+Enter or Cmd+Enter)
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const selected = this.getSelectedText().trim();
        const toRun = selected || this.getValue();
        if (this.onExecuteQuery) this.onExecuteQuery(toRun);
        return;
      }

      // Tab indentation handling (Insert 2 spaces)
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        const val = this.textarea.value;

        if (e.shiftKey) {
          // Unindent
          const before = val.substring(0, start);
          const after = val.substring(end);
          if (before.endsWith('  ')) {
            this.textarea.value = before.slice(0, -2) + after;
            this.textarea.selectionStart = this.textarea.selectionEnd = start - 2;
          }
        } else {
          // Indent 2 spaces
          this.textarea.value = val.substring(0, start) + '  ' + val.substring(end);
          this.textarea.selectionStart = this.textarea.selectionEnd = start + 2;
        }
        this.updateLineNumbers();
        this.updateHighlighting();
        this.updateCursorStatus();
        return;
      }

      // Enter key auto-indentation
      if (e.key === 'Enter' && !this.isAutocompleteOpen) {
        const start = this.textarea.selectionStart;
        const val = this.textarea.value;
        const lineStart = val.lastIndexOf('\n', start - 1) + 1;
        const currentLine = val.substring(lineStart, start);
        const match = currentLine.match(/^\s+/);
        const indent = match ? match[0] : '';

        if (indent.length > 0) {
          e.preventDefault();
          this.textarea.value = val.substring(0, start) + '\n' + indent + val.substring(start);
          this.textarea.selectionStart = this.textarea.selectionEnd = start + 1 + indent.length;
          this.updateLineNumbers();
          this.updateHighlighting();
          this.updateCursorStatus();
        }
      }
    });

    // Top action buttons
    this.container.querySelector('#btn-run-query')?.addEventListener('click', () => {
      const selected = this.getSelectedText().trim();
      const toRun = selected || this.getValue();
      if (this.onExecuteQuery) this.onExecuteQuery(toRun);
    });

    this.container.querySelector('#btn-save-snippet')?.addEventListener('click', () => {
      if (this.onSaveSnippet) this.onSaveSnippet(this.getValue());
    });

    this.container.querySelector('#btn-format-sql')?.addEventListener('click', () => {
      this.formatSQL();
    });

    this.container.querySelector('#btn-copy-sql')?.addEventListener('click', (e) => {
      const btn = e.currentTarget;
      navigator.clipboard.writeText(this.getValue()).then(() => {
        const oldHTML = btn.innerHTML;
        btn.innerHTML = `${getIcon('check', 'icon-xs text-emerald')} Copied!`;
        setTimeout(() => { btn.innerHTML = oldHTML; }, 1500);
      });
    });

    this.container.querySelector('#btn-clear-sql')?.addEventListener('click', () => {
      this.setValue('');
      this.textarea.focus();
    });

    this.container.querySelector('#select-quick-query')?.addEventListener('change', (e) => {
      const idx = e.target.value;
      if (idx !== '' && QUICK_QUERIES[idx]) {
        this.setValue(QUICK_QUERIES[idx].sql);
        e.target.value = '';
      }
    });
  }

  updateCursorStatus() {
    if (!this.textarea) return;
    const pos = this.textarea.selectionStart || 0;
    const val = this.textarea.value;
    const lines = val.substring(0, pos).split('\n');
    const lineNum = lines.length;
    const colNum = lines[lines.length - 1].length + 1;

    if (this.cursorReadout) this.cursorReadout.textContent = `Ln ${lineNum}, Col ${colNum}`;
    if (this.charCountReadout) this.charCountReadout.textContent = `${val.length} chars`;
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

    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'CROSS', 'ON',
      'GROUP', 'BY', 'HAVING', 'ORDER', 'LIMIT', 'OFFSET', 'AS', 'DISTINCT',
      'ASC', 'DESC', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
      'CREATE', 'TABLE', 'DROP', 'ALTER', 'ADD', 'COLUMN', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES',
      'NOT', 'NULL', 'UNIQUE', 'DEFAULT', 'CHECK', 'AND', 'OR', 'LIKE', 'ILIKE', 'IN', 'BETWEEN', 'IS',
      'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'ROUND', 'COALESCE', 'CONCAT', 'LOWER', 'UPPER', 'LENGTH', 'LEN',
      'TRIM', 'ABS', 'SUBSTR', 'SUBSTRING', 'NOW', 'SHOW', 'TABLES', 'DESCRIBE', 'DESC', 'EXPLAIN', 'TRUNCATE',
      'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'CAST', 'UNION', 'ALL', 'TRUE', 'FALSE',
      'INTEGER', 'TEXT', 'REAL', 'BOOLEAN', 'DATE'
    ];

    let escaped = escapeHTML(code);

    // Comments
    escaped = escaped.replace(/(--.*$)/gm, '<span class="sql-comment">$1</span>');

    // Strings
    escaped = escaped.replace(/(&quot;.*?&quot;|&#039;.*?&#039;|'.*?'|`.*?`)/g, '<span class="sql-string">$1</span>');

    // Keywords
    const kwRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
    escaped = escaped.replace(kwRegex, (match) => `<span class="sql-keyword">${match.toUpperCase()}</span>`);

    // Numbers
    escaped = escaped.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="sql-number">$1</span>');

    return escaped;
  }

  // --- Autocomplete Intellisense System ---
  checkAutocomplete() {
    const pos = this.textarea.selectionStart;
    const text = this.textarea.value.substring(0, pos);
    const wordMatch = text.match(/([a-zA-Z_0-9]+)$/);

    if (!wordMatch || wordMatch[1].length < 2) {
      this.closeAutocomplete();
      return;
    }

    const currentWord = wordMatch[1];
    this.openAutocomplete(false, currentWord);
  }

  openAutocomplete(explicit = false, filterWord = '') {
    const candidates = [];

    // 1. Standard SQL Keywords
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'INNER JOIN', 'LEFT JOIN', 'GROUP BY', 'HAVING', 'ORDER BY',
      'LIMIT', 'DISTINCT', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
      'CREATE TABLE', 'DROP TABLE', 'COUNT()', 'SUM()', 'AVG()', 'MIN()', 'MAX()', 'ROUND()',
      'COALESCE()', 'CONCAT()', 'UPPER()', 'LOWER()', 'BETWEEN', 'LIKE', 'IN', 'IS NULL',
      'CASE WHEN', 'SHOW TABLES', 'DESCRIBE', 'EXPLAIN'
    ];
    keywords.forEach(k => candidates.push({ text: k, type: 'keyword' }));

    // 2. Active Database Schema (Tables & Columns)
    if (this.activeDatabase && this.activeDatabase.tables) {
      for (const table of Object.values(this.activeDatabase.tables)) {
        candidates.push({ text: table.name, type: 'table' });
        for (const col of table.columns) {
          candidates.push({ text: col.name, type: 'column', parent: table.name });
        }
      }
    }

    const query = filterWord.toLowerCase();
    this.autocompleteSuggestions = candidates.filter(c => c.text.toLowerCase().includes(query)).slice(0, 10);

    if (this.autocompleteSuggestions.length === 0) {
      this.closeAutocomplete();
      return;
    }

    this.selectedSuggestionIdx = 0;
    this.isAutocompleteOpen = true;
    this.renderAutocomplete();
  }

  renderAutocomplete() {
    if (!this.autocompletePopup || !this.isAutocompleteOpen) return;

    this.autocompletePopup.style.display = 'block';
    this.autocompletePopup.innerHTML = this.autocompleteSuggestions.map((s, idx) => `
      <div class="autocomplete-item ${idx === this.selectedSuggestionIdx ? 'active' : ''}" data-idx="${idx}">
        <span class="autocomplete-badge badge-${s.type}">${s.type.toUpperCase().substring(0, 3)}</span>
        <span class="autocomplete-label font-mono">${escapeHTML(s.text)}</span>
        ${s.parent ? `<span class="autocomplete-parent text-muted font-mono">(${escapeHTML(s.parent)})</span>` : ''}
      </div>
    `).join('');

    this.autocompletePopup.querySelectorAll('.autocomplete-item').forEach(item => {
      item.addEventListener('mousedown', (e) => {
        e.preventDefault();
        this.selectedSuggestionIdx = parseInt(item.dataset.idx, 10);
        this.applySelectedSuggestion();
      });
    });
  }

  applySelectedSuggestion() {
    const suggestion = this.autocompleteSuggestions[this.selectedSuggestionIdx];
    if (!suggestion) return;

    const pos = this.textarea.selectionStart;
    const val = this.textarea.value;
    const textBefore = val.substring(0, pos);
    const wordMatch = textBefore.match(/([a-zA-Z_0-9]+)$/);
    const replaceLen = wordMatch ? wordMatch[1].length : 0;

    const insertText = suggestion.text;
    const newPos = pos - replaceLen + insertText.length;

    this.textarea.value = val.substring(0, pos - replaceLen) + insertText + val.substring(pos);
    this.textarea.selectionStart = this.textarea.selectionEnd = newPos;

    this.closeAutocomplete();
    this.updateLineNumbers();
    this.updateHighlighting();
    this.updateCursorStatus();
    this.textarea.focus();
  }

  closeAutocomplete() {
    this.isAutocompleteOpen = false;
    if (this.autocompletePopup) {
      this.autocompletePopup.style.display = 'none';
      this.autocompletePopup.innerHTML = '';
    }
  }

  // --- SQL Formatter & Beautifier ---
  formatSQL() {
    let sql = this.getValue().trim();
    if (!sql) return;

    // Standardize newlines before major query clauses
    const majorClauses = [
      'SELECT', 'FROM', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'CROSS JOIN', 'JOIN',
      'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'OFFSET',
      'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'DROP TABLE'
    ];

    majorClauses.forEach(clause => {
      const regex = new RegExp(`\\b${clause}\\b`, 'gi');
      sql = sql.replace(regex, '\n' + clause.toUpperCase() + ' ');
    });

    // Clean multiple consecutive blank lines and trim lines
    const lines = sql.split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    // Indent sub-clauses
    const formatted = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (
        line.startsWith('SELECT') ||
        line.startsWith('FROM') ||
        line.startsWith('WHERE') ||
        line.startsWith('GROUP BY') ||
        line.startsWith('HAVING') ||
        line.startsWith('ORDER BY') ||
        line.startsWith('LIMIT') ||
        line.startsWith('INSERT INTO') ||
        line.startsWith('UPDATE') ||
        line.startsWith('DELETE FROM') ||
        line.startsWith('CREATE TABLE') ||
        line.startsWith('DROP TABLE')
      ) {
        formatted.push(line);
      } else {
        formatted.push('  ' + line);
      }
    }

    this.setValue(formatted.join('\n'));
  }
}
