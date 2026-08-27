/**
 * GameSmith - Standalone Game Creator & Runtime Bundle
 * Visual 2D Game Creator with 2D Physics, Visual Events, Pixel Art Editor & Audio Synth.
 * 100% Client-Side, Zero Backend, Works on HTTP & file:///
 */

(function() {
'use strict';


/* --- MODULE: js/core/icons.js --- */
/**
 * GameSmith - Local SVG Icons Registry
 * Crisp, developer-focused SVG icons for game editor tools and components.
 */

const ICONS = {
  // Transport & Run
  play: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
  pause: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`,
  stop: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="4" y="4" width="16" height="16" rx="2"></rect></svg>`,
  restart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>`,

  // Scene & Objects
  cube: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
  layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
  eyeOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`,
  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
  unlock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,

  // Tools & Modes
  pointer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l7 18 3-7 7-3L3 3z"></path></svg>`,
  hand: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-4 0v5"></path><path d="M14 10V4a2 2 0 0 0-4 0v7"></path><path d="M10 10.5V6a2 2 0 0 0-4 0v8"></path><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.83L7 15"></path></svg>`,
  grid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
  zoomIn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`,
  zoomOut: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`,
  paint: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0 1 10 10c0 3-2 5.5-5 5.5h-1.5a1.5 1.5 0 0 0-1.5 1.5c0 .8-.7 1.5-1.5 1.5A10.5 10.5 0 0 1 12 2z"></path></svg>`,
  image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
  code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
  lightning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
  music: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`,
  volume: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
  upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`,
  sparkles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>`,
  chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
};

function getIcon(name, extraClass = '') {
  const svg = ICONS[name] || ICONS.cube;
  if (!extraClass) return svg;
  return svg.replace('<svg ', `<svg class="${extraClass}" `);
}

function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

ICONS;


/* --- MODULE: js/core/audio-synth.js --- */
/**
 * GameSmith - Procedural 8-Bit Web Audio Synthesizer
 * Zero-dependency real-time audio sound FX generator for games.
 */

class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  ensureContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  play(presetName = 'jump') {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    switch (presetName.toLowerCase()) {
      case 'jump':
        this.playJump(ctx, now);
        break;
      case 'coin':
        this.playCoin(ctx, now);
        break;
      case 'laser':
        this.playLaser(ctx, now);
        break;
      case 'explosion':
        this.playExplosion(ctx, now);
        break;
      case 'hit':
      case 'hurt':
        this.playHit(ctx, now);
        break;
      case 'powerup':
        this.playPowerup(ctx, now);
        break;
      case 'win':
      case 'victory':
        this.playWin(ctx, now);
        break;
      case 'click':
      default:
        this.playClick(ctx, now);
        break;
    }
  }

  playJump(ctx, now) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  playCoin(ctx, now) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.28);
  }

  playLaser(ctx, now) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  playExplosion(ctx, now) {
    // Noise buffer
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.linearRampToValueAtTime(50, now + 0.3);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    whiteNoise.start(now);
  }

  playHit(ctx, now) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  playPowerup(ctx, now) {
    const notes = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C
    notes.forEach((freq, idx) => {
      const noteTime = now + idx * 0.06;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.15, noteTime);
      gain.gain.linearRampToValueAtTime(0.01, noteTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(noteTime);
      osc.stop(noteTime + 0.08);
    });
  }

  playWin(ctx, now) {
    const melody = [523.25, 523.25, 523.25, 659.25, 783.99]; // C C C E G
    melody.forEach((freq, idx) => {
      const noteTime = now + idx * 0.1;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.2, noteTime);
      gain.gain.linearRampToValueAtTime(0.01, noteTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(noteTime);
      osc.stop(noteTime + 0.18);
    });
  }

  playClick(ctx, now) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.03);
  }
}

const audioSynth = new SoundSynthesizer();
audioSynth;


/* --- MODULE: js/core/input.js --- */
/**
 * GameSmith - Input Manager
 * Tracks keyboard, mouse, and touch events for both editor canvas and play mode runtime.
 */

class InputManager {
  constructor() {
    this.keys = {};
    this.keysDown = {};
    this.keysUp = {};

    this.mouseX = 0;
    this.mouseY = 0;
    this.isMouseDown = false;
    this.mouseClicked = false;

    this.initListeners();
  }

  initListeners() {
    if (typeof window === 'undefined') return;

    window.addEventListener('keydown', (e) => {
      // Don't capture inputs when typing in input fields or textareas
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      const code = e.code;
      if (!this.keys[code]) {
        this.keysDown[code] = true;
      }
      this.keys[code] = true;

      // Prevent page scrolling on Arrow keys and Space during play
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(code)) {
        if (window.gameSmithApp?.isPlaying) {
          e.preventDefault();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      const code = e.code;
      this.keys[code] = false;
      this.keysUp[code] = true;
    });

    window.addEventListener('blur', () => {
      this.reset();
    });
  }

  updateMouse(canvasX, canvasY, isDown = false) {
    this.mouseX = canvasX;
    this.mouseY = canvasY;
    if (isDown && !this.isMouseDown) {
      this.mouseClicked = true;
    }
    this.isMouseDown = isDown;
  }

  endFrame() {
    this.keysDown = {};
    this.keysUp = {};
    this.mouseClicked = false;
  }

  isKey(code) {
    return !!this.keys[code];
  }

  isKeyDown(code) {
    return !!this.keysDown[code];
  }

  isKeyUp(code) {
    return !!this.keysUp[code];
  }

  getHorizontalAxis() {
    let axis = 0;
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) axis -= 1;
    if (this.keys['ArrowRight'] || this.keys['KeyD']) axis += 1;
    return axis;
  }

  getVerticalAxis() {
    let axis = 0;
    if (this.keys['ArrowUp'] || this.keys['KeyW']) axis -= 1;
    if (this.keys['ArrowDown'] || this.keys['KeyS']) axis += 1;
    return axis;
  }

  isJumpPressed() {
    return this.isKeyDown('Space') || this.isKeyDown('ArrowUp') || this.isKeyDown('KeyW');
  }

  isShootPressed() {
    return this.isKeyDown('KeyJ') || this.isKeyDown('KeyZ') || this.isKeyDown('KeyX') || this.mouseClicked;
  }

  reset() {
    this.keys = {};
    this.keysDown = {};
    this.keysUp = {};
    this.isMouseDown = false;
    this.mouseClicked = false;
  }
}

const input = new InputManager();
input;


/* --- MODULE: js/core/db.js --- */
/**
 * GameSmith - IndexedDB Persistence Engine
 * Saves game projects, scenes, custom sprites, and settings locally in the browser.
 */

const DB_NAME = 'GameSmith_DB';
const DB_VERSION = 1;
const STORES = {
  PROJECTS: 'projects',
  SPRITES: 'custom_sprites',
  SETTINGS: 'settings'
};

class GameDatabase {
  constructor() {
    this.db = null;
  }

  async init() {
    if (typeof indexedDB === 'undefined') return;

    return new Promise((resolve) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORES.PROJECTS)) {
          db.createObjectStore(STORES.PROJECTS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.SPRITES)) {
          db.createObjectStore(STORES.SPRITES, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
        }
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };

      request.onerror = () => {
        console.warn('IndexedDB unavailable, using LocalStorage fallback.');
        resolve(null);
      };
    });
  }

  async saveProject(project) {
    if (!project || !project.id) return;
    project.updatedAt = new Date().toISOString();

    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction([STORES.PROJECTS], 'readwrite');
        const store = tx.objectStore(STORES.PROJECTS);
        store.put(project);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    }

    // LocalStorage fallback
    try {
      localStorage.setItem('gamesmith_project_' + project.id, JSON.stringify(project));
      localStorage.setItem('gamesmith_last_project_id', project.id);
    } catch (e) {}
  }

  async loadProject(id) {
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction([STORES.PROJECTS], 'readonly');
        const store = tx.objectStore(STORES.PROJECTS);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    }

    try {
      const raw = localStorage.getItem('gamesmith_project_' + id);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  async getAllProjects() {
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction([STORES.PROJECTS], 'readonly');
        const store = tx.objectStore(STORES.PROJECTS);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    }

    const list = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('gamesmith_project_')) {
          list.push(JSON.parse(localStorage.getItem(key)));
        }
      }
    } catch (e) {}
    return list;
  }

  async saveCustomSprite(sprite) {
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction([STORES.SPRITES], 'readwrite');
        tx.objectStore(STORES.SPRITES).put(sprite);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    }
  }

  async getCustomSprites() {
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction([STORES.SPRITES], 'readonly');
        const req = tx.objectStore(STORES.SPRITES).getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    }
    return [];
  }
}

const db = new GameDatabase();
db;


/* --- MODULE: js/engine/physics.js --- */
/**
 * GameSmith - 2D Physics & Collision Engine
 * Provides Euler physics integration, AABB/Circle collision resolution, and behavior controllers.
 */

function updatePhysics(objects, gravityY = 980, dt = 1/60, worldBounds = { width: 1280, height: 720 }) {
  const activeObjs = objects.filter(o => o.visible !== false);

  // 1. Apply Forces & Integrate Velocity -> Position
  for (const obj of activeObjs) {
    if (obj.physicsType === 'static' || !obj.physicsType || obj.physicsType === 'none') {
      continue;
    }

    obj.isGrounded = false;

    // Apply gravity to dynamic objects
    if (obj.physicsType === 'dynamic') {
      const gScale = obj.gravityScale !== undefined ? obj.gravityScale : 1;
      obj.vy = (obj.vy || 0) + gravityY * gScale * dt;
    }

    // Apply friction
    const friction = obj.friction !== undefined ? obj.friction : 0.9;
    obj.vx = (obj.vx || 0) * Math.pow(friction, dt * 60);

    // Limit max velocity
    const maxV = obj.maxSpeed || 800;
    obj.vx = Math.max(-maxV, Math.min(maxV, obj.vx));
    obj.vy = Math.max(-1200, Math.min(1200, obj.vy));

    // Update X position
    obj.x += obj.vx * dt;

    // Update Y position
    obj.y += obj.vy * dt;
  }

  // 2. Collision Detection & Solid Resolution
  const collisions = [];

  for (let i = 0; i < activeObjs.length; i++) {
    const a = activeObjs[i];
    if (!a.hasCollider) continue;

    for (let j = i + 1; j < activeObjs.length; j++) {
      const b = activeObjs[j];
      if (!b.hasCollider) continue;

      const hit = checkCollision(a, b);
      if (hit.collided) {
        collisions.push({ a, b, normal: hit.normal, overlap: hit.overlap });

        // Resolve solid physics separation if at least one is solid
        if (a.isSolid && b.isSolid) {
          resolveSolidOverlap(a, b, hit.normal, hit.overlap);
        } else if (a.isSolid && b.physicsType === 'dynamic') {
          resolveOneWayOverlap(b, a, hit.normal, hit.overlap);
        } else if (b.isSolid && a.physicsType === 'dynamic') {
          resolveOneWayOverlap(a, b, hit.normal, hit.overlap);
        }
      }
    }
  }

  return collisions;
}

function checkCollision(a, b) {
  const isCircleA = a.colliderShape === 'circle';
  const isCircleB = b.colliderShape === 'circle';

  if (!isCircleA && !isCircleB) {
    return checkAABB(a, b);
  } else if (isCircleA && isCircleB) {
    return checkCircleCircle(a, b);
  } else if (isCircleA) {
    return checkCircleBox(a, b);
  } else {
    const res = checkCircleBox(b, a);
    return { collided: res.collided, normal: { x: -res.normal.x, y: -res.normal.y }, overlap: res.overlap };
  }
}

// Axis-Aligned Bounding Box (AABB)
function checkAABB(a, b) {
  const halfW_a = a.width / 2;
  const halfH_a = a.height / 2;
  const halfW_b = b.width / 2;
  const halfH_b = b.height / 2;

  const centerA_x = a.x + halfW_a;
  const centerA_y = a.y + halfH_a;
  const centerB_x = b.x + halfW_b;
  const centerB_y = b.y + halfH_b;

  const dx = centerB_x - centerA_x;
  const dy = centerB_y - centerA_y;

  const ox = halfW_a + halfW_b - Math.abs(dx);
  const oy = halfH_a + halfH_b - Math.abs(dy);

  if (ox > 0 && oy > 0) {
    if (ox < oy) {
      const normalX = dx > 0 ? 1 : -1;
      return { collided: true, normal: { x: normalX, y: 0 }, overlap: ox };
    } else {
      const normalY = dy > 0 ? 1 : -1;
      return { collided: true, normal: { x: 0, y: normalY }, overlap: oy };
    }
  }

  return { collided: false, normal: { x: 0, y: 0 }, overlap: 0 };
}

// Circle-Circle
function checkCircleCircle(a, b) {
  const radiusA = Math.min(a.width, a.height) / 2;
  const radiusB = Math.min(b.width, b.height) / 2;

  const centerA_x = a.x + a.width / 2;
  const centerA_y = a.y + a.height / 2;
  const centerB_x = b.x + b.width / 2;
  const centerB_y = b.y + b.height / 2;

  const dx = centerB_x - centerA_x;
  const dy = centerB_y - centerA_y;
  const dist = Math.hypot(dx, dy);

  if (dist < radiusA + radiusB) {
    const overlap = radiusA + radiusB - dist;
    const nx = dist > 0 ? dx / dist : 1;
    const ny = dist > 0 ? dy / dist : 0;
    return { collided: true, normal: { x: nx, y: ny }, overlap };
  }

  return { collided: false, normal: { x: 0, y: 0 }, overlap: 0 };
}

// Circle-Box
function checkCircleBox(circle, box) {
  const radius = Math.min(circle.width, circle.height) / 2;
  const circleX = circle.x + circle.width / 2;
  const circleY = circle.y + circle.height / 2;

  // Closest point on box
  const clampX = Math.max(box.x, Math.min(circleX, box.x + box.width));
  const clampY = Math.max(box.y, Math.min(circleY, box.y + box.height));

  const dx = clampX - circleX;
  const dy = clampY - circleY;
  const dist = Math.hypot(dx, dy);

  if (dist < radius) {
    const overlap = radius - dist;
    const nx = dist > 0 ? dx / dist : 1;
    const ny = dist > 0 ? dy / dist : 0;
    return { collided: true, normal: { x: nx, y: ny }, overlap };
  }

  return { collided: false, normal: { x: 0, y: 0 }, overlap: 0 };
}

function resolveSolidOverlap(a, b, normal, overlap) {
  const isStaticA = a.physicsType === 'static' || !a.physicsType;
  const isStaticB = b.physicsType === 'static' || !b.physicsType;

  if (isStaticA && isStaticB) return;

  if (isStaticA) {
    resolveOneWayOverlap(b, a, { x: -normal.x, y: -normal.y }, overlap);
  } else if (isStaticB) {
    resolveOneWayOverlap(a, b, normal, overlap);
  } else {
    // Both dynamic: split overlap
    const half = overlap / 2;
    a.x -= normal.x * half;
    a.y -= normal.y * half;
    b.x += normal.x * half;
    b.y += normal.y * half;
  }
}

function resolveOneWayOverlap(dynamicObj, staticObj, normal, overlap) {
  dynamicObj.x -= normal.x * overlap;
  dynamicObj.y -= normal.y * overlap;

  // If hitting from top (falling onto ground)
  if (normal.y > 0) {
    dynamicObj.vy = 0;
    dynamicObj.isGrounded = true;
  } else if (normal.y < 0) {
    // Hitting ceiling
    dynamicObj.vy = Math.max(0, dynamicObj.vy);
  }

  if (normal.x !== 0) {
    dynamicObj.vx = 0;
  }
}


/* --- MODULE: js/engine/events.js --- */
/**
 * GameSmith - Visual Event Rule Evaluator
 * Evaluates WHEN -> THEN visual game rules and condition-action blocks.
 */




class EventEngine {
  constructor(runtime) {
    this.runtime = runtime;
    this.timerStates = {};
  }

  evaluateRules(events, objects, collisions, variables, dt) {
    if (!events || !Array.isArray(events)) return;

    for (const rule of events) {
      if (!rule.enabled && rule.enabled !== undefined) continue;

      const isTriggered = this.checkTrigger(rule.trigger, objects, collisions, variables, dt);
      if (isTriggered) {
        this.executeActions(rule.actions, objects, variables, isTriggered.context);
      }
    }
  }

  checkTrigger(trigger, objects, collisions, variables, dt) {
    if (!trigger) return false;

    switch (trigger.type) {
      case 'on_start':
        // Only on frame 0 of scene launch
        return this.runtime.isFirstFrame ? { context: {} } : false;

      case 'on_update':
        return { context: {} };

      case 'on_collision': {
        const objA_Id = trigger.objectId;
        const targetType = trigger.targetType || trigger.targetId; // ID or tag like 'coin', 'enemy'

        for (const col of collisions) {
          const hitA = col.a.id === objA_Id || col.a.tag === objA_Id;
          const hitB = col.b.id === objA_Id || col.b.tag === objA_Id;

          if (hitA) {
            const matchTarget = !targetType || col.b.id === targetType || col.b.tag === targetType;
            if (matchTarget) {
              return { context: { source: col.a, target: col.b } };
            }
          }
          if (hitB) {
            const matchTarget = !targetType || col.a.id === targetType || col.a.tag === targetType;
            if (matchTarget) {
              return { context: { source: col.b, target: col.a } };
            }
          }
        }
        return false;
      }

      case 'on_key_press': {
        const key = trigger.key || 'Space';
        return input.isKeyDown(key) ? { context: {} } : false;
      }

      case 'on_key_down': {
        const key = trigger.key || 'Space';
        return input.isKey(key) ? { context: {} } : false;
      }

      case 'on_click': {
        if (!input.mouseClicked) return false;
        const targetObj = objects.find(o => o.id === trigger.objectId);
        if (!targetObj) return false;

        const mx = input.mouseX;
        const my = input.mouseY;
        const inside = mx >= targetObj.x && mx <= targetObj.x + targetObj.width &&
                       my >= targetObj.y && my <= targetObj.y + targetObj.height;
        return inside ? { context: { target: targetObj } } : false;
      }

      case 'on_timer': {
        const timerId = trigger.id || 'timer_' + trigger.interval;
        const interval = Number(trigger.interval) || 1.0;
        this.timerStates[timerId] = (this.timerStates[timerId] || 0) + dt;
        if (this.timerStates[timerId] >= interval) {
          this.timerStates[timerId] = 0;
          return { context: {} };
        }
        return false;
      }

      case 'on_variable': {
        const varName = trigger.variable;
        const curVal = variables[varName];
        const targetVal = trigger.value;
        const op = trigger.operator || '==';

        let conditionMet = false;
        if (op === '==' && curVal == targetVal) conditionMet = true;
        if (op === '!=' && curVal != targetVal) conditionMet = true;
        if (op === '>=' && Number(curVal) >= Number(targetVal)) conditionMet = true;
        if (op === '<=' && Number(curVal) <= Number(targetVal)) conditionMet = true;
        if (op === '>' && Number(curVal) > Number(targetVal)) conditionMet = true;
        if (op === '<' && Number(curVal) < Number(targetVal)) conditionMet = true;

        return conditionMet ? { context: {} } : false;
      }

      case 'on_out_of_bounds': {
        const targetObj = objects.find(o => o.id === trigger.objectId);
        if (!targetObj) return false;
        const world = this.runtime.currentScene.bounds || { width: 1280, height: 720 };
        const isOut = targetObj.x < -100 || targetObj.x > world.width + 100 ||
                      targetObj.y < -100 || targetObj.y > world.height + 100;
        return isOut ? { context: { target: targetObj } } : false;
      }

      default:
        return false;
    }
  }

  executeActions(actions, objects, variables, context = {}) {
    if (!actions || !Array.isArray(actions)) return;

    for (const action of actions) {
      switch (action.type) {
        case 'change_variable': {
          const varName = action.variable;
          const op = action.operation || 'add';
          const val = action.value;

          if (op === 'set') {
            variables[varName] = isNaN(val) ? val : Number(val);
          } else if (op === 'add') {
            variables[varName] = (Number(variables[varName]) || 0) + Number(val);
          } else if (op === 'subtract') {
            variables[varName] = (Number(variables[varName]) || 0) - Number(val);
          }
          break;
        }

        case 'play_sound': {
          const soundName = action.sound || 'coin';
          audioSynth.play(soundName);
          break;
        }

        case 'destroy_object': {
          const targetId = action.targetId === 'context.target' && context.target
            ? context.target.id
            : action.targetId;

          const idx = objects.findIndex(o => o.id === targetId);
          if (idx !== -1) {
            // Spawn explosion particles
            this.runtime.spawnParticles(objects[idx].x + objects[idx].width / 2, objects[idx].y + objects[idx].height / 2, objects[idx].color || '#f85149');
            objects.splice(idx, 1);
          }
          break;
        }

        case 'spawn_object': {
          let spawnX = Number(action.x) || 0;
          let spawnY = Number(action.y) || 0;

          if (action.spawnAt === 'player' && this.runtime.playerObj) {
            spawnX = this.runtime.playerObj.x + this.runtime.playerObj.width / 2;
            spawnY = this.runtime.playerObj.y + this.runtime.playerObj.height / 2;
          }

          const newObj = {
            id: 'spawned_' + Math.random().toString(36).substr(2, 6),
            name: action.objectName || 'Bullet',
            tag: action.tag || 'projectile',
            x: spawnX,
            y: spawnY,
            width: Number(action.width) || 12,
            height: Number(action.height) || 12,
            color: action.color || '#58a6ff',
            physicsType: action.physicsType || 'dynamic',
            gravityScale: Number(action.gravityScale) || 0,
            vx: Number(action.vx) || 0,
            vy: Number(action.vy) || 0,
            hasCollider: true,
            isSolid: false,
            behavior: action.behavior || 'bullet'
          };
          objects.push(newObj);
          break;
        }

        case 'move_object': {
          const targetObj = action.targetId === 'player'
            ? this.runtime.playerObj
            : objects.find(o => o.id === action.targetId);

          if (targetObj) {
            if (action.vx !== undefined) targetObj.vx = Number(action.vx);
            if (action.vy !== undefined) targetObj.vy = Number(action.vy);
            if (action.impulseY !== undefined) targetObj.vy = -Number(action.impulseY);
          }
          break;
        }

        case 'set_position': {
          const targetObj = objects.find(o => o.id === action.targetId);
          if (targetObj) {
            targetObj.x = Number(action.x) || 0;
            targetObj.y = Number(action.y) || 0;
          }
          break;
        }

        case 'show_message': {
          this.runtime.showHUDMessage(action.message, Number(action.duration) || 3.0);
          break;
        }

        case 'change_scene': {
          if (action.sceneId) {
            this.runtime.changeScene(action.sceneId);
          }
          break;
        }

        case 'restart_scene': {
          this.runtime.restartScene();
          break;
        }

        case 'toggle_visible': {
          const targetObj = objects.find(o => o.id === action.targetId);
          if (targetObj) {
            targetObj.visible = action.visible !== undefined ? action.visible : !targetObj.visible;
          }
          break;
        }

        default:
          break;
      }
    }
  }
}


/* --- MODULE: js/engine/renderer.js --- */
/**
 * GameSmith - Canvas 2D Renderer & Particle System
 * High-performance 2D renderer for both editor viewport and play mode runtime.
 */

class GameRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = { x: 0, y: 0, zoom: 1 };
    this.particles = [];
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  clear(bgColor = '#0d1117') {
    this.ctx.fillStyle = bgColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // --- Editor Grid ---
  drawGrid(gridSize = 32, zoom = 1, panX = 0, panY = 0) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    const scaledGrid = gridSize * zoom;
    const startX = (panX % scaledGrid);
    const startY = (panY % scaledGrid);

    ctx.beginPath();
    for (let x = startX; x < w; x += scaledGrid) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = startY; y < h; y += scaledGrid) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();

    // Origin crosshair
    ctx.strokeStyle = 'rgba(88, 166, 255, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(panX, 0);
    ctx.lineTo(panX, h);
    ctx.moveTo(0, panY);
    ctx.lineTo(w, panY);
    ctx.stroke();

    ctx.restore();
  }

  // --- Scene World Bounds ---
  drawWorldBounds(bounds = { width: 1280, height: 720 }, camera) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 2 / camera.zoom;
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(0, 0, bounds.width, bounds.height);
    ctx.restore();
  }

  // --- Render Single Object ---
  renderObject(obj, isSelected = false, showColliders = false, spriteLibrary = {}) {
    if (obj.visible === false) return;

    const ctx = this.ctx;
    ctx.save();
    ctx.translate(obj.x + obj.width / 2, obj.y + obj.height / 2);
    if (obj.rotation) {
      ctx.rotate((obj.rotation * Math.PI) / 180);
    }
    if (obj.opacity !== undefined) {
      ctx.globalAlpha = obj.opacity;
    }

    const halfW = obj.width / 2;
    const halfH = obj.height / 2;

    // 1. Draw Sprite or Geometry
    if (obj.spriteId && spriteLibrary[obj.spriteId]) {
      this.drawPixelSprite(spriteLibrary[obj.spriteId], -halfW, -halfH, obj.width, obj.height, obj.flipX);
    } else {
      this.drawDefaultShape(obj, -halfW, -halfH, obj.width, obj.height);
    }

    // 2. Collider Wireframe (in editor or debug mode)
    if (showColliders && obj.hasCollider) {
      ctx.strokeStyle = obj.isSolid ? '#3fb950' : '#d29922';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      if (obj.colliderShape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, Math.min(halfW, halfH), 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.strokeRect(-halfW, -halfH, obj.width, obj.height);
      }
    }

    // 3. Selection Bounding Box & Handles (Editor Only)
    if (isSelected) {
      ctx.strokeStyle = '#58a6ff';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.strokeRect(-halfW - 2, -halfH - 2, obj.width + 4, obj.height + 4);

      // Corner handles
      const hSize = 6;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-halfW - 2 - hSize / 2, -halfH - 2 - hSize / 2, hSize, hSize);
      ctx.fillRect(halfW + 2 - hSize / 2, -halfH - 2 - hSize / 2, hSize, hSize);
      ctx.fillRect(halfW + 2 - hSize / 2, halfH + 2 - hSize / 2, hSize, hSize);
      ctx.fillRect(-halfW - 2 - hSize / 2, halfH + 2 - hSize / 2, hSize, hSize);
    }

    ctx.restore();
  }

  drawDefaultShape(obj, x, y, w, h) {
    const ctx = this.ctx;
    ctx.fillStyle = obj.color || '#58a6ff';

    switch (obj.shape || obj.drawMode) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'spike':
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.lineTo(x + w / 2, y);
        ctx.lineTo(x + w, y + h);
        ctx.closePath();
        ctx.fill();
        break;

      case 'coin':
        ctx.fillStyle = '#f1e05a';
        ctx.beginPath();
        ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#d29922';
        ctx.lineWidth = 2;
        ctx.stroke();
        break;

      case 'text':
        ctx.font = `${obj.fontSize || 16}px 'JetBrains Mono', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(obj.text || obj.name, x + w / 2, y + h / 2);
        break;

      case 'platform':
      case 'rect':
      default:
        // Rounded rectangle
        const r = Math.min(4, w / 4, h / 4);
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, [r]);
        ctx.fill();
        break;
    }
  }

  // --- Pixel Art Sprite Renderer ---
  drawPixelSprite(spriteData, x, y, w, h, flipX = false) {
    if (!spriteData || !spriteData.pixels) return;
    const ctx = this.ctx;
    const gridDim = spriteData.size || 16;
    const pixelW = w / gridDim;
    const pixelH = h / gridDim;

    ctx.save();
    if (flipX) {
      ctx.scale(-1, 1);
      x = -x - w;
    }

    for (let row = 0; row < gridDim; row++) {
      for (let col = 0; col < gridDim; col++) {
        const color = spriteData.pixels[row * gridDim + col];
        if (color && color !== 'transparent') {
          ctx.fillStyle = color;
          ctx.fillRect(x + col * pixelW, y + row * pixelH, pixelW + 0.5, pixelH + 0.5);
        }
      }
    }
    ctx.restore();
  }

  // --- Particle System ---
  spawnParticles(x, y, color = '#f85149', count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 160;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.4 + Math.random() * 0.3,
        maxLife: 0.6,
        color,
        size: 3 + Math.random() * 4
      });
    }
  }

  updateAndDrawParticles(dt) {
    const ctx = this.ctx;
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // --- Play Mode HUD Overlay ---
  drawHUD(variables = {}, message = '', bounds = { width: 1280, height: 720 }) {
    const ctx = this.ctx;
    ctx.save();

    // Top Bar HUD
    ctx.fillStyle = 'rgba(22, 27, 34, 0.85)';
    ctx.fillRect(16, 16, 260, 48);
    ctx.strokeStyle = '#30363d';
    ctx.lineWidth = 1;
    ctx.strokeRect(16, 16, 260, 48);

    ctx.font = "bold 13px 'JetBrains Mono', monospace";
    ctx.fillStyle = '#f0f6fc';

    let varText = '';
    if (variables.score !== undefined) varText += `Score: ${variables.score}  `;
    if (variables.lives !== undefined) varText += `Lives: ${variables.lives}  `;
    if (variables.coins !== undefined) varText += `Coins: ${variables.coins}  `;

    if (!varText) {
      varText = Object.entries(variables).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join('  ');
    }

    ctx.fillText(varText || 'Game Running', 30, 45);

    // On-screen message banner
    if (message) {
      const msgWidth = Math.min(500, this.canvas.width - 40);
      const msgX = (this.canvas.width - msgWidth) / 2;
      const msgY = this.canvas.height / 3;

      ctx.fillStyle = 'rgba(13, 17, 23, 0.95)';
      ctx.strokeStyle = '#58a6ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(msgX, msgY, msgWidth, 70, [8]);
      ctx.fill();
      ctx.stroke();

      ctx.font = "bold 20px 'Inter', sans-serif";
      ctx.fillStyle = '#f0f6fc';
      ctx.textAlign = 'center';
      ctx.fillText(message, msgX + msgWidth / 2, msgY + 42);
    }

    ctx.restore();
  }
}


/* --- MODULE: js/engine/runtime.js --- */
/**
 * GameSmith - Active Play Mode Game Runtime
 * Orchestrates the 60fps requestAnimationFrame game loop, state rollback, behavior updates, and debug stats.
 */





class GameRuntime {
  constructor(renderer, spriteLibrary = {}) {
    this.renderer = renderer;
    this.spriteLibrary = spriteLibrary;
    this.eventEngine = new EventEngine(this);

    this.isPlaying = false;
    this.isPaused = false;
    this.animFrameId = null;

    // Runtime state (isolated from editor)
    this.currentScene = null;
    this.runtimeObjects = [];
    this.runtimeVariables = {};
    this.savedEditorScene = null;

    this.isFirstFrame = true;
    this.hudMessage = '';
    this.hudMessageTimer = 0;
    this.playerObj = null;

    // Performance stats
    this.fps = 60;
    this.frameCount = 0;
    this.lastTime = 0;
    this.fpsTimer = 0;

    this.onStateChange = null;
  }

  startPlay(scene, projectVariables = {}, spriteLibrary = {}) {
    this.spriteLibrary = spriteLibrary;
    this.savedEditorScene = JSON.parse(JSON.stringify(scene));

    // Deep clone scene objects and variables
    this.currentScene = JSON.parse(JSON.stringify(scene));
    this.runtimeObjects = this.currentScene.objects || [];
    this.runtimeVariables = JSON.parse(JSON.stringify(projectVariables));

    this.isFirstFrame = true;
    this.isPlaying = true;
    this.isPaused = false;
    this.hudMessage = '';
    this.hudMessageTimer = 0;
    this.renderer.particles = [];

    // Find primary player object
    this.playerObj = this.runtimeObjects.find(o => o.behavior === 'player' || o.tag === 'player') || null;

    this.lastTime = performance.now();
    this.loop = this.loop.bind(this);
    this.animFrameId = requestAnimationFrame(this.loop);

    if (this.onStateChange) this.onStateChange('playing');
  }

  stopPlay() {
    this.isPlaying = false;
    this.isPaused = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    input.reset();

    // Rollback to original editor state
    const originalScene = this.savedEditorScene;
    this.runtimeObjects = [];
    this.currentScene = null;

    if (this.onStateChange) this.onStateChange('stopped', originalScene);
  }

  pausePlay() {
    this.isPaused = !this.isPaused;
    if (this.onStateChange) this.onStateChange(this.isPaused ? 'paused' : 'playing');
  }

  loop(currentTime) {
    if (!this.isPlaying) return;

    const dt = Math.min(0.1, (currentTime - this.lastTime) / 1000);
    this.lastTime = currentTime;

    // Calculate FPS
    this.frameCount++;
    this.fpsTimer += dt;
    if (this.fpsTimer >= 0.5) {
      this.fps = Math.round((this.frameCount / this.fpsTimer));
      this.frameCount = 0;
      this.fpsTimer = 0;
    }

    if (!this.isPaused) {
      this.update(dt);
    }

    this.render();
    input.endFrame();
    this.isFirstFrame = false;

    this.animFrameId = requestAnimationFrame(this.loop);
  }

  update(dt) {
    // 1. Update Object Behaviors (Player, Enemy Patrol, Bullets)
    this.updateBehaviors(dt);

    // 2. Physics & Collisions
    const gravity = this.currentScene.gravity !== undefined ? this.currentScene.gravity : 980;
    const collisions = updatePhysics(this.runtimeObjects, gravity, dt, this.currentScene.bounds);

    // 3. Evaluate Visual Event Rules
    this.eventEngine.evaluateRules(
      this.currentScene.events || [],
      this.runtimeObjects,
      collisions,
      this.runtimeVariables,
      dt
    );

    // 4. Update HUD message timer
    if (this.hudMessageTimer > 0) {
      this.hudMessageTimer -= dt;
      if (this.hudMessageTimer <= 0) {
        this.hudMessage = '';
      }
    }

    // 5. Update Camera to Follow Player
    if (this.playerObj && this.currentScene.cameraFollow !== false) {
      const targetX = this.playerObj.x + this.playerObj.width / 2 - this.renderer.canvas.width / 2;
      const targetY = this.playerObj.y + this.playerObj.height / 2 - this.renderer.canvas.height / 2;
      this.renderer.camera.x += (targetX - this.renderer.camera.x) * 0.1;
      this.renderer.camera.y += (targetY - this.renderer.camera.y) * 0.1;
    }
  }

  updateBehaviors(dt) {
    for (let i = this.runtimeObjects.length - 1; i >= 0; i--) {
      const obj = this.runtimeObjects[i];
      if (obj.visible === false) continue;

      // Platformer Player Controller
      if (obj.behavior === 'player') {
        const hAxis = input.getHorizontalAxis();
        const moveSpeed = obj.moveSpeed || 320;
        obj.vx = hAxis * moveSpeed;

        if (hAxis !== 0) {
          obj.flipX = hAxis < 0;
        }

        // Jump
        if (input.isJumpPressed() && (obj.isGrounded || obj.physicsType !== 'dynamic')) {
          obj.vy = -(obj.jumpForce || 480);
          obj.isGrounded = false;
        }
      }

      // Top-Down Player Controller
      else if (obj.behavior === 'topdown') {
        const hAxis = input.getHorizontalAxis();
        const vAxis = input.getVerticalAxis();
        const moveSpeed = obj.moveSpeed || 250;
        obj.vx = hAxis * moveSpeed;
        obj.vy = vAxis * moveSpeed;

        if (hAxis !== 0) obj.flipX = hAxis < 0;
      }

      // Enemy Patrol AI
      else if (obj.behavior === 'patrol') {
        const patrolSpeed = obj.patrolSpeed || 100;
        if (obj.patrolDir === undefined) obj.patrolDir = 1;

        obj.vx = obj.patrolDir * patrolSpeed;
        obj.flipX = obj.patrolDir < 0;

        // Turn around on patrol distance
        obj.patrolDist = (obj.patrolDist || 0) + Math.abs(obj.vx * dt);
        if (obj.patrolDist > (obj.maxPatrolDist || 200)) {
          obj.patrolDir *= -1;
          obj.patrolDist = 0;
        }
      }

      // Bullet / Projectile
      else if (obj.behavior === 'bullet') {
        obj.lifespan = (obj.lifespan || 3.0) - dt;
        if (obj.lifespan <= 0) {
          this.runtimeObjects.splice(i, 1);
        }
      }
    }
  }

  render() {
    const r = this.renderer;
    r.clear(this.currentScene.bgColor || '#0d1117');

    const ctx = r.ctx;
    ctx.save();

    // Apply Camera Transform
    ctx.translate(-r.camera.x, -r.camera.y);

    // Draw World Bounds
    r.drawWorldBounds(this.currentScene.bounds || { width: 1280, height: 720 }, r.camera);

    // Sort objects by layer / Z-Index
    const sorted = [...this.runtimeObjects].sort((a, b) => (a.layer || 0) - (b.layer || 0));

    // Render Game Objects
    for (const obj of sorted) {
      r.renderObject(obj, false, false, this.spriteLibrary);
    }

    // Render Particles
    r.updateAndDrawParticles(1/60);

    ctx.restore();

    // Render UI / HUD Overlay
    r.drawHUD(this.runtimeVariables, this.hudMessage, this.currentScene.bounds);
  }

  spawnParticles(x, y, color) {
    this.renderer.spawnParticles(x, y, color);
  }

  showHUDMessage(msg, duration = 3.0) {
    this.hudMessage = msg;
    this.hudMessageTimer = duration;
  }

  restartScene() {
    const currentId = this.currentScene.id;
    this.changeScene(currentId);
  }

  changeScene(sceneId) {
    if (window.gameSmithApp) {
      window.gameSmithApp.switchSceneInRuntime(sceneId);
    }
  }
}


/* --- MODULE: js/editor/templates.js --- */
/**
 * GameSmith - Pre-Built Game Templates
 * Ready-to-play projects demonstrating 2D physics, visual rules, audio, and gameplay logic.
 */

const TEMPLATES = {
  // 1. Neon Knight (2D Platformer)
  platformer: {
    id: 'proj_neon_knight',
    name: 'Neon Knight (2D Platformer)',
    version: '1.0',
    variables: { score: 0, lives: 3, coins: 0 },
    scenes: [
      {
        id: 'scene_level1',
        name: 'Level 1: Crystal Caverns',
        bgColor: '#090d16',
        gravity: 980,
        cameraFollow: true,
        bounds: { width: 1600, height: 800 },
        objects: [
          // Player
          {
            id: 'player',
            name: 'Neon Knight',
            tag: 'player',
            layer: 10,
            x: 100,
            y: 500,
            width: 32,
            height: 48,
            color: '#58a6ff',
            shape: 'rect',
            physicsType: 'dynamic',
            hasCollider: true,
            isSolid: false,
            colliderShape: 'box',
            gravityScale: 1,
            behavior: 'player',
            moveSpeed: 320,
            jumpForce: 520
          },
          // Floors & Platforms
          {
            id: 'floor_main',
            name: 'Ground Floor',
            tag: 'solid',
            layer: 1,
            x: 0,
            y: 680,
            width: 1600,
            height: 120,
            color: '#21262d',
            shape: 'platform',
            physicsType: 'static',
            hasCollider: true,
            isSolid: true
          },
          {
            id: 'plat_1',
            name: 'Floating Platform 1',
            tag: 'solid',
            layer: 1,
            x: 280,
            y: 520,
            width: 180,
            height: 24,
            color: '#30363d',
            shape: 'platform',
            physicsType: 'static',
            hasCollider: true,
            isSolid: true
          },
          {
            id: 'plat_2',
            name: 'Floating Platform 2',
            tag: 'solid',
            layer: 1,
            x: 560,
            y: 400,
            width: 160,
            height: 24,
            color: '#30363d',
            shape: 'platform',
            physicsType: 'static',
            hasCollider: true,
            isSolid: true
          },
          {
            id: 'plat_3',
            name: 'Floating Platform 3',
            tag: 'solid',
            layer: 1,
            x: 840,
            y: 300,
            width: 200,
            height: 24,
            color: '#30363d',
            shape: 'platform',
            physicsType: 'static',
            hasCollider: true,
            isSolid: true
          },
          // Collectible Coins
          {
            id: 'coin_1',
            name: 'Crystal Coin 1',
            tag: 'coin',
            layer: 5,
            x: 340,
            y: 460,
            width: 20,
            height: 20,
            color: '#f1e05a',
            shape: 'coin',
            physicsType: 'static',
            hasCollider: true,
            isSolid: false,
            colliderShape: 'circle'
          },
          {
            id: 'coin_2',
            name: 'Crystal Coin 2',
            tag: 'coin',
            layer: 5,
            x: 620,
            y: 340,
            width: 20,
            height: 20,
            color: '#f1e05a',
            shape: 'coin',
            physicsType: 'static',
            hasCollider: true,
            isSolid: false,
            colliderShape: 'circle'
          },
          {
            id: 'coin_3',
            name: 'Crystal Coin 3',
            tag: 'coin',
            layer: 5,
            x: 920,
            y: 240,
            width: 20,
            height: 20,
            color: '#f1e05a',
            shape: 'coin',
            physicsType: 'static',
            hasCollider: true,
            isSolid: false,
            colliderShape: 'circle'
          },
          // Enemy Patrol Slime
          {
            id: 'enemy_slime',
            name: 'Shadow Slime',
            tag: 'enemy',
            layer: 5,
            x: 880,
            y: 260,
            width: 28,
            height: 28,
            color: '#f85149',
            shape: 'circle',
            physicsType: 'static',
            hasCollider: true,
            isSolid: false,
            colliderShape: 'circle',
            behavior: 'patrol',
            patrolSpeed: 80,
            maxPatrolDist: 140
          },
          // Goal Flag / Portal
          {
            id: 'goal_portal',
            name: 'Victory Portal',
            tag: 'goal',
            layer: 2,
            x: 1400,
            y: 580,
            width: 40,
            height: 100,
            color: '#3fb950',
            shape: 'rect',
            physicsType: 'static',
            hasCollider: true,
            isSolid: false
          }
        ],
        events: [
          // Coin collection rule
          {
            id: 'rule_coin',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'player', targetType: 'coin' },
            actions: [
              { type: 'change_variable', variable: 'score', operation: 'add', value: 100 },
              { type: 'change_variable', variable: 'coins', operation: 'add', value: 1 },
              { type: 'play_sound', sound: 'coin' },
              { type: 'destroy_object', targetId: 'context.target' }
            ]
          },
          // Enemy collision rule
          {
            id: 'rule_enemy',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'player', targetType: 'enemy' },
            actions: [
              { type: 'change_variable', variable: 'lives', operation: 'subtract', value: 1 },
              { type: 'play_sound', sound: 'hit' },
              { type: 'show_message', message: 'Ouch! Lost 1 Life', duration: 2 },
              { type: 'set_position', targetId: 'player', x: 100, y: 500 }
            ]
          },
          // Goal victory rule
          {
            id: 'rule_goal',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'player', targetType: 'goal' },
            actions: [
              { type: 'play_sound', sound: 'win' },
              { type: 'show_message', message: 'Victory! Level Completed!', duration: 5 }
            ]
          },
          // Fall off screen respawn
          {
            id: 'rule_fall',
            enabled: true,
            trigger: { type: 'on_out_of_bounds', objectId: 'player' },
            actions: [
              { type: 'set_position', targetId: 'player', x: 100, y: 500 },
              { type: 'play_sound', sound: 'hit' }
            ]
          }
        ]
      }
    ],
    sprites: {
      sprite_knight: {
        id: 'sprite_knight',
        name: 'Knight Hero',
        size: 16,
        primaryColor: '#58a6ff',
        pixels: []
      }
    }
  },

  // 2. Space Defender (Arcade Shooter)
  shooter: {
    id: 'proj_space_defender',
    name: 'Space Defender (Arcade)',
    version: '1.0',
    variables: { score: 0, lasers: 100 },
    scenes: [
      {
        id: 'scene_space',
        name: 'Sector 7 Orbit',
        bgColor: '#030712',
        gravity: 0,
        cameraFollow: false,
        bounds: { width: 1024, height: 600 },
        objects: [
          // Spaceship
          {
            id: 'player_ship',
            name: 'Star Fighter',
            tag: 'player',
            layer: 10,
            x: 480,
            y: 480,
            width: 40,
            height: 40,
            color: '#3fb950',
            shape: 'spike',
            physicsType: 'dynamic',
            hasCollider: true,
            isSolid: false,
            gravityScale: 0,
            behavior: 'topdown',
            moveSpeed: 300
          },
          // Asteroids
          {
            id: 'asteroid_1',
            name: 'Meteor Alpha',
            tag: 'enemy',
            layer: 5,
            x: 200,
            y: 120,
            width: 44,
            height: 44,
            color: '#8b949e',
            shape: 'circle',
            physicsType: 'static',
            hasCollider: true,
            isSolid: false,
            colliderShape: 'circle',
            behavior: 'patrol',
            patrolSpeed: 60,
            maxPatrolDist: 200
          },
          {
            id: 'asteroid_2',
            name: 'Meteor Beta',
            tag: 'enemy',
            layer: 5,
            x: 600,
            y: 160,
            width: 52,
            height: 52,
            color: '#8b949e',
            shape: 'circle',
            physicsType: 'static',
            hasCollider: true,
            isSolid: false,
            colliderShape: 'circle',
            behavior: 'patrol',
            patrolSpeed: 75,
            maxPatrolDist: 220
          }
        ],
        events: [
          // Shoot Laser (Key J or Space)
          {
            id: 'rule_shoot',
            enabled: true,
            trigger: { type: 'on_key_press', key: 'Space' },
            actions: [
              { type: 'spawn_object', objectName: 'Laser', tag: 'laser', spawnAt: 'player', width: 6, height: 16, color: '#f85149', vx: 0, vy: -600, behavior: 'bullet' },
              { type: 'play_sound', sound: 'laser' }
            ]
          },
          // Laser hits enemy
          {
            id: 'rule_hit_enemy',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'asteroid_1', targetType: 'laser' },
            actions: [
              { type: 'change_variable', variable: 'score', operation: 'add', value: 250 },
              { type: 'play_sound', sound: 'explosion' },
              { type: 'destroy_object', targetId: 'context.target' }
            ]
          }
        ]
      }
    ]
  },

  // 3. Dungeon Quest (Top-Down Adventure)
  adventure: {
    id: 'proj_dungeon_quest',
    name: 'Dungeon Quest (Top-Down)',
    version: '1.0',
    variables: { score: 0, keys: 0, health: 100 },
    scenes: [
      {
        id: 'scene_dungeon',
        name: 'The Lost Crypt',
        bgColor: '#111827',
        gravity: 0,
        cameraFollow: true,
        bounds: { width: 1200, height: 800 },
        objects: [
          // Player
          {
            id: 'hero',
            name: 'Hero Adventurer',
            tag: 'player',
            layer: 10,
            x: 200,
            y: 400,
            width: 32,
            height: 32,
            color: '#a371f7',
            shape: 'circle',
            physicsType: 'dynamic',
            hasCollider: true,
            isSolid: false,
            gravityScale: 0,
            behavior: 'topdown',
            moveSpeed: 240
          },
          // Walls
          { id: 'w1', name: 'North Wall', tag: 'solid', layer: 1, x: 50, y: 50, width: 1100, height: 24, color: '#374151', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },
          { id: 'w2', name: 'South Wall', tag: 'solid', layer: 1, x: 50, y: 720, width: 1100, height: 24, color: '#374151', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },
          { id: 'w3', name: 'West Wall', tag: 'solid', layer: 1, x: 50, y: 50, width: 24, height: 694, color: '#374151', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },
          { id: 'w4', name: 'East Wall', tag: 'solid', layer: 1, x: 1126, y: 50, width: 24, height: 694, color: '#374151', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },
          // Key & Chest
          { id: 'key_gold', name: 'Gold Key', tag: 'key', layer: 3, x: 450, y: 200, width: 20, height: 20, color: '#f1e05a', shape: 'coin', physicsType: 'static', hasCollider: true, isSolid: false },
          { id: 'chest_treasure', name: 'Treasure Chest', tag: 'chest', layer: 3, x: 950, y: 400, width: 40, height: 40, color: '#d29922', shape: 'rect', physicsType: 'static', hasCollider: true, isSolid: true }
        ],
        events: [
          {
            id: 'rule_get_key',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'hero', targetType: 'key' },
            actions: [
              { type: 'change_variable', variable: 'keys', operation: 'add', value: 1 },
              { type: 'play_sound', sound: 'powerup' },
              { type: 'show_message', message: 'Found Gold Key!', duration: 2 },
              { type: 'destroy_object', targetId: 'context.target' }
            ]
          },
          {
            id: 'rule_open_chest',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'hero', targetType: 'chest' },
            actions: [
              { type: 'change_variable', variable: 'score', operation: 'add', value: 1000 },
              { type: 'play_sound', sound: 'win' },
              { type: 'show_message', message: 'Opened Treasure! Quest Complete!', duration: 5 }
            ]
          }
        ]
      }
    ]
  }
};


/* --- MODULE: js/editor/scene-tree.js --- */
/**
 * GameSmith - Scene Tree & Asset Manager Panel
 * Hierarchical scene object listing, sprite assets drawer, and global variables manager.
 */




function renderSceneTreePanel(container, {
  currentScene,
  selectedObjectId,
  projectVariables = {},
  spriteLibrary = {},
  activeTab = 'tree',
  onSelectObject = null,
  onAddObject = null,
  onDeleteObject = null,
  onDuplicateObject = null,
  onToggleVisibility = null,
  onToggleLock = null,
  onAddVariable = null,
  onDeleteVariable = null,
  onOpenSpritePainter = null
}) {
  const objects = currentScene.objects || [];

  container.innerHTML = `
    <!-- Top Sub-Tabs -->
    <div class="panel-subtabs">
      <button class="subtab-btn ${activeTab === 'tree' ? 'active' : ''}" data-tab="tree">
        ${getIcon('cube', 'icon-xs')} Hierarchy
      </button>
      <button class="subtab-btn ${activeTab === 'assets' ? 'active' : ''}" data-tab="assets">
        ${getIcon('image', 'icon-xs')} Assets
      </button>
      <button class="subtab-btn ${activeTab === 'vars' ? 'active' : ''}" data-tab="vars">
        ${getIcon('code', 'icon-xs')} Variables
      </button>
    </div>

    <!-- Tab 1: Hierarchy Tree -->
    <div class="subtab-content ${activeTab === 'tree' ? 'active' : ''}" id="tab-hierarchy">
      <div class="hierarchy-actions-bar">
        <span class="text-xs font-semibold text-muted uppercase">Objects (${objects.length})</span>
        <button class="btn btn-xs btn-primary" id="btn-tree-add-object">
          ${getIcon('plus', 'icon-xs')} New Object
        </button>
      </div>
      <div class="scene-tree-list">
        ${objects.length === 0 ? `
          <div class="p-4 text-center text-muted text-xs">Scene is empty. Click "+ New Object" to add elements.</div>
        ` : objects.map(obj => {
          const isSelected = obj.id === selectedObjectId;
          return `
            <div class="tree-node-item ${isSelected ? 'selected' : ''}" data-id="${obj.id}">
              <span class="tree-obj-icon" style="color: ${obj.color || '#58a6ff'};">
                ${getIcon(obj.shape === 'coin' ? 'sparkles' : (obj.behavior === 'player' ? 'pointer' : 'cube'), 'icon-xs')}
              </span>
              <span class="tree-obj-name font-medium flex-1 truncate">${escapeHTML(obj.name)}</span>
              ${obj.tag ? `<span class="badge badge-secondary text-xs">${escapeHTML(obj.tag)}</span>` : ''}
              
              <div class="tree-item-controls">
                <button class="btn-icon-xs btn-toggle-vis" data-id="${obj.id}" title="Toggle Visibility">
                  ${getIcon(obj.visible !== false ? 'eye' : 'eyeOff', 'icon-xs')}
                </button>
                <button class="btn-icon-xs btn-toggle-lock" data-id="${obj.id}" title="Toggle Lock">
                  ${getIcon(obj.locked ? 'lock' : 'unlock', 'icon-xs')}
                </button>
                <button class="btn-icon-xs btn-dupe-obj" data-id="${obj.id}" title="Duplicate">
                  ${getIcon('copy', 'icon-xs')}
                </button>
                <button class="btn-icon-xs btn-icon-danger btn-del-obj" data-id="${obj.id}" title="Delete">
                  ${getIcon('trash', 'icon-xs')}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Tab 2: Assets & Audio FX -->
    <div class="subtab-content ${activeTab === 'assets' ? 'active' : ''}" id="tab-assets">
      <div class="p-3">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-semibold text-muted uppercase">Sprite Library</span>
          <button class="btn btn-xs btn-primary" id="btn-open-sprite-painter">
            ${getIcon('paint', 'icon-xs')} Paint Sprite
          </button>
        </div>

        <div class="sprites-grid mb-4">
          ${Object.entries(spriteLibrary).map(([id, sprite]) => `
            <div class="card p-2 text-center sprite-card cursor-pointer" data-id="${id}">
              <div class="sprite-thumb-box mb-1" style="background: #0d1117; width: 40px; height: 40px; margin: 0 auto; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
                <span class="text-xs font-mono font-bold" style="color: ${sprite.primaryColor || '#58a6ff'};">${sprite.name.slice(0, 2).toUpperCase()}</span>
              </div>
              <span class="text-xs font-medium block truncate">${escapeHTML(sprite.name)}</span>
            </div>
          `).join('')}
        </div>

        <div class="flex items-center justify-between mb-3 border-t pt-3">
          <span class="text-xs font-semibold text-muted uppercase">8-Bit Sound FX Synthesizer</span>
        </div>
        <div class="sounds-list flex flex-col gap-2">
          ${['coin', 'jump', 'laser', 'explosion', 'hit', 'powerup', 'win'].map(s => `
            <div class="card p-2 flex items-center justify-between text-xs">
              <span class="font-mono capitalize font-semibold">${s}</span>
              <button class="btn btn-xs btn-secondary btn-test-sound" data-sound="${s}">
                ${getIcon('volume', 'icon-xs')} Play
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Tab 3: Global Variables -->
    <div class="subtab-content ${activeTab === 'vars' ? 'active' : ''}" id="tab-vars">
      <div class="p-3">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-semibold text-muted uppercase">Global Variables</span>
          <button class="btn btn-xs btn-primary" id="btn-add-global-var">
            ${getIcon('plus', 'icon-xs')} Add Variable
          </button>
        </div>

        <div class="variables-list flex flex-col gap-2">
          ${Object.entries(projectVariables).length === 0 ? `
            <div class="text-muted text-xs text-center p-3">No global variables defined.</div>
          ` : Object.entries(projectVariables).map(([name, val]) => `
            <div class="card p-2 flex items-center justify-between gap-2 text-xs">
              <span class="font-mono font-bold text-primary">${escapeHTML(name)}</span>
              <input type="text" class="form-control form-control-sm font-mono w-20 text-right var-val-input" data-var="${escapeHTML(name)}" value="${val}" />
              <button class="btn-icon-xs text-rose btn-del-var" data-var="${escapeHTML(name)}">&times;</button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // --- Attach Handlers ---
  // Subtab switcher
  container.querySelectorAll('.subtab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      renderSceneTreePanel(container, {
        currentScene,
        selectedObjectId,
        projectVariables,
        spriteLibrary,
        activeTab: btn.dataset.tab,
        onSelectObject,
        onAddObject,
        onDeleteObject,
        onDuplicateObject,
        onToggleVisibility,
        onToggleLock,
        onAddVariable,
        onDeleteVariable,
        onOpenSpritePainter
      });
    });
  });

  // Object Selection
  container.querySelectorAll('.tree-node-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      if (onSelectObject) onSelectObject(item.dataset.id);
    });
  });

  // Add Object
  container.querySelector('#btn-tree-add-object')?.addEventListener('click', () => {
    if (onAddObject) onAddObject();
  });

  // Toggle Visibility
  container.querySelectorAll('.btn-toggle-vis').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onToggleVisibility) onToggleVisibility(btn.dataset.id);
    });
  });

  // Toggle Lock
  container.querySelectorAll('.btn-toggle-lock').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onToggleLock) onToggleLock(btn.dataset.id);
    });
  });

  // Duplicate Object
  container.querySelectorAll('.btn-dupe-obj').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onDuplicateObject) onDuplicateObject(btn.dataset.id);
    });
  });

  // Delete Object
  container.querySelectorAll('.btn-del-obj').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onDeleteObject) onDeleteObject(btn.dataset.id);
    });
  });

  // Sound test buttons
  container.querySelectorAll('.btn-test-sound').forEach(btn => {
    btn.addEventListener('click', () => {
      audioSynth.play(btn.dataset.sound);
    });
  });

  // Open Sprite Painter
  container.querySelector('#btn-open-sprite-painter')?.addEventListener('click', () => {
    if (onOpenSpritePainter) onOpenSpritePainter();
  });

  // Add Variable
  container.querySelector('#btn-add-global-var')?.addEventListener('click', () => {
    const varName = prompt('Enter new variable name (e.g. score, coins, lives):', 'newVar');
    if (varName && varName.trim()) {
      if (onAddVariable) onAddVariable(varName.trim(), 0);
    }
  });

  // Edit Variable value
  container.querySelectorAll('.var-val-input').forEach(inp => {
    inp.addEventListener('input', () => {
      projectVariables[inp.dataset.var] = isNaN(inp.value) ? inp.value : Number(inp.value);
    });
  });

  // Delete Variable
  container.querySelectorAll('.btn-del-var').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onDeleteVariable) onDeleteVariable(btn.dataset.var);
    });
  });
}


/* --- MODULE: js/editor/inspector.js --- */
/**
 * GameSmith - Object & Scene Inspector
 * Godot/Unity-style property inspector for transforms, sprites, physics, and behaviors.
 */



function renderInspector(container, selectedObject, currentScene, spriteLibrary = {}, onPropertyChange = null) {
  if (!selectedObject) {
    renderSceneInspector(container, currentScene, onPropertyChange);
    return;
  }

  const obj = selectedObject;

  container.innerHTML = `
    <div class="inspector-header">
      <div class="flex items-center gap-2">
        <span class="badge badge-primary font-mono text-xs">OBJECT</span>
        <input type="text" id="insp-obj-name" class="form-control form-control-sm font-bold text-primary flex-1" value="${escapeHTML(obj.name)}" />
      </div>
    </div>

    <div class="inspector-scroll-body">
      
      <!-- General & Tags -->
      <div class="inspector-section">
        <div class="inspector-section-title">General</div>
        <div class="inspector-field-row">
          <label class="insp-label">Tag / Group</label>
          <input type="text" id="insp-obj-tag" class="form-control form-control-sm font-mono" placeholder="player, coin, enemy, etc." value="${escapeHTML(obj.tag || '')}" />
        </div>
        <div class="inspector-field-row">
          <label class="insp-label">Layer (Z-Order)</label>
          <input type="number" id="insp-obj-layer" class="form-control form-control-sm" value="${obj.layer || 0}" />
        </div>
      </div>

      <!-- Transform -->
      <div class="inspector-section">
        <div class="inspector-section-title">Transform</div>
        <div class="inspector-grid-2">
          <div class="inspector-field-row">
            <label class="insp-label">X</label>
            <input type="number" id="insp-obj-x" class="form-control form-control-sm" value="${Math.round(obj.x)}" />
          </div>
          <div class="inspector-field-row">
            <label class="insp-label">Y</label>
            <input type="number" id="insp-obj-y" class="form-control form-control-sm" value="${Math.round(obj.y)}" />
          </div>
        </div>
        <div class="inspector-grid-2">
          <div class="inspector-field-row">
            <label class="insp-label">Width</label>
            <input type="number" id="insp-obj-w" class="form-control form-control-sm" value="${Math.round(obj.width)}" />
          </div>
          <div class="inspector-field-row">
            <label class="insp-label">Height</label>
            <input type="number" id="insp-obj-h" class="form-control form-control-sm" value="${Math.round(obj.height)}" />
          </div>
        </div>
        <div class="inspector-field-row">
          <label class="insp-label">Rotation (&deg;)</label>
          <input type="number" id="insp-obj-rot" class="form-control form-control-sm" value="${obj.rotation || 0}" />
        </div>
      </div>

      <!-- Appearance & Sprite -->
      <div class="inspector-section">
        <div class="inspector-section-title">Appearance & Sprite</div>
        <div class="inspector-field-row">
          <label class="insp-label">Draw Mode / Shape</label>
          <select id="insp-obj-shape" class="form-control form-control-sm">
            <option value="platform" ${obj.shape === 'platform' ? 'selected' : ''}>Platform / Block</option>
            <option value="rect" ${obj.shape === 'rect' ? 'selected' : ''}>Rectangle</option>
            <option value="circle" ${obj.shape === 'circle' ? 'selected' : ''}>Circle</option>
            <option value="coin" ${obj.shape === 'coin' ? 'selected' : ''}>Coin Shimmer</option>
            <option value="spike" ${obj.shape === 'spike' ? 'selected' : ''}>Spike / Hazard</option>
            <option value="text" ${obj.shape === 'text' ? 'selected' : ''}>Text Label</option>
          </select>
        </div>
        <div class="inspector-field-row">
          <label class="insp-label">Tint Color</label>
          <div class="flex items-center gap-2">
            <input type="color" id="insp-obj-color" class="form-control form-control-sm p-0 w-8 h-7 cursor-pointer" value="${obj.color || '#58a6ff'}" />
            <input type="text" id="insp-obj-color-hex" class="form-control form-control-sm font-mono flex-1" value="${obj.color || '#58a6ff'}" />
          </div>
        </div>
        <div class="inspector-field-row">
          <label class="insp-label">Sprite Asset</label>
          <select id="insp-obj-sprite" class="form-control form-control-sm">
            <option value="">-- None (Vector Shape) --</option>
            ${Object.keys(spriteLibrary).map(k => `<option value="${k}" ${obj.spriteId === k ? 'selected' : ''}>${escapeHTML(spriteLibrary[k].name || k)}</option>`).join('')}
          </select>
        </div>
      </div>

      <!-- Physics & Colliders -->
      <div class="inspector-section">
        <div class="inspector-section-title">Physics & Colliders</div>
        <div class="inspector-field-row">
          <label class="insp-label">Physics Type</label>
          <select id="insp-obj-physics" class="form-control form-control-sm">
            <option value="static" ${obj.physicsType === 'static' ? 'selected' : ''}>Static (Immovable / Wall / Floor)</option>
            <option value="dynamic" ${obj.physicsType === 'dynamic' ? 'selected' : ''}>Dynamic (Gravity & Forces)</option>
            <option value="none" ${obj.physicsType === 'none' ? 'selected' : ''}>None (Trigger / Decorative)</option>
          </select>
        </div>
        <div class="inspector-field-row">
          <label class="checkbox-label text-xs">
            <input type="checkbox" id="insp-obj-has-col" ${obj.hasCollider !== false ? 'checked' : ''} /> Enable Collision Detection
          </label>
        </div>
        <div class="inspector-field-row">
          <label class="checkbox-label text-xs">
            <input type="checkbox" id="insp-obj-is-solid" ${obj.isSolid ? 'checked' : ''} /> Solid Obstacle (Blocks movement)
          </label>
        </div>
        <div class="inspector-field-row">
          <label class="insp-label">Collider Shape</label>
          <select id="insp-obj-col-shape" class="form-control form-control-sm">
            <option value="box" ${obj.colliderShape !== 'circle' ? 'selected' : ''}>Box (AABB)</option>
            <option value="circle" ${obj.colliderShape === 'circle' ? 'selected' : ''}>Circle</option>
          </select>
        </div>
        <div class="inspector-field-row">
          <label class="insp-label">Gravity Scale</label>
          <input type="number" step="0.1" id="insp-obj-grav" class="form-control form-control-sm" value="${obj.gravityScale !== undefined ? obj.gravityScale : 1}" />
        </div>
      </div>

      <!-- Behavior Presets -->
      <div class="inspector-section">
        <div class="inspector-section-title">Behavior Presets</div>
        <div class="inspector-field-row">
          <label class="insp-label">Preset Controller</label>
          <select id="insp-obj-behavior" class="form-control form-control-sm">
            <option value="none" ${!obj.behavior || obj.behavior === 'none' ? 'selected' : ''}>None (Custom / Static)</option>
            <option value="player" ${obj.behavior === 'player' ? 'selected' : ''}>Player: 2D Platformer</option>
            <option value="topdown" ${obj.behavior === 'topdown' ? 'selected' : ''}>Player: Top-Down 8-Way</option>
            <option value="patrol" ${obj.behavior === 'patrol' ? 'selected' : ''}>Enemy: Patrol Left/Right</option>
            <option value="bullet" ${obj.behavior === 'bullet' ? 'selected' : ''}>Projectile: Bullet / Laser</option>
          </select>
        </div>
        ${obj.behavior === 'player' ? `
          <div class="inspector-field-row">
            <label class="insp-label">Move Speed</label>
            <input type="number" id="insp-obj-speed" class="form-control form-control-sm" value="${obj.moveSpeed || 320}" />
          </div>
          <div class="inspector-field-row">
            <label class="insp-label">Jump Force</label>
            <input type="number" id="insp-obj-jump" class="form-control form-control-sm" value="${obj.jumpForce || 480}" />
          </div>
        ` : ''}
      </div>

    </div>
  `;

  // --- Attach Handlers ---
  const bind = (id, prop, parser = (v) => v) => {
    container.querySelector('#' + id)?.addEventListener('input', (e) => {
      obj[prop] = parser(e.target.value);
      if (onPropertyChange) onPropertyChange(obj);
    });
  };

  bind('insp-obj-name', 'name');
  bind('insp-obj-tag', 'tag');
  bind('insp-obj-layer', 'layer', Number);
  bind('insp-obj-x', 'x', Number);
  bind('insp-obj-y', 'y', Number);
  bind('insp-obj-w', 'width', Number);
  bind('insp-obj-h', 'height', Number);
  bind('insp-obj-rot', 'rotation', Number);
  bind('insp-obj-shape', 'shape');
  bind('insp-obj-sprite', 'spriteId');
  bind('insp-obj-physics', 'physicsType');
  bind('insp-obj-col-shape', 'colliderShape');
  bind('insp-obj-grav', 'gravityScale', Number);
  bind('insp-obj-behavior', 'behavior');
  bind('insp-obj-speed', 'moveSpeed', Number);
  bind('insp-obj-jump', 'jumpForce', Number);

  // Color pickers sync
  const colorPicker = container.querySelector('#insp-obj-color');
  const colorHex = container.querySelector('#insp-obj-color-hex');
  colorPicker?.addEventListener('input', () => {
    colorHex.value = colorPicker.value;
    obj.color = colorPicker.value;
    if (onPropertyChange) onPropertyChange(obj);
  });
  colorHex?.addEventListener('input', () => {
    colorPicker.value = colorHex.value;
    obj.color = colorHex.value;
    if (onPropertyChange) onPropertyChange(obj);
  });

  // Checkboxes
  container.querySelector('#insp-obj-has-col')?.addEventListener('change', (e) => {
    obj.hasCollider = e.target.checked;
    if (onPropertyChange) onPropertyChange(obj);
  });
  container.querySelector('#insp-obj-is-solid')?.addEventListener('change', (e) => {
    obj.isSolid = e.target.checked;
    if (onPropertyChange) onPropertyChange(obj);
  });
}

function renderSceneInspector(container, currentScene, onPropertyChange) {
  container.innerHTML = `
    <div class="inspector-header">
      <span class="badge badge-secondary font-mono text-xs">SCENE PROPERTIES</span>
    </div>
    <div class="inspector-scroll-body">
      <div class="inspector-section">
        <div class="inspector-section-title">Scene Settings</div>
        <div class="inspector-field-row">
          <label class="insp-label">Scene Name</label>
          <input type="text" id="insp-scene-name" class="form-control form-control-sm font-bold" value="${escapeHTML(currentScene.name)}" />
        </div>
        <div class="inspector-field-row">
          <label class="insp-label">Background Color</label>
          <div class="flex items-center gap-2">
            <input type="color" id="insp-scene-bg" class="form-control form-control-sm p-0 w-8 h-7 cursor-pointer" value="${currentScene.bgColor || '#0d1117'}" />
            <input type="text" id="insp-scene-bg-hex" class="form-control form-control-sm font-mono flex-1" value="${currentScene.bgColor || '#0d1117'}" />
          </div>
        </div>
        <div class="inspector-field-row">
          <label class="insp-label">World Gravity (Y)</label>
          <input type="number" id="insp-scene-gravity" class="form-control form-control-sm" value="${currentScene.gravity !== undefined ? currentScene.gravity : 980}" />
        </div>
        <div class="inspector-field-row">
          <label class="checkbox-label text-xs">
            <input type="checkbox" id="insp-scene-camera" ${currentScene.cameraFollow !== false ? 'checked' : ''} /> Camera Follow Player
          </label>
        </div>
      </div>
      <div class="p-3 text-xs text-muted">
        Click any object on canvas or scene tree to inspect object properties.
      </div>
    </div>
  `;

  container.querySelector('#insp-scene-name')?.addEventListener('input', (e) => {
    currentScene.name = e.target.value;
    if (onPropertyChange) onPropertyChange();
  });
  container.querySelector('#insp-scene-gravity')?.addEventListener('input', (e) => {
    currentScene.gravity = Number(e.target.value);
    if (onPropertyChange) onPropertyChange();
  });
  container.querySelector('#insp-scene-camera')?.addEventListener('change', (e) => {
    currentScene.cameraFollow = e.target.checked;
    if (onPropertyChange) onPropertyChange();
  });

  const bgPicker = container.querySelector('#insp-scene-bg');
  const bgHex = container.querySelector('#insp-scene-bg-hex');
  bgPicker?.addEventListener('input', () => {
    bgHex.value = bgPicker.value;
    currentScene.bgColor = bgPicker.value;
    if (onPropertyChange) onPropertyChange();
  });
  bgHex?.addEventListener('input', () => {
    bgPicker.value = bgHex.value;
    currentScene.bgColor = bgHex.value;
    if (onPropertyChange) onPropertyChange();
  });
}


/* --- MODULE: js/editor/event-sheet.js --- */
/**
 * GameSmith - Visual Event Rule Sheet Editor
 * Interactive Construct / Scratch-inspired visual block rule builder.
 */



function renderEventSheet(container, scene, projectVariables = {}, onRuleChange = null) {
  const events = scene.events || [];
  const objects = scene.objects || [];

  container.innerHTML = `
    <div class="event-sheet-header">
      <div class="flex items-center gap-2">
        <span class="text-xs font-bold uppercase text-muted">Visual Event Sheet &bull; ${scene.name} (${events.length} rules)</span>
      </div>
      <button class="btn btn-sm btn-primary" id="btn-add-event-rule">
        ${getIcon('plus', 'icon-xs')} Add Rule
      </button>
    </div>

    <div class="event-rules-list" id="event-rules-list">
      ${events.length === 0 ? `
        <div class="card p-6 text-center text-muted text-xs">
          No event rules configured for this scene. Click "+ Add Rule" to create interactive gameplay logic!
        </div>
      ` : events.map((rule, idx) => renderRuleCard(rule, idx, objects, projectVariables)).join('')}
    </div>
  `;

  // --- Attach Handlers ---
  container.querySelector('#btn-add-event-rule')?.addEventListener('click', () => {
    if (!scene.events) scene.events = [];
    scene.events.push({
      id: 'rule_' + Date.now(),
      enabled: true,
      trigger: { type: 'on_collision', objectId: 'player', targetType: 'coin' },
      actions: [
        { type: 'change_variable', variable: 'score', operation: 'add', value: 10 },
        { type: 'play_sound', sound: 'coin' },
        { type: 'destroy_object', targetId: 'context.target' }
      ]
    });
    renderEventSheet(container, scene, projectVariables, onRuleChange);
    if (onRuleChange) onRuleChange();
  });

  // Rule Delete
  container.querySelectorAll('.btn-del-rule').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      scene.events.splice(idx, 1);
      renderEventSheet(container, scene, projectVariables, onRuleChange);
      if (onRuleChange) onRuleChange();
    });
  });

  // Trigger Type Change
  container.querySelectorAll('.rule-trigger-type').forEach(select => {
    select.addEventListener('change', () => {
      const idx = parseInt(select.dataset.idx, 10);
      const newType = select.value;
      scene.events[idx].trigger = getDefaultTriggerForType(newType, objects);
      renderEventSheet(container, scene, projectVariables, onRuleChange);
      if (onRuleChange) onRuleChange();
    });
  });

  // Trigger param inputs
  container.querySelectorAll('.trigger-param').forEach(inp => {
    inp.addEventListener('input', () => {
      const idx = parseInt(inp.dataset.idx, 10);
      const paramName = inp.dataset.param;
      scene.events[idx].trigger[paramName] = inp.value;
      if (onRuleChange) onRuleChange();
    });
  });

  // Add Action to Rule
  container.querySelectorAll('.btn-add-action-to-rule').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      scene.events[idx].actions.push({ type: 'play_sound', sound: 'coin' });
      renderEventSheet(container, scene, projectVariables, onRuleChange);
      if (onRuleChange) onRuleChange();
    });
  });

  // Action Delete
  container.querySelectorAll('.btn-del-action').forEach(btn => {
    btn.addEventListener('click', () => {
      const ruleIdx = parseInt(btn.dataset.ruleIdx, 10);
      const actionIdx = parseInt(btn.dataset.actionIdx, 10);
      scene.events[ruleIdx].actions.splice(actionIdx, 1);
      renderEventSheet(container, scene, projectVariables, onRuleChange);
      if (onRuleChange) onRuleChange();
    });
  });

  // Action Type Change
  container.querySelectorAll('.rule-action-type').forEach(select => {
    select.addEventListener('change', () => {
      const ruleIdx = parseInt(select.dataset.ruleIdx, 10);
      const actionIdx = parseInt(select.dataset.actionIdx, 10);
      const newType = select.value;
      scene.events[ruleIdx].actions[actionIdx] = getDefaultActionForType(newType, projectVariables);
      renderEventSheet(container, scene, projectVariables, onRuleChange);
      if (onRuleChange) onRuleChange();
    });
  });

  // Action param inputs
  container.querySelectorAll('.action-param').forEach(inp => {
    inp.addEventListener('input', () => {
      const ruleIdx = parseInt(inp.dataset.ruleIdx, 10);
      const actionIdx = parseInt(inp.dataset.actionIdx, 10);
      const paramName = inp.dataset.param;
      scene.events[ruleIdx].actions[actionIdx][paramName] = inp.value;
      if (onRuleChange) onRuleChange();
    });
  });
}

function renderRuleCard(rule, idx, objects, projectVariables) {
  const trigger = rule.trigger || { type: 'on_start' };
  const actions = rule.actions || [];

  return `
    <div class="card event-rule-card mb-3">
      <div class="event-rule-header">
        <div class="flex items-center gap-2">
          <span class="badge badge-primary font-mono text-xs">RULE #${idx + 1}</span>
        </div>
        <div class="flex items-center gap-1">
          <button class="btn-icon-xs btn-icon-danger btn-del-rule" data-idx="${idx}" title="Delete Rule">
            ${getIcon('trash', 'icon-xs')}
          </button>
        </div>
      </div>

      <div class="event-rule-body">
        <!-- WHEN (Condition / Trigger) -->
        <div class="event-condition-row">
          <span class="event-keyword text-emerald font-bold">WHEN</span>
          <select class="form-control form-control-sm w-44 rule-trigger-type" data-idx="${idx}">
            <option value="on_collision" ${trigger.type === 'on_collision' ? 'selected' : ''}>On Collision</option>
            <option value="on_key_press" ${trigger.type === 'on_key_press' ? 'selected' : ''}>On Key Pressed</option>
            <option value="on_start" ${trigger.type === 'on_start' ? 'selected' : ''}>On Scene Start</option>
            <option value="on_update" ${trigger.type === 'on_update' ? 'selected' : ''}>On Every Frame</option>
            <option value="on_click" ${trigger.type === 'on_click' ? 'selected' : ''}>On Object Clicked</option>
            <option value="on_timer" ${trigger.type === 'on_timer' ? 'selected' : ''}>On Timer Interval</option>
            <option value="on_variable" ${trigger.type === 'on_variable' ? 'selected' : ''}>On Variable Match</option>
            <option value="on_out_of_bounds" ${trigger.type === 'on_out_of_bounds' ? 'selected' : ''}>On Leave Screen</option>
          </select>

          <!-- Trigger specific parameter inputs -->
          ${renderTriggerParams(trigger, idx, objects, projectVariables)}
        </div>

        <!-- THEN (Actions) -->
        <div class="event-actions-block">
          <span class="event-keyword text-primary font-bold">THEN</span>
          <div class="actions-list flex-1 flex flex-col gap-2">
            ${actions.map((act, actIdx) => renderActionRow(act, idx, actIdx, objects, projectVariables)).join('')}
            <div>
              <button class="btn btn-xs btn-ghost btn-add-action-to-rule" data-idx="${idx}">
                ${getIcon('plus', 'icon-xs')} Add Action
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderTriggerParams(trigger, idx, objects, projectVariables) {
  if (trigger.type === 'on_collision') {
    return `
      <span class="text-xs text-muted">Source:</span>
      <select class="form-control form-control-sm trigger-param w-32" data-idx="${idx}" data-param="objectId">
        <option value="player" ${trigger.objectId === 'player' ? 'selected' : ''}>Player</option>
        ${objects.map(o => `<option value="${o.id}" ${trigger.objectId === o.id ? 'selected' : ''}>${escapeHTML(o.name)}</option>`).join('')}
      </select>
      <span class="text-xs text-muted">hits:</span>
      <input type="text" class="form-control form-control-sm trigger-param w-28 font-mono" data-idx="${idx}" data-param="targetType" placeholder="coin/enemy/tag" value="${escapeHTML(trigger.targetType || '')}" />
    `;
  }

  if (trigger.type === 'on_key_press') {
    return `
      <select class="form-control form-control-sm trigger-param w-32" data-idx="${idx}" data-param="key">
        <option value="Space" ${trigger.key === 'Space' ? 'selected' : ''}>Space</option>
        <option value="ArrowUp" ${trigger.key === 'ArrowUp' ? 'selected' : ''}>Arrow Up / W</option>
        <option value="ArrowDown" ${trigger.key === 'ArrowDown' ? 'selected' : ''}>Arrow Down / S</option>
        <option value="KeyJ" ${trigger.key === 'KeyJ' ? 'selected' : ''}>Key J (Shoot)</option>
        <option value="KeyZ" ${trigger.key === 'KeyZ' ? 'selected' : ''}>Key Z (Action)</option>
        <option value="Enter" ${trigger.key === 'Enter' ? 'selected' : ''}>Enter</option>
      </select>
    `;
  }

  if (trigger.type === 'on_timer') {
    return `
      <span class="text-xs text-muted">Every</span>
      <input type="number" step="0.1" class="form-control form-control-sm trigger-param w-20" data-idx="${idx}" data-param="interval" value="${trigger.interval || 1.0}" />
      <span class="text-xs text-muted">sec</span>
    `;
  }

  if (trigger.type === 'on_variable') {
    const varKeys = Object.keys(projectVariables);
    return `
      <select class="form-control form-control-sm trigger-param w-28" data-idx="${idx}" data-param="variable">
        ${varKeys.map(k => `<option value="${k}" ${trigger.variable === k ? 'selected' : ''}>${k}</option>`).join('')}
      </select>
      <select class="form-control form-control-sm trigger-param w-20" data-idx="${idx}" data-param="operator">
        <option value=">=" ${trigger.operator === '>=' ? 'selected' : ''}>&gt;=</option>
        <option value="<=" ${trigger.operator === '<=' ? 'selected' : ''}>&lt;=</option>
        <option value="==" ${trigger.operator === '==' ? 'selected' : ''}>==</option>
      </select>
      <input type="text" class="form-control form-control-sm trigger-param w-20" data-idx="${idx}" data-param="value" value="${trigger.value !== undefined ? trigger.value : 0}" />
    `;
  }

  return '';
}

function renderActionRow(action, ruleIdx, actionIdx, objects, projectVariables) {
  return `
    <div class="action-item-row flex items-center gap-2">
      <select class="form-control form-control-sm w-40 rule-action-type" data-rule-idx="${ruleIdx}" data-action-idx="${actionIdx}">
        <option value="change_variable" ${action.type === 'change_variable' ? 'selected' : ''}>Change Variable</option>
        <option value="play_sound" ${action.type === 'play_sound' ? 'selected' : ''}>Play Sound</option>
        <option value="destroy_object" ${action.type === 'destroy_object' ? 'selected' : ''}>Destroy Object</option>
        <option value="spawn_object" ${action.type === 'spawn_object' ? 'selected' : ''}>Spawn Object</option>
        <option value="show_message" ${action.type === 'show_message' ? 'selected' : ''}>Show Message</option>
        <option value="restart_scene" ${action.type === 'restart_scene' ? 'selected' : ''}>Restart Scene</option>
        <option value="change_scene" ${action.type === 'change_scene' ? 'selected' : ''}>Change Scene</option>
      </select>

      ${renderActionParams(action, ruleIdx, actionIdx, objects, projectVariables)}

      <button class="btn-icon-xs text-rose btn-del-action" data-rule-idx="${ruleIdx}" data-action-idx="${actionIdx}">&times;</button>
    </div>
  `;
}

function renderActionParams(action, ruleIdx, actionIdx, objects, projectVariables) {
  if (action.type === 'change_variable') {
    const varKeys = Object.keys(projectVariables);
    return `
      <select class="form-control form-control-sm action-param w-28" data-rule-idx="${ruleIdx}" data-action-idx="${actionIdx}" data-param="variable">
        ${varKeys.map(k => `<option value="${k}" ${action.variable === k ? 'selected' : ''}>${k}</option>`).join('')}
      </select>
      <select class="form-control form-control-sm action-param w-24" data-rule-idx="${ruleIdx}" data-action-idx="${actionIdx}" data-param="operation">
        <option value="add" ${action.operation === 'add' ? 'selected' : ''}>Add (+)</option>
        <option value="subtract" ${action.operation === 'subtract' ? 'selected' : ''}>Subtract (-)</option>
        <option value="set" ${action.operation === 'set' ? 'selected' : ''}>Set (=)</option>
      </select>
      <input type="number" class="form-control form-control-sm action-param w-20" data-rule-idx="${ruleIdx}" data-action-idx="${actionIdx}" data-param="value" value="${action.value !== undefined ? action.value : 1}" />
    `;
  }

  if (action.type === 'play_sound') {
    return `
      <select class="form-control form-control-sm action-param w-32" data-rule-idx="${ruleIdx}" data-action-idx="${actionIdx}" data-param="sound">
        <option value="coin" ${action.sound === 'coin' ? 'selected' : ''}>Coin</option>
        <option value="jump" ${action.sound === 'jump' ? 'selected' : ''}>Jump</option>
        <option value="laser" ${action.sound === 'laser' ? 'selected' : ''}>Laser</option>
        <option value="explosion" ${action.sound === 'explosion' ? 'selected' : ''}>Explosion</option>
        <option value="hit" ${action.sound === 'hit' ? 'selected' : ''}>Hit / Hurt</option>
        <option value="win" ${action.sound === 'win' ? 'selected' : ''}>Victory Fanfare</option>
        <option value="powerup" ${action.sound === 'powerup' ? 'selected' : ''}>Powerup</option>
      </select>
    `;
  }

  if (action.type === 'destroy_object') {
    return `
      <select class="form-control form-control-sm action-param w-36" data-rule-idx="${ruleIdx}" data-action-idx="${actionIdx}" data-param="targetId">
        <option value="context.target" ${action.targetId === 'context.target' ? 'selected' : ''}>Collided Object</option>
        <option value="player" ${action.targetId === 'player' ? 'selected' : ''}>Player</option>
        ${objects.map(o => `<option value="${o.id}" ${action.targetId === o.id ? 'selected' : ''}>${escapeHTML(o.name)}</option>`).join('')}
      </select>
    `;
  }

  if (action.type === 'show_message') {
    return `
      <input type="text" class="form-control form-control-sm action-param flex-1" data-rule-idx="${ruleIdx}" data-action-idx="${actionIdx}" data-param="message" placeholder="Message text (e.g. Level Complete!)" value="${escapeHTML(action.message || '')}" />
    `;
  }

  return '';
}

function getDefaultTriggerForType(type, objects) {
  switch (type) {
    case 'on_collision':
      return { type: 'on_collision', objectId: 'player', targetType: 'coin' };
    case 'on_key_press':
      return { type: 'on_key_press', key: 'Space' };
    case 'on_timer':
      return { type: 'on_timer', interval: 2.0 };
    case 'on_variable':
      return { type: 'on_variable', variable: 'score', operator: '>=', value: 100 };
    case 'on_click':
      return { type: 'on_click', objectId: objects[0]?.id || 'player' };
    case 'on_out_of_bounds':
      return { type: 'on_out_of_bounds', objectId: 'player' };
    default:
      return { type };
  }
}

function getDefaultActionForType(type, projectVariables) {
  const firstVar = Object.keys(projectVariables)[0] || 'score';
  switch (type) {
    case 'change_variable':
      return { type: 'change_variable', variable: firstVar, operation: 'add', value: 10 };
    case 'play_sound':
      return { type: 'play_sound', sound: 'coin' };
    case 'destroy_object':
      return { type: 'destroy_object', targetId: 'context.target' };
    case 'spawn_object':
      return { type: 'spawn_object', objectName: 'Bullet', spawnAt: 'player', vx: 400, vy: 0 };
    case 'show_message':
      return { type: 'show_message', message: 'You Win!', duration: 3 };
    case 'change_scene':
      return { type: 'change_scene', sceneId: 'level_2' };
    case 'restart_scene':
      return { type: 'restart_scene' };
    default:
      return { type };
  }
}


/* --- MODULE: js/editor/sprite-painter.js --- */
/**
 * GameSmith - Built-In Pixel Art Sprite Painter
 * Interactive 16x16 / 32x32 pixel editor for drawing custom game sprites.
 */



const PALETTE = [
  '#000000', '#ffffff', '#58a6ff', '#3fb950', '#f85149', '#d29922',
  '#a371f7', '#f0883e', '#1f6feb', '#238636', '#da3633', '#9e6a03',
  '#8b949e', '#30363d', '#ff7b72', '#79c0ff', '#56d364', '#e3b341'
];

class SpritePainterModal {
  constructor(modalContainer, onSaveSprite) {
    this.container = modalContainer;
    this.onSaveSprite = onSaveSprite;
    this.gridSize = 16;
    this.pixels = new Array(this.gridSize * this.gridSize).fill('transparent');
    this.currentColor = '#58a6ff';
    this.currentTool = 'pencil'; // pencil, eraser, fill
    this.isDrawing = false;
  }

  open(spriteToEdit = null) {
    if (spriteToEdit && spriteToEdit.pixels) {
      this.gridSize = spriteToEdit.size || 16;
      this.pixels = [...spriteToEdit.pixels];
      this.spriteName = spriteToEdit.name || 'Custom Sprite';
      this.spriteId = spriteToEdit.id;
    } else {
      this.gridSize = 16;
      this.pixels = new Array(this.gridSize * this.gridSize).fill('transparent');
      this.spriteName = 'Sprite_' + Math.floor(Math.random() * 1000);
      this.spriteId = 'sprite_' + Date.now();
    }

    this.render();
    this.container.classList.add('active');
  }

  close() {
    this.container.classList.remove('active');
  }

  render() {
    this.container.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-dialog sprite-painter-dialog">
        <div class="modal-header">
          <div class="flex items-center gap-2">
            ${getIcon('paint', 'icon-sm')}
            <span class="font-bold text-sm">Pixel Art Sprite Painter</span>
          </div>
          <button class="btn-icon-xs btn-modal-close">&times;</button>
        </div>

        <div class="modal-body p-4 flex gap-4">
          
          <!-- Drawing Canvas -->
          <div class="painter-canvas-container flex flex-col items-center">
            <canvas id="painter-canvas" width="288" height="288" class="painter-canvas cursor-crosshair"></canvas>
            <div class="flex gap-2 mt-3 items-center">
              <span class="text-xs text-muted">Grid:</span>
              <button class="btn btn-xs ${this.gridSize === 16 ? 'btn-primary' : 'btn-secondary'} btn-set-grid" data-size="16">16x16</button>
              <button class="btn btn-xs ${this.gridSize === 32 ? 'btn-primary' : 'btn-secondary'} btn-set-grid" data-size="32">32x32</button>
              <button class="btn btn-xs btn-ghost text-rose ml-auto btn-clear-canvas">${getIcon('trash', 'icon-xs')} Clear</button>
            </div>
          </div>

          <!-- Tools & Palette -->
          <div class="painter-tools-sidebar flex-1 flex flex-col justify-between">
            <div>
              <div class="form-group mb-3">
                <label class="form-label text-xs font-semibold">Sprite Name</label>
                <input type="text" id="painter-sprite-name" class="form-control form-control-sm" value="${escapeHTML(this.spriteName)}" />
              </div>

              <div class="tool-picker-row flex gap-2 mb-3">
                <button class="btn btn-sm ${this.currentTool === 'pencil' ? 'btn-primary' : 'btn-secondary'} btn-tool-select" data-tool="pencil">
                  Pencil
                </button>
                <button class="btn btn-sm ${this.currentTool === 'eraser' ? 'btn-primary' : 'btn-secondary'} btn-tool-select" data-tool="eraser">
                  Eraser
                </button>
                <button class="btn btn-sm ${this.currentTool === 'fill' ? 'btn-primary' : 'btn-secondary'} btn-tool-select" data-tool="fill">
                  Bucket
                </button>
              </div>

              <div class="palette-swatches-grid mb-3">
                ${PALETTE.map(c => `
                  <div class="swatch-btn ${this.currentColor === c ? 'selected' : ''}" style="background-color: ${c};" data-color="${c}"></div>
                `).join('')}
              </div>

              <div class="flex items-center gap-2 mb-4">
                <label class="text-xs text-muted">Custom:</label>
                <input type="color" id="painter-color-picker" class="form-control form-control-sm p-0 w-8 h-7 cursor-pointer" value="${this.currentColor}" />
              </div>
            </div>

            <!-- Preview -->
            <div class="card p-3 flex items-center justify-between">
              <span class="text-xs font-semibold text-muted">Preview</span>
              <canvas id="painter-preview" width="48" height="48" style="background: #0d1117; border-radius: 4px; border: 1px solid var(--border-subtle);"></canvas>
            </div>
          </div>

        </div>

        <div class="modal-footer p-3 border-t flex justify-end gap-2">
          <button class="btn btn-sm btn-secondary btn-modal-close">Cancel</button>
          <button class="btn btn-sm btn-primary" id="btn-save-painter-sprite">Save to Project</button>
        </div>
      </div>
    `;

    this.canvas = this.container.querySelector('#painter-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.previewCanvas = this.container.querySelector('#painter-preview');
    this.previewCtx = this.previewCanvas.getContext('2d');

    this.initCanvasEvents();
    this.redraw();

    // Close buttons
    this.container.querySelectorAll('.btn-modal-close, .modal-backdrop').forEach(b => {
      b.addEventListener('click', () => this.close());
    });

    // Tool selects
    this.container.querySelectorAll('.btn-tool-select').forEach(b => {
      b.addEventListener('click', () => {
        this.currentTool = b.dataset.tool;
        this.container.querySelectorAll('.btn-tool-select').forEach(x => x.className = 'btn btn-sm btn-secondary btn-tool-select');
        b.className = 'btn btn-sm btn-primary btn-tool-select';
      });
    });

    // Swatches
    this.container.querySelectorAll('.swatch-btn').forEach(b => {
      b.addEventListener('click', () => {
        this.currentColor = b.dataset.color;
        this.container.querySelectorAll('.swatch-btn').forEach(x => x.classList.remove('selected'));
        b.classList.add('selected');
        this.container.querySelector('#painter-color-picker').value = this.currentColor;
      });
    });

    this.container.querySelector('#painter-color-picker')?.addEventListener('input', (e) => {
      this.currentColor = e.target.value;
    });

    // Grid size switch
    this.container.querySelectorAll('.btn-set-grid').forEach(b => {
      b.addEventListener('click', () => {
        const size = parseInt(b.dataset.size, 10);
        if (size !== this.gridSize) {
          this.gridSize = size;
          this.pixels = new Array(size * size).fill('transparent');
          this.render();
        }
      });
    });

    // Clear
    this.container.querySelector('.btn-clear-canvas')?.addEventListener('click', () => {
      this.pixels.fill('transparent');
      this.redraw();
    });

    // Save Sprite
    this.container.querySelector('#btn-save-painter-sprite')?.addEventListener('click', () => {
      const name = this.container.querySelector('#painter-sprite-name').value || 'Sprite';
      const sprite = {
        id: this.spriteId,
        name: name.trim(),
        size: this.gridSize,
        pixels: [...this.pixels],
        primaryColor: this.pixels.find(c => c !== 'transparent') || '#58a6ff'
      };
      if (this.onSaveSprite) this.onSaveSprite(sprite);
      this.close();
    });
  }

  initCanvasEvents() {
    const handleDraw = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      const x = Math.floor(((clientX - rect.left) / rect.width) * this.gridSize);
      const y = Math.floor(((clientY - rect.top) / rect.height) * this.gridSize);

      if (x >= 0 && x < this.gridSize && y >= 0 && y < this.gridSize) {
        if (this.currentTool === 'fill') {
          this.floodFill(x, y, this.currentColor);
        } else {
          const color = this.currentTool === 'eraser' ? 'transparent' : this.currentColor;
          this.pixels[y * this.gridSize + x] = color;
        }
        this.redraw();
      }
    };

    this.canvas.addEventListener('mousedown', (e) => {
      this.isDrawing = true;
      handleDraw(e);
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDrawing) handleDraw(e);
    });

    window.addEventListener('mouseup', () => {
      this.isDrawing = false;
    });
  }

  floodFill(startX, startY, targetColor) {
    const startColor = this.pixels[startY * this.gridSize + startX];
    if (startColor === targetColor) return;

    const queue = [[startX, startY]];
    const visited = new Set();

    while (queue.length > 0) {
      const [x, y] = queue.pop();
      const key = `${x},${y}`;
      if (visited.has(key)) continue;
      visited.add(key);

      if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) continue;
      if (this.pixels[y * this.gridSize + x] !== startColor) continue;

      this.pixels[y * this.gridSize + x] = targetColor;

      queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
  }

  redraw() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const pSize = w / this.gridSize;

    // Checkerboard background for transparency
    ctx.clearRect(0, 0, w, h);
    for (let r = 0; r < this.gridSize; r++) {
      for (let c = 0; c < this.gridSize; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? '#161b22' : '#21262d';
        ctx.fillRect(c * pSize, r * pSize, pSize, pSize);

        const pixelColor = this.pixels[r * this.gridSize + c];
        if (pixelColor && pixelColor !== 'transparent') {
          ctx.fillStyle = pixelColor;
          ctx.fillRect(c * pSize, r * pSize, pSize, pSize);
        }
      }
    }

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= this.gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * pSize, 0);
      ctx.lineTo(i * pSize, h);
      ctx.moveTo(0, i * pSize);
      ctx.lineTo(w, i * pSize);
      ctx.stroke();
    }

    // Redraw preview
    if (this.previewCtx) {
      const pw = this.previewCanvas.width;
      const ph = this.previewCanvas.height;
      const prevPixel = pw / this.gridSize;
      this.previewCtx.clearRect(0, 0, pw, ph);

      for (let r = 0; r < this.gridSize; r++) {
        for (let c = 0; c < this.gridSize; c++) {
          const col = this.pixels[r * this.gridSize + c];
          if (col && col !== 'transparent') {
            this.previewCtx.fillStyle = col;
            this.previewCtx.fillRect(c * prevPixel, r * prevPixel, prevPixel + 0.5, prevPixel + 0.5);
          }
        }
      }
    }
  }
}


/* --- MODULE: js/app.js --- */
/**
 * GameSmith - Main Workstation Orchestrator
 * Integrates Canvas Editor Viewport, Game Runtime, Scene Tree, Inspector, Event Sheet, and Project Storage.
 */













class GameSmithApp {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.renderer = new GameRenderer(this.canvas);
    this.runtime = new GameRuntime(this.renderer);

    // Project state
    this.project = TEMPLATES.platformer;
    this.currentScene = this.project.scenes[0];
    this.selectedObjectId = 'player';
    this.selectedObject = this.currentScene.objects.find(o => o.id === 'player') || null;

    // Viewport Editor state
    this.zoom = 1;
    this.panX = 100;
    this.panY = 60;
    this.isPanning = false;
    this.isDraggingObject = false;
    this.dragOffset = { x: 0, y: 0 };
    this.gridSnap = true;
    this.gridSize = 32;
    this.showColliders = true;

    // Modals & Panels
    this.spritePainter = new SpritePainterModal(
      document.getElementById('gamesmith-modal-container'),
      (sprite) => this.handleSaveSprite(sprite)
    );

    this.isPlaying = false;
    this.activeBottomTab = 'events'; // events, console
  }

  async init() {
    await db.init();

    // Resize canvas
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    // Load saved project if exists
    const lastProjectId = localStorage.getItem('gamesmith_last_project_id');
    if (lastProjectId) {
      const saved = await db.loadProject(lastProjectId);
      if (saved && saved.scenes && saved.scenes.length > 0) {
        this.project = saved;
        this.currentScene = this.project.scenes[0];
      }
    }

    // Setup runtime callbacks
    this.runtime.onStateChange = (state, originalScene) => {
      if (state === 'stopped' && originalScene) {
        this.currentScene = originalScene;
        this.isPlaying = false;
        this.updatePlayToolbar();
        this.renderAll();
      } else if (state === 'playing') {
        this.isPlaying = true;
        this.updatePlayToolbar();
      }
    };

    this.setupToolbar();
    this.setupCanvasInteractions();
    this.setupShortcuts();
    this.renderAll();

    // Start editor render loop
    this.editorLoop = this.editorLoop.bind(this);
    requestAnimationFrame(this.editorLoop);
  }

  handleResize() {
    const container = document.getElementById('canvas-viewport-container');
    if (container && this.canvas) {
      this.renderer.resize(container.clientWidth, container.clientHeight);
    }
  }

  editorLoop() {
    if (!this.isPlaying) {
      this.renderEditorCanvas();
    }
    requestAnimationFrame(this.editorLoop);
  }

  renderEditorCanvas() {
    const r = this.renderer;
    r.clear(this.currentScene.bgColor || '#0d1117');

    // Draw editor grid
    r.drawGrid(this.gridSize, this.zoom, this.panX, this.panY);

    const ctx = r.ctx;
    ctx.save();
    ctx.translate(this.panX, this.panY);
    ctx.scale(this.zoom, this.zoom);

    // Draw world bounds
    r.drawWorldBounds(this.currentScene.bounds || { width: 1280, height: 720 }, { zoom: this.zoom });

    // Render scene objects sorted by layer
    const sorted = [...(this.currentScene.objects || [])].sort((a, b) => (a.layer || 0) - (b.layer || 0));
    for (const obj of sorted) {
      const isSel = obj.id === this.selectedObjectId;
      r.renderObject(obj, isSel, this.showColliders, this.project.sprites || {});
    }

    ctx.restore();
  }

  renderAll() {
    this.renderSceneSelector();
    this.renderSceneTree();
    this.renderInspectorPanel();
    this.renderBottomPanel();
    this.updateStats();
  }

  // --- Toolbar Setup ---
  setupToolbar() {
    // Play / Pause / Stop Buttons
    document.getElementById('btn-play-game')?.addEventListener('click', () => this.togglePlay());
    document.getElementById('btn-pause-game')?.addEventListener('click', () => this.runtime.pausePlay());
    document.getElementById('btn-stop-game')?.addEventListener('click', () => this.runtime.stopPlay());

    // Grid snap & size
    const gridToggle = document.getElementById('btn-toggle-grid');
    gridToggle?.addEventListener('click', () => {
      this.gridSnap = !this.gridSnap;
      gridToggle.classList.toggle('active', this.gridSnap);
    });

    document.getElementById('select-grid-size')?.addEventListener('change', (e) => {
      this.gridSize = parseInt(e.target.value, 10) || 32;
    });

    // Zoom controls
    document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
      this.zoom = Math.min(3, this.zoom + 0.25);
    });
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
      this.zoom = Math.max(0.25, this.zoom - 0.25);
    });
    document.getElementById('btn-zoom-reset')?.addEventListener('click', () => {
      this.zoom = 1; this.panX = 100; this.panY = 60;
    });

    // Colliders wireframe toggle
    const colToggle = document.getElementById('btn-toggle-colliders');
    colToggle?.addEventListener('click', () => {
      this.showColliders = !this.showColliders;
      colToggle.classList.toggle('active', this.showColliders);
    });

    // Template Switcher
    document.getElementById('select-template')?.addEventListener('change', (e) => {
      const tKey = e.target.value;
      if (TEMPLATES[tKey]) {
        if (confirm(`Load template "${TEMPLATES[tKey].name}"? Unsaved edits in current project will be replaced.`)) {
          this.loadProject(JSON.parse(JSON.stringify(TEMPLATES[tKey])));
        }
      }
    });

    // Export Project JSON
    document.getElementById('btn-export-project')?.addEventListener('click', () => {
      const json = JSON.stringify(this.project, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (this.project.name || 'game').toLowerCase().replace(/\s+/g, '_') + '.gamesmith.json';
      a.click();
    });

    // Import Project JSON
    const importInput = document.getElementById('file-import-project');
    document.getElementById('btn-import-project')?.addEventListener('click', () => importInput?.click());
    importInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          if (parsed && parsed.scenes && parsed.scenes.length > 0) {
            this.loadProject(parsed);
          } else {
            alert('Invalid GameSmith project file structure.');
          }
        } catch (err) {
          alert('Failed to parse JSON project file: ' + err.message);
        }
      };
      reader.readAsText(file);
    });

    // New Scene Button
    document.getElementById('btn-new-scene')?.addEventListener('click', () => {
      const name = prompt('Enter scene name:', 'Level ' + (this.project.scenes.length + 1));
      if (name && name.trim()) {
        const newScene = {
          id: 'scene_' + Date.now(),
          name: name.trim(),
          bgColor: '#0d1117',
          gravity: 980,
          bounds: { width: 1280, height: 720 },
          objects: [
            {
              id: 'player',
              name: 'Player',
              tag: 'player',
              x: 100,
              y: 400,
              width: 32,
              height: 48,
              color: '#58a6ff',
              physicsType: 'dynamic',
              hasCollider: true,
              isSolid: false,
              behavior: 'player'
            },
            {
              id: 'floor',
              name: 'Ground',
              tag: 'solid',
              x: 0,
              y: 600,
              width: 1280,
              height: 80,
              color: '#21262d',
              physicsType: 'static',
              hasCollider: true,
              isSolid: true
            }
          ],
          events: []
        };
        this.project.scenes.push(newScene);
        this.currentScene = newScene;
        this.selectedObjectId = 'player';
        this.selectedObject = newScene.objects[0];
        this.renderAll();
        this.autoSave();
      }
    });
  }

  // --- Canvas Interactions ---
  setupCanvasInteractions() {
    const canvas = this.canvas;

    const screenToWorld = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const sx = clientX - rect.left;
      const sy = clientY - rect.top;
      const wx = (sx - this.panX) / this.zoom;
      const wy = (sy - this.panY) / this.zoom;
      return { wx, wy, sx, sy };
    };

    canvas.addEventListener('mousedown', (e) => {
      if (this.isPlaying) return;

      const { wx, wy, sx, sy } = screenToWorld(e.clientX, e.clientY);

      // Middle click or Alt+click -> Pan
      if (e.button === 1 || e.altKey || e.shiftKey) {
        this.isPanning = true;
        this.lastMouseX = sx;
        this.lastMouseY = sy;
        return;
      }

      // Check object selection (top-most layer first)
      const sorted = [...(this.currentScene.objects || [])].reverse();
      let clickedObj = null;

      for (const obj of sorted) {
        if (obj.visible === false || obj.locked) continue;
        if (wx >= obj.x && wx <= obj.x + obj.width && wy >= obj.y && wy <= obj.y + obj.height) {
          clickedObj = obj;
          break;
        }
      }

      if (clickedObj) {
        this.selectedObjectId = clickedObj.id;
        this.selectedObject = clickedObj;
        this.isDraggingObject = true;
        this.dragOffset.x = wx - clickedObj.x;
        this.dragOffset.y = wy - clickedObj.y;
      } else {
        this.selectedObjectId = null;
        this.selectedObject = null;
      }

      this.renderSceneTree();
      this.renderInspectorPanel();
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isPlaying) {
        const rect = canvas.getBoundingClientRect();
        input.updateMouse(e.clientX - rect.left, e.clientY - rect.top, input.isMouseDown);
        return;
      }

      const { wx, wy, sx, sy } = screenToWorld(e.clientX, e.clientY);

      if (this.isPanning) {
        this.panX += sx - this.lastMouseX;
        this.panY += sy - this.lastMouseY;
        this.lastMouseX = sx;
        this.lastMouseY = sy;
      } else if (this.isDraggingObject && this.selectedObject) {
        let newX = wx - this.dragOffset.x;
        let newY = wy - this.dragOffset.y;

        if (this.gridSnap) {
          newX = Math.round(newX / this.gridSize) * this.gridSize;
          newY = Math.round(newY / this.gridSize) * this.gridSize;
        }

        this.selectedObject.x = newX;
        this.selectedObject.y = newY;
        this.renderInspectorPanel();
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.isDraggingObject) {
        this.autoSave();
      }
      this.isPanning = false;
      this.isDraggingObject = false;
    });

    // Zoom wheel
    canvas.addEventListener('wheel', (e) => {
      if (this.isPlaying) return;
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      this.zoom = Math.max(0.25, Math.min(3, this.zoom * zoomFactor));
    });
  }

  setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      // Space / Enter -> Toggle Play
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        this.togglePlay();
      }

      // Escape -> Stop Play
      if (e.key === 'Escape' && this.isPlaying) {
        this.runtime.stopPlay();
      }

      // Delete / Backspace -> Delete selected object
      if ((e.key === 'Delete' || e.key === 'Backspace') && !this.isPlaying && this.selectedObjectId) {
        this.deleteSelectedObject();
      }
    });
  }

  // --- Runtime Play Controls ---
  togglePlay() {
    if (this.isPlaying) {
      this.runtime.stopPlay();
    } else {
      this.runtime.startPlay(
        this.currentScene,
        this.project.variables || {},
        this.project.sprites || {}
      );
    }
  }

  updatePlayToolbar() {
    const playBtn = document.getElementById('btn-play-game');
    const pauseBtn = document.getElementById('btn-pause-game');
    const stopBtn = document.getElementById('btn-stop-game');
    const modeBadge = document.getElementById('editor-mode-badge');

    if (this.isPlaying) {
      if (playBtn) playBtn.className = 'btn btn-sm btn-ghost';
      if (pauseBtn) pauseBtn.className = 'btn btn-sm btn-secondary';
      if (stopBtn) stopBtn.className = 'btn btn-sm btn-danger';
      if (modeBadge) {
        modeBadge.className = 'badge badge-success font-mono text-xs';
        modeBadge.textContent = 'PLAY MODE (60 FPS)';
      }
    } else {
      if (playBtn) playBtn.className = 'btn btn-sm btn-primary';
      if (pauseBtn) pauseBtn.className = 'btn btn-sm btn-ghost';
      if (stopBtn) stopBtn.className = 'btn btn-sm btn-ghost';
      if (modeBadge) {
        modeBadge.className = 'badge badge-secondary font-mono text-xs';
        modeBadge.textContent = 'EDITOR MODE';
      }
    }
  }

  switchSceneInRuntime(sceneId) {
    const nextScene = this.project.scenes.find(s => s.id === sceneId);
    if (nextScene) {
      this.currentScene = nextScene;
      this.runtime.currentScene = JSON.parse(JSON.stringify(nextScene));
      this.runtime.runtimeObjects = this.runtime.currentScene.objects || [];
      this.runtime.playerObj = this.runtime.runtimeObjects.find(o => o.behavior === 'player') || null;
      this.renderSceneSelector();
    }
  }

  // --- Scene & Object Actions ---
  renderSceneSelector() {
    const selector = document.getElementById('select-active-scene');
    if (selector) {
      selector.innerHTML = this.project.scenes.map(s => `
        <option value="${s.id}" ${s.id === this.currentScene.id ? 'selected' : ''}>${escapeHTML(s.name)}</option>
      `).join('');

      selector.onchange = (e) => {
        const sId = e.target.value;
        const found = this.project.scenes.find(s => s.id === sId);
        if (found) {
          this.currentScene = found;
          this.selectedObjectId = this.currentScene.objects[0]?.id || null;
          this.selectedObject = this.currentScene.objects[0] || null;
          this.renderAll();
        }
      };
    }
  }

  renderSceneTree() {
    const container = document.getElementById('scene-tree-container');
    if (!container) return;

    renderSceneTreePanel(container, {
      currentScene: this.currentScene,
      selectedObjectId: this.selectedObjectId,
      projectVariables: this.project.variables || {},
      spriteLibrary: this.project.sprites || {},
      onSelectObject: (id) => {
        this.selectedObjectId = id;
        this.selectedObject = this.currentScene.objects.find(o => o.id === id) || null;
        this.renderSceneTree();
        this.renderInspectorPanel();
      },
      onAddObject: () => this.addNewObject(),
      onDeleteObject: (id) => {
        this.selectedObjectId = id;
        this.deleteSelectedObject();
      },
      onDuplicateObject: (id) => this.duplicateObject(id),
      onToggleVisibility: (id) => {
        const obj = this.currentScene.objects.find(o => o.id === id);
        if (obj) {
          obj.visible = obj.visible === false ? true : false;
          this.renderSceneTree();
        }
      },
      onToggleLock: (id) => {
        const obj = this.currentScene.objects.find(o => o.id === id);
        if (obj) {
          obj.locked = !obj.locked;
          this.renderSceneTree();
        }
      },
      onAddVariable: (name, val) => {
        if (!this.project.variables) this.project.variables = {};
        this.project.variables[name] = val;
        this.renderAll();
        this.autoSave();
      },
      onDeleteVariable: (name) => {
        delete this.project.variables[name];
        this.renderAll();
        this.autoSave();
      },
      onOpenSpritePainter: () => {
        this.spritePainter.open();
      }
    });
  }

  renderInspectorPanel() {
    const container = document.getElementById('inspector-panel-container');
    if (!container) return;

    renderInspector(
      container,
      this.selectedObject,
      this.currentScene,
      this.project.sprites || {},
      () => {
        this.renderSceneTree();
        this.autoSave();
      }
    );
  }

  renderBottomPanel() {
    const container = document.getElementById('bottom-sheet-container');
    if (!container) return;

    renderEventSheet(
      container,
      this.currentScene,
      this.project.variables || {},
      () => this.autoSave()
    );
  }

  addNewObject() {
    const count = (this.currentScene.objects || []).length + 1;
    const newObj = {
      id: 'obj_' + Date.now(),
      name: 'Game Object ' + count,
      tag: 'solid',
      layer: 1,
      x: Math.round((this.renderer.canvas.width / 2 - this.panX) / this.zoom),
      y: Math.round((this.renderer.canvas.height / 2 - this.panY) / this.zoom),
      width: 48,
      height: 48,
      color: '#58a6ff',
      shape: 'rect',
      physicsType: 'static',
      hasCollider: true,
      isSolid: true
    };

    if (!this.currentScene.objects) this.currentScene.objects = [];
    this.currentScene.objects.push(newObj);
    this.selectedObjectId = newObj.id;
    this.selectedObject = newObj;
    this.renderAll();
    this.autoSave();
  }

  duplicateObject(id) {
    const target = this.currentScene.objects.find(o => o.id === id);
    if (!target) return;

    const clone = JSON.parse(JSON.stringify(target));
    clone.id = 'obj_' + Date.now();
    clone.name = target.name + ' (Copy)';
    clone.x += 32;
    clone.y += 32;

    this.currentScene.objects.push(clone);
    this.selectedObjectId = clone.id;
    this.selectedObject = clone;
    this.renderAll();
    this.autoSave();
  }

  deleteSelectedObject() {
    if (!this.selectedObjectId) return;
    const idx = this.currentScene.objects.findIndex(o => o.id === this.selectedObjectId);
    if (idx !== -1) {
      this.currentScene.objects.splice(idx, 1);
      this.selectedObjectId = null;
      this.selectedObject = null;
      this.renderAll();
      this.autoSave();
    }
  }

  handleSaveSprite(sprite) {
    if (!this.project.sprites) this.project.sprites = {};
    this.project.sprites[sprite.id] = sprite;
    db.saveCustomSprite(sprite);
    this.renderAll();
    this.autoSave();
  }

  loadProject(projectData) {
    this.project = projectData;
    this.currentScene = this.project.scenes[0];
    this.selectedObjectId = this.currentScene.objects[0]?.id || null;
    this.selectedObject = this.currentScene.objects[0] || null;
    this.renderAll();
    this.autoSave();
  }

  autoSave() {
    db.saveProject(this.project);
    this.updateStats();
  }

  updateStats() {
    const statsEl = document.getElementById('project-stats-info');
    if (statsEl) {
      const objCount = (this.currentScene.objects || []).length;
      const ruleCount = (this.currentScene.events || []).length;
      statsEl.innerHTML = `Objects: <strong>${objCount}</strong> &bull; Rules: <strong>${ruleCount}</strong> &bull; Scenes: <strong>${this.project.scenes.length}</strong>`;
    }
  }
}

// Bootstrap
function startGameSmith() {
  const app = new GameSmithApp();
  window.gameSmithApp = app;
  app.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startGameSmith);
} else {
  startGameSmith();
}


})();
