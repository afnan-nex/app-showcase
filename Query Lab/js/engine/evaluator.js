/**
 * QueryLab - Relational SQL Evaluator Engine
 * Processes SELECT (Joins, Aggregations, Grouping, Having, Scalar Functions), DML, DDL, and Meta Operations.
 */

export function executeQuery(statement, database) {
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
