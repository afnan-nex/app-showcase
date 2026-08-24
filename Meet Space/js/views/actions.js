/**
 * MeetSpace - Global Action Items Management Hub
 * Kanban board & Table views with filtering by assignee, priority, status, and meeting source
 */

const ActionItemsView = {
  currentFilter: 'all', // 'all', 'todo', 'inprogress', 'done'
  selectedAssignee: 'all',
  selectedPriority: 'all',
  searchQuery: '',
  viewMode: 'table', // 'table' or 'board'

  render(container) {
    let actions = Store.getActionItems(this.currentFilter);

    // Apply search
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      actions = actions.filter(a =>
        a.task.toLowerCase().includes(q) ||
        (a.assignee && a.assignee.toLowerCase().includes(q)) ||
        (a.meetingTitle && a.meetingTitle.toLowerCase().includes(q))
      );
    }

    // Apply assignee filter
    if (this.selectedAssignee !== 'all') {
      actions = actions.filter(a => a.assignee === this.selectedAssignee);
    }

    // Apply priority filter
    if (this.selectedPriority !== 'all') {
      actions = actions.filter(a => a.priority === this.selectedPriority);
    }

    // Unique assignees
    const assignees = new Set();
    Store.actionItems.forEach(a => { if (a.assignee) assignees.add(a.assignee); });

    container.innerHTML = `
      <div class="flex-col gap-6">
        <!-- View Header -->
        <div class="view-header">
          <div class="view-title-group">
            <h1 class="view-title">${Icons.checkSquare(24)} Global Action Items</h1>
            <p class="view-subtitle">Track deliverables, ownership, and due dates across all workspace meetings</p>
          </div>
          <div class="view-actions">
            <button class="btn btn-primary" onclick="window.ActionItemsView.promptCreateGlobalAction()">
              ${Icons.plus(16)} New Action Item
            </button>
          </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="card" style="padding: 12px 16px;">
          <div class="flex items-center justify-between gap-4 flex-wrap">
            <!-- Filter Tabs -->
            <div class="tabs-nav" style="margin-bottom: 0; border-bottom: none;">
              <button class="tab-btn ${this.currentFilter === 'all' ? 'active' : ''}" onclick="window.ActionItemsView.setFilter('all')">
                All (${Store.actionItems.length})
              </button>
              <button class="tab-btn ${this.currentFilter === 'todo' ? 'active' : ''}" onclick="window.ActionItemsView.setFilter('todo')">
                To Do (${Store.getActionItems('todo').length})
              </button>
              <button class="tab-btn ${this.currentFilter === 'inprogress' ? 'active' : ''}" onclick="window.ActionItemsView.setFilter('inprogress')">
                In Progress (${Store.getActionItems('inprogress').length})
              </button>
              <button class="tab-btn ${this.currentFilter === 'done' ? 'active' : ''}" onclick="window.ActionItemsView.setFilter('done')">
                Done (${Store.getActionItems('done').length})
              </button>
            </div>

            <!-- Filters & Layout Switcher -->
            <div class="flex items-center gap-2 flex-wrap">
              <div style="position: relative; min-width: 180px;">
                <input type="text" id="action-search-input" class="form-input" placeholder="Search tasks..." value="${this._escape(this.searchQuery)}" style="padding-left: 30px; font-size: 0.825rem;" />
                <span style="position: absolute; left: 9px; top: 9px; color: var(--text-dim);">${Icons.search(14)}</span>
              </div>

              <select class="form-select" style="font-size: 0.825rem; width: auto;" onchange="window.ActionItemsView.setAssignee(this.value)">
                <option value="all" ${this.selectedAssignee === 'all' ? 'selected' : ''}>All Assignees</option>
                ${Array.from(assignees).map(u => `<option value="${this._escape(u)}" ${this.selectedAssignee === u ? 'selected' : ''}>${this._escape(u)}</option>`).join('')}
              </select>

              <select class="form-select" style="font-size: 0.825rem; width: auto;" onchange="window.ActionItemsView.setPriority(this.value)">
                <option value="all" ${this.selectedPriority === 'all' ? 'selected' : ''}>All Priorities</option>
                <option value="Urgent" ${this.selectedPriority === 'Urgent' ? 'selected' : ''}>Urgent</option>
                <option value="High" ${this.selectedPriority === 'High' ? 'selected' : ''}>High</option>
                <option value="Medium" ${this.selectedPriority === 'Medium' ? 'selected' : ''}>Medium</option>
                <option value="Low" ${this.selectedPriority === 'Low' ? 'selected' : ''}>Low</option>
              </select>

              <div class="flex items-center" style="background: var(--bg-subtle); border-radius: var(--radius-sm); border: 1px solid var(--border-default); padding: 2px;">
                <button class="btn btn-ghost btn-sm btn-icon-only ${this.viewMode === 'table' ? 'active' : ''}" onclick="window.ActionItemsView.setViewMode('table')" title="Table View">
                  ${Icons.agenda(16)}
                </button>
                <button class="btn btn-ghost btn-sm btn-icon-only ${this.viewMode === 'board' ? 'active' : ''}" onclick="window.ActionItemsView.setViewMode('board')" title="Kanban Board View">
                  ${Icons.dashboard(16)}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Render Content Table or Board -->
        ${actions.length === 0 ? `
          <div class="card" style="padding: 48px 24px; text-align: center;">
            <div style="color: var(--text-dim); margin-bottom: 12px;">${Icons.checkSquare(36)}</div>
            <h3 style="font-size: 1.1rem; margin-bottom: 6px;">No action items found</h3>
            <p class="text-muted" style="font-size: 0.875rem; margin-bottom: 16px;">Try adjusting your filters or create a new action item.</p>
            <button class="btn btn-primary btn-sm" onclick="window.ActionItemsView.promptCreateGlobalAction()">${Icons.plus(14)} Add Action Item</button>
          </div>
        ` : (this.viewMode === 'board' ? this._renderKanbanBoard(actions) : this._renderTable(actions))}
      </div>
    `;

    // Search event
    const sInput = container.querySelector('#action-search-input');
    if (sInput) {
      sInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.render(container);
      });
    }
  },

  _renderTable(actions) {
    return `
      <div class="card" style="padding: 0; overflow-x: auto;">
        <table>
          <thead>
            <tr style="background: var(--bg-subtle); border-bottom: 1px solid var(--border-default); text-align: left; font-size: 0.775rem; color: var(--text-muted); text-transform: uppercase;">
              <th style="padding: 10px 16px; width: 40px;"></th>
              <th style="padding: 10px 16px;">Task Description</th>
              <th style="padding: 10px 16px;">Assignee</th>
              <th style="padding: 10px 16px;">Originating Meeting</th>
              <th style="padding: 10px 16px;">Due Date</th>
              <th style="padding: 10px 16px;">Priority</th>
              <th style="padding: 10px 16px;">Status</th>
              <th style="padding: 10px 16px; text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${actions.map(act => `
              <tr style="border-bottom: 1px solid var(--border-subtle); font-size: 0.875rem;">
                <td style="padding: 10px 16px;">
                  <button class="agenda-check-btn ${act.status === 'Done' ? 'checked' : ''}" onclick="window.ActionItemsView.toggleAction('${act.id}')">
                    ${Icons.check(12)}
                  </button>
                </td>
                <td style="padding: 10px 16px; font-weight: 500; ${act.status === 'Done' ? 'text-decoration: line-through; opacity: 0.6;' : ''}">
                  ${this._escape(act.task)}
                </td>
                <td style="padding: 10px 16px; white-space: nowrap;">
                  <div class="flex items-center gap-2">
                    <div class="avatar avatar-xs">${(act.assignee || 'U').charAt(0)}</div>
                    <span>${this._escape(act.assignee || 'Unassigned')}</span>
                  </div>
                </td>
                <td style="padding: 10px 16px; color: var(--text-secondary); max-width: 200px;" class="truncate">
                  ${act.meetingId ? `<a href="#/meeting/${act.meetingId}">${this._escape(act.meetingTitle || 'Meeting')}</a>` : 'General Workspace'}
                </td>
                <td style="padding: 10px 16px; font-size: 0.8rem; color: var(--text-muted); white-space: nowrap;">
                  ${act.dueDate || 'No date'}
                </td>
                <td style="padding: 10px 16px;">
                  <span class="badge ${this._getPriorityBadgeClass(act.priority)}">${act.priority}</span>
                </td>
                <td style="padding: 10px 16px;">
                  <select class="form-select" style="font-size: 0.75rem; padding: 2px 6px; width: auto;" onchange="window.ActionItemsView.updateStatus('${act.id}', this.value)">
                    <option value="To Do" ${act.status === 'To Do' ? 'selected' : ''}>To Do</option>
                    <option value="In Progress" ${act.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Done" ${act.status === 'Done' ? 'selected' : ''}>Done</option>
                    <option value="Blocked" ${act.status === 'Blocked' ? 'selected' : ''}>Blocked</option>
                  </select>
                </td>
                <td style="padding: 10px 16px; text-align: right;">
                  <button class="btn btn-ghost btn-sm btn-icon-only text-dim" onclick="window.ActionItemsView.deleteAction('${act.id}')" title="Delete">
                    ${Icons.trash(14)}
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  _renderKanbanBoard(actions) {
    const columns = [
      { id: 'To Do', title: 'To Do', items: actions.filter(a => a.status === 'To Do') },
      { id: 'In Progress', title: 'In Progress', items: actions.filter(a => a.status === 'In Progress') },
      { id: 'Done', title: 'Completed', items: actions.filter(a => a.status === 'Done') },
      { id: 'Blocked', title: 'Blocked', items: actions.filter(a => a.status === 'Blocked') }
    ];

    return `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; align-items: start;">
        ${columns.map(col => `
          <div class="card" style="padding: 12px; background: var(--bg-subtle);">
            <div class="flex items-center justify-between" style="margin-bottom: 12px; font-weight: 600; font-size: 0.875rem;">
              <span>${col.title}</span>
              <span class="badge badge-tag">${col.items.length}</span>
            </div>
            <div class="flex-col gap-2">
              ${col.items.length === 0 ? `
                <div style="padding: 24px 8px; text-align: center; color: var(--text-dim); font-size: 0.8rem;">
                  No items
                </div>
              ` : col.items.map(act => `
                <div class="card card-hover" style="padding: 10px; cursor: pointer;" onclick="window.ActionItemsView.toggleAction('${act.id}')">
                  <div class="flex items-center justify-between" style="margin-bottom: 6px;">
                    <span class="badge ${this._getPriorityBadgeClass(act.priority)}" style="font-size:0.65rem;">${act.priority}</span>
                    <span style="font-size: 0.725rem; color: var(--text-dim);">${act.dueDate || ''}</span>
                  </div>
                  <div style="font-size: 0.875rem; font-weight: 500; margin-bottom: 8px; ${act.status === 'Done' ? 'text-decoration: line-through; opacity: 0.6;' : ''}">
                    ${this._escape(act.task)}
                  </div>
                  <div class="flex items-center justify-between" style="font-size: 0.75rem; color: var(--text-muted);">
                    <div class="flex items-center gap-1">
                      <div class="avatar avatar-xs">${(act.assignee || 'U').charAt(0)}</div>
                      <span>${this._escape(act.assignee)}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  setFilter(filter) {
    this.currentFilter = filter;
    this.render(document.getElementById('main-content-view'));
  },

  setAssignee(a) {
    this.selectedAssignee = a;
    this.render(document.getElementById('main-content-view'));
  },

  setPriority(p) {
    this.selectedPriority = p;
    this.render(document.getElementById('main-content-view'));
  },

  setViewMode(mode) {
    this.viewMode = mode;
    this.render(document.getElementById('main-content-view'));
  },

  async toggleAction(id) {
    const act = Store.actionItems.find(a => a.id === id);
    if (act) {
      const next = act.status === 'Done' ? 'To Do' : 'Done';
      await Store.updateActionItem(id, { status: next });
      this.render(document.getElementById('main-content-view'));
    }
  },

  async updateStatus(id, status) {
    await Store.updateActionItem(id, { status });
    this.render(document.getElementById('main-content-view'));
  },

  async deleteAction(id) {
    if (confirm('Delete this action item?')) {
      await Store.deleteActionItem(id);
      this.render(document.getElementById('main-content-view'));
    }
  },

  promptCreateGlobalAction() {
    const task = prompt('Action item description:');
    if (!task || !task.trim()) return;
    const assignee = prompt('Assignee name:', Store.getCurrentUser().name) || Store.getCurrentUser().name;
    const priority = prompt('Priority (Urgent, High, Medium, Low):', 'Medium') || 'Medium';

    Store.addActionItem({ task: task.trim(), assignee, priority }).then(() => {
      Notifier.show('Action Item Created', task, 'success');
      this.render(document.getElementById('main-content-view'));
    });
  },

  _getPriorityBadgeClass(priority) {
    if (priority === 'Urgent') return 'badge-urgent';
    if (priority === 'High') return 'badge-tentative';
    if (priority === 'Medium') return 'badge-info';
    return 'badge-tag';
  },

  _escape(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

window.ActionItemsView = ActionItemsView;
