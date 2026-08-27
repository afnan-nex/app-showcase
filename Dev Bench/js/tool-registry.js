/**
 * DevBench - Tool Registry & UI View Renderer
 * Defines metadata, options, sample payloads, and interactive UI for all 20 developer utilities.
 */

import { getIcon } from './icons.js';
import { addToolHistory, getToolHistory, saveSnippet, getSavedSnippets } from './storage.js';

// Import tool algorithms
import { formatJSON, validateJSON, buildJSONTreeHTML } from './tools/json-tools.js';
import { encodeBase64, decodeBase64, encodeURL, decodeURL, encodeHTMLEntities, decodeHTMLEntities } from './tools/encoding-tools.js';
import { decodeJWT, generateHashes, generateUUID, generateBulkUUIDs } from './tools/security-tools.js';
import { testRegex, computeTextDiff, sortLines, removeDuplicateLines, cleanWhitespace, convertCase } from './tools/text-tools.js';
import { parseURL, rebuildURL, executeHTTPRequest, generateCurlCommand } from './tools/network-tools.js';
import { convertTimestamp, parseAndConvertColor, generateLorem, generateMockUsers } from './tools/conversion-tools.js';

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
    sample: '{"name":"DevBench","version":1.0,"features":["offline","zero-backend","fast"],"settings":{"theme":"dark","autoSave":true,"nullField":null}}',
    render: renderJSONFormatter
  },
  // 2. JSON Validator
  {
    id: 'json-validator',
    title: 'JSON Validator',
    category: TOOL_CATEGORIES.JSON_DATA,
    icon: 'json',
    desc: 'Syntax validation with exact line/column indicators and error pointers',
    sample: '{\n  "service": "auth-api",\n  "port": 8080,\n  "endpoints": ["/login", "/signup",]\n}',
    render: renderJSONValidator
  },
  // 3. JSON Tree Viewer
  {
    id: 'json-tree',
    title: 'JSON Tree Viewer',
    category: TOOL_CATEGORIES.JSON_DATA,
    icon: 'tree',
    desc: 'Interactive collapsible AST tree with type chips, node search, and path copy',
    sample: '{"user":{"id":101,"profile":{"name":"Alex Vance","roles":["admin","developer"],"details":{"department":"Engineering","active":true,"tags":["core","security"]}},"logins":42}}',
    render: renderJSONTreeViewer
  },
  // 4. Base64 Encoder/Decoder
  {
    id: 'base64',
    title: 'Base64 Encode/Decode',
    category: TOOL_CATEGORIES.ENCODING_SEC,
    icon: 'base64',
    desc: 'UTF-8 safe Base64 encoder, decoder, URL-safe mode, and file data URLs',
    sample: 'Welcome to DevBench! High-performance browser workstation ⚡',
    render: renderBase64
  },
  // 5. URL Encoder/Decoder
  {
    id: 'url-encode',
    title: 'URL Encode/Decode',
    category: TOOL_CATEGORIES.ENCODING_SEC,
    icon: 'url',
    desc: 'Encode and decode query strings, form data, and URI components',
    sample: 'https://api.devbench.local/v1/search?query=developer tools&filter=active&sort=desc',
    render: renderURLEncode
  },
  // 6. JWT Decoder
  {
    id: 'jwt-decoder',
    title: 'JWT Decoder',
    category: TOOL_CATEGORIES.ENCODING_SEC,
    icon: 'jwt',
    desc: 'Decode JSON Web Token header, payload claims, and expiration timestamps',
    sample: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggVmFuY2UiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MjQ4MDAwMDAsImV4cCI6MTc4Nzg3MjAwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    render: renderJWTDecoder
  },
  // 7. UUID / ID Generator
  {
    id: 'uuid-gen',
    title: 'UUID / ID Generator',
    category: TOOL_CATEGORIES.ENCODING_SEC,
    icon: 'uuid',
    desc: 'Generate UUID v4, v7 draft, ULID, and bulk identifier lists',
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
    sample: 'Contact us at support@devbench.app or sales@company.org. Order #12345 confirmed.',
    render: renderRegexTester
  },
  // 10. Text Diff Viewer
  {
    id: 'text-diff',
    title: 'Text Diff Viewer',
    category: TOOL_CATEGORIES.TEXT_CODE,
    icon: 'diff',
    desc: 'Line-by-line and unified comparison highlighting additions and deletions',
    sample: 'function calculateTotal(items) {\n  let sum = 0;\n  for (let i = 0; i < items.length; i++) {\n    sum += items[i].price;\n  }\n  return sum;\n}',
    sampleModified: 'function calculateTotal(items) {\n  if (!items || items.length === 0) return 0;\n  return items.reduce((sum, item) => sum + item.price, 0);\n}',
    render: renderTextDiff
  },
  // 11. Hash Generator
  {
    id: 'hash-gen',
    title: 'Hash Generator',
    category: TOOL_CATEGORIES.ENCODING_SEC,
    icon: 'hash',
    desc: 'Web Crypto SHA-256, SHA-384, SHA-512, SHA-1, MD5, CRC32, and HMAC checksums',
    sample: 'DevBench Cryptographic Checksum Payload 2026',
    render: renderHashGenerator
  },
  // 12. Color Converter & Palette
  {
    id: 'color-converter',
    title: 'Color & Contrast Inspector',
    category: TOOL_CATEGORIES.CONVERTERS,
    icon: 'color',
    desc: 'Convert HEX, RGB, HSL, HSV, CMYK and check WCAG contrast compliance',
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
    sample: '<div class="alert alert-info">Hello "DevBench" & Welcome <script>alert(1)</script>!</div>',
    render: renderHTMLEntities
  },
  // 14. URL Parser
  {
    id: 'url-parser',
    title: 'URL & Query Parser',
    category: TOOL_CATEGORIES.NETWORK_API,
    icon: 'url',
    desc: 'Inspect protocol, host, port, and live two-way query parameters table',
    sample: 'https://api.github.com:443/repos/devbench/core/pulls?state=open&sort=created&direction=desc&page=1',
    render: renderURLParser
  },
  // 15. HTTP Request Builder & Simulator
  {
    id: 'http-builder',
    title: 'HTTP Request Builder',
    category: TOOL_CATEGORIES.NETWORK_API,
    icon: 'http',
    desc: 'Construct API requests with custom headers/body, live fetch, simulated offline mock, and cURL export',
    sample: 'https://jsonplaceholder.typicode.com/posts/1',
    render: renderHTTPBuilder
  },
  // 16. Lorem / Mock Data Generator
  {
    id: 'mock-generator',
    title: 'Lorem & Mock Generator',
    category: TOOL_CATEGORIES.CONVERTERS,
    icon: 'lorem',
    desc: 'Generate Lorem Ipsum copy and structured mock JSON user & product profiles',
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
    sample: 'user_authentication_service_v2',
    render: renderCaseConverter
  },
  // 18. Line Sorter
  {
    id: 'line-sorter',
    title: 'Line Sorter',
    category: TOOL_CATEGORIES.TEXT_CODE,
    icon: 'sort',
    desc: 'Sort text lines alphabetically (A-Z, Z-A), natural numbers, length, or shuffle',
    sample: 'banana\nApple\n100 items\n20 items\nOrange\nCherry\n2 items',
    render: renderLineSorter
  },
  // 19. Duplicate Line Remover
  {
    id: 'duplicate-remover',
    title: 'Duplicate Line Remover',
    category: TOOL_CATEGORIES.TEXT_CODE,
    icon: 'dedup',
    desc: 'Deduplicate lines with case-sensitive toggle, whitespace trimming, and duplicate counts',
    sample: 'alpha\nbeta\ngamma\nalpha\ndelta\nbeta\nepsilon\nalpha',
    render: renderDuplicateRemover
  },
  // 20. Whitespace Cleaner
  {
    id: 'whitespace-cleaner',
    title: 'Whitespace Cleaner',
    category: TOOL_CATEGORIES.TEXT_CODE,
    icon: 'clean',
    desc: 'Trim trailing spaces, collapse multiple spaces, tab-to-space, and normalize line endings',
    sample: '   Line with leading & trailing spaces    \n\n\n   Multiple    spaces    between    words   \n\tTabbed line 1\n\tTabbed line 2\n\n',
    render: renderWhitespaceCleaner
  }
];

export function getToolById(id) {
  return TOOLS.find(t => t.id === id) || TOOLS[0];
}

// --- Common UI Shell Helper ---
function createSplitToolShell({ tool, toolbarHTML = '', showSampleBtn = true, sampleAction = null }) {
  return `
    <div class="tool-workspace" data-tool-id="${tool.id}">
      <!-- Tool Header Bar -->
      <div class="tool-header">
        <div class="tool-title-group">
          <div class="tool-icon-box">${getIcon(tool.icon, 'icon-md')}</div>
          <div>
            <h1 class="tool-title">${tool.title}</h1>
            <p class="tool-desc">${tool.desc}</p>
          </div>
        </div>
        <div class="tool-header-actions">
          <button class="btn btn-sm btn-ghost btn-fav-toggle" data-id="${tool.id}" title="Toggle Favorite">
            ${getIcon('star', 'icon-sm')}
          </button>
          <button class="btn btn-sm btn-ghost btn-open-history" data-id="${tool.id}" title="Input History">
            ${getIcon('history', 'icon-sm')} History
          </button>
          <button class="btn btn-sm btn-ghost btn-save-snippet" data-id="${tool.id}" title="Save Snippet">
            ${getIcon('bookmark', 'icon-sm')} Save Snippet
          </button>
          ${showSampleBtn ? `
            <button class="btn btn-sm btn-secondary btn-load-sample" title="Load Sample Payload">
              ${getIcon('sparkles', 'icon-xs')} Sample
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Tool Options / Action Bar -->
      ${toolbarHTML ? `<div class="tool-options-bar">${toolbarHTML}</div>` : ''}

      <!-- Main Split Work Area (Injected by specific tool) -->
      <div class="tool-main-area" id="tool-main-content"></div>

      <!-- Live Status Bar -->
      <div class="tool-status-bar">
        <div class="status-item font-mono text-xs" id="status-lines-chars">Lines: 0 &bull; Chars: 0 &bull; Bytes: 0 B</div>
        <div class="status-item font-mono text-xs" id="status-timing">Ready</div>
      </div>
    </div>
  `;
}

function updateStatusBar(container, text, execTimeMs = null) {
  const lines = text ? text.split('\n').length : 0;
  const chars = text ? text.length : 0;
  const bytes = text ? new Blob([text]).size : 0;

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
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function attachStandardToolbarEvents(container, tool, onSampleLoad = null) {
  // Favorite toggle
  const favBtn = container.querySelector('.btn-fav-toggle');
  favBtn?.addEventListener('click', () => {
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

  // Sample load
  if (onSampleLoad) {
    container.querySelector('.btn-load-sample')?.addEventListener('click', onSampleLoad);
  }
}

function copyToClipboard(text, btnElement) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    if (btnElement) {
      const originalHTML = btnElement.innerHTML;
      btnElement.innerHTML = `${getIcon('check', 'icon-xs')} Copied!`;
      btnElement.classList.add('btn-success-flash');
      setTimeout(() => {
        btnElement.innerHTML = originalHTML;
        btnElement.classList.remove('btn-success-flash');
      }, 1800);
    }
  });
}

function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ==========================================
// 1. JSON FORMATTER
// ==========================================
function renderJSONFormatter(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group">
        <label class="opt-label text-xs">Indentation:</label>
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
      </div>
      <div class="actions-group">
        <button class="btn btn-sm btn-primary" id="btn-format-json">${getIcon('play', 'icon-xs')} Format</button>
        <button class="btn btn-sm btn-secondary" id="btn-copy-json">${getIcon('copy', 'icon-xs')} Copy</button>
        <button class="btn btn-sm btn-secondary" id="btn-download-json">${getIcon('download', 'icon-xs')} Download</button>
        <button class="btn btn-sm btn-ghost" id="btn-clear-json">${getIcon('trash', 'icon-xs')} Clear</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="split-pane-layout">
      <div class="pane-column">
        <div class="pane-header">
          <span class="pane-title text-xs font-semibold">JSON Input</span>
          <button class="btn-icon-xs" id="btn-paste-json" title="Paste from clipboard">${getIcon('upload', 'icon-xs')}</button>
        </div>
        <textarea id="json-input" class="code-editor font-mono" placeholder="Paste unformatted JSON here..." spellcheck="false"></textarea>
      </div>
      <div class="pane-column">
        <div class="pane-header">
          <span class="pane-title text-xs font-semibold">Formatted Output</span>
        </div>
        <div id="json-error-banner" class="editor-error-banner" style="display: none;"></div>
        <textarea id="json-output" class="code-editor font-mono" readonly placeholder="Formatted output will appear here..." spellcheck="false"></textarea>
      </div>
    </div>
  `;

  const inputEl = container.querySelector('#json-input');
  const outputEl = container.querySelector('#json-output');
  const errorEl = container.querySelector('#json-error-banner');
  const indentEl = container.querySelector('#json-opt-indent');
  const sortEl = container.querySelector('#json-opt-sort');
  const nullsEl = container.querySelector('#json-opt-nulls');

  function runFormat() {
    const start = performance.now();
    const result = formatJSON(inputEl.value, {
      indent: indentEl.value,
      sortKeys: sortEl.checked,
      removeNulls: nullsEl.checked
    });
    const duration = Math.round(performance.now() - start);

    if (result.success) {
      errorEl.style.display = 'none';
      outputEl.value = result.output;
      updateStatusBar(container, result.output, duration);
      addToolHistory(tool.id, inputEl.value);
    } else {
      errorEl.style.display = 'block';
      errorEl.innerHTML = `${getIcon('alert', 'icon-xs')} <strong>Syntax Error:</strong> ${result.error}${result.errorPos?.line ? ` (Line ${result.errorPos.line}, Col ${result.errorPos.column})` : ''}`;
      outputEl.value = '';
    }
  }

  // Event bindings
  container.querySelector('#btn-format-json').addEventListener('click', runFormat);
  inputEl.addEventListener('input', () => { updateStatusBar(container, inputEl.value); runFormat(); });
  indentEl.addEventListener('change', runFormat);
  sortEl.addEventListener('change', runFormat);
  nullsEl.addEventListener('change', runFormat);

  container.querySelector('#btn-copy-json').addEventListener('click', (e) => copyToClipboard(outputEl.value, e.currentTarget));
  container.querySelector('#btn-download-json').addEventListener('click', () => downloadTextFile('formatted.json', outputEl.value));
  container.querySelector('#btn-clear-json').addEventListener('click', () => { inputEl.value = ''; outputEl.value = ''; errorEl.style.display = 'none'; updateStatusBar(container, ''); });
  container.querySelector('#btn-paste-json').addEventListener('click', async () => {
    try { inputEl.value = await navigator.clipboard.readText(); runFormat(); } catch(e){}
  });

  attachStandardToolbarEvents(container, tool, () => {
    inputEl.value = tool.sample;
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
      <div class="actions-group">
        <button class="btn btn-sm btn-primary" id="btn-validate-json">${getIcon('check', 'icon-xs')} Validate Now</button>
        <button class="btn btn-sm btn-ghost" id="btn-clear-val">${getIcon('trash', 'icon-xs')} Clear</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="validator-layout">
      <div id="validator-status-card" class="card p-4 mb-4">
        <div class="text-muted text-sm">Enter JSON below to perform syntax inspection.</div>
      </div>
      <div class="form-group mb-0 flex-1 flex flex-col">
        <textarea id="val-input" class="code-editor font-mono flex-1 min-h-80" placeholder="Paste JSON here to validate..." spellcheck="false"></textarea>
      </div>
    </div>
  `;

  const inputEl = container.querySelector('#val-input');
  const statusEl = container.querySelector('#validator-status-card');

  function runValidation() {
    const val = validateJSON(inputEl.value);
    if (!inputEl.value.trim()) {
      statusEl.className = 'card p-4 mb-4';
      statusEl.innerHTML = `<div class="text-muted text-sm">Enter JSON above to perform syntax inspection.</div>`;
      return;
    }

    if (val.isValid) {
      statusEl.className = 'card p-4 mb-4 border-success bg-success-subtle';
      statusEl.innerHTML = `
        <div class="flex items-center gap-2 text-emerald font-semibold">
          ${getIcon('check', 'icon-sm')} Valid JSON Document
        </div>
        <div class="text-xs text-secondary mt-1">${val.message} &bull; Size: ${formatBytes(val.size)}</div>
      `;
    } else {
      statusEl.className = 'card p-4 mb-4 border-danger bg-danger-subtle';
      statusEl.innerHTML = `
        <div class="flex items-center gap-2 text-rose font-semibold">
          ${getIcon('alert', 'icon-sm')} Invalid JSON Syntax
        </div>
        <div class="text-xs text-primary font-mono mt-1">${val.message}</div>
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

  attachStandardToolbarEvents(container, tool, () => {
    inputEl.value = tool.sample;
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
      <div class="options-group flex-1">
        <input type="text" id="tree-search" class="form-control form-control-sm" placeholder="Filter keys or values in tree..." />
      </div>
      <div class="actions-group">
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
        <textarea id="tree-raw-input" class="code-editor font-mono" placeholder="Paste JSON here..." spellcheck="false"></textarea>
      </div>
      <div class="pane-column">
        <div class="pane-header">
          <span class="pane-title text-xs font-semibold">Interactive AST Tree</span>
          <span class="text-xs text-muted">Click keys to copy path</span>
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
      treeEl.innerHTML = '<div class="text-muted p-4">Enter valid JSON on the left to render tree.</div>';
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
          node.classList.toggle('open');
        });
      });

      // Path copier
      treeEl.querySelectorAll('.tree-key').forEach(keyEl => {
        keyEl.addEventListener('click', () => {
          const path = keyEl.dataset.path;
          copyToClipboard(path, null);
          const orig = keyEl.innerHTML;
          keyEl.innerHTML = `<span class="badge badge-success text-xs">Copied Path!</span>`;
          setTimeout(() => keyEl.innerHTML = orig, 1200);
        });
      });

      updateStatusBar(container, inputEl.value);
      addToolHistory(tool.id, inputEl.value);
    } catch (err) {
      treeEl.innerHTML = `<div class="p-4 text-rose">${getIcon('alert', 'icon-xs')} Invalid JSON: ${err.message}</div>`;
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

  attachStandardToolbarEvents(container, tool, () => {
    inputEl.value = tool.sample;
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
      <div class="options-group">
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="b64-opt-urlsafe" /> URL-Safe Mode (- and _)
        </label>
      </div>
      <div class="actions-group">
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
        <textarea id="b64-text-input" class="code-editor font-mono" placeholder="Type or paste text to encode..." spellcheck="false"></textarea>
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

  function doEncode() {
    try {
      b64Output.value = encodeBase64(textInput.value, urlSafeChk.checked);
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

  container.querySelector('#btn-b64-swap').addEventListener('click', () => {
    const tmp = textInput.value;
    textInput.value = b64Output.value;
    b64Output.value = tmp;
  });

  container.querySelector('#btn-b64-copy').addEventListener('click', (e) => copyToClipboard(b64Output.value, e.currentTarget));
  container.querySelector('#btn-b64-clear').addEventListener('click', () => { textInput.value = ''; b64Output.value = ''; updateStatusBar(container, ''); });

  attachStandardToolbarEvents(container, tool, () => {
    textInput.value = tool.sample;
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
      <div class="options-group">
        <label class="opt-label text-xs">Encoding Mode:</label>
        <select id="url-opt-mode" class="form-control form-control-sm">
          <option value="component">encodeURIComponent (Standard)</option>
          <option value="uri">encodeURI (Full URL)</option>
          <option value="form">application/x-www-form-urlencoded (Space to +)</option>
        </select>
      </div>
      <div class="actions-group">
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

  attachStandardToolbarEvents(container, tool, () => {
    plainEl.value = tool.sample;
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
      <div class="actions-group">
        <button class="btn btn-sm btn-primary" id="btn-decode-jwt">${getIcon('play', 'icon-xs')} Decode Token</button>
        <button class="btn btn-sm btn-secondary" id="btn-copy-payload">${getIcon('copy', 'icon-xs')} Copy Payload</button>
        <button class="btn btn-sm btn-ghost" id="btn-clear-jwt">${getIcon('trash', 'icon-xs')} Clear</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="jwt-layout">
      <div class="form-group mb-4">
        <label class="form-label font-semibold text-xs">Encoded JWT String *</label>
        <textarea id="jwt-input" class="code-editor font-mono min-h-24" placeholder="Paste eyJhbGci... token here"></textarea>
      </div>

      <!-- Security Warning Banner (Prompt 8C Requirement) -->
      <div class="alert alert-warning mb-4">
        <div class="alert-icon">${getIcon('alert', 'icon-md')}</div>
        <div class="alert-content">
          <div class="alert-title">Client-Side Inspection Notice</div>
          <p class="alert-desc text-xs">This tool decodes token payload headers and claims in-browser. Signatures are not cryptographically verified here; validation must be enforced on your authentication server.</p>
        </div>
      </div>

      <div class="split-pane-layout">
        <div class="pane-column">
          <div class="pane-header">
            <span class="pane-title text-xs font-semibold text-rose">Header (Algorithm & Typ)</span>
          </div>
          <pre id="jwt-header-out" class="code-editor font-mono bg-surface-elevated"></pre>
        </div>
        <div class="pane-column">
          <div class="pane-header">
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
  const expBadgeEl = container.querySelector('#jwt-exp-badge');

  function doDecode() {
    const res = decodeJWT(inputEl.value);
    if (res.success) {
      headerEl.textContent = res.rawHeader;
      payloadEl.textContent = res.rawPayload;

      if (res.expirationStatus) {
        expBadgeEl.innerHTML = `
          <span class="badge ${res.expirationStatus.isExpired ? 'badge-danger' : 'badge-success'} text-xs">
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
      expBadgeEl.innerHTML = '';
    }
  }

  container.querySelector('#btn-decode-jwt').addEventListener('click', doDecode);
  inputEl.addEventListener('input', doDecode);
  container.querySelector('#btn-copy-payload').addEventListener('click', (e) => copyToClipboard(payloadEl.textContent, e.currentTarget));
  container.querySelector('#btn-clear-jwt').addEventListener('click', () => { inputEl.value = ''; headerEl.textContent = ''; payloadEl.textContent = ''; expBadgeEl.innerHTML = ''; });

  attachStandardToolbarEvents(container, tool, () => {
    inputEl.value = tool.sample;
    doDecode();
  });

  inputEl.value = tool.sample;
  doDecode();
}

// ==========================================
// 7. UUID GENERATOR
// ==========================================
function renderUUIDGenerator(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    showSampleBtn: false,
    toolbarHTML: `
      <div class="options-group">
        <label class="opt-label text-xs">Format:</label>
        <select id="uuid-opt-ver" class="form-control form-control-sm">
          <option value="v4">UUID v4 (Random / Cryptographic)</option>
          <option value="v7">UUID v7 (Time-Ordered Draft)</option>
          <option value="ulid">ULID (Universally Unique Lexicographically Sortable)</option>
        </select>
        <label class="opt-label text-xs">Count:</label>
        <input type="number" id="uuid-opt-count" class="form-control form-control-sm w-20" min="1" max="1000" value="10" />
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="uuid-opt-upper" /> Uppercase
        </label>
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="uuid-opt-hyphens" checked /> Hyphens
        </label>
      </div>
      <div class="actions-group">
        <button class="btn btn-sm btn-primary" id="btn-uuid-generate">${getIcon('refresh', 'icon-xs')} Generate</button>
        <button class="btn btn-sm btn-secondary" id="btn-uuid-copy">${getIcon('copy', 'icon-xs')} Copy All</button>
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
  const upperEl = container.querySelector('#uuid-opt-upper');
  const hyphensEl = container.querySelector('#uuid-opt-hyphens');

  function doGenerate() {
    const count = parseInt(countEl.value, 10) || 10;
    const text = generateBulkUUIDs(count, {
      version: verEl.value,
      uppercase: upperEl.checked,
      hyphens: hyphensEl.checked
    });
    outputEl.value = text;
    updateStatusBar(container, text);
  }

  container.querySelector('#btn-uuid-generate').addEventListener('click', doGenerate);
  verEl.addEventListener('change', doGenerate);
  countEl.addEventListener('change', doGenerate);
  upperEl.addEventListener('change', doGenerate);
  hyphensEl.addEventListener('change', doGenerate);
  container.querySelector('#btn-uuid-copy').addEventListener('click', (e) => copyToClipboard(outputEl.value, e.currentTarget));

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
      <div class="actions-group">
        <button class="btn btn-sm btn-secondary" id="btn-ts-now">${getIcon('refresh', 'icon-xs')} Current Time</button>
        <button class="btn btn-sm btn-secondary" id="btn-ts-copy-iso">${getIcon('copy', 'icon-xs')} Copy ISO</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="timestamp-layout">
      <!-- Live ticker -->
      <div class="card p-4 mb-4 flex items-center justify-between">
        <div>
          <span class="text-xs text-muted uppercase font-semibold">Current Unix Epoch Timestamp</span>
          <div class="font-mono text-2xl font-bold text-emerald" id="live-epoch-ticker">0</div>
        </div>
        <button class="btn btn-sm btn-outline" id="btn-copy-live-epoch">${getIcon('copy', 'icon-xs')} Copy Epoch</button>
      </div>

      <div class="form-group mb-4">
        <label class="form-label font-semibold text-xs">Enter Epoch (Sec/Ms) or ISO String / Date</label>
        <input type="text" id="ts-input" class="form-control font-mono text-base" placeholder="e.g. 1724800000 or 2026-08-27T12:00:00Z" />
      </div>

      <div class="metrics-grid" id="ts-results-grid"></div>
    </div>
  `;

  const inputEl = container.querySelector('#ts-input');
  const resultsGrid = container.querySelector('#ts-results-grid');
  const tickerEl = container.querySelector('#live-epoch-ticker');

  // Live ticker
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
        <div class="metric-card col-span-full">
          <span class="metric-label">ISO 8601 (UTC)</span>
          <div class="metric-value font-mono text-emerald text-base">${res.iso}</div>
          <button class="btn btn-xs btn-ghost btn-copy-field" data-val="${res.iso}">Copy</button>
        </div>
        <div class="metric-card col-span-full">
          <span class="metric-label">Local Date & Time</span>
          <div class="metric-value text-base text-primary">${res.local}</div>
          <div class="metric-meta"><span>Relative: <strong>${res.relative}</strong></span></div>
        </div>
      `;

      resultsGrid.querySelectorAll('.btn-copy-field').forEach(b => {
        b.addEventListener('click', () => copyToClipboard(b.dataset.val, b));
      });
      addToolHistory(tool.id, inputEl.value);
    } else {
      resultsGrid.innerHTML = `<div class="p-4 text-rose">${res.error}</div>`;
    }
  }

  inputEl.addEventListener('input', doConvert);
  container.querySelector('#btn-ts-now').addEventListener('click', () => { inputEl.value = 'now'; doConvert(); });
  container.querySelector('#btn-copy-live-epoch').addEventListener('click', (e) => copyToClipboard(tickerEl.textContent, e.currentTarget));
  container.querySelector('#btn-ts-copy-iso').addEventListener('click', (e) => {
    const res = convertTimestamp(inputEl.value);
    if (res.isValid) copyToClipboard(res.iso, e.currentTarget);
  });

  attachStandardToolbarEvents(container, tool, () => {
    inputEl.value = 'now';
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
      <div class="options-group flex-1">
        <span class="font-mono font-bold text-muted">/</span>
        <input type="text" id="regex-pattern" class="form-control form-control-sm font-mono flex-1" placeholder="Regular expression pattern (e.g. [a-zA-Z0-9]+)" value="([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+)" />
        <span class="font-mono font-bold text-muted">/</span>
        <input type="text" id="regex-flags" class="form-control form-control-sm font-mono w-16" placeholder="flags" value="g" />
      </div>
      <div class="actions-group">
        <span class="badge badge-primary font-mono text-xs" id="regex-match-counter">0 matches</span>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="regex-main-layout">
      <div class="split-pane-layout mb-4">
        <div class="pane-column">
          <div class="pane-header"><span class="pane-title text-xs font-semibold">Test String</span></div>
          <textarea id="regex-test-text" class="code-editor font-mono" placeholder="Enter text to match against..."></textarea>
        </div>
        <div class="pane-column">
          <div class="pane-header"><span class="pane-title text-xs font-semibold">Match Highlight Preview</span></div>
          <div id="regex-highlight-box" class="code-editor font-mono bg-surface-elevated overflow-y-auto"></div>
        </div>
      </div>

      <div class="card p-4">
        <div class="card-header p-0 pb-3 mb-3">
          <h3 class="card-title text-xs">Capture Groups & Match Index Table</h3>
        </div>
        <div id="regex-matches-table" class="table-responsive max-h-48"></div>
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
          <table class="table finance-table text-xs">
            <thead>
              <tr>
                <th>#</th>
                <th>Match</th>
                <th>Index</th>
                <th>Groups</th>
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
        tableEl.innerHTML = `<div class="text-muted text-xs p-2">No matches found.</div>`;
      }
      updateStatusBar(container, testTextEl.value);
      addToolHistory(tool.id, patternEl.value);
    } else {
      counterEl.textContent = 'Error';
      highlightEl.innerHTML = `<div class="text-rose text-xs p-2">Invalid RegExp: ${escapeHTML(res.error)}</div>`;
      tableEl.innerHTML = '';
    }
  }

  patternEl.addEventListener('input', doTest);
  flagsEl.addEventListener('input', doTest);
  testTextEl.addEventListener('input', doTest);

  attachStandardToolbarEvents(container, tool, () => {
    testTextEl.value = tool.sample;
    patternEl.value = '([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+)';
    flagsEl.value = 'g';
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
      <div class="options-group">
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="diff-opt-whitespace" /> Ignore Whitespace
        </label>
      </div>
      <div class="actions-group">
        <button class="btn btn-sm btn-primary" id="btn-run-diff">${getIcon('diff', 'icon-xs')} Compare</button>
        <button class="btn btn-sm btn-ghost" id="btn-clear-diff">${getIcon('trash', 'icon-xs')} Clear</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="diff-main-layout">
      <div class="split-pane-layout mb-4">
        <div class="pane-column">
          <div class="pane-header"><span class="pane-title text-xs font-semibold">Original Text</span></div>
          <textarea id="diff-orig" class="code-editor font-mono" placeholder="Original code / text..."></textarea>
        </div>
        <div class="pane-column">
          <div class="pane-header"><span class="pane-title text-xs font-semibold">Modified Text</span></div>
          <textarea id="diff-mod" class="code-editor font-mono" placeholder="Modified code / text..."></textarea>
        </div>
      </div>

      <div class="card p-0">
        <div class="pane-header border-b px-4 py-2 flex items-center justify-between">
          <span class="pane-title text-xs font-semibold">Diff Result</span>
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

  function doDiff() {
    const res = computeTextDiff(origEl.value, modEl.value, { ignoreWhitespace: wsChk.checked });
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
  container.querySelector('#btn-clear-diff').addEventListener('click', () => { origEl.value = ''; modEl.value = ''; doDiff(); });

  attachStandardToolbarEvents(container, tool, () => {
    origEl.value = tool.sample;
    modEl.value = tool.sampleModified || '';
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
      <div class="options-group flex-1">
        <label class="opt-label text-xs">HMAC Key (Optional):</label>
        <input type="text" id="hash-hmac-key" class="form-control form-control-sm font-mono flex-1" placeholder="Leave empty for standard hash" />
      </div>
      <div class="actions-group">
        <button class="btn btn-sm btn-primary" id="btn-compute-hash">${getIcon('refresh', 'icon-xs')} Compute</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="hash-layout">
      <div class="form-group mb-4">
        <label class="form-label font-semibold text-xs">Input Text / Payload *</label>
        <textarea id="hash-input" class="code-editor font-mono min-h-24" placeholder="Enter text to generate cryptographic hashes..."></textarea>
      </div>

      <div class="card p-0">
        <div class="table-responsive">
          <table class="table finance-table text-xs font-mono">
            <thead>
              <tr>
                <th style="width: 120px;">Algorithm</th>
                <th>Hash / Checksum</th>
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
  const bodyEl = container.querySelector('#hash-results-body');

  async function doHash() {
    const hashes = await generateHashes(inputEl.value, hmacEl.value.trim());
    const algos = [
      { name: 'SHA-256', val: hashes.sha256 },
      { name: 'SHA-512', val: hashes.sha512 },
      { name: 'SHA-384', val: hashes.sha384 },
      { name: 'SHA-1', val: hashes.sha1 },
      { name: 'MD5', val: hashes.md5 },
      { name: 'CRC32', val: hashes.crc32 }
    ];

    bodyEl.innerHTML = algos.map(a => `
      <tr>
        <td class="font-bold text-primary">${a.name}</td>
        <td class="text-emerald break-all">${a.val || '—'}</td>
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

  attachStandardToolbarEvents(container, tool, () => {
    inputEl.value = tool.sample;
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
      <div class="options-group flex-1">
        <label class="opt-label text-xs">Color Input (HEX, RGB, HSL):</label>
        <input type="text" id="color-str-input" class="form-control form-control-sm font-mono" value="#3B82F6" />
        <input type="color" id="color-native-picker" class="form-control form-control-sm p-0 w-10 cursor-pointer" value="#3b82f6" />
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `<div id="color-details-view" class="color-details-layout"></div>`;

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

      <div class="metrics-grid">
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

      <div class="card p-4 mt-4">
        <div class="card-header p-0 pb-3 mb-3"><h3 class="card-title text-xs">WCAG Contrast Compliance</h3></div>
        <div class="contrast-check-row flex gap-4">
          <div class="contrast-box p-3 rounded border flex-1" style="background: #ffffff; color: ${c.hex};">
            <span class="text-xs font-bold">Contrast on White: ${c.contrastWhite}:1</span>
            <div><span class="badge ${c.wcagWhiteAA ? 'badge-success' : 'badge-danger'} text-xs">AA ${c.wcagWhiteAA ? 'PASS' : 'FAIL'}</span></div>
          </div>
          <div class="contrast-box p-3 rounded border flex-1" style="background: #000000; color: ${c.hex};">
            <span class="text-xs font-bold">Contrast on Black: ${c.contrastBlack}:1</span>
            <div><span class="badge ${c.wcagBlackAA ? 'badge-success' : 'badge-danger'} text-xs">AA ${c.wcagBlackAA ? 'PASS' : 'FAIL'}</span></div>
          </div>
        </div>
      </div>
    `;

    detailsEl.querySelectorAll('.btn-copy-field').forEach(b => {
      b.addEventListener('click', () => copyToClipboard(b.dataset.val, b));
    });
  }

  strInput.addEventListener('input', () => { nativePicker.value = strInput.value; doColor(); });
  nativePicker.addEventListener('input', () => { strInput.value = nativePicker.value; doColor(); });

  attachStandardToolbarEvents(container, tool, () => {
    strInput.value = tool.sample;
    nativePicker.value = tool.sample;
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
      <div class="options-group">
        <label class="opt-label text-xs">Mode:</label>
        <select id="html-opt-mode" class="form-control form-control-sm">
          <option value="named">Named Entities (&amp;amp;, &amp;lt;)</option>
          <option value="decimal">Decimal (&#38;)</option>
          <option value="hex">Hexadecimal (&#x26;)</option>
        </select>
      </div>
      <div class="actions-group">
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
        <textarea id="html-encoded" class="code-editor font-mono" placeholder="Encoded entities..."></textarea>
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

  attachStandardToolbarEvents(container, tool, () => {
    rawEl.value = tool.sample;
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
      <div class="actions-group">
        <button class="btn btn-sm btn-secondary" id="btn-url-add-param">+ Add Query Param</button>
        <button class="btn btn-sm btn-secondary" id="btn-copy-full-url">${getIcon('copy', 'icon-xs')} Copy Rebuilt URL</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="url-parser-layout">
      <div class="form-group mb-4">
        <label class="form-label font-semibold text-xs">Full URL to Parse *</label>
        <input type="text" id="url-parse-input" class="form-control font-mono text-sm" placeholder="https://example.com/path?key=val" />
      </div>

      <div class="metrics-grid mb-4" id="url-components-grid"></div>

      <div class="card p-0">
        <div class="pane-header border-b px-4 py-2">
          <span class="pane-title text-xs font-semibold">Query Parameters Table (Live Synchronized)</span>
        </div>
        <div class="table-responsive">
          <table class="table finance-table text-xs font-mono">
            <thead>
              <tr>
                <th style="width: 200px;">Key</th>
                <th>Value</th>
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
      paramsBody.innerHTML = `<tr><td colspan="3" class="text-muted text-center p-3">No query parameters found.</td></tr>`;
      return;
    }

    paramsBody.innerHTML = currentParams.map((p, idx) => `
      <tr>
        <td><input type="text" class="form-control form-control-sm q-key font-mono" data-idx="${idx}" value="${escapeHTML(p.key)}" /></td>
        <td><input type="text" class="form-control form-control-sm q-val font-mono" data-idx="${idx}" value="${escapeHTML(p.value)}" /></td>
        <td class="text-right"><button class="btn-icon-danger btn-del-param" data-idx="${idx}">${getIcon('close', 'icon-xs')}</button></td>
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
    currentParams.push({ key: 'new_param', value: 'value' });
    const res = parseURL(inputEl.value);
    if (res.isValid) {
      inputEl.value = rebuildURL(res, currentParams);
      renderParamsTable(res);
    }
  });

  container.querySelector('#btn-copy-full-url').addEventListener('click', (e) => copyToClipboard(inputEl.value, e.currentTarget));

  attachStandardToolbarEvents(container, tool, () => {
    inputEl.value = tool.sample;
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
      <div class="options-group flex-1">
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="http-opt-simulated" /> Offline Simulated Mock Mode
        </label>
        <select id="http-mock-status" class="form-control form-control-sm w-32" style="display: none;">
          <option value="200">Mock: 200 OK</option>
          <option value="201">Mock: 201 Created</option>
          <option value="400">Mock: 400 Bad Req</option>
          <option value="404">Mock: 404 Not Found</option>
          <option value="500">Mock: 500 Error</option>
        </select>
      </div>
      <div class="actions-group">
        <button class="btn btn-sm btn-secondary" id="btn-http-curl">${getIcon('terminal', 'icon-xs')} Copy cURL</button>
        <button class="btn btn-sm btn-primary" id="btn-http-send">${getIcon('play', 'icon-xs')} Send Request</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="http-builder-layout">
      <!-- Request Bar -->
      <div class="http-request-bar flex gap-2 mb-4">
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
          <textarea id="http-req-body" class="code-editor font-mono" placeholder="Request body (JSON or text)..."></textarea>
        </div>
        <div class="pane-column">
          <div class="pane-header flex items-center justify-between">
            <span class="pane-title text-xs font-semibold">Response Viewer</span>
            <span id="http-res-badge"></span>
          </div>
          <textarea id="http-res-body" class="code-editor font-mono" readonly placeholder="Response will appear here..."></textarea>
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

  attachStandardToolbarEvents(container, tool, () => {
    urlEl.value = tool.sample;
    methodEl.value = 'GET';
    doSend();
  });
}

// ==========================================
// 16. LOREM / MOCK GENERATOR
// ==========================================
function renderMockGenerator(container, tool) {
  container.innerHTML = createSplitToolShell({
    tool,
    toolbarHTML: `
      <div class="options-group">
        <label class="opt-label text-xs">Generate Type:</label>
        <select id="mock-type" class="form-control form-control-sm">
          <option value="paragraphs">Lorem Paragraphs</option>
          <option value="sentences">Lorem Sentences</option>
          <option value="words">Lorem Words</option>
          <option value="users">Mock Users JSON</option>
        </select>
        <label class="opt-label text-xs">Count:</label>
        <input type="number" id="mock-count" class="form-control form-control-sm w-20" min="1" max="100" value="3" />
      </div>
      <div class="actions-group">
        <button class="btn btn-sm btn-primary" id="btn-mock-gen">${getIcon('refresh', 'icon-xs')} Generate</button>
        <button class="btn btn-sm btn-secondary" id="btn-mock-copy">${getIcon('copy', 'icon-xs')} Copy</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `<textarea id="mock-output" class="code-editor font-mono flex-1 min-h-80"></textarea>`;

  const outEl = container.querySelector('#mock-output');
  const typeEl = container.querySelector('#mock-type');
  const countEl = container.querySelector('#mock-count');

  function doGen() {
    const count = parseInt(countEl.value, 10) || 3;
    if (typeEl.value === 'users') {
      outEl.value = generateMockUsers(count);
    } else {
      outEl.value = generateLorem(typeEl.value, count);
    }
    updateStatusBar(container, outEl.value);
  }

  container.querySelector('#btn-mock-gen').addEventListener('click', doGen);
  typeEl.addEventListener('change', doGen);
  countEl.addEventListener('change', doGen);
  container.querySelector('#btn-mock-copy').addEventListener('click', (e) => copyToClipboard(outEl.value, e.currentTarget));

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
      <div class="actions-group">
        <button class="btn btn-sm btn-secondary" id="btn-copy-cases">${getIcon('copy', 'icon-xs')} Copy All</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="case-converter-layout">
      <div class="form-group mb-4">
        <label class="form-label font-semibold text-xs">Input Text / Identifier *</label>
        <input type="text" id="case-input" class="form-control font-mono text-base" placeholder="Enter text to convert across all programming cases..." />
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
    { key: 'alternating', label: 'aLtErNaTiNg' },
    { key: 'reverse', label: 'Reverse String' }
  ];

  function doCases() {
    gridEl.innerHTML = CASES.map(c => {
      const converted = convertCase(inputEl.value, c.key);
      return `
        <div class="metric-card">
          <span class="metric-label">${c.label}</span>
          <div class="metric-value font-mono text-base text-primary">${escapeHTML(converted)}</div>
          <button class="btn btn-xs btn-ghost btn-copy-case" data-val="${escapeHTML(converted)}">Copy</button>
        </div>
      `;
    }).join('');

    gridEl.querySelectorAll('.btn-copy-case').forEach(b => {
      b.addEventListener('click', () => copyToClipboard(b.dataset.val, b));
    });
    addToolHistory(tool.id, inputEl.value);
  }

  inputEl.addEventListener('input', doCases);
  attachStandardToolbarEvents(container, tool, () => {
    inputEl.value = tool.sample;
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
      <div class="options-group">
        <select id="sort-mode" class="form-control form-control-sm">
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
      <div class="actions-group">
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
        <textarea id="sort-output" class="code-editor font-mono" readonly placeholder="Sorted lines..."></textarea>
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

  attachStandardToolbarEvents(container, tool, () => {
    inEl.value = tool.sample;
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
      <div class="options-group">
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="dedup-case" /> Case Sensitive
        </label>
        <label class="checkbox-label text-xs">
          <input type="checkbox" id="dedup-trim" checked /> Trim Whitespace
        </label>
      </div>
      <div class="actions-group">
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
  const badgeEl = container.querySelector('#dedup-stats-badge');

  function doDedup() {
    const res = removeDuplicateLines(inEl.value, { caseSensitive: caseEl.checked, trimLines: trimEl.checked });
    outEl.value = res.output;
    badgeEl.textContent = `${res.removedCount} duplicates removed (${res.uniqueCount} unique)`;
    updateStatusBar(container, outEl.value);
    addToolHistory(tool.id, inEl.value);
  }

  inEl.addEventListener('input', doDedup);
  caseEl.addEventListener('change', doDedup);
  trimEl.addEventListener('change', doDedup);
  container.querySelector('#btn-copy-dedup').addEventListener('click', (e) => copyToClipboard(outEl.value, e.currentTarget));

  attachStandardToolbarEvents(container, tool, () => {
    inEl.value = tool.sample;
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
      <div class="options-group">
        <label class="checkbox-label text-xs"><input type="checkbox" id="clean-trim" checked /> Trim Lines</label>
        <label class="checkbox-label text-xs"><input type="checkbox" id="clean-empty" checked /> Remove Empty Lines</label>
        <label class="checkbox-label text-xs"><input type="checkbox" id="clean-collapse" checked /> Collapse Spaces</label>
        <label class="checkbox-label text-xs"><input type="checkbox" id="clean-tabs" /> Tabs to Spaces</label>
      </div>
      <div class="actions-group">
        <button class="btn btn-sm btn-secondary" id="btn-copy-clean">${getIcon('copy', 'icon-xs')} Copy</button>
      </div>
    `
  });

  const mainArea = container.querySelector('#tool-main-content');
  mainArea.innerHTML = `
    <div class="split-pane-layout">
      <div class="pane-column">
        <div class="pane-header"><span class="pane-title text-xs font-semibold">Raw Text</span></div>
        <textarea id="clean-input" class="code-editor font-mono" placeholder="Paste messy text..."></textarea>
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

  attachStandardToolbarEvents(container, tool, () => {
    inEl.value = tool.sample;
    doClean();
  });

  inEl.value = tool.sample;
  doClean();
}
