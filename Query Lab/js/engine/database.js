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
