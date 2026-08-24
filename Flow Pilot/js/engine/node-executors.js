/**
 * FlowPilot Node Executors
 * Implementation of all 12 Node execution routines
 */

// In-Memory Sent Email Box for Simulated Email Node
window.flowEmailInbox = window.flowEmailInbox || [];

const NodeExecutors = {
  /**
   * Manual Trigger
   */
  async trigger(node, inputData, context) {
    const config = node.configuration || {};
    let payload = {};

    try {
      if (typeof config.samplePayload === 'string') {
        const interpolated = ExpressionInterpolator.interpolate(config.samplePayload, {
          $input: inputData || {},
          $vars: context.variables || {},
          $nodes: context.nodeOutputs || {}
        });
        payload = JSON.parse(interpolated);
      } else if (typeof config.samplePayload === 'object') {
        payload = ExpressionInterpolator.interpolate(config.samplePayload, {
          $input: inputData || {},
          $vars: context.variables || {},
          $nodes: context.nodeOutputs || {}
        });
      }
    } catch (e) {
      console.warn('[Trigger Executor] Payload parsing fallback:', e.message);
      payload = { message: 'Manual trigger fired', timestamp: new Date().toISOString() };
    }

    return {
      outputPort: 'output',
      data: payload
    };
  },

  /**
   * Schedule Trigger
   */
  async schedule(node, inputData, context) {
    const config = node.configuration || {};
    return {
      outputPort: 'output',
      data: {
        scheduledTime: new Date().toISOString(),
        intervalType: config.intervalType || 'interval',
        intervalValue: config.intervalValue || 5,
        intervalUnit: config.intervalUnit || 'seconds',
        cronExpression: config.cronExpression || '*/5 * * * *',
        executionCount: (context.executionIndex || 0) + 1,
        timestamp: Date.now()
      }
    };
  },

  /**
   * Webhook Trigger
   */
  async webhook(node, inputData, context) {
    const config = node.configuration || {};
    let body = {};

    try {
      if (config.mockBody) {
        body = JSON.parse(config.mockBody);
      }
    } catch (e) {
      body = { raw: config.mockBody || '' };
    }

    return {
      outputPort: 'output',
      data: {
        method: config.method || 'POST',
        path: config.path || '/webhook/v1/events',
        headers: {
          'content-type': 'application/json',
          'x-webhook-signature': 'sig_' + Math.random().toString(36).substr(2, 12),
          'user-agent': 'FlowPilot-Webhook-Agent/1.0'
        },
        query: { source: 'api_test', env: 'production' },
        ...body
      }
    };
  },

  /**
   * HTTP Request Node
   */
  async http_request(node, inputData, context) {
    const config = node.configuration || {};
    const evalContext = {
      $input: inputData || {},
      $vars: context.variables || {},
      $nodes: context.nodeOutputs || {}
    };

    const resolvedUrl = ExpressionInterpolator.interpolate(config.url || '', evalContext);
    const method = (config.method || 'GET').toUpperCase();

    // If simulated mode (or live fails)
    if (config.mode !== 'live') {
      const latency = parseInt(config.simulatedLatency, 10) || 100;
      if (latency > 0) {
        await new Promise(r => setTimeout(r, latency));
      }

      let parsedBody = {};
      try {
        if (config.body) {
          const interpolatedBody = ExpressionInterpolator.interpolate(config.body, evalContext);
          parsedBody = JSON.parse(interpolatedBody);
        }
      } catch (e) {
        parsedBody = { raw: config.body || '' };
      }

      return {
        outputPort: 'output',
        data: {
          status: parseInt(config.simulatedStatus, 10) || 200,
          statusText: 'OK',
          url: resolvedUrl,
          method: method,
          headers: { 'content-type': 'application/json; charset=utf-8' },
          data: parsedBody
        }
      };
    }

    // Live Fetch Mode
    const startTime = Date.now();
    try {
      const fetchHeaders = {};
      if (Array.isArray(config.headers)) {
        config.headers.forEach(h => {
          if (h.key && h.value) {
            fetchHeaders[h.key] = ExpressionInterpolator.interpolate(h.value, evalContext);
          }
        });
      }

      const fetchOptions = {
        method,
        headers: fetchHeaders
      };

      if (['POST', 'PUT', 'PATCH'].includes(method) && config.body) {
        fetchOptions.body = ExpressionInterpolator.interpolate(config.body, evalContext);
      }

      const res = await fetch(resolvedUrl, fetchOptions);
      const resText = await res.text();
      let resData;
      try {
        resData = JSON.parse(resText);
      } catch (e) {
        resData = resText;
      }

      return {
        outputPort: 'output',
        data: {
          status: res.status,
          statusText: res.statusText,
          durationMs: Date.now() - startTime,
          data: resData
        }
      };
    } catch (err) {
      console.warn('[HTTP Request] Live fetch error, returning fallback:', err.message);
      return {
        outputPort: 'output',
        data: {
          status: 500,
          error: err.message,
          message: 'Failed to fetch live URL (CORS or network issue). Check simulated mode.'
        }
      };
    }
  },

  /**
   * Code / Transform Node
   */
  async transform(node, inputData, context) {
    const config = node.configuration || {};
    const code = config.code || 'return $input;';

    const evalContext = {
      $input: inputData || {},
      $vars: context.variables || {},
      $nodes: context.nodeOutputs || {},
      $context: context
    };

    try {
      // Sandboxed JS evaluation
      const fn = new Function(
        '$input',
        '$vars',
        '$nodes',
        '$context',
        `"use strict";\n${code}`
      );

      const result = await fn(evalContext.$input, evalContext.$vars, evalContext.$nodes, evalContext.$context);
      return {
        outputPort: 'output',
        data: result !== undefined ? result : {}
      };
    } catch (err) {
      throw new Error(`Transform Error: ${err.message}`);
    }
  },

  /**
   * Condition (If/Else Branching)
   */
  async condition(node, inputData, context) {
    const config = node.configuration || {};
    const rules = config.rules || [];
    const combinator = config.combinator || 'AND';
    const evalContext = {
      $input: inputData || {},
      $vars: context.variables || {},
      $nodes: context.nodeOutputs || {}
    };

    if (rules.length === 0) {
      return { outputPort: 'true', data: inputData, branch: 'true' };
    }

    const evaluateRule = (rule) => {
      let fieldValue = ExpressionInterpolator.getPath(inputData, rule.field);
      if (fieldValue === undefined && typeof inputData === 'object' && inputData[rule.field] !== undefined) {
        fieldValue = inputData[rule.field];
      }

      let targetVal = ExpressionInterpolator.interpolate(rule.value, evalContext);

      // Cast comparison
      if (typeof fieldValue === 'number' && !isNaN(Number(targetVal))) {
        targetVal = Number(targetVal);
      }

      switch (rule.operator) {
        case 'equals':
          return String(fieldValue) === String(targetVal);
        case 'not_equals':
          return String(fieldValue) !== String(targetVal);
        case 'greater_than':
          return Number(fieldValue) > Number(targetVal);
        case 'less_than':
          return Number(fieldValue) < Number(targetVal);
        case 'greater_equal':
          return Number(fieldValue) >= Number(targetVal);
        case 'less_equal':
          return Number(fieldValue) <= Number(targetVal);
        case 'contains':
          return String(fieldValue || '').toLowerCase().includes(String(targetVal).toLowerCase());
        case 'not_contains':
          return !String(fieldValue || '').toLowerCase().includes(String(targetVal).toLowerCase());
        case 'is_empty':
          return fieldValue === undefined || fieldValue === null || fieldValue === '' || (Array.isArray(fieldValue) && fieldValue.length === 0);
        case 'is_not_empty':
          return fieldValue !== undefined && fieldValue !== null && fieldValue !== '' && (!Array.isArray(fieldValue) || fieldValue.length > 0);
        case 'regex':
          try {
            const re = new RegExp(targetVal, 'i');
            return re.test(String(fieldValue));
          } catch (e) {
            return false;
          }
        default:
          return Boolean(fieldValue);
      }
    };

    let conditionPassed = combinator === 'AND'
      ? rules.every(evaluateRule)
      : rules.some(evaluateRule);

    const branch = conditionPassed ? 'true' : 'false';

    return {
      outputPort: branch,
      branch: branch,
      data: {
        ...inputData,
        _conditionResult: conditionPassed,
        _evaluatedBranch: branch
      }
    };
  },

  /**
   * Filter Node
   */
  async filter(node, inputData, context) {
    const config = node.configuration || {};
    const { property, operator = 'equals', value } = config;
    const evalContext = {
      $input: inputData || {},
      $vars: context.variables || {},
      $nodes: context.nodeOutputs || {}
    };

    let items = Array.isArray(inputData) ? inputData : (inputData && inputData.items) ? inputData.items : [inputData];
    const targetVal = ExpressionInterpolator.interpolate(value, evalContext);

    const filtered = items.filter(item => {
      if (typeof item !== 'object' || item === null) return true;
      const fieldVal = property ? item[property] : item;
      
      switch (operator) {
        case 'equals': return String(fieldVal) === String(targetVal);
        case 'not_equals': return String(fieldVal) !== String(targetVal);
        case 'greater_than': return Number(fieldVal) > Number(targetVal);
        case 'less_than': return Number(fieldVal) < Number(targetVal);
        case 'contains': return String(fieldVal).toLowerCase().includes(String(targetVal).toLowerCase());
        default: return Boolean(fieldVal);
      }
    });

    return {
      outputPort: 'output',
      data: {
        items: filtered,
        passedCount: filtered.length,
        totalCount: items.length,
        droppedCount: items.length - filtered.length
      }
    };
  },

  /**
   * Delay Node
   */
  async delay(node, inputData, context) {
    const config = node.configuration || {};
    let ms = parseInt(config.duration, 10) || 1000;
    if (config.unit === 's' || config.unit === 'seconds') ms *= 1000;

    // Cap delay in simulation to reasonable max (e.g. 10s)
    ms = Math.min(ms, 10000);

    const startTime = Date.now();
    await new Promise(r => setTimeout(r, ms));

    return {
      outputPort: 'output',
      data: {
        ...inputData,
        _delayedMs: ms,
        _resumedAt: new Date().toISOString()
      }
    };
  },

  /**
   * Send Email Node (Simulated)
   */
  async email(node, inputData, context) {
    const config = node.configuration || {};
    const evalContext = {
      $input: inputData || {},
      $vars: context.variables || {},
      $nodes: context.nodeOutputs || {}
    };

    const to = ExpressionInterpolator.interpolate(config.to || 'user@example.com', evalContext);
    const from = ExpressionInterpolator.interpolate(config.from || 'notifications@flowpilot.dev', evalContext);
    const subject = ExpressionInterpolator.interpolate(config.subject || 'Flow Notification', evalContext);
    const body = ExpressionInterpolator.interpolate(config.body || '', evalContext);

    const emailEntry = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      to,
      from,
      subject,
      body,
      sentAt: new Date().toISOString(),
      status: 'delivered'
    };

    // Store in simulated email inbox
    window.flowEmailInbox.unshift(emailEntry);

    // Show quick toast notification
    if (window.flowToast) {
      window.flowToast.info(`✉️ Email dispatched to ${to}`, subject);
    }

    return {
      outputPort: 'output',
      data: {
        ...inputData,
        emailDelivery: emailEntry
      }
    };
  },

  /**
   * Notification Alert Node
   */
  async notification(node, inputData, context) {
    const config = node.configuration || {};
    const evalContext = {
      $input: inputData || {},
      $vars: context.variables || {},
      $nodes: context.nodeOutputs || {}
    };

    const title = ExpressionInterpolator.interpolate(config.title || 'Flow Alert', evalContext);
    const message = ExpressionInterpolator.interpolate(config.message || '', evalContext);
    const severity = config.severity || 'info';

    // Trigger visual toast
    if (window.flowToast) {
      window.flowToast.show(message, title, severity);
    }

    return {
      outputPort: 'output',
      data: {
        ...inputData,
        notification: {
          channel: config.channel || 'toast',
          severity,
          title,
          message,
          deliveredAt: new Date().toISOString()
        }
      }
    };
  },

  /**
   * Simulated Database Node
   */
  async database(node, inputData, context) {
    const config = node.configuration || {};
    const evalContext = {
      $input: inputData || {},
      $vars: context.variables || {},
      $nodes: context.nodeOutputs || {}
    };

    const table = config.table || 'orders';
    const operation = config.operation || 'insert';
    let resultData = null;

    if (operation === 'insert') {
      let record = {};
      try {
        const interpolated = ExpressionInterpolator.interpolate(config.recordData || '{}', evalContext);
        record = JSON.parse(interpolated);
      } catch (e) {
        record = { ...inputData, createdAt: new Date().toISOString() };
      }
      resultData = await window.flowDB.dbTableInsert(table, record);
    } else if (operation === 'find') {
      let query = {};
      try {
        const interpolated = ExpressionInterpolator.interpolate(config.query || '{}', evalContext);
        query = JSON.parse(interpolated);
      } catch (e) {
        query = {};
      }
      resultData = await window.flowDB.dbTableFind(table, query);
    } else if (operation === 'update') {
      let query = {};
      let updates = {};
      try {
        query = JSON.parse(ExpressionInterpolator.interpolate(config.query || '{}', evalContext));
        updates = JSON.parse(ExpressionInterpolator.interpolate(config.recordData || '{}', evalContext));
      } catch (e) {}
      resultData = await window.flowDB.dbTableUpdate(table, query, updates);
    } else if (operation === 'delete') {
      let query = {};
      try {
        query = JSON.parse(ExpressionInterpolator.interpolate(config.query || '{}', evalContext));
      } catch (e) {}
      resultData = await window.flowDB.dbTableDelete(table, query);
    }

    return {
      outputPort: 'output',
      data: {
        table,
        operation,
        result: resultData
      }
    };
  },

  /**
   * Output / Sink Node
   */
  async output(node, inputData, context) {
    const config = node.configuration || {};
    const outputName = config.outputName || 'workflow_result';

    // Store in context final outputs
    context.finalOutputs[outputName] = inputData;

    if (config.downloadOnComplete) {
      try {
        const blob = new Blob([JSON.stringify(inputData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${outputName}_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (e) {
        console.warn('Auto download error:', e);
      }
    }

    return {
      outputPort: null,
      data: inputData
    };
  }
};

window.NodeExecutors = NodeExecutors;
