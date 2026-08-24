/**
 * FlowPilot Drag & Drop, Multi-Selection, and Marquee Handler
 */

class DragDropManager {
  constructor(app, canvasController, marqueeBoxEl) {
    this.app = app;
    this.canvas = canvasController;
    this.marqueeBox = marqueeBoxEl;

    this.isDraggingNodes = false;
    this.dragStartPositions = new Map(); // nodeId -> { x, y }
    this.dragStartMouse = { x: 0, y: 0 };

    this.isMarqueeActive = false;
    this.marqueeStart = { x: 0, y: 0 };

    this.initNodeDrag();
    this.initPaletteDrop();
    this.initMarqueeSelection();
  }

  initNodeDrag() {
    // Delegated pointerdown on nodes
    this.app.nodesLayer.addEventListener('pointerdown', (e) => {
      // Don't drag if clicking port, button, or input
      if (
        e.target.closest('.node-port') ||
        e.target.closest('button') ||
        e.target.closest('input') ||
        e.button !== 0
      ) {
        return;
      }

      const nodeEl = e.target.closest('.flow-node');
      if (!nodeEl) return;

      const nodeId = nodeEl.dataset.nodeId;
      const node = this.app.getNodeById(nodeId);
      if (!node) return;

      e.stopPropagation();

      // Multi-selection behavior: if Shift key held, toggle node in selection
      if (e.shiftKey) {
        this.app.toggleSelectNode(nodeId);
      } else if (!this.app.selectedNodeIds.has(nodeId)) {
        // If clicking a node not in selection, select only this node
        this.app.selectSingleNode(nodeId);
      }

      // Start drag for all currently selected nodes
      this.isDraggingNodes = true;
      this.dragStartMouse = { x: e.clientX, y: e.clientY };
      this.dragStartPositions.clear();

      this.app.selectedNodeIds.forEach(id => {
        const n = this.app.getNodeById(id);
        if (n) {
          this.dragStartPositions.set(id, { x: n.position.x, y: n.position.y });
        }
      });

      const onPointerMove = (moveEvent) => {
        if (!this.isDraggingNodes) return;

        const deltaScreenX = moveEvent.clientX - this.dragStartMouse.x;
        const deltaScreenY = moveEvent.clientY - this.dragStartMouse.y;

        const deltaCanvasX = deltaScreenX / this.canvas.scale;
        const deltaCanvasY = deltaScreenY / this.canvas.scale;

        this.app.selectedNodeIds.forEach(id => {
          const n = this.app.getNodeById(id);
          const startPos = this.dragStartPositions.get(id);
          if (n && startPos) {
            let nextX = startPos.x + deltaCanvasX;
            let nextY = startPos.y + deltaCanvasY;

            if (this.canvas.snapToGrid) {
              nextX = this.canvas.snap(nextX);
              nextY = this.canvas.snap(nextY);
            }

            n.position.x = Math.round(nextX);
            n.position.y = Math.round(nextY);

            // Update DOM element transform directly for 60fps performance
            const el = this.app.nodesLayer.querySelector(`[data-node-id="${id}"]`);
            if (el) {
              el.style.transform = `translate3d(${n.position.x}px, ${n.position.y}px, 0)`;
            }
          }
        });

        // Update SVG connections during drag
        this.app.connectionManager.updateConnections();
        this.app.minimap.render();
      };

      const onPointerUp = () => {
        if (this.isDraggingNodes) {
          this.isDraggingNodes = false;
          this.dragStartPositions.clear();
          this.app.markDirty();
          this.app.saveHistoryState('Move Nodes');
        }
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    });
  }

  /**
   * Drag from Left Sidebar Library onto Canvas
   */
  initPaletteDrop() {
    const canvasWrapper = this.app.canvasWrapper;

    canvasWrapper.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    });

    canvasWrapper.addEventListener('drop', (e) => {
      e.preventDefault();
      const nodeType = e.dataTransfer.getData('application/flowpilot-node-type');
      if (!nodeType || !NODE_REGISTRY[nodeType]) return;

      const pos = this.canvas.screenToCanvas(e.clientX, e.clientY);
      const snappedX = this.canvas.snap(pos.x - 100);
      const snappedY = this.canvas.snap(pos.y - 40);

      this.app.addNode(nodeType, { x: snappedX, y: snappedY });
    });
  }

  /**
   * Marquee Box Multi-Selection
   */
  initMarqueeSelection() {
    const wrapper = this.app.canvasWrapper;

    wrapper.addEventListener('pointerdown', (e) => {
      // Trigger marquee on left click on canvas background (when not panning with space)
      if (e.button !== 0 || this.canvas.isSpacePressed) return;
      if (e.target !== wrapper && e.target !== this.canvas.gridBg && e.target !== this.app.connectionsSvg) return;

      this.isMarqueeActive = true;
      const rect = wrapper.getBoundingClientRect();
      this.marqueeStart = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        screenX: e.clientX,
        screenY: e.clientY
      };

      if (!e.shiftKey) {
        this.app.clearSelection();
      }

      this.marqueeBox.style.display = 'block';
      this.marqueeBox.style.left = `${this.marqueeStart.x}px`;
      this.marqueeBox.style.top = `${this.marqueeStart.y}px`;
      this.marqueeBox.style.width = '0px';
      this.marqueeBox.style.height = '0px';

      const onPointerMove = (moveEvent) => {
        if (!this.isMarqueeActive) return;

        const currX = moveEvent.clientX - rect.left;
        const currY = moveEvent.clientY - rect.top;

        const left = Math.min(this.marqueeStart.x, currX);
        const top = Math.min(this.marqueeStart.y, currY);
        const width = Math.abs(currX - this.marqueeStart.x);
        const height = Math.abs(currY - this.marqueeStart.y);

        this.marqueeBox.style.left = `${left}px`;
        this.marqueeBox.style.top = `${top}px`;
        this.marqueeBox.style.width = `${width}px`;
        this.marqueeBox.style.height = `${height}px`;

        // Check which nodes intersect the marquee in canvas coordinates
        const startCanvas = this.canvas.screenToCanvas(
          Math.min(this.marqueeStart.screenX, moveEvent.clientX),
          Math.min(this.marqueeStart.screenY, moveEvent.clientY)
        );
        const endCanvas = this.canvas.screenToCanvas(
          Math.max(this.marqueeStart.screenX, moveEvent.clientX),
          Math.max(this.marqueeStart.screenY, moveEvent.clientY)
        );

        (this.app.workflow.nodes || []).forEach(node => {
          const nw = 220;
          const nh = 120;
          const intersects = !(
            node.position.x > endCanvas.x ||
            node.position.x + nw < startCanvas.x ||
            node.position.y > endCanvas.y ||
            node.position.y + nh < startCanvas.y
          );

          if (intersects) {
            this.app.selectedNodeIds.add(node.id);
          }
        });

        this.app.updateSelectedNodeStyles();
      };

      const onPointerUp = () => {
        if (this.isMarqueeActive) {
          this.isMarqueeActive = false;
          this.marqueeBox.style.display = 'none';
        }
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    });
  }
}

window.DragDropManager = DragDropManager;
