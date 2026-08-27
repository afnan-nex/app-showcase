/**
 * MapCraft - Standalone Cartography & Map Workstation Bundle
 * Multi-layer interactive map creation with routes, regions, vector glyph markers, measurement, and themes.
 * 100% Client-Side, Zero Backend, Works on HTTP & file:///
 */

(function() {
'use strict';


/* --- MODULE: js/core/icons.js --- */
/**
 * MapCraft - Master SVG & Canvas Icon Registry
 * Crisp cartographic symbols, workstation UI icons, and Canvas 2D path renderers.
 */

const ICONS = {
  // Navigation & Workspace Tools
  select: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l7 18 3-7 7-3L3 3z"></path></svg>`,
  hand: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-4 0v5"></path><path d="M14 10V4a2 2 0 0 0-4 0v7"></path><path d="M10 10.5V6a2 2 0 0 0-4 0v8"></path><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.83L7 15"></path></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
  route: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="3"></circle><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"></path><circle cx="18" cy="5" r="3"></circle></svg>`,
  polygon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l8 5-3 12H7L4 7z"></path></svg>`,
  circle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>`,
  label: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>`,
  ruler: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 8.7L8.7 21.3a2.12 2.12 0 0 1-3 0L2.7 18.3a2.12 2.12 0 0 1 0-3L15.3 2.7a2.12 2.12 0 0 1 3 0l3 3a2.12 2.12 0 0 1 0 3z"></path><line x1="7.5" y1="13.5" x2="9.5" y2="15.5"></line><line x1="10.5" y1="10.5" x2="12.5" y2="12.5"></line><line x1="13.5" y1="7.5" x2="15.5" y2="9.5"></line><line x1="16.5" y1="4.5" x2="18.5" y2="6.5"></line></svg>`,

  // Workstation Actions & History
  undo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>`,
  redo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>`,
  zoomIn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`,
  zoomOut: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`,
  fit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>`,
  grid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>`,
  snap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m8 17 4 4 4-4"></path></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
  legend: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="8" y1="8" x2="16" y2="8"></line><line x1="8" y1="12" x2="16" y2="12"></line><line x1="8" y1="16" x2="12" y2="16"></line></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
  eyeOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`,
  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
  unlock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
  upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
  compass: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>`,
  print: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
  help: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  file: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
  bringForward: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline><line x1="12" y1="12" x2="12" y2="2"></line></svg>`,
  sendBackward: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><line x1="12" y1="2" x2="12" y2="22"></line></svg>`,
  panelLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>`,
  panelRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="15" y1="3" x2="15" y2="21"></line></svg>`,

  // Cartographic Marker Category Symbols
  castle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V9l2-2 2 2V4h3v3l2-2 2 2V4h3v5l2-2 2 2v12H4z"></path><path d="M9 21v-4a3 3 0 0 1 6 0v4"></path></svg>`,
  mountain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"></path></svg>`,
  anchor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"></circle><line x1="12" y1="22" x2="12" y2="8"></line><path d="M5 12H2a10 10 0 0 0 20 0h-3"></path></svg>`,
  camp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21 12 5 5 21h14Z"></path><path d="m12 5 4 16"></path></svg>`,
  skull: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="1"></circle><circle cx="15" cy="12" r="1"></circle><path d="M8 20v2h8v-2"></path><path d="m12.5 17-.5-1-.5 1h1z"></path><path d="M16 20a3 3 0 0 0 1.56-4.56A8 8 0 1 0 6.44 15.44 3 3 0 0 0 8 20z"></path></svg>`,
  treasure: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="14" rx="2"></rect><path d="M2 10h20"></path><path d="M12 10v4"></path></svg>`,
  food: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`,
  hotel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
  tower: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V7l3-3 3 3v15"></path><path d="M12 7l3-3 3 3v15"></path><path d="M4 22h16"></path><path d="M8 12h8"></path><path d="M8 17h8"></path></svg>`,
  flag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>`,
  tree: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19 3.5-3.5H13a5 5 0 0 0-5-5h1a6 6 0 0 0-6-6 6 6 0 0 0 6 6h1a5 5 0 0 0-5 5h2.5L12 19z"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
  portal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="12" rx="9" ry="5"></ellipse><ellipse cx="12" cy="12" rx="5" ry="9"></ellipse><circle cx="12" cy="12" r="2"></circle></svg>`,
  cave: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18v-2a9 9 0 0 0-18 0v2z"></path><path d="M8 20v-2a4 4 0 0 1 8 0v2"></path></svg>`,
  sword: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"></polyline><line x1="13" y1="19" x2="19" y2="13"></line><line x1="16" y1="16" x2="20" y2="20"></line><line x1="19" y1="21" x2="21" y2="19"></line></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
  shieldAlert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
  landmark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="20" x2="22" y2="20"></line><line x1="6" y1="20" x2="6" y2="10"></line><line x1="10" y1="20" x2="10" y2="10"></line><line x1="14" y1="20" x2="14" y2="10"></line><line x1="18" y1="20" x2="18" y2="10"></line><polygon points="12 2 2 10 22 10 12 2"></polygon></svg>`,
  waypoint: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M12 2v3"></path><path d="M12 19v3"></path><path d="M2 12h3"></path><path d="M19 12h3"></path></svg>`
};

const MARKER_ICONS_LIST = [
  { id: 'pin', name: 'Pin', icon: 'pin' },
  { id: 'castle', name: 'Castle / Citadel', icon: 'castle' },
  { id: 'mountain', name: 'Peak / Mountain', icon: 'mountain' },
  { id: 'anchor', name: 'Port / Harbor', icon: 'anchor' },
  { id: 'camp', name: 'Camp / Outpost', icon: 'camp' },
  { id: 'skull', name: 'Danger / Dungeon', icon: 'skull' },
  { id: 'treasure', name: 'Treasure / Relic', icon: 'treasure' },
  { id: 'tower', name: 'Watchtower / Spire', icon: 'tower' },
  { id: 'flag', name: 'Capital / Settlement', icon: 'flag' },
  { id: 'tree', name: 'Sanctuary / Grove', icon: 'tree' },
  { id: 'cave', name: 'Cavern / Mine', icon: 'cave' },
  { id: 'portal', name: 'Gateway / Portal', icon: 'portal' },
  { id: 'star', name: 'Special POI', icon: 'star' },
  { id: 'sword', name: 'Battlefield', icon: 'sword' },
  { id: 'shield', name: 'Fortress', icon: 'shield' },
  { id: 'shieldAlert', name: 'Hazard Zone', icon: 'shieldAlert' },
  { id: 'landmark', name: 'Monument', icon: 'landmark' },
  { id: 'food', name: 'Tavern / Dining', icon: 'food' },
  { id: 'hotel', name: 'Inn / Shelter', icon: 'hotel' },
  { id: 'waypoint', name: 'Waypoint Node', icon: 'waypoint' }
];

function getIcon(name, extraClass = '') {
  const svg = ICONS[name] || ICONS.pin;
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

/**
 * Draws crisp vector glyphs inside marker pins on Canvas 2D
 */
function drawMarkerGlyph(ctx, iconName, x, y, scale = 1, color = '#ffffff') {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  switch (iconName) {
    case 'castle':
      ctx.beginPath();
      ctx.moveTo(-5, 5); ctx.lineTo(-5, -2); ctx.lineTo(-3, -4); ctx.lineTo(-3, -1);
      ctx.lineTo(0, -4); ctx.lineTo(3, -1); ctx.lineTo(3, -4); ctx.lineTo(5, -2); ctx.lineTo(5, 5);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-2, 5); ctx.lineTo(-2, 2); ctx.arc(0, 2, 2, Math.PI, 0); ctx.lineTo(2, 5);
      ctx.stroke();
      break;

    case 'mountain':
      ctx.beginPath();
      ctx.moveTo(-6, 5); ctx.lineTo(-1, -5); ctx.lineTo(2, 0); ctx.lineTo(6, 5);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-3, 0); ctx.lineTo(0, 2); ctx.lineTo(3, 0);
      ctx.stroke();
      break;

    case 'anchor':
      ctx.beginPath();
      ctx.arc(0, -3.5, 1.8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -1.7); ctx.lineTo(0, 5);
      ctx.moveTo(-3, 0.5); ctx.lineTo(3, 0.5);
      ctx.moveTo(-5, 2.5); ctx.arc(0, 2.5, 5, Math.PI, 0, true);
      ctx.stroke();
      break;

    case 'camp':
      ctx.beginPath();
      ctx.moveTo(0, -5); ctx.lineTo(5, 5); ctx.lineTo(-5, 5);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -5); ctx.lineTo(2, 5);
      ctx.stroke();
      break;

    case 'star':
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const outerAngle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const ox = Math.cos(outerAngle) * 5.5;
        const oy = Math.sin(outerAngle) * 5.5;
        if (i === 0) ctx.moveTo(ox, oy);
        else ctx.lineTo(ox, oy);
      }
      ctx.closePath();
      ctx.fill();
      break;

    case 'tower':
      ctx.beginPath();
      ctx.moveTo(-4, 5); ctx.lineTo(-3, -3); ctx.lineTo(-5, -5); ctx.lineTo(5, -5); ctx.lineTo(3, -3); ctx.lineTo(4, 5);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-2, 0); ctx.lineTo(2, 0);
      ctx.moveTo(-2, 3); ctx.lineTo(2, 3);
      ctx.stroke();
      break;

    case 'flag':
      ctx.beginPath();
      ctx.moveTo(-4, -5); ctx.lineTo(4, -2.5); ctx.lineTo(-4, 0);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-4, -5); ctx.lineTo(-4, 5);
      ctx.stroke();
      break;

    case 'skull':
      ctx.beginPath();
      ctx.arc(0, -1.5, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(-1.5, -2, 1, 0, Math.PI * 2);
      ctx.arc(1.5, -2, 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(-1.5, 1.5, 3, 2);
      break;

    case 'treasure':
      ctx.beginPath();
      ctx.rect(-4.5, -3, 9, 7);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-4.5, -0.5); ctx.lineTo(4.5, -0.5);
      ctx.moveTo(0, -0.5); ctx.lineTo(0, 1.5);
      ctx.stroke();
      break;

    case 'food':
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-4, 0); ctx.lineTo(4, 0);
      ctx.moveTo(0, 0); ctx.lineTo(0, 4);
      ctx.moveTo(-2, 4); ctx.lineTo(2, 4);
      ctx.stroke();
      break;

    case 'hotel':
    case 'landmark':
      ctx.beginPath();
      ctx.moveTo(0, -5); ctx.lineTo(5, 0); ctx.lineTo(5, 5); ctx.lineTo(-5, 5); ctx.lineTo(-5, 0);
      ctx.closePath();
      ctx.stroke();
      ctx.fillRect(-1.5, 1.5, 3, 3.5);
      break;

    case 'portal':
      ctx.beginPath();
      ctx.ellipse(0, 0, 5, 2.5, 0, 0, Math.PI * 2);
      ctx.ellipse(0, 0, 2.5, 5, 0, 0, Math.PI * 2);
      ctx.stroke();
      break;

    case 'tree':
      ctx.beginPath();
      ctx.moveTo(0, -5); ctx.lineTo(4, -1); ctx.lineTo(2, -1); ctx.lineTo(5, 3); ctx.lineTo(-5, 3); ctx.lineTo(-2, -1); ctx.lineTo(-4, -1);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(-1, 3, 2, 2.5);
      break;

    case 'sword':
      ctx.beginPath();
      ctx.moveTo(-4, 4); ctx.lineTo(4, -4);
      ctx.moveTo(-2, 4); ctx.lineTo(-4, 2);
      ctx.moveTo(-3, 5); ctx.lineTo(-5, 3);
      ctx.stroke();
      break;

    case 'shield':
    case 'shieldAlert':
      ctx.beginPath();
      ctx.moveTo(-4, -4); ctx.lineTo(4, -4); ctx.lineTo(4, 0);
      ctx.quadraticCurveTo(4, 5, 0, 5.5);
      ctx.quadraticCurveTo(-4, 5, -4, 0);
      ctx.closePath();
      ctx.stroke();
      break;

    case 'waypoint':
      ctx.beginPath();
      ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, -5); ctx.lineTo(0, -3);
      ctx.moveTo(0, 3); ctx.lineTo(0, 5);
      ctx.moveTo(-5, 0); ctx.lineTo(-3, 0);
      ctx.moveTo(3, 0); ctx.lineTo(5, 0);
      ctx.stroke();
      break;

    case 'pin':
    default:
      ctx.beginPath();
      ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
      ctx.fill();
      break;
  }

  ctx.restore();
}

ICONS;


/* --- MODULE: js/core/math.js --- */
/**
 * MapCraft - Cartographic & Geometry Math Engine
 * Distance calculation, Shoelace polygon area, point-in-polygon, snap-to-grid, and scale conversions.
 */

function calculateDistance(p1, p2) {
  if (!p1 || !p2) return 0;
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

function calculatePolylineLength(points) {
  if (!points || points.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    total += calculateDistance(points[i], points[i + 1]);
  }
  return total;
}

// Shoelace formula for polygon area
function calculatePolygonArea(points) {
  if (!points || points.length < 3) return 0;
  let area = 0;
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  return Math.abs(area) / 2;
}

// Ray-casting algorithm for Point in Polygon
function pointInPolygon(point, polygon) {
  if (!polygon || polygon.length < 3) return false;
  let inside = false;
  const x = point.x, y = point.y;
  const n = polygon.length;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;

    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}

// Distance from point P to line segment AB
function distanceToSegment(p, a, b) {
  const l2 = Math.hypot(b.x - a.x, b.y - a.y) ** 2;
  if (l2 === 0) return calculateDistance(p, a);

  let t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l2;
  t = Math.max(0, Math.min(1, t));

  const projX = a.x + t * (b.x - a.x);
  const projY = a.y + t * (b.y - a.y);
  return Math.hypot(p.x - projX, p.y - projY);
}

function pointNearPolyline(p, points, threshold = 8) {
  if (!points || points.length < 2) return false;
  for (let i = 0; i < points.length - 1; i++) {
    if (distanceToSegment(p, points[i], points[i + 1]) <= threshold) {
      return true;
    }
  }
  return false;
}

// Heading angle from p1 to p2 in degrees (0° = North, 90° = East, etc.)
function calculateBearing(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  let angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
  if (angle < 0) angle += 360;
  return Math.round(angle);
}

// Snap world coordinate to square grid or hex grid
function snapToGrid(x, y, gridSize = 50, gridType = 'square') {
  if (!gridSize || gridSize <= 0) return { x, y };

  if (gridType === 'square' || gridType === 'dot') {
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize
    };
  }

  if (gridType === 'hex') {
    // Flat-topped hex grid snapping
    const h = gridSize * Math.sqrt(3);
    const col = Math.round(x / (gridSize * 1.5));
    const rowOffset = (col % 2 !== 0) ? h / 2 : 0;
    const row = Math.round((y - rowOffset) / h);
    return {
      x: col * gridSize * 1.5,
      y: row * h + rowOffset
    };
  }

  return { x, y };
}

/**
 * Scaled Units Formatter
 * scaleRatio: How many real-world units per 100 pixels (e.g. 100px = 10 km)
 */
function formatScaledDistance(pixels, scaleRatio = 10, unit = 'km') {
  const realUnits = (pixels / 100) * scaleRatio;
  if (unit === 'km') {
    if (realUnits < 1) {
      return `${Math.round(realUnits * 1000)} m`;
    }
    return `${realUnits.toFixed(1)} km`;
  }
  if (unit === 'mi') {
    if (realUnits < 0.1) {
      return `${Math.round(realUnits * 5280)} ft`;
    }
    return `${realUnits.toFixed(1)} mi`;
  }
  if (unit === 'm') {
    return `${Math.round(realUnits)} m`;
  }
  if (unit === 'ft') {
    return `${Math.round(realUnits)} ft`;
  }
  if (unit === 'nm' || unit === 'nmi') {
    return `${realUnits.toFixed(1)} nm`;
  }
  if (unit === 'leagues') {
    return `${realUnits.toFixed(1)} leagues`;
  }
  if (unit === 'hexes') {
    return `${(realUnits).toFixed(1)} hex`;
  }
  return `${Math.round(realUnits)} ${unit}`;
}

function formatScaledArea(pixelArea, scaleRatio = 10, unit = 'km') {
  // Area scaling is squared: (pixels / 100)^2 * scaleRatio^2
  const realUnitsSq = ((Math.sqrt(pixelArea) / 100) * scaleRatio) ** 2;
  if (unit === 'km') {
    if (realUnitsSq < 0.1) {
      return `${Math.round(realUnitsSq * 1000000)} m²`;
    }
    return `${realUnitsSq.toFixed(1)} km²`;
  }
  if (unit === 'mi') {
    return `${realUnitsSq.toFixed(1)} sq mi`;
  }
  if (unit === 'm') {
    return `${Math.round(realUnitsSq)} m²`;
  }
  if (unit === 'ft') {
    return `${Math.round(realUnitsSq)} sq ft`;
  }
  if (unit === 'nm' || unit === 'nmi') {
    return `${realUnitsSq.toFixed(1)} sq nm`;
  }
  if (unit === 'leagues') {
    return `${realUnitsSq.toFixed(1)} sq leagues`;
  }
  return `${Math.round(realUnitsSq)} sq ${unit}`;
}


/* --- MODULE: js/core/db.js --- */
/**
 * MapCraft - IndexedDB Persistence Engine
 * Saves cartography projects, custom themes, and user settings locally.
 */

const DB_NAME = 'MapCraft_DB';
const DB_VERSION = 1;
const STORES = {
  PROJECTS: 'map_projects',
  SETTINGS: 'settings'
};

class MapDatabase {
  constructor() {
    this.db = null;
  }

  async init() {
    if (typeof indexedDB === 'undefined') return;

    return new Promise((resolve) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORES.PROJECTS)) {
          db.createObjectStore(STORES.PROJECTS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
        }
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };

      request.onerror = () => {
        console.warn('IndexedDB unavailable, using LocalStorage fallback.');
        resolve(null);
      };
    });
  }

  async saveProject(project) {
    if (!project || !project.id) return;
    project.updatedAt = new Date().toISOString();

    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction([STORES.PROJECTS], 'readwrite');
        tx.objectStore(STORES.PROJECTS).put(project);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    }

    try {
      localStorage.setItem('mapcraft_project_' + project.id, JSON.stringify(project));
      localStorage.setItem('mapcraft_last_project_id', project.id);
    } catch (e) {}
  }

  async loadProject(id) {
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction([STORES.PROJECTS], 'readonly');
        const req = tx.objectStore(STORES.PROJECTS).get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    }

    try {
      const raw = localStorage.getItem('mapcraft_project_' + id);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  async getAllProjects() {
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction([STORES.PROJECTS], 'readonly');
        const req = tx.objectStore(STORES.PROJECTS).getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    }

    const list = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('mapcraft_project_')) {
          list.push(JSON.parse(localStorage.getItem(key)));
        }
      }
    } catch (e) {}
    return list;
  }
}

const db = new MapDatabase();
db;


/* --- MODULE: js/engine/themes.js --- */
/**
 * MapCraft - Cartographic Themes & Styling Engine
 * 7 distinct professional cartographic themes with tuned color palettes, grids, and typography styles.
 */

const MAP_THEMES = {
  parchment: {
    id: 'parchment',
    name: 'Vintage Parchment',
    description: 'Antique fantasy & historical cartography with sepia warmth.',
    bgColor: '#f2e6cf',
    gridColor: 'rgba(92, 64, 51, 0.08)',
    textColor: '#3b2512',
    textHaloColor: '#f7eedc',
    accentColor: '#8b4513',
    defaultRouteColor: '#7b3f00',
    defaultRegionColor: '#c9a87c',
    selectionColor: '#b45309',
    fontFamily: "'Cinzel', 'Georgia', serif"
  },
  dark: {
    id: 'dark',
    name: 'Dark Slate Tactical',
    description: 'Modern tactical night cartography with high contrast.',
    bgColor: '#0f141c',
    gridColor: 'rgba(255, 255, 255, 0.07)',
    textColor: '#f1f5f9',
    textHaloColor: '#0f141c',
    accentColor: '#38bdf8',
    defaultRouteColor: '#0284c7',
    defaultRegionColor: '#0369a1',
    selectionColor: '#38bdf8',
    fontFamily: "'Inter', sans-serif"
  },
  blueprint: {
    id: 'blueprint',
    name: 'Architectural Blueprint',
    description: 'Precision engineering grid with cyan drafting aesthetics.',
    bgColor: '#0b2038',
    gridColor: 'rgba(100, 223, 223, 0.16)',
    textColor: '#e0fbfc',
    textHaloColor: '#0b2038',
    accentColor: '#64dfdf',
    defaultRouteColor: '#48cae4',
    defaultRegionColor: '#0077b6',
    selectionColor: '#64dfdf',
    fontFamily: "'JetBrains Mono', monospace"
  },
  clean: {
    id: 'clean',
    name: 'Clean Modern Editorial',
    description: 'Minimalist editorial atlas suitable for travel and urban guides.',
    bgColor: '#f8fafc',
    gridColor: 'rgba(15, 23, 42, 0.06)',
    textColor: '#0f172a',
    textHaloColor: '#ffffff',
    accentColor: '#2563eb',
    defaultRouteColor: '#dc2626',
    defaultRegionColor: '#38bdf8',
    selectionColor: '#2563eb',
    fontFamily: "'Inter', sans-serif"
  },
  terrain: {
    id: 'terrain',
    name: 'Topographic Wilderness',
    description: 'Natural forest greens, elevation contours, and earth tones.',
    bgColor: '#e8f0ec',
    gridColor: 'rgba(45, 106, 79, 0.09)',
    textColor: '#1b4332',
    textHaloColor: '#e8f0ec',
    accentColor: '#2d6a4f',
    defaultRouteColor: '#b91c1c',
    defaultRegionColor: '#52b788',
    selectionColor: '#2d6a4f',
    fontFamily: "'Inter', sans-serif"
  },
  nautical: {
    id: 'nautical',
    name: 'Nautical Sea Chart',
    description: 'Maritime navigation chart with oceanic navy and compass lines.',
    bgColor: '#e3ebf0',
    gridColor: 'rgba(30, 70, 100, 0.10)',
    textColor: '#0c2340',
    textHaloColor: '#edf3f7',
    accentColor: '#005f73',
    defaultRouteColor: '#ae2012',
    defaultRegionColor: '#94d2bd',
    selectionColor: '#0a9396',
    fontFamily: "'Cinzel', serif"
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    description: 'High-contrast glowing synthwave palette on obsidian black.',
    bgColor: '#090a0f',
    gridColor: 'rgba(247, 37, 133, 0.12)',
    textColor: '#f72585',
    textHaloColor: '#090a0f',
    accentColor: '#4cc9f0',
    defaultRouteColor: '#7209b7',
    defaultRegionColor: '#3a0ca3',
    selectionColor: '#4cc9f0',
    fontFamily: "'JetBrains Mono', monospace"
  }
};

function getTheme(themeId = 'parchment') {
  return MAP_THEMES[themeId] || MAP_THEMES.parchment;
}


/* --- MODULE: js/engine/renderer.js --- */
/**
 * MapCraft - High-DPI Canvas 2D Cartography Renderer
 * Renders multi-layer maps: vector-glyph markers, styled routes, patterned regions,
 * halo typography, hex/square grids, adaptive scale bars, and real-time measurement tools.
 */





class MapRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = { x: 0, y: 0, zoom: 1 };
    this.dpr = window.devicePixelRatio || 1;
  }

  resize(cssWidth, cssHeight) {
    this.dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.round(cssWidth * this.dpr);
    this.canvas.height = Math.round(cssHeight * this.dpr);
    this.canvas.style.width = cssWidth + 'px';
    this.canvas.style.height = cssHeight + 'px';
  }

  render({
    project,
    activeLayerId,
    selectedObjectId,
    selectedVertexIndex = null,
    hoveredObjectId,
    activeDrawing,
    scaleRatio = 10,
    scaleUnit = 'km',
    themeId = 'parchment',
    gridType = 'square',
    gridSize = 50,
    showGrid = true,
    showCompass = true,
    showScaleRuler = true
  }) {
    const ctx = this.ctx;
    const theme = getTheme(themeId || project.themeId);
    const dpr = this.dpr;
    const w = this.canvas.width / dpr;
    const h = this.canvas.height / dpr;

    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. Clear & Paint Theme Background
    ctx.fillStyle = theme.bgColor;
    ctx.fillRect(0, 0, w, h);

    // 2. Cartographic Grid Overlay
    if (showGrid && gridType !== 'none') {
      this.drawGrid(theme, gridType || project.gridType || 'square', gridSize || project.gridSize || 50, w, h);
    }

    ctx.save();
    // 3. Apply Camera Transform (Pan & Zoom)
    ctx.translate(this.camera.x, this.camera.y);
    ctx.scale(this.camera.zoom, this.camera.zoom);

    // 4. Render Layers in Order
    const layers = project.layers || [];
    for (const layer of layers) {
      if (layer.visible === false) continue;

      const layerObjects = (project.objects || []).filter(o => o.layerId === layer.id);

      for (const obj of layerObjects) {
        if (obj.visible === false) continue;
        const isSelected = obj.id === selectedObjectId;
        const isHovered = obj.id === hoveredObjectId;
        this.renderMapObject(obj, theme, isSelected, isHovered, scaleRatio, scaleUnit, selectedVertexIndex);
      }
    }

    // 5. Render Active Drawing Preview
    if (activeDrawing) {
      this.renderActiveDrawing(activeDrawing, theme, scaleRatio, scaleUnit);
    }

    ctx.restore();

    // 6. Viewport Overlays (Compass Rose & Dynamic Scale Bar)
    if (showCompass) {
      this.drawCompassRose(theme, w, h);
    }
    if (showScaleRuler) {
      this.drawScaleRuler(scaleRatio, scaleUnit, theme, w, h);
    }

    ctx.restore();
  }

  // --- Grid Drawing ---
  drawGrid(theme, gridType, baseGridSize, w, h) {
    const ctx = this.ctx;
    const size = baseGridSize * this.camera.zoom;
    if (size < 12) return; // Prevent dense grid lag at extreme zoom-out

    ctx.save();
    ctx.strokeStyle = theme.gridColor;
    ctx.fillStyle = theme.gridColor;
    ctx.lineWidth = 1;

    if (gridType === 'dot') {
      const startX = (this.camera.x % size);
      const startY = (this.camera.y % size);
      for (let x = startX; x < w; x += size) {
        for (let y = startY; y < h; y += size) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (gridType === 'hex') {
      this.drawHexGrid(theme, size, w, h);
    } else {
      // Standard Square Grid
      const startX = (this.camera.x % size);
      const startY = (this.camera.y % size);

      ctx.beginPath();
      for (let x = startX; x < w; x += size) {
        ctx.moveTo(x, 0); ctx.lineTo(x, h);
      }
      for (let y = startY; y < h; y += size) {
        ctx.moveTo(0, y); ctx.lineTo(w, y);
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  drawHexGrid(theme, hexRadius, w, h) {
    const ctx = this.ctx;
    const r = hexRadius;
    const hexH = Math.sqrt(3) * r;
    const hexW = 1.5 * r;

    const startCol = Math.floor(-this.camera.x / hexW) - 1;
    const endCol = Math.ceil((w - this.camera.x) / hexW) + 1;
    const startRow = Math.floor(-this.camera.y / hexH) - 1;
    const endRow = Math.ceil((h - this.camera.y) / hexH) + 1;

    ctx.beginPath();
    for (let c = startCol; c <= endCol; c++) {
      const cx = c * hexW + this.camera.x;
      const yOffset = (c % 2 !== 0 ? hexH / 2 : 0);
      for (let row = startRow; row <= endRow; row++) {
        const cy = row * hexH + yOffset + this.camera.y;

        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 180) * (60 * i);
          const px = cx + r * Math.cos(angle);
          const py = cy + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
      }
    }
    ctx.stroke();
  }

  // --- Dispatcher ---
  renderMapObject(obj, theme, isSelected, isHovered, scaleRatio, scaleUnit, selectedVertexIndex) {
    switch (obj.type) {
      case 'region':
        this.drawRegion(obj, theme, isSelected, isHovered);
        break;
      case 'circle':
        this.drawCircle(obj, theme, isSelected, isHovered);
        break;
      case 'route':
        this.drawRoute(obj, theme, isSelected, isHovered);
        break;
      case 'marker':
        this.drawMarker(obj, theme, isSelected, isHovered);
        break;
      case 'label':
        this.drawLabel(obj, theme, isSelected, isHovered);
        break;
    }

    if (isSelected) {
      this.drawSelectionHandles(obj, theme, selectedVertexIndex);
    }
  }

  // --- 1. Region (Polygon) ---
  drawRegion(obj, theme, isSelected, isHovered) {
    const pts = obj.points || [];
    if (pts.length < 3) return;

    const ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.closePath();

    // Fill
    ctx.globalAlpha = obj.opacity !== undefined ? obj.opacity : 0.35;
    ctx.fillStyle = obj.fillColor || theme.defaultRegionColor;
    ctx.fill();

    // Optional Hatching Pattern
    if (obj.pattern === 'hatch') {
      this.drawHatchPattern(pts, obj.strokeColor || obj.fillColor || theme.accentColor);
    }

    // Stroke
    ctx.globalAlpha = isHovered ? 1.0 : (obj.opacity !== undefined ? Math.min(1.0, obj.opacity + 0.3) : 0.8);
    ctx.strokeStyle = obj.strokeColor || obj.fillColor || theme.accentColor;
    ctx.lineWidth = (obj.strokeWidth || 2);
    if (obj.strokeDash === 'dashed') ctx.setLineDash([8, 6]);
    if (obj.strokeDash === 'dotted') ctx.setLineDash([3, 5]);
    ctx.stroke();

    // Region Name Label in Center
    if (obj.name) {
      const center = this.getPolygonCenter(pts);
      this.drawHaloText(obj.name, center.x, center.y, {
        fontSize: obj.fontSize || 13,
        fontFamily: obj.fontFamily || theme.fontFamily,
        color: obj.labelColor || theme.textColor,
        haloColor: theme.textHaloColor,
        isBold: true
      });
    }

    ctx.restore();
  }

  drawHatchPattern(pts, color) {
    const ctx = this.ctx;
    ctx.save();
    ctx.clip();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.25;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    pts.forEach(p => {
      minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
    });

    const step = 14;
    for (let x = minX - (maxY - minY); x < maxX; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, minY);
      ctx.lineTo(x + (maxY - minY), maxY);
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- 2. Circle Zone ---
  drawCircle(obj, theme, isSelected, isHovered) {
    const ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.radius || 50, 0, Math.PI * 2);

    ctx.globalAlpha = obj.opacity !== undefined ? obj.opacity : 0.32;
    ctx.fillStyle = obj.fillColor || theme.defaultRegionColor;
    ctx.fill();

    ctx.globalAlpha = isHovered ? 1.0 : 0.85;
    ctx.strokeStyle = obj.strokeColor || obj.fillColor || theme.accentColor;
    ctx.lineWidth = obj.strokeWidth || 2;
    if (obj.strokeDash === 'dashed') ctx.setLineDash([6, 6]);
    ctx.stroke();

    if (obj.name) {
      this.drawHaloText(obj.name, obj.x, obj.y, {
        fontSize: 13,
        fontFamily: theme.fontFamily,
        color: theme.textColor,
        haloColor: theme.textHaloColor,
        isBold: true
      });
    }

    ctx.restore();
  }

  // --- 3. Route (Polyline) ---
  drawRoute(obj, theme, isSelected, isHovered) {
    const pts = obj.points || [];
    if (pts.length < 2) return;

    const ctx = this.ctx;
    ctx.save();

    const color = obj.color || theme.defaultRouteColor;
    const width = (obj.width || 3.5) * (isHovered ? 1.3 : 1);

    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (obj.style === 'dashed') ctx.setLineDash([10, 7]);
    if (obj.style === 'dotted') ctx.setLineDash([3, 6]);

    if (obj.style === 'railroad') {
      // Draw track rails
      ctx.stroke();
      this.drawRailroadTies(pts, color, width);
    } else {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.stroke();
    }

    // Directional Arrow at route terminus if requested
    if (obj.hasArrow !== false && pts.length >= 2) {
      const pLast = pts[pts.length - 1];
      const pPrev = pts[pts.length - 2];
      const angle = Math.atan2(pLast.y - pPrev.y, pLast.x - pPrev.x);
      this.drawArrowhead(ctx, pLast.x, pLast.y, angle, width * 2.5, color);
    }

    // Waypoint nodes
    for (let i = 0; i < pts.length; i++) {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pts[i].x, pts[i].y, i === 0 || i === pts.length - 1 ? 5 : 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Route Label at midpoint
    if (obj.name) {
      const midIdx = Math.floor(pts.length / 2);
      const mid = pts[midIdx];
      this.drawHaloText(obj.name, mid.x, mid.y - 12, {
        fontSize: 11.5,
        fontFamily: theme.fontFamily,
        color: theme.textColor,
        haloColor: theme.textHaloColor,
        isBold: true
      });
    }

    ctx.restore();
  }

  drawRailroadTies(pts, color, width) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    const tieSpacing = 16;
    const tieLen = width * 2.2;

    for (let i = 0; i < pts.length - 1; i++) {
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const segLen = calculateDistance(p1, p2);
      const steps = Math.floor(segLen / tieSpacing);
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      const perpAngle = angle + Math.PI / 2;

      for (let s = 1; s <= steps; s++) {
        const t = (s * tieSpacing) / segLen;
        const tx = p1.x + t * (p2.x - p1.x);
        const ty = p1.y + t * (p2.y - p1.y);
        ctx.beginPath();
        ctx.moveTo(tx - Math.cos(perpAngle) * tieLen / 2, ty - Math.sin(perpAngle) * tieLen / 2);
        ctx.lineTo(tx + Math.cos(perpAngle) * tieLen / 2, ty + Math.sin(perpAngle) * tieLen / 2);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  drawArrowhead(ctx, x, y, angle, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-size, -size / 2);
    ctx.lineTo(-size * 0.7, 0);
    ctx.lineTo(-size, size / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // --- 4. Marker Pin & Glyph ---
  drawMarker(obj, theme, isSelected, isHovered) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(obj.x, obj.y);

    const size = (obj.size || 28) * (isHovered ? 1.15 : 1);
    const color = obj.color || theme.accentColor;

    // Pin Drop Shadow
    ctx.shadowColor = 'rgba(0,0,0,0.38)';
    ctx.shadowBlur = 7;
    ctx.shadowOffsetY = 3;

    // Tear-Drop Cartographic Pin Body
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, -size / 2, size / 2, Math.PI, 0, false);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    // Inner White Disk for Glyph
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -size / 2, size / 3, 0, Math.PI * 2);
    ctx.fill();

    // Vector Icon Glyph inside disk
    const glyphScale = (size / 30);
    drawMarkerGlyph(ctx, obj.icon || 'pin', 0, -size / 2, glyphScale, color);

    // Marker Label below
    if (obj.name && obj.hideLabel !== true) {
      this.drawHaloText(obj.name, 0, 15, {
        fontSize: 12,
        fontFamily: theme.fontFamily,
        color: theme.textColor,
        haloColor: theme.textHaloColor,
        isBold: true
      });
    }

    ctx.restore();
  }

  // --- 5. Rich Halo Label ---
  drawLabel(obj, theme, isSelected, isHovered) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(obj.x, obj.y);
    if (obj.rotation) ctx.rotate((obj.rotation * Math.PI) / 180);

    this.drawHaloText(obj.text || 'Label', 0, 0, {
      fontSize: obj.fontSize || 16,
      fontFamily: obj.fontFamily || theme.fontFamily,
      color: obj.color || theme.textColor,
      haloColor: theme.textHaloColor,
      isBold: obj.isBold !== false
    });

    ctx.restore();
  }

  // --- Halo Text Rendering ---
  drawHaloText(text, x, y, { fontSize = 13, fontFamily = "'Inter', sans-serif", color = '#000000', haloColor = '#ffffff', isBold = false }) {
    const ctx = this.ctx;
    ctx.font = `${isBold ? 'bold ' : ''}${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Halo stroke for contrast
    ctx.strokeStyle = haloColor;
    ctx.lineWidth = Math.max(3.5, fontSize / 3.2);
    ctx.lineJoin = 'round';
    ctx.miterLimit = 2;
    ctx.strokeText(text, x, y);

    // Foreground text
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }

  // --- Active Drawing Preview ---
  renderActiveDrawing(drawing, theme, scaleRatio, scaleUnit) {
    const ctx = this.ctx;
    const pts = drawing.points || [];

    if (drawing.type === 'measure') {
      if (pts.length < 2) return;
      ctx.save();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 5]);

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Individual segment distance label
        if (i > 0) {
          const prev = pts[i - 1];
          const segDist = calculateDistance(prev, p);
          const segDistStr = formatScaledDistance(segDist, scaleRatio, scaleUnit);
          const midX = (prev.x + p.x) / 2;
          const midY = (prev.y + p.y) / 2;
          const bearing = calculateBearing(prev, p);
          this.drawHaloText(`${segDistStr} (${bearing}°)`, midX, midY - 10, { fontSize: 11, color: '#ef4444', haloColor: '#ffffff', isBold: true });
        }
      }

      // Live Total Badge at mouse point
      const last = pts[pts.length - 1];
      const dist = formatScaledDistance(drawing.totalDist || 0, scaleRatio, scaleUnit);
      let badgeText = `Total: ${dist}`;
      if (drawing.totalArea && pts.length >= 3) {
        badgeText += ` | Area: ${formatScaledArea(drawing.totalArea, scaleRatio, scaleUnit)}`;
      }
      this.drawHaloText(badgeText, last.x, last.y - 24, { fontSize: 12.5, color: '#b91c1c', haloColor: '#ffffff', isBold: true });
      ctx.restore();
    }

    else if (drawing.type === 'route' && pts.length > 0) {
      ctx.save();
      ctx.strokeStyle = theme.defaultRouteColor;
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
      ctx.restore();
    }

    else if (drawing.type === 'region' && pts.length > 0) {
      ctx.save();
      ctx.strokeStyle = theme.accentColor;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }

  // --- Selection Handles & Vertex Reshaping ---
  drawSelectionHandles(obj, theme, selectedVertexIndex = null) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = theme.selectionColor || '#38bdf8';
    ctx.lineWidth = 2 / this.camera.zoom;
    ctx.fillStyle = '#ffffff';

    if (obj.points) {
      for (let i = 0; i < obj.points.length; i++) {
        const p = obj.points[i];
        const isVertexSelected = i === selectedVertexIndex;
        ctx.fillStyle = isVertexSelected ? theme.accentColor : '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, (isVertexSelected ? 6.5 : 4.5) / this.camera.zoom, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    } else if (obj.type === 'circle') {
      // Radius handle at 3 o'clock position
      const rx = obj.x + (obj.radius || 50);
      const ry = obj.y;
      ctx.fillStyle = theme.accentColor;
      ctx.beginPath();
      ctx.arc(rx, ry, 5 / this.camera.zoom, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (obj.x !== undefined && obj.y !== undefined) {
      const size = obj.size || 28;
      ctx.strokeRect(obj.x - size / 2 - 4, obj.y - size - 4, size + 8, size + 16);
    }

    ctx.restore();
  }

  // --- Compass Rose ---
  drawCompassRose(theme, w, h) {
    const ctx = this.ctx;
    const cx = w - 46;
    const cy = 46;
    const r = 26;

    ctx.save();
    ctx.translate(cx, cy);

    // North Star Point
    ctx.fillStyle = theme.accentColor;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r / 3.5, 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(-r / 3.5, 0);
    ctx.closePath();
    ctx.fill();

    // South Star Point
    ctx.fillStyle = theme.textColor;
    ctx.beginPath();
    ctx.moveTo(0, r);
    ctx.lineTo(r / 3.5, 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(-r / 3.5, 0);
    ctx.closePath();
    ctx.fill();

    // East / West Minor Points
    ctx.fillStyle = theme.gridColor;
    ctx.beginPath();
    ctx.moveTo(r * 0.7, 0);
    ctx.lineTo(0, r / 4);
    ctx.lineTo(0, -r / 4);
    ctx.closePath();
    ctx.moveTo(-r * 0.7, 0);
    ctx.lineTo(0, r / 4);
    ctx.lineTo(0, -r / 4);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = theme.textColor;
    ctx.font = "bold 11px 'Inter', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('N', 0, -r - 2);

    ctx.restore();
  }

  // --- Dynamic Scale Bar ---
  drawScaleRuler(scaleRatio, unit, theme, w, h) {
    const ctx = this.ctx;
    const targetPx = 120 * this.camera.zoom;
    const realUnits = (targetPx / 100) * scaleRatio;

    // Round to convenient cartographic increments (1, 2, 5, 10, 25, 50, 100, 250, 500, etc.)
    const niceUnits = this.getNiceNumber(realUnits);
    const actualPx = (niceUnits / scaleRatio) * 100 * this.camera.zoom;

    const x = 24;
    const y = h - 22;

    ctx.save();
    ctx.strokeStyle = theme.textColor;
    ctx.lineWidth = 2;

    // Ruler line with ticks
    ctx.beginPath();
    ctx.moveTo(x, y - 6); ctx.lineTo(x, y);
    ctx.lineTo(x + actualPx, y);
    ctx.lineTo(x + actualPx, y - 6);
    // Midpoint tick
    ctx.moveTo(x + actualPx / 2, y);
    ctx.lineTo(x + actualPx / 2, y - 4);
    ctx.stroke();

    ctx.fillStyle = theme.textColor;
    ctx.font = "bold 11px 'JetBrains Mono', monospace";
    ctx.textAlign = 'center';
    ctx.fillText('0', x, y - 8);
    ctx.fillText(`${niceUnits} ${unit}`, x + actualPx, y - 8);

    ctx.restore();
  }

  getNiceNumber(val) {
    const exp = Math.floor(Math.log10(val));
    const frac = val / Math.pow(10, exp);
    let niceFrac;
    if (frac < 1.5) niceFrac = 1;
    else if (frac < 3.5) niceFrac = 2;
    else if (frac < 7.5) niceFrac = 5;
    else niceFrac = 10;
    return niceFrac * Math.pow(10, exp);
  }

  getPolygonCenter(pts) {
    let x = 0, y = 0;
    pts.forEach(p => { x += p.x; y += p.y; });
    return { x: x / pts.length, y: y / pts.length };
  }
}


/* --- MODULE: js/engine/interaction.js --- */
/**
 * MapCraft - Pointer, Touch & Drawing Interaction Controller
 * Handles precise vector plotting, vertex reshaping, snap-to-grid, pinch-to-zoom, and object manipulation.
 */



class MapInteraction {
  constructor(canvas, app) {
    this.canvas = canvas;
    this.app = app;

    this.activeTool = 'select'; // select, hand, marker, route, region, circle, label, measure
    this.isPanning = false;
    this.isDraggingObject = false;
    this.isDraggingVertex = false;
    this.isDraggingRadius = false;
    this.selectedVertexIndex = null;

    this.dragStart = { x: 0, y: 0 };
    this.dragOffset = { x: 0, y: 0 };

    // Multi-point drawing state (route, polygon, measure)
    this.drawingPoints = [];
    this.activeCircle = null;

    // Touch gesture state
    this.lastTouchDistance = null;

    this.initListeners();
  }

  screenToWorld(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const sx = clientX - rect.left;
    const sy = clientY - rect.top;
    let wx = (sx - this.app.renderer.camera.x) / this.app.renderer.camera.zoom;
    let wy = (sy - this.app.renderer.camera.y) / this.app.renderer.camera.zoom;

    const rawWx = wx;
    const rawWy = wy;

    if (this.app.snapToGridEnabled && !['hand'].includes(this.activeTool)) {
      const snapped = snapToGrid(wx, wy, this.app.project.gridSize || 50, this.app.project.gridType || 'square');
      wx = snapped.x;
      wy = snapped.y;
    }

    return { wx, wy, rawWx, rawWy, sx, sy };
  }

  initListeners() {
    const canvas = this.canvas;

    // Mouse Events
    canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    window.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    canvas.addEventListener('dblclick', (e) => this.handleDoubleClick(e));

    // Mouse Wheel Zoom towards cursor
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
      const oldZoom = this.app.renderer.camera.zoom;
      const newZoom = Math.max(0.08, Math.min(12, oldZoom * zoomFactor));

      this.app.renderer.camera.x = sx - (sx - this.app.renderer.camera.x) * (newZoom / oldZoom);
      this.app.renderer.camera.y = sy - (sy - this.app.renderer.camera.y) * (newZoom / oldZoom);
      this.app.renderer.camera.zoom = newZoom;

      this.app.requestRender();
      this.app.updateZoomLabel();
    }, { passive: false });

    // Touch Support (Single-touch pan/tap & Pinch-to-zoom)
    canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
    window.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
    window.addEventListener('touchend', (e) => this.handleTouchEnd(e));

    // Prevent default context menu on canvas for custom right-click actions
    canvas.addEventListener('contextmenu', (e) => {
      if (this.drawingPoints.length > 0) {
        e.preventDefault();
        this.drawingPoints.pop();
        if (this.drawingPoints.length === 0) this.finishDrawing();
        else this.app.requestRender();
      }
    });
  }

  handleMouseDown(e) {
    const { wx, wy, rawWx, rawWy, sx, sy } = this.screenToWorld(e.clientX, e.clientY);

    // Pan with middle click, Spacebar pressed, Hand tool, or Alt/Shift key
    if (e.button === 1 || this.activeTool === 'hand' || e.altKey || this.app.isSpacePressed) {
      this.isPanning = true;
      this.dragStart = { x: sx, y: sy };
      return;
    }

    if (e.button !== 0) return; // Left click only for tool execution

    // 1. SELECT TOOL
    if (this.activeTool === 'select') {
      const selectedObj = this.app.selectedObject;

      // Check if clicking an existing vertex on the selected object
      if (selectedObj && selectedObj.points) {
        const vIdx = this.hitTestVertex(rawWx, rawWy, selectedObj.points);
        if (vIdx !== -1) {
          this.isDraggingVertex = true;
          this.selectedVertexIndex = vIdx;
          this.dragStart = { x: wx, y: wy };
          this.app.requestRender();
          return;
        }
      }

      // Check if clicking circle radius handle
      if (selectedObj && selectedObj.type === 'circle') {
        const rx = selectedObj.x + (selectedObj.radius || 50);
        const ry = selectedObj.y;
        if (calculateDistance({ x: rawWx, y: rawWy }, { x: rx, y: ry }) < 10 / this.app.renderer.camera.zoom) {
          this.isDraggingRadius = true;
          this.dragStart = { x: wx, y: wy };
          return;
        }
      }

      // Hit-test any map element
      const hit = this.hitTestObject(rawWx, rawWy);
      if (hit) {
        this.app.selectObject(hit.id);
        this.isDraggingObject = true;
        this.dragStart = { x: wx, y: wy };
      } else {
        this.app.selectObject(null);
      }
      return;
    }

    // 2. MARKER TOOL
    if (this.activeTool === 'marker') {
      this.app.createMarkerAt(wx, wy);
      this.app.setTool('select');
      return;
    }

    // 3. LABEL TOOL
    if (this.activeTool === 'label') {
      this.app.createLabelAt(wx, wy);
      this.app.setTool('select');
      return;
    }

    // 4. CIRCLE TOOL
    if (this.activeTool === 'circle') {
      this.activeCircle = { x: wx, y: wy, radius: 10 };
      this.isDrawingCircle = true;
      return;
    }

    // 5. ROUTE / REGION / MEASURE TOOL (Multi-point click)
    if (['route', 'region', 'measure'].includes(this.activeTool)) {
      this.drawingPoints.push({ x: wx, y: wy });
      this.updateActiveDrawing(wx, wy);
      this.app.requestRender();
    }
  }

  handleMouseMove(e) {
    const { wx, wy, rawWx, rawWy, sx, sy } = this.screenToWorld(e.clientX, e.clientY);

    // Update bottom coordinates readout
    this.app.updateCoordinates(Math.round(wx), Math.round(wy));

    // Pan Viewport
    if (this.isPanning) {
      this.app.renderer.camera.x += sx - this.dragStart.x;
      this.app.renderer.camera.y += sy - this.dragStart.y;
      this.dragStart = { x: sx, y: sy };
      this.app.requestRender();
      return;
    }

    // Drag Single Vertex
    if (this.isDraggingVertex && this.app.selectedObject && this.selectedVertexIndex !== null) {
      const pts = this.app.selectedObject.points;
      if (pts && pts[this.selectedVertexIndex]) {
        pts[this.selectedVertexIndex] = { x: wx, y: wy };
        this.app.requestRender();
        this.app.renderInspector();
      }
      return;
    }

    // Drag Circle Radius
    if (this.isDraggingRadius && this.app.selectedObject) {
      const obj = this.app.selectedObject;
      obj.radius = Math.max(10, Math.round(calculateDistance({ x: obj.x, y: obj.y }, { x: wx, y: wy })));
      this.app.requestRender();
      this.app.renderInspector();
      return;
    }

    // Drag Entire Object
    if (this.isDraggingObject && this.app.selectedObject) {
      const obj = this.app.selectedObject;
      const dx = wx - this.dragStart.x;
      const dy = wy - this.dragStart.y;

      if (dx !== 0 || dy !== 0) {
        if (obj.points) {
          obj.points.forEach(p => { p.x += dx; p.y += dy; });
        } else {
          obj.x += dx;
          obj.y += dy;
        }
        this.dragStart = { x: wx, y: wy };
        this.app.requestRender();
        this.app.renderInspector();
      }
      return;
    }

    // Circle Expansion during creation
    if (this.isDrawingCircle && this.activeCircle) {
      this.activeCircle.radius = Math.max(10, Math.round(calculateDistance(this.activeCircle, { x: wx, y: wy })));
      this.app.activeDrawing = {
        type: 'circle',
        x: this.activeCircle.x,
        y: this.activeCircle.y,
        radius: this.activeCircle.radius
      };
      this.app.requestRender();
      return;
    }

    // Multi-point active line preview
    if (this.drawingPoints.length > 0) {
      this.updateActiveDrawing(wx, wy);
      this.app.requestRender();
    }
  }

  handleMouseUp(e) {
    if (this.isDraggingObject || this.isDraggingVertex || this.isDraggingRadius) {
      this.app.recordHistory('Modify Geometry');
      this.app.autoSave();
    }

    if (this.isDrawingCircle && this.activeCircle) {
      this.app.createCircle(this.activeCircle.x, this.activeCircle.y, this.activeCircle.radius);
      this.isDrawingCircle = false;
      this.activeCircle = null;
      this.app.activeDrawing = null;
      this.app.setTool('select');
    }

    this.isPanning = false;
    this.isDraggingObject = false;
    this.isDraggingVertex = false;
    this.isDraggingRadius = false;
  }

  handleDoubleClick(e) {
    if (this.activeTool === 'route' && this.drawingPoints.length >= 2) {
      this.app.createRoute(this.drawingPoints);
      this.finishDrawing();
    } else if (this.activeTool === 'region' && this.drawingPoints.length >= 3) {
      this.app.createRegion(this.drawingPoints);
      this.finishDrawing();
    } else if (this.activeTool === 'measure') {
      this.finishDrawing();
    }
  }

  // --- Touch Gestures ---
  handleTouchStart(e) {
    if (e.touches.length === 2) {
      // Pinch to zoom start
      e.preventDefault();
      const p1 = e.touches[0];
      const p2 = e.touches[1];
      this.lastTouchDistance = Math.hypot(p2.clientX - p1.clientX, p2.clientY - p1.clientY);
      return;
    }

    if (e.touches.length === 1) {
      const touch = e.touches[0];
      this.handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY, button: 0 });
    }
  }

  handleTouchMove(e) {
    if (e.touches.length === 2 && this.lastTouchDistance) {
      e.preventDefault();
      const p1 = e.touches[0];
      const p2 = e.touches[1];
      const dist = Math.hypot(p2.clientX - p1.clientX, p2.clientY - p1.clientY);
      const factor = dist / this.lastTouchDistance;

      const midX = (p1.clientX + p2.clientX) / 2;
      const midY = (p1.clientY + p2.clientY) / 2;
      const rect = this.canvas.getBoundingClientRect();
      const sx = midX - rect.left;
      const sy = midY - rect.top;

      const oldZoom = this.app.renderer.camera.zoom;
      const newZoom = Math.max(0.1, Math.min(10, oldZoom * factor));

      this.app.renderer.camera.x = sx - (sx - this.app.renderer.camera.x) * (newZoom / oldZoom);
      this.app.renderer.camera.y = sy - (sy - this.app.renderer.camera.y) * (newZoom / oldZoom);
      this.app.renderer.camera.zoom = newZoom;

      this.lastTouchDistance = dist;
      this.app.requestRender();
      this.app.updateZoomLabel();
      return;
    }

    if (e.touches.length === 1) {
      const touch = e.touches[0];
      this.handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    }
  }

  handleTouchEnd(e) {
    this.lastTouchDistance = null;
    this.handleMouseUp({});
  }

  updateActiveDrawing(currentWx, currentWy) {
    const tempPoints = [...this.drawingPoints, { x: currentWx, y: currentWy }];
    const totalDist = calculatePolylineLength(tempPoints);
    const totalArea = ['region', 'measure'].includes(this.activeTool) && tempPoints.length >= 3 ? calculatePolygonArea(tempPoints) : 0;

    this.app.activeDrawing = {
      type: this.activeTool,
      points: tempPoints,
      totalDist,
      totalArea
    };
  }

  finishDrawing() {
    this.drawingPoints = [];
    this.app.activeDrawing = null;
    this.app.setTool('select');
    this.app.requestRender();
  }

  hitTestVertex(wx, wy, points) {
    const threshold = 10 / this.app.renderer.camera.zoom;
    for (let i = 0; i < points.length; i++) {
      if (calculateDistance({ x: wx, y: wy }, points[i]) <= threshold) {
        return i;
      }
    }
    return -1;
  }

  hitTestObject(wx, wy) {
    const objects = [...(this.app.project.objects || [])].reverse();

    for (const obj of objects) {
      if (obj.visible === false || obj.locked) continue;

      if (obj.type === 'marker') {
        const size = obj.size || 28;
        if (Math.abs(wx - obj.x) < size / 2 && wy >= obj.y - size && wy <= obj.y + 12) {
          return obj;
        }
      } else if (obj.type === 'circle') {
        if (calculateDistance({ x: wx, y: wy }, { x: obj.x, y: obj.y }) <= (obj.radius || 50)) {
          return obj;
        }
      } else if (obj.type === 'region' && obj.points) {
        if (pointInPolygon({ x: wx, y: wy }, obj.points)) {
          return obj;
        }
      } else if (obj.type === 'route' && obj.points) {
        if (pointNearPolyline({ x: wx, y: wy }, obj.points, (obj.width || 4) + 8 / this.app.renderer.camera.zoom)) {
          return obj;
        }
      } else if (obj.type === 'label') {
        const len = (obj.text || '').length * 8;
        if (Math.abs(wx - obj.x) < Math.max(40, len) && Math.abs(wy - obj.y) < 22) {
          return obj;
        }
      }
    }
    return null;
  }
}


/* --- MODULE: js/editor/layer-panel.js --- */
/**
 * MapCraft - Layer Management Panel
 * Complete layer hierarchy management with visibility, lock, reorder, duplicate, and deletion.
 */



function renderLayerPanel(container, {
  layers = [],
  activeLayerId,
  objects = [],
  onSelectLayer = null,
  onAddLayer = null,
  onRenameLayer = null,
  onDuplicateLayer = null,
  onDeleteLayer = null,
  onToggleVisibility = null,
  onToggleLock = null,
  onMoveLayer = null
}) {
  container.innerHTML = `
    <div class="panel-section-header flex items-center justify-between p-3 border-b">
      <div class="flex items-center gap-2">
        ${getIcon('layers', 'icon-sm text-primary')}
        <span class="text-xs font-bold uppercase text-muted">Map Layers (${layers.length})</span>
      </div>
      <button class="btn btn-xs btn-primary" id="btn-add-map-layer" title="Create New Map Layer">
        ${getIcon('plus', 'icon-xs')} Add Layer
      </button>
    </div>

    <div class="layers-list-scroll p-2 flex flex-col gap-1 overflow-y-auto flex-1">
      ${layers.map((layer, idx) => {
        const isActive = layer.id === activeLayerId;
        const layerObjs = objects.filter(o => o.layerId === layer.id);
        const count = layerObjs.length;

        return `
          <div class="layer-item-row card p-2 flex items-center justify-between ${isActive ? 'active' : ''}" data-id="${layer.id}">
            <div class="flex items-center gap-2 flex-1 cursor-pointer layer-select-target min-w-0" title="Click to activate layer">
              <span class="layer-index-badge text-muted font-mono text-xs">#${idx + 1}</span>
              <span class="layer-name font-semibold text-xs truncate flex-1">${escapeHTML(layer.name)}</span>
              <span class="badge badge-secondary text-xs font-mono" title="${count} objects on this layer">${count}</span>
            </div>

            <div class="layer-actions flex items-center gap-1 ml-2">
              <button class="btn-icon-xs btn-move-layer-up" data-idx="${idx}" title="Move Layer Up" ${idx === 0 ? 'disabled' : ''}>&uarr;</button>
              <button class="btn-icon-xs btn-move-layer-down" data-idx="${idx}" title="Move Layer Down" ${idx === layers.length - 1 ? 'disabled' : ''}>&darr;</button>
              <button class="btn-icon-xs btn-layer-vis ${layer.visible === false ? 'text-muted' : 'text-primary'}" data-id="${layer.id}" title="Toggle Visibility">
                ${getIcon(layer.visible !== false ? 'eye' : 'eyeOff', 'icon-xs')}
              </button>
              <button class="btn-icon-xs btn-layer-lock ${layer.locked ? 'text-amber' : 'text-muted'}" data-id="${layer.id}" title="Toggle Lock">
                ${getIcon(layer.locked ? 'lock' : 'unlock', 'icon-xs')}
              </button>
              <button class="btn-icon-xs btn-layer-dupe text-muted" data-id="${layer.id}" title="Duplicate Layer & Objects">
                ${getIcon('copy', 'icon-xs')}
              </button>
              ${layers.length > 1 ? `
                <button class="btn-icon-xs text-rose btn-layer-del" data-id="${layer.id}" title="Delete Layer">
                  ${getIcon('trash', 'icon-xs')}
                </button>
              ` : ''}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // --- Attach Handlers ---
  container.querySelector('#btn-add-map-layer')?.addEventListener('click', () => {
    const name = prompt('Enter new layer name (e.g. Landmarks, Trade Routes, Hazards, Biomes):', 'New Layer');
    if (name && name.trim()) {
      if (onAddLayer) onAddLayer(name.trim());
    }
  });

  container.querySelectorAll('.layer-select-target').forEach(el => {
    el.addEventListener('click', () => {
      const row = el.closest('.layer-item-row');
      if (onSelectLayer) onSelectLayer(row.dataset.id);
    });

    // Double click to rename layer
    el.addEventListener('dblclick', () => {
      const row = el.closest('.layer-item-row');
      const layer = layers.find(l => l.id === row.dataset.id);
      if (!layer) return;
      const newName = prompt('Rename layer:', layer.name);
      if (newName && newName.trim() && onRenameLayer) {
        onRenameLayer(layer.id, newName.trim());
      }
    });
  });

  container.querySelectorAll('.btn-layer-vis').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onToggleVisibility) onToggleVisibility(btn.dataset.id);
    });
  });

  container.querySelectorAll('.btn-layer-lock').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onToggleLock) onToggleLock(btn.dataset.id);
    });
  });

  container.querySelectorAll('.btn-layer-dupe').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onDuplicateLayer) onDuplicateLayer(btn.dataset.id);
    });
  });

  container.querySelectorAll('.btn-move-layer-up').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      if (onMoveLayer) onMoveLayer(idx, -1);
    });
  });

  container.querySelectorAll('.btn-move-layer-down').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      if (onMoveLayer) onMoveLayer(idx, 1);
    });
  });

  container.querySelectorAll('.btn-layer-del').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Delete this layer? All map elements placed on this layer will also be removed.')) {
        if (onDeleteLayer) onDeleteLayer(btn.dataset.id);
      }
    });
  });
}


/* --- MODULE: js/editor/inspector.js --- */
/**
 * MapCraft - Object & Map Properties Inspector
 * Complete tactile properties editor for markers, routes, regions, labels, and global map settings.
 */





function renderInspector(container, {
  selectedObject,
  project,
  onObjectChange = null,
  onProjectChange = null,
  onDeleteObject = null,
  onDuplicateObject = null,
  onCenterObject = null,
  onReorderObject = null
}) {
  if (!selectedObject) {
    renderMapSettingsInspector(container, project, onProjectChange);
    return;
  }

  const obj = selectedObject;
  const layers = project.layers || [];

  let geometryStatsHTML = '';
  if (obj.type === 'route' && obj.points) {
    const pxLen = calculatePolylineLength(obj.points);
    const distStr = formatScaledDistance(pxLen, project.scaleRatio || 10, project.scaleUnit || 'km');
    geometryStatsHTML = `
      <div class="stat-badge-row card p-2 mb-3 flex items-center justify-between text-xs">
        <span class="text-muted">Total Distance:</span>
        <span class="font-mono font-bold text-primary">${distStr} (${obj.points.length} waypoints)</span>
      </div>
    `;
  } else if (obj.type === 'region' && obj.points) {
    const pxArea = calculatePolygonArea(obj.points);
    const areaStr = formatScaledArea(pxArea, project.scaleRatio || 10, project.scaleUnit || 'km');
    geometryStatsHTML = `
      <div class="stat-badge-row card p-2 mb-3 flex items-center justify-between text-xs">
        <span class="text-muted">Enclosed Area:</span>
        <span class="font-mono font-bold text-emerald">${areaStr} (${obj.points.length} vertices)</span>
      </div>
    `;
  } else if (obj.type === 'circle') {
    const pxArea = Math.PI * (obj.radius || 50) ** 2;
    const areaStr = formatScaledArea(pxArea, project.scaleRatio || 10, project.scaleUnit || 'km');
    geometryStatsHTML = `
      <div class="stat-badge-row card p-2 mb-3 flex items-center justify-between text-xs">
        <span class="text-muted">Zone Radius / Area:</span>
        <span class="font-mono font-bold text-emerald">${obj.radius || 50}px &bull; ${areaStr}</span>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="inspector-header p-3 border-b flex items-center justify-between">
      <div class="flex items-center gap-2 flex-1">
        <span class="badge badge-primary font-mono text-xs uppercase">${obj.type}</span>
        <input type="text" id="insp-name" class="form-control form-control-sm font-bold text-primary flex-1" value="${escapeHTML(obj.name || '')}" placeholder="Element Name" />
      </div>
    </div>

    <div class="inspector-scroll-body p-3 overflow-y-auto flex-1">
      ${geometryStatsHTML}

      <!-- Layer & Category Assignment -->
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Layer & Classification</div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Assigned Layer</label>
          <select id="insp-layer" class="form-control form-control-sm">
            ${layers.map(l => `<option value="${l.id}" ${obj.layerId === l.id ? 'selected' : ''}>${escapeHTML(l.name)}</option>`).join('')}
          </select>
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Category Tag</label>
          <input type="text" id="insp-category" class="form-control form-control-sm font-mono" value="${escapeHTML(obj.category || '')}" placeholder="Landmark, Capital, Trail, Danger" />
        </div>
      </div>

      <!-- Type-Specific Styling -->
      ${renderTypeSpecificOptions(obj)}

      <!-- Z-Ordering -->
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Stacking Order</div>
        <div class="flex gap-1">
          <button class="btn btn-xs btn-secondary flex-1" id="btn-z-front" title="Bring to Front">To Front</button>
          <button class="btn btn-xs btn-secondary flex-1" id="btn-z-forward" title="Bring Forward">Forward</button>
          <button class="btn btn-xs btn-secondary flex-1" id="btn-z-backward" title="Send Backward">Backward</button>
          <button class="btn btn-xs btn-secondary flex-1" id="btn-z-back" title="Send to Back">To Back</button>
        </div>
      </div>

      <!-- Notes & Cartographic Lore -->
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Description, Notes & Lore</div>
        <textarea id="insp-notes" class="form-control form-control-sm font-sans" rows="3" placeholder="Add historical context, navigation notes, travel time, or secret lore...">${escapeHTML(obj.notes || '')}</textarea>
      </div>

      <!-- Action Buttons -->
      <div class="inspector-actions flex gap-2 border-t pt-3">
        <button class="btn btn-sm btn-secondary flex-1" id="btn-center-obj" title="Center Map on Element">
          ${getIcon('compass', 'icon-xs')} Center Map
        </button>
        <button class="btn btn-sm btn-secondary" id="btn-dupe-obj" title="Duplicate (Ctrl+D)">
          ${getIcon('copy', 'icon-xs')}
        </button>
        <button class="btn btn-sm btn-danger" id="btn-del-obj" title="Delete (Del)">
          ${getIcon('trash', 'icon-xs')}
        </button>
      </div>
    </div>
  `;

  // --- Attach Event Listeners ---
  const bind = (id, prop, parser = (v) => v) => {
    container.querySelector('#' + id)?.addEventListener('input', (e) => {
      obj[prop] = parser(e.target.value);
      if (onObjectChange) onObjectChange(obj);
    });
  };

  bind('insp-name', 'name');
  bind('insp-layer', 'layerId');
  bind('insp-category', 'category');
  bind('insp-notes', 'notes');

  // Marker options
  bind('insp-marker-size', 'size', Number);
  bind('insp-marker-color', 'color');
  container.querySelector('#insp-marker-hide-label')?.addEventListener('change', (e) => {
    obj.hideLabel = e.target.checked;
    if (onObjectChange) onObjectChange(obj);
  });

  // Marker icon grid picker
  container.querySelectorAll('.icon-picker-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      obj.icon = btn.dataset.icon;
      container.querySelectorAll('.icon-picker-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (onObjectChange) onObjectChange(obj);
    });
  });

  // Route options
  bind('insp-route-width', 'width', Number);
  bind('insp-route-color', 'color');
  bind('insp-route-style', 'style');
  container.querySelector('#insp-route-arrow')?.addEventListener('change', (e) => {
    obj.hasArrow = e.target.checked;
    if (onObjectChange) onObjectChange(obj);
  });

  // Region & Circle options
  bind('insp-fill-color', 'fillColor');
  bind('insp-stroke-color', 'strokeColor');
  bind('insp-stroke-width', 'strokeWidth', Number);
  bind('insp-region-opacity', 'opacity', Number);
  bind('insp-region-pattern', 'pattern');
  bind('insp-circle-radius', 'radius', Number);

  // Label options
  bind('insp-label-text', 'text');
  bind('insp-font-family', 'fontFamily');
  bind('insp-font-size', 'fontSize', Number);
  bind('insp-label-color', 'color');
  bind('insp-label-rot', 'rotation', Number);
  container.querySelector('#insp-label-bold')?.addEventListener('change', (e) => {
    obj.isBold = e.target.checked;
    if (onObjectChange) onObjectChange(obj);
  });

  // Stacking order actions
  container.querySelector('#btn-z-front')?.addEventListener('click', () => {
    if (onReorderObject) onReorderObject(obj.id, 'front');
  });
  container.querySelector('#btn-z-forward')?.addEventListener('click', () => {
    if (onReorderObject) onReorderObject(obj.id, 'forward');
  });
  container.querySelector('#btn-z-backward')?.addEventListener('click', () => {
    if (onReorderObject) onReorderObject(obj.id, 'backward');
  });
  container.querySelector('#btn-z-back')?.addEventListener('click', () => {
    if (onReorderObject) onReorderObject(obj.id, 'back');
  });

  // Actions
  container.querySelector('#btn-center-obj')?.addEventListener('click', () => {
    if (onCenterObject) onCenterObject(obj);
  });
  container.querySelector('#btn-dupe-obj')?.addEventListener('click', () => {
    if (onDuplicateObject) onDuplicateObject(obj.id);
  });
  container.querySelector('#btn-del-obj')?.addEventListener('click', () => {
    if (onDeleteObject) onDeleteObject(obj.id);
  });
}

function renderTypeSpecificOptions(obj) {
  if (obj.type === 'marker') {
    return `
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Cartographic Symbol</div>
        <div class="icon-picker-grid mb-2">
          ${MARKER_ICONS_LIST.map(item => `
            <button class="icon-picker-btn ${obj.icon === item.id ? 'active' : ''}" data-icon="${item.id}" title="${item.name}">
              ${getIcon(item.icon, 'icon-xs')}
            </button>
          `).join('')}
        </div>

        <div class="form-group mb-2">
          <label class="form-label text-xs">Pin Color</label>
          <input type="color" id="insp-marker-color" class="form-control form-control-sm p-0 w-full h-7 cursor-pointer" value="${obj.color || '#38bdf8'}" />
        </div>
        <div class="form-group mb-2">
          <div class="flex items-center justify-between">
            <label class="form-label text-xs">Pin Size</label>
            <span class="font-mono text-xs text-muted">${obj.size || 28}px</span>
          </div>
          <input type="range" min="18" max="48" id="insp-marker-size" class="form-control form-control-sm" value="${obj.size || 28}" />
        </div>
        <div class="form-group mb-2">
          <label class="checkbox-label text-xs">
            <input type="checkbox" id="insp-marker-hide-label" ${obj.hideLabel ? 'checked' : ''} /> Hide Text Label on Map
          </label>
        </div>
      </div>
    `;
  }

  if (obj.type === 'route') {
    return `
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Route Styling</div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Line Color</label>
          <input type="color" id="insp-route-color" class="form-control form-control-sm p-0 w-full h-7 cursor-pointer" value="${obj.color || '#e63946'}" />
        </div>
        <div class="form-group mb-2">
          <div class="flex items-center justify-between">
            <label class="form-label text-xs">Line Width</label>
            <span class="font-mono text-xs text-muted">${obj.width || 3.5}px</span>
          </div>
          <input type="range" min="1" max="10" step="0.5" id="insp-route-width" class="form-control form-control-sm" value="${obj.width || 3.5}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Route Line Style</label>
          <select id="insp-route-style" class="form-control form-control-sm">
            <option value="solid" ${obj.style === 'solid' ? 'selected' : ''}>Solid Paved Road</option>
            <option value="dashed" ${obj.style === 'dashed' ? 'selected' : ''}>Dashed Caravan Trail</option>
            <option value="dotted" ${obj.style === 'dotted' ? 'selected' : ''}>Dotted Footpath / Pass</option>
            <option value="railroad" ${obj.style === 'railroad' ? 'selected' : ''}>Railroad / Transit Track</option>
          </select>
        </div>
        <div class="form-group mb-2">
          <label class="checkbox-label text-xs">
            <input type="checkbox" id="insp-route-arrow" ${obj.hasArrow !== false ? 'checked' : ''} /> Show Directional Arrow at End
          </label>
        </div>
      </div>
    `;
  }

  if (obj.type === 'region') {
    return `
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Region Appearance</div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Fill Color</label>
          <input type="color" id="insp-fill-color" class="form-control form-control-sm p-0 w-full h-7 cursor-pointer" value="${obj.fillColor || '#38bdf8'}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Border Stroke Color</label>
          <input type="color" id="insp-stroke-color" class="form-control form-control-sm p-0 w-full h-7 cursor-pointer" value="${obj.strokeColor || obj.fillColor || '#38bdf8'}" />
        </div>
        <div class="form-group mb-2">
          <div class="flex items-center justify-between">
            <label class="form-label text-xs">Fill Opacity</label>
            <span class="font-mono text-xs text-muted">${Math.round((obj.opacity !== undefined ? obj.opacity : 0.35) * 100)}%</span>
          </div>
          <input type="range" min="0.05" max="1" step="0.05" id="insp-region-opacity" class="form-control form-control-sm" value="${obj.opacity !== undefined ? obj.opacity : 0.35}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Fill Pattern</label>
          <select id="insp-region-pattern" class="form-control form-control-sm">
            <option value="solid" ${obj.pattern !== 'hatch' ? 'selected' : ''}>Solid Tint</option>
            <option value="hatch" ${obj.pattern === 'hatch' ? 'selected' : ''}>Cartographic Diagonal Hatch</option>
          </select>
        </div>
      </div>
    `;
  }

  if (obj.type === 'circle') {
    return `
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Circular Zone Geometry</div>
        <div class="form-group mb-2">
          <div class="flex items-center justify-between">
            <label class="form-label text-xs">Zone Radius</label>
            <span class="font-mono text-xs text-muted">${obj.radius || 50}px</span>
          </div>
          <input type="range" min="15" max="300" id="insp-circle-radius" class="form-control form-control-sm" value="${obj.radius || 50}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Fill Color</label>
          <input type="color" id="insp-fill-color" class="form-control form-control-sm p-0 w-full h-7 cursor-pointer" value="${obj.fillColor || '#38bdf8'}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Stroke Color</label>
          <input type="color" id="insp-stroke-color" class="form-control form-control-sm p-0 w-full h-7 cursor-pointer" value="${obj.strokeColor || obj.fillColor || '#38bdf8'}" />
        </div>
        <div class="form-group mb-2">
          <div class="flex items-center justify-between">
            <label class="form-label text-xs">Opacity</label>
            <span class="font-mono text-xs text-muted">${Math.round((obj.opacity !== undefined ? obj.opacity : 0.35) * 100)}%</span>
          </div>
          <input type="range" min="0.05" max="1" step="0.05" id="insp-region-opacity" class="form-control form-control-sm" value="${obj.opacity !== undefined ? obj.opacity : 0.35}" />
        </div>
      </div>
    `;
  }

  if (obj.type === 'label') {
    return `
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Typography & Alignment</div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Label Text</label>
          <input type="text" id="insp-label-text" class="form-control form-control-sm font-bold" value="${escapeHTML(obj.text || '')}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Font Family</label>
          <select id="insp-font-family" class="form-control form-control-sm">
            <option value="'Cinzel', serif" ${obj.fontFamily?.includes('Cinzel') ? 'selected' : ''}>Cinzel (Classic / Fantasy Serif)</option>
            <option value="'Inter', sans-serif" ${obj.fontFamily?.includes('Inter') || !obj.fontFamily ? 'selected' : ''}>Inter (Clean Sans-Serif)</option>
            <option value="'JetBrains Mono', monospace" ${obj.fontFamily?.includes('Mono') ? 'selected' : ''}>JetBrains Mono (Technical)</option>
            <option value="'Georgia', serif" ${obj.fontFamily?.includes('Georgia') ? 'selected' : ''}>Georgia (Editorial Serif)</option>
          </select>
        </div>
        <div class="form-group mb-2">
          <div class="flex items-center justify-between">
            <label class="form-label text-xs">Font Size</label>
            <span class="font-mono text-xs text-muted">${obj.fontSize || 16}px</span>
          </div>
          <input type="range" min="9" max="64" id="insp-font-size" class="form-control form-control-sm" value="${obj.fontSize || 16}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Font Color</label>
          <input type="color" id="insp-label-color" class="form-control form-control-sm p-0 w-full h-7 cursor-pointer" value="${obj.color || '#3b2f2f'}" />
        </div>
        <div class="form-group mb-2">
          <div class="flex items-center justify-between">
            <label class="form-label text-xs">Rotation</label>
            <span class="font-mono text-xs text-muted">${obj.rotation || 0}&deg;</span>
          </div>
          <input type="range" min="-180" max="180" id="insp-label-rot" class="form-control form-control-sm" value="${obj.rotation || 0}" />
        </div>
        <div class="form-group mb-2">
          <label class="checkbox-label text-xs">
            <input type="checkbox" id="insp-label-bold" ${obj.isBold !== false ? 'checked' : ''} /> Bold Weight
          </label>
        </div>
      </div>
    `;
  }

  return '';
}

function renderMapSettingsInspector(container, project, onProjectChange) {
  const objCount = (project.objects || []).length;
  const layerCount = (project.layers || []).length;

  container.innerHTML = `
    <div class="inspector-header p-3 border-b flex items-center justify-between">
      <span class="badge badge-secondary font-mono text-xs">PROJECT SETTINGS</span>
      <span class="text-xs text-muted font-mono">${objCount} Elements &bull; ${layerCount} Layers</span>
    </div>

    <div class="inspector-scroll-body p-3 overflow-y-auto flex-1">
      <!-- General Map Info -->
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Map Information</div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Map Title</label>
          <input type="text" id="insp-map-title" class="form-control form-control-sm font-bold text-primary" value="${escapeHTML(project.name || 'Untitled Map')}" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Description</label>
          <textarea id="insp-map-desc" class="form-control form-control-sm font-sans" rows="2" placeholder="Map overview or campaign premise...">${escapeHTML(project.description || '')}</textarea>
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Cartographic Theme</label>
          <select id="insp-map-theme" class="form-control form-control-sm font-semibold">
            ${Object.values(MAP_THEMES).map(t => `<option value="${t.id}" ${project.themeId === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}
          </select>
        </div>
      </div>

      <!-- Scale & Measurement Units -->
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Scale & Measurement Ratio</div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Scale Ratio (Real Units per 100px)</label>
          <input type="number" id="insp-scale-ratio" class="form-control form-control-sm font-mono" value="${project.scaleRatio || 10}" min="0.1" step="0.5" />
        </div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Measurement Unit</label>
          <select id="insp-scale-unit" class="form-control form-control-sm font-semibold">
            <option value="km" ${project.scaleUnit === 'km' ? 'selected' : ''}>Kilometers (km / km&sup2;)</option>
            <option value="mi" ${project.scaleUnit === 'mi' ? 'selected' : ''}>Miles (mi / sq mi)</option>
            <option value="m" ${project.scaleUnit === 'm' ? 'selected' : ''}>Meters (m / m&sup2;)</option>
            <option value="nm" ${project.scaleUnit === 'nm' ? 'selected' : ''}>Nautical Miles (nm / sq nm)</option>
            <option value="leagues" ${project.scaleUnit === 'leagues' ? 'selected' : ''}>Leagues (Fantasy / Historical)</option>
            <option value="hexes" ${project.scaleUnit === 'hexes' ? 'selected' : ''}>Hex Grid Units (Tabletop RPG)</option>
          </select>
        </div>
      </div>

      <!-- Cartographic Grid Settings -->
      <div class="inspector-section mb-3">
        <div class="inspector-section-title text-xs font-bold uppercase text-muted mb-2">Grid & Coordinates</div>
        <div class="form-group mb-2">
          <label class="form-label text-xs">Grid Mesh Type</label>
          <select id="insp-grid-type" class="form-control form-control-sm">
            <option value="square" ${project.gridType === 'square' || !project.gridType ? 'selected' : ''}>Cartographic Square Grid</option>
            <option value="hex" ${project.gridType === 'hex' ? 'selected' : ''}>Hexagonal RPG Grid</option>
            <option value="dot" ${project.gridType === 'dot' ? 'selected' : ''}>Dot Matrix Drafting Grid</option>
            <option value="none" ${project.gridType === 'none' ? 'selected' : ''}>No Grid Overlay</option>
          </select>
        </div>
        <div class="form-group mb-2">
          <div class="flex items-center justify-between">
            <label class="form-label text-xs">Grid Cell Spacing</label>
            <span class="font-mono text-xs text-muted">${project.gridSize || 50}px</span>
          </div>
          <input type="range" min="25" max="150" step="5" id="insp-grid-size" class="form-control form-control-sm" value="${project.gridSize || 50}" />
        </div>
      </div>

      <div class="card p-3 text-xs text-muted leading-relaxed">
        <strong class="text-primary block mb-1">Quick Cartography Tips:</strong>
        &bull; Select any marker, route, or region to edit its properties.<br/>
        &bull; Drag vertex handles to reshape routes and borders.<br/>
        &bull; Use the <strong>Measure (X)</strong> tool for live route and area calculations.
      </div>
    </div>
  `;

  container.querySelector('#insp-map-title')?.addEventListener('input', (e) => {
    project.name = e.target.value;
    if (onProjectChange) onProjectChange();
  });

  container.querySelector('#insp-map-desc')?.addEventListener('input', (e) => {
    project.description = e.target.value;
    if (onProjectChange) onProjectChange();
  });

  container.querySelector('#insp-map-theme')?.addEventListener('change', (e) => {
    project.themeId = e.target.value;
    const themeSelect = document.getElementById('select-map-theme');
    if (themeSelect) themeSelect.value = e.target.value;
    if (onProjectChange) onProjectChange();
  });

  container.querySelector('#insp-scale-ratio')?.addEventListener('input', (e) => {
    project.scaleRatio = Math.max(0.01, Number(e.target.value) || 10);
    if (onProjectChange) onProjectChange();
  });

  container.querySelector('#insp-scale-unit')?.addEventListener('change', (e) => {
    project.scaleUnit = e.target.value;
    if (onProjectChange) onProjectChange();
  });

  container.querySelector('#insp-grid-type')?.addEventListener('change', (e) => {
    project.gridType = e.target.value;
    if (onProjectChange) onProjectChange();
  });

  container.querySelector('#insp-grid-size')?.addEventListener('input', (e) => {
    project.gridSize = Number(e.target.value) || 50;
    if (onProjectChange) onProjectChange();
  });
}


/* --- MODULE: js/editor/legend.js --- */
/**
 * MapCraft - Map Legend & Dynamic Search Index
 * Instant full-text search across POIs, categories, notes, and layers with category toggles and focus camera.
 */



function renderLegendPanel(container, {
  project,
  onSelectObject = null,
  onCenterObject = null,
  onToggleCategoryVisibility = null
}) {
  const objects = project.objects || [];

  // Group objects by category
  const categories = {};
  for (const obj of objects) {
    const cat = obj.category || obj.type || 'Uncategorized';
    if (!categories[cat]) {
      categories[cat] = {
        name: cat,
        items: [],
        color: obj.color || obj.fillColor || '#38bdf8'
      };
    }
    categories[cat].items.push(obj);
  }

  container.innerHTML = `
    <div class="p-3 border-b">
      <!-- Search Input -->
      <div class="search-input-wrapper flex items-center gap-2 card p-1 px-2 mb-2">
        ${getIcon('search', 'icon-xs text-muted')}
        <input type="text" id="map-search-input" class="search-input font-sans text-xs flex-1 bg-transparent border-none outline-none" placeholder="Search markers, routes, notes, lore..." />
        <button class="btn-icon-xs text-muted" id="btn-clear-search" style="display: none;">&times;</button>
      </div>

      <!-- Type Filter Pills -->
      <div class="flex items-center gap-1 mb-2 overflow-x-auto pb-1" id="legend-type-filters">
        <button class="badge badge-primary cursor-pointer filter-pill active" data-type="all">All (${objects.length})</button>
        <button class="badge badge-secondary cursor-pointer filter-pill" data-type="marker">Markers</button>
        <button class="badge badge-secondary cursor-pointer filter-pill" data-type="route">Routes</button>
        <button class="badge badge-secondary cursor-pointer filter-pill" data-type="region">Regions</button>
        <button class="badge badge-secondary cursor-pointer filter-pill" data-type="label">Labels</button>
      </div>

      <div class="flex items-center justify-between">
        <span class="text-xs font-bold uppercase text-muted">Cartographic Index</span>
        <span class="badge badge-secondary text-xs font-mono">${Object.keys(categories).length} Categories</span>
      </div>
    </div>

    <!-- Scrollable Categories & Items List -->
    <div class="legend-scroll-body p-3 overflow-y-auto flex-1 flex flex-col gap-2" id="legend-items-container">
      ${renderLegendCategories(categories)}
    </div>
  `;

  // Search & Filter handlers
  const searchInput = container.querySelector('#map-search-input');
  const clearBtn = container.querySelector('#btn-clear-search');
  const itemsContainer = container.querySelector('#legend-items-container');
  let activeFilterType = 'all';

  const applyFilters = () => {
    const query = (searchInput.value || '').toLowerCase().trim();
    clearBtn.style.display = query ? 'inline-flex' : 'none';

    let filtered = objects;
    if (activeFilterType !== 'all') {
      filtered = filtered.filter(o => o.type === activeFilterType);
    }
    if (query) {
      filtered = filtered.filter(o =>
        (o.name && o.name.toLowerCase().includes(query)) ||
        (o.category && o.category.toLowerCase().includes(query)) ||
        (o.notes && o.notes.toLowerCase().includes(query)) ||
        (o.text && o.text.toLowerCase().includes(query))
      );
    }

    if (filtered.length === 0) {
      itemsContainer.innerHTML = `<div class="text-xs text-muted text-center p-4">No matching map elements found.</div>`;
      return;
    }

    // Regroup filtered
    const filteredCats = {};
    for (const obj of filtered) {
      const cat = obj.category || obj.type || 'Uncategorized';
      if (!filteredCats[cat]) {
        filteredCats[cat] = {
          name: cat,
          items: [],
          color: obj.color || obj.fillColor || '#38bdf8'
        };
      }
      filteredCats[cat].items.push(obj);
    }

    itemsContainer.innerHTML = renderLegendCategories(filteredCats);
    attachItemClickHandlers(container, project, onSelectObject, onCenterObject);
  };

  searchInput?.addEventListener('input', applyFilters);
  clearBtn?.addEventListener('click', () => {
    searchInput.value = '';
    applyFilters();
  });

  container.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      container.querySelectorAll('.filter-pill').forEach(p => {
        p.classList.remove('badge-primary', 'active');
        p.classList.add('badge-secondary');
      });
      pill.classList.remove('badge-secondary');
      pill.classList.add('badge-primary', 'active');
      activeFilterType = pill.dataset.type;
      applyFilters();
    });
  });

  attachItemClickHandlers(container, project, onSelectObject, onCenterObject);
}

function renderLegendCategories(categories) {
  const keys = Object.keys(categories);
  if (keys.length === 0) {
    return `<div class="text-xs text-muted text-center p-4">No elements in this map catalog.</div>`;
  }

  return keys.map(catKey => {
    const cat = categories[catKey];
    return `
      <div class="legend-category-group card p-2">
        <div class="flex items-center justify-between mb-1.5 pb-1 border-b">
          <div class="flex items-center gap-2">
            <span class="legend-color-dot" style="background-color: ${cat.color};"></span>
            <span class="font-bold text-xs uppercase text-primary">${escapeHTML(cat.name)}</span>
          </div>
          <span class="badge badge-secondary text-xs font-mono">${cat.items.length}</span>
        </div>

        <div class="legend-cat-items flex flex-col gap-0.5">
          ${cat.items.map(obj => `
            <div class="legend-item-row flex items-center justify-between p-1 rounded hover:bg-hover cursor-pointer" data-id="${obj.id}" title="${escapeHTML(obj.notes || 'Click to view & focus')}">
              <div class="flex items-center gap-2 flex-1 min-w-0">
                <span class="w-2 h-2 rounded-full flex-shrink-0" style="background: ${obj.color || obj.fillColor || '#38bdf8'};"></span>
                <span class="text-xs text-secondary truncate">${escapeHTML(obj.name || obj.text || 'Unnamed Element')}</span>
              </div>
              <span class="text-muted text-xs font-mono uppercase ml-2">${obj.type}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function attachItemClickHandlers(container, project, onSelectObject, onCenterObject) {
  container.querySelectorAll('.legend-item-row').forEach(row => {
    row.addEventListener('click', () => {
      const objId = row.dataset.id;
      const obj = (project.objects || []).find(o => o.id === objId);
      if (obj) {
        if (onSelectObject) onSelectObject(objId);
        if (onCenterObject) onCenterObject(obj);
      }
    });
  });
}


/* --- MODULE: js/editor/templates.js --- */
/**
 * MapCraft - Pre-Built Cartographic Templates
 * 4 rich, portfolio-grade maps for Fantasy RPGs, Urban Travel, Sci-Fi Habitats, and Nautical Exploration.
 */

const MAP_TEMPLATES = {
  // 1. Realm of Eldoria (High Fantasy World Map)
  fantasy: {
    id: 'proj_eldoria',
    name: 'Realm of Eldoria',
    description: 'Campaign continent featuring ancient kingdoms, elfwood sanctuaries, and dragon-guarded mountain passes.',
    themeId: 'parchment',
    scaleRatio: 25, // 100px = 25 km
    scaleUnit: 'km',
    gridType: 'hex',
    gridSize: 60,
    layers: [
      { id: 'layer_territories', name: 'Kingdoms & Biomes', visible: true, locked: false },
      { id: 'layer_routes', name: 'Trade Routes & Passes', visible: true, locked: false },
      { id: 'layer_landmarks', name: 'Castles, Ruins & POIs', visible: true, locked: false },
      { id: 'layer_labels', name: 'Geographic Labels', visible: true, locked: false }
    ],
    objects: [
      // Regions
      {
        id: 'reg_whisperwood',
        name: 'Whisperwood Sylvan Forest',
        type: 'region',
        layerId: 'layer_territories',
        category: 'Wilderness',
        fillColor: '#8a9a5b',
        strokeColor: '#556b2f',
        strokeWidth: 2,
        opacity: 0.35,
        points: [
          { x: 180, y: 140 }, { x: 380, y: 120 }, { x: 440, y: 260 },
          { x: 320, y: 350 }, { x: 150, y: 290 }
        ],
        notes: 'Ancient enchanted primeval forest guarded by the Silverleaf Wood Elves. Magic leylines intersect near the Moonstone Sanctuary.'
      },
      {
        id: 'reg_sunfire_kingdom',
        name: 'Sunfire Crown Kingdom',
        type: 'region',
        layerId: 'layer_territories',
        category: 'Kingdom',
        fillColor: '#d4a373',
        strokeColor: '#bc6c25',
        strokeWidth: 2,
        opacity: 0.32,
        points: [
          { x: 500, y: 180 }, { x: 840, y: 150 }, { x: 920, y: 390 },
          { x: 640, y: 460 }, { x: 480, y: 320 }
        ],
        notes: 'The golden fertile realm ruled by the Solaris Dynasty. Famous for grain exports, warhorse breeding, and radiant paladin orders.'
      },
      {
        id: 'reg_sea_storms',
        name: 'Sea of Maelstroms',
        type: 'region',
        layerId: 'layer_territories',
        category: 'Ocean',
        fillColor: '#457b9d',
        strokeColor: '#1d3557',
        strokeWidth: 2,
        opacity: 0.28,
        points: [
          { x: 700, y: 470 }, { x: 1140, y: 430 }, { x: 1180, y: 740 },
          { x: 640, y: 760 }
        ],
        notes: 'Treacherous southern waters known for tidal whirlpools and kraken leviathans. Requires experienced navigators.'
      },
      {
        id: 'reg_ashen_wastes',
        name: 'Ashen Wastes',
        type: 'region',
        layerId: 'layer_territories',
        category: 'Hazard',
        fillColor: '#78716c',
        strokeColor: '#44403c',
        strokeWidth: 2,
        opacity: 0.3,
        points: [
          { x: 260, y: 400 }, { x: 450, y: 380 }, { x: 430, y: 560 },
          { x: 220, y: 540 }
        ],
        notes: 'Barren volcanic scrubland following the Cataclysm of Fire. Inhabited by fire elementals and rogue ash goblins.'
      },

      // Routes
      {
        id: 'route_kings_highway',
        name: "The King's Imperial Highway",
        type: 'route',
        layerId: 'layer_routes',
        category: 'Main Road',
        color: '#8b4513',
        width: 4,
        style: 'solid',
        points: [
          { x: 260, y: 220 }, { x: 420, y: 240 }, { x: 580, y: 290 },
          { x: 760, y: 320 }
        ],
        notes: 'Double-wide cobbled roadway regularly patrolled by royal guard garrisons. Connects western sanctuaries to Eldor Citadel.'
      },
      {
        id: 'route_silk_trade',
        name: 'Caravan Trail of Spices',
        type: 'route',
        layerId: 'layer_routes',
        category: 'Trade Route',
        color: '#d97706',
        width: 3,
        style: 'dashed',
        points: [
          { x: 760, y: 320 }, { x: 820, y: 430 }, { x: 910, y: 550 }
        ],
        notes: 'Arduous coastal path where merchants transport silk, magical gems, and exotic spices from Port Kraken.'
      },
      {
        id: 'route_dragon_pass',
        name: "Wyvern's Tooth Pass",
        type: 'route',
        layerId: 'layer_routes',
        category: 'Mountain Pass',
        color: '#b91c1c',
        width: 2.5,
        style: 'dotted',
        points: [
          { x: 380, y: 130 }, { x: 460, y: 100 }, { x: 580, y: 120 }
        ],
        notes: 'Hazardous high-altitude mountain ledge exposed to sub-zero blizzards and wyvern nesting cliffs.'
      },

      // Markers
      {
        id: 'm_eldor_citadel',
        name: 'High Citadel of Eldor',
        type: 'marker',
        layerId: 'layer_landmarks',
        category: 'Capital Citadel',
        icon: 'castle',
        color: '#991b1b',
        size: 32,
        x: 760,
        y: 320,
        notes: 'Seat of King Cedric III. Triple-walled fortress carved from white limestone atop the Falconbluff Ridge.'
      },
      {
        id: 'm_dragon_peak',
        name: 'Mount Wyvern Peak',
        type: 'marker',
        layerId: 'layer_landmarks',
        category: 'Volcano',
        icon: 'mountain',
        color: '#475569',
        size: 30,
        x: 380,
        y: 130,
        notes: 'Elevation: 4,820m. Rumored lair of the ancient red dragon Ignisrex the Undying.'
      },
      {
        id: 'm_port_kraken',
        name: 'Port Kraken Haven',
        type: 'marker',
        layerId: 'layer_landmarks',
        category: 'Harbor City',
        icon: 'anchor',
        color: '#0284c7',
        size: 28,
        x: 910,
        y: 550,
        notes: 'Bustling maritime trade haven with privateer docks, dry docks, and arcane navigational guilds.'
      },
      {
        id: 'm_druid_shrine',
        name: 'Moonstone Sanctuary',
        type: 'marker',
        layerId: 'layer_landmarks',
        category: 'Holy Grove',
        icon: 'tree',
        color: '#16a34a',
        size: 26,
        x: 260,
        y: 220,
        notes: 'Sacred grove of monolithic standing stones aligned with celestial lunar eclipses.'
      },
      {
        id: 'm_sunken_crypt',
        name: 'Crypt of Forgotten Kings',
        type: 'marker',
        layerId: 'layer_landmarks',
        category: 'Dungeon',
        icon: 'skull',
        color: '#7e22ce',
        size: 26,
        x: 340,
        y: 470,
        notes: 'Subterranean mausoleum filled with undead spectral guardians and sealed arcane relics.'
      },
      {
        id: 'm_crossroad_inn',
        name: 'The Prancing Manticore Inn',
        type: 'marker',
        layerId: 'layer_landmarks',
        category: 'Tavern',
        icon: 'food',
        color: '#b45309',
        size: 24,
        x: 580,
        y: 290,
        notes: 'Popular wayside tavern known for spiced elderberry ale, bardic gossip, and mercenary hiring boards.'
      },

      // Labels
      {
        id: 'lbl_continent',
        name: 'Region Label',
        type: 'label',
        layerId: 'layer_labels',
        text: 'KINGDOM OF ELDORIA',
        fontSize: 22,
        fontFamily: "'Cinzel', serif",
        color: '#451a03',
        x: 560,
        y: 70,
        isBold: true
      },
      {
        id: 'lbl_ocean',
        name: 'Ocean Label',
        type: 'label',
        layerId: 'layer_labels',
        text: 'SEA OF MAELSTROMS',
        fontSize: 16,
        fontFamily: "'Cinzel', serif",
        color: '#1e3a8a',
        x: 940,
        y: 660,
        isBold: true
      }
    ]
  },

  // 2. Tokyo Explorer & Transit (Urban Travel Guide)
  travel: {
    id: 'proj_tokyo',
    name: 'Tokyo Explorer & Transit Map',
    description: 'Metropolitan guide featuring the Yamanote Line loop, iconic cultural districts, gastronomy hubs, and tourist landmarks.',
    themeId: 'clean',
    scaleRatio: 2, // 100px = 2 km
    scaleUnit: 'km',
    gridType: 'square',
    gridSize: 50,
    layers: [
      { id: 'layer_districts', name: 'Special Wards & Districts', visible: true, locked: false },
      { id: 'layer_transit', name: 'Transit Lines & Walkways', visible: true, locked: false },
      { id: 'layer_spots', name: 'Attractions & Gastronomy', visible: true, locked: false },
      { id: 'layer_labels', name: 'District Labels', visible: true, locked: false }
    ],
    objects: [
      // Districts
      {
        id: 'reg_shinjuku',
        name: 'Shinjuku Ward',
        type: 'region',
        layerId: 'layer_districts',
        category: 'Entertainment',
        fillColor: '#bfdbfe',
        strokeColor: '#3b82f6',
        strokeWidth: 2,
        opacity: 0.35,
        points: [
          { x: 220, y: 260 }, { x: 430, y: 220 }, { x: 470, y: 430 }, { x: 250, y: 470 }
        ],
        notes: 'Home to the world busiest train station, Tokyo Metropolitan Government Building, and Kabukicho nightlife.'
      },
      {
        id: 'reg_shibuya',
        name: 'Shibuya & Harajuku',
        type: 'region',
        layerId: 'layer_districts',
        category: 'Fashion & Culture',
        fillColor: '#fecdd3',
        strokeColor: '#f43f5e',
        strokeWidth: 2,
        opacity: 0.35,
        points: [
          { x: 250, y: 510 }, { x: 480, y: 460 }, { x: 520, y: 670 }, { x: 290, y: 690 }
        ],
        notes: 'Center of Japanese youth fashion, iconic scramble crossing, Meiji Jingu Shrine forest, and boutique cafes.'
      },
      {
        id: 'reg_chiyoda',
        name: 'Chiyoda & Ginza',
        type: 'region',
        layerId: 'layer_districts',
        category: 'Historic & Luxury',
        fillColor: '#bbf7d0',
        strokeColor: '#22c55e',
        strokeWidth: 2,
        opacity: 0.35,
        points: [
          { x: 580, y: 260 }, { x: 800, y: 270 }, { x: 790, y: 510 }, { x: 570, y: 490 }
        ],
        notes: 'Imperial Palace grounds, Tokyo Central Station brick facade, and upscale Ginza shopping boulevard.'
      },

      // Transit Routes
      {
        id: 'route_yamanote',
        name: 'JR Yamanote Line Loop',
        type: 'route',
        layerId: 'layer_transit',
        category: 'Train Loop',
        color: '#16a34a',
        width: 4.5,
        style: 'solid',
        points: [
          { x: 330, y: 340 }, { x: 370, y: 550 }, { x: 630, y: 620 },
          { x: 730, y: 410 }, { x: 670, y: 230 }, { x: 490, y: 200 }, { x: 330, y: 340 }
        ],
        notes: 'Circular line operated by JR East. Total journey time for 1 loop is approx. 59 minutes across 30 major stations.'
      },
      {
        id: 'route_chuo',
        name: 'JR Chuo Rapid Line',
        type: 'route',
        layerId: 'layer_transit',
        category: 'Express Line',
        color: '#ea580c',
        width: 3.5,
        style: 'dashed',
        points: [
          { x: 180, y: 340 }, { x: 330, y: 340 }, { x: 500, y: 350 }, { x: 730, y: 410 }
        ],
        notes: 'Direct east-west rapid connector connecting Shinjuku Station to Tokyo Station in 14 minutes.'
      },

      // Markers
      {
        id: 'm_shibuya_cross',
        name: 'Shibuya Scramble Crossing',
        type: 'marker',
        layerId: 'layer_spots',
        category: 'Landmark',
        icon: 'star',
        color: '#e11d48',
        size: 30,
        x: 370,
        y: 550,
        notes: 'Up to 3,000 pedestrians cross simultaneously during peak rush hour. Hachiko statue is located at Exit 8.'
      },
      {
        id: 'm_shinjuku_station',
        name: 'Shinjuku Main Terminal',
        type: 'marker',
        layerId: 'layer_spots',
        category: 'Transit Hub',
        icon: 'landmark',
        color: '#2563eb',
        size: 30,
        x: 330,
        y: 340,
        notes: 'Guinness World Record for busiest transit hub with over 3.5 million daily passengers and 200+ exits.'
      },
      {
        id: 'm_tokyo_station',
        name: 'Tokyo Central Station',
        type: 'marker',
        layerId: 'layer_spots',
        category: 'Shinkansen Hub',
        icon: 'landmark',
        color: '#b91c1c',
        size: 28,
        x: 730,
        y: 410,
        notes: 'Red-brick historic 1914 facade. Main gateway for Tokaido & Tohoku Shinkansen bullet trains.'
      },
      {
        id: 'm_skytree',
        name: 'Tokyo Skytree (634m)',
        type: 'marker',
        layerId: 'layer_spots',
        category: 'Observation Tower',
        icon: 'tower',
        color: '#0284c7',
        size: 32,
        x: 820,
        y: 190,
        notes: 'Tallest structure in Japan. Features 360-degree glass observation decks overlooking Mount Fuji on clear days.'
      },
      {
        id: 'm_sensoji',
        name: 'Senso-ji Buddhist Temple',
        type: 'marker',
        layerId: 'layer_spots',
        category: 'Historical Shrine',
        icon: 'castle',
        color: '#d97706',
        size: 26,
        x: 760,
        y: 180,
        notes: 'Tokyo oldest temple founded in 645 AD. Famous Kaminarimon Thunder Gate with giant red lantern.'
      },
      {
        id: 'm_ramen_st',
        name: 'Tokyo Ramen Street',
        type: 'marker',
        layerId: 'layer_spots',
        category: 'Dining',
        icon: 'food',
        color: '#ca8a04',
        size: 24,
        x: 720,
        y: 430,
        notes: 'Underground avenue in Tokyo Station hosting 8 world-renowned ramen shops including Rokurinsha tsukemen.'
      },

      // Labels
      {
        id: 'lbl_tokyo_title',
        name: 'Map Header',
        type: 'label',
        layerId: 'layer_labels',
        text: 'GREATER TOKYO TRANSIT GUIDE',
        fontSize: 20,
        fontFamily: "'Inter', sans-serif",
        color: '#0f172a',
        x: 540,
        y: 70,
        isBold: true
      }
    ]
  },

  // 3. Artemis IV Lunar Research Base (Hard Sci-Fi Colony Blueprint)
  blueprint: {
    id: 'proj_lunar_base',
    name: 'Artemis IV Lunar Outpost',
    description: 'Engineering layout blueprint for permanent lunar south pole habitat near Shackleton Crater.',
    themeId: 'blueprint',
    scaleRatio: 100, // 100px = 100 meters
    scaleUnit: 'm',
    gridType: 'square',
    gridSize: 50,
    layers: [
      { id: 'layer_sectors', name: 'Habitats & Pressurized Domes', visible: true, locked: false },
      { id: 'layer_pipelines', name: 'Cryogenic & Power Conduits', visible: true, locked: false },
      { id: 'layer_installations', name: 'Surface Facilities & Landing', visible: true, locked: false },
      { id: 'layer_tech_labels', name: 'Blueprint Callouts', visible: true, locked: false }
    ],
    objects: [
      {
        id: 'circ_dome_alpha',
        name: 'Habitat Bio-Dome Alpha',
        type: 'circle',
        layerId: 'layer_sectors',
        category: 'Living Quarters',
        fillColor: '#0077b6',
        strokeColor: '#64dfdf',
        strokeWidth: 2.5,
        radius: 85,
        x: 380,
        y: 340,
        opacity: 0.38,
        notes: 'Triple-redundant Kevlar-regolith dome supporting 48 permanent scientists and hydroponic aeroponics bay.'
      },
      {
        id: 'circ_dome_beta',
        name: 'Science & Geology Lab Beta',
        type: 'circle',
        layerId: 'layer_sectors',
        category: 'Laboratory',
        fillColor: '#023e8a',
        strokeColor: '#48cae4',
        strokeWidth: 2,
        radius: 65,
        x: 580,
        y: 340,
        opacity: 0.35,
        notes: 'Cleanroom facility dedicated to deep-core regolith isotope analysis and lunar seismology.'
      },
      {
        id: 'route_conduit_alpha',
        name: 'Primary Oxygen & Power Bus',
        type: 'route',
        layerId: 'layer_pipelines',
        category: 'Utility Grid',
        color: '#64dfdf',
        width: 4,
        style: 'dashed',
        points: [
          { x: 380, y: 340 }, { x: 580, y: 340 }, { x: 740, y: 220 }, { x: 860, y: 220 }
        ],
        notes: 'Vacuum-insulated cryogenic liquid oxygen line and 10kV superconducting power feed from the fission reactor.'
      },
      {
        id: 'm_landing_pad',
        name: 'Heavy Cargo Landing Pad 1',
        type: 'marker',
        layerId: 'layer_installations',
        category: 'Spaceport',
        icon: 'anchor',
        color: '#48cae4',
        size: 32,
        x: 860,
        y: 220,
        notes: 'Reinforced sintered-basalt launch pad with blast deflection berms for Starship HLS cargo landers.'
      },
      {
        id: 'm_solar_farm',
        name: 'Solar Array Alpha (Peak of Eternal Light)',
        type: 'marker',
        layerId: 'layer_installations',
        category: 'Power Plant',
        icon: 'star',
        color: '#90e0ef',
        size: 28,
        x: 240,
        y: 180,
        notes: 'Continuous 86% solar illumination along the crater rim generating 4.2 MW continuous electricity.'
      },
      {
        id: 'm_ice_drill',
        name: 'Shackleton Ice Extraction Drill',
        type: 'marker',
        layerId: 'layer_installations',
        category: 'Mining',
        icon: 'cave',
        color: '#caf0f8',
        size: 26,
        x: 480,
        y: 520,
        notes: 'Automated thermal sublimation mining rig recovering 500 liters/day water ice from permanently shadowed crater floor.'
      },
      {
        id: 'lbl_blueprint_hdr',
        name: 'Title Callout',
        type: 'label',
        layerId: 'layer_tech_labels',
        text: 'ARTEMIS IV LUNAR BASE // SECTOR 7-A',
        fontSize: 18,
        fontFamily: "'JetBrains Mono', monospace",
        color: '#64dfdf',
        x: 520,
        y: 80,
        isBold: true
      }
    ]
  },

  // 4. Archipelago of Sunken Galleons (Nautical Pirate Chart)
  nautical: {
    id: 'proj_archipelago',
    name: 'Archipelago of Sunken Galleons',
    description: '17th-century nautical chart featuring hidden coves, coral reefs, sunken armadas, and trade wind currents.',
    themeId: 'nautical',
    scaleRatio: 15, // 100px = 15 Nautical Miles
    scaleUnit: 'nm',
    gridType: 'square',
    gridSize: 70,
    layers: [
      { id: 'layer_islands', name: 'Islands & Coral Reefs', visible: true, locked: false },
      { id: 'layer_currents', name: 'Trade Currents & Shipping', visible: true, locked: false },
      { id: 'layer_wrecks', name: 'Ports, Reefs & Shipwrecks', visible: true, locked: false },
      { id: 'layer_chart_labels', name: 'Cartographic Labels', visible: true, locked: false }
    ],
    objects: [
      {
        id: 'reg_tortuga_isle',
        name: "Isla de la Muerte",
        type: 'region',
        layerId: 'layer_islands',
        category: 'Island',
        fillColor: '#94d2bd',
        strokeColor: '#0a9396',
        strokeWidth: 2,
        opacity: 0.4,
        points: [
          { x: 200, y: 220 }, { x: 380, y: 170 }, { x: 420, y: 350 }, { x: 260, y: 390 }
        ],
        notes: 'Dense volcanic island surrounded by knife-sharp coral barrier reefs. Safe harbor for privateer flotillas.'
      },
      {
        id: 'reg_siren_atoll',
        name: "Siren's Ring Atoll",
        type: 'region',
        layerId: 'layer_islands',
        category: 'Atoll',
        fillColor: '#83c5be',
        strokeColor: '#005f73',
        strokeWidth: 2,
        opacity: 0.35,
        points: [
          { x: 620, y: 320 }, { x: 840, y: 280 }, { x: 880, y: 460 }, { x: 660, y: 490 }
        ],
        notes: 'Circular shallow lagoon with turquoise waters and treacherous submerged sandbars.'
      },
      {
        id: 'route_trade_current',
        name: 'The Gulf Trade Winds Current',
        type: 'route',
        layerId: 'layer_currents',
        category: 'Shipping Lane',
        color: '#005f73',
        width: 3.5,
        style: 'dashed',
        points: [
          { x: 140, y: 480 }, { x: 360, y: 440 }, { x: 560, y: 410 }, { x: 780, y: 340 }, { x: 960, y: 220 }
        ],
        notes: 'Steady 4-knot easterly maritime current used by galleons transporting silver bullion back to Seville.'
      },
      {
        id: 'm_port_royale',
        name: 'Port Royale Free Haven',
        type: 'marker',
        layerId: 'layer_wrecks',
        category: 'Harbor Fortress',
        icon: 'anchor',
        color: '#005f73',
        size: 30,
        x: 320,
        y: 280,
        notes: 'Governor mansion, rum distilleries, shipyard drydock, and heavily fortified coastal cannon battery.'
      },
      {
        id: 'm_sunken_galleon',
        name: 'Wreck of the Santa Esperanza (1642)',
        type: 'marker',
        layerId: 'layer_wrecks',
        category: 'Sunken Treasure',
        icon: 'treasure',
        color: '#ca8a04',
        size: 28,
        x: 560,
        y: 410,
        notes: 'Depth: 28 fathoms. Spanish treasure frigate sunk during hurricane carrying 40 chests of Aztec gold coin.'
      },
      {
        id: 'm_dead_mans_reef',
        name: "Dead Man's Shallow Reef",
        type: 'marker',
        layerId: 'layer_wrecks',
        category: 'Maritime Hazard',
        icon: 'skull',
        color: '#ae2012',
        size: 26,
        x: 740,
        y: 380,
        notes: 'Uncharted submerged coral heads responsible for over a dozen recorded merchant shipwrecks.'
      },
      {
        id: 'lbl_sea_chart',
        name: 'Sea Chart Title',
        type: 'label',
        layerId: 'layer_chart_labels',
        text: 'CARIBBEAN ARCHIPELAGO NAVIGATIONAL CHART',
        fontSize: 18,
        fontFamily: "'Cinzel', serif",
        color: '#0c2340',
        x: 540,
        y: 80,
        isBold: true
      }
    ]
  }
};


/* --- MODULE: js/app.js --- */
/**
 * MapCraft - Master Cartography Workstation Orchestrator
 * Integrates Canvas 2D Renderer, Tools, Layer Hierarchy, Properties Inspector,
 * SVG & PNG Exporters, IndexedDB persistence, and Responsive Studio Workspace.
 */










class MapCraftApp {
  constructor() {
    this.canvas = document.getElementById('map-canvas');
    this.renderer = new MapRenderer(this.canvas);
    this.interaction = new MapInteraction(this.canvas, this);

    // Active project state
    this.project = JSON.parse(JSON.stringify(MAP_TEMPLATES.fantasy));
    this.activeLayerId = this.project.layers[0]?.id || 'layer_territories';
    this.selectedObjectId = null;
    this.selectedObject = null;
    this.hoveredObjectId = null;
    this.activeDrawing = null;

    // UI state
    this.activeSidebarTab = 'layers'; // layers, legend
    this.showGrid = true;
    this.snapToGridEnabled = false;
    this.showCompass = true;
    this.showScaleRuler = true;
    this.isSpacePressed = false;

    // History stack (Undo / Redo)
    this.undoStack = [];
    this.redoStack = [];
    this.maxHistory = 40;
  }

  async init() {
    await db.init();

    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    // Load saved project if exists
    try {
      const lastId = localStorage.getItem('mapcraft_last_project_id');
      if (lastId) {
        const saved = await db.loadProject(lastId);
        if (saved && saved.layers && saved.layers.length > 0) {
          this.project = saved;
          this.activeLayerId = this.project.layers[0]?.id || 'layer_default';
        }
      }
    } catch (e) {
      console.warn('Storage load error:', e);
    }

    this.setupToolbar();
    this.setupShortcuts();
    this.setupModals();
    this.renderAll();
    this.centerContent();
  }

  handleResize() {
    const container = document.getElementById('map-viewport-container');
    if (container && this.canvas) {
      this.renderer.resize(container.clientWidth, container.clientHeight);
      this.requestRender();
    }
  }

  requestRender() {
    this.renderer.render({
      project: this.project,
      activeLayerId: this.activeLayerId,
      selectedObjectId: this.selectedObjectId,
      selectedVertexIndex: this.interaction.selectedVertexIndex,
      hoveredObjectId: this.hoveredObjectId,
      activeDrawing: this.activeDrawing,
      scaleRatio: this.project.scaleRatio || 10,
      scaleUnit: this.project.scaleUnit || 'km',
      themeId: this.project.themeId || 'parchment',
      gridType: this.project.gridType || 'square',
      gridSize: this.project.gridSize || 50,
      showGrid: this.showGrid,
      showCompass: this.showCompass,
      showScaleRuler: this.showScaleRuler
    });
  }

  renderAll() {
    this.renderSidebar();
    this.renderInspector();
    this.updateZoomLabel();
    this.updateStats();
    this.requestRender();
  }

  // --- Toolbar Setup ---
  setupToolbar() {
    // Tool buttons
    const toolBtns = document.querySelectorAll('.btn-map-tool');
    toolBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.dataset.tool;
        this.setTool(tool);
      });
    });

    // Theme selector
    const themeSelect = document.getElementById('select-map-theme');
    if (themeSelect) {
      themeSelect.value = this.project.themeId || 'parchment';
      themeSelect.addEventListener('change', (e) => {
        this.project.themeId = e.target.value;
        this.renderAll();
        this.autoSave();
        this.showToast(`Theme changed to ${e.target.options[e.target.selectedIndex].text}`);
      });
    }

    // Template selector
    const templateSelect = document.getElementById('select-map-template');
    if (templateSelect) {
      templateSelect.addEventListener('change', (e) => {
        const key = e.target.value;
        if (MAP_TEMPLATES[key]) {
          if (confirm(`Load template "${MAP_TEMPLATES[key].name}"? Unsaved changes in the current map will be replaced.`)) {
            this.loadProject(JSON.parse(JSON.stringify(MAP_TEMPLATES[key])));
            this.showToast(`Loaded map template "${MAP_TEMPLATES[key].name}"`);
          }
        }
      });
    }

    // Undo / Redo
    document.getElementById('btn-undo')?.addEventListener('click', () => this.undo());
    document.getElementById('btn-redo')?.addEventListener('click', () => this.redo());

    // Zoom buttons
    document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
      this.renderer.camera.zoom = Math.min(12, this.renderer.camera.zoom * 1.25);
      this.requestRender();
      this.updateZoomLabel();
    });
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
      this.renderer.camera.zoom = Math.max(0.08, this.renderer.camera.zoom * 0.8);
      this.requestRender();
      this.updateZoomLabel();
    });
    document.getElementById('btn-zoom-percentage-label')?.addEventListener('click', () => {
      this.renderer.camera.zoom = 1;
      this.requestRender();
      this.updateZoomLabel();
    });
    document.getElementById('btn-fit-content')?.addEventListener('click', () => this.centerContent());

    // Grid toggle & Snap toggle
    const gridBtn = document.getElementById('btn-toggle-grid');
    gridBtn?.addEventListener('click', () => {
      this.showGrid = !this.showGrid;
      gridBtn.classList.toggle('active', this.showGrid);
      this.requestRender();
      this.showToast(this.showGrid ? 'Cartographic grid visible' : 'Cartographic grid hidden');
    });

    const snapBtn = document.getElementById('btn-toggle-snap');
    snapBtn?.addEventListener('click', () => {
      this.snapToGridEnabled = !this.snapToGridEnabled;
      snapBtn.classList.toggle('active', this.snapToGridEnabled);
      this.showToast(this.snapToGridEnabled ? 'Snap to Grid ON' : 'Snap to Grid OFF');
    });

    // Modals trigger buttons
    document.getElementById('btn-open-export-modal')?.addEventListener('click', () => this.openModal('modal-export'));
    document.getElementById('btn-open-settings-modal')?.addEventListener('click', () => this.openModal('modal-settings'));
    document.getElementById('btn-open-help-modal')?.addEventListener('click', () => this.openModal('modal-help'));

    // Sidebar Toggles for Responsive View
    document.getElementById('btn-toggle-left-sidebar')?.addEventListener('click', () => {
      document.querySelector('.map-sidebar-left')?.classList.toggle('collapsed');
      setTimeout(() => this.handleResize(), 200);
    });
    document.getElementById('btn-toggle-right-inspector')?.addEventListener('click', () => {
      document.querySelector('.map-inspector-right')?.classList.toggle('collapsed');
      setTimeout(() => this.handleResize(), 200);
    });

    // Import File input
    const importInput = document.getElementById('file-import-map');
    importInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          if (parsed && parsed.layers && Array.isArray(parsed.objects)) {
            this.loadProject(parsed);
            this.showToast(`Imported project: "${parsed.name || 'Map'}"`);
          } else {
            alert('Invalid MapCraft project structure.');
          }
        } catch (err) {
          alert('Failed to parse map JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
      importInput.value = '';
    });
  }

  setTool(toolName) {
    this.interaction.activeTool = toolName;
    document.querySelectorAll('.btn-map-tool').forEach(b => {
      b.classList.toggle('active', b.dataset.tool === toolName);
    });

    const cursorMap = {
      select: 'default',
      hand: 'grab',
      marker: 'crosshair',
      route: 'crosshair',
      region: 'crosshair',
      circle: 'crosshair',
      label: 'text',
      measure: 'crosshair'
    };
    const vp = document.getElementById('map-viewport-container');
    if (vp) vp.style.cursor = cursorMap[toolName] || 'crosshair';
  }

  setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      // Spacebar pan mode
      if (e.code === 'Space' && !this.isSpacePressed) {
        this.isSpacePressed = true;
        const vp = document.getElementById('map-viewport-container');
        if (vp) vp.style.cursor = 'grab';
      }

      // Escape -> Cancel selection or active drawing
      if (e.key === 'Escape') {
        this.selectObject(null);
        this.interaction.finishDrawing();
        this.closeAllModals();
      }

      // Enter -> Complete active drawing
      if (e.key === 'Enter' && this.interaction.drawingPoints.length > 0) {
        if (this.interaction.activeTool === 'route' && this.interaction.drawingPoints.length >= 2) {
          this.createRoute(this.interaction.drawingPoints);
          this.interaction.finishDrawing();
        } else if (this.interaction.activeTool === 'region' && this.interaction.drawingPoints.length >= 3) {
          this.createRegion(this.interaction.drawingPoints);
          this.interaction.finishDrawing();
        } else if (this.interaction.activeTool === 'measure') {
          this.interaction.finishDrawing();
        }
      }

      // Delete -> Delete selected object
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (this.interaction.drawingPoints.length > 0) {
          this.interaction.drawingPoints.pop();
          if (this.interaction.drawingPoints.length === 0) this.interaction.finishDrawing();
          else this.requestRender();
          return;
        }
        if (this.selectedObjectId) {
          this.deleteObject(this.selectedObjectId);
        }
      }

      // Duplicate (Ctrl+D)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (this.selectedObjectId) {
          this.duplicateObject(this.selectedObjectId);
        }
      }

      // Undo / Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        this.redo();
      }

      // Arrow keys micro-nudge selected object
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && this.selectedObject) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const dx = e.key === 'ArrowLeft' ? -step : (e.key === 'ArrowRight' ? step : 0);
        const dy = e.key === 'ArrowUp' ? -step : (e.key === 'ArrowDown' ? step : 0);

        if (this.selectedObject.points) {
          this.selectedObject.points.forEach(p => { p.x += dx; p.y += dy; });
        } else {
          this.selectedObject.x = (this.selectedObject.x || 0) + dx;
          this.selectedObject.y = (this.selectedObject.y || 0) + dy;
        }
        this.requestRender();
        this.renderInspector();
        this.autoSave();
      }

      // Tool hotkeys
      if (e.key === 'v' || e.key === 'V') this.setTool('select');
      if (e.key === 'h' || e.key === 'H') this.setTool('hand');
      if (e.key === 'm' || e.key === 'M') this.setTool('marker');
      if (e.key === 'r' || e.key === 'R') this.setTool('route');
      if (e.key === 'p' || e.key === 'P') this.setTool('region');
      if (e.key === 'c' || e.key === 'C') this.setTool('circle');
      if (e.key === 't' || e.key === 'T') this.setTool('label');
      if (e.key === 'x' || e.key === 'X') this.setTool('measure');
      if (e.key === 's' || e.key === 'S') {
        this.snapToGridEnabled = !this.snapToGridEnabled;
        document.getElementById('btn-toggle-snap')?.classList.toggle('active', this.snapToGridEnabled);
        this.showToast(this.snapToGridEnabled ? 'Snap ON' : 'Snap OFF');
      }
      if (e.key === 'g' || e.key === 'G') {
        this.showGrid = !this.showGrid;
        document.getElementById('btn-toggle-grid')?.classList.toggle('active', this.showGrid);
        this.requestRender();
      }
      if (e.key === '?') this.openModal('modal-help');
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        this.isSpacePressed = false;
        this.setTool(this.interaction.activeTool);
      }
    });
  }

  // --- Modals Setup ---
  setupModals() {
    // Close modal triggers
    document.querySelectorAll('.btn-close-modal, .modal-backdrop').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target === el) this.closeAllModals();
      });
    });

    // Export Modal Actions
    document.getElementById('btn-do-export-png-1x')?.addEventListener('click', () => {
      this.exportPNG(1);
      this.closeAllModals();
    });
    document.getElementById('btn-do-export-png-2x')?.addEventListener('click', () => {
      this.exportPNG(2);
      this.closeAllModals();
    });
    document.getElementById('btn-do-export-svg')?.addEventListener('click', () => {
      this.exportSVG();
      this.closeAllModals();
    });
    document.getElementById('btn-do-export-json')?.addEventListener('click', () => {
      this.exportJSON();
      this.closeAllModals();
    });
    document.getElementById('btn-do-export-geojson')?.addEventListener('click', () => {
      this.exportGeoJSON();
      this.closeAllModals();
    });
    document.getElementById('btn-do-print')?.addEventListener('click', () => {
      window.print();
      this.closeAllModals();
    });
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
    }
  }

  closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  }

  // --- Object Creation Actions ---
  createMarkerAt(wx, wy) {
    this.recordHistory('Add Marker');
    const marker = {
      id: 'm_' + Date.now(),
      name: 'Marker ' + (this.project.objects.length + 1),
      type: 'marker',
      layerId: this.activeLayerId,
      category: 'Landmark',
      icon: 'pin',
      color: '#38bdf8',
      size: 28,
      x: wx,
      y: wy,
      notes: ''
    };
    this.project.objects.push(marker);
    this.selectObject(marker.id);
    this.renderAll();
    this.autoSave();
    this.showToast(`Placed Marker: "${marker.name}"`);
  }

  createRoute(points) {
    this.recordHistory('Add Route');
    const route = {
      id: 'route_' + Date.now(),
      name: 'Route ' + (this.project.objects.length + 1),
      type: 'route',
      layerId: this.activeLayerId,
      category: 'Trail',
      color: '#e63946',
      width: 3.5,
      style: 'solid',
      hasArrow: true,
      points: JSON.parse(JSON.stringify(points)),
      notes: ''
    };
    this.project.objects.push(route);
    this.selectObject(route.id);
    this.renderAll();
    this.autoSave();
    this.showToast(`Created Route with ${points.length} waypoints`);
  }

  createRegion(points) {
    this.recordHistory('Add Region');
    const region = {
      id: 'reg_' + Date.now(),
      name: 'Region ' + (this.project.objects.length + 1),
      type: 'region',
      layerId: this.activeLayerId,
      category: 'Territory',
      fillColor: '#38bdf8',
      strokeColor: '#0284c7',
      strokeWidth: 2,
      opacity: 0.35,
      pattern: 'solid',
      points: JSON.parse(JSON.stringify(points)),
      notes: ''
    };
    this.project.objects.push(region);
    this.selectObject(region.id);
    this.renderAll();
    this.autoSave();
    this.showToast(`Drawn Region with ${points.length} vertices`);
  }

  createCircle(x, y, radius) {
    this.recordHistory('Add Circle Zone');
    const circle = {
      id: 'circ_' + Date.now(),
      name: 'Zone ' + (this.project.objects.length + 1),
      type: 'circle',
      layerId: this.activeLayerId,
      category: 'Zone',
      fillColor: '#38bdf8',
      strokeColor: '#0284c7',
      strokeWidth: 2,
      radius,
      x,
      y,
      opacity: 0.35,
      notes: ''
    };
    this.project.objects.push(circle);
    this.selectObject(circle.id);
    this.renderAll();
    this.autoSave();
    this.showToast(`Placed Circular Zone (${radius}px radius)`);
  }

  createLabelAt(wx, wy) {
    this.recordHistory('Add Label');
    const label = {
      id: 'lbl_' + Date.now(),
      name: 'Text Label',
      type: 'label',
      layerId: this.activeLayerId,
      text: 'New Label',
      fontSize: 16,
      fontFamily: "'Inter', sans-serif",
      color: '#0f172a',
      x: wx,
      y: wy,
      rotation: 0,
      isBold: true
    };
    this.project.objects.push(label);
    this.selectObject(label.id);
    this.renderAll();
    this.autoSave();
    this.showToast(`Placed Label: "${label.text}"`);
  }

  selectObject(id) {
    this.selectedObjectId = id;
    this.selectedObject = id ? this.project.objects.find(o => o.id === id) || null : null;
    this.interaction.selectedVertexIndex = null;
    this.renderInspector();
    this.requestRender();
  }

  deleteObject(id) {
    this.recordHistory('Delete Element');
    const idx = this.project.objects.findIndex(o => o.id === id);
    if (idx !== -1) {
      const removed = this.project.objects.splice(idx, 1)[0];
      this.selectObject(null);
      this.renderAll();
      this.autoSave();
      this.showToast(`Deleted "${removed.name || removed.type}"`);
    }
  }

  duplicateObject(id) {
    const obj = this.project.objects.find(o => o.id === id);
    if (!obj) return;

    this.recordHistory('Duplicate Element');
    const clone = JSON.parse(JSON.stringify(obj));
    clone.id = obj.type.slice(0, 3) + '_' + Date.now();
    clone.name = (obj.name || 'Element') + ' (Copy)';

    if (clone.points) {
      clone.points.forEach(p => { p.x += 30; p.y += 30; });
    } else {
      clone.x = (clone.x || 0) + 30;
      clone.y = (clone.y || 0) + 30;
    }

    this.project.objects.push(clone);
    this.selectObject(clone.id);
    this.renderAll();
    this.autoSave();
    this.showToast(`Duplicated "${clone.name}"`);
  }

  reorderObject(id, action) {
    const objs = this.project.objects;
    const idx = objs.findIndex(o => o.id === id);
    if (idx === -1) return;

    this.recordHistory('Reorder Stacking');
    const item = objs.splice(idx, 1)[0];

    if (action === 'front') {
      objs.push(item);
    } else if (action === 'back') {
      objs.unshift(item);
    } else if (action === 'forward') {
      const target = Math.min(objs.length, idx + 1);
      objs.splice(target, 0, item);
    } else if (action === 'backward') {
      const target = Math.max(0, idx - 1);
      objs.splice(target, 0, item);
    }

    this.renderAll();
    this.autoSave();
  }

  centerOnObject(obj) {
    let targetX = obj.x || 0;
    let targetY = obj.y || 0;

    if (obj.points && obj.points.length > 0) {
      let sx = 0, sy = 0;
      obj.points.forEach(p => { sx += p.x; sy += p.y; });
      targetX = sx / obj.points.length;
      targetY = sy / obj.points.length;
    }

    const cw = this.canvas.width / this.renderer.dpr;
    const ch = this.canvas.height / this.renderer.dpr;
    this.renderer.camera.x = cw / 2 - targetX * this.renderer.camera.zoom;
    this.renderer.camera.y = ch / 2 - targetY * this.renderer.camera.zoom;
    this.requestRender();
  }

  centerContent() {
    const objects = this.project.objects || [];
    const cw = this.canvas.width / this.renderer.dpr;
    const ch = this.canvas.height / this.renderer.dpr;

    if (objects.length === 0) {
      this.renderer.camera.x = cw / 2;
      this.renderer.camera.y = ch / 2;
      this.renderer.camera.zoom = 1;
      this.requestRender();
      this.updateZoomLabel();
      return;
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const obj of objects) {
      if (obj.points) {
        obj.points.forEach(p => {
          minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
          minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
        });
      } else if (obj.x !== undefined && obj.y !== undefined) {
        const r = obj.radius || obj.size || 25;
        minX = Math.min(minX, obj.x - r); maxX = Math.max(maxX, obj.x + r);
        minY = Math.min(minY, obj.y - r); maxY = Math.max(maxY, obj.y + r);
      }
    }

    const pad = 100;
    const contentW = Math.max(100, (maxX - minX) + pad * 2);
    const contentH = Math.max(100, (maxY - minY) + pad * 2);

    const zoom = Math.min(2.5, Math.max(0.15, Math.min(cw / contentW, ch / contentH)));
    this.renderer.camera.zoom = zoom;
    this.renderer.camera.x = cw / 2 - ((minX + maxX) / 2) * zoom;
    this.renderer.camera.y = ch / 2 - ((minY + maxY) / 2) * zoom;

    this.requestRender();
    this.updateZoomLabel();
  }

  // --- Sidebar & Panels ---
  renderSidebar() {
    const container = document.getElementById('sidebar-panel-container');
    if (!container) return;

    if (this.activeSidebarTab === 'layers') {
      renderLayerPanel(container, {
        layers: this.project.layers || [],
        activeLayerId: this.activeLayerId,
        objects: this.project.objects || [],
        onSelectLayer: (id) => {
          this.activeLayerId = id;
          this.renderSidebar();
        },
        onAddLayer: (name) => {
          this.recordHistory('Add Layer');
          const newLayer = { id: 'layer_' + Date.now(), name, visible: true, locked: false };
          this.project.layers.push(newLayer);
          this.activeLayerId = newLayer.id;
          this.renderSidebar();
          this.autoSave();
          this.showToast(`Added layer "${name}"`);
        },
        onRenameLayer: (id, name) => {
          const l = this.project.layers.find(x => x.id === id);
          if (l) {
            this.recordHistory('Rename Layer');
            l.name = name;
            this.renderSidebar();
            this.autoSave();
          }
        },
        onDuplicateLayer: (id) => {
          const l = this.project.layers.find(x => x.id === id);
          if (!l) return;
          this.recordHistory('Duplicate Layer');
          const newId = 'layer_' + Date.now();
          const cloneLayer = { ...l, id: newId, name: l.name + ' (Copy)' };
          this.project.layers.push(cloneLayer);

          // Duplicate all objects on this layer
          const layerObjs = this.project.objects.filter(o => o.layerId === id);
          for (const o of layerObjs) {
            const cloneObj = JSON.parse(JSON.stringify(o));
            cloneObj.id = o.type.slice(0, 3) + '_' + Math.random().toString(36).substr(2, 9);
            cloneObj.layerId = newId;
            if (cloneObj.points) {
              cloneObj.points.forEach(p => { p.x += 20; p.y += 20; });
            } else {
              cloneObj.x = (cloneObj.x || 0) + 20;
              cloneObj.y = (cloneObj.y || 0) + 20;
            }
            this.project.objects.push(cloneObj);
          }

          this.activeLayerId = newId;
          this.renderAll();
          this.autoSave();
          this.showToast(`Duplicated layer "${cloneLayer.name}"`);
        },
        onDeleteLayer: (id) => {
          this.recordHistory('Delete Layer');
          this.project.layers = this.project.layers.filter(l => l.id !== id);
          this.project.objects = this.project.objects.filter(o => o.layerId !== id);
          this.activeLayerId = this.project.layers[0]?.id || 'layer_default';
          this.renderAll();
          this.autoSave();
          this.showToast('Layer deleted');
        },
        onToggleVisibility: (id) => {
          const l = this.project.layers.find(x => x.id === id);
          if (l) {
            l.visible = l.visible === false ? true : false;
            this.renderAll();
          }
        },
        onToggleLock: (id) => {
          const l = this.project.layers.find(x => x.id === id);
          if (l) {
            l.locked = !l.locked;
            this.renderSidebar();
          }
        },
        onMoveLayer: (idx, dir) => {
          const target = idx + dir;
          if (target >= 0 && target < this.project.layers.length) {
            const temp = this.project.layers[idx];
            this.project.layers[idx] = this.project.layers[target];
            this.project.layers[target] = temp;
            this.renderAll();
            this.autoSave();
          }
        }
      });
    } else {
      renderLegendPanel(container, {
        project: this.project,
        onSelectObject: (id) => this.selectObject(id),
        onCenterObject: (obj) => this.centerOnObject(obj)
      });
    }
  }

  renderInspector() {
    const container = document.getElementById('inspector-panel-container');
    if (!container) return;

    renderInspector(container, {
      selectedObject: this.selectedObject,
      project: this.project,
      onObjectChange: () => {
        this.requestRender();
        this.autoSave();
      },
      onProjectChange: () => {
        this.renderAll();
        this.autoSave();
      },
      onDeleteObject: (id) => this.deleteObject(id),
      onDuplicateObject: (id) => this.duplicateObject(id),
      onCenterObject: (obj) => this.centerOnObject(obj),
      onReorderObject: (id, action) => this.reorderObject(id, action)
    });
  }

  // --- History (Undo / Redo) ---
  recordHistory(actionName = 'Edit') {
    this.undoStack.push(JSON.stringify(this.project));
    if (this.undoStack.length > this.maxHistory) this.undoStack.shift();
    this.redoStack = [];
    this.updateUndoRedoUI();
  }

  undo() {
    if (this.undoStack.length === 0) return;
    this.redoStack.push(JSON.stringify(this.project));
    const previous = JSON.parse(this.undoStack.pop());
    this.project = previous;
    this.selectObject(null);
    this.renderAll();
    this.updateUndoRedoUI();
    this.autoSave();
    this.showToast('Undo');
  }

  redo() {
    if (this.redoStack.length === 0) return;
    this.undoStack.push(JSON.stringify(this.project));
    const next = JSON.parse(this.redoStack.pop());
    this.project = next;
    this.selectObject(null);
    this.renderAll();
    this.updateUndoRedoUI();
    this.autoSave();
    this.showToast('Redo');
  }

  updateUndoRedoUI() {
    const uBtn = document.getElementById('btn-undo');
    const rBtn = document.getElementById('btn-redo');
    if (uBtn) uBtn.disabled = this.undoStack.length === 0;
    if (rBtn) rBtn.disabled = this.redoStack.length === 0;
  }

  // --- Export Engines ---
  exportPNG(scaleMultiplier = 1) {
    const originalDpr = this.renderer.dpr;
    const cw = this.canvas.width / originalDpr;
    const ch = this.canvas.height / originalDpr;

    // Create off-screen canvas at requested scale
    const offCanvas = document.createElement('canvas');
    offCanvas.width = Math.round(cw * scaleMultiplier);
    offCanvas.height = Math.round(ch * scaleMultiplier);

    const offRenderer = new MapRenderer(offCanvas);
    offRenderer.dpr = scaleMultiplier;
    offRenderer.camera = { ...this.renderer.camera };

    offRenderer.render({
      project: this.project,
      activeLayerId: this.activeLayerId,
      selectedObjectId: null,
      hoveredObjectId: null,
      activeDrawing: null,
      scaleRatio: this.project.scaleRatio || 10,
      scaleUnit: this.project.scaleUnit || 'km',
      themeId: this.project.themeId || 'parchment',
      gridType: this.project.gridType || 'square',
      gridSize: this.project.gridSize || 50,
      showGrid: this.showGrid,
      showCompass: this.showCompass,
      showScaleRuler: this.showScaleRuler
    });

    const url = offCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = (this.project.name || 'map').toLowerCase().replace(/\s+/g, '_') + `@${scaleMultiplier}x.png`;
    a.click();
    this.showToast(`Exported ${scaleMultiplier}x High-Res PNG`);
  }

  exportSVG() {
    const w = this.canvas.width / this.renderer.dpr;
    const h = this.canvas.height / this.renderer.dpr;
    const cam = this.renderer.camera;

    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">\n`;
    svgContent += `  <rect width="100%" height="100%" fill="#f2e6cf" />\n`;
    svgContent += `  <g transform="translate(${cam.x}, ${cam.y}) scale(${cam.zoom})">\n`;

    for (const obj of this.project.objects || []) {
      if (obj.visible === false) continue;

      if (obj.type === 'region' && obj.points) {
        const ptsStr = obj.points.map(p => `${p.x},${p.y}`).join(' ');
        svgContent += `    <polygon points="${ptsStr}" fill="${obj.fillColor || '#38bdf8'}" fill-opacity="${obj.opacity || 0.35}" stroke="${obj.strokeColor || '#0284c7'}" stroke-width="${obj.strokeWidth || 2}" />\n`;
      } else if (obj.type === 'circle') {
        svgContent += `    <circle cx="${obj.x}" cy="${obj.y}" r="${obj.radius || 50}" fill="${obj.fillColor || '#38bdf8'}" fill-opacity="${obj.opacity || 0.35}" stroke="${obj.strokeColor || '#0284c7'}" stroke-width="${obj.strokeWidth || 2}" />\n`;
      } else if (obj.type === 'route' && obj.points) {
        const ptsStr = obj.points.map(p => `${p.x},${p.y}`).join(' ');
        svgContent += `    <polyline points="${ptsStr}" fill="none" stroke="${obj.color || '#e63946'}" stroke-width="${obj.width || 3.5}" stroke-linecap="round" stroke-linejoin="round" />\n`;
      } else if (obj.type === 'marker') {
        svgContent += `    <g transform="translate(${obj.x}, ${obj.y})">\n`;
        svgContent += `      <circle cx="0" cy="-14" r="14" fill="${obj.color || '#38bdf8'}" />\n`;
        svgContent += `      <text x="0" y="14" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#000">${escapeHTML(obj.name || '')}</text>\n`;
        svgContent += `    </g>\n`;
      } else if (obj.type === 'label') {
        svgContent += `    <text x="${obj.x}" y="${obj.y}" font-family="${obj.fontFamily || 'sans-serif'}" font-size="${obj.fontSize || 16}" font-weight="${obj.isBold !== false ? 'bold' : 'normal'}" text-anchor="middle" fill="${obj.color || '#000'}">${escapeHTML(obj.text || '')}</text>\n`;
      }
    }

    svgContent += `  </g>\n</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (this.project.name || 'map').toLowerCase().replace(/\s+/g, '_') + '.svg';
    a.click();
    this.showToast('Exported Standalone SVG Vector Map');
  }

  exportJSON() {
    const json = JSON.stringify(this.project, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (this.project.name || 'map').toLowerCase().replace(/\s+/g, '_') + '.mapcraft.json';
    a.click();
    this.showToast('Exported MapCraft Project JSON');
  }

  exportGeoJSON() {
    const geo = {
      type: 'FeatureCollection',
      name: this.project.name || 'MapCraft Project',
      features: (this.project.objects || []).map(obj => {
        let geometry = null;
        if (obj.type === 'marker' || obj.type === 'label') {
          geometry = { type: 'Point', coordinates: [obj.x, obj.y] };
        } else if (obj.type === 'route' && obj.points) {
          geometry = { type: 'LineString', coordinates: obj.points.map(p => [p.x, p.y]) };
        } else if (obj.type === 'region' && obj.points) {
          const closed = [...obj.points, obj.points[0]];
          geometry = { type: 'Polygon', coordinates: [closed.map(p => [p.x, p.y])] };
        }

        return {
          type: 'Feature',
          properties: {
            id: obj.id,
            name: obj.name || obj.text,
            type: obj.type,
            category: obj.category,
            notes: obj.notes,
            color: obj.color || obj.fillColor
          },
          geometry
        };
      }).filter(f => f.geometry !== null)
    };

    const blob = new Blob([JSON.stringify(geo, null, 2)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (this.project.name || 'map').toLowerCase().replace(/\s+/g, '_') + '.geojson';
    a.click();
    this.showToast('Exported Standard GeoJSON Dataset');
  }

  loadProject(projectData) {
    this.project = projectData;
    this.activeLayerId = this.project.layers[0]?.id || 'layer_default';
    this.selectObject(null);
    this.undoStack = [];
    this.redoStack = [];

    // Sync theme select dropdown
    const themeSelect = document.getElementById('select-map-theme');
    if (themeSelect && this.project.themeId) {
      themeSelect.value = this.project.themeId;
    }

    this.renderAll();
    this.centerContent();
    this.autoSave();
  }

  autoSave() {
    db.saveProject(this.project);
    this.updateStats();
  }

  updateZoomLabel() {
    const zLabel = document.getElementById('zoom-percentage-label');
    if (zLabel) {
      zLabel.textContent = Math.round(this.renderer.camera.zoom * 100) + '%';
    }
  }

  updateCoordinates(wx, wy) {
    const coordEl = document.getElementById('map-coordinates-readout');
    if (coordEl) {
      coordEl.textContent = `X: ${wx}, Y: ${wy}`;
    }
  }

  updateStats() {
    const statsEl = document.getElementById('map-stats-readout');
    if (statsEl) {
      const objCount = (this.project.objects || []).length;
      const layerCount = (this.project.layers || []).length;
      statsEl.innerHTML = `Elements: <strong>${objCount}</strong> &bull; Layers: <strong>${layerCount}</strong>`;
    }
  }

  showToast(msg) {
    let container = document.getElementById('map-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'map-toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-bubble';
    toast.textContent = msg;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 2400);
  }
}

// Bootstrap Application
function startMapCraft() {
  const app = new MapCraftApp();
  window.mapCraftApp = app;
  app.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startMapCraft);
} else {
  startMapCraft();
}


})();
