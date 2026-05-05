import { useState, useRef, useEffect } from 'react';

const MAX_QUESTIONS = 5;

export default function FollowUp({ result }) {
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, loading]);

  const remaining = MAX_QUESTIONS - history.length;

  function buildSummary() {
    const s = result.sections;
    return [
      s.change && `The Change: ${s.change}`,
      s.immediate && `Immediate Consequences: ${s.immediate}`,
      s.ripple && `Ripple Effects: ${s.ripple}`,
      s.longterm && `Long-term Consequences: ${s.longterm}`,
      s.inertia && `What Stayed the Same: ${s.inertia}`,
    ]
      .filter(Boolean)
      .join('\n\n');
  }

  async function submit(e) {
    e.preventDefault();
    const q = question.trim();
    if (!q || loading || remaining <= 0) return;

    setQuestion('');
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          battleId: result.battleId,
          variableId: result.variableId,
          battleName: result.battleName,
          variableLabel: result.variableLabel,
          simulationSummary: buildSummary(),
          question: q,
          conversationHistory: history,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setHistory((h) => [...h, { question: q, answer: data.answer }]);
    } catch (err) {
      setError('The Maester could not be reached. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg overflow-hidden" style={{ background: 'var(--bg-stone)', border: '1px solid var(--iron)' }}>
      {/* Header */}
      <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--iron)' }}>
        <div className="flex items-center gap-3">
          <span style={{ color: 'var(--gold)' }}>📜</span>
          <div>
            <h3 className="text-white" style={{ fontFamily: 'Cinzel, serif', fontSize: '0.9rem', fontWeight: 600 }}>
              Consult the Historian
            </h3>
            <p className="text-xs italic mt-0.5" style={{ color: 'var(--ash)', fontFamily: 'EB Garamond, serif' }}>
              Ask follow-up questions about this alternate timeline · {remaining} question{remaining !== 1 ? 's' : ''} remaining
            </p>
          </div>
        </div>
      </div>

      {/* Conversation */}
      {history.length > 0 && (
        <div className="px-6 py-4 space-y-4 max-h-96 overflow-y-auto">
          {history.map((turn, i) => (
            <div key={i} className="space-y-3">
              {/* User question — right aligned */}
              <div className="flex justify-end">
                <div
                  className="max-w-xs px-4 py-3 rounded-lg text-sm"
                  style={{
                    background: '#C9A84C11',
                    border: '1px solid #C9A84C44',
                    color: 'var(--parchment)',
                    fontFamily: 'EB Garamond, serif',
                    fontSize: '0.95rem',
                  }}
                >
                  {turn.question}
                </div>
              </div>
              {/* Historian answer — left aligned */}
              <div className="flex gap-3">
                <span className="shrink-0 mt-1 text-xs" style={{ color: 'var(--gold)' }}>📜</span>
                <div
                  className="px-4 py-3 rounded-lg text-sm leading-relaxed"
                  style={{
                    background: '#07050A',
                    border: '1px solid var(--iron)',
                    color: 'var(--parchment)',
                    fontFamily: 'EB Garamond, serif',
                    fontSize: '1rem',
                    fontStyle: 'italic',
                  }}
                >
                  {turn.answer}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <span className="shrink-0 mt-1 text-xs" style={{ color: 'var(--gold)' }}>📜</span>
              <div
                className="px-4 py-3 rounded-lg text-sm"
                style={{
                  background: '#07050A',
                  border: '1px solid var(--iron)',
                  color: 'var(--ash)',
                  fontFamily: 'EB Garamond, serif',
                  fontStyle: 'italic',
                }}
              >
                The Maester is writing…
                <span style={{ animation: 'blink 1.2s ease-in-out infinite' }}>▍</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Input */}
      {remaining > 0 ? (
        <form onSubmit={submit} className="px-6 py-4" style={{ borderTop: history.length > 0 ? '1px solid var(--iron)' : 'none' }}>
          {error && (
            <p className="text-xs mb-3 italic" style={{ color: '#C0392B', fontFamily: 'EB Garamond, serif' }}>{error}</p>
          )}
          <div className="flex gap-3">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask the Maester a question…"
              disabled={loading}
              className="flex-1 px-4 py-3 rounded text-sm outline-none transition-all"
              style={{
                background: '#07050A',
                border: '1px solid var(--iron)',
                color: 'var(--parchment)',
                fontFamily: 'EB Garamond, serif',
                fontSize: '1rem',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--gold-dim)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--iron)'; }}
            />
            <button
              type="submit"
              disabled={!question.trim() || loading}
              className="px-5 py-3 rounded transition-all uppercase tracking-widest"
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '0.6rem',
                border: '1px solid var(--gold-dim)',
                color: 'var(--gold)',
                background: '#C9A84C0A',
                opacity: (!question.trim() || loading) ? 0.4 : 1,
              }}
            >
              ⚜ Ask
            </button>
          </div>
        </form>
      ) : (
        <div className="px-6 py-4 text-center" style={{ borderTop: '1px solid var(--iron)' }}>
          <p className="text-sm italic" style={{ color: 'var(--ash)', fontFamily: 'EB Garamond, serif' }}>
            The Maester has answered all your questions for this battle.
          </p>
        </div>
      )}

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
}
