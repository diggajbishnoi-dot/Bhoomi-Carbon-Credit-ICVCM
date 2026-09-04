const express = require('express');
const router = express.Router();
const pool = require('../db');
const { optimizePortfolio } = require('../optimizer');

// GET /companies/:name — find a company by name (case-insensitive partial match)
router.get('/:name', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM companies WHERE company_name ILIKE $1 LIMIT 1`,
      [`%${req.params.name}%`]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

// POST /companies/optimize — { company_name } -> gap + optimized purchase plan
router.post('/optimize', async (req, res) => {
  try {
    const companyResult = await pool.query(
      `SELECT * FROM companies WHERE company_name ILIKE $1 LIMIT 1`,
      [`%${req.body.company_name}%`]
    );
   if (companyResult.rows.length === 0) {
  const { searchAndExtractCompanyData } = require('../companyLookup');
  const estimated = await searchAndExtractCompanyData(req.body.company_name);

  if (!estimated) {
    return res.status(404).json({
      error: 'Company not found in our database, and AI lookup was unavailable. Try a different company name or add it manually.'
    });
  }

  return res.json({
    company: estimated,
    note: 'This company was not in our verified database — data shown is AI-estimated from public sources and should be independently verified.',
    gap: estimated.required_credits - estimated.current_holdings
  });
}
    const company = companyResult.rows[0];
    const gap = company.required_credits - company.current_holdings;

    if (gap <= 0) {
      return res.json({ company, gap: 0, message: 'Company already meets its requirement.' });
    }

    const listingsResult = await pool.query('SELECT * FROM listings');
    const optimization = optimizePortfolio(listingsResult.rows, gap);

    res.json({ company, gap, optimization });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Optimization failed' });
  }
});

module.exports = router;