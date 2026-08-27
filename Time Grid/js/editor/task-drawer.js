/**
 * TimeGrid - Task Backlog & Routine Templates Drawer (Left Panel)
 * Unscheduled task inbox, real-time search & category filter, drag-to-schedule cards,
 * and 1-click routine architecture templates.
 */

import { getIcon, escapeHTML } from '../core/icons.js';
import { formatDuration } from '../core/time.js';
import { SCHEDULE_TEMPLATES, CATEGORIES } from '../engine/templates.js';

let taskSearchQuery = '';
let taskCategoryFilter = 'ALL';

export function renderTaskDrawer(container, {
  backlogTasks = [],
  onAddTask = null,
  onDeleteTask = null,
  onApplyTemplate = null,
  onCloseDrawer = null
}) {
  // Filter tasks based on search & category
  const filteredTasks = backlogTasks.filter(t => {
    const matchesSearch = !taskSearchQuery || t.title.toLowerCase().includes(taskSearchQuery.toLowerCase());
    const matchesCat = taskCategoryFilter === 'ALL' || t.category === taskCategoryFilter;
    return matchesSearch && matchesCat;
  });

  container.innerHTML = `
    <!-- Top Header -->
    <div class="panel-section-header flex items-center justify-between p-3 border-b bg-panel select-none">
      <div class="flex items-center gap-2">
        ${getIcon('zap', 'icon-sm text-primary')}
        <span class="text-xs font-bold uppercase text-muted">Task Inbox</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="badge badge-secondary font-mono">${filteredTasks.length} / ${backlogTasks.length}</span>
        ${onCloseDrawer ? `
          <button class="btn-icon-xs text-muted btn-close-drawer-trigger md:hidden" title="Close Drawer">
            ${getIcon('close', 'icon-xs')}
          </button>
        ` : ''}
      </div>
    </div>

    <!-- Search & Filter Controls -->
    <div class="p-2 border-b bg-panel flex flex-col gap-1.5">
      <div class="relative flex items-center">
        <span class="absolute left-2 text-muted pointer-events-none">${getIcon('search', 'icon-xs')}</span>
        <input type="text" id="inp-search-backlog" class="form-control form-control-sm w-full pl-8 font-sans" placeholder="Search backlog..." value="${escapeHTML(taskSearchQuery)}" />
        ${taskSearchQuery ? `
          <button id="btn-clear-search" class="btn-icon-xs absolute right-1 text-muted" title="Clear Search">&times;</button>
        ` : ''}
      </div>
      <div class="flex items-center gap-1 overflow-x-auto py-0.5">
        <button class="badge cursor-pointer ${taskCategoryFilter === 'ALL' ? 'badge-primary' : 'badge-secondary'} btn-cat-filter" data-cat="ALL">All</button>
        ${Object.keys(CATEGORIES).map(c => `
          <button class="badge cursor-pointer ${taskCategoryFilter === c ? 'badge-primary' : 'badge-secondary'} btn-cat-filter" data-cat="${c}">${c}</button>
        `).join('')}
      </div>
    </div>

    <!-- Quick Task Adder Input -->
    <div class="p-3 border-b bg-elevated flex flex-col gap-2">
      <div class="flex items-center gap-1.5">
        <input type="text" id="inp-new-task-title" class="form-control form-control-sm flex-1 font-sans" placeholder="Add task title & hit Enter..." />
        <button class="btn btn-xs btn-primary" id="btn-add-backlog-task" title="Add Unscheduled Task">
          ${getIcon('plus', 'icon-xs')} Add
        </button>
      </div>
      <div class="flex items-center gap-2">
        <select id="select-task-category" class="form-control form-control-sm flex-1">
          ${Object.keys(CATEGORIES).map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
        <select id="select-task-duration" class="form-control form-control-sm w-20 font-mono">
          <option value="15">15 min</option>
          <option value="30">30 min</option>
          <option value="45">45 min</option>
          <option value="60" selected>1 hour</option>
          <option value="90">1.5h</option>
          <option value="120">2 hours</option>
        </select>
      </div>
    </div>

    <!-- Scrollable Unscheduled Tasks List -->
    <div class="task-backlog-scroll p-2 flex flex-col gap-1.5 flex-1 overflow-y-auto">
      <div class="flex items-center justify-between px-1">
        <span class="text-xs text-muted font-semibold uppercase" style="font-size: 10px;">Drag to Schedule</span>
        <span class="text-xs text-muted" style="font-size: 10px;">${filteredTasks.length} tasks</span>
      </div>

      ${filteredTasks.length === 0 ? `
        <div class="text-xs text-muted text-center p-6 bg-panel rounded border border-dashed border-subtle">
          ${taskSearchQuery || taskCategoryFilter !== 'ALL' ? 'No tasks match current filter.' : 'Inbox is clear. Add tasks above or apply a routine template below.'}
        </div>
      ` : filteredTasks.map(task => {
        const catDef = CATEGORIES[task.category] || { color: '#0284c7' };
        return `
          <div class="backlog-task-card card p-2 flex items-center justify-between cursor-grab active:cursor-grabbing hover-elevated transition-all"
               draggable="true"
               tabindex="0"
               data-id="${task.id}"
               style="border-left: 3px solid ${catDef.color};">
            <div class="flex flex-col truncate flex-1 min-w-0 pr-2">
              <span class="font-bold text-xs text-primary truncate">${escapeHTML(task.title)}</span>
              <span class="font-mono text-muted text-xs flex items-center gap-1" style="font-size: 10px;">
                <span class="w-1.5 h-1.5 rounded-full inline-block" style="background-color: ${catDef.color};"></span>
                <span>${escapeHTML(task.category)}</span> &bull; <span>${formatDuration(task.estimatedMinutes || 60)}</span>
              </span>
            </div>
            <button class="btn-icon-xs text-rose btn-delete-backlog-task shrink-0" data-id="${task.id}" title="Remove Task">
              ${getIcon('trash', 'icon-xs')}
            </button>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Bottom: Schedule Templates Section -->
    <div class="border-t p-3 bg-panel flex flex-col gap-2 shrink-0">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold uppercase text-muted flex items-center gap-1" style="font-size: 10px;">
          ${getIcon('layers', 'icon-xs')} Routine Architectures
        </span>
        <span class="badge badge-secondary font-mono">${SCHEDULE_TEMPLATES.length}</span>
      </div>
      <div class="flex flex-col gap-1.5 max-h-36 overflow-y-auto">
        ${SCHEDULE_TEMPLATES.map(tpl => {
          const totalMin = tpl.blocks.reduce((acc, b) => acc + (b.endMinute - b.startMinute), 0);
          return `
            <button class="btn btn-xs btn-secondary justify-between text-left btn-apply-template p-1.5" data-id="${tpl.id}" title="${escapeHTML(tpl.description)}">
              <div class="flex flex-col truncate flex-1 min-w-0 pr-1">
                <span class="truncate font-semibold">${escapeHTML(tpl.name)}</span>
                <span class="text-muted font-mono" style="font-size: 9.5px;">${tpl.blocks.length} blocks &bull; ${formatDuration(totalMin)}</span>
              </div>
              ${getIcon('plus', 'icon-xs text-primary')}
            </button>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // Search input handler
  const searchInput = container.querySelector('#inp-search-backlog');
  searchInput?.addEventListener('input', (e) => {
    taskSearchQuery = e.target.value;
    renderTaskDrawer(container, { backlogTasks, onAddTask, onDeleteTask, onApplyTemplate, onCloseDrawer });
  });

  // Clear search
  container.querySelector('#btn-clear-search')?.addEventListener('click', () => {
    taskSearchQuery = '';
    renderTaskDrawer(container, { backlogTasks, onAddTask, onDeleteTask, onApplyTemplate, onCloseDrawer });
  });

  // Category filter buttons
  container.querySelectorAll('.btn-cat-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      taskCategoryFilter = btn.dataset.cat;
      renderTaskDrawer(container, { backlogTasks, onAddTask, onDeleteTask, onApplyTemplate, onCloseDrawer });
    });
  });

  // Attach Task Add
  const submitNewTask = () => {
    const titleInput = container.querySelector('#inp-new-task-title');
    const title = titleInput ? titleInput.value.trim() : '';
    if (!title) return;
    const category = container.querySelector('#select-task-category').value;
    const duration = parseInt(container.querySelector('#select-task-duration').value, 10) || 60;

    if (onAddTask) {
      onAddTask({
        id: 'task_' + Date.now(),
        title,
        category,
        estimatedMinutes: duration,
        priority: 'Med'
      });
    }
    if (titleInput) titleInput.value = '';
  };

  container.querySelector('#btn-add-backlog-task')?.addEventListener('click', submitNewTask);
  container.querySelector('#inp-new-task-title')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitNewTask();
  });

  // Delete task buttons
  container.querySelectorAll('.btn-delete-backlog-task').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (onDeleteTask) onDeleteTask(btn.dataset.id);
    });
  });

  // Attach Drag Start
  container.querySelectorAll('.backlog-task-card').forEach(card => {
    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', card.dataset.id);
    });
  });

  // Attach Template Apply
  container.querySelectorAll('.btn-apply-template').forEach(btn => {
    btn.addEventListener('click', () => {
      const tpl = SCHEDULE_TEMPLATES.find(t => t.id === btn.dataset.id);
      if (tpl && onApplyTemplate) {
        onApplyTemplate(tpl);
      }
    });
  });

  // Close drawer trigger (mobile)
  container.querySelector('.btn-close-drawer-trigger')?.addEventListener('click', () => {
    if (onCloseDrawer) onCloseDrawer();
  });
}
