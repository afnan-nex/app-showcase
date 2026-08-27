/**
 * QueryLab - Relational Database State & Memory Storage
 * Manages databases, tables, columns, constraints, foreign keys, and rows in memory.
 */

export class Table {
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

export class Database {
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
