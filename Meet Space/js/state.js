/**
 * MeetSpace - Central Reactive State Management Store
 * Coordinates IndexedDB updates, in-memory caching, and event broadcasting
 */

class StateStore {
  constructor() {
    this.meetings = [];
    this.actionItems = [];
    this.decisions = [];
    this.polls = [];
    this.participants = [];
    this.settings = {};
    this.listeners = new Map();
    this.initialized = false;
  }

  // Event subscription
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.listeners.get(event).delete(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try { cb(data); } catch (e) { console.error('Listener error:', e); }
      });
    }
    // Wildcard event
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach(cb => {
        try { cb(event, data); } catch (e) { console.error('Listener error:', e); }
      });
    }
  }

  // Initialize Store
  async init() {
    await AppDB.init();

    // Check if meetings exist in DB
    const existingMeetings = await AppDB.getAll('meetings');

    if (!existingMeetings || existingMeetings.length === 0) {
      // First boot: populate realistic sample data
      await this.resetToSampleData();
    } else {
      await this.loadAll();
    }

    // Apply stored theme
    const theme = this.getSetting('theme', 'light');
    document.documentElement.setAttribute('data-theme', theme);

    // Apply audio setting
    const soundEnabled = this.getSetting('soundEnabled', true);
    const soundVol = this.getSetting('soundVolume', 0.6);
    AudioService.setEnabled(soundEnabled);
    AudioService.setVolume(soundVol);

    this.initialized = true;
    this.emit('state:ready');
  }

  async loadAll() {
    this.meetings = await AppDB.getAll('meetings') || [];
    this.actionItems = await AppDB.getAll('actionItems') || [];
    this.decisions = await AppDB.getAll('decisions') || [];
    this.polls = await AppDB.getAll('polls') || [];

    const rawSettings = await AppDB.getAll('settings') || [];
    this.settings = {};
    rawSettings.forEach(s => {
      this.settings[s.key] = s.value;
    });

    // Sort meetings by date/time
    this.meetings.sort((a, b) => new Date(`${a.date}T${a.startTime || '00:00'}`) - new Date(`${b.date}T${b.startTime || '00:00'}`));
  }

  async resetToSampleData() {
    const sample = getSampleData();
    
    // Clear all
    await AppDB.clear('meetings');
    await AppDB.clear('actionItems');
    await AppDB.clear('decisions');
    await AppDB.clear('polls');
    await AppDB.clear('settings');

    for (const m of sample.meetings) await AppDB.put('meetings', m);
    for (const a of sample.actionItems) await AppDB.put('actionItems', a);
    for (const d of sample.decisions) await AppDB.put('decisions', d);
    for (const p of sample.polls) await AppDB.put('polls', p);
    for (const s of sample.settings) await AppDB.put('settings', s);

    this.participants = sample.participants;
    await this.loadAll();
    this.emit('state:reset');
    this.emit('meetings:changed');
    this.emit('actions:changed');
    this.emit('decisions:changed');
  }

  // --------------------------------------------------------------------------
  // SETTINGS & USER
  // --------------------------------------------------------------------------
  getSetting(key, defaultValue = null) {
    return this.settings[key] !== undefined ? this.settings[key] : defaultValue;
  }

  async setSetting(key, value) {
    this.settings[key] = value;
    await AppDB.put('settings', { key, value });
    this.emit('settings:changed', { key, value });
  }

  async toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    await this.setSetting('theme', next);
    return next;
  }

  getCurrentUser() {
    return this.getSetting('currentUser', {
      id: 'u1',
      name: 'Elena Vance',
      email: 'elena.vance@meetspace.io',
      role: 'Head of Product'
    });
  }

  // --------------------------------------------------------------------------
  // MEETINGS CRUD
  // --------------------------------------------------------------------------
  getMeeting(id) {
    return this.meetings.find(m => m.id === id) || null;
  }

  getMeetings(filter = 'all') {
    const todayStr = new Date().toISOString().split('T')[0];
    if (filter === 'upcoming') {
      return this.meetings.filter(m => m.date >= todayStr && m.status !== 'completed');
    }
    if (filter === 'past') {
      return this.meetings.filter(m => m.date < todayStr || m.status === 'completed');
    }
    if (filter === 'drafts') {
      return this.meetings.filter(m => m.status === 'draft');
    }
    return [...this.meetings];
  }

  async createMeeting(data) {
    const user = this.getCurrentUser();
    const newMeeting = {
      id: `meet-${Date.now()}`,
      title: data.title || 'Untitled Meeting',
      date: data.date || new Date().toISOString().split('T')[0],
      startTime: data.startTime || '10:00',
      duration: parseInt(data.duration, 10) || 30,
      organizer: data.organizer || user.name,
      organizerEmail: data.organizerEmail || user.email,
      location: data.location || 'Virtual / Video Link',
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? data.tags.split(',').map(t => t.trim()) : ['General']),
      status: data.status || 'scheduled',
      description: data.description || '',
      participants: data.participants || [
        { id: user.id, name: user.name, email: user.email, role: user.role, status: 'confirmed' }
      ],
      agenda: data.agenda || [
        { id: `ag-${Date.now()}-1`, title: 'Welcome & Agenda Check-in', duration: 5, completed: false },
        { id: `ag-${Date.now()}-2`, title: 'Main Discussion Topic', duration: 20, completed: false },
        { id: `ag-${Date.now()}-3`, title: 'Action Items & Next Steps', duration: 5, completed: false }
      ],
      notes: data.notes || '<p>Meeting notes will appear here...</p>',
      decisions: data.decisions || [],
      actionItems: data.actionItems || [],
      polls: data.polls || [],
      createdAt: new Date().toISOString()
    };

    this.meetings.push(newMeeting);
    this.meetings.sort((a, b) => new Date(`${a.date}T${a.startTime || '00:00'}`) - new Date(`${b.date}T${b.startTime || '00:00'}`));

    await AppDB.put('meetings', newMeeting);
    this.emit('meetings:changed');
    this.emit('meeting:created', newMeeting);
    return newMeeting;
  }

  async updateMeeting(meeting) {
    const idx = this.meetings.findIndex(m => m.id === meeting.id);
    if (idx >= 0) {
      this.meetings[idx] = { ...this.meetings[idx], ...meeting, updatedAt: new Date().toISOString() };
      await AppDB.put('meetings', this.meetings[idx]);
      this.emit('meeting:updated', this.meetings[idx]);
      this.emit('meetings:changed');
      return this.meetings[idx];
    }
    return null;
  }

  async deleteMeeting(id) {
    const idx = this.meetings.findIndex(m => m.id === id);
    if (idx >= 0) {
      const deleted = this.meetings.splice(idx, 1)[0];
      await AppDB.delete('meetings', id);
      
      // Delete linked action items & decisions
      const relatedActions = this.actionItems.filter(a => a.meetingId === id);
      for (const a of relatedActions) {
        await this.deleteActionItem(a.id);
      }
      const relatedDecisions = this.decisions.filter(d => d.meetingId === id);
      for (const d of relatedDecisions) {
        await this.deleteDecision(d.id);
      }

      this.emit('meetings:changed');
      this.emit('meeting:deleted', deleted);
      return true;
    }
    return false;
  }

  async duplicateMeeting(id) {
    const original = this.getMeeting(id);
    if (!original) return null;

    const dupData = {
      ...JSON.parse(JSON.stringify(original)),
      id: `meet-${Date.now()}`,
      title: `${original.title} (Copy)`,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    // Reset agenda completed flags
    if (dupData.agenda) {
      dupData.agenda.forEach(a => {
        a.id = `ag-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        a.completed = false;
      });
    }

    this.meetings.push(dupData);
    await AppDB.put('meetings', dupData);
    this.emit('meetings:changed');
    return dupData;
  }

  // --------------------------------------------------------------------------
  // AGENDA MANAGEMENT
  // --------------------------------------------------------------------------
  async addAgendaItem(meetingId, item) {
    const meeting = this.getMeeting(meetingId);
    if (!meeting) return null;

    if (!meeting.agenda) meeting.agenda = [];
    const newItem = {
      id: `ag-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: item.title || 'New Agenda Item',
      duration: parseInt(item.duration, 10) || 10,
      presenter: item.presenter || '',
      completed: false,
      notes: ''
    };
    meeting.agenda.push(newItem);
    await this.updateMeeting(meeting);
    return newItem;
  }

  async updateAgendaItem(meetingId, itemId, updates) {
    const meeting = this.getMeeting(meetingId);
    if (!meeting || !meeting.agenda) return null;

    const idx = meeting.agenda.findIndex(a => a.id === itemId);
    if (idx >= 0) {
      meeting.agenda[idx] = { ...meeting.agenda[idx], ...updates };
      await this.updateMeeting(meeting);
      return meeting.agenda[idx];
    }
    return null;
  }

  async deleteAgendaItem(meetingId, itemId) {
    const meeting = this.getMeeting(meetingId);
    if (!meeting || !meeting.agenda) return false;

    meeting.agenda = meeting.agenda.filter(a => a.id !== itemId);
    await this.updateMeeting(meeting);
    return true;
  }

  async reorderAgenda(meetingId, newAgendaList) {
    const meeting = this.getMeeting(meetingId);
    if (!meeting) return false;

    meeting.agenda = newAgendaList;
    await this.updateMeeting(meeting);
    return true;
  }

  // --------------------------------------------------------------------------
  // PARTICIPANTS & ATTENDANCE
  // --------------------------------------------------------------------------
  async updateParticipantStatus(meetingId, participantId, status) {
    const meeting = this.getMeeting(meetingId);
    if (!meeting || !meeting.participants) return false;

    const p = meeting.participants.find(x => x.id === participantId);
    if (p) {
      p.status = status; // confirmed, tentative, declined, absent, present
      await this.updateMeeting(meeting);
      return true;
    }
    return false;
  }

  async addParticipantToMeeting(meetingId, participant) {
    const meeting = this.getMeeting(meetingId);
    if (!meeting) return false;
    if (!meeting.participants) meeting.participants = [];

    const newP = {
      id: `u-${Date.now()}`,
      name: participant.name,
      email: participant.email || '',
      role: participant.role || 'Attendee',
      status: participant.status || 'confirmed'
    };
    meeting.participants.push(newP);
    await this.updateMeeting(meeting);
    return newP;
  }

  // --------------------------------------------------------------------------
  // NOTES & AUTOSAVE
  // --------------------------------------------------------------------------
  async updateNotes(meetingId, notesHtml) {
    const meeting = this.getMeeting(meetingId);
    if (!meeting) return false;

    meeting.notes = notesHtml;
    meeting.notesUpdatedAt = new Date().toISOString();
    await AppDB.put('meetings', meeting);
    this.emit('notes:updated', { meetingId, notes: notesHtml });
    return true;
  }

  // --------------------------------------------------------------------------
  // DECISIONS LOG
  // --------------------------------------------------------------------------
  async addDecision(decisionData) {
    const newDec = {
      id: `dec-${Date.now()}`,
      meetingId: decisionData.meetingId || '',
      title: decisionData.title || 'Untitled Decision',
      rationale: decisionData.rationale || '',
      decidedBy: decisionData.decidedBy || 'Team Consensus',
      impact: decisionData.impact || 'Medium',
      tags: Array.isArray(decisionData.tags) ? decisionData.tags : (decisionData.tags ? decisionData.tags.split(',').map(t => t.trim()) : ['General']),
      timestamp: new Date().toISOString()
    };

    this.decisions.unshift(newDec);
    await AppDB.put('decisions', newDec);

    // Also update in meeting object if linked
    if (newDec.meetingId) {
      const m = this.getMeeting(newDec.meetingId);
      if (m) {
        if (!m.decisions) m.decisions = [];
        m.decisions.unshift(newDec);
        await AppDB.put('meetings', m);
      }
    }

    this.emit('decisions:changed');
    return newDec;
  }

  async deleteDecision(decisionId) {
    const idx = this.decisions.findIndex(d => d.id === decisionId);
    if (idx >= 0) {
      const dec = this.decisions.splice(idx, 1)[0];
      await AppDB.delete('decisions', decisionId);

      if (dec.meetingId) {
        const m = this.getMeeting(dec.meetingId);
        if (m && m.decisions) {
          m.decisions = m.decisions.filter(x => x.id !== decisionId);
          await AppDB.put('meetings', m);
        }
      }

      this.emit('decisions:changed');
      return true;
    }
    return false;
  }

  // --------------------------------------------------------------------------
  // ACTION ITEMS
  // --------------------------------------------------------------------------
  getActionItems(filter = 'all') {
    if (filter === 'todo') return this.actionItems.filter(a => a.status === 'To Do');
    if (filter === 'inprogress') return this.actionItems.filter(a => a.status === 'In Progress');
    if (filter === 'done') return this.actionItems.filter(a => a.status === 'Done');
    return [...this.actionItems];
  }

  async addActionItem(data) {
    const meeting = data.meetingId ? this.getMeeting(data.meetingId) : null;
    const newAction = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      meetingId: data.meetingId || '',
      meetingTitle: meeting ? meeting.title : (data.meetingTitle || 'General'),
      task: data.task || 'Untitled Action Item',
      assignee: data.assignee || 'Elena Vance',
      assigneeEmail: data.assigneeEmail || 'elena.vance@meetspace.io',
      dueDate: data.dueDate || new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString().split('T')[0],
      priority: data.priority || 'Medium', // Urgent, High, Medium, Low
      status: data.status || 'To Do', // To Do, In Progress, Done, Blocked
      createdAt: new Date().toISOString()
    };

    this.actionItems.unshift(newAction);
    await AppDB.put('actionItems', newAction);

    if (newAction.meetingId && meeting) {
      if (!meeting.actionItems) meeting.actionItems = [];
      meeting.actionItems.unshift(newAction);
      await AppDB.put('meetings', meeting);
    }

    this.emit('actions:changed');
    return newAction;
  }

  async updateActionItem(actionId, updates) {
    const idx = this.actionItems.findIndex(a => a.id === actionId);
    if (idx >= 0) {
      this.actionItems[idx] = { ...this.actionItems[idx], ...updates, updatedAt: new Date().toISOString() };
      await AppDB.put('actionItems', this.actionItems[idx]);

      const meetingId = this.actionItems[idx].meetingId;
      if (meetingId) {
        const m = this.getMeeting(meetingId);
        if (m && m.actionItems) {
          const mIdx = m.actionItems.findIndex(x => x.id === actionId);
          if (mIdx >= 0) {
            m.actionItems[mIdx] = this.actionItems[idx];
            await AppDB.put('meetings', m);
          }
        }
      }

      this.emit('actions:changed');
      return this.actionItems[idx];
    }
    return null;
  }

  async deleteActionItem(actionId) {
    const idx = this.actionItems.findIndex(a => a.id === actionId);
    if (idx >= 0) {
      const act = this.actionItems.splice(idx, 1)[0];
      await AppDB.delete('actionItems', actionId);

      if (act.meetingId) {
        const m = this.getMeeting(act.meetingId);
        if (m && m.actionItems) {
          m.actionItems = m.actionItems.filter(x => x.id !== actionId);
          await AppDB.put('meetings', m);
        }
      }

      this.emit('actions:changed');
      return true;
    }
    return false;
  }

  // --------------------------------------------------------------------------
  // POLLS
  // --------------------------------------------------------------------------
  async createPoll(data) {
    const newPoll = {
      id: `poll-${Date.now()}`,
      meetingId: data.meetingId || '',
      question: data.question || 'Poll Question',
      type: data.type || 'single', // single or multiple
      options: (data.options || ['Option A', 'Option B']).map((opt, i) => ({
        id: `opt-${Date.now()}-${i}`,
        text: typeof opt === 'string' ? opt : opt.text,
        votes: typeof opt === 'object' && opt.votes ? opt.votes : 0
      })),
      totalVotes: 0,
      isOpen: true,
      createdAt: new Date().toISOString()
    };

    // Calculate total votes
    newPoll.totalVotes = newPoll.options.reduce((sum, o) => sum + o.votes, 0);

    this.polls.unshift(newPoll);
    await AppDB.put('polls', newPoll);

    if (newPoll.meetingId) {
      const m = this.getMeeting(newPoll.meetingId);
      if (m) {
        if (!m.polls) m.polls = [];
        m.polls.unshift(newPoll);
        await AppDB.put('meetings', m);
      }
    }

    this.emit('polls:changed');
    return newPoll;
  }

  async votePoll(pollId, optionId) {
    const poll = this.polls.find(p => p.id === pollId);
    if (!poll || !poll.isOpen) return false;

    const opt = poll.options.find(o => o.id === optionId);
    if (opt) {
      opt.votes += 1;
      poll.totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);
      await AppDB.put('polls', poll);

      if (poll.meetingId) {
        const m = this.getMeeting(poll.meetingId);
        if (m && m.polls) {
          const mIdx = m.polls.findIndex(p => p.id === pollId);
          if (mIdx >= 0) {
            m.polls[mIdx] = poll;
            await AppDB.put('meetings', m);
          }
        }
      }

      this.emit('polls:changed');
      return true;
    }
    return false;
  }

  async simulatePollVotes(pollId) {
    const poll = this.polls.find(p => p.id === pollId);
    if (!poll || !poll.isOpen) return false;

    // Distribute 5-15 random votes among options
    const additionalVotes = Math.floor(Math.random() * 8) + 4;
    for (let i = 0; i < additionalVotes; i++) {
      const randomOpt = poll.options[Math.floor(Math.random() * poll.options.length)];
      randomOpt.votes += 1;
    }
    poll.totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);
    await AppDB.put('polls', poll);

    if (poll.meetingId) {
      const m = this.getMeeting(poll.meetingId);
      if (m && m.polls) {
        const mIdx = m.polls.findIndex(p => p.id === pollId);
        if (mIdx >= 0) {
          m.polls[mIdx] = poll;
          await AppDB.put('meetings', m);
        }
      }
    }

    this.emit('polls:changed');
    return true;
  }

  // --------------------------------------------------------------------------
  // GLOBAL SEARCH ACROSS ENTITIES
  // --------------------------------------------------------------------------
  globalSearch(query) {
    if (!query || query.trim() === '') return { meetings: [], actionItems: [], decisions: [], notes: [] };

    const q = query.toLowerCase().trim();

    const matchedMeetings = this.meetings.filter(m => 
      m.title.toLowerCase().includes(q) ||
      (m.description && m.description.toLowerCase().includes(q)) ||
      (m.organizer && m.organizer.toLowerCase().includes(q)) ||
      (m.tags && m.tags.some(t => t.toLowerCase().includes(q)))
    );

    const matchedActionItems = this.actionItems.filter(a =>
      a.task.toLowerCase().includes(q) ||
      (a.assignee && a.assignee.toLowerCase().includes(q)) ||
      (a.meetingTitle && a.meetingTitle.toLowerCase().includes(q))
    );

    const matchedDecisions = this.decisions.filter(d =>
      d.title.toLowerCase().includes(q) ||
      (d.rationale && d.rationale.toLowerCase().includes(q)) ||
      (d.decidedBy && d.decidedBy.toLowerCase().includes(q))
    );

    const matchedNotes = this.meetings.filter(m =>
      m.notes && m.notes.toLowerCase().includes(q) && !matchedMeetings.some(found => found.id === m.id)
    );

    return {
      meetings: matchedMeetings,
      actionItems: matchedActionItems,
      decisions: matchedDecisions,
      notes: matchedNotes
    };
  }

  // --------------------------------------------------------------------------
  // ANALYTICS CALCULATIONS
  // --------------------------------------------------------------------------
  getAnalyticsData() {
    const totalMeetings = this.meetings.length;
    const completedMeetings = this.meetings.filter(m => m.status === 'completed').length;
    const totalDurationMinutes = this.meetings.reduce((sum, m) => sum + (m.duration || 0), 0);
    const avgDuration = totalMeetings > 0 ? Math.round(totalDurationMinutes / totalMeetings) : 0;

    const totalActions = this.actionItems.length;
    const completedActions = this.actionItems.filter(a => a.status === 'Done').length;
    const actionCompletionRate = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;

    // Participant Attendance Rate calculation
    let totalRsvp = 0;
    let confirmedRsvp = 0;
    this.meetings.forEach(m => {
      if (m.participants) {
        m.participants.forEach(p => {
          totalRsvp++;
          if (p.status === 'confirmed' || p.status === 'present') confirmedRsvp++;
        });
      }
    });
    const attendanceRate = totalRsvp > 0 ? Math.round((confirmedRsvp / totalRsvp) * 100) : 100;

    // Category distribution
    const tagsCount = {};
    this.meetings.forEach(m => {
      (m.tags || ['General']).forEach(t => {
        tagsCount[t] = (tagsCount[t] || 0) + 1;
      });
    });

    // Priority distribution
    const priorityCount = {
      Urgent: this.actionItems.filter(a => a.priority === 'Urgent').length,
      High: this.actionItems.filter(a => a.priority === 'High').length,
      Medium: this.actionItems.filter(a => a.priority === 'Medium').length,
      Low: this.actionItems.filter(a => a.priority === 'Low').length
    };

    return {
      totalMeetings,
      completedMeetings,
      totalDurationHours: (totalDurationMinutes / 60).toFixed(1),
      avgDuration,
      totalActions,
      completedActions,
      actionCompletionRate,
      attendanceRate,
      tagsCount,
      priorityCount,
      totalDecisions: this.decisions.length
    };
  }
}

const Store = new StateStore();
