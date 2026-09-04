// seed-companies.js — inserts sample companies for testing the optimizer.
// Real BEE CCTS data will replace/extend this later.

const pool = require('./db');

const sampleCompanies = [
  { company_name: 'Reliance Industries', sector: 'Oil & Gas', required_credits: 10000, current_holdings: 200 },
  { company_name: 'Tata Steel', sector: 'Steel', required_credits: 25000, current_holdings: 5000 },
  { company_name: 'JSW Energy', sector: 'Power', required_credits: 15000, current_holdings: 1000 }
];

async function seedCompanies() {
  for (const c of sampleCompanies) {
    await pool.query(
      `INSERT INTO companies (company_name, sector, required_credits, current_holdings, source)
       VALUES ($1, $2, $3, $4, 'sample-data')`,
      [c.company_name, c.sector, c.required_credits, c.current_holdings]
    );
    console.log(`Inserted: ${c.company_name}`);
  }
  console.log('Done seeding companies.');
  await pool.end();
}

seedCompanies();