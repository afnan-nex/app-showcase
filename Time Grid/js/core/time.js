/**
 * TimeGrid - Time Model & Minute-from-Midnight Math Engine
 * Conversions between minutes (0-1440), 12h/24h strings, durations, and week dates.
 */

/**
 * Format minutes from midnight (0..1440) to time string
 */
export function minutesToTimeString(minutes, is24Hour = false) {
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
export function timeStringToMinutes(timeStr) {
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
export function formatDuration(durationMinutes) {
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
export function snapMinutes(minutes, step = 15) {
  if (!step || step <= 1) return Math.round(minutes);
  return Math.round(minutes / step) * step;
}

/**
 * Format Date object to "YYYY-MM-DD" key
 */
export function formatDateKey(date) {
  const d = new Date(date);
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
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Get array of 7 Date objects representing Monday-Sunday for the given reference date
 */
export function getWeekDates(referenceDate) {
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
