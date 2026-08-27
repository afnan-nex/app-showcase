/**
 * TimeGrid - Schedule Analytics & Canvas 2D Charting Engine
 * Category distribution donut chart and time allocation visualizations.
 */

import { CATEGORIES } from './templates.js';
import { formatDuration } from '../core/time.js';

export function renderCategoryDonut(canvas, blocks = []) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

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
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No scheduled blocks for this date', w / 2, h / 2);
    return;
  }

  const centerX = w / 2;
  const centerY = h / 2 - 10;
  const outerRadius = Math.min(centerX, centerY) - 15;
  const innerRadius = outerRadius * 0.62;

  let startAngle = -Math.PI / 2;

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

    startAngle = endAngle;
  }

  // Center Text (Total Scheduled Duration)
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 15px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(formatDuration(totalMin), centerX, centerY + 2);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px sans-serif';
  ctx.fillText('Total Scheduled', centerX, centerY + 16);
}
