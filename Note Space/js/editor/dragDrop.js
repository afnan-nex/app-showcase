/**
 * NoteSpace - Block Drag and Drop Engine
 * Manages dragging blocks, calculating drop insertion index, and rendering animated drop indicators.
 */

import { createElement } from '../utils/dom.js';

export class BlockDragDrop {
  constructor(editorContainer, onReorder) {
    this.container = editorContainer;
    this.onReorder = onReorder;
    this.draggedBlockEl = null;
    this.dropIndicator = null;
    this.dropTarget = null;
    this.dropPosition = 'after'; // 'before' | 'after'

    this.initDropIndicator();
    this.bindEvents();
  }

  initDropIndicator() {
    this.dropIndicator = createElement('div', 'ns-drop-indicator');
    this.dropIndicator.style.display = 'none';
    this.container.appendChild(this.dropIndicator);
  }

  bindEvents() {
    // We attach mousedown to handles and dragover/drop to container
    this.container.addEventListener('mousedown', (e) => {
      const handle = e.target.closest('.ns-drag-handle');
      if (!handle) return;

      const blockEl = handle.closest('.ns-block');
      if (!blockEl) return;

      this.startDrag(blockEl, e);
    });
  }

  startDrag(blockEl, startEvent) {
    this.draggedBlockEl = blockEl;
    blockEl.classList.add('is-dragging');

    const onMouseMove = (e) => {
      this.handleDragMove(e);
    };

    const onMouseUp = (e) => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      this.endDrag(e);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  handleDragMove(e) {
    if (!this.draggedBlockEl) return;

    // Find block element under mouse
    const blocks = Array.from(this.container.querySelectorAll('.ns-block:not(.is-dragging)'));
    let closestBlock = null;
    let closestDist = Infinity;
    let position = 'after';

    blocks.forEach(b => {
      const rect = b.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      const dist = Math.abs(e.clientY - midY);

      if (dist < closestDist) {
        closestDist = dist;
        closestBlock = b;
        position = e.clientY < midY ? 'before' : 'after';
      }
    });

    if (closestBlock) {
      this.dropTarget = closestBlock;
      this.dropPosition = position;

      const rect = closestBlock.getBoundingClientRect();
      const containerRect = this.container.getBoundingClientRect();

      this.dropIndicator.style.display = 'block';
      this.dropIndicator.style.left = '0px';
      this.dropIndicator.style.width = '100%';

      if (position === 'before') {
        this.dropIndicator.style.top = `${rect.top - containerRect.top}px`;
      } else {
        this.dropIndicator.style.top = `${rect.bottom - containerRect.top}px`;
      }
    }
  }

  endDrag(e) {
    if (!this.draggedBlockEl) return;

    this.dropIndicator.style.display = 'none';
    this.draggedBlockEl.classList.remove('is-dragging');

    if (this.dropTarget && this.dropTarget !== this.draggedBlockEl) {
      const fromId = this.draggedBlockEl.dataset.blockId;
      const toId = this.dropTarget.dataset.blockId;
      const position = this.dropPosition;

      this.onReorder(fromId, toId, position);
    }

    this.draggedBlockEl = null;
    this.dropTarget = null;
  }
}
