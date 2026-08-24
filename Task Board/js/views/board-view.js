/**
 * Kanban Board View
 * Drag and drop between columns, re-ordering, inline task creation, rich compact cards, context menus
 */

window.BoardView = {
  draggedTaskId: null,

  columns: [
    { id: 'backlog', title: 'Backlog', color: '#64748b' },
    { id: 'todo', title: 'To Do', color: '#3b82f6' },
    { id: 'in-progress', title: 'In Progress', color: '#f59e0b' },
    { id: 'review', title: 'Review', color: '#8b5cf6' },
    { id: 'done', title: 'Done', color: '#10b981' }
  ],

  render(container) {
    const tasks = window.State.getFilteredTasks();
    const state = window.State.getState();
    const activeProject = window.State.getProjectById(state.activeProjectId);

    container.innerHTML = `
      <div class="board-container">
        <div class="board-header">
          <div class="board-title-group">
            <h2 style="font-size: var(--font-size-md); font-weight: 700; display: flex; align-items: center; gap: 8px;">
              ${activeProject ? `
                <span class="project-dot" style="background-color: ${activeProject.color}; width: 10px; height: 10px;"></span>
                <span>${window.Utils.escapeHtml(activeProject.name)} Board</span>
              ` : `
                <span>All Projects Board</span>
              `}
            </h2>
            <span class="board-stats-text">${tasks.length} active tasks</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <button class="btn btn-secondary btn-sm" id="boardQuickNewTaskBtn">
              ${window.Icons.get('plus', 14)}
              <span>New Task</span>
            </button>
          </div>
        </div>

        <div class="kanban-canvas" id="kanbanCanvas">
          ${this.columns.map(col => {
            const colTasks = tasks.filter(t => t.status === col.id);
            return `
              <div class="kanban-column" data-status="${col.id}">
                <div class="column-header">
                  <div class="column-header-left">
                    <span class="project-dot" style="background-color: ${col.color};"></span>
                    <span class="column-title">${col.title}</span>
                    <span class="column-count">${colTasks.length}</span>
                  </div>
                  <div class="column-header-actions">
                    <button class="icon-btn-sm col-add-btn" data-status="${col.id}" title="Add Task to ${col.title}" aria-label="Add Task to ${col.title}">
                      ${window.Icons.get('plus', 14)}
                    </button>
                  </div>
                </div>

                <div class="column-card-list" data-status="${col.id}">
                  ${colTasks.length === 0 ? `
                    <div class="column-empty-state">
                      <span>No tasks in ${col.title}</span>
                    </div>
                  ` : colTasks.map(task => this.renderCardHtml(task)).join('')}
                </div>

                <div class="column-quick-add">
                  <button class="quick-add-btn" data-status="${col.id}">
                    ${window.Icons.get('plus', 13)}
                    <span>Add Task</span>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    this.attachEvents(container);
  },

  renderCardHtml(task) {
    const state = window.State.getState();
    const assignee = window.State.getUserById(task.assigneeId);
    const project = window.State.getProjectById(task.projectId);
    
    // Checklist progress calculation
    const checklist = task.checklist || [];
    const totalChk = checklist.length;
    const completedChk = checklist.filter(c => c.completed).length;
    const chkPercent = totalChk > 0 ? Math.round((completedChk / totalChk) * 100) : 0;

    // Due date styling
    const isOverdue = task.dueDate && window.Utils.isOverdue(task.dueDate) && task.status !== 'done';
    const isDueToday = task.dueDate && window.Utils.isToday(task.dueDate);

    // Labels
    const labels = (task.labels || []).map(lblId => window.State.getLabelById(lblId)).filter(Boolean);

    return `
      <div class="task-card" draggable="true" data-task-id="${task.id}" tabindex="0" role="button" aria-label="${window.Utils.escapeHtml(task.title)}">
        <div class="task-card-header">
          <div style="display: flex; align-items: center; gap: 6px;">
            ${project && state.activeProjectId === 'all' ? `
              <span class="project-dot" style="background-color: ${project.color}; width: 6px; height: 6px;" title="${window.Utils.escapeHtml(project.name)}"></span>
            ` : ''}
            <span class="task-card-id">${task.key || 'TB-100'}</span>
          </div>
          <span class="priority-badge priority-${task.priority}">
            ${window.Icons.get(`priority_${task.priority}`, 11)}
            ${task.priority}
          </span>
        </div>

        <div class="task-card-title">${window.Utils.escapeHtml(task.title)}</div>

        ${labels.length > 0 ? `
          <div class="task-card-labels">
            ${labels.map(l => `
              <span class="task-label-chip" style="background-color: ${l.color}15; color: ${l.color}; border-color: ${l.color}35;">
                ${window.Utils.escapeHtml(l.name)}
              </span>
            `).join('')}
          </div>
        ` : ''}

        ${totalChk > 0 ? `
          <div class="task-card-checklist">
            <div class="card-progress-track">
              <div class="card-progress-bar" style="width: ${chkPercent}%;"></div>
            </div>
            <span class="card-checklist-count">
              ${window.Icons.get('check_square', 11)}
              ${completedChk}/${totalChk}
            </span>
          </div>
        ` : ''}

        <div class="task-card-footer">
          <div class="task-footer-left">
            ${task.dueDate ? `
              <span class="task-due-badge ${isOverdue ? 'overdue' : (isDueToday ? 'today' : '')}">
                ${window.Icons.get('clock', 11)}
                ${window.Utils.formatShortDate(task.dueDate)}
              </span>
            ` : ''}
            ${(task.comments && task.comments.length > 0) ? `
              <span class="task-comment-count" title="${task.comments.length} comments">
                ${window.Icons.get('message_square', 11)}
                ${task.comments.length}
              </span>
            ` : ''}
            ${(task.attachments && task.attachments.length > 0) ? `
              <span class="task-attachment-count" title="${task.attachments.length} attachments">
                ${window.Icons.get('paperclip', 11)}
                ${task.attachments.length}
              </span>
            ` : ''}
          </div>
          <div class="task-footer-right">
            ${assignee ? `
              <img src="${assignee.avatar}" alt="${window.Utils.escapeHtml(assignee.name)}" class="avatar-xs" title="Assigned to ${window.Utils.escapeHtml(assignee.name)}">
            ` : `
              <span class="avatar-xs" style="color: var(--text-muted);" title="Unassigned">${window.Icons.get('user', 11)}</span>
            `}
          </div>
        </div>
      </div>
    `;
  },

  attachEvents(container) {
    // Quick New Task in Header
    const topNewTask = container.querySelector('#boardQuickNewTaskBtn');
    if (topNewTask) {
      topNewTask.addEventListener('click', () => window.Modals.openNewTaskModal());
    }

    // Card Click & Context Menu
    container.querySelectorAll('.task-card').forEach(card => {
      const taskId = card.getAttribute('data-task-id');
      const task = window.State.getTaskById(taskId);

      card.addEventListener('click', (e) => {
        if (!card.classList.contains('dragging')) {
          window.Modals.openTaskModal(taskId);
        }
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.Modals.openTaskModal(taskId);
        }
      });

      card.addEventListener('contextmenu', (e) => {
        if (task) window.ContextMenu.showForTask(e, task);
      });

      // Drag Events
      card.addEventListener('dragstart', (e) => {
        this.draggedTaskId = taskId;
        card.classList.add('dragging');
        e.dataTransfer.setData('text/plain', taskId);
        e.dataTransfer.effectAllowed = 'move';
      });

      card.addEventListener('dragend', () => {
        this.draggedTaskId = null;
        card.classList.remove('dragging');
        container.querySelectorAll('.kanban-column').forEach(c => c.classList.remove('drag-over'));
      });
    });

    // Column Drag & Drop Target
    container.querySelectorAll('.column-card-list').forEach(list => {
      const column = list.closest('.kanban-column');
      const status = list.getAttribute('data-status');

      column.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        column.classList.add('drag-over');
      });

      column.addEventListener('dragleave', (e) => {
        if (!column.contains(e.relatedTarget)) {
          column.classList.remove('drag-over');
        }
      });

      column.addEventListener('drop', async (e) => {
        e.preventDefault();
        column.classList.remove('drag-over');
        const taskId = e.dataTransfer.getData('text/plain') || this.draggedTaskId;
        if (taskId) {
          await window.State.moveTaskStatus(taskId, status);
          this.render(container);
        }
      });
    });

    // Quick Add Buttons
    container.querySelectorAll('.quick-add-btn, .col-add-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const status = btn.getAttribute('data-status');
        const column = btn.closest('.kanban-column');
        const quickAddContainer = column.querySelector('.column-quick-add');

        quickAddContainer.innerHTML = `
          <div class="quick-add-form">
            <textarea class="quick-add-input" placeholder="Task title..." rows="2" autofocus></textarea>
            <div class="quick-add-controls">
              <button class="btn btn-ghost btn-xs cancel-quick-add">Cancel</button>
              <button class="btn btn-primary btn-xs save-quick-add">Add</button>
            </div>
          </div>
        `;

        const textarea = quickAddContainer.querySelector('.quick-add-input');
        const saveBtn = quickAddContainer.querySelector('.save-quick-add');
        const cancelBtn = quickAddContainer.querySelector('.cancel-quick-add');

        textarea.focus();

        const saveTask = async () => {
          const title = textarea.value.trim();
          if (title) {
            await window.State.createTask({ title, status });
            this.render(container);
          } else {
            this.render(container);
          }
        };

        saveBtn.addEventListener('click', saveTask);
        cancelBtn.addEventListener('click', () => this.render(container));

        textarea.addEventListener('keydown', (ke) => {
          if (ke.key === 'Enter' && !ke.shiftKey) {
            ke.preventDefault();
            saveTask();
          } else if (ke.key === 'Escape') {
            this.render(container);
          }
        });
      });
    });
  }
};
