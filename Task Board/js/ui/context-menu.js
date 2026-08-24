/**
 * Custom Context Menu Manager
 */

window.ContextMenu = {
  menuEl: null,

  init() {
    this.menuEl = document.getElementById('contextMenu');
    document.addEventListener('click', () => this.hide());
    window.addEventListener('resize', () => this.hide());
    window.addEventListener('scroll', () => this.hide(), true);
  },

  show(x, y, items) {
    if (!this.menuEl) this.init();
    if (!items || items.length === 0) return;

    this.menuEl.innerHTML = items.map(item => {
      if (item.divider) return `<div class="dropdown-divider"></div>`;
      const icon = item.icon ? window.Icons.get(item.icon, 14) : '';
      return `
        <button class="context-menu-item ${item.danger ? 'danger' : ''}" data-action="${item.id}">
          ${icon}
          <span>${window.Utils.escapeHtml(item.label)}</span>
        </button>
      `;
    }).join('');

    // Attach click listeners to items
    this.menuEl.querySelectorAll('.context-menu-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const actionId = btn.getAttribute('data-action');
        const item = items.find(i => i.id === actionId);
        this.hide();
        if (item && item.onClick) item.onClick();
      });
    });

    this.menuEl.classList.remove('hidden');

    // Bounds checking
    const menuRect = this.menuEl.getBoundingClientRect();
    const maxX = window.innerWidth - menuRect.width - 10;
    const maxY = window.innerHeight - menuRect.height - 10;

    const posX = Math.min(x, maxX);
    const posY = Math.min(y, maxY);

    this.menuEl.style.left = `${posX}px`;
    this.menuEl.style.top = `${posY}px`;
  },

  hide() {
    if (this.menuEl) {
      this.menuEl.classList.add('hidden');
    }
  },

  // Helper for task context menu
  showForTask(event, task) {
    event.preventDefault();
    event.stopPropagation();

    const items = [
      {
        id: 'open',
        label: 'Open Task Details',
        icon: 'board',
        onClick: () => window.Modals.openTaskModal(task.id)
      },
      {
        id: 'duplicate',
        label: 'Duplicate Task',
        icon: 'copy',
        onClick: async () => {
          const dup = await window.State.duplicateTask(task.id);
          window.Notifications.success(`Duplicated "${task.title}"`);
        }
      },
      { divider: true },
      {
        id: 'status_todo',
        label: 'Mark as To Do',
        icon: 'clock',
        onClick: () => window.State.moveTaskStatus(task.id, 'todo')
      },
      {
        id: 'status_inprogress',
        label: 'Mark as In Progress',
        icon: 'arrow_up_down',
        onClick: () => window.State.moveTaskStatus(task.id, 'in-progress')
      },
      {
        id: 'status_done',
        label: 'Mark as Done',
        icon: 'check',
        onClick: () => window.State.moveTaskStatus(task.id, 'done')
      },
      { divider: true },
      {
        id: 'archive',
        label: task.archived ? 'Restore Task' : 'Archive Task',
        icon: 'archive',
        onClick: async () => {
          await window.State.archiveTask(task.id);
          window.Notifications.info(`${task.archived ? 'Restored' : 'Archived'} "${task.title}"`, { hasUndo: true });
        }
      },
      {
        id: 'delete',
        label: 'Delete Task',
        icon: 'trash',
        danger: true,
        onClick: () => {
          window.Modals.confirm({
            title: 'Delete Task',
            message: `Are you sure you want to permanently delete "${task.title}"? This can be undone from notifications.`,
            onConfirm: async () => {
              await window.State.deleteTask(task.id);
              window.Notifications.success(`Deleted "${task.title}"`, { hasUndo: true });
            }
          });
        }
      }
    ];

    this.show(event.clientX, event.clientY, items);
  }
};
