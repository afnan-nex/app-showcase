/* ==========================================================================
   CANVASFLOW — SVG Vector Exporter
   Generates clean, scalable, standalone SVG vector documents from board objects
   ========================================================================== */

import { getObjectBounds, unionBounds, DEG_TO_RAD, getShapeAnchors } from './math.js';

export function exportBoardToSVG(board, options = {}) {
  const { bg = 'canvas', scope = 'all', theme = 'dark' } = options;
  const isDark = theme === 'dark';

  const objectsMap = new Map((board.objects || []).map(o => [o.id, o]));

  let targetObjects = (board.objects || []).filter(o => o.visible !== false);
  if (scope === 'selection' && options.selectedIds && options.selectedIds.size > 0) {
    targetObjects = targetObjects.filter(o => options.selectedIds.has(o.id));
  }

  if (targetObjects.length === 0) return null;

  const bounds = unionBounds(targetObjects.map(o => getObjectBounds(o)));
  const padding = 50;
  const width = Math.max(100, Math.ceil(bounds.width + padding * 2));
  const height = Math.max(100, Math.ceil(bounds.height + padding * 2));
  const minX = bounds.x - padding;
  const minY = bounds.y - padding;

  let bgColor = 'none';
  if (bg === 'canvas') {
    bgColor = isDark ? '#16171b' : '#ffffff';
  } else if (bg === 'white') {
    bgColor = '#ffffff';
  }

  let svgElements = '';

  for (const obj of targetObjects) {
    svgElements += renderObjectToSVG(obj, objectsMap);
  }

  const svgDocument = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <style>
      text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif; }
    </style>
    <marker id="arrow-triangle" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="context-stroke" />
    </marker>
    <filter id="sticky-shadow" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#000000" flood-opacity="0.18" />
    </filter>
  </defs>
  ${bgColor !== 'none' ? `<rect x="${minX}" y="${minY}" width="${width}" height="${height}" fill="${bgColor}" />` : ''}
  ${svgElements}
</svg>`;

  return svgDocument;
}

function renderObjectToSVG(obj, objectsMap = new Map()) {
  const stroke = obj.stroke || 'none';
  const fill = obj.fill || 'none';
  const strokeWidth = obj.strokeWidth ?? 2;
  const opacity = obj.opacity ?? 1;

  let dashArray = '';
  if (obj.strokeStyle === 'dashed') dashArray = 'stroke-dasharray="8 6"';
  else if (obj.strokeStyle === 'dotted') dashArray = 'stroke-dasharray="3 4"';

  let transform = '';
  if (obj.rotation) {
    const cx = obj.x + (obj.width || 0) / 2;
    const cy = obj.y + (obj.height || 0) / 2;
    transform = `transform="rotate(${obj.rotation} ${cx} ${cy})"`;
  }

  const commonAttrs = `opacity="${opacity}" stroke="${stroke}" fill="${fill}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" ${dashArray} ${transform}`;

  switch (obj.type) {
    case 'rectangle':
      return `<rect x="${obj.x}" y="${obj.y}" width="${obj.width}" height="${obj.height}" rx="${obj.cornerRadius || 0}" ${commonAttrs} />\n`;

    case 'rounded-rectangle':
      return `<rect x="${obj.x}" y="${obj.y}" width="${obj.width}" height="${obj.height}" rx="${obj.cornerRadius || 12}" ${commonAttrs} />\n`;

    case 'ellipse': {
      const rx = obj.width / 2;
      const ry = obj.height / 2;
      return `<ellipse cx="${obj.x + rx}" cy="${obj.y + ry}" rx="${rx}" ry="${ry}" ${commonAttrs} />\n`;
    }

    case 'diamond': {
      const cx = obj.x + obj.width / 2;
      const cy = obj.y + obj.height / 2;
      const points = `${cx},${obj.y} ${obj.x + obj.width},${cy} ${cx},${obj.y + obj.height} ${obj.x},${cy}`;
      return `<polygon points="${points}" ${commonAttrs} />\n`;
    }

    case 'line':
      return `<line x1="${obj.x}" y1="${obj.y}" x2="${obj.x2 ?? obj.x}" y2="${obj.y2 ?? obj.y}" ${commonAttrs} />\n`;

    case 'arrow': {
      const marker = obj.arrowHeadEnd === 'triangle' ? 'marker-end="url(#arrow-triangle)"' : '';
      return `<line x1="${obj.x}" y1="${obj.y}" x2="${obj.x2 ?? obj.x}" y2="${obj.y2 ?? obj.y}" ${marker} ${commonAttrs} />\n`;
    }

    case 'connector': {
      let x1 = obj.x;
      let y1 = obj.y;
      let x2 = obj.x2 ?? x1 + 100;
      let y2 = obj.y2 ?? y1 + 100;

      if (obj.startBinding && objectsMap.has(obj.startBinding.elementId)) {
        const target = objectsMap.get(obj.startBinding.elementId);
        const anchors = getShapeAnchors(target);
        const match = anchors.find(a => a.id === obj.startBinding.anchor);
        if (match) { x1 = match.x; y1 = match.y; }
      }

      if (obj.endBinding && objectsMap.has(obj.endBinding.elementId)) {
        const target = objectsMap.get(obj.endBinding.elementId);
        const anchors = getShapeAnchors(target);
        const match = anchors.find(a => a.id === obj.endBinding.anchor);
        if (match) { x2 = match.x; y2 = match.y; }
      }

      const dx = x2 - x1;
      const dy = y2 - y1;

      let d = `M ${x1} ${y1} L ${x2} ${y2}`;
      if (obj.routing === 'curved') {
        const cp1x = x1 + dx * 0.5;
        const cp1y = y1;
        const cp2x = x1 + dx * 0.5;
        const cp2y = y2;
        d = `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
      } else if (obj.routing === 'stepped') {
        const midX = x1 + dx / 2;
        d = `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
      }

      const marker = obj.arrowHeadEnd === 'triangle' ? 'marker-end="url(#arrow-triangle)"' : '';
      return `<path d="${d}" ${marker} ${commonAttrs} fill="none" />\n`;
    }

    case 'pencil':
    case 'highlighter': {
      if (!obj.points || obj.points.length < 2) return '';
      let pathD = `M ${obj.points[0].x} ${obj.points[0].y}`;
      for (let i = 1; i < obj.points.length; i++) {
        pathD += ` L ${obj.points[i].x} ${obj.points[i].y}`;
      }
      return `<path d="${pathD}" ${commonAttrs} fill="none" />\n`;
    }

    case 'text': {
      const lines = (obj.text || '').split('\n');
      const fontSize = obj.fontSize || 18;
      const lineHeight = fontSize * (obj.lineHeight || 1.35);
      const textAnchor = obj.textAlign === 'center' ? 'middle' : (obj.textAlign === 'right' ? 'end' : 'start');
      let textX = obj.x;
      if (obj.textAlign === 'center') textX = obj.x + obj.width / 2;
      else if (obj.textAlign === 'right') textX = obj.x + obj.width;

      let tspans = '';
      lines.forEach((line, i) => {
        tspans += `<tspan x="${textX}" dy="${i === 0 ? fontSize : lineHeight}">${escapeXml(line)}</tspan>`;
      });

      return `<text x="${textX}" y="${obj.y}" font-size="${fontSize}" font-weight="${obj.fontWeight || 'normal'}" font-style="${obj.fontStyle || 'normal'}" fill="${obj.color || '#f3f4f6'}" text-anchor="${textAnchor}" opacity="${opacity}" ${transform}>${tspans}</text>\n`;
    }

    case 'sticky': {
      const lines = (obj.text || '').split('\n');
      const fontSize = obj.fontSize || 15;
      const padding = 14;
      const lineHeight = fontSize * 1.35;
      let tspans = '';
      lines.forEach((line, i) => {
        tspans += `<tspan x="${obj.x + padding}" dy="${i === 0 ? fontSize : lineHeight}">${escapeXml(line)}</tspan>`;
      });

      return `
        <g filter="url(#sticky-shadow)" opacity="${opacity}" ${transform}>
          <rect x="${obj.x}" y="${obj.y}" width="${obj.width}" height="${obj.height}" rx="4" fill="${obj.fill || '#fef08a'}" stroke="rgba(0,0,0,0.1)" stroke-width="1" />
          <text x="${obj.x + padding}" y="${obj.y + padding}" font-size="${fontSize}" font-weight="500" fill="${obj.color || '#713f12'}">${tspans}</text>
        </g>\n`;
    }

    case 'image': {
      return `<image href="${obj.src}" x="${obj.x}" y="${obj.y}" width="${obj.width}" height="${obj.height}" opacity="${opacity}" ${transform} />\n`;
    }

    default:
      return '';
  }
}

function escapeXml(unsafe) {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
