/**
 * TimeGrid - Real-Time Conflict Detection Engine & Schedule Analytics
 * Detects overlapping time block intervals, conflicting event titles, overlap durations,
 * and calculates Maker vs Manager ratios, workday load, and auto-resolution proposals.
 */

/**
 * Detect all conflicts among a list of time blocks for the same day
 */
export function detectConflicts(blocks = []) {
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
export function getConflictList(blocks = []) {
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
export function autoResolveConflict(blockAId, blockBId, blocks = []) {
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
