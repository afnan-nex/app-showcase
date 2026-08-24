/* ==========================================================================
   CANVASFLOW — Contextual Properties Panel
   Dynamically renders controls based on selected objects or canvas state
   ========================================================================== */

import { appState } from '../state/state.js';
import { eventBus } from '../state/event-bus.js';
import { ICONS } from '../utils/icons.js';

export class PropertiesPanel {
  constructor(app) {
    this.app = app;
    this.panel = document.getElementById('properties-panel');
    this.content = document.getElementById('properties-content');
    this.title = document.getElementById('prop-panel-title');
    this.btnCollapse = document.getElementById('btn-toggle-props-collapse');
    this.quickActionBar = document.getElementById('quick-action-bar');

    this._setupListeners();
    this.render();
  }

  _setupListeners() {
    this.btnCollapse.addEventListener('click', () => {
      this.panel.classList.toggle('collapsed');
      const isCollapsed = this.panel.classList.contains('collapsed');
      const minimap = document.getElementById('minimap-container');
      if (minimap) {
        minimap.classList.toggle('shifted', isCollapsed);
      }
      const topToggle = document.getElementById('btn-toggle-props');
      if (topToggle) {
        topToggle.classList.toggle('active', !isCollapsed);
        topToggle.setAttribute('aria-pressed', String(!isCollapsed));
      }
    });

    eventBus.on('selection:changed', () => {
      this.render();
      this.updateQuickActionBar();
    });

    eventBus.on('state:changed', () => {
      this.updateQuickActionBar();
    });

    eventBus.on('viewport:changed', () => {
      this.updateQuickActionBar();
    });

    this._bindQuickActions();
  }

  _bindQuickActions() {
    document.getElementById('qa-duplicate').addEventListener('click', () => appState.duplicateSelected());
    document.getElementById('qa-lock').addEventListener('click', () => appState.lockSelected());
    document.getElementById('qa-group').addEventListener('click', () => appState.groupSelected());
    document.getElementById('qa-bring-front').addEventListener('click', () => appState.bringToFront());
    document.getElementById('qa-delete').addEventListener('click', () => appState.deleteSelected());
  }

  updateQuickActionBar() {
    const selected = appState.getSelectedObjects();
    if (selected.length === 0 || appState.activeTool !== 'select') {
      this.quickActionBar.classList.add('hidden');
      return;
    }

    const bounds = appState.getSelectedBounds();
    if (!bounds) {
      this.quickActionBar.classList.add('hidden');
      return;
    }

    const { panX, panY, zoom } = appState.viewport;
    const screenX = (bounds.x + bounds.width / 2) * zoom + panX;
    const screenY = bounds.y * zoom + panY;

    // Clamp inside container
    const container = this.app.canvasContainer.getBoundingClientRect();
    const clampedX = Math.max(120, Math.min(container.width - 120, screenX));
    const clampedY = Math.max(40, screenY);

    this.quickActionBar.style.left = `${clampedX}px`;
    this.quickActionBar.style.top = `${clampedY}px`;
    this.quickActionBar.classList.remove('hidden');
  }

  render() {
    const selected = appState.getSelectedObjects();

    if (selected.length === 0) {
      this.title.textContent = 'Canvas Settings';
      this.renderCanvasProperties();
    } else if (selected.length === 1) {
      const obj = selected[0];
      this.title.textContent = this._formatTypeName(obj.type);
      this.renderSingleObjectProperties(obj);
    } else {
      this.title.textContent = `${selected.length} Objects Selected`;
      this.renderMultiSelectionProperties(selected);
    }
  }

  _formatTypeName(type) {
    return type.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  }

  /**
   * Render Canvas Level Properties (Grid, Snap, Theme, Defaults)
   */
  renderCanvasProperties() {
    const { gridVisible, gridType, snapEnabled, theme } = appState.settings;

    this.content.innerHTML = `
      <div class="prop-section">
        <span class="prop-section-title">Grid & Snapping</span>
        <div class="prop-row">
          <span class="prop-label">Grid Style</span>
          <select id="prop-grid-type" class="prop-select">
            <option value="dots" ${gridType === 'dots' ? 'selected' : ''}>Dots Pattern</option>
            <option value="lines" ${gridType === 'lines' ? 'selected' : ''}>Grid Lines</option>
            <option value="none" ${gridType === 'none' ? 'selected' : ''}>None (Blank)</option>
          </select>
        </div>
        <div class="prop-row">
          <span class="prop-label">Smart Snapping</span>
          <button id="prop-snap-toggle" class="btn-secondary" style="width:100%">
            ${snapEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>

      <div class="prop-section">
        <span class="prop-section-title">Canvas Theme</span>
        <div class="btn-group-segmented" id="prop-theme-segmented" style="width:100%">
          <button class="btn-segment ${theme === 'dark' ? 'active' : ''}" data-theme="dark">Dark Theme</button>
          <button class="btn-segment ${theme === 'light' ? 'active' : ''}" data-theme="light">Light Theme</button>
        </div>
      </div>

      <div class="prop-section">
        <span class="prop-section-title">Default Colors</span>
        <span class="prop-label">Default Accent</span>
        <div class="color-picker-grid" id="prop-default-colors">
          ${this._renderColorDots(['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6b7280'], appState.settings.defaultStrokeColor, 'custom-default-color')}
        </div>
      </div>
    `;

    // Listeners
    document.getElementById('prop-grid-type').addEventListener('change', (e) => {
      appState.settings.gridType = e.target.value;
      appState.settings.gridVisible = e.target.value !== 'none';
      this.app.renderer.requestRender();
    });

    document.getElementById('prop-snap-toggle').addEventListener('click', () => {
      appState.settings.snapEnabled = !appState.settings.snapEnabled;
      this.render();
    });

    document.getElementById('prop-theme-segmented').addEventListener('click', (e) => {
      const seg = e.target.closest('.btn-segment');
      if (seg && seg.dataset.theme) {
        appState.applyTheme(seg.dataset.theme);
        this.render();
      }
    });

    document.getElementById('prop-default-colors').addEventListener('click', (e) => {
      const dot = e.target.closest('.color-dot');
      if (dot && dot.dataset.color) {
        appState.settings.defaultStrokeColor = dot.dataset.color;
        this.render();
      }
    });

    document.getElementById('custom-default-color')?.addEventListener('input', (e) => {
      appState.settings.defaultStrokeColor = e.target.value;
      this.render();
    });
  }

  /**
   * Render Inspector for Single Object
   */
  renderSingleObjectProperties(obj) {
    const isDark = appState.settings.theme === 'dark';
    const isLocked = obj.locked;

    let html = `
      <div class="prop-section">
        <div class="prop-row">
          <span class="prop-label">Locked State</span>
          <button id="prop-btn-lock" class="btn-secondary" style="flex:1">
            ${isLocked ? 'Locked (Click to Unlock)' : 'Unlocked (Click to Lock)'}
          </button>
        </div>
      </div>
    `;

    // 1. Color Fills (if applicable)
    if (['rectangle', 'rounded-rectangle', 'ellipse', 'diamond', 'sticky'].includes(obj.type)) {
      const isSticky = obj.type === 'sticky';
      const fillPalette = isSticky
        ? ['#fef08a', '#bfdbfe', '#bbf7d0', '#fbcfe8', '#e9d5ff', '#fed7aa', '#334155']
        : ['transparent', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#22242b'];

      html += `
        <div class="prop-section">
          <span class="prop-section-title">Fill Color</span>
          <div class="color-picker-grid" id="prop-fill-colors">
            ${this._renderColorDots(fillPalette, obj.fill || 'transparent', 'custom-fill-color')}
          </div>
        </div>
      `;
    }

    // 2. Stroke / Border Colors
    if (!['text', 'sticky'].includes(obj.type)) {
      const strokePalette = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#f3f4f6', '#6b7280'];
      html += `
        <div class="prop-section">
          <span class="prop-section-title">Stroke Color</span>
          <div class="color-picker-grid" id="prop-stroke-colors">
            ${this._renderColorDots(strokePalette, obj.stroke || '#3b82f6', 'custom-stroke-color')}
          </div>
          
          <div class="prop-row" style="margin-top: 8px;">
            <span class="prop-label">Width</span>
            <div class="btn-group-segmented" id="prop-stroke-width-group">
              <button class="btn-segment ${obj.strokeWidth === 1 ? 'active' : ''}" data-width="1">1px</button>
              <button class="btn-segment ${obj.strokeWidth === 2 ? 'active' : ''}" data-width="2">2px</button>
              <button class="btn-segment ${obj.strokeWidth === 4 ? 'active' : ''}" data-width="4">4px</button>
              <button class="btn-segment ${obj.strokeWidth === 8 ? 'active' : ''}" data-width="8">8px</button>
            </div>
          </div>

          <div class="prop-row" style="margin-top: 6px;">
            <span class="prop-label">Style</span>
            <div class="btn-group-segmented" id="prop-stroke-style-group">
              <button class="btn-segment ${obj.strokeStyle === 'solid' ? 'active' : ''}" data-style="solid">Solid</button>
              <button class="btn-segment ${obj.strokeStyle === 'dashed' ? 'active' : ''}" data-style="dashed">Dashed</button>
              <button class="btn-segment ${obj.strokeStyle === 'dotted' ? 'active' : ''}" data-style="dotted">Dotted</button>
            </div>
          </div>
        </div>
      `;
    }

    // 3. Text Controls (if Text or Sticky)
    if (obj.type === 'text' || obj.type === 'sticky') {
      const textColors = ['#f3f4f6', '#111827', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#713f12'];
      html += `
        <div class="prop-section">
          <span class="prop-section-title">Typography</span>
          <div class="prop-row">
            <span class="prop-label">Font</span>
            <select id="prop-font-family" class="prop-select">
              <option value="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">Sans-Serif</option>
              <option value="ui-monospace, Menlo, Consolas, monospace">Monospace</option>
              <option value="Georgia, Cambria, 'Times New Roman', serif">Serif</option>
            </select>
          </div>

          <div class="prop-row">
            <span class="prop-label">Size</span>
            <div class="btn-group-segmented" id="prop-font-size-group">
              <button class="btn-segment ${obj.fontSize <= 14 ? 'active' : ''}" data-size="14">S</button>
              <button class="btn-segment ${obj.fontSize === 18 ? 'active' : ''}" data-size="18">M</button>
              <button class="btn-segment ${obj.fontSize === 24 ? 'active' : ''}" data-size="24">L</button>
              <button class="btn-segment ${obj.fontSize >= 32 ? 'active' : ''}" data-size="36">XL</button>
            </div>
          </div>

          <div class="prop-row">
            <span class="prop-label">Align</span>
            <div class="btn-group-segmented" id="prop-text-align-group">
              <button class="btn-segment ${obj.textAlign === 'left' ? 'active' : ''}" data-align="left">Left</button>
              <button class="btn-segment ${obj.textAlign === 'center' ? 'active' : ''}" data-align="center">Center</button>
              <button class="btn-segment ${obj.textAlign === 'right' ? 'active' : ''}" data-align="right">Right</button>
            </div>
          </div>

          <div class="color-picker-grid" id="prop-text-colors" style="margin-top: 8px;">
            ${this._renderColorDots(textColors, obj.color || '#f3f4f6', 'custom-text-color')}
          </div>
        </div>
      `;
    }

    // 4. Connector Controls
    if (obj.type === 'connector') {
      html += `
        <div class="prop-section">
          <span class="prop-section-title">Connector Routing</span>
          <div class="btn-group-segmented" id="prop-connector-routing" style="width:100%">
            <button class="btn-segment ${obj.routing === 'curved' ? 'active' : ''}" data-routing="curved">Curved</button>
            <button class="btn-segment ${obj.routing === 'stepped' ? 'active' : ''}" data-routing="stepped">Stepped</button>
            <button class="btn-segment ${obj.routing === 'straight' ? 'active' : ''}" data-routing="straight">Straight</button>
          </div>
        </div>
      `;
    }

    // 5. Opacity Slider & Corner Radius
    html += `
      <div class="prop-section">
        <span class="prop-section-title">Layout & Opacity</span>
        <div class="prop-row">
          <span class="prop-label">Opacity</span>
          <input type="range" id="prop-opacity" min="10" max="100" value="${Math.round((obj.opacity ?? 1) * 100)}" style="flex:1">
          <span id="prop-opacity-val" style="font-size:11px; width:30px; text-align:right;">${Math.round((obj.opacity ?? 1) * 100)}%</span>
        </div>
      </div>

      <div class="prop-section">
        <span class="prop-section-title">Arrange & Actions</span>
        <div class="prop-row">
          <button id="prop-bring-front" class="btn-secondary" style="flex:1">Bring Front</button>
          <button id="prop-send-back" class="btn-secondary" style="flex:1">Send Back</button>
        </div>
        <div class="prop-row" style="margin-top:4px;">
          <button id="prop-duplicate" class="btn-secondary" style="flex:1">Duplicate</button>
          <button id="prop-delete" class="btn-danger" style="flex:1">Delete</button>
        </div>
      </div>
    `;

    this.content.innerHTML = html;
    this._attachSingleObjectListeners(obj);
  }

  _attachSingleObjectListeners(obj) {
    document.getElementById('prop-btn-lock')?.addEventListener('click', () => appState.lockSelected());

    // Fill Colors
    document.getElementById('prop-fill-colors')?.addEventListener('click', (e) => {
      const dot = e.target.closest('.color-dot');
      if (dot && dot.dataset.color) {
        appState.updateObject(obj.id, { fill: dot.dataset.color }, true);
      }
    });

    document.getElementById('custom-fill-color')?.addEventListener('input', (e) => {
      appState.updateObject(obj.id, { fill: e.target.value }, true);
    });

    // Stroke Colors
    document.getElementById('prop-stroke-colors')?.addEventListener('click', (e) => {
      const dot = e.target.closest('.color-dot');
      if (dot && dot.dataset.color) {
        appState.updateObject(obj.id, { stroke: dot.dataset.color }, true);
      }
    });

    document.getElementById('custom-stroke-color')?.addEventListener('input', (e) => {
      appState.updateObject(obj.id, { stroke: e.target.value }, true);
    });

    // Stroke Width
    document.getElementById('prop-stroke-width-group')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-segment');
      if (btn && btn.dataset.width) {
        appState.updateObject(obj.id, { strokeWidth: Number(btn.dataset.width) }, true);
      }
    });

    // Stroke Style
    document.getElementById('prop-stroke-style-group')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-segment');
      if (btn && btn.dataset.style) {
        appState.updateObject(obj.id, { strokeStyle: btn.dataset.style }, true);
      }
    });

    // Font Family & Size
    document.getElementById('prop-font-family')?.addEventListener('change', (e) => {
      appState.updateObject(obj.id, { fontFamily: e.target.value }, true);
    });

    document.getElementById('prop-font-size-group')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-segment');
      if (btn && btn.dataset.size) {
        appState.updateObject(obj.id, { fontSize: Number(btn.dataset.size) }, true);
      }
    });

    document.getElementById('prop-text-align-group')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-segment');
      if (btn && btn.dataset.align) {
        appState.updateObject(obj.id, { textAlign: btn.dataset.align }, true);
      }
    });

    document.getElementById('prop-text-colors')?.addEventListener('click', (e) => {
      const dot = e.target.closest('.color-dot');
      if (dot && dot.dataset.color) {
        appState.updateObject(obj.id, { color: dot.dataset.color }, true);
      }
    });

    document.getElementById('custom-text-color')?.addEventListener('input', (e) => {
      appState.updateObject(obj.id, { color: e.target.value }, true);
    });

    // Connector Routing
    document.getElementById('prop-connector-routing')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-segment');
      if (btn && btn.dataset.routing) {
        appState.updateObject(obj.id, { routing: btn.dataset.routing }, true);
      }
    });

    // Opacity
    const opacityInput = document.getElementById('prop-opacity');
    if (opacityInput) {
      opacityInput.addEventListener('input', (e) => {
        const val = Number(e.target.value) / 100;
        document.getElementById('prop-opacity-val').textContent = `${e.target.value}%`;
        appState.updateObject(obj.id, { opacity: val }, false);
      });
      opacityInput.addEventListener('change', (e) => {
        const val = Number(e.target.value) / 100;
        appState.updateObject(obj.id, { opacity: val }, true);
      });
    }

    // Actions
    document.getElementById('prop-bring-front')?.addEventListener('click', () => appState.bringToFront());
    document.getElementById('prop-send-back')?.addEventListener('click', () => appState.sendToBack());
    document.getElementById('prop-duplicate')?.addEventListener('click', () => appState.duplicateSelected());
    document.getElementById('prop-delete')?.addEventListener('click', () => appState.deleteSelected());
  }

  /**
   * Render Multi-Selection Inspector
   */
  renderMultiSelectionProperties(selected) {
    this.content.innerHTML = `
      <div class="prop-section">
        <span class="prop-section-title">Alignment</span>
        <div class="prop-row">
          <button class="btn-secondary" id="align-left" style="flex:1" title="Align Left">Left</button>
          <button class="btn-secondary" id="align-center" style="flex:1" title="Align Horizontal Center">Center</button>
          <button class="btn-secondary" id="align-right" style="flex:1" title="Align Right">Right</button>
        </div>
        <div class="prop-row" style="margin-top:4px;">
          <button class="btn-secondary" id="align-top" style="flex:1" title="Align Top">Top</button>
          <button class="btn-secondary" id="align-middle" style="flex:1" title="Align Vertical Middle">Middle</button>
          <button class="btn-secondary" id="align-bottom" style="flex:1" title="Align Bottom">Bottom</button>
        </div>
      </div>

      <div class="prop-section">
        <span class="prop-section-title">Distribution</span>
        <div class="prop-row">
          <button class="btn-secondary" id="distribute-h" style="flex:1">Distribute Horizontally</button>
          <button class="btn-secondary" id="distribute-v" style="flex:1">Distribute Vertically</button>
        </div>
      </div>

      <div class="prop-section">
        <span class="prop-section-title">Group & Arrange</span>
        <div class="prop-row">
          <button class="btn-secondary" id="multi-group" style="flex:1">Group</button>
          <button class="btn-secondary" id="multi-ungroup" style="flex:1">Ungroup</button>
        </div>
        <div class="prop-row" style="margin-top:4px;">
          <button class="btn-secondary" id="multi-front" style="flex:1">Bring Front</button>
          <button class="btn-secondary" id="multi-back" style="flex:1">Send Back</button>
        </div>
        <div class="prop-row" style="margin-top:4px;">
          <button class="btn-secondary" id="multi-duplicate" style="flex:1">Duplicate</button>
          <button class="btn-danger" id="multi-delete" style="flex:1">Delete All</button>
        </div>
      </div>
    `;

    document.getElementById('align-left').addEventListener('click', () => appState.alignSelected('left'));
    document.getElementById('align-center').addEventListener('click', () => appState.alignSelected('center'));
    document.getElementById('align-right').addEventListener('click', () => appState.alignSelected('right'));
    document.getElementById('align-top').addEventListener('click', () => appState.alignSelected('top'));
    document.getElementById('align-middle').addEventListener('click', () => appState.alignSelected('middle'));
    document.getElementById('align-bottom').addEventListener('click', () => appState.alignSelected('bottom'));

    document.getElementById('distribute-h').addEventListener('click', () => appState.distributeSelected('horizontal'));
    document.getElementById('distribute-v').addEventListener('click', () => appState.distributeSelected('vertical'));

    document.getElementById('multi-group').addEventListener('click', () => appState.groupSelected());
    document.getElementById('multi-ungroup').addEventListener('click', () => appState.ungroupSelected());
    document.getElementById('multi-front').addEventListener('click', () => appState.bringToFront());
    document.getElementById('multi-back').addEventListener('click', () => appState.sendToBack());
    document.getElementById('multi-duplicate').addEventListener('click', () => appState.duplicateSelected());
    document.getElementById('multi-delete').addEventListener('click', () => appState.deleteSelected());
  }

  _renderColorDots(colors, activeColor, customInputId = '') {
    const dotsHtml = colors.map(c => `
      <div class="color-dot ${c === 'transparent' ? 'transparent-dot' : ''} ${c === activeColor ? 'active' : ''}"
           data-color="${c}"
           style="${c !== 'transparent' ? `background-color: ${c};` : ''}"
           title="${c}">
      </div>
    `).join('');

    if (customInputId) {
      const isCustomHex = activeColor && activeColor.startsWith('#') && !colors.includes(activeColor);
      return dotsHtml + `
        <label class="color-dot custom-picker-label ${isCustomHex ? 'active' : ''}" title="Custom Color Picker" style="overflow:hidden; display:flex; align-items:center; justify-content:center; background: ${isCustomHex ? activeColor : 'var(--bg-surface-hover)'}; border: 1px dashed var(--border-strong);">
          <input type="color" id="${customInputId}" value="${activeColor && activeColor.startsWith('#') ? activeColor : '#3b82f6'}" style="opacity:0; position:absolute; width:100%; height:100%; cursor:pointer;">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        </label>
      `;
    }

    return dotsHtml;
  }
}
