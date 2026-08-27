/**
 * TimeGrid - Distraction-Free Focus Mode & Countdown Timer Component
 * Fullscreen immersive countdown with circular progress ring, synthesized harmonic chime,
 * quick interval presets, and active task scratchpad.
 */

import { getIcon, escapeHTML } from '../core/icons.js';

function playSynthesizedChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Major chord chime)
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.12 + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 1.25);
    });
  } catch (e) {
    // Audio autoplay blocked or unsupported
  }
}

export class FocusModeManager {
  constructor(container, onFinishBlock) {
    this.container = container;
    this.onFinishBlock = onFinishBlock;

    this.activeBlock = null;
    this.totalSeconds = 1500; // 25 min default
    this.remainingSeconds = 1500;
    this.isRunning = false;
    this.timerInterval = null;
    this.soundEnabled = true;
    this.keyListener = null;
  }

  startFocus(block) {
    this.activeBlock = block;
    const durMin = Math.max(5, block.endMinute - block.startMinute);
    this.totalSeconds = durMin * 60;
    this.remainingSeconds = this.totalSeconds;
    this.isRunning = true;

    this.render();
    this.container.classList.add('active');
    this.startInterval();
    this.bindKeyboardShortcuts();
  }

  close() {
    this.pause();
    this.container.classList.remove('active');
    this.unbindKeyboardShortcuts();
  }

  bindKeyboardShortcuts() {
    this.unbindKeyboardShortcuts();
    this.keyListener = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'Escape') {
        this.close();
        e.preventDefault();
      }
      if (e.key === ' ') {
        if (this.isRunning) this.pause();
        else this.resume();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', this.keyListener);
  }

  unbindKeyboardShortcuts() {
    if (this.keyListener) {
      window.removeEventListener('keydown', this.keyListener);
      this.keyListener = null;
    }
  }

  startInterval() {
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.isRunning && this.remainingSeconds > 0) {
        this.remainingSeconds--;
        this.updateDisplay();

        if (this.remainingSeconds <= 0) {
          this.pause();
          if (this.soundEnabled) playSynthesizedChime();
          
          setTimeout(() => {
            alert(`Great work! Focus block "${this.activeBlock?.title}" is complete.`);
            if (this.onFinishBlock && this.activeBlock) {
              this.onFinishBlock(this.activeBlock.id);
            }
          }, 300);
        }
      }
    }, 1000);
  }

  pause() {
    this.isRunning = false;
    this.updateControls();
  }

  resume() {
    this.isRunning = true;
    this.updateControls();
  }

  setDurationMinutes(minutes) {
    this.totalSeconds = minutes * 60;
    this.remainingSeconds = this.totalSeconds;
    this.updateDisplay();
  }

  addTime(minutes = 5) {
    this.remainingSeconds += minutes * 60;
    this.totalSeconds += minutes * 60;
    this.updateDisplay();
  }

  render() {
    if (!this.activeBlock) return;

    this.container.innerHTML = `
      <div class="focus-overlay-backdrop"></div>
      <div class="focus-overlay-content flex flex-col items-center justify-between p-6 text-center h-full max-w-lg mx-auto relative z-10 select-none">
        
        <!-- Top Navigation & Controls -->
        <div class="w-full flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="badge badge-primary font-bold">${escapeHTML(this.activeBlock.category || 'Focus')}</span>
            <span class="text-xs text-muted font-mono">${escapeHTML(this.activeBlock.priority || 'High')} Priority</span>
          </div>
          <div class="flex items-center gap-2">
            <button class="btn-icon-xs text-muted" id="btn-focus-toggle-sound" title="${this.soundEnabled ? 'Mute Sound' : 'Enable Sound'}">
              ${getIcon(this.soundEnabled ? 'volume2' : 'volumeX', 'icon-sm')}
            </button>
            <button class="btn-icon-xs text-muted btn-focus-close" title="Exit Focus Mode (Esc)">
              ${getIcon('close', 'icon-sm')}
            </button>
          </div>
        </div>

        <!-- Center Countdown Timer & Progress Ring -->
        <div class="focus-timer-center flex flex-col items-center justify-center my-auto w-full">
          <!-- Circular Progress Ring SVG -->
          <div class="relative flex items-center justify-center w-64 h-64">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" stroke="currentColor" stroke-width="4" class="text-subtle opacity-20" fill="transparent" />
              <circle id="focus-progress-circle" cx="50" cy="50" r="44" stroke="${this.activeBlock.color || '#38bdf8'}" stroke-width="4" stroke-linecap="round" fill="transparent" stroke-dasharray="276.46" stroke-dashoffset="0" style="transition: stroke-dashoffset 0.8s ease;" />
            </svg>

            <!-- Time Display Inside Ring -->
            <div class="absolute flex flex-col items-center">
              <span class="font-mono font-bold text-4xl text-primary" id="lbl-focus-time-left">${this.formatCountdown()}</span>
              <span class="text-xs text-muted mt-1 uppercase font-semibold tracking-wider">Remaining</span>
            </div>
          </div>

          <!-- Active Task Title & Notes -->
          <h2 class="text-lg font-bold text-primary mt-4 max-w-md">${escapeHTML(this.activeBlock.title)}</h2>
          ${this.activeBlock.notes ? `<p class="text-xs text-muted mt-1 max-w-sm font-sans">${escapeHTML(this.activeBlock.notes)}</p>` : ''}

          <!-- Quick Preset Duration Pills -->
          <div class="flex items-center gap-1.5 mt-4">
            <button class="btn btn-xs btn-secondary btn-set-focus-dur" data-min="25">25m</button>
            <button class="btn btn-xs btn-secondary btn-set-focus-dur" data-min="50">50m</button>
            <button class="btn btn-xs btn-secondary btn-set-focus-dur" data-min="90">90m</button>
            <button class="btn btn-xs btn-secondary" id="btn-focus-add-5">+5m</button>
          </div>
        </div>

        <!-- Bottom Controls -->
        <div class="w-full flex flex-col items-center gap-2">
          <div class="flex items-center justify-center gap-3">
            <button class="btn btn-primary px-8 font-bold" id="btn-focus-toggle-play">
              <span id="lbl-focus-play-btn">${this.isRunning ? 'Pause' : 'Resume'}</span>
            </button>

            <button class="btn btn-secondary" id="btn-focus-finish">Complete</button>
          </div>
          <span class="text-xs text-muted font-mono" style="font-size: 10px;">Press <strong>Space</strong> to pause/resume &bull; <strong>Esc</strong> to exit</span>
        </div>

      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    this.container.querySelector('.btn-focus-close')?.addEventListener('click', () => this.close());
    this.container.querySelector('#btn-focus-add-5')?.addEventListener('click', () => this.addTime(5));

    this.container.querySelectorAll('.btn-set-focus-dur').forEach(btn => {
      btn.addEventListener('click', () => {
        const min = parseInt(btn.dataset.min, 10);
        if (min) this.setDurationMinutes(min);
      });
    });

    this.container.querySelector('#btn-focus-toggle-sound')?.addEventListener('click', () => {
      this.soundEnabled = !this.soundEnabled;
      const btn = this.container.querySelector('#btn-focus-toggle-sound');
      if (btn) {
        btn.innerHTML = getIcon(this.soundEnabled ? 'volume2' : 'volumeX', 'icon-sm');
        btn.title = this.soundEnabled ? 'Mute Sound' : 'Enable Sound';
      }
    });

    this.container.querySelector('#btn-focus-toggle-play')?.addEventListener('click', () => {
      if (this.isRunning) this.pause();
      else this.resume();
    });

    this.container.querySelector('#btn-focus-finish')?.addEventListener('click', () => {
      if (confirm('Mark this focus block as completed?')) {
        this.close();
        if (this.soundEnabled) playSynthesizedChime();
        if (this.onFinishBlock && this.activeBlock) {
          this.onFinishBlock(this.activeBlock.id);
        }
      }
    });
  }

  updateDisplay() {
    const lbl = this.container.querySelector('#lbl-focus-time-left');
    if (lbl) lbl.textContent = this.formatCountdown();

    const circle = this.container.querySelector('#focus-progress-circle');
    if (circle && this.totalSeconds > 0) {
      const circumference = 2 * Math.PI * 44; // 276.46
      const fraction = Math.max(0, this.remainingSeconds / this.totalSeconds);
      const offset = circumference * (1 - fraction);
      circle.style.strokeDashoffset = offset;
    }
  }

  updateControls() {
    const lbl = this.container.querySelector('#lbl-focus-play-btn');
    if (lbl) lbl.textContent = this.isRunning ? 'Pause' : 'Resume';
  }

  formatCountdown() {
    const m = Math.floor(this.remainingSeconds / 60);
    const s = this.remainingSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}
