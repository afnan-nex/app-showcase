/**
 * MeetSpace - Global Decisions Repository View
 * Searchable, tagged knowledge repository of all decisions recorded across meetings
 */

const DecisionsView = {
  searchQuery: '',
  selectedTag: 'all',

  render(container) {
    let decisions = [...Store.decisions];

    // Filter search
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      decisions = decisions.filter(d =>
        d.title.toLowerCase().includes(q) ||
        (d.rationale && d.rationale.toLowerCase().includes(q)) ||
        (d.decidedBy && d.decidedBy.toLowerCase().includes(q))
      );
    }

    // Filter tag
    if (this.selectedTag !== 'all') {
      decisions = decisions.filter(d => d.tags && d.tags.includes(this.selectedTag));
    }

    // Collect tags
    const allTags = new Set();
    Store.decisions.forEach(d => {
      (d.tags || []).forEach(t => allTags.add(t));
    });

    container.innerHTML = `
      <div class="flex-col gap-6">
        <!-- View Header -->
        <div class="view-header">
          <div class="view-title-group">
            <h1 class="view-title">${Icons.decision(24)} Decisions Hub</h1>
            <p class="view-subtitle">Searchable institutional memory of team consensus, architecture, and policy choices</p>
          </div>
          <div class="view-actions">
            <button class="btn btn-primary" onclick="window.DecisionsView.promptCreateDecision()">
              ${Icons.plus(16)} Log Decision
            </button>
          </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="card" style="padding: 12px 16px;">
          <div class="flex items-center justify-between gap-4 flex-wrap">
            <div style="position: relative; flex: 1; max-width: 380px;">
              <input type="text" id="decision-search-input" class="form-input" placeholder="Search decisions and rationale..." value="${this._escape(this.searchQuery)}" style="padding-left: 32px; font-size: 0.85rem;" />
              <span style="position: absolute; left: 10px; top: 9px; color: var(--text-dim);">${Icons.search(14)}</span>
            </div>

            <div class="flex items-center gap-2">
              <select class="form-select" style="font-size: 0.85rem; width: auto;" onchange="window.DecisionsView.setTag(this.value)">
                <option value="all" ${this.selectedTag === 'all' ? 'selected' : ''}>All Tags (${Store.decisions.length})</option>
                ${Array.from(allTags).map(t => `<option value="${this._escape(t)}" ${this.selectedTag === t ? 'selected' : ''}>${this._escape(t)}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>

        <!-- Decisions List -->
        ${decisions.length === 0 ? `
          <div class="card" style="padding: 48px 24px; text-align: center;">
            <div style="color: var(--text-dim); margin-bottom: 12px;">${Icons.decision(36)}</div>
            <h3 style="font-size: 1.1rem; margin-bottom: 6px;">No decisions found</h3>
            <p class="text-muted" style="font-size: 0.875rem; margin-bottom: 16px;">Try adjusting your search query or log a new team decision.</p>
            <button class="btn btn-primary btn-sm" onclick="window.DecisionsView.promptCreateDecision()">${Icons.plus(14)} Log Decision</button>
          </div>
        ` : `
          <div class="decision-stream">
            ${decisions.map(d => {
              const meeting = d.meetingId ? Store.getMeeting(d.meetingId) : null;
              return `
                <div class="decision-card">
                  <div class="decision-header">
                    <div class="flex items-center gap-3">
                      <span class="decision-title" style="font-size: 1.05rem;">${this._escape(d.title)}</span>
                      <span class="badge ${d.impact === 'High' ? 'badge-urgent' : 'badge-tag'}">${d.impact || 'Medium'} Impact</span>
                      ${(d.tags || []).map(t => `<span class="badge badge-tag">${this._escape(t)}</span>`).join('')}
                    </div>
                    <div class="flex items-center gap-2">
                      ${meeting ? `
                        <a href="#/meeting/${meeting.id}" class="btn btn-secondary btn-sm" style="font-size:0.75rem;">
                          ${Icons.calendar(12)} ${this._escape(meeting.title)}
                        </a>
                      ` : ''}
                      <button class="btn btn-ghost btn-sm btn-icon-only text-dim" onclick="window.DecisionsView.deleteDecision('${d.id}')" title="Delete Decision">
                        ${Icons.trash(14)}
                      </button>
                    </div>
                  </div>

                  <div class="decision-body" style="font-size: 0.9rem; line-height: 1.5;">
                    ${this._escape(d.rationale)}
                  </div>

                  <div class="decision-footer" style="border-top: 1px solid var(--border-subtle); margin-top: 8px;">
                    <span>Decided by: <strong>${this._escape(d.decidedBy)}</strong></span>
                    <span class="text-dim">${this._formatTimestamp(d.timestamp)}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;

    // Bind search input
    const sInput = container.querySelector('#decision-search-input');
    if (sInput) {
      sInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.render(container);
      });
    }
  },

  setTag(tag) {
    this.selectedTag = tag;
    this.render(document.getElementById('main-content-view'));
  },

  promptCreateDecision() {
    const title = prompt('Decision Title:');
    if (!title || !title.trim()) return;
    const rationale = prompt('Rationale and Context:', '') || '';
    const decidedBy = prompt('Decided by:', Store.getCurrentUser().name) || Store.getCurrentUser().name;
    const impact = prompt('Impact (High, Medium, Low):', 'Medium') || 'Medium';

    Store.addDecision({ title: title.trim(), rationale, decidedBy, impact }).then(() => {
      Notifier.show('Decision Logged', title, 'success');
      this.render(document.getElementById('main-content-view'));
    });
  },

  async deleteDecision(id) {
    if (confirm('Delete this decision log entry?')) {
      await Store.deleteDecision(id);
      this.render(document.getElementById('main-content-view'));
    }
  },

  _formatTimestamp(iso) {
    try {
      return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return iso;
    }
  },

  _escape(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

window.DecisionsView = DecisionsView;
