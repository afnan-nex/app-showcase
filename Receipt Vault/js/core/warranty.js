/**
 * ReceiptVault - Warranty & Return Deadline Engine
 * Calculates remaining durations, expiration status tags, and protected asset valuations.
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

export function getWarrantyInfo(warrantyExpirationDate, referenceDate = new Date()) {
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

export function getReturnInfo(returnDeadlineDate, referenceDate = new Date()) {
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

export function calculateVaultMetrics(documents = [], referenceDate = new Date()) {
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
