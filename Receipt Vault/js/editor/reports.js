/**
 * ReceiptVault - Financial & Warranty Reports Component
 * Comprehensive financial summaries, category/vendor leaderboards, tax deduction metrics, and CSV ledger export.
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
  let totalTax = 0;
  let taxDeductibleSpend = 0;

  for (const doc of documents) {
    const cat = doc.category || 'Other';
    if (!categoryStats[cat]) categoryStats[cat] = { total: 0, count: 0, protected: 0, tax: 0 };
    const amt = Number(doc.amount) || 0;
    const tax = Number(doc.taxAmount) || 0;

    categoryStats[cat].total += amt;
    categoryStats[cat].count++;
    categoryStats[cat].tax += tax;
    totalTax += tax;

    if (doc.tags && (doc.tags.includes('tax-deductible') || doc.tags.includes('work') || doc.tags.includes('software'))) {
      taxDeductibleSpend += amt;
    }

    const w = getWarrantyInfo(doc.warrantyExpirationDate);
    if (w.status === WARRANTY_STATUS.ACTIVE || w.status === WARRANTY_STATUS.EXPIRING_SOON) {
      categoryStats[cat].protected += amt;
    }
  }

  // Group by vendor
  const vendorStats = {};
  for (const doc of documents) {
    const v = doc.vendor || 'Unknown Vendor';
    if (!vendorStats[v]) vendorStats[v] = { total: 0, count: 0, category: doc.category || 'Other' };
    vendorStats[v].total += Number(doc.amount) || 0;
    vendorStats[v].count++;
  }
  const topVendors = Object.entries(vendorStats).sort((a, b) => b[1].total - a[1].total).slice(0, 10);

  // Group by payment method
  const paymentStats = {};
  for (const doc of documents) {
    const p = (doc.paymentMethod || 'Other').split('(')[0].trim();
    if (!paymentStats[p]) paymentStats[p] = { total: 0, count: 0 };
    paymentStats[p].total += Number(doc.amount) || 0;
    paymentStats[p].count++;
  }

  container.innerHTML = `
    <div class="reports-scroll-wrap p-4 flex flex-col gap-4 overflow-y-auto flex-1 max-w-6xl mx-auto w-full">
      
      <!-- Top Action Bar -->
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 class="text-sm font-bold uppercase tracking-wider text-primary">Financial & Warranty Audit Reports</h1>
          <p class="text-xs text-muted">Audited financial summaries, tax breakdowns, and warranty valuations across ${documents.length} records.</p>
        </div>
        <div class="flex items-center gap-2">
          <button class="btn btn-sm btn-secondary" id="btn-print-reports" title="Print Financial Audit">
            ${getIcon('printer', 'icon-xs')} Print Report
          </button>
          <button class="btn btn-sm btn-primary" id="btn-export-csv-report" title="Export CSV Ledger">
            ${getIcon('download', 'icon-xs')} Export Ledger (CSV)
          </button>
        </div>
      </div>

      <!-- Summary Metrics Grid -->
      <div class="grid grid-cols-4 gap-3">
        <div class="card p-3 flex flex-col">
          <span class="text-xs font-semibold text-muted">Total Cumulative Spend</span>
          <span class="font-mono font-bold text-xl text-primary mt-1">$${metrics.totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span class="text-xs text-muted font-sans mt-0.5">Avg $${metrics.avgAmount.toFixed(2)} / receipt</span>
        </div>
        <div class="card p-3 flex flex-col">
          <span class="text-xs font-semibold text-muted">Active Warranty Asset Value</span>
          <span class="font-mono font-bold text-xl text-emerald mt-1">$${metrics.protectedAssetValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span class="text-xs text-muted font-sans mt-0.5">${metrics.coverageRatio}% of total vault value</span>
        </div>
        <div class="card p-3 flex flex-col">
          <span class="text-xs font-semibold text-muted">Tax-Deductible Business Spend</span>
          <span class="font-mono font-bold text-xl text-amber mt-1">$${taxDeductibleSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span class="text-xs text-muted font-sans mt-0.5">Tagged work / business</span>
        </div>
        <div class="card p-3 flex flex-col">
          <span class="text-xs font-semibold text-muted">Total Sales Tax / VAT Logged</span>
          <span class="font-mono font-bold text-xl text-primary mt-1">$${totalTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span class="text-xs text-muted font-sans mt-0.5">Documented receipt tax</span>
        </div>
      </div>

      <!-- Category Breakdown Table -->
      <div class="card p-3 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase text-muted">Spending & Warranty Coverage by Category</span>
          <span class="text-xs text-muted font-mono">${Object.keys(categoryStats).length} Active Categories</span>
        </div>
        <div class="overflow-x-auto">
          <table class="data-grid-table font-sans text-xs w-full">
            <thead>
              <tr>
                <th>Category</th>
                <th class="text-center">Receipts</th>
                <th class="text-right">Total Spend</th>
                <th class="text-right">Share of Total</th>
                <th class="text-right">Sales Tax Logged</th>
                <th class="text-right">Active Warranty Value</th>
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
                    <td class="font-mono text-right text-muted">$${stat.tax.toFixed(2)}</td>
                    <td class="font-mono font-bold text-right text-emerald">$${stat.protected.toFixed(2)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Two-Column Grid: Top Merchants & Payment Methods -->
      <div class="grid grid-cols-2 gap-4">
        
        <!-- Top Merchants Leaderboard -->
        <div class="card p-3 flex flex-col gap-2">
          <span class="text-xs font-bold uppercase text-muted">Top Merchants & Vendors Leaderboard</span>
          <div class="overflow-x-auto">
            <table class="data-grid-table font-sans text-xs w-full">
              <thead>
                <tr>
                  <th>Vendor / Merchant</th>
                  <th class="text-center">Count</th>
                  <th class="text-right">Total Spent</th>
                  <th class="text-right">Avg Ticket</th>
                </tr>
              </thead>
              <tbody>
                ${topVendors.map(([vendor, stat]) => `
                  <tr>
                    <td>
                      <div class="flex flex-col">
                        <span class="font-bold text-primary">${escapeHTML(vendor)}</span>
                        <span class="text-xs text-muted">${escapeHTML(stat.category)}</span>
                      </div>
                    </td>
                    <td class="text-center font-mono">${stat.count}</td>
                    <td class="font-mono font-bold text-right text-primary">$${stat.total.toFixed(2)}</td>
                    <td class="font-mono text-right text-muted">$${(stat.total / stat.count).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Payment Methods Distribution -->
        <div class="card p-3 flex flex-col gap-2">
          <span class="text-xs font-bold uppercase text-muted">Payment Methods Distribution</span>
          <div class="overflow-x-auto">
            <table class="data-grid-table font-sans text-xs w-full">
              <thead>
                <tr>
                  <th>Payment Method</th>
                  <th class="text-center">Transactions</th>
                  <th class="text-right">Total Volume</th>
                  <th class="text-right">Share %</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(paymentStats).map(([method, stat]) => {
                  const share = metrics.totalSpend > 0 ? Math.round((stat.total / metrics.totalSpend) * 100) : 0;
                  return `
                    <tr>
                      <td class="font-bold text-primary">${escapeHTML(method)}</td>
                      <td class="text-center font-mono">${stat.count}</td>
                      <td class="font-mono font-bold text-right text-primary">$${stat.total.toFixed(2)}</td>
                      <td class="font-mono text-right text-secondary">${share}%</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  `;

  // Attach CSV Export & Print
  container.querySelector('#btn-export-csv-report')?.addEventListener('click', () => {
    if (onExportCSV) onExportCSV();
  });

  container.querySelector('#btn-print-reports')?.addEventListener('click', () => {
    window.print();
  });
}
