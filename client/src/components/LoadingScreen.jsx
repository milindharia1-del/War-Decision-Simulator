import { useState, useEffect } from 'react';
import { getMeta } from '../battleMeta';

const MESSAGES = [
  'The ravens have been dispatched…',
  'The Maester consults the scrolls…',
  'The armies are on the move…',
  'The council deliberates…',
  'Fate hangs in the balance…',
  'The histories are being rewritten…',
  'The gods consider your question…',
];

export default function LoadingScreen({ battle, variable }) {
  const meta = getMeta(battle.id);
  const [msgIndex, setMsgIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % MESSAGES.length);
        setFade(true);
      }, 300);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: 'var(--bg-deep)', fontFamily: 'EB Garamond, serif' }}
    >
      {/* Rotating compass rose */}
      <div className="relative mb-12" style={{ width: '100px', height: '100px' }}>
        {/* Outer ring — slow spin */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: `1px solid ${meta.accent}55`,
            animation: 'spin-slow 8s linear infinite',
          }}
        />
        {/* Compass points on outer ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: `1px dashed ${meta.accent}33`,
            animation: 'spin-slow 12s linear infinite reverse',
          }}
        />
        {/* Inner ring — opposite spin */}
        <div
          className="absolute rounded-full"
          style={{
            width: '64px',
            height: '64px',
            top: '18px',
            left: '18px',
            border: `1px solid ${meta.accent}77`,
            animation: 'spin-slow 5s linear infinite reverse',
          }}
        />
        {/* Core diamond */}
        <div
          className="absolute"
          style={{
            width: '20px',
            height: '20px',
            top: '40px',
            left: '40px',
            background: meta.accent,
            transform: 'rotate(45deg)',
            animation: 'pulse-glow 2s ease-in-out infinite',
            boxShadow: `0 0 12px ${meta.accent}`,
          }}
        />
        {/* Glow halo */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${meta.accent}22 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Battle + variable */}
      <p
        className="uppercase tracking-[0.25em] mb-3"
        style={{ color: 'var(--ash)', fontFamily: 'Cinzel, serif', fontSize: '0.65rem' }}
      >
        {battle.name}
      </p>
      <p
        className="mb-10 max-w-md leading-relaxed italic"
        style={{ fontFamily: 'Cinzel, serif', color: meta.accent, fontSize: '1.1rem' }}
      >
        "{variable.label}"
      </p>

      {/* Rotating message */}
      <p
        className="tracking-wide transition-opacity duration-300"
        style={{
          opacity: fade ? 1 : 0,
          color: 'var(--ash)',
          fontFamily: 'EB Garamond, serif',
          fontSize: '1rem',
          fontStyle: 'italic',
        }}
      >
        {MESSAGES[msgIndex]}
      </p>

      {/* Gold dots */}
      <div className="flex gap-3 mt-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: meta.accent,
              animation: `bounce 1.4s ease-in-out ${i * 0.25}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.3; }
          40% { transform: translateY(-8px); opacity: 1; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.7; transform: rotate(45deg) scale(0.9); }
          50% { opacity: 1; transform: rotate(45deg) scale(1.15); }
        }
      `}</style>
    </div>
  );
}
