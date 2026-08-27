/**
 * DevBench - Security & Cryptographic Tools Engine
 * JWT Decoder, Hash Generator (Web Crypto + MD5/CRC32), and UUID/ID Generator.
 */

import { decodeBase64 } from './encoding-tools.js';

// --- 1. JWT Decoder ---
export function decodeJWT(token) {
  if (!token || !token.trim()) {
    return { success: false, error: 'Please enter a JWT token' };
  }

  try {
    const parts = token.trim().split('.');
    if (parts.length < 2 || parts.length > 3) {
      return { success: false, error: 'Invalid JWT structure: Token must contain 2 or 3 dot-separated segments' };
    }

    const headerJSON = decodeBase64(parts[0]);
    const payloadJSON = decodeBase64(parts[1]);

    const header = JSON.parse(headerJSON);
    const payload = JSON.parse(payloadJSON);
    const signature = parts[2] || '';

    // Inspect claims
    let expirationStatus = null;
    if (payload.exp) {
      const expDate = new Date(payload.exp * 1000);
      const isExpired = expDate.getTime() < Date.now();
      expirationStatus = {
        date: expDate.toISOString(),
        isExpired,
        human: isExpired ? `Expired on ${expDate.toLocaleString()}` : `Valid until ${expDate.toLocaleString()}`
      };
    }

    let issuedAtStatus = null;
    if (payload.iat) {
      const iatDate = new Date(payload.iat * 1000);
      issuedAtStatus = iatDate.toLocaleString();
    }

    return {
      success: true,
      header,
      payload,
      signature,
      expirationStatus,
      issuedAtStatus,
      rawHeader: JSON.stringify(header, null, 2),
      rawPayload: JSON.stringify(payload, null, 2)
    };
  } catch (err) {
    return { success: false, error: 'Failed to decode JWT: ' + err.message };
  }
}

// --- 2. Hash & Checksum Generator ---
export async function generateHashes(input, hmacKey = '') {
  if (!input) {
    return { sha256: '', sha384: '', sha512: '', sha1: '', md5: '', crc32: '' };
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(input);

  // Web Crypto standard algorithms
  let sha256 = '';
  let sha384 = '';
  let sha512 = '';
  let sha1 = '';

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    if (hmacKey) {
      const keyData = encoder.encode(hmacKey);
      const key256 = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
      const sig256 = await crypto.subtle.sign('HMAC', key256, data);
      sha256 = bufToHex(sig256);

      const key512 = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-512' }, false, ['sign']);
      const sig512 = await crypto.subtle.sign('HMAC', key512, data);
      sha512 = bufToHex(sig512);
    } else {
      const buf256 = await crypto.subtle.digest('SHA-256', data);
      sha256 = bufToHex(buf256);

      const buf384 = await crypto.subtle.digest('SHA-384', data);
      sha384 = bufToHex(buf384);

      const buf512 = await crypto.subtle.digest('SHA-512', data);
      sha512 = bufToHex(buf512);

      const buf1 = await crypto.subtle.digest('SHA-1', data);
      sha1 = bufToHex(buf1);
    }
  }

  const md5 = computeMD5(input);
  const crc32 = computeCRC32(input);

  return { sha256, sha384, sha512, sha1, md5, crc32 };
}

function bufToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Pure JS CRC32
function computeCRC32(str) {
  let crc = 0 ^ (-1);
  for (let i = 0; i < str.length; i++) {
    let byte = str.charCodeAt(i);
    for (let j = 0; j < 8; j++) {
      let bit = (crc ^ byte) & 1;
      crc >>>= 1;
      if (bit) crc ^= 0xEDB88320;
      byte >>>= 1;
    }
  }
  return ((crc ^ (-1)) >>> 0).toString(16).padStart(8, '0');
}

// Pure JS MD5
function computeMD5(string) {
  function md5cycle(x, k) {
    let a = x[0], b = x[1], c = x[2], d = x[3];
    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);
    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);
    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);
    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);
    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
  }
  function cmn(q, a, b, x, s, t) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }
  function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
  function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
  function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
  function add32(a, b) { return (a + b) & 0xFFFFFFFF; }

  let n = string.length, state = [1732584193, -271733879, -1732584194, 271733878], i;
  let tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (i = 64; i <= n; i += 64) {
    let block = [];
    for (let j = 0; j < 16; j++) {
      let idx = i - 64 + j * 4;
      block[j] = string.charCodeAt(idx) | (string.charCodeAt(idx + 1) << 8) | (string.charCodeAt(idx + 2) << 16) | (string.charCodeAt(idx + 3) << 24);
    }
    md5cycle(state, block);
  }
  let s = string.substring(i - 64);
  for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
  tail[i >> 2] |= 0x80 << ((i % 4) << 3);
  if (i > 55) {
    md5cycle(state, tail);
    for (i = 0; i < 16; i++) tail[i] = 0;
  }
  tail[14] = n * 8;
  md5cycle(state, tail);
  let hex = '';
  for (i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let b = (state[i] >>> (j * 8)) & 0xFF;
      hex += b.toString(16).padStart(2, '0');
    }
  }
  return hex;
}

// --- 3. UUID / ID Generator ---
export function generateUUID(version = 'v4') {
  if (version === 'v4') {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  if (version === 'ulid') {
    // ULID: 10 chars timestamp + 16 chars random (Crockford Base32)
    const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
    const now = Date.now();
    let timeStr = '';
    let t = now;
    for (let i = 9; i >= 0; i--) {
      timeStr = ENCODING[t % 32] + timeStr;
      t = Math.floor(t / 32);
    }
    let randStr = '';
    for (let i = 0; i < 16; i++) {
      randStr += ENCODING[Math.floor(Math.random() * 32)];
    }
    return timeStr + randStr;
  }

  if (version === 'v7') {
    // Unix epoch millis (48 bit) + 12 bit rand + 62 bit rand
    const now = Date.now().toString(16).padStart(12, '0');
    const rand = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    return `${now.slice(0, 8)}-${now.slice(8, 12)}-7${rand.slice(0, 3)}-8${rand.slice(3, 6)}-${rand.slice(6, 18)}`;
  }

  return crypto.randomUUID();
}

export function generateBulkUUIDs(count = 10, options = {}) {
  const { version = 'v4', uppercase = false, hyphens = true, format = 'list' } = options;
  const list = [];
  for (let i = 0; i < count; i++) {
    let id = generateUUID(version);
    if (!hyphens) id = id.replace(/-/g, '');
    if (uppercase) id = id.toUpperCase();
    else id = id.toLowerCase();
    list.push(id);
  }

  if (format === 'json') {
    return JSON.stringify(list, null, 2);
  }
  if (format === 'csv') {
    return list.join(', ');
  }
  return list.join('\n');
}
