/**
 * FlowPilot Data Models & Enterprise Node Registry
 */

// Node Registry & Definitions
const NODE_REGISTRY = {
  trigger: {
    type: 'trigger',
    category: 'trigger',
    title: 'Manual Trigger',
    icon: '⚡',
    description: 'Start workflow manually or inject custom JSON payload',
    inputs: [],
    outputs: [{ id: 'output', name: 'Output', type: 'any' }],
    defaultConfig: {
      payloadType: 'json',
      samplePayload: JSON.stringify({
        customerId: 'cus_9942a',
        customerName: 'Marcus Brody',
        customerEmail: 'm.brody@apexlogistics.io',
        accountTier: 'Enterprise',
        orderTotal: 495.00,
        billingCountry: 'US',
        timestamp: new Date().toISOString()
      }, null, 2)
    },
    getSummary(config) {
      return `Manual: ${config.payloadType || 'JSON'} payload`;
    }
  },

  schedule: {
    type: 'schedule',
    category: 'schedule',
    title: 'Schedule Trigger',
    icon: '⏱️',
    description: 'Trigger workflow on interval timer or cron schedule',
    inputs: [],
    outputs: [{ id: 'output', name: 'Output', type: 'any' }],
    defaultConfig: {
      intervalType: 'interval',
      intervalValue: 5,
      intervalUnit: 'seconds',
      cronExpression: '0 */4 * * *',
      timezone: 'UTC'
    },
    getSummary(config) {
      return config.intervalType === 'cron' 
        ? `Cron: ${config.cronExpression}` 
        : `Every ${config.intervalValue} ${config.intervalUnit}`;
    }
  },

  webhook: {
    type: 'webhook',
    category: 'webhook',
    title: 'Webhook Receiver',
    icon: '🪝',
    description: 'Simulated HTTP webhook endpoint with signature verification',
    inputs: [],
    outputs: [{ id: 'output', name: 'Output', type: 'any' }],
    defaultConfig: {
      path: '/v1/webhooks/stripe/orders',
      method: 'POST',
      authSecret: 'whsec_98f1b2c4e8a7190d',
      mockBody: JSON.stringify({
        id: 'evt_3N8x7fLkdIwHu7ix1q8YzX9p',
        object: 'event',
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_3N8x7fLkdIwHu7ix',
            amount: 24500,
            currency: 'usd',
            customer_email: 'sarah.connor@cyberdyne-sys.com',
            customer_name: 'Sarah Connor',
            metadata: {
              order_id: 'ORD-2026-8821',
              plan: 'Enterprise Pro Dedicated'
            }
          }
        }
      }, null, 2)
    },
    getSummary(config) {
      return `${config.method || 'POST'} ${config.path || '/webhook'}`;
    }
  },

  http_request: {
    type: 'http_request',
    category: 'http',
    title: 'HTTP Request',
    icon: '🌐',
    description: 'Perform real API requests or simulate endpoint responses',
    inputs: [{ id: 'input', name: 'Input', type: 'any' }],
    outputs: [{ id: 'output', name: 'Output', type: 'any' }],
    defaultConfig: {
      method: 'GET',
      url: 'https://api.github.com/repos/google/gemini',
      mode: 'simulate',
      simulatedStatus: 200,
      simulatedLatency: 120,
      headers: [
        { key: 'Content-Type', value: 'application/json' },
        { key: 'Authorization', value: 'Bearer {{apiKey}}' },
        { key: 'User-Agent', value: 'FlowPilot-Automation/2.0' }
      ],
      body: JSON.stringify({
        status: 'healthy',
        uptime: '99.98%',
        region: 'us-east-1',
        activeConnections: 142
      }, null, 2),
      queryParams: []
    },
    getSummary(config) {
      return `${config.method || 'GET'} ${config.url || 'https://api...'}`;
    }
  },

  transform: {
    type: 'transform',
    category: 'transform',
    title: 'Code / Transform',
    icon: '🔄',
    description: 'Transform and reshape data using JavaScript sandbox',
    inputs: [{ id: 'input', name: 'Input', type: 'any' }],
    outputs: [{ id: 'output', name: 'Output', type: 'any' }],
    defaultConfig: {
      mode: 'javascript',
      code: `// $input: upstream data, $vars: workflow variables\nconst amount = $input.amount || $input.orderTotal || 150;\nreturn {\n  ...$input,\n  processedAt: new Date().toISOString(),\n  isHighValue: amount >= 200,\n  discountRate: amount >= 200 ? 0.15 : 0.05,\n  finalAmount: amount >= 200 ? amount * 0.85 : amount * 0.95\n};`
    },
    getSummary(config) {
      return `Transform (${config.mode || 'JS'})`;
    }
  },

  condition: {
    type: 'condition',
    category: 'condition',
    title: 'Condition (If/Else)',
    icon: '🔀',
    description: 'Branch execution based on boolean rules',
    inputs: [{ id: 'input', name: 'Input', type: 'any' }],
    outputs: [
      { id: 'true', name: 'True', type: 'any' },
      { id: 'false', name: 'False', type: 'any' }
    ],
    defaultConfig: {
      combinator: 'AND',
      rules: [
        { field: 'orderTotal', operator: 'greater_than', value: '200' }
      ]
    },
    getSummary(config) {
      const r = config.rules && config.rules[0];
      return r ? `If ${r.field} ${r.operator} ${r.value}` : 'Condition rules';
    }
  },

  filter: {
    type: 'filter',
    category: 'filter',
    title: 'Data Filter',
    icon: '🔍',
    description: 'Filter array collections or validate key properties',
    inputs: [{ id: 'input', name: 'Input', type: 'any' }],
    outputs: [{ id: 'output', name: 'Output', type: 'any' }],
    defaultConfig: {
      property: 'accountTier',
      operator: 'equals',
      value: 'Enterprise'
    },
    getSummary(config) {
      return `Filter: ${config.property || 'field'} ${config.operator || '=='} ${config.value || ''}`;
    }
  },

  delay: {
    type: 'delay',
    category: 'delay',
    title: 'Delay / Wait',
    icon: '⏳',
    description: 'Pause workflow execution for specified time',
    inputs: [{ id: 'input', name: 'Input', type: 'any' }],
    outputs: [{ id: 'output', name: 'Output', type: 'any' }],
    defaultConfig: {
      duration: 500,
      unit: 'ms'
    },
    getSummary(config) {
      return `Wait ${config.duration || 500} ${config.unit || 'ms'}`;
    }
  },

  email: {
    type: 'email',
    category: 'email',
    title: 'Send Email',
    icon: '✉️',
    description: 'Simulate transactional email dispatch',
    inputs: [{ id: 'input', name: 'Input', type: 'any' }],
    outputs: [{ id: 'output', name: 'Output', type: 'any' }],
    defaultConfig: {
      to: '{{$input.customerEmail || $input.data.object.customer_email || "customer@apexlogistics.io"}}',
      from: 'FlowPilot Billing <invoices@flowpilot.dev>',
      subject: 'Invoice Confirmation for Order #{{$input.customerId || "ORD-2026"}}',
      body: 'Hello {{$input.customerName || "Valued Customer"}},\n\nYour transaction of ${{$input.finalAmount || $input.orderTotal || 245.00}} was processed successfully.\nTier: {{$input.accountTier || "Enterprise"}}\n\nThank you for choosing FlowPilot!'
    },
    getSummary(config) {
      return `To: ${config.to || 'recipient'}`;
    }
  },

  notification: {
    type: 'notification',
    category: 'notification',
    title: 'Notification Alert',
    icon: '🔔',
    description: 'Simulate in-app, Slack, or webhook notifications',
    inputs: [{ id: 'input', name: 'Input', type: 'any' }],
    outputs: [{ id: 'output', name: 'Output', type: 'any' }],
    defaultConfig: {
      channel: 'toast',
      severity: 'success',
      title: 'Order Completed',
      message: 'Processed order for {{$input.customerName || "Customer"}} (${{$input.finalAmount || $input.orderTotal || 245}})'
    },
    getSummary(config) {
      return `${config.channel || 'Toast'}: ${config.title || 'Alert'}`;
    }
  },

  database: {
    type: 'database',
    category: 'database',
    title: 'Database (Simulated)',
    icon: '💾',
    description: 'Simulate CRUD operations on IndexedDB tables',
    inputs: [{ id: 'input', name: 'Input', type: 'any' }],
    outputs: [{ id: 'output', name: 'Output', type: 'any' }],
    defaultConfig: {
      table: 'orders',
      operation: 'insert',
      query: '{\n  "customerEmail": "{{$input.customerEmail}}"\n}',
      recordData: '{\n  "customerId": "{{$input.customerId || $input.data.object.id}}",\n  "customerEmail": "{{$input.customerEmail || $input.data.object.customer_email}}",\n  "amount": {{$input.finalAmount || $input.orderTotal || 245.00}},\n  "status": "completed",\n  "timestamp": "{{new Date().toISOString()}}"\n}'
    },
    getSummary(config) {
      return `${(config.operation || 'insert').toUpperCase()} [${config.table || 'table'}]`;
    }
  },

  output: {
    type: 'output',
    category: 'output',
    title: 'Output / Sink',
    icon: '🏁',
    description: 'Final workflow result collector and exporter',
    inputs: [{ id: 'input', name: 'Input', type: 'any' }],
    outputs: [],
    defaultConfig: {
      outputName: 'processed_payload',
      format: 'json',
      downloadOnComplete: false
    },
    getSummary(config) {
      return `Sink: ${config.outputName || 'result'} (${config.format || 'json'})`;
    }
  }
};

// Node Categories
const NODE_CATEGORIES = [
  { id: 'triggers', name: 'Triggers & Events', types: ['trigger', 'schedule', 'webhook'] },
  { id: 'logic', name: 'Logic & Flow', types: ['condition', 'filter', 'delay'] },
  { id: 'transform', name: 'Data & Transform', types: ['transform', 'http_request'] },
  { id: 'storage', name: 'Storage & DB', types: ['database'] },
  { id: 'messaging', name: 'Messaging & Alerts', types: ['email', 'notification'] },
  { id: 'outputs', name: 'Output & Sinks', types: ['output'] }
];

// Workflow Factory
function createDefaultWorkflow(name = 'Customer Onboarding & Verification') {
  const triggerId = 'node_trig_' + Math.random().toString(36).substr(2, 6);
  const transformId = 'node_trans_' + Math.random().toString(36).substr(2, 6);
  const outputId = 'node_out_' + Math.random().toString(36).substr(2, 6);

  return {
    id: 'wf_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    name: name,
    description: 'Automated enterprise onboarding and verification workflow',
    variables: {
      apiKey: 'pk_live_flowpilot_demo',
      environment: 'production',
      maxRetries: 3
    },
    nodes: [
      {
        id: triggerId,
        type: 'trigger',
        title: 'New Signup Trigger',
        position: { x: 120, y: 160 },
        configuration: { ...NODE_REGISTRY.trigger.defaultConfig }
      },
      {
        id: transformId,
        type: 'transform',
        title: 'Calculate Discount & Tier',
        position: { x: 440, y: 160 },
        configuration: { ...NODE_REGISTRY.transform.defaultConfig }
      },
      {
        id: outputId,
        type: 'output',
        title: 'Summary Output',
        position: { x: 760, y: 160 },
        configuration: { ...NODE_REGISTRY.output.defaultConfig }
      }
    ],
    connections: [
      {
        id: 'conn_1',
        fromNodeId: triggerId,
        fromPortId: 'output',
        toNodeId: transformId,
        toPortId: 'input'
      },
      {
        id: 'conn_2',
        fromNodeId: transformId,
        fromPortId: 'output',
        toNodeId: outputId,
        toPortId: 'input'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

// Pre-built Workflow Templates
const WORKFLOW_TEMPLATES = [
  {
    id: 'tpl_ecommerce_pipeline',
    name: 'Stripe Webhook & VIP Order Pipeline',
    category: 'Fintech & E-Commerce',
    badge: 'Popular',
    description: 'Ingest Stripe payment webhooks, branch high-value orders ($200+), insert records into PostgreSQL orders table, dispatch customer receipts, and trigger Slack notifications.',
    createWorkflow() {
      const nWebhook = 'node_wh_' + Date.now();
      const nCondition = 'node_cond_' + Date.now();
      const nTransformVip = 'node_tr_vip_' + Date.now();
      const nDbInsert = 'node_db_' + Date.now();
      const nEmail = 'node_email_' + Date.now();
      const nNotif = 'node_notif_' + Date.now();
      const nOutput = 'node_out_' + Date.now();

      return {
        id: 'wf_' + Date.now(),
        name: 'Stripe Webhook & VIP Order Pipeline',
        description: 'Automated order pipeline with VIP routing and notifications',
        variables: {
          storeName: 'FlowPilot Enterprise Store',
          supportEmail: 'orders@flowpilot.dev'
        },
        nodes: [
          {
            id: nWebhook,
            type: 'webhook',
            title: 'Stripe Payment Webhook',
            position: { x: 80, y: 180 },
            configuration: {
              path: '/v1/webhooks/stripe/orders',
              method: 'POST',
              mockBody: JSON.stringify({
                orderId: 'ORD-2026-9842',
                customerName: 'Eleanor Vance',
                customerEmail: 'eleanor.vance@techcorp.io',
                orderTotal: 349.00,
                accountTier: 'Enterprise Pro',
                items: ['Cloud Node Cluster', 'Dedicated SLA Support']
              }, null, 2)
            }
          },
          {
            id: nCondition,
            type: 'condition',
            title: 'Order Total >= $200?',
            position: { x: 380, y: 180 },
            configuration: {
              combinator: 'AND',
              rules: [{ field: 'orderTotal', operator: 'greater_than', value: '200' }]
            }
          },
          {
            id: nTransformVip,
            type: 'transform',
            title: 'Apply VIP 15% Bonus',
            position: { x: 680, y: 100 },
            configuration: {
              mode: 'javascript',
              code: `return {\n  ...$input,\n  vipDiscount: 0.15,\n  finalAmount: $input.orderTotal * 0.85,\n  loyaltyPointsAwarded: Math.floor($input.orderTotal * 3),\n  assignedManager: 'Rachel Sterling'\n};`
            }
          },
          {
            id: nDbInsert,
            type: 'database',
            title: 'Insert into DB Orders',
            position: { x: 980, y: 100 },
            configuration: {
              table: 'orders',
              operation: 'insert',
              recordData: '{\n  "orderId": "{{$input.orderId}}",\n  "customerEmail": "{{$input.customerEmail}}",\n  "amount": {{$input.finalAmount || $input.orderTotal}},\n  "status": "completed",\n  "tier": "{{$input.accountTier}}"\n}'
            }
          },
          {
            id: nEmail,
            type: 'email',
            title: 'Customer Receipt',
            position: { x: 1280, y: 100 },
            configuration: {
              to: '{{$input.customerEmail}}',
              from: 'Billing Team <billing@flowpilot.dev>',
              subject: 'Receipt for Order #{{$input.orderId}}',
              body: 'Hi {{$input.customerName}},\n\nYour order has been processed.\nTotal: ${{$input.finalAmount || $input.orderTotal}}\nPoints Awarded: {{$input.loyaltyPointsAwarded}}\nAccount Manager: {{$input.assignedManager}}\n\nBest regards,\nFlowPilot Team'
            }
          },
          {
            id: nNotif,
            type: 'notification',
            title: 'Standard Alert Toast',
            position: { x: 680, y: 290 },
            configuration: {
              channel: 'toast',
              severity: 'info',
              title: 'Standard Order Processed',
              message: 'Order for {{$input.customerName}} (${{$input.orderTotal}})'
            }
          },
          {
            id: nOutput,
            type: 'output',
            title: 'Pipeline Sink',
            position: { x: 1560, y: 180 },
            configuration: {
              outputName: 'processed_orders_report',
              format: 'json'
            }
          }
        ],
        connections: [
          { id: 'c1', fromNodeId: nWebhook, fromPortId: 'output', toNodeId: nCondition, toPortId: 'input' },
          { id: 'c2', fromNodeId: nCondition, fromPortId: 'true', toNodeId: nTransformVip, toPortId: 'input' },
          { id: 'c3', fromNodeId: nCondition, fromPortId: 'false', toNodeId: nNotif, toPortId: 'input' },
          { id: 'c4', fromNodeId: nTransformVip, fromPortId: 'output', toNodeId: nDbInsert, toPortId: 'input' },
          { id: 'c5', fromNodeId: nDbInsert, fromPortId: 'output', toNodeId: nEmail, toPortId: 'input' },
          { id: 'c6', fromNodeId: nEmail, fromPortId: 'output', toNodeId: nOutput, toPortId: 'input' },
          { id: 'c7', fromNodeId: nNotif, fromPortId: 'output', toNodeId: nOutput, toPortId: 'input' }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  },

  {
    id: 'tpl_user_onboarding',
    name: 'SaaS User Onboarding & Email Sequence',
    category: 'Growth & CRM',
    badge: 'Essential',
    description: 'Onboard new signups, enrich contact profile with company slug, persist to database, delay 500ms for synchronization, and deliver personalized welcome email.',
    createWorkflow() {
      const n1 = 'node_u1_' + Date.now();
      const n2 = 'node_u2_' + Date.now();
      const n3 = 'node_u3_' + Date.now();
      const n4 = 'node_u4_' + Date.now();
      const n5 = 'node_u5_' + Date.now();
      const n6 = 'node_u6_' + Date.now();

      return {
        id: 'wf_' + Date.now(),
        name: 'SaaS User Onboarding & Email Sequence',
        description: 'Automated user signup and email onboarding journey',
        variables: { welcomeSubject: 'Welcome to FlowPilot Platform!' },
        nodes: [
          {
            id: n1,
            type: 'trigger',
            title: 'New Signup Trigger',
            position: { x: 80, y: 180 },
            configuration: {
              samplePayload: JSON.stringify({
                userId: 'usr_enterprise_88',
                name: 'Marcus Brody',
                email: 'm.brody@apexlogistics.io',
                company: 'Apex Logistics Global',
                plan: 'Enterprise Pro'
              }, null, 2)
            }
          },
          {
            id: n2,
            type: 'transform',
            title: 'Enrich Company Profile',
            position: { x: 380, y: 180 },
            configuration: {
              code: `return {\n  ...$input,\n  workspaceSlug: $input.company.toLowerCase().replace(/[^a-z0-9]/g, '-'),\n  accountCreated: new Date().toISOString(),\n  trialDays: 30,\n  assignedPod: 'us-east-cluster-04'\n};`
            }
          },
          {
            id: n3,
            type: 'database',
            title: 'Insert into DB Users',
            position: { x: 680, y: 180 },
            configuration: {
              table: 'users',
              operation: 'insert',
              recordData: '{\n  "id": "{{$input.userId}}",\n  "name": "{{$input.name}}",\n  "email": "{{$input.email}}",\n  "role": "admin",\n  "active": true\n}'
            }
          },
          {
            id: n4,
            type: 'delay',
            title: 'Wait 500ms',
            position: { x: 980, y: 180 },
            configuration: { duration: 500, unit: 'ms' }
          },
          {
            id: n5,
            type: 'email',
            title: 'Send Welcome Email',
            position: { x: 1280, y: 180 },
            configuration: {
              to: '{{$input.email}}',
              from: 'FlowPilot Growth <welcome@flowpilot.dev>',
              subject: 'Welcome to FlowPilot, {{$input.name}}!',
              body: 'Hi {{$input.name}},\n\nYour workspace ({{$input.workspaceSlug}}) is live on pod {{$input.assignedPod}}.\nYou have 30 days of trial access on the {{$input.plan}} plan.\n\nCheers,\nFlowPilot Team'
            }
          },
          {
            id: n6,
            type: 'output',
            title: 'Onboarding Sink',
            position: { x: 1580, y: 180 },
            configuration: { outputName: 'onboarded_user', format: 'json' }
          }
        ],
        connections: [
          { id: 'c1', fromNodeId: n1, fromPortId: 'output', toNodeId: n2, toPortId: 'input' },
          { id: 'c2', fromNodeId: n2, fromPortId: 'output', toNodeId: n3, toPortId: 'input' },
          { id: 'c3', fromNodeId: n3, fromPortId: 'output', toNodeId: n4, toPortId: 'input' },
          { id: 'c4', fromNodeId: n4, fromPortId: 'output', toNodeId: n5, toPortId: 'input' },
          { id: 'c5', fromNodeId: n5, fromPortId: 'output', toNodeId: n6, toPortId: 'input' }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  },

  {
    id: 'tpl_api_health_monitor',
    name: 'Cloudflare / API Health Probe & Alert Router',
    category: 'DevOps & Infrastructure',
    badge: 'DevOps',
    description: 'Interval-based health check against infrastructure endpoints. Automatically routes healthy logs or dispatches high-priority incident emails to SRE on-call engineers.',
    createWorkflow() {
      const n1 = 'node_h1_' + Date.now();
      const n2 = 'node_h2_' + Date.now();
      const n3 = 'node_h3_' + Date.now();
      const n4 = 'node_h4_' + Date.now();
      const n5 = 'node_h5_' + Date.now();
      const n6 = 'node_h6_' + Date.now();

      return {
        id: 'wf_' + Date.now(),
        name: 'Cloudflare / API Health Probe & Alert Router',
        description: 'Automated health check and incident notification pipeline',
        variables: { onCallEngineer: 'sre-alerts@flowpilot.dev' },
        nodes: [
          {
            id: n1,
            type: 'schedule',
            title: '5-Second Cron Poll',
            position: { x: 80, y: 180 },
            configuration: { intervalValue: 5, intervalUnit: 'seconds' }
          },
          {
            id: n2,
            type: 'http_request',
            title: 'GET /v1/health',
            position: { x: 380, y: 180 },
            configuration: {
              method: 'GET',
              url: 'https://api.flowpilot.dev/v1/health',
              mode: 'simulate',
              simulatedStatus: 200,
              simulatedLatency: 75,
              body: '{\n  "status": "healthy",\n  "latencyMs": 38,\n  "dbConnections": 24,\n  "cacheHitRatio": "98.4%"\n}'
            }
          },
          {
            id: n3,
            type: 'condition',
            title: 'status == "healthy"?',
            position: { x: 680, y: 180 },
            configuration: {
              rules: [{ field: 'status', operator: 'equals', value: 'healthy' }]
            }
          },
          {
            id: n4,
            type: 'notification',
            title: 'Healthy Probe Toast',
            position: { x: 980, y: 100 },
            configuration: {
              channel: 'toast',
              severity: 'success',
              title: 'API Status Normal',
              message: 'Probe OK • Latency: {{$input.latencyMs}}ms • Cache: {{$input.cacheHitRatio}}'
            }
          },
          {
            id: n5,
            type: 'email',
            title: 'Alert SRE Team',
            position: { x: 980, y: 280 },
            configuration: {
              to: 'sre-alerts@flowpilot.dev',
              subject: '🚨 CRITICAL: Health Probe Failed',
              body: 'Emergency Alert:\nHealth probe returned degraded status.\nTimestamp: {{new Date().toISOString()}}'
            }
          },
          {
            id: n6,
            type: 'output',
            title: 'Health Log Sink',
            position: { x: 1280, y: 180 },
            configuration: { outputName: 'health_probe_log' }
          }
        ],
        connections: [
          { id: 'c1', fromNodeId: n1, fromPortId: 'output', toNodeId: n2, toPortId: 'input' },
          { id: 'c2', fromNodeId: n2, fromPortId: 'output', toNodeId: n3, toPortId: 'input' },
          { id: 'c3', fromNodeId: n3, fromPortId: 'true', toNodeId: n4, toPortId: 'input' },
          { id: 'c4', fromNodeId: n3, fromPortId: 'false', toNodeId: n5, toPortId: 'input' },
          { id: 'c5', fromNodeId: n4, fromPortId: 'output', toNodeId: n6, toPortId: 'input' },
          { id: 'c6', fromNodeId: n5, fromPortId: 'output', toNodeId: n6, toPortId: 'input' }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  },

  {
    id: 'tpl_lead_scoring',
    name: 'Inbound Lead Qualification & CRM Scoring',
    category: 'Sales Automation',
    badge: 'CRM',
    description: 'Score inbound corporate leads based on budget, company size, and domain validity. Routes enterprise leads directly to Account Executives.',
    createWorkflow() {
      const n1 = 'node_l1_' + Date.now();
      const n2 = 'node_l2_' + Date.now();
      const n3 = 'node_l3_' + Date.now();
      const n4 = 'node_l4_' + Date.now();
      const n5 = 'node_l5_' + Date.now();

      return {
        id: 'wf_' + Date.now(),
        name: 'Inbound Lead Qualification & CRM Scoring',
        description: 'Automated sales lead qualification and scoring pipeline',
        variables: { minScore: 75 },
        nodes: [
          {
            id: n1,
            type: 'trigger',
            title: 'Inbound Contact Form',
            position: { x: 80, y: 180 },
            configuration: {
              samplePayload: JSON.stringify({
                leadName: 'David Kim',
                email: 'd.kim@enterprise-scale.io',
                companySize: '500-1000',
                budget: '$50k+',
                interest: 'Enterprise Platform Tier'
              }, null, 2)
            }
          },
          {
            id: n2,
            type: 'transform',
            title: 'Compute Lead Score',
            position: { x: 380, y: 180 },
            configuration: {
              code: `let score = 50;\nif ($input.budget === '$50k+') score += 30;\nif ($input.companySize === '500-1000') score += 15;\nreturn {\n  ...$input,\n  leadScore: score,\n  qualified: score >= 75,\n  priorityTier: score >= 80 ? 'P1 Urgent' : 'P2 Standard'\n};`
            }
          },
          {
            id: n3,
            type: 'condition',
            title: 'Qualified (Score >= 75)?',
            position: { x: 680, y: 180 },
            configuration: {
              rules: [{ field: 'qualified', operator: 'equals', value: 'true' }]
            }
          },
          {
            id: n4,
            type: 'notification',
            title: 'Hot Lead Slack Alert',
            position: { x: 980, y: 100 },
            configuration: {
              severity: 'success',
              title: '🔥 Hot Lead Qualified!',
              message: 'Lead {{$input.leadName}} (Score: {{$input.leadScore}} • {{$input.priorityTier}}) ready for AE outreach.'
            }
          },
          {
            id: n5,
            type: 'output',
            title: 'Qualified Leads Sink',
            position: { x: 1280, y: 180 },
            configuration: { outputName: 'leads_export' }
          }
        ],
        connections: [
          { id: 'c1', fromNodeId: n1, fromPortId: 'output', toNodeId: n2, toPortId: 'input' },
          { id: 'c2', fromNodeId: n2, fromPortId: 'output', toNodeId: n3, toPortId: 'input' },
          { id: 'c3', fromNodeId: n3, fromPortId: 'true', toNodeId: n4, toPortId: 'input' },
          { id: 'c4', fromNodeId: n4, fromPortId: 'output', toNodeId: n5, toPortId: 'input' },
          { id: 'c5', fromNodeId: n3, fromPortId: 'false', toNodeId: n5, toPortId: 'input' }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  }
];
