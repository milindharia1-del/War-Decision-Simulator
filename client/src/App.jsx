import { useState, useEffect } from 'react';

export default function App() {
  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // battle object

  useEffect(() => {
    fetch('/api/battles')
      .then((r) => r.json())
      .then((data) => {
        setBattles(data);
        setLoading(false);
      });
  }, []);

  function handleVariableClick(battle, variable) {
    console.log({ battleId: battle.id, variableId: variable.id });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-500 text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
          Loading…
        </p>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="max-w-2xl mx-auto px-6 py-12">
          {/* Back button */}
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-2 text-amber-500 hover:text-amber-300 mb-10 transition-colors text-sm tracking-widest uppercase"
          >
            ← All Battles
          </button>

          {/* Battle header */}
          <div className="mb-10">
            <p className="text-amber-600 text-sm tracking-widest uppercase mb-2">
              {selected.year} · {selected.location}
            </p>
            <h1
              className="text-4xl text-amber-400 mb-4 leading-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {selected.name}
            </h1>
            <p className="text-gray-400 leading-relaxed">{selected.summary}</p>
          </div>

          {/* Variable selection */}
          <div>
            <h2
              className="text-xl text-gray-200 mb-5"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Change one variable
            </h2>
            <div className="flex flex-col gap-3">
              {selected.variables.map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleVariableClick(selected, v)}
                  className="text-left px-5 py-4 rounded-lg border border-gray-700 bg-gray-900 hover:border-amber-600 hover:bg-gray-800 transition-all text-gray-300 hover:text-amber-300"
                >
                  <span className="text-amber-700 mr-2">▸</span>
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-14">
          <h1
            className="text-5xl text-amber-400 mb-3 tracking-wide"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            War Decision Simulator
          </h1>
          <p className="text-gray-500 text-lg">
            Pick a turning point. Change one variable. Rewrite history.
          </p>
        </div>

        {/* Battle grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {battles.map((battle) => (
            <button
              key={battle.id}
              onClick={() => setSelected(battle)}
              className="text-left p-6 rounded-xl border border-gray-800 bg-gray-900 hover:border-amber-700 hover:bg-gray-800 transition-all group"
            >
              <p className="text-amber-700 text-xs tracking-widest uppercase mb-2 group-hover:text-amber-500 transition-colors">
                {battle.year} · {battle.location}
              </p>
              <h2
                className="text-xl text-gray-100 mb-3 leading-snug group-hover:text-amber-300 transition-colors"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {battle.name}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                {battle.summary}
              </p>
              <p className="mt-4 text-xs text-gray-600 group-hover:text-amber-700 transition-colors">
                {battle.variables.length} what-if scenarios →
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
