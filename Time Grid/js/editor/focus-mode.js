/**
 * TimeGrid - Distraction-Free Focus Mode & Countdown Timer Component
 * Fullscreen immersive countdown with circular progress ring, audio cues, and active task focus.
 */

import { getIcon, escapeHTML } from '../core/icons.js';

export class FocusModeManager {
  constructor(container, onFinishBlock) {
    this.container = container;
    this.onFinishBlock = onFinishBlock;

    this.activeBlock = null;
    this.totalSeconds = 1500; // 25 min default
    this.remainingSeconds = 1500;
    this.isRunning = false;
    this.timerInterval = null;
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
  }

  close() {
    this.pause();
    this.container.classList.remove('active');
  }

  startInterval() {
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.isRunning && this.remainingSeconds > 0) {
        this.remainingSeconds--;
        this.updateDisplay();

        if (this.remainingSeconds <= 0) {
          this.pause();
          alert(`Focus block "${this.activeBlock?.title}" completed!`);
          if (this.onFinishBlock && this.activeBlock) {
            this.onFinishBlock(this.activeBlock.id);
          }
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

  addTime(minutes = 5) {
    this.remainingSeconds += minutes * 60;
    this.totalSeconds += minutes * 60;
    this.updateDisplay();
  }

  render() {
    if (!this.activeBlock) return;

    this.container.innerHTML = `
      <div class="focus-overlay-backdrop"></div>
      <div class="focus-overlay-content flex flex-col items-center justify-between p-8 text-center h-full max-w-lg mx-auto relative z-10">
        
        <!-- Top Bar -->
        <div class="w-full flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="badge badge-primary font-bold">${escapeHTML(this.activeBlock.category || 'Focus')}</span>
            <span class="text-xs text-muted font-mono">${escapeHTML(this.activeBlock.priority || 'High')} Priority</span>
          </div>
          <button class="btn-icon-xs text-muted btn-focus-close" title="Exit Focus Mode">&times;</button>
        </div>

        <!-- Center Countdown Timer & Progress Ring -->
        <div class="focus-timer-center flex flex-col items-center justify-center my-auto">
          <!-- Circular Progress Ring SVG -->
          <div class="relative flex items-center justify-center w-64 h-64">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" stroke="currentColor" stroke-width="4" class="text-subtle opacity-20" fill="transparent" />
              <circle id="focus-progress-circle" cx="50" cy="50" r="44" stroke="${this.activeBlock.color || '#38bdf8'}" stroke-width="4" stroke-linecap="round" fill="transparent" stroke-dasharray="276.46" stroke-dashoffset="0" />
            </svg>

            <!-- Time Display Inside Ring -->
            <div class="absolute flex flex-col items-center">
              <span class="font-mono font-bold text-4xl text-primary" id="lbl-focus-time-left">${this.formatCountdown()}</span>
              <span class="text-xs text-muted mt-1 uppercase font-semibold">Remaining</span>
            </div>
          </div>

          <!-- Active Task Title & Notes -->
          <h2 class="text-lg font-bold text-primary mt-4 max-w-md">${escapeHTML(this.activeBlock.title)}</h2>
          ${this.activeBlock.notes ? `<p class="text-xs text-muted mt-1 max-w-sm">${escapeHTML(this.activeBlock.notes)}</p>` : ''}
        </div>

        <!-- Bottom Controls -->
        <div class="w-full flex items-center justify-center gap-3">
          <button class="btn btn-sm btn-secondary" id="btn-focus-add-5">+5 min</button>
          
          <button class="btn btn-primary px-6" id="btn-focus-toggle-play">
            <span id="lbl-focus-play-btn">${this.isRunning ? 'Pause' : 'Resume'}</span>
          </button>

          <button class="btn btn-sm btn-secondary" id="btn-focus-finish">Complete</button>
        </div>

      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    this.container.querySelector('.btn-focus-close')?.addEventListener('click', () => this.close());
    this.container.querySelector('#btn-focus-add-5')?.addEventListener('click', () => this.addTime(5));

    this.container.querySelector('#btn-focus-toggle-play')?.addEventListener('click', () => {
      if (this.isRunning) this.pause();
      else this.resume();
    });

    this.container.querySelector('#btn-focus-finish')?.addEventListener('click', () => {
      if (confirm('Mark this focus block as completed?')) {
        this.close();
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
