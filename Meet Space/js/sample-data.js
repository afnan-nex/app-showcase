/**
 * MeetSpace - Realistic Enterprise Sample Dataset
 * High-fidelity realistic meetings, agendas, notes, decisions, actions, and polls
 */

function getSampleData() {
  const today = new Date();
  
  const formatDateOffset = (daysOffset, hour = 10, minute = 0) => {
    const d = new Date(today);
    d.setDate(d.getDate() + daysOffset);
    d.setHours(hour, minute, 0, 0);
    return {
      dateStr: d.toISOString().split('T')[0],
      timeStr: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      iso: d.toISOString()
    };
  };

  const todayMeetingTime = formatDateOffset(0, 14, 0);
  const tomorrowMeetingTime = formatDateOffset(1, 10, 30);
  const nextWeekMeetingTime = formatDateOffset(3, 15, 0);
  const pastMeetingTime1 = formatDateOffset(-2, 11, 0);
  const pastMeetingTime2 = formatDateOffset(-5, 9, 30);

  const sampleParticipants = [
    { id: 'u1', name: 'Elena Vance', email: 'elena.vance@meetspace.io', role: 'VP of Product', avatarBg: '#4f46e5', status: 'confirmed' },
    { id: 'u2', name: 'Marcus Chen', email: 'marcus.chen@meetspace.io', role: 'Principal Architect', avatarBg: '#059669', status: 'confirmed' },
    { id: 'u3', name: 'Sarah Jenkins', email: 'sarah.j@meetspace.io', role: 'Staff Design Technologist', avatarBg: '#d97706', status: 'tentative' },
    { id: 'u4', name: 'David Kim', email: 'david.kim@meetspace.io', role: 'Director of Engineering', avatarBg: '#7c3aed', status: 'confirmed' },
    { id: 'u5', name: 'Amina Al-Mansoor', email: 'amina.m@meetspace.io', role: 'Data Platform Lead', avatarBg: '#dc2626', status: 'confirmed' },
    { id: 'u6', name: 'Lucas Rossi', email: 'lucas.r@meetspace.io', role: 'Chief Information Security Officer', avatarBg: '#2563eb', status: 'declined' }
  ];

  const meetings = [
    {
      id: 'meet-001',
      title: 'Q3 Enterprise Architecture & Edge Persistence Alignment',
      date: todayMeetingTime.dateStr,
      startTime: todayMeetingTime.timeStr,
      duration: 50,
      organizer: 'Elena Vance',
      organizerEmail: 'elena.vance@meetspace.io',
      location: 'Virtual / Room Alpha-1 & Zoom Bridge',
      tags: ['Architecture', 'Product', 'Q3', 'Offline'],
      status: 'in-progress',
      description: 'Review of local-first IndexedDB caching engine, multi-device replication SLAs, and facilitator workflow responsiveness benchmarks.',
      participants: [
        { id: 'u1', name: 'Elena Vance', email: 'elena.vance@meetspace.io', role: 'VP of Product', status: 'confirmed' },
        { id: 'u2', name: 'Marcus Chen', email: 'marcus.chen@meetspace.io', role: 'Principal Architect', status: 'confirmed' },
        { id: 'u3', name: 'Sarah Jenkins', email: 'sarah.j@meetspace.io', role: 'Staff Design Technologist', status: 'confirmed' },
        { id: 'u4', name: 'David Kim', email: 'david.kim@meetspace.io', role: 'Director of Engineering', status: 'tentative' },
        { id: 'u5', name: 'Amina Al-Mansoor', email: 'amina.m@meetspace.io', role: 'Data Platform Lead', status: 'confirmed' }
      ],
      agenda: [
        {
          id: 'ag-101',
          title: 'Executive Context & Enterprise Latency SLOs',
          duration: 10,
          completed: true,
          presenter: 'Elena Vance',
          notes: 'Customer Advisory Board requested sub-50ms facilitator interaction latency on 10,000-word transcripts.'
        },
        {
          id: 'ag-102',
          title: 'Client-First Storage & Transaction Isolation Spikes',
          duration: 15,
          completed: false,
          presenter: 'Marcus Chen',
          notes: 'Benchmarked IndexedDB against SQLite WASM; IndexedDB delivers 3.2x faster initial bootstrap with zero memory overhead.'
        },
        {
          id: 'ag-103',
          title: 'Design System 2.4 Token Audit & Focus Trapping',
          duration: 15,
          completed: false,
          presenter: 'Sarah Jenkins',
          notes: 'WCAG 2.1 AA keyboard focus trap verified in Command Palette modal and Fullscreen live mode.'
        },
        {
          id: 'ag-104',
          title: 'Sprint 26 Capacity & Rollout Timeline',
          duration: 10,
          completed: false,
          presenter: 'David Kim',
          notes: 'Frontend pod allocated 34 story points to live meeting hotkeys and export pipelines.'
        }
      ],
      notes: `<h2>Architecture Context & Facilitation Benchmarks</h2>
<p>To eliminate meeting friction, our primary mandate for Q3 is zero network dependency during in-progress sessions. Facilitators must never experience spinning loaders or lost action items during conference room Wi-Fi drops.</p>

<h3>Key Architectural Directives:</h3>
<ul>
  <li><strong>Local-First Transactions:</strong> All state mutations commit synchronously to IndexedDB with optimistic UI updates.</li>
  <li><strong>Zero External Asset Overhead:</strong> Vector icons are embedded directly as pure SVG without CDN network hops.</li>
  <li><strong>Synthesized Web Audio:</strong> Facilitator chime notifications use Web Audio API oscillators instead of external audio files.</li>
</ul>

<blockquote>"Facilitator focus is sacred. If an agenda tool requires more than three keystrokes to advance, it has failed its user."</blockquote>`,
      decisions: [
        {
          id: 'dec-101',
          meetingId: 'meet-001',
          title: 'Standardize on Local-First IndexedDB Engine',
          rationale: 'Eliminates round-trip network delays and guarantees 100% meeting uptime during remote or offline sessions.',
          decidedBy: 'Marcus Chen & Elena Vance',
          impact: 'High',
          tags: ['Architecture', 'Persistence'],
          timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString()
        },
        {
          id: 'dec-102',
          meetingId: 'meet-001',
          title: 'Adopt Pure Web Audio API Sound Generator',
          rationale: 'Removes MP3/WAV asset loading latency and ensures audio alerts work reliably across all browser sandboxes.',
          decidedBy: 'Sarah Jenkins',
          impact: 'Medium',
          tags: ['Audio', 'Performance'],
          timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString()
        }
      ],
      actionItems: [
        {
          id: 'act-101',
          meetingId: 'meet-001',
          meetingTitle: 'Q3 Enterprise Architecture & Edge Persistence Alignment',
          task: 'Benchmark IndexedDB batch writes on Safari iOS memory-constrained environments',
          assignee: 'Marcus Chen',
          assigneeEmail: 'marcus.chen@meetspace.io',
          dueDate: formatDateOffset(3).dateStr,
          priority: 'High',
          status: 'In Progress'
        },
        {
          id: 'act-102',
          meetingId: 'meet-001',
          meetingTitle: 'Q3 Enterprise Architecture & Edge Persistence Alignment',
          task: 'Add WCAG AA contrast ratio assertion to CI design token build step',
          assignee: 'Sarah Jenkins',
          assigneeEmail: 'sarah.j@meetspace.io',
          dueDate: formatDateOffset(2).dateStr,
          priority: 'Urgent',
          status: 'To Do'
        },
        {
          id: 'act-103',
          meetingId: 'meet-001',
          meetingTitle: 'Q3 Enterprise Architecture & Edge Persistence Alignment',
          task: 'Distribute Sprint 26 capacity estimates to engineering pod leads',
          assignee: 'David Kim',
          assigneeEmail: 'david.kim@meetspace.io',
          dueDate: formatDateOffset(1).dateStr,
          priority: 'Medium',
          status: 'To Do'
        }
      ],
      polls: [
        {
          id: 'poll-101',
          meetingId: 'meet-001',
          question: 'Which facilitator shortcut should be prioritized for the upcoming v2.2 release?',
          type: 'single',
          options: [
            { id: 'opt-1', text: 'Spacebar Play/Pause Section Timer', votes: 14 },
            { id: 'opt-2', text: 'Quick Key (N) for Next Topic Jump', votes: 9 },
            { id: 'opt-3', text: 'Auto-Advance with +1 Min Grace Period', votes: 6 }
          ],
          totalVotes: 29,
          isOpen: true
        }
      ]
    },
    {
      id: 'meet-002',
      title: 'Weekly Core Infrastructure & Query Telemetry Sync',
      date: tomorrowMeetingTime.dateStr,
      startTime: tomorrowMeetingTime.timeStr,
      duration: 45,
      organizer: 'Marcus Chen',
      organizerEmail: 'marcus.chen@meetspace.io',
      location: 'Engineering Pod Delta & Virtual',
      tags: ['Engineering', 'Telemetry', 'Infra'],
      status: 'scheduled',
      description: 'Weekly review of P99 query latency, cache invalidation strategies, and automated regression test coverage.',
      participants: [
        { id: 'u2', name: 'Marcus Chen', email: 'marcus.chen@meetspace.io', role: 'Principal Architect', status: 'confirmed' },
        { id: 'u4', name: 'David Kim', email: 'david.kim@meetspace.io', role: 'Director of Engineering', status: 'confirmed' },
        { id: 'u5', name: 'Amina Al-Mansoor', email: 'amina.m@meetspace.io', role: 'Data Platform Lead', status: 'confirmed' }
      ],
      agenda: [
        { id: 'ag-201', title: 'P99 Latency Flamegraphs & Index Health', duration: 15, completed: false, presenter: 'Amina Al-Mansoor' },
        { id: 'ag-202', title: 'Optimistic UI Dispatch & State Invalidation', duration: 20, completed: false, presenter: 'Marcus Chen' },
        { id: 'ag-203', title: 'Automated Playwright Suite Flakiness Triage', duration: 10, completed: false, presenter: 'David Kim' }
      ],
      notes: `<p>Please inspect the Datadog dashboard logs for query spike traces before joining the bridge.</p>`,
      decisions: [],
      actionItems: [
        {
          id: 'act-201',
          meetingId: 'meet-002',
          meetingTitle: 'Weekly Core Infrastructure & Query Telemetry Sync',
          task: 'Instrument Web Vitals performance telemetry in production bundle',
          assignee: 'Amina Al-Mansoor',
          assigneeEmail: 'amina.m@meetspace.io',
          dueDate: formatDateOffset(4).dateStr,
          priority: 'High',
          status: 'To Do'
        }
      ],
      polls: []
    },
    {
      id: 'meet-003',
      title: 'Design System 2.4 Components Review & Keyboard Access',
      date: nextWeekMeetingTime.dateStr,
      startTime: nextWeekMeetingTime.timeStr,
      duration: 60,
      organizer: 'Sarah Jenkins',
      organizerEmail: 'sarah.j@meetspace.io',
      location: 'Design Studio & Figma Live',
      tags: ['Design', 'UI/UX', 'Accessibility'],
      status: 'scheduled',
      description: 'Review of new focus trap primitives, high-contrast badges, keyboard facilitator overlays, and dark theme luminance curves.',
      participants: [
        { id: 'u3', name: 'Sarah Jenkins', email: 'sarah.j@meetspace.io', role: 'Staff Design Technologist', status: 'confirmed' },
        { id: 'u1', name: 'Elena Vance', email: 'elena.vance@meetspace.io', role: 'VP of Product', status: 'confirmed' },
        { id: 'u2', name: 'Marcus Chen', email: 'marcus.chen@meetspace.io', role: 'Principal Architect', status: 'tentative' }
      ],
      agenda: [
        { id: 'ag-301', title: 'Luminance Curves & WCAG Contrast Evaluation', duration: 15, completed: false, presenter: 'Sarah Jenkins' },
        { id: 'ag-302', title: 'Command Palette Focus Trapping & ARIA Roles', duration: 20, completed: false, presenter: 'Sarah Jenkins' },
        { id: 'ag-303', title: 'Live Facilitator Hero Typography Hierarchy', duration: 25, completed: false, presenter: 'Elena Vance' }
      ],
      notes: `<p>Goal: Ensure zero reliance on mouse interaction during live meeting facilitation.</p>`,
      decisions: [],
      actionItems: [],
      polls: []
    },
    {
      id: 'meet-004',
      title: 'Sprint 25 Retrospective & Release Velocity Debrief',
      date: pastMeetingTime1.dateStr,
      startTime: pastMeetingTime1.timeStr,
      duration: 45,
      organizer: 'David Kim',
      organizerEmail: 'david.kim@meetspace.io',
      location: 'Virtual Meeting Room',
      tags: ['Retrospective', 'Agile', 'Velocity'],
      status: 'completed',
      description: 'Bi-weekly sprint retrospective: celebrating shipped deliverables, root-cause analysis on review bottlenecks, and SLA agreements.',
      participants: [
        { id: 'u1', name: 'Elena Vance', email: 'elena.vance@meetspace.io', role: 'VP of Product', status: 'confirmed' },
        { id: 'u2', name: 'Marcus Chen', email: 'marcus.chen@meetspace.io', role: 'Principal Architect', status: 'confirmed' },
        { id: 'u3', name: 'Sarah Jenkins', email: 'sarah.j@meetspace.io', role: 'Staff Design Technologist', status: 'confirmed' },
        { id: 'u4', name: 'David Kim', email: 'david.kim@meetspace.io', role: 'Director of Engineering', status: 'confirmed' },
        { id: 'u5', name: 'Amina Al-Mansoor', email: 'amina.m@meetspace.io', role: 'Data Platform Lead', status: 'confirmed' }
      ],
      agenda: [
        { id: 'ag-401', title: 'Sprint Velocity & Story Point Burnup', duration: 10, completed: true, presenter: 'David Kim' },
        { id: 'ag-402', title: 'What Went Well (Zero Regression Milestone)', duration: 10, completed: true, presenter: 'David Kim' },
        { id: 'ag-403', title: 'Friction Points: Code Review Turnaround SLA', duration: 15, completed: true, presenter: 'Marcus Chen' },
        { id: 'ag-404', title: 'Actionable Commitments for Sprint 26', duration: 10, completed: true, presenter: 'Elena Vance' }
      ],
      notes: `<h2>Sprint 25 Highlights & Review</h2>
<ul>
  <li>Delivered 18 story points over target with zero Sev-1 regressions.</li>
  <li>Average facilitator standup duration reduced from 14m to 7.5m.</li>
</ul>
<h3>Key Improvement Opportunity:</h3>
<p>Pull requests exceeding 300 LOC require assigned peer reviewers within 4 business hours to avoid release branch contention.</p>`,
      decisions: [
        {
          id: 'dec-401',
          meetingId: 'meet-004',
          title: 'Establish 4-Hour Code Review SLA for Core PRs',
          rationale: 'Accelerates sprint velocity by preventing blocked dependent feature tracks and minimizing merge drift.',
          decidedBy: 'Engineering Team Consensus',
          impact: 'High',
          tags: ['Process', 'Velocity'],
          timestamp: pastMeetingTime1.iso
        }
      ],
      actionItems: [
        {
          id: 'act-401',
          meetingId: 'meet-004',
          meetingTitle: 'Sprint 25 Retrospective & Release Velocity Debrief',
          task: 'Configure GitHub Slack bot webhook for pending PR review reminders',
          assignee: 'David Kim',
          assigneeEmail: 'david.kim@meetspace.io',
          dueDate: formatDateOffset(-1).dateStr,
          priority: 'Medium',
          status: 'Done'
        },
        {
          id: 'act-402',
          meetingId: 'meet-004',
          meetingTitle: 'Sprint 25 Retrospective & Release Velocity Debrief',
          task: 'Add automated bundle size budget verification to GitHub Actions CI',
          assignee: 'Marcus Chen',
          assigneeEmail: 'marcus.chen@meetspace.io',
          dueDate: formatDateOffset(1).dateStr,
          priority: 'High',
          status: 'Done'
        }
      ],
      polls: []
    },
    {
      id: 'meet-005',
      title: 'Customer Advisory Board: Executive Meeting Minutes Export Requirements',
      date: pastMeetingTime2.dateStr,
      startTime: pastMeetingTime2.timeStr,
      duration: 60,
      organizer: 'Elena Vance',
      organizerEmail: 'elena.vance@meetspace.io',
      location: 'Executive Briefing Center',
      tags: ['Customer', 'Enterprise', 'Compliance'],
      status: 'completed',
      description: 'Synthesis of feedback from pilot enterprise customers regarding PDF-ready printable minutes, audit trails, and role-based permissions.',
      participants: [
        { id: 'u1', name: 'Elena Vance', email: 'elena.vance@meetspace.io', role: 'VP of Product', status: 'confirmed' },
        { id: 'u6', name: 'Lucas Rossi', email: 'lucas.r@meetspace.io', role: 'Chief Information Security Officer', status: 'confirmed' }
      ],
      agenda: [
        { id: 'ag-501', title: 'Top 5 Enterprise Customer Pain Points', duration: 20, completed: true, presenter: 'Elena Vance' },
        { id: 'ag-502', title: 'Printable HTML & Executive Memo Formatting', duration: 20, completed: true, presenter: 'Elena Vance' },
        { id: 'ag-503', title: 'SOC2 Type II Export Integrity & Data Backup', duration: 20, completed: true, presenter: 'Lucas Rossi' }
      ],
      notes: `<p>Enterprise stakeholders require a 1-click printable summary with executive corporate headers that can be archived directly into compliance vaults without third-party cloud data exposure.</p>`,
      decisions: [
        {
          id: 'dec-501',
          meetingId: 'meet-005',
          title: 'Implement 100% Client-Side Printable HTML & PDF Exporter',
          rationale: 'Satisfies enterprise SOC2 compliance by ensuring no meeting minutes leave the user browser without explicit authorization.',
          decidedBy: 'Elena Vance & Lucas Rossi',
          impact: 'High',
          tags: ['Compliance', 'Export'],
          timestamp: pastMeetingTime2.iso
        }
      ],
      actionItems: [
        {
          id: 'act-501',
          meetingId: 'meet-005',
          meetingTitle: 'Customer Advisory Board: Executive Meeting Minutes Export Requirements',
          task: 'Build print stylesheet (@media print) with corporate header and signature block',
          assignee: 'Sarah Jenkins',
          assigneeEmail: 'sarah.j@meetspace.io',
          dueDate: formatDateOffset(-3).dateStr,
          priority: 'Urgent',
          status: 'Done'
        }
      ],
      polls: []
    }
  ];

  const allDecisions = [];
  const allActionItems = [];
  const allPolls = [];

  meetings.forEach(m => {
    if (m.decisions) allDecisions.push(...m.decisions);
    if (m.actionItems) allActionItems.push(...m.actionItems);
    if (m.polls) allPolls.push(...m.polls);
  });

  const defaultSettings = [
    { key: 'theme', value: 'light' },
    { key: 'soundEnabled', value: true },
    { key: 'soundVolume', value: 0.6 },
    { key: 'autoAdvanceAgenda', value: true },
    { key: 'defaultDuration', value: 30 },
    { key: 'currentUser', value: { id: 'u1', name: 'Elena Vance', email: 'elena.vance@meetspace.io', role: 'VP of Product' } }
  ];

  return {
    meetings,
    decisions: allDecisions,
    actionItems: allActionItems,
    polls: allPolls,
    participants: sampleParticipants,
    settings: defaultSettings
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getSampleData };
}
