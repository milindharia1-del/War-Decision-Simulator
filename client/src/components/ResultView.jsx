import { useState } from 'react';
import { getMeta } from '../battleMeta';
import { rankInfo } from '../hooks/useProgress';

const SECTIONS = [
  {
    key: 'change',
    title: 'The Change',
    icon: '⟳',
    color: '#60a5fa',
    desc: 'What was altered',
  },
  {
    key: 'immediate',
    title: 'Immediate Consequences',
    subtitle: '0 – 6 months',
    icon: '⚔',
    color: '#f87171',
    desc: 'Military & political fallout',
  },
  {
    key: 'ripple',
    title: 'Ripple Effects',
    subtitle: '5 – 10 years',
    icon: '◎',
    color: '#fb923c',
    desc: 'Mid-term consequences',
  },
  {
    key: 'longterm',
    title: 'Long-term Consequences',
    subtitle: 'Decades',
    icon: '▸',
    color: '#c084fc',
    desc: 'Historical legacy',
  },
  {
    key: 'inertia',
    title: 'What Stayed the Same',
    subtitle: 'Historical inertia',
    icon: '≈',
    color: '#94a3b8',
    desc: 'Forces too strong to change',
  },
];

function parsePlausibility(text) {
  if (!text) return null;
  const match = text.match(/\*{0,2}(\d+)(?:\/10)?\*{0,2}/);
  return match ? Math.min(10, Math.max(1, parseInt(match[1]))) : null;
}

function PlausibilityMeter({ score, accent }) {
  const pct = (score / 10) * 100;
  const color = score >= 7 ? '#34d399' : score >= 4 ? '#fbbf24' : '#f87171';

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl">🎯</span>
        <div>
          <h3 className="text-white font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>
            Plausibility Score
          </h3>
          <p className="text-gray-500 text-xs">How likely was this alternate outcome?</p>
        </div>
        <div className="ml-auto text-right">
          <span className="text-5xl font-bold" style={{ color, fontFamily: 'Playfair Display, serif' }}>
            {score}
          </span>
          <span className="text-gray-600 text-xl">/10</span>
        </div>
      </div>

      {/* Bar */}
      <div className="h-3 bg-gray-800 rounded-full overflow-hidden mb-4">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
          }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-gray-600">
        <span>Implausible</span>
        <span>Speculative</span>
        <span>Plausible</span>
        <span>Likely</span>
      </div>
    </div>
  );
}

export default function ResultView({ result, onReset, progress }) {
  const meta = getMeta(result.battleId);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const score = parsePlausibility(result.sections.plausibility);

  function copyShareLink() {
    const url = `${window.location.origin}/sim/${result.battleId}/${result.variableId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Hero */}
      <div className="relative h-64 overflow-hidden" style={{ background: meta.gradient }}>
        <img
          src={meta.img}
          alt=""
          onLoad={() => setImgLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: imgLoaded ? 0.35 : 0 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-gray-950" />

        <div className="absolute bottom-8 left-0 right-0 max-w-4xl mx-auto px-6">
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: meta.accent }}>
            Alternate History · {result.battleName}
          </p>
          <h1
            className="text-3xl md:text-4xl text-white leading-tight max-w-2xl"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {result.variableLabel}
          </h1>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-4">
        {SECTIONS.map((s) => {
          const text = result.sections[s.key];
          if (!text) return null;
          return (
            <div
              key={s.key}
              className="rounded-2xl border border-gray-800 bg-gray-900 p-6 transition-all hover:border-gray-700"
              style={{ borderLeftWidth: '3px', borderLeftColor: s.color }}
            >
              <div className="flex items-start gap-4">
                <span
                  className="text-xl mt-0.5 shrink-0 w-8 text-center"
                  style={{ color: s.color }}
                >
                  {s.icon}
                </span>
                <div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <h3
                      className="text-white font-semibold"
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      {s.title}
                    </h3>
                    {s.subtitle && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: `${s.color}22`, color: s.color }}
                      >
                        {s.subtitle}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 leading-relaxed text-sm">{text}</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Plausibility meter */}
        {score !== null && <PlausibilityMeter score={score} accent={meta.accent} />}

        {/* Plausibility justification text */}
        {result.sections.plausibility && (
          <p className="text-gray-500 text-sm italic px-2">
            {result.sections.plausibility.replace(/\*{0,2}\d+\/10\*{0,2}\s*[—–-]?\s*/i, '')}
          </p>
        )}

        {/* Rank status */}
        {progress && (() => {
          const { label, color, pct, next, nextAt } = rankInfo(progress.totalSimulations);
          return (
            <div className="flex items-center gap-3 px-1">
              <span className="text-xs px-2 py-1 rounded-full font-semibold tracking-widest uppercase"
                style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}>
                {label}
              </span>
              <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
              </div>
              {next && <span className="text-gray-600 text-xs">{nextAt - progress.totalSimulations} to {next.label}</span>}
            </div>
          );
        })()}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onReset}
            className="flex-1 py-4 rounded-xl font-medium transition-all duration-200 text-gray-300 border border-gray-700 hover:border-amber-700 hover:text-amber-300 hover:bg-gray-900"
          >
            ← Run Another Simulation
          </button>
          <button
            onClick={copyShareLink}
            className="flex-1 py-4 rounded-xl font-medium transition-all duration-200 border"
            style={{
              borderColor: copied ? meta.accent : '#374151',
              color: copied ? meta.accent : '#9ca3af',
              background: copied ? `${meta.accent}11` : 'transparent',
            }}
          >
            {copied ? '✓ Link Copied!' : '⎘ Copy Share Link'}
          </button>
        </div>
      </div>
    </div>
  );
}
