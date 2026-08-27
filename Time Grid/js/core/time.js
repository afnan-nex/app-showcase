/**
 * TimeGrid - Time Model & Minute-from-Midnight Math Engine
 * Conversions between minutes (0-1440), 12h/24h strings, durations, and week dates.
 */

/**
 * Format minutes from midnight (0..1440) to time string
 */
export function minutesToTimeString(minutes, is24Hour = false) {
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
export function timeStringToMinutes(timeStr) {
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
export function formatDuration(durationMinutes) {
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
export function snapMinutes(minutes, step = 15) {
  if (!step || step <= 1) return Math.round(minutes || 0);
  return Math.round((minutes || 0) / step) * step;
}

/**
 * Format Date object to "YYYY-MM-DD" key
 */
export function formatDateKey(date) {
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
export function formatDateDisplay(date) {
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
export function formatFullDateDisplay(date) {
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
export function isSameDay(date1, date2) {
  return formatDateKey(date1) === formatDateKey(date2);
}

/**
 * Get array of 7 Date objects representing Monday-Sunday for the given reference date
 */
export function getWeekDates(referenceDate) {
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
export function findFreeTimeSlots(blocks = [], workStartMin = 540, workEndMin = 1080) {
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
