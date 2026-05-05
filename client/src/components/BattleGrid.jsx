import { useState, useEffect } from 'react';
import { getMeta } from '../battleMeta';
import ProgressHeader from './ProgressHeader';

const ALL_IMAGES = [
  '/images/stalingrad.jpg',
  '/images/dday.jpg',
  '/images/battle-of-britain.jpg',
  '/images/hiroshima.jpg',
  '/images/cuban-missile-crisis.jpg',
  '/images/midway.jpg',
  '/images/pearl-harbor.jpg',
  '/images/berlin-1945.jpg',
  '/images/tet-offensive.jpg',
  '/images/waterloo.jpg',
];

function BackgroundSlideshow() {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(1);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % ALL_IMAGES.length);
        setNext((n) => (n + 1) % ALL_IMAGES.length);
        setFading(false);
      }, 1800);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Current image */}
      <img
        key={current}
        src={ALL_IMAGES[current]}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: fading ? 0 : 1,
          transition: 'opacity 1.8s ease-in-out',
          filter: 'brightness(0.45) contrast(1.1) saturate(0.7)',
          transform: 'scale(1.05)',
        }}
      />
      {/* Next image — fades in underneath */}
      <img
        key={`next-${next}`}
        src={ALL_IMAGES[next]}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: fading ? 1 : 0,
          transition: 'opacity 1.8s ease-in-out',
          filter: 'brightness(0.45) contrast(1.1) saturate(0.7)',
          transform: 'scale(1.05)',
        }}
      />
      {/* Dark vignette overlay — heavier at edges, slightly lighter at centre */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(7,5,10,0.55) 0%, rgba(7,5,10,0.85) 100%)',
        }}
      />
      {/* Gold dust shimmer at very bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48"
        style={{ background: 'linear-gradient(to top, rgba(7,5,10,0.98) 0%, transparent 100%)' }}
      />
    </div>
  );
}

function BattleCard({ battle, onClick }) {
  const meta = getMeta(battle.id);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative overflow-hidden rounded-xl text-left"
      style={{
        minHeight: '300px',
        border: `1px solid ${hovered ? meta.accent : '#3D3530'}`,
        boxShadow: hovered
          ? `0 0 32px ${meta.accent}55, 0 8px 32px rgba(0,0,0,0.6)`
          : '0 4px 20px rgba(0,0,0,0.5)',
        transition: 'all 0.35s ease',
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}
    >
      {/* Full-bleed photo */}
      <img
        src={meta.img}
        alt=""
        onLoad={() => setImgLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: imgLoaded ? 1 : 0,
          transition: 'opacity 0.7s ease, transform 0.5s ease',
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
          filter: hovered ? 'brightness(0.9) contrast(1.1)' : 'brightness(0.75) contrast(1.05) saturate(0.85)',
        }}
      />

      {/* Cinematic gradient — only bottom half darkened for text */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(7,5,10,0.97) 0%, rgba(7,5,10,0.7) 35%, rgba(7,5,10,0.15) 65%, rgba(7,5,10,0.0) 100%)',
        }}
      />

      {/* Gold vignette on hover */}
      {hovered && (
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at center bottom, ${meta.accent}18 0%, transparent 65%)` }}
        />
      )}

      {/* Top accent rule */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${meta.accent}, transparent)`,
          opacity: hovered ? 1 : 0.3,
        }}
      />

      {/* Content — pinned to bottom */}
      <div className="relative z-10 flex flex-col h-full p-5 pt-12">
        <div className="mt-auto">
          <p
            className="text-xs tracking-[0.25em] uppercase mb-1.5"
            style={{ color: meta.accent, fontFamily: 'Cinzel, serif', fontSize: '0.6rem' }}
          >
            {meta.era}
          </p>
          <h2
            className="text-lg text-white mb-2 leading-tight"
            style={{ fontFamily: 'Cinzel, serif', fontWeight: 600, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
          >
            {battle.name}
          </h2>
          <p
            className="text-sm leading-relaxed line-clamp-2"
            style={{
              color: '#C8B89A',
              fontFamily: 'EB Garamond, serif',
              fontSize: '0.95rem',
              textShadow: '0 1px 4px rgba(0,0,0,0.9)',
            }}
          >
            {battle.summary}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs" style={{ color: '#6B6357', fontFamily: 'Cinzel, serif', fontSize: '0.6rem' }}>
              {battle.variables.length} Turning Points
            </span>
            <span
              className="text-xs ml-auto font-semibold transition-opacity duration-200"
              style={{
                color: meta.accent,
                fontFamily: 'Cinzel, serif',
                fontSize: '0.65rem',
                opacity: hovered ? 1 : 0,
                textShadow: `0 0 10px ${meta.accent}`,
              }}
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
    <div
      className="min-h-screen text-gray-100 relative"
      style={{ fontFamily: 'EB Garamond, serif' }}
    >
      <BackgroundSlideshow />

      {progress && <ProgressHeader progress={progress} />}

      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-8 text-center">
        <p
          className="uppercase mb-4"
          style={{ color: 'var(--gold-dim)', fontFamily: 'Cinzel, serif', fontSize: '0.65rem', letterSpacing: '0.35em' }}
        >
          Alternate History Engine
        </p>
        <h1
          className="mb-1 leading-tight"
          style={{ fontFamily: 'Cinzel Decorative, serif', fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 700, color: 'var(--gold)', textShadow: '0 0 60px rgba(201,168,76,0.4), 0 2px 12px rgba(0,0,0,0.8)' }}
        >
          War Decision
        </h1>
        <h2
          className="mb-5 leading-tight"
          style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1rem, 2.5vw, 1.6rem)', fontWeight: 400, color: '#A89F8C', letterSpacing: '0.15em' }}
        >
          Simulator
        </h2>
        <p
          className="max-w-xl mx-auto leading-relaxed"
          style={{ color: 'var(--ash)', fontFamily: 'EB Garamond, serif', fontSize: '1.15rem', fontStyle: 'italic' }}
        >
          Select a historical turning point, alter one variable, and let the Maester reason through the consequences.
        </p>

        {/* Ornamental divider */}
        <div className="mt-7 flex items-center justify-center gap-4">
          <div className="h-px flex-1 max-w-[140px]" style={{ background: 'linear-gradient(90deg, transparent, var(--gold-dim))' }} />
          <span style={{ color: 'var(--gold)', fontSize: '1.2rem', textShadow: '0 0 12px rgba(201,168,76,0.6)' }}>❖</span>
          <div className="h-px flex-1 max-w-[140px]" style={{ background: 'linear-gradient(90deg, var(--gold-dim), transparent)' }} />
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {battles.map((battle) => (
            <BattleCard key={battle.id} battle={battle} onClick={() => onSelect(battle)} />
          ))}
        </div>
      </div>
    </div>
  );
}
