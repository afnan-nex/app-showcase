/* ==========================================================================
   CANVASFLOW — Tool Manager
   Registers Tools & Routes Pointer / Keyboard Events
   ========================================================================== */

import { appState } from '../state/state.js';
import { eventBus } from '../state/event-bus.js';
import { SelectTool } from './select-tool.js';
import { HandTool } from './hand-tool.js';
import { ShapeTool } from './shape-tool.js';
import { LineTool } from './line-tool.js';
import { FreehandTool } from './freehand-tool.js';
import { TextTool } from './text-tool.js';
import { StickyTool } from './sticky-tool.js';
import { ConnectorTool } from './connector-tool.js';
import { EraserTool } from './eraser-tool.js';

export class ToolManager {
  constructor(app) {
    this.app = app;
    this.tools = new Map();
    this.currentTool = null;
    this.isSpacePressed = false;
    this.previousToolBeforeSpace = null;

    this._registerTools();
    this._setupListeners();
  }

  _registerTools() {
    this.tools.set('select', new SelectTool(this.app));
    this.tools.set('hand', new HandTool(this.app));
    this.tools.set('rectangle', new ShapeTool('rectangle', this.app));
    this.tools.set('rounded-rectangle', new ShapeTool('rounded-rectangle', this.app));
    this.tools.set('ellipse', new ShapeTool('ellipse', this.app));
    this.tools.set('diamond', new ShapeTool('diamond', this.app));
    this.tools.set('line', new LineTool('line', this.app));
    this.tools.set('arrow', new LineTool('arrow', this.app));
    this.tools.set('connector', new ConnectorTool(this.app));
    this.tools.set('pencil', new FreehandTool('pencil', this.app));
    this.tools.set('highlighter', new FreehandTool('highlighter', this.app));
    this.tools.set('text', new TextTool(this.app));
    this.tools.set('sticky', new StickyTool(this.app));
    this.tools.set('eraser', new EraserTool(this.app));

    this.setTool('select');
  }

  _setupListeners() {
    eventBus.on('tool:changed', (toolName) => {
      this.setTool(toolName);
    });

    // Space key for temporary Hand / Pan tool
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !this.isSpacePressed && !this._isEditingText()) {
        this.isSpacePressed = true;
        this.previousToolBeforeSpace = appState.activeTool;
        this.setTool('hand');
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space' && this.isSpacePressed) {
        this.isSpacePressed = false;
        const revertTo = this.previousToolBeforeSpace || 'select';
        this.previousToolBeforeSpace = null;
        this.setTool(revertTo);
      }
    });

    // Revert if window loses focus while holding Space
    window.addEventListener('blur', () => {
      if (this.isSpacePressed) {
        this.isSpacePressed = false;
        const revertTo = this.previousToolBeforeSpace || 'select';
        this.previousToolBeforeSpace = null;
        this.setTool(revertTo);
      }
    });
  }

  setTool(name) {
    const nextTool = this.tools.get(name);
    if (!nextTool) return;

    if (this.currentTool) {
      this.currentTool.deactivate();
    }

    this.currentTool = nextTool;
    this.currentTool.activate();
  }

  onPointerDown(e, worldPt) {
    // Middle click triggers Hand pan
    if (e.button === 1) {
      this.previousToolBeforeSpace = appState.activeTool;
      this.setTool('hand');
      this.currentTool.onPointerDown(e, worldPt);
      return;
    }

    if (this.currentTool) {
      this.currentTool.onPointerDown(e, worldPt);
    }
  }

  onPointerMove(e, worldPt) {
    if (this.currentTool) {
      this.currentTool.onPointerMove(e, worldPt);
    }
  }

  onPointerUp(e, worldPt) {
    if (this.currentTool) {
      this.currentTool.onPointerUp(e, worldPt);
    }

    if (e.button === 1 && this.previousToolBeforeSpace) {
      const revertTo = this.previousToolBeforeSpace || 'select';
      this.previousToolBeforeSpace = null;
      this.setTool(revertTo);
    }
  }

  onDoubleClick(e, worldPt) {
    if (this.currentTool) {
      this.currentTool.onDoubleClick(e, worldPt);
    }
  }

  onKeyDown(e) {
    if (this.currentTool && !this._isEditingText()) {
      this.currentTool.onKeyDown(e);
    }
  }

  onKeyUp(e) {
    if (this.currentTool && !this._isEditingText()) {
      this.currentTool.onKeyUp(e);
    }
  }

  _isEditingText() {
    const active = document.activeElement;
    return active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA');
  }
}
