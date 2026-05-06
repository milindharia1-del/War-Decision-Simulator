import { useState, useEffect } from 'react';
import { useNavigate, useParams, Routes, Route } from 'react-router-dom';
import BattleGrid from './components/BattleGrid';
import VariableSelect from './components/VariableSelect';
import LoadingScreen from './components/LoadingScreen';
import ResultView from './components/ResultView';
import RankUpToast from './components/RankUpToast';
import CampaignApp from './components/CampaignApp';
import useProgress from './hooks/useProgress';

function RateLimitScreen({ onBack }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: 'var(--bg-deep)', fontFamily: 'EB Garamond, serif' }}>
      <div className="text-5xl mb-6" style={{ color: 'var(--gold)' }}>⏳</div>
      <h2 className="text-3xl mb-4" style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)' }}>Daily Limit Reached</h2>
      <p className="max-w-md leading-relaxed mb-8 italic" style={{ color: 'var(--ash)', fontFamily: 'EB Garamond, serif', fontSize: '1.1rem' }}>
        You've used your 3 simulations for today. History will still be there tomorrow.
      </p>
      <button
        onClick={onBack}
        className="px-6 py-3 rounded uppercase tracking-widest transition-all text-sm"
        style={{ fontFamily: 'Cinzel, serif', fontSize: '0.7rem', border: '1px solid var(--iron)', color: 'var(--ash)' }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold-dim)'; e.currentTarget.style.color = 'var(--gold)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--iron)'; e.currentTarget.style.color = 'var(--ash)'; }}
      >
        ◂ Back to Battles
      </button>
    </div>
  );
}

function useSimulator(battles, recordSimulation) {
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
      recordSimulation(data);
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

  return { screen, selectedBattle, selectedVariable, result, error, runSimulation, handleBattleSelect, handleReset };
}

function MainApp({ battles, progress, recordSimulation, onCampaign }) {
  const sim = useSimulator(battles, recordSimulation);

  if (sim.screen === 'ratelimit') return <RateLimitScreen onBack={sim.handleReset} />;

  if (sim.screen === 'battles' || battles.length === 0) {
    return <BattleGrid battles={battles} onSelect={sim.handleBattleSelect} progress={progress} onCampaign={onCampaign} />;
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
    return <ResultView result={sim.result} onReset={sim.handleReset} progress={progress} />;
  }

  return null;
}

function SharedSim({ battles, recordSimulation }) {
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
      .then((r) => { if (r.status === 429) { setScreen('ratelimit'); return null; } return r.json(); })
      .then((data) => { if (!data) return; recordSimulation(data); setResult(data); setScreen('result'); })
      .catch(() => navigate('/'));
  }, [battles, battleId, variableId]);

  if (screen === 'loading' && battle && variable) return <LoadingScreen battle={battle} variable={variable} />;
  if (screen === 'loading') return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-deep)' }}>
      <p style={{ color: 'var(--ash)', fontFamily: 'Cinzel, serif', fontSize: '0.8rem' }}>Loading…</p>
    </div>
  );
  if (screen === 'ratelimit') return <RateLimitScreen onBack={() => navigate('/')} />;
  if (screen === 'result' && result) return <ResultView result={result} onReset={() => navigate('/')} />;
  return null;
}

export default function App() {
  const [battles, setBattles] = useState([]);
  const [mode, setMode] = useState('freeplay'); // 'freeplay' | 'campaign'
  const { progress, recordSimulation, rankUpToast } = useProgress();

  useEffect(() => {
    fetch('/api/battles').then((r) => r.json()).then(setBattles);
  }, []);

  return (
    <>
      <Routes>
        <Route path="/sim/:battleId/:variableId" element={<SharedSim battles={battles} recordSimulation={recordSimulation} />} />
        <Route path="*" element={
          mode === 'campaign'
            ? <CampaignApp battles={battles} onExit={() => setMode('freeplay')} />
            : <MainApp battles={battles} progress={progress} recordSimulation={recordSimulation} onCampaign={() => setMode('campaign')} />
        } />
      </Routes>
      <RankUpToast rank={rankUpToast} />
    </>
  );
}
