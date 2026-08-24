/**
 * NoteSpace - Database Board (Kanban) View Renderer
 * Renders agile Kanban board columns with drag-and-drop cards across statuses and quick card creation.
 */

import { Icons, getIcon } from '../icons/icons.js';
import { createElement, escapeHTML } from '../utils/dom.js';

export function renderBoardView(database, rows, onUpdateRow, onAddRowToGroup, onOpenDetail) {
  const boardWrap = createElement('div', 'ns-db-board-wrapper');

  // Find grouping property (default to status or first select)
  let groupProp = database.properties.find(p => p.type === 'status');
  if (!groupProp) {
    groupProp = database.properties.find(p => p.type === 'select');
  }

  if (!groupProp) {
    boardWrap.innerHTML = `<div class="ns-board-empty">Please add a "Status" or "Select" property to use Board View.</div>`;
    return boardWrap;
  }

  const options = groupProp.options || [
    { id: 'opt-1', label: 'To Do', color: 'gray' },
    { id: 'opt-2', label: 'In Progress', color: 'blue' },
    { id: 'opt-3', label: 'Done', color: 'green' }
  ];

  const columnsContainer = createElement('div', 'ns-board-columns');

  options.forEach(opt => {
    const colRows = rows.filter(r => (r.properties[groupProp.id] || 'Not Started') === opt.label);

    const colEl = createElement('div', 'ns-board-column');
    colEl.dataset.groupValue = opt.label;

    // Header
    const header = createElement('div', 'ns-board-col-header');
    header.innerHTML = `
      <div class="ns-board-col-title">
        <span class="ns-status-badge ns-badge-${opt.color || 'gray'}">${escapeHTML(opt.label)}</span>
        <span class="ns-board-col-count">${colRows.length}</span>
      </div>
      <button class="ns-btn-add-card-col" title="Add item to ${escapeHTML(opt.label)}">
        ${Icons.plus}
      </button>
    `;

    header.querySelector('.ns-btn-add-card-col').addEventListener('click', () => {
      onAddRowToGroup({ [groupProp.id]: opt.label });
    });

    colEl.appendChild(header);

    // Cards list container
    const cardsList = createElement('div', 'ns-board-cards-list');
    cardsList.dataset.groupValue = opt.label;

    colRows.forEach(row => {
      const card = createBoardCard(row, database, onOpenDetail);
      cardsList.appendChild(card);
    });

    colEl.appendChild(cardsList);
    columnsContainer.appendChild(colEl);

    // Bind Drag and drop listeners for column
    setupColumnDropZone(cardsList, groupProp, onUpdateRow);
  });

  boardWrap.appendChild(columnsContainer);
  return boardWrap;
}

function createBoardCard(row, database, onOpenDetail) {
  const card = createElement('div', 'ns-board-card');
  card.setAttribute('draggable', 'true');
  card.dataset.rowId = row.id;

  const titleProp = database.properties.find(p => p.type === 'title');
  const title = (titleProp && row.properties[titleProp.id]) || 'Untitled';

  const tagsProp = database.properties.find(p => p.type === 'multi-select');
  const tags = (tagsProp && row.properties[tagsProp.id]) || [];

  const dateProp = database.properties.find(p => p.type === 'date');
  const dateVal = (dateProp && row.properties[dateProp.id]) || '';

  const priorityProp = database.properties.find(p => p.name.toLowerCase().includes('priority'));
  const priorityVal = (priorityProp && row.properties[priorityProp.id]) || '';

  card.innerHTML = `
    <div class="ns-card-header">
      <div class="ns-card-title">${escapeHTML(title)}</div>
    </div>
    ${tags.length > 0 ? `
      <div class="ns-card-tags">
        ${tags.map(t => `<span class="ns-tag-badge ns-badge-blue">${escapeHTML(t)}</span>`).join('')}
      </div>
    ` : ''}
    <div class="ns-card-meta">
      ${priorityVal ? `<span class="ns-card-priority">${escapeHTML(priorityVal)}</span>` : ''}
      ${dateVal ? `<span class="ns-card-date">${Icons.clock} ${escapeHTML(dateVal)}</span>` : ''}
    </div>
  `;

  card.addEventListener('click', (e) => {
    onOpenDetail(row);
  });

  card.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', row.id);
    card.classList.add('is-dragging-card');
  });

  card.addEventListener('dragend', () => {
    card.classList.remove('is-dragging-card');
  });

  return card;
}

function setupColumnDropZone(dropZone, groupProp, onUpdateRow) {
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('is-drag-over');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('is-drag-over');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('is-drag-over');
    const rowId = e.dataTransfer.getData('text/plain');
    const newGroupValue = dropZone.dataset.groupValue;

    if (rowId && newGroupValue) {
      onUpdateRow(rowId, { [groupProp.id]: newGroupValue });
    }
  });
}
