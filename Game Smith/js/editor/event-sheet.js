/**
 * GameSmith - Visual Event Rule Sheet Editor
 * Interactive Construct / Scratch-inspired visual block rule builder with condition-action blocks.
 */

import { getIcon, escapeHTML } from '../core/icons.js';

export function renderEventSheet(container, scene, projectVariables = {}, onRuleChange = null) {
  const events = scene.events || [];
  const objects = scene.objects || [];

  container.innerHTML = `
    <div class="event-sheet-header">
      <div class="flex items-center gap-2">
        <span class="text-xs font-bold uppercase text-primary">${getIcon('code', 'icon-xs')} Visual Event Sheet &bull; ${escapeHTML(scene.name)}</span>
        <span class="badge badge-secondary font-mono text-xs">${events.length} Rules</span>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn btn-sm btn-primary" id="btn-add-event-rule">
          ${getIcon('plus', 'icon-xs')} Add Rule
        </button>
      </div>
    </div>

    <div class="event-rules-list" id="event-rules-list">
      ${events.length === 0 ? `
        <div class="card p-6 text-center text-muted text-xs">
          No event rules configured for this scene. Click "+ Add Rule" to create interactive gameplay mechanics, score triggers, and combat logic!
        </div>
      ` : events.map((rule, idx) => renderRuleCard(rule, idx, objects, projectVariables, events.length)).join('')}
    </div>
  `;

  // --- Attach Handlers ---
  const reRender = () => {
    renderEventSheet(container, scene, projectVariables, onRuleChange);
    if (onRuleChange) onRuleChange();
  };

  // Add Rule
  container.querySelector('#btn-add-event-rule')?.addEventListener('click', () => {
    if (!scene.events) scene.events = [];
    scene.events.push({
      id: 'rule_' + Date.now(),
      enabled: true,
      trigger: { type: 'on_collision', objectId: 'player', targetType: 'crystal' },
      actions: [
        { type: 'change_variable', variable: Object.keys(projectVariables)[0] || 'score', operation: 'add', value: 100 },
        { type: 'play_sound', sound: 'coin' },
        { type: 'destroy_object', targetId: 'context.target' }
      ]
    });
    reRender();
  });

  // Toggle Rule Enabled
  container.querySelectorAll('.btn-toggle-rule-enabled').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      scene.events[idx].enabled = scene.events[idx].enabled === false ? true : false;
      reRender();
    });
  });

  // Move Rule Up / Down
  container.querySelectorAll('.btn-move-rule-up').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      if (idx > 0) {
        const temp = scene.events[idx];
        scene.events[idx] = scene.events[idx - 1];
        scene.events[idx - 1] = temp;
        reRender();
      }
    });
  });

  container.querySelectorAll('.btn-move-rule-down').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      if (idx < scene.events.length - 1) {
        const temp = scene.events[idx];
        scene.events[idx] = scene.events[idx + 1];
        scene.events[idx + 1] = temp;
        reRender();
      }
    });
  });

  // Duplicate Rule
  container.querySelectorAll('.btn-dupe-rule').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      const clone = JSON.parse(JSON.stringify(scene.events[idx]));
      clone.id = 'rule_' + Date.now();
      scene.events.splice(idx + 1, 0, clone);
      reRender();
    });
  });

  // Rule Delete
  container.querySelectorAll('.btn-del-rule').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      scene.events.splice(idx, 1);
      reRender();
    });
  });

  // Trigger Type Change
  container.querySelectorAll('.rule-trigger-type').forEach(select => {
    select.addEventListener('change', () => {
      const idx = parseInt(select.dataset.idx, 10);
      const newType = select.value;
      scene.events[idx].trigger = getDefaultTriggerForType(newType, objects, projectVariables);
      reRender();
    });
  });

  // Trigger param inputs
  container.querySelectorAll('.trigger-param').forEach(inp => {
    inp.addEventListener('input', () => {
      const idx = parseInt(inp.dataset.idx, 10);
      const paramName = inp.dataset.param;
      scene.events[idx].trigger[paramName] = inp.value;
      if (onRuleChange) onRuleChange();
    });
  });

  // Add Action to Rule
  container.querySelectorAll('.btn-add-action-to-rule').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      scene.events[idx].actions.push({ type: 'play_sound', sound: 'coin' });
      reRender();
    });
  });

  // Action Delete
  container.querySelectorAll('.btn-del-action').forEach(btn => {
    btn.addEventListener('click', () => {
      const ruleIdx = parseInt(btn.dataset.ruleIdx, 10);
      const actionIdx = parseInt(btn.dataset.actionIdx, 10);
      scene.events[ruleIdx].actions.splice(actionIdx, 1);
      reRender();
    });
  });

  // Action Type Change
  container.querySelectorAll('.rule-action-type').forEach(select => {
    select.addEventListener('change', () => {
      const ruleIdx = parseInt(select.dataset.ruleIdx, 10);
      const actionIdx = parseInt(select.dataset.actionIdx, 10);
      const newType = select.value;
      scene.events[ruleIdx].actions[actionIdx] = getDefaultActionForType(newType, projectVariables);
      reRender();
    });
  });

  // Action param inputs
  container.querySelectorAll('.action-param').forEach(inp => {
    inp.addEventListener('input', () => {
      const ruleIdx = parseInt(inp.dataset.ruleIdx, 10);
      const actionIdx = parseInt(inp.dataset.actionIdx, 10);
      const paramName = inp.dataset.param;
      scene.events[ruleIdx].actions[actionIdx][paramName] = inp.value;
      if (onRuleChange) onRuleChange();
    });
  });
}

function renderRuleCard(rule, idx, objects, projectVariables, totalRules) {
  const trigger = rule.trigger || { type: 'on_start' };
  const actions = rule.actions || [];
  const isEnabled = rule.enabled !== false;

  return `
    <div class="card event-rule-card mb-3 ${!isEnabled ? 'opacity-50' : ''}">
      <div class="event-rule-header">
        <div class="flex items-center gap-2">
          <button class="btn btn-xs ${isEnabled ? 'btn-primary' : 'btn-secondary'} btn-toggle-rule-enabled" data-idx="${idx}">
            ${isEnabled ? 'ENABLED' : 'DISABLED'}
          </button>
          <span class="font-mono text-xs font-bold text-muted">RULE #${idx + 1}</span>
        </div>
        <div class="flex items-center gap-1">
          <button class="btn-icon-xs btn-move-rule-up" data-idx="${idx}" title="Move Rule Up" ${idx === 0 ? 'disabled' : ''}>
            ${getIcon('chevronUp', 'icon-xs')}
          </button>
          <button class="btn-icon-xs btn-move-rule-down" data-idx="${idx}" title="Move Rule Down" ${idx === totalRules - 1 ? 'disabled' : ''}>
            ${getIcon('chevronDown', 'icon-xs')}
          </button>
          <button class="btn-icon-xs btn-dupe-rule" data-idx="${idx}" title="Duplicate Rule">
            ${getIcon('copy', 'icon-xs')}
          </button>
          <button class="btn-icon-xs btn-icon-danger btn-del-rule" data-idx="${idx}" title="Delete Rule">
            ${getIcon('trash', 'icon-xs')}
          </button>
        </div>
      </div>

      <div class="event-rule-body">
        <!-- WHEN (Condition / Trigger) -->
        <div class="event-condition-row">
          <span class="event-keyword text-emerald font-bold">WHEN</span>
          <select class="form-control form-control-sm w-44 rule-trigger-type" data-idx="${idx}">
            <option value="on_collision" ${trigger.type === 'on_collision' ? 'selected' : ''}>On Collision</option>
            <option value="on_key_press" ${trigger.type === 'on_key_press' ? 'selected' : ''}>On Key Pressed</option>
            <option value="on_key_down" ${trigger.type === 'on_key_down' ? 'selected' : ''}>On Key Held Down</option>
            <option value="on_start" ${trigger.type === 'on_start' ? 'selected' : ''}>On Scene Start</option>
            <option value="on_update" ${trigger.type === 'on_update' ? 'selected' : ''}>On Every Frame</option>
            <option value="on_click" ${trigger.type === 'on_click' ? 'selected' : ''}>On Object Clicked</option>
            <option value="on_timer" ${trigger.type === 'on_timer' ? 'selected' : ''}>On Timer Interval</option>
            <option value="on_variable" ${trigger.type === 'on_variable' ? 'selected' : ''}>On Variable Value</option>
            <option value="on_out_of_bounds" ${trigger.type === 'on_out_of_bounds' ? 'selected' : ''}>On Leave Screen</option>
          </select>

          <!-- Trigger specific parameter inputs -->
          ${renderTriggerParams(trigger, idx, objects, projectVariables)}
        </div>

        <!-- THEN (Actions) -->
        <div class="event-actions-block">
          <span class="event-keyword text-primary font-bold">THEN</span>
          <div class="actions-list flex-1 flex flex-col gap-2">
            ${actions.map((act, actIdx) => renderActionRow(act, idx, actIdx, objects, projectVariables)).join('')}
            <div>
              <button class="btn btn-xs btn-ghost text-primary btn-add-action-to-rule" data-idx="${idx}">
                ${getIcon('plus', 'icon-xs')} Add Action
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderTriggerParams(trigger, idx, objects, projectVariables) {
  if (trigger.type === 'on_collision') {
    return `
      <span class="text-xs text-muted">Source:</span>
      <select class="form-control form-control-sm trigger-param w-36" data-idx="${idx}" data-param="objectId">
        <option value="player" ${trigger.objectId === 'player' ? 'selected' : ''}>Player</option>
        ${objects.map(o => `<option value="${o.id}" ${trigger.objectId === o.id ? 'selected' : ''}>${escapeHTML(o.name)}</option>`).join('')}
      </select>
      <span class="text-xs text-muted">hits tag/id:</span>
      <input type="text" class="form-control form-control-sm trigger-param w-32 font-mono" data-idx="${idx}" data-param="targetType" placeholder="coin/enemy/portal" value="${escapeHTML(trigger.targetType || '')}" />
    `;
  }

  if (trigger.type === 'on_key_press' || trigger.type === 'on_key_down') {
    return `
      <select class="form-control form-control-sm trigger-param w-36" data-idx="${idx}" data-param="key">
        <option value="Space" ${trigger.key === 'Space' ? 'selected' : ''}>Space (Jump/Action)</option>
        <option value="ArrowUp" ${trigger.key === 'ArrowUp' ? 'selected' : ''}>Arrow Up / W</option>
        <option value="ArrowDown" ${trigger.key === 'ArrowDown' ? 'selected' : ''}>Arrow Down / S</option>
        <option value="ArrowLeft" ${trigger.key === 'ArrowLeft' ? 'selected' : ''}>Arrow Left / A</option>
        <option value="ArrowRight" ${trigger.key === 'ArrowRight' ? 'selected' : ''}>Arrow Right / D</option>
        <option value="KeyJ" ${trigger.key === 'KeyJ' ? 'selected' : ''}>Key J (Shoot)</option>
        <option value="KeyZ" ${trigger.key === 'KeyZ' ? 'selected' : ''}>Key Z (Action)</option>
        <option value="KeyX" ${trigger.key === 'KeyX' ? 'selected' : ''}>Key X (Alt)</option>
        <option value="Enter" ${trigger.key === 'Enter' ? 'selected' : ''}>Enter</option>
      </select>
    `;
  }

  if (trigger.type === 'on_timer') {
    return `
      <span class="text-xs text-muted">Every</span>
      <input type="number" step="0.1" class="form-control form-control-sm trigger-param w-20" data-idx="${idx}" data-param="interval" value="${trigger.interval || 1.0}" />
      <span class="text-xs text-muted">seconds</span>
    `;
  }

  if (trigger.type === 'on_variable') {
    const varKeys = Object.keys(projectVariables);
    return `
      <select class="form-control form-control-sm trigger-param w-28" data-idx="${idx}" data-param="variable">
        ${varKeys.map(k => `<option value="${k}" ${trigger.variable === k ? 'selected' : ''}>${k}</option>`).join('')}
      </select>
      <select class="form-control form-control-sm trigger-param w-20" data-idx="${idx}" data-param="operator">
        <option value=">=" ${trigger.operator === '>=' ? 'selected' : ''}>&gt;=</option>
        <option value="<=" ${trigger.operator === '<=' ? 'selected' : ''}>&lt;=</option>
        <option value="==" ${trigger.operator === '==' ? 'selected' : ''}>==</option>
        <option value="!=" ${trigger.operator === '!=' ? 'selected' : ''}>!=</option>
        <option value=">" ${trigger.operator === '>' ? 'selected' : ''}>&gt;</option>
        <option value="<" ${trigger.operator === '<' ? 'selected' : ''}>&lt;</option>
      </select>
      <input type="text" class="form-control form-control-sm trigger-param w-20" data-idx="${idx}" data-param="value" value="${trigger.value !== undefined ? trigger.value : 0}" />
    `;
  }

  if (trigger.type === 'on_out_of_bounds') {
    return `
      <span class="text-xs text-muted">Object:</span>
      <select class="form-control form-control-sm trigger-param w-36" data-idx="${idx}" data-param="objectId">
        <option value="player" ${trigger.objectId === 'player' ? 'selected' : ''}>Player</option>
        ${objects.map(o => `<option value="${o.id}" ${trigger.objectId === o.id ? 'selected' : ''}>${escapeHTML(o.name)}</option>`).join('')}
      </select>
    `;
  }

  return '';
}

function renderActionRow(action, ruleIdx, actionIdx, objects, projectVariables) {
  return `
    <div class="action-item-row flex items-center gap-2">
      <select class="form-control form-control-sm w-40 rule-action-type" data-rule-idx="${ruleIdx}" data-action-idx="${actionIdx}">
        <option value="change_variable" ${action.type === 'change_variable' ? 'selected' : ''}>Change Variable</option>
        <option value="play_sound" ${action.type === 'play_sound' ? 'selected' : ''}>Play Sound FX</option>
        <option value="destroy_object" ${action.type === 'destroy_object' ? 'selected' : ''}>Destroy Object</option>
        <option value="spawn_object" ${action.type === 'spawn_object' ? 'selected' : ''}>Spawn Object</option>
        <option value="show_message" ${action.type === 'show_message' ? 'selected' : ''}>Show HUD Message</option>
        <option value="camera_shake" ${action.type === 'camera_shake' ? 'selected' : ''}>Camera Shake</option>
        <option value="restart_scene" ${action.type === 'restart_scene' ? 'selected' : ''}>Restart Scene</option>
        <option value="change_scene" ${action.type === 'change_scene' ? 'selected' : ''}>Change Scene</option>
      </select>

      ${renderActionParams(action, ruleIdx, actionIdx, objects, projectVariables)}

      <button class="btn-icon-xs text-rose btn-del-action" data-rule-idx="${ruleIdx}" data-action-idx="${actionIdx}" title="Delete Action">&times;</button>
    </div>
  `;
}

function renderActionParams(action, ruleIdx, actionIdx, objects, projectVariables) {
  if (action.type === 'change_variable') {
    const varKeys = Object.keys(projectVariables);
    return `
      <select class="form-control form-control-sm action-param w-28" data-rule-idx="${ruleIdx}" data-action-idx="${actionIdx}" data-param="variable">
        ${varKeys.map(k => `<option value="${k}" ${action.variable === k ? 'selected' : ''}>${k}</option>`).join('')}
      </select>
      <select class="form-control form-control-sm action-param w-24" data-rule-idx="${ruleIdx}" data-action-idx="${actionIdx}" data-param="operation">
        <option value="add" ${action.operation === 'add' ? 'selected' : ''}>Add (+)</option>
        <option value="subtract" ${action.operation === 'subtract' ? 'selected' : ''}>Subtract (-)</option>
        <option value="set" ${action.operation === 'set' ? 'selected' : ''}>Set (=)</option>
        <option value="multiply" ${action.operation === 'multiply' ? 'selected' : ''}>Multiply (*)</option>
      </select>
      <input type="number" class="form-control form-control-sm action-param w-20" data-rule-idx="${ruleIdx}" data-action-idx="${actionIdx}" data-param="value" value="${action.value !== undefined ? action.value : 100}" />
    `;
  }

  if (action.type === 'play_sound') {
    return `
      <select class="form-control form-control-sm action-param w-36" data-rule-idx="${ruleIdx}" data-action-idx="${actionIdx}" data-param="sound">
        <option value="coin" ${action.sound === 'coin' ? 'selected' : ''}>Coin / Gem</option>
        <option value="jump" ${action.sound === 'jump' ? 'selected' : ''}>Jump</option>
        <option value="double_jump" ${action.sound === 'double_jump' ? 'selected' : ''}>Double Jump</option>
        <option value="laser" ${action.sound === 'laser' ? 'selected' : ''}>Laser Blast</option>
        <option value="explosion" ${action.sound === 'explosion' ? 'selected' : ''}>Explosion</option>
        <option value="hit" ${action.sound === 'hit' ? 'selected' : ''}>Hit / Damage</option>
        <option value="powerup" ${action.sound === 'powerup' ? 'selected' : ''}>Powerup</option>
        <option value="win" ${action.sound === 'win' ? 'selected' : ''}>Victory Fanfare</option>
        <option value="game_over" ${action.sound === 'game_over' ? 'selected' : ''}>Game Over</option>
        <option value="teleport" ${action.sound === 'teleport' ? 'selected' : ''}>Teleport</option>
        <option value="dash" ${action.sound === 'dash' ? 'selected' : ''}>Dash Burst</option>
        <option value="bounce" ${action.sound === 'bounce' ? 'selected' : ''}>Spring Bounce</option>
      </select>
    `;
  }

  if (action.type === 'destroy_object') {
    return `
      <select class="form-control form-control-sm action-param w-36" data-rule-idx="${ruleIdx}" data-action-idx="${actionIdx}" data-param="targetId">
        <option value="context.target" ${action.targetId === 'context.target' ? 'selected' : ''}>Collided Target</option>
        <option value="player" ${action.targetId === 'player' ? 'selected' : ''}>Player</option>
        ${objects.map(o => `<option value="${o.id}" ${action.targetId === o.id ? 'selected' : ''}>${escapeHTML(o.name)}</option>`).join('')}
      </select>
    `;
  }

  if (action.type === 'show_message') {
    return `
      <input type="text" class="form-control form-control-sm action-param flex-1" data-rule-idx="${ruleIdx}" data-action-idx="${actionIdx}" data-param="message" placeholder="Message text (e.g. Level Complete!)" value="${escapeHTML(action.message || '')}" />
    `;
  }

  if (action.type === 'camera_shake') {
    return `
      <span class="text-xs text-muted">Intensity:</span>
      <input type="number" class="form-control form-control-sm action-param w-16" data-rule-idx="${ruleIdx}" data-action-idx="${actionIdx}" data-param="intensity" value="${action.intensity || 8}" />
    `;
  }

  return '';
}

function getDefaultTriggerForType(type, objects, projectVariables) {
  switch (type) {
    case 'on_collision':
      return { type: 'on_collision', objectId: 'player', targetType: 'crystal' };
    case 'on_key_press':
    case 'on_key_down':
      return { type, key: 'Space' };
    case 'on_timer':
      return { type: 'on_timer', interval: 2.0 };
    case 'on_variable':
      return { type: 'on_variable', variable: Object.keys(projectVariables)[0] || 'score', operator: '>=', value: 100 };
    case 'on_click':
      return { type: 'on_click', objectId: objects[0]?.id || 'player' };
    case 'on_out_of_bounds':
      return { type: 'on_out_of_bounds', objectId: 'player' };
    default:
      return { type };
  }
}

function getDefaultActionForType(type, projectVariables) {
  const firstVar = Object.keys(projectVariables)[0] || 'score';
  switch (type) {
    case 'change_variable':
      return { type: 'change_variable', variable: firstVar, operation: 'add', value: 100 };
    case 'play_sound':
      return { type: 'play_sound', sound: 'coin' };
    case 'destroy_object':
      return { type: 'destroy_object', targetId: 'context.target' };
    case 'spawn_object':
      return { type: 'spawn_object', objectName: 'Laser Beam', spawnAt: 'player', vx: 0, vy: -600 };
    case 'show_message':
      return { type: 'show_message', message: 'Victory! Level Completed!', duration: 4 };
    case 'camera_shake':
      return { type: 'camera_shake', intensity: 8, duration: 0.3 };
    case 'change_scene':
      return { type: 'change_scene', sceneId: 'scene_level1' };
    case 'restart_scene':
      return { type: 'restart_scene' };
    default:
      return { type };
  }
}
