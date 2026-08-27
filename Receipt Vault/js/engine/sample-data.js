/**
 * ReceiptVault - Pre-Loaded Demonstration Receipts & Simulated Document Artwork
 * Generates rich realistic sample receipts, warranties, return deadlines, and vector receipt preview images.
 */

export const SAMPLE_DOCUMENTS = [
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
export function generateReceiptCanvas(doc, width = 420, height = 580) {
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
