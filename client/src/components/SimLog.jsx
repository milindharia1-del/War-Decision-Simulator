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
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col border-l border-gray-800"
        style={{ background: '#0d0d0d', fontFamily: 'Inter, sans-serif' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-white font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>
            Simulation History
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <p className="text-5xl mb-4">📜</p>
              <p className="text-gray-500">No simulations yet.</p>
              <p className="text-gray-700 text-sm mt-1">Run your first alternate history above.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-800/60">
              {history.map((entry, i) => {
                const meta = getMeta(entry.battleId);
                return (
                  <li key={i} className="px-6 py-4 hover:bg-gray-900/50 transition-colors">
                    <div className="flex items-start gap-3">
                      {/* Accent dot */}
                      <div
                        className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                        style={{ background: meta.accent }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-200 text-sm font-medium truncate">
                          {entry.battleName}
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5 leading-relaxed line-clamp-2">
                          {entry.variableLabel}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-gray-600 text-xs">{timeAgo(entry.date)}</span>
                          {entry.plausibility !== null && entry.plausibility !== undefined && (
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{
                                background: `${meta.accent}22`,
                                color: meta.accent,
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
