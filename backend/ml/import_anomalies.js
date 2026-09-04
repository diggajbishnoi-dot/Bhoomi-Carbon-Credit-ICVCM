const fs = require('fs');
const path = require('path');
const pool = require('../db');

const RESULTS_PATH = path.join(__dirname, 'anomaly_results.json');
const results = JSON.parse(fs.readFileSync(RESULTS_PATH, 'utf8'));

async function main() {
  let matched = 0;
  for (const row of results) {
    const result = await pool.query(
      `UPDATE listings SET anomaly_risk_score = $1, is_anomaly = $2
       WHERE project_name = $3 AND registry = $4 AND vintage_year = $5`,
      [row.anomaly_risk_score, row.is_anomaly, row.project_name, row.registry, row.vintage_year]
    );
    if (result.rowCount > 0) matched++;
  }
  console.log(`Updated ${matched} of ${results.length} listings.`);
  await pool.end();
}

main();