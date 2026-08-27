/**
 * QueryLab - Automated Verification Test Suite
 * Tests SQL Lexer, AST Parser, Relational Evaluator, Functions, DML/DDL, and Export Utilities.
 */

import { tokenize } from './js/engine/lexer.js';
import { SQLParser } from './js/engine/parser.js';
import { executeQuery } from './js/engine/evaluator.js';
import { Database } from './js/engine/database.js';
import { SAMPLE_DATABASES, QUICK_QUERIES } from './js/editor/sample-data.js';

console.log('========================================================');
console.log('--- 1. Testing SQL Tokenizer / Lexer ---');
const sampleSQL = `SELECT id, product_name, price * 1.1 AS price_with_tax FROM products WHERE category_id = 1 AND price >= 100 ORDER BY price DESC LIMIT 5;`;
const tokens = tokenize(sampleSQL);
console.log('Tokenized tokens count:', tokens.length);
if (tokens.length < 15) throw new Error('Lexer failed to tokenize SQL statement');

console.log('\n--- 2. Testing SQL AST Parser for DDL, DML, and Meta ---');
const testStatements = [
  'SELECT id, name FROM customers WHERE active = TRUE;',
  'INSERT INTO categories (id, category_name, slug) VALUES (6, "Networking", "networking");',
  'UPDATE customers SET city = "Berlin" WHERE id = 5;',
  'DELETE FROM customers WHERE id = 7;',
  'SHOW TABLES;',
  'DESCRIBE products;',
  'EXPLAIN SELECT * FROM orders WHERE total_amount > 100;',
  'TRUNCATE TABLE product_reviews;'
];

for (const sql of testStatements) {
  const pTokens = tokenize(sql);
  const pStmts = new SQLParser(pTokens).parse();
  if (pStmts.length !== 1) throw new Error(`Parser failed for: ${sql}`);
  console.log(`Parsed '${pStmts[0].type}' successfully.`);
}

console.log('\n--- 3. Testing Relational Evaluator: SELECT, Joins, Aggregates, Functions ---');
const db = Database.fromJSON(SAMPLE_DATABASES.shopmart);

// Test 3.1: Multi-Table JOIN
const joinSQL = `
  SELECT 
    c.name AS customer_name,
    c.country,
    COUNT(o.id) AS total_orders,
    SUM(o.total_amount) AS total_spent
  FROM customers c
  INNER JOIN orders o ON c.id = o.customer_id
  GROUP BY c.name, c.country
  HAVING total_spent > 100.00
  ORDER BY total_spent DESC;
`;
const joinRes = executeQuery(new SQLParser(tokenize(joinSQL)).parse()[0], db);
console.log('INNER JOIN Result rows:', joinRes.rowCount);
if (joinRes.rowCount !== 6) throw new Error(`Expected 6 customer spend rows, got ${joinRes.rowCount}`);

// Test 3.2: Scalar Functions (UPPER, LENGTH, ROUND, CASE WHEN)
const funcSQL = `
  SELECT 
    product_name,
    UPPER(product_name) AS upper_name,
    LENGTH(product_name) AS name_len,
    ROUND(price, 1) AS rounded_price,
    CASE 
      WHEN price >= 300 THEN 'High'
      ELSE 'Standard'
    END AS tier
  FROM products
  WHERE price BETWEEN 100 AND 500
  ORDER BY price DESC;
`;
const funcRes = executeQuery(new SQLParser(tokenize(funcSQL)).parse()[0], db);
console.log('Scalar Functions Result rows:', funcRes.rowCount);
if (funcRes.rowCount !== 6) throw new Error(`Expected 6 products in range, got ${funcRes.rowCount}`);

// Test 3.3: Meta Inspection (SHOW TABLES & DESCRIBE)
const showRes = executeQuery(new SQLParser(tokenize('SHOW TABLES;')).parse()[0], db);
console.log('SHOW TABLES count:', showRes.rowCount);
if (showRes.rowCount !== 5) throw new Error(`Expected 5 tables, got ${showRes.rowCount}`);

const descRes = executeQuery(new SQLParser(tokenize('DESCRIBE customers;')).parse()[0], db);
console.log('DESCRIBE customers columns count:', descRes.rowCount);
if (descRes.rowCount !== 7) throw new Error(`Expected 7 columns in customers, got ${descRes.rowCount}`);

console.log('\n--- 4. Testing DML Mutations (INSERT, UPDATE, DELETE) ---');
// Insert
const insertSQL = `INSERT INTO customers (id, name, email, country, city, signup_date, active) VALUES (20, 'Dr. Gordon Freeman', 'g.freeman@blackmesa.org', 'USA', 'Seattle', '2023-08-01', TRUE);`;
const insertRes = executeQuery(new SQLParser(tokenize(insertSQL)).parse()[0], db);
console.log('INSERT result:', insertRes.message);
if (db.getTable('customers').rows.length !== 8) throw new Error('INSERT failed');

// Update
const updateSQL = `UPDATE customers SET country = 'Canada', city = 'Vancouver' WHERE id = 20;`;
const updateRes = executeQuery(new SQLParser(tokenize(updateSQL)).parse()[0], db);
console.log('UPDATE result:', updateRes.message);
const updatedCust = db.getTable('customers').rows.find(r => r.id === 20);
if (updatedCust.country !== 'Canada' || updatedCust.city !== 'Vancouver') throw new Error('UPDATE failed');

// Delete
const deleteSQL = `DELETE FROM customers WHERE id = 20;`;
const deleteRes = executeQuery(new SQLParser(tokenize(deleteSQL)).parse()[0], db);
console.log('DELETE result:', deleteRes.message);
if (db.getTable('customers').rows.length !== 7) throw new Error('DELETE failed');

console.log('\n--- 5. Testing DDL (CREATE TABLE, ALTER TABLE, TRUNCATE, SQL Dump) ---');
const createSQL = `
  CREATE TABLE system_telemetry (
    id INTEGER PRIMARY KEY NOT NULL,
    service_name TEXT NOT NULL,
    uptime_pct REAL DEFAULT 99.9,
    is_healthy BOOLEAN DEFAULT TRUE
  );
`;
const createRes = executeQuery(new SQLParser(tokenize(createSQL)).parse()[0], db);
console.log('CREATE TABLE result:', createRes.message);
if (!db.getTable('system_telemetry')) throw new Error('CREATE TABLE failed');

// Alter Table Add Column
const alterSQL = `ALTER TABLE system_telemetry ADD COLUMN region TEXT;`;
const alterRes = executeQuery(new SQLParser(tokenize(alterSQL)).parse()[0], db);
console.log('ALTER TABLE result:', alterRes.message);
if (!db.getTable('system_telemetry').getColumn('region')) throw new Error('ALTER TABLE ADD COLUMN failed');

// SQL Dump
const sqlDump = db.dumpSQL();
console.log('SQL Dump generated length:', sqlDump.length, 'bytes');
if (!sqlDump.includes('CREATE TABLE customers') || !sqlDump.includes('CREATE TABLE system_telemetry')) {
  throw new Error('SQL Dump missing tables');
}

console.log('\n--- 6. Testing All Quick Queries from Catalog ---');
for (const q of QUICK_QUERIES) {
  const qToks = tokenize(q.sql);
  const qStmts = new SQLParser(qToks).parse();
  let res;
  for (const s of qStmts) {
    res = executeQuery(s, db);
  }
  console.log(`PASS [${q.name}] =>`, res.rowCount !== undefined ? `${res.rowCount} row(s)` : res.message);
}

console.log('\n========================================================');
console.log('ALL QUERYLAB ENGINES, PARSERS & SUITES PASSED 100%!');
console.log('========================================================');
