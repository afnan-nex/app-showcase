/**
 * BudgetOS - Standalone Application Bundle
 * Complete client-side personal finance & cash-flow simulation engine.
 * Self-contained for both HTTP servers and local file:/// protocol execution.
 */

(function() {
'use strict';


/* --- MODULE: js/icons.js --- */
/**
 * BudgetOS - Local SVG Icons Registry
 * Provides crisp, high-contrast, scalable SVG icons for all UI elements.
 */

const ICONS = {
  // Navigation & Core
  dashboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"></rect><rect x="14" y="3" width="7" height="5" rx="1"></rect><rect x="14" y="12" width="7" height="9" rx="1"></rect><rect x="3" y="16" width="7" height="5" rx="1"></rect></svg>`,
  transactions: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
  accounts: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>`,
  budgets: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>`,
  goals: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,
  recurring: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>`,
  forecast: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>`,
  scenarios: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,
  reports: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
  dataHub: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,

  // UI Actions & Indicators
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  minus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  filter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
  upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
  trendUp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`,
  trendDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>`,
  arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
  arrowLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`,
  transfer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>`,
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
  moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
  undo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>`,
  printer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>`,
  refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
  sparkles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
  play: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,

  // Category & Account Types
  housing: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
  food: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`,
  groceries: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`,
  transport: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>`,
  utilities: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
  health: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>`,
  entertainment: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>`,
  shopping: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`,
  salary: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
  investment: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"></path><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path></svg>`,
  bank: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 3l9 7H3z"></path></svg>`,
  creditCard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>`,
  cash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>`,
  tag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`,
  more: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>`,
  help: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`
};

/**
 * Get SVG icon markup by name
 * @param {string} name - Icon identifier
 * @param {string} [extraClass=''] - Additional CSS classes
 * @returns {string} SVG HTML string
 */
function getIcon(name, extraClass = '') {
  const svg = ICONS[name] || ICONS.tag;
  if (!extraClass) return svg;
  return svg.replace('<svg ', `<svg class="${extraClass}" `);
}

ICONS;


/* --- MODULE: js/formatters.js --- */
/**
 * BudgetOS - Formatters & Mathematical Utility Module
 */

let activeCurrency = 'USD';
let activeLocale = 'en-US';

const CURRENCY_MAP = {
  USD: { symbol: '$', code: 'USD', locale: 'en-US' },
  EUR: { symbol: '€', code: 'EUR', locale: 'de-DE' },
  GBP: { symbol: '£', code: 'GBP', locale: 'en-GB' },
  CAD: { symbol: 'CA$', code: 'CAD', locale: 'en-CA' },
  AUD: { symbol: 'A$', code: 'AUD', locale: 'en-AU' },
  JPY: { symbol: '¥', code: 'JPY', locale: 'ja-JP' },
  INR: { symbol: '₹', code: 'INR', locale: 'en-IN' },
  CHF: { symbol: 'CHF', code: 'CHF', locale: 'de-CH' }
};

function setCurrencyConfig(currencyCode) {
  if (CURRENCY_MAP[currencyCode]) {
    activeCurrency = currencyCode;
    activeLocale = CURRENCY_MAP[currencyCode].locale;
  }
}

function getCurrencyConfig() {
  return CURRENCY_MAP[activeCurrency] || CURRENCY_MAP.USD;
}

function getSupportedCurrencies() {
  return Object.keys(CURRENCY_MAP).map(key => ({
    code: key,
    symbol: CURRENCY_MAP[key].symbol,
    label: `${key} (${CURRENCY_MAP[key].symbol})`
  }));
}

/**
 * Format a number as currency
 * @param {number} amount - Monetary amount
 * @param {Object} [options]
 * @param {boolean} [options.hideDecimals=false]
 * @param {boolean} [options.showSign=false] - Explicit + for positive
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount, options = {}) {
  const num = Number(amount) || 0;
  const config = getCurrencyConfig();
  const hideDecimals = options.hideDecimals || (config.code === 'JPY');
  
  let formatted = new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    minimumFractionDigits: hideDecimals ? 0 : 2,
    maximumFractionDigits: hideDecimals ? 0 : 2
  }).format(num);

  if (options.showSign && num > 0) {
    formatted = '+' + formatted;
  }
  return formatted;
}

/**
 * Format compact currency e.g. $1.2k, $4.5M
 */
function formatCompactCurrency(amount) {
  const num = Number(amount) || 0;
  const config = getCurrencyConfig();
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(num);
}

/**
 * Format percentage (e.g. 84.2%)
 */
function formatPercent(value, decimals = 1) {
  const num = Number(value) || 0;
  return `${num.toFixed(decimals)}%`;
}

/**
 * Format ISO Date string to readable format (e.g. "Aug 27, 2026")
 */
function formatDate(dateString, format = 'medium') {
  if (!dateString) return '—';
  const d = new Date(dateString + 'T00:00:00');
  if (isNaN(d.getTime())) return dateString;

  if (format === 'short') {
    return d.toLocaleDateString(activeLocale, { month: 'short', day: 'numeric' });
  }
  if (format === 'medium') {
    return d.toLocaleDateString(activeLocale, { month: 'short', day: 'numeric', year: 'numeric' });
  }
  if (format === 'monthYear') {
    return d.toLocaleDateString(activeLocale, { month: 'long', year: 'numeric' });
  }
  if (format === 'iso') {
    return d.toISOString().split('T')[0];
  }
  return d.toLocaleDateString();
}

/**
 * Relative date description e.g. "Today", "Tomorrow", "In 3 days", "5 days ago"
 */
function formatRelativeDate(dateString) {
  if (!dateString) return '—';
  const target = new Date(dateString + 'T00:00:00');
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
  return formatDate(dateString, 'medium');
}

/**
 * Get current Month Year key "YYYY-MM"
 */
function getMonthKey(date = new Date()) {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Format Month Key "YYYY-MM" to "August 2026"
 */
function formatMonthKey(monthKey) {
  if (!monthKey || !monthKey.includes('-')) return monthKey;
  const [year, month] = monthKey.split('-');
  const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
  return d.toLocaleDateString(activeLocale, { month: 'long', year: 'numeric' });
}

/**
 * Date arithmetic utilities
 */
function addDays(dateStrOrObj, days) {
  const d = typeof dateStrOrObj === 'string' ? new Date(dateStrOrObj + 'T00:00:00') : new Date(dateStrOrObj);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function addMonths(dateStrOrObj, months) {
  const d = typeof dateStrOrObj === 'string' ? new Date(dateStrOrObj + 'T00:00:00') : new Date(dateStrOrObj);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split('T')[0];
}

function getDaysBetween(date1Str, date2Str) {
  const d1 = new Date(date1Str + 'T00:00:00');
  const d2 = new Date(date2Str + 'T00:00:00');
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}

function getTodayISO() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

/**
 * Escape HTML to prevent injection
 */
function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Parse CSV string to 2D Array
 */
function parseCSV(csvText) {
  const lines = [];
  let row = [''];
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push('');
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      lines.push(row);
      row = [''];
    } else {
      row[row.length - 1] += char;
    }
  }
  if (row.length > 1 || (row.length === 1 && row[0].trim() !== '')) {
    lines.push(row);
  }
  return lines;
}

/**
 * Generate CSV string from row objects
 */
function generateCSV(headers, data) {
  const escapeCell = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`;
  };

  const headerRow = headers.map(h => escapeCell(h.label)).join(',');
  const rows = data.map(item => {
    return headers.map(h => escapeCell(item[h.key])).join(',');
  });

  return [headerRow, ...rows].join('\r\n');
}


/* --- MODULE: js/calculations/balances.js --- */
/**
 * BudgetOS - Balance Engine
 * Dynamically computes account balances, cleared vs uncleared funds, and net worth
 * directly from transaction history and opening balances.
 */

/**
 * Calculate balances for all accounts given transactions list
 * @param {Array} accounts 
 * @param {Array} transactions 
 * @returns {Object} Map of accountId -> balance stats and total net worth summary
 */
function calculateAccountBalances(accounts = [], transactions = []) {
  const accountMap = {};
  
  accounts.forEach(acc => {
    accountMap[acc.id] = {
      id: acc.id,
      name: acc.name,
      type: acc.type,
      color: acc.color,
      icon: acc.icon,
      creditLimit: Number(acc.creditLimit) || 0,
      initialBalance: Number(acc.initialBalance) || 0,
      currentBalance: Number(acc.initialBalance) || 0,
      clearedBalance: Number(acc.initialBalance) || 0,
      totalIncome: 0,
      totalExpense: 0,
      totalTransfersIn: 0,
      totalTransfersOut: 0,
      transactionCount: 0
    };
  });

  // Process all transactions
  transactions.forEach(tx => {
    const amount = Number(tx.amount) || 0;
    const isCleared = tx.isCleared !== false; // default true if undefined
    
    if (tx.type === 'income') {
      if (accountMap[tx.accountId]) {
        const acc = accountMap[tx.accountId];
        acc.currentBalance += amount;
        if (isCleared) acc.clearedBalance += amount;
        acc.totalIncome += amount;
        acc.transactionCount++;
      }
    } else if (tx.type === 'expense') {
      if (accountMap[tx.accountId]) {
        const acc = accountMap[tx.accountId];
        if (acc.type === 'creditCard') {
          // For credit cards, an expense increases outstanding balance (debt)
          acc.currentBalance += amount;
          if (isCleared) acc.clearedBalance += amount;
        } else {
          // For checking/savings/cash, expense reduces balance
          acc.currentBalance -= amount;
          if (isCleared) acc.clearedBalance -= amount;
        }
        acc.totalExpense += amount;
        acc.transactionCount++;
      }
    } else if (tx.type === 'transfer') {
      // Outgoing from source account
      if (accountMap[tx.accountId]) {
        const fromAcc = accountMap[tx.accountId];
        fromAcc.currentBalance -= amount;
        if (isCleared) fromAcc.clearedBalance -= amount;
        fromAcc.totalTransfersOut += amount;
        fromAcc.transactionCount++;
      }
      // Incoming to destination account
      if (accountMap[tx.toAccountId]) {
        const toAcc = accountMap[tx.toAccountId];
        if (toAcc.type === 'creditCard') {
          // A transfer into a credit card is a payment, which reduces the credit debt
          toAcc.currentBalance -= amount;
          if (isCleared) toAcc.clearedBalance -= amount;
        } else {
          toAcc.currentBalance += amount;
          if (isCleared) toAcc.clearedBalance += amount;
        }
        toAcc.totalTransfersIn += amount;
        toAcc.transactionCount++;
      }
    }
  });

  // Calculate overall summary metrics
  let totalAssets = 0;
  let totalLiabilities = 0;
  let totalCashAndChecking = 0;

  Object.values(accountMap).forEach(acc => {
    if (acc.type === 'creditCard') {
      totalLiabilities += Math.max(0, acc.currentBalance);
    } else {
      totalAssets += Math.max(0, acc.currentBalance);
      if (acc.type === 'checking' || acc.type === 'cash') {
        totalCashAndChecking += acc.currentBalance;
      }
    }
  });

  const netWorth = totalAssets - totalLiabilities;

  return {
    accounts: accountMap,
    summary: {
      netWorth,
      totalAssets,
      totalLiabilities,
      totalCashAndChecking
    }
  };
}

/**
 * Get individual balance for a single account
 */
function getSingleAccountBalance(accountId, accounts = [], transactions = []) {
  const { accounts: accountMap } = calculateAccountBalances(accounts, transactions);
  return accountMap[accountId] || null;
}


/* --- MODULE: js/calculations/budgets.js --- */
/**
 * BudgetOS - Budget Calculation Engine
 * Evaluates monthly category spending vs budgets, calculates remaining balances,
 * usage percentages, warning status, and overall budget health.
 */


/**
 * Calculate budget performance for a given month
 * @param {string} monthKey - "YYYY-MM"
 * @param {Array} budgets - List of budget objects
 * @param {Array} categories - List of category objects
 * @param {Array} transactions - All transactions
 * @returns {Object} Full breakdown of category budgets and monthly health metrics
 */
function calculateBudgetPerformance(monthKey, budgets = [], categories = [], transactions = []) {
  const currentMonthKey = monthKey || getMonthKey();
  
  // Filter transactions for this specific month
  const monthTransactions = transactions.filter(tx => {
    return tx.date && tx.date.startsWith(currentMonthKey) && tx.type === 'expense';
  });

  // Calculate actual spending per category in this month
  const spendingPerCat = {};
  monthTransactions.forEach(tx => {
    const catId = tx.categoryId || 'cat_misc';
    spendingPerCat[catId] = (spendingPerCat[catId] || 0) + (Number(tx.amount) || 0);
  });

  // Get budgets configured for this month
  const activeBudgets = budgets.filter(b => b.monthKey === currentMonthKey);
  const budgetMap = {};
  activeBudgets.forEach(b => {
    budgetMap[b.categoryId] = Number(b.amount) || 0;
  });

  // Build category budget items
  const categoryResults = [];
  let totalBudgeted = 0;
  let totalSpentBudgeted = 0;
  let totalSpentUnbudgeted = 0;
  let overBudgetCount = 0;
  let warningCount = 0;

  // Expense categories
  const expenseCategories = categories.filter(c => c.type === 'expense');

  expenseCategories.forEach(cat => {
    const budgeted = budgetMap[cat.id] || 0;
    const spent = spendingPerCat[cat.id] || 0;
    const remaining = budgeted - spent;
    const percentage = budgeted > 0 ? (spent / budgeted) * 100 : (spent > 0 ? 100 : 0);

    let status = 'safe'; // 'safe', 'warning', 'danger'
    if (budgeted > 0) {
      if (percentage >= 100) {
        status = 'danger';
        overBudgetCount++;
      } else if (percentage >= 80) {
        status = 'warning';
        warningCount++;
      }
    } else if (spent > 0) {
      status = 'unbudgeted';
    }

    if (budgeted > 0) {
      totalBudgeted += budgeted;
      totalSpentBudgeted += spent;
    } else {
      totalSpentUnbudgeted += spent;
    }

    categoryResults.push({
      categoryId: cat.id,
      categoryName: cat.name,
      categoryColor: cat.color,
      categoryIcon: cat.icon,
      budgeted,
      spent,
      remaining,
      percentage: Number(percentage.toFixed(1)),
      status,
      isBudgetSet: budgeted > 0
    });
  });

  // Sort: Budgeted categories first (highest % used first), then unbudgeted
  categoryResults.sort((a, b) => {
    if (a.isBudgetSet && !b.isBudgetSet) return -1;
    if (!a.isBudgetSet && b.isBudgetSet) return 1;
    return b.percentage - a.percentage;
  });

  const totalSpent = totalSpentBudgeted + totalSpentUnbudgeted;
  const overallPercentage = totalBudgeted > 0 ? (totalSpentBudgeted / totalBudgeted) * 100 : 0;
  const overallRemaining = Math.max(0, totalBudgeted - totalSpentBudgeted);

  return {
    monthKey: currentMonthKey,
    categories: categoryResults,
    summary: {
      totalBudgeted,
      totalSpent,
      totalSpentBudgeted,
      totalSpentUnbudgeted,
      overallRemaining,
      overallPercentage: Number(overallPercentage.toFixed(1)),
      overBudgetCount,
      warningCount,
      isOverBudget: totalSpentBudgeted > totalBudgeted && totalBudgeted > 0
    }
  };
}


/* --- MODULE: js/calculations/forecast.js --- */
/**
 * BudgetOS - Cash-Flow Forecast Engine
 * Deterministically simulates future account balances day-by-day over 30-365 days
 * using current balances, active recurring rules, scheduled bills, and discretionary trends.
 */


/**
 * Generate future cash-flow timeline
 * @param {Object} params
 * @param {number} params.horizonDays - Number of days to simulate (e.g. 30, 60, 90, 180, 365)
 * @param {Array} params.accounts - Account list
 * @param {Array} params.transactions - Historical transactions
 * @param {Array} params.recurring - Recurring rules
 * @param {number} [params.safeBuffer=500] - Minimum safe cash balance warning threshold
 * @param {boolean} [params.includeDiscretionary=true] - Whether to factor in baseline daily discretionary spending
 * @returns {Object} Daily projection series and summary statistics
 */
function generateCashFlowForecast({
  horizonDays = 90,
  accounts = [],
  transactions = [],
  recurring = [],
  safeBuffer = 500,
  includeDiscretionary = false
}) {
  const today = getTodayISO();

  // 1. Calculate current liquid starting balance (Checking + Savings + Cash)
  // We exclude credit card debt from starting liquid cash, but track net liquid
  let currentLiquidCash = 0;
  let totalNetWorth = 0;

  accounts.forEach(acc => {
    // Initial balance + transaction sum
    let bal = Number(acc.initialBalance) || 0;
    transactions.forEach(tx => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'income' && tx.accountId === acc.id) bal += amt;
      if (tx.type === 'expense' && tx.accountId === acc.id) {
        bal += (acc.type === 'creditCard' ? amt : -amt);
      }
      if (tx.type === 'transfer') {
        if (tx.accountId === acc.id) bal -= amt;
        if (tx.toAccountId === acc.id) {
          bal += (acc.type === 'creditCard' ? -amt : amt);
        }
      }
    });

    if (acc.type !== 'creditCard' && !acc.isArchived) {
      currentLiquidCash += bal;
      totalNetWorth += bal;
    } else if (acc.type === 'creditCard' && !acc.isArchived) {
      totalNetWorth -= Math.max(0, bal);
    }
  });

  // 2. Expand recurring schedule over horizon
  const activeRecurring = recurring.filter(r => !r.isPaused);
  const eventsByDate = {};

  activeRecurring.forEach(rule => {
    let cursorDate = rule.nextDueDate || today;
    const amount = Number(rule.amount) || 0;

    // Advance cursor if in the past
    while (cursorDate < today) {
      cursorDate = getNextOccurrence(cursorDate, rule.frequency);
    }

    const maxDate = addDays(today, horizonDays);
    while (cursorDate <= maxDate) {
      if (rule.endDate && cursorDate > rule.endDate) break;

      if (!eventsByDate[cursorDate]) {
        eventsByDate[cursorDate] = [];
      }

      eventsByDate[cursorDate].push({
        id: rule.id,
        name: rule.name,
        amount,
        type: rule.type,
        categoryId: rule.categoryId,
        frequency: rule.frequency
      });

      cursorDate = getNextOccurrence(cursorDate, rule.frequency);
    }
  });

  // 3. Optional: Estimate average daily discretionary spending from recent 30-day non-recurring expenses
  let estimatedDailyDiscretionary = 0;
  if (includeDiscretionary) {
    const thirtyDaysAgo = addDays(today, -30);
    const recentExpenses = transactions.filter(tx => {
      return tx.type === 'expense' && tx.date >= thirtyDaysAgo && tx.date <= today && !tx.recurringId;
    });
    const sumRecent = recentExpenses.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
    estimatedDailyDiscretionary = sumRecent / 30;
  }

  // 4. Simulate day by day
  const timeline = [];
  let runningBalance = currentLiquidCash;
  let totalProjectedIncome = 0;
  let totalProjectedExpense = 0;
  let lowestBalance = runningBalance;
  let lowestBalanceDate = today;
  let highestBalance = runningBalance;
  let belowBufferOccurrences = 0;

  for (let i = 0; i <= horizonDays; i++) {
    const date = addDays(today, i);
    const dayEvents = eventsByDate[date] || [];

    let dayIncome = 0;
    let dayExpense = 0;

    dayEvents.forEach(evt => {
      if (evt.type === 'income') {
        dayIncome += evt.amount;
      } else if (evt.type === 'expense') {
        dayExpense += evt.amount;
      }
      // Internal transfers don't change liquid total (checking <-> savings),
      // but if external, handled by income/expense.
    });

    if (includeDiscretionary && i > 0) {
      dayExpense += estimatedDailyDiscretionary;
    }

    runningBalance = runningBalance + dayIncome - dayExpense;
    totalProjectedIncome += dayIncome;
    totalProjectedExpense += dayExpense;

    if (runningBalance < lowestBalance) {
      lowestBalance = runningBalance;
      lowestBalanceDate = date;
    }
    if (runningBalance > highestBalance) {
      highestBalance = runningBalance;
    }
    if (runningBalance < safeBuffer) {
      belowBufferOccurrences++;
    }

    timeline.push({
      date,
      balance: Math.round(runningBalance * 100) / 100,
      income: dayIncome,
      expense: dayExpense,
      events: dayEvents,
      isBelowBuffer: runningBalance < safeBuffer
    });
  }

  const endingBalance = timeline[timeline.length - 1].balance;
  const netChange = endingBalance - currentLiquidCash;

  return {
    horizonDays,
    startDate: today,
    endDate: addDays(today, horizonDays),
    startBalance: Math.round(currentLiquidCash * 100) / 100,
    endingBalance: Math.round(endingBalance * 100) / 100,
    netChange: Math.round(netChange * 100) / 100,
    totalProjectedIncome: Math.round(totalProjectedIncome * 100) / 100,
    totalProjectedExpense: Math.round(totalProjectedExpense * 100) / 100,
    lowestBalance: Math.round(lowestBalance * 100) / 100,
    lowestBalanceDate,
    highestBalance: Math.round(highestBalance * 100) / 100,
    safeBuffer,
    belowBufferOccurrences,
    timeline
  };
}

/**
 * Calculate next occurrence date string given frequency
 */
function getNextOccurrence(currentDateStr, frequency) {
  if (frequency === 'daily') {
    return addDays(currentDateStr, 1);
  }
  if (frequency === 'weekly') {
    return addDays(currentDateStr, 7);
  }
  if (frequency === 'biweekly') {
    return addDays(currentDateStr, 14);
  }
  if (frequency === 'monthly') {
    return addMonths(currentDateStr, 1);
  }
  if (frequency === 'yearly') {
    return addMonths(currentDateStr, 12);
  }
  return addDays(currentDateStr, 30);
}


/* --- MODULE: js/calculations/scenarios.js --- */
/**
 * BudgetOS - Financial Scenario Engine
 * Models hypothetical "What-If" modifications against baseline cash-flow projections
 * without modifying real financial records.
 */


/**
 * Run a comparative scenario simulation
 * @param {Object} params
 * @param {Array} params.accounts - Real accounts
 * @param {Array} params.transactions - Real transactions
 * @param {Array} params.recurring - Real recurring rules
 * @param {Array} params.goals - Real goals
 * @param {Object} params.scenarioParams - What-If levers
 * @param {number} [params.horizonDays=180]
 * @returns {Object} Comparative outcome with baseline, simulated, and delta metrics
 */
function runScenarioSimulation({
  accounts = [],
  transactions = [],
  recurring = [],
  goals = [],
  scenarioParams = {},
  horizonDays = 180
}) {
  // 1. Calculate baseline projection
  const baselineForecast = generateCashFlowForecast({
    horizonDays,
    accounts,
    transactions,
    recurring,
    safeBuffer: 500,
    includeDiscretionary: false
  });

  // 2. Clone recurring list and apply scenario adjustments
  const simulatedRecurring = JSON.parse(JSON.stringify(recurring));

  // A. Modify existing income percentage or fixed bump
  const incomePercentChange = Number(scenarioParams.incomePercentChange) || 0;
  const incomeFixedChange = Number(scenarioParams.incomeFixedChange) || 0;

  if (incomePercentChange !== 0 || incomeFixedChange !== 0) {
    simulatedRecurring.forEach(r => {
      if (r.type === 'income') {
        const base = Number(r.amount) || 0;
        let adjusted = base * (1 + incomePercentChange / 100) + incomeFixedChange;
        r.amount = Math.max(0, Math.round(adjusted * 100) / 100);
      }
    });
  }

  // B. Remove / Pause specific recurring expenses (e.g. cut subscriptions)
  const cutExpenseIds = scenarioParams.cutExpenseIds || [];
  if (cutExpenseIds.length > 0) {
    simulatedRecurring.forEach(r => {
      if (cutExpenseIds.includes(r.id)) {
        r.isPaused = true;
      }
    });
  }

  // C. Add hypothetical new recurring expenses
  const addedExpenses = scenarioParams.addedExpenses || [];
  addedExpenses.forEach((exp, idx) => {
    if (exp.amount > 0) {
      simulatedRecurring.push({
        id: `sim_exp_${idx}`,
        name: exp.name || 'Simulated Expense',
        amount: Number(exp.amount),
        type: 'expense',
        frequency: exp.frequency || 'monthly',
        nextDueDate: exp.startDate || getTodayISO(),
        isPaused: false
      });
    }
  });

  // D. Add hypothetical one-time events (windfalls or big purchases)
  const oneTimeEvents = scenarioParams.oneTimeEvents || [];
  const extraTransactions = [];
  oneTimeEvents.forEach((evt, idx) => {
    if (evt.amount > 0 && evt.date) {
      extraTransactions.push({
        id: `sim_event_${idx}`,
        date: evt.date,
        amount: Number(evt.amount),
        type: evt.type || 'expense',
        description: evt.name || 'Simulated One-Time Event',
        accountId: accounts[0]?.id || 'acc_checking'
      });
    }
  });

  // 3. Calculate simulated forecast
  const simulatedForecast = generateCashFlowForecast({
    horizonDays,
    accounts,
    transactions: [...transactions, ...extraTransactions],
    recurring: simulatedRecurring,
    safeBuffer: 500,
    includeDiscretionary: false
  });

  // 4. Calculate comparative delta metrics
  const endingBalanceDelta = simulatedForecast.endingBalance - baselineForecast.endingBalance;
  const incomeDelta = simulatedForecast.totalProjectedIncome - baselineForecast.totalProjectedIncome;
  const expenseDelta = simulatedForecast.totalProjectedExpense - baselineForecast.totalProjectedExpense;
  const netCashFlowDelta = simulatedForecast.netChange - baselineForecast.netChange;
  const lowestBalanceDelta = simulatedForecast.lowestBalance - baselineForecast.lowestBalance;

  // 5. Impact on Goals
  const goalImpacts = goals.map(goal => {
    const target = Number(goal.targetAmount) || 0;
    const current = Number(goal.currentAmount) || 0;
    const remaining = Math.max(0, target - current);
    const baseMonthlyContrib = Number(goal.monthlyContribution) || 0;

    // Monthly delta per month in scenario
    const monthlyNetDelta = netCashFlowDelta / (horizonDays / 30);
    const boostedMonthlyContrib = Math.max(0, baseMonthlyContrib + (monthlyNetDelta > 0 ? monthlyNetDelta * 0.4 : 0));

    const baselineMonthsNeeded = baseMonthlyContrib > 0 ? remaining / baseMonthlyContrib : null;
    const simulatedMonthsNeeded = boostedMonthlyContrib > 0 ? remaining / boostedMonthlyContrib : null;

    let monthsSaved = 0;
    if (baselineMonthsNeeded !== null && simulatedMonthsNeeded !== null) {
      monthsSaved = Math.round((baselineMonthsNeeded - simulatedMonthsNeeded) * 10) / 10;
    }

    return {
      goalId: goal.id,
      goalName: goal.name,
      targetAmount: target,
      currentAmount: current,
      baseMonthlyContrib,
      boostedMonthlyContrib: Math.round(boostedMonthlyContrib),
      baselineMonthsNeeded: baselineMonthsNeeded ? Math.round(baselineMonthsNeeded * 10) / 10 : 'N/A',
      simulatedMonthsNeeded: simulatedMonthsNeeded ? Math.round(simulatedMonthsNeeded * 10) / 10 : 'N/A',
      monthsSaved
    };
  });

  return {
    horizonDays,
    baseline: baselineForecast,
    simulated: simulatedForecast,
    delta: {
      endingBalanceDelta: Math.round(endingBalanceDelta * 100) / 100,
      incomeDelta: Math.round(incomeDelta * 100) / 100,
      expenseDelta: Math.round(expenseDelta * 100) / 100,
      netCashFlowDelta: Math.round(netCashFlowDelta * 100) / 100,
      lowestBalanceDelta: Math.round(lowestBalanceDelta * 100) / 100
    },
    goalImpacts
  };
}


/* --- MODULE: js/calculations/anomalies.js --- */
/**
 * BudgetOS - Anomaly Detection Engine
 * Uses historical statistical heuristics (mean, standard deviation, multiplier)
 * to flag unusual or outlier transactions for user review.
 */

/**
 * Identify potential spending anomalies in transactions
 * @param {Array} transactions - All transactions
 * @param {Array} categories - Category definitions
 * @param {Object} [options]
 * @param {number} [options.multiplierThreshold=2.2] - Multiplier above mean to flag
 * @param {number} [options.minSamples=3] - Minimum transactions in category needed for heuristic
 * @returns {Array} List of flagged anomaly objects
 */
function detectSpendingAnomalies(transactions = [], categories = [], options = {}) {
  const multiplierThreshold = options.multiplierThreshold || 2.2;
  const minSamples = options.minSamples || 3;

  const categoryMap = {};
  categories.forEach(c => { categoryMap[c.id] = c; });

  // 1. Group expense transactions by category
  const catExpenses = {};
  transactions.forEach(tx => {
    if (tx.type === 'expense') {
      const catId = tx.categoryId || 'cat_misc';
      if (!catExpenses[catId]) catExpenses[catId] = [];
      catExpenses[catId].push(tx);
    }
  });

  const anomalies = [];

  // 2. Compute statistics per category
  Object.keys(catExpenses).forEach(catId => {
    const txList = catExpenses[catId];
    if (txList.length < minSamples) return;

    const amounts = txList.map(t => Number(t.amount) || 0);
    const sum = amounts.reduce((a, b) => a + b, 0);
    const mean = sum / amounts.length;

    // Standard deviation
    const variance = amounts.reduce((sqSum, amt) => sqSum + Math.pow(amt - mean, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);

    const category = categoryMap[catId] || { name: 'Uncategorized', color: '#94a3b8' };

    // Check transactions against threshold
    txList.forEach(tx => {
      const amt = Number(tx.amount) || 0;
      const ratio = mean > 0 ? amt / mean : 1;

      // Check if significantly higher than mean + (stdDev * 1.5) or > mean * multiplierThreshold
      if (amt > 50 && (amt > mean * multiplierThreshold || (stdDev > 0 && amt > mean + 2.5 * stdDev))) {
        anomalies.push({
          transactionId: tx.id,
          date: tx.date,
          description: tx.description,
          merchant: tx.merchant,
          amount: amt,
          categoryId: catId,
          categoryName: category.name,
          categoryColor: category.color,
          categoryAverage: Math.round(mean * 100) / 100,
          ratioMultiplier: Math.round(ratio * 10) / 10,
          confidenceNote: `Informational flag: This transaction is ${Math.round(ratio * 10) / 10}x higher than your average ${category.name} expense ($${mean.toFixed(2)}).`
        });
      }
    });
  });

  // Sort by date descending
  anomalies.sort((a, b) => (b.date > a.date ? 1 : -1));

  return anomalies;
}


/* --- MODULE: js/calculations/analytics.js --- */
/**
 * BudgetOS - Analytics & Reports Calculation Engine
 * Produces category breakdowns, monthly trend metrics, savings rates, and merchant leaderboards.
 */


/**
 * Generate spending breakdown by category for a given date range or month
 */
function getCategorySpendingBreakdown(transactions = [], categories = [], filterMonthKey = null) {
  const categoryMap = {};
  categories.forEach(c => { categoryMap[c.id] = c; });

  let expenseTxs = transactions.filter(t => t.type === 'expense');
  if (filterMonthKey) {
    expenseTxs = expenseTxs.filter(t => t.date && t.date.startsWith(filterMonthKey));
  }

  const totals = {};
  let totalExpense = 0;

  expenseTxs.forEach(t => {
    const catId = t.categoryId || 'cat_misc';
    const amt = Number(t.amount) || 0;
    totals[catId] = (totals[catId] || 0) + amt;
    totalExpense += amt;
  });

  const breakdown = Object.keys(totals).map(catId => {
    const amount = totals[catId];
    const cat = categoryMap[catId] || { name: 'Miscellaneous', color: '#64748b', icon: 'tag' };
    const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
    return {
      categoryId: catId,
      name: cat.name,
      color: cat.color,
      icon: cat.icon,
      amount: Math.round(amount * 100) / 100,
      percentage: Number(percentage.toFixed(1))
    };
  });

  // Sort descending by spending amount
  breakdown.sort((a, b) => b.amount - a.amount);

  return {
    totalExpense: Math.round(totalExpense * 100) / 100,
    items: breakdown
  };
}

/**
 * Generate monthly historical trends (Income, Expense, Net Savings, Savings Rate)
 * @param {Array} transactions 
 * @param {number} [monthsCount=6] 
 */
function getMonthlyTrends(transactions = [], monthsCount = 6) {
  const now = new Date();
  const monthKeys = [];

  for (let i = monthsCount - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mKey = getMonthKey(d);
    monthKeys.push(mKey);
  }

  const trendData = monthKeys.map(mKey => {
    const mTransactions = transactions.filter(t => t.date && t.date.startsWith(mKey));
    let income = 0;
    let expense = 0;

    mTransactions.forEach(t => {
      const amt = Number(t.amount) || 0;
      if (t.type === 'income') income += amt;
      if (t.type === 'expense') expense += amt;
    });

    const netSavings = income - expense;
    const savingsRate = income > 0 ? (netSavings / income) * 100 : 0;

    return {
      monthKey: mKey,
      label: formatMonthKey(mKey),
      shortLabel: new Date(mKey + '-01T00:00:00').toLocaleDateString('en-US', { month: 'short' }),
      income: Math.round(income * 100) / 100,
      expense: Math.round(expense * 100) / 100,
      netSavings: Math.round(netSavings * 100) / 100,
      savingsRate: Number(Math.max(-100, Math.min(100, savingsRate)).toFixed(1))
    };
  });

  return trendData;
}

/**
 * Get top spending merchants/payees
 */
function getTopMerchants(transactions = [], limit = 5, filterMonthKey = null) {
  let expenseTxs = transactions.filter(t => t.type === 'expense');
  if (filterMonthKey) {
    expenseTxs = expenseTxs.filter(t => t.date && t.date.startsWith(filterMonthKey));
  }

  const merchantTotals = {};
  const merchantCounts = {};

  expenseTxs.forEach(t => {
    const name = t.merchant || t.description || 'Unknown Merchant';
    const amt = Number(t.amount) || 0;
    merchantTotals[name] = (merchantTotals[name] || 0) + amt;
    merchantCounts[name] = (merchantCounts[name] || 0) + 1;
  });

  const list = Object.keys(merchantTotals).map(name => ({
    name,
    total: Math.round(merchantTotals[name] * 100) / 100,
    count: merchantCounts[name]
  }));

  list.sort((a, b) => b.total - a.total);
  return list.slice(0, limit);
}


/* --- MODULE: js/charts/svg-charts.js --- */
/**
 * BudgetOS - Pure Vanilla SVG Charting Engine
 * High-performance, accessible, responsive SVG chart generators with zero external dependencies.
 */


/**
 * Generate an interactive SVG Donut Chart
 * @param {Object} options
 * @param {Array} options.data - [{ name, amount, percentage, color }]
 * @param {number} [options.size=240]
 * @param {number} [options.strokeWidth=32]
 * @param {string} [options.centerTitle='Total']
 * @param {string} [options.centerValue='']
 * @returns {string} SVG HTML string
 */
function renderDonutChart({
  data = [],
  size = 220,
  strokeWidth = 28,
  centerTitle = 'Total',
  centerValue = ''
}) {
  if (!data || data.length === 0) {
    return `<div class="chart-empty-state"><p>No spending data available</p></div>`;
  }

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let accumulatedPercent = 0;
  const paths = data.map((item, idx) => {
    if (item.percentage <= 0) return '';
    const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += item.percentage;

    return `
      <circle
        cx="${center}"
        cy="${center}"
        r="${radius}"
        fill="transparent"
        stroke="${item.color || '#3b82f6'}"
        stroke-width="${strokeWidth}"
        stroke-dasharray="${strokeDasharray}"
        stroke-dashoffset="${strokeDashoffset}"
        stroke-linecap="butt"
        class="donut-segment"
        data-name="${item.name}"
        data-amount="${formatCurrency(item.amount)}"
        data-percent="${item.percentage}%"
        style="transition: stroke-width 0.2s ease, opacity 0.2s ease; cursor: pointer;"
      >
        <title>${item.name}: ${formatCurrency(item.amount)} (${item.percentage}%)</title>
      </circle>
    `;
  }).join('');

  return `
    <div class="donut-chart-container" style="position: relative; width: ${size}px; height: ${size}px; margin: 0 auto;">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform: rotate(-90deg); overflow: visible;">
        <circle cx="${center}" cy="${center}" r="${radius}" fill="transparent" stroke="var(--border-subtle)" stroke-width="${strokeWidth}" />
        ${paths}
      </svg>
      <div class="donut-center-info" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; text-align: center;">
        <span class="donut-center-label" style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">${centerTitle}</span>
        <span class="donut-center-val" style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary); font-variant-numeric: tabular-nums;">${centerValue}</span>
      </div>
    </div>
  `;
}

/**
 * Generate a responsive SVG Area/Line Cash-Flow Forecast Chart
 * @param {Object} options
 * @param {Array} options.timeline - [{ date, balance, income, expense, isBelowBuffer }]
 * @param {number} [options.safeBuffer=500]
 * @param {number} [options.width=700]
 * @param {number} [options.height=260]
 * @returns {string} SVG HTML string with interactive data attributes
 */
function renderForecastChart({
  timeline = [],
  safeBuffer = 500,
  width = 800,
  height = 260
}) {
  if (!timeline || timeline.length === 0) {
    return `<div class="chart-empty-state"><p>No forecast data available</p></div>`;
  }

  const padding = { top: 25, right: 30, bottom: 40, left: 65 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const balances = timeline.map(t => t.balance);
  let minVal = Math.min(...balances, safeBuffer, 0);
  let maxVal = Math.max(...balances, safeBuffer * 1.5);
  
  // Pad bounds
  const range = maxVal - minVal || 1;
  minVal = Math.floor(minVal - range * 0.05);
  maxVal = Math.ceil(maxVal + range * 0.05);

  const getX = (index) => padding.left + (index / (timeline.length - 1)) * chartW;
  const getY = (val) => padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

  // Build points path
  const points = timeline.map((pt, idx) => `${getX(idx)},${getY(pt.balance)}`);
  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${getX(timeline.length - 1)},${getY(minVal)} L ${getX(0)},${getY(minVal)} Z`;

  // Safe buffer line
  const bufferY = getY(safeBuffer);

  // Y Axis ticks (4 ticks)
  const yTicks = [0, 0.33, 0.66, 1].map(ratio => {
    const val = minVal + ratio * (maxVal - minVal);
    return {
      val,
      y: getY(val),
      label: formatCompactCurrency(val)
    };
  });

  // X Axis ticks (5 evenly spaced date labels)
  const xTickIndices = [
    0,
    Math.floor(timeline.length * 0.25),
    Math.floor(timeline.length * 0.5),
    Math.floor(timeline.length * 0.75),
    timeline.length - 1
  ];
  const xTicks = xTickIndices.map(idx => ({
    x: getX(idx),
    label: formatDate(timeline[idx].date, 'short')
  }));

  // Unique ID for gradients
  const gradId = 'forecast_grad_' + Math.random().toString(36).substr(2, 5);

  return `
    <div class="svg-chart-wrapper forecast-chart-wrapper" style="width: 100%; overflow-x: auto;">
      <svg viewBox="0 0 ${width} ${height}" class="forecast-svg" style="width: 100%; height: auto; display: block;" data-points='${JSON.stringify(timeline.map((t, i) => ({ x: getX(i), y: getY(t.balance), date: t.date, balance: t.balance, formattedBalance: formatCurrency(t.balance), events: t.events })))}'>
        <defs>
          <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--accent-primary, #3b82f6)" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="var(--accent-primary, #3b82f6)" stop-opacity="0.0"/>
          </linearGradient>
        </defs>

        <!-- Horizontal Gridlines & Y Axis Labels -->
        ${yTicks.map(t => `
          <line x1="${padding.left}" y1="${t.y}" x2="${width - padding.right}" y2="${t.y}" stroke="var(--border-subtle)" stroke-dasharray="3 3" />
          <text x="${padding.left - 10}" y="${t.y + 4}" fill="var(--text-muted)" font-size="11" text-anchor="end" font-family="monospace">${t.label}</text>
        `).join('')}

        <!-- Safe Buffer Guideline -->
        ${safeBuffer >= minVal && safeBuffer <= maxVal ? `
          <line x1="${padding.left}" y1="${bufferY}" x2="${width - padding.right}" y2="${bufferY}" stroke="var(--warning, #f59e0b)" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.8" />
          <text x="${width - padding.right - 5}" y="${bufferY - 6}" fill="var(--warning, #f59e0b)" font-size="10" text-anchor="end" font-weight="600">Safe Buffer (${formatCurrency(safeBuffer, { hideDecimals: true })})</text>
        ` : ''}

        <!-- Area Fill -->
        <path d="${areaD}" fill="url(#${gradId})" />

        <!-- Line Stroke -->
        <path d="${pathD}" fill="none" stroke="var(--accent-primary, #3b82f6)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

        <!-- X Axis Labels -->
        ${xTicks.map(t => `
          <text x="${t.x}" y="${height - 12}" fill="var(--text-muted)" font-size="11" text-anchor="middle">${t.label}</text>
        `).join('')}

        <!-- Interactive Crosshair overlay elements (controlled via JS) -->
        <g class="chart-crosshair-group" style="display: none;">
          <line class="crosshair-line" x1="0" y1="${padding.top}" x2="0" y2="${height - padding.bottom}" stroke="var(--text-secondary)" stroke-width="1" stroke-dasharray="2 2" />
          <circle class="crosshair-dot" cx="0" cy="0" r="5" fill="var(--accent-primary)" stroke="var(--bg-surface)" stroke-width="2" />
        </g>
      </svg>
      <div class="forecast-tooltip" style="display: none; position: absolute; pointer-events: none; z-index: 10;"></div>
    </div>
  `;
}

/**
 * Generate Scenario Comparison Dual-Line Chart (Baseline vs Scenario)
 */
function renderScenarioComparisonChart({
  baselineTimeline = [],
  simulatedTimeline = [],
  width = 800,
  height = 280
}) {
  if (!baselineTimeline.length || !simulatedTimeline.length) {
    return `<div class="chart-empty-state"><p>No simulation data</p></div>`;
  }

  const padding = { top: 25, right: 30, bottom: 40, left: 65 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const allBalances = [
    ...baselineTimeline.map(t => t.balance),
    ...simulatedTimeline.map(t => t.balance)
  ];

  let minVal = Math.min(...allBalances, 0);
  let maxVal = Math.max(...allBalances);
  const range = maxVal - minVal || 1;
  minVal = Math.floor(minVal - range * 0.05);
  maxVal = Math.ceil(maxVal + range * 0.05);

  const getX = (index) => padding.left + (index / (baselineTimeline.length - 1)) * chartW;
  const getY = (val) => padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

  const basePoints = baselineTimeline.map((pt, idx) => `${getX(idx)},${getY(pt.balance)}`);
  const simPoints = simulatedTimeline.map((pt, idx) => `${getX(idx)},${getY(pt.balance)}`);

  const baseLineD = `M ${basePoints.join(' L ')}`;
  const simLineD = `M ${simPoints.join(' L ')}`;

  const yTicks = [0, 0.33, 0.66, 1].map(ratio => {
    const val = minVal + ratio * (maxVal - minVal);
    return { val, y: getY(val), label: formatCompactCurrency(val) };
  });

  const xTickIndices = [0, Math.floor(baselineTimeline.length * 0.5), baselineTimeline.length - 1];
  const xTicks = xTickIndices.map(idx => ({
    x: getX(idx),
    label: formatDate(baselineTimeline[idx].date, 'short')
  }));

  return `
    <div class="svg-chart-wrapper scenario-chart-wrapper" style="width: 100%; position: relative;">
      <div class="chart-legend-row" style="display: flex; gap: 16px; margin-bottom: 8px; font-size: 0.85rem;">
        <span style="display: inline-flex; align-items: center; gap: 6px;">
          <span style="width: 14px; height: 3px; background: var(--text-muted); border-radius: 2px;"></span>
          <span style="color: var(--text-secondary);">Current Plan (Baseline)</span>
        </span>
        <span style="display: inline-flex; align-items: center; gap: 6px;">
          <span style="width: 14px; height: 3px; background: var(--accent-emerald, #10b981); border-radius: 2px;"></span>
          <span style="color: var(--text-primary); font-weight: 600;">Simulated Scenario</span>
        </span>
      </div>

      <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: auto; display: block;">
        <!-- Gridlines -->
        ${yTicks.map(t => `
          <line x1="${padding.left}" y1="${t.y}" x2="${width - padding.right}" y2="${t.y}" stroke="var(--border-subtle)" stroke-dasharray="3 3" />
          <text x="${padding.left - 10}" y="${t.y + 4}" fill="var(--text-muted)" font-size="11" text-anchor="end">${t.label}</text>
        `).join('')}

        <!-- Baseline Path (Dashed/Subtle) -->
        <path d="${baseLineD}" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-dasharray="4 3" opacity="0.8" />

        <!-- Scenario Path (Vibrant Emerald) -->
        <path d="${simLineD}" fill="none" stroke="var(--accent-emerald, #10b981)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

        <!-- X Ticks -->
        ${xTicks.map(t => `
          <text x="${t.x}" y="${height - 12}" fill="var(--text-muted)" font-size="11" text-anchor="middle">${t.label}</text>
        `).join('')}
      </svg>
    </div>
  `;
}

/**
 * Generate Grouped Bar Chart for Monthly Income vs Expense
 */
function renderMonthlyTrendBars({
  trendData = [],
  width = 600,
  height = 220
}) {
  if (!trendData.length) {
    return `<div class="chart-empty-state"><p>No historical trend data</p></div>`;
  }

  const padding = { top: 20, right: 20, bottom: 35, left: 55 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(...trendData.map(d => Math.max(d.income, d.expense)), 1000) * 1.1;
  const getH = (val) => (val / maxVal) * chartH;

  const groupWidth = chartW / trendData.length;
  const barWidth = Math.min(22, (groupWidth - 12) / 2);

  const bars = trendData.map((d, idx) => {
    const groupX = padding.left + idx * groupWidth;
    const incomeH = getH(d.income);
    const expenseH = getH(d.expense);

    const incX = groupX + (groupWidth / 2) - barWidth - 2;
    const expX = groupX + (groupWidth / 2) + 2;

    const incY = padding.top + chartH - incomeH;
    const expY = padding.top + chartH - expenseH;

    return `
      <g class="bar-group" data-month="${d.label}">
        <!-- Income Bar -->
        <rect x="${incX}" y="${incY}" width="${barWidth}" height="${incomeH}" rx="3" fill="var(--accent-emerald, #10b981)">
          <title>${d.label} Income: ${formatCurrency(d.income)}</title>
        </rect>
        <!-- Expense Bar -->
        <rect x="${expX}" y="${expY}" width="${barWidth}" height="${expenseH}" rx="3" fill="var(--accent-rose, #f43f5e)">
          <title>${d.label} Spending: ${formatCurrency(d.expense)}</title>
        </rect>
        <!-- X Axis Label -->
        <text x="${groupX + groupWidth / 2}" y="${height - 12}" fill="var(--text-muted)" font-size="11" text-anchor="middle">${d.shortLabel}</text>
      </g>
    `;
  }).join('');

  return `
    <div class="svg-chart-wrapper monthly-bars-wrapper" style="width: 100%;">
      <div class="chart-legend-row" style="display: flex; gap: 16px; margin-bottom: 8px; font-size: 0.85rem;">
        <span style="display: inline-flex; align-items: center; gap: 6px;">
          <span style="width: 10px; height: 10px; background: var(--accent-emerald, #10b981); border-radius: 2px;"></span>
          <span style="color: var(--text-secondary);">Income</span>
        </span>
        <span style="display: inline-flex; align-items: center; gap: 6px;">
          <span style="width: 10px; height: 10px; background: var(--accent-rose, #f43f5e); border-radius: 2px;"></span>
          <span style="color: var(--text-secondary);">Expenses</span>
        </span>
      </div>

      <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: auto; display: block;">
        <line x1="${padding.left}" y1="${padding.top + chartH}" x2="${width - padding.right}" y2="${padding.top + chartH}" stroke="var(--border-subtle)" />
        ${bars}
      </svg>
    </div>
  `;
}

/**
 * Generate a Circular Goal Progress Ring
 */
function renderGoalProgressRing({
  percentage = 0,
  size = 56,
  strokeWidth = 5,
  color = '#10b981'
}) {
  const clamped = Math.min(100, Math.max(0, percentage));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const center = size / 2;

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform: rotate(-90deg);">
      <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="var(--border-subtle)" stroke-width="${strokeWidth}" />
      <circle
        cx="${center}"
        cy="${center}"
        r="${radius}"
        fill="none"
        stroke="${color}"
        stroke-width="${strokeWidth}"
        stroke-dasharray="${circumference}"
        stroke-dashoffset="${offset}"
        stroke-linecap="round"
        style="transition: stroke-dashoffset 0.4s ease;"
      />
    </svg>
  `;
}


/* --- MODULE: js/db.js --- */
/**
 * BudgetOS - IndexedDB Storage Engine & Demo Data Generator
 */


const DB_NAME = 'BudgetOS_Database';
const DB_VERSION = 1;

const STORES = {
  ACCOUNTS: 'accounts',
  CATEGORIES: 'categories',
  TRANSACTIONS: 'transactions',
  BUDGETS: 'budgets',
  GOALS: 'goals',
  RECURRING: 'recurring',
  SETTINGS: 'settings'
};

let dbInstance = null;

/**
 * Open or initialize the IndexedDB database
 */
async function initDB() {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Accounts Store
      if (!db.objectStoreNames.contains(STORES.ACCOUNTS)) {
        const accStore = db.createObjectStore(STORES.ACCOUNTS, { keyPath: 'id' });
        accStore.createIndex('type', 'type', { unique: false });
        accStore.createIndex('isArchived', 'isArchived', { unique: false });
      }

      // Categories Store
      if (!db.objectStoreNames.contains(STORES.CATEGORIES)) {
        const catStore = db.createObjectStore(STORES.CATEGORIES, { keyPath: 'id' });
        catStore.createIndex('type', 'type', { unique: false });
      }

      // Transactions Store
      if (!db.objectStoreNames.contains(STORES.TRANSACTIONS)) {
        const txStore = db.createObjectStore(STORES.TRANSACTIONS, { keyPath: 'id' });
        txStore.createIndex('date', 'date', { unique: false });
        txStore.createIndex('accountId', 'accountId', { unique: false });
        txStore.createIndex('categoryId', 'categoryId', { unique: false });
        txStore.createIndex('type', 'type', { unique: false });
      }

      // Budgets Store (Compound or single ID key)
      if (!db.objectStoreNames.contains(STORES.BUDGETS)) {
        const bgStore = db.createObjectStore(STORES.BUDGETS, { keyPath: 'id' });
        bgStore.createIndex('monthKey', 'monthKey', { unique: false });
        bgStore.createIndex('categoryId', 'categoryId', { unique: false });
        bgStore.createIndex('month_category', ['monthKey', 'categoryId'], { unique: true });
      }

      // Goals Store
      if (!db.objectStoreNames.contains(STORES.GOALS)) {
        const goalStore = db.createObjectStore(STORES.GOALS, { keyPath: 'id' });
        goalStore.createIndex('isCompleted', 'isCompleted', { unique: false });
      }

      // Recurring Store
      if (!db.objectStoreNames.contains(STORES.RECURRING)) {
        const recStore = db.createObjectStore(STORES.RECURRING, { keyPath: 'id' });
        recStore.createIndex('nextDueDate', 'nextDueDate', { unique: false });
        recStore.createIndex('isPaused', 'isPaused', { unique: false });
      }

      // Settings Store
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
      }
    };

    request.onsuccess = async (event) => {
      dbInstance = event.target.result;
      // Check if default categories or settings are initialized
      await ensureDefaults();
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.error('IndexedDB opening error:', event.target.error);
      reject(event.target.error);
    };
  });
}

/**
 * Generic transactional database helper
 */
function getTxStore(storeName, mode = 'readonly') {
  if (!dbInstance) throw new Error('Database not initialized');
  const tx = dbInstance.transaction(storeName, mode);
  return tx.objectStore(storeName);
}

/**
 * Generic CRUD methods
 */
async function getAll(storeName) {
  await initDB();
  return new Promise((resolve, reject) => {
    const store = getTxStore(storeName, 'readonly');
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function getById(storeName, id) {
  await initDB();
  return new Promise((resolve, reject) => {
    const store = getTxStore(storeName, 'readonly');
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

async function putItem(storeName, item) {
  await initDB();
  return new Promise((resolve, reject) => {
    const store = getTxStore(storeName, 'readwrite');
    const req = store.put(item);
    req.onsuccess = () => resolve(item);
    req.onerror = () => reject(req.error);
  });
}

async function putBatch(storeName, items) {
  await initDB();
  return new Promise((resolve, reject) => {
    const tx = dbInstance.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    items.forEach(item => store.put(item));
    tx.oncomplete = () => resolve(items);
    tx.onerror = () => reject(tx.error);
  });
}

async function deleteItem(storeName, id) {
  await initDB();
  return new Promise((resolve, reject) => {
    const store = getTxStore(storeName, 'readwrite');
    const req = store.delete(id);
    req.onsuccess = () => resolve(id);
    req.onerror = () => reject(req.error);
  });
}

async function clearStore(storeName) {
  await initDB();
  return new Promise((resolve, reject) => {
    const store = getTxStore(storeName, 'readwrite');
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/**
 * Settings helpers
 */
async function getSetting(key, defaultValue = null) {
  const setting = await getById(STORES.SETTINGS, key);
  return setting ? setting.value : defaultValue;
}

async function setSetting(key, value) {
  return await putItem(STORES.SETTINGS, { key, value, updatedAt: new Date().toISOString() });
}

/**
 * Default Category Definitions
 */
const DEFAULT_CATEGORIES = [
  { id: 'cat_salary', name: 'Salary & Wages', type: 'income', color: '#10b981', icon: 'salary', isDefault: true },
  { id: 'cat_invest_inc', name: 'Investments & Dividends', type: 'income', color: '#059669', icon: 'investment', isDefault: true },
  { id: 'cat_freelance', name: 'Freelance & Side Income', type: 'income', color: '#34d399', icon: 'sparkles', isDefault: true },
  { id: 'cat_other_inc', name: 'Other Income', type: 'income', color: '#6ee7b7', icon: 'plus', isDefault: true },

  { id: 'cat_housing', name: 'Housing & Rent', type: 'expense', color: '#6366f1', icon: 'housing', isDefault: true },
  { id: 'cat_utilities', name: 'Utilities & Bills', type: 'expense', color: '#8b5cf6', icon: 'utilities', isDefault: true },
  { id: 'cat_groceries', name: 'Groceries & Supermarket', type: 'expense', color: '#f59e0b', icon: 'groceries', isDefault: true },
  { id: 'cat_dining', name: 'Dining Out & Coffee', type: 'expense', color: '#f97316', icon: 'food', isDefault: true },
  { id: 'cat_transport', name: 'Transportation & Fuel', type: 'expense', color: '#06b6d4', icon: 'transport', isDefault: true },
  { id: 'cat_health', name: 'Healthcare & Fitness', type: 'expense', color: '#ec4899', icon: 'health', isDefault: true },
  { id: 'cat_entertainment', name: 'Entertainment & Subs', type: 'expense', color: '#a855f7', icon: 'entertainment', isDefault: true },
  { id: 'cat_shopping', name: 'Shopping & Personal', type: 'expense', color: '#e11d48', icon: 'shopping', isDefault: true },
  { id: 'cat_misc', name: 'Miscellaneous', type: 'expense', color: '#64748b', icon: 'tag', isDefault: true }
];

/**
 * Ensure default categories & initial settings exist
 */
async function ensureDefaults() {
  const existingCats = await getAll(STORES.CATEGORIES);
  if (existingCats.length === 0) {
    await putBatch(STORES.CATEGORIES, DEFAULT_CATEGORIES);
  }

  const existingTheme = await getSetting('theme');
  if (!existingTheme) {
    await setSetting('theme', 'dark');
  }

  const existingCurrency = await getSetting('currency');
  if (!existingCurrency) {
    await setSetting('currency', 'USD');
  }
}

/**
 * Generate a realistic demo dataset with 90-day history
 */
async function seedDemoData() {
  const today = getTodayISO();
  const currentMonthKey = getMonthKey();
  const lastMonthKey = getMonthKey(addMonths(today, -1));

  // 1. Accounts
  const demoAccounts = [
    {
      id: 'acc_checking',
      name: 'Primary Checking',
      type: 'checking',
      initialBalance: 3200.00,
      color: '#3b82f6',
      icon: 'bank',
      creditLimit: 0,
      isArchived: false,
      notes: 'Main payroll and bill payment account'
    },
    {
      id: 'acc_savings',
      name: 'High-Yield Savings',
      type: 'savings',
      initialBalance: 12500.00,
      color: '#10b981',
      icon: 'shield',
      creditLimit: 0,
      isArchived: false,
      notes: 'Emergency fund at 4.5% APY'
    },
    {
      id: 'acc_credit',
      name: 'Sapphire Preferred Card',
      type: 'creditCard',
      initialBalance: 0,
      color: '#f43f5e',
      icon: 'creditCard',
      creditLimit: 10000.00,
      isArchived: false,
      notes: 'Everyday dining, travel, and online purchases'
    },
    {
      id: 'acc_cash',
      name: 'Physical Cash Wallet',
      type: 'cash',
      initialBalance: 140.00,
      color: '#eab308',
      icon: 'cash',
      creditLimit: 0,
      isArchived: false,
      notes: 'Pocket cash'
    }
  ];

  // 2. Budgets for current and last month
  const demoBudgets = [
    { id: `bg_${currentMonthKey}_housing`, monthKey: currentMonthKey, categoryId: 'cat_housing', amount: 1600 },
    { id: `bg_${currentMonthKey}_groceries`, monthKey: currentMonthKey, categoryId: 'cat_groceries', amount: 550 },
    { id: `bg_${currentMonthKey}_dining`, monthKey: currentMonthKey, categoryId: 'cat_dining', amount: 350 },
    { id: `bg_${currentMonthKey}_utilities`, monthKey: currentMonthKey, categoryId: 'cat_utilities', amount: 220 },
    { id: `bg_${currentMonthKey}_transport`, monthKey: currentMonthKey, categoryId: 'cat_transport', amount: 200 },
    { id: `bg_${currentMonthKey}_entertainment`, monthKey: currentMonthKey, categoryId: 'cat_entertainment', amount: 180 },
    { id: `bg_${currentMonthKey}_shopping`, monthKey: currentMonthKey, categoryId: 'cat_shopping', amount: 250 },
    { id: `bg_${currentMonthKey}_health`, monthKey: currentMonthKey, categoryId: 'cat_health', amount: 120 },

    { id: `bg_${lastMonthKey}_housing`, monthKey: lastMonthKey, categoryId: 'cat_housing', amount: 1600 },
    { id: `bg_${lastMonthKey}_groceries`, monthKey: lastMonthKey, categoryId: 'cat_groceries', amount: 550 },
    { id: `bg_${lastMonthKey}_dining`, monthKey: lastMonthKey, categoryId: 'cat_dining', amount: 350 },
    { id: `bg_${lastMonthKey}_utilities`, monthKey: lastMonthKey, categoryId: 'cat_utilities', amount: 220 }
  ];

  // 3. Goals
  const demoGoals = [
    {
      id: 'goal_emergency',
      name: '6-Month Emergency Cushion',
      targetAmount: 18000,
      currentAmount: 12500,
      targetDate: addMonths(today, 10),
      monthlyContribution: 550,
      color: '#10b981',
      icon: 'shield',
      accountId: 'acc_savings',
      isCompleted: false,
      notes: 'Liquid reserve covering 6 months of baseline living expenses'
    },
    {
      id: 'goal_vacation',
      name: 'Japan Autumn Trip',
      targetAmount: 4200,
      currentAmount: 2400,
      targetDate: addMonths(today, 6),
      monthlyContribution: 300,
      color: '#6366f1',
      icon: 'sparkles',
      accountId: 'acc_savings',
      isCompleted: false,
      notes: 'Flights, ryokan stays, and rail passes'
    },
    {
      id: 'goal_gear',
      name: 'M4 Workstation Upgrade',
      targetAmount: 2800,
      currentAmount: 1900,
      targetDate: addMonths(today, 3),
      monthlyContribution: 300,
      color: '#f59e0b',
      icon: 'shopping',
      accountId: 'acc_checking',
      isCompleted: false,
      notes: 'Productivity hardware refresh'
    }
  ];

  // 4. Recurring rules
  const demoRecurring = [
    {
      id: 'rec_salary',
      name: 'Bi-weekly Direct Deposit (Acme Corp)',
      amount: 2850.00,
      type: 'income',
      categoryId: 'cat_salary',
      accountId: 'acc_checking',
      frequency: 'biweekly',
      startDate: addDays(today, -60),
      nextDueDate: addDays(today, 5),
      autoPost: true,
      isPaused: false
    },
    {
      id: 'rec_rent',
      name: 'Apartment Monthly Rent',
      amount: 1550.00,
      type: 'expense',
      categoryId: 'cat_housing',
      accountId: 'acc_checking',
      frequency: 'monthly',
      startDate: addDays(today, -90),
      nextDueDate: addDays(today, 4),
      autoPost: true,
      isPaused: false
    },
    {
      id: 'rec_fiber',
      name: 'Gigabit Fiber Internet',
      amount: 70.00,
      type: 'expense',
      categoryId: 'cat_utilities',
      accountId: 'acc_checking',
      frequency: 'monthly',
      startDate: addDays(today, -90),
      nextDueDate: addDays(today, 12),
      autoPost: true,
      isPaused: false
    },
    {
      id: 'rec_gym',
      name: 'Equinox Gym Membership',
      amount: 120.00,
      type: 'expense',
      categoryId: 'cat_health',
      accountId: 'acc_credit',
      frequency: 'monthly',
      startDate: addDays(today, -90),
      nextDueDate: addDays(today, 15),
      autoPost: true,
      isPaused: false
    },
    {
      id: 'rec_spotify',
      name: 'Spotify Family Subscription',
      amount: 19.99,
      type: 'expense',
      categoryId: 'cat_entertainment',
      accountId: 'acc_credit',
      frequency: 'monthly',
      startDate: addDays(today, -90),
      nextDueDate: addDays(today, 8),
      autoPost: true,
      isPaused: false
    },
    {
      id: 'rec_save_transfer',
      name: 'Automated Emergency Fund Transfer',
      amount: 400.00,
      type: 'transfer',
      categoryId: 'cat_salary',
      accountId: 'acc_checking',
      toAccountId: 'acc_savings',
      frequency: 'monthly',
      startDate: addDays(today, -90),
      nextDueDate: addDays(today, 6),
      autoPost: true,
      isPaused: false
    }
  ];

  // 5. Historical Transactions across 75 days
  const demoTransactions = [];

  // Paychecks
  [-70, -56, -42, -28, -14, 0].forEach((offset, idx) => {
    demoTransactions.push({
      id: `tx_pay_${idx}`,
      date: addDays(today, offset),
      description: 'Acme Corp Bi-Weekly Payroll',
      merchant: 'Acme Corp',
      amount: 2850.00,
      categoryId: 'cat_salary',
      accountId: 'acc_checking',
      type: 'income',
      notes: 'Direct deposit net pay',
      isCleared: true
    });
  });

  // Freelance income
  demoTransactions.push(
    {
      id: 'tx_fl_1',
      date: addDays(today, -45),
      description: 'Frontend Consulting Sprint',
      merchant: 'Studio Pixel Inc',
      amount: 1200.00,
      categoryId: 'cat_freelance',
      accountId: 'acc_checking',
      type: 'income',
      notes: 'Milestone 2 delivery',
      isCleared: true
    },
    {
      id: 'tx_fl_2',
      date: addDays(today, -12),
      description: 'UI Design Audit',
      merchant: 'HyperFlow Ltd',
      amount: 850.00,
      categoryId: 'cat_freelance',
      accountId: 'acc_checking',
      type: 'income',
      notes: 'App usability review',
      isCleared: true
    }
  );

  // Rents
  [-60, -30, -1].forEach((offset, idx) => {
    demoTransactions.push({
      id: `tx_rent_${idx}`,
      date: addDays(today, offset),
      description: 'Monthly Apartment Lease',
      merchant: 'Skyline Properties',
      amount: 1550.00,
      categoryId: 'cat_housing',
      accountId: 'acc_checking',
      type: 'expense',
      notes: 'ACH payment rent',
      isCleared: true
    });
  });

  // Utilities & Internet
  [-58, -27, -5].forEach((offset, idx) => {
    demoTransactions.push({
      id: `tx_util_${idx}`,
      date: addDays(today, offset),
      description: 'City Power & Electric',
      merchant: 'City Power Corp',
      amount: 94.30 + idx * 8,
      categoryId: 'cat_utilities',
      accountId: 'acc_checking',
      type: 'expense',
      notes: 'Electric bill',
      isCleared: true
    });
    demoTransactions.push({
      id: `tx_fiber_${idx}`,
      date: addDays(today, offset + 2),
      description: 'Fiber Gigabit Internet',
      merchant: 'Metro Fiber',
      amount: 70.00,
      categoryId: 'cat_utilities',
      accountId: 'acc_checking',
      type: 'expense',
      notes: 'Autopay',
      isCleared: true
    });
  });

  // Groceries (Regular cadence)
  const groceryVendors = [
    { name: 'Whole Foods Market', cat: 'cat_groceries', avg: 115 },
    { name: 'Trader Joe\'s', cat: 'cat_groceries', avg: 78 },
    { name: 'Costco Wholesale', cat: 'cat_groceries', avg: 210 },
    { name: 'Local Farmers Market', cat: 'cat_groceries', avg: 45 }
  ];

  [-68, -62, -55, -48, -41, -34, -26, -20, -15, -9, -3].forEach((offset, idx) => {
    const v = groceryVendors[idx % groceryVendors.length];
    const amount = +(v.avg + (Math.sin(idx) * 15)).toFixed(2);
    demoTransactions.push({
      id: `tx_groc_${idx}`,
      date: addDays(today, offset),
      description: `Groceries at ${v.name}`,
      merchant: v.name,
      amount: amount,
      categoryId: v.cat,
      accountId: idx % 2 === 0 ? 'acc_credit' : 'acc_checking',
      type: 'expense',
      notes: 'Weekly pantry & fresh produce',
      isCleared: true
    });
  });

  // Dining Out & Cafes
  const diningList = [
    { name: 'Blue Bottle Coffee', amt: 6.75, note: 'Morning pour-over' },
    { name: 'Chipotle Mexican Grill', amt: 15.40, note: 'Burrito bowl lunch' },
    { name: 'Osteria Rustica', amt: 84.50, note: 'Dinner with friends' },
    { name: 'Ramen Tatsuya', amt: 32.00, note: 'Tonkotsu ramen dinner' },
    { name: 'Sweetgreen', amt: 17.20, note: 'Salad lunch' },
    { name: 'Tartine Bakery', amt: 18.50, note: 'Pastries & espresso' },
    { name: 'Sushi Kaji', amt: 98.00, note: 'Omakase dinner' }
  ];

  [-65, -59, -51, -44, -38, -31, -24, -18, -11, -7, -4, -1].forEach((offset, idx) => {
    const d = diningList[idx % diningList.length];
    demoTransactions.push({
      id: `tx_din_${idx}`,
      date: addDays(today, offset),
      description: d.name,
      merchant: d.name,
      amount: d.amt,
      categoryId: 'cat_dining',
      accountId: 'acc_credit',
      type: 'expense',
      notes: d.note,
      isCleared: true
    });
  });

  // Transportation & Fuel
  [-64, -46, -29, -10].forEach((offset, idx) => {
    demoTransactions.push({
      id: `tx_fuel_${idx}`,
      date: addDays(today, offset),
      description: 'Chevron Fuel Station',
      merchant: 'Chevron',
      amount: +(48.50 + idx * 3).toFixed(2),
      categoryId: 'cat_transport',
      accountId: 'acc_credit',
      type: 'expense',
      notes: 'Gas fill-up',
      isCleared: true
    });
  });

  // Healthcare, Gym, Entertainment
  [-60, -30, -2].forEach((offset, idx) => {
    demoTransactions.push({
      id: `tx_gym_${idx}`,
      date: addDays(today, offset),
      description: 'Equinox Gym Membership',
      merchant: 'Equinox',
      amount: 120.00,
      categoryId: 'cat_health',
      accountId: 'acc_credit',
      type: 'expense',
      notes: 'Monthly club access',
      isCleared: true
    });
    demoTransactions.push({
      id: `tx_sub_${idx}`,
      date: addDays(today, offset + 5),
      description: 'Spotify Family Subscription',
      merchant: 'Spotify',
      amount: 19.99,
      categoryId: 'cat_entertainment',
      accountId: 'acc_credit',
      type: 'expense',
      notes: 'Music streaming',
      isCleared: true
    });
  });

  // Shopping & Anomaly Example (e.g. 1 big electronic purchase)
  demoTransactions.push(
    {
      id: 'tx_shop_1',
      date: addDays(today, -35),
      description: 'Uniqlo Casual Basics',
      merchant: 'Uniqlo',
      amount: 86.40,
      categoryId: 'cat_shopping',
      accountId: 'acc_credit',
      type: 'expense',
      notes: 'Tees & socks',
      isCleared: true
    },
    {
      id: 'tx_shop_anomaly',
      date: addDays(today, -8),
      description: 'Apple Store 4K Display',
      merchant: 'Apple Store',
      amount: 899.00, // Noticeably larger than standard shopping — anomaly trigger
      categoryId: 'cat_shopping',
      accountId: 'acc_credit',
      type: 'expense',
      notes: 'Studio display purchase for desk setup',
      isCleared: true
    }
  );

  // Transfers from checking to savings
  [-55, -25, -2].forEach((offset, idx) => {
    demoTransactions.push({
      id: `tx_tr_${idx}`,
      date: addDays(today, offset),
      description: 'Monthly Savings Deposit',
      merchant: 'Internal Transfer',
      amount: 400.00,
      categoryId: 'cat_salary',
      accountId: 'acc_checking',
      toAccountId: 'acc_savings',
      type: 'transfer',
      notes: 'Emergency fund transfer',
      isCleared: true
    });
  });

  // Save all items to stores
  await clearStore(STORES.ACCOUNTS);
  await clearStore(STORES.BUDGETS);
  await clearStore(STORES.GOALS);
  await clearStore(STORES.RECURRING);
  await clearStore(STORES.TRANSACTIONS);

  await putBatch(STORES.ACCOUNTS, demoAccounts);
  await putBatch(STORES.BUDGETS, demoBudgets);
  await putBatch(STORES.GOALS, demoGoals);
  await putBatch(STORES.RECURRING, demoRecurring);
  await putBatch(STORES.TRANSACTIONS, demoTransactions);

  return {
    accounts: demoAccounts.length,
    transactions: demoTransactions.length,
    budgets: demoBudgets.length,
    goals: demoGoals.length,
    recurring: demoRecurring.length
  };
}

/**
 * Export complete database as JSON
 */
async function exportAllData() {
  const accounts = await getAll(STORES.ACCOUNTS);
  const categories = await getAll(STORES.CATEGORIES);
  const transactions = await getAll(STORES.TRANSACTIONS);
  const budgets = await getAll(STORES.BUDGETS);
  const goals = await getAll(STORES.GOALS);
  const recurring = await getAll(STORES.RECURRING);
  const settings = await getAll(STORES.SETTINGS);

  return {
    app: 'BudgetOS',
    version: 1,
    exportedAt: new Date().toISOString(),
    data: {
      accounts,
      categories,
      transactions,
      budgets,
      goals,
      recurring,
      settings
    }
  };
}

/**
 * Import complete database from JSON
 */
async function importAllData(payload) {
  if (!payload || !payload.data) {
    throw new Error('Invalid BudgetOS backup format');
  }

  const { accounts, categories, transactions, budgets, goals, recurring, settings } = payload.data;

  if (accounts) {
    await clearStore(STORES.ACCOUNTS);
    await putBatch(STORES.ACCOUNTS, accounts);
  }
  if (categories) {
    await clearStore(STORES.CATEGORIES);
    await putBatch(STORES.CATEGORIES, categories);
  }
  if (transactions) {
    await clearStore(STORES.TRANSACTIONS);
    await putBatch(STORES.TRANSACTIONS, transactions);
  }
  if (budgets) {
    await clearStore(STORES.BUDGETS);
    await putBatch(STORES.BUDGETS, budgets);
  }
  if (goals) {
    await clearStore(STORES.GOALS);
    await putBatch(STORES.GOALS, goals);
  }
  if (recurring) {
    await clearStore(STORES.RECURRING);
    await putBatch(STORES.RECURRING, recurring);
  }
  if (settings) {
    await clearStore(STORES.SETTINGS);
    await putBatch(STORES.SETTINGS, settings);
  }

  return true;
}

/**
 * Reset all user data back to clean state
 */
async function resetAllData() {
  await clearStore(STORES.ACCOUNTS);
  await clearStore(STORES.TRANSACTIONS);
  await clearStore(STORES.BUDGETS);
  await clearStore(STORES.GOALS);
  await clearStore(STORES.RECURRING);
  await clearStore(STORES.CATEGORIES);
  await ensureDefaults();
}



/* --- MODULE: js/state.js --- */
/**
 * BudgetOS - Central Reactive State Store & Undo Manager
 */


class StateStore {
  constructor() {
    this.accounts = [];
    this.categories = [];
    this.transactions = [];
    this.budgets = [];
    this.goals = [];
    this.recurring = [];
    this.settings = {};
    
    this.activeView = 'dashboard';
    this.selectedMonthKey = null; // defaults to current month
    this.isLoaded = false;
    
    this.listeners = new Map();
    this.undoStack = [];
    this.maxUndoStack = 10;
  }

  /**
   * Subscribe to state change events
   * @param {string} event - event name or '*' for all
   * @param {Function} callback
   */
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.listeners.get(event)?.delete(callback);
  }

  /**
   * Emit an event to subscribers
   */
  notify(event, payload = {}) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => cb(payload, this));
    }
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach(cb => cb({ event, payload }, this));
    }
  }

  /**
   * Load all data from IndexedDB into memory
   */
  async loadFromDB() {
    try {
      this.accounts = await DB.getAll(DB.STORES.ACCOUNTS);
      this.categories = await DB.getAll(DB.STORES.CATEGORIES);
      this.transactions = await DB.getAll(DB.STORES.TRANSACTIONS);
      this.budgets = await DB.getAll(DB.STORES.BUDGETS);
      this.goals = await DB.getAll(DB.STORES.GOALS);
      this.recurring = await DB.getAll(DB.STORES.RECURRING);
      
      const settingsList = await DB.getAll(DB.STORES.SETTINGS);
      this.settings = {};
      settingsList.forEach(s => { this.settings[s.key] = s.value; });

      // Apply currency config
      if (this.settings.currency) {
        setCurrencyConfig(this.settings.currency);
      }

      this.isLoaded = true;
      this.notify('DATA_LOADED');
    } catch (err) {
      console.error('Failed to load state from IndexedDB:', err);
    }
  }

  // --- Transactions Actions ---
  async addTransaction(tx) {
    await DB.putItem(DB.STORES.TRANSACTIONS, tx);
    this.transactions.unshift(tx);
    this.notify('TRANSACTION_ADDED', tx);
    this.notify('STATE_UPDATED');
    return tx;
  }

  async updateTransaction(tx) {
    const prev = this.transactions.find(t => t.id === tx.id);
    await DB.putItem(DB.STORES.TRANSACTIONS, tx);
    const idx = this.transactions.findIndex(t => t.id === tx.id);
    if (idx !== -1) {
      this.transactions[idx] = tx;
    }
    if (prev) {
      this.pushUndoAction({
        type: 'UPDATE_TRANSACTION',
        description: `Edit transaction "${tx.description}"`,
        undo: async () => {
          await DB.putItem(DB.STORES.TRANSACTIONS, prev);
          const i = this.transactions.findIndex(t => t.id === prev.id);
          if (i !== -1) this.transactions[i] = prev;
          this.notify('STATE_UPDATED');
        }
      });
    }
    this.notify('TRANSACTION_UPDATED', tx);
    this.notify('STATE_UPDATED');
    return tx;
  }

  async deleteTransaction(txId) {
    const tx = this.transactions.find(t => t.id === txId);
    if (!tx) return;

    await DB.deleteItem(DB.STORES.TRANSACTIONS, txId);
    this.transactions = this.transactions.filter(t => t.id !== txId);

    this.pushUndoAction({
      type: 'DELETE_TRANSACTION',
      description: `Delete transaction "${tx.description}"`,
      undo: async () => {
        await DB.putItem(DB.STORES.TRANSACTIONS, tx);
        this.transactions.push(tx);
        this.notify('TRANSACTION_ADDED', tx);
        this.notify('STATE_UPDATED');
      }
    });

    this.notify('TRANSACTION_DELETED', { id: txId });
    this.notify('STATE_UPDATED');
  }

  // --- Accounts Actions ---
  async saveAccount(acc) {
    await DB.putItem(DB.STORES.ACCOUNTS, acc);
    const idx = this.accounts.findIndex(a => a.id === acc.id);
    if (idx !== -1) {
      this.accounts[idx] = acc;
    } else {
      this.accounts.push(acc);
    }
    this.notify('ACCOUNT_SAVED', acc);
    this.notify('STATE_UPDATED');
    return acc;
  }

  async deleteAccount(accId) {
    const acc = this.accounts.find(a => a.id === accId);
    if (!acc) return;

    await DB.deleteItem(DB.STORES.ACCOUNTS, accId);
    this.accounts = this.accounts.filter(a => a.id !== accId);

    this.pushUndoAction({
      type: 'DELETE_ACCOUNT',
      description: `Delete account "${acc.name}"`,
      undo: async () => {
        await DB.putItem(DB.STORES.ACCOUNTS, acc);
        this.accounts.push(acc);
        this.notify('ACCOUNT_SAVED', acc);
        this.notify('STATE_UPDATED');
      }
    });

    this.notify('ACCOUNT_DELETED', { id: accId });
    this.notify('STATE_UPDATED');
  }

  // --- Budgets Actions ---
  async saveBudget(budget) {
    await DB.putItem(DB.STORES.BUDGETS, budget);
    const idx = this.budgets.findIndex(b => b.id === budget.id || (b.monthKey === budget.monthKey && b.categoryId === budget.categoryId));
    if (idx !== -1) {
      this.budgets[idx] = budget;
    } else {
      this.budgets.push(budget);
    }
    this.notify('BUDGET_SAVED', budget);
    this.notify('STATE_UPDATED');
    return budget;
  }

  async copyBudgetsFromMonth(fromMonthKey, toMonthKey) {
    const sourceBudgets = this.budgets.filter(b => b.monthKey === fromMonthKey);
    const newBudgets = sourceBudgets.map(b => ({
      ...b,
      id: `bg_${toMonthKey}_${b.categoryId}`,
      monthKey: toMonthKey
    }));
    await DB.putBatch(DB.STORES.BUDGETS, newBudgets);
    await this.loadFromDB();
    this.notify('BUDGETS_COPIED');
    this.notify('STATE_UPDATED');
  }

  // --- Goals Actions ---
  async saveGoal(goal) {
    await DB.putItem(DB.STORES.GOALS, goal);
    const idx = this.goals.findIndex(g => g.id === goal.id);
    if (idx !== -1) {
      this.goals[idx] = goal;
    } else {
      this.goals.push(goal);
    }
    this.notify('GOAL_SAVED', goal);
    this.notify('STATE_UPDATED');
    return goal;
  }

  async deleteGoal(goalId) {
    const goal = this.goals.find(g => g.id === goalId);
    if (!goal) return;

    await DB.deleteItem(DB.STORES.GOALS, goalId);
    this.goals = this.goals.filter(g => g.id !== goalId);

    this.pushUndoAction({
      type: 'DELETE_GOAL',
      description: `Delete goal "${goal.name}"`,
      undo: async () => {
        await DB.putItem(DB.STORES.GOALS, goal);
        this.goals.push(goal);
        this.notify('GOAL_SAVED', goal);
        this.notify('STATE_UPDATED');
      }
    });

    this.notify('GOAL_DELETED', { id: goalId });
    this.notify('STATE_UPDATED');
  }

  // --- Recurring Rules Actions ---
  async saveRecurring(rule) {
    await DB.putItem(DB.STORES.RECURRING, rule);
    const idx = this.recurring.findIndex(r => r.id === rule.id);
    if (idx !== -1) {
      this.recurring[idx] = rule;
    } else {
      this.recurring.push(rule);
    }
    this.notify('RECURRING_SAVED', rule);
    this.notify('STATE_UPDATED');
    return rule;
  }

  async deleteRecurring(ruleId) {
    const rule = this.recurring.find(r => r.id === ruleId);
    if (!rule) return;

    await DB.deleteItem(DB.STORES.RECURRING, ruleId);
    this.recurring = this.recurring.filter(r => r.id !== ruleId);

    this.pushUndoAction({
      type: 'DELETE_RECURRING',
      description: `Delete recurring "${rule.name}"`,
      undo: async () => {
        await DB.putItem(DB.STORES.RECURRING, rule);
        this.recurring.push(rule);
        this.notify('RECURRING_SAVED', rule);
        this.notify('STATE_UPDATED');
      }
    });

    this.notify('RECURRING_DELETED', { id: ruleId });
    this.notify('STATE_UPDATED');
  }

  // --- Settings Actions ---
  async saveSetting(key, value) {
    await DB.setSetting(key, value);
    this.settings[key] = value;
    if (key === 'currency') {
      setCurrencyConfig(value);
    }
    this.notify('SETTING_CHANGED', { key, value });
    this.notify('STATE_UPDATED');
  }

  // --- Undo System ---
  pushUndoAction(action) {
    this.undoStack.unshift({
      ...action,
      timestamp: Date.now()
    });
    if (this.undoStack.length > this.maxUndoStack) {
      this.undoStack.pop();
    }
    this.notify('UNDO_AVAILABLE', { action: this.undoStack[0] });
  }

  async executeUndo() {
    if (this.undoStack.length === 0) return null;
    const action = this.undoStack.shift();
    if (action && typeof action.undo === 'function') {
      await action.undo();
      this.notify('UNDO_EXECUTED', { action });
      return action;
    }
    return null;
  }
}

const state = new StateStore();
state;


/* --- MODULE: js/views/dashboard.js --- */
/**
 * BudgetOS - Dashboard View Controller
 * Presents high-signal financial overview: Net Worth, Monthly Cash Flow,
 * Savings Rate, Budget Health, Upcoming Bills, and Spending Anomalies.
 */


function renderDashboardView(container) {
  const { accounts, transactions, budgets, categories, recurring, goals } = state;
  const currentMonthKey = getMonthKey();

  // 1. Calculations
  const balanceData = calculateAccountBalances(accounts, transactions);
  const budgetData = calculateBudgetPerformance(currentMonthKey, budgets, categories, transactions);
  const anomalies = detectSpendingAnomalies(transactions, categories);
  const monthlyTrends = getMonthlyTrends(transactions, 2);
  const currentMonthTrend = monthlyTrends[monthlyTrends.length - 1] || { income: 0, expense: 0, netSavings: 0, savingsRate: 0 };
  
  // Forecast mini preview (30 days)
  const forecastPreview = generateCashFlowForecast({
    horizonDays: 30,
    accounts,
    transactions,
    recurring,
    safeBuffer: 500
  });

  // Recent transactions (last 6)
  const recentTransactions = [...transactions]
    .sort((a, b) => (b.date > a.date ? 1 : -1))
    .slice(0, 6);

  // Upcoming bills in next 14 days
  const today = new Date().toISOString().split('T')[0];
  const upcomingBills = recurring
    .filter(r => !r.isPaused && r.type === 'expense' && r.nextDueDate >= today)
    .sort((a, b) => (a.nextDueDate > b.nextDueDate ? 1 : -1))
    .slice(0, 4);

  // Category map for quick lookup
  const catMap = {};
  categories.forEach(c => { catMap[c.id] = c; });
  const accMap = balanceData.accounts;

  // Build HTML
  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">Financial Dashboard</h1>
        <p class="view-subtitle">${formatMonthKey(currentMonthKey)} Overview &bull; Deterministic Cash Engine</p>
      </div>
      <div class="view-actions">
        <button class="btn btn-secondary" id="btn-quick-import">
          ${getIcon('upload', 'icon-sm')} Import CSV
        </button>
        <button class="btn btn-primary" id="btn-quick-transaction">
          ${getIcon('plus', 'icon-sm')} New Transaction
        </button>
      </div>
    </div>

    <!-- Anomaly Alert Banner (Heuristic Check) -->
    ${anomalies.length > 0 ? `
      <div class="anomaly-banner alert alert-warning">
        <div class="alert-icon">${getIcon('alert', 'icon-md')}</div>
        <div class="alert-content">
          <div class="alert-title">Spending Anomaly Detected (${anomalies.length})</div>
          <p class="alert-desc">${anomalies[0].confidenceNote}</p>
        </div>
        <button class="btn btn-sm btn-outline-warning" id="btn-view-anomalies">Review</button>
      </div>
    ` : ''}

    <!-- High Signal Metric Cards Grid (Prompt 10B: Restrained, Meaningful KPI Cards) -->
    <div class="metrics-grid">
      <!-- Net Worth -->
      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Net Worth</span>
          <span class="metric-icon-badge">${getIcon('shield', 'icon-sm')}</span>
        </div>
        <div class="metric-value ${balanceData.summary.netWorth >= 0 ? 'text-primary' : 'text-danger'}">
          ${formatCurrency(balanceData.summary.netWorth)}
        </div>
        <div class="metric-meta">
          <span>Assets: <strong class="text-emerald">${formatCurrency(balanceData.summary.totalAssets, { hideDecimals: true })}</strong></span>
          <span>&bull;</span>
          <span>Debt: <strong class="text-rose">${formatCurrency(balanceData.summary.totalLiabilities, { hideDecimals: true })}</strong></span>
        </div>
      </div>

      <!-- Monthly Cash Flow -->
      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Monthly Cash Flow</span>
          <span class="metric-icon-badge ${currentMonthTrend.netSavings >= 0 ? 'badge-emerald' : 'badge-rose'}">
            ${getIcon(currentMonthTrend.netSavings >= 0 ? 'trendUp' : 'trendDown', 'icon-sm')}
          </span>
        </div>
        <div class="metric-value ${currentMonthTrend.netSavings >= 0 ? 'text-emerald' : 'text-rose'}">
          ${formatCurrency(currentMonthTrend.netSavings, { showSign: true })}
        </div>
        <div class="metric-meta">
          <span>In: ${formatCurrency(currentMonthTrend.income, { hideDecimals: true })}</span>
          <span>&bull;</span>
          <span>Out: ${formatCurrency(currentMonthTrend.expense, { hideDecimals: true })}</span>
        </div>
      </div>

      <!-- Savings Rate -->
      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Savings Rate</span>
          <span class="metric-icon-badge">${getIcon('investment', 'icon-sm')}</span>
        </div>
        <div class="metric-value ${currentMonthTrend.savingsRate >= 20 ? 'text-emerald' : 'text-primary'}">
          ${formatPercent(currentMonthTrend.savingsRate)}
        </div>
        <div class="metric-meta">
          <span>Target benchmark: <strong>20.0%</strong></span>
        </div>
      </div>

      <!-- Budget Health Status -->
      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Budget Status</span>
          <span class="metric-icon-badge ${budgetData.summary.isOverBudget ? 'badge-rose' : 'badge-emerald'}">
            ${getIcon('budgets', 'icon-sm')}
          </span>
        </div>
        <div class="metric-value ${budgetData.summary.isOverBudget ? 'text-rose' : 'text-primary'}">
          ${formatPercent(budgetData.summary.overallPercentage)} Used
        </div>
        <div class="metric-meta">
          <span>${formatCurrency(budgetData.summary.overallRemaining, { hideDecimals: true })} remaining of ${formatCurrency(budgetData.summary.totalBudgeted, { hideDecimals: true })}</span>
        </div>
      </div>
    </div>

    <!-- Main Dashboard Workspace Grid -->
    <div class="dashboard-grid">
      <!-- Left Column: Forecast Timeline & Recent Transactions -->
      <div class="dashboard-main-col">
        
        <!-- 30-Day Cash Flow Projection Card -->
        <div class="card dashboard-card">
          <div class="card-header">
            <div>
              <h2 class="card-title">30-Day Cash-Flow Trajectory</h2>
              <p class="card-subtitle">Expected liquid balance progression based on recurring schedule</p>
            </div>
            <button class="btn btn-sm btn-ghost" id="btn-goto-forecast">
              Full Forecast ${getIcon('chevronRight', 'icon-xs')}
            </button>
          </div>
          <div class="card-body">
            ${renderForecastChart({
              timeline: forecastPreview.timeline,
              safeBuffer: forecastPreview.safeBuffer,
              width: 720,
              height: 220
            })}
            <div class="forecast-summary-bar">
              <div class="forecast-stat">
                <span class="stat-lbl">Starting Cash</span>
                <span class="stat-val">${formatCurrency(forecastPreview.startBalance)}</span>
              </div>
              <div class="forecast-stat">
                <span class="stat-lbl">Projected Lowest</span>
                <span class="stat-val ${forecastPreview.lowestBalance < 500 ? 'text-warning' : ''}">${formatCurrency(forecastPreview.lowestBalance)}</span>
              </div>
              <div class="forecast-stat">
                <span class="stat-lbl">Projected Ending</span>
                <span class="stat-val font-bold ${forecastPreview.endingBalance >= forecastPreview.startBalance ? 'text-emerald' : 'text-rose'}">
                  ${formatCurrency(forecastPreview.endingBalance)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Transactions Ledger Widget -->
        <div class="card dashboard-card">
          <div class="card-header">
            <div>
              <h2 class="card-title">Recent Transactions</h2>
              <p class="card-subtitle">Latest settled activity</p>
            </div>
            <button class="btn btn-sm btn-ghost" id="btn-goto-transactions">
              View All (${transactions.length}) ${getIcon('chevronRight', 'icon-xs')}
            </button>
          </div>
          <div class="card-body p-0">
            ${recentTransactions.length === 0 ? `
              <div class="empty-state p-4">
                <p>No transactions yet. Click "+ New Transaction" or import sample data.</p>
              </div>
            ` : `
              <div class="table-responsive">
                <table class="table finance-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Merchant / Payee</th>
                      <th>Category</th>
                      <th>Account</th>
                      <th class="text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${recentTransactions.map(tx => {
                      const cat = catMap[tx.categoryId] || { name: 'Other', color: '#94a3b8', icon: 'tag' };
                      const acc = accMap[tx.accountId] || { name: 'Account' };
                      const isIncome = tx.type === 'income';
                      const isTransfer = tx.type === 'transfer';
                      const amountClass = isIncome ? 'text-emerald font-semibold' : isTransfer ? 'text-primary' : 'text-primary';
                      const sign = isIncome ? '+' : isTransfer ? '' : '-';

                      return `
                        <tr class="tx-row" data-id="${tx.id}">
                          <td class="text-muted font-mono text-xs">${formatDate(tx.date, 'short')}</td>
                          <td>
                            <div class="tx-merchant font-medium">${tx.merchant || tx.description}</div>
                            ${tx.notes ? `<div class="tx-notes text-muted text-xs">${tx.notes}</div>` : ''}
                          </td>
                          <td>
                            <span class="badge badge-category" style="--cat-color: ${cat.color};">
                              ${getIcon(cat.icon, 'icon-xs')} ${cat.name}
                            </span>
                          </td>
                          <td class="text-muted text-xs">${acc.name}</td>
                          <td class="text-right ${amountClass} font-mono">
                            ${sign}${formatCurrency(tx.amount)}
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>
        </div>

      </div>

      <!-- Right Column: Budget Breakdown & Upcoming Bills -->
      <div class="dashboard-side-col">
        
        <!-- Category Budgets Health Widget -->
        <div class="card dashboard-card">
          <div class="card-header">
            <div>
              <h2 class="card-title">Top Budgets</h2>
              <p class="card-subtitle">Monthly allocations</p>
            </div>
            <button class="btn btn-sm btn-ghost" id="btn-goto-budgets">
              Manage ${getIcon('chevronRight', 'icon-xs')}
            </button>
          </div>
          <div class="card-body">
            ${budgetData.categories.length === 0 ? `
              <p class="text-muted text-sm">No category budgets created for this month.</p>
            ` : `
              <div class="budget-bars-list">
                ${budgetData.categories.slice(0, 5).map(bg => {
                  let progressColor = 'var(--accent-primary)';
                  if (bg.status === 'danger') progressColor = 'var(--accent-rose)';
                  else if (bg.status === 'warning') progressColor = 'var(--warning)';

                  return `
                    <div class="budget-mini-item">
                      <div class="budget-mini-header">
                        <span class="budget-mini-name font-medium text-sm">${bg.categoryName}</span>
                        <span class="budget-mini-values text-xs font-mono">
                          <strong>${formatCurrency(bg.spent, { hideDecimals: true })}</strong> / ${formatCurrency(bg.budgeted, { hideDecimals: true })}
                        </span>
                      </div>
                      <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${Math.min(100, bg.percentage)}%; background-color: ${progressColor};"></div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>
        </div>

        <!-- Upcoming Bills & Recurring Widget -->
        <div class="card dashboard-card">
          <div class="card-header">
            <div>
              <h2 class="card-title">Upcoming Bills</h2>
              <p class="card-subtitle">Scheduled within 14 days</p>
            </div>
            <button class="btn btn-sm btn-ghost" id="btn-goto-recurring">
              All Bills ${getIcon('chevronRight', 'icon-xs')}
            </button>
          </div>
          <div class="card-body p-0">
            ${upcomingBills.length === 0 ? `
              <div class="p-4 text-muted text-sm">No upcoming bills in the next 14 days.</div>
            ` : `
              <div class="bills-list">
                ${upcomingBills.map(bill => {
                  const cat = catMap[bill.categoryId] || { name: 'Bill', color: '#94a3b8', icon: 'tag' };
                  return `
                    <div class="bill-item">
                      <div class="bill-icon-box" style="background-color: ${cat.color}20; color: ${cat.color};">
                        ${getIcon(cat.icon, 'icon-sm')}
                      </div>
                      <div class="bill-info">
                        <div class="bill-name font-medium text-sm">${bill.name}</div>
                        <div class="bill-due text-muted text-xs">Due ${formatRelativeDate(bill.nextDueDate)}</div>
                      </div>
                      <div class="bill-amount font-mono text-sm font-semibold text-rose">
                        -${formatCurrency(bill.amount)}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>
        </div>

      </div>
    </div>
  `;

  // Attach event listeners
  container.querySelector('#btn-quick-transaction')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('OPEN_TRANSACTION_MODAL'));
  });

  container.querySelector('#btn-quick-import')?.addEventListener('click', () => {
    state.activeView = 'data-hub';
    state.notify('VIEW_CHANGED');
  });

  container.querySelector('#btn-goto-forecast')?.addEventListener('click', () => {
    state.activeView = 'forecast';
    state.notify('VIEW_CHANGED');
  });

  container.querySelector('#btn-goto-transactions')?.addEventListener('click', () => {
    state.activeView = 'transactions';
    state.notify('VIEW_CHANGED');
  });

  container.querySelector('#btn-goto-budgets')?.addEventListener('click', () => {
    state.activeView = 'budgets';
    state.notify('VIEW_CHANGED');
  });

  container.querySelector('#btn-goto-recurring')?.addEventListener('click', () => {
    state.activeView = 'recurring';
    state.notify('VIEW_CHANGED');
  });

  container.querySelector('#btn-view-anomalies')?.addEventListener('click', () => {
    state.activeView = 'reports';
    state.notify('VIEW_CHANGED');
  });
}


/* --- MODULE: js/views/transactions.js --- */
/**
 * BudgetOS - Transactions Ledger View Controller
 * High-readability finance table, live filtering, column sorting, pagination,
 * inline actions, and CSV export.
 */


let filterState = {
  search: '',
  type: 'all',
  categoryId: 'all',
  accountId: 'all',
  dateRange: 'thisMonth', // 'thisMonth', 'lastMonth', 'last90', 'all'
  sortBy: 'date',
  sortOrder: 'desc',
  currentPage: 1,
  pageSize: 15
};

function renderTransactionsView(container) {
  const { transactions, categories, accounts } = state;

  const catMap = {};
  categories.forEach(c => { catMap[c.id] = c; });
  const accMap = {};
  accounts.forEach(a => { accMap[a.id] = a; });

  // 1. Filter logic
  let filtered = [...transactions];

  // Text search
  if (filterState.search.trim()) {
    const q = filterState.search.toLowerCase().trim();
    filtered = filtered.filter(tx => {
      const desc = (tx.description || '').toLowerCase();
      const merch = (tx.merchant || '').toLowerCase();
      const notes = (tx.notes || '').toLowerCase();
      const cat = catMap[tx.categoryId]?.name?.toLowerCase() || '';
      return desc.includes(q) || merch.includes(q) || notes.includes(q) || cat.includes(q);
    });
  }

  // Type filter
  if (filterState.type !== 'all') {
    filtered = filtered.filter(tx => tx.type === filterState.type);
  }

  // Category filter
  if (filterState.categoryId !== 'all') {
    filtered = filtered.filter(tx => tx.categoryId === filterState.categoryId);
  }

  // Account filter
  if (filterState.accountId !== 'all') {
    filtered = filtered.filter(tx => tx.accountId === filterState.accountId || tx.toAccountId === filterState.accountId);
  }

  // Date range filter
  const today = new Date().toISOString().split('T')[0];
  const thisMonthKey = getMonthKey();
  const lastMonthKey = getMonthKey(addMonths(today, -1));

  if (filterState.dateRange === 'thisMonth') {
    filtered = filtered.filter(tx => tx.date && tx.date.startsWith(thisMonthKey));
  } else if (filterState.dateRange === 'lastMonth') {
    filtered = filtered.filter(tx => tx.date && tx.date.startsWith(lastMonthKey));
  } else if (filterState.dateRange === 'last90') {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const ninetyDaysStr = ninetyDaysAgo.toISOString().split('T')[0];
    filtered = filtered.filter(tx => tx.date >= ninetyDaysStr);
  }

  // 2. Sorting
  filtered.sort((a, b) => {
    let valA = a[filterState.sortBy];
    let valB = b[filterState.sortBy];

    if (filterState.sortBy === 'amount') {
      valA = Number(valA) || 0;
      valB = Number(valB) || 0;
    } else if (filterState.sortBy === 'merchant') {
      valA = (a.merchant || a.description || '').toLowerCase();
      valB = (b.merchant || b.description || '').toLowerCase();
    } else {
      valA = valA || '';
      valB = valB || '';
    }

    if (valA < valB) return filterState.sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return filterState.sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // 3. Pagination
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / filterState.pageSize));
  if (filterState.currentPage > totalPages) filterState.currentPage = totalPages;
  
  const startIndex = (filterState.currentPage - 1) * filterState.pageSize;
  const paginatedItems = filtered.slice(startIndex, startIndex + filterState.pageSize);

  // Summary of filtered items
  let filteredIncome = 0;
  let filteredExpense = 0;
  filtered.forEach(tx => {
    const amt = Number(tx.amount) || 0;
    if (tx.type === 'income') filteredIncome += amt;
    if (tx.type === 'expense') filteredExpense += amt;
  });

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">Transaction Ledger</h1>
        <p class="view-subtitle">${totalItems} transactions matched &bull; In: <span class="text-emerald font-semibold">${formatCurrency(filteredIncome)}</span>, Out: <span class="text-rose font-semibold">${formatCurrency(filteredExpense)}</span></p>
      </div>
      <div class="view-actions">
        <button class="btn btn-secondary" id="btn-export-tx-csv">
          ${getIcon('download', 'icon-sm')} Export CSV
        </button>
        <button class="btn btn-primary" id="btn-add-tx">
          ${getIcon('plus', 'icon-sm')} New Transaction
        </button>
      </div>
    </div>

    <!-- Filter Control Bar -->
    <div class="card ledger-controls-card">
      <div class="filter-bar-row">
        <!-- Search -->
        <div class="search-input-wrapper">
          <span class="search-icon">${getIcon('search', 'icon-sm')}</span>
          <input
            type="text"
            id="tx-search"
            class="form-control search-input"
            placeholder="Search merchant, description, notes..."
            value="${filterState.search}"
          />
        </div>

        <!-- Date Range Filter -->
        <select id="filter-date-range" class="form-control filter-select">
          <option value="thisMonth" ${filterState.dateRange === 'thisMonth' ? 'selected' : ''}>This Month</option>
          <option value="lastMonth" ${filterState.dateRange === 'lastMonth' ? 'selected' : ''}>Last Month</option>
          <option value="last90" ${filterState.dateRange === 'last90' ? 'selected' : ''}>Last 90 Days</option>
          <option value="all" ${filterState.dateRange === 'all' ? 'selected' : ''}>All Time</option>
        </select>

        <!-- Type Filter -->
        <select id="filter-type" class="form-control filter-select">
          <option value="all" ${filterState.type === 'all' ? 'selected' : ''}>All Types</option>
          <option value="expense" ${filterState.type === 'expense' ? 'selected' : ''}>Expenses</option>
          <option value="income" ${filterState.type === 'income' ? 'selected' : ''}>Income</option>
          <option value="transfer" ${filterState.type === 'transfer' ? 'selected' : ''}>Transfers</option>
        </select>

        <!-- Category Filter -->
        <select id="filter-category" class="form-control filter-select">
          <option value="all">All Categories</option>
          ${categories.map(c => `
            <option value="${c.id}" ${filterState.categoryId === c.id ? 'selected' : ''}>${c.name}</option>
          `).join('')}
        </select>

        <!-- Account Filter -->
        <select id="filter-account" class="form-control filter-select">
          <option value="all">All Accounts</option>
          ${accounts.map(a => `
            <option value="${a.id}" ${filterState.accountId === a.id ? 'selected' : ''}>${a.name}</option>
          `).join('')}
        </select>

        ${(filterState.search || filterState.type !== 'all' || filterState.categoryId !== 'all' || filterState.accountId !== 'all' || filterState.dateRange !== 'thisMonth') ? `
          <button class="btn btn-ghost btn-sm text-muted" id="btn-reset-filters" title="Reset Filters">
            ${getIcon('refresh', 'icon-xs')} Reset
          </button>
        ` : ''}
      </div>
    </div>

    <!-- Finance Ledger Table -->
    <div class="card ledger-table-card">
      <div class="table-responsive">
        <table class="table finance-table">
          <thead>
            <tr>
              <th class="sortable-th cursor-pointer" data-sort="date">
                Date ${filterState.sortBy === 'date' ? (filterState.sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th class="sortable-th cursor-pointer" data-sort="merchant">
                Merchant / Description ${filterState.sortBy === 'merchant' ? (filterState.sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th>Category</th>
              <th>Account</th>
              <th class="text-right sortable-th cursor-pointer" data-sort="amount">
                Amount ${filterState.sortBy === 'amount' ? (filterState.sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th class="text-center" style="width: 100px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${paginatedItems.length === 0 ? `
              <tr>
                <td colspan="6" class="text-center p-5 text-muted">
                  No transactions match the current filter criteria.
                </td>
              </tr>
            ` : paginatedItems.map(tx => {
              const cat = catMap[tx.categoryId] || { name: 'Uncategorized', color: '#94a3b8', icon: 'tag' };
              const acc = accMap[tx.accountId] || { name: 'Account' };
              const toAcc = tx.toAccountId ? accMap[tx.toAccountId] : null;

              const isIncome = tx.type === 'income';
              const isTransfer = tx.type === 'transfer';
              const amountClass = isIncome ? 'text-emerald font-semibold' : isTransfer ? 'text-primary' : 'text-primary';
              const sign = isIncome ? '+' : isTransfer ? '⇆ ' : '-';

              return `
                <tr class="tx-row-interactive" data-id="${tx.id}">
                  <td class="text-muted font-mono text-sm">${formatDate(tx.date, 'medium')}</td>
                  <td>
                    <div class="tx-merchant font-medium text-primary">${tx.merchant || tx.description}</div>
                    ${tx.notes ? `<div class="tx-notes text-muted text-xs">${tx.notes}</div>` : ''}
                  </td>
                  <td>
                    <span class="badge badge-category" style="--cat-color: ${cat.color};">
                      ${getIcon(cat.icon, 'icon-xs')} ${cat.name}
                    </span>
                  </td>
                  <td class="text-secondary text-sm">
                    ${isTransfer && toAcc ? `${acc.name} &rarr; ${toAcc.name}` : acc.name}
                  </td>
                  <td class="text-right ${amountClass} font-mono text-base">
                    ${sign}${formatCurrency(tx.amount)}
                  </td>
                  <td class="text-center">
                    <div class="table-actions-group">
                      <button class="btn-icon btn-edit-tx" data-id="${tx.id}" title="Edit Transaction">
                        ${getIcon('edit', 'icon-xs')}
                      </button>
                      <button class="btn-icon btn-duplicate-tx" data-id="${tx.id}" title="Duplicate">
                        ${getIcon('copy', 'icon-xs')}
                      </button>
                      <button class="btn-icon btn-icon-danger btn-delete-tx" data-id="${tx.id}" title="Delete">
                        ${getIcon('trash', 'icon-xs')}
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      ${totalPages > 1 ? `
        <div class="pagination-footer">
          <div class="pagination-info text-muted text-xs">
            Showing ${startIndex + 1}&ndash;${Math.min(startIndex + filterState.pageSize, totalItems)} of ${totalItems}
          </div>
          <div class="pagination-controls">
            <button class="btn btn-sm btn-secondary" id="btn-page-prev" ${filterState.currentPage === 1 ? 'disabled' : ''}>
              ${getIcon('arrowLeft', 'icon-xs')} Prev
            </button>
            <span class="page-indicator text-sm font-mono">${filterState.currentPage} / ${totalPages}</span>
            <button class="btn btn-sm btn-secondary" id="btn-page-next" ${filterState.currentPage === totalPages ? 'disabled' : ''}>
              Next ${getIcon('arrowRight', 'icon-xs')}
            </button>
          </div>
        </div>
      ` : ''}
    </div>
  `;

  // --- Attach Handlers ---
  const searchInput = container.querySelector('#tx-search');
  searchInput?.addEventListener('input', (e) => {
    filterState.search = e.target.value;
    filterState.currentPage = 1;
    renderTransactionsView(container);
    // Keep focus
    const input = container.querySelector('#tx-search');
    input?.focus();
    input?.setSelectionRange(input.value.length, input.value.length);
  });

  container.querySelector('#filter-date-range')?.addEventListener('change', (e) => {
    filterState.dateRange = e.target.value;
    filterState.currentPage = 1;
    renderTransactionsView(container);
  });

  container.querySelector('#filter-type')?.addEventListener('change', (e) => {
    filterState.type = e.target.value;
    filterState.currentPage = 1;
    renderTransactionsView(container);
  });

  container.querySelector('#filter-category')?.addEventListener('change', (e) => {
    filterState.categoryId = e.target.value;
    filterState.currentPage = 1;
    renderTransactionsView(container);
  });

  container.querySelector('#filter-account')?.addEventListener('change', (e) => {
    filterState.accountId = e.target.value;
    filterState.currentPage = 1;
    renderTransactionsView(container);
  });

  container.querySelector('#btn-reset-filters')?.addEventListener('click', () => {
    filterState.search = '';
    filterState.type = 'all';
    filterState.categoryId = 'all';
    filterState.accountId = 'all';
    filterState.dateRange = 'thisMonth';
    filterState.currentPage = 1;
    renderTransactionsView(container);
  });

  // Sorting
  container.querySelectorAll('.sortable-th').forEach(th => {
    th.addEventListener('click', () => {
      const field = th.dataset.sort;
      if (filterState.sortBy === field) {
        filterState.sortOrder = filterState.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        filterState.sortBy = field;
        filterState.sortOrder = 'desc';
      }
      renderTransactionsView(container);
    });
  });

  // Pagination
  container.querySelector('#btn-page-prev')?.addEventListener('click', () => {
    if (filterState.currentPage > 1) {
      filterState.currentPage--;
      renderTransactionsView(container);
    }
  });

  container.querySelector('#btn-page-next')?.addEventListener('click', () => {
    if (filterState.currentPage < totalPages) {
      filterState.currentPage++;
      renderTransactionsView(container);
    }
  });

  // Button actions
  container.querySelector('#btn-add-tx')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('OPEN_TRANSACTION_MODAL'));
  });

  // Export CSV
  container.querySelector('#btn-export-tx-csv')?.addEventListener('click', () => {
    const headers = [
      { label: 'Date', key: 'date' },
      { label: 'Merchant', key: 'merchant' },
      { label: 'Description', key: 'description' },
      { label: 'Category', key: 'categoryName' },
      { label: 'Account', key: 'accountName' },
      { label: 'Type', key: 'type' },
      { label: 'Amount', key: 'amount' },
      { label: 'Notes', key: 'notes' }
    ];

    const exportRows = filtered.map(t => ({
      date: t.date,
      merchant: t.merchant || '',
      description: t.description || '',
      categoryName: catMap[t.categoryId]?.name || '',
      accountName: accMap[t.accountId]?.name || '',
      type: t.type,
      amount: t.amount,
      notes: t.notes || ''
    }));

    const csvContent = generateCSV(headers, exportRows);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `BudgetOS_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Row Edit / Duplicate / Delete
  container.querySelectorAll('.btn-edit-tx').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const tx = transactions.find(t => t.id === id);
      if (tx) {
        window.dispatchEvent(new CustomEvent('OPEN_TRANSACTION_MODAL', { detail: { transaction: tx } }));
      }
    });
  });

  container.querySelectorAll('.btn-duplicate-tx').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const tx = transactions.find(t => t.id === id);
      if (tx) {
        const copyTx = {
          ...tx,
          id: 'tx_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
          description: `${tx.description} (Copy)`,
          date: new Date().toISOString().split('T')[0]
        };
        await state.addTransaction(copyTx);
        renderTransactionsView(container);
      }
    });
  });

  container.querySelectorAll('.btn-delete-tx').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      await state.deleteTransaction(id);
      renderTransactionsView(container);
    });
  });
}


/* --- MODULE: js/views/accounts.js --- */
/**
 * BudgetOS - Accounts View Controller
 * Manage checking, savings, cash, and credit card accounts with dynamic balances and reconciliation.
 */


function renderAccountCard(acc, stats = {}) {
  const isCredit = acc.type === 'creditCard';
  const balance = stats.currentBalance || 0;
  const cleared = stats.clearedBalance || 0;
  const creditLimit = Number(acc.creditLimit) || 0;
  const availableCredit = isCredit && creditLimit > 0 ? Math.max(0, creditLimit - balance) : 0;
  const creditUtilization = isCredit && creditLimit > 0 ? (balance / creditLimit) * 100 : 0;

  return `
    <div class="card account-card" style="--acc-color: ${acc.color || '#3b82f6'};">
      <div class="account-card-top">
        <div class="acc-badge-icon" style="background-color: ${acc.color || '#3b82f6'}20; color: ${acc.color || '#3b82f6'};">
          ${getIcon(acc.icon || (isCredit ? 'creditCard' : 'bank'), 'icon-md')}
        </div>
        <div class="acc-meta-block">
          <h3 class="acc-name">${acc.name}</h3>
          <span class="acc-type-pill text-xs">${acc.type.toUpperCase()}</span>
        </div>
        <div class="acc-card-actions">
          <button class="btn-icon btn-edit-account" data-id="${acc.id}" title="Edit Account">
            ${getIcon('edit', 'icon-xs')}
          </button>
          <button class="btn-icon btn-icon-danger btn-delete-account" data-id="${acc.id}" title="Delete Account">
            ${getIcon('trash', 'icon-xs')}
          </button>
        </div>
      </div>

      <div class="account-card-body">
        <div class="acc-balance-display">
          <span class="acc-bal-label text-muted text-xs">${isCredit ? 'Current Balance (Debt)' : 'Current Balance'}</span>
          <div class="acc-bal-amount font-mono ${isCredit ? 'text-rose' : 'text-primary'}">
            ${formatCurrency(balance)}
          </div>
        </div>

        ${isCredit && creditLimit > 0 ? `
          <div class="credit-util-section">
            <div class="util-header text-xs text-muted">
              <span>Available: <strong>${formatCurrency(availableCredit)}</strong></span>
              <span>${formatPercent(creditUtilization)} used</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${Math.min(100, creditUtilization)}%; background-color: ${creditUtilization > 70 ? 'var(--accent-rose)' : 'var(--accent-primary)'};"></div>
            </div>
          </div>
        ` : `
          <div class="acc-cleared-info text-xs text-muted">
            <span>Cleared: <strong class="text-primary">${formatCurrency(cleared)}</strong></span>
            <span>&bull;</span>
            <span>${stats.transactionCount || 0} transactions</span>
          </div>
        `}
      </div>

      <div class="account-card-footer">
        <button class="btn btn-sm btn-ghost w-full btn-view-acc-tx" data-id="${acc.id}">
          View Ledger ${getIcon('arrowRight', 'icon-xs')}
        </button>
      </div>
    </div>
  `;
}

function renderAccountsView(container) {
  const { accounts, transactions } = state;
  const balanceData = calculateAccountBalances(accounts, transactions);
  const accMap = balanceData.accounts;

  // Group accounts by type
  const checkingAccs = accounts.filter(a => a.type === 'checking' && !a.isArchived);
  const savingsAccs = accounts.filter(a => a.type === 'savings' && !a.isArchived);
  const creditAccs = accounts.filter(a => a.type === 'creditCard' && !a.isArchived);
  const cashAccs = accounts.filter(a => a.type === 'cash' && !a.isArchived);
  const archivedAccs = accounts.filter(a => a.isArchived);

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">Accounts & Assets</h1>
        <p class="view-subtitle">Dynamic balances calculated across ${transactions.length} historical transactions</p>
      </div>
      <div class="view-actions">
        <button class="btn btn-primary" id="btn-add-account">
          ${getIcon('plus', 'icon-sm')} Add Account
        </button>
      </div>
    </div>

    <!-- Accounts High-Level Summary Banner -->
    <div class="card account-summary-banner">
      <div class="acc-summary-stat">
        <span class="stat-lbl">Total Net Worth</span>
        <span class="stat-val font-bold ${balanceData.summary.netWorth >= 0 ? 'text-primary' : 'text-danger'}">
          ${formatCurrency(balanceData.summary.netWorth)}
        </span>
      </div>
      <div class="acc-summary-divider"></div>
      <div class="acc-summary-stat">
        <span class="stat-lbl">Liquid Cash & Assets</span>
        <span class="stat-val text-emerald font-semibold">${formatCurrency(balanceData.summary.totalAssets)}</span>
      </div>
      <div class="acc-summary-divider"></div>
      <div class="acc-summary-stat">
        <span class="stat-lbl">Credit Card Liabilities</span>
        <span class="stat-val text-rose font-semibold">${formatCurrency(balanceData.summary.totalLiabilities)}</span>
      </div>
    </div>

    <!-- Account Cards Grid -->
    <div class="accounts-section-grid">
      
      <!-- Cash & Checking Group -->
      <div class="account-group">
        <div class="account-group-header">
          <h2 class="group-title">Cash & Depository Accounts</h2>
          <span class="group-count text-muted text-xs">${checkingAccs.length + cashAccs.length} accounts</span>
        </div>
        <div class="account-cards-list">
          ${[...checkingAccs, ...cashAccs].map(acc => renderAccountCard(acc, accMap[acc.id])).join('')}
          ${checkingAccs.length === 0 && cashAccs.length === 0 ? `
            <div class="empty-state-card"><p>No checking or cash accounts added yet.</p></div>
          ` : ''}
        </div>
      </div>

      <!-- Savings & Investments Group -->
      <div class="account-group">
        <div class="account-group-header">
          <h2 class="group-title">Savings & Reserves</h2>
          <span class="group-count text-muted text-xs">${savingsAccs.length} accounts</span>
        </div>
        <div class="account-cards-list">
          ${savingsAccs.map(acc => renderAccountCard(acc, accMap[acc.id])).join('')}
          ${savingsAccs.length === 0 ? `
            <div class="empty-state-card"><p>No savings accounts added yet.</p></div>
          ` : ''}
        </div>
      </div>

      <!-- Credit Cards Group -->
      <div class="account-group">
        <div class="account-group-header">
          <h2 class="group-title">Credit Cards & Lines</h2>
          <span class="group-count text-muted text-xs">${creditAccs.length} accounts</span>
        </div>
        <div class="account-cards-list">
          ${creditAccs.map(acc => renderAccountCard(acc, accMap[acc.id])).join('')}
          ${creditAccs.length === 0 ? `
            <div class="empty-state-card"><p>No credit cards configured.</p></div>
          ` : ''}
        </div>
      </div>

    </div>

    ${archivedAccs.length > 0 ? `
      <div class="archived-section mt-6">
        <h3 class="text-muted text-sm uppercase mb-3">Archived Accounts (${archivedAccs.length})</h3>
        <div class="account-cards-list opacity-60">
          ${archivedAccs.map(acc => renderAccountCard(acc, accMap[acc.id])).join('')}
        </div>
      </div>
    ` : ''}
  `;

  // --- Attach Handlers ---
  container.querySelector('#btn-add-account')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('OPEN_ACCOUNT_MODAL'));
  });

  container.querySelectorAll('.btn-edit-account').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const acc = accounts.find(a => a.id === btn.dataset.id);
      if (acc) {
        window.dispatchEvent(new CustomEvent('OPEN_ACCOUNT_MODAL', { detail: { account: acc } }));
      }
    });
  });

  container.querySelectorAll('.btn-delete-account').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      if (confirm('Are you sure you want to delete this account? Transactions will remain in ledger.')) {
        await state.deleteAccount(id);
        renderAccountsView(container);
      }
    });
  });

  container.querySelectorAll('.btn-view-acc-tx').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeView = 'transactions';
      state.notify('VIEW_CHANGED');
    });
  });
}


/* --- MODULE: js/views/budgets.js --- */
/**
 * BudgetOS - Budgets View Controller
 * Manage category monthly budgets, monitor progress, analyze rollovers, and set warning thresholds.
 */


let selectedMonth = getMonthKey();

function renderBudgetsView(container) {
  const { budgets, categories, transactions } = state;
  const budgetData = calculateBudgetPerformance(selectedMonth, budgets, categories, transactions);
  const previousMonthKey = getMonthKey(addMonths(selectedMonth + '-01', -1));
  const hasPreviousBudgets = budgets.some(b => b.monthKey === previousMonthKey);

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">Monthly Budgets</h1>
        <p class="view-subtitle">Allocations and real-time spending for <strong>${formatMonthKey(selectedMonth)}</strong></p>
      </div>
      <div class="view-actions">
        <!-- Month Navigation -->
        <div class="month-selector-group">
          <button class="btn btn-sm btn-secondary" id="btn-prev-month" title="Previous Month">
            ${getIcon('arrowLeft', 'icon-xs')}
          </button>
          <span class="month-label font-medium">${formatMonthKey(selectedMonth)}</span>
          <button class="btn btn-sm btn-secondary" id="btn-next-month" title="Next Month">
            ${getIcon('arrowRight', 'icon-xs')}
          </button>
        </div>

        ${hasPreviousBudgets && budgetData.categories.filter(c => c.isBudgetSet).length === 0 ? `
          <button class="btn btn-secondary" id="btn-copy-prev-budgets">
            ${getIcon('copy', 'icon-sm')} Copy from Last Month
          </button>
        ` : ''}

        <button class="btn btn-primary" id="btn-add-budget">
          ${getIcon('plus', 'icon-sm')} Set Category Budget
        </button>
      </div>
    </div>

    <!-- Monthly Budget Summary Card -->
    <div class="card budget-summary-card">
      <div class="budget-kpi-row">
        <div class="kpi-block">
          <span class="kpi-lbl">Total Budgeted</span>
          <span class="kpi-val text-primary font-bold">${formatCurrency(budgetData.summary.totalBudgeted)}</span>
        </div>
        <div class="kpi-divider"></div>
        <div class="kpi-block">
          <span class="kpi-lbl">Total Spent</span>
          <span class="kpi-val ${budgetData.summary.isOverBudget ? 'text-rose' : 'text-primary'} font-bold">
            ${formatCurrency(budgetData.summary.totalSpent)}
          </span>
        </div>
        <div class="kpi-divider"></div>
        <div class="kpi-block">
          <span class="kpi-lbl">Remaining Available</span>
          <span class="kpi-val text-emerald font-bold">${formatCurrency(budgetData.summary.overallRemaining)}</span>
        </div>
        <div class="kpi-divider"></div>
        <div class="kpi-block">
          <span class="kpi-lbl">Overall Usage</span>
          <span class="kpi-val ${budgetData.summary.isOverBudget ? 'text-rose' : 'text-primary'} font-mono">
            ${formatPercent(budgetData.summary.overallPercentage)}
          </span>
        </div>
      </div>

      <!-- Large Master Progress Bar -->
      <div class="progress-bar-bg mt-4" style="height: 10px;">
        <div
          class="progress-bar-fill"
          style="width: ${Math.min(100, budgetData.summary.overallPercentage)}%; background-color: ${budgetData.summary.isOverBudget ? 'var(--accent-rose)' : 'var(--accent-primary)'};"
        ></div>
      </div>
    </div>

    <!-- Category Budgets Grid -->
    <div class="budget-cards-grid mt-6">
      ${budgetData.categories.length === 0 ? `
        <div class="card p-8 text-center text-muted col-span-full">
          <p>No categories configured yet.</p>
        </div>
      ` : budgetData.categories.map(cat => {
        let statusBadge = '';
        let barColor = 'var(--accent-primary)';

        if (cat.status === 'danger') {
          barColor = 'var(--accent-rose)';
          statusBadge = `<span class="badge badge-danger">Over Budget by ${formatCurrency(Math.abs(cat.remaining))}</span>`;
        } else if (cat.status === 'warning') {
          barColor = 'var(--warning)';
          statusBadge = `<span class="badge badge-warning">Approaching Limit</span>`;
        } else if (cat.status === 'unbudgeted') {
          statusBadge = `<span class="badge badge-secondary">No Budget Set</span>`;
        } else {
          statusBadge = `<span class="badge badge-success">${formatCurrency(cat.remaining)} left</span>`;
        }

        return `
          <div class="card budget-card ${cat.status === 'danger' ? 'border-danger' : ''}">
            <div class="budget-card-header">
              <div class="budget-cat-meta">
                <span class="cat-color-dot" style="background-color: ${cat.categoryColor || '#64748b'};"></span>
                <span class="budget-cat-name font-semibold text-primary">${cat.categoryName}</span>
              </div>
              <div class="budget-card-actions">
                <button class="btn-icon btn-edit-category-budget" data-id="${cat.categoryId}" title="Edit Budget">
                  ${getIcon('edit', 'icon-xs')}
                </button>
              </div>
            </div>

            <div class="budget-card-body">
              <div class="budget-numbers-row">
                <div>
                  <span class="text-xs text-muted">Spent</span>
                  <div class="font-mono text-lg font-bold ${cat.status === 'danger' ? 'text-rose' : 'text-primary'}">
                    ${formatCurrency(cat.spent)}
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-xs text-muted">Budgeted</span>
                  <div class="font-mono text-lg text-secondary">
                    ${formatCurrency(cat.budgeted)}
                  </div>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="progress-bar-bg mt-3 mb-2">
                <div
                  class="progress-bar-fill"
                  style="width: ${Math.min(100, cat.percentage)}%; background-color: ${barColor};"
                ></div>
              </div>

              <div class="budget-card-footer-info">
                <span class="text-xs text-muted font-mono">${formatPercent(cat.percentage)} used</span>
                ${statusBadge}
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // --- Handlers ---
  container.querySelector('#btn-prev-month')?.addEventListener('click', () => {
    selectedMonth = getMonthKey(addMonths(selectedMonth + '-01', -1));
    renderBudgetsView(container);
  });

  container.querySelector('#btn-next-month')?.addEventListener('click', () => {
    selectedMonth = getMonthKey(addMonths(selectedMonth + '-01', 1));
    renderBudgetsView(container);
  });

  container.querySelector('#btn-copy-prev-budgets')?.addEventListener('click', async () => {
    await state.copyBudgetsFromMonth(previousMonthKey, selectedMonth);
    renderBudgetsView(container);
  });

  container.querySelector('#btn-add-budget')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('OPEN_BUDGET_MODAL', { detail: { monthKey: selectedMonth } }));
  });

  container.querySelectorAll('.btn-edit-category-budget').forEach(btn => {
    btn.addEventListener('click', () => {
      const categoryId = btn.dataset.id;
      window.dispatchEvent(new CustomEvent('OPEN_BUDGET_MODAL', { detail: { monthKey: selectedMonth, categoryId } }));
    });
  });
}


/* --- MODULE: js/views/goals.js --- */
/**
 * BudgetOS - Savings Goals View Controller
 * Manage savings goals, calculate required monthly contributions, deadline feasibility,
 * and record deposits.
 */


function renderGoalsView(container) {
  const { goals, accounts } = state;
  const accMap = {};
  accounts.forEach(a => { accMap[a.id] = a; });

  const activeGoals = goals.filter(g => !g.isCompleted);
  const completedGoals = goals.filter(g => g.isCompleted);

  // Calculate totals
  let totalTarget = 0;
  let totalSaved = 0;
  goals.forEach(g => {
    totalTarget += Number(g.targetAmount) || 0;
    totalSaved += Number(g.currentAmount) || 0;
  });
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">Savings Goals</h1>
        <p class="view-subtitle">Track targeted savings milestones and required monthly contributions</p>
      </div>
      <div class="view-actions">
        <button class="btn btn-primary" id="btn-add-goal">
          ${getIcon('plus', 'icon-sm')} Create Goal
        </button>
      </div>
    </div>

    <!-- Goals Summary Banner -->
    <div class="card goals-summary-card">
      <div class="goals-kpi-block">
        <span class="kpi-lbl">Total Goal Targets</span>
        <span class="kpi-val text-primary font-bold">${formatCurrency(totalTarget)}</span>
      </div>
      <div class="kpi-divider"></div>
      <div class="goals-kpi-block">
        <span class="kpi-lbl">Total Accumulated</span>
        <span class="kpi-val text-emerald font-bold">${formatCurrency(totalSaved)}</span>
      </div>
      <div class="kpi-divider"></div>
      <div class="goals-kpi-block">
        <span class="kpi-lbl">Remaining Needed</span>
        <span class="kpi-val text-secondary font-bold">${formatCurrency(Math.max(0, totalTarget - totalSaved))}</span>
      </div>
      <div class="kpi-divider"></div>
      <div class="goals-kpi-block">
        <span class="kpi-lbl">Overall Completion</span>
        <span class="kpi-val text-primary font-mono">${formatPercent(overallProgress)}</span>
      </div>
    </div>

    <!-- Active Goals Grid -->
    <div class="goals-cards-grid mt-6">
      ${activeGoals.length === 0 ? `
        <div class="card p-8 text-center text-muted col-span-full">
          <p>No active savings goals yet. Create one to begin tracking progress!</p>
        </div>
      ` : activeGoals.map(goal => {
        const target = Number(goal.targetAmount) || 0;
        const current = Number(goal.currentAmount) || 0;
        const remaining = Math.max(0, target - current);
        const percent = target > 0 ? Math.min(100, (current / target) * 100) : 0;
        const linkedAcc = accMap[goal.accountId];

        // Math for monthly contribution needed
        let monthlyReq = Number(goal.monthlyContribution) || 0;
        let monthsLeft = 0;
        if (goal.targetDate) {
          const days = getDaysBetween(new Date().toISOString().split('T')[0], goal.targetDate);
          monthsLeft = Math.max(1, Math.round(days / 30));
          if (remaining > 0) {
            monthlyReq = remaining / monthsLeft;
          }
        }

        return `
          <div class="card goal-card" style="--goal-color: ${goal.color || '#10b981'};">
            <div class="goal-card-header">
              <div class="goal-icon-box" style="background-color: ${goal.color || '#10b981'}20; color: ${goal.color || '#10b981'};">
                ${getIcon(goal.icon || 'shield', 'icon-md')}
              </div>
              <div class="goal-meta-block">
                <h3 class="goal-name font-semibold text-primary">${goal.name}</h3>
                ${linkedAcc ? `<span class="goal-linked-acc text-xs text-muted">In ${linkedAcc.name}</span>` : ''}
              </div>
              <div class="goal-actions">
                <button class="btn-icon btn-edit-goal" data-id="${goal.id}" title="Edit Goal">
                  ${getIcon('edit', 'icon-xs')}
                </button>
                <button class="btn-icon btn-icon-danger btn-delete-goal" data-id="${goal.id}" title="Delete Goal">
                  ${getIcon('trash', 'icon-xs')}
                </button>
              </div>
            </div>

            <div class="goal-card-body">
              <div class="goal-progress-row">
                <div class="goal-progress-ring-box">
                  ${renderGoalProgressRing({
                    percentage: percent,
                    size: 64,
                    strokeWidth: 6,
                    color: goal.color || '#10b981'
                  })}
                  <span class="ring-percent-text text-xs font-bold font-mono">${formatPercent(percent, 0)}</span>
                </div>
                <div class="goal-amounts-box">
                  <div class="text-xs text-muted">Saved so far</div>
                  <div class="font-mono text-xl font-bold text-emerald">${formatCurrency(current)}</div>
                  <div class="text-xs text-muted">of ${formatCurrency(target)} target</div>
                </div>
              </div>

              <div class="goal-stats-panel mt-4">
                <div class="goal-stat-item">
                  <span class="text-xs text-muted">Target Deadline</span>
                  <span class="text-xs font-semibold text-primary">${goal.targetDate ? formatDate(goal.targetDate, 'medium') : 'No deadline'}</span>
                </div>
                <div class="goal-stat-item text-right">
                  <span class="text-xs text-muted">Req. Contribution</span>
                  <span class="text-xs font-semibold text-primary font-mono">${formatCurrency(monthlyReq, { hideDecimals: true })}/mo</span>
                </div>
              </div>
            </div>

            <div class="goal-card-footer">
              <button class="btn btn-secondary btn-sm w-full btn-deposit-goal" data-id="${goal.id}">
                ${getIcon('plus', 'icon-xs')} Add Funds
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    ${completedGoals.length > 0 ? `
      <div class="completed-goals-section mt-8">
        <h3 class="text-muted text-sm uppercase mb-3">Completed Goals (${completedGoals.length})</h3>
        <div class="goals-cards-grid opacity-75">
          ${completedGoals.map(goal => `
            <div class="card goal-card border-success">
              <div class="goal-card-header">
                <div class="goal-icon-box bg-emerald-light text-emerald">
                  ${getIcon('check', 'icon-md')}
                </div>
                <div class="goal-meta-block">
                  <h3 class="goal-name font-semibold text-primary">${goal.name}</h3>
                  <span class="badge badge-success text-xs">Completed!</span>
                </div>
                <span class="font-mono font-bold text-emerald">${formatCurrency(goal.targetAmount)}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;

  // --- Handlers ---
  container.querySelector('#btn-add-goal')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('OPEN_GOAL_MODAL'));
  });

  container.querySelectorAll('.btn-edit-goal').forEach(btn => {
    btn.addEventListener('click', () => {
      const goal = goals.find(g => g.id === btn.dataset.id);
      if (goal) {
        window.dispatchEvent(new CustomEvent('OPEN_GOAL_MODAL', { detail: { goal } }));
      }
    });
  });

  container.querySelectorAll('.btn-delete-goal').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (confirm('Delete this savings goal?')) {
        await state.deleteGoal(id);
        renderGoalsView(container);
      }
    });
  });

  container.querySelectorAll('.btn-deposit-goal').forEach(btn => {
    btn.addEventListener('click', () => {
      const goal = goals.find(g => g.id === btn.dataset.id);
      if (goal) {
        window.dispatchEvent(new CustomEvent('OPEN_DEPOSIT_MODAL', { detail: { goal } }));
      }
    });
  });
}


/* --- MODULE: js/views/recurring.js --- */
/**
 * BudgetOS - Recurring Transactions & Bills View Controller
 * Manage recurring income, fixed bills, subscriptions, and automated transfers.
 */


function renderRecurringView(container) {
  const { recurring, categories, accounts } = state;
  const catMap = {};
  categories.forEach(c => { catMap[c.id] = c; });
  const accMap = {};
  accounts.forEach(a => { accMap[a.id] = a; });

  const activeRules = recurring.filter(r => !r.isPaused);
  const pausedRules = recurring.filter(r => r.isPaused);

  // Group by Income vs Expenses
  let monthlyTotalIncome = 0;
  let monthlyTotalExpenses = 0;

  activeRules.forEach(r => {
    const amt = Number(r.amount) || 0;
    // Normalize to monthly
    let monthlyEquiv = amt;
    if (r.frequency === 'weekly') monthlyEquiv = amt * 4.33;
    else if (r.frequency === 'biweekly') monthlyEquiv = amt * 2.16;
    else if (r.frequency === 'daily') monthlyEquiv = amt * 30;
    else if (r.frequency === 'yearly') monthlyEquiv = amt / 12;

    if (r.type === 'income') monthlyTotalIncome += monthlyEquiv;
    else if (r.type === 'expense') monthlyTotalExpenses += monthlyEquiv;
  });

  const netMonthlyRecurring = monthlyTotalIncome - monthlyTotalExpenses;

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">Recurring Bills & Income</h1>
        <p class="view-subtitle">Automated schedules feeding cash-flow projections and reminders</p>
      </div>
      <div class="view-actions">
        <button class="btn btn-primary" id="btn-add-recurring">
          ${getIcon('plus', 'icon-sm')} Add Recurring Rule
        </button>
      </div>
    </div>

    <!-- Recurring Totals Card -->
    <div class="card recurring-summary-card">
      <div class="recurring-kpi-block">
        <span class="kpi-lbl">Monthly Fixed Income</span>
        <span class="kpi-val text-emerald font-bold">${formatCurrency(monthlyTotalIncome, { hideDecimals: true })}/mo</span>
      </div>
      <div class="kpi-divider"></div>
      <div class="recurring-kpi-block">
        <span class="kpi-lbl">Monthly Fixed Expenses</span>
        <span class="kpi-val text-rose font-bold">${formatCurrency(monthlyTotalExpenses, { hideDecimals: true })}/mo</span>
      </div>
      <div class="kpi-divider"></div>
      <div class="recurring-kpi-block">
        <span class="kpi-lbl">Net Recurring Margin</span>
        <span class="kpi-val ${netMonthlyRecurring >= 0 ? 'text-emerald' : 'text-rose'} font-bold">
          ${formatCurrency(netMonthlyRecurring, { hideDecimals: true, showSign: true })}/mo
        </span>
      </div>
    </div>

    <!-- Recurring Items Table -->
    <div class="card recurring-table-card mt-6">
      <div class="table-responsive">
        <table class="table finance-table">
          <thead>
            <tr>
              <th>Name / Payee</th>
              <th>Category</th>
              <th>Account</th>
              <th>Frequency</th>
              <th>Next Due Date</th>
              <th class="text-right">Amount</th>
              <th class="text-center" style="width: 140px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${activeRules.length === 0 ? `
              <tr>
                <td colspan="7" class="text-center p-5 text-muted">
                  No active recurring rules found.
                </td>
              </tr>
            ` : activeRules.map(rule => {
              const cat = catMap[rule.categoryId] || { name: 'Bill', color: '#94a3b8', icon: 'tag' };
              const acc = accMap[rule.accountId] || { name: 'Account' };
              const toAcc = rule.toAccountId ? accMap[rule.toAccountId] : null;

              const isIncome = rule.type === 'income';
              const isTransfer = rule.type === 'transfer';
              const amountClass = isIncome ? 'text-emerald font-semibold' : 'text-rose font-semibold';
              const sign = isIncome ? '+' : isTransfer ? '⇆ ' : '-';

              return `
                <tr class="recurring-row" data-id="${rule.id}">
                  <td>
                    <div class="font-medium text-primary">${rule.name}</div>
                    <div class="text-xs text-muted">Started ${formatDate(rule.startDate, 'short')}</div>
                  </td>
                  <td>
                    <span class="badge badge-category" style="--cat-color: ${cat.color};">
                      ${getIcon(cat.icon, 'icon-xs')} ${cat.name}
                    </span>
                  </td>
                  <td class="text-secondary text-sm">
                    ${isTransfer && toAcc ? `${acc.name} &rarr; ${toAcc.name}` : acc.name}
                  </td>
                  <td>
                    <span class="badge badge-secondary text-xs uppercase">${rule.frequency}</span>
                  </td>
                  <td>
                    <span class="font-mono text-sm font-medium text-primary">${formatDate(rule.nextDueDate, 'short')}</span>
                    <div class="text-xs text-muted">${formatRelativeDate(rule.nextDueDate)}</div>
                  </td>
                  <td class="text-right font-mono ${amountClass}">
                    ${sign}${formatCurrency(rule.amount)}
                  </td>
                  <td class="text-center">
                    <div class="table-actions-group">
                      <button class="btn btn-sm btn-outline btn-post-now" data-id="${rule.id}" title="Post transaction to ledger now and advance due date">
                        ${getIcon('play', 'icon-xs')} Post
                      </button>
                      <button class="btn-icon btn-edit-recurring" data-id="${rule.id}" title="Edit">
                        ${getIcon('edit', 'icon-xs')}
                      </button>
                      <button class="btn-icon btn-icon-danger btn-delete-recurring" data-id="${rule.id}" title="Delete">
                        ${getIcon('trash', 'icon-xs')}
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // --- Attach Handlers ---
  container.querySelector('#btn-add-recurring')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('OPEN_RECURRING_MODAL'));
  });

  container.querySelectorAll('.btn-edit-recurring').forEach(btn => {
    btn.addEventListener('click', () => {
      const rule = recurring.find(r => r.id === btn.dataset.id);
      if (rule) {
        window.dispatchEvent(new CustomEvent('OPEN_RECURRING_MODAL', { detail: { rule } }));
      }
    });
  });

  container.querySelectorAll('.btn-delete-recurring').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (confirm('Delete this recurring schedule?')) {
        await state.deleteRecurring(id);
        renderRecurringView(container);
      }
    });
  });

  // Post to Ledger Now
  container.querySelectorAll('.btn-post-now').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const rule = recurring.find(r => r.id === id);
      if (!rule) return;

      // 1. Create transaction in ledger
      const newTx = {
        id: 'tx_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        date: rule.nextDueDate || getTodayISO(),
        description: rule.name,
        merchant: rule.name,
        amount: Number(rule.amount) || 0,
        type: rule.type,
        categoryId: rule.categoryId,
        accountId: rule.accountId,
        toAccountId: rule.toAccountId,
        recurringId: rule.id,
        isCleared: true,
        notes: `Automated post from recurring schedule (${rule.frequency})`
      };

      // 2. Advance next due date
      const updatedRule = {
        ...rule,
        nextDueDate: getNextOccurrence(rule.nextDueDate || getTodayISO(), rule.frequency)
      };

      await state.addTransaction(newTx);
      await state.saveRecurring(updatedRule);
      renderRecurringView(container);
    });
  });
}


/* --- MODULE: js/views/forecast.js --- */
/**
 * BudgetOS - Cash-Flow Forecast View Controller
 * Full timeline simulation, time horizon picker, safe buffer warning alerts,
 * interactive SVG trajectory graph, and scheduled cash flow events.
 */


let forecastHorizon = 90;
let safeBufferSetting = 500;
let includeDiscretionarySetting = false;

function renderForecastView(container) {
  const { accounts, transactions, recurring, categories } = state;
  const catMap = {};
  categories.forEach(c => { catMap[c.id] = c; });

  const forecast = generateCashFlowForecast({
    horizonDays: forecastHorizon,
    accounts,
    transactions,
    recurring,
    safeBuffer: safeBufferSetting,
    includeDiscretionary: includeDiscretionarySetting
  });

  // Extract scheduled event dates
  const scheduledDays = forecast.timeline.filter(t => t.events && t.events.length > 0);

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">Cash-Flow Forecast</h1>
        <p class="view-subtitle">Simulated liquid account balance timeline from ${formatDate(forecast.startDate, 'medium')} to ${formatDate(forecast.endDate, 'medium')}</p>
      </div>
      <div class="view-actions">
        <!-- Horizon Selector -->
        <div class="segmented-control" id="forecast-horizon-tabs">
          <button class="segment-btn ${forecastHorizon === 30 ? 'active' : ''}" data-horizon="30">30D</button>
          <button class="segment-btn ${forecastHorizon === 60 ? 'active' : ''}" data-horizon="60">60D</button>
          <button class="segment-btn ${forecastHorizon === 90 ? 'active' : ''}" data-horizon="90">90D</button>
          <button class="segment-btn ${forecastHorizon === 180 ? 'active' : ''}" data-horizon="180">180D</button>
          <button class="segment-btn ${forecastHorizon === 365 ? 'active' : ''}" data-horizon="365">1 Year</button>
        </div>
      </div>
    </div>

    <!-- Threshold Alert Banner if cash dips below safe buffer -->
    ${forecast.lowestBalance < safeBufferSetting ? `
      <div class="alert alert-warning mb-6">
        <div class="alert-icon">${getIcon('alert', 'icon-md')}</div>
        <div class="alert-content">
          <div class="alert-title">Low Cash-Flow Buffer Warning</div>
          <p class="alert-desc">
            Your projected liquid balance drops to <strong>${formatCurrency(forecast.lowestBalance)}</strong> on ${formatDate(forecast.lowestBalanceDate, 'medium')}, which is below your safe reserve buffer of ${formatCurrency(safeBufferSetting)}.
          </p>
        </div>
      </div>
    ` : ''}

    <!-- Forecast Scorecard Grid -->
    <div class="metrics-grid">
      <div class="metric-card">
        <span class="metric-label">Current Liquid Cash</span>
        <div class="metric-value text-primary">${formatCurrency(forecast.startBalance)}</div>
        <div class="metric-meta"><span>Checking + Savings + Cash</span></div>
      </div>
      <div class="metric-card">
        <span class="metric-label">Projected Ending Balance</span>
        <div class="metric-value font-bold ${forecast.endingBalance >= forecast.startBalance ? 'text-emerald' : 'text-rose'}">
          ${formatCurrency(forecast.endingBalance)}
        </div>
        <div class="metric-meta">
          <span>Net change: <strong class="${forecast.netChange >= 0 ? 'text-emerald' : 'text-rose'}">${formatCurrency(forecast.netChange, { showSign: true })}</strong></span>
        </div>
      </div>
      <div class="metric-card">
        <span class="metric-label">Lowest Projected Point</span>
        <div class="metric-value ${forecast.lowestBalance < safeBufferSetting ? 'text-warning' : 'text-primary'}">
          ${formatCurrency(forecast.lowestBalance)}
        </div>
        <div class="metric-meta"><span>Occurs on ${formatDate(forecast.lowestBalanceDate, 'short')}</span></div>
      </div>
      <div class="metric-card">
        <span class="metric-label">Projected Net Flow</span>
        <div class="metric-value text-primary font-mono">
          In: <span class="text-emerald">${formatCurrency(forecast.totalProjectedIncome, { hideDecimals: true })}</span>
        </div>
        <div class="metric-meta">
          <span>Out: <span class="text-rose">${formatCurrency(forecast.totalProjectedExpense, { hideDecimals: true })}</span></span>
        </div>
      </div>
    </div>

    <!-- Main Chart Card -->
    <div class="card forecast-main-chart-card mt-6">
      <div class="card-header">
        <div>
          <h2 class="card-title">Projected Balance Timeline</h2>
          <p class="card-subtitle">Deterministic balance evolution factoring in recurring transactions</p>
        </div>
        <div class="forecast-settings-inline">
          <label class="toggle-label text-xs">
            <input type="checkbox" id="toggle-discretionary" ${includeDiscretionarySetting ? 'checked' : ''} />
            Include Discretionary Spending Trend
          </label>
        </div>
      </div>
      <div class="card-body">
        ${renderForecastChart({
          timeline: forecast.timeline,
          safeBuffer: safeBufferSetting,
          width: 800,
          height: 280
        })}
      </div>
    </div>

    <!-- Scheduled Cash Flow Events Feed -->
    <div class="card scheduled-events-card mt-6">
      <div class="card-header">
        <h2 class="card-title">Scheduled Timeline Inflows & Outflows</h2>
        <span class="text-muted text-xs">${scheduledDays.length} transaction dates in horizon</span>
      </div>
      <div class="card-body p-0">
        ${scheduledDays.length === 0 ? `
          <div class="p-5 text-muted text-center">No recurring events scheduled in this period.</div>
        ` : `
          <div class="table-responsive">
            <table class="table finance-table">
              <thead>
                <tr>
                  <th>Scheduled Date</th>
                  <th>Event Name / Rule</th>
                  <th>Category</th>
                  <th>Frequency</th>
                  <th class="text-right">Projected Amount</th>
                  <th class="text-right">Balance After Event</th>
                </tr>
              </thead>
              <tbody>
                ${scheduledDays.slice(0, 15).map(day => {
                  return day.events.map(evt => {
                    const cat = catMap[evt.categoryId] || { name: 'Scheduled', color: '#94a3b8', icon: 'tag' };
                    const isIncome = evt.type === 'income';
                    return `
                      <tr>
                        <td class="font-mono text-xs text-muted">${formatDate(day.date, 'medium')}</td>
                        <td class="font-medium text-primary">${evt.name}</td>
                        <td>
                          <span class="badge badge-category" style="--cat-color: ${cat.color};">
                            ${getIcon(cat.icon, 'icon-xs')} ${cat.name}
                          </span>
                        </td>
                        <td><span class="badge badge-secondary text-xs uppercase">${evt.frequency}</span></td>
                        <td class="text-right font-mono font-semibold ${isIncome ? 'text-emerald' : 'text-rose'}">
                          ${isIncome ? '+' : '-'}${formatCurrency(evt.amount)}
                        </td>
                        <td class="text-right font-mono text-primary">${formatCurrency(day.balance)}</td>
                      </tr>
                    `;
                  }).join('');
                }).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    </div>
  `;

  // Attach Handlers
  container.querySelectorAll('#forecast-horizon-tabs .segment-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      forecastHorizon = parseInt(btn.dataset.horizon, 10);
      renderForecastView(container);
    });
  });

  container.querySelector('#toggle-discretionary')?.addEventListener('change', (e) => {
    includeDiscretionarySetting = e.target.checked;
    renderForecastView(container);
  });
}


/* --- MODULE: js/views/scenarios.js --- */
/**
 * BudgetOS - Scenario Builder & What-If Simulator View Controller
 * Sandboxed financial modeling environment comparing baseline forecast vs hypothetical scenario.
 */


let scenarioState = {
  incomePercentChange: 0,
  incomeFixedChange: 0,
  cutExpenseIds: [],
  addedExpenses: [
    { name: '', amount: 0, frequency: 'monthly' }
  ],
  horizonDays: 180
};

function renderScenariosView(container) {
  const { accounts, transactions, recurring, goals } = state;

  const simulation = runScenarioSimulation({
    accounts,
    transactions,
    recurring,
    goals,
    scenarioParams: scenarioState,
    horizonDays: scenarioState.horizonDays
  });

  const recurringExpenses = recurring.filter(r => r.type === 'expense');

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <div class="sandbox-badge">
          <span class="badge badge-scenario font-mono">SANDBOX SIMULATOR</span>
        </div>
        <h1 class="view-title">Financial Scenario Builder</h1>
        <p class="view-subtitle">Hypothetical modeling sandbox &bull; Safe testing with zero real database modifications</p>
      </div>
      <div class="view-actions">
        <button class="btn btn-secondary" id="btn-reset-scenario">
          ${getIcon('refresh', 'icon-sm')} Reset Sandbox
        </button>
      </div>
    </div>

    <!-- Comparative Delta Scorecard -->
    <div class="metrics-grid scenario-delta-grid">
      <!-- Ending Balance Delta -->
      <div class="metric-card scenario-metric-card">
        <span class="metric-label">Simulated Ending Balance</span>
        <div class="metric-value ${simulation.delta.endingBalanceDelta >= 0 ? 'text-emerald' : 'text-rose'} font-bold">
          ${formatCurrency(simulation.simulated.endingBalance)}
        </div>
        <div class="metric-meta">
          <span>Baseline: ${formatCurrency(simulation.baseline.endingBalance)}</span>
          <span>&bull;</span>
          <span class="font-bold font-mono ${simulation.delta.endingBalanceDelta >= 0 ? 'text-emerald' : 'text-rose'}">
            ${simulation.delta.endingBalanceDelta >= 0 ? '+' : ''}${formatCurrency(simulation.delta.endingBalanceDelta)}
          </span>
        </div>
      </div>

      <!-- Net Cash Flow Delta -->
      <div class="metric-card scenario-metric-card">
        <span class="metric-label">Net Flow Delta (over ${scenarioState.horizonDays}D)</span>
        <div class="metric-value font-mono ${simulation.delta.netCashFlowDelta >= 0 ? 'text-emerald' : 'text-rose'} font-bold">
          ${simulation.delta.netCashFlowDelta >= 0 ? '+' : ''}${formatCurrency(simulation.delta.netCashFlowDelta)}
        </div>
        <div class="metric-meta">
          <span>Income: ${formatCurrency(simulation.delta.incomeDelta, { showSign: true })}</span>
          <span>&bull;</span>
          <span>Spend: ${formatCurrency(simulation.delta.expenseDelta, { showSign: true })}</span>
        </div>
      </div>

      <!-- Lowest Trough Balance -->
      <div class="metric-card scenario-metric-card">
        <span class="metric-label">Simulated Lowest Point</span>
        <div class="metric-value ${simulation.simulated.lowestBalance < 500 ? 'text-warning' : 'text-primary'}">
          ${formatCurrency(simulation.simulated.lowestBalance)}
        </div>
        <div class="metric-meta">
          <span>Baseline lowest: ${formatCurrency(simulation.baseline.lowestBalance)}</span>
        </div>
      </div>

      <!-- Horizon Selector -->
      <div class="metric-card scenario-metric-card">
        <span class="metric-label">Simulation Horizon</span>
        <select id="scenario-horizon-select" class="form-control mt-1">
          <option value="90" ${scenarioState.horizonDays === 90 ? 'selected' : ''}>90 Days (3 Months)</option>
          <option value="180" ${scenarioState.horizonDays === 180 ? 'selected' : ''}>180 Days (6 Months)</option>
          <option value="365" ${scenarioState.horizonDays === 365 ? 'selected' : ''}>365 Days (1 Year)</option>
        </select>
      </div>
    </div>

    <!-- Dual Line Comparison Chart -->
    <div class="card scenario-chart-card mt-6">
      <div class="card-header">
        <div>
          <h2 class="card-title">Trajectory Comparison: Current Plan vs Scenario</h2>
          <p class="card-subtitle">Visualizing divergence in future liquid capital</p>
        </div>
      </div>
      <div class="card-body">
        ${renderScenarioComparisonChart({
          baselineTimeline: simulation.baseline.timeline,
          simulatedTimeline: simulation.simulated.timeline,
          width: 800,
          height: 260
        })}
      </div>
    </div>

    <!-- Levers & Adjustments Grid -->
    <div class="scenario-levers-grid mt-6">
      
      <!-- Lever 1: Income Adjustments -->
      <div class="card lever-card">
        <div class="card-header">
          <h3 class="card-title">${getIcon('salary', 'icon-sm')} Adjust Income</h3>
        </div>
        <div class="card-body">
          <div class="form-group mb-4">
            <label class="form-label text-xs">Income Percentage Change: <strong id="val-income-percent">${scenarioState.incomePercentChange}%</strong></label>
            <input
              type="range"
              id="slider-income-percent"
              class="form-range"
              min="-50"
              max="50"
              step="5"
              value="${scenarioState.incomePercentChange}"
            />
            <div class="range-marks text-xs text-muted">
              <span>-50%</span>
              <span>0%</span>
              <span>+50%</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label text-xs">Or Fixed Monthly Amount (+/-)</label>
            <input
              type="number"
              id="input-income-fixed"
              class="form-control"
              placeholder="e.g. 500 for raise, -300 for drop"
              value="${scenarioState.incomeFixedChange || ''}"
            />
          </div>
        </div>
      </div>

      <!-- Lever 2: Cut Existing Recurring Expenses -->
      <div class="card lever-card">
        <div class="card-header">
          <h3 class="card-title">${getIcon('trash', 'icon-sm')} Cut Recurring Expenses</h3>
        </div>
        <div class="card-body">
          ${recurringExpenses.length === 0 ? `
            <p class="text-muted text-sm">No recurring expenses found to cut.</p>
          ` : `
            <div class="checkbox-list">
              ${recurringExpenses.map(r => {
                const isCut = scenarioState.cutExpenseIds.includes(r.id);
                return `
                  <label class="checkbox-row ${isCut ? 'item-cut' : ''}">
                    <input
                      type="checkbox"
                      class="chk-cut-expense"
                      data-id="${r.id}"
                      ${isCut ? 'checked' : ''}
                    />
                    <span class="chk-label font-medium">${r.name}</span>
                    <span class="chk-amount font-mono text-rose">-${formatCurrency(r.amount)}</span>
                  </label>
                `;
              }).join('')}
            </div>
          `}
        </div>
      </div>

      <!-- Lever 3: Add Hypothetical Ongoing Expenses -->
      <div class="card lever-card col-span-full">
        <div class="card-header">
          <h3 class="card-title">${getIcon('plus', 'icon-sm')} Add Hypothetical Expenses</h3>
          <button class="btn btn-sm btn-secondary" id="btn-add-hypothetical-row">
            + Add Another Expense
          </button>
        </div>
        <div class="card-body">
          <div class="hypo-expenses-list">
            ${scenarioState.addedExpenses.map((exp, idx) => `
              <div class="hypo-expense-row mb-3" data-idx="${idx}">
                <input
                  type="text"
                  class="form-control hypo-name"
                  placeholder="Expense description (e.g. Car Lease, Studio Rent)"
                  value="${exp.name}"
                />
                <input
                  type="number"
                  class="form-control hypo-amount"
                  placeholder="Amount ($)"
                  value="${exp.amount || ''}"
                />
                <select class="form-control hypo-freq">
                  <option value="monthly" ${exp.frequency === 'monthly' ? 'selected' : ''}>Monthly</option>
                  <option value="weekly" ${exp.frequency === 'weekly' ? 'selected' : ''}>Weekly</option>
                  <option value="yearly" ${exp.frequency === 'yearly' ? 'selected' : ''}>Yearly</option>
                </select>
                <button class="btn-icon btn-icon-danger btn-remove-hypo" data-idx="${idx}">
                  ${getIcon('close', 'icon-xs')}
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

    </div>

    <!-- Impact on Goals Table -->
    ${simulation.goalImpacts.length > 0 ? `
      <div class="card scenario-goals-card mt-6">
        <div class="card-header">
          <h2 class="card-title">Impact on Savings Goals</h2>
          <p class="card-subtitle">How this scenario accelerates or delays your targeted milestones</p>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table finance-table">
              <thead>
                <tr>
                  <th>Goal Milestone</th>
                  <th>Target Amount</th>
                  <th>Baseline Time to Goal</th>
                  <th>Simulated Time to Goal</th>
                  <th>Impact</th>
                </tr>
              </thead>
              <tbody>
                ${simulation.goalImpacts.map(g => `
                  <tr>
                    <td class="font-medium text-primary">${g.goalName}</td>
                    <td class="font-mono">${formatCurrency(g.targetAmount)}</td>
                    <td class="font-mono text-muted">${g.baselineMonthsNeeded} months</td>
                    <td class="font-mono font-semibold text-primary">${g.simulatedMonthsNeeded} months</td>
                    <td>
                      ${g.monthsSaved > 0 ? `
                        <span class="badge badge-success font-mono font-semibold">
                          ${getIcon('trendUp', 'icon-xs')} Reached ${g.monthsSaved} mo earlier
                        </span>
                      ` : g.monthsSaved < 0 ? `
                        <span class="badge badge-danger font-mono font-semibold">
                          ${getIcon('trendDown', 'icon-xs')} Delayed by ${Math.abs(g.monthsSaved)} mo
                        </span>
                      ` : `<span class="badge badge-secondary">No change</span>`}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ` : ''}
  `;

  // --- Handlers ---
  container.querySelector('#slider-income-percent')?.addEventListener('input', (e) => {
    scenarioState.incomePercentChange = parseInt(e.target.value, 10);
    renderScenariosView(container);
  });

  container.querySelector('#input-income-fixed')?.addEventListener('change', (e) => {
    scenarioState.incomeFixedChange = parseFloat(e.target.value) || 0;
    renderScenariosView(container);
  });

  container.querySelector('#scenario-horizon-select')?.addEventListener('change', (e) => {
    scenarioState.horizonDays = parseInt(e.target.value, 10);
    renderScenariosView(container);
  });

  container.querySelectorAll('.chk-cut-expense').forEach(chk => {
    chk.addEventListener('change', (e) => {
      const id = chk.dataset.id;
      if (e.target.checked) {
        if (!scenarioState.cutExpenseIds.includes(id)) {
          scenarioState.cutExpenseIds.push(id);
        }
      } else {
        scenarioState.cutExpenseIds = scenarioState.cutExpenseIds.filter(x => x !== id);
      }
      renderScenariosView(container);
    });
  });

  container.querySelector('#btn-add-hypothetical-row')?.addEventListener('click', () => {
    scenarioState.addedExpenses.push({ name: '', amount: 0, frequency: 'monthly' });
    renderScenariosView(container);
  });

  container.querySelectorAll('.hypo-expense-row').forEach(row => {
    const idx = parseInt(row.dataset.idx, 10);
    row.querySelector('.hypo-name')?.addEventListener('change', (e) => {
      scenarioState.addedExpenses[idx].name = e.target.value;
      renderScenariosView(container);
    });
    row.querySelector('.hypo-amount')?.addEventListener('change', (e) => {
      scenarioState.addedExpenses[idx].amount = parseFloat(e.target.value) || 0;
      renderScenariosView(container);
    });
    row.querySelector('.hypo-freq')?.addEventListener('change', (e) => {
      scenarioState.addedExpenses[idx].frequency = e.target.value;
      renderScenariosView(container);
    });
    row.querySelector('.btn-remove-hypo')?.addEventListener('click', () => {
      scenarioState.addedExpenses.splice(idx, 1);
      renderScenariosView(container);
    });
  });

  container.querySelector('#btn-reset-scenario')?.addEventListener('click', () => {
    scenarioState = {
      incomePercentChange: 0,
      incomeFixedChange: 0,
      cutExpenseIds: [],
      addedExpenses: [{ name: '', amount: 0, frequency: 'monthly' }],
      horizonDays: 180
    };
    renderScenariosView(container);
  });
}


/* --- MODULE: js/views/reports.js --- */
/**
 * BudgetOS - Reports & Analytics View Controller
 * Comprehensive category breakdowns, monthly income/expense trends,
 * savings rate trajectories, top merchant stats, and printable statement generator.
 */


let reportPeriod = 'thisMonth'; // 'thisMonth', 'all'

function renderReportsView(container) {
  const { transactions, categories, accounts } = state;
  const currentMonthKey = getMonthKey();
  const filterMonth = reportPeriod === 'thisMonth' ? currentMonthKey : null;

  const categoryBreakdown = getCategorySpendingBreakdown(transactions, categories, filterMonth);
  const monthlyTrends = getMonthlyTrends(transactions, 6);
  const topMerchants = getTopMerchants(transactions, 5, filterMonth);
  const anomalies = detectSpendingAnomalies(transactions, categories);
  const balanceData = calculateAccountBalances(accounts, transactions);

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">Financial Reports & Trends</h1>
        <p class="view-subtitle">Spending patterns, category allocations, and historical cash-flow velocity</p>
      </div>
      <div class="view-actions">
        <!-- Period Toggle -->
        <div class="segmented-control" id="report-period-tabs">
          <button class="segment-btn ${reportPeriod === 'thisMonth' ? 'active' : ''}" data-period="thisMonth">
            This Month (${formatMonthKey(currentMonthKey)})
          </button>
          <button class="segment-btn ${reportPeriod === 'all' ? 'active' : ''}" data-period="all">
            All Time
          </button>
        </div>

        <button class="btn btn-secondary" id="btn-print-report">
          ${getIcon('printer', 'icon-sm')} Print Statement
        </button>
      </div>
    </div>

    <!-- Reports Grid: Donut + Monthly Bars -->
    <div class="reports-main-grid">
      
      <!-- Category Spending Donut Chart Card -->
      <div class="card report-chart-card">
        <div class="card-header">
          <div>
            <h2 class="card-title">Spending by Category</h2>
            <p class="card-subtitle">Total: <strong class="text-rose font-mono">${formatCurrency(categoryBreakdown.totalExpense)}</strong></p>
          </div>
        </div>
        <div class="card-body">
          <div class="donut-and-legend-layout">
            <div class="donut-visual-col">
              ${renderDonutChart({
                data: categoryBreakdown.items,
                size: 210,
                strokeWidth: 26,
                centerTitle: 'Total Spent',
                centerValue: formatCurrency(categoryBreakdown.totalExpense, { hideDecimals: true })
              })}
            </div>
            <div class="category-legend-col">
              <div class="category-legend-list">
                ${categoryBreakdown.items.slice(0, 6).map(item => `
                  <div class="legend-row">
                    <div class="legend-meta">
                      <span class="cat-color-dot" style="background-color: ${item.color || '#3b82f6'};"></span>
                      <span class="legend-cat-name font-medium text-xs text-primary">${item.name}</span>
                    </div>
                    <div class="legend-values text-xs font-mono">
                      <strong>${formatCurrency(item.amount)}</strong>
                      <span class="text-muted">(${item.percentage}%)</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Trends Grouped Bar Chart -->
      <div class="card report-chart-card">
        <div class="card-header">
          <div>
            <h2 class="card-title">Income vs Expenses (Last 6 Months)</h2>
            <p class="card-subtitle">Historical cash-flow trajectory</p>
          </div>
        </div>
        <div class="card-body">
          ${renderMonthlyTrendBars({
            trendData: monthlyTrends,
            width: 540,
            height: 220
          })}
        </div>
      </div>

    </div>

    <!-- Second Row: Monthly Trends Table & Top Merchants -->
    <div class="reports-secondary-grid mt-6">
      
      <!-- Monthly Trend Breakdown Table -->
      <div class="card report-table-card">
        <div class="card-header">
          <h2 class="card-title">Historical Monthly Performance</h2>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table finance-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th class="text-right">Income</th>
                  <th class="text-right">Expenses</th>
                  <th class="text-right">Net Savings</th>
                  <th class="text-right">Savings Rate</th>
                </tr>
              </thead>
              <tbody>
                ${monthlyTrends.map(m => `
                  <tr>
                    <td class="font-medium text-primary">${m.label}</td>
                    <td class="text-right font-mono text-emerald">${formatCurrency(m.income)}</td>
                    <td class="text-right font-mono text-rose">${formatCurrency(m.expense)}</td>
                    <td class="text-right font-mono font-semibold ${m.netSavings >= 0 ? 'text-emerald' : 'text-rose'}">
                      ${formatCurrency(m.netSavings, { showSign: true })}
                    </td>
                    <td class="text-right font-mono ${m.savingsRate >= 20 ? 'text-emerald font-semibold' : 'text-primary'}">
                      ${formatPercent(m.savingsRate)}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Top Merchants Leaderboard -->
      <div class="card report-merchants-card">
        <div class="card-header">
          <h2 class="card-title">Top Merchant Outflows</h2>
          <span class="text-xs text-muted">Highest expense destinations</span>
        </div>
        <div class="card-body p-0">
          ${topMerchants.length === 0 ? `
            <div class="p-4 text-muted text-sm">No expenses recorded.</div>
          ` : `
            <div class="merchants-list">
              ${topMerchants.map((m, idx) => `
                <div class="merchant-rank-row">
                  <span class="merchant-rank-num font-mono text-muted text-xs">#${idx + 1}</span>
                  <div class="merchant-rank-info">
                    <span class="merchant-rank-name font-medium text-primary">${m.name}</span>
                    <span class="merchant-rank-count text-muted text-xs">${m.count} transactions</span>
                  </div>
                  <span class="merchant-rank-amt font-mono text-rose font-semibold">${formatCurrency(m.total)}</span>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>

    </div>

    <!-- Anomaly Review Section -->
    ${anomalies.length > 0 ? `
      <div class="card anomalies-report-card mt-6">
        <div class="card-header">
          <h2 class="card-title">${getIcon('alert', 'icon-sm')} Detected Spending Outliers (${anomalies.length})</h2>
          <p class="card-subtitle">Statistical outlier heuristic flags for your review</p>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table finance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Merchant / Item</th>
                  <th>Category</th>
                  <th class="text-right">Amount</th>
                  <th>Category Average</th>
                  <th>Anomaly Factor</th>
                </tr>
              </thead>
              <tbody>
                ${anomalies.map(a => `
                  <tr>
                    <td class="font-mono text-xs text-muted">${formatDate(a.date, 'medium')}</td>
                    <td class="font-medium text-primary">${a.merchant || a.description}</td>
                    <td>
                      <span class="badge badge-category" style="--cat-color: ${a.categoryColor};">
                        ${a.categoryName}
                      </span>
                    </td>
                    <td class="text-right font-mono font-bold text-rose">${formatCurrency(a.amount)}</td>
                    <td class="font-mono text-muted">${formatCurrency(a.categoryAverage)}</td>
                    <td>
                      <span class="badge badge-warning font-mono">
                        ${a.ratioMultiplier}x normal
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ` : ''}

    <!-- Hidden Print Container Formatted for Boardroom Statement -->
    <div id="print-statement-section" class="print-only">
      <div class="print-statement-header">
        <div class="print-brand">
          <h1>BudgetOS Financial Statement</h1>
          <p>Generated: ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}</p>
        </div>
        <div class="print-net-worth">
          <span class="print-lbl">Net Worth</span>
          <h2>${formatCurrency(balanceData.summary.netWorth)}</h2>
        </div>
      </div>

      <div class="print-accounts-grid">
        <h3>Accounts Summary</h3>
        <table class="print-table">
          <thead>
            <tr><th>Account</th><th>Type</th><th class="text-right">Balance</th></tr>
          </thead>
          <tbody>
            ${Object.values(balanceData.accounts).map(a => `
              <tr>
                <td>${a.name}</td>
                <td>${a.type.toUpperCase()}</td>
                <td class="text-right font-mono">${formatCurrency(a.currentBalance)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="print-trends-section mt-4">
        <h3>Monthly Performance (6 Months)</h3>
        <table class="print-table">
          <thead>
            <tr><th>Month</th><th class="text-right">Income</th><th class="text-right">Expenses</th><th class="text-right">Net Savings</th><th class="text-right">Savings Rate</th></tr>
          </thead>
          <tbody>
            ${monthlyTrends.map(m => `
              <tr>
                <td>${m.label}</td>
                <td class="text-right font-mono">${formatCurrency(m.income)}</td>
                <td class="text-right font-mono">${formatCurrency(m.expense)}</td>
                <td class="text-right font-mono font-bold">${formatCurrency(m.netSavings)}</td>
                <td class="text-right font-mono">${formatPercent(m.savingsRate)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Attach Handlers
  container.querySelectorAll('#report-period-tabs .segment-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      reportPeriod = btn.dataset.period;
      renderReportsView(container);
    });
  });

  container.querySelector('#btn-print-report')?.addEventListener('click', () => {
    window.print();
  });
}


/* --- MODULE: js/views/data-hub.js --- */
/**
 * BudgetOS - Data Hub & CSV Import Wizard Controller
 * CSV transaction import with visual column mapping, full JSON database backup/restore,
 * demo dataset seeder, and regional currency settings.
 */


let csvWizardState = {
  step: 1, // 1: upload, 2: map, 3: preview
  rawLines: [],
  headers: [],
  mappings: {
    date: 0,
    description: 1,
    amount: 2,
    category: -1,
    type: -1
  },
  targetAccountId: '',
  parsedRows: []
};

function renderDataHubView(container) {
  const { accounts, categories, settings } = state;
  const currentCurrency = settings.currency || 'USD';
  const supportedCurrencies = getSupportedCurrencies();

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1 class="view-title">Data Management & Import Wizard</h1>
        <p class="view-subtitle">CSV transaction ingestion, complete JSON backups, privacy controls, and sample profiles</p>
      </div>
    </div>

    <div class="data-hub-grid">
      
      <!-- Section 1: CSV Import Wizard Card -->
      <div class="card data-hub-card col-span-full">
        <div class="card-header">
          <div>
            <h2 class="card-title">${getIcon('upload', 'icon-sm')} CSV Transaction Import Wizard</h2>
            <p class="card-subtitle">Import bank or credit card exports with custom column mapping</p>
          </div>
          <span class="badge badge-primary">Step ${csvWizardState.step} of 3</span>
        </div>
        <div class="card-body">
          ${renderWizardStep(accounts, categories)}
        </div>
      </div>

      <!-- Section 2: Demo Data & Sample Profiles -->
      <div class="card data-hub-card">
        <div class="card-header">
          <h2 class="card-title">${getIcon('sparkles', 'icon-sm')} Demo Financial Profile</h2>
        </div>
        <div class="card-body">
          <p class="text-sm text-secondary mb-4">
            Populate BudgetOS with a realistic 90-day personal finance dataset including 4 accounts, 40+ transactions, active category budgets, savings goals, and recurring payroll/bills.
          </p>
          <button class="btn btn-secondary w-full" id="btn-seed-demo">
            ${getIcon('sparkles', 'icon-xs')} Load 90-Day Demo Profile
          </button>
        </div>
      </div>

      <!-- Section 3: Backup & Restore JSON -->
      <div class="card data-hub-card">
        <div class="card-header">
          <h2 class="card-title">${getIcon('dataHub', 'icon-sm')} Backup & Restore</h2>
        </div>
        <div class="card-body">
          <p class="text-sm text-secondary mb-4">
            BudgetOS stores all data locally in your browser's IndexedDB. Export a complete JSON snapshot for safe keeping or transfer to another device.
          </p>
          <div class="backup-actions-row">
            <button class="btn btn-secondary" id="btn-export-json">
              ${getIcon('download', 'icon-xs')} Export JSON Backup
            </button>
            <label class="btn btn-outline cursor-pointer mb-0">
              ${getIcon('upload', 'icon-xs')} Restore JSON
              <input type="file" id="input-restore-json" accept=".json" style="display: none;" />
            </label>
          </div>
        </div>
      </div>

      <!-- Section 4: Regional Currency Setting -->
      <div class="card data-hub-card">
        <div class="card-header">
          <h2 class="card-title">${getIcon('transactions', 'icon-sm')} Currency & Formatting</h2>
        </div>
        <div class="card-body">
          <div class="form-group mb-0">
            <label class="form-label text-xs">Active Display Currency</label>
            <select id="select-active-currency" class="form-control">
              ${supportedCurrencies.map(c => `
                <option value="${c.code}" ${c.code === currentCurrency ? 'selected' : ''}>
                  ${c.label}
                </option>
              `).join('')}
            </select>
          </div>
        </div>
      </div>

      <!-- Section 5: Reset Data -->
      <div class="card data-hub-card border-danger">
        <div class="card-header">
          <h2 class="card-title text-rose">${getIcon('trash', 'icon-sm')} Factory Reset</h2>
        </div>
        <div class="card-body">
          <p class="text-sm text-secondary mb-4">
            Erase all local accounts, transactions, budgets, and goals, restoring default empty state.
          </p>
          <button class="btn btn-danger w-full" id="btn-reset-db">
            Clear All Application Data
          </button>
        </div>
      </div>

    </div>
  `;

  // --- Wizard Step Renderer ---
  function renderWizardStep(accs, cats) {
    if (csvWizardState.step === 1) {
      return `
        <div class="wizard-step-1">
          <div class="dropzone-area" id="csv-dropzone">
            <div class="dropzone-icon">${getIcon('upload', 'icon-lg')}</div>
            <div class="dropzone-text font-medium">Drag & drop your bank CSV file here</div>
            <div class="dropzone-sub text-muted text-xs">or click to browse from computer</div>
            <input type="file" id="csv-file-input" accept=".csv,text/csv" style="display: none;" />
          </div>

          <div class="or-divider text-center my-4 text-xs text-muted">OR PASTE RAW CSV CONTENT</div>

          <div class="form-group">
            <textarea id="csv-paste-input" class="form-control font-mono text-xs" rows="4" placeholder="Date,Description,Amount&#10;2026-08-01,Groceries Supermarket,-45.50&#10;2026-08-03,Direct Deposit Payroll,2500.00"></textarea>
          </div>

          <div class="wizard-footer text-right">
            <button class="btn btn-primary" id="btn-wizard-step1-next">
              Next: Map Columns ${getIcon('arrowRight', 'icon-xs')}
            </button>
          </div>
        </div>
      `;
    }

    if (csvWizardState.step === 2) {
      const headers = csvWizardState.headers;
      return `
        <div class="wizard-step-2">
          <p class="text-sm text-secondary mb-4">
            Match the columns in your CSV file with the BudgetOS transaction fields:
          </p>

          <div class="form-group mb-4">
            <label class="form-label font-semibold text-xs">Assign Transactions to Account *</label>
            <select id="wizard-account-select" class="form-control">
              ${accs.map(a => `
                <option value="${a.id}" ${a.id === csvWizardState.targetAccountId ? 'selected' : ''}>
                  ${a.name} (${a.type})
                </option>
              `).join('')}
            </select>
          </div>

          <div class="mapping-grid">
            <div class="form-group">
              <label class="form-label text-xs font-semibold">Date Column *</label>
              <select class="form-control mapping-select" data-field="date">
                ${headers.map((h, i) => `
                  <option value="${i}" ${i === csvWizardState.mappings.date ? 'selected' : ''}>Column ${i + 1}: ${h}</option>
                `).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label text-xs font-semibold">Merchant / Description *</label>
              <select class="form-control mapping-select" data-field="description">
                ${headers.map((h, i) => `
                  <option value="${i}" ${i === csvWizardState.mappings.description ? 'selected' : ''}>Column ${i + 1}: ${h}</option>
                `).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label text-xs font-semibold">Amount Column *</label>
              <select class="form-control mapping-select" data-field="amount">
                ${headers.map((h, i) => `
                  <option value="${i}" ${i === csvWizardState.mappings.amount ? 'selected' : ''}>Column ${i + 1}: ${h}</option>
                `).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label text-xs font-semibold">Category Column (Optional)</label>
              <select class="form-control mapping-select" data-field="category">
                <option value="-1">-- Auto Assign / Default --</option>
                ${headers.map((h, i) => `
                  <option value="${i}" ${i === csvWizardState.mappings.category ? 'selected' : ''}>Column ${i + 1}: ${h}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <div class="wizard-footer flex justify-between mt-6">
            <button class="btn btn-secondary" id="btn-wizard-back-1">
              ${getIcon('arrowLeft', 'icon-xs')} Back
            </button>
            <button class="btn btn-primary" id="btn-wizard-step2-next">
              Preview Parsed Rows ${getIcon('arrowRight', 'icon-xs')}
            </button>
          </div>
        </div>
      `;
    }

    if (csvWizardState.step === 3) {
      const rows = csvWizardState.parsedRows;
      return `
        <div class="wizard-step-3">
          <p class="text-sm text-secondary mb-3">
            Review <strong>${rows.length}</strong> transactions ready for import:
          </p>

          <div class="table-responsive max-h-80 overflow-y-auto mb-4 border rounded">
            <table class="table finance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th class="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${rows.slice(0, 10).map(r => `
                  <tr>
                    <td class="font-mono text-xs">${r.date}</td>
                    <td class="font-medium">${r.description}</td>
                    <td><span class="badge ${r.type === 'income' ? 'badge-success' : 'badge-danger'}">${r.type}</span></td>
                    <td class="text-right font-mono font-semibold ${r.type === 'income' ? 'text-emerald' : 'text-rose'}">$${r.amount.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ${rows.length > 10 ? `<p class="text-xs text-muted text-center mb-4">...and ${rows.length - 10} more rows</p>` : ''}

          <div class="wizard-footer flex justify-between">
            <button class="btn btn-secondary" id="btn-wizard-back-2">
              ${getIcon('arrowLeft', 'icon-xs')} Back to Mapping
            </button>
            <button class="btn btn-primary" id="btn-wizard-execute-import">
              ${getIcon('check', 'icon-xs')} Confirm & Import ${rows.length} Transactions
            </button>
          </div>
        </div>
      `;
    }
  }

  // --- Attach Handlers ---

  // Dropzone click
  const dropzone = container.querySelector('#csv-dropzone');
  const fileInput = container.querySelector('#csv-file-input');
  dropzone?.addEventListener('click', () => fileInput?.click());

  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target.result;
        processCSVInput(text);
      };
      reader.readAsText(file);
    }
  });

  // Step 1 Next
  container.querySelector('#btn-wizard-step1-next')?.addEventListener('click', () => {
    const text = container.querySelector('#csv-paste-input')?.value;
    if (text && text.trim()) {
      processCSVInput(text);
    } else {
      alert('Please select a CSV file or paste CSV content first.');
    }
  });

  function processCSVInput(text) {
    const parsed = parseCSV(text);
    if (parsed.length < 2) {
      alert('CSV must contain a header row and at least 1 data row.');
      return;
    }
    csvWizardState.rawLines = parsed;
    csvWizardState.headers = parsed[0];
    csvWizardState.targetAccountId = accounts[0]?.id || '';

    // Auto guess column indices
    parsed[0].forEach((header, idx) => {
      const h = header.toLowerCase();
      if (h.includes('date')) csvWizardState.mappings.date = idx;
      if (h.includes('desc') || h.includes('merchant') || h.includes('name') || h.includes('payee')) csvWizardState.mappings.description = idx;
      if (h.includes('amount') || h.includes('total') || h.includes('price') || h.includes('sum')) csvWizardState.mappings.amount = idx;
      if (h.includes('cat')) csvWizardState.mappings.category = idx;
    });

    csvWizardState.step = 2;
    renderDataHubView(container);
  }

  // Step 2 Mapping selection
  container.querySelectorAll('.mapping-select').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const field = sel.dataset.field;
      csvWizardState.mappings[field] = parseInt(e.target.value, 10);
    });
  });

  container.querySelector('#wizard-account-select')?.addEventListener('change', (e) => {
    csvWizardState.targetAccountId = e.target.value;
  });

  container.querySelector('#btn-wizard-back-1')?.addEventListener('click', () => {
    csvWizardState.step = 1;
    renderDataHubView(container);
  });

  container.querySelector('#btn-wizard-step2-next')?.addEventListener('click', () => {
    // Parse rows based on mappings
    const rows = [];
    const { date: dIdx, description: descIdx, amount: amtIdx } = csvWizardState.mappings;
    
    for (let i = 1; i < csvWizardState.rawLines.length; i++) {
      const line = csvWizardState.rawLines[i];
      if (line.length <= 1) continue;

      let dateVal = line[dIdx] || new Date().toISOString().split('T')[0];
      // Clean date
      if (dateVal.includes('/')) {
        const parts = dateVal.split('/');
        if (parts.length === 3) {
          dateVal = `${parts[2].length === 2 ? '20' + parts[2] : parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
        }
      }

      const descVal = line[descIdx] || 'Imported Transaction';
      let rawAmt = (line[amtIdx] || '0').replace(/[^0-9.-]/g, '');
      let amtNum = parseFloat(rawAmt) || 0;

      const isNegative = amtNum < 0 || rawAmt.startsWith('-');
      const absAmount = Math.abs(amtNum);
      const type = isNegative ? 'expense' : 'income';

      rows.push({
        id: 'tx_imp_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        date: dateVal,
        description: descVal,
        merchant: descVal,
        amount: absAmount,
        type,
        accountId: csvWizardState.targetAccountId || accounts[0]?.id || 'acc_checking',
        categoryId: type === 'income' ? 'cat_salary' : 'cat_misc',
        isCleared: true,
        notes: 'Imported via CSV Wizard'
      });
    }

    csvWizardState.parsedRows = rows;
    csvWizardState.step = 3;
    renderDataHubView(container);
  });

  container.querySelector('#btn-wizard-back-2')?.addEventListener('click', () => {
    csvWizardState.step = 2;
    renderDataHubView(container);
  });

  container.querySelector('#btn-wizard-execute-import')?.addEventListener('click', async () => {
    for (const tx of csvWizardState.parsedRows) {
      await state.addTransaction(tx);
    }
    alert(`Successfully imported ${csvWizardState.parsedRows.length} transactions!`);
    csvWizardState = {
      step: 1,
      rawLines: [],
      headers: [],
      mappings: { date: 0, description: 1, amount: 2, category: -1, type: -1 },
      targetAccountId: '',
      parsedRows: []
    };
    state.activeView = 'transactions';
    state.notify('VIEW_CHANGED');
  });

  // Seed demo data
  container.querySelector('#btn-seed-demo')?.addEventListener('click', async () => {
    if (confirm('Load demo 90-day financial profile? This will populate realistic sample accounts, budgets, and transactions.')) {
      await seedDemoData();
      await state.loadFromDB();
      state.activeView = 'dashboard';
      state.notify('VIEW_CHANGED');
    }
  });

  // JSON Export
  container.querySelector('#btn-export-json')?.addEventListener('click', async () => {
    const backup = await exportAllData();
    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BudgetOS_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // JSON Restore
  container.querySelector('#input-restore-json')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const payload = JSON.parse(evt.target.result);
          await importAllData(payload);
          await state.loadFromDB();
          alert('Backup restored successfully!');
          renderDataHubView(container);
        } catch (err) {
          alert('Failed to restore backup: Invalid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  });

  // Currency select
  container.querySelector('#select-active-currency')?.addEventListener('change', async (e) => {
    const newCurr = e.target.value;
    await state.saveSetting('currency', newCurr);
    renderDataHubView(container);
  });

  // Reset database
  container.querySelector('#btn-reset-db')?.addEventListener('click', async () => {
    if (confirm('WARNING: Are you sure you want to permanently clear all data and start completely fresh?')) {
      await resetAllData();
      await state.loadFromDB();
      state.activeView = 'dashboard';
      state.notify('VIEW_CHANGED');
    }
  });
}


/* --- MODULE: js/app.js --- */
/**
 * BudgetOS - Main Application Bootstrap & Orchestrator
 * Routing, Navigation, Theme Engine, Modal Management, Keyboard Shortcuts & Undo Toast.
 */


// Views

class BudgetOSApp {
  constructor() {
    this.viewContainer = document.getElementById('main-workspace');
    this.modalContainer = document.getElementById('modal-container');
    this.toastContainer = document.getElementById('toast-container');
    this.sidebar = document.getElementById('app-sidebar');
  }

  async init() {
    // 1. Set theme immediately
    const theme = localStorage.getItem('budgetos_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);

    // 2. Setup Navigation & UI Listeners immediately
    this.setupNavigation();
    this.setupGlobalListeners();
    this.setupModalEvents();
    this.setupShortcuts();

    // 3. Initialize DB and load state
    try {
      await initDB();
      await state.loadFromDB();

      // If first time launch and no accounts exist, offer to load demo data or initialize
      if (state.accounts.length === 0 && state.transactions.length === 0) {
        await seedDemoData();
        await state.loadFromDB();
      }
    } catch (err) {
      console.warn('Database initialization warning:', err);
    }

    // 4. Render initial view
    this.renderCurrentView();
  }

  setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = link.dataset.view;
        if (targetView && targetView !== state.activeView) {
          state.activeView = targetView;
          this.renderCurrentView();
        }
      });
    });

    // Theme Toggle
    const themeToggleBtn = document.getElementById('btn-theme-toggle');
    themeToggleBtn?.addEventListener('click', async () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      await state.saveSetting('theme', nextTheme);
      this.updateThemeIcon(nextTheme);
    });
    this.updateThemeIcon(document.documentElement.getAttribute('data-theme') || 'dark');

    // Mobile Sidebar Toggle
    const sidebarToggleBtn = document.getElementById('btn-mobile-sidebar-toggle');
    sidebarToggleBtn?.addEventListener('click', () => {
      this.sidebar.classList.toggle('open');
    });

    // Topbar quick transaction button
    document.getElementById('btn-topbar-new-tx')?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('OPEN_TRANSACTION_MODAL'));
    });
  }

  updateThemeIcon(currentTheme) {
    const themeToggleBtn = document.getElementById('btn-theme-toggle');
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = currentTheme === 'dark' ? getIcon('sun', 'icon-sm') : getIcon('moon', 'icon-sm');
      themeToggleBtn.setAttribute('title', `Switch to ${currentTheme === 'dark' ? 'Light' : 'Dark'} mode`);
    }
  }

  renderCurrentView() {
    // Update active nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.dataset.view === state.activeView) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Close mobile sidebar if open
    this.sidebar?.classList.remove('open');

    // Scroll to top
    this.viewContainer.scrollTop = 0;

    // Route view
    switch (state.activeView) {
      case 'dashboard':
        renderDashboardView(this.viewContainer);
        break;
      case 'transactions':
        renderTransactionsView(this.viewContainer);
        break;
      case 'accounts':
        renderAccountsView(this.viewContainer);
        break;
      case 'budgets':
        renderBudgetsView(this.viewContainer);
        break;
      case 'goals':
        renderGoalsView(this.viewContainer);
        break;
      case 'recurring':
        renderRecurringView(this.viewContainer);
        break;
      case 'forecast':
        renderForecastView(this.viewContainer);
        break;
      case 'scenarios':
        renderScenariosView(this.viewContainer);
        break;
      case 'reports':
        renderReportsView(this.viewContainer);
        break;
      case 'data-hub':
        renderDataHubView(this.viewContainer);
        break;
      default:
        renderDashboardView(this.viewContainer);
    }
  }

  setupGlobalListeners() {
    state.subscribe('STATE_UPDATED', () => {
      this.renderCurrentView();
    });

    state.subscribe('VIEW_CHANGED', () => {
      this.renderCurrentView();
    });

    state.subscribe('UNDO_AVAILABLE', ({ action }) => {
      this.showUndoToast(action);
    });
  }

  setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('OPEN_TRANSACTION_MODAL'));
      }
      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        state.activeView = 'transactions';
        this.renderCurrentView();
      }
      if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        state.activeView = 'dashboard';
        this.renderCurrentView();
      }
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        state.activeView = 'forecast';
        this.renderCurrentView();
      }
      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        state.executeUndo();
      }
    });
  }

  showUndoToast(action) {
    const toastId = 'toast_' + Date.now();
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = 'toast-alert';
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-desc">${action.description}</span>
      </div>
      <button class="btn btn-sm btn-outline-warning btn-undo-trigger">
        ${getIcon('undo', 'icon-xs')} Undo
      </button>
      <button class="toast-close-btn">&times;</button>
    `;

    toast.querySelector('.btn-undo-trigger')?.addEventListener('click', async () => {
      await state.executeUndo();
      toast.remove();
    });

    toast.querySelector('.toast-close-btn')?.addEventListener('click', () => {
      toast.remove();
    });

    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 7000);
  }

  // --- Modals Setup ---
  setupModalEvents() {
    // 1. Transaction Modal
    window.addEventListener('OPEN_TRANSACTION_MODAL', (e) => {
      const tx = e.detail?.transaction || null;
      this.showTransactionModal(tx);
    });

    // 2. Account Modal
    window.addEventListener('OPEN_ACCOUNT_MODAL', (e) => {
      const acc = e.detail?.account || null;
      this.showAccountModal(acc);
    });

    // 3. Budget Modal
    window.addEventListener('OPEN_BUDGET_MODAL', (e) => {
      const { monthKey, categoryId } = e.detail || {};
      this.showBudgetModal(monthKey, categoryId);
    });

    // 4. Goal Modal
    window.addEventListener('OPEN_GOAL_MODAL', (e) => {
      const goal = e.detail?.goal || null;
      this.showGoalModal(goal);
    });

    // 5. Deposit to Goal Modal
    window.addEventListener('OPEN_DEPOSIT_MODAL', (e) => {
      const goal = e.detail?.goal;
      if (goal) this.showDepositModal(goal);
    });

    // 6. Recurring Modal
    window.addEventListener('OPEN_RECURRING_MODAL', (e) => {
      const rule = e.detail?.rule || null;
      this.showRecurringModal(rule);
    });
  }

  closeModal() {
    this.modalContainer.innerHTML = '';
    this.modalContainer.classList.remove('active');
  }

  openModalMarkup(contentHTML) {
    this.modalContainer.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-dialog">
        ${contentHTML}
      </div>
    `;
    this.modalContainer.classList.add('active');

    this.modalContainer.querySelector('.modal-backdrop')?.addEventListener('click', () => this.closeModal());
    this.modalContainer.querySelector('.btn-modal-close')?.addEventListener('click', () => this.closeModal());
    this.modalContainer.querySelector('.btn-modal-cancel')?.addEventListener('click', () => this.closeModal());
  }

  // Transaction Modal Handler
  showTransactionModal(tx = null) {
    const isEdit = !!tx;
    const { categories, accounts } = state;
    const today = getTodayISO();

    const currentType = tx?.type || 'expense';
    const currentDate = tx?.date || today;
    const currentMerchant = tx?.merchant || tx?.description || '';
    const currentAmount = tx?.amount || '';
    const currentCategoryId = tx?.categoryId || categories.find(c => c.type === currentType)?.id || categories[0]?.id;
    const currentAccountId = tx?.accountId || accounts[0]?.id || '';
    const currentToAccountId = tx?.toAccountId || (accounts.length > 1 ? accounts[1].id : '');
    const currentNotes = tx?.notes || '';
    const currentCleared = tx ? tx.isCleared !== false : true;

    const content = `
      <div class="modal-header">
        <h2 class="modal-title">${isEdit ? 'Edit Transaction' : 'New Transaction'}</h2>
        <button class="btn-icon btn-modal-close">${getIcon('close', 'icon-sm')}</button>
      </div>
      <form id="form-transaction">
        <div class="modal-body">
          <!-- Type Segmented Selector -->
          <div class="form-group">
            <div class="segmented-control w-full" id="modal-tx-type">
              <button type="button" class="segment-btn ${currentType === 'expense' ? 'active' : ''}" data-type="expense">Expense</button>
              <button type="button" class="segment-btn ${currentType === 'income' ? 'active' : ''}" data-type="income">Income</button>
              <button type="button" class="segment-btn ${currentType === 'transfer' ? 'active' : ''}" data-type="transfer">Transfer</button>
            </div>
            <input type="hidden" id="tx-type-input" value="${currentType}" />
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Date *</label>
              <input type="date" id="tx-date-input" class="form-control" value="${currentDate}" required />
            </div>
            <div class="form-group flex-1">
              <label class="form-label">Amount ($) *</label>
              <input type="number" step="0.01" id="tx-amount-input" class="form-control font-mono font-bold" placeholder="0.00" value="${currentAmount}" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Merchant / Description *</label>
            <input type="text" id="tx-desc-input" class="form-control" placeholder="e.g. Whole Foods, Spotify, Acme Payroll" value="${currentMerchant}" required />
          </div>

          <div class="form-row" id="tx-category-row" style="${currentType === 'transfer' ? 'display: none;' : ''}">
            <div class="form-group flex-1">
              <label class="form-label">Category *</label>
              <select id="tx-category-select" class="form-control">
                ${categories.map(c => `
                  <option value="${c.id}" ${c.id === currentCategoryId ? 'selected' : ''}>${c.name}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label" id="lbl-source-acc">${currentType === 'transfer' ? 'Source Account *' : 'Account *'}</label>
              <select id="tx-account-select" class="form-control" required>
                ${accounts.map(a => `
                  <option value="${a.id}" ${a.id === currentAccountId ? 'selected' : ''}>${a.name} (${a.type})</option>
                `).join('')}
              </select>
            </div>

            <div class="form-group flex-1" id="tx-to-account-group" style="${currentType === 'transfer' ? '' : 'display: none;'}">
              <label class="form-label">Destination Account *</label>
              <select id="tx-to-account-select" class="form-control">
                ${accounts.map(a => `
                  <option value="${a.id}" ${a.id === currentToAccountId ? 'selected' : ''}>${a.name} (${a.type})</option>
                `).join('')}
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Notes (Optional)</label>
            <input type="text" id="tx-notes-input" class="form-control text-sm" placeholder="Additional details, memo, tag..." value="${currentNotes}" />
          </div>

          <div class="form-group">
            <label class="checkbox-row cursor-pointer">
              <input type="checkbox" id="tx-cleared-input" ${currentCleared ? 'checked' : ''} />
              <span class="text-sm font-medium">Cleared & Settled</span>
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-modal-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Save Changes' : 'Record Transaction'}</button>
        </div>
      </form>
    `;

    this.openModalMarkup(content);

    // Segmented type selector click
    const typeInput = this.modalContainer.querySelector('#tx-type-input');
    const catRow = this.modalContainer.querySelector('#tx-category-row');
    const toAccGroup = this.modalContainer.querySelector('#tx-to-account-group');
    const srcLbl = this.modalContainer.querySelector('#lbl-source-acc');

    this.modalContainer.querySelectorAll('#modal-tx-type .segment-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.modalContainer.querySelectorAll('#modal-tx-type .segment-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const selectedType = btn.dataset.type;
        typeInput.value = selectedType;

        if (selectedType === 'transfer') {
          catRow.style.display = 'none';
          toAccGroup.style.display = 'block';
          srcLbl.textContent = 'Source Account *';
        } else {
          catRow.style.display = 'block';
          toAccGroup.style.display = 'none';
          srcLbl.textContent = 'Account *';
        }
      });
    });

    // Form submit
    this.modalContainer.querySelector('#form-transaction')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const type = typeInput.value;
      const date = this.modalContainer.querySelector('#tx-date-input').value;
      const amount = Math.abs(parseFloat(this.modalContainer.querySelector('#tx-amount-input').value) || 0);
      const merchant = this.modalContainer.querySelector('#tx-desc-input').value.trim();
      const categoryId = type === 'transfer' ? 'cat_salary' : this.modalContainer.querySelector('#tx-category-select').value;
      const accountId = this.modalContainer.querySelector('#tx-account-select').value;
      const toAccountId = type === 'transfer' ? this.modalContainer.querySelector('#tx-to-account-select').value : null;
      const notes = this.modalContainer.querySelector('#tx-notes-input').value.trim();
      const isCleared = this.modalContainer.querySelector('#tx-cleared-input').checked;

      if (!merchant || amount <= 0 || !accountId) {
        alert('Please fill out all required fields with a valid amount.');
        return;
      }

      if (isEdit) {
        await state.updateTransaction({
          ...tx,
          date,
          amount,
          type,
          description: merchant,
          merchant,
          categoryId,
          accountId,
          toAccountId,
          notes,
          isCleared
        });
      } else {
        await state.addTransaction({
          id: 'tx_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
          date,
          amount,
          type,
          description: merchant,
          merchant,
          categoryId,
          accountId,
          toAccountId,
          notes,
          isCleared
        });
      }

      this.closeModal();
    });
  }

  // Account Modal
  showAccountModal(acc = null) {
    const isEdit = !!acc;
    const currentName = acc?.name || '';
    const currentType = acc?.type || 'checking';
    const currentBal = acc?.initialBalance || '';
    const currentLimit = acc?.creditLimit || '';
    const currentColor = acc?.color || '#3b82f6';
    const currentIcon = acc?.icon || (currentType === 'creditCard' ? 'creditCard' : 'bank');

    const content = `
      <div class="modal-header">
        <h2 class="modal-title">${isEdit ? 'Edit Account' : 'Add Financial Account'}</h2>
        <button class="btn-icon btn-modal-close">${getIcon('close', 'icon-sm')}</button>
      </div>
      <form id="form-account">
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Account Name *</label>
            <input type="text" id="acc-name-input" class="form-control" placeholder="e.g. Chase Sapphire, High-Yield Savings" value="${currentName}" required />
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Account Type *</label>
              <select id="acc-type-select" class="form-control">
                <option value="checking" ${currentType === 'checking' ? 'selected' : ''}>Checking</option>
                <option value="savings" ${currentType === 'savings' ? 'selected' : ''}>Savings</option>
                <option value="creditCard" ${currentType === 'creditCard' ? 'selected' : ''}>Credit Card</option>
                <option value="cash" ${currentType === 'cash' ? 'selected' : ''}>Cash Wallet</option>
              </select>
            </div>
            <div class="form-group flex-1">
              <label class="form-label">Initial Opening Balance ($)</label>
              <input type="number" step="0.01" id="acc-bal-input" class="form-control font-mono" placeholder="0.00" value="${currentBal}" />
            </div>
          </div>

          <div class="form-group" id="acc-limit-group" style="${currentType === 'creditCard' ? '' : 'display: none;'}">
            <label class="form-label">Credit Limit ($)</label>
            <input type="number" step="0.01" id="acc-limit-input" class="form-control font-mono" placeholder="10000.00" value="${currentLimit}" />
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Accent Color</label>
              <input type="color" id="acc-color-input" class="form-control" style="height: 38px; padding: 2px;" value="${currentColor}" />
            </div>
            <div class="form-group flex-1">
              <label class="form-label">Icon</label>
              <select id="acc-icon-select" class="form-control">
                <option value="bank" ${currentIcon === 'bank' ? 'selected' : ''}>Bank</option>
                <option value="creditCard" ${currentIcon === 'creditCard' ? 'selected' : ''}>Credit Card</option>
                <option value="shield" ${currentIcon === 'shield' ? 'selected' : ''}>Shield / Vault</option>
                <option value="cash" ${currentIcon === 'cash' ? 'selected' : ''}>Cash</option>
                <option value="investment" ${currentIcon === 'investment' ? 'selected' : ''}>Investment</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-modal-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Save Account' : 'Create Account'}</button>
        </div>
      </form>
    `;

    this.openModalMarkup(content);

    const typeSelect = this.modalContainer.querySelector('#acc-type-select');
    const limitGroup = this.modalContainer.querySelector('#acc-limit-group');
    typeSelect?.addEventListener('change', () => {
      limitGroup.style.display = typeSelect.value === 'creditCard' ? 'block' : 'none';
    });

    this.modalContainer.querySelector('#form-account')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = this.modalContainer.querySelector('#acc-name-input').value.trim();
      const type = typeSelect.value;
      const initialBalance = parseFloat(this.modalContainer.querySelector('#acc-bal-input').value) || 0;
      const creditLimit = parseFloat(this.modalContainer.querySelector('#acc-limit-input')?.value) || 0;
      const color = this.modalContainer.querySelector('#acc-color-input').value;
      const icon = this.modalContainer.querySelector('#acc-icon-select').value;

      if (!name) return;

      const accountPayload = {
        id: isEdit ? acc.id : 'acc_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
        name,
        type,
        initialBalance,
        creditLimit: type === 'creditCard' ? creditLimit : 0,
        color,
        icon,
        isArchived: isEdit ? !!acc.isArchived : false
      };

      await state.saveAccount(accountPayload);
      this.closeModal();
    });
  }

  // Budget Modal
  showBudgetModal(monthKey, categoryId = null) {
    const { categories, budgets } = state;
    const targetMonth = monthKey || new Date().toISOString().slice(0, 7);
    const existingBudget = categoryId ? budgets.find(b => b.monthKey === targetMonth && b.categoryId === categoryId) : null;
    const existingAmount = existingBudget ? existingBudget.amount : '';

    const content = `
      <div class="modal-header">
        <h2 class="modal-title">Set Monthly Category Budget</h2>
        <button class="btn-icon btn-modal-close">${getIcon('close', 'icon-sm')}</button>
      </div>
      <form id="form-budget">
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Category *</label>
            <select id="budget-cat-select" class="form-control">
              ${categories.filter(c => c.type === 'expense').map(c => `
                <option value="${c.id}" ${c.id === categoryId ? 'selected' : ''}>${c.name}</option>
              `).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Monthly Budget Limit ($) *</label>
            <input type="number" step="1" id="budget-amount-input" class="form-control font-mono font-bold" placeholder="e.g. 600" value="${existingAmount}" required />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-modal-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Budget</button>
        </div>
      </form>
    `;

    this.openModalMarkup(content);

    this.modalContainer.querySelector('#form-budget')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const catId = this.modalContainer.querySelector('#budget-cat-select').value;
      const amount = parseFloat(this.modalContainer.querySelector('#budget-amount-input').value) || 0;

      await state.saveBudget({
        id: `bg_${targetMonth}_${catId}`,
        monthKey: targetMonth,
        categoryId: catId,
        amount
      });

      this.closeModal();
    });
  }

  // Goal Modal
  showGoalModal(goal = null) {
    const isEdit = !!goal;
    const { accounts } = state;

    const content = `
      <div class="modal-header">
        <h2 class="modal-title">${isEdit ? 'Edit Savings Goal' : 'New Savings Goal'}</h2>
        <button class="btn-icon btn-modal-close">${getIcon('close', 'icon-sm')}</button>
      </div>
      <form id="form-goal">
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Goal Name *</label>
            <input type="text" id="goal-name-input" class="form-control" placeholder="e.g. Emergency Fund, New Car, Tokyo Trip" value="${goal?.name || ''}" required />
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Target Amount ($) *</label>
              <input type="number" step="1" id="goal-target-input" class="form-control font-mono" placeholder="10000" value="${goal?.targetAmount || ''}" required />
            </div>
            <div class="form-group flex-1">
              <label class="form-label">Current Saved ($)</label>
              <input type="number" step="1" id="goal-current-input" class="form-control font-mono" placeholder="0" value="${goal?.currentAmount || 0}" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Target Completion Date</label>
              <input type="date" id="goal-date-input" class="form-control" value="${goal?.targetDate || ''}" />
            </div>
            <div class="form-group flex-1">
              <label class="form-label">Monthly Target Contribution ($)</label>
              <input type="number" step="1" id="goal-monthly-input" class="form-control font-mono" placeholder="e.g. 500" value="${goal?.monthlyContribution || ''}" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Linked Account</label>
            <select id="goal-account-select" class="form-control">
              ${accounts.map(a => `
                <option value="${a.id}" ${a.id === goal?.accountId ? 'selected' : ''}>${a.name}</option>
              `).join('')}
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-modal-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Save Goal' : 'Create Goal'}</button>
        </div>
      </form>
    `;

    this.openModalMarkup(content);

    this.modalContainer.querySelector('#form-goal')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = this.modalContainer.querySelector('#goal-name-input').value.trim();
      const targetAmount = parseFloat(this.modalContainer.querySelector('#goal-target-input').value) || 0;
      const currentAmount = parseFloat(this.modalContainer.querySelector('#goal-current-input').value) || 0;
      const targetDate = this.modalContainer.querySelector('#goal-date-input').value;
      const monthlyContribution = parseFloat(this.modalContainer.querySelector('#goal-monthly-input').value) || 0;
      const accountId = this.modalContainer.querySelector('#goal-account-select').value;

      if (!name || targetAmount <= 0) return;

      await state.saveGoal({
        id: isEdit ? goal.id : 'goal_' + Date.now().toString(36),
        name,
        targetAmount,
        currentAmount,
        targetDate,
        monthlyContribution,
        accountId,
        color: goal?.color || '#10b981',
        icon: goal?.icon || 'shield',
        isCompleted: currentAmount >= targetAmount
      });

      this.closeModal();
    });
  }

  // Deposit to Goal Modal
  showDepositModal(goal) {
    const content = `
      <div class="modal-header">
        <h2 class="modal-title">Add Funds to ${goal.name}</h2>
        <button class="btn-icon btn-modal-close">${getIcon('close', 'icon-sm')}</button>
      </div>
      <form id="form-deposit">
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Deposit Amount ($) *</label>
            <input type="number" step="0.01" id="deposit-amount-input" class="form-control font-mono font-bold text-lg" placeholder="0.00" required />
          </div>
          <p class="text-xs text-muted">This will record the additional savings directly toward your target of ${formatCurrency(goal.targetAmount)}.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-modal-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary">Add Funds</button>
        </div>
      </form>
    `;

    this.openModalMarkup(content);

    this.modalContainer.querySelector('#form-deposit')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const depositAmt = parseFloat(this.modalContainer.querySelector('#deposit-amount-input').value) || 0;
      if (depositAmt <= 0) return;

      const newCurrent = (Number(goal.currentAmount) || 0) + depositAmt;
      await state.saveGoal({
        ...goal,
        currentAmount: newCurrent,
        isCompleted: newCurrent >= goal.targetAmount
      });

      this.closeModal();
    });
  }

  // Recurring Rule Modal
  showRecurringModal(rule = null) {
    const isEdit = !!rule;
    const { categories, accounts } = state;
    const today = getTodayISO();

    const currentType = rule?.type || 'expense';
    const currentName = rule?.name || '';
    const currentAmount = rule?.amount || '';
    const currentFrequency = rule?.frequency || 'monthly';
    const currentNextDate = rule?.nextDueDate || today;
    const currentCategoryId = rule?.categoryId || categories[0]?.id;
    const currentAccountId = rule?.accountId || accounts[0]?.id;

    const content = `
      <div class="modal-header">
        <h2 class="modal-title">${isEdit ? 'Edit Recurring Schedule' : 'New Recurring Bill / Income'}</h2>
        <button class="btn-icon btn-modal-close">${getIcon('close', 'icon-sm')}</button>
      </div>
      <form id="form-recurring">
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Name / Description *</label>
            <input type="text" id="rec-name-input" class="form-control" placeholder="e.g. Acme Payroll, Apartment Rent, Netflix" value="${currentName}" required />
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Type *</label>
              <select id="rec-type-select" class="form-control">
                <option value="expense" ${currentType === 'expense' ? 'selected' : ''}>Expense / Bill</option>
                <option value="income" ${currentType === 'income' ? 'selected' : ''}>Income / Payroll</option>
              </select>
            </div>
            <div class="form-group flex-1">
              <label class="form-label">Amount ($) *</label>
              <input type="number" step="0.01" id="rec-amount-input" class="form-control font-mono font-bold" placeholder="0.00" value="${currentAmount}" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Frequency *</label>
              <select id="rec-freq-select" class="form-control">
                <option value="daily" ${currentFrequency === 'daily' ? 'selected' : ''}>Daily</option>
                <option value="weekly" ${currentFrequency === 'weekly' ? 'selected' : ''}>Weekly</option>
                <option value="biweekly" ${currentFrequency === 'biweekly' ? 'selected' : ''}>Bi-Weekly</option>
                <option value="monthly" ${currentFrequency === 'monthly' ? 'selected' : ''}>Monthly</option>
                <option value="yearly" ${currentFrequency === 'yearly' ? 'selected' : ''}>Yearly</option>
              </select>
            </div>
            <div class="form-group flex-1">
              <label class="form-label">Next Due Date *</label>
              <input type="date" id="rec-next-date-input" class="form-control" value="${currentNextDate}" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Category</label>
              <select id="rec-cat-select" class="form-control">
                ${categories.map(c => `
                  <option value="${c.id}" ${c.id === currentCategoryId ? 'selected' : ''}>${c.name}</option>
                `).join('')}
              </select>
            </div>
            <div class="form-group flex-1">
              <label class="form-label">Account</label>
              <select id="rec-acc-select" class="form-control">
                ${accounts.map(a => `
                  <option value="${a.id}" ${a.id === currentAccountId ? 'selected' : ''}>${a.name}</option>
                `).join('')}
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-modal-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Save Schedule' : 'Create Schedule'}</button>
        </div>
      </form>
    `;

    this.openModalMarkup(content);

    this.modalContainer.querySelector('#form-recurring')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = this.modalContainer.querySelector('#rec-name-input').value.trim();
      const type = this.modalContainer.querySelector('#rec-type-select').value;
      const amount = parseFloat(this.modalContainer.querySelector('#rec-amount-input').value) || 0;
      const frequency = this.modalContainer.querySelector('#rec-freq-select').value;
      const nextDueDate = this.modalContainer.querySelector('#rec-next-date-input').value;
      const categoryId = this.modalContainer.querySelector('#rec-cat-select').value;
      const accountId = this.modalContainer.querySelector('#rec-acc-select').value;

      if (!name || amount <= 0 || !nextDueDate) return;

      await state.saveRecurring({
        id: isEdit ? rule.id : 'rec_' + Date.now().toString(36),
        name,
        type,
        amount,
        frequency,
        nextDueDate,
        startDate: isEdit ? rule.startDate : today,
        categoryId,
        accountId,
        isPaused: isEdit ? rule.isPaused : false,
        autoPost: true
      });

      this.closeModal();
    });
  }
}

// Bootstrap
function startBudgetOS() {
  const app = new BudgetOSApp();
  app.init().catch(err => console.error('BudgetOS startup error:', err));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startBudgetOS);
} else {
  startBudgetOS();
}


})();
