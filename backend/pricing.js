// pricing.js — pure functions for quality scoring + fair-price calculation.

const BENCHMARK_PRICES = {
  'overall-avg': 6.34,
  'REDD+': 6,
  'IFM': 15,
  'ARR': 22,
  'Biochar': 177,
  'ERW': 200,
  'DAC': 500
};

const PROJECT_TYPE_ALIASES = {
  'redd': 'REDD+', 'redd+': 'REDD+',
  'ifm': 'IFM', 'improved forest management': 'IFM',
  'arr': 'ARR', 'afforestation': 'ARR', 'reforestation': 'ARR',
  'biochar': 'Biochar',
  'erw': 'ERW', 'enhanced rock weathering': 'ERW',
  'dac': 'DAC', 'direct air capture': 'DAC'
};

function normalizeProjectType(rawType) {
  if (!rawType) return 'overall-avg';
  const key = rawType.trim().toLowerCase();
  return PROJECT_TYPE_ALIASES[key] || (BENCHMARK_PRICES[rawType] ? rawType : 'overall-avg');
}

function getBenchmarkPrice(rawType) {
  const canonical = normalizeProjectType(rawType);
  return BENCHMARK_PRICES[canonical] ?? BENCHMARK_PRICES['overall-avg'];
}

const CURRENT_YEAR = new Date().getFullYear();
const RECOGNIZED_REGISTRIES = ['verra', 'gold standard', 'gs', 'vcs'];
const FORESTRY_TYPES = ['arr', 'redd+', 'redd'];
const PERMANENT_STORAGE_TYPES = ['dac', 'biochar'];
const LEGACY_METHODOLOGIES = ['legacy-renewable-energy', 'renewable-energy', 'legacy renewable energy'];

function calculateQualityScore(listing) {
  const {
    registry = '',
    verification_status = 'unverified',
    methodology = 'unknown',
    vintage_year,
    project_type = ''
  } = listing;

  const breakdown = [];
  let score = 0;

  const registryKey = registry.trim().toLowerCase();
  const typeKey = project_type.trim().toLowerCase();
  const methodKey = methodology.trim().toLowerCase();

  const isRecognizedRegistry = RECOGNIZED_REGISTRIES.some(r => registryKey.includes(r));
  const isVerified = verification_status.toLowerCase() === 'verified' && isRecognizedRegistry;

  if (isVerified) {
    score += 2;
    breakdown.push({ rule: 'Verra/Gold Standard verified', points: 2 });
  } else if (!isRecognizedRegistry || verification_status.toLowerCase() === 'unverified') {
    score -= 2;
    breakdown.push({ rule: 'Unverified / unknown registry', points: -2 });
  }

  if (LEGACY_METHODOLOGIES.some(m => methodKey.includes(m))) {
    score -= 1;
    breakdown.push({ rule: 'Legacy renewable-energy methodology (ICVCM-rejected)', points: -1 });
  }

  if (vintage_year && (CURRENT_YEAR - vintage_year) > 5) {
    score -= 1;
    breakdown.push({ rule: `Vintage >5yrs old (${vintage_year})`, points: -1 });
  }

  if (FORESTRY_TYPES.some(t => typeKey.includes(t))) {
    score -= 1;
    breakdown.push({ rule: 'Forestry/ARR/REDD+ permanence risk', points: -1 });
  }

  if (PERMANENT_STORAGE_TYPES.some(t => typeKey.includes(t))) {
    score += 1;
    breakdown.push({ rule: 'DAC/Biochar permanent storage bonus', points: 1 });
  }

  return { score, breakdown };
}

function scoreToBadgeAndMultiplier(score) {
  if (score >= 2) {
    return { badge: 'green', multiplier: 1.0 };
  } else if (score >= 0) {
    return { badge: 'yellow', multiplier: 0.5 };
  } else {
    return { badge: 'red', multiplier: 0.24 };
  }
}

function computeListingPricing(listing) {
  const { score, breakdown } = calculateQualityScore(listing);
  const { badge, multiplier } = scoreToBadgeAndMultiplier(score);

  const benchmarkPrice = getBenchmarkPrice(listing.project_type);
  const fairPrice = +(benchmarkPrice * multiplier).toFixed(2);

  const BAND_PCT = 0.15;
  const fairPriceLow = +(fairPrice * (1 - BAND_PCT)).toFixed(2);
  const fairPriceHigh = +(fairPrice * (1 + BAND_PCT)).toFixed(2);

  return {
    quality_score: score,
    quality_badge: badge,
    quality_breakdown: breakdown,
    benchmark_price: benchmarkPrice,
    quality_multiplier: multiplier,
    fair_price: fairPrice,
    fair_price_low: fairPriceLow,
    fair_price_high: fairPriceHigh
  };
}

function groupBy(listings, key) {
  const map = {};
  for (const item of listings) {
    const bucket = item[key] ?? 'unknown';
    if (!map[bucket]) map[bucket] = [];
    map[bucket].push(item);
  }
  return map;
}

function filterListings(listings, filters = {}) {
  return listings.filter(l => {
    if (filters.project_type && l.project_type !== filters.project_type) return false;
    if (filters.quality_badge && l.quality_badge !== filters.quality_badge) return false;
    if (filters.registry && l.registry !== filters.registry) return false;
    if (filters.minPrice != null && l.fair_price < filters.minPrice) return false;
    if (filters.maxPrice != null && l.fair_price > filters.maxPrice) return false;
    return true;
  });
}

function computeAnomalyScore(listing) {
  let riskScore = 20;
  const vintage = Number(listing.vintage_year) || 2020;
  const vol = Number(listing.credits_issued) || 0;
  const status = String(listing.verification_status || '').toLowerCase();
  const reg = String(listing.registry || '').toLowerCase();
  const type = String(listing.project_type || '').toLowerCase();

  if (vintage < 2012) riskScore += 35;
  else if (vintage < 2017) riskScore += 20;

  if (status.includes('unverified') || status.includes('pending') || reg.includes('unregistered')) {
    riskScore += 28;
  }

  if (vol > 500000) riskScore += 18;
  else if (vol > 150000) riskScore += 10;

  if (type.includes('redd') || type.includes('avoidance')) riskScore += 15;
  if (type.includes('biochar') || type.includes('dac')) riskScore -= 10;

  riskScore = Math.min(95, Math.max(8, riskScore));
  const isAnomaly = riskScore >= 70;
  return { anomaly_risk_score: +riskScore.toFixed(1), is_anomaly: isAnomaly };
}

module.exports = {
  BENCHMARK_PRICES,
  normalizeProjectType,
  getBenchmarkPrice,
  calculateQualityScore,
  scoreToBadgeAndMultiplier,
  computeListingPricing,
  computeAnomalyScore,
  groupBy,
  filterListings
};