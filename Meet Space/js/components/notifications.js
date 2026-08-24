/**
 * MeetSpace - Notifications & Toast Manager
 * Handles toast messages, simulated meeting reminders, audio cues, and topbar popover dropdown
 */

class NotificationManager {
  constructor() {
    this.container = null;
    this.notifications = [];
    this.reminderInterval = null;
    this.unreadCount = 0;
    this.popoverOpen = false;
  }

  init() {
    this.container = document.getElementById('toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      document.body.appendChild(this.container);
    }

    this._setupPopover();
    this._startReminderChecker();
  }

  _setupPopover() {
    let popover = document.getElementById('notif-popover');
    if (!popover) {
      popover = document.createElement('div');
      popover.id = 'notif-popover';
      popover.className = 'notif-popover';
      popover.setAttribute('role', 'region');
      popover.setAttribute('aria-label', 'Notifications Center');
      
      const topbarRight = document.querySelector('.topbar-right');
      if (topbarRight) {
        topbarRight.appendChild(popover);
      } else {
        document.body.appendChild(popover);
      }
    }

    // Close popover when clicking outside
    document.addEventListener('click', (e) => {
      const bellBtn = document.getElementById('topbar-bell-btn');
      if (popover && this.popoverOpen) {
        if (!popover.contains(e.target) && !bellBtn.contains(e.target)) {
          this.closePopover();
        }
      }
    });
  }

  togglePopover() {
    if (this.popoverOpen) this.closePopover();
    else this.openPopover();
  }

  openPopover() {
    const popover = document.getElementById('notif-popover');
    if (!popover) return;

    this.markAllAsRead();
    this._renderPopoverContent(popover);
    popover.classList.add('open');
    this.popoverOpen = true;
  }

  closePopover() {
    const popover = document.getElementById('notif-popover');
    if (!popover) return;
    popover.classList.remove('open');
    this.popoverOpen = false;
  }

  _renderPopoverContent(popover) {
    if (this.notifications.length === 0) {
      popover.innerHTML = `
        <div class="notif-popover-header">
          <span>Notifications</span>
          <span class="text-dim" style="font-size:0.75rem;">0 new</span>
        </div>
        <div style="padding: 32px 16px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
          <p>No recent alerts or reminders.</p>
        </div>
      `;
      return;
    }

    popover.innerHTML = `
      <div class="notif-popover-header">
        <span>Notifications & Alerts</span>
        <button class="btn btn-ghost btn-sm text-dim" onclick="window.Notifier.clearAll()" style="font-size:0.75rem;">Clear All</button>
      </div>
      <div class="notif-popover-list">
        ${this.notifications.slice(0, 8).map(n => `
          <div class="notif-item">
            <div class="flex items-center justify-between">
              <strong style="color:var(--text-primary); font-size:0.8rem;">${this._escape(n.title)}</strong>
              <span class="text-dim" style="font-size:0.7rem;">${n.time}</span>
            </div>
            ${n.message ? `<p class="text-muted" style="font-size:0.75rem; line-height:1.3;">${this._escape(n.message)}</p>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  clearAll() {
    this.notifications = [];
    this.unreadCount = 0;
    this._updateBellBadge();
    const popover = document.getElementById('notif-popover');
    if (popover) this._renderPopoverContent(popover);
  }

  show(title, message, type = 'info', durationMs = 4000) {
    if (!this.container) this.init();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = Icons.bell(18);
    if (type === 'success') iconSvg = Icons.check(18);
    else if (type === 'danger' || type === 'error') iconSvg = Icons.x(18);
    else if (type === 'warning') iconSvg = Icons.clock(18);

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-content">
        <div class="toast-title">${this._escape(title)}</div>
        ${message ? `<div class="toast-message">${this._escape(message)}</div>` : ''}
      </div>
      <button class="toast-close" title="Dismiss">${Icons.x(14)}</button>
    `;

    // Audio cue
    if (type === 'success') {
      AudioService.playClick();
    } else if (type === 'info' || type === 'warning') {
      AudioService.playNotificationPing();
    }

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => this._removeToast(toast));

    this.container.appendChild(toast);

    if (durationMs > 0) {
      setTimeout(() => {
        this._removeToast(toast);
      }, durationMs);
    }

    // Add to history
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    });
    this.unreadCount++;
    this._updateBellBadge();
  }

  _removeToast(toast) {
    if (!toast || !toast.parentNode) return;
    toast.classList.add('toast-hiding');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 180);
  }

  _updateBellBadge() {
    const badge = document.getElementById('notif-badge');
    if (badge) {
      if (this.unreadCount > 0) {
        badge.textContent = this.unreadCount > 9 ? '9+' : this.unreadCount;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.unreadCount = 0;
    this._updateBellBadge();
  }

  _startReminderChecker() {
    if (this.reminderInterval) clearInterval(this.reminderInterval);

    this.reminderInterval = setInterval(() => {
      this._checkUpcomingMeetings();
    }, 60000);

    setTimeout(() => this._checkUpcomingMeetings(), 2500);
  }

  _checkUpcomingMeetings() {
    if (!Store.initialized) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const todayMeetings = Store.meetings.filter(m => m.date === todayStr && m.status !== 'completed');

    todayMeetings.forEach(m => {
      if (!m.startTime) return;
      const [h, min] = m.startTime.split(':').map(Number);
      const meetingStartMinutes = h * 60 + min;
      const diff = meetingStartMinutes - currentMinutes;

      if (diff >= 0 && diff <= 10 && !m._reminderFired) {
        m._reminderFired = true;
        this.show(
          `Upcoming Meeting: ${m.title}`,
          `Scheduled for ${m.startTime} (in ${diff === 0 ? 'now' : diff + ' min'}). Click to join live.`,
          'warning',
          8000
        );
      }
    });
  }

  _escape(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

const Notifier = new NotificationManager();
window.Notifier = Notifier;
