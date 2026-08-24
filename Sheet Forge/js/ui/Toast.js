/**
 * SheetForge - Toast Notification System
 * Non-blocking, accessible, professional toast alerts for spreadsheet actions and errors
 */
export class Toast {
    static init() {
        if (!document.getElementById('sfToastContainer')) {
            const container = document.createElement('div');
            container.id = 'sfToastContainer';
            container.className = 'sf-toast-container';
            container.setAttribute('role', 'status');
            container.setAttribute('aria-live', 'polite');
            document.body.appendChild(container);
        }
    }

    static show(message, type = 'info', duration = 3000) {
        this.init();
        const container = document.getElementById('sfToastContainer');

        const toast = document.createElement('div');
        toast.className = `sf-toast sf-toast-${type}`;

        let icon = 'ℹ️';
        if (type === 'success') icon = '✓';
        if (type === 'error') icon = '✕';
        if (type === 'warning') icon = '⚠️';

        toast.innerHTML = `
            <span class="sf-toast-icon">${icon}</span>
            <span class="sf-toast-message">${message}</span>
        `;

        container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('sf-toast-visible');
        });

        // Remove after duration
        setTimeout(() => {
            toast.classList.remove('sf-toast-visible');
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 200);
        }, duration);
    }

    static success(msg, duration = 2500) {
        this.show(msg, 'success', duration);
    }

    static error(msg, duration = 3500) {
        this.show(msg, 'error', duration);
    }

    static warning(msg, duration = 3000) {
        this.show(msg, 'warning', duration);
    }

    static info(msg, duration = 2500) {
        this.show(msg, 'info', duration);
    }
}
