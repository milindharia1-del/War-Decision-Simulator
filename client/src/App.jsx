import { useState, useEffect } from 'react';
import BattleGrid from './components/BattleGrid';
import VariableSelect from './components/VariableSelect';
import LoadingScreen from './components/LoadingScreen';
import ResultView from './components/ResultView';

function RateLimitScreen({ onBack }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: '#030303', fontFamily: 'Inter, sans-serif' }}
    >
      <div className="text-6xl mb-6">⏳</div>
      <h2
        className="text-3xl text-amber-400 mb-4"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        Daily Limit Reached
      </h2>
      <p className="text-gray-400 max-w-md leading-relaxed mb-8">
        You've used your 3 simulations for today. History will still be there tomorrow — come back then.
      </p>
      <button
        onClick={onBack}
        className="px-6 py-3 rounded-xl border border-gray-700 text-gray-400 hover:border-amber-700 hover:text-amber-300 transition-all text-sm"
      >
        ← Back to battles
      </button>
    </div>
  );
}

export default function App() {
  const [battles, setBattles] = useState([]);
  const [screen, setScreen] = useState('battles'); // battles | variables | loading | result | ratelimit
  const [selectedBattle, setSelectedBattle] = useState(null);
  const [selectedVariable, setSelectedVariable] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/battles')
      .then((r) => r.json())
      .then(setBattles);
  }, []);

  function handleBattleSelect(battle) {
    setSelectedBattle(battle);
    setScreen('variables');
  }

  async function handleVariableSelect(battle, variable) {
    setSelectedVariable(variable);
    setScreen('loading');
    setError(null);

    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ battleId: battle.id, variableId: variable.id }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setScreen('ratelimit');
        return;
      }

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        setScreen('variables');
        return;
      }

      setResult(data);
      setScreen('result');
    } catch {
      setError('Could not reach the server. Please try again.');
      setScreen('variables');
    }
  }

  function handleReset() {
    setScreen('battles');
    setSelectedBattle(null);
    setSelectedVariable(null);
    setResult(null);
    setError(null);
  }

  if (screen === 'ratelimit') {
    return <RateLimitScreen onBack={handleReset} />;
  }

  if (screen === 'battles' || battles.length === 0) {
    return <BattleGrid battles={battles} onSelect={handleBattleSelect} />;
  }

  if (screen === 'variables') {
    return (
      <>
        {error && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-900/90 border border-red-700 text-red-200 px-6 py-3 rounded-xl text-sm backdrop-blur-sm">
            {error}
          </div>
        )}
        <VariableSelect
          battle={selectedBattle}
          onSelect={handleVariableSelect}
          onBack={handleReset}
        />
      </>
    );
  }

  if (screen === 'loading') {
    return <LoadingScreen battle={selectedBattle} variable={selectedVariable} />;
  }

  if (screen === 'result' && result) {
    return <ResultView result={result} onReset={handleReset} />;
  }

  return null;
}
