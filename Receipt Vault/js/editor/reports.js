/**
 * ReceiptVault - Financial & Warranty Reports Component
 * Comprehensive financial summaries, category/vendor leaderboards, and CSV ledger export.
 */

import { getIcon, escapeHTML } from '../core/icons.js';
import { calculateVaultMetrics, getWarrantyInfo, WARRANTY_STATUS } from '../core/warranty.js';

export function renderReports(container, {
  documents = [],
  onExportCSV = null
}) {
  const metrics = calculateVaultMetrics(documents);

  // Group by category
  const categoryStats = {};
  for (const doc of documents) {
    const cat = doc.category || 'Other';
    if (!categoryStats[cat]) categoryStats[cat] = { total: 0, count: 0, protected: 0 };
    const amt = Number(doc.amount) || 0;
    categoryStats[cat].total += amt;
    categoryStats[cat].count++;

    const w = getWarrantyInfo(doc.warrantyExpirationDate);
    if (w.status === WARRANTY_STATUS.ACTIVE || w.status === WARRANTY_STATUS.EXPIRING_SOON) {
      categoryStats[cat].protected += amt;
    }
  }

  // Group by vendor
  const vendorStats = {};
  for (const doc of documents) {
    const v = doc.vendor || 'Unknown';
    if (!vendorStats[v]) vendorStats[v] = { total: 0, count: 0 };
    vendorStats[v].total += Number(doc.amount) || 0;
    vendorStats[v].count++;
  }
  const topVendors = Object.entries(vendorStats).sort((a, b) => b[1].total - a[1].total).slice(0, 8);

  container.innerHTML = `
    <div class="reports-scroll-wrap p-4 flex flex-col gap-4 overflow-y-auto flex-1 max-w-6xl mx-auto w-full">
      
      <!-- Top Action Bar -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-sm font-bold uppercase text-primary">Financial & Warranty Reports</h2>
          <p class="text-xs text-muted">Audited financial summaries and warranty coverage across your filing vault.</p>
        </div>
        <button class="btn btn-sm btn-primary" id="btn-export-csv-report">
          ${getIcon('download', 'icon-xs')} Export Ledger (CSV)
        </button>
      </div>

      <!-- Summary Metrics Grid -->
      <div class="grid grid-cols-3 gap-3">
        <div class="card p-3 flex flex-col">
          <span class="text-xs font-semibold text-muted">Total Cumulative Spend</span>
          <span class="font-mono font-bold text-xl text-primary mt-1">$${metrics.totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="card p-3 flex flex-col">
          <span class="text-xs font-semibold text-muted">Active Warranty Asset Value</span>
          <span class="font-mono font-bold text-xl text-emerald mt-1">$${metrics.protectedAssetValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="card p-3 flex flex-col">
          <span class="text-xs font-semibold text-muted">Protected Asset Ratio</span>
          <span class="font-mono font-bold text-xl text-amber mt-1">${metrics.totalSpend > 0 ? Math.round((metrics.protectedAssetValue / metrics.totalSpend) * 100) : 0}%</span>
        </div>
      </div>

      <!-- Category Breakdown Table -->
      <div class="card p-3 flex flex-col gap-2">
        <span class="text-xs font-bold uppercase text-muted">Spending & Warranty Coverage by Category</span>
        <div class="overflow-x-auto">
          <table class="data-grid-table font-sans text-xs w-full">
            <thead>
              <tr>
                <th>Category</th>
                <th class="text-center">Receipts</th>
                <th class="text-right">Total Spend</th>
                <th class="text-right">Share of Total</th>
                <th class="text-right">Warranty Covered Value</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(categoryStats).map(([cat, stat]) => {
                const share = metrics.totalSpend > 0 ? Math.round((stat.total / metrics.totalSpend) * 100) : 0;
                return `
                  <tr>
                    <td><span class="badge badge-secondary font-bold">${escapeHTML(cat)}</span></td>
                    <td class="text-center font-mono">${stat.count}</td>
                    <td class="font-mono font-bold text-right text-primary">$${stat.total.toFixed(2)}</td>
                    <td class="font-mono text-right text-secondary">${share}%</td>
                    <td class="font-mono text-right text-emerald">$${stat.protected.toFixed(2)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Top Merchants Leaderboard -->
      <div class="card p-3 flex flex-col gap-2">
        <span class="text-xs font-bold uppercase text-muted">Top Merchants & Vendors Leaderboard</span>
        <div class="overflow-x-auto">
          <table class="data-grid-table font-sans text-xs w-full">
            <thead>
              <tr>
                <th>Vendor / Merchant</th>
                <th class="text-center">Transactions</th>
                <th class="text-right">Total Spent</th>
                <th class="text-right">Avg. Ticket</th>
              </tr>
            </thead>
            <tbody>
              ${topVendors.map(([vendor, stat]) => `
                <tr>
                  <td class="font-bold text-primary">${escapeHTML(vendor)}</td>
                  <td class="text-center font-mono">${stat.count}</td>
                  <td class="font-mono font-bold text-right text-primary">$${stat.total.toFixed(2)}</td>
                  <td class="font-mono text-right text-muted">$${(stat.total / stat.count).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;

  // Attach CSV Export
  container.querySelector('#btn-export-csv-report')?.addEventListener('click', () => {
    if (onExportCSV) onExportCSV();
  });
}
