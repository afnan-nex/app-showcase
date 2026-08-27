/**
 * DevBench - Conversion & Generation Tools Engine
 * Timestamp Converter, Color Converter & Palette Inspector, and Lorem / Mock Data Generator.
 */

// --- 1. Timestamp Converter ---
export function convertTimestamp(input) {
  let date;
  if (!input || input.trim() === 'now') {
    date = new Date();
  } else {
    const trimmed = input.trim();
    if (/^\d+$/.test(trimmed)) {
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
  const iso = date.toISOString();
  const utc = date.toUTCString();
  const local = date.toString();
  const relative = getRelativeTimeString(date);

  return {
    isValid: true,
    unixSeconds,
    unixMillis,
    iso,
    utc,
    local,
    relative,
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds()
  };
}

function getRelativeTimeString(date) {
  const diffSec = Math.round((date.getTime() - Date.now()) / 1000);
  const isPast = diffSec < 0;
  const abs = Math.abs(diffSec);

  if (abs < 60) return isPast ? `${abs} seconds ago` : `in ${abs} seconds`;
  if (abs < 3600) return isPast ? `${Math.floor(abs / 60)} minutes ago` : `in ${Math.floor(abs / 60)} minutes`;
  if (abs < 86400) return isPast ? `${Math.floor(abs / 3600)} hours ago` : `in ${Math.floor(abs / 3600)} hours`;
  return isPast ? `${Math.floor(abs / 86400)} days ago` : `in ${Math.floor(abs / 86400)} days`;
}

// --- 2. Color Converter & Palette Inspector ---
export function parseAndConvertColor(colorStr) {
  let hex = '#3b82f6';
  let r = 59, g = 130, b = 246, a = 1;

  if (colorStr.startsWith('#')) {
    let clean = colorStr.slice(1);
    if (clean.length === 3) {
      clean = clean.split('').map(c => c + c).join('');
    }
    if (clean.length === 6) {
      r = parseInt(clean.slice(0, 2), 16) || 0;
      g = parseInt(clean.slice(2, 4), 16) || 0;
      b = parseInt(clean.slice(4, 6), 16) || 0;
    }
    hex = '#' + clean.slice(0, 6);
  } else if (colorStr.startsWith('rgb')) {
    const match = colorStr.match(/\d+(\.\d+)?/g);
    if (match && match.length >= 3) {
      r = Math.min(255, parseInt(match[0], 10));
      g = Math.min(255, parseInt(match[1], 10));
      b = Math.min(255, parseInt(match[2], 10));
      if (match[3]) a = parseFloat(match[3]);
      hex = rgbToHex(r, g, b);
    }
  } else if (colorStr.startsWith('hsl')) {
    const match = colorStr.match(/\d+(\.\d+)?/g);
    if (match && match.length >= 3) {
      const rgb = hslToRgb(parseFloat(match[0]), parseFloat(match[1]), parseFloat(match[2]));
      r = rgb.r; g = rgb.g; b = rgb.b;
      hex = rgbToHex(r, g, b);
    }
  }

  const hsl = rgbToHsl(r, g, b);
  const hsv = rgbToHsv(r, g, b);
  const cmyk = rgbToCmyk(r, g, b);

  // Contrast calculation (relative luminance)
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const contrastWhite = Number(((1 + 0.05) / (lum + 0.05)).toFixed(2));
  const contrastBlack = Number(((lum + 0.05) / (0 + 0.05)).toFixed(2));

  // Harmonies / Palettes
  const complementary = hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l);
  const analogous1 = hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l);
  const analogous2 = hslToHex((hsl.h + 330) % 360, hsl.s, hsl.l);
  const triadic1 = hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l);
  const triadic2 = hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l);

  return {
    hex: hex.toUpperCase(),
    rgb: `rgb(${r}, ${g}, ${b})`,
    rgba: `rgba(${r}, ${g}, ${b}, ${a})`,
    hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
    cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
    contrastWhite,
    contrastBlack,
    wcagWhiteAA: contrastWhite >= 4.5,
    wcagWhiteAAA: contrastWhite >= 7,
    wcagBlackAA: contrastBlack >= 4.5,
    wcagBlackAAA: contrastBlack >= 7,
    palette: {
      complementary,
      analogous: [analogous1, analogous2],
      triadic: [triadic1, triadic2]
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
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'curabitur',
  'vel', 'hendrerit', 'libero', 'eleifend', 'blandit', 'nunc', 'ornare', 'odio', 'ut',
  'orci', 'gravida', 'imperdiet', 'nullam', 'purus', 'lacinia', 'a', 'pretium', 'quis',
  'congue', 'praesent', 'sagittis', 'laoreet', 'auctor', 'mauris', 'non', 'velit', 'eros',
  'dictum', 'proin', 'accumsan', 'sapien', 'nec', 'massa', 'volutpat', 'venenatis', 'sed',
  'egestas', 'dui', 'id', 'ornare', 'arcu', 'faucibus', 'eu', 'turpis', 'porttitor'
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
      const len = 8 + Math.floor(Math.random() * 8);
      const sWords = [];
      for (let j = 0; j < len; j++) {
        sWords.push(LOREM_WORDS[(i * len + j) % LOREM_WORDS.length]);
      }
      const s = sWords.join(' ');
      sentences.push(s.charAt(0).toUpperCase() + s.slice(1) + '.');
    }
    return sentences.join(' ');
  }

  // Paragraphs
  const paragraphs = [];
  for (let p = 0; p < safeCount; p++) {
    const numSentences = 4 + Math.floor(Math.random() * 3);
    const pSentences = [];
    for (let s = 0; s < numSentences; s++) {
      const len = 7 + Math.floor(Math.random() * 7);
      const words = [];
      for (let w = 0; w < len; w++) {
        words.push(LOREM_WORDS[(p * 20 + s * 8 + w) % LOREM_WORDS.length]);
      }
      const sent = words.join(' ');
      pSentences.push(sent.charAt(0).toUpperCase() + sent.slice(1) + '.');
    }
    paragraphs.push(pSentences.join(' '));
  }

  return paragraphs.join('\n\n');
}

export function generateMockUsers(count = 5) {
  const firstNames = ['Alex', 'Sarah', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Sam', 'Riley', 'Jamie', 'Logan'];
  const lastNames = ['Vance', 'Chen', 'Miller', 'Novak', 'Dubois', 'Kowalski', 'Tanaka', 'Patel', 'Smith', 'Wright'];
  const roles = ['Frontend Engineer', 'Backend Architect', 'DevOps Specialist', 'Product Manager', 'Security Analyst'];
  const cities = ['San Francisco', 'Berlin', 'Tokyo', 'London', 'Toronto', 'Sydney', 'Stockholm', 'Austin'];

  const users = [];
  for (let i = 0; i < count; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i * 3) % lastNames.length];
    users.push({
      id: 'usr_' + (1000 + i),
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@example.com`,
      role: roles[i % roles.length],
      location: cities[i % cities.length],
      isActive: i % 4 !== 0,
      createdAt: new Date(Date.now() - i * 86400000 * 12).toISOString()
    });
  }
  return JSON.stringify(users, null, 2);
}
