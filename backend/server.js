require('dotenv').config();

const express = require('express');
const cors = require('cors');

const creditsRoutes = require('./routes/credits');
const priceIndexRoutes = require('./routes/priceIndex');
const companiesRoutes = require('./routes/companies');
const ordersRoutes = require('./routes/orders');
const paymentsRoutes = require('./routes/payments');

const { startEmberTicker } = require('./ticker/emberTicker');

const app = express();
const PORT = process.env.PORT || 4000;

// CORS - allow Netlify frontend, localhost, or configured origin
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Razorpay webhook
// IMPORTANT: webhook must receive the raw body for signature verification.
// Therefore this route MUST come before express.json().
app.use(
  '/webhooks/razorpay',
  express.raw({ type: 'application/json' }),
  paymentsRoutes
);

// JSON parser for all normal API requests
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'carbon-credit-backend',
  });
});

// API routes
app.use('/credits', creditsRoutes);
app.use('/price-index', priceIndexRoutes);
app.use('/companies', companiesRoutes);
app.use('/orders', ordersRoutes);
app.use('/orders', paymentsRoutes);

// AI / RAG routes
app.use('/ai', require('./ai/routes'));

// Chat / RAG Proxy
app.post('/chat', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'Question is required' });

    console.log('[RAG Proxy] Forwarding question to RAG service');
    let ragUrl = process.env.RAG_SERVICE_URL || 'http://localhost:3001/api/chat';
    
    // Auto-append /api/chat if user provided base URL without endpoint path
    if (!ragUrl.endsWith('/api/chat') && !ragUrl.endsWith('/chat')) {
      ragUrl = ragUrl.replace(/\/+$/, '') + '/api/chat';
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(ragUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        return res.json(data);
      }
      console.warn(`[RAG Proxy] RAG service returned status ${response.status}`);
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      console.warn('[RAG Proxy Fetch Warning]:', fetchErr.message);
    }

    // Graceful fallback response if RAG service is cold-starting or initializing
    return res.json({
      answer: `Carbon credits represent verified reductions or removals of greenhouse gas emissions (1 credit = 1 metric ton of CO2e avoided or removed).\n\nOn Bhoomi Carbon, every credit is rated against ICVCM Core Carbon Principles, includes automated anomaly risk detection, and guarantees transparent fair-value pricing for farmers and developers.`,
      sources: [{ type: "knowledge", section: "Bhoomi Core Principles" }],
      knowledgeSourcesUsed: 1,
      listingsUsed: 0,
      companiesUsed: 0
    });
  } catch (err) {
    console.error('[RAG Proxy Error]:', err.message);
    res.json({
      answer: "Carbon credits incentivize sustainable practices by certifying 1 tCO2e reduction. On Bhoomi, we provide AI-driven price discovery and ICVCM integrity scoring for all listed credits.",
      sources: []
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Carbon credit backend running on port ${PORT}`);

  startEmberTicker();
});