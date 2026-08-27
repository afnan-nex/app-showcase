/**
 * DevBench - Encoding & Decoding Tools Engine
 * Base64 Encoder/Decoder, URL Encoder/Decoder, and HTML Entity Encoder/Decoder.
 */

// --- 1. Base64 Encoder / Decoder (UTF-8 Safe) ---
export function encodeBase64(input, urlSafe = false) {
  if (!input) return '';
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
    return base64;
  } catch (err) {
    throw new Error('Base64 encoding failed: ' + err.message);
  }
}

export function decodeBase64(input) {
  if (!input) return '';
  try {
    let clean = input.trim();
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
    throw new Error('Invalid Base64 string: ' + err.message);
  }
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
  return encodeURI(input);
}

export function decodeURL(input, mode = 'component') {
  if (!input) return '';
  try {
    let clean = input;
    if (mode === 'form') {
      clean = clean.replace(/\+/g, ' ');
    }
    return decodeURIComponent(clean);
  } catch (err) {
    throw new Error('Invalid URL-encoded string: ' + err.message);
  }
}

// --- 3. HTML Entity Encoder / Decoder ---
export function encodeHTMLEntities(input, mode = 'named') {
  if (!input) return '';

  if (mode === 'named') {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
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
  const ENTITY_MAP = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&#39;': "'",
    '&nbsp;': ' '
  };

  let decoded = input.replace(/&(?:amp|lt|gt|quot|apos|nbsp|#39);/g, match => ENTITY_MAP[match] || match);

  // Decimal entities (&#123;)
  decoded = decoded.replace(/&#(\d+);/g, (match, dec) => {
    try {
      return String.fromCharCode(parseInt(dec, 10));
    } catch (e) {
      return match;
    }
  });

  // Hex entities (&#x7B;)
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
    try {
      return String.fromCharCode(parseInt(hex, 16));
    } catch (e) {
      return match;
    }
  });

  return decoded;
}
