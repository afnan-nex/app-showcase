/**
 * ReceiptVault - Automated Verification Test Suite
 * Tests warranty calculations, return windows, duplicate detection, progress metrics, and search filters.
 */

import { getWarrantyInfo, getReturnInfo, calculateVaultMetrics, parseDateSafe, WARRANTY_STATUS, RETURN_STATUS } from './js/core/warranty.js';
import { findPotentialDuplicate } from './js/engine/duplicate.js';
import { filterDocuments } from './js/editor/document-library.js';
import { SAMPLE_DOCUMENTS } from './js/engine/sample-data.js';

console.log('--- 1. Testing Warranty Countdown Engine & Progress Math ---');
const today = new Date('2024-06-01');

const futureWarranty = getWarrantyInfo('2025-06-01', today, '2023-06-01');
console.log('1-Year Future Warranty Status:', futureWarranty.status, 'Days left:', futureWarranty.daysRemaining, 'Progress:', futureWarranty.progressPercent + '%');
if (futureWarranty.status !== WARRANTY_STATUS.ACTIVE || futureWarranty.daysRemaining !== 365 || futureWarranty.progressPercent !== 50) {
  throw new Error('Future warranty calculation or progress percent failed');
}

const expiringWarranty = getWarrantyInfo('2024-06-20', today);
console.log('19-Day Expiring Warranty Status:', expiringWarranty.status, 'Days left:', expiringWarranty.daysRemaining);
if (expiringWarranty.status !== WARRANTY_STATUS.EXPIRING_SOON || expiringWarranty.daysRemaining !== 19) {
  throw new Error('Expiring soon warranty calculation failed');
}

const expiredWarranty = getWarrantyInfo('2024-05-01', today);
console.log('Past Expired Warranty Status:', expiredWarranty.status);
if (expiredWarranty.status !== WARRANTY_STATUS.EXPIRED) {
  throw new Error('Expired warranty calculation failed');
}

// Edge case: invalid/missing date
const invalidWarranty = getWarrantyInfo('invalid-date-string');
if (invalidWarranty.status !== WARRANTY_STATUS.NONE) {
  throw new Error('Invalid date fallback failed');
}

console.log('\n--- 2. Testing Return Window Engine ---');
const openReturn = getReturnInfo('2024-06-15', today);
console.log('Open Return Window Status:', openReturn.status, 'Days left:', openReturn.daysRemaining);
if (openReturn.status !== RETURN_STATUS.OPEN) throw new Error('Open return calculation failed');

const closingReturn = getReturnInfo('2024-06-04', today);
console.log('Closing Return Window Status:', closingReturn.status, 'Days left:', closingReturn.daysRemaining);
if (closingReturn.status !== RETURN_STATUS.CLOSING_SOON) throw new Error('Closing soon return calculation failed');

console.log('\n--- 3. Testing Vault Financial & Warranty Metrics ---');
const metrics = calculateVaultMetrics(SAMPLE_DOCUMENTS, today);
console.log('Total Spend:', metrics.totalSpend, 'Protected Asset Value:', metrics.protectedAssetValue, 'Active Count:', metrics.activeWarrantiesCount, 'Ratio:', metrics.coverageRatio + '%');
if (metrics.totalSpend <= 0 || metrics.protectedAssetValue <= 0 || metrics.activeWarrantiesCount <= 0 || isNaN(metrics.coverageRatio)) {
  throw new Error('Vault metrics calculation failed');
}

console.log('\n--- 4. Testing Duplicate Detection Engine ---');
// Duplicate by vendor + amount + date
const candidate1 = { vendor: 'Apple Store Fifth Avenue', amount: 3499.00, purchaseDate: '2023-11-20' };
const dup1 = findPotentialDuplicate(candidate1, SAMPLE_DOCUMENTS);
console.log('Duplicate test on identical Apple receipt:', dup1 ? dup1.reason : 'None');
if (!dup1 || !dup1.isDuplicate) throw new Error('Duplicate detection failed to catch duplicate receipt');

// Duplicate by Invoice Number
const candidateInvoice = { vendor: 'Different Vendor', invoiceNumber: 'W89123049-NYC' };
const dupInv = findPotentialDuplicate(candidateInvoice, SAMPLE_DOCUMENTS);
console.log('Duplicate test on matching Invoice #:', dupInv ? dupInv.reason : 'None');
if (!dupInv || !dupInv.isDuplicate) throw new Error('Invoice duplicate detection failed');

const candidate2 = { vendor: 'Target Store NYC', amount: 45.00, purchaseDate: '2024-06-01' };
const dup2 = findPotentialDuplicate(candidate2, SAMPLE_DOCUMENTS);
console.log('Duplicate test on unique Target receipt:', dup2);
if (dup2 !== null) throw new Error('Duplicate detection falsely flagged unique receipt');

console.log('\n--- 5. Testing Multi-Criteria Search & Filter Engine ---');
const searchResults = filterDocuments(SAMPLE_DOCUMENTS, { search: 'headphone' });
console.log('Search "headphone" matches count:', searchResults.length);
if (searchResults.length !== 1 || searchResults[0].id !== 'doc_sony_headphones') {
  throw new Error('Search filtering failed');
}

const catResults = filterDocuments(SAMPLE_DOCUMENTS, { category: 'Electronics' });
console.log('Category "Electronics" count:', catResults.length);
if (catResults.length !== 2) throw new Error('Category filtering failed');

const taxResults = filterDocuments(SAMPLE_DOCUMENTS, { quickTag: 'tax-deductible' });
console.log('Quick tag "tax-deductible" count:', taxResults.length);
if (taxResults.length !== 2) throw new Error('Quick tag filtering failed');

const urgentSorted = filterDocuments(SAMPLE_DOCUMENTS, { sort: 'warranty_urgent' });
console.log('Urgent sorted first item:', urgentSorted[0].title);
if (!urgentSorted[0]) throw new Error('Urgent sorting failed');

console.log('\n======================================================');
console.log('ALL RECEIPTVAULT PRODUCTION VERIFICATION TESTS PASSED!');
console.log('======================================================');
