/* ==========================================================================
   WIREFRAMELAB - DATA MODELS & COMPONENT PRESETS
   ========================================================================== */

export function generateId(prefix = 'wf') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
}

export const ARTBOARD_PRESETS = {
  desktop: { name: 'Desktop HD', width: 1440, height: 900, category: 'Desktop' },
  desktop_sm: { name: 'Desktop (1280)', width: 1280, height: 800, category: 'Desktop' },
  macbook: { name: 'MacBook Pro', width: 1512, height: 982, category: 'Desktop' },
  tablet: { name: 'iPad / Tablet', width: 768, height: 1024, category: 'Tablet' },
  mobile: { name: 'iPhone 15 / 16', width: 393, height: 852, category: 'Mobile' },
  mobile_sm: { name: 'Android Mobile', width: 360, height: 800, category: 'Mobile' },
  watch: { name: 'Apple Watch', width: 198, height: 242, category: 'Watch' }
};

export const DEFAULT_STYLES = {
  fill: '#ffffff',
  stroke: '#1f2937',
  strokeWidth: 1,
  strokeStyle: 'solid',
  borderRadius: 4,
  opacity: 1,
  shadow: false,
  fontSize: 14,
  fontFamily: 'Inter, -apple-system, sans-serif',
  fontWeight: '400',
  textAlign: 'left',
  textColor: '#1f2937',
  lineHeight: 1.4
};

export const DEFAULT_CONSTRAINTS = {
  horizontal: 'left', // 'left' | 'right' | 'center' | 'scale' | 'stretch'
  vertical: 'top'      // 'top' | 'bottom' | 'center' | 'scale' | 'stretch'
};

export const COMPONENT_DEFINITIONS = [
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

export function createNewProject(name = 'Untitled Project') {
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

export function createObjectFromType(type, customProps = {}, customStyles = {}) {
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
      trigger: 'click', // 'click' | 'hover'
      animation: 'instant' // 'instant' | 'fade' | 'slide-left' | 'slide-right'
    }
  };
}
