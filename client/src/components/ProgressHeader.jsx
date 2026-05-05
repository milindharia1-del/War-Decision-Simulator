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
        className="flex flex-wrap items-center gap-3 px-6 py-3 border-b border-gray-800/60 text-sm"
        style={{ fontFamily: 'Inter, sans-serif', background: '#0a0a0a' }}
      >
        {/* Rank badge */}
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase"
          style={{ background: `${color}22`, color, border: `1px solid ${color}55` }}
        >
          {label}
        </span>

        {/* XP bar */}
        <div className="flex items-center gap-2 flex-1 min-w-[120px] max-w-[200px]">
          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
            />
          </div>
          {next && (
            <span className="text-gray-600 text-xs whitespace-nowrap">
              {nextAt - total} to {next.label}
            </span>
          )}
        </div>

        {/* Streak */}
        {progress.streak > 0 && (
          <span className="text-gray-400 flex items-center gap-1">
            🔥 <span className="font-medium text-orange-400">{progress.streak}</span>
            <span className="text-gray-600">day{progress.streak !== 1 ? 's' : ''}</span>
          </span>
        )}

        {/* Simulation count */}
        <span className="text-gray-600 hidden sm:block">
          {total} simulation{total !== 1 ? 's' : ''}
        </span>

        {/* History button */}
        <button
          onClick={() => setShowLog(true)}
          className="ml-auto text-gray-500 hover:text-amber-400 transition-colors text-xs tracking-widest uppercase"
        >
          ☰ History
        </button>
      </div>

      {showLog && (
        <SimLog history={progress.history} onClose={() => setShowLog(false)} />
      )}
    </>
  );
}
