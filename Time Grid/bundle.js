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
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  filter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>`,
  undo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>`,
  volume2: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`,
  volumeX: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`,
  help: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  sidebar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>`,
  target: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,
  sparkles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"></path></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
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
  if (minutes === null || minutes === undefined || isNaN(minutes)) return is24Hour ? '00:00' : '12:00 AM';
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
 * Parse time string (e.g. "08:30", "8:30 AM", "14:15", "2:30pm") to minutes from midnight (0..1440)
 */
function timeStringToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
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

  // Check 24-hour format (e.g. "14:30" or "9:15")
  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const hours = parseInt(match24[1], 10);
    const mins = parseInt(match24[2], 10);
    return Math.max(0, Math.min(1440, hours * 60 + mins));
  }

  return 0;
}

/**
 * Format duration in minutes into clean readable string (e.g. "1h 30m" or "45m")
 */
function formatDuration(durationMinutes) {
  const m = Math.max(0, Math.round(durationMinutes || 0));
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
  if (!step || step <= 1) return Math.round(minutes || 0);
  return Math.round((minutes || 0) / step) * step;
}

/**
 * Format Date object to "YYYY-MM-DD" key
 */
function formatDateKey(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return formatDateKey(new Date());
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
  if (isNaN(d.getTime())) return 'Today';
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format Date to full detailed title (e.g. "Wednesday, June 12, 2024")
 */
function formatFullDateDisplay(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Today';
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Check if two dates represent the exact same calendar day
 */
function isSameDay(date1, date2) {
  return formatDateKey(date1) === formatDateKey(date2);
}

/**
 * Get array of 7 Date objects representing Monday-Sunday for the given reference date
 */
function getWeekDates(referenceDate) {
  const curr = new Date(referenceDate);
  if (isNaN(curr.getTime())) return getWeekDates(new Date());

  const day = curr.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
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

/**
 * Find continuous free slots between blocks within workday hours (0-1440 min)
 */
function findFreeTimeSlots(blocks = [], workStartMin = 540, workEndMin = 1080) {
  const sorted = [...blocks].sort((a, b) => a.startMinute - b.startMinute);
  const freeSlots = [];
  let currentPointer = workStartMin;

  for (const b of sorted) {
    if (b.endMinute <= currentPointer) continue;
    if (b.startMinute > currentPointer) {
      const freeDur = b.startMinute - currentPointer;
      if (freeDur >= 15) {
        freeSlots.push({
          startMinute: currentPointer,
          endMinute: b.startMinute,
          duration: freeDur
        });
      }
    }
    currentPointer = Math.max(currentPointer, b.endMinute);
  }

  if (currentPointer < workEndMin) {
    const freeDur = workEndMin - currentPointer;
    if (freeDur >= 15) {
      freeSlots.push({
        startMinute: currentPointer,
        endMinute: workEndMin,
        duration: freeDur
      });
    }
  }

  return freeSlots;
}


/* --- MODULE: js/engine/conflicts.js --- */
/**
 * TimeGrid - Real-Time Conflict Detection Engine & Schedule Analytics
 * Detects overlapping time block intervals, conflicting event titles, overlap durations,
 * and calculates Maker vs Manager ratios, workday load, and auto-resolution proposals.
 */

/**
 * Detect all conflicts among a list of time blocks for the same day
 */
function detectConflicts(blocks = []) {
  const conflictMap = new Map(); // blockId -> { hasConflict, conflictingWith: [{ id, title, overlapMinutes, startMinute, endMinute }], totalOverlapMinutes }

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
        info1.conflictingWith.push({
          id: b2.id,
          title: b2.title,
          overlapMinutes: overlapDuration,
          startMinute: b2.startMinute,
          endMinute: b2.endMinute
        });
        info1.totalOverlapMinutes += overlapDuration;

        info2.hasConflict = true;
        info2.conflictingWith.push({
          id: b1.id,
          title: b1.title,
          overlapMinutes: overlapDuration,
          startMinute: b1.startMinute,
          endMinute: b1.endMinute
        });
        info2.totalOverlapMinutes += overlapDuration;
      }
    }
  }

  return conflictMap;
}

/**
 * Get clean list of unique conflicting block pairs
 */
function getConflictList(blocks = []) {
  const conflicts = [];
  const checked = new Set();

  for (let i = 0; i < blocks.length; i++) {
    const b1 = blocks[i];
    for (let j = i + 1; j < blocks.length; j++) {
      const b2 = blocks[j];
      const overlapStart = Math.max(b1.startMinute, b2.startMinute);
      const overlapEnd = Math.min(b1.endMinute, b2.endMinute);

      if (overlapStart < overlapEnd) {
        const pairKey = [b1.id, b2.id].sort().join('___');
        if (!checked.has(pairKey)) {
          checked.add(pairKey);
          conflicts.push({
            blockA: b1,
            blockB: b2,
            overlapMinutes: overlapEnd - overlapStart,
            overlapStart,
            overlapEnd
          });
        }
      }
    }
  }

  return conflicts;
}

/**
 * Auto-resolves a conflict between two blocks by shifting the later one directly after the earlier one
 */
function autoResolveConflict(blockAId, blockBId, blocks = []) {
  const bA = blocks.find(b => b.id === blockAId);
  const bB = blocks.find(b => b.id === blockBId);
  if (!bA || !bB) return blocks;

  const earlier = bA.startMinute <= bB.startMinute ? bA : bB;
  const later = earlier === bA ? bB : bA;

  const laterDuration = later.endMinute - later.startMinute;
  const newStart = earlier.endMinute;
  const newEnd = Math.min(1440, newStart + laterDuration);

  return blocks.map(b => {
    if (b.id === later.id) {
      return { ...b, startMinute: newStart, endMinute: newEnd };
    }
    return b;
  });
}

/**
 * Calculate summary schedule metrics (Total Focus Time, Meeting Time, Free Time, Conflict Count, Maker Ratio)
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

  // Workday length (9 AM - 6 PM = 540 minutes)
  const workdayLength = Math.max(0, workEndMin - workStartMin);
  const totalWorkScheduled = focusTime + meetingTime + adminTime;
  const freeWorkdayTime = Math.max(0, workdayLength - totalWorkScheduled);
  
  // Maker vs Manager Ratio (% of Deep Work vs Total Work Scheduled)
  const makerRatio = totalWorkScheduled > 0 ? Math.round((focusTime / totalWorkScheduled) * 100) : 0;
  
  // Schedule Efficiency / Quality Rating
  const efficiency = workdayLength > 0 ? Math.min(100, Math.max(0, Math.round(((focusTime) / (focusTime + meetingTime * 0.8 + 1)) * 100))) : 0;
  
  // Workday Capacity Utilization (% of 9-hour workday planned)
  const utilization = workdayLength > 0 ? Math.min(100, Math.round((totalWorkScheduled / workdayLength) * 100)) : 0;

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
    makerRatio,
    utilization,
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
  'Deep Work': { name: 'Deep Work', color: '#0284c7', bg: 'rgba(2, 132, 199, 0.2)', border: '#0284c7', icon: 'zap' },
  'Meetings': { name: 'Meetings', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.2)', border: '#8b5cf6', icon: 'briefcase' },
  'Health': { name: 'Health', color: '#10b981', bg: 'rgba(16, 185, 129, 0.2)', border: '#10b981', icon: 'coffee' },
  'Admin': { name: 'Admin', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.2)', border: '#f59e0b', icon: 'clock' },
  'Personal': { name: 'Personal', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.2)', border: '#ec4899', icon: 'sparkles' }
};

const COLOR_SWATCHES = [
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

const SCHEDULE_TEMPLATES = [
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
    { id: 'b_mon_1', date: monKey, title: 'Morning Workout & Stretch', startMinute: 420, endMinute: 480, category: 'Health', priority: 'Med', color: '#10b981', notes: 'Gym resistance training & mobility' },
    { id: 'b_mon_2', date: monKey, title: 'Weekly Engineering Kickoff', startMinute: 540, endMinute: 600, category: 'Meetings', priority: 'High', color: '#8b5cf6', notes: 'Sprint roadmap review with product lead' },
    { id: 'b_mon_3', date: monKey, title: 'Deep Work: Database Query Engine', startMinute: 600, endMinute: 750, category: 'Deep Work', priority: 'High', color: '#0284c7', notes: 'Implement subquery AST optimizer' },
    { id: 'b_mon_4', date: monKey, title: 'Lunch & Fresh Air', startMinute: 750, endMinute: 810, category: 'Personal', priority: 'Low', color: '#ec4899', notes: 'Screen-free walk' },
    { id: 'b_mon_5', date: monKey, title: 'Feature Development: Time Grid UI', startMinute: 810, endMinute: 990, category: 'Deep Work', priority: 'High', color: '#0284c7', notes: 'Interactive canvas dragging and resizing handles' },
    { id: 'b_mon_6', date: monKey, title: 'Code Reviews & Inbox Zero', startMinute: 990, endMinute: 1050, category: 'Admin', priority: 'Med', color: '#f59e0b', notes: 'PR feedback and triage' },

    // Tuesday
    { id: 'b_tue_1', date: tueKey, title: 'Morning Jog & Hydration', startMinute: 450, endMinute: 510, category: 'Health', priority: 'Med', color: '#10b981', notes: 'Outdoor 5k run' },
    { id: 'b_tue_2', date: tueKey, title: 'Deep Work: Collision Detection Engine', startMinute: 540, endMinute: 720, category: 'Deep Work', priority: 'High', color: '#0284c7', notes: 'Interval tree spatial partitioning' },
    { id: 'b_tue_3', date: tueKey, title: 'Lunch Break', startMinute: 720, endMinute: 780, category: 'Personal', priority: 'Low', color: '#ec4899', notes: 'Healthy grain bowl' },
    { id: 'b_tue_4', date: tueKey, title: 'Product Architecture Sync', startMinute: 810, endMinute: 870, category: 'Meetings', priority: 'High', color: '#8b5cf6', notes: 'API versioning strategy' },
    { id: 'b_tue_5', date: tueKey, title: 'Deep Work: IndexedDB Persistence', startMinute: 900, endMinute: 1020, category: 'Deep Work', priority: 'Med', color: '#0284c7', notes: 'Atomic write transactions' },

    // Wednesday
    { id: 'b_wed_1', date: wedKey, title: 'Core Architecture Deep Dive', startMinute: 540, endMinute: 720, category: 'Deep Work', priority: 'High', color: '#0284c7', notes: 'Memory leak diagnostic profiling' },
    { id: 'b_wed_2', date: wedKey, title: 'Lunch & Tech Reading', startMinute: 720, endMinute: 780, category: 'Personal', priority: 'Low', color: '#ec4899', notes: 'Database indexing internals' },
    { id: 'b_wed_3', date: wedKey, title: '1-on-1 Engineering Catchup', startMinute: 840, endMinute: 900, category: 'Meetings', priority: 'Med', color: '#8b5cf6', notes: 'Career trajectory & sprint blockers' },
    { id: 'b_wed_4', date: wedKey, title: 'System Performance Profiling', startMinute: 930, endMinute: 1050, category: 'Deep Work', priority: 'High', color: '#0284c7', notes: '60fps animation budget audit' },

    // Thursday
    { id: 'b_thu_1', date: thuKey, title: 'Morning Workout', startMinute: 420, endMinute: 480, category: 'Health', priority: 'Med', color: '#10b981', notes: 'Strength session' },
    { id: 'b_thu_2', date: thuKey, title: 'Sprint Review & QA Audit', startMinute: 540, endMinute: 630, category: 'Meetings', priority: 'High', color: '#8b5cf6', notes: 'Release candidate regression tests' },
    { id: 'b_thu_3', date: thuKey, title: 'Deep Work: Focus Timer Engine', startMinute: 660, endMinute: 810, category: 'Deep Work', priority: 'High', color: '#0284c7', notes: 'Web Audio synthesizer notifications' },
    { id: 'b_thu_4', date: thuKey, title: 'Design System Polish', startMinute: 870, endMinute: 990, category: 'Deep Work', priority: 'Med', color: '#0284c7', notes: 'WCAG 2.1 AA contrast refinement' },

    // Friday
    { id: 'b_fri_1', date: friKey, title: 'Team Demo & Retrospective', startMinute: 570, endMinute: 660, category: 'Meetings', priority: 'High', color: '#8b5cf6', notes: 'Sprint wins and continuous improvements' },
    { id: 'b_fri_2', date: friKey, title: 'Deep Work: Production Release Build', startMinute: 690, endMinute: 840, category: 'Deep Work', priority: 'High', color: '#0284c7', notes: 'CI/CD pipeline and artifact bundling' },
    { id: 'b_fri_3', date: friKey, title: 'Weekly Wrap-up & Next Week Plan', startMinute: 930, endMinute: 1020, category: 'Admin', priority: 'Med', color: '#f59e0b', notes: 'Clean inbox and prep Monday milestones' },

    // Saturday
    { id: 'b_sat_1', date: satKey, title: 'Weekend Trail Run & Outdoor Hike', startMinute: 480, endMinute: 600, category: 'Health', priority: 'Med', color: '#10b981', notes: '10km trail run at Forest Ridge' },
    { id: 'b_sat_2', date: satKey, title: 'Creative Studio Passion Project', startMinute: 660, endMinute: 840, category: 'Personal', priority: 'High', color: '#ec4899', notes: 'Synthesizer sound design session' },

    // Sunday
    { id: 'b_sun_1', date: sunKey, title: 'Morning Coffee & Weekly Journaling', startMinute: 540, endMinute: 630, category: 'Personal', priority: 'Low', color: '#ec4899', notes: 'Goal retrospective' },
    { id: 'b_sun_2', date: sunKey, title: 'Meal Prep & Kitchen Cooking', startMinute: 720, endMinute: 840, category: 'Health', priority: 'Low', color: '#10b981', notes: 'Batch prep weekday lunches' }
  ];

  const backlogTasks = [
    { id: 'task_1', title: 'Refactor Drag & Drop coordinate math', estimatedMinutes: 60, category: 'Deep Work', priority: 'High' },
    { id: 'task_2', title: 'Prepare Q3 Engineering Strategy OKR deck', estimatedMinutes: 90, category: 'Admin', priority: 'Med' },
    { id: 'task_3', title: 'Benchmark Web Worker IndexedDB batching', estimatedMinutes: 45, category: 'Deep Work', priority: 'Low' },
    { id: 'task_4', title: 'Annual medical wellness checkup', estimatedMinutes: 30, category: 'Personal', priority: 'Med' },
    { id: 'task_5', title: 'Review open pull requests and merge PR #142', estimatedMinutes: 45, category: 'Admin', priority: 'Med' },
    { id: 'task_6', title: 'Write unit tests for time interval snapping', estimatedMinutes: 45, category: 'Deep Work', priority: 'High' },
    { id: 'task_7', title: 'Update OpenAPI schema documentation', estimatedMinutes: 30, category: 'Admin', priority: 'Low' },
    { id: 'task_8', title: 'Organize team offsite venue shortlist', estimatedMinutes: 60, category: 'Personal', priority: 'Low' }
  ];

  return { blocks, backlogTasks };
}


/* --- MODULE: js/engine/charts.js --- */
/**
 * TimeGrid - Schedule Analytics & Canvas 2D Charting Engine
 * High-DPI category distribution donut chart and time allocation visualizations.
 */




function renderCategoryDonut(canvas, blocks = []) {
  if (!canvas) return;

  const dpr = window.devicePixelRatio || 1;
  const logicalWidth = 220;
  const logicalHeight = 150;

  // Scale canvas for HiDPI sharpness
  canvas.width = logicalWidth * dpr;
  canvas.height = logicalHeight * dpr;
  canvas.style.width = `${logicalWidth}px`;
  canvas.style.height = `${logicalHeight}px`;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, logicalWidth, logicalHeight);

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
    ctx.fillStyle = '#64748b';
    ctx.font = '11px -apple-system, BlinkMacSystemFont, "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No scheduled blocks on this date', logicalWidth / 2, logicalHeight / 2);
    return;
  }

  const centerX = logicalWidth / 2;
  const centerY = logicalHeight / 2 - 8;
  const outerRadius = Math.min(centerX, centerY) - 12;
  const innerRadius = outerRadius * 0.65;

  let startAngle = -Math.PI / 2;

  // Draw slices
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

    // Subtle slice boundary line
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.stroke();

    startAngle = endAngle;
  }

  // Center Text: Total Duration
  ctx.fillStyle = '#f8fafc';
  ctx.font = '700 15px "JetBrains Mono", Consolas, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(formatDuration(totalMin), centerX, centerY - 2);

  // Center Subtitle
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 10px -apple-system, BlinkMacSystemFont, "Inter", sans-serif';
  ctx.fillText('Scheduled', centerX, centerY + 14);
}


/* --- MODULE: js/core/db.js --- */
/**
 * TimeGrid - IndexedDB Storage Engine & Snapshot History
 * Persists time blocks, unscheduled task backlog, scenarios, and provides multi-level undo snapshots.
 */



const DB_NAME = 'TimeGrid_DB';
const DB_VERSION = 1;
const MAX_UNDO_STACK = 30;

class TimeGridDB {
  constructor() {
    this.db = null;
    this.undoStack = [];
  }

  async init() {
    return new Promise((resolve) => {
      try {
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
          this.initLocalStorageFallback();
          resolve(null);
        };
      } catch (err) {
        console.warn('IndexedDB open error, using localStorage fallback', err);
        this.initLocalStorageFallback();
        resolve(null);
      }
    });
  }

  initLocalStorageFallback() {
    try {
      const stored = localStorage.getItem('timegrid_blocks');
      if (!stored) {
        const { blocks, backlogTasks } = getSampleScheduleData();
        localStorage.setItem('timegrid_blocks', JSON.stringify(blocks));
        localStorage.setItem('timegrid_backlog', JSON.stringify(backlogTasks));
      }
    } catch (e) {
      console.error('LocalStorage error', e);
    }
  }

  pushUndoSnapshot(blocks, backlogTasks) {
    if (!Array.isArray(blocks) || !Array.isArray(backlogTasks)) return;
    this.undoStack.push({
      blocks: JSON.parse(JSON.stringify(blocks)),
      backlogTasks: JSON.parse(JSON.stringify(backlogTasks))
    });
    if (this.undoStack.length > MAX_UNDO_STACK) {
      this.undoStack.shift();
    }
  }

  hasUndoSnapshot() {
    return this.undoStack.length > 0;
  }

  popUndoSnapshot() {
    return this.undoStack.pop() || null;
  }

  async getAllBlocks() {
    if (!this.db) {
      try {
        const str = localStorage.getItem('timegrid_blocks');
        return str ? JSON.parse(str) : [];
      } catch (e) {
        console.warn('Corrupted localStorage timegrid_blocks, resetting', e);
        return [];
      }
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('blocks', 'readonly');
        const store = tx.objectStore('blocks');
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      } catch (e) {
        resolve([]);
      }
    });
  }

  async saveBlock(block) {
    if (!this.db) {
      const all = await this.getAllBlocks();
      const idx = all.findIndex(b => b.id === block.id);
      if (idx >= 0) all[idx] = block;
      else all.push(block);
      localStorage.setItem('timegrid_blocks', JSON.stringify(all));
      return block;
    }
    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction('blocks', 'readwrite');
        const store = tx.objectStore('blocks');
        store.put(block);
        tx.oncomplete = () => resolve(block);
        tx.onerror = () => reject(tx.error);
      } catch (e) {
        reject(e);
      }
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
      try {
        const tx = this.db.transaction('blocks', 'readwrite');
        const store = tx.objectStore('blocks');
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (e) {
        resolve();
      }
    });
  }

  async replaceAllBlocks(blocks) {
    if (!this.db) {
      localStorage.setItem('timegrid_blocks', JSON.stringify(blocks));
      return;
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('blocks', 'readwrite');
        const store = tx.objectStore('blocks');
        store.clear();
        for (const b of blocks) store.put(b);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (e) {
        resolve();
      }
    });
  }

  async getAllBacklogTasks() {
    if (!this.db) {
      try {
        const str = localStorage.getItem('timegrid_backlog');
        return str ? JSON.parse(str) : [];
      } catch (e) {
        console.warn('Corrupted localStorage timegrid_backlog, resetting', e);
        return [];
      }
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('backlog', 'readonly');
        const store = tx.objectStore('backlog');
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      } catch (e) {
        resolve([]);
      }
    });
  }

  async saveBacklogTask(task) {
    if (!this.db) {
      const all = await this.getAllBacklogTasks();
      const idx = all.findIndex(t => t.id === task.id);
      if (idx >= 0) all[idx] = task;
      else all.push(task);
      localStorage.setItem('timegrid_backlog', JSON.stringify(all));
      return task;
    }
    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction('backlog', 'readwrite');
        const store = tx.objectStore('backlog');
        store.put(task);
        tx.oncomplete = () => resolve(task);
        tx.onerror = () => reject(tx.error);
      } catch (e) {
        reject(e);
      }
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
      try {
        const tx = this.db.transaction('backlog', 'readwrite');
        const store = tx.objectStore('backlog');
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (e) {
        resolve();
      }
    });
  }

  async replaceAllBacklogTasks(tasks) {
    if (!this.db) {
      localStorage.setItem('timegrid_backlog', JSON.stringify(tasks));
      return;
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('backlog', 'readwrite');
        const store = tx.objectStore('backlog');
        store.clear();
        for (const t of tasks) store.put(t);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (e) {
        resolve();
      }
    });
  }

  async resetToSampleData() {
    const { blocks: sampleBlocks, backlogTasks } = getSampleScheduleData();
    if (!this.db) {
      localStorage.setItem('timegrid_blocks', JSON.stringify(sampleBlocks));
      localStorage.setItem('timegrid_backlog', JSON.stringify(backlogTasks));
      return;
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction(['blocks', 'backlog'], 'readwrite');
        tx.objectStore('blocks').clear();
        tx.objectStore('backlog').clear();
        for (const b of sampleBlocks) tx.objectStore('blocks').put(b);
        for (const t of backlogTasks) tx.objectStore('backlog').put(t);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (e) {
        resolve();
      }
    });
  }
}

const db = new TimeGridDB();


/* --- MODULE: js/editor/time-grid.js --- */
/**
 * TimeGrid - Interactive Visual Time Grid Component
 * Renders 24h vertical grid, Day/Workweek/Full Week columns, live current-time indicator,
 * live drag ghost / time snap tooltips, touch support, and duration-resizing handlers.
 */






const GRID_VIEWS = {
  DAY: 'day',
  WORKWEEK: 'workweek',
  WEEK: 'week'
};

const HOUR_HEIGHT = 56; // 56px per hour
const TOTAL_HEIGHT = HOUR_HEIGHT * 24; // 1344px for full 24h
const WORK_START_MIN = 540; // 9:00 AM
const WORK_END_MIN = 1080;  // 6:00 PM

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
    this.hasScrolled = false;

    // Start live clock ticker
    this.startLiveClock();
  }

  startLiveClock() {
    setInterval(() => {
      const line = this.container.querySelector('.current-time-line');
      if (line) {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const topPx = (currentMinutes / 60) * HOUR_HEIGHT;
        line.style.top = `${topPx}px`;
        const tooltip = line.querySelector('.current-time-tooltip');
        if (tooltip) tooltip.textContent = minutesToTimeString(currentMinutes, this.is24Hour);
      }
    }, 30000);
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
    const workStartTop = (WORK_START_MIN / 60) * HOUR_HEIGHT;
    const workHeight = ((WORK_END_MIN - WORK_START_MIN) / 60) * HOUR_HEIGHT;

    this.container.innerHTML = `
      <div class="time-grid-wrapper flex flex-col h-full overflow-hidden">
        
        <!-- Header: Day / Column Titles -->
        <div class="grid-columns-header flex border-b bg-panel shrink-0 select-none">
          <!-- Time Gutter Spacer -->
          <div class="time-gutter-header w-16 border-r text-center py-2 text-xs font-bold text-muted uppercase">
            Time
          </div>
          <!-- Day Column Headers -->
          <div class="grid-header-days flex-1 grid ${days.length === 1 ? 'grid-cols-1' : (days.length === 5 ? 'grid-cols-5' : 'grid-cols-7')}">
            ${days.map(d => {
              const isToday = formatDateKey(d) === formatDateKey(new Date());
              return `
                <div class="day-header-cell p-2 text-center border-r transition-colors ${isToday ? 'bg-primary-subtle' : ''}">
                  <span class="text-xs font-semibold text-muted block uppercase" style="font-size: 10px;">${d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  <span class="font-bold text-sm font-mono ${isToday ? 'text-primary' : 'text-secondary'}">${d.getDate()}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Scrollable 24-Hour Grid Canvas Body -->
        <div class="grid-canvas-scroll flex-1 overflow-y-auto relative" id="time-grid-scroll-area">
          <div class="grid-canvas-inner flex relative" style="height: ${TOTAL_HEIGHT}px;">
            
            <!-- Left Time Gutter (00:00 to 23:00) -->
            <div class="time-gutter-column w-16 border-r flex flex-col shrink-0 select-none bg-panel">
              ${Array.from({ length: 24 }).map((_, h) => `
                <div class="time-hour-label flex items-start justify-center text-xs font-mono text-muted" style="height: ${HOUR_HEIGHT}px; margin-top: -7px;">
                  <span>${minutesToTimeString(h * 60, this.is24Hour)}</span>
                </div>
              `).join('')}
            </div>

            <!-- Day Columns Grid -->
            <div class="grid-days-container flex-1 grid ${days.length === 1 ? 'grid-cols-1' : (days.length === 5 ? 'grid-cols-5' : 'grid-cols-7')} relative">
              
              <!-- Workday Core Hours Highlight Background -->
              <div class="workday-highlight-bg absolute pointer-events-none w-full"
                   style="top: ${workStartTop}px; height: ${workHeight}px; background-color: rgba(56, 189, 248, 0.02); border-top: 1px dashed rgba(56, 189, 248, 0.2); border-bottom: 1px dashed rgba(56, 189, 248, 0.2);">
              </div>

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

              <!-- Interactive Day Columns -->
              ${days.map(d => {
                const dateKey = formatDateKey(d);
                const dayBlocks = blocks.filter(b => b.date === dateKey);
                const conflictMap = detectConflicts(dayBlocks);

                return `
                  <div class="day-time-column relative border-r" data-date="${dateKey}" style="height: ${TOTAL_HEIGHT}px;">
                    ${dayBlocks.length === 0 ? `
                      <div class="empty-day-cue absolute inset-x-2 p-3 text-center pointer-events-none text-muted" style="top: ${workStartTop + 20}px;">
                        <span class="text-xs opacity-60 font-sans block">&plus; Double-click or drop task</span>
                      </div>
                    ` : ''}
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
        <span class="current-time-tooltip font-mono text-xs bg-rose text-white px-1 rounded absolute right-1 -top-3" style="font-size: 9px;">
          ${minutesToTimeString(currentMinutes, this.is24Hour)}
        </span>
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
    const priorityColor = block.priority === 'High' ? 'var(--accent-rose)' : (block.priority === 'Med' ? 'var(--accent-amber)' : 'var(--text-muted)');

    return `
      <div class="time-block-card absolute rounded select-none cursor-move ${isSelected ? 'selected' : ''} ${hasConflict ? 'has-conflict' : ''}"
           role="button"
           tabindex="0"
           aria-label="${escapeHTML(block.title)}, ${minutesToTimeString(startMin, this.is24Hour)} to ${minutesToTimeString(endMin, this.is24Hour)}, ${block.category}"
           data-id="${block.id}"
           data-date="${block.date}"
           style="top: ${topPx}px; height: ${heightPx}px; background-color: ${block.color || catDef.color}; border-left: 4px solid ${block.color || catDef.color};">
        
        <!-- Top Resize Handle -->
        <div class="block-resize-handle top-handle absolute top-0 inset-x-0 h-2 cursor-ns-resize" data-handle="top" title="Drag to resize start time"></div>

        <!-- Block Content -->
        <div class="block-content-inner p-1.5 flex flex-col h-full overflow-hidden justify-between pointer-events-none">
          <div class="flex items-center justify-between gap-1">
            <div class="flex items-center gap-1 min-w-0">
              <span class="block-title font-bold text-xs text-white truncate">${escapeHTML(block.title)}</span>
            </div>
            <div class="flex items-center gap-1 shrink-0">
              ${block.recurrence && block.recurrence !== 'none' ? `
                <span class="text-white-muted" title="Recurring: ${block.recurrence}">
                  ${getIcon('repeat', 'icon-xs')}
                </span>
              ` : ''}
              ${hasConflict ? `
                <span class="badge badge-conflict flex items-center gap-0.5 text-xs text-amber font-bold" title="Conflict: ${conflictInfo.totalOverlapMinutes}m overlap with ${conflictInfo.conflictingWith.map(c => c.title).join(', ')}">
                  ${getIcon('alert', 'icon-xs')}
                </span>
              ` : ''}
            </div>
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
        <div class="block-resize-handle bottom-handle absolute bottom-0 inset-x-0 h-2 cursor-ns-resize" data-handle="bottom" title="Drag to resize end time"></div>
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

    // Click & Touch on Block -> Select / Drag
    this.container.querySelectorAll('.time-block-card').forEach(el => {
      const blockId = el.dataset.id;

      // Mouse Drag / Resize
      el.addEventListener('mousedown', (e) => {
        const handle = e.target.dataset.handle;
        if (handle) {
          this.startResizing(e, blockId, handle);
        } else {
          this.startDragging(e, blockId);
        }

        if (this.onSelectBlock) {
          this.onSelectBlock(blockId);
        }
        e.stopPropagation();
      });

      // Touch Drag / Resize
      el.addEventListener('touchstart', (e) => {
        const handle = e.target.dataset.handle;
        if (handle) {
          this.startTouchResizing(e, blockId, handle);
        } else {
          this.startTouchDragging(e, blockId);
        }

        if (this.onSelectBlock) {
          this.onSelectBlock(blockId);
        }
        e.stopPropagation();
      }, { passive: false });

      // Keyboard focus
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (this.onSelectBlock) this.onSelectBlock(blockId);
          e.preventDefault();
        }
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
            startMinute: Math.max(0, Math.min(1380, snappedMin)),
            endMinute: Math.min(1440, Math.max(0, snappedMin) + 60)
          });
        }
      });
    });

    // Drag-and-Drop Task from Left Backlog
    this.container.querySelectorAll('.day-time-column').forEach(col => {
      col.addEventListener('dragover', (e) => {
        e.preventDefault();
        col.classList.add('drag-over-active');
      });
      col.addEventListener('dragleave', () => {
        col.classList.remove('drag-over-active');
      });
      col.addEventListener('drop', (e) => {
        e.preventDefault();
        col.classList.remove('drag-over-active');
        const taskId = e.dataTransfer.getData('text/plain');
        if (taskId && this.onDropTask) {
          const rect = col.getBoundingClientRect();
          const y = e.clientY - rect.top;
          const clickedMin = (y / HOUR_HEIGHT) * 60;
          const snappedMin = Math.round(clickedMin / this.gridSnap) * this.gridSnap;
          this.onDropTask(taskId, col.dataset.date, Math.max(0, Math.min(1380, snappedMin)));
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
    const durationMin = Math.round((initialHeight / HOUR_HEIGHT) * 60);

    blockEl.classList.add('is-dragging');

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
      blockEl.classList.remove('is-dragging');

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
          endMinute: Math.min(1440, finalStartMin + durationMin)
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  startTouchDragging(e, blockId) {
    const touch = e.touches[0];
    const blockEl = this.container.querySelector(`.time-block-card[data-id="${blockId}"]`);
    if (!blockEl || !touch) return;

    const initialY = touch.clientY;
    const initialTop = parseFloat(blockEl.style.top) || 0;
    const initialHeight = parseFloat(blockEl.style.height) || 0;
    const durationMin = Math.round((initialHeight / HOUR_HEIGHT) * 60);

    const onTouchMove = (moveEv) => {
      const curTouch = moveEv.touches[0];
      if (!curTouch) return;
      const deltaY = curTouch.clientY - initialY;
      const newTop = initialTop + deltaY;
      const rawMin = (newTop / HOUR_HEIGHT) * 60;
      const snappedStart = Math.max(0, Math.min(1440 - durationMin, Math.round(rawMin / this.gridSnap) * this.gridSnap));
      blockEl.style.top = `${(snappedStart / 60) * HOUR_HEIGHT}px`;
    };

    const onTouchEnd = (endEv) => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      const finalTop = parseFloat(blockEl.style.top) || 0;
      const finalStartMin = Math.round((finalTop / HOUR_HEIGHT) * 60);

      if (this.onMoveBlock) {
        this.onMoveBlock(blockId, {
          date: blockEl.dataset.date,
          startMinute: finalStartMin,
          endMinute: Math.min(1440, finalStartMin + durationMin)
        });
      }
    };

    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
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

  startTouchResizing(e, blockId, handle) {
    const touch = e.touches[0];
    const blockEl = this.container.querySelector(`.time-block-card[data-id="${blockId}"]`);
    if (!blockEl || !touch) return;

    const initialY = touch.clientY;
    const initialTop = parseFloat(blockEl.style.top) || 0;
    const initialHeight = parseFloat(blockEl.style.height) || 0;
    const initialStartMin = Math.round((initialTop / HOUR_HEIGHT) * 60);
    const initialEndMin = initialStartMin + Math.round((initialHeight / HOUR_HEIGHT) * 60);

    const onTouchMove = (moveEv) => {
      const curTouch = moveEv.touches[0];
      if (!curTouch) return;
      const deltaY = curTouch.clientY - initialY;

      if (handle === 'top') {
        const newTop = initialTop + deltaY;
        const rawMin = (newTop / HOUR_HEIGHT) * 60;
        const snappedStart = Math.max(0, Math.min(initialEndMin - 15, Math.round(rawMin / this.gridSnap) * this.gridSnap));
        const newHeight = ((initialEndMin - snappedStart) / 60) * HOUR_HEIGHT;
        blockEl.style.top = `${(snappedStart / 60) * HOUR_HEIGHT}px`;
        blockEl.style.height = `${newHeight}px`;
      } else {
        const newHeight = initialHeight + deltaY;
        const rawEndMin = initialStartMin + (newHeight / HOUR_HEIGHT) * 60;
        const snappedEnd = Math.min(1440, Math.max(initialStartMin + 15, Math.round(rawEndMin / this.gridSnap) * this.gridSnap));
        blockEl.style.height = `${((snappedEnd - initialStartMin) / 60) * HOUR_HEIGHT}px`;
      }
    };

    const onTouchEnd = () => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

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

    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
  }
}


/* --- MODULE: js/editor/task-drawer.js --- */
/**
 * TimeGrid - Task Backlog & Routine Templates Drawer (Left Panel)
 * Unscheduled task inbox, real-time search & category filter, drag-to-schedule cards,
 * and 1-click routine architecture templates.
 */





let taskSearchQuery = '';
let taskCategoryFilter = 'ALL';

function renderTaskDrawer(container, {
  backlogTasks = [],
  onAddTask = null,
  onDeleteTask = null,
  onApplyTemplate = null,
  onCloseDrawer = null
}) {
  // Filter tasks based on search & category
  const filteredTasks = backlogTasks.filter(t => {
    const matchesSearch = !taskSearchQuery || t.title.toLowerCase().includes(taskSearchQuery.toLowerCase());
    const matchesCat = taskCategoryFilter === 'ALL' || t.category === taskCategoryFilter;
    return matchesSearch && matchesCat;
  });

  container.innerHTML = `
    <!-- Top Header -->
    <div class="panel-section-header flex items-center justify-between p-3 border-b bg-panel select-none">
      <div class="flex items-center gap-2">
        ${getIcon('zap', 'icon-sm text-primary')}
        <span class="text-xs font-bold uppercase text-muted">Task Inbox</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="badge badge-secondary font-mono">${filteredTasks.length} / ${backlogTasks.length}</span>
        ${onCloseDrawer ? `
          <button class="btn-icon-xs text-muted btn-close-drawer-trigger md:hidden" title="Close Drawer">
            ${getIcon('close', 'icon-xs')}
          </button>
        ` : ''}
      </div>
    </div>

    <!-- Search & Filter Controls -->
    <div class="p-2 border-b bg-panel flex flex-col gap-1.5">
      <div class="relative flex items-center">
        <span class="absolute left-2 text-muted pointer-events-none">${getIcon('search', 'icon-xs')}</span>
        <input type="text" id="inp-search-backlog" class="form-control form-control-sm w-full pl-8 font-sans" placeholder="Search backlog..." value="${escapeHTML(taskSearchQuery)}" />
        ${taskSearchQuery ? `
          <button id="btn-clear-search" class="btn-icon-xs absolute right-1 text-muted" title="Clear Search">&times;</button>
        ` : ''}
      </div>
      <div class="flex items-center gap-1 overflow-x-auto py-0.5">
        <button class="badge cursor-pointer ${taskCategoryFilter === 'ALL' ? 'badge-primary' : 'badge-secondary'} btn-cat-filter" data-cat="ALL">All</button>
        ${Object.keys(CATEGORIES).map(c => `
          <button class="badge cursor-pointer ${taskCategoryFilter === c ? 'badge-primary' : 'badge-secondary'} btn-cat-filter" data-cat="${c}">${c}</button>
        `).join('')}
      </div>
    </div>

    <!-- Quick Task Adder Input -->
    <div class="p-3 border-b bg-elevated flex flex-col gap-2">
      <div class="flex items-center gap-1.5">
        <input type="text" id="inp-new-task-title" class="form-control form-control-sm flex-1 font-sans" placeholder="Add task title & hit Enter..." />
        <button class="btn btn-xs btn-primary" id="btn-add-backlog-task" title="Add Unscheduled Task">
          ${getIcon('plus', 'icon-xs')} Add
        </button>
      </div>
      <div class="flex items-center gap-2">
        <select id="select-task-category" class="form-control form-control-sm flex-1">
          ${Object.keys(CATEGORIES).map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
        <select id="select-task-duration" class="form-control form-control-sm w-20 font-mono">
          <option value="15">15 min</option>
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
      <div class="flex items-center justify-between px-1">
        <span class="text-xs text-muted font-semibold uppercase" style="font-size: 10px;">Drag to Schedule</span>
        <span class="text-xs text-muted" style="font-size: 10px;">${filteredTasks.length} tasks</span>
      </div>

      ${filteredTasks.length === 0 ? `
        <div class="text-xs text-muted text-center p-6 bg-panel rounded border border-dashed border-subtle">
          ${taskSearchQuery || taskCategoryFilter !== 'ALL' ? 'No tasks match current filter.' : 'Inbox is clear. Add tasks above or apply a routine template below.'}
        </div>
      ` : filteredTasks.map(task => {
        const catDef = CATEGORIES[task.category] || { color: '#0284c7' };
        return `
          <div class="backlog-task-card card p-2 flex items-center justify-between cursor-grab active:cursor-grabbing hover-elevated transition-all"
               draggable="true"
               tabindex="0"
               data-id="${task.id}"
               style="border-left: 3px solid ${catDef.color};">
            <div class="flex flex-col truncate flex-1 min-w-0 pr-2">
              <span class="font-bold text-xs text-primary truncate">${escapeHTML(task.title)}</span>
              <span class="font-mono text-muted text-xs flex items-center gap-1" style="font-size: 10px;">
                <span class="w-1.5 h-1.5 rounded-full inline-block" style="background-color: ${catDef.color};"></span>
                <span>${escapeHTML(task.category)}</span> &bull; <span>${formatDuration(task.estimatedMinutes || 60)}</span>
              </span>
            </div>
            <button class="btn-icon-xs text-rose btn-delete-backlog-task shrink-0" data-id="${task.id}" title="Remove Task">
              ${getIcon('trash', 'icon-xs')}
            </button>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Bottom: Schedule Templates Section -->
    <div class="border-t p-3 bg-panel flex flex-col gap-2 shrink-0">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold uppercase text-muted flex items-center gap-1" style="font-size: 10px;">
          ${getIcon('layers', 'icon-xs')} Routine Architectures
        </span>
        <span class="badge badge-secondary font-mono">${SCHEDULE_TEMPLATES.length}</span>
      </div>
      <div class="flex flex-col gap-1.5 max-h-36 overflow-y-auto">
        ${SCHEDULE_TEMPLATES.map(tpl => {
          const totalMin = tpl.blocks.reduce((acc, b) => acc + (b.endMinute - b.startMinute), 0);
          return `
            <button class="btn btn-xs btn-secondary justify-between text-left btn-apply-template p-1.5" data-id="${tpl.id}" title="${escapeHTML(tpl.description)}">
              <div class="flex flex-col truncate flex-1 min-w-0 pr-1">
                <span class="truncate font-semibold">${escapeHTML(tpl.name)}</span>
                <span class="text-muted font-mono" style="font-size: 9.5px;">${tpl.blocks.length} blocks &bull; ${formatDuration(totalMin)}</span>
              </div>
              ${getIcon('plus', 'icon-xs text-primary')}
            </button>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // Search input handler
  const searchInput = container.querySelector('#inp-search-backlog');
  searchInput?.addEventListener('input', (e) => {
    taskSearchQuery = e.target.value;
    renderTaskDrawer(container, { backlogTasks, onAddTask, onDeleteTask, onApplyTemplate, onCloseDrawer });
  });

  // Clear search
  container.querySelector('#btn-clear-search')?.addEventListener('click', () => {
    taskSearchQuery = '';
    renderTaskDrawer(container, { backlogTasks, onAddTask, onDeleteTask, onApplyTemplate, onCloseDrawer });
  });

  // Category filter buttons
  container.querySelectorAll('.btn-cat-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      taskCategoryFilter = btn.dataset.cat;
      renderTaskDrawer(container, { backlogTasks, onAddTask, onDeleteTask, onApplyTemplate, onCloseDrawer });
    });
  });

  // Attach Task Add
  const submitNewTask = () => {
    const titleInput = container.querySelector('#inp-new-task-title');
    const title = titleInput ? titleInput.value.trim() : '';
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
    if (titleInput) titleInput.value = '';
  };

  container.querySelector('#btn-add-backlog-task')?.addEventListener('click', submitNewTask);
  container.querySelector('#inp-new-task-title')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitNewTask();
  });

  // Delete task buttons
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

  // Close drawer trigger (mobile)
  container.querySelector('.btn-close-drawer-trigger')?.addEventListener('click', () => {
    if (onCloseDrawer) onCloseDrawer();
  });
}


/* --- MODULE: js/editor/block-inspector.js --- */
/**
 * TimeGrid - Block Property Inspector & Analytics Panel (Right Panel)
 * Time block metadata editor, color swatch selector, split/duplicate/delete actions,
 * conflict resolution tools, Maker vs Manager ratio, and schedule category analytics.
 */







function renderBlockInspector(container, {
  selectedBlock = null,
  dayBlocks = [],
  is24Hour = false,
  onUpdateBlock = null,
  onDeleteBlock = null,
  onDuplicateBlock = null,
  onSplitBlock = null,
  onStartFocus = null,
  onCloseInspector = null,
  onBatchUpdateBlocks = null
}) {
  const metrics = calculateScheduleMetrics(dayBlocks);
  const conflictMap = detectConflicts(dayBlocks);
  const selectedConflict = selectedBlock ? conflictMap.get(selectedBlock.id) : null;
  const allConflicts = getConflictList(dayBlocks);

  const durMin = selectedBlock ? Math.max(0, selectedBlock.endMinute - selectedBlock.startMinute) : 0;

  container.innerHTML = `
    <!-- Top Inspector Header -->
    <div class="panel-section-header flex items-center justify-between p-3 border-b bg-panel select-none">
      <div class="flex items-center gap-2">
        ${getIcon(selectedBlock ? 'clock' : 'chart', 'icon-sm text-primary')}
        <span class="text-xs font-bold uppercase text-muted">
          ${selectedBlock ? 'Block Properties' : 'Schedule Insights'}
        </span>
      </div>
      <div class="flex items-center gap-1.5">
        ${selectedBlock ? `
          <button class="btn btn-xs btn-primary" id="btn-inspect-focus" title="Start Focus Timer (F)">
            ${getIcon('play', 'icon-xs')} Focus
          </button>
        ` : ''}
        ${onCloseInspector ? `
          <button class="btn-icon-xs text-muted btn-close-inspector-trigger md:hidden" title="Close Inspector">
            ${getIcon('close', 'icon-xs')}
          </button>
        ` : ''}
      </div>
    </div>

    <!-- Inspector Body Scroll -->
    <div class="inspector-body-scroll p-3 flex flex-col gap-3 flex-1 overflow-y-auto">
      
      <!-- Selected Block Property Editor -->
      ${selectedBlock ? `
        <div class="card p-3 flex flex-col gap-2.5 bg-panel border-subtle">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5 min-w-0 pr-2">
              <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${selectedBlock.color || '#0284c7'};"></span>
              <span class="font-bold text-xs text-primary truncate">${escapeHTML(selectedBlock.title)}</span>
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <button class="btn-icon-xs" id="btn-inspect-split" title="Split Block into 2 Half-Hour Segments">${getIcon('split', 'icon-xs')}</button>
              <button class="btn-icon-xs" id="btn-inspect-dupe" title="Duplicate Block">${getIcon('copy', 'icon-xs')}</button>
              <button class="btn-icon-xs text-rose" id="btn-inspect-del" title="Delete Block (Del)">${getIcon('trash', 'icon-xs')}</button>
            </div>
          </div>

          <!-- Conflict Warning Card (if this block conflicts) -->
          ${selectedConflict && selectedConflict.hasConflict ? `
            <div class="card p-2 bg-amber-subtle border-amber flex flex-col gap-1.5">
              <div class="flex items-center gap-1.5 text-xs text-amber font-bold">
                ${getIcon('alert', 'icon-xs text-amber')}
                <span>Schedule Conflict Detected</span>
              </div>
              <p class="text-xs text-secondary" style="font-size: 10.5px;">
                Overlaps by <strong>${selectedConflict.totalOverlapMinutes}m</strong> with:
                ${selectedConflict.conflictingWith.map(c => `<span class="text-amber">${escapeHTML(c.title)}</span>`).join(', ')}
              </p>
              <button class="btn btn-xs btn-secondary text-amber w-full justify-center" id="btn-resolve-this-conflict">
                Auto-Shift to Resolve Overlap
              </button>
            </div>
          ` : ''}

          <!-- Title -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Title</label>
            <input type="text" id="inp-block-title" class="form-control form-control-sm font-semibold" value="${escapeHTML(selectedBlock.title)}" />
          </div>

          <!-- Start & End Time & Duration -->
          <div class="grid grid-cols-2 gap-2">
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Start</label>
              <input type="text" id="inp-block-start" class="form-control form-control-sm font-mono" value="${minutesToTimeString(selectedBlock.startMinute, is24Hour)}" />
            </div>
            <div class="form-group">
              <div class="flex items-center justify-between">
                <label class="form-label text-xs font-semibold text-muted">End</label>
                <span class="text-xs font-mono text-muted" style="font-size: 9.5px;">${formatDuration(durMin)}</span>
              </div>
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

          <!-- Color Swatches -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Accent Color</label>
            <div class="flex items-center gap-1.5 flex-wrap">
              ${COLOR_SWATCHES.map(color => `
                <button type="button" class="btn-color-swatch w-4 h-4 rounded-full border border-subtle transition-transform hover:scale-110 ${selectedBlock.color === color ? 'ring-2 ring-white' : ''}"
                        data-color="${color}"
                        style="background-color: ${color};"
                        title="${color}">
                </button>
              `).join('')}
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
            <textarea id="inp-block-notes" class="form-control form-control-sm font-sans" rows="2" placeholder="Key outcomes, checklist or links...">${escapeHTML(selectedBlock.notes || '')}</textarea>
          </div>
        </div>
      ` : `
        <div class="card p-3 text-center text-muted bg-panel border-dashed border-subtle text-xs">
          Select any block on the grid to edit properties or start a focus session.
        </div>
      `}

      <!-- Daily Time Distribution Donut Chart -->
      <div class="card p-3 flex flex-col gap-2 bg-panel border-subtle">
        <div class="flex items-center justify-between">
          <span class="font-bold text-xs text-primary uppercase" style="font-size: 10px;">Time Allocation</span>
          <span class="font-mono text-xs text-muted" style="font-size: 10px;">${dayBlocks.length} Blocks &bull; ${formatDuration(metrics.totalScheduled)}</span>
        </div>
        <div class="flex items-center justify-center py-1">
          <canvas id="inspector-category-donut" width="220" height="150"></canvas>
        </div>

        <!-- Maker vs Manager Ratio Bar -->
        <div class="flex flex-col gap-1 border-t pt-2 border-subtle text-xs">
          <div class="flex items-center justify-between font-semibold" style="font-size: 10.5px;">
            <span class="text-primary">Maker / Deep Work Ratio</span>
            <span class="font-mono text-primary font-bold">${metrics.makerRatio}%</span>
          </div>
          <div class="w-full bg-elevated h-1.5 rounded overflow-hidden flex">
            <div class="h-full bg-primary" style="width: ${metrics.makerRatio}%; background-color: var(--accent-primary);"></div>
            <div class="h-full bg-muted" style="width: ${100 - metrics.makerRatio}%; background-color: #8b5cf6;"></div>
          </div>
          <div class="flex items-center justify-between text-muted font-mono" style="font-size: 9.5px;">
            <span>Deep Work: ${formatDuration(metrics.focusTime)}</span>
            <span>Meetings: ${formatDuration(metrics.meetingTime)}</span>
          </div>
        </div>
      </div>

      <!-- Schedule Metrics Summary -->
      <div class="card p-3 flex flex-col gap-2 font-sans text-xs bg-panel border-subtle">
        <div class="flex items-center justify-between">
          <span class="font-bold text-xs text-primary uppercase" style="font-size: 10px;">Daily Productivity</span>
          <span class="badge ${metrics.efficiency >= 70 ? 'badge-primary' : 'badge-secondary'} font-mono">${metrics.efficiency}% Score</span>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div class="card p-2 text-center bg-elevated">
            <span class="text-xs text-muted block" style="font-size: 10px;">Deep Focus</span>
            <strong class="font-mono text-sm text-primary">${formatDuration(metrics.focusTime)}</strong>
          </div>
          <div class="card p-2 text-center bg-elevated">
            <span class="text-xs text-muted block" style="font-size: 10px;">Meetings</span>
            <strong class="font-mono text-sm text-secondary">${formatDuration(metrics.meetingTime)}</strong>
          </div>
          <div class="card p-2 text-center bg-elevated">
            <span class="text-xs text-muted block" style="font-size: 10px;">Free Buffer</span>
            <strong class="font-mono text-sm text-emerald">${formatDuration(metrics.freeWorkdayTime)}</strong>
          </div>
          <div class="card p-2 text-center bg-elevated">
            <span class="text-xs text-muted block" style="font-size: 10px;">Conflicts</span>
            <strong class="font-mono text-sm ${metrics.totalConflicts > 0 ? 'text-amber font-bold' : 'text-muted'}">${metrics.totalConflicts}</strong>
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
    container.querySelector('#inp-block-title')?.addEventListener('input', (e) => {
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

    // Swatches
    container.querySelectorAll('.btn-color-swatch').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedBlock.color = btn.dataset.color;
        if (onUpdateBlock) onUpdateBlock(selectedBlock);
      });
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

    // Auto resolve conflict button
    container.querySelector('#btn-resolve-this-conflict')?.addEventListener('click', () => {
      if (selectedConflict && selectedConflict.conflictingWith.length > 0) {
        const otherId = selectedConflict.conflictingWith[0].id;
        const resolved = autoResolveConflict(selectedBlock.id, otherId, dayBlocks);
        if (onBatchUpdateBlocks) {
          onBatchUpdateBlocks(resolved);
        }
      }
    });
  }

  // Close inspector trigger (mobile)
  container.querySelector('.btn-close-inspector-trigger')?.addEventListener('click', () => {
    if (onCloseInspector) onCloseInspector();
  });
}


/* --- MODULE: js/editor/focus-mode.js --- */
/**
 * TimeGrid - Distraction-Free Focus Mode & Countdown Timer Component
 * Fullscreen immersive countdown with circular progress ring, synthesized harmonic chime,
 * quick interval presets, and active task scratchpad.
 */



function playSynthesizedChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Major chord chime)
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.12 + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 1.25);
    });
  } catch (e) {
    // Audio autoplay blocked or unsupported
  }
}

class FocusModeManager {
  constructor(container, onFinishBlock) {
    this.container = container;
    this.onFinishBlock = onFinishBlock;

    this.activeBlock = null;
    this.totalSeconds = 1500; // 25 min default
    this.remainingSeconds = 1500;
    this.isRunning = false;
    this.timerInterval = null;
    this.soundEnabled = true;
    this.keyListener = null;
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
    this.bindKeyboardShortcuts();
  }

  close() {
    this.pause();
    this.container.classList.remove('active');
    this.unbindKeyboardShortcuts();
  }

  bindKeyboardShortcuts() {
    this.unbindKeyboardShortcuts();
    this.keyListener = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'Escape') {
        this.close();
        e.preventDefault();
      }
      if (e.key === ' ') {
        if (this.isRunning) this.pause();
        else this.resume();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', this.keyListener);
  }

  unbindKeyboardShortcuts() {
    if (this.keyListener) {
      window.removeEventListener('keydown', this.keyListener);
      this.keyListener = null;
    }
  }

  startInterval() {
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.isRunning && this.remainingSeconds > 0) {
        this.remainingSeconds--;
        this.updateDisplay();

        if (this.remainingSeconds <= 0) {
          this.pause();
          if (this.soundEnabled) playSynthesizedChime();
          
          setTimeout(() => {
            alert(`Great work! Focus block "${this.activeBlock?.title}" is complete.`);
            if (this.onFinishBlock && this.activeBlock) {
              this.onFinishBlock(this.activeBlock.id);
            }
          }, 300);
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

  setDurationMinutes(minutes) {
    this.totalSeconds = minutes * 60;
    this.remainingSeconds = this.totalSeconds;
    this.updateDisplay();
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
      <div class="focus-overlay-content flex flex-col items-center justify-between p-6 text-center h-full max-w-lg mx-auto relative z-10 select-none">
        
        <!-- Top Navigation & Controls -->
        <div class="w-full flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="badge badge-primary font-bold">${escapeHTML(this.activeBlock.category || 'Focus')}</span>
            <span class="text-xs text-muted font-mono">${escapeHTML(this.activeBlock.priority || 'High')} Priority</span>
          </div>
          <div class="flex items-center gap-2">
            <button class="btn-icon-xs text-muted" id="btn-focus-toggle-sound" title="${this.soundEnabled ? 'Mute Sound' : 'Enable Sound'}">
              ${getIcon(this.soundEnabled ? 'volume2' : 'volumeX', 'icon-sm')}
            </button>
            <button class="btn-icon-xs text-muted btn-focus-close" title="Exit Focus Mode (Esc)">
              ${getIcon('close', 'icon-sm')}
            </button>
          </div>
        </div>

        <!-- Center Countdown Timer & Progress Ring -->
        <div class="focus-timer-center flex flex-col items-center justify-center my-auto w-full">
          <!-- Circular Progress Ring SVG -->
          <div class="relative flex items-center justify-center w-64 h-64">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" stroke="currentColor" stroke-width="4" class="text-subtle opacity-20" fill="transparent" />
              <circle id="focus-progress-circle" cx="50" cy="50" r="44" stroke="${this.activeBlock.color || '#38bdf8'}" stroke-width="4" stroke-linecap="round" fill="transparent" stroke-dasharray="276.46" stroke-dashoffset="0" style="transition: stroke-dashoffset 0.8s ease;" />
            </svg>

            <!-- Time Display Inside Ring -->
            <div class="absolute flex flex-col items-center">
              <span class="font-mono font-bold text-4xl text-primary" id="lbl-focus-time-left">${this.formatCountdown()}</span>
              <span class="text-xs text-muted mt-1 uppercase font-semibold tracking-wider">Remaining</span>
            </div>
          </div>

          <!-- Active Task Title & Notes -->
          <h2 class="text-lg font-bold text-primary mt-4 max-w-md">${escapeHTML(this.activeBlock.title)}</h2>
          ${this.activeBlock.notes ? `<p class="text-xs text-muted mt-1 max-w-sm font-sans">${escapeHTML(this.activeBlock.notes)}</p>` : ''}

          <!-- Quick Preset Duration Pills -->
          <div class="flex items-center gap-1.5 mt-4">
            <button class="btn btn-xs btn-secondary btn-set-focus-dur" data-min="25">25m</button>
            <button class="btn btn-xs btn-secondary btn-set-focus-dur" data-min="50">50m</button>
            <button class="btn btn-xs btn-secondary btn-set-focus-dur" data-min="90">90m</button>
            <button class="btn btn-xs btn-secondary" id="btn-focus-add-5">+5m</button>
          </div>
        </div>

        <!-- Bottom Controls -->
        <div class="w-full flex flex-col items-center gap-2">
          <div class="flex items-center justify-center gap-3">
            <button class="btn btn-primary px-8 font-bold" id="btn-focus-toggle-play">
              <span id="lbl-focus-play-btn">${this.isRunning ? 'Pause' : 'Resume'}</span>
            </button>

            <button class="btn btn-secondary" id="btn-focus-finish">Complete</button>
          </div>
          <span class="text-xs text-muted font-mono" style="font-size: 10px;">Press <strong>Space</strong> to pause/resume &bull; <strong>Esc</strong> to exit</span>
        </div>

      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    this.container.querySelector('.btn-focus-close')?.addEventListener('click', () => this.close());
    this.container.querySelector('#btn-focus-add-5')?.addEventListener('click', () => this.addTime(5));

    this.container.querySelectorAll('.btn-set-focus-dur').forEach(btn => {
      btn.addEventListener('click', () => {
        const min = parseInt(btn.dataset.min, 10);
        if (min) this.setDurationMinutes(min);
      });
    });

    this.container.querySelector('#btn-focus-toggle-sound')?.addEventListener('click', () => {
      this.soundEnabled = !this.soundEnabled;
      const btn = this.container.querySelector('#btn-focus-toggle-sound');
      if (btn) {
        btn.innerHTML = getIcon(this.soundEnabled ? 'volume2' : 'volumeX', 'icon-sm');
        btn.title = this.soundEnabled ? 'Mute Sound' : 'Enable Sound';
      }
    });

    this.container.querySelector('#btn-focus-toggle-play')?.addEventListener('click', () => {
      if (this.isRunning) this.pause();
      else this.resume();
    });

    this.container.querySelector('#btn-focus-finish')?.addEventListener('click', () => {
      if (confirm('Mark this focus block as completed?')) {
        this.close();
        if (this.soundEnabled) playSynthesizedChime();
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
 * Side-by-side comparison matrix for simulated daily schedules (Focus vs Meetings vs Free Time vs Conflicts)
 * with mini timeline visualizers and 1-click application.
 */





class ScenarioComparisonModal {
  constructor(container, onApplyScenario) {
    this.container = container;
    this.onApplyScenario = onApplyScenario;
    this.scenarios = [];
    this.currentDateStr = '';
    this.keyListener = null;
  }

  open(scenarios = [], currentDateStr = '') {
    this.scenarios = scenarios;
    this.currentDateStr = currentDateStr;
    this.render();
    this.container.classList.add('active');

    this.keyListener = (e) => {
      if (e.key === 'Escape') this.close();
    };
    window.addEventListener('keydown', this.keyListener);
  }

  close() {
    this.container.classList.remove('active');
    if (this.keyListener) {
      window.removeEventListener('keydown', this.keyListener);
      this.keyListener = null;
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-dialog scenario-modal-dialog">
        <div class="modal-header flex items-center justify-between p-3 border-b bg-panel select-none">
          <div class="flex items-center gap-2">
            ${getIcon('layers', 'icon-sm text-primary')}
            <span class="font-bold text-sm">Schedule Simulation & Scenario Comparison</span>
          </div>
          <button class="btn-icon-xs text-muted btn-modal-close" title="Close (Esc)">&times;</button>
        </div>

        <div class="modal-body p-4 flex flex-col gap-4 overflow-y-auto bg-panel" style="max-height: 75vh;">
          <p class="text-xs text-muted font-sans">
            Simulate and benchmark alternative schedule distributions for <strong>${this.currentDateStr}</strong> to eliminate cognitive fragmentation and optimize Maker vs Manager time.
          </p>

          <!-- Comparison Table Grid -->
          <div class="overflow-x-auto rounded border border-subtle">
            <table class="data-grid-table font-sans text-xs w-full">
              <thead>
                <tr>
                  <th>Scenario & Timeline Preview</th>
                  <th class="text-center">Deep Focus</th>
                  <th class="text-center">Meetings</th>
                  <th class="text-center">Buffer</th>
                  <th class="text-center">Maker %</th>
                  <th class="text-center">Conflicts</th>
                  <th class="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                ${this.scenarios.map(sc => {
                  const dayBlocks = sc.blocks.filter(b => b.date === this.currentDateStr);
                  const m = calculateScheduleMetrics(dayBlocks);

                  return `
                    <tr>
                      <td style="max-width: 260px;">
                        <div class="flex flex-col gap-1.5 py-1">
                          <strong class="text-primary text-xs">${escapeHTML(sc.name)}</strong>
                          <!-- Mini timeline visualizer -->
                          <div class="w-full bg-elevated h-2 rounded overflow-hidden relative flex">
                            ${dayBlocks.map(b => {
                              const leftPct = (b.startMinute / 1440) * 100;
                              const widthPct = Math.max(1, ((b.endMinute - b.startMinute) / 1440) * 100);
                              return `
                                <div class="absolute h-full rounded-xs"
                                     style="left: ${leftPct}%; width: ${widthPct}%; background-color: ${b.color || '#0284c7'};"
                                     title="${escapeHTML(b.title)} (${minutesToTimeString(b.startMinute)} - ${minutesToTimeString(b.endMinute)})">
                                </div>
                              `;
                            }).join('')}
                          </div>
                          <span class="text-xs text-muted font-mono" style="font-size: 9.5px;">${dayBlocks.length} blocks &bull; ${formatDuration(m.totalScheduled)} total</span>
                        </div>
                      </td>
                      <td class="text-center font-mono font-bold text-primary">${formatDuration(m.focusTime)}</td>
                      <td class="text-center font-mono text-secondary">${formatDuration(m.meetingTime)}</td>
                      <td class="text-center font-mono text-emerald">${formatDuration(m.freeWorkdayTime)}</td>
                      <td class="text-center font-mono font-bold text-primary">${m.makerRatio}%</td>
                      <td class="text-center font-mono ${m.totalConflicts > 0 ? 'text-amber font-bold' : 'text-muted'}">${m.totalConflicts}</td>
                      <td class="text-right">
                        <button class="btn btn-xs btn-primary btn-apply-scenario-row" data-id="${sc.id}">
                          Apply Schedule
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

        </div>

        <div class="modal-footer p-3 border-t bg-panel flex justify-between items-center">
          <span class="text-xs text-muted font-mono" style="font-size: 10px;">Applying a scenario automatically saves an undo snapshot</span>
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
 * Integrates 24h Time Grid Canvas, Task Backlog Drawer, Block Inspector, Focus Mode,
 * Scenario Simulation, Multi-Level Undo / Toast System, Keyboard Shortcuts, and Persistent Storage.
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
    this.gridSnap = 15; // 15 min default

    // UI Drawer state for mobile
    this.isDrawerOpen = false;
    this.isInspectorOpen = false;

    // Toast & Undo State
    this.toastTimer = null;
  }

  async init() {
    await db.init();
    this.blocks = await db.getAllBlocks();
    this.backlogTasks = await db.getAllBacklogTasks();

    if (this.blocks.length > 0) {
      const todayKey = formatDateKey(this.currentDate);
      const todayBlock = this.blocks.find(b => b.date === todayKey);
      this.selectedBlockId = todayBlock ? todayBlock.id : this.blocks[0].id;
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
      this.deleteBlock(blockId, true);
    });

    const scenarioContainer = document.getElementById('scenario-modal-container');
    this.scenarioModal = new ScenarioComparisonModal(scenarioContainer, (appliedScenario) => {
      db.pushUndoSnapshot(this.blocks, this.backlogTasks);
      this.blocks = JSON.parse(JSON.stringify(appliedScenario.blocks));
      this.saveAllBlocks();
      this.renderAll();
      this.showToast(`Applied schedule plan "${appliedScenario.name}"`, { canUndo: true });
    });

    this.setupToolbar();
    this.setupDateControls();
    this.setupShortcuts();
    this.setupMobileDrawers();
    this.renderAll();
  }

  renderAll() {
    this.renderGrid();
    this.renderDrawer();
    this.renderInspector();
    this.updateHeaderDateDisplay();
    this.updateConflictIndicator();
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
        this.showToast(`Task "${task.title}" added to inbox.`);
      },
      onDeleteTask: async (id) => {
        db.pushUndoSnapshot(this.blocks, this.backlogTasks);
        const task = this.backlogTasks.find(t => t.id === id);
        await db.deleteBacklogTask(id);
        this.backlogTasks = await db.getAllBacklogTasks();
        this.renderDrawer();
        this.showToast(`Deleted task "${task?.title || ''}"`, { canUndo: true });
      },
      onApplyTemplate: (tpl) => {
        const dateKey = formatDateKey(this.currentDate);
        db.pushUndoSnapshot(this.blocks, this.backlogTasks);

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
        this.showToast(`Applied "${tpl.name}" routine template.`, { canUndo: true });
      },
      onCloseDrawer: () => this.toggleLeftDrawer(false)
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
      onStartFocus: (block) => this.focusManager.startFocus(block),
      onCloseInspector: () => this.toggleRightInspector(false),
      onBatchUpdateBlocks: async (updatedList) => {
        db.pushUndoSnapshot(this.blocks, this.backlogTasks);
        for (const b of updatedList) {
          const idx = this.blocks.findIndex(x => x.id === b.id);
          if (idx >= 0) this.blocks[idx] = b;
          await db.saveBlock(b);
        }
        this.renderAll();
        this.showToast('Resolved schedule overlap.', { canUndo: true });
      }
    });
  }

  updateConflictIndicator() {
    const dateKey = formatDateKey(this.currentDate);
    const dayBlocks = this.blocks.filter(b => b.date === dateKey);
    const conflictMap = detectConflicts(dayBlocks);
    let conflictCount = 0;
    for (const [, info] of conflictMap) {
      if (info.hasConflict) conflictCount++;
    }
    const uniquePairs = Math.round(conflictCount / 2);

    const badge = document.getElementById('topbar-conflict-badge');
    if (badge) {
      if (uniquePairs > 0) {
        badge.innerHTML = `${getIcon('alert', 'icon-xs')} ${uniquePairs} ${uniquePairs === 1 ? 'Overlap' : 'Overlaps'}`;
        badge.className = 'badge badge-conflict text-amber font-mono font-bold cursor-pointer';
        badge.title = `${uniquePairs} overlapping time blocks detected today`;
      } else {
        badge.innerHTML = `${getIcon('check', 'icon-xs')} 0 Conflicts`;
        badge.className = 'badge badge-secondary text-emerald font-mono font-bold';
        badge.title = 'No schedule overlaps detected today';
      }
    }
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
      const btn = document.getElementById('btn-toggle-24h');
      if (btn) btn.textContent = this.is24Hour ? '24h' : '12h';
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

      const scenarios = [
        { id: 'sc_current', name: 'Current Active Plan', blocks: this.blocks },
        {
          id: 'sc_deep_work',
          name: 'Scenario A: Deep Focus Maker Sprint',
          blocks: [
            ...this.blocks.filter(b => b.date !== dateKey),
            { id: 'sc_1', date: dateKey, title: 'Morning Deep Work Block', startMinute: 540, endMinute: 720, category: 'Deep Work', priority: 'High', color: '#0284c7' },
            { id: 'sc_2', date: dateKey, title: 'Consolidated Syncs & Catchup', startMinute: 840, endMinute: 960, category: 'Meetings', priority: 'Med', color: '#8b5cf6' },
            { id: 'sc_3', date: dateKey, title: 'Afternoon Flow State Sprint', startMinute: 960, endMinute: 1080, category: 'Deep Work', priority: 'High', color: '#0284c7' }
          ]
        },
        {
          id: 'sc_balanced',
          name: 'Scenario B: Balanced Flow & Admin Buffer',
          blocks: [
            ...this.blocks.filter(b => b.date !== dateKey),
            { id: 'sc_b1', date: dateKey, title: 'Planning & Inbox Zero', startMinute: 540, endMinute: 600, category: 'Admin', priority: 'Med', color: '#f59e0b' },
            { id: 'sc_b2', date: dateKey, title: 'Deep Work Sprint', startMinute: 600, endMinute: 750, category: 'Deep Work', priority: 'High', color: '#0284c7' },
            { id: 'sc_b3', date: dateKey, title: 'Collaborative Sync', startMinute: 810, endMinute: 900, category: 'Meetings', priority: 'Med', color: '#8b5cf6' },
            { id: 'sc_b4', date: dateKey, title: 'Architecture Review', startMinute: 930, endMinute: 1020, category: 'Deep Work', priority: 'Med', color: '#0284c7' }
          ]
        },
        {
          id: 'sc_async_research',
          name: 'Scenario C: Async Engineering & Research',
          blocks: [
            ...this.blocks.filter(b => b.date !== dateKey),
            { id: 'sc_c1', date: dateKey, title: 'Technical Spike & RFC Writeup', startMinute: 540, endMinute: 720, category: 'Deep Work', priority: 'High', color: '#0284c7' },
            { id: 'sc_c2', date: dateKey, title: 'Algorithmic Profiling', startMinute: 780, endMinute: 960, category: 'Deep Work', priority: 'High', color: '#0284c7' },
            { id: 'sc_c3', date: dateKey, title: 'Code Reviews & PR Triage', startMinute: 990, endMinute: 1050, category: 'Admin', priority: 'Med', color: '#f59e0b' }
          ]
        }
      ];

      this.scenarioModal.open(scenarios, dateKey);
    });

    // Shortcuts Modal
    document.getElementById('btn-open-shortcuts')?.addEventListener('click', () => {
      this.toggleShortcutsModal(true);
    });

    // Reset Schedule
    document.getElementById('btn-reset-schedule')?.addEventListener('click', async () => {
      if (confirm('Reset TimeGrid to demonstration schedule and backlog tasks?')) {
        db.pushUndoSnapshot(this.blocks, this.backlogTasks);
        await db.resetToSampleData();
        this.blocks = await db.getAllBlocks();
        this.backlogTasks = await db.getAllBacklogTasks();
        this.selectedBlockId = this.blocks[0]?.id || null;
        this.renderAll();
        this.showToast('Schedule reset to demo workspace.', { canUndo: true });
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
      this.showToast('Exported backup JSON.');
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
            db.pushUndoSnapshot(this.blocks, this.backlogTasks);
            await db.replaceAllBlocks(parsed.blocks);
            if (Array.isArray(parsed.backlogTasks)) {
              await db.replaceAllBacklogTasks(parsed.backlogTasks);
            }
            this.blocks = await db.getAllBlocks();
            this.backlogTasks = await db.getAllBacklogTasks();
            this.renderAll();
            this.showToast(`Restored backup with ${parsed.blocks.length} blocks.`, { canUndo: true });
          } else {
            alert('Invalid TimeGrid backup JSON structure.');
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

    // Native Date Picker Input
    const picker = document.getElementById('inp-date-picker');
    picker?.addEventListener('change', (e) => {
      if (e.target.value) {
        const parts = e.target.value.split('-');
        this.currentDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        this.renderAll();
      }
    });
  }

  setupMobileDrawers() {
    const btnToggleLeft = document.getElementById('btn-toggle-left-drawer');
    const btnToggleRight = document.getElementById('btn-toggle-right-inspector');
    const backdrop = document.getElementById('drawer-backdrop-mobile');

    btnToggleLeft?.addEventListener('click', () => this.toggleLeftDrawer());
    btnToggleRight?.addEventListener('click', () => this.toggleRightInspector());
    backdrop?.addEventListener('click', () => {
      this.toggleLeftDrawer(false);
      this.toggleRightInspector(false);
    });
  }

  toggleLeftDrawer(forceState = null) {
    const drawer = document.getElementById('task-drawer-container');
    const backdrop = document.getElementById('drawer-backdrop-mobile');
    this.isDrawerOpen = forceState !== null ? forceState : !this.isDrawerOpen;
    drawer?.classList.toggle('drawer-open-mobile', this.isDrawerOpen);
    backdrop?.classList.toggle('active', this.isDrawerOpen || this.isInspectorOpen);
  }

  toggleRightInspector(forceState = null) {
    const inspector = document.getElementById('block-inspector-container');
    const backdrop = document.getElementById('drawer-backdrop-mobile');
    this.isInspectorOpen = forceState !== null ? forceState : !this.isInspectorOpen;
    inspector?.classList.toggle('inspector-open-mobile', this.isInspectorOpen);
    backdrop?.classList.toggle('active', this.isDrawerOpen || this.isInspectorOpen);
  }

  setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      // Undo: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        this.performUndo();
        e.preventDefault();
        return;
      }

      // '?' -> Toggle Shortcuts modal
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        this.toggleShortcutsModal();
        e.preventDefault();
        return;
      }

      // 'D' -> Day view
      if (e.key === 'd' || e.key === 'D') {
        this.viewMode = GRID_VIEWS.DAY;
        document.querySelectorAll('.btn-view-mode').forEach(b => b.classList.toggle('active', b.dataset.view === 'day'));
        this.renderAll();
        return;
      }

      // 'W' -> Week view
      if (e.key === 'w' || e.key === 'W') {
        this.viewMode = GRID_VIEWS.WEEK;
        document.querySelectorAll('.btn-view-mode').forEach(b => b.classList.toggle('active', b.dataset.view === 'week'));
        this.renderAll();
        return;
      }

      // 'T' -> Jump to Today
      if (e.key === 't' || e.key === 'T') {
        this.currentDate = new Date();
        this.renderAll();
        return;
      }

      // Left/Right arrow navigation
      if (e.key === 'ArrowLeft') {
        const step = this.viewMode === GRID_VIEWS.DAY ? 1 : 7;
        this.currentDate.setDate(this.currentDate.getDate() - step);
        this.renderAll();
        return;
      }
      if (e.key === 'ArrowRight') {
        const step = this.viewMode === GRID_VIEWS.DAY ? 1 : 7;
        this.currentDate.setDate(this.currentDate.getDate() + step);
        this.renderAll();
        return;
      }

      // Delete active block
      if ((e.key === 'Delete' || e.key === 'Backspace') && this.selectedBlockId) {
        this.deleteBlock(this.selectedBlockId);
        e.preventDefault();
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

  toggleShortcutsModal(forceState = null) {
    const modal = document.getElementById('shortcuts-modal-container');
    if (!modal) return;
    const isShown = forceState !== null ? forceState : !modal.classList.contains('active');
    modal.classList.toggle('active', isShown);

    if (isShown) {
      modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-dialog max-w-md">
          <div class="modal-header flex items-center justify-between p-3 border-b bg-panel">
            <div class="flex items-center gap-2 font-bold text-sm">
              ${getIcon('help', 'icon-sm text-primary')}
              <span>Keyboard Shortcuts & Quick Guide</span>
            </div>
            <button class="btn-icon-xs text-muted btn-close-shortcuts">&times;</button>
          </div>
          <div class="modal-body p-4 flex flex-col gap-3 font-sans text-xs bg-panel">
            <div class="grid grid-cols-2 gap-2">
              <div class="card p-2 bg-elevated flex items-center justify-between">
                <span class="text-secondary">New Block</span>
                <kbd class="badge badge-primary font-mono font-bold">N</kbd>
              </div>
              <div class="card p-2 bg-elevated flex items-center justify-between">
                <span class="text-secondary">Start Focus Mode</span>
                <kbd class="badge badge-primary font-mono font-bold">F</kbd>
              </div>
              <div class="card p-2 bg-elevated flex items-center justify-between">
                <span class="text-secondary">Day View</span>
                <kbd class="badge badge-secondary font-mono font-bold">D</kbd>
              </div>
              <div class="card p-2 bg-elevated flex items-center justify-between">
                <span class="text-secondary">Week View</span>
                <kbd class="badge badge-secondary font-mono font-bold">W</kbd>
              </div>
              <div class="card p-2 bg-elevated flex items-center justify-between">
                <span class="text-secondary">Jump to Today</span>
                <kbd class="badge badge-secondary font-mono font-bold">T</kbd>
              </div>
              <div class="card p-2 bg-elevated flex items-center justify-between">
                <span class="text-secondary">Undo Action</span>
                <kbd class="badge badge-secondary font-mono font-bold">Ctrl+Z</kbd>
              </div>
              <div class="card p-2 bg-elevated flex items-center justify-between">
                <span class="text-secondary">Delete Block</span>
                <kbd class="badge badge-secondary font-mono font-bold">Del</kbd>
              </div>
              <div class="card p-2 bg-elevated flex items-center justify-between">
                <span class="text-secondary">Previous / Next Day</span>
                <kbd class="badge badge-secondary font-mono font-bold">&larr; / &rarr;</kbd>
              </div>
            </div>

            <div class="p-2 border-t border-subtle flex flex-col gap-1 text-muted">
              <strong>Interactive Gestures:</strong>
              <span>&bull; Double-click grid to add a 1-hour block</span>
              <span>&bull; Drag top or bottom handles to resize time</span>
              <span>&bull; Drag tasks from Backlog onto any time column</span>
            </div>
          </div>
          <div class="modal-footer p-3 border-t bg-panel flex justify-end">
            <button class="btn btn-sm btn-secondary btn-close-shortcuts">Got It</button>
          </div>
        </div>
      `;

      modal.querySelectorAll('.btn-close-shortcuts, .modal-backdrop').forEach(b => {
        b.addEventListener('click', () => modal.classList.remove('active'));
      });
    }
  }

  updateHeaderDateDisplay() {
    const lbl = document.getElementById('lbl-current-date-display');
    const picker = document.getElementById('inp-date-picker');
    const fullKey = formatDateKey(this.currentDate);

    if (lbl) {
      lbl.textContent = formatDateDisplay(this.currentDate);
      lbl.title = formatFullDateDisplay(this.currentDate);
    }
    if (picker) {
      picker.value = fullKey;
    }
  }

  // --- Undo & Toast Notifications ---
  showToast(message, { canUndo = false } = {}) {
    clearTimeout(this.toastTimer);
    let container = document.getElementById('global-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'global-toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    container.innerHTML = `
      <div class="toast-card flex items-center gap-3">
        <span class="text-xs text-primary font-sans">${escapeHTML(message)}</span>
        ${canUndo ? `
          <button class="btn btn-xs btn-primary font-mono font-bold" id="btn-toast-undo">
            ${getIcon('undo', 'icon-xs')} Undo
          </button>
        ` : ''}
        <button class="btn-icon-xs text-muted" id="btn-toast-dismiss">&times;</button>
      </div>
    `;
    container.classList.add('active');

    container.querySelector('#btn-toast-undo')?.addEventListener('click', () => {
      this.performUndo();
      container.classList.remove('active');
    });

    container.querySelector('#btn-toast-dismiss')?.addEventListener('click', () => {
      container.classList.remove('active');
    });

    this.toastTimer = setTimeout(() => {
      container.classList.remove('active');
    }, 4500);
  }

  async performUndo() {
    const snapshot = db.popUndoSnapshot();
    if (!snapshot) {
      this.showToast('Nothing to undo.');
      return;
    }

    this.blocks = snapshot.blocks;
    this.backlogTasks = snapshot.backlogTasks;
    await db.replaceAllBlocks(this.blocks);
    await db.replaceAllBacklogTasks(this.backlogTasks);
    this.renderAll();
    this.showToast('Action undone.');
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

  async deleteBlock(id, quiet = false) {
    const block = this.blocks.find(b => b.id === id);
    if (!block) return;

    db.pushUndoSnapshot(this.blocks, this.backlogTasks);
    await db.deleteBlock(id);
    this.blocks = this.blocks.filter(b => b.id !== id);

    if (this.selectedBlockId === id) {
      this.selectedBlockId = this.blocks[0]?.id || null;
    }
    this.renderAll();

    if (!quiet) {
      this.showToast(`Deleted block "${block.title}"`, { canUndo: true });
    }
  }

  async duplicateBlock(id) {
    const orig = this.blocks.find(b => b.id === id);
    if (!orig) return;

    db.pushUndoSnapshot(this.blocks, this.backlogTasks);
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
    this.showToast(`Duplicated "${orig.title}"`, { canUndo: true });
  }

  async splitBlock(id) {
    const orig = this.blocks.find(b => b.id === id);
    if (!orig) return;

    const dur = orig.endMinute - orig.startMinute;
    if (dur < 30) return alert('Block duration is too short to split (minimum 30 minutes).');

    db.pushUndoSnapshot(this.blocks, this.backlogTasks);
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
    this.showToast(`Split into two ${halfDur}m blocks.`, { canUndo: true });
  }

  async createNewBlockAt({ date, startMinute, endMinute }) {
    db.pushUndoSnapshot(this.blocks, this.backlogTasks);
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
    this.showToast('Created new focus block.', { canUndo: true });
  }

  async scheduleBacklogTask(taskId, date, startMinute) {
    const task = this.backlogTasks.find(t => t.id === taskId);
    if (!task) return;

    db.pushUndoSnapshot(this.blocks, this.backlogTasks);
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
    this.showToast(`Scheduled task "${task.title}".`, { canUndo: true });
  }

  async saveAllBlocks() {
    for (const b of this.blocks) {
      await db.saveBlock(b);
    }
  }

  exportICS() {
    let ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//TimeGrid//Visual Time Blocking//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n';

    for (const b of this.blocks) {
      const dateNoDash = b.date.replace(/-/g, '');
      const sH = Math.floor(b.startMinute / 60).toString().padStart(2, '0');
      const sM = (b.startMinute % 60).toString().padStart(2, '0');
      const eH = Math.floor(b.endMinute / 60).toString().padStart(2, '0');
      const eM = (b.endMinute % 60).toString().padStart(2, '0');

      ics += 'BEGIN:VEVENT\n';
      ics += `UID:${b.id}@timegrid.local\n`;
      ics += `SUMMARY:${b.title}\n`;
      ics += `DTSTART:${dateNoDash}T${sH}${sM}00\n`;
      ics += `DTEND:${dateNoDash}T${eH}${eM}00\n`;
      ics += `DESCRIPTION:${(b.notes || '').replace(/\n/g, '\\n')}\n`;
      ics += `CATEGORIES:${b.category || 'General'}\n`;
      ics += 'STATUS:CONFIRMED\n';
      ics += 'END:VEVENT\n';
    }

    ics += 'END:VCALENDAR\n';

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timegrid_schedule_${formatDateKey(new Date())}.ics`;
    a.click();
    this.showToast('Exported iCalendar (.ics) file.');
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
