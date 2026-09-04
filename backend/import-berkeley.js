const path = require('path');
const XLSX = require('xlsx');
const pool = require('./db');
const { computeListingPricing } = require('./pricing');

const EXCEL_PATH = path.join(__dirname, 'data', 'berkeley-data.xlsx');
const BATCH_SIZE = 100;

const TYPE_MAP = {
  'REDD+': 'REDD+', 'Jurisdictional REDD+': 'REDD+',
  'Improved Forest Management': 'IFM',
  'Afforestation/Reforestation': 'ARR',
  'Biochar': 'Biochar', 'Enhanced Rock Weathering': 'ERW',
  'Direct Air Capture': 'DAC'
};

const GOOD_STANDING_STATUSES = new Set([
  'Completed', 'Registered', 'Listed', 'Gold Standard Certified Project',
  'Gold Standard Certified Design', 'validated'
]);
const RECOGNIZED_REGISTRIES = new Set(['Verra', 'ACR', 'CAR', 'ART', 'Gold Standard', 'ISO']);

function mapVerificationStatus(voluntaryStatus, registry) {
  const inGoodStanding = GOOD_STANDING_STATUSES.has(voluntaryStatus);
  const registryRecognized = RECOGNIZED_REGISTRIES.has(registry);
  return (inGoodStanding && registryRecognized) ? 'verified' : 'unverified';
}

function buildBatchInsert(batch) {
  const cols = 15;
  const valuesSql = batch.map((_, i) => {
    const base = i * cols;
    const placeholders = Array.from({ length: cols }, (_, j) => `$${base + j + 1}`).join(',');
    return `(${placeholders})`;
  }).join(',');

  const query = `
    INSERT INTO listings (
      project_name, project_type, registry, vintage_year, credits_issued,
      verification_status, methodology, quality_score, quality_badge,
      benchmark_price, quality_multiplier, fair_price, fair_price_low, fair_price_high, source
    ) VALUES ${valuesSql}
  `;

  const flatValues = batch.flatMap(l => [
    l.project_name, l.project_type, l.registry, l.vintage_year, l.credits_issued,
    l.verification_status, l.methodology, l.quality_score, l.quality_badge,
    l.benchmark_price, l.quality_multiplier, l.fair_price, l.fair_price_low,
    l.fair_price_high, l.source
  ]);

  return { query, flatValues };
}

async function main() {
  console.log('Reading Excel file:', EXCEL_PATH);
  const workbook = XLSX.readFile(EXCEL_PATH);
  const sheet = workbook.Sheets['PROJECTS'];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 3 });
  const headers = rows[0];

  const creditsIssuedIndex = headers.findIndex(h => h && h.toString().replace(/\s+/g, ' ').trim().startsWith('Total Credits'));

  const col = {
    projectName: headers.indexOf('Project Name'),
    registry: headers.indexOf('Voluntary Registry'),
    status: headers.indexOf('Voluntary Status'),
    type: headers.indexOf('Type'),
    methodology: headers.indexOf('Methodology / Protocol'),
    vintage: headers.indexOf('First Year of Project (Vintage)'),
    creditsIssued: creditsIssuedIndex
  };

  console.log('Column indices found:', col);
  console.log('Clearing old listings...');
  await pool.query('DELETE FROM listings');

  const toInsert = [];
  let skipped = 0;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row[col.projectName]) continue;

    const mappedType = TYPE_MAP[row[col.type]];
    if (!mappedType) { skipped++; continue; }

    const vintageYear = row[col.vintage];
    if (!vintageYear || typeof vintageYear !== 'number') { skipped++; continue; }

    const registry = row[col.registry] || 'unknown';
    const listingInput = {
      project_type: mappedType,
      registry,
      verification_status: mapVerificationStatus(row[col.status] || '', registry),
      methodology: row[col.methodology] || 'unknown',
      vintage_year: vintageYear
    };
    const pricing = computeListingPricing(listingInput);

    toInsert.push({
      project_name: row[col.projectName],
      project_type: mappedType,
      registry,
      vintage_year: vintageYear,
      credits_issued: row[col.creditsIssued] || 0,
      verification_status: listingInput.verification_status,
      methodology: listingInput.methodology,
      quality_score: pricing.quality_score,
      quality_badge: pricing.quality_badge,
      benchmark_price: pricing.benchmark_price,
      quality_multiplier: pricing.quality_multiplier,
      fair_price: pricing.fair_price,
      fair_price_low: pricing.fair_price_low,
      fair_price_high: pricing.fair_price_high,
      source: 'berkeley-vrod-2026-04'
    });
  }

  console.log(`Prepared ${toInsert.length} listings (skipped ${skipped}). Inserting in batches of ${BATCH_SIZE}...`);

  let totalInserted = 0;
  let failedBatches = 0;

  for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
    const batch = toInsert.slice(i, i + BATCH_SIZE);
    const { query, flatValues } = buildBatchInsert(batch);
    try {
      await pool.query(query, flatValues);
      totalInserted += batch.length;
      console.log(`Inserted ${totalInserted} / ${toInsert.length}`);
    } catch (err) {
      failedBatches++;
      console.error(`Batch starting at row ${i} FAILED: ${err.message}`);
      console.error('Sample row from failed batch:', JSON.stringify(batch[0]));
    }
  }

  console.log(`\nDone! ${totalInserted} listings imported. ${failedBatches} batch(es) failed.`);
  await pool.end();
}

main().catch(err => {
  console.error('Import failed:', err);
  process.exit(1);
});