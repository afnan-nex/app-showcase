/**
 * TimeGrid - Block Property Inspector & Analytics Panel (Right Panel)
 * Time block metadata editor, split/merge/duplicate actions, and schedule category analytics.
 */

import { getIcon, escapeHTML } from '../core/icons.js';
import { minutesToTimeString, formatDuration, timeStringToMinutes } from '../core/time.js';
import { CATEGORIES } from '../engine/templates.js';
import { renderCategoryDonut } from '../engine/charts.js';
import { calculateScheduleMetrics } from '../engine/conflicts.js';

export function renderBlockInspector(container, {
  selectedBlock = null,
  dayBlocks = [],
  is24Hour = false,
  onUpdateBlock = null,
  onDeleteBlock = null,
  onDuplicateBlock = null,
  onSplitBlock = null,
  onStartFocus = null
}) {
  const metrics = calculateScheduleMetrics(dayBlocks);

  container.innerHTML = `
    <!-- Top Inspector Header -->
    <div class="panel-section-header flex items-center justify-between p-3 border-b">
      <div class="flex items-center gap-2">
        ${getIcon(selectedBlock ? 'clock' : 'chart', 'icon-sm text-primary')}
        <span class="text-xs font-bold uppercase text-muted">
          ${selectedBlock ? 'Block Properties' : 'Daily Schedule Insights'}
        </span>
      </div>
      ${selectedBlock ? `
        <button class="btn btn-xs btn-primary" id="btn-inspect-focus" title="Start Focus Timer">
          ${getIcon('play', 'icon-xs')} Focus
        </button>
      ` : ''}
    </div>

    <!-- Inspector Body Scroll -->
    <div class="inspector-body-scroll p-3 flex flex-col gap-3 flex-1 overflow-y-auto">
      
      <!-- Selected Block Property Editor -->
      ${selectedBlock ? `
        <div class="card p-3 flex flex-col gap-2.5">
          <div class="flex items-center justify-between">
            <span class="font-bold text-xs text-primary truncate">${escapeHTML(selectedBlock.title)}</span>
            <div class="flex items-center gap-1">
              <button class="btn-icon-xs" id="btn-inspect-split" title="Split Block into 2 Half-Hour Segments">${getIcon('split', 'icon-xs')}</button>
              <button class="btn-icon-xs" id="btn-inspect-dupe" title="Duplicate Block">${getIcon('copy', 'icon-xs')}</button>
              <button class="btn-icon-xs text-rose" id="btn-inspect-del" title="Delete Block">${getIcon('trash', 'icon-xs')}</button>
            </div>
          </div>

          <!-- Title -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Event Title</label>
            <input type="text" id="inp-block-title" class="form-control form-control-sm font-semibold" value="${escapeHTML(selectedBlock.title)}" />
          </div>

          <!-- Start & End Time -->
          <div class="grid grid-cols-2 gap-2">
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Start Time</label>
              <input type="text" id="inp-block-start" class="form-control form-control-sm font-mono" value="${minutesToTimeString(selectedBlock.startMinute, is24Hour)}" />
            </div>
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">End Time</label>
              <input type="text" id="inp-block-end" class="form-control form-control-sm font-mono" value="${minutesToTimeString(selectedBlock.endMinute, is24Hour)}" />
            </div>
          </div>

          <!-- Category & Priority -->
          <div class="grid grid-cols-2 gap-2">
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Category</label>
              <select id="select-block-cat" class="form-control form-control-sm">
                ${Object.keys(CATEGORIES).map(c => `
                  <option value="${c}" ${selectedBlock.category === c ? 'selected' : ''}>${c}</option>
                `).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Priority</label>
              <select id="select-block-priority" class="form-control form-control-sm">
                <option value="High" ${selectedBlock.priority === 'High' ? 'selected' : ''}>High Focus</option>
                <option value="Med" ${selectedBlock.priority === 'Med' ? 'selected' : ''}>Medium</option>
                <option value="Low" ${selectedBlock.priority === 'Low' ? 'selected' : ''}>Low / Buffer</option>
              </select>
            </div>
          </div>

          <!-- Recurrence Pattern -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Recurrence Routine</label>
            <select id="select-block-recurrence" class="form-control form-control-sm">
              <option value="none" ${selectedBlock.recurrence === 'none' || !selectedBlock.recurrence ? 'selected' : ''}>Does not repeat</option>
              <option value="daily" ${selectedBlock.recurrence === 'daily' ? 'selected' : ''}>Every day</option>
              <option value="weekdays" ${selectedBlock.recurrence === 'weekdays' ? 'selected' : ''}>Every weekday (Mon-Fri)</option>
              <option value="weekends" ${selectedBlock.recurrence === 'weekends' ? 'selected' : ''}>Every weekend (Sat-Sun)</option>
              <option value="weekly" ${selectedBlock.recurrence === 'weekly' ? 'selected' : ''}>Weekly</option>
            </select>
          </div>

          <!-- Notes -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Notes & Objectives</label>
            <textarea id="inp-block-notes" class="form-control form-control-sm" rows="2" placeholder="Key outcomes or links...">${escapeHTML(selectedBlock.notes || '')}</textarea>
          </div>
        </div>
      ` : ''}

      <!-- Daily Time Distribution Donut Chart -->
      <div class="card p-3 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="font-bold text-xs text-primary uppercase">Time Allocation</span>
          <span class="font-mono text-xs text-muted">${dayBlocks.length} Blocks</span>
        </div>
        <div class="flex items-center justify-center py-1">
          <canvas id="inspector-category-donut" width="220" height="150"></canvas>
        </div>
      </div>

      <!-- Schedule Metrics Summary -->
      <div class="card p-3 flex flex-col gap-2 font-sans text-xs">
        <span class="font-bold text-xs text-primary uppercase">Productivity Metrics</span>

        <div class="grid grid-cols-2 gap-2">
          <div class="card p-2 text-center bg-elevated">
            <span class="text-xs text-muted block">Deep Focus</span>
            <strong class="font-mono text-sm text-primary">${formatDuration(metrics.focusTime)}</strong>
          </div>
          <div class="card p-2 text-center bg-elevated">
            <span class="text-xs text-muted block">Meetings</span>
            <strong class="font-mono text-sm text-primary">${formatDuration(metrics.meetingTime)}</strong>
          </div>
          <div class="card p-2 text-center bg-elevated">
            <span class="text-xs text-muted block">Free Buffer</span>
            <strong class="font-mono text-sm text-emerald">${formatDuration(metrics.freeWorkdayTime)}</strong>
          </div>
          <div class="card p-2 text-center bg-elevated">
            <span class="text-xs text-muted block">Conflicts</span>
            <strong class="font-mono text-sm ${metrics.totalConflicts > 0 ? 'text-amber' : 'text-muted'}">${metrics.totalConflicts}</strong>
          </div>
        </div>
      </div>

    </div>
  `;

  // Draw Category Donut Chart
  const donutCanvas = container.querySelector('#inspector-category-donut');
  if (donutCanvas) {
    renderCategoryDonut(donutCanvas, dayBlocks);
  }

  // Attach Selected Block Handlers
  if (selectedBlock) {
    container.querySelector('#inp-block-title')?.addEventListener('change', (e) => {
      selectedBlock.title = e.target.value.trim() || 'Untitled Block';
      if (onUpdateBlock) onUpdateBlock(selectedBlock);
    });

    container.querySelector('#inp-block-start')?.addEventListener('change', (e) => {
      const min = timeStringToMinutes(e.target.value);
      selectedBlock.startMinute = min;
      if (onUpdateBlock) onUpdateBlock(selectedBlock);
    });

    container.querySelector('#inp-block-end')?.addEventListener('change', (e) => {
      const min = timeStringToMinutes(e.target.value);
      selectedBlock.endMinute = Math.max(selectedBlock.startMinute + 15, min);
      if (onUpdateBlock) onUpdateBlock(selectedBlock);
    });

    container.querySelector('#select-block-cat')?.addEventListener('change', (e) => {
      selectedBlock.category = e.target.value;
      const catDef = CATEGORIES[e.target.value];
      if (catDef) selectedBlock.color = catDef.color;
      if (onUpdateBlock) onUpdateBlock(selectedBlock);
    });

    container.querySelector('#select-block-priority')?.addEventListener('change', (e) => {
      selectedBlock.priority = e.target.value;
      if (onUpdateBlock) onUpdateBlock(selectedBlock);
    });

    container.querySelector('#select-block-recurrence')?.addEventListener('change', (e) => {
      selectedBlock.recurrence = e.target.value;
      if (onUpdateBlock) onUpdateBlock(selectedBlock);
    });

    container.querySelector('#inp-block-notes')?.addEventListener('change', (e) => {
      selectedBlock.notes = e.target.value;
      if (onUpdateBlock) onUpdateBlock(selectedBlock);
    });

    container.querySelector('#btn-inspect-focus')?.addEventListener('click', () => {
      if (onStartFocus) onStartFocus(selectedBlock);
    });

    container.querySelector('#btn-inspect-split')?.addEventListener('click', () => {
      if (onSplitBlock) onSplitBlock(selectedBlock.id);
    });

    container.querySelector('#btn-inspect-dupe')?.addEventListener('click', () => {
      if (onDuplicateBlock) onDuplicateBlock(selectedBlock.id);
    });

    container.querySelector('#btn-inspect-del')?.addEventListener('click', () => {
      if (onDeleteBlock) onDeleteBlock(selectedBlock.id);
    });
  }
}
