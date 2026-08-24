/**
 * NoteSpace - Database Item Detail Modal & Property Editor Modals
 * Renders full-page item modal with property inspectors and inner block document editor.
 */

import { Icons, getIcon } from '../icons/icons.js';
import { createElement, escapeHTML } from '../utils/dom.js';

export function openItemDetailModal(database, row, onUpdateRow) {
  document.querySelectorAll('.ns-item-modal-backdrop').forEach(m => m.remove());

  const backdrop = createElement('div', 'ns-modal-backdrop ns-item-modal-backdrop');
  const modal = createElement('div', 'ns-item-detail-modal');

  const titleProp = database.properties.find(p => p.type === 'title');
  const title = (titleProp && row.properties[titleProp.id]) || 'Untitled';

  modal.innerHTML = `
    <div class="ns-item-modal-header">
      <div class="ns-modal-breadcrumbs">
        <span>${escapeHTML(database.title || 'Database')}</span> / <strong>${escapeHTML(title)}</strong>
      </div>
      <div class="ns-modal-header-actions">
        <button class="ns-modal-close-btn" title="Close">${Icons.x}</button>
      </div>
    </div>
    
    <div class="ns-item-modal-body">
      <div class="ns-item-title-input" contenteditable="true" data-placeholder="Untitled">${escapeHTML(title)}</div>
      
      <div class="ns-item-properties-panel">
        <div class="ns-prop-panel-title">Properties</div>
        <div class="ns-props-table"></div>
      </div>

      <div class="ns-item-divider"></div>

      <div class="ns-item-notes-section">
        <div class="ns-notes-header">Notes & Content</div>
        <div class="ns-item-content-editor" contenteditable="true" data-placeholder="Type notes or block details for this task..."></div>
      </div>
    </div>
  `;

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  // Bind title edit
  const titleInp = modal.querySelector('.ns-item-title-input');
  titleInp.addEventListener('blur', () => {
    const val = titleInp.innerText.trim();
    if (titleProp) {
      onUpdateRow(row.id, { [titleProp.id]: val || 'Untitled' });
    }
  });

  // Render properties list in modal
  const propsContainer = modal.querySelector('.ns-props-table');
  database.properties.filter(p => p.type !== 'title').forEach(prop => {
    const rowEl = createElement('div', 'ns-prop-row');
    rowEl.innerHTML = `
      <div class="ns-prop-label">
        <span class="ns-prop-icon">${getIcon(prop.type === 'status' ? 'propStatus' : (prop.type === 'select' ? 'propSelect' : (prop.type === 'multi-select' ? 'propMultiSelect' : (prop.type === 'date' ? 'propDate' : (prop.type === 'number' ? 'propNumber' : (prop.type === 'checkbox' ? 'propCheckbox' : 'propText'))))))}</span>
        <span>${escapeHTML(prop.name)}</span>
      </div>
      <div class="ns-prop-value" data-prop-id="${prop.id}"></div>
    `;

    const valEl = rowEl.querySelector('.ns-prop-value');
    const val = row.properties[prop.id];

    if (prop.type === 'status') {
      const opt = (prop.options || []).find(o => o.label === val) || { label: val || 'Not Started', color: 'gray' };
      valEl.innerHTML = `<span class="ns-status-badge ns-badge-${opt.color}">${escapeHTML(opt.label)}</span>`;
      valEl.addEventListener('click', () => {
        // Cycle status or prompt
        const options = prop.options || [];
        const currIdx = options.findIndex(o => o.label === opt.label);
        const nextOpt = options[(currIdx + 1) % options.length];
        onUpdateRow(row.id, { [prop.id]: nextOpt.label });
        valEl.innerHTML = `<span class="ns-status-badge ns-badge-${nextOpt.color}">${escapeHTML(nextOpt.label)}</span>`;
      });
    } else if (prop.type === 'select') {
      valEl.innerHTML = val ? `<span class="ns-tag-badge ns-badge-blue">${escapeHTML(val)}</span>` : '<span class="ns-placeholder-text">Empty</span>';
    } else if (prop.type === 'multi-select') {
      const selected = Array.isArray(val) ? val : [];
      valEl.innerHTML = selected.length > 0 ? selected.map(s => `<span class="ns-tag-badge ns-badge-purple">${escapeHTML(s)}</span>`).join(' ') : '<span class="ns-placeholder-text">Empty</span>';
    } else if (prop.type === 'checkbox') {
      valEl.innerHTML = `<input type="checkbox" ${val ? 'checked' : ''} />`;
      valEl.querySelector('input').addEventListener('change', (e) => {
        onUpdateRow(row.id, { [prop.id]: e.target.checked });
      });
    } else if (prop.type === 'date') {
      valEl.innerHTML = `<input type="date" class="ns-input-sm" value="${val || ''}" />`;
      valEl.querySelector('input').addEventListener('change', (e) => {
        onUpdateRow(row.id, { [prop.id]: e.target.value });
      });
    } else {
      valEl.innerHTML = `<span contenteditable="true" class="ns-text-val">${escapeHTML(val !== undefined && val !== null ? String(val) : '')}</span>`;
      const txt = valEl.querySelector('.ns-text-val');
      txt.addEventListener('blur', () => {
        onUpdateRow(row.id, { [prop.id]: txt.innerText.trim() });
      });
    }

    propsContainer.appendChild(rowEl);
  });

  // Render Inner Content
  const contentEditor = modal.querySelector('.ns-item-content-editor');
  const innerHtml = (row.contentBlocks && row.contentBlocks[0] && row.contentBlocks[0].content) || '';
  contentEditor.innerHTML = innerHtml;
  contentEditor.addEventListener('blur', () => {
    const text = contentEditor.innerHTML;
    row.contentBlocks = [{ id: 'cb-' + Date.now(), type: 'paragraph', content: text }];
    onUpdateRow(row.id, {}, row.contentBlocks);
  });

  // Close handlers
  modal.querySelector('.ns-modal-close-btn').addEventListener('click', () => backdrop.remove());
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) backdrop.remove();
  });
}

export function openAddPropertyModal(onAdd) {
  document.querySelectorAll('.ns-prop-modal-backdrop').forEach(m => m.remove());

  const backdrop = createElement('div', 'ns-modal-backdrop ns-prop-modal-backdrop');
  const modal = createElement('div', 'ns-add-prop-modal');

  modal.innerHTML = `
    <div class="ns-modal-header">
      <h3>Add New Property</h3>
      <button class="ns-modal-close-btn">${Icons.x}</button>
    </div>
    <div class="ns-modal-body">
      <div class="ns-form-group">
        <label class="ns-form-label">Property Name</label>
        <input type="text" class="ns-input ns-prop-name-inp" placeholder="e.g. Priority, Assignee, Estimate..." />
      </div>
      <div class="ns-form-group">
        <label class="ns-form-label">Property Type</label>
        <select class="ns-input ns-prop-type-select">
          <option value="text">Text</option>
          <option value="status">Status</option>
          <option value="select">Select (Single choice)</option>
          <option value="multi-select">Multi-Select (Tags)</option>
          <option value="date">Date</option>
          <option value="number">Number</option>
          <option value="checkbox">Checkbox</option>
        </select>
      </div>
    </div>
    <div class="ns-modal-footer">
      <button class="ns-btn ns-btn-secondary ns-btn-cancel-prop">Cancel</button>
      <button class="ns-btn ns-btn-primary ns-btn-confirm-prop">Create Property</button>
    </div>
  `;

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  const nameInp = modal.querySelector('.ns-prop-name-inp');
  const typeSelect = modal.querySelector('.ns-prop-type-select');

  setTimeout(() => nameInp.focus(), 50);

  const handleCreate = () => {
    const name = nameInp.value.trim();
    if (!name) return;
    const type = typeSelect.value;

    let options = [];
    if (type === 'status') {
      options = [
        { id: 's-1', label: 'Not Started', color: 'gray' },
        { id: 's-2', label: 'In Progress', color: 'blue' },
        { id: 's-3', label: 'Done', color: 'green' }
      ];
    } else if (type === 'select' || type === 'multi-select') {
      options = [
        { id: 'o-1', label: 'Option 1', color: 'blue' },
        { id: 'o-2', label: 'Option 2', color: 'green' },
        { id: 'o-3', label: 'Option 3', color: 'purple' }
      ];
    }

    onAdd({ name, type, options });
    backdrop.remove();
  };

  modal.querySelector('.ns-btn-confirm-prop').addEventListener('click', handleCreate);
  nameInp.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleCreate();
  });

  modal.querySelector('.ns-btn-cancel-prop').addEventListener('click', () => backdrop.remove());
  modal.querySelector('.ns-modal-close-btn').addEventListener('click', () => backdrop.remove());
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) backdrop.remove();
  });
}
