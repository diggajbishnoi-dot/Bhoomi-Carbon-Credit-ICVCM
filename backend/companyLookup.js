const Anthropic = require('@anthropic-ai/sdk');
const pool = require('./db');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function searchAndExtractCompanyData(companyName) {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{
        role: 'user',
        content: `Search for "${companyName}" carbon credit requirement, CCTS obligation, or emissions reduction target in India. Based on what you find, respond ONLY with this JSON (no other text): {"sector": "...", "required_credits": <number, your best estimate>, "current_holdings": <number, 0 if unknown>, "confidence": "low|medium|high", "source_note": "brief note on where this estimate came from"}`
      }]
    });

    const textBlock = response.content.find(b => b.type === 'text');
    if (!textBlock) return null;

    const extracted = JSON.parse(textBlock.text);

    await pool.query(
      `INSERT INTO companies (company_name, sector, required_credits, current_holdings, source)
       VALUES ($1, $2, $3, $4, 'ai-estimated')`,
      [companyName, extracted.sector, extracted.required_credits, extracted.current_holdings]
    );

    return { ...extracted, company_name: companyName, source: 'ai-estimated' };

  } catch (err) {
    // Handles: credits exhausted, rate limits, malformed JSON, network errors —
    // all fail gracefully instead of crashing the server.
    console.error('AI company lookup failed:', err.message);
    return null;
  }
}

module.exports = { searchAndExtractCompanyData };