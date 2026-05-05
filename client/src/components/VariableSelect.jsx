import { useState } from 'react';
import { getMeta } from '../battleMeta';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

export default function VariableSelect({ battle, onSelect, onBack }) {
  const meta = getMeta(battle.id);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hovered, setHovered] = useState(null);

  return (
    <div className="min-h-screen text-gray-100" style={{ background: 'var(--bg-deep)', fontFamily: 'EB Garamond, serif' }}>
      {/* Hero banner */}
      <div className="relative h-72 overflow-hidden" style={{ background: meta.gradient }}>
        <img
          src={meta.img}
          alt=""
          onLoad={() => setImgLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: imgLoaded ? 0.3 : 0 }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #07050A55 0%, #07050AEE 100%)' }} />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${meta.accent}88, transparent)` }} />

        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 flex items-center gap-2 transition-colors text-sm tracking-widest uppercase backdrop-blur-sm px-4 py-2 rounded"
          style={{
            color: '#A89F8C',
            background: 'rgba(7,5,10,0.6)',
            border: '1px solid #3D3530',
            fontFamily: 'Cinzel, serif',
            fontSize: '0.7rem',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = meta.accent; e.currentTarget.style.color = meta.accent; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#3D3530'; e.currentTarget.style.color = '#A89F8C'; }}
        >
          ◂ Return
        </button>

        {/* Battle title */}
        <div className="absolute bottom-8 left-0 right-0 px-8 max-w-4xl mx-auto">
          <p
            className="uppercase mb-2 tracking-[0.25em]"
            style={{ color: meta.accent, fontFamily: 'Cinzel, serif', fontSize: '0.7rem' }}
          >
            {meta.era}
          </p>
          <h1
            className="text-4xl md:text-5xl text-white leading-tight"
            style={{ fontFamily: 'Cinzel, serif', fontWeight: 600 }}
          >
            {battle.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-10">
        <p
          className="leading-relaxed mb-10 pl-4"
          style={{
            borderLeft: `2px solid ${meta.accent}88`,
            color: 'var(--parchment)',
            fontFamily: 'EB Garamond, serif',
            fontSize: '1.15rem',
            fontStyle: 'italic',
          }}
        >
          {battle.summary}
        </p>

        {/* Section heading with ornament */}
        <div className="mb-8">
          <h2
            className="text-2xl text-white mb-3"
            style={{ fontFamily: 'Cinzel, serif', fontWeight: 600 }}
          >
            Choose Your Variable
          </h2>
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 max-w-[80px]" style={{ background: `linear-gradient(90deg, transparent, ${meta.accent}66)` }} />
            <span style={{ color: meta.accent, fontSize: '0.8rem' }}>✦</span>
            <div className="h-px" style={{ background: `${meta.accent}33`, width: '40px' }} />
          </div>
          <p className="mt-2 text-sm" style={{ color: 'var(--ash)', fontFamily: 'EB Garamond, serif', fontStyle: 'italic' }}>
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
              className="group relative text-left p-6 rounded-lg transition-all duration-200 overflow-hidden"
              style={{
                background: 'var(--bg-stone)',
                border: `1px solid ${hovered === v.id ? meta.accent : 'var(--iron)'}`,
                boxShadow: hovered === v.id ? `0 0 20px ${meta.accent}22, inset 0 0 20px ${meta.accent}08` : 'none',
              }}
            >
              {/* Left gold bar */}
              <div
                className="absolute top-0 left-0 w-0.5 h-full transition-all duration-200"
                style={{ background: hovered === v.id ? meta.accent : 'var(--iron)' }}
              />
              <div className="flex items-start gap-3 pl-3">
                <span
                  className="shrink-0 mt-0.5 text-sm"
                  style={{
                    fontFamily: 'Cinzel, serif',
                    color: hovered === v.id ? meta.accent : 'var(--ash)',
                    minWidth: '1.5rem',
                  }}
                >
                  {ROMAN[i] || String(i + 1)}
                </span>
                <span
                  className="leading-relaxed text-sm transition-colors"
                  style={{
                    fontFamily: 'EB Garamond, serif',
                    fontSize: '1rem',
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
    </div>
  );
}
