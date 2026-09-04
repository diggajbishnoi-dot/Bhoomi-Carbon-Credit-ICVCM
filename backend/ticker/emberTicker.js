const cron = require('node-cron');
const pool = require('../db');

const EMBER_API_URL = process.env.EMBER_API_URL;

async function insertPriceRecord(tier, label, price, currency) {
  await pool.query(
    `INSERT INTO price_index (tier, label, price, currency, project_type) VALUES ($1, $2, $3, $4, NULL)`,
    [tier, label, price, currency]
  );
}

async function fetchAndStoreEuEtsPrice() {
  try {
    console.log('Fetching EU ETS price from CBAM Guide API...');
    const response = await fetch(EMBER_API_URL);
    if (!response.ok) throw new Error(`API returned status ${response.status}`);
    const data = await response.json();
    const etsPrice = data?.ets?.price;
    if (etsPrice == null) throw new Error('No ETS price found in response');

    await insertPriceRecord('tier1-live', 'EU ETS (Source: CBAM Guide)', etsPrice, 'EUR');
    console.log(`Stored EU ETS price: €${etsPrice}/tCO2`);
  } catch (err) {
    console.warn('Live API unavailable, using fallback price:', err.message);
    await insertPriceRecord('tier1-fallback', 'EU ETS (manual fallback)', 75.00, 'EUR');
  }
}

function startEmberTicker() {
  fetchAndStoreEuEtsPrice();
  cron.schedule('0 * * * *', fetchAndStoreEuEtsPrice);
  console.log('EU ETS ticker started — polling hourly.');
}

module.exports = { startEmberTicker };