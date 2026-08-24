/* ==========================================================================
   WIREFRAMELAB - RIGHT PANEL PROPERTIES INSPECTOR
   ========================================================================== */

import { state } from './state.js';

export class PropertiesController {
  constructor(containerEl) {
    this.containerEl = containerEl;

    state.on('selection:changed', () => this.render());
    state.on('project:changed', () => this.render());
  }

  render() {
    if (!this.containerEl) return;

    const selectedObjs = state.getSelectedObjects();
    const selectedArtboards = state.getSelectedArtboards();

    // 1. Empty State
    if (selectedObjs.length === 0 && selectedArtboards.length === 0) {
      this.containerEl.innerHTML = `
        <div class="inspector-empty-state">
          <svg class="inspector-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
          <div>Select an artboard or component to inspect and edit its properties.</div>
        </div>
      `;
      return;
    }

    // 2. Artboard Selected
    if (selectedArtboards.length > 0 && selectedObjs.length === 0) {
      this.renderArtboardProperties(selectedArtboards[0]);
      this.initScrubbableLabels();
      return;
    }

    // 3. Single / Multi-Object Selected
    if (selectedObjs.length === 1) {
      this.renderSingleObjectProperties(selectedObjs[0]);
    } else {
      this.renderMultiObjectProperties(selectedObjs);
    }

    this.initScrubbableLabels();
  }

  initScrubbableLabels() {
    const labels = this.containerEl.querySelectorAll('.scrub-label');
    labels.forEach(label => {
      const field = label.closest('.scrub-field');
      const input = field?.querySelector('.scrub-input');
      if (!input) return;

      label.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startVal = parseFloat(input.value) || 0;

        const onMouseMove = (moveEvent) => {
          const delta = moveEvent.clientX - startX;
          const step = moveEvent.shiftKey ? 10 : 1;
          const newVal = Math.round(startVal + delta * step);
          input.value = newVal;
          input.dispatchEvent(new Event('change'));
        };

        const onMouseUp = () => {
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      });
    });
  }

  // --- Artboard Properties ---
  renderArtboardProperties(ab) {
    this.containerEl.innerHTML = `
      <div class="panel-section">
        <div class="panel-section-header">Artboard Settings</div>
        <div class="prop-row">
          <span class="prop-label">Name</span>
          <input type="text" class="prop-control" id="prop-ab-name" value="${escapeHTML(ab.name)}">
        </div>
      </div>

      <div class="panel-section">
        <div class="panel-section-header">Dimensions</div>
        <div class="prop-grid-2">
          <div class="scrub-field">
            <span class="scrub-label" data-scrub="ab-w">W</span>
            <input type="number" class="scrub-input" id="prop-ab-w" value="${ab.width}">
          </div>
          <div class="scrub-field">
            <span class="scrub-label" data-scrub="ab-h">H</span>
            <input type="number" class="scrub-input" id="prop-ab-h" value="${ab.height}">
          </div>
        </div>
        <div class="prop-grid-2">
          <div class="scrub-field">
            <span class="scrub-label" data-scrub="ab-x">X</span>
            <input type="number" class="scrub-input" id="prop-ab-x" value="${ab.x}">
          </div>
          <div class="scrub-field">
            <span class="scrub-label" data-scrub="ab-y">Y</span>
            <input type="number" class="scrub-input" id="prop-ab-y" value="${ab.y}">
          </div>
        </div>
      </div>

      <div class="panel-section">
        <div class="panel-section-header">Background</div>
        <div class="prop-row">
          <span class="prop-label">Fill</span>
          <div class="color-picker-wrapper">
            <input type="color" class="color-swatch-input" id="prop-ab-bg" value="${ab.background || '#ffffff'}">
            <input type="text" class="color-hex-text" id="prop-ab-bg-hex" value="${(ab.background || '#ffffff').toUpperCase()}">
          </div>
        </div>
      </div>
    `;

    // Bind Artboard inputs
    const nameIn = document.getElementById('prop-ab-name');
    nameIn.addEventListener('change', (e) => state.updateArtboard(ab.id, { name: e.target.value }));

    const wIn = document.getElementById('prop-ab-w');
    wIn.addEventListener('change', (e) => state.updateArtboard(ab.id, { width: parseInt(e.target.value) || 100 }));

    const hIn = document.getElementById('prop-ab-h');
    hIn.addEventListener('change', (e) => state.updateArtboard(ab.id, { height: parseInt(e.target.value) || 100 }));

    const xIn = document.getElementById('prop-ab-x');
    xIn.addEventListener('change', (e) => state.updateArtboard(ab.id, { x: parseInt(e.target.value) || 0 }));

    const yIn = document.getElementById('prop-ab-y');
    yIn.addEventListener('change', (e) => state.updateArtboard(ab.id, { y: parseInt(e.target.value) || 0 }));

    const bgIn = document.getElementById('prop-ab-bg');
    bgIn.addEventListener('input', (e) => {
      document.getElementById('prop-ab-bg-hex').value = e.target.value.toUpperCase();
      state.updateArtboard(ab.id, { background: e.target.value });
    });
  }

  // --- Single Object Properties ---
  renderSingleObjectProperties(obj) {
    const s = obj.styles || {};
    const p = obj.props || {};
    const c = obj.constraints || { horizontal: 'left', vertical: 'top' };
    const proto = obj.prototype || { targetArtboardId: null, trigger: 'click', animation: 'instant' };

    const page = state.getActivePage();
    const artboardOptions = (page.artboards || [])
      .filter(a => a.id !== obj.artboardId)
      .map(a => `<option value="${a.id}" ${proto.targetArtboardId === a.id ? 'selected' : ''}>${escapeHTML(a.name)}</option>`)
      .join('');

    this.containerEl.innerHTML = `
      <!-- 1. Alignment Toolbar -->
      <div class="panel-section" style="padding: 6px 12px;">
        <div class="alignment-grid">
          <button class="alignment-btn" id="btn-align-left" title="Align Left">
            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="3"/><rect width="12" height="6" x="8" y="5" rx="1"/><rect width="8" height="6" x="8" y="13" rx="1"/></svg>
          </button>
          <button class="alignment-btn" id="btn-align-center-x" title="Align Horizontal Center">
            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="21" x2="12" y2="3"/><rect width="14" height="6" x="5" y="5" rx="1"/><rect width="8" height="6" x="8" y="13" rx="1"/></svg>
          </button>
          <button class="alignment-btn" id="btn-align-right" title="Align Right">
            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="20" y1="21" x2="20" y2="3"/><rect width="12" height="6" x="4" y="5" rx="1"/><rect width="8" height="6" x="8" y="13" rx="1"/></svg>
          </button>
          <button class="alignment-btn" id="btn-align-top" title="Align Top">
            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="4" x2="3" y2="4"/><rect width="6" height="12" x="5" y="8" rx="1"/><rect width="6" height="8" x="13" y="8" rx="1"/></svg>
          </button>
          <button class="alignment-btn" id="btn-align-center-y" title="Align Vertical Center">
            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="12" x2="3" y2="12"/><rect width="6" height="14" x="5" y="5" rx="1"/><rect width="6" height="8" x="13" y="8" rx="1"/></svg>
          </button>
          <button class="alignment-btn" id="btn-align-bottom" title="Align Bottom">
            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="20" x2="3" y2="20"/><rect width="6" height="12" x="5" y="4" rx="1"/><rect width="6" height="8" x="13" y="8" rx="1"/></svg>
          </button>
        </div>
      </div>

      <!-- 2. Transform / Geometry -->
      <div class="panel-section">
        <div class="panel-section-header">Transform</div>
        <div class="prop-grid-2">
          <div class="scrub-field">
            <span class="scrub-label" data-scrub="x">X</span>
            <input type="number" class="scrub-input" id="prop-x" value="${obj.x}">
          </div>
          <div class="scrub-field">
            <span class="scrub-label" data-scrub="y">Y</span>
            <input type="number" class="scrub-input" id="prop-y" value="${obj.y}">
          </div>
        </div>
        <div class="prop-grid-2">
          <div class="scrub-field">
            <span class="scrub-label" data-scrub="w">W</span>
            <input type="number" class="scrub-input" id="prop-w" value="${obj.width}">
          </div>
          <div class="scrub-field">
            <span class="scrub-label" data-scrub="h">H</span>
            <input type="number" class="scrub-input" id="prop-h" value="${obj.height}">
          </div>
        </div>
        <div class="prop-grid-2">
          <div class="scrub-field">
            <span class="scrub-label" data-scrub="rot">∠</span>
            <input type="number" class="scrub-input" id="prop-rot" value="${obj.rotation || 0}">
          </div>
          <div class="scrub-field">
            <span class="scrub-label" data-scrub="rad">R</span>
            <input type="number" class="scrub-input" id="prop-rad" value="${s.borderRadius || 0}">
          </div>
        </div>
      </div>

      <!-- 3. Constraints (Responsive Layout) -->
      <div class="panel-section">
        <div class="panel-section-header">Responsive Constraints</div>
        <div class="prop-row">
          <span class="prop-label">Horizontal</span>
          <select class="prop-select" id="prop-constraint-h">
            <option value="left" ${c.horizontal === 'left' ? 'selected' : ''}>Left</option>
            <option value="right" ${c.horizontal === 'right' ? 'selected' : ''}>Right</option>
            <option value="center" ${c.horizontal === 'center' ? 'selected' : ''}>Center</option>
            <option value="scale" ${c.horizontal === 'scale' ? 'selected' : ''}>Scale</option>
          </select>
        </div>
        <div class="prop-row">
          <span class="prop-label">Vertical</span>
          <select class="prop-select" id="prop-constraint-v">
            <option value="top" ${c.vertical === 'top' ? 'selected' : ''}>Top</option>
            <option value="bottom" ${c.vertical === 'bottom' ? 'selected' : ''}>Bottom</option>
            <option value="center" ${c.vertical === 'center' ? 'selected' : ''}>Center</option>
            <option value="scale" ${c.vertical === 'scale' ? 'selected' : ''}>Scale</option>
          </select>
        </div>
      </div>

      <!-- 4. Typography (if applicable) -->
      ${this.renderTypographySection(obj)}

      <!-- 5. Component Props -->
      ${this.renderComponentSpecificSection(obj)}

      <!-- 6. Appearance & Styles -->
      <div class="panel-section">
        <div class="panel-section-header">Appearance</div>
        <div class="prop-row">
          <span class="prop-label">Fill</span>
          <div class="color-picker-wrapper">
            <input type="color" class="color-swatch-input" id="prop-fill" value="${s.fill && s.fill.startsWith('#') ? s.fill : '#ffffff'}">
            <input type="text" class="color-hex-text" id="prop-fill-hex" value="${s.fill || '#ffffff'}">
          </div>
        </div>
        <div class="prop-row">
          <span class="prop-label">Stroke</span>
          <div class="color-picker-wrapper">
            <input type="color" class="color-swatch-input" id="prop-stroke" value="${s.stroke && s.stroke.startsWith('#') ? s.stroke : '#1f2937'}">
            <input type="text" class="color-hex-text" id="prop-stroke-hex" value="${s.stroke || '#1f2937'}">
          </div>
        </div>
        <div class="prop-row">
          <span class="prop-label">Border W</span>
          <input type="number" class="prop-control" id="prop-stroke-width" min="0" max="20" value="${s.strokeWidth !== undefined ? s.strokeWidth : 1}">
        </div>
        <div class="prop-row">
          <span class="prop-label">Opacity</span>
          <input type="range" class="prop-control" id="prop-opacity" min="0.05" max="1" step="0.05" value="${s.opacity !== undefined ? s.opacity : 1}">
        </div>
      </div>

      <!-- 7. Prototype Interaction Link -->
      <div class="panel-section">
        <div class="panel-section-header">Prototype Interaction</div>
        <div class="prop-row">
          <span class="prop-label">Target</span>
          <select class="prop-select" id="prop-proto-target">
            <option value="">None (No interaction)</option>
            ${artboardOptions}
          </select>
        </div>
        <div class="prop-row">
          <span class="prop-label">Trigger</span>
          <select class="prop-select" id="prop-proto-trigger">
            <option value="click" ${proto.trigger === 'click' ? 'selected' : ''}>On Click</option>
            <option value="hover" ${proto.trigger === 'hover' ? 'selected' : ''}>On Hover</option>
          </select>
        </div>
        <div class="prop-row">
          <span class="prop-label">Animation</span>
          <select class="prop-select" id="prop-proto-anim">
            <option value="instant" ${proto.animation === 'instant' ? 'selected' : ''}>Instant</option>
            <option value="fade" ${proto.animation === 'fade' ? 'selected' : ''}>Dissolve / Fade</option>
            <option value="slide-left" ${proto.animation === 'slide-left' ? 'selected' : ''}>Slide Left</option>
            <option value="slide-right" ${proto.animation === 'slide-right' ? 'selected' : ''}>Slide Right</option>
          </select>
        </div>
      </div>
    `;

    this.bindSingleObjectEvents(obj);
  }

  renderTypographySection(obj) {
    const s = obj.styles || {};
    const p = obj.props || {};

    const textTypes = ['text', 'paragraph', 'button', 'input', 'chip', 'badge', 'card', 'navbar'];
    if (!textTypes.includes(obj.type)) return '';

    return `
      <div class="panel-section">
        <div class="panel-section-header">Typography</div>
        <div class="prop-row">
          <span class="prop-label">Size</span>
          <input type="number" class="prop-control" id="prop-font-size" min="8" max="96" value="${s.fontSize || 14}">
        </div>
        <div class="prop-row">
          <span class="prop-label">Weight</span>
          <select class="prop-select" id="prop-font-weight">
            <option value="400" ${s.fontWeight === '400' ? 'selected' : ''}>400 Regular</option>
            <option value="500" ${s.fontWeight === '500' ? 'selected' : ''}>500 Medium</option>
            <option value="600" ${s.fontWeight === '600' ? 'selected' : ''}>600 SemiBold</option>
            <option value="700" ${s.fontWeight === '700' ? 'selected' : ''}>700 Bold</option>
          </select>
        </div>
        <div class="prop-row">
          <span class="prop-label">Text Color</span>
          <div class="color-picker-wrapper">
            <input type="color" class="color-swatch-input" id="prop-text-color" value="${s.textColor && s.textColor.startsWith('#') ? s.textColor : '#1f2937'}">
            <input type="text" class="color-hex-text" id="prop-text-color-hex" value="${s.textColor || '#1f2937'}">
          </div>
        </div>
      </div>
    `;
  }

  renderComponentSpecificSection(obj) {
    const p = obj.props || {};
    const type = obj.type;

    let content = '';

    if (type === 'text' || type === 'paragraph') {
      content = `
        <div class="prop-row">
          <span class="prop-label">Content</span>
          <textarea class="prop-control" id="prop-spec-text" rows="3">${escapeHTML(p.text || '')}</textarea>
        </div>
      `;
    } else if (type === 'button') {
      content = `
        <div class="prop-row">
          <span class="prop-label">Label</span>
          <input type="text" class="prop-control" id="prop-spec-label" value="${escapeHTML(p.label || '')}">
        </div>
        <div class="prop-row">
          <span class="prop-label">Variant</span>
          <select class="prop-select" id="prop-spec-variant">
            <option value="primary" ${p.variant === 'primary' ? 'selected' : ''}>Primary</option>
            <option value="secondary" ${p.variant === 'secondary' ? 'selected' : ''}>Secondary</option>
            <option value="outline" ${p.variant === 'outline' ? 'selected' : ''}>Outline</option>
            <option value="danger" ${p.variant === 'danger' ? 'selected' : ''}>Danger</option>
            <option value="ghost" ${p.variant === 'ghost' ? 'selected' : ''}>Ghost</option>
          </select>
        </div>
      `;
    } else if (type === 'input' || type === 'textarea') {
      content = `
        <div class="prop-row">
          <span class="prop-label">Placeholder</span>
          <input type="text" class="prop-control" id="prop-spec-placeholder" value="${escapeHTML(p.placeholder || '')}">
        </div>
        <div class="prop-row">
          <span class="prop-label">Value</span>
          <input type="text" class="prop-control" id="prop-spec-val" value="${escapeHTML(p.value || '')}">
        </div>
      `;
    } else if (type === 'checkbox' || type === 'radio' || type === 'toggle') {
      content = `
        <div class="prop-row">
          <span class="prop-label">Label</span>
          <input type="text" class="prop-control" id="prop-spec-label" value="${escapeHTML(p.label || '')}">
        </div>
        <div class="prop-row">
          <span class="prop-label">Checked</span>
          <input type="checkbox" id="prop-spec-checked" ${p.checked ? 'checked' : ''}>
        </div>
      `;
    } else if (type === 'card') {
      content = `
        <div class="prop-row">
          <span class="prop-label">Title</span>
          <input type="text" class="prop-control" id="prop-spec-title" value="${escapeHTML(p.title || '')}">
        </div>
        <div class="prop-row">
          <span class="prop-label">Body</span>
          <textarea class="prop-control" id="prop-spec-body" rows="2">${escapeHTML(p.body || '')}</textarea>
        </div>
        <div class="prop-row">
          <span class="prop-label">Show Image</span>
          <input type="checkbox" id="prop-spec-has-img" ${p.hasImage ? 'checked' : ''}>
        </div>
      `;
    } else if (type === 'navbar') {
      content = `
        <div class="prop-row">
          <span class="prop-label">Brand</span>
          <input type="text" class="prop-control" id="prop-spec-brand" value="${escapeHTML(p.brand || '')}">
        </div>
        <div class="prop-row">
          <span class="prop-label">Links</span>
          <input type="text" class="prop-control" id="prop-spec-links" value="${(p.links || []).join(', ')}">
        </div>
      `;
    }

    if (!content) return '';

    return `
      <div class="panel-section">
        <div class="panel-section-header">Component Properties</div>
        ${content}
      </div>
    `;
  }

  bindSingleObjectEvents(obj) {
    // Transform events
    const xIn = document.getElementById('prop-x');
    xIn.addEventListener('change', (e) => state.updateObject(obj.id, { x: parseInt(e.target.value) || 0 }));

    const yIn = document.getElementById('prop-y');
    yIn.addEventListener('change', (e) => state.updateObject(obj.id, { y: parseInt(e.target.value) || 0 }));

    const wIn = document.getElementById('prop-w');
    wIn.addEventListener('change', (e) => state.updateObject(obj.id, { width: parseInt(e.target.value) || 10 }));

    const hIn = document.getElementById('prop-h');
    hIn.addEventListener('change', (e) => state.updateObject(obj.id, { height: parseInt(e.target.value) || 10 }));

    const rotIn = document.getElementById('prop-rot');
    rotIn.addEventListener('change', (e) => state.updateObject(obj.id, { rotation: parseInt(e.target.value) || 0 }));

    const radIn = document.getElementById('prop-rad');
    radIn.addEventListener('change', (e) => state.updateObject(obj.id, { styles: { borderRadius: parseInt(e.target.value) || 0 } }));

    // Alignment Buttons
    document.getElementById('btn-align-left').addEventListener('click', () => this.alignSingle(obj, 'left'));
    document.getElementById('btn-align-center-x').addEventListener('click', () => this.alignSingle(obj, 'centerX'));
    document.getElementById('btn-align-right').addEventListener('click', () => this.alignSingle(obj, 'right'));
    document.getElementById('btn-align-top').addEventListener('click', () => this.alignSingle(obj, 'top'));
    document.getElementById('btn-align-center-y').addEventListener('click', () => this.alignSingle(obj, 'centerY'));
    document.getElementById('btn-align-bottom').addEventListener('click', () => this.alignSingle(obj, 'bottom'));

    // Constraints
    document.getElementById('prop-constraint-h').addEventListener('change', (e) => {
      state.updateObject(obj.id, { constraints: { horizontal: e.target.value } });
    });
    document.getElementById('prop-constraint-v').addEventListener('change', (e) => {
      state.updateObject(obj.id, { constraints: { vertical: e.target.value } });
    });

    // Appearance
    const fillIn = document.getElementById('prop-fill');
    fillIn.addEventListener('input', (e) => {
      document.getElementById('prop-fill-hex').value = e.target.value;
      state.updateObject(obj.id, { styles: { fill: e.target.value } });
    });

    const strokeIn = document.getElementById('prop-stroke');
    strokeIn.addEventListener('input', (e) => {
      document.getElementById('prop-stroke-hex').value = e.target.value;
      state.updateObject(obj.id, { styles: { stroke: e.target.value } });
    });

    const strokeWIn = document.getElementById('prop-stroke-width');
    strokeWIn.addEventListener('change', (e) => {
      state.updateObject(obj.id, { styles: { strokeWidth: parseInt(e.target.value) || 0 } });
    });

    const opacityIn = document.getElementById('prop-opacity');
    opacityIn.addEventListener('input', (e) => {
      state.updateObject(obj.id, { styles: { opacity: parseFloat(e.target.value) } });
    });

    // Typography
    const fontSizeIn = document.getElementById('prop-font-size');
    if (fontSizeIn) {
      fontSizeIn.addEventListener('change', (e) => state.updateObject(obj.id, { styles: { fontSize: parseInt(e.target.value) || 14 } }));
    }

    const fontWeightIn = document.getElementById('prop-font-weight');
    if (fontWeightIn) {
      fontWeightIn.addEventListener('change', (e) => state.updateObject(obj.id, { styles: { fontWeight: e.target.value } }));
    }

    const textColorIn = document.getElementById('prop-text-color');
    if (textColorIn) {
      textColorIn.addEventListener('input', (e) => {
        document.getElementById('prop-text-color-hex').value = e.target.value;
        state.updateObject(obj.id, { styles: { textColor: e.target.value } });
      });
    }

    // Component Specific inputs
    const specText = document.getElementById('prop-spec-text');
    if (specText) specText.addEventListener('input', (e) => state.updateObject(obj.id, { props: { text: e.target.value } }));

    const specLabel = document.getElementById('prop-spec-label');
    if (specLabel) specLabel.addEventListener('input', (e) => state.updateObject(obj.id, { props: { label: e.target.value } }));

    const specVariant = document.getElementById('prop-spec-variant');
    if (specVariant) specVariant.addEventListener('change', (e) => state.updateObject(obj.id, { props: { variant: e.target.value } }));

    const specPlaceholder = document.getElementById('prop-spec-placeholder');
    if (specPlaceholder) specPlaceholder.addEventListener('input', (e) => state.updateObject(obj.id, { props: { placeholder: e.target.value } }));

    const specVal = document.getElementById('prop-spec-val');
    if (specVal) specVal.addEventListener('input', (e) => state.updateObject(obj.id, { props: { value: e.target.value } }));

    const specChecked = document.getElementById('prop-spec-checked');
    if (specChecked) specChecked.addEventListener('change', (e) => state.updateObject(obj.id, { props: { checked: e.target.checked } }));

    const specTitle = document.getElementById('prop-spec-title');
    if (specTitle) specTitle.addEventListener('input', (e) => state.updateObject(obj.id, { props: { title: e.target.value } }));

    const specBody = document.getElementById('prop-spec-body');
    if (specBody) specBody.addEventListener('input', (e) => state.updateObject(obj.id, { props: { body: e.target.value } }));

    const specHasImg = document.getElementById('prop-spec-has-img');
    if (specHasImg) specHasImg.addEventListener('change', (e) => state.updateObject(obj.id, { props: { hasImage: e.target.checked } }));

    const specBrand = document.getElementById('prop-spec-brand');
    if (specBrand) specBrand.addEventListener('input', (e) => state.updateObject(obj.id, { props: { brand: e.target.value } }));

    const specLinks = document.getElementById('prop-spec-links');
    if (specLinks) specLinks.addEventListener('change', (e) => {
      const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
      state.updateObject(obj.id, { props: { links: arr } });
    });

    // Prototype
    document.getElementById('prop-proto-target').addEventListener('change', (e) => {
      state.updateObject(obj.id, { prototype: { targetArtboardId: e.target.value || null } });
    });
    document.getElementById('prop-proto-trigger').addEventListener('change', (e) => {
      state.updateObject(obj.id, { prototype: { trigger: e.target.value } });
    });
    document.getElementById('prop-proto-anim').addEventListener('change', (e) => {
      state.updateObject(obj.id, { prototype: { animation: e.target.value } });
    });
  }

  // --- Multi-Selection Properties ---
  renderMultiObjectProperties(objs) {
    this.containerEl.innerHTML = `
      <div class="panel-section" style="padding: 6px 12px;">
        <div class="alignment-grid">
          <button class="alignment-btn" id="btn-multi-align-left" title="Align Left">
            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="3"/><rect width="12" height="6" x="8" y="5" rx="1"/><rect width="8" height="6" x="8" y="13" rx="1"/></svg>
          </button>
          <button class="alignment-btn" id="btn-multi-align-center-x" title="Align Horizontal Center">
            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="21" x2="12" y2="3"/><rect width="14" height="6" x="5" y="5" rx="1"/><rect width="8" height="6" x="8" y="13" rx="1"/></svg>
          </button>
          <button class="alignment-btn" id="btn-multi-align-right" title="Align Right">
            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="20" y1="21" x2="20" y2="3"/><rect width="12" height="6" x="4" y="5" rx="1"/><rect width="8" height="6" x="8" y="13" rx="1"/></svg>
          </button>
          <button class="alignment-btn" id="btn-multi-align-top" title="Align Top">
            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="4" x2="3" y2="4"/><rect width="6" height="12" x="5" y="8" rx="1"/><rect width="6" height="8" x="13" y="8" rx="1"/></svg>
          </button>
          <button class="alignment-btn" id="btn-multi-align-center-y" title="Align Vertical Center">
            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="12" x2="3" y2="12"/><rect width="6" height="14" x="5" y="5" rx="1"/><rect width="6" height="8" x="13" y="8" rx="1"/></svg>
          </button>
          <button class="alignment-btn" id="btn-multi-align-bottom" title="Align Bottom">
            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="20" x2="3" y2="20"/><rect width="6" height="12" x="5" y="4" rx="1"/><rect width="6" height="8" x="13" y="8" rx="1"/></svg>
          </button>
        </div>
      </div>

      <div class="panel-section">
        <div class="panel-section-header">${objs.length} Objects Selected</div>
        <div class="prop-row">
          <button class="btn-primary" id="btn-group-selection" style="width: 100%;">Group Selection (Ctrl+G)</button>
        </div>
        <div class="prop-row">
          <button id="btn-distribute-h" style="flex: 1;">Distribute Horizontally</button>
          <button id="btn-distribute-v" style="flex: 1;">Distribute Vertically</button>
        </div>
      </div>
    `;

    document.getElementById('btn-multi-align-left').addEventListener('click', () => this.alignMultiple(objs, 'left'));
    document.getElementById('btn-multi-align-center-x').addEventListener('click', () => this.alignMultiple(objs, 'centerX'));
    document.getElementById('btn-multi-align-right').addEventListener('click', () => this.alignMultiple(objs, 'right'));
    document.getElementById('btn-multi-align-top').addEventListener('click', () => this.alignMultiple(objs, 'top'));
    document.getElementById('btn-multi-align-center-y').addEventListener('click', () => this.alignMultiple(objs, 'centerY'));
    document.getElementById('btn-multi-align-bottom').addEventListener('click', () => this.alignMultiple(objs, 'bottom'));

    document.getElementById('btn-group-selection').addEventListener('click', () => state.groupObjects(objs.map(o => o.id)));
    document.getElementById('btn-distribute-h').addEventListener('click', () => this.distributeMultiple(objs, 'h'));
    document.getElementById('btn-distribute-v').addEventListener('click', () => this.distributeMultiple(objs, 'v'));
  }

  // --- Alignment Algorithms ---
  alignSingle(obj, alignment) {
    const page = state.getActivePage();
    if (!obj.artboardId) return;
    const ab = page.artboards.find(a => a.id === obj.artboardId);
    if (!ab) return;

    let newX = obj.x;
    let newY = obj.y;

    if (alignment === 'left') newX = 0;
    else if (alignment === 'centerX') newX = Math.round((ab.width - obj.width) / 2);
    else if (alignment === 'right') newX = ab.width - obj.width;
    else if (alignment === 'top') newY = 0;
    else if (alignment === 'centerY') newY = Math.round((ab.height - obj.height) / 2);
    else if (alignment === 'bottom') newY = ab.height - obj.height;

    state.updateObject(obj.id, { x: newX, y: newY });
  }

  alignMultiple(objs, alignment) {
    let minX = Math.min(...objs.map(o => o.x));
    let maxX = Math.max(...objs.map(o => o.x + o.width));
    let minY = Math.min(...objs.map(o => o.y));
    let maxY = Math.max(...objs.map(o => o.y + o.height));
    let centerX = Math.round((minX + maxX) / 2);
    let centerY = Math.round((minY + maxY) / 2);

    const updates = {};
    objs.forEach(o => {
      let x = o.x;
      let y = o.y;
      if (alignment === 'left') x = minX;
      else if (alignment === 'centerX') x = Math.round(centerX - o.width / 2);
      else if (alignment === 'right') x = maxX - o.width;
      else if (alignment === 'top') y = minY;
      else if (alignment === 'centerY') y = Math.round(centerY - o.height / 2);
      else if (alignment === 'bottom') y = maxY - o.height;

      updates[o.id] = { x, y };
    });

    state.updateMultipleObjects(updates);
  }

  distributeMultiple(objs, direction) {
    if (objs.length < 3) return;

    const updates = {};
    if (direction === 'h') {
      const sorted = [...objs].sort((a, b) => a.x - b.x);
      const minX = sorted[0].x;
      const last = sorted[sorted.length - 1];
      const maxX = last.x + last.width;
      const totalItemW = sorted.reduce((sum, o) => sum + o.width, 0);
      const gap = (maxX - minX - totalItemW) / (sorted.length - 1);

      let currentX = minX;
      sorted.forEach((o) => {
        updates[o.id] = { x: Math.round(currentX) };
        currentX += o.width + gap;
      });
    } else {
      const sorted = [...objs].sort((a, b) => a.y - b.y);
      const minY = sorted[0].y;
      const last = sorted[sorted.length - 1];
      const maxY = last.y + last.height;
      const totalItemH = sorted.reduce((sum, o) => sum + o.height, 0);
      const gap = (maxY - minY - totalItemH) / (sorted.length - 1);

      let currentY = minY;
      sorted.forEach((o) => {
        updates[o.id] = { y: Math.round(currentY) };
        currentY += o.height + gap;
      });
    }

    state.updateMultipleObjects(updates);
  }
}

function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
