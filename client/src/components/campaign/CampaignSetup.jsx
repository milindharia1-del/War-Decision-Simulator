import { useState } from 'react';
import { FACTIONS } from '../../data/campaignData';

export default function CampaignSetup({ onStart, onBack }) {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative" style={{ background: 'var(--bg-deep)', fontFamily: 'EB Garamond, serif' }}>

      {/* Ambient background */}
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at 50% 40%, #1A100800 0%, #07050A 70%)' }} />

      {/* Back */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 transition-colors text-sm"
        style={{ color: 'var(--ash)', fontFamily: 'Cinzel, serif', fontSize: '0.7rem', letterSpacing: '0.15em' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ash)'; }}
      >
        ◂ Return
      </button>

      {/* Title */}
      <p className="uppercase tracking-[0.35em] mb-3" style={{ color: 'var(--gold-dim)', fontFamily: 'Cinzel, serif', fontSize: '0.65rem' }}>
        Solo Campaign
      </p>
      <h1 className="text-white text-center mb-2" style={{ fontFamily: 'Cinzel Decorative, serif', fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--gold)', textShadow: '0 0 40px rgba(201,168,76,0.35)' }}>
        Choose Your Faction
      </h1>
      <p className="italic text-center mb-3" style={{ color: 'var(--ash)', fontFamily: 'EB Garamond, serif', fontSize: '1.1rem' }}>
        Your decisions will shape the course of history.
      </p>

      {/* Ornament */}
      <div className="flex items-center gap-4 mb-10">
        <div className="h-px w-24" style={{ background: 'linear-gradient(90deg, transparent, var(--gold-dim))' }} />
        <span style={{ color: 'var(--gold)' }}>❖</span>
        <div className="h-px w-24" style={{ background: 'linear-gradient(90deg, var(--gold-dim), transparent)' }} />
      </div>

      {/* Faction grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mb-10">
        {FACTIONS.map((f) => {
          const isSelected = selected === f.id;
          const isHovered = hovered === f.id;
          const active = isSelected || isHovered;
          return (
            <button
              key={f.id}
              onClick={() => setSelected(f.id)}
              onMouseEnter={() => setHovered(f.id)}
              onMouseLeave={() => setHovered(null)}
              className="relative text-left p-6 rounded-lg transition-all duration-300 overflow-hidden"
              style={{
                background: isSelected ? `${f.color}18` : 'rgba(17,14,24,0.8)',
                border: `1px solid ${active ? f.color : 'var(--iron)'}`,
                boxShadow: isSelected ? `0 0 30px ${f.color}33` : active ? `0 0 16px ${f.color}22` : 'none',
              }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${f.color}, transparent)`, opacity: active ? 1 : 0 }} />

              <div className="flex items-start gap-4">
                <span className="text-3xl shrink-0 mt-0.5" style={{ color: f.color, textShadow: active ? `0 0 16px ${f.color}` : 'none', transition: 'text-shadow 0.3s' }}>
                  {f.emblem}
                </span>
                <div>
                  <h3 className="text-white mb-1" style={{ fontFamily: 'Cinzel, serif', fontSize: '1rem', fontWeight: 600 }}>
                    {f.name}
                  </h3>
                  <p className="text-sm leading-relaxed italic mb-2" style={{ color: 'var(--parchment)', fontFamily: 'EB Garamond, serif' }}>
                    {f.description}
                  </p>
                  <p className="text-xs" style={{ color: f.color, fontFamily: 'Cinzel, serif', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
                    "{f.motto}"
                  </p>
                </div>
              </div>

              {isSelected && (
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full" style={{ background: f.color, boxShadow: `0 0 8px ${f.color}` }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Begin button */}
      <button
        onClick={() => selected && onStart(selected)}
        disabled={!selected}
        className="px-12 py-4 rounded uppercase tracking-widest transition-all duration-300"
        style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '0.8rem',
          fontWeight: 600,
          background: selected ? `${FACTIONS.find(f => f.id === selected)?.color}22` : 'transparent',
          border: `1px solid ${selected ? FACTIONS.find(f => f.id === selected)?.color : 'var(--iron)'}`,
          color: selected ? FACTIONS.find(f => f.id === selected)?.color : 'var(--ash)',
          boxShadow: selected ? `0 0 24px ${FACTIONS.find(f => f.id === selected)?.color}33` : 'none',
          opacity: selected ? 1 : 0.4,
          cursor: selected ? 'pointer' : 'not-allowed',
        }}
      >
        ⚔ Begin Campaign
      </button>
    </div>
  );
}
