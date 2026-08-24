/**
 * FlowPilot Property Panel (Right Sidebar)
 * Dynamic configuration forms for all node types, live testing, schema inspector
 */

class PropertyPanel {
  constructor(app, containerEl) {
    this.app = app;
    this.container = containerEl;
    this.activeTab = 'config'; // 'config', 'test', 'schema', 'vars'
    this.currentNodeId = null;

    this.initStructure();
  }

  initStructure() {
    this.container.innerHTML = `
      <div class="sidebar-header">
        <span class="sidebar-title">
          <span id="prop-panel-icon">⚙️</span>
          <span id="prop-panel-title">Node Configuration</span>
        </span>
        <button class="btn btn-ghost btn-sm btn-icon" id="btn-close-prop-panel" title="Close Panel">✕</button>
      </div>

      <div class="property-tabs">
        <button class="property-tab-btn active" data-tab="config">Configure</button>
        <button class="property-tab-btn" data-tab="test">Test Step</button>
        <button class="property-tab-btn" data-tab="vars">Variables</button>
      </div>

      <div class="property-tab-content" id="property-tab-content">
        <div class="empty-state-text" style="color:var(--text-muted); padding:20px; text-align:center;">
          Select a node on the canvas to configure properties.
        </div>
      </div>
    `;

    // Tab switching
    this.container.querySelectorAll('.property-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.container.querySelectorAll('.property-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeTab = btn.dataset.tab;
        this.renderCurrentTab();
      });
    });

    this.container.querySelector('#btn-close-prop-panel')?.addEventListener('click', () => {
      this.app.sidebarRight.classList.add('collapsed');
    });
  }

  showNode(nodeId) {
    this.currentNodeId = nodeId;
    const node = this.app.getNodeById(nodeId);
    if (!node) return;

    this.app.sidebarRight.classList.remove('collapsed');

    const reg = NODE_REGISTRY[node.type];
    const iconEl = this.container.querySelector('#prop-panel-icon');
    const titleEl = this.container.querySelector('#prop-panel-title');
    if (iconEl) iconEl.textContent = reg ? reg.icon : '⚙️';
    if (titleEl) titleEl.textContent = `${node.title || node.type}`;

    this.renderCurrentTab();
  }

  renderCurrentTab() {
    const contentEl = this.container.querySelector('#property-tab-content');
    if (!contentEl) return;

    if (!this.currentNodeId) {
      contentEl.innerHTML = '<div style="color:var(--text-muted); text-align:center; padding:24px;">No node selected.</div>';
      return;
    }

    const node = this.app.getNodeById(this.currentNodeId);
    if (!node) return;

    if (this.activeTab === 'config') {
      this.renderConfigTab(contentEl, node);
    } else if (this.activeTab === 'test') {
      this.renderTestTab(contentEl, node);
    } else if (this.activeTab === 'vars') {
      this.renderVarsTab(contentEl);
    }
  }

  renderConfigTab(container, node) {
    const reg = NODE_REGISTRY[node.type];
    const config = node.configuration || {};

    let html = `
      <div class="property-section">
        <div class="form-group">
          <label class="form-label">Node Title</label>
          <input type="text" id="prop-node-title" value="${this.escape(node.title || '')}" />
        </div>
      </div>
      <div class="topbar-divider" style="width:100%; height:1px; margin:4px 0;"></div>
      <div class="property-section" id="prop-type-specific-form">
    `;

    // Render Type-Specific Forms
    switch (node.type) {
      case 'trigger':
        html += `
          <div class="form-group">
            <label class="form-label">Sample JSON Payload <span class="label-hint">Initial Data</span></label>
            <textarea id="prop-samplePayload" class="code-editor-area" style="min-height:140px;">${this.escape(typeof config.samplePayload === 'string' ? config.samplePayload : JSON.stringify(config.samplePayload, null, 2))}</textarea>
            <span class="form-helper">This payload will be emitted when starting workflow.</span>
          </div>
        `;
        break;

      case 'schedule':
        html += `
          <div class="form-group">
            <label class="form-label">Trigger Mode</label>
            <select id="prop-intervalType">
              <option value="interval" ${config.intervalType === 'interval' ? 'selected' : ''}>Fixed Interval</option>
              <option value="cron" ${config.intervalType === 'cron' ? 'selected' : ''}>Cron Expression</option>
            </select>
          </div>
          <div class="form-group" id="group-interval" style="${config.intervalType === 'cron' ? 'display:none;' : ''}">
            <label class="form-label">Every</label>
            <div style="display:flex; gap:6px;">
              <input type="number" id="prop-intervalValue" value="${config.intervalValue || 5}" min="1" />
              <select id="prop-intervalUnit">
                <option value="seconds" ${config.intervalUnit === 'seconds' ? 'selected' : ''}>Seconds</option>
                <option value="minutes" ${config.intervalUnit === 'minutes' ? 'selected' : ''}>Minutes</option>
                <option value="hours" ${config.intervalUnit === 'hours' ? 'selected' : ''}>Hours</option>
              </select>
            </div>
          </div>
          <div class="form-group" id="group-cron" style="${config.intervalType !== 'cron' ? 'display:none;' : ''}">
            <label class="form-label">Cron Expression</label>
            <input type="text" id="prop-cronExpression" value="${this.escape(config.cronExpression || '*/5 * * * *')}" placeholder="*/5 * * * *" />
          </div>
        `;
        break;

      case 'webhook':
        html += `
          <div class="form-group">
            <label class="form-label">Webhook Path</label>
            <input type="text" id="prop-path" value="${this.escape(config.path || '/webhook/v1/events')}" />
          </div>
          <div class="form-group">
            <label class="form-label">HTTP Method</label>
            <select id="prop-method">
              <option value="POST" ${config.method === 'POST' ? 'selected' : ''}>POST</option>
              <option value="GET" ${config.method === 'GET' ? 'selected' : ''}>GET</option>
              <option value="PUT" ${config.method === 'PUT' ? 'selected' : ''}>PUT</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Mock Incoming Payload (JSON)</label>
            <textarea id="prop-mockBody" class="code-editor-area" style="min-height:120px;">${this.escape(config.mockBody || '{}')}</textarea>
          </div>
        `;
        break;

      case 'http_request':
        html += `
          <div class="form-group">
            <label class="form-label">Method & URL</label>
            <div style="display:flex; gap:6px;">
              <select id="prop-method" style="width:90px;">
                <option value="GET" ${config.method === 'GET' ? 'selected' : ''}>GET</option>
                <option value="POST" ${config.method === 'POST' ? 'selected' : ''}>POST</option>
                <option value="PUT" ${config.method === 'PUT' ? 'selected' : ''}>PUT</option>
                <option value="DELETE" ${config.method === 'DELETE' ? 'selected' : ''}>DELETE</option>
              </select>
              <input type="text" id="prop-url" value="${this.escape(config.url || '')}" placeholder="https://api.example.com/data" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Mode</label>
            <select id="prop-mode">
              <option value="simulate" ${config.mode !== 'live' ? 'selected' : ''}>Simulate / Mock Response</option>
              <option value="live" ${config.mode === 'live' ? 'selected' : ''}>Live Fetch API</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Simulated Status & Latency</label>
            <div style="display:flex; gap:6px;">
              <input type="number" id="prop-simulatedStatus" value="${config.simulatedStatus || 200}" placeholder="200" style="width:80px;" />
              <input type="number" id="prop-simulatedLatency" value="${config.simulatedLatency || 100}" placeholder="Latency (ms)" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Response Body (JSON / Template)</label>
            <textarea id="prop-body" class="code-editor-area" style="min-height:100px;">${this.escape(config.body || '{}')}</textarea>
          </div>
        `;
        break;

      case 'transform':
        html += `
          <div class="form-group">
            <label class="form-label">JavaScript Transformation</label>
            <textarea id="prop-code" class="code-editor-area" style="min-height:180px;">${this.escape(config.code || 'return $input;')}</textarea>
            <span class="form-helper">Access $input (incoming data), $vars (workflow variables), $nodes (prior outputs).</span>
          </div>
        `;
        break;

      case 'condition':
        const rule = (config.rules && config.rules[0]) || { field: 'amount', operator: 'greater_than', value: '100' };
        html += `
          <div class="form-group">
            <label class="form-label">Condition Rule (If / Else)</label>
            <div class="rule-row" style="grid-template-columns: 1fr 1fr 1fr; margin-bottom:6px;">
              <input type="text" id="prop-rule-field" value="${this.escape(rule.field || '')}" placeholder="field path" />
              <select id="prop-rule-op">
                <option value="equals" ${rule.operator === 'equals' ? 'selected' : ''}>== equals</option>
                <option value="not_equals" ${rule.operator === 'not_equals' ? 'selected' : ''}>!= not equals</option>
                <option value="greater_than" ${rule.operator === 'greater_than' ? 'selected' : ''}>&gt; greater than</option>
                <option value="less_than" ${rule.operator === 'less_than' ? 'selected' : ''}>&lt; less than</option>
                <option value="contains" ${rule.operator === 'contains' ? 'selected' : ''}>contains</option>
                <option value="is_empty" ${rule.operator === 'is_empty' ? 'selected' : ''}>is empty</option>
                <option value="is_not_empty" ${rule.operator === 'is_not_empty' ? 'selected' : ''}>is not empty</option>
                <option value="regex" ${rule.operator === 'regex' ? 'selected' : ''}>regex match</option>
              </select>
              <input type="text" id="prop-rule-value" value="${this.escape(rule.value || '')}" placeholder="target value" />
            </div>
            <span class="form-helper">Outputs: <span style="color:#10b981; font-weight:600;">True</span> (top right port) / <span style="color:#f97316; font-weight:600;">False</span> (bottom right port).</span>
          </div>
        `;
        break;

      case 'filter':
        html += `
          <div class="form-group">
            <label class="form-label">Filter Field</label>
            <input type="text" id="prop-property" value="${this.escape(config.property || 'price')}" placeholder="e.g. price or role" />
          </div>
          <div class="form-group">
            <label class="form-label">Operator & Target Value</label>
            <div style="display:flex; gap:6px;">
              <select id="prop-operator">
                <option value="equals" ${config.operator === 'equals' ? 'selected' : ''}>== equals</option>
                <option value="not_equals" ${config.operator === 'not_equals' ? 'selected' : ''}>!= not equals</option>
                <option value="greater_than" ${config.operator === 'greater_than' ? 'selected' : ''}>&gt; greater than</option>
                <option value="less_than" ${config.operator === 'less_than' ? 'selected' : ''}>&lt; less than</option>
                <option value="contains" ${config.operator === 'contains' ? 'selected' : ''}>contains</option>
              </select>
              <input type="text" id="prop-value" value="${this.escape(config.value || '')}" placeholder="value" />
            </div>
          </div>
        `;
        break;

      case 'delay':
        html += `
          <div class="form-group">
            <label class="form-label">Duration</label>
            <div style="display:flex; gap:6px;">
              <input type="number" id="prop-duration" value="${config.duration || 1000}" min="50" max="10000" />
              <select id="prop-unit">
                <option value="ms" ${config.unit === 'ms' ? 'selected' : ''}>Milliseconds</option>
                <option value="seconds" ${config.unit === 'seconds' ? 'selected' : ''}>Seconds</option>
              </select>
            </div>
          </div>
        `;
        break;

      case 'email':
        html += `
          <div class="form-group">
            <label class="form-label">To (Recipient)</label>
            <input type="text" id="prop-to" value="${this.escape(config.to || '')}" placeholder="{{$input.userEmail}}" />
          </div>
          <div class="form-group">
            <label class="form-label">Subject</label>
            <input type="text" id="prop-subject" value="${this.escape(config.subject || '')}" placeholder="Welcome {{$input.name}}" />
          </div>
          <div class="form-group">
            <label class="form-label">Email Body (Text / HTML)</label>
            <textarea id="prop-body" class="code-editor-area" style="min-height:120px;">${this.escape(config.body || '')}</textarea>
          </div>
        `;
        break;

      case 'notification':
        html += `
          <div class="form-group">
            <label class="form-label">Channel & Severity</label>
            <div style="display:flex; gap:6px;">
              <select id="prop-channel">
                <option value="toast" ${config.channel === 'toast' ? 'selected' : ''}>In-App Toast</option>
                <option value="slack" ${config.channel === 'slack' ? 'selected' : ''}>Slack Webhook</option>
              </select>
              <select id="prop-severity">
                <option value="info" ${config.severity === 'info' ? 'selected' : ''}>Info</option>
                <option value="success" ${config.severity === 'success' ? 'selected' : ''}>Success</option>
                <option value="warning" ${config.severity === 'warning' ? 'selected' : ''}>Warning</option>
                <option value="error" ${config.severity === 'error' ? 'selected' : ''}>Error</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Title</label>
            <input type="text" id="prop-title" value="${this.escape(config.title || '')}" />
          </div>
          <div class="form-group">
            <label class="form-label">Message</label>
            <textarea id="prop-message" style="min-height:60px;">${this.escape(config.message || '')}</textarea>
          </div>
        `;
        break;

      case 'database':
        html += `
          <div class="form-group">
            <label class="form-label">Table & Operation</label>
            <div style="display:flex; gap:6px;">
              <select id="prop-table">
                <option value="orders" ${config.table === 'orders' ? 'selected' : ''}>orders</option>
                <option value="users" ${config.table === 'users' ? 'selected' : ''}>users</option>
                <option value="logs" ${config.table === 'logs' ? 'selected' : ''}>logs</option>
                <option value="inventory" ${config.table === 'inventory' ? 'selected' : ''}>inventory</option>
              </select>
              <select id="prop-operation">
                <option value="insert" ${config.operation === 'insert' ? 'selected' : ''}>Insert Record</option>
                <option value="find" ${config.operation === 'find' ? 'selected' : ''}>Find Query</option>
                <option value="update" ${config.operation === 'update' ? 'selected' : ''}>Update Rows</option>
                <option value="delete" ${config.operation === 'delete' ? 'selected' : ''}>Delete Rows</option>
              </select>
            </div>
          </div>
          <div class="form-group" id="db-group-record" style="${config.operation === 'find' || config.operation === 'delete' ? 'display:none;' : ''}">
            <label class="form-label">Record Data (JSON)</label>
            <textarea id="prop-recordData" class="code-editor-area" style="min-height:100px;">${this.escape(config.recordData || '{}')}</textarea>
          </div>
          <div class="form-group" id="db-group-query" style="${config.operation === 'insert' ? 'display:none;' : ''}">
            <label class="form-label">Query Filter (JSON)</label>
            <textarea id="prop-query" class="code-editor-area" style="min-height:80px;">${this.escape(config.query || '{}')}</textarea>
          </div>
        `;
        break;

      case 'output':
        html += `
          <div class="form-group">
            <label class="form-label">Sink Output Name</label>
            <input type="text" id="prop-outputName" value="${this.escape(config.outputName || 'workflow_result')}" />
          </div>
          <div class="form-group">
            <label class="form-label">Format</label>
            <select id="prop-format">
              <option value="json" ${config.format === 'json' ? 'selected' : ''}>JSON</option>
              <option value="raw" ${config.format === 'raw' ? 'selected' : ''}>Raw Text</option>
            </select>
          </div>
        `;
        break;
    }

    html += `
      </div>
      <div style="margin-top:10px; display:flex; gap:8px;">
        <button class="btn btn-primary" id="btn-save-node-props" style="flex:1;">Save Properties</button>
        <button class="btn btn-ghost" id="btn-quick-test-node" title="Test this step now">▶ Test</button>
      </div>
    `;

    container.innerHTML = html;

    // Dynamic visibility hooks
    const opSelect = container.querySelector('#prop-operation');
    if (opSelect) {
      opSelect.addEventListener('change', () => {
        const val = opSelect.value;
        const recGrp = container.querySelector('#db-group-record');
        const qryGrp = container.querySelector('#db-group-query');
        if (recGrp) recGrp.style.display = (val === 'find' || val === 'delete') ? 'none' : 'block';
        if (qryGrp) qryGrp.style.display = (val === 'insert') ? 'none' : 'block';
      });
    }

    const intervalTypeSelect = container.querySelector('#prop-intervalType');
    if (intervalTypeSelect) {
      intervalTypeSelect.addEventListener('change', () => {
        const val = intervalTypeSelect.value;
        const grpInt = container.querySelector('#group-interval');
        const grpCron = container.querySelector('#group-cron');
        if (grpInt) grpInt.style.display = val === 'cron' ? 'none' : 'block';
        if (grpCron) grpCron.style.display = val !== 'cron' ? 'none' : 'block';
      });
    }

    // Bind save & quick test
    container.querySelector('#btn-save-node-props')?.addEventListener('click', () => {
      this.saveNodeProperties(node);
    });

    container.querySelector('#btn-quick-test-node')?.addEventListener('click', () => {
      this.saveNodeProperties(node);
      this.app.testNode(node.id);
    });
  }

  saveNodeProperties(node) {
    const container = this.container;
    const titleInput = container.querySelector('#prop-node-title');
    if (titleInput) {
      node.title = titleInput.value.trim() || node.type;
    }

    const newConfig = { ...node.configuration };

    // Parse all inputs inside type-specific form
    const inputs = container.querySelectorAll('#prop-type-specific-form input, #prop-type-specific-form select, #prop-type-specific-form textarea');
    inputs.forEach(input => {
      const id = input.id.replace('prop-', '');
      let val = input.value;
      if (input.type === 'number') val = Number(val);
      if (input.type === 'checkbox') val = input.checked;

      // Handle Condition Rule custom assembly
      if (id.startsWith('rule-')) {
        const field = container.querySelector('#prop-rule-field')?.value || 'field';
        const operator = container.querySelector('#prop-rule-op')?.value || 'equals';
        const value = container.querySelector('#prop-rule-value')?.value || '';
        newConfig.rules = [{ field, operator, value }];
        newConfig.combinator = 'AND';
      } else {
        newConfig[id] = val;
      }
    });

    node.configuration = newConfig;
    this.app.nodeRenderer.updateNodeSummary(node.id);
    this.app.markDirty();
    this.app.toast(`Updated ${node.title}`, 'Properties Saved', 'success');
  }

  renderTestTab(container, node) {
    container.innerHTML = `
      <div class="property-section">
        <div class="property-section-title">Test Step Execution</div>
        <p class="form-helper" style="margin-bottom:8px;">Execute "${this.escape(node.title || node.type)}" individually with mock or upstream input.</p>

        <div class="form-group">
          <label class="form-label">Mock Input Data (JSON)</label>
          <textarea id="test-node-input" class="code-editor-area" style="min-height:100px;">${JSON.stringify({ test: true, timestamp: new Date().toISOString() }, null, 2)}</textarea>
        </div>

        <button class="btn btn-primary" id="btn-run-step-test" style="width:100%; margin-top:8px;">
          ▶ Run Test Step
        </button>

        <div class="topbar-divider" style="width:100%; height:1px; margin:12px 0;"></div>

        <div class="form-group">
          <label class="form-label">Step Output Result</label>
          <div id="test-step-output-container" class="code-editor-area" style="min-height:140px; overflow:auto;">
            <span style="color:var(--text-muted);">Click "Run Test Step" to inspect output...</span>
          </div>
        </div>
      </div>
    `;

    container.querySelector('#btn-run-step-test')?.addEventListener('click', async () => {
      const outBox = container.querySelector('#test-step-output-container');
      const inputStr = container.querySelector('#test-node-input')?.value || '{}';
      let mockInput = {};
      try {
        mockInput = JSON.parse(inputStr);
      } catch (e) {
        mockInput = { raw: inputStr };
      }

      outBox.innerHTML = '<span style="color:#60a5fa;">Running test...</span>';

      const result = await window.flowSimulation.testSingleNode(node, mockInput);
      if (result.success) {
        outBox.innerHTML = `<pre class="json-viewer">${this.syntaxHighlight(result.data)}</pre><div style="font-size:10px; color:#34d399; margin-top:6px;">✓ Step executed in ${result.durationMs}ms (Port: ${result.outputPort || 'output'})</div>`;
      } else {
        outBox.innerHTML = `<div style="color:#f87171; font-size:11px;">✕ Error: ${this.escape(result.error)} (${result.durationMs}ms)</div>`;
      }
    });
  }

  renderVarsTab(container) {
    const vars = this.app.workflow.variables || {};
    let rowsHtml = '';
    for (const [k, v] of Object.entries(vars)) {
      rowsHtml += `
        <div class="kv-row" data-key="${this.escape(k)}">
          <input type="text" class="var-key" value="${this.escape(k)}" />
          <input type="text" class="var-val" value="${this.escape(String(v))}" />
          <button class="btn btn-ghost btn-sm btn-icon btn-del-var">✕</button>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="property-section">
        <div class="property-section-title">Workflow Variables</div>
        <p class="form-helper" style="margin-bottom:8px;">Global variables accessible in any expression via <code>{{$vars.key}}</code> or <code>{{key}}</code>.</p>

        <div id="vars-list-container">
          ${rowsHtml || '<div style="color:var(--text-muted); font-size:11px; padding:6px 0;">No variables defined.</div>'}
        </div>

        <button class="btn btn-ghost btn-sm" id="btn-add-var" style="margin-top:6px;">+ Add Variable</button>
        <button class="btn btn-primary" id="btn-save-vars" style="width:100%; margin-top:12px;">Save Variables</button>
      </div>
    `;

    container.querySelector('#btn-add-var')?.addEventListener('click', () => {
      const list = container.querySelector('#vars-list-container');
      const row = document.createElement('div');
      row.className = 'kv-row';
      row.innerHTML = `
        <input type="text" class="var-key" placeholder="variableName" />
        <input type="text" class="var-val" placeholder="value" />
        <button class="btn btn-ghost btn-sm btn-icon btn-del-var">✕</button>
      `;
      row.querySelector('.btn-del-var').addEventListener('click', () => row.remove());
      list.appendChild(row);
    });

    container.querySelectorAll('.btn-del-var').forEach(btn => {
      btn.addEventListener('click', (e) => e.target.closest('.kv-row').remove());
    });

    container.querySelector('#btn-save-vars')?.addEventListener('click', () => {
      const newVars = {};
      container.querySelectorAll('.kv-row').forEach(row => {
        const k = row.querySelector('.var-key')?.value.trim();
        const v = row.querySelector('.var-val')?.value.trim();
        if (k) newVars[k] = v;
      });
      this.app.workflow.variables = newVars;
      this.app.markDirty();
      this.app.toast('Workflow variables updated', 'Saved', 'success');
    });
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
    if (str === undefined || str === null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

window.PropertyPanel = PropertyPanel;
