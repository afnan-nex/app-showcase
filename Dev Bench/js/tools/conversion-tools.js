/**
 * DevBench - Conversion & Generation Tools Engine
 * Timestamp Converter, Color Converter & Palette Inspector, and Multi-Industry Mock Data Generator.
 */

// --- 1. Timestamp Converter ---
export function convertTimestamp(input) {
  let date;
  if (!input || input.trim() === 'now') {
    date = new Date();
  } else {
    const trimmed = input.trim();
    // Handle hex timestamp (e.g. 0x66CDC800)
    if (/^0x[0-9a-fA-F]+$/i.test(trimmed)) {
      const num = parseInt(trimmed, 16);
      date = num < 10000000000 ? new Date(num * 1000) : new Date(num);
    } else if (/^\d+$/.test(trimmed)) {
      // numeric unix timestamp
      const num = parseInt(trimmed, 10);
      // if < 10000000000, treat as seconds, else millis
      date = num < 10000000000 ? new Date(num * 1000) : new Date(num);
    } else {
      date = new Date(trimmed);
    }
  }

  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Invalid date or timestamp value' };
  }

  const unixSeconds = Math.floor(date.getTime() / 1000);
  const unixMillis = date.getTime();
  const unixHex = '0x' + unixSeconds.toString(16).toUpperCase();
  const iso = date.toISOString();
  const utc = date.toUTCString();
  const local = date.toString();
  const relative = getRelativeTimeString(date);

  // Day of year calculation
  const startOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86400000) + 1;
  const isLeapYear = (date.getFullYear() % 4 === 0 && date.getFullYear() % 100 !== 0) || (date.getFullYear() % 400 === 0);

  return {
    isValid: true,
    unixSeconds,
    unixMillis,
    unixHex,
    iso,
    utc,
    local,
    relative,
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    dayOfYear,
    isLeapYear,
    timezoneOffset: date.getTimezoneOffset()
  };
}

function getRelativeTimeString(date) {
  const diffSec = Math.round((date.getTime() - Date.now()) / 1000);
  const isPast = diffSec < 0;
  const abs = Math.abs(diffSec);

  if (abs < 10) return 'just now';
  if (abs < 60) return isPast ? `${abs} seconds ago` : `in ${abs} seconds`;
  if (abs < 3600) {
    const mins = Math.floor(abs / 60);
    return isPast ? `${mins} minute${mins === 1 ? '' : 's'} ago` : `in ${mins} minute${mins === 1 ? '' : 's'}`;
  }
  if (abs < 86400) {
    const hrs = Math.floor(abs / 3600);
    return isPast ? `${hrs} hour${hrs === 1 ? '' : 's'} ago` : `in ${hrs} hour${hrs === 1 ? '' : 's'}`;
  }
  const days = Math.floor(abs / 86400);
  return isPast ? `${days} day${days === 1 ? '' : 's'} ago` : `in ${days} day${days === 1 ? '' : 's'}`;
}

// --- 2. Color Converter & Palette Inspector ---
const CSS_NAMED_COLORS = {
  black: '#000000', white: '#FFFFFF', red: '#FF0000', green: '#008000', blue: '#0000FF',
  yellow: '#FFFF00', cyan: '#00FFFF', magenta: '#FF00FF', gray: '#808080', grey: '#808080',
  indigo: '#4B0082', violet: '#EE82EE', purple: '#800080', orange: '#FFA500', pink: '#FFC0CB',
  crimson: '#DC143C', teal: '#008080', slateblue: '#6A5ACD', royalblue: '#4169E1',
  cornflowerblue: '#6495ED', dodgerblue: '#1E90FF', gold: '#FFD700', tomato: '#FF6347'
};

export function parseAndConvertColor(colorStr) {
  let r = 59, g = 130, b = 246, a = 1;
  let cleanInput = (colorStr || '#3B82F6').trim().toLowerCase();

  // Named color lookup
  if (CSS_NAMED_COLORS[cleanInput]) {
    cleanInput = CSS_NAMED_COLORS[cleanInput];
  }

  if (cleanInput.startsWith('#')) {
    let clean = cleanInput.slice(1);
    if (clean.length === 3) {
      clean = clean.split('').map(c => c + c).join('');
    } else if (clean.length === 4) {
      clean = clean.slice(0, 3).split('').map(c => c + c).join('');
    } else if (clean.length === 8) {
      a = Math.round((parseInt(clean.slice(6, 8), 16) / 255) * 100) / 100;
      clean = clean.slice(0, 6);
    }
    if (clean.length === 6) {
      r = parseInt(clean.slice(0, 2), 16) || 0;
      g = parseInt(clean.slice(2, 4), 16) || 0;
      b = parseInt(clean.slice(4, 6), 16) || 0;
    }
  } else if (cleanInput.startsWith('rgb')) {
    const match = cleanInput.match(/\d+(\.\d+)?/g);
    if (match && match.length >= 3) {
      r = Math.min(255, Math.max(0, parseInt(match[0], 10)));
      g = Math.min(255, Math.max(0, parseInt(match[1], 10)));
      b = Math.min(255, Math.max(0, parseInt(match[2], 10)));
      if (match[3]) a = Math.min(1, Math.max(0, parseFloat(match[3])));
    }
  } else if (cleanInput.startsWith('hsl')) {
    const match = cleanInput.match(/\d+(\.\d+)?/g);
    if (match && match.length >= 3) {
      const rgb = hslToRgb(parseFloat(match[0]), parseFloat(match[1]), parseFloat(match[2]));
      r = rgb.r; g = rgb.g; b = rgb.b;
      if (match[3]) a = Math.min(1, Math.max(0, parseFloat(match[3])));
    }
  }

  const hex = rgbToHex(r, g, b);
  const hsl = rgbToHsl(r, g, b);
  const hsv = rgbToHsv(r, g, b);
  const cmyk = rgbToCmyk(r, g, b);

  // Relative luminance calculation for WCAG 2.1 contrast formula
  const getLuminance = (cr, cg, cb) => {
    const a = [cr, cg, cb].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const lum = getLuminance(r, g, b);
  const lumWhite = getLuminance(255, 255, 255);
  const lumBlack = getLuminance(0, 0, 0);

  const contrastWhite = Number(((Math.max(lum, lumWhite) + 0.05) / (Math.min(lum, lumWhite) + 0.05)).toFixed(2));
  const contrastBlack = Number(((Math.max(lum, lumBlack) + 0.05) / (Math.min(lum, lumBlack) + 0.05)).toFixed(2));

  // Harmonies / Palettes
  const complementary = hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l);
  const analogous1 = hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l);
  const analogous2 = hslToHex((hsl.h + 330) % 360, hsl.s, hsl.l);
  const triadic1 = hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l);
  const triadic2 = hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l);

  // Monochromatic shades
  const shadeLight = hslToHex(hsl.h, hsl.s, Math.min(95, hsl.l + 25));
  const shadeDark = hslToHex(hsl.h, hsl.s, Math.max(10, hsl.l - 25));

  return {
    hex: hex.toUpperCase(),
    rgb: `rgb(${r}, ${g}, ${b})`,
    rgba: `rgba(${r}, ${g}, ${b}, ${a})`,
    hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
    cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
    cssVar: `--color-brand: ${hex.toUpperCase()};`,
    contrastWhite,
    contrastBlack,
    wcagWhiteAA: contrastWhite >= 4.5,
    wcagWhiteAAA: contrastWhite >= 7,
    wcagWhiteAALarge: contrastWhite >= 3.0,
    wcagBlackAA: contrastBlack >= 4.5,
    wcagBlackAAA: contrastBlack >= 7,
    wcagBlackAALarge: contrastBlack >= 3.0,
    palette: {
      complementary,
      analogous: [analogous1, analogous2],
      triadic: [triadic1, triadic2],
      shades: [shadeLight, hex, shadeDark]
    }
  };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function hslToHex(h, s, l) {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b).toUpperCase();
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

function rgbToCmyk(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  };
}

// --- 3. Lorem & Mock Data Generator ---
const LOREM_WORDS = [
  'system', 'latency', 'cluster', 'deployment', 'endpoint', 'payload', 'schema', 'pipeline', 'service',
  'gateway', 'ingress', 'container', 'orchestration', 'telemetry', 'distributed', 'consensus', 'microservice',
  'throughput', 'resilience', 'cache', 'encryption', 'asynchronous', 'stream', 'benchmark', 'workstation',
  'developer', 'runtime', 'interface', 'protocol', 'request', 'response', 'authorization', 'signature',
  'immutable', 'concurrency', 'transaction', 'replication', 'observability', 'metrics', 'validation'
];

export function generateLorem(type = 'paragraphs', count = 3) {
  const safeCount = Math.max(1, Math.min(100, count));

  if (type === 'words') {
    const words = [];
    for (let i = 0; i < safeCount; i++) {
      words.push(LOREM_WORDS[i % LOREM_WORDS.length]);
    }
    return words.join(' ');
  }

  if (type === 'sentences') {
    const sentences = [];
    for (let i = 0; i < safeCount; i++) {
      const len = 8 + (i % 6);
      const sWords = [];
      for (let j = 0; j < len; j++) {
        sWords.push(LOREM_WORDS[(i * 7 + j) % LOREM_WORDS.length]);
      }
      const s = sWords.join(' ');
      sentences.push(s.charAt(0).toUpperCase() + s.slice(1) + '.');
    }
    return sentences.join(' ');
  }

  // Paragraphs
  const paragraphs = [];
  for (let p = 0; p < safeCount; p++) {
    const numSentences = 4 + (p % 3);
    const pSentences = [];
    for (let s = 0; s < numSentences; s++) {
      const len = 7 + ((p + s) % 6);
      const words = [];
      for (let w = 0; w < len; w++) {
        words.push(LOREM_WORDS[(p * 11 + s * 5 + w) % LOREM_WORDS.length]);
      }
      const sent = words.join(' ');
      pSentences.push(sent.charAt(0).toUpperCase() + sent.slice(1) + '.');
    }
    paragraphs.push(pSentences.join(' '));
  }

  return paragraphs.join('\n\n');
}

export function generateMockUsers(count = 5) {
  const firstNames = ['Marcus', 'Elena', 'Devon', 'Aria', 'Julian', 'Siddharth', 'Chloe', 'Zane', 'Nadia', 'Kiran'];
  const lastNames = ['Sterling', 'Vance', 'Chen', 'Alvarez', 'Novak', 'Patel', 'Lindqvist', 'Nakamura', 'O\'Connor', 'Dubois'];
  const roles = ['Principal Cloud Architect', 'Senior Staff SRE', 'Lead Security Engineer', 'Staff Systems Designer', 'Frontend Platform Lead'];
  const depts = ['Infrastructure & Core', 'Platform Security', 'Data Platform', 'Developer Productivity', 'Product Engineering'];
  const cities = ['San Francisco, CA', 'Stockholm, Sweden', 'Tokyo, Japan', 'Berlin, Germany', 'London, UK', 'Austin, TX'];

  const users = [];
  for (let i = 0; i < count; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i * 3) % lastNames.length];
    const email = `${fn.toLowerCase()}.${ln.toLowerCase().replace(/[^a-z]/g, '')}@enterprise.dev`;
    users.push({
      id: `usr_${(1000 + i).toString(16)}`,
      name: `${fn} ${ln}`,
      email,
      role: roles[i % roles.length],
      department: depts[i % depts.length],
      location: cities[i % cities.length],
      twoFactorEnabled: i % 3 !== 0,
      activeSessions: (i % 4) + 1,
      createdAt: new Date(Date.now() - (i + 1) * 86400000 * 24).toISOString()
    });
  }
  return JSON.stringify(users, null, 2);
}

export function generateMockOrders(count = 5) {
  const products = [
    { sku: 'SRV-COMPUTE-L', name: 'High-Mem Compute Node 64GB', price: 149.00 },
    { sku: 'STOR-NVME-1T', name: 'Ultra-Fast NVMe SSD Block (1TB)', price: 89.00 },
    { sku: 'NET-LB-DEDIC', name: 'Dedicated Edge Load Balancer', price: 45.00 },
    { sku: 'SEC-WAF-PRO', name: 'Managed Web Application Firewall', price: 120.00 },
    { sku: 'DB-REDIS-CLUS', name: 'Managed In-Memory Redis Cluster', price: 95.00 }
  ];
  const statuses = ['fulfilled', 'processing', 'provisioned', 'active'];

  const orders = [];
  for (let i = 0; i < count; i++) {
    const prod = products[i % products.length];
    const qty = (i % 3) + 1;
    const subtotal = Number((prod.price * qty).toFixed(2));
    const tax = Number((subtotal * 0.0825).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));

    orders.push({
      orderId: `ord_${10920 + i}`,
      customer: `Acme Cloud Tenant #${100 + i}`,
      items: [
        { sku: prod.sku, description: prod.name, unitPrice: prod.price, quantity: qty, itemTotal: subtotal }
      ],
      pricing: { subtotal, tax, total, currency: 'USD' },
      fulfillmentStatus: statuses[i % statuses.length],
      paymentMethod: 'stripe_corporate_card',
      issuedAt: new Date(Date.now() - i * 3600000 * 8).toISOString()
    });
  }
  return JSON.stringify(orders, null, 2);
}

export function generateMockLogs(count = 5) {
  const ips = ['192.0.2.45', '198.51.100.12', '203.0.113.88', '192.168.1.104', '10.0.4.19'];
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  const paths = ['/api/v2/auth/token', '/v1/deployments/cluster-prod', '/healthz', '/v1/billing/invoices/latest', '/api/v2/metrics'];
  const statuses = [200, 201, 204, 400, 401, 404, 500];

  const logs = [];
  for (let i = 0; i < count; i++) {
    const ip = ips[i % ips.length];
    const method = methods[i % methods.length];
    const path = paths[i % paths.length];
    const status = statuses[i % statuses.length];
    const bytes = 420 + ((i * 187) % 3400);
    const latency = 12 + ((i * 37) % 240);
    const dateStr = new Date(Date.now() - i * 60000 * 4).toISOString();
    logs.push(`${ip} - - [${dateStr}] "${method} ${path} HTTP/1.1" ${status} ${bytes} "${latency}ms" "DevBench-Workstation/1.0"`);
  }
  return logs.join('\n');
}

export function generateMockKubernetes(count = 5) {
  const pods = [];
  const namespaces = ['production', 'staging', 'telemetry', 'ingress-system'];
  const services = ['auth-service', 'billing-processor', 'api-gateway', 'worker-queue', 'redis-sentinel'];

  for (let i = 0; i < count; i++) {
    const svc = services[i % services.length];
    const ns = namespaces[i % namespaces.length];
    pods.push({
      podName: `${svc}-${Math.random().toString(36).substr(2, 6)}-${Math.random().toString(36).substr(2, 4)}`,
      namespace: ns,
      status: i % 5 === 4 ? 'Pending' : 'Running',
      readyContainers: '1/1',
      restarts: i % 4 === 0 ? 1 : 0,
      cpuMillicores: 120 + ((i * 45) % 400),
      memoryMB: 384 + ((i * 96) % 1024),
      node: `k8s-node-worker-0${(i % 3) + 1}`,
      startedAt: new Date(Date.now() - (i + 1) * 3600000 * 18).toISOString()
    });
  }
  return JSON.stringify(pods, null, 2);
}
