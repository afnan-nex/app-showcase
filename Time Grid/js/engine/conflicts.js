/**
 * TimeGrid - Real-Time Conflict Detection Engine
 * Detects overlapping time block intervals, conflicting event titles, and overlap durations.
 */

/**
 * Detect all conflicts among a list of time blocks for the same day
 */
export function detectConflicts(blocks = []) {
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
export function calculateScheduleMetrics(blocks = [], workStartMin = 540, workEndMin = 1080) {
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
