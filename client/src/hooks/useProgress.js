import { useState, useCallback } from 'react';

const KEY = 'war-sim-progress';

const RANKS = [
  { label: 'Recruit',        min: 0,  color: '#6b7280' },
  { label: 'Scholar',        min: 3,  color: '#f59e0b' },
  { label: 'Strategist',     min: 8,  color: '#f97316' },
  { label: 'Historian',      min: 15, color: '#ef4444' },
  { label: 'Grand Historian', min: 25, color: '#a855f7' },
];

const RANK_UP_LINES = {
  Scholar:         'The archives are opening to you.',
  Strategist:      'You think like a general now.',
  Historian:       'History bends to your analysis.',
  'Grand Historian': 'You have mastered the art of counterfactual reasoning.',
};

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { totalSimulations: 0, streak: 0, lastSimDate: null, history: [] };
}

function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

export function rankInfo(total) {
  let current = RANKS[0];
  for (const r of RANKS) { if (total >= r.min) current = r; else break; }
  const idx = RANKS.indexOf(current);
  const next = RANKS[idx + 1] || null;
  const pct = next
    ? Math.min(100, ((total - current.min) / (next.min - current.min)) * 100)
    : 100;
  return { ...current, next, nextAt: next?.min ?? null, pct };
}

export function parsePlausibility(text) {
  if (!text) return null;
  const m = text.match(/\*{0,2}(\d+)(?:\/10)?\*{0,2}/);
  return m ? Math.min(10, Math.max(1, parseInt(m[1]))) : null;
}

export default function useProgress() {
  const [progress, setProgress] = useState(load);
  const [rankUpToast, setRankUpToast] = useState(null);

  const recordSimulation = useCallback((result) => {
    setProgress((prev) => {
      const today = todayStr();
      const prevRank = rankInfo(prev.totalSimulations).label;

      // Streak
      let streak = prev.streak;
      if (prev.lastSimDate === today) {
        // already ran today, no change
      } else if (prev.lastSimDate === yesterdayStr()) {
        streak += 1;
      } else {
        streak = 1;
      }

      const totalSimulations = prev.totalSimulations + 1;
      const newRank = rankInfo(totalSimulations).label;

      const entry = {
        battleId: result.battleId,
        battleName: result.battleName,
        variableId: result.variableId,
        variableLabel: result.variableLabel,
        plausibility: parsePlausibility(result.sections?.plausibility),
        date: new Date().toISOString(),
      };

      const next = {
        ...prev,
        totalSimulations,
        streak,
        lastSimDate: today,
        history: [entry, ...prev.history].slice(0, 50),
      };

      save(next);

      if (newRank !== prevRank) {
        setTimeout(() => {
          setRankUpToast(newRank);
          setTimeout(() => setRankUpToast(null), 3500);
        }, 600);
      }

      return next;
    });
  }, []);

  return { progress, recordSimulation, rankUpToast };
}
