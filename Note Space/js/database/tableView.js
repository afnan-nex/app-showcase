/**
 * NoteSpace - Database Table View Renderer
 * Renders compact, interactive spreadsheet table with column headers, cell editors, and calculation footers.
 */

import { Icons, getIcon } from '../icons/icons.js';
import { createElement, escapeHTML } from '../utils/dom.js';

export function renderTableView(database, rows, onUpdateRow, onDeleteRow, onAddProperty, onOpenDetail) {
  const tableWrap = createElement('div', 'ns-db-table-wrapper');
  const properties = database.properties || [];

  const table = createElement('table', 'ns-db-table');

  // --- Table Header ---
  const thead = createElement('thead');
  const headerTr = createElement('tr');

  properties.forEach(prop => {
    const th = createElement('th', 'ns-db-th');
    if (prop.width) th.style.width = `${prop.width}px`;

    let iconName = 'propText';
    if (prop.type === 'title') iconName = 'propTitle';
    if (prop.type === 'status') iconName = 'propStatus';
    if (prop.type === 'select') iconName = 'propSelect';
    if (prop.type === 'multi-select') iconName = 'propMultiSelect';
    if (prop.type === 'date') iconName = 'propDate';
    if (prop.type === 'number') iconName = 'propNumber';
    if (prop.type === 'checkbox') iconName = 'propCheckbox';

    th.innerHTML = `
      <div class="ns-th-content">
        <span class="ns-th-icon">${getIcon(iconName)}</span>
        <span class="ns-th-name">${escapeHTML(prop.name)}</span>
      </div>
    `;
    headerTr.appendChild(th);
  });

  // Add column button in header
  const addPropTh = createElement('th', 'ns-db-th-add');
  addPropTh.innerHTML = `<button class="ns-btn-add-prop-th" title="Add property">${Icons.plus}</button>`;
  addPropTh.querySelector('button').addEventListener('click', onAddProperty);
  headerTr.appendChild(addPropTh);

  thead.appendChild(headerTr);
  table.appendChild(thead);

  // --- Table Body ---
  const tbody = createElement('tbody');

  rows.forEach(row => {
    const tr = createElement('tr', 'ns-db-row');
    tr.dataset.rowId = row.id;

    properties.forEach(prop => {
      const td = createElement('td', `ns-db-td ns-td-${prop.type}`);
      const val = row.properties[prop.id];

      renderCellContent(td, prop, val, row, onUpdateRow, onOpenDetail);
      tr.appendChild(td);
    });

    // Row action cell
    const actionTd = createElement('td', 'ns-db-td-action');
    actionTd.innerHTML = `
      <div class="ns-row-actions">
        <button class="ns-btn-row-open" title="Open as page">${Icons.maximize}</button>
        <button class="ns-btn-row-delete" title="Delete row">${Icons.trash}</button>
      </div>
    `;

    actionTd.querySelector('.ns-btn-row-open').addEventListener('click', () => onOpenDetail(row));
    actionTd.querySelector('.ns-btn-row-delete').addEventListener('click', () => onDeleteRow(row.id));

    tr.appendChild(actionTd);
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);

  // --- Table Footer (Calculations) ---
  const tfoot = createElement('tfoot');
  const footTr = createElement('tr', 'ns-db-footer-tr');

  properties.forEach((prop, idx) => {
    const td = createElement('td', 'ns-db-foot-td');
    if (idx === 0) {
      td.innerHTML = `<span class="ns-calc-label">Count ${rows.length}</span>`;
    } else if (prop.type === 'number') {
      const sum = rows.reduce((acc, r) => acc + (Number(r.properties[prop.id]) || 0), 0);
      td.innerHTML = `<span class="ns-calc-label">Sum: ${sum}</span>`;
    } else if (prop.type === 'checkbox') {
      const checkedCount = rows.filter(r => Boolean(r.properties[prop.id])).length;
      const pct = rows.length > 0 ? Math.round((checkedCount / rows.length) * 100) : 0;
      td.innerHTML = `<span class="ns-calc-label">${checkedCount}/${rows.length} (${pct}%)</span>`;
    } else {
      td.innerHTML = '';
    }
    footTr.appendChild(td);
  });

  footTr.appendChild(createElement('td', 'ns-db-foot-td'));
  tfoot.appendChild(footTr);
  table.appendChild(tfoot);

  tableWrap.appendChild(table);
  return tableWrap;
}

function renderCellContent(td, prop, val, row, onUpdateRow, onOpenDetail) {
  switch (prop.type) {
    case 'title': {
      td.innerHTML = `
        <div class="ns-cell-title-wrap">
          <span class="ns-cell-title-text" contenteditable="true">${escapeHTML(val || '')}</span>
          <button class="ns-btn-cell-expand" title="Open Page">${Icons.maximize}</button>
        </div>
      `;
      const titleText = td.querySelector('.ns-cell-title-text');
      const expandBtn = td.querySelector('.ns-btn-cell-expand');

      titleText.addEventListener('blur', () => {
        const newVal = titleText.innerText.trim();
        onUpdateRow(row.id, { [prop.id]: newVal || 'Untitled' });
      });

      expandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        onOpenDetail(row);
      });
      break;
    }

    case 'status': {
      const currentOpt = (prop.options || []).find(o => o.label === val) || { label: val || 'Not Started', color: 'gray' };
      td.innerHTML = `
        <button class="ns-status-badge ns-badge-${currentOpt.color || 'gray'}">
          ${escapeHTML(currentOpt.label)}
        </button>
      `;

      td.querySelector('button').addEventListener('click', (e) => {
        e.stopPropagation();
        showSelectOptionsPopover(td, prop.options || [], (chosen) => {
          onUpdateRow(row.id, { [prop.id]: chosen.label });
        });
      });
      break;
    }

    case 'select': {
      const currentOpt = (prop.options || []).find(o => o.label === val);
      if (currentOpt) {
        td.innerHTML = `<span class="ns-tag-badge ns-badge-${currentOpt.color}">${escapeHTML(currentOpt.label)}</span>`;
      } else {
        td.innerHTML = `<span class="ns-cell-placeholder">Empty</span>`;
      }

      td.addEventListener('click', (e) => {
        e.stopPropagation();
        showSelectOptionsPopover(td, prop.options || [], (chosen) => {
          onUpdateRow(row.id, { [prop.id]: chosen.label });
        });
      });
      break;
    }

    case 'multi-select': {
      const selected = Array.isArray(val) ? val : [];
      if (selected.length > 0) {
        td.innerHTML = `
          <div class="ns-multi-tags">
            ${selected.map(item => {
              const opt = (prop.options || []).find(o => o.label === item) || { color: 'blue' };
              return `<span class="ns-tag-badge ns-badge-${opt.color}">${escapeHTML(item)}</span>`;
            }).join('')}
          </div>
        `;
      } else {
        td.innerHTML = `<span class="ns-cell-placeholder">Empty</span>`;
      }

      td.addEventListener('click', (e) => {
        e.stopPropagation();
        showMultiSelectPopover(td, prop.options || [], selected, (newSelected) => {
          onUpdateRow(row.id, { [prop.id]: newSelected });
        });
      });
      break;
    }

    case 'date': {
      td.innerHTML = val ? `<span class="ns-date-cell">${escapeHTML(val)}</span>` : `<span class="ns-cell-placeholder">Empty</span>`;
      td.addEventListener('click', (e) => {
        e.stopPropagation();
        showDateInputPopover(td, val, (newDate) => {
          onUpdateRow(row.id, { [prop.id]: newDate });
        });
      });
      break;
    }

    case 'number': {
      td.innerHTML = `<span class="ns-cell-editable" contenteditable="true">${val !== undefined && val !== null ? val : ''}</span>`;
      const numSpan = td.querySelector('.ns-cell-editable');
      numSpan.addEventListener('blur', () => {
        const num = parseFloat(numSpan.innerText.trim());
        onUpdateRow(row.id, { [prop.id]: isNaN(num) ? 0 : num });
      });
      break;
    }

    case 'checkbox': {
      const isChecked = Boolean(val);
      td.innerHTML = `<input type="checkbox" class="ns-db-checkbox" ${isChecked ? 'checked' : ''} />`;
      td.querySelector('input').addEventListener('change', (e) => {
        onUpdateRow(row.id, { [prop.id]: e.target.checked });
      });
      break;
    }

    case 'text':
    default: {
      td.innerHTML = `<span class="ns-cell-editable" contenteditable="true">${escapeHTML(val || '')}</span>`;
      const span = td.querySelector('.ns-cell-editable');
      span.addEventListener('blur', () => {
        onUpdateRow(row.id, { [prop.id]: span.innerText.trim() });
      });
      break;
    }
  }
}

function showSelectOptionsPopover(targetEl, options, onSelect) {
  document.querySelectorAll('.ns-cell-popover').forEach(p => p.remove());

  const popover = createElement('div', 'ns-cell-popover');
  popover.innerHTML = `
    <div class="ns-popover-title">Select Option</div>
    <div class="ns-popover-list">
      ${options.map(opt => `
        <button class="ns-popover-item" data-id="${opt.id}">
          <span class="ns-tag-badge ns-badge-${opt.color}">${escapeHTML(opt.label)}</span>
        </button>
      `).join('')}
    </div>
  `;

  document.body.appendChild(popover);
  const rect = targetEl.getBoundingClientRect();
  popover.style.top = `${rect.bottom + window.scrollY + 4}px`;
  popover.style.left = `${rect.left + window.scrollX}px`;

  popover.querySelectorAll('.ns-popover-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const opt = options.find(o => o.id === btn.dataset.id);
      if (opt) onSelect(opt);
      popover.remove();
    });
  });

  const closeHandler = (e) => {
    if (!popover.contains(e.target) && !targetEl.contains(e.target)) {
      popover.remove();
      document.removeEventListener('click', closeHandler);
    }
  };
  setTimeout(() => document.addEventListener('click', closeHandler), 10);
}

function showMultiSelectPopover(targetEl, options, currentSelected, onChange) {
  document.querySelectorAll('.ns-cell-popover').forEach(p => p.remove());

  const popover = createElement('div', 'ns-cell-popover');
  const selectedSet = new Set(currentSelected);

  popover.innerHTML = `
    <div class="ns-popover-title">Toggle Tags</div>
    <div class="ns-popover-list">
      ${options.map(opt => `
        <button class="ns-popover-multi-item ${selectedSet.has(opt.label) ? 'is-selected' : ''}" data-label="${escapeHTML(opt.label)}">
          <span class="ns-tag-badge ns-badge-${opt.color}">${escapeHTML(opt.label)}</span>
          <span class="ns-multi-check">${selectedSet.has(opt.label) ? '✓' : ''}</span>
        </button>
      `).join('')}
    </div>
  `;

  document.body.appendChild(popover);
  const rect = targetEl.getBoundingClientRect();
  popover.style.top = `${rect.bottom + window.scrollY + 4}px`;
  popover.style.left = `${rect.left + window.scrollX}px`;

  popover.querySelectorAll('.ns-popover-multi-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const label = btn.dataset.label;
      if (selectedSet.has(label)) {
        selectedSet.delete(label);
        btn.classList.remove('is-selected');
        btn.querySelector('.ns-multi-check').innerText = '';
      } else {
        selectedSet.add(label);
        btn.classList.add('is-selected');
        btn.querySelector('.ns-multi-check').innerText = '✓';
      }
      onChange(Array.from(selectedSet));
    });
  });

  const closeHandler = (e) => {
    if (!popover.contains(e.target) && !targetEl.contains(e.target)) {
      popover.remove();
      document.removeEventListener('click', closeHandler);
    }
  };
  setTimeout(() => document.addEventListener('click', closeHandler), 10);
}

function showDateInputPopover(targetEl, currentDate, onSelect) {
  document.querySelectorAll('.ns-cell-popover').forEach(p => p.remove());

  const popover = createElement('div', 'ns-cell-popover');
  popover.innerHTML = `
    <div class="ns-popover-title">Pick Date</div>
    <input type="date" class="ns-input ns-date-picker-inp" value="${currentDate || ''}" />
    <div class="ns-popover-actions">
      <button class="ns-btn-sm ns-btn-clear-date">Clear</button>
      <button class="ns-btn-sm ns-btn-primary ns-btn-save-date">Save</button>
    </div>
  `;

  document.body.appendChild(popover);
  const rect = targetEl.getBoundingClientRect();
  popover.style.top = `${rect.bottom + window.scrollY + 4}px`;
  popover.style.left = `${rect.left + window.scrollX}px`;

  const dateInp = popover.querySelector('.ns-date-picker-inp');
  popover.querySelector('.ns-btn-save-date').addEventListener('click', () => {
    onSelect(dateInp.value);
    popover.remove();
  });

  popover.querySelector('.ns-btn-clear-date').addEventListener('click', () => {
    onSelect('');
    popover.remove();
  });

  const closeHandler = (e) => {
    if (!popover.contains(e.target) && !targetEl.contains(e.target)) {
      popover.remove();
      document.removeEventListener('click', closeHandler);
    }
  };
  setTimeout(() => document.addEventListener('click', closeHandler), 10);
}
