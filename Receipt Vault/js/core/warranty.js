/**
 * ReceiptVault - Warranty & Return Deadline Engine
 * Calculates remaining durations, expiration status tags, progress percentages, and protected asset valuations.
 */

export const WARRANTY_STATUS = {
  ACTIVE: 'ACTIVE',
  EXPIRING_SOON: 'EXPIRING_SOON',
  EXPIRED: 'EXPIRED',
  NONE: 'NONE'
};

export const RETURN_STATUS = {
  OPEN: 'OPEN',
  CLOSING_SOON: 'CLOSING_SOON',
  CLOSED: 'CLOSED',
  NONE: 'NONE'
};

/**
 * Parses any date string, timestamp, or object into a sanitized midnight Date object
 */
export function parseDateSafe(dateInput) {
  if (!dateInput) return null;
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Returns warranty countdown, status tag, remaining days, and elapsed percentage
 */
export function getWarrantyInfo(warrantyExpirationDate, referenceDate = new Date(), purchaseDate = null) {
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
export function getReturnInfo(returnDeadlineDate, referenceDate = new Date()) {
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
export function calculateVaultMetrics(documents = [], referenceDate = new Date()) {
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
