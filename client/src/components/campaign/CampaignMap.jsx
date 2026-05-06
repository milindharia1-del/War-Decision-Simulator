import { getMeta } from '../../battleMeta';
import { FACTIONS, BATTLE_NODES, CAMPAIGN_SEQUENCE, MAX_POSSIBLE_SCORE, getCommanderTitle } from '../../data/campaignData';
import WorldMap from './WorldMap';

export default function CampaignMap({ campaign, battles, currentBattleId, onAttack, onAbandon }) {
  const faction = FACTIONS.find(f => f.id === campaign.factionId);
  const currentNode = BATTLE_NODES[currentBattleId];
  const currentBattle = battles.find(b => b.id === currentBattleId);
  const battlesPlayed = campaign.currentIndex;
  const { title: commanderTitle, color: titleColor } = getCommanderTitle(campaign.totalScore);
  const scorePct = Math.min(100, (campaign.totalScore / MAX_POSSIBLE_SCORE) * 100);
  const meta = currentBattleId ? getMeta(currentBattleId) : null;

  const capturedCount  = Object.values(campaign.battles).filter(b => b.territoryState === 'captured').length;
  const contestedCount = Object.values(campaign.battles).filter(b => b.territoryState === 'contested').length;
  const lostCount      = Object.values(campaign.battles).filter(b => b.territoryState === 'lost').length;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-deep)', fontFamily: 'EB Garamond, serif' }}>

      {/* Top HQ bar */}
      <div
        className="flex flex-wrap items-center gap-4 px-6 py-3"
        style={{ background: '#0A0806', borderBottom: '1px solid var(--iron)', fontFamily: 'Cinzel, serif' }}
      >
        {/* Faction badge */}
        <div className="flex items-center gap-2">
          <span style={{ color: faction?.color, fontSize: '1.1rem' }}>{faction?.emblem}</span>
          <span className="uppercase tracking-widest text-xs" style={{ color: faction?.color, fontSize: '0.65rem' }}>
            {faction?.name}
          </span>
        </div>

        <div className="h-4 w-px" style={{ background: 'var(--iron)' }} />

        {/* Score */}
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-widest text-xs" style={{ color: 'var(--ash)', fontSize: '0.6rem' }}>Score</span>
          <span style={{ color: 'var(--gold)', fontFamily: 'Cinzel, serif', fontSize: '0.85rem', fontWeight: 600 }}>
            {campaign.totalScore}
          </span>
          <span style={{ color: 'var(--ash)', fontSize: '0.65rem' }}>/ {MAX_POSSIBLE_SCORE}</span>
        </div>

        {/* Score bar */}
        <div className="flex-1 max-w-[160px] h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--iron)' }}>
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${scorePct}%`, background: faction?.color }} />
        </div>

        {/* Commander title */}
        <span className="text-xs px-2 py-0.5 rounded uppercase tracking-widest" style={{ color: titleColor, border: `1px solid ${titleColor}44`, background: `${titleColor}11`, fontSize: '0.6rem' }}>
          {commanderTitle}
        </span>

        {/* Territory counters */}
        <div className="flex items-center gap-3 ml-auto text-xs" style={{ fontFamily: 'Cinzel, serif', fontSize: '0.6rem' }}>
          <span style={{ color: faction?.color }}>✓ {capturedCount}</span>
          <span style={{ color: '#C9A84C' }}>~ {contestedCount}</span>
          <span style={{ color: '#7A0000' }}>✗ {lostCount}</span>
          <span style={{ color: 'var(--ash)' }}>{CAMPAIGN_SEQUENCE.length - battlesPlayed} remaining</span>
        </div>

        {/* Abandon */}
        <button
          onClick={onAbandon}
          className="text-xs transition-colors"
          style={{ color: 'var(--ash)', fontFamily: 'Cinzel, serif', fontSize: '0.6rem', letterSpacing: '0.1em' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#7A0000'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ash)'; }}
        >
          ✕ Abandon
        </button>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="text-center mb-5">
          <p className="uppercase tracking-[0.35em] mb-1" style={{ color: 'var(--gold-dim)', fontFamily: 'Cinzel, serif', fontSize: '0.6rem' }}>
            Campaign Map
          </p>
          <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', color: 'var(--gold)', textShadow: '0 0 30px rgba(201,168,76,0.3)' }}>
            War Decision Simulator
          </h1>
          <p className="italic mt-1" style={{ color: 'var(--ash)', fontFamily: 'EB Garamond, serif', fontSize: '1rem' }}>
            Battle {battlesPlayed + 1} of {CAMPAIGN_SEQUENCE.length}
          </p>
        </div>

        {/* World map */}
        <WorldMap
          campaign={campaign}
          battles={battles}
          currentBattleId={currentBattleId}
          onNodeClick={onAttack}
        />

        {/* Current battle panel */}
        {currentBattle && currentNode && (
          <div
            className="mt-4 rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5"
            style={{
              background: 'rgba(17,14,24,0.9)',
              border: `1px solid ${faction?.color}44`,
              backdropFilter: 'blur(8px)',
            }}
          >
            {/* Battle info */}
            <div className="flex-1">
              <p className="uppercase tracking-widest mb-1" style={{ color: meta?.accent, fontFamily: 'Cinzel, serif', fontSize: '0.6rem' }}>
                ⚔ Next Engagement — {currentNode.region}
              </p>
              <h2 className="text-white mb-1" style={{ fontFamily: 'Cinzel, serif', fontWeight: 600, fontSize: '1.2rem' }}>
                {currentBattle.name}
              </h2>
              <p className="italic" style={{ color: 'var(--parchment)', fontFamily: 'EB Garamond, serif', fontSize: '1rem' }}>
                {currentBattle.summary}
              </p>
            </div>

            {/* Attack button */}
            <button
              onClick={onAttack}
              className="shrink-0 px-8 py-3 rounded uppercase tracking-widest transition-all duration-300"
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: `${faction?.color}22`,
                border: `1px solid ${faction?.color}`,
                color: faction?.color,
                boxShadow: `0 0 20px ${faction?.color}33`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = `${faction?.color}44`; e.currentTarget.style.boxShadow = `0 0 32px ${faction?.color}55`; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = `${faction?.color}22`; e.currentTarget.style.boxShadow = `0 0 20px ${faction?.color}33`; }}
            >
              ⚔ Enter Battle
            </button>
          </div>
        )}

        {/* Past battles log */}
        {battlesPlayed > 0 && (
          <div className="mt-4">
            <p className="uppercase tracking-widest mb-2" style={{ color: 'var(--ash)', fontFamily: 'Cinzel, serif', fontSize: '0.6rem' }}>
              Battle Record
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {CAMPAIGN_SEQUENCE.slice(0, battlesPlayed).map((id) => {
                const r = campaign.battles[id];
                const node = BATTLE_NODES[id];
                if (!r || !node) return null;
                const c = r.territoryState === 'captured' ? faction?.color : r.territoryState === 'contested' ? '#C9A84C' : '#7A0000';
                return (
                  <div key={id} className="flex items-center gap-3 px-3 py-2 rounded" style={{ background: 'rgba(10,8,6,0.6)', border: `1px solid ${c}33` }}>
                    <span style={{ color: c, fontSize: '0.75rem' }}>
                      {r.territoryState === 'captured' ? '✓' : r.territoryState === 'contested' ? '~' : '✗'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs" style={{ color: 'var(--parchment)', fontFamily: 'Cinzel, serif', fontSize: '0.65rem' }}>{node.label}</p>
                      <p className="text-xs italic truncate" style={{ color: 'var(--ash)', fontFamily: 'EB Garamond, serif', fontSize: '0.8rem' }}>{r.label}</p>
                    </div>
                    <span className="text-xs shrink-0" style={{ color: c, fontFamily: 'Cinzel, serif', fontSize: '0.65rem' }}>+{r.pts}pt</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
