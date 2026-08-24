/* ==========================================================================
   WIREFRAMELAB - GLOBAL KEYBOARD SHORTCUTS DISPATCHER
   ========================================================================== */

import { state } from './state.js';
import { generateId } from './models.js';

export class ShortcutsManager {
  constructor() {
    this.init();
  }

  init() {
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }

  isInputFocused(target) {
    return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
  }

  handleKeyDown(e) {
    if (this.isInputFocused(e.target)) {
      // Don't intercept when user is typing in form inputs, except Escape/Enter
      if (e.key === 'Escape') {
        e.target.blur();
      }
      return;
    }

    const isCtrlOrCmd = e.ctrlKey || e.metaKey;

    // 1. Tool Switchers
    if (!isCtrlOrCmd && !e.shiftKey) {
      if (e.key.toLowerCase() === 'v') {
        e.preventDefault();
        state.setActiveTool('select');
      } else if (e.key.toLowerCase() === 'h') {
        e.preventDefault();
        state.setActiveTool('hand');
      } else if (e.key.toLowerCase() === 'a') {
        e.preventDefault();
        state.setActiveTool('artboard');
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        state.setActiveTool('box');
      } else if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        state.setActiveTool('text');
      }
    }

    // 2. Undo & Redo
    if (isCtrlOrCmd && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        state.redo();
      } else {
        state.undo();
      }
      return;
    }
    if (isCtrlOrCmd && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      state.redo();
      return;
    }

    // 3. Duplicate
    if (isCtrlOrCmd && e.key.toLowerCase() === 'd') {
      e.preventDefault();
      state.duplicateSelection();
      return;
    }

    // 4. Copy & Paste & Cut
    if (isCtrlOrCmd && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      const selected = state.getSelectedObjects();
      if (selected.length > 0) {
        state.clipboard = JSON.parse(JSON.stringify(selected));
      }
      return;
    }

    if (isCtrlOrCmd && e.key.toLowerCase() === 'x') {
      e.preventDefault();
      const selected = state.getSelectedObjects();
      if (selected.length > 0) {
        state.clipboard = JSON.parse(JSON.stringify(selected));
        state.deleteSelection();
      }
      return;
    }

    if (isCtrlOrCmd && e.key.toLowerCase() === 'v') {
      e.preventDefault();
      if (state.clipboard && state.clipboard.length > 0) {
        state.pushHistory('Paste');
        const page = state.getActivePage();
        const newIds = [];
        state.clipboard.forEach(obj => {
          const clone = JSON.parse(JSON.stringify(obj));
          clone.id = generateId('obj');
          clone.name = `${obj.name} (copy)`;
          clone.x += 20;
          clone.y += 20;
          page.objects.push(clone);
          newIds.push(clone.id);
        });
        state.setSelection(newIds);
        state.emit('project:changed', state.project);
      }
      return;
    }

    // 5. Select All
    if (isCtrlOrCmd && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      const page = state.getActivePage();
      const allIds = page.objects.map(o => o.id);
      state.setSelection(allIds);
      return;
    }

    // 6. Group / Ungroup
    if (isCtrlOrCmd && e.key.toLowerCase() === 'g') {
      e.preventDefault();
      if (e.shiftKey) {
        // Ungroup
        state.getSelectedObjects().forEach(obj => {
          if (obj.type === 'group') state.ungroupObjects(obj.id);
        });
      } else {
        // Group
        state.groupObjects(Array.from(state.selection));
      }
      return;
    }

    // 7. Delete / Backspace
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      state.deleteSelection();
      return;
    }

    // 8. Arrow Keys Nudging
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      if (state.selection.size > 0) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        let dx = 0, dy = 0;
        if (e.key === 'ArrowLeft') dx = -step;
        if (e.key === 'ArrowRight') dx = step;
        if (e.key === 'ArrowUp') dy = -step;
        if (e.key === 'ArrowDown') dy = step;

        const updates = {};
        state.getSelectedObjects().forEach(o => {
          updates[o.id] = { x: o.x + dx, y: o.y + dy };
        });
        state.updateMultipleObjects(updates, true);
      }
      return;
    }

    // 9. Toggle Prototype Mode (Shift+E)
    if (e.shiftKey && e.key.toLowerCase() === 'e') {
      e.preventDefault();
      state.setMode(state.mode === 'design' ? 'prototype' : 'design');
      return;
    }

    // 10. Open Keyboard Shortcuts Cheat Sheet (? or Ctrl+/)
    if (e.key === '?' || (isCtrlOrCmd && e.key === '/')) {
      e.preventDefault();
      document.getElementById('modal-shortcuts')?.classList.add('active');
      return;
    }

    // 11. Escape to Clear Selection / Reset Tool / Close Modals
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
      state.clearSelection();
      state.setActiveTool('select');
    }
  }
}
