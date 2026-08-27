/**
 * ReceiptVault - Dashboard Component
 * KPI Summary Cards, Urgent Warranty Expiry Alerts, Category Donut, and Monthly Spending Charts.
 */

import { getIcon, escapeHTML } from '../core/icons.js';
import { calculateVaultMetrics, getWarrantyInfo, getReturnInfo, WARRANTY_STATUS, RETURN_STATUS } from '../core/warranty.js';
import { renderCategoryDonut, renderMonthlyBarChart } from '../engine/charts.js';

export function renderDashboard(container, {
  documents = [],
  onSelectDoc = null,
  onNavigateTab = null
}) {
  const metrics = calculateVaultMetrics(documents);

  // Find urgent action items (warranties expiring in <= 30d or return closing in <= 7d)
  const urgentWarranties = documents.filter(d => {
    const w = getWarrantyInfo(d.warrantyExpirationDate);
    return w.status === WARRANTY_STATUS.EXPIRING_SOON;
  });

  const urgentReturns = documents.filter(d => {
    const r = getReturnInfo(d.returnDeadlineDate);
    return r.status === RETURN_STATUS.CLOSING_SOON || (r.status === RETURN_STATUS.OPEN && r.daysRemaining <= 7);
  });

  container.innerHTML = `
    <div class="dashboard-scroll-wrap p-4 flex flex-col gap-4 overflow-y-auto flex-1 max-w-6xl mx-auto w-full">
      
      <!-- Top KPI Summary Cards -->
      <div class="grid grid-cols-4 gap-3">
        <!-- 1. Total Spend -->
        <div class="card p-3 flex flex-col gap-1">
          <div class="flex items-center justify-between text-muted">
            <span class="text-xs font-semibold">Total Documented Spend</span>
            ${getIcon('dollar', 'icon-sm text-primary')}
          </div>
          <span class="font-mono font-bold text-xl text-primary">$${metrics.totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span class="text-xs text-muted font-sans">${metrics.totalDocuments} total receipts/invoices</span>
        </div>

        <!-- 2. Protected Warranty Value -->
        <div class="card p-3 flex flex-col gap-1">
          <div class="flex items-center justify-between text-muted">
            <span class="text-xs font-semibold">Active Warranty Coverage</span>
            ${getIcon('shieldCheck', 'icon-sm text-emerald')}
          </div>
          <span class="font-mono font-bold text-xl text-emerald">$${metrics.protectedAssetValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span class="text-xs text-muted font-sans">${metrics.activeWarrantiesCount} protected items</span>
        </div>

        <!-- 3. Expiring Soon Warranties -->
        <div class="card p-3 flex flex-col gap-1">
          <div class="flex items-center justify-between text-muted">
            <span class="text-xs font-semibold">Expiring Warranties (&le;30d)</span>
            ${getIcon('shieldAlert', 'icon-sm text-amber')}
          </div>
          <span class="font-mono font-bold text-xl text-amber">${metrics.expiringSoonWarrantiesCount}</span>
          <span class="text-xs text-muted font-sans">Requires warranty extension</span>
        </div>

        <!-- 4. Open Return Windows -->
        <div class="card p-3 flex flex-col gap-1">
          <div class="flex items-center justify-between text-muted">
            <span class="text-xs font-semibold">Active Return Deadlines</span>
            ${getIcon('clock', 'icon-sm text-primary')}
          </div>
          <span class="font-mono font-bold text-xl text-primary">${metrics.openReturnsCount}</span>
          <span class="text-xs text-muted font-sans">Eligible for merchant return</span>
        </div>
      </div>

      <!-- Urgent Alerts Banner (If any expiring soon items) -->
      ${urgentWarranties.length > 0 || urgentReturns.length > 0 ? `
        <div class="card p-3 border-amber bg-amber-subtle flex flex-col gap-2">
          <div class="flex items-center gap-2 text-amber font-bold text-xs">
            ${getIcon('alertTriangle', 'icon-xs')}
            <span>Urgent Expiration & Return Deadlines</span>
          </div>
          <div class="flex flex-wrap gap-2">
            ${urgentWarranties.map(d => `
              <div class="badge badge-warning cursor-pointer flex items-center gap-1 doc-alert-tag" data-id="${d.id}">
                ${getIcon('shieldAlert', 'icon-xs')}
                <span>${escapeHTML(d.title)} (Warranty expires in ${getWarrantyInfo(d.warrantyExpirationDate).daysRemaining}d)</span>
              </div>
            `).join('')}
            ${urgentReturns.map(d => `
              <div class="badge badge-primary cursor-pointer flex items-center gap-1 doc-alert-tag" data-id="${d.id}">
                ${getIcon('clock', 'icon-xs')}
                <span>${escapeHTML(d.title)} (Return window closes in ${getReturnInfo(d.returnDeadlineDate).daysRemaining}d)</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Visual Charts Grid (Category Donut & Monthly Spending Bar) -->
      <div class="grid grid-cols-2 gap-4">
        <!-- Category Distribution Donut -->
        <div class="card p-3 flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold uppercase text-muted">Spending by Category</span>
            <span class="text-xs text-muted font-mono">${metrics.totalDocuments} Receipts</span>
          </div>
          <div class="flex items-center justify-center flex-1" style="height: 220px;">
            <canvas id="dashboard-category-donut" width="300" height="220"></canvas>
          </div>
        </div>

        <!-- Monthly Spending Trend Bars -->
        <div class="card p-3 flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold uppercase text-muted">Monthly Spending History</span>
            <span class="text-xs text-muted font-mono">Last 6 Months</span>
          </div>
          <div class="flex items-center justify-center flex-1" style="height: 220px;">
            <canvas id="dashboard-monthly-bars" width="340" height="220"></canvas>
          </div>
        </div>
      </div>

      <!-- Recent Documents Table -->
      <div class="card p-3 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase text-muted">Recent Documents & Receipts</span>
          <button class="btn btn-xs btn-secondary" id="btn-view-all-docs">View Full Library &rarr;</button>
        </div>

        <div class="overflow-x-auto">
          <table class="data-grid-table font-sans text-xs w-full">
            <thead>
              <tr>
                <th>Document & Vendor</th>
                <th>Category</th>
                <th>Purchase Date</th>
                <th class="text-right">Amount</th>
                <th>Warranty Status</th>
              </tr>
            </thead>
            <tbody>
              ${documents.slice(0, 5).map(doc => {
                const w = getWarrantyInfo(doc.warrantyExpirationDate);
                return `
                  <tr class="cursor-pointer recent-doc-row" data-id="${doc.id}">
                    <td>
                      <div class="flex flex-col">
                        <span class="font-bold text-primary">${escapeHTML(doc.title)}</span>
                        <span class="text-xs text-muted">${escapeHTML(doc.vendor)}</span>
                      </div>
                    </td>
                    <td><span class="badge badge-secondary">${escapeHTML(doc.category)}</span></td>
                    <td class="font-mono text-secondary">${escapeHTML(doc.purchaseDate || '-')}</td>
                    <td class="font-mono font-bold text-right text-primary">${doc.currency || '$'}${Number(doc.amount || 0).toFixed(2)}</td>
                    <td>
                      ${doc.warrantyExpirationDate ? `
                        <span class="badge ${w.status === WARRANTY_STATUS.ACTIVE ? 'badge-success' : (w.status === WARRANTY_STATUS.EXPIRING_SOON ? 'badge-warning' : 'badge-secondary')}">
                          ${escapeHTML(w.label)}
                        </span>
                      ` : '<span class="text-muted text-xs">-</span>'}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;

  // Draw Charts
  const donutCanvas = container.querySelector('#dashboard-category-donut');
  if (donutCanvas) renderCategoryDonut(donutCanvas, documents);

  const barCanvas = container.querySelector('#dashboard-monthly-bars');
  if (barCanvas) renderMonthlyBarChart(barCanvas, documents);

  // Attach Handlers
  container.querySelectorAll('.doc-alert-tag, .recent-doc-row').forEach(el => {
    el.addEventListener('click', () => {
      if (onSelectDoc) onSelectDoc(el.dataset.id);
    });
  });

  container.querySelector('#btn-view-all-docs')?.addEventListener('click', () => {
    if (onNavigateTab) onNavigateTab('library');
  });
}
