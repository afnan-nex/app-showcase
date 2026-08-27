/**
 * DevBench - Tool Registry & UI View Renderer
 * Defines metadata, options, realistic presets, and interactive UI for all 20 developer utilities.
 */

import { getIcon, escapeHTML } from './icons.js';
import { addToolHistory, getToolHistory, saveSnippet, getSavedSnippets } from './storage.js';

// Import tool algorithms
import { formatJSON, validateJSON, buildJSONTreeHTML } from './tools/json-tools.js';
import { encodeBase64, decodeBase64, base64ToHex, hexToBase64, encodeURL, decodeURL, encodeHTMLEntities, decodeHTMLEntities } from './tools/encoding-tools.js';
import { decodeJWT, generateHashes, generateUUID, generateBulkUUIDs } from './tools/security-tools.js';
import { testRegex, computeTextDiff, sortLines, removeDuplicateLines, cleanWhitespace, convertCase, REGEX_PRESETS } from './tools/text-tools.js';
import { parseURL, rebuildURL, executeHTTPRequest, generateCurlCommand, generateFetchSnippet } from './tools/network-tools.js';
import { convertTimestamp, parseAndConvertColor, generateLorem, generateMockUsers, generateMockOrders, generateMockLogs, generateMockKubernetes } from './tools/conversion-tools.js';

export const TOOL_CATEGORIES = {
  JSON_DATA: 'JSON & Data',
  ENCODING_SEC: 'Encoding & Security',
  TEXT_CODE: 'Text & Code',
  NETWORK_API: 'Network & API',
  CONVERTERS: 'Converters & Generation'
};

export const TOOLS = [
  // 1. JSON Formatter
  {
    id: 'json-formatter',
    title: 'JSON Formatter',
    category: TOOL_CATEGORIES.JSON_DATA,
    icon: 'json',
    desc: 'Format, indent, sort keys, remove nulls, and minify JSON payloads',
    presets: [
      {
        name: 'Microservice Config',
        value: JSON.stringify({
          service: 'auth-gateway-v2',
          cluster: 'us-east-prod',
          port: 8443,
          tls: { enabled: true, minVersion: 'TLSv1.3' },
          rateLimiting: { maxRequestsPerMin: 1200, burst: 50 },
          redis: { host: 'redis-sentinel.internal', port: 6379, poolSize: 20 },
          features: { mfaRequired: true, passkeys: true, legacyAuth: false },
          metadata: { version: '2.4.0', deployedAt: '2026-08-28T00:00:00Z', nullFlag: null }
        }, null, 2)
      },
      {
        name: 'Stripe Webhook Event',
        value: JSON.stringify({
          id: 'evt_1O8x722eZvKYlo2CLp99',
          object: 'event',
          api_version: '2024-06-20',
          created: 1724800000,
          type: 'invoice.payment_succeeded',
          data: {
            object: {
              id: 'in_1O8x722eZvKYlo2C8892',
              customer: 'cus_Q89214710',
              amount_paid: 14900,
              currency: 'usd',
              status: 'paid'
            }
          }
        }, null, 2)
      },
      {
        name: 'GeoJSON Feature',
        value: JSON.stringify({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: { type: 'Point', coordinates: [-122.4194, 37.7749] },
              properties: { name: 'San Francisco Datacenter DC-1', region: 'us-west-1', active: true }
            }
          ]
        }, null, 2)
      }
    ],
    sample: JSON.stringify({
      service: 'auth-gateway-v2',
      cluster: 'us-east-prod',
      port: 8443,
      tls: { enabled: true, minVersion: 'TLSv1.3' },
      rateLimiting: { maxRequestsPerMin: 1200, burst: 50 },
      redis: { host: 'redis-sentinel.internal', port: 6379, poolSize: 20 },
      features: { mfaRequired: true, passkeys: true, legacyAuth: false },
      metadata: { version: '2.4.0', deployedAt: '2026-08-28T00:00:00Z', nullFlag: null }
    }, null, 2),
    render: renderJSONFormatter
  },

  // 2. JSON Validator
  {
    id: 'json-validator',
    title: 'JSON Validator',
    category: TOOL_CATEGORIES.JSON_DATA,
    icon: 'json',
    desc: 'Syntax validation with exact line/column indicators and error pointers',
    presets: [
      {
        name: 'Valid Payload',
        value: JSON.stringify({
          event: 'deployment.success',
          commit: '7b566580c0814ba2',
          author: 'Alex Vance <alex.vance@enterprise.dev>',
          environment: 'production',
          containers: ['auth-svc', 'billing-processor', 'worker-queue'],
          replicas: 6
        }, null, 2)
      },
      {
        name: 'Error: Trailing Comma',
        value: '{\n  "service": "auth-api",\n  "port": 8080,\n  "endpoints": [\n    "/login",\n    "/signup",\n  ]\n}'
      },
      {
        name: 'Error: Unquoted Key',
        value: '{\n  name: "DevBench",\n  "version": 1.0\n}'
      },
      {
        name: 'Error: Single Quotes',
        value: "{\n  'auth': 'bearer-token',\n  'active': true\n}"
      }
    ],
    sample: '{\n  "service": "auth-api",\n  "port": 8080,\n  "endpoints": [\n    "/login",\n    "/signup",\n  ]\n}',
    render: renderJSONValidator
  },

  // 3. JSON Tree Viewer
  {
    id: 'json-tree',
    title: 'JSON Tree Viewer',
    category: TOOL_CATEGORIES.JSON_DATA,
    icon: 'tree',
    desc: 'Interactive collapsible AST tree with type chips, node search, and path copy',
    presets: [
      {
        name: 'Kubernetes Pod Spec',
        value: JSON.stringify({
          apiVersion: 'v1',
          kind: 'Pod',
          metadata: {
            name: 'auth-gateway-78f99c-w2x8q',
            namespace: 'production',
            labels: { app: 'auth-gateway', tier: 'api' }
          },
          spec: {
            containers: [
              {
                name: 'gateway',
                image: 'registry.enterprise.dev/auth/gateway:v2.4.0',
                ports: [{ containerPort: 8443, protocol: 'TCP' }],
                resources: { limits: { cpu: '1000m', memory: '512Mi' }, requests: { cpu: '250m', memory: '128Mi' } }
              }
            ],
            restartPolicy: 'Always'
          }
        }, null, 2)
      },
      {
        name: 'User Claims & Roles',
        value: JSON.stringify({
          user: {
            id: 'usr_89214',
            profile: {
              name: 'Elena Rostova',
              title: 'Principal Cloud Architect',
              department: 'Infrastructure & Security',
              roles: ['admin', 'security-auditor', 'billing-manager'],
              mfa: { hardwareToken: true, passkeysCount: 2 }
            },
            teams: ['core-infra', 'incident-response'],
            activeSessions: 3
          }
        }, null, 2)
      }
    ],
    sample: JSON.stringify({
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: {
        name: 'auth-gateway-78f99c-w2x8q',
        namespace: 'production',
        labels: { app: 'auth-gateway', tier: 'api' }
      },
      spec: {
        containers: [
          {
            name: 'gateway',
            image: 'registry.enterprise.dev/auth/gateway:v2.4.0',
            ports: [{ containerPort: 8443, protocol: 'TCP' }],
            resources: { limits: { cpu: '1000m', memory: '512Mi' }, requests: { cpu: '250m', memory: '128Mi' } }
          }
        ],
        restartPolicy: 'Always'
      }
    }, null, 2),
    render: renderJSONTreeViewer
  },

  // 4. Base64 Encoder/Decoder
  {
    id: 'base64',
    title: 'Base64 Encode/Decode',
    category: TOOL_CATEGORIES.ENCODING_SEC,
    icon: 'base64',
    desc: 'UTF-8 safe Base64 encoder, decoder, URL-safe mode, and file data URLs',
    presets: [
      {
        name: 'Basic Auth Header',
        value: 'api_client_id:sec_k98234jhl23k4jhk234j5h2345'
      },
      {
        name: 'UTF-8 & Symbols',
        value: 'DevBench ⚡ Developer Workstation — High-throughput telemetry & UTF-8 symbols (こんにちは / Привет / 🚀)'
      },
      {
        name: 'JSON Config String',
        value: '{"env":"production","apiRateLimit":5000,"sslVerify":true}'
      }
    ],
    sample: 'DevBench ⚡ Developer Workstation — High-throughput telemetry & UTF-8 symbols (こんにちは / Привет / 🚀)',
    render: renderBase64
  },

  // 5. URL Encoder/Decoder
  {
    id: 'url-encode',
    title: 'URL Encode/Decode',
    category: TOOL_CATEGORIES.ENCODING_SEC,
    icon: 'url',
    desc: 'Encode and decode query strings, form data, and URI components',
    presets: [
      {
        name: 'OAuth2 Authorize Request',
        value: 'https://auth.acme-cloud.io/oauth/v2/authorize?client_id=devbench_app&response_type=code&scope=openid profile email repo:read&redirect_uri=https://devbench.local/callback&state=sec_98124&code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM'
      },
      {
        name: 'Search Filter Query',
        value: 'query=developer workstation & utilities&tags=json,jwt,diff,regex&sort=created_at desc&limit=50'
      }
    ],
    sample: 'https://auth.acme-cloud.io/oauth/v2/authorize?client_id=devbench_app&response_type=code&scope=openid profile email repo:read&redirect_uri=https://devbench.local/callback&state=sec_98124&code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
    render: renderURLEncode
  },

  // 6. JWT Decoder
  {
    id: 'jwt-decoder',
    title: 'JWT Decoder',
    category: TOOL_CATEGORIES.ENCODING_SEC,
    icon: 'jwt',
    desc: 'Decode JSON Web Token header, payload claims, and expiration timestamps',
    presets: [
      {
        name: 'Admin Access Token (Valid)',
        value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2F1dGguZXJhc3Rlcmlzay5kZXYiLCJzdWIiOiJ1c3JfODkyMTQiLCJhdWQiOlsiYXBpLmVudGVycHJpc2UuZGV2Il0sIm5hbWUiOiJFbGVuYSBSb3N0b3ZhIiwicm9sZXMiOlsicGxhdGZvcm0tYWRtaW4iLCJiaWxsaW5nLW1hbmFnZXIiXSwiaWF0IjoxNzI0ODAwMDAwLCJleHAiOjE3ODc4NzIwMDB9.d7c1Kpw8s4x-9Yf3QJ8nO2_vK7b38Vz2m9X1'
      },
      {
        name: 'Service Account Token',
        value: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImF1dGgta2V5LTIwMjYifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJzdWIiOiJzZXJ2aWNlLWFjY291bnRAcHJvamVjdC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsImF1ZCI6Imh0dHBzOi8vYXBpLmdvb2dsZWFwaXMuY29tL29hdXRoMi92NC90b2tlbiIsImlhdCI6MTcyNDgwMDAwMCwiZXhwIjoxNzg3ODcyMDAwfQ.dummy'
      },
      {
        name: 'Expired Session Token',
        value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfMTAwMSIsIm5hbWUiOiJNYXJjdXMgVmFuY2UiLCJyb2xlIjoiZGV2ZWxvcGVyIiwiaWF0IjoxNTAwMDAwMDAwLCJleHAiOjE1MDAwMDM2MDB9.dummy'
      }
    ],
    sample: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2F1dGguZXJhc3Rlcmlzay5kZXYiLCJzdWIiOiJ1c3JfODkyMTQiLCJhdWQiOlsiYXBpLmVudGVycHJpc2UuZGV2Il0sIm5hbWUiOiJFbGVuYSBSb3N0b3ZhIiwicm9sZXMiOlsicGxhdGZvcm0tYWRtaW4iLCJiaWxsaW5nLW1hbmFnZXIiXSwiaWF0IjoxNzI0ODAwMDAwLCJleHAiOjE3ODc4NzIwMDB9.d7c1Kpw8s4x-9Yf3QJ8nO2_vK7b38Vz2m9X1',
    render: renderJWTDecoder
  },

  // 7. UUID / ID Generator
  {
    id: 'uuid-gen',
    title: 'UUID / ID Generator',
    category: TOOL_CATEGORIES.ENCODING_SEC,
    icon: 'uuid',
    desc: 'Generate UUID v4, v7 draft, ULID, NanoID, and bulk identifier lists',
    presets: [],
    sample: '',
    render: renderUUIDGenerator
  },

  // 8. Timestamp Converter
  {
    id: 'timestamp-converter',
    title: 'Timestamp Converter',
    category: TOOL_CATEGORIES.CONVERTERS,
    icon: 'timestamp',
    desc: 'Convert Unix epoch seconds, milliseconds, ISO 8601, and local DateTime',
    presets: [
      { name: 'Current Time (Now)', value: 'now' },
      { name: 'Start of Today (00:00 UTC)', value: new Date(new Date().setUTCHours(0,0,0,0)).toISOString() },
      { name: 'Year 2038 Bug Boundary', value: '2147483647' },
      { name: 'Unix Epoch 1.8 Billion', value: '1800000000' }
    ],
    sample: 'now',
    render: renderTimestampConverter
  },

  // 9. Regex Tester
  {
    id: 'regex-tester',
    title: 'Regex Tester',
    category: TOOL_CATEGORIES.TEXT_CODE,
    icon: 'regex',
    desc: 'Test regular expressions with real-time match highlights, capture groups, and replace preview',
    presets: REGEX_PRESETS,
    sample: 'Contact security@enterprise.dev or operations.lead@cloud-infra.io for escalation.',
    render: renderRegexTester
  },

  // 10. Text Diff Viewer
  {
    id: 'text-diff',
    title: 'Text Diff Viewer',
    category: TOOL_CATEGORIES.TEXT_CODE,
    icon: 'diff',
    desc: 'Line-by-line comparison highlighting additions, deletions, and modifications',
    presets: [
      {
        name: 'TypeScript Service Refactor',
        orig: `export class BillingService {
  async processPayment(customerId: string, amount: number) {
    const customer = await db.customers.findById(customerId);
    if (!customer) throw new Error('Customer not found');
    const result = await stripe.charges.create({
      amount,
      currency: 'usd',
      customer: customer.stripeId
    });
    return result;
  }
}`,
        mod: `export class BillingService {
  async processPayment(customerId: string, amount: number, idempotencyKey?: string) {
    const customer = await db.customers.findById(customerId);
    if (!customer || !customer.isActive) {
      throw new Error('Customer not eligible for billing');
    }
    const result = await stripe.charges.create({
      amount,
      currency: 'usd',
      customer: customer.stripeId
    }, { idempotencyKey });
    await telemetry.recordTransaction(customerId, amount);
    return result;
  }
}`
      },
      {
        name: 'Docker Multi-Stage Optimization',
        orig: `FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "server.js"]`,
        mod: `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./
USER node
CMD ["node", "server.js"]`
      }
    ],
    sample: `export class BillingService {
  async processPayment(customerId: string, amount: number) {
    const customer = await db.customers.findById(customerId);
    if (!customer) throw new Error('Customer not found');
    const result = await stripe.charges.create({
      amount,
      currency: 'usd',
      customer: customer.stripeId
    });
    return result;
  }
}`,
    sampleModified: `export class BillingService {
  async processPayment(customerId: string, amount: number, idempotencyKey?: string) {
    const customer = await db.customers.findById(customerId);
    if (!customer || !customer.isActive) {
      throw new Error('Customer not eligible for billing');
    }
    const result = await stripe.charges.create({
      amount,
      currency: 'usd',
      customer: customer.stripeId
    }, { idempotencyKey });
    await telemetry.recordTransaction(customerId, amount);
    return result;
  }
}`,
    render: renderTextDiff
  },

  // 11. Hash Generator
  {
    id: 'hash-gen',
    title: 'Hash Generator',
    category: TOOL_CATEGORIES.ENCODING_SEC,
    icon: 'hash',
    desc: 'Web Crypto SHA-256, SHA-384, SHA-512, SHA-1, MD5, CRC32, and HMAC checksums',
    presets: [
      { name: 'API Key Payload', value: 'sk_live_51O8x722eZvKYlo2CLp99824_sec_991823' },
      { name: 'Passphrase Verification', value: 'Correct-Horse-Battery-Staple-2026!' },
      { name: 'Git Tree Header', value: 'tree 138\x00100644 blob 7b566580c0814ba2910a README.md' }
    ],
    sample: 'sk_live_51O8x722eZvKYlo2CLp99824_sec_991823',
    render: renderHashGenerator
  },

  // 12. Color Converter & Palette
  {
    id: 'color-converter',
    title: 'Color & Contrast Inspector',
    category: TOOL_CATEGORIES.CONVERTERS,
    icon: 'color',
    desc: 'Convert HEX, RGB, HSL, HSV, CMYK and check WCAG contrast compliance',
    presets: [
      { name: 'Brand Primary Blue', value: '#3B82F6' },
      { name: 'Emerald Success', value: '#10B981' },
      { name: 'Amber Warning', value: '#F59E0B' },
      { name: 'Rose Error', value: '#EF4444' },
      { name: 'Indigo Accent', value: '#6366F1' },
      { name: 'Slate Dark Neutral', value: '#0F172A' }
    ],
    sample: '#3B82F6',
    render: renderColorConverter
  },

  // 13. HTML Entity Encoder
  {
    id: 'html-entities',
    title: 'HTML Entity Encoder',
    category: TOOL_CATEGORIES.ENCODING_SEC,
    icon: 'html',
    desc: 'Encode and decode named (&amp;), decimal, and hex HTML entities',
    presets: [
      { name: 'XSS Attack Mitigation Sample', value: '<script>alert("XSS & CSRF Attack Detected");</script><img src="x" onerror="stealCookies()">' },
      { name: 'HTML5 Template Tags', value: '<article class="post-card" data-author="Alex & Sarah">\n  <h2>Developer Workstation &trade;</h2>\n  <p>Cost: &euro;499 &bull; Rating: 5/5 &copy; 2026</p>\n</article>' }
    ],
    sample: '<script>alert("XSS & CSRF Attack Detected");</script><img src="x" onerror="stealCookies()">',
    render: renderHTMLEntities
  },

  // 14. URL Parser
  {
    id: 'url-parser',
    title: 'URL & Query Parser',
    category: TOOL_CATEGORIES.NETWORK_API,
    icon: 'url',
    desc: 'Inspect protocol, host, port, and live two-way query parameters table',
    presets: [
      { name: 'GitHub REST API Pulls', value: 'https://api.github.com:443/repos/devbench/core/pulls?state=open&sort=created&direction=desc&page=1&per_page=30#review-queue' },
      { name: 'Stripe Checkout Session', value: 'https://checkout.stripe.com/pay/cs_live_a1b2c3d4?locale=en-US&client_reference_id=usr_89124&source=dashboard#step-payment' }
    ],
    sample: 'https://api.github.com:443/repos/devbench/core/pulls?state=open&sort=created&direction=desc&page=1&per_page=30#review-queue',
    render: renderURLParser
  },

  // 15. HTTP Request Builder & Simulator
  {
    id: 'http-builder',
    title: 'HTTP Request Builder',
    category: TOOL_CATEGORIES.NETWORK_API,
    icon: 'http',
    desc: 'Construct API requests with custom headers/body, live fetch, simulated offline mock, and cURL export',
    presets: [
      { name: 'GET User Profile Endpoint', method: 'GET', url: 'https://jsonplaceholder.typicode.com/users/1', body: '' },
      { name: 'POST Create Deployment Record', method: 'POST', url: 'https://jsonplaceholder.typicode.com/posts', body: '{\n  "service": "auth-gateway",\n  "environment": "production",\n  "replicas": 4\n}' }
    ],
    sample: 'https://jsonplaceholder.typicode.com/users/1',
    render: renderHTTPBuilder
  },

  // 16. Lorem / Mock Data Generator
  {
    id: 'mock-generator',
    title: 'Lorem & Mock Generator',
    category: TOOL_CATEGORIES.CONVERTERS,
    icon: 'lorem',
    desc: 'Generate Lorem Ipsum copy and structured mock JSON user, order, and telemetry datasets',
    presets: [],
    sample: '',
    render: renderMockGenerator
  },

  // 17. Case Converter
  {
    id: 'case-converter',
    title: 'Case Converter',
    category: TOOL_CATEGORIES.TEXT_CODE,
    icon: 'case',
    desc: 'Convert between camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, and Title Case',
    presets: [
      { name: 'Authentication Token Variable', value: 'user_authentication_session_token_v2' },
      { name: 'Billing Calculation Method', value: 'calculateMonthlySubscriptionCostWithTax' },
      { name: 'Database Connection Constant', value: 'DATABASE_MAX_CONNECTION_POOL_SIZE' }
    ],
    sample: 'user_authentication_session_token_v2',
    render: renderCaseConverter
  },

  // 18. Line Sorter
  {
    id: 'line-sorter',
    title: 'Line Sorter',
    category: TOOL_CATEGORIES.TEXT_CODE,
    icon: 'sort',
    desc: 'Sort text lines alphabetically (A-Z, Z-A), natural numbers, length, or shuffle',
    presets: [
      { name: 'Dependencies List', value: '@aws-sdk/client-s3\n@types/node\naxios\nexpress\nhelmet\nzod\nprisma\nwinston\nredis' },
      { name: 'Unsorted Hostnames & IPs', value: '192.168.1.100\n10.0.4.12\n192.168.1.2\n10.0.1.5\n172.16.0.40\n192.168.1.20' }
    ],
    sample: '@aws-sdk/client-s3\n@types/node\naxios\nexpress\nhelmet\nzod\nprisma\nwinston\nredis',
    render: renderLineSorter
  },

  // 19. Duplicate Line Remover
  {
    id: 'duplicate-remover',
    title: 'Duplicate Line Remover',
    category: TOOL_CATEGORIES.TEXT_CODE,
    icon: 'dedup',
    desc: 'Deduplicate lines with case-sensitive toggle, whitespace trimming, and duplicate counts',
    presets: [
      { name: 'Access Log IP Addresses', value: '192.0.2.45\n198.51.100.12\n192.0.2.45\n203.0.113.88\n198.51.100.12\n10.0.4.19\n192.0.2.45' },
      { name: 'Environment Variables Overrides', value: 'PORT=8080\nNODE_ENV=production\nLOG_LEVEL=info\nPORT=3000\nREDIS_HOST=localhost\nLOG_LEVEL=debug' }
    ],
    sample: '192.0.2.45\n198.51.100.12\n192.0.2.45\n203.0.113.88\n198.51.100.12\n10.0.4.19\n192.0.2.45',
    render: renderDuplicateRemover
  },

  // 20. Whitespace Cleaner
  {
    id: 'whitespace-cleaner',
    title: 'Whitespace Cleaner',
    category: TOOL_CATEGORIES.TEXT_CODE,
    icon: 'clean',
    desc: 'Trim trailing spaces, collapse multiple spaces, tab-to-space, and normalize line endings',
    presets: [
      { name: 'Messy Indented Snippet', value: '   function computeTelemetry(data) {   \n\n\n\tlet sum = 0;   \n\tfor (let i = 0; i < data.length; i++) {   \n\t\tsum += data[i].latency;    \n\t}   \n\n\treturn sum;   \n   }   \n' }
    ],
    sample: '   function computeTelemetry(data) {   \n\n\n\tlet sum = 0;   \n\tfor (let i = 0; i < data.length; i++) {   \n\t\tsum += data[i].latency;    \n\t}   \n\n\treturn sum;   \n   }   \n',
    render: renderWhitespaceCleaner
  }
];

export function getToolById(id) {
  return TOOLS.find(t => t.id === id) || TOOLS[0];
}

// --- Common UI Shell Helper ---
function createSplitToolShell({ tool, toolbarHTML = '', showPresets = true }) {
  let presetsHTML = '';
  if (showPresets && tool.presets && tool.presets.length > 0) {
    presetsHTML = `
      <div class="presets-selector-group flex items-center gap-2">
        <label class="opt-label text-xs font-semibold text-muted" for="tool-preset-select">Preset:</label>
        <select id="tool-preset-select" class="form-control form-control-sm" aria-label="Select sample preset">
          ${tool.presets.map((p, idx) => `<option value="${idx}">${escapeHTML(p.name)}</option>`).join('')}
        </select>
      </div>
    `;
  }

  return `
    <div class="tool-workspace" data-tool-id="${tool.id}">
      <!-- Tool Header Bar -->
      <header class="tool-header">
        <div class="tool-title-group">
          <div class="tool-icon-box" aria-hidden="true">${getIcon(tool.icon, 'icon-md')}</div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="tool-title">${tool.title}</h1>
              <span class="badge badge-secondary font-mono text-xs">${tool.category}</span>
            </div>
            <p class="tool-desc">${tool.desc}</p>
          </div>
        </div>
        <div class="tool-header-actions">
          <button class="btn btn-sm btn-ghost btn-fav-toggle" data-id="${tool.id}" title="Toggle Favorite (Pinned in Sidebar)" aria-label="Toggle Favorite">
            ${getIcon('star', 'icon-sm')}
          </button>
          <button class="btn btn-sm btn-ghost btn-open-history" data-id="${tool.id}" title="View Input History" aria-label="View History">
            ${getIcon('history', 'icon-sm')} History
          </button>
          <button class="btn btn-sm btn-ghost btn-save-snippet" data-id="${tool.id}" title="Save as Snippet" aria-label="Save Snippet">
            ${getIcon('bookmark', 'icon-sm')} Snippet
          </button>
        </div>
      </header>

      <!-- Tool Options / Action Bar -->
      <div class="tool-options-bar">
        ${presetsHTML}
        ${toolbarHTML}
      </div>

      <!-- Main Work Area -->
      <div class="tool-main-area" id="tool-main-content"></div>

      <!-- Live Status Bar -->
      <footer class="tool-status-bar">
        <div class="status-item font-mono text-xs" id="status-lines-chars">Lines: 0 &bull; Chars: 0 &bull; Size: 0 B</div>
        <div class="status-item font-mono text-xs flex items-center gap-2">
          <span id="status-timing">Ready</span>
          <span class="badge badge-secondary font-mono text-xs">Offline Safe</span>
        </div>
      </footer>
    </div>
  `;
}

function updateStatusBar(container, text, execTimeMs = null) {
  const str = String(text || '');
  const lines = str ? str.split('\n').length : 0;
  const chars = str ? str.length : 0;
  const bytes = str ? new Blob([str]).size : 0;

  const lcEl = container.querySelector('#status-lines-chars');
  if (lcEl) {
    lcEl.innerHTML = `Lines: <strong>${lines}</strong> &bull; Chars: <strong>${chars}</strong> &bull; Size: <strong>${formatBytes(bytes)}</strong>`;
  }

  const timingEl = container.querySelector('#status-timing');
  if (timingEl && execTimeMs !== null) {
    timingEl.textContent = `Executed in ${execTimeMs}ms`;
  }
}

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function showToast(message, type = 'info') {
  window.dispatchEvent(new CustomEvent('SHOW_TOAST', { detail: { message, type } }));
}

function copyToClipboard(text, btnElement) {
  if (!text) {
    showToast('Nothing to copy', 'warning');
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied ${formatBytes(new Blob([text]).size)} to clipboard`, 'success');
    if (btnElement) {
      const originalHTML = btnElement.innerHTML;
      btnElement.innerHTML = `${getIcon('check', 'icon-xs')} Copied!`;
      btnElement.classList.add('btn-success-flash');
      setTimeout(() => {
        btnElement.innerHTML = originalHTML;
        btnElement.classList.remove('btn-success-flash');
      }, 1600);
    }
  }).catch(() => {
    // Fallback prompt
    showToast('Clipboard access unavailable. Text selected for manual copy.', 'warning');
  });
}

function downloadTextFile(filename, text, mimeType = 'text/plain;charset=utf-8') {
  if (!text) {
    showToast('No content to download', 'warning');
    return;
  }
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`Downloaded ${filename}`, 'success');
}

function setupFileDrop(element, onFileContent) {
  if (!element) return;
  element.addEventListener('dragover', (e) => {
    e.preventDefault();
    element.classList.add('drag-over');
  });
  element.addEventListener('dragleave', () => {
    element.classList.remove('drag-over');
  });
  element.addEventListener('drop', (e) => {
    e.preventDefault();
    element.classList.remove('drag-over');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        onFileContent(evt.target.result, file.name);
        showToast(`Loaded ${file.name} (${formatBytes(file.size)})`, 'info');
      };
      reader.readAsText(file);
    }
  });
}

function attachStandardToolbarEvents(container, tool, onPresetChange = null) {
  // Favorite toggle
  container.querySelector('.btn-fav-toggle')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('TOGGLE_FAVORITE', { detail: { toolId: tool.id } }));
  });

  // History trigger
  container.querySelector('.btn-open-history')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('OPEN_HISTORY_DRAWER', { detail: { toolId: tool.id } }));
  });

  // Save Snippet trigger
  container.querySelector('.btn-save-snippet')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('OPEN_SAVE_SNIPPET_MODAL', { detail: { toolId: tool.id } }));
  });

  // Preset selector
  if (onPresetChange) {
    const presetSelect = container.querySelector('#tool-preset-select');
    presetSelect?.addEventListener('change', (e) => {
      const idx = parseInt(e.target.value, 10);
      if (tool.presets && tool.presets[idx]) {
        onPresetChange(tool.presets[idx]);
      }
    });
  }
}

// ==========================================
// 1. JSON FORMATTER
// ==========================================
function renderJSONFormatter(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group flex items-center gap-2">
        <label class="opt-label text-xs font-semibold text-muted" for="json-opt-indent">Indent:</label>
        <select id="json-opt-indent" class="form-control form-control-sm">
          <option value="2">2 Spaces</option>
          <option value="4">4 Spaces</option>
          <option value="tab">Tabs</option>
          <option value="0">Minify (0)</option>
        </select>
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="json-opt-sort" /> Sort Keys
        </label>
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="json-opt-nulls" /> Remove Nulls
        </label>
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="json-opt-unicode" /> Escape Unicode
        </label>
      </div>
      <div class="actions-group flex items-center gap-2">
        <button class="btn btn-sm btn-primary" id="btn-format-json" title="Format JSON (Ctrl+Enter)">
          ${getIcon('play', 'icon-xs')} Format
        </button>
        <button class="btn btn-sm btn-secondary" id="btn-copy-json" title="Copy Output">
          ${getIcon('copy', 'icon-xs')} Copy
        </button>
        <button class="btn btn-sm btn-secondary" id="btn-download-json" title="Download formatted JSON">
          ${getIcon('download', 'icon-xs')} Download
        </button>
        <button class="btn btn-sm btn-ghost" id="btn-clear-json" title="Clear Editor">
          ${getIcon('trash', 'icon-xs')} Clear
        </button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="split-pane-layout">
      <div class="pane-column">
        <div class="pane-header">
          <span class="pane-title text-xs font-semibold">JSON Input</span>
          <span class="text-xs text-muted font-mono">Drop .json files here</span>
        </div>
        <textarea id="json-input" class="code-editor font-mono" placeholder="Paste unformatted JSON or drop a .json file here..." spellcheck="false"></textarea>
      </div>
      <div class="pane-column">
        <div class="pane-header">
          <span class="pane-title text-xs font-semibold">Formatted Output</span>
          <span id="json-meta-badge" class="badge badge-secondary font-mono text-xs">Ready</span>
        </div>
        <div id="json-error-banner" class="editor-error-banner" style="display: none;"></div>
        <textarea id="json-output" class="code-editor font-mono" readonly placeholder="Formatted output will appear here..." spellcheck="false"></textarea>
      </div>
    </div>
  `;

  const inputEl = container.querySelector('#json-input');
  const outputEl = container.querySelector('#json-output');
  const errorEl = container.querySelector('#json-error-banner');
  const badgeEl = container.querySelector('#json-meta-badge');
  const indentEl = container.querySelector('#json-opt-indent');
  const sortEl = container.querySelector('#json-opt-sort');
  const nullsEl = container.querySelector('#json-opt-nulls');
  const unicodeEl = container.querySelector('#json-opt-unicode');

  function runFormat() {
    const start = performance.now();
    const result = formatJSON(inputEl.value, {
      indent: indentEl.value,
      sortKeys: sortEl.checked,
      removeNulls: nullsEl.checked,
      escapeUnicode: unicodeEl.checked
    });
    const duration = Math.round(performance.now() - start);

    if (result.success) {
      errorEl.style.display = 'none';
      outputEl.value = result.output;
      badgeEl.className = 'badge badge-success font-mono text-xs';
      badgeEl.textContent = `${result.lines} lines (${formatBytes(result.size)})`;
      updateStatusBar(container, result.output, duration);
      addToolHistory(tool.id, inputEl.value);
    } else {
      errorEl.style.display = 'block';
      badgeEl.className = 'badge badge-danger font-mono text-xs';
      badgeEl.textContent = 'Syntax Error';
      errorEl.innerHTML = `
        <div class="flex items-center gap-2 font-bold text-rose">
          ${getIcon('alert', 'icon-xs')} JSON Parse Error
        </div>
        <div class="font-mono text-xs mt-1 text-secondary">${escapeHTML(result.error)}</div>
        ${result.errorPos?.line ? `<div class="text-xs text-rose font-mono mt-1">Error at Line ${result.errorPos.line}, Column ${result.errorPos.column}</div>` : ''}
        ${result.errorPos?.snippet ? `<pre class="error-code-snippet font-mono text-xs mt-2">${escapeHTML(result.errorPos.snippet)}</pre>` : ''}
      `;
      outputEl.value = '';
    }
  }

  container.querySelector('#btn-format-json').addEventListener('click', runFormat);
  inputEl.addEventListener('input', () => { updateStatusBar(container, inputEl.value); runFormat(); });
  indentEl.addEventListener('change', runFormat);
  sortEl.addEventListener('change', runFormat);
  nullsEl.addEventListener('change', runFormat);
  unicodeEl.addEventListener('change', runFormat);

  container.querySelector('#btn-copy-json').addEventListener('click', (e) => copyToClipboard(outputEl.value, e.currentTarget));
  container.querySelector('#btn-download-json').addEventListener('click', () => downloadTextFile('formatted.json', outputEl.value, 'application/json'));
  container.querySelector('#btn-clear-json').addEventListener('click', () => {
    inputEl.value = '';
    outputEl.value = '';
    errorEl.style.display = 'none';
    badgeEl.textContent = 'Cleared';
    updateStatusBar(container, '');
    showToast('JSON editor cleared', 'info');
  });

  setupFileDrop(inputEl, (content) => {
    inputEl.value = content;
    runFormat();
  });

  attachStandardToolbarEvents(container, tool, (preset) => {
    inputEl.value = preset.value;
    runFormat();
  });

  inputEl.value = tool.sample;
  runFormat();
}

// ==========================================
// 2. JSON VALIDATOR
// ==========================================
function renderJSONValidator(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="actions-group flex items-center gap-2">
        <button class="btn btn-sm btn-primary" id="btn-validate-json">${getIcon('check', 'icon-xs')} Validate Now</button>
        <button class="btn btn-sm btn-ghost" id="btn-clear-val">${getIcon('trash', 'icon-xs')} Clear</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="validator-layout flex flex-col flex-1">
      <div id="validator-status-card" class="card p-4 mb-4">
        <div class="text-muted text-sm">Enter JSON below to inspect syntax validity and structural metrics.</div>
      </div>
      <div class="form-group flex-1 flex flex-col">
        <label class="form-label font-semibold text-xs" for="val-input">Raw JSON Input</label>
        <textarea id="val-input" class="code-editor font-mono flex-1 min-h-80" placeholder="Paste JSON here to validate syntax, line numbers, and error positions..." spellcheck="false"></textarea>
      </div>
    </div>
  `;

  const inputEl = container.querySelector('#val-input');
  const statusEl = container.querySelector('#validator-status-card');

  function runValidation() {
    const val = validateJSON(inputEl.value);
    if (!inputEl.value.trim()) {
      statusEl.className = 'card p-4 mb-4';
      statusEl.innerHTML = `<div class="text-muted text-sm">Enter JSON below to perform syntax inspection.</div>`;
      updateStatusBar(container, '');
      return;
    }

    if (val.isValid) {
      statusEl.className = 'card p-4 mb-4 border-success bg-success-subtle';
      statusEl.innerHTML = `
        <div class="flex items-center gap-2 text-emerald font-semibold text-sm">
          ${getIcon('check', 'icon-sm')} Valid JSON Document
        </div>
        <div class="text-xs text-secondary mt-1">${val.message} &bull; Size: ${formatBytes(val.size)}</div>
      `;
    } else {
      statusEl.className = 'card p-4 mb-4 border-danger bg-danger-subtle';
      statusEl.innerHTML = `
        <div class="flex items-center gap-2 text-rose font-semibold text-sm">
          ${getIcon('alert', 'icon-sm')} Invalid JSON Syntax
        </div>
        <div class="text-xs text-primary font-mono mt-1">${escapeHTML(val.message)}</div>
        ${val.line ? `<div class="text-xs text-rose font-mono mt-1">Error detected at Line ${val.line}, Column ${val.column}</div>` : ''}
        ${val.snippet ? `<pre class="error-code-snippet font-mono text-xs mt-2">${escapeHTML(val.snippet)}</pre>` : ''}
      `;
    }
    updateStatusBar(container, inputEl.value);
    addToolHistory(tool.id, inputEl.value);
  }

  container.querySelector('#btn-validate-json').addEventListener('click', runValidation);
  inputEl.addEventListener('input', runValidation);
  container.querySelector('#btn-clear-val').addEventListener('click', () => { inputEl.value = ''; runValidation(); });

  setupFileDrop(inputEl, (content) => {
    inputEl.value = content;
    runValidation();
  });

  attachStandardToolbarEvents(container, tool, (preset) => {
    inputEl.value = preset.value;
    runValidation();
  });

  inputEl.value = tool.sample;
  runValidation();
}

// ==========================================
// 3. JSON TREE VIEWER
// ==========================================
function renderJSONTreeViewer(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group flex-1 flex items-center gap-2">
        <input type="text" id="tree-search" class="form-control form-control-sm" placeholder="Filter keys or values in tree..." aria-label="Search JSON tree" />
      </div>
      <div class="actions-group flex items-center gap-2">
        <button class="btn btn-sm btn-secondary" id="btn-expand-all">Expand All</button>
        <button class="btn btn-sm btn-secondary" id="btn-collapse-all">Collapse All</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="split-pane-layout">
      <div class="pane-column">
        <div class="pane-header"><span class="pane-title text-xs font-semibold">Raw JSON</span></div>
        <textarea id="tree-raw-input" class="code-editor font-mono" placeholder="Paste JSON here to explore AST tree..." spellcheck="false"></textarea>
      </div>
      <div class="pane-column">
        <div class="pane-header flex items-center justify-between">
          <span class="pane-title text-xs font-semibold">Interactive AST Tree</span>
          <span class="text-xs text-muted">Click key to copy path</span>
        </div>
        <div id="tree-view-render" class="tree-container font-mono text-sm"></div>
      </div>
    </div>
  `;

  const inputEl = container.querySelector('#tree-raw-input');
  const treeEl = container.querySelector('#tree-view-render');
  const searchEl = container.querySelector('#tree-search');

  function renderTree() {
    if (!inputEl.value.trim()) {
      treeEl.innerHTML = '<div class="text-muted p-4 text-xs">Enter valid JSON on the left to render the tree view.</div>';
      updateStatusBar(container, '');
      return;
    }
    try {
      const parsed = JSON.parse(inputEl.value);
      treeEl.innerHTML = buildJSONTreeHTML(parsed, searchEl.value.trim());

      // Toggle collapsible nodes
      treeEl.querySelectorAll('.tree-toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const node = btn.closest('.tree-collapsible');
          node?.classList.toggle('open');
        });
      });

      // Path copier
      treeEl.querySelectorAll('.tree-key').forEach(keyEl => {
        keyEl.addEventListener('click', () => {
          const path = keyEl.dataset.path;
          copyToClipboard(path, null);
          showToast(`Copied JSONPath: ${path}`, 'success');
        });
      });

      updateStatusBar(container, inputEl.value);
      addToolHistory(tool.id, inputEl.value);
    } catch (err) {
      treeEl.innerHTML = `<div class="p-4 text-rose text-xs">${getIcon('alert', 'icon-xs')} Invalid JSON: ${escapeHTML(err.message)}</div>`;
    }
  }

  inputEl.addEventListener('input', renderTree);
  searchEl.addEventListener('input', renderTree);

  container.querySelector('#btn-expand-all').addEventListener('click', () => {
    treeEl.querySelectorAll('.tree-collapsible').forEach(n => n.classList.add('open'));
  });
  container.querySelector('#btn-collapse-all').addEventListener('click', () => {
    treeEl.querySelectorAll('.tree-collapsible').forEach(n => n.classList.remove('open'));
  });

  setupFileDrop(inputEl, (content) => {
    inputEl.value = content;
    renderTree();
  });

  attachStandardToolbarEvents(container, tool, (preset) => {
    inputEl.value = preset.value;
    renderTree();
  });

  inputEl.value = tool.sample;
  renderTree();
}

// ==========================================
// 4. BASE64 ENCODER / DECODER
// ==========================================
function renderBase64(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group flex items-center gap-3">
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="b64-opt-urlsafe" /> URL-Safe (- and _)
        </label>
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="b64-opt-datauri" /> Data URI Header
        </label>
      </div>
      <div class="actions-group flex items-center gap-2">
        <button class="btn btn-sm btn-primary" id="btn-b64-encode">${getIcon('play', 'icon-xs')} Encode &rarr;</button>
        <button class="btn btn-sm btn-secondary" id="btn-b64-decode">&larr; Decode</button>
        <button class="btn btn-sm btn-secondary" id="btn-b64-swap">${getIcon('swap', 'icon-xs')} Swap</button>
        <button class="btn btn-sm btn-secondary" id="btn-b64-copy">${getIcon('copy', 'icon-xs')} Copy</button>
        <button class="btn btn-sm btn-ghost" id="btn-b64-clear">${getIcon('trash', 'icon-xs')} Clear</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="split-pane-layout">
      <div class="pane-column">
        <div class="pane-header"><span class="pane-title text-xs font-semibold">Plaintext / Decoded</span></div>
        <textarea id="b64-text-input" class="code-editor font-mono" placeholder="Type or paste plaintext to encode..." spellcheck="false"></textarea>
      </div>
      <div class="pane-column">
        <div class="pane-header"><span class="pane-title text-xs font-semibold">Base64 Encoded Output</span></div>
        <textarea id="b64-encoded-output" class="code-editor font-mono" placeholder="Base64 encoded string..." spellcheck="false"></textarea>
      </div>
    </div>
  `;

  const textInput = container.querySelector('#b64-text-input');
  const b64Output = container.querySelector('#b64-encoded-output');
  const urlSafeChk = container.querySelector('#b64-opt-urlsafe');
  const dataUriChk = container.querySelector('#b64-opt-datauri');

  function doEncode() {
    try {
      b64Output.value = encodeBase64(textInput.value, {
        urlSafe: urlSafeChk.checked,
        dataUriMime: dataUriChk.checked ? 'text/plain' : ''
      });
      updateStatusBar(container, b64Output.value);
      addToolHistory(tool.id, textInput.value);
    } catch (e) {
      b64Output.value = e.message;
    }
  }

  function doDecode() {
    try {
      textInput.value = decodeBase64(b64Output.value);
      updateStatusBar(container, textInput.value);
      addToolHistory(tool.id, b64Output.value);
    } catch (e) {
      textInput.value = e.message;
    }
  }

  container.querySelector('#btn-b64-encode').addEventListener('click', doEncode);
  container.querySelector('#btn-b64-decode').addEventListener('click', doDecode);
  textInput.addEventListener('input', doEncode);
  urlSafeChk.addEventListener('change', doEncode);
  dataUriChk.addEventListener('change', doEncode);

  container.querySelector('#btn-b64-swap').addEventListener('click', () => {
    const tmp = textInput.value;
    textInput.value = b64Output.value;
    b64Output.value = tmp;
  });

  container.querySelector('#btn-b64-copy').addEventListener('click', (e) => copyToClipboard(b64Output.value, e.currentTarget));
  container.querySelector('#btn-b64-clear').addEventListener('click', () => {
    textInput.value = '';
    b64Output.value = '';
    updateStatusBar(container, '');
  });

  setupFileDrop(textInput, (content) => {
    textInput.value = content;
    doEncode();
  });

  attachStandardToolbarEvents(container, tool, (preset) => {
    textInput.value = preset.value;
    doEncode();
  });

  textInput.value = tool.sample;
  doEncode();
}

// ==========================================
// 5. URL ENCODER / DECODER
// ==========================================
function renderURLEncode(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group flex items-center gap-2">
        <label class="opt-label text-xs font-semibold text-muted" for="url-opt-mode">Encoding Mode:</label>
        <select id="url-opt-mode" class="form-control form-control-sm">
          <option value="component">encodeURIComponent (Standard Component)</option>
          <option value="uri">encodeURI (Full URI)</option>
          <option value="form">application/x-www-form-urlencoded (Space to +)</option>
          <option value="rfc3986">RFC 3986 Strict</option>
        </select>
      </div>
      <div class="actions-group flex items-center gap-2">
        <button class="btn btn-sm btn-primary" id="btn-url-encode">Encode &rarr;</button>
        <button class="btn btn-sm btn-secondary" id="btn-url-decode">&larr; Decode</button>
        <button class="btn btn-sm btn-secondary" id="btn-url-copy">${getIcon('copy', 'icon-xs')} Copy</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="split-pane-layout">
      <div class="pane-column">
        <div class="pane-header"><span class="pane-title text-xs font-semibold">Decoded / Plain String</span></div>
        <textarea id="url-plain" class="code-editor font-mono" placeholder="Type text or URL to encode..."></textarea>
      </div>
      <div class="pane-column">
        <div class="pane-header"><span class="pane-title text-xs font-semibold">Encoded Result</span></div>
        <textarea id="url-encoded" class="code-editor font-mono" placeholder="Encoded URL will appear here..."></textarea>
      </div>
    </div>
  `;

  const plainEl = container.querySelector('#url-plain');
  const encodedEl = container.querySelector('#url-encoded');
  const modeEl = container.querySelector('#url-opt-mode');

  function doEncode() {
    encodedEl.value = encodeURL(plainEl.value, modeEl.value);
    updateStatusBar(container, encodedEl.value);
    addToolHistory(tool.id, plainEl.value);
  }

  function doDecode() {
    try {
      plainEl.value = decodeURL(encodedEl.value, modeEl.value);
      updateStatusBar(container, plainEl.value);
      addToolHistory(tool.id, encodedEl.value);
    } catch(e) {
      plainEl.value = e.message;
    }
  }

  container.querySelector('#btn-url-encode').addEventListener('click', doEncode);
  container.querySelector('#btn-url-decode').addEventListener('click', doDecode);
  plainEl.addEventListener('input', doEncode);
  modeEl.addEventListener('change', doEncode);
  container.querySelector('#btn-url-copy').addEventListener('click', (e) => copyToClipboard(encodedEl.value, e.currentTarget));

  attachStandardToolbarEvents(container, tool, (preset) => {
    plainEl.value = preset.value;
    doEncode();
  });

  plainEl.value = tool.sample;
  doEncode();
}

// ==========================================
// 6. JWT DECODER
// ==========================================
function renderJWTDecoder(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="actions-group flex items-center gap-2">
        <button class="btn btn-sm btn-primary" id="btn-decode-jwt">${getIcon('play', 'icon-xs')} Decode Token</button>
        <button class="btn btn-sm btn-secondary" id="btn-copy-payload">${getIcon('copy', 'icon-xs')} Copy Payload</button>
        <button class="btn btn-sm btn-ghost" id="btn-clear-jwt">${getIcon('trash', 'icon-xs')} Clear</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="jwt-layout flex flex-col flex-1 overflow-y-auto">
      <div class="form-group mb-3">
        <label class="form-label font-semibold text-xs" for="jwt-input">Encoded JSON Web Token (JWT) *</label>
        <textarea id="jwt-input" class="code-editor font-mono min-h-24" placeholder="Paste eyJhbGci... token string here..."></textarea>
      </div>

      <div class="alert alert-info mb-3">
        <div class="alert-icon">${getIcon('info', 'icon-md')}</div>
        <div class="alert-content">
          <div class="alert-title font-semibold text-xs">Client-Side JWT Inspection</div>
          <p class="alert-desc text-xs text-muted">DevBench decodes token headers and payload claims client-side. Cryptographic signature verification must be executed by your auth server with public/private keys.</p>
        </div>
      </div>

      <div class="split-pane-layout">
        <div class="pane-column">
          <div class="pane-header flex items-center justify-between">
            <span class="pane-title text-xs font-semibold text-rose">Header (Algorithm & Key ID)</span>
            <span id="jwt-alg-badge" class="badge badge-secondary font-mono text-xs"></span>
          </div>
          <pre id="jwt-header-out" class="code-editor font-mono bg-surface-elevated"></pre>
        </div>
        <div class="pane-column">
          <div class="pane-header flex items-center justify-between">
            <span class="pane-title text-xs font-semibold text-emerald">Payload (Claims & Expiration)</span>
            <span id="jwt-exp-badge"></span>
          </div>
          <pre id="jwt-payload-out" class="code-editor font-mono bg-surface-elevated"></pre>
        </div>
      </div>
    </div>
  `;

  const inputEl = container.querySelector('#jwt-input');
  const headerEl = container.querySelector('#jwt-header-out');
  const payloadEl = container.querySelector('#jwt-payload-out');
  const algBadgeEl = container.querySelector('#jwt-alg-badge');
  const expBadgeEl = container.querySelector('#jwt-exp-badge');

  function doDecode() {
    const res = decodeJWT(inputEl.value);
    if (res.success) {
      headerEl.textContent = res.rawHeader;
      payloadEl.textContent = res.rawPayload;
      algBadgeEl.textContent = res.header.alg || 'none';

      if (res.expirationStatus) {
        expBadgeEl.innerHTML = `
          <span class="badge ${res.expirationStatus.isExpired ? 'badge-danger' : 'badge-success'} text-xs" title="${res.expirationStatus.fullDate}">
            ${res.expirationStatus.human}
          </span>
        `;
      } else {
        expBadgeEl.innerHTML = `<span class="badge badge-secondary text-xs">No exp claim</span>`;
      }
      updateStatusBar(container, inputEl.value);
      addToolHistory(tool.id, inputEl.value);
    } else {
      headerEl.textContent = '';
      payloadEl.textContent = res.error;
      algBadgeEl.textContent = '';
      expBadgeEl.innerHTML = '';
    }
  }

  container.querySelector('#btn-decode-jwt').addEventListener('click', doDecode);
  inputEl.addEventListener('input', doDecode);
  container.querySelector('#btn-copy-payload').addEventListener('click', (e) => copyToClipboard(payloadEl.textContent, e.currentTarget));
  container.querySelector('#btn-clear-jwt').addEventListener('click', () => {
    inputEl.value = '';
    headerEl.textContent = '';
    payloadEl.textContent = '';
    algBadgeEl.textContent = '';
    expBadgeEl.innerHTML = '';
    updateStatusBar(container, '');
  });

  attachStandardToolbarEvents(container, tool, (preset) => {
    inputEl.value = preset.value;
    doDecode();
  });

  inputEl.value = tool.sample;
  doDecode();
}

// ==========================================
// 7. UUID / ID GENERATOR
// ==========================================
function renderUUIDGenerator(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    showPresets: false,
    toolbarHTML: `
      <div class="options-group flex items-center gap-2 flex-wrap">
        <label class="opt-label text-xs font-semibold text-muted" for="uuid-opt-ver">Format:</label>
        <select id="uuid-opt-ver" class="form-control form-control-sm">
          <option value="v4">UUID v4 (Random Cryptographic)</option>
          <option value="v7">UUID v7 (Time-Ordered RFC 9562)</option>
          <option value="ulid">ULID (Sortable Crockford Base32)</option>
          <option value="nanoid">NanoID (Compact 21-Char)</option>
        </select>
        <label class="opt-label text-xs font-semibold text-muted" for="uuid-opt-count">Count:</label>
        <input type="number" id="uuid-opt-count" class="form-control form-control-sm w-20" min="1" max="500" value="10" />
        <label class="opt-label text-xs font-semibold text-muted" for="uuid-opt-prefix">Prefix:</label>
        <input type="text" id="uuid-opt-prefix" class="form-control form-control-sm w-20 font-mono" placeholder="e.g. usr_" />
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="uuid-opt-upper" /> Uppercase
        </label>
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="uuid-opt-hyphens" checked /> Hyphens
        </label>
        <label class="opt-label text-xs font-semibold text-muted" for="uuid-opt-format">Output:</label>
        <select id="uuid-opt-format" class="form-control form-control-sm">
          <option value="list">Line-by-Line</option>
          <option value="json">JSON Array</option>
          <option value="csv">CSV List</option>
          <option value="sql">SQL IN Clause</option>
        </select>
      </div>
      <div class="actions-group flex items-center gap-2">
        <button class="btn btn-sm btn-primary" id="btn-uuid-generate">${getIcon('refresh', 'icon-xs')} Generate</button>
        <button class="btn btn-sm btn-secondary" id="btn-uuid-copy">${getIcon('copy', 'icon-xs')} Copy All</button>
        <button class="btn btn-sm btn-secondary" id="btn-uuid-download">${getIcon('download', 'icon-xs')} Download</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="uuid-layout flex-1 flex flex-col">
      <textarea id="uuid-output" class="code-editor font-mono flex-1 min-h-80" readonly></textarea>
    </div>
  `;

  const outputEl = container.querySelector('#uuid-output');
  const verEl = container.querySelector('#uuid-opt-ver');
  const countEl = container.querySelector('#uuid-opt-count');
  const prefixEl = container.querySelector('#uuid-opt-prefix');
  const upperEl = container.querySelector('#uuid-opt-upper');
  const hyphensEl = container.querySelector('#uuid-opt-hyphens');
  const formatEl = container.querySelector('#uuid-opt-format');

  function doGenerate() {
    const count = parseInt(countEl.value, 10) || 10;
    const text = generateBulkUUIDs(count, {
      version: verEl.value,
      prefix: prefixEl.value.trim(),
      uppercase: upperEl.checked,
      hyphens: hyphensEl.checked,
      format: formatEl.value
    });
    outputEl.value = text;
    updateStatusBar(container, text);
  }

  container.querySelector('#btn-uuid-generate').addEventListener('click', doGenerate);
  verEl.addEventListener('change', doGenerate);
  countEl.addEventListener('change', doGenerate);
  prefixEl.addEventListener('input', doGenerate);
  upperEl.addEventListener('change', doGenerate);
  hyphensEl.addEventListener('change', doGenerate);
  formatEl.addEventListener('change', doGenerate);

  container.querySelector('#btn-uuid-copy').addEventListener('click', (e) => copyToClipboard(outputEl.value, e.currentTarget));
  container.querySelector('#btn-uuid-download').addEventListener('click', () => downloadTextFile('identifiers.txt', outputEl.value));

  attachStandardToolbarEvents(container, tool, null);
  doGenerate();
}

// ==========================================
// 8. TIMESTAMP CONVERTER
// ==========================================
function renderTimestampConverter(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="actions-group flex items-center gap-2">
        <button class="btn btn-sm btn-secondary" id="btn-ts-now">${getIcon('refresh', 'icon-xs')} Current Time</button>
        <button class="btn btn-sm btn-secondary" id="btn-ts-copy-iso">${getIcon('copy', 'icon-xs')} Copy ISO 8601</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="timestamp-layout flex flex-col flex-1 overflow-y-auto">
      <div class="card p-4 mb-4 flex items-center justify-between">
        <div>
          <span class="text-xs text-muted uppercase font-semibold">Current Unix Epoch Ticker (Seconds)</span>
          <div class="font-mono text-2xl font-bold text-emerald" id="live-epoch-ticker">0</div>
        </div>
        <button class="btn btn-sm btn-secondary" id="btn-copy-live-epoch">${getIcon('copy', 'icon-xs')} Copy Epoch</button>
      </div>

      <div class="form-group mb-4">
        <label class="form-label font-semibold text-xs" for="ts-input">Enter Timestamp (Seconds / Milliseconds / ISO 8601 / Hex / Date String)</label>
        <input type="text" id="ts-input" class="form-control font-mono text-base" placeholder="e.g. 1724800000, 2026-08-28T00:00:00Z, or 0x66CDC800" />
      </div>

      <div class="metrics-grid" id="ts-results-grid"></div>
    </div>
  `;

  const inputEl = container.querySelector('#ts-input');
  const resultsGrid = container.querySelector('#ts-results-grid');
  const tickerEl = container.querySelector('#live-epoch-ticker');

  const tickerInterval = setInterval(() => {
    if (document.body.contains(tickerEl)) {
      tickerEl.textContent = Math.floor(Date.now() / 1000);
    } else {
      clearInterval(tickerInterval);
    }
  }, 1000);

  function doConvert() {
    const res = convertTimestamp(inputEl.value);
    if (res.isValid) {
      resultsGrid.innerHTML = `
        <div class="metric-card">
          <span class="metric-label">Unix Seconds</span>
          <div class="metric-value font-mono text-primary">${res.unixSeconds}</div>
          <button class="btn btn-xs btn-ghost btn-copy-field" data-val="${res.unixSeconds}">Copy</button>
        </div>
        <div class="metric-card">
          <span class="metric-label">Unix Milliseconds</span>
          <div class="metric-value font-mono text-primary">${res.unixMillis}</div>
          <button class="btn btn-xs btn-ghost btn-copy-field" data-val="${res.unixMillis}">Copy</button>
        </div>
        <div class="metric-card">
          <span class="metric-label">Hex Timestamp</span>
          <div class="metric-value font-mono text-primary">${res.unixHex}</div>
          <button class="btn btn-xs btn-ghost btn-copy-field" data-val="${res.unixHex}">Copy</button>
        </div>
        <div class="metric-card">
          <span class="metric-label">Day of Year</span>
          <div class="metric-value font-mono text-primary">Day ${res.dayOfYear} (${res.isLeapYear ? 'Leap Year' : 'Common Year'})</div>
        </div>
        <div class="metric-card col-span-full">
          <span class="metric-label">ISO 8601 (UTC Standard)</span>
          <div class="metric-value font-mono text-emerald text-base">${res.iso}</div>
          <button class="btn btn-xs btn-ghost btn-copy-field" data-val="${res.iso}">Copy</button>
        </div>
        <div class="metric-card col-span-full">
          <span class="metric-label">Local Date & Time</span>
          <div class="metric-value text-base text-primary">${res.local}</div>
          <div class="metric-meta text-xs text-muted mt-1">Relative: <strong class="text-primary">${res.relative}</strong></div>
        </div>
      `;

      resultsGrid.querySelectorAll('.btn-copy-field').forEach(b => {
        b.addEventListener('click', () => copyToClipboard(b.dataset.val, b));
      });
      addToolHistory(tool.id, inputEl.value);
    } else {
      resultsGrid.innerHTML = `<div class="p-4 text-rose text-xs font-mono">${escapeHTML(res.error)}</div>`;
    }
  }

  inputEl.addEventListener('input', doConvert);
  container.querySelector('#btn-ts-now').addEventListener('click', () => { inputEl.value = 'now'; doConvert(); });
  container.querySelector('#btn-copy-live-epoch').addEventListener('click', (e) => copyToClipboard(tickerEl.textContent, e.currentTarget));
  container.querySelector('#btn-ts-copy-iso').addEventListener('click', (e) => {
    const res = convertTimestamp(inputEl.value);
    if (res.isValid) copyToClipboard(res.iso, e.currentTarget);
  });

  attachStandardToolbarEvents(container, tool, (preset) => {
    inputEl.value = preset.value;
    doConvert();
  });

  inputEl.value = 'now';
  doConvert();
}

// ==========================================
// 9. REGEX TESTER
// ==========================================
function renderRegexTester(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group flex-1 flex items-center gap-2">
        <span class="font-mono font-bold text-muted">/</span>
        <input type="text" id="regex-pattern" class="form-control form-control-sm font-mono flex-1" placeholder="Regular expression (e.g. [a-zA-Z0-9]+)" value="([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+)" />
        <span class="font-mono font-bold text-muted">/</span>
        <input type="text" id="regex-flags" class="form-control form-control-sm font-mono w-16" placeholder="flags" value="g" />
      </div>
      <div class="actions-group flex items-center gap-2">
        <span class="badge badge-primary font-mono text-xs" id="regex-match-counter">0 matches</span>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="regex-main-layout flex flex-col flex-1 overflow-y-auto">
      <div class="split-pane-layout mb-3">
        <div class="pane-column">
          <div class="pane-header"><span class="pane-title text-xs font-semibold">Test String</span></div>
          <textarea id="regex-test-text" class="code-editor font-mono" placeholder="Enter text to match against regular expression..."></textarea>
        </div>
        <div class="pane-column">
          <div class="pane-header"><span class="pane-title text-xs font-semibold">Match Highlight Preview</span></div>
          <div id="regex-highlight-box" class="code-editor font-mono bg-surface-elevated overflow-y-auto"></div>
        </div>
      </div>

      <div class="card p-4">
        <div class="card-header p-0 pb-2 mb-2 flex items-center justify-between border-b">
          <h3 class="card-title text-xs font-semibold uppercase">Capture Groups & Match Index Table</h3>
        </div>
        <div id="regex-matches-table" class="table-responsive max-h-48 overflow-y-auto"></div>
      </div>
    </div>
  `;

  const patternEl = container.querySelector('#regex-pattern');
  const flagsEl = container.querySelector('#regex-flags');
  const testTextEl = container.querySelector('#regex-test-text');
  const highlightEl = container.querySelector('#regex-highlight-box');
  const counterEl = container.querySelector('#regex-match-counter');
  const tableEl = container.querySelector('#regex-matches-table');

  function doTest() {
    const res = testRegex(patternEl.value, flagsEl.value, testTextEl.value);
    if (res.isValid) {
      counterEl.textContent = `${res.matchCount} ${res.matchCount === 1 ? 'match' : 'matches'}`;
      highlightEl.innerHTML = res.highlightedHTML;

      if (res.matches.length > 0) {
        tableEl.innerHTML = `
          <table class="table text-xs">
            <thead>
              <tr>
                <th style="width: 40px;">#</th>
                <th>Full Match</th>
                <th style="width: 120px;">Index Range</th>
                <th>Capture Groups</th>
              </tr>
            </thead>
            <tbody>
              ${res.matches.map((m, idx) => `
                <tr>
                  <td class="font-mono text-muted">${idx + 1}</td>
                  <td class="font-mono font-bold text-primary">${escapeHTML(m.value)}</td>
                  <td class="font-mono text-muted">${m.index}&ndash;${m.index + m.length}</td>
                  <td class="font-mono">${m.groups.length > 0 ? m.groups.map(g => `<span class="badge badge-secondary">${escapeHTML(g)}</span>`).join(' ') : '<span class="text-muted">none</span>'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      } else {
        tableEl.innerHTML = `<div class="text-muted text-xs p-2">No matches found in test string.</div>`;
      }
      updateStatusBar(container, testTextEl.value);
      addToolHistory(tool.id, patternEl.value);
    } else {
      counterEl.textContent = 'Regex Error';
      highlightEl.innerHTML = `<div class="text-rose text-xs p-2">Invalid RegExp: ${escapeHTML(res.error)}</div>`;
      tableEl.innerHTML = '';
    }
  }

  patternEl.addEventListener('input', doTest);
  flagsEl.addEventListener('input', doTest);
  testTextEl.addEventListener('input', doTest);

  attachStandardToolbarEvents(container, tool, (preset) => {
    patternEl.value = preset.pattern;
    flagsEl.value = preset.flags || 'g';
    testTextEl.value = preset.sample;
    doTest();
  });

  testTextEl.value = tool.sample;
  doTest();
}

// ==========================================
// 10. TEXT DIFF VIEWER
// ==========================================
function renderTextDiff(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group flex items-center gap-2">
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="diff-opt-whitespace" /> Ignore Whitespace
        </label>
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="diff-opt-case" checked /> Case Sensitive
        </label>
      </div>
      <div class="actions-group flex items-center gap-2">
        <button class="btn btn-sm btn-secondary" id="btn-swap-diff">${getIcon('swap', 'icon-xs')} Swap</button>
        <button class="btn btn-sm btn-primary" id="btn-run-diff">${getIcon('diff', 'icon-xs')} Compare</button>
        <button class="btn btn-sm btn-ghost" id="btn-clear-diff">${getIcon('trash', 'icon-xs')} Clear</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="diff-main-layout flex flex-col flex-1 overflow-y-auto">
      <div class="split-pane-layout mb-3">
        <div class="pane-column">
          <div class="pane-header"><span class="pane-title text-xs font-semibold">Original Text</span></div>
          <textarea id="diff-orig" class="code-editor font-mono" placeholder="Paste original code / text..."></textarea>
        </div>
        <div class="pane-column">
          <div class="pane-header"><span class="pane-title text-xs font-semibold">Modified Text</span></div>
          <textarea id="diff-mod" class="code-editor font-mono" placeholder="Paste modified code / text..."></textarea>
        </div>
      </div>

      <div class="card p-0">
        <div class="pane-header border-b px-4 py-2 flex items-center justify-between">
          <span class="pane-title text-xs font-semibold">Unified Diff Result</span>
          <div id="diff-stats-badges" class="flex gap-2"></div>
        </div>
        <div id="diff-render-output" class="diff-view-container font-mono text-xs max-h-80 overflow-y-auto"></div>
      </div>
    </div>
  `;

  const origEl = container.querySelector('#diff-orig');
  const modEl = container.querySelector('#diff-mod');
  const renderEl = container.querySelector('#diff-render-output');
  const statsEl = container.querySelector('#diff-stats-badges');
  const wsChk = container.querySelector('#diff-opt-whitespace');
  const caseChk = container.querySelector('#diff-opt-case');

  function doDiff() {
    const res = computeTextDiff(origEl.value, modEl.value, {
      ignoreWhitespace: wsChk.checked,
      caseSensitive: caseChk.checked
    });

    statsEl.innerHTML = `
      <span class="badge badge-success">+${res.stats.added} added</span>
      <span class="badge badge-danger">-${res.stats.removed} removed</span>
      <span class="badge badge-secondary">${res.stats.unchanged} unchanged</span>
    `;

    renderEl.innerHTML = res.diff.map(d => {
      let cls = 'diff-row-unchanged';
      let symbol = '&nbsp;';
      if (d.type === 'added') { cls = 'diff-row-added'; symbol = '+'; }
      if (d.type === 'removed') { cls = 'diff-row-removed'; symbol = '-'; }

      return `
        <div class="diff-line ${cls}">
          <span class="diff-ln">${d.lineOrig || ''}</span>
          <span class="diff-ln">${d.lineMod || ''}</span>
          <span class="diff-sign">${symbol}</span>
          <span class="diff-content">${escapeHTML(d.text)}</span>
        </div>
      `;
    }).join('');
    updateStatusBar(container, `${origEl.value}\n${modEl.value}`);
  }

  container.querySelector('#btn-run-diff').addEventListener('click', doDiff);
  origEl.addEventListener('input', doDiff);
  modEl.addEventListener('input', doDiff);
  wsChk.addEventListener('change', doDiff);
  caseChk.addEventListener('change', doDiff);

  container.querySelector('#btn-swap-diff').addEventListener('click', () => {
    const tmp = origEl.value;
    origEl.value = modEl.value;
    modEl.value = tmp;
    doDiff();
  });

  container.querySelector('#btn-clear-diff').addEventListener('click', () => {
    origEl.value = '';
    modEl.value = '';
    doDiff();
  });

  attachStandardToolbarEvents(container, tool, (preset) => {
    origEl.value = preset.orig;
    modEl.value = preset.mod;
    doDiff();
  });

  origEl.value = tool.sample;
  modEl.value = tool.sampleModified || '';
  doDiff();
}

// ==========================================
// 11. HASH GENERATOR
// ==========================================
function renderHashGenerator(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group flex-1 flex items-center gap-2">
        <label class="opt-label text-xs font-semibold text-muted" for="hash-hmac-key">HMAC Key (Optional):</label>
        <input type="text" id="hash-hmac-key" class="form-control form-control-sm font-mono flex-1" placeholder="Leave blank for standard checksum" />
        <label class="opt-label text-xs font-semibold text-muted" for="hash-format-select">Format:</label>
        <select id="hash-format-select" class="form-control form-control-sm w-28">
          <option value="hex">Hexadecimal</option>
          <option value="base64">Base64</option>
        </select>
      </div>
      <div class="actions-group flex items-center gap-2">
        <button class="btn btn-sm btn-primary" id="btn-compute-hash">${getIcon('refresh', 'icon-xs')} Compute</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="hash-layout flex flex-col flex-1 overflow-y-auto">
      <div class="form-group mb-4">
        <label class="form-label font-semibold text-xs" for="hash-input">Input Payload String *</label>
        <textarea id="hash-input" class="code-editor font-mono min-h-24" placeholder="Enter text or string to generate cryptographic hashes..."></textarea>
      </div>

      <div class="card p-0">
        <div class="table-responsive">
          <table class="table text-xs font-mono">
            <thead>
              <tr>
                <th style="width: 140px;">Algorithm</th>
                <th>Hash / Digest</th>
                <th style="width: 80px;" class="text-right">Action</th>
              </tr>
            </thead>
            <tbody id="hash-results-body"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  const inputEl = container.querySelector('#hash-input');
  const hmacEl = container.querySelector('#hash-hmac-key');
  const formatEl = container.querySelector('#hash-format-select');
  const bodyEl = container.querySelector('#hash-results-body');

  async function doHash() {
    const hashes = await generateHashes(inputEl.value, hmacEl.value.trim(), formatEl.value);
    const algos = [
      { name: 'SHA-256', val: hashes.sha256, bits: '256-bit' },
      { name: 'SHA-512', val: hashes.sha512, bits: '512-bit' },
      { name: 'SHA-384', val: hashes.sha384, bits: '384-bit' },
      { name: 'SHA-1', val: hashes.sha1, bits: '160-bit' },
      { name: 'MD5', val: hashes.md5, bits: '128-bit' },
      { name: 'CRC32', val: hashes.crc32, bits: '32-bit' }
    ];

    bodyEl.innerHTML = algos.map(a => `
      <tr>
        <td class="font-bold text-primary">
          ${a.name}
          <span class="text-muted text-xs block font-normal">${a.bits}</span>
        </td>
        <td class="text-emerald break-all font-mono">${a.val || '—'}</td>
        <td class="text-right">
          <button class="btn btn-xs btn-secondary btn-copy-hash" data-val="${a.val}">Copy</button>
        </td>
      </tr>
    `).join('');

    bodyEl.querySelectorAll('.btn-copy-hash').forEach(b => {
      b.addEventListener('click', () => copyToClipboard(b.dataset.val, b));
    });

    updateStatusBar(container, inputEl.value);
    addToolHistory(tool.id, inputEl.value);
  }

  container.querySelector('#btn-compute-hash').addEventListener('click', doHash);
  inputEl.addEventListener('input', doHash);
  hmacEl.addEventListener('input', doHash);
  formatEl.addEventListener('change', doHash);

  attachStandardToolbarEvents(container, tool, (preset) => {
    inputEl.value = preset.value;
    doHash();
  });

  inputEl.value = tool.sample;
  doHash();
}

// ==========================================
// 12. COLOR CONVERTER
// ==========================================
function renderColorConverter(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group flex-1 flex items-center gap-2">
        <label class="opt-label text-xs font-semibold text-muted" for="color-str-input">Color Input (HEX, RGB, HSL, Named):</label>
        <input type="text" id="color-str-input" class="form-control form-control-sm font-mono w-48" value="#3B82F6" />
        <input type="color" id="color-native-picker" class="form-control form-control-sm p-0 w-10 cursor-pointer" value="#3b82f6" aria-label="Color wheel" />
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `<div id="color-details-view" class="color-details-layout flex flex-col flex-1 overflow-y-auto"></div>`;

  const strInput = container.querySelector('#color-str-input');
  const nativePicker = container.querySelector('#color-native-picker');
  const detailsEl = container.querySelector('#color-details-view');

  function doColor() {
    const c = parseAndConvertColor(strInput.value);
    detailsEl.innerHTML = `
      <div class="color-preview-card card p-4 mb-4 flex items-center gap-4">
        <div class="color-swatch-large" style="background-color: ${c.hex}; width: 80px; height: 80px; border-radius: 8px; border: 1px solid var(--border-subtle);"></div>
        <div class="flex-1">
          <div class="font-mono text-2xl font-bold">${c.hex}</div>
          <div class="text-xs text-muted mt-1 font-mono">${c.rgb} &bull; ${c.hsl}</div>
        </div>
      </div>

      <div class="metrics-grid mb-4">
        <div class="metric-card">
          <span class="metric-label">HEX</span>
          <div class="metric-value font-mono text-base">${c.hex}</div>
          <button class="btn btn-xs btn-ghost btn-copy-field" data-val="${c.hex}">Copy</button>
        </div>
        <div class="metric-card">
          <span class="metric-label">RGB</span>
          <div class="metric-value font-mono text-base">${c.rgb}</div>
          <button class="btn btn-xs btn-ghost btn-copy-field" data-val="${c.rgb}">Copy</button>
        </div>
        <div class="metric-card">
          <span class="metric-label">HSL</span>
          <div class="metric-value font-mono text-base">${c.hsl}</div>
          <button class="btn btn-xs btn-ghost btn-copy-field" data-val="${c.hsl}">Copy</button>
        </div>
        <div class="metric-card">
          <span class="metric-label">CMYK</span>
          <div class="metric-value font-mono text-base">${c.cmyk}</div>
          <button class="btn btn-xs btn-ghost btn-copy-field" data-val="${c.cmyk}">Copy</button>
        </div>
      </div>

      <div class="card p-4 mb-4">
        <div class="card-header p-0 pb-2 mb-3 border-b"><h3 class="card-title text-xs font-semibold uppercase">WCAG 2.1 Contrast Compliance</h3></div>
        <div class="contrast-check-row flex gap-4 flex-wrap">
          <div class="contrast-box p-3 rounded border flex-1" style="background: #ffffff; color: ${c.hex};">
            <span class="text-xs font-bold block mb-1">Contrast on White: ${c.contrastWhite}:1</span>
            <div class="flex gap-2">
              <span class="badge ${c.wcagWhiteAA ? 'badge-success' : 'badge-danger'} text-xs">AA Normal (${c.wcagWhiteAA ? 'PASS' : 'FAIL'})</span>
              <span class="badge ${c.wcagWhiteAAA ? 'badge-success' : 'badge-danger'} text-xs">AAA (${c.wcagWhiteAAA ? 'PASS' : 'FAIL'})</span>
            </div>
          </div>
          <div class="contrast-box p-3 rounded border flex-1" style="background: #000000; color: ${c.hex};">
            <span class="text-xs font-bold block mb-1">Contrast on Black: ${c.contrastBlack}:1</span>
            <div class="flex gap-2">
              <span class="badge ${c.wcagBlackAA ? 'badge-success' : 'badge-danger'} text-xs">AA Normal (${c.wcagBlackAA ? 'PASS' : 'FAIL'})</span>
              <span class="badge ${c.wcagBlackAAA ? 'badge-success' : 'badge-danger'} text-xs">AAA (${c.wcagBlackAAA ? 'PASS' : 'FAIL'})</span>
            </div>
          </div>
        </div>
      </div>
    `;

    detailsEl.querySelectorAll('.btn-copy-field').forEach(b => {
      b.addEventListener('click', () => copyToClipboard(b.dataset.val, b));
    });
  }

  strInput.addEventListener('input', () => {
    if (/^#[0-9a-fA-F]{6}$/i.test(strInput.value)) nativePicker.value = strInput.value;
    doColor();
  });
  nativePicker.addEventListener('input', () => {
    strInput.value = nativePicker.value;
    doColor();
  });

  attachStandardToolbarEvents(container, tool, (preset) => {
    strInput.value = preset.value;
    if (/^#[0-9a-fA-F]{6}$/i.test(preset.value)) nativePicker.value = preset.value;
    doColor();
  });

  doColor();
}

// ==========================================
// 13. HTML ENTITY ENCODER
// ==========================================
function renderHTMLEntities(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group flex items-center gap-2">
        <label class="opt-label text-xs font-semibold text-muted" for="html-opt-mode">Mode:</label>
        <select id="html-opt-mode" class="form-control form-control-sm">
          <option value="named">Named Entities (&amp;amp;, &amp;lt;)</option>
          <option value="decimal">Decimal (&#38;)</option>
          <option value="hex">Hexadecimal (&#x26;)</option>
        </select>
      </div>
      <div class="actions-group flex items-center gap-2">
        <button class="btn btn-sm btn-primary" id="btn-html-encode">Encode &rarr;</button>
        <button class="btn btn-sm btn-secondary" id="btn-html-decode">&larr; Decode</button>
        <button class="btn btn-sm btn-secondary" id="btn-html-copy">${getIcon('copy', 'icon-xs')} Copy</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="split-pane-layout">
      <div class="pane-column">
        <div class="pane-header"><span class="pane-title text-xs font-semibold">Raw Text / HTML</span></div>
        <textarea id="html-raw" class="code-editor font-mono" placeholder="Enter HTML here..."></textarea>
      </div>
      <div class="pane-column">
        <div class="pane-header"><span class="pane-title text-xs font-semibold">Entities Output</span></div>
        <textarea id="html-encoded" class="code-editor font-mono" placeholder="Encoded entities output..."></textarea>
      </div>
    </div>
  `;

  const rawEl = container.querySelector('#html-raw');
  const encodedEl = container.querySelector('#html-encoded');
  const modeEl = container.querySelector('#html-opt-mode');

  function doEncode() {
    encodedEl.value = encodeHTMLEntities(rawEl.value, modeEl.value);
    updateStatusBar(container, encodedEl.value);
    addToolHistory(tool.id, rawEl.value);
  }

  function doDecode() {
    rawEl.value = decodeHTMLEntities(encodedEl.value);
    updateStatusBar(container, rawEl.value);
  }

  container.querySelector('#btn-html-encode').addEventListener('click', doEncode);
  container.querySelector('#btn-html-decode').addEventListener('click', doDecode);
  rawEl.addEventListener('input', doEncode);
  modeEl.addEventListener('change', doEncode);
  container.querySelector('#btn-html-copy').addEventListener('click', (e) => copyToClipboard(encodedEl.value, e.currentTarget));

  attachStandardToolbarEvents(container, tool, (preset) => {
    rawEl.value = preset.value;
    doEncode();
  });

  rawEl.value = tool.sample;
  doEncode();
}

// ==========================================
// 14. URL PARSER
// ==========================================
function renderURLParser(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="actions-group flex items-center gap-2">
        <button class="btn btn-sm btn-secondary" id="btn-url-add-param">+ Add Query Param</button>
        <button class="btn btn-sm btn-secondary" id="btn-copy-full-url">${getIcon('copy', 'icon-xs')} Copy Rebuilt URL</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="url-parser-layout flex flex-col flex-1 overflow-y-auto">
      <div class="form-group mb-4">
        <label class="form-label font-semibold text-xs" for="url-parse-input">Full URL to Parse *</label>
        <input type="text" id="url-parse-input" class="form-control font-mono text-sm" placeholder="https://example.com/path?key=val" />
      </div>

      <div class="metrics-grid mb-4" id="url-components-grid"></div>

      <div class="card p-0">
        <div class="pane-header border-b px-4 py-2 flex items-center justify-between">
          <span class="pane-title text-xs font-semibold">Query Parameters Table (Live Two-Way Sync)</span>
        </div>
        <div class="table-responsive">
          <table class="table text-xs font-mono">
            <thead>
              <tr>
                <th style="width: 220px;">Parameter Key</th>
                <th>Parameter Value</th>
                <th style="width: 60px;" class="text-right">Action</th>
              </tr>
            </thead>
            <tbody id="url-params-body"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  const inputEl = container.querySelector('#url-parse-input');
  const compGrid = container.querySelector('#url-components-grid');
  const paramsBody = container.querySelector('#url-params-body');

  let currentParams = [];

  function doParse() {
    const res = parseURL(inputEl.value);
    if (res.isValid) {
      currentParams = res.searchParams;
      compGrid.innerHTML = `
        <div class="metric-card"><span class="metric-label">Protocol</span><div class="metric-value font-mono text-base text-primary">${res.protocol}</div></div>
        <div class="metric-card"><span class="metric-label">Hostname</span><div class="metric-value font-mono text-base text-primary">${res.hostname}</div></div>
        <div class="metric-card"><span class="metric-label">Port</span><div class="metric-value font-mono text-base text-primary">${res.port || '80/443'}</div></div>
        <div class="metric-card"><span class="metric-label">Path</span><div class="metric-value font-mono text-base text-primary">${res.pathname || '/'}</div></div>
      `;

      renderParamsTable(res);
      addToolHistory(tool.id, inputEl.value);
    }
  }

  function renderParamsTable(res) {
    if (currentParams.length === 0) {
      paramsBody.innerHTML = `<tr><td colspan="3" class="text-muted text-center p-3">No query parameters present in URL.</td></tr>`;
      return;
    }

    paramsBody.innerHTML = currentParams.map((p, idx) => `
      <tr>
        <td><input type="text" class="form-control form-control-sm q-key font-mono" data-idx="${idx}" value="${escapeHTML(p.key)}" /></td>
        <td><input type="text" class="form-control form-control-sm q-val font-mono" data-idx="${idx}" value="${escapeHTML(p.value)}" /></td>
        <td class="text-right"><button class="btn-icon-danger btn-del-param" data-idx="${idx}" title="Delete parameter">${getIcon('close', 'icon-xs')}</button></td>
      </tr>
    `).join('');

    paramsBody.querySelectorAll('.q-key, .q-val').forEach(inp => {
      inp.addEventListener('input', () => {
        const idx = parseInt(inp.dataset.idx, 10);
        if (inp.classList.contains('q-key')) currentParams[idx].key = inp.value;
        if (inp.classList.contains('q-val')) currentParams[idx].value = inp.value;
        inputEl.value = rebuildURL(res, currentParams);
      });
    });

    paramsBody.querySelectorAll('.btn-del-param').forEach(b => {
      b.addEventListener('click', () => {
        const idx = parseInt(b.dataset.idx, 10);
        currentParams.splice(idx, 1);
        inputEl.value = rebuildURL(res, currentParams);
        renderParamsTable(res);
      });
    });
  }

  inputEl.addEventListener('input', doParse);
  container.querySelector('#btn-url-add-param').addEventListener('click', () => {
    currentParams.push({ key: 'param_key', value: 'param_value' });
    const res = parseURL(inputEl.value);
    if (res.isValid) {
      inputEl.value = rebuildURL(res, currentParams);
      renderParamsTable(res);
    }
  });

  container.querySelector('#btn-copy-full-url').addEventListener('click', (e) => copyToClipboard(inputEl.value, e.currentTarget));

  attachStandardToolbarEvents(container, tool, (preset) => {
    inputEl.value = preset.value;
    doParse();
  });

  inputEl.value = tool.sample;
  doParse();
}

// ==========================================
// 15. HTTP REQUEST BUILDER & SIMULATOR
// ==========================================
function renderHTTPBuilder(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group flex-1 flex items-center gap-3">
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="http-opt-simulated" /> Offline Simulated Mock Mode
        </label>
        <select id="http-mock-status" class="form-control form-control-sm w-36" style="display: none;">
          <option value="200">Mock: 200 OK</option>
          <option value="201">Mock: 201 Created</option>
          <option value="204">Mock: 204 No Content</option>
          <option value="400">Mock: 400 Bad Request</option>
          <option value="401">Mock: 401 Unauthorized</option>
          <option value="404">Mock: 404 Not Found</option>
          <option value="500">Mock: 500 Server Error</option>
        </select>
      </div>
      <div class="actions-group flex items-center gap-2">
        <button class="btn btn-sm btn-secondary" id="btn-http-curl">${getIcon('terminal', 'icon-xs')} Copy cURL</button>
        <button class="btn btn-sm btn-secondary" id="btn-http-fetch">${getIcon('code', 'icon-xs')} Copy Fetch</button>
        <button class="btn btn-sm btn-primary" id="btn-http-send">${getIcon('play', 'icon-xs')} Send Request</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="http-builder-layout flex flex-col flex-1 overflow-y-auto">
      <div class="http-request-bar flex gap-2 mb-3">
        <select id="http-method" class="form-control w-28 font-bold">
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>
        <input type="text" id="http-url-input" class="form-control font-mono flex-1" placeholder="https://api.example.com/v1/endpoint" value="${tool.sample}" />
      </div>

      <div class="split-pane-layout">
        <div class="pane-column">
          <div class="pane-header"><span class="pane-title text-xs font-semibold">Request Body / Headers</span></div>
          <textarea id="http-req-body" class="code-editor font-mono" placeholder="Request JSON body..."></textarea>
        </div>
        <div class="pane-column">
          <div class="pane-header flex items-center justify-between">
            <span class="pane-title text-xs font-semibold">Response Output</span>
            <span id="http-res-badge"></span>
          </div>
          <textarea id="http-res-body" class="code-editor font-mono" readonly placeholder="Response status & payload will appear here..."></textarea>
        </div>
      </div>
    </div>
  `;

  const methodEl = container.querySelector('#http-method');
  const urlEl = container.querySelector('#http-url-input');
  const bodyEl = container.querySelector('#http-req-body');
  const resBodyEl = container.querySelector('#http-res-body');
  const resBadgeEl = container.querySelector('#http-res-badge');
  const simChk = container.querySelector('#http-opt-simulated');
  const mockStatusEl = container.querySelector('#http-mock-status');

  simChk.addEventListener('change', () => {
    mockStatusEl.style.display = simChk.checked ? 'block' : 'none';
  });

  async function doSend() {
    resBadgeEl.innerHTML = `<span class="badge badge-secondary text-xs">Sending...</span>`;
    const res = await executeHTTPRequest({
      method: methodEl.value,
      url: urlEl.value,
      body: bodyEl.value,
      isSimulated: simChk.checked,
      mockStatus: parseInt(mockStatusEl.value, 10)
    });

    if (res.success) {
      resBadgeEl.innerHTML = `<span class="badge ${res.status < 300 ? 'badge-success' : 'badge-danger'} font-mono">${res.status} ${res.statusText} (${res.duration}ms)</span>`;
      resBodyEl.value = res.body;
      addToolHistory(tool.id, `${methodEl.value} ${urlEl.value}`);
    } else {
      resBadgeEl.innerHTML = `<span class="badge badge-danger">Failed</span>`;
      resBodyEl.value = res.error;
    }
  }

  container.querySelector('#btn-http-send').addEventListener('click', doSend);
  container.querySelector('#btn-http-curl').addEventListener('click', (e) => {
    const curl = generateCurlCommand({ method: methodEl.value, url: urlEl.value, body: bodyEl.value });
    copyToClipboard(curl, e.currentTarget);
  });
  container.querySelector('#btn-http-fetch').addEventListener('click', (e) => {
    const fetchCode = generateFetchSnippet({ method: methodEl.value, url: urlEl.value, body: bodyEl.value });
    copyToClipboard(fetchCode, e.currentTarget);
  });

  attachStandardToolbarEvents(container, tool, (preset) => {
    urlEl.value = preset.url;
    methodEl.value = preset.method || 'GET';
    bodyEl.value = preset.body || '';
    doSend();
  });
}

// ==========================================
// 16. LOREM / MOCK DATA GENERATOR
// ==========================================
function renderMockGenerator(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    showPresets: false,
    toolbarHTML: `
      <div class="options-group flex items-center gap-2 flex-wrap">
        <label class="opt-label text-xs font-semibold text-muted" for="mock-type">Dataset Type:</label>
        <select id="mock-type" class="form-control form-control-sm">
          <option value="users">Enterprise SaaS Users (JSON)</option>
          <option value="orders">E-Commerce Orders & Line Items (JSON)</option>
          <option value="logs">Server Access Logs (Nginx / Combined)</option>
          <option value="kubernetes">Kubernetes Pod Telemetry (JSON)</option>
          <option value="paragraphs">Lorem Paragraphs</option>
          <option value="sentences">Lorem Sentences</option>
          <option value="words">Lorem Words</option>
        </select>
        <label class="opt-label text-xs font-semibold text-muted" for="mock-count">Count:</label>
        <input type="number" id="mock-count" class="form-control form-control-sm w-20" min="1" max="100" value="5" />
      </div>
      <div class="actions-group flex items-center gap-2">
        <button class="btn btn-sm btn-primary" id="btn-mock-gen">${getIcon('refresh', 'icon-xs')} Generate</button>
        <button class="btn btn-sm btn-secondary" id="btn-mock-copy">${getIcon('copy', 'icon-xs')} Copy</button>
        <button class="btn btn-sm btn-secondary" id="btn-mock-download">${getIcon('download', 'icon-xs')} Download</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `<textarea id="mock-output" class="code-editor font-mono flex-1 min-h-80" spellcheck="false"></textarea>`;

  const outEl = container.querySelector('#mock-output');
  const typeEl = container.querySelector('#mock-type');
  const countEl = container.querySelector('#mock-count');

  function doGen() {
    const count = parseInt(countEl.value, 10) || 5;
    const type = typeEl.value;

    if (type === 'users') outEl.value = generateMockUsers(count);
    else if (type === 'orders') outEl.value = generateMockOrders(count);
    else if (type === 'logs') outEl.value = generateMockLogs(count);
    else if (type === 'kubernetes') outEl.value = generateMockKubernetes(count);
    else outEl.value = generateLorem(type, count);

    updateStatusBar(container, outEl.value);
  }

  container.querySelector('#btn-mock-gen').addEventListener('click', doGen);
  typeEl.addEventListener('change', doGen);
  countEl.addEventListener('change', doGen);
  container.querySelector('#btn-mock-copy').addEventListener('click', (e) => copyToClipboard(outEl.value, e.currentTarget));
  container.querySelector('#btn-mock-download').addEventListener('click', () => {
    const isJson = ['users', 'orders', 'kubernetes'].includes(typeEl.value);
    downloadTextFile(`mock_dataset.${isJson ? 'json' : 'txt'}`, outEl.value, isJson ? 'application/json' : 'text/plain');
  });

  attachStandardToolbarEvents(container, tool, null);
  doGen();
}

// ==========================================
// 17. CASE CONVERTER
// ==========================================
function renderCaseConverter(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="actions-group flex items-center gap-2">
        <button class="btn btn-sm btn-secondary" id="btn-copy-cases">${getIcon('copy', 'icon-xs')} Copy All Formats</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="case-converter-layout flex flex-col flex-1 overflow-y-auto">
      <div class="form-group mb-4">
        <label class="form-label font-semibold text-xs" for="case-input">Input Text / Identifier *</label>
        <input type="text" id="case-input" class="form-control font-mono text-base" placeholder="Enter variable name, slug, or sentence to convert across 12 code cases..." />
      </div>
      <div class="metrics-grid" id="case-results-grid"></div>
    </div>
  `;

  const inputEl = container.querySelector('#case-input');
  const gridEl = container.querySelector('#case-results-grid');

  const CASES = [
    { key: 'camelCase', label: 'camelCase' },
    { key: 'PascalCase', label: 'PascalCase' },
    { key: 'snake_case', label: 'snake_case' },
    { key: 'kebab-case', label: 'kebab-case' },
    { key: 'CONSTANT_CASE', label: 'CONSTANT_CASE' },
    { key: 'Title Case', label: 'Title Case' },
    { key: 'sentence case', label: 'Sentence case' },
    { key: 'dot.case', label: 'dot.case' },
    { key: 'path/case', label: 'path/case' },
    { key: 'Train-Case', label: 'Train-Case' },
    { key: 'alternating', label: 'aLtErNaTiNg' },
    { key: 'reverse', label: 'Reverse String' }
  ];

  function doCases() {
    gridEl.innerHTML = CASES.map(c => {
      const converted = convertCase(inputEl.value, c.key);
      return `
        <div class="metric-card">
          <span class="metric-label">${c.label}</span>
          <div class="metric-value font-mono text-base text-primary break-all">${escapeHTML(converted)}</div>
          <button class="btn btn-xs btn-ghost btn-copy-case" data-val="${escapeHTML(converted)}">Copy</button>
        </div>
      `;
    }).join('');

    gridEl.querySelectorAll('.btn-copy-case').forEach(b => {
      b.addEventListener('click', () => copyToClipboard(b.dataset.val, b));
    });
    addToolHistory(tool.id, inputEl.value);
    updateStatusBar(container, inputEl.value);
  }

  inputEl.addEventListener('input', doCases);
  container.querySelector('#btn-copy-cases').addEventListener('click', (e) => {
    const all = CASES.map(c => `${c.label}: ${convertCase(inputEl.value, c.key)}`).join('\n');
    copyToClipboard(all, e.currentTarget);
  });

  attachStandardToolbarEvents(container, tool, (preset) => {
    inputEl.value = preset.value;
    doCases();
  });

  inputEl.value = tool.sample;
  doCases();
}

// ==========================================
// 18. LINE SORTER
// ==========================================
function renderLineSorter(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group flex items-center gap-2">
        <select id="sort-mode" class="form-control form-control-sm" aria-label="Sort order mode">
          <option value="asc">Alphabetical (A &rarr; Z)</option>
          <option value="desc">Alphabetical (Z &rarr; A)</option>
          <option value="length">Line Length (Short &rarr; Long)</option>
          <option value="length-desc">Line Length (Long &rarr; Short)</option>
          <option value="reverse">Reverse Line Order</option>
          <option value="shuffle">Random Shuffle</option>
        </select>
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="sort-case" /> Case Sensitive
        </label>
      </div>
      <div class="actions-group flex items-center gap-2">
        <button class="btn btn-sm btn-primary" id="btn-do-sort">${getIcon('sort', 'icon-xs')} Sort Lines</button>
        <button class="btn btn-sm btn-secondary" id="btn-copy-sort">${getIcon('copy', 'icon-xs')} Copy</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="split-pane-layout">
      <div class="pane-column">
        <div class="pane-header"><span class="pane-title text-xs font-semibold">Unsorted Input</span></div>
        <textarea id="sort-input" class="code-editor font-mono" placeholder="Paste lines to sort..."></textarea>
      </div>
      <div class="pane-column">
        <div class="pane-header"><span class="pane-title text-xs font-semibold">Sorted Output</span></div>
        <textarea id="sort-output" class="code-editor font-mono" readonly placeholder="Sorted output will appear here..."></textarea>
      </div>
    </div>
  `;

  const inEl = container.querySelector('#sort-input');
  const outEl = container.querySelector('#sort-output');
  const modeEl = container.querySelector('#sort-mode');
  const caseEl = container.querySelector('#sort-case');

  function doSort() {
    outEl.value = sortLines(inEl.value, modeEl.value, caseEl.checked);
    updateStatusBar(container, outEl.value);
    addToolHistory(tool.id, inEl.value);
  }

  container.querySelector('#btn-do-sort').addEventListener('click', doSort);
  inEl.addEventListener('input', doSort);
  modeEl.addEventListener('change', doSort);
  caseEl.addEventListener('change', doSort);
  container.querySelector('#btn-copy-sort').addEventListener('click', (e) => copyToClipboard(outEl.value, e.currentTarget));

  setupFileDrop(inEl, (content) => {
    inEl.value = content;
    doSort();
  });

  attachStandardToolbarEvents(container, tool, (preset) => {
    inEl.value = preset.value;
    doSort();
  });

  inEl.value = tool.sample;
  doSort();
}

// ==========================================
// 19. DUPLICATE LINE REMOVER
// ==========================================
function renderDuplicateRemover(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group flex items-center gap-2">
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="dedup-case" /> Case Sensitive
        </label>
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="dedup-trim" checked /> Trim Whitespace
        </label>
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="dedup-empty" checked /> Remove Empty
        </label>
      </div>
      <div class="actions-group flex items-center gap-2">
        <span class="badge badge-primary font-mono text-xs" id="dedup-stats-badge">0 duplicates removed</span>
        <button class="btn btn-sm btn-secondary" id="btn-copy-dedup">${getIcon('copy', 'icon-xs')} Copy</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="split-pane-layout">
      <div class="pane-column">
        <div class="pane-header"><span class="pane-title text-xs font-semibold">Raw Input Lines</span></div>
        <textarea id="dedup-input" class="code-editor font-mono" placeholder="Paste lines with duplicates..."></textarea>
      </div>
      <div class="pane-column">
        <div class="pane-header"><span class="pane-title text-xs font-semibold">Deduplicated Output</span></div>
        <textarea id="dedup-output" class="code-editor font-mono" readonly placeholder="Unique lines..."></textarea>
      </div>
    </div>
  `;

  const inEl = container.querySelector('#dedup-input');
  const outEl = container.querySelector('#dedup-output');
  const caseEl = container.querySelector('#dedup-case');
  const trimEl = container.querySelector('#dedup-trim');
  const emptyEl = container.querySelector('#dedup-empty');
  const badgeEl = container.querySelector('#dedup-stats-badge');

  function doDedup() {
    const res = removeDuplicateLines(inEl.value, {
      caseSensitive: caseEl.checked,
      trimLines: trimEl.checked,
      removeEmpty: emptyEl.checked
    });
    outEl.value = res.output;
    badgeEl.textContent = `${res.removedCount} duplicates removed (${res.uniqueCount} unique)`;
    updateStatusBar(container, outEl.value);
    addToolHistory(tool.id, inEl.value);
  }

  inEl.addEventListener('input', doDedup);
  caseEl.addEventListener('change', doDedup);
  trimEl.addEventListener('change', doDedup);
  emptyEl.addEventListener('change', doDedup);
  container.querySelector('#btn-copy-dedup').addEventListener('click', (e) => copyToClipboard(outEl.value, e.currentTarget));

  setupFileDrop(inEl, (content) => {
    inEl.value = content;
    doDedup();
  });

  attachStandardToolbarEvents(container, tool, (preset) => {
    inEl.value = preset.value;
    doDedup();
  });

  inEl.value = tool.sample;
  doDedup();
}

// ==========================================
// 20. WHITESPACE CLEANER
// ==========================================
function renderWhitespaceCleaner(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group flex items-center gap-2 flex-wrap">
        <label class="checkbox-label text-xs"><input type="checkbox" id="clean-trim" checked /> Trim Lines</label>
        <label class="checkbox-label text-xs"><input type="checkbox" id="clean-empty" checked /> Remove Empty Lines</label>
        <label class="checkbox-label text-xs"><input type="checkbox" id="clean-collapse" checked /> Collapse Spaces</label>
        <label class="checkbox-label text-xs"><input type="checkbox" id="clean-tabs" /> Tabs to Spaces</label>
      </div>
      <div class="actions-group flex items-center gap-2">
        <button class="btn btn-sm btn-secondary" id="btn-copy-clean">${getIcon('copy', 'icon-xs')} Copy</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="split-pane-layout">
      <div class="pane-column">
        <div class="pane-header"><span class="pane-title text-xs font-semibold">Raw Text</span></div>
        <textarea id="clean-input" class="code-editor font-mono" placeholder="Paste messy text with extra whitespace or mixed tabs..."></textarea>
      </div>
      <div class="pane-column">
        <div class="pane-header"><span class="pane-title text-xs font-semibold">Cleaned Result</span></div>
        <textarea id="clean-output" class="code-editor font-mono" readonly placeholder="Cleaned text..."></textarea>
      </div>
    </div>
  `;

  const inEl = container.querySelector('#clean-input');
  const outEl = container.querySelector('#clean-output');
  const trimEl = container.querySelector('#clean-trim');
  const emptyEl = container.querySelector('#clean-empty');
  const collapseEl = container.querySelector('#clean-collapse');
  const tabsEl = container.querySelector('#clean-tabs');

  function doClean() {
    outEl.value = cleanWhitespace(inEl.value, {
      trimLines: trimEl.checked,
      removeEmptyLines: emptyEl.checked,
      collapseSpaces: collapseEl.checked,
      tabsToSpaces: tabsEl.checked
    });
    updateStatusBar(container, outEl.value);
    addToolHistory(tool.id, inEl.value);
  }

  inEl.addEventListener('input', doClean);
  trimEl.addEventListener('change', doClean);
  emptyEl.addEventListener('change', doClean);
  collapseEl.addEventListener('change', doClean);
  tabsEl.addEventListener('change', doClean);
  container.querySelector('#btn-copy-clean').addEventListener('click', (e) => copyToClipboard(outEl.value, e.currentTarget));

  setupFileDrop(inEl, (content) => {
    inEl.value = content;
    doClean();
  });

  attachStandardToolbarEvents(container, tool, (preset) => {
    inEl.value = preset.value;
    doClean();
  });

  inEl.value = tool.sample;
  doClean();
}
