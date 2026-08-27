/**
 * QueryLab - Relational SQL Evaluator Engine
 * Processes SELECT (Joins, Aggregations, Grouping, Having), DML (Insert, Update, Delete), and DDL operations.
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
