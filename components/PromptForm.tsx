'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { createPrompt, type CreatePromptState, type PromptActionHandler } from '../app/actions';
import type { Dictionary, Locale } from '../lib/i18n';
import type { LintIssue, LintResponse, LintSeverity, LintStats } from '../types/lint';

type Category = { id: string; name: string };

type Props = {
  categories: Category[];
  dict: Dictionary['promptForm'];
  locale: Locale;
  redirectTo?: string;
  initial?: {
    id?: string;
    title?: string;
    content?: string;
    categoryId?: string | null;
    lintIssues?: LintIssue[];
    lintStats?: LintStats | null;
  };
  submitAction?: PromptActionHandler;
};

type Mode = 'manual' | 'generator';

const SEVERITY_PALETTE: Record<LintSeverity, { background: string; border: string; text: string }> = {
  error: { background: 'rgba(248, 113, 113, 0.12)', border: '#f87171', text: '#dc2626' },
  warning: { background: 'rgba(251, 191, 36, 0.12)', border: '#fbbf24', text: '#d97706' },
  info: { background: 'rgba(96, 165, 250, 0.12)', border: '#93c5fd', text: '#2563eb' },
};

const INITIAL_STATE: CreatePromptState = { success: false };

function FormFields({
  dict,
  categories,
  mode,
  title,
  setTitle,
  categoryId,
  setCategoryId,
  content,
  setContent,
  customCategory,
  setCustomCategory,
  lintIssues,
  linting,
  lintError,
  lintRan,
  onIssueFocus,
  contentRef,
}: {
  dict: Dictionary['promptForm'];
  categories: Category[];
  mode: Mode;
  title: string;
  setTitle: (value: string) => void;
  categoryId: string;
  setCategoryId: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  customCategory: string;
  setCustomCategory: (value: string) => void;
  lintIssues: LintIssue[];
  linting: boolean;
  lintError: string | null;
  lintRan: boolean;
  onIssueFocus: (issue: LintIssue) => void;
  contentRef: RefObject<HTMLTextAreaElement>;
}) {
  const { pending } = useFormStatus();
  const lintDict = dict.lint;
  return (
    <>
      <div className="col" style={{ gap: 4 }}>
        <label htmlFor="prompt-title">{dict.titleLabel}</label>
        <input
          id="prompt-title"
          name="title"
          className="input"
          placeholder={dict.titlePlaceholder}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={pending}
        />
      </div>
      <div className="col" style={{ gap: 4 }}>
        <label htmlFor="prompt-category">{dict.categoryLabel}</label>
        <select
          id="prompt-category"
          name="category_id"
          className="select"
          value={categoryId}
          onChange={(event) => {
            setCategoryId(event.target.value);
            if (event.target.value) {
              setCustomCategory('');
            }
          }}
          disabled={pending}
        >
          <option value="">{dict.uncategorized}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {dict.categoryLabels?.[category.name] ?? category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="col" style={{ gap: 4 }}>
        <label htmlFor="prompt-category-custom">{dict.customCategoryLabel}</label>
        <input
          id="prompt-category-custom"
          name="category_name"
          className="input"
          placeholder={dict.customCategoryPlaceholder}
          value={customCategory}
          onChange={(event) => {
            setCustomCategory(event.target.value);
            if (event.target.value.trim().length > 0) {
              setCategoryId('');
            }
          }}
          disabled={pending}
        />
        {dict.customCategoryHint ? (
          <span className="muted" style={{ fontSize: 12 }}>
            {dict.customCategoryHint}
          </span>
        ) : null}
      </div>
      <div className="col" style={{ gap: 4 }}>
        <label htmlFor="prompt-content">{dict.contentLabel}</label>
        <textarea
          id="prompt-content"
          name="content"
          className="textarea"
          placeholder={dict.contentPlaceholder}
          rows={mode === 'manual' ? 12 : 8}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          required
          disabled={pending}
          ref={contentRef}
        />
      </div>
      <div className="col" style={{ gap: 8 }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <strong>{lintDict.heading}</strong>
          {linting ? <span className="muted" style={{ fontSize: 12 }}>{lintDict.loading}</span> : null}
        </div>
        {lintError ? (
          <span className="muted" style={{ color: '#f87171', fontSize: 12 }}>{lintError}</span>
        ) : null}
        {!linting && !lintError && lintRan && lintIssues.length === 0 ? (
          <span className="muted" style={{ fontSize: 12 }}>{lintDict.empty}</span>
        ) : null}
        <div className="col" style={{ gap: 8 }}>
          {lintIssues.map((issue, index) => {
            const palette = SEVERITY_PALETTE[issue.severity];
            return (
              <button
                key={`${issue.code}-${index}`}
                type="button"
                onClick={() => onIssueFocus(issue)}
                className="row"
                style={{
                  gap: 12,
                  alignItems: 'flex-start',
                  background: palette.background,
                  border: `1px solid ${palette.border}`,
                  borderRadius: 8,
                  padding: '8px 12px',
                  textAlign: 'left',
                  color: 'inherit',
                }}
              >
                <span
                  className="tag"
                  style={{
                    background: palette.border,
                    color: '#0f172a',
                    fontWeight: 600,
                    minWidth: 72,
                    justifyContent: 'center',
                  }}
                >
                  {lintDict.severityLabels[issue.severity] ?? issue.severity}
                </span>
                <div className="col" style={{ gap: 4, flex: 1 }}>
                  <span style={{ fontWeight: 500 }}>{issue.message}</span>
                  {issue.fix_hint ? (
                    <span className="muted" style={{ fontSize: 12 }}>{issue.fix_hint}</span>
                  ) : null}
                  {issue.range ? (
                    <span className="muted" style={{ fontSize: 10 }}>
                      L{issue.range.start.line} · {lintDict.jumpToIssue}
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

function SaveButton({ label, saving }: { label: string; saving: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn" disabled={pending}>
      {pending ? saving : label}
    </button>
  );
}

export default function PromptForm({
  categories,
  dict,
  locale,
  redirectTo = '/',
  initial,
  submitAction,
}: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const lintAbortRef = useRef<AbortController | null>(null);
  const [mode, setMode] = useState<Mode>('manual');
  const [title, setTitle] = useState(initial?.title ?? '');
  const [content, setContent] = useState(initial?.content ?? '');
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? '');
  const [customCategory, setCustomCategory] = useState('');

  const [goal, setGoal] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('neutral');
  const [language, setLanguage] = useState(locale === 'zh' ? 'zh' : 'en');
  const [style, setStyle] = useState('');
  const [generatorError, setGeneratorError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [lintIssues, setLintIssues] = useState<LintIssue[]>(initial?.lintIssues ?? []);
  const [lintStats, setLintStats] = useState<LintStats | null>(initial?.lintStats ?? null);
  const [linting, setLinting] = useState(false);
  const [lintError, setLintError] = useState<string | null>(null);
  const [lintRan, setLintRan] = useState<boolean>(Array.isArray(initial?.lintIssues));

  const action = submitAction ?? createPrompt;
  const [state, formAction] = useFormState(action, INITIAL_STATE);

  useEffect(() => {
    if (state.success && redirectTo === 'stay' && !initial?.id) {
      formRef.current?.reset();
      setTitle('');
      setContent('');
      setCategoryId('');
      setCustomCategory('');
    }
  }, [state.success, redirectTo, initial?.id]);

  let saveError: string | null = null;
  if (state.error === 'CONTENT_REQUIRED') {
    saveError = dict.saveErrorContent;
  } else if (state.error === 'TITLE_REQUIRED') {
    saveError = dict.saveErrorTitle;
  } else if (state.error && state.error !== 'NOT_AUTHENTICATED') {
    saveError = dict.saveErrorGeneric;
  }

  const handleModeChange = (next: Mode) => {
    setMode(next);
    setGeneratorError(null);
  };

  const handleGenerate = async () => {
    if (generating) return;
    setGenerating(true);
    setGeneratorError(null);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          audience,
          tone,
          language,
          style,
        }),
      });
      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail?.error || dict.generateError);
      }
      const json = await response.json();
      setTitle((json.title as string) ?? '');
      setContent((json.content as string) ?? '');
    } catch (error: any) {
      setGeneratorError(error?.message || dict.generateError);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (!content.trim()) {
      lintAbortRef.current?.abort();
      lintAbortRef.current = null;
      setLintIssues([]);
      setLintStats(null);
      setLintRan(false);
      setLintError(null);
      setLinting(false);
      return;
    }

    let active = true;
    const handle = window.setTimeout(() => {
      lintAbortRef.current?.abort();
      const controller = new AbortController();
      lintAbortRef.current = controller;
      setLinting(true);
      setLintError(null);

      fetch('/api/linter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: content }),
        signal: controller.signal,
      })
        .then(async (response) => {
          if (!response.ok) {
            const detail = await response.json().catch(() => ({}));
            throw new Error(detail?.error === 'NOT_AUTHENTICATED' ? dict.saveErrorGeneric : dict.lint.error);
          }
          return (await response.json()) as LintResponse;
        })
        .then((json) => {
          if (!active) return;
          setLintIssues(Array.isArray(json.lint_issues) ? json.lint_issues : []);
          setLintStats(json.stats ?? null);
          setLintRan(true);
        })
        .catch((error: any) => {
          if (error?.name === 'AbortError' || !active) {
            return;
          }
          setLintError(error?.message || dict.lint.error);
        })
        .finally(() => {
          if (!active) {
            return;
          }
          if (lintAbortRef.current === controller) {
            lintAbortRef.current = null;
          }
          setLinting(false);
        });
    }, 600);

    return () => {
      active = false;
      window.clearTimeout(handle);
      if (lintAbortRef.current) {
        lintAbortRef.current.abort();
        lintAbortRef.current = null;
      }
    };
  }, [content, dict.lint.error, dict.saveErrorGeneric]);

  const focusIssue = useCallback(
    (issue: LintIssue) => {
      const target = contentRef.current;
      if (!target) return;
      target.focus();
      if (issue.range) {
        const start = issue.range.start.offset;
        const end = issue.range.end.offset;
        try {
          target.setSelectionRange(start, end);
        } catch {
          // Ignore selection errors
        }
      }
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
    []
  );

  const lintIssuesFieldValue = useMemo(() => {
    if (!lintRan) {
      return '';
    }
    try {
      return JSON.stringify(lintIssues);
    } catch {
      return '';
    }
  }, [lintIssues, lintRan]);

  const severityBadges = useMemo(
    () =>
      (['error', 'warning', 'info'] as LintSeverity[]).map((severity) => ({
        severity,
        label: dict.lint.severityLabels[severity] ?? severity,
        count: lintStats?.severityCount?.[severity] ?? 0,
        palette: SEVERITY_PALETTE[severity],
      })),
    [dict.lint.severityLabels, lintStats]
  );

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
        <button
          type="button"
          className="btn"
          onClick={() => handleModeChange('manual')}
          style={{
            background: mode === 'manual' ? '#4f46e5' : '#1a1f2c',
            borderColor: mode === 'manual' ? '#4f46e5' : '#343b4f',
          }}
        >
          {dict.modeToggleManual}
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => handleModeChange('generator')}
          style={{
            background: mode === 'generator' ? '#4f46e5' : '#1a1f2c',
            borderColor: mode === 'generator' ? '#4f46e5' : '#343b4f',
          }}
        >
          {dict.modeToggleGenerator}
        </button>
      </div>

      <form ref={formRef} action={formAction} className="card col" style={{ gap: 16 }}>
        <input type="hidden" name="redirectTo" value={redirectTo} />
        {initial?.id ? <input type="hidden" name="prompt_id" value={initial.id} /> : null}
        <input type="hidden" name="lint_issues" value={lintIssuesFieldValue} readOnly />
        <FormFields
          dict={dict}
          categories={categories}
          mode={mode}
          title={title}
          setTitle={setTitle}
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          content={content}
          setContent={setContent}
          customCategory={customCategory}
          setCustomCategory={setCustomCategory}
          lintIssues={lintIssues}
          linting={linting}
          lintError={lintError}
          lintRan={lintRan}
          onIssueFocus={focusIssue}
          contentRef={contentRef}
        />
        {saveError ? (
          <span className="muted" style={{ color: '#ef4444' }}>
            {saveError}
          </span>
        ) : null}
        <div className="row" style={{ gap: 8, justifyContent: 'flex-end' }}>
          <SaveButton label={dict.saveButton} saving={dict.savingButton} />
        </div>
      </form>

      {lintStats ? (
        <div className="card col" style={{ gap: 12 }}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <h3 style={{ margin: 0 }}>{dict.lint.summaryHeading}</h3>
            <div className="row" style={{ gap: 12, fontSize: 12, color: '#94a3b8' }}>
              <span>
                {dict.lint.wordCountLabel}: {lintStats.wordCount}
              </span>
              <span>
                {dict.lint.lineCountLabel}: {lintStats.lineCount}
              </span>
              <span>
                {dict.lint.charCountLabel}: {lintStats.charCount}
              </span>
            </div>
          </div>
          <div className="row" style={{ gap: 16, flexWrap: 'wrap' }}>
            {(Object.keys(lintStats.sections) as Array<keyof typeof lintStats.sections>).map((section) => {
              const covered = Boolean(lintStats.sections[section]);
              return (
                <div key={section} className="col" style={{ gap: 4, minWidth: 140 }}>
                  <span className="muted" style={{ fontSize: 12 }}>
                    {dict.lint.sectionLabels?.[section as keyof typeof dict.lint.sectionLabels] ?? section}
                  </span>
                  <span style={{
                    color: covered ? '#34d399' : '#f87171',
                    fontWeight: 600,
                  }}>
                    {covered ? dict.lint.coverageOk : dict.lint.coverageMissing}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
            {severityBadges.map(({ severity, label, count, palette }) => (
              <span
                key={severity}
                className="tag"
                style={{
                  background: palette.background,
                  borderColor: palette.border,
                  color: palette.text,
                  fontWeight: 600,
                }}
              >
                {label}: {count}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {mode === 'generator' ? (
        <div className="card col" style={{ gap: 12 }}>
          <h3 style={{ margin: 0 }}>{dict.generatorTitle}</h3>
          <div className="col" style={{ gap: 4 }}>
            <label htmlFor="prompt-goal">{dict.goalLabel}</label>
            <textarea
              id="prompt-goal"
              className="textarea"
              rows={3}
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              placeholder={dict.goalPlaceholder}
              disabled={generating}
            />
          </div>
          <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
            <div className="col" style={{ flex: 1, minWidth: 180 }}>
              <label htmlFor="prompt-audience">{dict.audienceLabel}</label>
              <input
                id="prompt-audience"
                className="input"
                value={audience}
                onChange={(event) => setAudience(event.target.value)}
                placeholder={dict.audiencePlaceholder}
                disabled={generating}
              />
            </div>
            <div className="col" style={{ width: 180 }}>
              <label htmlFor="prompt-tone">{dict.toneLabel}</label>
              <select
                id="prompt-tone"
                className="select"
                value={tone}
                onChange={(event) => setTone(event.target.value)}
                disabled={generating}
              >
                {dict.toneOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col" style={{ width: 180 }}>
              <label htmlFor="prompt-language">{dict.languageLabel}</label>
              <select
                id="prompt-language"
                className="select"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                disabled={generating}
              >
                {dict.languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col" style={{ gap: 4 }}>
            <label htmlFor="prompt-style">{dict.styleLabel}</label>
            <input
              id="prompt-style"
              className="input"
              value={style}
              onChange={(event) => setStyle(event.target.value)}
              placeholder={dict.stylePlaceholder}
              disabled={generating}
            />
          </div>
          {generatorError ? (
            <span className="muted" style={{ color: '#ef4444' }}>
              {generatorError}
            </span>
          ) : null}
          <div className="row" style={{ justifyContent: 'flex-start' }}>
            <button type="button" className="btn" onClick={handleGenerate} disabled={generating}>
              {generating ? dict.generatingButton : dict.generateButton}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
