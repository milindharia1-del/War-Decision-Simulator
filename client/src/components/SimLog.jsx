import { getMeta } from '../battleMeta';

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function SimLog({ history, onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col"
        style={{
          background: '#0A0806',
          borderLeft: '1px solid var(--iron)',
          fontFamily: 'EB Garamond, serif',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--iron)' }}
        >
          <div>
            <h2 className="text-white" style={{ fontFamily: 'Cinzel, serif', fontWeight: 600, fontSize: '1.1rem' }}>
              The Chronicle
            </h2>
            <p className="text-xs mt-0.5 italic" style={{ color: 'var(--ash)' }}>A record of your battles</p>
          </div>
          <button
            onClick={onClose}
            className="text-xl leading-none transition-colors"
            style={{ color: 'var(--ash)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ash)'; }}
          >
            ×
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <p className="text-5xl mb-4">📜</p>
              <p style={{ color: 'var(--ash)', fontFamily: 'Cinzel, serif', fontSize: '0.8rem' }}>
                The chronicle is empty.
              </p>
              <p className="text-sm mt-1 italic" style={{ color: 'var(--iron)', fontFamily: 'EB Garamond, serif' }}>
                Your first battle awaits.
              </p>
            </div>
          ) : (
            <ul>
              {history.map((entry, i) => {
                const meta = getMeta(entry.battleId);
                return (
                  <li
                    key={i}
                    className="px-6 py-4 transition-colors"
                    style={{ borderBottom: '1px solid #1A1512' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#110E0A'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Accent diamond */}
                      <div
                        className="w-2 h-2 shrink-0 mt-1.5"
                        style={{
                          background: meta.accent,
                          transform: 'rotate(45deg)',
                          minWidth: '8px',
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--parchment)', fontFamily: 'Cinzel, serif', fontSize: '0.8rem' }}>
                          {entry.battleName}
                        </p>
                        <p className="text-xs mt-0.5 leading-relaxed line-clamp-2 italic" style={{ color: 'var(--ash)', fontFamily: 'EB Garamond, serif', fontSize: '0.9rem' }}>
                          {entry.variableLabel}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs" style={{ color: 'var(--iron)', fontFamily: 'Cinzel, serif', fontSize: '0.6rem' }}>{timeAgo(entry.date)}</span>
                          {entry.plausibility !== null && entry.plausibility !== undefined && (
                            <span
                              className="text-xs px-2 py-0.5 rounded font-medium"
                              style={{
                                background: `${meta.accent}22`,
                                color: meta.accent,
                                fontFamily: 'Cinzel, serif',
                                fontSize: '0.6rem',
                              }}
                            >
                              {entry.plausibility}/10
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
