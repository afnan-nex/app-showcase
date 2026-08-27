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
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER', 'ON',
  'GROUP', 'BY', 'HAVING', 'ORDER', 'LIMIT', 'OFFSET', 'AS', 'DISTINCT',
  'ASC', 'DESC', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
  'CREATE', 'TABLE', 'DROP', 'ALTER', 'ADD', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES',
  'NOT', 'NULL', 'UNIQUE', 'DEFAULT', 'CHECK', 'AND', 'OR', 'LIKE', 'IN', 'BETWEEN', 'IS',
  'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'IF', 'EXISTS', 'INTEGER', 'TEXT', 'REAL', 'BOOLEAN', 'DATE'
]);

export function tokenize(sql) {
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
