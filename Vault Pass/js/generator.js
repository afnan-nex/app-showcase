/**
 * VaultPass - Cryptographic Password & Passphrase Generator
 * 
 * Uses window.crypto.getRandomValues for cryptographically strong randomness.
 * Supports standard passwords, passphrases (Diceware-style), PINs, and ambiguous character filtering.
 */

const VaultGenerator = (() => {
  'use strict';

  const CHAR_SETS = {
    uppercase: 'ABCDEFGHJKLMNPQRSTUVWXYZ', // Clean default
    uppercaseAmbiguous: 'IO',
    lowercase: 'abcdefghijkmnopqrstuvwxyz', // Clean default
    lowercaseAmbiguous: 'l',
    numbers: '23456789', // Clean default
    numbersAmbiguous: '01',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?~',
    symbolsAmbiguous: '\'`"\\/'
  };

  // Curated word list for passphrase generation
  const WORD_LIST = [
    'access', 'action', 'active', 'anchor', 'alpine', 'arcadia', 'aspect', 'atlas', 'atomic', 'aurora',
    'beacon', 'beyond', 'binary', 'blade', 'breeze', 'bridge', 'bundle', 'cactus', 'canyon', 'canvas',
    'carbon', 'castle', 'cedar', 'center', 'cipher', 'circle', 'citadel', 'cloud', 'clover', 'cobalt',
    'comet', 'copper', 'coral', 'cosmos', 'cradle', 'crater', 'crystal', 'curfew', 'cypher', 'delta',
    'desert', 'diamond', 'digit', 'domain', 'dragon', 'drift', 'eagle', 'echo', 'eclipse', 'element',
    'ember', 'emerald', 'engine', 'epoch', 'falcon', 'feather', 'filter', 'firefly', 'flame', 'flash',
    'flight', 'forest', 'fossil', 'galaxy', 'garden', 'gateway', 'gecko', 'gemini', 'glacier', 'glimmer',
    'glyph', 'granite', 'gravity', 'grove', 'harbor', 'haven', 'hawk', 'hazel', 'helix', 'horizon',
    'hybrid', 'hydra', 'impact', 'indigo', 'infinite', 'island', 'jasper', 'journey', 'jungle', 'jupiter',
    'karma', 'knight', 'lagoon', 'lantern', 'laser', 'legacy', 'legend', 'lemur', 'liberty', 'lightning',
    'liquid', 'lizard', 'logic', 'lotus', 'lunar', 'matrix', 'meadow', 'meteor', 'mineral', 'mirror',
    'monarch', 'mosaic', 'motion', 'nebula', 'nexus', 'ninja', 'nomad', 'north', 'nova', 'oasis',
    'obsidian', 'ocean', 'olive', 'omega', 'onyx', 'oracle', 'orbit', 'orchid', 'origin', 'otter',
    'oxygen', 'ozone', 'pacific', 'palace', 'panda', 'panther', 'paradox', 'pathway', 'pearl', 'pegasus',
    'phantom', 'phoenix', 'photon', 'pinnacle', 'planet', 'plasma', 'polar', 'polygon', 'portal', 'prairie',
    'prism', 'proton', 'pulse', 'pyramid', 'quantum', 'quartz', 'quasar', 'quest', 'radar', 'radiant',
    'raptor', 'realm', 'rebel', 'reflex', 'relic', 'remote', 'resonance', 'rhino', 'ridge', 'ripple',
    'river', 'rocket', 'rover', 'ruby', 'safari', 'saffron', 'sapphire', 'saturn', 'scanner', 'scepter',
    'scroll', 'sensor', 'serpent', 'shadow', 'shield', 'sigma', 'signal', 'silicon', 'silver', 'siren',
    'solar', 'sonic', 'spectrum', 'sphere', 'spiral', 'spirit', 'spring', 'static', 'stellar', 'stream',
    'summit', 'sunrise', 'sunset', 'swift', 'symbol', 'synapse', 'tactile', 'talon', 'temple', 'terra',
    'thunder', 'titan', 'topaz', 'torrent', 'totem', 'tracer', 'tracker', 'trident', 'tropic', 'tundra',
    'turbo', 'typhoon', 'ultra', 'umbra', 'unity', 'uranus', 'valley', 'vector', 'velvet', 'vertex',
    'vessel', 'viper', 'vision', 'vital', 'vortex', 'voyage', 'vulcan', 'walnut', 'wander', 'warp',
    'wave', 'whisper', 'wildcat', 'willow', 'wind', 'winter', 'wizard', 'wolf', 'zenith', 'zephyr',
    'zero', 'zigzag', 'zodiac'
  ];

  let sessionHistory = [];

  /**
   * Secure random integer between 0 and max (exclusive)
   */
  function secureRandomInt(max) {
    if (max <= 0) return 0;
    const array = new Uint32Array(1);
    const maxUint32 = 0xFFFFFFFF;
    const limit = maxUint32 - (maxUint32 % max);
    let val;
    do {
      window.crypto.getRandomValues(array);
      val = array[0];
    } while (val >= limit);
    return val % max;
  }

  /**
   * Generate a secure random password based on user options
   */
  function generatePassword(options = {}) {
    const {
      length = 16,
      uppercase = true,
      lowercase = true,
      numbers = true,
      symbols = true,
      excludeAmbiguous = false
    } = options;

    let availableChars = '';
    const guaranteedChars = [];

    // Uppercase
    let upperPool = CHAR_SETS.uppercase + (excludeAmbiguous ? '' : CHAR_SETS.uppercaseAmbiguous);
    if (uppercase) {
      availableChars += upperPool;
      guaranteedChars.push(upperPool[secureRandomInt(upperPool.length)]);
    }

    // Lowercase
    let lowerPool = CHAR_SETS.lowercase + (excludeAmbiguous ? '' : CHAR_SETS.lowercaseAmbiguous);
    if (lowercase) {
      availableChars += lowerPool;
      guaranteedChars.push(lowerPool[secureRandomInt(lowerPool.length)]);
    }

    // Numbers
    let numberPool = CHAR_SETS.numbers + (excludeAmbiguous ? '' : CHAR_SETS.numbersAmbiguous);
    if (numbers) {
      availableChars += numberPool;
      guaranteedChars.push(numberPool[secureRandomInt(numberPool.length)]);
    }

    // Symbols
    let symbolPool = CHAR_SETS.symbols + (excludeAmbiguous ? '' : CHAR_SETS.symbolsAmbiguous);
    if (symbols) {
      availableChars += symbolPool;
      guaranteedChars.push(symbolPool[secureRandomInt(symbolPool.length)]);
    }

    // Fallback if none selected
    if (availableChars.length === 0) {
      availableChars = CHAR_SETS.lowercase + CHAR_SETS.numbers;
      guaranteedChars.push(availableChars[secureRandomInt(availableChars.length)]);
    }

    const passwordArr = [...guaranteedChars];

    while (passwordArr.length < length) {
      const idx = secureRandomInt(availableChars.length);
      passwordArr.push(availableChars[idx]);
    }

    // Shuffle using Fisher-Yates with crypto random
    for (let i = passwordArr.length - 1; i > 0; i--) {
      const j = secureRandomInt(i + 1);
      [passwordArr[i], passwordArr[j]] = [passwordArr[j], passwordArr[i]];
    }

    const password = passwordArr.slice(0, length).join('');

    addToHistory(password, 'password');
    return password;
  }

  /**
   * Generate a memorable Passphrase (e.g. "citadel-emerald-whisper-signal")
   */
  function generatePassphrase(options = {}) {
    const {
      wordCount = 4,
      separator = '-',
      capitalize = true,
      includeNumber = true
    } = options;

    const words = [];
    for (let i = 0; i < wordCount; i++) {
      let word = WORD_LIST[secureRandomInt(WORD_LIST.length)];
      if (capitalize) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      words.push(word);
    }

    if (includeNumber) {
      const num = secureRandomInt(100);
      const pos = secureRandomInt(words.length);
      words[pos] = words[pos] + num;
    }

    const passphrase = words.join(separator);
    addToHistory(passphrase, 'passphrase');
    return passphrase;
  }

  /**
   * Generate a numeric PIN
   */
  function generatePIN(length = 6) {
    let pin = '';
    for (let i = 0; i < length; i++) {
      pin += secureRandomInt(10).toString();
    }
    addToHistory(pin, 'pin');
    return pin;
  }

  function addToHistory(value, type) {
    sessionHistory.unshift({
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      value,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    });
    // Keep last 20
    if (sessionHistory.length > 20) {
      sessionHistory.pop();
    }
  }

  function getHistory() {
    return [...sessionHistory];
  }

  function clearHistory() {
    sessionHistory = [];
  }

  return {
    generatePassword,
    generatePassphrase,
    generatePIN,
    getHistory,
    clearHistory
  };
})();
