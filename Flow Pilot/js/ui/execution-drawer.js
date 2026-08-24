/**
 * FlowPilot Execution Drawer & Inspector
 * Execution runs history, step timeline, and side-by-side JSON data inspector
 */

class ExecutionDrawer {
  constructor(app, drawerEl) {
    this.app = app;
    this.drawer = drawerEl;
    this.isCollapsed = true;
    this.activeExecution = null;
    this.activeStepIndex = 0;

    this.initStructure();
  }

  initStructure() {
    this.drawer.innerHTML = `
      <div class="drawer-header" id="drawer-header-toggle">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:12px;">📊</span>
          <span style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.04em;">Execution Logs & Runs</span>
          <span class="badge badge-pending" id="drawer-status-badge" style="display:none;">Idle</span>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
          <button class="btn btn-ghost btn-sm" id="btn-clear-runs" title="Clear History">Clear</button>
          <button class="btn btn-ghost btn-sm btn-icon" id="btn-drawer-collapse-toggle">▲</button>
        </div>
      </div>

      <div class="drawer-content">
        <!-- Runs List (Left) -->
        <div class="execution-logs-sidebar">
          <div style="padding:6px 10px; font-size:10px; font-weight:700; color:var(--text-muted); text-transform:uppercase; border-bottom:1px solid var(--border-default); background:var(--bg-panel-header);">
            Recent Runs
          </div>
          <div class="execution-runs-list" id="execution-runs-list">
            <div style="color:var(--text-muted); font-size:11px; padding:16px; text-align:center;">
              No executions yet.<br>Click "Run Workflow" to execute.
            </div>
          </div>
        </div>

        <!-- Run Details & Step Inspector (Right) -->
        <div class="execution-details-view">
          <!-- Step Timeline Chips -->
          <div class="execution-steps-timeline" id="execution-steps-timeline">
            <div style="color:var(--text-muted); font-size:11px;">Select an execution run to inspect step details.</div>
          </div>

          <!-- Input vs Output Inspector -->
          <div class="step-data-inspector">
            <div class="inspector-pane">
              <div class="inspector-pane-header">
                <span>Input Data</span>
                <button class="btn btn-ghost btn-sm" id="btn-copy-input-data">Copy</button>
              </div>
              <div class="inspector-pane-body" id="step-input-body">
                <pre class="json-viewer"><span style="color:var(--text-muted);">(No input data)</span></pre>
              </div>
            </div>

            <div class="inspector-pane">
              <div class="inspector-pane-header">
                <span>Output Result</span>
                <button class="btn btn-ghost btn-sm" id="btn-copy-output-data">Copy</button>
              </div>
              <div class="inspector-pane-body" id="step-output-body">
                <pre class="json-viewer"><span style="color:var(--text-muted);">(No output data)</span></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Drawer header toggle
    this.drawer.querySelector('#drawer-header-toggle').addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      this.toggleCollapse();
    });

    this.drawer.querySelector('#btn-drawer-collapse-toggle').addEventListener('click', () => {
      this.toggleCollapse();
    });

    this.drawer.querySelector('#btn-clear-runs').addEventListener('click', () => {
      this.clearRunsList();
    });

    // Copy buttons
    this.drawer.querySelector('#btn-copy-input-data').addEventListener('click', () => {
      const step = this.getActiveStep();
      if (step) {
        navigator.clipboard.writeText(JSON.stringify(step.inputData, null, 2));
        this.app.toast('Copied input data to clipboard', 'Copied', 'info');
      }
    });

    this.drawer.querySelector('#btn-copy-output-data').addEventListener('click', () => {
      const step = this.getActiveStep();
      if (step) {
        navigator.clipboard.writeText(JSON.stringify(step.outputData, null, 2));
        this.app.toast('Copied output data to clipboard', 'Copied', 'info');
      }
    });
  }

  toggleCollapse(expand = null) {
    if (expand !== null) {
      this.isCollapsed = !expand;
    } else {
      this.isCollapsed = !this.isCollapsed;
    }

    if (this.isCollapsed) {
      this.drawer.classList.add('collapsed');
      this.drawer.querySelector('#btn-drawer-collapse-toggle').textContent = '▲';
    } else {
      this.drawer.classList.remove('collapsed');
      this.drawer.querySelector('#btn-drawer-collapse-toggle').textContent = '▼';
    }
  }

  addExecution(exec) {
    this.activeExecution = exec;
    this.renderRunsList();
    this.renderActiveExecution();
    this.toggleCollapse(true); // expand drawer on run
  }

  updateActiveExecution(exec) {
    this.activeExecution = exec;
    this.renderRunsList();
    this.renderActiveExecution();
  }

  renderRunsList() {
    const listEl = this.drawer.querySelector('#execution-runs-list');
    if (!listEl) return;

    if (!this.activeExecution) {
      listEl.innerHTML = '<div style="color:var(--text-muted); font-size:11px; padding:16px; text-align:center;">No executions.</div>';
      return;
    }

    const exec = this.activeExecution;
    const timeStr = new Date(exec.timestamp).toLocaleTimeString();
    const statusBadgeClass = exec.status === 'success' ? 'badge-success' : (exec.status === 'running' ? 'badge-running' : 'badge-error');

    listEl.innerHTML = `
      <div class="run-item active">
        <div class="run-item-info">
          <div class="run-item-id">${exec.id}</div>
          <div class="run-item-time">${timeStr} • ${exec.durationMs || 0}ms</div>
        </div>
        <span class="badge ${statusBadgeClass}">${exec.status}</span>
      </div>
    `;
  }

  renderActiveExecution() {
    const timelineEl = this.drawer.querySelector('#execution-steps-timeline');
    if (!timelineEl || !this.activeExecution) return;

    const steps = this.activeExecution.steps || [];
    if (steps.length === 0) {
      timelineEl.innerHTML = '<div style="color:var(--text-muted); font-size:11px;">Simulation in progress...</div>';
      return;
    }

    let chipsHtml = '';
    steps.forEach((step, index) => {
      const reg = NODE_REGISTRY[step.nodeType] || {};
      const activeClass = index === this.activeStepIndex ? 'active' : '';
      const statusIcon = step.status === 'success' ? '✓' : (step.status === 'running' ? '⏳' : '✕');

      chipsHtml += `
        <div class="step-chip ${activeClass}" data-step-index="${index}">
          <span>${reg.icon || '⚡'}</span>
          <span>${this.escape(step.nodeTitle || step.nodeType)}</span>
          <span style="font-size:9px; color:${step.status === 'success' ? '#34d399' : '#f87171'};">${statusIcon}</span>
          <span style="font-size:9px; color:var(--text-muted); font-family:var(--font-mono);">${step.durationMs}ms</span>
        </div>
      `;
    });

    timelineEl.innerHTML = chipsHtml;

    timelineEl.querySelectorAll('.step-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        this.activeStepIndex = parseInt(chip.dataset.stepIndex, 10);
        this.renderActiveExecution();
      });
    });

    this.renderActiveStepInspector();
  }

  renderActiveStepInspector() {
    const step = this.getActiveStep();
    const inputBody = this.drawer.querySelector('#step-input-body');
    const outputBody = this.drawer.querySelector('#step-output-body');

    if (!step) {
      if (inputBody) inputBody.innerHTML = '<pre class="json-viewer"><span style="color:var(--text-muted);">(No step data)</span></pre>';
      if (outputBody) outputBody.innerHTML = '<pre class="json-viewer"><span style="color:var(--text-muted);">(No step data)</span></pre>';
      return;
    }

    if (inputBody) {
      inputBody.innerHTML = `<pre class="json-viewer">${this.syntaxHighlight(step.inputData || {})}</pre>`;
    }

    if (outputBody) {
      if (step.error) {
        outputBody.innerHTML = `<div style="color:#f87171; font-family:var(--font-mono); font-size:11px;">Error: ${this.escape(step.error)}</div>`;
      } else {
        outputBody.innerHTML = `<pre class="json-viewer">${this.syntaxHighlight(step.outputData || {})}</pre>`;
      }
    }
  }

  getActiveStep() {
    if (!this.activeExecution || !this.activeExecution.steps) return null;
    return this.activeExecution.steps[this.activeStepIndex] || null;
  }

  clearRunsList() {
    this.activeExecution = null;
    this.activeStepIndex = 0;
    this.renderRunsList();
    this.renderActiveStepInspector();
    const timelineEl = this.drawer.querySelector('#execution-steps-timeline');
    if (timelineEl) timelineEl.innerHTML = '<div style="color:var(--text-muted); font-size:11px;">Cleared history.</div>';
  }

  syntaxHighlight(json) {
    if (typeof json !== 'string') {
      json = JSON.stringify(json, undefined, 2);
    }
    if (!json) return '';
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'json-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key';
        } else {
          cls = 'json-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }

  escape(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}

window.ExecutionDrawer = ExecutionDrawer;
