/**
 * TimeGrid - Automated Verification Test Suite
 * Tests minute-from-midnight math, conflict detection, recurrence rules, auto-resolution, and schedule metrics.
 */

import { minutesToTimeString, timeStringToMinutes, formatDuration, snapMinutes, formatDateKey, findFreeTimeSlots, isSameDay } from './js/core/time.js';
import { detectConflicts, calculateScheduleMetrics, getConflictList, autoResolveConflict } from './js/engine/conflicts.js';
import { isEventActiveOnDate, RECURRENCE_TYPES } from './js/engine/recurrence.js';
import { SCHEDULE_TEMPLATES } from './js/engine/templates.js';
import { getSampleScheduleData } from './js/engine/sample-data.js';

console.log('--- 1. Testing Minute-from-Midnight Math Engine ---');
const time12 = minutesToTimeString(510, false); // 8:30 AM
const time24 = minutesToTimeString(855, true);  // 14:15
console.log('510 min -> 12h:', time12, '| 855 min -> 24h:', time24);
if (time12 !== '8:30 AM' || time24 !== '14:15') throw new Error('Time string formatting failed');

const parsed1 = timeStringToMinutes('08:30 AM');
const parsed2 = timeStringToMinutes('14:15');
console.log('Parsed "08:30 AM" ->', parsed1, '| "14:15" ->', parsed2);
if (parsed1 !== 510 || parsed2 !== 855) throw new Error('Time string parsing failed');

const durStr1 = formatDuration(90);
const durStr2 = formatDuration(45);
console.log('90 min ->', durStr1, '| 45 min ->', durStr2);
if (durStr1 !== '1h 30m' || durStr2 !== '45m') throw new Error('Duration formatting failed');

console.log('\n--- 2. Testing Interval Snapping & Free Time Slots ---');
const snapped1 = snapMinutes(512, 15);
const snapped2 = snapMinutes(512, 30);
console.log('512 min snapped to 15m:', snapped1, '| snapped to 30m:', snapped2);
if (snapped1 !== 510 || snapped2 !== 510) throw new Error('Interval snapping failed');

const freeSlots = findFreeTimeSlots([
  { startMinute: 540, endMinute: 660 }, // 9:00 - 11:00
  { startMinute: 720, endMinute: 840 }  // 12:00 - 14:00
], 540, 1080);
console.log('Free slots found:', freeSlots.length, freeSlots);
if (freeSlots.length !== 2 || freeSlots[0].duration !== 60 || freeSlots[1].duration !== 240) {
  throw new Error('Free time slots calculation failed');
}

console.log('\n--- 3. Testing Conflict Detection & Auto-Resolution Engine ---');
const blocks = [
  { id: 'b1', title: 'Deep Work A', startMinute: 540, endMinute: 660, category: 'Deep Work' }, // 9:00 - 11:00
  { id: 'b2', title: 'Team Sync', startMinute: 600, endMinute: 630, category: 'Meetings' },   // 10:00 - 10:30 (Overlap!)
  { id: 'b3', title: 'Lunch', startMinute: 720, endMinute: 780, category: 'Personal' }         // 12:00 - 1:00 (No overlap)
];

const conflictMap = detectConflicts(blocks);
console.log('Block b1 conflict:', conflictMap.get('b1').hasConflict, 'Overlap:', conflictMap.get('b1').totalOverlapMinutes, 'min');
console.log('Block b2 conflict:', conflictMap.get('b2').hasConflict, 'Overlap:', conflictMap.get('b2').totalOverlapMinutes, 'min');
console.log('Block b3 conflict:', conflictMap.get('b3').hasConflict);

if (!conflictMap.get('b1').hasConflict || !conflictMap.get('b2').hasConflict || conflictMap.get('b3').hasConflict) {
  throw new Error('Conflict detection failed');
}

const conflictPairs = getConflictList(blocks);
console.log('Conflict pairs count:', conflictPairs.length);
if (conflictPairs.length !== 1 || conflictPairs[0].overlapMinutes !== 30) {
  throw new Error('Conflict pairs extraction failed');
}

// Test auto-resolve
const resolvedBlocks = autoResolveConflict('b1', 'b2', blocks);
const newConflictMap = detectConflicts(resolvedBlocks);
console.log('After auto-resolve: b1 conflict:', newConflictMap.get('b1').hasConflict, '| b2 startMinute:', resolvedBlocks.find(b => b.id === 'b2').startMinute);
if (newConflictMap.get('b1').hasConflict || newConflictMap.get('b2').hasConflict || resolvedBlocks.find(b => b.id === 'b2').startMinute !== 660) {
  throw new Error('Auto-resolve conflict failed');
}

const metrics = calculateScheduleMetrics(blocks);
console.log('Schedule Metrics -> Focus:', metrics.focusTime, 'min | Meetings:', metrics.meetingTime, 'min | Conflicts:', metrics.totalConflicts, '| Maker Ratio:', metrics.makerRatio + '%');
if (metrics.focusTime !== 120 || metrics.meetingTime !== 30 || metrics.totalConflicts !== 1 || metrics.makerRatio !== 80) {
  throw new Error('Schedule metrics calculation failed');
}

console.log('\n--- 4. Testing Recurrence Evaluation ---');
const weekdayEvent = { id: 'rec1', recurrence: RECURRENCE_TYPES.WEEKDAYS };
const isMon = isEventActiveOnDate(weekdayEvent, '2024-06-03'); // Monday
const isSat = isEventActiveOnDate(weekdayEvent, '2024-06-08'); // Saturday
console.log('Weekday event on Monday:', isMon, '| on Saturday:', isSat);
if (!isMon || isSat) throw new Error('Weekday recurrence evaluation failed');

console.log('\n--- 5. Testing Templates & Sample Schedule ---');
console.log('Schedule Templates count:', SCHEDULE_TEMPLATES.length);
if (SCHEDULE_TEMPLATES.length < 4) throw new Error('Templates incomplete');

const sample = getSampleScheduleData();
console.log('Sample blocks count:', sample.blocks.length, '| Backlog count:', sample.backlogTasks.length);
if (sample.blocks.length < 15 || sample.backlogTasks.length < 5) throw new Error('Sample data incomplete');

console.log('\n=============================================');
console.log('ALL TIMEGRID ENGINES & TESTS PASSED 100%!');
console.log('=============================================');
