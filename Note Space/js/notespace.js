(function() {
  "use strict";

  // ==========================================
  // FILE: js/icons/icons.js
  // ==========================================
/**
 * NoteSpace - SVG Icon Library
 * High-quality, clean local SVG icons for sidebar, blocks, database properties, toolbar, and actions.
 */
const Icons = {
  // Navigation & General
  logo: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/><path d="M6 14h6"/><path d="M18 2v20"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  chevronDown: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
  search: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  plusCircle: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
  moreHorizontal: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`,
  moreVertical: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>`,
  star: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  starFilled: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  file: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  fileText: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  folder: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
  database: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
  sidebar: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>`,
  history: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><polyline points="3 3 3 8 8 8"/><polyline points="12 7 12 12 15 15"/></svg>`,
  download: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  upload: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
  copy: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  check: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  x: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  grip: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  sparkles: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/></svg>`,
  share: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  arrowLeft: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
  refreshCw: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
  cornerUpLeft: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>`,

  // Block Icons
  paragraph: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 4v16"/><path d="M17 4v16"/><path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13"/></svg>`,
  heading1: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="m17 12 3-2v8"/></svg>`,
  heading2: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M21 18h-4c0-4 4-3 4-6 0-1.5-1-2.5-2.5-2.5-1.2 0-2 .8-2.2 2"/></svg>`,
  heading3: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2"/><path d="M17 18h2.5a2 2 0 0 0 2-2c0-1.5-1.8-2.5-3.5-1.5"/></svg>`,
  bulletList: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  numberedList: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>`,
  checklist: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
  quote: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/></svg>`,
  divider: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  code: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  callout: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  image: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  table: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>`,
  toggle: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 9 12 15 18 9"/></svg>`,
  bookmark: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>`,
  link: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  externalLink: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,

  // Formatting Toolbar
  bold: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12h9a4 4 0 0 1 0 8H6v-8zm0-8h8a4 4 0 0 1 0 8H6V4z"/></svg>`,
  italic: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>`,
  underline: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>`,
  strikethrough: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" y1="12" x2="20" y2="12"/></svg>`,
  highlighter: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 11-6 6v3h3l6-6"/><path d="m22 7-4.6 4.6-4-4L18 3a2.83 2.83 0 0 1 4 4z"/></svg>`,

  // Database Views & Properties
  viewTable: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/></svg>`,
  viewBoard: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>`,
  viewList: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  filter: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
  sort: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></svg>`,
  group: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  
  // Property Type Icons
  propTitle: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>`,
  propText: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>`,
  propStatus: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
  propSelect: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="8 12 12 16 16 12"/></svg>`,
  propMultiSelect: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>`,
  propDate: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  propNumber: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>`,
  propCheckbox: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,

  // Additional Utilities
  template: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><line x1="4" y1="10" x2="20" y2="10"/><line x1="10" y1="4" x2="10" y2="20"/></svg>`,
  lock: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  unlock: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>`,
  font: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`,
  maximize: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
  minimize: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
  move: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>`,
  alertCircle: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
};
function getIcon(name, customClass = '') {
  const svg = Icons[name] || Icons.file;
  if (!customClass) return svg;
  return svg.replace('<svg', `<svg class="${customClass}"`);
}


  // ==========================================
  // FILE: js/utils/dom.js
  // ==========================================
/**
 * NoteSpace - DOM & Caret Utilities
 */
function createElement(tag, className = '', innerHTML = '', attrs = {}) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (innerHTML) el.innerHTML = innerHTML;
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}
function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
function sanitizeContent(html) {
  if (!html) return '';
  // Basic safe sanitization allowing standard formatting tags
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Remove script, iframe, object, form tags
  const dangerous = temp.querySelectorAll('script, iframe, object, form, embed, link, meta, style');
  dangerous.forEach(el => el.remove());

  // Remove dangerous attributes
  const allElements = temp.querySelectorAll('*');
  allElements.forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('on') || attr.value.trim().toLowerCase().startsWith('javascript:')) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return temp.innerHTML;
}

/**
 * Set caret position inside a contenteditable node
 */
function setCaretPosition(el, atEnd = true) {
  if (!el) return;
  el.focus();
  const range = document.createRange();
  const sel = window.getSelection();

  if (atEnd) {
    range.selectNodeContents(el);
    range.collapse(false);
  } else {
    range.selectNodeContents(el);
    range.collapse(true);
  }

  sel.removeAllRanges();
  sel.addRange(range);
}

/**
 * Get selection bounding rect for positioning floating menus
 */
function getSelectionRect() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return null;
  }
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return null;
  return rect;
}

/**
 * Format date nicely (relative or absolute)
 */
function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Debounce helper
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}


  // ==========================================
  // FILE: js/utils/toast.js
  // ==========================================
/**
 * NoteSpace - Toast Notification System
 * Non-intrusive, accessible notifications for user feedback and asynchronous actions.
 */


class ToastManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    this.container = createElement('div', 'ns-toast-container');
    document.body.appendChild(this.container);
  }

  show(message, type = 'info', duration = 3000) {
    const toast = createElement('div', `ns-toast ns-toast-${type}`);

    let icon = Icons.sparkles;
    if (type === 'success') icon = Icons.check;
    if (type === 'error') icon = Icons.alertCircle;
    if (type === 'trash') icon = Icons.trash;

    toast.innerHTML = `
      <span class="ns-toast-icon">${icon}</span>
      <span class="ns-toast-msg">${message}</span>
      <button class="ns-toast-close" aria-label="Dismiss notification">${Icons.x}</button>
    `;

    const closeBtn = toast.querySelector('.ns-toast-close');
    const dismiss = () => {
      toast.classList.add('is-dismissing');
      setTimeout(() => toast.remove(), 200);
    };

    closeBtn.addEventListener('click', dismiss);
    this.container.appendChild(toast);

    if (duration > 0) {
      setTimeout(dismiss, duration);
    }
  }

  success(msg, duration = 3000) {
    this.show(msg, 'success', duration);
  }

  error(msg, duration = 4000) {
    this.show(msg, 'error', duration);
  }

  info(msg, duration = 3000) {
    this.show(msg, 'info', duration);
  }
}
const toast = new ToastManager();


  // ==========================================
  // FILE: js/db/idb.js
  // ==========================================
/**
 * NoteSpace - IndexedDB Storage Engine (Bulletproof with LocalStorage Fallback)
 * Handles persistent client-side storage for pages, databases, history, and workspace settings.
 */

const DB_NAME = 'NoteSpaceDB';
const DB_VERSION = 2; // Incremented to ensure schema upgrade

class IDBService {
  constructor() {
    this.db = null;
    this.useLocalStorageFallback = false;
  }

  async init() {
    return new Promise((resolve) => {
      let resolved = false;

      // 1. Fallback timer if IndexedDB hangs in restricted browser environments
      const timer = setTimeout(() => {
        if (!resolved) {
          console.warn('IndexedDB initialization timed out, using LocalStorage fallback.');
          this.useLocalStorageFallback = true;
          resolved = true;
          resolve(this);
        }
      }, 1200);

      const safeResolve = () => {
        if (!resolved) {
          clearTimeout(timer);
          resolved = true;
          resolve(this);
        }
      };

      if (!window.indexedDB) {
        console.warn('IndexedDB not supported, falling back to LocalStorage');
        this.useLocalStorageFallback = true;
        safeResolve();
        return;
      }

      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          try {
            const db = event.target.result;

            // Pages store
            if (!db.objectStoreNames.contains('pages')) {
              const pageStore = db.createObjectStore('pages', { keyPath: 'id' });
              pageStore.createIndex('parentId', 'parentId', { unique: false });
              pageStore.createIndex('isTrash', 'isTrash', { unique: false });
              pageStore.createIndex('isFavorite', 'isFavorite', { unique: false });
              pageStore.createIndex('updatedAt', 'updatedAt', { unique: false });
            }

            // Databases store
            if (!db.objectStoreNames.contains('databases')) {
              db.createObjectStore('databases', { keyPath: 'id' });
            }

            // Settings store
            if (!db.objectStoreNames.contains('settings')) {
              db.createObjectStore('settings', { keyPath: 'key' });
            }

            // History store
            if (!db.objectStoreNames.contains('history')) {
              const historyStore = db.createObjectStore('history', { keyPath: 'id' });
              historyStore.createIndex('pageId', 'pageId', { unique: false });
              historyStore.createIndex('timestamp', 'timestamp', { unique: false });
            }
          } catch (e) {
            console.warn('Error during IDB onupgradeneeded', e);
          }
        };

        request.onsuccess = (event) => {
          this.db = event.target.result;
          
          // Verify that required object stores exist in database
          if (!this.db.objectStoreNames.contains('pages')) {
            console.warn('IDB missing required stores, falling back to LocalStorage.');
            this.useLocalStorageFallback = true;
          }
          safeResolve();
        };

        request.onerror = (event) => {
          console.warn('IndexedDB open error, falling back to LocalStorage:', event.target ? event.target.error : event);
          this.useLocalStorageFallback = true;
          safeResolve();
        };

        request.onblocked = () => {
          console.warn('IndexedDB open blocked, using LocalStorage fallback.');
          this.useLocalStorageFallback = true;
          safeResolve();
        };
      } catch (err) {
        console.warn('Exception during IndexedDB setup:', err);
        this.useLocalStorageFallback = true;
        safeResolve();
      }
    });
  }

  // --- Generic Store Operations ---

  async get(storeName, key) {
    if (this.useLocalStorageFallback || !this.db) {
      try {
        const data = localStorage.getItem(`notespace_${storeName}_${key}`);
        return data ? JSON.parse(data) : null;
      } catch (e) {
        return null;
      }
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction([storeName], 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => {
          // Fallback to localStorage on request error
          try {
            const data = localStorage.getItem(`notespace_${storeName}_${key}`);
            resolve(data ? JSON.parse(data) : null);
          } catch (e) {
            resolve(null);
          }
        };
      } catch (err) {
        // Fallback to localStorage on tx creation error
        try {
          const data = localStorage.getItem(`notespace_${storeName}_${key}`);
          resolve(data ? JSON.parse(data) : null);
        } catch (e) {
          resolve(null);
        }
      }
    });
  }

  async getAll(storeName) {
    if (this.useLocalStorageFallback || !this.db) {
      try {
        const items = [];
        const prefix = `notespace_${storeName}_`;
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(prefix)) {
            items.push(JSON.parse(localStorage.getItem(k)));
          }
        }
        return items;
      } catch (e) {
        return [];
      }
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction([storeName], 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => {
          this.getAllFromLocalStorage(storeName).then(resolve);
        };
      } catch (err) {
        this.getAllFromLocalStorage(storeName).then(resolve);
      }
    });
  }

  async getAllFromLocalStorage(storeName) {
    try {
      const items = [];
      const prefix = `notespace_${storeName}_`;
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) {
          items.push(JSON.parse(localStorage.getItem(k)));
        }
      }
      return items;
    } catch (e) {
      return [];
    }
  }

  async put(storeName, value) {
    const key = value.id || value.key;

    // Always mirror to localStorage for resilience
    try {
      localStorage.setItem(`notespace_${storeName}_${key}`, JSON.stringify(value));
    } catch (e) {
      // Ignore quota error if storage full
    }

    if (this.useLocalStorageFallback || !this.db) {
      return value;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction([storeName], 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.put(value);
        req.onsuccess = () => resolve(value);
        req.onerror = () => resolve(value);
      } catch (err) {
        resolve(value);
      }
    });
  }

  async putBatch(storeName, values) {
    if (!values || !Array.isArray(values)) return values;

    // Mirror to localStorage
    try {
      values.forEach(v => {
        const key = v.id || v.key;
        localStorage.setItem(`notespace_${storeName}_${key}`, JSON.stringify(v));
      });
    } catch (e) {
      // Ignore
    }

    if (this.useLocalStorageFallback || !this.db) {
      return values;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction([storeName], 'readwrite');
        const store = tx.objectStore(storeName);
        values.forEach(v => {
          try {
            store.put(v);
          } catch (e) {}
        });
        tx.oncomplete = () => resolve(values);
        tx.onerror = () => resolve(values);
      } catch (err) {
        resolve(values);
      }
    });
  }

  async delete(storeName, key) {
    try {
      localStorage.removeItem(`notespace_${storeName}_${key}`);
    } catch (e) {}

    if (this.useLocalStorageFallback || !this.db) {
      return true;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction([storeName], 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.delete(key);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(true);
      } catch (err) {
        resolve(true);
      }
    });
  }

  async clear(storeName) {
    try {
      const prefix = `notespace_${storeName}_`;
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) keysToRemove.push(k);
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (e) {}

    if (this.useLocalStorageFallback || !this.db) {
      return true;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction([storeName], 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.clear();
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(true);
      } catch (err) {
        resolve(true);
      }
    });
  }

  async getStorageStats() {
    try {
      const pages = await this.getAll('pages');
      const databases = await this.getAll('databases');
      const history = await this.getAll('history');

      let totalChars = 0;
      pages.forEach(p => totalChars += JSON.stringify(p).length);
      databases.forEach(d => totalChars += JSON.stringify(d).length);
      history.forEach(h => totalChars += JSON.stringify(h).length);

      let quota = null;
      let usage = null;
      if (navigator.storage && navigator.storage.estimate) {
        try {
          const estimate = await navigator.storage.estimate();
          quota = estimate.quota;
          usage = estimate.usage;
        } catch (e) {}
      }

      return {
        pagesCount: pages.filter(p => !p.isTrash).length,
        trashCount: pages.filter(p => p.isTrash).length,
        databasesCount: databases.length,
        historyCount: history.length,
        approxSizeKB: (totalChars / 1024).toFixed(1),
        storageUsageMB: usage ? (usage / (1024 * 1024)).toFixed(2) : null,
        storageQuotaMB: quota ? (quota / (1024 * 1024)).toFixed(0) : null
      };
    } catch (e) {
      return {
        pagesCount: 0,
        trashCount: 0,
        databasesCount: 0,
        historyCount: 0,
        approxSizeKB: '0',
        storageUsageMB: null,
        storageQuotaMB: null
      };
    }
  }
}
const db = new IDBService();


  // ==========================================
  // FILE: js/db/defaultData.js
  // ==========================================
/**
 * NoteSpace - Default Starter Workspace Data
 * Generates realistic, professional production workspace content with zero generic placeholder text.
 */
function generateStarterWorkspace() {
  const now = Date.now();

  const welcomePageId = 'page-welcome';
  const roadmapPageId = 'page-roadmap';
  const handbookPageId = 'page-handbook';
  const archSubpageId = 'page-handbook-arch';
  const guideSubpageId = 'page-handbook-guide';
  const feedbackPageId = 'page-feedback';
  const weeklyPageId = 'page-weekly';

  const roadmapDbId = 'db-roadmap-1';
  const feedbackDbId = 'db-feedback-1';

  const defaultPages = [
    // 1. Welcome Page (Interactive Tutorial)
    {
      id: welcomePageId,
      title: '👋 Welcome to NoteSpace',
      icon: '✨',
      cover: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      parentId: null,
      order: 0,
      isFavorite: true,
      isTrash: false,
      createdAt: now - 86400000 * 3,
      updatedAt: now - 3600000 * 2,
      blocks: [
        {
          id: 'b-w-1',
          type: 'callout',
          content: '<strong>NoteSpace</strong> is a local-first workspace for notes, documentation, and agile databases. All your data is stored persistently in your browser with IndexedDB and works 100% offline.',
          metadata: { icon: '💡', color: 'blue' }
        },
        {
          id: 'b-w-2',
          type: 'heading1',
          content: 'Quick Start Checklist'
        },
        {
          id: 'b-w-3',
          type: 'paragraph',
          content: 'Try out these fundamental workflows to get familiar with NoteSpace:'
        },
        {
          id: 'b-w-4',
          type: 'checklist',
          content: 'Press <code>Ctrl + K</code> or <code>Cmd + K</code> to open the Command Palette and global search',
          metadata: { checked: true }
        },
        {
          id: 'b-w-5',
          type: 'checklist',
          content: 'Type <code>/</code> anywhere on an empty line to explore the Slash Command menu',
          metadata: { checked: true }
        },
        {
          id: 'b-w-6',
          type: 'checklist',
          content: 'Highlight any text to reveal the floating formatting bubble (Bold, Code, Colors)',
          metadata: { checked: false }
        },
        {
          id: 'b-w-7',
          type: 'checklist',
          content: 'Check out the <strong>Q3 Product Roadmap</strong> database with Table, Board, and List views',
          metadata: { checked: false }
        },
        {
          id: 'b-w-8',
          type: 'checklist',
          content: 'Try dragging pages in the sidebar to create deep nested folder hierarchies',
          metadata: { checked: false }
        },
        {
          id: 'b-w-9',
          type: 'heading2',
          content: '🛠️ Core Block Types & Syntax'
        },
        {
          id: 'b-w-10',
          type: 'quote',
          content: '"Simplicity is prerequisite for reliability." — Edsger W. Dijkstra'
        },
        {
          id: 'b-w-11',
          type: 'code',
          content: '// NoteSpace Local Database Client\nimport { db } from "./db/idb.js";\n\nconst session = await db.init();\nconsole.log("IndexedDB store ready for instant operations");',
          metadata: { language: 'javascript' }
        },
        {
          id: 'b-w-12',
          type: 'toggle',
          content: '▶ Keyboard Shortcuts Reference',
          metadata: {
            isOpen: false,
            children: '• Press ? or Ctrl+/ for the shortcut modal\n• Press Enter on any block to create a new paragraph\n• Shift+Enter creates a soft break within a block\n• Type # for H1, ## for H2, ### for H3, - for bullet list, 1. for numbered list\n• Ctrl/Cmd+B for bold, Ctrl/Cmd+I for italic, Ctrl/Cmd+E for inline code'
          }
        },
        {
          id: 'b-w-13',
          type: 'table',
          content: '',
          metadata: {
            rows: [
              ['Capability', 'Implementation', 'Status'],
              ['IndexedDB Engine', 'Transaction debouncing with schema versioning', 'Active ✅'],
              ['Database Views', 'Polymorphic Table, Kanban Board, and List layouts', 'Active ✅'],
              ['Global Search', 'Full-text indexing with query mark highlighting', 'Active ✅'],
              ['Snapshot History', 'Automatic revision snapshots with one-click restore', 'Active ✅']
            ]
          }
        },
        {
          id: 'b-w-14',
          type: 'divider',
          content: ''
        },
        {
          id: 'b-w-15',
          type: 'bookmark',
          content: 'https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API',
          metadata: {
            title: 'IndexedDB API — Web APIs | MDN',
            description: 'IndexedDB is a transactional database system for client-side storage of significant amounts of structured data.',
            icon: '🌐'
          }
        }
      ]
    },

    // 2. Product Roadmap & Sprint Database Page
    {
      id: roadmapPageId,
      title: '🚀 Q3 Product Roadmap & Sprint Board',
      icon: '🎯',
      cover: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      parentId: null,
      order: 1,
      isFavorite: true,
      isTrash: false,
      createdAt: now - 86400000 * 2,
      updatedAt: now - 1800000,
      databaseId: roadmapDbId,
      blocks: [
        {
          id: 'b-r-1',
          type: 'callout',
          content: 'Quarterly feature priorities, architectural milestones, and active sprint items. Toggle between <strong>Table</strong>, <strong>Sprint Board (Kanban)</strong>, and <strong>List</strong> views above.',
          metadata: { icon: '📌', color: 'blue' }
        },
        {
          id: 'b-r-2',
          type: 'database',
          content: '',
          metadata: { databaseId: roadmapDbId }
        }
      ]
    },

    // 3. Customer Feedback Database Page
    {
      id: feedbackPageId,
      title: '👥 Customer Feedback & Feature Requests',
      icon: '💬',
      cover: 'linear-gradient(135deg, #1e1e24 0%, #2e2e38 100%)',
      parentId: null,
      order: 2,
      isFavorite: true,
      isTrash: false,
      createdAt: now - 86400000 * 4,
      updatedAt: now - 3600000 * 4,
      databaseId: feedbackDbId,
      blocks: [
        {
          id: 'b-fb-1',
          type: 'callout',
          content: 'Aggregated user sentiment, feature requests from enterprise pilots, and UX improvement logs.',
          metadata: { icon: '📊', color: 'purple' }
        },
        {
          id: 'b-fb-2',
          type: 'database',
          content: '',
          metadata: { databaseId: feedbackDbId }
        }
      ]
    },

    // 4. Engineering Handbook (Parent Page)
    {
      id: handbookPageId,
      title: '📐 System Architecture & Guidelines',
      icon: '🏛️',
      cover: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
      parentId: null,
      order: 3,
      isFavorite: false,
      isTrash: false,
      createdAt: now - 86400000 * 5,
      updatedAt: now - 86400000,
      blocks: [
        {
          id: 'b-h-1',
          type: 'callout',
          content: 'Technical RFC specifications, local-first state patterns, and frontend design conventions.',
          metadata: { icon: '⚡', color: 'green' }
        },
        {
          id: 'b-h-2',
          type: 'heading1',
          content: 'Architectural Philosophy'
        },
        {
          id: 'b-h-3',
          type: 'bulletList',
          content: '<strong>Local-First Guarantee:</strong> Zero blocking network requests for read/write operations.'
        },
        {
          id: 'b-h-4',
          type: 'bulletList',
          content: '<strong>Deterministic Event Dispatch:</strong> State mutations emit granular notifications without full canvas re-renders.'
        },
        {
          id: 'b-h-5',
          type: 'bulletList',
          content: '<strong>Zero Vendor Lock-in:</strong> Complete JSON workspace snapshot export and human-readable Markdown exports.'
        },
        {
          id: 'b-h-6',
          type: 'heading2',
          content: 'Handbook Sections'
        },
        {
          id: 'b-h-7',
          type: 'paragraph',
          content: 'Browse the child pages nested under this handbook in the sidebar to review the Data Sync Protocol and Code Quality Standards.'
        }
      ]
    },

    // 4a. Subpage: Architecture & Sync
    {
      id: archSubpageId,
      title: 'Local-First Data Pipeline RFC',
      icon: '⚙️',
      cover: null,
      parentId: handbookPageId,
      order: 0,
      isFavorite: false,
      isTrash: false,
      createdAt: now - 86400000 * 4,
      updatedAt: now - 86400000 * 2,
      blocks: [
        {
          id: 'b-ha-1',
          type: 'heading1',
          content: 'RFC: Client-Side Transaction Pipeline'
        },
        {
          id: 'b-ha-2',
          type: 'paragraph',
          content: 'This document defines how NoteSpace writes document blocks to IndexedDB with debounced concurrency control.'
        },
        {
          id: 'b-ha-3',
          type: 'numberedList',
          content: '<strong>In-Memory Layer:</strong> Synchronous updates to in-memory Maps for 0ms UI latency.'
        },
        {
          id: 'b-ha-4',
          type: 'numberedList',
          content: '<strong>Debounce Queue:</strong> 400ms timer collapses burst keystrokes into atomic writes.'
        },
        {
          id: 'b-ha-5',
          type: 'numberedList',
          content: '<strong>Snapshot Engine:</strong> Periodically commits immutable history objects for revision diffing.'
        },
        {
          id: 'b-ha-6',
          type: 'code',
          content: 'interface PageDocument {\n  id: string;\n  title: string;\n  blocks: Array<BlockNode>;\n  parentId: string | null;\n  updatedAt: number;\n}',
          metadata: { language: 'typescript' }
        }
      ]
    },

    // 4b. Subpage: Guidelines
    {
      id: guideSubpageId,
      title: 'Frontend Quality Standards',
      icon: '🛡️',
      cover: null,
      parentId: handbookPageId,
      order: 1,
      isFavorite: false,
      isTrash: false,
      createdAt: now - 86400000 * 4,
      updatedAt: now - 86400000,
      blocks: [
        {
          id: 'b-hg-1',
          type: 'heading1',
          content: 'Code & Interaction Standards'
        },
        {
          id: 'b-hg-2',
          type: 'quote',
          content: '"Programs must be written for people to read, and only incidentally for machines to execute."'
        },
        {
          id: 'b-hg-3',
          type: 'checklist',
          content: 'Ensure all dialogs and context menus support Escape key dismiss',
          metadata: { checked: true }
        },
        {
          id: 'b-hg-4',
          type: 'checklist',
          content: 'Maintain clean contrast ratios in both Dark and Light themes',
          metadata: { checked: true }
        },
        {
          id: 'b-hg-5',
          type: 'checklist',
          content: 'Verify drag-and-drop handles do not trigger unwanted text selections',
          metadata: { checked: true }
        }
      ]
    },

    // 5. Weekly Sync Page
    {
      id: weeklyPageId,
      title: '📝 Weekly Engineering Sync — Aug 23',
      icon: '📅',
      cover: null,
      parentId: null,
      order: 4,
      isFavorite: false,
      isTrash: false,
      createdAt: now - 86400000 * 1,
      updatedAt: now - 3600000 * 1,
      blocks: [
        {
          id: 'b-ws-1',
          type: 'callout',
          content: 'Sprint review, release candidate status, and weekly blocker resolution.',
          metadata: { icon: '📋', color: 'blue' }
        },
        {
          id: 'b-ws-2',
          type: 'heading2',
          content: '👥 Attendees'
        },
        {
          id: 'b-ws-3',
          type: 'bulletList',
          content: 'Marcus Vance (Principal Architect)'
        },
        {
          id: 'b-ws-4',
          type: 'bulletList',
          content: 'Elena Rostova (Lead Product Designer)'
        },
        {
          id: 'b-ws-5',
          type: 'bulletList',
          content: 'Devon Park (Senior Frontend Engineer)'
        },
        {
          id: 'b-ws-6',
          type: 'heading2',
          content: '🎯 Completed Milestones'
        },
        {
          id: 'b-ws-7',
          type: 'checklist',
          content: 'IndexedDB persistent transaction pipeline with automatic save indicators',
          metadata: { checked: true }
        },
        {
          id: 'b-ws-8',
          type: 'checklist',
          content: 'Kanban board card drag-and-drop across status columns',
          metadata: { checked: true }
        },
        {
          id: 'b-ws-9',
          type: 'checklist',
          content: 'Full-text search highlighting with keyboard navigation',
          metadata: { checked: true }
        },
        {
          id: 'b-ws-10',
          type: 'checklist',
          content: 'JSON Workspace backup import/export validator',
          metadata: { checked: true }
        }
      ]
    }
  ];

  // 1. Roadmap Database
  const defaultDatabases = [
    {
      id: roadmapDbId,
      title: 'Q3 Product Roadmap & Sprint Items',
      pageId: roadmapPageId,
      currentView: 'table',
      views: [
        { id: 'v1', name: 'Table View', type: 'table' },
        { id: 'v2', name: 'Sprint Board', type: 'board', groupBy: 'prop-status' },
        { id: 'v3', name: 'List View', type: 'list' }
      ],
      filter: { propertyId: 'all', value: '' },
      sort: { propertyId: 'prop-target', direction: 'asc' },
      properties: [
        { id: 'prop-title', name: 'Task / Initiative', type: 'title', width: 240 },
        {
          id: 'prop-status',
          name: 'Status',
          type: 'status',
          width: 140,
          options: [
            { id: 's1', label: 'Not Started', color: 'gray' },
            { id: 's2', label: 'In Progress', color: 'blue' },
            { id: 's3', label: 'In Review', color: 'yellow' },
            { id: 's4', label: 'Completed', color: 'green' }
          ]
        },
        {
          id: 'prop-priority',
          name: 'Priority',
          type: 'select',
          width: 120,
          options: [
            { id: 'p1', label: 'P0 — Critical', color: 'red' },
            { id: 'p2', label: 'P1 — High', color: 'yellow' },
            { id: 'p3', label: 'P2 — Normal', color: 'green' }
          ]
        },
        {
          id: 'prop-tags',
          name: 'Domain',
          type: 'multi-select',
          width: 170,
          options: [
            { id: 't1', label: 'Frontend', color: 'blue' },
            { id: 't2', label: 'Database', color: 'purple' },
            { id: 't3', label: 'UX Design', color: 'pink' },
            { id: 't4', label: 'Performance', color: 'green' }
          ]
        },
        { id: 'prop-target', name: 'Target Date', type: 'date', width: 130 },
        { id: 'prop-hours', name: 'Est. Hours', type: 'number', width: 110 },
        { id: 'prop-done', name: 'QA Verified', type: 'checkbox', width: 100 }
      ],
      rows: [
        {
          id: 'row-1',
          properties: {
            'prop-title': 'Block Drag & Drop Ghost Indicators',
            'prop-status': 'Completed',
            'prop-priority': 'P0 — Critical',
            'prop-tags': ['Frontend', 'UX Design'],
            'prop-target': '2026-08-25',
            'prop-hours': 12,
            'prop-done': true
          },
          contentBlocks: [
            { id: 'rcb-1', type: 'paragraph', content: 'Engineered smooth drag physics and drop indicators without layout jumping.' }
          ]
        },
        {
          id: 'row-2',
          properties: {
            'prop-title': 'IndexedDB Concurrency Engine',
            'prop-status': 'Completed',
            'prop-priority': 'P0 — Critical',
            'prop-tags': ['Database', 'Performance'],
            'prop-target': '2026-08-26',
            'prop-hours': 16,
            'prop-done': true
          },
          contentBlocks: [
            { id: 'rcb-2', type: 'paragraph', content: 'Continuous debounced transactional writes with LocalStorage fallback.' }
          ]
        },
        {
          id: 'row-3',
          properties: {
            'prop-title': 'Polymorphic Kanban Board View',
            'prop-status': 'In Progress',
            'prop-priority': 'P1 — High',
            'prop-tags': ['Frontend', 'UX Design'],
            'prop-target': '2026-08-28',
            'prop-hours': 14,
            'prop-done': false
          },
          contentBlocks: [
            { id: 'rcb-3', type: 'paragraph', content: 'Drag-and-drop card columns with real-time status mutations.' }
          ]
        },
        {
          id: 'row-4',
          properties: {
            'prop-title': 'Global Ctrl+K Command Palette',
            'prop-status': 'In Progress',
            'prop-priority': 'P1 — High',
            'prop-tags': ['Frontend'],
            'prop-target': '2026-08-29',
            'prop-hours': 8,
            'prop-done': false
          },
          contentBlocks: []
        },
        {
          id: 'row-5',
          properties: {
            'prop-title': 'JSON Workspace Backup Validator',
            'prop-status': 'In Review',
            'prop-priority': 'P1 — High',
            'prop-tags': ['Database'],
            'prop-target': '2026-08-30',
            'prop-hours': 6,
            'prop-done': false
          },
          contentBlocks: []
        },
        {
          id: 'row-6',
          properties: {
            'prop-title': 'Revision History & Snapshot Diff',
            'prop-status': 'Not Started',
            'prop-priority': 'P2 — Normal',
            'prop-tags': ['Database', 'Frontend'],
            'prop-target': '2026-09-02',
            'prop-hours': 10,
            'prop-done': false
          },
          contentBlocks: []
        }
      ]
    },

    // 2. Feedback Database
    {
      id: feedbackDbId,
      title: 'Customer Feedback & Insights',
      pageId: feedbackPageId,
      currentView: 'table',
      views: [
        { id: 'fb-v1', name: 'All Feedback', type: 'table' },
        { id: 'fb-v2', name: 'Feedback Board', type: 'board', groupBy: 'prop-fb-status' },
        { id: 'fb-v3', name: 'Compact List', type: 'list' }
      ],
      filter: { propertyId: 'all', value: '' },
      sort: { propertyId: 'prop-fb-score', direction: 'desc' },
      properties: [
        { id: 'prop-title', name: 'Topic / Request', type: 'title', width: 240 },
        {
          id: 'prop-fb-status',
          name: 'Status',
          type: 'status',
          width: 140,
          options: [
            { id: 'fbs1', label: 'Under Review', color: 'yellow' },
            { id: 'fbs2', label: 'Planned', color: 'blue' },
            { id: 'fbs3', label: 'Shipped', color: 'green' }
          ]
        },
        {
          id: 'prop-fb-cat',
          name: 'Category',
          type: 'select',
          width: 130,
          options: [
            { id: 'fbc1', label: 'Editor', color: 'blue' },
            { id: 'fbc2', label: 'Databases', color: 'purple' },
            { id: 'fbc3', label: 'Performance', color: 'green' }
          ]
        },
        { id: 'prop-fb-user', name: 'Account / User', type: 'text', width: 160 },
        { id: 'prop-fb-score', name: 'Satisfaction Score', type: 'number', width: 130 }
      ],
      rows: [
        {
          id: 'fb-row-1',
          properties: {
            'prop-title': 'Instant Markdown export shortcut',
            'prop-fb-status': 'Shipped',
            'prop-fb-cat': 'Editor',
            'prop-fb-user': 'Acme Corp (Sarah L.)',
            'prop-fb-score': 10
          },
          contentBlocks: []
        },
        {
          id: 'fb-row-2',
          properties: {
            'prop-title': 'Support nested tables and formula footers',
            'prop-fb-status': 'Planned',
            'prop-fb-cat': 'Databases',
            'prop-fb-user': 'Starlight Bio (Dr. Chen)',
            'prop-fb-score': 9
          },
          contentBlocks: []
        },
        {
          id: 'fb-row-3',
          properties: {
            'prop-title': 'Dark mode high-contrast option',
            'prop-fb-status': 'Under Review',
            'prop-fb-cat': 'Editor',
            'prop-fb-user': 'Venture Studio (Alex M.)',
            'prop-fb-score': 8
          },
          contentBlocks: []
        }
      ]
    }
  ];

  const defaultSettings = [
    { key: 'theme', value: 'dark' },
    { key: 'fontFamily', value: 'sans' },
    { key: 'fullWidth', value: false },
    { key: 'workspaceName', value: "Acme Workspace" },
    { key: 'workspaceIcon', value: "🪐" },
    { key: 'activePageId', value: welcomePageId },
    { key: 'recentPageIds', value: [welcomePageId, roadmapPageId, feedbackPageId, handbookPageId] }
  ];

  return {
    pages: defaultPages,
    databases: defaultDatabases,
    settings: defaultSettings,
    history: []
  };
}


  // ==========================================
  // FILE: js/state/store.js
  // ==========================================
/**
 * NoteSpace - Reactive Centralized Store
 * Coordinates in-memory state, IndexedDB persistence, auto-save debounce, and event dispatch.
 */


class Store {
  constructor() {
    this.pages = new Map();
    this.databases = new Map();
    this.settings = new Map();
    this.activePageId = null;
    this.listeners = new Map();
    this.saveTimeout = null;
    this.saveStatus = 'saved'; // 'saved' | 'saving' | 'error'
    this.isInitialized = false;
  }

  // --- Event Pub/Sub ---

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try {
          cb(data);
        } catch (e) {
          console.error(`Error in event listener for "${event}":`, e);
        }
      });
    }
  }

  // --- Initialization ---

  async init() {
    try {
      await db.init();

      // Check if pages exist
      let pages = await db.getAll('pages');
      let databases = await db.getAll('databases');
      let settings = await db.getAll('settings');

      if (!pages || pages.length === 0) {
        const starter = generateStarterWorkspace();
        await db.putBatch('pages', starter.pages);
        await db.putBatch('databases', starter.databases);
        await db.putBatch('settings', starter.settings);

        pages = starter.pages;
        databases = starter.databases;
        settings = starter.settings;
      }

      // Populate in-memory maps
      pages.forEach(p => this.pages.set(p.id, p));
      databases.forEach(d => this.databases.set(d.id, d));
      settings.forEach(s => this.settings.set(s.key, s.value));
    } catch (err) {
      console.warn('Storage read exception, loading memory starter workspace:', err);
      const starter = generateStarterWorkspace();
      starter.pages.forEach(p => this.pages.set(p.id, p));
      starter.databases.forEach(d => this.databases.set(d.id, d));
      starter.settings.forEach(s => this.settings.set(s.key, s.value));
    }

    // Determine initial active page
    let activeId = this.getSetting('activePageId');
    const validPages = Array.from(this.pages.values()).filter(p => !p.isTrash);
    if (!activeId || !this.pages.has(activeId) || this.pages.get(activeId).isTrash) {
      activeId = validPages.length > 0 ? validPages[0].id : null;
    }

    this.activePageId = activeId;
    this.isInitialized = true;

    if (this.activePageId) {
      this.recordRecentPage(this.activePageId);
    }

    this.emit('initialized', { activePageId: this.activePageId });
  }

  // --- Settings Helpers ---

  getSetting(key, defaultValue = null) {
    return this.settings.has(key) ? this.settings.get(key) : defaultValue;
  }

  async setSetting(key, value) {
    this.settings.set(key, value);
    await db.put('settings', { key, value });
    this.emit(`setting:${key}`, value);
    this.emit('settings-updated', { key, value });
  }

  // --- Autosave & Save Status ---

  setSaveStatus(status) {
    this.saveStatus = status;
    this.emit('save-status', status);
  }

  scheduleSave(type, item) {
    this.setSaveStatus('saving');
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(async () => {
      try {
        if (type === 'page') {
          await db.put('pages', item);
        } else if (type === 'database') {
          await db.put('databases', item);
        }
        this.setSaveStatus('saved');
      } catch (err) {
        console.error('Autosave error:', err);
        this.setSaveStatus('error');
      }
    }, 400);
  }

  // --- Page Operations ---

  getPage(id) {
    return this.pages.get(id) || null;
  }

  getAllPages() {
    return Array.from(this.pages.values());
  }

  getActivePage() {
    return this.getPage(this.activePageId);
  }

  async setActivePage(id) {
    if (this.pages.has(id)) {
      this.activePageId = id;
      this.setSetting('activePageId', id);
      this.recordRecentPage(id);
      this.emit('active-page-changed', this.getPage(id));
    }
  }

  recordRecentPage(id) {
    let recents = this.getSetting('recentPageIds', []) || [];
    recents = recents.filter(pageId => pageId !== id && this.pages.has(pageId) && !this.pages.get(pageId).isTrash);
    recents.unshift(id);
    recents = recents.slice(0, 8); // Keep top 8 recent
    this.setSetting('recentPageIds', recents);
    this.emit('recents-updated', recents);
  }

  async createPage(options = {}) {
    const id = 'page-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const parentId = options.parentId || null;
    const title = options.title || 'Untitled';
    const icon = options.icon || '📄';
    const cover = options.cover || null;

    // Calculate order
    const siblings = this.getAllPages().filter(p => p.parentId === parentId && !p.isTrash);
    const order = siblings.length;

    const newPage = {
      id,
      title,
      icon,
      cover,
      parentId,
      order,
      isFavorite: false,
      isTrash: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      blocks: options.blocks || [
        {
          id: 'b-' + Date.now() + '-1',
          type: 'paragraph',
          content: ''
        }
      ],
      databaseId: options.databaseId || null
    };

    this.pages.set(id, newPage);
    await db.put('pages', newPage);

    // Save initial snapshot to history
    await this.createPageSnapshot(newPage, 'Page created');

    this.emit('page-created', newPage);
    this.emit('page-list-updated');
    await this.setActivePage(id);
    return newPage;
  }

  async updatePage(id, partial, skipHistory = false) {
    const page = this.pages.get(id);
    if (!page) return null;

    const oldBlocks = page.blocks;
    const updated = {
      ...page,
      ...partial,
      updatedAt: Date.now()
    };

    this.pages.set(id, updated);
    this.scheduleSave('page', updated);
    this.emit('page-updated', updated);

    // If title, icon, parentId or order changed, emit list updated
    if ('title' in partial || 'icon' in partial || 'parentId' in partial || 'order' in partial || 'isFavorite' in partial) {
      this.emit('page-list-updated');
    }

    // Trigger history snapshot if major content changes and not skipped
    if (!skipHistory && 'blocks' in partial && JSON.stringify(oldBlocks) !== JSON.stringify(partial.blocks)) {
      this.debouncedCreateSnapshot(updated);
    }

    return updated;
  }

  debouncedCreateSnapshot(page) {
    clearTimeout(this._snapTimeout);
    this._snapTimeout = setTimeout(() => {
      this.createPageSnapshot(page, 'Auto snapshot');
    }, 10000); // Snapshot every 10s of active editing
  }

  async createPageSnapshot(page, note = '') {
    try {
      const snap = {
        id: 'hist-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        pageId: page.id,
        title: page.title,
        icon: page.icon,
        cover: page.cover,
        blocks: JSON.parse(JSON.stringify(page.blocks)),
        timestamp: Date.now(),
        note
      };
      await db.put('history', snap);
      this.emit('history-updated', snap);
    } catch (e) {
      console.warn('Failed to save snapshot', e);
    }
  }

  async getPageHistory(pageId) {
    const allHistory = await db.getAll('history');
    return allHistory
      .filter(h => h.pageId === pageId)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  async restorePageRevision(revisionId) {
    const revision = await db.get('history', revisionId);
    if (!revision) return false;
    const page = this.pages.get(revision.pageId);
    if (!page) return false;

    // Create a snapshot of current state before restoring
    await this.createPageSnapshot(page, 'Before restoring revision');

    await this.updatePage(page.id, {
      title: revision.title,
      icon: revision.icon,
      cover: revision.cover,
      blocks: JSON.parse(JSON.stringify(revision.blocks))
    }, true);

    this.emit('page-restored-revision', page);
    return true;
  }

  async toggleFavorite(id) {
    const page = this.pages.get(id);
    if (!page) return;
    const isFavorite = !page.isFavorite;
    await this.updatePage(id, { isFavorite });
    return isFavorite;
  }

  async duplicatePage(id, targetParentId = undefined) {
    const original = this.pages.get(id);
    if (!original) return null;

    const parentId = targetParentId !== undefined ? targetParentId : original.parentId;
    const clone = await this.createPage({
      title: `${original.title} (Copy)`,
      icon: original.icon,
      cover: original.cover,
      parentId: parentId,
      blocks: JSON.parse(JSON.stringify(original.blocks)),
      databaseId: original.databaseId ? await this.duplicateDatabase(original.databaseId) : null
    });

    // Recursively clone subpages
    const children = this.getAllPages().filter(p => p.parentId === id && !p.isTrash);
    for (const child of children) {
      await this.duplicatePage(child.id, clone.id);
    }

    return clone;
  }

  async duplicateDatabase(dbId) {
    const origDb = this.databases.get(dbId);
    if (!origDb) return null;
    const newDbId = 'db-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const newDb = {
      ...JSON.parse(JSON.stringify(origDb)),
      id: newDbId
    };
    this.databases.set(newDbId, newDb);
    await db.put('databases', newDb);
    return newDbId;
  }

  async moveToTrash(id) {
    const page = this.pages.get(id);
    if (!page) return;

    const markTrashRecursive = (pageId) => {
      const p = this.pages.get(pageId);
      if (p) {
        p.isTrash = true;
        p.trashDate = Date.now();
        db.put('pages', p);
        const children = this.getAllPages().filter(c => c.parentId === pageId);
        children.forEach(c => markTrashRecursive(c.id));
      }
    };

    markTrashRecursive(id);

    // If active page was moved to trash, switch active page
    if (this.activePageId === id) {
      const remaining = this.getAllPages().filter(p => !p.isTrash);
      this.activePageId = remaining.length > 0 ? remaining[0].id : null;
      if (this.activePageId) {
        this.setSetting('activePageId', this.activePageId);
      }
    }

    this.emit('page-trashed', id);
    this.emit('page-list-updated');
    if (this.activePageId) {
      this.emit('active-page-changed', this.getPage(this.activePageId));
    }
  }

  async restoreFromTrash(id) {
    const page = this.pages.get(id);
    if (!page) return;

    // If parent is also in trash or does not exist, reset parent to root
    if (page.parentId) {
      const parent = this.pages.get(page.parentId);
      if (!parent || parent.isTrash) {
        page.parentId = null;
      }
    }

    page.isTrash = false;
    delete page.trashDate;
    await db.put('pages', page);

    this.emit('page-restored', page);
    this.emit('page-list-updated');
    await this.setActivePage(id);
  }

  async deletePermanently(id) {
    const deleteRecursive = async (pageId) => {
      const p = this.pages.get(pageId);
      if (p) {
        if (p.databaseId) {
          this.databases.delete(p.databaseId);
          await db.delete('databases', p.databaseId);
        }
        this.pages.delete(pageId);
        await db.delete('pages', pageId);

        const children = this.getAllPages().filter(c => c.parentId === pageId);
        for (const child of children) {
          await deleteRecursive(child.id);
        }
      }
    };

    await deleteRecursive(id);
    this.emit('page-permanently-deleted', id);
    this.emit('page-list-updated');
  }

  async emptyTrash() {
    const trashedPages = this.getAllPages().filter(p => p.isTrash);
    for (const p of trashedPages) {
      await this.deletePermanently(p.id);
    }
    this.emit('trash-emptied');
    this.emit('page-list-updated');
  }

  async reorderPages(draggedId, targetParentId, newIndex) {
    const dragged = this.pages.get(draggedId);
    if (!dragged) return;

    // Prevent dragging page into itself or its descendants
    const isDescendant = (parent, candidate) => {
      let cur = this.pages.get(candidate);
      while (cur && cur.parentId) {
        if (cur.parentId === parent) return true;
        cur = this.pages.get(cur.parentId);
      }
      return false;
    };

    if (draggedId === targetParentId || isDescendant(draggedId, targetParentId)) {
      return;
    }

    dragged.parentId = targetParentId;

    // Get all siblings in target parent
    let siblings = this.getAllPages()
      .filter(p => p.parentId === targetParentId && !p.isTrash && p.id !== draggedId)
      .sort((a, b) => a.order - b.order);

    siblings.splice(newIndex, 0, dragged);

    // Update orders
    for (let i = 0; i < siblings.length; i++) {
      siblings[i].order = i;
      await db.put('pages', siblings[i]);
    }

    this.emit('page-list-updated');
  }

  // --- Database Operations ---

  getDatabase(id) {
    return this.databases.get(id) || null;
  }

  async createDatabase(options = {}) {
    const id = 'db-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const newDb = {
      id,
      title: options.title || 'Untitled Database',
      pageId: options.pageId || null,
      currentView: 'table',
      views: [
        { id: 'v-' + Date.now() + '-1', name: 'Table', type: 'table' },
        { id: 'v-' + Date.now() + '-2', name: 'Board', type: 'board', groupBy: 'prop-status' },
        { id: 'v-' + Date.now() + '-3', name: 'List', type: 'list' }
      ],
      filter: { propertyId: 'all', value: '' },
      sort: { propertyId: 'prop-title', direction: 'asc' },
      properties: options.properties || [
        { id: 'prop-title', name: 'Name', type: 'title', width: 220 },
        {
          id: 'prop-status',
          name: 'Status',
          type: 'status',
          width: 140,
          options: [
            { id: 's1', label: 'Not Started', color: 'gray' },
            { id: 's2', label: 'In Progress', color: 'blue' },
            { id: 's3', label: 'Done', color: 'green' }
          ]
        },
        {
          id: 'prop-tags',
          name: 'Tags',
          type: 'multi-select',
          width: 160,
          options: [
            { id: 't1', label: 'Feature', color: 'blue' },
            { id: 't2', label: 'Bug', color: 'red' },
            { id: 't3', label: 'Task', color: 'green' }
          ]
        },
        { id: 'prop-date', name: 'Date', type: 'date', width: 130 }
      ],
      rows: options.rows || [
        {
          id: 'row-' + Date.now() + '-1',
          properties: {
            'prop-title': 'First Item',
            'prop-status': 'Not Started',
            'prop-tags': ['Task'],
            'prop-date': new Date().toISOString().split('T')[0]
          },
          contentBlocks: []
        }
      ]
    };

    this.databases.set(id, newDb);
    await db.put('databases', newDb);
    this.emit('database-created', newDb);
    return newDb;
  }

  async updateDatabase(id, partial) {
    const database = this.databases.get(id);
    if (!database) return null;

    const updated = {
      ...database,
      ...partial
    };

    this.databases.set(id, updated);
    this.scheduleSave('database', updated);
    this.emit('database-updated', updated);
    return updated;
  }

  async addDatabaseRow(dbId, initialProps = {}) {
    const database = this.databases.get(dbId);
    if (!database) return null;

    const newRow = {
      id: 'row-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      properties: {
        'prop-title': 'New Item',
        ...initialProps
      },
      contentBlocks: []
    };

    database.rows.push(newRow);
    await this.updateDatabase(dbId, { rows: database.rows });
    return newRow;
  }

  async updateDatabaseRow(dbId, rowId, properties, contentBlocks = undefined) {
    const database = this.databases.get(dbId);
    if (!database) return null;

    const row = database.rows.find(r => r.id === rowId);
    if (!row) return null;

    row.properties = { ...row.properties, ...properties };
    if (contentBlocks !== undefined) {
      row.contentBlocks = contentBlocks;
    }

    await this.updateDatabase(dbId, { rows: database.rows });
    return row;
  }

  async deleteDatabaseRow(dbId, rowId) {
    const database = this.databases.get(dbId);
    if (!database) return;

    database.rows = database.rows.filter(r => r.id !== rowId);
    await this.updateDatabase(dbId, { rows: database.rows });
  }

  async addDatabaseProperty(dbId, propDef) {
    const database = this.databases.get(dbId);
    if (!database) return;

    const propId = 'prop-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5);
    const newProp = {
      id: propId,
      name: propDef.name || 'New Property',
      type: propDef.type || 'text',
      width: 140,
      options: propDef.options || []
    };

    database.properties.push(newProp);
    await this.updateDatabase(dbId, { properties: database.properties });
    return newProp;
  }

  async deleteDatabaseProperty(dbId, propId) {
    const database = this.databases.get(dbId);
    if (!database) return;

    database.properties = database.properties.filter(p => p.id !== propId);
    database.rows.forEach(r => {
      delete r.properties[propId];
    });

    await this.updateDatabase(dbId, {
      properties: database.properties,
      rows: database.rows
    });
  }

  // --- Workspace Import / Export ---

  async exportWorkspaceJSON() {
    const pages = Array.from(this.pages.values());
    const databases = Array.from(this.databases.values());
    const settings = Array.from(this.settings.entries()).map(([k, v]) => ({ key: k, value: v }));
    const history = await db.getAll('history');

    return {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      appName: 'NoteSpace',
      workspace: {
        pages,
        databases,
        settings,
        history
      }
    };
  }

  async importWorkspaceJSON(jsonData) {
    // Validate schema
    if (!jsonData || typeof jsonData !== 'object') {
      throw new Error('Invalid JSON file format.');
    }
    if (!jsonData.workspace || !Array.isArray(jsonData.workspace.pages)) {
      throw new Error('Missing or invalid workspace pages array in import data.');
    }

    const { pages, databases = [], settings = [], history = [] } = jsonData.workspace;

    // Clear current database
    await db.clear('pages');
    await db.clear('databases');
    await db.clear('settings');
    await db.clear('history');

    // Batch insert imported data
    await db.putBatch('pages', pages);
    if (databases.length > 0) await db.putBatch('databases', databases);
    if (settings.length > 0) await db.putBatch('settings', settings);
    if (history.length > 0) await db.putBatch('history', history);

    // Reload state
    this.pages.clear();
    this.databases.clear();
    this.settings.clear();

    pages.forEach(p => this.pages.set(p.id, p));
    databases.forEach(d => this.databases.set(d.id, d));
    settings.forEach(s => this.settings.set(s.key, s.value));

    const validPages = pages.filter(p => !p.isTrash);
    this.activePageId = validPages.length > 0 ? validPages[0].id : null;

    this.emit('workspace-reloaded');
    this.emit('page-list-updated');
    if (this.activePageId) {
      this.emit('active-page-changed', this.getPage(this.activePageId));
    }

    return {
      pagesCount: pages.length,
      databasesCount: databases.length
    };
  }

  async resetToDefaults() {
    await db.clear('pages');
    await db.clear('databases');
    await db.clear('settings');
    await db.clear('history');

    this.pages.clear();
    this.databases.clear();
    this.settings.clear();

    await this.init();
    this.emit('workspace-reloaded');
    this.emit('page-list-updated');
    if (this.activePageId) {
      this.emit('active-page-changed', this.getPage(this.activePageId));
    }
  }
}
const store = new Store();


  // ==========================================
  // FILE: js/utils/exportImport.js
  // ==========================================
/**
 * NoteSpace - Export & Import System
 * Handles JSON snapshot download/upload and Markdown document generation.
 */
function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function downloadMarkdown(content, filename) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function pageToMarkdown(page) {
  if (!page) return '';
  let md = `# ${page.title || 'Untitled'}\n\n`;

  if (page.blocks && Array.isArray(page.blocks)) {
    page.blocks.forEach(block => {
      const text = (block.content || '').replace(/<[^>]*>/g, ''); // strip HTML tags
      switch (block.type) {
        case 'heading1':
          md += `# ${text}\n\n`;
          break;
        case 'heading2':
          md += `## ${text}\n\n`;
          break;
        case 'heading3':
          md += `### ${text}\n\n`;
          break;
        case 'bulletList':
          md += `- ${text}\n`;
          break;
        case 'numberedList':
          md += `1. ${text}\n`;
          break;
        case 'checklist':
          const check = block.metadata && block.metadata.checked ? '[x]' : '[ ]';
          md += `- ${check} ${text}\n`;
          break;
        case 'quote':
          md += `> ${text}\n\n`;
          break;
        case 'code':
          const lang = (block.metadata && block.metadata.language) || '';
          md += `\`\`\`${lang}\n${block.content || ''}\n\`\`\`\n\n`;
          break;
        case 'divider':
          md += `---\n\n`;
          break;
        case 'callout':
          md += `> 💡 **Callout:** ${text}\n\n`;
          break;
        case 'toggle':
          md += `<details>\n<summary>${text}</summary>\n\n${(block.metadata && block.metadata.children) || ''}\n</details>\n\n`;
          break;
        case 'table':
          if (block.metadata && block.metadata.rows && block.metadata.rows.length > 0) {
            const rows = block.metadata.rows;
            const header = rows[0];
            md += `| ${header.join(' | ')} |\n`;
            md += `| ${header.map(() => '---').join(' | ')} |\n`;
            for (let i = 1; i < rows.length; i++) {
              md += `| ${rows[i].join(' | ')} |\n`;
            }
            md += '\n';
          }
          break;
        case 'bookmark':
          md += `[${(block.metadata && block.metadata.title) || block.content}](${block.content})\n\n`;
          break;
        case 'image':
          md += `![${(block.metadata && block.metadata.caption) || 'Image'}](${block.content})\n\n`;
          break;
        case 'paragraph':
        default:
          if (text.trim()) {
            md += `${text}\n\n`;
          }
          break;
      }
    });
  }

  return md;
}
async function exportCurrentPageMarkdown(pageId) {
  const page = store.getPage(pageId);
  if (!page) return;
  const md = pageToMarkdown(page);
  const cleanTitle = (page.title || 'Untitled').replace(/[^a-z0-9]/gi, '_').toLowerCase();
  downloadMarkdown(md, `${cleanTitle}.md`);
}
async function exportWorkspace() {
  const data = await store.exportWorkspaceJSON();
  const dateStr = new Date().toISOString().split('T')[0];
  downloadJSON(data, `NoteSpace_Backup_${dateStr}.json`);
}
function readJSONFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        resolve(json);
      } catch (err) {
        reject(new Error('Invalid JSON file format.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file);
  });
}


  // ==========================================
  // FILE: js/editor/blocks.js
  // ==========================================
/**
 * NoteSpace - Block Types & Rendering Engine
 * Implements 14+ block types with rich DOM manipulation, metadata storage, and contextual interactions.
 */
const BLOCK_DEFINITIONS = [
  {
    type: 'paragraph',
    label: 'Text',
    description: 'Just start writing with plain text.',
    icon: 'paragraph',
    shortcut: 'Enter',
    defaultContent: '',
    defaultMetadata: {}
  },
  {
    type: 'heading1',
    label: 'Heading 1',
    description: 'Big section heading.',
    icon: 'heading1',
    shortcut: '# + Space',
    defaultContent: '',
    defaultMetadata: {}
  },
  {
    type: 'heading2',
    label: 'Heading 2',
    description: 'Medium section heading.',
    icon: 'heading2',
    shortcut: '## + Space',
    defaultContent: '',
    defaultMetadata: {}
  },
  {
    type: 'heading3',
    label: 'Heading 3',
    description: 'Small section heading.',
    icon: 'heading3',
    shortcut: '### + Space',
    defaultContent: '',
    defaultMetadata: {}
  },
  {
    type: 'bulletList',
    label: 'Bulleted List',
    description: 'Create a simple bulleted list.',
    icon: 'bulletList',
    shortcut: '- + Space',
    defaultContent: '',
    defaultMetadata: {}
  },
  {
    type: 'numberedList',
    label: 'Numbered List',
    description: 'Create a list with numbering.',
    icon: 'numberedList',
    shortcut: '1. + Space',
    defaultContent: '',
    defaultMetadata: {}
  },
  {
    type: 'checklist',
    label: 'To-do List',
    description: 'Track tasks with a to-do list.',
    icon: 'checklist',
    shortcut: '[] + Space',
    defaultContent: '',
    defaultMetadata: { checked: false }
  },
  {
    type: 'toggle',
    label: 'Toggle List',
    description: 'Toggles can hide and show content inside.',
    icon: 'toggle',
    shortcut: '> + Space',
    defaultContent: '',
    defaultMetadata: { isOpen: false, children: '' }
  },
  {
    type: 'quote',
    label: 'Quote',
    description: 'Capture a quote or key takeaway.',
    icon: 'quote',
    shortcut: '" + Space',
    defaultContent: '',
    defaultMetadata: {}
  },
  {
    type: 'callout',
    label: 'Callout',
    description: 'Make writing stand out with an icon & accent.',
    icon: 'callout',
    shortcut: '/callout',
    defaultContent: '',
    defaultMetadata: { icon: '💡', color: 'blue' }
  },
  {
    type: 'divider',
    label: 'Divider',
    description: 'Visually divide blocks with a thin line.',
    icon: 'divider',
    shortcut: '---',
    defaultContent: '',
    defaultMetadata: {}
  },
  {
    type: 'code',
    label: 'Code Block',
    description: 'Capture a code snippet with formatting.',
    icon: 'code',
    shortcut: '```',
    defaultContent: '',
    defaultMetadata: { language: 'javascript' }
  },
  {
    type: 'table',
    label: 'Table',
    description: 'Add a structured inline table.',
    icon: 'table',
    shortcut: '/table',
    defaultContent: '',
    defaultMetadata: {
      rows: [
        ['Column 1', 'Column 2', 'Column 3'],
        ['', '', ''],
        ['', '', '']
      ]
    }
  },
  {
    type: 'image',
    label: 'Image',
    description: 'Upload or embed with a link.',
    icon: 'image',
    shortcut: '/image',
    defaultContent: '',
    defaultMetadata: { caption: '' }
  },
  {
    type: 'bookmark',
    label: 'Web Bookmark',
    description: 'Save a visual web link card preview.',
    icon: 'bookmark',
    shortcut: '/bookmark',
    defaultContent: '',
    defaultMetadata: { title: '', description: '', icon: '🌐' }
  },
  {
    type: 'database',
    label: 'Inline Database',
    description: 'Embed a dynamic database with views.',
    icon: 'database',
    shortcut: '/database',
    defaultContent: '',
    defaultMetadata: { databaseId: null }
  }
];
function getBlockDefinition(type) {
  return BLOCK_DEFINITIONS.find(b => b.type === type) || BLOCK_DEFINITIONS[0];
}

/**
 * Render Block Element DOM
 */
function renderBlockElement(block, onUpdate, onDelete, onConvert) {
  const blockEl = createElement('div', `ns-block ns-block-${block.type}`);
  blockEl.dataset.blockId = block.id;
  blockEl.dataset.blockType = block.type;

  // 1. Block Handle / Gutter (Controls appear contextually on hover)
  const gutterEl = createElement('div', 'ns-block-gutter');
  gutterEl.innerHTML = `
    <button class="ns-gutter-btn ns-add-block-btn" title="Add block below" aria-label="Add block below">
      ${Icons.plus}
    </button>
    <div class="ns-gutter-btn ns-drag-handle" title="Drag to move or click for menu" aria-label="Drag or options">
      ${Icons.grip}
    </div>
  `;
  blockEl.appendChild(gutterEl);

  // 2. Block Content Container
  const contentWrapper = createElement('div', 'ns-block-content-wrapper');

  switch (block.type) {
    case 'paragraph': {
      const editor = createElement('div', 'ns-block-editor ns-paragraph-editor');
      editor.contentEditable = 'true';
      editor.setAttribute('data-placeholder', "Type '/' for commands...");
      editor.innerHTML = block.content || '';
      contentWrapper.appendChild(editor);
      break;
    }

    case 'heading1': {
      const editor = createElement('h1', 'ns-block-editor ns-heading1-editor');
      editor.contentEditable = 'true';
      editor.setAttribute('data-placeholder', 'Heading 1');
      editor.innerHTML = block.content || '';
      contentWrapper.appendChild(editor);
      break;
    }

    case 'heading2': {
      const editor = createElement('h2', 'ns-block-editor ns-heading2-editor');
      editor.contentEditable = 'true';
      editor.setAttribute('data-placeholder', 'Heading 2');
      editor.innerHTML = block.content || '';
      contentWrapper.appendChild(editor);
      break;
    }

    case 'heading3': {
      const editor = createElement('h3', 'ns-block-editor ns-heading3-editor');
      editor.contentEditable = 'true';
      editor.setAttribute('data-placeholder', 'Heading 3');
      editor.innerHTML = block.content || '';
      contentWrapper.appendChild(editor);
      break;
    }

    case 'bulletList': {
      const row = createElement('div', 'ns-bullet-row');
      const bullet = createElement('div', 'ns-bullet-marker');
      bullet.innerHTML = '•';
      const editor = createElement('div', 'ns-block-editor ns-bullet-editor');
      editor.contentEditable = 'true';
      editor.setAttribute('data-placeholder', 'List item');
      editor.innerHTML = block.content || '';
      row.appendChild(bullet);
      row.appendChild(editor);
      contentWrapper.appendChild(row);
      break;
    }

    case 'numberedList': {
      const row = createElement('div', 'ns-numbered-row');
      const num = createElement('div', 'ns-numbered-marker');
      num.innerHTML = '1.';
      const editor = createElement('div', 'ns-block-editor ns-numbered-editor');
      editor.contentEditable = 'true';
      editor.setAttribute('data-placeholder', 'List item');
      editor.innerHTML = block.content || '';
      row.appendChild(num);
      row.appendChild(editor);
      contentWrapper.appendChild(row);
      break;
    }

    case 'checklist': {
      const isChecked = block.metadata && block.metadata.checked;
      const row = createElement('div', `ns-checklist-row ${isChecked ? 'is-checked' : ''}`);
      const checkbox = createElement('input', 'ns-checkbox-input', '', {
        type: 'checkbox'
      });
      if (isChecked) checkbox.checked = true;

      const editor = createElement('div', 'ns-block-editor ns-checklist-editor');
      editor.contentEditable = 'true';
      editor.setAttribute('data-placeholder', 'To-do');
      editor.innerHTML = block.content || '';

      checkbox.addEventListener('change', (e) => {
        const checked = e.target.checked;
        if (checked) {
          row.classList.add('is-checked');
        } else {
          row.classList.remove('is-checked');
        }
        onUpdate({
          ...block,
          metadata: { ...(block.metadata || {}), checked }
        });
      });

      row.appendChild(checkbox);
      row.appendChild(editor);
      contentWrapper.appendChild(row);
      break;
    }

    case 'quote': {
      const quoteWrap = createElement('blockquote', 'ns-quote-block');
      const editor = createElement('div', 'ns-block-editor ns-quote-editor');
      editor.contentEditable = 'true';
      editor.setAttribute('data-placeholder', 'Empty quote');
      editor.innerHTML = block.content || '';
      quoteWrap.appendChild(editor);
      contentWrapper.appendChild(quoteWrap);
      break;
    }

    case 'divider': {
      const hr = createElement('div', 'ns-divider-line');
      hr.setAttribute('tabindex', '0');
      contentWrapper.appendChild(hr);
      break;
    }

    case 'code': {
      const codeWrap = createElement('div', 'ns-code-block-container');
      const header = createElement('div', 'ns-code-header');
      const lang = (block.metadata && block.metadata.language) || 'javascript';

      header.innerHTML = `
        <div class="ns-code-lang-select">
          <select class="ns-lang-dropdown">
            <option value="javascript" ${lang === 'javascript' ? 'selected' : ''}>JavaScript</option>
            <option value="typescript" ${lang === 'typescript' ? 'selected' : ''}>TypeScript</option>
            <option value="python" ${lang === 'python' ? 'selected' : ''}>Python</option>
            <option value="html" ${lang === 'html' ? 'selected' : ''}>HTML</option>
            <option value="css" ${lang === 'css' ? 'selected' : ''}>CSS</option>
            <option value="json" ${lang === 'json' ? 'selected' : ''}>JSON</option>
            <option value="sql" ${lang === 'sql' ? 'selected' : ''}>SQL</option>
            <option value="bash" ${lang === 'bash' ? 'selected' : ''}>Bash</option>
          </select>
        </div>
        <button class="ns-btn-copy-code" title="Copy code">
          ${Icons.copy} <span>Copy</span>
        </button>
      `;

      const editor = createElement('div', 'ns-block-editor ns-code-editor');
      editor.contentEditable = 'true';
      editor.setAttribute('spellcheck', 'false');
      editor.setAttribute('data-placeholder', '// Type code here...');
      editor.innerText = block.content || '';

      const copyBtn = header.querySelector('.ns-btn-copy-code');
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(editor.innerText || '');
        copyBtn.querySelector('span').innerText = 'Copied!';
        setTimeout(() => {
          copyBtn.querySelector('span').innerText = 'Copy';
        }, 1500);
      });

      const langSelect = header.querySelector('.ns-lang-dropdown');
      langSelect.addEventListener('change', (e) => {
        onUpdate({
          ...block,
          metadata: { ...(block.metadata || {}), language: e.target.value }
        });
      });

      codeWrap.appendChild(header);
      codeWrap.appendChild(editor);
      contentWrapper.appendChild(codeWrap);
      break;
    }

    case 'callout': {
      const color = (block.metadata && block.metadata.color) || 'blue';
      const icon = (block.metadata && block.metadata.icon) || '💡';
      const calloutWrap = createElement('div', `ns-callout-block ns-callout-${color}`);

      const iconBtn = createElement('button', 'ns-callout-icon-btn', icon, {
        title: 'Change Icon'
      });

      const editor = createElement('div', 'ns-block-editor ns-callout-editor');
      editor.contentEditable = 'true';
      editor.setAttribute('data-placeholder', 'Type a callout note...');
      editor.innerHTML = block.content || '';

      // Icon click menu
      iconBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showCalloutPicker(iconBtn, (newIcon, newColor) => {
          onUpdate({
            ...block,
            metadata: { ...(block.metadata || {}), icon: newIcon, color: newColor }
          });
        });
      });

      calloutWrap.appendChild(iconBtn);
      calloutWrap.appendChild(editor);
      contentWrapper.appendChild(calloutWrap);
      break;
    }

    case 'toggle': {
      const isOpen = block.metadata && block.metadata.isOpen;
      const toggleWrap = createElement('div', `ns-toggle-block ${isOpen ? 'is-open' : ''}`);

      const header = createElement('div', 'ns-toggle-header');
      const arrow = createElement('button', 'ns-toggle-arrow', Icons.chevronRight);
      const editor = createElement('div', 'ns-block-editor ns-toggle-editor');
      editor.contentEditable = 'true';
      editor.setAttribute('data-placeholder', 'Toggle header');
      editor.innerHTML = block.content || '';

      header.appendChild(arrow);
      header.appendChild(editor);

      const body = createElement('div', 'ns-toggle-body');
      const childEditor = createElement('div', 'ns-toggle-child-editor');
      childEditor.contentEditable = 'true';
      childEditor.setAttribute('data-placeholder', 'Empty toggle. Type text inside...');
      childEditor.innerHTML = (block.metadata && block.metadata.children) || '';

      body.appendChild(childEditor);
      toggleWrap.appendChild(header);
      toggleWrap.appendChild(body);

      arrow.addEventListener('click', () => {
        const nextState = !toggleWrap.classList.contains('is-open');
        if (nextState) {
          toggleWrap.classList.add('is-open');
        } else {
          toggleWrap.classList.remove('is-open');
        }
        onUpdate({
          ...block,
          metadata: { ...(block.metadata || {}), isOpen: nextState }
        });
      });

      childEditor.addEventListener('input', () => {
        onUpdate({
          ...block,
          metadata: { ...(block.metadata || {}), children: childEditor.innerHTML }
        });
      });

      contentWrapper.appendChild(toggleWrap);
      break;
    }

    case 'table': {
      const tableContainer = createElement('div', 'ns-table-block-container');
      const rows = (block.metadata && block.metadata.rows) || [
        ['Header 1', 'Header 2', 'Header 3'],
        ['', '', '']
      ];

      const renderTableDOM = () => {
        tableContainer.innerHTML = '';

        const controls = createElement('div', 'ns-table-controls');
        controls.innerHTML = `
          <button class="ns-btn-sm ns-btn-add-row" title="Add Row">${Icons.plus} Add Row</button>
          <button class="ns-btn-sm ns-btn-add-col" title="Add Column">${Icons.plus} Add Column</button>
        `;

        const table = createElement('table', 'ns-table-element');
        const tbody = createElement('tbody');

        rows.forEach((row, rIdx) => {
          const tr = createElement('tr');
          row.forEach((cell, cIdx) => {
            const cellTag = rIdx === 0 ? 'th' : 'td';
            const td = createElement(cellTag, 'ns-table-cell');
            td.contentEditable = 'true';
            td.innerHTML = escapeHTML(cell);

            td.addEventListener('input', () => {
              rows[rIdx][cIdx] = td.innerText;
              onUpdate({
                ...block,
                metadata: { ...(block.metadata || {}), rows }
              });
            });

            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        tableContainer.appendChild(controls);
        tableContainer.appendChild(table);

        controls.querySelector('.ns-btn-add-row').addEventListener('click', () => {
          const newRow = new Array(rows[0].length).fill('');
          rows.push(newRow);
          onUpdate({ ...block, metadata: { ...(block.metadata || {}), rows } });
          renderTableDOM();
        });

        controls.querySelector('.ns-btn-add-col').addEventListener('click', () => {
          rows.forEach((r, idx) => {
            r.push(idx === 0 ? `Column ${r.length + 1}` : '');
          });
          onUpdate({ ...block, metadata: { ...(block.metadata || {}), rows } });
          renderTableDOM();
        });
      };

      renderTableDOM();
      contentWrapper.appendChild(tableContainer);
      break;
    }

    case 'image': {
      const imgContainer = createElement('div', 'ns-image-block-container');
      const url = block.content;
      const caption = (block.metadata && block.metadata.caption) || '';

      if (!url) {
        imgContainer.innerHTML = `
          <div class="ns-image-placeholder">
            <div class="ns-image-icon">${Icons.image}</div>
            <div class="ns-image-inputs">
              <input type="text" class="ns-input ns-img-url-input" placeholder="Paste image URL..." />
              <button class="ns-btn ns-btn-primary ns-btn-embed-img">Embed Image</button>
              <label class="ns-btn ns-btn-secondary ns-btn-upload-img">
                Upload File
                <input type="file" accept="image/*" style="display:none;" />
              </label>
            </div>
          </div>
        `;

        const urlInput = imgContainer.querySelector('.ns-img-url-input');
        const embedBtn = imgContainer.querySelector('.ns-btn-embed-img');
        const fileInput = imgContainer.querySelector('input[type="file"]');

        const applyUrl = (newUrl) => {
          if (!newUrl) return;
          onUpdate({
            ...block,
            content: newUrl
          });
        };

        embedBtn.addEventListener('click', () => applyUrl(urlInput.value.trim()));
        urlInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') applyUrl(urlInput.value.trim());
        });

        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (re) => applyUrl(re.target.result);
            reader.readAsDataURL(file);
          }
        });
      } else {
        imgContainer.innerHTML = `
          <div class="ns-image-view">
            <img src="${url}" alt="${caption}" class="ns-rendered-image" />
            <input type="text" class="ns-image-caption" placeholder="Add a caption..." value="${escapeHTML(caption)}" />
          </div>
        `;

        const captionInput = imgContainer.querySelector('.ns-image-caption');
        captionInput.addEventListener('input', (e) => {
          onUpdate({
            ...block,
            metadata: { ...(block.metadata || {}), caption: e.target.value }
          });
        });
      }

      contentWrapper.appendChild(imgContainer);
      break;
    }

    case 'bookmark': {
      const bookmarkWrap = createElement('div', 'ns-bookmark-container');
      const url = block.content;
      const title = (block.metadata && block.metadata.title) || url;
      const desc = (block.metadata && block.metadata.description) || 'Web link preview';
      const icon = (block.metadata && block.metadata.icon) || '🌐';

      if (!url) {
        bookmarkWrap.innerHTML = `
          <div class="ns-bookmark-input-wrap">
            <input type="text" class="ns-input ns-bookmark-url-input" placeholder="Paste a web bookmark URL..." />
            <button class="ns-btn ns-btn-primary ns-btn-create-bookmark">Add Bookmark</button>
          </div>
        `;

        const urlInp = bookmarkWrap.querySelector('.ns-bookmark-url-input');
        const addBtn = bookmarkWrap.querySelector('.ns-btn-create-bookmark');

        const saveBookmark = () => {
          const u = urlInp.value.trim();
          if (!u) return;
          try {
            const parsed = new URL(u);
            onUpdate({
              ...block,
              content: u,
              metadata: {
                title: parsed.hostname,
                description: `Link to ${parsed.hostname}`,
                icon: '🌐'
              }
            });
          } catch (e) {
            onUpdate({
              ...block,
              content: u,
              metadata: { title: u, description: 'Web Link', icon: '🌐' }
            });
          }
        };

        addBtn.addEventListener('click', saveBookmark);
        urlInp.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') saveBookmark();
        });
      } else {
        bookmarkWrap.innerHTML = `
          <a href="${url}" target="_blank" rel="noopener noreferrer" class="ns-bookmark-card">
            <div class="ns-bookmark-info">
              <div class="ns-bookmark-title">${escapeHTML(title)}</div>
              <div class="ns-bookmark-desc">${escapeHTML(desc)}</div>
              <div class="ns-bookmark-url">${Icons.link} ${escapeHTML(url)}</div>
            </div>
            <div class="ns-bookmark-icon">${icon}</div>
          </a>
        `;
      }

      contentWrapper.appendChild(bookmarkWrap);
      break;
    }

    case 'database': {
      const dbWrap = createElement('div', 'ns-database-block-wrapper');
      dbWrap.dataset.databaseId = (block.metadata && block.metadata.databaseId) || '';
      contentWrapper.appendChild(dbWrap);
      break;
    }

    default: {
      const editor = createElement('div', 'ns-block-editor');
      editor.contentEditable = 'true';
      editor.innerHTML = block.content || '';
      contentWrapper.appendChild(editor);
      break;
    }
  }

  blockEl.appendChild(contentWrapper);
  return blockEl;
}

/**
 * Callout Icon & Color Picker Popover
 */
function showCalloutPicker(targetBtn, onSelect) {
  // Remove existing pickers
  document.querySelectorAll('.ns-callout-picker-popover').forEach(p => p.remove());

  const popover = createElement('div', 'ns-callout-picker-popover');
  const icons = ['💡', '📌', '🚀', '⚡', '🔥', '⚠️', '⭐', '🎉', '📖', '🛡️', '💬', '❤️'];
  const colors = [
    { name: 'blue', label: 'Blue', hex: '#3b82f6' },
    { name: 'green', label: 'Green', hex: '#10b981' },
    { name: 'yellow', label: 'Yellow', hex: '#f59e0b' },
    { name: 'red', label: 'Red', hex: '#ef4444' },
    { name: 'purple', label: 'Purple', hex: '#8b5cf6' },
    { name: 'gray', label: 'Gray', hex: '#6b7280' }
  ];

  let selectedIcon = '💡';
  let selectedColor = 'blue';

  popover.innerHTML = `
    <div class="ns-picker-section">
      <div class="ns-picker-title">Icon</div>
      <div class="ns-icon-grid">
        ${icons.map(ic => `<button class="ns-icon-opt" data-icon="${ic}">${ic}</button>`).join('')}
      </div>
    </div>
    <div class="ns-picker-section">
      <div class="ns-picker-title">Color</div>
      <div class="ns-color-grid">
        ${colors.map(c => `<button class="ns-color-opt" data-color="${c.name}" style="background-color: ${c.hex}" title="${c.label}"></button>`).join('')}
      </div>
    </div>
  `;

  document.body.appendChild(popover);

  const rect = targetBtn.getBoundingClientRect();
  popover.style.top = `${rect.bottom + window.scrollY + 6}px`;
  popover.style.left = `${rect.left + window.scrollX}px`;

  popover.querySelectorAll('.ns-icon-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedIcon = btn.dataset.icon;
      onSelect(selectedIcon, selectedColor);
      popover.remove();
    });
  });

  popover.querySelectorAll('.ns-color-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedColor = btn.dataset.color;
      onSelect(selectedIcon, selectedColor);
      popover.remove();
    });
  });

  const closeHandler = (e) => {
    if (!popover.contains(e.target) && e.target !== targetBtn) {
      popover.remove();
      document.removeEventListener('click', closeHandler);
    }
  };
  setTimeout(() => document.addEventListener('click', closeHandler), 10);
}


  // ==========================================
  // FILE: js/editor/slashMenu.js
  // ==========================================
/**
 * NoteSpace - Slash Command Menu Controller
 * Handles '/' trigger detection, fuzzy search filtering, keyboard navigation, and block conversion.
 */
class SlashMenu {
  constructor(onSelect) {
    this.onSelect = onSelect;
    this.menuEl = null;
    this.isOpen = false;
    this.selectedIndex = 0;
    this.filteredBlocks = [];
    this.triggerBlockEl = null;
    this.query = '';

    this.initDOM();
  }

  initDOM() {
    this.menuEl = createElement('div', 'ns-slash-menu');
    this.menuEl.style.display = 'none';
    document.body.appendChild(this.menuEl);

    // Click outside to close
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.menuEl.contains(e.target)) {
        this.close();
      }
    });
  }

  open(blockEl, rect) {
    this.triggerBlockEl = blockEl;
    this.isOpen = true;
    this.query = '';
    this.selectedIndex = 0;
    this.render();

    this.menuEl.style.display = 'block';

    // Position popover
    if (rect) {
      let top = rect.bottom + window.scrollY + 6;
      let left = rect.left + window.scrollX;

      // Bound checking
      const menuWidth = 320;
      const menuHeight = 360;
      if (left + menuWidth > window.innerWidth - 20) {
        left = window.innerWidth - menuWidth - 20;
      }
      if (top + menuHeight > window.innerHeight + window.scrollY - 20) {
        top = rect.top + window.scrollY - menuHeight - 6;
      }

      this.menuEl.style.top = `${Math.max(10, top)}px`;
      this.menuEl.style.left = `${Math.max(10, left)}px`;
    }
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.menuEl.style.display = 'none';
    this.triggerBlockEl = null;
    this.query = '';
  }

  setQuery(query) {
    this.query = query.toLowerCase().trim();
    this.selectedIndex = 0;
    this.render();
  }

  render() {
    // Filter blocks based on query
    this.filteredBlocks = BLOCK_DEFINITIONS.filter(b => {
      if (!this.query) return true;
      return (
        b.label.toLowerCase().includes(this.query) ||
        b.type.toLowerCase().includes(this.query) ||
        (b.shortcut && b.shortcut.toLowerCase().includes(this.query)) ||
        b.description.toLowerCase().includes(this.query)
      );
    });

    this.menuEl.innerHTML = '';

    const header = createElement('div', 'ns-slash-header', 'Basic Blocks');
    this.menuEl.appendChild(header);

    if (this.filteredBlocks.length === 0) {
      const empty = createElement('div', 'ns-slash-empty', 'No matching blocks found');
      this.menuEl.appendChild(empty);
      return;
    }

    const list = createElement('div', 'ns-slash-list');
    this.filteredBlocks.forEach((blockDef, index) => {
      const item = createElement('div', `ns-slash-item ${index === this.selectedIndex ? 'is-selected' : ''}`);
      item.innerHTML = `
        <div class="ns-slash-item-icon">${getIcon(blockDef.icon)}</div>
        <div class="ns-slash-item-info">
          <div class="ns-slash-item-label">${blockDef.label}</div>
          <div class="ns-slash-item-desc">${blockDef.description}</div>
        </div>
        ${blockDef.shortcut ? `<div class="ns-slash-item-shortcut">${blockDef.shortcut}</div>` : ''}
      `;

      item.addEventListener('mouseenter', () => {
        this.selectedIndex = index;
        this.updateSelection();
      });

      item.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectCurrent();
      });

      list.appendChild(item);
    });

    this.menuEl.appendChild(list);
  }

  updateSelection() {
    const items = this.menuEl.querySelectorAll('.ns-slash-item');
    items.forEach((item, i) => {
      if (i === this.selectedIndex) {
        item.classList.add('is-selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('is-selected');
      }
    });
  }

  handleKeyDown(e) {
    if (!this.isOpen) return false;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.filteredBlocks.length > 0) {
        this.selectedIndex = (this.selectedIndex + 1) % this.filteredBlocks.length;
        this.updateSelection();
      }
      return true;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.filteredBlocks.length > 0) {
        this.selectedIndex = (this.selectedIndex - 1 + this.filteredBlocks.length) % this.filteredBlocks.length;
        this.updateSelection();
      }
      return true;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      this.selectCurrent();
      return true;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
      return true;
    }

    return false;
  }

  selectCurrent() {
    const selectedDef = this.filteredBlocks[this.selectedIndex];
    if (selectedDef && this.onSelect) {
      const targetEl = this.triggerBlockEl;
      this.close();
      this.onSelect(selectedDef, targetEl);
    }
  }
}


  // ==========================================
  // FILE: js/editor/inlineToolbar.js
  // ==========================================
/**
 * NoteSpace - Inline Formatting Bubble Toolbar
 * Floating bubble toolbar for rich text operations (Bold, Italic, Strikethrough, Code, Link, Highlight).
 */
class InlineToolbar {
  constructor() {
    this.el = null;
    this.isOpen = false;
    this.currentRange = null;

    this.initDOM();
    this.bindEvents();
  }

  initDOM() {
    this.el = createElement('div', 'ns-inline-toolbar');
    this.el.style.display = 'none';

    this.el.innerHTML = `
      <button class="ns-tool-btn" data-command="bold" title="Bold (Ctrl+B)">
        ${Icons.bold}
      </button>
      <button class="ns-tool-btn" data-command="italic" title="Italic (Ctrl+I)">
        ${Icons.italic}
      </button>
      <button class="ns-tool-btn" data-command="underline" title="Underline (Ctrl+U)">
        ${Icons.underline}
      </button>
      <button class="ns-tool-btn" data-command="strikeThrough" title="Strikethrough">
        ${Icons.strikethrough}
      </button>
      <button class="ns-tool-btn" data-command="code" title="Inline Code (Ctrl+E)">
        ${Icons.code}
      </button>
      <button class="ns-tool-btn" data-command="link" title="Link (Ctrl+K)">
        ${Icons.link}
      </button>
      <div class="ns-tool-divider"></div>
      <button class="ns-tool-btn ns-btn-highlight" data-command="highlight" title="Highlight">
        ${Icons.highlighter}
      </button>
      
      <div class="ns-link-popover" style="display:none;">
        <input type="text" class="ns-link-input" placeholder="Paste or type link URL..." />
        <button class="ns-btn-apply-link">Apply</button>
      </div>

      <div class="ns-color-popover" style="display:none;">
        <button class="ns-color-chip" data-color="#fef08a" style="background:#fef08a;" title="Yellow"></button>
        <button class="ns-color-chip" data-color="#bbf7d0" style="background:#bbf7d0;" title="Green"></button>
        <button class="ns-color-chip" data-color="#bfdbfe" style="background:#bfdbfe;" title="Blue"></button>
        <button class="ns-color-chip" data-color="#fecaca" style="background:#fecaca;" title="Red"></button>
        <button class="ns-color-chip" data-color="#e9d5ff" style="background:#e9d5ff;" title="Purple"></button>
        <button class="ns-color-chip" data-color="transparent" style="background:none;border:1px dashed currentColor;" title="Clear"></button>
      </div>
    `;

    document.body.appendChild(this.el);
  }

  bindEvents() {
    // Document selection change listener
    document.addEventListener('selectionchange', () => {
      // Small timeout to allow mouseup/keyup to settle
      setTimeout(() => this.checkSelection(), 50);
    });

    // Toolbar button clicks
    this.el.querySelectorAll('.ns-tool-btn').forEach(btn => {
      btn.addEventListener('mousedown', (e) => {
        e.preventDefault(); // Prevent losing text selection
        const command = btn.dataset.command;
        this.executeCommand(command);
      });
    });

    // Link apply
    const linkInput = this.el.querySelector('.ns-link-input');
    const applyBtn = this.el.querySelector('.ns-btn-apply-link');

    const applyLink = () => {
      const url = linkInput.value.trim();
      if (url && this.currentRange) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(this.currentRange);
        document.execCommand('createLink', false, url);
      }
      this.hideLinkPopover();
      this.checkSelection();
    };

    applyBtn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      applyLink();
    });

    linkInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyLink();
      } else if (e.key === 'Escape') {
        this.hideLinkPopover();
      }
    });

    // Highlight color chips
    this.el.querySelectorAll('.ns-color-chip').forEach(chip => {
      chip.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const color = chip.dataset.color;
        if (this.currentRange) {
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(this.currentRange);
          if (color === 'transparent') {
            document.execCommand('removeFormat', false, null);
          } else {
            document.execCommand('hiliteColor', false, color);
          }
        }
        this.hideColorPopover();
        this.checkSelection();
      });
    });

    // Close on mousedown outside
    document.addEventListener('mousedown', (e) => {
      if (this.isOpen && !this.el.contains(e.target)) {
        this.hide();
      }
    });
  }

  checkSelection() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      if (this.isOpen && !this.isPopoverOpen()) {
        this.hide();
      }
      return;
    }

    // Check if selection is within an editor block
    let node = sel.anchorNode;
    let inEditor = false;
    while (node) {
      if (node.classList && (node.classList.contains('ns-block-editor') || node.classList.contains('ns-page-title'))) {
        inEditor = true;
        break;
      }
      node = node.parentNode;
    }

    if (!inEditor) {
      this.hide();
      return;
    }

    this.currentRange = sel.getRangeAt(0).cloneRange();
    const rect = getSelectionRect();
    if (rect) {
      this.show(rect);
    }
  }

  isPopoverOpen() {
    const linkPop = this.el.querySelector('.ns-link-popover');
    const colPop = this.el.querySelector('.ns-color-popover');
    return linkPop.style.display === 'flex' || colPop.style.display === 'flex';
  }

  show(rect) {
    this.isOpen = true;
    this.el.style.display = 'flex';

    // Position above selection
    let top = rect.top + window.scrollY - 46;
    let left = rect.left + window.scrollX + (rect.width / 2) - (this.el.offsetWidth / 2);

    if (top < 10) {
      top = rect.bottom + window.scrollY + 10;
    }
    if (left < 10) left = 10;
    if (left + this.el.offsetWidth > window.innerWidth - 10) {
      left = window.innerWidth - this.el.offsetWidth - 10;
    }

    this.el.style.top = `${top}px`;
    this.el.style.left = `${left}px`;

    this.updateActiveStates();
  }

  hide() {
    this.isOpen = false;
    this.el.style.display = 'none';
    this.hideLinkPopover();
    this.hideColorPopover();
  }

  hideLinkPopover() {
    const pop = this.el.querySelector('.ns-link-popover');
    pop.style.display = 'none';
  }

  hideColorPopover() {
    const pop = this.el.querySelector('.ns-color-popover');
    pop.style.display = 'none';
  }

  updateActiveStates() {
    const btns = this.el.querySelectorAll('.ns-tool-btn');
    btns.forEach(btn => {
      const cmd = btn.dataset.command;
      if (cmd && ['bold', 'italic', 'underline', 'strikeThrough'].includes(cmd)) {
        if (document.queryCommandState(cmd)) {
          btn.classList.add('is-active');
        } else {
          btn.classList.remove('is-active');
        }
      }
    });
  }

  executeCommand(command) {
    if (!this.currentRange) return;

    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(this.currentRange);

    if (command === 'code') {
      const selectedText = sel.toString();
      if (selectedText) {
        document.execCommand('insertHTML', false, `<code>${selectedText}</code>`);
      }
      this.checkSelection();
    } else if (command === 'link') {
      const linkPop = this.el.querySelector('.ns-link-popover');
      this.hideColorPopover();
      linkPop.style.display = linkPop.style.display === 'none' ? 'flex' : 'none';
      if (linkPop.style.display === 'flex') {
        const inp = linkPop.querySelector('.ns-link-input');
        inp.value = '';
        setTimeout(() => inp.focus(), 50);
      }
    } else if (command === 'highlight') {
      const colPop = this.el.querySelector('.ns-color-popover');
      this.hideLinkPopover();
      colPop.style.display = colPop.style.display === 'none' ? 'flex' : 'none';
    } else {
      document.execCommand(command, false, null);
      this.updateActiveStates();
    }
  }
}


  // ==========================================
  // FILE: js/editor/dragDrop.js
  // ==========================================
/**
 * NoteSpace - Block Drag and Drop Engine
 * Manages dragging blocks, calculating drop insertion index, and rendering animated drop indicators.
 */
class BlockDragDrop {
  constructor(editorContainer, onReorder) {
    this.container = editorContainer;
    this.onReorder = onReorder;
    this.draggedBlockEl = null;
    this.dropIndicator = null;
    this.dropTarget = null;
    this.dropPosition = 'after'; // 'before' | 'after'

    this.initDropIndicator();
    this.bindEvents();
  }

  initDropIndicator() {
    this.dropIndicator = createElement('div', 'ns-drop-indicator');
    this.dropIndicator.style.display = 'none';
    this.container.appendChild(this.dropIndicator);
  }

  bindEvents() {
    // We attach mousedown to handles and dragover/drop to container
    this.container.addEventListener('mousedown', (e) => {
      const handle = e.target.closest('.ns-drag-handle');
      if (!handle) return;

      const blockEl = handle.closest('.ns-block');
      if (!blockEl) return;

      this.startDrag(blockEl, e);
    });
  }

  startDrag(blockEl, startEvent) {
    this.draggedBlockEl = blockEl;
    blockEl.classList.add('is-dragging');

    const onMouseMove = (e) => {
      this.handleDragMove(e);
    };

    const onMouseUp = (e) => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      this.endDrag(e);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  handleDragMove(e) {
    if (!this.draggedBlockEl) return;

    // Find block element under mouse
    const blocks = Array.from(this.container.querySelectorAll('.ns-block:not(.is-dragging)'));
    let closestBlock = null;
    let closestDist = Infinity;
    let position = 'after';

    blocks.forEach(b => {
      const rect = b.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      const dist = Math.abs(e.clientY - midY);

      if (dist < closestDist) {
        closestDist = dist;
        closestBlock = b;
        position = e.clientY < midY ? 'before' : 'after';
      }
    });

    if (closestBlock) {
      this.dropTarget = closestBlock;
      this.dropPosition = position;

      const rect = closestBlock.getBoundingClientRect();
      const containerRect = this.container.getBoundingClientRect();

      this.dropIndicator.style.display = 'block';
      this.dropIndicator.style.left = '0px';
      this.dropIndicator.style.width = '100%';

      if (position === 'before') {
        this.dropIndicator.style.top = `${rect.top - containerRect.top}px`;
      } else {
        this.dropIndicator.style.top = `${rect.bottom - containerRect.top}px`;
      }
    }
  }

  endDrag(e) {
    if (!this.draggedBlockEl) return;

    this.dropIndicator.style.display = 'none';
    this.draggedBlockEl.classList.remove('is-dragging');

    if (this.dropTarget && this.dropTarget !== this.draggedBlockEl) {
      const fromId = this.draggedBlockEl.dataset.blockId;
      const toId = this.dropTarget.dataset.blockId;
      const position = this.dropPosition;

      this.onReorder(fromId, toId, position);
    }

    this.draggedBlockEl = null;
    this.dropTarget = null;
  }
}


  // ==========================================
  // FILE: js/database/tableView.js
  // ==========================================
/**
 * NoteSpace - Database Table View Renderer
 * Renders compact, interactive spreadsheet table with column headers, cell editors, and calculation footers.
 */
function renderTableView(database, rows, onUpdateRow, onDeleteRow, onAddProperty, onOpenDetail) {
  const tableWrap = createElement('div', 'ns-db-table-wrapper');
  const properties = database.properties || [];

  const table = createElement('table', 'ns-db-table');

  // --- Table Header ---
  const thead = createElement('thead');
  const headerTr = createElement('tr');

  properties.forEach(prop => {
    const th = createElement('th', 'ns-db-th');
    if (prop.width) th.style.width = `${prop.width}px`;

    let iconName = 'propText';
    if (prop.type === 'title') iconName = 'propTitle';
    if (prop.type === 'status') iconName = 'propStatus';
    if (prop.type === 'select') iconName = 'propSelect';
    if (prop.type === 'multi-select') iconName = 'propMultiSelect';
    if (prop.type === 'date') iconName = 'propDate';
    if (prop.type === 'number') iconName = 'propNumber';
    if (prop.type === 'checkbox') iconName = 'propCheckbox';

    th.innerHTML = `
      <div class="ns-th-content">
        <span class="ns-th-icon">${getIcon(iconName)}</span>
        <span class="ns-th-name">${escapeHTML(prop.name)}</span>
      </div>
    `;
    headerTr.appendChild(th);
  });

  // Add column button in header
  const addPropTh = createElement('th', 'ns-db-th-add');
  addPropTh.innerHTML = `<button class="ns-btn-add-prop-th" title="Add property">${Icons.plus}</button>`;
  addPropTh.querySelector('button').addEventListener('click', onAddProperty);
  headerTr.appendChild(addPropTh);

  thead.appendChild(headerTr);
  table.appendChild(thead);

  // --- Table Body ---
  const tbody = createElement('tbody');

  rows.forEach(row => {
    const tr = createElement('tr', 'ns-db-row');
    tr.dataset.rowId = row.id;

    properties.forEach(prop => {
      const td = createElement('td', `ns-db-td ns-td-${prop.type}`);
      const val = row.properties[prop.id];

      renderCellContent(td, prop, val, row, onUpdateRow, onOpenDetail);
      tr.appendChild(td);
    });

    // Row action cell
    const actionTd = createElement('td', 'ns-db-td-action');
    actionTd.innerHTML = `
      <div class="ns-row-actions">
        <button class="ns-btn-row-open" title="Open as page">${Icons.maximize}</button>
        <button class="ns-btn-row-delete" title="Delete row">${Icons.trash}</button>
      </div>
    `;

    actionTd.querySelector('.ns-btn-row-open').addEventListener('click', () => onOpenDetail(row));
    actionTd.querySelector('.ns-btn-row-delete').addEventListener('click', () => onDeleteRow(row.id));

    tr.appendChild(actionTd);
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);

  // --- Table Footer (Calculations) ---
  const tfoot = createElement('tfoot');
  const footTr = createElement('tr', 'ns-db-footer-tr');

  properties.forEach((prop, idx) => {
    const td = createElement('td', 'ns-db-foot-td');
    if (idx === 0) {
      td.innerHTML = `<span class="ns-calc-label">Count ${rows.length}</span>`;
    } else if (prop.type === 'number') {
      const sum = rows.reduce((acc, r) => acc + (Number(r.properties[prop.id]) || 0), 0);
      td.innerHTML = `<span class="ns-calc-label">Sum: ${sum}</span>`;
    } else if (prop.type === 'checkbox') {
      const checkedCount = rows.filter(r => Boolean(r.properties[prop.id])).length;
      const pct = rows.length > 0 ? Math.round((checkedCount / rows.length) * 100) : 0;
      td.innerHTML = `<span class="ns-calc-label">${checkedCount}/${rows.length} (${pct}%)</span>`;
    } else {
      td.innerHTML = '';
    }
    footTr.appendChild(td);
  });

  footTr.appendChild(createElement('td', 'ns-db-foot-td'));
  tfoot.appendChild(footTr);
  table.appendChild(tfoot);

  tableWrap.appendChild(table);
  return tableWrap;
}

function renderCellContent(td, prop, val, row, onUpdateRow, onOpenDetail) {
  switch (prop.type) {
    case 'title': {
      td.innerHTML = `
        <div class="ns-cell-title-wrap">
          <span class="ns-cell-title-text" contenteditable="true">${escapeHTML(val || '')}</span>
          <button class="ns-btn-cell-expand" title="Open Page">${Icons.maximize}</button>
        </div>
      `;
      const titleText = td.querySelector('.ns-cell-title-text');
      const expandBtn = td.querySelector('.ns-btn-cell-expand');

      titleText.addEventListener('blur', () => {
        const newVal = titleText.innerText.trim();
        onUpdateRow(row.id, { [prop.id]: newVal || 'Untitled' });
      });

      expandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        onOpenDetail(row);
      });
      break;
    }

    case 'status': {
      const currentOpt = (prop.options || []).find(o => o.label === val) || { label: val || 'Not Started', color: 'gray' };
      td.innerHTML = `
        <button class="ns-status-badge ns-badge-${currentOpt.color || 'gray'}">
          ${escapeHTML(currentOpt.label)}
        </button>
      `;

      td.querySelector('button').addEventListener('click', (e) => {
        e.stopPropagation();
        showSelectOptionsPopover(td, prop.options || [], (chosen) => {
          onUpdateRow(row.id, { [prop.id]: chosen.label });
        });
      });
      break;
    }

    case 'select': {
      const currentOpt = (prop.options || []).find(o => o.label === val);
      if (currentOpt) {
        td.innerHTML = `<span class="ns-tag-badge ns-badge-${currentOpt.color}">${escapeHTML(currentOpt.label)}</span>`;
      } else {
        td.innerHTML = `<span class="ns-cell-placeholder">Empty</span>`;
      }

      td.addEventListener('click', (e) => {
        e.stopPropagation();
        showSelectOptionsPopover(td, prop.options || [], (chosen) => {
          onUpdateRow(row.id, { [prop.id]: chosen.label });
        });
      });
      break;
    }

    case 'multi-select': {
      const selected = Array.isArray(val) ? val : [];
      if (selected.length > 0) {
        td.innerHTML = `
          <div class="ns-multi-tags">
            ${selected.map(item => {
              const opt = (prop.options || []).find(o => o.label === item) || { color: 'blue' };
              return `<span class="ns-tag-badge ns-badge-${opt.color}">${escapeHTML(item)}</span>`;
            }).join('')}
          </div>
        `;
      } else {
        td.innerHTML = `<span class="ns-cell-placeholder">Empty</span>`;
      }

      td.addEventListener('click', (e) => {
        e.stopPropagation();
        showMultiSelectPopover(td, prop.options || [], selected, (newSelected) => {
          onUpdateRow(row.id, { [prop.id]: newSelected });
        });
      });
      break;
    }

    case 'date': {
      td.innerHTML = val ? `<span class="ns-date-cell">${escapeHTML(val)}</span>` : `<span class="ns-cell-placeholder">Empty</span>`;
      td.addEventListener('click', (e) => {
        e.stopPropagation();
        showDateInputPopover(td, val, (newDate) => {
          onUpdateRow(row.id, { [prop.id]: newDate });
        });
      });
      break;
    }

    case 'number': {
      td.innerHTML = `<span class="ns-cell-editable" contenteditable="true">${val !== undefined && val !== null ? val : ''}</span>`;
      const numSpan = td.querySelector('.ns-cell-editable');
      numSpan.addEventListener('blur', () => {
        const num = parseFloat(numSpan.innerText.trim());
        onUpdateRow(row.id, { [prop.id]: isNaN(num) ? 0 : num });
      });
      break;
    }

    case 'checkbox': {
      const isChecked = Boolean(val);
      td.innerHTML = `<input type="checkbox" class="ns-db-checkbox" ${isChecked ? 'checked' : ''} />`;
      td.querySelector('input').addEventListener('change', (e) => {
        onUpdateRow(row.id, { [prop.id]: e.target.checked });
      });
      break;
    }

    case 'text':
    default: {
      td.innerHTML = `<span class="ns-cell-editable" contenteditable="true">${escapeHTML(val || '')}</span>`;
      const span = td.querySelector('.ns-cell-editable');
      span.addEventListener('blur', () => {
        onUpdateRow(row.id, { [prop.id]: span.innerText.trim() });
      });
      break;
    }
  }
}

function showSelectOptionsPopover(targetEl, options, onSelect) {
  document.querySelectorAll('.ns-cell-popover').forEach(p => p.remove());

  const popover = createElement('div', 'ns-cell-popover');
  popover.innerHTML = `
    <div class="ns-popover-title">Select Option</div>
    <div class="ns-popover-list">
      ${options.map(opt => `
        <button class="ns-popover-item" data-id="${opt.id}">
          <span class="ns-tag-badge ns-badge-${opt.color}">${escapeHTML(opt.label)}</span>
        </button>
      `).join('')}
    </div>
  `;

  document.body.appendChild(popover);
  const rect = targetEl.getBoundingClientRect();
  popover.style.top = `${rect.bottom + window.scrollY + 4}px`;
  popover.style.left = `${rect.left + window.scrollX}px`;

  popover.querySelectorAll('.ns-popover-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const opt = options.find(o => o.id === btn.dataset.id);
      if (opt) onSelect(opt);
      popover.remove();
    });
  });

  const closeHandler = (e) => {
    if (!popover.contains(e.target) && !targetEl.contains(e.target)) {
      popover.remove();
      document.removeEventListener('click', closeHandler);
    }
  };
  setTimeout(() => document.addEventListener('click', closeHandler), 10);
}

function showMultiSelectPopover(targetEl, options, currentSelected, onChange) {
  document.querySelectorAll('.ns-cell-popover').forEach(p => p.remove());

  const popover = createElement('div', 'ns-cell-popover');
  const selectedSet = new Set(currentSelected);

  popover.innerHTML = `
    <div class="ns-popover-title">Toggle Tags</div>
    <div class="ns-popover-list">
      ${options.map(opt => `
        <button class="ns-popover-multi-item ${selectedSet.has(opt.label) ? 'is-selected' : ''}" data-label="${escapeHTML(opt.label)}">
          <span class="ns-tag-badge ns-badge-${opt.color}">${escapeHTML(opt.label)}</span>
          <span class="ns-multi-check">${selectedSet.has(opt.label) ? '✓' : ''}</span>
        </button>
      `).join('')}
    </div>
  `;

  document.body.appendChild(popover);
  const rect = targetEl.getBoundingClientRect();
  popover.style.top = `${rect.bottom + window.scrollY + 4}px`;
  popover.style.left = `${rect.left + window.scrollX}px`;

  popover.querySelectorAll('.ns-popover-multi-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const label = btn.dataset.label;
      if (selectedSet.has(label)) {
        selectedSet.delete(label);
        btn.classList.remove('is-selected');
        btn.querySelector('.ns-multi-check').innerText = '';
      } else {
        selectedSet.add(label);
        btn.classList.add('is-selected');
        btn.querySelector('.ns-multi-check').innerText = '✓';
      }
      onChange(Array.from(selectedSet));
    });
  });

  const closeHandler = (e) => {
    if (!popover.contains(e.target) && !targetEl.contains(e.target)) {
      popover.remove();
      document.removeEventListener('click', closeHandler);
    }
  };
  setTimeout(() => document.addEventListener('click', closeHandler), 10);
}

function showDateInputPopover(targetEl, currentDate, onSelect) {
  document.querySelectorAll('.ns-cell-popover').forEach(p => p.remove());

  const popover = createElement('div', 'ns-cell-popover');
  popover.innerHTML = `
    <div class="ns-popover-title">Pick Date</div>
    <input type="date" class="ns-input ns-date-picker-inp" value="${currentDate || ''}" />
    <div class="ns-popover-actions">
      <button class="ns-btn-sm ns-btn-clear-date">Clear</button>
      <button class="ns-btn-sm ns-btn-primary ns-btn-save-date">Save</button>
    </div>
  `;

  document.body.appendChild(popover);
  const rect = targetEl.getBoundingClientRect();
  popover.style.top = `${rect.bottom + window.scrollY + 4}px`;
  popover.style.left = `${rect.left + window.scrollX}px`;

  const dateInp = popover.querySelector('.ns-date-picker-inp');
  popover.querySelector('.ns-btn-save-date').addEventListener('click', () => {
    onSelect(dateInp.value);
    popover.remove();
  });

  popover.querySelector('.ns-btn-clear-date').addEventListener('click', () => {
    onSelect('');
    popover.remove();
  });

  const closeHandler = (e) => {
    if (!popover.contains(e.target) && !targetEl.contains(e.target)) {
      popover.remove();
      document.removeEventListener('click', closeHandler);
    }
  };
  setTimeout(() => document.addEventListener('click', closeHandler), 10);
}


  // ==========================================
  // FILE: js/database/boardView.js
  // ==========================================
/**
 * NoteSpace - Database Board (Kanban) View Renderer
 * Renders agile Kanban board columns with drag-and-drop cards across statuses and quick card creation.
 */
function renderBoardView(database, rows, onUpdateRow, onAddRowToGroup, onOpenDetail) {
  const boardWrap = createElement('div', 'ns-db-board-wrapper');

  // Find grouping property (default to status or first select)
  let groupProp = database.properties.find(p => p.type === 'status');
  if (!groupProp) {
    groupProp = database.properties.find(p => p.type === 'select');
  }

  if (!groupProp) {
    boardWrap.innerHTML = `<div class="ns-board-empty">Please add a "Status" or "Select" property to use Board View.</div>`;
    return boardWrap;
  }

  const options = groupProp.options || [
    { id: 'opt-1', label: 'To Do', color: 'gray' },
    { id: 'opt-2', label: 'In Progress', color: 'blue' },
    { id: 'opt-3', label: 'Done', color: 'green' }
  ];

  const columnsContainer = createElement('div', 'ns-board-columns');

  options.forEach(opt => {
    const colRows = rows.filter(r => (r.properties[groupProp.id] || 'Not Started') === opt.label);

    const colEl = createElement('div', 'ns-board-column');
    colEl.dataset.groupValue = opt.label;

    // Header
    const header = createElement('div', 'ns-board-col-header');
    header.innerHTML = `
      <div class="ns-board-col-title">
        <span class="ns-status-badge ns-badge-${opt.color || 'gray'}">${escapeHTML(opt.label)}</span>
        <span class="ns-board-col-count">${colRows.length}</span>
      </div>
      <button class="ns-btn-add-card-col" title="Add item to ${escapeHTML(opt.label)}">
        ${Icons.plus}
      </button>
    `;

    header.querySelector('.ns-btn-add-card-col').addEventListener('click', () => {
      onAddRowToGroup({ [groupProp.id]: opt.label });
    });

    colEl.appendChild(header);

    // Cards list container
    const cardsList = createElement('div', 'ns-board-cards-list');
    cardsList.dataset.groupValue = opt.label;

    colRows.forEach(row => {
      const card = createBoardCard(row, database, onOpenDetail);
      cardsList.appendChild(card);
    });

    colEl.appendChild(cardsList);
    columnsContainer.appendChild(colEl);

    // Bind Drag and drop listeners for column
    setupColumnDropZone(cardsList, groupProp, onUpdateRow);
  });

  boardWrap.appendChild(columnsContainer);
  return boardWrap;
}

function createBoardCard(row, database, onOpenDetail) {
  const card = createElement('div', 'ns-board-card');
  card.setAttribute('draggable', 'true');
  card.dataset.rowId = row.id;

  const titleProp = database.properties.find(p => p.type === 'title');
  const title = (titleProp && row.properties[titleProp.id]) || 'Untitled';

  const tagsProp = database.properties.find(p => p.type === 'multi-select');
  const tags = (tagsProp && row.properties[tagsProp.id]) || [];

  const dateProp = database.properties.find(p => p.type === 'date');
  const dateVal = (dateProp && row.properties[dateProp.id]) || '';

  const priorityProp = database.properties.find(p => p.name.toLowerCase().includes('priority'));
  const priorityVal = (priorityProp && row.properties[priorityProp.id]) || '';

  card.innerHTML = `
    <div class="ns-card-header">
      <div class="ns-card-title">${escapeHTML(title)}</div>
    </div>
    ${tags.length > 0 ? `
      <div class="ns-card-tags">
        ${tags.map(t => `<span class="ns-tag-badge ns-badge-blue">${escapeHTML(t)}</span>`).join('')}
      </div>
    ` : ''}
    <div class="ns-card-meta">
      ${priorityVal ? `<span class="ns-card-priority">${escapeHTML(priorityVal)}</span>` : ''}
      ${dateVal ? `<span class="ns-card-date">${Icons.clock} ${escapeHTML(dateVal)}</span>` : ''}
    </div>
  `;

  card.addEventListener('click', (e) => {
    onOpenDetail(row);
  });

  card.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', row.id);
    card.classList.add('is-dragging-card');
  });

  card.addEventListener('dragend', () => {
    card.classList.remove('is-dragging-card');
  });

  return card;
}

function setupColumnDropZone(dropZone, groupProp, onUpdateRow) {
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('is-drag-over');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('is-drag-over');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('is-drag-over');
    const rowId = e.dataTransfer.getData('text/plain');
    const newGroupValue = dropZone.dataset.groupValue;

    if (rowId && newGroupValue) {
      onUpdateRow(rowId, { [groupProp.id]: newGroupValue });
    }
  });
}


  // ==========================================
  // FILE: js/database/listView.js
  // ==========================================
/**
 * NoteSpace - Database List View Renderer
 * Renders sleek, uncluttered horizontal rows with badge metadata.
 */
function renderListView(database, rows, onUpdateRow, onAddRow, onOpenDetail) {
  const listWrap = createElement('div', 'ns-db-list-wrapper');

  const itemsContainer = createElement('div', 'ns-list-items');

  const titleProp = database.properties.find(p => p.type === 'title');
  const statusProp = database.properties.find(p => p.type === 'status');
  const dateProp = database.properties.find(p => p.type === 'date');
  const tagsProp = database.properties.find(p => p.type === 'multi-select');

  rows.forEach(row => {
    const itemEl = createElement('div', 'ns-list-row-item');
    itemEl.dataset.rowId = row.id;

    const title = (titleProp && row.properties[titleProp.id]) || 'Untitled';
    const statusVal = (statusProp && row.properties[statusProp.id]) || '';
    const dateVal = (dateProp && row.properties[dateProp.id]) || '';
    const tags = (tagsProp && row.properties[tagsProp.id]) || [];

    const statusOpt = statusProp && (statusProp.options || []).find(o => o.label === statusVal);

    itemEl.innerHTML = `
      <div class="ns-list-left">
        <span class="ns-list-doc-icon">${Icons.fileText}</span>
        <span class="ns-list-title">${escapeHTML(title)}</span>
      </div>
      <div class="ns-list-right">
        ${tags.length > 0 ? `
          <div class="ns-list-tags">
            ${tags.map(t => `<span class="ns-tag-badge ns-badge-blue">${escapeHTML(t)}</span>`).join('')}
          </div>
        ` : ''}
        ${statusVal ? `
          <span class="ns-status-badge ns-badge-${statusOpt ? statusOpt.color : 'gray'}">${escapeHTML(statusVal)}</span>
        ` : ''}
        ${dateVal ? `
          <span class="ns-list-date">${escapeHTML(dateVal)}</span>
        ` : ''}
        <button class="ns-btn-list-open" title="Open">${Icons.maximize}</button>
      </div>
    `;

    itemEl.addEventListener('click', () => onOpenDetail(row));
    itemsContainer.appendChild(itemEl);
  });

  // Quick Add Row button
  const addRowBtn = createElement('button', 'ns-list-add-btn');
  addRowBtn.innerHTML = `${Icons.plus} New page`;
  addRowBtn.addEventListener('click', () => onAddRow());

  listWrap.appendChild(itemsContainer);
  listWrap.appendChild(addRowBtn);

  return listWrap;
}


  // ==========================================
  // FILE: js/database/propertyModal.js
  // ==========================================
/**
 * NoteSpace - Database Item Detail Modal & Property Editor Modals
 * Renders full-page item modal with property inspectors and inner block document editor.
 */
function openItemDetailModal(database, row, onUpdateRow) {
  document.querySelectorAll('.ns-item-modal-backdrop').forEach(m => m.remove());

  const backdrop = createElement('div', 'ns-modal-backdrop ns-item-modal-backdrop');
  const modal = createElement('div', 'ns-item-detail-modal');

  const titleProp = database.properties.find(p => p.type === 'title');
  const title = (titleProp && row.properties[titleProp.id]) || 'Untitled';

  modal.innerHTML = `
    <div class="ns-item-modal-header">
      <div class="ns-modal-breadcrumbs">
        <span>${escapeHTML(database.title || 'Database')}</span> / <strong>${escapeHTML(title)}</strong>
      </div>
      <div class="ns-modal-header-actions">
        <button class="ns-modal-close-btn" title="Close">${Icons.x}</button>
      </div>
    </div>
    
    <div class="ns-item-modal-body">
      <div class="ns-item-title-input" contenteditable="true" data-placeholder="Untitled">${escapeHTML(title)}</div>
      
      <div class="ns-item-properties-panel">
        <div class="ns-prop-panel-title">Properties</div>
        <div class="ns-props-table"></div>
      </div>

      <div class="ns-item-divider"></div>

      <div class="ns-item-notes-section">
        <div class="ns-notes-header">Notes & Content</div>
        <div class="ns-item-content-editor" contenteditable="true" data-placeholder="Type notes or block details for this task..."></div>
      </div>
    </div>
  `;

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  // Bind title edit
  const titleInp = modal.querySelector('.ns-item-title-input');
  titleInp.addEventListener('blur', () => {
    const val = titleInp.innerText.trim();
    if (titleProp) {
      onUpdateRow(row.id, { [titleProp.id]: val || 'Untitled' });
    }
  });

  // Render properties list in modal
  const propsContainer = modal.querySelector('.ns-props-table');
  database.properties.filter(p => p.type !== 'title').forEach(prop => {
    const rowEl = createElement('div', 'ns-prop-row');
    rowEl.innerHTML = `
      <div class="ns-prop-label">
        <span class="ns-prop-icon">${getIcon(prop.type === 'status' ? 'propStatus' : (prop.type === 'select' ? 'propSelect' : (prop.type === 'multi-select' ? 'propMultiSelect' : (prop.type === 'date' ? 'propDate' : (prop.type === 'number' ? 'propNumber' : (prop.type === 'checkbox' ? 'propCheckbox' : 'propText'))))))}</span>
        <span>${escapeHTML(prop.name)}</span>
      </div>
      <div class="ns-prop-value" data-prop-id="${prop.id}"></div>
    `;

    const valEl = rowEl.querySelector('.ns-prop-value');
    const val = row.properties[prop.id];

    if (prop.type === 'status') {
      const opt = (prop.options || []).find(o => o.label === val) || { label: val || 'Not Started', color: 'gray' };
      valEl.innerHTML = `<span class="ns-status-badge ns-badge-${opt.color}">${escapeHTML(opt.label)}</span>`;
      valEl.addEventListener('click', () => {
        // Cycle status or prompt
        const options = prop.options || [];
        const currIdx = options.findIndex(o => o.label === opt.label);
        const nextOpt = options[(currIdx + 1) % options.length];
        onUpdateRow(row.id, { [prop.id]: nextOpt.label });
        valEl.innerHTML = `<span class="ns-status-badge ns-badge-${nextOpt.color}">${escapeHTML(nextOpt.label)}</span>`;
      });
    } else if (prop.type === 'select') {
      valEl.innerHTML = val ? `<span class="ns-tag-badge ns-badge-blue">${escapeHTML(val)}</span>` : '<span class="ns-placeholder-text">Empty</span>';
    } else if (prop.type === 'multi-select') {
      const selected = Array.isArray(val) ? val : [];
      valEl.innerHTML = selected.length > 0 ? selected.map(s => `<span class="ns-tag-badge ns-badge-purple">${escapeHTML(s)}</span>`).join(' ') : '<span class="ns-placeholder-text">Empty</span>';
    } else if (prop.type === 'checkbox') {
      valEl.innerHTML = `<input type="checkbox" ${val ? 'checked' : ''} />`;
      valEl.querySelector('input').addEventListener('change', (e) => {
        onUpdateRow(row.id, { [prop.id]: e.target.checked });
      });
    } else if (prop.type === 'date') {
      valEl.innerHTML = `<input type="date" class="ns-input-sm" value="${val || ''}" />`;
      valEl.querySelector('input').addEventListener('change', (e) => {
        onUpdateRow(row.id, { [prop.id]: e.target.value });
      });
    } else {
      valEl.innerHTML = `<span contenteditable="true" class="ns-text-val">${escapeHTML(val !== undefined && val !== null ? String(val) : '')}</span>`;
      const txt = valEl.querySelector('.ns-text-val');
      txt.addEventListener('blur', () => {
        onUpdateRow(row.id, { [prop.id]: txt.innerText.trim() });
      });
    }

    propsContainer.appendChild(rowEl);
  });

  // Render Inner Content
  const contentEditor = modal.querySelector('.ns-item-content-editor');
  const innerHtml = (row.contentBlocks && row.contentBlocks[0] && row.contentBlocks[0].content) || '';
  contentEditor.innerHTML = innerHtml;
  contentEditor.addEventListener('blur', () => {
    const text = contentEditor.innerHTML;
    row.contentBlocks = [{ id: 'cb-' + Date.now(), type: 'paragraph', content: text }];
    onUpdateRow(row.id, {}, row.contentBlocks);
  });

  // Close handlers
  modal.querySelector('.ns-modal-close-btn').addEventListener('click', () => backdrop.remove());
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) backdrop.remove();
  });
}
function openAddPropertyModal(onAdd) {
  document.querySelectorAll('.ns-prop-modal-backdrop').forEach(m => m.remove());

  const backdrop = createElement('div', 'ns-modal-backdrop ns-prop-modal-backdrop');
  const modal = createElement('div', 'ns-add-prop-modal');

  modal.innerHTML = `
    <div class="ns-modal-header">
      <h3>Add New Property</h3>
      <button class="ns-modal-close-btn">${Icons.x}</button>
    </div>
    <div class="ns-modal-body">
      <div class="ns-form-group">
        <label class="ns-form-label">Property Name</label>
        <input type="text" class="ns-input ns-prop-name-inp" placeholder="e.g. Priority, Assignee, Estimate..." />
      </div>
      <div class="ns-form-group">
        <label class="ns-form-label">Property Type</label>
        <select class="ns-input ns-prop-type-select">
          <option value="text">Text</option>
          <option value="status">Status</option>
          <option value="select">Select (Single choice)</option>
          <option value="multi-select">Multi-Select (Tags)</option>
          <option value="date">Date</option>
          <option value="number">Number</option>
          <option value="checkbox">Checkbox</option>
        </select>
      </div>
    </div>
    <div class="ns-modal-footer">
      <button class="ns-btn ns-btn-secondary ns-btn-cancel-prop">Cancel</button>
      <button class="ns-btn ns-btn-primary ns-btn-confirm-prop">Create Property</button>
    </div>
  `;

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  const nameInp = modal.querySelector('.ns-prop-name-inp');
  const typeSelect = modal.querySelector('.ns-prop-type-select');

  setTimeout(() => nameInp.focus(), 50);

  const handleCreate = () => {
    const name = nameInp.value.trim();
    if (!name) return;
    const type = typeSelect.value;

    let options = [];
    if (type === 'status') {
      options = [
        { id: 's-1', label: 'Not Started', color: 'gray' },
        { id: 's-2', label: 'In Progress', color: 'blue' },
        { id: 's-3', label: 'Done', color: 'green' }
      ];
    } else if (type === 'select' || type === 'multi-select') {
      options = [
        { id: 'o-1', label: 'Option 1', color: 'blue' },
        { id: 'o-2', label: 'Option 2', color: 'green' },
        { id: 'o-3', label: 'Option 3', color: 'purple' }
      ];
    }

    onAdd({ name, type, options });
    backdrop.remove();
  };

  modal.querySelector('.ns-btn-confirm-prop').addEventListener('click', handleCreate);
  nameInp.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleCreate();
  });

  modal.querySelector('.ns-btn-cancel-prop').addEventListener('click', () => backdrop.remove());
  modal.querySelector('.ns-modal-close-btn').addEventListener('click', () => backdrop.remove());
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) backdrop.remove();
  });
}


  // ==========================================
  // FILE: js/database/database.js
  // ==========================================
/**
 * NoteSpace - Database Engine & View Controller
 * Coordinates Table, Board, and List views with real-time sorting, filtering, and row mutations.
 */
class DatabaseView {
  constructor(containerEl, databaseId) {
    this.container = containerEl;
    this.databaseId = databaseId;
    this.searchQuery = '';
    this.sortPropId = null;
    this.sortDirection = 'asc'; // 'asc' | 'desc'
    this.filterPropId = 'all';
    this.filterValue = '';

    this.init();
  }

  init() {
    this.render();
  }

  getDatabase() {
    return store.getDatabase(this.databaseId);
  }

  render() {
    const db = this.getDatabase();
    if (!db) {
      this.container.innerHTML = `<div class="ns-db-not-found">Database not found (${this.databaseId})</div>`;
      return;
    }

    this.container.innerHTML = '';
    const dbRoot = createElement('div', 'ns-database-view-root');

    // 1. Database Toolbar (Views switcher, search, sort, filter, add)
    const toolbar = createElement('div', 'ns-db-toolbar');

    // View Switcher Tabs
    const viewTabs = createElement('div', 'ns-db-view-tabs');
    const currentView = db.currentView || 'table';

    const tabs = [
      { type: 'table', label: 'Table', icon: 'viewTable' },
      { type: 'board', label: 'Board', icon: 'viewBoard' },
      { type: 'list', label: 'List', icon: 'viewList' }
    ];

    tabs.forEach(tab => {
      const btn = createElement('button', `ns-db-tab ${currentView === tab.type ? 'is-active' : ''}`);
      btn.innerHTML = `${getIcon(tab.icon)} <span>${tab.label}</span>`;
      btn.addEventListener('click', () => {
        store.updateDatabase(db.id, { currentView: tab.type });
        this.render();
      });
      viewTabs.appendChild(btn);
    });

    toolbar.appendChild(viewTabs);

    // Right Controls (Search, Sort, Filter, New Button)
    const rightControls = createElement('div', 'ns-db-right-controls');
    rightControls.innerHTML = `
      <div class="ns-db-search-wrap">
        ${Icons.search}
        <input type="text" class="ns-db-search-input" placeholder="Filter items..." value="${escapeHTML(this.searchQuery)}" />
      </div>
      <button class="ns-db-tool-btn ns-btn-sort" title="Sort">${Icons.sort} <span>Sort</span></button>
      <button class="ns-db-tool-btn ns-btn-new-prop" title="Add property">${Icons.plus} <span>Property</span></button>
      <button class="ns-btn ns-btn-primary ns-btn-add-db-row">${Icons.plus} <span>New</span></button>
    `;

    // Search input event
    const searchInp = rightControls.querySelector('.ns-db-search-input');
    searchInp.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.trim().toLowerCase();
      this.renderBodyOnly(dbRoot);
    });

    // Sort button event
    rightControls.querySelector('.ns-btn-sort').addEventListener('click', (e) => {
      this.showSortPopover(e.target, db);
    });

    // Add property button event
    rightControls.querySelector('.ns-btn-new-prop').addEventListener('click', () => {
      openAddPropertyModal((propDef) => {
        store.addDatabaseProperty(db.id, propDef).then(() => this.render());
      });
    });

    // Add Row button event
    rightControls.querySelector('.ns-btn-add-db-row').addEventListener('click', () => {
      store.addDatabaseRow(db.id, {}).then(() => this.render());
    });

    toolbar.appendChild(rightControls);
    dbRoot.appendChild(toolbar);

    // 2. View Content Area
    const viewContent = createElement('div', 'ns-db-view-content');
    dbRoot.appendChild(viewContent);

    this.container.appendChild(dbRoot);
    this.renderActiveView(viewContent, db);
  }

  renderBodyOnly(dbRoot) {
    const db = this.getDatabase();
    if (!db) return;
    const viewContent = dbRoot.querySelector('.ns-db-view-content');
    if (viewContent) {
      viewContent.innerHTML = '';
      this.renderActiveView(viewContent, db);
    }
  }

  getFilteredAndSortedRows(db) {
    let rows = [...(db.rows || [])];

    // Filter by search query
    if (this.searchQuery) {
      rows = rows.filter(r => {
        return Object.values(r.properties).some(val => {
          if (!val) return false;
          if (Array.isArray(val)) {
            return val.some(v => String(v).toLowerCase().includes(this.searchQuery));
          }
          return String(val).toLowerCase().includes(this.searchQuery);
        });
      });
    }

    // Sort rows
    if (this.sortPropId) {
      const propId = this.sortPropId;
      const dir = this.sortDirection === 'asc' ? 1 : -1;
      rows.sort((a, b) => {
        const valA = a.properties[propId];
        const valB = b.properties[propId];
        if (valA === valB) return 0;
        if (valA === undefined || valA === null || valA === '') return 1;
        if (valB === undefined || valB === null || valB === '') return -1;
        if (typeof valA === 'number' && typeof valB === 'number') {
          return (valA - valB) * dir;
        }
        return String(valA).localeCompare(String(valB)) * dir;
      });
    }

    return rows;
  }

  renderActiveView(viewContent, db) {
    const rows = this.getFilteredAndSortedRows(db);
    const viewType = db.currentView || 'table';

    const onUpdateRow = (rowId, props, contentBlocks) => {
      store.updateDatabaseRow(db.id, rowId, props, contentBlocks).then(() => this.render());
    };

    const onDeleteRow = (rowId) => {
      store.deleteDatabaseRow(db.id, rowId).then(() => this.render());
    };

    const onAddProperty = () => {
      openAddPropertyModal((propDef) => {
        store.addDatabaseProperty(db.id, propDef).then(() => this.render());
      });
    };

    const onOpenDetail = (row) => {
      openItemDetailModal(db, row, (rId, p, c) => onUpdateRow(rId, p, c));
    };

    if (viewType === 'table') {
      const tableDOM = renderTableView(db, rows, onUpdateRow, onDeleteRow, onAddProperty, onOpenDetail);
      viewContent.appendChild(tableDOM);
    } else if (viewType === 'board') {
      const boardDOM = renderBoardView(db, rows, onUpdateRow, (initialProps) => {
        store.addDatabaseRow(db.id, initialProps).then(() => this.render());
      }, onOpenDetail);
      viewContent.appendChild(boardDOM);
    } else if (viewType === 'list') {
      const listDOM = renderListView(db, rows, onUpdateRow, () => {
        store.addDatabaseRow(db.id, {}).then(() => this.render());
      }, onOpenDetail);
      viewContent.appendChild(listDOM);
    }
  }

  showSortPopover(targetBtn, db) {
    document.querySelectorAll('.ns-sort-popover').forEach(p => p.remove());

    const popover = createElement('div', 'ns-cell-popover ns-sort-popover');
    popover.innerHTML = `
      <div class="ns-popover-title">Sort By Property</div>
      <div class="ns-sort-selects">
        <select class="ns-input ns-sort-prop-select">
          <option value="">None</option>
          ${db.properties.map(p => `<option value="${p.id}" ${this.sortPropId === p.id ? 'selected' : ''}>${escapeHTML(p.name)}</option>`).join('')}
        </select>
        <select class="ns-input ns-sort-dir-select">
          <option value="asc" ${this.sortDirection === 'asc' ? 'selected' : ''}>Ascending</option>
          <option value="desc" ${this.sortDirection === 'desc' ? 'selected' : ''}>Descending</option>
        </select>
      </div>
      <div class="ns-popover-actions">
        <button class="ns-btn-sm ns-btn-clear-sort">Clear</button>
        <button class="ns-btn-sm ns-btn-primary ns-btn-apply-sort">Apply</button>
      </div>
    `;

    document.body.appendChild(popover);
    const rect = targetBtn.getBoundingClientRect();
    popover.style.top = `${rect.bottom + window.scrollY + 4}px`;
    popover.style.left = `${rect.left + window.scrollX}px`;

    const propSelect = popover.querySelector('.ns-sort-prop-select');
    const dirSelect = popover.querySelector('.ns-sort-dir-select');

    popover.querySelector('.ns-btn-apply-sort').addEventListener('click', () => {
      this.sortPropId = propSelect.value || null;
      this.sortDirection = dirSelect.value;
      popover.remove();
      this.render();
    });

    popover.querySelector('.ns-btn-clear-sort').addEventListener('click', () => {
      this.sortPropId = null;
      popover.remove();
      this.render();
    });

    const closeHandler = (e) => {
      if (!popover.contains(e.target) && !targetBtn.contains(e.target)) {
        popover.remove();
        document.removeEventListener('click', closeHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 10);
  }
}


  // ==========================================
  // FILE: js/editor/editor.js
  // ==========================================
/**
 * NoteSpace - Core Document Block Editor
 * Orchestrates block rendering, typography, caret flows, keyboard shortcuts, covers, icons, and menus.
 */
class Editor {
  constructor(containerEl, onDatabaseMount) {
    this.container = containerEl;
    this.onDatabaseMount = onDatabaseMount;
    this.currentPage = null;
    this.blocksContainer = null;
    this.slashMenu = null;
    this.inlineToolbar = null;
    this.dragDrop = null;
    this.activeBlockId = null;

    this.init();
  }

  init() {
    this.inlineToolbar = new InlineToolbar();
    this.slashMenu = new SlashMenu((selectedDef, targetBlockEl) => {
      this.handleSlashSelect(selectedDef, targetBlockEl);
    });

    // Listen to store updates
    store.on('active-page-changed', (page) => this.loadPage(page));
    store.on('page-restored-revision', (page) => {
      if (this.currentPage && this.currentPage.id === page.id) {
        this.loadPage(page);
      }
    });
  }

  loadPage(page) {
    this.currentPage = page;
    if (!page) {
      this.renderEmptyState();
      return;
    }
    this.render();
  }

  renderEmptyState() {
    this.container.innerHTML = `
      <div class="ns-editor-empty-state">
        <div class="ns-empty-icon">${Icons.logo}</div>
        <h2>No Page Selected</h2>
        <p>Select a page from the sidebar or create a new one to start writing.</p>
        <button class="ns-btn ns-btn-primary" id="btn-create-first-page">
          ${Icons.plus} Create New Page
        </button>
      </div>
    `;
    const btn = this.container.querySelector('#btn-create-first-page');
    if (btn) {
      btn.addEventListener('click', () => store.createPage({ title: 'Untitled' }));
    }
  }

  render() {
    this.container.innerHTML = '';
    const page = this.currentPage;
    if (!page) return;

    const pageWrapper = createElement('div', 'ns-editor-page-wrapper');

    // 1. Cover Image Section
    const coverSection = createElement('div', `ns-page-cover-container ${page.cover ? 'has-cover' : ''}`);
    if (page.cover) {
      if (page.cover.startsWith('linear-gradient') || page.cover.startsWith('#')) {
        coverSection.style.background = page.cover;
      } else {
        coverSection.style.backgroundImage = `url(${page.cover})`;
      }
      coverSection.innerHTML = `
        <div class="ns-cover-actions">
          <button class="ns-cover-btn ns-btn-change-cover">${Icons.image} Change Cover</button>
          <button class="ns-cover-btn ns-btn-remove-cover">${Icons.x} Remove</button>
        </div>
      `;
    }
    pageWrapper.appendChild(coverSection);

    // 2. Main Content Canvas
    const canvas = createElement('div', 'ns-editor-canvas');

    // Hover controls to add cover/icon if missing
    const pageMetaControls = createElement('div', 'ns-page-meta-controls');
    pageMetaControls.innerHTML = `
      ${!page.icon ? `<button class="ns-meta-btn ns-btn-add-icon">${Icons.sparkles} Add icon</button>` : ''}
      ${!page.cover ? `<button class="ns-meta-btn ns-btn-add-cover">${Icons.image} Add cover</button>` : ''}
    `;
    canvas.appendChild(pageMetaControls);

    // 3. Page Icon
    if (page.icon) {
      const iconWrap = createElement('div', 'ns-page-icon-wrapper');
      iconWrap.innerHTML = `
        <button class="ns-page-icon-display" title="Change Icon">${page.icon}</button>
      `;
      canvas.appendChild(iconWrap);
    }

    // 4. Page Title
    const titleInput = createElement('div', 'ns-page-title');
    titleInput.contentEditable = 'true';
    titleInput.setAttribute('data-placeholder', 'Untitled');
    titleInput.innerHTML = page.title ? escapeHTML(page.title) : '';
    canvas.appendChild(titleInput);

    // 5. Page Document Stats & Breadcrumb Subtext
    const statsBar = createElement('div', 'ns-page-stats-bar');
    const wordCount = this.calculateWordCount(page);
    const readTime = Math.ceil(wordCount / 200);
    statsBar.innerHTML = `
      <div class="ns-stat-item">${wordCount} words</div>
      <div class="ns-stat-dot">•</div>
      <div class="ns-stat-item">${readTime} min read</div>
      <div class="ns-stat-dot">•</div>
      <div class="ns-stat-item">Updated ${formatDate(page.updatedAt)}</div>
    `;
    canvas.appendChild(statsBar);

    // 6. Blocks Container
    this.blocksContainer = createElement('div', 'ns-blocks-container');
    canvas.appendChild(this.blocksContainer);

    pageWrapper.appendChild(canvas);
    this.container.appendChild(pageWrapper);

    // Render each block
    if (page.blocks && page.blocks.length > 0) {
      page.blocks.forEach(block => {
        const blockEl = this.createBlockDOM(block);
        this.blocksContainer.appendChild(blockEl);

        // Mount database if inline
        if (block.type === 'database' && this.onDatabaseMount) {
          const dbWrap = blockEl.querySelector('.ns-database-block-wrapper');
          if (dbWrap) {
            const dbId = (block.metadata && block.metadata.databaseId) || page.databaseId;
            this.onDatabaseMount(dbWrap, dbId);
          }
        }
      });
    } else {
      // Create first empty paragraph if none
      const firstBlock = { id: 'b-' + Date.now(), type: 'paragraph', content: '' };
      page.blocks = [firstBlock];
      store.updatePage(page.id, { blocks: page.blocks });
      const blockEl = this.createBlockDOM(firstBlock);
      this.blocksContainer.appendChild(blockEl);
    }

    // Bind Page Level Events
    this.bindPageEvents(titleInput, pageWrapper);

    // Init Drag and Drop
    this.dragDrop = new BlockDragDrop(this.blocksContainer, (fromId, toId, position) => {
      this.handleBlockReorder(fromId, toId, position);
    });
  }

  calculateWordCount(page) {
    let text = (page.title || '') + ' ';
    (page.blocks || []).forEach(b => {
      text += (b.content || '').replace(/<[^>]*>/g, ' ') + ' ';
    });
    return text.trim().split(/\s+/).filter(Boolean).length;
  }

  createBlockDOM(block) {
    const blockEl = renderBlockElement(
      block,
      (updatedBlock) => this.handleBlockUpdate(updatedBlock),
      (blockId) => this.handleBlockDelete(blockId),
      (blockId, newType) => this.handleBlockConvert(blockId, newType)
    );

    this.bindBlockEvents(blockEl, block);
    return blockEl;
  }

  bindPageEvents(titleInput, pageWrapper) {
    const page = this.currentPage;

    // Title input listener
    titleInput.addEventListener('input', () => {
      const newTitle = titleInput.innerText.trim();
      store.updatePage(page.id, { title: newTitle || 'Untitled' });
    });

    titleInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        // Focus first block
        const firstBlock = this.blocksContainer.querySelector('.ns-block-editor');
        if (firstBlock) {
          setCaretPosition(firstBlock, true);
        }
      }
    });

    // Add / Change Cover
    const addCoverBtn = pageWrapper.querySelector('.ns-btn-add-cover');
    const changeCoverBtn = pageWrapper.querySelector('.ns-btn-change-cover');
    const removeCoverBtn = pageWrapper.querySelector('.ns-btn-remove-cover');

    if (addCoverBtn) {
      addCoverBtn.addEventListener('click', (e) => this.showCoverPicker(e.target));
    }
    if (changeCoverBtn) {
      changeCoverBtn.addEventListener('click', (e) => this.showCoverPicker(e.target));
    }
    if (removeCoverBtn) {
      removeCoverBtn.addEventListener('click', () => {
        store.updatePage(page.id, { cover: null });
        this.render();
      });
    }

    // Add / Change Icon
    const addIconBtn = pageWrapper.querySelector('.ns-btn-add-icon');
    const iconDisplay = pageWrapper.querySelector('.ns-page-icon-display');

    if (addIconBtn) {
      addIconBtn.addEventListener('click', (e) => this.showEmojiPicker(e.target));
    }
    if (iconDisplay) {
      iconDisplay.addEventListener('click', (e) => this.showEmojiPicker(e.target));
    }
  }

  bindBlockEvents(blockEl, block) {
    const editor = blockEl.querySelector('.ns-block-editor');
    const addBtn = blockEl.querySelector('.ns-add-block-btn');
    const dragHandle = blockEl.querySelector('.ns-drag-handle');

    // Add block button below
    if (addBtn) {
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.insertBlockAfter(block.id, 'paragraph');
      });
    }

    // Handle click to open context menu
    if (dragHandle) {
      dragHandle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showBlockContextMenu(dragHandle, block);
      });
    }

    if (!editor) return;

    // Input listener (content changes)
    editor.addEventListener('input', (e) => {
      this.handleBlockInput(blockEl, block, editor);
    });

    // Keydown shortcuts
    editor.addEventListener('keydown', (e) => {
      this.handleBlockKeyDown(e, blockEl, block, editor);
    });

    // Focus listener
    editor.addEventListener('focus', () => {
      this.activeBlockId = block.id;
    });
  }

  handleBlockInput(blockEl, block, editor) {
    const text = editor.innerText;

    // Check for markdown shortcuts at start of block
    if (this.checkMarkdownShortcut(blockEl, block, text)) {
      return;
    }

    // Check for slash menu trigger
    if (text.includes('/')) {
      const slashIndex = text.lastIndexOf('/');
      const query = text.substring(slashIndex + 1);
      const rect = editor.getBoundingClientRect();

      if (!this.slashMenu.isOpen) {
        this.slashMenu.open(blockEl, rect);
      }
      this.slashMenu.setQuery(query);
    } else {
      if (this.slashMenu.isOpen) {
        this.slashMenu.close();
      }
    }

    // Update block content in state
    block.content = editor.innerHTML;
    this.saveBlocksToState();
  }

  checkMarkdownShortcut(blockEl, block, text) {
    const shortcuts = [
      { prefix: '# ', type: 'heading1' },
      { prefix: '## ', type: 'heading2' },
      { prefix: '### ', type: 'heading3' },
      { prefix: '- ', type: 'bulletList' },
      { prefix: '* ', type: 'bulletList' },
      { prefix: '1. ', type: 'numberedList' },
      { prefix: '[] ', type: 'checklist' },
      { prefix: '[ ] ', type: 'checklist' },
      { prefix: '> ', type: 'quote' },
      { prefix: '---', type: 'divider' },
      { prefix: '```', type: 'code' }
    ];

    for (const sc of shortcuts) {
      if (text.startsWith(sc.prefix)) {
        const remaining = text.substring(sc.prefix.length);
        block.type = sc.type;
        block.content = remaining;
        if (sc.type === 'checklist') {
          block.metadata = { checked: false };
        } else if (sc.type === 'code') {
          block.metadata = { language: 'javascript' };
        }

        // Replace DOM node
        const newBlockEl = this.createBlockDOM(block);
        blockEl.replaceWith(newBlockEl);
        const newEditor = newBlockEl.querySelector('.ns-block-editor');
        if (newEditor) {
          setCaretPosition(newEditor, true);
        }

        this.saveBlocksToState();
        return true;
      }
    }
    return false;
  }

  handleBlockKeyDown(e, blockEl, block, editor) {
    // Let Slash Menu capture navigation if open
    if (this.slashMenu.isOpen) {
      if (this.slashMenu.handleKeyDown(e)) {
        return;
      }
    }

    // 1. Enter Key -> Create new block
    if (e.key === 'Enter' && !e.shiftKey) {
      if (block.type === 'code' || block.type === 'table') {
        // Allow normal newline in code block
        return;
      }

      e.preventDefault();

      // If in a list/checklist and it's empty, convert to regular paragraph
      const text = editor.innerText.trim();
      if ((block.type === 'bulletList' || block.type === 'numberedList' || block.type === 'checklist') && text === '') {
        this.handleBlockConvert(block.id, 'paragraph');
        return;
      }

      // Inherit list type or default to paragraph
      let nextType = 'paragraph';
      if (block.type === 'bulletList') nextType = 'bulletList';
      if (block.type === 'numberedList') nextType = 'numberedList';
      if (block.type === 'checklist') nextType = 'checklist';

      this.insertBlockAfter(block.id, nextType);
    }

    // 2. Backspace Key
    if (e.key === 'Backspace') {
      const text = editor.innerText.trim();
      // If block is non-paragraph and empty, convert to paragraph
      if (block.type !== 'paragraph' && text === '') {
        e.preventDefault();
        this.handleBlockConvert(block.id, 'paragraph');
        return;
      }

      // If block is paragraph and completely empty, delete and focus previous
      if (block.type === 'paragraph' && text === '') {
        const blocks = this.currentPage.blocks;
        if (blocks.length > 1) {
          e.preventDefault();
          const prevBlock = blockEl.previousElementSibling;
          this.handleBlockDelete(block.id);
          if (prevBlock) {
            const prevEditor = prevBlock.querySelector('.ns-block-editor');
            if (prevEditor) setCaretPosition(prevEditor, true);
          }
        }
      }
    }

    // 3. Arrow Up / Down navigation between blocks
    if (e.key === 'ArrowUp') {
      const prevBlock = blockEl.previousElementSibling;
      if (prevBlock) {
        const prevEditor = prevBlock.querySelector('.ns-block-editor');
        if (prevEditor) {
          // Check if cursor is at first line
          const sel = window.getSelection();
          if (sel && sel.anchorOffset === 0) {
            e.preventDefault();
            setCaretPosition(prevEditor, true);
          }
        }
      }
    }

    if (e.key === 'ArrowDown') {
      const nextBlock = blockEl.nextElementSibling;
      if (nextBlock) {
        const nextEditor = nextBlock.querySelector('.ns-block-editor');
        if (nextEditor) {
          const sel = window.getSelection();
          if (sel && sel.anchorOffset >= (editor.innerText.length - 1)) {
            e.preventDefault();
            setCaretPosition(nextEditor, false);
          }
        }
      }
    }
  }

  handleSlashSelect(selectedDef, targetBlockEl) {
    if (!targetBlockEl) return;
    const blockId = targetBlockEl.dataset.blockId;
    const block = this.currentPage.blocks.find(b => b.id === blockId);
    if (!block) return;

    // Clean out the slash command text
    let cleanContent = (block.content || '').replace(/\/[a-zA-Z0-9_-]*$/, '').trim();

    if (selectedDef.type === 'database') {
      // Create inline database
      store.createDatabase({ title: 'Inline Database', pageId: this.currentPage.id }).then(newDb => {
        block.type = 'database';
        block.content = '';
        block.metadata = { databaseId: newDb.id };

        const newBlockEl = this.createBlockDOM(block);
        targetBlockEl.replaceWith(newBlockEl);

        const dbWrap = newBlockEl.querySelector('.ns-database-block-wrapper');
        if (dbWrap && this.onDatabaseMount) {
          this.onDatabaseMount(dbWrap, newDb.id);
        }
        this.saveBlocksToState();
      });
      return;
    }

    block.type = selectedDef.type;
    block.content = cleanContent;
    block.metadata = JSON.parse(JSON.stringify(selectedDef.defaultMetadata || {}));

    const newBlockEl = this.createBlockDOM(block);
    targetBlockEl.replaceWith(newBlockEl);

    const newEditor = newBlockEl.querySelector('.ns-block-editor');
    if (newEditor) {
      setCaretPosition(newEditor, true);
    }

    this.saveBlocksToState();
  }

  insertBlockAfter(targetBlockId, blockType = 'paragraph') {
    const blocks = this.currentPage.blocks;
    const index = blocks.findIndex(b => b.id === targetBlockId);
    if (index === -1) return;

    const newBlock = {
      id: 'b-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      type: blockType,
      content: '',
      metadata: {}
    };

    blocks.splice(index + 1, 0, newBlock);
    this.saveBlocksToState();

    const targetEl = this.blocksContainer.querySelector(`[data-block-id="${targetBlockId}"]`);
    const newBlockEl = this.createBlockDOM(newBlock);

    if (targetEl && targetEl.nextSibling) {
      this.blocksContainer.insertBefore(newBlockEl, targetEl.nextSibling);
    } else {
      this.blocksContainer.appendChild(newBlockEl);
    }

    const newEditor = newBlockEl.querySelector('.ns-block-editor');
    if (newEditor) {
      setCaretPosition(newEditor, true);
    }
  }

  handleBlockUpdate(updatedBlock) {
    const blocks = this.currentPage.blocks;
    const index = blocks.findIndex(b => b.id === updatedBlock.id);
    if (index !== -1) {
      blocks[index] = updatedBlock;
      this.saveBlocksToState();
    }
  }

  handleBlockDelete(blockId) {
    const blocks = this.currentPage.blocks;
    if (blocks.length <= 1) {
      // Keep at least one empty block
      blocks[0] = { id: 'b-' + Date.now(), type: 'paragraph', content: '', metadata: {} };
      this.render();
      this.saveBlocksToState();
      return;
    }

    this.currentPage.blocks = blocks.filter(b => b.id !== blockId);
    const blockEl = this.blocksContainer.querySelector(`[data-block-id="${blockId}"]`);
    if (blockEl) blockEl.remove();
    this.saveBlocksToState();
  }

  handleBlockConvert(blockId, newType) {
    const block = this.currentPage.blocks.find(b => b.id === blockId);
    if (!block) return;

    const def = getBlockDefinition(newType);
    block.type = newType;
    block.metadata = JSON.parse(JSON.stringify(def.defaultMetadata || {}));

    const blockEl = this.blocksContainer.querySelector(`[data-block-id="${blockId}"]`);
    if (blockEl) {
      const newBlockEl = this.createBlockDOM(block);
      blockEl.replaceWith(newBlockEl);
      const newEditor = newBlockEl.querySelector('.ns-block-editor');
      if (newEditor) setCaretPosition(newEditor, true);
    }

    this.saveBlocksToState();
  }

  handleBlockReorder(fromId, toId, position) {
    const blocks = this.currentPage.blocks;
    const fromIndex = blocks.findIndex(b => b.id === fromId);
    const toIndex = blocks.findIndex(b => b.id === toId);

    if (fromIndex === -1 || toIndex === -1) return;

    const [movedBlock] = blocks.splice(fromIndex, 1);
    let targetIndex = blocks.findIndex(b => b.id === toId);
    if (position === 'after') targetIndex += 1;

    blocks.splice(targetIndex, 0, movedBlock);
    this.saveBlocksToState();
    this.render();
  }

  saveBlocksToState() {
    if (!this.currentPage) return;
    store.updatePage(this.currentPage.id, { blocks: this.currentPage.blocks });
  }

  // --- Context Menu for Block Handles ---

  showBlockContextMenu(targetHandle, block) {
    document.querySelectorAll('.ns-context-menu').forEach(m => m.remove());

    const menu = createElement('div', 'ns-context-menu');
    menu.innerHTML = `
      <div class="ns-menu-item" data-action="delete">
        ${Icons.trash} <span>Delete Block</span>
      </div>
      <div class="ns-menu-item" data-action="duplicate">
        ${Icons.copy} <span>Duplicate Block</span>
      </div>
      <div class="ns-menu-divider"></div>
      <div class="ns-menu-label">Turn into</div>
      <div class="ns-turn-into-grid">
        <button class="ns-turn-btn" data-type="paragraph">${getIcon('paragraph')} Text</button>
        <button class="ns-turn-btn" data-type="heading1">${getIcon('heading1')} H1</button>
        <button class="ns-turn-btn" data-type="heading2">${getIcon('heading2')} H2</button>
        <button class="ns-turn-btn" data-type="heading3">${getIcon('heading3')} H3</button>
        <button class="ns-turn-btn" data-type="bulletList">${getIcon('bulletList')} Bullet</button>
        <button class="ns-turn-btn" data-type="numberedList">${getIcon('numberedList')} Number</button>
        <button class="ns-turn-btn" data-type="checklist">${getIcon('checklist')} To-do</button>
        <button class="ns-turn-btn" data-type="quote">${getIcon('quote')} Quote</button>
        <button class="ns-turn-btn" data-type="callout">${getIcon('callout')} Callout</button>
        <button class="ns-turn-btn" data-type="code">${getIcon('code')} Code</button>
      </div>
    `;

    document.body.appendChild(menu);

    const rect = targetHandle.getBoundingClientRect();
    let top = rect.bottom + window.scrollY + 4;
    let left = rect.left + window.scrollX;

    if (top + 280 > window.innerHeight + window.scrollY) {
      top = rect.top + window.scrollY - 280;
    }

    menu.style.top = `${Math.max(10, top)}px`;
    menu.style.left = `${Math.max(10, left)}px`;

    menu.querySelector('[data-action="delete"]').addEventListener('click', () => {
      this.handleBlockDelete(block.id);
      menu.remove();
    });

    menu.querySelector('[data-action="duplicate"]').addEventListener('click', () => {
      const clone = JSON.parse(JSON.stringify(block));
      clone.id = 'b-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
      const blocks = this.currentPage.blocks;
      const idx = blocks.findIndex(b => b.id === block.id);
      blocks.splice(idx + 1, 0, clone);
      this.saveBlocksToState();
      this.render();
      menu.remove();
    });

    menu.querySelectorAll('.ns-turn-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        this.handleBlockConvert(block.id, type);
        menu.remove();
      });
    });

    const closeHandler = (e) => {
      if (!menu.contains(e.target) && e.target !== targetHandle) {
        menu.remove();
        document.removeEventListener('click', closeHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 10);
  }

  // --- Cover & Emoji Pickers ---

  showCoverPicker(targetBtn) {
    document.querySelectorAll('.ns-picker-popover').forEach(p => p.remove());

    const popover = createElement('div', 'ns-picker-popover ns-cover-picker-popover');
    const gradients = [
      { name: 'Aurora', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      { name: 'Ocean', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
      { name: 'Emerald', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
      { name: 'Sunset', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
      { name: 'Neon Pink', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
      { name: 'Midnight', value: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' },
      { name: 'Slate Solid', value: '#1e293b' },
      { name: 'Zinc Solid', value: '#27272a' }
    ];

    popover.innerHTML = `
      <div class="ns-picker-title">Select Cover Preset</div>
      <div class="ns-cover-grid">
        ${gradients.map(g => `<button class="ns-cover-opt" data-value="${g.value}" style="background: ${g.value};" title="${g.name}"></button>`).join('')}
      </div>
      <div class="ns-picker-divider"></div>
      <div class="ns-cover-custom-input">
        <input type="text" class="ns-input ns-cover-url-inp" placeholder="Paste custom image URL..." />
        <button class="ns-btn ns-btn-primary ns-btn-apply-cover">Apply</button>
      </div>
    `;

    document.body.appendChild(popover);
    const rect = targetBtn.getBoundingClientRect();
    popover.style.top = `${rect.bottom + window.scrollY + 6}px`;
    popover.style.left = `${Math.max(20, rect.left + window.scrollX - 100)}px`;

    popover.querySelectorAll('.ns-cover-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        store.updatePage(this.currentPage.id, { cover: btn.dataset.value });
        popover.remove();
        this.render();
      });
    });

    const urlInp = popover.querySelector('.ns-cover-url-inp');
    const applyBtn = popover.querySelector('.ns-btn-apply-cover');
    applyBtn.addEventListener('click', () => {
      const url = urlInp.value.trim();
      if (url) {
        store.updatePage(this.currentPage.id, { cover: url });
        popover.remove();
        this.render();
      }
    });

    const closeHandler = (e) => {
      if (!popover.contains(e.target) && e.target !== targetBtn) {
        popover.remove();
        document.removeEventListener('click', closeHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 10);
  }

  showEmojiPicker(targetBtn) {
    document.querySelectorAll('.ns-picker-popover').forEach(p => p.remove());

    const popover = createElement('div', 'ns-picker-popover ns-emoji-picker-popover');
    const emojis = [
      '📄', '✨', '🚀', '💡', '🎯', '📚', '🔥', '💻', '⚡', '🌟',
      '📌', '📖', '🛡️', '⚙️', '📊', '🎨', '💼', '☕', '🧠', '🔬',
      '📝', '🛠️', '🌿', '💬', '🔔', '🏷️', '🔮', '🎉', '🍎', '🏖️'
    ];

    popover.innerHTML = `
      <div class="ns-picker-header">
        <div class="ns-picker-title">Select Page Icon</div>
        <button class="ns-btn-sm ns-btn-remove-icon">Remove</button>
      </div>
      <div class="ns-emoji-grid">
        ${emojis.map(e => `<button class="ns-emoji-opt">${e}</button>`).join('')}
      </div>
    `;

    document.body.appendChild(popover);
    const rect = targetBtn.getBoundingClientRect();
    popover.style.top = `${rect.bottom + window.scrollY + 6}px`;
    popover.style.left = `${Math.max(20, rect.left + window.scrollX)}px`;

    popover.querySelectorAll('.ns-emoji-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        store.updatePage(this.currentPage.id, { icon: btn.innerText.trim() });
        popover.remove();
        this.render();
      });
    });

    popover.querySelector('.ns-btn-remove-icon').addEventListener('click', () => {
      store.updatePage(this.currentPage.id, { icon: null });
      popover.remove();
      this.render();
    });

    const closeHandler = (e) => {
      if (!popover.contains(e.target) && e.target !== targetBtn) {
        popover.remove();
        document.removeEventListener('click', closeHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 10);
  }
}


  // ==========================================
  // FILE: js/sidebar/sidebar.js
  // ==========================================
/**
 * NoteSpace - Workspace Sidebar Controller
 * Manages realistic nested tree navigation, favorites, recent pages, drag-to-nest, and page action menus.
 */
class Sidebar {
  constructor(sidebarEl, onOpenCommandPalette, onOpenSettings, onOpenTrash, onOpenHistory, onOpenShortcuts) {
    this.sidebarEl = sidebarEl;
    this.onOpenCommandPalette = onOpenCommandPalette;
    this.onOpenSettings = onOpenSettings;
    this.onOpenTrash = onOpenTrash;
    this.onOpenHistory = onOpenHistory;
    this.onOpenShortcuts = onOpenShortcuts;
    this.expandedNodes = new Set();
    this.draggedPageId = null;

    this.init();
  }

  init() {
    this.autoExpandActivePageParents();

    store.on('page-list-updated', () => this.render());
    store.on('active-page-changed', () => {
      this.autoExpandActivePageParents();
      this.render();
      // On mobile view, collapse sidebar when page is selected
      if (window.innerWidth <= 768) {
        document.body.classList.add('sidebar-collapsed');
      }
    });
    store.on('recents-updated', () => this.render());
    store.on('settings-updated', () => this.render());

    this.render();
  }

  autoExpandActivePageParents() {
    const activePage = store.getActivePage();
    if (!activePage) return;
    let cur = activePage;
    while (cur && cur.parentId) {
      this.expandedNodes.add(cur.parentId);
      cur = store.getPage(cur.parentId);
    }
  }

  render() {
    this.sidebarEl.innerHTML = '';

    const wsName = store.getSetting('workspaceName', 'My Workspace');
    const wsIcon = store.getSetting('workspaceIcon', '🪐');
    const activePage = store.getActivePage();
    const activePageId = activePage ? activePage.id : null;

    // 1. Workspace Header
    const header = createElement('div', 'ns-sidebar-header');
    header.innerHTML = `
      <div class="ns-ws-info" title="Workspace Settings" role="button" tabindex="0">
        <span class="ns-ws-icon">${wsIcon}</span>
        <span class="ns-ws-name">${escapeHTML(wsName)}</span>
      </div>
      <div class="ns-sidebar-header-actions">
        <button class="ns-icon-btn ns-btn-new-root-page" title="New Page (Root)" aria-label="New Page">
          ${Icons.plus}
        </button>
        <button class="ns-icon-btn ns-btn-toggle-sidebar" title="Collapse Sidebar" aria-label="Collapse Sidebar">
          ${Icons.sidebar}
        </button>
      </div>
    `;

    header.querySelector('.ns-ws-info').addEventListener('click', this.onOpenSettings);
    header.querySelector('.ns-btn-new-root-page').addEventListener('click', () => {
      store.createPage({ title: 'Untitled' });
      toast.success('Created new page');
    });
    header.querySelector('.ns-btn-toggle-sidebar').addEventListener('click', () => {
      document.body.classList.toggle('sidebar-collapsed');
    });

    this.sidebarEl.appendChild(header);

    // 2. Quick Actions
    const quickNav = createElement('div', 'ns-quick-nav');
    const trashCount = store.getAllPages().filter(p => p.isTrash).length;

    quickNav.innerHTML = `
      <button class="ns-nav-btn ns-btn-search" aria-label="Search and command palette">
        ${Icons.search} <span>Search & Commands</span> <kbd>Ctrl+K</kbd>
      </button>
      <button class="ns-nav-btn ns-btn-settings" aria-label="Settings and preferences">
        ${Icons.settings} <span>Settings & Style</span>
      </button>
      <button class="ns-nav-btn ns-btn-history" aria-label="Revision history">
        ${Icons.history} <span>Page History</span>
      </button>
      <button class="ns-nav-btn ns-btn-shortcuts" aria-label="Keyboard shortcuts">
        ${Icons.sparkles} <span>Shortcuts</span> <kbd>?</kbd>
      </button>
      <button class="ns-nav-btn ns-btn-trash" aria-label="Trash bin">
        ${Icons.trash} <span>Trash</span>
        ${trashCount > 0 ? `<span class="ns-trash-badge">${trashCount}</span>` : ''}
      </button>
    `;

    quickNav.querySelector('.ns-btn-search').addEventListener('click', this.onOpenCommandPalette);
    quickNav.querySelector('.ns-btn-settings').addEventListener('click', this.onOpenSettings);
    quickNav.querySelector('.ns-btn-history').addEventListener('click', this.onOpenHistory);
    quickNav.querySelector('.ns-btn-shortcuts').addEventListener('click', this.onOpenShortcuts);
    quickNav.querySelector('.ns-btn-trash').addEventListener('click', this.onOpenTrash);

    this.sidebarEl.appendChild(quickNav);

    // 3. Scrollable Tree Section
    const scrollContainer = createElement('div', 'ns-sidebar-scroll');

    // --- Favorites Section ---
    const favoritePages = store.getAllPages().filter(p => !p.isTrash && p.isFavorite);
    if (favoritePages.length > 0) {
      const favSection = createElement('div', 'ns-sidebar-section');
      favSection.innerHTML = `
        <div class="ns-section-header">
          <span class="ns-section-title">Favorites</span>
        </div>
        <div class="ns-fav-list"></div>
      `;
      const favList = favSection.querySelector('.ns-fav-list');
      favoritePages.forEach(p => {
        const item = this.createPageRowElement(p, activePageId, 0, false);
        favList.appendChild(item);
      });
      scrollContainer.appendChild(favSection);
    }

    // --- Recent Pages Section ---
    const recentIds = store.getSetting('recentPageIds', []) || [];
    const validRecents = recentIds
      .map(id => store.getPage(id))
      .filter(p => p && !p.isTrash && (!favoritePages.some(fp => fp.id === p.id)))
      .slice(0, 4);

    if (validRecents.length > 0) {
      const recSection = createElement('div', 'ns-sidebar-section');
      recSection.innerHTML = `
        <div class="ns-section-header">
          <span class="ns-section-title">Recent</span>
        </div>
        <div class="ns-recent-list"></div>
      `;
      const recList = recSection.querySelector('.ns-recent-list');
      validRecents.forEach(p => {
        const item = this.createPageRowElement(p, activePageId, 0, false);
        recList.appendChild(item);
      });
      scrollContainer.appendChild(recSection);
    }

    // --- Workspace Tree Section ---
    const wsSection = createElement('div', 'ns-sidebar-section');
    wsSection.innerHTML = `
      <div class="ns-section-header">
        <span class="ns-section-title">Workspace</span>
        <button class="ns-btn-section-add" title="Add Page" aria-label="Add Page">${Icons.plus}</button>
      </div>
      <div class="ns-tree-root"></div>
    `;

    wsSection.querySelector('.ns-btn-section-add').addEventListener('click', () => {
      store.createPage({ title: 'Untitled' });
      toast.success('Created new page');
    });

    const treeRoot = wsSection.querySelector('.ns-tree-root');
    this.renderTreeLevel(null, 0, treeRoot, activePageId);

    scrollContainer.appendChild(wsSection);
    this.sidebarEl.appendChild(scrollContainer);

    // 4. Sidebar Footer
    const footer = createElement('div', 'ns-sidebar-footer');
    footer.innerHTML = `
      <button class="ns-btn-quick-new-page" aria-label="New Page">
        ${Icons.plus} <span>New Page</span>
      </button>
      <button class="ns-btn-templates-loader" title="Templates" aria-label="Templates">
        ${Icons.template} <span>Templates</span>
      </button>
    `;

    footer.querySelector('.ns-btn-quick-new-page').addEventListener('click', () => {
      store.createPage({ title: 'Untitled' });
      toast.success('Created new page');
    });
    footer.querySelector('.ns-btn-templates-loader').addEventListener('click', () => {
      this.showTemplatesMenu(footer.querySelector('.ns-btn-templates-loader'));
    });

    this.sidebarEl.appendChild(footer);
  }

  renderTreeLevel(parentId, depth, containerEl, activePageId) {
    const allPages = store.getAllPages();
    const children = allPages
      .filter(p => p.parentId === parentId && !p.isTrash)
      .sort((a, b) => a.order - b.order);

    children.forEach(page => {
      const pageChildren = allPages.filter(p => p.parentId === page.id && !p.isTrash);
      const hasChildren = pageChildren.length > 0;
      const isExpanded = this.expandedNodes.has(page.id);

      const rowEl = this.createPageRowElement(page, activePageId, depth, true, hasChildren, isExpanded);
      containerEl.appendChild(rowEl);

      if (hasChildren && isExpanded) {
        const subContainer = createElement('div', 'ns-tree-sub-container');
        this.renderTreeLevel(page.id, depth + 1, subContainer, activePageId);
        containerEl.appendChild(subContainer);
      }
    });
  }

  createPageRowElement(page, activePageId, depth, isTree = true, hasChildren = false, isExpanded = false) {
    const row = createElement('div', `ns-page-row ${page.id === activePageId ? 'is-active' : ''}`);
    row.dataset.pageId = page.id;
    row.style.paddingLeft = `${12 + depth * 14}px`;

    let expanderIcon = '';
    if (isTree) {
      if (hasChildren) {
        expanderIcon = `<button class="ns-tree-expander ${isExpanded ? 'is-expanded' : ''}" title="Toggle Subpages" aria-label="Toggle Subpages">${Icons.chevronRight}</button>`;
      } else {
        expanderIcon = `<span class="ns-tree-expander-placeholder"></span>`;
      }
    }

    const iconDisplay = page.icon ? page.icon : Icons.fileText;

    row.innerHTML = `
      ${expanderIcon}
      <span class="ns-page-icon-slot">${iconDisplay}</span>
      <span class="ns-page-title-slot">${escapeHTML(page.title || 'Untitled')}</span>
      <div class="ns-page-row-actions">
        <button class="ns-row-act-btn ns-btn-add-subpage" title="Add subpage" aria-label="Add subpage">${Icons.plus}</button>
        <button class="ns-row-act-btn ns-btn-page-more" title="More actions" aria-label="More actions">${Icons.moreHorizontal}</button>
      </div>
    `;

    // Click row to navigate
    row.addEventListener('click', (e) => {
      if (e.target.closest('.ns-tree-expander') || e.target.closest('.ns-page-row-actions')) {
        return;
      }
      store.setActivePage(page.id);
    });

    // Expand / Collapse toggle
    const expander = row.querySelector('.ns-tree-expander');
    if (expander) {
      expander.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.expandedNodes.has(page.id)) {
          this.expandedNodes.delete(page.id);
        } else {
          this.expandedNodes.add(page.id);
        }
        this.render();
      });
    }

    // Add subpage
    const addSubBtn = row.querySelector('.ns-btn-add-subpage');
    if (addSubBtn) {
      addSubBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.expandedNodes.add(page.id);
        store.createPage({ parentId: page.id, title: 'Untitled' });
        toast.success(`Added subpage under "${page.title || 'Untitled'}"`);
      });
    }

    // More actions menu
    const moreBtn = row.querySelector('.ns-btn-page-more');
    if (moreBtn) {
      moreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showPageContextMenu(moreBtn, page);
      });
    }

    // Drag-to-nest and reorder listeners
    if (isTree) {
      this.setupTreeDragAndDrop(row, page);
    }

    return row;
  }

  setupTreeDragAndDrop(rowEl, page) {
    rowEl.setAttribute('draggable', 'true');

    rowEl.addEventListener('dragstart', (e) => {
      this.draggedPageId = page.id;
      rowEl.classList.add('is-dragging-tree-row');
      e.dataTransfer.setData('text/plain', page.id);
    });

    rowEl.addEventListener('dragend', () => {
      rowEl.classList.remove('is-dragging-tree-row');
      document.querySelectorAll('.ns-tree-drop-inside, .ns-tree-drop-above, .ns-tree-drop-below').forEach(el => {
        el.classList.remove('ns-tree-drop-inside', 'ns-tree-drop-above', 'ns-tree-drop-below');
      });
    });

    rowEl.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (!this.draggedPageId || this.draggedPageId === page.id) return;

      const rect = rowEl.getBoundingClientRect();
      const relY = e.clientY - rect.top;

      rowEl.classList.remove('ns-tree-drop-inside', 'ns-tree-drop-above', 'ns-tree-drop-below');

      if (relY < rect.height * 0.25) {
        rowEl.classList.add('ns-tree-drop-above');
      } else if (relY > rect.height * 0.75) {
        rowEl.classList.add('ns-tree-drop-below');
      } else {
        rowEl.classList.add('ns-tree-drop-inside');
      }
    });

    rowEl.addEventListener('dragleave', () => {
      rowEl.classList.remove('ns-tree-drop-inside', 'ns-tree-drop-above', 'ns-tree-drop-below');
    });

    rowEl.addEventListener('drop', (e) => {
      e.preventDefault();
      const draggedId = this.draggedPageId;
      if (!draggedId || draggedId === page.id) return;

      const rect = rowEl.getBoundingClientRect();
      const relY = e.clientY - rect.top;

      if (relY >= rect.height * 0.25 && relY <= rect.height * 0.75) {
        this.expandedNodes.add(page.id);
        store.reorderPages(draggedId, page.id, 0);
        toast.info('Moved page into sub-folder');
      } else if (relY < rect.height * 0.25) {
        store.reorderPages(draggedId, page.parentId, Math.max(0, page.order));
      } else {
        store.reorderPages(draggedId, page.parentId, page.order + 1);
      }

      this.draggedPageId = null;
    });
  }

  showPageContextMenu(targetBtn, page) {
    document.querySelectorAll('.ns-context-menu').forEach(m => m.remove());

    const menu = createElement('div', 'ns-context-menu');
    menu.innerHTML = `
      <div class="ns-menu-item" data-action="favorite">
        ${page.isFavorite ? Icons.starFilled : Icons.star}
        <span>${page.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
      </div>
      <div class="ns-menu-item" data-action="duplicate">
        ${Icons.copy} <span>Duplicate Page</span>
      </div>
      <div class="ns-menu-item" data-action="new-subpage">
        ${Icons.plus} <span>Add Subpage</span>
      </div>
      <div class="ns-menu-divider"></div>
      <div class="ns-menu-item ns-menu-danger" data-action="trash">
        ${Icons.trash} <span>Move to Trash</span>
      </div>
    `;

    document.body.appendChild(menu);
    const rect = targetBtn.getBoundingClientRect();
    let top = rect.bottom + window.scrollY + 4;
    let left = rect.left + window.scrollX;

    if (top + 200 > window.innerHeight + window.scrollY) {
      top = rect.top + window.scrollY - 200;
    }

    menu.style.top = `${Math.max(10, top)}px`;
    menu.style.left = `${Math.max(10, left)}px`;

    menu.querySelector('[data-action="favorite"]').addEventListener('click', async () => {
      const isFav = await store.toggleFavorite(page.id);
      toast.info(isFav ? 'Added to Favorites' : 'Removed from Favorites');
      menu.remove();
    });

    menu.querySelector('[data-action="duplicate"]').addEventListener('click', async () => {
      await store.duplicatePage(page.id);
      toast.success('Page duplicated');
      menu.remove();
    });

    menu.querySelector('[data-action="new-subpage"]').addEventListener('click', () => {
      this.expandedNodes.add(page.id);
      store.createPage({ parentId: page.id, title: 'Untitled' });
      toast.success('Added subpage');
      menu.remove();
    });

    menu.querySelector('[data-action="trash"]').addEventListener('click', async () => {
      await store.moveToTrash(page.id);
      toast.show(`Moved "${page.title || 'Untitled'}" to trash`, 'trash');
      menu.remove();
    });

    const closeHandler = (e) => {
      if (!menu.contains(e.target) && !targetBtn.contains(e.target)) {
        menu.remove();
        document.removeEventListener('click', closeHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 10);
  }

  showTemplatesMenu(targetBtn) {
    document.querySelectorAll('.ns-picker-popover').forEach(p => p.remove());

    const popover = createElement('div', 'ns-picker-popover ns-templates-popover');
    popover.innerHTML = `
      <div class="ns-picker-title">Create from Template</div>
      <div class="ns-templates-list">
        <button class="ns-template-opt" data-type="meeting">
          <span class="ns-template-icon">📝</span>
          <div class="ns-template-info">
            <div class="ns-template-name">Meeting Notes</div>
            <div class="ns-template-desc">Agenda, attendees, and action items checklist.</div>
          </div>
        </button>
        <button class="ns-template-opt" data-type="habits">
          <span class="ns-template-icon">🔥</span>
          <div class="ns-template-info">
            <div class="ns-template-name">Sprint Retrospective</div>
            <div class="ns-template-desc">Went well, needs improvement, action items.</div>
          </div>
        </button>
        <button class="ns-template-opt" data-type="wiki">
          <span class="ns-template-icon">📖</span>
          <div class="ns-template-info">
            <div class="ns-template-name">Knowledge Base RFC</div>
            <div class="ns-template-desc">Architecture RFC with design principles and toggles.</div>
          </div>
        </button>
      </div>
    `;

    document.body.appendChild(popover);
    const rect = targetBtn.getBoundingClientRect();
    popover.style.top = `${rect.top + window.scrollY - 220}px`;
    popover.style.left = `${Math.max(10, rect.left + window.scrollX)}px`;

    popover.querySelectorAll('.ns-template-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        this.instantiateTemplate(type);
        popover.remove();
      });
    });

    const closeHandler = (e) => {
      if (!popover.contains(e.target) && !targetBtn.contains(e.target)) {
        popover.remove();
        document.removeEventListener('click', closeHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 10);
  }

  instantiateTemplate(type) {
    if (type === 'meeting') {
      store.createPage({
        title: `Meeting Notes — ${new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`,
        icon: '📝',
        cover: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        blocks: [
          { id: 'b-m-1', type: 'callout', content: 'Session agenda, discussion highlights, and assigned deliverables.', metadata: { icon: '💡', color: 'blue' } },
          { id: 'b-m-2', type: 'heading2', content: '👥 Attendees' },
          { id: 'b-m-3', type: 'bulletList', content: 'Marcus Vance' },
          { id: 'b-m-4', type: 'bulletList', content: 'Elena Rostova' },
          { id: 'b-m-5', type: 'heading2', content: '📋 Discussion Topics' },
          { id: 'b-m-6', type: 'numberedList', content: 'Review sprint deliverables and milestones' },
          { id: 'b-m-7', type: 'numberedList', content: 'Address blockers and architecture questions' },
          { id: 'b-m-8', type: 'heading2', content: '✅ Action Items' },
          { id: 'b-m-9', type: 'checklist', content: 'Finalize schema validator documentation', metadata: { checked: false } },
          { id: 'b-m-10', type: 'checklist', content: 'Publish release v2.0 update', metadata: { checked: false } }
        ]
      });
      toast.success('Loaded Meeting Notes template');
    } else if (type === 'habits') {
      store.createPage({
        title: 'Sprint Retrospective',
        icon: '🔥',
        cover: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)',
        blocks: [
          { id: 'b-hb-1', type: 'heading2', content: '🟢 What Went Well' },
          { id: 'b-hb-2', type: 'checklist', content: 'Zero downtime during IndexedDB migration', metadata: { checked: true } },
          { id: 'b-hb-3', type: 'checklist', content: 'Smooth drag-and-drop feedback from beta testers', metadata: { checked: true } },
          { id: 'b-hb-4', type: 'heading2', content: '🔴 Needs Improvement' },
          { id: 'b-hb-5', type: 'checklist', content: 'Speed up cold-start query times on large database tables', metadata: { checked: false } },
          { id: 'b-hb-6', type: 'heading2', content: '🎯 Key Takeaways' },
          { id: 'b-hb-7', type: 'paragraph', content: 'Keep component decoupling strict and avoid global DOM queries.' }
        ]
      });
      toast.success('Loaded Retrospective template');
    } else if (type === 'wiki') {
      store.createPage({
        title: 'Architecture RFC Document',
        icon: '📖',
        cover: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
        blocks: [
          { id: 'b-wk-1', type: 'callout', content: 'Technical RFC for local-first synchronization and conflict resolution.', metadata: { icon: '🏛️', color: 'green' } },
          { id: 'b-wk-2', type: 'heading1', content: 'Problem Statement' },
          { id: 'b-wk-3', type: 'paragraph', content: 'Provide zero-latency writes while supporting immutable history rollback.' },
          { id: 'b-wk-4', type: 'heading2', content: 'Technical Approach' },
          { id: 'b-wk-5', type: 'toggle', content: '▶ View Proposed Invariant Rules', metadata: { isOpen: false, children: '• Rule 1: In-memory store updates before IDB dispatch\n• Rule 2: Automatic snapshot on significant content delta\n• Rule 3: Graceful fallback to LocalStorage if quota exceeded' } }
        ]
      });
      toast.success('Loaded RFC template');
    }
  }
}


  // ==========================================
  // FILE: js/search/commandPalette.js
  // ==========================================
/**
 * NoteSpace - Global Command Palette & Unified Search
 * Triggered via Ctrl+K or Cmd+K. Searches page titles, block contents, databases, and workspace actions.
 */
class CommandPalette {
  constructor(actions = {}) {
    this.actions = actions;
    this.backdropEl = null;
    this.isOpen = false;
    this.selectedIndex = 0;
    this.results = [];
    this.query = '';

    this.bindGlobalShortcut();
  }

  bindGlobalShortcut() {
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.query = '';
    this.selectedIndex = 0;
    this.render();

    const inp = this.backdropEl.querySelector('.ns-palette-input');
    setTimeout(() => inp.focus(), 30);
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    if (this.backdropEl) {
      this.backdropEl.remove();
      this.backdropEl = null;
    }
  }

  render() {
    if (this.backdropEl) this.backdropEl.remove();

    this.backdropEl = createElement('div', 'ns-modal-backdrop ns-palette-backdrop');
    const palette = createElement('div', 'ns-command-palette');

    palette.innerHTML = `
      <div class="ns-palette-input-wrap">
        <span class="ns-palette-search-icon">${Icons.search}</span>
        <input type="text" class="ns-palette-input" placeholder="Search pages, notes, or run a command..." value="${escapeHTML(this.query)}" />
        <kbd class="ns-kbd-esc">ESC</kbd>
      </div>
      <div class="ns-palette-results-list"></div>
      <div class="ns-palette-footer">
        <div class="ns-palette-hint"><kbd>↑</kbd><kbd>↓</kbd> Navigate</div>
        <div class="ns-palette-hint"><kbd>↵</kbd> Select</div>
        <div class="ns-palette-hint"><kbd>ESC</kbd> Close</div>
      </div>
    `;

    this.backdropEl.appendChild(palette);
    document.body.appendChild(this.backdropEl);

    const input = palette.querySelector('.ns-palette-input');
    const resultsContainer = palette.querySelector('.ns-palette-results-list');

    input.addEventListener('input', (e) => {
      this.query = e.target.value;
      this.selectedIndex = 0;
      this.computeResults();
      this.renderResultsList(resultsContainer);
    });

    input.addEventListener('keydown', (e) => {
      this.handleKeyDown(e);
    });

    this.backdropEl.addEventListener('click', (e) => {
      if (e.target === this.backdropEl) this.close();
    });

    this.computeResults();
    this.renderResultsList(resultsContainer);
  }

  computeResults() {
    const q = this.query.trim().toLowerCase();
    const results = [];

    const pages = store.getAllPages().filter(p => !p.isTrash);

    // 1. Matched Pages
    pages.forEach(p => {
      const titleMatch = (p.title || 'Untitled').toLowerCase().includes(q);
      let matchedBlockSnippet = '';

      if (!titleMatch && q) {
        // Search inside block contents
        for (const b of (p.blocks || [])) {
          const content = (b.content || '').replace(/<[^>]*>/g, '');
          if (content.toLowerCase().includes(q)) {
            const idx = content.toLowerCase().indexOf(q);
            const start = Math.max(0, idx - 20);
            const snippet = content.substring(start, start + 70);
            matchedBlockSnippet = (start > 0 ? '...' : '') + snippet + '...';
            break;
          }
        }
      }

      if (!q || titleMatch || matchedBlockSnippet) {
        results.push({
          type: 'page',
          id: p.id,
          title: p.title || 'Untitled',
          icon: p.icon || '📄',
          snippet: matchedBlockSnippet,
          action: () => store.setActivePage(p.id)
        });
      }
    });

    // 2. System Commands
    const commands = [
      {
        id: 'cmd-new-page',
        label: 'Create New Page',
        category: 'Action',
        icon: 'plus',
        action: () => store.createPage({ title: 'Untitled' })
      },
      {
        id: 'cmd-new-db',
        label: 'Create New Database',
        category: 'Action',
        icon: 'database',
        action: () => {
          store.createDatabase({ title: 'New Database' }).then(db => {
            store.createPage({
              title: db.title,
              icon: '📊',
              databaseId: db.id,
              blocks: [{ id: 'b-1', type: 'database', content: '', metadata: { databaseId: db.id } }]
            });
          });
        }
      },
      {
        id: 'cmd-theme',
        label: 'Toggle Dark / Light Theme',
        category: 'Preferences',
        icon: 'moon',
        action: () => {
          const cur = store.getSetting('theme', 'dark');
          const next = cur === 'dark' ? 'light' : 'dark';
          store.setSetting('theme', next);
        }
      },
      {
        id: 'cmd-export-json',
        label: 'Export Workspace (JSON Backup)',
        category: 'Data',
        icon: 'download',
        action: () => {
          if (this.actions.onExportWorkspace) this.actions.onExportWorkspace();
        }
      },
      {
        id: 'cmd-export-md',
        label: 'Export Current Page as Markdown',
        category: 'Data',
        icon: 'fileText',
        action: () => {
          if (this.actions.onExportMarkdown) this.actions.onExportMarkdown();
        }
      },
      {
        id: 'cmd-settings',
        label: 'Open Settings & Preferences',
        category: 'Navigation',
        icon: 'settings',
        action: () => {
          if (this.actions.onOpenSettings) this.actions.onOpenSettings();
        }
      },
      {
        id: 'cmd-trash',
        label: 'Open Trash',
        category: 'Navigation',
        icon: 'trash',
        action: () => {
          if (this.actions.onOpenTrash) this.actions.onOpenTrash();
        }
      },
      {
        id: 'cmd-history',
        label: 'View Page Revision History',
        category: 'History',
        icon: 'history',
        action: () => {
          if (this.actions.onOpenHistory) this.actions.onOpenHistory();
        }
      }
    ];

    commands.forEach(cmd => {
      if (!q || cmd.label.toLowerCase().includes(q) || cmd.category.toLowerCase().includes(q)) {
        results.push({
          type: 'command',
          id: cmd.id,
          title: cmd.label,
          category: cmd.category,
          icon: getIcon(cmd.icon),
          action: cmd.action
        });
      }
    });

    this.results = results;
  }

  renderResultsList(containerEl) {
    containerEl.innerHTML = '';

    if (this.results.length === 0) {
      containerEl.innerHTML = `
        <div class="ns-palette-no-results">
          <p>No results found for "${escapeHTML(this.query)}"</p>
        </div>
      `;
      return;
    }

    this.results.forEach((item, index) => {
      const row = createElement('div', `ns-palette-item ${index === this.selectedIndex ? 'is-selected' : ''}`);

      if (item.type === 'page') {
        row.innerHTML = `
          <div class="ns-pal-icon">${item.icon}</div>
          <div class="ns-pal-info">
            <div class="ns-pal-title">${this.highlightMatch(item.title, this.query)}</div>
            ${item.snippet ? `<div class="ns-pal-snippet">${this.highlightMatch(item.snippet, this.query)}</div>` : ''}
          </div>
          <div class="ns-pal-badge">Page</div>
        `;
      } else {
        row.innerHTML = `
          <div class="ns-pal-icon">${item.icon}</div>
          <div class="ns-pal-info">
            <div class="ns-pal-title">${this.highlightMatch(item.title, this.query)}</div>
          </div>
          <div class="ns-pal-badge ns-badge-cmd">${item.category}</div>
        `;
      }

      row.addEventListener('mouseenter', () => {
        this.selectedIndex = index;
        this.updateSelection(containerEl);
      });

      row.addEventListener('click', () => {
        this.executeSelected();
      });

      containerEl.appendChild(row);
    });
  }

  highlightMatch(text, query) {
    if (!query) return escapeHTML(text);
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return escapeHTML(text).replace(regex, '<mark class="ns-mark">$1</mark>');
  }

  updateSelection(containerEl) {
    const items = containerEl.querySelectorAll('.ns-palette-item');
    items.forEach((item, i) => {
      if (i === this.selectedIndex) {
        item.classList.add('is-selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('is-selected');
      }
    });
  }

  handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.results.length > 0) {
        this.selectedIndex = (this.selectedIndex + 1) % this.results.length;
        const list = this.backdropEl.querySelector('.ns-palette-results-list');
        if (list) this.updateSelection(list);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.results.length > 0) {
        this.selectedIndex = (this.selectedIndex - 1 + this.results.length) % this.results.length;
        const list = this.backdropEl.querySelector('.ns-palette-results-list');
        if (list) this.updateSelection(list);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      this.executeSelected();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
    }
  }

  executeSelected() {
    const item = this.results[this.selectedIndex];
    if (item && item.action) {
      this.close();
      item.action();
    }
  }
}


  // ==========================================
  // FILE: js/history/historyManager.js
  // ==========================================
/**
 * NoteSpace - Page Revision History Manager
 * Inspect past snapshots of the active document and restore previous versions.
 */
class HistoryManager {
  constructor() {
    this.backdropEl = null;
  }

  async open(pageId) {
    const page = store.getPage(pageId);
    if (!page) return;

    const revisions = await store.getPageHistory(pageId);

    document.querySelectorAll('.ns-history-modal-backdrop').forEach(m => m.remove());

    this.backdropEl = createElement('div', 'ns-modal-backdrop ns-history-modal-backdrop');
    const modal = createElement('div', 'ns-history-modal');

    modal.innerHTML = `
      <div class="ns-modal-header">
        <div class="ns-modal-title">
          ${Icons.history}
          <span>Version History: <strong>${escapeHTML(page.title || 'Untitled')}</strong></span>
        </div>
        <button class="ns-modal-close-btn">${Icons.x}</button>
      </div>

      <div class="ns-history-body">
        <div class="ns-history-sidebar">
          <div class="ns-history-list-title">Past Snapshots (${revisions.length})</div>
          <div class="ns-history-list"></div>
        </div>
        <div class="ns-history-preview-panel">
          <div class="ns-history-preview-header">
            <div class="ns-preview-meta">Select a version from the left to preview.</div>
            <button class="ns-btn ns-btn-primary ns-btn-restore-version" style="display:none;">Restore this version</button>
          </div>
          <div class="ns-history-preview-content"></div>
        </div>
      </div>
    `;

    this.backdropEl.appendChild(modal);
    document.body.appendChild(this.backdropEl);

    const listContainer = modal.querySelector('.ns-history-list');
    const previewContent = modal.querySelector('.ns-history-preview-content');
    const previewMeta = modal.querySelector('.ns-preview-meta');
    const restoreBtn = modal.querySelector('.ns-btn-restore-version');

    let selectedRevision = null;

    if (revisions.length === 0) {
      listContainer.innerHTML = `<div class="ns-history-empty">No historical snapshots recorded yet. Snapshots are created as you write.</div>`;
    } else {
      revisions.forEach((rev, idx) => {
        const item = createElement('div', `ns-history-item ${idx === 0 ? 'is-selected' : ''}`);
        const dateStr = new Date(rev.timestamp).toLocaleString();

        item.innerHTML = `
          <div class="ns-rev-date">${dateStr}</div>
          <div class="ns-rev-note">${rev.note || 'Snapshot'} • ${(rev.blocks || []).length} blocks</div>
        `;

        item.addEventListener('click', () => {
          listContainer.querySelectorAll('.ns-history-item').forEach(i => i.classList.remove('is-selected'));
          item.classList.add('is-selected');
          selectRevision(rev);
        });

        listContainer.appendChild(item);
      });

      // Select first by default
      selectRevision(revisions[0]);
    }

    function selectRevision(rev) {
      selectedRevision = rev;
      restoreBtn.style.display = 'inline-flex';
      previewMeta.innerHTML = `Snapshot from <strong>${new Date(rev.timestamp).toLocaleString()}</strong> (${(rev.blocks || []).length} blocks)`;

      // Render simplified preview
      let html = `<h1 class="ns-preview-title">${escapeHTML(rev.title || 'Untitled')}</h1>`;
      (rev.blocks || []).forEach(b => {
        html += `<div class="ns-preview-block">${b.content || ''}</div>`;
      });
      previewContent.innerHTML = html;
    }

    restoreBtn.addEventListener('click', async () => {
      if (!selectedRevision) return;
      if (confirm(`Restore version from ${new Date(selectedRevision.timestamp).toLocaleString()}? Current unsaved edits will be saved as a new snapshot.`)) {
        await store.restorePageRevision(selectedRevision.id);
        this.close();
      }
    });

    modal.querySelector('.ns-modal-close-btn').addEventListener('click', () => this.close());
    this.backdropEl.addEventListener('click', (e) => {
      if (e.target === this.backdropEl) this.close();
    });
  }

  close() {
    if (this.backdropEl) {
      this.backdropEl.remove();
      this.backdropEl = null;
    }
  }
}


  // ==========================================
  // FILE: js/modals/trashModal.js
  // ==========================================
/**
 * NoteSpace - Trash Management Modal
 * Allows viewing trashed pages, restoring them to original tree or root, and permanent deletion.
 */
class TrashModal {
  constructor() {
    this.backdropEl = null;
  }

  open() {
    document.querySelectorAll('.ns-trash-modal-backdrop').forEach(m => m.remove());

    this.backdropEl = createElement('div', 'ns-modal-backdrop ns-trash-modal-backdrop');
    const modal = createElement('div', 'ns-trash-modal');

    this.renderModal(modal);

    this.backdropEl.appendChild(modal);
    document.body.appendChild(this.backdropEl);

    this.backdropEl.addEventListener('click', (e) => {
      if (e.target === this.backdropEl) this.close();
    });
  }

  renderModal(modal) {
    const trashed = store.getAllPages().filter(p => p.isTrash);

    modal.innerHTML = `
      <div class="ns-modal-header">
        <div class="ns-modal-title">
          ${Icons.trash}
          <span>Trash (${trashed.length})</span>
        </div>
        <div class="ns-modal-header-actions">
          ${trashed.length > 0 ? `<button class="ns-btn ns-btn-danger ns-btn-empty-trash">Empty Trash</button>` : ''}
          <button class="ns-modal-close-btn">${Icons.x}</button>
        </div>
      </div>

      <div class="ns-modal-body">
        <div class="ns-trash-search-wrap">
          ${Icons.search}
          <input type="text" class="ns-input ns-trash-search-inp" placeholder="Filter trashed pages..." />
        </div>
        <div class="ns-trash-list"></div>
      </div>
    `;

    const listContainer = modal.querySelector('.ns-trash-list');
    const searchInp = modal.querySelector('.ns-trash-search-inp');

    const renderList = (filter = '') => {
      listContainer.innerHTML = '';
      const filtered = trashed.filter(p => (p.title || 'Untitled').toLowerCase().includes(filter.toLowerCase()));

      if (filtered.length === 0) {
        listContainer.innerHTML = `
          <div class="ns-trash-empty">
            <div class="ns-empty-icon">${Icons.trash}</div>
            <p>${trashed.length === 0 ? 'Trash is empty' : 'No matching trashed pages found'}</p>
          </div>
        `;
        return;
      }

      filtered.forEach(page => {
        const item = createElement('div', 'ns-trash-item');
        const deletedStr = page.trashDate ? formatDate(page.trashDate) : 'Recently';

        item.innerHTML = `
          <div class="ns-trash-item-info">
            <span class="ns-trash-icon">${page.icon || '📄'}</span>
            <span class="ns-trash-title">${escapeHTML(page.title || 'Untitled')}</span>
            <span class="ns-trash-date">Deleted ${deletedStr}</span>
          </div>
          <div class="ns-trash-item-actions">
            <button class="ns-btn-sm ns-btn-restore" title="Restore Page">${Icons.refreshCw} Restore</button>
            <button class="ns-btn-sm ns-btn-danger ns-btn-delete-perm" title="Delete permanently">${Icons.trash} Delete</button>
          </div>
        `;

        item.querySelector('.ns-btn-restore').addEventListener('click', async () => {
          await store.restoreFromTrash(page.id);
          this.renderModal(modal);
        });

        item.querySelector('.ns-btn-delete-perm').addEventListener('click', async () => {
          if (confirm(`Permanently delete "${page.title || 'Untitled'}"? This action cannot be undone.`)) {
            await store.deletePermanently(page.id);
            this.renderModal(modal);
          }
        });

        listContainer.appendChild(item);
      });
    };

    renderList();

    searchInp.addEventListener('input', (e) => {
      renderList(e.target.value.trim());
    });

    const emptyBtn = modal.querySelector('.ns-btn-empty-trash');
    if (emptyBtn) {
      emptyBtn.addEventListener('click', async () => {
        if (confirm('Permanently delete all items in trash? This cannot be undone.')) {
          await store.emptyTrash();
          this.renderModal(modal);
        }
      });
    }

    modal.querySelector('.ns-modal-close-btn').addEventListener('click', () => this.close());
  }

  close() {
    if (this.backdropEl) {
      this.backdropEl.remove();
      this.backdropEl = null;
    }
  }
}


  // ==========================================
  // FILE: js/modals/settingsModal.js
  // ==========================================
/**
 * NoteSpace - Settings & Workspace Customization Modal
 * Controls theme, typography, workspace metadata, storage stats, backup export/import validator.
 */
class SettingsModal {
  constructor() {
    this.backdropEl = null;
  }

  async open() {
    document.querySelectorAll('.ns-settings-modal-backdrop').forEach(m => m.remove());

    this.backdropEl = createElement('div', 'ns-modal-backdrop ns-settings-modal-backdrop');
    const modal = createElement('div', 'ns-settings-modal');

    const stats = await db.getStorageStats();
    const currentTheme = store.getSetting('theme', 'dark');
    const currentFont = store.getSetting('fontFamily', 'sans');
    const fullWidth = store.getSetting('fullWidth', false);
    const wsName = store.getSetting('workspaceName', 'My Workspace');
    const wsIcon = store.getSetting('workspaceIcon', '🪐');

    modal.innerHTML = `
      <div class="ns-modal-header">
        <div class="ns-modal-title">
          ${Icons.settings}
          <span>Settings & Preferences</span>
        </div>
        <button class="ns-modal-close-btn">${Icons.x}</button>
      </div>

      <div class="ns-modal-body ns-settings-body">
        
        <!-- Workspace Section -->
        <div class="ns-settings-section">
          <div class="ns-settings-title">Workspace Profile</div>
          <div class="ns-settings-grid">
            <div class="ns-form-group">
              <label class="ns-form-label">Workspace Icon</label>
              <input type="text" class="ns-input ns-ws-icon-inp" value="${escapeHTML(wsIcon)}" style="width: 70px; text-align: center; font-size: 1.2rem;" />
            </div>
            <div class="ns-form-group" style="flex:1;">
              <label class="ns-form-label">Workspace Name</label>
              <input type="text" class="ns-input ns-ws-name-inp" value="${escapeHTML(wsName)}" />
            </div>
          </div>
        </div>

        <div class="ns-settings-divider"></div>

        <!-- Appearance Section -->
        <div class="ns-settings-section">
          <div class="ns-settings-title">Appearance & Typography</div>
          
          <div class="ns-setting-row">
            <div class="ns-setting-info">
              <div class="ns-setting-name">Theme</div>
              <div class="ns-setting-desc">Choose between dark slate mode and crisp light mode.</div>
            </div>
            <div class="ns-theme-switch-group">
              <button class="ns-btn-toggle-opt ${currentTheme === 'dark' ? 'is-selected' : ''}" data-theme="dark">
                ${Icons.moon} Dark
              </button>
              <button class="ns-btn-toggle-opt ${currentTheme === 'light' ? 'is-selected' : ''}" data-theme="light">
                ${Icons.sun} Light
              </button>
            </div>
          </div>

          <div class="ns-setting-row">
            <div class="ns-setting-info">
              <div class="ns-setting-name">Font Family</div>
              <div class="ns-setting-desc">Select typography style for writing and headers.</div>
            </div>
            <div class="ns-font-switch-group">
              <button class="ns-btn-toggle-opt ${currentFont === 'sans' ? 'is-selected' : ''}" data-font="sans">Default Sans</button>
              <button class="ns-btn-toggle-opt ${currentFont === 'serif' ? 'is-selected' : ''}" data-font="serif">Serif Editorial</button>
              <button class="ns-btn-toggle-opt ${currentFont === 'mono' ? 'is-selected' : ''}" data-font="mono">Mono Technical</button>
            </div>
          </div>

          <div class="ns-setting-row">
            <div class="ns-setting-info">
              <div class="ns-setting-name">Full Width Canvas</div>
              <div class="ns-setting-desc">Expand editor content across full window width.</div>
            </div>
            <input type="checkbox" class="ns-fullwidth-toggle" ${fullWidth ? 'checked' : ''} />
          </div>
        </div>

        <div class="ns-settings-divider"></div>

        <!-- Storage & Data Section -->
        <div class="ns-settings-section">
          <div class="ns-settings-title">Storage & Persistence</div>
          <div class="ns-storage-stats-box">
            <div class="ns-stat-card">
              <div class="ns-stat-val">${stats.pagesCount}</div>
              <div class="ns-stat-lbl">Active Pages</div>
            </div>
            <div class="ns-stat-card">
              <div class="ns-stat-val">${stats.databasesCount}</div>
              <div class="ns-stat-lbl">Databases</div>
            </div>
            <div class="ns-stat-card">
              <div class="ns-stat-val">${stats.historyCount}</div>
              <div class="ns-stat-lbl">Snapshots</div>
            </div>
            <div class="ns-stat-card">
              <div class="ns-stat-val">${stats.approxSizeKB} KB</div>
              <div class="ns-stat-lbl">Data Size</div>
            </div>
          </div>

          <div class="ns-backup-actions">
            <button class="ns-btn ns-btn-secondary ns-btn-export-backup">
              ${Icons.download} Export Workspace JSON
            </button>
            <label class="ns-btn ns-btn-secondary ns-btn-import-backup">
              ${Icons.upload} Restore from JSON
              <input type="file" accept=".json" class="ns-import-file-inp" style="display:none;" />
            </label>
          </div>
          <div class="ns-import-status" style="display:none;"></div>
        </div>

        <div class="ns-settings-divider"></div>

        <!-- Danger Zone Section -->
        <div class="ns-settings-section">
          <div class="ns-settings-title ns-danger-title">Danger Zone</div>
          <div class="ns-setting-row">
            <div class="ns-setting-info">
              <div class="ns-setting-name">Reset Workspace</div>
              <div class="ns-setting-desc">Revert to starter sample tutorial pages & roadmap database.</div>
            </div>
            <button class="ns-btn ns-btn-danger ns-btn-reset-defaults">Reset to Starter</button>
          </div>
        </div>

      </div>
    `;

    this.backdropEl.appendChild(modal);
    document.body.appendChild(this.backdropEl);

    // Bind Workspace Name & Icon
    const wsNameInp = modal.querySelector('.ns-ws-name-inp');
    const wsIconInp = modal.querySelector('.ns-ws-icon-inp');

    wsNameInp.addEventListener('change', () => {
      store.setSetting('workspaceName', wsNameInp.value.trim() || 'My Workspace');
    });
    wsIconInp.addEventListener('change', () => {
      store.setSetting('workspaceIcon', wsIconInp.value.trim() || '🪐');
    });

    // Theme selector
    modal.querySelectorAll('[data-theme]').forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        store.setSetting('theme', theme);
        modal.querySelectorAll('[data-theme]').forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        document.documentElement.setAttribute('data-theme', theme);
      });
    });

    // Font selector
    modal.querySelectorAll('[data-font]').forEach(btn => {
      btn.addEventListener('click', () => {
        const font = btn.dataset.font;
        store.setSetting('fontFamily', font);
        modal.querySelectorAll('[data-font]').forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        document.documentElement.setAttribute('data-font', font);
      });
    });

    // Full width toggle
    const fwToggle = modal.querySelector('.ns-fullwidth-toggle');
    fwToggle.addEventListener('change', (e) => {
      store.setSetting('fullWidth', e.target.checked);
      document.body.classList.toggle('canvas-fullwidth', e.target.checked);
    });

    // Export backup
    modal.querySelector('.ns-btn-export-backup').addEventListener('click', () => {
      exportWorkspace();
    });

    // Import backup
    const importInp = modal.querySelector('.ns-import-file-inp');
    const importStatus = modal.querySelector('.ns-import-status');

    importInp.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      importStatus.style.display = 'block';
      importStatus.className = 'ns-import-status ns-status-loading';
      importStatus.innerText = 'Validating and restoring workspace...';

      try {
        const json = await readJSONFile(file);
        const res = await store.importWorkspaceJSON(json);
        importStatus.className = 'ns-import-status ns-status-success';
        importStatus.innerText = `Successfully restored ${res.pagesCount} pages and ${res.databasesCount} databases!`;
        setTimeout(() => this.close(), 1200);
      } catch (err) {
        importStatus.className = 'ns-import-status ns-status-error';
        importStatus.innerText = `Import failed: ${err.message}`;
      }
    });

    // Reset defaults
    modal.querySelector('.ns-btn-reset-defaults').addEventListener('click', async () => {
      if (confirm('Are you sure you want to reset workspace to starter data? All existing notes will be overwritten.')) {
        await store.resetToDefaults();
        this.close();
      }
    });

    // Close
    modal.querySelector('.ns-modal-close-btn').addEventListener('click', () => this.close());
    this.backdropEl.addEventListener('click', (e) => {
      if (e.target === this.backdropEl) this.close();
    });
  }

  close() {
    if (this.backdropEl) {
      this.backdropEl.remove();
      this.backdropEl = null;
    }
  }
}


  // ==========================================
  // FILE: js/modals/shortcutsModal.js
  // ==========================================
/**
 * NoteSpace - Keyboard Shortcuts Modal Cheatsheet
 */
class ShortcutsModal {
  constructor() {
    this.backdropEl = null;
    this.bindShortcut();
  }

  bindShortcut() {
    window.addEventListener('keydown', (e) => {
      // Shift + ? or Ctrl + /
      if ((e.key === '?' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT' && !document.activeElement.isContentEditable) ||
          ((e.ctrlKey || e.metaKey) && e.key === '/')) {
        e.preventDefault();
        this.open();
      }
    });
  }

  open() {
    document.querySelectorAll('.ns-shortcuts-backdrop').forEach(m => m.remove());

    this.backdropEl = createElement('div', 'ns-modal-backdrop ns-shortcuts-backdrop');
    const modal = createElement('div', 'ns-shortcuts-modal');

    modal.innerHTML = `
      <div class="ns-modal-header">
        <div class="ns-modal-title">
          ${Icons.sparkles}
          <span>Keyboard Shortcuts & Markdown Reference</span>
        </div>
        <button class="ns-modal-close-btn" aria-label="Close">${Icons.x}</button>
      </div>

      <div class="ns-modal-body ns-shortcuts-body">
        
        <div class="ns-shortcuts-grid">
          
          <div class="ns-shortcut-col">
            <div class="ns-sc-group-title">Navigation & Actions</div>
            
            <div class="ns-sc-row">
              <span class="ns-sc-label">Search & Command Palette</span>
              <span class="ns-sc-keys"><kbd>Ctrl</kbd> + <kbd>K</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Toggle Sidebar</span>
              <span class="ns-sc-keys"><kbd>Ctrl</kbd> + <kbd>\\</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Open Shortcuts Cheatsheet</span>
              <span class="ns-sc-keys"><kbd>?</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Close Popup / Modal</span>
              <span class="ns-sc-keys"><kbd>Esc</kbd></span>
            </div>

            <div class="ns-sc-group-title" style="margin-top:16px;">Rich Text Formatting</div>
            
            <div class="ns-sc-row">
              <span class="ns-sc-label">Bold text</span>
              <span class="ns-sc-keys"><kbd>Ctrl</kbd> + <kbd>B</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Italic text</span>
              <span class="ns-sc-keys"><kbd>Ctrl</kbd> + <kbd>I</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Underline text</span>
              <span class="ns-sc-keys"><kbd>Ctrl</kbd> + <kbd>U</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Inline Code</span>
              <span class="ns-sc-keys"><kbd>Ctrl</kbd> + <kbd>E</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Insert Link</span>
              <span class="ns-sc-keys"><kbd>Ctrl</kbd> + <kbd>K</kbd></span>
            </div>
          </div>

          <div class="ns-shortcut-col">
            <div class="ns-sc-group-title">Markdown Shortcuts at line start</div>
            
            <div class="ns-sc-row">
              <span class="ns-sc-label">Heading 1</span>
              <span class="ns-sc-keys"><kbd>#</kbd> <kbd>Space</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Heading 2</span>
              <span class="ns-sc-keys"><kbd>##</kbd> <kbd>Space</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Heading 3</span>
              <span class="ns-sc-keys"><kbd>###</kbd> <kbd>Space</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Bulleted List</span>
              <span class="ns-sc-keys"><kbd>-</kbd> or <kbd>*</kbd> <kbd>Space</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Numbered List</span>
              <span class="ns-sc-keys"><kbd>1.</kbd> <kbd>Space</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">To-do Checklist</span>
              <span class="ns-sc-keys"><kbd>[]</kbd> <kbd>Space</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Quote block</span>
              <span class="ns-sc-keys"><kbd>&gt;</kbd> <kbd>Space</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Divider rule</span>
              <span class="ns-sc-keys"><kbd>---</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Code block</span>
              <span class="ns-sc-keys"><kbd>\`\`\`</kbd></span>
            </div>
            <div class="ns-sc-row">
              <span class="ns-sc-label">Slash Commands Menu</span>
              <span class="ns-sc-keys"><kbd>/</kbd></span>
            </div>
          </div>

        </div>

      </div>
    `;

    this.backdropEl.appendChild(modal);
    document.body.appendChild(this.backdropEl);

    modal.querySelector('.ns-modal-close-btn').addEventListener('click', () => this.close());
    this.backdropEl.addEventListener('click', (e) => {
      if (e.target === this.backdropEl) this.close();
    });
  }

  close() {
    if (this.backdropEl) {
      this.backdropEl.remove();
      this.backdropEl = null;
    }
  }
}


  // ==========================================
  // FILE: js/app.js
  // ==========================================
/**
 * NoteSpace - Main Application Entrypoint
 * Coordinates state initialization, layout mounting, header navbar, shortcuts, and global modals.
 */













class App {
  constructor() {
    this.sidebar = null;
    this.editor = null;
    this.commandPalette = null;
    this.settingsModal = null;
    this.trashModal = null;
    this.historyManager = null;
    this.shortcutsModal = null;
    this.activeDatabaseViews = new Map();
  }

  async start() {
    // 1. Mount Layout DOM immediately so UI shell exists
    this.mountLayout();
    this.setupTopNavbar();

    // 2. Initialize Modals & Palette
    this.settingsModal = new SettingsModal();
    this.trashModal = new TrashModal();
    this.historyManager = new HistoryManager();
    this.shortcutsModal = new ShortcutsModal();

    this.commandPalette = new CommandPalette({
      onOpenSettings: () => this.settingsModal.open(),
      onOpenTrash: () => this.trashModal.open(),
      onOpenHistory: () => {
        const page = store.getActivePage();
        if (page) this.historyManager.open(page.id);
      },
      onExportWorkspace: () => {
        exportWorkspace();
        toast.success('Workspace backup downloaded');
      },
      onExportMarkdown: () => {
        const page = store.getActivePage();
        if (page) {
          exportCurrentPageMarkdown(page.id);
          toast.success('Markdown document exported');
        }
      }
    });

    // 3. Initialize Store & IndexedDB
    try {
      await store.init();
    } catch (e) {
      console.warn('Store init error, proceeding with defaults', e);
    }

    // 4. Apply theme & typography settings
    this.applySettings();

    // 5. Mount Sidebar & Editor
    const sidebarContainer = document.getElementById('ns-sidebar-root');
    const editorContainer = document.getElementById('ns-editor-root');

    this.sidebar = new Sidebar(
      sidebarContainer,
      () => this.commandPalette.open(),
      () => this.settingsModal.open(),
      () => this.trashModal.open(),
      () => {
        const p = store.getActivePage();
        if (p) this.historyManager.open(p.id);
      },
      () => this.shortcutsModal.open()
    );

    this.editor = new Editor(editorContainer, (dbWrap, dbId) => {
      const dbView = new DatabaseView(dbWrap, dbId);
      this.activeDatabaseViews.set(dbWrap, dbView);
    });

    // Load initial active page
    const initialPage = store.getActivePage();
    if (initialPage) {
      this.editor.loadPage(initialPage);
      this.updateHeaderBreadcrumbs(initialPage);
    }

    // Refresh navbar state with active page
    this.setupTopNavbar();

    // Bind reactive events
    this.bindStoreEvents();
  }

  applySettings() {
    const theme = store.getSetting('theme', 'dark');
    const font = store.getSetting('fontFamily', 'sans');
    const fullWidth = store.getSetting('fullWidth', false);

    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-font', font);
    if (fullWidth) document.body.classList.add('canvas-fullwidth');
  }

  mountLayout() {
    const appEl = document.getElementById('app');
    appEl.innerHTML = `
      <div class="ns-app-layout">
        <!-- Sidebar Backdrop for Mobile Screens -->
        <div class="ns-sidebar-mobile-backdrop" id="ns-sidebar-mobile-backdrop"></div>

        <!-- Sidebar Column -->
        <aside class="ns-sidebar" id="ns-sidebar-root"></aside>

        <!-- Main Content Area -->
        <main class="ns-main-viewport">
          <!-- Top Sticky Header Navigation -->
          <header class="ns-top-navbar" id="ns-top-navbar"></header>

          <!-- Document Editor Scroll Area -->
          <div class="ns-editor-scroll-area" id="ns-editor-root"></div>
        </main>
      </div>
    `;

    // Mobile backdrop click to close sidebar
    const mobileBackdrop = document.getElementById('ns-sidebar-mobile-backdrop');
    if (mobileBackdrop) {
      mobileBackdrop.addEventListener('click', () => {
        document.body.classList.add('sidebar-collapsed');
      });
    }
  }

  setupTopNavbar() {
    const navbar = document.getElementById('ns-top-navbar');
    if (!navbar) return;
    const activePage = store.getActivePage();

    navbar.innerHTML = `
      <div class="ns-nav-left">
        <button class="ns-nav-icon-btn ns-btn-toggle-sidebar-nav" title="Toggle Sidebar (Ctrl+\\)" aria-label="Toggle Sidebar">
          ${Icons.sidebar}
        </button>
        <div class="ns-breadcrumbs-trail" id="ns-breadcrumbs-trail"></div>
      </div>

      <div class="ns-nav-right">
        <!-- Save status indicator -->
        <div class="ns-save-indicator" id="ns-save-indicator" title="Changes saved to IndexedDB">
          <span class="ns-save-dot"></span>
          <span class="ns-save-text">Saved</span>
        </div>

        <button class="ns-nav-icon-btn ns-btn-nav-search" title="Search (Ctrl+K)" aria-label="Search">
          ${Icons.search}
        </button>

        <button class="ns-nav-icon-btn ns-btn-star-active-page" title="Toggle Favorite" aria-label="Favorite">
          ${activePage && activePage.isFavorite ? Icons.starFilled : Icons.star}
        </button>

        <button class="ns-nav-icon-btn ns-btn-theme-toggle" title="Toggle Dark/Light Mode" aria-label="Toggle Theme">
          ${store.getSetting('theme', 'dark') === 'dark' ? Icons.sun : Icons.moon}
        </button>

        <button class="ns-nav-icon-btn ns-btn-page-more-nav" title="Page Options" aria-label="Page Options">
          ${Icons.moreHorizontal}
        </button>
      </div>
    `;

    // Sidebar toggle
    const toggleBtn = navbar.querySelector('.ns-btn-toggle-sidebar-nav');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('sidebar-collapsed');
      });
    }

    // Search trigger
    const searchBtn = navbar.querySelector('.ns-btn-nav-search');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        this.commandPalette.open();
      });
    }

    // Favorite toggle
    const starBtn = navbar.querySelector('.ns-btn-star-active-page');
    if (starBtn) {
      starBtn.addEventListener('click', async () => {
        const p = store.getActivePage();
        if (p) {
          const isFav = await store.toggleFavorite(p.id);
          starBtn.innerHTML = isFav ? Icons.starFilled : Icons.star;
          toast.info(isFav ? 'Added to Favorites' : 'Removed from Favorites');
        }
      });
    }

    // Theme toggle
    const themeBtn = navbar.querySelector('.ns-btn-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const cur = store.getSetting('theme', 'dark');
        const next = cur === 'dark' ? 'light' : 'dark';
        store.setSetting('theme', next);
        document.documentElement.setAttribute('data-theme', next);
        themeBtn.innerHTML = next === 'dark' ? Icons.sun : Icons.moon;
        toast.info(`Switched to ${next} theme`);
      });
    }

    // More page actions menu
    const moreBtn = navbar.querySelector('.ns-btn-page-more-nav');
    if (moreBtn) {
      moreBtn.addEventListener('click', () => {
        this.showPageNavMenu(moreBtn);
      });
    }
  }

  updateHeaderBreadcrumbs(page) {
    const container = document.getElementById('ns-breadcrumbs-trail');
    if (!container) return;

    if (!page) {
      container.innerHTML = '';
      return;
    }

    const trail = [];
    let cur = page;
    while (cur) {
      trail.unshift(cur);
      cur = cur.parentId ? store.getPage(cur.parentId) : null;
    }

    container.innerHTML = trail.map((p, idx) => {
      const isLast = idx === trail.length - 1;
      return `
        <button class="ns-crumb-item ${isLast ? 'is-current' : ''}" data-page-id="${p.id}" aria-label="Go to ${escapeHTML(p.title || 'Untitled')}">
          <span class="ns-crumb-icon">${p.icon || '📄'}</span>
          <span class="ns-crumb-title">${escapeHTML(p.title || 'Untitled')}</span>
        </button>
        ${!isLast ? '<span class="ns-crumb-sep">/</span>' : ''}
      `;
    }).join('');

    container.querySelectorAll('.ns-crumb-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.pageId;
        if (id) store.setActivePage(id);
      });
    });

    const starBtn = document.querySelector('.ns-btn-star-active-page');
    if (starBtn) {
      starBtn.innerHTML = page.isFavorite ? Icons.starFilled : Icons.star;
    }
  }

  showPageNavMenu(targetBtn) {
    document.querySelectorAll('.ns-context-menu').forEach(m => m.remove());

    const page = store.getActivePage();
    if (!page) return;

    const menu = createElement('div', 'ns-context-menu');
    menu.innerHTML = `
      <div class="ns-menu-item" data-action="export-md">
        ${Icons.fileText} <span>Export Markdown (.md)</span>
      </div>
      <div class="ns-menu-item" data-action="history">
        ${Icons.history} <span>Version History</span>
      </div>
      <div class="ns-menu-item" data-action="duplicate">
        ${Icons.copy} <span>Duplicate Page</span>
      </div>
      <div class="ns-menu-divider"></div>
      <div class="ns-menu-item ns-menu-danger" data-action="trash">
        ${Icons.trash} <span>Delete to Trash</span>
      </div>
    `;

    document.body.appendChild(menu);
    const rect = targetBtn.getBoundingClientRect();
    menu.style.top = `${rect.bottom + window.scrollY + 6}px`;
    menu.style.left = `${Math.max(10, rect.left + window.scrollX - 160)}px`;

    menu.querySelector('[data-action="export-md"]').addEventListener('click', () => {
      exportCurrentPageMarkdown(page.id);
      toast.success('Exported markdown file');
      menu.remove();
    });

    menu.querySelector('[data-action="history"]').addEventListener('click', () => {
      this.historyManager.open(page.id);
      menu.remove();
    });

    menu.querySelector('[data-action="duplicate"]').addEventListener('click', async () => {
      await store.duplicatePage(page.id);
      toast.success('Page duplicated');
      menu.remove();
    });

    menu.querySelector('[data-action="trash"]').addEventListener('click', async () => {
      await store.moveToTrash(page.id);
      toast.show(`Moved "${page.title || 'Untitled'}" to trash`, 'trash');
      menu.remove();
    });

    const closeHandler = (e) => {
      if (!menu.contains(e.target) && !targetBtn.contains(e.target)) {
        menu.remove();
        document.removeEventListener('click', closeHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 10);
  }

  bindStoreEvents() {
    store.on('active-page-changed', (page) => {
      this.updateHeaderBreadcrumbs(page);
    });

    store.on('page-updated', (page) => {
      if (store.activePageId === page.id) {
        this.updateHeaderBreadcrumbs(page);
      }
    });

    store.on('save-status', (status) => {
      const indicator = document.getElementById('ns-save-indicator');
      if (!indicator) return;

      if (status === 'saving') {
        indicator.className = 'ns-save-indicator is-saving';
        indicator.querySelector('.ns-save-text').innerText = 'Saving...';
      } else if (status === 'error') {
        indicator.className = 'ns-save-indicator is-error';
        indicator.querySelector('.ns-save-text').innerText = 'Save Error';
      } else {
        indicator.className = 'ns-save-indicator is-saved';
        indicator.querySelector('.ns-save-text').innerText = 'Saved';
      }
    });
  }
}

function launchApp() {
  const app = new App();
  app.start().catch(err => {
    console.error('Fatal initialization error:', err);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', launchApp);
} else {
  launchApp();
}


})();
