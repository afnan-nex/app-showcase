/**
 * QueryLab - Standalone Relational SQL Playground & Database IDE Bundle
 * 100% Client-Side Relational SQL Engine, Zero Server Backend, Works on HTTP & file:///
 */

(function() {
'use strict';


/* --- MODULE: js/core/icons.js --- */
/**
 * QueryLab - Local SVG Icons Registry
 * Crisp database, query editor, ERD, and developer tools icons.
 */

const ICONS = {
  database: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`,
  table: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="12" y1="3" x2="12" y2="21"></line></svg>`,
  column: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>`,
  key: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="5.5"></circle><path d="m21 2-9.6 9.6"></path><path d="m15.5 7.5 3 3L22 7l-3-3"></path></svg>`,
  play: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
  code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
  erd: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="8" height="7" rx="1"></rect><rect x="14" y="3" width="8" height="7" rx="1"></rect><rect x="8" y="14" width="8" height="7" rx="1"></rect><line x1="6" y1="10" x2="6" y2="12"></line><line x1="18" y1="10" x2="18" y2="12"></line><line x1="6" y1="12" x2="18" y2="12"></line><line x1="12" y1="12" x2="12" y2="14"></line></svg>`,
  history: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
  format: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
  upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>`,
  sidebar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>`,
  bookmark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg>`,
  keyboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="6" y1="8" x2="6" y2="8.01"></line><line x1="10" y1="8" x2="10" y2="8.01"></line><line x1="14" y1="8" x2="14" y2="8.01"></line><line x1="18" y1="8" x2="18" y2="8.01"></line><line x1="6" y1="12" x2="6" y2="12.01"></line><line x1="10" y1="12" x2="10" y2="12.01"></line><line x1="14" y1="12" x2="14" y2="12.01"></line><line x1="18" y1="12" x2="18" y2="12.01"></line><line x1="7" y1="16" x2="17" y2="16"></line></svg>`,
  zoomIn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`,
  zoomOut: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`,
  zoomReset: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"></path><path d="M9 21H3v-6"></path><path d="M21 3l-7 7"></path><path d="M3 21l7-7"></path></svg>`,
  image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
  filter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>`,
  sortAsc: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 8 4-4 4 4"></path><path d="M7 4v16"></path><path d="M11 12h10"></path><path d="M11 16h7"></path><path d="M11 20h4"></path><path d="M11 8h13"></path></svg>`,
  sortDesc: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 16 4 4 4-4"></path><path d="M7 20V4"></path><path d="M11 12h10"></path><path d="M11 16h7"></path><path d="M11 20h4"></path><path d="M11 8h13"></path></svg>`,
  chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
  help: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  fileText: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`
};

function getIcon(name, extraClass = '') {
  const svg = ICONS[name] || ICONS.table;
  if (!extraClass) return svg;
  return svg.replace('<svg ', `<svg class="${extraClass}" `);
}

function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

ICONS;


/* --- MODULE: js/core/db.js --- */
/**
 * QueryLab - IndexedDB Persistence Engine
 * Saves custom databases, query execution logs, and saved snippets offline.
 */

const DB_NAME = 'QueryLab_DB';
const DB_VERSION = 2;

class QueryLabDB {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve) => {
      try {
        if (typeof indexedDB === 'undefined') {
          console.warn('IndexedDB not supported, falling back to localStorage');
          resolve(null);
          return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains('databases')) {
            db.createObjectStore('databases', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('history')) {
            db.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
          }
          if (!db.objectStoreNames.contains('snippets')) {
            db.createObjectStore('snippets', { keyPath: 'id' });
          }
        };

        request.onsuccess = (e) => {
          this.db = e.target.result;
          resolve(this.db);
        };

        request.onerror = (e) => {
          console.warn('IndexedDB unavailable, falling back to localStorage', e);
          resolve(null);
        };
      } catch (err) {
        console.warn('IndexedDB init error:', err);
        resolve(null);
      }
    });
  }

  async saveDatabase(databaseJSON) {
    if (!databaseJSON || !databaseJSON.id) return;
    if (!this.db) {
      try {
        localStorage.setItem('querylab_db_' + databaseJSON.id, JSON.stringify(databaseJSON));
      } catch (e) {
        console.warn('localStorage saveDatabase failed:', e);
      }
      return;
    }
    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction('databases', 'readwrite');
        const store = tx.objectStore('databases');
        store.put(databaseJSON);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      } catch (e) {
        resolve();
      }
    });
  }

  async loadDatabase(id) {
    if (!id) return null;
    if (!this.db) {
      try {
        const item = localStorage.getItem('querylab_db_' + id);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        return null;
      }
    }
    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction('databases', 'readonly');
        const store = tx.objectStore('databases');
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      } catch (e) {
        resolve(null);
      }
    });
  }

  async addHistoryLog(log) {
    if (!log) return;
    const entry = { ...log, timestamp: Date.now() };
    if (!this.db) {
      try {
        const list = JSON.parse(localStorage.getItem('querylab_history') || '[]');
        list.unshift(entry);
        if (list.length > 50) list.pop();
        localStorage.setItem('querylab_history', JSON.stringify(list));
      } catch (e) {
        // ignore
      }
      return;
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('history', 'readwrite');
        const store = tx.objectStore('history');
        store.add(entry);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (e) {
        resolve();
      }
    });
  }

  async loadHistory() {
    if (!this.db) {
      try {
        return JSON.parse(localStorage.getItem('querylab_history') || '[]');
      } catch (e) {
        return [];
      }
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('history', 'readonly');
        const store = tx.objectStore('history');
        const req = store.getAll();
        req.onsuccess = () => {
          const list = req.result || [];
          list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          resolve(list.slice(0, 50));
        };
        req.onerror = () => resolve([]);
      } catch (e) {
        resolve([]);
      }
    });
  }

  async clearHistory() {
    if (!this.db) {
      try {
        localStorage.removeItem('querylab_history');
      } catch (e) {}
      return;
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('history', 'readwrite');
        const store = tx.objectStore('history');
        store.clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (e) {
        resolve();
      }
    });
  }

  // Snippets
  async saveSnippet(snippet) {
    if (!snippet || !snippet.id) return;
    if (!this.db) {
      try {
        const list = JSON.parse(localStorage.getItem('querylab_snippets') || '[]');
        const existingIdx = list.findIndex(s => s.id === snippet.id);
        if (existingIdx >= 0) list[existingIdx] = snippet;
        else list.unshift(snippet);
        localStorage.setItem('querylab_snippets', JSON.stringify(list));
      } catch (e) {}
      return;
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('snippets', 'readwrite');
        const store = tx.objectStore('snippets');
        store.put(snippet);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (e) {
        resolve();
      }
    });
  }

  async loadSnippets() {
    if (!this.db) {
      try {
        return JSON.parse(localStorage.getItem('querylab_snippets') || '[]');
      } catch (e) {
        return [];
      }
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('snippets', 'readonly');
        const store = tx.objectStore('snippets');
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      } catch (e) {
        resolve([]);
      }
    });
  }

  async deleteSnippet(id) {
    if (!id) return;
    if (!this.db) {
      try {
        let list = JSON.parse(localStorage.getItem('querylab_snippets') || '[]');
        list = list.filter(s => s.id !== id);
        localStorage.setItem('querylab_snippets', JSON.stringify(list));
      } catch (e) {}
      return;
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('snippets', 'readwrite');
        const store = tx.objectStore('snippets');
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (e) {
        resolve();
      }
    });
  }
}

const db = new QueryLabDB();


/* --- MODULE: js/engine/lexer.js --- */
/**
 * QueryLab - SQL Lexer / Tokenizer
 * Breaks SQL code into typed tokens with position tracking for syntax analysis.
 */

const TOKEN_TYPES = {
  KEYWORD: 'KEYWORD',
  IDENTIFIER: 'IDENTIFIER',
  STRING: 'STRING',
  NUMBER: 'NUMBER',
  OPERATOR: 'OPERATOR',
  PUNCTUATION: 'PUNCTUATION',
  EOF: 'EOF'
};

const SQL_KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'CROSS', 'OUTER', 'ON',
  'GROUP', 'BY', 'HAVING', 'ORDER', 'LIMIT', 'OFFSET', 'AS', 'DISTINCT',
  'ASC', 'DESC', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
  'CREATE', 'TABLE', 'DROP', 'ALTER', 'ADD', 'COLUMN', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES',
  'NOT', 'NULL', 'UNIQUE', 'DEFAULT', 'CHECK', 'AND', 'OR', 'LIKE', 'ILIKE', 'IN', 'BETWEEN', 'IS',
  'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'ROUND', 'COALESCE', 'CONCAT', 'LOWER', 'UPPER', 'LENGTH', 'LEN',
  'TRIM', 'ABS', 'SUBSTR', 'SUBSTRING', 'NOW', 'IF', 'EXISTS', 'INTEGER', 'INT', 'TEXT', 'VARCHAR', 'CHAR',
  'REAL', 'FLOAT', 'DOUBLE', 'NUMERIC', 'DECIMAL', 'BOOLEAN', 'BOOL', 'DATE', 'DATETIME', 'TIMESTAMP',
  'SHOW', 'TABLES', 'DESCRIBE', 'DESC', 'EXPLAIN', 'TRUNCATE', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'CAST',
  'UNION', 'ALL', 'TRUE', 'FALSE'
]);

function tokenize(sql) {
  if (sql === null || sql === undefined) return [{ type: TOKEN_TYPES.EOF, value: '', line: 1, col: 1 }];

  const tokens = [];
  let i = 0;
  let line = 1;
  let col = 1;

  while (i < sql.length) {
    const char = sql[i];

    // Handle newlines
    if (char === '\n') {
      line++;
      col = 1;
      i++;
      continue;
    }

    // Skip whitespace
    if (/\s/.test(char)) {
      col++;
      i++;
      continue;
    }

    // Comments (-- line comment or /* block comment */)
    if (char === '-' && sql[i + 1] === '-') {
      while (i < sql.length && sql[i] !== '\n') {
        i++;
        col++;
      }
      continue;
    }
    if (char === '/' && sql[i + 1] === '*') {
      i += 2;
      col += 2;
      while (i < sql.length && !(sql[i] === '*' && sql[i + 1] === '/')) {
        if (sql[i] === '\n') {
          line++;
          col = 1;
        } else {
          col++;
        }
        i++;
      }
      i += 2;
      col += 2;
      continue;
    }

    // String Literal ('...' or "...")
    if (char === "'" || char === '"') {
      const quote = char;
      const startLine = line;
      const startCol = col;
      let strVal = '';
      i++;
      col++;

      while (i < sql.length) {
        if (sql[i] === quote) {
          // Check for escaped quote ('')
          if (sql[i + 1] === quote) {
            strVal += quote;
            i += 2;
            col += 2;
            continue;
          }
          break; // Closing quote
        }
        if (sql[i] === '\\' && i + 1 < sql.length) {
          strVal += sql[i + 1];
          i += 2;
          col += 2;
        } else {
          if (sql[i] === '\n') {
            line++;
            col = 1;
          } else {
            col++;
          }
          strVal += sql[i];
          i++;
        }
      }

      if (i >= sql.length) {
        throw new Error(`Unterminated string literal starting at line ${startLine}, col ${startCol}`);
      }
      i++;
      col++; // Skip closing quote
      tokens.push({ type: TOKEN_TYPES.STRING, value: strVal, line: startLine, col: startCol });
      continue;
    }

    // Numbers (integers and decimals)
    if (/[0-9]/.test(char) || (char === '.' && /[0-9]/.test(sql[i + 1]))) {
      const startCol = col;
      let numStr = '';
      let hasDot = false;

      while (i < sql.length && (/[0-9]/.test(sql[i]) || (sql[i] === '.' && !hasDot && /[0-9]/.test(sql[i + 1])))) {
        if (sql[i] === '.') hasDot = true;
        numStr += sql[i];
        i++;
        col++;
      }

      tokens.push({
        type: TOKEN_TYPES.NUMBER,
        value: Number(numStr),
        raw: numStr,
        line,
        col: startCol
      });
      continue;
    }

    // Identifiers & Keywords (supports backticks `name` and brackets [name])
    if (/[a-zA-Z_]/.test(char) || char === '`' || char === '[') {
      const startCol = col;
      let idStr = '';

      if (char === '`' || char === '[') {
        const closeChar = char === '`' ? '`' : ']';
        i++;
        col++;
        while (i < sql.length && sql[i] !== closeChar) {
          if (sql[i] === '\n') { line++; col = 1; } else { col++; }
          idStr += sql[i];
          i++;
        }
        if (i < sql.length) { i++; col++; }
        tokens.push({ type: TOKEN_TYPES.IDENTIFIER, value: idStr, line, col: startCol });
      } else {
        while (i < sql.length && /[a-zA-Z0-9_]/.test(sql[i])) {
          idStr += sql[i];
          i++;
          col++;
        }
        const upper = idStr.toUpperCase();
        if (SQL_KEYWORDS.has(upper)) {
          tokens.push({ type: TOKEN_TYPES.KEYWORD, value: upper, line, col: startCol });
        } else {
          tokens.push({ type: TOKEN_TYPES.IDENTIFIER, value: idStr, line, col: startCol });
        }
      }
      continue;
    }

    // Two-character operators (!=, <>, <=, >=, ||)
    const twoChar = sql.substr(i, 2);
    if (['!=', '<>', '<=', '>=', '||'].includes(twoChar)) {
      tokens.push({
        type: TOKEN_TYPES.OPERATOR,
        value: twoChar === '<>' ? '!=' : twoChar,
        line,
        col
      });
      i += 2;
      col += 2;
      continue;
    }

    // Single-character operators & punctuation
    if (['=', '<', '>', '+', '-', '*', '/', '%'].includes(char)) {
      tokens.push({ type: TOKEN_TYPES.OPERATOR, value: char, line, col });
      i++;
      col++;
      continue;
    }

    if ([',', '(', ')', ';', '.'].includes(char)) {
      tokens.push({ type: TOKEN_TYPES.PUNCTUATION, value: char, line, col });
      i++;
      col++;
      continue;
    }

    // Unknown character
    throw new Error(`Unexpected character '${char}' at line ${line}, col ${col}`);
  }

  tokens.push({ type: TOKEN_TYPES.EOF, value: '', line, col });
  return tokens;
}


/* --- MODULE: js/engine/parser.js --- */
/**
 * QueryLab - SQL AST Parser
 * Recursive descent parser generating executable AST statements from SQL tokens.
 */



class SQLParser {
  constructor(tokens) {
    this.tokens = tokens || [];
    this.pos = 0;
  }

  current() {
    return this.tokens[this.pos] || { type: TOKEN_TYPES.EOF, value: '' };
  }

  peek(offset = 1) {
    return this.tokens[this.pos + offset] || { type: TOKEN_TYPES.EOF, value: '' };
  }

  advance() {
    const t = this.current();
    this.pos++;
    return t;
  }

  matchKeyword(keyword) {
    const t = this.current();
    if (t.type === TOKEN_TYPES.KEYWORD && t.value === keyword.toUpperCase()) {
      this.advance();
      return true;
    }
    return false;
  }

  expectKeyword(keyword) {
    const t = this.current();
    if (t.type !== TOKEN_TYPES.KEYWORD || t.value !== keyword.toUpperCase()) {
      throw new Error(`Expected '${keyword}' at line ${t.line || 1}, col ${t.col || 1}, got '${t.value}'`);
    }
    return this.advance();
  }

  expectPunctuation(char) {
    const t = this.current();
    if (t.type !== TOKEN_TYPES.PUNCTUATION || t.value !== char) {
      throw new Error(`Expected '${char}' at line ${t.line || 1}, col ${t.col || 1}, got '${t.value}'`);
    }
    return this.advance();
  }

  expectIdentifierOrKeyword() {
    const t = this.current();
    if (t.type === TOKEN_TYPES.IDENTIFIER || t.type === TOKEN_TYPES.KEYWORD) {
      return this.advance().value;
    }
    throw new Error(`Expected identifier name at line ${t.line || 1}, col ${t.col || 1}, got '${t.value}'`);
  }

  // --- Parse Statements Dispatcher ---
  parse() {
    const statements = [];
    while (this.current().type !== TOKEN_TYPES.EOF) {
      // Skip extra semicolons
      if (this.current().type === TOKEN_TYPES.PUNCTUATION && this.current().value === ';') {
        this.advance();
        continue;
      }

      const stmt = this.parseStatement();
      if (stmt) statements.push(stmt);

      if (this.current().type === TOKEN_TYPES.PUNCTUATION && this.current().value === ';') {
        this.advance();
      }
    }
    return statements;
  }

  parseStatement() {
    const t = this.current();
    if (t.type === TOKEN_TYPES.EOF) return null;

    if (t.type !== TOKEN_TYPES.KEYWORD) {
      throw new Error(`Expected SQL statement keyword at line ${t.line || 1}, col ${t.col || 1}, got '${t.value}'`);
    }

    switch (t.value) {
      case 'SELECT':
        return this.parseSelect();
      case 'INSERT':
        return this.parseInsert();
      case 'UPDATE':
        return this.parseUpdate();
      case 'DELETE':
        return this.parseDelete();
      case 'CREATE':
        return this.parseCreate();
      case 'DROP':
        return this.parseDrop();
      case 'ALTER':
        return this.parseAlter();
      case 'TRUNCATE':
        return this.parseTruncate();
      case 'SHOW':
        return this.parseShow();
      case 'DESCRIBE':
      case 'DESC':
        return this.parseDescribe();
      case 'EXPLAIN':
        return this.parseExplain();
      default:
        throw new Error(`Unsupported SQL command '${t.value}' at line ${t.line || 1}, col ${t.col || 1}`);
    }
  }

  // --- 1. SELECT Statement ---
  parseSelect() {
    this.expectKeyword('SELECT');
    const distinct = this.matchKeyword('DISTINCT');

    // Column list
    const columns = [];
    while (true) {
      const expr = this.parseExpression();
      let alias = null;
      if (this.matchKeyword('AS')) {
        alias = this.expectIdentifierOrKeyword();
      } else if (
        this.current().type === TOKEN_TYPES.IDENTIFIER &&
        !['FROM', 'WHERE', 'JOIN', 'GROUP', 'ORDER', 'LIMIT', 'HAVING', 'UNION'].includes(this.current().value.toUpperCase())
      ) {
        alias = this.advance().value;
      }
      columns.push({ expr, alias });

      if (this.current().type === TOKEN_TYPES.PUNCTUATION && this.current().value === ',') {
        this.advance();
      } else {
        break;
      }
    }

    // FROM clause (optional for standalone expressions like SELECT 1+1)
    let from = null;
    if (this.matchKeyword('FROM')) {
      const tableName = this.expectIdentifierOrKeyword();
      let tableAlias = null;
      if (this.matchKeyword('AS')) {
        tableAlias = this.expectIdentifierOrKeyword();
      } else if (
        this.current().type === TOKEN_TYPES.IDENTIFIER &&
        !['WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'CROSS', 'GROUP', 'ORDER', 'LIMIT', 'HAVING', 'UNION'].includes(this.current().value.toUpperCase())
      ) {
        tableAlias = this.advance().value;
      }
      from = { table: tableName, alias: tableAlias || tableName };
    }

    // JOIN clauses (INNER, LEFT, RIGHT, CROSS, plain JOIN)
    const joins = [];
    while (
      this.matchKeyword('JOIN') ||
      this.matchKeyword('INNER') ||
      this.matchKeyword('LEFT') ||
      this.matchKeyword('RIGHT') ||
      this.matchKeyword('CROSS')
    ) {
      let joinType = 'INNER';
      const prevVal = this.tokens[this.pos - 1].value.toUpperCase();

      if (prevVal === 'LEFT') {
        this.matchKeyword('OUTER');
        this.matchKeyword('JOIN');
        joinType = 'LEFT';
      } else if (prevVal === 'RIGHT') {
        this.matchKeyword('OUTER');
        this.matchKeyword('JOIN');
        joinType = 'RIGHT';
      } else if (prevVal === 'CROSS') {
        this.matchKeyword('JOIN');
        joinType = 'CROSS';
      } else if (prevVal === 'INNER') {
        this.expectKeyword('JOIN');
        joinType = 'INNER';
      }

      const joinTable = this.expectIdentifierOrKeyword();
      let joinAlias = null;
      if (this.matchKeyword('AS')) {
        joinAlias = this.expectIdentifierOrKeyword();
      } else if (
        this.current().type === TOKEN_TYPES.IDENTIFIER &&
        this.current().value.toUpperCase() !== 'ON' &&
        this.current().value.toUpperCase() !== 'WHERE'
      ) {
        joinAlias = this.advance().value;
      }

      let onCond = null;
      if (joinType !== 'CROSS') {
        this.expectKeyword('ON');
        onCond = this.parseExpression();
      }

      joins.push({
        type: joinType,
        table: joinTable,
        alias: joinAlias || joinTable,
        on: onCond
      });
    }

    // WHERE clause
    let where = null;
    if (this.matchKeyword('WHERE')) {
      where = this.parseExpression();
    }

    // GROUP BY clause
    let groupBy = null;
    if (this.matchKeyword('GROUP')) {
      this.expectKeyword('BY');
      groupBy = [];
      while (true) {
        groupBy.push(this.parseExpression());
        if (this.current().type === TOKEN_TYPES.PUNCTUATION && this.current().value === ',') {
          this.advance();
        } else {
          break;
        }
      }
    }

    // HAVING clause
    let having = null;
    if (this.matchKeyword('HAVING')) {
      having = this.parseExpression();
    }

    // ORDER BY clause
    let orderBy = null;
    if (this.matchKeyword('ORDER')) {
      this.expectKeyword('BY');
      orderBy = [];
      while (true) {
        const expr = this.parseExpression();
        let dir = 'ASC';
        if (this.matchKeyword('DESC')) dir = 'DESC';
        else if (this.matchKeyword('ASC')) dir = 'ASC';
        orderBy.push({ expr, dir });

        if (this.current().type === TOKEN_TYPES.PUNCTUATION && this.current().value === ',') {
          this.advance();
        } else {
          break;
        }
      }
    }

    // LIMIT clause
    let limit = null;
    let offset = 0;
    if (this.matchKeyword('LIMIT')) {
      const limTok = this.advance();
      limit = Number(limTok.value);

      if (this.matchKeyword('OFFSET')) {
        offset = Number(this.advance().value);
      }
    } else if (this.matchKeyword('OFFSET')) {
      offset = Number(this.advance().value);
    }

    return {
      type: 'SELECT',
      distinct,
      columns,
      from,
      joins,
      where,
      groupBy,
      having,
      orderBy,
      limit,
      offset
    };
  }

  // --- 2. INSERT INTO Statement ---
  parseInsert() {
    this.expectKeyword('INSERT');
    this.expectKeyword('INTO');
    const table = this.expectIdentifierOrKeyword();

    let columns = null;
    if (this.current().type === TOKEN_TYPES.PUNCTUATION && this.current().value === '(') {
      this.advance();
      columns = [];
      while (true) {
        columns.push(this.expectIdentifierOrKeyword());
        if (this.current().type === TOKEN_TYPES.PUNCTUATION && this.current().value === ',') {
          this.advance();
        } else {
          break;
        }
      }
      this.expectPunctuation(')');
    }

    this.expectKeyword('VALUES');
    const values = [];

    while (true) {
      this.expectPunctuation('(');
      const rowVals = [];
      while (true) {
        rowVals.push(this.parseExpression());
        if (this.current().type === TOKEN_TYPES.PUNCTUATION && this.current().value === ',') {
          this.advance();
        } else {
          break;
        }
      }
      this.expectPunctuation(')');
      values.push(rowVals);

      if (this.current().type === TOKEN_TYPES.PUNCTUATION && this.current().value === ',') {
        this.advance();
      } else {
        break;
      }
    }

    return { type: 'INSERT', table, columns, values };
  }

  // --- 3. UPDATE Statement ---
  parseUpdate() {
    this.expectKeyword('UPDATE');
    const table = this.expectIdentifierOrKeyword();
    this.expectKeyword('SET');

    const assignments = [];
    while (true) {
      const col = this.expectIdentifierOrKeyword();
      this.advance(); // '='
      const expr = this.parseExpression();
      assignments.push({ column: col, expr });

      if (this.current().type === TOKEN_TYPES.PUNCTUATION && this.current().value === ',') {
        this.advance();
      } else {
        break;
      }
    }

    let where = null;
    if (this.matchKeyword('WHERE')) {
      where = this.parseExpression();
    }

    return { type: 'UPDATE', table, assignments, where };
  }

  // --- 4. DELETE FROM Statement ---
  parseDelete() {
    this.expectKeyword('DELETE');
    this.expectKeyword('FROM');
    const table = this.expectIdentifierOrKeyword();

    let where = null;
    if (this.matchKeyword('WHERE')) {
      where = this.parseExpression();
    }

    return { type: 'DELETE', table, where };
  }

  // --- 5. CREATE TABLE Statement ---
  parseCreate() {
    this.expectKeyword('CREATE');
    this.expectKeyword('TABLE');
    const ifNotExists = this.matchKeyword('IF') && this.expectKeyword('NOT') && this.expectKeyword('EXISTS');
    const table = this.expectIdentifierOrKeyword();

    this.expectPunctuation('(');
    const columns = [];
    const foreignKeys = [];

    while (true) {
      // Check for FOREIGN KEY (col) REFERENCES refTable(refCol)
      if (this.matchKeyword('FOREIGN')) {
        this.expectKeyword('KEY');
        this.expectPunctuation('(');
        const fkCol = this.expectIdentifierOrKeyword();
        this.expectPunctuation(')');
        this.expectKeyword('REFERENCES');
        const refTab = this.expectIdentifierOrKeyword();
        this.expectPunctuation('(');
        const refCol = this.expectIdentifierOrKeyword();
        this.expectPunctuation(')');
        foreignKeys.push({ column: fkCol, refTable: refTab, refColumn: refCol });
      } else {
        const colName = this.expectIdentifierOrKeyword();
        const colType = this.expectIdentifierOrKeyword().toUpperCase();

        let isPrimaryKey = false;
        let isNotNull = false;
        let isUnique = false;
        let defaultValue = null;

        while (this.current().type === TOKEN_TYPES.KEYWORD && !['FOREIGN', ')', ','].includes(this.current().value)) {
          if (this.matchKeyword('PRIMARY')) {
            this.expectKeyword('KEY');
            isPrimaryKey = true;
          } else if (this.matchKeyword('NOT')) {
            this.expectKeyword('NULL');
            isNotNull = true;
          } else if (this.matchKeyword('UNIQUE')) {
            isUnique = true;
          } else if (this.matchKeyword('DEFAULT')) {
            const defTok = this.advance();
            defaultValue = defTok.value;
          } else {
            this.advance();
          }
        }

        columns.push({
          name: colName,
          type: colType,
          isPrimaryKey,
          isNotNull,
          isUnique,
          defaultValue
        });
      }

      if (this.current().type === TOKEN_TYPES.PUNCTUATION && this.current().value === ',') {
        this.advance();
      } else {
        break;
      }
    }
    this.expectPunctuation(')');

    return { type: 'CREATE_TABLE', table, ifNotExists, columns, foreignKeys };
  }

  // --- 6. DROP TABLE Statement ---
  parseDrop() {
    this.expectKeyword('DROP');
    this.expectKeyword('TABLE');
    const ifExists = this.matchKeyword('IF') && this.expectKeyword('EXISTS');
    const table = this.expectIdentifierOrKeyword();
    return { type: 'DROP_TABLE', table, ifExists };
  }

  // --- 7. ALTER TABLE Statement ---
  parseAlter() {
    this.expectKeyword('ALTER');
    this.expectKeyword('TABLE');
    const table = this.expectIdentifierOrKeyword();

    if (this.matchKeyword('ADD')) {
      this.matchKeyword('COLUMN');
      const colName = this.expectIdentifierOrKeyword();
      const colType = this.expectIdentifierOrKeyword().toUpperCase();
      return { type: 'ALTER_TABLE', table, action: 'ADD_COLUMN', column: { name: colName, type: colType } };
    } else if (this.matchKeyword('DROP')) {
      this.matchKeyword('COLUMN');
      const colName = this.expectIdentifierOrKeyword();
      return { type: 'ALTER_TABLE', table, action: 'DROP_COLUMN', columnName: colName };
    }
    throw new Error(`Unsupported ALTER TABLE operation near '${this.current().value}'`);
  }

  // --- 8. TRUNCATE TABLE Statement ---
  parseTruncate() {
    this.expectKeyword('TRUNCATE');
    this.matchKeyword('TABLE');
    const table = this.expectIdentifierOrKeyword();
    return { type: 'TRUNCATE_TABLE', table };
  }

  // --- 9. SHOW TABLES Statement ---
  parseShow() {
    this.expectKeyword('SHOW');
    this.expectKeyword('TABLES');
    return { type: 'SHOW_TABLES' };
  }

  // --- 10. DESCRIBE / DESC Statement ---
  parseDescribe() {
    if (this.matchKeyword('DESCRIBE') || this.matchKeyword('DESC')) {
      this.matchKeyword('TABLE');
      const table = this.expectIdentifierOrKeyword();
      return { type: 'DESCRIBE_TABLE', table };
    }
    throw new Error('Expected DESCRIBE statement');
  }

  // --- 11. EXPLAIN Statement ---
  parseExplain() {
    this.expectKeyword('EXPLAIN');
    const innerStmt = this.parseStatement();
    return { type: 'EXPLAIN', innerStatement: innerStmt };
  }

  // --- Expression Parser ---
  parseExpression() {
    return this.parseOr();
  }

  parseOr() {
    let left = this.parseAnd();
    while (this.matchKeyword('OR')) {
      const right = this.parseAnd();
      left = { type: 'BINARY_OP', op: 'OR', left, right };
    }
    return left;
  }

  parseAnd() {
    let left = this.parseComparison();
    while (this.matchKeyword('AND')) {
      const right = this.parseComparison();
      left = { type: 'BINARY_OP', op: 'AND', left, right };
    }
    return left;
  }

  parseComparison() {
    let left = this.parseAdditive();

    // NOT BETWEEN, NOT LIKE, NOT IN
    let isNegated = false;
    if (this.matchKeyword('NOT')) {
      isNegated = true;
    }

    // BETWEEN a AND b
    if (this.matchKeyword('BETWEEN')) {
      const low = this.parseAdditive();
      this.expectKeyword('AND');
      const high = this.parseAdditive();
      return { type: 'BETWEEN', expr: left, low, high, not: isNegated };
    }

    // LIKE / ILIKE
    if (this.matchKeyword('LIKE') || this.matchKeyword('ILIKE')) {
      const right = this.parseAdditive();
      const node = { type: 'BINARY_OP', op: 'LIKE', left, right };
      return isNegated ? { type: 'UNARY_OP', op: 'NOT', expr: node } : node;
    }

    // IS NULL / IS NOT NULL
    if (this.matchKeyword('IS')) {
      const isNot = this.matchKeyword('NOT');
      this.expectKeyword('NULL');
      return { type: 'IS_NULL', expr: left, not: isNot };
    }

    // IN (val1, val2, ...)
    if (this.matchKeyword('IN')) {
      this.expectPunctuation('(');
      const list = [];
      while (true) {
        list.push(this.parseExpression());
        if (this.current().type === TOKEN_TYPES.PUNCTUATION && this.current().value === ',') {
          this.advance();
        } else {
          break;
        }
      }
      this.expectPunctuation(')');
      return { type: 'IN', expr: left, list, not: isNegated };
    }

    if (isNegated) {
      left = { type: 'UNARY_OP', op: 'NOT', expr: left };
    }

    // Binary comparison operators
    if (
      this.current().type === TOKEN_TYPES.OPERATOR &&
      ['=', '!=', '<', '<=', '>', '>='].includes(this.current().value)
    ) {
      const op = this.advance().value;
      const right = this.parseAdditive();
      return { type: 'BINARY_OP', op, left, right };
    }

    return left;
  }

  parseAdditive() {
    let left = this.parseMultiplicative();
    while (
      this.current().type === TOKEN_TYPES.OPERATOR &&
      ['+', '-', '||'].includes(this.current().value)
    ) {
      const op = this.advance().value;
      const right = this.parseMultiplicative();
      left = { type: 'BINARY_OP', op, left, right };
    }
    return left;
  }

  parseMultiplicative() {
    let left = this.parsePrimary();
    while (
      this.current().type === TOKEN_TYPES.OPERATOR &&
      ['*', '/', '%'].includes(this.current().value)
    ) {
      const op = this.advance().value;
      const right = this.parsePrimary();
      left = { type: 'BINARY_OP', op, left, right };
    }
    return left;
  }

  parsePrimary() {
    const t = this.current();

    // Wildcard *
    if (t.type === TOKEN_TYPES.OPERATOR && t.value === '*') {
      this.advance();
      return { type: 'WILDCARD' };
    }

    // CASE WHEN ... THEN ... ELSE ... END
    if (t.type === TOKEN_TYPES.KEYWORD && t.value === 'CASE') {
      this.advance();
      const cases = [];
      while (this.matchKeyword('WHEN')) {
        const cond = this.parseExpression();
        this.expectKeyword('THEN');
        const res = this.parseExpression();
        cases.push({ when: cond, then: res });
      }

      let elseExpr = null;
      if (this.matchKeyword('ELSE')) {
        elseExpr = this.parseExpression();
      }

      this.expectKeyword('END');
      return { type: 'CASE_EXPR', cases, elseExpr };
    }

    // Parentheses (expr)
    if (t.type === TOKEN_TYPES.PUNCTUATION && t.value === '(') {
      this.advance();
      const expr = this.parseExpression();
      this.expectPunctuation(')');
      return expr;
    }

    // String Literal
    if (t.type === TOKEN_TYPES.STRING) {
      this.advance();
      return { type: 'LITERAL', value: t.value, rawType: 'STRING' };
    }

    // Number Literal
    if (t.type === TOKEN_TYPES.NUMBER) {
      this.advance();
      return { type: 'LITERAL', value: t.value, rawType: 'NUMBER' };
    }

    // Boolean / Null Literals
    if (t.type === TOKEN_TYPES.KEYWORD && (t.value === 'TRUE' || t.value === 'FALSE')) {
      this.advance();
      return { type: 'LITERAL', value: t.value === 'TRUE', rawType: 'BOOLEAN' };
    }
    if (t.type === TOKEN_TYPES.KEYWORD && t.value === 'NULL') {
      this.advance();
      return { type: 'LITERAL', value: null, rawType: 'NULL' };
    }

    // Functions (Aggregates & Scalars)
    const knownFunctions = new Set([
      'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'ROUND', 'COALESCE', 'CONCAT', 'LOWER', 'UPPER',
      'LENGTH', 'LEN', 'TRIM', 'ABS', 'SUBSTR', 'SUBSTRING', 'NOW', 'CAST'
    ]);

    if (
      (t.type === TOKEN_TYPES.KEYWORD || t.type === TOKEN_TYPES.IDENTIFIER) &&
      this.peek().type === TOKEN_TYPES.PUNCTUATION &&
      this.peek().value === '('
    ) {
      const funcName = this.advance().value.toUpperCase();
      this.expectPunctuation('(');

      const isAggregate = ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX'].includes(funcName);
      const isDistinct = isAggregate && this.matchKeyword('DISTINCT');

      const args = [];
      if (!(this.current().type === TOKEN_TYPES.PUNCTUATION && this.current().value === ')')) {
        while (true) {
          if (this.current().type === TOKEN_TYPES.OPERATOR && this.current().value === '*') {
            this.advance();
            args.push({ type: 'WILDCARD' });
          } else {
            args.push(this.parseExpression());
          }

          if (this.current().type === TOKEN_TYPES.PUNCTUATION && this.current().value === ',') {
            this.advance();
          } else {
            break;
          }
        }
      }
      this.expectPunctuation(')');

      if (isAggregate) {
        return {
          type: 'AGGREGATE',
          func: funcName,
          arg: args[0] || { type: 'WILDCARD' },
          isDistinct
        };
      } else {
        return {
          type: 'FUNCTION_CALL',
          func: funcName,
          args
        };
      }
    }

    // Column / Table.Column Identifier
    if (t.type === TOKEN_TYPES.IDENTIFIER || t.type === TOKEN_TYPES.KEYWORD) {
      const first = this.advance().value;
      if (this.current().type === TOKEN_TYPES.PUNCTUATION && this.current().value === '.') {
        this.advance();
        const second = this.current().value === '*' ? (this.advance(), '*') : this.expectIdentifierOrKeyword();
        return { type: 'COLUMN', table: first, column: second };
      }
      return { type: 'COLUMN', column: first };
    }

    throw new Error(`Unexpected token '${t.value}' at line ${t.line || 1}, col ${t.col || 1}`);
  }
}


/* --- MODULE: js/engine/database.js --- */
/**
 * QueryLab - Relational Database State & Memory Storage
 * Manages databases, tables, columns, constraints, foreign keys, and rows in memory.
 */

class Table {
  constructor({ name, columns = [], rows = [], foreignKeys = [] }) {
    this.name = name;
    this.columns = columns; // [{ name, type, isPrimaryKey, isNotNull, isUnique, defaultValue }]
    this.rows = rows;       // Array of row records { col1: val1, col2: val2 }
    this.foreignKeys = foreignKeys; // [{ column, refTable, refColumn }]
  }

  getColumn(colName) {
    if (!colName) return null;
    return this.columns.find(c => c.name.toLowerCase() === colName.toLowerCase()) || null;
  }

  insertRow(rowObj) {
    // Validate types and constraints
    const row = {};
    for (const col of this.columns) {
      let val = rowObj[col.name] !== undefined ? rowObj[col.name] : col.defaultValue;

      if (val === undefined || val === null || val === '') {
        if (col.defaultValue !== undefined && col.defaultValue !== null && col.defaultValue !== '') {
          val = this.castValue(col.defaultValue, col.type);
        } else if (col.isNotNull && !col.isPrimaryKey) {
          throw new Error(`Column '${col.name}' cannot be NULL in table '${this.name}'`);
        } else {
          val = null;
        }
      } else {
        val = this.castValue(val, col.type);
      }

      // Check Unique / Primary Key
      if ((col.isPrimaryKey || col.isUnique) && val !== null) {
        const exists = this.rows.some(r => r[col.name] === val);
        if (exists) {
          throw new Error(`Duplicate value '${val}' for unique/primary key column '${col.name}' in table '${this.name}'`);
        }
      }

      row[col.name] = val;
    }

    this.rows.push(row);
    return row;
  }

  castValue(val, type) {
    if (val === null || val === undefined) return null;
    const upperType = (type || 'TEXT').toUpperCase();

    if (upperType === 'INTEGER' || upperType === 'INT') {
      const num = parseInt(val, 10);
      return isNaN(num) ? 0 : num;
    }
    if (upperType === 'REAL' || upperType === 'FLOAT' || upperType === 'DOUBLE' || upperType === 'NUMERIC' || upperType === 'DECIMAL') {
      const num = parseFloat(val);
      return isNaN(num) ? 0.0 : num;
    }
    if (upperType === 'BOOLEAN' || upperType === 'BOOL') {
      if (typeof val === 'boolean') return val;
      const s = String(val).trim().toLowerCase();
      return s === 'true' || s === '1' || s === 't';
    }
    return String(val);
  }

  truncate() {
    const count = this.rows.length;
    this.rows = [];
    return count;
  }

  toSQLDDL() {
    const colDefs = this.columns.map(c => {
      let def = `  ${c.name} ${c.type || 'TEXT'}`;
      if (c.isPrimaryKey) def += ' PRIMARY KEY';
      if (c.isNotNull) def += ' NOT NULL';
      if (c.isUnique && !c.isPrimaryKey) def += ' UNIQUE';
      if (c.defaultValue !== undefined && c.defaultValue !== null && c.defaultValue !== '') {
        const isNum = !isNaN(Number(c.defaultValue)) && typeof c.defaultValue !== 'boolean';
        def += ` DEFAULT ${isNum ? c.defaultValue : `'${c.defaultValue}'`}`;
      }
      return def;
    });

    if (this.foreignKeys && this.foreignKeys.length > 0) {
      for (const fk of this.foreignKeys) {
        colDefs.push(`  FOREIGN KEY (${fk.column}) REFERENCES ${fk.refTable}(${fk.refColumn})`);
      }
    }

    return `CREATE TABLE ${this.name} (\n${colDefs.join(',\n')}\n);`;
  }

  toSQLDML() {
    if (!this.rows || this.rows.length === 0) return '';
    const colNames = this.columns.map(c => c.name);
    const inserts = this.rows.map(r => {
      const vals = colNames.map(col => {
        const v = r[col];
        if (v === null || v === undefined) return 'NULL';
        if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
        if (typeof v === 'number') return v;
        return `'${String(v).replace(/'/g, "''")}'`;
      });
      return `INSERT INTO ${this.name} (${colNames.join(', ')}) VALUES (${vals.join(', ')});`;
    });
    return inserts.join('\n');
  }
}

class Database {
  constructor({ id, name, tables = {} }) {
    this.id = id || 'db_' + Date.now();
    this.name = name || 'New Database';
    this.tables = {};

    for (const [tName, tData] of Object.entries(tables)) {
      this.tables[tName.toLowerCase()] = new Table(tData);
    }
  }

  getTable(name) {
    if (!name) return null;
    return this.tables[name.toLowerCase()] || null;
  }

  createTable({ name, columns = [], foreignKeys = [] }) {
    const key = name.toLowerCase();
    if (this.tables[key]) {
      throw new Error(`Table '${name}' already exists in database '${this.name}'`);
    }
    const table = new Table({ name, columns, rows: [], foreignKeys });
    this.tables[key] = table;
    return table;
  }

  dropTable(name) {
    const key = name.toLowerCase();
    if (!this.tables[key]) {
      throw new Error(`Table '${name}' does not exist in database '${this.name}'`);
    }
    delete this.tables[key];
  }

  truncateTable(name) {
    const key = name.toLowerCase();
    const table = this.tables[key];
    if (!table) {
      throw new Error(`Table '${name}' does not exist in database '${this.name}'`);
    }
    return table.truncate();
  }

  dumpSQL() {
    const header = `-- ========================================================\n-- QueryLab Database Export Dump\n-- Database: ${this.name}\n-- Generated: ${new Date().toISOString()}\n-- ========================================================\n\n`;
    const ddlParts = [];
    const dmlParts = [];

    for (const table of Object.values(this.tables)) {
      ddlParts.push(`-- Table structure for '${table.name}'\nDROP TABLE IF EXISTS ${table.name};\n${table.toSQLDDL()}\n`);
      const dml = table.toSQLDML();
      if (dml) {
        dmlParts.push(`-- Data for '${table.name}'\n${dml}\n`);
      }
    }

    return header + ddlParts.join('\n') + '\n' + dmlParts.join('\n');
  }

  toJSON() {
    const out = {
      id: this.id,
      name: this.name,
      tables: {}
    };
    for (const [k, t] of Object.entries(this.tables)) {
      out.tables[k] = {
        name: t.name,
        columns: t.columns,
        rows: t.rows,
        foreignKeys: t.foreignKeys
      };
    }
    return out;
  }

  static fromJSON(data) {
    return new Database(data);
  }
}


/* --- MODULE: js/engine/evaluator.js --- */
/**
 * QueryLab - Relational SQL Evaluator Engine
 * Processes SELECT (Joins, Aggregations, Grouping, Having, Scalar Functions), DML, DDL, and Meta Operations.
 */

function executeQuery(statement, database) {
  const startTime = performance.now();

  let result;
  switch (statement.type) {
    case 'SELECT':
      result = executeSelect(statement, database);
      break;
    case 'INSERT':
      result = executeInsert(statement, database);
      break;
    case 'UPDATE':
      result = executeUpdate(statement, database);
      break;
    case 'DELETE':
      result = executeDelete(statement, database);
      break;
    case 'CREATE_TABLE':
      result = executeCreateTable(statement, database);
      break;
    case 'DROP_TABLE':
      result = executeDropTable(statement, database);
      break;
    case 'ALTER_TABLE':
      result = executeAlterTable(statement, database);
      break;
    case 'TRUNCATE_TABLE':
      result = executeTruncateTable(statement, database);
      break;
    case 'SHOW_TABLES':
      result = executeShowTables(statement, database);
      break;
    case 'DESCRIBE_TABLE':
      result = executeDescribeTable(statement, database);
      break;
    case 'EXPLAIN':
      result = executeExplain(statement, database);
      break;
    default:
      throw new Error(`Execution for statement '${statement.type}' not implemented.`);
  }

  const executionTimeMs = (performance.now() - startTime).toFixed(2);
  return { ...result, executionTimeMs };
}

// --- 1. SELECT Evaluator ---
function executeSelect(stmt, db) {
  let workingRows = [];
  let availableColumns = [];

  // 1. FROM clause
  if (stmt.from) {
    const table = db.getTable(stmt.from.table);
    if (!table) {
      throw new Error(`Table '${stmt.from.table}' not found in database '${db.name}'`);
    }

    const tAlias = stmt.from.alias || stmt.from.table;
    workingRows = table.rows.map(r => {
      const rowMap = {};
      for (const [k, v] of Object.entries(r)) {
        rowMap[`${tAlias}.${k}`] = v;
        rowMap[k] = v; // Allow un-prefixed access
      }
      return rowMap;
    });

    availableColumns = table.columns.map(c => ({ name: c.name, table: tAlias, type: c.type }));
  } else {
    // Single row dummy query (e.g. SELECT 1 + 1 AS calc, UPPER('querylab') AS name;)
    workingRows = [{}];
  }

  // 2. JOIN clauses (INNER, LEFT, RIGHT, CROSS)
  if (stmt.joins && stmt.joins.length > 0) {
    for (const join of stmt.joins) {
      const joinTable = db.getTable(join.table);
      if (!joinTable) {
        throw new Error(`Joined table '${join.table}' not found.`);
      }

      const jAlias = join.alias || join.table;
      const newRows = [];

      if (join.type === 'CROSS') {
        for (const leftRow of workingRows) {
          for (const rightRow of joinTable.rows) {
            const combined = { ...leftRow };
            for (const [k, v] of Object.entries(rightRow)) {
              combined[`${jAlias}.${k}`] = v;
              if (combined[k] === undefined) combined[k] = v;
            }
            newRows.push(combined);
          }
        }
      } else {
        for (const leftRow of workingRows) {
          let matchFound = false;

          for (const rightRow of joinTable.rows) {
            const combined = { ...leftRow };
            for (const [k, v] of Object.entries(rightRow)) {
              combined[`${jAlias}.${k}`] = v;
              if (combined[k] === undefined) combined[k] = v;
            }

            if (evaluateExpression(join.on, combined)) {
              newRows.push(combined);
              matchFound = true;
            }
          }

          // LEFT JOIN unmatched row with nulls
          if (!matchFound && join.type === 'LEFT') {
            const combined = { ...leftRow };
            for (const c of joinTable.columns) {
              combined[`${jAlias}.${c.name}`] = null;
              if (combined[c.name] === undefined) combined[c.name] = null;
            }
            newRows.push(combined);
          }
        }
      }

      workingRows = newRows;
      joinTable.columns.forEach(c => availableColumns.push({ name: c.name, table: jAlias, type: c.type }));
    }
  }

  // 3. WHERE filtering
  if (stmt.where) {
    workingRows = workingRows.filter(row => evaluateExpression(stmt.where, row));
  }

  // 4. GROUP BY & Aggregations
  const hasAggregates = stmt.columns.some(c => hasAggregateFunc(c.expr));
  let resultColumns = [];
  let finalRows = [];

  if (stmt.groupBy || hasAggregates) {
    const groups = {};

    for (const row of workingRows) {
      const groupKey = stmt.groupBy
        ? stmt.groupBy.map(g => String(evaluateExpression(g, row))).join('___')
        : '__all__';

      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(row);
    }

    // Evaluate columns for each group
    for (const [gKey, gRows] of Object.entries(groups)) {
      const outRow = {};
      stmt.columns.forEach((col, idx) => {
        const colName = col.alias || getColumnExpressionName(col.expr, idx);
        outRow[colName] = evaluateAggregateExpression(col.expr, gRows, {});
      });

      // HAVING filter
      if (stmt.having) {
        if (!evaluateAggregateExpression(stmt.having, gRows, outRow)) {
          continue;
        }
      }

      finalRows.push(outRow);
    }
  } else {
    // Normal Non-Grouped Projection
    finalRows = workingRows.map(row => {
      const outRow = {};

      if (stmt.columns.length === 1 && stmt.columns[0].expr.type === 'WILDCARD') {
        // SELECT *
        for (const [k, v] of Object.entries(row)) {
          if (!k.includes('.')) {
            outRow[k] = v;
          }
        }
      } else {
        stmt.columns.forEach((col, idx) => {
          if (col.expr.type === 'WILDCARD') {
            for (const [k, v] of Object.entries(row)) {
              if (!k.includes('.')) outRow[k] = v;
            }
          } else {
            const colName = col.alias || getColumnExpressionName(col.expr, idx);
            outRow[colName] = evaluateExpression(col.expr, row);
          }
        });
      }
      return outRow;
    });
  }

  // 5. DISTINCT deduplication
  if (stmt.distinct) {
    const seen = new Set();
    finalRows = finalRows.filter(r => {
      const key = JSON.stringify(r);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // 6. ORDER BY sorting
  if (stmt.orderBy && stmt.orderBy.length > 0) {
    finalRows.sort((a, b) => {
      for (const ord of stmt.orderBy) {
        const valA = evaluateExpression(ord.expr, a);
        const valB = evaluateExpression(ord.expr, b);

        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;

        if (valA !== valB) {
          const comp = valA < valB ? -1 : 1;
          return ord.dir === 'DESC' ? -comp : comp;
        }
      }
      return 0;
    });
  }

  // 7. LIMIT and OFFSET
  if (stmt.offset) {
    finalRows = finalRows.slice(stmt.offset);
  }
  if (stmt.limit !== null && stmt.limit !== undefined) {
    finalRows = finalRows.slice(0, stmt.limit);
  }

  // Determine output schema
  if (finalRows.length > 0) {
    resultColumns = Object.keys(finalRows[0]).map(k => ({ name: k }));
  } else if (stmt.columns) {
    resultColumns = stmt.columns.map((c, i) => ({ name: c.alias || getColumnExpressionName(c.expr, i) }));
  }

  return {
    type: 'SELECT',
    columns: resultColumns,
    rows: finalRows,
    rowCount: finalRows.length
  };
}

// --- 2. INSERT Evaluator ---
function executeInsert(stmt, db) {
  const table = db.getTable(stmt.table);
  if (!table) throw new Error(`Table '${stmt.table}' does not exist.`);

  let insertedCount = 0;
  for (const valRow of stmt.values) {
    const rowObj = {};
    if (stmt.columns) {
      stmt.columns.forEach((colName, idx) => {
        rowObj[colName] = evaluateExpression(valRow[idx], {});
      });
    } else {
      table.columns.forEach((col, idx) => {
        rowObj[col.name] = valRow[idx] !== undefined ? evaluateExpression(valRow[idx], {}) : null;
      });
    }
    table.insertRow(rowObj);
    insertedCount++;
  }

  return { type: 'INSERT', affectedRows: insertedCount, message: `Inserted ${insertedCount} row(s)` };
}

// --- 3. UPDATE Evaluator ---
function executeUpdate(stmt, db) {
  const table = db.getTable(stmt.table);
  if (!table) throw new Error(`Table '${stmt.table}' does not exist.`);

  let updatedCount = 0;
  for (const row of table.rows) {
    if (!stmt.where || evaluateExpression(stmt.where, row)) {
      for (const assign of stmt.assignments) {
        const colDef = table.getColumn(assign.column);
        let val = evaluateExpression(assign.expr, row);
        if (colDef) val = table.castValue(val, colDef.type);
        row[assign.column] = val;
      }
      updatedCount++;
    }
  }

  return { type: 'UPDATE', affectedRows: updatedCount, message: `Updated ${updatedCount} row(s)` };
}

// --- 4. DELETE Evaluator ---
function executeDelete(stmt, db) {
  const table = db.getTable(stmt.table);
  if (!table) throw new Error(`Table '${stmt.table}' does not exist.`);

  const initialCount = table.rows.length;
  if (!stmt.where) {
    table.rows = [];
  } else {
    table.rows = table.rows.filter(row => !evaluateExpression(stmt.where, row));
  }

  const deletedCount = initialCount - table.rows.length;
  return { type: 'DELETE', affectedRows: deletedCount, message: `Deleted ${deletedCount} row(s)` };
}

// --- 5. DDL (Create, Drop, Alter, Truncate) ---
function executeCreateTable(stmt, db) {
  if (stmt.ifNotExists && db.getTable(stmt.table)) {
    return { type: 'CREATE_TABLE', affectedRows: 0, message: `Table '${stmt.table}' already exists.` };
  }
  db.createTable({
    name: stmt.table,
    columns: stmt.columns,
    foreignKeys: stmt.foreignKeys
  });
  return { type: 'CREATE_TABLE', affectedRows: 0, message: `Created table '${stmt.table}'` };
}

function executeDropTable(stmt, db) {
  if (stmt.ifExists && !db.getTable(stmt.table)) {
    return { type: 'DROP_TABLE', affectedRows: 0, message: `Table '${stmt.table}' does not exist.` };
  }
  db.dropTable(stmt.table);
  return { type: 'DROP_TABLE', affectedRows: 0, message: `Dropped table '${stmt.table}'` };
}

function executeAlterTable(stmt, db) {
  const table = db.getTable(stmt.table);
  if (!table) throw new Error(`Table '${stmt.table}' does not exist.`);

  if (stmt.action === 'ADD_COLUMN') {
    table.columns.push(stmt.column);
    table.rows.forEach(r => { r[stmt.column.name] = null; });
  } else if (stmt.action === 'DROP_COLUMN') {
    table.columns = table.columns.filter(c => c.name.toLowerCase() !== stmt.columnName.toLowerCase());
    table.rows.forEach(r => { delete r[stmt.columnName]; });
  }
  return { type: 'ALTER_TABLE', affectedRows: 0, message: `Altered table '${stmt.table}'` };
}

function executeTruncateTable(stmt, db) {
  const count = db.truncateTable(stmt.table);
  return { type: 'TRUNCATE_TABLE', affectedRows: count, message: `Truncated table '${stmt.table}' (${count} rows removed)` };
}

// --- 6. Meta Inspection (SHOW TABLES, DESCRIBE, EXPLAIN) ---
function executeShowTables(stmt, db) {
  const tables = Object.values(db.tables || {});
  const rows = tables.map(t => ({
    table_name: t.name,
    column_count: t.columns.length,
    row_count: t.rows.length
  }));

  return {
    type: 'SELECT',
    columns: [{ name: 'table_name' }, { name: 'column_count' }, { name: 'row_count' }],
    rows,
    rowCount: rows.length
  };
}

function executeDescribeTable(stmt, db) {
  const table = db.getTable(stmt.table);
  if (!table) throw new Error(`Table '${stmt.table}' does not exist.`);

  const rows = table.columns.map(c => {
    const isFK = (table.foreignKeys || []).find(fk => fk.column === c.name);
    return {
      column_name: c.name,
      data_type: c.type || 'TEXT',
      primary_key: !!c.isPrimaryKey,
      not_null: !!c.isNotNull,
      unique: !!c.isUnique,
      default_value: c.defaultValue !== undefined ? c.defaultValue : null,
      foreign_key: isFK ? `${isFK.refTable}.${isFK.refColumn}` : null
    };
  });

  return {
    type: 'SELECT',
    columns: [
      { name: 'column_name' },
      { name: 'data_type' },
      { name: 'primary_key' },
      { name: 'not_null' },
      { name: 'unique' },
      { name: 'default_value' },
      { name: 'foreign_key' }
    ],
    rows,
    rowCount: rows.length
  };
}

function executeExplain(stmt, db) {
  const inner = stmt.innerStatement;
  const planRows = [];

  planRows.push({ step: 1, operation: `Parsed statement type: ${inner.type}`, details: 'Root Plan Node' });

  if (inner.type === 'SELECT') {
    if (inner.from) {
      planRows.push({ step: 2, operation: `SCAN TABLE ${inner.from.table}`, details: `Alias: ${inner.from.alias || 'none'}` });
    }
    if (inner.joins && inner.joins.length > 0) {
      inner.joins.forEach((j, i) => {
        planRows.push({ step: 3 + i, operation: `${j.type} JOIN ${j.table}`, details: `ON condition evaluation` });
      });
    }
    if (inner.where) {
      planRows.push({ step: 4, operation: 'FILTER (WHERE clause)', details: 'Evaluates row predicate' });
    }
    if (inner.groupBy) {
      planRows.push({ step: 5, operation: 'HASH AGGREGATE / GROUP BY', details: `Grouping on ${inner.groupBy.length} keys` });
    }
    if (inner.having) {
      planRows.push({ step: 6, operation: 'FILTER (HAVING clause)', details: 'Filter group aggregates' });
    }
    if (inner.orderBy) {
      planRows.push({ step: 7, operation: 'SORT / ORDER BY', details: `Sort keys: ${inner.orderBy.length}` });
    }
    if (inner.limit !== null && inner.limit !== undefined) {
      planRows.push({ step: 8, operation: `LIMIT ${inner.limit} OFFSET ${inner.offset || 0}`, details: 'Slice final rows' });
    }
  }

  return {
    type: 'SELECT',
    columns: [{ name: 'step' }, { name: 'operation' }, { name: 'details' }],
    rows: planRows,
    rowCount: planRows.length
  };
}

// --- Expression Evaluator ---
function evaluateExpression(expr, row) {
  if (!expr) return true;

  switch (expr.type) {
    case 'LITERAL':
      return expr.value;

    case 'COLUMN': {
      if (expr.table) {
        const full = `${expr.table}.${expr.column}`;
        if (row[full] !== undefined) return row[full];
      }
      return row[expr.column];
    }

    case 'UNARY_OP': {
      if (expr.op === 'NOT') {
        return !evaluateExpression(expr.expr, row);
      }
      return false;
    }

    case 'BINARY_OP': {
      const left = evaluateExpression(expr.left, row);
      const right = evaluateExpression(expr.right, row);

      switch (expr.op) {
        case '=': return left == right;
        case '!=': return left != right;
        case '<': return Number(left) < Number(right);
        case '<=': return Number(left) <= Number(right);
        case '>': return Number(left) > Number(right);
        case '>=': return Number(left) >= Number(right);
        case '+': return Number(left) + Number(right);
        case '-': return Number(left) - Number(right);
        case '*': return Number(left) * Number(right);
        case '/': return Number(right) === 0 ? 0 : Number(left) / Number(right);
        case '%': return Number(left) % Number(right);
        case '||': return String(left ?? '') + String(right ?? '');
        case 'AND': return Boolean(left && right);
        case 'OR': return Boolean(left || right);
        case 'LIKE': {
          const regex = new RegExp('^' + String(right).replace(/%/g, '.*').replace(/_/g, '.') + '$', 'i');
          return regex.test(String(left ?? ''));
        }
      }
      return false;
    }

    case 'BETWEEN': {
      const val = Number(evaluateExpression(expr.expr, row));
      const low = Number(evaluateExpression(expr.low, row));
      const high = Number(evaluateExpression(expr.high, row));
      const inRange = val >= low && val <= high;
      return expr.not ? !inRange : inRange;
    }

    case 'IS_NULL': {
      const val = evaluateExpression(expr.expr, row);
      const isNull = val === null || val === undefined;
      return expr.not ? !isNull : isNull;
    }

    case 'IN': {
      const val = evaluateExpression(expr.expr, row);
      const listVals = expr.list.map(e => evaluateExpression(e, row));
      const found = listVals.includes(val);
      return expr.not ? !found : found;
    }

    case 'CASE_EXPR': {
      for (const item of expr.cases) {
        if (evaluateExpression(item.when, row)) {
          return evaluateExpression(item.then, row);
        }
      }
      return expr.elseExpr ? evaluateExpression(expr.elseExpr, row) : null;
    }

    case 'FUNCTION_CALL': {
      const func = expr.func.toUpperCase();
      const args = (expr.args || []).map(a => evaluateExpression(a, row));

      switch (func) {
        case 'UPPER':
          return args[0] !== null && args[0] !== undefined ? String(args[0]).toUpperCase() : null;
        case 'LOWER':
          return args[0] !== null && args[0] !== undefined ? String(args[0]).toLowerCase() : null;
        case 'LENGTH':
        case 'LEN':
          return args[0] !== null && args[0] !== undefined ? String(args[0]).length : 0;
        case 'TRIM':
          return args[0] !== null && args[0] !== undefined ? String(args[0]).trim() : null;
        case 'ABS':
          return args[0] !== null && args[0] !== undefined ? Math.abs(Number(args[0])) : null;
        case 'ROUND': {
          const num = Number(args[0]);
          const decimals = args[1] !== undefined ? Number(args[1]) : 0;
          return isNaN(num) ? null : parseFloat(num.toFixed(decimals));
        }
        case 'COALESCE':
          for (const arg of args) {
            if (arg !== null && arg !== undefined) return arg;
          }
          return null;
        case 'CONCAT':
          return args.map(a => (a === null || a === undefined ? '' : String(a))).join('');
        case 'SUBSTR':
        case 'SUBSTRING': {
          const str = String(args[0] ?? '');
          const start = Math.max(0, Number(args[1] ?? 1) - 1);
          const len = args[2] !== undefined ? Number(args[2]) : undefined;
          return str.substr(start, len);
        }
        case 'NOW':
          return new Date().toISOString();
        case 'CAST':
          return args[0];
        default:
          return args[0] ?? null;
      }
    }

    default:
      return null;
  }
}

// --- Aggregation Evaluator ---
function evaluateAggregateExpression(expr, rows, aliasMap = {}) {
  if (!expr) return true;

  if (expr.type === 'LITERAL') {
    return expr.value;
  }

  if (expr.type === 'COLUMN') {
    if (aliasMap && aliasMap[expr.column] !== undefined) {
      return aliasMap[expr.column];
    }
    return evaluateExpression(expr, rows[0] || {});
  }

  if (expr.type === 'BINARY_OP') {
    const left = evaluateAggregateExpression(expr.left, rows, aliasMap);
    const right = evaluateAggregateExpression(expr.right, rows, aliasMap);

    switch (expr.op) {
      case '=': return left == right;
      case '!=': return left != right;
      case '<': return Number(left) < Number(right);
      case '<=': return Number(left) <= Number(right);
      case '>': return Number(left) > Number(right);
      case '>=': return Number(left) >= Number(right);
      case '+': return Number(left) + Number(right);
      case '-': return Number(left) - Number(right);
      case '*': return Number(left) * Number(right);
      case '/': return Number(right) === 0 ? 0 : Number(left) / Number(right);
      case '%': return Number(left) % Number(right);
      case '||': return String(left ?? '') + String(right ?? '');
      case 'AND': return Boolean(left && right);
      case 'OR': return Boolean(left || right);
    }
    return false;
  }

  if (expr.type === 'FUNCTION_CALL') {
    const func = expr.func.toUpperCase();
    const args = (expr.args || []).map(a => evaluateAggregateExpression(a, rows, aliasMap));

    switch (func) {
      case 'UPPER':
        return args[0] !== null && args[0] !== undefined ? String(args[0]).toUpperCase() : null;
      case 'LOWER':
        return args[0] !== null && args[0] !== undefined ? String(args[0]).toLowerCase() : null;
      case 'LENGTH':
      case 'LEN':
        return args[0] !== null && args[0] !== undefined ? String(args[0]).length : 0;
      case 'TRIM':
        return args[0] !== null && args[0] !== undefined ? String(args[0]).trim() : null;
      case 'ABS':
        return args[0] !== null && args[0] !== undefined ? Math.abs(Number(args[0])) : null;
      case 'ROUND': {
        const num = Number(args[0]);
        const decimals = args[1] !== undefined ? Number(args[1]) : 0;
        return isNaN(num) ? null : parseFloat(num.toFixed(decimals));
      }
      case 'COALESCE':
        for (const arg of args) {
          if (arg !== null && arg !== undefined) return arg;
        }
        return null;
      case 'CONCAT':
        return args.map(a => (a === null || a === undefined ? '' : String(a))).join('');
      default:
        return args[0] ?? null;
    }
  }

  if (expr.type === 'AGGREGATE') {
    const func = expr.func.toUpperCase();

    if (func === 'COUNT') {
      if (expr.arg.type === 'WILDCARD') return rows.length;
      const vals = rows.map(r => evaluateExpression(expr.arg, r)).filter(v => v !== null && v !== undefined);
      return expr.isDistinct ? new Set(vals).size : vals.length;
    }

    const numbers = rows.map(r => Number(evaluateExpression(expr.arg, r))).filter(n => !isNaN(n));
    if (numbers.length === 0) return null;

    if (func === 'SUM') return parseFloat(numbers.reduce((a, b) => a + b, 0).toFixed(2));
    if (func === 'AVG') return parseFloat((numbers.reduce((a, b) => a + b, 0) / numbers.length).toFixed(2));
    if (func === 'MIN') return Math.min(...numbers);
    if (func === 'MAX') return Math.max(...numbers);
  }

  // Fallback to single expression evaluation
  return evaluateExpression(expr, rows[0] || {});
}

function hasAggregateFunc(expr) {
  if (!expr) return false;
  if (expr.type === 'AGGREGATE') return true;
  if (expr.type === 'FUNCTION_CALL' && expr.args && expr.args.some(hasAggregateFunc)) return true;
  if (expr.left && hasAggregateFunc(expr.left)) return true;
  if (expr.right && hasAggregateFunc(expr.right)) return true;
  return false;
}

function getColumnExpressionName(expr, index) {
  if (expr.type === 'COLUMN') return expr.column;
  if (expr.type === 'AGGREGATE') return `${expr.func.toLowerCase()}_${index + 1}`;
  if (expr.type === 'FUNCTION_CALL') return `${expr.func.toLowerCase()}_${index + 1}`;
  if (expr.type === 'WILDCARD') return '*';
  return `col_${index + 1}`;
}


/* --- MODULE: js/editor/sample-data.js --- */
/**
 * QueryLab - Sample Relational Databases & Query Catalog
 * Production-quality relational schemas and authentic fictional data for realistic SQL exploration.
 */

const SAMPLE_DATABASES = {
  shopmart: {
    id: 'db_shopmart',
    name: 'ShopMart (E-Commerce)',
    tables: {
      categories: {
        name: 'categories',
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true },
          { name: 'category_name', type: 'TEXT', isNotNull: true, isUnique: true },
          { name: 'slug', type: 'TEXT', isNotNull: true }
        ],
        rows: [
          { id: 1, category_name: 'Audio & Acoustics', slug: 'audio' },
          { id: 2, category_name: 'Computer Peripherals', slug: 'peripherals' },
          { id: 3, category_name: 'Ergonomic Furniture', slug: 'furniture' },
          { id: 4, category_name: 'Displays & Visuals', slug: 'displays' },
          { id: 5, category_name: 'Home Office Essentials', slug: 'home-office' }
        ],
        foreignKeys: []
      },
      customers: {
        name: 'customers',
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true },
          { name: 'name', type: 'TEXT', isNotNull: true },
          { name: 'email', type: 'TEXT', isUnique: true, isNotNull: true },
          { name: 'country', type: 'TEXT', defaultValue: 'USA' },
          { name: 'city', type: 'TEXT' },
          { name: 'signup_date', type: 'DATE' },
          { name: 'active', type: 'BOOLEAN', defaultValue: true }
        ],
        rows: [
          { id: 1, name: 'Elena Vance', email: 'elena.vance@blackmesa.org', country: 'USA', city: 'Seattle', signup_date: '2023-01-15', active: true },
          { id: 2, name: 'Marcus Thorne', email: 'm.thorne@vanguard-sys.co.uk', country: 'UK', city: 'London', signup_date: '2023-02-20', active: true },
          { id: 3, name: 'Claire Dubois', email: 'claire.dubois@lumina-paris.fr', country: 'France', city: 'Paris', signup_date: '2023-03-10', active: true },
          { id: 4, name: 'Kenji Sato', email: 'kenji.sato@techno-tokyo.jp', country: 'Japan', city: 'Tokyo', signup_date: '2023-04-05', active: false },
          { id: 5, name: 'Priya Sharma', email: 'priya.sharma@deccan-labs.in', country: 'India', city: 'Bengaluru', signup_date: '2023-05-18', active: true },
          { id: 6, name: 'Liam O\'Connor', email: 'liam.oc@dublin-craft.ie', country: 'Ireland', city: 'Dublin', signup_date: '2023-06-22', active: true },
          { id: 7, name: 'Sofia Rodriguez', email: 'sofia.r@madrid-digital.es', country: 'Spain', city: 'Madrid', signup_date: '2023-07-09', active: true }
        ],
        foreignKeys: []
      },
      products: {
        name: 'products',
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true },
          { name: 'product_name', type: 'TEXT', isNotNull: true },
          { name: 'category_id', type: 'INTEGER', isNotNull: true },
          { name: 'price', type: 'REAL', isNotNull: true },
          { name: 'stock_qty', type: 'INTEGER', defaultValue: 0 },
          { name: 'rating', type: 'REAL', defaultValue: 4.5 }
        ],
        rows: [
          { id: 101, product_name: 'StudioPro Wireless ANC Headphones', category_id: 1, price: 299.99, stock_qty: 42, rating: 4.8 },
          { id: 102, product_name: 'Mechanical RGB Hot-Swap Keyboard', category_id: 2, price: 139.50, stock_qty: 115, rating: 4.7 },
          { id: 103, product_name: 'Ergonomic Mesh Lumbar Desk Chair', category_id: 3, price: 449.00, stock_qty: 18, rating: 4.9 },
          { id: 104, product_name: 'UltraWide 38-inch Curved IPS Monitor', category_id: 4, price: 899.00, stock_qty: 12, rating: 4.6 },
          { id: 105, product_name: 'Precision Wireless Trackball Mouse', category_id: 2, price: 79.95, stock_qty: 85, rating: 4.4 },
          { id: 106, product_name: 'Solid Walnut Desk Shelf Riser', category_id: 5, price: 119.00, stock_qty: 35, rating: 4.9 },
          { id: 107, product_name: 'Broadcast USB Condenser Microphone', category_id: 1, price: 159.00, stock_qty: 28, rating: 4.7 },
          { id: 108, product_name: 'Dual Monitor Aluminum Gas-Spring Arm', category_id: 4, price: 129.99, stock_qty: 60, rating: 4.5 }
        ],
        foreignKeys: [
          { column: 'category_id', refTable: 'categories', refColumn: 'id' }
        ]
      },
      orders: {
        name: 'orders',
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true },
          { name: 'customer_id', type: 'INTEGER', isNotNull: true },
          { name: 'order_date', type: 'DATE', isNotNull: true },
          { name: 'total_amount', type: 'REAL', isNotNull: true },
          { name: 'status', type: 'TEXT', defaultValue: 'completed' },
          { name: 'payment_method', type: 'TEXT', defaultValue: 'credit_card' }
        ],
        rows: [
          { id: 5001, customer_id: 1, order_date: '2023-06-01', total_amount: 439.49, status: 'completed', payment_method: 'credit_card' },
          { id: 5002, customer_id: 2, order_date: '2023-06-04', total_amount: 139.50, status: 'completed', payment_method: 'paypal' },
          { id: 5003, customer_id: 1, order_date: '2023-06-12', total_amount: 899.00, status: 'completed', payment_method: 'credit_card' },
          { id: 5004, customer_id: 3, order_date: '2023-06-15', total_amount: 119.00, status: 'shipped', payment_method: 'apple_pay' },
          { id: 5005, customer_id: 5, order_date: '2023-06-20', total_amount: 449.00, status: 'pending', payment_method: 'credit_card' },
          { id: 5006, customer_id: 6, order_date: '2023-07-01', total_amount: 379.94, status: 'completed', payment_method: 'credit_card' },
          { id: 5007, customer_id: 7, order_date: '2023-07-14', total_amount: 288.99, status: 'completed', payment_method: 'paypal' }
        ],
        foreignKeys: [
          { column: 'customer_id', refTable: 'customers', refColumn: 'id' }
        ]
      },
      order_items: {
        name: 'order_items',
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true },
          { name: 'order_id', type: 'INTEGER', isNotNull: true },
          { name: 'product_id', type: 'INTEGER', isNotNull: true },
          { name: 'quantity', type: 'INTEGER', defaultValue: 1 },
          { name: 'unit_price', type: 'REAL', isNotNull: true }
        ],
        rows: [
          { id: 1, order_id: 5001, product_id: 101, quantity: 1, unit_price: 299.99 },
          { id: 2, order_id: 5001, product_id: 102, quantity: 1, unit_price: 139.50 },
          { id: 3, order_id: 5002, product_id: 102, quantity: 1, unit_price: 139.50 },
          { id: 4, order_id: 5003, product_id: 104, quantity: 1, unit_price: 899.00 },
          { id: 5, order_id: 5004, product_id: 106, quantity: 1, unit_price: 119.00 },
          { id: 6, order_id: 5005, product_id: 103, quantity: 1, unit_price: 449.00 },
          { id: 7, order_id: 5006, product_id: 101, quantity: 1, unit_price: 299.99 },
          { id: 8, order_id: 5006, product_id: 105, quantity: 1, unit_price: 79.95 },
          { id: 9, order_id: 5007, product_id: 107, quantity: 1, unit_price: 159.00 },
          { id: 10, order_id: 5007, product_id: 108, quantity: 1, unit_price: 129.99 }
        ],
        foreignKeys: [
          { column: 'order_id', refTable: 'orders', refColumn: 'id' },
          { column: 'product_id', refTable: 'products', refColumn: 'id' }
        ]
      }
    }
  },

  techcorp: {
    id: 'db_techcorp',
    name: 'TechCorp (Enterprise HR)',
    tables: {
      departments: {
        name: 'departments',
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true },
          { name: 'dept_name', type: 'TEXT', isNotNull: true },
          { name: 'location', type: 'TEXT', isNotNull: true },
          { name: 'budget', type: 'REAL', defaultValue: 500000.0 }
        ],
        rows: [
          { id: 10, dept_name: 'Core Platform Engineering', location: 'San Francisco, CA', budget: 2400000.0 },
          { id: 20, dept_name: 'Product Experience & UI', location: 'New York, NY', budget: 1100000.0 },
          { id: 30, dept_name: 'Revenue & Enterprise Sales', location: 'London, UK', budget: 1800000.0 },
          { id: 40, dept_name: 'People Operations & HR', location: 'Austin, TX', budget: 650000.0 },
          { id: 50, dept_name: 'Information Security & Trust', location: 'Boston, MA', budget: 950000.0 }
        ],
        foreignKeys: []
      },
      employees: {
        name: 'employees',
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true },
          { name: 'first_name', type: 'TEXT', isNotNull: true },
          { name: 'last_name', type: 'TEXT', isNotNull: true },
          { name: 'email', type: 'TEXT', isUnique: true, isNotNull: true },
          { name: 'job_title', type: 'TEXT', isNotNull: true },
          { name: 'hire_date', type: 'DATE' },
          { name: 'salary', type: 'REAL', isNotNull: true },
          { name: 'dept_id', type: 'INTEGER' }
        ],
        rows: [
          { id: 1001, first_name: 'Sarah', last_name: 'Connor', email: 'sarah.c@techcorp.io', job_title: 'Staff Infrastructure Architect', hire_date: '2020-03-01', salary: 185000, dept_id: 10 },
          { id: 1002, first_name: 'Marcus', last_name: 'Aurelius', email: 'marcus.a@techcorp.io', job_title: 'Principal Systems Engineer', hire_date: '2019-08-15', salary: 195000, dept_id: 10 },
          { id: 1003, first_name: 'Jessica', last_name: 'Pearson', email: 'jessica.p@techcorp.io', job_title: 'VP of Product Design', hire_date: '2018-11-20', salary: 175000, dept_id: 20 },
          { id: 1004, first_name: 'Harvey', last_name: 'Specter', email: 'harvey.s@techcorp.io', job_title: 'Director of Strategic Enterprise Sales', hire_date: '2021-01-10', salary: 165000, dept_id: 30 },
          { id: 1005, first_name: 'Donna', last_name: 'Paulsen', email: 'donna.p@techcorp.io', job_title: 'Head of Global Talent Ops', hire_date: '2021-06-05', salary: 125000, dept_id: 40 },
          { id: 1006, first_name: 'Elliot', last_name: 'Alderson', email: 'elliot.a@techcorp.io', job_title: 'Senior Security Analyst', hire_date: '2022-04-12', salary: 155000, dept_id: 50 },
          { id: 1007, first_name: 'Maya', last_name: 'Lin', email: 'maya.l@techcorp.io', job_title: 'Senior UI/UX Designer', hire_date: '2022-09-01', salary: 130000, dept_id: 20 }
        ],
        foreignKeys: [
          { column: 'dept_id', refTable: 'departments', refColumn: 'id' }
        ]
      },
      projects: {
        name: 'projects',
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true },
          { name: 'project_name', type: 'TEXT', isNotNull: true },
          { name: 'dept_id', type: 'INTEGER', isNotNull: true },
          { name: 'status', type: 'TEXT', defaultValue: 'active' },
          { name: 'target_launch', type: 'DATE' }
        ],
        rows: [
          { id: 201, project_name: 'Distributed Lakehouse Engine v3', dept_id: 10, status: 'active', target_launch: '2024-03-31' },
          { id: 202, project_name: 'NextGen Design System & Tokens', dept_id: 20, status: 'active', target_launch: '2023-12-15' },
          { id: 203, project_name: 'EMEA Enterprise Expansion Hub', dept_id: 30, status: 'completed', target_launch: '2023-09-01' },
          { id: 204, project_name: 'Zero-Trust Identity Mesh', dept_id: 50, status: 'active', target_launch: '2024-06-30' }
        ],
        foreignKeys: [
          { column: 'dept_id', refTable: 'departments', refColumn: 'id' }
        ]
      }
    }
  },

  cloudpulse: {
    id: 'db_cloudpulse',
    name: 'CloudPulse (SaaS Analytics)',
    tables: {
      accounts: {
        name: 'accounts',
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true },
          { name: 'company_name', type: 'TEXT', isNotNull: true },
          { name: 'domain', type: 'TEXT', isUnique: true, isNotNull: true },
          { name: 'tier', type: 'TEXT', defaultValue: 'starter' },
          { name: 'monthly_spend', type: 'REAL', defaultValue: 49.0 },
          { name: 'is_active', type: 'BOOLEAN', defaultValue: true }
        ],
        rows: [
          { id: 1, company_name: 'Stripeflow AI', domain: 'stripeflow.ai', tier: 'enterprise', monthly_spend: 1850.0, is_active: true },
          { id: 2, company_name: 'HyperScale Logistics', domain: 'hyperscale.io', tier: 'growth', monthly_spend: 499.0, is_active: true },
          { id: 3, company_name: 'Aetheria Health Tech', domain: 'aetheria.health', tier: 'enterprise', monthly_spend: 3200.0, is_active: true },
          { id: 4, company_name: 'ByteCraft Studio', domain: 'bytecraft.gg', tier: 'starter', monthly_spend: 49.0, is_active: true },
          { id: 5, company_name: 'OmniVerve Media', domain: 'omniverve.net', tier: 'growth', monthly_spend: 499.0, is_active: false }
        ],
        foreignKeys: []
      },
      api_keys: {
        name: 'api_keys',
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true },
          { name: 'account_id', type: 'INTEGER', isNotNull: true },
          { name: 'key_prefix', type: 'TEXT', isNotNull: true },
          { name: 'environment', type: 'TEXT', defaultValue: 'production' },
          { name: 'total_requests', type: 'INTEGER', defaultValue: 0 }
        ],
        rows: [
          { id: 101, account_id: 1, key_prefix: 'cp_live_9482', environment: 'production', total_requests: 4820194 },
          { id: 102, account_id: 1, key_prefix: 'cp_test_3019', environment: 'staging', total_requests: 120500 },
          { id: 103, account_id: 2, key_prefix: 'cp_live_7718', environment: 'production', total_requests: 981240 },
          { id: 104, account_id: 3, key_prefix: 'cp_live_1102', environment: 'production', total_requests: 8490211 },
          { id: 105, account_id: 4, key_prefix: 'cp_live_5549', environment: 'production', total_requests: 45010 }
        ],
        foreignKeys: [
          { column: 'account_id', refTable: 'accounts', refColumn: 'id' }
        ]
      },
      invoices: {
        name: 'invoices',
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true },
          { name: 'account_id', type: 'INTEGER', isNotNull: true },
          { name: 'invoice_date', type: 'DATE', isNotNull: true },
          { name: 'amount', type: 'REAL', isNotNull: true },
          { name: 'status', type: 'TEXT', defaultValue: 'paid' }
        ],
        rows: [
          { id: 9001, account_id: 1, invoice_date: '2023-07-01', amount: 1850.0, status: 'paid' },
          { id: 9002, account_id: 2, invoice_date: '2023-07-01', amount: 499.0, status: 'paid' },
          { id: 9003, account_id: 3, invoice_date: '2023-07-01', amount: 3200.0, status: 'paid' },
          { id: 9004, account_id: 4, invoice_date: '2023-07-01', amount: 49.0, status: 'paid' },
          { id: 9005, account_id: 1, invoice_date: '2023-08-01', amount: 1850.0, status: 'paid' }
        ],
        foreignKeys: [
          { column: 'account_id', refTable: 'accounts', refColumn: 'id' }
        ]
      }
    }
  },

  grandvista: {
    id: 'db_grandvista',
    name: 'GrandVista (Hotel & Resorts)',
    tables: {
      rooms: {
        name: 'rooms',
        columns: [
          { name: 'room_number', type: 'INTEGER', isPrimaryKey: true, isNotNull: true },
          { name: 'room_type', type: 'TEXT', isNotNull: true },
          { name: 'nightly_rate', type: 'REAL', isNotNull: true },
          { name: 'floor', type: 'INTEGER', isNotNull: true },
          { name: 'has_ocean_view', type: 'BOOLEAN', defaultValue: false }
        ],
        rows: [
          { room_number: 101, room_type: 'Standard King', nightly_rate: 189.0, floor: 1, has_ocean_view: false },
          { room_number: 204, room_type: 'Deluxe Oceanfront Suite', nightly_rate: 349.0, floor: 2, has_ocean_view: true },
          { room_number: 305, room_type: 'Executive Penthouse', nightly_rate: 699.0, floor: 3, has_ocean_view: true },
          { room_number: 108, room_type: 'Double Queen Garden', nightly_rate: 219.0, floor: 1, has_ocean_view: false },
          { room_number: 212, room_type: 'Deluxe Oceanfront Suite', nightly_rate: 349.0, floor: 2, has_ocean_view: true }
        ],
        foreignKeys: []
      },
      guests: {
        name: 'guests',
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true },
          { name: 'full_name', type: 'TEXT', isNotNull: true },
          { name: 'email', type: 'TEXT', isUnique: true, isNotNull: true },
          { name: 'membership_tier', type: 'TEXT', defaultValue: 'Silver' }
        ],
        rows: [
          { id: 1, full_name: 'Arthur Pendelton', email: 'arthur.p@cambridge.edu', membership_tier: 'Platinum' },
          { id: 2, full_name: 'Samantha Ray', email: 'samantha.ray@aerospace.io', membership_tier: 'Gold' },
          { id: 3, full_name: 'Daniel Zhao', email: 'd.zhao@pacific-venture.com', membership_tier: 'Diamond' },
          { id: 4, full_name: 'Chloe Monet', email: 'chloe.monet@riviera-art.fr', membership_tier: 'Silver' }
        ],
        foreignKeys: []
      },
      reservations: {
        name: 'reservations',
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true },
          { name: 'guest_id', type: 'INTEGER', isNotNull: true },
          { name: 'room_number', type: 'INTEGER', isNotNull: true },
          { name: 'check_in', type: 'DATE', isNotNull: true },
          { name: 'check_out', type: 'DATE', isNotNull: true },
          { name: 'total_charge', type: 'REAL', isNotNull: true }
        ],
        rows: [
          { id: 801, guest_id: 1, room_number: 305, check_in: '2023-09-10', check_out: '2023-09-15', total_charge: 3495.0 },
          { id: 802, guest_id: 2, room_number: 204, check_in: '2023-09-12', check_out: '2023-09-16', total_charge: 1396.0 },
          { id: 803, guest_id: 3, room_number: 212, check_in: '2023-09-20', check_out: '2023-09-25', total_charge: 1745.0 },
          { id: 804, guest_id: 4, room_number: 101, check_in: '2023-09-22', check_out: '2023-09-24', total_charge: 378.0 }
        ],
        foreignKeys: [
          { column: 'guest_id', refTable: 'guests', refColumn: 'id' },
          { column: 'room_number', refTable: 'rooms', refColumn: 'room_number' }
        ]
      }
    }
  }
};

const QUICK_QUERIES = [
  {
    name: 'Top Products by Price & Category (Multi-Column)',
    category: 'Basic Queries',
    sql: `SELECT \n  p.id,\n  p.product_name,\n  c.category_name,\n  p.price,\n  p.stock_qty,\n  p.rating\nFROM products p\nINNER JOIN categories c ON p.category_id = c.id\nORDER BY p.price DESC\nLIMIT 6;`
  },
  {
    name: 'Customer Spend Summary (INNER JOIN & Aggregation)',
    category: 'Analytics & Reporting',
    sql: `SELECT \n  c.name AS customer_name,\n  c.country,\n  COUNT(o.id) AS total_orders,\n  SUM(o.total_amount) AS total_spent,\n  ROUND(AVG(o.total_amount), 2) AS average_order_value\nFROM customers c\nINNER JOIN orders o ON c.id = o.customer_id\nGROUP BY c.name, c.country\nORDER BY total_spent DESC;`
  },
  {
    name: 'Category Analytics (GROUP BY & HAVING)',
    category: 'Analytics & Reporting',
    sql: `SELECT \n  c.category_name,\n  COUNT(p.id) AS total_items,\n  ROUND(AVG(p.price), 2) AS avg_price,\n  MAX(p.price) AS highest_price,\n  SUM(p.stock_qty) AS inventory_units\nFROM categories c\nINNER JOIN products p ON c.id = p.category_id\nGROUP BY c.category_name\nHAVING avg_price > 100.00\nORDER BY avg_price DESC;`
  },
  {
    name: 'Order Line Item Breakdown (Multi-Table JOIN)',
    category: 'Advanced Joins',
    sql: `SELECT \n  o.id AS order_id,\n  c.name AS customer_name,\n  p.product_name,\n  oi.quantity,\n  oi.unit_price,\n  (oi.quantity * oi.unit_price) AS line_total\nFROM order_items oi\nINNER JOIN orders o ON oi.order_id = o.id\nINNER JOIN customers c ON o.customer_id = c.id\nINNER JOIN products p ON oi.product_id = p.id\nORDER BY o.id ASC, line_total DESC;`
  },
  {
    name: 'Tier Classification with CASE Expression',
    category: 'Expressions & Functions',
    sql: `SELECT \n  product_name,\n  price,\n  CASE \n    WHEN price >= 500 THEN 'Premium Tier'\n    WHEN price >= 150 THEN 'Mid-Range Tier'\n    ELSE 'Budget Tier'\n  END AS price_segment,\n  rating\nFROM products\nORDER BY price DESC;`
  },
  {
    name: 'String & Formatting Functions (UPPER, CONCAT, LENGTH)',
    category: 'Expressions & Functions',
    sql: `SELECT \n  id,\n  name,\n  UPPER(country) AS country_code,\n  email,\n  LENGTH(name) AS name_char_count\nFROM customers\nWHERE active = TRUE;`
  },
  {
    name: 'Range Filtering with BETWEEN & IN',
    category: 'Basic Queries',
    sql: `SELECT \n  id,\n  product_name,\n  price,\n  rating\nFROM products\nWHERE price BETWEEN 100 AND 500\n  AND category_id IN (1, 2, 4)\nORDER BY rating DESC;`
  },
  {
    name: 'Database Schema Inspection (SHOW TABLES)',
    category: 'Meta & DDL',
    sql: `SHOW TABLES;`
  },
  {
    name: 'Table Column Inspection (DESCRIBE)',
    category: 'Meta & DDL',
    sql: `DESCRIBE products;`
  },
  {
    name: 'Query Plan Inspection (EXPLAIN)',
    category: 'Meta & DDL',
    sql: `EXPLAIN SELECT \n  c.name, \n  SUM(o.total_amount) AS spent\nFROM customers c\nINNER JOIN orders o ON c.id = o.customer_id\nWHERE o.status = 'completed'\nGROUP BY c.name\nORDER BY spent DESC;`
  },
  {
    name: 'Insert New Customer Record (INSERT INTO)',
    category: 'DML Mutations',
    sql: `INSERT INTO customers (id, name, email, country, city, signup_date, active)\nVALUES (8, 'Jonathan Vance', 'j.vance@blackmesa.org', 'USA', 'Boston', '2023-08-01', TRUE);`
  },
  {
    name: 'Update Customer Status (UPDATE SET)',
    category: 'DML Mutations',
    sql: `UPDATE customers \nSET active = TRUE, city = 'Kyoto' \nWHERE email = 'kenji.sato@techno-tokyo.jp';`
  },
  {
    name: 'Create New Relational Table (CREATE TABLE)',
    category: 'Meta & DDL',
    sql: `CREATE TABLE product_reviews (\n  id INTEGER PRIMARY KEY NOT NULL,\n  product_id INTEGER NOT NULL,\n  reviewer_name TEXT NOT NULL,\n  score INTEGER DEFAULT 5,\n  review_text TEXT,\n  FOREIGN KEY (product_id) REFERENCES products(id)\n);`
  }
];


/* --- MODULE: js/editor/editor.js --- */
/**
 * QueryLab - Code Editor Component
 * Monospaced SQL editor with line numbers, syntax highlighting, autocomplete Intellisense,
 * Tab indentation, selection execution, and query formatting.
 */




class SQLEditor {
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


/* --- MODULE: js/editor/schema-browser.js --- */
/**
 * QueryLab - Database Explorer / Schema Browser Panel
 * Tree view with live search, table node expansion, schema metadata, and contextual quick actions.
 */



let filterQuery = '';
const expandedTables = new Set();

function renderSchemaBrowser(container, {
  database,
  onTableSelect = null,
  onQuickQuery = null,
  onOpenTableDesigner = null,
  onDropTable = null,
  onTruncateTable = null
}) {
  const allTables = Object.values(database.tables || {});
  const totalRows = allTables.reduce((acc, t) => acc + (t.rows || []).length, 0);

  // Initialize all tables as expanded by default if set is empty
  if (expandedTables.size === 0) {
    allTables.forEach(t => expandedTables.add(t.name.toLowerCase()));
  }

  // Filter tables & columns based on search input
  const q = filterQuery.toLowerCase().trim();
  const visibleTables = allTables.filter(t => {
    if (!q) return true;
    if (t.name.toLowerCase().includes(q)) return true;
    return t.columns.some(c => c.name.toLowerCase().includes(q) || (c.type || '').toLowerCase().includes(q));
  });

  container.innerHTML = `
    <!-- Header with Database Name & New Table Button -->
    <div class="panel-section-header flex items-center justify-between p-2.5 border-b">
      <div class="flex items-center gap-2 min-w-0">
        ${getIcon('database', 'icon-sm text-primary flex-shrink-0')}
        <div class="flex flex-col min-w-0">
          <span class="text-xs font-bold text-primary truncate" title="${escapeHTML(database.name)}">${escapeHTML(database.name)}</span>
          <span class="text-muted font-mono" style="font-size: 10px;">${allTables.length} tables &bull; ${totalRows} total rows</span>
        </div>
      </div>
      <button class="btn btn-xs btn-primary" id="btn-open-designer" title="Create New Table Visually">
        ${getIcon('plus', 'icon-xs')} Table
      </button>
    </div>

    <!-- Search / Filter Input Bar -->
    <div class="p-2 border-b" style="background-color: var(--bg-panel);">
      <div class="relative flex items-center">
        <span class="absolute" style="left: 6px; color: var(--text-muted); pointer-events: none;">
          ${getIcon('search', 'icon-xs')}
        </span>
        <input 
          type="text" 
          id="input-filter-schema" 
          class="form-control form-control-sm w-full font-mono text-xs" 
          style="padding-left: 24px;" 
          placeholder="Filter tables & columns..." 
          value="${escapeHTML(filterQuery)}"
          aria-label="Filter tables and columns"
        />
        ${filterQuery ? `
          <button id="btn-clear-schema-filter" class="btn-icon-xs absolute" style="right: 4px;" title="Clear Filter">&times;</button>
        ` : ''}
      </div>
    </div>

    <!-- Tree View Scroll Container -->
    <div class="schema-tree-scroll p-2 flex flex-col gap-1.5 flex-1 overflow-y-auto">
      ${visibleTables.length === 0 ? `
        <div class="text-xs text-muted text-center p-4">
          ${q ? `No tables or columns match "${escapeHTML(q)}".` : 'No tables in database. Click "+ Table" to create one.'}
        </div>
      ` : visibleTables.map(t => {
        const numRows = (t.rows || []).length;
        const tKey = t.name.toLowerCase();
        const isExpanded = expandedTables.has(tKey);

        return `
          <div class="schema-table-node card p-2" data-table="${escapeHTML(t.name)}">
            <!-- Table Header Row -->
            <div class="flex items-center justify-between cursor-pointer table-header-row" data-table-toggle="${escapeHTML(tKey)}">
              <div class="flex items-center gap-1.5 flex-1 min-w-0">
                <span class="text-muted table-chevron-icon">
                  ${getIcon(isExpanded ? 'chevronDown' : 'chevronRight', 'icon-xs')}
                </span>
                <span class="text-primary">${getIcon('table', 'icon-xs')}</span>
                <span class="font-bold text-xs text-primary truncate" title="${escapeHTML(t.name)}">${escapeHTML(t.name)}</span>
                <span class="badge badge-secondary font-mono text-muted" style="font-size: 9.5px; padding: 1px 4px;">${numRows}</span>
              </div>

              <!-- Quick Actions -->
              <div class="flex items-center gap-0.5" onclick="event.stopPropagation();">
                <button class="btn-icon-xs btn-table-quick-select" data-table="${escapeHTML(t.name)}" title="Query: SELECT * FROM ${escapeHTML(t.name)} LIMIT 50">
                  ${getIcon('play', 'icon-xs text-emerald')}
                </button>
                <div class="table-actions-menu-wrapper relative">
                  <button class="btn-icon-xs btn-table-more-actions" data-table="${escapeHTML(t.name)}" title="Table Actions">
                    ${getIcon('code', 'icon-xs')}
                  </button>
                </div>
                <button class="btn-icon-xs text-rose btn-table-drop" data-table="${escapeHTML(t.name)}" title="Drop Table">
                  ${getIcon('trash', 'icon-xs')}
                </button>
              </div>
            </div>

            <!-- Columns List (Collapsible) -->
            <div class="table-columns-list pl-4 flex flex-col gap-1 border-t pt-1.5 mt-1.5" style="display: ${isExpanded ? 'flex' : 'none'};">
              ${t.columns.map(c => {
                const isPK = c.isPrimaryKey;
                const isFK = (t.foreignKeys || []).find(fk => fk.column === c.name);

                return `
                  <div class="column-item-row flex items-center justify-between text-xs py-0.5 cursor-pointer hover:bg-hover rounded px-1" data-col-quick="${escapeHTML(t.name)}.${escapeHTML(c.name)}" title="Click to insert '${escapeHTML(t.name)}.${escapeHTML(c.name)}'">
                    <div class="flex items-center gap-1.5 truncate">
                      ${isPK ? `<span class="badge badge-primary font-mono" style="font-size: 8.5px; padding: 1px 3px;">PK</span>` : ''}
                      ${isFK ? `<span class="badge badge-secondary font-mono text-amber" style="font-size: 8.5px; padding: 1px 3px;" title="References ${escapeHTML(isFK.refTable)}.${escapeHTML(isFK.refColumn)}">FK</span>` : ''}
                      <span class="font-mono text-secondary truncate">${escapeHTML(c.name)}</span>
                    </div>
                    <span class="text-muted font-mono" style="font-size: 9.5px;">${c.type || 'TEXT'}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // --- Attach Handlers ---
  const filterInput = container.querySelector('#input-filter-schema');
  filterInput?.addEventListener('input', (e) => {
    filterQuery = e.target.value;
    renderSchemaBrowser(container, { database, onTableSelect, onQuickQuery, onOpenTableDesigner, onDropTable, onTruncateTable });
    const newInp = container.querySelector('#input-filter-schema');
    if (newInp) {
      newInp.focus();
      newInp.selectionStart = newInp.selectionEnd = filterQuery.length;
    }
  });

  container.querySelector('#btn-clear-schema-filter')?.addEventListener('click', () => {
    filterQuery = '';
    renderSchemaBrowser(container, { database, onTableSelect, onQuickQuery, onOpenTableDesigner, onDropTable, onTruncateTable });
  });

  container.querySelector('#btn-open-designer')?.addEventListener('click', () => {
    if (onOpenTableDesigner) onOpenTableDesigner();
  });

  // Table expand/collapse toggle
  container.querySelectorAll('[data-table-toggle]').forEach(header => {
    header.addEventListener('click', () => {
      const tKey = header.dataset.tableToggle;
      if (expandedTables.has(tKey)) {
        expandedTables.delete(tKey);
      } else {
        expandedTables.add(tKey);
      }
      renderSchemaBrowser(container, { database, onTableSelect, onQuickQuery, onOpenTableDesigner, onDropTable, onTruncateTable });
    });
  });

  // Quick Select
  container.querySelectorAll('.btn-table-quick-select').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tName = btn.dataset.table;
      if (onQuickQuery) onQuickQuery(`SELECT * FROM ${tName} LIMIT 50;`);
    });
  });

  // Table More Actions menu / templates
  container.querySelectorAll('.btn-table-more-actions').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tName = btn.dataset.table;
      const table = database.getTable(tName);
      if (!table) return;

      const colList = table.columns.map(c => c.name).join(',\n  ');
      const action = prompt(`Quick SQL Generator for '${tName}':\n1. SELECT all columns\n2. INSERT template\n3. DESCRIBE schema\n4. TRUNCATE table\nEnter 1, 2, 3, or 4:`, '1');

      if (action === '1') {
        if (onQuickQuery) onQuickQuery(`SELECT \n  ${colList}\nFROM ${tName}\nLIMIT 50;`);
      } else if (action === '2') {
        const dummyVals = table.columns.map(c => c.type === 'INTEGER' || c.type === 'REAL' ? '0' : "'sample'").join(', ');
        if (onQuickQuery) onQuickQuery(`INSERT INTO ${tName} (${table.columns.map(c => c.name).join(', ')})\nVALUES (${dummyVals});`);
      } else if (action === '3') {
        if (onQuickQuery) onQuickQuery(`DESCRIBE ${tName};`);
      } else if (action === '4') {
        if (confirm(`Are you sure you want to TRUNCATE '${tName}' (delete all rows)?`)) {
          if (onTruncateTable) onTruncateTable(tName);
          else if (onQuickQuery) onQuickQuery(`TRUNCATE TABLE ${tName};`);
        }
      }
    });
  });

  // Column name quick insertion
  container.querySelectorAll('[data-col-quick]').forEach(row => {
    row.addEventListener('click', () => {
      const colRef = row.dataset.colQuick;
      if (window.queryLabApp && window.queryLabApp.editor) {
        const ed = window.queryLabApp.editor;
        const curVal = ed.getValue();
        ed.setValue(curVal + ' ' + colRef);
      }
    });
  });

  // Drop Table
  container.querySelectorAll('.btn-table-drop').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tName = btn.dataset.table;
      if (confirm(`Are you sure you want to DROP TABLE '${tName}'? All data in this table will be deleted.`)) {
        if (onDropTable) onDropTable(tName);
      }
    });
  });
}


/* --- MODULE: js/editor/results-grid.js --- */
/**
 * QueryLab - Tabular Results Grid Component
 * Renders SQL query output with interactive column sorting, in-grid search,
 * cell copy, Markdown/CSV/JSON export, execution timing, and formatted data types.
 */



let sortColumn = null;
let sortDirection = 'ASC'; // 'ASC', 'DESC'
let resultsFilter = '';

function renderResultsGrid(container, result, error = null) {
  if (error) {
    container.innerHTML = `
      <div class="results-header-bar flex items-center justify-between px-3 py-1 border-b">
        <div class="flex items-center gap-2">
          <span class="badge badge-danger font-mono text-xs">QUERY ERROR</span>
        </div>
      </div>
      <div class="p-4">
        <div class="card p-3 font-mono text-xs flex flex-col gap-2" style="border-color: var(--accent-rose); background-color: var(--accent-rose-subtle); color: #ff7b72;">
          <div class="flex items-center gap-2 font-bold">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <span>Execution Error</span>
          </div>
          <div class="p-2 rounded font-mono" style="background-color: rgba(0,0,0,0.3); line-height: 1.5;">
            ${escapeHTML(error.message || String(error))}
          </div>
          <div class="text-xs text-muted">
            Tip: Check keyword spelling, table or column names, or missing commas/semicolons.
          </div>
        </div>
      </div>
    `;
    return;
  }

  if (!result) {
    container.innerHTML = `
      <div class="results-header-bar flex items-center justify-between px-3 py-1 border-b">
        <span class="text-xs text-muted font-mono font-semibold">QUERY RESULTS</span>
      </div>
      <div class="p-8 text-center text-muted text-xs font-mono flex flex-col items-center justify-center gap-2 flex-1">
        ${getIcon('code', 'icon-sm opacity-40')}
        <span>Write a SQL query above and click "Run Query" (Ctrl+Enter) to view results.</span>
      </div>
    `;
    return;
  }

  // DML / DDL result (Insert, Update, Delete, Create, Drop, Alter, Truncate)
  if (result.type !== 'SELECT') {
    container.innerHTML = `
      <div class="results-header-bar flex items-center justify-between px-3 py-1 border-b">
        <div class="flex items-center gap-2">
          <span class="badge badge-success font-mono text-xs">SUCCESS</span>
          <span class="text-xs text-muted font-mono">Executed in ${result.executionTimeMs || '0'}ms</span>
        </div>
      </div>
      <div class="p-4">
        <div class="card p-3 font-mono text-xs flex items-center gap-2 text-emerald" style="border-color: var(--accent-emerald); background-color: var(--accent-emerald-subtle);">
          ${getIcon('check', 'icon-xs')}
          <span>${escapeHTML(result.message || 'Statement executed successfully.')}</span>
        </div>
      </div>
    `;
    return;
  }

  // SELECT query result
  const columns = result.columns || [];
  let rows = [...(result.rows || [])];

  // Apply in-grid text search
  const q = resultsFilter.toLowerCase().trim();
  if (q) {
    rows = rows.filter(r => {
      return columns.some(c => {
        const val = r[c.name];
        return val !== null && val !== undefined && String(val).toLowerCase().includes(q);
      });
    });
  }

  // Apply column sorting
  if (sortColumn) {
    rows.sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];

      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'ASC' ? valA - valB : valB - valA;
      }
      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      return sortDirection === 'ASC' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
  }

  container.innerHTML = `
    <!-- Top Result Action Bar -->
    <div class="results-header-bar flex items-center justify-between px-3 py-1 border-b flex-wrap gap-2">
      <div class="flex items-center gap-2">
        <span class="badge badge-success font-mono text-xs">SUCCESS</span>
        <span class="text-xs text-secondary font-mono font-semibold">
          ${rows.length}${rows.length !== (result.rows || []).length ? ` of ${(result.rows || []).length}` : ''} row(s)
        </span>
        <span class="text-xs text-muted font-mono">&bull; ${result.executionTimeMs || '0'}ms</span>
      </div>

      <!-- Quick Results Search & Exporters -->
      <div class="flex items-center gap-1.5 flex-wrap">
        <div class="relative flex items-center">
          <input 
            type="text" 
            id="input-results-filter" 
            class="form-control form-control-sm font-mono text-xs" 
            style="width: 140px; padding-left: 20px;" 
            placeholder="Filter results..." 
            value="${escapeHTML(resultsFilter)}"
            aria-label="Filter result rows"
          />
          <span class="absolute" style="left: 5px; color: var(--text-muted); pointer-events: none;">
            ${getIcon('search', 'icon-xs')}
          </span>
        </div>

        <button class="btn btn-xs btn-secondary" id="btn-copy-markdown" title="Copy as Markdown Table">
          ${getIcon('fileText', 'icon-xs')} Markdown
        </button>
        <button class="btn btn-xs btn-secondary" id="btn-export-results-csv" title="Export Results as CSV">
          ${getIcon('download', 'icon-xs')} CSV
        </button>
        <button class="btn btn-xs btn-secondary" id="btn-export-results-json" title="Export Results as JSON">
          ${getIcon('code', 'icon-xs')} JSON
        </button>
      </div>
    </div>

    <!-- Data Table Container -->
    <div class="results-table-container flex-1 overflow-auto">
      ${rows.length === 0 ? `
        <div class="p-6 text-center text-muted text-xs font-mono">
          ${q ? `No rows match filter "${escapeHTML(q)}".` : 'Query returned 0 rows.'}
        </div>
      ` : `
        <table class="data-grid-table font-mono text-xs">
          <thead>
            <tr>
              <th class="row-index-col">#</th>
              ${columns.map(c => {
                const isSorted = sortColumn === c.name;
                return `
                  <th class="data-col-header cursor-pointer select-none" data-col="${escapeHTML(c.name)}" title="Click to sort by ${escapeHTML(c.name)}">
                    <div class="flex items-center justify-between gap-1.5">
                      <span class="truncate">${escapeHTML(c.name)}</span>
                      <span class="text-muted" style="font-size: 10px;">
                        ${isSorted ? (sortDirection === 'ASC' ? '&uarr;' : '&darr;') : ''}
                      </span>
                    </div>
                  </th>
                `;
              }).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map((row, rIdx) => `
              <tr>
                <td class="row-index-col">${rIdx + 1}</td>
                ${columns.map(c => {
                  const val = row[c.name];
                  return `<td class="data-grid-cell" data-cell-value="${escapeHTML(val !== null && val !== undefined ? String(val) : '')}" title="Click to copy value">${formatCellValue(val)}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    </div>
  `;

  // Attach filter handler
  const filterInp = container.querySelector('#input-results-filter');
  filterInp?.addEventListener('input', (e) => {
    resultsFilter = e.target.value;
    renderResultsGrid(container, result, error);
    const newInp = container.querySelector('#input-results-filter');
    if (newInp) {
      newInp.focus();
      newInp.selectionStart = newInp.selectionEnd = resultsFilter.length;
    }
  });

  // Attach column sort handler
  container.querySelectorAll('.data-col-header').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.dataset.col;
      if (sortColumn === col) {
        if (sortDirection === 'ASC') {
          sortDirection = 'DESC';
        } else {
          sortColumn = null;
          sortDirection = 'ASC';
        }
      } else {
        sortColumn = col;
        sortDirection = 'ASC';
      }
      renderResultsGrid(container, result, error);
    });
  });

  // Attach cell click-to-copy handler
  container.querySelectorAll('.data-grid-cell').forEach(td => {
    td.addEventListener('click', () => {
      const val = td.dataset.cellValue;
      if (val !== '') {
        navigator.clipboard.writeText(val).then(() => {
          td.style.backgroundColor = 'var(--accent-primary-subtle)';
          setTimeout(() => { td.style.backgroundColor = ''; }, 300);
        });
      }
    });
  });

  // Attach Markdown / CSV / JSON exporters
  container.querySelector('#btn-copy-markdown')?.addEventListener('click', (e) => {
    const md = exportToMarkdown(columns, rows);
    navigator.clipboard.writeText(md).then(() => {
      const btn = e.currentTarget;
      const oldHTML = btn.innerHTML;
      btn.innerHTML = `${getIcon('check', 'icon-xs text-emerald')} Copied!`;
      setTimeout(() => { btn.innerHTML = oldHTML; }, 1500);
    });
  });

  container.querySelector('#btn-export-results-csv')?.addEventListener('click', () => {
    exportToCSV(columns, rows);
  });

  container.querySelector('#btn-export-results-json')?.addEventListener('click', () => {
    exportToJSON(rows);
  });
}

function formatCellValue(val) {
  if (val === null || val === undefined) {
    return `<span class="cell-null">NULL</span>`;
  }
  if (typeof val === 'boolean') {
    return `<span class="badge ${val ? 'badge-success' : 'badge-secondary'}" style="font-size: 9px; padding: 1px 4px;">${val ? 'TRUE' : 'FALSE'}</span>`;
  }
  if (typeof val === 'number') {
    return `<span class="cell-number">${val}</span>`;
  }
  return escapeHTML(String(val));
}

function exportToMarkdown(columns, rows) {
  if (rows.length === 0) return '';
  const header = '| ' + columns.map(c => c.name).join(' | ') + ' |';
  const sep = '| ' + columns.map(() => '---').join(' | ') + ' |';
  const body = rows.map(r => '| ' + columns.map(c => {
    const v = r[c.name];
    return v === null || v === undefined ? 'NULL' : String(v).replace(/\|/g, '\\|');
  }).join(' | ') + ' |').join('\n');

  return `${header}\n${sep}\n${body}`;
}

function exportToCSV(columns, rows) {
  const colNames = columns.map(c => `"${c.name}"`).join(',');
  const rowLines = rows.map(r => columns.map(c => {
    const v = r[c.name];
    if (v === null || v === undefined) return '';
    return `"${String(v).replace(/"/g, '""')}"`;
  }).join(','));

  const csv = [colNames, ...rowLines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `query_results_${Date.now()}.csv`;
  a.click();
}

function exportToJSON(rows) {
  const json = JSON.stringify(rows, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `query_results_${Date.now()}.json`;
  a.click();
}


/* --- MODULE: js/editor/erd-viewer.js --- */
/**
 * QueryLab - Visual ERD (Entity-Relationship Diagram) Viewer
 * Interactive Canvas 2D schema visualizer with draggable table cards,
 * dynamic Foreign Key Bezier connectors, zoom/pan controls, and PNG export.
 */



class ERDViewer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = { x: 40, y: 40, zoom: 1 };
    this.database = null;
    this.tablePositions = {};
    this.isPanning = false;
    this.draggingTableKey = null;
    this.dragOffset = { x: 0, y: 0 };
    this.lastMouse = { x: 0, y: 0 };
    this.hoveredTable = null;

    this.initListeners();
  }

  resize(width, height) {
    if (!width || !height) return;
    this.canvas.width = width;
    this.canvas.height = height;
    this.render();
  }

  setDatabase(database) {
    this.database = database;
    this.calculateLayout();
    this.render();
  }

  initListeners() {
    const canvas = this.canvas;

    canvas.addEventListener('mousedown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Convert mouse coords to world coords
      const worldX = (mouseX - this.camera.x) / this.camera.zoom;
      const worldY = (mouseY - this.camera.y) / this.camera.zoom;

      // Check if clicked inside a table card
      let clickedKey = null;
      for (const [tKey, pos] of Object.entries(this.tablePositions)) {
        if (
          worldX >= pos.x &&
          worldX <= pos.x + pos.width &&
          worldY >= pos.y &&
          worldY <= pos.y + pos.height
        ) {
          clickedKey = tKey;
          break;
        }
      }

      if (clickedKey) {
        this.draggingTableKey = clickedKey;
        this.dragOffset = {
          x: worldX - this.tablePositions[clickedKey].x,
          y: worldY - this.tablePositions[clickedKey].y
        };
        canvas.style.cursor = 'grabbing';
      } else {
        this.isPanning = true;
        this.lastMouse = { x: e.clientX, y: e.clientY };
        canvas.style.cursor = 'grab';
      }
    });

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const worldX = (mouseX - this.camera.x) / this.camera.zoom;
      const worldY = (mouseY - this.camera.y) / this.camera.zoom;

      if (this.draggingTableKey && this.tablePositions[this.draggingTableKey]) {
        this.tablePositions[this.draggingTableKey].x = worldX - this.dragOffset.x;
        this.tablePositions[this.draggingTableKey].y = worldY - this.dragOffset.y;
        this.render();
        return;
      }

      if (this.isPanning) {
        const dx = e.clientX - this.lastMouse.x;
        const dy = e.clientY - this.lastMouse.y;
        this.camera.x += dx;
        this.camera.y += dy;
        this.lastMouse = { x: e.clientX, y: e.clientY };
        this.render();
        return;
      }

      // Update hover state
      let hoverKey = null;
      for (const [tKey, pos] of Object.entries(this.tablePositions)) {
        if (
          worldX >= pos.x &&
          worldX <= pos.x + pos.width &&
          worldY >= pos.y &&
          worldY <= pos.y + pos.height
        ) {
          hoverKey = tKey;
          break;
        }
      }
      if (this.hoveredTable !== hoverKey) {
        this.hoveredTable = hoverKey;
        canvas.style.cursor = hoverKey ? 'move' : 'default';
        this.render();
      }
    });

    window.addEventListener('mouseup', () => {
      this.isPanning = false;
      this.draggingTableKey = null;
      canvas.style.cursor = this.hoveredTable ? 'move' : 'default';
    });

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      this.setZoom(this.camera.zoom * zoomFactor, e.clientX, e.clientY);
    });
  }

  setZoom(newZoom, centerX = null, centerY = null) {
    const clamped = Math.max(0.3, Math.min(2.5, newZoom));
    if (centerX !== null && centerY !== null) {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = centerX - rect.left;
      const mouseY = centerY - rect.top;

      const worldX = (mouseX - this.camera.x) / this.camera.zoom;
      const worldY = (mouseY - this.camera.y) / this.camera.zoom;

      this.camera.zoom = clamped;
      this.camera.x = mouseX - worldX * clamped;
      this.camera.y = mouseY - worldY * clamped;
    } else {
      this.camera.zoom = clamped;
    }
    this.render();
  }

  resetView() {
    this.camera = { x: 50, y: 50, zoom: 1 };
    this.calculateLayout();
    this.render();
  }

  calculateLayout() {
    if (!this.database) return;
    const tables = Object.values(this.database.tables || {});
    this.tablePositions = {};

    const cardWidth = 260;
    const spacingX = 100;
    const spacingY = 70;
    const cols = Math.min(3, Math.max(1, Math.ceil(Math.sqrt(tables.length))));

    tables.forEach((t, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const cardHeight = 44 + t.columns.length * 24 + 12;

      this.tablePositions[t.name.toLowerCase()] = {
        x: col * (cardWidth + spacingX) + 60,
        y: row * (cardHeight + spacingY) + 60,
        width: cardWidth,
        height: cardHeight,
        table: t
      };
    });
  }

  exportAsPNG() {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.canvas.width;
    tempCanvas.height = this.canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(this.canvas, 0, 0);

    const a = document.createElement('a');
    a.download = `${(this.database?.name || 'database').toLowerCase().replace(/\s+/g, '_')}_schema_erd.png`;
    a.href = tempCanvas.toDataURL('image/png');
    a.click();
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // 1. Clear background & draw subtle grid dots
    ctx.fillStyle = '#0a0e17';
    ctx.fillRect(0, 0, w, h);

    // Draw background dot grid
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    const gridSize = 24 * this.camera.zoom;
    const offsetX = (this.camera.x % gridSize);
    const offsetY = (this.camera.y % gridSize);

    for (let x = offsetX; x < w; x += gridSize) {
      for (let y = offsetY; y < h; y += gridSize) {
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    }

    if (!this.database) return;

    ctx.save();
    ctx.translate(this.camera.x, this.camera.y);
    ctx.scale(this.camera.zoom, this.camera.zoom);

    // 2. Draw Foreign Key Bezier Connectors
    this.drawRelationshipLines();

    // 3. Draw Schema Table Cards
    for (const [tKey, pos] of Object.entries(this.tablePositions)) {
      this.drawTableCard(pos, tKey === this.hoveredTable);
    }

    ctx.restore();
  }

  drawTableCard(pos, isHovered = false) {
    const ctx = this.ctx;
    const { x, y, width, height, table } = pos;

    ctx.save();

    // Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = isHovered ? 12 : 6;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;

    // Card Body Background
    ctx.fillStyle = isHovered ? '#1a2233' : '#111726';
    ctx.strokeStyle = isHovered ? '#58a6ff' : '#242f47';
    ctx.lineWidth = isHovered ? 2 : 1.5;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, [6]);
    ctx.fill();
    ctx.stroke();

    ctx.shadowColor = 'transparent';

    // Card Header Bar
    ctx.fillStyle = '#182030';
    ctx.beginPath();
    ctx.roundRect(x, y, width, 36, [6, 6, 0, 0]);
    ctx.fill();
    ctx.strokeStyle = '#242f47';
    ctx.beginPath();
    ctx.moveTo(x, y + 36);
    ctx.lineTo(x + width, y + 36);
    ctx.stroke();

    // Table Header Icon & Name
    ctx.fillStyle = '#58a6ff';
    ctx.font = "bold 13px 'JetBrains Mono', Consolas, monospace";
    ctx.fillText(table.name, x + 12, y + 23);

    // Row count indicator
    ctx.fillStyle = '#8b949e';
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.textAlign = 'right';
    ctx.fillText(`${(table.rows || []).length} rows`, x + width - 12, y + 23);
    ctx.textAlign = 'left';

    // Columns list
    let colY = y + 56;
    table.columns.forEach((c) => {
      const isPK = c.isPrimaryKey;
      const isFK = (table.foreignKeys || []).some(fk => fk.column === c.name);

      let labelX = x + 12;

      // PK Badge
      if (isPK) {
        ctx.fillStyle = '#58a6ff';
        ctx.font = "bold 9px 'JetBrains Mono', monospace";
        ctx.fillText('PK', labelX, colY);
        labelX += 22;
      } else if (isFK) {
        ctx.fillStyle = '#d29922';
        ctx.font = "bold 9px 'JetBrains Mono', monospace";
        ctx.fillText('FK', labelX, colY);
        labelX += 22;
      }

      // Column Name
      ctx.fillStyle = isPK ? '#f0f6fc' : '#c9d1d9';
      ctx.font = `${isPK ? '600 ' : '400 '}11px 'JetBrains Mono', monospace`;
      ctx.fillText(c.name, labelX, colY);

      // Data Type
      ctx.fillStyle = '#8b949e';
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.textAlign = 'right';
      ctx.fillText(c.type || 'TEXT', x + width - 12, colY);
      ctx.textAlign = 'left';

      colY += 24;
    });

    ctx.restore();
  }

  drawRelationshipLines() {
    const ctx = this.ctx;

    for (const [tKey, pos] of Object.entries(this.tablePositions)) {
      const table = pos.table;
      if (!table.foreignKeys || table.foreignKeys.length === 0) continue;

      for (const fk of table.foreignKeys) {
        const targetPos = this.tablePositions[fk.refTable.toLowerCase()];
        if (!targetPos) continue;

        // Source column vertical anchor
        const colIdx = table.columns.findIndex(c => c.name === fk.column);
        const srcY = pos.y + 56 + (colIdx >= 0 ? colIdx : 0) * 24 - 4;
        const srcX = pos.x + pos.width;

        // Target table/column vertical anchor
        const targetColIdx = targetPos.table.columns.findIndex(c => c.name === fk.refColumn);
        const dstY = targetPos.y + 56 + (targetColIdx >= 0 ? targetColIdx : 0) * 24 - 4;
        const dstX = targetPos.x;

        // Draw Bezier Curve
        ctx.save();
        ctx.strokeStyle = '#58a6ff';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 4]);

        const dx = Math.abs(dstX - srcX);
        const cpX1 = srcX + Math.max(40, dx * 0.4);
        const cpX2 = dstX - Math.max(40, dx * 0.4);

        ctx.beginPath();
        ctx.moveTo(srcX, srcY);
        ctx.bezierCurveTo(cpX1, srcY, cpX2, dstY, dstX, dstY);
        ctx.stroke();

        // Source Connection Point
        ctx.fillStyle = '#58a6ff';
        ctx.beginPath();
        ctx.arc(srcX, srcY, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Target Arrow / Point
        ctx.fillStyle = '#3fb950';
        ctx.beginPath();
        ctx.arc(dstX, dstY, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }
  }
}


/* --- MODULE: js/editor/table-designer.js --- */
/**
 * QueryLab - Visual Table Designer Modal
 * Visual UI to design database tables, columns, constraints, foreign keys,
 * with real-time SQL DDL preview and validation.
 */



class TableDesignerModal {
  constructor(modalContainer, onSaveTable) {
    this.container = modalContainer;
    this.onSaveTable = onSaveTable;
    this.tableName = 'new_table';
    this.database = null;
    this.columns = [
      { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true, isUnique: false, defaultValue: '' },
      { name: 'name', type: 'TEXT', isPrimaryKey: false, isNotNull: true, isUnique: false, defaultValue: '' },
      { name: 'created_at', type: 'DATE', isPrimaryKey: false, isNotNull: false, isUnique: false, defaultValue: '' }
    ];
    this.foreignKeys = [];
  }

  setDatabase(database) {
    this.database = database;
  }

  open(defaultName = '') {
    this.tableName = defaultName || 'table_' + Math.floor(100 + Math.random() * 900);
    this.columns = [
      { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true, isUnique: false, defaultValue: '' },
      { name: 'name', type: 'TEXT', isPrimaryKey: false, isNotNull: true, isUnique: false, defaultValue: '' },
      { name: 'created_at', type: 'DATE', isPrimaryKey: false, isNotNull: false, isUnique: false, defaultValue: '' }
    ];
    this.foreignKeys = [];
    this.render();
    this.container.classList.add('active');

    setTimeout(() => {
      const nameInp = this.container.querySelector('#designer-table-name');
      if (nameInp) nameInp.focus();
    }, 50);
  }

  close() {
    this.container.classList.remove('active');
  }

  generatePreviewSQL() {
    const name = (this.tableName || 'new_table').trim();
    const colDefs = this.columns.map(c => {
      let def = `  ${c.name || 'column_name'} ${c.type || 'TEXT'}`;
      if (c.isPrimaryKey) def += ' PRIMARY KEY';
      if (c.isNotNull) def += ' NOT NULL';
      if (c.isUnique && !c.isPrimaryKey) def += ' UNIQUE';
      if (c.defaultValue) {
        const isNum = !isNaN(Number(c.defaultValue)) && typeof c.defaultValue !== 'boolean';
        def += ` DEFAULT ${isNum ? c.defaultValue : `'${c.defaultValue}'`}`;
      }
      return def;
    });

    if (this.foreignKeys && this.foreignKeys.length > 0) {
      for (const fk of this.foreignKeys) {
        if (fk.column && fk.refTable && fk.refColumn) {
          colDefs.push(`  FOREIGN KEY (${fk.column}) REFERENCES ${fk.refTable}(${fk.refColumn})`);
        }
      }
    }

    return `CREATE TABLE ${name} (\n${colDefs.join(',\n')}\n);`;
  }

  render() {
    const existingTables = this.database ? Object.values(this.database.tables || {}) : [];

    this.container.innerHTML = `
      <div class="modal-backdrop" aria-hidden="true"></div>
      <div class="modal-dialog table-designer-dialog" role="dialog" aria-modal="true" aria-labelledby="designer-modal-title">
        <div class="modal-header flex items-center justify-between p-3 border-b">
          <div class="flex items-center gap-2">
            ${getIcon('table', 'icon-sm text-primary')}
            <span id="designer-modal-title" class="font-bold text-sm">Visual Table Designer</span>
          </div>
          <button class="btn-icon-xs btn-modal-close" aria-label="Close dialog">&times;</button>
        </div>

        <div class="modal-body p-4 flex flex-col gap-3 overflow-y-auto" style="max-height: 70vh;">
          <!-- Table Name Input -->
          <div class="form-group">
            <label for="designer-table-name" class="form-label text-xs font-semibold text-secondary">Table Name</label>
            <input 
              type="text" 
              id="designer-table-name" 
              class="form-control form-control-sm font-bold font-mono text-primary w-full" 
              value="${escapeHTML(this.tableName)}" 
              placeholder="e.g. products, customers"
            />
          </div>

          <!-- Columns Grid -->
          <div class="flex items-center justify-between mt-1">
            <span class="text-xs font-bold uppercase text-muted">Columns Specification</span>
            <button class="btn btn-xs btn-secondary" id="btn-designer-add-col">
              ${getIcon('plus', 'icon-xs')} Add Column
            </button>
          </div>

          <div class="designer-columns-table-wrap card overflow-hidden">
            <table class="data-grid-table font-mono text-xs w-full">
              <thead>
                <tr>
                  <th style="width: 28%;">Column Name</th>
                  <th style="width: 22%;">Data Type</th>
                  <th style="width: 8%; text-align: center;" title="Primary Key">PK</th>
                  <th style="width: 8%; text-align: center;" title="Not Null">Not Null</th>
                  <th style="width: 8%; text-align: center;" title="Unique">Unique</th>
                  <th style="width: 20%;">Default</th>
                  <th style="width: 6%;"></th>
                </tr>
              </thead>
              <tbody id="designer-columns-body">
                ${this.columns.map((col, idx) => `
                  <tr>
                    <td>
                      <input type="text" class="form-control form-control-sm font-mono col-prop-name w-full" data-idx="${idx}" value="${escapeHTML(col.name)}" placeholder="col_name" />
                    </td>
                    <td>
                      <select class="form-control form-control-sm font-mono col-prop-type w-full" data-idx="${idx}">
                        <option value="INTEGER" ${col.type === 'INTEGER' ? 'selected' : ''}>INTEGER</option>
                        <option value="TEXT" ${col.type === 'TEXT' ? 'selected' : ''}>TEXT</option>
                        <option value="REAL" ${col.type === 'REAL' ? 'selected' : ''}>REAL</option>
                        <option value="BOOLEAN" ${col.type === 'BOOLEAN' ? 'selected' : ''}>BOOLEAN</option>
                        <option value="DATE" ${col.type === 'DATE' ? 'selected' : ''}>DATE</option>
                      </select>
                    </td>
                    <td class="text-center">
                      <input type="checkbox" class="col-prop-pk" data-idx="${idx}" ${col.isPrimaryKey ? 'checked' : ''} />
                    </td>
                    <td class="text-center">
                      <input type="checkbox" class="col-prop-nn" data-idx="${idx}" ${col.isNotNull ? 'checked' : ''} />
                    </td>
                    <td class="text-center">
                      <input type="checkbox" class="col-prop-uq" data-idx="${idx}" ${col.isUnique ? 'checked' : ''} />
                    </td>
                    <td>
                      <input type="text" class="form-control form-control-sm font-mono col-prop-def w-full" data-idx="${idx}" value="${escapeHTML(col.defaultValue || '')}" placeholder="NULL" />
                    </td>
                    <td class="text-center">
                      ${this.columns.length > 1 ? `
                        <button class="btn-icon-xs text-rose btn-designer-del-col" data-idx="${idx}" title="Remove Column">&times;</button>
                      ` : ''}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Real-Time SQL DDL Preview -->
          <div class="flex flex-col gap-1 mt-1">
            <span class="text-xs font-bold uppercase text-muted">Generated SQL Statement</span>
            <pre class="font-mono text-xs text-primary p-2.5 rounded border" style="background-color: var(--bg-input); border-color: var(--border-subtle); margin: 0; line-height: 1.5; max-height: 120px; overflow-y: auto;" id="designer-sql-preview">${escapeHTML(this.generatePreviewSQL())}</pre>
          </div>
        </div>

        <div class="modal-footer p-3 border-t flex justify-end gap-2">
          <button class="btn btn-sm btn-secondary btn-modal-close">Cancel</button>
          <button class="btn btn-sm btn-primary" id="btn-save-designed-table">
            ${getIcon('check', 'icon-xs')} Create Table
          </button>
        </div>
      </div>
    `;

    this.initEvents();
  }

  initEvents() {
    this.container.querySelectorAll('.btn-modal-close, .modal-backdrop').forEach(b => {
      b.addEventListener('click', () => this.close());
    });

    const updatePreview = () => {
      const pre = this.container.querySelector('#designer-sql-preview');
      if (pre) pre.textContent = this.generatePreviewSQL();
    };

    this.container.querySelector('#designer-table-name')?.addEventListener('input', (e) => {
      this.tableName = e.target.value;
      updatePreview();
    });

    this.container.querySelector('#btn-designer-add-col')?.addEventListener('click', () => {
      this.columns.push({
        name: 'col_' + (this.columns.length + 1),
        type: 'TEXT',
        isPrimaryKey: false,
        isNotNull: false,
        isUnique: false,
        defaultValue: ''
      });
      this.render();
    });

    // Column property updates
    this.container.querySelectorAll('.col-prop-name').forEach(inp => {
      inp.addEventListener('input', (e) => {
        this.columns[parseInt(e.target.dataset.idx, 10)].name = e.target.value;
        updatePreview();
      });
    });
    this.container.querySelectorAll('.col-prop-type').forEach(sel => {
      sel.addEventListener('change', (e) => {
        this.columns[parseInt(e.target.dataset.idx, 10)].type = e.target.value;
        updatePreview();
      });
    });
    this.container.querySelectorAll('.col-prop-pk').forEach(chk => {
      chk.addEventListener('change', (e) => {
        this.columns[parseInt(e.target.dataset.idx, 10)].isPrimaryKey = e.target.checked;
        updatePreview();
      });
    });
    this.container.querySelectorAll('.col-prop-nn').forEach(chk => {
      chk.addEventListener('change', (e) => {
        this.columns[parseInt(e.target.dataset.idx, 10)].isNotNull = e.target.checked;
        updatePreview();
      });
    });
    this.container.querySelectorAll('.col-prop-uq').forEach(chk => {
      chk.addEventListener('change', (e) => {
        this.columns[parseInt(e.target.dataset.idx, 10)].isUnique = e.target.checked;
        updatePreview();
      });
    });
    this.container.querySelectorAll('.col-prop-def').forEach(inp => {
      inp.addEventListener('input', (e) => {
        this.columns[parseInt(e.target.dataset.idx, 10)].defaultValue = e.target.value;
        updatePreview();
      });
    });

    this.container.querySelectorAll('.btn-designer-del-col').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        this.columns.splice(idx, 1);
        this.render();
      });
    });

    // Create Table Commit
    this.container.querySelector('#btn-save-designed-table')?.addEventListener('click', () => {
      const name = (this.container.querySelector('#designer-table-name')?.value || '').trim();
      if (!name) return alert('Please enter a valid table name.');

      const invalidCol = this.columns.find(c => !c.name || !c.name.trim());
      if (invalidCol) return alert('All columns must have a valid column name.');

      if (this.onSaveTable) {
        this.onSaveTable({
          name,
          columns: this.columns.map(c => ({
            name: c.name.trim(),
            type: c.type,
            isPrimaryKey: !!c.isPrimaryKey,
            isNotNull: !!c.isNotNull,
            isUnique: !!c.isUnique,
            defaultValue: c.defaultValue ? c.defaultValue.trim() : null
          })),
          foreignKeys: this.foreignKeys
        });
      }
      this.close();
    });
  }
}


/* --- MODULE: js/app.js --- */
/**
 * QueryLab - Master Application Orchestrator
 * Integrates SQL Lexer, Parser, Evaluator, Schema Browser, Results Grid, ERD Visualizer,
 * Table Designer, Snippet Manager, and Database Storage.
 */














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


})();
