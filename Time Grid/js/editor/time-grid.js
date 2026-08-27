/**
 * TimeGrid - Interactive Visual Time Grid Component
 * Renders 24h vertical grid, Day/Workweek/Full Week columns, live current-time indicator,
 * live drag ghost / time snap tooltips, touch support, and duration-resizing handlers.
 */

import { getIcon, escapeHTML } from '../core/icons.js';
import { minutesToTimeString, formatDuration, formatDateKey, formatDateDisplay, getWeekDates } from '../core/time.js';
import { detectConflicts } from '../engine/conflicts.js';
import { CATEGORIES } from '../engine/templates.js';

export const GRID_VIEWS = {
  DAY: 'day',
  WORKWEEK: 'workweek',
  WEEK: 'week'
};

const HOUR_HEIGHT = 56; // 56px per hour
const TOTAL_HEIGHT = HOUR_HEIGHT * 24; // 1344px for full 24h
const WORK_START_MIN = 540; // 9:00 AM
const WORK_END_MIN = 1080;  // 6:00 PM

export class TimeGridView {
  constructor(container, {
    onSelectBlock = null,
    onMoveBlock = null,
    onResizeBlock = null,
    onCreateBlockAt = null,
    onDropTask = null
  }) {
    this.container = container;
    this.onSelectBlock = onSelectBlock;
    this.onMoveBlock = onMoveBlock;
    this.onResizeBlock = onResizeBlock;
    this.onCreateBlockAt = onCreateBlockAt;
    this.onDropTask = onDropTask;

    this.selectedBlockId = null;
    this.viewMode = GRID_VIEWS.DAY;
    this.currentDate = new Date();
    this.is24Hour = false;
    this.gridSnap = 15; // 15 min default
    this.hasScrolled = false;

    // Start live clock ticker
    this.startLiveClock();
  }

  startLiveClock() {
    setInterval(() => {
      const line = this.container.querySelector('.current-time-line');
      if (line) {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const topPx = (currentMinutes / 60) * HOUR_HEIGHT;
        line.style.top = `${topPx}px`;
        const tooltip = line.querySelector('.current-time-tooltip');
        if (tooltip) tooltip.textContent = minutesToTimeString(currentMinutes, this.is24Hour);
      }
    }, 30000);
  }

  render({
    blocks = [],
    selectedBlockId = null,
    viewMode = GRID_VIEWS.DAY,
    currentDate = new Date(),
    is24Hour = false,
    gridSnap = 15
  }) {
    this.selectedBlockId = selectedBlockId;
    this.viewMode = viewMode;
    this.currentDate = new Date(currentDate);
    this.is24Hour = is24Hour;
    this.gridSnap = gridSnap;

    const days = this.getColumnsForView();
    const workStartTop = (WORK_START_MIN / 60) * HOUR_HEIGHT;
    const workHeight = ((WORK_END_MIN - WORK_START_MIN) / 60) * HOUR_HEIGHT;

    this.container.innerHTML = `
      <div class="time-grid-wrapper flex flex-col h-full overflow-hidden">
        
        <!-- Header: Day / Column Titles -->
        <div class="grid-columns-header flex border-b bg-panel shrink-0 select-none">
          <!-- Time Gutter Spacer -->
          <div class="time-gutter-header w-16 border-r text-center py-2 text-xs font-bold text-muted uppercase">
            Time
          </div>
          <!-- Day Column Headers -->
          <div class="grid-header-days flex-1 grid ${days.length === 1 ? 'grid-cols-1' : (days.length === 5 ? 'grid-cols-5' : 'grid-cols-7')}">
            ${days.map(d => {
              const isToday = formatDateKey(d) === formatDateKey(new Date());
              return `
                <div class="day-header-cell p-2 text-center border-r transition-colors ${isToday ? 'bg-primary-subtle' : ''}">
                  <span class="text-xs font-semibold text-muted block uppercase" style="font-size: 10px;">${d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  <span class="font-bold text-sm font-mono ${isToday ? 'text-primary' : 'text-secondary'}">${d.getDate()}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Scrollable 24-Hour Grid Canvas Body -->
        <div class="grid-canvas-scroll flex-1 overflow-y-auto relative" id="time-grid-scroll-area">
          <div class="grid-canvas-inner flex relative" style="height: ${TOTAL_HEIGHT}px;">
            
            <!-- Left Time Gutter (00:00 to 23:00) -->
            <div class="time-gutter-column w-16 border-r flex flex-col shrink-0 select-none bg-panel">
              ${Array.from({ length: 24 }).map((_, h) => `
                <div class="time-hour-label flex items-start justify-center text-xs font-mono text-muted" style="height: ${HOUR_HEIGHT}px; margin-top: -7px;">
                  <span>${minutesToTimeString(h * 60, this.is24Hour)}</span>
                </div>
              `).join('')}
            </div>

            <!-- Day Columns Grid -->
            <div class="grid-days-container flex-1 grid ${days.length === 1 ? 'grid-cols-1' : (days.length === 5 ? 'grid-cols-5' : 'grid-cols-7')} relative">
              
              <!-- Workday Core Hours Highlight Background -->
              <div class="workday-highlight-bg absolute pointer-events-none w-full"
                   style="top: ${workStartTop}px; height: ${workHeight}px; background-color: rgba(56, 189, 248, 0.02); border-top: 1px dashed rgba(56, 189, 248, 0.2); border-bottom: 1px dashed rgba(56, 189, 248, 0.2);">
              </div>

              <!-- Horizontal Hour Grid Background Lines -->
              <div class="grid-bg-hour-lines absolute inset-0 pointer-events-none">
                ${Array.from({ length: 24 }).map((_, h) => `
                  <div class="grid-hour-line border-b border-subtle relative" style="height: ${HOUR_HEIGHT}px;">
                    <div class="grid-half-hour-line border-b border-muted absolute w-full" style="top: ${HOUR_HEIGHT / 2}px;"></div>
                  </div>
                `).join('')}
              </div>

              <!-- Live Current Time Indicator Line (If today is in view) -->
              ${this.renderCurrentTimeLine(days)}

              <!-- Interactive Day Columns -->
              ${days.map(d => {
                const dateKey = formatDateKey(d);
                const dayBlocks = blocks.filter(b => b.date === dateKey);
                const conflictMap = detectConflicts(dayBlocks);

                return `
                  <div class="day-time-column relative border-r" data-date="${dateKey}" style="height: ${TOTAL_HEIGHT}px;">
                    ${dayBlocks.length === 0 ? `
                      <div class="empty-day-cue absolute inset-x-2 p-3 text-center pointer-events-none text-muted" style="top: ${workStartTop + 20}px;">
                        <span class="text-xs opacity-60 font-sans block">&plus; Double-click or drop task</span>
                      </div>
                    ` : ''}
                    ${dayBlocks.map(b => this.renderBlockCard(b, conflictMap.get(b.id))).join('')}
                  </div>
                `;
              }).join('')}

            </div>

          </div>
        </div>

      </div>
    `;

    this.attachGridInteractions();
  }

  getColumnsForView() {
    if (this.viewMode === GRID_VIEWS.DAY) {
      return [this.currentDate];
    }
    const week = getWeekDates(this.currentDate);
    if (this.viewMode === GRID_VIEWS.WORKWEEK) {
      return week.slice(0, 5); // Mon-Fri
    }
    return week; // Mon-Sun
  }

  renderCurrentTimeLine(days) {
    const now = new Date();
    const todayKey = formatDateKey(now);
    const dayIndex = days.findIndex(d => formatDateKey(d) === todayKey);
    if (dayIndex === -1) return '';

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const topPx = (currentMinutes / 60) * HOUR_HEIGHT;
    const colWidthPct = 100 / days.length;
    const leftPct = dayIndex * colWidthPct;

    return `
      <div class="current-time-line absolute z-20 pointer-events-none flex items-center" style="top: ${topPx}px; left: ${leftPct}%; width: ${colWidthPct}%;">
        <div class="current-time-dot w-2.5 h-2.5 bg-rose rounded-full -ml-1 shadow-glow"></div>
        <div class="flex-1 h-0.5 bg-rose"></div>
        <span class="current-time-tooltip font-mono text-xs bg-rose text-white px-1 rounded absolute right-1 -top-3" style="font-size: 9px;">
          ${minutesToTimeString(currentMinutes, this.is24Hour)}
        </span>
      </div>
    `;
  }

  renderBlockCard(block, conflictInfo = null) {
    const startMin = block.startMinute;
    const endMin = block.endMinute;
    const durMin = Math.max(15, endMin - startMin);

    const topPx = (startMin / 60) * HOUR_HEIGHT;
    const heightPx = Math.max(22, (durMin / 60) * HOUR_HEIGHT);

    const isSelected = block.id === this.selectedBlockId;
    const hasConflict = conflictInfo && conflictInfo.hasConflict;
    const catDef = CATEGORIES[block.category] || { color: '#0284c7', bg: 'rgba(2, 132, 199, 0.2)' };
    const priorityColor = block.priority === 'High' ? 'var(--accent-rose)' : (block.priority === 'Med' ? 'var(--accent-amber)' : 'var(--text-muted)');

    return `
      <div class="time-block-card absolute rounded select-none cursor-move ${isSelected ? 'selected' : ''} ${hasConflict ? 'has-conflict' : ''}"
           role="button"
           tabindex="0"
           aria-label="${escapeHTML(block.title)}, ${minutesToTimeString(startMin, this.is24Hour)} to ${minutesToTimeString(endMin, this.is24Hour)}, ${block.category}"
           data-id="${block.id}"
           data-date="${block.date}"
           style="top: ${topPx}px; height: ${heightPx}px; background-color: ${block.color || catDef.color}; border-left: 4px solid ${block.color || catDef.color};">
        
        <!-- Top Resize Handle -->
        <div class="block-resize-handle top-handle absolute top-0 inset-x-0 h-2 cursor-ns-resize" data-handle="top" title="Drag to resize start time"></div>

        <!-- Block Content -->
        <div class="block-content-inner p-1.5 flex flex-col h-full overflow-hidden justify-between pointer-events-none">
          <div class="flex items-center justify-between gap-1">
            <div class="flex items-center gap-1 min-w-0">
              <span class="block-title font-bold text-xs text-white truncate">${escapeHTML(block.title)}</span>
            </div>
            <div class="flex items-center gap-1 shrink-0">
              ${block.recurrence && block.recurrence !== 'none' ? `
                <span class="text-white-muted" title="Recurring: ${block.recurrence}">
                  ${getIcon('repeat', 'icon-xs')}
                </span>
              ` : ''}
              ${hasConflict ? `
                <span class="badge badge-conflict flex items-center gap-0.5 text-xs text-amber font-bold" title="Conflict: ${conflictInfo.totalOverlapMinutes}m overlap with ${conflictInfo.conflictingWith.map(c => c.title).join(', ')}">
                  ${getIcon('alert', 'icon-xs')}
                </span>
              ` : ''}
            </div>
          </div>

          <!-- Time Span & Duration -->
          ${durMin >= 30 ? `
            <div class="flex items-center justify-between text-xs text-white-muted font-mono" style="font-size: 10px;">
              <span>${minutesToTimeString(startMin, this.is24Hour)} - ${minutesToTimeString(endMin, this.is24Hour)}</span>
              <span>${formatDuration(durMin)}</span>
            </div>
          ` : ''}
        </div>

        <!-- Bottom Resize Handle -->
        <div class="block-resize-handle bottom-handle absolute bottom-0 inset-x-0 h-2 cursor-ns-resize" data-handle="bottom" title="Drag to resize end time"></div>
      </div>
    `;
  }

  attachGridInteractions() {
    const scrollArea = this.container.querySelector('#time-grid-scroll-area');

    // Auto-scroll to 8:00 AM on initial view
    if (scrollArea && !this.hasScrolled) {
      scrollArea.scrollTop = 8 * HOUR_HEIGHT - 20;
      this.hasScrolled = true;
    }

    // Click & Touch on Block -> Select / Drag
    this.container.querySelectorAll('.time-block-card').forEach(el => {
      const blockId = el.dataset.id;

      // Mouse Drag / Resize
      el.addEventListener('mousedown', (e) => {
        const handle = e.target.dataset.handle;
        if (handle) {
          this.startResizing(e, blockId, handle);
        } else {
          this.startDragging(e, blockId);
        }

        if (this.onSelectBlock) {
          this.onSelectBlock(blockId);
        }
        e.stopPropagation();
      });

      // Touch Drag / Resize
      el.addEventListener('touchstart', (e) => {
        const handle = e.target.dataset.handle;
        if (handle) {
          this.startTouchResizing(e, blockId, handle);
        } else {
          this.startTouchDragging(e, blockId);
        }

        if (this.onSelectBlock) {
          this.onSelectBlock(blockId);
        }
        e.stopPropagation();
      }, { passive: false });

      // Keyboard focus
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (this.onSelectBlock) this.onSelectBlock(blockId);
          e.preventDefault();
        }
      });
    });

    // Double-Click on Column -> Create New Block at Clicked Time
    this.container.querySelectorAll('.day-time-column').forEach(col => {
      col.addEventListener('dblclick', (e) => {
        const rect = col.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const clickedMin = (y / HOUR_HEIGHT) * 60;
        const snappedMin = Math.round(clickedMin / this.gridSnap) * this.gridSnap;
        const date = col.dataset.date;

        if (this.onCreateBlockAt) {
          this.onCreateBlockAt({
            date,
            startMinute: Math.max(0, Math.min(1380, snappedMin)),
            endMinute: Math.min(1440, Math.max(0, snappedMin) + 60)
          });
        }
      });
    });

    // Drag-and-Drop Task from Left Backlog
    this.container.querySelectorAll('.day-time-column').forEach(col => {
      col.addEventListener('dragover', (e) => {
        e.preventDefault();
        col.classList.add('drag-over-active');
      });
      col.addEventListener('dragleave', () => {
        col.classList.remove('drag-over-active');
      });
      col.addEventListener('drop', (e) => {
        e.preventDefault();
        col.classList.remove('drag-over-active');
        const taskId = e.dataTransfer.getData('text/plain');
        if (taskId && this.onDropTask) {
          const rect = col.getBoundingClientRect();
          const y = e.clientY - rect.top;
          const clickedMin = (y / HOUR_HEIGHT) * 60;
          const snappedMin = Math.round(clickedMin / this.gridSnap) * this.gridSnap;
          this.onDropTask(taskId, col.dataset.date, Math.max(0, Math.min(1380, snappedMin)));
        }
      });
    });
  }

  startDragging(e, blockId) {
    e.preventDefault();
    const blockEl = this.container.querySelector(`.time-block-card[data-id="${blockId}"]`);
    if (!blockEl) return;

    const initialY = e.clientY;
    const initialTop = parseFloat(blockEl.style.top) || 0;
    const initialHeight = parseFloat(blockEl.style.height) || 0;
    const durationMin = Math.round((initialHeight / HOUR_HEIGHT) * 60);

    blockEl.classList.add('is-dragging');

    const onMouseMove = (moveEv) => {
      const deltaY = moveEv.clientY - initialY;
      const newTop = initialTop + deltaY;
      const rawMin = (newTop / HOUR_HEIGHT) * 60;
      const snappedStart = Math.max(0, Math.min(1440 - durationMin, Math.round(rawMin / this.gridSnap) * this.gridSnap));
      blockEl.style.top = `${(snappedStart / 60) * HOUR_HEIGHT}px`;
    };

    const onMouseUp = (upEv) => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      blockEl.classList.remove('is-dragging');

      const finalTop = parseFloat(blockEl.style.top) || 0;
      const finalStartMin = Math.round((finalTop / HOUR_HEIGHT) * 60);

      // Check if dragged onto a different day column
      let finalDate = blockEl.dataset.date;
      const dayCols = Array.from(this.container.querySelectorAll('.day-time-column'));
      for (const col of dayCols) {
        const rect = col.getBoundingClientRect();
        if (upEv.clientX >= rect.left && upEv.clientX <= rect.right) {
          finalDate = col.dataset.date;
          break;
        }
      }

      if (this.onMoveBlock) {
        this.onMoveBlock(blockId, {
          date: finalDate,
          startMinute: finalStartMin,
          endMinute: Math.min(1440, finalStartMin + durationMin)
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  startTouchDragging(e, blockId) {
    const touch = e.touches[0];
    const blockEl = this.container.querySelector(`.time-block-card[data-id="${blockId}"]`);
    if (!blockEl || !touch) return;

    const initialY = touch.clientY;
    const initialTop = parseFloat(blockEl.style.top) || 0;
    const initialHeight = parseFloat(blockEl.style.height) || 0;
    const durationMin = Math.round((initialHeight / HOUR_HEIGHT) * 60);

    const onTouchMove = (moveEv) => {
      const curTouch = moveEv.touches[0];
      if (!curTouch) return;
      const deltaY = curTouch.clientY - initialY;
      const newTop = initialTop + deltaY;
      const rawMin = (newTop / HOUR_HEIGHT) * 60;
      const snappedStart = Math.max(0, Math.min(1440 - durationMin, Math.round(rawMin / this.gridSnap) * this.gridSnap));
      blockEl.style.top = `${(snappedStart / 60) * HOUR_HEIGHT}px`;
    };

    const onTouchEnd = (endEv) => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      const finalTop = parseFloat(blockEl.style.top) || 0;
      const finalStartMin = Math.round((finalTop / HOUR_HEIGHT) * 60);

      if (this.onMoveBlock) {
        this.onMoveBlock(blockId, {
          date: blockEl.dataset.date,
          startMinute: finalStartMin,
          endMinute: Math.min(1440, finalStartMin + durationMin)
        });
      }
    };

    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
  }

  startResizing(e, blockId, handle) {
    e.preventDefault();
    const blockEl = this.container.querySelector(`.time-block-card[data-id="${blockId}"]`);
    if (!blockEl) return;

    const initialY = e.clientY;
    const initialTop = parseFloat(blockEl.style.top) || 0;
    const initialHeight = parseFloat(blockEl.style.height) || 0;
    const initialStartMin = Math.round((initialTop / HOUR_HEIGHT) * 60);
    const initialEndMin = initialStartMin + Math.round((initialHeight / HOUR_HEIGHT) * 60);

    const onMouseMove = (moveEv) => {
      const deltaY = moveEv.clientY - initialY;

      if (handle === 'top') {
        const newTop = initialTop + deltaY;
        const rawMin = (newTop / HOUR_HEIGHT) * 60;
        const snappedStart = Math.max(0, Math.min(initialEndMin - 15, Math.round(rawMin / this.gridSnap) * this.gridSnap));
        const newHeight = ((initialEndMin - snappedStart) / 60) * HOUR_HEIGHT;
        blockEl.style.top = `${(snappedStart / 60) * HOUR_HEIGHT}px`;
        blockEl.style.height = `${newHeight}px`;
      } else {
        const newHeight = initialHeight + deltaY;
        const rawEndMin = initialStartMin + (newHeight / HOUR_HEIGHT) * 60;
        const snappedEnd = Math.min(1440, Math.max(initialStartMin + 15, Math.round(rawEndMin / this.gridSnap) * this.gridSnap));
        blockEl.style.height = `${((snappedEnd - initialStartMin) / 60) * HOUR_HEIGHT}px`;
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      const finalTop = parseFloat(blockEl.style.top) || 0;
      const finalHeight = parseFloat(blockEl.style.height) || 0;
      const finalStart = Math.round((finalTop / HOUR_HEIGHT) * 60);
      const finalEnd = finalStart + Math.round((finalHeight / HOUR_HEIGHT) * 60);

      if (this.onResizeBlock) {
        this.onResizeBlock(blockId, {
          startMinute: finalStart,
          endMinute: finalEnd
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  startTouchResizing(e, blockId, handle) {
    const touch = e.touches[0];
    const blockEl = this.container.querySelector(`.time-block-card[data-id="${blockId}"]`);
    if (!blockEl || !touch) return;

    const initialY = touch.clientY;
    const initialTop = parseFloat(blockEl.style.top) || 0;
    const initialHeight = parseFloat(blockEl.style.height) || 0;
    const initialStartMin = Math.round((initialTop / HOUR_HEIGHT) * 60);
    const initialEndMin = initialStartMin + Math.round((initialHeight / HOUR_HEIGHT) * 60);

    const onTouchMove = (moveEv) => {
      const curTouch = moveEv.touches[0];
      if (!curTouch) return;
      const deltaY = curTouch.clientY - initialY;

      if (handle === 'top') {
        const newTop = initialTop + deltaY;
        const rawMin = (newTop / HOUR_HEIGHT) * 60;
        const snappedStart = Math.max(0, Math.min(initialEndMin - 15, Math.round(rawMin / this.gridSnap) * this.gridSnap));
        const newHeight = ((initialEndMin - snappedStart) / 60) * HOUR_HEIGHT;
        blockEl.style.top = `${(snappedStart / 60) * HOUR_HEIGHT}px`;
        blockEl.style.height = `${newHeight}px`;
      } else {
        const newHeight = initialHeight + deltaY;
        const rawEndMin = initialStartMin + (newHeight / HOUR_HEIGHT) * 60;
        const snappedEnd = Math.min(1440, Math.max(initialStartMin + 15, Math.round(rawEndMin / this.gridSnap) * this.gridSnap));
        blockEl.style.height = `${((snappedEnd - initialStartMin) / 60) * HOUR_HEIGHT}px`;
      }
    };

    const onTouchEnd = () => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      const finalTop = parseFloat(blockEl.style.top) || 0;
      const finalHeight = parseFloat(blockEl.style.height) || 0;
      const finalStart = Math.round((finalTop / HOUR_HEIGHT) * 60);
      const finalEnd = finalStart + Math.round((finalHeight / HOUR_HEIGHT) * 60);

      if (this.onResizeBlock) {
        this.onResizeBlock(blockId, {
          startMinute: finalStart,
          endMinute: finalEnd
        });
      }
    };

    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
  }
}
