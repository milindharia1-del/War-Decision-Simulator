import { useState, useEffect } from 'react';
import { getMeta } from '../battleMeta';

const ROMAN_NUM = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

export default function Leaderboard({ onClose }) {
  const [entries, setEntries] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((r) => r.json())
      .then(setEntries)
      .catch(() => setError('Could not load the Hall of Fame.'));
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl flex flex-col rounded-lg"
        style={{
          transform: 'translate(-50%, -50%)',
          background: '#0A0806',
          border: '1px solid var(--iron)',
          maxHeight: '85vh',
          boxShadow: '0 0 60px rgba(201,168,76,0.1)',
          fontFamily: 'EB Garamond, serif',
        }}
      >
        {/* Top gold line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5" style={{ borderBottom: '1px solid var(--iron)' }}>
          <div>
            <p className="uppercase tracking-[0.3em] text-xs mb-1" style={{ color: 'var(--gold-dim)', fontFamily: 'Cinzel, serif' }}>
              ♔ Hall of Fame
            </p>
            <h2 className="text-white text-xl" style={{ fontFamily: 'Cinzel, serif', fontWeight: 600 }}>
              The Grand Chronicle
            </h2>
            <p className="text-sm italic mt-0.5" style={{ color: 'var(--ash)' }}>
              The most-explored turning points in history
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl leading-none transition-colors"
            style={{ color: 'var(--ash)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ash)'; }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {error && (
            <p className="text-center italic" style={{ color: 'var(--ash)' }}>{error}</p>
          )}

          {entries === null && !error && (
            <div className="flex justify-center py-10">
              <div className="w-2 h-2 rounded-full mx-1" style={{ background: 'var(--gold)', animation: 'pulse 1s ease-in-out infinite' }} />
              <div className="w-2 h-2 rounded-full mx-1" style={{ background: 'var(--gold)', animation: 'pulse 1s ease-in-out 0.2s infinite' }} />
              <div className="w-2 h-2 rounded-full mx-1" style={{ background: 'var(--gold)', animation: 'pulse 1s ease-in-out 0.4s infinite' }} />
              <style>{`@keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }`}</style>
            </div>
          )}

          {entries && entries.length === 0 && (
            <div className="text-center py-12">
              <p className="text-4xl mb-4">⚔</p>
              <p className="text-sm" style={{ color: 'var(--ash)', fontFamily: 'Cinzel, serif' }}>No battles recorded yet.</p>
              <p className="italic text-sm mt-1" style={{ color: 'var(--iron)', fontFamily: 'EB Garamond, serif' }}>
                Be the first to shape history.
              </p>
            </div>
          )}

          {entries && entries.length > 0 && (
            <ol className="space-y-3">
              {entries.map((e, i) => {
                const meta = getMeta(e.battleId);
                return (
                  <li
                    key={`${e.battleId}__${e.variableId}`}
                    className="flex items-start gap-4 p-4 rounded-lg transition-colors"
                    style={{
                      background: 'var(--bg-stone)',
                      border: `1px solid ${i === 0 ? 'var(--gold)' : 'var(--iron)'}`,
                      borderLeft: `3px solid ${meta.accent}`,
                    }}
                  >
                    {/* Rank number */}
                    <span
                      className="shrink-0 w-8 text-center text-sm mt-0.5"
                      style={{
                        fontFamily: 'Cinzel, serif',
                        color: i === 0 ? 'var(--gold)' : 'var(--ash)',
                        fontSize: '0.75rem',
                      }}
                    >
                      {ROMAN_NUM[i]}
                    </span>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: meta.accent, fontFamily: 'Cinzel, serif', fontSize: '0.6rem' }}>
                        {e.battleName}
                      </p>
                      <p className="text-sm leading-snug" style={{ color: 'var(--parchment)', fontFamily: 'EB Garamond, serif', fontSize: '1rem' }}>
                        {e.variableLabel}
                      </p>
                      <div className="flex items-center gap-4 mt-2 flex-wrap">
                        <span className="text-xs" style={{ color: 'var(--ash)', fontFamily: 'Cinzel, serif', fontSize: '0.6rem' }}>
                          {e.simCount} simulation{e.simCount !== 1 ? 's' : ''}
                        </span>
                        {e.agreePct !== null && (
                          <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#C9A84C22', color: 'var(--gold)', fontFamily: 'Cinzel, serif', fontSize: '0.6rem' }}>
                            {e.agreePct}% agree
                          </span>
                        )}
                        {e.avgScore !== null && (
                          <span className="text-xs" style={{ color: 'var(--ash)', fontFamily: 'Cinzel, serif', fontSize: '0.6rem' }}>
                            avg {e.avgScore}/10
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Sim count badge — top right */}
                    {i === 0 && (
                      <span className="shrink-0 text-xs px-2 py-1 rounded" style={{ background: '#C9A84C22', color: 'var(--gold)', border: '1px solid #C9A84C44', fontFamily: 'Cinzel, serif', fontSize: '0.6rem' }}>
                        ♔ Most Explored
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        {/* Bottom close */}
        <div className="px-8 py-4" style={{ borderTop: '1px solid var(--iron)' }}>
          <button
            onClick={onClose}
            className="w-full py-3 rounded uppercase tracking-widest transition-all text-sm"
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '0.7rem',
              border: '1px solid var(--iron)',
              color: 'var(--ash)',
              background: 'transparent',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold-dim)'; e.currentTarget.style.color = 'var(--gold)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--iron)'; e.currentTarget.style.color = 'var(--ash)'; }}
          >
            ◂ Return to Battle
          </button>
        </div>
      </div>
    </>
  );
}
