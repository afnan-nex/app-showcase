/**
 * TimeGrid - Schedule Simulation & Scenario Comparison Component
 * Side-by-side comparison matrix for simulated daily schedules (Focus vs Meetings vs Free Time vs Conflicts).
 */

import { getIcon, escapeHTML } from '../core/icons.js';
import { formatDuration } from '../core/time.js';
import { calculateScheduleMetrics } from '../engine/conflicts.js';

export class ScenarioComparisonModal {
  constructor(container, onApplyScenario) {
    this.container = container;
    this.onApplyScenario = onApplyScenario;
  }

  open(scenarios = [], currentDateStr = '') {
    this.scenarios = scenarios;
    this.currentDateStr = currentDateStr;
    this.render();
    this.container.classList.add('active');
  }

  close() {
    this.container.classList.remove('active');
  }

  render() {
    this.container.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-dialog scenario-modal-dialog">
        <div class="modal-header flex items-center justify-between p-3 border-b">
          <div class="flex items-center gap-2">
            ${getIcon('layers', 'icon-sm text-primary')}
            <span class="font-bold text-sm">Schedule Scenario Simulation & Comparison</span>
          </div>
          <button class="btn-icon-xs btn-modal-close">&times;</button>
        </div>

        <div class="modal-body p-4 flex flex-col gap-4 overflow-y-auto" style="max-height: 70vh;">
          <p class="text-xs text-muted font-sans">
            Compare alternative arrangements for <strong>${this.currentDateStr}</strong> to balance deep focus, meeting fatigue, and buffer time.
          </p>

          <!-- Comparison Table Grid -->
          <div class="overflow-x-auto">
            <table class="data-grid-table font-sans text-xs w-full">
              <thead>
                <tr>
                  <th>Scenario Name</th>
                  <th class="text-center">Total Focus</th>
                  <th class="text-center">Meetings</th>
                  <th class="text-center">Free Buffer</th>
                  <th class="text-center">Conflicts</th>
                  <th class="text-center">Efficiency</th>
                  <th class="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                ${this.scenarios.map(sc => {
                  const dayBlocks = sc.blocks.filter(b => b.date === this.currentDateStr);
                  const m = calculateScheduleMetrics(dayBlocks);

                  return `
                    <tr>
                      <td>
                        <div class="flex flex-col">
                          <strong class="text-primary">${escapeHTML(sc.name)}</strong>
                          <span class="text-xs text-muted">${dayBlocks.length} scheduled blocks</span>
                        </div>
                      </td>
                      <td class="text-center font-mono font-bold text-primary">${formatDuration(m.focusTime)}</td>
                      <td class="text-center font-mono text-secondary">${formatDuration(m.meetingTime)}</td>
                      <td class="text-center font-mono text-emerald">${formatDuration(m.freeWorkdayTime)}</td>
                      <td class="text-center font-mono ${m.totalConflicts > 0 ? 'text-amber font-bold' : 'text-muted'}">${m.totalConflicts}</td>
                      <td class="text-center font-mono font-bold text-primary">${m.efficiency}%</td>
                      <td class="text-right">
                        <button class="btn btn-xs btn-primary btn-apply-scenario-row" data-id="${sc.id}">
                          Apply Plan
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

        </div>

        <div class="modal-footer p-3 border-t flex justify-end gap-2">
          <button class="btn btn-sm btn-secondary btn-modal-close">Close</button>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    this.container.querySelectorAll('.btn-modal-close, .modal-backdrop').forEach(b => {
      b.addEventListener('click', () => this.close());
    });

    this.container.querySelectorAll('.btn-apply-scenario-row').forEach(b => {
      b.addEventListener('click', () => {
        const scId = b.dataset.id;
        const targetSc = this.scenarios.find(s => s.id === scId);
        if (targetSc && this.onApplyScenario) {
          this.onApplyScenario(targetSc);
        }
        this.close();
      });
    });
  }
}
