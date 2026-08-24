/**
 * NoteSpace - Toast Notification System
 * Non-intrusive, accessible notifications for user feedback and asynchronous actions.
 */

import { Icons } from '../icons/icons.js';
import { createElement } from './dom.js';

class ToastManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    this.container = createElement('div', 'ns-toast-container');
    document.body.appendChild(this.container);
  }

  show(message, type = 'info', duration = 3000) {
    const toast = createElement('div', `ns-toast ns-toast-${type}`);

    let icon = Icons.sparkles;
    if (type === 'success') icon = Icons.check;
    if (type === 'error') icon = Icons.alertCircle;
    if (type === 'trash') icon = Icons.trash;

    toast.innerHTML = `
      <span class="ns-toast-icon">${icon}</span>
      <span class="ns-toast-msg">${message}</span>
      <button class="ns-toast-close" aria-label="Dismiss notification">${Icons.x}</button>
    `;

    const closeBtn = toast.querySelector('.ns-toast-close');
    const dismiss = () => {
      toast.classList.add('is-dismissing');
      setTimeout(() => toast.remove(), 200);
    };

    closeBtn.addEventListener('click', dismiss);
    this.container.appendChild(toast);

    if (duration > 0) {
      setTimeout(dismiss, duration);
    }
  }

  success(msg, duration = 3000) {
    this.show(msg, 'success', duration);
  }

  error(msg, duration = 4000) {
    this.show(msg, 'error', duration);
  }

  info(msg, duration = 3000) {
    this.show(msg, 'info', duration);
  }
}

export const toast = new ToastManager();
