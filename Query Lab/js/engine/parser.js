/**
 * QueryLab - SQL AST Parser
 * Recursive descent parser generating executable AST statements from SQL tokens.
 */

import { TOKEN_TYPES } from './lexer.js';

export class SQLParser {
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
