/**
 * ReceiptVault - Canvas 2D Financial & Warranty Charting Engine
 * Pure client-side charting for Category Donut Breakdown, Monthly Spending Bars, and Vendor Ranks.
 */

const CATEGORY_COLORS = {
  Electronics: '#58a6ff',
  Home: '#3fb950',
  Clothing: '#d29922',
  Software: '#bc8cff',
  Subscriptions: '#f778ba',
  Travel: '#79c0ff',
  Groceries: '#56d364',
  Other: '#8b949e'
};

export function renderCategoryDonut(canvas, documents = []) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // Calculate category totals
  const totals = {};
  let totalSpend = 0;

  for (const doc of documents) {
    const cat = doc.category || 'Other';
    const amt = Number(doc.amount) || 0;
    totals[cat] = (totals[cat] || 0) + amt;
    totalSpend += amt;
  }

  if (totalSpend === 0) {
    ctx.fillStyle = '#8b949e';
    ctx.font = "12px 'Inter', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText('No spending data to display', w / 2, h / 2);
    return;
  }

  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const centerX = w / 2;
  const centerY = h / 2 - 15;
  const radius = Math.min(centerX, centerY) - 20;
  const innerRadius = radius * 0.58;

  let currentAngle = -Math.PI / 2;

  // Draw donut slices
  entries.forEach(([cat, amt]) => {
    const sliceAngle = (amt / totalSpend) * (Math.PI * 2);
    const color = CATEGORY_COLORS[cat] || '#8b949e';

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
    ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
    ctx.closePath();
    ctx.fill();

    currentAngle += sliceAngle;
  });

  // Center Text (Total Amount)
  ctx.fillStyle = '#f0f6fc';
  ctx.font = "bold 16px 'JetBrains Mono', monospace";
  ctx.textAlign = 'center';
  ctx.fillText(`$${totalSpend.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, centerX, centerY + 2);
  ctx.fillStyle = '#8b949e';
  ctx.font = "10px 'Inter', sans-serif";
  ctx.fillText('TOTAL SPEND', centerX, centerY + 16);
}

export function renderMonthlyBarChart(canvas, documents = []) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // Group by YYYY-MM
  const monthTotals = {};
  for (const doc of documents) {
    if (!doc.purchaseDate) continue;
    const key = doc.purchaseDate.slice(0, 7); // '2024-01'
    monthTotals[key] = (monthTotals[key] || 0) + (Number(doc.amount) || 0);
  }

  const months = Object.keys(monthTotals).sort().slice(-6); // Last 6 months
  if (months.length === 0) {
    ctx.fillStyle = '#8b949e';
    ctx.font = "12px 'Inter', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText('No monthly transaction history', w / 2, h / 2);
    return;
  }

  const maxVal = Math.max(...months.map(m => monthTotals[m]), 100);
  const paddingX = 40;
  const paddingY = 30;
  const chartW = w - paddingX * 2;
  const chartH = h - paddingY * 2;

  const barWidth = Math.min(36, chartW / months.length - 12);
  const gap = chartW / months.length;

  months.forEach((m, idx) => {
    const val = monthTotals[m];
    const barH = (val / maxVal) * chartH;
    const x = paddingX + idx * gap + (gap - barWidth) / 2;
    const y = h - paddingY - barH;

    // Draw Bar
    ctx.fillStyle = '#58a6ff';
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
    ctx.fill();

    // Value Label above bar
    ctx.fillStyle = '#c9d1d9';
    ctx.font = "bold 10px 'JetBrains Mono', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(`$${Math.round(val)}`, x + barWidth / 2, y - 6);

    // Month Label below bar
    ctx.fillStyle = '#8b949e';
    ctx.font = "10px 'Inter', sans-serif";
    const monthShort = new Date(m + '-01').toLocaleString('en-US', { month: 'short' });
    ctx.fillText(monthShort, x + barWidth / 2, h - 10);
  });
}
