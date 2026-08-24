/**
 * VaultPass - TOTP Authenticator Engine (RFC 6238 / RFC 4226)
 * 
 * Generates real-time 6-digit Time-based One-Time Passwords using Web Crypto API (HMAC-SHA-1).
 */

const VaultTOTP = (() => {
  'use strict';

  const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

  // Decode standard Base32 string to Uint8Array
  function base32ToBuffer(base32Str) {
    if (!base32Str) return null;
    const cleanStr = base32Str.replace(/\s+/g, '').replace(/=+$/, '').toUpperCase();
    let bits = '';

    for (let i = 0; i < cleanStr.length; i++) {
      const val = BASE32_CHARS.indexOf(cleanStr.charAt(i));
      if (val === -1) {
        throw new Error(`Invalid Base32 character: ${cleanStr.charAt(i)}`);
      }
      bits += val.toString(2).padStart(5, '0');
    }

    const bytes = [];
    for (let i = 0; i + 8 <= bits.length; i += 8) {
      bytes.push(parseInt(bits.substr(i, 8), 2));
    }

    return new Uint8Array(bytes);
  }

  /**
   * Generate current TOTP code and remaining seconds in 30s period
   * @param {string} secret - Base32 encoded TOTP key
   * @param {number} timeStep - Period in seconds (default 30)
   * @param {number} digits - Number of digits (default 6)
   * @returns {Promise<{code: string, remainingSeconds: number, progressPercent: number}>}
   */
  async function generateToken(secret, timeStep = 30, digits = 6) {
    try {
      const keyBytes = base32ToBuffer(secret);
      if (!keyBytes || keyBytes.length === 0) {
        return null;
      }

      const epoch = Math.round(Date.now() / 1000);
      const time = Math.floor(epoch / timeStep);
      const remainingSeconds = timeStep - (epoch % timeStep);
      const progressPercent = (remainingSeconds / timeStep) * 100;

      // Time buffer as 8-byte big-endian int
      const timeBuffer = new ArrayBuffer(8);
      const timeView = new DataView(timeBuffer);
      timeView.setUint32(4, time, false); // low 32 bits
      timeView.setUint32(0, 0, false);    // high 32 bits

      // Import HMAC key using Web Crypto
      const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyBytes,
        { name: 'HMAC', hash: { name: 'SHA-1' } },
        false,
        ['sign']
      );

      // Sign time buffer
      const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, timeBuffer);
      const hash = new Uint8Array(signature);

      // Dynamic Truncation
      const offset = hash[hash.length - 1] & 0x0f;
      const binary =
        ((hash[offset] & 0x7f) << 24) |
        ((hash[offset + 1] & 0xff) << 16) |
        ((hash[offset + 2] & 0xff) << 8) |
        (hash[offset + 3] & 0xff);

      const otp = binary % Math.pow(10, digits);
      const code = otp.toString().padStart(digits, '0');

      return {
        code,
        formattedCode: `${code.slice(0, 3)} ${code.slice(3)}`,
        remainingSeconds,
        progressPercent
      };
    } catch (err) {
      console.warn('TOTP calculation error:', err);
      return null;
    }
  }

  // Validate if a secret is valid base32
  function isValidSecret(secret) {
    if (!secret || typeof secret !== 'string') return false;
    try {
      const buf = base32ToBuffer(secret);
      return buf !== null && buf.length > 0;
    } catch (e) {
      return false;
    }
  }

  return {
    generateToken,
    isValidSecret
  };
})();
