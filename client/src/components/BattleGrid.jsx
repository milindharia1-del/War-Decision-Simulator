import { useState } from 'react';
import { getMeta } from '../battleMeta';
import ProgressHeader from './ProgressHeader';

function BattleCard({ battle, onClick }) {
  const meta = getMeta(battle.id);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl text-left transition-all duration-300"
      style={{
        minHeight: '260px',
        background: meta.gradient,
        border: '1px solid #3D3530',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = meta.accent;
        e.currentTarget.style.boxShadow = `0 0 24px ${meta.accent}33, inset 0 0 40px ${meta.accent}11`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#3D3530';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Background photo */}
      <img
        src={meta.img}
        alt=""
        onLoad={() => setImgLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{ opacity: imgLoaded ? 0.7 : 0 }}
      />

      {/* Dark overlays */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #07050Aee 0%, #07050A88 50%, #07050A44 100%)' }} />

      {/* Top gold rule */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${meta.accent}66, transparent)` }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-5 pt-14">
        <div className="mt-auto">
          <p
            className="text-xs tracking-[0.25em] uppercase mb-2"
            style={{ color: meta.accent, fontFamily: 'Cinzel, serif' }}
          >
            {meta.era}
          </p>
          <h2
            className="text-lg text-white mb-2 leading-tight"
            style={{ fontFamily: 'Cinzel, serif', fontWeight: 600 }}
          >
            {battle.name}
          </h2>
          <p className="text-sm leading-relaxed line-clamp-2" style={{ color: '#A89F8C', fontFamily: 'EB Garamond, serif', fontSize: '0.95rem' }}>
            {battle.summary}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs" style={{ color: '#6B6357', fontFamily: 'Cinzel, serif' }}>
              {battle.variables.length} Turning Points
            </span>
            <span
              className="text-xs ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ color: meta.accent, fontFamily: 'Cinzel, serif' }}
            >
              Enter →
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function BattleGrid({ battles, onSelect, progress }) {
  return (
    <div className="min-h-screen text-gray-100" style={{ background: 'var(--bg-deep)', fontFamily: 'EB Garamond, serif' }}>
      {progress && <ProgressHeader progress={progress} />}

      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-10 text-center">
        <p style={{ color: 'var(--gold-dim)', fontFamily: 'Cinzel, serif', fontSize: '0.7rem', letterSpacing: '0.35em' }} className="uppercase mb-5">
          Alternate History Engine
        </p>
        <h1
          className="text-white mb-2 leading-tight"
          style={{ fontFamily: 'Cinzel Decorative, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, color: 'var(--gold)' }}
        >
          War Decision
        </h1>
        <h2
          className="mb-5 leading-tight"
          style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.1rem, 2.5vw, 1.7rem)', fontWeight: 400, color: '#A89F8C' }}
        >
          Simulator
        </h2>
        <p style={{ color: 'var(--ash)', fontFamily: 'EB Garamond, serif', fontSize: '1.15rem', fontStyle: 'italic' }} className="max-w-xl mx-auto leading-relaxed">
          Select a historical turning point, alter one variable, and let the Maester reason through the consequences.
        </p>

        {/* Ornamental divider */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="h-px flex-1 max-w-[120px]" style={{ background: 'linear-gradient(90deg, transparent, var(--gold-dim))' }} />
          <span style={{ color: 'var(--gold)', fontSize: '1.1rem' }}>❖</span>
          <div className="h-px flex-1 max-w-[120px]" style={{ background: 'linear-gradient(90deg, var(--gold-dim), transparent)' }} />
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {battles.map((battle) => (
            <BattleCard key={battle.id} battle={battle} onClick={() => onSelect(battle)} />
          ))}
        </div>
      </div>
    </div>
  );
}
