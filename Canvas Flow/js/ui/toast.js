/* ==========================================================================
   CANVASFLOW — Toast Notification System
   ========================================================================== */

import { eventBus } from '../state/event-bus.js';
import { ICONS } from '../utils/icons.js';

export class ToastManager {
  constructor() {
    this.container = document.getElementById('toast-container');
    this._setupListeners();
  }

  _setupListeners() {
    eventBus.on('toast:show', ({ message, type = 'info', duration = 3200 }) => {
      this.show(message, type, duration);
    });
  }

  show(message, type = 'info', duration = 3200) {
    if (!this.container) return;

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;

    let iconHtml = ICONS.info;
    if (type === 'success') iconHtml = ICONS.check;
    else if (type === 'error') iconHtml = ICONS.error;

    toast.innerHTML = `
      <span class="toast-icon">${iconHtml}</span>
      <span class="toast-message">${message}</span>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'all 200ms ease';
      setTimeout(() => {
        if (toast.parentElement) {
          this.container.removeChild(toast);
        }
      }, 200);
    }, duration);
  }
}
