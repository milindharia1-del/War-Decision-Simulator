import { useState, useEffect } from 'react';
import { getMeta } from '../../battleMeta';
import { FACTIONS, BATTLE_NODES, getScoreResult } from '../../data/campaignData';
import { parsePlausibility } from '../../hooks/useProgress';

export default function CampaignResult({ result, campaign, onContinue }) {
  const [revealed, setRevealed] = useState(false);
  const meta = getMeta(result.battleId);
  const faction = FACTIONS.find(f => f.id === campaign.factionId);
  const node = BATTLE_NODES[result.battleId];
  const plausibility = parsePlausibility(result.sections?.plausibility);
  const { outcome, label, pts, territoryState } = getScoreResult(plausibility);
  const [imgLoaded, setImgLoaded] = useState(false);

  const outcomeColor =
    territoryState === 'captured'  ? faction?.color :
    territoryState === 'contested' ? '#C9A84C' : '#7A0000';

  const outcomeIcon =
    outcome === 'decisive' ? '♔' :
    outcome === 'pyrrhic'  ? '⚜' :
    outcome === 'defeat'   ? '⚔' : '✗';

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative" style={{ background: 'var(--bg-deep)', fontFamily: 'EB Garamond, serif' }}>

      {/* Battle background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <img
          src={meta.img}
          alt=""
          onLoad={() => setImgLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: imgLoaded ? 1 : 0, filter: 'brightness(0.2) saturate(0.5)', transition: 'opacity 1s ease' }}
        />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 40%, ${outcomeColor}18 0%, rgba(7,5,10,0.92) 60%)` }} />
      </div>

      {/* Glow orb */}
      <div
        className="w-28 h-28 rounded-full flex items-center justify-center mb-8"
        style={{
          background: `radial-gradient(circle, ${outcomeColor}33 0%, transparent 70%)`,
          border: `1px solid ${outcomeColor}55`,
          boxShadow: revealed ? `0 0 60px ${outcomeColor}44` : 'none',
          transition: 'box-shadow 1s ease',
        }}
      >
        <span
          className="text-5xl"
          style={{
            color: outcomeColor,
            textShadow: `0 0 20px ${outcomeColor}`,
            opacity: revealed ? 1 : 0,
            transition: 'opacity 0.8s ease 0.4s',
          }}
        >
          {outcomeIcon}
        </span>
      </div>

      {/* Battle name */}
      <p className="uppercase tracking-[0.3em] mb-2" style={{ color: meta.accent, fontFamily: 'Cinzel, serif', fontSize: '0.65rem' }}>
        {node?.region} · {result.battleName}
      </p>

      {/* Outcome title */}
      <h1
        className="text-center mb-1"
        style={{
          fontFamily: 'Cinzel Decorative, serif',
          fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
          color: outcomeColor,
          textShadow: `0 0 40px ${outcomeColor}55`,
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'none' : 'translateY(10px)',
          transition: 'all 0.8s ease 0.3s',
        }}
      >
        {label}
      </h1>

      {/* Territory result */}
      <p className="italic mb-6" style={{ color: 'var(--parchment)', fontFamily: 'EB Garamond, serif', fontSize: '1.1rem' }}>
        {territoryState === 'captured'
          ? `${node?.label} falls under your command.`
          : territoryState === 'contested'
          ? `${node?.label} remains bitterly contested.`
          : `${node?.label} holds. Your forces retreat.`}
      </p>

      {/* Ornament */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-px w-20" style={{ background: `linear-gradient(90deg, transparent, ${outcomeColor}66)` }} />
        <span style={{ color: outcomeColor }}>❖</span>
        <div className="h-px w-20" style={{ background: `linear-gradient(90deg, ${outcomeColor}66, transparent)` }} />
      </div>

      {/* Stats cards */}
      <div className="flex gap-6 mb-4 flex-wrap justify-center">
        <div className="text-center px-6 py-3 rounded-lg" style={{ background: 'rgba(17,14,24,0.85)', border: '1px solid var(--iron)', backdropFilter: 'blur(8px)' }}>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--ash)', fontFamily: 'Cinzel, serif', fontSize: '0.6rem' }}>Plausibility</p>
          <p className="text-3xl font-bold" style={{ color: outcomeColor, fontFamily: 'Cinzel, serif' }}>{plausibility ?? '?'}<span className="text-lg" style={{ color: 'var(--ash)' }}>/10</span></p>
        </div>
        <div className="text-center px-6 py-3 rounded-lg" style={{ background: 'rgba(17,14,24,0.85)', border: '1px solid var(--iron)', backdropFilter: 'blur(8px)' }}>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--ash)', fontFamily: 'Cinzel, serif', fontSize: '0.6rem' }}>Points Earned</p>
          <p className="text-3xl font-bold" style={{ color: 'var(--gold)', fontFamily: 'Cinzel, serif' }}>+{pts}</p>
        </div>
        <div className="text-center px-6 py-3 rounded-lg" style={{ background: 'rgba(17,14,24,0.85)', border: '1px solid var(--iron)', backdropFilter: 'blur(8px)' }}>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--ash)', fontFamily: 'Cinzel, serif', fontSize: '0.6rem' }}>Total Score</p>
          <p className="text-3xl font-bold" style={{ color: 'var(--parchment)', fontFamily: 'Cinzel, serif' }}>{campaign.totalScore}</p>
        </div>
      </div>

      {/* Variable chosen */}
      <p className="italic text-center max-w-lg mb-10" style={{ color: 'var(--ash)', fontFamily: 'EB Garamond, serif', fontSize: '0.95rem' }}>
        "{result.variableLabel}"
      </p>

      {/* Continue */}
      <button
        onClick={onContinue}
        className="px-10 py-4 rounded uppercase tracking-widest transition-all duration-300"
        style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '0.75rem',
          fontWeight: 600,
          background: `${faction?.color}22`,
          border: `1px solid ${faction?.color}`,
          color: faction?.color,
          boxShadow: `0 0 20px ${faction?.color}33`,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = `${faction?.color}44`; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = `${faction?.color}22`; }}
      >
        ▸ Continue Campaign
      </button>
    </div>
  );
}
