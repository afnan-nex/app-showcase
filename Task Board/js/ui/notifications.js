/**
 * Toast Notification Manager with Undo Support
 */

window.Notifications = {
  container: null,

  init() {
    this.container = document.getElementById('toastContainer');
  },

  show(message, type = 'info', options = {}) {
    if (!this.container) this.init();
    if (!this.container) return;

    const { duration = 4000, hasUndo = false, onUndo = null } = options;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconName = 'check';
    if (type === 'error') iconName = 'alert_triangle';
    else if (type === 'warning') iconName = 'alert_triangle';
    else if (type === 'info') iconName = 'clock';

    const iconSvg = window.Icons.get(iconName, 18, `toast-icon ${type}`);

    toast.innerHTML = `
      <div class="toast-content">
        ${iconSvg}
        <span class="toast-message">${window.Utils.escapeHtml(message)}</span>
      </div>
      <div class="toast-actions">
        ${hasUndo ? `<button class="toast-undo-btn">Undo</button>` : ''}
        <button class="icon-btn-sm toast-close-btn" aria-label="Dismiss">
          ${window.Icons.get('x', 14)}
        </button>
      </div>
    `;

    // Undo handler
    if (hasUndo) {
      const undoBtn = toast.querySelector('.toast-undo-btn');
      undoBtn.addEventListener('click', async () => {
        if (onUndo) {
          await onUndo();
        } else {
          await window.State.undo();
        }
        this.dismiss(toast);
      });
    }

    // Dismiss handler
    const closeBtn = toast.querySelector('.toast-close-btn');
    closeBtn.addEventListener('click', () => this.dismiss(toast));

    this.container.appendChild(toast);

    // Auto dismiss timer
    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(toast);
      }, duration);
    }

    return toast;
  },

  dismiss(toast) {
    if (!toast || !toast.parentNode) return;
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 200);
  },

  success(msg, options) {
    return this.show(msg, 'success', options);
  },

  error(msg, options) {
    return this.show(msg, 'error', options);
  },

  warning(msg, options) {
    return this.show(msg, 'warning', options);
  },

  info(msg, options) {
    return this.show(msg, 'info', options);
  }
};
