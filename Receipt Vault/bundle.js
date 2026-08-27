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
  alertTriangle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`
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
 * Calculates remaining durations, expiration status tags, and protected asset valuations.
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

function getWarrantyInfo(warrantyExpirationDate, referenceDate = new Date()) {
  if (!warrantyExpirationDate) {
    return { status: WARRANTY_STATUS.NONE, daysRemaining: null, label: 'No Warranty' };
  }

  const exp = new Date(warrantyExpirationDate);
  if (isNaN(exp.getTime())) {
    return { status: WARRANTY_STATUS.NONE, daysRemaining: null, label: 'Invalid Date' };
  }

  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);
  exp.setHours(0, 0, 0, 0);

  const diffMs = exp.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return {
      status: WARRANTY_STATUS.EXPIRED,
      daysRemaining,
      label: `Expired (${Math.abs(daysRemaining)}d ago)`,
      color: 'muted'
    };
  }

  if (daysRemaining <= 30) {
    return {
      status: WARRANTY_STATUS.EXPIRING_SOON,
      daysRemaining,
      label: `Expiring Soon (${daysRemaining}d)`,
      color: 'amber'
    };
  }

  return {
    status: WARRANTY_STATUS.ACTIVE,
    daysRemaining,
    label: `Active (${daysRemaining}d left)`,
    color: 'emerald'
  };
}

function getReturnInfo(returnDeadlineDate, referenceDate = new Date()) {
  if (!returnDeadlineDate) {
    return { status: RETURN_STATUS.NONE, daysRemaining: null, label: 'No Return Deadline' };
  }

  const deadline = new Date(returnDeadlineDate);
  if (isNaN(deadline.getTime())) {
    return { status: RETURN_STATUS.NONE, daysRemaining: null, label: 'Invalid Date' };
  }

  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);

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

  if (daysRemaining <= 5) {
    return {
      status: RETURN_STATUS.CLOSING_SOON,
      daysRemaining,
      label: `Closing Soon (${daysRemaining}d)`,
      color: 'amber'
    };
  }

  return {
    status: RETURN_STATUS.OPEN,
    daysRemaining,
    label: `Return Open (${daysRemaining}d)`,
    color: 'primary'
  };
}

function calculateVaultMetrics(documents = [], referenceDate = new Date()) {
  let totalSpend = 0;
  let protectedAssetValue = 0;
  let activeWarrantiesCount = 0;
  let expiringSoonWarrantiesCount = 0;
  let openReturnsCount = 0;

  for (const doc of documents) {
    const amt = Number(doc.amount) || 0;
    totalSpend += amt;

    const wInfo = getWarrantyInfo(doc.warrantyExpirationDate, referenceDate);
    if (wInfo.status === WARRANTY_STATUS.ACTIVE || wInfo.status === WARRANTY_STATUS.EXPIRING_SOON) {
      protectedAssetValue += amt;
      activeWarrantiesCount++;
      if (wInfo.status === WARRANTY_STATUS.EXPIRING_SOON) {
        expiringSoonWarrantiesCount++;
      }
    }

    const rInfo = getReturnInfo(doc.returnDeadlineDate, referenceDate);
    if (rInfo.status === RETURN_STATUS.OPEN || rInfo.status === RETURN_STATUS.CLOSING_SOON) {
      openReturnsCount++;
    }
  }

  return {
    totalSpend,
    protectedAssetValue,
    activeWarrantiesCount,
    expiringSoonWarrantiesCount,
    openReturnsCount,
    totalDocuments: documents.length
  };
}


/* --- MODULE: js/engine/sample-data.js --- */
/**
 * ReceiptVault - Pre-Loaded Demonstration Receipts & Simulated Document Artwork
 * Generates rich realistic sample receipts, warranties, return deadlines, and vector receipt preview images.
 */

const SAMPLE_DOCUMENTS = [
  {
    id: 'doc_apple_macbook',
    title: 'MacBook Pro 16" M3 Max (36GB/1TB)',
    vendor: 'Apple Store Fifth Avenue',
    amount: 3499.00,
    currency: '$',
    purchaseDate: '2023-11-20',
    category: 'Electronics',
    paymentMethod: 'Credit Card',
    warrantyExpirationDate: '2026-11-20', // Active (3-year AppleCare+)
    returnDeadlineDate: '2023-12-04',
    notes: 'Order #W89123049. Includes 3 years AppleCare+ Protection Plan and MagSafe 3 Cable.',
    tags: ['work', 'laptop', 'applecare', 'hardware'],
    fileName: 'Apple_Receipt_W89123049.png'
  },
  {
    id: 'doc_sony_headphones',
    title: 'Sony WH-1000XM5 Wireless Headphones',
    vendor: 'Best Buy',
    amount: 398.00,
    currency: '$',
    purchaseDate: '2024-01-10',
    category: 'Electronics',
    paymentMethod: 'Credit Card',
    warrantyExpirationDate: getRelativeDateStr(25), // Expiring Soon! (25 days left)
    returnDeadlineDate: '2024-01-25',
    notes: 'Best Buy Protection Plan serial #SN-8829103. Silver finish.',
    tags: ['audio', 'noise-canceling', 'travel'],
    fileName: 'BestBuy_Sony_XM5.png'
  },
  {
    id: 'doc_herman_miller',
    title: 'Herman Miller Embody Chair (Cyan Rhythm)',
    vendor: 'Herman Miller Direct',
    amount: 1795.00,
    currency: '$',
    purchaseDate: '2022-05-15',
    category: 'Home',
    paymentMethod: 'Bank Transfer',
    warrantyExpirationDate: '2034-05-15', // 12-Year Warranty
    returnDeadlineDate: '2022-06-15',
    notes: '12-Year 24/7 use warranty included. Fully adjustable arms, graphite frame.',
    tags: ['office', 'ergonomics', 'furniture'],
    fileName: 'HermanMiller_Embody_Invoice.png'
  },
  {
    id: 'doc_dyson_v15',
    title: 'Dyson V15 Detect Absolute Vacuum',
    vendor: 'Dyson Direct',
    amount: 749.99,
    currency: '$',
    purchaseDate: '2023-08-14',
    category: 'Home',
    paymentMethod: 'Credit Card',
    warrantyExpirationDate: '2025-08-14',
    returnDeadlineDate: '2023-09-14',
    notes: 'Laser Slim Fluffy cleaner head + Digital Motorbar. 2-Year Manufacturer Warranty.',
    tags: ['appliances', 'cleaning', 'home'],
    fileName: 'Dyson_Receipt_88192.png'
  },
  {
    id: 'doc_patagonia_jacket',
    title: 'Patagonia Down Sweater Hoody (Black/Medium)',
    vendor: 'Patagonia Soho',
    amount: 329.00,
    currency: '$',
    purchaseDate: '2023-12-02',
    category: 'Clothing',
    paymentMethod: 'Credit Card',
    warrantyExpirationDate: '2035-12-31', // Ironclad Lifetime Guarantee
    returnDeadlineDate: '2024-01-02',
    notes: 'Covered under Patagonia Ironclad Guarantee for repair and replacement.',
    tags: ['outdoors', 'winter', 'lifetime-warranty'],
    fileName: 'Patagonia_Receipt.png'
  },
  {
    id: 'doc_jetbrains_all_pack',
    title: 'JetBrains All Products Pack (1-Year Commercial)',
    vendor: 'JetBrains s.r.o.',
    amount: 289.00,
    currency: '$',
    purchaseDate: '2024-02-01',
    category: 'Software',
    paymentMethod: 'PayPal',
    warrantyExpirationDate: '2025-02-01',
    returnDeadlineDate: '2024-02-15',
    notes: 'License Key #JB-99201-APP. Perpetual fallback license active.',
    tags: ['software', 'ide', 'development'],
    fileName: 'JetBrains_Tax_Invoice.png'
  },
  {
    id: 'doc_figma_annual',
    title: 'Figma Professional Annual Subscription',
    vendor: 'Figma Inc.',
    amount: 144.00,
    currency: '$',
    purchaseDate: '2024-03-01',
    category: 'Subscriptions',
    paymentMethod: 'Credit Card',
    warrantyExpirationDate: '2025-03-01',
    returnDeadlineDate: null,
    notes: 'Annual billing for 1 editor seat. Workspace: DesignLabs.',
    tags: ['subscriptions', 'ui-design', 'saas'],
    fileName: 'Figma_Invoice_INV2024.png'
  },
  {
    id: 'doc_delta_flight',
    title: 'Delta Air Lines Flight DL482 (JFK -> SFO)',
    vendor: 'Delta Air Lines',
    amount: 485.60,
    currency: '$',
    purchaseDate: '2024-04-12',
    category: 'Travel',
    paymentMethod: 'Credit Card',
    warrantyExpirationDate: null,
    returnDeadlineDate: '2024-04-13', // 24-hour cancellation rule
    notes: 'Confirmation #H88K2P. Main Cabin seat 14A. Includes travel insurance policy.',
    tags: ['flights', 'travel', 'vacation'],
    fileName: 'Delta_eTicket_Receipt.png'
  },
  {
    id: 'doc_whole_foods',
    title: 'Whole Foods Market Organic Groceries',
    vendor: 'Whole Foods Market',
    amount: 142.75,
    currency: '$',
    purchaseDate: getRelativeDateStr(-3), // 3 days ago
    category: 'Groceries',
    paymentMethod: 'Debit Card',
    warrantyExpirationDate: null,
    returnDeadlineDate: getRelativeDateStr(11), // 11 days remaining on return window!
    notes: 'Store #10429. Produce, organic pantry items, and artisan coffee.',
    tags: ['groceries', 'food', 'household'],
    fileName: 'WholeFoods_Register_Slip.png'
  },
  {
    id: 'doc_nike_shoes',
    title: 'Nike Air Zoom Pegasus 40 Running Shoes',
    vendor: 'Nike Flagship Store',
    amount: 130.00,
    currency: '$',
    purchaseDate: getRelativeDateStr(-2), // 2 days ago
    category: 'Clothing',
    paymentMethod: 'Credit Card',
    warrantyExpirationDate: '2026-08-01', // 2-year footwear warranty
    returnDeadlineDate: getRelativeDateStr(28), // 28 days left in return window
    notes: 'Size US 10.5. 60-day Nike Member return trial included.',
    tags: ['sports', 'running', 'footwear'],
    fileName: 'Nike_Receipt_9921.png'
  }
];

function getRelativeDateStr(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
}

/**
 * Procedural Vector Receipt Canvas Generator
 * Draws high-resolution simulated thermal receipts and modern tax invoices for immediate visual inspection.
 */
function generateReceiptCanvas(doc, width = 420, height = 580) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Paper Background with subtle texture
  ctx.fillStyle = '#fbfbfa';
  ctx.fillRect(0, 0, width, height);

  // Jagged Receipt Tear on bottom
  ctx.fillStyle = '#121620';
  ctx.beginPath();
  ctx.moveTo(0, height - 8);
  for (let x = 0; x < width; x += 12) {
    ctx.lineTo(x + 6, height - 16);
    ctx.lineTo(x + 12, height - 8);
  }
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.fill();

  // Draw Header
  ctx.fillStyle = '#111827';
  ctx.font = "bold 16px 'Courier New', monospace";
  ctx.textAlign = 'center';
  ctx.fillText(doc.vendor.toUpperCase(), width / 2, 45);

  ctx.font = "11px 'Courier New', monospace";
  ctx.fillStyle = '#4b5563';
  ctx.fillText('OFFICIAL PURCHASE RECEIPT', width / 2, 65);
  ctx.fillText(`DATE: ${doc.purchaseDate}  |  CURRENCY: ${doc.currency}`, width / 2, 82);

  // Separator Line
  ctx.strokeStyle = '#9ca3af';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.moveTo(30, 100); ctx.lineTo(width - 30, 100);
  ctx.stroke();
  ctx.setLineDash([]);

  // Itemized Description
  ctx.textAlign = 'left';
  ctx.fillStyle = '#111827';
  ctx.font = "bold 13px 'Courier New', monospace";
  ctx.fillText(doc.title.slice(0, 32), 30, 130);
  if (doc.title.length > 32) {
    ctx.fillText(doc.title.slice(32, 64), 30, 148);
  }

  ctx.textAlign = 'right';
  ctx.fillText(`${doc.currency}${doc.amount.toFixed(2)}`, width - 30, 130);

  // Details
  ctx.textAlign = 'left';
  ctx.font = "11px 'Courier New', monospace";
  ctx.fillStyle = '#4b5563';
  ctx.fillText(`CATEGORY: ${doc.category.toUpperCase()}`, 30, 185);
  ctx.fillText(`PAYMENT: ${doc.paymentMethod.toUpperCase()}`, 30, 205);
  if (doc.warrantyExpirationDate) {
    ctx.fillText(`WARRANTY EXP: ${doc.warrantyExpirationDate}`, 30, 225);
  }
  if (doc.returnDeadlineDate) {
    ctx.fillText(`RETURN DEADLINE: ${doc.returnDeadlineDate}`, 30, 245);
  }

  // Separator
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.moveTo(30, 270); ctx.lineTo(width - 30, 270);
  ctx.stroke();
  ctx.setLineDash([]);

  // Total Summary
  ctx.font = "bold 16px 'Courier New', monospace";
  ctx.fillStyle = '#111827';
  ctx.fillText('TOTAL AMOUNT PAID', 30, 305);
  ctx.textAlign = 'right';
  ctx.fillText(`${doc.currency}${doc.amount.toFixed(2)}`, width - 30, 305);

  // Notes
  if (doc.notes) {
    ctx.textAlign = 'left';
    ctx.font = "italic 11px 'Courier New', monospace";
    ctx.fillStyle = '#6b7280';
    ctx.fillText('NOTES / METADATA:', 30, 350);
    const words = doc.notes.split(' ');
    let line = '';
    let y = 370;
    for (const w of words) {
      if ((line + w).length > 40) {
        ctx.fillText(line, 30, y);
        line = w + ' ';
        y += 18;
      } else {
        line += w + ' ';
      }
    }
    ctx.fillText(line, 30, y);
  }

  // Barcode representation
  ctx.fillStyle = '#1f2937';
  for (let x = 60; x < width - 60; x += Math.floor(Math.random() * 4) + 2) {
    ctx.fillRect(x, height - 70, Math.random() > 0.5 ? 2 : 3, 35);
  }

  ctx.textAlign = 'center';
  ctx.font = "10px 'Courier New', monospace";
  ctx.fillStyle = '#6b7280';
  ctx.fillText(`RECEIPT-ID: ${doc.id.toUpperCase()}`, width / 2, height - 25);

  return canvas;
}


/* --- MODULE: js/engine/duplicate.js --- */
/**
 * ReceiptVault - Duplicate Detection Engine
 * Detects potential duplicate receipts matching vendor, amount, and purchase date.
 */

function findPotentialDuplicate(candidate, existingDocs = [], ignoreId = null) {
  if (!candidate || !candidate.vendor || !candidate.amount || !candidate.purchaseDate) {
    return null;
  }

  const candVendor = String(candidate.vendor).trim().toLowerCase();
  const candAmt = Math.round(Number(candidate.amount) * 100) / 100;
  const candDate = new Date(candidate.purchaseDate).getTime();

  for (const doc of existingDocs) {
    if (ignoreId && doc.id === ignoreId) continue;

    const docVendor = String(doc.vendor || '').trim().toLowerCase();
    const docAmt = Math.round(Number(doc.amount || 0) * 100) / 100;
    const docDate = new Date(doc.purchaseDate).getTime();

    // Check vendor similarity
    const vendorMatches = candVendor === docVendor || candVendor.includes(docVendor) || docVendor.includes(candVendor);

    // Check amount match (exact or within 0.01)
    const amountMatches = Math.abs(candAmt - docAmt) < 0.02;

    // Check date within 2 days (172800000 ms)
    const dateDiffMs = Math.abs(candDate - docDate);
    const dateMatches = dateDiffMs <= 2 * 24 * 60 * 60 * 1000;

    if (vendorMatches && amountMatches && dateMatches) {
      return {
        isDuplicate: true,
        conflictingDoc: doc,
        reason: `Matches existing record from "${doc.vendor}" ($${docAmt}) on ${doc.purchaseDate}`
      };
    }
  }

  return null;
}


/* --- MODULE: js/engine/charts.js --- */
/**
 * ReceiptVault - Canvas 2D Financial & Warranty Charting Engine
 * Pure client-side charting for Category Donut Breakdown, Monthly Spending Bars, and Vendor Ranks.
 */

const CATEGORY_COLORS = {
  Electronics: '#58a6ff',
  Home: '#3fb950',
  Clothing: '#d29922',
  Software: '#bc8cff',
  Subscriptions: '#f778ba',
  Travel: '#79c0ff',
  Groceries: '#56d364',
  Other: '#8b949e'
};

function renderCategoryDonut(canvas, documents = []) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

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
    ctx.fillStyle = '#8b949e';
    ctx.font = "12px 'Inter', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText('No spending data to display', w / 2, h / 2);
    return;
  }

  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const centerX = w / 2;
  const centerY = h / 2 - 15;
  const radius = Math.min(centerX, centerY) - 20;
  const innerRadius = radius * 0.58;

  let currentAngle = -Math.PI / 2;

  // Draw donut slices
  entries.forEach(([cat, amt]) => {
    const sliceAngle = (amt / totalSpend) * (Math.PI * 2);
    const color = CATEGORY_COLORS[cat] || '#8b949e';

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
    ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
    ctx.closePath();
    ctx.fill();

    currentAngle += sliceAngle;
  });

  // Center Text (Total Amount)
  ctx.fillStyle = '#f0f6fc';
  ctx.font = "bold 16px 'JetBrains Mono', monospace";
  ctx.textAlign = 'center';
  ctx.fillText(`$${totalSpend.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, centerX, centerY + 2);
  ctx.fillStyle = '#8b949e';
  ctx.font = "10px 'Inter', sans-serif";
  ctx.fillText('TOTAL SPEND', centerX, centerY + 16);
}

function renderMonthlyBarChart(canvas, documents = []) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // Group by YYYY-MM
  const monthTotals = {};
  for (const doc of documents) {
    if (!doc.purchaseDate) continue;
    const key = doc.purchaseDate.slice(0, 7); // '2024-01'
    monthTotals[key] = (monthTotals[key] || 0) + (Number(doc.amount) || 0);
  }

  const months = Object.keys(monthTotals).sort().slice(-6); // Last 6 months
  if (months.length === 0) {
    ctx.fillStyle = '#8b949e';
    ctx.font = "12px 'Inter', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText('No monthly transaction history', w / 2, h / 2);
    return;
  }

  const maxVal = Math.max(...months.map(m => monthTotals[m]), 100);
  const paddingX = 40;
  const paddingY = 30;
  const chartW = w - paddingX * 2;
  const chartH = h - paddingY * 2;

  const barWidth = Math.min(36, chartW / months.length - 12);
  const gap = chartW / months.length;

  months.forEach((m, idx) => {
    const val = monthTotals[m];
    const barH = (val / maxVal) * chartH;
    const x = paddingX + idx * gap + (gap - barWidth) / 2;
    const y = h - paddingY - barH;

    // Draw Bar
    ctx.fillStyle = '#58a6ff';
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
    ctx.fill();

    // Value Label above bar
    ctx.fillStyle = '#c9d1d9';
    ctx.font = "bold 10px 'JetBrains Mono', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(`$${Math.round(val)}`, x + barWidth / 2, y - 6);

    // Month Label below bar
    ctx.fillStyle = '#8b949e';
    ctx.font = "10px 'Inter', sans-serif";
    const monthShort = new Date(m + '-01').toLocaleString('en-US', { month: 'short' });
    ctx.fillText(monthShort, x + barWidth / 2, h - 10);
  });
}


/* --- MODULE: js/core/db.js --- */
/**
 * ReceiptVault - IndexedDB Storage Engine
 * Offline persistence for document metadata, receipt images, tags, and settings.
 */



const DB_NAME = 'ReceiptVault_DB';
const DB_VERSION = 1;

class ReceiptVaultDB {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve) => {
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
        // Check if database is empty, if so populate with demo receipts
        const docs = await this.getAllDocuments();
        if (docs.length === 0) {
          for (const doc of SAMPLE_DOCUMENTS) {
            await this.saveDocument(doc);
          }
        }
        resolve(this.db);
      };

      req.onerror = () => {
        console.warn('IndexedDB unavailable, falling back to localStorage');
        resolve(null);
      };
    });
  }

  async getAllDocuments() {
    if (!this.db) {
      const str = localStorage.getItem('receiptvault_docs');
      return str ? JSON.parse(str) : [...SAMPLE_DOCUMENTS];
    }
    return new Promise((resolve) => {
      const tx = this.db.transaction('documents', 'readonly');
      const store = tx.objectStore('documents');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }

  async saveDocument(doc) {
    if (!this.db) {
      const all = await this.getAllDocuments();
      const idx = all.findIndex(d => d.id === doc.id);
      if (idx >= 0) all[idx] = doc;
      else all.unshift(doc);
      localStorage.setItem('receiptvault_docs', JSON.stringify(all));
      return;
    }
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('documents', 'readwrite');
      const store = tx.objectStore('documents');
      store.put(doc);
      tx.oncomplete = () => resolve(doc);
      tx.onerror = () => reject(tx.error);
    });
  }

  async deleteDocument(id) {
    if (!this.db) {
      let all = await this.getAllDocuments();
      all = all.filter(d => d.id !== id);
      localStorage.setItem('receiptvault_docs', JSON.stringify(all));
      return;
    }
    return new Promise((resolve) => {
      const tx = this.db.transaction('documents', 'readwrite');
      const store = tx.objectStore('documents');
      store.delete(id);
      tx.oncomplete = () => resolve();
    });
  }

  async resetDemoData() {
    if (!this.db) {
      localStorage.setItem('receiptvault_docs', JSON.stringify(SAMPLE_DOCUMENTS));
      return;
    }
    const tx = this.db.transaction('documents', 'readwrite');
    const store = tx.objectStore('documents');
    store.clear();
    for (const doc of SAMPLE_DOCUMENTS) {
      store.put(doc);
    }
    return new Promise(resolve => {
      tx.oncomplete = () => resolve();
    });
  }
}

const db = new ReceiptVaultDB();


/* --- MODULE: js/editor/document-viewer.js --- */
/**
 * ReceiptVault - Document Inspection & Image Preview Component
 * Interactive pan/zoom/rotate receipt image canvas, warranty countdowns, and metadata editor.
 */





class DocumentViewer {
  constructor(container, onSaveDoc, onDeleteDoc) {
    this.container = container;
    this.onSaveDoc = onSaveDoc;
    this.onDeleteDoc = onDeleteDoc;
    this.currentDoc = null;

    // Viewport transform state
    this.zoom = 1;
    this.rotation = 0; // 0, 90, 180, 270
    this.pan = { x: 0, y: 0 };
    this.isPanning = false;
    this.panStart = { x: 0, y: 0 };
    this.imageSource = null;
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
  }

  render() {
    if (!this.currentDoc) {
      this.container.innerHTML = `
        <div class="empty-viewer-state flex flex-col items-center justify-center p-8 text-center text-muted h-full">
          <div class="mb-3 text-muted" style="opacity: 0.5;">
            ${getIcon('receipt', 'icon-lg')}
          </div>
          <span class="font-bold text-sm text-secondary">No Document Selected</span>
          <p class="text-xs text-muted mt-1 max-w-xs">Select a receipt from the library to inspect image details, warranty status, and purchase metadata.</p>
        </div>
      `;
      return;
    }

    const doc = this.currentDoc;
    const wInfo = getWarrantyInfo(doc.warrantyExpirationDate);
    const rInfo = getReturnInfo(doc.returnDeadlineDate);

    this.container.innerHTML = `
      <!-- Top Inspector Header -->
      <div class="viewer-header-bar flex items-center justify-between px-3 py-2 border-b">
        <div class="flex items-center gap-2 truncate">
          ${getIcon('receipt', 'icon-sm text-primary')}
          <span class="font-bold text-xs truncate">${escapeHTML(doc.title)}</span>
        </div>
        <div class="flex items-center gap-1">
          <button class="btn btn-xs btn-secondary" id="btn-viewer-save" title="Save Metadata Changes">
            ${getIcon('check', 'icon-xs')} Save
          </button>
          <button class="btn btn-xs text-rose btn-secondary" id="btn-viewer-delete" title="Delete Document">
            ${getIcon('trash', 'icon-xs')}
          </button>
        </div>
      </div>

      <!-- Scrollable Inspector Content (Top: Canvas Preview, Bottom: Metadata Form) -->
      <div class="viewer-body-scroll flex-1 overflow-y-auto flex flex-col">
        
        <!-- Image Canvas Viewport & Controls -->
        <div class="receipt-canvas-viewport-wrap relative">
          <!-- Canvas -->
          <canvas id="receipt-preview-canvas" class="receipt-preview-canvas"></canvas>

          <!-- Floating Image Controls Overlay -->
          <div class="viewer-floating-controls absolute flex items-center gap-1 p-1 rounded">
            <button class="btn-icon-xs" id="btn-zoom-out" title="Zoom Out">${getIcon('zoomOut', 'icon-xs')}</button>
            <span class="font-mono text-xs text-muted w-10 text-center" id="viewer-zoom-label">${Math.round(this.zoom * 100)}%</span>
            <button class="btn-icon-xs" id="btn-zoom-in" title="Zoom In">${getIcon('zoomIn', 'icon-xs')}</button>
            <button class="btn-icon-xs" id="btn-rotate" title="Rotate 90°">${getIcon('rotate', 'icon-xs')}</button>
            <button class="btn-icon-xs" id="btn-fit-reset" title="Fit to Viewport">${getIcon('eye', 'icon-xs')}</button>
          </div>
        </div>

        <!-- Status Badges Bar -->
        <div class="p-3 border-b flex flex-wrap gap-2 items-center bg-elevated">
          <!-- Warranty Badge -->
          ${doc.warrantyExpirationDate ? `
            <div class="badge ${wInfo.status === WARRANTY_STATUS.ACTIVE ? 'badge-success' : (wInfo.status === WARRANTY_STATUS.EXPIRING_SOON ? 'badge-warning' : 'badge-secondary')} flex items-center gap-1">
              ${getIcon('shield', 'icon-xs')}
              <span>Warranty: ${escapeHTML(wInfo.label)}</span>
            </div>
          ` : `
            <div class="badge badge-secondary text-muted">No Warranty</div>
          `}

          <!-- Return Deadline Badge -->
          ${doc.returnDeadlineDate ? `
            <div class="badge ${rInfo.status === RETURN_STATUS.OPEN ? 'badge-primary' : (rInfo.status === RETURN_STATUS.CLOSING_SOON ? 'badge-warning' : 'badge-secondary')} flex items-center gap-1">
              ${getIcon('clock', 'icon-xs')}
              <span>Return: ${escapeHTML(rInfo.label)}</span>
            </div>
          ` : ''}
        </div>

        <!-- Editable Metadata Form -->
        <div class="p-3 flex flex-col gap-3">
          <!-- Title & Vendor -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Document Title</label>
            <input type="text" id="edit-doc-title" class="form-control form-control-sm font-semibold" value="${escapeHTML(doc.title)}" />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Vendor / Merchant</label>
              <input type="text" id="edit-doc-vendor" class="form-control form-control-sm" value="${escapeHTML(doc.vendor)}" />
            </div>
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Amount (${doc.currency || '$'})</label>
              <input type="number" step="0.01" id="edit-doc-amount" class="form-control form-control-sm font-mono font-bold" value="${doc.amount}" />
            </div>
          </div>

          <!-- Purchase Date & Category -->
          <div class="grid grid-cols-2 gap-2">
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Purchase Date</label>
              <input type="date" id="edit-doc-date" class="form-control form-control-sm font-mono" value="${doc.purchaseDate || ''}" />
            </div>
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Category</label>
              <select id="edit-doc-category" class="form-control form-control-sm">
                ${['Electronics', 'Home', 'Clothing', 'Groceries', 'Software', 'Subscriptions', 'Travel', 'Other'].map(c => `
                  <option value="${c}" ${doc.category === c ? 'selected' : ''}>${c}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Payment Method</label>
            <select id="edit-doc-payment" class="form-control form-control-sm">
              ${['Credit Card', 'Debit Card', 'Cash', 'PayPal', 'Bank Transfer', 'Other'].map(p => `
                <option value="${p}" ${doc.paymentMethod === p ? 'selected' : ''}>${p}</option>
              `).join('')}
            </select>
          </div>

          <!-- Warranty Expiration & Return Deadline -->
          <div class="grid grid-cols-2 gap-2">
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Warranty Expiry Date</label>
              <input type="date" id="edit-doc-warranty" class="form-control form-control-sm font-mono" value="${doc.warrantyExpirationDate || ''}" />
            </div>
            <div class="form-group">
              <label class="form-label text-xs font-semibold text-muted">Return Deadline</label>
              <input type="date" id="edit-doc-return" class="form-control form-control-sm font-mono" value="${doc.returnDeadlineDate || ''}" />
            </div>
          </div>

          <!-- Notes -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Notes / Warranty Details</label>
            <textarea id="edit-doc-notes" class="form-control form-control-sm" rows="3" placeholder="Add serial numbers, warranty terms, or order IDs...">${escapeHTML(doc.notes || '')}</textarea>
          </div>

          <!-- Tags -->
          <div class="form-group">
            <label class="form-label text-xs font-semibold text-muted">Tags (Comma-separated)</label>
            <input type="text" id="edit-doc-tags" class="form-control form-control-sm font-mono" value="${escapeHTML((doc.tags || []).join(', '))}" placeholder="e.g. work, hardware, applecare" />
          </div>
        </div>

      </div>
    `;

    this.initCanvasAndEvents();
  }

  initCanvasAndEvents() {
    const canvas = this.container.querySelector('#receipt-preview-canvas');
    if (!canvas) return;

    // Render receipt into canvas
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
      this.zoom = Math.min(3, this.zoom * 1.25);
      this.updateZoomLabel();
      this.drawCanvas(canvas);
    });

    this.container.querySelector('#btn-zoom-out')?.addEventListener('click', () => {
      this.zoom = Math.max(0.4, this.zoom * 0.8);
      this.updateZoomLabel();
      this.drawCanvas(canvas);
    });

    this.container.querySelector('#btn-rotate')?.addEventListener('click', () => {
      this.rotation = (this.rotation + 90) % 360;
      this.drawCanvas(canvas);
    });

    this.container.querySelector('#btn-fit-reset')?.addEventListener('click', () => {
      this.resetTransform();
      this.updateZoomLabel();
      this.drawCanvas(canvas);
    });

    // Save & Delete buttons
    this.container.querySelector('#btn-viewer-save')?.addEventListener('click', () => {
      this.collectAndSave();
    });

    this.container.querySelector('#btn-viewer-delete')?.addEventListener('click', () => {
      if (confirm(`Delete receipt "${this.currentDoc.title}"?`)) {
        if (this.onDeleteDoc) this.onDeleteDoc(this.currentDoc.id);
      }
    });
  }

  drawCanvas(canvas) {
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth || 320;
    canvas.height = 240;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2 + this.pan.x, canvas.height / 2 + this.pan.y);
    ctx.scale(this.zoom, this.zoom);
    ctx.rotate((this.rotation * Math.PI) / 180);

    // Render simulated or user-provided receipt image
    const receiptImgCanvas = generateReceiptCanvas(this.currentDoc, 280, 380);
    ctx.drawImage(receiptImgCanvas, -140, -190, 280, 380);

    ctx.restore();
  }

  updateZoomLabel() {
    const zLabel = this.container.querySelector('#viewer-zoom-label');
    if (zLabel) zLabel.textContent = `${Math.round(this.zoom * 100)}%`;
  }

  collectAndSave() {
    if (!this.currentDoc) return;

    this.currentDoc.title = this.container.querySelector('#edit-doc-title').value.trim() || 'Untitled Document';
    this.currentDoc.vendor = this.container.querySelector('#edit-doc-vendor').value.trim() || 'Unknown Vendor';
    this.currentDoc.amount = parseFloat(this.container.querySelector('#edit-doc-amount').value) || 0;
    this.currentDoc.purchaseDate = this.container.querySelector('#edit-doc-date').value || '';
    this.currentDoc.category = this.container.querySelector('#edit-doc-category').value;
    this.currentDoc.paymentMethod = this.container.querySelector('#edit-doc-payment').value;
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
 * Compact professional table listing receipts, warranties, amounts, categories, and quick actions.
 */




function renderDocumentLibrary(container, {
  documents = [],
  selectedDocId = null,
  filters = {},
  onSelectDoc = null,
  onFilterChange = null
}) {
  const filtered = filterDocuments(documents, filters);

  container.innerHTML = `
    <!-- Top Filter Controls Bar -->
    <div class="library-filter-bar p-3 border-b flex flex-wrap items-center justify-between gap-2">
      <!-- Search Input -->
      <div class="flex items-center gap-2 flex-1 min-w-[200px]">
        <div class="relative flex-1">
          <input type="text" id="lib-search-input" class="form-control form-control-sm pl-8 font-sans" placeholder="Search vendor, item, notes, tags..." value="${escapeHTML(filters.search || '')}" />
          <span class="absolute left-2 top-2 text-muted pointer-events-none">${getIcon('search', 'icon-xs')}</span>
        </div>
      </div>

      <!-- Category Filter -->
      <div class="flex items-center gap-2">
        <select id="lib-filter-category" class="form-control form-control-sm font-semibold">
          <option value="">All Categories</option>
          ${['Electronics', 'Home', 'Clothing', 'Groceries', 'Software', 'Subscriptions', 'Travel', 'Other'].map(c => `
            <option value="${c}" ${filters.category === c ? 'selected' : ''}>${c}</option>
          `).join('')}
        </select>

        <!-- Warranty Status Filter -->
        <select id="lib-filter-warranty" class="form-control form-control-sm font-semibold">
          <option value="">All Warranties</option>
          <option value="ACTIVE" ${filters.warranty === 'ACTIVE' ? 'selected' : ''}>Active Protection</option>
          <option value="EXPIRING_SOON" ${filters.warranty === 'EXPIRING_SOON' ? 'selected' : ''}>Expiring Soon (&le;30d)</option>
          <option value="EXPIRED" ${filters.warranty === 'EXPIRED' ? 'selected' : ''}>Expired</option>
        </select>

        <!-- Sort Order -->
        <select id="lib-sort-by" class="form-control form-control-sm font-semibold">
          <option value="date_desc" ${filters.sort === 'date_desc' ? 'selected' : ''}>Date: Newest First</option>
          <option value="date_asc" ${filters.sort === 'date_asc' ? 'selected' : ''}>Date: Oldest First</option>
          <option value="amount_desc" ${filters.sort === 'amount_desc' ? 'selected' : ''}>Amount: High to Low</option>
          <option value="amount_asc" ${filters.sort === 'amount_asc' ? 'selected' : ''}>Amount: Low to High</option>
          <option value="title_asc" ${filters.sort === 'title_asc' ? 'selected' : ''}>Title: A to Z</option>
        </select>
      </div>
    </div>

    <!-- Documents Data Grid -->
    <div class="library-table-wrapper flex-1 overflow-auto">
      ${filtered.length === 0 ? `
        <div class="p-8 text-center text-muted font-sans text-xs">
          No receipts match the current search filters. Click "New Receipt" to add a document.
        </div>
      ` : `
        <table class="data-grid-table font-sans text-xs w-full">
          <thead>
            <tr>
              <th class="w-8 text-center">Type</th>
              <th>Vendor & Document Title</th>
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
              const wInfo = getWarrantyInfo(doc.warrantyExpirationDate);
              const rInfo = getReturnInfo(doc.returnDeadlineDate);

              return `
                <tr class="document-row cursor-pointer ${isSelected ? 'active' : ''}" data-id="${doc.id}">
                  <td class="text-center text-muted">
                    ${getIcon('receipt', 'icon-xs')}
                  </td>
                  <td>
                    <div class="flex flex-col">
                      <span class="font-bold text-primary">${escapeHTML(doc.title)}</span>
                      <span class="text-xs text-muted">${escapeHTML(doc.vendor)}</span>
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
                      <span class="badge ${wInfo.status === WARRANTY_STATUS.ACTIVE ? 'badge-success' : (wInfo.status === WARRANTY_STATUS.EXPIRING_SOON ? 'badge-warning' : 'badge-secondary')}">
                        ${escapeHTML(wInfo.label)}
                      </span>
                    ` : `<span class="text-muted text-xs">-</span>`}
                  </td>
                  <td>
                    ${doc.returnDeadlineDate ? `
                      <span class="badge ${rInfo.status === RETURN_STATUS.OPEN ? 'badge-primary' : (rInfo.status === RETURN_STATUS.CLOSING_SOON ? 'badge-warning' : 'badge-secondary')}">
                        ${escapeHTML(rInfo.label)}
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

    <!-- Table Footer Stats -->
    <div class="library-footer-bar px-3 py-1 border-t flex items-center justify-between text-xs text-muted font-mono">
      <span>Showing <strong>${filtered.length}</strong> of <strong>${documents.length}</strong> records</span>
      <span>Filtered Total: <strong>$${filtered.reduce((sum, d) => sum + (Number(d.amount) || 0), 0).toFixed(2)}</strong></span>
    </div>
  `;

  // Attach Handlers
  container.querySelectorAll('.document-row').forEach(row => {
    row.addEventListener('click', () => {
      if (onSelectDoc) onSelectDoc(row.dataset.id);
    });
  });

  const searchInput = container.querySelector('#lib-search-input');
  searchInput?.addEventListener('input', (e) => {
    if (onFilterChange) onFilterChange({ ...filters, search: e.target.value });
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
}

function filterDocuments(documents, filters = {}) {
  let list = [...documents];

  // 1. Text Search
  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(d =>
      (d.title && d.title.toLowerCase().includes(q)) ||
      (d.vendor && d.vendor.toLowerCase().includes(q)) ||
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

  // 4. Sorting
  const sortKey = filters.sort || 'date_desc';
  list.sort((a, b) => {
    if (sortKey === 'date_desc') return new Date(b.purchaseDate || 0) - new Date(a.purchaseDate || 0);
    if (sortKey === 'date_asc') return new Date(a.purchaseDate || 0) - new Date(b.purchaseDate || 0);
    if (sortKey === 'amount_desc') return (b.amount || 0) - (a.amount || 0);
    if (sortKey === 'amount_asc') return (a.amount || 0) - (b.amount || 0);
    if (sortKey === 'title_asc') return (a.title || '').localeCompare(b.title || '');
    return 0;
  });

  return list;
}


/* --- MODULE: js/editor/dashboard.js --- */
/**
 * ReceiptVault - Dashboard Component
 * KPI Summary Cards, Urgent Warranty Expiry Alerts, Category Donut, and Monthly Spending Charts.
 */





function renderDashboard(container, {
  documents = [],
  onSelectDoc = null,
  onNavigateTab = null
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
      
      <!-- Top KPI Summary Cards -->
      <div class="grid grid-cols-4 gap-3">
        <!-- 1. Total Spend -->
        <div class="card p-3 flex flex-col gap-1">
          <div class="flex items-center justify-between text-muted">
            <span class="text-xs font-semibold">Total Documented Spend</span>
            ${getIcon('dollar', 'icon-sm text-primary')}
          </div>
          <span class="font-mono font-bold text-xl text-primary">$${metrics.totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span class="text-xs text-muted font-sans">${metrics.totalDocuments} total receipts/invoices</span>
        </div>

        <!-- 2. Protected Warranty Value -->
        <div class="card p-3 flex flex-col gap-1">
          <div class="flex items-center justify-between text-muted">
            <span class="text-xs font-semibold">Active Warranty Coverage</span>
            ${getIcon('shieldCheck', 'icon-sm text-emerald')}
          </div>
          <span class="font-mono font-bold text-xl text-emerald">$${metrics.protectedAssetValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span class="text-xs text-muted font-sans">${metrics.activeWarrantiesCount} protected items</span>
        </div>

        <!-- 3. Expiring Soon Warranties -->
        <div class="card p-3 flex flex-col gap-1">
          <div class="flex items-center justify-between text-muted">
            <span class="text-xs font-semibold">Expiring Warranties (&le;30d)</span>
            ${getIcon('shieldAlert', 'icon-sm text-amber')}
          </div>
          <span class="font-mono font-bold text-xl text-amber">${metrics.expiringSoonWarrantiesCount}</span>
          <span class="text-xs text-muted font-sans">Requires warranty extension</span>
        </div>

        <!-- 4. Open Return Windows -->
        <div class="card p-3 flex flex-col gap-1">
          <div class="flex items-center justify-between text-muted">
            <span class="text-xs font-semibold">Active Return Deadlines</span>
            ${getIcon('clock', 'icon-sm text-primary')}
          </div>
          <span class="font-mono font-bold text-xl text-primary">${metrics.openReturnsCount}</span>
          <span class="text-xs text-muted font-sans">Eligible for merchant return</span>
        </div>
      </div>

      <!-- Urgent Alerts Banner (If any expiring soon items) -->
      ${urgentWarranties.length > 0 || urgentReturns.length > 0 ? `
        <div class="card p-3 border-amber bg-amber-subtle flex flex-col gap-2">
          <div class="flex items-center gap-2 text-amber font-bold text-xs">
            ${getIcon('alertTriangle', 'icon-xs')}
            <span>Urgent Expiration & Return Deadlines</span>
          </div>
          <div class="flex flex-wrap gap-2">
            ${urgentWarranties.map(d => `
              <div class="badge badge-warning cursor-pointer flex items-center gap-1 doc-alert-tag" data-id="${d.id}">
                ${getIcon('shieldAlert', 'icon-xs')}
                <span>${escapeHTML(d.title)} (Warranty expires in ${getWarrantyInfo(d.warrantyExpirationDate).daysRemaining}d)</span>
              </div>
            `).join('')}
            ${urgentReturns.map(d => `
              <div class="badge badge-primary cursor-pointer flex items-center gap-1 doc-alert-tag" data-id="${d.id}">
                ${getIcon('clock', 'icon-xs')}
                <span>${escapeHTML(d.title)} (Return window closes in ${getReturnInfo(d.returnDeadlineDate).daysRemaining}d)</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Visual Charts Grid (Category Donut & Monthly Spending Bar) -->
      <div class="grid grid-cols-2 gap-4">
        <!-- Category Distribution Donut -->
        <div class="card p-3 flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold uppercase text-muted">Spending by Category</span>
            <span class="text-xs text-muted font-mono">${metrics.totalDocuments} Receipts</span>
          </div>
          <div class="flex items-center justify-center flex-1" style="height: 220px;">
            <canvas id="dashboard-category-donut" width="300" height="220"></canvas>
          </div>
        </div>

        <!-- Monthly Spending Trend Bars -->
        <div class="card p-3 flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold uppercase text-muted">Monthly Spending History</span>
            <span class="text-xs text-muted font-mono">Last 6 Months</span>
          </div>
          <div class="flex items-center justify-center flex-1" style="height: 220px;">
            <canvas id="dashboard-monthly-bars" width="340" height="220"></canvas>
          </div>
        </div>
      </div>

      <!-- Recent Documents Table -->
      <div class="card p-3 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase text-muted">Recent Documents & Receipts</span>
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
              ${documents.slice(0, 5).map(doc => {
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
                        <span class="badge ${w.status === WARRANTY_STATUS.ACTIVE ? 'badge-success' : (w.status === WARRANTY_STATUS.EXPIRING_SOON ? 'badge-warning' : 'badge-secondary')}">
                          ${escapeHTML(w.label)}
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

  // Attach Handlers
  container.querySelectorAll('.doc-alert-tag, .recent-doc-row').forEach(el => {
    el.addEventListener('click', () => {
      if (onSelectDoc) onSelectDoc(el.dataset.id);
    });
  });

  container.querySelector('#btn-view-all-docs')?.addEventListener('click', () => {
    if (onNavigateTab) onNavigateTab('library');
  });
}


/* --- MODULE: js/editor/upload-modal.js --- */
/**
 * ReceiptVault - Upload & Manual Document Entry Modal
 * Handles local receipt image selection, manual metadata entry, and duplicate conflict review.
 */




class UploadModal {
  constructor(container, existingDocs = [], onSaveDocument) {
    this.container = container;
    this.existingDocs = existingDocs;
    this.onSaveDocument = onSaveDocument;

    this.docData = this.getEmptyDoc();
    this.duplicateWarning = null;
  }

  setExistingDocs(docs) {
    this.existingDocs = docs;
  }

  getEmptyDoc() {
    return {
      id: 'doc_' + Date.now(),
      title: '',
      vendor: '',
      amount: '',
      currency: '$',
      purchaseDate: new Date().toISOString().split('T')[0],
      category: 'Electronics',
      paymentMethod: 'Credit Card',
      warrantyExpirationDate: '',
      returnDeadlineDate: '',
      notes: '',
      tags: [],
      fileName: ''
    };
  }

  open() {
    this.docData = this.getEmptyDoc();
    this.duplicateWarning = null;
    this.render();
    this.container.classList.add('active');
  }

  close() {
    this.container.classList.remove('active');
  }

  render() {
    this.container.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-dialog upload-modal-dialog">
        <div class="modal-header flex items-center justify-between p-3 border-b">
          <div class="flex items-center gap-2">
            ${getIcon('upload', 'icon-sm text-primary')}
            <span class="font-bold text-sm">Add New Receipt / Document</span>
          </div>
          <button class="btn-icon-xs btn-modal-close">&times;</button>
        </div>

        <div class="modal-body p-4 flex flex-col gap-3 overflow-y-auto" style="max-height: 75vh;">
          
          <!-- File Drop Zone -->
          <div class="upload-dropzone p-4 border border-dashed rounded text-center cursor-pointer" id="dropzone-file">
            <input type="file" id="input-receipt-file" accept="image/*,.pdf" style="display: none;" />
            <div class="flex flex-col items-center gap-1 text-muted">
              ${getIcon('upload', 'icon-md text-primary')}
              <span class="font-bold text-xs text-primary">Click to select receipt image / PDF</span>
              <span class="text-xs text-muted">PNG, JPG, WebP supported &bull; Processed 100% locally</span>
              <span class="text-xs font-mono text-emerald mt-1" id="label-selected-file">${this.docData.fileName ? escapeHTML(this.docData.fileName) : ''}</span>
            </div>
          </div>

          <!-- Duplicate Conflict Warning Banner -->
          <div id="duplicate-warning-banner" class="card p-3 border-amber bg-amber-subtle text-amber font-sans text-xs ${this.duplicateWarning ? '' : 'hidden'}">
            <div class="flex items-center gap-2 font-bold mb-1">
              ${getIcon('alertTriangle', 'icon-xs')}
              <span>Potential Duplicate Record Detected</span>
            </div>
            <p id="duplicate-reason-text">${this.duplicateWarning ? escapeHTML(this.duplicateWarning.reason) : ''}</p>
          </div>

          <!-- Manual Metadata Extraction Form -->
          <div class="flex flex-col gap-3 mt-1">
            <!-- Title & Vendor -->
            <div class="form-group">
              <label class="form-label text-xs font-semibold">Document Title / Description *</label>
              <input type="text" id="up-doc-title" class="form-control form-control-sm font-semibold" placeholder="e.g. Sony Wireless Headphones" value="${escapeHTML(this.docData.title)}" />
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div class="form-group">
                <label class="form-label text-xs font-semibold">Merchant / Vendor *</label>
                <input type="text" id="up-doc-vendor" class="form-control form-control-sm" placeholder="e.g. Best Buy" value="${escapeHTML(this.docData.vendor)}" />
              </div>
              <div class="form-group">
                <label class="form-label text-xs font-semibold">Total Amount *</label>
                <input type="number" step="0.01" id="up-doc-amount" class="form-control form-control-sm font-mono font-bold" placeholder="0.00" value="${this.docData.amount}" />
              </div>
            </div>

            <!-- Date & Category -->
            <div class="grid grid-cols-2 gap-2">
              <div class="form-group">
                <label class="form-label text-xs font-semibold">Purchase Date *</label>
                <input type="date" id="up-doc-date" class="form-control form-control-sm font-mono" value="${this.docData.purchaseDate}" />
              </div>
              <div class="form-group">
                <label class="form-label text-xs font-semibold">Category</label>
                <select id="up-doc-category" class="form-control form-control-sm">
                  ${['Electronics', 'Home', 'Clothing', 'Groceries', 'Software', 'Subscriptions', 'Travel', 'Other'].map(c => `
                    <option value="${c}" ${this.docData.category === c ? 'selected' : ''}>${c}</option>
                  `).join('')}
                </select>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="form-group">
              <label class="form-label text-xs font-semibold">Payment Method</label>
              <select id="up-doc-payment" class="form-control form-control-sm">
                ${['Credit Card', 'Debit Card', 'Cash', 'PayPal', 'Bank Transfer', 'Other'].map(p => `
                  <option value="${p}" ${this.docData.paymentMethod === p ? 'selected' : ''}>${p}</option>
                `).join('')}
              </select>
            </div>

            <!-- Warranty & Return Deadline -->
            <div class="grid grid-cols-2 gap-2">
              <div class="form-group">
                <label class="form-label text-xs font-semibold">Warranty Expiration Date</label>
                <input type="date" id="up-doc-warranty" class="form-control form-control-sm font-mono" value="${this.docData.warrantyExpirationDate}" />
              </div>
              <div class="form-group">
                <label class="form-label text-xs font-semibold">Return Deadline Date</label>
                <input type="date" id="up-doc-return" class="form-control form-control-sm font-mono" value="${this.docData.returnDeadlineDate}" />
              </div>
            </div>

            <!-- Notes & Tags -->
            <div class="form-group">
              <label class="form-label text-xs font-semibold">Notes & Serial Numbers</label>
              <textarea id="up-doc-notes" class="form-control form-control-sm" rows="2" placeholder="Order ID, serial numbers, warranty terms...">${escapeHTML(this.docData.notes)}</textarea>
            </div>

            <div class="form-group">
              <label class="form-label text-xs font-semibold">Tags (Comma-separated)</label>
              <input type="text" id="up-doc-tags" class="form-control form-control-sm font-mono" placeholder="work, applecare, electronics" value="${escapeHTML(this.docData.tags.join(', '))}" />
            </div>
          </div>

        </div>

        <div class="modal-footer p-3 border-t flex justify-end gap-2">
          <button class="btn btn-sm btn-secondary btn-modal-close">Cancel</button>
          <button class="btn btn-sm btn-primary" id="btn-submit-document">Save to Vault</button>
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

    fileInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.docData.fileName = file.name;
        this.container.querySelector('#label-selected-file').textContent = file.name;

        // Auto-suggest title if blank
        const titleInp = this.container.querySelector('#up-doc-title');
        if (titleInp && !titleInp.value) {
          titleInp.value = file.name.replace(/\.[^/.]+$/, '').replace(/[_|-]/g, ' ');
        }
      }
    });

    // Real-time Duplicate Check
    const checkDuplicate = () => {
      const vendor = this.container.querySelector('#up-doc-vendor').value.trim();
      const amount = parseFloat(this.container.querySelector('#up-doc-amount').value) || 0;
      const purchaseDate = this.container.querySelector('#up-doc-date').value;

      const dup = findPotentialDuplicate({ vendor, amount, purchaseDate }, this.existingDocs);
      const banner = this.container.querySelector('#duplicate-warning-banner');
      const reasonEl = this.container.querySelector('#duplicate-reason-text');

      if (dup) {
        this.duplicateWarning = dup;
        banner.classList.remove('hidden');
        reasonEl.textContent = dup.reason;
      } else {
        this.duplicateWarning = null;
        banner.classList.add('hidden');
      }
    };

    this.container.querySelector('#up-doc-vendor')?.addEventListener('input', checkDuplicate);
    this.container.querySelector('#up-doc-amount')?.addEventListener('input', checkDuplicate);
    this.container.querySelector('#up-doc-date')?.addEventListener('input', checkDuplicate);

    // Save Submit
    this.container.querySelector('#btn-submit-document')?.addEventListener('click', () => {
      const title = this.container.querySelector('#up-doc-title').value.trim();
      const vendor = this.container.querySelector('#up-doc-vendor').value.trim();
      const amount = parseFloat(this.container.querySelector('#up-doc-amount').value);
      const purchaseDate = this.container.querySelector('#up-doc-date').value;

      if (!title) return alert('Please enter a document title.');
      if (!vendor) return alert('Please enter a vendor/merchant name.');
      if (isNaN(amount) || amount <= 0) return alert('Please enter a valid total amount.');

      const newDoc = {
        id: this.docData.id || 'doc_' + Date.now(),
        title,
        vendor,
        amount,
        currency: '$',
        purchaseDate: purchaseDate || new Date().toISOString().split('T')[0],
        category: this.container.querySelector('#up-doc-category').value,
        paymentMethod: this.container.querySelector('#up-doc-payment').value,
        warrantyExpirationDate: this.container.querySelector('#up-doc-warranty').value || null,
        returnDeadlineDate: this.container.querySelector('#up-doc-return').value || null,
        notes: this.container.querySelector('#up-doc-notes').value.trim(),
        tags: this.container.querySelector('#up-doc-tags').value.split(',').map(t => t.trim()).filter(Boolean),
        fileName: this.docData.fileName || `${vendor.replace(/\s+/g, '_')}_Receipt.png`
      };

      if (this.onSaveDocument) {
        this.onSaveDocument(newDoc);
      }
      this.close();
    });
  }
}


/* --- MODULE: js/editor/reports.js --- */
/**
 * ReceiptVault - Financial & Warranty Reports Component
 * Comprehensive financial summaries, category/vendor leaderboards, and CSV ledger export.
 */




function renderReports(container, {
  documents = [],
  onExportCSV = null
}) {
  const metrics = calculateVaultMetrics(documents);

  // Group by category
  const categoryStats = {};
  for (const doc of documents) {
    const cat = doc.category || 'Other';
    if (!categoryStats[cat]) categoryStats[cat] = { total: 0, count: 0, protected: 0 };
    const amt = Number(doc.amount) || 0;
    categoryStats[cat].total += amt;
    categoryStats[cat].count++;

    const w = getWarrantyInfo(doc.warrantyExpirationDate);
    if (w.status === WARRANTY_STATUS.ACTIVE || w.status === WARRANTY_STATUS.EXPIRING_SOON) {
      categoryStats[cat].protected += amt;
    }
  }

  // Group by vendor
  const vendorStats = {};
  for (const doc of documents) {
    const v = doc.vendor || 'Unknown';
    if (!vendorStats[v]) vendorStats[v] = { total: 0, count: 0 };
    vendorStats[v].total += Number(doc.amount) || 0;
    vendorStats[v].count++;
  }
  const topVendors = Object.entries(vendorStats).sort((a, b) => b[1].total - a[1].total).slice(0, 8);

  container.innerHTML = `
    <div class="reports-scroll-wrap p-4 flex flex-col gap-4 overflow-y-auto flex-1 max-w-6xl mx-auto w-full">
      
      <!-- Top Action Bar -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-sm font-bold uppercase text-primary">Financial & Warranty Reports</h2>
          <p class="text-xs text-muted">Audited financial summaries and warranty coverage across your filing vault.</p>
        </div>
        <button class="btn btn-sm btn-primary" id="btn-export-csv-report">
          ${getIcon('download', 'icon-xs')} Export Ledger (CSV)
        </button>
      </div>

      <!-- Summary Metrics Grid -->
      <div class="grid grid-cols-3 gap-3">
        <div class="card p-3 flex flex-col">
          <span class="text-xs font-semibold text-muted">Total Cumulative Spend</span>
          <span class="font-mono font-bold text-xl text-primary mt-1">$${metrics.totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="card p-3 flex flex-col">
          <span class="text-xs font-semibold text-muted">Active Warranty Asset Value</span>
          <span class="font-mono font-bold text-xl text-emerald mt-1">$${metrics.protectedAssetValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="card p-3 flex flex-col">
          <span class="text-xs font-semibold text-muted">Protected Asset Ratio</span>
          <span class="font-mono font-bold text-xl text-amber mt-1">${metrics.totalSpend > 0 ? Math.round((metrics.protectedAssetValue / metrics.totalSpend) * 100) : 0}%</span>
        </div>
      </div>

      <!-- Category Breakdown Table -->
      <div class="card p-3 flex flex-col gap-2">
        <span class="text-xs font-bold uppercase text-muted">Spending & Warranty Coverage by Category</span>
        <div class="overflow-x-auto">
          <table class="data-grid-table font-sans text-xs w-full">
            <thead>
              <tr>
                <th>Category</th>
                <th class="text-center">Receipts</th>
                <th class="text-right">Total Spend</th>
                <th class="text-right">Share of Total</th>
                <th class="text-right">Warranty Covered Value</th>
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
                    <td class="font-mono text-right text-emerald">$${stat.protected.toFixed(2)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Top Merchants Leaderboard -->
      <div class="card p-3 flex flex-col gap-2">
        <span class="text-xs font-bold uppercase text-muted">Top Merchants & Vendors Leaderboard</span>
        <div class="overflow-x-auto">
          <table class="data-grid-table font-sans text-xs w-full">
            <thead>
              <tr>
                <th>Vendor / Merchant</th>
                <th class="text-center">Transactions</th>
                <th class="text-right">Total Spent</th>
                <th class="text-right">Avg. Ticket</th>
              </tr>
            </thead>
            <tbody>
              ${topVendors.map(([vendor, stat]) => `
                <tr>
                  <td class="font-bold text-primary">${escapeHTML(vendor)}</td>
                  <td class="text-center font-mono">${stat.count}</td>
                  <td class="font-mono font-bold text-right text-primary">$${stat.total.toFixed(2)}</td>
                  <td class="font-mono text-right text-muted">$${(stat.total / stat.count).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;

  // Attach CSV Export
  container.querySelector('#btn-export-csv-report')?.addEventListener('click', () => {
    if (onExportCSV) onExportCSV();
  });
}


/* --- MODULE: js/app.js --- */
/**
 * ReceiptVault - Master Application Orchestrator
 * Integrates Navigation, Document Library, Warranty Engine, Viewer Studio, Dashboard, and Reports.
 */









class ReceiptVaultApp {
  constructor() {
    this.documents = [];
    this.selectedDocId = null;
    this.activeTab = 'dashboard'; // 'dashboard', 'library', 'warranties', 'reports'
    this.filters = { search: '', category: '', warranty: '', sort: 'date_desc' };
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
      (docId) => this.deleteDocument(docId)
    );

    const uploadModalContainer = document.getElementById('upload-modal-container');
    this.uploadModal = new UploadModal(
      uploadModalContainer,
      this.documents,
      (newDoc) => this.saveDocument(newDoc)
    );

    this.setupNavigation();
    this.setupTopActions();
    this.setupSplitter();
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
      b.classList.toggle('active', b.dataset.tab === tabKey);
    });

    // Handle Warranties tab shortcut
    if (tabKey === 'warranties') {
      this.filters.warranty = 'ACTIVE';
    } else if (tabKey === 'library') {
      this.filters.warranty = '';
    }

    this.renderActiveTab();
  }

  setupTopActions() {
    // New Receipt Button
    document.getElementById('btn-new-receipt')?.addEventListener('click', () => {
      this.uploadModal.setExistingDocs(this.documents);
      this.uploadModal.open();
    });

    // Reset Demo Vault
    document.getElementById('btn-reset-demo-vault')?.addEventListener('click', async () => {
      if (confirm('Reset ReceiptVault to demo receipts and warranties?')) {
        await db.resetDemoData();
        this.documents = await db.getAllDocuments();
        this.selectedDocId = this.documents[0]?.id || null;
        this.renderActiveTab();
        this.updateInspector();
      }
    });

    // Export Backup JSON
    document.getElementById('btn-export-vault-json')?.addEventListener('click', () => {
      const json = JSON.stringify(this.documents, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receiptvault_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
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
          if (Array.isArray(parsed)) {
            for (const doc of parsed) {
              await db.saveDocument(doc);
            }
            this.documents = await db.getAllDocuments();
            this.selectedDocId = this.documents[0]?.id || null;
            this.renderActiveTab();
            this.updateInspector();
            alert(`Successfully imported ${parsed.length} document records.`);
          } else {
            alert('Invalid ReceiptVault backup JSON format.');
          }
        } catch (err) {
          alert('Failed to parse backup JSON: ' + err.message);
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
      const newW = Math.max(280, Math.min(600, startW + dx));
      viewerPane.style.width = `${newW}px`;
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        document.body.style.cursor = '';
      }
    });
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
        onNavigateTab: (tab) => this.setTab(tab)
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
      if (rightInspector) rightInspector.style.display = 'flex';
      if (splitter) splitter.style.display = 'block';

      renderDocumentLibrary(mainContainer, {
        documents: this.documents,
        selectedDocId: this.selectedDocId,
        filters: this.filters,
        onSelectDoc: (id) => {
          this.selectedDocId = id;
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

  async saveDocument(doc) {
    await db.saveDocument(doc);
    this.documents = await db.getAllDocuments();
    this.selectedDocId = doc.id;
    this.renderActiveTab();
    this.updateInspector();
  }

  async deleteDocument(id) {
    await db.deleteDocument(id);
    this.documents = await db.getAllDocuments();
    this.selectedDocId = this.documents[0]?.id || null;
    this.renderActiveTab();
    this.updateInspector();
  }

  exportCSV() {
    const headers = ['Title', 'Vendor', 'Amount', 'Currency', 'Purchase Date', 'Category', 'Payment Method', 'Warranty Expiration', 'Return Deadline', 'Tags', 'Notes'];
    const rows = this.documents.map(d => [
      `"${(d.title || '').replace(/"/g, '""')}"`,
      `"${(d.vendor || '').replace(/"/g, '""')}"`,
      d.amount || 0,
      `"${d.currency || '$'}"`,
      `"${d.purchaseDate || ''}"`,
      `"${d.category || ''}"`,
      `"${d.paymentMethod || ''}"`,
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
    a.download = `receiptvault_ledger_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
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
