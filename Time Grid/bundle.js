/**
 * TimeGrid - Standalone Visual Time-Blocking & Daily Schedule Workstation Bundle
 * 100% Client-Side Time Engine, Zero Server Backend, Works on HTTP & file:///
 */

(function() {
'use strict';


/* --- MODULE: js/core/icons.js --- */
/**
 * TimeGrid - Local SVG Icons Registry
 * Crisp icons for time blocking, schedule views, focus mode, and conflict management.
 */

const ICONS = {
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  focus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,
  play: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
  pause: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
  split: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="22"></line><polyline points="19 15 12 22 5 15"></polyline><polyline points="19 9 12 2 5 9"></polyline></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  repeat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>`,
  zap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
  coffee: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`,
  briefcase: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
  layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
  chevronLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`
};

function getIcon(name, extraClass = '') {
  const svg = ICONS[name] || ICONS.clock;
  if (!extraClass) return svg;
  return svg.replace('<svg ', `<svg class="${extraClass}" `);
}

function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

ICONS;


/* --- MODULE: js/core/time.js --- */
/**
 * TimeGrid - Time Model & Minute-from-Midnight Math Engine
 * Conversions between minutes (0-1440), 12h/24h strings, durations, and week dates.
 */

/**
 * Format minutes from midnight (0..1440) to time string
 */
function minutesToTimeString(minutes, is24Hour = false) {
  if (minutes === null || minutes === undefined || isNaN(minutes)) return '12:00 AM';
  let m = Math.max(0, Math.min(1440, Math.round(minutes)));

  if (m === 1440) {
    return is24Hour ? '24:00' : '11:59 PM';
  }

  const hours24 = Math.floor(m / 60);
  const mins = m % 60;
  const minsStr = mins.toString().padStart(2, '0');

  if (is24Hour) {
    return `${hours24.toString().padStart(2, '0')}:${minsStr}`;
  }

  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${minsStr} ${period}`;
}

/**
 * Parse time string (e.g. "08:30", "8:30 AM", "14:15") to minutes from midnight (0..1440)
 */
function timeStringToMinutes(timeStr) {
  if (!timeStr) return 0;
  const trimmed = timeStr.trim();

  // Check 12-hour format with AM/PM
  const match12 = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const mins = parseInt(match12[2], 10);
    const period = match12[3] ? match12[3].toUpperCase() : null;

    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return Math.max(0, Math.min(1440, hours * 60 + mins));
  }

  return 0;
}

/**
 * Format duration in minutes into clean readable string (e.g. "1h 30m" or "45m")
 */
function formatDuration(durationMinutes) {
  const m = Math.max(0, Math.round(durationMinutes));
  const hours = Math.floor(m / 60);
  const mins = m % 60;

  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  return `${mins}m`;
}

/**
 * Snap minutes to configurable interval step (e.g. 5, 10, 15, 30 min)
 */
function snapMinutes(minutes, step = 15) {
  if (!step || step <= 1) return Math.round(minutes);
  return Math.round(minutes / step) * step;
}

/**
 * Format Date object to "YYYY-MM-DD" key
 */
function formatDateKey(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format Date to header string (e.g. "Wed, Jun 12")
 */
function formatDateDisplay(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Get array of 7 Date objects representing Monday-Sunday for the given reference date
 */
function getWeekDates(referenceDate) {
  const curr = new Date(referenceDate);
  // Get day index: 0 = Sun, 1 = Mon, ..., 6 = Sat
  const day = curr.getDay();
  // Calculate distance to previous Monday (if Sunday, distance is 6)
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(curr);
  monday.setDate(curr.getDate() + diffToMonday);

  const week = [];
  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(monday);
    nextDay.setDate(monday.getDate() + i);
    week.push(nextDay);
  }
  return week;
}


/* --- MODULE: js/engine/conflicts.js --- */
/**
 * TimeGrid - Real-Time Conflict Detection Engine
 * Detects overlapping time block intervals, conflicting event titles, and overlap durations.
 */

/**
 * Detect all conflicts among a list of time blocks for the same day
 */
function detectConflicts(blocks = []) {
  const conflictMap = new Map(); // blockId -> { hasConflict, conflictingWith: [{ id, title, overlapMinutes }], totalOverlapMinutes }

  // Initialize map
  for (const b of blocks) {
    conflictMap.set(b.id, {
      hasConflict: false,
      conflictingWith: [],
      totalOverlapMinutes: 0
    });
  }

  // Pairwise interval check
  for (let i = 0; i < blocks.length; i++) {
    const b1 = blocks[i];
    const s1 = b1.startMinute;
    const e1 = b1.endMinute;

    for (let j = i + 1; j < blocks.length; j++) {
      const b2 = blocks[j];
      const s2 = b2.startMinute;
      const e2 = b2.endMinute;

      // Interval overlap check: max(s1, s2) < min(e1, e2)
      const overlapStart = Math.max(s1, s2);
      const overlapEnd = Math.min(e1, e2);

      if (overlapStart < overlapEnd) {
        const overlapDuration = overlapEnd - overlapStart;

        const info1 = conflictMap.get(b1.id);
        const info2 = conflictMap.get(b2.id);

        info1.hasConflict = true;
        info1.conflictingWith.push({ id: b2.id, title: b2.title, overlapMinutes: overlapDuration });
        info1.totalOverlapMinutes += overlapDuration;

        info2.hasConflict = true;
        info2.conflictingWith.push({ id: b1.id, title: b1.title, overlapMinutes: overlapDuration });
        info2.totalOverlapMinutes += overlapDuration;
      }
    }
  }

  return conflictMap;
}

/**
 * Calculate summary schedule metrics (Total Focus Time, Meeting Time, Free Time, Conflict Count)
 */
function calculateScheduleMetrics(blocks = [], workStartMin = 540, workEndMin = 1080) {
  let totalScheduled = 0;
  let focusTime = 0;
  let meetingTime = 0;
  let routineTime = 0;
  let healthTime = 0;
  let adminTime = 0;

  for (const b of blocks) {
    const dur = Math.max(0, b.endMinute - b.startMinute);
    totalScheduled += dur;

    const cat = (b.category || '').toLowerCase();
    if (cat === 'deep work' || cat === 'focus') focusTime += dur;
    else if (cat === 'meeting' || cat === 'meetings') meetingTime += dur;
    else if (cat === 'routine' || cat === 'personal') routineTime += dur;
    else if (cat === 'health' || cat === 'fitness') healthTime += dur;
    else adminTime += dur;
  }

  const conflicts = detectConflicts(blocks);
  let totalConflicts = 0;
  let totalOverlapMin = 0;

  for (const [, info] of conflicts) {
    if (info.hasConflict) {
      totalConflicts++;
      totalOverlapMin += info.totalOverlapMinutes;
    }
  }

  // Workday length (e.g. 9 AM - 6 PM = 540 minutes)
  const workdayLength = Math.max(0, workEndMin - workStartMin);
  const freeWorkdayTime = Math.max(0, workdayLength - (focusTime + meetingTime + adminTime));
  const efficiency = workdayLength > 0 ? Math.min(100, Math.round(((focusTime) / (focusTime + meetingTime + 1)) * 100)) : 0;

  return {
    totalScheduled,
    focusTime,
    meetingTime,
    routineTime,
    healthTime,
    adminTime,
    freeWorkdayTime,
    totalConflicts: Math.round(totalConflicts / 2), // Unique pairs
    totalOverlapMin: Math.round(totalOverlapMin / 2),
    efficiency
  };
}


/* --- MODULE: js/engine/recurrence.js --- */
/**
 * TimeGrid - Recurring Routine Engine
 * Evaluates recurring rules (Daily, Weekdays, Weekends, Custom Days) and expands blocks across dates.
 */

const RECURRENCE_TYPES = {
  NONE: 'none',
  DAILY: 'daily',
  WEEKDAYS: 'weekdays',
  WEEKENDS: 'weekends',
  WEEKLY: 'weekly'
};

/**
 * Check if a recurring event applies to a specific target date
 */
function isEventActiveOnDate(event, targetDate) {
  const recurrence = event.recurrence || RECURRENCE_TYPES.NONE;
  if (recurrence === RECURRENCE_TYPES.NONE) {
    return event.date === targetDate;
  }

  const d = new Date(targetDate + 'T00:00:00');
  const dayOfWeek = d.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

  if (recurrence === RECURRENCE_TYPES.DAILY) {
    return true;
  }

  if (recurrence === RECURRENCE_TYPES.WEEKDAYS) {
    return dayOfWeek >= 1 && dayOfWeek <= 5;
  }

  if (recurrence === RECURRENCE_TYPES.WEEKENDS) {
    return dayOfWeek === 0 || dayOfWeek === 6;
  }

  if (recurrence === RECURRENCE_TYPES.WEEKLY) {
    // Check specific days array if present or match origin event date's day of week
    if (Array.isArray(event.recurrenceDays)) {
      return event.recurrenceDays.includes(dayOfWeek);
    }
    const originDay = new Date((event.date || targetDate) + 'T00:00:00').getDay();
    return dayOfWeek === originDay;
  }

  return false;
}


/* --- MODULE: js/engine/templates.js --- */
/**
 * TimeGrid - Pre-Built Schedule Templates & Categories
 * Routine architectures for focused development, meeting marathons, balanced routines, and weekend balance.
 */

const CATEGORIES = {
  'Deep Work': { name: 'Deep Work', color: '#0284c7', bg: 'rgba(2, 132, 199, 0.2)', border: '#0284c7' },
  'Meetings': { name: 'Meetings', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.2)', border: '#8b5cf6' },
  'Health': { name: 'Health', color: '#10b981', bg: 'rgba(16, 185, 129, 0.2)', border: '#10b981' },
  'Admin': { name: 'Admin', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.2)', border: '#f59e0b' },
  'Personal': { name: 'Personal', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.2)', border: '#ec4899' }
};

const SCHEDULE_TEMPLATES = [
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


/* --- MODULE: js/engine/sample-data.js --- */
/**
 * TimeGrid - Pre-Loaded Demonstration Schedule & Backlog Tasks
 * Rich baseline data populated across the current week.
 */



function getSampleScheduleData(referenceDate = new Date()) {
  const weekDates = getWeekDates(referenceDate);
  const monKey = formatDateKey(weekDates[0]);
  const tueKey = formatDateKey(weekDates[1]);
  const wedKey = formatDateKey(weekDates[2]);
  const thuKey = formatDateKey(weekDates[3]);
  const friKey = formatDateKey(weekDates[4]);
  const satKey = formatDateKey(weekDates[5]);
  const sunKey = formatDateKey(weekDates[6]);

  const blocks = [
    // Monday
    { id: 'b_mon_1', date: monKey, title: 'Morning Workout & Stretch', startMinute: 420, endMinute: 480, category: 'Health', priority: 'Med', color: '#10b981', notes: 'Gym resistance training session' },
    { id: 'b_mon_2', date: monKey, title: 'Weekly Engineering Kickoff', startMinute: 540, endMinute: 600, category: 'Meetings', priority: 'High', color: '#8b5cf6', notes: 'Sprint roadmap review with product team' },
    { id: 'b_mon_3', date: monKey, title: 'Deep Work: Database Query Engine', startMinute: 600, endMinute: 750, category: 'Deep Work', priority: 'High', color: '#0284c7', notes: 'Implement subquery AST optimizer' },
    { id: 'b_mon_4', date: monKey, title: 'Lunch & Fresh Air', startMinute: 750, endMinute: 810, category: 'Personal', priority: 'Low', color: '#ec4899', notes: 'Outdoor walk' },
    { id: 'b_mon_5', date: monKey, title: 'Feature Development: Time Grid UI', startMinute: 810, endMinute: 990, category: 'Deep Work', priority: 'High', color: '#0284c7', notes: 'Interactive canvas dragging and resizing handles' },
    { id: 'b_mon_6', date: monKey, title: 'Code Reviews & Inbox Zero', startMinute: 990, endMinute: 1050, category: 'Admin', priority: 'Med', color: '#f59e0b', notes: 'PR feedback and triage' },

    // Tuesday
    { id: 'b_tue_1', date: tueKey, title: 'Morning Jog & Hydration', startMinute: 450, endMinute: 510, category: 'Health', priority: 'Med', color: '#10b981' },
    { id: 'b_tue_2', date: tueKey, title: 'Deep Work: Collision Detection Engine', startMinute: 540, endMinute: 720, category: 'Deep Work', priority: 'High', color: '#0284c7' },
    { id: 'b_tue_3', date: tueKey, title: 'Lunch Break', startMinute: 720, endMinute: 780, category: 'Personal', priority: 'Low', color: '#ec4899' },
    { id: 'b_tue_4', date: tueKey, title: 'Product Architecture Sync', startMinute: 810, endMinute: 870, category: 'Meetings', priority: 'High', color: '#8b5cf6' },
    { id: 'b_tue_5', date: tueKey, title: 'Deep Work: IndexedDB Persistence', startMinute: 900, endMinute: 1020, category: 'Deep Work', priority: 'Med', color: '#0284c7' },

    // Wednesday
    { id: 'b_wed_1', date: wedKey, title: 'Core Architecture Deep Dive', startMinute: 540, endMinute: 720, category: 'Deep Work', priority: 'High', color: '#0284c7' },
    { id: 'b_wed_2', date: wedKey, title: 'Lunch & Reading', startMinute: 720, endMinute: 780, category: 'Personal', priority: 'Low', color: '#ec4899' },
    { id: 'b_wed_3', date: wedKey, title: '1-on-1 Engineering Catchup', startMinute: 840, endMinute: 900, category: 'Meetings', priority: 'Med', color: '#8b5cf6' },
    { id: 'b_wed_4', date: wedKey, title: 'System Performance Profiling', startMinute: 930, endMinute: 1050, category: 'Deep Work', priority: 'High', color: '#0284c7' },

    // Thursday
    { id: 'b_thu_1', date: thuKey, title: 'Morning Workout', startMinute: 420, endMinute: 480, category: 'Health', priority: 'Med', color: '#10b981' },
    { id: 'b_thu_2', date: thuKey, title: 'Sprint Review & QA Audit', startMinute: 540, endMinute: 630, category: 'Meetings', priority: 'High', color: '#8b5cf6' },
    { id: 'b_thu_3', date: thuKey, title: 'Deep Work: Focus Timer Engine', startMinute: 660, endMinute: 810, category: 'Deep Work', priority: 'High', color: '#0284c7' },
    { id: 'b_thu_4', date: thuKey, title: 'Design System Polish', startMinute: 870, endMinute: 990, category: 'Deep Work', priority: 'Med', color: '#0284c7' },

    // Friday
    { id: 'b_fri_1', date: friKey, title: 'Team Demo & Retrospective', startMinute: 570, endMinute: 660, category: 'Meetings', priority: 'High', color: '#8b5cf6' },
    { id: 'b_fri_2', date: friKey, title: 'Deep Work: Production Release Build', startMinute: 690, endMinute: 840, category: 'Deep Work', priority: 'High', color: '#0284c7' },
    { id: 'b_fri_3', date: friKey, title: 'Weekly Wrap-up & Next Week Plan', startMinute: 930, endMinute: 1020, category: 'Admin', priority: 'Med', color: '#f59e0b' },

    // Saturday
    { id: 'b_sat_1', date: satKey, title: 'Weekend Trail Run & Outdoor Hike', startMinute: 480, endMinute: 600, category: 'Health', priority: 'Med', color: '#10b981' },
    { id: 'b_sat_2', date: satKey, title: 'Creative Studio Passion Project', startMinute: 660, endMinute: 840, category: 'Personal', priority: 'High', color: '#ec4899' },

    // Sunday
    { id: 'b_sun_1', date: sunKey, title: 'Morning Coffee & Weekly Journaling', startMinute: 540, endMinute: 630, category: 'Personal', priority: 'Low', color: '#ec4899' },
    { id: 'b_sun_2', date: sunKey, title: 'Meal Prep & Kitchen Cooking', startMinute: 720, endMinute: 840, category: 'Health', priority: 'Low', color: '#10b981' }
  ];

  const backlogTasks = [
    { id: 'task_1', title: 'Refactor Drag & Drop coordinate math', estimatedMinutes: 60, category: 'Deep Work', priority: 'High' },
    { id: 'task_2', title: 'Prepare Q3 OKR deck for executive sync', estimatedMinutes: 90, category: 'Admin', priority: 'Med' },
    { id: 'task_3', title: 'Research web worker IndexedDB batching', estimatedMinutes: 45, category: 'Deep Work', priority: 'Low' },
    { id: 'task_4', title: 'Call healthcare provider for annual dental checkup', estimatedMinutes: 30, category: 'Personal', priority: 'Med' },
    { id: 'task_5', title: 'Review open pull requests on github', estimatedMinutes: 45, category: 'Admin', priority: 'Med' }
  ];

  return { blocks, backlogTasks };
}


/* --- MODULE: js/engine/charts.js --- */
/**
 * TimeGrid - Schedule Analytics & Canvas 2D Charting Engine
 * Category distribution donut chart and time allocation visualizations.
 */




function renderCategoryDonut(canvas, blocks = []) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // Group minutes by category
  const catMinutes = {};
  let totalMin = 0;

  for (const b of blocks) {
    const dur = Math.max(0, b.endMinute - b.startMinute);
    const cat = b.category || 'Deep Work';
    catMinutes[cat] = (catMinutes[cat] || 0) + dur;
    totalMin += dur;
  }

  const entries = Object.entries(catMinutes).filter(([, mins]) => mins > 0);

  if (totalMin === 0 || entries.length === 0) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No scheduled blocks for this date', w / 2, h / 2);
    return;
  }

  const centerX = w / 2;
  const centerY = h / 2 - 10;
  const outerRadius = Math.min(centerX, centerY) - 15;
  const innerRadius = outerRadius * 0.62;

  let startAngle = -Math.PI / 2;

  for (const [cat, mins] of entries) {
    const sliceAngle = (mins / totalMin) * (Math.PI * 2);
    const endAngle = startAngle + sliceAngle;
    const catDef = CATEGORIES[cat] || { color: '#0284c7' };

    ctx.fillStyle = catDef.color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
    ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fill();

    startAngle = endAngle;
  }

  // Center Text (Total Scheduled Duration)
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 15px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(formatDuration(totalMin), centerX, centerY + 2);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px sans-serif';
  ctx.fillText('Total Scheduled', centerX, centerY + 16);
}


/* --- MODULE: js/core/db.js --- */
/**
 * TimeGrid - IndexedDB Storage Engine
 * Persists time blocks, unscheduled task backlog, scenarios, and custom routines.
 */



const DB_NAME = 'TimeGrid_DB';
const DB_VERSION = 1;

class TimeGridDB {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('blocks')) {
          const store = db.createObjectStore('blocks', { keyPath: 'id' });
          store.createIndex('date', 'date', { unique: false });
        }
        if (!db.objectStoreNames.contains('backlog')) {
          db.createObjectStore('backlog', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('scenarios')) {
          db.createObjectStore('scenarios', { keyPath: 'id' });
        }
      };

      req.onsuccess = async (e) => {
        this.db = e.target.result;
        // Check if database is empty; if so populate with sample data
        const blocks = await this.getAllBlocks();
        if (blocks.length === 0) {
          const { blocks: sampleBlocks, backlogTasks } = getSampleScheduleData();
          for (const b of sampleBlocks) await this.saveBlock(b);
          for (const t of backlogTasks) await this.saveBacklogTask(t);
        }
        resolve(this.db);
      };

      req.onerror = () => {
        console.warn('IndexedDB unavailable, falling back to localStorage');
        resolve(null);
      };
    });
  }

  async getAllBlocks() {
    if (!this.db) {
      const str = localStorage.getItem('timegrid_blocks');
      return str ? JSON.parse(str) : [];
    }
    return new Promise((resolve) => {
      const tx = this.db.transaction('blocks', 'readonly');
      const store = tx.objectStore('blocks');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }

  async saveBlock(block) {
    if (!this.db) {
      const all = await this.getAllBlocks();
      const idx = all.findIndex(b => b.id === block.id);
      if (idx >= 0) all[idx] = block;
      else all.push(block);
      localStorage.setItem('timegrid_blocks', JSON.stringify(all));
      return;
    }
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('blocks', 'readwrite');
      const store = tx.objectStore('blocks');
      store.put(block);
      tx.oncomplete = () => resolve(block);
      tx.onerror = () => reject(tx.error);
    });
  }

  async deleteBlock(id) {
    if (!this.db) {
      let all = await this.getAllBlocks();
      all = all.filter(b => b.id !== id);
      localStorage.setItem('timegrid_blocks', JSON.stringify(all));
      return;
    }
    return new Promise((resolve) => {
      const tx = this.db.transaction('blocks', 'readwrite');
      const store = tx.objectStore('blocks');
      store.delete(id);
      tx.oncomplete = () => resolve();
    });
  }

  async getAllBacklogTasks() {
    if (!this.db) {
      const str = localStorage.getItem('timegrid_backlog');
      return str ? JSON.parse(str) : [];
    }
    return new Promise((resolve) => {
      const tx = this.db.transaction('backlog', 'readonly');
      const store = tx.objectStore('backlog');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }

  async saveBacklogTask(task) {
    if (!this.db) {
      const all = await this.getAllBacklogTasks();
      const idx = all.findIndex(t => t.id === task.id);
      if (idx >= 0) all[idx] = task;
      else all.push(task);
      localStorage.setItem('timegrid_backlog', JSON.stringify(all));
      return;
    }
    return new Promise((resolve) => {
      const tx = this.db.transaction('backlog', 'readwrite');
      const store = tx.objectStore('backlog');
      store.put(task);
      tx.oncomplete = () => resolve(task);
    });
  }

  async deleteBacklogTask(id) {
    if (!this.db) {
      let all = await this.getAllBacklogTasks();
      all = all.filter(t => t.id !== id);
      localStorage.setItem('timegrid_backlog', JSON.stringify(all));
      return;
    }
    return new Promise((resolve) => {
      const tx = this.db.transaction('backlog', 'readwrite');
      const store = tx.objectStore('backlog');
      store.delete(id);
      tx.oncomplete = () => resolve();
    });
  }

  async resetToSampleData() {
    const { blocks: sampleBlocks, backlogTasks } = getSampleScheduleData();
    if (!this.db) {
      localStorage.setItem('timegrid_blocks', JSON.stringify(sampleBlocks));
      localStorage.setItem('timegrid_backlog', JSON.stringify(backlogTasks));
      return;
    }
    const tx = this.db.transaction(['blocks', 'backlog'], 'readwrite');
    tx.objectStore('blocks').clear();
    tx.objectStore('backlog').clear();
    for (const b of sampleBlocks) tx.objectStore('blocks').put(b);
    for (const t of backlogTasks) tx.objectStore('backlog').put(t);
    return new Promise(resolve => {
      tx.oncomplete = () => resolve();
    });
  }
}

const db = new TimeGridDB();


/* --- MODULE: js/editor/time-grid.js --- */
/**
 * TimeGrid - Interactive Visual Time Grid Component
 * Renders 24h vertical grid, Day/Workweek/Full Week columns, live current-time indicator,
 * and direct drag-and-drop / duration-resizing handlers.
 */






const GRID_VIEWS = {
  DAY: 'day',
  WORKWEEK: 'workweek',
  WEEK: 'week'
};

const HOUR_HEIGHT = 56; // 56px per hour
const TOTAL_HEIGHT = HOUR_HEIGHT * 24; // 1344px for full 24h

class TimeGridView {
  constructor(container, {
    onSelectBlock = null,
    onMoveBlock = null,
    onResizeBlock = null,
    onCreateBlockAt = null,
    onDropTask = null
  }) {
    this.container = container;
    this.onSelectBlock = onSelectBlock;
    this.onMoveBlock = onMoveBlock;
    this.onResizeBlock = onResizeBlock;
    this.onCreateBlockAt = onCreateBlockAt;
    this.onDropTask = onDropTask;

    this.selectedBlockId = null;
    this.viewMode = GRID_VIEWS.DAY;
    this.currentDate = new Date();
    this.is24Hour = false;
    this.gridSnap = 15; // 15 min default
  }

  render({
    blocks = [],
    selectedBlockId = null,
    viewMode = GRID_VIEWS.DAY,
    currentDate = new Date(),
    is24Hour = false,
    gridSnap = 15
  }) {
    this.selectedBlockId = selectedBlockId;
    this.viewMode = viewMode;
    this.currentDate = new Date(currentDate);
    this.is24Hour = is24Hour;
    this.gridSnap = gridSnap;

    const days = this.getColumnsForView();

    this.container.innerHTML = `
      <div class="time-grid-wrapper flex flex-col h-full overflow-hidden">
        
        <!-- Header: Day / Column Titles -->
        <div class="grid-columns-header flex border-b bg-panel">
          <!-- Time Gutter Spacer -->
          <div class="time-gutter-header w-16 border-r text-center py-2 text-xs font-bold text-muted uppercase">
            Time
          </div>
          <!-- Day Column Headers -->
          <div class="grid-header-days flex-1 grid ${days.length === 1 ? 'grid-cols-1' : (days.length === 5 ? 'grid-cols-5' : 'grid-cols-7')}">
            ${days.map(d => {
              const isToday = formatDateKey(d) === formatDateKey(new Date());
              return `
                <div class="day-header-cell p-2 text-center border-r ${isToday ? 'bg-primary-subtle' : ''}">
                  <span class="text-xs font-semibold text-muted block">${d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  <span class="font-bold text-sm ${isToday ? 'text-primary' : 'text-secondary'}">${d.getDate()}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Scrollable 24-Hour Grid Canvas Body -->
        <div class="grid-canvas-scroll flex-1 overflow-y-auto relative" id="time-grid-scroll-area">
          <div class="grid-canvas-inner flex relative" style="height: ${TOTAL_HEIGHT}px;">
            
            <!-- Left Time Gutter (00:00 to 23:00) -->
            <div class="time-gutter-column w-16 border-r flex flex-col shrink-0 select-none">
              ${Array.from({ length: 24 }).map((_, h) => `
                <div class="time-hour-label flex items-start justify-center text-xs font-mono text-muted" style="height: ${HOUR_HEIGHT}px; margin-top: -7px;">
                  ${minutesToTimeString(h * 60, this.is24Hour)}
                </div>
              `).join('')}
            </div>

            <!-- Day Columns Grid -->
            <div class="grid-days-container flex-1 grid ${days.length === 1 ? 'grid-cols-1' : (days.length === 5 ? 'grid-cols-5' : 'grid-cols-7')} relative">
              
              <!-- Horizontal Hour Grid Background Lines -->
              <div class="grid-bg-hour-lines absolute inset-0 pointer-events-none">
                ${Array.from({ length: 24 }).map((_, h) => `
                  <div class="grid-hour-line border-b border-subtle relative" style="height: ${HOUR_HEIGHT}px;">
                    <div class="grid-half-hour-line border-b border-muted absolute w-full" style="top: ${HOUR_HEIGHT / 2}px;"></div>
                  </div>
                `).join('')}
              </div>

              <!-- Live Current Time Indicator Line (If today is in view) -->
              ${this.renderCurrentTimeLine(days)}

              <!-- Interactive Columns -->
              ${days.map(d => {
                const dateKey = formatDateKey(d);
                const dayBlocks = blocks.filter(b => b.date === dateKey);
                const conflictMap = detectConflicts(dayBlocks);

                return `
                  <div class="day-time-column relative border-r" data-date="${dateKey}" style="height: ${TOTAL_HEIGHT}px;">
                    ${dayBlocks.map(b => this.renderBlockCard(b, conflictMap.get(b.id))).join('')}
                  </div>
                `;
              }).join('')}

            </div>

          </div>
        </div>

      </div>
    `;

    this.attachGridInteractions();
  }

  getColumnsForView() {
    if (this.viewMode === GRID_VIEWS.DAY) {
      return [this.currentDate];
    }
    const week = getWeekDates(this.currentDate);
    if (this.viewMode === GRID_VIEWS.WORKWEEK) {
      return week.slice(0, 5); // Mon-Fri
    }
    return week; // Mon-Sun
  }

  renderCurrentTimeLine(days) {
    const now = new Date();
    const todayKey = formatDateKey(now);
    const dayIndex = days.findIndex(d => formatDateKey(d) === todayKey);
    if (dayIndex === -1) return '';

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const topPx = (currentMinutes / 60) * HOUR_HEIGHT;
    const colWidthPct = 100 / days.length;
    const leftPct = dayIndex * colWidthPct;

    return `
      <div class="current-time-line absolute z-20 pointer-events-none flex items-center" style="top: ${topPx}px; left: ${leftPct}%; width: ${colWidthPct}%;">
        <div class="current-time-dot w-2.5 h-2.5 bg-rose rounded-full -ml-1 shadow-glow"></div>
        <div class="flex-1 h-0.5 bg-rose"></div>
      </div>
    `;
  }

  renderBlockCard(block, conflictInfo = null) {
    const startMin = block.startMinute;
    const endMin = block.endMinute;
    const durMin = Math.max(15, endMin - startMin);

    const topPx = (startMin / 60) * HOUR_HEIGHT;
    const heightPx = Math.max(22, (durMin / 60) * HOUR_HEIGHT);

    const isSelected = block.id === this.selectedBlockId;
    const hasConflict = conflictInfo && conflictInfo.hasConflict;
    const catDef = CATEGORIES[block.category] || { color: '#0284c7', bg: 'rgba(2, 132, 199, 0.2)' };

    return `
      <div class="time-block-card absolute rounded select-none cursor-move ${isSelected ? 'selected' : ''} ${hasConflict ? 'has-conflict' : ''}"
           data-id="${block.id}"
           data-date="${block.date}"
           style="top: ${topPx}px; height: ${heightPx}px; background-color: ${block.color || catDef.color}; border-left: 4px solid ${block.color || catDef.color};">
        
        <!-- Top Resize Handle -->
        <div class="block-resize-handle top-handle absolute top-0 inset-x-0 h-1.5 cursor-ns-resize" data-handle="top"></div>

        <!-- Block Content -->
        <div class="block-content-inner p-1.5 flex flex-col h-full overflow-hidden justify-between pointer-events-none">
          <div class="flex items-center justify-between gap-1">
            <span class="block-title font-bold text-xs text-white truncate">${escapeHTML(block.title)}</span>
            ${hasConflict ? `
              <span class="badge badge-conflict flex items-center gap-0.5 text-xs text-amber font-bold" title="Overlap: ${conflictInfo.totalOverlapMinutes}m with ${conflictInfo.conflictingWith.map(c => c.title).join(', ')}">
                ${getIcon('alert', 'icon-xs')}
              </span>
            ` : ''}
          </div>

          <!-- Time Span & Duration -->
          ${durMin >= 30 ? `
            <div class="flex items-center justify-between text-xs text-white-muted font-mono" style="font-size: 10px;">
              <span>${minutesToTimeString(startMin, this.is24Hour)} - ${minutesToTimeString(endMin, this.is24Hour)}</span>
              <span>${formatDuration(durMin)}</span>
            </div>
          ` : ''}
        </div>

        <!-- Bottom Resize Handle -->
        <div class="block-resize-handle bottom-handle absolute bottom-0 inset-x-0 h-1.5 cursor-ns-resize" data-handle="bottom"></div>
      </div>
    `;
  }

  attachGridInteractions() {
    const scrollArea = this.container.querySelector('#time-grid-scroll-area');

    // Auto-scroll to 8:00 AM on initial view
    if (scrollArea && !this.hasScrolled) {
      scrollArea.scrollTop = 8 * HOUR_HEIGHT - 20;
      this.hasScrolled = true;
    }

    // Click on Block -> Select
    this.container.querySelectorAll('.time-block-card').forEach(el => {
      el.addEventListener('mousedown', (e) => {
        const handle = e.target.dataset.handle;
        const blockId = el.dataset.id;

        if (handle) {
          // Resizing top or bottom
          this.startResizing(e, blockId, handle);
        } else {
          // Dragging block
          this.startDragging(e, blockId);
        }

        if (this.onSelectBlock) {
          this.onSelectBlock(blockId);
        }
        e.stopPropagation();
      });
    });

    // Double-Click on Column -> Create New Block at Clicked Time
    this.container.querySelectorAll('.day-time-column').forEach(col => {
      col.addEventListener('dblclick', (e) => {
        const rect = col.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const clickedMin = (y / HOUR_HEIGHT) * 60;
        const snappedMin = Math.round(clickedMin / this.gridSnap) * this.gridSnap;
        const date = col.dataset.date;

        if (this.onCreateBlockAt) {
          this.onCreateBlockAt({
            date,
            startMinute: snappedMin,
            endMinute: Math.min(1440, snappedMin + 60)
          });
        }
      });
    });

    // Drag-and-Drop Task from Left Backlog
    this.container.querySelectorAll('.day-time-column').forEach(col => {
      col.addEventListener('dragover', (e) => e.preventDefault());
      col.addEventListener('drop', (e) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('text/plain');
        if (taskId && this.onDropTask) {
          const rect = col.getBoundingClientRect();
          const y = e.clientY - rect.top;
          const clickedMin = (y / HOUR_HEIGHT) * 60;
          const snappedMin = Math.round(clickedMin / this.gridSnap) * this.gridSnap;
          this.onDropTask(taskId, col.dataset.date, snappedMin);
        }
      });
    });
  }

  startDragging(e, blockId) {
    e.preventDefault();
    const blockEl = this.container.querySelector(`.time-block-card[data-id="${blockId}"]`);
    if (!blockEl) return;

    const initialY = e.clientY;
    const initialTop = parseFloat(blockEl.style.top) || 0;
    const initialHeight = parseFloat(blockEl.style.height) || 0;
    const initialStartMin = Math.round((initialTop / HOUR_HEIGHT) * 60);
    const durationMin = Math.round((initialHeight / HOUR_HEIGHT) * 60);

    const onMouseMove = (moveEv) => {
      const deltaY = moveEv.clientY - initialY;
      const newTop = initialTop + deltaY;
      const rawMin = (newTop / HOUR_HEIGHT) * 60;
      const snappedStart = Math.max(0, Math.min(1440 - durationMin, Math.round(rawMin / this.gridSnap) * this.gridSnap));
      blockEl.style.top = `${(snappedStart / 60) * HOUR_HEIGHT}px`;
    };

    const onMouseUp = (upEv) => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      const finalTop = parseFloat(blockEl.style.top) || 0;
      const finalStartMin = Math.round((finalTop / HOUR_HEIGHT) * 60);

      // Check if dragged onto a different day column
      let finalDate = blockEl.dataset.date;
      const dayCols = Array.from(this.container.querySelectorAll('.day-time-column'));
      for (const col of dayCols) {
        const rect = col.getBoundingClientRect();
        if (upEv.clientX >= rect.left && upEv.clientX <= rect.right) {
          finalDate = col.dataset.date;
          break;
        }
      }

      if (this.onMoveBlock) {
        this.onMoveBlock(blockId, {
          date: finalDate,
          startMinute: finalStartMin,
          endMinute: finalStartMin + durationMin
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  startResizing(e, blockId, handle) {
    e.preventDefault();
    const blockEl = this.container.querySelector(`.time-block-card[data-id="${blockId}"]`);
    if (!blockEl) return;

    const initialY = e.clientY;
    const initialTop = parseFloat(blockEl.style.top) || 0;
    const initialHeight = parseFloat(blockEl.style.height) || 0;
    const initialStartMin = Math.round((initialTop / HOUR_HEIGHT) * 60);
    const initialEndMin = initialStartMin + Math.round((initialHeight / HOUR_HEIGHT) * 60);

    const onMouseMove = (moveEv) => {
      const deltaY = moveEv.clientY - initialY;

      if (handle === 'top') {
        const newTop = initialTop + deltaY;
        const rawMin = (newTop / HOUR_HEIGHT) * 60;
        const snappedStart = Math.max(0, Math.min(initialEndMin - 15, Math.round(rawMin / this.gridSnap) * this.gridSnap));
        const newHeight = ((initialEndMin - snappedStart) / 60) * HOUR_HEIGHT;
        blockEl.style.top = `${(snappedStart / 60) * HOUR_HEIGHT}px`;
        blockEl.style.height = `${newHeight}px`;
      } else {
        // Bottom handle
        const newHeight = initialHeight + deltaY;
        const rawEndMin = initialStartMin + (newHeight / HOUR_HEIGHT) * 60;
        const snappedEnd = Math.min(1440, Math.max(initialStartMin + 15, Math.round(rawEndMin / this.gridSnap) * this.gridSnap));
        blockEl.style.height = `${((snappedEnd - initialStartMin) / 60) * HOUR_HEIGHT}px`;
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      const finalTop = parseFloat(blockEl.style.top) || 0;
      const finalHeight = parseFloat(blockEl.style.height) || 0;
      const finalStart = Math.round((finalTop / HOUR_HEIGHT) * 60);
      const finalEnd = finalStart + Math.round((finalHeight / HOUR_HEIGHT) * 60);

      if (this.onResizeBlock) {
        this.onResizeBlock(blockId, {
          startMinute: finalStart,
          endMinute: finalEnd
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }
}


/* --- MODULE: js/editor/task-drawer.js --- */
/**
 * TimeGrid - Task Backlog & Routine Templates Drawer (Left Panel)
 * Unscheduled task inbox, drag-to-schedule cards, and 1-click routine architecture templates.
 */





function renderTaskDrawer(container, {
  backlogTasks = [],
  onAddTask = null,
  onDeleteTask = null,
  onApplyTemplate = null
}) {
  container.innerHTML = `
    <!-- Top Header -->
    <div class="panel-section-header flex items-center justify-between p-3 border-b">
      <div class="flex items-center gap-2">
        ${getIcon('zap', 'icon-sm text-primary')}
        <span class="text-xs font-bold uppercase text-muted">Task Inbox & Backlog</span>
      </div>
      <span class="badge badge-secondary font-mono">${backlogTasks.length}</span>
    </div>

    <!-- Quick Task Adder Input -->
    <div class="p-3 border-b flex flex-col gap-2">
      <div class="flex items-center gap-1.5">
        <input type="text" id="inp-new-task-title" class="form-control form-control-sm flex-1 font-sans" placeholder="New task title..." />
        <button class="btn btn-xs btn-primary" id="btn-add-backlog-task" title="Add Unscheduled Task">
          ${getIcon('plus', 'icon-xs')} Add
        </button>
      </div>
      <div class="flex items-center gap-2">
        <select id="select-task-category" class="form-control form-control-sm flex-1">
          ${Object.keys(CATEGORIES).map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
        <select id="select-task-duration" class="form-control form-control-sm w-20 font-mono">
          <option value="30">30 min</option>
          <option value="45">45 min</option>
          <option value="60" selected>1 hour</option>
          <option value="90">1.5h</option>
          <option value="120">2 hours</option>
        </select>
      </div>
    </div>

    <!-- Scrollable Unscheduled Tasks List -->
    <div class="task-backlog-scroll p-2 flex flex-col gap-1.5 flex-1 overflow-y-auto">
      <span class="text-xs text-muted font-semibold px-1" style="font-size: 10px;">DRAG ONTO TIME GRID TO SCHEDULE</span>
      ${backlogTasks.length === 0 ? `
        <div class="text-xs text-muted text-center p-4">No unscheduled tasks. Type above to add one.</div>
      ` : backlogTasks.map(task => {
        const catDef = CATEGORIES[task.category] || { color: '#0284c7' };
        return `
          <div class="backlog-task-card card p-2 flex items-center justify-between cursor-grab active:cursor-grabbing hover-elevated"
               draggable="true"
               data-id="${task.id}"
               style="border-left: 3px solid ${catDef.color};">
            <div class="flex flex-col truncate">
              <span class="font-bold text-xs text-primary truncate">${escapeHTML(task.title)}</span>
              <span class="font-mono text-muted text-xs" style="font-size: 10px;">
                ${escapeHTML(task.category)} &bull; ${formatDuration(task.estimatedMinutes || 60)}
              </span>
            </div>
            <button class="btn-icon-xs text-rose btn-delete-backlog-task" data-id="${task.id}" title="Remove Task">
              ${getIcon('trash', 'icon-xs')}
            </button>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Bottom: Schedule Templates Section -->
    <div class="border-t p-3 bg-elevated flex flex-col gap-2">
      <span class="text-xs font-bold uppercase text-muted flex items-center gap-1">
        ${getIcon('layers', 'icon-xs')} Routine Templates
      </span>
      <div class="flex flex-col gap-1.5">
        ${SCHEDULE_TEMPLATES.map(tpl => `
          <button class="btn btn-xs btn-secondary justify-between btn-apply-template" data-id="${tpl.id}" title="${escapeHTML(tpl.description)}">
            <span class="truncate">${escapeHTML(tpl.name)}</span>
            ${getIcon('plus', 'icon-xs')}
          </button>
        `).join('')}
      </div>
    </div>
  `;

  // Attach Task Add & Delete
  container.querySelector('#btn-add-backlog-task')?.addEventListener('click', () => {
    const title = container.querySelector('#inp-new-task-title').value.trim();
    if (!title) return;
    const category = container.querySelector('#select-task-category').value;
    const duration = parseInt(container.querySelector('#select-task-duration').value, 10) || 60;

    if (onAddTask) {
      onAddTask({
        id: 'task_' + Date.now(),
        title,
        category,
        estimatedMinutes: duration,
        priority: 'Med'
      });
    }
    container.querySelector('#inp-new-task-title').value = '';
  });

  container.querySelectorAll('.btn-delete-backlog-task').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (onDeleteTask) onDeleteTask(btn.dataset.id);
    });
  });

  // Attach Drag Start
  container.querySelectorAll('.backlog-task-card').forEach(card => {
    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', card.dataset.id);
    });
  });

  // Attach Template Apply
  container.querySelectorAll('.btn-apply-template').forEach(btn => {
    btn.addEventListener('click', () => {
      const tpl = SCHEDULE_TEMPLATES.find(t => t.id === btn.dataset.id);
      if (tpl && onApplyTemplate) {
        onApplyTemplate(tpl);
      }
    });
  });
}


/* --- MODULE: js/editor/block-inspector.js --- */
/**
 * TimeGrid - Block Property Inspector & Analytics Panel (Right Panel)
 * Time block metadata editor, split/merge/duplicate actions, and schedule category analytics.
 */







function renderBlockInspector(container, {
  selectedBlock = null,
  dayBlocks = [],
  is24Hour = false,
  onUpdateBlock = null,
  onDeleteBlock = null,
  onDuplicateBlock = null,
  onSplitBlock = null,
  onStartFocus = null
}) {
  const metrics = calculateScheduleMetrics(dayBlocks);

  container.innerHTML = `
    <!-- Top Inspector Header -->
    <div class="panel-section-header flex items-center justify-between p-3 border-b">
      <div class="flex items-center gap-2">
        ${getIcon(selectedBlock ? 'clock' : 'chart', 'icon-sm text-primary')}
        <span class="text-xs font-bold uppercase text-muted">
          ${selectedBlock ? 'Block Properties' : 'Daily Schedule Insights'}
        </span>
      </div>
      ${selectedBlock ? `
        <button class="btn btn-xs btn-primary" id="btn-inspect-focus" title="Start Focus Timer">
          ${getIcon('play', 'icon-xs')} Focus
        </button>
      ` : ''}
    </div>

    <!-- Inspector Body Scroll -->
    <div class="inspector-body-scroll p-3 flex flex-col gap-3 flex-1 overflow-y-auto">
      
      <!-- Selected Block Property Editor -->
      ${selectedBlock ? `
        <div class="card p-3 flex flex-col gap-2.5">
          <div class="flex items-center justify-between">
            <span class="font-bold text-xs text-primary truncate">${escapeHTML(selectedBlock.title)}</span>
            <div class="flex items-center gap-1">
              <button class="btn-icon-xs" id="btn-inspect-split" title="Split Block into 2 Half-Hour Segments">${getIcon('split', 'icon-xs')}</button>
              <button class="btn-icon-xs" id="btn-inspect-dupe" title="Duplicate Block">${getIcon('copy', 'icon-xs')}</button>
              <button class="btn-icon-xs text-rose" id="btn-inspect-del" title="Delete Block">${getIcon('trash', 'icon-xs')}</button>
            </div>
          </div>

          <!-- Title -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Event Title</label>
            <input type="text" id="inp-block-title" class="form-control form-control-sm font-semibold" value="${escapeHTML(selectedBlock.title)}" />
          </div>

          <!-- Start & End Time -->
          <div class="grid grid-cols-2 gap-2">
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Start Time</label>
              <input type="text" id="inp-block-start" class="form-control form-control-sm font-mono" value="${minutesToTimeString(selectedBlock.startMinute, is24Hour)}" />
            </div>
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">End Time</label>
              <input type="text" id="inp-block-end" class="form-control form-control-sm font-mono" value="${minutesToTimeString(selectedBlock.endMinute, is24Hour)}" />
            </div>
          </div>

          <!-- Category & Priority -->
          <div class="grid grid-cols-2 gap-2">
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Category</label>
              <select id="select-block-cat" class="form-control form-control-sm">
                ${Object.keys(CATEGORIES).map(c => `
                  <option value="${c}" ${selectedBlock.category === c ? 'selected' : ''}>${c}</option>
                `).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Priority</label>
              <select id="select-block-priority" class="form-control form-control-sm">
                <option value="High" ${selectedBlock.priority === 'High' ? 'selected' : ''}>High Focus</option>
                <option value="Med" ${selectedBlock.priority === 'Med' ? 'selected' : ''}>Medium</option>
                <option value="Low" ${selectedBlock.priority === 'Low' ? 'selected' : ''}>Low / Buffer</option>
              </select>
            </div>
          </div>

          <!-- Recurrence Pattern -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Recurrence Routine</label>
            <select id="select-block-recurrence" class="form-control form-control-sm">
              <option value="none" ${selectedBlock.recurrence === 'none' || !selectedBlock.recurrence ? 'selected' : ''}>Does not repeat</option>
              <option value="daily" ${selectedBlock.recurrence === 'daily' ? 'selected' : ''}>Every day</option>
              <option value="weekdays" ${selectedBlock.recurrence === 'weekdays' ? 'selected' : ''}>Every weekday (Mon-Fri)</option>
              <option value="weekends" ${selectedBlock.recurrence === 'weekends' ? 'selected' : ''}>Every weekend (Sat-Sun)</option>
              <option value="weekly" ${selectedBlock.recurrence === 'weekly' ? 'selected' : ''}>Weekly</option>
            </select>
          </div>

          <!-- Notes -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Notes & Objectives</label>
            <textarea id="inp-block-notes" class="form-control form-control-sm" rows="2" placeholder="Key outcomes or links...">${escapeHTML(selectedBlock.notes || '')}</textarea>
          </div>
        </div>
      ` : ''}

      <!-- Daily Time Distribution Donut Chart -->
      <div class="card p-3 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="font-bold text-xs text-primary uppercase">Time Allocation</span>
          <span class="font-mono text-xs text-muted">${dayBlocks.length} Blocks</span>
        </div>
        <div class="flex items-center justify-center py-1">
          <canvas id="inspector-category-donut" width="220" height="150"></canvas>
        </div>
      </div>

      <!-- Schedule Metrics Summary -->
      <div class="card p-3 flex flex-col gap-2 font-sans text-xs">
        <span class="font-bold text-xs text-primary uppercase">Productivity Metrics</span>

        <div class="grid grid-cols-2 gap-2">
          <div class="card p-2 text-center bg-elevated">
            <span class="text-xs text-muted block">Deep Focus</span>
            <strong class="font-mono text-sm text-primary">${formatDuration(metrics.focusTime)}</strong>
          </div>
          <div class="card p-2 text-center bg-elevated">
            <span class="text-xs text-muted block">Meetings</span>
            <strong class="font-mono text-sm text-primary">${formatDuration(metrics.meetingTime)}</strong>
          </div>
          <div class="card p-2 text-center bg-elevated">
            <span class="text-xs text-muted block">Free Buffer</span>
            <strong class="font-mono text-sm text-emerald">${formatDuration(metrics.freeWorkdayTime)}</strong>
          </div>
          <div class="card p-2 text-center bg-elevated">
            <span class="text-xs text-muted block">Conflicts</span>
            <strong class="font-mono text-sm ${metrics.totalConflicts > 0 ? 'text-amber' : 'text-muted'}">${metrics.totalConflicts}</strong>
          </div>
        </div>
      </div>

    </div>
  `;

  // Draw Category Donut Chart
  const donutCanvas = container.querySelector('#inspector-category-donut');
  if (donutCanvas) {
    renderCategoryDonut(donutCanvas, dayBlocks);
  }

  // Attach Selected Block Handlers
  if (selectedBlock) {
    container.querySelector('#inp-block-title')?.addEventListener('change', (e) => {
      selectedBlock.title = e.target.value.trim() || 'Untitled Block';
      if (onUpdateBlock) onUpdateBlock(selectedBlock);
    });

    container.querySelector('#inp-block-start')?.addEventListener('change', (e) => {
      const min = timeStringToMinutes(e.target.value);
      selectedBlock.startMinute = min;
      if (onUpdateBlock) onUpdateBlock(selectedBlock);
    });

    container.querySelector('#inp-block-end')?.addEventListener('change', (e) => {
      const min = timeStringToMinutes(e.target.value);
      selectedBlock.endMinute = Math.max(selectedBlock.startMinute + 15, min);
      if (onUpdateBlock) onUpdateBlock(selectedBlock);
    });

    container.querySelector('#select-block-cat')?.addEventListener('change', (e) => {
      selectedBlock.category = e.target.value;
      const catDef = CATEGORIES[e.target.value];
      if (catDef) selectedBlock.color = catDef.color;
      if (onUpdateBlock) onUpdateBlock(selectedBlock);
    });

    container.querySelector('#select-block-priority')?.addEventListener('change', (e) => {
      selectedBlock.priority = e.target.value;
      if (onUpdateBlock) onUpdateBlock(selectedBlock);
    });

    container.querySelector('#select-block-recurrence')?.addEventListener('change', (e) => {
      selectedBlock.recurrence = e.target.value;
      if (onUpdateBlock) onUpdateBlock(selectedBlock);
    });

    container.querySelector('#inp-block-notes')?.addEventListener('change', (e) => {
      selectedBlock.notes = e.target.value;
      if (onUpdateBlock) onUpdateBlock(selectedBlock);
    });

    container.querySelector('#btn-inspect-focus')?.addEventListener('click', () => {
      if (onStartFocus) onStartFocus(selectedBlock);
    });

    container.querySelector('#btn-inspect-split')?.addEventListener('click', () => {
      if (onSplitBlock) onSplitBlock(selectedBlock.id);
    });

    container.querySelector('#btn-inspect-dupe')?.addEventListener('click', () => {
      if (onDuplicateBlock) onDuplicateBlock(selectedBlock.id);
    });

    container.querySelector('#btn-inspect-del')?.addEventListener('click', () => {
      if (onDeleteBlock) onDeleteBlock(selectedBlock.id);
    });
  }
}


/* --- MODULE: js/editor/focus-mode.js --- */
/**
 * TimeGrid - Distraction-Free Focus Mode & Countdown Timer Component
 * Fullscreen immersive countdown with circular progress ring, audio cues, and active task focus.
 */



class FocusModeManager {
  constructor(container, onFinishBlock) {
    this.container = container;
    this.onFinishBlock = onFinishBlock;

    this.activeBlock = null;
    this.totalSeconds = 1500; // 25 min default
    this.remainingSeconds = 1500;
    this.isRunning = false;
    this.timerInterval = null;
  }

  startFocus(block) {
    this.activeBlock = block;
    const durMin = Math.max(5, block.endMinute - block.startMinute);
    this.totalSeconds = durMin * 60;
    this.remainingSeconds = this.totalSeconds;
    this.isRunning = true;

    this.render();
    this.container.classList.add('active');
    this.startInterval();
  }

  close() {
    this.pause();
    this.container.classList.remove('active');
  }

  startInterval() {
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.isRunning && this.remainingSeconds > 0) {
        this.remainingSeconds--;
        this.updateDisplay();

        if (this.remainingSeconds <= 0) {
          this.pause();
          alert(`Focus block "${this.activeBlock?.title}" completed!`);
          if (this.onFinishBlock && this.activeBlock) {
            this.onFinishBlock(this.activeBlock.id);
          }
        }
      }
    }, 1000);
  }

  pause() {
    this.isRunning = false;
    this.updateControls();
  }

  resume() {
    this.isRunning = true;
    this.updateControls();
  }

  addTime(minutes = 5) {
    this.remainingSeconds += minutes * 60;
    this.totalSeconds += minutes * 60;
    this.updateDisplay();
  }

  render() {
    if (!this.activeBlock) return;

    this.container.innerHTML = `
      <div class="focus-overlay-backdrop"></div>
      <div class="focus-overlay-content flex flex-col items-center justify-between p-8 text-center h-full max-w-lg mx-auto relative z-10">
        
        <!-- Top Bar -->
        <div class="w-full flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="badge badge-primary font-bold">${escapeHTML(this.activeBlock.category || 'Focus')}</span>
            <span class="text-xs text-muted font-mono">${escapeHTML(this.activeBlock.priority || 'High')} Priority</span>
          </div>
          <button class="btn-icon-xs text-muted btn-focus-close" title="Exit Focus Mode">&times;</button>
        </div>

        <!-- Center Countdown Timer & Progress Ring -->
        <div class="focus-timer-center flex flex-col items-center justify-center my-auto">
          <!-- Circular Progress Ring SVG -->
          <div class="relative flex items-center justify-center w-64 h-64">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" stroke="currentColor" stroke-width="4" class="text-subtle opacity-20" fill="transparent" />
              <circle id="focus-progress-circle" cx="50" cy="50" r="44" stroke="${this.activeBlock.color || '#38bdf8'}" stroke-width="4" stroke-linecap="round" fill="transparent" stroke-dasharray="276.46" stroke-dashoffset="0" />
            </svg>

            <!-- Time Display Inside Ring -->
            <div class="absolute flex flex-col items-center">
              <span class="font-mono font-bold text-4xl text-primary" id="lbl-focus-time-left">${this.formatCountdown()}</span>
              <span class="text-xs text-muted mt-1 uppercase font-semibold">Remaining</span>
            </div>
          </div>

          <!-- Active Task Title & Notes -->
          <h2 class="text-lg font-bold text-primary mt-4 max-w-md">${escapeHTML(this.activeBlock.title)}</h2>
          ${this.activeBlock.notes ? `<p class="text-xs text-muted mt-1 max-w-sm">${escapeHTML(this.activeBlock.notes)}</p>` : ''}
        </div>

        <!-- Bottom Controls -->
        <div class="w-full flex items-center justify-center gap-3">
          <button class="btn btn-sm btn-secondary" id="btn-focus-add-5">+5 min</button>
          
          <button class="btn btn-primary px-6" id="btn-focus-toggle-play">
            <span id="lbl-focus-play-btn">${this.isRunning ? 'Pause' : 'Resume'}</span>
          </button>

          <button class="btn btn-sm btn-secondary" id="btn-focus-finish">Complete</button>
        </div>

      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    this.container.querySelector('.btn-focus-close')?.addEventListener('click', () => this.close());
    this.container.querySelector('#btn-focus-add-5')?.addEventListener('click', () => this.addTime(5));

    this.container.querySelector('#btn-focus-toggle-play')?.addEventListener('click', () => {
      if (this.isRunning) this.pause();
      else this.resume();
    });

    this.container.querySelector('#btn-focus-finish')?.addEventListener('click', () => {
      if (confirm('Mark this focus block as completed?')) {
        this.close();
        if (this.onFinishBlock && this.activeBlock) {
          this.onFinishBlock(this.activeBlock.id);
        }
      }
    });
  }

  updateDisplay() {
    const lbl = this.container.querySelector('#lbl-focus-time-left');
    if (lbl) lbl.textContent = this.formatCountdown();

    const circle = this.container.querySelector('#focus-progress-circle');
    if (circle && this.totalSeconds > 0) {
      const circumference = 2 * Math.PI * 44; // 276.46
      const fraction = Math.max(0, this.remainingSeconds / this.totalSeconds);
      const offset = circumference * (1 - fraction);
      circle.style.strokeDashoffset = offset;
    }
  }

  updateControls() {
    const lbl = this.container.querySelector('#lbl-focus-play-btn');
    if (lbl) lbl.textContent = this.isRunning ? 'Pause' : 'Resume';
  }

  formatCountdown() {
    const m = Math.floor(this.remainingSeconds / 60);
    const s = this.remainingSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}


/* --- MODULE: js/editor/scenario-comparison.js --- */
/**
 * TimeGrid - Schedule Simulation & Scenario Comparison Component
 * Side-by-side comparison matrix for simulated daily schedules (Focus vs Meetings vs Free Time vs Conflicts).
 */





class ScenarioComparisonModal {
  constructor(container, onApplyScenario) {
    this.container = container;
    this.onApplyScenario = onApplyScenario;
  }

  open(scenarios = [], currentDateStr = '') {
    this.scenarios = scenarios;
    this.currentDateStr = currentDateStr;
    this.render();
    this.container.classList.add('active');
  }

  close() {
    this.container.classList.remove('active');
  }

  render() {
    this.container.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-dialog scenario-modal-dialog">
        <div class="modal-header flex items-center justify-between p-3 border-b">
          <div class="flex items-center gap-2">
            ${getIcon('layers', 'icon-sm text-primary')}
            <span class="font-bold text-sm">Schedule Scenario Simulation & Comparison</span>
          </div>
          <button class="btn-icon-xs btn-modal-close">&times;</button>
        </div>

        <div class="modal-body p-4 flex flex-col gap-4 overflow-y-auto" style="max-height: 70vh;">
          <p class="text-xs text-muted font-sans">
            Compare alternative arrangements for <strong>${this.currentDateStr}</strong> to balance deep focus, meeting fatigue, and buffer time.
          </p>

          <!-- Comparison Table Grid -->
          <div class="overflow-x-auto">
            <table class="data-grid-table font-sans text-xs w-full">
              <thead>
                <tr>
                  <th>Scenario Name</th>
                  <th class="text-center">Total Focus</th>
                  <th class="text-center">Meetings</th>
                  <th class="text-center">Free Buffer</th>
                  <th class="text-center">Conflicts</th>
                  <th class="text-center">Efficiency</th>
                  <th class="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                ${this.scenarios.map(sc => {
                  const dayBlocks = sc.blocks.filter(b => b.date === this.currentDateStr);
                  const m = calculateScheduleMetrics(dayBlocks);

                  return `
                    <tr>
                      <td>
                        <div class="flex flex-col">
                          <strong class="text-primary">${escapeHTML(sc.name)}</strong>
                          <span class="text-xs text-muted">${dayBlocks.length} scheduled blocks</span>
                        </div>
                      </td>
                      <td class="text-center font-mono font-bold text-primary">${formatDuration(m.focusTime)}</td>
                      <td class="text-center font-mono text-secondary">${formatDuration(m.meetingTime)}</td>
                      <td class="text-center font-mono text-emerald">${formatDuration(m.freeWorkdayTime)}</td>
                      <td class="text-center font-mono ${m.totalConflicts > 0 ? 'text-amber font-bold' : 'text-muted'}">${m.totalConflicts}</td>
                      <td class="text-center font-mono font-bold text-primary">${m.efficiency}%</td>
                      <td class="text-right">
                        <button class="btn btn-xs btn-primary btn-apply-scenario-row" data-id="${sc.id}">
                          Apply Plan
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

        </div>

        <div class="modal-footer p-3 border-t flex justify-end gap-2">
          <button class="btn btn-sm btn-secondary btn-modal-close">Close</button>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    this.container.querySelectorAll('.btn-modal-close, .modal-backdrop').forEach(b => {
      b.addEventListener('click', () => this.close());
    });

    this.container.querySelectorAll('.btn-apply-scenario-row').forEach(b => {
      b.addEventListener('click', () => {
        const scId = b.dataset.id;
        const targetSc = this.scenarios.find(s => s.id === scId);
        if (targetSc && this.onApplyScenario) {
          this.onApplyScenario(targetSc);
        }
        this.close();
      });
    });
  }
}


/* --- MODULE: js/app.js --- */
/**
 * TimeGrid - Master Application Orchestrator
 * Integrates 24h Time Grid Canvas, Task Drawer, Block Inspector, Focus Mode, Scenarios, and Persistence.
 */










class TimeGridApp {
  constructor() {
    this.blocks = [];
    this.backlogTasks = [];
    this.selectedBlockId = null;

    // View State
    this.currentDate = new Date();
    this.viewMode = GRID_VIEWS.DAY; // 'day', 'workweek', 'week'
    this.is24Hour = false;
    this.gridSnap = 15; // 15 min

    // Scenarios State
    this.scenarios = [];
    this.activeScenarioId = 'scenario_main';
  }

  async init() {
    await db.init();
    this.blocks = await db.getAllBlocks();
    this.backlogTasks = await db.getAllBacklogTasks();

    if (this.blocks.length > 0) {
      this.selectedBlockId = this.blocks[0].id;
    }

    // Initialize Sub-components
    const gridContainer = document.getElementById('time-grid-canvas-container');
    this.timeGrid = new TimeGridView(gridContainer, {
      onSelectBlock: (id) => this.selectBlock(id),
      onMoveBlock: (id, updates) => this.updateBlock(id, updates),
      onResizeBlock: (id, updates) => this.updateBlock(id, updates),
      onCreateBlockAt: (slot) => this.createNewBlockAt(slot),
      onDropTask: (taskId, date, startMinute) => this.scheduleBacklogTask(taskId, date, startMinute)
    });

    const focusContainer = document.getElementById('focus-mode-overlay-container');
    this.focusManager = new FocusModeManager(focusContainer, (blockId) => {
      this.deleteBlock(blockId);
    });

    const scenarioContainer = document.getElementById('scenario-modal-container');
    this.scenarioModal = new ScenarioComparisonModal(scenarioContainer, (appliedScenario) => {
      this.blocks = JSON.parse(JSON.stringify(appliedScenario.blocks));
      this.saveAllBlocks();
      this.renderAll();
    });

    this.setupToolbar();
    this.setupDateControls();
    this.setupShortcuts();
    this.renderAll();
  }

  renderAll() {
    this.renderGrid();
    this.renderDrawer();
    this.renderInspector();
    this.updateHeaderDateDisplay();
  }

  renderGrid() {
    this.timeGrid.render({
      blocks: this.blocks,
      selectedBlockId: this.selectedBlockId,
      viewMode: this.viewMode,
      currentDate: this.currentDate,
      is24Hour: this.is24Hour,
      gridSnap: this.gridSnap
    });
  }

  renderDrawer() {
    const container = document.getElementById('task-drawer-container');
    if (!container) return;

    renderTaskDrawer(container, {
      backlogTasks: this.backlogTasks,
      onAddTask: async (task) => {
        await db.saveBacklogTask(task);
        this.backlogTasks = await db.getAllBacklogTasks();
        this.renderDrawer();
      },
      onDeleteTask: async (id) => {
        await db.deleteBacklogTask(id);
        this.backlogTasks = await db.getAllBacklogTasks();
        this.renderDrawer();
      },
      onApplyTemplate: (tpl) => {
        if (confirm(`Apply "${tpl.name}" routine template to ${formatDateKey(this.currentDate)}?`)) {
          const dateKey = formatDateKey(this.currentDate);
          // Remove existing blocks on this date
          this.blocks = this.blocks.filter(b => b.date !== dateKey);

          for (const b of tpl.blocks) {
            this.blocks.push({
              ...b,
              id: 'b_' + Math.random().toString(36).substr(2, 7),
              date: dateKey
            });
          }
          this.saveAllBlocks();
          this.renderAll();
        }
      }
    });
  }

  renderInspector() {
    const container = document.getElementById('block-inspector-container');
    if (!container) return;

    const dateKey = formatDateKey(this.currentDate);
    const dayBlocks = this.blocks.filter(b => b.date === dateKey);
    const activeBlock = this.blocks.find(b => b.id === this.selectedBlockId);

    renderBlockInspector(container, {
      selectedBlock: activeBlock,
      dayBlocks,
      is24Hour: this.is24Hour,
      onUpdateBlock: (updated) => this.updateBlock(updated.id, updated),
      onDeleteBlock: (id) => this.deleteBlock(id),
      onDuplicateBlock: (id) => this.duplicateBlock(id),
      onSplitBlock: (id) => this.splitBlock(id),
      onStartFocus: (block) => this.focusManager.startFocus(block)
    });
  }

  // --- Toolbar & Navigation Handlers ---
  setupToolbar() {
    // View Mode Toggle (Day / Workweek / Full Week)
    document.querySelectorAll('.btn-view-mode').forEach(btn => {
      btn.addEventListener('click', () => {
        this.viewMode = btn.dataset.view;
        document.querySelectorAll('.btn-view-mode').forEach(b => b.classList.toggle('active', b === btn));
        this.renderAll();
      });
    });

    // Snap Interval
    document.getElementById('select-grid-snap')?.addEventListener('change', (e) => {
      this.gridSnap = parseInt(e.target.value, 10) || 15;
      this.renderGrid();
    });

    // 12h / 24h Toggle
    document.getElementById('btn-toggle-24h')?.addEventListener('click', () => {
      this.is24Hour = !this.is24Hour;
      document.getElementById('btn-toggle-24h').textContent = this.is24Hour ? '24h' : '12h';
      this.renderAll();
    });

    // Quick New Block (+ Block)
    document.getElementById('btn-quick-new-block')?.addEventListener('click', () => {
      this.createNewBlockAt({
        date: formatDateKey(this.currentDate),
        startMinute: 540, // 9:00 AM
        endMinute: 600 // 10:00 AM
      });
    });

    // Simulate & Compare Scenarios Modal
    document.getElementById('btn-open-scenarios')?.addEventListener('click', () => {
      const dateKey = formatDateKey(this.currentDate);
      const currentBlocks = this.blocks.filter(b => b.date === dateKey);

      const scenarios = [
        { id: 'sc_current', name: 'Current Active Schedule', blocks: this.blocks },
        {
          id: 'sc_deep_work',
          name: 'Scenario A: Deep Focus Sprint',
          blocks: [
            ...this.blocks.filter(b => b.date !== dateKey),
            { id: 'sc_1', date: dateKey, title: 'Morning Deep Work', startMinute: 540, endMinute: 720, category: 'Deep Work', priority: 'High', color: '#0284c7' },
            { id: 'sc_2', date: dateKey, title: 'Consolidated Syncs', startMinute: 840, endMinute: 960, category: 'Meetings', priority: 'Med', color: '#8b5cf6' },
            { id: 'sc_3', date: dateKey, title: 'Afternoon Flow', startMinute: 960, endMinute: 1080, category: 'Deep Work', priority: 'High', color: '#0284c7' }
          ]
        },
        {
          id: 'sc_balanced',
          name: 'Scenario B: Balanced Flow',
          blocks: [
            ...this.blocks.filter(b => b.date !== dateKey),
            { id: 'sc_b1', date: dateKey, title: 'Planning & Inbox', startMinute: 540, endMinute: 600, category: 'Admin', priority: 'Med', color: '#f59e0b' },
            { id: 'sc_b2', date: dateKey, title: 'Deep Work Sprint', startMinute: 600, endMinute: 750, category: 'Deep Work', priority: 'High', color: '#0284c7' },
            { id: 'sc_b3', date: dateKey, title: 'Collaborative Sync', startMinute: 810, endMinute: 900, category: 'Meetings', priority: 'Med', color: '#8b5cf6' }
          ]
        }
      ];

      this.scenarioModal.open(scenarios, dateKey);
    });

    // Reset Schedule
    document.getElementById('btn-reset-schedule')?.addEventListener('click', async () => {
      if (confirm('Reset TimeGrid to demonstration schedule and backlog tasks?')) {
        await db.resetToSampleData();
        this.blocks = await db.getAllBlocks();
        this.backlogTasks = await db.getAllBacklogTasks();
        this.selectedBlockId = this.blocks[0]?.id || null;
        this.renderAll();
      }
    });

    // Export iCalendar (.ICS)
    document.getElementById('btn-export-ics')?.addEventListener('click', () => this.exportICS());

    // Export Backup JSON
    document.getElementById('btn-export-json')?.addEventListener('click', () => {
      const json = JSON.stringify({ blocks: this.blocks, backlogTasks: this.backlogTasks }, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `timegrid_backup_${formatDateKey(new Date())}.json`;
      a.click();
    });

    // Import Backup JSON
    const importInput = document.getElementById('file-import-timegrid');
    document.getElementById('btn-import-json')?.addEventListener('click', () => importInput?.click());
    importInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          if (parsed && Array.isArray(parsed.blocks)) {
            for (const b of parsed.blocks) await db.saveBlock(b);
            if (Array.isArray(parsed.backlogTasks)) {
              for (const t of parsed.backlogTasks) await db.saveBacklogTask(t);
            }
            this.blocks = await db.getAllBlocks();
            this.backlogTasks = await db.getAllBacklogTasks();
            this.renderAll();
            alert(`Successfully restored schedule with ${parsed.blocks.length} blocks.`);
          } else {
            alert('Invalid TimeGrid backup JSON format.');
          }
        } catch (err) {
          alert('Failed to parse backup JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
    });
  }

  setupDateControls() {
    document.getElementById('btn-prev-date')?.addEventListener('click', () => {
      const step = this.viewMode === GRID_VIEWS.DAY ? 1 : 7;
      this.currentDate.setDate(this.currentDate.getDate() - step);
      this.renderAll();
    });

    document.getElementById('btn-next-date')?.addEventListener('click', () => {
      const step = this.viewMode === GRID_VIEWS.DAY ? 1 : 7;
      this.currentDate.setDate(this.currentDate.getDate() + step);
      this.renderAll();
    });

    document.getElementById('btn-today-date')?.addEventListener('click', () => {
      this.currentDate = new Date();
      this.renderAll();
    });
  }

  setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      // Delete active block
      if ((e.key === 'Delete' || e.key === 'Backspace') && this.selectedBlockId) {
        this.deleteBlock(this.selectedBlockId);
      }

      // 'F' key -> Start Focus Mode
      if ((e.key === 'f' || e.key === 'F') && this.selectedBlockId) {
        const b = this.blocks.find(x => x.id === this.selectedBlockId);
        if (b) this.focusManager.startFocus(b);
      }

      // 'N' key -> New Block
      if (e.key === 'n' || e.key === 'N') {
        this.createNewBlockAt({
          date: formatDateKey(this.currentDate),
          startMinute: 540,
          endMinute: 600
        });
      }
    });
  }

  updateHeaderDateDisplay() {
    const lbl = document.getElementById('lbl-current-date-display');
    if (lbl) {
      lbl.textContent = formatDateDisplay(this.currentDate);
    }
  }

  // --- CRUD Block Actions ---
  selectBlock(id) {
    this.selectedBlockId = id;
    this.renderGrid();
    this.renderInspector();
  }

  async updateBlock(id, updates) {
    const block = this.blocks.find(b => b.id === id);
    if (!block) return;

    Object.assign(block, updates);
    await db.saveBlock(block);
    this.renderAll();
  }

  async deleteBlock(id) {
    await db.deleteBlock(id);
    this.blocks = this.blocks.filter(b => b.id !== id);
    if (this.selectedBlockId === id) {
      this.selectedBlockId = this.blocks[0]?.id || null;
    }
    this.renderAll();
  }

  async duplicateBlock(id) {
    const orig = this.blocks.find(b => b.id === id);
    if (!orig) return;

    const dur = orig.endMinute - orig.startMinute;
    const clone = {
      ...orig,
      id: 'b_' + Math.random().toString(36).substr(2, 7),
      title: orig.title + ' (Copy)',
      startMinute: Math.min(1440 - dur, orig.endMinute),
      endMinute: Math.min(1440, orig.endMinute + dur)
    };

    this.blocks.push(clone);
    await db.saveBlock(clone);
    this.selectedBlockId = clone.id;
    this.renderAll();
  }

  async splitBlock(id) {
    const orig = this.blocks.find(b => b.id === id);
    if (!orig) return;

    const dur = orig.endMinute - orig.startMinute;
    if (dur < 30) return alert('Block duration is too short to split.');

    const halfDur = Math.round(dur / 2);
    const midMin = orig.startMinute + halfDur;

    orig.endMinute = midMin;
    orig.title = orig.title + ' (Part 1)';
    await db.saveBlock(orig);

    const part2 = {
      ...orig,
      id: 'b_' + Math.random().toString(36).substr(2, 7),
      title: orig.title.replace(' (Part 1)', '') + ' (Part 2)',
      startMinute: midMin,
      endMinute: orig.startMinute + dur
    };

    this.blocks.push(part2);
    await db.saveBlock(part2);
    this.renderAll();
  }

  async createNewBlockAt({ date, startMinute, endMinute }) {
    const newBlock = {
      id: 'b_' + Date.now(),
      date,
      title: 'New Focus Block',
      startMinute,
      endMinute,
      category: 'Deep Work',
      priority: 'High',
      color: '#0284c7',
      notes: ''
    };

    this.blocks.push(newBlock);
    await db.saveBlock(newBlock);
    this.selectedBlockId = newBlock.id;
    this.renderAll();
  }

  async scheduleBacklogTask(taskId, date, startMinute) {
    const task = this.backlogTasks.find(t => t.id === taskId);
    if (!task) return;

    const dur = task.estimatedMinutes || 60;
    const newBlock = {
      id: 'b_' + Date.now(),
      date,
      title: task.title,
      startMinute,
      endMinute: Math.min(1440, startMinute + dur),
      category: task.category || 'Deep Work',
      priority: task.priority || 'Med',
      color: '#0284c7',
      notes: ''
    };

    this.blocks.push(newBlock);
    await db.saveBlock(newBlock);
    await db.deleteBacklogTask(taskId);
    this.backlogTasks = await db.getAllBacklogTasks();
    this.selectedBlockId = newBlock.id;
    this.renderAll();
  }

  async saveAllBlocks() {
    for (const b of this.blocks) {
      await db.saveBlock(b);
    }
  }

  exportICS() {
    let ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//TimeGrid//Visual Time Blocking//EN\n';

    for (const b of this.blocks) {
      const dateNoDash = b.date.replace(/-/g, '');
      const sH = Math.floor(b.startMinute / 60).toString().padStart(2, '0');
      const sM = (b.startMinute % 60).toString().padStart(2, '0');
      const eH = Math.floor(b.endMinute / 60).toString().padStart(2, '0');
      const eM = (b.endMinute % 60).toString().padStart(2, '0');

      ics += 'BEGIN:VEVENT\n';
      ics += `SUMMARY:${b.title}\n`;
      ics += `DTSTART:${dateNoDash}T${sH}${sM}00\n`;
      ics += `DTEND:${dateNoDash}T${eH}${eM}00\n`;
      ics += `DESCRIPTION:${b.notes || ''}\n`;
      ics += `CATEGORIES:${b.category || 'General'}\n`;
      ics += 'END:VEVENT\n';
    }

    ics += 'END:VCALENDAR\n';

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timegrid_schedule_${formatDateKey(new Date())}.ics`;
    a.click();
  }
}

// Bootstrap
function startTimeGrid() {
  const app = new TimeGridApp();
  window.timeGridApp = app;
  app.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startTimeGrid);
} else {
  startTimeGrid();
}


})();
