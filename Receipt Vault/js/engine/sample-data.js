/**
 * ReceiptVault - Pre-Loaded Demonstration Receipts & Procedural Vector Document Artwork
 * Generates rich realistic sample receipts, warranties, return deadlines, and high-fidelity simulated receipt canvases.
 */

export function getRelativeDateStr(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
}

export const SAMPLE_DOCUMENTS = [
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
export function generateReceiptCanvas(doc, width = 360, height = 500, options = {}) {
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
