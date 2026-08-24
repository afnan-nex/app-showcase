/**
 * VaultPass - Web Crypto API Engine
 * 
 * Provides robust browser-side cryptographic operations:
 * - PBKDF2-SHA256 key derivation (100,000 iterations standard)
 * - AES-GCM (256-bit) encryption & decryption with unique 96-bit IV per operation
 * - Cryptographic entropy and password strength evaluation
 * - Secure random byte generation
 * - SHA-256 hashing for vault integrity verification
 * 
 * NOTE: For portfolio demonstration. Browser-only vaults require independent security auditing.
 */

const VaultCrypto = (() => {
  'use strict';

  const PBKDF2_ITERATIONS = 100000;
  const KEY_ALGORITHM = 'AES-GCM';
  const KEY_LENGTH = 256;
  const HASH_ALGORITHM = 'SHA-256';
  const IV_LENGTH = 12; // 96 bits recommended for AES-GCM
  const SALT_LENGTH = 16; // 128 bits

  // Convert ArrayBuffer to Base64
  function bufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  // Convert Base64 to ArrayBuffer
  function base64ToBuffer(base64) {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Convert string to Uint8Array UTF-8
  function strToBuffer(str) {
    return new TextEncoder().encode(str);
  }

  // Convert Uint8Array UTF-8 to string
  function bufferToStr(buffer) {
    return new TextDecoder().decode(buffer);
  }

  // Generate cryptographically secure random bytes
  function getRandomBytes(length) {
    const bytes = new Uint8Array(length);
    window.crypto.getRandomValues(bytes);
    return bytes;
  }

  // Generate random salt in base64
  function generateSalt() {
    return bufferToBase64(getRandomBytes(SALT_LENGTH));
  }

  // Generate random IV in base64
  function generateIV() {
    return bufferToBase64(getRandomBytes(IV_LENGTH));
  }

  /**
   * Derive a CryptoKey from a Master Password and Salt using PBKDF2
   * @param {string} password - Master password
   * @param {string} saltBase64 - Base64 encoded salt
   * @param {number} iterations - PBKDF2 iteration count
   * @returns {Promise<CryptoKey>}
   */
  async function deriveKeyFromPassword(password, saltBase64, iterations = PBKDF2_ITERATIONS) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    const salt = base64ToBuffer(saltBase64);

    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: iterations,
        hash: HASH_ALGORITHM
      },
      keyMaterial,
      {
        name: KEY_ALGORITHM,
        length: KEY_LENGTH
      },
      false, // non-extractable in memory for security
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt plaintext string using AES-GCM with a CryptoKey
   * @param {string} plaintext - Text or JSON string to encrypt
   * @param {CryptoKey} cryptoKey - AES-GCM CryptoKey
   * @returns {Promise<{ciphertext: string, iv: string}>}
   */
  async function encrypt(plaintext, cryptoKey) {
    const iv = getRandomBytes(IV_LENGTH);
    const encoded = strToBuffer(plaintext);

    const ciphertextBuffer = await window.crypto.subtle.encrypt(
      {
        name: KEY_ALGORITHM,
        iv: iv
      },
      cryptoKey,
      encoded
    );

    return {
      ciphertext: bufferToBase64(ciphertextBuffer),
      iv: bufferToBase64(iv)
    };
  }

  /**
   * Decrypt ciphertext string using AES-GCM with a CryptoKey
   * @param {string} ciphertextBase64 - Base64 encoded ciphertext
   * @param {string} ivBase64 - Base64 encoded IV
   * @param {CryptoKey} cryptoKey - AES-GCM CryptoKey
   * @returns {Promise<string>} Plaintext string
   */
  async function decrypt(ciphertextBase64, ivBase64, cryptoKey) {
    try {
      const ciphertext = base64ToBuffer(ciphertextBase64);
      const iv = base64ToBuffer(ivBase64);

      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: KEY_ALGORITHM,
          iv: iv
        },
        cryptoKey,
        ciphertext
      );

      return bufferToStr(decryptedBuffer);
    } catch (err) {
      throw new Error('Decryption failed: Incorrect key or corrupted ciphertext.');
    }
  }

  /**
   * Compute SHA-256 hash of a string
   * @param {string} text
   * @returns {Promise<string>} Hex string
   */
  async function sha256(text) {
    const buffer = await window.crypto.subtle.digest(HASH_ALGORITHM, strToBuffer(text));
    const hashArray = Array.from(new Uint8Array(buffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Calculate password strength and entropy score
   * @param {string} password
   * @returns {object} { score: 0-4, entropy: number, label: string, feedback: string[], color: string }
   */
  function evaluatePasswordStrength(password) {
    if (!password || password.length === 0) {
      return {
        score: 0,
        entropy: 0,
        label: 'None',
        percent: 0,
        feedback: ['Enter a password to evaluate strength'],
        color: 'var(--color-muted)'
      };
    }

    let poolSize = 0;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasDigits = /[0-9]/.test(password);
    const hasSymbols = /[^a-zA-Z0-9]/.test(password);

    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasDigits) poolSize += 10;
    if (hasSymbols) poolSize += 33;

    // Shannon entropy estimate: E = L * log2(R)
    let entropy = poolSize > 0 ? Math.round(password.length * (Math.log(poolSize) / Math.log(2))) : 0;

    const feedback = [];

    // Deduct for patterns
    const commonPatterns = [
      /^[a-zA-Z]+$/, // only letters
      /^[0-9]+$/,    // only digits
      /(.)\1{2,}/,   // repeating characters (aaa, 111)
      /1234|2345|3456|4567|5678|6789|7890|0123/, // sequences
      /qwerty|asdfgh|zxcvbn|password|admin|welcome|123456/i // common words
    ];

    let patternPenalties = 0;
    if (commonPatterns[0].test(password) || commonPatterns[1].test(password)) {
      patternPenalties += 15;
      feedback.push('Add a mix of letters, numbers, and symbols.');
    }
    if (commonPatterns[2].test(password)) {
      patternPenalties += 10;
      feedback.push('Avoid repetitive character sequences.');
    }
    if (commonPatterns[3].test(password) || commonPatterns[4].test(password)) {
      patternPenalties += 20;
      feedback.push('Avoid common keyboard walks or dictionary words.');
    }

    entropy = Math.max(0, entropy - patternPenalties);

    if (password.length < 8) {
      feedback.push('Length should be at least 12 characters.');
    } else if (password.length < 12) {
      feedback.push('Increasing length significantly improves resistance to cracking.');
    }

    let score = 0;
    let label = 'Very Weak';
    let color = 'var(--strength-weak)';
    let percent = 20;

    if (entropy >= 80 && password.length >= 14) {
      score = 4;
      label = 'Very Strong';
      color = 'var(--strength-strong)';
      percent = 100;
      if (feedback.length === 0) feedback.push('Excellent cryptographic resilience.');
    } else if (entropy >= 60 && password.length >= 12) {
      score = 3;
      label = 'Strong';
      color = 'var(--strength-strong)';
      percent = 80;
      if (feedback.length === 0) feedback.push('Strong against brute-force attacks.');
    } else if (entropy >= 40 && password.length >= 9) {
      score = 2;
      label = 'Fair';
      color = 'var(--strength-fair)';
      percent = 60;
    } else if (entropy >= 25 && password.length >= 6) {
      score = 1;
      label = 'Weak';
      color = 'var(--strength-weak)';
      percent = 40;
    } else {
      score = 0;
      label = 'Very Weak';
      color = 'var(--strength-weak)';
      percent = 20;
    }

    return {
      score,
      entropy,
      label,
      percent,
      feedback,
      color,
      hasLower,
      hasUpper,
      hasDigits,
      hasSymbols,
      length: password.length
    };
  }

  // Public API
  return {
    deriveKeyFromPassword,
    encrypt,
    decrypt,
    sha256,
    generateSalt,
    generateIV,
    evaluatePasswordStrength,
    getRandomBytes,
    bufferToBase64,
    base64ToBuffer,
    PBKDF2_ITERATIONS
  };
})();
