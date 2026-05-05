import express from 'express';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const VOTES_PATH = join(__dirname, '../data/votes.json');

const router = express.Router();

let writeQueue = Promise.resolve();

function loadVotes() {
  if (!existsSync(VOTES_PATH)) return {};
  try {
    return JSON.parse(readFileSync(VOTES_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function saveVotes(votes) {
  writeQueue = writeQueue.then(() => {
    writeFileSync(VOTES_PATH, JSON.stringify(votes, null, 2), 'utf8');
  });
  return writeQueue;
}

// POST /api/vote
router.post('/', (req, res) => {
  const { battleId, variableId, battleName, variableLabel, agree, userScore } = req.body;
  if (!battleId || !variableId || agree === undefined) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const key = `${battleId}__${variableId}`;
  const votes = loadVotes();

  if (!votes[key]) {
    votes[key] = {
      battleId,
      battleName: battleName || battleId,
      variableId,
      variableLabel: variableLabel || variableId,
      simCount: 0,
      agreeCount: 0,
      disagreeCount: 0,
      totalUserScore: 0,
      voteCount: 0,
    };
  }

  const entry = votes[key];
  entry.agreeCount += agree ? 1 : 0;
  entry.disagreeCount += agree ? 0 : 1;
  if (userScore && userScore >= 1 && userScore <= 10) {
    entry.totalUserScore += userScore;
    entry.voteCount += 1;
  } else {
    entry.voteCount += 1;
  }

  saveVotes(votes);

  const avgScore = entry.voteCount > 0 ? (entry.totalUserScore / entry.voteCount).toFixed(1) : null;
  const totalVotes = entry.agreeCount + entry.disagreeCount;
  const agreePct = totalVotes > 0 ? Math.round((entry.agreeCount / totalVotes) * 100) : null;

  res.json({ agreePct, avgScore: parseFloat(avgScore), totalVotes });
});

// POST /api/vote/sim — increment simCount when a simulation completes
router.post('/sim', (req, res) => {
  const { battleId, variableId, battleName, variableLabel } = req.body;
  if (!battleId || !variableId) return res.status(400).json({ error: 'Missing fields.' });

  const key = `${battleId}__${variableId}`;
  const votes = loadVotes();

  if (!votes[key]) {
    votes[key] = {
      battleId,
      battleName: battleName || battleId,
      variableId,
      variableLabel: variableLabel || variableId,
      simCount: 0,
      agreeCount: 0,
      disagreeCount: 0,
      totalUserScore: 0,
      voteCount: 0,
    };
  }

  votes[key].simCount += 1;
  saveVotes(votes);
  res.json({ ok: true });
});

export function handleLeaderboard(req, res) {
  const votes = loadVotes();
  const entries = Object.values(votes)
    .sort((a, b) => b.simCount - a.simCount)
    .slice(0, 10)
    .map((e) => {
      const totalVotes = e.agreeCount + e.disagreeCount;
      const agreePct = totalVotes > 0 ? Math.round((e.agreeCount / totalVotes) * 100) : null;
      const avgScore = e.voteCount > 0 ? parseFloat((e.totalUserScore / e.voteCount).toFixed(1)) : null;
      return {
        battleId: e.battleId,
        battleName: e.battleName,
        variableId: e.variableId,
        variableLabel: e.variableLabel,
        simCount: e.simCount,
        agreePct,
        avgScore,
        totalVotes,
      };
    });
  res.json(entries);
}

export default router;
