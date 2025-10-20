'use client';

import { useMemo, useState } from 'react';

import type { Dictionary, Locale } from '../lib/i18n';
import type { PromptEvalScore } from '../lib/types/prompt';
import CopyButton from './CopyButton';
import ScoreCard from './ScoreCard';

type EvalDict = Dictionary['eval'];

type EvalRunnerProps = {
  promptId?: string | null;
  title: string;
  content: string;
  locale: Locale;
  dict: EvalDict;
  copyDict: Dictionary['copy'];
  initialScore: PromptEvalScore | null;
};

export default function EvalRunner({
  promptId,
  title,
  content,
  locale,
  dict,
  copyDict,
  initialScore,
}: EvalRunnerProps) {
  const [score, setScore] = useState<PromptEvalScore | null>(initialScore);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRunAt, setLastRunAt] = useState<string | null>(initialScore?.evaluatedAt ?? null);
  const [improving, setImproving] = useState(false);
  const [improvementError, setImprovementError] = useState<string | null>(null);
  const [improvement, setImprovement] = useState<{
    summary: string | null;
    diff: string | null;
    revised_prompt: string;
  } | null>(null);
  const [showDiff, setShowDiff] = useState(false);

  const hasContent = useMemo(() => content.trim().length > 0, [content]);
  const canImprove = useMemo(
    () => !!score && Array.isArray(score.improvements) && score.improvements.length > 0,
    [score]
  );

  const handleRun = async () => {
    if (running || !hasContent) return;
    setRunning(true);
    setError(null);
    setImprovement(null);
    setImprovementError(null);
    try {
      const response = await fetch('/api/eval/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          prompts: [
            {
              id: promptId ?? null,
              title,
              content,
            },
          ],
        }),
      });
      if (!response.ok) {
        let message = dict.errorLabel;
        try {
          const detail = await response.json();
          if (detail?.error && typeof detail.error === 'string') {
            message = detail.error;
          }
        } catch {
          const text = await response.text().catch(() => '');
          if (text) {
            message = text;
          }
        }
        throw new Error(message);
      }
      const payload = await response.json();
      const result = Array.isArray(payload?.results) ? payload.results[0] : null;
      const nextScore: PromptEvalScore | null =
        result && result.score && typeof result.score === 'object' ? (result.score as PromptEvalScore) : null;
      if (!nextScore) {
        throw new Error(dict.errorLabel);
      }
      setScore(nextScore);
      setLastRunAt(nextScore.evaluatedAt ?? new Date().toISOString());
    } catch (err: any) {
      setError(typeof err?.message === 'string' ? err.message : dict.errorLabel);
    } finally {
      setRunning(false);
    }
  };

  const handleImprove = async () => {
    if (!canImprove || improving) return;
    setImproving(true);
    setImprovementError(null);
    setShowDiff(false);
    try {
      const response = await fetch('/api/eval/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: content,
          improvements: score?.improvements ?? [],
          strengths: score?.strengths ?? [],
          locale,
        }),
      });
      if (!response.ok) {
        let message = dict.improveError;
        try {
          const detail = await response.json();
          if (detail?.error && typeof detail.error === 'string') {
            message = detail.error;
          }
        } catch {
          const text = await response.text().catch(() => '');
          if (text) {
            message = text;
          }
        }
        throw new Error(message);
      }
      const payload = await response.json();
      const revised = typeof payload?.revised_prompt === 'string' ? payload.revised_prompt : '';
      if (!revised.trim()) {
        throw new Error(dict.improveError);
      }
      setImprovement({
        summary: typeof payload?.summary === 'string' ? payload.summary : null,
        diff: typeof payload?.diff === 'string' ? payload.diff : null,
        revised_prompt: revised,
      });
    } catch (err: any) {
      setImprovement(null);
      setImprovementError(typeof err?.message === 'string' ? err.message : dict.improveError);
    } finally {
      setImproving(false);
    }
  };

  return (
    <div className="card col" style={{ gap: 12 }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h3 style={{ margin: 0 }}>{dict.title}</h3>
        <div className="row" style={{ gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {lastRunAt ? (
            <span className="muted" style={{ fontSize: 12 }}>
              {dict.lastRunLabel.replace('{time}', new Date(lastRunAt).toLocaleString())}
            </span>
          ) : null}
          <button
            type="button"
            className="btn"
            onClick={handleRun}
            disabled={running || !hasContent}
            style={{
              background: running ? '#4f46e5' : '#1a1f2c',
              borderColor: running ? '#4f46e5' : '#343b4f',
              padding: '6px 12px',
              fontSize: 12,
              opacity: hasContent ? 1 : 0.6,
            }}
          >
            {running ? dict.runningButton : dict.runButton}
          </button>
        </div>
      </div>

      {error ? (
        <span className="muted" style={{ color: '#ef4444', fontSize: 13 }}>
          {error}
        </span>
      ) : null}

      <ScoreCard score={score} dict={dict} />

      {canImprove ? (
        <button
          type="button"
          className="btn"
          onClick={handleImprove}
          disabled={improving}
          style={{
            background: '#1a1f2c',
            borderColor: '#343b4f',
            padding: '6px 12px',
            fontSize: 12,
            alignSelf: 'flex-start',
          }}
        >
          {improving ? dict.improveGeneratingButton : dict.improveButton}
        </button>
      ) : null}

      {improvementError ? (
        <span className="muted" style={{ color: '#ef4444', fontSize: 13 }}>
          {improvementError}
        </span>
      ) : null}

      {improvement ? (
        <div className="col" style={{ gap: 10 }}>
          {improvement.summary ? (
            <div className="col" style={{ gap: 4 }}>
              <strong style={{ fontSize: 13 }}>{dict.improveSummaryTitle}</strong>
              <span className="muted" style={{ fontSize: 12 }}>
                {improvement.summary}
              </span>
            </div>
          ) : null}
          <div className="col" style={{ gap: 6 }}>
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <strong style={{ fontSize: 13 }}>{dict.improvePromptTitle}</strong>
              <CopyButton
                text={improvement.revised_prompt}
                label={copyDict.copy}
                copiedLabel={copyDict.copied}
                toastMessage={copyDict.toast}
              />
            </div>
            <pre
              style={{
                margin: 0,
                whiteSpace: 'pre-wrap',
                background: '#0f172a',
                borderRadius: 8,
                padding: 12,
                fontSize: 12,
                maxHeight: 320,
                overflowY: 'auto',
              }}
            >
              {improvement.revised_prompt}
            </pre>
          </div>
          {improvement.diff ? (
            <div className="col" style={{ gap: 4 }}>
              <button
                type="button"
                onClick={() => setShowDiff((open) => !open)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#93c5fd',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: 0,
                  alignSelf: 'flex-start',
                  fontSize: 12,
                }}
              >
                {dict.improveDiffTitle} {showDiff ? '(hide)' : '(show)'}
              </button>
              {showDiff ? (
                <pre
                  style={{
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    background: '#0f172a',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 12,
                    maxHeight: 240,
                    overflowY: 'auto',
                  }}
                >
                  {improvement.diff}
                </pre>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
