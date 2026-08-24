/* ==========================================================================
   CANVASFLOW — Production Starter Board Template
   Realistic Distributed Systems Architecture, ADR Brainstorming & Metric Mockup
   ========================================================================== */

import { createCanvasObject } from '../state/document-model.js';

export function createSampleBoard() {
  const objects = [];

  // --- Title & Header Section ---
  objects.push(createCanvasObject('text', {
    id: 'hdr_title',
    x: -520,
    y: -380,
    text: 'Nexus Engine — Event Ingestion & Stream Processing Pipeline',
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3b82f6',
    width: 780,
    height: 38
  }));

  objects.push(createCanvasObject('text', {
    id: 'hdr_subtitle',
    x: -520,
    y: -340,
    text: 'Architecture Review • Sprint 42 • Target SLA: P99 < 35ms @ 250k events/sec • Lead: Elena Rostova (Staff Architect)',
    fontSize: 13,
    color: '#9ca3af',
    width: 820,
    height: 24
  }));

  // --- System Architecture Diagram ---

  // 1. Edge Layer
  const boxEdge = createCanvasObject('rounded-rectangle', {
    id: 'arch_edge',
    x: -520,
    y: -240,
    width: 150,
    height: 72,
    fill: 'rgba(59, 130, 246, 0.08)',
    stroke: '#3b82f6',
    strokeWidth: 2,
    cornerRadius: 8
  });
  objects.push(boxEdge);

  objects.push(createCanvasObject('text', {
    id: 'txt_edge',
    x: -510,
    y: -222,
    text: 'Edge Ingress\n(Envoy Proxy / TLS)',
    fontSize: 12,
    textAlign: 'center',
    width: 130,
    height: 34
  }));

  // 2. Auth & Rate Limiter
  const boxAuth = createCanvasObject('diamond', {
    id: 'arch_auth',
    x: -300,
    y: -254,
    width: 120,
    height: 100,
    fill: 'rgba(245, 158, 11, 0.08)',
    stroke: '#f59e0b',
    strokeWidth: 2
  });
  objects.push(boxAuth);

  objects.push(createCanvasObject('text', {
    id: 'txt_auth',
    x: -285,
    y: -218,
    text: 'JWT Token\nRate Limiter',
    fontSize: 11,
    textAlign: 'center',
    width: 90,
    height: 30
  }));

  // 3. Kafka Stream Cluster
  const boxKafka = createCanvasObject('rounded-rectangle', {
    id: 'arch_kafka',
    x: -110,
    y: -240,
    width: 170,
    height: 72,
    fill: 'rgba(16, 185, 129, 0.08)',
    stroke: '#10b981',
    strokeWidth: 2,
    cornerRadius: 8
  });
  objects.push(boxKafka);

  objects.push(createCanvasObject('text', {
    id: 'txt_kafka',
    x: -100,
    y: -222,
    text: 'Kafka Event Bus\n(32 Partitions / Snappy)',
    fontSize: 12,
    textAlign: 'center',
    width: 150,
    height: 34
  }));

  // 4. Processing Workers
  const boxWorkers = createCanvasObject('rounded-rectangle', {
    id: 'arch_workers',
    x: 130,
    y: -240,
    width: 170,
    height: 72,
    fill: 'rgba(139, 92, 246, 0.08)',
    stroke: '#8b5cf6',
    strokeWidth: 2,
    cornerRadius: 8
  });
  objects.push(boxWorkers);

  objects.push(createCanvasObject('text', {
    id: 'txt_workers',
    x: 140,
    y: -222,
    text: 'Flink Stream Engine\n(Stateful Aggregations)',
    fontSize: 12,
    textAlign: 'center',
    width: 150,
    height: 34
  }));

  // 5. ClickHouse OLAP
  const boxOlap = createCanvasObject('ellipse', {
    id: 'arch_olap',
    x: 370,
    y: -290,
    width: 150,
    height: 70,
    fill: 'rgba(236, 72, 153, 0.08)',
    stroke: '#ec4899',
    strokeWidth: 2
  });
  objects.push(boxOlap);

  objects.push(createCanvasObject('text', {
    id: 'txt_olap',
    x: 380,
    y: -270,
    text: 'ClickHouse OLAP\n(Time-Series Analytics)',
    fontSize: 11,
    textAlign: 'center',
    width: 130,
    height: 30
  }));

  // 6. Redis Cache
  const boxRedis = createCanvasObject('ellipse', {
    id: 'arch_redis',
    x: 370,
    y: -190,
    width: 150,
    height: 70,
    fill: 'rgba(239, 68, 68, 0.08)',
    stroke: '#ef4444',
    strokeWidth: 2
  });
  objects.push(boxRedis);

  objects.push(createCanvasObject('text', {
    id: 'txt_redis',
    x: 380,
    y: -170,
    text: 'Redis Cluster\n(Realtime Counters)',
    fontSize: 11,
    textAlign: 'center',
    width: 130,
    height: 30
  }));

  // --- Dynamic Connectors ---
  objects.push(createCanvasObject('connector', {
    id: 'c_edge_auth',
    x: -370,
    y: -204,
    x2: -300,
    y2: -204,
    stroke: '#3b82f6',
    strokeWidth: 2,
    startBinding: { elementId: 'arch_edge', anchor: 'right' },
    endBinding: { elementId: 'arch_auth', anchor: 'left' }
  }));

  objects.push(createCanvasObject('connector', {
    id: 'c_auth_kafka',
    x: -180,
    y: -204,
    x2: -110,
    y2: -204,
    stroke: '#f59e0b',
    strokeWidth: 2,
    startBinding: { elementId: 'arch_auth', anchor: 'right' },
    endBinding: { elementId: 'arch_kafka', anchor: 'left' }
  }));

  objects.push(createCanvasObject('connector', {
    id: 'c_kafka_workers',
    x: 60,
    y: -204,
    x2: 130,
    y2: -204,
    stroke: '#10b981',
    strokeWidth: 2,
    startBinding: { elementId: 'arch_kafka', anchor: 'right' },
    endBinding: { elementId: 'arch_workers', anchor: 'left' }
  }));

  objects.push(createCanvasObject('connector', {
    id: 'c_workers_olap',
    x: 300,
    y: -204,
    x2: 370,
    y2: -255,
    stroke: '#8b5cf6',
    strokeWidth: 2,
    routing: 'curved',
    startBinding: { elementId: 'arch_workers', anchor: 'right' },
    endBinding: { elementId: 'arch_olap', anchor: 'left' }
  }));

  objects.push(createCanvasObject('connector', {
    id: 'c_workers_redis',
    x: 300,
    y: -204,
    x2: 370,
    y2: -155,
    stroke: '#8b5cf6',
    strokeWidth: 2,
    routing: 'curved',
    startBinding: { elementId: 'arch_workers', anchor: 'right' },
    endBinding: { elementId: 'arch_redis', anchor: 'left' }
  }));

  // --- Highlighter Annotations on SLA ---
  objects.push(createCanvasObject('highlighter', {
    id: 'hl_sla',
    x: -525,
    y: -330,
    stroke: '#3b82f6',
    strokeWidth: 18,
    opacity: 0.22,
    points: [
      { x: -525, y: -330 },
      { x: -280, y: -330 },
      { x: 200, y: -330 }
    ]
  }));

  // --- ADR & Architecture Decision Sticky Notes ---
  objects.push(createCanvasObject('sticky', {
    id: 'st_adr1',
    x: -520,
    y: -70,
    width: 170,
    height: 160,
    fill: '#fef08a',
    color: '#713f12',
    text: '📌 ADR-042: Kafka Partitions\n\nConfigured 32 partitions per topic with consistent hashing on tenant_id to prevent partition skew during traffic spikes.\n\nApproved: SRE Team'
  }));

  objects.push(createCanvasObject('sticky', {
    id: 'st_adr2',
    x: -320,
    y: -70,
    width: 170,
    height: 160,
    fill: '#bfdbfe',
    color: '#1e3a8a',
    text: '⚡ Latency Target Budget\n\n• TLS Handshake: <10ms\n• Envoy Ingress: <3ms\n• Kafka Publish: <8ms\n• Flink Window: <12ms\n\nTotal Budget: P99 < 35ms'
  }));

  objects.push(createCanvasObject('sticky', {
    id: 'st_adr3',
    x: -120,
    y: -70,
    width: 170,
    height: 160,
    fill: '#bbf7d0',
    color: '#14532d',
    text: '🛡️ Fallback Dead-Letter\n\nAny malformed JSON payload automatically routes to S3 DLQ bucket with 14-day retention for replay.\n\nOwner: Marcus Vance'
  }));

  objects.push(createCanvasObject('sticky', {
    id: 'st_adr4',
    x: 80,
    y: -70,
    width: 170,
    height: 160,
    fill: '#fbcfe8',
    color: '#831843',
    text: '🚀 Sprint 42 Milestones\n\n1. Deploy ClickHouse 24.3\n2. Run 300k RPS soak test\n3. Finalize Prometheus alerts\n4. Update Runbook docs'
  }));

  // --- Real-time Metrics Card Mockup (Wireframe Container) ---
  const boxCard = createCanvasObject('rounded-rectangle', {
    id: 'wf_card',
    x: 280,
    y: -70,
    width: 240,
    height: 160,
    fill: 'rgba(255, 255, 255, 0.03)',
    stroke: '#3b82f6',
    strokeWidth: 1.5,
    cornerRadius: 8
  });
  objects.push(boxCard);

  objects.push(createCanvasObject('text', {
    id: 'txt_card_title',
    x: 295,
    y: -55,
    text: 'Cluster Telemetry (Live)',
    fontSize: 13,
    fontWeight: 'bold',
    color: '#f3f4f6',
    width: 210,
    height: 20
  }));

  objects.push(createCanvasObject('text', {
    id: 'txt_card_stats',
    x: 295,
    y: -25,
    text: 'Throughput:  248,190 req/s\nP99 Latency: 22.4 ms\nError Rate:  0.0014%\nActive Nodes: 16 / 16 Healthy',
    fontSize: 11,
    fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
    color: '#10b981',
    lineHeight: 1.6,
    width: 210,
    height: 80
  }));

  return {
    id: 'sample_nexus_pipeline',
    title: 'Nexus Stream Architecture Review',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    viewport: {
      panX: 580,
      panY: 420,
      zoom: 1.0
    },
    settings: {
      gridVisible: true,
      gridType: 'dots',
      snapEnabled: true,
      rulersVisible: false,
      theme: 'dark'
    },
    objects
  };
}
