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

export const audioSynth = new SoundSynthesizer();
export default audioSynth;
