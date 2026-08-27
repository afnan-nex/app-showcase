/**
 * BudgetOS - Balance Engine
 * Dynamically computes account balances, cleared vs uncleared funds, and net worth
 * directly from transaction history and opening balances.
 */

/**
 * Calculate balances for all accounts given transactions list
 * @param {Array} accounts 
 * @param {Array} transactions 
 * @returns {Object} Map of accountId -> balance stats and total net worth summary
 */
export function calculateAccountBalances(accounts = [], transactions = []) {
  const accountMap = {};
  
  accounts.forEach(acc => {
    accountMap[acc.id] = {
      id: acc.id,
      name: acc.name,
      type: acc.type,
      color: acc.color,
      icon: acc.icon,
      creditLimit: Number(acc.creditLimit) || 0,
      initialBalance: Number(acc.initialBalance) || 0,
      currentBalance: Number(acc.initialBalance) || 0,
      clearedBalance: Number(acc.initialBalance) || 0,
      totalIncome: 0,
      totalExpense: 0,
      totalTransfersIn: 0,
      totalTransfersOut: 0,
      transactionCount: 0
    };
  });

  // Process all transactions
  transactions.forEach(tx => {
    const amount = Number(tx.amount) || 0;
    const isCleared = tx.isCleared !== false; // default true if undefined
    
    if (tx.type === 'income') {
      if (accountMap[tx.accountId]) {
        const acc = accountMap[tx.accountId];
        acc.currentBalance += amount;
        if (isCleared) acc.clearedBalance += amount;
        acc.totalIncome += amount;
        acc.transactionCount++;
      }
    } else if (tx.type === 'expense') {
      if (accountMap[tx.accountId]) {
        const acc = accountMap[tx.accountId];
        if (acc.type === 'creditCard') {
          // For credit cards, an expense increases outstanding balance (debt)
          acc.currentBalance += amount;
          if (isCleared) acc.clearedBalance += amount;
        } else {
          // For checking/savings/cash, expense reduces balance
          acc.currentBalance -= amount;
          if (isCleared) acc.clearedBalance -= amount;
        }
        acc.totalExpense += amount;
        acc.transactionCount++;
      }
    } else if (tx.type === 'transfer') {
      // Outgoing from source account
      if (accountMap[tx.accountId]) {
        const fromAcc = accountMap[tx.accountId];
        fromAcc.currentBalance -= amount;
        if (isCleared) fromAcc.clearedBalance -= amount;
        fromAcc.totalTransfersOut += amount;
        fromAcc.transactionCount++;
      }
      // Incoming to destination account
      if (accountMap[tx.toAccountId]) {
        const toAcc = accountMap[tx.toAccountId];
        if (toAcc.type === 'creditCard') {
          // A transfer into a credit card is a payment, which reduces the credit debt
          toAcc.currentBalance -= amount;
          if (isCleared) toAcc.clearedBalance -= amount;
        } else {
          toAcc.currentBalance += amount;
          if (isCleared) toAcc.clearedBalance += amount;
        }
        toAcc.totalTransfersIn += amount;
        toAcc.transactionCount++;
      }
    }
  });

  // Calculate overall summary metrics
  let totalAssets = 0;
  let totalLiabilities = 0;
  let totalCashAndChecking = 0;

  Object.values(accountMap).forEach(acc => {
    if (acc.type === 'creditCard') {
      totalLiabilities += Math.max(0, acc.currentBalance);
    } else {
      totalAssets += Math.max(0, acc.currentBalance);
      if (acc.type === 'checking' || acc.type === 'cash') {
        totalCashAndChecking += acc.currentBalance;
      }
    }
  });

  const netWorth = totalAssets - totalLiabilities;

  return {
    accounts: accountMap,
    summary: {
      netWorth,
      totalAssets,
      totalLiabilities,
      totalCashAndChecking
    }
  };
}

/**
 * Get individual balance for a single account
 */
export function getSingleAccountBalance(accountId, accounts = [], transactions = []) {
  const { accounts: accountMap } = calculateAccountBalances(accounts, transactions);
  return accountMap[accountId] || null;
}
