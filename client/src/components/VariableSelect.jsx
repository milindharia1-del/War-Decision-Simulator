import { useState } from 'react';
import { getMeta } from '../battleMeta';

export default function VariableSelect({ battle, onSelect, onBack }) {
  const meta = getMeta(battle.id);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hovered, setHovered] = useState(null);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Hero banner */}
      <div className="relative h-72 overflow-hidden" style={{ background: meta.gradient }}>
        <img
          src={meta.img}
          alt=""
          onLoad={() => setImgLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: imgLoaded ? 0.4 : 0 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-gray-950" />

        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm tracking-widest uppercase bg-black/30 hover:bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm"
        >
          ← Back
        </button>

        {/* Battle title */}
        <div className="absolute bottom-8 left-0 right-0 px-8 max-w-4xl mx-auto">
          <p
            className="text-xs tracking-[0.3em] uppercase mb-2 font-medium"
            style={{ color: meta.accent }}
          >
            {meta.era}
          </p>
          <h1
            className="text-4xl md:text-5xl text-white leading-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {battle.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-10">
        <p className="text-gray-400 leading-relaxed mb-10 text-base border-l-2 pl-4" style={{ borderColor: meta.accent }}>
          {battle.summary}
        </p>

        <h2
          className="text-2xl text-white mb-2"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          What if one thing had been different?
        </h2>
        <p className="text-gray-600 text-sm mb-8">Select a variable to explore the alternate timeline.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {battle.variables.map((v, i) => (
            <button
              key={v.id}
              onClick={() => onSelect(battle, v)}
              onMouseEnter={() => setHovered(v.id)}
              onMouseLeave={() => setHovered(null)}
              className="group relative text-left p-6 rounded-xl border border-gray-800 bg-gray-900/80 hover:bg-gray-800 transition-all duration-200 overflow-hidden"
              style={{
                borderColor: hovered === v.id ? meta.accent : undefined,
                boxShadow: hovered === v.id ? `0 0 20px ${meta.accent}22` : undefined,
              }}
            >
              <div
                className="absolute top-0 left-0 w-1 h-full rounded-l-xl transition-all duration-200"
                style={{ background: hovered === v.id ? meta.accent : '#374151' }}
              />
              <div className="flex items-start gap-3 pl-3">
                <span className="text-gray-600 font-mono text-sm mt-0.5 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className="text-gray-300 group-hover:text-white transition-colors leading-relaxed text-sm"
                  style={{ color: hovered === v.id ? 'white' : undefined }}
                >
                  {v.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
