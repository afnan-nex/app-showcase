/* ==========================================================================
   WIREFRAMELAB - CANVAS DOM & SVG RENDERING ENGINE
   ========================================================================== */

import { state } from './state.js';

export class CanvasRenderer {
  constructor(worldEl, overlayEl, wiresEl) {
    this.worldEl = worldEl;
    this.overlayEl = overlayEl;
    this.wiresEl = wiresEl;
    this.artboardEls = new Map();
    this.objectEls = new Map();

    // Subscribe to state events
    state.on('project:changed', () => this.render());
    state.on('selection:changed', () => this.renderSelectionOverlay());
    state.on('viewport:changed', (vp) => this.updateViewportTransform(vp));
    state.on('mode:changed', () => this.render());
  }

  updateViewportTransform(vp) {
    if (!this.worldEl) return;
    const transformStr = `translate(${vp.panX}px, ${vp.panY}px) scale(${vp.zoom})`;
    this.worldEl.style.transform = transformStr;
    if (this.overlayEl) {
      this.overlayEl.style.transform = transformStr;
    }
    if (this.wiresEl) {
      this.wiresEl.style.transform = transformStr;
    }
    const guidesEl = document.getElementById('canvas-guides-container');
    if (guidesEl) {
      guidesEl.style.transform = transformStr;
    }
  }

  render() {
    if (!this.worldEl) return;
    this.worldEl.innerHTML = '';
    this.artboardEls.clear();
    this.objectEls.clear();

    const page = state.getActivePage();
    const artboards = page.artboards || [];
    const objects = page.objects || [];

    // 1. Render Artboards
    artboards.forEach(ab => {
      if (ab.hidden) return;
      const abEl = document.createElement('div');
      abEl.className = `artboard-node ${state.selection.has(ab.id) ? 'selected' : ''}`;
      abEl.id = `artboard-${ab.id}`;
      abEl.dataset.artboardId = ab.id;
      abEl.style.left = `${ab.x}px`;
      abEl.style.top = `${ab.y}px`;
      abEl.style.width = `${ab.width}px`;
      abEl.style.height = `${ab.height}px`;
      abEl.style.backgroundColor = ab.background || '#ffffff';

      // Artboard Title Label
      const labelEl = document.createElement('div');
      labelEl.className = 'artboard-label-badge';
      labelEl.dataset.artboardId = ab.id;
      labelEl.innerHTML = `
        <span class="artboard-label-name">${escapeHTML(ab.name)}</span>
        <span class="artboard-label-dims">${ab.width}×${ab.height}</span>
      `;
      abEl.appendChild(labelEl);

      // Clip Box for child elements
      const clipBox = document.createElement('div');
      clipBox.className = 'artboard-clip-box';
      clipBox.dataset.artboardId = ab.id;
      abEl.appendChild(clipBox);

      this.worldEl.appendChild(abEl);
      this.artboardEls.set(ab.id, abEl);
    });

    // 2. Render Objects
    objects.forEach(obj => {
      if (obj.hidden) return;
      const objEl = this.createObjectElement(obj);
      this.objectEls.set(obj.id, objEl);

      if (obj.artboardId && this.artboardEls.has(obj.artboardId)) {
        const clip = this.artboardEls.get(obj.artboardId).querySelector('.artboard-clip-box');
        clip.appendChild(objEl);
      } else {
        this.worldEl.appendChild(objEl);
      }
    });

    // 3. Render Selection Overlays & Handles
    this.renderSelectionOverlay();

    // 4. Render Prototype Connection Wires
    this.renderPrototypeWires();
  }

  createObjectElement(obj) {
    const el = document.createElement('div');
    el.className = `wf-object ${state.selection.has(obj.id) ? 'selected' : ''} ${obj.locked ? 'locked' : ''}`;
    el.id = `wf-obj-${obj.id}`;
    el.dataset.objectId = obj.id;
    if (obj.artboardId) el.dataset.artboardId = obj.artboardId;

    // Positioning and geometry
    el.style.left = `${obj.x}px`;
    el.style.top = `${obj.y}px`;
    el.style.width = `${obj.width}px`;
    el.style.height = `${obj.height}px`;
    if (obj.rotation) {
      el.style.transform = `rotate(${obj.rotation}deg)`;
    }

    // Apply custom styles
    const s = obj.styles || {};
    if (s.fill && s.fill !== 'transparent') el.style.backgroundColor = s.fill;
    if (s.stroke && s.strokeWidth > 0 && s.stroke !== 'transparent') {
      el.style.border = `${s.strokeWidth}px ${s.strokeStyle || 'solid'} ${s.stroke}`;
    }
    if (s.borderRadius !== undefined) el.style.borderRadius = `${s.borderRadius}px`;
    if (s.opacity !== undefined) el.style.opacity = s.opacity;
    if (s.shadow) el.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';

    // Component Inner HTML
    el.innerHTML = this.renderComponentHTML(obj);

    // If in prototype mode, add connector pin
    if (state.mode === 'prototype') {
      const pin = document.createElement('div');
      pin.className = 'prototype-connector-pin';
      pin.dataset.sourceObjectId = obj.id;
      pin.innerHTML = '+';
      el.appendChild(pin);
    }

    return el;
  }

  renderComponentHTML(obj) {
    const p = obj.props || {};
    const s = obj.styles || {};
    const type = obj.type;

    switch (type) {
      case 'text':
        return `
          <div class="wf-node wf-text ${p.variant || 'variant-heading-2'}" style="
            font-family: ${s.fontFamily || 'inherit'};
            font-size: ${s.fontSize || 20}px;
            font-weight: ${s.fontWeight || '600'};
            color: ${s.textColor || '#1f2937'};
            text-align: ${s.textAlign || 'left'};
          ">${escapeHTML(p.text || 'Text')}</div>
        `;

      case 'paragraph':
        return `
          <div class="wf-node wf-text variant-paragraph" style="
            font-family: ${s.fontFamily || 'inherit'};
            font-size: ${s.fontSize || 13}px;
            color: ${s.textColor || '#4b5563'};
            text-align: ${s.textAlign || 'left'};
          ">${escapeHTML(p.text || '')}</div>
        `;

      case 'button':
        return `
          <div class="wf-node wf-button variant-${p.variant || 'primary'}" style="
            font-size: ${s.fontSize || 13}px;
            color: ${s.textColor || '#ffffff'};
            background-color: ${s.fill || '#1f2937'};
            border-color: ${s.stroke || '#1f2937'};
            border-radius: ${s.borderRadius || 6}px;
          ">
            <span>${escapeHTML(p.label || 'Button')}</span>
          </div>
        `;

      case 'input':
        return `
          <div class="wf-node wf-input ${p.value ? 'has-value' : ''}" style="
            border-radius: ${s.borderRadius || 6}px;
            background-color: ${s.fill || '#ffffff'};
          ">
            <svg class="wf-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <span>${escapeHTML(p.value || p.placeholder || 'Input field...')}</span>
          </div>
        `;

      case 'textarea':
        return `
          <div class="wf-node wf-textarea" style="
            border-radius: ${s.borderRadius || 6}px;
            background-color: ${s.fill || '#ffffff'};
          ">${escapeHTML(p.value || p.placeholder || 'Textarea...')}</div>
        `;

      case 'image':
        return `
          <div class="wf-node wf-image" style="border-radius: ${s.borderRadius || 6}px;">
            <svg class="wf-image-cross" viewBox="0 0 100 100" preserveAspectRatio="none">
              <line x1="0" y1="0" x2="100" y2="100" />
              <line x1="100" y1="0" x2="0" y2="100" />
            </svg>
            <svg class="wf-image-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            <span class="wf-image-label">${escapeHTML(p.label || 'Image Placeholder')}</span>
          </div>
        `;

      case 'card':
        return `
          <div class="wf-node wf-card" style="border-radius: ${s.borderRadius || 8}px; background-color: ${s.fill || '#ffffff'};">
            ${p.title ? `<div class="wf-card-header">${escapeHTML(p.title)}</div>` : ''}
            ${p.hasImage ? `<div class="wf-card-media"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>` : ''}
            <div class="wf-card-body">${escapeHTML(p.body || 'Card body content')}</div>
            ${p.hasActions ? `<div class="wf-card-footer"><button style="padding: 4px 10px; font-size: 11px; background: #1f2937; color: white; border: none; border-radius: 4px;">${escapeHTML(p.actionText || 'Action')}</button></div>` : ''}
          </div>
        `;

      case 'navbar':
        const linksHtml = (p.links || ['Home', 'Features', 'Pricing']).map(link => 
          `<span class="${link === p.activeLink ? 'active' : ''}">${escapeHTML(link)}</span>`
        ).join('');
        return `
          <div class="wf-node wf-navbar" style="background-color: ${s.fill || '#ffffff'};">
            <div class="wf-navbar-logo">
              <div class="wf-logo-box"></div>
              <span>${escapeHTML(p.brand || 'WireframeLab')}</span>
            </div>
            <div class="wf-navbar-links">${linksHtml}</div>
            ${p.hasCTA ? `<div class="wf-navbar-actions"><button style="padding: 6px 14px; font-size: 12px; background: #1f2937; color: white; border-radius: 4px; border: none;">${escapeHTML(p.ctaText || 'Sign In')}</button></div>` : ''}
          </div>
        `;

      case 'sidebar':
        const itemsHtml = (p.items || ['Overview', 'Analytics', 'Settings']).map((item, idx) => `
          <div class="wf-sidebar-item ${idx === (p.activeIndex || 0) ? 'active' : ''}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
            <span>${escapeHTML(item)}</span>
          </div>
        `).join('');
        return `
          <div class="wf-node wf-sidebar" style="background-color: ${s.fill || '#f9fafb'};">
            <div class="wf-sidebar-header">${escapeHTML(p.title || 'App Nav')}</div>
            ${itemsHtml}
          </div>
        `;

      case 'modal':
        return `
          <div class="wf-node wf-modal" style="border-radius: ${s.borderRadius || 8}px; background-color: ${s.fill || '#ffffff'};">
            <div class="wf-modal-header">
              <span>${escapeHTML(p.title || 'Dialog Title')}</span>
              <span class="wf-modal-close">✕</span>
            </div>
            <div class="wf-modal-body">${escapeHTML(p.message || 'Modal dialog text description.')}</div>
            <div class="wf-modal-footer">
              <button style="padding: 5px 12px; background: transparent; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px;">${escapeHTML(p.cancelText || 'Cancel')}</button>
              <button style="padding: 5px 12px; background: #1f2937; color: white; border: none; border-radius: 4px; font-size: 12px;">${escapeHTML(p.confirmText || 'Confirm')}</button>
            </div>
          </div>
        `;

      case 'checkbox':
        return `
          <div class="wf-node wf-checkbox">
            <div class="wf-check-box ${p.checked ? 'checked' : ''}"></div>
            <span>${escapeHTML(p.label || 'Checkbox option')}</span>
          </div>
        `;

      case 'radio':
        return `
          <div class="wf-node wf-radio">
            <div class="wf-radio-box ${p.checked ? 'checked' : ''}"></div>
            <span>${escapeHTML(p.label || 'Radio selection')}</span>
          </div>
        `;

      case 'tabs':
        const tabsHtml = (p.tabs || ['Tab 1', 'Tab 2', 'Tab 3']).map((tab, idx) => `
          <div class="wf-tab-item ${idx === (p.activeIndex || 0) ? 'active' : ''}">${escapeHTML(tab)}</div>
        `).join('');
        return `<div class="wf-node wf-tabs">${tabsHtml}</div>`;

      case 'dropdown':
        return `
          <div class="wf-node wf-dropdown" style="border-radius: ${s.borderRadius || 6}px; background-color: ${s.fill || '#ffffff'};">
            <span>${escapeHTML(p.label || 'Select option...')}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        `;

      case 'table':
        const headers = p.headers || ['Column 1', 'Column 2', 'Column 3'];
        const rows = p.rows || [['Data A1', 'Data B1', 'Data C1'], ['Data A2', 'Data B2', 'Data C2']];
        const thead = headers.map(h => `<div class="wf-table-cell">${escapeHTML(h)}</div>`).join('');
        const tbody = rows.map(r => `
          <div class="wf-table-row">
            ${r.map(c => `<div class="wf-table-cell">${escapeHTML(c)}</div>`).join('')}
          </div>
        `).join('');
        return `
          <div class="wf-node wf-table-container" style="border-radius: ${s.borderRadius || 6}px;">
            <div class="wf-table-row wf-table-header">${thead}</div>
            ${tbody}
          </div>
        `;

      case 'avatar':
        return `
          <div class="wf-node wf-avatar" style="
            background-color: ${s.fill || '#d1d5db'};
            color: ${s.textColor || '#374151'};
          ">${escapeHTML(p.initials || 'JD')}</div>
        `;

      case 'divider':
        return `
          <div class="wf-node wf-divider">
            <div class="wf-divider-line" style="border-color: ${s.stroke || '#e5e7eb'};"></div>
            ${p.label ? `<span class="wf-divider-label">${escapeHTML(p.label)}</span>` : ''}
          </div>
        `;

      case 'toggle':
        return `
          <div class="wf-node wf-toggle">
            <div class="wf-toggle-track ${p.checked ? 'checked' : ''}">
              <div class="wf-toggle-thumb"></div>
            </div>
            <span>${escapeHTML(p.label || 'Toggle')}</span>
          </div>
        `;

      case 'chip':
        return `
          <div class="wf-node wf-chip" style="
            background-color: ${s.fill || '#f3f4f6'};
            border-color: ${s.stroke || '#d1d5db'};
            border-radius: ${s.borderRadius || 13}px;
            color: ${s.textColor || '#374151'};
          ">${escapeHTML(p.label || 'Badge')}</div>
        `;

      case 'breadcrumbs':
        const bItems = (p.items || ['Home', 'Section', 'Page']).map((item, idx, arr) => `
          <span class="${idx === arr.length - 1 ? 'active' : ''}">${escapeHTML(item)}</span>
          ${idx < arr.length - 1 ? '<span style="color: #9ca3af;">/</span>' : ''}
        `).join('');
        return `<div class="wf-node wf-breadcrumbs">${bItems}</div>`;

      case 'pagination':
        const pages = [1, 2, 3, 4, 5];
        const pageBtns = pages.map(pg => `
          <div class="wf-page-btn ${pg === (p.current || 2) ? 'active' : ''}">${pg}</div>
        `).join('');
        return `
          <div class="wf-node wf-pagination">
            <div class="wf-page-btn">‹</div>
            ${pageBtns}
            <div class="wf-page-btn">›</div>
          </div>
        `;

      case 'slider':
        return `
          <div class="wf-node wf-slider">
            <div class="wf-slider-track">
              <div class="wf-slider-fill" style="width: ${p.value || 60}%;"></div>
              <div class="wf-slider-thumb" style="left: ${p.value || 60}%;"></div>
            </div>
          </div>
        `;

      case 'alert':
        return `
          <div class="wf-node wf-alert" style="border-radius: ${s.borderRadius || 6}px;">
            <svg class="wf-alert-icon" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div>
              <div style="font-weight: 600; font-size: 12px; margin-bottom: 2px;">${escapeHTML(p.title || 'Alert')}</div>
              <div style="font-size: 11px; color: #6b7280;">${escapeHTML(p.message || 'Alert description')}</div>
            </div>
          </div>
        `;

      case 'chart':
        return `
          <div class="wf-node wf-chart" style="border-radius: ${s.borderRadius || 6}px;">
            <div style="font-size: 11px; font-weight: 600; color: #374151;">${escapeHTML(p.title || 'Chart Skeleton')}</div>
            <div class="wf-chart-bars">
              <div class="wf-chart-bar" style="height: 35%;"></div>
              <div class="wf-chart-bar" style="height: 70%;"></div>
              <div class="wf-chart-bar" style="height: 55%;"></div>
              <div class="wf-chart-bar" style="height: 90%;"></div>
              <div class="wf-chart-bar" style="height: 45%;"></div>
            </div>
          </div>
        `;

      case 'video':
        return `
          <div class="wf-node wf-video" style="border-radius: ${s.borderRadius || 6}px; background-color: ${s.fill || '#1f2937'};">
            <div class="wf-video-play-btn">
              <div class="wf-video-play-icon"></div>
            </div>
          </div>
        `;

      case 'box':
      default:
        return `<div class="wf-node" style="border-radius: ${s.borderRadius || 4}px;"></div>`;
    }
  }

  // --- Selection Overlay with 8 Handles + Rotation handle ---
  renderSelectionOverlay() {
    if (!this.overlayEl) return;
    this.overlayEl.innerHTML = '';

    const selectedObjs = state.getSelectedObjects();
    const selectedArtboards = state.getSelectedArtboards();

    // If artboard selected
    if (selectedArtboards.length > 0 && selectedObjs.length === 0) {
      selectedArtboards.forEach(ab => {
        const box = document.createElement('div');
        box.className = 'selection-overlay';
        box.style.left = `${ab.x}px`;
        box.style.top = `${ab.y}px`;
        box.style.width = `${ab.width}px`;
        box.style.height = `${ab.height}px`;

        // 8 handles on artboard
        this.addTransformHandles(box);
        this.overlayEl.appendChild(box);
      });
      return;
    }

    if (selectedObjs.length === 0) return;

    if (selectedObjs.length === 1) {
      const obj = selectedObjs[0];
      const bounds = this.getObjectAbsoluteBounds(obj);

      const box = document.createElement('div');
      box.className = 'selection-overlay';
      box.style.left = `${bounds.x}px`;
      box.style.top = `${bounds.y}px`;
      box.style.width = `${bounds.width}px`;
      box.style.height = `${bounds.height}px`;
      if (obj.rotation) {
        box.style.transform = `rotate(${obj.rotation}deg)`;
      }

      this.addTransformHandles(box, true);
      this.overlayEl.appendChild(box);
    } else {
      // Multi-selection: calculate unified bounding box
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      selectedObjs.forEach(obj => {
        const bounds = this.getObjectAbsoluteBounds(obj);
        minX = Math.min(minX, bounds.x);
        minY = Math.min(minY, bounds.y);
        maxX = Math.max(maxX, bounds.x + bounds.width);
        maxY = Math.max(maxY, bounds.y + bounds.height);
      });

      const box = document.createElement('div');
      box.className = 'selection-overlay multi-selection';
      box.style.left = `${minX}px`;
      box.style.top = `${minY}px`;
      box.style.width = `${maxX - minX}px`;
      box.style.height = `${maxY - minY}px`;

      this.addTransformHandles(box, false);
      this.overlayEl.appendChild(box);
    }
  }

  addTransformHandles(container, withRotation = false) {
    const handles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
    handles.forEach(dir => {
      const h = document.createElement('div');
      h.className = `transform-handle handle-${dir}`;
      h.dataset.handle = dir;
      container.appendChild(h);
    });

    if (withRotation) {
      const line = document.createElement('div');
      line.className = 'handle-rot-line';
      container.appendChild(line);

      const rot = document.createElement('div');
      rot.className = 'handle-rot';
      rot.dataset.handle = 'rot';
      container.appendChild(rot);
    }
  }

  getObjectAbsoluteBounds(obj) {
    let x = obj.x;
    let y = obj.y;

    if (obj.artboardId) {
      const page = state.getActivePage();
      const ab = page.artboards.find(a => a.id === obj.artboardId);
      if (ab) {
        x += ab.x;
        y += ab.y;
      }
    }

    return { x, y, width: obj.width, height: obj.height };
  }

  // --- Prototype Wires Rendering ---
  renderPrototypeWires() {
    if (!this.wiresEl) return;
    this.wiresEl.innerHTML = '';

    const page = state.getActivePage();
    const artboards = page.artboards || [];
    const objects = page.objects || [];

    const artboardMap = new Map(artboards.map(a => [a.id, a]));

    objects.forEach(obj => {
      if (obj.prototype && obj.prototype.targetArtboardId) {
        const targetAb = artboardMap.get(obj.prototype.targetArtboardId);
        if (!targetAb) return;

        const bounds = this.getObjectAbsoluteBounds(obj);
        const startX = bounds.x + bounds.width;
        const startY = bounds.y + bounds.height / 2;

        const targetX = targetAb.x;
        const targetY = targetAb.y + targetAb.height / 4;

        this.drawBezierWire(startX, startY, targetX, targetY);
      }
    });
  }

  drawBezierWire(x1, y1, x2, y2) {
    const dx = Math.abs(x2 - x1) * 0.5;
    const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('class', 'prototype-wire-path');
    path.setAttribute('marker-end', 'url(#wire-arrow)');
    this.wiresEl.appendChild(path);
  }
}

function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
