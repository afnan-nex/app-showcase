/**
 * TimeGrid - Pre-Built Schedule Templates & Categories
 * Routine architectures for focused development, meeting marathons, balanced routines, and weekend balance.
 */

export const CATEGORIES = {
  'Deep Work': { name: 'Deep Work', color: '#0284c7', bg: 'rgba(2, 132, 199, 0.2)', border: '#0284c7' },
  'Meetings': { name: 'Meetings', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.2)', border: '#8b5cf6' },
  'Health': { name: 'Health', color: '#10b981', bg: 'rgba(16, 185, 129, 0.2)', border: '#10b981' },
  'Admin': { name: 'Admin', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.2)', border: '#f59e0b' },
  'Personal': { name: 'Personal', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.2)', border: '#ec4899' }
};

export const SCHEDULE_TEMPLATES = [
  {
    id: 'template_deep_work',
    name: 'Deep Work Focus Sprint',
    description: 'High-focus flow day with 2 major uninterrupted deep work blocks and consolidated afternoon communication.',
    blocks: [
      { title: 'Morning Workout & Routine', startMinute: 420, endMinute: 480, category: 'Health', priority: 'Med', color: '#10b981' },
      { title: 'Deep Work: Core Architecture', startMinute: 540, endMinute: 720, category: 'Deep Work', priority: 'High', color: '#0284c7' },
      { title: 'Lunch & Reset Walk', startMinute: 720, endMinute: 780, category: 'Personal', priority: 'Low', color: '#ec4899' },
      { title: 'Deep Work: Feature Implementation', startMinute: 780, endMinute: 960, category: 'Deep Work', priority: 'High', color: '#0284c7' },
      { title: 'Async Comms & Inbox Zero', startMinute: 960, endMinute: 1020, category: 'Admin', priority: 'Med', color: '#f59e0b' },
      { title: 'Evening Wind-down', startMinute: 1140, endMinute: 1260, category: 'Personal', priority: 'Low', color: '#ec4899' }
    ]
  },
  {
    id: 'template_balanced',
    name: 'Balanced Productive Routine',
    description: 'Even distribution of focused problem solving, collaborative syncs, health, and administrative buffer.',
    blocks: [
      { title: 'Morning Exercise & Coffee', startMinute: 450, endMinute: 510, category: 'Health', priority: 'Med', color: '#10b981' },
      { title: 'Daily Standup & Team Sync', startMinute: 540, endMinute: 570, category: 'Meetings', priority: 'High', color: '#8b5cf6' },
      { title: 'Focused Development Block', startMinute: 570, endMinute: 720, category: 'Deep Work', priority: 'High', color: '#0284c7' },
      { title: 'Lunch Break', startMinute: 720, endMinute: 780, category: 'Personal', priority: 'Low', color: '#ec4899' },
      { title: 'Collaborative Pair Programming', startMinute: 810, endMinute: 900, category: 'Deep Work', priority: 'Med', color: '#0284c7' },
      { title: 'Design Review Meeting', startMinute: 930, endMinute: 990, category: 'Meetings', priority: 'Med', color: '#8b5cf6' },
      { title: 'Daily Wrap-up & Planning', startMinute: 1020, endMinute: 1050, category: 'Admin', priority: 'Low', color: '#f59e0b' }
    ]
  },
  {
    id: 'template_meeting_heavy',
    name: 'Collaborative Sync Marathon',
    description: 'Consolidated meetings with preparation buffers and quick execution slots.',
    blocks: [
      { title: '1-on-1 Catch-up with Tech Lead', startMinute: 540, endMinute: 585, category: 'Meetings', priority: 'High', color: '#8b5cf6' },
      { title: 'Sprint Retrospective & Demo', startMinute: 600, endMinute: 690, category: 'Meetings', priority: 'High', color: '#8b5cf6' },
      { title: 'Lunch & Screen Break', startMinute: 720, endMinute: 780, category: 'Personal', priority: 'Low', color: '#ec4899' },
      { title: 'Client Architecture Review', startMinute: 840, endMinute: 930, category: 'Meetings', priority: 'High', color: '#8b5cf6' },
      { title: 'Action Item Follow-up & Emails', startMinute: 960, endMinute: 1050, category: 'Admin', priority: 'Med', color: '#f59e0b' }
    ]
  },
  {
    id: 'template_weekend',
    name: 'Weekend Rejuvenation & Hobbies',
    description: 'Restful schedule centered around fitness, outdoor recreation, creative projects, and leisure.',
    blocks: [
      { title: 'Morning Trail Run / Fitness', startMinute: 480, endMinute: 570, category: 'Health', priority: 'Med', color: '#10b981' },
      { title: 'Creative Passion Project Studio', startMinute: 630, endMinute: 780, category: 'Personal', priority: 'High', color: '#ec4899' },
      { title: 'Cooking & Family Lunch', startMinute: 780, endMinute: 870, category: 'Personal', priority: 'Low', color: '#ec4899' },
      { title: 'Reading & Outdoor Leisure', startMinute: 960, endMinute: 1080, category: 'Health', priority: 'Low', color: '#10b981' }
    ]
  }
];
