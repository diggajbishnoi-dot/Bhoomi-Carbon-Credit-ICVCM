const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf-8');
let key = '';
for (const line of envFile.split('\n')) {
  if (line.startsWith('GOOGLE_API_KEY=')) key = line.replace('GOOGLE_API_KEY=', '').trim();
}

async function test() {
  const models = ['gemini-flash-latest', 'gemini-3.6-flash', 'gemini-3.5-flash'];
  for (const m of models) {
    const t0 = Date.now();
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'what is carbon credit? Answer in 2 sentences in simple English.' }] }]
        })
      });
      const data = await res.json();
      console.log(`[${m}] Status ${res.status} in ${Date.now() - t0}ms:`);
      if (data.error) {
        console.log('Error:', data.error.message);
      } else {
        console.log('Answer:', data.candidates?.[0]?.content?.parts?.[0]?.text);
      }
    } catch (e) {
      console.log(`[${m}] Failed in ${Date.now() - t0}ms:`, e.message);
    }
  }
}

test();
