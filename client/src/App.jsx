import { useState, useEffect } from 'react';
import { useNavigate, useParams, Routes, Route } from 'react-router-dom';
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

// Shared simulation logic extracted so both routes can use it
function useSimulator(battles) {
  const navigate = useNavigate();
  const [screen, setScreen] = useState('battles');
  const [selectedBattle, setSelectedBattle] = useState(null);
  const [selectedVariable, setSelectedVariable] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function runSimulation(battle, variable) {
    setSelectedBattle(battle);
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

      if (res.status === 429) { setScreen('ratelimit'); return; }
      if (!res.ok) { setError(data.error || 'Something went wrong.'); setScreen('variables'); return; }

      setResult(data);
      setScreen('result');
      navigate(`/sim/${battle.id}/${variable.id}`, { replace: true });
    } catch {
      setError('Could not reach the server. Please try again.');
      setScreen('variables');
    }
  }

  function handleBattleSelect(battle) {
    setSelectedBattle(battle);
    setScreen('variables');
    navigate('/');
  }

  function handleReset() {
    setScreen('battles');
    setSelectedBattle(null);
    setSelectedVariable(null);
    setResult(null);
    setError(null);
    navigate('/');
  }

  return { screen, setScreen, selectedBattle, selectedVariable, result, error, runSimulation, handleBattleSelect, handleReset };
}

function MainApp({ battles }) {
  const sim = useSimulator(battles);

  if (sim.screen === 'ratelimit') return <RateLimitScreen onBack={sim.handleReset} />;

  if (sim.screen === 'battles' || battles.length === 0) {
    return <BattleGrid battles={battles} onSelect={sim.handleBattleSelect} />;
  }

  if (sim.screen === 'variables') {
    return (
      <>
        {sim.error && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-900/90 border border-red-700 text-red-200 px-6 py-3 rounded-xl text-sm backdrop-blur-sm">
            {sim.error}
          </div>
        )}
        <VariableSelect battle={sim.selectedBattle} onSelect={sim.runSimulation} onBack={sim.handleReset} />
      </>
    );
  }

  if (sim.screen === 'loading') {
    return <LoadingScreen battle={sim.selectedBattle} variable={sim.selectedVariable} />;
  }

  if (sim.screen === 'result' && sim.result) {
    return <ResultView result={sim.result} onReset={sim.handleReset} />;
  }

  return null;
}

// Handles /sim/:battleId/:variableId — auto-runs simulation on load
function SharedSim({ battles }) {
  const { battleId, variableId } = useParams();
  const navigate = useNavigate();
  const [screen, setScreen] = useState('loading');
  const [result, setResult] = useState(null);
  const [battle, setBattle] = useState(null);
  const [variable, setVariable] = useState(null);

  useEffect(() => {
    if (!battles.length) return;

    const b = battles.find((x) => x.id === battleId);
    const v = b?.variables.find((x) => x.id === variableId);

    if (!b || !v) { navigate('/'); return; }

    setBattle(b);
    setVariable(v);

    fetch('/api/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ battleId, variableId }),
    })
      .then((r) => {
        if (r.status === 429) { setScreen('ratelimit'); return null; }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setResult(data);
        setScreen('result');
      })
      .catch(() => navigate('/'));
  }, [battles, battleId, variableId]);

  if (screen === 'loading' && battle && variable) {
    return <LoadingScreen battle={battle} variable={variable} />;
  }

  if (screen === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Loading…</p>
      </div>
    );
  }

  if (screen === 'ratelimit') {
    return <RateLimitScreen onBack={() => navigate('/')} />;
  }

  if (screen === 'result' && result) {
    return <ResultView result={result} onReset={() => navigate('/')} />;
  }

  return null;
}

export default function App() {
  const [battles, setBattles] = useState([]);

  useEffect(() => {
    fetch('/api/battles').then((r) => r.json()).then(setBattles);
  }, []);

  return (
    <Routes>
      <Route path="/sim/:battleId/:variableId" element={<SharedSim battles={battles} />} />
      <Route path="*" element={<MainApp battles={battles} />} />
    </Routes>
  );
}
