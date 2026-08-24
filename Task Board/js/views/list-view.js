/**
 * List View
 * Table view with grouping, column sorting, multi-select checkboxes, and batch action toolbar
 */

window.ListView = {
  groupBy: 'status', // 'status' | 'priority' | 'assignee' | 'project'
  sortBy: 'createdAt',
  sortOrder: 'desc',
  selectedTaskIds: new Set(),

  render(container) {
    let tasks = window.State.getFilteredTasks();
    const state = window.State.getState();

    // Sort tasks
    tasks = this.sortTasks(tasks);

    // Group tasks
    const groups = this.groupTasks(tasks);

    container.innerHTML = `
      <div class="list-view-container">
        <!-- List Toolbar -->
        <div class="list-toolbar">
          <div class="list-toolbar-left">
            <div class="list-group-select">
              <span>Group by:</span>
              <select class="form-select form-select-sm" id="listGroupBySelect">
                <option value="status" ${this.groupBy === 'status' ? 'selected' : ''}>Status</option>
                <option value="priority" ${this.groupBy === 'priority' ? 'selected' : ''}>Priority</option>
                <option value="assignee" ${this.groupBy === 'assignee' ? 'selected' : ''}>Assignee</option>
                <option value="project" ${this.groupBy === 'project' ? 'selected' : ''}>Project</option>
              </select>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <button class="btn btn-secondary btn-sm" id="listSelectAllBtn">
              ${this.selectedTaskIds.size === tasks.length && tasks.length > 0 ? 'Deselect All' : 'Select All'}
            </button>
            <button class="btn btn-primary btn-sm" id="listNewTaskBtn">
              ${window.Icons.get('plus', 14)}
              <span>New Task</span>
            </button>
          </div>
        </div>

        <!-- Group Sections -->
        ${groups.map(group => `
          <div class="list-group-section">
            <div class="list-group-header">
              <div class="list-group-title">
                ${group.color ? `<span class="project-dot" style="background-color: ${group.color};"></span>` : ''}
                <span>${window.Utils.escapeHtml(group.name)}</span>
              </div>
              <span class="list-group-count">${group.tasks.length}</span>
            </div>

            <table class="list-table">
              <thead class="list-table-header">
                <tr>
                  <th class="list-cell-check"><input type="checkbox" class="group-select-all-chk" data-group-key="${group.key}"></th>
                  <th class="list-cell-id sortable" data-sort="key">Key</th>
                  <th class="list-cell-title sortable" data-sort="title">Title</th>
                  <th class="list-cell-status sortable" data-sort="status">Status</th>
                  <th class="list-cell-priority sortable" data-sort="priority">Priority</th>
                  <th class="list-cell-assignee sortable" data-sort="assignee">Assignee</th>
                  <th class="list-cell-due sortable" data-sort="dueDate">Due Date</th>
                  <th class="list-cell-labels">Labels</th>
                </tr>
              </thead>
              <tbody>
                ${group.tasks.length === 0 ? `
                  <tr>
                    <td colspan="8" style="text-align: center; padding: 20px; color: var(--text-muted);">
                      No tasks in this group
                    </td>
                  </tr>
                ` : group.tasks.map(t => this.renderRowHtml(t)).join('')}
              </tbody>
            </table>
          </div>
        `).join('')}

        <!-- Floating Batch Action Toolbar -->
        ${this.selectedTaskIds.size > 0 ? `
          <div class="batch-actions-bar">
            <span class="batch-count-badge">${this.selectedTaskIds.size} Selected</span>
            <div class="batch-action-buttons">
              <select class="form-select form-select-sm" id="batchStatusSelect">
                <option value="">Move status...</option>
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>

              <select class="form-select form-select-sm" id="batchAssigneeSelect">
                <option value="">Assign member...</option>
                ${state.users.map(u => `<option value="${u.id}">${window.Utils.escapeHtml(u.name)}</option>`).join('')}
              </select>

              <button class="btn btn-danger btn-xs" id="batchDeleteBtn">
                ${window.Icons.get('trash', 12)}
                <span>Delete</span>
              </button>

              <button class="btn btn-ghost btn-xs" id="batchClearBtn">Cancel</button>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    this.attachEvents(container);
  },

  renderRowHtml(task) {
    const isSelected = this.selectedTaskIds.has(task.id);
    const assignee = window.State.getUserById(task.assigneeId);
    const labels = (task.labels || []).map(lblId => window.State.getLabelById(lblId)).filter(Boolean);
    const isOverdue = task.dueDate && window.Utils.isOverdue(task.dueDate) && task.status !== 'done';
    const isDueToday = task.dueDate && window.Utils.isToday(task.dueDate);

    return `
      <tr class="list-row ${isSelected ? 'selected' : ''}" data-task-id="${task.id}">
        <td class="list-cell list-cell-check">
          <input type="checkbox" class="task-row-checkbox" ${isSelected ? 'checked' : ''} data-task-id="${task.id}">
        </td>
        <td class="list-cell list-cell-id">${task.key || 'TB-100'}</td>
        <td class="list-cell list-cell-title">${window.Utils.escapeHtml(task.title)}</td>
        <td class="list-cell list-cell-status">
          <select class="list-inline-select inline-status-select" data-task-id="${task.id}">
            <option value="backlog" ${task.status === 'backlog' ? 'selected' : ''}>Backlog</option>
            <option value="todo" ${task.status === 'todo' ? 'selected' : ''}>To Do</option>
            <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
            <option value="review" ${task.status === 'review' ? 'selected' : ''}>Review</option>
            <option value="done" ${task.status === 'done' ? 'selected' : ''}>Done</option>
          </select>
        </td>
        <td class="list-cell list-cell-priority">
          <span class="priority-badge priority-${task.priority}">
            ${window.Icons.get(`priority_${task.priority}`, 11)}
            ${task.priority}
          </span>
        </td>
        <td class="list-cell list-cell-assignee">
          ${assignee ? `
            <div style="display: flex; align-items: center; gap: 6px;">
              <img src="${assignee.avatar}" alt="${window.Utils.escapeHtml(assignee.name)}" class="avatar-xs">
              <span style="font-size: 12px;">${window.Utils.escapeHtml(assignee.name)}</span>
            </div>
          ` : `<span style="color: var(--text-muted); font-size: 12px;">Unassigned</span>`}
        </td>
        <td class="list-cell list-cell-due">
          ${task.dueDate ? `
            <span class="task-due-badge ${isOverdue ? 'overdue' : (isDueToday ? 'today' : '')}">
              ${window.Utils.formatShortDate(task.dueDate)}
            </span>
          ` : `<span style="color: var(--text-muted);">-</span>`}
        </td>
        <td class="list-cell list-cell-labels">
          <div style="display: flex; gap: 4px; flex-wrap: wrap;">
            ${labels.map(l => `
              <span class="task-label-chip" style="background-color: ${l.color}20; color: ${l.color}; border-color: ${l.color}40;">
                ${window.Utils.escapeHtml(l.name)}
              </span>
            `).join('')}
          </div>
        </td>
      </tr>
    `;
  },

  sortTasks(tasks) {
    return [...tasks].sort((a, b) => {
      let valA = a[this.sortBy];
      let valB = b[this.sortBy];

      if (this.sortBy === 'dueDate') {
        valA = a.dueDate ? new Date(a.dueDate).getTime() : 9999999999999;
        valB = b.dueDate ? new Date(b.dueDate).getTime() : 9999999999999;
      }

      if (valA < valB) return this.sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  },

  groupTasks(tasks) {
    const state = window.State.getState();

    if (this.groupBy === 'status') {
      const statuses = [
        { key: 'backlog', name: 'Backlog', color: '#64748b' },
        { key: 'todo', name: 'To Do', color: '#3b82f6' },
        { key: 'in-progress', name: 'In Progress', color: '#f59e0b' },
        { key: 'review', name: 'Review', color: '#8b5cf6' },
        { key: 'done', name: 'Done', color: '#10b981' }
      ];
      return statuses.map(s => ({
        ...s,
        tasks: tasks.filter(t => t.status === s.key)
      }));
    }

    if (this.groupBy === 'priority') {
      const priorities = [
        { key: 'urgent', name: 'Urgent', color: 'var(--color-urgent)' },
        { key: 'high', name: 'High', color: 'var(--color-high)' },
        { key: 'medium', name: 'Medium', color: 'var(--color-medium)' },
        { key: 'low', name: 'Low', color: 'var(--color-low)' },
        { key: 'none', name: 'No Priority', color: 'var(--color-none)' }
      ];
      return priorities.map(p => ({
        ...p,
        tasks: tasks.filter(t => t.priority === p.key)
      }));
    }

    if (this.groupBy === 'assignee') {
      const groups = state.users.map(u => ({
        key: u.id,
        name: u.name,
        color: '#6366f1',
        tasks: tasks.filter(t => t.assigneeId === u.id)
      }));
      groups.push({
        key: 'unassigned',
        name: 'Unassigned',
        color: '#64748b',
        tasks: tasks.filter(t => !t.assigneeId)
      });
      return groups;
    }

    if (this.groupBy === 'project') {
      return state.projects.map(p => ({
        key: p.id,
        name: p.name,
        color: p.color,
        tasks: tasks.filter(t => t.projectId === p.id)
      }));
    }

    return [{ key: 'all', name: 'All Tasks', tasks }];
  },

  attachEvents(container) {
    // Group select
    const groupSelect = container.querySelector('#listGroupBySelect');
    if (groupSelect) {
      groupSelect.addEventListener('change', () => {
        this.groupBy = groupSelect.value;
        this.render(container);
      });
    }

    // New task button
    const newTaskBtn = container.querySelector('#listNewTaskBtn');
    if (newTaskBtn) {
      newTaskBtn.addEventListener('click', () => window.Modals.openNewTaskModal());
    }

    // Select all button
    const selectAllBtn = container.querySelector('#listSelectAllBtn');
    if (selectAllBtn) {
      selectAllBtn.addEventListener('click', () => {
        const tasks = window.State.getFilteredTasks();
        if (this.selectedTaskIds.size === tasks.length) {
          this.selectedTaskIds.clear();
        } else {
          tasks.forEach(t => this.selectedTaskIds.add(t.id));
        }
        this.render(container);
      });
    }

    // Row Checkboxes
    container.querySelectorAll('.task-row-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        e.stopPropagation();
        const taskId = cb.getAttribute('data-task-id');
        if (cb.checked) {
          this.selectedTaskIds.add(taskId);
        } else {
          this.selectedTaskIds.delete(taskId);
        }
        this.render(container);
      });
    });

    // Row Click & Context Menu
    container.querySelectorAll('.list-row').forEach(row => {
      const taskId = row.getAttribute('data-task-id');
      const task = window.State.getTaskById(taskId);

      row.querySelector('.list-cell-title').addEventListener('click', () => {
        window.Modals.openTaskModal(taskId);
      });

      row.addEventListener('contextmenu', (e) => {
        if (task) window.ContextMenu.showForTask(e, task);
      });
    });

    // Inline Status Change
    container.querySelectorAll('.inline-status-select').forEach(sel => {
      sel.addEventListener('change', async (e) => {
        e.stopPropagation();
        const taskId = sel.getAttribute('data-task-id');
        await window.State.moveTaskStatus(taskId, sel.value);
        this.render(container);
      });
    });

    // Sort column headers
    container.querySelectorAll('th.sortable').forEach(th => {
      th.addEventListener('click', () => {
        const sortField = th.getAttribute('data-sort');
        if (this.sortBy === sortField) {
          this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortBy = sortField;
          this.sortOrder = 'asc';
        }
        this.render(container);
      });
    });

    // Batch Actions
    const batchStatus = container.querySelector('#batchStatusSelect');
    if (batchStatus) {
      batchStatus.addEventListener('change', async () => {
        const newStatus = batchStatus.value;
        if (newStatus) {
          for (const tId of this.selectedTaskIds) {
            await window.State.moveTaskStatus(tId, newStatus);
          }
          window.Notifications.success(`Updated status for ${this.selectedTaskIds.size} tasks`);
          this.selectedTaskIds.clear();
          this.render(container);
        }
      });
    }

    const batchAssign = container.querySelector('#batchAssigneeSelect');
    if (batchAssign) {
      batchAssign.addEventListener('change', async () => {
        const newAssignee = batchAssign.value;
        if (newAssignee) {
          for (const tId of this.selectedTaskIds) {
            await window.State.updateTask(tId, { assigneeId: newAssignee });
          }
          window.Notifications.success(`Assigned ${this.selectedTaskIds.size} tasks`);
          this.selectedTaskIds.clear();
          this.render(container);
        }
      });
    }

    const batchDelete = container.querySelector('#batchDeleteBtn');
    if (batchDelete) {
      batchDelete.addEventListener('click', () => {
        window.Modals.confirm({
          title: 'Delete Selected Tasks',
          message: `Are you sure you want to delete ${this.selectedTaskIds.size} selected tasks?`,
          onConfirm: async () => {
            for (const tId of this.selectedTaskIds) {
              await window.State.deleteTask(tId);
            }
            window.Notifications.success(`Deleted selected tasks`, { hasUndo: true });
            this.selectedTaskIds.clear();
            this.render(container);
          }
        });
      });
    }

    const batchClear = container.querySelector('#batchClearBtn');
    if (batchClear) {
      batchClear.addEventListener('click', () => {
        this.selectedTaskIds.clear();
        this.render(container);
      });
    }
  }
};
