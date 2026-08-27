/**
 * ReceiptVault - Duplicate Detection Engine
 * Detects potential duplicate receipts matching vendor, amount, and purchase date.
 */

export function findPotentialDuplicate(candidate, existingDocs = [], ignoreId = null) {
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
