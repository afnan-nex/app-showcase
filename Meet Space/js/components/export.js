/**
 * MeetSpace - Export & Printable Document Generator
 * Generates clean executive summaries, printable HTML, and JSON backups
 */

const Exporter = {
  /**
   * Generates a self-contained, beautifully styled HTML document of meeting minutes
   */
  generateMeetingHtml(meeting) {
    if (!meeting) return '';

    const formatTime = (iso) => {
      try {
        return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
      } catch (e) {
        return iso;
      }
    };

    const participantsHtml = (meeting.participants || []).map(p => `
      <span style="display:inline-block; margin: 2px 6px 2px 0; padding: 3px 8px; border: 1px solid #cbd5e1; border-radius: 99px; font-size: 12px;">
        <strong>${p.name}</strong> (${p.role || 'Attendee'}) - <em>${p.status || 'confirmed'}</em>
      </span>
    `).join('');

    const agendaHtml = (meeting.agenda || []).map((a, i) => `
      <li style="margin-bottom: 8px;">
        <strong>${i + 1}. ${a.title}</strong> (${a.duration} mins) ${a.presenter ? `— <em>${a.presenter}</em>` : ''}
        ${a.completed ? ' <span style="color:#059669; font-size:12px;">[Completed]</span>' : ''}
      </li>
    `).join('');

    const decisionsHtml = (meeting.decisions && meeting.decisions.length > 0)
      ? meeting.decisions.map(d => `
        <div style="border-left: 3px solid #4f46e5; padding: 8px 12px; margin-bottom: 10px; background: #f8fafc;">
          <div style="font-weight: 600; color: #0f172a; font-size: 14px;">${d.title}</div>
          <div style="font-size: 13px; color: #334155; margin-top: 4px;">${d.rationale}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Decided by: ${d.decidedBy} • Impact: ${d.impact}</div>
        </div>
      `).join('')
      : '<p style="color: #64748b; font-style: italic;">No formal decisions recorded.</p>';

    const actionsHtml = (meeting.actionItems && meeting.actionItems.length > 0)
      ? `
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 8px;">
          <thead>
            <tr style="background: #f1f5f9; text-align: left;">
              <th style="padding: 8px; border: 1px solid #cbd5e1;">Task</th>
              <th style="padding: 8px; border: 1px solid #cbd5e1;">Assignee</th>
              <th style="padding: 8px; border: 1px solid #cbd5e1;">Due Date</th>
              <th style="padding: 8px; border: 1px solid #cbd5e1;">Priority</th>
              <th style="padding: 8px; border: 1px solid #cbd5e1;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${meeting.actionItems.map(act => `
              <tr>
                <td style="padding: 8px; border: 1px solid #cbd5e1;">${act.task}</td>
                <td style="padding: 8px; border: 1px solid #cbd5e1;">${act.assignee}</td>
                <td style="padding: 8px; border: 1px solid #cbd5e1;">${act.dueDate || 'N/A'}</td>
                <td style="padding: 8px; border: 1px solid #cbd5e1;">${act.priority}</td>
                <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>${act.status}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `
      : '<p style="color: #64748b; font-style: italic;">No action items recorded.</p>';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Meeting Minutes - ${meeting.title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #0f172a;
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
    }
    h1 { font-size: 24px; border-bottom: 2px solid #0f172a; padding-bottom: 8px; margin-bottom: 12px; }
    h2 { font-size: 18px; margin-top: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; color: #1e293b; }
    .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 6px; margin-bottom: 20px; font-size: 13px; }
    .meta-row { margin-bottom: 4px; }
    @media print {
      body { margin: 0; max-width: 100%; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px;">
    <button onclick="window.print()" style="padding: 8px 16px; background: #4f46e5; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">Print / Save to PDF</button>
  </div>

  <h1>${meeting.title}</h1>

  <div class="meta-box">
    <div class="meta-row"><strong>Date:</strong> ${meeting.date} at ${meeting.startTime || '10:00'} (${meeting.duration} minutes)</div>
    <div class="meta-row"><strong>Organizer:</strong> ${meeting.organizer} (${meeting.organizerEmail || 'N/A'})</div>
    <div class="meta-row"><strong>Location:</strong> ${meeting.location || 'Virtual'}</div>
    <div class="meta-row"><strong>Status:</strong> ${meeting.status.toUpperCase()}</div>
  </div>

  <h2>1. Attendees & Attendance</h2>
  <div>${participantsHtml}</div>

  <h2>2. Agenda Overview</h2>
  <ol style="padding-left: 20px;">${agendaHtml}</ol>

  <h2>3. Collaborative Notes & Discussion</h2>
  <div style="background: #ffffff; padding: 4px 0;">
    ${meeting.notes || '<p style="color: #64748b; font-style: italic;">No notes recorded.</p>'}
  </div>

  <h2>4. Decisions Log</h2>
  <div>${decisionsHtml}</div>

  <h2>5. Action Items & Commitments</h2>
  <div>${actionsHtml}</div>

  <footer style="margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
    Generated by MeetSpace • ${new Date().toLocaleString()}
  </footer>
</body>
</html>`;
  },

  /**
   * Trigger download of printable HTML
   */
  downloadMeetingSummary(meeting) {
    const html = this.generateMeetingHtml(meeting);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Meeting_Summary_${meeting.title.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * Export full database JSON backup
   */
  async exportJsonBackup() {
    try {
      const dump = await AppDB.exportFullDatabase();
      const jsonStr = JSON.stringify(dump, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meetspace_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      Notifier.show('Backup Created', 'Database export downloaded successfully.', 'success');
    } catch (e) {
      console.error('Backup error:', e);
      Notifier.show('Export Error', 'Failed to export backup data.', 'danger');
    }
  },

  /**
   * Import JSON backup
   */
  async importJsonBackup(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const dump = JSON.parse(e.target.result);
          await AppDB.importFullDatabase(dump);
          await Store.loadAll();
          Store.emit('meetings:changed');
          Store.emit('actions:changed');
          Store.emit('decisions:changed');
          Notifier.show('Restore Complete', 'Database successfully restored from backup file.', 'success');
          resolve(true);
        } catch (err) {
          console.error('Import parse error:', err);
          Notifier.show('Import Failed', 'Invalid JSON backup file format.', 'danger');
          reject(err);
        }
      };
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }
};
