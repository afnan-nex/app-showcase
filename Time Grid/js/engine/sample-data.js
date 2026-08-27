/**
 * TimeGrid - Pre-Loaded Demonstration Schedule & Backlog Tasks
 * Rich baseline data populated across the current week.
 */

import { formatDateKey, getWeekDates } from '../core/time.js';

export function getSampleScheduleData(referenceDate = new Date()) {
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
