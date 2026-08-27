/**
 * ReceiptVault - Duplicate Detection Engine
 * Detects potential duplicate receipts matching invoice IDs, merchant names, amounts, and purchase dates.
 */

export function findPotentialDuplicate(candidate, existingDocs = [], ignoreId = null) {
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
