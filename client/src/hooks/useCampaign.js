import { useState, useCallback } from 'react';
import { parsePlausibility } from './useProgress';
import { getScoreResult, CAMPAIGN_SEQUENCE } from '../data/campaignData';

const KEY = 'war-sim-campaign';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

export default function useCampaign() {
  const [campaign, setCampaign] = useState(load);

  const startCampaign = useCallback((factionId) => {
    const c = {
      factionId,
      currentIndex: 0,
      battles: {},
      totalScore: 0,
      startedAt: new Date().toISOString(),
      completedAt: null,
    };
    save(c);
    setCampaign(c);
  }, []);

  const recordBattleResult = useCallback((result) => {
    setCampaign((prev) => {
      const plausibility = parsePlausibility(result.sections?.plausibility);
      const { pts, territoryState, label } = getScoreResult(plausibility);
      const nextIndex = prev.currentIndex + 1;
      const isComplete = nextIndex >= CAMPAIGN_SEQUENCE.length;

      const next = {
        ...prev,
        currentIndex: nextIndex,
        battles: {
          ...prev.battles,
          [result.battleId]: { territoryState, pts, plausibility, label, variableLabel: result.variableLabel },
        },
        totalScore: prev.totalScore + pts + (isComplete ? 20 : 0),
        completedAt: isComplete ? new Date().toISOString() : null,
      };
      save(next);
      return next;
    });
  }, []);

  const abandonCampaign = useCallback(() => {
    localStorage.removeItem(KEY);
    setCampaign(null);
  }, []);

  const currentBattleId = campaign
    ? (CAMPAIGN_SEQUENCE[campaign.currentIndex] ?? null)
    : null;

  const isComplete = campaign
    ? campaign.currentIndex >= CAMPAIGN_SEQUENCE.length
    : false;

  return { campaign, startCampaign, recordBattleResult, abandonCampaign, currentBattleId, isComplete };
}
