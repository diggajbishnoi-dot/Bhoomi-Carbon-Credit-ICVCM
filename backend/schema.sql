-- Core listings table (same fields, PostgreSQL syntax)
CREATE TABLE IF NOT EXISTS listings (
    id                  SERIAL PRIMARY KEY,
    project_name        TEXT NOT NULL DEFAULT 'Unnamed Project',
    project_type        TEXT NOT NULL,
    registry             TEXT NOT NULL,
    vintage_year        INTEGER NOT NULL,
    credits_issued       INTEGER NOT NULL DEFAULT 0,
    verification_status  TEXT NOT NULL DEFAULT 'unverified',
    methodology          TEXT DEFAULT 'unknown',
    quality_score         INTEGER NOT NULL DEFAULT 0,
    quality_badge         TEXT NOT NULL DEFAULT 'red',
    benchmark_price       REAL NOT NULL DEFAULT 0,
    quality_multiplier    REAL NOT NULL DEFAULT 1.0,
    fair_price             REAL NOT NULL DEFAULT 0,
    fair_price_low         REAL NOT NULL DEFAULT 0,
    fair_price_high        REAL NOT NULL DEFAULT 0,
    listed_price           REAL,
    source                 TEXT DEFAULT 'seed',
    anomaly_risk_score      REAL DEFAULT NULL,
    is_anomaly              BOOLEAN DEFAULT FALSE,
    created_at              TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS price_index (
    id            SERIAL PRIMARY KEY,
    tier          TEXT NOT NULL,
    label         TEXT NOT NULL,
    price         REAL NOT NULL,
    currency      TEXT NOT NULL DEFAULT 'USD',
    project_type  TEXT,
    fetched_at    TIMESTAMP DEFAULT NOW()
);

-- NEW: Companies table (for buyer flow — BEE CCTS data will go here)
CREATE TABLE IF NOT EXISTS companies (
    id                    SERIAL PRIMARY KEY,
    company_name          TEXT NOT NULL,
    sector                TEXT,
    required_credits      INTEGER DEFAULT 0,
    current_holdings      INTEGER DEFAULT 0,
    compliance_deadline   DATE,
    source                TEXT DEFAULT 'manual',
    created_at             TIMESTAMP DEFAULT NOW()
);

-- NEW: Orders table (for optimizer purchase results, sandbox payment status)
CREATE TABLE IF NOT EXISTS orders (
    id                SERIAL PRIMARY KEY,
    company_id         INTEGER REFERENCES companies(id),
    listing_ids         TEXT,  -- JSON array stored as text
    total_credits        INTEGER,
    total_cost            REAL,
    avg_quality_score      REAL,
    payment_status         TEXT DEFAULT 'pending',
    created_at              TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(project_type);
CREATE INDEX IF NOT EXISTS idx_listings_badge ON listings(quality_badge);
CREATE INDEX IF NOT EXISTS idx_price_index_tier ON price_index(tier);
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(company_name);