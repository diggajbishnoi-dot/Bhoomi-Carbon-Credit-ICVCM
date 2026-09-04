const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM price_index ORDER BY fetched_at DESC');
    res.json({ count: result.rows.length, price_index: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch price index' });
  }
});

module.exports = router;