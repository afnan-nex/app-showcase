/**
 * GameSmith - Scene Hierarchy & Asset Manager Panel
 * Professional game editor hierarchy tree, sprite asset library, sound FX board, and global variables manager.
 */

import { getIcon, escapeHTML } from '../core/icons.js';
import { audioSynth } from '../core/audio-synth.js';

export function renderSceneTreePanel(container, {
  currentScene,
  selectedObjectId,
  projectVariables = {},
  spriteLibrary = {},
  activeTab = 'tree',
  searchQuery = '',
  onSelectObject = null,
  onAddObject = null,
  onDeleteObject = null,
  onDuplicateObject = null,
  onToggleVisibility = null,
  onToggleLock = null,
  onReorderObject = null,
  onAddVariable = null,
  onDeleteVariable = null,
  onOpenSpritePainter = null,
  onDeleteSprite = null
}) {
  const objects = currentScene.objects || [];
  const filteredObjects = searchQuery
    ? objects.filter(o => o.name.toLowerCase().includes(searchQuery.toLowerCase()) || (o.tag && o.tag.toLowerCase().includes(searchQuery.toLowerCase())))
    : objects;

  container.innerHTML = `
    <!-- Top Sub-Tabs -->
    <div class="panel-subtabs" role="tablist" aria-label="Hierarchy Subtabs">
      <button class="subtab-btn ${activeTab === 'tree' ? 'active' : ''}" data-tab="tree" role="tab" aria-selected="${activeTab === 'tree'}">
        ${getIcon('cube', 'icon-xs')} Hierarchy
      </button>
      <button class="subtab-btn ${activeTab === 'assets' ? 'active' : ''}" data-tab="assets" role="tab" aria-selected="${activeTab === 'assets'}">
        ${getIcon('image', 'icon-xs')} Assets
      </button>
      <button class="subtab-btn ${activeTab === 'vars' ? 'active' : ''}" data-tab="vars" role="tab" aria-selected="${activeTab === 'vars'}">
        ${getIcon('code', 'icon-xs')} Variables
      </button>
    </div>

    <!-- Tab 1: Hierarchy Tree -->
    <div class="subtab-content ${activeTab === 'tree' ? 'active' : ''}" id="tab-hierarchy" role="tabpanel">
      
      <!-- Actions Bar -->
      <div class="hierarchy-actions-bar">
        <div class="flex items-center gap-1">
          <span class="text-xs font-semibold text-muted uppercase">Objects (${objects.length})</span>
        </div>

        <div class="flex items-center gap-1">
          <select id="select-add-preset" class="form-control form-control-sm w-28" title="Add Object Preset">
            <option value="">+ Add Object...</option>
            <option value="platform">+ Platform Block</option>
            <option value="player">+ Player</option>
            <option value="enemy">+ Patrol Enemy</option>
            <option value="coin">+ Collectible Coin</option>
            <option value="spike">+ Spike Hazard</option>
            <option value="portal">+ Exit Portal</option>
            <option value="circle">+ Circle Object</option>
            <option value="text">+ Text Label</option>
          </select>
        </div>
      </div>

      <!-- Search Input -->
      <div class="p-2 border-b">
        <div class="flex items-center gap-1 bg-elevated rounded px-2 py-1">
          ${getIcon('search', 'icon-xs text-muted')}
          <input type="text" id="input-hierarchy-search" class="form-control form-control-sm p-0 border-0 bg-transparent flex-1" placeholder="Filter objects..." value="${escapeHTML(searchQuery)}" />
          ${searchQuery ? `<button class="btn-icon-xs text-muted" id="btn-clear-search">&times;</button>` : ''}
        </div>
      </div>

      <!-- Object Hierarchy List -->
      <div class="scene-tree-list">
        ${filteredObjects.length === 0 ? `
          <div class="p-4 text-center text-muted text-xs">
            ${searchQuery ? 'No matching objects found.' : 'Scene is empty. Select "+ Add Object" to insert game elements.'}
          </div>
        ` : filteredObjects.map((obj, index) => {
          const isSelected = obj.id === selectedObjectId;
          let iconName = 'cube';
          if (obj.shape === 'coin') iconName = 'sparkles';
          else if (obj.behavior === 'player' || obj.tag === 'player') iconName = 'pointer';
          else if (obj.shape === 'spike') iconName = 'lightning';
          else if (obj.shape === 'heart') iconName = 'heart';

          return `
            <div class="tree-node-item ${isSelected ? 'selected' : ''}" data-id="${obj.id}" title="${escapeHTML(obj.name)} (Layer: ${obj.layer || 0})">
              <span class="tree-obj-icon" style="color: ${obj.color || '#58a6ff'};">
                ${getIcon(iconName, 'icon-xs')}
              </span>
              <span class="tree-obj-name font-medium flex-1 truncate">${escapeHTML(obj.name)}</span>
              ${obj.tag ? `<span class="badge badge-secondary text-xs">${escapeHTML(obj.tag)}</span>` : ''}
              
              <div class="tree-item-controls">
                <button class="btn-icon-xs btn-move-up" data-id="${obj.id}" title="Move Layer Up">${getIcon('chevronUp', 'icon-xs')}</button>
                <button class="btn-icon-xs btn-move-down" data-id="${obj.id}" title="Move Layer Down">${getIcon('chevronDown', 'icon-xs')}</button>
                <button class="btn-icon-xs btn-toggle-vis" data-id="${obj.id}" title="${obj.visible !== false ? 'Hide Object' : 'Show Object'}">
                  ${getIcon(obj.visible !== false ? 'eye' : 'eyeOff', 'icon-xs')}
                </button>
                <button class="btn-icon-xs btn-toggle-lock" data-id="${obj.id}" title="${obj.locked ? 'Unlock Object' : 'Lock Object'}">
                  ${getIcon(obj.locked ? 'lock' : 'unlock', 'icon-xs')}
                </button>
                <button class="btn-icon-xs btn-dupe-obj" data-id="${obj.id}" title="Duplicate (Ctrl+D)">
                  ${getIcon('copy', 'icon-xs')}
                </button>
                <button class="btn-icon-xs btn-icon-danger btn-del-obj" data-id="${obj.id}" title="Delete Object">
                  ${getIcon('trash', 'icon-xs')}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Tab 2: Assets & Sound FX -->
    <div class="subtab-content ${activeTab === 'assets' ? 'active' : ''}" id="tab-assets" role="tabpanel">
      <div class="p-3">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-semibold text-muted uppercase">Sprite Library (${Object.keys(spriteLibrary).length})</span>
          <button class="btn btn-xs btn-primary" id="btn-open-sprite-painter">
            ${getIcon('paint', 'icon-xs')} New Sprite
          </button>
        </div>

        <div class="sprites-grid mb-4">
          ${Object.entries(spriteLibrary).length === 0 ? `
            <div class="col-span-3 text-muted text-xs text-center p-3 card">No custom sprites. Click "New Sprite" to draw pixel art!</div>
          ` : Object.entries(spriteLibrary).map(([id, sprite]) => `
            <div class="card p-2 text-center sprite-card cursor-pointer" data-id="${id}" title="Edit ${escapeHTML(sprite.name)}">
              <div class="sprite-thumb-box mb-1" style="background: #0d1117; width: 44px; height: 44px; margin: 0 auto; border-radius: 4px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-subtle);">
                <span class="text-xs font-mono font-bold" style="color: ${sprite.primaryColor || '#58a6ff'};">${escapeHTML(sprite.name.slice(0, 2).toUpperCase())}</span>
              </div>
              <span class="text-xs font-medium block truncate">${escapeHTML(sprite.name)}</span>
              <div class="flex items-center justify-center gap-1 mt-1">
                <span class="badge badge-secondary text-xs">${sprite.size || 16}px</span>
                <button class="btn-icon-xs text-rose btn-delete-sprite" data-id="${id}" title="Delete Sprite">&times;</button>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- 8-Bit Audio Synthesizer -->
        <div class="border-t pt-3">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold text-muted uppercase">8-Bit Sound FX Board</span>
            <button class="btn btn-xs btn-ghost btn-toggle-mute" title="Mute Audio">
              ${getIcon(audioSynth.isMuted ? 'volumeX' : 'volume', 'icon-xs')}
            </button>
          </div>

          <div class="sounds-list grid grid-cols-2 gap-2">
            ${[
              { id: 'jump', label: 'Jump', color: 'text-primary' },
              { id: 'double_jump', label: 'Double Jump', color: 'text-primary' },
              { id: 'coin', label: 'Crystal Coin', color: 'text-amber' },
              { id: 'laser', label: 'Laser Blast', color: 'text-emerald' },
              { id: 'explosion', label: 'Explosion', color: 'text-rose' },
              { id: 'hit', label: 'Hurt / Hit', color: 'text-rose' },
              { id: 'powerup', label: 'Powerup', color: 'text-emerald' },
              { id: 'win', label: 'Fanfare', color: 'text-amber' },
              { id: 'game_over', label: 'Game Over', color: 'text-rose' },
              { id: 'teleport', label: 'Teleport', color: 'text-primary' },
              { id: 'dash', label: 'Dash Burst', color: 'text-secondary' },
              { id: 'bounce', label: 'Spring Bounce', color: 'text-emerald' }
            ].map(s => `
              <button class="card p-2 flex items-center justify-between text-xs btn-test-sound cursor-pointer" data-sound="${s.id}">
                <span class="font-mono font-medium ${s.color}">${s.label}</span>
                <span class="text-muted">${getIcon('play', 'icon-xs')}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 3: Global Variables -->
    <div class="subtab-content ${activeTab === 'vars' ? 'active' : ''}" id="tab-vars" role="tabpanel">
      <div class="p-3">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-semibold text-muted uppercase">Global Variables (${Object.keys(projectVariables).length})</span>
          <button class="btn btn-xs btn-primary" id="btn-add-global-var">
            ${getIcon('plus', 'icon-xs')} Add Variable
          </button>
        </div>

        <div class="variables-list flex flex-col gap-2">
          ${Object.entries(projectVariables).length === 0 ? `
            <div class="text-muted text-xs text-center p-4 card">No global variables. Variables are used for score, lives, inventory, and rule conditions.</div>
          ` : Object.entries(projectVariables).map(([name, val]) => `
            <div class="card p-2 flex items-center justify-between gap-2 text-xs">
              <div class="flex flex-col flex-1 truncate">
                <span class="font-mono font-bold text-primary truncate">${escapeHTML(name)}</span>
                <span class="text-muted" style="font-size: 10px;">${typeof val}</span>
              </div>
              <input type="text" class="form-control form-control-sm font-mono w-24 text-right var-val-input" data-var="${escapeHTML(name)}" value="${val}" />
              <button class="btn-icon-xs text-rose btn-del-var" data-var="${escapeHTML(name)}" title="Delete Variable">&times;</button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // --- Attach Handlers ---
  const reRender = (newTab = activeTab, newSearch = searchQuery) => {
    renderSceneTreePanel(container, {
      currentScene,
      selectedObjectId,
      projectVariables,
      spriteLibrary,
      activeTab: newTab,
      searchQuery: newSearch,
      onSelectObject,
      onAddObject,
      onDeleteObject,
      onDuplicateObject,
      onToggleVisibility,
      onToggleLock,
      onReorderObject,
      onAddVariable,
      onDeleteVariable,
      onOpenSpritePainter,
      onDeleteSprite
    });
  };

  // Subtab switcher
  container.querySelectorAll('.subtab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      reRender(btn.dataset.tab, searchQuery);
    });
  });

  // Search input
  const searchInput = container.querySelector('#input-hierarchy-search');
  searchInput?.addEventListener('input', (e) => {
    reRender(activeTab, e.target.value);
  });
  container.querySelector('#btn-clear-search')?.addEventListener('click', () => {
    reRender(activeTab, '');
  });

  // Object Selection
  container.querySelectorAll('.tree-node-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      if (onSelectObject) onSelectObject(item.dataset.id);
    });
  });

  // Add Preset Object
  container.querySelector('#select-add-preset')?.addEventListener('change', (e) => {
    const preset = e.target.value;
    if (preset && onAddObject) {
      onAddObject(preset);
      e.target.value = '';
    }
  });

  // Move Layer Up / Down
  container.querySelectorAll('.btn-move-up').forEach(btn => {
    btn.addEventListener('click', () => {
      const obj = objects.find(o => o.id === btn.dataset.id);
      if (obj) {
        obj.layer = (obj.layer || 0) + 1;
        if (onReorderObject) onReorderObject();
      }
    });
  });
  container.querySelectorAll('.btn-move-down').forEach(btn => {
    btn.addEventListener('click', () => {
      const obj = objects.find(o => o.id === btn.dataset.id);
      if (obj) {
        obj.layer = Math.max(0, (obj.layer || 0) - 1);
        if (onReorderObject) onReorderObject();
      }
    });
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

  // Toggle audio mute
  container.querySelector('.btn-toggle-mute')?.addEventListener('click', () => {
    audioSynth.toggleMute();
    reRender('assets', searchQuery);
  });

  // Open Sprite Painter for New Sprite
  container.querySelector('#btn-open-sprite-painter')?.addEventListener('click', () => {
    if (onOpenSpritePainter) onOpenSpritePainter(null);
  });

  // Edit Existing Sprite
  container.querySelectorAll('.sprite-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-delete-sprite')) return;
      const spriteId = card.dataset.id;
      if (spriteLibrary[spriteId] && onOpenSpritePainter) {
        onOpenSpritePainter(spriteLibrary[spriteId]);
      }
    });
  });

  // Delete Sprite
  container.querySelectorAll('.btn-delete-sprite').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const sId = btn.dataset.id;
      if (confirm(`Delete sprite "${spriteLibrary[sId]?.name || sId}"?`)) {
        if (onDeleteSprite) onDeleteSprite(sId);
      }
    });
  });

  // Add Variable
  container.querySelector('#btn-add-global-var')?.addEventListener('click', () => {
    const varName = prompt('Enter new variable identifier (e.g. score, coins, lives, keys):', 'newVar');
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
