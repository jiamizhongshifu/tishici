import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import CopyButton from '../../../components/CopyButton';
import DeletePromptButton from '../../../components/DeletePromptButton';
import OpenInChatGPTButton from '../../../components/OpenInChatGPTButton';
import { createRSCClient } from '../../../lib/supabase/server';
import { getDictionary } from '../../../lib/i18n';
import { lintPrompt } from '../../../lib/linter';
import type { LintIssue, LintSeverity } from '../../../types/lint';

type PageProps = {
  params: { id: string };
};

export default async function PromptDetailPage({ params }: PageProps) {
  const dict = await getDictionary();
  const supabase = createRSCClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: prompt, error } = await supabase
    .from('prompts')
    .select(
      `
        id,
        user_id,
        title,
        content,
        category_id,
        created_at,
        lint_issues,
        categories:category_id (name)
      `
    )
    .eq('id', params.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!prompt || prompt.user_id !== user.id) {
    notFound();
  }

  const rawCategory = (prompt as any)?.categories?.name as string | null;
  const categoryName = rawCategory
    ? dict.promptForm.categoryLabels?.[rawCategory] ?? rawCategory
    : dict.promptForm.uncategorized;

  const lintEvaluation = lintPrompt(prompt.content ?? '');
  const storedIssues = Array.isArray((prompt as any)?.lint_issues)
    ? ((prompt as any).lint_issues as LintIssue[])
    : lintEvaluation.issues;
  const lintStats = lintEvaluation.stats;
  const severityPalette: Record<LintSeverity, { background: string; border: string; text: string }> = {
    error: { background: 'rgba(248, 113, 113, 0.12)', border: '#f87171', text: '#dc2626' },
    warning: { background: 'rgba(251, 191, 36, 0.12)', border: '#fbbf24', text: '#d97706' },
    info: { background: 'rgba(96, 165, 250, 0.12)', border: '#93c5fd', text: '#2563eb' },
  };

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="row" style={{ gap: 12, alignItems: 'center' }}>
          <Link href="/dashboard" className="btn-link">
            {dict.dashboard.title}
          </Link>
          <span className="muted">/</span>
          <Link href={`/prompts/${prompt.id}`} className="prompt-title-link">
            <h1 className="prompt-title" style={{ fontSize: 20 }}>{prompt.title}</h1>
          </Link>
        </div>
        <div className="row" style={{ gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <CopyButton
            text={prompt.content}
            label={dict.copy.copy}
            copiedLabel={dict.copy.copied}
            toastMessage={dict.copy.toast}
          />
          <OpenInChatGPTButton prompt={prompt.content} label={dict.packs.openChatGPT} />
          <Link href={`/prompts/${prompt.id}/edit`} className="btn-link">
            {dict.promptActions.edit}
          </Link>
          <DeletePromptButton
            id={prompt.id}
            confirmMessage={dict.deletePrompt.confirm}
            deleteLabel={dict.deletePrompt.delete}
            deletingLabel={dict.deletePrompt.deleting}
            errorLabel={dict.deletePrompt.error}
          />
        </div>
      </div>

      <div className="card col" style={{ gap: 12 }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="prompt-title" style={{ fontSize: 20 }}>{prompt.title}</h2>
          <span className="tag">{categoryName}</span>
        </div>
        <span className="muted" style={{ fontSize: 12 }}>
          {new Date(prompt.created_at as string).toLocaleString()}
        </span>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{prompt.content}</pre>
      </div>

      <div className="card col" style={{ gap: 12 }}>
        <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <h3 style={{ margin: 0 }}>{dict.promptForm.lint.summaryHeading}</h3>
          <div className="row" style={{ gap: 12, fontSize: 12, color: '#94a3b8' }}>
            <span>
              {dict.promptForm.lint.wordCountLabel}: {lintStats.wordCount}
            </span>
            <span>
              {dict.promptForm.lint.lineCountLabel}: {lintStats.lineCount}
            </span>
            <span>
              {dict.promptForm.lint.charCountLabel}: {lintStats.charCount}
            </span>
          </div>
        </div>
        <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
          {(Object.keys(lintStats.sections) as Array<keyof typeof lintStats.sections>).map((section) => (
            <div key={section} className="col" style={{ gap: 4, minWidth: 140 }}>
              <span className="muted" style={{ fontSize: 12 }}>
                {dict.promptForm.lint.sectionLabels?.[section as keyof typeof dict.promptForm.lint.sectionLabels] ?? section}
              </span>
              <span style={{ color: lintStats.sections[section] ? '#34d399' : '#f87171', fontWeight: 600 }}>
                {lintStats.sections[section] ? dict.promptForm.lint.coverageOk : dict.promptForm.lint.coverageMissing}
              </span>
            </div>
          ))}
        </div>
        <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          {(['error', 'warning', 'info'] as LintSeverity[]).map((severity) => {
            const palette = severityPalette[severity];
            return (
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
                {dict.promptForm.lint.severityLabels[severity]}: {lintStats.severityCount[severity] ?? 0}
              </span>
            );
          })}
        </div>
        <div className="col" style={{ gap: 8 }}>
          {storedIssues.length > 0 ? (
            storedIssues.map((issue, index) => {
              const severity = (issue.severity ?? 'info') as LintSeverity;
              const palette = severityPalette[severity] ?? severityPalette.info;
              return (
                <div
                  key={`${issue.code}-${index}`}
                  className="row"
                  style={{
                    gap: 12,
                    alignItems: 'flex-start',
                    background: palette.background,
                    border: `1px solid ${palette.border}`,
                    borderRadius: 8,
                    padding: '8px 12px',
                  }}
                >
                  <span
                    className="tag"
                    style={{ background: palette.border, color: '#0f172a', fontWeight: 600, minWidth: 72, textAlign: 'center' }}
                  >
                    {dict.promptForm.lint.severityLabels[severity] ?? severity}
                  </span>
                  <div className="col" style={{ gap: 4, flex: 1 }}>
                    <span style={{ fontWeight: 500 }}>{issue.message}</span>
                    {issue.fix_hint ? (
                      <span className="muted" style={{ fontSize: 12 }}>{issue.fix_hint}</span>
                    ) : null}
                  </div>
                </div>
              );
            })
          ) : (
            <span className="muted" style={{ fontSize: 12 }}>{dict.promptForm.lint.empty}</span>
          )}
        </div>
      </div>
    </div>
  );
}
