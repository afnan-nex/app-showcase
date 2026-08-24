/* ==========================================================================
   CANVASFLOW — Desktop Context Menu
   Right-Click Actions for Canvas & Selected Objects
   ========================================================================== */

import { appState } from '../state/state.js';
import { isPointInObject, clamp } from '../utils/math.js';
import { ICONS } from '../utils/icons.js';

export class ContextMenu {
  constructor(app) {
    this.app = app;
    this.menu = document.getElementById('context-menu');
    this.isOpen = false;

    this._setupListeners();
  }

  _setupListeners() {
    this.app.canvasContainer.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.open(e);
    });

    window.addEventListener('click', (e) => {
      if (this.isOpen && !e.target.closest('#context-menu')) {
        this.close();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  open(e) {
    const rect = this.app.canvasContainer.getBoundingClientRect();
    const worldPt = this.app.renderer.screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
    const zoom = appState.viewport.zoom;

    // Check if clicked on an object
    const objects = [...appState.getObjects()].reverse();
    let hitObject = null;
    for (const obj of objects) {
      if (obj.visible !== false && isPointInObject(worldPt, obj, 6 / zoom)) {
        hitObject = obj;
        break;
      }
    }

    if (hitObject && !appState.selectedIds.has(hitObject.id)) {
      appState.setSelection(hitObject.id);
    }

    this.renderMenu(hitObject);

    // Position menu safely within viewport
    const menuWidth = 200;
    const menuHeight = 280;
    const posX = clamp(e.clientX, 10, window.innerWidth - menuWidth - 10);
    const posY = clamp(e.clientY, 10, window.innerHeight - menuHeight - 10);

    this.menu.style.left = `${posX}px`;
    this.menu.style.top = `${posY}px`;
    this.menu.classList.remove('hidden');
    this.isOpen = true;
  }

  close() {
    this.menu.classList.add('hidden');
    this.isOpen = false;
  }

  renderMenu(targetObject) {
    const selected = appState.getSelectedObjects();
    const hasSelection = selected.length > 0;
    const hasClipboard = appState.clipboard.length > 0;

    let items = [];

    if (hasSelection) {
      const isLocked = selected.some(o => o.locked);
      const isGrouped = selected.some(o => o.groupId);

      items = [
        { label: 'Cut', shortcut: 'Ctrl+X', action: 'cut' },
        { label: 'Copy', shortcut: 'Ctrl+C', action: 'copy' },
        { label: 'Paste', shortcut: 'Ctrl+V', action: 'paste', disabled: !hasClipboard },
        { label: 'Duplicate', shortcut: 'Ctrl+D', action: 'duplicate' },
        { divider: true },
        { label: isGrouped ? 'Ungroup' : 'Group', shortcut: isGrouped ? 'Ctrl+Shift+G' : 'Ctrl+G', action: isGrouped ? 'ungroup' : 'group' },
        { label: isLocked ? 'Unlock' : 'Lock', shortcut: 'Ctrl+L', action: 'lock' },
        { divider: true },
        { label: 'Bring to Front', shortcut: 'Ctrl+]', action: 'bring-front' },
        { label: 'Send to Back', shortcut: 'Ctrl+[', action: 'send-back' },
        { divider: true },
        { label: 'Delete', shortcut: 'Del', action: 'delete', danger: true }
      ];
    } else {
      items = [
        { label: 'Paste', shortcut: 'Ctrl+V', action: 'paste', disabled: !hasClipboard },
        { label: 'Select All', shortcut: 'Ctrl+A', action: 'select-all' },
        { divider: true },
        { label: 'Zoom to Fit All', shortcut: 'Shift+1', action: 'zoom-fit' },
        { label: 'Reset Zoom (100%)', shortcut: 'Ctrl+0', action: 'zoom-reset' },
        { divider: true },
        { label: 'Add Sticky Note', shortcut: 'S', action: 'add-sticky' },
        { label: 'Add Rectangle', shortcut: 'R', action: 'add-rect' }
      ];
    }

    this.menu.innerHTML = items.map(item => {
      if (item.divider) return `<div class="dropdown-divider"></div>`;
      return `
        <button class="dropdown-item ${item.danger ? 'text-danger' : ''}" data-action="${item.action}" ${item.disabled ? 'disabled style="opacity:0.4"' : ''}>
          <span>${item.label}</span>
          ${item.shortcut ? `<kbd>${item.shortcut}</kbd>` : ''}
        </button>
      `;
    }).join('');

    this.menu.querySelectorAll('.dropdown-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        this._executeAction(action);
        this.close();
      });
    });
  }

  _executeAction(action) {
    const { clientWidth, clientHeight } = this.app.canvasContainer;

    switch (action) {
      case 'cut': appState.cutSelected(); break;
      case 'copy': appState.copySelected(); break;
      case 'paste': appState.paste(); break;
      case 'duplicate': appState.duplicateSelected(); break;
      case 'group': appState.groupSelected(); break;
      case 'ungroup': appState.ungroupSelected(); break;
      case 'lock': appState.lockSelected(); break;
      case 'bring-front': appState.bringToFront(); break;
      case 'send-back': appState.sendToBack(); break;
      case 'delete': appState.deleteSelected(); break;
      case 'select-all': appState.selectAll(); break;
      case 'zoom-fit': appState.zoomToFit(clientWidth, clientHeight); break;
      case 'zoom-reset': appState.setViewport(clientWidth / 2, clientHeight / 2, 1.0); break;
      case 'add-sticky': appState.setActiveTool('sticky'); break;
      case 'add-rect': appState.setActiveTool('rectangle'); break;
    }
  }
}
