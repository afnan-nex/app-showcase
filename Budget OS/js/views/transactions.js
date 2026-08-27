/**
 * BudgetOS - Transactions Ledger View Controller
 * High-readability finance table, live filtering, column sorting, pagination,
 * inline actions, and CSV export.
 */

import state from '../state.js';
import { getIcon } from '../icons.js';
import { formatCurrency, formatDate, generateCSV, getMonthKey, addMonths } from '../formatters.js';

export let filterState = {
  search: '',
  type: 'all',
  categoryId: 'all',
  accountId: 'all',
  dateRange: 'thisMonth', // 'thisMonth', 'lastMonth', 'last90', 'all'
  sortBy: 'date',
  sortOrder: 'desc',
  currentPage: 1,
  pageSize: 15
};

export function setTransactionFilter(newFilters = {}) {
  filterState = {
    ...filterState,
    ...newFilters,
    currentPage: 1
  };
}

export function renderTransactionsView(container) {
  const { transactions, categories, accounts } = state;

  const catMap = {};
  categories.forEach(c => { catMap[c.id] = c; });
  const accMap = {};
  accounts.forEach(a => { accMap[a.id] = a; });

  // 1. Filter logic
  let filtered = [...transactions];

  // Text search
  if (filterState.search.trim()) {
    const q = filterState.search.toLowerCase().trim();
    filtered = filtered.filter(tx => {
      const desc = (tx.description || '').toLowerCase();
      const merch = (tx.merchant || '').toLowerCase();
      const notes = (tx.notes || '').toLowerCase();
      const cat = catMap[tx.categoryId]?.name?.toLowerCase() || '';
      return desc.includes(q) || merch.includes(q) || notes.includes(q) || cat.includes(q);
    });
  }

  // Type filter
  if (filterState.type !== 'all') {
    filtered = filtered.filter(tx => tx.type === filterState.type);
  }

  // Category filter
  if (filterState.categoryId !== 'all') {
    filtered = filtered.filter(tx => tx.categoryId === filterState.categoryId);
  }

  // Account filter
  if (filterState.accountId !== 'all') {
    filtered = filtered.filter(tx => tx.accountId === filterState.accountId || tx.toAccountId === filterState.accountId);
  }

  // Date range filter
  const today = new Date().toISOString().split('T')[0];
  const thisMonthKey = getMonthKey();
  const lastMonthKey = getMonthKey(addMonths(today, -1));

  if (filterState.dateRange === 'thisMonth') {
    filtered = filtered.filter(tx => tx.date && tx.date.startsWith(thisMonthKey));
  } else if (filterState.dateRange === 'lastMonth') {
    filtered = filtered.filter(tx => tx.date && tx.date.startsWith(lastMonthKey));
  } else if (filterState.dateRange === 'last90') {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const ninetyDaysStr = ninetyDaysAgo.toISOString().split('T')[0];
    filtered = filtered.filter(tx => tx.date >= ninetyDaysStr);
  }

  // 2. Sorting
  filtered.sort((a, b) => {
    let valA = a[filterState.sortBy];
    let valB = b[filterState.sortBy];

    if (filterState.sortBy === 'amount') {
      valA = Number(valA) || 0;
      valB = Number(valB) || 0;
    } else if (filterState.sortBy === 'merchant') {
      valA = (a.merchant || a.description || '').toLowerCase();
      valB = (b.merchant || b.description || '').toLowerCase();
    } else {
      valA = valA || '';
      valB = valB || '';
    }

    if (valA < valB) return filterState.sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return filterState.sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // 3. Pagination
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / filterState.pageSize));
  if (filterState.currentPage > totalPages) filterState.currentPage = totalPages;
  
  const startIndex = (filterState.currentPage - 1) * filterState.pageSize;
  const paginatedItems = filtered.slice(startIndex, startIndex + filterState.pageSize);

  // Summary of filtered items
  let filteredIncome = 0;
  let filteredExpense = 0;
  filtered.forEach(tx => {
    const amt = Number(tx.amount) || 0;
    if (tx.type === 'income') filteredIncome += amt;
    if (tx.type === 'expense') filteredExpense += amt;
  });

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">Transaction Ledger</h1>
        <p class="view-subtitle">${totalItems} transactions matched &bull; In: <span class="text-emerald font-semibold">${formatCurrency(filteredIncome)}</span>, Out: <span class="text-rose font-semibold">${formatCurrency(filteredExpense)}</span></p>
      </div>
      <div class="view-actions">
        <button class="btn btn-secondary" id="btn-export-tx-csv">
          ${getIcon('download', 'icon-sm')} Export CSV
        </button>
        <button class="btn btn-primary" id="btn-add-tx">
          ${getIcon('plus', 'icon-sm')} New Transaction
        </button>
      </div>
    </div>

    <!-- Filter Control Bar -->
    <div class="card ledger-controls-card">
      <div class="filter-bar-row">
        <!-- Search -->
        <div class="search-input-wrapper">
          <span class="search-icon">${getIcon('search', 'icon-sm')}</span>
          <input
            type="text"
            id="tx-search"
            class="form-control search-input"
            placeholder="Search merchant, description, notes..."
            value="${filterState.search}"
          />
        </div>

        <!-- Date Range Filter -->
        <select id="filter-date-range" class="form-control filter-select">
          <option value="thisMonth" ${filterState.dateRange === 'thisMonth' ? 'selected' : ''}>This Month</option>
          <option value="lastMonth" ${filterState.dateRange === 'lastMonth' ? 'selected' : ''}>Last Month</option>
          <option value="last90" ${filterState.dateRange === 'last90' ? 'selected' : ''}>Last 90 Days</option>
          <option value="all" ${filterState.dateRange === 'all' ? 'selected' : ''}>All Time</option>
        </select>

        <!-- Type Filter -->
        <select id="filter-type" class="form-control filter-select">
          <option value="all" ${filterState.type === 'all' ? 'selected' : ''}>All Types</option>
          <option value="expense" ${filterState.type === 'expense' ? 'selected' : ''}>Expenses</option>
          <option value="income" ${filterState.type === 'income' ? 'selected' : ''}>Income</option>
          <option value="transfer" ${filterState.type === 'transfer' ? 'selected' : ''}>Transfers</option>
        </select>

        <!-- Category Filter -->
        <select id="filter-category" class="form-control filter-select">
          <option value="all">All Categories</option>
          ${categories.map(c => `
            <option value="${c.id}" ${filterState.categoryId === c.id ? 'selected' : ''}>${c.name}</option>
          `).join('')}
        </select>

        <!-- Account Filter -->
        <select id="filter-account" class="form-control filter-select">
          <option value="all">All Accounts</option>
          ${accounts.map(a => `
            <option value="${a.id}" ${filterState.accountId === a.id ? 'selected' : ''}>${a.name}</option>
          `).join('')}
        </select>

        ${(filterState.search || filterState.type !== 'all' || filterState.categoryId !== 'all' || filterState.accountId !== 'all' || filterState.dateRange !== 'thisMonth') ? `
          <button class="btn btn-ghost btn-sm text-muted" id="btn-reset-filters" title="Reset Filters">
            ${getIcon('refresh', 'icon-xs')} Reset
          </button>
        ` : ''}
      </div>
    </div>

    <!-- Finance Ledger Table -->
    <div class="card ledger-table-card">
      <div class="table-responsive">
        <table class="table finance-table">
          <thead>
            <tr>
              <th class="sortable-th cursor-pointer" data-sort="date">
                Date ${filterState.sortBy === 'date' ? (filterState.sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th class="sortable-th cursor-pointer" data-sort="merchant">
                Merchant / Description ${filterState.sortBy === 'merchant' ? (filterState.sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th>Category</th>
              <th>Account</th>
              <th class="text-right sortable-th cursor-pointer" data-sort="amount">
                Amount ${filterState.sortBy === 'amount' ? (filterState.sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th class="text-center" style="width: 100px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${paginatedItems.length === 0 ? `
              <tr>
                <td colspan="6" class="text-center p-5 text-muted">
                  No transactions match the current filter criteria.
                </td>
              </tr>
            ` : paginatedItems.map(tx => {
              const cat = catMap[tx.categoryId] || { name: 'Uncategorized', color: '#94a3b8', icon: 'tag' };
              const acc = accMap[tx.accountId] || { name: 'Account' };
              const toAcc = tx.toAccountId ? accMap[tx.toAccountId] : null;

              const isIncome = tx.type === 'income';
              const isTransfer = tx.type === 'transfer';
              const amountClass = isIncome ? 'text-emerald font-semibold' : isTransfer ? 'text-primary' : 'text-primary';
              const sign = isIncome ? '+' : isTransfer ? '⇆ ' : '-';

              return `
                <tr class="tx-row-interactive" data-id="${tx.id}">
                  <td class="text-muted font-mono text-sm">${formatDate(tx.date, 'medium')}</td>
                  <td>
                    <div class="tx-merchant font-medium text-primary">${tx.merchant || tx.description}</div>
                    ${tx.notes ? `<div class="tx-notes text-muted text-xs">${tx.notes}</div>` : ''}
                  </td>
                  <td>
                    <span class="badge badge-category" style="--cat-color: ${cat.color};">
                      ${getIcon(cat.icon, 'icon-xs')} ${cat.name}
                    </span>
                  </td>
                  <td class="text-secondary text-sm">
                    ${isTransfer && toAcc ? `${acc.name} &rarr; ${toAcc.name}` : acc.name}
                  </td>
                  <td class="text-right ${amountClass} font-mono text-base">
                    ${sign}${formatCurrency(tx.amount)}
                  </td>
                  <td class="text-center">
                    <div class="table-actions-group">
                      <button class="btn-icon btn-edit-tx" data-id="${tx.id}" title="Edit Transaction">
                        ${getIcon('edit', 'icon-xs')}
                      </button>
                      <button class="btn-icon btn-duplicate-tx" data-id="${tx.id}" title="Duplicate">
                        ${getIcon('copy', 'icon-xs')}
                      </button>
                      <button class="btn-icon btn-icon-danger btn-delete-tx" data-id="${tx.id}" title="Delete">
                        ${getIcon('trash', 'icon-xs')}
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      ${totalPages > 1 ? `
        <div class="pagination-footer">
          <div class="pagination-info text-muted text-xs">
            Showing ${startIndex + 1}&ndash;${Math.min(startIndex + filterState.pageSize, totalItems)} of ${totalItems}
          </div>
          <div class="pagination-controls">
            <button class="btn btn-sm btn-secondary" id="btn-page-prev" ${filterState.currentPage === 1 ? 'disabled' : ''}>
              ${getIcon('arrowLeft', 'icon-xs')} Prev
            </button>
            <span class="page-indicator text-sm font-mono">${filterState.currentPage} / ${totalPages}</span>
            <button class="btn btn-sm btn-secondary" id="btn-page-next" ${filterState.currentPage === totalPages ? 'disabled' : ''}>
              Next ${getIcon('arrowRight', 'icon-xs')}
            </button>
          </div>
        </div>
      ` : ''}
    </div>
  `;

  // --- Attach Handlers ---
  const searchInput = container.querySelector('#tx-search');
  searchInput?.addEventListener('input', (e) => {
    filterState.search = e.target.value;
    filterState.currentPage = 1;
    renderTransactionsView(container);
    // Keep focus
    const input = container.querySelector('#tx-search');
    input?.focus();
    input?.setSelectionRange(input.value.length, input.value.length);
  });

  container.querySelector('#filter-date-range')?.addEventListener('change', (e) => {
    filterState.dateRange = e.target.value;
    filterState.currentPage = 1;
    renderTransactionsView(container);
  });

  container.querySelector('#filter-type')?.addEventListener('change', (e) => {
    filterState.type = e.target.value;
    filterState.currentPage = 1;
    renderTransactionsView(container);
  });

  container.querySelector('#filter-category')?.addEventListener('change', (e) => {
    filterState.categoryId = e.target.value;
    filterState.currentPage = 1;
    renderTransactionsView(container);
  });

  container.querySelector('#filter-account')?.addEventListener('change', (e) => {
    filterState.accountId = e.target.value;
    filterState.currentPage = 1;
    renderTransactionsView(container);
  });

  container.querySelector('#btn-reset-filters')?.addEventListener('click', () => {
    filterState.search = '';
    filterState.type = 'all';
    filterState.categoryId = 'all';
    filterState.accountId = 'all';
    filterState.dateRange = 'thisMonth';
    filterState.currentPage = 1;
    renderTransactionsView(container);
  });

  // Sorting
  container.querySelectorAll('.sortable-th').forEach(th => {
    th.addEventListener('click', () => {
      const field = th.dataset.sort;
      if (filterState.sortBy === field) {
        filterState.sortOrder = filterState.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        filterState.sortBy = field;
        filterState.sortOrder = 'desc';
      }
      renderTransactionsView(container);
    });
  });

  // Pagination
  container.querySelector('#btn-page-prev')?.addEventListener('click', () => {
    if (filterState.currentPage > 1) {
      filterState.currentPage--;
      renderTransactionsView(container);
    }
  });

  container.querySelector('#btn-page-next')?.addEventListener('click', () => {
    if (filterState.currentPage < totalPages) {
      filterState.currentPage++;
      renderTransactionsView(container);
    }
  });

  // Button actions
  container.querySelector('#btn-add-tx')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('OPEN_TRANSACTION_MODAL'));
  });

  // Export CSV
  container.querySelector('#btn-export-tx-csv')?.addEventListener('click', () => {
    const headers = [
      { label: 'Date', key: 'date' },
      { label: 'Merchant', key: 'merchant' },
      { label: 'Description', key: 'description' },
      { label: 'Category', key: 'categoryName' },
      { label: 'Account', key: 'accountName' },
      { label: 'Type', key: 'type' },
      { label: 'Amount', key: 'amount' },
      { label: 'Notes', key: 'notes' }
    ];

    const exportRows = filtered.map(t => ({
      date: t.date,
      merchant: t.merchant || '',
      description: t.description || '',
      categoryName: catMap[t.categoryId]?.name || '',
      accountName: accMap[t.accountId]?.name || '',
      type: t.type,
      amount: t.amount,
      notes: t.notes || ''
    }));

    const csvContent = generateCSV(headers, exportRows);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `BudgetOS_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Row Edit / Duplicate / Delete
  container.querySelectorAll('.btn-edit-tx').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const tx = transactions.find(t => t.id === id);
      if (tx) {
        window.dispatchEvent(new CustomEvent('OPEN_TRANSACTION_MODAL', { detail: { transaction: tx } }));
      }
    });
  });

  container.querySelectorAll('.btn-duplicate-tx').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const tx = transactions.find(t => t.id === id);
      if (tx) {
        const copyTx = {
          ...tx,
          id: 'tx_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
          description: `${tx.description} (Copy)`,
          date: new Date().toISOString().split('T')[0]
        };
        await state.addTransaction(copyTx);
        renderTransactionsView(container);
      }
    });
  });

  container.querySelectorAll('.btn-delete-tx').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      await state.deleteTransaction(id);
      renderTransactionsView(container);
    });
  });
}
