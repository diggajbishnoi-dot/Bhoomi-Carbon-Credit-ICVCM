const fs = require('fs');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const envFile = fs.readFileSync('.env', 'utf-8');
let key = '';
for (const line of envFile.split('\n')) {
  if (line.startsWith('GOOGLE_API_KEY=')) key = line.replace('GOOGLE_API_KEY=', '').trim();
}

async function test() {
  const t0 = Date.now();
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'what is carbon credit? Answer in 1 sentence.' }] }]
      })
    });
    const data = await res.json();
    console.log(`Status ${res.status} in ${Date.now() - t0}ms:`);
    console.log('Answer:', data.candidates?.[0]?.content?.parts?.[0]?.text);
  } catch (e) {
    console.log(`Failed in ${Date.now() - t0}ms:`, e.message);
  }
}

test();
