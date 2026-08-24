/* ==========================================================================
   CANVASFLOW — Text Tool
   ========================================================================== */

import { BaseTool } from './base-tool.js';
import { appState } from '../state/state.js';
import { createCanvasObject } from '../state/document-model.js';

export class TextTool extends BaseTool {
  constructor(app) {
    super('text', app);
  }

  activate() {
    super.activate();
    this.app.setCursor('text');
  }

  deactivate() {
    super.deactivate();
  }

  onPointerDown(e, worldPt) {
    const textObj = createCanvasObject('text', {
      x: worldPt.x,
      y: worldPt.y,
      text: '',
      color: appState.settings.theme === 'dark' ? '#f3f4f6' : '#111827',
      fontSize: 18
    });

    appState.addObject(textObj, true);
    appState.setSelection(textObj.id);
    appState.setActiveTool('select');

    // Open inline text editor
    setTimeout(() => {
      this.app.openInlineTextEditor(textObj);
    }, 10);
  }
}
