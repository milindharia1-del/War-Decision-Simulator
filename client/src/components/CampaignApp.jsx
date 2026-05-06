import { useState } from 'react';
import useCampaign from '../hooks/useCampaign';
import CampaignSetup from './campaign/CampaignSetup';
import CampaignMap from './campaign/CampaignMap';
import CampaignResult from './campaign/CampaignResult';
import CampaignEnd from './campaign/CampaignEnd';
import VariableSelect from './VariableSelect';
import LoadingScreen from './LoadingScreen';

export default function CampaignApp({ battles, onExit }) {
  const { campaign, startCampaign, recordBattleResult, abandonCampaign, currentBattleId, isComplete } = useCampaign();
  const [screen, setScreen] = useState('map');
  const [selectedVariable, setSelectedVariable] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [error, setError] = useState(null);

  // No campaign yet → setup
  if (!campaign) {
    return <CampaignSetup onStart={startCampaign} onBack={onExit} />;
  }

  // Campaign finished
  if (isComplete) {
    return (
      <CampaignEnd
        campaign={campaign}
        onExit={onExit}
        onRestart={() => { abandonCampaign(); }}
      />
    );
  }

  const currentBattle = battles.find(b => b.id === currentBattleId);

  async function handleVariableSelect(battle, variable) {
    setSelectedVariable(variable);
    setError(null);
    setScreen('loading');
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ battleId: battle.id, variableId: variable.id }),
      });
      const data = await res.json();
      if (res.status === 429) { setScreen('variables'); setError('Daily limit reached. Return tomorrow.'); return; }
      if (!res.ok) { setScreen('variables'); setError(data.error || 'Something went wrong.'); return; }
      recordBattleResult(data);
      setLastResult(data);
      setScreen('result');
    } catch {
      setScreen('variables');
      setError('Could not reach the server.');
    }
  }

  if (screen === 'map') {
    return (
      <CampaignMap
        campaign={campaign}
        battles={battles}
        currentBattleId={currentBattleId}
        onAttack={() => setScreen('variables')}
        onAbandon={() => { abandonCampaign(); onExit(); }}
      />
    );
  }

  if (screen === 'variables' && currentBattle) {
    return (
      <>
        {error && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-900/90 border border-red-700 text-red-200 px-6 py-3 rounded-xl text-sm backdrop-blur-sm">
            {error}
          </div>
        )}
        <VariableSelect
          battle={currentBattle}
          onSelect={handleVariableSelect}
          onBack={() => { setError(null); setScreen('map'); }}
        />
      </>
    );
  }

  if (screen === 'loading' && currentBattle && selectedVariable) {
    return <LoadingScreen battle={currentBattle} variable={selectedVariable} />;
  }

  if (screen === 'result' && lastResult) {
    return (
      <CampaignResult
        result={lastResult}
        campaign={campaign}
        onContinue={() => { setLastResult(null); setScreen('map'); }}
      />
    );
  }

  return null;
}
