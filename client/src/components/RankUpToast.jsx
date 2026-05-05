const RANK_COLORS = {
  Squire:          '#C9A84C',
  Knight:          '#A0522D',
  'Lord Commander': '#7A0000',
  King:            '#6A0DAD',
};

const RANK_LINES = {
  Squire:          'You have been called to serve.',
  Knight:          'Kneel and rise — you are a Knight of the Realm.',
  'Lord Commander': 'The black cloak is yours to bear.',
  King:            'The realm bows before your wisdom.',
};

export default function RankUpToast({ rank }) {
  if (!rank) return null;
  const c = RANK_COLORS[rank] || '#C9A84C';

  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 px-6 py-5 rounded text-center"
      style={{
        transform: 'translateX(-50%)',
        background: '#0A0806',
        border: `1px solid ${c}88`,
        boxShadow: `0 0 40px ${c}44, 0 0 80px ${c}22`,
        fontFamily: 'Cinzel, serif',
        animation: 'slideUp 0.4s ease-out',
        minWidth: '300px',
      }}
    >
      {/* Top gold rule */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${c}88, transparent)` }} />

      <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: 'var(--ash)' }}>
        A New Title Has Been Bestowed
      </p>
      <p className="text-2xl font-bold mb-2" style={{ color: c, fontFamily: 'Cinzel Decorative, serif' }}>
        {rank}
      </p>
      <p className="text-sm italic" style={{ color: 'var(--parchment)', fontFamily: 'EB Garamond, serif' }}>
        {RANK_LINES[rank]}
      </p>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
