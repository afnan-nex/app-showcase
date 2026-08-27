/**
 * ReceiptVault - Standalone Document & Warranty Management Digital Filing Cabinet Bundle
 * 100% Client-Side, Zero Server Backend, Works on HTTP & file:///
 */

(function() {
'use strict';


/* --- MODULE: js/core/icons.js --- */
/**
 * ReceiptVault - Local SVG Icons Registry
 * Crisp document, receipt, warranty, financial, and viewer icons.
 */

const ICONS = {
  receipt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"></path><path d="M8 7h8"></path><path d="M8 11h8"></path><path d="M8 15h5"></path></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
  shieldCheck: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>`,
  shieldAlert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  dollar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
  tag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path><path d="M7 7h.01"></path></svg>`,
  folder: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path></svg>`,
  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
  zoomIn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`,
  zoomOut: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`,
  rotate: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>`,
  fullscreen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>`,
  upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
  alertTriangle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  printer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
  contrast: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor"></path></svg>`,
  filter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  chevronLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
  chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
  arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
  sparkles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>`,
  externalLink: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`,
  fileText: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
  refreshCw: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
  menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`
};

function getIcon(name, extraClass = '') {
  const svg = ICONS[name] || ICONS.receipt;
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

ICONS;


/* --- MODULE: js/core/warranty.js --- */
/**
 * ReceiptVault - Warranty & Return Deadline Engine
 * Calculates remaining durations, expiration status tags, progress percentages, and protected asset valuations.
 */

const WARRANTY_STATUS = {
  ACTIVE: 'ACTIVE',
  EXPIRING_SOON: 'EXPIRING_SOON',
  EXPIRED: 'EXPIRED',
  NONE: 'NONE'
};

const RETURN_STATUS = {
  OPEN: 'OPEN',
  CLOSING_SOON: 'CLOSING_SOON',
  CLOSED: 'CLOSED',
  NONE: 'NONE'
};

/**
 * Parses any date string, timestamp, or object into a sanitized midnight Date object
 */
function parseDateSafe(dateInput) {
  if (!dateInput) return null;
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Returns warranty countdown, status tag, remaining days, and elapsed percentage
 */
function getWarrantyInfo(warrantyExpirationDate, referenceDate = new Date(), purchaseDate = null) {
  if (!warrantyExpirationDate) {
    return { status: WARRANTY_STATUS.NONE, daysRemaining: null, label: 'No Warranty', color: 'muted', progressPercent: 0 };
  }

  const exp = parseDateSafe(warrantyExpirationDate);
  if (!exp) {
    return { status: WARRANTY_STATUS.NONE, daysRemaining: null, label: 'Invalid Date', color: 'muted', progressPercent: 0 };
  }

  const today = parseDateSafe(referenceDate) || new Date();
  today.setHours(0, 0, 0, 0);

  const diffMs = exp.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  // Calculate elapsed progress percentage if purchase date available
  let progressPercent = 0;
  if (purchaseDate) {
    const start = parseDateSafe(purchaseDate);
    if (start && start.getTime() < exp.getTime()) {
      const totalSpan = exp.getTime() - start.getTime();
      const elapsed = today.getTime() - start.getTime();
      progressPercent = Math.min(100, Math.max(0, Math.round((elapsed / totalSpan) * 100)));
    }
  }

  if (daysRemaining < 0) {
    const daysAgo = Math.abs(daysRemaining);
    return {
      status: WARRANTY_STATUS.EXPIRED,
      daysRemaining,
      label: daysAgo === 1 ? 'Expired yesterday' : `Expired (${daysAgo}d ago)`,
      color: 'muted',
      progressPercent: 100
    };
  }

  if (daysRemaining === 0) {
    return {
      status: WARRANTY_STATUS.EXPIRING_SOON,
      daysRemaining: 0,
      label: 'Expires Today',
      color: 'rose',
      progressPercent: 99
    };
  }

  if (daysRemaining <= 30) {
    return {
      status: WARRANTY_STATUS.EXPIRING_SOON,
      daysRemaining,
      label: daysRemaining === 1 ? 'Expires Tomorrow' : `Expiring Soon (${daysRemaining}d)`,
      color: 'amber',
      progressPercent
    };
  }

  const monthsRemaining = Math.round(daysRemaining / 30.4);
  const yearsRemaining = (daysRemaining / 365.25).toFixed(1);

  let durationLabel = `${daysRemaining}d left`;
  if (daysRemaining > 365) {
    durationLabel = `${yearsRemaining}y left (${daysRemaining}d)`;
  } else if (daysRemaining > 60) {
    durationLabel = `~${monthsRemaining} mo left`;
  }

  return {
    status: WARRANTY_STATUS.ACTIVE,
    daysRemaining,
    label: `Active (${durationLabel})`,
    color: 'emerald',
    progressPercent
  };
}

/**
 * Returns return window deadline status, days remaining, and status tag
 */
function getReturnInfo(returnDeadlineDate, referenceDate = new Date()) {
  if (!returnDeadlineDate) {
    return { status: RETURN_STATUS.NONE, daysRemaining: null, label: 'No Return Policy', color: 'muted' };
  }

  const deadline = parseDateSafe(returnDeadlineDate);
  if (!deadline) {
    return { status: RETURN_STATUS.NONE, daysRemaining: null, label: 'Invalid Date', color: 'muted' };
  }

  const today = parseDateSafe(referenceDate) || new Date();
  today.setHours(0, 0, 0, 0);

  const diffMs = deadline.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return {
      status: RETURN_STATUS.CLOSED,
      daysRemaining,
      label: 'Window Closed',
      color: 'muted'
    };
  }

  if (daysRemaining === 0) {
    return {
      status: RETURN_STATUS.CLOSING_SOON,
      daysRemaining: 0,
      label: 'Return Closes Today',
      color: 'rose'
    };
  }

  if (daysRemaining <= 5) {
    return {
      status: RETURN_STATUS.CLOSING_SOON,
      daysRemaining,
      label: daysRemaining === 1 ? 'Closes Tomorrow' : `Closing Soon (${daysRemaining}d)`,
      color: 'amber'
    };
  }

  return {
    status: RETURN_STATUS.OPEN,
    daysRemaining,
    label: `Return Open (${daysRemaining}d left)`,
    color: 'primary'
  };
}

/**
 * Calculates comprehensive vault metrics and analytics
 */
function calculateVaultMetrics(documents = [], referenceDate = new Date()) {
  let totalSpend = 0;
  let protectedAssetValue = 0;
  let expiredWarrantyValue = 0;
  let activeWarrantiesCount = 0;
  let expiringSoonWarrantiesCount = 0;
  let expiredWarrantiesCount = 0;
  let openReturnsCount = 0;

  for (const doc of documents) {
    const amt = Number(doc.amount) || 0;
    totalSpend += amt;

    const wInfo = getWarrantyInfo(doc.warrantyExpirationDate, referenceDate, doc.purchaseDate);
    if (wInfo.status === WARRANTY_STATUS.ACTIVE || wInfo.status === WARRANTY_STATUS.EXPIRING_SOON) {
      protectedAssetValue += amt;
      activeWarrantiesCount++;
      if (wInfo.status === WARRANTY_STATUS.EXPIRING_SOON) {
        expiringSoonWarrantiesCount++;
      }
    } else if (wInfo.status === WARRANTY_STATUS.EXPIRED) {
      expiredWarrantyValue += amt;
      expiredWarrantiesCount++;
    }

    const rInfo = getReturnInfo(doc.returnDeadlineDate, referenceDate);
    if (rInfo.status === RETURN_STATUS.OPEN || rInfo.status === RETURN_STATUS.CLOSING_SOON) {
      openReturnsCount++;
    }
  }

  const coverageRatio = totalSpend > 0 ? (protectedAssetValue / totalSpend) * 100 : 0;
  const avgAmount = documents.length > 0 ? totalSpend / documents.length : 0;

  return {
    totalSpend,
    protectedAssetValue,
    expiredWarrantyValue,
    coverageRatio: Math.round(coverageRatio),
    avgAmount,
    activeWarrantiesCount,
    expiringSoonWarrantiesCount,
    expiredWarrantiesCount,
    openReturnsCount,
    totalDocuments: documents.length
  };
}


/* --- MODULE: js/engine/sample-data.js --- */
/**
 * ReceiptVault - Pre-Loaded Demonstration Receipts & Procedural Vector Document Artwork
 * Generates rich realistic sample receipts, warranties, return deadlines, and high-fidelity simulated receipt canvases.
 */

function getRelativeDateStr(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
}

const SAMPLE_DOCUMENTS = [
  {
    id: 'doc_apple_macbook',
    title: 'MacBook Pro 16" M3 Max (36GB RAM / 1TB SSD)',
    vendor: 'Apple Store Fifth Avenue',
    vendorAddress: '767 5th Ave, New York, NY 10153',
    vendorPhone: '+1 (212) 336-1440',
    invoiceNumber: 'W89123049-NYC',
    serialNumber: 'C02G408MQ6L4',
    amount: 3499.00,
    taxAmount: 310.54,
    currency: '$',
    purchaseDate: '2023-11-20',
    category: 'Electronics',
    paymentMethod: 'Apple Pay (Amex •••• 1009)',
    warrantyType: '3-Year AppleCare+ with Accidental Damage',
    warrantyProvider: 'AppleCare Services',
    warrantyExpirationDate: '2026-11-20', // 3-Year Active
    returnDeadlineDate: '2023-12-04',
    returnPolicy: '14-day standard Apple return window',
    supportUrl: 'https://mysupport.apple.com',
    notes: 'Includes 3 years of AppleCare+ Protection. Serial #C02G408MQ6L4. Space Black finish. MagSafe 3 cable & 140W USB-C adapter.',
    tags: ['work', 'laptop', 'applecare', 'hardware', 'tax-deductible'],
    fileName: 'Apple_Store_Invoice_W89123049.png',
    items: [
      { name: 'MacBook Pro 16" M3 Max 36GB/1TB', qty: 1, price: 3499.00 },
      { name: 'AppleCare+ for 16" MacBook Pro', qty: 1, price: 399.00 },
      { name: '140W USB-C Power Adapter & Cable', qty: 1, price: 0.00 }
    ]
  },
  {
    id: 'doc_sony_headphones',
    title: 'Sony WH-1000XM5 Noise Canceling Headphones',
    vendor: 'Best Buy Midtown',
    vendorAddress: '529 5th Ave, New York, NY 10017',
    vendorPhone: '+1 (212) 808-0309',
    invoiceNumber: 'BBY-01-9920194',
    serialNumber: 'SN-8829103-SLV',
    amount: 398.00,
    taxAmount: 35.32,
    currency: '$',
    purchaseDate: getRelativeDateStr(-340),
    category: 'Electronics',
    paymentMethod: 'Visa •••• 4821',
    warrantyType: '1-Year Manufacturer Warranty',
    warrantyProvider: 'Sony Electronics USA',
    warrantyExpirationDate: getRelativeDateStr(25), // Expiring Soon (25 days left!)
    returnDeadlineDate: getRelativeDateStr(-325),
    returnPolicy: '15-day standard Best Buy return period',
    supportUrl: 'https://electronics.sony.com/support',
    notes: 'Silver finish. Best Buy Geek Squad plan eligible. Serial #SN-8829103-SLV. Includes travel case and 3.5mm cable.',
    tags: ['audio', 'noise-canceling', 'travel', 'accessories'],
    fileName: 'BestBuy_Sony_XM5_Receipt.png',
    items: [
      { name: 'Sony WH-1000XM5 Wireless Headphones (Silver)', qty: 1, price: 398.00 },
      { name: 'Geek Squad 1-Yr Accidental Coverage', qty: 1, price: 59.99 }
    ]
  },
  {
    id: 'doc_herman_miller',
    title: 'Herman Miller Embody Chair (Cyan Rhythm Fabric)',
    vendor: 'Herman Miller Flagship',
    vendorAddress: '251 Park Ave S, New York, NY 10010',
    vendorPhone: '+1 (212) 318-3900',
    invoiceNumber: 'HM-INV-2022-8819',
    serialNumber: 'HM-EMB-90218-US',
    amount: 1795.00,
    taxAmount: 159.31,
    currency: '$',
    purchaseDate: '2022-05-15',
    category: 'Home',
    paymentMethod: 'Bank Wire / ACH',
    warrantyType: '12-Year 24/7 Commercial Warranty',
    warrantyProvider: 'Herman Miller Corporate Support',
    warrantyExpirationDate: '2034-05-15', // 12-Year Warranty
    returnDeadlineDate: '2022-06-15',
    returnPolicy: '30-day in-home trial return guarantee',
    supportUrl: 'https://www.hermanmiller.com/support',
    notes: 'Cyan Rhythm fabric with graphite frame and translucent casters. 12-year 24/7 use warranty fully covers mechanical adjustments and pneumatic cylinder.',
    tags: ['office', 'ergonomics', 'furniture', 'home-office'],
    fileName: 'HermanMiller_Embody_Invoice.png',
    items: [
      { name: 'Embody Chair - Cyan Rhythm / Graphite Frame', qty: 1, price: 1795.00 },
      { name: 'White Glove Inside Delivery & Assembly', qty: 1, price: 0.00 }
    ]
  },
  {
    id: 'doc_dyson_v15',
    title: 'Dyson V15 Detect Absolute Cordless Vacuum',
    vendor: 'Dyson Direct USA',
    vendorAddress: '1330 Avenue of the Americas, New York, NY 10019',
    vendorPhone: '+1 (866) 693-9766',
    invoiceNumber: 'DYS-US-99104',
    serialNumber: 'V15-DT-883910A',
    amount: 749.99,
    taxAmount: 66.56,
    currency: '$',
    purchaseDate: '2023-08-14',
    category: 'Home',
    paymentMethod: 'Mastercard •••• 7732',
    warrantyType: '2-Year Official Dyson Warranty',
    warrantyProvider: 'Dyson Support Care',
    warrantyExpirationDate: '2025-08-14',
    returnDeadlineDate: '2023-09-14',
    returnPolicy: '30-day money back guarantee',
    supportUrl: 'https://www.dyson.com/support',
    notes: 'Laser Slim Fluffy cleaner head + Digital Motorbar + hair screw tool. Registered for 2-year parts and labor coverage.',
    tags: ['appliances', 'cleaning', 'home', 'dyson'],
    fileName: 'Dyson_Receipt_88192.png',
    items: [
      { name: 'Dyson V15 Detect Absolute Vacuum', qty: 1, price: 749.99 },
      { name: 'Bonus Detail Cleaning Tool Kit', qty: 1, price: 0.00 }
    ]
  },
  {
    id: 'doc_patagonia_jacket',
    title: 'Patagonia Down Sweater Hoody (Black / Medium)',
    vendor: 'Patagonia Soho Flagship',
    vendorAddress: '72 Greene St, New York, NY 10012',
    vendorPhone: '+1 (212) 314-1300',
    invoiceNumber: 'PAT-SOHO-771829',
    serialNumber: 'STYLE-84701-BLK',
    amount: 329.00,
    taxAmount: 29.20,
    currency: '$',
    purchaseDate: '2023-12-02',
    category: 'Clothing',
    paymentMethod: 'Apple Pay (Visa •••• 4821)',
    warrantyType: 'Patagonia Ironclad Lifetime Guarantee',
    warrantyProvider: 'Patagonia Worn Wear',
    warrantyExpirationDate: '2035-12-31', // Lifetime guarantee
    returnDeadlineDate: '2024-01-02',
    returnPolicy: 'Unlimited Ironclad return / repair policy',
    supportUrl: 'https://www.patagonia.com/returns',
    notes: '800-fill-power 100% Responsible Down Standard. Covered under Ironclad Guarantee for lifetime repair or replacement at any Patagonia retail store.',
    tags: ['outdoors', 'winter', 'lifetime-warranty', 'apparel'],
    fileName: 'Patagonia_Receipt_Soho.png',
    items: [
      { name: 'Men’s Down Sweater Hoody - Black / M', qty: 1, price: 329.00 }
    ]
  },
  {
    id: 'doc_jetbrains_all_pack',
    title: 'JetBrains All Products Pack (1-Year Commercial)',
    vendor: 'JetBrains s.r.o.',
    vendorAddress: 'Kavčí Hory Office Park, Na Hřebenech II 1718/10, Prague, Czech Republic',
    vendorPhone: '+420 241 722 501',
    invoiceNumber: 'JB-2024-EU-99210',
    serialNumber: 'LIC-JB-ALL-99201',
    amount: 289.00,
    taxAmount: 0.00,
    currency: '$',
    purchaseDate: '2024-02-01',
    category: 'Software',
    paymentMethod: 'PayPal (billing@studio.io)',
    warrantyType: 'Perpetual Fallback License Included',
    warrantyProvider: 'JetBrains Account Services',
    warrantyExpirationDate: '2025-02-01',
    returnDeadlineDate: '2024-02-15',
    returnPolicy: '14-day refund period for digital subscriptions',
    supportUrl: 'https://account.jetbrains.com',
    notes: 'Commercial license for IntelliJ IDEA, WebStorm, PyCharm, CLion, RustRover. Includes perpetual fallback license v2024.1.',
    tags: ['software', 'ide', 'development', 'tax-deductible', 'subscriptions'],
    fileName: 'JetBrains_Tax_Invoice_2024.png',
    items: [
      { name: 'All Products Pack Subscription (12 Months)', qty: 1, price: 289.00 }
    ]
  },
  {
    id: 'doc_figma_annual',
    title: 'Figma Professional Annual Subscription (1 Editor)',
    vendor: 'Figma Inc.',
    vendorAddress: '768 Market St, Suite 400, San Francisco, CA 94102',
    vendorPhone: '+1 (800) 555-3446',
    invoiceNumber: 'FIG-INV-2024-4481',
    serialNumber: 'ORG-FIGMA-DESIGNLABS',
    amount: 144.00,
    taxAmount: 0.00,
    currency: '$',
    purchaseDate: '2024-03-01',
    category: 'Subscriptions',
    paymentMethod: 'Credit Card (Visa •••• 4821)',
    warrantyType: 'SaaS 99.9% Service Level Agreement',
    warrantyProvider: 'Figma Enterprise Support',
    warrantyExpirationDate: '2025-03-01',
    returnDeadlineDate: null,
    returnPolicy: 'Annual contract billed upfront, non-refundable',
    supportUrl: 'https://help.figma.com',
    notes: '1 Full Design Editor seat. Workspace: DesignLabs Studio. Renews automatically on March 1, 2025.',
    tags: ['subscriptions', 'ui-design', 'saas', 'tools'],
    fileName: 'Figma_Invoice_INV2024.png',
    items: [
      { name: 'Figma Professional - Annual Editor Seat', qty: 1, price: 144.00 }
    ]
  },
  {
    id: 'doc_delta_flight',
    title: 'Delta Air Lines Flight DL482 (JFK -> SFO Round-Trip)',
    vendor: 'Delta Air Lines',
    vendorAddress: 'PO Box 20706, Atlanta, GA 30320',
    vendorPhone: '+1 (800) 221-1212',
    invoiceNumber: 'ETK-006291039811',
    serialNumber: 'PNR: H88K2P',
    amount: 485.60,
    taxAmount: 42.10,
    currency: '$',
    purchaseDate: '2024-04-12',
    category: 'Travel',
    paymentMethod: 'Credit Card (Amex •••• 1009)',
    warrantyType: 'Travel Insurance & Trip Delay Protection',
    warrantyProvider: 'Allianz Global Assistance',
    warrantyExpirationDate: null,
    returnDeadlineDate: '2024-04-13', // 24-hour cancellation rule
    returnPolicy: '24-hour risk-free DOT cancellation guarantee',
    supportUrl: 'https://www.delta.com/ticket',
    notes: 'Passenger: Alexander Wright. JFK -> SFO Main Cabin 14A. Includes baggage check and trip delay coverage under policy #ALZ-99120.',
    tags: ['flights', 'travel', 'business-trip', 'delta'],
    fileName: 'Delta_eTicket_Receipt.png',
    items: [
      { name: 'Flight DL482 Main Cabin JFK -> SFO', qty: 1, price: 443.50 },
      { name: 'US Transportation Tax & Segment Fee', qty: 1, price: 42.10 }
    ]
  },
  {
    id: 'doc_whole_foods',
    title: 'Whole Foods Market Organic Groceries & Provisions',
    vendor: 'Whole Foods Market Tribeca',
    vendorAddress: '270 Greenwich St, New York, NY 10007',
    vendorPhone: '+1 (212) 349-6555',
    invoiceNumber: 'WFM-REG-04-8812',
    serialNumber: 'TRANS-990218',
    amount: 142.75,
    taxAmount: 8.42,
    currency: '$',
    purchaseDate: getRelativeDateStr(-3), // 3 days ago
    category: 'Groceries',
    paymentMethod: 'Debit Card (Mastercard •••• 2189)',
    warrantyType: '100% Quality & Freshness Guarantee',
    warrantyProvider: 'Whole Foods Store Service',
    warrantyExpirationDate: null,
    returnDeadlineDate: getRelativeDateStr(11), // 11 days remaining!
    returnPolicy: '14-day perishable item return guarantee with receipt',
    supportUrl: 'https://www.wholefoodsmarket.com/customer-service',
    notes: 'Tribeca Store #10429. Register 04. Cashier: Maya S. Organic produce, pantry staples, and fair-trade dark roast beans.',
    tags: ['groceries', 'food', 'household', 'organic'],
    fileName: 'WholeFoods_Register_Slip.png',
    items: [
      { name: 'Organic Honeycrisp Apples (2.4 lb)', qty: 1, price: 8.99 },
      { name: 'Artisan Sourdough Loaf', qty: 1, price: 6.50 },
      { name: 'Organic Fair-Trade Espresso Beans', qty: 2, price: 27.98 },
      { name: 'Grass-fed Butter & Dairy Essentials', qty: 1, price: 18.45 },
      { name: 'Household & Pantry Staples', qty: 1, price: 80.83 }
    ]
  },
  {
    id: 'doc_nike_shoes',
    title: 'Nike Air Zoom Pegasus 40 Premium Running Shoes',
    vendor: 'Nike Flagship House of Innovation',
    vendorAddress: '650 5th Ave, New York, NY 10019',
    vendorPhone: '+1 (212) 376-9480',
    invoiceNumber: 'NKE-NYC-009921',
    serialNumber: 'STYLE-DV3853-001',
    amount: 130.00,
    taxAmount: 11.54,
    currency: '$',
    purchaseDate: getRelativeDateStr(-2), // 2 days ago
    category: 'Clothing',
    paymentMethod: 'Credit Card (Visa •••• 4821)',
    warrantyType: '2-Year Nike Footwear & Apparel Warranty',
    warrantyProvider: 'Nike Member Services',
    warrantyExpirationDate: '2026-08-01', // 2-year warranty
    returnDeadlineDate: getRelativeDateStr(28), // 28 days left!
    returnPolicy: '60-day Nike Member wear-and-test return trial',
    supportUrl: 'https://www.nike.com/help/returns',
    notes: 'Size US 10.5 Men. Style #DV3853-001. 60-day trial wear-and-test guarantee for registered Nike Members.',
    tags: ['sports', 'running', 'footwear', 'fitness'],
    fileName: 'Nike_Receipt_9921.png',
    items: [
      { name: 'Air Zoom Pegasus 40 Men’s (Size 10.5)', qty: 1, price: 130.00 }
    ]
  }
];

/**
 * Procedural Vector Receipt Canvas Generator
 * Supports 4 distinct high-fidelity visual receipt templates:
 * 1. Thermal Register Receipt (monospaced register font, jagged edge, barcode)
 * 2. Corporate Hardware / Retail Tax Invoice (clean enterprise layout, box headers, AppleCare details)
 * 3. SaaS / Software Digital Tax Invoice (clean European/US VAT invoice)
 * 4. Airline Travel / e-Ticket Itinerary
 *
 * Supports contrast filters (Normal, Inverted, High-Contrast B&W) for enhanced legibility.
 */
function generateReceiptCanvas(doc, width = 360, height = 500, options = {}) {
  const filterMode = options.filterMode || 'normal'; // 'normal', 'invert', 'contrast'
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // If document contains a custom uploaded image, draw that image onto canvas
  if (doc.customImageData) {
    const img = new Image();
    img.src = doc.customImageData;
    if (img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, 0, 0, width, height);
      applyFilterToContext(ctx, width, height, filterMode);
      return canvas;
    }
  }

  // Render template based on category / vendor
  if (doc.category === 'Software' || doc.category === 'Subscriptions') {
    drawSaaSInvoiceTemplate(ctx, doc, width, height);
  } else if (doc.category === 'Travel') {
    drawTravelETicketTemplate(ctx, doc, width, height);
  } else if (doc.vendor && (doc.vendor.includes('Apple') || doc.vendor.includes('Herman Miller') || doc.vendor.includes('Dyson'))) {
    drawCorporateTaxInvoiceTemplate(ctx, doc, width, height);
  } else {
    drawThermalRegisterTemplate(ctx, doc, width, height);
  }

  applyFilterToContext(ctx, width, height, filterMode);
  return canvas;
}

function applyFilterToContext(ctx, width, height, filterMode) {
  if (filterMode === 'invert') {
    const imgData = ctx.getImageData(0, 0, width, height);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = 255 - d[i];
      d[i + 1] = 255 - d[i + 1];
      d[i + 2] = 255 - d[i + 2];
    }
    ctx.putImageData(imgData, 0, 0);
  } else if (filterMode === 'contrast') {
    const imgData = ctx.getImageData(0, 0, width, height);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const avg = (d[i] + d[i + 1] + d[i + 2]) / 3;
      const v = avg > 175 ? 255 : (avg < 80 ? 0 : (avg - 80) * (255 / 95));
      d[i] = v;
      d[i + 1] = v;
      d[i + 2] = v;
    }
    ctx.putImageData(imgData, 0, 0);
  }
}

/**
 * 1. Thermal Register Receipt Template
 */
function drawThermalRegisterTemplate(ctx, doc, width, height) {
  // Paper Background with subtle warm tint
  ctx.fillStyle = '#faf8f5';
  ctx.fillRect(0, 0, width, height);

  // Jagged bottom edge
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(0, height - 6);
  for (let x = 0; x < width; x += 10) {
    ctx.lineTo(x + 5, height - 12);
    ctx.lineTo(x + 10, height - 6);
  }
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.fill();

  // Header
  ctx.fillStyle = '#0f172a';
  ctx.font = "bold 15px 'Courier New', Consolas, monospace";
  ctx.textAlign = 'center';
  ctx.fillText(doc.vendor.toUpperCase(), width / 2, 38);

  ctx.font = "10px 'Courier New', Consolas, monospace";
  ctx.fillStyle = '#475569';
  if (doc.vendorAddress) ctx.fillText(doc.vendorAddress, width / 2, 54);
  if (doc.vendorPhone) ctx.fillText(`TEL: ${doc.vendorPhone}`, width / 2, 68);

  ctx.fillText(`DATE: ${doc.purchaseDate || '-'}   TIME: 14:22:08`, width / 2, 84);
  ctx.fillText(`INVOICE: ${doc.invoiceNumber || doc.id.toUpperCase()}`, width / 2, 98);

  // Dashed Separator
  drawDashedLine(ctx, 20, 110, width - 20, 110);

  // Line items
  ctx.textAlign = 'left';
  let y = 130;
  const items = doc.items || [{ name: doc.title, qty: 1, price: doc.amount }];

  items.forEach(item => {
    ctx.font = "bold 11px 'Courier New', Consolas, monospace";
    ctx.fillStyle = '#0f172a';
    ctx.fillText(`${item.qty}x ${item.name.slice(0, 24)}`, 20, y);
    ctx.textAlign = 'right';
    ctx.fillText(`${doc.currency || '$'}${(item.price * item.qty).toFixed(2)}`, width - 20, y);
    ctx.textAlign = 'left';
    y += 18;
  });

  // Subtotal & Tax
  y = Math.max(y + 8, 220);
  drawDashedLine(ctx, 20, y, width - 20, y);
  y += 18;

  const tax = doc.taxAmount || (doc.amount * 0.08875);
  const subtotal = Math.max(0, doc.amount - tax);

  ctx.font = "10px 'Courier New', Consolas, monospace";
  ctx.fillStyle = '#475569';
  ctx.fillText('SUBTOTAL', 20, y);
  ctx.textAlign = 'right';
  ctx.fillText(`${doc.currency || '$'}${subtotal.toFixed(2)}`, width - 20, y);
  y += 15;

  ctx.textAlign = 'left';
  ctx.fillText('SALES TAX / VAT', 20, y);
  ctx.textAlign = 'right';
  ctx.fillText(`${doc.currency || '$'}${tax.toFixed(2)}`, width - 20, y);
  y += 18;

  // Total
  drawDashedLine(ctx, 20, y, width - 20, y);
  y += 22;

  ctx.textAlign = 'left';
  ctx.font = "bold 14px 'Courier New', Consolas, monospace";
  ctx.fillStyle = '#0f172a';
  ctx.fillText('TOTAL AMOUNT PAID', 20, y);
  ctx.textAlign = 'right';
  ctx.fillText(`${doc.currency || '$'}${doc.amount.toFixed(2)}`, width - 20, y);
  y += 22;

  // Payment & Policy Notes
  ctx.textAlign = 'left';
  ctx.font = "10px 'Courier New', Consolas, monospace";
  ctx.fillStyle = '#64748b';
  ctx.fillText(`PAYMENT: ${doc.paymentMethod.toUpperCase()}`, 20, y);
  y += 14;
  if (doc.returnPolicy) {
    ctx.fillText(`RETURN: ${doc.returnPolicy.slice(0, 36)}`, 20, y);
    y += 14;
  }
  if (doc.warrantyType) {
    ctx.fillText(`WARRANTY: ${doc.warrantyType.slice(0, 34)}`, 20, y);
    y += 14;
  }

  // Simulated Barcode
  y = height - 60;
  ctx.fillStyle = '#1e293b';
  for (let x = 40; x < width - 40; x += Math.floor(Math.sin(x) * 2) + 3) {
    ctx.fillRect(x, y, (x % 3 === 0) ? 2.5 : 1.5, 26);
  }

  ctx.textAlign = 'center';
  ctx.font = "9px 'Courier New', Consolas, monospace";
  ctx.fillStyle = '#64748b';
  ctx.fillText(`* ${doc.invoiceNumber || doc.id.toUpperCase()} *`, width / 2, height - 20);
}

/**
 * 2. Corporate Hardware / Retail Tax Invoice Template
 */
function drawCorporateTaxInvoiceTemplate(ctx, doc, width, height) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Top corporate banner
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, width, 45);

  ctx.fillStyle = '#f8fafc';
  ctx.font = "bold 14px 'Inter', sans-serif";
  ctx.textAlign = 'left';
  ctx.fillText(doc.vendor.toUpperCase(), 20, 28);

  ctx.textAlign = 'right';
  ctx.font = "10px 'Inter', sans-serif";
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('OFFICIAL TAX INVOICE', width - 20, 28);

  // Document Info Grid Box
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(15, 55, width - 30, 60);
  ctx.strokeStyle = '#e2e8f0';
  ctx.strokeRect(15, 55, width - 30, 60);

  ctx.textAlign = 'left';
  ctx.font = "bold 9px 'Inter', sans-serif";
  ctx.fillStyle = '#64748b';
  ctx.fillText('INVOICE NUMBER', 25, 72);
  ctx.fillText('PURCHASE DATE', 25, 98);
  ctx.fillText('PAYMENT METHOD', width / 2 + 10, 72);
  ctx.fillText('SERIAL / ASSET #', width / 2 + 10, 98);

  ctx.font = "bold 10px 'Courier New', monospace";
  ctx.fillStyle = '#0f172a';
  ctx.fillText(doc.invoiceNumber || 'INV-99201', 25, 84);
  ctx.fillText(doc.purchaseDate || '-', 25, 109);
  ctx.fillText((doc.paymentMethod || 'Credit Card').slice(0, 16), width / 2 + 10, 84);
  ctx.fillText(doc.serialNumber || 'SN-NA-001', width / 2 + 10, 109);

  // Items Table Header
  let y = 132;
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(15, y, width - 30, 20);
  ctx.fillStyle = '#475569';
  ctx.font = "bold 9px 'Inter', sans-serif";
  ctx.fillText('DESCRIPTION / ITEM', 25, y + 14);
  ctx.textAlign = 'right';
  ctx.fillText('AMOUNT', width - 25, y + 14);

  // Line items
  y += 30;
  const items = doc.items || [{ name: doc.title, qty: 1, price: doc.amount }];
  items.forEach(item => {
    ctx.textAlign = 'left';
    ctx.font = "bold 10px 'Inter', sans-serif";
    ctx.fillStyle = '#0f172a';
    ctx.fillText(`${item.qty}x ${item.name.slice(0, 26)}`, 25, y);
    ctx.textAlign = 'right';
    ctx.font = "bold 10px 'Courier New', monospace";
    ctx.fillText(`${doc.currency || '$'}${(item.price * item.qty).toFixed(2)}`, width - 25, y);
    y += 18;
  });

  // Warranty Callout Box
  if (doc.warrantyType) {
    y = Math.max(y + 8, 230);
    ctx.fillStyle = '#f0fdf4';
    ctx.fillRect(15, y, width - 30, 48);
    ctx.strokeStyle = '#86efac';
    ctx.strokeRect(15, y, width - 30, 48);

    ctx.textAlign = 'left';
    ctx.font = "bold 10px 'Inter', sans-serif";
    ctx.fillStyle = '#166534';
    ctx.fillText('COVERED UNDER ACTIVE WARRANTY', 25, y + 18);
    ctx.font = "9px 'Inter', sans-serif";
    ctx.fillStyle = '#15803d';
    ctx.fillText(`${doc.warrantyType.slice(0, 42)}`, 25, y + 32);
    if (doc.warrantyExpirationDate) {
      ctx.fillText(`Expires: ${doc.warrantyExpirationDate}`, 25, y + 43);
    }
  }

  // Bottom Total Box
  y = height - 90;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(15, y, width - 30, 42);

  ctx.textAlign = 'left';
  ctx.font = "bold 11px 'Inter', sans-serif";
  ctx.fillStyle = '#f8fafc';
  ctx.fillText('TOTAL AMOUNT PAID', 25, y + 26);

  ctx.textAlign = 'right';
  ctx.font = "bold 15px 'Courier New', monospace";
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(`${doc.currency || '$'}${doc.amount.toFixed(2)}`, width - 25, y + 27);

  // Footer note
  ctx.textAlign = 'center';
  ctx.font = "9px 'Inter', sans-serif";
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Official Electronic Document • Verified Filing Record', width / 2, height - 18);
}

/**
 * 3. SaaS / Software Digital Tax Invoice Template
 */
function drawSaaSInvoiceTemplate(ctx, doc, width, height) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Header
  ctx.fillStyle = '#6366f1';
  ctx.fillRect(0, 0, width, 6);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#0f172a';
  ctx.font = "bold 16px 'Inter', sans-serif";
  ctx.fillText(doc.vendor, 24, 38);

  ctx.textAlign = 'right';
  ctx.font = "bold 12px 'Inter', sans-serif";
  ctx.fillStyle = '#6366f1';
  ctx.fillText('TAX INVOICE', width - 24, 38);

  // Invoice Details
  ctx.font = "9px 'Inter', sans-serif";
  ctx.fillStyle = '#64748b';
  ctx.textAlign = 'left';
  ctx.fillText(`INVOICE: ${doc.invoiceNumber || 'INV-2024'}`, 24, 60);
  ctx.fillText(`DATE: ${doc.purchaseDate || '-'}`, 24, 73);

  ctx.textAlign = 'right';
  ctx.fillText(`LICENSE ID: ${doc.serialNumber || 'SAAS-LIC-01'}`, width - 24, 60);
  ctx.fillText(`BILLING: ANNUAL RECURRING`, width - 24, 73);

  // Separator
  ctx.strokeStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.moveTo(24, 88); ctx.lineTo(width - 24, 88);
  ctx.stroke();

  // Line item box
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(24, 102, width - 48, 80);
  ctx.strokeStyle = '#cbd5e1';
  ctx.strokeRect(24, 102, width - 48, 80);

  ctx.textAlign = 'left';
  ctx.font = "bold 11px 'Inter', sans-serif";
  ctx.fillStyle = '#0f172a';
  ctx.fillText(doc.title.slice(0, 30), 36, 126);

  ctx.font = "9px 'Inter', sans-serif";
  ctx.fillStyle = '#64748b';
  ctx.fillText('1-Year Enterprise Seat License • 24/7 SLA Guarantee', 36, 142);
  ctx.fillText(`Payment via ${doc.paymentMethod}`, 36, 158);

  ctx.textAlign = 'right';
  ctx.font = "bold 13px 'Courier New', monospace";
  ctx.fillStyle = '#0f172a';
  ctx.fillText(`${doc.currency || '$'}${doc.amount.toFixed(2)}`, width - 36, 130);

  // Total Summary
  let y = 210;
  ctx.textAlign = 'left';
  ctx.font = "bold 10px 'Inter', sans-serif";
  ctx.fillStyle = '#475569';
  ctx.fillText('SUBTOTAL', 24, y);
  ctx.textAlign = 'right';
  ctx.fillText(`${doc.currency || '$'}${doc.amount.toFixed(2)}`, width - 24, y);
  y += 16;

  ctx.textAlign = 'left';
  ctx.fillText('VAT / SALES TAX (0%)', 24, y);
  ctx.textAlign = 'right';
  ctx.fillText('$0.00', width - 24, y);
  y += 20;

  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(24, y); ctx.lineTo(width - 24, y);
  ctx.stroke();
  ctx.lineWidth = 1;
  y += 24;

  ctx.textAlign = 'left';
  ctx.font = "bold 13px 'Inter', sans-serif";
  ctx.fillStyle = '#0f172a';
  ctx.fillText('TOTAL PAID', 24, y);
  ctx.textAlign = 'right';
  ctx.font = "bold 16px 'Courier New', monospace";
  ctx.fillStyle = '#6366f1';
  ctx.fillText(`${doc.currency || '$'}${doc.amount.toFixed(2)}`, width - 24, y);

  // Footer Security
  ctx.textAlign = 'center';
  ctx.font = "9px 'Inter', sans-serif";
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`Digital Signature Verified • ${doc.vendor}`, width / 2, height - 30);
}

/**
 * 4. Airline Travel / e-Ticket Itinerary Template
 */
function drawTravelETicketTemplate(ctx, doc, width, height) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Top Flight Header Banner
  ctx.fillStyle = '#0369a1';
  ctx.fillRect(0, 0, width, 50);

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.font = "bold 13px 'Inter', sans-serif";
  ctx.fillText(doc.vendor.toUpperCase(), 20, 26);

  ctx.textAlign = 'right';
  ctx.font = "10px 'Courier New', monospace";
  ctx.fillStyle = '#bae6fd';
  ctx.fillText('ELECTRONIC TICKET / ITINERARY', width - 20, 26);
  ctx.fillText(doc.serialNumber || 'PNR: H88K2P', width - 20, 40);

  // Flight Route Visual
  let y = 75;
  ctx.fillStyle = '#f0f9ff';
  ctx.fillRect(15, y, width - 30, 65);
  ctx.strokeStyle = '#bae6fd';
  ctx.strokeRect(15, y, width - 30, 65);

  ctx.textAlign = 'left';
  ctx.font = "bold 18px 'Inter', sans-serif";
  ctx.fillStyle = '#0369a1';
  ctx.fillText('JFK', 30, y + 36);

  ctx.font = "10px 'Inter', sans-serif";
  ctx.fillStyle = '#64748b';
  ctx.fillText('New York', 30, y + 50);

  ctx.textAlign = 'center';
  ctx.font = "12px 'Inter', sans-serif";
  ctx.fillStyle = '#0284c7';
  ctx.fillText('✈ DL482 ✈', width / 2, y + 34);

  ctx.textAlign = 'right';
  ctx.font = "bold 18px 'Inter', sans-serif";
  ctx.fillStyle = '#0369a1';
  ctx.fillText('SFO', width - 30, y + 36);

  ctx.font = "10px 'Inter', sans-serif";
  ctx.fillStyle = '#64748b';
  ctx.fillText('San Francisco', width - 30, y + 50);

  // Ticket Passenger details
  y = 155;
  ctx.textAlign = 'left';
  ctx.font = "bold 9px 'Inter', sans-serif";
  ctx.fillStyle = '#64748b';
  ctx.fillText('TICKET NUMBER', 20, y);
  ctx.fillText('CABIN / SEAT', width / 2 + 10, y);

  y += 14;
  ctx.font = "bold 10px 'Courier New', monospace";
  ctx.fillStyle = '#0f172a';
  ctx.fillText(doc.invoiceNumber || 'ETK-0062910398', 20, y);
  ctx.fillText('Main Cabin (14A)', width / 2 + 10, y);

  y += 24;
  drawDashedLine(ctx, 15, y, width - 15, y);
  y += 20;

  // Fare breakdown
  ctx.font = "bold 9px 'Inter', sans-serif";
  ctx.fillStyle = '#64748b';
  ctx.fillText('AIRFARE / TAXES BREAKDOWN', 20, y);
  y += 16;

  ctx.font = "10px 'Inter', sans-serif";
  ctx.fillStyle = '#334155';
  ctx.fillText('Base Flight DL482 Fare', 20, y);
  ctx.textAlign = 'right';
  ctx.fillText(`${doc.currency || '$'}${Math.max(0, doc.amount - 42.10).toFixed(2)}`, width - 20, y);
  y += 16;

  ctx.textAlign = 'left';
  ctx.fillText('U.S. Transportation Tax & Segment Fees', 20, y);
  ctx.textAlign = 'right';
  ctx.fillText('$42.10', width - 20, y);
  y += 20;

  // Total
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(15, y, width - 30, 36);

  ctx.textAlign = 'left';
  ctx.font = "bold 11px 'Inter', sans-serif";
  ctx.fillStyle = '#ffffff';
  ctx.fillText('TOTAL AMOUNT CHARGED', 26, y + 23);

  ctx.textAlign = 'right';
  ctx.font = "bold 14px 'Courier New', monospace";
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(`${doc.currency || '$'}${doc.amount.toFixed(2)}`, width - 26, y + 24);

  // Footer note
  ctx.textAlign = 'center';
  ctx.font = "9px 'Inter', sans-serif";
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('DOT 24-Hour Cancellation Eligible • Trip Protection Included', width / 2, height - 20);
}

function drawDashedLine(ctx, x1, y1, x2, y2) {
  ctx.save();
  ctx.strokeStyle = '#cbd5e1';
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}


/* --- MODULE: js/engine/duplicate.js --- */
/**
 * ReceiptVault - Duplicate Detection Engine
 * Detects potential duplicate receipts matching invoice IDs, merchant names, amounts, and purchase dates.
 */

function findPotentialDuplicate(candidate, existingDocs = [], ignoreId = null) {
  if (!candidate) return null;

  const candVendor = String(candidate.vendor || '').trim().toLowerCase();
  const candAmt = Math.round(Number(candidate.amount || 0) * 100) / 100;
  const candDate = candidate.purchaseDate ? new Date(candidate.purchaseDate).getTime() : null;
  const candInvoice = String(candidate.invoiceNumber || '').trim().toLowerCase();

  for (const doc of existingDocs) {
    if (ignoreId && doc.id === ignoreId) continue;

    // 1. Exact Invoice Number match (if provided)
    const docInvoice = String(doc.invoiceNumber || '').trim().toLowerCase();
    if (candInvoice && docInvoice && candInvoice === docInvoice) {
      return {
        isDuplicate: true,
        conflictingDoc: doc,
        reason: `Matches existing invoice #${doc.invoiceNumber} from "${doc.vendor}"`
      };
    }

    // 2. Vendor + Amount + Purchase Date match
    if (candVendor && candAmt > 0 && candDate && !isNaN(candDate)) {
      const docVendor = String(doc.vendor || '').trim().toLowerCase();
      const docAmt = Math.round(Number(doc.amount || 0) * 100) / 100;
      const docDate = doc.purchaseDate ? new Date(doc.purchaseDate).getTime() : null;

      if (docDate && !isNaN(docDate)) {
        // Vendor similarity (exact or substring)
        const vendorMatches = candVendor === docVendor || candVendor.includes(docVendor) || docVendor.includes(candVendor);

        // Amount within 2 cents
        const amountMatches = Math.abs(candAmt - docAmt) < 0.02;

        // Date within 2 days (172,800,000 ms)
        const dateDiffMs = Math.abs(candDate - docDate);
        const dateMatches = dateDiffMs <= 2 * 24 * 60 * 60 * 1000;

        if (vendorMatches && amountMatches && dateMatches) {
          return {
            isDuplicate: true,
            conflictingDoc: doc,
            reason: `Matches existing record from "${doc.vendor}" ($${docAmt.toFixed(2)}) on ${doc.purchaseDate}`
          };
        }
      }
    }
  }

  return null;
}


/* --- MODULE: js/engine/charts.js --- */
/**
 * ReceiptVault - Canvas 2D Financial & Warranty Charting Engine
 * Pure client-side charting for Category Donut Breakdown, Monthly Spending Bars, and Warranty Coverage Metrics.
 * Supports HiDPI / Retina device pixel ratio scaling for crystal clear rendering.
 */

const CATEGORY_COLORS = {
  Electronics: '#38bdf8',
  Home: '#10b981',
  Clothing: '#f59e0b',
  Software: '#818cf8',
  Subscriptions: '#f472b6',
  Travel: '#38bdf8',
  Groceries: '#34d399',
  Other: '#94a3b8'
};

function setupHiDPICanvas(canvas, cssWidth, cssHeight) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = cssWidth * dpr;
  canvas.height = cssHeight * dpr;
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return { ctx, w: cssWidth, h: cssHeight };
}

function renderCategoryDonut(canvas, documents = []) {
  if (!canvas) return;
  const parent = canvas.parentElement;
  const cssW = (parent && parent.clientWidth > 40) ? parent.clientWidth : 300;
  const cssH = 220;

  const { ctx, w, h } = setupHiDPICanvas(canvas, cssW, cssH);
  ctx.clearRect(0, 0, w, h);

  // Calculate category totals
  const totals = {};
  let totalSpend = 0;

  for (const doc of documents) {
    const cat = doc.category || 'Other';
    const amt = Number(doc.amount) || 0;
    totals[cat] = (totals[cat] || 0) + amt;
    totalSpend += amt;
  }

  if (totalSpend === 0) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = "12px 'Inter', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText('No spending data to display', w / 2, h / 2);
    return;
  }

  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const centerX = Math.min(w / 2, 120);
  const centerY = h / 2;
  const radius = Math.min(centerX, centerY) - 18;
  const innerRadius = radius * 0.62;

  let currentAngle = -Math.PI / 2;

  // Draw donut slices
  entries.forEach(([cat, amt]) => {
    const sliceAngle = (amt / totalSpend) * (Math.PI * 2);
    const color = CATEGORY_COLORS[cat] || '#94a3b8';

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
    ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
    ctx.closePath();
    ctx.fill();

    currentAngle += sliceAngle;
  });

  // Center Text (Total Amount)
  ctx.fillStyle = '#f8fafc';
  ctx.font = "bold 15px 'JetBrains Mono', Consolas, monospace";
  ctx.textAlign = 'center';
  ctx.fillText(`$${totalSpend.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, centerX, centerY + 2);
  ctx.fillStyle = '#94a3b8';
  ctx.font = "9px 'Inter', sans-serif";
  ctx.fillText('TOTAL SPEND', centerX, centerY + 16);

  // Draw Legend on the right side
  const legendX = centerX + radius + 24;
  let legendY = 32;
  ctx.textAlign = 'left';

  entries.slice(0, 6).forEach(([cat, amt]) => {
    const percent = Math.round((amt / totalSpend) * 100);
    const color = CATEGORY_COLORS[cat] || '#94a3b8';

    // Color box
    ctx.fillStyle = color;
    ctx.fillRect(legendX, legendY, 8, 8);

    // Label & Percentage
    ctx.fillStyle = '#e2e8f0';
    ctx.font = "10.5px 'Inter', sans-serif";
    ctx.fillText(`${cat.slice(0, 11)}`, legendX + 13, legendY + 7);

    ctx.fillStyle = '#94a3b8';
    ctx.font = "10px 'JetBrains Mono', Consolas, monospace";
    ctx.fillText(`${percent}%`, legendX + 90, legendY + 7);

    legendY += 24;
  });
}

function renderMonthlyBarChart(canvas, documents = []) {
  if (!canvas) return;
  const parent = canvas.parentElement;
  const cssW = (parent && parent.clientWidth > 40) ? parent.clientWidth : 340;
  const cssH = 220;

  const { ctx, w, h } = setupHiDPICanvas(canvas, cssW, cssH);
  ctx.clearRect(0, 0, w, h);

  // Group by YYYY-MM
  const monthTotals = {};
  for (const doc of documents) {
    if (!doc.purchaseDate) continue;
    const key = doc.purchaseDate.slice(0, 7); // '2024-01'
    monthTotals[key] = (monthTotals[key] || 0) + (Number(doc.amount) || 0);
  }

  const months = Object.keys(monthTotals).sort().slice(-6); // Last 6 recorded months
  if (months.length === 0) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = "12px 'Inter', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText('No monthly transaction history', w / 2, h / 2);
    return;
  }

  const maxVal = Math.max(...months.map(m => monthTotals[m]), 100);
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 30;
  const chartW = w - paddingLeft - paddingRight;
  const chartH = h - paddingTop - paddingBottom;

  // Grid Lines
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 3; i++) {
    const yLine = paddingTop + (chartH / 3) * i;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, yLine);
    ctx.lineTo(w - paddingRight, yLine);
    ctx.stroke();

    const gridVal = Math.round(maxVal - (maxVal / 3) * i);
    ctx.fillStyle = '#64748b';
    ctx.font = "9px 'JetBrains Mono', Consolas, monospace";
    ctx.textAlign = 'right';
    ctx.fillText(`$${gridVal}`, paddingLeft - 6, yLine + 3);
  }

  const gap = chartW / months.length;
  const barWidth = Math.min(32, gap * 0.6);

  months.forEach((m, idx) => {
    const val = monthTotals[m];
    const barH = (val / maxVal) * chartH;
    const x = paddingLeft + idx * gap + (gap - barWidth) / 2;
    const y = h - paddingBottom - barH;

    // Draw Bar with subtle gradient
    const gradient = ctx.createLinearGradient(0, y, 0, y + barH);
    gradient.addColorStop(0, '#38bdf8');
    gradient.addColorStop(1, 'rgba(56, 189, 248, 0.4)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barH, [3, 3, 0, 0]);
    ctx.fill();

    // Value Label above bar
    ctx.fillStyle = '#f8fafc';
    ctx.font = "bold 9.5px 'JetBrains Mono', Consolas, monospace";
    ctx.textAlign = 'center';
    ctx.fillText(`$${Math.round(val)}`, x + barWidth / 2, y - 5);

    // Month Label below bar
    ctx.fillStyle = '#94a3b8';
    ctx.font = "10px 'Inter', sans-serif";
    const dateObj = new Date(m + '-02');
    const monthShort = isNaN(dateObj.getTime()) ? m : dateObj.toLocaleString('en-US', { month: 'short' });
    ctx.fillText(monthShort, x + barWidth / 2, h - 12);
  });
}


/* --- MODULE: js/core/db.js --- */
/**
 * ReceiptVault - IndexedDB & LocalStorage Engine
 * Offline persistence for document records, image data URLs, tags, and settings.
 * Resilient against corrupted data and private browser restrictions.
 */



const DB_NAME = 'ReceiptVault_DB';
const DB_VERSION = 1;
const LOCALSTORAGE_KEY = 'receiptvault_documents_v1';

class ReceiptVaultDB {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve) => {
      try {
        if (!window.indexedDB) {
          console.warn('IndexedDB not supported, falling back to localStorage');
          this.initLocalStorageFallback();
          return resolve(null);
        }

        const req = indexedDB.open(DB_NAME, DB_VERSION);

        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains('documents')) {
            const store = db.createObjectStore('documents', { keyPath: 'id' });
            store.createIndex('category', 'category', { unique: false });
            store.createIndex('vendor', 'vendor', { unique: false });
            store.createIndex('purchaseDate', 'purchaseDate', { unique: false });
          }
        };

        req.onsuccess = async (e) => {
          this.db = e.target.result;
          const docs = await this.getAllDocuments();
          if (docs.length === 0) {
            for (const doc of SAMPLE_DOCUMENTS) {
              await this.saveDocument(doc);
            }
          }
          resolve(this.db);
        };

        req.onerror = () => {
          console.warn('IndexedDB permission denied/unavailable, using localStorage fallback');
          this.initLocalStorageFallback();
          resolve(null);
        };
      } catch (err) {
        console.warn('IndexedDB init exception, using localStorage fallback', err);
        this.initLocalStorageFallback();
        resolve(null);
      }
    });
  }

  initLocalStorageFallback() {
    const existing = localStorage.getItem(LOCALSTORAGE_KEY);
    if (!existing) {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(SAMPLE_DOCUMENTS));
    }
  }

  async getAllDocuments() {
    if (!this.db) {
      try {
        const str = localStorage.getItem(LOCALSTORAGE_KEY);
        if (!str) return [...SAMPLE_DOCUMENTS];
        const parsed = JSON.parse(str);
        return Array.isArray(parsed) ? parsed : [...SAMPLE_DOCUMENTS];
      } catch (e) {
        console.warn('Corrupted localStorage, resetting to demo sample', e);
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(SAMPLE_DOCUMENTS));
        return [...SAMPLE_DOCUMENTS];
      }
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('documents', 'readonly');
        const store = tx.objectStore('documents');
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([...SAMPLE_DOCUMENTS]);
      } catch (err) {
        resolve([...SAMPLE_DOCUMENTS]);
      }
    });
  }

  async saveDocument(doc) {
    if (!doc || !doc.id) return null;

    // Sanitize document properties
    const sanitized = {
      id: String(doc.id),
      title: String(doc.title || 'Untitled Document').trim(),
      vendor: String(doc.vendor || 'Unknown Vendor').trim(),
      vendorAddress: doc.vendorAddress ? String(doc.vendorAddress).trim() : '',
      vendorPhone: doc.vendorPhone ? String(doc.vendorPhone).trim() : '',
      invoiceNumber: doc.invoiceNumber ? String(doc.invoiceNumber).trim() : '',
      serialNumber: doc.serialNumber ? String(doc.serialNumber).trim() : '',
      amount: parseFloat(doc.amount) || 0,
      taxAmount: parseFloat(doc.taxAmount) || 0,
      currency: doc.currency || '$',
      purchaseDate: doc.purchaseDate || new Date().toISOString().split('T')[0],
      category: doc.category || 'Other',
      paymentMethod: doc.paymentMethod || 'Credit Card',
      warrantyType: doc.warrantyType || '',
      warrantyProvider: doc.warrantyProvider || '',
      warrantyExpirationDate: doc.warrantyExpirationDate || null,
      returnDeadlineDate: doc.returnDeadlineDate || null,
      returnPolicy: doc.returnPolicy || '',
      supportUrl: doc.supportUrl || '',
      notes: doc.notes || '',
      tags: Array.isArray(doc.tags) ? doc.tags : [],
      fileName: doc.fileName || `${doc.vendor || 'receipt'}.png`,
      items: Array.isArray(doc.items) ? doc.items : [],
      customImageData: doc.customImageData || null
    };

    if (!this.db) {
      const all = await this.getAllDocuments();
      const idx = all.findIndex(d => d.id === sanitized.id);
      if (idx >= 0) all[idx] = sanitized;
      else all.unshift(sanitized);
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(all));
      return sanitized;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction('documents', 'readwrite');
        const store = tx.objectStore('documents');
        store.put(sanitized);
        tx.oncomplete = () => resolve(sanitized);
        tx.onerror = () => reject(tx.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  async deleteDocument(id) {
    if (!id) return;
    if (!this.db) {
      let all = await this.getAllDocuments();
      all = all.filter(d => d.id !== id);
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(all));
      return;
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('documents', 'readwrite');
        const store = tx.objectStore('documents');
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (err) {
        resolve();
      }
    });
  }

  async resetDemoData() {
    if (!this.db) {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(SAMPLE_DOCUMENTS));
      return;
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction('documents', 'readwrite');
        const store = tx.objectStore('documents');
        store.clear();
        for (const doc of SAMPLE_DOCUMENTS) {
          store.put(doc);
        }
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (err) {
        resolve();
      }
    });
  }
}

const db = new ReceiptVaultDB();


/* --- MODULE: js/editor/document-viewer.js --- */
/**
 * ReceiptVault - Document Inspection & Interactive Image Studio Component
 * Pan/zoom/rotate receipt canvas, high-contrast filters, warranty countdowns, serial copy actions, and full metadata editor.
 */





class DocumentViewer {
  constructor(container, onSaveDoc, onDeleteDoc, onClose = null) {
    this.container = container;
    this.onSaveDoc = onSaveDoc;
    this.onDeleteDoc = onDeleteDoc;
    this.onClose = onClose;
    this.currentDoc = null;

    // Viewport transform state
    this.zoom = 1;
    this.rotation = 0; // 0, 90, 180, 270
    this.pan = { x: 0, y: 0 };
    this.isPanning = false;
    this.panStart = { x: 0, y: 0 };
    this.filterMode = 'normal'; // 'normal', 'invert', 'contrast'
    this.activeTab = 'details'; // 'details', 'warranty', 'items'
  }

  setDocument(doc) {
    this.currentDoc = doc ? JSON.parse(JSON.stringify(doc)) : null;
    this.resetTransform();
    this.render();
  }

  resetTransform() {
    this.zoom = 1;
    this.rotation = 0;
    this.pan = { x: 0, y: 0 };
    this.filterMode = 'normal';
  }

  render() {
    if (!this.currentDoc) {
      this.container.innerHTML = `
        <div class="empty-viewer-state flex flex-col items-center justify-center p-8 text-center text-muted h-full">
          <div class="mb-3 text-muted" style="opacity: 0.4;">
            ${getIcon('receipt', 'icon-lg')}
          </div>
          <span class="font-bold text-sm text-secondary">No Document Selected</span>
          <p class="text-xs text-muted mt-1 max-w-xs">Select a receipt from the library to inspect image details, warranty coverage, and purchase metadata.</p>
        </div>
      `;
      return;
    }

    const doc = this.currentDoc;
    const wInfo = getWarrantyInfo(doc.warrantyExpirationDate, new Date(), doc.purchaseDate);
    const rInfo = getReturnInfo(doc.returnDeadlineDate);

    this.container.innerHTML = `
      <!-- Top Inspector Header -->
      <div class="viewer-header-bar flex items-center justify-between px-3 py-2 border-b bg-panel">
        <div class="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
          ${getIcon('receipt', 'icon-sm text-primary flex-shrink-0')}
          <span class="font-bold text-xs truncate text-primary" title="${escapeHTML(doc.title)}">${escapeHTML(doc.title)}</span>
        </div>
        <div class="flex items-center gap-1 flex-shrink-0">
          <button class="btn btn-xs btn-primary" id="btn-viewer-save" title="Save Metadata Changes (Ctrl+S)">
            ${getIcon('check', 'icon-xs')} Save
          </button>
          <button class="btn btn-xs btn-secondary" id="btn-viewer-print" title="Print Document Voucher">
            ${getIcon('printer', 'icon-xs')}
          </button>
          <button class="btn btn-xs text-rose btn-secondary" id="btn-viewer-delete" title="Delete Document">
            ${getIcon('trash', 'icon-xs')}
          </button>
          ${this.onClose ? `
            <button class="btn btn-xs btn-secondary" id="btn-viewer-close" title="Close Inspector">
              ${getIcon('close', 'icon-xs')}
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Scrollable Inspector Content -->
      <div class="viewer-body-scroll flex-1 overflow-y-auto flex flex-col">
        
        <!-- Image Canvas Viewport & Floating Controls -->
        <div class="receipt-canvas-viewport-wrap relative">
          <canvas id="receipt-preview-canvas" class="receipt-preview-canvas"></canvas>

          <!-- Floating Image Controls Overlay -->
          <div class="viewer-floating-controls absolute flex items-center gap-1 p-1 rounded">
            <button class="btn-icon-xs" id="btn-zoom-out" title="Zoom Out" aria-label="Zoom Out">${getIcon('zoomOut', 'icon-xs')}</button>
            <span class="font-mono text-xs text-muted w-10 text-center select-none" id="viewer-zoom-label">${Math.round(this.zoom * 100)}%</span>
            <button class="btn-icon-xs" id="btn-zoom-in" title="Zoom In" aria-label="Zoom In">${getIcon('zoomIn', 'icon-xs')}</button>
            <button class="btn-icon-xs" id="btn-rotate" title="Rotate 90°" aria-label="Rotate 90°">${getIcon('rotate', 'icon-xs')}</button>
            <button class="btn-icon-xs" id="btn-filter-toggle" title="Toggle Contrast Filter (Normal / Invert / Contrast)" aria-label="Contrast Filter">${getIcon('contrast', 'icon-xs')}</button>
            <button class="btn-icon-xs" id="btn-download-img" title="Download Receipt Image" aria-label="Download Image">${getIcon('download', 'icon-xs')}</button>
            <button class="btn-icon-xs" id="btn-fit-reset" title="Fit to Viewport" aria-label="Fit Viewport">${getIcon('eye', 'icon-xs')}</button>
          </div>
        </div>

        <!-- Quick Summary Bar: Warranty & Return Statuses -->
        <div class="p-3 border-b flex flex-col gap-2 bg-elevated">
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <!-- Warranty Badge -->
            <div class="flex items-center gap-1">
              ${doc.warrantyExpirationDate ? `
                <span class="badge ${wInfo.status === WARRANTY_STATUS.ACTIVE ? 'badge-success' : (wInfo.status === WARRANTY_STATUS.EXPIRING_SOON ? 'badge-warning' : 'badge-secondary')} flex items-center gap-1">
                  ${getIcon(wInfo.status === WARRANTY_STATUS.EXPIRING_SOON ? 'shieldAlert' : 'shieldCheck', 'icon-xs')}
                  <span>${escapeHTML(wInfo.label)}</span>
                </span>
              ` : `
                <span class="badge badge-secondary text-muted">No Warranty</span>
              `}

              <!-- Return Badge -->
              ${doc.returnDeadlineDate ? `
                <span class="badge ${rInfo.status === RETURN_STATUS.OPEN ? 'badge-primary' : (rInfo.status === RETURN_STATUS.CLOSING_SOON ? 'badge-warning' : 'badge-secondary')} flex items-center gap-1">
                  ${getIcon('clock', 'icon-xs')}
                  <span>${escapeHTML(rInfo.label)}</span>
                </span>
              ` : ''}
            </div>

            <!-- Total Amount -->
            <span class="font-mono font-bold text-sm text-primary">${doc.currency || '$'}${Number(doc.amount || 0).toFixed(2)}</span>
          </div>

          <!-- Warranty Progress Bar (if active warranty) -->
          ${doc.warrantyExpirationDate && wInfo.status !== WARRANTY_STATUS.NONE ? `
            <div class="w-full flex flex-col gap-1 mt-1">
              <div class="flex items-center justify-between text-xs text-muted font-mono" style="font-size: 10px;">
                <span>Warranty Timeline</span>
                <span>${wInfo.progressPercent}% elapsed</span>
              </div>
              <div class="w-full bg-input rounded h-1 overflow-hidden" style="height: 4px; background: rgba(255,255,255,0.08);">
                <div class="h-full rounded" style="width: ${wInfo.progressPercent}%; background-color: ${wInfo.status === WARRANTY_STATUS.ACTIVE ? 'var(--accent-emerald)' : (wInfo.status === WARRANTY_STATUS.EXPIRING_SOON ? 'var(--accent-amber)' : 'var(--text-muted)')};"></div>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Quick Copy Actions (Serial Number, Invoice ID, Support Portal) -->
        ${(doc.serialNumber || doc.invoiceNumber || doc.supportUrl) ? `
          <div class="px-3 py-2 border-b bg-panel flex flex-wrap gap-2 items-center text-xs">
            ${doc.serialNumber ? `
              <button class="btn btn-xs btn-secondary flex items-center gap-1" id="btn-copy-serial" data-val="${escapeHTML(doc.serialNumber)}" title="Copy Serial Number">
                ${getIcon('copy', 'icon-xs')}
                <span>SN: <strong class="font-mono text-primary">${escapeHTML(doc.serialNumber)}</strong></span>
              </button>
            ` : ''}
            ${doc.invoiceNumber ? `
              <button class="btn btn-xs btn-secondary flex items-center gap-1" id="btn-copy-invoice" data-val="${escapeHTML(doc.invoiceNumber)}" title="Copy Invoice Number">
                ${getIcon('copy', 'icon-xs')}
                <span>Inv: <strong class="font-mono text-primary">${escapeHTML(doc.invoiceNumber)}</strong></span>
              </button>
            ` : ''}
            ${doc.supportUrl ? `
              <a href="${escapeHTML(doc.supportUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-xs btn-secondary flex items-center gap-1 text-primary" title="Open Manufacturer Support Portal">
                ${getIcon('externalLink', 'icon-xs')}
                <span>Support Portal</span>
              </a>
            ` : ''}
          </div>
        ` : ''}

        <!-- Editable Metadata Form -->
        <div class="p-3 flex flex-col gap-3">
          
          <!-- Document Title -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted" for="edit-doc-title">Document Title / Description</label>
            <input type="text" id="edit-doc-title" class="form-control form-control-sm font-semibold" value="${escapeHTML(doc.title)}" />
          </div>

          <!-- Merchant & Amount -->
          <div class="grid grid-cols-2 gap-2">
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted" for="edit-doc-vendor">Merchant / Vendor</label>
              <input type="text" id="edit-doc-vendor" class="form-control form-control-sm" value="${escapeHTML(doc.vendor)}" />
            </div>
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted" for="edit-doc-amount">Total Amount (${doc.currency || '$'})</label>
              <input type="number" step="0.01" id="edit-doc-amount" class="form-control form-control-sm font-mono font-bold" value="${doc.amount}" />
            </div>
          </div>

          <!-- Invoice # & Serial Number -->
          <div class="grid grid-cols-2 gap-2">
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted" for="edit-doc-invoice">Invoice / Order #</label>
              <input type="text" id="edit-doc-invoice" class="form-control form-control-sm font-mono" value="${escapeHTML(doc.invoiceNumber || '')}" placeholder="e.g. INV-99201" />
            </div>
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted" for="edit-doc-serial">Serial / License #</label>
              <input type="text" id="edit-doc-serial" class="form-control form-control-sm font-mono" value="${escapeHTML(doc.serialNumber || '')}" placeholder="e.g. SN-8829103" />
            </div>
          </div>

          <!-- Purchase Date & Category -->
          <div class="grid grid-cols-2 gap-2">
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted" for="edit-doc-date">Purchase Date</label>
              <input type="date" id="edit-doc-date" class="form-control form-control-sm font-mono" value="${doc.purchaseDate || ''}" />
            </div>
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted" for="edit-doc-category">Category</label>
              <select id="edit-doc-category" class="form-control form-control-sm font-semibold">
                ${['Electronics', 'Home', 'Clothing', 'Groceries', 'Software', 'Subscriptions', 'Travel', 'Other'].map(c => `
                  <option value="${c}" ${doc.category === c ? 'selected' : ''}>${c}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- Payment Method & Sales Tax -->
          <div class="grid grid-cols-2 gap-2">
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted" for="edit-doc-payment">Payment Method</label>
              <select id="edit-doc-payment" class="form-control form-control-sm">
                ${['Credit Card', 'Debit Card', 'Apple Pay', 'PayPal', 'Bank Transfer', 'Cash', 'Other'].map(p => `
                  <option value="${p}" ${doc.paymentMethod && doc.paymentMethod.includes(p) ? 'selected' : (doc.paymentMethod === p ? 'selected' : '')}>${p}</option>
                `).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted" for="edit-doc-tax">Tax Amount (${doc.currency || '$'})</label>
              <input type="number" step="0.01" id="edit-doc-tax" class="form-control form-control-sm font-mono" value="${doc.taxAmount || 0}" placeholder="0.00" />
            </div>
          </div>

          <!-- Warranty Expiry & Quick Date Chips -->
          <div class="form-group">
            <div class="flex items-center justify-between">
              <label class="form-label text-xs font-semibold text-muted" for="edit-doc-warranty">Warranty Expiration Date</label>
              <div class="flex items-center gap-1">
                <button type="button" class="btn-xs btn-secondary btn-quick-warranty" data-months="12" title="Set to 1 Year from Purchase">+1 Yr</button>
                <button type="button" class="btn-xs btn-secondary btn-quick-warranty" data-months="24" title="Set to 2 Years from Purchase">+2 Yr</button>
                <button type="button" class="btn-xs btn-secondary btn-quick-warranty" data-months="36" title="Set to 3 Years from Purchase">+3 Yr</button>
              </div>
            </div>
            <input type="date" id="edit-doc-warranty" class="form-control form-control-sm font-mono" value="${doc.warrantyExpirationDate || ''}" />
          </div>

          <!-- Return Deadline & Quick Chips -->
          <div class="form-group">
            <div class="flex items-center justify-between">
              <label class="form-label text-xs font-semibold text-muted" for="edit-doc-return">Return Deadline Date</label>
              <div class="flex items-center gap-1">
                <button type="button" class="btn-xs btn-secondary btn-quick-return" data-days="14" title="+14 Days">+14d</button>
                <button type="button" class="btn-xs btn-secondary btn-quick-return" data-days="30" title="+30 Days">+30d</button>
                <button type="button" class="btn-xs btn-secondary btn-quick-return" data-days="60" title="+60 Days">+60d</button>
              </div>
            </div>
            <input type="date" id="edit-doc-return" class="form-control form-control-sm font-mono" value="${doc.returnDeadlineDate || ''}" />
          </div>

          <!-- Warranty Terms & Support Details -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted" for="edit-doc-warranty-type">Warranty Coverage Terms / Policy</label>
            <input type="text" id="edit-doc-warranty-type" class="form-control form-control-sm" value="${escapeHTML(doc.warrantyType || '')}" placeholder="e.g. 3-Year AppleCare+ or 12-Year Commercial" />
          </div>

          <!-- Notes & Metadata -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted" for="edit-doc-notes">Notes & Filing Metadata</label>
            <textarea id="edit-doc-notes" class="form-control form-control-sm font-sans" rows="3" placeholder="Order ID, support case numbers, warranty terms, or location...">${escapeHTML(doc.notes || '')}</textarea>
          </div>

          <!-- Tags -->
          <div class="form-group mb-2">
            <label class="form-label text-xs font-semibold text-muted" for="edit-doc-tags">Tags (Comma-separated)</label>
            <input type="text" id="edit-doc-tags" class="form-control form-control-sm font-mono" value="${escapeHTML((doc.tags || []).join(', '))}" placeholder="e.g. work, hardware, tax-deductible" />
          </div>

        </div>

      </div>
    `;

    this.initCanvasAndEvents();
  }

  initCanvasAndEvents() {
    const canvas = this.container.querySelector('#receipt-preview-canvas');
    if (!canvas) return;

    this.drawCanvas(canvas);

    // Canvas panning & zooming
    canvas.addEventListener('mousedown', (e) => {
      this.isPanning = true;
      this.panStart = { x: e.clientX - this.pan.x, y: e.clientY - this.pan.y };
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isPanning) {
        this.pan.x = e.clientX - this.panStart.x;
        this.pan.y = e.clientY - this.panStart.y;
        this.drawCanvas(canvas);
      }
    });

    window.addEventListener('mouseup', () => {
      this.isPanning = false;
    });

    // Zoom Buttons
    this.container.querySelector('#btn-zoom-in')?.addEventListener('click', () => {
      this.zoom = Math.min(3.5, this.zoom * 1.25);
      this.updateZoomLabel();
      this.drawCanvas(canvas);
    });

    this.container.querySelector('#btn-zoom-out')?.addEventListener('click', () => {
      this.zoom = Math.max(0.35, this.zoom * 0.8);
      this.updateZoomLabel();
      this.drawCanvas(canvas);
    });

    this.container.querySelector('#btn-rotate')?.addEventListener('click', () => {
      this.rotation = (this.rotation + 90) % 360;
      this.drawCanvas(canvas);
    });

    this.container.querySelector('#btn-filter-toggle')?.addEventListener('click', () => {
      if (this.filterMode === 'normal') this.filterMode = 'contrast';
      else if (this.filterMode === 'contrast') this.filterMode = 'invert';
      else this.filterMode = 'normal';
      this.drawCanvas(canvas);
    });

    this.container.querySelector('#btn-fit-reset')?.addEventListener('click', () => {
      this.resetTransform();
      this.updateZoomLabel();
      this.drawCanvas(canvas);
    });

    this.container.querySelector('#btn-download-img')?.addEventListener('click', () => {
      this.downloadCanvasImage();
    });

    this.container.querySelector('#btn-viewer-print')?.addEventListener('click', () => {
      this.printDocumentVoucher();
    });

    // Copy buttons
    this.container.querySelectorAll('#btn-copy-serial, #btn-copy-invoice').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.val;
        if (val && navigator.clipboard) {
          navigator.clipboard.writeText(val);
          const originalHTML = btn.innerHTML;
          btn.innerHTML = `${getIcon('check', 'icon-xs text-emerald')} <span class="text-emerald font-bold">Copied!</span>`;
          setTimeout(() => { btn.innerHTML = originalHTML; }, 2000);
        }
      });
    });

    // Quick Date Calculator Chips
    this.container.querySelectorAll('.btn-quick-warranty').forEach(btn => {
      btn.addEventListener('click', () => {
        const months = parseInt(btn.dataset.months, 10);
        const purchaseInput = this.container.querySelector('#edit-doc-date');
        const baseDate = purchaseInput?.value ? new Date(purchaseInput.value) : new Date();
        if (!isNaN(baseDate.getTime())) {
          baseDate.setMonth(baseDate.getMonth() + months);
          const targetInp = this.container.querySelector('#edit-doc-warranty');
          if (targetInp) targetInp.value = baseDate.toISOString().split('T')[0];
        }
      });
    });

    this.container.querySelectorAll('.btn-quick-return').forEach(btn => {
      btn.addEventListener('click', () => {
        const days = parseInt(btn.dataset.days, 10);
        const purchaseInput = this.container.querySelector('#edit-doc-date');
        const baseDate = purchaseInput?.value ? new Date(purchaseInput.value) : new Date();
        if (!isNaN(baseDate.getTime())) {
          baseDate.setDate(baseDate.getDate() + days);
          const targetInp = this.container.querySelector('#edit-doc-return');
          if (targetInp) targetInp.value = baseDate.toISOString().split('T')[0];
        }
      });
    });

    // Save & Delete & Close buttons
    this.container.querySelector('#btn-viewer-save')?.addEventListener('click', () => {
      this.collectAndSave();
    });

    this.container.querySelector('#btn-viewer-delete')?.addEventListener('click', () => {
      if (confirm(`Are you sure you want to permanently delete "${this.currentDoc.title}"?`)) {
        if (this.onDeleteDoc) this.onDeleteDoc(this.currentDoc.id);
      }
    });

    this.container.querySelector('#btn-viewer-close')?.addEventListener('click', () => {
      if (this.onClose) this.onClose();
    });
  }

  drawCanvas(canvas) {
    const parent = canvas.parentElement;
    const w = parent.clientWidth || 340;
    const h = 240;
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);

    ctx.save();
    ctx.translate(w / 2 + this.pan.x, h / 2 + this.pan.y);
    ctx.scale(this.zoom, this.zoom);
    ctx.rotate((this.rotation * Math.PI) / 180);

    const docCanvas = generateReceiptCanvas(this.currentDoc, 280, 390, { filterMode: this.filterMode });
    ctx.drawImage(docCanvas, -140, -195, 280, 390);

    ctx.restore();
  }

  updateZoomLabel() {
    const zLabel = this.container.querySelector('#viewer-zoom-label');
    if (zLabel) zLabel.textContent = `${Math.round(this.zoom * 100)}%`;
  }

  downloadCanvasImage() {
    if (!this.currentDoc) return;
    const highResCanvas = generateReceiptCanvas(this.currentDoc, 480, 680, { filterMode: this.filterMode });
    const url = highResCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.currentDoc.vendor.replace(/\s+/g, '_')}_Receipt_${this.currentDoc.purchaseDate || 'document'}.png`;
    a.click();
  }

  printDocumentVoucher() {
    if (!this.currentDoc) return;
    window.print();
  }

  collectAndSave() {
    if (!this.currentDoc) return;

    this.currentDoc.title = this.container.querySelector('#edit-doc-title').value.trim() || 'Untitled Document';
    this.currentDoc.vendor = this.container.querySelector('#edit-doc-vendor').value.trim() || 'Unknown Vendor';
    this.currentDoc.amount = parseFloat(this.container.querySelector('#edit-doc-amount').value) || 0;
    this.currentDoc.taxAmount = parseFloat(this.container.querySelector('#edit-doc-tax').value) || 0;
    this.currentDoc.invoiceNumber = this.container.querySelector('#edit-doc-invoice').value.trim();
    this.currentDoc.serialNumber = this.container.querySelector('#edit-doc-serial').value.trim();
    this.currentDoc.purchaseDate = this.container.querySelector('#edit-doc-date').value || '';
    this.currentDoc.category = this.container.querySelector('#edit-doc-category').value;
    this.currentDoc.paymentMethod = this.container.querySelector('#edit-doc-payment').value;
    this.currentDoc.warrantyType = this.container.querySelector('#edit-doc-warranty-type').value.trim();
    this.currentDoc.warrantyExpirationDate = this.container.querySelector('#edit-doc-warranty').value || null;
    this.currentDoc.returnDeadlineDate = this.container.querySelector('#edit-doc-return').value || null;
    this.currentDoc.notes = this.container.querySelector('#edit-doc-notes').value.trim();

    const tagsRaw = this.container.querySelector('#edit-doc-tags').value;
    this.currentDoc.tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

    if (this.onSaveDoc) {
      this.onSaveDoc(this.currentDoc);
    }
  }
}


/* --- MODULE: js/editor/document-library.js --- */
/**
 * ReceiptVault - Document Library & Multi-Filter Component
 * Compact professional table listing receipts, warranties, amounts, categories, quick chips, and keyboard navigation.
 */




function renderDocumentLibrary(container, {
  documents = [],
  selectedDocId = null,
  filters = {},
  onSelectDoc = null,
  onFilterChange = null
}) {
  const filtered = filterDocuments(documents, filters);

  const categories = ['Electronics', 'Home', 'Clothing', 'Groceries', 'Software', 'Subscriptions', 'Travel', 'Other'];

  // Calculate quick chip counts
  const expiringCount = documents.filter(d => getWarrantyInfo(d.warrantyExpirationDate).status === WARRANTY_STATUS.EXPIRING_SOON).length;
  const returnsCount = documents.filter(d => {
    const r = getReturnInfo(d.returnDeadlineDate);
    return r.status === RETURN_STATUS.OPEN || r.status === RETURN_STATUS.CLOSING_SOON;
  }).length;

  container.innerHTML = `
    <!-- Top Filter Controls Bar -->
    <div class="library-filter-bar p-3 border-b flex flex-col gap-2 bg-panel">
      
      <!-- Primary Controls Row -->
      <div class="flex flex-wrap items-center justify-between gap-2">
        <!-- Search Input -->
        <div class="flex items-center gap-2 flex-1 min-w-[200px]">
          <div class="relative flex-1">
            <input type="text" id="lib-search-input" class="form-control form-control-sm pl-8 font-sans w-full" placeholder="Search vendor, title, serial #, invoice #, tags..." value="${escapeHTML(filters.search || '')}" aria-label="Search documents" />
            <span class="absolute left-2 top-2 text-muted pointer-events-none">${getIcon('search', 'icon-xs')}</span>
            ${filters.search ? `
              <button class="absolute right-2 top-1.5 btn-icon-xs text-muted" id="btn-clear-search" title="Clear Search" aria-label="Clear Search">${getIcon('close', 'icon-xs')}</button>
            ` : ''}
          </div>
        </div>

        <!-- Filter Dropdowns Group -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- Category Filter -->
          <select id="lib-filter-category" class="form-control form-control-sm font-semibold" aria-label="Filter by Category">
            <option value="">All Categories (${documents.length})</option>
            ${categories.map(c => {
              const count = documents.filter(d => d.category === c).length;
              return `<option value="${c}" ${filters.category === c ? 'selected' : ''}>${c} (${count})</option>`;
            }).join('')}
          </select>

          <!-- Warranty Status Filter -->
          <select id="lib-filter-warranty" class="form-control form-control-sm font-semibold" aria-label="Filter by Warranty">
            <option value="">All Warranties</option>
            <option value="ACTIVE" ${filters.warranty === 'ACTIVE' ? 'selected' : ''}>Active Protection</option>
            <option value="EXPIRING_SOON" ${filters.warranty === 'EXPIRING_SOON' ? 'selected' : ''}>Expiring Soon (≤30d)</option>
            <option value="EXPIRED" ${filters.warranty === 'EXPIRED' ? 'selected' : ''}>Expired Coverage</option>
          </select>

          <!-- Sort Order -->
          <select id="lib-sort-by" class="form-control form-control-sm font-semibold" aria-label="Sort by">
            <option value="date_desc" ${filters.sort === 'date_desc' ? 'selected' : ''}>Date: Newest First</option>
            <option value="date_asc" ${filters.sort === 'date_asc' ? 'selected' : ''}>Date: Oldest First</option>
            <option value="amount_desc" ${filters.sort === 'amount_desc' ? 'selected' : ''}>Amount: High to Low</option>
            <option value="amount_asc" ${filters.sort === 'amount_asc' ? 'selected' : ''}>Amount: Low to High</option>
            <option value="warranty_urgent" ${filters.sort === 'warranty_urgent' ? 'selected' : ''}>Warranty: Urgent First</option>
            <option value="title_asc" ${filters.sort === 'title_asc' ? 'selected' : ''}>Title: A to Z</option>
          </select>
        </div>
      </div>

      <!-- Quick Filter Chips Row -->
      <div class="flex flex-wrap items-center gap-1 text-xs">
        <span class="text-muted font-semibold text-xs mr-1">Quick Filters:</span>
        <button class="btn btn-xs ${!filters.category && !filters.warranty && !filters.quickTag ? 'btn-primary' : 'btn-secondary'} btn-chip-all">All</button>
        <button class="btn btn-xs ${filters.warranty === 'EXPIRING_SOON' ? 'btn-primary' : 'btn-secondary'} btn-chip-expiring">
          ${getIcon('shieldAlert', 'icon-xs text-amber')} Expiring Soon (${expiringCount})
        </button>
        <button class="btn btn-xs ${filters.warranty === 'ACTIVE' ? 'btn-primary' : 'btn-secondary'} btn-chip-active">
          ${getIcon('shieldCheck', 'icon-xs text-emerald')} Active Warranties
        </button>
        <button class="btn btn-xs ${filters.quickTag === 'tax-deductible' ? 'btn-primary' : 'btn-secondary'} btn-chip-tax">
          Tax Deductible
        </button>
      </div>

    </div>

    <!-- Documents Data Grid / Table -->
    <div class="library-table-wrapper flex-1 overflow-auto bg-app">
      ${filtered.length === 0 ? `
        <div class="empty-filter-state flex flex-col items-center justify-center p-8 text-center text-muted h-full">
          <div class="mb-2 text-muted" style="opacity: 0.5;">${getIcon('search', 'icon-lg')}</div>
          <span class="font-bold text-sm text-secondary">No Matching Documents</span>
          <p class="text-xs text-muted mt-1 max-w-sm">No records match your active search and filter criteria.</p>
          <button class="btn btn-sm btn-secondary mt-3" id="btn-reset-filters">
            ${getIcon('refreshCw', 'icon-xs')} Clear All Filters
          </button>
        </div>
      ` : `
        <table class="data-grid-table font-sans text-xs w-full" id="documents-table">
          <thead>
            <tr>
              <th class="w-8 text-center">Type</th>
              <th>Vendor & Document Description</th>
              <th>Category</th>
              <th>Purchase Date</th>
              <th class="text-right">Amount</th>
              <th>Warranty Protection</th>
              <th>Return Deadline</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(doc => {
              const isSelected = doc.id === selectedDocId;
              const wInfo = getWarrantyInfo(doc.warrantyExpirationDate, new Date(), doc.purchaseDate);
              const rInfo = getReturnInfo(doc.returnDeadlineDate);

              return `
                <tr class="document-row cursor-pointer ${isSelected ? 'active' : ''}" data-id="${doc.id}" tabindex="0" role="row" aria-selected="${isSelected}">
                  <td class="text-center text-muted">
                    ${getIcon('receipt', 'icon-xs')}
                  </td>
                  <td>
                    <div class="flex flex-col">
                      <div class="flex items-center gap-1.5">
                        <span class="font-bold text-primary truncate max-w-md">${escapeHTML(doc.title)}</span>
                        ${doc.serialNumber ? `<span class="badge badge-secondary font-mono" style="font-size: 9.5px;" title="Serial #${escapeHTML(doc.serialNumber)}">SN</span>` : ''}
                      </div>
                      <div class="flex items-center gap-2 text-muted" style="font-size: 11px;">
                        <span>${escapeHTML(doc.vendor)}</span>
                        ${doc.invoiceNumber ? `<span>&bull; Inv: ${escapeHTML(doc.invoiceNumber)}</span>` : ''}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-secondary">${escapeHTML(doc.category)}</span>
                  </td>
                  <td class="font-mono text-secondary">
                    ${escapeHTML(doc.purchaseDate || '-')}
                  </td>
                  <td class="font-mono font-bold text-right text-primary">
                    ${doc.currency || '$'}${Number(doc.amount || 0).toFixed(2)}
                  </td>
                  <td>
                    ${doc.warrantyExpirationDate ? `
                      <span class="badge ${wInfo.status === WARRANTY_STATUS.ACTIVE ? 'badge-success' : (wInfo.status === WARRANTY_STATUS.EXPIRING_SOON ? 'badge-warning' : 'badge-secondary')} flex items-center gap-1 w-fit">
                        ${getIcon(wInfo.status === WARRANTY_STATUS.EXPIRING_SOON ? 'shieldAlert' : 'shieldCheck', 'icon-xs')}
                        <span>${escapeHTML(wInfo.label)}</span>
                      </span>
                    ` : `<span class="text-muted text-xs">-</span>`}
                  </td>
                  <td>
                    ${doc.returnDeadlineDate ? `
                      <span class="badge ${rInfo.status === RETURN_STATUS.OPEN ? 'badge-primary' : (rInfo.status === RETURN_STATUS.CLOSING_SOON ? 'badge-warning' : 'badge-secondary')} flex items-center gap-1 w-fit">
                        ${getIcon('clock', 'icon-xs')}
                        <span>${escapeHTML(rInfo.label)}</span>
                      </span>
                    ` : `<span class="text-muted text-xs">-</span>`}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `}
    </div>

    <!-- Table Footer Stats Bar -->
    <div class="library-footer-bar px-3 py-1.5 border-t flex items-center justify-between text-xs text-muted font-mono bg-elevated">
      <span>Showing <strong>${filtered.length}</strong> of <strong>${documents.length}</strong> records</span>
      <span>Filtered Spend: <strong class="text-primary">$${filtered.reduce((sum, d) => sum + (Number(d.amount) || 0), 0).toFixed(2)}</strong></span>
    </div>
  `;

  // Attach Row Selection & Keyboard Navigation Handlers
  container.querySelectorAll('.document-row').forEach(row => {
    row.addEventListener('click', () => {
      if (onSelectDoc) onSelectDoc(row.dataset.id);
    });

    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (onSelectDoc) onSelectDoc(row.dataset.id);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = row.nextElementSibling;
        if (next && next.classList.contains('document-row')) {
          next.focus();
          if (onSelectDoc) onSelectDoc(next.dataset.id);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = row.previousElementSibling;
        if (prev && prev.classList.contains('document-row')) {
          prev.focus();
          if (onSelectDoc) onSelectDoc(prev.dataset.id);
        }
      }
    });
  });

  // Filter Input Listeners
  const searchInput = container.querySelector('#lib-search-input');
  searchInput?.addEventListener('input', (e) => {
    if (onFilterChange) onFilterChange({ ...filters, search: e.target.value });
  });

  container.querySelector('#btn-clear-search')?.addEventListener('click', () => {
    if (onFilterChange) onFilterChange({ ...filters, search: '' });
  });

  const catSelect = container.querySelector('#lib-filter-category');
  catSelect?.addEventListener('change', (e) => {
    if (onFilterChange) onFilterChange({ ...filters, category: e.target.value });
  });

  const warSelect = container.querySelector('#lib-filter-warranty');
  warSelect?.addEventListener('change', (e) => {
    if (onFilterChange) onFilterChange({ ...filters, warranty: e.target.value });
  });

  const sortSelect = container.querySelector('#lib-sort-by');
  sortSelect?.addEventListener('change', (e) => {
    if (onFilterChange) onFilterChange({ ...filters, sort: e.target.value });
  });

  // Quick Chip Handlers
  container.querySelector('.btn-chip-all')?.addEventListener('click', () => {
    if (onFilterChange) onFilterChange({ search: '', category: '', warranty: '', quickTag: '', sort: filters.sort || 'date_desc' });
  });

  container.querySelector('.btn-chip-expiring')?.addEventListener('click', () => {
    if (onFilterChange) onFilterChange({ ...filters, warranty: 'EXPIRING_SOON', quickTag: '' });
  });

  container.querySelector('.btn-chip-active')?.addEventListener('click', () => {
    if (onFilterChange) onFilterChange({ ...filters, warranty: 'ACTIVE', quickTag: '' });
  });

  container.querySelector('.btn-chip-tax')?.addEventListener('click', () => {
    if (onFilterChange) onFilterChange({ ...filters, quickTag: 'tax-deductible' });
  });

  container.querySelector('#btn-reset-filters')?.addEventListener('click', () => {
    if (onFilterChange) onFilterChange({ search: '', category: '', warranty: '', quickTag: '', sort: 'date_desc' });
  });
}

function filterDocuments(documents, filters = {}) {
  let list = [...documents];

  // 1. Text Search
  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(d =>
      (d.title && d.title.toLowerCase().includes(q)) ||
      (d.vendor && d.vendor.toLowerCase().includes(q)) ||
      (d.invoiceNumber && d.invoiceNumber.toLowerCase().includes(q)) ||
      (d.serialNumber && d.serialNumber.toLowerCase().includes(q)) ||
      (d.category && d.category.toLowerCase().includes(q)) ||
      (d.notes && d.notes.toLowerCase().includes(q)) ||
      (d.tags && d.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  // 2. Category
  if (filters.category) {
    list = list.filter(d => d.category === filters.category);
  }

  // 3. Warranty Status
  if (filters.warranty) {
    list = list.filter(d => {
      const wInfo = getWarrantyInfo(d.warrantyExpirationDate);
      return wInfo.status === filters.warranty;
    });
  }

  // 4. Quick Tag Filter
  if (filters.quickTag) {
    list = list.filter(d => d.tags && d.tags.includes(filters.quickTag));
  }

  // 5. Sorting
  const sortKey = filters.sort || 'date_desc';
  list.sort((a, b) => {
    if (sortKey === 'date_desc') return new Date(b.purchaseDate || 0) - new Date(a.purchaseDate || 0);
    if (sortKey === 'date_asc') return new Date(a.purchaseDate || 0) - new Date(b.purchaseDate || 0);
    if (sortKey === 'amount_desc') return (b.amount || 0) - (a.amount || 0);
    if (sortKey === 'amount_asc') return (a.amount || 0) - (b.amount || 0);
    if (sortKey === 'title_asc') return (a.title || '').localeCompare(b.title || '');
    if (sortKey === 'warranty_urgent') {
      const wA = getWarrantyInfo(a.warrantyExpirationDate).daysRemaining ?? 99999;
      const wB = getWarrantyInfo(b.warrantyExpirationDate).daysRemaining ?? 99999;
      return wA - wB;
    }
    return 0;
  });

  return list;
}


/* --- MODULE: js/editor/dashboard.js --- */
/**
 * ReceiptVault - Dashboard Component
 * KPI Summary Cards, Urgent Expiry Timeline, Category Donut & Monthly Bar Charts, and Fast Action Shortcuts.
 */





function renderDashboard(container, {
  documents = [],
  onSelectDoc = null,
  onNavigateTab = null,
  onNewReceipt = null
}) {
  const metrics = calculateVaultMetrics(documents);

  // Find urgent action items (warranties expiring in <= 30d or return closing in <= 7d)
  const urgentWarranties = documents.filter(d => {
    const w = getWarrantyInfo(d.warrantyExpirationDate);
    return w.status === WARRANTY_STATUS.EXPIRING_SOON;
  });

  const urgentReturns = documents.filter(d => {
    const r = getReturnInfo(d.returnDeadlineDate);
    return r.status === RETURN_STATUS.CLOSING_SOON || (r.status === RETURN_STATUS.OPEN && r.daysRemaining <= 7);
  });

  container.innerHTML = `
    <div class="dashboard-scroll-wrap p-4 flex flex-col gap-4 overflow-y-auto flex-1 max-w-6xl mx-auto w-full">
      
      <!-- Dashboard Top Header Bar -->
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 class="text-sm font-bold uppercase tracking-wider text-primary">Filing Cabinet & Warranty Overview</h1>
          <p class="text-xs text-muted">Audited summary of ${metrics.totalDocuments} local documents, warranty protection, and return deadlines.</p>
        </div>
        <div class="flex items-center gap-2">
          <button class="btn btn-sm btn-primary" id="btn-dash-new-receipt">
            ${getIcon('plus', 'icon-xs')} New Receipt
          </button>
          <button class="btn btn-sm btn-secondary" id="btn-dash-view-library">
            ${getIcon('folder', 'icon-xs')} View All Documents
          </button>
        </div>
      </div>

      <!-- Top KPI Summary Cards Grid -->
      <div class="grid grid-cols-4 gap-3">
        <!-- 1. Total Spend -->
        <div class="card p-3 flex flex-col gap-1">
          <div class="flex items-center justify-between text-muted">
            <span class="text-xs font-semibold">Total Documented Spend</span>
            ${getIcon('dollar', 'icon-sm text-primary')}
          </div>
          <span class="font-mono font-bold text-xl text-primary">$${metrics.totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span class="text-xs text-muted font-sans">${metrics.totalDocuments} total filing records</span>
        </div>

        <!-- 2. Protected Warranty Value -->
        <div class="card p-3 flex flex-col gap-1">
          <div class="flex items-center justify-between text-muted">
            <span class="text-xs font-semibold">Active Warranty Coverage</span>
            ${getIcon('shieldCheck', 'icon-sm text-emerald')}
          </div>
          <span class="font-mono font-bold text-xl text-emerald">$${metrics.protectedAssetValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span class="text-xs text-muted font-sans">${metrics.activeWarrantiesCount} items (${metrics.coverageRatio}% of vault value)</span>
        </div>

        <!-- 3. Expiring Soon Warranties -->
        <div class="card p-3 flex flex-col gap-1">
          <div class="flex items-center justify-between text-muted">
            <span class="text-xs font-semibold">Expiring Warranties (≤30d)</span>
            ${getIcon('shieldAlert', 'icon-sm text-amber')}
          </div>
          <span class="font-mono font-bold text-xl text-amber">${metrics.expiringSoonWarrantiesCount}</span>
          <span class="text-xs text-muted font-sans">Requires warranty extension / inspection</span>
        </div>

        <!-- 4. Open Return Windows -->
        <div class="card p-3 flex flex-col gap-1">
          <div class="flex items-center justify-between text-muted">
            <span class="text-xs font-semibold">Active Return Windows</span>
            ${getIcon('clock', 'icon-sm text-primary')}
          </div>
          <span class="font-mono font-bold text-xl text-primary">${metrics.openReturnsCount}</span>
          <span class="text-xs text-muted font-sans">Eligible for merchant return / exchange</span>
        </div>
      </div>

      <!-- Urgent Alerts Banner (If any expiring soon items) -->
      ${urgentWarranties.length > 0 || urgentReturns.length > 0 ? `
        <div class="card p-3 border-amber bg-amber-subtle flex flex-col gap-2">
          <div class="flex items-center gap-2 text-amber font-bold text-xs">
            ${getIcon('alertTriangle', 'icon-xs')}
            <span>Urgent Expiration & Return Action Items</span>
          </div>
          <div class="flex flex-wrap gap-2">
            ${urgentWarranties.map(d => {
              const w = getWarrantyInfo(d.warrantyExpirationDate);
              return `
                <div class="badge badge-warning cursor-pointer flex items-center gap-1.5 doc-alert-tag p-1.5" data-id="${d.id}" title="Click to view ${escapeHTML(d.title)}">
                  ${getIcon('shieldAlert', 'icon-xs')}
                  <span><strong>${escapeHTML(d.title)}</strong> (Warranty expires in ${w.daysRemaining}d)</span>
                  ${getIcon('arrowRight', 'icon-xs')}
                </div>
              `;
            }).join('')}
            ${urgentReturns.map(d => {
              const r = getReturnInfo(d.returnDeadlineDate);
              return `
                <div class="badge badge-primary cursor-pointer flex items-center gap-1.5 doc-alert-tag p-1.5" data-id="${d.id}" title="Click to view ${escapeHTML(d.title)}">
                  ${getIcon('clock', 'icon-xs')}
                  <span><strong>${escapeHTML(d.title)}</strong> (Return closes in ${r.daysRemaining}d)</span>
                  ${getIcon('arrowRight', 'icon-xs')}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Visual Charts Grid (Category Donut & Monthly Spending Bar) -->
      <div class="grid grid-cols-2 gap-4">
        <!-- Category Distribution Donut -->
        <div class="card p-3 flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold uppercase text-muted">Spending by Category</span>
            <span class="text-xs text-muted font-mono">${metrics.totalDocuments} Records</span>
          </div>
          <div class="flex items-center justify-center flex-1" style="min-height: 220px;">
            <canvas id="dashboard-category-donut" width="300" height="220"></canvas>
          </div>
        </div>

        <!-- Monthly Spending Trend Bars -->
        <div class="card p-3 flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold uppercase text-muted">Monthly Spending Trend</span>
            <span class="text-xs text-muted font-mono">Recent History</span>
          </div>
          <div class="flex items-center justify-center flex-1" style="min-height: 220px;">
            <canvas id="dashboard-monthly-bars" width="340" height="220"></canvas>
          </div>
        </div>
      </div>

      <!-- Recent Documents Table -->
      <div class="card p-3 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase text-muted">Recent Documents & Invoices</span>
          <button class="btn btn-xs btn-secondary" id="btn-view-all-docs">View Full Library &rarr;</button>
        </div>

        <div class="overflow-x-auto">
          <table class="data-grid-table font-sans text-xs w-full">
            <thead>
              <tr>
                <th>Document & Vendor</th>
                <th>Category</th>
                <th>Purchase Date</th>
                <th class="text-right">Amount</th>
                <th>Warranty Status</th>
              </tr>
            </thead>
            <tbody>
              ${documents.slice(0, 6).map(doc => {
                const w = getWarrantyInfo(doc.warrantyExpirationDate);
                return `
                  <tr class="cursor-pointer recent-doc-row" data-id="${doc.id}">
                    <td>
                      <div class="flex flex-col">
                        <span class="font-bold text-primary">${escapeHTML(doc.title)}</span>
                        <span class="text-xs text-muted">${escapeHTML(doc.vendor)}</span>
                      </div>
                    </td>
                    <td><span class="badge badge-secondary">${escapeHTML(doc.category)}</span></td>
                    <td class="font-mono text-secondary">${escapeHTML(doc.purchaseDate || '-')}</td>
                    <td class="font-mono font-bold text-right text-primary">${doc.currency || '$'}${Number(doc.amount || 0).toFixed(2)}</td>
                    <td>
                      ${doc.warrantyExpirationDate ? `
                        <span class="badge ${w.status === WARRANTY_STATUS.ACTIVE ? 'badge-success' : (w.status === WARRANTY_STATUS.EXPIRING_SOON ? 'badge-warning' : 'badge-secondary')} flex items-center gap-1 w-fit">
                          ${getIcon(w.status === WARRANTY_STATUS.EXPIRING_SOON ? 'shieldAlert' : 'shieldCheck', 'icon-xs')}
                          <span>${escapeHTML(w.label)}</span>
                        </span>
                      ` : '<span class="text-muted text-xs">-</span>'}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;

  // Draw Charts
  const donutCanvas = container.querySelector('#dashboard-category-donut');
  if (donutCanvas) renderCategoryDonut(donutCanvas, documents);

  const barCanvas = container.querySelector('#dashboard-monthly-bars');
  if (barCanvas) renderMonthlyBarChart(barCanvas, documents);

  // Attach Listeners
  container.querySelectorAll('.doc-alert-tag, .recent-doc-row').forEach(el => {
    el.addEventListener('click', () => {
      if (onSelectDoc) onSelectDoc(el.dataset.id);
    });
  });

  container.querySelector('#btn-dash-view-library')?.addEventListener('click', () => {
    if (onNavigateTab) onNavigateTab('library');
  });

  container.querySelector('#btn-view-all-docs')?.addEventListener('click', () => {
    if (onNavigateTab) onNavigateTab('library');
  });

  container.querySelector('#btn-dash-new-receipt')?.addEventListener('click', () => {
    if (onNewReceipt) onNewReceipt();
  });
}


/* --- MODULE: js/editor/upload-modal.js --- */
/**
 * ReceiptVault - Upload & Document Entry Modal
 * Handles local receipt file selection, image data reading, manual metadata entry, quick date calculators, and duplicate conflict checks.
 */




class UploadModal {
  constructor(container, existingDocs = [], onSaveDocument) {
    this.container = container;
    this.existingDocs = existingDocs;
    this.onSaveDocument = onSaveDocument;

    this.docData = this.getEmptyDoc();
    this.duplicateWarning = null;
    this.customImageData = null;
  }

  setExistingDocs(docs) {
    this.existingDocs = docs;
  }

  getEmptyDoc() {
    return {
      id: 'doc_' + Date.now(),
      title: '',
      vendor: '',
      vendorAddress: '',
      invoiceNumber: '',
      serialNumber: '',
      amount: '',
      taxAmount: '',
      currency: '$',
      purchaseDate: new Date().toISOString().split('T')[0],
      category: 'Electronics',
      paymentMethod: 'Credit Card',
      warrantyType: '',
      warrantyExpirationDate: '',
      returnDeadlineDate: '',
      supportUrl: '',
      notes: '',
      tags: [],
      fileName: '',
      items: []
    };
  }

  open() {
    this.docData = this.getEmptyDoc();
    this.duplicateWarning = null;
    this.customImageData = null;
    this.render();
    this.container.classList.add('active');

    // Focus initial input
    setTimeout(() => {
      this.container.querySelector('#up-doc-title')?.focus();
    }, 100);
  }

  close() {
    this.container.classList.remove('active');
  }

  render() {
    this.container.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-dialog upload-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        
        <!-- Modal Header -->
        <div class="modal-header flex items-center justify-between p-3 border-b bg-panel">
          <div class="flex items-center gap-2">
            ${getIcon('upload', 'icon-sm text-primary')}
            <span class="font-bold text-sm text-primary" id="modal-title">Add New Receipt / Document</span>
          </div>
          <button class="btn-icon-xs btn-modal-close" aria-label="Close dialog">${getIcon('close', 'icon-xs')}</button>
        </div>

        <!-- Modal Body Scrollable -->
        <div class="modal-body p-4 flex flex-col gap-3 overflow-y-auto" style="max-height: 78vh;">
          
          <!-- File Drop Zone & Image Preview -->
          <div class="upload-dropzone p-4 border border-dashed rounded text-center cursor-pointer relative" id="dropzone-file">
            <input type="file" id="input-receipt-file" accept="image/*,.pdf" style="display: none;" />
            <div class="flex flex-col items-center gap-1 text-muted" id="dropzone-content">
              ${getIcon('upload', 'icon-md text-primary')}
              <span class="font-bold text-xs text-primary">Drag & drop receipt image / click to browse</span>
              <span class="text-xs text-muted">PNG, JPG, WebP &bull; 100% processed locally on your machine</span>
              <span class="text-xs font-mono text-emerald mt-1 font-bold" id="label-selected-file">${this.docData.fileName ? escapeHTML(this.docData.fileName) : ''}</span>
            </div>
            ${this.customImageData ? `
              <div class="mt-2 flex items-center justify-center">
                <img src="${this.customImageData}" alt="Receipt thumbnail" class="rounded border" style="max-height: 80px; object-fit: contain;" />
              </div>
            ` : ''}
          </div>

          <!-- Duplicate Conflict Warning Banner -->
          <div id="duplicate-warning-banner" class="card p-3 border-amber bg-amber-subtle text-amber font-sans text-xs ${this.duplicateWarning ? '' : 'hidden'}">
            <div class="flex items-center gap-2 font-bold mb-1">
              ${getIcon('alertTriangle', 'icon-xs')}
              <span>Potential Duplicate Record Detected</span>
            </div>
            <p id="duplicate-reason-text">${this.duplicateWarning ? escapeHTML(this.duplicateWarning.reason) : ''}</p>
          </div>

          <!-- Document Metadata Form -->
          <div class="flex flex-col gap-3">
            
            <!-- Document Title -->
            <div class="form-group">
              <label class="form-label text-xs font-semibold" for="up-doc-title">Document Title / Product Name *</label>
              <input type="text" id="up-doc-title" class="form-control form-control-sm font-semibold" placeholder="e.g. Sony WH-1000XM5 Wireless Headphones" value="${escapeHTML(this.docData.title)}" required />
            </div>

            <!-- Merchant & Total Amount -->
            <div class="grid grid-cols-2 gap-2">
              <div class="form-group">
                <label class="form-label text-xs font-semibold" for="up-doc-vendor">Merchant / Vendor *</label>
                <input type="text" id="up-doc-vendor" class="form-control form-control-sm" placeholder="e.g. Best Buy" value="${escapeHTML(this.docData.vendor)}" required />
              </div>
              <div class="form-group">
                <label class="form-label text-xs font-semibold" for="up-doc-amount">Total Amount ($) *</label>
                <input type="number" step="0.01" id="up-doc-amount" class="form-control form-control-sm font-mono font-bold" placeholder="0.00" value="${this.docData.amount}" required />
              </div>
            </div>

            <!-- Invoice # & Serial # -->
            <div class="grid grid-cols-2 gap-2">
              <div class="form-group">
                <label class="form-label text-xs font-semibold" for="up-doc-invoice">Invoice / Receipt #</label>
                <input type="text" id="up-doc-invoice" class="form-control form-control-sm font-mono" placeholder="e.g. INV-2024-9910" value="${escapeHTML(this.docData.invoiceNumber)}" />
              </div>
              <div class="form-group">
                <label class="form-label text-xs font-semibold" for="up-doc-serial">Serial / License #</label>
                <input type="text" id="up-doc-serial" class="form-control form-control-sm font-mono" placeholder="e.g. SN-8829103" value="${escapeHTML(this.docData.serialNumber)}" />
              </div>
            </div>

            <!-- Date & Category -->
            <div class="grid grid-cols-2 gap-2">
              <div class="form-group">
                <label class="form-label text-xs font-semibold" for="up-doc-date">Purchase Date *</label>
                <input type="date" id="up-doc-date" class="form-control form-control-sm font-mono" value="${this.docData.purchaseDate}" />
              </div>
              <div class="form-group">
                <label class="form-label text-xs font-semibold" for="up-doc-category">Category</label>
                <select id="up-doc-category" class="form-control form-control-sm font-semibold">
                  ${['Electronics', 'Home', 'Clothing', 'Groceries', 'Software', 'Subscriptions', 'Travel', 'Other'].map(c => `
                    <option value="${c}" ${this.docData.category === c ? 'selected' : ''}>${c}</option>
                  `).join('')}
                </select>
              </div>
            </div>

            <!-- Payment Method & Sales Tax -->
            <div class="grid grid-cols-2 gap-2">
              <div class="form-group">
                <label class="form-label text-xs font-semibold" for="up-doc-payment">Payment Method</label>
                <select id="up-doc-payment" class="form-control form-control-sm">
                  ${['Credit Card', 'Debit Card', 'Apple Pay', 'PayPal', 'Bank Transfer', 'Cash', 'Other'].map(p => `
                    <option value="${p}" ${this.docData.paymentMethod === p ? 'selected' : ''}>${p}</option>
                  `).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label text-xs font-semibold" for="up-doc-tax">Sales Tax / VAT ($)</label>
                <input type="number" step="0.01" id="up-doc-tax" class="form-control form-control-sm font-mono" placeholder="0.00" value="${this.docData.taxAmount}" />
              </div>
            </div>

            <!-- Warranty Expiry & Quick Date Chips -->
            <div class="form-group">
              <div class="flex items-center justify-between">
                <label class="form-label text-xs font-semibold" for="up-doc-warranty">Warranty Expiration Date</label>
                <div class="flex items-center gap-1">
                  <button type="button" class="btn-xs btn-secondary btn-modal-warranty" data-months="12" title="Set to 1 Year">+1 Yr</button>
                  <button type="button" class="btn-xs btn-secondary btn-modal-warranty" data-months="24" title="Set to 2 Years">+2 Yr</button>
                  <button type="button" class="btn-xs btn-secondary btn-modal-warranty" data-months="36" title="Set to 3 Years">+3 Yr</button>
                </div>
              </div>
              <input type="date" id="up-doc-warranty" class="form-control form-control-sm font-mono" value="${this.docData.warrantyExpirationDate}" />
            </div>

            <!-- Return Deadline & Quick Date Chips -->
            <div class="form-group">
              <div class="flex items-center justify-between">
                <label class="form-label text-xs font-semibold" for="up-doc-return">Return Deadline Date</label>
                <div class="flex items-center gap-1">
                  <button type="button" class="btn-xs btn-secondary btn-modal-return" data-days="14" title="+14 Days">+14d</button>
                  <button type="button" class="btn-xs btn-secondary btn-modal-return" data-days="30" title="+30 Days">+30d</button>
                  <button type="button" class="btn-xs btn-secondary btn-modal-return" data-days="60" title="+60 Days">+60d</button>
                </div>
              </div>
              <input type="date" id="up-doc-return" class="form-control form-control-sm font-mono" value="${this.docData.returnDeadlineDate}" />
            </div>

            <!-- Warranty Terms / Notes -->
            <div class="form-group">
              <label class="form-label text-xs font-semibold" for="up-doc-warranty-type">Warranty Policy / Terms</label>
              <input type="text" id="up-doc-warranty-type" class="form-control form-control-sm" placeholder="e.g. 2-Year Manufacturer Warranty or AppleCare+" value="${escapeHTML(this.docData.warrantyType)}" />
            </div>

            <!-- Notes -->
            <div class="form-group">
              <label class="form-label text-xs font-semibold" for="up-doc-notes">Notes & Support Details</label>
              <textarea id="up-doc-notes" class="form-control form-control-sm" rows="2" placeholder="Order ID, support link, serial numbers, or location...">${escapeHTML(this.docData.notes)}</textarea>
            </div>

            <!-- Tags -->
            <div class="form-group">
              <label class="form-label text-xs font-semibold" for="up-doc-tags">Tags (Comma-separated)</label>
              <input type="text" id="up-doc-tags" class="form-control form-control-sm font-mono" placeholder="work, applecare, tax-deductible" value="${escapeHTML(this.docData.tags.join(', '))}" />
            </div>

          </div>

        </div>

        <!-- Modal Footer -->
        <div class="modal-footer p-3 border-t bg-panel flex justify-end gap-2">
          <button class="btn btn-sm btn-secondary btn-modal-close" type="button">Cancel</button>
          <button class="btn btn-sm btn-primary" id="btn-submit-document" type="button">Save to Vault</button>
        </div>
      </div>
    `;

    this.initEvents();
  }

  initEvents() {
    this.container.querySelectorAll('.btn-modal-close, .modal-backdrop').forEach(b => {
      b.addEventListener('click', () => this.close());
    });

    const dropzone = this.container.querySelector('#dropzone-file');
    const fileInput = this.container.querySelector('#input-receipt-file');

    dropzone?.addEventListener('click', () => fileInput?.click());

    // Drag and Drop handlers
    dropzone?.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('border-primary');
    });
    dropzone?.addEventListener('dragleave', () => {
      dropzone.classList.remove('border-primary');
    });
    dropzone?.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('border-primary');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        this.handleFileSelected(e.dataTransfer.files[0]);
      }
    });

    fileInput?.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        this.handleFileSelected(e.target.files[0]);
      }
    });

    // Quick Date Calculator Chips
    this.container.querySelectorAll('.btn-modal-warranty').forEach(btn => {
      btn.addEventListener('click', () => {
        const months = parseInt(btn.dataset.months, 10);
        const purchaseInput = this.container.querySelector('#up-doc-date');
        const baseDate = purchaseInput?.value ? new Date(purchaseInput.value) : new Date();
        if (!isNaN(baseDate.getTime())) {
          baseDate.setMonth(baseDate.getMonth() + months);
          const targetInp = this.container.querySelector('#up-doc-warranty');
          if (targetInp) targetInp.value = baseDate.toISOString().split('T')[0];
        }
      });
    });

    this.container.querySelectorAll('.btn-modal-return').forEach(btn => {
      btn.addEventListener('click', () => {
        const days = parseInt(btn.dataset.days, 10);
        const purchaseInput = this.container.querySelector('#up-doc-date');
        const baseDate = purchaseInput?.value ? new Date(purchaseInput.value) : new Date();
        if (!isNaN(baseDate.getTime())) {
          baseDate.setDate(baseDate.getDate() + days);
          const targetInp = this.container.querySelector('#up-doc-return');
          if (targetInp) targetInp.value = baseDate.toISOString().split('T')[0];
        }
      });
    });

    // Real-time Duplicate Check
    const checkDuplicate = () => {
      const vendor = this.container.querySelector('#up-doc-vendor')?.value.trim();
      const amount = parseFloat(this.container.querySelector('#up-doc-amount')?.value) || 0;
      const purchaseDate = this.container.querySelector('#up-doc-date')?.value;
      const invoiceNumber = this.container.querySelector('#up-doc-invoice')?.value.trim();

      const dup = findPotentialDuplicate({ vendor, amount, purchaseDate, invoiceNumber }, this.existingDocs);
      const banner = this.container.querySelector('#duplicate-warning-banner');
      const reasonEl = this.container.querySelector('#duplicate-reason-text');

      if (dup) {
        this.duplicateWarning = dup;
        banner?.classList.remove('hidden');
        if (reasonEl) reasonEl.textContent = dup.reason;
      } else {
        this.duplicateWarning = null;
        banner?.classList.add('hidden');
      }
    };

    this.container.querySelector('#up-doc-vendor')?.addEventListener('input', checkDuplicate);
    this.container.querySelector('#up-doc-amount')?.addEventListener('input', checkDuplicate);
    this.container.querySelector('#up-doc-date')?.addEventListener('input', checkDuplicate);
    this.container.querySelector('#up-doc-invoice')?.addEventListener('input', checkDuplicate);

    // Save Submit
    this.container.querySelector('#btn-submit-document')?.addEventListener('click', () => {
      this.submitDocument();
    });

    // Enter key submit in input fields
    this.container.querySelectorAll('input').forEach(inp => {
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.submitDocument();
        }
      });
    });
  }

  handleFileSelected(file) {
    this.docData.fileName = file.name;
    const label = this.container.querySelector('#label-selected-file');
    if (label) label.textContent = file.name;

    // Auto-fill title if empty
    const titleInp = this.container.querySelector('#up-doc-title');
    if (titleInp && !titleInp.value) {
      titleInp.value = file.name.replace(/\.[^/.]+$/, '').replace(/[_|-]/g, ' ');
    }

    // Read image if image file
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.customImageData = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  submitDocument() {
    const title = this.container.querySelector('#up-doc-title')?.value.trim();
    const vendor = this.container.querySelector('#up-doc-vendor')?.value.trim();
    const amount = parseFloat(this.container.querySelector('#up-doc-amount')?.value);
    const purchaseDate = this.container.querySelector('#up-doc-date')?.value;

    if (!title) {
      this.container.querySelector('#up-doc-title')?.focus();
      return alert('Please enter a document title / description.');
    }
    if (!vendor) {
      this.container.querySelector('#up-doc-vendor')?.focus();
      return alert('Please enter a vendor / merchant name.');
    }
    if (isNaN(amount) || amount <= 0) {
      this.container.querySelector('#up-doc-amount')?.focus();
      return alert('Please enter a valid total amount (greater than 0).');
    }

    const newDoc = {
      id: 'doc_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      title,
      vendor,
      amount,
      taxAmount: parseFloat(this.container.querySelector('#up-doc-tax')?.value) || 0,
      currency: '$',
      invoiceNumber: this.container.querySelector('#up-doc-invoice')?.value.trim() || '',
      serialNumber: this.container.querySelector('#up-doc-serial')?.value.trim() || '',
      purchaseDate: purchaseDate || new Date().toISOString().split('T')[0],
      category: this.container.querySelector('#up-doc-category')?.value || 'Other',
      paymentMethod: this.container.querySelector('#up-doc-payment')?.value || 'Credit Card',
      warrantyType: this.container.querySelector('#up-doc-warranty-type')?.value.trim() || '',
      warrantyExpirationDate: this.container.querySelector('#up-doc-warranty')?.value || null,
      returnDeadlineDate: this.container.querySelector('#up-doc-return')?.value || null,
      notes: this.container.querySelector('#up-doc-notes')?.value.trim() || '',
      tags: (this.container.querySelector('#up-doc-tags')?.value || '').split(',').map(t => t.trim()).filter(Boolean),
      fileName: this.docData.fileName || `${vendor.replace(/\s+/g, '_')}_Receipt.png`,
      customImageData: this.customImageData || null,
      items: [{ name: title, qty: 1, price: amount }]
    };

    if (this.onSaveDocument) {
      this.onSaveDocument(newDoc);
    }
    this.close();
  }
}


/* --- MODULE: js/editor/reports.js --- */
/**
 * ReceiptVault - Financial & Warranty Reports Component
 * Comprehensive financial summaries, category/vendor leaderboards, tax deduction metrics, and CSV ledger export.
 */




function renderReports(container, {
  documents = [],
  onExportCSV = null
}) {
  const metrics = calculateVaultMetrics(documents);

  // Group by category
  const categoryStats = {};
  let totalTax = 0;
  let taxDeductibleSpend = 0;

  for (const doc of documents) {
    const cat = doc.category || 'Other';
    if (!categoryStats[cat]) categoryStats[cat] = { total: 0, count: 0, protected: 0, tax: 0 };
    const amt = Number(doc.amount) || 0;
    const tax = Number(doc.taxAmount) || 0;

    categoryStats[cat].total += amt;
    categoryStats[cat].count++;
    categoryStats[cat].tax += tax;
    totalTax += tax;

    if (doc.tags && (doc.tags.includes('tax-deductible') || doc.tags.includes('work') || doc.tags.includes('software'))) {
      taxDeductibleSpend += amt;
    }

    const w = getWarrantyInfo(doc.warrantyExpirationDate);
    if (w.status === WARRANTY_STATUS.ACTIVE || w.status === WARRANTY_STATUS.EXPIRING_SOON) {
      categoryStats[cat].protected += amt;
    }
  }

  // Group by vendor
  const vendorStats = {};
  for (const doc of documents) {
    const v = doc.vendor || 'Unknown Vendor';
    if (!vendorStats[v]) vendorStats[v] = { total: 0, count: 0, category: doc.category || 'Other' };
    vendorStats[v].total += Number(doc.amount) || 0;
    vendorStats[v].count++;
  }
  const topVendors = Object.entries(vendorStats).sort((a, b) => b[1].total - a[1].total).slice(0, 10);

  // Group by payment method
  const paymentStats = {};
  for (const doc of documents) {
    const p = (doc.paymentMethod || 'Other').split('(')[0].trim();
    if (!paymentStats[p]) paymentStats[p] = { total: 0, count: 0 };
    paymentStats[p].total += Number(doc.amount) || 0;
    paymentStats[p].count++;
  }

  container.innerHTML = `
    <div class="reports-scroll-wrap p-4 flex flex-col gap-4 overflow-y-auto flex-1 max-w-6xl mx-auto w-full">
      
      <!-- Top Action Bar -->
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 class="text-sm font-bold uppercase tracking-wider text-primary">Financial & Warranty Audit Reports</h1>
          <p class="text-xs text-muted">Audited financial summaries, tax breakdowns, and warranty valuations across ${documents.length} records.</p>
        </div>
        <div class="flex items-center gap-2">
          <button class="btn btn-sm btn-secondary" id="btn-print-reports" title="Print Financial Audit">
            ${getIcon('printer', 'icon-xs')} Print Report
          </button>
          <button class="btn btn-sm btn-primary" id="btn-export-csv-report" title="Export CSV Ledger">
            ${getIcon('download', 'icon-xs')} Export Ledger (CSV)
          </button>
        </div>
      </div>

      <!-- Summary Metrics Grid -->
      <div class="grid grid-cols-4 gap-3">
        <div class="card p-3 flex flex-col">
          <span class="text-xs font-semibold text-muted">Total Cumulative Spend</span>
          <span class="font-mono font-bold text-xl text-primary mt-1">$${metrics.totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span class="text-xs text-muted font-sans mt-0.5">Avg $${metrics.avgAmount.toFixed(2)} / receipt</span>
        </div>
        <div class="card p-3 flex flex-col">
          <span class="text-xs font-semibold text-muted">Active Warranty Asset Value</span>
          <span class="font-mono font-bold text-xl text-emerald mt-1">$${metrics.protectedAssetValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span class="text-xs text-muted font-sans mt-0.5">${metrics.coverageRatio}% of total vault value</span>
        </div>
        <div class="card p-3 flex flex-col">
          <span class="text-xs font-semibold text-muted">Tax-Deductible Business Spend</span>
          <span class="font-mono font-bold text-xl text-amber mt-1">$${taxDeductibleSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span class="text-xs text-muted font-sans mt-0.5">Tagged work / business</span>
        </div>
        <div class="card p-3 flex flex-col">
          <span class="text-xs font-semibold text-muted">Total Sales Tax / VAT Logged</span>
          <span class="font-mono font-bold text-xl text-primary mt-1">$${totalTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span class="text-xs text-muted font-sans mt-0.5">Documented receipt tax</span>
        </div>
      </div>

      <!-- Category Breakdown Table -->
      <div class="card p-3 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase text-muted">Spending & Warranty Coverage by Category</span>
          <span class="text-xs text-muted font-mono">${Object.keys(categoryStats).length} Active Categories</span>
        </div>
        <div class="overflow-x-auto">
          <table class="data-grid-table font-sans text-xs w-full">
            <thead>
              <tr>
                <th>Category</th>
                <th class="text-center">Receipts</th>
                <th class="text-right">Total Spend</th>
                <th class="text-right">Share of Total</th>
                <th class="text-right">Sales Tax Logged</th>
                <th class="text-right">Active Warranty Value</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(categoryStats).map(([cat, stat]) => {
                const share = metrics.totalSpend > 0 ? Math.round((stat.total / metrics.totalSpend) * 100) : 0;
                return `
                  <tr>
                    <td><span class="badge badge-secondary font-bold">${escapeHTML(cat)}</span></td>
                    <td class="text-center font-mono">${stat.count}</td>
                    <td class="font-mono font-bold text-right text-primary">$${stat.total.toFixed(2)}</td>
                    <td class="font-mono text-right text-secondary">${share}%</td>
                    <td class="font-mono text-right text-muted">$${stat.tax.toFixed(2)}</td>
                    <td class="font-mono font-bold text-right text-emerald">$${stat.protected.toFixed(2)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Two-Column Grid: Top Merchants & Payment Methods -->
      <div class="grid grid-cols-2 gap-4">
        
        <!-- Top Merchants Leaderboard -->
        <div class="card p-3 flex flex-col gap-2">
          <span class="text-xs font-bold uppercase text-muted">Top Merchants & Vendors Leaderboard</span>
          <div class="overflow-x-auto">
            <table class="data-grid-table font-sans text-xs w-full">
              <thead>
                <tr>
                  <th>Vendor / Merchant</th>
                  <th class="text-center">Count</th>
                  <th class="text-right">Total Spent</th>
                  <th class="text-right">Avg Ticket</th>
                </tr>
              </thead>
              <tbody>
                ${topVendors.map(([vendor, stat]) => `
                  <tr>
                    <td>
                      <div class="flex flex-col">
                        <span class="font-bold text-primary">${escapeHTML(vendor)}</span>
                        <span class="text-xs text-muted">${escapeHTML(stat.category)}</span>
                      </div>
                    </td>
                    <td class="text-center font-mono">${stat.count}</td>
                    <td class="font-mono font-bold text-right text-primary">$${stat.total.toFixed(2)}</td>
                    <td class="font-mono text-right text-muted">$${(stat.total / stat.count).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Payment Methods Distribution -->
        <div class="card p-3 flex flex-col gap-2">
          <span class="text-xs font-bold uppercase text-muted">Payment Methods Distribution</span>
          <div class="overflow-x-auto">
            <table class="data-grid-table font-sans text-xs w-full">
              <thead>
                <tr>
                  <th>Payment Method</th>
                  <th class="text-center">Transactions</th>
                  <th class="text-right">Total Volume</th>
                  <th class="text-right">Share %</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(paymentStats).map(([method, stat]) => {
                  const share = metrics.totalSpend > 0 ? Math.round((stat.total / metrics.totalSpend) * 100) : 0;
                  return `
                    <tr>
                      <td class="font-bold text-primary">${escapeHTML(method)}</td>
                      <td class="text-center font-mono">${stat.count}</td>
                      <td class="font-mono font-bold text-right text-primary">$${stat.total.toFixed(2)}</td>
                      <td class="font-mono text-right text-secondary">${share}%</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  `;

  // Attach CSV Export & Print
  container.querySelector('#btn-export-csv-report')?.addEventListener('click', () => {
    if (onExportCSV) onExportCSV();
  });

  container.querySelector('#btn-print-reports')?.addEventListener('click', () => {
    window.print();
  });
}


/* --- MODULE: js/app.js --- */
/**
 * ReceiptVault - Master Application Orchestrator
 * Integrates Navigation, Document Library, Warranty Engine, Viewer Studio, Dashboard, Reports, and Toast System.
 */










class ReceiptVaultApp {
  constructor() {
    this.documents = [];
    this.selectedDocId = null;
    this.activeTab = 'dashboard'; // 'dashboard', 'library', 'warranties', 'reports'
    this.filters = { search: '', category: '', warranty: '', quickTag: '', sort: 'date_desc' };
    this.recentlyDeleted = null;
    this.isMobileInspectorOpen = false;
  }

  async init() {
    await db.init();
    this.documents = await db.getAllDocuments();

    if (this.documents.length > 0) {
      this.selectedDocId = this.documents[0].id;
    }

    // Sub-components
    const viewerContainer = document.getElementById('document-viewer-container');
    this.viewer = new DocumentViewer(
      viewerContainer,
      (updatedDoc) => this.saveDocument(updatedDoc),
      (docId) => this.deleteDocument(docId),
      () => this.closeInspector()
    );

    const uploadModalContainer = document.getElementById('upload-modal-container');
    this.uploadModal = new UploadModal(
      uploadModalContainer,
      this.documents,
      (newDoc) => this.saveDocument(newDoc, true)
    );

    this.setupNavigation();
    this.setupTopActions();
    this.setupSplitter();
    this.setupKeyboardShortcuts();
    this.updateTabBadges();
    this.renderActiveTab();
    this.updateInspector();
  }

  setupNavigation() {
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setTab(btn.dataset.tab);
      });
    });
  }

  setTab(tabKey) {
    this.activeTab = tabKey;
    document.querySelectorAll('.nav-tab-btn').forEach(b => {
      const isActive = b.dataset.tab === tabKey;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Handle Warranties tab shortcut
    if (tabKey === 'warranties') {
      this.filters.warranty = 'ACTIVE';
      this.filters.quickTag = '';
    } else if (tabKey === 'library') {
      this.filters.warranty = '';
      this.filters.quickTag = '';
    }

    this.renderActiveTab();
  }

  setupTopActions() {
    // New Receipt Button
    document.getElementById('btn-new-receipt')?.addEventListener('click', () => {
      this.openNewReceiptModal();
    });

    // Reset Demo Vault
    document.getElementById('btn-reset-demo-vault')?.addEventListener('click', async () => {
      if (confirm('Reset ReceiptVault to default demonstration receipts and warranties?')) {
        await db.resetDemoData();
        this.documents = await db.getAllDocuments();
        this.selectedDocId = this.documents[0]?.id || null;
        this.updateTabBadges();
        this.renderActiveTab();
        this.updateInspector();
        this.showToast('Demo filing cabinet restored successfully.', 'info');
      }
    });

    // Export Backup JSON
    document.getElementById('btn-export-vault-json')?.addEventListener('click', () => {
      const json = JSON.stringify(this.documents, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const dateStr = new Date().toISOString().split('T')[0];
      a.download = `receiptvault_backup_${dateStr}.json`;
      a.click();
      this.showToast(`Exported backup (${this.documents.length} records)`, 'success');
    });

    // Import Backup JSON
    const importInput = document.getElementById('file-import-vault');
    document.getElementById('btn-import-vault-json')?.addEventListener('click', () => importInput?.click());
    importInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          if (Array.isArray(parsed) && parsed.length > 0) {
            for (const doc of parsed) {
              await db.saveDocument(doc);
            }
            this.documents = await db.getAllDocuments();
            this.selectedDocId = this.documents[0]?.id || null;
            this.updateTabBadges();
            this.renderActiveTab();
            this.updateInspector();
            this.showToast(`Successfully imported ${parsed.length} document records.`, 'success');
          } else {
            this.showToast('Invalid ReceiptVault backup JSON format.', 'error');
          }
        } catch (err) {
          this.showToast('Failed to parse backup JSON: ' + err.message, 'error');
        }
      };
      reader.readAsText(file);
    });
  }

  setupSplitter() {
    const splitter = document.getElementById('library-viewer-splitter');
    const viewerPane = document.getElementById('document-viewer-container');
    if (!splitter || !viewerPane) return;

    let isDragging = false;
    let startX = 0;
    let startW = 0;

    splitter.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startW = viewerPane.offsetWidth;
      document.body.style.cursor = 'col-resize';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = startX - e.clientX;
      const newW = Math.max(300, Math.min(650, startW + dx));
      viewerPane.style.width = `${newW}px`;
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        document.body.style.cursor = '';
      }
    });
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Ctrl+S / Cmd+S: Save current doc
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (this.viewer) this.viewer.collectAndSave();
      }

      // Ctrl+N / Cmd+N: New receipt
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        this.openNewReceiptModal();
      }

      // Escape: Close modals
      if (e.key === 'Escape') {
        if (this.uploadModal) this.uploadModal.close();
        if (window.innerWidth <= 1024) this.closeInspector();
      }
    });
  }

  openNewReceiptModal() {
    this.uploadModal.setExistingDocs(this.documents);
    this.uploadModal.open();
  }

  closeInspector() {
    const rightInspector = document.getElementById('document-viewer-container');
    if (rightInspector) {
      rightInspector.style.display = 'none';
    }
    this.isMobileInspectorOpen = false;
  }

  updateTabBadges() {
    const totalBadge = document.getElementById('badge-total-docs');
    if (totalBadge) {
      totalBadge.textContent = this.documents.length;
    }

    const expiringBadge = document.getElementById('badge-expiring-warranties');
    if (expiringBadge) {
      const expiringCount = this.documents.filter(d => getWarrantyInfo(d.warrantyExpirationDate).status === WARRANTY_STATUS.EXPIRING_SOON).length;
      if (expiringCount > 0) {
        expiringBadge.textContent = `${expiringCount} urgent`;
        expiringBadge.style.display = 'inline-flex';
      } else {
        expiringBadge.style.display = 'none';
      }
    }
  }

  renderActiveTab() {
    const mainContainer = document.getElementById('main-workspace-view');
    const rightInspector = document.getElementById('document-viewer-container');
    const splitter = document.getElementById('library-viewer-splitter');

    if (this.activeTab === 'dashboard') {
      if (rightInspector) rightInspector.style.display = 'none';
      if (splitter) splitter.style.display = 'none';

      renderDashboard(mainContainer, {
        documents: this.documents,
        onSelectDoc: (id) => {
          this.selectedDocId = id;
          this.setTab('library');
        },
        onNavigateTab: (tab) => this.setTab(tab),
        onNewReceipt: () => this.openNewReceiptModal()
      });
    } else if (this.activeTab === 'reports') {
      if (rightInspector) rightInspector.style.display = 'none';
      if (splitter) splitter.style.display = 'none';

      renderReports(mainContainer, {
        documents: this.documents,
        onExportCSV: () => this.exportCSV()
      });
    } else {
      // 'library' or 'warranties'
      const isMobile = window.innerWidth <= 1024;
      if (rightInspector) {
        rightInspector.style.display = isMobile ? (this.isMobileInspectorOpen ? 'flex' : 'none') : 'flex';
      }
      if (splitter) splitter.style.display = isMobile ? 'none' : 'block';

      renderDocumentLibrary(mainContainer, {
        documents: this.documents,
        selectedDocId: this.selectedDocId,
        filters: this.filters,
        onSelectDoc: (id) => {
          this.selectedDocId = id;
          if (isMobile) {
            this.isMobileInspectorOpen = true;
            if (rightInspector) rightInspector.style.display = 'flex';
          }
          this.renderActiveTab();
          this.updateInspector();
        },
        onFilterChange: (newFilters) => {
          this.filters = newFilters;
          this.renderActiveTab();
        }
      });
    }
  }

  updateInspector() {
    const doc = this.documents.find(d => d.id === this.selectedDocId) || this.documents[0] || null;
    this.viewer.setDocument(doc);
  }

  async saveDocument(doc, isNew = false) {
    const saved = await db.saveDocument(doc);
    this.documents = await db.getAllDocuments();
    this.selectedDocId = saved ? saved.id : doc.id;
    this.updateTabBadges();
    this.renderActiveTab();
    this.updateInspector();
    this.showToast(isNew ? `Added receipt "${doc.title}"` : `Saved changes to "${doc.title}"`, 'success');
  }

  async deleteDocument(id) {
    const deletedDoc = this.documents.find(d => d.id === id);
    this.recentlyDeleted = deletedDoc;

    await db.deleteDocument(id);
    this.documents = await db.getAllDocuments();
    this.selectedDocId = this.documents[0]?.id || null;
    this.updateTabBadges();
    this.renderActiveTab();
    this.updateInspector();

    this.showToast(`Deleted receipt record.`, 'warning', 6000, {
      label: 'Undo',
      onClick: async () => {
        if (this.recentlyDeleted) {
          await db.saveDocument(this.recentlyDeleted);
          this.documents = await db.getAllDocuments();
          this.selectedDocId = this.recentlyDeleted.id;
          this.updateTabBadges();
          this.renderActiveTab();
          this.updateInspector();
          this.showToast(`Restored "${this.recentlyDeleted.title}"`, 'success');
          this.recentlyDeleted = null;
        }
      }
    });
  }

  exportCSV() {
    const headers = [
      'Document ID',
      'Title',
      'Merchant/Vendor',
      'Invoice/Order #',
      'Serial/License #',
      'Amount',
      'Tax Amount',
      'Currency',
      'Purchase Date',
      'Category',
      'Payment Method',
      'Warranty Policy',
      'Warranty Expiration',
      'Return Deadline',
      'Tags',
      'Notes'
    ];

    const rows = this.documents.map(d => [
      `"${d.id}"`,
      `"${(d.title || '').replace(/"/g, '""')}"`,
      `"${(d.vendor || '').replace(/"/g, '""')}"`,
      `"${(d.invoiceNumber || '').replace(/"/g, '""')}"`,
      `"${(d.serialNumber || '').replace(/"/g, '""')}"`,
      Number(d.amount || 0).toFixed(2),
      Number(d.taxAmount || 0).toFixed(2),
      `"${d.currency || '$'}"`,
      `"${d.purchaseDate || ''}"`,
      `"${d.category || ''}"`,
      `"${d.paymentMethod || ''}"`,
      `"${(d.warrantyType || '').replace(/"/g, '""')}"`,
      `"${d.warrantyExpirationDate || ''}"`,
      `"${d.returnDeadlineDate || ''}"`,
      `"${(d.tags || []).join('; ')}"`,
      `"${(d.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    a.download = `receiptvault_ledger_${dateStr}.csv`;
    a.click();
    this.showToast(`Exported CSV ledger (${this.documents.length} records)`, 'success');
  }

  showToast(message, type = 'info', duration = 3500, action = null) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconName = 'info';
    if (type === 'success') iconName = 'check';
    if (type === 'warning') iconName = 'alertTriangle';
    if (type === 'error') iconName = 'close';

    toast.innerHTML = `
      <div class="flex items-center gap-2">
        ${getIcon(iconName, `icon-xs ${type === 'success' ? 'text-emerald' : (type === 'warning' ? 'text-amber' : (type === 'error' ? 'text-rose' : 'text-primary'))}`)}
        <span class="text-xs font-semibold text-primary">${escapeHTML(message)}</span>
      </div>
      <div class="flex items-center gap-2">
        ${action ? `<button class="btn btn-xs btn-primary font-bold toast-action-btn">${escapeHTML(action.label)}</button>` : ''}
        <button class="btn-icon-xs text-muted toast-close-btn" aria-label="Dismiss toast">${getIcon('close', 'icon-xs')}</button>
      </div>
    `;

    if (action) {
      toast.querySelector('.toast-action-btn')?.addEventListener('click', () => {
        action.onClick();
        toast.remove();
      });
    }

    toast.querySelector('.toast-close-btn')?.addEventListener('click', () => {
      toast.remove();
    });

    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.2s ease';
        setTimeout(() => toast.remove(), 200);
      }
    }, duration);
  }
}

// Bootstrap
function startReceiptVault() {
  const app = new ReceiptVaultApp();
  window.receiptVaultApp = app;
  app.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startReceiptVault);
} else {
  startReceiptVault();
}


})();
