import { rankInfo } from '../hooks/useProgress';

const LINES = {
  Scholar:          'The archives are opening to you.',
  Strategist:       'You think like a general now.',
  Historian:        'History bends to your analysis.',
  'Grand Historian': 'You have mastered the art of counterfactual reasoning.',
};

export default function RankUpToast({ rank }) {
  if (!rank) return null;
  const { color } = rankInfo(0); // just need color from rank label
  const info = { Scholar: '#f59e0b', Strategist: '#f97316', Historian: '#ef4444', 'Grand Historian': '#a855f7' };
  const c = info[rank] || '#f59e0b';

  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 px-6 py-4 rounded-2xl border shadow-2xl text-center"
      style={{
        transform: 'translateX(-50%)',
        background: '#111',
        borderColor: `${c}55`,
        boxShadow: `0 0 40px ${c}33`,
        fontFamily: 'Inter, sans-serif',
        animation: 'slideUp 0.4s ease-out',
        minWidth: '280px',
      }}
    >
      <p className="text-xs tracking-widest uppercase text-gray-500 mb-1">Rank Achieved</p>
      <p className="text-2xl font-bold mb-1" style={{ color: c, fontFamily: 'Playfair Display, serif' }}>
        {rank}
      </p>
      <p className="text-gray-400 text-sm">{LINES[rank]}</p>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
