/**
 * Calendar View
 * Month navigation, task deadline chips, drag & drop rescheduling to another day, quick create on date
 */

window.CalendarView = {
  currentDate: new Date(),
  draggedTaskId: null,

  render(container) {
    const tasks = window.State.getFilteredTasks();
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Compute month grid days
    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const prevLastDay = new Date(year, month, 0).getDate();

    // Map tasks by due date YYYY-MM-DD
    const taskMap = {};
    tasks.forEach(t => {
      if (t.dueDate) {
        if (!taskMap[t.dueDate]) taskMap[t.dueDate] = [];
        taskMap[t.dueDate].push(t);
      }
    });

    const days = [];

    // Previous month filler days
    for (let x = firstDayIndex; x > 0; x--) {
      const d = prevLastDay - x + 1;
      const prevDate = new Date(year, month - 1, d);
      const dateStr = prevDate.toISOString().split('T')[0];
      days.push({
        dayNum: d,
        dateStr,
        isOtherMonth: true,
        isToday: window.Utils.isToday(dateStr),
        tasks: taskMap[dateStr] || []
      });
    }

    // Current month days
    for (let i = 1; i <= lastDayOfMonth; i++) {
      const curDate = new Date(year, month, i);
      // Format as YYYY-MM-DD local
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dayNum: i,
        dateStr,
        isOtherMonth: false,
        isToday: window.Utils.isToday(dateStr),
        tasks: taskMap[dateStr] || []
      });
    }

    // Next month filler days (fill up to 35 or 42 grid cells)
    const totalCells = days.length <= 35 ? 35 : 42;
    const remaining = totalCells - days.length;
    for (let j = 1; j <= remaining; j++) {
      const nextDate = new Date(year, month + 1, j);
      const dateStr = nextDate.toISOString().split('T')[0];
      days.push({
        dayNum: j,
        dateStr,
        isOtherMonth: true,
        isToday: window.Utils.isToday(dateStr),
        tasks: taskMap[dateStr] || []
      });
    }

    container.innerHTML = `
      <div class="calendar-view-container">
        <!-- Calendar Header -->
        <div class="calendar-header">
          <div class="calendar-nav-controls">
            <h2 class="calendar-month-title">${monthNames[month]} ${year}</h2>
            <button class="icon-btn-sm" id="calPrevMonthBtn" title="Previous Month">
              ${window.Icons.get('chevron_left', 16)}
            </button>
            <button class="btn btn-secondary btn-xs" id="calTodayBtn">Today</button>
            <button class="icon-btn-sm" id="calNextMonthBtn" title="Next Month">
              ${window.Icons.get('chevron_right', 16)}
            </button>
          </div>

          <div style="font-size: var(--font-size-xs); color: var(--text-muted);">
            💡 Drag tasks to another day to reschedule
          </div>
        </div>

        <!-- Calendar Grid -->
        <div class="calendar-grid-wrapper">
          <div class="calendar-weekdays">
            <div class="calendar-weekday-cell">Sun</div>
            <div class="calendar-weekday-cell">Mon</div>
            <div class="calendar-weekday-cell">Tue</div>
            <div class="calendar-weekday-cell">Wed</div>
            <div class="calendar-weekday-cell">Thu</div>
            <div class="calendar-weekday-cell">Fri</div>
            <div class="calendar-weekday-cell">Sat</div>
          </div>

          <div class="calendar-days-grid">
            ${days.map(day => `
              <div class="calendar-day-cell ${day.isOtherMonth ? 'other-month' : ''} ${day.isToday ? 'today' : ''}" data-date="${day.dateStr}">
                <div class="calendar-day-header">
                  <span class="calendar-day-number">${day.dayNum}</span>
                  <button class="icon-btn-sm calendar-day-add-btn" data-date="${day.dateStr}" title="Add task on this date">
                    ${window.Icons.get('plus', 12)}
                  </button>
                </div>
                <div class="calendar-day-tasks">
                  ${day.tasks.map(t => `
                    <div class="calendar-task-chip priority-${t.priority} ${t.status === 'done' ? 'status-done' : ''}" 
                         draggable="true" 
                         data-task-id="${t.id}"
                         title="${window.Utils.escapeHtml(t.title)} (${t.status})">
                      <span>${window.Utils.escapeHtml(t.title)}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    this.attachEvents(container);
  },

  attachEvents(container) {
    // Navigation
    const prevBtn = container.querySelector('#calPrevMonthBtn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render(container);
      });
    }

    const nextBtn = container.querySelector('#calNextMonthBtn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render(container);
      });
    }

    const todayBtn = container.querySelector('#calTodayBtn');
    if (todayBtn) {
      todayBtn.addEventListener('click', () => {
        this.currentDate = new Date();
        this.render(container);
      });
    }

    // Add task on date click
    container.querySelectorAll('.calendar-day-add-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const dateStr = btn.getAttribute('data-date');
        const task = await window.State.createTask({
          title: 'New Scheduled Task',
          dueDate: dateStr
        });
        window.Modals.openTaskModal(task.id);
      });
    });

    // Task chips click & drag
    container.querySelectorAll('.calendar-task-chip').forEach(chip => {
      const taskId = chip.getAttribute('data-task-id');

      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        window.Modals.openTaskModal(taskId);
      });

      chip.addEventListener('dragstart', (e) => {
        this.draggedTaskId = taskId;
        e.dataTransfer.setData('text/plain', taskId);
        e.dataTransfer.effectAllowed = 'move';
      });

      chip.addEventListener('dragend', () => {
        this.draggedTaskId = null;
        container.querySelectorAll('.calendar-day-cell').forEach(c => c.classList.remove('drag-hover'));
      });
    });

    // Day cell drop target
    container.querySelectorAll('.calendar-day-cell').forEach(cell => {
      const targetDate = cell.getAttribute('data-date');

      cell.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        cell.classList.add('drag-hover');
      });

      cell.addEventListener('dragleave', (e) => {
        if (!cell.contains(e.relatedTarget)) {
          cell.classList.remove('drag-hover');
        }
      });

      cell.addEventListener('drop', async (e) => {
        e.preventDefault();
        cell.classList.remove('drag-hover');
        const taskId = e.dataTransfer.getData('text/plain') || this.draggedTaskId;
        if (taskId && targetDate) {
          const task = window.State.getTaskById(taskId);
          await window.State.updateTask(taskId, { dueDate: targetDate });
          window.Notifications.success(`Rescheduled "${task?.title || 'Task'}" to ${window.Utils.formatShortDate(targetDate)}`, { hasUndo: true });
          this.render(container);
        }
      });
    });
  }
};
