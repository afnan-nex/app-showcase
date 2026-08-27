/**
 * TimeGrid - Schedule Analytics & Canvas 2D Charting Engine
 * High-DPI category distribution donut chart and time allocation visualizations.
 */

import { CATEGORIES } from './templates.js';
import { formatDuration } from '../core/time.js';

export function renderCategoryDonut(canvas, blocks = []) {
  if (!canvas) return;

  const dpr = window.devicePixelRatio || 1;
  const logicalWidth = 220;
  const logicalHeight = 150;

  // Scale canvas for HiDPI sharpness
  canvas.width = logicalWidth * dpr;
  canvas.height = logicalHeight * dpr;
  canvas.style.width = `${logicalWidth}px`;
  canvas.style.height = `${logicalHeight}px`;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, logicalWidth, logicalHeight);

  // Group minutes by category
  const catMinutes = {};
  let totalMin = 0;

  for (const b of blocks) {
    const dur = Math.max(0, b.endMinute - b.startMinute);
    const cat = b.category || 'Deep Work';
    catMinutes[cat] = (catMinutes[cat] || 0) + dur;
    totalMin += dur;
  }

  const entries = Object.entries(catMinutes).filter(([, mins]) => mins > 0);

  if (totalMin === 0 || entries.length === 0) {
    ctx.fillStyle = '#64748b';
    ctx.font = '11px -apple-system, BlinkMacSystemFont, "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No scheduled blocks on this date', logicalWidth / 2, logicalHeight / 2);
    return;
  }

  const centerX = logicalWidth / 2;
  const centerY = logicalHeight / 2 - 8;
  const outerRadius = Math.min(centerX, centerY) - 12;
  const innerRadius = outerRadius * 0.65;

  let startAngle = -Math.PI / 2;

  // Draw slices
  for (const [cat, mins] of entries) {
    const sliceAngle = (mins / totalMin) * (Math.PI * 2);
    const endAngle = startAngle + sliceAngle;
    const catDef = CATEGORIES[cat] || { color: '#0284c7' };

    ctx.fillStyle = catDef.color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
    ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fill();

    // Subtle slice boundary line
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.stroke();

    startAngle = endAngle;
  }

  // Center Text: Total Duration
  ctx.fillStyle = '#f8fafc';
  ctx.font = '700 15px "JetBrains Mono", Consolas, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(formatDuration(totalMin), centerX, centerY - 2);

  // Center Subtitle
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 10px -apple-system, BlinkMacSystemFont, "Inter", sans-serif';
  ctx.fillText('Scheduled', centerX, centerY + 14);
}
