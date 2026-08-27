/**
 * GameSmith - Object & Scene Inspector
 * Godot/Unity-style property inspector for transforms, sprites, physics, and behaviors.
 */

import { getIcon, escapeHTML } from '../core/icons.js';

export function renderInspector(container, selectedObject, currentScene, spriteLibrary = {}, onPropertyChange = null) {
  if (!selectedObject) {
    renderSceneInspector(container, currentScene, onPropertyChange);
    return;
  }

  const obj = selectedObject;

  container.innerHTML = `
    <div class="inspector-header">
      <div class="flex items-center gap-2">
        <span class="badge badge-primary font-mono text-xs">OBJECT</span>
        <input type="text" id="insp-obj-name" class="form-control form-control-sm font-bold text-primary flex-1" value="${escapeHTML(obj.name)}" />
      </div>
    </div>

    <div class="inspector-scroll-body">
      
      <!-- General & Tags -->
      <div class="inspector-section">
        <div class="inspector-section-title">General</div>
        <div class="inspector-field-row">
          <label class="insp-label">Tag / Group</label>
          <input type="text" id="insp-obj-tag" class="form-control form-control-sm font-mono" placeholder="player, coin, enemy, etc." value="${escapeHTML(obj.tag || '')}" />
        </div>
        <div class="inspector-field-row">
          <label class="insp-label">Layer (Z-Order)</label>
          <input type="number" id="insp-obj-layer" class="form-control form-control-sm" value="${obj.layer || 0}" />
        </div>
      </div>

      <!-- Transform -->
      <div class="inspector-section">
        <div class="inspector-section-title">Transform</div>
        <div class="inspector-grid-2">
          <div class="inspector-field-row">
            <label class="insp-label">X</label>
            <input type="number" id="insp-obj-x" class="form-control form-control-sm" value="${Math.round(obj.x)}" />
          </div>
          <div class="inspector-field-row">
            <label class="insp-label">Y</label>
            <input type="number" id="insp-obj-y" class="form-control form-control-sm" value="${Math.round(obj.y)}" />
          </div>
        </div>
        <div class="inspector-grid-2">
          <div class="inspector-field-row">
            <label class="insp-label">Width</label>
            <input type="number" id="insp-obj-w" class="form-control form-control-sm" value="${Math.round(obj.width)}" />
          </div>
          <div class="inspector-field-row">
            <label class="insp-label">Height</label>
            <input type="number" id="insp-obj-h" class="form-control form-control-sm" value="${Math.round(obj.height)}" />
          </div>
        </div>
        <div class="inspector-field-row">
          <label class="insp-label">Rotation (&deg;)</label>
          <input type="number" id="insp-obj-rot" class="form-control form-control-sm" value="${obj.rotation || 0}" />
        </div>
      </div>

      <!-- Appearance & Sprite -->
      <div class="inspector-section">
        <div class="inspector-section-title">Appearance & Sprite</div>
        <div class="inspector-field-row">
          <label class="insp-label">Draw Mode / Shape</label>
          <select id="insp-obj-shape" class="form-control form-control-sm">
            <option value="platform" ${obj.shape === 'platform' ? 'selected' : ''}>Platform / Block</option>
            <option value="rect" ${obj.shape === 'rect' ? 'selected' : ''}>Rectangle</option>
            <option value="circle" ${obj.shape === 'circle' ? 'selected' : ''}>Circle</option>
            <option value="coin" ${obj.shape === 'coin' ? 'selected' : ''}>Coin Shimmer</option>
            <option value="spike" ${obj.shape === 'spike' ? 'selected' : ''}>Spike / Hazard</option>
            <option value="text" ${obj.shape === 'text' ? 'selected' : ''}>Text Label</option>
          </select>
        </div>
        <div class="inspector-field-row">
          <label class="insp-label">Tint Color</label>
          <div class="flex items-center gap-2">
            <input type="color" id="insp-obj-color" class="form-control form-control-sm p-0 w-8 h-7 cursor-pointer" value="${obj.color || '#58a6ff'}" />
            <input type="text" id="insp-obj-color-hex" class="form-control form-control-sm font-mono flex-1" value="${obj.color || '#58a6ff'}" />
          </div>
        </div>
        <div class="inspector-field-row">
          <label class="insp-label">Sprite Asset</label>
          <select id="insp-obj-sprite" class="form-control form-control-sm">
            <option value="">-- None (Vector Shape) --</option>
            ${Object.keys(spriteLibrary).map(k => `<option value="${k}" ${obj.spriteId === k ? 'selected' : ''}>${escapeHTML(spriteLibrary[k].name || k)}</option>`).join('')}
          </select>
        </div>
      </div>

      <!-- Physics & Colliders -->
      <div class="inspector-section">
        <div class="inspector-section-title">Physics & Colliders</div>
        <div class="inspector-field-row">
          <label class="insp-label">Physics Type</label>
          <select id="insp-obj-physics" class="form-control form-control-sm">
            <option value="static" ${obj.physicsType === 'static' ? 'selected' : ''}>Static (Immovable / Wall / Floor)</option>
            <option value="dynamic" ${obj.physicsType === 'dynamic' ? 'selected' : ''}>Dynamic (Gravity & Forces)</option>
            <option value="none" ${obj.physicsType === 'none' ? 'selected' : ''}>None (Trigger / Decorative)</option>
          </select>
        </div>
        <div class="inspector-field-row">
          <label class="checkbox-label text-xs">
            <input type="checkbox" id="insp-obj-has-col" ${obj.hasCollider !== false ? 'checked' : ''} /> Enable Collision Detection
          </label>
        </div>
        <div class="inspector-field-row">
          <label class="checkbox-label text-xs">
            <input type="checkbox" id="insp-obj-is-solid" ${obj.isSolid ? 'checked' : ''} /> Solid Obstacle (Blocks movement)
          </label>
        </div>
        <div class="inspector-field-row">
          <label class="insp-label">Collider Shape</label>
          <select id="insp-obj-col-shape" class="form-control form-control-sm">
            <option value="box" ${obj.colliderShape !== 'circle' ? 'selected' : ''}>Box (AABB)</option>
            <option value="circle" ${obj.colliderShape === 'circle' ? 'selected' : ''}>Circle</option>
          </select>
        </div>
        <div class="inspector-field-row">
          <label class="insp-label">Gravity Scale</label>
          <input type="number" step="0.1" id="insp-obj-grav" class="form-control form-control-sm" value="${obj.gravityScale !== undefined ? obj.gravityScale : 1}" />
        </div>
      </div>

      <!-- Behavior Presets -->
      <div class="inspector-section">
        <div class="inspector-section-title">Behavior Presets</div>
        <div class="inspector-field-row">
          <label class="insp-label">Preset Controller</label>
          <select id="insp-obj-behavior" class="form-control form-control-sm">
            <option value="none" ${!obj.behavior || obj.behavior === 'none' ? 'selected' : ''}>None (Custom / Static)</option>
            <option value="player" ${obj.behavior === 'player' ? 'selected' : ''}>Player: 2D Platformer</option>
            <option value="topdown" ${obj.behavior === 'topdown' ? 'selected' : ''}>Player: Top-Down 8-Way</option>
            <option value="patrol" ${obj.behavior === 'patrol' ? 'selected' : ''}>Enemy: Patrol Left/Right</option>
            <option value="bullet" ${obj.behavior === 'bullet' ? 'selected' : ''}>Projectile: Bullet / Laser</option>
          </select>
        </div>
        ${obj.behavior === 'player' ? `
          <div class="inspector-field-row">
            <label class="insp-label">Move Speed</label>
            <input type="number" id="insp-obj-speed" class="form-control form-control-sm" value="${obj.moveSpeed || 320}" />
          </div>
          <div class="inspector-field-row">
            <label class="insp-label">Jump Force</label>
            <input type="number" id="insp-obj-jump" class="form-control form-control-sm" value="${obj.jumpForce || 480}" />
          </div>
        ` : ''}
      </div>

    </div>
  `;

  // --- Attach Handlers ---
  const bind = (id, prop, parser = (v) => v) => {
    container.querySelector('#' + id)?.addEventListener('input', (e) => {
      obj[prop] = parser(e.target.value);
      if (onPropertyChange) onPropertyChange(obj);
    });
  };

  bind('insp-obj-name', 'name');
  bind('insp-obj-tag', 'tag');
  bind('insp-obj-layer', 'layer', Number);
  bind('insp-obj-x', 'x', Number);
  bind('insp-obj-y', 'y', Number);
  bind('insp-obj-w', 'width', Number);
  bind('insp-obj-h', 'height', Number);
  bind('insp-obj-rot', 'rotation', Number);
  bind('insp-obj-shape', 'shape');
  bind('insp-obj-sprite', 'spriteId');
  bind('insp-obj-physics', 'physicsType');
  bind('insp-obj-col-shape', 'colliderShape');
  bind('insp-obj-grav', 'gravityScale', Number);
  bind('insp-obj-behavior', 'behavior');
  bind('insp-obj-speed', 'moveSpeed', Number);
  bind('insp-obj-jump', 'jumpForce', Number);

  // Color pickers sync
  const colorPicker = container.querySelector('#insp-obj-color');
  const colorHex = container.querySelector('#insp-obj-color-hex');
  colorPicker?.addEventListener('input', () => {
    colorHex.value = colorPicker.value;
    obj.color = colorPicker.value;
    if (onPropertyChange) onPropertyChange(obj);
  });
  colorHex?.addEventListener('input', () => {
    colorPicker.value = colorHex.value;
    obj.color = colorHex.value;
    if (onPropertyChange) onPropertyChange(obj);
  });

  // Checkboxes
  container.querySelector('#insp-obj-has-col')?.addEventListener('change', (e) => {
    obj.hasCollider = e.target.checked;
    if (onPropertyChange) onPropertyChange(obj);
  });
  container.querySelector('#insp-obj-is-solid')?.addEventListener('change', (e) => {
    obj.isSolid = e.target.checked;
    if (onPropertyChange) onPropertyChange(obj);
  });
}

function renderSceneInspector(container, currentScene, onPropertyChange) {
  container.innerHTML = `
    <div class="inspector-header">
      <span class="badge badge-secondary font-mono text-xs">SCENE PROPERTIES</span>
    </div>
    <div class="inspector-scroll-body">
      <div class="inspector-section">
        <div class="inspector-section-title">Scene Settings</div>
        <div class="inspector-field-row">
          <label class="insp-label">Scene Name</label>
          <input type="text" id="insp-scene-name" class="form-control form-control-sm font-bold" value="${escapeHTML(currentScene.name)}" />
        </div>
        <div class="inspector-field-row">
          <label class="insp-label">Background Color</label>
          <div class="flex items-center gap-2">
            <input type="color" id="insp-scene-bg" class="form-control form-control-sm p-0 w-8 h-7 cursor-pointer" value="${currentScene.bgColor || '#0d1117'}" />
            <input type="text" id="insp-scene-bg-hex" class="form-control form-control-sm font-mono flex-1" value="${currentScene.bgColor || '#0d1117'}" />
          </div>
        </div>
        <div class="inspector-field-row">
          <label class="insp-label">World Gravity (Y)</label>
          <input type="number" id="insp-scene-gravity" class="form-control form-control-sm" value="${currentScene.gravity !== undefined ? currentScene.gravity : 980}" />
        </div>
        <div class="inspector-field-row">
          <label class="checkbox-label text-xs">
            <input type="checkbox" id="insp-scene-camera" ${currentScene.cameraFollow !== false ? 'checked' : ''} /> Camera Follow Player
          </label>
        </div>
      </div>
      <div class="p-3 text-xs text-muted">
        Click any object on canvas or scene tree to inspect object properties.
      </div>
    </div>
  `;

  container.querySelector('#insp-scene-name')?.addEventListener('input', (e) => {
    currentScene.name = e.target.value;
    if (onPropertyChange) onPropertyChange();
  });
  container.querySelector('#insp-scene-gravity')?.addEventListener('input', (e) => {
    currentScene.gravity = Number(e.target.value);
    if (onPropertyChange) onPropertyChange();
  });
  container.querySelector('#insp-scene-camera')?.addEventListener('change', (e) => {
    currentScene.cameraFollow = e.target.checked;
    if (onPropertyChange) onPropertyChange();
  });

  const bgPicker = container.querySelector('#insp-scene-bg');
  const bgHex = container.querySelector('#insp-scene-bg-hex');
  bgPicker?.addEventListener('input', () => {
    bgHex.value = bgPicker.value;
    currentScene.bgColor = bgPicker.value;
    if (onPropertyChange) onPropertyChange();
  });
  bgHex?.addEventListener('input', () => {
    bgPicker.value = bgHex.value;
    currentScene.bgColor = bgHex.value;
    if (onPropertyChange) onPropertyChange();
  });
}
