import { getMeta } from '../../battleMeta';
import { BATTLE_NODES, CAMPAIGN_SEQUENCE, FACTIONS } from '../../data/campaignData';

const CONTINENT_PATHS = [
  // North America
  "M 90,90 L 140,70 L 210,65 L 265,78 L 315,88 L 348,105 L 358,135 L 348,170 L 330,205 L 308,235 L 280,265 L 255,290 L 225,300 L 195,282 L 165,272 L 140,262 L 118,242 L 100,212 L 85,175 L 80,138 L 82,108 Z",
  // South America
  "M 220,298 L 258,287 L 302,292 L 336,308 L 362,338 L 368,378 L 358,418 L 336,452 L 305,472 L 275,478 L 248,462 L 228,437 L 216,402 L 212,362 L 213,326 Z",
  // Europe
  "M 422,95 L 442,78 L 465,73 L 495,78 L 518,73 L 538,85 L 558,78 L 582,95 L 592,118 L 585,138 L 572,148 L 582,168 L 568,178 L 555,188 L 530,192 L 508,186 L 488,198 L 468,190 L 450,178 L 430,166 L 420,142 L 418,118 Z",
  // Africa
  "M 440,198 L 472,190 L 508,194 L 545,192 L 582,198 L 622,212 L 652,232 L 668,268 L 660,312 L 640,358 L 610,398 L 578,422 L 545,428 L 512,418 L 485,392 L 460,358 L 442,312 L 438,268 L 448,232 Z",
  // Asia
  "M 558,78 L 622,62 L 702,58 L 775,62 L 842,58 L 900,72 L 952,98 L 968,132 L 948,168 L 905,188 L 862,205 L 835,225 L 805,242 L 775,258 L 748,248 L 720,252 L 700,248 L 680,232 L 660,218 L 638,208 L 618,198 L 600,182 L 585,162 L 570,142 L 558,112 L 555,92 Z",
  // Australia
  "M 795,342 L 838,332 L 880,338 L 915,348 L 942,368 L 948,392 L 932,418 L 895,432 L 855,438 L 820,428 L 798,402 L 788,372 Z",
];

const REGION_LABELS = [
  { x: 195, y: 185, text: 'AMERICAS' },
  { x: 490, y: 248, text: 'AFRICA' },
  { x: 490, y: 130, text: 'EUROPE' },
  { x: 710, y: 145, text: 'EASTERN FRONT' },
  { x: 870, y: 145, text: 'PACIFIC' },
  { x: 870, y: 430, text: 'AUSTRALIA' },
];

function stateColor(state, factionColor) {
  if (state === 'captured')  return factionColor;
  if (state === 'contested') return '#C9A84C';
  if (state === 'lost')      return '#7A0000';
  return '#3D3530';
}

export default function WorldMap({ campaign, battles, currentBattleId, onNodeClick }) {
  const faction = FACTIONS.find(f => f.id === campaign?.factionId);
  const factionColor = faction?.color || '#C9A84C';

  return (
    <div className="w-full relative rounded-lg overflow-hidden" style={{ border: '1px solid var(--iron)', background: '#030208' }}>
      {/* Gold top rule */}
      <div className="absolute top-0 left-0 right-0 h-px z-10" style={{ background: 'linear-gradient(90deg, transparent, var(--gold-dim), transparent)' }} />

      <svg
        viewBox="0 0 1000 520"
        className="w-full"
        style={{ display: 'block' }}
      >
        {/* Ocean */}
        <rect width="1000" height="520" fill="#030208" />

        {/* Latitude / longitude grid */}
        {[100, 175, 250, 325, 400].map(y => (
          <line key={`h${y}`} x1="0" y1={y} x2="1000" y2={y} stroke="#0E0C10" strokeWidth="1" />
        ))}
        {[100, 200, 300, 400, 500, 600, 700, 800, 900].map(x => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="520" stroke="#0E0C10" strokeWidth="1" />
        ))}

        {/* Continent silhouettes */}
        <g fill="#181210" stroke="#2A2018" strokeWidth="1.5">
          {CONTINENT_PATHS.map((d, i) => <path key={i} d={d} />)}
        </g>

        {/* Region labels */}
        {REGION_LABELS.map((r) => (
          <text
            key={r.text}
            x={r.x} y={r.y}
            textAnchor="middle"
            fill="#2A2218"
            fontSize="11"
            fontFamily="Cinzel, serif"
            letterSpacing="3"
          >
            {r.text}
          </text>
        ))}

        {/* Campaign path connections */}
        {CAMPAIGN_SEQUENCE.map((id, i) => {
          if (i === 0) return null;
          const from = BATTLE_NODES[CAMPAIGN_SEQUENCE[i - 1]];
          const to = BATTLE_NODES[id];
          if (!from || !to) return null;
          const played = campaign?.battles?.[CAMPAIGN_SEQUENCE[i - 1]];
          return (
            <line
              key={`conn-${id}`}
              x1={from.x} y1={from.y}
              x2={to.x} y2={to.y}
              stroke={played ? `${factionColor}44` : '#2A2018'}
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
          );
        })}

        {/* Battle nodes */}
        {CAMPAIGN_SEQUENCE.map((id, i) => {
          const node = BATTLE_NODES[id];
          if (!node) return null;
          const meta = getMeta(id);
          const battleResult = campaign?.battles?.[id];
          const isCurrent = id === currentBattleId;
          const isPlayed = !!battleResult;
          const isLocked = !isPlayed && !isCurrent;
          const nodeColor = isPlayed
            ? stateColor(battleResult.territoryState, factionColor)
            : isCurrent
              ? factionColor
              : '#3D3530';

          return (
            <g
              key={id}
              style={{ cursor: isCurrent ? 'pointer' : 'default' }}
              onClick={() => isCurrent && onNodeClick && onNodeClick(id)}
            >
              {/* Pulse ring for current */}
              {isCurrent && (
                <>
                  <circle cx={node.x} cy={node.y} r="22" fill="none" stroke={factionColor} strokeWidth="1" opacity="0.3">
                    <animate attributeName="r" from="18" to="28" dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.4" to="0" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={node.x} cy={node.y} r="18" fill="none" stroke={factionColor} strokeWidth="1" opacity="0.2">
                    <animate attributeName="r" from="14" to="22" dur="1.8s" begin="0.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.3" to="0" dur="1.8s" begin="0.5s" repeatCount="indefinite" />
                  </circle>
                </>
              )}

              {/* Node circle */}
              <circle
                cx={node.x} cy={node.y} r="10"
                fill={isPlayed ? `${nodeColor}33` : isCurrent ? `${nodeColor}22` : '#0A0810'}
                stroke={nodeColor}
                strokeWidth={isCurrent ? 2 : 1.5}
              />

              {/* Inner dot */}
              <circle
                cx={node.x} cy={node.y} r="4"
                fill={isLocked ? '#2A2018' : nodeColor}
                opacity={isLocked ? 0.4 : 1}
              />

              {/* Sequence number */}
              <text
                x={node.x + 13} y={node.y - 10}
                fill={isLocked ? '#3D3530' : nodeColor}
                fontSize="8"
                fontFamily="Cinzel, serif"
                opacity={isLocked ? 0.5 : 1}
              >
                {['I','II','III','IV','V','VI','VII','VIII','IX','X'][i]}
              </text>

              {/* Label */}
              <text
                x={node.x} y={node.y + 20}
                textAnchor="middle"
                fill={isLocked ? '#3D3530' : '#A89F8C'}
                fontSize="9"
                fontFamily="Cinzel, serif"
                opacity={isLocked ? 0.5 : 1}
              >
                {node.label}
              </text>

              {/* Year */}
              <text
                x={node.x} y={node.y + 30}
                textAnchor="middle"
                fill={isLocked ? '#2A2018' : '#5A5048'}
                fontSize="7"
                fontFamily="Cinzel, serif"
                opacity={isLocked ? 0.4 : 1}
              >
                {node.year}
              </text>

              {/* Outcome icon for played */}
              {isPlayed && (
                <text
                  x={node.x - 13} y={node.y - 8}
                  fontSize="9"
                  fill={battleResult.territoryState === 'captured' ? factionColor : battleResult.territoryState === 'contested' ? '#C9A84C' : '#7A0000'}
                >
                  {battleResult.territoryState === 'captured' ? '✓' : battleResult.territoryState === 'contested' ? '~' : '✗'}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
