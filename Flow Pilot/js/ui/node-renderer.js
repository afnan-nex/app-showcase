/**
 * FlowPilot Node DOM Renderer
 */

class NodeRenderer {
  constructor(app, containerEl) {
    this.app = app;
    this.container = containerEl;
    this.renderedNodes = new Map(); // nodeId -> HTMLElement
  }

  renderAll(nodes) {
    this.container.innerHTML = '';
    this.renderedNodes.clear();
    (nodes || []).forEach(node => this.renderNode(node));
  }

  renderNode(node) {
    const reg = NODE_REGISTRY[node.type] || {
      category: 'custom',
      icon: '📦',
      title: node.type,
      inputs: [{ id: 'input', name: 'Input' }],
      outputs: [{ id: 'output', name: 'Output' }],
      getSummary: () => 'Custom node'
    };

    let el = this.renderedNodes.get(node.id);
    if (!el) {
      el = document.createElement('div');
      el.className = `flow-node cat-${reg.category || 'transform'}`;
      el.dataset.nodeId = node.id;
      this.container.appendChild(el);
      this.renderedNodes.set(node.id, el);
    }

    el.style.transform = `translate3d(${node.position.x}px, ${node.position.y}px, 0)`;
    if (this.app.selectedNodeIds.has(node.id)) {
      el.classList.add('selected');
    } else {
      el.classList.remove('selected');
    }

    const summaryText = reg.getSummary ? reg.getSummary(node.configuration || {}) : '';

    // Ports markup
    const inputs = reg.inputs || [];
    const outputs = reg.outputs || [];

    let portsHtml = '<div class="node-ports-container">';
    
    // Input port(s)
    inputs.forEach(p => {
      portsHtml += `<div class="node-port port-input" data-node-id="${node.id}" data-port-id="${p.id}" data-port-type="input" title="Input Port"></div>`;
    });

    // Output port(s)
    outputs.forEach(p => {
      if (p.id === 'true') {
        portsHtml += `
          <div class="node-port port-output port-output-true" data-node-id="${node.id}" data-port-id="true" data-port-type="output" title="True Branch"></div>
          <span class="port-label port-label-true">True</span>
        `;
      } else if (p.id === 'false') {
        portsHtml += `
          <div class="node-port port-output port-output-false" data-node-id="${node.id}" data-port-id="false" data-port-type="output" title="False Branch"></div>
          <span class="port-label port-label-false">False</span>
        `;
      } else {
        portsHtml += `<div class="node-port port-output" data-node-id="${node.id}" data-port-id="${p.id}" data-port-type="output" title="Output Port"></div>`;
      }
    });

    portsHtml += '</div>';

    el.innerHTML = `
      ${portsHtml}
      <div class="node-header">
        <div class="node-header-left">
          <div class="node-icon-badge">${reg.icon || '⚡'}</div>
          <div class="node-title-wrapper">
            <div class="node-title">${this.escapeHtml(node.title || reg.title)}</div>
            <div class="node-type-label">${reg.title}</div>
          </div>
        </div>
        <div class="node-header-actions">
          <button class="node-action-btn btn-test-node" title="Test this step">▶</button>
          <button class="node-action-btn btn-duplicate-node" title="Duplicate">❐</button>
          <button class="node-action-btn btn-delete-node" title="Delete">✕</button>
        </div>
      </div>
      <div class="node-body">
        <div class="node-summary-text">${this.escapeHtml(summaryText)}</div>
        <div class="node-status-bar">
          <span class="node-status-indicator">
            <span class="status-dot"></span>
            <span class="status-text">${node.status || 'Ready'}</span>
          </span>
          <span class="node-exec-duration">${node.lastDuration ? `${node.lastDuration}ms` : ''}</span>
        </div>
      </div>
    `;

    // Wire node action buttons
    el.querySelector('.btn-test-node')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.app.testNode(node.id);
    });

    el.querySelector('.btn-duplicate-node')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.app.duplicateNode(node.id);
    });

    el.querySelector('.btn-delete-node')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.app.deleteNode(node.id);
    });

    return el;
  }

  updateNodeStatus(nodeId, status, duration = null, errorMsg = null) {
    const el = this.renderedNodes.get(nodeId);
    if (!el) return;

    el.classList.remove('running', 'success', 'error', 'skipped');
    if (status !== 'idle' && status !== 'ready') {
      el.classList.add(status);
    }

    const statusTextEl = el.querySelector('.status-text');
    if (statusTextEl) {
      statusTextEl.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    }

    const durationEl = el.querySelector('.node-exec-duration');
    if (durationEl && duration !== null) {
      durationEl.textContent = `${duration}ms`;
    }
  }

  updateNodeSummary(nodeId) {
    const node = this.app.getNodeById(nodeId);
    const el = this.renderedNodes.get(nodeId);
    if (!node || !el) return;

    const reg = NODE_REGISTRY[node.type];
    const summaryText = reg && reg.getSummary ? reg.getSummary(node.configuration || {}) : '';
    const summaryEl = el.querySelector('.node-summary-text');
    if (summaryEl) summaryEl.textContent = summaryText;

    const titleEl = el.querySelector('.node-title');
    if (titleEl) titleEl.textContent = node.title || (reg ? reg.title : node.type);
  }

  removeNode(nodeId) {
    const el = this.renderedNodes.get(nodeId);
    if (el) {
      el.remove();
      this.renderedNodes.delete(nodeId);
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

window.NodeRenderer = NodeRenderer;
