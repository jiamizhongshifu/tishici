import type { PromptEvalScore } from '../lib/types/prompt';
import type { Dictionary } from '../lib/i18n';

type EvalDict = Dictionary['eval'];

type Props = {
  score: PromptEvalScore | null;
  dict: EvalDict;
};

type MetricKey = 'overall' | 'clarity' | 'constraints' | 'reproducibility';

const metricKeys: MetricKey[] = ['overall', 'clarity', 'constraints', 'reproducibility'];

function renderBar(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return (
      <span className="muted" style={{ fontSize: 12 }}>
        --
      </span>
    );
  }
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      style={{
        width: '100%',
        background: '#1f2937',
        borderRadius: 999,
        overflow: 'hidden',
        border: '1px solid #374151',
      }}
    >
      <div
        style={{
          width: `${clamped}%`,
          minWidth: clamped > 0 ? `${Math.min(10, clamped)}%` : '4%',
          background: clamped >= 75 ? '#22c55e' : clamped >= 50 ? '#facc15' : '#ef4444',
          color: '#0f172a',
          fontSize: 12,
          fontWeight: 600,
          padding: '2px 6px',
          textAlign: 'right',
        }}
      >
        {clamped}
      </div>
    </div>
  );
}

export default function ScoreCard({ score, dict }: Props) {
  if (!score) {
    return (
      <div className="col" style={{ gap: 8 }}>
        <span className="muted" style={{ fontSize: 13 }}>
          {dict.emptyState}
        </span>
      </div>
    );
  }

  const cost = score.cost ?? null;
  const strengths = Array.isArray(score.strengths) ? score.strengths : [];
  const improvements = Array.isArray(score.improvements) ? score.improvements : [];

  return (
    <div className="col" style={{ gap: 12 }}>
      <div className="col" style={{ gap: 8 }}>
        {metricKeys.map((key) => {
          const label =
            key === 'overall'
              ? dict.overallLabel
              : key === 'clarity'
                ? dict.clarityLabel
                : key === 'constraints'
                  ? dict.constraintsLabel
                  : dict.reproducibilityLabel;
          const value = score[key];
          return (
            <div key={key} className="col" style={{ gap: 4 }}>
              <span style={{ fontSize: 12, color: '#cbd5f5', fontWeight: 500 }}>{label}</span>
              {renderBar(typeof value === 'number' ? value : value ?? null)}
            </div>
          );
        })}
      </div>

      {cost ? (
        <div className="col" style={{ gap: 4 }}>
          <strong style={{ fontSize: 13 }}>{dict.costLabel}</strong>
          <span className="muted" style={{ fontSize: 12 }}>
            {dict.tokensLabel}: {cost.totalTokens ?? 0} (in {cost.inputTokens ?? 0} / out {cost.outputTokens ?? 0})
          </span>
          <span className="muted" style={{ fontSize: 12 }}>
            {dict.usdLabel}: ${typeof cost.estimatedUsd === 'number' ? cost.estimatedUsd.toFixed(4) : '0.0000'}
          </span>
        </div>
      ) : null}

      {strengths.length > 0 ? (
        <div className="col" style={{ gap: 4 }}>
          <strong style={{ fontSize: 13 }}>{dict.strengthsLabel}</strong>
          <ul style={{ margin: 0, paddingInlineStart: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {strengths.map((item, idx) => (
              <li key={`strength-${idx}`} style={{ fontSize: 12 }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {improvements.length > 0 ? (
        <div className="col" style={{ gap: 4 }}>
          <strong style={{ fontSize: 13 }}>{dict.improvementsLabel}</strong>
          <ul style={{ margin: 0, paddingInlineStart: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {improvements.map((item, idx) => (
              <li key={`improvement-${idx}`} style={{ fontSize: 12 }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {score.notes ? (
        <div className="col" style={{ gap: 4 }}>
          <strong style={{ fontSize: 13 }}>{dict.notesLabel}</strong>
          <span className="muted" style={{ fontSize: 12 }}>
            {score.notes}
          </span>
        </div>
      ) : null}
    </div>
  );
}
