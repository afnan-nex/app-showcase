/* ==========================================================================
   WIREFRAMELAB - BUILT-IN STARTER TEMPLATES
   Production-grade, authentic, industry-specific wireframes
   ========================================================================== */

import { generateId, createObjectFromType } from './models.js';

export const STARTER_TEMPLATES = [
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
              // Navbar
              createObj('navbar', abId, 0, 0, 1440, 64, {
                brand: 'Apex Cloud',
                links: ['Edge Network', 'Serverless Functions', 'Architecture', 'Pricing', 'API Docs'],
                ctaText: 'Deploy Now'
              }),

              // Hero Badge
              createObj('chip', abId, 600, 100, 240, 28, {
                label: 'v4.2 Released: Sub-10ms Edge Cold Starts'
              }, { fill: '#f3f4f6', textColor: '#111827', fontSize: 11 }),

              // Hero Headline
              createObj('text', abId, 240, 145, 960, 64, {
                text: 'Global Serverless Infrastructure at the Edge',
                variant: 'heading-1'
              }, { fontSize: 38, fontWeight: '700', textAlign: 'center' }),

              // Hero Subtitle
              createObj('paragraph', abId, 360, 225, 720, 54, {
                text: 'Deploy containerized microservices and automated CI/CD pipelines across 310+ Anycast PoPs worldwide with automatic TLS and zero configuration.'
              }, { fontSize: 15, textColor: '#4b5563', textAlign: 'center' }),

              // Hero CTA Buttons
              createObj('button', abId, 530, 295, 175, 46, { label: 'Start Free Trial (14 Days)', variant: 'primary' }, { fill: '#1f2937' }),
              createObj('button', abId, 725, 295, 185, 46, { label: 'Read Architecture Whitepaper', variant: 'outline' }),

              // Code / Dashboard Architecture Preview
              createObj('image', abId, 220, 375, 1000, 310, { label: 'Interactive Edge Topology & Latency Map (310 PoPs)' }),

              // Feature Section Header
              createObj('text', abId, 470, 725, 500, 32, { text: 'Engineered for Zero-Downtime Reliability', variant: 'heading-2' }, { fontSize: 22, textAlign: 'center' }),

              // 3 Feature Cards
              createObj('card', abId, 120, 780, 370, 180, {
                title: '⚡ Anycast Routing & Smart DNS',
                body: 'Incoming requests automatically route to the topologically closest datacenter with sub-millisecond route optimization.',
                hasImage: false,
                hasActions: false
              }),
              createObj('card', abId, 535, 780, 370, 180, {
                title: '🛡️ Layer 3/4/7 DDoS Mitigation',
                body: 'Continuous traffic inspection and automated scrubbing with 120 Tbps mitigation backbone capacity.',
                hasImage: false,
                hasActions: false
              }),
              createObj('card', abId, 950, 780, 370, 180, {
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

      const objDoctorCard = createObj('card', ab1Id, 20, 185, 353, 210, {
        title: 'Dr. Sarah Jenkins, MD',
        body: 'Board Certified Cardiologist • Stanford Health\n⭐ 4.96 (182 reviews) • Next available: Tomorrow',
        hasImage: false,
        hasActions: true,
        actionText: 'Book Video Visit ($35)'
      });
      objDoctorCard.prototype = { targetArtboardId: ab2Id, trigger: 'click', animation: 'slide-left' };

      const objConfirmSlotBtn = createObj('button', ab2Id, 20, 735, 353, 48, { label: 'Confirm Video Visit — Tomorrow 10:30 AM', variant: 'primary' }, { fill: '#1f2937' });
      objConfirmSlotBtn.prototype = { targetArtboardId: ab3Id, trigger: 'click', animation: 'slide-left' };

      const objBackBtn = createObj('button', ab2Id, 20, 20, 90, 32, { label: '‹ Specialists', variant: 'ghost' });
      objBackBtn.prototype = { targetArtboardId: ab1Id, trigger: 'click', animation: 'slide-right' };

      const objReturnHomeBtn = createObj('button', ab3Id, 80, 500, 233, 44, { label: 'View in My Care Plan', variant: 'primary' });
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
              // Screen 1: Specialist Search
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
              // Screen 2: Time Slot Booking
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
              // Screen 3: Confirmed Visit
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
              // --- Screen 1 Elements ---
              createObj('text', ab1Id, 20, 30, 260, 32, { text: 'Find a Specialist', variant: 'heading-2' }),
              createObj('input', ab1Id, 20, 75, 353, 40, { placeholder: 'Search doctor, specialty, or condition...' }),
              createObj('tabs', ab1Id, 20, 128, 353, 36, { tabs: ['All', 'Cardiology', 'Neurology', 'Pediatrics'], activeIndex: 1 }),
              objDoctorCard,
              createObj('card', ab1Id, 20, 420, 353, 210, {
                title: 'Dr. Michael Chang, MD',
                body: 'Internal Medicine • UCSF Medical Center\n⭐ 4.91 (214 reviews) • Next available: Friday',
                hasImage: false,
                hasActions: true,
                actionText: 'Book Video Visit ($35)'
              }),

              // --- Screen 2 Elements ---
              objBackBtn,
              createObj('text', ab2Id, 20, 70, 353, 30, { text: 'Schedule with Dr. Jenkins', variant: 'heading-2' }),
              createObj('alert', ab2Id, 20, 115, 353, 50, { title: 'Insurance Verified', message: 'In-network with Blue Cross PPO ($35 co-pay).' }),
              createObj('text', ab2Id, 20, 185, 200, 24, { text: 'Select Date:', variant: 'label' }),
              createObj('tabs', ab2Id, 20, 215, 353, 36, { tabs: ['Thu, Oct 24', 'Fri, Oct 25', 'Mon, Oct 28'], activeIndex: 0 }),
              createObj('text', ab2Id, 20, 275, 200, 24, { text: 'Available Morning Slots:', variant: 'label' }),
              createObj('chip', ab2Id, 20, 305, 95, 34, { label: '09:00 AM' }),
              createObj('chip', ab2Id, 125, 305, 95, 34, { label: '10:30 AM (Selected)' }, { fill: '#1f2937', textColor: '#ffffff' }),
              createObj('chip', ab2Id, 230, 305, 95, 34, { label: '11:15 AM' }),
              createObj('text', ab2Id, 20, 365, 200, 24, { text: 'Available Afternoon Slots:', variant: 'label' }),
              createObj('chip', ab2Id, 20, 395, 95, 34, { label: '02:00 PM' }),
              createObj('chip', ab2Id, 125, 395, 95, 34, { label: '03:30 PM' }),
              createObj('chip', ab2Id, 230, 395, 95, 34, { label: '04:15 PM' }),
              createObj('checkbox', ab2Id, 20, 460, 353, 28, { label: 'Send SMS & calendar reminders to (415) 892-0194', checked: true }),
              objConfirmSlotBtn,

              // --- Screen 3 Elements ---
              createObj('modal', ab3Id, 20, 180, 353, 290, {
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
              // Sidebar
              createObj('sidebar', abId, 0, 0, 220, 900, {
                title: 'Nova Treasury',
                items: ['Overview', 'Settlements', 'Risk Engine', 'Disputes', 'Compliance', 'Settings'],
                activeIndex: 1
              }),

              // Header Bar
              createObj('navbar', abId, 220, 0, 1220, 60, {
                brand: 'Settlement Ledger (USD / EUR)',
                links: ['Real-time Feed', 'Batch Reconciliation', 'Audit Logs'],
                ctaText: 'Generate Wire'
              }),

              // 4 KPI Metric Cards
              createObj('card', abId, 250, 80, 270, 100, { title: 'Net Settlement Volume', body: '$24,819,450.00 (+18.4%)', hasImage: false, hasActions: false }),
              createObj('card', abId, 550, 80, 270, 100, { title: 'Cleared Transactions', body: '1,420,891 (99.98%)', hasImage: false, hasActions: false }),
              createObj('card', abId, 850, 80, 270, 100, { title: 'Risk Intercept Ratio', body: '0.04% (-0.01% MoM)', hasImage: false, hasActions: false }),
              createObj('card', abId, 1150, 80, 260, 100, { title: 'Avg Settlement Latency', body: '1.24s (FedNow / SEPA)', hasImage: false, hasActions: false }),

              // Chart Placeholder
              createObj('chart', abId, 250, 200, 680, 270, { title: 'Daily Volume Breakdown (ACH Instant vs FedNow)' }),

              // Alert / Notice
              createObj('alert', abId, 950, 200, 460, 60, { title: 'OFAC & AML Automated Screen', message: 'All 84,210 batch items cleared sanctions screening with zero flags.' }),

              // Transaction Data Table
              createObj('table', abId, 250, 490, 1160, 380, {
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
              // Navbar
              createObj('navbar', abId, 0, 0, 1440, 60, {
                brand: 'Acme Global Workspace',
                links: ['Projects', 'Pipelines', 'Analytics', 'Settings'],
                activeLink: 'Settings',
                ctaText: 'Invite Member'
              }),

              // Breadcrumbs
              createObj('breadcrumbs', abId, 60, 80, 360, 24, {
                items: ['Organization Settings', 'Authentication & Access Control']
              }),

              // Title
              createObj('text', abId, 60, 115, 600, 36, { text: 'Security, SSO & Team Access', variant: 'heading-2' }),

              // Navigation Tabs
              createObj('tabs', abId, 60, 165, 800, 40, {
                tabs: ['Team Members (42)', 'SAML 2.0 / Okta SSO', 'API Keys & Secrets', 'Audit Trail', 'Billing'],
                activeIndex: 0
              }),

              // SSO Box
              createObj('card', abId, 60, 230, 620, 150, {
                title: 'Enforce SAML 2.0 Single Sign-On',
                body: 'Require all team members to authenticate via company Okta, Azure AD, or Google Workspace identity provider.',
                hasImage: false,
                hasActions: false
              }),
              createObj('toggle', abId, 500, 245, 140, 30, { label: 'Enforced', checked: true }),

              // 2FA Requirement
              createObj('card', abId, 720, 230, 620, 150, {
                title: 'Hardware Security Key (WebAuthn / YubiKey)',
                body: 'Enforce FIDO2 WebAuthn hardware token requirement for members with Administrator or Billing roles.',
                hasImage: false,
                hasActions: false
              }),
              createObj('toggle', abId, 1160, 245, 140, 30, { label: 'Enforced', checked: true }),

              // Section Header
              createObj('text', abId, 60, 410, 300, 28, { text: 'Active Organization Members', variant: 'heading-3' }),

              // Team Table
              createObj('table', abId, 60, 450, 1280, 380, {
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

function createObj(type, artboardId, x, y, width, height, customProps = {}, customStyles = {}) {
  const obj = createObjectFromType(type, customProps, customStyles);
  obj.artboardId = artboardId;
  obj.x = x;
  obj.y = y;
  obj.width = width;
  obj.height = height;
  return obj;
}
