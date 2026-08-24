/**
 * FlowPilot Canvas Minimap
 * Live thumbnail rendering of nodes and connections with draggable viewport frame
 */

class FlowMinimap {
  constructor(app, containerEl, canvasEl, viewportBoxEl) {
    this.app = app;
    this.container = containerEl;
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext('2d');
    this.viewportBox = viewportBoxEl;

    this.width = 180;
    this.height = 120;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.isDraggingViewport = false;
    this.dragStart = { x: 0, y: 0 };

    this.initEvents();
  }

  initEvents() {
    this.viewportBox.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      this.isDraggingViewport = true;
      this.dragStart = { x: e.clientX, y: e.clientY };

      const onPointerMove = (moveEvent) => {
        if (!this.isDraggingViewport) return;

        const deltaX = moveEvent.clientX - this.dragStart.x;
        const deltaY = moveEvent.clientY - this.dragStart.y;
        this.dragStart = { x: moveEvent.clientX, y: moveEvent.clientY };

        // Convert minimap delta to canvas pan
        const bounds = this.getWorkflowBounds();
        const scaleFactorX = bounds.width / this.width;
        const scaleFactorY = bounds.height / this.height;

        this.app.canvasController.x -= deltaX * scaleFactorX * this.app.canvasController.scale;
        this.app.canvasController.y -= deltaY * scaleFactorY * this.app.canvasController.scale;
        this.app.canvasController.applyTransform();
        this.render();
      };

      const onPointerUp = () => {
        this.isDraggingViewport = false;
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    });

    // Clicking anywhere on minimap canvas centers the viewport there
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const bounds = this.getWorkflowBounds();
      const targetCanvasX = bounds.minX + (clickX / this.width) * bounds.width;
      const targetCanvasY = bounds.minY + (clickY / this.height) * bounds.height;

      const wrapperRect = this.app.canvasWrapper.getBoundingClientRect();
      const newX = wrapperRect.width / 2 - targetCanvasX * this.app.canvasController.scale;
      const newY = wrapperRect.height / 2 - targetCanvasY * this.app.canvasController.scale;

      this.app.canvasController.setTransform(newX, newY, this.app.canvasController.scale);
    });
  }

  getWorkflowBounds() {
    const nodes = this.app.workflow.nodes || [];
    if (nodes.length === 0) {
      return { minX: 0, minY: 0, maxX: 1000, maxY: 1000, width: 1000, height: 1000 };
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach(n => {
      minX = Math.min(minX, n.position.x);
      minY = Math.min(minY, n.position.y);
      maxX = Math.max(maxX, n.position.x + 220);
      maxY = Math.max(maxY, n.position.y + 120);
    });

    const padding = 200;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;

    return {
      minX,
      minY,
      maxX,
      maxY,
      width: Math.max(maxX - minX, 400),
      height: Math.max(maxY - minY, 300)
    };
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    const bounds = this.getWorkflowBounds();
    const nodes = this.app.workflow.nodes || [];
    const connections = this.app.workflow.connections || [];

    const mapX = (x) => ((x - bounds.minX) / bounds.width) * this.width;
    const mapY = (y) => ((y - bounds.minY) / bounds.height) * this.height;

    // Draw connection lines
    this.ctx.strokeStyle = '#475569';
    this.ctx.lineWidth = 1;
    connections.forEach(c => {
      const fn = this.app.getNodeById(c.fromNodeId);
      const tn = this.app.getNodeById(c.toNodeId);
      if (fn && tn) {
        this.ctx.beginPath();
        this.ctx.moveTo(mapX(fn.position.x + 220), mapY(fn.position.y + 60));
        this.ctx.lineTo(mapX(tn.position.x), mapY(tn.position.y + 60));
        this.ctx.stroke();
      }
    });

    // Draw Node thumbnails
    nodes.forEach(n => {
      const nx = mapX(n.position.x);
      const ny = mapY(n.position.y);
      const nw = (220 / bounds.width) * this.width;
      const nh = (120 / bounds.height) * this.height;

      this.ctx.fillStyle = this.app.selectedNodeIds.has(n.id) ? '#3b82f6' : '#1e293b';
      this.ctx.fillRect(nx, ny, Math.max(nw, 4), Math.max(nh, 3));

      // Category color stripe
      const reg = NODE_REGISTRY[n.type];
      const color = reg && reg.category === 'trigger' ? '#10b981' : (reg && reg.category === 'http' ? '#f59e0b' : '#3b82f6');
      this.ctx.fillStyle = color;
      this.ctx.fillRect(nx, ny, Math.max(nw, 4), 2);
    });

    // Update Draggable Viewport Box
    const wrapperRect = this.app.canvasWrapper.getBoundingClientRect();
    const ctrl = this.app.canvasController;

    const viewCanvasMinX = -ctrl.x / ctrl.scale;
    const viewCanvasMinY = -ctrl.y / ctrl.scale;
    const viewCanvasMaxX = (-ctrl.x + wrapperRect.width) / ctrl.scale;
    const viewCanvasMaxY = (-ctrl.y + wrapperRect.height) / ctrl.scale;

    const boxLeft = mapX(viewCanvasMinX);
    const boxTop = mapY(viewCanvasMinY);
    const boxWidth = mapX(viewCanvasMaxX) - boxLeft;
    const boxHeight = mapY(viewCanvasMaxY) - boxTop;

    this.viewportBox.style.left = `${Math.max(0, boxLeft)}px`;
    this.viewportBox.style.top = `${Math.max(0, boxTop)}px`;
    this.viewportBox.style.width = `${Math.min(this.width, Math.max(boxWidth, 10))}px`;
    this.viewportBox.style.height = `${Math.min(this.height, Math.max(boxHeight, 10))}px`;
  }
}

window.FlowMinimap = FlowMinimap;
