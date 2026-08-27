/**
 * DevBench - Encoding & Decoding Tools Engine
 * Base64 Encoder/Decoder (UTF-8 safe, URL-safe, Data URIs, Hex), URL Encoder/Decoder, and HTML Entity Encoder/Decoder.
 */

// --- 1. Base64 Encoder / Decoder (UTF-8 Safe & Data URI Aware) ---
export function encodeBase64(input, options = {}) {
  if (!input) return '';
  const { urlSafe = false, dataUriMime = '' } = typeof options === 'boolean' ? { urlSafe: options } : options;

  try {
    const bytes = new TextEncoder().encode(input);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    let base64 = btoa(binary);
    if (urlSafe) {
      base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    if (dataUriMime) {
      return `data:${dataUriMime};base64,${base64}`;
    }
    return base64;
  } catch (err) {
    throw new Error('Base64 encoding failed: ' + err.message);
  }
}

export function decodeBase64(input) {
  if (!input) return '';
  try {
    let clean = input.trim();
    // Strip Data URI header if present
    const dataUriMatch = clean.match(/^data:([a-zA-Z0-9/+-]+)?;base64,(.*)$/s);
    if (dataUriMatch) {
      clean = dataUriMatch[2].trim();
    }

    // Support URL-safe base64
    clean = clean.replace(/-/g, '+').replace(/_/g, '/');
    while (clean.length % 4 !== 0) {
      clean += '=';
    }
    const binary = atob(clean);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (err) {
    throw new Error('Invalid Base64 payload: ' + err.message);
  }
}

export function base64ToHex(input) {
  if (!input) return '';
  let clean = input.trim().replace(/^data:.*?;base64,/, '').replace(/-/g, '+').replace(/_/g, '/');
  while (clean.length % 4 !== 0) clean += '=';
  const binary = atob(clean);
  return Array.from(binary).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
}

export function hexToBase64(hexStr) {
  if (!hexStr) return '';
  const clean = hexStr.replace(/[^0-9a-fA-F]/g, '');
  let binary = '';
  for (let i = 0; i < clean.length; i += 2) {
    binary += String.fromCharCode(parseInt(clean.substr(i, 2), 16));
  }
  return btoa(binary);
}

// --- 2. URL Encoder / Decoder ---
export function encodeURL(input, mode = 'component') {
  if (!input) return '';
  if (mode === 'component') {
    return encodeURIComponent(input);
  }
  if (mode === 'form') {
    return encodeURIComponent(input).replace(/%20/g, '+');
  }
  if (mode === 'rfc3986') {
    return encodeURIComponent(input).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
  }
  return encodeURI(input);
}

export function decodeURL(input, mode = 'component') {
  if (!input) return '';
  try {
    let clean = input;
    if (mode === 'form' || clean.includes('+')) {
      clean = clean.replace(/\+/g, ' ');
    }
    return decodeURIComponent(clean);
  } catch (err) {
    throw new Error('Invalid URL-encoded string: ' + err.message);
  }
}

// --- 3. HTML Entity Encoder / Decoder ---
const NAMED_ENTITY_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '©': '&copy;',
  '®': '&reg;',
  '™': '&trade;',
  '€': '&euro;',
  '£': '&pound;',
  '¥': '&yen;',
  '—': '&mdash;',
  '–': '&ndash;',
  '•': '&bull;',
  '…': '&hellip;'
};

const DECODE_ENTITY_MAP = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
  '&#39;': "'",
  '&#x27;': "'",
  '&nbsp;': ' ',
  '&copy;': '©',
  '&reg;': '®',
  '&trade;': '™',
  '&euro;': '€',
  '&pound;': '£',
  '&yen;': '¥',
  '&mdash;': '—',
  '&ndash;': '–',
  '&bull;': '•',
  '&hellip;': '…'
};

export function encodeHTMLEntities(input, mode = 'named') {
  if (!input) return '';

  if (mode === 'named') {
    return input.replace(/[&<>"'©®™€£¥—–•…]/g, char => NAMED_ENTITY_MAP[char] || `&#${char.charCodeAt(0)};`);
  }

  if (mode === 'decimal') {
    return Array.from(input)
      .map(char => `&#${char.charCodeAt(0)};`)
      .join('');
  }

  if (mode === 'hex') {
    return Array.from(input)
      .map(char => `&#x${char.charCodeAt(0).toString(16).toUpperCase()};`)
      .join('');
  }

  return input;
}

export function decodeHTMLEntities(input) {
  if (!input) return '';

  let decoded = input.replace(/&(?:amp|lt|gt|quot|apos|#39|#x27|nbsp|copy|reg|trade|euro|pound|yen|mdash|ndash|bull|hellip);/gi, match => DECODE_ENTITY_MAP[match.toLowerCase()] || match);

  // Decimal entities (&#123;)
  decoded = decoded.replace(/&#(\d+);/g, (match, dec) => {
    try {
      const code = parseInt(dec, 10);
      return String.fromCodePoint ? String.fromCodePoint(code) : String.fromCharCode(code);
    } catch (e) {
      return match;
    }
  });

  // Hex entities (&#x7B;)
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
    try {
      const code = parseInt(hex, 16);
      return String.fromCodePoint ? String.fromCodePoint(code) : String.fromCharCode(code);
    } catch (e) {
      return match;
    }
  });

  return decoded;
}
