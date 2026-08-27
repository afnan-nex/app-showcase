/**
 * TimeGrid - Interactive Visual Time Grid Component
 * Renders 24h vertical grid, Day/Workweek/Full Week columns, live current-time indicator,
 * and direct drag-and-drop / duration-resizing handlers.
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

    this.container.innerHTML = `
      <div class="time-grid-wrapper flex flex-col h-full overflow-hidden">
        
        <!-- Header: Day / Column Titles -->
        <div class="grid-columns-header flex border-b bg-panel">
          <!-- Time Gutter Spacer -->
          <div class="time-gutter-header w-16 border-r text-center py-2 text-xs font-bold text-muted uppercase">
            Time
          </div>
          <!-- Day Column Headers -->
          <div class="grid-header-days flex-1 grid ${days.length === 1 ? 'grid-cols-1' : (days.length === 5 ? 'grid-cols-5' : 'grid-cols-7')}">
            ${days.map(d => {
              const isToday = formatDateKey(d) === formatDateKey(new Date());
              return `
                <div class="day-header-cell p-2 text-center border-r ${isToday ? 'bg-primary-subtle' : ''}">
                  <span class="text-xs font-semibold text-muted block">${d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  <span class="font-bold text-sm ${isToday ? 'text-primary' : 'text-secondary'}">${d.getDate()}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Scrollable 24-Hour Grid Canvas Body -->
        <div class="grid-canvas-scroll flex-1 overflow-y-auto relative" id="time-grid-scroll-area">
          <div class="grid-canvas-inner flex relative" style="height: ${TOTAL_HEIGHT}px;">
            
            <!-- Left Time Gutter (00:00 to 23:00) -->
            <div class="time-gutter-column w-16 border-r flex flex-col shrink-0 select-none">
              ${Array.from({ length: 24 }).map((_, h) => `
                <div class="time-hour-label flex items-start justify-center text-xs font-mono text-muted" style="height: ${HOUR_HEIGHT}px; margin-top: -7px;">
                  ${minutesToTimeString(h * 60, this.is24Hour)}
                </div>
              `).join('')}
            </div>

            <!-- Day Columns Grid -->
            <div class="grid-days-container flex-1 grid ${days.length === 1 ? 'grid-cols-1' : (days.length === 5 ? 'grid-cols-5' : 'grid-cols-7')} relative">
              
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

              <!-- Interactive Columns -->
              ${days.map(d => {
                const dateKey = formatDateKey(d);
                const dayBlocks = blocks.filter(b => b.date === dateKey);
                const conflictMap = detectConflicts(dayBlocks);

                return `
                  <div class="day-time-column relative border-r" data-date="${dateKey}" style="height: ${TOTAL_HEIGHT}px;">
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

    return `
      <div class="time-block-card absolute rounded select-none cursor-move ${isSelected ? 'selected' : ''} ${hasConflict ? 'has-conflict' : ''}"
           data-id="${block.id}"
           data-date="${block.date}"
           style="top: ${topPx}px; height: ${heightPx}px; background-color: ${block.color || catDef.color}; border-left: 4px solid ${block.color || catDef.color};">
        
        <!-- Top Resize Handle -->
        <div class="block-resize-handle top-handle absolute top-0 inset-x-0 h-1.5 cursor-ns-resize" data-handle="top"></div>

        <!-- Block Content -->
        <div class="block-content-inner p-1.5 flex flex-col h-full overflow-hidden justify-between pointer-events-none">
          <div class="flex items-center justify-between gap-1">
            <span class="block-title font-bold text-xs text-white truncate">${escapeHTML(block.title)}</span>
            ${hasConflict ? `
              <span class="badge badge-conflict flex items-center gap-0.5 text-xs text-amber font-bold" title="Overlap: ${conflictInfo.totalOverlapMinutes}m with ${conflictInfo.conflictingWith.map(c => c.title).join(', ')}">
                ${getIcon('alert', 'icon-xs')}
              </span>
            ` : ''}
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
        <div class="block-resize-handle bottom-handle absolute bottom-0 inset-x-0 h-1.5 cursor-ns-resize" data-handle="bottom"></div>
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

    // Click on Block -> Select
    this.container.querySelectorAll('.time-block-card').forEach(el => {
      el.addEventListener('mousedown', (e) => {
        const handle = e.target.dataset.handle;
        const blockId = el.dataset.id;

        if (handle) {
          // Resizing top or bottom
          this.startResizing(e, blockId, handle);
        } else {
          // Dragging block
          this.startDragging(e, blockId);
        }

        if (this.onSelectBlock) {
          this.onSelectBlock(blockId);
        }
        e.stopPropagation();
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
            startMinute: snappedMin,
            endMinute: Math.min(1440, snappedMin + 60)
          });
        }
      });
    });

    // Drag-and-Drop Task from Left Backlog
    this.container.querySelectorAll('.day-time-column').forEach(col => {
      col.addEventListener('dragover', (e) => e.preventDefault());
      col.addEventListener('drop', (e) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('text/plain');
        if (taskId && this.onDropTask) {
          const rect = col.getBoundingClientRect();
          const y = e.clientY - rect.top;
          const clickedMin = (y / HOUR_HEIGHT) * 60;
          const snappedMin = Math.round(clickedMin / this.gridSnap) * this.gridSnap;
          this.onDropTask(taskId, col.dataset.date, snappedMin);
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
    const initialStartMin = Math.round((initialTop / HOUR_HEIGHT) * 60);
    const durationMin = Math.round((initialHeight / HOUR_HEIGHT) * 60);

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
          endMinute: finalStartMin + durationMin
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
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
        // Bottom handle
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
}
