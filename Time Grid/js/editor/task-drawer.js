/**
 * TimeGrid - Task Backlog & Routine Templates Drawer (Left Panel)
 * Unscheduled task inbox, drag-to-schedule cards, and 1-click routine architecture templates.
 */

import { getIcon, escapeHTML } from '../core/icons.js';
import { formatDuration } from '../core/time.js';
import { SCHEDULE_TEMPLATES, CATEGORIES } from '../engine/templates.js';

export function renderTaskDrawer(container, {
  backlogTasks = [],
  onAddTask = null,
  onDeleteTask = null,
  onApplyTemplate = null
}) {
  container.innerHTML = `
    <!-- Top Header -->
    <div class="panel-section-header flex items-center justify-between p-3 border-b">
      <div class="flex items-center gap-2">
        ${getIcon('zap', 'icon-sm text-primary')}
        <span class="text-xs font-bold uppercase text-muted">Task Inbox & Backlog</span>
      </div>
      <span class="badge badge-secondary font-mono">${backlogTasks.length}</span>
    </div>

    <!-- Quick Task Adder Input -->
    <div class="p-3 border-b flex flex-col gap-2">
      <div class="flex items-center gap-1.5">
        <input type="text" id="inp-new-task-title" class="form-control form-control-sm flex-1 font-sans" placeholder="New task title..." />
        <button class="btn btn-xs btn-primary" id="btn-add-backlog-task" title="Add Unscheduled Task">
          ${getIcon('plus', 'icon-xs')} Add
        </button>
      </div>
      <div class="flex items-center gap-2">
        <select id="select-task-category" class="form-control form-control-sm flex-1">
          ${Object.keys(CATEGORIES).map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
        <select id="select-task-duration" class="form-control form-control-sm w-20 font-mono">
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
      <span class="text-xs text-muted font-semibold px-1" style="font-size: 10px;">DRAG ONTO TIME GRID TO SCHEDULE</span>
      ${backlogTasks.length === 0 ? `
        <div class="text-xs text-muted text-center p-4">No unscheduled tasks. Type above to add one.</div>
      ` : backlogTasks.map(task => {
        const catDef = CATEGORIES[task.category] || { color: '#0284c7' };
        return `
          <div class="backlog-task-card card p-2 flex items-center justify-between cursor-grab active:cursor-grabbing hover-elevated"
               draggable="true"
               data-id="${task.id}"
               style="border-left: 3px solid ${catDef.color};">
            <div class="flex flex-col truncate">
              <span class="font-bold text-xs text-primary truncate">${escapeHTML(task.title)}</span>
              <span class="font-mono text-muted text-xs" style="font-size: 10px;">
                ${escapeHTML(task.category)} &bull; ${formatDuration(task.estimatedMinutes || 60)}
              </span>
            </div>
            <button class="btn-icon-xs text-rose btn-delete-backlog-task" data-id="${task.id}" title="Remove Task">
              ${getIcon('trash', 'icon-xs')}
            </button>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Bottom: Schedule Templates Section -->
    <div class="border-t p-3 bg-elevated flex flex-col gap-2">
      <span class="text-xs font-bold uppercase text-muted flex items-center gap-1">
        ${getIcon('layers', 'icon-xs')} Routine Templates
      </span>
      <div class="flex flex-col gap-1.5">
        ${SCHEDULE_TEMPLATES.map(tpl => `
          <button class="btn btn-xs btn-secondary justify-between btn-apply-template" data-id="${tpl.id}" title="${escapeHTML(tpl.description)}">
            <span class="truncate">${escapeHTML(tpl.name)}</span>
            ${getIcon('plus', 'icon-xs')}
          </button>
        `).join('')}
      </div>
    </div>
  `;

  // Attach Task Add & Delete
  container.querySelector('#btn-add-backlog-task')?.addEventListener('click', () => {
    const title = container.querySelector('#inp-new-task-title').value.trim();
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
    container.querySelector('#inp-new-task-title').value = '';
  });

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
}
