import { Router } from 'express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = Router();
const __dirname = dirname(fileURLToPath(import.meta.url));
const battles = JSON.parse(readFileSync(join(__dirname, '../data/battles.json'), 'utf-8'));

const ANTHROPIC_BASE_URL = process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com';
const API_KEY = process.env.ANTHROPIC_API_KEY || '';

function authHeaders() {
  if (API_KEY.startsWith('sk-ant-si-')) {
    return { Authorization: `Bearer ${API_KEY}` };
  }
  return { 'x-api-key': API_KEY };
}

async function callClaude(system, userMessage) {
  const res = await fetch(`${ANTHROPIC_BASE_URL}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
      ...authHeaders(),
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.content[0].text;
}

const SYSTEM_PROMPT = `You are a careful historian reasoning through alternate history. The user has selected a real historical event and changed one variable. You must:
1. State the change clearly in one sentence.
2. Describe the immediate military and political consequences (next 6 months) in 3-4 sentences, grounded in real historical context.
3. Describe ripple effects over the following 5-10 years in 3-4 sentences.
4. Describe long-term consequences (decades) in 2-3 sentences.
5. Note what likely stayed the same anyway — historical inertia is real.
6. End with a Plausibility Score from 1-10 with one line of justification.
Be rigorous, not fanciful. No fantasy, no magical thinking. Stay grounded in geopolitics, logistics, and human behavior of that era.

Format your response with these exact section headers:
## The Change
## Immediate Consequences (0–6 months)
## Ripple Effects (5–10 years)
## Long-term Consequences (decades)
## What Stayed the Same
## Plausibility Score`;

function parseResponse(text) {
  const sections = {
    change: '',
    immediate: '',
    ripple: '',
    longterm: '',
    inertia: '',
    plausibility: '',
    raw: text,
  };

  const extract = (header, nextHeaders) => {
    const pattern = new RegExp(
      `##\\s*${header}\\s*\\n([\\s\\S]*?)(?=\\n##\\s*(?:${nextHeaders.join('|')})|$)`,
      'i'
    );
    const m = text.match(pattern);
    return m ? m[1].trim() : '';
  };

  sections.change = extract('The Change', [
    'Immediate Consequences',
    'Ripple Effects',
    'Long-term Consequences',
    'What Stayed',
    'Plausibility',
  ]);
  sections.immediate = extract('Immediate Consequences[^\\n]*', [
    'Ripple Effects',
    'Long-term Consequences',
    'What Stayed',
    'Plausibility',
  ]);
  sections.ripple = extract('Ripple Effects[^\\n]*', [
    'Long-term Consequences',
    'What Stayed',
    'Plausibility',
  ]);
  sections.longterm = extract('Long-term Consequences[^\\n]*', ['What Stayed', 'Plausibility']);
  sections.inertia = extract('What Stayed[^\\n]*', ['Plausibility']);
  sections.plausibility = extract('Plausibility Score[^\\n]*', []);

  return sections;
}

router.post('/', async (req, res) => {
  const { battleId, variableId } = req.body;

  if (!battleId || !variableId) {
    return res.status(400).json({ error: 'battleId and variableId are required' });
  }

  const battle = battles.find((b) => b.id === battleId);
  if (!battle) return res.status(404).json({ error: 'Battle not found' });

  const variable = battle.variables.find((v) => v.id === variableId);
  if (!variable) return res.status(404).json({ error: 'Variable not found' });

  const userMessage = `Battle: ${battle.name} (${battle.year}). Original outcome: ${battle.summary} Change: ${variable.label}.`;

  const rawText = await callClaude(SYSTEM_PROMPT, userMessage);
  const parsed = parseResponse(rawText);

  res.json({
    battleId,
    variableId,
    battleName: battle.name,
    variableLabel: variable.label,
    sections: parsed,
  });
});

export default router;
