const express = require('express');
const router = express.Router();
const pool = require('../db');
const { filterListings, computeListingPricing, computeAnomalyScore } = require('../pricing');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM listings ORDER BY created_at DESC');
    let listings = result.rows;
    listings = filterListings(listings, {
      project_type: req.query.project_type,
      quality_badge: req.query.quality_badge,
      registry: req.query.registry
    });
    if (req.query.is_anomaly === 'true') {
      listings = listings.filter(l => l.is_anomaly === true || (l.anomaly_risk_score && l.anomaly_risk_score >= 70));
    }
    res.json({ count: listings.length, listings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

router.post('/list-credit', async (req, res) => {
  try {
    const input = req.body;
    const pricing = computeListingPricing(input);
    const anomaly = computeAnomalyScore(input);

    const insertQuery = `
      INSERT INTO listings (project_name, project_type, registry, vintage_year,
        credits_issued, verification_status, methodology, quality_score,
        quality_badge, benchmark_price, quality_multiplier, fair_price,
        fair_price_low, fair_price_high, anomaly_risk_score, is_anomaly, source)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,'user-submitted')
      RETURNING id
    `;
    const values = [
      input.project_name, input.project_type, input.registry, input.vintage_year,
      input.credits_issued, input.verification_status, input.methodology,
      pricing.quality_score, pricing.quality_badge, pricing.benchmark_price,
      pricing.quality_multiplier, pricing.fair_price, pricing.fair_price_low,
      pricing.fair_price_high, anomaly.anomaly_risk_score, anomaly.is_anomaly
    ];
    const result = await pool.query(insertQuery, values);
    res.json({ success: true, id: result.rows[0].id, pricing, anomaly });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add listing' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM listings WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json({ success: true, deleted_id: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

module.exports = router;