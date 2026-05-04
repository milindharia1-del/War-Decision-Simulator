import { useState } from 'react';
import { getMeta } from '../battleMeta';

function BattleCard({ battle, onClick }) {
  const meta = getMeta(battle.id);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
      style={{ minHeight: '260px', background: meta.gradient }}
    >
      {/* Background photo */}
      <img
        src={meta.img}
        alt=""
        onLoad={() => setImgLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{ opacity: imgLoaded ? 1 : 0 }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
        style={{ background: `radial-gradient(ellipse at center, ${meta.accent}, transparent 70%)` }}
      />

      {/* Border glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-opacity-60 transition-all duration-300"
        style={{ borderColor: meta.accent }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-6 pt-16">
        <div className="mt-auto">
          <p
            className="text-xs tracking-widest uppercase mb-2 font-medium"
            style={{ color: meta.accent }}
          >
            {meta.era}
          </p>
          <h2
            className="text-xl text-white mb-2 leading-tight font-semibold"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {battle.name}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
            {battle.summary}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {battle.variables.length} turning points
            </span>
            <span
              className="text-xs ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-medium"
              style={{ color: meta.accent }}
            >
              Explore →
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function BattleGrid({ battles, onSelect }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-10 text-center">
        <p className="text-amber-600 text-xs tracking-[0.3em] uppercase mb-4">Alternate History Engine</p>
        <h1
          className="text-6xl text-white mb-4 leading-tight"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          War Decision <span className="text-amber-400">Simulator</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
          Select a historical turning point, change one variable, and let AI reason through the consequences.
        </p>
        <div className="mt-6 w-16 h-px bg-amber-800 mx-auto" />
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
