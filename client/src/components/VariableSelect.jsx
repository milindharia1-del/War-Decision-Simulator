import { useState } from 'react';
import { getMeta } from '../battleMeta';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

export default function VariableSelect({ battle, onSelect, onBack }) {
  const meta = getMeta(battle.id);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hovered, setHovered] = useState(null);

  return (
    <div className="min-h-screen text-gray-100 relative" style={{ fontFamily: 'EB Garamond, serif' }}>

      {/* Full-screen Ken Burns background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <img
          src={meta.img}
          alt=""
          onLoad={() => setImgLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: imgLoaded ? 1 : 0,
            transition: 'opacity 1.2s ease',
            filter: 'brightness(0.38) contrast(1.15) saturate(0.7)',
            animation: 'kenburns 22s ease-in-out infinite alternate',
          }}
        />
        {/* Radial vignette — darker at edges */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(7,5,10,0.3) 0%, rgba(7,5,10,0.8) 100%)' }}
        />
        {/* Bottom fade to solid */}
        <div
          className="absolute bottom-0 left-0 right-0 h-64"
          style={{ background: 'linear-gradient(to top, rgba(7,5,10,0.98) 0%, transparent 100%)' }}
        />
        {/* Accent color tint at top */}
        <div
          className="absolute top-0 left-0 right-0 h-32"
          style={{ background: `linear-gradient(to bottom, ${meta.accent}18 0%, transparent 100%)` }}
        />
      </div>

      {/* Back button */}
      <div className="relative z-10 pt-6 px-8 max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 transition-all text-sm backdrop-blur-sm px-4 py-2 rounded"
          style={{
            color: '#A89F8C',
            background: 'rgba(7,5,10,0.5)',
            border: '1px solid #3D3530',
            fontFamily: 'Cinzel, serif',
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = meta.accent; e.currentTarget.style.color = meta.accent; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#3D3530'; e.currentTarget.style.color = '#A89F8C'; }}
        >
          ◂ Return
        </button>
      </div>

      {/* Battle title — large, centred hero text */}
      <div className="relative z-10 text-center pt-16 pb-10 px-6">
        <p
          className="uppercase tracking-[0.3em] mb-4"
          style={{ color: meta.accent, fontFamily: 'Cinzel, serif', fontSize: '0.65rem', textShadow: `0 0 20px ${meta.accent}` }}
        >
          {meta.era}
        </p>
        <h1
          className="text-white leading-tight mb-4"
          style={{
            fontFamily: 'Cinzel, serif',
            fontWeight: 700,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            textShadow: '0 2px 20px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.5)',
          }}
        >
          {battle.name}
        </h1>
        {/* Ornamental divider */}
        <div className="flex items-center justify-center gap-4 mt-2 mb-6">
          <div className="h-px w-24" style={{ background: `linear-gradient(90deg, transparent, ${meta.accent}88)` }} />
          <span style={{ color: meta.accent, fontSize: '0.9rem' }}>❖</span>
          <div className="h-px w-24" style={{ background: `linear-gradient(90deg, ${meta.accent}88, transparent)` }} />
        </div>
        <p
          className="max-w-2xl mx-auto leading-relaxed italic"
          style={{
            color: '#C8B89A',
            fontFamily: 'EB Garamond, serif',
            fontSize: '1.15rem',
            textShadow: '0 1px 6px rgba(0,0,0,0.9)',
          }}
        >
          {battle.summary}
        </p>
      </div>

      {/* Variable selection */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 pb-16">
        {/* Section label */}
        <div className="text-center mb-8">
          <h2
            className="text-white mb-2"
            style={{ fontFamily: 'Cinzel, serif', fontWeight: 600, fontSize: '1.3rem', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
          >
            Choose Your Variable
          </h2>
          <p className="italic text-sm" style={{ color: 'var(--ash)', fontFamily: 'EB Garamond, serif' }}>
            Alter one decision. Let history be rewritten.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {battle.variables.map((v, i) => (
            <button
              key={v.id}
              onClick={() => onSelect(battle, v)}
              onMouseEnter={() => setHovered(v.id)}
              onMouseLeave={() => setHovered(null)}
              className="relative text-left p-6 rounded-lg transition-all duration-300 overflow-hidden"
              style={{
                background: hovered === v.id ? 'rgba(7,5,10,0.85)' : 'rgba(7,5,10,0.65)',
                border: `1px solid ${hovered === v.id ? meta.accent : 'rgba(61,53,48,0.8)'}`,
                boxShadow: hovered === v.id ? `0 0 24px ${meta.accent}33, inset 0 0 20px ${meta.accent}08` : 'none',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            >
              {/* Left bar */}
              <div
                className="absolute top-0 left-0 w-0.5 h-full transition-all duration-300"
                style={{ background: hovered === v.id ? meta.accent : '#3D3530' }}
              />
              <div className="flex items-start gap-3 pl-3">
                <span
                  className="shrink-0 mt-0.5 text-sm"
                  style={{
                    fontFamily: 'Cinzel, serif',
                    color: hovered === v.id ? meta.accent : 'var(--ash)',
                    minWidth: '1.5rem',
                    textShadow: hovered === v.id ? `0 0 10px ${meta.accent}` : 'none',
                  }}
                >
                  {ROMAN[i] || String(i + 1)}
                </span>
                <span
                  className="leading-relaxed transition-colors duration-200"
                  style={{
                    fontFamily: 'EB Garamond, serif',
                    fontSize: '1.05rem',
                    color: hovered === v.id ? 'var(--parchment)' : '#A89F8C',
                  }}
                >
                  {v.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes kenburns {
          0%   { transform: scale(1.0) translate(0%, 0%); }
          25%  { transform: scale(1.06) translate(-1%, 0.5%); }
          50%  { transform: scale(1.04) translate(0.5%, -1%); }
          75%  { transform: scale(1.07) translate(1%, 0.5%); }
          100% { transform: scale(1.05) translate(-0.5%, -0.5%); }
        }
      `}</style>
    </div>
  );
}
