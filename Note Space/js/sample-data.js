/**
 * NoteSpace - Production Sample Workspace Dataset
 * Realistic, comprehensive company workspace for "Acme Cloud Infrastructure"
 */
const SampleData = {
  getWorkspace() {
    return {
      id: 'ws_acme_eng',
      name: 'Acme Cloud Infrastructure',
      icon: '⚡',
      createdAt: Date.now() - 86400000 * 14,
      updatedAt: Date.now(),
      plan: 'Enterprise Workspace'
    };
  },

  getAdditionalWorkspaces() {
    return [
      {
        id: 'ws_personal_vault',
        name: 'Personal Research Vault',
        icon: '🧠',
        createdAt: Date.now() - 86400000 * 30,
        updatedAt: Date.now() - 86400000 * 2,
        plan: 'Personal Pro'
      }
    ];
  },

  getPages() {
    const wsId = 'ws_acme_eng';
    const now = Date.now();
    return [
      {
        id: 'page_getting_started',
        workspaceId: wsId,
        parentId: null,
        title: '🚀 Welcome to NoteSpace',
        icon: '🚀',
        cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80',
        isFavorite: true,
        inTrash: false,
        order: 0,
        createdAt: now - 86400000 * 12,
        updatedAt: now,
        fullWidth: false,
        isLocked: false
      },
      {
        id: 'page_sprint_board',
        workspaceId: wsId,
        parentId: null,
        title: '🎯 Sprint 42 — Core Engine & Storage',
        icon: '🎯',
        cover: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1600&auto=format&fit=crop&q=80',
        isFavorite: true,
        inTrash: false,
        order: 1,
        createdAt: now - 86400000 * 10,
        updatedAt: now,
        fullWidth: true,
        isLocked: false,
        isDatabase: true
      },
      {
        id: 'page_eng_handbook',
        workspaceId: wsId,
        parentId: null,
        title: '📐 Engineering Architecture & RFCs',
        icon: '📐',
        cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1600&auto=format&fit=crop&q=80',
        isFavorite: true,
        inTrash: false,
        order: 2,
        createdAt: now - 86400000 * 9,
        updatedAt: now,
        fullWidth: false,
        isLocked: false
      },
      {
        id: 'page_rfc_104',
        workspaceId: wsId,
        parentId: 'page_eng_handbook',
        title: 'RFC-104: Distributed Cache & Event Invalidation',
        icon: '📄',
        cover: null,
        isFavorite: false,
        inTrash: false,
        order: 0,
        createdAt: now - 86400000 * 7,
        updatedAt: now,
        fullWidth: false,
        isLocked: false
      },
      {
        id: 'page_api_spec',
        workspaceId: wsId,
        parentId: 'page_eng_handbook',
        title: '🔌 Edge Gateway API Guidelines v2.4',
        icon: '🔌',
        cover: null,
        isFavorite: false,
        inTrash: false,
        order: 1,
        createdAt: now - 86400000 * 6,
        updatedAt: now,
        fullWidth: false,
        isLocked: false
      },
      {
        id: 'page_incident_postmortem',
        workspaceId: wsId,
        parentId: 'page_eng_handbook',
        title: '🚨 Postmortem: INC-8821 Redis Cluster Failover',
        icon: '🚨',
        cover: null,
        isFavorite: false,
        inTrash: false,
        order: 2,
        createdAt: now - 86400000 * 5,
        updatedAt: now,
        fullWidth: false,
        isLocked: false
      },
      {
        id: 'page_sync_meetings',
        workspaceId: wsId,
        parentId: null,
        title: '🤝 Leadership Sync & 1-on-1s',
        icon: '🤝',
        cover: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1600&auto=format&fit=crop&q=80',
        isFavorite: false,
        inTrash: false,
        order: 3,
        createdAt: now - 86400000 * 4,
        updatedAt: now,
        fullWidth: false,
        isLocked: false
      },
      {
        id: 'page_curated_bookmarks',
        workspaceId: wsId,
        parentId: null,
        title: '📚 Distributed Systems Reading List',
        icon: '📚',
        cover: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1600&auto=format&fit=crop&q=80',
        isFavorite: false,
        inTrash: false,
        order: 4,
        createdAt: now - 86400000 * 3,
        updatedAt: now,
        fullWidth: false,
        isLocked: false
      }
    ];
  },

  getBlocks() {
    return {
      // 1. Welcome Guide Page
      page_getting_started: [
        {
          id: 'b_gs_1',
          type: 'callout',
          content: '<strong>NoteSpace</strong> is an offline-first modular workspace engineered for speed, clean typography, structured nested documentation, and interactive multi-view databases.',
          metadata: { icon: '⚡', color: 'blue' }
        },
        {
          id: 'b_gs_2',
          type: 'paragraph',
          content: 'Everything in NoteSpace is built out of modular blocks. You can write distraction-free notes, design rich technical specifications, track engineering sprints in Kanban boards, and reorganize pages via drag-and-drop.'
        },
        {
          id: 'b_gs_3',
          type: 'h2',
          content: '⚡ Essential Hotkeys & Workflows'
        },
        {
          id: 'b_gs_4',
          type: 'bulletList',
          content: '<strong>Press <code>Ctrl + K</code></strong> (or <code>Cmd + K</code>) to open the <em>Global Search & Action Command Palette</em>.'
        },
        {
          id: 'b_gs_5',
          type: 'bulletList',
          content: '<strong>Type <code>/</code></strong> on an empty line to invoke the <em>Slash Command Menu</em> and insert any block type.'
        },
        {
          id: 'b_gs_6',
          type: 'bulletList',
          content: '<strong>Press <code>Ctrl + \\</code></strong> to quickly collapse or expand the workspace sidebar navigation.'
        },
        {
          id: 'b_gs_7',
          type: 'bulletList',
          content: '<strong>Markdown triggers:</strong> Type <code># </code> for H1, <code>## </code> for H2, <code>### </code> for H3, <code>- </code> for bullet list, <code>1. </code> for numbers, <code>[] </code> for checklist, <code>> </code> for quotes, <code>```</code> for code, <code>---</code> for dividers.'
        },
        {
          id: 'b_gs_8',
          type: 'divider',
          content: '',
          metadata: {}
        },
        {
          id: 'b_gs_9',
          type: 'h2',
          content: '🧩 All Supported Block Components'
        },
        {
          id: 'b_gs_10',
          type: 'quote',
          content: '"Simplicity is prerequisite for reliability. Complex systems always fail in complex ways." — Edsger W. Dijkstra'
        },
        {
          id: 'b_gs_11',
          type: 'checkList',
          content: 'Switch between Board, Table, and List views on the Sprint 42 database',
          metadata: { checked: true }
        },
        {
          id: 'b_gs_12',
          type: 'checkList',
          content: 'Try reordering blocks by dragging their 6-dot hover handle',
          metadata: { checked: false }
        },
        {
          id: 'b_gs_13',
          type: 'checkList',
          content: 'Inspect revision snapshots via the History icon in the top navigation bar',
          metadata: { checked: false }
        },
        {
          id: 'b_gs_14',
          type: 'code',
          content: `// Sample Client-side IndexedDB Transaction
async function saveDocumentSnapshot(pageId, blocks) {
  const tx = db.transaction('blocks', 'readwrite');
  const store = tx.objectStore('blocks');
  
  for (const block of blocks) {
    await store.put({
      id: block.id,
      pageId,
      content: block.content,
      updatedAt: Date.now()
    });
  }
  return tx.complete;
}`,
          metadata: { language: 'javascript' }
        },
        {
          id: 'b_gs_15',
          type: 'toggle',
          content: 'Click here to expand architecture details & offline storage capabilities',
          metadata: {
            open: false,
            body: 'NoteSpace stores all pages, blocks, databases, and revision snapshots directly inside browser IndexedDB storage with automatic LocalStorage fallback. Zero remote server roundtrips are needed to create, edit, or search your notes!'
          }
        },
        {
          id: 'b_gs_16',
          type: 'table',
          content: '',
          metadata: {
            headers: ['Engine Component', 'Latency', 'Storage Backend', 'Status'],
            rows: [
              ['Block Editor Core', '< 2ms', 'DOM Memory', 'Production'],
              ['IndexedDB Persistence', '< 15ms', 'IndexedDB v2', 'Active'],
              ['Kanban & Table Engine', '< 4ms', 'Reactive Store', 'Production'],
              ['Fuzzy Search Indexer', '< 5ms', 'In-memory Inverted Index', 'Active']
            ]
          }
        },
        {
          id: 'b_gs_17',
          type: 'bookmark',
          content: 'Google Antigravity Documentation & SDK',
          metadata: {
            url: 'https://antigravity.google',
            description: 'Agentic coding platform and advanced development environment.',
            site: 'antigravity.google'
          }
        }
      ],

      // 2. Engineering RFC Handbook
      page_eng_handbook: [
        {
          id: 'b_eh_1',
          type: 'callout',
          content: 'Official repository of architecture decision records (ADRs), requests for comments (RFCs), and incident postmortems for Acme Cloud Platform.',
          metadata: { icon: '📐', color: 'emerald' }
        },
        {
          id: 'b_eh_2',
          type: 'h2',
          content: 'Core System Topology & Principles'
        },
        {
          id: 'b_eh_3',
          type: 'paragraph',
          content: 'Our services adhere to zero-trust network policies, asynchronous event streaming over Kafka, and sub-10ms edge caching across all global points of presence.'
        },
        {
          id: 'b_eh_4',
          type: 'code',
          content: `+-------------------------------------------------------------+
|                     Edge Anycast Network                    |
|           [Cloudflare CDN]  <-->  [Envoy Gateway]           |
+------------------------------+------------------------------+
                               | mTLS gRPC
+------------------------------v------------------------------+
|               Microservice Mesh (Kubernetes)                |
|  [Auth Service]   [Document Engine]   [Storage Orchestrator] |
+------------------------------+------------------------------+
                               | Event Bus
+------------------------------v------------------------------+
|              Persistent Tier & Cache Clusters                |
|      [PostgreSQL 16 HA]  <-->  [Redis Cluster 7.2]          |
+-------------------------------------------------------------+`,
          metadata: { language: 'plaintext' }
        },
        {
          id: 'b_eh_5',
          type: 'h3',
          content: 'Active Working RFCs'
        },
        {
          id: 'b_eh_6',
          type: 'bulletList',
          content: '<strong>RFC-104:</strong> Distributed Cache & Event Invalidation (Lead: Dr. Elena Rostova).'
        },
        {
          id: 'b_eh_7',
          type: 'bulletList',
          content: '<strong>API Spec v2.4:</strong> Edge Gateway Protocol Standards (Lead: Marcus Vance).'
        },
        {
          id: 'b_eh_8',
          type: 'bulletList',
          content: '<strong>INC-8821:</strong> Root cause analysis on Redis failover timeout.'
        }
      ],

      // 3. RFC-104 Document
      page_rfc_104: [
        {
          id: 'b_rfc_1',
          type: 'callout',
          content: '<strong>RFC Status: APPROVED</strong> | Target Deployment: Sprint 43 | Authors: Elena Rostova (Platform), David Chen (Storage)',
          metadata: { icon: '📄', color: 'purple' }
        },
        {
          id: 'b_rfc_2',
          type: 'h1',
          content: 'RFC-104: Tiered Caching with Kafka Invalidation'
        },
        {
          id: 'b_rfc_3',
          type: 'paragraph',
          content: 'This document proposes replacing our existing time-to-live (TTL) polling mechanism with an event-driven pub/sub invalidation bus using Kafka topics partitioned by workspace ID.'
        },
        {
          id: 'b_rfc_4',
          type: 'h2',
          content: 'Target SLA Metrics'
        },
        {
          id: 'b_rfc_5',
          type: 'table',
          content: '',
          metadata: {
            headers: ['Metric', 'Current (TTL)', 'Proposed (Event-driven)', 'Improvement'],
            rows: [
              ['p99 Read Latency', '42ms', '4.2ms', '10x Faster'],
              ['Cache Invalidation Delay', '300s', '< 80ms', '3,750x Faster'],
              ['Database Query Load', '14,200 QPS', '1,800 QPS', '87% Reduction']
            ]
          }
        },
        {
          id: 'b_rfc_6',
          type: 'h2',
          content: 'Event Payload Format'
        },
        {
          id: 'b_rfc_7',
          type: 'code',
          content: `{
  "eventId": "evt_9021849182",
  "workspaceId": "ws_acme_eng",
  "entityType": "document",
  "entityId": "page_sprint_board",
  "action": "INVALIDATE",
  "timestamp": 1787498400000,
  "nodeOrigin": "us-east-cluster-04"
}`,
          metadata: { language: 'json' }
        }
      ],

      // 4. API Guidelines
      page_api_spec: [
        {
          id: 'b_api_1',
          type: 'h1',
          content: 'Edge Gateway API Design Conventions'
        },
        {
          id: 'b_api_2',
          type: 'paragraph',
          content: 'All external REST and GraphQL endpoints must adhere to standard HTTP semantics, strict JSON Schema contract validations, and ISO 8601 UTC timestamps.'
        },
        {
          id: 'b_api_3',
          type: 'code',
          content: `// Standard Success Response
{
  "data": {
    "id": "doc_9920",
    "title": "Quarterly Platform Review",
    "version": 4,
    "createdAt": "2026-08-23T12:00:00Z"
  },
  "meta": {
    "traceId": "req_881920_iad",
    "durationMs": 3.8
  }
}`,
          metadata: { language: 'json' }
        },
        {
          id: 'b_api_4',
          type: 'callout',
          content: 'All mutating requests (POST, PUT, DELETE, PATCH) MUST supply an <code>Idempotency-Key</code> header to avoid duplicate execution during network retries.',
          metadata: { icon: '🛡️', color: 'amber' }
        }
      ],

      // 5. Incident Postmortem
      page_incident_postmortem: [
        {
          id: 'b_inc_1',
          type: 'callout',
          content: '<strong>INC-8821 Incident Severity: SEV-1</strong> | Duration: 14 minutes | Financial Impact: $0 | Data Loss: None',
          metadata: { icon: '🚨', color: 'rose' }
        },
        {
          id: 'b_inc_2',
          type: 'h2',
          content: 'Incident Summary & Timeline'
        },
        {
          id: 'b_inc_3',
          type: 'paragraph',
          content: 'On August 18 at 14:22 UTC, primary Redis replica node `node-03` experienced network partition jitter during cloud provider maintenance. Sentinels triggered automatic failover, but heartbeat timeout thresholds were set too aggressively at 800ms.'
        },
        {
          id: 'b_inc_4',
          type: 'h3',
          content: 'Corrective Action Items'
        },
        {
          id: 'b_inc_5',
          type: 'checkList',
          content: 'Adjust Sentinel quorum timeout to 3,500ms (Completed by Marcus Vance)',
          metadata: { checked: true }
        },
        {
          id: 'b_inc_6',
          type: 'checkList',
          content: 'Add automated chaos engineering test simulating pod network delay (In Progress)',
          metadata: { checked: true }
        },
        {
          id: 'b_inc_7',
          type: 'checkList',
          content: 'Update cluster dashboard alerts in Grafana with proactive jitter warnings',
          metadata: { checked: false }
        }
      ],

      // 6. Leadership Sync
      page_sync_meetings: [
        {
          id: 'b_mn_1',
          type: 'callout',
          content: 'Weekly Platform Engineering Alignment | Attendees: Priya Nair (VP Eng), Elena Rostova (Staff Architect), Marcus Vance (Infra Lead), Sarah Lin (Product)',
          metadata: { icon: '🤝', color: 'purple' }
        },
        {
          id: 'b_mn_2',
          type: 'h2',
          content: 'Sprint 42 Review & Highlights'
        },
        {
          id: 'b_mn_3',
          type: 'bulletList',
          content: '<strong>Core Editor:</strong> Seamless block drag-and-drop reordering with full keyboard shortcut coverage is completed.'
        },
        {
          id: 'b_mn_4',
          type: 'bulletList',
          content: '<strong>IndexedDB Persistence:</strong> Offline autosave sync engine completed with 0 data loss under stress testing.'
        },
        {
          id: 'b_mn_5',
          type: 'bulletList',
          content: '<strong>Multi-view Databases:</strong> Kanban Board, Table Grid, and Checklist views are fully reactive.'
        },
        {
          id: 'b_mn_6',
          type: 'h3',
          content: 'Agreed Deliverables for Next Milestone'
        },
        {
          id: 'b_mn_7',
          type: 'checkList',
          content: 'Elena: Present RFC-104 cache invalidation benchmarks to Architecture Board',
          metadata: { checked: true }
        },
        {
          id: 'b_mn_8',
          type: 'checkList',
          content: 'Marcus: Finalize CI/CD bundle size automation (<120KB gzip budget)',
          metadata: { checked: true }
        },
        {
          id: 'b_mn_9',
          type: 'checkList',
          content: 'Sarah: Complete user walkthrough video for NoteSpace knowledge workspace',
          metadata: { checked: false }
        }
      ],

      // 7. Curated Reading List
      page_curated_bookmarks: [
        {
          id: 'b_rl_1',
          type: 'h1',
          content: 'Distributed Systems & Engineering Knowledge Hub'
        },
        {
          id: 'b_rl_2',
          type: 'paragraph',
          content: 'Essential references, books, and benchmark whitepapers for platform engineers and system designers.'
        },
        {
          id: 'b_rl_3',
          type: 'bookmark',
          content: 'Designing Data-Intensive Applications — Martin Kleppmann',
          metadata: {
            url: 'https://dataintensive.net',
            description: 'The fundamental principles of data storage, replication, consensus, and fault tolerance.',
            site: 'dataintensive.net'
          }
        },
        {
          id: 'b_rl_4',
          type: 'bookmark',
          content: 'Raft Consensus Algorithm Visualization & Specification',
          metadata: {
            url: 'https://raft.github.io',
            description: 'Understandable distributed consensus for replicated state machines.',
            site: 'raft.github.io'
          }
        },
        {
          id: 'b_rl_5',
          type: 'bookmark',
          content: 'Refactoring UI — Adam Wathan & Steve Schoger',
          metadata: {
            url: 'https://refactoringui.com',
            description: 'Practical design advice for building clean, modern, and accessible software interfaces.',
            site: 'refactoringui.com'
          }
        }
      ]
    };
  },

  getDatabases() {
    return [
      {
        id: 'db_roadmap',
        pageId: 'page_sprint_board',
        title: 'Sprint 42 Tasks & Deliverables',
        viewType: 'board', // 'board' | 'table' | 'list'
        properties: [
          { id: 'prop_title', name: 'Task Name', type: 'title' },
          { 
            id: 'prop_status', 
            name: 'Status', 
            type: 'status', 
            options: [
              { id: 'opt_backlog', label: 'Backlog', color: 'gray' },
              { id: 'opt_in_progress', label: 'In Progress', color: 'blue' },
              { id: 'opt_review', label: 'In Review', color: 'amber' },
              { id: 'opt_done', label: 'Completed', color: 'green' }
            ] 
          },
          { 
            id: 'prop_priority', 
            name: 'Priority', 
            type: 'select', 
            options: [
              { id: 'opt_p0', label: 'High (P0)', color: 'red' },
              { id: 'opt_p1', label: 'Medium (P1)', color: 'amber' },
              { id: 'opt_p2', label: 'Low (P2)', color: 'gray' }
            ] 
          },
          { 
            id: 'prop_assignee', 
            name: 'Assignee', 
            type: 'select', 
            options: [
              { id: 'opt_elena', label: 'Elena Rostova', color: 'purple' },
              { id: 'opt_marcus', label: 'Marcus Vance', color: 'blue' },
              { id: 'opt_chen', label: 'David Chen', color: 'emerald' },
              { id: 'opt_sarah', label: 'Sarah Lin', color: 'pink' }
            ] 
          },
          { 
            id: 'prop_tags', 
            name: 'Tags', 
            type: 'multi-select', 
            options: [
              { id: 'opt_frontend', label: 'Frontend', color: 'purple' },
              { id: 'opt_engine', label: 'Engine', color: 'blue' },
              { id: 'opt_infra', label: 'Infrastructure', color: 'emerald' },
              { id: 'opt_storage', label: 'Storage', color: 'amber' }
            ] 
          },
          { id: 'prop_due', name: 'Due Date', type: 'date' },
          { id: 'prop_effort', name: 'Story Points', type: 'number' },
          { id: 'prop_done', name: 'Done', type: 'checkbox' }
        ],
        rows: [
          {
            id: 'row_1',
            order: 0,
            values: {
              prop_title: 'Full Block Editor Engine & Slash Menu',
              prop_status: 'opt_done',
              prop_priority: 'opt_p0',
              prop_assignee: 'opt_elena',
              prop_tags: ['opt_frontend', 'opt_engine'],
              prop_due: '2026-08-20',
              prop_effort: 8,
              prop_done: true
            }
          },
          {
            id: 'row_2',
            order: 1,
            values: {
              prop_title: 'Multi-view Databases (Board, Table, List)',
              prop_status: 'opt_done',
              prop_priority: 'opt_p0',
              prop_assignee: 'opt_marcus',
              prop_tags: ['opt_frontend', 'opt_engine'],
              prop_due: '2026-08-21',
              prop_effort: 8,
              prop_done: true
            }
          },
          {
            id: 'row_3',
            order: 2,
            values: {
              prop_title: 'IndexedDB Continuous Autosave & Offline Sync',
              prop_status: 'opt_done',
              prop_priority: 'opt_p0',
              prop_assignee: 'opt_chen',
              prop_tags: ['opt_storage', 'opt_engine'],
              prop_due: '2026-08-22',
              prop_effort: 5,
              prop_done: true
            }
          },
          {
            id: 'row_4',
            order: 3,
            values: {
              prop_title: 'Global Search (Ctrl+K) with Content Highlighting',
              prop_status: 'opt_in_progress',
              prop_priority: 'opt_p0',
              prop_assignee: 'opt_elena',
              prop_tags: ['opt_frontend'],
              prop_due: '2026-08-25',
              prop_effort: 5,
              prop_done: false
            }
          },
          {
            id: 'row_5',
            order: 4,
            values: {
              prop_title: 'Page Revision History & Snapshot Restore Engine',
              prop_status: 'opt_review',
              prop_priority: 'opt_p1',
              prop_assignee: 'opt_chen',
              prop_tags: ['opt_storage'],
              prop_due: '2026-08-26',
              prop_effort: 4,
              prop_done: false
            }
          },
          {
            id: 'row_6',
            order: 5,
            values: {
              prop_title: 'Workspace JSON & Markdown Import/Export Validator',
              prop_status: 'opt_in_progress',
              prop_priority: 'opt_p1',
              prop_assignee: 'opt_marcus',
              prop_tags: ['opt_engine', 'opt_infra'],
              prop_due: '2026-08-27',
              prop_effort: 3,
              prop_done: false
            }
          },
          {
            id: 'row_7',
            order: 6,
            values: {
              prop_title: 'Customizable Dark/Light/Sepia Themes & Font Switcher',
              prop_status: 'opt_done',
              prop_priority: 'opt_p1',
              prop_assignee: 'opt_sarah',
              prop_tags: ['opt_frontend'],
              prop_due: '2026-08-22',
              prop_effort: 3,
              prop_done: true
            }
          },
          {
            id: 'row_8',
            order: 7,
            values: {
              prop_title: 'Interactive CSV Data Export for Table Views',
              prop_status: 'opt_backlog',
              prop_priority: 'opt_p2',
              prop_assignee: 'opt_sarah',
              prop_tags: ['opt_frontend', 'opt_storage'],
              prop_due: '2026-09-02',
              prop_effort: 2,
              prop_done: false
            }
          }
        ],
        filters: [],
        sorts: [{ propertyId: 'prop_order', direction: 'asc' }],
        groupBy: 'prop_status'
      }
    ];
  }
};

window.SampleData = SampleData;
