const express = require('express');
const router = express.Router();
const db = require('../db');
const { calculateQualityScore } = require('../pricing');

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-5';

async function callClaude(systemPrompt, userMessage) {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    })
  });
  if (!response.ok) {
    throw new Error(`Anthropic API error ${response.status}: ${await response.text()}`);
  }
  const data = await response.json();
  return data.content.map(b => b.text || '').join('\n').trim();
}

router.get('/explain-listing/:id', async (req, res) => {
  try {
    const listing = db.prepare('SELECT * FROM listings WHERE id = ?').get(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    const { score, breakdown } = calculateQualityScore(listing);

    const systemPrompt = `You explain carbon credit quality scores to non-expert buyers.
You are given a rule-based score and its breakdown - you do NOT decide the score,
only explain it in plain, honest, 3-4 sentence English. Do not invent facts not
present in the breakdown.`;

    const userMessage = `Project: ${listing.project_name}
Type: ${listing.project_type}, Registry: ${listing.registry}, Vintage: ${listing.vintage_year}
Final score: ${score}, Badge: ${listing.quality_badge}
Breakdown: ${JSON.stringify(breakdown)}

Explain this score to a buyer in plain English.`;

    const explanation = await callClaude(systemPrompt, userMessage);
    res.json({ listing_id: listing.id, score, badge: listing.quality_badge, breakdown, explanation });
  } catch (err) {
    console.error(err);
    // DEBUG MODE: sending the real error back so it's visible without hunting
    // through terminal scrollback. Remove "details" before final submission.
    res.status(500).json({ error: 'Failed to generate explanation', details: err.message });
  }
});

router.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'question is required' });

    const listings = db.prepare(
      'SELECT project_name, project_type, registry, vintage_year, quality_badge, fair_price FROM listings LIMIT 30'
    ).all();

    const systemPrompt = `You answer questions about carbon credit listings using ONLY
the data provided below. If the data doesn't contain the answer, say so - never
guess or make up project details.

Listings data:
${JSON.stringify(listings)}`;

    const answer = await callClaude(systemPrompt, question);
    res.json({ question, answer });
  } catch (err) {
    console.error(err);
    // DEBUG MODE: sending the real error back so it's visible without hunting
    // through terminal scrollback. Remove "details" before final submission.
    res.status(500).json({ error: 'Failed to answer question', details: err.message });
  }
});

module.exports = router;