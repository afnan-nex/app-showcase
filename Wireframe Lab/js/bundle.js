/* ==========================================================================
   WIREFRAMELAB - COMPLETE PRODUCTION BUNDLE
   Zero-dependency, works over file:// and http/https seamlessly
   ========================================================================== */

(function () {
  'use strict';

  // ==========================================================================
  // 1. DATA MODELS & PRESETS
  // ==========================================================================
  function generateId(prefix = 'wf') {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
  }

  const ARTBOARD_PRESETS = {
    desktop: { name: 'Desktop HD', width: 1440, height: 900, category: 'Desktop' },
    desktop_sm: { name: 'Desktop (1280)', width: 1280, height: 800, category: 'Desktop' },
    macbook: { name: 'MacBook Pro', width: 1512, height: 982, category: 'Desktop' },
    tablet: { name: 'iPad / Tablet', width: 768, height: 1024, category: 'Tablet' },
    mobile: { name: 'iPhone 15 / 16', width: 393, height: 852, category: 'Mobile' },
    mobile_sm: { name: 'Android Mobile', width: 360, height: 800, category: 'Mobile' },
    watch: { name: 'Apple Watch', width: 198, height: 242, category: 'Watch' }
  };

  const DEFAULT_STYLES = {
    fill: '#ffffff',
    stroke: '#1f2937',
    strokeWidth: 1,
    strokeStyle: 'solid',
    borderRadius: 4,
    opacity: 1,
    shadow: false,
    fontSize: 14,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: '400',
    textAlign: 'left',
    textColor: '#1f2937',
    lineHeight: 1.4
  };

  const DEFAULT_CONSTRAINTS = {
    horizontal: 'left',
    vertical: 'top'
  };

  const COMPONENT_DEFINITIONS = [
    {
      type: 'text',
      name: 'Headline',
      category: 'Typography',
      icon: 'type',
      defaultWidth: 320,
      defaultHeight: 40,
      defaultProps: {
        text: 'Global Edge Observability',
        variant: 'heading-2'
      },
      defaultStyles: {
        ...DEFAULT_STYLES,
        fill: 'transparent',
        stroke: 'transparent',
        strokeWidth: 0,
        fontSize: 22,
        fontWeight: '700'
      }
    },
    {
      type: 'paragraph',
      name: 'Paragraph Block',
      category: 'Typography',
      icon: 'align-left',
      defaultWidth: 360,
      defaultHeight: 70,
      defaultProps: {
        text: 'Continuous telemetry stream with automated anomaly detection across all active Anycast edge regions and compute nodes.',
        variant: 'paragraph'
      },
      defaultStyles: {
        ...DEFAULT_STYLES,
        fill: 'transparent',
        stroke: 'transparent',
        strokeWidth: 0,
        fontSize: 13,
        textColor: '#4b5563',
        lineHeight: 1.5
      }
    },
    {
      type: 'button',
      name: 'Button',
      category: 'Basic Inputs',
      icon: 'square',
      defaultWidth: 130,
      defaultHeight: 38,
      defaultProps: {
        label: 'Deploy Service',
        variant: 'primary',
        icon: ''
      },
      defaultStyles: {
        ...DEFAULT_STYLES,
        fill: '#1f2937',
        stroke: '#1f2937',
        borderRadius: 6,
        textColor: '#ffffff',
        fontSize: 13,
        fontWeight: '600'
      }
    },
    {
      type: 'input',
      name: 'Search / Text Input',
      category: 'Basic Inputs',
      icon: 'edit-3',
      defaultWidth: 260,
      defaultHeight: 38,
      defaultProps: {
        placeholder: 'Search services, logs, or metrics...',
        value: '',
        inputType: 'text',
        icon: ''
      },
      defaultStyles: {
        ...DEFAULT_STYLES,
        fill: '#ffffff',
        stroke: '#9ca3af',
        borderRadius: 6,
        textColor: '#1f2937',
        fontSize: 13
      }
    },
    {
      type: 'textarea',
      name: 'Textarea Field',
      category: 'Basic Inputs',
      icon: 'file-text',
      defaultWidth: 300,
      defaultHeight: 90,
      defaultProps: {
        placeholder: 'Add deployment notes or environment variables (KEY=VALUE)...',
        value: ''
      },
      defaultStyles: {
        ...DEFAULT_STYLES,
        fill: '#ffffff',
        stroke: '#9ca3af',
        borderRadius: 6,
        textColor: '#1f2937',
        fontSize: 13
      }
    },
    {
      type: 'image',
      name: 'Media Placeholder',
      category: 'Content & Display',
      icon: 'image',
      defaultWidth: 280,
      defaultHeight: 170,
      defaultProps: {
        label: 'Architecture Topology Map (16:9)'
      },
      defaultStyles: {
        ...DEFAULT_STYLES,
        fill: '#e5e7eb',
        stroke: '#d1d5db',
        borderRadius: 6
      }
    },
    {
      type: 'card',
      name: 'Content Card',
      category: 'Layout & Containers',
      icon: 'layout',
      defaultWidth: 320,
      defaultHeight: 240,
      defaultProps: {
        title: 'Serverless Functions',
        body: 'Instant cold-starts under 8ms with automated regional replication and TLS certificates provisioned on-the-fly.',
        hasImage: true,
        hasActions: true,
        actionText: 'Configure Runtime'
      },
      defaultStyles: {
        ...DEFAULT_STYLES,
        fill: '#ffffff',
        stroke: '#e5e7eb',
        borderRadius: 8,
        shadow: true
      }
    },
    {
      type: 'navbar',
      name: 'Top Navigation Bar',
      category: 'Navigation',
      icon: 'menu',
      defaultWidth: 900,
      defaultHeight: 60,
      defaultProps: {
        brand: 'Apex Cloud',
        links: ['Edge Compute', 'Databases', 'DNS & SSL', 'Metrics', 'Docs'],
        activeLink: 'Edge Compute',
        hasCTA: true,
        ctaText: 'Deploy Now'
      },
      defaultStyles: {
        ...DEFAULT_STYLES,
        fill: '#ffffff',
        stroke: '#e5e7eb',
        borderRadius: 0
      }
    },
    {
      type: 'sidebar',
      name: 'Sidebar Navigation',
      category: 'Navigation',
      icon: 'sidebar',
      defaultWidth: 220,
      defaultHeight: 600,
      defaultProps: {
        title: 'Apex Cloud',
        items: ['Overview', 'Edge Compute', 'Databases', 'DNS & SSL', 'Audit Logs', 'Settings'],
        activeIndex: 1
      },
      defaultStyles: {
        ...DEFAULT_STYLES,
        fill: '#f9fafb',
        stroke: '#e5e7eb',
        borderRadius: 0
      }
    },
    {
      type: 'modal',
      name: 'Modal Dialog',
      category: 'Layout & Containers',
      icon: 'maximize-2',
      defaultWidth: 440,
      defaultHeight: 250,
      defaultProps: {
        title: 'Promote Canary Release v2.4.0',
        message: 'Promoting this build will route 100% of production traffic across all 310 global edge PoPs. Zero downtime rolling update is guaranteed.',
        confirmText: 'Promote to Production',
        cancelText: 'Cancel'
      },
      defaultStyles: {
        ...DEFAULT_STYLES,
        fill: '#ffffff',
        stroke: '#d1d5db',
        borderRadius: 8,
        shadow: true
      }
    },
    {
      type: 'checkbox',
      name: 'Checkbox Option',
      category: 'Basic Inputs',
      icon: 'check-square',
      defaultWidth: 260,
      defaultHeight: 28,
      defaultProps: {
        label: 'Enforce WebAuthn hardware token (FIDO2)',
        checked: true
      },
      defaultStyles: {
        ...DEFAULT_STYLES,
        fill: 'transparent',
        stroke: 'transparent'
      }
    },
    {
      type: 'radio',
      name: 'Radio Selection',
      category: 'Basic Inputs',
      icon: 'disc',
      defaultWidth: 220,
      defaultHeight: 28,
      defaultProps: {
        label: 'Production Anycast (310 PoPs)',
        checked: true
      },
      defaultStyles: {
        ...DEFAULT_STYLES,
        fill: 'transparent',
        stroke: 'transparent'
      }
    },
    {
      type: 'tabs',
      name: 'Tab Header Bar',
      category: 'Navigation',
      icon: 'sliders',
      defaultWidth: 420,
      defaultHeight: 40,
      defaultProps: {
        tabs: ['Overview', 'Traffic Logs', 'Performance (p99)', 'Security & SSL', 'Settings'],
        activeIndex: 0
      },
      defaultStyles: {
        ...DEFAULT_STYLES,
        fill: 'transparent',
        stroke: '#e5e7eb'
      }
    },
    {
      type: 'dropdown',
      name: 'Select Dropdown',
      category: 'Basic Inputs',
      icon: 'chevron-down',
      defaultWidth: 240,
      defaultHeight: 38,
      defaultProps: {
        label: 'US-East (N. Virginia)',
        options: ['US-East (N. Virginia)', 'US-West (Oregon)', 'EU-Central (Frankfurt)', 'AP-East (Tokyo)']
      },
      defaultStyles: {
        ...DEFAULT_STYLES,
        fill: '#ffffff',
        stroke: '#9ca3af',
        borderRadius: 6
      }
    },
    {
      type: 'table',
      name: 'Service Data Table',
      category: 'Content & Display',
      icon: 'grid',
      defaultWidth: 580,
      defaultHeight: 220,
      defaultProps: {
        headers: ['Service Name', 'Environment', 'Version', 'Latency (p99)', 'Status', 'Action'],
        rows: [
          ['auth-gateway', 'Production', 'v2.4.1', '8.4ms', 'Healthy', 'Manage'],
          ['payment-orchestrator', 'Production', 'v1.9.0', '12.1ms', 'Healthy', 'Manage'],
          ['event-stream-sink', 'Production', 'v3.0.2', '4.2ms', 'Healthy', 'Manage'],
          ['metrics-aggregator', 'Production', 'v2.1.0', '6.8ms', 'Healthy', 'Manage']
        ]
      },
      defaultStyles: {
        ...DEFAULT_STYLES,
        fill: '#ffffff',
        stroke: '#e5e7eb',
        borderRadius: 6
      }
    },
    {
      type: 'avatar',
      name: 'User Avatar',
      category: 'Content & Display',
      icon: 'user',
      defaultWidth: 42,
      defaultHeight: 42,
      defaultProps: {
        initials: 'ER'
      },
      defaultStyles: {
        ...DEFAULT_STYLES,
        fill: '#1f2937',
        stroke: '#ffffff',
        strokeWidth: 2,
        borderRadius: 999,
        textColor: '#ffffff',
        fontSize: 13,
        fontWeight: '600'
      }
    },
    {
      type: 'divider',
      name: 'Section Divider',
      category: 'Layout & Containers',
      icon: 'minus',
      defaultWidth: 320,
      defaultHeight: 20,
      defaultProps: {
        label: 'OR CONTINUE WITH OKTA SSO'
      },
      defaultStyles: {
        ...DEFAULT_STYLES,
        fill: 'transparent',
        stroke: '#e5e7eb'
      }
    },
    {
      type: 'toggle',
      name: 'Toggle Switch',
      category: 'Basic Inputs',
      icon: 'toggle-right',
      defaultWidth: 200,
      defaultHeight: 28,
      defaultProps: {
        label: 'Automated TLS Certificate Renewal',
        checked: true
      },
      defaultStyles: {
        ...DEFAULT_STYLES,
        fill: 'transparent',
        stroke: 'transparent'
      }
    },
    {
      type: 'chip',
      name: 'Status Badge / Chip',
      category: 'Content & Display',
      icon: 'tag',
      defaultWidth: 100,
      defaultHeight: 26,
      defaultProps: {
        label: 'Production v2.4'
      },
      defaultStyles: {
        ...DEFAULT_STYLES,
        fill: '#f3f4f6',
        stroke: '#d1d5db',
        borderRadius: 13,
        textColor: '#1f2937',
        fontSize: 11
      }
    },
    {
      type: 'breadcrumbs',
      name: 'Breadcrumbs Path',
      category: 'Navigation',
      icon: 'chevrons-right',
      defaultWidth: 320,
      defaultHeight: 24,
      defaultProps: {
        items: ['Workspace', 'Apex Cluster US-East', 'Service Config']
      },
      defaultStyles: {
        ...DEFAULT_STYLES,
        fill: 'transparent',
        stroke: 'transparent'
      }
    },
    {
      type: 'pagination',
      name: 'Pagination Controls',
      category: 'Navigation',
      icon: 'more-horizontal',
      defaultWidth: 240,
      defaultHeight: 32,
      defaultProps: {
        current: 2,
        total: 6
      },
      defaultStyles: {
        ...DEFAULT_STYLES,
        fill: 'transparent',
        stroke: 'transparent'
      }
    },
    {
      type: 'slider',
      name: 'Range Slider',
      category: 'Basic Inputs',
      icon: 'sliders',
      defaultWidth: 220,
      defaultHeight: 24,
      defaultProps: {
        value: 75,
        min: 0,
        max: 100
      },
      defaultStyles: {
        ...DEFAULT_STYLES,
        fill: 'transparent',
        stroke: 'transparent'
      }
    },
    {
      type: 'alert',
      name: 'Status Alert Banner',
      category: 'Feedback & Data',
      icon: 'alert-circle',
      defaultWidth: 400,
      defaultHeight: 56,
      defaultProps: {
        title: 'Canary Rollout Active',
        message: '20% of live traffic routed to v2.4.1 build. Error rate: 0.00% across all edge nodes.',
        variant: 'info'
      },
      defaultStyles: {
        ...DEFAULT_STYLES,
        fill: '#f9fafb',
        stroke: '#e5e7eb',
        borderRadius: 6
      }
    },
    {
      type: 'chart',
      name: 'Throughput Chart Skeleton',
      category: 'Feedback & Data',
      icon: 'bar-chart-2',
      defaultWidth: 300,
      defaultHeight: 180,
      defaultProps: {
        title: 'Edge Request Volume (req/sec)',
        chartType: 'bar'
      },
      defaultStyles: {
        ...DEFAULT_STYLES,
        fill: '#ffffff',
        stroke: '#e5e7eb',
        borderRadius: 6
      }
    },
    {
      type: 'video',
      name: 'Video Player',
      category: 'Content & Display',
      icon: 'video',
      defaultWidth: 340,
      defaultHeight: 190,
      defaultProps: {
        label: 'Live Architecture Walkthrough (03:42)'
      },
      defaultStyles: {
        ...DEFAULT_STYLES,
        fill: '#1f2937',
        stroke: '#111827',
        borderRadius: 6
      }
    },
    {
      type: 'box',
      name: 'Container Box',
      category: 'Layout & Containers',
      icon: 'square',
      defaultWidth: 200,
      defaultHeight: 140,
      defaultProps: {},
      defaultStyles: {
        ...DEFAULT_STYLES,
        fill: '#ffffff',
        stroke: '#1f2937',
        strokeWidth: 1,
        borderRadius: 4
      }
    }
  ];

  function createNewProject(name = 'Untitled Project') {
    const defaultArtboardId = generateId('ab');
    return {
      id: generateId('proj'),
      name: name,
      version: '1.0',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      activePageId: 'page_1',
      pages: [
        {
          id: 'page_1',
          name: 'Page 1',
          artboards: [
            {
              id: defaultArtboardId,
              name: 'Desktop — 1440 × 900',
              preset: 'desktop',
              x: 100,
              y: 80,
              width: 1440,
              height: 900,
              background: '#ffffff',
              locked: false,
              hidden: false
            }
          ],
          objects: []
        }
      ]
    };
  }

  function createObjectFromType(type, customProps = {}, customStyles = {}) {
    const def = COMPONENT_DEFINITIONS.find(c => c.type === type) || COMPONENT_DEFINITIONS.find(c => c.type === 'box');
    return {
      id: generateId('obj'),
      type: def.type,
      name: def.name,
      artboardId: null,
      parentId: null,
      x: 0,
      y: 0,
      width: def.defaultWidth,
      height: def.defaultHeight,
      rotation: 0,
      zIndex: 1,
      locked: false,
      hidden: false,
      styles: { ...def.defaultStyles, ...customStyles },
      props: { ...def.defaultProps, ...customProps },
      constraints: { ...DEFAULT_CONSTRAINTS },
      prototype: {
        targetArtboardId: null,
        trigger: 'click',
        animation: 'instant'
      }
    };
  }

  // ==========================================================================
  // 2. INDEXEDDB PERSISTENCE LAYER
  // ==========================================================================
  const DB_NAME = 'WireframeLabDB';
  const DB_VERSION = 1;
  const STORE_PROJECTS = 'projects';
  const STORE_SETTINGS = 'settings';
  let dbInstance = null;

  async function initDB() {
    if (dbInstance) return dbInstance;
    return new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(STORE_PROJECTS)) {
            db.createObjectStore(STORE_PROJECTS, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
            db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
          }
        };
        request.onsuccess = (event) => {
          dbInstance = event.target.result;
          resolve(dbInstance);
        };
        request.onerror = (event) => {
          resolve(null);
        };
      } catch (e) {
        resolve(null);
      }
    });
  }

  async function saveProject(project) {
    project.updatedAt = Date.now();
    try {
      const db = await initDB();
      if (db) {
        return new Promise((resolve) => {
          const tx = db.transaction(STORE_PROJECTS, 'readwrite');
          const store = tx.objectStore(STORE_PROJECTS);
          store.put(project);
          tx.oncomplete = () => resolve(project);
          tx.onerror = () => resolve(project);
        });
      }
    } catch (err) {}
    try {
      localStorage.setItem(`wf_proj_${project.id}`, JSON.stringify(project));
    } catch (e) {}
    return project;
  }

  async function getProject(id) {
    try {
      const db = await initDB();
      if (db) {
        return new Promise((resolve) => {
          const tx = db.transaction(STORE_PROJECTS, 'readonly');
          const store = tx.objectStore(STORE_PROJECTS);
          const req = store.get(id);
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => resolve(null);
        });
      }
    } catch (err) {}
    const data = localStorage.getItem(`wf_proj_${id}`);
    return data ? JSON.parse(data) : null;
  }

  async function getAllProjects() {
    try {
      const db = await initDB();
      if (db) {
        return new Promise((resolve) => {
          const tx = db.transaction(STORE_PROJECTS, 'readonly');
          const store = tx.objectStore(STORE_PROJECTS);
          const req = store.getAll();
          req.onsuccess = () => {
            const list = req.result || [];
            list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
            resolve(list);
          };
          req.onerror = () => resolve([]);
        });
      }
    } catch (err) {}
    const list = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('wf_proj_')) {
        try { list.push(JSON.parse(localStorage.getItem(key))); } catch (e) {}
      }
    }
    list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    return list;
  }

  async function deleteProject(id) {
    try {
      const db = await initDB();
      if (db) {
        const tx = db.transaction(STORE_PROJECTS, 'readwrite');
        tx.objectStore(STORE_PROJECTS).delete(id);
      }
    } catch (err) {}
    localStorage.removeItem(`wf_proj_${id}`);
    return true;
  }

  async function setActiveProjectId(id) {
    try {
      const db = await initDB();
      if (db) {
        const tx = db.transaction(STORE_SETTINGS, 'readwrite');
        tx.objectStore(STORE_SETTINGS).put({ key: 'activeProjectId', value: id });
      }
    } catch (err) {}
    localStorage.setItem('wf_active_project_id', id);
  }

  async function getActiveProjectId() {
    try {
      const db = await initDB();
      if (db) {
        return new Promise((resolve) => {
          const tx = db.transaction(STORE_SETTINGS, 'readonly');
          const req = tx.objectStore(STORE_SETTINGS).get('activeProjectId');
          req.onsuccess = () => resolve(req.result ? req.result.value : null);
          req.onerror = () => resolve(null);
        });
      }
    } catch (err) {}
    return localStorage.getItem('wf_active_project_id');
  }

  // ==========================================================================
  // 3. STARTER TEMPLATES
  // ==========================================================================
  function createTemplateObj(type, artboardId, x, y, width, height, customProps = {}, customStyles = {}) {
    const obj = createObjectFromType(type, customProps, customStyles);
    obj.artboardId = artboardId;
    obj.x = x;
    obj.y = y;
    obj.width = width;
    obj.height = height;
    return obj;
  }

  const STARTER_TEMPLATES = [
    {
      id: 'tpl-cloud-infra',
      name: 'Cloud Infrastructure SaaS Landing',
      description: 'Developer platform marketing page with global edge architecture, latency metrics, and enterprise pricing.',
      category: 'Web',
      build: () => {
        const abId = generateId('ab');
        return {
          id: generateId('proj'),
          name: 'Apex Cloud Platform Landing',
          version: '1.0',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          activePageId: 'page_1',
          pages: [
            {
              id: 'page_1',
              name: 'Page 1',
              artboards: [
                {
                  id: abId,
                  name: 'Desktop Landing — 1440 × 1000',
                  preset: 'desktop',
                  x: 80,
                  y: 60,
                  width: 1440,
                  height: 1000,
                  background: '#ffffff',
                  locked: false,
                  hidden: false
                }
              ],
              objects: [
                createTemplateObj('navbar', abId, 0, 0, 1440, 64, {
                  brand: 'Apex Cloud',
                  links: ['Edge Network', 'Serverless Functions', 'Architecture', 'Pricing', 'API Docs'],
                  ctaText: 'Deploy Now'
                }),
                createTemplateObj('chip', abId, 600, 95, 240, 28, {
                  label: 'v4.2 Released: Sub-10ms Edge Cold Starts'
                }, { fill: '#f3f4f6', textColor: '#111827', fontSize: 11 }),
                createTemplateObj('text', abId, 240, 140, 960, 64, {
                  text: 'Global Serverless Infrastructure at the Edge',
                  variant: 'heading-1'
                }, { fontSize: 38, fontWeight: '700', textAlign: 'center' }),
                createTemplateObj('paragraph', abId, 360, 220, 720, 54, {
                  text: 'Deploy containerized microservices and automated CI/CD pipelines across 310+ Anycast PoPs worldwide with automatic TLS and zero configuration.'
                }, { fontSize: 15, textColor: '#4b5563', textAlign: 'center' }),
                createTemplateObj('button', abId, 530, 290, 175, 46, { label: 'Start Free Trial (14 Days)', variant: 'primary' }, { fill: '#1f2937' }),
                createTemplateObj('button', abId, 725, 290, 185, 46, { label: 'Read Architecture Whitepaper', variant: 'outline' }),
                createTemplateObj('image', abId, 220, 370, 1000, 310, { label: 'Interactive Edge Topology & Latency Map (310 PoPs)' }),
                createTemplateObj('text', abId, 470, 715, 500, 32, { text: 'Engineered for Zero-Downtime Reliability', variant: 'heading-2' }, { fontSize: 22, textAlign: 'center' }),
                createTemplateObj('card', abId, 120, 770, 370, 180, {
                  title: '⚡ Anycast Routing & Smart DNS',
                  body: 'Incoming requests automatically route to the topologically closest datacenter with sub-millisecond route optimization.',
                  hasImage: false,
                  hasActions: false
                }),
                createTemplateObj('card', abId, 535, 770, 370, 180, {
                  title: '🛡️ Layer 3/4/7 DDoS Mitigation',
                  body: 'Continuous traffic inspection and automated scrubbing with 120 Tbps mitigation backbone capacity.',
                  hasImage: false,
                  hasActions: false
                }),
                createTemplateObj('card', abId, 950, 770, 370, 180, {
                  title: '📊 Real-Time Telemetry & Tracing',
                  body: 'OpenTelemetry integration with distributed tracing, percentile latency histograms, and instant log streaming.',
                  hasImage: false,
                  hasActions: false
                })
              ]
            }
          ]
        };
      }
    },
    {
      id: 'tpl-telehealth-flow',
      name: 'Telehealth Patient Booking Flow (Interactive)',
      description: '3 Interactive mobile screens: Doctor search → Slot scheduling → Video visit confirmation modal.',
      category: 'Mobile',
      build: () => {
        const ab1Id = generateId('ab');
        const ab2Id = generateId('ab');
        const ab3Id = generateId('ab');

        const objDoctorCard = createTemplateObj('card', ab1Id, 20, 185, 353, 210, {
          title: 'Dr. Sarah Jenkins, MD',
          body: 'Board Certified Cardiologist • Stanford Health\n⭐ 4.96 (182 reviews) • Next available: Tomorrow',
          hasImage: false,
          hasActions: true,
          actionText: 'Book Video Visit ($35)'
        });
        objDoctorCard.prototype = { targetArtboardId: ab2Id, trigger: 'click', animation: 'slide-left' };

        const objConfirmSlotBtn = createTemplateObj('button', ab2Id, 20, 735, 353, 48, { label: 'Confirm Video Visit — Tomorrow 10:30 AM', variant: 'primary' }, { fill: '#1f2937' });
        objConfirmSlotBtn.prototype = { targetArtboardId: ab3Id, trigger: 'click', animation: 'slide-left' };

        const objBackBtn = createTemplateObj('button', ab2Id, 20, 20, 90, 32, { label: '‹ Specialists', variant: 'ghost' });
        objBackBtn.prototype = { targetArtboardId: ab1Id, trigger: 'click', animation: 'slide-right' };

        const objReturnHomeBtn = createTemplateObj('button', ab3Id, 80, 500, 233, 44, { label: 'View in My Care Plan', variant: 'primary' });
        objReturnHomeBtn.prototype = { targetArtboardId: ab1Id, trigger: 'click', animation: 'fade' };

        return {
          id: generateId('proj'),
          name: 'Telehealth Care Portal Flow',
          version: '1.0',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          activePageId: 'page_1',
          pages: [
            {
              id: 'page_1',
              name: 'Page 1',
              artboards: [
                {
                  id: ab1Id,
                  name: '1. Specialist Directory — 393 × 852',
                  preset: 'mobile',
                  x: 80,
                  y: 60,
                  width: 393,
                  height: 852,
                  background: '#ffffff'
                },
                {
                  id: ab2Id,
                  name: '2. Select Appointment — 393 × 852',
                  preset: 'mobile',
                  x: 540,
                  y: 60,
                  width: 393,
                  height: 852,
                  background: '#ffffff'
                },
                {
                  id: ab3Id,
                  name: '3. Appointment Confirmed — 393 × 852',
                  preset: 'mobile',
                  x: 1000,
                  y: 60,
                  width: 393,
                  height: 852,
                  background: '#ffffff'
                }
              ],
              objects: [
                createTemplateObj('text', ab1Id, 20, 30, 260, 32, { text: 'Find a Specialist', variant: 'heading-2' }),
                createTemplateObj('input', ab1Id, 20, 75, 353, 40, { placeholder: 'Search doctor, specialty, or condition...' }),
                createTemplateObj('tabs', ab1Id, 20, 128, 353, 36, { tabs: ['All', 'Cardiology', 'Neurology', 'Pediatrics'], activeIndex: 1 }),
                objDoctorCard,
                createTemplateObj('card', ab1Id, 20, 420, 353, 210, {
                  title: 'Dr. Michael Chang, MD',
                  body: 'Internal Medicine • UCSF Medical Center\n⭐ 4.91 (214 reviews) • Next available: Friday',
                  hasImage: false,
                  hasActions: true,
                  actionText: 'Book Video Visit ($35)'
                }),
                objBackBtn,
                createTemplateObj('text', ab2Id, 20, 70, 353, 30, { text: 'Schedule with Dr. Jenkins', variant: 'heading-2' }),
                createTemplateObj('alert', ab2Id, 20, 115, 353, 50, { title: 'Insurance Verified', message: 'In-network with Blue Cross PPO ($35 co-pay).' }),
                createTemplateObj('text', ab2Id, 20, 185, 200, 24, { text: 'Select Date:', variant: 'label' }),
                createTemplateObj('tabs', ab2Id, 20, 215, 353, 36, { tabs: ['Thu, Oct 24', 'Fri, Oct 25', 'Mon, Oct 28'], activeIndex: 0 }),
                createTemplateObj('text', ab2Id, 20, 275, 200, 24, { text: 'Available Morning Slots:', variant: 'label' }),
                createTemplateObj('chip', ab2Id, 20, 305, 95, 34, { label: '09:00 AM' }),
                createTemplateObj('chip', ab2Id, 125, 305, 95, 34, { label: '10:30 AM (Selected)' }, { fill: '#1f2937', textColor: '#ffffff' }),
                createTemplateObj('chip', ab2Id, 230, 305, 95, 34, { label: '11:15 AM' }),
                createTemplateObj('text', ab2Id, 20, 365, 200, 24, { text: 'Available Afternoon Slots:', variant: 'label' }),
                createTemplateObj('chip', ab2Id, 20, 395, 95, 34, { label: '02:00 PM' }),
                createTemplateObj('chip', ab2Id, 125, 395, 95, 34, { label: '03:30 PM' }),
                createTemplateObj('chip', ab2Id, 230, 395, 95, 34, { label: '04:15 PM' }),
                createTemplateObj('checkbox', ab2Id, 20, 460, 353, 28, { label: 'Send SMS & calendar reminders to (415) 892-0194', checked: true }),
                objConfirmSlotBtn,
                createTemplateObj('modal', ab3Id, 20, 180, 353, 290, {
                  title: 'Appointment Confirmed! 🩺',
                  message: 'Your video consultation with Dr. Sarah Jenkins is booked for Thursday, Oct 24 at 10:30 AM PST.\n\nMeeting link and intake health forms have been sent to your registered email.',
                  confirmText: 'Add to Apple Calendar',
                  cancelText: 'Done'
                }),
                objReturnHomeBtn
              ]
            }
          ]
        };
      }
    },
    {
      id: 'tpl-fintech-analytics',
      name: 'Fintech Treasury & Risk Operations',
      description: 'Executive dashboard with settlement volume metrics, risk intercept matrix, and transaction ledger.',
      category: 'Dashboard',
      build: () => {
        const abId = generateId('ab');
        return {
          id: generateId('proj'),
          name: 'Fintech Treasury & Fraud Portal',
          version: '1.0',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          activePageId: 'page_1',
          pages: [
            {
              id: 'page_1',
              name: 'Page 1',
              artboards: [
                {
                  id: abId,
                  name: 'Treasury Operations — 1440 × 900',
                  preset: 'desktop',
                  x: 80,
                  y: 60,
                  width: 1440,
                  height: 900,
                  background: '#f9fafb'
                }
              ],
              objects: [
                createTemplateObj('sidebar', abId, 0, 0, 220, 900, {
                  title: 'Nova Treasury',
                  items: ['Overview', 'Settlements', 'Risk Engine', 'Disputes', 'Compliance', 'Settings'],
                  activeIndex: 1
                }),
                createTemplateObj('navbar', abId, 220, 0, 1220, 60, {
                  brand: 'Settlement Ledger (USD / EUR)',
                  links: ['Real-time Feed', 'Batch Reconciliation', 'Audit Logs'],
                  ctaText: 'Generate Wire'
                }),
                createTemplateObj('card', abId, 250, 80, 270, 100, { title: 'Net Settlement Volume', body: '$24,819,450.00 (+18.4%)', hasImage: false, hasActions: false }),
                createTemplateObj('card', abId, 550, 80, 270, 100, { title: 'Cleared Transactions', body: '1,420,891 (99.98%)', hasImage: false, hasActions: false }),
                createTemplateObj('card', abId, 850, 80, 270, 100, { title: 'Risk Intercept Ratio', body: '0.04% (-0.01% MoM)', hasImage: false, hasActions: false }),
                createTemplateObj('card', abId, 1150, 80, 260, 100, { title: 'Avg Settlement Latency', body: '1.24s (FedNow / SEPA)', hasImage: false, hasActions: false }),
                createTemplateObj('chart', abId, 250, 200, 680, 270, { title: 'Daily Volume Breakdown (ACH Instant vs FedNow)' }),
                createTemplateObj('alert', abId, 950, 200, 460, 60, { title: 'OFAC & AML Automated Screen', message: 'All 84,210 batch items cleared sanctions screening with zero flags.' }),
                createTemplateObj('table', abId, 250, 490, 1160, 380, {
                  headers: ['Transaction ID', 'Counterparty', 'Currency / Amount', 'Rail Method', 'Status', 'Timestamp', 'Action'],
                  rows: [
                    ['TX-89401', 'Stripe Payments US', '$4,280,000.00', 'FedNow Direct', 'Settled', '10:42:15 AM', 'View Audit'],
                    ['TX-89402', 'Adyen NV (Amsterdam)', '€1,850,000.00', 'SEPA Instant', 'Settled', '10:41:50 AM', 'View Audit'],
                    ['TX-89403', 'Mercury Bank Corp', '$740,250.00', 'ACH Same-Day', 'Processing', '10:40:12 AM', 'View Audit'],
                    ['TX-89404', 'Shopify Merchant Pool', '$2,190,400.00', 'FedNow Direct', 'Settled', '10:38:04 AM', 'View Audit'],
                    ['TX-89405', 'Revolut UK Limited', '£820,000.00', 'Faster Payments', 'Settled', '10:35:22 AM', 'View Audit']
                  ]
                })
              ]
            }
          ]
        };
      }
    },
    {
      id: 'tpl-workspace-settings',
      name: 'B2B SaaS Workspace & Security Settings',
      description: 'Enterprise organization admin view with team roles, SAML SSO toggle, and API keys.',
      category: 'Dashboard',
      build: () => {
        const abId = generateId('ab');
        return {
          id: generateId('proj'),
          name: 'Workspace Security Settings',
          version: '1.0',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          activePageId: 'page_1',
          pages: [
            {
              id: 'page_1',
              name: 'Page 1',
              artboards: [
                {
                  id: abId,
                  name: 'Security & Team Settings — 1440 × 900',
                  preset: 'desktop',
                  x: 80,
                  y: 60,
                  width: 1440,
                  height: 900,
                  background: '#ffffff'
                }
              ],
              objects: [
                createTemplateObj('navbar', abId, 0, 0, 1440, 60, {
                  brand: 'Acme Global Workspace',
                  links: ['Projects', 'Pipelines', 'Analytics', 'Settings'],
                  activeLink: 'Settings',
                  ctaText: 'Invite Member'
                }),
                createTemplateObj('breadcrumbs', abId, 60, 80, 360, 24, {
                  items: ['Organization Settings', 'Authentication & Access Control']
                }),
                createTemplateObj('text', abId, 60, 115, 600, 36, { text: 'Security, SSO & Team Access', variant: 'heading-2' }),
                createTemplateObj('tabs', abId, 60, 165, 800, 40, {
                  tabs: ['Team Members (42)', 'SAML 2.0 / Okta SSO', 'API Keys & Secrets', 'Audit Trail', 'Billing'],
                  activeIndex: 0
                }),
                createTemplateObj('card', abId, 60, 230, 620, 150, {
                  title: 'Enforce SAML 2.0 Single Sign-On',
                  body: 'Require all team members to authenticate via company Okta, Azure AD, or Google Workspace identity provider.',
                  hasImage: false,
                  hasActions: false
                }),
                createTemplateObj('toggle', abId, 500, 245, 140, 30, { label: 'Enforced', checked: true }),
                createTemplateObj('card', abId, 720, 230, 620, 150, {
                  title: 'Hardware Security Key (WebAuthn / YubiKey)',
                  body: 'Enforce FIDO2 WebAuthn hardware token requirement for members with Administrator or Billing roles.',
                  hasImage: false,
                  hasActions: false
                }),
                createTemplateObj('toggle', abId, 1160, 245, 140, 30, { label: 'Enforced', checked: true }),
                createTemplateObj('text', abId, 60, 410, 300, 28, { text: 'Active Organization Members', variant: 'heading-3' }),
                createTemplateObj('table', abId, 60, 450, 1280, 380, {
                  headers: ['Full Name', 'Corporate Email', 'Assigned Role', '2FA Status', 'Last Activity', 'Action'],
                  rows: [
                    ['Elena Rostova', 'elena.rostova@acme.com', 'Organization Owner', 'Hardware Key (YubiKey)', 'Active now', 'Edit Role'],
                    ['David K. Miller', 'david.miller@acme.com', 'Security Lead (Admin)', 'Hardware Key (YubiKey)', '14 mins ago', 'Edit Role'],
                    ['Priya Patel', 'priya.patel@acme.com', 'Staff Engineer', 'Authenticator App (TOTP)', '1 hour ago', 'Edit Role'],
                    ['Marcus Vance', 'marcus.vance@acme.com', 'Product Designer', 'Authenticator App (TOTP)', '3 hours ago', 'Edit Role'],
                    ['Chloe Zhang', 'chloe.zhang@acme.com', 'DevOps Specialist', 'Hardware Key (YubiKey)', 'Yesterday', 'Edit Role']
                  ]
                })
              ]
            }
          ]
        };
      }
    }
  ];

  // ==========================================================================
  // 4. CENTRAL REACTIVE STATE & HISTORY
  // ==========================================================================
  class AppState {
    constructor() {
      this.project = createNewProject('My Wireframe Project');
      this.selection = new Set();
      this.activeTool = 'select';
      this.mode = 'design';
      this.theme = 'theme-dark';
      this.viewport = { zoom: 1, panX: 120, panY: 80 };
      this.snapping = { enabled: true, grid: 8, snapToGuides: true, snapToObjects: true };
      this.clipboard = [];
      this.undoStack = [];
      this.redoStack = [];
      this.maxHistory = 50;
      this.historyPaused = false;
      this.listeners = new Map();
      this.saveTimeout = null;
    }

    on(event, callback) {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, new Set());
      }
      this.listeners.get(event).add(callback);
      return () => this.listeners.get(event).delete(callback);
    }

    emit(event, data) {
      if (this.listeners.has(event)) {
        this.listeners.get(event).forEach(cb => {
          try { cb(data); } catch (e) { console.error(`Error in event listener for ${event}:`, e); }
        });
      }
    }

    scheduleAutoSave() {
      this.emit('save:status', { status: 'saving' });
      clearTimeout(this.saveTimeout);
      this.saveTimeout = setTimeout(async () => {
        await saveProject(this.project);
        this.emit('save:status', { status: 'saved' });
      }, 800);
    }

    pushHistory(description = 'Edit') {
      if (this.historyPaused) return;
      const snapshot = JSON.stringify({
        pages: this.project.pages,
        activePageId: this.project.activePageId
      });
      if (this.undoStack.length > 0 && this.undoStack[this.undoStack.length - 1].snapshot === snapshot) {
        return;
      }
      this.undoStack.push({ description, snapshot });
      if (this.undoStack.length > this.maxHistory) this.undoStack.shift();
      this.redoStack = [];
      this.emit('history:changed', { canUndo: this.canUndo(), canRedo: this.canRedo() });
      this.scheduleAutoSave();
    }

    canUndo() { return this.undoStack.length > 0; }
    canRedo() { return this.redoStack.length > 0; }

    undo() {
      if (!this.canUndo()) return;
      const currentSnapshot = JSON.stringify({
        pages: this.project.pages,
        activePageId: this.project.activePageId
      });
      this.redoStack.push({ snapshot: currentSnapshot });

      const prev = this.undoStack.pop();
      const parsed = JSON.parse(prev.snapshot);
      this.project.pages = parsed.pages;
      this.project.activePageId = parsed.activePageId;

      this.emit('project:changed', this.project);
      this.emit('history:changed', { canUndo: this.canUndo(), canRedo: this.canRedo() });
      this.scheduleAutoSave();
    }

    redo() {
      if (!this.canRedo()) return;
      const currentSnapshot = JSON.stringify({
        pages: this.project.pages,
        activePageId: this.project.activePageId
      });
      this.undoStack.push({ snapshot: currentSnapshot });

      const next = this.redoStack.pop();
      const parsed = JSON.parse(next.snapshot);
      this.project.pages = parsed.pages;
      this.project.activePageId = parsed.activePageId;

      this.emit('project:changed', this.project);
      this.emit('history:changed', { canUndo: this.canUndo(), canRedo: this.canRedo() });
      this.scheduleAutoSave();
    }

    getActivePage() {
      if (!this.project.pages || this.project.pages.length === 0) {
        this.project.pages = [{ id: 'page_1', name: 'Page 1', artboards: [], objects: [] }];
        this.project.activePageId = 'page_1';
      }
      let page = this.project.pages.find(p => p.id === this.project.activePageId);
      if (!page) {
        page = this.project.pages[0];
        this.project.activePageId = page.id;
      }
      return page;
    }

    getArtboards() { return this.getActivePage().artboards || []; }
    getObjects() { return this.getActivePage().objects || []; }

    setProject(project) {
      this.project = project;
      this.selection.clear();
      this.undoStack = [];
      this.redoStack = [];
      this.emit('project:changed', this.project);
      this.emit('selection:changed', Array.from(this.selection));
      this.emit('history:changed', { canUndo: false, canRedo: false });
      this.scheduleAutoSave();
    }

    setProjectName(name) {
      this.project.name = name;
      this.emit('project:nameChanged', name);
      this.scheduleAutoSave();
    }

    setActiveTool(tool) {
      this.activeTool = tool;
      this.emit('tool:changed', tool);
    }

    setMode(mode) {
      this.mode = mode;
      this.emit('mode:changed', mode);
    }

    setTheme(theme) {
      this.theme = theme;
      this.emit('theme:changed', theme);
    }

    setViewport(viewport) {
      this.viewport = { ...this.viewport, ...viewport };
      this.emit('viewport:changed', this.viewport);
    }

    setSelection(ids) {
      const list = Array.isArray(ids) ? ids : [ids];
      this.selection = new Set(list.filter(Boolean));
      this.emit('selection:changed', Array.from(this.selection));
    }

    addToSelection(id) {
      if (!id) return;
      this.selection.add(id);
      this.emit('selection:changed', Array.from(this.selection));
    }

    removeFromSelection(id) {
      this.selection.delete(id);
      this.emit('selection:changed', Array.from(this.selection));
    }

    toggleSelection(id) {
      if (this.selection.has(id)) {
        this.selection.delete(id);
      } else {
        this.selection.add(id);
      }
      this.emit('selection:changed', Array.from(this.selection));
    }

    clearSelection() {
      if (this.selection.size === 0) return;
      this.selection.clear();
      this.emit('selection:changed', []);
    }

    getSelectedObjects() {
      const page = this.getActivePage();
      return page.objects.filter(obj => this.selection.has(obj.id));
    }

    getSelectedArtboards() {
      const page = this.getActivePage();
      return page.artboards.filter(ab => this.selection.has(ab.id));
    }

    addArtboard(artboard) {
      this.pushHistory('Add Artboard');
      const page = this.getActivePage();
      page.artboards.push(artboard);
      this.setSelection([artboard.id]);
      this.emit('project:changed', this.project);
    }

    updateArtboard(id, changes, recordHistory = true) {
      if (recordHistory) this.pushHistory('Update Artboard');
      const page = this.getActivePage();
      const ab = page.artboards.find(a => a.id === id);
      if (ab) {
        Object.assign(ab, changes);
        this.emit('project:changed', this.project);
      }
    }

    deleteArtboard(id) {
      this.pushHistory('Delete Artboard');
      const page = this.getActivePage();
      page.artboards = page.artboards.filter(a => a.id !== id);
      page.objects = page.objects.filter(o => o.artboardId !== id);
      this.selection.delete(id);
      this.emit('project:changed', this.project);
      this.emit('selection:changed', Array.from(this.selection));
    }

    addObject(obj, artboardId = null) {
      this.pushHistory(`Add ${obj.name || 'Object'}`);
      const page = this.getActivePage();
      obj.artboardId = artboardId;
      page.objects.push(obj);
      this.setSelection([obj.id]);
      this.emit('project:changed', this.project);
    }

    updateObject(id, changes, recordHistory = true) {
      if (recordHistory) this.pushHistory('Update Object');
      const page = this.getActivePage();
      const obj = page.objects.find(o => o.id === id);
      if (obj) {
        if (changes.styles) {
          obj.styles = { ...obj.styles, ...changes.styles };
          delete changes.styles;
        }
        if (changes.props) {
          obj.props = { ...obj.props, ...changes.props };
          delete changes.props;
        }
        if (changes.constraints) {
          obj.constraints = { ...obj.constraints, ...changes.constraints };
          delete changes.constraints;
        }
        if (changes.prototype) {
          obj.prototype = { ...obj.prototype, ...changes.prototype };
          delete changes.prototype;
        }
        Object.assign(obj, changes);
        this.emit('project:changed', this.project);
      }
    }

    updateMultipleObjects(updatesMap, recordHistory = true) {
      if (recordHistory) this.pushHistory('Update Objects');
      const page = this.getActivePage();
      for (const [id, changes] of Object.entries(updatesMap)) {
        const obj = page.objects.find(o => o.id === id);
        if (obj) {
          if (changes.styles) {
            obj.styles = { ...obj.styles, ...changes.styles };
            delete changes.styles;
          }
          if (changes.props) {
            obj.props = { ...obj.props, ...changes.props };
            delete changes.props;
          }
          if (changes.constraints) {
            obj.constraints = { ...obj.constraints, ...changes.constraints };
            delete changes.constraints;
          }
          Object.assign(obj, changes);
        }
      }
      this.emit('project:changed', this.project);
    }

    deleteSelection() {
      if (this.selection.size === 0) return;
      this.pushHistory('Delete');
      const page = this.getActivePage();
      page.objects = page.objects.filter(o => !this.selection.has(o.id));
      const selectedArtboardIds = page.artboards.filter(a => this.selection.has(a.id)).map(a => a.id);
      if (selectedArtboardIds.length > 0) {
        page.artboards = page.artboards.filter(a => !this.selection.has(a.id));
        page.objects = page.objects.filter(o => !selectedArtboardIds.includes(o.artboardId));
      }
      this.clearSelection();
      this.emit('project:changed', this.project);
    }

    duplicateSelection() {
      if (this.selection.size === 0) return;
      this.pushHistory('Duplicate');
      const page = this.getActivePage();
      const newIds = [];

      const selectedObjs = page.objects.filter(o => this.selection.has(o.id));
      for (const obj of selectedObjs) {
        const clone = JSON.parse(JSON.stringify(obj));
        clone.id = generateId('obj');
        clone.name = `${obj.name} (copy)`;
        clone.x += 20;
        clone.y += 20;
        page.objects.push(clone);
        newIds.push(clone.id);
      }

      const selectedArtboards = page.artboards.filter(a => this.selection.has(a.id));
      for (const ab of selectedArtboards) {
        const cloneAb = JSON.parse(JSON.stringify(ab));
        cloneAb.id = generateId('ab');
        cloneAb.name = `${ab.name} (copy)`;
        cloneAb.x += ab.width + 40;
        page.artboards.push(cloneAb);
        newIds.push(cloneAb.id);

        const childObjs = page.objects.filter(o => o.artboardId === ab.id);
        for (const child of childObjs) {
          const childClone = JSON.parse(JSON.stringify(child));
          childClone.id = generateId('obj');
          childClone.artboardId = cloneAb.id;
          page.objects.push(childClone);
        }
      }

      this.setSelection(newIds);
      this.emit('project:changed', this.project);
    }

    reorderObject(id, direction) {
      const page = this.getActivePage();
      const index = page.objects.findIndex(o => o.id === id);
      if (index === -1) return;

      this.pushHistory('Reorder');
      const [obj] = page.objects.splice(index, 1);
      if (direction === 'front') {
        page.objects.push(obj);
      } else if (direction === 'back') {
        page.objects.unshift(obj);
      } else if (direction === 'forward') {
        const nextIndex = Math.min(page.objects.length, index + 1);
        page.objects.splice(nextIndex, 0, obj);
      } else if (direction === 'backward') {
        const prevIndex = Math.max(0, index - 1);
        page.objects.splice(prevIndex, 0, obj);
      }
      this.emit('project:changed', this.project);
    }

    groupObjects(ids) {
      if (!ids || ids.length < 2) return;
      this.pushHistory('Group');
      const page = this.getActivePage();
      const groupId = generateId('grp');
      
      const objs = page.objects.filter(o => ids.includes(o.id));
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      objs.forEach(o => {
        minX = Math.min(minX, o.x);
        minY = Math.min(minY, o.y);
        maxX = Math.max(maxX, o.x + o.width);
        maxY = Math.max(maxY, o.y + o.height);
      });

      const groupContainer = {
        id: groupId,
        type: 'group',
        name: 'Group',
        artboardId: objs[0].artboardId || null,
        parentId: null,
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
        rotation: 0,
        locked: false,
        hidden: false,
        styles: { fill: 'transparent', stroke: 'transparent', strokeWidth: 0 },
        props: { childrenIds: ids },
        constraints: { horizontal: 'left', vertical: 'top' }
      };

      objs.forEach(o => {
        o.parentId = groupId;
        o.x -= minX;
        o.y -= minY;
      });

      page.objects.push(groupContainer);
      this.setSelection([groupId]);
      this.emit('project:changed', this.project);
    }

    ungroupObjects(groupId) {
      this.pushHistory('Ungroup');
      const page = this.getActivePage();
      const grp = page.objects.find(o => o.id === groupId);
      if (!grp) return;

      const children = page.objects.filter(o => o.parentId === groupId);
      children.forEach(c => {
        c.x += grp.x;
        c.y += grp.y;
        c.parentId = null;
        c.artboardId = grp.artboardId;
      });

      page.objects = page.objects.filter(o => o.id !== groupId);
      this.setSelection(children.map(c => c.id));
      this.emit('project:changed', this.project);
    }
  }

  const state = new AppState();

  // ==========================================================================
  // 5. CANVAS CONTROLLER (PAN, ZOOM, RULERS)
  // ==========================================================================
  class CanvasController {
    constructor(viewportEl, rulerHEl, rulerVEl) {
      this.viewportEl = viewportEl;
      this.rulerHEl = rulerHEl;
      this.rulerVEl = rulerVEl;
      this.isPanning = false;
      this.panStartX = 0;
      this.panStartY = 0;
      this.spacePressed = false;

      this.initEvents();
      this.updateRulers();
    }

    initEvents() {
      this.viewportEl.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });

      window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !this.spacePressed && !this.isEditingInput(e.target)) {
          this.spacePressed = true;
          this.viewportEl.classList.add('tool-hand');
        }
      });

      window.addEventListener('keyup', (e) => {
        if (e.code === 'Space') {
          this.spacePressed = false;
          if (state.activeTool !== 'hand') {
            this.viewportEl.classList.remove('tool-hand');
          }
        }
      });

      this.viewportEl.addEventListener('mousedown', (e) => {
        if (e.button === 1 || this.spacePressed || state.activeTool === 'hand') {
          e.preventDefault();
          this.startPan(e);
        }
      });

      window.addEventListener('mousemove', (e) => {
        if (this.isPanning) this.doPan(e);
      });

      window.addEventListener('mouseup', () => {
        if (this.isPanning) this.endPan();
      });

      state.on('viewport:changed', () => this.updateRulers());
    }

    isEditingInput(target) {
      return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
    }

    onWheel(e) {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey || e.altKey) {
        const rect = this.viewportEl.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
        this.zoomAtPoint(mouseX, mouseY, zoomFactor);
      } else {
        const newPanX = state.viewport.panX - e.deltaX;
        const newPanY = state.viewport.panY - e.deltaY;
        state.setViewport({ panX: newPanX, panY: newPanY });
      }
    }

    zoomAtPoint(screenX, screenY, factor) {
      const currentZoom = state.viewport.zoom;
      const newZoom = Math.min(Math.max(currentZoom * factor, 0.1), 8.0);
      const worldX = (screenX - state.viewport.panX) / currentZoom;
      const worldY = (screenY - state.viewport.panY) / currentZoom;
      const newPanX = screenX - worldX * newZoom;
      const newPanY = screenY - worldY * newZoom;
      state.setViewport({ zoom: newZoom, panX: newPanX, panY: newPanY });
    }

    zoomIn() {
      const rect = this.viewportEl.getBoundingClientRect();
      this.zoomAtPoint(rect.width / 2, rect.height / 2, 1.25);
    }

    zoomOut() {
      const rect = this.viewportEl.getBoundingClientRect();
      this.zoomAtPoint(rect.width / 2, rect.height / 2, 0.8);
    }

    resetZoom() {
      const rect = this.viewportEl.getBoundingClientRect();
      this.zoomAtPoint(rect.width / 2, rect.height / 2, 1 / state.viewport.zoom);
    }

    zoomToFitAll() {
      const page = state.getActivePage();
      const artboards = page.artboards || [];
      if (artboards.length === 0) {
        state.setViewport({ zoom: 1, panX: 100, panY: 100 });
        return;
      }

      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      artboards.forEach(ab => {
        minX = Math.min(minX, ab.x);
        minY = Math.min(minY, ab.y);
        maxX = Math.max(maxX, ab.x + ab.width);
        maxY = Math.max(maxY, ab.y + ab.height);
      });

      const rect = this.viewportEl.getBoundingClientRect();
      const padding = 80;
      const contentW = maxX - minX || 800;
      const contentH = maxY - minY || 600;

      const scaleX = (rect.width - padding * 2) / contentW;
      const scaleY = (rect.height - padding * 2) / contentH;
      const newZoom = Math.min(Math.max(Math.min(scaleX, scaleY), 0.15), 2.5);

      const newPanX = (rect.width - contentW * newZoom) / 2 - minX * newZoom;
      const newPanY = (rect.height - contentH * newZoom) / 2 - minY * newZoom;

      state.setViewport({ zoom: newZoom, panX: newPanX, panY: newPanY });
    }

    startPan(e) {
      this.isPanning = true;
      this.panStartX = e.clientX - state.viewport.panX;
      this.panStartY = e.clientY - state.viewport.panY;
    }

    doPan(e) {
      const newPanX = e.clientX - this.panStartX;
      const newPanY = e.clientY - this.panStartY;
      state.setViewport({ panX: newPanX, panY: newPanY });
    }

    endPan() {
      this.isPanning = false;
    }

    screenToCanvas(clientX, clientY) {
      const rect = this.viewportEl.getBoundingClientRect();
      const screenX = clientX - rect.left;
      const screenY = clientY - rect.top;
      return {
        x: (screenX - state.viewport.panX) / state.viewport.zoom,
        y: (screenY - state.viewport.panY) / state.viewport.zoom
      };
    }

    canvasToScreen(canvasX, canvasY) {
      const rect = this.viewportEl.getBoundingClientRect();
      return {
        x: canvasX * state.viewport.zoom + state.viewport.panX + rect.left,
        y: canvasY * state.viewport.zoom + state.viewport.panY + rect.top
      };
    }

    updateRulers() {
      if (!this.rulerHEl || !this.rulerVEl) return;
      const vp = state.viewport;
      const zoom = vp.zoom;
      const width = this.viewportEl.clientWidth;
      const height = this.viewportEl.clientHeight;

      const hCanvas = this.rulerHEl;
      hCanvas.width = width;
      hCanvas.height = 20;
      const ctxH = hCanvas.getContext('2d');
      ctxH.clearRect(0, 0, width, 20);

      const vCanvas = this.rulerVEl;
      vCanvas.width = 20;
      vCanvas.height = height;
      const ctxV = vCanvas.getContext('2d');
      ctxV.clearRect(0, 0, 20, height);

      ctxH.fillStyle = '#888888';
      ctxH.strokeStyle = '#444444';
      ctxH.font = '9px monospace';

      ctxV.fillStyle = '#888888';
      ctxV.strokeStyle = '#444444';
      ctxV.font = '9px monospace';

      let step = 100;
      if (zoom > 2) step = 20;
      else if (zoom > 1) step = 50;
      else if (zoom < 0.3) step = 500;
      else if (zoom < 0.6) step = 200;

      const startX = -vp.panX / zoom;
      const endX = (width - vp.panX) / zoom;
      const firstTickX = Math.floor(startX / step) * step;

      for (let x = firstTickX; x <= endX; x += step) {
        const screenX = x * zoom + vp.panX;
        ctxH.beginPath();
        ctxH.moveTo(screenX, 12);
        ctxH.lineTo(screenX, 20);
        ctxH.stroke();
        ctxH.fillText(`${Math.round(x)}`, screenX + 2, 10);
      }

      const startY = -vp.panY / zoom;
      const endY = (height - vp.panY) / zoom;
      const firstTickY = Math.floor(startY / step) * step;

      for (let y = firstTickY; y <= endY; y += step) {
        const screenY = y * zoom + vp.panY;
        ctxV.beginPath();
        ctxV.moveTo(12, screenY);
        ctxV.lineTo(20, screenY);
        ctxV.stroke();

        ctxV.save();
        ctxV.translate(10, screenY + 2);
        ctxV.rotate(-Math.PI / 2);
        ctxV.fillText(`${Math.round(y)}`, 0, 0);
        ctxV.restore();
      }
    }
  }

  // ==========================================================================
  // 6. CANVAS DOM & SVG RENDERER
  // ==========================================================================
  class CanvasRenderer {
    constructor(worldEl, overlayEl, wiresEl) {
      this.worldEl = worldEl;
      this.overlayEl = overlayEl;
      this.wiresEl = wiresEl;
      this.artboardEls = new Map();
      this.objectEls = new Map();

      state.on('project:changed', () => this.render());
      state.on('selection:changed', () => this.renderSelectionOverlay());
      state.on('viewport:changed', (vp) => this.updateViewportTransform(vp));
      state.on('mode:changed', () => this.render());
    }

    updateViewportTransform(vp) {
      if (!this.worldEl) return;
      const transformStr = `translate(${vp.panX}px, ${vp.panY}px) scale(${vp.zoom})`;
      this.worldEl.style.transform = transformStr;
      if (this.overlayEl) this.overlayEl.style.transform = transformStr;
      if (this.wiresEl) this.wiresEl.style.transform = transformStr;
      const guidesEl = document.getElementById('canvas-guides-container');
      if (guidesEl) guidesEl.style.transform = transformStr;
    }

    render() {
      if (!this.worldEl) return;
      this.worldEl.innerHTML = '';
      this.artboardEls.clear();
      this.objectEls.clear();

      const page = state.getActivePage();
      const artboards = page.artboards || [];
      const objects = page.objects || [];

      artboards.forEach(ab => {
        if (ab.hidden) return;
        const abEl = document.createElement('div');
        abEl.className = `artboard-node ${state.selection.has(ab.id) ? 'selected' : ''}`;
        abEl.id = `artboard-${ab.id}`;
        abEl.dataset.artboardId = ab.id;
        abEl.style.left = `${ab.x}px`;
        abEl.style.top = `${ab.y}px`;
        abEl.style.width = `${ab.width}px`;
        abEl.style.height = `${ab.height}px`;
        abEl.style.backgroundColor = ab.background || '#ffffff';

        const labelEl = document.createElement('div');
        labelEl.className = 'artboard-label-badge';
        labelEl.dataset.artboardId = ab.id;
        labelEl.innerHTML = `
          <span class="artboard-label-name">${escapeHTML(ab.name)}</span>
          <span class="artboard-label-dims">${ab.width}×${ab.height}</span>
        `;
        abEl.appendChild(labelEl);

        const clipBox = document.createElement('div');
        clipBox.className = 'artboard-clip-box';
        clipBox.dataset.artboardId = ab.id;
        abEl.appendChild(clipBox);

        this.worldEl.appendChild(abEl);
        this.artboardEls.set(ab.id, abEl);
      });

      objects.forEach(obj => {
        if (obj.hidden) return;
        const objEl = this.createObjectElement(obj);
        this.objectEls.set(obj.id, objEl);

        if (obj.artboardId && this.artboardEls.has(obj.artboardId)) {
          const clip = this.artboardEls.get(obj.artboardId).querySelector('.artboard-clip-box');
          if (clip) clip.appendChild(objEl);
        } else {
          this.worldEl.appendChild(objEl);
        }
      });

      this.renderSelectionOverlay();
      this.renderPrototypeWires();
    }

    createObjectElement(obj) {
      const el = document.createElement('div');
      el.className = `wf-object ${state.selection.has(obj.id) ? 'selected' : ''} ${obj.locked ? 'locked' : ''}`;
      el.id = `wf-obj-${obj.id}`;
      el.dataset.objectId = obj.id;
      if (obj.artboardId) el.dataset.artboardId = obj.artboardId;

      el.style.left = `${obj.x}px`;
      el.style.top = `${obj.y}px`;
      el.style.width = `${obj.width}px`;
      el.style.height = `${obj.height}px`;
      if (obj.rotation) el.style.transform = `rotate(${obj.rotation}deg)`;

      const s = obj.styles || {};
      if (s.fill && s.fill !== 'transparent') el.style.backgroundColor = s.fill;
      if (s.stroke && s.strokeWidth > 0 && s.stroke !== 'transparent') {
        el.style.border = `${s.strokeWidth}px ${s.strokeStyle || 'solid'} ${s.stroke}`;
      }
      if (s.borderRadius !== undefined) el.style.borderRadius = `${s.borderRadius}px`;
      if (s.opacity !== undefined) el.style.opacity = s.opacity;
      if (s.shadow) el.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';

      el.innerHTML = this.renderComponentHTML(obj);

      if (state.mode === 'prototype') {
        const pin = document.createElement('div');
        pin.className = 'prototype-connector-pin';
        pin.dataset.sourceObjectId = obj.id;
        pin.innerHTML = '+';
        el.appendChild(pin);
      }

      return el;
    }

    renderComponentHTML(obj) {
      const p = obj.props || {};
      const s = obj.styles || {};
      const type = obj.type;

      switch (type) {
        case 'text':
          return `
            <div class="wf-node wf-text ${p.variant || 'variant-heading-2'}" style="
              font-family: ${s.fontFamily || 'inherit'};
              font-size: ${s.fontSize || 22}px;
              font-weight: ${s.fontWeight || '700'};
              color: ${s.textColor || '#1f2937'};
              text-align: ${s.textAlign || 'left'};
            ">${escapeHTML(p.text || 'Headline')}</div>
          `;

        case 'paragraph':
          return `
            <div class="wf-node wf-text variant-paragraph" style="
              font-family: ${s.fontFamily || 'inherit'};
              font-size: ${s.fontSize || 13}px;
              color: ${s.textColor || '#4b5563'};
              text-align: ${s.textAlign || 'left'};
            ">${escapeHTML(p.text || '')}</div>
          `;

        case 'button':
          return `
            <div class="wf-node wf-button variant-${p.variant || 'primary'}" style="
              font-size: ${s.fontSize || 13}px;
              color: ${s.textColor || '#ffffff'};
              background-color: ${s.fill || '#1f2937'};
              border-color: ${s.stroke || '#1f2937'};
              border-radius: ${s.borderRadius || 6}px;
            ">
              <span>${escapeHTML(p.label || 'Button')}</span>
            </div>
          `;

        case 'input':
          return `
            <div class="wf-node wf-input ${p.value ? 'has-value' : ''}" style="
              border-radius: ${s.borderRadius || 6}px;
              background-color: ${s.fill || '#ffffff'};
            ">
              <svg class="wf-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <span>${escapeHTML(p.value || p.placeholder || 'Search...')}</span>
            </div>
          `;

        case 'textarea':
          return `
            <div class="wf-node wf-textarea" style="
              border-radius: ${s.borderRadius || 6}px;
              background-color: ${s.fill || '#ffffff'};
            ">${escapeHTML(p.value || p.placeholder || 'Textarea...')}</div>
          `;

        case 'image':
          return `
            <div class="wf-node wf-image" style="border-radius: ${s.borderRadius || 6}px;">
              <svg class="wf-image-cross" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="0" y1="0" x2="100" y2="100" />
                <line x1="100" y1="0" x2="0" y2="100" />
              </svg>
              <svg class="wf-image-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              <span class="wf-image-label">${escapeHTML(p.label || 'Media')}</span>
            </div>
          `;

        case 'card':
          return `
            <div class="wf-node wf-card" style="border-radius: ${s.borderRadius || 8}px; background-color: ${s.fill || '#ffffff'};">
              ${p.title ? `<div class="wf-card-header">${escapeHTML(p.title)}</div>` : ''}
              ${p.hasImage ? `<div class="wf-card-media"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>` : ''}
              <div class="wf-card-body">${escapeHTML(p.body || '')}</div>
              ${p.hasActions ? `<div class="wf-card-footer"><button style="padding: 4px 10px; font-size: 11px; background: #1f2937; color: white; border: none; border-radius: 4px;">${escapeHTML(p.actionText || 'Action')}</button></div>` : ''}
            </div>
          `;

        case 'navbar':
          const linksHtml = (p.links || ['Overview', 'Metrics', 'Settings']).map(link => 
            `<span class="${link === p.activeLink ? 'active' : ''}">${escapeHTML(link)}</span>`
          ).join('');
          return `
            <div class="wf-node wf-navbar" style="background-color: ${s.fill || '#ffffff'};">
              <div class="wf-navbar-logo">
                <div class="wf-logo-box"></div>
                <span>${escapeHTML(p.brand || 'Apex Cloud')}</span>
              </div>
              <div class="wf-navbar-links">${linksHtml}</div>
              ${p.hasCTA ? `<div class="wf-navbar-actions"><button style="padding: 6px 14px; font-size: 12px; background: #1f2937; color: white; border-radius: 4px; border: none;">${escapeHTML(p.ctaText || 'Deploy')}</button></div>` : ''}
            </div>
          `;

        case 'sidebar':
          const itemsHtml = (p.items || ['Overview', 'Compute', 'Settings']).map((item, idx) => `
            <div class="wf-sidebar-item ${idx === (p.activeIndex || 0) ? 'active' : ''}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
              <span>${escapeHTML(item)}</span>
            </div>
          `).join('');
          return `
            <div class="wf-node wf-sidebar" style="background-color: ${s.fill || '#f9fafb'};">
              <div class="wf-sidebar-header">${escapeHTML(p.title || 'Navigation')}</div>
              ${itemsHtml}
            </div>
          `;

        case 'modal':
          return `
            <div class="wf-node wf-modal" style="border-radius: ${s.borderRadius || 8}px; background-color: ${s.fill || '#ffffff'};">
              <div class="wf-modal-header">
                <span>${escapeHTML(p.title || 'Dialog')}</span>
                <span class="wf-modal-close">✕</span>
              </div>
              <div class="wf-modal-body">${escapeHTML(p.message || '')}</div>
              <div class="wf-modal-footer">
                <button style="padding: 5px 12px; background: transparent; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px;">${escapeHTML(p.cancelText || 'Cancel')}</button>
                <button style="padding: 5px 12px; background: #1f2937; color: white; border: none; border-radius: 4px; font-size: 12px;">${escapeHTML(p.confirmText || 'Confirm')}</button>
              </div>
            </div>
          `;

        case 'checkbox':
          return `
            <div class="wf-node wf-checkbox">
              <div class="wf-check-box ${p.checked ? 'checked' : ''}"></div>
              <span>${escapeHTML(p.label || 'Checkbox')}</span>
            </div>
          `;

        case 'radio':
          return `
            <div class="wf-node wf-radio">
              <div class="wf-radio-box ${p.checked ? 'checked' : ''}"></div>
              <span>${escapeHTML(p.label || 'Radio')}</span>
            </div>
          `;

        case 'tabs':
          const tabsHtml = (p.tabs || ['Tab 1', 'Tab 2', 'Tab 3']).map((tab, idx) => `
            <div class="wf-tab-item ${idx === (p.activeIndex || 0) ? 'active' : ''}">${escapeHTML(tab)}</div>
          `).join('');
          return `<div class="wf-node wf-tabs">${tabsHtml}</div>`;

        case 'dropdown':
          return `
            <div class="wf-node wf-dropdown" style="border-radius: ${s.borderRadius || 6}px; background-color: ${s.fill || '#ffffff'};">
              <span>${escapeHTML(p.label || 'Select option...')}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          `;

        case 'table':
          const headers = p.headers || ['Column 1', 'Column 2', 'Column 3'];
          const rows = p.rows || [['Data A1', 'Data B1', 'Data C1'], ['Data A2', 'Data B2', 'Data C2']];
          const thead = headers.map(h => `<div class="wf-table-cell">${escapeHTML(h)}</div>`).join('');
          const tbody = rows.map(r => `
            <div class="wf-table-row">
              ${r.map(c => `<div class="wf-table-cell">${escapeHTML(c)}</div>`).join('')}
            </div>
          `).join('');
          return `
            <div class="wf-node wf-table-container" style="border-radius: ${s.borderRadius || 6}px;">
              <div class="wf-table-row wf-table-header">${thead}</div>
              ${tbody}
            </div>
          `;

        case 'avatar':
          return `
            <div class="wf-node wf-avatar" style="
              background-color: ${s.fill || '#1f2937'};
              color: ${s.textColor || '#ffffff'};
            ">${escapeHTML(p.initials || 'ER')}</div>
          `;

        case 'divider':
          return `
            <div class="wf-node wf-divider">
              <div class="wf-divider-line" style="border-color: ${s.stroke || '#e5e7eb'};"></div>
              ${p.label ? `<span class="wf-divider-label">${escapeHTML(p.label)}</span>` : ''}
            </div>
          `;

        case 'toggle':
          return `
            <div class="wf-node wf-toggle">
              <div class="wf-toggle-track ${p.checked ? 'checked' : ''}">
                <div class="wf-toggle-thumb"></div>
              </div>
              <span>${escapeHTML(p.label || 'Toggle')}</span>
            </div>
          `;

        case 'chip':
          return `
            <div class="wf-node wf-chip" style="
              background-color: ${s.fill || '#f3f4f6'};
              border-color: ${s.stroke || '#d1d5db'};
              border-radius: ${s.borderRadius || 13}px;
              color: ${s.textColor || '#1f2937'};
            ">${escapeHTML(p.label || 'Badge')}</div>
          `;

        case 'breadcrumbs':
          const bItems = (p.items || ['Home', 'Section', 'Page']).map((item, idx, arr) => `
            <span class="${idx === arr.length - 1 ? 'active' : ''}">${escapeHTML(item)}</span>
            ${idx < arr.length - 1 ? '<span style="color: #9ca3af;">/</span>' : ''}
          `).join('');
          return `<div class="wf-node wf-breadcrumbs">${bItems}</div>`;

        case 'pagination':
          const pages = [1, 2, 3, 4, 5];
          const pageBtns = pages.map(pg => `
            <div class="wf-page-btn ${pg === (p.current || 2) ? 'active' : ''}">${pg}</div>
          `).join('');
          return `
            <div class="wf-node wf-pagination">
              <div class="wf-page-btn">‹</div>
              ${pageBtns}
              <div class="wf-page-btn">›</div>
            </div>
          `;

        case 'slider':
          return `
            <div class="wf-node wf-slider">
              <div class="wf-slider-track">
                <div class="wf-slider-fill" style="width: ${p.value || 75}%;"></div>
                <div class="wf-slider-thumb" style="left: ${p.value || 75}%;"></div>
              </div>
            </div>
          `;

        case 'alert':
          return `
            <div class="wf-node wf-alert" style="border-radius: ${s.borderRadius || 6}px;">
              <svg class="wf-alert-icon" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <div>
                <div style="font-weight: 600; font-size: 12px; margin-bottom: 2px;">${escapeHTML(p.title || 'Notice')}</div>
                <div style="font-size: 11px; color: #6b7280;">${escapeHTML(p.message || '')}</div>
              </div>
            </div>
          `;

        case 'chart':
          return `
            <div class="wf-node wf-chart" style="border-radius: ${s.borderRadius || 6}px;">
              <div style="font-size: 11px; font-weight: 600; color: #374151;">${escapeHTML(p.title || 'Chart')}</div>
              <div class="wf-chart-bars">
                <div class="wf-chart-bar" style="height: 35%;"></div>
                <div class="wf-chart-bar" style="height: 70%;"></div>
                <div class="wf-chart-bar" style="height: 55%;"></div>
                <div class="wf-chart-bar" style="height: 90%;"></div>
                <div class="wf-chart-bar" style="height: 45%;"></div>
              </div>
            </div>
          `;

        case 'video':
          return `
            <div class="wf-node wf-video" style="border-radius: ${s.borderRadius || 6}px; background-color: ${s.fill || '#1f2937'};">
              <div class="wf-video-play-btn">
                <div class="wf-video-play-icon"></div>
              </div>
            </div>
          `;

        case 'box':
        default:
          return `<div class="wf-node" style="border-radius: ${s.borderRadius || 4}px;"></div>`;
      }
    }

    renderSelectionOverlay() {
      if (!this.overlayEl) return;
      this.overlayEl.innerHTML = '';

      const selectedObjs = state.getSelectedObjects();
      const selectedArtboards = state.getSelectedArtboards();

      if (selectedArtboards.length > 0 && selectedObjs.length === 0) {
        selectedArtboards.forEach(ab => {
          const box = document.createElement('div');
          box.className = 'selection-overlay';
          box.style.left = `${ab.x}px`;
          box.style.top = `${ab.y}px`;
          box.style.width = `${ab.width}px`;
          box.style.height = `${ab.height}px`;
          this.addTransformHandles(box);
          this.overlayEl.appendChild(box);
        });
        return;
      }

      if (selectedObjs.length === 0) return;

      if (selectedObjs.length === 1) {
        const obj = selectedObjs[0];
        const bounds = this.getObjectAbsoluteBounds(obj);
        const box = document.createElement('div');
        box.className = 'selection-overlay';
        box.style.left = `${bounds.x}px`;
        box.style.top = `${bounds.y}px`;
        box.style.width = `${bounds.width}px`;
        box.style.height = `${bounds.height}px`;
        if (obj.rotation) box.style.transform = `rotate(${obj.rotation}deg)`;
        this.addTransformHandles(box, true);
        this.overlayEl.appendChild(box);
      } else {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        selectedObjs.forEach(obj => {
          const bounds = this.getObjectAbsoluteBounds(obj);
          minX = Math.min(minX, bounds.x);
          minY = Math.min(minY, bounds.y);
          maxX = Math.max(maxX, bounds.x + bounds.width);
          maxY = Math.max(maxY, bounds.y + bounds.height);
        });

        const box = document.createElement('div');
        box.className = 'selection-overlay multi-selection';
        box.style.left = `${minX}px`;
        box.style.top = `${minY}px`;
        box.style.width = `${maxX - minX}px`;
        box.style.height = `${maxY - minY}px`;
        this.addTransformHandles(box, false);
        this.overlayEl.appendChild(box);
      }
    }

    addTransformHandles(container, withRotation = false) {
      const handles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
      handles.forEach(dir => {
        const h = document.createElement('div');
        h.className = `transform-handle handle-${dir}`;
        h.dataset.handle = dir;
        container.appendChild(h);
      });

      if (withRotation) {
        const line = document.createElement('div');
        line.className = 'handle-rot-line';
        container.appendChild(line);

        const rot = document.createElement('div');
        rot.className = 'handle-rot';
        rot.dataset.handle = 'rot';
        container.appendChild(rot);
      }
    }

    getObjectAbsoluteBounds(obj) {
      let x = obj.x;
      let y = obj.y;
      if (obj.artboardId) {
        const page = state.getActivePage();
        const ab = page.artboards.find(a => a.id === obj.artboardId);
        if (ab) { x += ab.x; y += ab.y; }
      }
      return { x, y, width: obj.width, height: obj.height };
    }

    renderPrototypeWires() {
      if (!this.wiresEl) return;
      this.wiresEl.innerHTML = '';

      const page = state.getActivePage();
      const artboards = page.artboards || [];
      const objects = page.objects || [];
      const artboardMap = new Map(artboards.map(a => [a.id, a]));

      objects.forEach(obj => {
        if (obj.prototype && obj.prototype.targetArtboardId) {
          const targetAb = artboardMap.get(obj.prototype.targetArtboardId);
          if (!targetAb) return;

          const bounds = this.getObjectAbsoluteBounds(obj);
          const startX = bounds.x + bounds.width;
          const startY = bounds.y + bounds.height / 2;
          const targetX = targetAb.x;
          const targetY = targetAb.y + targetAb.height / 4;

          this.drawBezierWire(startX, startY, targetX, targetY);
        }
      });
    }

    drawBezierWire(x1, y1, x2, y2) {
      const dx = Math.abs(x2 - x1) * 0.5;
      const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathData);
      path.setAttribute('class', 'prototype-wire-path');
      path.setAttribute('marker-end', 'url(#wire-arrow)');
      this.wiresEl.appendChild(path);
    }
  }

  // ==========================================================================
  // 7. POINTER INTERACTIONS & SMART SNAPPING
  // ==========================================================================
  class InteractionController {
    constructor(viewportEl, worldEl, canvasCtrl, guidesContainerEl) {
      this.viewportEl = viewportEl;
      this.worldEl = worldEl;
      this.canvasCtrl = canvasCtrl;
      this.guidesContainerEl = guidesContainerEl;

      this.mode = 'idle';
      this.startPos = { x: 0, y: 0 };
      this.dragStartObjects = new Map();
      this.activeHandle = null;
      this.drawType = null;
      this.marqueeEl = null;
      this.wireSourceId = null;

      this.initEvents();
    }

    initEvents() {
      this.viewportEl.addEventListener('mousedown', (e) => this.onMouseDown(e));
      this.viewportEl.addEventListener('dblclick', (e) => this.onDblClick(e));
      window.addEventListener('mousemove', (e) => this.onMouseMove(e));
      window.addEventListener('mouseup', (e) => this.onMouseUp(e));

      this.viewportEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      });

      this.viewportEl.addEventListener('drop', (e) => this.onDropFromSidebar(e));
    }

    onDblClick(e) {
      const labelBadge = e.target.closest('.artboard-label-badge');
      if (labelBadge) {
        const abId = labelBadge.dataset.artboardId;
        const ab = state.getActivePage().artboards.find(a => a.id === abId);
        if (!ab) return;

        const nameSpan = labelBadge.querySelector('.artboard-label-name');
        if (!nameSpan) return;

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'layer-name-input';
        input.value = ab.name;
        nameSpan.replaceWith(input);
        input.focus();
        input.select();

        const finishRename = () => {
          const newName = input.value.trim() || ab.name;
          state.updateArtboard(abId, { name: newName });
        };

        input.addEventListener('blur', finishRename);
        input.addEventListener('keydown', (ke) => {
          if (ke.key === 'Enter') finishRename();
          if (ke.key === 'Escape') state.emit('project:changed', state.project);
        });
        return;
      }

      const objEl = e.target.closest('.wf-object');
      if (objEl) {
        const objId = objEl.dataset.objectId;
        const obj = state.getActivePage().objects.find(o => o.id === objId);
        if (!obj) return;

        if (['text', 'paragraph', 'button', 'chip', 'alert'].includes(obj.type)) {
          const isButton = obj.type === 'button';
          const isChip = obj.type === 'chip';
          const isAlert = obj.type === 'alert';
          const currentText = isButton || isChip ? (obj.props.label || '') : (isAlert ? (obj.props.title || '') : (obj.props.text || ''));

          const input = document.createElement(obj.type === 'paragraph' ? 'textarea' : 'input');
          if (obj.type !== 'paragraph') input.type = 'text';
          input.value = currentText;
          input.style.position = 'absolute';
          input.style.left = '0';
          input.style.top = '0';
          input.style.width = '100%';
          input.style.height = '100%';
          input.style.fontSize = `${obj.styles?.fontSize || 14}px`;
          input.style.fontFamily = 'inherit';
          input.style.fontWeight = `${obj.styles?.fontWeight || 400}`;
          input.style.color = '#1f2937';
          input.style.background = '#ffffff';
          input.style.border = '1.5px solid #0d99ff';
          input.style.borderRadius = '4px';
          input.style.zIndex = '9999';
          input.style.padding = '4px 6px';
          input.style.boxSizing = 'border-box';
          input.style.outline = 'none';

          objEl.appendChild(input);
          input.focus();
          input.select();

          const commitText = () => {
            const val = input.value;
            input.remove();
            if (isButton || isChip) {
              state.updateObject(objId, { props: { label: val } });
            } else if (isAlert) {
              state.updateObject(objId, { props: { title: val } });
            } else {
              state.updateObject(objId, { props: { text: val } });
            }
          };

          input.addEventListener('blur', commitText);
          input.addEventListener('keydown', (ke) => {
            if (ke.key === 'Enter' && obj.type !== 'paragraph') commitText();
            if (ke.key === 'Escape') input.remove();
          });
        }
      }
    }

    onMouseDown(e) {
      if (e.button !== 0) return;
      if (this.canvasCtrl.spacePressed || state.activeTool === 'hand') return;

      const canvasPoint = this.canvasCtrl.screenToCanvas(e.clientX, e.clientY);
      this.startPos = { ...canvasPoint, clientX: e.clientX, clientY: e.clientY };

      const pinEl = e.target.closest('.prototype-connector-pin');
      if (pinEl && state.mode === 'prototype') {
        e.stopPropagation();
        this.mode = 'wire';
        this.wireSourceId = pinEl.dataset.sourceObjectId;
        return;
      }

      const handleEl = e.target.closest('.transform-handle, .handle-rot');
      if (handleEl) {
        e.stopPropagation();
        this.activeHandle = handleEl.dataset.handle;
        this.mode = (this.activeHandle === 'rot') ? 'rotate' : 'resize';
        this.snapshotSelectedObjects();
        return;
      }

      if (state.activeTool !== 'select') {
        this.startDrawing(canvasPoint);
        return;
      }

      const objectEl = e.target.closest('.wf-object');
      if (objectEl) {
        const objId = objectEl.dataset.objectId;
        if (e.shiftKey) {
          state.toggleSelection(objId);
        } else if (!state.selection.has(objId)) {
          state.setSelection([objId]);
        }
        this.mode = 'drag';
        this.snapshotSelectedObjects();
        return;
      }

      const artboardEl = e.target.closest('.artboard-node, .artboard-label-badge');
      if (artboardEl) {
        const abId = artboardEl.dataset.artboardId;
        if (e.shiftKey) {
          state.toggleSelection(abId);
        } else {
          state.setSelection([abId]);
        }
        this.mode = 'drag';
        this.snapshotSelectedObjects();
        return;
      }

      if (!e.shiftKey) {
        state.clearSelection();
      }
      this.mode = 'marquee';
      this.createMarqueeElement(canvasPoint);
    }

    onMouseMove(e) {
      if (this.mode === 'idle') return;
      const currentPoint = this.canvasCtrl.screenToCanvas(e.clientX, e.clientY);
      const dx = currentPoint.x - this.startPos.x;
      const dy = currentPoint.y - this.startPos.y;

      if (this.mode === 'drag') {
        this.doDrag(dx, dy, e);
      } else if (this.mode === 'resize') {
        this.doResize(dx, dy, e);
      } else if (this.mode === 'rotate') {
        this.doRotate(currentPoint, e);
      } else if (this.mode === 'marquee') {
        this.updateMarquee(currentPoint);
      } else if (this.mode === 'draw') {
        this.updateDrawing(currentPoint);
      }
    }

    onMouseUp(e) {
      if (this.mode === 'idle') return;
      if (this.mode === 'drag') this.finishDrag();
      else if (this.mode === 'resize') this.finishResize();
      else if (this.mode === 'rotate') this.finishRotate();
      else if (this.mode === 'marquee') this.finishMarquee();
      else if (this.mode === 'draw') this.finishDrawing();
      else if (this.mode === 'wire') this.finishWire(e);

      this.mode = 'idle';
      this.clearGuides();
    }

    snapshotSelectedObjects() {
      this.dragStartObjects.clear();
      state.getSelectedObjects().forEach(obj => {
        this.dragStartObjects.set(obj.id, {
          x: obj.x,
          y: obj.y,
          width: obj.width,
          height: obj.height,
          rotation: obj.rotation || 0,
          artboardId: obj.artboardId
        });
      });

      state.getSelectedArtboards().forEach(ab => {
        this.dragStartObjects.set(ab.id, {
          x: ab.x,
          y: ab.y,
          width: ab.width,
          height: ab.height,
          isArtboard: true
        });
      });
    }

    doDrag(dx, dy, e) {
      this.clearGuides();
      const updates = {};
      let effectiveDx = dx;
      let effectiveDy = dy;

      if (state.snapping.enabled && this.dragStartObjects.size === 1) {
        const [id, start] = Array.from(this.dragStartObjects.entries())[0];
        const testX = start.x + dx;
        const testY = start.y + dy;
        const snapResult = this.computeSnapping(id, testX, testY, start.width, start.height, start.artboardId);
        effectiveDx = snapResult.x - start.x;
        effectiveDy = snapResult.y - start.y;
      }

      for (const [id, start] of this.dragStartObjects.entries()) {
        if (start.isArtboard) {
          state.updateArtboard(id, {
            x: Math.round(start.x + effectiveDx),
            y: Math.round(start.y + effectiveDy)
          }, false);
        } else {
          updates[id] = {
            x: Math.round(start.x + effectiveDx),
            y: Math.round(start.y + effectiveDy)
          };
        }
      }

      if (Object.keys(updates).length > 0) {
        state.updateMultipleObjects(updates, false);
      }
    }

    finishDrag() {
      const page = state.getActivePage();
      const artboards = page.artboards || [];

      for (const [id, start] of this.dragStartObjects.entries()) {
        if (start.isArtboard) continue;
        const obj = page.objects.find(o => o.id === id);
        if (!obj) continue;

        let absX = obj.x;
        let absY = obj.y;
        if (start.artboardId) {
          const oldAb = artboards.find(a => a.id === start.artboardId);
          if (oldAb) { absX += oldAb.x; absY += oldAb.y; }
        }

        const centerX = absX + obj.width / 2;
        const centerY = absY + obj.height / 2;
        const targetAb = artboards.find(ab => 
          centerX >= ab.x && centerX <= ab.x + ab.width &&
          centerY >= ab.y && centerY <= ab.y + ab.height
        );

        if (targetAb) {
          state.updateObject(id, { artboardId: targetAb.id, x: absX - targetAb.x, y: absY - targetAb.y }, true);
        } else {
          state.updateObject(id, { artboardId: null, x: absX, y: absY }, true);
        }
      }
    }

    computeSnapping(objectId, x, y, width, height, artboardId) {
      const threshold = 6;
      let snappedX = x;
      let snappedY = y;
      const page = state.getActivePage();
      const siblings = page.objects.filter(o => o.id !== objectId && o.artboardId === artboardId);

      const xTargets = [
        { val: x, type: 'left' },
        { val: x + width / 2, type: 'centerX' },
        { val: x + width, type: 'right' }
      ];

      const yTargets = [
        { val: y, type: 'top' },
        { val: y + height / 2, type: 'centerY' },
        { val: y + height, type: 'bottom' }
      ];

      for (const sib of siblings) {
        const sibX = [sib.x, sib.x + sib.width / 2, sib.x + sib.width];
        const sibY = [sib.y, sib.y + sib.height / 2, sib.y + sib.height];

        for (const t of xTargets) {
          for (const s of sibX) {
            if (Math.abs(t.val - s) <= threshold) {
              snappedX = t.type === 'left' ? s : t.type === 'centerX' ? s - width / 2 : s - width;
              this.showGuideLine('v', s, artboardId);
              break;
            }
          }
        }

        for (const t of yTargets) {
          for (const s of sibY) {
            if (Math.abs(t.val - s) <= threshold) {
              snappedY = t.type === 'top' ? s : t.type === 'centerY' ? s - height / 2 : s - height;
              this.showGuideLine('h', s, artboardId);
              break;
            }
          }
        }
      }

      return { x: snappedX, y: snappedY };
    }

    showGuideLine(orientation, pos, artboardId) {
      if (!this.guidesContainerEl) return;
      let absPos = pos;
      if (artboardId) {
        const ab = state.getActivePage().artboards.find(a => a.id === artboardId);
        if (ab) absPos += (orientation === 'v' ? ab.x : ab.y);
      }
      const line = document.createElement('div');
      line.className = `guide-line-${orientation}`;
      if (orientation === 'v') line.style.left = `${absPos}px`;
      else line.style.top = `${absPos}px`;
      this.guidesContainerEl.appendChild(line);
    }

    clearGuides() {
      if (this.guidesContainerEl) this.guidesContainerEl.innerHTML = '';
    }

    doResize(dx, dy, e) {
      const handle = this.activeHandle;
      const lockAspect = e.shiftKey;

      for (const [id, start] of this.dragStartObjects.entries()) {
        let newW = start.width;
        let newH = start.height;
        let newX = start.x;
        let newY = start.y;

        if (handle.includes('e')) newW = Math.max(10, start.width + dx);
        if (handle.includes('s')) newH = Math.max(10, start.height + dy);
        if (handle.includes('w')) {
          newW = Math.max(10, start.width - dx);
          newX = start.x + (start.width - newW);
        }
        if (handle.includes('n')) {
          newH = Math.max(10, start.height - dy);
          newY = start.y + (start.height - newH);
        }

        if (lockAspect) {
          const ratio = start.width / start.height;
          if (newW / newH > ratio) newW = newH * ratio;
          else newH = newW / ratio;
        }

        if (start.isArtboard) {
          state.updateArtboard(id, {
            x: Math.round(newX),
            y: Math.round(newY),
            width: Math.round(newW),
            height: Math.round(newH)
          }, false);
        } else {
          state.updateObject(id, {
            x: Math.round(newX),
            y: Math.round(newY),
            width: Math.round(newW),
            height: Math.round(newH)
          }, false);
        }
      }
    }

    finishResize() {
      state.pushHistory('Resize');
    }

    doRotate(currentPoint, e) {
      if (this.dragStartObjects.size !== 1) return;
      const [id, start] = Array.from(this.dragStartObjects.entries())[0];
      const cx = start.x + start.width / 2;
      const cy = start.y + start.height / 2;
      const angleRad = Math.atan2(currentPoint.y - cy, currentPoint.x - cx);
      let angleDeg = Math.round((angleRad * 180 / Math.PI) + 90);
      if (e.shiftKey) angleDeg = Math.round(angleDeg / 15) * 15;
      state.updateObject(id, { rotation: angleDeg }, false);
    }

    finishRotate() {
      state.pushHistory('Rotate');
    }

    createMarqueeElement(pt) {
      this.marqueeEl = document.createElement('div');
      this.marqueeEl.className = 'canvas-marquee';
      this.marqueeEl.style.left = `${pt.x}px`;
      this.marqueeEl.style.top = `${pt.y}px`;
      this.marqueeEl.style.width = '0px';
      this.marqueeEl.style.height = '0px';
      this.worldEl.appendChild(this.marqueeEl);
    }

    updateMarquee(currentPt) {
      if (!this.marqueeEl) return;
      const x = Math.min(this.startPos.x, currentPt.x);
      const y = Math.min(this.startPos.y, currentPt.y);
      const w = Math.abs(currentPt.x - this.startPos.x);
      const h = Math.abs(currentPt.y - this.startPos.y);

      this.marqueeEl.style.left = `${x}px`;
      this.marqueeEl.style.top = `${y}px`;
      this.marqueeEl.style.width = `${w}px`;
      this.marqueeEl.style.height = `${h}px`;
    }

    finishMarquee() {
      if (!this.marqueeEl) return;
      const rect = {
        x: parseFloat(this.marqueeEl.style.left),
        y: parseFloat(this.marqueeEl.style.top),
        w: parseFloat(this.marqueeEl.style.width),
        h: parseFloat(this.marqueeEl.style.height)
      };
      this.marqueeEl.remove();
      this.marqueeEl = null;

      if (rect.w < 5 && rect.h < 5) return;
      const page = state.getActivePage();
      const matchingIds = [];

      page.objects.forEach(obj => {
        let objX = obj.x;
        let objY = obj.y;
        if (obj.artboardId) {
          const ab = page.artboards.find(a => a.id === obj.artboardId);
          if (ab) { objX += ab.x; objY += ab.y; }
        }
        if (objX < rect.x + rect.w && objX + obj.width > rect.x &&
            objY < rect.y + rect.h && objY + obj.height > rect.y) {
          matchingIds.push(obj.id);
        }
      });

      state.setSelection(matchingIds);
    }

    startDrawing(pt) {
      this.mode = 'draw';
      this.drawType = state.activeTool;
    }

    updateDrawing(currentPt) {
      this.updateMarquee(currentPt);
    }

    finishDrawing() {
      const type = this.drawType;
      if (this.marqueeEl) {
        this.marqueeEl.remove();
        this.marqueeEl = null;
      }

      if (type === 'artboard') {
        const newAb = {
          id: generateId('ab'),
          name: 'New Artboard',
          x: Math.round(this.startPos.x),
          y: Math.round(this.startPos.y),
          width: 800,
          height: 600,
          background: '#ffffff',
          locked: false,
          hidden: false
        };
        state.addArtboard(newAb);
      } else {
        const newObj = createObjectFromType(type);
        newObj.x = Math.round(this.startPos.x);
        newObj.y = Math.round(this.startPos.y);

        const page = state.getActivePage();
        const ab = page.artboards.find(a => 
          newObj.x >= a.x && newObj.x <= a.x + a.width &&
          newObj.y >= a.y && newObj.y <= a.y + a.height
        );

        if (ab) {
          newObj.x -= ab.x;
          newObj.y -= ab.y;
          state.addObject(newObj, ab.id);
        } else {
          state.addObject(newObj, null);
        }
      }

      state.setActiveTool('select');
    }

    onDropFromSidebar(e) {
      e.preventDefault();
      const type = e.dataTransfer.getData('text/plain');
      if (!type) return;

      const pt = this.canvasCtrl.screenToCanvas(e.clientX, e.clientY);
      const newObj = createObjectFromType(type);
      newObj.x = Math.round(pt.x - newObj.width / 2);
      newObj.y = Math.round(pt.y - newObj.height / 2);

      const page = state.getActivePage();
      const ab = page.artboards.find(a => 
        newObj.x >= a.x && newObj.x <= a.x + a.width &&
        newObj.y >= a.y && newObj.y <= a.y + a.height
      );

      if (ab) {
        newObj.x -= ab.x;
        newObj.y -= ab.y;
        state.addObject(newObj, ab.id);
      } else {
        state.addObject(newObj, null);
      }
    }

    finishWire(e) {
      const targetAbEl = e.target.closest('.artboard-node, .artboard-label-badge');
      if (targetAbEl && this.wireSourceId) {
        const targetAbId = targetAbEl.dataset.artboardId;
        state.updateObject(this.wireSourceId, {
          prototype: { targetArtboardId: targetAbId, trigger: 'click', animation: 'slide-left' }
        });
      }
      this.wireSourceId = null;
    }
  }

  // ==========================================================================
  // 8. LAYERS PANEL CONTROLLER
  // ==========================================================================
  class LayersController {
    constructor(containerEl) {
      this.containerEl = containerEl;
      state.on('project:changed', () => this.render());
      state.on('selection:changed', () => this.updateSelectionHighlight());
    }

    render() {
      if (!this.containerEl) return;
      this.containerEl.innerHTML = '';

      const page = state.getActivePage();
      const artboards = page.artboards || [];
      const objects = page.objects || [];

      if (artboards.length === 0 && objects.length === 0) {
        this.containerEl.innerHTML = `
          <div class="layers-empty-state">
            No layers in this page.<br>
            Insert components from the Assets panel or drag an Artboard.
          </div>
        `;
        return;
      }

      artboards.forEach(ab => {
        const abNode = this.createArtboardLayerItem(ab);
        this.containerEl.appendChild(abNode);

        const childObjs = objects.filter(o => o.artboardId === ab.id && !o.parentId);
        childObjs.slice().reverse().forEach(obj => {
          const objNode = this.createObjectLayerItem(obj, 1);
          this.containerEl.appendChild(objNode);
        });
      });

      const freeObjs = objects.filter(o => !o.artboardId && !o.parentId);
      if (freeObjs.length > 0) {
        const freeHeader = document.createElement('div');
        freeHeader.className = 'panel-section-header';
        freeHeader.style.padding = '8px 12px 2px 12px';
        freeHeader.textContent = 'Free Objects';
        this.containerEl.appendChild(freeHeader);

        freeObjs.slice().reverse().forEach(obj => {
          const objNode = this.createObjectLayerItem(obj, 0);
          this.containerEl.appendChild(objNode);
        });
      }

      this.updateSelectionHighlight();
    }

    createArtboardLayerItem(ab) {
      const item = document.createElement('div');
      item.className = `layer-item layer-artboard ${state.selection.has(ab.id) ? 'selected' : ''}`;
      item.dataset.id = ab.id;
      item.dataset.type = 'artboard';

      item.innerHTML = `
        <span class="layer-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
        </span>
        <span class="layer-name">${escapeHTML(ab.name)}</span>
        <div class="layer-actions">
          <button class="layer-action-btn ${ab.hidden ? 'active' : ''}" data-action="toggle-visibility" title="Toggle Visibility">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button class="layer-action-btn ${ab.locked ? 'active' : ''}" data-action="toggle-lock" title="Toggle Lock">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </button>
        </div>
      `;

      this.bindLayerItemEvents(item, ab, true);
      return item;
    }

    createObjectLayerItem(obj, depth = 0) {
      const item = document.createElement('div');
      item.className = `layer-item ${state.selection.has(obj.id) ? 'selected' : ''}`;
      item.dataset.id = obj.id;
      item.dataset.type = 'object';
      item.draggable = true;

      let indentHtml = '';
      for (let i = 0; i < depth; i++) {
        indentHtml += '<span class="layer-indent"></span>';
      }

      item.innerHTML = `
        ${indentHtml}
        <span class="layer-icon">${this.getLayerIconSVG(obj.type)}</span>
        <span class="layer-name">${escapeHTML(obj.name || obj.type)}</span>
        <div class="layer-actions">
          <button class="layer-action-btn ${obj.hidden ? 'active' : ''}" data-action="toggle-visibility" title="Toggle Visibility">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button class="layer-action-btn ${obj.locked ? 'active' : ''}" data-action="toggle-lock" title="Toggle Lock">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </button>
        </div>
      `;

      this.bindLayerItemEvents(item, obj, false);
      return item;
    }

    bindLayerItemEvents(el, model, isArtboard) {
      el.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('.layer-action-btn');
        if (actionBtn) {
          const action = actionBtn.dataset.action;
          if (action === 'toggle-visibility') {
            if (isArtboard) state.updateArtboard(model.id, { hidden: !model.hidden });
            else state.updateObject(model.id, { hidden: !model.hidden });
          } else if (action === 'toggle-lock') {
            if (isArtboard) state.updateArtboard(model.id, { locked: !model.locked });
            else state.updateObject(model.id, { locked: !model.locked });
          }
          return;
        }

        if (e.shiftKey) state.toggleSelection(model.id);
        else state.setSelection([model.id]);
      });

      el.addEventListener('dblclick', (e) => {
        const nameEl = el.querySelector('.layer-name');
        if (!nameEl) return;

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'layer-name-input';
        input.value = model.name;

        nameEl.replaceWith(input);
        input.focus();
        input.select();

        const finishRename = () => {
          const newName = input.value.trim() || model.name;
          if (isArtboard) state.updateArtboard(model.id, { name: newName });
          else state.updateObject(model.id, { name: newName });
        };

        input.addEventListener('blur', finishRename);
        input.addEventListener('keydown', (ke) => {
          if (ke.key === 'Enter') finishRename();
          if (ke.key === 'Escape') this.render();
        });
      });

      el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/layer-id', model.id);
        e.dataTransfer.effectAllowed = 'move';
      });

      el.addEventListener('dragover', (e) => {
        e.preventDefault();
        el.classList.add('drag-over');
      });

      el.addEventListener('dragleave', () => {
        el.classList.remove('drag-over');
      });

      el.addEventListener('drop', (e) => {
        e.preventDefault();
        el.classList.remove('drag-over');
        const draggedId = e.dataTransfer.getData('text/layer-id');
        if (draggedId && draggedId !== model.id) {
          state.reorderObject(draggedId, 'forward');
        }
      });
    }

    updateSelectionHighlight() {
      if (!this.containerEl) return;
      const items = this.containerEl.querySelectorAll('.layer-item');
      items.forEach(it => {
        const id = it.dataset.id;
        if (state.selection.has(id)) it.classList.add('selected');
        else it.classList.remove('selected');
      });
    }

    getLayerIconSVG(type) {
      switch (type) {
        case 'text':
        case 'paragraph':
          return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>';
        case 'button':
          return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="12" x="3" y="6" rx="2"/></svg>';
        case 'input':
        case 'textarea':
          return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="14" x="3" y="5" rx="2"/><line x1="7" y1="12" x2="11" y2="12"/></svg>';
        case 'image':
        case 'video':
          return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
        case 'card':
        case 'modal':
          return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/></svg>';
        case 'navbar':
        case 'sidebar':
        case 'tabs':
          return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
        case 'table':
          return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="12" y1="3" x2="12" y2="21"/></svg>';
        default:
          return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>';
      }
    }
  }

  // ==========================================================================
  // 9. PROPERTIES INSPECTOR CONTROLLER
  // ==========================================================================
  class PropertiesController {
    constructor(containerEl) {
      this.containerEl = containerEl;
      state.on('selection:changed', () => this.render());
      state.on('project:changed', () => this.render());
    }

    render() {
      if (!this.containerEl) return;
      const selectedObjs = state.getSelectedObjects();
      const selectedArtboards = state.getSelectedArtboards();

      if (selectedObjs.length === 0 && selectedArtboards.length === 0) {
        this.containerEl.innerHTML = `
          <div class="inspector-empty-state">
            <svg class="inspector-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
            <div>Select an artboard or component to inspect and edit its properties.</div>
          </div>
        `;
        return;
      }

      if (selectedArtboards.length > 0 && selectedObjs.length === 0) {
        this.renderArtboardProperties(selectedArtboards[0]);
        this.initScrubbableLabels();
        return;
      }

      if (selectedObjs.length === 1) {
        this.renderSingleObjectProperties(selectedObjs[0]);
      } else {
        this.renderMultiObjectProperties(selectedObjs);
      }

      this.initScrubbableLabels();
    }

    initScrubbableLabels() {
      const labels = this.containerEl.querySelectorAll('.scrub-label');
      labels.forEach(label => {
        const field = label.closest('.scrub-field');
        const input = field?.querySelector('.scrub-input');
        if (!input) return;

        label.addEventListener('mousedown', (e) => {
          e.preventDefault();
          const startX = e.clientX;
          const startVal = parseFloat(input.value) || 0;

          const onMouseMove = (moveEvent) => {
            const delta = moveEvent.clientX - startX;
            const step = moveEvent.shiftKey ? 10 : 1;
            const newVal = Math.round(startVal + delta * step);
            input.value = newVal;
            input.dispatchEvent(new Event('change'));
          };

          const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
          };

          window.addEventListener('mousemove', onMouseMove);
          window.addEventListener('mouseup', onMouseUp);
        });
      });
    }

    renderArtboardProperties(ab) {
      this.containerEl.innerHTML = `
        <div class="panel-section">
          <div class="panel-section-header">Artboard Settings</div>
          <div class="prop-row">
            <span class="prop-label">Name</span>
            <input type="text" class="prop-control" id="prop-ab-name" value="${escapeHTML(ab.name)}">
          </div>
        </div>

        <div class="panel-section">
          <div class="panel-section-header">Dimensions</div>
          <div class="prop-grid-2">
            <div class="scrub-field">
              <span class="scrub-label" data-scrub="ab-w">W</span>
              <input type="number" class="scrub-input" id="prop-ab-w" value="${ab.width}">
            </div>
            <div class="scrub-field">
              <span class="scrub-label" data-scrub="ab-h">H</span>
              <input type="number" class="scrub-input" id="prop-ab-h" value="${ab.height}">
            </div>
          </div>
          <div class="prop-grid-2">
            <div class="scrub-field">
              <span class="scrub-label" data-scrub="ab-x">X</span>
              <input type="number" class="scrub-input" id="prop-ab-x" value="${ab.x}">
            </div>
            <div class="scrub-field">
              <span class="scrub-label" data-scrub="ab-y">Y</span>
              <input type="number" class="scrub-input" id="prop-ab-y" value="${ab.y}">
            </div>
          </div>
        </div>

        <div class="panel-section">
          <div class="panel-section-header">Background</div>
          <div class="prop-row">
            <span class="prop-label">Fill</span>
            <div class="color-picker-wrapper">
              <input type="color" class="color-swatch-input" id="prop-ab-bg" value="${ab.background || '#ffffff'}">
              <input type="text" class="color-hex-text" id="prop-ab-bg-hex" value="${(ab.background || '#ffffff').toUpperCase()}">
            </div>
          </div>
        </div>
      `;

      const nameIn = document.getElementById('prop-ab-name');
      nameIn.addEventListener('change', (e) => state.updateArtboard(ab.id, { name: e.target.value }));

      const wIn = document.getElementById('prop-ab-w');
      wIn.addEventListener('change', (e) => state.updateArtboard(ab.id, { width: parseInt(e.target.value) || 100 }));

      const hIn = document.getElementById('prop-ab-h');
      hIn.addEventListener('change', (e) => state.updateArtboard(ab.id, { height: parseInt(e.target.value) || 100 }));

      const xIn = document.getElementById('prop-ab-x');
      xIn.addEventListener('change', (e) => state.updateArtboard(ab.id, { x: parseInt(e.target.value) || 0 }));

      const yIn = document.getElementById('prop-ab-y');
      yIn.addEventListener('change', (e) => state.updateArtboard(ab.id, { y: parseInt(e.target.value) || 0 }));

      const bgIn = document.getElementById('prop-ab-bg');
      bgIn.addEventListener('input', (e) => {
        document.getElementById('prop-ab-bg-hex').value = e.target.value.toUpperCase();
        state.updateArtboard(ab.id, { background: e.target.value });
      });
    }

    renderSingleObjectProperties(obj) {
      const s = obj.styles || {};
      const p = obj.props || {};
      const c = obj.constraints || { horizontal: 'left', vertical: 'top' };
      const proto = obj.prototype || { targetArtboardId: null, trigger: 'click', animation: 'instant' };

      const page = state.getActivePage();
      const artboardOptions = (page.artboards || [])
        .filter(a => a.id !== obj.artboardId)
        .map(a => `<option value="${a.id}" ${proto.targetArtboardId === a.id ? 'selected' : ''}>${escapeHTML(a.name)}</option>`)
        .join('');

      this.containerEl.innerHTML = `
        <div class="panel-section" style="padding: 6px 12px;">
          <div class="alignment-grid">
            <button class="alignment-btn" id="btn-align-left" title="Align Left">
              <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="3"/><rect width="12" height="6" x="8" y="5" rx="1"/><rect width="8" height="6" x="8" y="13" rx="1"/></svg>
            </button>
            <button class="alignment-btn" id="btn-align-center-x" title="Align Horizontal Center">
              <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="21" x2="12" y2="3"/><rect width="14" height="6" x="5" y="5" rx="1"/><rect width="8" height="6" x="8" y="13" rx="1"/></svg>
            </button>
            <button class="alignment-btn" id="btn-align-right" title="Align Right">
              <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="20" y1="21" x2="20" y2="3"/><rect width="12" height="6" x="4" y="5" rx="1"/><rect width="8" height="6" x="8" y="13" rx="1"/></svg>
            </button>
            <button class="alignment-btn" id="btn-align-top" title="Align Top">
              <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="4" x2="3" y2="4"/><rect width="6" height="12" x="5" y="8" rx="1"/><rect width="6" height="8" x="13" y="8" rx="1"/></svg>
            </button>
            <button class="alignment-btn" id="btn-align-center-y" title="Align Vertical Center">
              <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="12" x2="3" y2="12"/><rect width="6" height="14" x="5" y="5" rx="1"/><rect width="6" height="8" x="13" y="8" rx="1"/></svg>
            </button>
            <button class="alignment-btn" id="btn-align-bottom" title="Align Bottom">
              <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="20" x2="3" y2="20"/><rect width="6" height="12" x="5" y="4" rx="1"/><rect width="6" height="8" x="13" y="8" rx="1"/></svg>
            </button>
          </div>
        </div>

        <div class="panel-section">
          <div class="panel-section-header">Transform</div>
          <div class="prop-grid-2">
            <div class="scrub-field">
              <span class="scrub-label" data-scrub="x">X</span>
              <input type="number" class="scrub-input" id="prop-x" value="${obj.x}">
            </div>
            <div class="scrub-field">
              <span class="scrub-label" data-scrub="y">Y</span>
              <input type="number" class="scrub-input" id="prop-y" value="${obj.y}">
            </div>
          </div>
          <div class="prop-grid-2">
            <div class="scrub-field">
              <span class="scrub-label" data-scrub="w">W</span>
              <input type="number" class="scrub-input" id="prop-w" value="${obj.width}">
            </div>
            <div class="scrub-field">
              <span class="scrub-label" data-scrub="h">H</span>
              <input type="number" class="scrub-input" id="prop-h" value="${obj.height}">
            </div>
          </div>
          <div class="prop-grid-2">
            <div class="scrub-field">
              <span class="scrub-label" data-scrub="rot">∠</span>
              <input type="number" class="scrub-input" id="prop-rot" value="${obj.rotation || 0}">
            </div>
            <div class="scrub-field">
              <span class="scrub-label" data-scrub="rad">R</span>
              <input type="number" class="scrub-input" id="prop-rad" value="${s.borderRadius || 0}">
            </div>
          </div>
        </div>

        <div class="panel-section">
          <div class="panel-section-header">Responsive Constraints</div>
          <div class="prop-row">
            <span class="prop-label">Horizontal</span>
            <select class="prop-select" id="prop-constraint-h">
              <option value="left" ${c.horizontal === 'left' ? 'selected' : ''}>Left</option>
              <option value="right" ${c.horizontal === 'right' ? 'selected' : ''}>Right</option>
              <option value="center" ${c.horizontal === 'center' ? 'selected' : ''}>Center</option>
              <option value="scale" ${c.horizontal === 'scale' ? 'selected' : ''}>Scale</option>
            </select>
          </div>
          <div class="prop-row">
            <span class="prop-label">Vertical</span>
            <select class="prop-select" id="prop-constraint-v">
              <option value="top" ${c.vertical === 'top' ? 'selected' : ''}>Top</option>
              <option value="bottom" ${c.vertical === 'bottom' ? 'selected' : ''}>Bottom</option>
              <option value="center" ${c.vertical === 'center' ? 'selected' : ''}>Center</option>
              <option value="scale" ${c.vertical === 'scale' ? 'selected' : ''}>Scale</option>
            </select>
          </div>
        </div>

        ${this.renderTypographySection(obj)}
        ${this.renderComponentSpecificSection(obj)}

        <div class="panel-section">
          <div class="panel-section-header">Appearance</div>
          <div class="prop-row">
            <span class="prop-label">Fill</span>
            <div class="color-picker-wrapper">
              <input type="color" class="color-swatch-input" id="prop-fill" value="${s.fill && s.fill.startsWith('#') ? s.fill : '#ffffff'}">
              <input type="text" class="color-hex-text" id="prop-fill-hex" value="${s.fill || '#ffffff'}">
            </div>
          </div>
          <div class="prop-row">
            <span class="prop-label">Stroke</span>
            <div class="color-picker-wrapper">
              <input type="color" class="color-swatch-input" id="prop-stroke" value="${s.stroke && s.stroke.startsWith('#') ? s.stroke : '#1f2937'}">
              <input type="text" class="color-hex-text" id="prop-stroke-hex" value="${s.stroke || '#1f2937'}">
            </div>
          </div>
          <div class="prop-row">
            <span class="prop-label">Border W</span>
            <input type="number" class="prop-control" id="prop-stroke-width" min="0" max="20" value="${s.strokeWidth !== undefined ? s.strokeWidth : 1}">
          </div>
          <div class="prop-row">
            <span class="prop-label">Opacity</span>
            <input type="range" class="prop-control" id="prop-opacity" min="0.05" max="1" step="0.05" value="${s.opacity !== undefined ? s.opacity : 1}">
          </div>
        </div>

        <div class="panel-section">
          <div class="panel-section-header">Prototype Interaction</div>
          <div class="prop-row">
            <span class="prop-label">Target</span>
            <select class="prop-select" id="prop-proto-target">
              <option value="">None (No interaction)</option>
              ${artboardOptions}
            </select>
          </div>
          <div class="prop-row">
            <span class="prop-label">Trigger</span>
            <select class="prop-select" id="prop-proto-trigger">
              <option value="click" ${proto.trigger === 'click' ? 'selected' : ''}>On Click</option>
              <option value="hover" ${proto.trigger === 'hover' ? 'selected' : ''}>On Hover</option>
            </select>
          </div>
          <div class="prop-row">
            <span class="prop-label">Animation</span>
            <select class="prop-select" id="prop-proto-anim">
              <option value="instant" ${proto.animation === 'instant' ? 'selected' : ''}>Instant</option>
              <option value="fade" ${proto.animation === 'fade' ? 'selected' : ''}>Dissolve / Fade</option>
              <option value="slide-left" ${proto.animation === 'slide-left' ? 'selected' : ''}>Slide Left</option>
              <option value="slide-right" ${proto.animation === 'slide-right' ? 'selected' : ''}>Slide Right</option>
            </select>
          </div>
        </div>
      `;

      this.bindSingleObjectEvents(obj);
    }

    renderTypographySection(obj) {
      const s = obj.styles || {};
      const textTypes = ['text', 'paragraph', 'button', 'input', 'chip', 'card', 'navbar'];
      if (!textTypes.includes(obj.type)) return '';

      return `
        <div class="panel-section">
          <div class="panel-section-header">Typography</div>
          <div class="prop-row">
            <span class="prop-label">Size</span>
            <input type="number" class="prop-control" id="prop-font-size" min="8" max="96" value="${s.fontSize || 14}">
          </div>
          <div class="prop-row">
            <span class="prop-label">Weight</span>
            <select class="prop-select" id="prop-font-weight">
              <option value="400" ${s.fontWeight === '400' ? 'selected' : ''}>400 Regular</option>
              <option value="500" ${s.fontWeight === '500' ? 'selected' : ''}>500 Medium</option>
              <option value="600" ${s.fontWeight === '600' ? 'selected' : ''}>600 SemiBold</option>
              <option value="700" ${s.fontWeight === '700' ? 'selected' : ''}>700 Bold</option>
            </select>
          </div>
          <div class="prop-row">
            <span class="prop-label">Text Color</span>
            <div class="color-picker-wrapper">
              <input type="color" class="color-swatch-input" id="prop-text-color" value="${s.textColor && s.textColor.startsWith('#') ? s.textColor : '#1f2937'}">
              <input type="text" class="color-hex-text" id="prop-text-color-hex" value="${s.textColor || '#1f2937'}">
            </div>
          </div>
        </div>
      `;
    }

    renderComponentSpecificSection(obj) {
      const p = obj.props || {};
      const type = obj.type;
      let content = '';

      if (type === 'text' || type === 'paragraph') {
        content = `
          <div class="prop-row">
            <span class="prop-label">Content</span>
            <textarea class="prop-control" id="prop-spec-text" rows="3">${escapeHTML(p.text || '')}</textarea>
          </div>
        `;
      } else if (type === 'button') {
        content = `
          <div class="prop-row">
            <span class="prop-label">Label</span>
            <input type="text" class="prop-control" id="prop-spec-label" value="${escapeHTML(p.label || '')}">
          </div>
          <div class="prop-row">
            <span class="prop-label">Variant</span>
            <select class="prop-select" id="prop-spec-variant">
              <option value="primary" ${p.variant === 'primary' ? 'selected' : ''}>Primary</option>
              <option value="secondary" ${p.variant === 'secondary' ? 'selected' : ''}>Secondary</option>
              <option value="outline" ${p.variant === 'outline' ? 'selected' : ''}>Outline</option>
              <option value="danger" ${p.variant === 'danger' ? 'selected' : ''}>Danger</option>
              <option value="ghost" ${p.variant === 'ghost' ? 'selected' : ''}>Ghost</option>
            </select>
          </div>
        `;
      } else if (type === 'input' || type === 'textarea') {
        content = `
          <div class="prop-row">
            <span class="prop-label">Placeholder</span>
            <input type="text" class="prop-control" id="prop-spec-placeholder" value="${escapeHTML(p.placeholder || '')}">
          </div>
          <div class="prop-row">
            <span class="prop-label">Value</span>
            <input type="text" class="prop-control" id="prop-spec-val" value="${escapeHTML(p.value || '')}">
          </div>
        `;
      } else if (type === 'checkbox' || type === 'radio' || type === 'toggle') {
        content = `
          <div class="prop-row">
            <span class="prop-label">Label</span>
            <input type="text" class="prop-control" id="prop-spec-label" value="${escapeHTML(p.label || '')}">
          </div>
          <div class="prop-row">
            <span class="prop-label">Checked</span>
            <input type="checkbox" id="prop-spec-checked" ${p.checked ? 'checked' : ''}>
          </div>
        `;
      } else if (type === 'card') {
        content = `
          <div class="prop-row">
            <span class="prop-label">Title</span>
            <input type="text" class="prop-control" id="prop-spec-title" value="${escapeHTML(p.title || '')}">
          </div>
          <div class="prop-row">
            <span class="prop-label">Body</span>
            <textarea class="prop-control" id="prop-spec-body" rows="2">${escapeHTML(p.body || '')}</textarea>
          </div>
          <div class="prop-row">
            <span class="prop-label">Show Image</span>
            <input type="checkbox" id="prop-spec-has-img" ${p.hasImage ? 'checked' : ''}>
          </div>
        `;
      } else if (type === 'navbar') {
        content = `
          <div class="prop-row">
            <span class="prop-label">Brand</span>
            <input type="text" class="prop-control" id="prop-spec-brand" value="${escapeHTML(p.brand || '')}">
          </div>
          <div class="prop-row">
            <span class="prop-label">Links</span>
            <input type="text" class="prop-control" id="prop-spec-links" value="${(p.links || []).join(', ')}">
          </div>
        `;
      }

      if (!content) return '';
      return `
        <div class="panel-section">
          <div class="panel-section-header">Component Properties</div>
          ${content}
        </div>
      `;
    }

    bindSingleObjectEvents(obj) {
      document.getElementById('prop-x')?.addEventListener('change', (e) => state.updateObject(obj.id, { x: parseInt(e.target.value) || 0 }));
      document.getElementById('prop-y')?.addEventListener('change', (e) => state.updateObject(obj.id, { y: parseInt(e.target.value) || 0 }));
      document.getElementById('prop-w')?.addEventListener('change', (e) => state.updateObject(obj.id, { width: parseInt(e.target.value) || 10 }));
      document.getElementById('prop-h')?.addEventListener('change', (e) => state.updateObject(obj.id, { height: parseInt(e.target.value) || 10 }));
      document.getElementById('prop-rot')?.addEventListener('change', (e) => state.updateObject(obj.id, { rotation: parseInt(e.target.value) || 0 }));
      document.getElementById('prop-rad')?.addEventListener('change', (e) => state.updateObject(obj.id, { styles: { borderRadius: parseInt(e.target.value) || 0 } }));

      document.getElementById('btn-align-left')?.addEventListener('click', () => this.alignSingle(obj, 'left'));
      document.getElementById('btn-align-center-x')?.addEventListener('click', () => this.alignSingle(obj, 'centerX'));
      document.getElementById('btn-align-right')?.addEventListener('click', () => this.alignSingle(obj, 'right'));
      document.getElementById('btn-align-top')?.addEventListener('click', () => this.alignSingle(obj, 'top'));
      document.getElementById('btn-align-center-y')?.addEventListener('click', () => this.alignSingle(obj, 'centerY'));
      document.getElementById('btn-align-bottom')?.addEventListener('click', () => this.alignSingle(obj, 'bottom'));

      document.getElementById('prop-constraint-h')?.addEventListener('change', (e) => {
        state.updateObject(obj.id, { constraints: { horizontal: e.target.value } });
      });
      document.getElementById('prop-constraint-v')?.addEventListener('change', (e) => {
        state.updateObject(obj.id, { constraints: { vertical: e.target.value } });
      });

      document.getElementById('prop-fill')?.addEventListener('input', (e) => {
        document.getElementById('prop-fill-hex').value = e.target.value;
        state.updateObject(obj.id, { styles: { fill: e.target.value } });
      });

      document.getElementById('prop-stroke')?.addEventListener('input', (e) => {
        document.getElementById('prop-stroke-hex').value = e.target.value;
        state.updateObject(obj.id, { styles: { stroke: e.target.value } });
      });

      document.getElementById('prop-stroke-width')?.addEventListener('change', (e) => {
        state.updateObject(obj.id, { styles: { strokeWidth: parseInt(e.target.value) || 0 } });
      });

      document.getElementById('prop-opacity')?.addEventListener('input', (e) => {
        state.updateObject(obj.id, { styles: { opacity: parseFloat(e.target.value) } });
      });

      document.getElementById('prop-font-size')?.addEventListener('change', (e) => state.updateObject(obj.id, { styles: { fontSize: parseInt(e.target.value) || 14 } }));
      document.getElementById('prop-font-weight')?.addEventListener('change', (e) => state.updateObject(obj.id, { styles: { fontWeight: e.target.value } }));
      document.getElementById('prop-text-color')?.addEventListener('input', (e) => {
        document.getElementById('prop-text-color-hex').value = e.target.value;
        state.updateObject(obj.id, { styles: { textColor: e.target.value } });
      });

      document.getElementById('prop-spec-text')?.addEventListener('input', (e) => state.updateObject(obj.id, { props: { text: e.target.value } }));
      document.getElementById('prop-spec-label')?.addEventListener('input', (e) => state.updateObject(obj.id, { props: { label: e.target.value } }));
      document.getElementById('prop-spec-variant')?.addEventListener('change', (e) => state.updateObject(obj.id, { props: { variant: e.target.value } }));
      document.getElementById('prop-spec-placeholder')?.addEventListener('input', (e) => state.updateObject(obj.id, { props: { placeholder: e.target.value } }));
      document.getElementById('prop-spec-val')?.addEventListener('input', (e) => state.updateObject(obj.id, { props: { value: e.target.value } }));
      document.getElementById('prop-spec-checked')?.addEventListener('change', (e) => state.updateObject(obj.id, { props: { checked: e.target.checked } }));
      document.getElementById('prop-spec-title')?.addEventListener('input', (e) => state.updateObject(obj.id, { props: { title: e.target.value } }));
      document.getElementById('prop-spec-body')?.addEventListener('input', (e) => state.updateObject(obj.id, { props: { body: e.target.value } }));
      document.getElementById('prop-spec-has-img')?.addEventListener('change', (e) => state.updateObject(obj.id, { props: { hasImage: e.target.checked } }));
      document.getElementById('prop-spec-brand')?.addEventListener('input', (e) => state.updateObject(obj.id, { props: { brand: e.target.value } }));
      document.getElementById('prop-spec-links')?.addEventListener('change', (e) => {
        const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
        state.updateObject(obj.id, { props: { links: arr } });
      });

      document.getElementById('prop-proto-target')?.addEventListener('change', (e) => {
        state.updateObject(obj.id, { prototype: { targetArtboardId: e.target.value || null } });
      });
      document.getElementById('prop-proto-trigger')?.addEventListener('change', (e) => {
        state.updateObject(obj.id, { prototype: { trigger: e.target.value } });
      });
      document.getElementById('prop-proto-anim')?.addEventListener('change', (e) => {
        state.updateObject(obj.id, { prototype: { animation: e.target.value } });
      });
    }

    renderMultiObjectProperties(objs) {
      this.containerEl.innerHTML = `
        <div class="panel-section" style="padding: 6px 12px;">
          <div class="alignment-grid">
            <button class="alignment-btn" id="btn-multi-align-left" title="Align Left">
              <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="3"/><rect width="12" height="6" x="8" y="5" rx="1"/><rect width="8" height="6" x="8" y="13" rx="1"/></svg>
            </button>
            <button class="alignment-btn" id="btn-multi-align-center-x" title="Align Horizontal Center">
              <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="21" x2="12" y2="3"/><rect width="14" height="6" x="5" y="5" rx="1"/><rect width="8" height="6" x="8" y="13" rx="1"/></svg>
            </button>
            <button class="alignment-btn" id="btn-multi-align-right" title="Align Right">
              <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="20" y1="21" x2="20" y2="3"/><rect width="12" height="6" x="4" y="5" rx="1"/><rect width="8" height="6" x="8" y="13" rx="1"/></svg>
            </button>
            <button class="alignment-btn" id="btn-multi-align-top" title="Align Top">
              <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="4" x2="3" y2="4"/><rect width="6" height="12" x="5" y="8" rx="1"/><rect width="6" height="8" x="13" y="8" rx="1"/></svg>
            </button>
            <button class="alignment-btn" id="btn-multi-align-center-y" title="Align Vertical Center">
              <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="12" x2="3" y2="12"/><rect width="6" height="14" x="5" y="5" rx="1"/><rect width="6" height="8" x="13" y="8" rx="1"/></svg>
            </button>
            <button class="alignment-btn" id="btn-multi-align-bottom" title="Align Bottom">
              <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="20" x2="3" y2="20"/><rect width="6" height="12" x="5" y="4" rx="1"/><rect width="6" height="8" x="13" y="8" rx="1"/></svg>
            </button>
          </div>
        </div>

        <div class="panel-section">
          <div class="panel-section-header">${objs.length} Objects Selected</div>
          <div class="prop-row">
            <button class="btn-primary" id="btn-group-selection" style="width: 100%;">Group Selection (Ctrl+G)</button>
          </div>
          <div class="prop-row">
            <button id="btn-distribute-h" style="flex: 1;">Distribute Horizontally</button>
            <button id="btn-distribute-v" style="flex: 1;">Distribute Vertically</button>
          </div>
        </div>
      `;

      document.getElementById('btn-multi-align-left')?.addEventListener('click', () => this.alignMultiple(objs, 'left'));
      document.getElementById('btn-multi-align-center-x')?.addEventListener('click', () => this.alignMultiple(objs, 'centerX'));
      document.getElementById('btn-multi-align-right')?.addEventListener('click', () => this.alignMultiple(objs, 'right'));
      document.getElementById('btn-multi-align-top')?.addEventListener('click', () => this.alignMultiple(objs, 'top'));
      document.getElementById('btn-multi-align-center-y')?.addEventListener('click', () => this.alignMultiple(objs, 'centerY'));
      document.getElementById('btn-multi-align-bottom')?.addEventListener('click', () => this.alignMultiple(objs, 'bottom'));

      document.getElementById('btn-group-selection')?.addEventListener('click', () => state.groupObjects(objs.map(o => o.id)));
      document.getElementById('btn-distribute-h')?.addEventListener('click', () => this.distributeMultiple(objs, 'h'));
      document.getElementById('btn-distribute-v')?.addEventListener('click', () => this.distributeMultiple(objs, 'v'));
    }

    alignSingle(obj, alignment) {
      const page = state.getActivePage();
      if (!obj.artboardId) return;
      const ab = page.artboards.find(a => a.id === obj.artboardId);
      if (!ab) return;

      let newX = obj.x;
      let newY = obj.y;

      if (alignment === 'left') newX = 0;
      else if (alignment === 'centerX') newX = Math.round((ab.width - obj.width) / 2);
      else if (alignment === 'right') newX = ab.width - obj.width;
      else if (alignment === 'top') newY = 0;
      else if (alignment === 'centerY') newY = Math.round((ab.height - obj.height) / 2);
      else if (alignment === 'bottom') newY = ab.height - obj.height;

      state.updateObject(obj.id, { x: newX, y: newY });
    }

    alignMultiple(objs, alignment) {
      let minX = Math.min(...objs.map(o => o.x));
      let maxX = Math.max(...objs.map(o => o.x + o.width));
      let minY = Math.min(...objs.map(o => o.y));
      let maxY = Math.max(...objs.map(o => o.y + o.height));
      let centerX = Math.round((minX + maxX) / 2);
      let centerY = Math.round((minY + maxY) / 2);

      const updates = {};
      objs.forEach(o => {
        let x = o.x;
        let y = o.y;
        if (alignment === 'left') x = minX;
        else if (alignment === 'centerX') x = Math.round(centerX - o.width / 2);
        else if (alignment === 'right') x = maxX - o.width;
        else if (alignment === 'top') y = minY;
        else if (alignment === 'centerY') y = Math.round(centerY - o.height / 2);
        else if (alignment === 'bottom') y = maxY - o.height;
        updates[o.id] = { x, y };
      });

      state.updateMultipleObjects(updates);
    }

    distributeMultiple(objs, direction) {
      if (objs.length < 3) return;
      const updates = {};
      if (direction === 'h') {
        const sorted = [...objs].sort((a, b) => a.x - b.x);
        const minX = sorted[0].x;
        const last = sorted[sorted.length - 1];
        const maxX = last.x + last.width;
        const totalItemW = sorted.reduce((sum, o) => sum + o.width, 0);
        const gap = (maxX - minX - totalItemW) / (sorted.length - 1);

        let currentX = minX;
        sorted.forEach((o) => {
          updates[o.id] = { x: Math.round(currentX) };
          currentX += o.width + gap;
        });
      } else {
        const sorted = [...objs].sort((a, b) => a.y - b.y);
        const minY = sorted[0].y;
        const last = sorted[sorted.length - 1];
        const maxY = last.y + last.height;
        const totalItemH = sorted.reduce((sum, o) => sum + o.height, 0);
        const gap = (maxY - minY - totalItemH) / (sorted.length - 1);

        let currentY = minY;
        sorted.forEach((o) => {
          updates[o.id] = { y: Math.round(currentY) };
          currentY += o.height + gap;
        });
      }
      state.updateMultipleObjects(updates);
    }
  }

  // ==========================================================================
  // 10. FULLSCREEN PROTOTYPE PLAYER CONTROLLER
  // ==========================================================================
  class PrototypeController {
    constructor(playerOverlayEl, screenCanvasEl, playerTitleEl, playerDeviceSelectEl) {
      this.playerOverlayEl = playerOverlayEl;
      this.screenCanvasEl = screenCanvasEl;
      this.playerTitleEl = playerTitleEl;
      this.playerDeviceSelectEl = playerDeviceSelectEl;
      this.activeArtboardId = null;
      this.startArtboardId = null;
      this.history = [];
      this.showHints = true;
      this.currentDevice = 'macbook';

      this.initPlayerEvents();
    }

    initPlayerEvents() {
      if (!this.playerOverlayEl) return;

      this.playerOverlayEl.querySelector('#btn-player-close')?.addEventListener('click', () => this.closePlayer());
      this.playerOverlayEl.querySelector('#btn-player-restart')?.addEventListener('click', () => {
        if (this.startArtboardId) {
          this.navigateToArtboard(this.startArtboardId, 'fade');
          this.history = [this.startArtboardId];
        }
      });
      this.playerOverlayEl.querySelector('#btn-player-back')?.addEventListener('click', () => {
        if (this.history.length > 1) {
          this.history.pop();
          const prevId = this.history[this.history.length - 1];
          this.navigateToArtboard(prevId, 'slide-right');
        }
      });

      this.playerDeviceSelectEl?.addEventListener('change', (e) => {
        this.setDeviceFrame(e.target.value);
      });

      this.playerOverlayEl.querySelector('#btn-player-fullscreen')?.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          this.playerOverlayEl.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });

      this.screenCanvasEl.addEventListener('click', (e) => {
        const isHotspot = e.target.closest('[data-proto-target]');
        if (!isHotspot && this.showHints) this.flashHotspotHints();
      });

      window.addEventListener('keydown', (e) => {
        if (this.playerOverlayEl.classList.contains('active')) {
          if (e.key === 'Escape') this.closePlayer();
          else if (e.key === 'Backspace' || e.key === 'ArrowLeft') {
            if (this.history.length > 1) {
              this.history.pop();
              this.navigateToArtboard(this.history[this.history.length - 1], 'slide-right');
            }
          } else if (e.key === 'r' || e.key === 'R') {
            if (this.startArtboardId) {
              this.navigateToArtboard(this.startArtboardId, 'fade');
              this.history = [this.startArtboardId];
            }
          }
        }
      });
    }

    openPlayer(startArtboardId = null) {
      const page = state.getActivePage();
      const artboards = page.artboards || [];
      if (artboards.length === 0) {
        alert('Create at least one artboard before presenting prototype.');
        return;
      }

      this.startArtboardId = startArtboardId || state.getSelectedArtboards()[0]?.id || artboards[0].id;
      this.activeArtboardId = this.startArtboardId;
      this.history = [this.startArtboardId];

      const targetAb = artboards.find(a => a.id === this.startArtboardId);
      this.currentDevice = (targetAb && targetAb.width <= 500) ? 'iphone' : 'macbook';
      if (this.playerDeviceSelectEl) this.playerDeviceSelectEl.value = this.currentDevice;

      this.playerOverlayEl.classList.add('active');
      this.setDeviceFrame(this.currentDevice);
      this.navigateToArtboard(this.startArtboardId, 'instant');
    }

    closePlayer() {
      this.playerOverlayEl.classList.remove('active');
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    }

    setDeviceFrame(device) {
      this.currentDevice = device;
      const wrapper = this.playerOverlayEl.querySelector('#device-frame-container');
      if (!wrapper) return;
      wrapper.className = 'device-frame-wrapper';
      if (device === 'macbook') wrapper.classList.add('device-frame-macbook');
      else if (device === 'iphone') wrapper.classList.add('device-frame-iphone');
    }

    navigateToArtboard(artboardId, transition = 'instant') {
      const page = state.getActivePage();
      const ab = page.artboards.find(a => a.id === artboardId);
      if (!ab) return;

      this.activeArtboardId = artboardId;
      if (this.playerTitleEl) this.playerTitleEl.textContent = ab.name;

      this.screenCanvasEl.style.width = `${ab.width}px`;
      this.screenCanvasEl.style.height = `${ab.height}px`;
      this.screenCanvasEl.style.backgroundColor = ab.background || '#ffffff';
      this.screenCanvasEl.innerHTML = '';

      const childObjs = page.objects.filter(o => o.artboardId === ab.id && !o.hidden);
      childObjs.forEach(obj => {
        const el = document.createElement('div');
        el.className = 'wf-object';
        el.style.left = `${obj.x}px`;
        el.style.top = `${obj.y}px`;
        el.style.width = `${obj.width}px`;
        el.style.height = `${obj.height}px`;
        if (obj.rotation) el.style.transform = `rotate(${obj.rotation}deg)`;

        const s = obj.styles || {};
        if (s.fill && s.fill !== 'transparent') el.style.backgroundColor = s.fill;
        if (s.stroke && s.strokeWidth > 0 && s.stroke !== 'transparent') {
          el.style.border = `${s.strokeWidth}px ${s.strokeStyle || 'solid'} ${s.stroke}`;
        }
        if (s.borderRadius !== undefined) el.style.borderRadius = `${s.borderRadius}px`;
        if (s.opacity !== undefined) el.style.opacity = s.opacity;

        el.innerHTML = this.getComponentInnerHtml(obj);

        if (obj.prototype && obj.prototype.targetArtboardId) {
          el.dataset.protoTarget = obj.prototype.targetArtboardId;
          el.dataset.protoAnim = obj.prototype.animation || 'slide-left';
          el.style.cursor = 'pointer';

          if (obj.prototype.trigger === 'hover') {
            el.addEventListener('mouseenter', () => {
              this.handleHotspotTrigger(obj.prototype.targetArtboardId, obj.prototype.animation);
            });
          } else {
            el.addEventListener('click', (e) => {
              e.stopPropagation();
              this.handleHotspotTrigger(obj.prototype.targetArtboardId, obj.prototype.animation);
            });
          }
        }

        this.screenCanvasEl.appendChild(el);
      });

      this.screenCanvasEl.className = 'player-screen-canvas';
      if (transition === 'fade') this.screenCanvasEl.classList.add('screen-transition-fade-enter');
      else if (transition === 'slide-left') this.screenCanvasEl.classList.add('screen-transition-slide-left-enter');
      else if (transition === 'slide-right') this.screenCanvasEl.classList.add('screen-transition-slide-right-enter');
    }

    handleHotspotTrigger(targetArtboardId, animation) {
      if (!targetArtboardId) return;
      this.history.push(targetArtboardId);
      this.navigateToArtboard(targetArtboardId, animation);
    }

    flashHotspotHints() {
      const hotspots = this.screenCanvasEl.querySelectorAll('[data-proto-target]');
      hotspots.forEach(el => {
        const hint = document.createElement('div');
        hint.className = 'hotspot-flash-hint';
        hint.style.left = el.style.left;
        hint.style.top = el.style.top;
        hint.style.width = el.style.width;
        hint.style.height = el.style.height;
        hint.style.borderRadius = el.style.borderRadius || '4px';
        this.screenCanvasEl.appendChild(hint);
        setTimeout(() => hint.remove(), 800);
      });
    }

    getComponentInnerHtml(obj) {
      const p = obj.props || {};
      const s = obj.styles || {};
      if (obj.type === 'button') {
        return `<div class="wf-node wf-button variant-${p.variant || 'primary'}" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:${s.fill || '#1f2937'};color:${s.textColor || '#fff'};border-radius:${s.borderRadius || 6}px;">${escapeHTML(p.label || 'Button')}</div>`;
      }
      if (obj.type === 'text') {
        return `<div class="wf-node wf-text" style="font-size:${s.fontSize || 20}px;font-weight:${s.fontWeight || '600'};color:${s.textColor || '#1f2937'};">${escapeHTML(p.text || '')}</div>`;
      }
      if (obj.type === 'image') {
        return `<div class="wf-node wf-image" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#e5e7eb;color:#6b7280;"><span style="font-size:11px;font-weight:600;">${escapeHTML(p.label || 'Media')}</span></div>`;
      }
      if (obj.type === 'card') {
        return `
          <div class="wf-node wf-card" style="width:100%;height:100%;background:#fff;border-radius:${s.borderRadius || 8}px;display:flex;flex-direction:column;">
            <div style="padding:10px 14px;font-weight:600;font-size:14px;border-bottom:1px solid #f3f4f6;">${escapeHTML(p.title || 'Card')}</div>
            <div style="padding:12px 14px;font-size:12px;color:#4b5563;flex:1;">${escapeHTML(p.body || '')}</div>
          </div>
        `;
      }
      return '';
    }
  }

  // ==========================================================================
  // 11. EXPORT CONTROLLER
  // ==========================================================================
  class ExportController {
    exportProjectJSON() {
      const project = state.project;
      const jsonStr = JSON.stringify(project, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name.toLowerCase().replace(/[^a-z0-9]/gi, '_')}.wireframelab.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    importProjectJSON(jsonString) {
      try {
        const data = JSON.parse(jsonString);
        if (!data || typeof data !== 'object') throw new Error('Invalid JSON');
        const repaired = {
          id: data.id || generateId('proj'),
          name: typeof data.name === 'string' ? data.name : 'Imported Project',
          version: data.version || '1.0',
          createdAt: data.createdAt || Date.now(),
          updatedAt: Date.now(),
          activePageId: data.activePageId || 'page_1',
          pages: Array.isArray(data.pages) && data.pages.length > 0 ? data.pages : [
            {
              id: 'page_1',
              name: 'Page 1',
              artboards: Array.isArray(data.artboards) ? data.artboards : [],
              objects: Array.isArray(data.objects) ? data.objects : []
            }
          ]
        };

        state.setProject(repaired);
        return { success: true, project: repaired };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    exportArtboardAsPNG(artboardId, scale = 2) {
      const page = state.getActivePage();
      const ab = page.artboards.find(a => a.id === artboardId) || page.artboards[0];
      if (!ab) return;

      const childObjs = page.objects.filter(o => o.artboardId === ab.id && !o.hidden);
      const canvas = document.createElement('canvas');
      canvas.width = ab.width * scale;
      canvas.height = ab.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.scale(scale, scale);

      ctx.fillStyle = ab.background || '#ffffff';
      ctx.fillRect(0, 0, ab.width, ab.height);

      for (const obj of childObjs) {
        ctx.save();
        ctx.translate(obj.x + obj.width / 2, obj.y + obj.height / 2);
        if (obj.rotation) ctx.rotate((obj.rotation * Math.PI) / 180);
        ctx.translate(-obj.width / 2, -obj.height / 2);

        const s = obj.styles || {};
        const p = obj.props || {};
        const rad = s.borderRadius || 0;

        if (s.fill && s.fill !== 'transparent') {
          ctx.fillStyle = s.fill;
          this.roundRect(ctx, 0, 0, obj.width, obj.height, rad);
          ctx.fill();
        }

        if (s.stroke && s.strokeWidth > 0 && s.stroke !== 'transparent') {
          ctx.strokeStyle = s.stroke;
          ctx.lineWidth = s.strokeWidth;
          this.roundRect(ctx, 0, 0, obj.width, obj.height, rad);
          ctx.stroke();
        }

        if (obj.type === 'text' || obj.type === 'paragraph') {
          ctx.fillStyle = s.textColor || '#1f2937';
          ctx.font = `${s.fontWeight || '600'} ${s.fontSize || 14}px sans-serif`;
          ctx.textBaseline = 'top';
          ctx.fillText(p.text || '', 0, 0, obj.width);
        } else if (obj.type === 'button') {
          ctx.fillStyle = s.textColor || '#ffffff';
          ctx.font = '600 13px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.label || 'Button', obj.width / 2, obj.height / 2);
        }

        ctx.restore();
      }

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${ab.name.toLowerCase().replace(/[^a-z0-9]/gi, '_')}@${scale}x.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 'image/png');
    }

    roundRect(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }

    exportArtboardAsSVG(artboardId) {
      const page = state.getActivePage();
      const ab = page.artboards.find(a => a.id === artboardId) || page.artboards[0];
      if (!ab) return;

      const childObjs = page.objects.filter(o => o.artboardId === ab.id && !o.hidden);
      let svgElements = '';
      childObjs.forEach(obj => {
        const s = obj.styles || {};
        const p = obj.props || {};
        svgElements += `
          <g transform="translate(${obj.x}, ${obj.y}) rotate(${obj.rotation || 0} ${obj.width/2} ${obj.height/2})">
            <rect width="${obj.width}" height="${obj.height}" rx="${s.borderRadius || 0}" fill="${s.fill || '#fff'}" stroke="${s.stroke || '#1f2937'}" stroke-width="${s.strokeWidth || 1}"/>
            ${obj.type === 'button' ? `<text x="${obj.width/2}" y="${obj.height/2 + 4}" font-family="sans-serif" font-size="13" font-weight="600" fill="${s.textColor || '#fff'}" text-anchor="middle">${escapeHTML(p.label || 'Button')}</text>` : ''}
            ${obj.type === 'text' ? `<text x="0" y="20" font-family="sans-serif" font-size="${s.fontSize || 16}" font-weight="${s.fontWeight || '600'}" fill="${s.textColor || '#1f2937'}">${escapeHTML(p.text || 'Text')}</text>` : ''}
          </g>
        `;
      });

      const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${ab.width}" height="${ab.height}" viewBox="0 0 ${ab.width} ${ab.height}">
          <rect width="${ab.width}" height="${ab.height}" fill="${ab.background || '#ffffff'}"/>
          ${svgElements}
        </svg>
      `;

      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${ab.name.toLowerCase().replace(/[^a-z0-9]/gi, '_')}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    exportHTMLWireframe(artboardId) {
      const page = state.getActivePage();
      const ab = page.artboards.find(a => a.id === artboardId) || page.artboards[0];
      if (!ab) return;

      const childObjs = page.objects.filter(o => o.artboardId === ab.id && !o.hidden);
      let elementsHtml = '';

      childObjs.forEach(obj => {
        const s = obj.styles || {};
        const p = obj.props || {};
        elementsHtml += `
          <div style="position: absolute; left: ${obj.x}px; top: ${obj.y}px; width: ${obj.width}px; height: ${obj.height}px; background: ${s.fill || 'transparent'}; border: ${s.strokeWidth || 1}px solid ${s.stroke || '#1f2937'}; border-radius: ${s.borderRadius || 4}px; font-family: sans-serif; display: flex; align-items: center; justify-content: center;">
            ${escapeHTML(p.label || p.text || p.title || '')}
          </div>
        `;
      });

      const htmlDoc = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>${escapeHTML(ab.name)} - WireframeLab</title>
          <style>
            body { margin: 0; padding: 40px; background: #f3f4f6; display: flex; justify-content: center; font-family: -apple-system, sans-serif; }
            .artboard { width: ${ab.width}px; height: ${ab.height}px; background: ${ab.background || '#ffffff'}; position: relative; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border-radius: 4px; overflow: hidden; }
          </style>
        </head>
        <body>
          <div class="artboard">
            ${elementsHtml}
          </div>
        </body>
        </html>
      `;

      const blob = new Blob([htmlDoc], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${ab.name.toLowerCase().replace(/[^a-z0-9]/gi, '_')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }

  // ==========================================================================
  // 12. COMMAND PALETTE CONTROLLER
  // ==========================================================================
  class CommandPaletteController {
    constructor(overlayEl, searchInputEl, resultsListEl) {
      this.overlayEl = overlayEl;
      this.searchInputEl = searchInputEl;
      this.resultsListEl = resultsListEl;
      this.selectedIndex = 0;
      this.commands = [];

      this.buildCommands();
      this.initEvents();
    }

    buildCommands() {
      this.commands = [
        { id: 'tool-select', title: 'Select Tool', group: 'Tools', shortcut: 'V', action: () => state.setActiveTool('select') },
        { id: 'tool-hand', title: 'Hand / Pan Tool', group: 'Tools', shortcut: 'H / Space', action: () => state.setActiveTool('hand') },
        { id: 'tool-artboard', title: 'Add New Artboard', group: 'Tools', shortcut: 'A', action: () => state.setActiveTool('artboard') },
        { id: 'tool-box', title: 'Draw Rectangle', group: 'Tools', shortcut: 'R', action: () => state.setActiveTool('box') },
        { id: 'tool-text', title: 'Add Text Block', group: 'Tools', shortcut: 'T', action: () => state.setActiveTool('text') },
        { id: 'act-undo', title: 'Undo', group: 'Edit', shortcut: 'Ctrl+Z', action: () => state.undo() },
        { id: 'act-redo', title: 'Redo', group: 'Edit', shortcut: 'Ctrl+Y', action: () => state.redo() },
        { id: 'act-duplicate', title: 'Duplicate Selection', group: 'Edit', shortcut: 'Ctrl+D', action: () => state.duplicateSelection() },
        { id: 'act-delete', title: 'Delete Selection', group: 'Edit', shortcut: 'Delete', action: () => state.deleteSelection() },
        { id: 'act-group', title: 'Group Selection', group: 'Edit', shortcut: 'Ctrl+G', action: () => state.groupObjects(Array.from(state.selection)) },
        { id: 'view-proto', title: 'Toggle Prototype Mode', group: 'View', shortcut: 'Shift+E', action: () => state.setMode(state.mode === 'design' ? 'prototype' : 'design') },
        { id: 'view-theme', title: 'Toggle Light / Dark Theme', group: 'View', shortcut: '', action: () => state.setTheme(state.theme === 'theme-dark' ? 'theme-light' : 'theme-dark') },
        { id: 'view-fit', title: 'Zoom to Fit All Artboards', group: 'View', shortcut: 'Shift+1', action: () => window.appCanvasCtrl?.zoomToFitAll() },
        { id: 'view-100', title: 'Zoom to 100%', group: 'View', shortcut: 'Shift+0', action: () => window.appCanvasCtrl?.resetZoom() },
        ...Object.entries(ARTBOARD_PRESETS).map(([key, preset]) => ({
          id: `ab-preset-${key}`,
          title: `Insert Artboard: ${preset.name} (${preset.width}×${preset.height})`,
          group: 'Artboards',
          shortcut: '',
          action: () => {
            const ab = {
              id: generateId('ab'),
              name: `${preset.name} — ${preset.width} × ${preset.height}`,
              preset: key,
              x: 100,
              y: 80,
              width: preset.width,
              height: preset.height,
              background: '#ffffff',
              locked: false,
              hidden: false
            };
            state.addArtboard(ab);
          }
        })),
        ...COMPONENT_DEFINITIONS.map(comp => ({
          id: `insert-${comp.type}`,
          title: `Insert Component: ${comp.name}`,
          group: 'Components',
          shortcut: '',
          action: () => {
            const obj = createObjectFromType(comp.type);
            const page = state.getActivePage();
            const firstAb = page.artboards[0];
            if (firstAb) {
              obj.x = Math.round((firstAb.width - obj.width) / 2);
              obj.y = Math.round((firstAb.height - obj.height) / 2);
              state.addObject(obj, firstAb.id);
            } else {
              obj.x = 200;
              obj.y = 200;
              state.addObject(obj, null);
            }
          }
        }))
      ];
    }

    initEvents() {
      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          this.open();
        }
      });

      if (!this.overlayEl) return;
      this.overlayEl.addEventListener('click', (e) => {
        if (e.target === this.overlayEl) this.close();
      });

      this.searchInputEl.addEventListener('input', () => this.filterResults());
      this.searchInputEl.addEventListener('keydown', (e) => this.onInputKeyDown(e));
    }

    open() {
      this.overlayEl.classList.add('active');
      this.searchInputEl.value = '';
      this.selectedIndex = 0;
      this.filterResults();
      setTimeout(() => this.searchInputEl.focus(), 50);
    }

    close() {
      this.overlayEl.classList.remove('active');
    }

    filterResults() {
      const query = this.searchInputEl.value.trim().toLowerCase();
      const filtered = this.commands.filter(cmd => 
        cmd.title.toLowerCase().includes(query) || cmd.group.toLowerCase().includes(query)
      );
      this.renderResults(filtered);
    }

    renderResults(results) {
      this.resultsListEl.innerHTML = '';
      if (results.length === 0) {
        this.resultsListEl.innerHTML = `
          <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 12px;">
            No matching actions found.
          </div>
        `;
        return;
      }

      let currentGroup = '';
      results.forEach((cmd, idx) => {
        if (cmd.group !== currentGroup) {
          currentGroup = cmd.group;
          const groupEl = document.createElement('div');
          groupEl.className = 'palette-group-title';
          groupEl.textContent = currentGroup;
          this.resultsListEl.appendChild(groupEl);
        }

        const item = document.createElement('div');
        item.className = `palette-item ${idx === this.selectedIndex ? 'active' : ''}`;
        item.dataset.index = idx;
        item.innerHTML = `
          <div class="palette-item-left">
            <span>${escapeHTML(cmd.title)}</span>
          </div>
          ${cmd.shortcut ? `<kbd>${cmd.shortcut}</kbd>` : ''}
        `;

        item.addEventListener('click', () => {
          this.close();
          cmd.action();
        });

        this.resultsListEl.appendChild(item);
      });
    }

    onInputKeyDown(e) {
      const items = this.resultsListEl.querySelectorAll('.palette-item');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.selectedIndex = Math.min(items.length - 1, this.selectedIndex + 1);
        this.updateActiveItem();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.selectedIndex = Math.max(0, this.selectedIndex - 1);
        this.updateActiveItem();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const activeEl = items[this.selectedIndex];
        if (activeEl) activeEl.click();
      } else if (e.key === 'Escape') {
        this.close();
      }
    }

    updateActiveItem() {
      const items = this.resultsListEl.querySelectorAll('.palette-item');
      items.forEach((it, idx) => {
        if (idx === this.selectedIndex) {
          it.classList.add('active');
          it.scrollIntoView({ block: 'nearest' });
        } else {
          it.classList.remove('active');
        }
      });
    }
  }

  // ==========================================================================
  // 13. KEYBOARD SHORTCUTS MANAGER
  // ==========================================================================
  class ShortcutsManager {
    constructor() {
      this.init();
    }

    init() {
      window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    isInputFocused(target) {
      return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
    }

    handleKeyDown(e) {
      if (this.isInputFocused(e.target)) {
        if (e.key === 'Escape') e.target.blur();
        return;
      }

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      if (!isCtrlOrCmd && !e.shiftKey) {
        if (e.key.toLowerCase() === 'v') { e.preventDefault(); state.setActiveTool('select'); }
        else if (e.key.toLowerCase() === 'h') { e.preventDefault(); state.setActiveTool('hand'); }
        else if (e.key.toLowerCase() === 'a') { e.preventDefault(); state.setActiveTool('artboard'); }
        else if (e.key.toLowerCase() === 'r') { e.preventDefault(); state.setActiveTool('box'); }
        else if (e.key.toLowerCase() === 't') { e.preventDefault(); state.setActiveTool('text'); }
      }

      if (isCtrlOrCmd && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) state.redo();
        else state.undo();
        return;
      }
      if (isCtrlOrCmd && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        state.redo();
        return;
      }

      if (isCtrlOrCmd && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        state.duplicateSelection();
        return;
      }

      if (isCtrlOrCmd && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        const selected = state.getSelectedObjects();
        if (selected.length > 0) state.clipboard = JSON.parse(JSON.stringify(selected));
        return;
      }

      if (isCtrlOrCmd && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        const selected = state.getSelectedObjects();
        if (selected.length > 0) {
          state.clipboard = JSON.parse(JSON.stringify(selected));
          state.deleteSelection();
        }
        return;
      }

      if (isCtrlOrCmd && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        if (state.clipboard && state.clipboard.length > 0) {
          state.pushHistory('Paste');
          const page = state.getActivePage();
          const newIds = [];
          state.clipboard.forEach(obj => {
            const clone = JSON.parse(JSON.stringify(obj));
            clone.id = generateId('obj');
            clone.name = `${obj.name} (copy)`;
            clone.x += 20;
            clone.y += 20;
            page.objects.push(clone);
            newIds.push(clone.id);
          });
          state.setSelection(newIds);
          state.emit('project:changed', state.project);
        }
        return;
      }

      if (isCtrlOrCmd && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        const page = state.getActivePage();
        state.setSelection(page.objects.map(o => o.id));
        return;
      }

      if (isCtrlOrCmd && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        if (e.shiftKey) {
          state.getSelectedObjects().forEach(obj => {
            if (obj.type === 'group') state.ungroupObjects(obj.id);
          });
        } else {
          state.groupObjects(Array.from(state.selection));
        }
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        state.deleteSelection();
        return;
      }

      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        if (state.selection.size > 0) {
          e.preventDefault();
          const step = e.shiftKey ? 10 : 1;
          let dx = 0, dy = 0;
          if (e.key === 'ArrowLeft') dx = -step;
          if (e.key === 'ArrowRight') dx = step;
          if (e.key === 'ArrowUp') dy = -step;
          if (e.key === 'ArrowDown') dy = step;

          const updates = {};
          state.getSelectedObjects().forEach(o => {
            updates[o.id] = { x: o.x + dx, y: o.y + dy };
          });
          state.updateMultipleObjects(updates, true);
        }
        return;
      }

      if (e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        state.setMode(state.mode === 'design' ? 'prototype' : 'design');
        return;
      }

      if (e.key === '?' || (isCtrlOrCmd && e.key === '/')) {
        e.preventDefault();
        document.getElementById('modal-shortcuts')?.classList.add('active');
        return;
      }

      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
        state.clearSelection();
        state.setActiveTool('select');
      }
    }
  }

  // ==========================================================================
  // 14. MAIN WIREFRAMELAB APPLICATION ORCHESTRATOR
  // ==========================================================================
  class WireframeLabApp {
    constructor() {
      this.init();
    }

    async init() {
      await initDB();
      await this.loadInitialProject();

      this.exportCtrl = new ExportController();
      this.shortcutsMgr = new ShortcutsManager();

      const worldEl = document.getElementById('canvas-world');
      const overlayEl = document.getElementById('selection-overlay-container');
      const wiresEl = document.getElementById('prototype-wires-layer');
      const viewportEl = document.getElementById('canvas-viewport');
      const rulerHEl = document.getElementById('canvas-ruler-h');
      const rulerVEl = document.getElementById('canvas-ruler-v');
      const guidesEl = document.getElementById('canvas-guides-container');

      this.renderer = new CanvasRenderer(worldEl, overlayEl, wiresEl);
      this.canvasCtrl = new CanvasController(viewportEl, rulerHEl, rulerVEl);
      window.appCanvasCtrl = this.canvasCtrl;

      this.interactionCtrl = new InteractionController(viewportEl, worldEl, this.canvasCtrl, guidesEl);

      const layersContainerEl = document.getElementById('layers-tree-container');
      this.layersCtrl = new LayersController(layersContainerEl);

      const propsContainerEl = document.getElementById('properties-inspector-container');
      this.propsCtrl = new PropertiesController(propsContainerEl);

      const playerOverlayEl = document.getElementById('prototype-player-overlay');
      const screenCanvasEl = document.getElementById('player-screen-canvas');
      const playerTitleEl = document.getElementById('player-artboard-title');
      const playerDeviceSelectEl = document.getElementById('player-device-select');
      this.prototypeCtrl = new PrototypeController(playerOverlayEl, screenCanvasEl, playerTitleEl, playerDeviceSelectEl);

      const paletteOverlayEl = document.getElementById('command-palette-overlay');
      const paletteSearchIn = document.getElementById('palette-search-input');
      const paletteResultsList = document.getElementById('palette-results-list');
      this.paletteCtrl = new CommandPaletteController(paletteOverlayEl, paletteSearchIn, paletteResultsList);

      this.setupTopCommandBar();
      this.setupLeftPanel();
      this.setupBottomStatusBar();
      this.setupModals();
      this.setupTheme();

      this.renderer.render();
      setTimeout(() => this.canvasCtrl.zoomToFitAll(), 80);

      this.showToast('WireframeLab Ready', 'success');
    }

    async loadInitialProject() {
      try {
        const activeId = await getActiveProjectId();
        if (activeId) {
          const saved = await getProject(activeId);
          if (saved) {
            state.setProject(saved);
            return;
          }
        }

        const all = await getAllProjects();
        if (all.length > 0) {
          state.setProject(all[0]);
          await setActiveProjectId(all[0].id);
          return;
        }

        const starter = STARTER_TEMPLATES[0].build();
        await saveProject(starter);
        await setActiveProjectId(starter.id);
        state.setProject(starter);
      } catch (e) {
        state.setProject(createNewProject('Default Project'));
      }
    }

    setupTopCommandBar() {
      const nameIn = document.getElementById('project-name-input');
      if (nameIn) {
        nameIn.value = state.project.name;
        nameIn.addEventListener('change', (e) => state.setProjectName(e.target.value.trim() || 'Untitled Project'));
        state.on('project:nameChanged', (name) => { nameIn.value = name; });
        state.on('project:changed', (p) => { nameIn.value = p.name; });
      }

      const toolBtns = document.querySelectorAll('.tool-btn[data-tool]');
      toolBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          state.setActiveTool(btn.dataset.tool);
        });
      });

      state.on('tool:changed', (tool) => {
        toolBtns.forEach(btn => {
          btn.classList.toggle('active', btn.dataset.tool === tool);
        });
      });

      const modeTabs = document.querySelectorAll('.mode-tab[data-mode]');
      modeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          state.setMode(tab.dataset.mode);
        });
      });

      state.on('mode:changed', (mode) => {
        modeTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.mode === mode));
        document.body.classList.toggle('mode-prototype', mode === 'prototype');
      });

      const undoBtn = document.getElementById('btn-undo');
      const redoBtn = document.getElementById('btn-redo');
      if (undoBtn) undoBtn.addEventListener('click', () => state.undo());
      if (redoBtn) redoBtn.addEventListener('click', () => state.redo());

      state.on('history:changed', ({ canUndo, canRedo }) => {
        if (undoBtn) undoBtn.disabled = !canUndo;
        if (redoBtn) redoBtn.disabled = !canRedo;
      });

      document.getElementById('btn-present-prototype')?.addEventListener('click', () => this.prototypeCtrl.openPlayer());
      document.getElementById('btn-open-export')?.addEventListener('click', () => this.openExportModal());
      document.getElementById('btn-open-palette')?.addEventListener('click', () => this.paletteCtrl.open());
      document.getElementById('btn-open-shortcuts')?.addEventListener('click', () => {
        document.getElementById('modal-shortcuts')?.classList.add('active');
      });

      document.getElementById('btn-toggle-theme')?.addEventListener('click', () => {
        const nextTheme = state.theme === 'theme-dark' ? 'theme-light' : 'theme-dark';
        state.setTheme(nextTheme);
      });

      const menuBtn = document.getElementById('app-menu-btn');
      const menuDropdown = document.getElementById('app-menu-dropdown');
      if (menuBtn && menuDropdown) {
        menuBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isHidden = menuDropdown.style.display === 'none' || !menuDropdown.style.display;
          menuDropdown.style.display = isHidden ? 'block' : 'none';
        });

        window.addEventListener('click', () => {
          menuDropdown.style.display = 'none';
        });

        document.getElementById('menu-item-new')?.addEventListener('click', async () => {
          menuDropdown.style.display = 'none';
          const newP = createNewProject('Untitled Project');
          await saveProject(newP);
          await setActiveProjectId(newP.id);
          state.setProject(newP);
          this.showToast('New project created', 'info');
        });

        document.getElementById('menu-item-projects')?.addEventListener('click', () => {
          menuDropdown.style.display = 'none';
          this.openProjectsModal();
        });

        document.getElementById('menu-item-save-json')?.addEventListener('click', () => {
          menuDropdown.style.display = 'none';
          this.exportCtrl.exportProjectJSON();
        });

        document.getElementById('menu-item-import-json')?.addEventListener('click', () => {
          menuDropdown.style.display = 'none';
          this.openImportFileDialog();
        });
      }
    }

    setupLeftPanel() {
      const tabBtns = document.querySelectorAll('.panel-tab-btn[data-tab]');
      const tabViews = document.querySelectorAll('.panel-tab-content');

      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetTab = btn.dataset.tab;
          tabBtns.forEach(b => b.classList.toggle('active', b === btn));
          tabViews.forEach(v => v.classList.toggle('active', v.id === `tab-view-${targetTab}`));
        });
      });

      this.renderComponentsGrid();
      this.renderTemplatesList();
    }

    renderComponentsGrid() {
      const gridEl = document.getElementById('components-grid');
      if (!gridEl) return;

      const searchIn = document.getElementById('components-search-input');
      const categoryChips = document.querySelectorAll('.category-chip[data-category]');
      let activeCategory = 'all';

      const updateGrid = () => {
        const q = searchIn ? searchIn.value.trim().toLowerCase() : '';
        gridEl.innerHTML = '';

        const filtered = COMPONENT_DEFINITIONS.filter(c => {
          const matchesCategory = activeCategory === 'all' || c.category === activeCategory;
          const matchesQuery = c.name.toLowerCase().includes(q) || c.type.toLowerCase().includes(q);
          return matchesCategory && matchesQuery;
        });

        filtered.forEach(comp => {
          const card = document.createElement('div');
          card.className = 'component-card';
          card.draggable = true;
          card.dataset.type = comp.type;

          card.innerHTML = `
            <div class="component-preview-box">
              ${this.getMiniComponentPreview(comp.type)}
            </div>
            <span class="component-card-name">${escapeHTML(comp.name)}</span>
          `;

          card.addEventListener('click', () => {
            const newObj = createObjectFromType(comp.type);
            const page = state.getActivePage();
            const firstAb = page.artboards[0];
            if (firstAb) {
              newObj.x = Math.round((firstAb.width - newObj.width) / 2);
              newObj.y = Math.round((firstAb.height - newObj.height) / 2);
              state.addObject(newObj, firstAb.id);
            } else {
              newObj.x = 200;
              newObj.y = 200;
              state.addObject(newObj, null);
            }
          });

          card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', comp.type);
            e.dataTransfer.effectAllowed = 'copy';
          });

          gridEl.appendChild(card);
        });
      };

      if (searchIn) searchIn.addEventListener('input', updateGrid);

      categoryChips.forEach(chip => {
        chip.addEventListener('click', () => {
          categoryChips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          activeCategory = chip.dataset.category;
          updateGrid();
        });
      });

      updateGrid();
    }

    getMiniComponentPreview(type) {
      switch (type) {
        case 'button':
          return '<div style="width:50px;height:20px;background:#1f2937;border-radius:3px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:8px;font-weight:bold;">Button</div>';
        case 'input':
          return '<div style="width:65px;height:18px;border:1px solid #9ca3af;border-radius:3px;background:#fff;padding-left:4px;display:flex;align-items:center;font-size:7px;color:#9ca3af;">Input...</div>';
        case 'image':
          return '<div style="width:55px;height:35px;background:#e5e7eb;border:1px solid #d1d5db;border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:8px;color:#6b7280;">IMG</div>';
        case 'card':
          return '<div style="width:60px;height:40px;background:#fff;border:1px solid #e5e7eb;border-radius:3px;padding:3px;display:flex;flex-direction:column;gap:2px;"><div style="height:5px;background:#1f2937;width:60%;"></div><div style="height:3px;background:#e5e7eb;"></div></div>';
        case 'navbar':
          return '<div style="width:70px;height:12px;background:#fff;border-bottom:1px solid #e5e7eb;display:flex;align-items:center;justify-content:space-between;padding:0 4px;"><div style="width:6px;height:6px;background:#1f2937;"></div><div style="width:20px;height:3px;background:#9ca3af;"></div></div>';
        case 'table':
          return '<div style="width:60px;height:35px;border:1px solid #e5e7eb;background:#fff;display:flex;flex-direction:column;"><div style="height:8px;background:#f3f4f6;border-bottom:1px solid #e5e7eb;"></div><div style="height:8px;border-bottom:1px solid #f3f4f6;"></div></div>';
        case 'chart':
          return '<div style="width:50px;height:30px;display:flex;align-items:flex-end;gap:3px;padding:2px;"><div style="width:6px;height:12px;background:#9ca3af;"></div><div style="width:6px;height:24px;background:#6b7280;"></div><div style="width:6px;height:18px;background:#1f2937;"></div></div>';
        default:
          return '<div style="width:40px;height:25px;border:1px dashed #9ca3af;border-radius:2px;"></div>';
      }
    }

    renderTemplatesList() {
      const listEl = document.getElementById('templates-list');
      if (!listEl) return;
      listEl.innerHTML = '';

      STARTER_TEMPLATES.forEach(tpl => {
        const card = document.createElement('div');
        card.className = 'template-card';
        card.innerHTML = `
          <div class="template-thumbnail">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:32px;height:32px;"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
          </div>
          <div class="template-title">${escapeHTML(tpl.name)}</div>
          <div class="template-desc">${escapeHTML(tpl.description)}</div>
        `;

        card.addEventListener('click', async () => {
          if (confirm(`Load "${tpl.name}" template? Current workspace will be updated.`)) {
            const built = tpl.build();
            await saveProject(built);
            await setActiveProjectId(built.id);
            state.setProject(built);
            setTimeout(() => this.canvasCtrl.zoomToFitAll(), 50);
            this.showToast(`Loaded ${tpl.name}`, 'success');
          }
        });

        listEl.appendChild(card);
      });
    }

    setupBottomStatusBar() {
      const zoomValEl = document.getElementById('status-zoom-val');
      document.getElementById('btn-zoom-in')?.addEventListener('click', () => this.canvasCtrl.zoomIn());
      document.getElementById('btn-zoom-out')?.addEventListener('click', () => this.canvasCtrl.zoomOut());
      document.getElementById('btn-zoom-fit')?.addEventListener('click', () => this.canvasCtrl.zoomToFitAll());
      zoomValEl?.addEventListener('click', () => this.canvasCtrl.resetZoom());

      state.on('viewport:changed', (vp) => {
        if (zoomValEl) zoomValEl.textContent = `${Math.round(vp.zoom * 100)}%`;
      });

      const saveDot = document.getElementById('status-save-dot');
      const saveText = document.getElementById('status-save-text');
      state.on('save:status', ({ status }) => {
        if (saveDot && saveText) {
          if (status === 'saving') {
            saveDot.className = 'status-dot saving';
            saveText.textContent = 'Saving...';
          } else {
            saveDot.className = 'status-dot';
            saveText.textContent = 'Saved to IndexedDB';
          }
        }
      });
    }

    setupModals() {
      document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) overlay.classList.remove('active');
        });
      });

      document.querySelectorAll('[data-modal-close]').forEach(btn => {
        btn.addEventListener('click', () => {
          btn.closest('.modal-overlay')?.classList.remove('active');
        });
      });
    }

    async openProjectsModal() {
      const modal = document.getElementById('modal-projects');
      const grid = document.getElementById('projects-grid-list');
      if (!modal || !grid) return;

      grid.innerHTML = '<div style="padding:20px;text-align:center;">Loading projects...</div>';
      modal.classList.add('active');

      const projects = await getAllProjects();
      grid.innerHTML = '';

      projects.forEach(p => {
        const card = document.createElement('div');
        card.className = 'project-card';
        const dateStr = new Date(p.updatedAt || Date.now()).toLocaleDateString();

        card.innerHTML = `
          <div class="project-card-title">${escapeHTML(p.name)}</div>
          <div class="project-card-date">Modified: ${dateStr}</div>
          <div style="display:flex;gap:6px;margin-top:8px;">
            <button class="btn-primary btn-load-proj" style="font-size:11px;padding:3px 8px;">Open</button>
            <button class="btn-del-proj" style="font-size:11px;padding:3px 8px;background:transparent;border:1px solid #ef4444;color:#ef4444;">Delete</button>
          </div>
        `;

        card.querySelector('.btn-load-proj').addEventListener('click', async (e) => {
          e.stopPropagation();
          await setActiveProjectId(p.id);
          state.setProject(p);
          modal.classList.remove('active');
          this.showToast(`Opened project: ${p.name}`, 'info');
        });

        card.querySelector('.btn-del-proj').addEventListener('click', async (e) => {
          e.stopPropagation();
          if (confirm(`Delete project "${p.name}"?`)) {
            await deleteProject(p.id);
            this.openProjectsModal();
          }
        });

        grid.appendChild(card);
      });

      const newBtn = modal.querySelector('#btn-new-project-dialog');
      if (newBtn) {
        newBtn.onclick = async () => {
          const name = prompt('Enter new project name:', 'Untitled Project');
          if (name !== null) {
            const newP = createNewProject(name.trim() || 'Untitled Project');
            await saveProject(newP);
            await setActiveProjectId(newP.id);
            state.setProject(newP);
            modal.classList.remove('active');
            this.showToast(`Created project: ${newP.name}`, 'success');
          }
        };
      }
    }

    openExportModal() {
      const modal = document.getElementById('modal-export');
      if (!modal) return;
      modal.classList.add('active');

      const page = state.getActivePage();
      const artboards = page.artboards || [];
      const select = document.getElementById('export-artboard-select');
      if (select) {
        select.innerHTML = artboards.map(a => `<option value="${a.id}">${escapeHTML(a.name)}</option>`).join('');
      }

      document.getElementById('btn-do-export-png')?.replaceWith(
        document.getElementById('btn-do-export-png').cloneNode(true)
      );
      document.getElementById('btn-do-export-png')?.addEventListener('click', () => {
        const targetAbId = select?.value || artboards[0]?.id;
        this.exportCtrl.exportArtboardAsPNG(targetAbId, 2);
        modal.classList.remove('active');
        this.showToast('PNG Exported @2x', 'success');
      });

      document.getElementById('btn-do-export-svg')?.replaceWith(
        document.getElementById('btn-do-export-svg').cloneNode(true)
      );
      document.getElementById('btn-do-export-svg')?.addEventListener('click', () => {
        const targetAbId = select?.value || artboards[0]?.id;
        this.exportCtrl.exportArtboardAsSVG(targetAbId);
        modal.classList.remove('active');
        this.showToast('SVG Vector Exported', 'success');
      });

      document.getElementById('btn-do-export-json')?.replaceWith(
        document.getElementById('btn-do-export-json').cloneNode(true)
      );
      document.getElementById('btn-do-export-json')?.addEventListener('click', () => {
        this.exportCtrl.exportProjectJSON();
        modal.classList.remove('active');
        this.showToast('Project JSON Downloaded', 'success');
      });

      document.getElementById('btn-do-export-html')?.replaceWith(
        document.getElementById('btn-do-export-html').cloneNode(true)
      );
      document.getElementById('btn-do-export-html')?.addEventListener('click', () => {
        const targetAbId = select?.value || artboards[0]?.id;
        this.exportCtrl.exportHTMLWireframe(targetAbId);
        modal.classList.remove('active');
        this.showToast('HTML Wireframe Package Exported', 'success');
      });
    }

    openImportFileDialog() {
      const fileIn = document.createElement('input');
      fileIn.type = 'file';
      fileIn.accept = '.json';
      fileIn.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (evt) => {
          const result = this.exportCtrl.importProjectJSON(evt.target.result);
          if (result.success) {
            await saveProject(result.project);
            await setActiveProjectId(result.project.id);
            this.showToast('Project imported successfully', 'success');
          } else {
            alert(`Failed to import JSON: ${result.error}`);
          }
        };
        reader.readAsText(file);
      };
      fileIn.click();
    }

    setupTheme() {
      const savedTheme = localStorage.getItem('wf_theme') || 'theme-dark';
      state.setTheme(savedTheme);

      state.on('theme:changed', (t) => {
        document.body.className = `${t} ${state.mode === 'prototype' ? 'mode-prototype' : ''}`;
        localStorage.setItem('wf_theme', t);
      });
    }

    showToast(message, type = 'info') {
      let container = document.getElementById('toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.innerHTML = `<span>${escapeHTML(message)}</span>`;
      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, 2800);
    }
  }

  function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Self-executing bootstrap that handles both readyState === 'loading' and readyState === 'complete'
  function startWireframeLab() {
    if (!window.wireframeLabAppInstance) {
      window.wireframeLabAppInstance = new WireframeLabApp();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startWireframeLab);
  } else {
    startWireframeLab();
  }

})();
