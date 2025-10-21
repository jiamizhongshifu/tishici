'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { createPrompt, type CreatePromptState, type PromptActionHandler } from '../app/actions';
import type { Dictionary, Locale } from '../lib/i18n';
import type { PromptLintIssueRecord } from '../lib/types/prompt';
import TemplatePicker from './TemplatePicker';
import type { PromptTemplate } from '../lib/templates';

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
  };
  submitAction?: PromptActionHandler;
};

type Mode = 'manual' | 'generator' | 'bootstrap' | 'template';
type LintVisualState = 'none' | 'info' | 'warning' | 'error';
type LintSummaryState = {
  totalIssues: number;
  errors: number;
  warnings: number;
  infos: number;
  successes: number;
};
type FixSuggestion = {
  revisedPrompt: string;
  diff: string | null;
  summary: string | null;
  suggestions: Array<{ issue_code: string | null; description: string | null }> | null;
};
type BootstrapResult = {
  title: string;
  content: string;
  suggestedCategory: string | null;
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
  contentRef,
  lintVariant,
  lintFooter,
  contentDescribedBy,
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
  contentRef: React.RefObject<HTMLTextAreaElement>;
  lintVariant: LintVisualState;
  lintFooter?: ReactNode;
  contentDescribedBy?: string;
}) {
  const { pending } = useFormStatus();
  const borderColor =
    lintVariant === 'error'
      ? '#ef4444'
      : lintVariant === 'warning'
        ? '#f97316'
        : lintVariant === 'info'
          ? '#0ea5e9'
          : undefined;
  const textareaStyle =
    borderColor !== undefined
      ? {
          borderColor,
          boxShadow: `0 0 0 1px ${borderColor}`,
        }
      : undefined;
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
          ref={contentRef}
          className="textarea"
          placeholder={dict.contentPlaceholder}
          rows={mode === 'manual' ? 12 : 8}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          required
          disabled={pending}
          aria-invalid={lintVariant === 'error' ? 'true' : undefined}
          aria-describedby={contentDescribedBy || undefined}
          style={textareaStyle}
        />
        {lintFooter}
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
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
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

  // Bootstrap states
  const [bootstrapGoal, setBootstrapGoal] = useState('');
  const [bootstrapDomain, setBootstrapDomain] = useState('');
  const [bootstrapAudience, setBootstrapAudience] = useState('');
  const [bootstrapConstraints, setBootstrapConstraints] = useState('');
  const [bootstrapping, setBootstrapping] = useState(false);
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [lintIssues, setLintIssues] = useState<PromptLintIssueRecord[]>([]);
  const [lintSummary, setLintSummary] = useState<LintSummaryState | null>(null);
  const [lintGeneratedAt, setLintGeneratedAt] = useState<string | null>(null);
  const [lintConfigVersion, setLintConfigVersion] = useState<string | null>(null);
  const [linting, setLinting] = useState(false);
  const [lintError, setLintError] = useState<string | null>(null);
  const lintAbortRef = useRef<AbortController | null>(null);
  const lintDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [lintRefreshToken, setLintRefreshToken] = useState(0);
  const lintStatusId = useId();
  const [fixSuggestion, setFixSuggestion] = useState<FixSuggestion | null>(null);
  const [fixPending, setFixPending] = useState(false);
  const [fixError, setFixError] = useState<string | null>(null);
  const [fixPreviewOpen, setFixPreviewOpen] = useState(false);
  const [fixApplied, setFixApplied] = useState(false);
  const contentBeforeFixRef = useRef<string | null>(null);
  const skipContentEffectRef = useRef(false);
  const autoFixTriggeredRef = useRef(false);
  const hasPromptContent = content.trim().length > 0;

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

  useEffect(() => {
    if (!hasPromptContent) {
      setFixSuggestion(null);
      setFixError(null);
      setFixApplied(false);
      setFixPreviewOpen(false);
      contentBeforeFixRef.current = null;
    }
  }, [hasPromptContent]);

  useEffect(() => {
    const trimmed = content.trim();
    if (!trimmed) {
      if (lintAbortRef.current) {
        lintAbortRef.current.abort();
        lintAbortRef.current = null;
      }
      if (lintDebounceRef.current) {
        clearTimeout(lintDebounceRef.current);
        lintDebounceRef.current = null;
      }
      setLintIssues([]);
      setLintSummary(null);
      setLintGeneratedAt(null);
      setLintConfigVersion(null);
      setLintError(null);
      setLinting(false);
      return;
    }

    const controller = new AbortController();
    if (lintAbortRef.current) {
      lintAbortRef.current.abort();
    }
    lintAbortRef.current = controller;

    if (lintDebounceRef.current) {
      clearTimeout(lintDebounceRef.current);
    }

    const timeoutId = setTimeout(async () => {
      setLinting(true);
      setLintError(null);
      try {
        const response = await fetch('/api/linter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: trimmed,
            locale,
          }),
          signal: controller.signal,
        });
        if (!response.ok) {
          let message = dict.lintErrorState;
          try {
            const detail = await response.json();
            if (detail?.error && typeof detail.error === 'string') {
              message = detail.error;
            }
          } catch {
            try {
              const text = await response.text();
              if (text) {
                message = text;
              }
            } catch {
              // ignore
            }
          }
          throw new Error(message);
        }

        const payload = await response.json();
        if (controller.signal.aborted) {
          return;
        }

        const issues: PromptLintIssueRecord[] = Array.isArray(payload?.lint_issues)
          ? (payload.lint_issues as any[]).map((issue) => ({
              code: typeof issue?.code === 'string' ? issue.code : String(issue?.code ?? ''),
              severity:
                issue?.severity === 'error' || issue?.severity === 'warning' || issue?.severity === 'info' || issue?.severity === 'success'
                  ? issue.severity
                  : 'info',
              message: typeof issue?.message === 'string' ? issue.message : String(issue?.message ?? ''),
              range: issue?.range ?? null,
              fix_hint: typeof issue?.fix_hint === 'string' ? issue.fix_hint : null,
              tags: Array.isArray(issue?.tags) ? issue.tags : null,
              metadata: typeof issue?.metadata === 'object' && issue?.metadata !== null ? issue.metadata : null,
            }))
          : [];

        const summaryPayload = payload?.summary ?? null;
        const nextSummary: LintSummaryState =
          summaryPayload && typeof summaryPayload === 'object'
            ? {
                totalIssues: Number(summaryPayload.totalIssues) || issues.length,
                errors: Number(summaryPayload.errors) || 0,
                warnings: Number(summaryPayload.warnings) || 0,
                infos: Number(summaryPayload.infos) || 0,
                successes: Number(summaryPayload.successes) || 0,
              }
            : {
                totalIssues: issues.length,
                errors: issues.filter((issue) => issue.severity === 'error').length,
                warnings: issues.filter((issue) => issue.severity === 'warning').length,
                infos: issues.filter((issue) => issue.severity === 'info').length,
                successes: issues.filter((issue) => issue.severity === 'success').length,
              };

        setLintIssues(issues);
        setLintSummary(nextSummary);
        setLintGeneratedAt(typeof payload?.generated_at === 'string' ? payload.generated_at : null);
        setLintConfigVersion(typeof payload?.config_version === 'string' ? payload.config_version : null);
        setLintError(null);
      } catch (error: any) {
        if (error?.name === 'AbortError') {
          setLinting(false);
          return;
        }
        if (!controller.signal.aborted) {
          setLintIssues([]);
          setLintSummary(null);
          setLintGeneratedAt(null);
          setLintError(typeof error?.message === 'string' ? error.message : dict.lintErrorState);
        }
        setLintConfigVersion(null);
      } finally {
        if (!controller.signal.aborted) {
          setLinting(false);
        }
        if (lintAbortRef.current === controller) {
          lintAbortRef.current = null;
        }
      }
    }, 400);

    lintDebounceRef.current = timeoutId;

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
      if (lintDebounceRef.current === timeoutId) {
        lintDebounceRef.current = null;
      }
    };
  }, [content, locale, lintRefreshToken, dict.lintErrorState]);

  useEffect(() => {
    if (skipContentEffectRef.current) {
      skipContentEffectRef.current = false;
      return;
    }
    if (fixApplied) {
      setFixApplied(false);
      contentBeforeFixRef.current = null;
    }
  }, [content, fixApplied]);

  const handleLintRetry = () => {
    setLintRefreshToken((token) => token + 1);
  };

  const handleRequestFix = async () => {
    if (fixPending) return;
    if (!hasPromptContent || lintIssues.length === 0) {
      setFixError(dict.lintFixRequiredIssues);
      setFixSuggestion(null);
      return;
    }
    setFixPending(true);
    setFixError(null);
    try {
      const response = await fetch('/api/linter/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: content,
          issues: lintIssues,
          locale,
          config_version: lintConfigVersion,
        }),
      });
      if (!response.ok) {
        let message = dict.lintFixError;
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
      const data = await response.json();
      const revisedPrompt = typeof data?.revised_prompt === 'string' ? data.revised_prompt : '';
      if (!revisedPrompt.trim()) {
        throw new Error(dict.lintFixError);
      }
      const diff = typeof data?.diff === 'string' ? data.diff : null;
      const summary = typeof data?.summary === 'string' ? data.summary : null;
      const rawSuggestions = Array.isArray(data?.suggestions) ? data.suggestions : [];
      const suggestions =
        rawSuggestions.length > 0
          ? rawSuggestions
              .map((item: any) => ({
                issue_code: typeof item?.issue_code === 'string' ? item.issue_code : null,
                description: typeof item?.description === 'string' ? item.description : null,
              }))
              .filter(
                (
                  item: {
                    issue_code: string | null;
                    description: string | null;
                  }
                ) => Boolean(item.issue_code || item.description)
              )
          : null;

      const suggestion: FixSuggestion = {
        revisedPrompt,
        diff,
        summary,
        suggestions,
      };
      setFixSuggestion(suggestion);
      setFixPreviewOpen(Boolean(diff));
      setFixApplied(false);
      contentBeforeFixRef.current = null;
    } catch (error: any) {
      setFixSuggestion(null);
      setFixError(typeof error?.message === 'string' ? error.message : dict.lintFixError);
    } finally {
      setFixPending(false);
    }
  };

  const handleApplyFix = () => {
    if (!fixSuggestion) return;
    contentBeforeFixRef.current = content;
    skipContentEffectRef.current = true;
    setContent(fixSuggestion.revisedPrompt);
    setFixApplied(true);
    setFixError(null);
  };

  const handleUndoFix = () => {
    if (!fixApplied) return;
    const previous = contentBeforeFixRef.current;
    skipContentEffectRef.current = true;
    if (previous !== null) {
      setContent(previous);
    }
    contentBeforeFixRef.current = null;
    setFixApplied(false);
  };

  // 自动触发修正建议（从详情页点击"生成修正建议"按钮跳转过来时）
  useEffect(() => {
    const autoFix = searchParams?.get('autoFix');
    if (autoFix === 'true' && !autoFixTriggeredRef.current && !linting && lintIssues.length > 0 && hasPromptContent && !fixPending && !fixSuggestion) {
      autoFixTriggeredRef.current = true;
      handleRequestFix();
    }
  }, [searchParams, linting, lintIssues.length, hasPromptContent, fixPending, fixSuggestion]);

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

  const handleBootstrap = async () => {
    if (bootstrapping || !bootstrapGoal.trim()) return;
    setBootstrapping(true);
    setBootstrapError(null);
    try {
      const response = await fetch('/api/bootstrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: bootstrapGoal,
          domain: bootstrapDomain,
          audience: bootstrapAudience,
          constraints: bootstrapConstraints,
          locale,
        }),
      });
      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail?.error || (dict as any).bootstrapError || 'Failed to generate template');
      }
      const json = await response.json();
      const result = json as BootstrapResult;
      setTitle(result.title);
      setContent(result.content);
      if (result.suggestedCategory) {
        setCustomCategory(result.suggestedCategory);
      }
      setMode('manual');
    } catch (error: any) {
      setBootstrapError(error?.message || (dict as any).bootstrapError || 'Failed to generate template');
    } finally {
      setBootstrapping(false);
    }
  };

  const handleTemplateSelect = (template: PromptTemplate, filledContent: string) => {
    setTitle(template.title[locale] || template.title.en);
    setContent(filledContent);
    setMode('manual');
  };

  const severityColors: Record<'error' | 'warning' | 'info' | 'success', string> = {
    error: '#ef4444',
    warning: '#f97316',
    info: '#38bdf8',
    success: '#10b981',
  };

  const lintVariant: LintVisualState = lintSummary
    ? lintSummary.errors > 0
      ? 'error'
      : lintSummary.warnings > 0
        ? 'warning'
        : lintSummary.infos > 0
          ? 'info'
          : 'none'
    : lintError
      ? 'warning'
      : 'none';

  const lintFooterMessage = (() => {
    if (linting) {
      return dict.lintLoading;
    }
    if (lintError) {
      return lintError;
    }
    if (lintSummary) {
      if (lintSummary.totalIssues > 0) {
        return `${dict.lintSummaryLabel} ${dict.lintCountsLabel.error} ${lintSummary.errors} · ${dict.lintCountsLabel.warning} ${lintSummary.warnings} · ${dict.lintCountsLabel.info} ${lintSummary.infos} · ${dict.lintCountsLabel.success} ${lintSummary.successes}`;
      }
      return dict.lintEmptyState;
    }
    if (hasPromptContent) {
      return dict.lintLoading;
    }
    return dict.lintEmptyState;
  })();

  const lintFooterElement = (
    <div
      id={lintStatusId}
      aria-live="polite"
      className="muted"
      style={{
        fontSize: 12,
        color:
          lintVariant === 'error'
            ? severityColors.error
            : lintVariant === 'warning'
              ? severityColors.warning
              : lintVariant === 'info'
                ? severityColors.info
                : '#9ca3af',
      }}
    >
      {lintFooterMessage}
    </div>
  );

  const formattedLintTime =
    lintGeneratedAt && !Number.isNaN(new Date(lintGeneratedAt).getTime())
      ? new Date(lintGeneratedAt).toLocaleString()
      : null;

  const severityOrder: Array<{
    key: 'errors' | 'warnings' | 'infos' | 'successes';
    severity: 'error' | 'warning' | 'info' | 'success';
  }> = [
    { key: 'errors', severity: 'error' },
    { key: 'warnings', severity: 'warning' },
    { key: 'infos', severity: 'info' },
    { key: 'successes', severity: 'success' },
  ];

  const lintSummaryBadges = lintSummary
    ? severityOrder.map(({ key, severity }) => ({
        label: dict.lintSeverityLabels[severity],
        value: lintSummary[key],
        severity,
      }))
    : [];

  const lintPayloadValue = useMemo(() => {
    if (!hasPromptContent) {
      return JSON.stringify({ issues: [] });
    }
    return JSON.stringify({
      issues: lintIssues,
      summary: lintSummary,
      generated_at: lintGeneratedAt,
      config_version: lintConfigVersion,
    });
  }, [hasPromptContent, lintIssues, lintSummary, lintGeneratedAt, lintConfigVersion]);

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
        <button
          type="button"
          className="btn"
          onClick={() => handleModeChange('bootstrap')}
          style={{
            background: mode === 'bootstrap' ? '#4f46e5' : '#1a1f2c',
            borderColor: mode === 'bootstrap' ? '#4f46e5' : '#343b4f',
          }}
        >
          {dict.modeToggleBootstrap || 'Bootstrap'}
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => handleModeChange('template')}
          style={{
            background: mode === 'template' ? '#4f46e5' : '#1a1f2c',
            borderColor: mode === 'template' ? '#4f46e5' : '#343b4f',
          }}
        >
          {dict.modeToggleTemplate}
        </button>
      </div>

      <form ref={formRef} action={formAction} className="card col" style={{ gap: 16 }}>
        <input type="hidden" name="redirectTo" value={redirectTo} />
        {initial?.id ? <input type="hidden" name="prompt_id" value={initial.id} /> : null}
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
          contentRef={contentRef}
          lintVariant={lintVariant}
          lintFooter={lintFooterElement}
          contentDescribedBy={lintStatusId}
        />
        <input type="hidden" name="lint_payload" value={lintPayloadValue} />
        {saveError ? (
          <span className="muted" style={{ color: '#ef4444' }}>
            {saveError}
          </span>
        ) : null}
        <div className="row" style={{ gap: 8, justifyContent: 'flex-end' }}>
          <SaveButton label={dict.saveButton} saving={dict.savingButton} />
        </div>
      </form>

      {hasPromptContent ? (
        <div className="card col" style={{ gap: 12 }}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div className="row" style={{ gap: 8, alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>{dict.lintPanelTitle}</h3>
              {linting ? (
                <span className="muted" style={{ fontSize: 12 }}>
                  {dict.lintLoading}
                </span>
              ) : null}
            </div>
            <div className="row" style={{ gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              {formattedLintTime ? (
                <span className="muted" style={{ fontSize: 12 }}>
                  {dict.lintUpdatedAt.replace('{time}', formattedLintTime)}
                </span>
              ) : null}
              <button
                type="button"
                className="btn"
                onClick={handleLintRetry}
                disabled={linting}
                style={{
                  background: '#1a1f2c',
                  borderColor: '#343b4f',
                  padding: '6px 12px',
                  fontSize: 12,
                }}
              >
                {dict.lintRetryButton}
              </button>
            </div>
          </div>

          <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
            {lintSummaryBadges.length > 0
              ? lintSummaryBadges.map(({ label, value, severity }) => (
                  <div
                    key={severity}
                    className="row"
                    style={{
                      gap: 6,
                      alignItems: 'center',
                      padding: '6px 10px',
                      borderRadius: 6,
                      border: `1px solid ${severityColors[severity]}33`,
                      background: `${severityColors[severity]}20`,
                      color: severityColors[severity],
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                ))
              : (
                  <span className="muted" style={{ fontSize: 12 }}>
                    {dict.lintSummaryLabel}
                  </span>
                )}
          </div>

          <div className="row" style={{ gap: 8, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn"
              onClick={handleRequestFix}
              disabled={fixPending || lintIssues.length === 0 || !hasPromptContent}
              style={{
                background: '#1a1f2c',
                borderColor: '#343b4f',
                padding: '6px 12px',
                fontSize: 12,
              }}
            >
              {fixPending ? dict.lintFixGeneratingButton : dict.lintFixGenerateButton}
            </button>
            {fixApplied ? (
              <span className="muted" style={{ fontSize: 12 }}>
                {dict.lintFixAppliedNotice}
              </span>
            ) : null}
          </div>

          {fixError ? (
            <span className="muted" style={{ color: severityColors.error, fontSize: 13 }}>
              {fixError}
            </span>
          ) : null}

          {lintError ? (
            <span className="muted" style={{ color: severityColors.error, fontSize: 13 }}>
              {lintError}
            </span>
          ) : lintSummary && lintSummary.totalIssues === 0 ? (
            <span className="muted" style={{ fontSize: 13 }}>
              {dict.lintEmptyState}
            </span>
          ) : null}

          {fixSuggestion ? (
            <div className="col" style={{ gap: 8 }}>
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <strong style={{ fontSize: 13 }}>{dict.lintFixSummaryTitle}</strong>
                <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn"
                    onClick={handleApplyFix}
                    disabled={fixPending || !fixSuggestion || fixApplied}
                    style={{
                      background: fixApplied ? '#14532d' : '#1a1f2c',
                      borderColor: fixApplied ? '#14532d' : '#343b4f',
                      padding: '4px 10px',
                      fontSize: 12,
                    }}
                  >
                    {dict.lintFixApplyButton}
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={handleUndoFix}
                    disabled={!fixApplied}
                    style={{
                      background: '#1a1f2c',
                      borderColor: '#343b4f',
                      padding: '4px 10px',
                      fontSize: 12,
                      opacity: fixApplied ? 1 : 0.6,
                    }}
                  >
                    {dict.lintFixUndoButton}
                  </button>
                </div>
              </div>
              {fixSuggestion.summary ? (
                <span className="muted" style={{ fontSize: 13 }}>
                  {fixSuggestion.summary}
                </span>
              ) : null}
              {fixSuggestion.diff ? (
                <div className="col" style={{ gap: 4 }}>
                  <button
                    type="button"
                    onClick={() => setFixPreviewOpen((open) => !open)}
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
                    {dict.lintFixDiffTitle} {fixPreviewOpen ? '(hide)' : '(show)'}
                  </button>
                  {fixPreviewOpen ? (
                    <pre
                      style={{
                        margin: 0,
                        whiteSpace: 'pre-wrap',
                        background: '#0f172a',
                        borderRadius: 8,
                        padding: 12,
                        fontSize: 12,
                        overflowX: 'auto',
                      }}
                    >
                      {fixSuggestion.diff}
                    </pre>
                  ) : null}
                </div>
              ) : null}
              {fixSuggestion.suggestions && fixSuggestion.suggestions.length > 0 ? (
                <div className="col" style={{ gap: 4 }}>
                  <strong style={{ fontSize: 13 }}>{dict.lintFixSuggestionsTitle}</strong>
                  <div className="col" style={{ gap: 4 }}>
                    {fixSuggestion.suggestions.map((item, index) => (
                      <span key={`${item.issue_code ?? 'issue'}-${index}`} className="muted" style={{ fontSize: 12 }}>
                        {item.issue_code ? `[${item.issue_code}] ` : ''}
                        {item.description ?? ''}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {lintSummary && lintSummary.totalIssues > 0 ? (
            <div className="col" style={{ gap: 8 }}>
              <strong style={{ fontSize: 13 }}>{dict.lintIssueListLabel}</strong>
              <div className="col" style={{ gap: 8 }}>
                {lintIssues.map((issue, index) => {
                  const color = severityColors[issue.severity];
                  const label = dict.lintSeverityLabels[issue.severity];
                  return (
                    <div
                      key={`${issue.code}-${index}`}
                      className="col"
                      style={{
                        gap: 6,
                        border: `1px solid ${color}33`,
                        borderRadius: 8,
                        padding: 12,
                        background: '#101629',
                      }}
                    >
                      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <div className="row" style={{ gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              fontSize: 12,
                              fontWeight: 600,
                              color,
                            }}
                          >
                            {label}
                          </span>
                          <span className="muted" style={{ fontSize: 12 }}>
                            {issue.code}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="btn"
                          onClick={() => {
                            if (contentRef.current) {
                              contentRef.current.focus();
                              try {
                                contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              } catch {
                                contentRef.current.scrollIntoView();
                              }
                            }
                          }}
                          style={{
                            background: '#1a1f2c',
                            borderColor: '#343b4f',
                            padding: '4px 10px',
                            fontSize: 12,
                          }}
                        >
                          {dict.lintFocusButton}
                        </button>
                      </div>
                      <span style={{ fontSize: 13 }}>{issue.message}</span>
                      {issue.fix_hint ? (
                        <span className="muted" style={{ fontSize: 12 }}>
                          {dict.lintFixHintLabel}：{issue.fix_hint}
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
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

      {mode === 'bootstrap' ? (
        <div className="card col" style={{ gap: 12 }}>
          <div className="col" style={{ gap: 4 }}>
            <h3 style={{ margin: 0 }}>{dict.bootstrapTitle}</h3>
            <p className="muted" style={{ margin: 0, fontSize: 13 }}>
              {dict.bootstrapDescription}
            </p>
          </div>
          <div className="col" style={{ gap: 4 }}>
            <label htmlFor="bootstrap-goal">{dict.bootstrapGoalLabel}</label>
            <textarea
              id="bootstrap-goal"
              className="textarea"
              rows={3}
              value={bootstrapGoal}
              onChange={(event) => setBootstrapGoal(event.target.value)}
              placeholder={dict.bootstrapGoalPlaceholder}
              disabled={bootstrapping}
              required
            />
          </div>
          <div className="col" style={{ gap: 4 }}>
            <label htmlFor="bootstrap-domain">{dict.bootstrapDomainLabel}</label>
            <input
              id="bootstrap-domain"
              className="input"
              value={bootstrapDomain}
              onChange={(event) => setBootstrapDomain(event.target.value)}
              placeholder={dict.bootstrapDomainPlaceholder}
              disabled={bootstrapping}
            />
          </div>
          <div className="col" style={{ gap: 4 }}>
            <label htmlFor="bootstrap-audience">{dict.bootstrapAudienceLabel}</label>
            <input
              id="bootstrap-audience"
              className="input"
              value={bootstrapAudience}
              onChange={(event) => setBootstrapAudience(event.target.value)}
              placeholder={dict.bootstrapAudiencePlaceholder}
              disabled={bootstrapping}
            />
          </div>
          <div className="col" style={{ gap: 4 }}>
            <label htmlFor="bootstrap-constraints">{dict.bootstrapConstraintsLabel}</label>
            <textarea
              id="bootstrap-constraints"
              className="textarea"
              rows={2}
              value={bootstrapConstraints}
              onChange={(event) => setBootstrapConstraints(event.target.value)}
              placeholder={dict.bootstrapConstraintsPlaceholder}
              disabled={bootstrapping}
            />
          </div>
          {bootstrapError ? (
            <span className="muted" style={{ color: '#ef4444' }}>
              {bootstrapError}
            </span>
          ) : null}
          <div className="row" style={{ justifyContent: 'flex-start' }}>
            <button type="button" className="btn" onClick={handleBootstrap} disabled={bootstrapping || !bootstrapGoal.trim()}>
              {bootstrapping ? dict.bootstrapGeneratingButton : dict.bootstrapGenerateButton}
            </button>
          </div>
        </div>
      ) : null}

      {mode === 'template' ? (
        <div className="card col" style={{ gap: 12 }}>
          <div className="col" style={{ gap: 4 }}>
            <h3 style={{ margin: 0 }}>{dict.templateTitle}</h3>
            <p className="muted" style={{ margin: 0, fontSize: 13 }}>
              {dict.templateDescription}
            </p>
          </div>
          <TemplatePicker
            locale={locale}
            onSelect={handleTemplateSelect}
            dict={{
              title: dict.templateTitle,
              searchPlaceholder: dict.templateSearchPlaceholder,
              selectCategory: dict.templateSelectCategory,
              selectTemplate: dict.templateSelectTemplate,
              noResults: dict.templateNoResults,
              fillVariables: dict.templateFillVariables,
              fillVariablesHint: dict.templateFillVariablesHint,
              useTemplate: dict.templateUseButton,
              cancel: dict.templateCancelButton,
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
