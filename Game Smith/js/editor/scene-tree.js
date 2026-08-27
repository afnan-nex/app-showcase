/**
 * GameSmith - Scene Tree & Asset Manager Panel
 * Hierarchical scene object listing, sprite assets drawer, and global variables manager.
 */

import { getIcon, escapeHTML } from '../core/icons.js';
import { audioSynth } from '../core/audio-synth.js';

export function renderSceneTreePanel(container, {
  currentScene,
  selectedObjectId,
  projectVariables = {},
  spriteLibrary = {},
  activeTab = 'tree',
  onSelectObject = null,
  onAddObject = null,
  onDeleteObject = null,
  onDuplicateObject = null,
  onToggleVisibility = null,
  onToggleLock = null,
  onAddVariable = null,
  onDeleteVariable = null,
  onOpenSpritePainter = null
}) {
  const objects = currentScene.objects || [];

  container.innerHTML = `
    <!-- Top Sub-Tabs -->
    <div class="panel-subtabs">
      <button class="subtab-btn ${activeTab === 'tree' ? 'active' : ''}" data-tab="tree">
        ${getIcon('cube', 'icon-xs')} Hierarchy
      </button>
      <button class="subtab-btn ${activeTab === 'assets' ? 'active' : ''}" data-tab="assets">
        ${getIcon('image', 'icon-xs')} Assets
      </button>
      <button class="subtab-btn ${activeTab === 'vars' ? 'active' : ''}" data-tab="vars">
        ${getIcon('code', 'icon-xs')} Variables
      </button>
    </div>

    <!-- Tab 1: Hierarchy Tree -->
    <div class="subtab-content ${activeTab === 'tree' ? 'active' : ''}" id="tab-hierarchy">
      <div class="hierarchy-actions-bar">
        <span class="text-xs font-semibold text-muted uppercase">Objects (${objects.length})</span>
        <button class="btn btn-xs btn-primary" id="btn-tree-add-object">
          ${getIcon('plus', 'icon-xs')} New Object
        </button>
      </div>
      <div class="scene-tree-list">
        ${objects.length === 0 ? `
          <div class="p-4 text-center text-muted text-xs">Scene is empty. Click "+ New Object" to add elements.</div>
        ` : objects.map(obj => {
          const isSelected = obj.id === selectedObjectId;
          return `
            <div class="tree-node-item ${isSelected ? 'selected' : ''}" data-id="${obj.id}">
              <span class="tree-obj-icon" style="color: ${obj.color || '#58a6ff'};">
                ${getIcon(obj.shape === 'coin' ? 'sparkles' : (obj.behavior === 'player' ? 'pointer' : 'cube'), 'icon-xs')}
              </span>
              <span class="tree-obj-name font-medium flex-1 truncate">${escapeHTML(obj.name)}</span>
              ${obj.tag ? `<span class="badge badge-secondary text-xs">${escapeHTML(obj.tag)}</span>` : ''}
              
              <div class="tree-item-controls">
                <button class="btn-icon-xs btn-toggle-vis" data-id="${obj.id}" title="Toggle Visibility">
                  ${getIcon(obj.visible !== false ? 'eye' : 'eyeOff', 'icon-xs')}
                </button>
                <button class="btn-icon-xs btn-toggle-lock" data-id="${obj.id}" title="Toggle Lock">
                  ${getIcon(obj.locked ? 'lock' : 'unlock', 'icon-xs')}
                </button>
                <button class="btn-icon-xs btn-dupe-obj" data-id="${obj.id}" title="Duplicate">
                  ${getIcon('copy', 'icon-xs')}
                </button>
                <button class="btn-icon-xs btn-icon-danger btn-del-obj" data-id="${obj.id}" title="Delete">
                  ${getIcon('trash', 'icon-xs')}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Tab 2: Assets & Audio FX -->
    <div class="subtab-content ${activeTab === 'assets' ? 'active' : ''}" id="tab-assets">
      <div class="p-3">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-semibold text-muted uppercase">Sprite Library</span>
          <button class="btn btn-xs btn-primary" id="btn-open-sprite-painter">
            ${getIcon('paint', 'icon-xs')} Paint Sprite
          </button>
        </div>

        <div class="sprites-grid mb-4">
          ${Object.entries(spriteLibrary).map(([id, sprite]) => `
            <div class="card p-2 text-center sprite-card cursor-pointer" data-id="${id}">
              <div class="sprite-thumb-box mb-1" style="background: #0d1117; width: 40px; height: 40px; margin: 0 auto; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
                <span class="text-xs font-mono font-bold" style="color: ${sprite.primaryColor || '#58a6ff'};">${sprite.name.slice(0, 2).toUpperCase()}</span>
              </div>
              <span class="text-xs font-medium block truncate">${escapeHTML(sprite.name)}</span>
            </div>
          `).join('')}
        </div>

        <div class="flex items-center justify-between mb-3 border-t pt-3">
          <span class="text-xs font-semibold text-muted uppercase">8-Bit Sound FX Synthesizer</span>
        </div>
        <div class="sounds-list flex flex-col gap-2">
          ${['coin', 'jump', 'laser', 'explosion', 'hit', 'powerup', 'win'].map(s => `
            <div class="card p-2 flex items-center justify-between text-xs">
              <span class="font-mono capitalize font-semibold">${s}</span>
              <button class="btn btn-xs btn-secondary btn-test-sound" data-sound="${s}">
                ${getIcon('volume', 'icon-xs')} Play
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Tab 3: Global Variables -->
    <div class="subtab-content ${activeTab === 'vars' ? 'active' : ''}" id="tab-vars">
      <div class="p-3">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-semibold text-muted uppercase">Global Variables</span>
          <button class="btn btn-xs btn-primary" id="btn-add-global-var">
            ${getIcon('plus', 'icon-xs')} Add Variable
          </button>
        </div>

        <div class="variables-list flex flex-col gap-2">
          ${Object.entries(projectVariables).length === 0 ? `
            <div class="text-muted text-xs text-center p-3">No global variables defined.</div>
          ` : Object.entries(projectVariables).map(([name, val]) => `
            <div class="card p-2 flex items-center justify-between gap-2 text-xs">
              <span class="font-mono font-bold text-primary">${escapeHTML(name)}</span>
              <input type="text" class="form-control form-control-sm font-mono w-20 text-right var-val-input" data-var="${escapeHTML(name)}" value="${val}" />
              <button class="btn-icon-xs text-rose btn-del-var" data-var="${escapeHTML(name)}">&times;</button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // --- Attach Handlers ---
  // Subtab switcher
  container.querySelectorAll('.subtab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      renderSceneTreePanel(container, {
        currentScene,
        selectedObjectId,
        projectVariables,
        spriteLibrary,
        activeTab: btn.dataset.tab,
        onSelectObject,
        onAddObject,
        onDeleteObject,
        onDuplicateObject,
        onToggleVisibility,
        onToggleLock,
        onAddVariable,
        onDeleteVariable,
        onOpenSpritePainter
      });
    });
  });

  // Object Selection
  container.querySelectorAll('.tree-node-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      if (onSelectObject) onSelectObject(item.dataset.id);
    });
  });

  // Add Object
  container.querySelector('#btn-tree-add-object')?.addEventListener('click', () => {
    if (onAddObject) onAddObject();
  });

  // Toggle Visibility
  container.querySelectorAll('.btn-toggle-vis').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onToggleVisibility) onToggleVisibility(btn.dataset.id);
    });
  });

  // Toggle Lock
  container.querySelectorAll('.btn-toggle-lock').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onToggleLock) onToggleLock(btn.dataset.id);
    });
  });

  // Duplicate Object
  container.querySelectorAll('.btn-dupe-obj').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onDuplicateObject) onDuplicateObject(btn.dataset.id);
    });
  });

  // Delete Object
  container.querySelectorAll('.btn-del-obj').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onDeleteObject) onDeleteObject(btn.dataset.id);
    });
  });

  // Sound test buttons
  container.querySelectorAll('.btn-test-sound').forEach(btn => {
    btn.addEventListener('click', () => {
      audioSynth.play(btn.dataset.sound);
    });
  });

  // Open Sprite Painter
  container.querySelector('#btn-open-sprite-painter')?.addEventListener('click', () => {
    if (onOpenSpritePainter) onOpenSpritePainter();
  });

  // Add Variable
  container.querySelector('#btn-add-global-var')?.addEventListener('click', () => {
    const varName = prompt('Enter new variable name (e.g. score, coins, lives):', 'newVar');
    if (varName && varName.trim()) {
      if (onAddVariable) onAddVariable(varName.trim(), 0);
    }
  });

  // Edit Variable value
  container.querySelectorAll('.var-val-input').forEach(inp => {
    inp.addEventListener('input', () => {
      projectVariables[inp.dataset.var] = isNaN(inp.value) ? inp.value : Number(inp.value);
    });
  });

  // Delete Variable
  container.querySelectorAll('.btn-del-var').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onDeleteVariable) onDeleteVariable(btn.dataset.var);
    });
  });
}
