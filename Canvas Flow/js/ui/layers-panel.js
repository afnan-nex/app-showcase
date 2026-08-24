/* ==========================================================================
   CANVASFLOW — Layers & Outline Panel
   Layer Hierarchy, Z-Order, Visibility, Lock & Selection Sync
   ========================================================================== */

import { appState } from '../state/state.js';
import { eventBus } from '../state/event-bus.js';
import { getIcon, ICONS } from '../utils/icons.js';

export class LayersPanel {
  constructor(app) {
    this.app = app;
    this.panel = document.getElementById('layers-panel');
    this.list = document.getElementById('layers-list');
    this.emptyState = document.getElementById('layers-empty');
    this.btnClose = document.getElementById('btn-close-layers');

    this._setupListeners();
    this.render();
  }

  _setupListeners() {
    this.btnClose.addEventListener('click', () => {
      this.panel.classList.add('hidden');
      document.getElementById('btn-toggle-layers').classList.remove('active');
    });

    eventBus.on('state:changed', () => this.render());
    eventBus.on('selection:changed', () => this.updateSelectionHighlight());
  }

  render() {
    const objects = [...appState.getObjects()].reverse(); // Top layer first

    if (objects.length === 0) {
      this.list.innerHTML = '';
      this.emptyState.classList.remove('hidden');
      return;
    }

    this.emptyState.classList.add('hidden');

    this.list.innerHTML = objects.map(obj => {
      const isSelected = appState.selectedIds.has(obj.id);
      const isLocked = obj.locked;
      const isVisible = obj.visible !== false;

      let label = obj.type;
      if (obj.text) {
        label = `"${obj.text.substring(0, 18)}${obj.text.length > 18 ? '...' : ''}"`;
      } else if (obj.groupId) {
        label = `Group Item (${obj.type})`;
      }

      return `
        <div class="layer-item ${isSelected ? 'selected' : ''}" data-id="${obj.id}">
          <span class="layer-icon">${getIcon(obj.type)}</span>
          <span class="layer-title">${label}</span>
          <div class="layer-actions">
            <button class="layer-btn btn-lock ${isLocked ? 'active' : ''}" title="${isLocked ? 'Unlock' : 'Lock'}">
              ${isLocked ? ICONS.lock : ICONS.unlock}
            </button>
            <button class="layer-btn btn-vis ${!isVisible ? 'active' : ''}" title="${isVisible ? 'Hide' : 'Show'}">
              ${isVisible ? ICONS.eye : ICONS.eyeOff}
            </button>
            <button class="layer-btn btn-del" title="Delete">
              ${ICONS.trash}
            </button>
          </div>
        </div>
      `;
    }).join('');

    this._attachItemEvents();
  }

  updateSelectionHighlight() {
    const items = this.list.querySelectorAll('.layer-item');
    items.forEach(item => {
      const id = item.dataset.id;
      item.classList.toggle('selected', appState.selectedIds.has(id));
    });
  }

  _attachItemEvents() {
    this.list.querySelectorAll('.layer-item').forEach(item => {
      const id = item.dataset.id;
      const obj = appState.getObjectById(id);
      if (!obj) return;

      // Click to select
      item.addEventListener('click', (e) => {
        if (e.target.closest('.layer-btn')) return;
        if (e.shiftKey) {
          appState.toggleSelection(id);
        } else {
          appState.setSelection(id);
        }
      });

      // Lock toggle
      item.querySelector('.btn-lock')?.addEventListener('click', (e) => {
        e.stopPropagation();
        appState.updateObject(id, { locked: !obj.locked }, true);
      });

      // Visibility toggle
      item.querySelector('.btn-vis')?.addEventListener('click', (e) => {
        e.stopPropagation();
        appState.updateObject(id, { visible: obj.visible === false ? true : false }, true);
      });

      // Delete item
      item.querySelector('.btn-del')?.addEventListener('click', (e) => {
        e.stopPropagation();
        appState.removeObject(id, true);
      });
    });
  }
}
