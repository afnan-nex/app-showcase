/**
 * Centralized Reactive State Store for TaskBoard
 * Handles mutations, autosave, undo stack, activity logging, and subscriber notifications
 */

class AppStateStore {
  constructor() {
    this.state = null;
    this.subscribers = new Set();
    this.undoStack = [];
    this.maxUndoStack = 30;
    this.isInitialized = false;
  }

  async init() {
    await window.DB.init();
    const savedState = await window.DB.get('workspace_state');

    if (savedState && savedState.tasks && savedState.projects) {
      this.state = savedState;
      // Ensure any missing root fields exist
      if (!this.state.filters) {
        this.state.filters = { search: '', assigneeId: '', priority: '', status: '', labelId: '', dueDate: '' };
      }
      if (!this.state.activities) this.state.activities = [];
    } else {
      this.state = window.DemoData.getInitialState();
      await this.persist();
    }

    this.isInitialized = true;
    this.notify('init', this.state);
    return this.state;
  }

  getState() {
    return this.state;
  }

  // Subscribe to state change events
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify(event, payload) {
    this.subscribers.forEach(cb => {
      try {
        cb(event, payload, this.state);
      } catch (err) {
        console.error('Subscriber notification error:', err);
      }
    });
  }

  async persist() {
    if (!this.state) return;
    try {
      await window.DB.set('workspace_state', this.state);
    } catch (e) {
      console.error('Persistence failed:', e);
    }
  }

  // Activity Logger
  logActivity(action, taskId, taskTitle, detail) {
    const activity = {
      id: window.Utils.uid('act'),
      userId: this.state.currentUserId || 'user-1',
      action,
      taskId,
      taskTitle: taskTitle || 'Task',
      detail: detail || '',
      timestamp: new Date().toISOString()
    };

    if (!this.state.activities) this.state.activities = [];
    this.state.activities.unshift(activity);
    if (this.state.activities.length > 100) {
      this.state.activities.pop();
    }
  }

  // Undo Stack Management
  pushUndo(actionName, undoFn) {
    this.undoStack.push({
      name: actionName,
      undo: undoFn,
      timestamp: Date.now()
    });
    if (this.undoStack.length > this.maxUndoStack) {
      this.undoStack.shift();
    }
  }

  async undo() {
    if (this.undoStack.length === 0) return false;
    const item = this.undoStack.pop();
    try {
      await item.undo();
      await this.persist();
      this.notify('undo', { action: item.name });
      return item.name;
    } catch (e) {
      console.error('Undo execution failed:', e);
      return false;
    }
  }

  // Current User / Navigation Setters
  setCurrentUser(userId) {
    this.state.currentUserId = userId;
    this.persist();
    this.notify('user_changed', userId);
  }

  setActiveProject(projectId) {
    this.state.activeProjectId = projectId;
    this.persist();
    this.notify('project_changed', projectId);
  }

  setActiveView(viewName) {
    this.state.activeView = viewName;
    this.persist();
    this.notify('view_changed', viewName);
  }

  setTheme(theme) {
    this.state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    this.persist();
    this.notify('theme_changed', theme);
  }

  toggleTheme() {
    const nextTheme = this.state.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
    return nextTheme;
  }

  // Filter Management
  setFilter(key, value) {
    this.state.filters[key] = value;
    this.notify('filter_changed', this.state.filters);
  }

  resetFilters() {
    this.state.filters = {
      search: '',
      assigneeId: '',
      priority: '',
      status: '',
      labelId: '',
      dueDate: ''
    };
    this.notify('filter_changed', this.state.filters);
  }

  // Task Operations
  async createTask(taskData) {
    const defaultProjectId = this.state.activeProjectId !== 'all' ? this.state.activeProjectId : (this.state.projects[0]?.id || 'proj-1');
    const taskCount = this.state.tasks.length + 101;

    const newTask = {
      id: window.Utils.uid('task'),
      key: `TB-${taskCount}`,
      projectId: taskData.projectId || defaultProjectId,
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      assigneeId: taskData.assigneeId || null,
      labels: taskData.labels || [],
      dueDate: taskData.dueDate || null,
      startDate: taskData.startDate || null,
      checklist: taskData.checklist || [],
      comments: taskData.comments || [],
      attachments: taskData.attachments || [],
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.state.tasks.push(newTask);
    this.logActivity('created_task', newTask.id, newTask.title, `created task in ${newTask.status}`);
    
    // Push undo
    this.pushUndo(`Create "${newTask.title}"`, async () => {
      this.state.tasks = this.state.tasks.filter(t => t.id !== newTask.id);
    });

    await this.persist();
    this.notify('task_created', newTask);
    return newTask;
  }

  async updateTask(taskId, updates) {
    const taskIndex = this.state.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return null;

    const oldTask = { ...this.state.tasks[taskIndex] };
    const updatedTask = {
      ...oldTask,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.state.tasks[taskIndex] = updatedTask;

    // Log significant changes
    if (updates.status && updates.status !== oldTask.status) {
      this.logActivity('changed_status', taskId, updatedTask.title, `changed status from ${oldTask.status} to ${updates.status}`);
    }
    if (updates.priority && updates.priority !== oldTask.priority) {
      this.logActivity('changed_priority', taskId, updatedTask.title, `changed priority to ${updates.priority}`);
    }
    if (updates.assigneeId !== undefined && updates.assigneeId !== oldTask.assigneeId) {
      const user = this.state.users.find(u => u.id === updates.assigneeId);
      this.logActivity('assigned_user', taskId, updatedTask.title, user ? `assigned to ${user.name}` : 'unassigned task');
    }

    await this.persist();
    this.notify('task_updated', updatedTask);
    return updatedTask;
  }

  async deleteTask(taskId) {
    const taskIndex = this.state.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return false;

    const removedTask = this.state.tasks[taskIndex];
    this.state.tasks.splice(taskIndex, 1);

    this.logActivity('deleted_task', taskId, removedTask.title, 'deleted task');

    // Register undo
    this.pushUndo(`Delete "${removedTask.title}"`, async () => {
      this.state.tasks.splice(taskIndex, 0, removedTask);
    });

    await this.persist();
    this.notify('task_deleted', { id: taskId, task: removedTask });
    return true;
  }

  async duplicateTask(taskId) {
    const original = this.state.tasks.find(t => t.id === taskId);
    if (!original) return null;

    const duplicated = {
      ...JSON.parse(JSON.stringify(original)),
      id: window.Utils.uid('task'),
      title: `${original.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.state.tasks.push(duplicated);
    this.logActivity('duplicated_task', duplicated.id, duplicated.title, `duplicated from ${original.title}`);

    await this.persist();
    this.notify('task_created', duplicated);
    return duplicated;
  }

  async archiveTask(taskId) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (!task) return false;

    task.archived = !task.archived;
    task.updatedAt = new Date().toISOString();

    const actionText = task.archived ? 'archived' : 'restored';
    this.logActivity('archived_task', taskId, task.title, `${actionText} task`);

    this.pushUndo(`${actionText} "${task.title}"`, async () => {
      task.archived = !task.archived;
    });

    await this.persist();
    this.notify('task_updated', task);
    return task;
  }

  // Move task status & reorder
  async moveTaskStatus(taskId, newStatus, targetIndex = null) {
    const taskIndex = this.state.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const task = this.state.tasks[taskIndex];
    const prevStatus = task.status;
    task.status = newStatus;
    task.updatedAt = new Date().toISOString();

    if (targetIndex !== null) {
      // Reposition in state array
      this.state.tasks.splice(taskIndex, 1);
      this.state.tasks.splice(targetIndex, 0, task);
    }

    if (prevStatus !== newStatus) {
      this.logActivity('moved_task', taskId, task.title, `moved from ${prevStatus} to ${newStatus}`);
    }

    await this.persist();
    this.notify('task_moved', { task, prevStatus, newStatus });
  }

  // Checklist Actions
  async addChecklistItem(taskId, title, parentId = null) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (!task) return;

    if (!task.checklist) task.checklist = [];
    const item = {
      id: window.Utils.uid('chk'),
      title: title.trim(),
      completed: false,
      parentId: parentId || null
    };

    task.checklist.push(item);
    task.updatedAt = new Date().toISOString();
    this.logActivity('checklist_added', taskId, task.title, `added checklist item: "${item.title}"`);

    await this.persist();
    this.notify('task_updated', task);
    return item;
  }

  async toggleChecklistItem(taskId, checklistId) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (!task || !task.checklist) return;

    const item = task.checklist.find(c => c.id === checklistId);
    if (!item) return;

    item.completed = !item.completed;
    task.updatedAt = new Date().toISOString();

    // If parent item toggled, auto toggle child items
    task.checklist.forEach(child => {
      if (child.parentId === checklistId) {
        child.completed = item.completed;
      }
    });

    this.logActivity('checklist_toggled', taskId, task.title, `${item.completed ? 'completed' : 'uncompleted'} "${item.title}"`);

    await this.persist();
    this.notify('task_updated', task);
  }

  async deleteChecklistItem(taskId, checklistId) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (!task || !task.checklist) return;

    task.checklist = task.checklist.filter(c => c.id !== checklistId && c.parentId !== checklistId);
    task.updatedAt = new Date().toISOString();

    await this.persist();
    this.notify('task_updated', task);
  }

  // Comment Actions
  async addComment(taskId, text) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (!task) return;

    if (!task.comments) task.comments = [];
    const comment = {
      id: window.Utils.uid('c'),
      authorId: this.state.currentUserId || 'user-1',
      text: text.trim(),
      createdAt: new Date().toISOString()
    };

    task.comments.push(comment);
    task.updatedAt = new Date().toISOString();
    this.logActivity('commented', taskId, task.title, 'added a comment');

    await this.persist();
    this.notify('task_updated', task);
    return comment;
  }

  async deleteComment(taskId, commentId) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (!task || !task.comments) return;

    task.comments = task.comments.filter(c => c.id !== commentId);
    task.updatedAt = new Date().toISOString();

    await this.persist();
    this.notify('task_updated', task);
  }

  // Attachment Actions
  async addAttachment(taskId, file) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (!task) return;

    if (!task.attachments) task.attachments = [];
    const attachment = {
      id: window.Utils.uid('att'),
      name: file.name,
      size: `${Math.round(file.size / 1024)} KB`,
      type: file.type || 'file'
    };

    task.attachments.push(attachment);
    task.updatedAt = new Date().toISOString();
    this.logActivity('attached_file', taskId, task.title, `attached ${file.name}`);

    await this.persist();
    this.notify('task_updated', task);
    return attachment;
  }

  async deleteAttachment(taskId, attachmentId) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (!task || !task.attachments) return;

    task.attachments = task.attachments.filter(a => a.id !== attachmentId);
    task.updatedAt = new Date().toISOString();

    await this.persist();
    this.notify('task_updated', task);
  }

  // Project Operations
  async createProject(projectData) {
    const newProject = {
      id: window.Utils.uid('proj'),
      name: projectData.name || 'New Project',
      description: projectData.description || '',
      status: projectData.status || 'active',
      color: projectData.color || '#6366f1',
      members: projectData.members || [this.state.currentUserId || 'user-1'],
      isFavorite: false,
      startDate: projectData.startDate || null,
      deadline: projectData.deadline || null,
      createdAt: new Date().toISOString()
    };

    this.state.projects.push(newProject);
    this.logActivity('created_project', null, newProject.name, 'created new project');

    await this.persist();
    this.notify('project_created', newProject);
    return newProject;
  }

  async updateProject(projectId, updates) {
    const project = this.state.projects.find(p => p.id === projectId);
    if (!project) return null;

    Object.assign(project, updates);
    await this.persist();
    this.notify('project_updated', project);
    return project;
  }

  async deleteProject(projectId) {
    const projectIndex = this.state.projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) return false;

    const removedProject = this.state.projects[projectIndex];
    this.state.projects.splice(projectIndex, 1);

    // Also remove associated tasks
    const removedTasks = this.state.tasks.filter(t => t.projectId === projectId);
    this.state.tasks = this.state.tasks.filter(t => t.projectId !== projectId);

    if (this.state.activeProjectId === projectId) {
      this.state.activeProjectId = 'all';
    }

    this.pushUndo(`Delete Project "${removedProject.name}"`, async () => {
      this.state.projects.splice(projectIndex, 0, removedProject);
      this.state.tasks.push(...removedTasks);
    });

    await this.persist();
    this.notify('project_deleted', projectId);
    return true;
  }

  async toggleFavoriteProject(projectId) {
    const project = this.state.projects.find(p => p.id === projectId);
    if (!project) return;

    project.isFavorite = !project.isFavorite;
    await this.persist();
    this.notify('project_updated', project);
  }

  // Label & Member Management (Settings)
  async addLabel(name, color) {
    const newLabel = {
      id: window.Utils.uid('lbl'),
      name: name.trim(),
      color: color || '#6366f1'
    };
    this.state.labels.push(newLabel);
    await this.persist();
    this.notify('labels_updated', this.state.labels);
    return newLabel;
  }

  async deleteLabel(labelId) {
    this.state.labels = this.state.labels.filter(l => l.id !== labelId);
    // Remove label reference from tasks
    this.state.tasks.forEach(t => {
      if (t.labels) t.labels = t.labels.filter(l => l !== labelId);
    });
    await this.persist();
    this.notify('labels_updated', this.state.labels);
  }

  async addUser(name, role, email) {
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const colors = ['#6366f1', '#3b82f6', '#06b6d4', '#ec4899', '#10b981', '#f59e0b'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="20" fill="${randomColor}"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="15" font-weight="600">${initials}</text></svg>`;
    
    const newUser = {
      id: window.Utils.uid('user'),
      name: name.trim(),
      role: role.trim(),
      email: email.trim(),
      avatar: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
    };

    this.state.users.push(newUser);
    await this.persist();
    this.notify('users_updated', this.state.users);
    return newUser;
  }

  async deleteUser(userId) {
    if (this.state.users.length <= 1) return false;
    this.state.users = this.state.users.filter(u => u.id !== userId);
    // Unassign tasks
    this.state.tasks.forEach(t => {
      if (t.assigneeId === userId) t.assigneeId = null;
    });
    await this.persist();
    this.notify('users_updated', this.state.users);
    return true;
  }

  // Import / Export Workspace
  exportWorkspace() {
    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      workspace: this.state.workspace,
      users: this.state.users,
      labels: this.state.labels,
      projects: this.state.projects,
      tasks: this.state.tasks,
      activities: this.state.activities
    };
  }

  async importWorkspace(importedData) {
    if (!importedData.projects || !importedData.tasks || !Array.isArray(importedData.projects) || !Array.isArray(importedData.tasks)) {
      throw new Error('Invalid workspace data schema. Missing required projects or tasks array.');
    }

    this.state.workspace = importedData.workspace || this.state.workspace;
    this.state.users = importedData.users || this.state.users;
    this.state.labels = importedData.labels || this.state.labels;
    this.state.projects = importedData.projects;
    this.state.tasks = importedData.tasks;
    this.state.activities = importedData.activities || [];
    this.state.activeProjectId = 'all';

    await this.persist();
    this.notify('workspace_imported', this.state);
  }

  async resetToDemoData() {
    this.state = window.DemoData.getInitialState();
    await this.persist();
    this.notify('workspace_reset', this.state);
  }

  // Computed / Filtered Queries
  getFilteredTasks(includeArchived = false) {
    const { activeProjectId, filters, tasks } = this.state;

    return tasks.filter(task => {
      if (!includeArchived && task.archived) return false;
      if (includeArchived && !task.archived) return false;

      // Project filter
      if (activeProjectId !== 'all' && task.projectId !== activeProjectId) {
        return false;
      }

      // Search query (title, description, key)
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchTitle = (task.title || '').toLowerCase().includes(q);
        const matchDesc = (task.description || '').toLowerCase().includes(q);
        const matchKey = (task.key || '').toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchKey) return false;
      }

      // Assignee filter
      if (filters.assigneeId && task.assigneeId !== filters.assigneeId) {
        return false;
      }

      // Priority filter
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }

      // Status filter
      if (filters.status && task.status !== filters.status) {
        return false;
      }

      // Label filter
      if (filters.labelId && (!task.labels || !task.labels.includes(filters.labelId))) {
        return false;
      }

      // Due date filter
      if (filters.dueDate) {
        if (filters.dueDate === 'no-date' && task.dueDate) return false;
        if (filters.dueDate === 'overdue' && (!task.dueDate || !window.Utils.isOverdue(task.dueDate))) return false;
        if (filters.dueDate === 'today' && (!task.dueDate || !window.Utils.isToday(task.dueDate))) return false;
        if (filters.dueDate === 'this-week' && (!task.dueDate || !window.Utils.isThisWeek(task.dueDate))) return false;
        if (filters.dueDate === 'next-week' && (!task.dueDate || !window.Utils.isNextWeek(task.dueDate))) return false;
      }

      return true;
    });
  }

  getTaskById(taskId) {
    return this.state.tasks.find(t => t.id === taskId) || null;
  }

  getProjectById(projectId) {
    return this.state.projects.find(p => p.id === projectId) || null;
  }

  getUserById(userId) {
    return this.state.users.find(u => u.id === userId) || null;
  }

  getLabelById(labelId) {
    return this.state.labels.find(l => l.id === labelId) || null;
  }
}

window.State = new AppStateStore();
