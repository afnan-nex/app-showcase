/**
 * QueryLab - SQL Lexer / Tokenizer
 * Breaks SQL code into typed tokens with position tracking for syntax analysis.
 */

export const TOKEN_TYPES = {
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

export function tokenize(sql) {
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
