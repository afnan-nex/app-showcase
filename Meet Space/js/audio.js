/**
 * MeetSpace - Web Audio Sound Engine
 * Synthesizes calm, professional audio chimes and cues using Web Audio API
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.volume = 0.5;
  }

  _initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setEnabled(val) {
    this.enabled = !!val;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  /**
   * Play a clean, subtle dual-tone chime when an agenda timer completes
   */
  playTimerChime() {
    if (!this.enabled) return;
    try {
      this._initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume * 0.4, now);
      masterGain.connect(this.ctx.destination);

      // Tone 1: E5 (659.25 Hz)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.exponentialRampToValueAtTime(0.5, now + 0.04);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
      osc1.connect(gain1);
      gain1.connect(masterGain);
      osc1.start(now);
      osc1.stop(now + 0.95);

      // Tone 2: B5 (987.77 Hz)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(987.77, now + 0.15);
      gain2.gain.setValueAtTime(0.001, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.6, now + 0.19);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      osc2.connect(gain2);
      gain2.connect(masterGain);
      osc2.start(now + 0.15);
      osc2.stop(now + 1.25);

      // Tone 3: E6 (1318.51 Hz) subtle shimmer
      const osc3 = this.ctx.createOscillator();
      const gain3 = this.ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(1318.51, now + 0.3);
      gain3.gain.setValueAtTime(0.001, now + 0.3);
      gain3.gain.exponentialRampToValueAtTime(0.4, now + 0.34);
      gain3.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
      osc3.connect(gain3);
      gain3.connect(masterGain);
      osc3.start(now + 0.3);
      osc3.stop(now + 1.55);
    } catch (e) {
      console.warn('Audio playback not allowed or failed:', e);
    }
  }

  /**
   * Play a brief notification pop / ping
   */
  playNotificationPing() {
    if (!this.enabled) return;
    try {
      this._initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.08);

      gain.gain.setValueAtTime(this.volume * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {
      // ignore
    }
  }

  /**
   * Play subtle click / advance sound
   */
  playClick() {
    if (!this.enabled) return;
    try {
      this._initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);

      gain.gain.setValueAtTime(this.volume * 0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {
      // ignore
    }
  }
}

const AudioService = new SoundEngine();
