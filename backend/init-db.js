// init-db.js — runs schema.sql once against the Postgres database
// Run with: node init-db.js

const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function initDb() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  try {
    await pool.query(schema);
    console.log('Schema created successfully — listings, price_index, companies, orders tables ready.');
  } catch (err) {
    console.error('Schema creation failed:', err.message);
  } finally {
    await pool.end();
  }
}

initDb();