/* ==========================================================================
   WIREFRAMELAB - EXPORT ENGINE (JSON, PNG, SVG, HTML/CSS)
   ========================================================================== */

import { state } from './state.js';
import { createNewProject, generateId } from './models.js';

export class ExportController {
  constructor() {}

  // --- 1. Export Project JSON ---
  exportProjectJSON() {
    const project = state.project;
    const jsonStr = JSON.stringify(project, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/[^a-z0-9]/gi, '_')}.wireframelab.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // --- 2. Import Project JSON with Robust Validation & Recovery ---
  importProjectJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);

      // Validate or repair structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid JSON format: root is not an object.');
      }

      const repaired = {
        id: data.id || generateId('proj'),
        name: typeof data.name === 'string' ? data.name : 'Imported Project',
        version: data.version || '1.0',
        createdAt: data.createdAt || Date.now(),
        updatedAt: Date.now(),
        activePageId: data.activePageId || 'page_1',
        pages: Array.isArray(data.pages) && data.pages.length > 0 ? data.pages : [
          {
            id: 'page_1',
            name: 'Page 1',
            artboards: Array.isArray(data.artboards) ? data.artboards : [],
            objects: Array.isArray(data.objects) ? data.objects : []
          }
        ]
      };

      // Ensure every artboard and object has required fields
      repaired.pages.forEach(page => {
        page.artboards = (page.artboards || []).map(ab => ({
          id: ab.id || generateId('ab'),
          name: ab.name || 'Artboard',
          x: typeof ab.x === 'number' ? ab.x : 100,
          y: typeof ab.y === 'number' ? ab.y : 100,
          width: typeof ab.width === 'number' ? ab.width : 800,
          height: typeof ab.height === 'number' ? ab.height : 600,
          background: ab.background || '#ffffff',
          locked: !!ab.locked,
          hidden: !!ab.hidden
        }));

        page.objects = (page.objects || []).map(obj => ({
          id: obj.id || generateId('obj'),
          type: obj.type || 'box',
          name: obj.name || obj.type || 'Object',
          artboardId: obj.artboardId || null,
          parentId: obj.parentId || null,
          x: typeof obj.x === 'number' ? obj.x : 0,
          y: typeof obj.y === 'number' ? obj.y : 0,
          width: typeof obj.width === 'number' ? obj.width : 100,
          height: typeof obj.height === 'number' ? obj.height : 50,
          rotation: typeof obj.rotation === 'number' ? obj.rotation : 0,
          locked: !!obj.locked,
          hidden: !!obj.hidden,
          styles: obj.styles && typeof obj.styles === 'object' ? obj.styles : {},
          props: obj.props && typeof obj.props === 'object' ? obj.props : {},
          constraints: obj.constraints || { horizontal: 'left', vertical: 'top' },
          prototype: obj.prototype || { targetArtboardId: null, trigger: 'click', animation: 'instant' }
        }));
      });

      state.setProject(repaired);
      return { success: true, project: repaired };
    } catch (err) {
      console.error('Import failed:', err);
      return { success: false, error: err.message };
    }
  }

  // --- 3. Export Artboard as High-DPI PNG via Canvas ---
  async exportArtboardAsPNG(artboardId, scale = 2) {
    const page = state.getActivePage();
    const ab = page.artboards.find(a => a.id === artboardId) || page.artboards[0];
    if (!ab) return;

    const childObjs = page.objects.filter(o => o.artboardId === ab.id && !o.hidden);

    const canvas = document.createElement('canvas');
    canvas.width = ab.width * scale;
    canvas.height = ab.height * scale;
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);

    // Draw Artboard background
    ctx.fillStyle = ab.background || '#ffffff';
    ctx.fillRect(0, 0, ab.width, ab.height);

    // Render objects in z-order
    for (const obj of childObjs) {
      this.drawObjectToCanvas(ctx, obj);
    }

    // Convert to PNG data URL and download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${ab.name.toLowerCase().replace(/[^a-z0-9]/gi, '_')}@${scale}x.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  drawObjectToCanvas(ctx, obj) {
    ctx.save();
    ctx.translate(obj.x + obj.width / 2, obj.y + obj.height / 2);
    if (obj.rotation) {
      ctx.rotate((obj.rotation * Math.PI) / 180);
    }
    ctx.translate(-obj.width / 2, -obj.height / 2);

    const s = obj.styles || {};
    const p = obj.props || {};
    const rad = s.borderRadius || 0;

    // Fill & Stroke
    if (s.fill && s.fill !== 'transparent') {
      ctx.fillStyle = s.fill;
      this.roundRect(ctx, 0, 0, obj.width, obj.height, rad);
      ctx.fill();
    }

    if (s.stroke && s.strokeWidth > 0 && s.stroke !== 'transparent') {
      ctx.strokeStyle = s.stroke;
      ctx.lineWidth = s.strokeWidth;
      this.roundRect(ctx, 0, 0, obj.width, obj.height, rad);
      ctx.stroke();
    }

    // Draw Component Content
    if (obj.type === 'text' || obj.type === 'paragraph') {
      ctx.fillStyle = s.textColor || '#1f2937';
      ctx.font = `${s.fontWeight || '600'} ${s.fontSize || 14}px sans-serif`;
      ctx.textBaseline = 'top';
      ctx.fillText(p.text || '', 0, 0, obj.width);
    } else if (obj.type === 'button') {
      ctx.fillStyle = s.textColor || '#ffffff';
      ctx.font = '600 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.label || 'Button', obj.width / 2, obj.height / 2);
    } else if (obj.type === 'image') {
      // Draw cross lines
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(obj.width, obj.height);
      ctx.moveTo(obj.width, 0);
      ctx.lineTo(0, obj.height);
      ctx.stroke();

      ctx.fillStyle = '#6b7280';
      ctx.font = '500 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.label || 'Image', obj.width / 2, obj.height / 2);
    }

    ctx.restore();
  }

  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  // --- 4. Export Artboard as SVG Vector ---
  exportArtboardAsSVG(artboardId) {
    const page = state.getActivePage();
    const ab = page.artboards.find(a => a.id === artboardId) || page.artboards[0];
    if (!ab) return;

    const childObjs = page.objects.filter(o => o.artboardId === ab.id && !o.hidden);

    let svgElements = '';
    childObjs.forEach(obj => {
      const s = obj.styles || {};
      const p = obj.props || {};
      const fill = s.fill || '#ffffff';
      const stroke = s.stroke || '#1f2937';
      const strokeW = s.strokeWidth !== undefined ? s.strokeWidth : 1;
      const rad = s.borderRadius || 0;

      svgElements += `
        <g transform="translate(${obj.x}, ${obj.y}) rotate(${obj.rotation || 0} ${obj.width/2} ${obj.height/2})">
          <rect width="${obj.width}" height="${obj.height}" rx="${rad}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}"/>
          ${obj.type === 'button' ? `<text x="${obj.width/2}" y="${obj.height/2 + 4}" font-family="sans-serif" font-size="13" font-weight="600" fill="${s.textColor || '#fff'}" text-anchor="middle">${escapeXML(p.label || 'Button')}</text>` : ''}
          ${obj.type === 'text' ? `<text x="0" y="20" font-family="sans-serif" font-size="${s.fontSize || 16}" font-weight="${s.fontWeight || '600'}" fill="${s.textColor || '#1f2937'}">${escapeXML(p.text || 'Text')}</text>` : ''}
        </g>
      `;
    });

    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${ab.width}" height="${ab.height}" viewBox="0 0 ${ab.width} ${ab.height}">
        <rect width="${ab.width}" height="${ab.height}" fill="${ab.background || '#ffffff'}"/>
        ${svgElements}
      </svg>
    `;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ab.name.toLowerCase().replace(/[^a-z0-9]/gi, '_')}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // --- 5. Export Standalone HTML & CSS Wireframe Package ---
  exportHTMLWireframe(artboardId) {
    const page = state.getActivePage();
    const ab = page.artboards.find(a => a.id === artboardId) || page.artboards[0];
    if (!ab) return;

    const childObjs = page.objects.filter(o => o.artboardId === ab.id && !o.hidden);
    let elementsHtml = '';

    childObjs.forEach(obj => {
      const s = obj.styles || {};
      const p = obj.props || {};
      elementsHtml += `
        <div style="position: absolute; left: ${obj.x}px; top: ${obj.y}px; width: ${obj.width}px; height: ${obj.height}px; background: ${s.fill || 'transparent'}; border: ${s.strokeWidth || 1}px solid ${s.stroke || '#1f2937'}; border-radius: ${s.borderRadius || 4}px; font-family: sans-serif; display: flex; align-items: center; justify-content: center;">
          ${escapeXML(p.label || p.text || p.title || '')}
        </div>
      `;
    });

    const htmlDoc = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${escapeXML(ab.name)} - WireframeLab</title>
        <style>
          body { margin: 0; padding: 40px; background: #f3f4f6; display: flex; justify-content: center; }
          .artboard { width: ${ab.width}px; height: ${ab.height}px; background: ${ab.background || '#ffffff'}; position: relative; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border-radius: 4px; overflow: hidden; }
        </style>
      </head>
      <body>
        <div class="artboard">
          ${elementsHtml}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlDoc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ab.name.toLowerCase().replace(/[^a-z0-9]/gi, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

function escapeXML(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
