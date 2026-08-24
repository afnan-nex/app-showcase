/**
 * All Projects Manager View
 * Project cards grid, status badges, progress bars, member lists, and creation/edit actions
 */

window.ProjectsView = {
  render(container) {
    const state = window.State.getState();
    const projects = state.projects || [];
    const allTasks = state.tasks.filter(t => !t.archived);

    container.innerHTML = `
      <div class="projects-container" style="padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <h2 style="font-size: var(--font-size-lg); font-weight: 700;">Projects Directory</h2>
            <span style="font-size: var(--font-size-xs); color: var(--text-muted);">${projects.length} active initiatives</span>
          </div>
          <button class="btn btn-primary" id="createNewProjectBtn">
            ${window.Icons.get('plus', 16)}
            <span>New Project</span>
          </button>
        </div>

        <div class="projects-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;">
          ${projects.map(p => {
            const pTasks = allTasks.filter(t => t.projectId === p.id);
            const pDone = pTasks.filter(t => t.status === 'done');
            const percent = pTasks.length === 0 ? 0 : Math.round((pDone.length / pTasks.length) * 100);
            const members = (p.members || []).map(mId => window.State.getUserById(mId)).filter(Boolean);

            return `
              <div class="metric-card project-card-item" data-project-id="${p.id}" style="cursor: pointer; gap: 12px;">
                <div class="metric-header">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span class="project-dot" style="background-color: ${p.color}; width: 12px; height: 12px;"></span>
                    <span style="font-size: var(--font-size-md); font-weight: 600; color: var(--text-primary);">${window.Utils.escapeHtml(p.name)}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <button class="icon-btn-sm favorite-project-btn" data-project-id="${p.id}" title="Toggle Favorite">
                      ${window.Icons.get(p.isFavorite ? 'star' : 'star_outline', 15, p.isFavorite ? 'text-warning' : '')}
                    </button>
                    <button class="icon-btn-sm edit-project-btn" data-project-id="${p.id}" title="Edit Project">
                      ${window.Icons.get('settings', 15)}
                    </button>
                  </div>
                </div>

                <p style="font-size: var(--font-size-sm); color: var(--text-secondary); line-height: 1.4; min-height: 40px;">
                  ${window.Utils.escapeHtml(p.description || 'No description provided.')}
                </p>

                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                    <span style="color: var(--text-muted);">Progress</span>
                    <strong style="color: var(--text-primary);">${percent}% (${pDone.length}/${pTasks.length} tasks)</strong>
                  </div>
                  <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${percent}%; background-color: ${p.color};"></div>
                  </div>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid var(--border-color-subtle); font-size: var(--font-size-xs);">
                  <div class="avatar-stack">
                    ${members.map(m => `
                      <img src="${m.avatar}" alt="${window.Utils.escapeHtml(m.name)}" class="avatar-xs" title="${window.Utils.escapeHtml(m.name)}">
                    `).join('')}
                  </div>

                  <div style="display: flex; align-items: center; gap: 6px; color: var(--text-muted);">
                    ${p.deadline ? `
                      <span>${window.Icons.get('clock', 12)} ${window.Utils.formatShortDate(p.deadline)}</span>
                    ` : ''}
                    <span class="badge badge-subtle" style="text-transform: capitalize;">${p.status}</span>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    this.attachEvents(container);
  },

  attachEvents(container) {
    const createBtn = container.querySelector('#createNewProjectBtn');
    if (createBtn) {
      createBtn.addEventListener('click', () => window.Modals.openProjectModal());
    }

    container.querySelectorAll('.project-card-item').forEach(card => {
      const pId = card.getAttribute('data-project-id');

      card.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
          window.State.setActiveProject(pId);
          window.State.setActiveView('board');
        }
      });
    });

    container.querySelectorAll('.favorite-project-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const pId = btn.getAttribute('data-project-id');
        await window.State.toggleFavoriteProject(pId);
        this.render(container);
      });
    });

    container.querySelectorAll('.edit-project-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pId = btn.getAttribute('data-project-id');
        window.Modals.openProjectModal(pId);
      });
    });
  }
};
