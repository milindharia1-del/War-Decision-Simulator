import { useState, useEffect } from 'react';
import { getMeta } from '../battleMeta';
import { rankInfo } from '../hooks/useProgress';
import Timeline from './Timeline';
import FollowUp from './FollowUp';

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
      style={{ background: 'rgba(17,14,24,0.75)', border: '1px solid rgba(61,53,48,0.6)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
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

const VOTE_KEY = (battleId, variableId) => `war-sim-vote__${battleId}__${variableId}`;

function VerdictBlock({ result, accent }) {
  const voteKey = VOTE_KEY(result.battleId, result.variableId);
  const [voted, setVoted] = useState(() => {
    try { return JSON.parse(localStorage.getItem(voteKey)); } catch { return null; }
  });
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(false);

  function castVote(agree) {
    if (voted || loading) return;
    setLoading(true);
    fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        battleId: result.battleId,
        variableId: result.variableId,
        battleName: result.battleName,
        variableLabel: result.variableLabel,
        agree,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        const v = { agree };
        localStorage.setItem(voteKey, JSON.stringify(v));
        setVoted(v);
        setCommunity(data);
      })
      .finally(() => setLoading(false));
  }

  return (
    <div className="rounded-lg p-6" style={{ background: 'rgba(17,14,24,0.75)', border: '1px solid rgba(61,53,48,0.6)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
      <div className="flex items-center gap-3 mb-4">
        <span style={{ color: 'var(--gold)' }}>⚖</span>
        <h3 className="text-white" style={{ fontFamily: 'Cinzel, serif', fontSize: '0.9rem', fontWeight: 600 }}>
          Cast Your Verdict
        </h3>
        <p className="text-sm italic ml-1" style={{ color: 'var(--ash)', fontFamily: 'EB Garamond, serif' }}>
          — Was the AI's analysis sound?
        </p>
      </div>

      {!voted ? (
        <div className="flex gap-3">
          <button
            onClick={() => castVote(true)}
            disabled={loading}
            className="flex-1 py-3 rounded transition-all text-sm"
            style={{
              border: '1px solid var(--iron)',
              color: 'var(--parchment)',
              background: 'transparent',
              fontFamily: 'Cinzel, serif',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              opacity: loading ? 0.5 : 1,
            }}
            onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.borderColor = '#2E8B57'; e.currentTarget.style.color = '#2E8B57'; e.currentTarget.style.background = '#2E8B5711'; }}}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--iron)'; e.currentTarget.style.color = 'var(--parchment)'; e.currentTarget.style.background = 'transparent'; }}
          >
            ✓ The Maester is Right
          </button>
          <button
            onClick={() => castVote(false)}
            disabled={loading}
            className="flex-1 py-3 rounded transition-all text-sm"
            style={{
              border: '1px solid var(--iron)',
              color: 'var(--parchment)',
              background: 'transparent',
              fontFamily: 'Cinzel, serif',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              opacity: loading ? 0.5 : 1,
            }}
            onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.borderColor = 'var(--blood)'; e.currentTarget.style.color = '#C0392B'; e.currentTarget.style.background = '#7A000011'; }}}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--iron)'; e.currentTarget.style.color = 'var(--parchment)'; e.currentTarget.style.background = 'transparent'; }}
          >
            ✗ I Disagree
          </button>
        </div>
      ) : (
        <div className="text-center py-2">
          <p className="text-sm mb-1" style={{ color: voted.agree ? '#2E8B57' : '#C0392B', fontFamily: 'Cinzel, serif', fontSize: '0.75rem' }}>
            {voted.agree ? '✓ You agreed with the Maester' : '✗ You challenged the Maester'}
          </p>
          {community && (
            <p className="italic text-sm" style={{ color: 'var(--ash)', fontFamily: 'EB Garamond, serif' }}>
              {community.agreePct !== null ? `${community.agreePct}% of historians agree` : ''}
              {community.agreePct !== null && community.avgScore !== null ? ' · ' : ''}
              {community.avgScore !== null ? `Community score: ${community.avgScore}/10` : ''}
              {community.totalVotes !== undefined ? ` (${community.totalVotes} vote${community.totalVotes !== 1 ? 's' : ''})` : ''}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function ResultView({ result, onReset, progress }) {
  const meta = getMeta(result.battleId);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const score = parsePlausibility(result.sections.plausibility);

  useEffect(() => {
    fetch('/api/vote/sim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        battleId: result.battleId,
        variableId: result.variableId,
        battleName: result.battleName,
        variableLabel: result.variableLabel,
      }),
    }).catch(() => {});
  }, [result.battleId, result.variableId]);

  function copyShareLink() {
    const url = `${window.location.origin}/sim/${result.battleId}/${result.variableId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

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
            filter: 'brightness(0.3) contrast(1.15) saturate(0.65)',
            animation: 'kenburns-result 28s ease-in-out infinite alternate',
          }}
        />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(7,5,10,0.4) 0%, rgba(7,5,10,0.82) 100%)' }} />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${meta.accent}88, transparent)` }} />
      </div>

      {/* Sticky header with title */}
      <div className="relative z-10 pt-10 pb-8 px-6 text-center">
        <p className="uppercase tracking-[0.3em] mb-3" style={{ color: meta.accent, fontFamily: 'Cinzel, serif', fontSize: '0.65rem', textShadow: `0 0 20px ${meta.accent}` }}>
          Alternate History · {result.battleName}
        </p>
        <h1
          className="text-white leading-tight max-w-3xl mx-auto"
          style={{
            fontFamily: 'Cinzel, serif',
            fontWeight: 700,
            fontSize: 'clamp(1.5rem, 4vw, 2.8rem)',
            textShadow: '0 2px 20px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.5)',
          }}
        >
          {result.variableLabel}
        </h1>
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="h-px w-20" style={{ background: `linear-gradient(90deg, transparent, ${meta.accent}66)` }} />
          <span style={{ color: meta.accent, fontSize: '0.8rem' }}>❖</span>
          <div className="h-px w-20" style={{ background: `linear-gradient(90deg, ${meta.accent}66, transparent)` }} />
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto px-6 pb-6">
        <Timeline result={result} />
      </div>

      {/* Sections */}
      <div className="max-w-4xl mx-auto px-6 py-4 space-y-4">
        {SECTIONS.map((s) => {
          const text = result.sections[s.key];
          if (!text) return null;
          return (
            <div
              key={s.key}
              className="rounded-lg p-6 transition-all"
              style={{
                background: 'rgba(17,14,24,0.75)',
                border: '1px solid rgba(61,53,48,0.6)',
                borderLeft: `3px solid ${s.color}`,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
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

        {/* Community verdict */}
        <VerdictBlock result={result} accent={meta.accent} />

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

        {/* Follow-up questions */}
        <FollowUp result={result} />

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

      <style>{`
        @keyframes kenburns-result {
          0%   { transform: scale(1.0) translate(0%, 0%); }
          25%  { transform: scale(1.05) translate(0.8%, -0.5%); }
          50%  { transform: scale(1.08) translate(-0.5%, 0.8%); }
          75%  { transform: scale(1.04) translate(-1%, -0.3%); }
          100% { transform: scale(1.06) translate(0.5%, 0.5%); }
        }
      `}</style>
    </div>
  );
}
