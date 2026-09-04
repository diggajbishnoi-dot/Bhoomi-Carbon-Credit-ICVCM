require('dotenv').config({ path: __dirname + '/../.env' });
const pool = require('../db');

async function fixAnomalies() {
  try {
    const res = await pool.query(
      'SELECT id, project_name, project_type, registry, vintage_year, credits_issued, verification_status FROM listings WHERE anomaly_risk_score IS NULL'
    );
    console.log(`Found ${res.rows.length} listings with NULL anomaly_risk_score`);

    for (const l of res.rows) {
      let score = 25;
      const v = Number(l.vintage_year) || 2020;
      if (v < 2012) score += 35;
      else if (v < 2016) score += 20;

      const status = String(l.verification_status || '').toLowerCase();
      if (status.includes('unverified') || status.includes('pending')) score += 30;

      const vol = Number(l.credits_issued) || 0;
      if (vol > 500000) score += 15;
      else if (vol > 100000) score += 10;

      score = Math.min(94, Math.max(12, score));
      const isAnom = score >= 70;

      await pool.query(
        'UPDATE listings SET anomaly_risk_score = $1, is_anomaly = $2 WHERE id = $3',
        [score, isAnom, l.id]
      );
      console.log(`Updated listing id=${l.id} (${l.project_name}): score=${score}, is_anomaly=${isAnom}`);
    }

    console.log('All NULL anomaly risk scores updated successfully.');
  } catch (err) {
    console.error('Error updating anomalies:', err);
  } finally {
    await pool.end();
  }
}

fixAnomalies();
