/**
 * NoteSpace - Database Engine (Production Polish)
 * Multi-view reactive databases: Table Grid, Kanban Board, and List views
 * with dynamic filtering, sorting, grouping, CSV export, and tag management.
 */
class DatabaseEngine {
  constructor() {
    this.container = null;
    this.database = null;
    this.activeFilter = null; // { propId, operator, value }
    this.activeSort = null; // { propId, direction: 'asc' | 'desc' }
    this.searchQuery = '';
    this.draggedRowId = null;
    this.colorPalette = ['gray', 'blue', 'green', 'emerald', 'amber', 'red', 'purple', 'pink'];
  }

  mount(container, database) {
    this.container = container;
    this.database = JSON.parse(JSON.stringify(database));
    this.render();
  }

  setDatabase(database) {
    this.database = JSON.parse(JSON.stringify(database));
    this.render();
  }

  getFilteredAndSortedRows() {
    if (!this.database || !this.database.rows) return [];
    let rows = [...this.database.rows];

    // Search query within DB
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      rows = rows.filter(r => {
        const title = (r.values?.prop_title || '').toLowerCase();
        return title.includes(q) || Object.values(r.values || {}).some(v => String(v).toLowerCase().includes(q));
      });
    }

    // Filter
    if (this.activeFilter && this.activeFilter.propId) {
      const { propId, operator, value } = this.activeFilter;
      const prop = this.database.properties.find(p => p.id === propId);
      const valStr = String(value || '').toLowerCase().trim();

      rows = rows.filter(r => {
        const cellVal = r.values?.[propId];

        if (operator === 'is_empty') return cellVal === undefined || cellVal === null || cellVal === '' || (Array.isArray(cellVal) && cellVal.length === 0);
        if (operator === 'is_not_empty') return cellVal !== undefined && cellVal !== null && cellVal !== '' && (!Array.isArray(cellVal) || cellVal.length > 0);
        if (operator === 'is_true') return !!cellVal;
        if (operator === 'is_false') return !cellVal;

        let matchValues = [];
        if (prop && (prop.type === 'status' || prop.type === 'select')) {
          const opt = prop.options?.find(o => o.id === cellVal);
          matchValues = [String(cellVal || '').toLowerCase(), opt ? opt.label.toLowerCase() : ''];
        } else if (prop && prop.type === 'multi-select' && Array.isArray(cellVal)) {
          const labels = cellVal.map(id => prop.options?.find(o => o.id === id)?.label.toLowerCase() || '');
          matchValues = [...cellVal.map(String).map(s => s.toLowerCase()), ...labels];
        } else {
          matchValues = [String(cellVal ?? '').toLowerCase()];
        }

        if (operator === 'equals') {
          return matchValues.some(m => m === valStr);
        }
        if (operator === 'contains') {
          return matchValues.some(m => m.includes(valStr));
        }
        return true;
      });
    }

    // Sort
    if (this.activeSort && this.activeSort.propId) {
      const { propId, direction } = this.activeSort;
      rows.sort((a, b) => {
        const valA = a.values?.[propId] ?? '';
        const valB = b.values?.[propId] ?? '';
        const res = typeof valA === 'number' && typeof valB === 'number' ? valA - valB : String(valA).localeCompare(String(valB));
        return direction === 'asc' ? res : -res;
      });
    } else {
      rows.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    return rows;
  }

  render() {
    if (!this.container || !this.database) return;
    this.container.innerHTML = '';

    const isLocked = State.activePage && State.activePage.isLocked;

    const dbWrap = document.createElement('div');
    dbWrap.className = 'database-wrapper';

    // 1. Database Header & Controls Toolbar
    const toolbar = this.renderToolbar(isLocked);
    dbWrap.appendChild(toolbar);

    // 2. View Content (Table, Board, List)
    const viewContainer = document.createElement('div');
    viewContainer.className = 'database-view-area';

    switch (this.database.viewType) {
      case 'board':
        this.renderBoardView(viewContainer, isLocked);
        break;
      case 'list':
        this.renderListView(viewContainer, isLocked);
        break;
      case 'table':
      default:
        this.renderTableView(viewContainer, isLocked);
        break;
    }

    dbWrap.appendChild(viewContainer);
    this.container.appendChild(dbWrap);
  }

  // --- Toolbar & Views Tabs ---

  renderToolbar(isLocked) {
    const toolbar = document.createElement('div');
    toolbar.className = 'database-toolbar';

    // View Switcher Tabs
    const viewTabs = document.createElement('div');
    viewTabs.className = 'db-view-tabs';

    const views = [
      { id: 'board', name: 'Board', icon: 'boardView' },
      { id: 'table', name: 'Table', icon: 'tableView' },
      { id: 'list', name: 'List', icon: 'listView' }
    ];

    views.forEach(v => {
      const btn = document.createElement('button');
      btn.className = `db-view-tab ${this.database.viewType === v.id ? 'is-active' : ''}`;
      btn.innerHTML = `${Icons.get(v.icon, 'icon-xs', 14)} <span>${v.name}</span>`;
      btn.setAttribute('aria-label', `Switch to ${v.name} view`);
      btn.addEventListener('click', () => {
        this.database.viewType = v.id;
        this.render();
        this.notifyChange();
      });
      viewTabs.appendChild(btn);
    });

    toolbar.appendChild(viewTabs);

    // Actions & Tools (Filter, Sort, Search, Export CSV, New Row)
    const tools = document.createElement('div');
    tools.className = 'db-tools-right';

    // Search input
    const searchBox = document.createElement('div');
    searchBox.className = 'db-search-input-wrap';
    searchBox.innerHTML = `
      ${Icons.get('search', 'icon-xs', 13)}
      <input type="text" class="db-search-field" placeholder="Filter..." value="${this.searchQuery}" aria-label="Search within database" />
    `;
    const searchField = searchBox.querySelector('.db-search-field');
    searchField.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      const viewArea = this.container.querySelector('.database-view-area');
      if (viewArea) {
        viewArea.innerHTML = '';
        if (this.database.viewType === 'board') this.renderBoardView(viewArea, isLocked);
        else if (this.database.viewType === 'list') this.renderListView(viewArea, isLocked);
        else this.renderTableView(viewArea, isLocked);
      }
    });
    tools.appendChild(searchBox);

    // Filter Popover Trigger
    const filterBtn = document.createElement('button');
    filterBtn.className = `db-tool-btn ${this.activeFilter ? 'has-active' : ''}`;
    filterBtn.innerHTML = `${Icons.get('filter', 'icon-xs', 13)} <span>Filter${this.activeFilter ? ' (1)' : ''}</span>`;
    filterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.openFilterMenu(e);
    });
    tools.appendChild(filterBtn);

    // Sort Popover Trigger
    const sortBtn = document.createElement('button');
    sortBtn.className = `db-tool-btn ${this.activeSort ? 'has-active' : ''}`;
    sortBtn.innerHTML = `${Icons.get('sort', 'icon-xs', 13)} <span>Sort${this.activeSort ? ' (1)' : ''}</span>`;
    sortBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.openSortMenu(e);
    });
    tools.appendChild(sortBtn);

    // Export CSV Button
    const csvBtn = document.createElement('button');
    csvBtn.className = 'db-tool-btn';
    csvBtn.title = 'Export database as CSV';
    csvBtn.innerHTML = `${Icons.get('download', 'icon-xs', 13)} <span>CSV</span>`;
    csvBtn.addEventListener('click', () => this.exportCSV());
    tools.appendChild(csvBtn);

    // New Row / Card Button
    if (!isLocked) {
      const newBtn = document.createElement('button');
      newBtn.className = 'btn-sm btn-primary db-new-btn';
      newBtn.innerHTML = `${Icons.get('plus', 'icon-xs', 13)} <span>New</span>`;
      newBtn.addEventListener('click', () => {
        this.addNewRow();
      });
      tools.appendChild(newBtn);
    }

    toolbar.appendChild(tools);
    return toolbar;
  }

  // --- Table View ---

  renderTableView(container, isLocked) {
    const rows = this.getFilteredAndSortedRows();
    const props = this.database.properties || [];

    const tableWrap = document.createElement('div');
    tableWrap.className = 'db-table-scroll-container';

    const table = document.createElement('table');
    table.className = 'db-main-table';

    // THEAD
    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');

    props.forEach(prop => {
      const th = document.createElement('th');
      th.className = 'db-th';
      th.innerHTML = `
        <div class="th-inner">
          <span class="th-type-icon">${this.getPropertyTypeIcon(prop.type)}</span>
          <span class="th-title">${prop.name}</span>
          ${!isLocked ? `<button class="th-menu-btn" title="Property Settings">${Icons.get('chevronDown', 'icon-xs', 11)}</button>` : ''}
        </div>
      `;

      if (!isLocked) {
        const thBtn = th.querySelector('.th-menu-btn');
        if (thBtn) {
          thBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openPropertyMenu(e, prop);
          });
        }
      }

      trHead.appendChild(th);
    });

    // Add Column Header Button
    if (!isLocked) {
      const thAdd = document.createElement('th');
      thAdd.className = 'db-th db-th-add';
      const addPropBtn = document.createElement('button');
      addPropBtn.className = 'db-add-prop-btn';
      addPropBtn.innerHTML = `${Icons.get('plus', 'icon-xs', 14)}`;
      addPropBtn.title = 'Add property';
      addPropBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openAddPropertyModal(e);
      });
      thAdd.appendChild(addPropBtn);
      trHead.appendChild(thAdd);
    }

    thead.appendChild(trHead);
    table.appendChild(thead);

    // TBODY
    const tbody = document.createElement('tbody');
    rows.forEach(row => {
      const tr = document.createElement('tr');
      tr.className = 'db-row';
      tr.dataset.rowId = row.id;

      props.forEach(prop => {
        const td = document.createElement('td');
        td.className = `db-td td-${prop.type}`;
        this.renderCell(td, row, prop, isLocked);
        tr.appendChild(td);
      });

      if (!isLocked) {
        const tdDelete = document.createElement('td');
        tdDelete.className = 'db-td td-action';
        const delBtn = document.createElement('button');
        delBtn.className = 'row-del-btn';
        delBtn.title = 'Delete Row';
        delBtn.innerHTML = Icons.get('trash', 'icon-xs', 12);
        delBtn.addEventListener('click', () => {
          this.deleteRow(row.id);
        });
        tdDelete.appendChild(delBtn);
        tr.appendChild(tdDelete);
      }

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    tableWrap.appendChild(table);

    // Bottom + New Row button
    if (!isLocked) {
      const bottomAdd = document.createElement('button');
      bottomAdd.className = 'db-table-bottom-add';
      bottomAdd.innerHTML = `${Icons.get('plus', 'icon-xs', 14)} <span>New</span>`;
      bottomAdd.addEventListener('click', () => this.addNewRow());
      tableWrap.appendChild(bottomAdd);
    }

    container.appendChild(tableWrap);
  }

  // --- Board / Kanban View ---

  renderBoardView(container, isLocked) {
    const rows = this.getFilteredAndSortedRows();
    const groupByPropId = this.database.groupBy || 'prop_status';
    const groupProp = this.database.properties.find(p => p.id === groupByPropId) || this.database.properties.find(p => p.type === 'status' || p.type === 'select');

    if (!groupProp) {
      container.innerHTML = '<div class="empty-state">Please add a Select or Status property to group board columns.</div>';
      return;
    }

    const boardWrap = document.createElement('div');
    boardWrap.className = 'db-board-container';

    const options = groupProp.options || [{ id: 'opt_default', label: 'Items', color: 'gray' }];

    options.forEach(opt => {
      const colRows = rows.filter(r => (r.values?.[groupProp.id] === opt.id) || (!r.values?.[groupProp.id] && opt.id === options[0].id));

      const col = document.createElement('div');
      col.className = 'board-column';
      col.dataset.columnId = opt.id;

      // Column Header
      const header = document.createElement('div');
      header.className = 'board-col-header';
      header.innerHTML = `
        <div class="col-title-wrap">
          <span class="badge badge-${opt.color || 'gray'}">${opt.label}</span>
          <span class="col-count">${colRows.length}</span>
        </div>
        ${!isLocked ? `<button class="col-add-btn" title="Add Card">${Icons.get('plus', 'icon-xs', 13)}</button>` : ''}
      `;

      if (!isLocked) {
        header.querySelector('.col-add-btn')?.addEventListener('click', () => {
          this.addNewRow({ [groupProp.id]: opt.id });
        });
      }

      col.appendChild(header);

      // Column Cards Container
      const cardsList = document.createElement('div');
      cardsList.className = 'board-cards-list';

      // Drag and drop into column
      if (!isLocked) {
        cardsList.addEventListener('dragover', (e) => {
          e.preventDefault();
          cardsList.classList.add('is-drag-target');
        });

        cardsList.addEventListener('dragleave', () => {
          cardsList.classList.remove('is-drag-target');
        });

        cardsList.addEventListener('drop', (e) => {
          e.preventDefault();
          cardsList.classList.remove('is-drag-target');
          if (this.draggedRowId) {
            const row = this.database.rows.find(r => r.id === this.draggedRowId);
            if (row) {
              row.values[groupProp.id] = opt.id;
              this.render();
              this.notifyChange();
            }
          }
        });
      }

      colRows.forEach(row => {
        const card = document.createElement('div');
        card.className = 'board-card';
        card.dataset.rowId = row.id;

        if (!isLocked) {
          card.draggable = true;
          card.addEventListener('dragstart', (e) => {
            this.draggedRowId = row.id;
            card.classList.add('is-dragging');
            e.dataTransfer.setData('text/plain', row.id);
          });
          card.addEventListener('dragend', () => {
            card.classList.remove('is-dragging');
          });
        }

        // Card Content
        const title = row.values?.prop_title || 'Untitled';
        
        const titleEl = document.createElement('div');
        titleEl.className = 'card-title';
        titleEl.contentEditable = !isLocked;
        titleEl.innerText = title;
        titleEl.addEventListener('input', () => {
          row.values.prop_title = titleEl.innerText;
          this.notifyChange();
        });
        titleEl.addEventListener('click', (e) => e.stopPropagation());

        const propsRow = document.createElement('div');
        propsRow.className = 'card-props-row';

        card.appendChild(titleEl);
        card.appendChild(propsRow);
        
        // Render interactive badges on card
        this.database.properties.forEach(p => {
          if (p.id === groupProp.id || p.type === 'title') return;
          const val = row.values?.[p.id];
          if (val === undefined || val === null || val === '') return;

          if (p.type === 'checkbox') {
            const checkPill = document.createElement('button');
            checkPill.className = `card-pill ${val ? 'pill-done' : ''}`;
            checkPill.disabled = isLocked;
            checkPill.innerHTML = val ? '✓ Done' : '○ Incomplete';
            checkPill.addEventListener('click', (e) => {
              e.stopPropagation();
              row.values[p.id] = !row.values[p.id];
              this.render();
              this.notifyChange();
            });
            propsRow.appendChild(checkPill);
          } else if (p.type === 'multi-select' && Array.isArray(val)) {
            const wrap = document.createElement('div');
            wrap.className = 'cell-multi-select-wrap';
            val.forEach(tagId => {
              const tagOpt = p.options?.find(o => o.id === tagId);
              if (tagOpt) {
                const pill = document.createElement('span');
                pill.className = `badge badge-${tagOpt.color || 'gray'}`;
                pill.textContent = tagOpt.label;
                wrap.appendChild(pill);
              }
            });
            if (!isLocked) {
              wrap.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openMultiSelectPicker(e, row, p);
              });
            }
            propsRow.appendChild(wrap);
          } else if (p.type === 'select' || p.type === 'status') {
            const selectOpt = p.options?.find(o => o.id === val);
            const pill = document.createElement('button');
            pill.className = `badge badge-${selectOpt?.color || 'gray'}`;
            pill.textContent = selectOpt?.label || 'Select...';
            pill.disabled = isLocked;
            pill.addEventListener('click', (e) => {
              e.stopPropagation();
              this.openSelectPicker(e, row, p);
            });
            propsRow.appendChild(pill);
          } else if (p.type === 'date') {
            const pill = document.createElement('span');
            pill.className = 'card-pill-date';
            pill.innerHTML = `${Icons.get('calendar', 'icon-xs', 11)} ${val}`;
            propsRow.appendChild(pill);
          } else if (p.type === 'number') {
            const pill = document.createElement('span');
            pill.className = 'card-pill-number';
            pill.innerHTML = `Pts: ${val}`;
            propsRow.appendChild(pill);
          }
        });

        cardsList.appendChild(card);
      });

      // Add Card Footer
      if (!isLocked) {
        const addCardFooter = document.createElement('button');
        addCardFooter.className = 'board-col-add-bottom';
        addCardFooter.innerHTML = `${Icons.get('plus', 'icon-xs', 13)} <span>New card</span>`;
        addCardFooter.addEventListener('click', () => {
          this.addNewRow({ [groupProp.id]: opt.id });
        });
        col.appendChild(cardsList);
        col.appendChild(addCardFooter);
      } else {
        col.appendChild(cardsList);
      }

      boardWrap.appendChild(col);
    });

    container.appendChild(boardWrap);
  }

  // --- List View ---

  renderListView(container, isLocked) {
    const rows = this.getFilteredAndSortedRows();
    const props = this.database.properties || [];

    const listWrap = document.createElement('div');
    listWrap.className = 'db-list-container';

    rows.forEach(row => {
      const item = document.createElement('div');
      item.className = 'db-list-item';
      item.dataset.rowId = row.id;

      // Left: Checkbox or Icon + Title
      const left = document.createElement('div');
      left.className = 'list-item-left';

      const checkProp = props.find(p => p.type === 'checkbox');
      if (checkProp) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'list-item-checkbox';
        checkbox.checked = !!row.values?.[checkProp.id];
        checkbox.disabled = isLocked;
        checkbox.addEventListener('change', () => {
          row.values[checkProp.id] = checkbox.checked;
          this.notifyChange();
        });
        left.appendChild(checkbox);
      } else {
        const dot = document.createElement('span');
        dot.className = 'list-item-bullet';
        dot.textContent = '•';
        left.appendChild(dot);
      }

      const titleInput = document.createElement('div');
      titleInput.className = 'list-item-title-editable';
      titleInput.contentEditable = !isLocked;
      titleInput.innerHTML = row.values?.prop_title || 'Untitled';
      titleInput.addEventListener('input', () => {
        row.values.prop_title = titleInput.innerText;
        this.notifyChange();
      });

      left.appendChild(titleInput);
      item.appendChild(left);

      // Right: Badges & Details
      const right = document.createElement('div');
      right.className = 'list-item-right';

      props.forEach(p => {
        if (p.type === 'title' || p.type === 'checkbox') return;
        const val = row.values?.[p.id];
        if (!val) return;

        if (p.type === 'status' || p.type === 'select') {
          const opt = p.options?.find(o => o.id === val);
          const badge = document.createElement('button');
          badge.className = `badge badge-${opt?.color || 'gray'}`;
          badge.textContent = opt?.label || 'Select...';
          badge.disabled = isLocked;
          badge.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openSelectPicker(e, row, p);
          });
          right.appendChild(badge);
        } else if (p.type === 'multi-select' && Array.isArray(val)) {
          const wrap = document.createElement('div');
          wrap.className = 'cell-multi-select-wrap';
          val.forEach(tagId => {
            const tagOpt = p.options?.find(o => o.id === tagId);
            if (tagOpt) {
              const pill = document.createElement('span');
              pill.className = `badge badge-${tagOpt.color || 'gray'}`;
              pill.textContent = tagOpt.label;
              wrap.appendChild(pill);
            }
          });
          if (!isLocked) {
            wrap.addEventListener('click', (e) => {
              e.stopPropagation();
              this.openMultiSelectPicker(e, row, p);
            });
          }
          right.appendChild(wrap);
        } else if (p.type === 'date') {
          const dt = document.createElement('span');
          dt.className = 'list-date-badge';
          dt.innerHTML = `${Icons.get('calendar', 'icon-xs', 11)} ${val}`;
          right.appendChild(dt);
        }
      });

      if (!isLocked) {
        const delBtn = document.createElement('button');
        delBtn.className = 'list-item-del-btn';
        delBtn.innerHTML = Icons.get('trash', 'icon-xs', 12);
        delBtn.addEventListener('click', () => {
          this.deleteRow(row.id);
        });
        right.appendChild(delBtn);
      }

      item.appendChild(right);
      listWrap.appendChild(item);
    });

    if (!isLocked) {
      const addBtn = document.createElement('button');
      addBtn.className = 'db-list-add-btn';
      addBtn.innerHTML = `${Icons.get('plus', 'icon-xs', 13)} <span>New item</span>`;
      addBtn.addEventListener('click', () => this.addNewRow());
      listWrap.appendChild(addBtn);
    }

    container.appendChild(listWrap);
  }

  // --- Cell Rendering ---

  renderCell(td, row, prop, isLocked) {
    const val = row.values?.[prop.id];

    switch (prop.type) {
      case 'title': {
        const text = document.createElement('div');
        text.className = 'cell-editable cell-title-text';
        text.contentEditable = !isLocked;
        text.innerHTML = val || '';
        text.dataset.placeholder = 'Untitled';
        text.addEventListener('input', () => {
          row.values[prop.id] = text.innerText;
          this.notifyChange();
        });
        td.appendChild(text);
        break;
      }

      case 'status':
      case 'select': {
        const opt = prop.options?.find(o => o.id === val) || prop.options?.[0];
        const badge = document.createElement('button');
        badge.className = `cell-select-badge badge badge-${opt?.color || 'gray'}`;
        badge.disabled = isLocked;
        badge.textContent = opt?.label || 'Select...';

        badge.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openSelectPicker(e, row, prop);
        });

        td.appendChild(badge);
        break;
      }

      case 'multi-select': {
        const wrap = document.createElement('div');
        wrap.className = 'cell-multi-select-wrap';
        const selectedIds = Array.isArray(val) ? val : [];

        selectedIds.forEach(tagId => {
          const opt = prop.options?.find(o => o.id === tagId);
          if (opt) {
            const pill = document.createElement('span');
            pill.className = `badge badge-${opt.color || 'gray'}`;
            pill.textContent = opt.label;
            wrap.appendChild(pill);
          }
        });

        if (selectedIds.length === 0) {
          wrap.innerHTML = '<span class="empty-cell-label">Empty</span>';
        }

        if (!isLocked) {
          wrap.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openMultiSelectPicker(e, row, prop);
          });
        }

        td.appendChild(wrap);
        break;
      }

      case 'date': {
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.className = 'cell-date-input';
        dateInput.disabled = isLocked;
        dateInput.value = val || '';
        dateInput.addEventListener('change', () => {
          row.values[prop.id] = dateInput.value;
          this.notifyChange();
        });
        td.appendChild(dateInput);
        break;
      }

      case 'number': {
        const numInput = document.createElement('input');
        numInput.type = 'number';
        numInput.className = 'cell-number-input';
        numInput.disabled = isLocked;
        numInput.value = val !== undefined ? val : '';
        numInput.addEventListener('input', () => {
          row.values[prop.id] = numInput.value === '' ? '' : Number(numInput.value);
          this.notifyChange();
        });
        td.appendChild(numInput);
        break;
      }

      case 'checkbox': {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'cell-checkbox-input';
        checkbox.disabled = isLocked;
        checkbox.checked = !!val;
        checkbox.addEventListener('change', () => {
          row.values[prop.id] = checkbox.checked;
          this.notifyChange();
        });
        td.appendChild(checkbox);
        break;
      }

      case 'text':
      default: {
        const text = document.createElement('div');
        text.className = 'cell-editable';
        text.contentEditable = !isLocked;
        text.innerHTML = val || '';
        text.dataset.placeholder = 'Empty';
        text.addEventListener('input', () => {
          row.values[prop.id] = text.innerText;
          this.notifyChange();
        });
        td.appendChild(text);
        break;
      }
    }
  }

  // --- Popovers & Pickers ---

  openSelectPicker(e, row, prop) {
    const popover = document.createElement('div');
    popover.className = 'db-picker-popover';

    const renderOpts = () => {
      let html = `<div class="popover-title">${prop.name}</div><div class="popover-list">`;
      (prop.options || []).forEach(opt => {
        const isSelected = row.values?.[prop.id] === opt.id;
        html += `
          <button class="picker-opt-btn ${isSelected ? 'is-selected' : ''}" data-opt-id="${opt.id}">
            <span class="badge badge-${opt.color || 'gray'}">${opt.label}</span>
            ${isSelected ? Icons.get('check', 'icon-xs', 12) : ''}
          </button>
        `;
      });
      html += `
        <button class="picker-opt-btn clear-opt-btn" style="color:var(--text-faint); margin-top:2px;">
          <span>None (Clear)</span>
        </button>
      </div>
      <div class="popover-divider" style="height:1px; background:var(--border-subtle); margin:6px 0;"></div>
      <div class="add-option-row" style="display:flex; gap:4px; margin-top:4px;">
        <input type="text" class="new-option-input" placeholder="New option..." style="flex:1; border:1px solid var(--border-medium); border-radius:3px; padding:3px 6px; font-size:12px; background:var(--bg-card); color:var(--text-main);" />
        <button class="btn-sm btn-primary add-option-btn" style="padding:2px 8px; font-size:12px;">Add</button>
      </div>`;

      popover.innerHTML = html;

      popover.querySelectorAll('.picker-opt-btn:not(.clear-opt-btn)').forEach(btn => {
        btn.addEventListener('click', () => {
          row.values[prop.id] = btn.dataset.optId;
          this.render();
          this.notifyChange();
          popover.remove();
        });
      });

      popover.querySelector('.clear-opt-btn')?.addEventListener('click', () => {
        delete row.values[prop.id];
        this.render();
        this.notifyChange();
        popover.remove();
      });

      const input = popover.querySelector('.new-option-input');
      const addBtn = popover.querySelector('.add-option-btn');
      const doAdd = () => {
        const val = input.value.trim();
        if (val) {
          if (!prop.options) prop.options = [];
          const colors = ['blue', 'green', 'emerald', 'amber', 'purple', 'pink', 'gray'];
          const color = colors[prop.options.length % colors.length];
          const newOpt = { id: 'opt_' + Date.now(), label: val, color };
          prop.options.push(newOpt);
          row.values[prop.id] = newOpt.id;
          this.render();
          this.notifyChange();
          popover.remove();
        }
      };
      addBtn?.addEventListener('click', doAdd);
      input?.addEventListener('keydown', (evt) => { if (evt.key === 'Enter') doAdd(); });
    };

    renderOpts();

    const rect = e.currentTarget.getBoundingClientRect();
    popover.style.top = `${rect.bottom + window.scrollY + 4}px`;
    popover.style.left = `${Math.min(window.innerWidth - 220, Math.max(10, rect.left + window.scrollX))}px`;

    document.body.appendChild(popover);

    const closeHandler = (evt) => {
      if (!popover.contains(evt.target)) {
        popover.remove();
        document.removeEventListener('click', closeHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 10);
  }

  openMultiSelectPicker(e, row, prop) {
    const popover = document.createElement('div');
    popover.className = 'db-picker-popover';

    const renderOpts = () => {
      const currentSelected = new Set(Array.isArray(row.values?.[prop.id]) ? row.values[prop.id] : []);

      let html = `<div class="popover-title">${prop.name} (Tags)</div><div class="popover-list">`;
      (prop.options || []).forEach(opt => {
        const isSelected = currentSelected.has(opt.id);
        html += `
          <button class="picker-opt-btn ${isSelected ? 'is-selected' : ''}" data-opt-id="${opt.id}">
            <span class="badge badge-${opt.color || 'gray'}">${opt.label}</span>
            ${isSelected ? Icons.get('check', 'icon-xs', 12) : ''}
          </button>
        `;
      });
      html += `</div>
      <div class="popover-divider" style="height:1px; background:var(--border-subtle); margin:6px 0;"></div>
      <div class="add-option-row" style="display:flex; gap:4px; margin-top:4px;">
        <input type="text" class="new-tag-input" placeholder="New tag..." style="flex:1; border:1px solid var(--border-medium); border-radius:3px; padding:3px 6px; font-size:12px; background:var(--bg-card); color:var(--text-main);" />
        <button class="btn-sm btn-primary add-tag-btn" style="padding:2px 8px; font-size:12px;">Add</button>
      </div>`;

      popover.innerHTML = html;

      popover.querySelectorAll('.picker-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const optId = btn.dataset.optId;
          if (currentSelected.has(optId)) {
            currentSelected.delete(optId);
          } else {
            currentSelected.add(optId);
          }
          row.values[prop.id] = Array.from(currentSelected);
          this.render();
          this.notifyChange();
          renderOpts();
        });
      });

      const input = popover.querySelector('.new-tag-input');
      const addBtn = popover.querySelector('.add-tag-btn');
      const doAdd = () => {
        const val = input.value.trim();
        if (val) {
          if (!prop.options) prop.options = [];
          const colors = ['purple', 'blue', 'emerald', 'amber', 'pink', 'green', 'gray'];
          const color = colors[prop.options.length % colors.length];
          const newOpt = { id: 'opt_' + Date.now(), label: val, color };
          prop.options.push(newOpt);
          currentSelected.add(newOpt.id);
          row.values[prop.id] = Array.from(currentSelected);
          this.render();
          this.notifyChange();
          renderOpts();
        }
      };
      addBtn?.addEventListener('click', doAdd);
      input?.addEventListener('keydown', (evt) => { if (evt.key === 'Enter') doAdd(); });
    };

    renderOpts();

    const rect = e.currentTarget.getBoundingClientRect();
    popover.style.top = `${rect.bottom + window.scrollY + 4}px`;
    popover.style.left = `${Math.min(window.innerWidth - 220, Math.max(10, rect.left + window.scrollX))}px`;

    document.body.appendChild(popover);

    const closeHandler = (evt) => {
      if (!popover.contains(evt.target)) {
        popover.remove();
        document.removeEventListener('click', closeHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 10);
  }

  // --- Property Management ---

  openPropertyMenu(e, prop) {
    if (prop.type === 'title') return;

    const popover = document.createElement('div');
    popover.className = 'db-picker-popover';
    popover.innerHTML = `
      <div class="popover-title">Property Settings</div>
      <div class="popover-input-group">
        <label>Property Name</label>
        <input type="text" class="prop-name-field" value="${prop.name}" />
      </div>
      <div class="popover-divider"></div>
      <button class="menu-action-btn delete-prop-btn" style="color:var(--color-danger);">
        ${Icons.get('trash', 'icon-xs', 13)} Delete Property
      </button>
    `;

    const nameInput = popover.querySelector('.prop-name-field');
    nameInput.addEventListener('input', () => {
      prop.name = nameInput.value;
      this.notifyChange();
    });

    popover.querySelector('.delete-prop-btn').addEventListener('click', () => {
      this.database.properties = this.database.properties.filter(p => p.id !== prop.id);
      this.database.rows.forEach(r => {
        delete r.values[prop.id];
      });
      this.render();
      this.notifyChange();
      popover.remove();
    });

    const rect = e.currentTarget.getBoundingClientRect();
    popover.style.top = `${rect.bottom + window.scrollY + 4}px`;
    popover.style.left = `${Math.min(window.innerWidth - 220, rect.left + window.scrollX)}px`;

    document.body.appendChild(popover);

    const closeHandler = (evt) => {
      if (!popover.contains(evt.target)) {
        popover.remove();
        document.removeEventListener('click', closeHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 10);
  }

  openAddPropertyModal(e) {
    const popover = document.createElement('div');
    popover.className = 'db-picker-popover';
    popover.innerHTML = `
      <div class="popover-title">New Property</div>
      <div class="popover-input-group">
        <input type="text" class="new-prop-name" placeholder="Property name..." value="" />
      </div>
      <div class="popover-list">
        <div class="menu-label">Property Type</div>
        <button class="picker-type-btn" data-type="text">${Icons.get('paragraph', 'icon-xs', 13)} Text</button>
        <button class="picker-type-btn" data-type="status">${Icons.get('tag', 'icon-xs', 13)} Status</button>
        <button class="picker-type-btn" data-type="select">${Icons.get('tag', 'icon-xs', 13)} Select</button>
        <button class="picker-type-btn" data-type="multi-select">${Icons.get('tag', 'icon-xs', 13)} Multi-select</button>
        <button class="picker-type-btn" data-type="date">${Icons.get('calendar', 'icon-xs', 13)} Date</button>
        <button class="picker-type-btn" data-type="number">${Icons.get('hash', 'icon-xs', 13)} Number</button>
        <button class="picker-type-btn" data-type="checkbox">${Icons.get('checkList', 'icon-xs', 13)} Checkbox</button>
      </div>
    `;

    const nameInput = popover.querySelector('.new-prop-name');

    popover.querySelectorAll('.picker-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        const name = nameInput.value.trim() || type.charAt(0).toUpperCase() + type.slice(1);
        const propId = 'prop_' + Date.now();

        const newProp = {
          id: propId,
          name,
          type
        };

        if (type === 'status' || type === 'select' || type === 'multi-select') {
          newProp.options = [
            { id: 'opt_' + Date.now() + '_1', label: 'Option 1', color: 'blue' },
            { id: 'opt_' + Date.now() + '_2', label: 'Option 2', color: 'green' }
          ];
        }

        this.database.properties.push(newProp);
        this.render();
        this.notifyChange();
        popover.remove();
      });
    });

    const rect = e.currentTarget.getBoundingClientRect();
    popover.style.top = `${rect.bottom + window.scrollY + 4}px`;
    popover.style.left = `${Math.min(window.innerWidth - 240, rect.left + window.scrollX)}px`;

    document.body.appendChild(popover);

    const closeHandler = (evt) => {
      if (!popover.contains(evt.target)) {
        popover.remove();
        document.removeEventListener('click', closeHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 10);
  }

  // --- Filter & Sort Menus ---

  openFilterMenu(e) {
    const popover = document.createElement('div');
    popover.className = 'db-picker-popover';

    const props = this.database.properties.filter(p => p.type !== 'title');
    const currPropId = this.activeFilter ? this.activeFilter.propId : (props[0]?.id || '');
    const currOp = this.activeFilter ? this.activeFilter.operator : 'contains';
    const currVal = this.activeFilter ? this.activeFilter.value : '';

    let opts = props.map(p => `<option value="${p.id}" ${p.id === currPropId ? 'selected' : ''}>${p.name}</option>`).join('');

    popover.innerHTML = `
      <div class="popover-title">Filter by Property</div>
      <div class="popover-input-group">
        <select class="filter-prop-select">${opts}</select>
        <select class="filter-op-select">
          <option value="contains" ${currOp === 'contains' ? 'selected' : ''}>Contains</option>
          <option value="equals" ${currOp === 'equals' ? 'selected' : ''}>Equals</option>
          <option value="is_empty" ${currOp === 'is_empty' ? 'selected' : ''}>Is Empty</option>
          <option value="is_not_empty" ${currOp === 'is_not_empty' ? 'selected' : ''}>Is Not Empty</option>
        </select>
        <input type="text" class="filter-val-input" placeholder="Value..." value="${currVal || ''}" />
      </div>
      <div class="popover-btn-row">
        <button class="btn-sm btn-primary apply-filter-btn">Apply Filter</button>
        <button class="btn-sm btn-outline clear-filter-btn">Clear</button>
      </div>
    `;

    popover.querySelector('.apply-filter-btn').addEventListener('click', () => {
      this.activeFilter = {
        propId: popover.querySelector('.filter-prop-select').value,
        operator: popover.querySelector('.filter-op-select').value,
        value: popover.querySelector('.filter-val-input').value
      };
      this.render();
      popover.remove();
    });

    popover.querySelector('.clear-filter-btn').addEventListener('click', () => {
      this.activeFilter = null;
      this.render();
      popover.remove();
    });

    const rect = e.currentTarget.getBoundingClientRect();
    popover.style.top = `${rect.bottom + window.scrollY + 4}px`;
    popover.style.left = `${Math.min(window.innerWidth - 260, Math.max(10, rect.left + window.scrollX))}px`;

    document.body.appendChild(popover);

    const closeHandler = (evt) => {
      if (!popover.contains(evt.target)) {
        popover.remove();
        document.removeEventListener('click', closeHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 10);
  }

  openSortMenu(e) {
    const popover = document.createElement('div');
    popover.className = 'db-picker-popover';

    const props = this.database.properties;
    const currPropId = this.activeSort ? this.activeSort.propId : (props[0]?.id || '');
    const currDir = this.activeSort ? this.activeSort.direction : 'asc';

    let opts = props.map(p => `<option value="${p.id}" ${p.id === currPropId ? 'selected' : ''}>${p.name}</option>`).join('');

    popover.innerHTML = `
      <div class="popover-title">Sort by Property</div>
      <div class="popover-input-group">
        <select class="sort-prop-select">${opts}</select>
        <select class="sort-dir-select">
          <option value="asc" ${currDir === 'asc' ? 'selected' : ''}>Ascending (A → Z, 0 → 9)</option>
          <option value="desc" ${currDir === 'desc' ? 'selected' : ''}>Descending (Z → A, 9 → 0)</option>
        </select>
      </div>
      <div class="popover-btn-row">
        <button class="btn-sm btn-primary apply-sort-btn">Apply Sort</button>
        <button class="btn-sm btn-outline clear-sort-btn">Clear</button>
      </div>
    `;

    popover.querySelector('.apply-sort-btn').addEventListener('click', () => {
      this.activeSort = {
        propId: popover.querySelector('.sort-prop-select').value,
        direction: popover.querySelector('.sort-dir-select').value
      };
      this.render();
      popover.remove();
    });

    popover.querySelector('.clear-sort-btn').addEventListener('click', () => {
      this.activeSort = null;
      this.render();
      popover.remove();
    });

    const rect = e.currentTarget.getBoundingClientRect();
    popover.style.top = `${rect.bottom + window.scrollY + 4}px`;
    popover.style.left = `${Math.min(window.innerWidth - 260, Math.max(10, rect.left + window.scrollX))}px`;

    document.body.appendChild(popover);

    const closeHandler = (evt) => {
      if (!popover.contains(evt.target)) {
        popover.remove();
        document.removeEventListener('click', closeHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 10);
  }

  // --- CSV Export Helper ---

  exportCSV() {
    if (!this.database) return;
    const props = this.database.properties || [];
    const rows = this.database.rows || [];

    const headers = props.map(p => `"${p.name.replace(/"/g, '""')}"`).join(',');
    const lines = [headers];

    rows.forEach(r => {
      const line = props.map(p => {
        const val = r.values?.[p.id];
        if (val === undefined || val === null) return '""';
        if (p.type === 'status' || p.type === 'select') {
          const opt = p.options?.find(o => o.id === val);
          return `"${(opt?.label || val).replace(/"/g, '""')}"`;
        }
        if (p.type === 'multi-select' && Array.isArray(val)) {
          const labels = val.map(id => p.options?.find(o => o.id === id)?.label || id);
          return `"${labels.join('; ').replace(/"/g, '""')}"`;
        }
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',');
      lines.push(line);
    });

    const csvContent = lines.join('\n');
    const slug = (this.database.title || 'database').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    window.ExportImport?.downloadFile(`${slug}.csv`, csvContent, 'text/csv');
    window.App?.showToast('Database exported as CSV!');
  }

  // --- CRUD Rows ---

  addNewRow(defaultValues = {}) {
    const newRow = {
      id: 'row_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      order: this.database.rows.length,
      values: {
        prop_title: 'New Task / Item',
        ...defaultValues
      }
    };

    this.database.rows.push(newRow);
    this.render();
    this.notifyChange();
  }

  deleteRow(rowId) {
    this.database.rows = this.database.rows.filter(r => r.id !== rowId);
    this.render();
    this.notifyChange();
  }

  getPropertyTypeIcon(type) {
    switch (type) {
      case 'title': return Icons.get('paragraph', 'icon-xs', 12);
      case 'status':
      case 'select':
      case 'multi-select': return Icons.get('tag', 'icon-xs', 12);
      case 'date': return Icons.get('calendar', 'icon-xs', 12);
      case 'number': return Icons.get('hash', 'icon-xs', 12);
      case 'checkbox': return Icons.get('checkList', 'icon-xs', 12);
      default: return Icons.get('paragraph', 'icon-xs', 12);
    }
  }

  notifyChange() {
    State.updateDatabase(this.database);
  }
}

window.DatabaseEngine = DatabaseEngine;
