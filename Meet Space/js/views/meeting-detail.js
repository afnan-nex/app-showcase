/**
 * MeetSpace - Meeting Detail Workspace View
 * Comprehensive meeting workspace with interactive agenda, participants RSVP,
 * rich autosaving notes editor, decision log, action items manager, and polls engine.
 */

const MeetingDetailView = {
  currentMeetingId: null,
  activeTab: 'notes', // 'notes', 'decisions', 'actions', 'polls'
  notesDebounceTimer: null,
  draggedIndex: null,

  render(container, params) {
    const meetingId = params.id;
    this.currentMeetingId = meetingId;
    if (params.tab) this.activeTab = params.tab;

    const meeting = Store.getMeeting(meetingId);
    if (!meeting) {
      container.innerHTML = `
        <div class="card empty-state">
          <div class="empty-state-icon">${Icons.calendar(40)}</div>
          <h2 class="empty-state-title">Meeting Not Found</h2>
          <p class="empty-state-desc">The requested meeting ID does not exist or has been removed from this workspace.</p>
          <a href="#/meetings" class="btn btn-primary btn-sm">Return to Meetings</a>
        </div>
      `;
      return;
    }

    // Calculate agenda total time
    const totalAgendaMins = (meeting.agenda || []).reduce((sum, item) => sum + (item.duration || 0), 0);
    const timeDelta = totalAgendaMins - (meeting.duration || 0);

    container.innerHTML = `
      <div class="meeting-detail-layout">
        <!-- 1. Header Bar with Metadata & Actions -->
        <div class="meeting-detail-header">
          <div class="detail-header-top">
            <div class="meeting-headline">
              <div class="flex items-center gap-2 flex-wrap">
                <select class="form-select" style="font-size:0.75rem; padding:2px 8px; width:auto; font-weight:600;" onchange="window.MeetingDetailView.changeMeetingStatus('${meeting.id}', this.value)">
                  <option value="scheduled" ${meeting.status === 'scheduled' ? 'selected' : ''}>SCHEDULED</option>
                  <option value="in-progress" ${meeting.status === 'in-progress' ? 'selected' : ''}>IN PROGRESS (LIVE)</option>
                  <option value="completed" ${meeting.status === 'completed' ? 'selected' : ''}>COMPLETED</option>
                  <option value="draft" ${meeting.status === 'draft' ? 'selected' : ''}>DRAFT</option>
                </select>
                <span class="text-dim">•</span>
                <span class="text-muted" style="font-size:0.8rem;">ID: ${meeting.id}</span>
                <button class="btn btn-ghost btn-sm" onclick="window.MeetingDetailView.showEditMeetingModal('${meeting.id}')" style="font-size:0.75rem; padding:1px 6px;">
                  ${Icons.edit(12)} Edit Details
                </button>
              </div>
              <h1 class="meeting-title-editable" id="md-title" contenteditable="true" spellcheck="false" title="Click to edit title">${this._escape(meeting.title)}</h1>
            </div>

            <!-- Quick Action Toolbar -->
            <div class="view-actions">
              <button class="btn btn-primary" onclick="window.LiveMeetingRunner.start('${meeting.id}')" title="Enter Fullscreen Facilitator Mode">
                ${Icons.play(15)} Start Live Meeting
              </button>
              <button class="btn btn-secondary btn-sm" onclick="window.Exporter.downloadMeetingSummary(Store.getMeeting('${meeting.id}'))" title="Download Printable HTML Summary">
                ${Icons.download(14)} Export Minutes
              </button>
              <button class="btn btn-secondary btn-sm" onclick="window.print()" title="Print / PDF View">
                ${Icons.printer(14)} Print
              </button>
              <button class="btn btn-secondary btn-sm btn-icon-only" onclick="window.MeetingViews.duplicateMeeting('${meeting.id}')" title="Duplicate Meeting">
                ${Icons.copy(14)}
              </button>
              <button class="btn btn-ghost btn-sm btn-icon-only text-dim" onclick="window.MeetingViews.deleteMeeting('${meeting.id}')" title="Delete Meeting">
                ${Icons.trash(14)}
              </button>
            </div>
          </div>

          <!-- Metadata Chips Row -->
          <div class="meeting-metadata-chips">
            <div class="meta-chip">
              <span class="meta-chip-icon">${Icons.calendar(14)}</span>
              <span><strong>Date:</strong> ${meeting.date}</span>
            </div>
            <div class="meta-chip">
              <span class="meta-chip-icon">${Icons.clock(14)}</span>
              <span><strong>Time:</strong> ${meeting.startTime || '10:00'} (${meeting.duration} mins)</span>
            </div>
            <div class="meta-chip">
              <span class="meta-chip-icon">${Icons.user(14)}</span>
              <span><strong>Organizer:</strong> ${this._escape(meeting.organizer)}</span>
            </div>
            <div class="meta-chip">
              <span class="meta-chip-icon">${Icons.tag(14)}</span>
              <span><strong>Tags:</strong> ${(meeting.tags || ['General']).join(', ')}</span>
            </div>
            ${meeting.location ? `
              <div class="meta-chip">
                <span class="meta-chip-icon">${Icons.externalLink(13)}</span>
                <span>${this._escape(meeting.location)}</span>
              </div>
            ` : ''}
          </div>

          <!-- 2. Participants Bar & RSVP Tracker -->
          <div class="participants-section">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-semibold" style="font-size:0.85rem; color:var(--text-secondary);">Attendees (${(meeting.participants || []).length}):</span>
              <div class="participants-list">
                ${(meeting.participants || []).map(p => `
                  <div class="participant-chip" onclick="window.MeetingDetailView.toggleParticipantRsvp('${meeting.id}', '${p.id}')" title="Click to cycle status (${p.status || 'confirmed'})">
                    <div class="avatar avatar-xs">${(p.name || 'U').charAt(0)}</div>
                    <span>${this._escape(p.name)}</span>
                    <span class="badge badge-dot ${this._getRsvpBadgeClass(p.status)}"></span>
                    <span style="font-size:0.7rem; color:var(--text-muted);">${p.status || 'confirmed'}</span>
                    <button class="btn btn-ghost btn-icon-only text-dim" onclick="event.stopPropagation(); window.MeetingDetailView.removeParticipant('${meeting.id}', '${p.id}')" title="Remove attendee" style="padding:1px; margin-left:2px;">
                      ${Icons.x(10)}
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>

            <button class="btn btn-secondary btn-sm" onclick="window.MeetingDetailView.showAddParticipantModal('${meeting.id}')">
              ${Icons.plus(13)} Add Attendee
            </button>
          </div>
        </div>

        <!-- 3. Main Workspace Grid: Left (Agenda) / Right (Notes & Tools Tabs) -->
        <div class="meeting-detail-grid">
          <!-- Left Column: Interactive Agenda -->
          <div class="agenda-panel">
            <div class="agenda-header">
              <div class="flex items-center gap-2">
                <span class="card-title">${Icons.agenda(17)} Agenda Topics</span>
                <span class="badge badge-tag">${(meeting.agenda || []).length} items</span>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="window.MeetingDetailView.showAddAgendaModal('${meeting.id}')">
                ${Icons.plus(13)} Add Topic
              </button>
            </div>

            <!-- Agenda Duration Summary Bar -->
            <div class="agenda-summary-bar">
              <span>Allotted: <strong>${meeting.duration}m</strong></span>
              <span>Planned: <strong>${totalAgendaMins}m</strong>
                ${timeDelta > 0 ? `<span class="priority-urgent"> (+${timeDelta}m over)</span>` : (timeDelta < 0 ? `<span class="priority-medium"> (${Math.abs(timeDelta)}m buffer)</span>` : '<span style="color:var(--success-text);"> (Exact fit)</span>')}
              </span>
            </div>

            <!-- Agenda Items List with Drag & Drop and Controls -->
            <div class="agenda-items-list" id="agenda-items-container">
              ${(meeting.agenda || []).length === 0 ? `
                <div class="empty-state" style="padding: 24px 16px;">
                  <p class="empty-state-desc" style="margin-bottom:8px;">No agenda topics added yet.</p>
                  <button class="btn btn-secondary btn-sm" onclick="window.MeetingDetailView.showAddAgendaModal('${meeting.id}')">Add First Topic</button>
                </div>
              ` : (meeting.agenda || []).map((item, index) => `
                <div class="agenda-item-card ${item.completed ? 'is-completed' : ''}" 
                     draggable="true" 
                     data-index="${index}" 
                     data-agenda-id="${item.id}"
                     ondragstart="window.MeetingDetailView.handleDragStart(event, ${index})"
                     ondragover="window.MeetingDetailView.handleDragOver(event)"
                     ondrop="window.MeetingDetailView.handleDrop(event, ${index})">
                  
                  <span class="agenda-drag-handle" title="Drag to reorder">${Icons.gripVertical(14)}</span>

                  <button class="agenda-check-btn ${item.completed ? 'checked' : ''}" onclick="window.MeetingDetailView.toggleAgendaItem('${meeting.id}', '${item.id}')" title="Toggle Topic Done">
                    ${Icons.check(12)}
                  </button>

                  <div class="agenda-item-content">
                    <div class="agenda-item-title">${this._escape(item.title)}</div>
                    <div class="agenda-item-meta">
                      <span class="agenda-item-duration">${item.duration}m</span>
                      ${item.presenter ? `<span>• Presenter: <strong>${this._escape(item.presenter)}</strong></span>` : ''}
                      ${item.notes ? `<span class="text-dim">• ${this._escape(item.notes)}</span>` : ''}
                    </div>
                  </div>

                  <div class="agenda-item-actions">
                    <button class="btn btn-ghost btn-sm btn-icon-only" onclick="window.MeetingDetailView.moveAgendaItem('${meeting.id}', ${index}, -1)" title="Move Up" ${index === 0 ? 'disabled' : ''}>
                      ${Icons.arrowUp(13)}
                    </button>
                    <button class="btn btn-ghost btn-sm btn-icon-only" onclick="window.MeetingDetailView.moveAgendaItem('${meeting.id}', ${index}, 1)" title="Move Down" ${index === (meeting.agenda || []).length - 1 ? 'disabled' : ''}>
                      ${Icons.arrowDown(13)}
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="window.LiveMeetingRunner.start('${meeting.id}', ${index})" title="Start Facilitator Mode on this topic">
                      ${Icons.play(11)} Start
                    </button>
                    <button class="btn btn-ghost btn-sm btn-icon-only text-dim" onclick="window.MeetingDetailView.deleteAgendaItem('${meeting.id}', '${item.id}')" title="Delete Topic">
                      ${Icons.trash(13)}
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Right Column: Tabs (Notes, Decisions, Action Items, Polls) -->
          <div class="workspace-tabs-container">
            <div class="workspace-tabs-header">
              <div class="tabs-nav" style="margin-bottom: 0; border-bottom: none;">
                <button class="tab-btn ${this.activeTab === 'notes' ? 'active' : ''}" onclick="window.MeetingDetailView.setTab('notes')">
                  ${Icons.notes(15)} Notes
                </button>
                <button class="tab-btn ${this.activeTab === 'decisions' ? 'active' : ''}" onclick="window.MeetingDetailView.setTab('decisions')">
                  ${Icons.decision(15)} Decisions (${(meeting.decisions || []).length})
                </button>
                <button class="tab-btn ${this.activeTab === 'actions' ? 'active' : ''}" onclick="window.MeetingDetailView.setTab('actions')">
                  ${Icons.checkSquare(15)} Actions (${(meeting.actionItems || []).length})
                </button>
                <button class="tab-btn ${this.activeTab === 'polls' ? 'active' : ''}" onclick="window.MeetingDetailView.setTab('polls')">
                  ${Icons.poll(15)} Polls (${(meeting.polls || []).length})
                </button>
              </div>
            </div>

            <!-- Tab Contents -->
            <div class="workspace-tab-body">
              ${this._renderActiveTabContent(meeting)}
            </div>
          </div>
        </div>
      </div>
    `;

    // Title autosave
    const titleEl = container.querySelector('#md-title');
    if (titleEl) {
      titleEl.addEventListener('blur', async () => {
        const newTitle = titleEl.textContent.trim();
        if (newTitle && newTitle !== meeting.title) {
          await Store.updateMeeting({ ...meeting, title: newTitle });
          Notifier.show('Title Updated', 'Meeting title saved.', 'success');
        }
      });
    }

    if (this.activeTab === 'notes') {
      this._initNotesEditor(container, meeting);
    }
  },

  _renderActiveTabContent(meeting) {
    if (this.activeTab === 'notes') {
      return `
        <div class="notes-editor-wrapper">
          <div class="notes-toolbar">
            <button class="toolbar-btn" data-command="bold" title="Bold (Cmd+B)"><strong>B</strong></button>
            <button class="toolbar-btn" data-command="italic" title="Italic (Cmd+I)"><em>I</em></button>
            <button class="toolbar-btn" data-command="strikeThrough" title="Strikethrough"><s>S</s></button>
            <div class="toolbar-sep"></div>
            <button class="toolbar-btn" data-command="formatBlock" data-value="H2" title="Heading 2">H2</button>
            <button class="toolbar-btn" data-command="formatBlock" data-value="H3" title="Heading 3">H3</button>
            <button class="toolbar-btn" data-command="formatBlock" data-value="P" title="Normal Paragraph">P</button>
            <div class="toolbar-sep"></div>
            <button class="toolbar-btn" data-command="insertUnorderedList" title="Bullet List">• List</button>
            <button class="toolbar-btn" data-command="insertOrderedList" title="Numbered List">1. List</button>
            <button class="toolbar-btn" data-command="formatBlock" data-value="BLOCKQUOTE" title="Quote">""</button>
            <div class="toolbar-sep"></div>
            <div class="editor-status-indicator" id="notes-status-badge">
              <span class="status-dot-saved"></span>
              <span>All changes saved</span>
            </div>
          </div>
          <div class="notes-content-editable" id="notes-content" contenteditable="true" data-placeholder="Capture live meeting discussion notes, bullet points, and key takeaways...">
            ${meeting.notes || ''}
          </div>
        </div>
      `;
    }

    if (this.activeTab === 'decisions') {
      const decisions = meeting.decisions || [];
      return `
        <div class="flex-col gap-4">
          <div class="flex items-center justify-between">
            <h4 style="font-size:0.925rem; font-weight:600;">Decisions Recorded in this Session</h4>
            <button class="btn btn-primary btn-sm" onclick="window.MeetingDetailView.showAddDecisionModal('${meeting.id}')">
              ${Icons.plus(13)} Log Decision
            </button>
          </div>

          ${decisions.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state-icon">${Icons.decision(32)}</div>
              <h4 class="empty-state-title">No decisions logged yet</h4>
              <p class="empty-state-desc">Record architectural agreements, consensus choices, and strategic policies.</p>
              <button class="btn btn-secondary btn-sm" onclick="window.MeetingDetailView.showAddDecisionModal('${meeting.id}')">Record First Decision</button>
            </div>
          ` : `
            <div class="decision-stream">
              ${decisions.map(d => `
                <div class="decision-card">
                  <div class="decision-header">
                    <span class="decision-title">${this._escape(d.title)}</span>
                    <div class="flex items-center gap-2">
                      <span class="badge ${d.impact === 'High' ? 'badge-urgent' : 'badge-tag'}">${d.impact || 'Medium'} Impact</span>
                      <button class="btn btn-ghost btn-sm btn-icon-only text-dim" onclick="window.MeetingDetailView.deleteDecision('${d.id}')" title="Delete Decision">
                        ${Icons.trash(13)}
                      </button>
                    </div>
                  </div>
                  <div class="decision-body">${this._escape(d.rationale)}</div>
                  <div class="decision-footer">
                    <span>Decided by: <strong>${this._escape(d.decidedBy)}</strong></span>
                    <span class="text-dim">${new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      `;
    }

    if (this.activeTab === 'actions') {
      const actions = meeting.actionItems || [];
      return `
        <div class="flex-col gap-4">
          <div class="flex items-center justify-between">
            <h4 style="font-size:0.925rem; font-weight:600;">Assigned Action Items</h4>
            <button class="btn btn-primary btn-sm" onclick="window.MeetingDetailView.showAddActionModal('${meeting.id}')">
              ${Icons.plus(13)} New Action Item
            </button>
          </div>

          ${actions.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state-icon">${Icons.checkSquare(32)}</div>
              <h4 class="empty-state-title">No action items assigned</h4>
              <p class="empty-state-desc">Assign specific commitments, owners, and due dates from this meeting.</p>
              <button class="btn btn-secondary btn-sm" onclick="window.MeetingDetailView.showAddActionModal('${meeting.id}')">Add Action Item</button>
            </div>
          ` : `
            <div class="action-items-container">
              ${actions.map(act => `
                <div class="action-item-row ${act.status === 'Done' ? 'is-done' : ''}">
                  <button class="agenda-check-btn ${act.status === 'Done' ? 'checked' : ''}" onclick="window.MeetingDetailView.toggleActionStatus('${act.id}')">
                    ${Icons.check(12)}
                  </button>

                  <div class="action-item-content">
                    <div class="action-task-title">${this._escape(act.task)}</div>
                    <div class="action-task-meta">
                      <span><strong>Owner:</strong> ${this._escape(act.assignee)}</span>
                      <span>•</span>
                      <span class="${this._getPriorityClass(act.priority)}">${act.priority}</span>
                      <span>•</span>
                      <span>Due: ${act.dueDate || 'N/A'}</span>
                    </div>
                  </div>

                  <select class="form-select" style="font-size:0.75rem; padding:2px 8px; width:auto;" onchange="window.MeetingDetailView.updateActionStatus('${act.id}', this.value)">
                    <option value="To Do" ${act.status === 'To Do' ? 'selected' : ''}>To Do</option>
                    <option value="In Progress" ${act.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Done" ${act.status === 'Done' ? 'selected' : ''}>Done</option>
                    <option value="Blocked" ${act.status === 'Blocked' ? 'selected' : ''}>Blocked</option>
                  </select>

                  <button class="btn btn-ghost btn-sm btn-icon-only text-dim" onclick="window.MeetingDetailView.deleteActionItem('${act.id}')" title="Delete Action">
                    ${Icons.trash(13)}
                  </button>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      `;
    }

    if (this.activeTab === 'polls') {
      const polls = meeting.polls || [];
      return `
        <div class="flex-col gap-4">
          <div class="flex items-center justify-between">
            <h4 style="font-size:0.925rem; font-weight:600;">Meeting Polls & Realtime Voting</h4>
            <button class="btn btn-primary btn-sm" onclick="window.MeetingDetailView.showCreatePollModal('${meeting.id}')">
              ${Icons.plus(13)} Create Poll
            </button>
          </div>

          ${polls.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state-icon">${Icons.poll(32)}</div>
              <h4 class="empty-state-title">No polls created</h4>
              <p class="empty-state-desc">Create quick single or multiple choice questions for instant attendee feedback.</p>
              <button class="btn btn-secondary btn-sm" onclick="window.MeetingDetailView.showCreatePollModal('${meeting.id}')">Create First Poll</button>
            </div>
          ` : `
            <div class="polls-container">
              ${polls.map(p => this._renderPollCard(p, meeting.id)).join('')}
            </div>
          `}
        </div>
      `;
    }

    return '';
  },

  _renderPollCard(poll, meetingId) {
    const total = poll.totalVotes || 0;
    return `
      <div class="poll-card">
        <div class="poll-question">
          <span>${this._escape(poll.question)}</span>
          <div class="flex items-center gap-2">
            <span class="badge badge-tag">${total} votes</span>
            <button class="btn btn-secondary btn-sm" onclick="window.MeetingDetailView.simulateVotes('${poll.id}')" title="Simulate attendee votes">
              ${Icons.rotateCcw(12)} Simulate Votes
            </button>
          </div>
        </div>

        <div class="poll-options-list">
          ${poll.options.map(opt => {
            const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
            return `
              <div class="poll-option-row" onclick="window.MeetingDetailView.castVote('${poll.id}', '${opt.id}')">
                <div class="poll-option-progress" style="width: ${pct}%;"></div>
                <span class="poll-option-label">
                  ${Icons.checkSquare(14)} ${this._escape(opt.text)}
                </span>
                <span class="poll-option-votes">${opt.votes} (${pct}%)</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  _initNotesEditor(container, meeting) {
    const editable = container.querySelector('#notes-content');
    const statusBadge = container.querySelector('#notes-status-badge');
    const toolbar = container.querySelector('.notes-toolbar');

    if (!editable || !toolbar) return;

    toolbar.querySelectorAll('.toolbar-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-command');
        const val = btn.getAttribute('data-value') || null;
        document.execCommand(cmd, false, val);
        editable.focus();
      });
    });

    editable.addEventListener('input', () => {
      if (statusBadge) {
        statusBadge.innerHTML = `<span class="status-dot-saving"></span><span>Saving...</span>`;
      }

      clearTimeout(this.notesDebounceTimer);
      this.notesDebounceTimer = setTimeout(async () => {
        const html = editable.innerHTML;
        await Store.updateNotes(meeting.id, html);
        if (statusBadge) {
          statusBadge.innerHTML = `<span class="status-dot-saved"></span><span>All changes saved</span>`;
        }
      }, 600);
    });
  },

  setTab(tab) {
    this.activeTab = tab;
    this.render(document.getElementById('main-content-view'), { id: this.currentMeetingId, tab });
  },

  async changeMeetingStatus(meetingId, status) {
    const m = Store.getMeeting(meetingId);
    if (m) {
      await Store.updateMeeting({ ...m, status });
      Notifier.show('Status Updated', `Meeting marked as ${status.toUpperCase()}`, 'info');
      this.render(document.getElementById('main-content-view'), { id: meetingId, tab: this.activeTab });
    }
  },

  // Drag and Drop Agenda Handlers
  handleDragStart(e, index) {
    this.draggedIndex = index;
    e.dataTransfer.effectAllowed = 'move';
  },

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  },

  async handleDrop(e, targetIndex) {
    e.preventDefault();
    if (this.draggedIndex === null || this.draggedIndex === targetIndex) return;

    const meeting = Store.getMeeting(this.currentMeetingId);
    if (!meeting || !meeting.agenda) return;

    const items = [...meeting.agenda];
    const moved = items.splice(this.draggedIndex, 1)[0];
    items.splice(targetIndex, 0, moved);

    this.draggedIndex = null;
    await Store.reorderAgenda(this.currentMeetingId, items);
    this.render(document.getElementById('main-content-view'), { id: this.currentMeetingId, tab: this.activeTab });
  },

  // Modal: Edit Meeting Details
  showEditMeetingModal(meetingId) {
    const meeting = Store.getMeeting(meetingId);
    if (!meeting) return;

    let modal = document.getElementById('edit-meeting-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'edit-meeting-modal';
      modal.className = 'modal-backdrop';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title">Edit Meeting Details</h3>
          <button class="btn btn-ghost btn-icon-only modal-close-btn">${Icons.x(16)}</button>
        </div>
        <form id="edit-meeting-form">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Title *</label>
              <input type="text" id="em-title" class="form-input" value="${this._escape(meeting.title)}" required />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Date *</label>
                <input type="date" id="em-date" class="form-input" value="${meeting.date}" required />
              </div>
              <div class="form-group">
                <label class="form-label">Start Time *</label>
                <input type="time" id="em-time" class="form-input" value="${meeting.startTime || '10:00'}" required />
              </div>
              <div class="form-group">
                <label class="form-label">Duration (min)</label>
                <input type="number" id="em-duration" class="form-input" value="${meeting.duration}" min="5" max="480" step="5" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Organizer</label>
                <input type="text" id="em-organizer" class="form-input" value="${this._escape(meeting.organizer)}" />
              </div>
              <div class="form-group">
                <label class="form-label">Location / URL</label>
                <input type="text" id="em-location" class="form-input" value="${this._escape(meeting.location || '')}" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Tags (comma separated)</label>
              <input type="text" id="em-tags" class="form-input" value="${(meeting.tags || []).join(', ')}" />
            </div>
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea id="em-desc" class="form-textarea" rows="2">${this._escape(meeting.description || '')}</textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary modal-close-btn">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    `;

    modal.classList.add('open');
    modal.querySelectorAll('.modal-close-btn').forEach(b => b.onclick = () => modal.classList.remove('open'));

    modal.querySelector('#edit-meeting-form').onsubmit = async (e) => {
      e.preventDefault();
      const title = modal.querySelector('#em-title').value.trim();
      const date = modal.querySelector('#em-date').value;
      const startTime = modal.querySelector('#em-time').value;
      const duration = parseInt(modal.querySelector('#em-duration').value, 10) || 30;
      const organizer = modal.querySelector('#em-organizer').value.trim();
      const location = modal.querySelector('#em-location').value.trim();
      const tags = modal.querySelector('#em-tags').value.split(',').map(s => s.trim()).filter(Boolean);
      const description = modal.querySelector('#em-desc').value.trim();

      await Store.updateMeeting({
        ...meeting,
        title,
        date,
        startTime,
        duration,
        organizer,
        location,
        tags,
        description
      });

      modal.classList.remove('open');
      Notifier.show('Meeting Updated', 'Changes saved successfully.', 'success');
      this.render(document.getElementById('main-content-view'), { id: meetingId, tab: this.activeTab });
    };
  },

  // Modal: Add Agenda Item
  showAddAgendaModal(meetingId) {
    let modal = document.getElementById('add-agenda-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'add-agenda-modal';
      modal.className = 'modal-backdrop';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title">Add Agenda Topic</h3>
          <button class="btn btn-ghost btn-icon-only modal-close-btn">${Icons.x(16)}</button>
        </div>
        <form id="add-agenda-form">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Topic Title *</label>
              <input type="text" id="aam-title" class="form-input" placeholder="e.g. Technical Debt & Query Latency" required />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Allocated Duration (Minutes) *</label>
                <input type="number" id="aam-duration" class="form-input" value="10" min="1" max="180" step="1" required />
              </div>
              <div class="form-group">
                <label class="form-label">Presenter / Lead</label>
                <input type="text" id="aam-presenter" class="form-input" placeholder="e.g. Marcus Chen" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Key Context / Target Outcome</label>
              <input type="text" id="aam-notes" class="form-input" placeholder="Optional brief goal for this section..." />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary modal-close-btn">Cancel</button>
            <button type="submit" class="btn btn-primary">Add Topic</button>
          </div>
        </form>
      </div>
    `;

    modal.classList.add('open');
    modal.querySelectorAll('.modal-close-btn').forEach(b => b.onclick = () => modal.classList.remove('open'));

    modal.querySelector('#add-agenda-form').onsubmit = async (e) => {
      e.preventDefault();
      const title = modal.querySelector('#aam-title').value.trim();
      const duration = parseInt(modal.querySelector('#aam-duration').value, 10) || 10;
      const presenter = modal.querySelector('#aam-presenter').value.trim();
      const notes = modal.querySelector('#aam-notes').value.trim();

      await Store.addAgendaItem(meetingId, { title, duration, presenter, notes });
      modal.classList.remove('open');
      Notifier.show('Agenda Topic Added', title, 'success');
      this.render(document.getElementById('main-content-view'), { id: meetingId, tab: this.activeTab });
    };
  },

  // Modal: Add Participant
  showAddParticipantModal(meetingId) {
    let modal = document.getElementById('add-participant-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'add-participant-modal';
      modal.className = 'modal-backdrop';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title">Add Meeting Attendee</h3>
          <button class="btn btn-ghost btn-icon-only modal-close-btn">${Icons.x(16)}</button>
        </div>
        <form id="add-participant-form">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Attendee Full Name *</label>
              <input type="text" id="apm-name" class="form-input" placeholder="e.g. Samantha Wu" required />
            </div>
            <div class="form-group">
              <label class="form-label">Work Email</label>
              <input type="email" id="apm-email" class="form-input" placeholder="samantha.wu@meetspace.io" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Role / Department</label>
                <input type="text" id="apm-role" class="form-input" placeholder="Staff Security Engineer" />
              </div>
              <div class="form-group">
                <label class="form-label">Initial RSVP</label>
                <select id="apm-status" class="form-select">
                  <option value="confirmed">Confirmed</option>
                  <option value="tentative">Tentative</option>
                  <option value="present">Present (In-Meeting)</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary modal-close-btn">Cancel</button>
            <button type="submit" class="btn btn-primary">Add Attendee</button>
          </div>
        </form>
      </div>
    `;

    modal.classList.add('open');
    modal.querySelectorAll('.modal-close-btn').forEach(b => b.onclick = () => modal.classList.remove('open'));

    modal.querySelector('#add-participant-form').onsubmit = async (e) => {
      e.preventDefault();
      const name = modal.querySelector('#apm-name').value.trim();
      const email = modal.querySelector('#apm-email').value.trim();
      const role = modal.querySelector('#apm-role').value.trim() || 'Attendee';
      const status = modal.querySelector('#apm-status').value;

      await Store.addParticipantToMeeting(meetingId, { name, email, role, status });
      modal.classList.remove('open');
      Notifier.show('Attendee Added', name, 'success');
      this.render(document.getElementById('main-content-view'), { id: meetingId, tab: this.activeTab });
    };
  },

  async removeParticipant(meetingId, participantId) {
    const meeting = Store.getMeeting(meetingId);
    if (!meeting || !meeting.participants) return;
    if (confirm('Remove this attendee from the meeting?')) {
      meeting.participants = meeting.participants.filter(p => p.id !== participantId);
      await Store.updateMeeting(meeting);
      this.render(document.getElementById('main-content-view'), { id: meetingId, tab: this.activeTab });
    }
  },

  // Modal: Log Decision
  showAddDecisionModal(meetingId) {
    let modal = document.getElementById('add-decision-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'add-decision-modal';
      modal.className = 'modal-backdrop';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title">Record Team Decision</h3>
          <button class="btn btn-ghost btn-icon-only modal-close-btn">${Icons.x(16)}</button>
        </div>
        <form id="add-decision-form">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Decision Title *</label>
              <input type="text" id="adm-title" class="form-input" placeholder="e.g. Enforce 4-Hour PR Review SLA" required />
            </div>
            <div class="form-group">
              <label class="form-label">Rationale & Strategic Context *</label>
              <textarea id="adm-rationale" class="form-textarea" rows="3" placeholder="Why was this decided? What trade-offs were accepted?" required></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Decided By</label>
                <input type="text" id="adm-decider" class="form-input" value="${Store.getCurrentUser().name}" />
              </div>
              <div class="form-group">
                <label class="form-label">Impact Rating</label>
                <select id="adm-impact" class="form-select">
                  <option value="High">High Impact</option>
                  <option value="Medium" selected>Medium Impact</option>
                  <option value="Low">Low Impact</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Tags (comma separated)</label>
              <input type="text" id="adm-tags" class="form-input" placeholder="Architecture, Process, Policy" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary modal-close-btn">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Decision</button>
          </div>
        </form>
      </div>
    `;

    modal.classList.add('open');
    modal.querySelectorAll('.modal-close-btn').forEach(b => b.onclick = () => modal.classList.remove('open'));

    modal.querySelector('#add-decision-form').onsubmit = async (e) => {
      e.preventDefault();
      const title = modal.querySelector('#adm-title').value.trim();
      const rationale = modal.querySelector('#adm-rationale').value.trim();
      const decidedBy = modal.querySelector('#adm-decider').value.trim();
      const impact = modal.querySelector('#adm-impact').value;
      const tags = modal.querySelector('#adm-tags').value.split(',').map(s => s.trim()).filter(Boolean);

      await Store.addDecision({ meetingId, title, rationale, decidedBy, impact, tags });
      modal.classList.remove('open');
      Notifier.show('Decision Logged', title, 'success');
      this.render(document.getElementById('main-content-view'), { id: meetingId, tab: 'decisions' });
    };
  },

  // Modal: Add Action Item
  showAddActionModal(meetingId) {
    const meeting = Store.getMeeting(meetingId);
    let modal = document.getElementById('add-action-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'add-action-modal';
      modal.className = 'modal-backdrop';
      document.body.appendChild(modal);
    }

    const defaultDue = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString().split('T')[0];
    const attendees = (meeting && meeting.participants) ? meeting.participants : [];

    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title">Create Action Item</h3>
          <button class="btn btn-ghost btn-icon-only modal-close-btn">${Icons.x(16)}</button>
        </div>
        <form id="add-action-form">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Task Commitment Description *</label>
              <input type="text" id="aam-task" class="form-input" placeholder="e.g. Implement Playwright test suite for live timer" required />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Assignee *</label>
                <input type="text" id="aam-assignee" class="form-input" list="attendee-list" value="${Store.getCurrentUser().name}" required />
                <datalist id="attendee-list">
                  ${attendees.map(a => `<option value="${this._escape(a.name)}">`).join('')}
                </datalist>
              </div>
              <div class="form-group">
                <label class="form-label">Due Date *</label>
                <input type="date" id="aam-due" class="form-input" value="${defaultDue}" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Priority</label>
                <select id="aam-priority" class="form-select">
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Medium" selected>Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Initial Status</label>
                <select id="aam-status" class="form-select">
                  <option value="To Do" selected>To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary modal-close-btn">Cancel</button>
            <button type="submit" class="btn btn-primary">Assign Action</button>
          </div>
        </form>
      </div>
    `;

    modal.classList.add('open');
    modal.querySelectorAll('.modal-close-btn').forEach(b => b.onclick = () => modal.classList.remove('open'));

    modal.querySelector('#add-action-form').onsubmit = async (e) => {
      e.preventDefault();
      const task = modal.querySelector('#aam-task').value.trim();
      const assignee = modal.querySelector('#aam-assignee').value.trim();
      const dueDate = modal.querySelector('#aam-due').value;
      const priority = modal.querySelector('#aam-priority').value;
      const status = modal.querySelector('#aam-status').value;

      await Store.addActionItem({ meetingId, task, assignee, dueDate, priority, status });
      modal.classList.remove('open');
      Notifier.show('Action Item Created', task, 'success');
      this.render(document.getElementById('main-content-view'), { id: meetingId, tab: 'actions' });
    };
  },

  // Modal: Create Poll
  showCreatePollModal(meetingId) {
    let modal = document.getElementById('create-poll-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'create-poll-modal';
      modal.className = 'modal-backdrop';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title">Create Meeting Poll</h3>
          <button class="btn btn-ghost btn-icon-only modal-close-btn">${Icons.x(16)}</button>
        </div>
        <form id="create-poll-form">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Poll Question *</label>
              <input type="text" id="cpm-question" class="form-input" placeholder="e.g. Which architecture option should we adopt for edge sync?" required />
            </div>
            <div class="form-group">
              <label class="form-label">Options</label>
              <div id="cpm-options-list" class="flex-col gap-2">
                <input type="text" class="form-input cpm-option" placeholder="Option 1" value="Option A: Synchronous Local Storage" required />
                <input type="text" class="form-input cpm-option" placeholder="Option 2" value="Option B: IndexedDB with Background Sync" required />
                <input type="text" class="form-input cpm-option" placeholder="Option 3" value="Option C: WebSocket Server Relay" />
              </div>
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.MeetingDetailView.addPollOptionRow()" style="margin-top:8px;">
                ${Icons.plus(12)} Add Another Option
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary modal-close-btn">Cancel</button>
            <button type="submit" class="btn btn-primary">Launch Poll</button>
          </div>
        </form>
      </div>
    `;

    modal.classList.add('open');
    modal.querySelectorAll('.modal-close-btn').forEach(b => b.onclick = () => modal.classList.remove('open'));

    modal.querySelector('#create-poll-form').onsubmit = async (e) => {
      e.preventDefault();
      const question = modal.querySelector('#cpm-question').value.trim();
      const optionInputs = modal.querySelectorAll('.cpm-option');
      const options = Array.from(optionInputs).map(inp => inp.value.trim()).filter(Boolean);

      if (options.length < 2) {
        alert('Please specify at least 2 options for the poll.');
        return;
      }

      await Store.createPoll({ meetingId, question, options });
      modal.classList.remove('open');
      Notifier.show('Poll Launched', question, 'success');
      this.render(document.getElementById('main-content-view'), { id: meetingId, tab: 'polls' });
    };
  },

  addPollOptionRow() {
    const list = document.getElementById('cpm-options-list');
    if (!list) return;
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'form-input cpm-option';
    inp.placeholder = `Option ${list.children.length + 1}`;
    list.appendChild(inp);
    inp.focus();
  },

  // Actions
  async toggleAgendaItem(meetingId, itemId) {
    const meeting = Store.getMeeting(meetingId);
    if (!meeting || !meeting.agenda) return;
    const item = meeting.agenda.find(a => a.id === itemId);
    if (item) {
      item.completed = !item.completed;
      await Store.updateMeeting(meeting);
      this.render(document.getElementById('main-content-view'), { id: meetingId, tab: this.activeTab });
    }
  },

  async moveAgendaItem(meetingId, fromIndex, direction) {
    const meeting = Store.getMeeting(meetingId);
    if (!meeting || !meeting.agenda) return;

    const toIndex = fromIndex + direction;
    if (toIndex < 0 || toIndex >= meeting.agenda.length) return;

    const temp = meeting.agenda[fromIndex];
    meeting.agenda[fromIndex] = meeting.agenda[toIndex];
    meeting.agenda[toIndex] = temp;

    await Store.reorderAgenda(meetingId, meeting.agenda);
    this.render(document.getElementById('main-content-view'), { id: meetingId, tab: this.activeTab });
  },

  async deleteAgendaItem(meetingId, itemId) {
    if (confirm('Delete this agenda item?')) {
      await Store.deleteAgendaItem(meetingId, itemId);
      this.render(document.getElementById('main-content-view'), { id: meetingId, tab: this.activeTab });
    }
  },

  async toggleParticipantRsvp(meetingId, participantId) {
    const meeting = Store.getMeeting(meetingId);
    if (!meeting) return;
    const p = (meeting.participants || []).find(x => x.id === participantId);
    if (!p) return;

    const order = ['confirmed', 'tentative', 'declined', 'absent', 'present'];
    const currentIdx = order.indexOf(p.status || 'confirmed');
    const nextStatus = order[(currentIdx + 1) % order.length];

    await Store.updateParticipantStatus(meetingId, participantId, nextStatus);
    this.render(document.getElementById('main-content-view'), { id: meetingId, tab: this.activeTab });
  },

  async deleteDecision(id) {
    if (confirm('Delete this decision record?')) {
      await Store.deleteDecision(id);
      this.render(document.getElementById('main-content-view'), { id: this.currentMeetingId, tab: 'decisions' });
    }
  },

  async toggleActionStatus(actionId) {
    const act = Store.actionItems.find(a => a.id === actionId);
    if (act) {
      const next = act.status === 'Done' ? 'To Do' : 'Done';
      await Store.updateActionItem(actionId, { status: next });
      this.render(document.getElementById('main-content-view'), { id: this.currentMeetingId, tab: this.activeTab });
    }
  },

  async updateActionStatus(actionId, status) {
    await Store.updateActionItem(actionId, { status });
    this.render(document.getElementById('main-content-view'), { id: this.currentMeetingId, tab: this.activeTab });
  },

  async deleteActionItem(actionId) {
    if (confirm('Delete this action item?')) {
      await Store.deleteActionItem(actionId);
      this.render(document.getElementById('main-content-view'), { id: this.currentMeetingId, tab: 'actions' });
    }
  },

  async castVote(pollId, optionId) {
    await Store.votePoll(pollId, optionId);
    AudioService.playClick();
    this.render(document.getElementById('main-content-view'), { id: this.currentMeetingId, tab: 'polls' });
  },

  async simulateVotes(pollId) {
    await Store.simulatePollVotes(pollId);
    AudioService.playNotificationPing();
    this.render(document.getElementById('main-content-view'), { id: this.currentMeetingId, tab: 'polls' });
  },

  _getRsvpBadgeClass(status) {
    if (status === 'confirmed' || status === 'present') return 'badge-confirmed';
    if (status === 'tentative') return 'badge-tentative';
    if (status === 'declined') return 'badge-declined';
    return 'badge-absent';
  },

  _getPriorityClass(priority) {
    if (priority === 'Urgent') return 'priority-urgent';
    if (priority === 'High') return 'priority-high';
    if (priority === 'Medium') return 'priority-medium';
    return 'priority-low';
  },

  _escape(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

window.MeetingDetailView = MeetingDetailView;
