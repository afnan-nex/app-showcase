/**
 * FlowPilot Toast Notification System
 */

class ToastManager {
  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
  }

  show(message, title = 'Notification', type = 'info', duration = 3500) {
    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;

    const icon = type === 'success' ? '✓' : (type === 'error' ? '✕' : (type === 'warning' ? '⚠️' : 'ℹ️'));

    toast.innerHTML = `
      <div style="font-size:14px; font-weight:bold;">${icon}</div>
      <div class="toast-content">
        <div class="toast-title">${this.escape(title)}</div>
        <div class="toast-message">${this.escape(message)}</div>
      </div>
      <button class="btn btn-ghost btn-sm btn-icon" style="margin-left:auto; opacity:0.6;">✕</button>
    `;

    toast.querySelector('button').addEventListener('click', () => {
      this.dismiss(toast);
    });

    this.container.appendChild(toast);

    // Trigger enter animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(toast);
      }, duration);
    }
  }

  success(message, title = 'Success') {
    this.show(message, title, 'success');
  }

  error(message, title = 'Error') {
    this.show(message, title, 'error', 4500);
  }

  info(message, title = 'Info') {
    this.show(message, title, 'info');
  }

  warning(message, title = 'Warning') {
    this.show(message, title, 'warning', 4000);
  }

  dismiss(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 250);
  }

  escape(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}

window.flowToast = new ToastManager();
