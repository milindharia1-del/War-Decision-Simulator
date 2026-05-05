import { Router } from 'express';

const router = Router();

const ANTHROPIC_BASE_URL = process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com';
const API_KEY = process.env.ANTHROPIC_API_KEY || '';

function authHeaders() {
  if (API_KEY.startsWith('sk-ant-si-')) {
    return { Authorization: `Bearer ${API_KEY}` };
  }
  return { 'x-api-key': API_KEY };
}

router.post('/', async (req, res) => {
  const { battleId, variableId, battleName, variableLabel, simulationSummary, question, conversationHistory } = req.body;

  if (!question || !battleId) {
    return res.status(400).json({ error: 'question and battleId are required.' });
  }

  const system = `You are a historian who has already analyzed this alternate history scenario: "${battleName}" — specifically the counterfactual where "${variableLabel}". You have established a detailed alternate timeline. Answer follow-up questions concisely in 2-3 paragraphs, staying grounded in that established alternate timeline and real historical knowledge of the era. Be specific and rigorous — no fantasy, no magical thinking.`;

  const messages = [];

  if (simulationSummary) {
    messages.push({
      role: 'user',
      content: `Here is the alternate history analysis you produced:\n\n${simulationSummary}`,
    });
    messages.push({
      role: 'assistant',
      content: 'I have reviewed the analysis. I am ready to answer your follow-up questions about this alternate timeline.',
    });
  }

  if (Array.isArray(conversationHistory)) {
    for (const turn of conversationHistory) {
      messages.push({ role: 'user', content: turn.question });
      messages.push({ role: 'assistant', content: turn.answer });
    }
  }

  messages.push({ role: 'user', content: question });

  const res2 = await fetch(`${ANTHROPIC_BASE_URL}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
      ...authHeaders(),
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      system,
      messages,
    }),
  });

  if (!res2.ok) {
    const err = await res2.text();
    return res.status(500).json({ error: `API error: ${err}` });
  }

  const data = await res2.json();
  res.json({ answer: data.content[0].text });
});

export default router;
