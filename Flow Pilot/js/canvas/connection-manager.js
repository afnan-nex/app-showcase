/**
 * FlowPilot Connection Manager
 * Smooth Bezier SVG curves, port snapping, validation, and animated flow pulses
 */

class ConnectionManager {
  constructor(app, svgEl) {
    this.app = app;
    this.svg = svgEl;
    this.connections = [];

    this.isConnecting = false;
    this.connectingSource = null; // { nodeId, portId, portType, startPos }
    this.tempPathEl = null;

    this.initPortEvents();
  }

  initPortEvents() {
    // Delegated pointerdown on port handles
    this.app.nodesLayer.addEventListener('pointerdown', (e) => {
      const portEl = e.target.closest('.node-port');
      if (!portEl) return;

      e.stopPropagation();
      e.preventDefault();

      const nodeId = portEl.dataset.nodeId;
      const portId = portEl.dataset.portId;
      const portType = portEl.dataset.portType; // 'input' or 'output'

      // We only allow dragging from output ports to input ports
      if (portType !== 'output') {
        this.app.toast('Drag from an output port (right) to an input port (left)', 'Port Connection', 'info');
        return;
      }

      this.isConnecting = true;
      this.app.canvasWrapper.classList.add('connecting');

      const portPos = this.getPortCanvasPosition(nodeId, portId);
      this.connectingSource = {
        nodeId,
        portId,
        portType,
        startPos: portPos
      };

      // Create temporary SVG path
      this.tempPathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      this.tempPathEl.setAttribute('class', 'temp-connection-path');
      this.svg.appendChild(this.tempPathEl);

      const onPointerMove = (moveEvent) => {
        if (!this.isConnecting) return;

        const mouseCanvasPos = this.app.canvasController.screenToCanvas(moveEvent.clientX, moveEvent.clientY);
        const pathData = this.calculateBezierPath(
          this.connectingSource.startPos.x,
          this.connectingSource.startPos.y,
          mouseCanvasPos.x,
          mouseCanvasPos.y
        );
        this.tempPathEl.setAttribute('d', pathData);
      };

      const onPointerUp = (upEvent) => {
        if (this.isConnecting) {
          this.isConnecting = false;
          this.app.canvasWrapper.classList.remove('connecting');

          if (this.tempPathEl) {
            this.tempPathEl.remove();
            this.tempPathEl = null;
          }

          // Check if released over an input port
          const targetPortEl = document.elementFromPoint(upEvent.clientX, upEvent.clientY)?.closest('.node-port');
          if (targetPortEl && targetPortEl.dataset.portType === 'input') {
            const targetNodeId = targetPortEl.dataset.nodeId;
            const targetPortId = targetPortEl.dataset.portId;

            this.app.addConnection(
              this.connectingSource.nodeId,
              this.connectingSource.portId,
              targetNodeId,
              targetPortId
            );
          }

          this.connectingSource = null;
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
   * Compute exact canvas coordinate for a node's port
   */
  getPortCanvasPosition(nodeId, portId) {
    const node = this.app.getNodeById(nodeId);
    if (!node) return { x: 0, y: 0 };

    const nodeWidth = 220;
    const nodeHeight = 120; // baseline

    if (portId === 'input') {
      return {
        x: node.position.x,
        y: node.position.y + 44
      };
    } else if (portId === 'true') {
      return {
        x: node.position.x + nodeWidth,
        y: node.position.y + 36
      };
    } else if (portId === 'false') {
      return {
        x: node.position.x + nodeWidth,
        y: node.position.y + 72
      };
    } else {
      // standard output
      return {
        x: node.position.x + nodeWidth,
        y: node.position.y + 44
      };
    }
  }

  /**
   * Calculate SVG Cubic Bezier Curve
   */
  calculateBezierPath(x1, y1, x2, y2) {
    const dx = Math.abs(x2 - x1) * 0.5;
    const cx1 = x1 + Math.max(dx, 40);
    const cy1 = y1;
    const cx2 = x2 - Math.max(dx, 40);
    const cy2 = y2;

    return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
  }

  /**
   * Render all connections in SVG
   */
  updateConnections() {
    this.svg.innerHTML = '';
    const connections = this.app.workflow.connections || [];

    connections.forEach(conn => {
      const fromNode = this.app.getNodeById(conn.fromNodeId);
      const toNode = this.app.getNodeById(conn.toNodeId);
      if (!fromNode || !toNode) return;

      const p1 = this.getPortCanvasPosition(conn.fromNodeId, conn.fromPortId || 'output');
      const p2 = this.getPortCanvasPosition(conn.toNodeId, conn.toPortId || 'input');
      const d = this.calculateBezierPath(p1.x, p1.y, p2.x, p2.y);

      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('class', 'connection-group');
      group.setAttribute('data-connection-id', conn.id);

      // Hitbox for easy clicking
      const hitbox = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      hitbox.setAttribute('class', 'connection-path-hitbox');
      hitbox.setAttribute('d', d);

      // Visible Bezier line
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('class', 'connection-path');
      path.setAttribute('d', d);

      // Midpoint delete button
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;

      const delBtn = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      delBtn.setAttribute('class', 'connection-delete-btn');
      delBtn.setAttribute('transform', `translate(${midX}, ${midY})`);

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('r', '9');
      circle.setAttribute('fill', '#ef4444');
      circle.setAttribute('stroke', '#ffffff');
      circle.setAttribute('stroke-width', '1.5');

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dy', '3.5');
      text.setAttribute('font-size', '10');
      text.setAttribute('fill', '#ffffff');
      text.setAttribute('font-weight', 'bold');
      text.textContent = '✕';

      delBtn.appendChild(circle);
      delBtn.appendChild(text);

      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.app.deleteConnection(conn.id);
      });

      hitbox.addEventListener('click', (e) => {
        e.stopPropagation();
        this.app.selectConnection(conn.id);
      });

      group.appendChild(hitbox);
      group.appendChild(path);
      group.appendChild(delBtn);
      this.svg.appendChild(group);
    });
  }

  /**
   * Animate connection during execution
   */
  animateActiveConnection(connectionId) {
    const group = this.svg.querySelector(`[data-connection-id="${connectionId}"]`);
    if (group) {
      group.classList.add('running');
      setTimeout(() => {
        group.classList.remove('running');
        group.classList.add('success');
        setTimeout(() => group.classList.remove('success'), 1200);
      }, 600);
    }
  }
}

window.ConnectionManager = ConnectionManager;
