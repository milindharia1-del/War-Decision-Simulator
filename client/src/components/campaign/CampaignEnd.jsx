import { FACTIONS, BATTLE_NODES, CAMPAIGN_SEQUENCE, MAX_POSSIBLE_SCORE, getCommanderTitle } from '../../data/campaignData';
import WorldMap from './WorldMap';

export default function CampaignEnd({ campaign, onExit, onRestart }) {
  const faction = FACTIONS.find(f => f.id === campaign.factionId);
  const { title, color: titleColor } = getCommanderTitle(campaign.totalScore);
  const scorePct = Math.round((campaign.totalScore / MAX_POSSIBLE_SCORE) * 100);

  const capturedCount  = Object.values(campaign.battles).filter(b => b.territoryState === 'captured').length;
  const contestedCount = Object.values(campaign.battles).filter(b => b.territoryState === 'contested').length;
  const lostCount      = Object.values(campaign.battles).filter(b => b.territoryState === 'lost').length;

  const verdict =
    scorePct >= 85 ? 'History bends to your will. You are without equal.' :
    scorePct >= 65 ? 'A campaign of great victories, not without sacrifice.' :
    scorePct >= 45 ? 'You fought bravely. History remains contested.' :
    scorePct >= 25 ? 'The tide turned against you. Study. Return. Conquer.' :
    'The realm is not ready for your command. Train harder.';

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-deep)', fontFamily: 'EB Garamond, serif' }}>

      {/* Ambient glow */}
      <div className="fixed inset-0 -z-10" style={{ background: `radial-gradient(ellipse at 50% 30%, ${titleColor}12 0%, #07050A 65%)` }} />

      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="uppercase tracking-[0.35em] mb-3" style={{ color: 'var(--gold-dim)', fontFamily: 'Cinzel, serif', fontSize: '0.6rem' }}>
            Campaign Complete
          </p>
          <span className="text-5xl block mb-4" style={{ color: faction?.color, textShadow: `0 0 30px ${faction?.color}` }}>
            {faction?.emblem}
          </span>
          <h1 style={{ fontFamily: 'Cinzel Decorative, serif', fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: titleColor, textShadow: `0 0 40px ${titleColor}55` }}>
            {title}
          </h1>
          <p className="mt-2 italic" style={{ color: 'var(--parchment)', fontFamily: 'EB Garamond, serif', fontSize: '1.15rem' }}>
            {faction?.name}
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 mt-5 mb-5">
            <div className="h-px w-28" style={{ background: `linear-gradient(90deg, transparent, ${titleColor}66)` }} />
            <span style={{ color: titleColor }}>❖</span>
            <div className="h-px w-28" style={{ background: `linear-gradient(90deg, ${titleColor}66, transparent)` }} />
          </div>

          <p className="italic max-w-lg mx-auto" style={{ color: 'var(--ash)', fontFamily: 'EB Garamond, serif', fontSize: '1.05rem' }}>
            {verdict}
          </p>
        </div>

        {/* Score stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Final Score',  value: campaign.totalScore, suffix: `/ ${MAX_POSSIBLE_SCORE}`, color: 'var(--gold)' },
            { label: 'Territories Captured',  value: capturedCount,  color: faction?.color },
            { label: 'Contested',    value: contestedCount, color: '#C9A84C' },
            { label: 'Lost',         value: lostCount,      color: '#7A0000' },
          ].map(({ label, value, suffix, color }) => (
            <div key={label} className="text-center py-4 rounded-lg" style={{ background: 'rgba(17,14,24,0.85)', border: '1px solid var(--iron)' }}>
              <p className="text-2xl font-bold mb-1" style={{ color, fontFamily: 'Cinzel, serif' }}>
                {value}{suffix ? <span className="text-sm" style={{ color: 'var(--ash)' }}> {suffix}</span> : null}
              </p>
              <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--ash)', fontFamily: 'Cinzel, serif', fontSize: '0.55rem' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Score bar */}
        <div className="mb-8 px-1">
          <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--ash)', fontFamily: 'Cinzel, serif', fontSize: '0.6rem' }}>
            <span>0</span>
            <span>{scorePct}% of maximum</span>
            <span>{MAX_POSSIBLE_SCORE}</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--iron)' }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${scorePct}%`, background: `linear-gradient(90deg, ${titleColor}88, ${titleColor})` }}
            />
          </div>
        </div>

        {/* Final map */}
        <div className="mb-8">
          <p className="uppercase tracking-widest mb-3 text-center" style={{ color: 'var(--ash)', fontFamily: 'Cinzel, serif', fontSize: '0.6rem' }}>
            Final State of the Campaign
          </p>
          <WorldMap campaign={campaign} battles={[]} currentBattleId={null} />
        </div>

        {/* Battle log */}
        <div className="mb-8">
          <p className="uppercase tracking-widest mb-3" style={{ color: 'var(--ash)', fontFamily: 'Cinzel, serif', fontSize: '0.6rem' }}>The Chronicle of Battles</p>
          <div className="space-y-2">
            {CAMPAIGN_SEQUENCE.map((id, i) => {
              const r = campaign.battles[id];
              const node = BATTLE_NODES[id];
              if (!r || !node) return null;
              const c = r.territoryState === 'captured' ? faction?.color : r.territoryState === 'contested' ? '#C9A84C' : '#7A0000';
              return (
                <div key={id} className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: 'rgba(10,8,6,0.7)', border: `1px solid ${c}33` }}>
                  <span style={{ color: 'var(--ash)', fontFamily: 'Cinzel, serif', fontSize: '0.65rem', minWidth: '1.5rem' }}>
                    {['I','II','III','IV','V','VI','VII','VIII','IX','X'][i]}
                  </span>
                  <span style={{ color: c, fontSize: '0.8rem' }}>
                    {r.territoryState === 'captured' ? '✓' : r.territoryState === 'contested' ? '~' : '✗'}
                  </span>
                  <div className="flex-1">
                    <span className="text-sm" style={{ color: 'var(--parchment)', fontFamily: 'Cinzel, serif', fontSize: '0.7rem' }}>{node.label}</span>
                    <span className="text-xs italic ml-2" style={{ color: 'var(--ash)', fontFamily: 'EB Garamond, serif' }}>{r.label}</span>
                  </div>
                  <span className="text-xs" style={{ color: c, fontFamily: 'Cinzel, serif', fontSize: '0.65rem' }}>+{r.pts}pt</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <button
            onClick={onRestart}
            className="flex-1 py-4 rounded uppercase tracking-widest transition-all"
            style={{ fontFamily: 'Cinzel, serif', fontSize: '0.7rem', border: `1px solid ${faction?.color}`, color: faction?.color, background: `${faction?.color}11` }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `${faction?.color}33`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = `${faction?.color}11`; }}
          >
            ⚔ New Campaign
          </button>
          <button
            onClick={onExit}
            className="flex-1 py-4 rounded uppercase tracking-widest transition-all"
            style={{ fontFamily: 'Cinzel, serif', fontSize: '0.7rem', border: '1px solid var(--iron)', color: 'var(--ash)', background: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold-dim)'; e.currentTarget.style.color = 'var(--gold)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--iron)'; e.currentTarget.style.color = 'var(--ash)'; }}
          >
            ◂ Return to Free Play
          </button>
        </div>
      </div>
    </div>
  );
}
