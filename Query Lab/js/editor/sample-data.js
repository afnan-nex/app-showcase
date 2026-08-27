/**
 * QueryLab - Sample Relational Databases & Query Catalog
 * Production-quality relational schemas and authentic fictional data for realistic SQL exploration.
 */

export const SAMPLE_DATABASES = {
  shopmart: {
    id: 'db_shopmart',
    name: 'ShopMart (E-Commerce)',
    tables: {
      categories: {
        name: 'categories',
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true },
          { name: 'category_name', type: 'TEXT', isNotNull: true, isUnique: true },
          { name: 'slug', type: 'TEXT', isNotNull: true }
        ],
        rows: [
          { id: 1, category_name: 'Audio & Acoustics', slug: 'audio' },
          { id: 2, category_name: 'Computer Peripherals', slug: 'peripherals' },
          { id: 3, category_name: 'Ergonomic Furniture', slug: 'furniture' },
          { id: 4, category_name: 'Displays & Visuals', slug: 'displays' },
          { id: 5, category_name: 'Home Office Essentials', slug: 'home-office' }
        ],
        foreignKeys: []
      },
      customers: {
        name: 'customers',
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true },
          { name: 'name', type: 'TEXT', isNotNull: true },
          { name: 'email', type: 'TEXT', isUnique: true, isNotNull: true },
          { name: 'country', type: 'TEXT', defaultValue: 'USA' },
          { name: 'city', type: 'TEXT' },
          { name: 'signup_date', type: 'DATE' },
          { name: 'active', type: 'BOOLEAN', defaultValue: true }
        ],
        rows: [
          { id: 1, name: 'Elena Vance', email: 'elena.vance@blackmesa.org', country: 'USA', city: 'Seattle', signup_date: '2023-01-15', active: true },
          { id: 2, name: 'Marcus Thorne', email: 'm.thorne@vanguard-sys.co.uk', country: 'UK', city: 'London', signup_date: '2023-02-20', active: true },
          { id: 3, name: 'Claire Dubois', email: 'claire.dubois@lumina-paris.fr', country: 'France', city: 'Paris', signup_date: '2023-03-10', active: true },
          { id: 4, name: 'Kenji Sato', email: 'kenji.sato@techno-tokyo.jp', country: 'Japan', city: 'Tokyo', signup_date: '2023-04-05', active: false },
          { id: 5, name: 'Priya Sharma', email: 'priya.sharma@deccan-labs.in', country: 'India', city: 'Bengaluru', signup_date: '2023-05-18', active: true },
          { id: 6, name: 'Liam O\'Connor', email: 'liam.oc@dublin-craft.ie', country: 'Ireland', city: 'Dublin', signup_date: '2023-06-22', active: true },
          { id: 7, name: 'Sofia Rodriguez', email: 'sofia.r@madrid-digital.es', country: 'Spain', city: 'Madrid', signup_date: '2023-07-09', active: true }
        ],
        foreignKeys: []
      },
      products: {
        name: 'products',
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true },
          { name: 'product_name', type: 'TEXT', isNotNull: true },
          { name: 'category_id', type: 'INTEGER', isNotNull: true },
          { name: 'price', type: 'REAL', isNotNull: true },
          { name: 'stock_qty', type: 'INTEGER', defaultValue: 0 },
          { name: 'rating', type: 'REAL', defaultValue: 4.5 }
        ],
        rows: [
          { id: 101, product_name: 'StudioPro Wireless ANC Headphones', category_id: 1, price: 299.99, stock_qty: 42, rating: 4.8 },
          { id: 102, product_name: 'Mechanical RGB Hot-Swap Keyboard', category_id: 2, price: 139.50, stock_qty: 115, rating: 4.7 },
          { id: 103, product_name: 'Ergonomic Mesh Lumbar Desk Chair', category_id: 3, price: 449.00, stock_qty: 18, rating: 4.9 },
          { id: 104, product_name: 'UltraWide 38-inch Curved IPS Monitor', category_id: 4, price: 899.00, stock_qty: 12, rating: 4.6 },
          { id: 105, product_name: 'Precision Wireless Trackball Mouse', category_id: 2, price: 79.95, stock_qty: 85, rating: 4.4 },
          { id: 106, product_name: 'Solid Walnut Desk Shelf Riser', category_id: 5, price: 119.00, stock_qty: 35, rating: 4.9 },
          { id: 107, product_name: 'Broadcast USB Condenser Microphone', category_id: 1, price: 159.00, stock_qty: 28, rating: 4.7 },
          { id: 108, product_name: 'Dual Monitor Aluminum Gas-Spring Arm', category_id: 4, price: 129.99, stock_qty: 60, rating: 4.5 }
        ],
        foreignKeys: [
          { column: 'category_id', refTable: 'categories', refColumn: 'id' }
        ]
      },
      orders: {
        name: 'orders',
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true },
          { name: 'customer_id', type: 'INTEGER', isNotNull: true },
          { name: 'order_date', type: 'DATE', isNotNull: true },
          { name: 'total_amount', type: 'REAL', isNotNull: true },
          { name: 'status', type: 'TEXT', defaultValue: 'completed' },
          { name: 'payment_method', type: 'TEXT', defaultValue: 'credit_card' }
        ],
        rows: [
          { id: 5001, customer_id: 1, order_date: '2023-06-01', total_amount: 439.49, status: 'completed', payment_method: 'credit_card' },
          { id: 5002, customer_id: 2, order_date: '2023-06-04', total_amount: 139.50, status: 'completed', payment_method: 'paypal' },
          { id: 5003, customer_id: 1, order_date: '2023-06-12', total_amount: 899.00, status: 'completed', payment_method: 'credit_card' },
          { id: 5004, customer_id: 3, order_date: '2023-06-15', total_amount: 119.00, status: 'shipped', payment_method: 'apple_pay' },
          { id: 5005, customer_id: 5, order_date: '2023-06-20', total_amount: 449.00, status: 'pending', payment_method: 'credit_card' },
          { id: 5006, customer_id: 6, order_date: '2023-07-01', total_amount: 379.94, status: 'completed', payment_method: 'credit_card' },
          { id: 5007, customer_id: 7, order_date: '2023-07-14', total_amount: 288.99, status: 'completed', payment_method: 'paypal' }
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
          { id: 1, order_id: 5001, product_id: 101, quantity: 1, unit_price: 299.99 },
          { id: 2, order_id: 5001, product_id: 102, quantity: 1, unit_price: 139.50 },
          { id: 3, order_id: 5002, product_id: 102, quantity: 1, unit_price: 139.50 },
          { id: 4, order_id: 5003, product_id: 104, quantity: 1, unit_price: 899.00 },
          { id: 5, order_id: 5004, product_id: 106, quantity: 1, unit_price: 119.00 },
          { id: 6, order_id: 5005, product_id: 103, quantity: 1, unit_price: 449.00 },
          { id: 7, order_id: 5006, product_id: 101, quantity: 1, unit_price: 299.99 },
          { id: 8, order_id: 5006, product_id: 105, quantity: 1, unit_price: 79.95 },
          { id: 9, order_id: 5007, product_id: 107, quantity: 1, unit_price: 159.00 },
          { id: 10, order_id: 5007, product_id: 108, quantity: 1, unit_price: 129.99 }
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
          { name: 'location', type: 'TEXT', isNotNull: true },
          { name: 'budget', type: 'REAL', defaultValue: 500000.0 }
        ],
        rows: [
          { id: 10, dept_name: 'Core Platform Engineering', location: 'San Francisco, CA', budget: 2400000.0 },
          { id: 20, dept_name: 'Product Experience & UI', location: 'New York, NY', budget: 1100000.0 },
          { id: 30, dept_name: 'Revenue & Enterprise Sales', location: 'London, UK', budget: 1800000.0 },
          { id: 40, dept_name: 'People Operations & HR', location: 'Austin, TX', budget: 650000.0 },
          { id: 50, dept_name: 'Information Security & Trust', location: 'Boston, MA', budget: 950000.0 }
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
          { name: 'job_title', type: 'TEXT', isNotNull: true },
          { name: 'hire_date', type: 'DATE' },
          { name: 'salary', type: 'REAL', isNotNull: true },
          { name: 'dept_id', type: 'INTEGER' }
        ],
        rows: [
          { id: 1001, first_name: 'Sarah', last_name: 'Connor', email: 'sarah.c@techcorp.io', job_title: 'Staff Infrastructure Architect', hire_date: '2020-03-01', salary: 185000, dept_id: 10 },
          { id: 1002, first_name: 'Marcus', last_name: 'Aurelius', email: 'marcus.a@techcorp.io', job_title: 'Principal Systems Engineer', hire_date: '2019-08-15', salary: 195000, dept_id: 10 },
          { id: 1003, first_name: 'Jessica', last_name: 'Pearson', email: 'jessica.p@techcorp.io', job_title: 'VP of Product Design', hire_date: '2018-11-20', salary: 175000, dept_id: 20 },
          { id: 1004, first_name: 'Harvey', last_name: 'Specter', email: 'harvey.s@techcorp.io', job_title: 'Director of Strategic Enterprise Sales', hire_date: '2021-01-10', salary: 165000, dept_id: 30 },
          { id: 1005, first_name: 'Donna', last_name: 'Paulsen', email: 'donna.p@techcorp.io', job_title: 'Head of Global Talent Ops', hire_date: '2021-06-05', salary: 125000, dept_id: 40 },
          { id: 1006, first_name: 'Elliot', last_name: 'Alderson', email: 'elliot.a@techcorp.io', job_title: 'Senior Security Analyst', hire_date: '2022-04-12', salary: 155000, dept_id: 50 },
          { id: 1007, first_name: 'Maya', last_name: 'Lin', email: 'maya.l@techcorp.io', job_title: 'Senior UI/UX Designer', hire_date: '2022-09-01', salary: 130000, dept_id: 20 }
        ],
        foreignKeys: [
          { column: 'dept_id', refTable: 'departments', refColumn: 'id' }
        ]
      },
      projects: {
        name: 'projects',
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true },
          { name: 'project_name', type: 'TEXT', isNotNull: true },
          { name: 'dept_id', type: 'INTEGER', isNotNull: true },
          { name: 'status', type: 'TEXT', defaultValue: 'active' },
          { name: 'target_launch', type: 'DATE' }
        ],
        rows: [
          { id: 201, project_name: 'Distributed Lakehouse Engine v3', dept_id: 10, status: 'active', target_launch: '2024-03-31' },
          { id: 202, project_name: 'NextGen Design System & Tokens', dept_id: 20, status: 'active', target_launch: '2023-12-15' },
          { id: 203, project_name: 'EMEA Enterprise Expansion Hub', dept_id: 30, status: 'completed', target_launch: '2023-09-01' },
          { id: 204, project_name: 'Zero-Trust Identity Mesh', dept_id: 50, status: 'active', target_launch: '2024-06-30' }
        ],
        foreignKeys: [
          { column: 'dept_id', refTable: 'departments', refColumn: 'id' }
        ]
      }
    }
  },

  cloudpulse: {
    id: 'db_cloudpulse',
    name: 'CloudPulse (SaaS Analytics)',
    tables: {
      accounts: {
        name: 'accounts',
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true },
          { name: 'company_name', type: 'TEXT', isNotNull: true },
          { name: 'domain', type: 'TEXT', isUnique: true, isNotNull: true },
          { name: 'tier', type: 'TEXT', defaultValue: 'starter' },
          { name: 'monthly_spend', type: 'REAL', defaultValue: 49.0 },
          { name: 'is_active', type: 'BOOLEAN', defaultValue: true }
        ],
        rows: [
          { id: 1, company_name: 'Stripeflow AI', domain: 'stripeflow.ai', tier: 'enterprise', monthly_spend: 1850.0, is_active: true },
          { id: 2, company_name: 'HyperScale Logistics', domain: 'hyperscale.io', tier: 'growth', monthly_spend: 499.0, is_active: true },
          { id: 3, company_name: 'Aetheria Health Tech', domain: 'aetheria.health', tier: 'enterprise', monthly_spend: 3200.0, is_active: true },
          { id: 4, company_name: 'ByteCraft Studio', domain: 'bytecraft.gg', tier: 'starter', monthly_spend: 49.0, is_active: true },
          { id: 5, company_name: 'OmniVerve Media', domain: 'omniverve.net', tier: 'growth', monthly_spend: 499.0, is_active: false }
        ],
        foreignKeys: []
      },
      api_keys: {
        name: 'api_keys',
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true },
          { name: 'account_id', type: 'INTEGER', isNotNull: true },
          { name: 'key_prefix', type: 'TEXT', isNotNull: true },
          { name: 'environment', type: 'TEXT', defaultValue: 'production' },
          { name: 'total_requests', type: 'INTEGER', defaultValue: 0 }
        ],
        rows: [
          { id: 101, account_id: 1, key_prefix: 'cp_live_9482', environment: 'production', total_requests: 4820194 },
          { id: 102, account_id: 1, key_prefix: 'cp_test_3019', environment: 'staging', total_requests: 120500 },
          { id: 103, account_id: 2, key_prefix: 'cp_live_7718', environment: 'production', total_requests: 981240 },
          { id: 104, account_id: 3, key_prefix: 'cp_live_1102', environment: 'production', total_requests: 8490211 },
          { id: 105, account_id: 4, key_prefix: 'cp_live_5549', environment: 'production', total_requests: 45010 }
        ],
        foreignKeys: [
          { column: 'account_id', refTable: 'accounts', refColumn: 'id' }
        ]
      },
      invoices: {
        name: 'invoices',
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true },
          { name: 'account_id', type: 'INTEGER', isNotNull: true },
          { name: 'invoice_date', type: 'DATE', isNotNull: true },
          { name: 'amount', type: 'REAL', isNotNull: true },
          { name: 'status', type: 'TEXT', defaultValue: 'paid' }
        ],
        rows: [
          { id: 9001, account_id: 1, invoice_date: '2023-07-01', amount: 1850.0, status: 'paid' },
          { id: 9002, account_id: 2, invoice_date: '2023-07-01', amount: 499.0, status: 'paid' },
          { id: 9003, account_id: 3, invoice_date: '2023-07-01', amount: 3200.0, status: 'paid' },
          { id: 9004, account_id: 4, invoice_date: '2023-07-01', amount: 49.0, status: 'paid' },
          { id: 9005, account_id: 1, invoice_date: '2023-08-01', amount: 1850.0, status: 'paid' }
        ],
        foreignKeys: [
          { column: 'account_id', refTable: 'accounts', refColumn: 'id' }
        ]
      }
    }
  },

  grandvista: {
    id: 'db_grandvista',
    name: 'GrandVista (Hotel & Resorts)',
    tables: {
      rooms: {
        name: 'rooms',
        columns: [
          { name: 'room_number', type: 'INTEGER', isPrimaryKey: true, isNotNull: true },
          { name: 'room_type', type: 'TEXT', isNotNull: true },
          { name: 'nightly_rate', type: 'REAL', isNotNull: true },
          { name: 'floor', type: 'INTEGER', isNotNull: true },
          { name: 'has_ocean_view', type: 'BOOLEAN', defaultValue: false }
        ],
        rows: [
          { room_number: 101, room_type: 'Standard King', nightly_rate: 189.0, floor: 1, has_ocean_view: false },
          { room_number: 204, room_type: 'Deluxe Oceanfront Suite', nightly_rate: 349.0, floor: 2, has_ocean_view: true },
          { room_number: 305, room_type: 'Executive Penthouse', nightly_rate: 699.0, floor: 3, has_ocean_view: true },
          { room_number: 108, room_type: 'Double Queen Garden', nightly_rate: 219.0, floor: 1, has_ocean_view: false },
          { room_number: 212, room_type: 'Deluxe Oceanfront Suite', nightly_rate: 349.0, floor: 2, has_ocean_view: true }
        ],
        foreignKeys: []
      },
      guests: {
        name: 'guests',
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true },
          { name: 'full_name', type: 'TEXT', isNotNull: true },
          { name: 'email', type: 'TEXT', isUnique: true, isNotNull: true },
          { name: 'membership_tier', type: 'TEXT', defaultValue: 'Silver' }
        ],
        rows: [
          { id: 1, full_name: 'Arthur Pendelton', email: 'arthur.p@cambridge.edu', membership_tier: 'Platinum' },
          { id: 2, full_name: 'Samantha Ray', email: 'samantha.ray@aerospace.io', membership_tier: 'Gold' },
          { id: 3, full_name: 'Daniel Zhao', email: 'd.zhao@pacific-venture.com', membership_tier: 'Diamond' },
          { id: 4, full_name: 'Chloe Monet', email: 'chloe.monet@riviera-art.fr', membership_tier: 'Silver' }
        ],
        foreignKeys: []
      },
      reservations: {
        name: 'reservations',
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, isNotNull: true },
          { name: 'guest_id', type: 'INTEGER', isNotNull: true },
          { name: 'room_number', type: 'INTEGER', isNotNull: true },
          { name: 'check_in', type: 'DATE', isNotNull: true },
          { name: 'check_out', type: 'DATE', isNotNull: true },
          { name: 'total_charge', type: 'REAL', isNotNull: true }
        ],
        rows: [
          { id: 801, guest_id: 1, room_number: 305, check_in: '2023-09-10', check_out: '2023-09-15', total_charge: 3495.0 },
          { id: 802, guest_id: 2, room_number: 204, check_in: '2023-09-12', check_out: '2023-09-16', total_charge: 1396.0 },
          { id: 803, guest_id: 3, room_number: 212, check_in: '2023-09-20', check_out: '2023-09-25', total_charge: 1745.0 },
          { id: 804, guest_id: 4, room_number: 101, check_in: '2023-09-22', check_out: '2023-09-24', total_charge: 378.0 }
        ],
        foreignKeys: [
          { column: 'guest_id', refTable: 'guests', refColumn: 'id' },
          { column: 'room_number', refTable: 'rooms', refColumn: 'room_number' }
        ]
      }
    }
  }
};

export const QUICK_QUERIES = [
  {
    name: 'Top Products by Price & Category (Multi-Column)',
    category: 'Basic Queries',
    sql: `SELECT \n  p.id,\n  p.product_name,\n  c.category_name,\n  p.price,\n  p.stock_qty,\n  p.rating\nFROM products p\nINNER JOIN categories c ON p.category_id = c.id\nORDER BY p.price DESC\nLIMIT 6;`
  },
  {
    name: 'Customer Spend Summary (INNER JOIN & Aggregation)',
    category: 'Analytics & Reporting',
    sql: `SELECT \n  c.name AS customer_name,\n  c.country,\n  COUNT(o.id) AS total_orders,\n  SUM(o.total_amount) AS total_spent,\n  ROUND(AVG(o.total_amount), 2) AS average_order_value\nFROM customers c\nINNER JOIN orders o ON c.id = o.customer_id\nGROUP BY c.name, c.country\nORDER BY total_spent DESC;`
  },
  {
    name: 'Category Analytics (GROUP BY & HAVING)',
    category: 'Analytics & Reporting',
    sql: `SELECT \n  c.category_name,\n  COUNT(p.id) AS total_items,\n  ROUND(AVG(p.price), 2) AS avg_price,\n  MAX(p.price) AS highest_price,\n  SUM(p.stock_qty) AS inventory_units\nFROM categories c\nINNER JOIN products p ON c.id = p.category_id\nGROUP BY c.category_name\nHAVING avg_price > 100.00\nORDER BY avg_price DESC;`
  },
  {
    name: 'Order Line Item Breakdown (Multi-Table JOIN)',
    category: 'Advanced Joins',
    sql: `SELECT \n  o.id AS order_id,\n  c.name AS customer_name,\n  p.product_name,\n  oi.quantity,\n  oi.unit_price,\n  (oi.quantity * oi.unit_price) AS line_total\nFROM order_items oi\nINNER JOIN orders o ON oi.order_id = o.id\nINNER JOIN customers c ON o.customer_id = c.id\nINNER JOIN products p ON oi.product_id = p.id\nORDER BY o.id ASC, line_total DESC;`
  },
  {
    name: 'Tier Classification with CASE Expression',
    category: 'Expressions & Functions',
    sql: `SELECT \n  product_name,\n  price,\n  CASE \n    WHEN price >= 500 THEN 'Premium Tier'\n    WHEN price >= 150 THEN 'Mid-Range Tier'\n    ELSE 'Budget Tier'\n  END AS price_segment,\n  rating\nFROM products\nORDER BY price DESC;`
  },
  {
    name: 'String & Formatting Functions (UPPER, CONCAT, LENGTH)',
    category: 'Expressions & Functions',
    sql: `SELECT \n  id,\n  name,\n  UPPER(country) AS country_code,\n  email,\n  LENGTH(name) AS name_char_count\nFROM customers\nWHERE active = TRUE;`
  },
  {
    name: 'Range Filtering with BETWEEN & IN',
    category: 'Basic Queries',
    sql: `SELECT \n  id,\n  product_name,\n  price,\n  rating\nFROM products\nWHERE price BETWEEN 100 AND 500\n  AND category_id IN (1, 2, 4)\nORDER BY rating DESC;`
  },
  {
    name: 'Database Schema Inspection (SHOW TABLES)',
    category: 'Meta & DDL',
    sql: `SHOW TABLES;`
  },
  {
    name: 'Table Column Inspection (DESCRIBE)',
    category: 'Meta & DDL',
    sql: `DESCRIBE products;`
  },
  {
    name: 'Query Plan Inspection (EXPLAIN)',
    category: 'Meta & DDL',
    sql: `EXPLAIN SELECT \n  c.name, \n  SUM(o.total_amount) AS spent\nFROM customers c\nINNER JOIN orders o ON c.id = o.customer_id\nWHERE o.status = 'completed'\nGROUP BY c.name\nORDER BY spent DESC;`
  },
  {
    name: 'Insert New Customer Record (INSERT INTO)',
    category: 'DML Mutations',
    sql: `INSERT INTO customers (id, name, email, country, city, signup_date, active)\nVALUES (8, 'Jonathan Vance', 'j.vance@blackmesa.org', 'USA', 'Boston', '2023-08-01', TRUE);`
  },
  {
    name: 'Update Customer Status (UPDATE SET)',
    category: 'DML Mutations',
    sql: `UPDATE customers \nSET active = TRUE, city = 'Kyoto' \nWHERE email = 'kenji.sato@techno-tokyo.jp';`
  },
  {
    name: 'Create New Relational Table (CREATE TABLE)',
    category: 'Meta & DDL',
    sql: `CREATE TABLE product_reviews (\n  id INTEGER PRIMARY KEY NOT NULL,\n  product_id INTEGER NOT NULL,\n  reviewer_name TEXT NOT NULL,\n  score INTEGER DEFAULT 5,\n  review_text TEXT,\n  FOREIGN KEY (product_id) REFERENCES products(id)\n);`
  }
];
