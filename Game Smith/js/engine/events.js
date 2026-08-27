/**
 * GameSmith - Visual Event Rule Evaluator
 * Evaluates WHEN -> THEN visual game rules and condition-action blocks.
 */

import { audioSynth } from '../core/audio-synth.js';
import { input } from '../core/input.js';

export class EventEngine {
  constructor(runtime) {
    this.runtime = runtime;
    this.timerStates = {};
  }

  evaluateRules(events, objects, collisions, variables, dt) {
    if (!events || !Array.isArray(events)) return;

    for (const rule of events) {
      if (rule.enabled === false) continue;

      const isTriggered = this.checkTrigger(rule.trigger, objects, collisions, variables, dt);
      if (isTriggered) {
        this.executeActions(rule.actions, objects, variables, isTriggered.context);
      }
    }
  }

  checkTrigger(trigger, objects, collisions, variables, dt) {
    if (!trigger) return false;

    switch (trigger.type) {
      case 'on_start':
        // Only on frame 0 of scene launch
        return this.runtime.isFirstFrame ? { context: {} } : false;

      case 'on_update':
        return { context: {} };

      case 'on_collision': {
        const objA_Id = trigger.objectId;
        const targetType = trigger.targetType || trigger.targetId; // ID or tag like 'coin', 'enemy'

        for (const col of collisions) {
          const hitA = col.a.id === objA_Id || col.a.tag === objA_Id;
          const hitB = col.b.id === objA_Id || col.b.tag === objA_Id;

          if (hitA) {
            const matchTarget = !targetType || col.b.id === targetType || col.b.tag === targetType;
            if (matchTarget) {
              return { context: { source: col.a, target: col.b } };
            }
          }
          if (hitB) {
            const matchTarget = !targetType || col.a.id === targetType || col.a.tag === targetType;
            if (matchTarget) {
              return { context: { source: col.b, target: col.a } };
            }
          }
        }
        return false;
      }

      case 'on_key_press': {
        const key = trigger.key || 'Space';
        return input.isKeyDown(key) ? { context: {} } : false;
      }

      case 'on_key_down': {
        const key = trigger.key || 'Space';
        return input.isKey(key) ? { context: {} } : false;
      }

      case 'on_click': {
        if (!input.mouseClicked) return false;
        const targetObj = objects.find(o => o.id === trigger.objectId);
        if (!targetObj) return false;

        const mx = input.mouseX;
        const my = input.mouseY;
        const inside = mx >= targetObj.x && mx <= targetObj.x + targetObj.width &&
                       my >= targetObj.y && my <= targetObj.y + targetObj.height;
        return inside ? { context: { target: targetObj } } : false;
      }

      case 'on_timer': {
        const timerId = trigger.id || 'timer_' + trigger.interval;
        const interval = Number(trigger.interval) || 1.0;
        this.timerStates[timerId] = (this.timerStates[timerId] || 0) + dt;
        if (this.timerStates[timerId] >= interval) {
          this.timerStates[timerId] = 0;
          return { context: {} };
        }
        return false;
      }

      case 'on_variable': {
        const varName = trigger.variable;
        const curVal = variables[varName];
        const targetVal = trigger.value;
        const op = trigger.operator || '==';

        let conditionMet = false;
        if (op === '==' && curVal == targetVal) conditionMet = true;
        if (op === '!=' && curVal != targetVal) conditionMet = true;
        if (op === '>=' && Number(curVal) >= Number(targetVal)) conditionMet = true;
        if (op === '<=' && Number(curVal) <= Number(targetVal)) conditionMet = true;
        if (op === '>' && Number(curVal) > Number(targetVal)) conditionMet = true;
        if (op === '<' && Number(curVal) < Number(targetVal)) conditionMet = true;

        return conditionMet ? { context: {} } : false;
      }

      case 'on_out_of_bounds': {
        const targetObj = trigger.objectId === 'player'
          ? (this.runtime.playerObj || objects.find(o => o.id === 'player' || o.tag === 'player'))
          : objects.find(o => o.id === trigger.objectId);

        if (!targetObj) return false;
        const world = this.runtime.currentScene?.bounds || { width: 1600, height: 800 };
        const isOut = targetObj.x < -80 || targetObj.x > world.width + 80 ||
                      targetObj.y < -80 || targetObj.y > world.height + 80;
        return isOut ? { context: { target: targetObj } } : false;
      }

      default:
        return false;
    }
  }

  executeActions(actions, objects, variables, context = {}) {
    if (!actions || !Array.isArray(actions)) return;

    for (const action of actions) {
      switch (action.type) {
        case 'change_variable': {
          const varName = action.variable;
          const op = action.operation || 'add';
          const val = action.value;

          if (op === 'set') {
            variables[varName] = isNaN(val) ? val : Number(val);
          } else if (op === 'add') {
            variables[varName] = (Number(variables[varName]) || 0) + Number(val);
          } else if (op === 'subtract') {
            variables[varName] = (Number(variables[varName]) || 0) - Number(val);
          } else if (op === 'multiply') {
            variables[varName] = (Number(variables[varName]) || 0) * Number(val);
          }
          break;
        }

        case 'play_sound': {
          const soundName = action.sound || 'coin';
          audioSynth.play(soundName);
          break;
        }

        case 'destroy_object': {
          const targetId = action.targetId === 'context.target' && context.target
            ? context.target.id
            : action.targetId;

          const idx = objects.findIndex(o => o.id === targetId);
          if (idx !== -1) {
            const victim = objects[idx];
            this.runtime.spawnParticles(victim.x + victim.width / 2, victim.y + victim.height / 2, victim.color || '#f85149', 16);
            objects.splice(idx, 1);
          }
          break;
        }

        case 'spawn_object': {
          let spawnX = Number(action.x) || 0;
          let spawnY = Number(action.y) || 0;

          if (action.spawnAt === 'player' && this.runtime.playerObj) {
            spawnX = this.runtime.playerObj.x + this.runtime.playerObj.width / 2;
            spawnY = this.runtime.playerObj.y + this.runtime.playerObj.height / 2;
          }

          const newObj = {
            id: 'spawned_' + Math.random().toString(36).substr(2, 7),
            name: action.objectName || 'Bullet',
            tag: action.tag || 'projectile',
            x: spawnX,
            y: spawnY,
            width: Number(action.width) || 12,
            height: Number(action.height) || 12,
            color: action.color || '#58a6ff',
            physicsType: action.physicsType || 'dynamic',
            gravityScale: Number(action.gravityScale) || 0,
            vx: Number(action.vx) || 0,
            vy: Number(action.vy) || 0,
            hasCollider: true,
            isSolid: false,
            behavior: action.behavior || 'bullet',
            lifespan: Number(action.lifespan) || 3.0
          };
          objects.push(newObj);
          break;
        }

        case 'move_object': {
          const targetObj = action.targetId === 'player'
            ? this.runtime.playerObj
            : objects.find(o => o.id === action.targetId);

          if (targetObj) {
            if (action.vx !== undefined) targetObj.vx = Number(action.vx);
            if (action.vy !== undefined) targetObj.vy = Number(action.vy);
            if (action.impulseY !== undefined) targetObj.vy = -Number(action.impulseY);
            if (action.impulseX !== undefined) targetObj.vx = Number(action.impulseX);
          }
          break;
        }

        case 'set_position': {
          const targetObj = action.targetId === 'player'
            ? this.runtime.playerObj
            : objects.find(o => o.id === action.targetId);

          if (targetObj) {
            targetObj.x = Number(action.x) || 0;
            targetObj.y = Number(action.y) || 0;
            targetObj.vx = 0;
            targetObj.vy = 0;
          }
          break;
        }

        case 'show_message': {
          this.runtime.showHUDMessage(action.message, Number(action.duration) || 3.0);
          break;
        }

        case 'camera_shake': {
          this.runtime.triggerCameraShake(Number(action.intensity) || 8, Number(action.duration) || 0.3);
          break;
        }

        case 'change_scene': {
          if (action.sceneId) {
            this.runtime.changeScene(action.sceneId);
          }
          break;
        }

        case 'restart_scene': {
          this.runtime.restartScene();
          break;
        }

        case 'toggle_visible': {
          const targetObj = objects.find(o => o.id === action.targetId);
          if (targetObj) {
            targetObj.visible = action.visible !== undefined ? action.visible : !targetObj.visible;
          }
          break;
        }

        default:
          break;
      }
    }
  }
}
