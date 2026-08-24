/**
 * Modals Manager for TaskBoard
 * Handles Task details drawer, Project creation/edit, Keyboard shortcuts cheatsheet, and Confirmation dialogues
 */

window.Modals = {
  currentTaskId: null,
  confirmCallback: null,

  init() {
    this.initTaskModal();
    this.initProjectModal();
    this.initShortcutsModal();
    this.initConfirmModal();
  },

  // ================= TASK DETAIL MODAL =================
  initTaskModal() {
    const overlay = document.getElementById('taskDetailModalOverlay');
    const closeBtn = document.getElementById('taskModalCloseBtn');
    const titleInput = document.getElementById('taskModalTitle');
    const descInput = document.getElementById('taskModalDesc');
    const statusSelect = document.getElementById('taskModalStatus');
    const prioritySelect = document.getElementById('taskModalPriority');
    const assigneeSelect = document.getElementById('taskModalAssignee');
    const projectSelect = document.getElementById('taskModalProject');
    const dueDateInput = document.getElementById('taskModalDueDate');

    if (!overlay) return;

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.closeTaskModal();
    });
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeTaskModal());

    // Live saving field handlers
    titleInput.addEventListener('input', window.Utils.debounce(() => {
      if (this.currentTaskId) {
        window.State.updateTask(this.currentTaskId, { title: titleInput.value.trim() || 'Untitled Task' });
      }
    }, 400));

    descInput.addEventListener('input', window.Utils.debounce(() => {
      if (this.currentTaskId) {
        window.State.updateTask(this.currentTaskId, { description: descInput.value });
      }
    }, 500));

    statusSelect.addEventListener('change', () => {
      if (this.currentTaskId) {
        window.State.updateTask(this.currentTaskId, { status: statusSelect.value });
      }
    });

    prioritySelect.addEventListener('change', () => {
      if (this.currentTaskId) {
        window.State.updateTask(this.currentTaskId, { priority: prioritySelect.value });
      }
    });

    assigneeSelect.addEventListener('change', () => {
      if (this.currentTaskId) {
        window.State.updateTask(this.currentTaskId, { assigneeId: assigneeSelect.value || null });
      }
    });

    projectSelect.addEventListener('change', () => {
      if (this.currentTaskId) {
        window.State.updateTask(this.currentTaskId, { projectId: projectSelect.value });
      }
    });

    dueDateInput.addEventListener('change', () => {
      if (this.currentTaskId) {
        window.State.updateTask(this.currentTaskId, { dueDate: dueDateInput.value || null });
      }
    });

    // Action buttons in modal header
    const dupBtn = document.getElementById('taskModalDuplicateBtn');
    if (dupBtn) {
      dupBtn.addEventListener('click', async () => {
        if (this.currentTaskId) {
          const dup = await window.State.duplicateTask(this.currentTaskId);
          this.closeTaskModal();
          window.Notifications.success(`Duplicated task "${dup.title}"`);
        }
      });
    }

    const archiveBtn = document.getElementById('taskModalArchiveBtn');
    if (archiveBtn) {
      archiveBtn.addEventListener('click', async () => {
        if (this.currentTaskId) {
          const task = await window.State.archiveTask(this.currentTaskId);
          this.closeTaskModal();
          window.Notifications.info(`${task.archived ? 'Archived' : 'Restored'} "${task.title}"`, { hasUndo: true });
        }
      });
    }

    const deleteBtn = document.getElementById('taskModalDeleteBtn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        if (this.currentTaskId) {
          const task = window.State.getTaskById(this.currentTaskId);
          this.confirm({
            title: 'Delete Task',
            message: `Are you sure you want to delete "${task?.title || 'this task'}"?`,
            onConfirm: async () => {
              await window.State.deleteTask(this.currentTaskId);
              this.closeTaskModal();
              window.Notifications.success('Task deleted', { hasUndo: true });
            }
          });
        }
      });
    }

    // Checklist add trigger
    const addChecklistBtn = document.getElementById('addChecklistBtn');
    const checklistAddRow = document.getElementById('checklistAddRow');
    const newChecklistInput = document.getElementById('newChecklistInput');
    const confirmAddChecklistBtn = document.getElementById('confirmAddChecklistBtn');
    const cancelAddChecklistBtn = document.getElementById('cancelAddChecklistBtn');

    if (addChecklistBtn && checklistAddRow) {
      addChecklistBtn.addEventListener('click', () => {
        checklistAddRow.classList.remove('hidden');
        newChecklistInput.focus();
      });

      cancelAddChecklistBtn.addEventListener('click', () => {
        checklistAddRow.classList.add('hidden');
        newChecklistInput.value = '';
      });

      confirmAddChecklistBtn.addEventListener('click', async () => {
        const val = newChecklistInput.value.trim();
        if (val && this.currentTaskId) {
          await window.State.addChecklistItem(this.currentTaskId, val);
          newChecklistInput.value = '';
          checklistAddRow.classList.add('hidden');
          this.renderTaskChecklist(this.currentTaskId);
        }
      });

      newChecklistInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          confirmAddChecklistBtn.click();
        } else if (e.key === 'Escape') {
          cancelAddChecklistBtn.click();
        }
      });
    }

    // Attachment input
    const attachmentInput = document.getElementById('taskAttachmentInput');
    if (attachmentInput) {
      attachmentInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0 && this.currentTaskId) {
          for (const f of files) {
            await window.State.addAttachment(this.currentTaskId, f);
          }
          this.renderTaskAttachments(this.currentTaskId);
          attachmentInput.value = '';
        }
      });
    }

    // Comment submission
    const commentInput = document.getElementById('newCommentInput');
    const submitCommentBtn = document.getElementById('submitCommentBtn');
    if (submitCommentBtn && commentInput) {
      submitCommentBtn.addEventListener('click', async () => {
        const text = commentInput.value.trim();
        if (text && this.currentTaskId) {
          await window.State.addComment(this.currentTaskId, text);
          commentInput.value = '';
          this.renderTaskComments(this.currentTaskId);
        }
      });

      commentInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          submitCommentBtn.click();
        }
      });
    }
  },

  openTaskModal(taskId) {
    const task = window.State.getTaskById(taskId);
    if (!task) return;

    this.currentTaskId = taskId;
    const state = window.State.getState();
    const project = window.State.getProjectById(task.projectId);
    const overlay = document.getElementById('taskDetailModalOverlay');

    // Populate header info
    document.getElementById('taskModalKey').textContent = task.key || 'TB-TASK';
    document.getElementById('taskModalProjectBadge').textContent = project ? project.name : 'Project';
    document.getElementById('taskModalProjectBadge').style.backgroundColor = project ? `${project.color}22` : 'var(--color-primary-subtle)';
    document.getElementById('taskModalProjectBadge').style.color = project ? project.color : 'var(--color-primary-text)';
    document.getElementById('taskModalCreatedDate').textContent = `Created ${window.Utils.relativeTime(task.createdAt)}`;

    // Populate form fields
    const titleInput = document.getElementById('taskModalTitle');
    titleInput.value = task.title || '';
    
    const descInput = document.getElementById('taskModalDesc');
    descInput.value = task.description || '';

    const statusSelect = document.getElementById('taskModalStatus');
    statusSelect.value = task.status || 'todo';

    const prioritySelect = document.getElementById('taskModalPriority');
    prioritySelect.value = task.priority || 'medium';

    // Populate Assignee Select
    const assigneeSelect = document.getElementById('taskModalAssignee');
    assigneeSelect.innerHTML = `<option value="">Unassigned</option>` + state.users.map(u => `
      <option value="${u.id}" ${task.assigneeId === u.id ? 'selected' : ''}>${window.Utils.escapeHtml(u.name)}</option>
    `).join('');

    // Populate Project Select
    const projectSelect = document.getElementById('taskModalProject');
    projectSelect.innerHTML = state.projects.map(p => `
      <option value="${p.id}" ${task.projectId === p.id ? 'selected' : ''}>${window.Utils.escapeHtml(p.name)}</option>
    `).join('');

    // Due date
    document.getElementById('taskModalDueDate').value = task.dueDate || '';

    // Labels selection
    this.renderTaskLabelsSelector(task);

    // Checklist
    this.renderTaskChecklist(taskId);

    // Attachments
    this.renderTaskAttachments(taskId);

    // Comments & Current user avatar
    const currentUser = window.State.getUserById(state.currentUserId);
    const commentAvatar = document.getElementById('commentUserAvatar');
    if (commentAvatar && currentUser) {
      commentAvatar.src = currentUser.avatar;
    }
    this.renderTaskComments(taskId);

    // Meta dates
    document.getElementById('taskModalFullCreated').textContent = window.Utils.formatDate(task.createdAt);
    document.getElementById('taskModalFullUpdated').textContent = window.Utils.relativeTime(task.updatedAt);

    overlay.classList.remove('hidden');
  },

  closeTaskModal() {
    this.currentTaskId = null;
    const overlay = document.getElementById('taskDetailModalOverlay');
    if (overlay) overlay.classList.add('hidden');
  },

  renderTaskLabelsSelector(task) {
    const container = document.getElementById('taskModalLabelsContainer');
    const state = window.State.getState();
    const taskLabels = task.labels || [];

    container.innerHTML = state.labels.map(lbl => {
      const isSelected = taskLabels.includes(lbl.id);
      return `
        <span class="label-select-pill ${isSelected ? 'selected' : ''}" 
              data-label-id="${lbl.id}" 
              style="color:${lbl.color}; border-color:${lbl.color}; background-color:${isSelected ? `${lbl.color}26` : 'transparent'};">
          ${window.Utils.escapeHtml(lbl.name)}
        </span>
      `;
    }).join('');

    container.querySelectorAll('.label-select-pill').forEach(pill => {
      pill.addEventListener('click', async () => {
        const lblId = pill.getAttribute('data-label-id');
        let newLabels = [...(task.labels || [])];
        if (newLabels.includes(lblId)) {
          newLabels = newLabels.filter(l => l !== lblId);
        } else {
          newLabels.push(lblId);
        }
        await window.State.updateTask(task.id, { labels: newLabels });
        task.labels = newLabels;
        this.renderTaskLabelsSelector(task);
      });
    });
  },

  renderTaskChecklist(taskId) {
    const task = window.State.getTaskById(taskId);
    if (!task) return;

    const itemsContainer = document.getElementById('taskChecklistItems');
    const progressText = document.getElementById('checklistProgressText');
    const progressBar = document.getElementById('checklistProgressBar');

    const checklist = task.checklist || [];
    const total = checklist.length;
    const completed = checklist.filter(c => c.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    progressText.textContent = `${percent}% (${completed}/${total})`;
    progressBar.style.width = `${percent}%`;

    if (total === 0) {
      itemsContainer.innerHTML = `<span class="empty-hint" style="font-size: 12px; color: var(--text-muted);">No checklist items added yet</span>`;
      return;
    }

    itemsContainer.innerHTML = checklist.map(item => {
      return `
        <div class="checklist-item-row ${item.parentId ? 'nested' : ''}" data-chk-id="${item.id}">
          <div class="checklist-item-left">
            <input type="checkbox" class="checklist-checkbox" ${item.completed ? 'checked' : ''}>
            <span class="checklist-item-label ${item.completed ? 'completed' : ''}">${window.Utils.escapeHtml(item.title)}</span>
          </div>
          <div class="checklist-item-actions">
            ${!item.parentId ? `<button class="icon-btn-sm add-nested-chk-btn" title="Add sub-task">${window.Icons.get('plus', 12)}</button>` : ''}
            <button class="icon-btn-sm icon-btn-danger delete-chk-btn" title="Delete">${window.Icons.get('x', 12)}</button>
          </div>
        </div>
      `;
    }).join('');

    // Attach listeners
    itemsContainer.querySelectorAll('.checklist-item-row').forEach(row => {
      const chkId = row.getAttribute('data-chk-id');
      const checkbox = row.querySelector('.checklist-checkbox');
      const deleteBtn = row.querySelector('.delete-chk-btn');
      const addNestedBtn = row.querySelector('.add-nested-chk-btn');

      checkbox.addEventListener('change', async () => {
        await window.State.toggleChecklistItem(taskId, chkId);
        this.renderTaskChecklist(taskId);
      });

      if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
          await window.State.deleteChecklistItem(taskId, chkId);
          this.renderTaskChecklist(taskId);
        });
      }

      if (addNestedBtn) {
        addNestedBtn.addEventListener('click', async () => {
          const subTitle = prompt('Enter sub-task title:');
          if (subTitle && subTitle.trim()) {
            await window.State.addChecklistItem(taskId, subTitle.trim(), chkId);
            this.renderTaskChecklist(taskId);
          }
        });
      }
    });
  },

  renderTaskAttachments(taskId) {
    const task = window.State.getTaskById(taskId);
    if (!task) return;

    const list = document.getElementById('taskAttachmentsList');
    const attachments = task.attachments || [];

    if (attachments.length === 0) {
      list.innerHTML = `<span style="font-size: 12px; color: var(--text-muted);">No attachments uploaded</span>`;
      return;
    }

    list.innerHTML = attachments.map(att => {
      return `
        <div class="attachment-item" data-att-id="${att.id}">
          <span class="attachment-icon">${window.Icons.get('paperclip', 14)}</span>
          <span class="attachment-name" title="${window.Utils.escapeHtml(att.name)}">${window.Utils.escapeHtml(att.name)}</span>
          <span class="attachment-size">${window.Utils.escapeHtml(att.size)}</span>
          <button class="icon-btn-sm icon-btn-danger delete-att-btn" title="Remove">${window.Icons.get('x', 12)}</button>
        </div>
      `;
    }).join('');

    list.querySelectorAll('.delete-att-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const item = btn.closest('.attachment-item');
        const attId = item.getAttribute('data-att-id');
        await window.State.deleteAttachment(taskId, attId);
        this.renderTaskAttachments(taskId);
      });
    });
  },

  renderTaskComments(taskId) {
    const task = window.State.getTaskById(taskId);
    if (!task) return;

    const list = document.getElementById('taskCommentsList');
    const comments = task.comments || [];

    if (comments.length === 0) {
      list.innerHTML = `<span style="font-size: 12px; color: var(--text-muted); padding: 8px 0;">No comments yet. Start the discussion!</span>`;
      return;
    }

    list.innerHTML = comments.map(c => {
      const author = window.State.getUserById(c.authorId) || { name: 'Unknown User', avatar: '' };
      return `
        <div class="comment-item" data-comment-id="${c.id}">
          <img src="${author.avatar}" alt="${window.Utils.escapeHtml(author.name)}" class="avatar-sm">
          <div class="comment-content">
            <div class="comment-header">
              <span class="comment-author">${window.Utils.escapeHtml(author.name)}</span>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="comment-time">${window.Utils.relativeTime(c.createdAt)}</span>
                <button class="icon-btn-sm icon-btn-danger delete-comment-btn" title="Delete comment">${window.Icons.get('trash', 12)}</button>
              </div>
            </div>
            <div class="comment-body">${window.Utils.renderMarkdown(c.text)}</div>
          </div>
        </div>
      `;
    }).join('');

    list.querySelectorAll('.delete-comment-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const item = btn.closest('.comment-item');
        const cId = item.getAttribute('data-comment-id');
        await window.State.deleteComment(taskId, cId);
        this.renderTaskComments(taskId);
      });
    });
  },

  async openNewTaskModal(defaultStatus = 'todo') {
    const newTask = await window.State.createTask({
      title: 'New Task',
      status: defaultStatus
    });
    this.openTaskModal(newTask.id);
  },

  // ================= PROJECT MODAL =================
  initProjectModal() {
    const overlay = document.getElementById('projectModalOverlay');
    const closeBtn = document.getElementById('projectModalCloseBtn');
    const cancelBtn = document.getElementById('projectModalCancelBtn');
    const form = document.getElementById('projectModalForm');

    if (!overlay) return;

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.add('hidden');
    });
    if (closeBtn) closeBtn.addEventListener('click', () => overlay.classList.add('hidden'));
    if (cancelBtn) cancelBtn.addEventListener('click', () => overlay.classList.add('hidden'));

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const projId = document.getElementById('projectModalId').value;
      const name = document.getElementById('projectNameInput').value.trim();
      const description = document.getElementById('projectDescInput').value.trim();
      const status = document.getElementById('projectStatusSelect').value;
      const color = document.getElementById('projectColorInput').value;
      const startDate = document.getElementById('projectStartDate').value || null;
      const deadline = document.getElementById('projectDeadline').value || null;

      // Collect selected members
      const selectedMembers = [];
      document.querySelectorAll('#projectMembersSelect .member-select-chip.selected').forEach(chip => {
        selectedMembers.push(chip.getAttribute('data-user-id'));
      });

      if (!name) return;

      if (projId) {
        // Edit
        await window.State.updateProject(projId, {
          name, description, status, color, startDate, deadline, members: selectedMembers
        });
        window.Notifications.success(`Updated project "${name}"`);
      } else {
        // Create
        const created = await window.State.createProject({
          name, description, status, color, startDate, deadline, members: selectedMembers
        });
        window.Notifications.success(`Created project "${created.name}"`);
        window.State.setActiveProject(created.id);
      }

      overlay.classList.add('hidden');
    });
  },

  openProjectModal(projectId = null) {
    const overlay = document.getElementById('projectModalOverlay');
    const titleEl = document.getElementById('projectModalTitle');
    const idInput = document.getElementById('projectModalId');
    const nameInput = document.getElementById('projectNameInput');
    const descInput = document.getElementById('projectDescInput');
    const statusSelect = document.getElementById('projectStatusSelect');
    const colorInput = document.getElementById('projectColorInput');
    const startDateInput = document.getElementById('projectStartDate');
    const deadlineInput = document.getElementById('projectDeadline');
    const colorPalette = document.getElementById('projectColorPalette');
    const membersSelect = document.getElementById('projectMembersSelect');

    const state = window.State.getState();
    const colors = ['#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'];

    if (projectId) {
      const proj = window.State.getProjectById(projectId);
      if (!proj) return;
      titleEl.textContent = 'Edit Project';
      idInput.value = proj.id;
      nameInput.value = proj.name;
      descInput.value = proj.description || '';
      statusSelect.value = proj.status || 'active';
      colorInput.value = proj.color || '#6366f1';
      startDateInput.value = proj.startDate || '';
      deadlineInput.value = proj.deadline || '';
    } else {
      titleEl.textContent = 'Create New Project';
      idInput.value = '';
      nameInput.value = '';
      descInput.value = '';
      statusSelect.value = 'active';
      colorInput.value = '#6366f1';
      startDateInput.value = '';
      deadlineInput.value = '';
    }

    // Render colors
    colorPalette.innerHTML = colors.map(c => `
      <div class="color-option-dot ${c === colorInput.value ? 'selected' : ''}" data-color="${c}" style="background-color: ${c};"></div>
    `).join('');

    colorPalette.querySelectorAll('.color-option-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        colorPalette.querySelectorAll('.color-option-dot').forEach(d => d.classList.remove('selected'));
        dot.classList.add('selected');
        colorInput.value = dot.getAttribute('data-color');
      });
    });

    // Render members
    const projMembers = projectId ? (window.State.getProjectById(projectId)?.members || []) : [state.currentUserId || 'user-1'];
    membersSelect.innerHTML = state.users.map(u => {
      const isSelected = projMembers.includes(u.id);
      return `
        <div class="member-select-chip ${isSelected ? 'selected' : ''}" data-user-id="${u.id}">
          <img src="${u.avatar}" alt="${window.Utils.escapeHtml(u.name)}" class="avatar-xs">
          <span>${window.Utils.escapeHtml(u.name)}</span>
        </div>
      `;
    }).join('');

    membersSelect.querySelectorAll('.member-select-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('selected');
      });
    });

    overlay.classList.remove('hidden');
    nameInput.focus();
  },

  // ================= SHORTCUTS MODAL =================
  initShortcutsModal() {
    const overlay = document.getElementById('shortcutsModalOverlay');
    const closeBtn = document.getElementById('shortcutsModalCloseBtn');

    if (!overlay) return;
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.add('hidden');
    });
    if (closeBtn) closeBtn.addEventListener('click', () => overlay.classList.add('hidden'));

    const triggerBtn = document.getElementById('sidebarShortcutsBtn');
    if (triggerBtn) {
      triggerBtn.addEventListener('click', () => this.openShortcutsModal());
    }
  },

  openShortcutsModal() {
    const overlay = document.getElementById('shortcutsModalOverlay');
    if (overlay) overlay.classList.remove('hidden');
  },

  // ================= CONFIRM MODAL =================
  initConfirmModal() {
    const overlay = document.getElementById('confirmModalOverlay');
    const cancelBtn = document.getElementById('confirmCancelBtn');
    const okBtn = document.getElementById('confirmOkBtn');

    if (!overlay) return;
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.add('hidden');
    });
    if (cancelBtn) cancelBtn.addEventListener('click', () => overlay.classList.add('hidden'));

    if (okBtn) {
      okBtn.addEventListener('click', async () => {
        overlay.classList.add('hidden');
        if (this.confirmCallback) {
          await this.confirmCallback();
          this.confirmCallback = null;
        }
      });
    }
  },

  confirm({ title = 'Confirm Action', message = 'Are you sure?', onConfirm = null }) {
    const overlay = document.getElementById('confirmModalOverlay');
    document.getElementById('confirmModalTitle').textContent = title;
    document.getElementById('confirmModalMessage').textContent = message;
    this.confirmCallback = onConfirm;
    overlay.classList.remove('hidden');
  }
};
