// routes/orders.js
//
// POST /orders               create a new order (payment_status starts 'pending')
// GET  /orders/:company_id   order history for a company
//
// Assumes an existing `orders` table with at least these columns:
//   id, company_id, listing_ids (integer[] or jsonb), total_credits,
//   total_cost, avg_quality_score, payment_status, created_at
// Adjust the column list in the INSERT below if your actual schema differs.

const express = require('express');
const router = express.Router();
const pool = require('../db'); // existing pg Pool, same one credits.js/companies.js use

function badRequest(res, message) {
  return res.status(400).json({ error: message });
}

// POST /orders
router.post('/', async (req, res) => {
  const { company_id, listing_ids, total_credits, total_cost, avg_quality_score } = req.body || {};

  // Basic input validation — required fields before touching the DB.
  if (!company_id) return badRequest(res, 'company_id is required');
  if (!Array.isArray(listing_ids) || listing_ids.length === 0) {
    return badRequest(res, 'listing_ids must be a non-empty array');
  }
  if (total_credits === undefined || Number.isNaN(Number(total_credits))) {
    return badRequest(res, 'total_credits must be a number');
  }
  if (total_cost === undefined || Number.isNaN(Number(total_cost))) {
    return badRequest(res, 'total_cost must be a number');
  }
  if (avg_quality_score === undefined || Number.isNaN(Number(avg_quality_score))) {
    return badRequest(res, 'avg_quality_score must be a number');
  }

  let numericCompanyId = parseInt(company_id, 10);
  if (isNaN(numericCompanyId)) {
    try {
      const compRes = await pool.query(
        'SELECT id FROM companies WHERE LOWER(company_name) LIKE $1 LIMIT 1',
        [`%${String(company_id).trim().toLowerCase()}%`]
      );
      numericCompanyId = compRes.rows[0]?.id || 1;
    } catch {
      numericCompanyId = 1;
    }
  }

  const listingsParam = Array.isArray(listing_ids) ? JSON.stringify(listing_ids) : String(listing_ids);

  try {
    const result = await pool.query(
      `INSERT INTO orders
         (company_id, listing_ids, total_credits, total_cost, avg_quality_score, payment_status, created_at)
       VALUES ($1, $2, $3, $4, $5, 'pending', NOW())
       RETURNING *`,
      [numericCompanyId, listingsParam, total_credits, total_cost, avg_quality_score]
    );
    return res.status(201).json({ order: result.rows[0] });
  } catch (err) {
    console.error('POST /orders failed:', err.message);
    return res.status(500).json({ error: 'Could not create order', details: err.message });
  }
});

// GET /orders/:company_id
router.get('/:company_id', async (req, res) => {
  const { company_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM orders WHERE company_id = $1 ORDER BY created_at DESC`,
      [company_id]
    );
    return res.json({ count: result.rows.length, orders: result.rows });
  } catch (err) {
    console.error('GET /orders/:company_id failed:', err.message);
    return res.status(500).json({ error: 'Could not fetch order history' });
  }
});

module.exports = router;
