// seeds/seed-bee-ccts-companies.js
//
// Seeds real, publicly-known obligated entities under India's Carbon Credit
// Trading Scheme (CCTS), across all 9 BEE-notified sectors:
// Aluminium, Chlor-Alkali, Cement, Fertilizer, Iron & Steel, Pulp & Paper,
// Petrochemicals, Petroleum Refining, Textile.
//
// NOTE: BEE's official notification lists individual *installations* (plants),
// not just parent companies, and exact per-entity GHG intensity targets are
// published per compliance cycle (not a single stable public dataset). This
// seed uses real, well-known obligated companies per sector as a practical
// baseline for the app. Exact GEI targets can be refreshed later from the
// official BEE gazette notification without touching this script's shape.
//
// Does NOT touch companyLookup.js — that AI-fallback path stays untouched
// and still runs for any company not in this seed list.
//
// Run: node seeds/seed-bee-ccts-companies.js

require('dotenv').config();
const { Pool } = require('pg');

function normalizeConnectionString(url) {
  if (!url) return url;
  if (url.includes('sslmode=')) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}sslmode=require`;
}

const pool = new Pool({
  connectionString: normalizeConnectionString(process.env.DATABASE_URL),
  ssl: { rejectUnauthorized: false },
});

const BEE_CCTS_COMPANIES = [
  // --- Aluminium ---
  { name: 'Hindalco Industries Limited', sector: 'Aluminium', state: 'Odisha' },
  { name: 'Vedanta Limited (BALCO)', sector: 'Aluminium', state: 'Chhattisgarh' },
  { name: 'National Aluminium Company Limited (NALCO)', sector: 'Aluminium', state: 'Odisha' },

  // --- Chlor-Alkali ---
  { name: 'DCM Shriram Limited', sector: 'Chlor-Alkali', state: 'Uttar Pradesh' },
  { name: 'Grasim Industries Limited (Chemical Division)', sector: 'Chlor-Alkali', state: 'Gujarat' },
  { name: 'Gujarat Alkalies and Chemicals Limited', sector: 'Chlor-Alkali', state: 'Gujarat' },
  { name: 'Chemplast Sanmar Limited', sector: 'Chlor-Alkali', state: 'Tamil Nadu' },

  // --- Cement ---
  { name: 'UltraTech Cement Limited', sector: 'Cement', state: 'Maharashtra' },
  { name: 'ACC Limited', sector: 'Cement', state: 'Maharashtra' },
  { name: 'Ambuja Cements Limited', sector: 'Cement', state: 'Gujarat' },
  { name: 'Shree Cement Limited', sector: 'Cement', state: 'Rajasthan' },
  { name: 'Dalmia Cement (Bharat) Limited', sector: 'Cement', state: 'Tamil Nadu' },
  { name: 'JK Cement Limited', sector: 'Cement', state: 'Rajasthan' },
  { name: 'The Ramco Cements Limited', sector: 'Cement', state: 'Tamil Nadu' },
  { name: 'Birla Corporation Limited', sector: 'Cement', state: 'Madhya Pradesh' },
  { name: 'Nuvoco Vistas Corp. Limited', sector: 'Cement', state: 'Chhattisgarh' },
  { name: 'The India Cements Limited', sector: 'Cement', state: 'Tamil Nadu' },

  // --- Fertilizer ---
  { name: 'Coromandel International Limited', sector: 'Fertilizer', state: 'Andhra Pradesh' },
  { name: 'Chambal Fertilisers and Chemicals Limited', sector: 'Fertilizer', state: 'Rajasthan' },
  { name: 'Indian Farmers Fertiliser Cooperative (IFFCO)', sector: 'Fertilizer', state: 'Uttar Pradesh' },
  { name: 'National Fertilizers Limited', sector: 'Fertilizer', state: 'Haryana' },
  { name: 'Rashtriya Chemicals and Fertilizers Limited (RCF)', sector: 'Fertilizer', state: 'Maharashtra' },
  { name: 'Gujarat State Fertilizers & Chemicals Limited (GSFC)', sector: 'Fertilizer', state: 'Gujarat' },
  { name: 'Deepak Fertilisers and Petrochemicals Corporation', sector: 'Fertilizer', state: 'Maharashtra' },

  // --- Iron & Steel ---
  { name: 'Tata Steel Limited', sector: 'Iron & Steel', state: 'Jharkhand' },
  { name: 'JSW Steel Limited', sector: 'Iron & Steel', state: 'Karnataka' },
  { name: 'Steel Authority of India Limited (SAIL)', sector: 'Iron & Steel', state: 'Chhattisgarh' },
  { name: 'Jindal Steel & Power Limited (JSPL)', sector: 'Iron & Steel', state: 'Chhattisgarh' },
  { name: 'ArcelorMittal Nippon Steel India Limited (AM/NS India)', sector: 'Iron & Steel', state: 'Gujarat' },
  { name: 'Rashtriya Ispat Nigam Limited (RINL)', sector: 'Iron & Steel', state: 'Andhra Pradesh' },

  // --- Pulp & Paper ---
  { name: 'JK Paper Limited', sector: 'Pulp & Paper', state: 'Odisha' },
  { name: 'West Coast Paper Mills Limited', sector: 'Pulp & Paper', state: 'Karnataka' },
  { name: 'Century Pulp and Paper', sector: 'Pulp & Paper', state: 'Uttarakhand' },
  { name: 'ITC Limited (Paperboards & Specialty Papers Division)', sector: 'Pulp & Paper', state: 'Andhra Pradesh' },

  // --- Petrochemicals ---
  { name: 'Reliance Industries Limited (Petrochemicals Division)', sector: 'Petrochemicals', state: 'Gujarat' },
  { name: 'Haldia Petrochemicals Limited', sector: 'Petrochemicals', state: 'West Bengal' },
  { name: 'GAIL (India) Limited', sector: 'Petrochemicals', state: 'Uttar Pradesh' },

  // --- Petroleum Refining ---
  { name: 'Indian Oil Corporation Limited (IOCL)', sector: 'Petroleum Refining', state: 'Haryana' },
  { name: 'Bharat Petroleum Corporation Limited (BPCL)', sector: 'Petroleum Refining', state: 'Maharashtra' },
  { name: 'Hindustan Petroleum Corporation Limited (HPCL)', sector: 'Petroleum Refining', state: 'Maharashtra' },
  { name: 'Reliance Industries Limited (Jamnagar Refinery)', sector: 'Petroleum Refining', state: 'Gujarat' },
  { name: 'Mangalore Refinery and Petrochemicals Limited (MRPL)', sector: 'Petroleum Refining', state: 'Karnataka' },
  { name: 'Chennai Petroleum Corporation Limited (CPCL)', sector: 'Petroleum Refining', state: 'Tamil Nadu' },
  { name: 'Numaligarh Refinery Limited', sector: 'Petroleum Refining', state: 'Assam' },

  // --- Textile ---
  { name: 'Arvind Limited', sector: 'Textile', state: 'Gujarat' },
  { name: 'Vardhman Textiles Limited', sector: 'Textile', state: 'Punjab' },
  { name: 'Welspun India Limited', sector: 'Textile', state: 'Gujarat' },
  { name: 'Raymond Limited', sector: 'Textile', state: 'Maharashtra' },
  { name: 'Trident Limited', sector: 'Textile', state: 'Punjab' },
];

const SOURCE_TAG = 'BEE_CCTS_SEED';

async function getExistingColumns(client) {
  const res = await client.query(
    `SELECT column_name FROM information_schema.columns WHERE table_name = 'companies'`
  );
  return new Set(res.rows.map((r) => r.column_name));
}

async function seed() {
  const client = await pool.connect();
  try {
    const cols = await getExistingColumns(client);
    if (cols.size === 0) {
      throw new Error("companies table not found (or has no columns) — run existing schema setup first");
    }

    // Figure out which column actually holds the company name — schemas vary.
    const NAME_COLUMN_CANDIDATES = ['name', 'company_name', 'companyName', 'company', 'entity_name'];
    const nameColumn = NAME_COLUMN_CANDIDATES.find((c) => cols.has(c));
    if (!nameColumn) {
      console.error('Available companies columns:', [...cols].join(', '));
      throw new Error(
        "could not find a name-like column (checked: " + NAME_COLUMN_CANDIDATES.join(', ') + "). " +
        "See the column list printed above and adjust NAME_COLUMN_CANDIDATES."
      );
    }

    // Figure out which column holds sector — schemas vary here too.
    const SECTOR_COLUMN_CANDIDATES = ['sector', 'industry', 'category'];
    const sectorColumn = SECTOR_COLUMN_CANDIDATES.find((c) => cols.has(c));

    // Build the row for each company using only columns that actually exist,
    // so this never conflicts with whatever schema is already in place.
    const candidateFields = {
      [nameColumn]: (c) => c.name,
      ...(sectorColumn ? { [sectorColumn]: (c) => c.sector } : {}),
      state: (c) => c.state,
      is_ccts_obligated: () => true,
      source: () => SOURCE_TAG,
      created_at: () => new Date(),
    };

    const usableFields = Object.keys(candidateFields).filter((f) => cols.has(f));

    let inserted = 0;
    let skipped = 0;

    await client.query('BEGIN');

    for (const company of BEE_CCTS_COMPANIES) {
      const columnNames = usableFields;
      const values = columnNames.map((f) => candidateFields[f](company));
      const placeholders = columnNames.map((_, i) => `$${i + 1}`).join(', ');

      const sql = `
        INSERT INTO companies (${columnNames.join(', ')})
        VALUES (${placeholders})
      `;

      try {
        const exists = await client.query(
          `SELECT 1 FROM companies WHERE ${nameColumn} = $1`,
          [company.name]
        );
        if (exists.rowCount === 0) {
          await client.query(sql, values);
          inserted++;
        } else {
          skipped++;
        }
      } catch (err) {
        throw err;
      }
    }

    await client.query('COMMIT');
    console.log(`BEE CCTS seed complete: ${inserted} inserted, ${skipped} already present.`);
    console.log(`Columns used: ${usableFields.join(', ')}`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();