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
  refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>`
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
    .replace(/"/g, '&quot;');
}

ICONS;


/* --- MODULE: js/core/db.js --- */
/**
 * QueryLab - IndexedDB Persistence Engine
 * Saves custom databases, query execution logs, and saved snippets offline.
 */

const DB_NAME = 'QueryLab_DB';
const DB_VERSION = 1;

class QueryLabDB {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('databases')) {
          db.createObjectStore('databases', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('history')) {
          db.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };

      request.onerror = (e) => {
        console.warn('IndexedDB unavailable, falling back to in-memory/localStorage', e);
        resolve(null);
      };
    });
  }

  async saveDatabase(databaseJSON) {
    if (!this.db) {
      localStorage.setItem('querylab_db_' + databaseJSON.id, JSON.stringify(databaseJSON));
      return;
    }
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('databases', 'readwrite');
      const store = tx.objectStore('databases');
      store.put(databaseJSON);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async loadDatabase(id) {
    if (!this.db) {
      const item = localStorage.getItem('querylab_db_' + id);
      return item ? JSON.parse(item) : null;
    }
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('databases', 'readonly');
      const store = tx.objectStore('databases');
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async addHistoryLog(log) {
    if (!this.db) return;
    return new Promise((resolve) => {
      const tx = this.db.transaction('history', 'readwrite');
      const store = tx.objectStore('history');
      store.add({ ...log, timestamp: Date.now() });
      tx.oncomplete = () => resolve();
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
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER', 'ON',
  'GROUP', 'BY', 'HAVING', 'ORDER', 'LIMIT', 'OFFSET', 'AS', 'DISTINCT',
  'ASC', 'DESC', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
  'CREATE', 'TABLE', 'DROP', 'ALTER', 'ADD', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES',
  'NOT', 'NULL', 'UNIQUE', 'DEFAULT', 'CHECK', 'AND', 'OR', 'LIKE', 'IN', 'BETWEEN', 'IS',
  'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'IF', 'EXISTS', 'INTEGER', 'TEXT', 'REAL', 'BOOLEAN', 'DATE'
]);

function tokenize(sql) {
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
      while (i < sql.length && sql[i] !== '\n') i++;
      continue;
    }
    if (char === '/' && sql[i + 1] === '*') {
      i += 2;
      while (i < sql.length && !(sql[i] === '*' && sql[i + 1] === '/')) {
        if (sql[i] === '\n') { line++; col = 1; }
        i++;
      }
      i += 2;
      continue;
    }

    // String Literal ('...')
    if (char === "'" || char === '"') {
      const quote = char;
      const startLine = line;
      const startCol = col;
      let strVal = '';
      i++; col++;
      while (i < sql.length && sql[i] !== quote) {
        if (sql[i] === '\\' && i + 1 < sql.length) {
          strVal += sql[i + 1];
          i += 2; col += 2;
        } else {
          strVal += sql[i];
          i++; col++;
        }
      }
      if (i >= sql.length) {
        throw new Error(`Unterminated string literal at line ${startLine}, col ${startCol}`);
      }
      i++; col++; // Skip closing quote
      tokens.push({ type: TOKEN_TYPES.STRING, value: strVal, line: startLine, col: startCol });
      continue;
    }

    // Numbers
    if (/[0-9]/.test(char) || (char === '.' && /[0-9]/.test(sql[i + 1]))) {
      const startCol = col;
      let numStr = '';
      while (i < sql.length && /[0-9.]/.test(sql[i])) {
        numStr += sql[i];
        i++; col++;
      }
      tokens.push({ type: TOKEN_TYPES.NUMBER, value: Number(numStr), raw: numStr, line, col: startCol });
      continue;
    }

    // Identifiers & Keywords
    if (/[a-zA-Z_]/.test(char) || char === '`' || char === '[') {
      const startCol = col;
      let idStr = '';

      if (char === '`' || char === '[') {
        const closeChar = char === '`' ? '`' : ']';
        i++; col++;
        while (i < sql.length && sql[i] !== closeChar) {
          idStr += sql[i];
          i++; col++;
        }
        i++; col++;
        tokens.push({ type: TOKEN_TYPES.IDENTIFIER, value: idStr, line, col: startCol });
      } else {
        while (i < sql.length && /[a-zA-Z0-9_]/.test(sql[i])) {
          idStr += sql[i];
          i++; col++;
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

    // Two-character operators (!=, <>, <=, >=)
    const twoChar = sql.substr(i, 2);
    if (['!=', '<>', '<=', '>='].includes(twoChar)) {
      tokens.push({ type: TOKEN_TYPES.OPERATOR, value: twoChar === '<>' ? '!=' : twoChar, line, col });
      i += 2; col += 2;
      continue;
    }

    // Single-character operators & punctuation
    if (['=', '<', '>', '+', '-', '*', '/', '%'].includes(char)) {
      tokens.push({ type: TOKEN_TYPES.OPERATOR, value: char, line, col });
      i++; col++;
      continue;
    }

    if ([',', '(', ')', ';', '.'].includes(char)) {
      tokens.push({ type: TOKEN_TYPES.PUNCTUATION, value: char, line, col });
      i++; col++;
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
    this.tokens = tokens;
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
      throw new Error(`Expected '${keyword}' at line ${t.line}, col ${t.col}, got '${t.value}'`);
    }
    return this.advance();
  }

  expectPunctuation(char) {
    const t = this.current();
    if (t.type !== TOKEN_TYPES.PUNCTUATION || t.value !== char) {
      throw new Error(`Expected '${char}' at line ${t.line}, col ${t.col}, got '${t.value}'`);
    }
    return this.advance();
  }

  expectIdentifierOrKeyword() {
    const t = this.current();
    if (t.type === TOKEN_TYPES.IDENTIFIER || t.type === TOKEN_TYPES.KEYWORD) {
      return this.advance().value;
    }
    throw new Error(`Expected identifier name at line ${t.line}, col ${t.col}, got '${t.value}'`);
  }

  // --- Parse Statement Dispatcher ---
  parse() {
    const statements = [];
    while (this.current().type !== TOKEN_TYPES.EOF) {
      // Skip leading semicolons
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
    if (t.type !== TOKEN_TYPES.KEYWORD) {
      throw new Error(`Expected SQL statement keyword at line ${t.line}, col ${t.col}, got '${t.value}'`);
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
      default:
        throw new Error(`Unsupported SQL command '${t.value}' at line ${t.line}, col ${t.col}`);
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
      } else if (this.current().type === TOKEN_TYPES.IDENTIFIER && !['FROM', 'WHERE', 'JOIN', 'GROUP', 'ORDER', 'LIMIT'].includes(this.current().value.toUpperCase())) {
        alias = this.advance().value;
      }
      columns.push({ expr, alias });

      if (this.current().type === TOKEN_TYPES.PUNCTUATION && this.current().value === ',') {
        this.advance();
      } else {
        break;
      }
    }

    // FROM clause
    let from = null;
    if (this.matchKeyword('FROM')) {
      const tableName = this.expectIdentifierOrKeyword();
      let tableAlias = null;
      if (this.matchKeyword('AS')) {
        tableAlias = this.expectIdentifierOrKeyword();
      } else if (this.current().type === TOKEN_TYPES.IDENTIFIER && !['WHERE', 'JOIN', 'INNER', 'LEFT', 'GROUP', 'ORDER', 'LIMIT'].includes(this.current().value.toUpperCase())) {
        tableAlias = this.advance().value;
      }
      from = { table: tableName, alias: tableAlias || tableName };
    }

    // JOIN clauses (INNER JOIN, LEFT JOIN)
    const joins = [];
    while (this.matchKeyword('JOIN') || this.matchKeyword('INNER') || this.matchKeyword('LEFT')) {
      let joinType = 'INNER';
      const prevVal = this.tokens[this.pos - 1].value.toUpperCase();
      if (prevVal === 'LEFT') {
        this.matchKeyword('JOIN');
        joinType = 'LEFT';
      } else if (prevVal === 'INNER') {
        this.expectKeyword('JOIN');
        joinType = 'INNER';
      }

      const joinTable = this.expectIdentifierOrKeyword();
      let joinAlias = null;
      if (this.matchKeyword('AS')) {
        joinAlias = this.expectIdentifierOrKeyword();
      } else if (this.current().type === TOKEN_TYPES.IDENTIFIER && this.current().value.toUpperCase() !== 'ON') {
        joinAlias = this.advance().value;
      }

      this.expectKeyword('ON');
      const onCond = this.parseExpression();
      joins.push({ type: joinType, table: joinTable, alias: joinAlias || joinTable, on: onCond });
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
      const op = this.advance(); // '='
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
            defaultValue = this.advance().value;
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

  // --- Expression Parser (Arithmetic, Logic, Functions) ---
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

    // LIKE, IS NULL, IN, BETWEEN
    if (this.matchKeyword('LIKE')) {
      const right = this.parseAdditive();
      return { type: 'BINARY_OP', op: 'LIKE', left, right };
    }
    if (this.matchKeyword('IS')) {
      const isNot = this.matchKeyword('NOT');
      this.expectKeyword('NULL');
      return { type: 'IS_NULL', expr: left, not: isNot };
    }
    if (this.matchKeyword('IN')) {
      this.expectPunctuation('(');
      const list = [];
      while (true) {
        list.push(this.parseExpression());
        if (this.current().type === TOKEN_TYPES.PUNCTUATION && this.current().value === ',') {
          this.advance();
        } else break;
      }
      this.expectPunctuation(')');
      return { type: 'IN', expr: left, list };
    }

    if (this.current().type === TOKEN_TYPES.OPERATOR && ['=', '!=', '<', '<=', '>', '>='].includes(this.current().value)) {
      const op = this.advance().value;
      const right = this.parseAdditive();
      return { type: 'BINARY_OP', op, left, right };
    }

    return left;
  }

  parseAdditive() {
    let left = this.parseMultiplicative();
    while (this.current().type === TOKEN_TYPES.OPERATOR && ['+', '-'].includes(this.current().value)) {
      const op = this.advance().value;
      const right = this.parseMultiplicative();
      left = { type: 'BINARY_OP', op, left, right };
    }
    return left;
  }

  parseMultiplicative() {
    let left = this.parsePrimary();
    while (this.current().type === TOKEN_TYPES.OPERATOR && ['*', '/', '%'].includes(this.current().value)) {
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

    // Parentheses
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

    // Aggregations & Function Calls (COUNT, SUM, AVG, MIN, MAX)
    if (t.type === TOKEN_TYPES.KEYWORD && ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX'].includes(t.value)) {
      const funcName = this.advance().value;
      this.expectPunctuation('(');
      const isDistinct = this.matchKeyword('DISTINCT');
      let argExpr = null;
      if (this.current().type === TOKEN_TYPES.OPERATOR && this.current().value === '*') {
        this.advance();
        argExpr = { type: 'WILDCARD' };
      } else {
        argExpr = this.parseExpression();
      }
      this.expectPunctuation(')');
      return { type: 'AGGREGATE', func: funcName, arg: argExpr, isDistinct };
    }

    // Boolean Literals
    if (t.type === TOKEN_TYPES.KEYWORD && (t.value === 'TRUE' || t.value === 'FALSE')) {
      this.advance();
      return { type: 'LITERAL', value: t.value === 'TRUE', rawType: 'BOOLEAN' };
    }
    if (t.type === TOKEN_TYPES.KEYWORD && t.value === 'NULL') {
      this.advance();
      return { type: 'LITERAL', value: null, rawType: 'NULL' };
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

    throw new Error(`Unexpected token '${t.value}' at line ${t.line}, col ${t.col}`);
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
    return this.columns.find(c => c.name.toLowerCase() === colName.toLowerCase());
  }

  insertRow(rowObj) {
    // Validate types and constraints
    const row = {};
    for (const col of this.columns) {
      let val = rowObj[col.name] !== undefined ? rowObj[col.name] : col.defaultValue;

      if (val === undefined || val === null) {
        if (col.isNotNull && !col.isPrimaryKey) {
          throw new Error(`Column '${col.name}' cannot be NULL in table '${this.name}'`);
        }
        val = null;
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

    if (upperType === 'INTEGER') {
      const num = parseInt(val, 10);
      return isNaN(num) ? 0 : num;
    }
    if (upperType === 'REAL' || upperType === 'FLOAT' || upperType === 'DOUBLE') {
      const num = parseFloat(val);
      return isNaN(num) ? 0.0 : num;
    }
    if (upperType === 'BOOLEAN') {
      if (typeof val === 'boolean') return val;
      return String(val).toLowerCase() === 'true' || val === 1;
    }
    return String(val);
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
 * Processes SELECT (Joins, Aggregations, Grouping, Having), DML (Insert, Update, Delete), and DDL operations.
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
        rowMap[k] = v; // Allow un-prefixed access if unique
      }
      return rowMap;
    });

    availableColumns = table.columns.map(c => ({ name: c.name, table: tAlias, type: c.type }));
  } else {
    // Single row dummy query (e.g. SELECT 1 + 1)
    workingRows = [{}];
  }

  // 2. JOIN clauses (INNER JOIN, LEFT JOIN)
  if (stmt.joins && stmt.joins.length > 0) {
    for (const join of stmt.joins) {
      const joinTable = db.getTable(join.table);
      if (!joinTable) {
        throw new Error(`Joined table '${join.table}' not found.`);
      }

      const jAlias = join.alias || join.table;
      const newRows = [];

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
        rowObj[col.name] = valRow[idx] ? evaluateExpression(valRow[idx], {}) : null;
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
        row[assign.column] = evaluateExpression(assign.expr, row);
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

// --- 5. DDL (Create, Drop, Alter) ---
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
        case 'AND': return Boolean(left && right);
        case 'OR': return Boolean(left || right);
        case 'LIKE': {
          const regex = new RegExp('^' + String(right).replace(/%/g, '.*').replace(/_/g, '.') + '$', 'i');
          return regex.test(String(left));
        }
      }
      return false;
    }

    case 'IS_NULL': {
      const val = evaluateExpression(expr.expr, row);
      const isNull = val === null || val === undefined;
      return expr.not ? !isNull : isNull;
    }

    case 'IN': {
      const val = evaluateExpression(expr.expr, row);
      const listVals = expr.list.map(e => evaluateExpression(e, row));
      return listVals.includes(val);
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
      case 'AND': return Boolean(left && right);
      case 'OR': return Boolean(left || right);
    }
    return false;
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

    if (func === 'SUM') return numbers.reduce((a, b) => a + b, 0);
    if (func === 'AVG') return parseFloat((numbers.reduce((a, b) => a + b, 0) / numbers.length).toFixed(2));
    if (func === 'MIN') return Math.min(...numbers);
    if (func === 'MAX') return Math.max(...numbers);
  }

  // Fallback to first row evaluation for normal expressions
  return evaluateExpression(expr, rows[0] || {});
}

function hasAggregateFunc(expr) {
  if (!expr) return false;
  if (expr.type === 'AGGREGATE') return true;
  if (expr.left && hasAggregateFunc(expr.left)) return true;
  if (expr.right && hasAggregateFunc(expr.right)) return true;
  return false;
}

function getColumnExpressionName(expr, index) {
  if (expr.type === 'COLUMN') return expr.column;
  if (expr.type === 'AGGREGATE') return `${expr.func.toLowerCase()}_${index + 1}`;
  if (expr.type === 'WILDCARD') return '*';
  return `col_${index + 1}`;
}


/* --- MODULE: js/editor/sample-data.js --- */
/**
 * QueryLab - Sample Relational Databases & Query Catalog
 * Rich demonstration schemas for E-Commerce ("ShopMart") and Enterprise HR ("TechCorp").
 */

const SAMPLE_DATABASES = {
  shopmart: {
    id: 'db_shopmart',
    name: 'ShopMart (E-Commerce)',
    tables: {
      customers: {
        name: 'customers',
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true },
          { name: 'name', type: 'TEXT', isNotNull: true },
          { name: 'email', type: 'TEXT', isUnique: true, isNotNull: true },
          { name: 'country', type: 'TEXT', defaultValue: 'USA' },
          { name: 'signup_date', type: 'DATE' },
          { name: 'active', type: 'BOOLEAN', defaultValue: true }
        ],
        rows: [
          { id: 1, name: 'Alice Walker', email: 'alice@example.com', country: 'USA', signup_date: '2023-01-15', active: true },
          { id: 2, name: 'Bob Miller', email: 'bob@example.com', country: 'UK', signup_date: '2023-02-20', active: true },
          { id: 3, name: 'Claire Dubois', email: 'claire@example.fr', country: 'France', signup_date: '2023-03-10', active: true },
          { id: 4, name: 'David Tanaka', email: 'david@example.jp', country: 'Japan', signup_date: '2023-04-05', active: false },
          { id: 5, name: 'Elena Rostova', email: 'elena@example.de', country: 'Germany', signup_date: '2023-05-18', active: true }
        ],
        foreignKeys: []
      },
      products: {
        name: 'products',
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true },
          { name: 'product_name', type: 'TEXT', isNotNull: true },
          { name: 'category', type: 'TEXT', isNotNull: true },
          { name: 'price', type: 'REAL', isNotNull: true },
          { name: 'stock_qty', type: 'INTEGER', defaultValue: 0 }
        ],
        rows: [
          { id: 101, product_name: 'Wireless Noise-Canceling Headphones', category: 'Electronics', price: 199.99, stock_qty: 45 },
          { id: 102, product_name: 'Mechanical Gaming Keyboard', category: 'Electronics', price: 89.50, stock_qty: 120 },
          { id: 103, product_name: 'Ergonomic Office Chair', category: 'Furniture', price: 249.00, stock_qty: 15 },
          { id: 104, product_name: 'Ceramic Pour-Over Coffee Dripper', category: 'Home & Kitchen', price: 28.00, stock_qty: 80 },
          { id: 105, product_name: 'Stainless Steel Water Bottle 1L', category: 'Home & Kitchen', price: 22.95, stock_qty: 200 },
          { id: 106, product_name: 'Ultra-Wide Curved Monitor 34-inch', category: 'Electronics', price: 499.00, stock_qty: 8 }
        ],
        foreignKeys: []
      },
      orders: {
        name: 'orders',
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true },
          { name: 'customer_id', type: 'INTEGER', isNotNull: true },
          { name: 'order_date', type: 'DATE', isNotNull: true },
          { name: 'total_amount', type: 'REAL', isNotNull: true },
          { name: 'status', type: 'TEXT', defaultValue: 'completed' }
        ],
        rows: [
          { id: 5001, customer_id: 1, order_date: '2023-06-01', total_amount: 289.49, status: 'completed' },
          { id: 5002, customer_id: 2, order_date: '2023-06-04', total_amount: 89.50, status: 'completed' },
          { id: 5003, customer_id: 1, order_date: '2023-06-12', total_amount: 499.00, status: 'completed' },
          { id: 5004, customer_id: 3, order_date: '2023-06-15', total_amount: 50.95, status: 'shipped' },
          { id: 5005, customer_id: 5, order_date: '2023-06-20', total_amount: 249.00, status: 'pending' }
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
          { id: 1, order_id: 5001, product_id: 101, quantity: 1, unit_price: 199.99 },
          { id: 2, order_id: 5001, product_id: 102, quantity: 1, unit_price: 89.50 },
          { id: 3, order_id: 5002, product_id: 102, quantity: 1, unit_price: 89.50 },
          { id: 4, order_id: 5003, product_id: 106, quantity: 1, unit_price: 499.00 }
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
          { name: 'location', type: 'TEXT', isNotNull: true }
        ],
        rows: [
          { id: 10, dept_name: 'Engineering', location: 'San Francisco, CA' },
          { id: 20, dept_name: 'Product Design', location: 'New York, NY' },
          { id: 30, dept_name: 'Marketing & Sales', location: 'London, UK' },
          { id: 40, dept_name: 'Human Resources', location: 'Austin, TX' }
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
          { name: 'hire_date', type: 'DATE' },
          { name: 'salary', type: 'REAL', isNotNull: true },
          { name: 'dept_id', type: 'INTEGER' }
        ],
        rows: [
          { id: 1001, first_name: 'Sarah', last_name: 'Connor', email: 'sarah.c@techcorp.io', hire_date: '2021-03-01', salary: 145000, dept_id: 10 },
          { id: 1002, first_name: 'Marcus', last_name: 'Aurelius', email: 'marcus.a@techcorp.io', hire_date: '2020-08-15', salary: 160000, dept_id: 10 },
          { id: 1003, first_name: 'Jessica', last_name: 'Pearson', email: 'jessica.p@techcorp.io', hire_date: '2019-11-20', salary: 135000, dept_id: 20 },
          { id: 1004, first_name: 'Harvey', last_name: 'Specter', email: 'harvey.s@techcorp.io', hire_date: '2022-01-10', salary: 120000, dept_id: 30 },
          { id: 1005, first_name: 'Donna', last_name: 'Paulsen', email: 'donna.p@techcorp.io', hire_date: '2021-06-05', salary: 95000, dept_id: 40 }
        ],
        foreignKeys: [
          { column: 'dept_id', refTable: 'departments', refColumn: 'id' }
        ]
      }
    }
  }
};

const QUICK_QUERIES = [
  {
    name: 'Top Products by Price',
    sql: `SELECT id, product_name, category, price, stock_qty\nFROM products\nORDER BY price DESC\nLIMIT 5;`
  },
  {
    name: 'Customer Spend Summary (INNER JOIN)',
    sql: `SELECT \n  c.name AS customer_name,\n  c.country,\n  COUNT(o.id) AS total_orders,\n  SUM(o.total_amount) AS total_spent\nFROM customers c\nINNER JOIN orders o ON c.id = o.customer_id\nGROUP BY c.name, c.country\nORDER BY total_spent DESC;`
  },
  {
    name: 'Category Average & Max Price (GROUP BY & HAVING)',
    sql: `SELECT \n  category,\n  COUNT(*) AS item_count,\n  AVG(price) AS average_price,\n  MAX(price) AS highest_price\nFROM products\nGROUP BY category\nHAVING average_price > 30.00;`
  },
  {
    name: 'Orders with Customer Details (LEFT JOIN)',
    sql: `SELECT \n  o.id AS order_id,\n  o.order_date,\n  c.name AS customer_name,\n  o.total_amount,\n  o.status\nFROM orders o\nLEFT JOIN customers c ON o.customer_id = c.id\nWHERE o.status = 'completed';`
  },
  {
    name: 'Insert New Customer Record',
    sql: `INSERT INTO customers (id, name, email, country, signup_date, active)\nVALUES (6, 'Gordon Freeman', 'gordon@blackmesa.gov', 'USA', '2023-07-01', TRUE);`
  }
];


/* --- MODULE: js/editor/editor.js --- */
/**
 * QueryLab - Code Editor Component
 * Monospaced SQL editor with line numbers, syntax highlighting, autocomplete, and query formatting.
 */




class SQLEditor {
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


/* --- MODULE: js/editor/schema-browser.js --- */
/**
 * QueryLab - Database Explorer / Schema Browser Panel
 * Tree view displaying database tables, columns, data types, constraints, and quick queries.
 */



function renderSchemaBrowser(container, {
  database,
  onTableSelect = null,
  onQuickQuery = null,
  onOpenTableDesigner = null,
  onDropTable = null
}) {
  const tables = Object.values(database.tables || {});

  container.innerHTML = `
    <!-- Header -->
    <div class="panel-section-header flex items-center justify-between p-3 border-b">
      <div class="flex items-center gap-2">
        ${getIcon('database', 'icon-sm text-primary')}
        <span class="text-xs font-bold uppercase text-muted truncate">${escapeHTML(database.name)}</span>
      </div>
      <button class="btn btn-xs btn-primary" id="btn-open-designer" title="Create New Table Visually">
        ${getIcon('plus', 'icon-xs')} Table
      </button>
    </div>

    <!-- Tree View -->
    <div class="schema-tree-scroll p-2 flex flex-col gap-1 flex-1 overflow-y-auto">
      ${tables.length === 0 ? `
        <div class="text-xs text-muted text-center p-4">No tables in database. Click "+ Table" or run CREATE TABLE.</div>
      ` : tables.map(t => {
        const numRows = (t.rows || []).length;

        return `
          <div class="schema-table-node card p-2 mb-1" data-table="${escapeHTML(t.name)}">
            <!-- Table Header Row -->
            <div class="flex items-center justify-between cursor-pointer table-header-row mb-1">
              <div class="flex items-center gap-2 flex-1">
                <span class="text-primary">${getIcon('table', 'icon-xs')}</span>
                <span class="font-bold text-xs text-primary">${escapeHTML(t.name)}</span>
                <span class="badge badge-secondary text-xs font-mono" style="font-size: 10px;">${numRows} rows</span>
              </div>

              <div class="flex items-center gap-1">
                <button class="btn-icon-xs btn-table-quick-select" data-table="${escapeHTML(t.name)}" title="Query: SELECT * FROM ${escapeHTML(t.name)}">
                  ${getIcon('play', 'icon-xs text-emerald')}
                </button>
                <button class="btn-icon-xs text-rose btn-table-drop" data-table="${escapeHTML(t.name)}" title="Drop Table">
                  ${getIcon('trash', 'icon-xs')}
                </button>
              </div>
            </div>

            <!-- Columns List -->
            <div class="table-columns-list pl-3 flex flex-col gap-1 border-t pt-1 mt-1">
              ${t.columns.map(c => {
                const isPK = c.isPrimaryKey;
                const isFK = (t.foreignKeys || []).some(fk => fk.column === c.name);

                return `
                  <div class="column-item-row flex items-center justify-between text-xs py-0.5">
                    <div class="flex items-center gap-1.5 truncate">
                      ${isPK ? `<span class="badge badge-primary font-mono" style="font-size: 9px; padding: 1px 3px;">PK</span>` : ''}
                      ${isFK ? `<span class="badge badge-secondary font-mono text-amber" style="font-size: 9px; padding: 1px 3px;">FK</span>` : ''}
                      <span class="font-mono text-secondary">${escapeHTML(c.name)}</span>
                    </div>
                    <span class="text-muted font-mono" style="font-size: 10px;">${c.type || 'TEXT'}</span>
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
  container.querySelector('#btn-open-designer')?.addEventListener('click', () => {
    if (onOpenTableDesigner) onOpenTableDesigner();
  });

  container.querySelectorAll('.btn-table-quick-select').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tName = btn.dataset.table;
      if (onQuickQuery) onQuickQuery(`SELECT * FROM ${tName} LIMIT 50;`);
    });
  });

  container.querySelectorAll('.btn-table-drop').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tName = btn.dataset.table;
      if (confirm(`Are you sure you want to DROP TABLE '${tName}'?`)) {
        if (onDropTable) onDropTable(tName);
      }
    });
  });
}


/* --- MODULE: js/editor/results-grid.js --- */
/**
 * QueryLab - Tabular Results Grid Component
 * Renders SQL query output, execution timing, sortable columns, errors, and CSV/JSON export.
 */



function renderResultsGrid(container, result, error = null) {
  if (error) {
    container.innerHTML = `
      <div class="results-header-bar flex items-center justify-between px-3 py-1 border-b">
        <div class="flex items-center gap-2">
          <span class="badge badge-danger font-mono text-xs">QUERY ERROR</span>
        </div>
      </div>
      <div class="p-4">
        <div class="card p-3 border-rose bg-rose-subtle text-rose font-mono text-xs" style="border-color: var(--accent-rose); background-color: var(--accent-rose-subtle);">
          <strong>Error:</strong> ${escapeHTML(error.message || String(error))}
        </div>
      </div>
    `;
    return;
  }

  if (!result) {
    container.innerHTML = `
      <div class="results-header-bar flex items-center justify-between px-3 py-1 border-b">
        <span class="text-xs text-muted font-mono">RESULTS</span>
      </div>
      <div class="p-6 text-center text-muted text-xs font-mono">
        Write a SQL query and click "Run Query" (Ctrl+Enter) to view results.
      </div>
    `;
    return;
  }

  // DML / DDL result (Insert, Update, Delete, Create, Drop)
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
  const rows = result.rows || [];

  container.innerHTML = `
    <!-- Top Result Action Bar -->
    <div class="results-header-bar flex items-center justify-between px-3 py-1 border-b">
      <div class="flex items-center gap-2">
        <span class="badge badge-success font-mono text-xs">SUCCESS</span>
        <span class="text-xs text-secondary font-mono font-semibold">${rows.length} row(s) returned</span>
        <span class="text-xs text-muted font-mono">in ${result.executionTimeMs || '0'}ms</span>
      </div>

      <div class="flex items-center gap-2">
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
        <div class="p-6 text-center text-muted text-xs font-mono">Query returned 0 rows.</div>
      ` : `
        <table class="data-grid-table font-mono text-xs">
          <thead>
            <tr>
              <th class="row-index-col">#</th>
              ${columns.map(c => `<th class="data-col-header" data-col="${escapeHTML(c.name)}">${escapeHTML(c.name)}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map((row, rIdx) => `
              <tr>
                <td class="row-index-col">${rIdx + 1}</td>
                ${columns.map(c => {
                  const val = row[c.name];
                  return `<td>${formatCellValue(val)}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    </div>
  `;

  // Attach CSV / JSON exporters
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
    return `<span class="badge ${val ? 'badge-success' : 'badge-secondary'}" style="font-size: 9px;">${val ? 'TRUE' : 'FALSE'}</span>`;
  }
  if (typeof val === 'number') {
    return `<span class="cell-number">${val}</span>`;
  }
  return escapeHTML(String(val));
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
  a.download = 'query_results.csv';
  a.click();
}

function exportToJSON(rows) {
  const json = JSON.stringify(rows, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'query_results.json';
  a.click();
}


/* --- MODULE: js/editor/erd-viewer.js --- */
/**
 * QueryLab - Visual ERD (Entity-Relationship Diagram) Viewer
 * Interactive Canvas 2D schema visualizer with schema cards and relationship bezier connectors.
 */



class ERDViewer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = { x: 40, y: 40, zoom: 1 };
    this.database = null;
    this.tablePositions = {};
    this.isPanning = false;
    this.lastMouse = { x: 0, y: 0 };

    this.initListeners();
  }

  resize(width, height) {
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
      this.isPanning = true;
      this.lastMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isPanning) {
        const dx = e.clientX - this.lastMouse.x;
        const dy = e.clientY - this.lastMouse.y;
        this.camera.x += dx;
        this.camera.y += dy;
        this.lastMouse = { x: e.clientX, y: e.clientY };
        this.render();
      }
    });

    window.addEventListener('mouseup', () => {
      this.isPanning = false;
    });

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
      this.camera.zoom = Math.max(0.2, Math.min(3, this.camera.zoom * zoomFactor));
      this.render();
    });
  }

  calculateLayout() {
    if (!this.database) return;
    const tables = Object.values(this.database.tables || {});
    this.tablePositions = {};

    const cardWidth = 240;
    const spacingX = 80;
    const spacingY = 60;
    const cols = Math.min(3, Math.max(1, Math.ceil(Math.sqrt(tables.length))));

    tables.forEach((t, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const cardHeight = 40 + t.columns.length * 24 + 10;

      this.tablePositions[t.name.toLowerCase()] = {
        x: col * (cardWidth + spacingX) + 50,
        y: row * (cardHeight + spacingY) + 50,
        width: cardWidth,
        height: cardHeight,
        table: t
      };
    });
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // 1. Clear background
    ctx.fillStyle = '#0f1117';
    ctx.fillRect(0, 0, w, h);

    if (!this.database) return;

    ctx.save();
    ctx.translate(this.camera.x, this.camera.y);
    ctx.scale(this.camera.zoom, this.camera.zoom);

    // 2. Draw Foreign Key Bezier Connectors
    this.drawRelationshipLines();

    // 3. Draw Schema Table Cards
    for (const [tKey, pos] of Object.entries(this.tablePositions)) {
      this.drawTableCard(pos);
    }

    ctx.restore();
  }

  drawTableCard(pos) {
    const ctx = this.ctx;
    const { x, y, width, height, table } = pos;

    ctx.save();

    // Card Body Background
    ctx.fillStyle = '#161b22';
    ctx.strokeStyle = '#30363d';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, [6]);
    ctx.fill();
    ctx.stroke();

    // Card Header Bar
    ctx.fillStyle = '#21262d';
    ctx.beginPath();
    ctx.roundRect(x, y, width, 34, [6, 6, 0, 0]);
    ctx.fill();
    ctx.strokeStyle = '#30363d';
    ctx.beginPath();
    ctx.moveTo(x, y + 34); ctx.lineTo(x + width, y + 34);
    ctx.stroke();

    // Table Name
    ctx.fillStyle = '#58a6ff';
    ctx.font = "bold 13px 'JetBrains Mono', monospace";
    ctx.fillText(table.name, x + 12, y + 22);

    // Columns
    let colY = y + 54;
    table.columns.forEach((c) => {
      const isPK = c.isPrimaryKey;
      const isFK = (table.foreignKeys || []).some(fk => fk.column === c.name);

      ctx.fillStyle = isPK ? '#f0f6fc' : '#c9d1d9';
      ctx.font = `${isPK ? 'bold ' : ''}11px 'JetBrains Mono', monospace`;

      let labelX = x + 12;
      if (isPK) {
        ctx.fillStyle = '#58a6ff';
        ctx.fillText('PK', labelX, colY);
        labelX += 24;
      } else if (isFK) {
        ctx.fillStyle = '#d29922';
        ctx.fillText('FK', labelX, colY);
        labelX += 24;
      }

      ctx.fillStyle = '#f0f6fc';
      ctx.fillText(c.name, labelX, colY);

      // Type Badge
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
      if (!table.foreignKeys) continue;

      for (const fk of table.foreignKeys) {
        const targetPos = this.tablePositions[fk.refTable.toLowerCase()];
        if (!targetPos) continue;

        // Source column position
        const colIdx = table.columns.findIndex(c => c.name === fk.column);
        const srcY = pos.y + 54 + (colIdx >= 0 ? colIdx : 0) * 24 - 4;
        const srcX = pos.x + pos.width;

        // Target table position
        const targetColIdx = targetPos.table.columns.findIndex(c => c.name === fk.refColumn);
        const dstY = targetPos.y + 54 + (targetColIdx >= 0 ? targetColIdx : 0) * 24 - 4;
        const dstX = targetPos.x;

        // Draw Bezier Curve
        ctx.save();
        ctx.strokeStyle = '#58a6ff';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);

        const cpX1 = srcX + 40;
        const cpX2 = dstX - 40;

        ctx.beginPath();
        ctx.moveTo(srcX, srcY);
        ctx.bezierCurveTo(cpX1, srcY, cpX2, dstY, dstX, dstY);
        ctx.stroke();

        // Arrow Endpoint
        ctx.fillStyle = '#58a6ff';
        ctx.beginPath();
        ctx.arc(srcX, srcY, 4, 0, Math.PI * 2);
        ctx.arc(dstX, dstY, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }
  }
}


/* --- MODULE: js/editor/table-designer.js --- */
/**
 * QueryLab - Visual Table Designer Modal
 * Visual UI to design database tables, columns, data types, and primary key constraints.
 */



class TableDesignerModal {
  constructor(modalContainer, onSaveTable) {
    this.container = modalContainer;
    this.onSaveTable = onSaveTable;
    this.tableName = 'new_table';
    this.columns = [
      { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true, isUnique: false, defaultValue: '' },
      { name: 'name', type: 'TEXT', isPrimaryKey: false, isNotNull: true, isUnique: false, defaultValue: '' }
    ];
  }

  open() {
    this.tableName = 'table_' + Math.floor(Math.random() * 1000);
    this.columns = [
      { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true, isUnique: false, defaultValue: '' },
      { name: 'name', type: 'TEXT', isPrimaryKey: false, isNotNull: true, isUnique: false, defaultValue: '' }
    ];
    this.render();
    this.container.classList.add('active');
  }

  close() {
    this.container.classList.remove('active');
  }

  render() {
    this.container.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-dialog table-designer-dialog">
        <div class="modal-header flex items-center justify-between p-3 border-b">
          <div class="flex items-center gap-2">
            ${getIcon('table', 'icon-sm text-primary')}
            <span class="font-bold text-sm">Visual Table Designer</span>
          </div>
          <button class="btn-icon-xs btn-modal-close">&times;</button>
        </div>

        <div class="modal-body p-4 flex flex-col gap-3">
          <!-- Table Name -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold">Table Name</label>
            <input type="text" id="designer-table-name" class="form-control form-control-sm font-bold font-mono" value="${escapeHTML(this.tableName)}" />
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
                  <th>Column Name</th>
                  <th>Type</th>
                  <th>PK</th>
                  <th>Not Null</th>
                  <th>Unique</th>
                  <th>Default</th>
                  <th></th>
                </tr>
              </thead>
              <tbody id="designer-columns-body">
                ${this.columns.map((col, idx) => `
                  <tr>
                    <td>
                      <input type="text" class="form-control form-control-sm font-mono col-prop-name" data-idx="${idx}" value="${escapeHTML(col.name)}" />
                    </td>
                    <td>
                      <select class="form-control form-control-sm font-mono col-prop-type" data-idx="${idx}">
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
                      <input type="text" class="form-control form-control-sm font-mono col-prop-def" data-idx="${idx}" value="${escapeHTML(col.defaultValue || '')}" placeholder="NULL" />
                    </td>
                    <td class="text-center">
                      ${this.columns.length > 1 ? `
                        <button class="btn-icon-xs text-rose btn-designer-del-col" data-idx="${idx}">&times;</button>
                      ` : ''}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="modal-footer p-3 border-t flex justify-end gap-2">
          <button class="btn btn-sm btn-secondary btn-modal-close">Cancel</button>
          <button class="btn btn-sm btn-primary" id="btn-save-designed-table">Create Table</button>
        </div>
      </div>
    `;

    this.initEvents();
  }

  initEvents() {
    this.container.querySelectorAll('.btn-modal-close, .modal-backdrop').forEach(b => {
      b.addEventListener('click', () => this.close());
    });

    this.container.querySelector('#designer-table-name')?.addEventListener('input', (e) => {
      this.tableName = e.target.value;
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
      });
    });
    this.container.querySelectorAll('.col-prop-type').forEach(sel => {
      sel.addEventListener('change', (e) => {
        this.columns[parseInt(e.target.dataset.idx, 10)].type = e.target.value;
      });
    });
    this.container.querySelectorAll('.col-prop-pk').forEach(chk => {
      chk.addEventListener('change', (e) => {
        this.columns[parseInt(e.target.dataset.idx, 10)].isPrimaryKey = e.target.checked;
      });
    });
    this.container.querySelectorAll('.col-prop-nn').forEach(chk => {
      chk.addEventListener('change', (e) => {
        this.columns[parseInt(e.target.dataset.idx, 10)].isNotNull = e.target.checked;
      });
    });
    this.container.querySelectorAll('.col-prop-uq').forEach(chk => {
      chk.addEventListener('change', (e) => {
        this.columns[parseInt(e.target.dataset.idx, 10)].isUnique = e.target.checked;
      });
    });
    this.container.querySelectorAll('.col-prop-def').forEach(inp => {
      inp.addEventListener('input', (e) => {
        this.columns[parseInt(e.target.dataset.idx, 10)].defaultValue = e.target.value;
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
      const name = this.container.querySelector('#designer-table-name').value.trim();
      if (!name) return alert('Please enter a table name.');

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
          }))
        });
      }
      this.close();
    });
  }
}


/* --- MODULE: js/app.js --- */
/**
 * QueryLab - Master Application Orchestrator
 * Integrates SQL Lexer, Parser, Evaluator, Schema Browser, Results Grid, ERD Visualizer, and Table Designer.
 */














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


})();
