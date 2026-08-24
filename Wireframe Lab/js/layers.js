/* ==========================================================================
   WIREFRAMELAB - LAYERS PANEL TREE & HIERARCHY
   ========================================================================== */

import { state } from './state.js';

export class LayersController {
  constructor(containerEl) {
    this.containerEl = containerEl;

    state.on('project:changed', () => this.render());
    state.on('selection:changed', () => this.updateSelectionHighlight());
  }

  render() {
    if (!this.containerEl) return;
    this.containerEl.innerHTML = '';

    const page = state.getActivePage();
    const artboards = page.artboards || [];
    const objects = page.objects || [];

    if (artboards.length === 0 && objects.length === 0) {
      this.containerEl.innerHTML = `
        <div class="layers-empty-state">
          No layers in this page.<br>
          Insert components from the Assets panel or drag an Artboard.
        </div>
      `;
      return;
    }

    // 1. Render Artboards and their contained objects
    artboards.forEach(ab => {
      const abNode = this.createArtboardLayerItem(ab);
      this.containerEl.appendChild(abNode);

      // Child objects in this artboard
      const childObjs = objects.filter(o => o.artboardId === ab.id && !o.parentId);
      // Reverse so topmost z-index is top in layer list
      childObjs.slice().reverse().forEach(obj => {
        const objNode = this.createObjectLayerItem(obj, 1);
        this.containerEl.appendChild(objNode);
      });
    });

    // 2. Render Unparented Canvas Objects
    const freeObjs = objects.filter(o => !o.artboardId && !o.parentId);
    if (freeObjs.length > 0) {
      const freeHeader = document.createElement('div');
      freeHeader.className = 'panel-section-header';
      freeHeader.style.padding = '8px 12px 2px 12px';
      freeHeader.textContent = 'Free Objects';
      this.containerEl.appendChild(freeHeader);

      freeObjs.slice().reverse().forEach(obj => {
        const objNode = this.createObjectLayerItem(obj, 0);
        this.containerEl.appendChild(objNode);
      });
    }

    this.updateSelectionHighlight();
  }

  createArtboardLayerItem(ab) {
    const item = document.createElement('div');
    item.className = `layer-item layer-artboard ${state.selection.has(ab.id) ? 'selected' : ''}`;
    item.dataset.id = ab.id;
    item.dataset.type = 'artboard';

    item.innerHTML = `
      <span class="layer-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
      </span>
      <span class="layer-name">${escapeHTML(ab.name)}</span>
      <div class="layer-actions">
        <button class="layer-action-btn ${ab.hidden ? 'active' : ''}" data-action="toggle-visibility" title="Toggle Visibility">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
        <button class="layer-action-btn ${ab.locked ? 'active' : ''}" data-action="toggle-lock" title="Toggle Lock">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </button>
      </div>
    `;

    this.bindLayerItemEvents(item, ab, true);
    return item;
  }

  createObjectLayerItem(obj, depth = 0) {
    const item = document.createElement('div');
    item.className = `layer-item ${state.selection.has(obj.id) ? 'selected' : ''}`;
    item.dataset.id = obj.id;
    item.dataset.type = 'object';
    item.draggable = true;

    // Indentation
    let indentHtml = '';
    for (let i = 0; i < depth; i++) {
      indentHtml += '<span class="layer-indent"></span>';
    }

    item.innerHTML = `
      ${indentHtml}
      <span class="layer-icon">${this.getLayerIconSVG(obj.type)}</span>
      <span class="layer-name">${escapeHTML(obj.name || obj.type)}</span>
      <div class="layer-actions">
        <button class="layer-action-btn ${obj.hidden ? 'active' : ''}" data-action="toggle-visibility" title="Toggle Visibility">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
        <button class="layer-action-btn ${obj.locked ? 'active' : ''}" data-action="toggle-lock" title="Toggle Lock">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </button>
      </div>
    `;

    this.bindLayerItemEvents(item, obj, false);
    return item;
  }

  bindLayerItemEvents(el, model, isArtboard) {
    // Click selection
    el.addEventListener('click', (e) => {
      const actionBtn = e.target.closest('.layer-action-btn');
      if (actionBtn) {
        const action = actionBtn.dataset.action;
        if (action === 'toggle-visibility') {
          if (isArtboard) state.updateArtboard(model.id, { hidden: !model.hidden });
          else state.updateObject(model.id, { hidden: !model.hidden });
        } else if (action === 'toggle-lock') {
          if (isArtboard) state.updateArtboard(model.id, { locked: !model.locked });
          else state.updateObject(model.id, { locked: !model.locked });
        }
        return;
      }

      if (e.shiftKey) {
        state.toggleSelection(model.id);
      } else {
        state.setSelection([model.id]);
      }
    });

    // Double click to rename
    el.addEventListener('dblclick', (e) => {
      const nameEl = el.querySelector('.layer-name');
      if (!nameEl) return;

      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'layer-name-input';
      input.value = model.name;

      nameEl.replaceWith(input);
      input.focus();
      input.select();

      const finishRename = () => {
        const newName = input.value.trim() || model.name;
        if (isArtboard) {
          state.updateArtboard(model.id, { name: newName });
        } else {
          state.updateObject(model.id, { name: newName });
        }
      };

      input.addEventListener('blur', finishRename);
      input.addEventListener('keydown', (ke) => {
        if (ke.key === 'Enter') finishRename();
        if (ke.key === 'Escape') this.render();
      });
    });

    // Drag to reorder layers
    el.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/layer-id', model.id);
      e.dataTransfer.effectAllowed = 'move';
    });

    el.addEventListener('dragover', (e) => {
      e.preventDefault();
      el.classList.add('drag-over');
    });

    el.addEventListener('dragleave', () => {
      el.classList.remove('drag-over');
    });

    el.addEventListener('drop', (e) => {
      e.preventDefault();
      el.classList.remove('drag-over');
      const draggedId = e.dataTransfer.getData('text/layer-id');
      if (draggedId && draggedId !== model.id) {
        // Move dragged layer before target layer
        state.reorderObject(draggedId, 'forward');
      }
    });
  }

  updateSelectionHighlight() {
    if (!this.containerEl) return;
    const items = this.containerEl.querySelectorAll('.layer-item');
    items.forEach(it => {
      const id = it.dataset.id;
      if (state.selection.has(id)) {
        it.classList.add('selected');
      } else {
        it.classList.remove('selected');
      }
    });
  }

  getLayerIconSVG(type) {
    switch (type) {
      case 'text':
      case 'paragraph':
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>';
      case 'button':
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="12" x="3" y="6" rx="2"/></svg>';
      case 'input':
      case 'textarea':
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="14" x="3" y="5" rx="2"/><line x1="7" y1="12" x2="11" y2="12"/></svg>';
      case 'image':
      case 'video':
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
      case 'card':
      case 'modal':
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/></svg>';
      case 'navbar':
      case 'sidebar':
      case 'tabs':
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
      case 'table':
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="12" y1="3" x2="12" y2="21"/></svg>';
      default:
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>';
    }
  }
}

function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
