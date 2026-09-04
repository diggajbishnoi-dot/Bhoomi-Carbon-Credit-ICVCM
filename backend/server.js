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

// Chat / RAG Proxy to Python Service
app.post('/chat', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'Question is required' });

    console.log('[RAG Proxy] Forwarding question to Python/RAG service');
    const ragUrl = process.env.RAG_SERVICE_URL || 'http://localhost:3001/api/chat';
    const response = await fetch(ragUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });
    
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Python service returned ${response.status}: ${errText}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('[RAG Proxy Error]:', err.message);
    res.status(500).json({ 
      error: 'Failed to reach the AI knowledge base. Make sure the Python service is running on port 3001.',
      details: err.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Carbon credit backend running on port ${PORT}`);

  startEmberTicker();
});