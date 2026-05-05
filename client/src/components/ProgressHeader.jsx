import { useState } from 'react';
import { rankInfo } from '../hooks/useProgress';
import SimLog from './SimLog';

export default function ProgressHeader({ progress }) {
  const [showLog, setShowLog] = useState(false);
  const { label, color, pct, next, nextAt } = rankInfo(progress.totalSimulations);
  const total = progress.totalSimulations;

  return (
    <>
      <div
        className="flex flex-wrap items-center gap-3 px-6 py-3 text-sm"
        style={{
          background: '#0A0806',
          borderTop: '1px solid var(--iron)',
          borderBottom: '1px solid var(--iron)',
          fontFamily: 'Cinzel, serif',
        }}
      >
        {/* Rank badge */}
        <span
          className="px-3 py-1 rounded text-xs font-semibold tracking-widest uppercase"
          style={{ background: `${color}22`, color, border: `1px solid ${color}55` }}
        >
          {label}
        </span>

        {/* XP bar */}
        <div className="flex items-center gap-2 flex-1 min-w-[120px] max-w-[200px]">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--iron)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
            />
          </div>
          {next && (
            <span className="whitespace-nowrap" style={{ color: 'var(--ash)', fontSize: '0.6rem' }}>
              {nextAt - total} to {next.label}
            </span>
          )}
        </div>

        {/* Streak */}
        {progress.streak > 0 && (
          <span className="flex items-center gap-1" style={{ color: 'var(--ash)' }}>
            ⚔ <span className="font-medium" style={{ color }}>{progress.streak}</span>
            <span style={{ color: 'var(--ash)', fontSize: '0.65rem' }}>
              day{progress.streak !== 1 ? 's' : ''}
            </span>
          </span>
        )}

        {/* Simulation count */}
        <span className="hidden sm:block" style={{ color: 'var(--ash)', fontSize: '0.65rem' }}>
          {total} battle{total !== 1 ? 's' : ''} fought
        </span>

        {/* Chronicle button */}
        <button
          onClick={() => setShowLog(true)}
          className="ml-auto transition-colors"
          style={{ color: 'var(--ash)', fontSize: '0.65rem', letterSpacing: '0.2em' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ash)'; }}
        >
          ⚜ Chronicle
        </button>
      </div>

      {showLog && (
        <SimLog history={progress.history} onClose={() => setShowLog(false)} />
      )}
    </>
  );
}
