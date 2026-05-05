import { getMeta } from '../battleMeta';

export default function Timeline({ result }) {
  const meta = getMeta(result.battleId);

  const nodes = [
    {
      label: result.battleName,
      sub: 'Historical Event',
      color: '#6B6357',
      size: 14,
    },
    {
      label: result.variableLabel,
      sub: 'Point of Divergence',
      color: meta.accent,
      size: 20,
      pulse: true,
    },
    {
      label: 'Alternate Future',
      sub: 'Timeline Rewritten',
      color: meta.accent,
      size: 14,
      dim: true,
    },
  ];

  return (
    <div className="rounded-lg px-6 py-5" style={{ background: 'var(--bg-stone)', border: '1px solid var(--iron)' }}>
      <p className="uppercase tracking-[0.25em] text-xs mb-4" style={{ color: 'var(--ash)', fontFamily: 'Cinzel, serif', fontSize: '0.6rem' }}>
        ◎ Divergence Timeline
      </p>

      {/* Desktop horizontal layout */}
      <div className="hidden sm:flex items-center gap-0">
        {nodes.map((node, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            {/* Node */}
            <div className="flex flex-col items-center shrink-0" style={{ minWidth: '80px' }}>
              <div className="relative flex items-center justify-center mb-2">
                {node.pulse && (
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: `${node.size * 2.5}px`,
                      height: `${node.size * 2.5}px`,
                      background: `${node.color}22`,
                      animation: 'pulse-ring 2s ease-in-out infinite',
                    }}
                  />
                )}
                <div
                  className="rounded-full"
                  style={{
                    width: `${node.size}px`,
                    height: `${node.size}px`,
                    background: node.dim ? 'transparent' : node.color,
                    border: node.dim ? `2px dashed ${node.color}` : `2px solid ${node.color}`,
                    boxShadow: node.pulse ? `0 0 12px ${node.color}` : 'none',
                    opacity: node.dim ? 0.7 : 1,
                  }}
                />
              </div>
              <p
                className="text-center leading-tight"
                style={{
                  color: node.pulse ? meta.accent : 'var(--parchment)',
                  fontFamily: 'Cinzel, serif',
                  fontSize: '0.55rem',
                  fontWeight: node.pulse ? 600 : 400,
                  maxWidth: '80px',
                }}
              >
                {node.label}
              </p>
              <p
                className="text-center mt-0.5"
                style={{
                  color: 'var(--ash)',
                  fontFamily: 'EB Garamond, serif',
                  fontSize: '0.7rem',
                  fontStyle: 'italic',
                  maxWidth: '80px',
                }}
              >
                {node.sub}
              </p>
            </div>

            {/* Connector line between nodes */}
            {i < nodes.length - 1 && (
              <div className="flex-1 flex flex-col gap-1 mx-2">
                {/* Real history path (gray, solid) */}
                <div
                  className="h-px"
                  style={{
                    background: i === 0
                      ? '#6B6357'
                      : `linear-gradient(90deg, ${meta.accent}88, transparent)`,
                  }}
                />
                {/* Alternate path hint (gold, dashed — only after divergence) */}
                {i === 0 && (
                  <div
                    className="h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${meta.accent}55)`,
                      borderTop: `1px dashed ${meta.accent}44`,
                    }}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile vertical layout */}
      <div className="flex sm:hidden flex-col gap-0">
        {nodes.map((node, i) => (
          <div key={i} className="flex items-start gap-4">
            {/* Left column: node + line */}
            <div className="flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                {node.pulse && (
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: `${node.size * 2.5}px`,
                      height: `${node.size * 2.5}px`,
                      background: `${node.color}22`,
                      animation: 'pulse-ring 2s ease-in-out infinite',
                    }}
                  />
                )}
                <div
                  className="rounded-full"
                  style={{
                    width: `${node.size}px`,
                    height: `${node.size}px`,
                    background: node.dim ? 'transparent' : node.color,
                    border: node.dim ? `2px dashed ${node.color}` : `2px solid ${node.color}`,
                    boxShadow: node.pulse ? `0 0 12px ${node.color}` : 'none',
                    opacity: node.dim ? 0.7 : 1,
                  }}
                />
              </div>
              {i < nodes.length - 1 && (
                <div className="w-px flex-1 my-1" style={{ background: i === 0 ? '#6B6357' : `${meta.accent}66`, minHeight: '24px' }} />
              )}
            </div>
            {/* Right: labels */}
            <div className="pb-4">
              <p
                style={{
                  color: node.pulse ? meta.accent : 'var(--parchment)',
                  fontFamily: 'Cinzel, serif',
                  fontSize: '0.7rem',
                  fontWeight: node.pulse ? 600 : 400,
                }}
              >
                {node.label}
              </p>
              <p
                style={{
                  color: 'var(--ash)',
                  fontFamily: 'EB Garamond, serif',
                  fontSize: '0.85rem',
                  fontStyle: 'italic',
                }}
              >
                {node.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pulse-ring {
          0%,100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.3); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
