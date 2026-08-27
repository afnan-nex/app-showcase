/**
 * BudgetOS - IndexedDB Storage Engine & Demo Data Generator
 */

import { generateUUID, getTodayISO, addDays, addMonths, getMonthKey } from './formatters.js';

const DB_NAME = 'BudgetOS_Database';
const DB_VERSION = 1;

const STORES = {
  ACCOUNTS: 'accounts',
  CATEGORIES: 'categories',
  TRANSACTIONS: 'transactions',
  BUDGETS: 'budgets',
  GOALS: 'goals',
  RECURRING: 'recurring',
  SETTINGS: 'settings'
};

let dbInstance = null;

/**
 * Open or initialize the IndexedDB database
 */
export async function initDB() {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Accounts Store
      if (!db.objectStoreNames.contains(STORES.ACCOUNTS)) {
        const accStore = db.createObjectStore(STORES.ACCOUNTS, { keyPath: 'id' });
        accStore.createIndex('type', 'type', { unique: false });
        accStore.createIndex('isArchived', 'isArchived', { unique: false });
      }

      // Categories Store
      if (!db.objectStoreNames.contains(STORES.CATEGORIES)) {
        const catStore = db.createObjectStore(STORES.CATEGORIES, { keyPath: 'id' });
        catStore.createIndex('type', 'type', { unique: false });
      }

      // Transactions Store
      if (!db.objectStoreNames.contains(STORES.TRANSACTIONS)) {
        const txStore = db.createObjectStore(STORES.TRANSACTIONS, { keyPath: 'id' });
        txStore.createIndex('date', 'date', { unique: false });
        txStore.createIndex('accountId', 'accountId', { unique: false });
        txStore.createIndex('categoryId', 'categoryId', { unique: false });
        txStore.createIndex('type', 'type', { unique: false });
      }

      // Budgets Store (Compound or single ID key)
      if (!db.objectStoreNames.contains(STORES.BUDGETS)) {
        const bgStore = db.createObjectStore(STORES.BUDGETS, { keyPath: 'id' });
        bgStore.createIndex('monthKey', 'monthKey', { unique: false });
        bgStore.createIndex('categoryId', 'categoryId', { unique: false });
        bgStore.createIndex('month_category', ['monthKey', 'categoryId'], { unique: true });
      }

      // Goals Store
      if (!db.objectStoreNames.contains(STORES.GOALS)) {
        const goalStore = db.createObjectStore(STORES.GOALS, { keyPath: 'id' });
        goalStore.createIndex('isCompleted', 'isCompleted', { unique: false });
      }

      // Recurring Store
      if (!db.objectStoreNames.contains(STORES.RECURRING)) {
        const recStore = db.createObjectStore(STORES.RECURRING, { keyPath: 'id' });
        recStore.createIndex('nextDueDate', 'nextDueDate', { unique: false });
        recStore.createIndex('isPaused', 'isPaused', { unique: false });
      }

      // Settings Store
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
      }
    };

    request.onsuccess = async (event) => {
      dbInstance = event.target.result;
      // Check if default categories or settings are initialized
      await ensureDefaults();
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.error('IndexedDB opening error:', event.target.error);
      reject(event.target.error);
    };
  });
}

/**
 * Generic transactional database helper
 */
function getTxStore(storeName, mode = 'readonly') {
  if (!dbInstance) throw new Error('Database not initialized');
  const tx = dbInstance.transaction(storeName, mode);
  return tx.objectStore(storeName);
}

/**
 * Generic CRUD methods
 */
export async function getAll(storeName) {
  await initDB();
  return new Promise((resolve, reject) => {
    const store = getTxStore(storeName, 'readonly');
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function getById(storeName, id) {
  await initDB();
  return new Promise((resolve, reject) => {
    const store = getTxStore(storeName, 'readonly');
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function putItem(storeName, item) {
  await initDB();
  return new Promise((resolve, reject) => {
    const store = getTxStore(storeName, 'readwrite');
    const req = store.put(item);
    req.onsuccess = () => resolve(item);
    req.onerror = () => reject(req.error);
  });
}

export async function putBatch(storeName, items) {
  await initDB();
  return new Promise((resolve, reject) => {
    const tx = dbInstance.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    items.forEach(item => store.put(item));
    tx.oncomplete = () => resolve(items);
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteItem(storeName, id) {
  await initDB();
  return new Promise((resolve, reject) => {
    const store = getTxStore(storeName, 'readwrite');
    const req = store.delete(id);
    req.onsuccess = () => resolve(id);
    req.onerror = () => reject(req.error);
  });
}

export async function clearStore(storeName) {
  await initDB();
  return new Promise((resolve, reject) => {
    const store = getTxStore(storeName, 'readwrite');
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/**
 * Settings helpers
 */
export async function getSetting(key, defaultValue = null) {
  const setting = await getById(STORES.SETTINGS, key);
  return setting ? setting.value : defaultValue;
}

export async function setSetting(key, value) {
  return await putItem(STORES.SETTINGS, { key, value, updatedAt: new Date().toISOString() });
}

/**
 * Default Category Definitions
 */
export const DEFAULT_CATEGORIES = [
  { id: 'cat_salary', name: 'Salary & Wages', type: 'income', color: '#10b981', icon: 'salary', isDefault: true },
  { id: 'cat_invest_inc', name: 'Investments & Dividends', type: 'income', color: '#059669', icon: 'investment', isDefault: true },
  { id: 'cat_freelance', name: 'Freelance & Side Income', type: 'income', color: '#34d399', icon: 'sparkles', isDefault: true },
  { id: 'cat_other_inc', name: 'Other Income', type: 'income', color: '#6ee7b7', icon: 'plus', isDefault: true },

  { id: 'cat_housing', name: 'Housing & Rent', type: 'expense', color: '#6366f1', icon: 'housing', isDefault: true },
  { id: 'cat_utilities', name: 'Utilities & Bills', type: 'expense', color: '#8b5cf6', icon: 'utilities', isDefault: true },
  { id: 'cat_groceries', name: 'Groceries & Supermarket', type: 'expense', color: '#f59e0b', icon: 'groceries', isDefault: true },
  { id: 'cat_dining', name: 'Dining Out & Coffee', type: 'expense', color: '#f97316', icon: 'food', isDefault: true },
  { id: 'cat_transport', name: 'Transportation & Fuel', type: 'expense', color: '#06b6d4', icon: 'transport', isDefault: true },
  { id: 'cat_health', name: 'Healthcare & Fitness', type: 'expense', color: '#ec4899', icon: 'health', isDefault: true },
  { id: 'cat_entertainment', name: 'Entertainment & Subs', type: 'expense', color: '#a855f7', icon: 'entertainment', isDefault: true },
  { id: 'cat_shopping', name: 'Shopping & Personal', type: 'expense', color: '#e11d48', icon: 'shopping', isDefault: true },
  { id: 'cat_misc', name: 'Miscellaneous', type: 'expense', color: '#64748b', icon: 'tag', isDefault: true }
];

/**
 * Ensure default categories & initial settings exist
 */
async function ensureDefaults() {
  const existingCats = await getAll(STORES.CATEGORIES);
  if (existingCats.length === 0) {
    await putBatch(STORES.CATEGORIES, DEFAULT_CATEGORIES);
  }

  const existingTheme = await getSetting('theme');
  if (!existingTheme) {
    await setSetting('theme', 'dark');
  }

  const existingCurrency = await getSetting('currency');
  if (!existingCurrency) {
    await setSetting('currency', 'USD');
  }
}

/**
 * Generate a realistic demo dataset with 90-day history
 */
export async function seedDemoData() {
  const today = getTodayISO();
  const currentMonthKey = getMonthKey();
  const lastMonthKey = getMonthKey(addMonths(today, -1));

  // 1. Accounts
  const demoAccounts = [
    {
      id: 'acc_checking',
      name: 'Primary Checking',
      type: 'checking',
      initialBalance: 3200.00,
      color: '#3b82f6',
      icon: 'bank',
      creditLimit: 0,
      isArchived: false,
      notes: 'Main payroll and bill payment account'
    },
    {
      id: 'acc_savings',
      name: 'High-Yield Savings',
      type: 'savings',
      initialBalance: 12500.00,
      color: '#10b981',
      icon: 'shield',
      creditLimit: 0,
      isArchived: false,
      notes: 'Emergency fund at 4.5% APY'
    },
    {
      id: 'acc_credit',
      name: 'Sapphire Preferred Card',
      type: 'creditCard',
      initialBalance: 0,
      color: '#f43f5e',
      icon: 'creditCard',
      creditLimit: 10000.00,
      isArchived: false,
      notes: 'Everyday dining, travel, and online purchases'
    },
    {
      id: 'acc_cash',
      name: 'Physical Cash Wallet',
      type: 'cash',
      initialBalance: 140.00,
      color: '#eab308',
      icon: 'cash',
      creditLimit: 0,
      isArchived: false,
      notes: 'Pocket cash'
    }
  ];

  // 2. Budgets for current and last month
  const demoBudgets = [
    { id: `bg_${currentMonthKey}_housing`, monthKey: currentMonthKey, categoryId: 'cat_housing', amount: 1600 },
    { id: `bg_${currentMonthKey}_groceries`, monthKey: currentMonthKey, categoryId: 'cat_groceries', amount: 550 },
    { id: `bg_${currentMonthKey}_dining`, monthKey: currentMonthKey, categoryId: 'cat_dining', amount: 350 },
    { id: `bg_${currentMonthKey}_utilities`, monthKey: currentMonthKey, categoryId: 'cat_utilities', amount: 220 },
    { id: `bg_${currentMonthKey}_transport`, monthKey: currentMonthKey, categoryId: 'cat_transport', amount: 200 },
    { id: `bg_${currentMonthKey}_entertainment`, monthKey: currentMonthKey, categoryId: 'cat_entertainment', amount: 180 },
    { id: `bg_${currentMonthKey}_shopping`, monthKey: currentMonthKey, categoryId: 'cat_shopping', amount: 250 },
    { id: `bg_${currentMonthKey}_health`, monthKey: currentMonthKey, categoryId: 'cat_health', amount: 120 },

    { id: `bg_${lastMonthKey}_housing`, monthKey: lastMonthKey, categoryId: 'cat_housing', amount: 1600 },
    { id: `bg_${lastMonthKey}_groceries`, monthKey: lastMonthKey, categoryId: 'cat_groceries', amount: 550 },
    { id: `bg_${lastMonthKey}_dining`, monthKey: lastMonthKey, categoryId: 'cat_dining', amount: 350 },
    { id: `bg_${lastMonthKey}_utilities`, monthKey: lastMonthKey, categoryId: 'cat_utilities', amount: 220 }
  ];

  // 3. Goals
  const demoGoals = [
    {
      id: 'goal_emergency',
      name: '6-Month Emergency Cushion',
      targetAmount: 18000,
      currentAmount: 12500,
      targetDate: addMonths(today, 10),
      monthlyContribution: 550,
      color: '#10b981',
      icon: 'shield',
      accountId: 'acc_savings',
      isCompleted: false,
      notes: 'Liquid reserve covering 6 months of baseline living expenses'
    },
    {
      id: 'goal_vacation',
      name: 'Japan Autumn Trip',
      targetAmount: 4200,
      currentAmount: 2400,
      targetDate: addMonths(today, 6),
      monthlyContribution: 300,
      color: '#6366f1',
      icon: 'sparkles',
      accountId: 'acc_savings',
      isCompleted: false,
      notes: 'Flights, ryokan stays, and rail passes'
    },
    {
      id: 'goal_gear',
      name: 'M4 Workstation Upgrade',
      targetAmount: 2800,
      currentAmount: 1900,
      targetDate: addMonths(today, 3),
      monthlyContribution: 300,
      color: '#f59e0b',
      icon: 'shopping',
      accountId: 'acc_checking',
      isCompleted: false,
      notes: 'Productivity hardware refresh'
    }
  ];

  // 4. Recurring rules
  const demoRecurring = [
    {
      id: 'rec_salary',
      name: 'Bi-weekly Direct Deposit (Acme Corp)',
      amount: 2850.00,
      type: 'income',
      categoryId: 'cat_salary',
      accountId: 'acc_checking',
      frequency: 'biweekly',
      startDate: addDays(today, -60),
      nextDueDate: addDays(today, 5),
      autoPost: true,
      isPaused: false
    },
    {
      id: 'rec_rent',
      name: 'Apartment Monthly Rent',
      amount: 1550.00,
      type: 'expense',
      categoryId: 'cat_housing',
      accountId: 'acc_checking',
      frequency: 'monthly',
      startDate: addDays(today, -90),
      nextDueDate: addDays(today, 4),
      autoPost: true,
      isPaused: false
    },
    {
      id: 'rec_fiber',
      name: 'Gigabit Fiber Internet',
      amount: 70.00,
      type: 'expense',
      categoryId: 'cat_utilities',
      accountId: 'acc_checking',
      frequency: 'monthly',
      startDate: addDays(today, -90),
      nextDueDate: addDays(today, 12),
      autoPost: true,
      isPaused: false
    },
    {
      id: 'rec_gym',
      name: 'Equinox Gym Membership',
      amount: 120.00,
      type: 'expense',
      categoryId: 'cat_health',
      accountId: 'acc_credit',
      frequency: 'monthly',
      startDate: addDays(today, -90),
      nextDueDate: addDays(today, 15),
      autoPost: true,
      isPaused: false
    },
    {
      id: 'rec_spotify',
      name: 'Spotify Family Subscription',
      amount: 19.99,
      type: 'expense',
      categoryId: 'cat_entertainment',
      accountId: 'acc_credit',
      frequency: 'monthly',
      startDate: addDays(today, -90),
      nextDueDate: addDays(today, 8),
      autoPost: true,
      isPaused: false
    },
    {
      id: 'rec_save_transfer',
      name: 'Automated Emergency Fund Transfer',
      amount: 400.00,
      type: 'transfer',
      categoryId: 'cat_salary',
      accountId: 'acc_checking',
      toAccountId: 'acc_savings',
      frequency: 'monthly',
      startDate: addDays(today, -90),
      nextDueDate: addDays(today, 6),
      autoPost: true,
      isPaused: false
    }
  ];

  // 5. Historical Transactions across 75 days
  const demoTransactions = [];

  // Paychecks
  [-70, -56, -42, -28, -14, 0].forEach((offset, idx) => {
    demoTransactions.push({
      id: `tx_pay_${idx}`,
      date: addDays(today, offset),
      description: 'Acme Corp Bi-Weekly Payroll',
      merchant: 'Acme Corp',
      amount: 2850.00,
      categoryId: 'cat_salary',
      accountId: 'acc_checking',
      type: 'income',
      notes: 'Direct deposit net pay',
      isCleared: true
    });
  });

  // Freelance income
  demoTransactions.push(
    {
      id: 'tx_fl_1',
      date: addDays(today, -45),
      description: 'Frontend Consulting Sprint',
      merchant: 'Studio Pixel Inc',
      amount: 1200.00,
      categoryId: 'cat_freelance',
      accountId: 'acc_checking',
      type: 'income',
      notes: 'Milestone 2 delivery',
      isCleared: true
    },
    {
      id: 'tx_fl_2',
      date: addDays(today, -12),
      description: 'UI Design Audit',
      merchant: 'HyperFlow Ltd',
      amount: 850.00,
      categoryId: 'cat_freelance',
      accountId: 'acc_checking',
      type: 'income',
      notes: 'App usability review',
      isCleared: true
    }
  );

  // Rents
  [-60, -30, -1].forEach((offset, idx) => {
    demoTransactions.push({
      id: `tx_rent_${idx}`,
      date: addDays(today, offset),
      description: 'Monthly Apartment Lease',
      merchant: 'Skyline Properties',
      amount: 1550.00,
      categoryId: 'cat_housing',
      accountId: 'acc_checking',
      type: 'expense',
      notes: 'ACH payment rent',
      isCleared: true
    });
  });

  // Utilities & Internet
  [-58, -27, -5].forEach((offset, idx) => {
    demoTransactions.push({
      id: `tx_util_${idx}`,
      date: addDays(today, offset),
      description: 'City Power & Electric',
      merchant: 'City Power Corp',
      amount: 94.30 + idx * 8,
      categoryId: 'cat_utilities',
      accountId: 'acc_checking',
      type: 'expense',
      notes: 'Electric bill',
      isCleared: true
    });
    demoTransactions.push({
      id: `tx_fiber_${idx}`,
      date: addDays(today, offset + 2),
      description: 'Fiber Gigabit Internet',
      merchant: 'Metro Fiber',
      amount: 70.00,
      categoryId: 'cat_utilities',
      accountId: 'acc_checking',
      type: 'expense',
      notes: 'Autopay',
      isCleared: true
    });
  });

  // Groceries (Regular cadence)
  const groceryVendors = [
    { name: 'Whole Foods Market', cat: 'cat_groceries', avg: 115 },
    { name: 'Trader Joe\'s', cat: 'cat_groceries', avg: 78 },
    { name: 'Costco Wholesale', cat: 'cat_groceries', avg: 210 },
    { name: 'Local Farmers Market', cat: 'cat_groceries', avg: 45 }
  ];

  [-68, -62, -55, -48, -41, -34, -26, -20, -15, -9, -3].forEach((offset, idx) => {
    const v = groceryVendors[idx % groceryVendors.length];
    const amount = +(v.avg + (Math.sin(idx) * 15)).toFixed(2);
    demoTransactions.push({
      id: `tx_groc_${idx}`,
      date: addDays(today, offset),
      description: `Groceries at ${v.name}`,
      merchant: v.name,
      amount: amount,
      categoryId: v.cat,
      accountId: idx % 2 === 0 ? 'acc_credit' : 'acc_checking',
      type: 'expense',
      notes: 'Weekly pantry & fresh produce',
      isCleared: true
    });
  });

  // Dining Out & Cafes
  const diningList = [
    { name: 'Blue Bottle Coffee', amt: 6.75, note: 'Morning pour-over' },
    { name: 'Chipotle Mexican Grill', amt: 15.40, note: 'Burrito bowl lunch' },
    { name: 'Osteria Rustica', amt: 84.50, note: 'Dinner with friends' },
    { name: 'Ramen Tatsuya', amt: 32.00, note: 'Tonkotsu ramen dinner' },
    { name: 'Sweetgreen', amt: 17.20, note: 'Salad lunch' },
    { name: 'Tartine Bakery', amt: 18.50, note: 'Pastries & espresso' },
    { name: 'Sushi Kaji', amt: 98.00, note: 'Omakase dinner' }
  ];

  [-65, -59, -51, -44, -38, -31, -24, -18, -11, -7, -4, -1].forEach((offset, idx) => {
    const d = diningList[idx % diningList.length];
    demoTransactions.push({
      id: `tx_din_${idx}`,
      date: addDays(today, offset),
      description: d.name,
      merchant: d.name,
      amount: d.amt,
      categoryId: 'cat_dining',
      accountId: 'acc_credit',
      type: 'expense',
      notes: d.note,
      isCleared: true
    });
  });

  // Transportation & Fuel
  [-64, -46, -29, -10].forEach((offset, idx) => {
    demoTransactions.push({
      id: `tx_fuel_${idx}`,
      date: addDays(today, offset),
      description: 'Chevron Fuel Station',
      merchant: 'Chevron',
      amount: +(48.50 + idx * 3).toFixed(2),
      categoryId: 'cat_transport',
      accountId: 'acc_credit',
      type: 'expense',
      notes: 'Gas fill-up',
      isCleared: true
    });
  });

  // Healthcare, Gym, Entertainment
  [-60, -30, -2].forEach((offset, idx) => {
    demoTransactions.push({
      id: `tx_gym_${idx}`,
      date: addDays(today, offset),
      description: 'Equinox Gym Membership',
      merchant: 'Equinox',
      amount: 120.00,
      categoryId: 'cat_health',
      accountId: 'acc_credit',
      type: 'expense',
      notes: 'Monthly club access',
      isCleared: true
    });
    demoTransactions.push({
      id: `tx_sub_${idx}`,
      date: addDays(today, offset + 5),
      description: 'Spotify Family Subscription',
      merchant: 'Spotify',
      amount: 19.99,
      categoryId: 'cat_entertainment',
      accountId: 'acc_credit',
      type: 'expense',
      notes: 'Music streaming',
      isCleared: true
    });
  });

  // Shopping & Anomaly Example (e.g. 1 big electronic purchase)
  demoTransactions.push(
    {
      id: 'tx_shop_1',
      date: addDays(today, -35),
      description: 'Uniqlo Casual Basics',
      merchant: 'Uniqlo',
      amount: 86.40,
      categoryId: 'cat_shopping',
      accountId: 'acc_credit',
      type: 'expense',
      notes: 'Tees & socks',
      isCleared: true
    },
    {
      id: 'tx_shop_anomaly',
      date: addDays(today, -8),
      description: 'Apple Store 4K Display',
      merchant: 'Apple Store',
      amount: 899.00, // Noticeably larger than standard shopping — anomaly trigger
      categoryId: 'cat_shopping',
      accountId: 'acc_credit',
      type: 'expense',
      notes: 'Studio display purchase for desk setup',
      isCleared: true
    }
  );

  // Transfers from checking to savings
  [-55, -25, -2].forEach((offset, idx) => {
    demoTransactions.push({
      id: `tx_tr_${idx}`,
      date: addDays(today, offset),
      description: 'Monthly Savings Deposit',
      merchant: 'Internal Transfer',
      amount: 400.00,
      categoryId: 'cat_salary',
      accountId: 'acc_checking',
      toAccountId: 'acc_savings',
      type: 'transfer',
      notes: 'Emergency fund transfer',
      isCleared: true
    });
  });

  // Save all items to stores
  await clearStore(STORES.ACCOUNTS);
  await clearStore(STORES.BUDGETS);
  await clearStore(STORES.GOALS);
  await clearStore(STORES.RECURRING);
  await clearStore(STORES.TRANSACTIONS);

  await putBatch(STORES.ACCOUNTS, demoAccounts);
  await putBatch(STORES.BUDGETS, demoBudgets);
  await putBatch(STORES.GOALS, demoGoals);
  await putBatch(STORES.RECURRING, demoRecurring);
  await putBatch(STORES.TRANSACTIONS, demoTransactions);

  return {
    accounts: demoAccounts.length,
    transactions: demoTransactions.length,
    budgets: demoBudgets.length,
    goals: demoGoals.length,
    recurring: demoRecurring.length
  };
}

/**
 * Export complete database as JSON
 */
export async function exportAllData() {
  const accounts = await getAll(STORES.ACCOUNTS);
  const categories = await getAll(STORES.CATEGORIES);
  const transactions = await getAll(STORES.TRANSACTIONS);
  const budgets = await getAll(STORES.BUDGETS);
  const goals = await getAll(STORES.GOALS);
  const recurring = await getAll(STORES.RECURRING);
  const settings = await getAll(STORES.SETTINGS);

  return {
    app: 'BudgetOS',
    version: 1,
    exportedAt: new Date().toISOString(),
    data: {
      accounts,
      categories,
      transactions,
      budgets,
      goals,
      recurring,
      settings
    }
  };
}

/**
 * Import complete database from JSON
 */
export async function importAllData(payload) {
  if (!payload || !payload.data) {
    throw new Error('Invalid BudgetOS backup format');
  }

  const { accounts, categories, transactions, budgets, goals, recurring, settings } = payload.data;

  if (accounts) {
    await clearStore(STORES.ACCOUNTS);
    await putBatch(STORES.ACCOUNTS, accounts);
  }
  if (categories) {
    await clearStore(STORES.CATEGORIES);
    await putBatch(STORES.CATEGORIES, categories);
  }
  if (transactions) {
    await clearStore(STORES.TRANSACTIONS);
    await putBatch(STORES.TRANSACTIONS, transactions);
  }
  if (budgets) {
    await clearStore(STORES.BUDGETS);
    await putBatch(STORES.BUDGETS, budgets);
  }
  if (goals) {
    await clearStore(STORES.GOALS);
    await putBatch(STORES.GOALS, goals);
  }
  if (recurring) {
    await clearStore(STORES.RECURRING);
    await putBatch(STORES.RECURRING, recurring);
  }
  if (settings) {
    await clearStore(STORES.SETTINGS);
    await putBatch(STORES.SETTINGS, settings);
  }

  return true;
}

/**
 * Reset all user data back to clean state
 */
export async function resetAllData() {
  await clearStore(STORES.ACCOUNTS);
  await clearStore(STORES.TRANSACTIONS);
  await clearStore(STORES.BUDGETS);
  await clearStore(STORES.GOALS);
  await clearStore(STORES.RECURRING);
  await clearStore(STORES.CATEGORIES);
  await ensureDefaults();
}

export { STORES };
