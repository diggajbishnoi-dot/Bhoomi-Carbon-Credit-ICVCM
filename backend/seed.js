// seed.js — inserts a few sample listings so we have data to query.
// Run this ONCE with: npm run seed

const db = require('./db');
const { computeListingPricing } = require('./pricing');

const sampleListings = [
  {
    project_name: 'Amazon REDD+ Conservation',
    project_type: 'REDD+',
    registry: 'Verra',
    vintage_year: 2019,
    credits_issued: 50000,
    verification_status: 'unverified',
    methodology: 'unknown'
  },
  {
    project_name: 'India Biochar Initiative',
    project_type: 'Biochar',
    registry: 'Verra',
    vintage_year: 2024,
    credits_issued: 5000,
    verification_status: 'verified',
    methodology: 'biochar-carbon-removal'
  },
  {
    project_name: 'Iceland Direct Air Capture',
    project_type: 'DAC',
    registry: 'Gold Standard',
    vintage_year: 2025,
    credits_issued: 1000,
    verification_status: 'verified',
    methodology: 'dac-permanent-storage'
  }
];

const insertStmt = db.prepare(`
  INSERT INTO listings (
    project_name, project_type, registry, vintage_year, credits_issued,
    verification_status, methodology, quality_score, quality_badge,
    benchmark_price, quality_multiplier, fair_price, fair_price_low, fair_price_high, source
  ) VALUES (
    @project_name, @project_type, @registry, @vintage_year, @credits_issued,
    @verification_status, @methodology, @quality_score, @quality_badge,
    @benchmark_price, @quality_multiplier, @fair_price, @fair_price_low, @fair_price_high, @source
  )
`);

console.log('Seeding database...');

sampleListings.forEach(listing => {
  const pricing = computeListingPricing(listing);

  insertStmt.run({
    ...listing,
    quality_score: pricing.quality_score,
    quality_badge: pricing.quality_badge,
    benchmark_price: pricing.benchmark_price,
    quality_multiplier: pricing.quality_multiplier,
    fair_price: pricing.fair_price,
    fair_price_low: pricing.fair_price_low,
    fair_price_high: pricing.fair_price_high,
    source: 'seed'
  });

  console.log(`Inserted: ${listing.project_name} | Score: ${pricing.quality_score} | Badge: ${pricing.quality_badge} | Fair Price: $${pricing.fair_price}`);
});

console.log('Seeding complete!');