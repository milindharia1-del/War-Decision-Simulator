import { useState } from 'react';
import { getMeta } from '../battleMeta';
import { rankInfo } from '../hooks/useProgress';

const SECTIONS = [
  {
    key: 'change',
    title: 'The Decree',
    icon: '⚜',
    color: '#C9A84C',
    desc: 'What was altered',
  },
  {
    key: 'immediate',
    title: 'The First Battle',
    subtitle: '0 – 6 months',
    icon: '⚔',
    color: '#C0392B',
    desc: 'Military & political fallout',
  },
  {
    key: 'ripple',
    title: 'The Long Campaign',
    subtitle: '5 – 10 years',
    icon: '☩',
    color: '#9B7FBA',
    desc: 'Mid-term consequences',
  },
  {
    key: 'longterm',
    title: 'The Legacy',
    subtitle: 'Decades',
    icon: '♔',
    color: '#A0522D',
    desc: 'Historical legacy',
  },
  {
    key: 'inertia',
    title: 'The Unchanging',
    subtitle: 'Historical inertia',
    icon: '⚖',
    color: '#6B6357',
    desc: 'Forces too strong to change',
  },
];

function parsePlausibility(text) {
  if (!text) return null;
  const match = text.match(/\*{0,2}(\d+)(?:\/10)?\*{0,2}/);
  return match ? Math.min(10, Math.max(1, parseInt(match[1]))) : null;
}

function PlausibilityMeter({ score }) {
  const pct = (score / 10) * 100;
  const color = score >= 7 ? '#C9A84C' : score >= 4 ? '#A0522D' : '#7A0000';

  return (
    <div
      className="rounded-lg p-6"
      style={{ background: 'var(--bg-stone)', border: '1px solid var(--iron)' }}
    >
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl" style={{ color: '#C9A84C' }}>⚖</span>
        <div>
          <h3 className="text-white font-semibold" style={{ fontFamily: 'Cinzel, serif', fontSize: '0.95rem' }}>
            The Oracle's Judgment
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--ash)', fontFamily: 'EB Garamond, serif', fontStyle: 'italic' }}>
            How plausible was this alternate outcome?
          </p>
        </div>
        <div className="ml-auto text-right">
          <span className="text-5xl font-bold" style={{ color, fontFamily: 'Cinzel, serif' }}>
            {score}
          </span>
          <span className="text-xl" style={{ color: 'var(--iron)' }}>/10</span>
        </div>
      </div>

      {/* Bar */}
      <div className="h-2 rounded-full overflow-hidden mb-4" style={{ background: 'var(--iron)' }}>
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
          }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs" style={{ color: 'var(--ash)', fontFamily: 'Cinzel, serif', fontSize: '0.65rem' }}>
        <span>Impossible</span>
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
    <div className="min-h-screen text-gray-100" style={{ background: 'var(--bg-deep)', fontFamily: 'EB Garamond, serif' }}>
      {/* Hero */}
      <div className="relative h-64 overflow-hidden" style={{ background: meta.gradient }}>
        <img
          src={meta.img}
          alt=""
          onLoad={() => setImgLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: imgLoaded ? 0.25 : 0 }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #07050A33 0%, #07050Acc 60%, #07050A 100%)' }} />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${meta.accent}88, transparent)` }} />

        <div className="absolute bottom-8 left-0 right-0 max-w-4xl mx-auto px-6">
          <p className="uppercase mb-1 tracking-[0.25em]" style={{ color: meta.accent, fontFamily: 'Cinzel, serif', fontSize: '0.65rem' }}>
            Alternate History · {result.battleName}
          </p>
          <h1
            className="text-3xl md:text-4xl text-white leading-tight max-w-2xl"
            style={{ fontFamily: 'Cinzel, serif', fontWeight: 600 }}
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
              className="rounded-lg p-6 transition-all"
              style={{
                background: 'var(--bg-stone)',
                border: '1px solid var(--iron)',
                borderLeft: `3px solid ${s.color}`,
              }}
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
                      style={{ fontFamily: 'Cinzel, serif', fontSize: '0.95rem' }}
                    >
                      {s.title}
                    </h3>
                    {s.subtitle && (
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ background: `${s.color}22`, color: s.color, fontFamily: 'Cinzel, serif', fontSize: '0.6rem' }}
                      >
                        {s.subtitle}
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed" style={{ color: 'var(--parchment)', fontFamily: 'EB Garamond, serif', fontSize: '1rem' }}>{text}</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Plausibility meter */}
        {score !== null && <PlausibilityMeter score={score} />}

        {/* Plausibility justification */}
        {result.sections.plausibility && (
          <p className="italic px-2" style={{ color: 'var(--ash)', fontFamily: 'EB Garamond, serif', fontSize: '0.95rem' }}>
            {result.sections.plausibility.replace(/\*{0,2}\d+\/10\*{0,2}\s*[—–-]?\s*/i, '')}
          </p>
        )}

        {/* Rank status */}
        {progress && (() => {
          const { label, color, pct, next, nextAt } = rankInfo(progress.totalSimulations);
          return (
            <div className="flex items-center gap-3 px-1">
              <span
                className="text-xs px-2 py-1 rounded font-semibold tracking-widest uppercase"
                style={{ background: `${color}22`, color, border: `1px solid ${color}44`, fontFamily: 'Cinzel, serif', fontSize: '0.65rem' }}
              >
                {label}
              </span>
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--iron)' }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
              </div>
              {next && (
                <span className="text-xs" style={{ color: 'var(--ash)', fontFamily: 'Cinzel, serif', fontSize: '0.65rem' }}>
                  {nextAt - progress.totalSimulations} to {next.label}
                </span>
              )}
            </div>
          );
        })()}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onReset}
            className="flex-1 py-4 rounded font-medium transition-all duration-200 uppercase tracking-widest"
            style={{
              border: '1px solid var(--iron)',
              color: 'var(--ash)',
              background: 'transparent',
              fontFamily: 'Cinzel, serif',
              fontSize: '0.7rem',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold-dim)'; e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.background = '#C9A84C0A'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--iron)'; e.currentTarget.style.color = 'var(--ash)'; e.currentTarget.style.background = 'transparent'; }}
          >
            ◂ Run Another Simulation
          </button>
          <button
            onClick={copyShareLink}
            className="flex-1 py-4 rounded font-medium transition-all duration-200 uppercase tracking-widest"
            style={{
              border: `1px solid ${copied ? meta.accent : 'var(--iron)'}`,
              color: copied ? meta.accent : 'var(--ash)',
              background: copied ? `${meta.accent}11` : 'transparent',
              fontFamily: 'Cinzel, serif',
              fontSize: '0.7rem',
            }}
          >
            {copied ? '✓ Scroll Copied!' : '⎘ Copy Share Link'}
          </button>
        </div>
      </div>
    </div>
  );
}
