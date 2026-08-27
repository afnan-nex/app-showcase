/**
 * ReceiptVault - Canvas 2D Financial & Warranty Charting Engine
 * Pure client-side charting for Category Donut Breakdown, Monthly Spending Bars, and Warranty Coverage Metrics.
 * Supports HiDPI / Retina device pixel ratio scaling for crystal clear rendering.
 */

const CATEGORY_COLORS = {
  Electronics: '#38bdf8',
  Home: '#10b981',
  Clothing: '#f59e0b',
  Software: '#818cf8',
  Subscriptions: '#f472b6',
  Travel: '#38bdf8',
  Groceries: '#34d399',
  Other: '#94a3b8'
};

function setupHiDPICanvas(canvas, cssWidth, cssHeight) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = cssWidth * dpr;
  canvas.height = cssHeight * dpr;
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return { ctx, w: cssWidth, h: cssHeight };
}

export function renderCategoryDonut(canvas, documents = []) {
  if (!canvas) return;
  const parent = canvas.parentElement;
  const cssW = (parent && parent.clientWidth > 40) ? parent.clientWidth : 300;
  const cssH = 220;

  const { ctx, w, h } = setupHiDPICanvas(canvas, cssW, cssH);
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
    ctx.fillStyle = '#94a3b8';
    ctx.font = "12px 'Inter', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText('No spending data to display', w / 2, h / 2);
    return;
  }

  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const centerX = Math.min(w / 2, 120);
  const centerY = h / 2;
  const radius = Math.min(centerX, centerY) - 18;
  const innerRadius = radius * 0.62;

  let currentAngle = -Math.PI / 2;

  // Draw donut slices
  entries.forEach(([cat, amt]) => {
    const sliceAngle = (amt / totalSpend) * (Math.PI * 2);
    const color = CATEGORY_COLORS[cat] || '#94a3b8';

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
    ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
    ctx.closePath();
    ctx.fill();

    currentAngle += sliceAngle;
  });

  // Center Text (Total Amount)
  ctx.fillStyle = '#f8fafc';
  ctx.font = "bold 15px 'JetBrains Mono', Consolas, monospace";
  ctx.textAlign = 'center';
  ctx.fillText(`$${totalSpend.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, centerX, centerY + 2);
  ctx.fillStyle = '#94a3b8';
  ctx.font = "9px 'Inter', sans-serif";
  ctx.fillText('TOTAL SPEND', centerX, centerY + 16);

  // Draw Legend on the right side
  const legendX = centerX + radius + 24;
  let legendY = 32;
  ctx.textAlign = 'left';

  entries.slice(0, 6).forEach(([cat, amt]) => {
    const percent = Math.round((amt / totalSpend) * 100);
    const color = CATEGORY_COLORS[cat] || '#94a3b8';

    // Color box
    ctx.fillStyle = color;
    ctx.fillRect(legendX, legendY, 8, 8);

    // Label & Percentage
    ctx.fillStyle = '#e2e8f0';
    ctx.font = "10.5px 'Inter', sans-serif";
    ctx.fillText(`${cat.slice(0, 11)}`, legendX + 13, legendY + 7);

    ctx.fillStyle = '#94a3b8';
    ctx.font = "10px 'JetBrains Mono', Consolas, monospace";
    ctx.fillText(`${percent}%`, legendX + 90, legendY + 7);

    legendY += 24;
  });
}

export function renderMonthlyBarChart(canvas, documents = []) {
  if (!canvas) return;
  const parent = canvas.parentElement;
  const cssW = (parent && parent.clientWidth > 40) ? parent.clientWidth : 340;
  const cssH = 220;

  const { ctx, w, h } = setupHiDPICanvas(canvas, cssW, cssH);
  ctx.clearRect(0, 0, w, h);

  // Group by YYYY-MM
  const monthTotals = {};
  for (const doc of documents) {
    if (!doc.purchaseDate) continue;
    const key = doc.purchaseDate.slice(0, 7); // '2024-01'
    monthTotals[key] = (monthTotals[key] || 0) + (Number(doc.amount) || 0);
  }

  const months = Object.keys(monthTotals).sort().slice(-6); // Last 6 recorded months
  if (months.length === 0) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = "12px 'Inter', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText('No monthly transaction history', w / 2, h / 2);
    return;
  }

  const maxVal = Math.max(...months.map(m => monthTotals[m]), 100);
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 30;
  const chartW = w - paddingLeft - paddingRight;
  const chartH = h - paddingTop - paddingBottom;

  // Grid Lines
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 3; i++) {
    const yLine = paddingTop + (chartH / 3) * i;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, yLine);
    ctx.lineTo(w - paddingRight, yLine);
    ctx.stroke();

    const gridVal = Math.round(maxVal - (maxVal / 3) * i);
    ctx.fillStyle = '#64748b';
    ctx.font = "9px 'JetBrains Mono', Consolas, monospace";
    ctx.textAlign = 'right';
    ctx.fillText(`$${gridVal}`, paddingLeft - 6, yLine + 3);
  }

  const gap = chartW / months.length;
  const barWidth = Math.min(32, gap * 0.6);

  months.forEach((m, idx) => {
    const val = monthTotals[m];
    const barH = (val / maxVal) * chartH;
    const x = paddingLeft + idx * gap + (gap - barWidth) / 2;
    const y = h - paddingBottom - barH;

    // Draw Bar with subtle gradient
    const gradient = ctx.createLinearGradient(0, y, 0, y + barH);
    gradient.addColorStop(0, '#38bdf8');
    gradient.addColorStop(1, 'rgba(56, 189, 248, 0.4)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barH, [3, 3, 0, 0]);
    ctx.fill();

    // Value Label above bar
    ctx.fillStyle = '#f8fafc';
    ctx.font = "bold 9.5px 'JetBrains Mono', Consolas, monospace";
    ctx.textAlign = 'center';
    ctx.fillText(`$${Math.round(val)}`, x + barWidth / 2, y - 5);

    // Month Label below bar
    ctx.fillStyle = '#94a3b8';
    ctx.font = "10px 'Inter', sans-serif";
    const dateObj = new Date(m + '-02');
    const monthShort = isNaN(dateObj.getTime()) ? m : dateObj.toLocaleString('en-US', { month: 'short' });
    ctx.fillText(monthShort, x + barWidth / 2, h - 12);
  });
}
