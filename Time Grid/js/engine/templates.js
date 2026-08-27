/**
 * TimeGrid - Pre-Built Schedule Templates & Categories
 * Routine architectures for focused development, meeting marathons, balanced routines, and weekend balance.
 */

export const CATEGORIES = {
  'Deep Work': { name: 'Deep Work', color: '#0284c7', bg: 'rgba(2, 132, 199, 0.2)', border: '#0284c7', icon: 'zap' },
  'Meetings': { name: 'Meetings', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.2)', border: '#8b5cf6', icon: 'briefcase' },
  'Health': { name: 'Health', color: '#10b981', bg: 'rgba(16, 185, 129, 0.2)', border: '#10b981', icon: 'coffee' },
  'Admin': { name: 'Admin', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.2)', border: '#f59e0b', icon: 'clock' },
  'Personal': { name: 'Personal', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.2)', border: '#ec4899', icon: 'sparkles' }
};

export const COLOR_SWATCHES = [
  '#0284c7', // Sky Blue
  '#3b82f6', // Cobalt
  '#8b5cf6', // Violet
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#f59e0b', // Amber
  '#f97316', // Orange
  '#ef4444', // Red
  '#ec4899', // Pink
  '#6366f1'  // Indigo
];

export const SCHEDULE_TEMPLATES = [
  {
    id: 'template_deep_work',
    name: 'Deep Work Focus Sprint (Maker Mode)',
    description: 'High-focus flow day with 2 major uninterrupted deep work blocks and consolidated afternoon communication.',
    blocks: [
      { title: 'Morning Workout & Routine', startMinute: 420, endMinute: 480, category: 'Health', priority: 'Med', color: '#10b981', notes: 'Hydration & mobility' },
      { title: 'Deep Work: Core Architecture', startMinute: 540, endMinute: 720, category: 'Deep Work', priority: 'High', color: '#0284c7', notes: 'Core engine refactor' },
      { title: 'Lunch & Reset Walk', startMinute: 720, endMinute: 780, category: 'Personal', priority: 'Low', color: '#ec4899', notes: 'Screen-free walk' },
      { title: 'Deep Work: Feature Implementation', startMinute: 780, endMinute: 960, category: 'Deep Work', priority: 'High', color: '#0284c7', notes: 'Component tests & polish' },
      { title: 'Async Comms & PR Reviews', startMinute: 960, endMinute: 1020, category: 'Admin', priority: 'Med', color: '#f59e0b', notes: 'Inbox zero' },
      { title: 'Evening Wind-down & Journaling', startMinute: 1140, endMinute: 1260, category: 'Personal', priority: 'Low', color: '#ec4899', notes: 'Reading & rest' }
    ]
  },
  {
    id: 'template_balanced',
    name: 'Balanced Productive Routine',
    description: 'Even distribution of focused problem solving, collaborative syncs, health, and administrative buffer.',
    blocks: [
      { title: 'Morning Exercise & Coffee', startMinute: 450, endMinute: 510, category: 'Health', priority: 'Med', color: '#10b981', notes: 'Aerobic jog' },
      { title: 'Daily Standup & Team Sync', startMinute: 540, endMinute: 570, category: 'Meetings', priority: 'High', color: '#8b5cf6', notes: 'Roadmap alignment' },
      { title: 'Focused Development Block', startMinute: 570, endMinute: 720, category: 'Deep Work', priority: 'High', color: '#0284c7', notes: 'Feature backlog delivery' },
      { title: 'Lunch Break', startMinute: 720, endMinute: 780, category: 'Personal', priority: 'Low', color: '#ec4899', notes: 'Nutritious meal' },
      { title: 'Collaborative Pair Programming', startMinute: 810, endMinute: 900, category: 'Deep Work', priority: 'Med', color: '#0284c7', notes: 'API contract review' },
      { title: 'Design Review & Feedback', startMinute: 930, endMinute: 990, category: 'Meetings', priority: 'Med', color: '#8b5cf6', notes: 'Figma walkthrough' },
      { title: 'Daily Wrap-up & Tomorrow Plan', startMinute: 1020, endMinute: 1050, category: 'Admin', priority: 'Low', color: '#f59e0b', notes: 'Triage outstanding issues' }
    ]
  },
  {
    id: 'template_meeting_heavy',
    name: 'Executive Sync & Client Marathon',
    description: 'Consolidated meetings with preparation buffers and quick execution slots.',
    blocks: [
      { title: '1-on-1 Catch-up with Tech Lead', startMinute: 540, endMinute: 585, category: 'Meetings', priority: 'High', color: '#8b5cf6', notes: 'Quarterly career growth' },
      { title: 'Sprint Retrospective & Demo', startMinute: 600, endMinute: 690, category: 'Meetings', priority: 'High', color: '#8b5cf6', notes: 'Team demo session' },
      { title: 'Lunch & Screen Break', startMinute: 720, endMinute: 780, category: 'Personal', priority: 'Low', color: '#ec4899', notes: 'Lunch' },
      { title: 'Client Architecture Review', startMinute: 840, endMinute: 930, category: 'Meetings', priority: 'High', color: '#8b5cf6', notes: 'Stakeholder sign-off' },
      { title: 'Action Item Follow-up & Emails', startMinute: 960, endMinute: 1050, category: 'Admin', priority: 'Med', color: '#f59e0b', notes: 'Send meeting minutes' }
    ]
  },
  {
    id: 'template_async_engineer',
    name: 'Async Engineering & Research Day',
    description: 'Zero meeting schedule dedicated to research, technical spikes, and codebase modernization.',
    blocks: [
      { title: 'Morning Reading & Tech Digest', startMinute: 480, endMinute: 540, category: 'Health', priority: 'Med', color: '#10b981', notes: 'Whitepapers & RFCs' },
      { title: 'Technical Spike: WebGL Profiling', startMinute: 540, endMinute: 720, category: 'Deep Work', priority: 'High', color: '#0284c7', notes: 'Canvas rendering benchmarks' },
      { title: 'Lunch & Break', startMinute: 720, endMinute: 780, category: 'Personal', priority: 'Low', color: '#ec4899', notes: 'Healthy meal' },
      { title: 'Deep Work: Algorithm Optimization', startMinute: 780, endMinute: 960, category: 'Deep Work', priority: 'High', color: '#0284c7', notes: 'Reduce time complexity' },
      { title: 'Documentation & RFC Writeup', startMinute: 990, endMinute: 1050, category: 'Admin', priority: 'Med', color: '#f59e0b', notes: 'Publish architecture decision record' }
    ]
  },
  {
    id: 'template_weekend',
    name: 'Weekend Rejuvenation & Studio',
    description: 'Restful schedule centered around fitness, outdoor recreation, creative projects, and leisure.',
    blocks: [
      { title: 'Morning Trail Run / Fitness', startMinute: 480, endMinute: 570, category: 'Health', priority: 'Med', color: '#10b981', notes: 'Outdoor 5k trail run' },
      { title: 'Creative Passion Project Studio', startMinute: 630, endMinute: 780, category: 'Personal', priority: 'High', color: '#ec4899', notes: 'Audio production & design' },
      { title: 'Cooking & Family Lunch', startMinute: 780, endMinute: 870, category: 'Personal', priority: 'Low', color: '#ec4899', notes: 'Farm-to-table lunch' },
      { title: 'Reading & Outdoor Leisure', startMinute: 960, endMinute: 1080, category: 'Health', priority: 'Low', color: '#10b981', notes: 'Fiction book & park' }
    ]
  }
];
