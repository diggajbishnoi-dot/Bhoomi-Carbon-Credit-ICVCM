require('dotenv').config({ path: './backend/.env' });
const pool = require('./backend/db');

async function check() {
  try {
    const total = await pool.query('SELECT count(*) FROM listings');
    const withScore = await pool.query('SELECT count(*) FROM listings WHERE anomaly_risk_score IS NOT NULL');
    const anomalies = await pool.query('SELECT count(*) FROM listings WHERE is_anomaly = true');
    const sample = await pool.query('SELECT id, project_name, anomaly_risk_score, is_anomaly FROM listings LIMIT 10');
    
    console.log('Total listings:', total.rows[0].count);
    console.log('Listings with anomaly_risk_score IS NOT NULL:', withScore.rows[0].count);
    console.log('Listings with is_anomaly = true:', anomalies.rows[0].count);
    console.log('Sample:');
    console.log(sample.rows);
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

check();
