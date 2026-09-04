// optimizer.js — Greedy allocation: given a required credit quantity, pick
// a mix of green/yellow/red listings to minimize total cost while keeping
// a reasonable quality mix (not just cheapest/lowest-quality only).

const ALLOCATION_RATIO = { green: 0.5, yellow: 0.3, red: 0.2 };

function optimizePortfolio(listings, requiredCredits) {
  const buckets = { green: [], yellow: [], red: [] };
  for (const l of listings) {
    if (buckets[l.quality_badge]) buckets[l.quality_badge].push(l);
  }
  // Sort each bucket by price ascending — cheapest first (greedy choice)
  for (const badge in buckets) {
    buckets[badge].sort((a, b) => a.fair_price - b.fair_price);
  }

  const selected = [];
  let totalCost = 0;
  let totalCreditsFilled = 0;

  for (const badge of ['green', 'yellow', 'red']) {
    let targetForBucket = Math.round(requiredCredits * ALLOCATION_RATIO[badge]);
    for (const listing of buckets[badge]) {
      if (targetForBucket <= 0) break;
      const take = Math.min(targetForBucket, listing.credits_issued);
      selected.push({ ...listing, credits_taken: take });
      totalCost += take * listing.fair_price;
      totalCreditsFilled += take;
      targetForBucket -= take;
    }
  }

  const avgQualityScore = selected.length
    ? selected.reduce((sum, l) => sum + l.quality_score * l.credits_taken, 0) / totalCreditsFilled
    : 0;

  return {
    selected_listings: selected,
    total_credits_filled: totalCreditsFilled,
    total_cost: +totalCost.toFixed(2),
    avg_quality_score: +avgQualityScore.toFixed(2),
    shortfall: Math.max(0, requiredCredits - totalCreditsFilled)
  };
}

module.exports = { optimizePortfolio };