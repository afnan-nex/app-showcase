/**
 * NoteSpace - Default Starter Workspace Data
 * Generates realistic, professional production workspace content with zero generic placeholder text.
 */

export function generateStarterWorkspace() {
  const now = Date.now();

  const welcomePageId = 'page-welcome';
  const roadmapPageId = 'page-roadmap';
  const handbookPageId = 'page-handbook';
  const archSubpageId = 'page-handbook-arch';
  const guideSubpageId = 'page-handbook-guide';
  const feedbackPageId = 'page-feedback';
  const weeklyPageId = 'page-weekly';

  const roadmapDbId = 'db-roadmap-1';
  const feedbackDbId = 'db-feedback-1';

  const defaultPages = [
    // 1. Welcome Page (Interactive Tutorial)
    {
      id: welcomePageId,
      title: '👋 Welcome to NoteSpace',
      icon: '✨',
      cover: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      parentId: null,
      order: 0,
      isFavorite: true,
      isTrash: false,
      createdAt: now - 86400000 * 3,
      updatedAt: now - 3600000 * 2,
      blocks: [
        {
          id: 'b-w-1',
          type: 'callout',
          content: '<strong>NoteSpace</strong> is a local-first workspace for notes, documentation, and agile databases. All your data is stored persistently in your browser with IndexedDB and works 100% offline.',
          metadata: { icon: '💡', color: 'blue' }
        },
        {
          id: 'b-w-2',
          type: 'heading1',
          content: 'Quick Start Checklist'
        },
        {
          id: 'b-w-3',
          type: 'paragraph',
          content: 'Try out these fundamental workflows to get familiar with NoteSpace:'
        },
        {
          id: 'b-w-4',
          type: 'checklist',
          content: 'Press <code>Ctrl + K</code> or <code>Cmd + K</code> to open the Command Palette and global search',
          metadata: { checked: true }
        },
        {
          id: 'b-w-5',
          type: 'checklist',
          content: 'Type <code>/</code> anywhere on an empty line to explore the Slash Command menu',
          metadata: { checked: true }
        },
        {
          id: 'b-w-6',
          type: 'checklist',
          content: 'Highlight any text to reveal the floating formatting bubble (Bold, Code, Colors)',
          metadata: { checked: false }
        },
        {
          id: 'b-w-7',
          type: 'checklist',
          content: 'Check out the <strong>Q3 Product Roadmap</strong> database with Table, Board, and List views',
          metadata: { checked: false }
        },
        {
          id: 'b-w-8',
          type: 'checklist',
          content: 'Try dragging pages in the sidebar to create deep nested folder hierarchies',
          metadata: { checked: false }
        },
        {
          id: 'b-w-9',
          type: 'heading2',
          content: '🛠️ Core Block Types & Syntax'
        },
        {
          id: 'b-w-10',
          type: 'quote',
          content: '"Simplicity is prerequisite for reliability." — Edsger W. Dijkstra'
        },
        {
          id: 'b-w-11',
          type: 'code',
          content: '// NoteSpace Local Database Client\nimport { db } from "./db/idb.js";\n\nconst session = await db.init();\nconsole.log("IndexedDB store ready for instant operations");',
          metadata: { language: 'javascript' }
        },
        {
          id: 'b-w-12',
          type: 'toggle',
          content: '▶ Keyboard Shortcuts Reference',
          metadata: {
            isOpen: false,
            children: '• Press ? or Ctrl+/ for the shortcut modal\n• Press Enter on any block to create a new paragraph\n• Shift+Enter creates a soft break within a block\n• Type # for H1, ## for H2, ### for H3, - for bullet list, 1. for numbered list\n• Ctrl/Cmd+B for bold, Ctrl/Cmd+I for italic, Ctrl/Cmd+E for inline code'
          }
        },
        {
          id: 'b-w-13',
          type: 'table',
          content: '',
          metadata: {
            rows: [
              ['Capability', 'Implementation', 'Status'],
              ['IndexedDB Engine', 'Transaction debouncing with schema versioning', 'Active ✅'],
              ['Database Views', 'Polymorphic Table, Kanban Board, and List layouts', 'Active ✅'],
              ['Global Search', 'Full-text indexing with query mark highlighting', 'Active ✅'],
              ['Snapshot History', 'Automatic revision snapshots with one-click restore', 'Active ✅']
            ]
          }
        },
        {
          id: 'b-w-14',
          type: 'divider',
          content: ''
        },
        {
          id: 'b-w-15',
          type: 'bookmark',
          content: 'https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API',
          metadata: {
            title: 'IndexedDB API — Web APIs | MDN',
            description: 'IndexedDB is a transactional database system for client-side storage of significant amounts of structured data.',
            icon: '🌐'
          }
        }
      ]
    },

    // 2. Product Roadmap & Sprint Database Page
    {
      id: roadmapPageId,
      title: '🚀 Q3 Product Roadmap & Sprint Board',
      icon: '🎯',
      cover: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      parentId: null,
      order: 1,
      isFavorite: true,
      isTrash: false,
      createdAt: now - 86400000 * 2,
      updatedAt: now - 1800000,
      databaseId: roadmapDbId,
      blocks: [
        {
          id: 'b-r-1',
          type: 'callout',
          content: 'Quarterly feature priorities, architectural milestones, and active sprint items. Toggle between <strong>Table</strong>, <strong>Sprint Board (Kanban)</strong>, and <strong>List</strong> views above.',
          metadata: { icon: '📌', color: 'blue' }
        },
        {
          id: 'b-r-2',
          type: 'database',
          content: '',
          metadata: { databaseId: roadmapDbId }
        }
      ]
    },

    // 3. Customer Feedback Database Page
    {
      id: feedbackPageId,
      title: '👥 Customer Feedback & Feature Requests',
      icon: '💬',
      cover: 'linear-gradient(135deg, #1e1e24 0%, #2e2e38 100%)',
      parentId: null,
      order: 2,
      isFavorite: true,
      isTrash: false,
      createdAt: now - 86400000 * 4,
      updatedAt: now - 3600000 * 4,
      databaseId: feedbackDbId,
      blocks: [
        {
          id: 'b-fb-1',
          type: 'callout',
          content: 'Aggregated user sentiment, feature requests from enterprise pilots, and UX improvement logs.',
          metadata: { icon: '📊', color: 'purple' }
        },
        {
          id: 'b-fb-2',
          type: 'database',
          content: '',
          metadata: { databaseId: feedbackDbId }
        }
      ]
    },

    // 4. Engineering Handbook (Parent Page)
    {
      id: handbookPageId,
      title: '📐 System Architecture & Guidelines',
      icon: '🏛️',
      cover: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
      parentId: null,
      order: 3,
      isFavorite: false,
      isTrash: false,
      createdAt: now - 86400000 * 5,
      updatedAt: now - 86400000,
      blocks: [
        {
          id: 'b-h-1',
          type: 'callout',
          content: 'Technical RFC specifications, local-first state patterns, and frontend design conventions.',
          metadata: { icon: '⚡', color: 'green' }
        },
        {
          id: 'b-h-2',
          type: 'heading1',
          content: 'Architectural Philosophy'
        },
        {
          id: 'b-h-3',
          type: 'bulletList',
          content: '<strong>Local-First Guarantee:</strong> Zero blocking network requests for read/write operations.'
        },
        {
          id: 'b-h-4',
          type: 'bulletList',
          content: '<strong>Deterministic Event Dispatch:</strong> State mutations emit granular notifications without full canvas re-renders.'
        },
        {
          id: 'b-h-5',
          type: 'bulletList',
          content: '<strong>Zero Vendor Lock-in:</strong> Complete JSON workspace snapshot export and human-readable Markdown exports.'
        },
        {
          id: 'b-h-6',
          type: 'heading2',
          content: 'Handbook Sections'
        },
        {
          id: 'b-h-7',
          type: 'paragraph',
          content: 'Browse the child pages nested under this handbook in the sidebar to review the Data Sync Protocol and Code Quality Standards.'
        }
      ]
    },

    // 4a. Subpage: Architecture & Sync
    {
      id: archSubpageId,
      title: 'Local-First Data Pipeline RFC',
      icon: '⚙️',
      cover: null,
      parentId: handbookPageId,
      order: 0,
      isFavorite: false,
      isTrash: false,
      createdAt: now - 86400000 * 4,
      updatedAt: now - 86400000 * 2,
      blocks: [
        {
          id: 'b-ha-1',
          type: 'heading1',
          content: 'RFC: Client-Side Transaction Pipeline'
        },
        {
          id: 'b-ha-2',
          type: 'paragraph',
          content: 'This document defines how NoteSpace writes document blocks to IndexedDB with debounced concurrency control.'
        },
        {
          id: 'b-ha-3',
          type: 'numberedList',
          content: '<strong>In-Memory Layer:</strong> Synchronous updates to in-memory Maps for 0ms UI latency.'
        },
        {
          id: 'b-ha-4',
          type: 'numberedList',
          content: '<strong>Debounce Queue:</strong> 400ms timer collapses burst keystrokes into atomic writes.'
        },
        {
          id: 'b-ha-5',
          type: 'numberedList',
          content: '<strong>Snapshot Engine:</strong> Periodically commits immutable history objects for revision diffing.'
        },
        {
          id: 'b-ha-6',
          type: 'code',
          content: 'interface PageDocument {\n  id: string;\n  title: string;\n  blocks: Array<BlockNode>;\n  parentId: string | null;\n  updatedAt: number;\n}',
          metadata: { language: 'typescript' }
        }
      ]
    },

    // 4b. Subpage: Guidelines
    {
      id: guideSubpageId,
      title: 'Frontend Quality Standards',
      icon: '🛡️',
      cover: null,
      parentId: handbookPageId,
      order: 1,
      isFavorite: false,
      isTrash: false,
      createdAt: now - 86400000 * 4,
      updatedAt: now - 86400000,
      blocks: [
        {
          id: 'b-hg-1',
          type: 'heading1',
          content: 'Code & Interaction Standards'
        },
        {
          id: 'b-hg-2',
          type: 'quote',
          content: '"Programs must be written for people to read, and only incidentally for machines to execute."'
        },
        {
          id: 'b-hg-3',
          type: 'checklist',
          content: 'Ensure all dialogs and context menus support Escape key dismiss',
          metadata: { checked: true }
        },
        {
          id: 'b-hg-4',
          type: 'checklist',
          content: 'Maintain clean contrast ratios in both Dark and Light themes',
          metadata: { checked: true }
        },
        {
          id: 'b-hg-5',
          type: 'checklist',
          content: 'Verify drag-and-drop handles do not trigger unwanted text selections',
          metadata: { checked: true }
        }
      ]
    },

    // 5. Weekly Sync Page
    {
      id: weeklyPageId,
      title: '📝 Weekly Engineering Sync — Aug 23',
      icon: '📅',
      cover: null,
      parentId: null,
      order: 4,
      isFavorite: false,
      isTrash: false,
      createdAt: now - 86400000 * 1,
      updatedAt: now - 3600000 * 1,
      blocks: [
        {
          id: 'b-ws-1',
          type: 'callout',
          content: 'Sprint review, release candidate status, and weekly blocker resolution.',
          metadata: { icon: '📋', color: 'blue' }
        },
        {
          id: 'b-ws-2',
          type: 'heading2',
          content: '👥 Attendees'
        },
        {
          id: 'b-ws-3',
          type: 'bulletList',
          content: 'Marcus Vance (Principal Architect)'
        },
        {
          id: 'b-ws-4',
          type: 'bulletList',
          content: 'Elena Rostova (Lead Product Designer)'
        },
        {
          id: 'b-ws-5',
          type: 'bulletList',
          content: 'Devon Park (Senior Frontend Engineer)'
        },
        {
          id: 'b-ws-6',
          type: 'heading2',
          content: '🎯 Completed Milestones'
        },
        {
          id: 'b-ws-7',
          type: 'checklist',
          content: 'IndexedDB persistent transaction pipeline with automatic save indicators',
          metadata: { checked: true }
        },
        {
          id: 'b-ws-8',
          type: 'checklist',
          content: 'Kanban board card drag-and-drop across status columns',
          metadata: { checked: true }
        },
        {
          id: 'b-ws-9',
          type: 'checklist',
          content: 'Full-text search highlighting with keyboard navigation',
          metadata: { checked: true }
        },
        {
          id: 'b-ws-10',
          type: 'checklist',
          content: 'JSON Workspace backup import/export validator',
          metadata: { checked: true }
        }
      ]
    }
  ];

  // 1. Roadmap Database
  const defaultDatabases = [
    {
      id: roadmapDbId,
      title: 'Q3 Product Roadmap & Sprint Items',
      pageId: roadmapPageId,
      currentView: 'table',
      views: [
        { id: 'v1', name: 'Table View', type: 'table' },
        { id: 'v2', name: 'Sprint Board', type: 'board', groupBy: 'prop-status' },
        { id: 'v3', name: 'List View', type: 'list' }
      ],
      filter: { propertyId: 'all', value: '' },
      sort: { propertyId: 'prop-target', direction: 'asc' },
      properties: [
        { id: 'prop-title', name: 'Task / Initiative', type: 'title', width: 240 },
        {
          id: 'prop-status',
          name: 'Status',
          type: 'status',
          width: 140,
          options: [
            { id: 's1', label: 'Not Started', color: 'gray' },
            { id: 's2', label: 'In Progress', color: 'blue' },
            { id: 's3', label: 'In Review', color: 'yellow' },
            { id: 's4', label: 'Completed', color: 'green' }
          ]
        },
        {
          id: 'prop-priority',
          name: 'Priority',
          type: 'select',
          width: 120,
          options: [
            { id: 'p1', label: 'P0 — Critical', color: 'red' },
            { id: 'p2', label: 'P1 — High', color: 'yellow' },
            { id: 'p3', label: 'P2 — Normal', color: 'green' }
          ]
        },
        {
          id: 'prop-tags',
          name: 'Domain',
          type: 'multi-select',
          width: 170,
          options: [
            { id: 't1', label: 'Frontend', color: 'blue' },
            { id: 't2', label: 'Database', color: 'purple' },
            { id: 't3', label: 'UX Design', color: 'pink' },
            { id: 't4', label: 'Performance', color: 'green' }
          ]
        },
        { id: 'prop-target', name: 'Target Date', type: 'date', width: 130 },
        { id: 'prop-hours', name: 'Est. Hours', type: 'number', width: 110 },
        { id: 'prop-done', name: 'QA Verified', type: 'checkbox', width: 100 }
      ],
      rows: [
        {
          id: 'row-1',
          properties: {
            'prop-title': 'Block Drag & Drop Ghost Indicators',
            'prop-status': 'Completed',
            'prop-priority': 'P0 — Critical',
            'prop-tags': ['Frontend', 'UX Design'],
            'prop-target': '2026-08-25',
            'prop-hours': 12,
            'prop-done': true
          },
          contentBlocks: [
            { id: 'rcb-1', type: 'paragraph', content: 'Engineered smooth drag physics and drop indicators without layout jumping.' }
          ]
        },
        {
          id: 'row-2',
          properties: {
            'prop-title': 'IndexedDB Concurrency Engine',
            'prop-status': 'Completed',
            'prop-priority': 'P0 — Critical',
            'prop-tags': ['Database', 'Performance'],
            'prop-target': '2026-08-26',
            'prop-hours': 16,
            'prop-done': true
          },
          contentBlocks: [
            { id: 'rcb-2', type: 'paragraph', content: 'Continuous debounced transactional writes with LocalStorage fallback.' }
          ]
        },
        {
          id: 'row-3',
          properties: {
            'prop-title': 'Polymorphic Kanban Board View',
            'prop-status': 'In Progress',
            'prop-priority': 'P1 — High',
            'prop-tags': ['Frontend', 'UX Design'],
            'prop-target': '2026-08-28',
            'prop-hours': 14,
            'prop-done': false
          },
          contentBlocks: [
            { id: 'rcb-3', type: 'paragraph', content: 'Drag-and-drop card columns with real-time status mutations.' }
          ]
        },
        {
          id: 'row-4',
          properties: {
            'prop-title': 'Global Ctrl+K Command Palette',
            'prop-status': 'In Progress',
            'prop-priority': 'P1 — High',
            'prop-tags': ['Frontend'],
            'prop-target': '2026-08-29',
            'prop-hours': 8,
            'prop-done': false
          },
          contentBlocks: []
        },
        {
          id: 'row-5',
          properties: {
            'prop-title': 'JSON Workspace Backup Validator',
            'prop-status': 'In Review',
            'prop-priority': 'P1 — High',
            'prop-tags': ['Database'],
            'prop-target': '2026-08-30',
            'prop-hours': 6,
            'prop-done': false
          },
          contentBlocks: []
        },
        {
          id: 'row-6',
          properties: {
            'prop-title': 'Revision History & Snapshot Diff',
            'prop-status': 'Not Started',
            'prop-priority': 'P2 — Normal',
            'prop-tags': ['Database', 'Frontend'],
            'prop-target': '2026-09-02',
            'prop-hours': 10,
            'prop-done': false
          },
          contentBlocks: []
        }
      ]
    },

    // 2. Feedback Database
    {
      id: feedbackDbId,
      title: 'Customer Feedback & Insights',
      pageId: feedbackPageId,
      currentView: 'table',
      views: [
        { id: 'fb-v1', name: 'All Feedback', type: 'table' },
        { id: 'fb-v2', name: 'Feedback Board', type: 'board', groupBy: 'prop-fb-status' },
        { id: 'fb-v3', name: 'Compact List', type: 'list' }
      ],
      filter: { propertyId: 'all', value: '' },
      sort: { propertyId: 'prop-fb-score', direction: 'desc' },
      properties: [
        { id: 'prop-title', name: 'Topic / Request', type: 'title', width: 240 },
        {
          id: 'prop-fb-status',
          name: 'Status',
          type: 'status',
          width: 140,
          options: [
            { id: 'fbs1', label: 'Under Review', color: 'yellow' },
            { id: 'fbs2', label: 'Planned', color: 'blue' },
            { id: 'fbs3', label: 'Shipped', color: 'green' }
          ]
        },
        {
          id: 'prop-fb-cat',
          name: 'Category',
          type: 'select',
          width: 130,
          options: [
            { id: 'fbc1', label: 'Editor', color: 'blue' },
            { id: 'fbc2', label: 'Databases', color: 'purple' },
            { id: 'fbc3', label: 'Performance', color: 'green' }
          ]
        },
        { id: 'prop-fb-user', name: 'Account / User', type: 'text', width: 160 },
        { id: 'prop-fb-score', name: 'Satisfaction Score', type: 'number', width: 130 }
      ],
      rows: [
        {
          id: 'fb-row-1',
          properties: {
            'prop-title': 'Instant Markdown export shortcut',
            'prop-fb-status': 'Shipped',
            'prop-fb-cat': 'Editor',
            'prop-fb-user': 'Acme Corp (Sarah L.)',
            'prop-fb-score': 10
          },
          contentBlocks: []
        },
        {
          id: 'fb-row-2',
          properties: {
            'prop-title': 'Support nested tables and formula footers',
            'prop-fb-status': 'Planned',
            'prop-fb-cat': 'Databases',
            'prop-fb-user': 'Starlight Bio (Dr. Chen)',
            'prop-fb-score': 9
          },
          contentBlocks: []
        },
        {
          id: 'fb-row-3',
          properties: {
            'prop-title': 'Dark mode high-contrast option',
            'prop-fb-status': 'Under Review',
            'prop-fb-cat': 'Editor',
            'prop-fb-user': 'Venture Studio (Alex M.)',
            'prop-fb-score': 8
          },
          contentBlocks: []
        }
      ]
    }
  ];

  const defaultSettings = [
    { key: 'theme', value: 'dark' },
    { key: 'fontFamily', value: 'sans' },
    { key: 'fullWidth', value: false },
    { key: 'workspaceName', value: "Acme Workspace" },
    { key: 'workspaceIcon', value: "🪐" },
    { key: 'activePageId', value: welcomePageId },
    { key: 'recentPageIds', value: [welcomePageId, roadmapPageId, feedbackPageId, handbookPageId] }
  ];

  return {
    pages: defaultPages,
    databases: defaultDatabases,
    settings: defaultSettings,
    history: []
  };
}
