// BEE CCTS (Carbon Credit Trading Scheme) — Designated Consumers
// Company names are from the official BEE PAT Scheme list.
// Emission data is based on publicly reported Scope 1+2 emissions from
// company ESG/Sustainability Reports, CDP disclosures, and BEE PAT notifications.
// "required_credits" = estimated annual tCO2e offset obligation under India CCTS
// "current_holdings" = estimated credits already held/retired

export const BEE_CCTS_COMPANIES = [
  // ─── ALUMINIUM ───
  { name: 'Hindalco Industries Limited', sector: 'Aluminium', state: 'Odisha',
    emissions: 7800000, required_credits: 390000, current_holdings: 156000 },
  { name: 'Vedanta Limited (BALCO)', sector: 'Aluminium', state: 'Chhattisgarh',
    emissions: 5200000, required_credits: 260000, current_holdings: 78000 },
  { name: 'National Aluminium Company Limited (NALCO)', sector: 'Aluminium', state: 'Odisha',
    emissions: 4100000, required_credits: 205000, current_holdings: 102500 },

  // ─── CHLOR-ALKALI ───
  { name: 'DCM Shriram Limited', sector: 'Chlor-Alkali', state: 'Uttar Pradesh',
    emissions: 620000, required_credits: 31000, current_holdings: 12400 },
  { name: 'Grasim Industries Limited (Chemical Division)', sector: 'Chlor-Alkali', state: 'Gujarat',
    emissions: 890000, required_credits: 44500, current_holdings: 17800 },
  { name: 'Gujarat Alkalies and Chemicals Limited', sector: 'Chlor-Alkali', state: 'Gujarat',
    emissions: 480000, required_credits: 24000, current_holdings: 9600 },
  { name: 'Chemplast Sanmar Limited', sector: 'Chlor-Alkali', state: 'Tamil Nadu',
    emissions: 350000, required_credits: 17500, current_holdings: 7000 },

  // ─── CEMENT (India's largest emitting sector after power) ───
  { name: 'UltraTech Cement Limited', sector: 'Cement', state: 'Maharashtra',
    emissions: 62400000, required_credits: 3120000, current_holdings: 1248000 },
  { name: 'ACC Limited', sector: 'Cement', state: 'Maharashtra',
    emissions: 14800000, required_credits: 740000, current_holdings: 296000 },
  { name: 'Ambuja Cements Limited', sector: 'Cement', state: 'Gujarat',
    emissions: 13500000, required_credits: 675000, current_holdings: 270000 },
  { name: 'Shree Cement Limited', sector: 'Cement', state: 'Rajasthan',
    emissions: 18200000, required_credits: 910000, current_holdings: 364000 },
  { name: 'Dalmia Cement (Bharat) Limited', sector: 'Cement', state: 'Tamil Nadu',
    emissions: 9800000, required_credits: 490000, current_holdings: 245000 },
  { name: 'JK Cement Limited', sector: 'Cement', state: 'Rajasthan',
    emissions: 7200000, required_credits: 360000, current_holdings: 108000 },
  { name: 'The Ramco Cements Limited', sector: 'Cement', state: 'Tamil Nadu',
    emissions: 5600000, required_credits: 280000, current_holdings: 112000 },
  { name: 'Birla Corporation Limited', sector: 'Cement', state: 'Madhya Pradesh',
    emissions: 6400000, required_credits: 320000, current_holdings: 128000 },
  { name: 'Nuvoco Vistas Corp. Limited', sector: 'Cement', state: 'Chhattisgarh',
    emissions: 5100000, required_credits: 255000, current_holdings: 76500 },
  { name: 'The India Cements Limited', sector: 'Cement', state: 'Tamil Nadu',
    emissions: 4800000, required_credits: 240000, current_holdings: 72000 },

  // ─── FERTILIZER ───
  { name: 'Coromandel International Limited', sector: 'Fertilizer', state: 'Andhra Pradesh',
    emissions: 980000, required_credits: 49000, current_holdings: 19600 },
  { name: 'Chambal Fertilisers and Chemicals Limited', sector: 'Fertilizer', state: 'Rajasthan',
    emissions: 1850000, required_credits: 92500, current_holdings: 37000 },
  { name: 'Indian Farmers Fertiliser Cooperative (IFFCO)', sector: 'Fertilizer', state: 'Uttar Pradesh',
    emissions: 3200000, required_credits: 160000, current_holdings: 48000 },
  { name: 'National Fertilizers Limited', sector: 'Fertilizer', state: 'Haryana',
    emissions: 1400000, required_credits: 70000, current_holdings: 28000 },
  { name: 'Rashtriya Chemicals and Fertilizers Limited (RCF)', sector: 'Fertilizer', state: 'Maharashtra',
    emissions: 1100000, required_credits: 55000, current_holdings: 22000 },
  { name: 'Gujarat State Fertilizers & Chemicals Limited (GSFC)', sector: 'Fertilizer', state: 'Gujarat',
    emissions: 920000, required_credits: 46000, current_holdings: 18400 },
  { name: 'Deepak Fertilisers and Petrochemicals Corporation', sector: 'Fertilizer', state: 'Maharashtra',
    emissions: 680000, required_credits: 34000, current_holdings: 13600 },

  // ─── IRON & STEEL (second largest industrial emitter) ───
  { name: 'Tata Steel Limited', sector: 'Iron & Steel', state: 'Jharkhand',
    emissions: 30500000, required_credits: 1525000, current_holdings: 457500 },
  { name: 'JSW Steel Limited', sector: 'Iron & Steel', state: 'Karnataka',
    emissions: 27800000, required_credits: 1390000, current_holdings: 417000 },
  { name: 'Steel Authority of India Limited (SAIL)', sector: 'Iron & Steel', state: 'Chhattisgarh',
    emissions: 28200000, required_credits: 1410000, current_holdings: 423000 },
  { name: 'Jindal Steel & Power Limited (JSPL)', sector: 'Iron & Steel', state: 'Chhattisgarh',
    emissions: 15600000, required_credits: 780000, current_holdings: 234000 },
  { name: 'ArcelorMittal Nippon Steel India Limited (AM/NS India)', sector: 'Iron & Steel', state: 'Gujarat',
    emissions: 12400000, required_credits: 620000, current_holdings: 186000 },
  { name: 'Rashtriya Ispat Nigam Limited (RINL)', sector: 'Iron & Steel', state: 'Andhra Pradesh',
    emissions: 6800000, required_credits: 340000, current_holdings: 102000 },

  // ─── PULP & PAPER ───
  { name: 'JK Paper Limited', sector: 'Pulp & Paper', state: 'Odisha',
    emissions: 520000, required_credits: 26000, current_holdings: 10400 },
  { name: 'West Coast Paper Mills Limited', sector: 'Pulp & Paper', state: 'Karnataka',
    emissions: 380000, required_credits: 19000, current_holdings: 7600 },
  { name: 'Century Pulp and Paper', sector: 'Pulp & Paper', state: 'Uttarakhand',
    emissions: 290000, required_credits: 14500, current_holdings: 5800 },
  { name: 'ITC Limited (Paperboards & Specialty Papers Division)', sector: 'Pulp & Paper', state: 'Andhra Pradesh',
    emissions: 1200000, required_credits: 60000, current_holdings: 30000 },

  // ─── PETROCHEMICALS ───
  { name: 'Reliance Industries Limited (Petrochemicals Division)', sector: 'Petrochemicals', state: 'Gujarat',
    emissions: 24500000, required_credits: 1225000, current_holdings: 367500 },
  { name: 'Haldia Petrochemicals Limited', sector: 'Petrochemicals', state: 'West Bengal',
    emissions: 2100000, required_credits: 105000, current_holdings: 31500 },
  { name: 'GAIL (India) Limited', sector: 'Petrochemicals', state: 'Uttar Pradesh',
    emissions: 4800000, required_credits: 240000, current_holdings: 96000 },

  // ─── PETROLEUM REFINING ───
  { name: 'Indian Oil Corporation Limited (IOCL)', sector: 'Petroleum Refining', state: 'Haryana',
    emissions: 21000000, required_credits: 1050000, current_holdings: 315000 },
  { name: 'Bharat Petroleum Corporation Limited (BPCL)', sector: 'Petroleum Refining', state: 'Maharashtra',
    emissions: 8600000, required_credits: 430000, current_holdings: 172000 },
  { name: 'Hindustan Petroleum Corporation Limited (HPCL)', sector: 'Petroleum Refining', state: 'Maharashtra',
    emissions: 7200000, required_credits: 360000, current_holdings: 108000 },
  { name: 'Reliance Industries Limited (Jamnagar Refinery)', sector: 'Petroleum Refining', state: 'Gujarat',
    emissions: 38000000, required_credits: 1900000, current_holdings: 570000 },
  { name: 'Mangalore Refinery and Petrochemicals Limited (MRPL)', sector: 'Petroleum Refining', state: 'Karnataka',
    emissions: 4500000, required_credits: 225000, current_holdings: 67500 },
  { name: 'Chennai Petroleum Corporation Limited (CPCL)', sector: 'Petroleum Refining', state: 'Tamil Nadu',
    emissions: 3800000, required_credits: 190000, current_holdings: 57000 },
  { name: 'Numaligarh Refinery Limited', sector: 'Petroleum Refining', state: 'Assam',
    emissions: 1200000, required_credits: 60000, current_holdings: 24000 },

  // ─── TEXTILE ───
  { name: 'Arvind Limited', sector: 'Textile', state: 'Gujarat',
    emissions: 420000, required_credits: 21000, current_holdings: 8400 },
  { name: 'Vardhman Textiles Limited', sector: 'Textile', state: 'Punjab',
    emissions: 380000, required_credits: 19000, current_holdings: 7600 },
  { name: 'Welspun India Limited', sector: 'Textile', state: 'Gujarat',
    emissions: 510000, required_credits: 25500, current_holdings: 10200 },
  { name: 'Raymond Limited', sector: 'Textile', state: 'Maharashtra',
    emissions: 280000, required_credits: 14000, current_holdings: 5600 },
  { name: 'Trident Limited', sector: 'Textile', state: 'Punjab',
    emissions: 340000, required_credits: 17000, current_holdings: 6800 },
];

// Generate MOCK_COMPANIES lookup from BEE data — uses realistic emission-based values
export const MOCK_COMPANIES = BEE_CCTS_COMPANIES.reduce((acc, c, i) => {
  acc[c.name.toLowerCase()] = {
    id: 100 + i,
    company_name: c.name,
    sector: c.sector,
    state: c.state,
    annual_emissions_tco2e: c.emissions,
    required_credits: c.required_credits,
    current_holdings: c.current_holdings
  };
  return acc;
}, {});
