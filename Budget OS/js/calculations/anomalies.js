/**
 * BudgetOS - Anomaly Detection Engine
 * Uses historical statistical heuristics (mean, standard deviation, multiplier)
 * to flag unusual or outlier transactions for user review.
 */

/**
 * Identify potential spending anomalies in transactions
 * @param {Array} transactions - All transactions
 * @param {Array} categories - Category definitions
 * @param {Object} [options]
 * @param {number} [options.multiplierThreshold=2.2] - Multiplier above mean to flag
 * @param {number} [options.minSamples=3] - Minimum transactions in category needed for heuristic
 * @returns {Array} List of flagged anomaly objects
 */
export function detectSpendingAnomalies(transactions = [], categories = [], options = {}) {
  const multiplierThreshold = options.multiplierThreshold || 2.2;
  const minSamples = options.minSamples || 3;

  const categoryMap = {};
  categories.forEach(c => { categoryMap[c.id] = c; });

  // 1. Group expense transactions by category
  const catExpenses = {};
  transactions.forEach(tx => {
    if (tx.type === 'expense') {
      const catId = tx.categoryId || 'cat_misc';
      if (!catExpenses[catId]) catExpenses[catId] = [];
      catExpenses[catId].push(tx);
    }
  });

  const anomalies = [];

  // 2. Compute statistics per category
  Object.keys(catExpenses).forEach(catId => {
    const txList = catExpenses[catId];
    if (txList.length < minSamples) return;

    const amounts = txList.map(t => Number(t.amount) || 0);
    const sum = amounts.reduce((a, b) => a + b, 0);
    const mean = sum / amounts.length;

    // Standard deviation
    const variance = amounts.reduce((sqSum, amt) => sqSum + Math.pow(amt - mean, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);

    const category = categoryMap[catId] || { name: 'Uncategorized', color: '#94a3b8' };

    // Check transactions against threshold
    txList.forEach(tx => {
      const amt = Number(tx.amount) || 0;
      const ratio = mean > 0 ? amt / mean : 1;

      // Check if significantly higher than mean + (stdDev * 1.5) or > mean * multiplierThreshold
      if (amt > 50 && (amt > mean * multiplierThreshold || (stdDev > 0 && amt > mean + 2.5 * stdDev))) {
        anomalies.push({
          transactionId: tx.id,
          date: tx.date,
          description: tx.description,
          merchant: tx.merchant,
          amount: amt,
          categoryId: catId,
          categoryName: category.name,
          categoryColor: category.color,
          categoryAverage: Math.round(mean * 100) / 100,
          ratioMultiplier: Math.round(ratio * 10) / 10,
          confidenceNote: `Informational flag: This transaction is ${Math.round(ratio * 10) / 10}x higher than your average ${category.name} expense ($${mean.toFixed(2)}).`
        });
      }
    });
  });

  // Sort by date descending
  anomalies.sort((a, b) => (b.date > a.date ? 1 : -1));

  return anomalies;
}
