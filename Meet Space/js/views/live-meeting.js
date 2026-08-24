/**
 * MeetSpace - Fullscreen Live Meeting Mode Runner
 * Distraction-free facilitator environment with prominent agenda timer, auto-advance,
 * audio chime alerts, next topic teaser, and side dock for live notes, action items, and decisions.
 */

class LiveMeetingRunner {
  constructor() {
    this.meeting = null;
    this.currentAgendaIndex = 0;
    this.timerMode = 'countdown'; // 'countdown' or 'stopwatch'
    this.secondsRemaining = 0;
    this.elapsedSeconds = 0;
    this.totalMeetingElapsedSeconds = 0;
    this.isRunning = false;
    this.timerInterval = null;
    this.totalMeetingInterval = null;
    this.overlay = null;
    this.activeDockTab = 'notes'; // 'notes', 'actions', 'decisions'
    this.notesDebounceTimer = null;
  }

  init() {
    this._renderOverlay();
    this._bindKeyboardFacilitator();
  }

  _renderOverlay() {
    let overlay = document.getElementById('live-meeting-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'live-meeting-overlay';
      overlay.className = 'live-meeting-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Live Facilitator Mode');
      document.body.appendChild(overlay);
    }
    this.overlay = overlay;
  }

  _bindKeyboardFacilitator() {
    window.addEventListener('keydown', (e) => {
      if (!this.overlay || !this.overlay.classList.contains('active')) return;

      // Don't intercept if typing in editable notes or input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable) {
        if (e.key === 'Escape') {
          e.target.blur();
        }
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        this.togglePlayPause();
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        this.nextAgendaItem();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        this.prevAgendaItem();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        this.addMinutes(1);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.exit();
      }
    });
  }

  start(meetingId, startingAgendaIndex = 0) {
    this.meeting = Store.getMeeting(meetingId);
    if (!this.meeting) {
      Notifier.show('Error', 'Meeting not found.', 'danger');
      return;
    }

    if (this.meeting.status !== 'completed') {
      Store.updateMeeting({ ...this.meeting, status: 'in-progress' });
    }

    this.currentAgendaIndex = startingAgendaIndex;
    this.isRunning = false;
    this.totalMeetingElapsedSeconds = 0;

    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    this._setupCurrentAgendaItem();
    this._render();
    this.startTimer();

    // Start meeting-wide elapsed timer
    if (this.totalMeetingInterval) clearInterval(this.totalMeetingInterval);
    this.totalMeetingInterval = setInterval(() => {
      this.totalMeetingElapsedSeconds++;
      const totalEl = document.getElementById('live-total-elapsed');
      if (totalEl) {
        totalEl.textContent = this._formatSeconds(this.totalMeetingElapsedSeconds);
      }
    }, 1000);

    Notifier.show('Live Mode Active', `Facilitating: "${this.meeting.title}" (Press ESC to return)`, 'info', 3000);
  }

  _setupCurrentAgendaItem() {
    const agenda = this.meeting.agenda || [];
    if (agenda.length === 0) {
      this.secondsRemaining = 10 * 60;
      this.elapsedSeconds = 0;
      return;
    }

    const current = agenda[this.currentAgendaIndex] || agenda[0];
    this.secondsRemaining = (current.duration || 10) * 60;
    this.elapsedSeconds = 0;
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.isRunning = true;

    this.timerInterval = setInterval(() => {
      if (this.timerMode === 'countdown') {
        if (this.secondsRemaining > 0) {
          this.secondsRemaining--;
          this.elapsedSeconds++;
        } else {
          this.secondsRemaining--;
          this.elapsedSeconds++;

          if (this.secondsRemaining === -1) {
            AudioService.playTimerChime();
            Notifier.show('Section Time Finished', 'Section timer reached 0:00.', 'warning');

            const autoAdvance = Store.getSetting('autoAdvanceAgenda', true);
            if (autoAdvance) {
              setTimeout(() => {
                if (this.overlay.classList.contains('active')) {
                  this.nextAgendaItem();
                }
              }, 1800);
            }
          }
        }
      } else {
        this.elapsedSeconds++;
      }

      this._updateTimerDisplay();
    }, 1000);

    this._updatePlayPauseButton();
  }

  pauseTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.isRunning = false;
    this._updatePlayPauseButton();
  }

  togglePlayPause() {
    if (this.isRunning) this.pauseTimer();
    else this.startTimer();
  }

  addMinutes(mins) {
    this.secondsRemaining += mins * 60;
    this._updateTimerDisplay();
    Notifier.show('Timer Adjusted', `+${mins} minute added to current topic`, 'info', 2000);
  }

  nextAgendaItem() {
    const agenda = this.meeting.agenda || [];
    if (this.currentAgendaIndex < agenda.length - 1) {
      if (agenda[this.currentAgendaIndex]) {
        agenda[this.currentAgendaIndex].completed = true;
        Store.updateMeeting(this.meeting);
      }

      this.currentAgendaIndex++;
      this._setupCurrentAgendaItem();
      AudioService.playClick();
      this._render();
      if (this.isRunning) this.startTimer();
    } else {
      if (agenda[this.currentAgendaIndex]) {
        agenda[this.currentAgendaIndex].completed = true;
        Store.updateMeeting(this.meeting);
      }
      AudioService.playTimerChime();
      Notifier.show('Agenda Concluded', 'All planned agenda topics have finished.', 'success', 5000);
      this._render();
    }
  }

  prevAgendaItem() {
    if (this.currentAgendaIndex > 0) {
      this.currentAgendaIndex--;
      this._setupCurrentAgendaItem();
      AudioService.playClick();
      this._render();
      if (this.isRunning) this.startTimer();
    }
  }

  toggleTimerMode() {
    this.timerMode = this.timerMode === 'countdown' ? 'stopwatch' : 'countdown';
    this._render();
  }

  exit() {
    this.pauseTimer();
    if (this.totalMeetingInterval) clearInterval(this.totalMeetingInterval);
    this.overlay.classList.remove('active');
    document.body.style.overflow = '';

    if (window.MeetingDetailView && window.MeetingDetailView.currentMeetingId === this.meeting.id) {
      window.MeetingDetailView.render(document.getElementById('main-content-view'), { id: this.meeting.id });
    }
  }

  async finishMeeting() {
    if (confirm('Mark this meeting as completed and generate final minutes?')) {
      await Store.updateMeeting({ ...this.meeting, status: 'completed' });
      Notifier.show('Meeting Completed', 'Session concluded. Minutes ready for export.', 'success');
      this.exit();
      AppRouter.navigate(`/meeting/${this.meeting.id}`);
    }
  }

  _render() {
    const agenda = this.meeting.agenda || [];
    const currentItem = agenda[this.currentAgendaIndex] || { title: 'Open Discussion', duration: 15 };
    const upcomingItem = agenda[this.currentAgendaIndex + 1] || null;

    const totalAgendaCount = agenda.length;
    const progressPercent = totalAgendaCount > 0 ? Math.round(((this.currentAgendaIndex) / totalAgendaCount) * 100) : 0;

    this.overlay.innerHTML = `
      <!-- Live Top Bar -->
      <div class="live-topbar">
        <div class="live-meeting-title-badge">
          <div class="live-indicator">
            <span class="live-indicator-dot"></span>
            <span>LIVE FACILITATOR</span>
          </div>
          <span style="font-weight: 600; font-size: 0.95rem; color: #ffffff;">${this._escape(this.meeting.title)}</span>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2" style="font-family:var(--font-mono); font-size:0.85rem; color:var(--text-muted);">
            <span>Session:</span>
            <strong id="live-total-elapsed" style="color:#ffffff;">${this._formatSeconds(this.totalMeetingElapsedSeconds)}</strong>
          </div>

          <button class="btn btn-secondary btn-sm" onclick="window.LiveMeetingRunner.toggleTimerMode()">
            ${this.timerMode === 'countdown' ? 'Switch to Stopwatch' : 'Switch to Countdown'}
          </button>
          <button class="btn btn-secondary btn-sm" onclick="window.ShortcutsHelper_Singleton.open()">
            ${Icons.helpCircle(13)} Hotkeys (?)
          </button>
          <button class="btn btn-danger btn-sm" onclick="window.LiveMeetingRunner.finishMeeting()">
            ${Icons.check(13)} Finish Meeting
          </button>
          <button class="btn btn-ghost btn-sm btn-icon-only text-dim" onclick="window.LiveMeetingRunner.exit()" title="Exit Live Mode (ESC)">
            ${Icons.x(18)}
          </button>
        </div>
      </div>

      <!-- Live Body Split Layout -->
      <div class="live-body-layout">
        <!-- Left Focus Zone: Prominent Agenda Countdown Timer -->
        <div class="live-focus-zone">
          <div class="live-agenda-tracker">
            <span>Topic <strong>${this.currentAgendaIndex + 1}</strong> of <strong>${Math.max(1, totalAgendaCount)}</strong></span>
            <span>•</span>
            <span>${progressPercent}% of topics completed</span>
          </div>

          <!-- Section Progress Bar -->
          <div class="progress-bar-wrap" style="max-width: 380px; margin-bottom: 20px; height: 4px;">
            <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
          </div>

          <h2 class="live-current-topic">${this._escape(currentItem.title)}</h2>
          ${currentItem.presenter ? `<p style="font-size:0.875rem; color:var(--text-muted); margin-bottom:16px;">Presenter: <strong style="color:var(--text-primary);">${this._escape(currentItem.presenter)}</strong></p>` : ''}

          <!-- Big Prominent Timer Display -->
          <div class="live-timer-hero ${this.secondsRemaining < 0 ? 'overtime' : ''}" id="live-timer-display">
            ${this.timerMode === 'countdown' ? this._formatSeconds(this.secondsRemaining) : this._formatSeconds(this.elapsedSeconds)}
          </div>
          <div style="font-size:0.775rem; color:var(--text-muted);" id="live-timer-subtitle">
            ${this.timerMode === 'countdown' ? (this.secondsRemaining < 0 ? 'OVERTIME — PLEASE WRAP UP TOPIC' : 'Time Remaining for this Topic') : 'Elapsed on this Topic'}
          </div>

          <!-- Facilitator Controls Row -->
          <div class="live-controls-row">
            <button class="btn btn-secondary btn-lg" onclick="window.LiveMeetingRunner.prevAgendaItem()" ${this.currentAgendaIndex === 0 ? 'disabled' : ''} title="Previous Topic (P)">
              ${Icons.skipBack(16)} Prev
            </button>

            <button class="btn btn-primary btn-lg" id="live-play-btn" onclick="window.LiveMeetingRunner.togglePlayPause()" title="Play/Pause (Space)" style="min-width: 130px;">
              ${this.isRunning ? Icons.pause(16) + ' Pause' : Icons.play(16) + ' Resume'}
            </button>

            <button class="btn btn-secondary btn-lg" onclick="window.LiveMeetingRunner.addMinutes(1)" title="Add +1 Minute (+)">
              +1m
            </button>
            <button class="btn btn-secondary btn-lg" onclick="window.LiveMeetingRunner.addMinutes(5)" title="Add +5 Minutes">
              +5m
            </button>

            <button class="btn btn-secondary btn-lg" onclick="window.LiveMeetingRunner.nextAgendaItem()" title="Next Topic (N)">
              Next ${Icons.skipForward(16)}
            </button>
          </div>

          <!-- Upcoming Topic Teaser -->
          ${upcomingItem ? `
            <div class="live-upcoming-preview">
              <span class="text-muted">Up Next:</span>
              <strong style="color:#ffffff;">${this._escape(upcomingItem.title)}</strong>
              <span class="badge badge-tag">${upcomingItem.duration}m</span>
            </div>
          ` : `
            <div class="live-upcoming-preview">
              <span class="text-muted">Final topic in this agenda</span>
            </div>
          `}
        </div>

        <!-- Right Side Panel: Live Notes, Action Capture, and Decision Logger -->
        <div class="live-dock-panel">
          <div class="live-dock-nav">
            <button class="tab-btn ${this.activeDockTab === 'notes' ? 'active' : ''}" onclick="window.LiveMeetingRunner.setDockTab('notes')">
              ${Icons.notes(14)} Live Notes
            </button>
            <button class="tab-btn ${this.activeDockTab === 'actions' ? 'active' : ''}" onclick="window.LiveMeetingRunner.setDockTab('actions')">
              ${Icons.checkSquare(14)} Actions (${(this.meeting.actionItems || []).length})
            </button>
            <button class="tab-btn ${this.activeDockTab === 'decisions' ? 'active' : ''}" onclick="window.LiveMeetingRunner.setDockTab('decisions')">
              ${Icons.decision(14)} Decisions (${(this.meeting.decisions || []).length})
            </button>
          </div>

          <div class="live-dock-content">
            ${this._renderDockTabContent()}
          </div>
        </div>
      </div>
    `;

    if (this.activeDockTab === 'notes') {
      const liveNotesEditable = this.overlay.querySelector('#live-notes-editable');
      if (liveNotesEditable) {
        liveNotesEditable.addEventListener('input', () => {
          clearTimeout(this.notesDebounceTimer);
          this.notesDebounceTimer = setTimeout(async () => {
            await Store.updateNotes(this.meeting.id, liveNotesEditable.innerHTML);
          }, 600);
        });
      }
    }
  }

  _renderDockTabContent() {
    if (this.activeDockTab === 'notes') {
      return `
        <div class="flex-col gap-2" style="height: 100%;">
          <div class="flex items-center justify-between" style="font-size:0.75rem; color:var(--text-muted);">
            <span>Collaborative Notes (Continuous Autosave)</span>
          </div>
          <div class="notes-content-editable" id="live-notes-editable" contenteditable="true" style="background:var(--live-bg); color:var(--live-text); border:1px solid var(--live-border); border-radius:var(--radius-sm); height:100%; min-height:380px; padding:14px; font-size:0.875rem;">
            ${this.meeting.notes || ''}
          </div>
        </div>
      `;
    }

    if (this.activeDockTab === 'actions') {
      const actions = this.meeting.actionItems || [];
      return `
        <div class="flex-col gap-3">
          <form id="live-action-form" onsubmit="window.LiveMeetingRunner.handleCreateAction(event)" style="display:flex; gap:6px;">
            <input type="text" id="live-action-input" class="form-input" placeholder="Quick capture action item..." style="background:var(--live-bg); border-color:var(--live-border); color:#fff; font-size:0.825rem;" required />
            <button type="submit" class="btn btn-primary btn-sm">${Icons.plus(12)} Add</button>
          </form>

          <div class="action-items-container">
            ${actions.length === 0 ? `
              <p class="text-muted" style="font-size:0.8rem; padding:16px 0;">No action items recorded yet.</p>
            ` : actions.map(act => `
              <div class="action-item-row" style="background:var(--live-bg); border-color:var(--live-border);">
                <button class="agenda-check-btn ${act.status === 'Done' ? 'checked' : ''}" onclick="window.LiveMeetingRunner.toggleAction('${act.id}')">
                  ${Icons.check(12)}
                </button>
                <div class="action-item-content">
                  <div class="action-task-title" style="color:#fff; font-size:0.8rem;">${this._escape(act.task)}</div>
                  <div class="action-task-meta" style="font-size:0.7rem;">
                    <span>Assignee: ${act.assignee}</span>
                    <span>•</span>
                    <span>${act.priority}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (this.activeDockTab === 'decisions') {
      const decisions = this.meeting.decisions || [];
      return `
        <div class="flex-col gap-3">
          <form id="live-dec-form" onsubmit="window.LiveMeetingRunner.handleCreateDecision(event)" style="display:flex; flex-direction:column; gap:6px; background:rgba(255,255,255,0.03); padding:8px; border-radius:6px; border:1px solid var(--live-border);">
            <input type="text" id="live-dec-title" class="form-input" placeholder="Decision summary..." style="background:var(--live-bg); border-color:var(--live-border); color:#fff; font-size:0.825rem;" required />
            <input type="text" id="live-dec-rationale" class="form-input" placeholder="Rationale / context..." style="background:var(--live-bg); border-color:var(--live-border); color:#fff; font-size:0.825rem;" />
            <button type="submit" class="btn btn-primary btn-sm justify-center">${Icons.plus(12)} Record Decision</button>
          </form>

          <div class="decision-stream">
            ${decisions.length === 0 ? `
              <p class="text-muted" style="font-size:0.8rem; padding:16px 0;">No decisions recorded yet.</p>
            ` : decisions.map(d => `
              <div class="decision-card" style="background:var(--live-bg); border-color:var(--live-border); padding:8px 10px;">
                <span class="decision-title" style="color:#fff; font-size:0.85rem;">${this._escape(d.title)}</span>
                <p class="decision-body" style="color:var(--text-muted); font-size:0.75rem;">${this._escape(d.rationale)}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    return '';
  }

  setDockTab(tab) {
    this.activeDockTab = tab;
    this._render();
  }

  async handleCreateAction(e) {
    e.preventDefault();
    const input = document.getElementById('live-action-input');
    if (!input || !input.value.trim()) return;

    const task = input.value.trim();
    await Store.addActionItem({
      meetingId: this.meeting.id,
      task,
      assignee: Store.getCurrentUser().name,
      priority: 'High'
    });

    this.meeting = Store.getMeeting(this.meeting.id);
    AudioService.playClick();
    this._render();
  }

  async toggleAction(actionId) {
    const act = Store.actionItems.find(a => a.id === actionId);
    if (act) {
      const next = act.status === 'Done' ? 'To Do' : 'Done';
      await Store.updateActionItem(actionId, { status: next });
      this.meeting = Store.getMeeting(this.meeting.id);
      this._render();
    }
  }

  async handleCreateDecision(e) {
    e.preventDefault();
    const titleInput = document.getElementById('live-dec-title');
    const ratInput = document.getElementById('live-dec-rationale');
    if (!titleInput || !titleInput.value.trim()) return;

    await Store.addDecision({
      meetingId: this.meeting.id,
      title: titleInput.value.trim(),
      rationale: ratInput ? ratInput.value.trim() : '',
      decidedBy: 'Meeting Attendees'
    });

    this.meeting = Store.getMeeting(this.meeting.id);
    AudioService.playClick();
    this._render();
  }

  _updateTimerDisplay() {
    const timerDisplay = document.getElementById('live-timer-display');
    const timerSubtitle = document.getElementById('live-timer-subtitle');
    if (!timerDisplay) return;

    if (this.timerMode === 'countdown') {
      timerDisplay.textContent = this._formatSeconds(this.secondsRemaining);
      if (this.secondsRemaining < 0) {
        timerDisplay.classList.add('overtime');
        if (timerSubtitle) timerSubtitle.textContent = `OVERTIME (+${this._formatSeconds(Math.abs(this.secondsRemaining))})`;
      } else {
        timerDisplay.classList.remove('overtime');
        if (timerSubtitle) timerSubtitle.textContent = 'Time Remaining for this Topic';
      }
    } else {
      timerDisplay.textContent = this._formatSeconds(this.elapsedSeconds);
      timerDisplay.classList.remove('overtime');
      if (timerSubtitle) timerSubtitle.textContent = 'Elapsed on this Topic';
    }
  }

  _updatePlayPauseButton() {
    const btn = document.getElementById('live-play-btn');
    if (btn) {
      btn.innerHTML = this.isRunning ? `${Icons.pause(16)} Pause` : `${Icons.play(16)} Resume`;
    }
  }

  _formatSeconds(totalSecs) {
    const abs = Math.abs(totalSecs);
    const m = Math.floor(abs / 60);
    const s = abs % 60;
    const prefix = totalSecs < 0 ? '-' : '';
    return `${prefix}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  _escape(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

const Runner = new LiveMeetingRunner();
window.LiveMeetingRunner = Runner;
