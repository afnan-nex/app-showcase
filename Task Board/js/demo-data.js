/**
 * Authentic B2B Workspace Demo Dataset
 * Realistic product engineering, cloud infrastructure, and security audit operations
 */

function generateAvatar(name, bg) {
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="8" fill="${bg}"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="14" font-weight="700" letter-spacing="-0.5">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

window.DemoData = {
  getInitialState() {
    const today = new Date();
    const formatDate = (offsetDays) => {
      const d = new Date(today);
      d.setDate(d.getDate() + offsetDays);
      return d.toISOString().split('T')[0];
    };

    const users = [
      {
        id: 'user-1',
        name: 'Sarah Chen',
        role: 'Staff Product Manager',
        email: 'sarah.chen@cloudscale.io',
        avatar: generateAvatar('Sarah Chen', '#4f46e5')
      },
      {
        id: 'user-2',
        name: 'Alex Rivera',
        role: 'Principal Frontend Architect',
        email: 'alex.rivera@cloudscale.io',
        avatar: generateAvatar('Alex Rivera', '#2563eb')
      },
      {
        id: 'user-3',
        name: 'Marcus Vance',
        role: 'Senior Site Reliability Lead',
        email: 'marcus.vance@cloudscale.io',
        avatar: generateAvatar('Marcus Vance', '#0891b2')
      },
      {
        id: 'user-4',
        name: 'Elena Rostova',
        role: 'Senior Design Systems Lead',
        email: 'elena.rostova@cloudscale.io',
        avatar: generateAvatar('Elena Rostova', '#db2777')
      },
      {
        id: 'user-5',
        name: 'Priya Sharma',
        role: 'Head of Security & Compliance',
        email: 'priya.sharma@cloudscale.io',
        avatar: generateAvatar('Priya Sharma', '#059669')
      }
    ];

    const labels = [
      { id: 'lbl-1', name: 'Frontend', color: '#4f46e5' },
      { id: 'lbl-2', name: 'Infrastructure', color: '#0891b2' },
      { id: 'lbl-3', name: 'Design System', color: '#db2777' },
      { id: 'lbl-4', name: 'Security & Audit', color: '#059669' },
      { id: 'lbl-5', name: 'Performance', color: '#d97706' },
      { id: 'lbl-6', name: 'Defect / P1', color: '#e11d48' }
    ];

    const projects = [
      {
        id: 'proj-1',
        name: 'Mobile Core 2.0 & Gesture Engine',
        description: 'Multi-platform offline-first client overhaul with 60fps pan physics and SQLite conflict-free replicated data synchronization.',
        status: 'active',
        color: '#4f46e5',
        members: ['user-1', 'user-2', 'user-4'],
        isFavorite: true,
        startDate: formatDate(-14),
        deadline: formatDate(28),
        createdAt: new Date(Date.now() - 14 * 86400000).toISOString()
      },
      {
        id: 'proj-2',
        name: 'Distributed Edge Compute & Multi-Region',
        description: 'Global Aurora PostgreSQL replica failover, Argo Smart Routing, and Prometheus autoscaler latency tuning.',
        status: 'active',
        color: '#0891b2',
        members: ['user-1', 'user-3', 'user-5'],
        isFavorite: true,
        startDate: formatDate(-30),
        deadline: formatDate(42),
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
      },
      {
        id: 'proj-3',
        name: 'SOC2 Type II Annual Recertification',
        description: 'Zero-trust WebAuthn mandate, IAM key rotators, SAST blocking gates in CI/CD, and external pen-testing report remediations.',
        status: 'active',
        color: '#059669',
        members: ['user-1', 'user-5', 'user-3'],
        isFavorite: false,
        startDate: formatDate(-8),
        deadline: formatDate(12),
        createdAt: new Date(Date.now() - 8 * 86400000).toISOString()
      }
    ];

    const tasks = [
      // Project 1 Tasks (Mobile Core)
      {
        id: 'task-101',
        key: 'TB-101',
        projectId: 'proj-1',
        title: 'Design token specification & semantic color mappings',
        description: 'Establish unified design tokens (typography scale, elevation matrices, and WCAG AA contrast rules) across Figma variables and exported JSON token artifacts.\n\nAll primary action buttons must maintain minimum 4.5:1 luminance ratio in both high-key and obsidian dark modes.',
        status: 'done',
        priority: 'high',
        assigneeId: 'user-4',
        labels: ['lbl-1', 'lbl-3'],
        dueDate: formatDate(-4),
        startDate: formatDate(-12),
        checklist: [
          { id: 'chk-1', title: 'Audit legacy hardcoded hex values in component library', completed: true, parentId: null },
          { id: 'chk-2', title: 'Declare semantic surface & border token aliases', completed: true, parentId: null },
          { id: 'chk-3', title: 'Validate 4.5:1 contrast in dark obsidian palette', completed: true, parentId: 'chk-2' },
          { id: 'chk-4', title: 'Publish tokens.json package v2.1.0 to npm registry', completed: true, parentId: null }
        ],
        comments: [
          { id: 'c-1', authorId: 'user-1', text: 'Contrast verified across all 18 Figma screen flows. Ready for engineering handoff.', createdAt: new Date(Date.now() - 3 * 86400000).toISOString() }
        ],
        attachments: [
          { id: 'att-1', name: 'design-tokens-v2.pdf', size: '1.4 MB', type: 'application/pdf' }
        ],
        archived: false,
        createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 86400000).toISOString()
      },
      {
        id: 'task-102',
        key: 'TB-102',
        projectId: 'proj-1',
        title: 'Implement swipe gesture handlers and fluid bottom sheet physics',
        description: 'Configure PanResponder gesture interpolators with spring stiffness: 220, damping: 28 for native 60fps sheet dismissal.\n\nMust properly handle velocity threshold triggers when scrolling nested task lists.',
        status: 'review',
        priority: 'urgent',
        assigneeId: 'user-2',
        labels: ['lbl-1', 'lbl-5'],
        dueDate: formatDate(1),
        startDate: formatDate(-5),
        checklist: [
          { id: 'chk-10', title: 'Gesture state machine with touch-slop detection', completed: true, parentId: null },
          { id: 'chk-11', title: 'Spring animation curve interpolation', completed: true, parentId: null },
          { id: 'chk-12', title: 'Nested scroll delegation on Android 14', completed: false, parentId: null }
        ],
        comments: [
          { id: 'c-2', authorId: 'user-4', text: 'Spring rebound feels remarkably responsive on iPhone 15 Pro testing rig.', createdAt: new Date(Date.now() - 1 * 86400000).toISOString() }
        ],
        attachments: [],
        archived: false,
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
      },
      {
        id: 'task-103',
        key: 'TB-103',
        projectId: 'proj-1',
        title: 'Offline mutation sync engine with SQLite write ledger',
        description: 'Build robust optimistic queue for task state mutations. On network loss, buffer JSON operational diffs into local SQLite storage and reconcile via CRDT timestamps on reconnect.',
        status: 'in-progress',
        priority: 'urgent',
        assigneeId: 'user-2',
        labels: ['lbl-1', 'lbl-5'],
        dueDate: formatDate(3),
        startDate: formatDate(-2),
        checklist: [
          { id: 'chk-20', title: 'Local mutations schema with WAL mode enabled', completed: true, parentId: null },
          { id: 'chk-21', title: 'Network state transition event subscriber', completed: true, parentId: null },
          { id: 'chk-22', title: 'Field-level conflict resolution merge matrix', completed: false, parentId: null },
          { id: 'chk-23', title: 'Chaos testing under simulated 500ms packet loss', completed: false, parentId: 'chk-22' }
        ],
        comments: [],
        attachments: [],
        archived: false,
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
      },
      {
        id: 'task-104',
        key: 'TB-104',
        projectId: 'proj-1',
        title: 'Hardware Biometric FaceID & Secure Enclave token caching',
        description: 'Store OAuth refresh tokens encrypted in platform keystore with biometric prompt gate on app resume after 15 minutes of inactivity.',
        status: 'todo',
        priority: 'high',
        assigneeId: 'user-5',
        labels: ['lbl-1', 'lbl-4'],
        dueDate: formatDate(6),
        startDate: null,
        checklist: [
          { id: 'chk-30', title: 'Keychain Services API bridge', completed: false, parentId: null },
          { id: 'chk-31', title: 'Device PIN fallback validation fallback screen', completed: false, parentId: null }
        ],
        comments: [],
        attachments: [],
        archived: false,
        createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 86400000).toISOString()
      },
      {
        id: 'task-105',
        key: 'TB-105',
        projectId: 'proj-1',
        title: 'Haptic audio cues profile for board drag-and-drop actions',
        description: 'Synthesize low-latency subtle feedback click when task card locks into target column slot.',
        status: 'backlog',
        priority: 'low',
        assigneeId: 'user-4',
        labels: ['lbl-3'],
        dueDate: formatDate(14),
        startDate: null,
        checklist: [],
        comments: [],
        attachments: [],
        archived: false,
        createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 8 * 86400000).toISOString()
      },

      // Project 2 Tasks (Distributed Infrastructure)
      {
        id: 'task-201',
        key: 'TB-201',
        projectId: 'proj-2',
        title: 'Aurora PostgreSQL multi-region cross-account replication',
        description: 'Execute zero-downtime cluster cutover to global database cluster with async replication lag under 25ms to eu-west-1 replica.',
        status: 'done',
        priority: 'urgent',
        assigneeId: 'user-3',
        labels: ['lbl-2', 'lbl-5'],
        dueDate: formatDate(-6),
        startDate: formatDate(-18),
        checklist: [
          { id: 'chk-40', title: 'Replication lag metric alarm in CloudWatch', completed: true, parentId: null },
          { id: 'chk-41', title: 'Staging environment failover rehearsal drill', completed: true, parentId: null },
          { id: 'chk-42', title: 'Route53 weighted DNS endpoint migration', completed: true, parentId: null }
        ],
        comments: [
          { id: 'c-3', authorId: 'user-3', text: 'Cluster migration completed with 0 aborted transactions. Average replication lag is 14ms.', createdAt: new Date(Date.now() - 6 * 86400000).toISOString() }
        ],
        attachments: [],
        archived: false,
        createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 86400000).toISOString()
      },
      {
        id: 'task-202',
        key: 'TB-202',
        projectId: 'proj-2',
        title: 'Tune Kubernetes HPA scaling stabilization windows',
        description: 'Configure pod horizontal autoscaling against custom Redis queue backlog size to absorb sudden batch export spikes without pod thrashing.',
        status: 'in-progress',
        priority: 'high',
        assigneeId: 'user-3',
        labels: ['lbl-2', 'lbl-5'],
        dueDate: formatDate(2),
        startDate: formatDate(-3),
        checklist: [
          { id: 'chk-50', title: 'Deploy Prometheus adapter for custom Redis metrics', completed: true, parentId: null },
          { id: 'chk-51', title: 'Define scaleDown.stabilizationWindowSeconds: 300', completed: false, parentId: null }
        ],
        comments: [],
        attachments: [],
        archived: false,
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
      },
      {
        id: 'task-203',
        key: 'TB-203',
        projectId: 'proj-2',
        title: 'Investigate Redis heartbeat pool socket handle leak',
        description: 'Client connection handles occasionally linger when TLS connection terminates without FIN handshake, slowly incrementing Redis resident memory.',
        status: 'review',
        priority: 'urgent',
        assigneeId: 'user-3',
        labels: ['lbl-6', 'lbl-2'],
        dueDate: formatDate(-1), // Overdue for demo
        startDate: formatDate(-4),
        checklist: [
          { id: 'chk-60', title: 'Reproduce leak in isolated load test harness', completed: true, parentId: null },
          { id: 'chk-61', title: 'Patch TCP keepalive idle timeout to 60s', completed: true, parentId: null }
        ],
        comments: [
          { id: 'c-4', authorId: 'user-5', text: 'Verified heap plateau over 48h soak test with 40,000 synthetic WebSocket clients.', createdAt: new Date(Date.now() - 1 * 86400000).toISOString() }
        ],
        attachments: [],
        archived: false,
        createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
      },
      {
        id: 'task-204',
        key: 'TB-204',
        projectId: 'proj-2',
        title: 'Edge caching header policy for static JSON query payloads',
        description: 'Configure Cloudflare cache tags and stale-while-revalidate headers to achieve 92%+ cache hit ratio on public workspace boards.',
        status: 'todo',
        priority: 'medium',
        assigneeId: 'user-3',
        labels: ['lbl-2', 'lbl-5'],
        dueDate: formatDate(8),
        startDate: null,
        checklist: [],
        comments: [],
        attachments: [],
        archived: false,
        createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 86400000).toISOString()
      },

      // Project 3 Tasks (SOC2 Compliance)
      {
        id: 'task-301',
        key: 'TB-301',
        projectId: 'proj-3',
        title: 'Mandate FIDO2 hardware keys & Okta SAML 2.0 SSO',
        description: 'Enforce phishing-resistant WebAuthn authentication for all engineering staff accounts with automated session revocation on anomalous IP changes.',
        status: 'done',
        priority: 'urgent',
        assigneeId: 'user-5',
        labels: ['lbl-4'],
        dueDate: formatDate(-3),
        startDate: formatDate(-10),
        checklist: [
          { id: 'chk-70', title: 'Deploy Okta SAML application manifest', completed: true, parentId: null },
          { id: 'chk-71', title: 'Deprecate legacy password login endpoints', completed: true, parentId: null }
        ],
        comments: [],
        attachments: [
          { id: 'att-2', name: 'soc2-access-policy-v3.pdf', size: '380 KB', type: 'application/pdf' }
        ],
        archived: false,
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 86400000).toISOString()
      },
      {
        id: 'task-302',
        key: 'TB-302',
        projectId: 'proj-3',
        title: 'Static application security testing (SAST) in CI gate',
        description: 'Integrate Semgrep rulesets to block pull requests containing SQL injection vectors, SSRF vulnerabilities, or unescaped HTML templates.',
        status: 'in-progress',
        priority: 'high',
        assigneeId: 'user-5',
        labels: ['lbl-4', 'lbl-2'],
        dueDate: formatDate(0), // Due today
        startDate: formatDate(-2),
        checklist: [
          { id: 'chk-80', title: 'Write custom ruleset for internal sanitizer wrappers', completed: true, parentId: null },
          { id: 'chk-81', title: 'Configure GitHub Actions branch protection check', completed: false, parentId: null }
        ],
        comments: [],
        attachments: [],
        archived: false,
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
      },
      {
        id: 'task-303',
        key: 'TB-303',
        projectId: 'proj-3',
        title: 'Quarterly IAM access key rotation & privilege audit',
        description: 'Automate deletion of STS session keys older than 90 days and audit production bastion host SSH certificates.',
        status: 'todo',
        priority: 'medium',
        assigneeId: 'user-1',
        labels: ['lbl-4'],
        dueDate: formatDate(5),
        startDate: null,
        checklist: [],
        comments: [],
        attachments: [],
        archived: false,
        createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 86400000).toISOString()
      },
      {
        id: 'task-304',
        key: 'TB-304',
        projectId: 'proj-3',
        title: 'Review third-party penetration testing audit report',
        description: 'Evaluate findings report from NCC Group security assessment and triage remediation tickets for next sprint.',
        status: 'backlog',
        priority: 'high',
        assigneeId: 'user-5',
        labels: ['lbl-4'],
        dueDate: formatDate(12),
        startDate: null,
        checklist: [],
        comments: [],
        attachments: [],
        archived: false,
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 86400000).toISOString()
      }
    ];

    const activities = [
      {
        id: 'act-1',
        userId: 'user-3',
        action: 'completed_task',
        taskId: 'task-201',
        taskTitle: 'Aurora PostgreSQL multi-region cross-account replication',
        detail: 'marked task as Done after verifying replication latency',
        timestamp: new Date(Date.now() - 6 * 86400000).toISOString()
      },
      {
        id: 'act-2',
        userId: 'user-4',
        action: 'completed_task',
        taskId: 'task-101',
        taskTitle: 'Design token specification & semantic color mappings',
        detail: 'completed all checklist items and contrast validations',
        timestamp: new Date(Date.now() - 3 * 86400000).toISOString()
      },
      {
        id: 'act-3',
        userId: 'user-5',
        action: 'completed_task',
        taskId: 'task-301',
        taskTitle: 'Mandate FIDO2 hardware keys & Okta SAML 2.0 SSO',
        detail: 'attached compliance verification document soc2-access-policy-v3.pdf',
        timestamp: new Date(Date.now() - 3 * 86400000).toISOString()
      },
      {
        id: 'act-4',
        userId: 'user-2',
        action: 'moved_task',
        taskId: 'task-102',
        taskTitle: 'Implement swipe gesture handlers and fluid bottom sheet physics',
        detail: 'moved from In Progress to Review',
        timestamp: new Date(Date.now() - 1 * 86400000).toISOString()
      },
      {
        id: 'act-5',
        userId: 'user-5',
        action: 'commented',
        taskId: 'task-203',
        taskTitle: 'Investigate Redis heartbeat pool socket handle leak',
        detail: 'posted 48h soak benchmark validation results',
        timestamp: new Date(Date.now() - 1 * 86400000).toISOString()
      }
    ];

    return {
      workspace: {
        name: 'CloudScale Networks Inc.',
        plan: 'Enterprise Tier',
        logo: 'cloudscale'
      },
      currentUserId: 'user-1',
      activeProjectId: 'all',
      activeView: 'dashboard',
      theme: 'dark',
      users,
      labels,
      projects,
      tasks,
      activities,
      filters: {
        search: '',
        assigneeId: '',
        priority: '',
        status: '',
        labelId: '',
        dueDate: ''
      }
    };
  }
};
