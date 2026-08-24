/**
 * NoteSpace - Database List View Renderer
 * Renders sleek, uncluttered horizontal rows with badge metadata.
 */

import { Icons, getIcon } from '../icons/icons.js';
import { createElement, escapeHTML } from '../utils/dom.js';

export function renderListView(database, rows, onUpdateRow, onAddRow, onOpenDetail) {
  const listWrap = createElement('div', 'ns-db-list-wrapper');

  const itemsContainer = createElement('div', 'ns-list-items');

  const titleProp = database.properties.find(p => p.type === 'title');
  const statusProp = database.properties.find(p => p.type === 'status');
  const dateProp = database.properties.find(p => p.type === 'date');
  const tagsProp = database.properties.find(p => p.type === 'multi-select');

  rows.forEach(row => {
    const itemEl = createElement('div', 'ns-list-row-item');
    itemEl.dataset.rowId = row.id;

    const title = (titleProp && row.properties[titleProp.id]) || 'Untitled';
    const statusVal = (statusProp && row.properties[statusProp.id]) || '';
    const dateVal = (dateProp && row.properties[dateProp.id]) || '';
    const tags = (tagsProp && row.properties[tagsProp.id]) || [];

    const statusOpt = statusProp && (statusProp.options || []).find(o => o.label === statusVal);

    itemEl.innerHTML = `
      <div class="ns-list-left">
        <span class="ns-list-doc-icon">${Icons.fileText}</span>
        <span class="ns-list-title">${escapeHTML(title)}</span>
      </div>
      <div class="ns-list-right">
        ${tags.length > 0 ? `
          <div class="ns-list-tags">
            ${tags.map(t => `<span class="ns-tag-badge ns-badge-blue">${escapeHTML(t)}</span>`).join('')}
          </div>
        ` : ''}
        ${statusVal ? `
          <span class="ns-status-badge ns-badge-${statusOpt ? statusOpt.color : 'gray'}">${escapeHTML(statusVal)}</span>
        ` : ''}
        ${dateVal ? `
          <span class="ns-list-date">${escapeHTML(dateVal)}</span>
        ` : ''}
        <button class="ns-btn-list-open" title="Open">${Icons.maximize}</button>
      </div>
    `;

    itemEl.addEventListener('click', () => onOpenDetail(row));
    itemsContainer.appendChild(itemEl);
  });

  // Quick Add Row button
  const addRowBtn = createElement('button', 'ns-list-add-btn');
  addRowBtn.innerHTML = `${Icons.plus} New page`;
  addRowBtn.addEventListener('click', () => onAddRow());

  listWrap.appendChild(itemsContainer);
  listWrap.appendChild(addRowBtn);

  return listWrap;
}
