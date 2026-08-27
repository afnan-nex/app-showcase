/**
 * QueryLab - Sample Relational Databases & Query Catalog
 * Rich demonstration schemas for E-Commerce ("ShopMart") and Enterprise HR ("TechCorp").
 */

export const SAMPLE_DATABASES = {
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

export const QUICK_QUERIES = [
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
