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
 * Crisp, developer-focused SVG icons for game editor tools, gizmos, and components.
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
  move: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>`,

  // Tools & Modes
  pointer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l7 18 3-7 7-3L3 3z"></path></svg>`,
  hand: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-4 0v5"></path><path d="M14 10V4a2 2 0 0 0-4 0v7"></path><path d="M10 10.5V6a2 2 0 0 0-4 0v8"></path><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.83L7 15"></path></svg>`,
  grid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
  magnet: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3M9 20h6M12 4v16"></path></svg>`,
  zoomIn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`,
  zoomOut: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`,
  paint: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0 1 10 10c0 3-2 5.5-5 5.5h-1.5a1.5 1.5 0 0 0-1.5 1.5c0 .8-.7 1.5-1.5 1.5A10.5 10.5 0 0 1 12 2z"></path><circle cx="6.5" cy="11.5" r="1.5"></circle><circle cx="9.5" cy="7.5" r="1.5"></circle><circle cx="14.5" cy="7.5" r="1.5"></circle><circle cx="17.5" cy="11.5" r="1.5"></circle></svg>`,
  image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
  code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
  lightning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
  music: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`,
  volume: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`,
  volumeX: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
  upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`,
  sparkles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>`,
  chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
  chevronUp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  help: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  keyboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="6" y1="8" x2="6" y2="8"></line><line x1="10" y1="8" x2="10" y2="8"></line><line x1="14" y1="8" x2="14" y2="8"></line><line x1="18" y1="8" x2="18" y2="8"></line><line x1="6" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="18" y2="12"></line><line x1="7" y1="16" x2="17" y2="16"></line></svg>`,
  smartphone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>`,
  maximize: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>`,
  minimize: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>`,
  globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
  share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`,
  undo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>`,
  redo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>`
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
 * Zero-dependency real-time audio sound FX generator for games and UI.
 */

class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterVolume = 0.8;
  }

  ensureContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  setVolume(vol) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  play(presetName = 'jump') {
    if (this.isMuted || this.masterVolume <= 0) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const vol = this.masterVolume;

    switch (presetName.toLowerCase()) {
      case 'jump':
        this.playJump(ctx, now, vol);
        break;
      case 'double_jump':
      case 'doublejump':
        this.playDoubleJump(ctx, now, vol);
        break;
      case 'coin':
      case 'gem':
      case 'crystal':
        this.playCoin(ctx, now, vol);
        break;
      case 'laser':
      case 'shoot':
        this.playLaser(ctx, now, vol);
        break;
      case 'explosion':
      case 'bomb':
        this.playExplosion(ctx, now, vol);
        break;
      case 'hit':
      case 'hurt':
      case 'damage':
        this.playHit(ctx, now, vol);
        break;
      case 'powerup':
      case 'upgrade':
        this.playPowerup(ctx, now, vol);
        break;
      case 'win':
      case 'victory':
      case 'level_complete':
        this.playWin(ctx, now, vol);
        break;
      case 'game_over':
      case 'gameover':
      case 'death':
        this.playGameOver(ctx, now, vol);
        break;
      case 'teleport':
      case 'portal':
        this.playTeleport(ctx, now, vol);
        break;
      case 'dash':
        this.playDash(ctx, now, vol);
        break;
      case 'bounce':
      case 'spring':
        this.playBounce(ctx, now, vol);
        break;
      case 'chest_open':
      case 'chest':
        this.playChestOpen(ctx, now, vol);
        break;
      case 'click':
      default:
        this.playClick(ctx, now, vol);
        break;
    }
  }

  playJump(ctx, now, vol) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);

    gain.gain.setValueAtTime(0.2 * vol, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  playDoubleJump(ctx, now, vol) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(840, now + 0.18);

    gain.gain.setValueAtTime(0.25 * vol, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  playCoin(ctx, now, vol) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.25 * vol, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  playLaser(ctx, now, vol) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(920, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.13);

    gain.gain.setValueAtTime(0.2 * vol, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.13);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  playExplosion(ctx, now, vol) {
    const bufferSize = Math.floor(ctx.sampleRate * 0.35);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.12));
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, now);
    filter.frequency.linearRampToValueAtTime(60, now + 0.35);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35 * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    whiteNoise.start(now);
  }

  playHit(ctx, now, vol) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

    gain.gain.setValueAtTime(0.3 * vol, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  playPowerup(ctx, now, vol) {
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5
    notes.forEach((freq, idx) => {
      const noteTime = now + idx * 0.05;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.14 * vol, noteTime);
      gain.gain.linearRampToValueAtTime(0.001, noteTime + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(noteTime);
      osc.stop(noteTime + 0.09);
    });
  }

  playWin(ctx, now, vol) {
    const melody = [523.25, 587.33, 659.25, 783.99, 1046.50]; // C5, D5, E5, G5, C6
    melody.forEach((freq, idx) => {
      const noteTime = now + idx * 0.1;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.22 * vol, noteTime);
      gain.gain.linearRampToValueAtTime(0.001, noteTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(noteTime);
      osc.stop(noteTime + 0.22);
    });
  }

  playGameOver(ctx, now, vol) {
    const notes = [392.00, 369.99, 349.23, 329.63, 293.66, 261.63]; // G4 to C4 descending
    notes.forEach((freq, idx) => {
      const noteTime = now + idx * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.18 * vol, noteTime);
      gain.gain.linearRampToValueAtTime(0.001, noteTime + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(noteTime);
      osc.stop(noteTime + 0.16);
    });
  }

  playTeleport(ctx, now, vol) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(1400, now + 0.25);

    gain.gain.setValueAtTime(0.25 * vol, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  playDash(ctx, now, vol) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.14);

    gain.gain.setValueAtTime(0.22 * vol, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  playBounce(ctx, now, vol) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(720, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(360, now + 0.18);

    gain.gain.setValueAtTime(0.28 * vol, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  playChestOpen(ctx, now, vol) {
    this.playClick(ctx, now, vol);
    setTimeout(() => {
      this.playCoin(ctx, this.ensureContext()?.currentTime || now, vol);
    }, 60);
  }

  playClick(ctx, now, vol) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(0.08 * vol, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.03);

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

    // Virtual Touch Joystick / Button state for Mobile Play
    this.virtualAxisX = 0;
    this.virtualAxisY = 0;
    this.virtualJump = false;
    this.virtualAction = false;
    this.virtualDash = false;

    this.initListeners();
  }

  initListeners() {
    if (typeof window === 'undefined') return;

    window.addEventListener('keydown', (e) => {
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

  setVirtualInput({ axisX = 0, axisY = 0, jump = false, action = false, dash = false } = {}) {
    this.virtualAxisX = axisX;
    this.virtualAxisY = axisY;
    if (jump && !this.virtualJump) {
      this.keysDown['Space'] = true;
    }
    if (action && !this.virtualAction) {
      this.keysDown['KeyJ'] = true;
    }
    this.virtualJump = jump;
    this.virtualAction = action;
    this.virtualDash = dash;
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
    let axis = this.virtualAxisX;
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) axis -= 1;
    if (this.keys['ArrowRight'] || this.keys['KeyD']) axis += 1;
    return Math.max(-1, Math.min(1, axis));
  }

  getVerticalAxis() {
    let axis = this.virtualAxisY;
    if (this.keys['ArrowUp'] || this.keys['KeyW']) axis -= 1;
    if (this.keys['ArrowDown'] || this.keys['KeyS']) axis += 1;
    return Math.max(-1, Math.min(1, axis));
  }

  isJumpPressed() {
    return this.virtualJump || this.isKeyDown('Space') || this.isKeyDown('ArrowUp') || this.isKeyDown('KeyW');
  }

  isShootPressed() {
    return this.virtualAction || this.isKeyDown('KeyJ') || this.isKeyDown('KeyZ') || this.isKeyDown('KeyX') || this.mouseClicked;
  }

  isDashPressed() {
    return this.virtualDash || this.isKeyDown('ShiftLeft') || this.isKeyDown('KeyK') || this.isKeyDown('KeyC');
  }

  reset() {
    this.keys = {};
    this.keysDown = {};
    this.keysUp = {};
    this.isMouseDown = false;
    this.mouseClicked = false;
    this.virtualAxisX = 0;
    this.virtualAxisY = 0;
    this.virtualJump = false;
    this.virtualAction = false;
    this.virtualDash = false;
  }
}

const input = new InputManager();
input;


/* --- MODULE: js/core/db.js --- */
/**
 * GameSmith - IndexedDB Persistence Engine
 * Saves game projects, scenes, custom sprites, and settings locally in the browser with full LocalStorage fallback.
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
    if (typeof indexedDB === 'undefined') return null;

    return new Promise((resolve) => {
      try {
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
      } catch (err) {
        console.warn('IndexedDB init error:', err);
        resolve(null);
      }
    });
  }

  async saveProject(project) {
    if (!project || !project.id) return false;
    project.updatedAt = new Date().toISOString();

    if (this.db) {
      try {
        return await new Promise((resolve) => {
          const tx = this.db.transaction([STORES.PROJECTS], 'readwrite');
          const store = tx.objectStore(STORES.PROJECTS);
          store.put(project);
          tx.oncomplete = () => {
            try {
              localStorage.setItem('gamesmith_last_project_id', project.id);
            } catch (e) {}
            resolve(true);
          };
          tx.onerror = () => resolve(false);
        });
      } catch (e) {
        // Fallback to localStorage
      }
    }

    // LocalStorage fallback
    try {
      localStorage.setItem('gamesmith_project_' + project.id, JSON.stringify(project));
      localStorage.setItem('gamesmith_last_project_id', project.id);
      return true;
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
      return false;
    }
  }

  async loadProject(id) {
    if (!id) return null;

    if (this.db) {
      try {
        const res = await new Promise((resolve) => {
          const tx = this.db.transaction([STORES.PROJECTS], 'readonly');
          const store = tx.objectStore(STORES.PROJECTS);
          const req = store.get(id);
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => resolve(null);
        });
        if (res) return res;
      } catch (e) {}
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
      try {
        const dbList = await new Promise((resolve) => {
          const tx = this.db.transaction([STORES.PROJECTS], 'readonly');
          const store = tx.objectStore(STORES.PROJECTS);
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve([]);
        });
        if (dbList && dbList.length > 0) return dbList;
      } catch (e) {}
    }

    const list = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('gamesmith_project_')) {
          try {
            list.push(JSON.parse(localStorage.getItem(key)));
          } catch (e) {}
        }
      }
    } catch (e) {}
    return list;
  }

  async deleteProject(id) {
    if (!id) return;
    if (this.db) {
      try {
        const tx = this.db.transaction([STORES.PROJECTS], 'readwrite');
        tx.objectStore(STORES.PROJECTS).delete(id);
      } catch (e) {}
    }
    try {
      localStorage.removeItem('gamesmith_project_' + id);
    } catch (e) {}
  }

  async saveCustomSprite(sprite) {
    if (!sprite || !sprite.id) return false;
    if (this.db) {
      try {
        return await new Promise((resolve) => {
          const tx = this.db.transaction([STORES.SPRITES], 'readwrite');
          tx.objectStore(STORES.SPRITES).put(sprite);
          tx.oncomplete = () => resolve(true);
          tx.onerror = () => resolve(false);
        });
      } catch (e) {}
    }
    return true;
  }

  async getCustomSprites() {
    if (this.db) {
      try {
        return await new Promise((resolve) => {
          const tx = this.db.transaction([STORES.SPRITES], 'readonly');
          const req = tx.objectStore(STORES.SPRITES).getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve([]);
        });
      } catch (e) {}
    }
    return [];
  }
}

const db = new GameDatabase();
db;


/* --- MODULE: js/engine/physics.js --- */
/**
 * GameSmith - 2D Physics & Collision Engine
 * Provides Euler physics integration, AABB/Circle collision resolution, one-way platforms, and bounciness.
 */

function updatePhysics(objects, gravityY = 980, dt = 1/60, worldBounds = { width: 1600, height: 800 }) {
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
    const friction = obj.friction !== undefined ? obj.friction : 0.88;
    obj.vx = (obj.vx || 0) * Math.pow(friction, dt * 60);

    // Limit max velocity
    const maxV = obj.maxSpeed || 900;
    obj.vx = Math.max(-maxV, Math.min(maxV, obj.vx));
    obj.vy = Math.max(-1400, Math.min(1400, obj.vy));

    // Update X position
    obj.x += (obj.vx || 0) * dt;

    // Update Y position
    obj.y += (obj.vy || 0) * dt;

    // World bounds floor containment (if enabled)
    if (obj.clampBounds && worldBounds) {
      if (obj.x < 0) { obj.x = 0; obj.vx = 0; }
      if (obj.x + obj.width > worldBounds.width) { obj.x = worldBounds.width - obj.width; obj.vx = 0; }
      if (obj.y + obj.height > worldBounds.height) {
        obj.y = worldBounds.height - obj.height;
        obj.vy = 0;
        obj.isGrounded = true;
      }
    }
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

  const bounciness = dynamicObj.bounciness || staticObj.bounciness || 0;

  // If hitting from top (falling onto ground)
  if (normal.y > 0) {
    if (bounciness > 0.1 && Math.abs(dynamicObj.vy) > 100) {
      dynamicObj.vy = -dynamicObj.vy * bounciness;
    } else {
      dynamicObj.vy = 0;
      dynamicObj.isGrounded = true;
    }
  } else if (normal.y < 0) {
    // Hitting ceiling
    dynamicObj.vy = Math.max(0, dynamicObj.vy);
  }

  if (normal.x !== 0) {
    if (bounciness > 0.1) {
      dynamicObj.vx = -dynamicObj.vx * bounciness;
    } else {
      dynamicObj.vx = 0;
    }
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
      if (rule.enabled === false) continue;

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
        const targetObj = trigger.objectId === 'player'
          ? (this.runtime.playerObj || objects.find(o => o.id === 'player' || o.tag === 'player'))
          : objects.find(o => o.id === trigger.objectId);

        if (!targetObj) return false;
        const world = this.runtime.currentScene?.bounds || { width: 1600, height: 800 };
        const isOut = targetObj.x < -80 || targetObj.x > world.width + 80 ||
                      targetObj.y < -80 || targetObj.y > world.height + 80;
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
          } else if (op === 'multiply') {
            variables[varName] = (Number(variables[varName]) || 0) * Number(val);
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
            const victim = objects[idx];
            this.runtime.spawnParticles(victim.x + victim.width / 2, victim.y + victim.height / 2, victim.color || '#f85149', 16);
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
            id: 'spawned_' + Math.random().toString(36).substr(2, 7),
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
            behavior: action.behavior || 'bullet',
            lifespan: Number(action.lifespan) || 3.0
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
            if (action.impulseX !== undefined) targetObj.vx = Number(action.impulseX);
          }
          break;
        }

        case 'set_position': {
          const targetObj = action.targetId === 'player'
            ? this.runtime.playerObj
            : objects.find(o => o.id === action.targetId);

          if (targetObj) {
            targetObj.x = Number(action.x) || 0;
            targetObj.y = Number(action.y) || 0;
            targetObj.vx = 0;
            targetObj.vy = 0;
          }
          break;
        }

        case 'show_message': {
          this.runtime.showHUDMessage(action.message, Number(action.duration) || 3.0);
          break;
        }

        case 'camera_shake': {
          this.runtime.triggerCameraShake(Number(action.intensity) || 8, Number(action.duration) || 0.3);
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
 * High-performance 2D renderer for both editor viewport and play mode runtime with High-DPI & Pixel Art support.
 */

class GameRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = { x: 0, y: 0, zoom: 1, shakeX: 0, shakeY: 0 };
    this.particles = [];
  }

  resize(width, height) {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
    this.viewportWidth = width;
    this.viewportHeight = height;
  }

  clear(bgColor = '#0d1117') {
    const ctx = this.ctx;
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, this.viewportWidth || this.canvas.width, this.viewportHeight || this.canvas.height);
  }

  // --- Editor Grid ---
  drawGrid(gridSize = 32, zoom = 1, panX = 0, panY = 0) {
    const ctx = this.ctx;
    const w = this.viewportWidth || this.canvas.width;
    const h = this.viewportHeight || this.canvas.height;

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
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

    // Origin crosshair axes
    ctx.strokeStyle = 'rgba(88, 166, 255, 0.35)';
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
  drawWorldBounds(bounds = { width: 1600, height: 800 }, camera = { zoom: 1 }) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 2 / (camera.zoom || 1);
    ctx.setLineDash([8, 8]);
    ctx.strokeRect(0, 0, bounds.width, bounds.height);

    // Label at top left of world
    ctx.fillStyle = 'rgba(88, 166, 255, 0.6)';
    ctx.font = "bold 11px 'JetBrains Mono', monospace";
    ctx.fillText(`World Bounds: ${bounds.width} x ${bounds.height}px`, 8, -8);

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
      ctx.globalAlpha = Math.max(0, Math.min(1, obj.opacity));
    }

    const halfW = obj.width / 2;
    const halfH = obj.height / 2;

    // 1. Draw Sprite or Procedural Geometry
    if (obj.spriteId && spriteLibrary[obj.spriteId]) {
      this.drawPixelSprite(spriteLibrary[obj.spriteId], -halfW, -halfH, obj.width, obj.height, obj.flipX);
    } else {
      this.drawDefaultShape(obj, -halfW, -halfH, obj.width, obj.height);
    }

    // 2. Collider Wireframe (in editor or debug mode)
    if (showColliders && obj.hasCollider) {
      ctx.strokeStyle = obj.isSolid ? '#3fb950' : '#d29922';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      if (obj.colliderShape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, Math.min(halfW, halfH), 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.strokeRect(-halfW, -halfH, obj.width, obj.height);
      }
    }

    // 3. Selection Bounding Box & 8 Handles (Editor Only)
    if (isSelected) {
      ctx.strokeStyle = '#58a6ff';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.strokeRect(-halfW - 2, -halfH - 2, obj.width + 4, obj.height + 4);

      // Name & Dimensions Badge
      ctx.fillStyle = '#58a6ff';
      ctx.font = "bold 10px 'Inter', sans-serif";
      const labelText = `${obj.name} (${Math.round(obj.width)}x${Math.round(obj.height)})`;
      const textWidth = ctx.measureText(labelText).width;
      ctx.fillRect(-halfW - 2, -halfH - 18, textWidth + 8, 16);
      ctx.fillStyle = '#0d1117';
      ctx.fillText(labelText, -halfW + 2, -halfH - 6);

      // Corner & Edge Resize Handles
      const hSize = 6;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0d1117';
      ctx.lineWidth = 1;

      const handles = [
        [-halfW - 2, -halfH - 2],       // NW
        [0, -halfH - 2],                // N
        [halfW + 2, -halfH - 2],        // NE
        [halfW + 2, 0],                 // E
        [halfW + 2, halfH + 2],         // SE
        [0, halfH + 2],                 // S
        [-halfW - 2, halfH + 2],        // SW
        [-halfW - 2, 0]                 // W
      ];

      for (const [hx, hy] of handles) {
        ctx.fillRect(hx - hSize / 2, hy - hSize / 2, hSize, hSize);
        ctx.strokeRect(hx - hSize / 2, hy - hSize / 2, hSize, hSize);
      }
    }

    ctx.restore();
  }

  drawDefaultShape(obj, x, y, w, h) {
    const ctx = this.ctx;
    const baseColor = obj.color || '#58a6ff';
    ctx.fillStyle = baseColor;

    switch (obj.shape || obj.drawMode) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();
        break;

      case 'spike':
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.lineTo(x + w / 2, y);
        ctx.lineTo(x + w, y + h);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#f85149';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        break;

      case 'coin':
        ctx.fillStyle = '#f1e05a';
        ctx.beginPath();
        ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#d29922';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Inner coin star/cross
        ctx.fillStyle = '#d29922';
        ctx.beginPath();
        ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 4, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'heart':
        this.drawHeart(x, y, w, h, baseColor);
        break;

      case 'portal':
        // Swirling warp portal
        ctx.fillStyle = baseColor;
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();
        break;

      case 'text':
        ctx.font = `bold ${obj.fontSize || 16}px 'JetBrains Mono', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = baseColor;
        ctx.fillText(obj.text || obj.name, x + w / 2, y + h / 2);
        break;

      case 'platform':
        // Top cap + platform body
        ctx.fillStyle = baseColor;
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(x, y, w, Math.min(6, h / 3));
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, w, h);
        break;

      case 'rect':
      default:
        const r = Math.min(6, w / 4, h / 4);
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, [r]);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
        break;
    }
  }

  drawHeart(x, y, w, h, color) {
    const ctx = this.ctx;
    ctx.fillStyle = color || '#f85149';
    ctx.beginPath();
    const topCurveHeight = h * 0.3;
    ctx.moveTo(x + w / 2, y + h * 0.2);
    ctx.bezierCurveTo(x + w / 2, y, x, y, x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y + (h + topCurveHeight) / 2, x + w / 2, y + (h + topCurveHeight) / 2, x + w / 2, y + h);
    ctx.bezierCurveTo(x + w / 2, y + (h + topCurveHeight) / 2, x + w, y + (h + topCurveHeight) / 2, x + w, y + topCurveHeight);
    ctx.bezierCurveTo(x + w, y, x + w / 2, y, x + w / 2, y + h * 0.2);
    ctx.closePath();
    ctx.fill();
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
          ctx.fillRect(Math.floor(x + col * pixelW), Math.floor(y + row * pixelH), Math.ceil(pixelW), Math.ceil(pixelH));
        }
      }
    }
    ctx.restore();
  }

  // --- Particle System ---
  spawnParticles(x, y, color = '#f85149', count = 16) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 220;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.4 + Math.random() * 0.4,
        maxLife: 0.8,
        color,
        size: 3 + Math.random() * 4
      });
    }
  }

  updateAndDrawParticles(dt = 1/60) {
    const ctx = this.ctx;
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 200 * dt; // slight gravity
      p.life -= dt;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // --- Play Mode HUD Overlay ---
  drawHUD(variables = {}, message = '', bounds = { width: 1600, height: 800 }, isPaused = false, fps = 60) {
    const ctx = this.ctx;
    const w = this.viewportWidth || this.canvas.width;
    const h = this.viewportHeight || this.canvas.height;

    ctx.save();

    // Top Modern HUD Bar
    const hudW = Math.min(360, w - 32);
    ctx.fillStyle = 'rgba(22, 27, 34, 0.9)';
    ctx.strokeStyle = '#30363d';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(16, 16, hudW, 40, [6]);
    ctx.fill();
    ctx.stroke();

    ctx.font = "bold 12px 'JetBrains Mono', monospace";
    ctx.fillStyle = '#f0f6fc';

    let varItems = [];
    if (variables.score !== undefined) varItems.push(`SCORE: ${variables.score}`);
    if (variables.lives !== undefined) varItems.push(`LIVES: ${variables.lives}`);
    if (variables.coins !== undefined) varItems.push(`COINS: ${variables.coins}`);
    if (variables.keys !== undefined) varItems.push(`KEYS: ${variables.keys}`);

    if (varItems.length === 0) {
      varItems = Object.entries(variables).slice(0, 3).map(([k, v]) => `${k.toUpperCase()}: ${v}`);
    }

    ctx.fillText(varItems.join('  •  ') || 'GAME RUNNING', 28, 41);

    // FPS Counter (top right)
    ctx.fillStyle = 'rgba(22, 27, 34, 0.75)';
    ctx.beginPath();
    ctx.roundRect(w - 90, 16, 74, 28, [4]);
    ctx.fill();
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.fillStyle = fps < 45 ? '#f85149' : '#3fb950';
    ctx.fillText(`${fps} FPS`, w - 76, 34);

    // Center Message Banner (Level Complete / Game Over / Alert)
    if (message) {
      const msgWidth = Math.min(520, w - 40);
      const msgX = (w - msgWidth) / 2;
      const msgY = h / 3;

      ctx.fillStyle = 'rgba(13, 17, 23, 0.95)';
      ctx.strokeStyle = '#58a6ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(msgX, msgY, msgWidth, 80, [8]);
      ctx.fill();
      ctx.stroke();

      ctx.font = "bold 18px 'Inter', sans-serif";
      ctx.fillStyle = '#f0f6fc';
      ctx.textAlign = 'center';
      ctx.fillText(message, msgX + msgWidth / 2, msgY + 38);

      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.fillStyle = '#8b949e';
      ctx.fillText('Press [R] to Restart Scene  •  [ESC] to Return to Editor', msgX + msgWidth / 2, msgY + 62);
    } else if (isPaused) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, w, h);

      ctx.font = "bold 24px 'Inter', sans-serif";
      ctx.fillStyle = '#f0f6fc';
      ctx.textAlign = 'center';
      ctx.fillText('GAME PAUSED', w / 2, h / 2);
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

    // Camera shake
    this.shakeIntensity = 0;
    this.shakeDuration = 0;

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
    this.shakeIntensity = 0;
    this.shakeDuration = 0;
    this.renderer.particles = [];

    // Find primary player object
    this.playerObj = this.runtimeObjects.find(o => o.behavior === 'player' || o.behavior === 'topdown' || o.tag === 'player') || null;

    // Reset camera position to player or center
    if (this.playerObj) {
      const vw = this.renderer.viewportWidth || this.renderer.canvas.width;
      const vh = this.renderer.viewportHeight || this.renderer.canvas.height;
      this.renderer.camera.x = this.playerObj.x + this.playerObj.width / 2 - vw / 2;
      this.renderer.camera.y = this.playerObj.y + this.playerObj.height / 2 - vh / 2;
    } else {
      this.renderer.camera.x = 0;
      this.renderer.camera.y = 0;
    }

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

  triggerCameraShake(intensity = 8, duration = 0.3) {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
  }

  loop(currentTime) {
    if (!this.isPlaying) return;

    const dt = Math.min(0.08, (currentTime - this.lastTime) / 1000);
    this.lastTime = currentTime;

    // Calculate FPS
    this.frameCount++;
    this.fpsTimer += dt;
    if (this.fpsTimer >= 0.5) {
      this.fps = Math.round((this.frameCount / this.fpsTimer));
      this.frameCount = 0;
      this.fpsTimer = 0;
    }

    // Quick restart scene hotkey (R)
    if (input.isKeyDown('KeyR')) {
      this.restartScene();
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
    // 1. Update Object Behaviors (Player, Enemy Patrol, Chaser, Sine Floaters)
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

    // 5. Update Camera & Shake
    const vw = this.renderer.viewportWidth || this.renderer.canvas.width;
    const vh = this.renderer.viewportHeight || this.renderer.canvas.height;

    if (this.playerObj && this.currentScene.cameraFollow !== false) {
      const targetX = this.playerObj.x + this.playerObj.width / 2 - vw / 2;
      const targetY = this.playerObj.y + this.playerObj.height / 2 - vh / 2;
      this.renderer.camera.x += (targetX - this.renderer.camera.x) * 0.12;
      this.renderer.camera.y += (targetY - this.renderer.camera.y) * 0.12;

      // Clamp camera within world bounds if bounds are larger than viewport
      const bounds = this.currentScene.bounds || { width: 1600, height: 800 };
      if (bounds.width > vw) {
        this.renderer.camera.x = Math.max(0, Math.min(bounds.width - vw, this.renderer.camera.x));
      }
      if (bounds.height > vh) {
        this.renderer.camera.y = Math.max(0, Math.min(bounds.height - vh, this.renderer.camera.y));
      }
    }

    // Screen Shake
    if (this.shakeDuration > 0) {
      this.shakeDuration -= dt;
      this.renderer.camera.shakeX = (Math.random() * 2 - 1) * this.shakeIntensity;
      this.renderer.camera.shakeY = (Math.random() * 2 - 1) * this.shakeIntensity;
    } else {
      this.renderer.camera.shakeX = 0;
      this.renderer.camera.shakeY = 0;
    }
  }

  updateBehaviors(dt) {
    for (let i = this.runtimeObjects.length - 1; i >= 0; i--) {
      const obj = this.runtimeObjects[i];
      if (obj.visible === false) continue;

      // 1. Platformer Player Controller
      if (obj.behavior === 'player') {
        const hAxis = input.getHorizontalAxis();
        const moveSpeed = obj.moveSpeed || 320;
        obj.vx = hAxis * moveSpeed;

        if (hAxis !== 0) {
          obj.flipX = hAxis < 0;
        }

        // Jump & Double Jump
        if (input.isJumpPressed()) {
          if (obj.isGrounded || obj.physicsType !== 'dynamic') {
            obj.vy = -(obj.jumpForce || 500);
            obj.isGrounded = false;
            obj.canDoubleJump = true;
            audioSynth.play('jump');
          } else if (obj.canDoubleJump && obj.allowDoubleJump !== false) {
            obj.vy = -(obj.jumpForce ? obj.jumpForce * 0.9 : 450);
            obj.canDoubleJump = false;
            audioSynth.play('double_jump');
            this.spawnParticles(obj.x + obj.width / 2, obj.y + obj.height, '#ffffff', 8);
          }
        }
      }

      // 2. Top-Down Player Controller
      else if (obj.behavior === 'topdown') {
        const hAxis = input.getHorizontalAxis();
        const vAxis = input.getVerticalAxis();
        const moveSpeed = obj.moveSpeed || 260;

        // Normalize diagonal speed
        const length = Math.hypot(hAxis, vAxis);
        if (length > 0) {
          obj.vx = (hAxis / length) * moveSpeed;
          obj.vy = (vAxis / length) * moveSpeed;
        } else {
          obj.vx = 0;
          obj.vy = 0;
        }

        if (hAxis !== 0) obj.flipX = hAxis < 0;
      }

      // 3. Enemy Patrol AI
      else if (obj.behavior === 'patrol') {
        const patrolSpeed = obj.patrolSpeed || 90;
        if (obj.patrolDir === undefined) obj.patrolDir = 1;

        obj.vx = obj.patrolDir * patrolSpeed;
        obj.flipX = obj.patrolDir < 0;

        obj.patrolDist = (obj.patrolDist || 0) + Math.abs(obj.vx * dt);
        if (obj.patrolDist > (obj.maxPatrolDist || 160)) {
          obj.patrolDir *= -1;
          obj.patrolDist = 0;
        }
      }

      // 4. Chaser AI
      else if (obj.behavior === 'chaser' && this.playerObj) {
        const dx = (this.playerObj.x + this.playerObj.width / 2) - (obj.x + obj.width / 2);
        const dy = (this.playerObj.y + this.playerObj.height / 2) - (obj.y + obj.height / 2);
        const dist = Math.hypot(dx, dy);

        if (dist < (obj.detectRange || 300) && dist > 5) {
          const speed = obj.chaseSpeed || 120;
          obj.vx = (dx / dist) * speed;
          if (obj.physicsType !== 'dynamic') {
            obj.vy = (dy / dist) * speed;
          }
          obj.flipX = dx < 0;
        } else {
          obj.vx = 0;
        }
      }

      // 5. Sine Wave Floating (Coins, powerups, floating islands)
      else if (obj.behavior === 'sine_hover') {
        obj.sineTimer = (obj.sineTimer || 0) + dt * (obj.sineSpeed || 3);
        if (obj.baseY === undefined) obj.baseY = obj.y;
        obj.y = obj.baseY + Math.sin(obj.sineTimer) * (obj.sineAmp || 8);
      }

      // 6. Bullet / Projectile
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

    // Apply Camera Transform & Screen Shake
    const camX = Math.round(r.camera.x + r.camera.shakeX);
    const camY = Math.round(r.camera.y + r.camera.shakeY);
    ctx.translate(-camX, -camY);

    // Draw World Bounds
    r.drawWorldBounds(this.currentScene.bounds || { width: 1600, height: 800 }, r.camera);

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
    r.drawHUD(this.runtimeVariables, this.hudMessage, this.currentScene.bounds, this.isPaused, this.fps);
  }

  spawnParticles(x, y, color = '#f85149', count = 16) {
    this.renderer.spawnParticles(x, y, color, count);
  }

  showHUDMessage(msg, duration = 3.0) {
    this.hudMessage = msg;
    this.hudMessageTimer = duration;
  }

  restartScene() {
    if (!this.savedEditorScene) return;
    this.startPlay(this.savedEditorScene, this.runtimeVariables, this.spriteLibrary);
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
 * Production-quality starter templates with handcrafted pixel art sprites, balanced levels, physics, and gameplay logic.
 */

// Helper to generate 16x16 pixel matrix from visual ASCII art
function createPixelSprite(asciiArt, colorMap) {
  const lines = asciiArt.trim().split('\n').map(l => l.trim());
  const pixels = [];
  for (let r = 0; r < 16; r++) {
    const rowStr = lines[r] || '................';
    for (let c = 0; c < 16; c++) {
      const char = rowStr[c] || '.';
      pixels.push(colorMap[char] || 'transparent');
    }
  }
  return pixels;
}

// 1. Knight Sprite (CyberRunner)
const KNIGHT_ASCII = `
....bbbbbb......
...b111111b.....
..b12222221b....
..b12333321b....
..b11111111b....
...b444444b.....
..b45555554b....
..b55111155b....
..b55111155b....
..b55555555b....
...b444444b.....
...b66..66b.....
...b66..66b.....
...b77..77b.....
...bb....bb.....
................
`;
const KNIGHT_PIXELS = createPixelSprite(KNIGHT_ASCII, {
  'b': '#161b22',
  '1': '#58a6ff',
  '2': '#79c0ff',
  '3': '#ffffff',
  '4': '#30363d',
  '5': '#21262d',
  '6': '#1f6feb',
  '7': '#0d1117'
});

// 2. Cyber Drone Sprite (Patrol Enemy)
const DRONE_ASCII = `
................
....bbbbbb......
...b111111b.....
..b11222211b....
..b12333321b....
..b12344321b....
..b12333321b....
..b11222211b....
...b111111b.....
....bbbbbb......
...b55..55b.....
..b55....55b....
..bb......bb....
................
................
................
`;
const DRONE_PIXELS = createPixelSprite(DRONE_ASCII, {
  'b': '#161b22',
  '1': '#f85149',
  '2': '#ff7b72',
  '3': '#ffffff',
  '4': '#da3633',
  '5': '#d29922'
});

// 3. Crystal Gem Sprite
const GEM_ASCII = `
......bb........
.....b11b.......
....b1221b......
...b123321b.....
..b12333321b....
.b1233333321b...
.b1122332211b...
..b11122111b....
...b111111b.....
....b1111b......
.....b11b.......
......bb........
................
................
................
................
`;
const GEM_PIXELS = createPixelSprite(GEM_ASCII, {
  'b': '#1f6feb',
  '1': '#58a6ff',
  '2': '#79c0ff',
  '3': '#ffffff'
});

// 4. Star Fighter Ship
const SHIP_ASCII = `
.......bb.......
......b11b......
......b11b......
.....b2112b.....
.....b2332b.....
....b223322b....
....b123321b....
...b11222211b...
...b11111111b...
..b4115555114b..
..b4155555514b..
.b4455bbbb5544b.
.bb.b66..66b.bb.
....b7....7b....
................
................
`;
const SHIP_PIXELS = createPixelSprite(SHIP_ASCII, {
  'b': '#161b22',
  '1': '#3fb950',
  '2': '#56d364',
  '3': '#ffffff',
  '4': '#238636',
  '5': '#30363d',
  '6': '#f0883e',
  '7': '#f85149'
});

// 5. Asteroid Rock
const ASTEROID_ASCII = `
.....bbbbbb.....
...bb111111bb...
..b1112211111b..
.b112222221111b.
.b122333222111b.
b11233333222111b
b11223332222111b
b11122222111111b
b11111111221111b
b11122112222111b
.b112222222111b.
.b111222221111b.
..b1111111111b..
...bb111111bb...
.....bbbbbb.....
................
`;
const ASTEROID_PIXELS = createPixelSprite(ASTEROID_ASCII, {
  'b': '#21262d',
  '1': '#8b949e',
  '2': '#6e7681',
  '3': '#484f58'
});

// 6. Dungeon Hero
const HERO_ASCII = `
......bbbb......
.....b1111b.....
....b122221b....
....b133331b....
....b144441b....
.....b5555b.....
....b666666b....
...b66777766b...
..b8667777668b..
..b8667777668b..
...b66666666b...
....b55..55b....
....b99..99b....
....b99..99b....
....bb....bb....
................
`;
const HERO_PIXELS = createPixelSprite(HERO_ASCII, {
  'b': '#161b22',
  '1': '#d29922',
  '2': '#e3b341',
  '3': '#f0883e',
  '4': '#f6a782',
  '5': '#8b949e',
  '6': '#a371f7',
  '7': '#bc8cff',
  '8': '#58a6ff',
  '9': '#30363d'
});

// 7. Gold Key
const KEY_ASCII = `
.....bbbb.......
....b1111b......
...b122221b.....
...b12..21b.....
...b122221b.....
....b1111b......
.....b11b.......
.....b11b.......
.....b112b......
.....b11b.......
.....b112b......
.....b11b.......
.....bbbb.......
................
................
................
`;
const KEY_PIXELS = createPixelSprite(KEY_ASCII, {
  'b': '#9e6a03',
  '1': '#d29922',
  '2': '#f1e05a'
});

// 8. Treasure Chest
const CHEST_ASCII = `
...bbbbbbbbbb...
..b1111111111b..
.b122222222221b.
.b123333333321b.
.b111144441111b.
.b555544445555b.
.b566666666665b.
.b566677776665b.
.b566677776665b.
.b566666666665b.
.b555555555555b.
..bbbbbbbbbbbb..
................
................
................
................
`;
const CHEST_PIXELS = createPixelSprite(CHEST_ASCII, {
  'b': '#161b22',
  '1': '#8c501e',
  '2': '#a05a2c',
  '3': '#b86b35',
  '4': '#d29922',
  '5': '#30363d',
  '6': '#5c3818',
  '7': '#e3b341'
});

const TEMPLATES = {
  // 1. Neon Knight (2D Platformer)
  platformer: {
    id: 'proj_neon_knight',
    name: 'CyberRunner: Neon Velocity',
    author: 'Aetheria Studios',
    description: 'High-speed cybernetic platformer featuring precision jumping, wall bouncing, patrolling security drones, and energy crystal extraction.',
    variables: { score: 0, lives: 3, crystals: 0 },
    sprites: {
      sprite_knight: { id: 'sprite_knight', name: 'Neon Knight', size: 16, primaryColor: '#58a6ff', pixels: KNIGHT_PIXELS },
      sprite_drone: { id: 'sprite_drone', name: 'Security Drone', size: 16, primaryColor: '#f85149', pixels: DRONE_PIXELS },
      sprite_gem: { id: 'sprite_gem', name: 'Energy Crystal', size: 16, primaryColor: '#58a6ff', pixels: GEM_PIXELS }
    },
    scenes: [
      {
        id: 'scene_level1',
        name: 'Sector 01: Neon Spire',
        bgColor: '#090d16',
        gravity: 980,
        cameraFollow: true,
        bounds: { width: 1800, height: 800 },
        objects: [
          // Player
          {
            id: 'player',
            name: 'Neon Knight',
            tag: 'player',
            layer: 10,
            x: 100,
            y: 540,
            width: 34,
            height: 48,
            color: '#58a6ff',
            spriteId: 'sprite_knight',
            physicsType: 'dynamic',
            hasCollider: true,
            isSolid: false,
            colliderShape: 'box',
            gravityScale: 1,
            behavior: 'player',
            moveSpeed: 340,
            jumpForce: 520,
            allowDoubleJump: true
          },
          // Main Ground
          {
            id: 'ground_1',
            name: 'Main Platform',
            tag: 'solid',
            layer: 1,
            x: 0,
            y: 680,
            width: 1800,
            height: 120,
            color: '#161b22',
            shape: 'platform',
            physicsType: 'static',
            hasCollider: true,
            isSolid: true
          },
          // Elevated Platforms
          { id: 'p1', name: 'Ascent Ledge 1', tag: 'solid', layer: 1, x: 260, y: 540, width: 160, height: 22, color: '#21262d', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },
          { id: 'p2', name: 'Ascent Ledge 2', tag: 'solid', layer: 1, x: 500, y: 420, width: 180, height: 22, color: '#21262d', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },
          { id: 'p3', name: 'Overpass Bridge', tag: 'solid', layer: 1, x: 780, y: 310, width: 220, height: 22, color: '#21262d', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },
          { id: 'p4', name: 'High Vantage', tag: 'solid', layer: 1, x: 1100, y: 220, width: 180, height: 22, color: '#21262d', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },
          { id: 'p5', name: 'Drop Zone', tag: 'solid', layer: 1, x: 1360, y: 480, width: 200, height: 22, color: '#21262d', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },

          // Energy Crystals
          { id: 'gem_1', name: 'Energy Crystal A', tag: 'crystal', layer: 5, x: 320, y: 480, width: 24, height: 24, spriteId: 'sprite_gem', physicsType: 'static', hasCollider: true, isSolid: false, behavior: 'sine_hover' },
          { id: 'gem_2', name: 'Energy Crystal B', tag: 'crystal', layer: 5, x: 580, y: 360, width: 24, height: 24, spriteId: 'sprite_gem', physicsType: 'static', hasCollider: true, isSolid: false, behavior: 'sine_hover' },
          { id: 'gem_3', name: 'Energy Crystal C', tag: 'crystal', layer: 5, x: 880, y: 250, width: 24, height: 24, spriteId: 'sprite_gem', physicsType: 'static', hasCollider: true, isSolid: false, behavior: 'sine_hover' },
          { id: 'gem_4', name: 'Energy Crystal D', tag: 'crystal', layer: 5, x: 1180, y: 160, width: 24, height: 24, spriteId: 'sprite_gem', physicsType: 'static', hasCollider: true, isSolid: false, behavior: 'sine_hover' },

          // Patrol Drone
          {
            id: 'drone_guard',
            name: 'Security Drone Alpha',
            tag: 'enemy',
            layer: 5,
            x: 820,
            y: 265,
            width: 32,
            height: 32,
            spriteId: 'sprite_drone',
            physicsType: 'static',
            hasCollider: true,
            isSolid: false,
            colliderShape: 'circle',
            behavior: 'patrol',
            patrolSpeed: 95,
            maxPatrolDist: 150
          },

          // Spikes Hazard
          { id: 'spikes_1', name: 'Hazard Spikes', tag: 'hazard', layer: 2, x: 440, y: 656, width: 140, height: 24, color: '#f85149', shape: 'spike', physicsType: 'static', hasCollider: true, isSolid: false },

          // Extraction Portal
          {
            id: 'portal_exit',
            name: 'Warp Extraction Gate',
            tag: 'portal',
            layer: 2,
            x: 1600,
            y: 560,
            width: 50,
            height: 120,
            color: '#3fb950',
            shape: 'portal',
            physicsType: 'static',
            hasCollider: true,
            isSolid: false
          }
        ],
        events: [
          // Gem Collection
          {
            id: 'rule_gem',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'player', targetType: 'crystal' },
            actions: [
              { type: 'change_variable', variable: 'score', operation: 'add', value: 250 },
              { type: 'change_variable', variable: 'crystals', operation: 'add', value: 1 },
              { type: 'play_sound', sound: 'coin' },
              { type: 'destroy_object', targetId: 'context.target' }
            ]
          },
          // Enemy Drone Hit
          {
            id: 'rule_drone',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'player', targetType: 'enemy' },
            actions: [
              { type: 'change_variable', variable: 'lives', operation: 'subtract', value: 1 },
              { type: 'camera_shake', intensity: 10, duration: 0.35 },
              { type: 'play_sound', sound: 'hit' },
              { type: 'show_message', message: 'Shield Compromised! -1 Life', duration: 2 },
              { type: 'set_position', targetId: 'player', x: 100, y: 540 }
            ]
          },
          // Spike Hazard Hit
          {
            id: 'rule_spike',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'player', targetType: 'hazard' },
            actions: [
              { type: 'change_variable', variable: 'lives', operation: 'subtract', value: 1 },
              { type: 'camera_shake', intensity: 8, duration: 0.3 },
              { type: 'play_sound', sound: 'hit' },
              { type: 'set_position', targetId: 'player', x: 100, y: 540 }
            ]
          },
          // Extraction Victory
          {
            id: 'rule_win',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'player', targetType: 'portal' },
            actions: [
              { type: 'play_sound', sound: 'win' },
              { type: 'show_message', message: 'Mission Accomplished! Sector Cleared!', duration: 5 }
            ]
          },
          // Out of Bounds Fall Respawn
          {
            id: 'rule_respawn',
            enabled: true,
            trigger: { type: 'on_out_of_bounds', objectId: 'player' },
            actions: [
              { type: 'change_variable', variable: 'lives', operation: 'subtract', value: 1 },
              { type: 'set_position', targetId: 'player', x: 100, y: 540 },
              { type: 'play_sound', sound: 'hit' }
            ]
          }
        ]
      }
    ]
  },

  // 2. Void Striker (Arcade Space Shooter)
  shooter: {
    id: 'proj_space_defender',
    name: 'Void Striker: Nova Defense',
    author: 'Starlight Interactive',
    description: 'Adrenaline-fueled arcade shooter with responsive starfighter combat, blaster mechanics, asteroid fields, and high-score chain multipliers.',
    variables: { score: 0, multiplier: 1, lasers: 200 },
    sprites: {
      sprite_ship: { id: 'sprite_ship', name: 'Star Fighter', size: 16, primaryColor: '#3fb950', pixels: SHIP_PIXELS },
      sprite_asteroid: { id: 'sprite_asteroid', name: 'Asteroid', size: 16, primaryColor: '#8b949e', pixels: ASTEROID_PIXELS }
    },
    scenes: [
      {
        id: 'scene_space_orbit',
        name: 'Deep Space: Nebula Belt',
        bgColor: '#030712',
        gravity: 0,
        cameraFollow: false,
        bounds: { width: 1200, height: 720 },
        objects: [
          // Spaceship
          {
            id: 'player_ship',
            name: 'Void Striker Ship',
            tag: 'player',
            layer: 10,
            x: 575,
            y: 560,
            width: 48,
            height: 48,
            spriteId: 'sprite_ship',
            physicsType: 'dynamic',
            hasCollider: true,
            isSolid: false,
            gravityScale: 0,
            behavior: 'topdown',
            moveSpeed: 320,
            clampBounds: true
          },
          // Asteroids
          { id: 'ast_1', name: 'Asteroid Alpha', tag: 'asteroid', layer: 5, x: 220, y: 140, width: 56, height: 56, spriteId: 'sprite_asteroid', physicsType: 'static', hasCollider: true, isSolid: false, colliderShape: 'circle', behavior: 'patrol', patrolSpeed: 70, maxPatrolDist: 240 },
          { id: 'ast_2', name: 'Asteroid Beta', tag: 'asteroid', layer: 5, x: 620, y: 180, width: 64, height: 64, spriteId: 'sprite_asteroid', physicsType: 'static', hasCollider: true, isSolid: false, colliderShape: 'circle', behavior: 'patrol', patrolSpeed: 85, maxPatrolDist: 280 },
          { id: 'ast_3', name: 'Asteroid Gamma', tag: 'asteroid', layer: 5, x: 920, y: 120, width: 52, height: 52, spriteId: 'sprite_asteroid', physicsType: 'static', hasCollider: true, isSolid: false, colliderShape: 'circle', behavior: 'patrol', patrolSpeed: 60, maxPatrolDist: 200 }
        ],
        events: [
          // Fire Laser (Space or J)
          {
            id: 'rule_shoot_laser',
            enabled: true,
            trigger: { type: 'on_key_press', key: 'Space' },
            actions: [
              { type: 'spawn_object', objectName: 'Laser Beam', tag: 'laser', spawnAt: 'player', width: 6, height: 20, color: '#3fb950', vx: 0, vy: -700, behavior: 'bullet', lifespan: 1.5 },
              { type: 'play_sound', sound: 'laser' }
            ]
          },
          // Laser Hits Asteroid
          {
            id: 'rule_destroy_asteroid',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'ast_1', targetType: 'laser' },
            actions: [
              { type: 'change_variable', variable: 'score', operation: 'add', value: 500 },
              { type: 'camera_shake', intensity: 6, duration: 0.25 },
              { type: 'play_sound', sound: 'explosion' },
              { type: 'destroy_object', targetId: 'context.target' }
            ]
          },
          // Laser Hits Asteroid Beta
          {
            id: 'rule_destroy_asteroid_2',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'ast_2', targetType: 'laser' },
            actions: [
              { type: 'change_variable', variable: 'score', operation: 'add', value: 500 },
              { type: 'camera_shake', intensity: 6, duration: 0.25 },
              { type: 'play_sound', sound: 'explosion' },
              { type: 'destroy_object', targetId: 'context.target' }
            ]
          },
          // Laser Hits Asteroid Gamma
          {
            id: 'rule_destroy_asteroid_3',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'ast_3', targetType: 'laser' },
            actions: [
              { type: 'change_variable', variable: 'score', operation: 'add', value: 500 },
              { type: 'camera_shake', intensity: 6, duration: 0.25 },
              { type: 'play_sound', sound: 'explosion' },
              { type: 'destroy_object', targetId: 'context.target' }
            ]
          }
        ]
      }
    ]
  },

  // 3. Dungeon Relic (Top-Down RPG Adventure)
  adventure: {
    id: 'proj_dungeon_quest',
    name: 'Shadow Crypt: Dungeon Relic',
    author: 'Mythic Forge Games',
    description: 'Atmospheric top-down dungeon crawler with locked stone gates, hidden keys, chaser guardians, and legendary treasure loot.',
    variables: { score: 0, keys: 0, health: 100 },
    sprites: {
      sprite_hero: { id: 'sprite_hero', name: 'Dungeon Hero', size: 16, primaryColor: '#a371f7', pixels: HERO_PIXELS },
      sprite_key: { id: 'sprite_key', name: 'Golden Key', size: 16, primaryColor: '#d29922', pixels: KEY_PIXELS },
      sprite_chest: { id: 'sprite_chest', name: 'Treasure Chest', size: 16, primaryColor: '#b86b35', pixels: CHEST_PIXELS },
      sprite_drone: { id: 'sprite_slime', name: 'Crypt Slime', size: 16, primaryColor: '#f85149', pixels: DRONE_PIXELS }
    },
    scenes: [
      {
        id: 'scene_crypt_entrance',
        name: 'Chamber I: Ancient Hall',
        bgColor: '#111827',
        gravity: 0,
        cameraFollow: true,
        bounds: { width: 1400, height: 900 },
        objects: [
          // Hero
          {
            id: 'hero',
            name: 'Sir Galahad',
            tag: 'player',
            layer: 10,
            x: 180,
            y: 440,
            width: 36,
            height: 40,
            spriteId: 'sprite_hero',
            physicsType: 'dynamic',
            hasCollider: true,
            isSolid: false,
            gravityScale: 0,
            behavior: 'topdown',
            moveSpeed: 250
          },
          // Dungeon Walls
          { id: 'w_north', name: 'North Crypt Wall', tag: 'solid', layer: 1, x: 40, y: 40, width: 1320, height: 32, color: '#374151', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },
          { id: 'w_south', name: 'South Crypt Wall', tag: 'solid', layer: 1, x: 40, y: 820, width: 1320, height: 32, color: '#374151', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },
          { id: 'w_west', name: 'West Crypt Wall', tag: 'solid', layer: 1, x: 40, y: 40, width: 32, height: 812, color: '#374151', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },
          { id: 'w_east', name: 'East Crypt Wall', tag: 'solid', layer: 1, x: 1328, y: 40, width: 32, height: 812, color: '#374151', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },

          // Interior Pillars / Partitions
          { id: 'pillar_1', name: 'Obelisk Left', tag: 'solid', layer: 1, x: 440, y: 160, width: 48, height: 260, color: '#1f2937', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },
          { id: 'pillar_2', name: 'Obelisk Right', tag: 'solid', layer: 1, x: 440, y: 520, width: 48, height: 260, color: '#1f2937', shape: 'platform', physicsType: 'static', hasCollider: true, isSolid: true },

          // Key Pickup
          { id: 'key_relic', name: 'Golden Relic Key', tag: 'key', layer: 4, x: 260, y: 180, width: 28, height: 28, spriteId: 'sprite_key', physicsType: 'static', hasCollider: true, isSolid: false, behavior: 'sine_hover' },

          // Crypt Guardian
          { id: 'guardian', name: 'Crypt Guardian', tag: 'enemy', layer: 5, x: 800, y: 440, width: 36, height: 36, spriteId: 'sprite_drone', physicsType: 'dynamic', hasCollider: true, isSolid: false, colliderShape: 'circle', behavior: 'chaser', chaseSpeed: 110, detectRange: 320 },

          // Treasure Chest
          { id: 'chest_gold', name: 'King\'s Treasure Chest', tag: 'chest', layer: 3, x: 1100, y: 430, width: 48, height: 44, spriteId: 'sprite_chest', physicsType: 'static', hasCollider: true, isSolid: true }
        ],
        events: [
          // Key Pickup Rule
          {
            id: 'rule_key',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'hero', targetType: 'key' },
            actions: [
              { type: 'change_variable', variable: 'keys', operation: 'add', value: 1 },
              { type: 'play_sound', sound: 'powerup' },
              { type: 'show_message', message: 'Found the Golden Crypt Key!', duration: 2.5 },
              { type: 'destroy_object', targetId: 'context.target' }
            ]
          },
          // Chest Open Rule
          {
            id: 'rule_chest',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'hero', targetType: 'chest' },
            actions: [
              { type: 'change_variable', variable: 'score', operation: 'add', value: 2000 },
              { type: 'play_sound', sound: 'win' },
              { type: 'show_message', message: 'Treasure Unlocked! Quest Complete!', duration: 5 }
            ]
          },
          // Guardian Hit Rule
          {
            id: 'rule_guardian_hit',
            enabled: true,
            trigger: { type: 'on_collision', objectId: 'hero', targetType: 'enemy' },
            actions: [
              { type: 'change_variable', variable: 'health', operation: 'subtract', value: 25 },
              { type: 'camera_shake', intensity: 8, duration: 0.3 },
              { type: 'play_sound', sound: 'hit' },
              { type: 'set_position', targetId: 'hero', x: 180, y: 440 }
            ]
          }
        ]
      }
    ]
  }
};


/* --- MODULE: js/editor/scene-tree.js --- */
/**
 * GameSmith - Scene Hierarchy & Asset Manager Panel
 * Professional game editor hierarchy tree, sprite asset library, sound FX board, and global variables manager.
 */




function renderSceneTreePanel(container, {
  currentScene,
  selectedObjectId,
  projectVariables = {},
  spriteLibrary = {},
  activeTab = 'tree',
  searchQuery = '',
  onSelectObject = null,
  onAddObject = null,
  onDeleteObject = null,
  onDuplicateObject = null,
  onToggleVisibility = null,
  onToggleLock = null,
  onReorderObject = null,
  onAddVariable = null,
  onDeleteVariable = null,
  onOpenSpritePainter = null,
  onDeleteSprite = null
}) {
  const objects = currentScene.objects || [];
  const filteredObjects = searchQuery
    ? objects.filter(o => o.name.toLowerCase().includes(searchQuery.toLowerCase()) || (o.tag && o.tag.toLowerCase().includes(searchQuery.toLowerCase())))
    : objects;

  container.innerHTML = `
    <!-- Top Sub-Tabs -->
    <div class="panel-subtabs" role="tablist" aria-label="Hierarchy Subtabs">
      <button class="subtab-btn ${activeTab === 'tree' ? 'active' : ''}" data-tab="tree" role="tab" aria-selected="${activeTab === 'tree'}">
        ${getIcon('cube', 'icon-xs')} Hierarchy
      </button>
      <button class="subtab-btn ${activeTab === 'assets' ? 'active' : ''}" data-tab="assets" role="tab" aria-selected="${activeTab === 'assets'}">
        ${getIcon('image', 'icon-xs')} Assets
      </button>
      <button class="subtab-btn ${activeTab === 'vars' ? 'active' : ''}" data-tab="vars" role="tab" aria-selected="${activeTab === 'vars'}">
        ${getIcon('code', 'icon-xs')} Variables
      </button>
    </div>

    <!-- Tab 1: Hierarchy Tree -->
    <div class="subtab-content ${activeTab === 'tree' ? 'active' : ''}" id="tab-hierarchy" role="tabpanel">
      
      <!-- Actions Bar -->
      <div class="hierarchy-actions-bar">
        <div class="flex items-center gap-1">
          <span class="text-xs font-semibold text-muted uppercase">Objects (${objects.length})</span>
        </div>

        <div class="flex items-center gap-1">
          <select id="select-add-preset" class="form-control form-control-sm w-28" title="Add Object Preset">
            <option value="">+ Add Object...</option>
            <option value="platform">+ Platform Block</option>
            <option value="player">+ Player</option>
            <option value="enemy">+ Patrol Enemy</option>
            <option value="coin">+ Collectible Coin</option>
            <option value="spike">+ Spike Hazard</option>
            <option value="portal">+ Exit Portal</option>
            <option value="circle">+ Circle Object</option>
            <option value="text">+ Text Label</option>
          </select>
        </div>
      </div>

      <!-- Search Input -->
      <div class="p-2 border-b">
        <div class="flex items-center gap-1 bg-elevated rounded px-2 py-1">
          ${getIcon('search', 'icon-xs text-muted')}
          <input type="text" id="input-hierarchy-search" class="form-control form-control-sm p-0 border-0 bg-transparent flex-1" placeholder="Filter objects..." value="${escapeHTML(searchQuery)}" />
          ${searchQuery ? `<button class="btn-icon-xs text-muted" id="btn-clear-search">&times;</button>` : ''}
        </div>
      </div>

      <!-- Object Hierarchy List -->
      <div class="scene-tree-list">
        ${filteredObjects.length === 0 ? `
          <div class="p-4 text-center text-muted text-xs">
            ${searchQuery ? 'No matching objects found.' : 'Scene is empty. Select "+ Add Object" to insert game elements.'}
          </div>
        ` : filteredObjects.map((obj, index) => {
          const isSelected = obj.id === selectedObjectId;
          let iconName = 'cube';
          if (obj.shape === 'coin') iconName = 'sparkles';
          else if (obj.behavior === 'player' || obj.tag === 'player') iconName = 'pointer';
          else if (obj.shape === 'spike') iconName = 'lightning';
          else if (obj.shape === 'heart') iconName = 'heart';

          return `
            <div class="tree-node-item ${isSelected ? 'selected' : ''}" data-id="${obj.id}" title="${escapeHTML(obj.name)} (Layer: ${obj.layer || 0})">
              <span class="tree-obj-icon" style="color: ${obj.color || '#58a6ff'};">
                ${getIcon(iconName, 'icon-xs')}
              </span>
              <span class="tree-obj-name font-medium flex-1 truncate">${escapeHTML(obj.name)}</span>
              ${obj.tag ? `<span class="badge badge-secondary text-xs">${escapeHTML(obj.tag)}</span>` : ''}
              
              <div class="tree-item-controls">
                <button class="btn-icon-xs btn-move-up" data-id="${obj.id}" title="Move Layer Up">${getIcon('chevronUp', 'icon-xs')}</button>
                <button class="btn-icon-xs btn-move-down" data-id="${obj.id}" title="Move Layer Down">${getIcon('chevronDown', 'icon-xs')}</button>
                <button class="btn-icon-xs btn-toggle-vis" data-id="${obj.id}" title="${obj.visible !== false ? 'Hide Object' : 'Show Object'}">
                  ${getIcon(obj.visible !== false ? 'eye' : 'eyeOff', 'icon-xs')}
                </button>
                <button class="btn-icon-xs btn-toggle-lock" data-id="${obj.id}" title="${obj.locked ? 'Unlock Object' : 'Lock Object'}">
                  ${getIcon(obj.locked ? 'lock' : 'unlock', 'icon-xs')}
                </button>
                <button class="btn-icon-xs btn-dupe-obj" data-id="${obj.id}" title="Duplicate (Ctrl+D)">
                  ${getIcon('copy', 'icon-xs')}
                </button>
                <button class="btn-icon-xs btn-icon-danger btn-del-obj" data-id="${obj.id}" title="Delete Object">
                  ${getIcon('trash', 'icon-xs')}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Tab 2: Assets & Sound FX -->
    <div class="subtab-content ${activeTab === 'assets' ? 'active' : ''}" id="tab-assets" role="tabpanel">
      <div class="p-3">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-semibold text-muted uppercase">Sprite Library (${Object.keys(spriteLibrary).length})</span>
          <button class="btn btn-xs btn-primary" id="btn-open-sprite-painter">
            ${getIcon('paint', 'icon-xs')} New Sprite
          </button>
        </div>

        <div class="sprites-grid mb-4">
          ${Object.entries(spriteLibrary).length === 0 ? `
            <div class="col-span-3 text-muted text-xs text-center p-3 card">No custom sprites. Click "New Sprite" to draw pixel art!</div>
          ` : Object.entries(spriteLibrary).map(([id, sprite]) => `
            <div class="card p-2 text-center sprite-card cursor-pointer" data-id="${id}" title="Edit ${escapeHTML(sprite.name)}">
              <div class="sprite-thumb-box mb-1" style="background: #0d1117; width: 44px; height: 44px; margin: 0 auto; border-radius: 4px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-subtle);">
                <span class="text-xs font-mono font-bold" style="color: ${sprite.primaryColor || '#58a6ff'};">${escapeHTML(sprite.name.slice(0, 2).toUpperCase())}</span>
              </div>
              <span class="text-xs font-medium block truncate">${escapeHTML(sprite.name)}</span>
              <div class="flex items-center justify-center gap-1 mt-1">
                <span class="badge badge-secondary text-xs">${sprite.size || 16}px</span>
                <button class="btn-icon-xs text-rose btn-delete-sprite" data-id="${id}" title="Delete Sprite">&times;</button>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- 8-Bit Audio Synthesizer -->
        <div class="border-t pt-3">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold text-muted uppercase">8-Bit Sound FX Board</span>
            <button class="btn btn-xs btn-ghost btn-toggle-mute" title="Mute Audio">
              ${getIcon(audioSynth.isMuted ? 'volumeX' : 'volume', 'icon-xs')}
            </button>
          </div>

          <div class="sounds-list grid grid-cols-2 gap-2">
            ${[
              { id: 'jump', label: 'Jump', color: 'text-primary' },
              { id: 'double_jump', label: 'Double Jump', color: 'text-primary' },
              { id: 'coin', label: 'Crystal Coin', color: 'text-amber' },
              { id: 'laser', label: 'Laser Blast', color: 'text-emerald' },
              { id: 'explosion', label: 'Explosion', color: 'text-rose' },
              { id: 'hit', label: 'Hurt / Hit', color: 'text-rose' },
              { id: 'powerup', label: 'Powerup', color: 'text-emerald' },
              { id: 'win', label: 'Fanfare', color: 'text-amber' },
              { id: 'game_over', label: 'Game Over', color: 'text-rose' },
              { id: 'teleport', label: 'Teleport', color: 'text-primary' },
              { id: 'dash', label: 'Dash Burst', color: 'text-secondary' },
              { id: 'bounce', label: 'Spring Bounce', color: 'text-emerald' }
            ].map(s => `
              <button class="card p-2 flex items-center justify-between text-xs btn-test-sound cursor-pointer" data-sound="${s.id}">
                <span class="font-mono font-medium ${s.color}">${s.label}</span>
                <span class="text-muted">${getIcon('play', 'icon-xs')}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 3: Global Variables -->
    <div class="subtab-content ${activeTab === 'vars' ? 'active' : ''}" id="tab-vars" role="tabpanel">
      <div class="p-3">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-semibold text-muted uppercase">Global Variables (${Object.keys(projectVariables).length})</span>
          <button class="btn btn-xs btn-primary" id="btn-add-global-var">
            ${getIcon('plus', 'icon-xs')} Add Variable
          </button>
        </div>

        <div class="variables-list flex flex-col gap-2">
          ${Object.entries(projectVariables).length === 0 ? `
            <div class="text-muted text-xs text-center p-4 card">No global variables. Variables are used for score, lives, inventory, and rule conditions.</div>
          ` : Object.entries(projectVariables).map(([name, val]) => `
            <div class="card p-2 flex items-center justify-between gap-2 text-xs">
              <div class="flex flex-col flex-1 truncate">
                <span class="font-mono font-bold text-primary truncate">${escapeHTML(name)}</span>
                <span class="text-muted" style="font-size: 10px;">${typeof val}</span>
              </div>
              <input type="text" class="form-control form-control-sm font-mono w-24 text-right var-val-input" data-var="${escapeHTML(name)}" value="${val}" />
              <button class="btn-icon-xs text-rose btn-del-var" data-var="${escapeHTML(name)}" title="Delete Variable">&times;</button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // --- Attach Handlers ---
  const reRender = (newTab = activeTab, newSearch = searchQuery) => {
    renderSceneTreePanel(container, {
      currentScene,
      selectedObjectId,
      projectVariables,
      spriteLibrary,
      activeTab: newTab,
      searchQuery: newSearch,
      onSelectObject,
      onAddObject,
      onDeleteObject,
      onDuplicateObject,
      onToggleVisibility,
      onToggleLock,
      onReorderObject,
      onAddVariable,
      onDeleteVariable,
      onOpenSpritePainter,
      onDeleteSprite
    });
  };

  // Subtab switcher
  container.querySelectorAll('.subtab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      reRender(btn.dataset.tab, searchQuery);
    });
  });

  // Search input
  const searchInput = container.querySelector('#input-hierarchy-search');
  searchInput?.addEventListener('input', (e) => {
    reRender(activeTab, e.target.value);
  });
  container.querySelector('#btn-clear-search')?.addEventListener('click', () => {
    reRender(activeTab, '');
  });

  // Object Selection
  container.querySelectorAll('.tree-node-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      if (onSelectObject) onSelectObject(item.dataset.id);
    });
  });

  // Add Preset Object
  container.querySelector('#select-add-preset')?.addEventListener('change', (e) => {
    const preset = e.target.value;
    if (preset && onAddObject) {
      onAddObject(preset);
      e.target.value = '';
    }
  });

  // Move Layer Up / Down
  container.querySelectorAll('.btn-move-up').forEach(btn => {
    btn.addEventListener('click', () => {
      const obj = objects.find(o => o.id === btn.dataset.id);
      if (obj) {
        obj.layer = (obj.layer || 0) + 1;
        if (onReorderObject) onReorderObject();
      }
    });
  });
  container.querySelectorAll('.btn-move-down').forEach(btn => {
    btn.addEventListener('click', () => {
      const obj = objects.find(o => o.id === btn.dataset.id);
      if (obj) {
        obj.layer = Math.max(0, (obj.layer || 0) - 1);
        if (onReorderObject) onReorderObject();
      }
    });
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

  // Toggle audio mute
  container.querySelector('.btn-toggle-mute')?.addEventListener('click', () => {
    audioSynth.toggleMute();
    reRender('assets', searchQuery);
  });

  // Open Sprite Painter for New Sprite
  container.querySelector('#btn-open-sprite-painter')?.addEventListener('click', () => {
    if (onOpenSpritePainter) onOpenSpritePainter(null);
  });

  // Edit Existing Sprite
  container.querySelectorAll('.sprite-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-delete-sprite')) return;
      const spriteId = card.dataset.id;
      if (spriteLibrary[spriteId] && onOpenSpritePainter) {
        onOpenSpritePainter(spriteLibrary[spriteId]);
      }
    });
  });

  // Delete Sprite
  container.querySelectorAll('.btn-delete-sprite').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const sId = btn.dataset.id;
      if (confirm(`Delete sprite "${spriteLibrary[sId]?.name || sId}"?`)) {
        if (onDeleteSprite) onDeleteSprite(sId);
      }
    });
  });

  // Add Variable
  container.querySelector('#btn-add-global-var')?.addEventListener('click', () => {
    const varName = prompt('Enter new variable identifier (e.g. score, coins, lives, keys):', 'newVar');
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
 * Godot/Unity-style property inspector for transforms, shapes, sprites, physics, and behavior controllers.
 */



function renderInspector(container, selectedObject, currentScene, spriteLibrary = {}, onPropertyChange = null, onDeleteObject = null) {
  if (!selectedObject) {
    renderSceneInspector(container, currentScene, onPropertyChange);
    return;
  }

  const obj = selectedObject;

  container.innerHTML = `
    <div class="inspector-header">
      <div class="flex items-center gap-2 flex-1">
        <span class="badge badge-primary font-mono text-xs">OBJECT</span>
        <input type="text" id="insp-obj-name" class="form-control form-control-sm font-bold text-primary flex-1" value="${escapeHTML(obj.name)}" title="Object Name" />
      </div>
      <button class="btn-icon-xs btn-icon-danger btn-insp-del" title="Delete Object">
        ${getIcon('trash', 'icon-xs')}
      </button>
    </div>

    <div class="inspector-scroll-body">
      
      <!-- 1. General & Organization -->
      <div class="inspector-section">
        <div class="inspector-section-title">General</div>
        <div class="inspector-field-row">
          <label class="insp-label" for="insp-obj-tag">Tag / Group</label>
          <input type="text" id="insp-obj-tag" class="form-control form-control-sm font-mono" placeholder="player, enemy, coin, solid..." value="${escapeHTML(obj.tag || '')}" />
        </div>
        <div class="inspector-field-row">
          <label class="insp-label" for="insp-obj-layer">Layer (Z-Order)</label>
          <input type="number" id="insp-obj-layer" class="form-control form-control-sm" value="${obj.layer || 0}" />
        </div>
      </div>

      <!-- 2. Transform & Geometry -->
      <div class="inspector-section">
        <div class="inspector-section-title">Transform</div>
        <div class="inspector-grid-2">
          <div class="inspector-field-row">
            <label class="insp-label" for="insp-obj-x">X</label>
            <input type="number" id="insp-obj-x" class="form-control form-control-sm" value="${Math.round(obj.x)}" />
          </div>
          <div class="inspector-field-row">
            <label class="insp-label" for="insp-obj-y">Y</label>
            <input type="number" id="insp-obj-y" class="form-control form-control-sm" value="${Math.round(obj.y)}" />
          </div>
        </div>
        <div class="inspector-grid-2">
          <div class="inspector-field-row">
            <label class="insp-label" for="insp-obj-w">Width</label>
            <input type="number" id="insp-obj-w" class="form-control form-control-sm" value="${Math.round(obj.width)}" />
          </div>
          <div class="inspector-field-row">
            <label class="insp-label" for="insp-obj-h">Height</label>
            <input type="number" id="insp-obj-h" class="form-control form-control-sm" value="${Math.round(obj.height)}" />
          </div>
        </div>
        <div class="inspector-field-row">
          <label class="insp-label" for="insp-obj-rot">Rotation (&deg;)</label>
          <input type="number" id="insp-obj-rot" class="form-control form-control-sm" value="${obj.rotation || 0}" />
        </div>
      </div>

      <!-- 3. Appearance & Pixel Sprite -->
      <div class="inspector-section">
        <div class="inspector-section-title">Appearance & Sprite</div>
        <div class="inspector-field-row">
          <label class="insp-label" for="insp-obj-shape">Shape / Mode</label>
          <select id="insp-obj-shape" class="form-control form-control-sm">
            <option value="platform" ${obj.shape === 'platform' ? 'selected' : ''}>Platform Tile</option>
            <option value="rect" ${obj.shape === 'rect' ? 'selected' : ''}>Beveled Rectangle</option>
            <option value="circle" ${obj.shape === 'circle' ? 'selected' : ''}>Circle / Sphere</option>
            <option value="coin" ${obj.shape === 'coin' ? 'selected' : ''}>Coin Shimmer</option>
            <option value="spike" ${obj.shape === 'spike' ? 'selected' : ''}>Spike / Hazard</option>
            <option value="heart" ${obj.shape === 'heart' ? 'selected' : ''}>Heart Pickup</option>
            <option value="portal" ${obj.shape === 'portal' ? 'selected' : ''}>Warp Portal</option>
            <option value="text" ${obj.shape === 'text' ? 'selected' : ''}>Text Label</option>
          </select>
        </div>
        <div class="inspector-field-row">
          <label class="insp-label" for="insp-obj-color">Tint Color</label>
          <div class="flex items-center gap-2">
            <input type="color" id="insp-obj-color" class="form-control form-control-sm p-0 w-8 h-7 cursor-pointer" value="${obj.color || '#58a6ff'}" />
            <input type="text" id="insp-obj-color-hex" class="form-control form-control-sm font-mono flex-1" value="${obj.color || '#58a6ff'}" />
          </div>
        </div>
        <div class="inspector-field-row">
          <label class="insp-label" for="insp-obj-sprite">Sprite Asset</label>
          <select id="insp-obj-sprite" class="form-control form-control-sm">
            <option value="">-- None (Vector Shape) --</option>
            ${Object.keys(spriteLibrary).map(k => `<option value="${k}" ${obj.spriteId === k ? 'selected' : ''}>${escapeHTML(spriteLibrary[k].name || k)}</option>`).join('')}
          </select>
        </div>
        <div class="inspector-field-row">
          <label class="insp-label" for="insp-obj-opacity">Opacity</label>
          <input type="range" min="0.1" max="1" step="0.05" id="insp-obj-opacity" class="form-control form-control-sm p-0" value="${obj.opacity !== undefined ? obj.opacity : 1}" />
        </div>
      </div>

      <!-- 4. Physics & Colliders -->
      <div class="inspector-section">
        <div class="inspector-section-title">Physics & Collisions</div>
        <div class="inspector-field-row">
          <label class="insp-label" for="insp-obj-physics">Physics Body</label>
          <select id="insp-obj-physics" class="form-control form-control-sm">
            <option value="static" ${obj.physicsType === 'static' ? 'selected' : ''}>Static (Immovable Obstacle)</option>
            <option value="dynamic" ${obj.physicsType === 'dynamic' ? 'selected' : ''}>Dynamic (Simulated Physics)</option>
            <option value="none" ${obj.physicsType === 'none' ? 'selected' : ''}>None (Trigger / Decorative)</option>
          </select>
        </div>
        <div class="inspector-field-row">
          <label class="checkbox-label text-xs">
            <input type="checkbox" id="insp-obj-has-col" ${obj.hasCollider !== false ? 'checked' : ''} /> Enable Collision Bounds
          </label>
        </div>
        <div class="inspector-field-row">
          <label class="checkbox-label text-xs">
            <input type="checkbox" id="insp-obj-is-solid" ${obj.isSolid ? 'checked' : ''} /> Solid Body (Blocks other objects)
          </label>
        </div>
        <div class="inspector-field-row">
          <label class="insp-label" for="insp-obj-col-shape">Collider Geometry</label>
          <select id="insp-obj-col-shape" class="form-control form-control-sm">
            <option value="box" ${obj.colliderShape !== 'circle' ? 'selected' : ''}>Axis Box (AABB)</option>
            <option value="circle" ${obj.colliderShape === 'circle' ? 'selected' : ''}>Circle Radial</option>
          </select>
        </div>
        <div class="inspector-grid-2">
          <div class="inspector-field-row">
            <label class="insp-label" for="insp-obj-grav">Gravity Scale</label>
            <input type="number" step="0.1" id="insp-obj-grav" class="form-control form-control-sm" value="${obj.gravityScale !== undefined ? obj.gravityScale : 1}" />
          </div>
          <div class="inspector-field-row">
            <label class="insp-label" for="insp-obj-bounce">Bounciness</label>
            <input type="number" min="0" max="1" step="0.1" id="insp-obj-bounce" class="form-control form-control-sm" value="${obj.bounciness || 0}" />
          </div>
        </div>
      </div>

      <!-- 5. Behavior Controller Presets -->
      <div class="inspector-section">
        <div class="inspector-section-title">Behavior Presets</div>
        <div class="inspector-field-row">
          <label class="insp-label" for="insp-obj-behavior">Controller</label>
          <select id="insp-obj-behavior" class="form-control form-control-sm">
            <option value="none" ${!obj.behavior || obj.behavior === 'none' ? 'selected' : ''}>None (Custom Logic)</option>
            <option value="player" ${obj.behavior === 'player' ? 'selected' : ''}>Player: 2D Platformer</option>
            <option value="topdown" ${obj.behavior === 'topdown' ? 'selected' : ''}>Player: Top-Down 8-Way</option>
            <option value="patrol" ${obj.behavior === 'patrol' ? 'selected' : ''}>Enemy: Patrol Left/Right</option>
            <option value="chaser" ${obj.behavior === 'chaser' ? 'selected' : ''}>Enemy: Chaser AI</option>
            <option value="sine_hover" ${obj.behavior === 'sine_hover' ? 'selected' : ''}>Floating: Sine Wave</option>
            <option value="bullet" ${obj.behavior === 'bullet' ? 'selected' : ''}>Projectile: Bullet / Laser</option>
          </select>
        </div>

        ${obj.behavior === 'player' ? `
          <div class="inspector-field-row">
            <label class="insp-label" for="insp-obj-speed">Move Speed</label>
            <input type="number" id="insp-obj-speed" class="form-control form-control-sm" value="${obj.moveSpeed || 320}" />
          </div>
          <div class="inspector-field-row">
            <label class="insp-label" for="insp-obj-jump">Jump Force</label>
            <input type="number" id="insp-obj-jump" class="form-control form-control-sm" value="${obj.jumpForce || 500}" />
          </div>
          <div class="inspector-field-row">
            <label class="checkbox-label text-xs">
              <input type="checkbox" id="insp-obj-doublejump" ${obj.allowDoubleJump !== false ? 'checked' : ''} /> Enable Double Jump
            </label>
          </div>
        ` : ''}

        ${obj.behavior === 'topdown' ? `
          <div class="inspector-field-row">
            <label class="insp-label" for="insp-obj-speed">Move Speed</label>
            <input type="number" id="insp-obj-speed" class="form-control form-control-sm" value="${obj.moveSpeed || 260}" />
          </div>
        ` : ''}

        ${obj.behavior === 'patrol' ? `
          <div class="inspector-field-row">
            <label class="insp-label" for="insp-obj-patrol-speed">Patrol Speed</label>
            <input type="number" id="insp-obj-patrol-speed" class="form-control form-control-sm" value="${obj.patrolSpeed || 90}" />
          </div>
          <div class="inspector-field-row">
            <label class="insp-label" for="insp-obj-patrol-dist">Max Distance</label>
            <input type="number" id="insp-obj-patrol-dist" class="form-control form-control-sm" value="${obj.maxPatrolDist || 160}" />
          </div>
        ` : ''}

        ${obj.behavior === 'chaser' ? `
          <div class="inspector-field-row">
            <label class="insp-label" for="insp-obj-chase-speed">Chase Speed</label>
            <input type="number" id="insp-obj-chase-speed" class="form-control form-control-sm" value="${obj.chaseSpeed || 110}" />
          </div>
          <div class="inspector-field-row">
            <label class="insp-label" for="insp-obj-detect-range">Detect Range</label>
            <input type="number" id="insp-obj-detect-range" class="form-control form-control-sm" value="${obj.detectRange || 300}" />
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
  bind('insp-obj-opacity', 'opacity', Number);
  bind('insp-obj-physics', 'physicsType');
  bind('insp-obj-col-shape', 'colliderShape');
  bind('insp-obj-grav', 'gravityScale', Number);
  bind('insp-obj-bounce', 'bounciness', Number);
  bind('insp-obj-behavior', 'behavior');
  bind('insp-obj-speed', 'moveSpeed', Number);
  bind('insp-obj-jump', 'jumpForce', Number);
  bind('insp-obj-patrol-speed', 'patrolSpeed', Number);
  bind('insp-obj-patrol-dist', 'maxPatrolDist', Number);
  bind('insp-obj-chase-speed', 'chaseSpeed', Number);
  bind('insp-obj-detect-range', 'detectRange', Number);

  // Behavior changes re-render inspector to show contextual fields
  container.querySelector('#insp-obj-behavior')?.addEventListener('change', () => {
    renderInspector(container, obj, currentScene, spriteLibrary, onPropertyChange, onDeleteObject);
  });

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
  container.querySelector('#insp-obj-doublejump')?.addEventListener('change', (e) => {
    obj.allowDoubleJump = e.target.checked;
    if (onPropertyChange) onPropertyChange(obj);
  });

  // Delete Object
  container.querySelector('.btn-insp-del')?.addEventListener('click', () => {
    if (onDeleteObject) onDeleteObject(obj.id);
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
          <label class="insp-label" for="insp-scene-name">Scene Name</label>
          <input type="text" id="insp-scene-name" class="form-control form-control-sm font-bold" value="${escapeHTML(currentScene.name)}" />
        </div>
        <div class="inspector-field-row">
          <label class="insp-label" for="insp-scene-bg">Background Tint</label>
          <div class="flex items-center gap-2">
            <input type="color" id="insp-scene-bg" class="form-control form-control-sm p-0 w-8 h-7 cursor-pointer" value="${currentScene.bgColor || '#0d1117'}" />
            <input type="text" id="insp-scene-bg-hex" class="form-control form-control-sm font-mono flex-1" value="${currentScene.bgColor || '#0d1117'}" />
          </div>
        </div>
        <div class="inspector-field-row">
          <label class="insp-label" for="insp-scene-gravity">World Gravity (Y)</label>
          <input type="number" id="insp-scene-gravity" class="form-control form-control-sm" value="${currentScene.gravity !== undefined ? currentScene.gravity : 980}" />
        </div>
        <div class="inspector-grid-2">
          <div class="inspector-field-row">
            <label class="insp-label" for="insp-scene-width">World W</label>
            <input type="number" id="insp-scene-width" class="form-control form-control-sm" value="${currentScene.bounds?.width || 1600}" />
          </div>
          <div class="inspector-field-row">
            <label class="insp-label" for="insp-scene-height">World H</label>
            <input type="number" id="insp-scene-height" class="form-control form-control-sm" value="${currentScene.bounds?.height || 800}" />
          </div>
        </div>
        <div class="inspector-field-row">
          <label class="checkbox-label text-xs">
            <input type="checkbox" id="insp-scene-camera" ${currentScene.cameraFollow !== false ? 'checked' : ''} /> Camera Follow Player
          </label>
        </div>
      </div>
      <div class="p-3 text-xs text-muted card">
        Tip: Click any object on the canvas or in the scene hierarchy tree to inspect and customize its transform, appearance, and physics properties.
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
  container.querySelector('#insp-scene-width')?.addEventListener('input', (e) => {
    if (!currentScene.bounds) currentScene.bounds = { width: 1600, height: 800 };
    currentScene.bounds.width = Number(e.target.value);
    if (onPropertyChange) onPropertyChange();
  });
  container.querySelector('#insp-scene-height')?.addEventListener('input', (e) => {
    if (!currentScene.bounds) currentScene.bounds = { width: 1600, height: 800 };
    currentScene.bounds.height = Number(e.target.value);
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
 * Interactive Construct / Scratch-inspired visual block rule builder with condition-action blocks.
 */



function renderEventSheet(container, scene, projectVariables = {}, onRuleChange = null) {
  const events = scene.events || [];
  const objects = scene.objects || [];

  container.innerHTML = `
    <div class="event-sheet-header">
      <div class="flex items-center gap-2">
        <span class="text-xs font-bold uppercase text-primary">${getIcon('code', 'icon-xs')} Visual Event Sheet &bull; ${escapeHTML(scene.name)}</span>
        <span class="badge badge-secondary font-mono text-xs">${events.length} Rules</span>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn btn-sm btn-primary" id="btn-add-event-rule">
          ${getIcon('plus', 'icon-xs')} Add Rule
        </button>
      </div>
    </div>

    <div class="event-rules-list" id="event-rules-list">
      ${events.length === 0 ? `
        <div class="card p-6 text-center text-muted text-xs">
          No event rules configured for this scene. Click "+ Add Rule" to create interactive gameplay mechanics, score triggers, and combat logic!
        </div>
      ` : events.map((rule, idx) => renderRuleCard(rule, idx, objects, projectVariables, events.length)).join('')}
    </div>
  `;

  // --- Attach Handlers ---
  const reRender = () => {
    renderEventSheet(container, scene, projectVariables, onRuleChange);
    if (onRuleChange) onRuleChange();
  };

  // Add Rule
  container.querySelector('#btn-add-event-rule')?.addEventListener('click', () => {
    if (!scene.events) scene.events = [];
    scene.events.push({
      id: 'rule_' + Date.now(),
      enabled: true,
      trigger: { type: 'on_collision', objectId: 'player', targetType: 'crystal' },
      actions: [
        { type: 'change_variable', variable: Object.keys(projectVariables)[0] || 'score', operation: 'add', value: 100 },
        { type: 'play_sound', sound: 'coin' },
        { type: 'destroy_object', targetId: 'context.target' }
      ]
    });
    reRender();
  });

  // Toggle Rule Enabled
  container.querySelectorAll('.btn-toggle-rule-enabled').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      scene.events[idx].enabled = scene.events[idx].enabled === false ? true : false;
      reRender();
    });
  });

  // Move Rule Up / Down
  container.querySelectorAll('.btn-move-rule-up').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      if (idx > 0) {
        const temp = scene.events[idx];
        scene.events[idx] = scene.events[idx - 1];
        scene.events[idx - 1] = temp;
        reRender();
      }
    });
  });

  container.querySelectorAll('.btn-move-rule-down').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      if (idx < scene.events.length - 1) {
        const temp = scene.events[idx];
        scene.events[idx] = scene.events[idx + 1];
        scene.events[idx + 1] = temp;
        reRender();
      }
    });
  });

  // Duplicate Rule
  container.querySelectorAll('.btn-dupe-rule').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      const clone = JSON.parse(JSON.stringify(scene.events[idx]));
      clone.id = 'rule_' + Date.now();
      scene.events.splice(idx + 1, 0, clone);
      reRender();
    });
  });

  // Rule Delete
  container.querySelectorAll('.btn-del-rule').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      scene.events.splice(idx, 1);
      reRender();
    });
  });

  // Trigger Type Change
  container.querySelectorAll('.rule-trigger-type').forEach(select => {
    select.addEventListener('change', () => {
      const idx = parseInt(select.dataset.idx, 10);
      const newType = select.value;
      scene.events[idx].trigger = getDefaultTriggerForType(newType, objects, projectVariables);
      reRender();
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
      reRender();
    });
  });

  // Action Delete
  container.querySelectorAll('.btn-del-action').forEach(btn => {
    btn.addEventListener('click', () => {
      const ruleIdx = parseInt(btn.dataset.ruleIdx, 10);
      const actionIdx = parseInt(btn.dataset.actionIdx, 10);
      scene.events[ruleIdx].actions.splice(actionIdx, 1);
      reRender();
    });
  });

  // Action Type Change
  container.querySelectorAll('.rule-action-type').forEach(select => {
    select.addEventListener('change', () => {
      const ruleIdx = parseInt(select.dataset.ruleIdx, 10);
      const actionIdx = parseInt(select.dataset.actionIdx, 10);
      const newType = select.value;
      scene.events[ruleIdx].actions[actionIdx] = getDefaultActionForType(newType, projectVariables);
      reRender();
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

function renderRuleCard(rule, idx, objects, projectVariables, totalRules) {
  const trigger = rule.trigger || { type: 'on_start' };
  const actions = rule.actions || [];
  const isEnabled = rule.enabled !== false;

  return `
    <div class="card event-rule-card mb-3 ${!isEnabled ? 'opacity-50' : ''}">
      <div class="event-rule-header">
        <div class="flex items-center gap-2">
          <button class="btn btn-xs ${isEnabled ? 'btn-primary' : 'btn-secondary'} btn-toggle-rule-enabled" data-idx="${idx}">
            ${isEnabled ? 'ENABLED' : 'DISABLED'}
          </button>
          <span class="font-mono text-xs font-bold text-muted">RULE #${idx + 1}</span>
        </div>
        <div class="flex items-center gap-1">
          <button class="btn-icon-xs btn-move-rule-up" data-idx="${idx}" title="Move Rule Up" ${idx === 0 ? 'disabled' : ''}>
            ${getIcon('chevronUp', 'icon-xs')}
          </button>
          <button class="btn-icon-xs btn-move-rule-down" data-idx="${idx}" title="Move Rule Down" ${idx === totalRules - 1 ? 'disabled' : ''}>
            ${getIcon('chevronDown', 'icon-xs')}
          </button>
          <button class="btn-icon-xs btn-dupe-rule" data-idx="${idx}" title="Duplicate Rule">
            ${getIcon('copy', 'icon-xs')}
          </button>
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
            <option value="on_key_down" ${trigger.type === 'on_key_down' ? 'selected' : ''}>On Key Held Down</option>
            <option value="on_start" ${trigger.type === 'on_start' ? 'selected' : ''}>On Scene Start</option>
            <option value="on_update" ${trigger.type === 'on_update' ? 'selected' : ''}>On Every Frame</option>
            <option value="on_click" ${trigger.type === 'on_click' ? 'selected' : ''}>On Object Clicked</option>
            <option value="on_timer" ${trigger.type === 'on_timer' ? 'selected' : ''}>On Timer Interval</option>
            <option value="on_variable" ${trigger.type === 'on_variable' ? 'selected' : ''}>On Variable Value</option>
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
              <button class="btn btn-xs btn-ghost text-primary btn-add-action-to-rule" data-idx="${idx}">
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
      <select class="form-control form-control-sm trigger-param w-36" data-idx="${idx}" data-param="objectId">
        <option value="player" ${trigger.objectId === 'player' ? 'selected' : ''}>Player</option>
        ${objects.map(o => `<option value="${o.id}" ${trigger.objectId === o.id ? 'selected' : ''}>${escapeHTML(o.name)}</option>`).join('')}
      </select>
      <span class="text-xs text-muted">hits tag/id:</span>
      <input type="text" class="form-control form-control-sm trigger-param w-32 font-mono" data-idx="${idx}" data-param="targetType" placeholder="coin/enemy/portal" value="${escapeHTML(trigger.targetType || '')}" />
    `;
  }

  if (trigger.type === 'on_key_press' || trigger.type === 'on_key_down') {
    return `
      <select class="form-control form-control-sm trigger-param w-36" data-idx="${idx}" data-param="key">
        <option value="Space" ${trigger.key === 'Space' ? 'selected' : ''}>Space (Jump/Action)</option>
        <option value="ArrowUp" ${trigger.key === 'ArrowUp' ? 'selected' : ''}>Arrow Up / W</option>
        <option value="ArrowDown" ${trigger.key === 'ArrowDown' ? 'selected' : ''}>Arrow Down / S</option>
        <option value="ArrowLeft" ${trigger.key === 'ArrowLeft' ? 'selected' : ''}>Arrow Left / A</option>
        <option value="ArrowRight" ${trigger.key === 'ArrowRight' ? 'selected' : ''}>Arrow Right / D</option>
        <option value="KeyJ" ${trigger.key === 'KeyJ' ? 'selected' : ''}>Key J (Shoot)</option>
        <option value="KeyZ" ${trigger.key === 'KeyZ' ? 'selected' : ''}>Key Z (Action)</option>
        <option value="KeyX" ${trigger.key === 'KeyX' ? 'selected' : ''}>Key X (Alt)</option>
        <option value="Enter" ${trigger.key === 'Enter' ? 'selected' : ''}>Enter</option>
      </select>
    `;
  }

  if (trigger.type === 'on_timer') {
    return `
      <span class="text-xs text-muted">Every</span>
      <input type="number" step="0.1" class="form-control form-control-sm trigger-param w-20" data-idx="${idx}" data-param="interval" value="${trigger.interval || 1.0}" />
      <span class="text-xs text-muted">seconds</span>
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
        <option value="!=" ${trigger.operator === '!=' ? 'selected' : ''}>!=</option>
        <option value=">" ${trigger.operator === '>' ? 'selected' : ''}>&gt;</option>
        <option value="<" ${trigger.operator === '<' ? 'selected' : ''}>&lt;</option>
      </select>
      <input type="text" class="form-control form-control-sm trigger-param w-20" data-idx="${idx}" data-param="value" value="${trigger.value !== undefined ? trigger.value : 0}" />
    `;
  }

  if (trigger.type === 'on_out_of_bounds') {
    return `
      <span class="text-xs text-muted">Object:</span>
      <select class="form-control form-control-sm trigger-param w-36" data-idx="${idx}" data-param="objectId">
        <option value="player" ${trigger.objectId === 'player' ? 'selected' : ''}>Player</option>
        ${objects.map(o => `<option value="${o.id}" ${trigger.objectId === o.id ? 'selected' : ''}>${escapeHTML(o.name)}</option>`).join('')}
      </select>
    `;
  }

  return '';
}

function renderActionRow(action, ruleIdx, actionIdx, objects, projectVariables) {
  return `
    <div class="action-item-row flex items-center gap-2">
      <select class="form-control form-control-sm w-40 rule-action-type" data-rule-idx="${ruleIdx}" data-action-idx="${actionIdx}">
        <option value="change_variable" ${action.type === 'change_variable' ? 'selected' : ''}>Change Variable</option>
        <option value="play_sound" ${action.type === 'play_sound' ? 'selected' : ''}>Play Sound FX</option>
        <option value="destroy_object" ${action.type === 'destroy_object' ? 'selected' : ''}>Destroy Object</option>
        <option value="spawn_object" ${action.type === 'spawn_object' ? 'selected' : ''}>Spawn Object</option>
        <option value="show_message" ${action.type === 'show_message' ? 'selected' : ''}>Show HUD Message</option>
        <option value="camera_shake" ${action.type === 'camera_shake' ? 'selected' : ''}>Camera Shake</option>
        <option value="restart_scene" ${action.type === 'restart_scene' ? 'selected' : ''}>Restart Scene</option>
        <option value="change_scene" ${action.type === 'change_scene' ? 'selected' : ''}>Change Scene</option>
      </select>

      ${renderActionParams(action, ruleIdx, actionIdx, objects, projectVariables)}

      <button class="btn-icon-xs text-rose btn-del-action" data-rule-idx="${ruleIdx}" data-action-idx="${actionIdx}" title="Delete Action">&times;</button>
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
        <option value="multiply" ${action.operation === 'multiply' ? 'selected' : ''}>Multiply (*)</option>
      </select>
      <input type="number" class="form-control form-control-sm action-param w-20" data-rule-idx="${ruleIdx}" data-action-idx="${actionIdx}" data-param="value" value="${action.value !== undefined ? action.value : 100}" />
    `;
  }

  if (action.type === 'play_sound') {
    return `
      <select class="form-control form-control-sm action-param w-36" data-rule-idx="${ruleIdx}" data-action-idx="${actionIdx}" data-param="sound">
        <option value="coin" ${action.sound === 'coin' ? 'selected' : ''}>Coin / Gem</option>
        <option value="jump" ${action.sound === 'jump' ? 'selected' : ''}>Jump</option>
        <option value="double_jump" ${action.sound === 'double_jump' ? 'selected' : ''}>Double Jump</option>
        <option value="laser" ${action.sound === 'laser' ? 'selected' : ''}>Laser Blast</option>
        <option value="explosion" ${action.sound === 'explosion' ? 'selected' : ''}>Explosion</option>
        <option value="hit" ${action.sound === 'hit' ? 'selected' : ''}>Hit / Damage</option>
        <option value="powerup" ${action.sound === 'powerup' ? 'selected' : ''}>Powerup</option>
        <option value="win" ${action.sound === 'win' ? 'selected' : ''}>Victory Fanfare</option>
        <option value="game_over" ${action.sound === 'game_over' ? 'selected' : ''}>Game Over</option>
        <option value="teleport" ${action.sound === 'teleport' ? 'selected' : ''}>Teleport</option>
        <option value="dash" ${action.sound === 'dash' ? 'selected' : ''}>Dash Burst</option>
        <option value="bounce" ${action.sound === 'bounce' ? 'selected' : ''}>Spring Bounce</option>
      </select>
    `;
  }

  if (action.type === 'destroy_object') {
    return `
      <select class="form-control form-control-sm action-param w-36" data-rule-idx="${ruleIdx}" data-action-idx="${actionIdx}" data-param="targetId">
        <option value="context.target" ${action.targetId === 'context.target' ? 'selected' : ''}>Collided Target</option>
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

  if (action.type === 'camera_shake') {
    return `
      <span class="text-xs text-muted">Intensity:</span>
      <input type="number" class="form-control form-control-sm action-param w-16" data-rule-idx="${ruleIdx}" data-action-idx="${actionIdx}" data-param="intensity" value="${action.intensity || 8}" />
    `;
  }

  return '';
}

function getDefaultTriggerForType(type, objects, projectVariables) {
  switch (type) {
    case 'on_collision':
      return { type: 'on_collision', objectId: 'player', targetType: 'crystal' };
    case 'on_key_press':
    case 'on_key_down':
      return { type, key: 'Space' };
    case 'on_timer':
      return { type: 'on_timer', interval: 2.0 };
    case 'on_variable':
      return { type: 'on_variable', variable: Object.keys(projectVariables)[0] || 'score', operator: '>=', value: 100 };
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
      return { type: 'change_variable', variable: firstVar, operation: 'add', value: 100 };
    case 'play_sound':
      return { type: 'play_sound', sound: 'coin' };
    case 'destroy_object':
      return { type: 'destroy_object', targetId: 'context.target' };
    case 'spawn_object':
      return { type: 'spawn_object', objectName: 'Laser Beam', spawnAt: 'player', vx: 0, vy: -600 };
    case 'show_message':
      return { type: 'show_message', message: 'Victory! Level Completed!', duration: 4 };
    case 'camera_shake':
      return { type: 'camera_shake', intensity: 8, duration: 0.3 };
    case 'change_scene':
      return { type: 'change_scene', sceneId: 'scene_level1' };
    case 'restart_scene':
      return { type: 'restart_scene' };
    default:
      return { type };
  }
}


/* --- MODULE: js/editor/sprite-painter.js --- */
/**
 * GameSmith - Built-In Pixel Art Sprite Studio
 * Full-featured 16x16 / 24x24 / 32x32 pixel editor with tools, palette, undo/redo, and live previews.
 */



const PALETTE = [
  '#000000', '#ffffff', '#58a6ff', '#3fb950', '#f85149', '#d29922',
  '#a371f7', '#f0883e', '#1f6feb', '#238636', '#da3633', '#9e6a03',
  '#8b949e', '#30363d', '#ff7b72', '#79c0ff', '#56d364', '#e3b341',
  '#d2a8ff', '#ffab70', '#ffa198', '#161b22', '#0d1117', '#484f58'
];

class SpritePainterModal {
  constructor(modalContainer, onSaveSprite) {
    this.container = modalContainer;
    this.onSaveSprite = onSaveSprite;
    this.gridSize = 16;
    this.pixels = new Array(this.gridSize * this.gridSize).fill('transparent');
    this.currentColor = '#58a6ff';
    this.currentTool = 'pencil'; // pencil, eraser, fill, picker
    this.isDrawing = false;

    this.undoStack = [];
    this.redoStack = [];
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

    this.undoStack = [];
    this.redoStack = [];
    this.saveStateToUndo();

    this.render();
    this.container.classList.add('active');
  }

  close() {
    this.container.classList.remove('active');
  }

  saveStateToUndo() {
    this.undoStack.push([...this.pixels]);
    if (this.undoStack.length > 30) this.undoStack.shift();
    this.redoStack = [];
  }

  undo() {
    if (this.undoStack.length > 1) {
      this.redoStack.push(this.undoStack.pop());
      this.pixels = [...this.undoStack[this.undoStack.length - 1]];
      this.redraw();
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const state = this.redoStack.pop();
      this.undoStack.push([...state]);
      this.pixels = [...state];
      this.redraw();
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-dialog sprite-painter-dialog" role="dialog" aria-modal="true" aria-labelledby="sprite-modal-title">
        <div class="modal-header">
          <div class="flex items-center gap-2">
            ${getIcon('paint', 'icon-sm text-primary')}
            <span class="font-bold text-sm" id="sprite-modal-title">Pixel Art Sprite Studio</span>
          </div>
          <button class="btn-icon-xs btn-modal-close" aria-label="Close dialog">&times;</button>
        </div>

        <div class="modal-body p-4 flex gap-4">
          
          <!-- Drawing Canvas -->
          <div class="painter-canvas-container flex flex-col items-center">
            <canvas id="painter-canvas" width="288" height="288" class="painter-canvas cursor-crosshair"></canvas>
            
            <div class="flex gap-2 mt-3 items-center w-full justify-between">
              <div class="flex items-center gap-1">
                <span class="text-xs text-muted">Grid:</span>
                <button class="btn btn-xs ${this.gridSize === 16 ? 'btn-primary' : 'btn-secondary'} btn-set-grid" data-size="16">16x16</button>
                <button class="btn btn-xs ${this.gridSize === 24 ? 'btn-primary' : 'btn-secondary'} btn-set-grid" data-size="24">24x24</button>
                <button class="btn btn-xs ${this.gridSize === 32 ? 'btn-primary' : 'btn-secondary'} btn-set-grid" data-size="32">32x32</button>
              </div>

              <div class="flex items-center gap-1">
                <button class="btn btn-xs btn-secondary btn-painter-undo" title="Undo (Ctrl+Z)">${getIcon('undo', 'icon-xs')}</button>
                <button class="btn btn-xs btn-secondary btn-painter-redo" title="Redo (Ctrl+Y)">${getIcon('redo', 'icon-xs')}</button>
                <button class="btn btn-xs btn-ghost text-rose btn-clear-canvas" title="Clear Canvas">${getIcon('trash', 'icon-xs')}</button>
              </div>
            </div>
          </div>

          <!-- Tools & Palette Sidebar -->
          <div class="painter-tools-sidebar flex-1 flex flex-col justify-between">
            <div>
              <div class="form-group mb-3">
                <label class="form-label text-xs font-semibold" for="painter-sprite-name">Sprite Identifier Name</label>
                <input type="text" id="painter-sprite-name" class="form-control form-control-sm" value="${escapeHTML(this.spriteName)}" />
              </div>

              <div class="tool-picker-row flex gap-1 mb-3">
                <button class="btn btn-sm flex-1 ${this.currentTool === 'pencil' ? 'btn-primary' : 'btn-secondary'} btn-tool-select" data-tool="pencil" title="Pencil Tool">
                  Pencil
                </button>
                <button class="btn btn-sm flex-1 ${this.currentTool === 'eraser' ? 'btn-primary' : 'btn-secondary'} btn-tool-select" data-tool="eraser" title="Eraser Tool">
                  Eraser
                </button>
                <button class="btn btn-sm flex-1 ${this.currentTool === 'fill' ? 'btn-primary' : 'btn-secondary'} btn-tool-select" data-tool="fill" title="Fill Bucket">
                  Bucket
                </button>
                <button class="btn btn-sm flex-1 ${this.currentTool === 'picker' ? 'btn-primary' : 'btn-secondary'} btn-tool-select" data-tool="picker" title="Color Picker">
                  Picker
                </button>
              </div>

              <div class="palette-swatches-grid mb-3">
                ${PALETTE.map(c => `
                  <div class="swatch-btn ${this.currentColor === c ? 'selected' : ''}" style="background-color: ${c};" data-color="${c}" title="${c}"></div>
                `).join('')}
              </div>

              <div class="flex items-center gap-2 mb-3">
                <label class="text-xs text-muted" for="painter-color-picker">Custom Color:</label>
                <input type="color" id="painter-color-picker" class="form-control form-control-sm p-0 w-8 h-7 cursor-pointer" value="${this.currentColor}" />
                <input type="text" id="painter-color-hex" class="form-control form-control-sm font-mono w-24" value="${this.currentColor}" />
              </div>

              <div class="flex gap-2 mb-3">
                <button class="btn btn-xs btn-secondary flex-1 btn-mirror-h" title="Mirror Horizontally">Mirror X</button>
                <button class="btn btn-xs btn-secondary flex-1 btn-export-png" title="Download Sprite as PNG">Export PNG</button>
              </div>
            </div>

            <!-- Preview Card -->
            <div class="card p-3 flex items-center justify-between">
              <div class="flex flex-col">
                <span class="text-xs font-semibold text-primary">Live Preview</span>
                <span class="text-xs text-muted">1x, 2x, 4x Scale</span>
              </div>
              <div class="flex items-center gap-3">
                <canvas id="painter-preview" width="32" height="32" style="background: #0d1117; border-radius: 4px; border: 1px solid var(--border-subtle);"></canvas>
                <canvas id="painter-preview-lg" width="48" height="48" style="background: #0d1117; border-radius: 4px; border: 1px solid var(--border-subtle);"></canvas>
              </div>
            </div>
          </div>

        </div>

        <div class="modal-footer p-3 border-t flex justify-end gap-2">
          <button class="btn btn-sm btn-secondary btn-modal-close">Cancel</button>
          <button class="btn btn-sm btn-primary" id="btn-save-painter-sprite">Save Sprite to Project</button>
        </div>
      </div>
    `;

    this.canvas = this.container.querySelector('#painter-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.previewCanvas = this.container.querySelector('#painter-preview');
    this.previewCtx = this.previewCanvas.getContext('2d');
    this.previewLgCanvas = this.container.querySelector('#painter-preview-lg');
    this.previewLgCtx = this.previewLgCanvas.getContext('2d');

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
        this.container.querySelectorAll('.btn-tool-select').forEach(x => x.className = 'btn btn-sm flex-1 btn-secondary btn-tool-select');
        b.className = 'btn btn-sm flex-1 btn-primary btn-tool-select';
      });
    });

    // Swatches
    this.container.querySelectorAll('.swatch-btn').forEach(b => {
      b.addEventListener('click', () => {
        this.currentColor = b.dataset.color;
        this.container.querySelectorAll('.swatch-btn').forEach(x => x.classList.remove('selected'));
        b.classList.add('selected');
        this.container.querySelector('#painter-color-picker').value = this.currentColor;
        this.container.querySelector('#painter-color-hex').value = this.currentColor;
      });
    });

    // Custom Color picker
    const picker = this.container.querySelector('#painter-color-picker');
    const hexInput = this.container.querySelector('#painter-color-hex');
    picker?.addEventListener('input', (e) => {
      this.currentColor = e.target.value;
      if (hexInput) hexInput.value = e.target.value;
    });
    hexInput?.addEventListener('input', (e) => {
      this.currentColor = e.target.value;
      if (picker) picker.value = e.target.value;
    });

    // Undo & Redo
    this.container.querySelector('.btn-painter-undo')?.addEventListener('click', () => this.undo());
    this.container.querySelector('.btn-painter-redo')?.addEventListener('click', () => this.redo());

    // Grid size switch
    this.container.querySelectorAll('.btn-set-grid').forEach(b => {
      b.addEventListener('click', () => {
        const size = parseInt(b.dataset.size, 10);
        if (size !== this.gridSize) {
          this.gridSize = size;
          this.pixels = new Array(size * size).fill('transparent');
          this.saveStateToUndo();
          this.render();
        }
      });
    });

    // Mirror Horizontal
    this.container.querySelector('.btn-mirror-h')?.addEventListener('click', () => {
      const newPixels = new Array(this.gridSize * this.gridSize);
      for (let r = 0; r < this.gridSize; r++) {
        for (let c = 0; c < this.gridSize; c++) {
          newPixels[r * this.gridSize + (this.gridSize - 1 - c)] = this.pixels[r * this.gridSize + c];
        }
      }
      this.pixels = newPixels;
      this.saveStateToUndo();
      this.redraw();
    });

    // Export PNG
    this.container.querySelector('.btn-export-png')?.addEventListener('click', () => {
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = this.gridSize * 16;
      exportCanvas.height = this.gridSize * 16;
      const expCtx = exportCanvas.getContext('2d');
      expCtx.imageSmoothingEnabled = false;

      const pSize = 16;
      for (let r = 0; r < this.gridSize; r++) {
        for (let c = 0; c < this.gridSize; c++) {
          const col = this.pixels[r * this.gridSize + c];
          if (col && col !== 'transparent') {
            expCtx.fillStyle = col;
            expCtx.fillRect(c * pSize, r * pSize, pSize, pSize);
          }
        }
      }

      const a = document.createElement('a');
      a.href = exportCanvas.toDataURL('image/png');
      a.download = (this.container.querySelector('#painter-sprite-name').value || 'sprite').toLowerCase().replace(/\s+/g, '_') + '.png';
      a.click();
    });

    // Clear
    this.container.querySelector('.btn-clear-canvas')?.addEventListener('click', () => {
      this.pixels.fill('transparent');
      this.saveStateToUndo();
      this.redraw();
    });

    // Save Sprite
    this.container.querySelector('#btn-save-painter-sprite')?.addEventListener('click', () => {
      const name = this.container.querySelector('#painter-sprite-name').value || 'Sprite';
      const primaryCol = this.pixels.find(c => c && c !== 'transparent') || '#58a6ff';
      const sprite = {
        id: this.spriteId,
        name: name.trim(),
        size: this.gridSize,
        pixels: [...this.pixels],
        primaryColor: primaryCol
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
        if (this.currentTool === 'picker') {
          const picked = this.pixels[y * this.gridSize + x];
          if (picked && picked !== 'transparent') {
            this.currentColor = picked;
            const p = this.container.querySelector('#painter-color-picker');
            const h = this.container.querySelector('#painter-color-hex');
            if (p) p.value = picked;
            if (h) h.value = picked;
          }
          return;
        }

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
      if (this.isDrawing) {
        this.isDrawing = false;
        this.saveStateToUndo();
      }
    });

    // Touch events
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.isDrawing = true;
      handleDraw(e);
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (this.isDrawing) handleDraw(e);
    }, { passive: false });

    this.canvas.addEventListener('touchend', () => {
      if (this.isDrawing) {
        this.isDrawing = false;
        this.saveStateToUndo();
      }
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

    // Redraw previews
    const renderToPreview = (pCtx, pCanvas) => {
      if (!pCtx || !pCanvas) return;
      const pw = pCanvas.width;
      const ph = pCanvas.height;
      const prevPixel = pw / this.gridSize;
      pCtx.clearRect(0, 0, pw, ph);

      for (let r = 0; r < this.gridSize; r++) {
        for (let c = 0; c < this.gridSize; c++) {
          const col = this.pixels[r * this.gridSize + c];
          if (col && col !== 'transparent') {
            pCtx.fillStyle = col;
            pCtx.fillRect(c * prevPixel, r * prevPixel, prevPixel + 0.5, prevPixel + 0.5);
          }
        }
      }
    };

    renderToPreview(this.previewCtx, this.previewCanvas);
    renderToPreview(this.previewLgCtx, this.previewLgCanvas);
  }
}


/* --- MODULE: js/app.js --- */
/**
 * GameSmith - Master Workstation Orchestrator
 * Integrates Canvas Viewport, Game Runtime, Scene Tree, Inspector, Event Sheet, Modals, and Standalone Exporter.
 */













class GameSmithApp {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.renderer = new GameRenderer(this.canvas);
    this.runtime = new GameRuntime(this.renderer);

    // Project state (deep copy of template)
    this.project = JSON.parse(JSON.stringify(TEMPLATES.platformer));
    this.currentScene = this.project.scenes[0];
    this.selectedObjectId = 'player';
    this.selectedObject = this.currentScene.objects.find(o => o.id === 'player') || null;

    // Viewport Editor state
    this.zoom = 1;
    this.panX = 80;
    this.panY = 40;
    this.isPanning = false;
    this.isDraggingObject = false;
    this.isResizingObject = false;
    this.resizeHandle = null; // 'nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'
    this.dragOffset = { x: 0, y: 0 };
    this.initialResizeState = null;
    this.gridSnap = true;
    this.gridSize = 32;
    this.showColliders = true;

    // Modals & Panels
    this.spritePainter = new SpritePainterModal(
      document.getElementById('gamesmith-modal-container'),
      (sprite) => this.handleSaveSprite(sprite)
    );

    this.isPlaying = false;
    this.activeMobileTab = 'canvas'; // 'hierarchy', 'canvas', 'events', 'inspector'
  }

  async init() {
    await db.init();

    // Resize canvas
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    // Load saved project if exists
    try {
      const lastProjectId = localStorage.getItem('gamesmith_last_project_id');
      if (lastProjectId) {
        const saved = await db.loadProject(lastProjectId);
        if (saved && saved.scenes && saved.scenes.length > 0) {
          this.project = saved;
          this.currentScene = this.project.scenes[0];
          this.selectedObjectId = this.currentScene.objects[0]?.id || null;
          this.selectedObject = this.currentScene.objects[0] || null;
        }
      }
    } catch (e) {
      console.warn('Could not restore saved project:', e);
    }

    // Setup runtime callbacks
    this.runtime.onStateChange = (state, originalScene) => {
      if (state === 'stopped' && originalScene) {
        this.currentScene = originalScene;
        this.isPlaying = false;
        this.updatePlayToolbar();
        this.hideTouchGamepad();
        this.renderAll();
      } else if (state === 'playing') {
        this.isPlaying = true;
        this.updatePlayToolbar();
        this.showTouchGamepadIfMobile();
      } else if (state === 'paused') {
        this.updatePlayToolbar();
      }
    };

    this.setupToolbar();
    this.setupCanvasInteractions();
    this.setupShortcuts();
    this.setupTouchGamepad();
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
    r.drawWorldBounds(this.currentScene.bounds || { width: 1600, height: 800 }, { zoom: this.zoom });

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
      this.showToast(this.gridSnap ? 'Grid Snapping Enabled' : 'Grid Snapping Disabled');
    });

    document.getElementById('select-grid-size')?.addEventListener('change', (e) => {
      this.gridSize = parseInt(e.target.value, 10) || 32;
    });

    // Zoom controls
    document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
      this.zoom = Math.min(3.5, Number((this.zoom + 0.25).toFixed(2)));
      this.updateZoomBadge();
    });
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
      this.zoom = Math.max(0.25, Number((this.zoom - 0.25).toFixed(2)));
      this.updateZoomBadge();
    });
    document.getElementById('btn-zoom-reset')?.addEventListener('click', () => {
      this.zoom = 1; this.panX = 80; this.panY = 40;
      this.updateZoomBadge();
    });

    // Colliders wireframe toggle
    const colToggle = document.getElementById('btn-toggle-colliders');
    colToggle?.addEventListener('click', () => {
      this.showColliders = !this.showColliders;
      colToggle.classList.toggle('active', this.showColliders);
      this.showToast(this.showColliders ? 'Colliders Visible' : 'Colliders Hidden');
    });

    // Template Switcher
    document.getElementById('select-template')?.addEventListener('change', (e) => {
      const tKey = e.target.value;
      if (TEMPLATES[tKey]) {
        if (confirm(`Load template "${TEMPLATES[tKey].name}"? Current unsaved modifications will be replaced.`)) {
          this.loadProject(JSON.parse(JSON.stringify(TEMPLATES[tKey])));
          this.showToast(`Loaded Template: ${TEMPLATES[tKey].name}`);
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
      this.showToast('Project Exported to JSON');
    });

    // Export Standalone Playable HTML Game
    document.getElementById('btn-export-html')?.addEventListener('click', () => {
      this.exportStandaloneHTML();
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
          if (parsed && parsed.scenes && Array.isArray(parsed.scenes) && parsed.scenes.length > 0) {
            this.loadProject(parsed);
            this.showToast('Project Successfully Imported!');
          } else {
            alert('Invalid GameSmith project file structure.');
          }
        } catch (err) {
          alert('Failed to parse JSON project file: ' + err.message);
        }
      };
      reader.readAsText(file);
      importInput.value = '';
    });

    // Project Settings Modal
    document.getElementById('btn-project-settings')?.addEventListener('click', () => {
      this.openProjectSettingsModal();
    });

    // Keyboard Shortcuts Help
    document.getElementById('btn-help-shortcuts')?.addEventListener('click', () => {
      this.openShortcutsModal();
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
          bounds: { width: 1600, height: 800 },
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
              name: 'Ground Floor',
              tag: 'solid',
              x: 0,
              y: 640,
              width: 1600,
              height: 80,
              color: '#21262d',
              shape: 'platform',
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
        this.showToast(`Created Scene: ${newScene.name}`);
      }
    });

    // Mobile View Selector Tabs
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        this.setMobileView(view);
      });
    });
  }

  setMobileView(view) {
    this.activeMobileTab = view;
    document.querySelectorAll('.mobile-nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));

    const leftPanel = document.getElementById('scene-tree-container');
    const centerPanel = document.querySelector('.editor-center-workspace');
    const bottomPanel = document.getElementById('bottom-sheet-container');
    const rightPanel = document.getElementById('inspector-panel-container');

    if (window.innerWidth <= 1024) {
      if (leftPanel) leftPanel.style.display = view === 'hierarchy' ? 'flex' : 'none';
      if (centerPanel) centerPanel.style.display = (view === 'canvas' || view === 'events') ? 'flex' : 'none';
      if (bottomPanel) bottomPanel.style.display = view === 'events' ? 'flex' : 'none';
      if (rightPanel) rightPanel.style.display = view === 'inspector' ? 'flex' : 'none';
      this.handleResize();
    }
  }

  updateZoomBadge() {
    const zoomReset = document.getElementById('btn-zoom-reset');
    if (zoomReset) {
      zoomReset.textContent = Math.round(this.zoom * 100) + '%';
    }
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

    const getResizeHandleUnderMouse = (obj, wx, wy) => {
      if (!obj) return null;
      const handleSize = 12 / this.zoom;
      const left = obj.x;
      const right = obj.x + obj.width;
      const top = obj.y;
      const bottom = obj.y + obj.height;
      const midX = obj.x + obj.width / 2;
      const midY = obj.y + obj.height / 2;

      const near = (px, py, tx, ty) => Math.hypot(px - tx, py - ty) < handleSize;

      if (near(wx, wy, left, top)) return 'nw';
      if (near(wx, wy, midX, top)) return 'n';
      if (near(wx, wy, right, top)) return 'ne';
      if (near(wx, wy, right, midY)) return 'e';
      if (near(wx, wy, right, bottom)) return 'se';
      if (near(wx, wy, midX, bottom)) return 's';
      if (near(wx, wy, left, bottom)) return 'sw';
      if (near(wx, wy, left, midY)) return 'w';

      return null;
    };

    canvas.addEventListener('mousedown', (e) => {
      if (this.isPlaying) return;

      const { wx, wy, sx, sy } = screenToWorld(e.clientX, e.clientY);

      // Middle click or Alt/Shift+click -> Pan
      if (e.button === 1 || e.altKey || (e.shiftKey && !this.selectedObject)) {
        this.isPanning = true;
        this.lastMouseX = sx;
        this.lastMouseY = sy;
        return;
      }

      // Check if clicking resize handles of currently selected object
      if (this.selectedObject && !this.selectedObject.locked) {
        const handle = getResizeHandleUnderMouse(this.selectedObject, wx, wy);
        if (handle) {
          this.isResizingObject = true;
          this.resizeHandle = handle;
          this.initialResizeState = {
            x: this.selectedObject.x,
            y: this.selectedObject.y,
            width: this.selectedObject.width,
            height: this.selectedObject.height,
            startWx: wx,
            startWy: wy
          };
          return;
        }
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

      // Update cursor based on hover
      if (this.selectedObject && !this.isDraggingObject && !this.isPanning) {
        const handle = getResizeHandleUnderMouse(this.selectedObject, wx, wy);
        if (handle === 'nw' || handle === 'se') canvas.style.cursor = 'nwse-resize';
        else if (handle === 'ne' || handle === 'sw') canvas.style.cursor = 'nesw-resize';
        else if (handle === 'n' || handle === 's') canvas.style.cursor = 'ns-resize';
        else if (handle === 'e' || handle === 'w') canvas.style.cursor = 'ew-resize';
        else canvas.style.cursor = 'default';
      }

      if (this.isPanning) {
        this.panX += sx - this.lastMouseX;
        this.panY += sy - this.lastMouseY;
        this.lastMouseX = sx;
        this.lastMouseY = sy;
      } else if (this.isResizingObject && this.selectedObject && this.initialResizeState) {
        const init = this.initialResizeState;
        const dx = wx - init.startWx;
        const dy = wy - init.startWy;
        const minSize = 16;

        let newW = init.width;
        let newH = init.height;
        let newX = init.x;
        let newY = init.y;

        if (this.resizeHandle.includes('e')) newW = Math.max(minSize, init.width + dx);
        if (this.resizeHandle.includes('s')) newH = Math.max(minSize, init.height + dy);
        if (this.resizeHandle.includes('w')) {
          const clampedDx = Math.min(dx, init.width - minSize);
          newX = init.x + clampedDx;
          newW = init.width - clampedDx;
        }
        if (this.resizeHandle.includes('n')) {
          const clampedDy = Math.min(dy, init.height - minSize);
          newY = init.y + clampedDy;
          newH = init.height - clampedDy;
        }

        if (this.gridSnap) {
          newW = Math.round(newW / this.gridSize) * this.gridSize;
          newH = Math.round(newH / this.gridSize) * this.gridSize;
          newX = Math.round(newX / this.gridSize) * this.gridSize;
          newY = Math.round(newY / this.gridSize) * this.gridSize;
        }

        this.selectedObject.width = Math.max(minSize, newW);
        this.selectedObject.height = Math.max(minSize, newH);
        this.selectedObject.x = newX;
        this.selectedObject.y = newY;
        this.renderInspectorPanel();
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
      if (this.isDraggingObject || this.isResizingObject) {
        this.autoSave();
      }
      this.isPanning = false;
      this.isDraggingObject = false;
      this.isResizingObject = false;
      this.resizeHandle = null;
      this.initialResizeState = null;
    });

    // Zoom wheel
    canvas.addEventListener('wheel', (e) => {
      if (this.isPlaying) return;
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
      this.zoom = Math.max(0.25, Math.min(3.5, Number((this.zoom * zoomFactor).toFixed(2))));
      this.updateZoomBadge();
    }, { passive: false });
  }

  setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      // Ctrl+P -> Toggle Play
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        this.togglePlay();
      }

      // Ctrl+S -> Save Project
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        this.autoSave();
        this.showToast('Project Saved Locally');
      }

      // Ctrl+D -> Duplicate selected
      if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D') && !this.isPlaying && this.selectedObjectId) {
        e.preventDefault();
        this.duplicateObject(this.selectedObjectId);
      }

      // Escape -> Stop Play
      if (e.key === 'Escape' && this.isPlaying) {
        this.runtime.stopPlay();
      }

      // Delete / Backspace -> Delete selected object
      if ((e.key === 'Delete' || e.key === 'Backspace') && !this.isPlaying && this.selectedObjectId) {
        this.deleteSelectedObject();
      }

      // G -> Toggle Grid
      if ((e.key === 'g' || e.key === 'G') && !this.isPlaying && !e.ctrlKey) {
        this.gridSnap = !this.gridSnap;
        document.getElementById('btn-toggle-grid')?.classList.toggle('active', this.gridSnap);
        this.showToast(this.gridSnap ? 'Grid Snapping Enabled' : 'Grid Snapping Disabled');
      }

      // C -> Toggle Colliders
      if ((e.key === 'c' || e.key === 'C') && !this.isPlaying && !e.ctrlKey) {
        this.showColliders = !this.showColliders;
        document.getElementById('btn-toggle-colliders')?.classList.toggle('active', this.showColliders);
        this.showToast(this.showColliders ? 'Colliders Visible' : 'Colliders Hidden');
      }
    });
  }

  // --- Touch Gamepad for Mobile Play ---
  setupTouchGamepad() {
    const pad = document.getElementById('mobile-touch-gamepad');
    if (!pad) return;

    const btnLeft = document.getElementById('touch-btn-left');
    const btnRight = document.getElementById('touch-btn-right');
    const btnUp = document.getElementById('touch-btn-up');
    const btnDown = document.getElementById('touch-btn-down');
    const btnA = document.getElementById('touch-btn-a');
    const btnB = document.getElementById('touch-btn-b');

    let currentAxisX = 0;
    let currentAxisY = 0;

    const updateVirtualInput = () => {
      input.setVirtualInput({
        axisX: currentAxisX,
        axisY: currentAxisY,
        jump: this.touchJumpPressed,
        action: this.touchActionPressed
      });
    };

    const attachButtonTouch = (el, onDown, onUp) => {
      if (!el) return;
      el.addEventListener('touchstart', (e) => { e.preventDefault(); onDown(); updateVirtualInput(); }, { passive: false });
      el.addEventListener('touchend', (e) => { e.preventDefault(); onUp(); updateVirtualInput(); }, { passive: false });
      el.addEventListener('mousedown', () => { onDown(); updateVirtualInput(); });
      el.addEventListener('mouseup', () => { onUp(); updateVirtualInput(); });
    };

    attachButtonTouch(btnLeft, () => { currentAxisX = -1; }, () => { currentAxisX = 0; });
    attachButtonTouch(btnRight, () => { currentAxisX = 1; }, () => { currentAxisX = 0; });
    attachButtonTouch(btnUp, () => { currentAxisY = -1; }, () => { currentAxisY = 0; });
    attachButtonTouch(btnDown, () => { currentAxisY = 1; }, () => { currentAxisY = 0; });
    attachButtonTouch(btnA, () => { this.touchJumpPressed = true; }, () => { this.touchJumpPressed = false; });
    attachButtonTouch(btnB, () => { this.touchActionPressed = true; }, () => { this.touchActionPressed = false; });
  }

  showTouchGamepadIfMobile() {
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || window.innerWidth <= 1024;
    const pad = document.getElementById('mobile-touch-gamepad');
    if (pad && isTouch) {
      pad.style.display = 'flex';
    }
  }

  hideTouchGamepad() {
    const pad = document.getElementById('mobile-touch-gamepad');
    if (pad) {
      pad.style.display = 'none';
    }
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
      this.runtime.playerObj = this.runtime.runtimeObjects.find(o => o.behavior === 'player' || o.behavior === 'topdown' || o.tag === 'player') || null;
      this.renderSceneSelector();
    }
  }

  // --- Scene & Object Actions ---
  renderSceneSelector() {
    const selector = document.getElementById('select-active-scene');
    if (selector) {
      selector.innerHTML = this.project.scenes.map(s => `
        <option value="${s.id}" ${s.id === this.currentScene.id ? 'selected' : ''}>Scene: ${escapeHTML(s.name)}</option>
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
      onAddObject: (preset) => this.addNewObject(preset),
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
      onReorderObject: () => {
        this.renderAll();
        this.autoSave();
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
      onOpenSpritePainter: (sprite) => {
        this.spritePainter.open(sprite);
      },
      onDeleteSprite: (sId) => {
        delete this.project.sprites[sId];
        this.renderAll();
        this.autoSave();
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
      },
      () => {
        this.deleteSelectedObject();
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

  addNewObject(preset = 'platform') {
    const count = (this.currentScene.objects || []).length + 1;
    const centerX = Math.round((this.renderer.viewportWidth / 2 - this.panX) / this.zoom);
    const centerY = Math.round((this.renderer.viewportHeight / 2 - this.panY) / this.zoom);

    let newObj = {
      id: 'obj_' + Date.now(),
      name: 'Game Object ' + count,
      tag: 'solid',
      layer: 1,
      x: centerX - 24,
      y: centerY - 24,
      width: 48,
      height: 48,
      color: '#58a6ff',
      shape: 'rect',
      physicsType: 'static',
      hasCollider: true,
      isSolid: true
    };

    if (preset === 'platform') {
      newObj.name = 'Platform Tile ' + count;
      newObj.width = 160;
      newObj.height = 24;
      newObj.color = '#21262d';
      newObj.shape = 'platform';
    } else if (preset === 'player') {
      newObj.name = 'Player Knight';
      newObj.tag = 'player';
      newObj.width = 34;
      newObj.height = 48;
      newObj.color = '#58a6ff';
      newObj.physicsType = 'dynamic';
      newObj.isSolid = false;
      newObj.behavior = 'player';
    } else if (preset === 'enemy') {
      newObj.name = 'Security Drone';
      newObj.tag = 'enemy';
      newObj.width = 32;
      newObj.height = 32;
      newObj.color = '#f85149';
      newObj.shape = 'circle';
      newObj.colliderShape = 'circle';
      newObj.behavior = 'patrol';
      newObj.isSolid = false;
    } else if (preset === 'coin') {
      newObj.name = 'Energy Crystal ' + count;
      newObj.tag = 'crystal';
      newObj.width = 24;
      newObj.height = 24;
      newObj.color = '#f1e05a';
      newObj.shape = 'coin';
      newObj.colliderShape = 'circle';
      newObj.isSolid = false;
      newObj.behavior = 'sine_hover';
    } else if (preset === 'spike') {
      newObj.name = 'Spike Hazard';
      newObj.tag = 'hazard';
      newObj.width = 96;
      newObj.height = 24;
      newObj.color = '#f85149';
      newObj.shape = 'spike';
      newObj.isSolid = false;
    } else if (preset === 'portal') {
      newObj.name = 'Warp Gate';
      newObj.tag = 'portal';
      newObj.width = 48;
      newObj.height = 100;
      newObj.color = '#3fb950';
      newObj.shape = 'portal';
      newObj.isSolid = false;
    } else if (preset === 'circle') {
      newObj.name = 'Orb Body';
      newObj.shape = 'circle';
      newObj.colliderShape = 'circle';
      newObj.color = '#a371f7';
    } else if (preset === 'text') {
      newObj.name = 'Text Label';
      newObj.shape = 'text';
      newObj.text = 'Welcome to GameSmith';
      newObj.width = 180;
      newObj.height = 30;
      newObj.color = '#f0f6fc';
      newObj.physicsType = 'none';
      newObj.hasCollider = false;
    }

    if (!this.currentScene.objects) this.currentScene.objects = [];
    this.currentScene.objects.push(newObj);
    this.selectedObjectId = newObj.id;
    this.selectedObject = newObj;
    this.renderAll();
    this.autoSave();
    this.showToast(`Added: ${newObj.name}`);
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
    this.showToast(`Duplicated: ${clone.name}`);
  }

  deleteSelectedObject() {
    if (!this.selectedObjectId) return;
    const idx = this.currentScene.objects.findIndex(o => o.id === this.selectedObjectId);
    if (idx !== -1) {
      const name = this.currentScene.objects[idx].name;
      this.currentScene.objects.splice(idx, 1);
      this.selectedObjectId = null;
      this.selectedObject = null;
      this.renderAll();
      this.autoSave();
      this.showToast(`Deleted: ${name}`);
    }
  }

  handleSaveSprite(sprite) {
    if (!this.project.sprites) this.project.sprites = {};
    this.project.sprites[sprite.id] = sprite;
    db.saveCustomSprite(sprite);
    this.renderAll();
    this.autoSave();
    this.showToast(`Sprite "${sprite.name}" Saved`);
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
      statsEl.innerHTML = `Project: <strong>${escapeHTML(this.project.name || 'Untitled')}</strong> &bull; Objects: <strong>${objCount}</strong> &bull; Rules: <strong>${ruleCount}</strong> &bull; Scenes: <strong>${this.project.scenes.length}</strong>`;
    }
  }

  showToast(message, duration = 2500) {
    let toast = document.getElementById('gamesmith-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'gamesmith-toast';
      toast.className = 'gamesmith-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  openProjectSettingsModal() {
    const modalContainer = document.getElementById('gamesmith-modal-container');
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="proj-settings-title" style="width: 480px;">
        <div class="modal-header">
          <div class="flex items-center gap-2">
            ${getIcon('settings', 'icon-sm text-primary')}
            <span class="font-bold text-sm" id="proj-settings-title">Project Settings</span>
          </div>
          <button class="btn-icon-xs btn-modal-close" aria-label="Close dialog">&times;</button>
        </div>
        <div class="modal-body p-4 flex flex-col gap-3">
          <div class="form-group">
            <label class="form-label" for="proj-name-input">Project Title</label>
            <input type="text" id="proj-name-input" class="form-control" value="${escapeHTML(this.project.name || '')}" />
          </div>
          <div class="form-group">
            <label class="form-label" for="proj-author-input">Creator / Studio Name</label>
            <input type="text" id="proj-author-input" class="form-control" value="${escapeHTML(this.project.author || 'Game Developer')}" />
          </div>
          <div class="form-group">
            <label class="form-label" for="proj-desc-input">Game Description</label>
            <textarea id="proj-desc-input" class="form-control" rows="3">${escapeHTML(this.project.description || '')}</textarea>
          </div>
        </div>
        <div class="modal-footer p-3 border-t flex justify-end gap-2">
          <button class="btn btn-sm btn-secondary btn-modal-close">Cancel</button>
          <button class="btn btn-sm btn-primary" id="btn-save-project-settings">Save Settings</button>
        </div>
      </div>
    `;

    modalContainer.classList.add('active');
    const close = () => modalContainer.classList.remove('active');

    modalContainer.querySelectorAll('.btn-modal-close, .modal-backdrop').forEach(b => b.addEventListener('click', close));

    modalContainer.querySelector('#btn-save-project-settings')?.addEventListener('click', () => {
      this.project.name = modalContainer.querySelector('#proj-name-input').value.trim() || 'Untitled Game';
      this.project.author = modalContainer.querySelector('#proj-author-input').value.trim() || 'Game Developer';
      this.project.description = modalContainer.querySelector('#proj-desc-input').value.trim();
      this.autoSave();
      this.updateStats();
      this.showToast('Project Settings Updated');
      close();
    });
  }

  openShortcutsModal() {
    const modalContainer = document.getElementById('gamesmith-modal-container');
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="shortcuts-title" style="width: 520px;">
        <div class="modal-header">
          <div class="flex items-center gap-2">
            ${getIcon('keyboard', 'icon-sm text-primary')}
            <span class="font-bold text-sm" id="shortcuts-title">Keyboard Shortcuts & Guide</span>
          </div>
          <button class="btn-icon-xs btn-modal-close" aria-label="Close dialog">&times;</button>
        </div>
        <div class="modal-body p-4 flex flex-col gap-3">
          <div class="grid grid-cols-2 gap-3 text-xs">
            <div class="card p-2">
              <div class="font-bold text-primary mb-1">Editor Controls</div>
              <div class="flex justify-between py-1 border-b"><span>Play / Stop Game</span><kbd class="badge badge-secondary">Ctrl + P</kbd></div>
              <div class="flex justify-between py-1 border-b"><span>Save Project</span><kbd class="badge badge-secondary">Ctrl + S</kbd></div>
              <div class="flex justify-between py-1 border-b"><span>Duplicate Object</span><kbd class="badge badge-secondary">Ctrl + D</kbd></div>
              <div class="flex justify-between py-1 border-b"><span>Delete Object</span><kbd class="badge badge-secondary">Delete / Backspace</kbd></div>
              <div class="flex justify-between py-1 border-b"><span>Toggle Grid</span><kbd class="badge badge-secondary">G</kbd></div>
              <div class="flex justify-between py-1"><span>Toggle Colliders</span><kbd class="badge badge-secondary">C</kbd></div>
            </div>
            <div class="card p-2">
              <div class="font-bold text-emerald mb-1">Gameplay Controls</div>
              <div class="flex justify-between py-1 border-b"><span>Move Left / Right</span><kbd class="badge badge-secondary">A / D or &larr; / &rarr;</kbd></div>
              <div class="flex justify-between py-1 border-b"><span>Jump / Double Jump</span><kbd class="badge badge-secondary">Space / W / &uarr;</kbd></div>
              <div class="flex justify-between py-1 border-b"><span>Action / Shoot</span><kbd class="badge badge-secondary">Space / J / Z</kbd></div>
              <div class="flex justify-between py-1 border-b"><span>Restart Scene</span><kbd class="badge badge-secondary">R</kbd></div>
              <div class="flex justify-between py-1"><span>Return to Editor</span><kbd class="badge badge-secondary">ESC</kbd></div>
            </div>
          </div>
          <div class="card p-2 text-xs text-muted">
            <strong>Mouse & Viewport:</strong> Middle click or Alt+drag to pan canvas. Mouse wheel to zoom in/out. Click and drag resize handles on selected objects to change width and height.
          </div>
        </div>
        <div class="modal-footer p-3 border-t flex justify-end">
          <button class="btn btn-sm btn-primary btn-modal-close">Got It</button>
        </div>
      </div>
    `;

    modalContainer.classList.add('active');
    const close = () => modalContainer.classList.remove('active');
    modalContainer.querySelectorAll('.btn-modal-close, .modal-backdrop').forEach(b => b.addEventListener('click', close));
  }

  exportStandaloneHTML() {
    const projectJson = JSON.stringify(this.project);
    const title = escapeHTML(this.project.name || 'GameSmith Game');

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body { background: #000; color: #fff; font-family: -apple-system, sans-serif; overflow: hidden; width: 100vw; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    #game-canvas { display: block; width: 100vw; height: 100vh; object-fit: contain; }
    .touch-pad { position: fixed; bottom: 20px; left: 20px; right: 20px; display: none; justify-content: space-between; z-index: 100; pointer-events: none; }
    .touch-btn { width: 56px; height: 56px; border-radius: 50%; background: rgba(255,255,255,0.25); border: 2px solid rgba(255,255,255,0.5); color: #fff; font-size: 20px; display: flex; align-items: center; justify-content: center; pointer-events: auto; }
    .touch-dpad { display: grid; grid-template-columns: repeat(3, 56px); gap: 6px; }
  </style>
</head>
<body>
  <canvas id="game-canvas"></canvas>
  <div class="touch-pad" id="touch-pad">
    <div class="touch-dpad">
      <div></div><button class="touch-btn" id="t-up">&uarr;</button><div></div>
      <button class="touch-btn" id="t-left">&larr;</button><div></div><button class="touch-btn" id="t-right">&rarr;</button>
      <div></div><button class="touch-btn" id="t-down">&darr;</button><div></div>
    </div>
    <div style="display: flex; gap: 14px; align-items: flex-end;">
      <button class="touch-btn" id="t-a" style="width: 64px; height: 64px; background: rgba(88,166,255,0.4);">A</button>
      <button class="touch-btn" id="t-b" style="width: 64px; height: 64px; background: rgba(63,185,80,0.4);">B</button>
    </div>
  </div>
  <script>
    const PROJECT_DATA = ${projectJson};
  </script>
  <script src="bundle.js"></script>
  <script>
    // Auto launch in standalone player
    window.addEventListener('DOMContentLoaded', () => {
      if (window.gameSmithApp) {
        window.gameSmithApp.loadProject(PROJECT_DATA);
        window.gameSmithApp.togglePlay();
      }
    });
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (this.project.name || 'game').toLowerCase().replace(/\s+/g, '_') + '_standalone.html';
    a.click();
    this.showToast('Exported Standalone Game HTML');
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
