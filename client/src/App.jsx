import { useState, useEffect } from 'react';
import BattleGrid from './components/BattleGrid';
import VariableSelect from './components/VariableSelect';
import LoadingScreen from './components/LoadingScreen';
import ResultView from './components/ResultView';

export default function App() {
  const [battles, setBattles] = useState([]);
  const [screen, setScreen] = useState('battles'); // battles | variables | loading | result
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
