/**
 * TimeGrid - Recurring Routine Engine
 * Evaluates recurring rules (Daily, Weekdays, Weekends, Custom Days) and expands blocks across dates.
 */

export const RECURRENCE_TYPES = {
  NONE: 'none',
  DAILY: 'daily',
  WEEKDAYS: 'weekdays',
  WEEKENDS: 'weekends',
  WEEKLY: 'weekly'
};

/**
 * Check if a recurring event applies to a specific target date
 */
export function isEventActiveOnDate(event, targetDate) {
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
