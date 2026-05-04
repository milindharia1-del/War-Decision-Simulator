import { useState, useEffect } from 'react';
import { getMeta } from '../battleMeta';

const MESSAGES = [
  'Consulting the historical record…',
  'Tracing the chain of causation…',
  'Weighing geopolitical consequences…',
  'Examining military logistics…',
  'Assessing political ripple effects…',
  'Calculating historical inertia…',
  'Projecting long-term outcomes…',
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
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #111 0%, #030303 100%)', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Animated orb */}
      <div className="relative mb-12">
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{
            width: '120px',
            height: '120px',
            margin: '-20px',
            border: `2px solid ${meta.accent}`,
          }}
        />
        {/* Middle ring */}
        <div
          className="absolute inset-0 rounded-full opacity-30"
          style={{
            width: '90px',
            height: '90px',
            margin: '-5px',
            border: `1px solid ${meta.accent}`,
            animation: 'spin 3s linear infinite',
          }}
        />
        {/* Core */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, ${meta.accent}33 0%, transparent 70%)`,
            border: `1px solid ${meta.accent}66`,
          }}
        >
          <div
            className="w-8 h-8 rounded-full animate-pulse"
            style={{ background: `radial-gradient(circle, ${meta.accent} 0%, ${meta.accent}44 100%)` }}
          />
        </div>
      </div>

      {/* Battle + variable */}
      <p className="text-gray-600 text-xs tracking-widest uppercase mb-2">{battle.name}</p>
      <p
        className="text-lg mb-10 max-w-md leading-relaxed"
        style={{ fontFamily: 'Playfair Display, serif', color: meta.accent }}
      >
        "{variable.label}"
      </p>

      {/* Rotating message */}
      <p
        className="text-gray-400 text-sm tracking-wide transition-opacity duration-300"
        style={{ opacity: fade ? 1 : 0 }}
      >
        {MESSAGES[msgIndex]}
      </p>

      {/* Dots */}
      <div className="flex gap-2 mt-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: meta.accent,
              animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-8px); opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
