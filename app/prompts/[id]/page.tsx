import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import CopyButton from '../../../components/CopyButton';
import DeletePromptButton from '../../../components/DeletePromptButton';
import OpenInChatGPTButton from '../../../components/OpenInChatGPTButton';
import LintRefreshButton from '../../../components/LintRefreshButton';
import AutoLintRefresh from '../../../components/AutoLintRefresh';
import { createRSCClient } from '../../../lib/supabase/server';
import { getDictionary } from '../../../lib/i18n';
import type { PromptLintSnapshot } from '../../../lib/types/prompt';

type PageProps = {
  params: { id: string };
};

const severityColors: Record<'error' | 'warning' | 'info' | 'success', string> = {
  error: '#ef4444',
  warning: '#f97316',
  info: '#38bdf8',
  success: '#10b981',
};

const severityOrder: Array<{ key: 'errors' | 'warnings' | 'infos' | 'successes'; severity: 'error' | 'warning' | 'info' | 'success' }> = [
  { key: 'errors', severity: 'error' },
  { key: 'warnings', severity: 'warning' },
  { key: 'infos', severity: 'info' },
  { key: 'successes', severity: 'success' },
];

type PromptWithRelations = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category_id: string | null;
  created_at: string;
  lint_issues: PromptLintSnapshot | null;
  categories: {
    name: string | null;
  } | null | Array<{ name: string | null }>;
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

  const baseSelect = `
    id,
    user_id,
    title,
    content,
    category_id,
    created_at,
    lint_issues,
    categories:category_id (name)
  `;

  const { data: prompt, error } = await supabase
    .from('prompts')
    .select(baseSelect)
    .eq('id', params.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!prompt || prompt.user_id !== user.id) {
    notFound();
  }

  const promptRow = prompt as PromptWithRelations;

  const rawCategory = Array.isArray(promptRow.categories)
    ? promptRow.categories[0]?.name ?? null
    : promptRow.categories?.name ?? null;
  const categoryName = rawCategory
    ? dict.promptForm.categoryLabels?.[rawCategory] ?? rawCategory
    : dict.promptForm.uncategorized;

  const lintSnapshot = promptRow.lint_issues;
  const lintIssues = lintSnapshot?.issues ?? [];
  const issueCounts = lintIssues.reduce(
    (acc, issue) => {
      if (issue.severity === 'error') acc.errors += 1;
      else if (issue.severity === 'warning') acc.warnings += 1;
      else acc.infos += 1;
      return acc;
    },
    { errors: 0, warnings: 0, infos: 0 }
  );
  const lintSummary = lintSnapshot
    ? {
        totalIssues:
          typeof lintSnapshot.summary?.totalIssues === 'number'
            ? lintSnapshot.summary.totalIssues
            : lintIssues.length,
        errors:
          typeof lintSnapshot.summary?.errors === 'number' ? lintSnapshot.summary.errors : issueCounts.errors,
        warnings:
          typeof lintSnapshot.summary?.warnings === 'number' ? lintSnapshot.summary.warnings : issueCounts.warnings,
        infos: typeof lintSnapshot.summary?.infos === 'number' ? lintSnapshot.summary.infos : issueCounts.infos,
        successes: typeof lintSnapshot.summary?.successes === 'number' ? lintSnapshot.summary.successes : (issueCounts as any).successes || 0,
      }
    : null;

  const lintGeneratedAt = lintSnapshot?.generated_at ?? null;
  const lintGeneratedAtText =
    lintGeneratedAt && !Number.isNaN(new Date(lintGeneratedAt).getTime())
      ? new Date(lintGeneratedAt).toLocaleString()
      : null;

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="row" style={{ gap: 12, alignItems: 'center' }}>
          <Link href="/dashboard" className="btn-link">
            {dict.dashboard.title}
          </Link>
          <span className="muted">/</span>
          <Link href={`/prompts/${promptRow.id}`} className="prompt-title-link">
            <h1 className="prompt-title" style={{ fontSize: 20 }}>{promptRow.title}</h1>
          </Link>
        </div>
        <div className="row" style={{ gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <CopyButton
            text={promptRow.content}
            label={dict.copy.copy}
            copiedLabel={dict.copy.copied}
            toastMessage={dict.copy.toast}
          />
          <OpenInChatGPTButton prompt={promptRow.content} label={dict.packs.openChatGPT} />
          <Link href={`/prompts/${promptRow.id}/edit`} className="btn-link">
            {dict.promptActions.edit}
          </Link>
          <DeletePromptButton
            id={promptRow.id}
            confirmMessage={dict.deletePrompt.confirm}
            deleteLabel={dict.deletePrompt.delete}
            deletingLabel={dict.deletePrompt.deleting}
            errorLabel={dict.deletePrompt.error}
          />
        </div>
      </div>

      <div className="card col" style={{ gap: 12 }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="prompt-title" style={{ fontSize: 20 }}>{promptRow.title}</h2>
          <span className="tag">{categoryName}</span>
        </div>
        <span className="muted" style={{ fontSize: 12 }}>
          {new Date(promptRow.created_at).toLocaleString()}
        </span>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{promptRow.content}</pre>
      </div>

      <div className="card col" style={{ gap: 12 }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <h3 style={{ margin: 0 }}>{dict.promptForm.lintPanelTitle}</h3>
          <div className="row" style={{ gap: 8, alignItems: 'center' }}>
            {lintGeneratedAtText ? (
              <span className="muted" style={{ fontSize: 12 }}>
                {dict.promptForm.lintUpdatedAt.replace('{time}', lintGeneratedAtText)}
              </span>
            ) : null}
            <LintRefreshButton
              promptId={promptRow.id}
              content={promptRow.content}
              locale={dict.locale}
              refreshLabel={dict.promptForm.lintRetryButton}
              refreshingLabel={dict.promptForm.lintLoading}
            />
          </div>
        </div>

        {lintSnapshot ? (
          <>
            <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
              {severityOrder.map(({ key, severity }) => (
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
                  <span>{dict.promptForm.lintSeverityLabels[severity]}</span>
                  <span>{lintSummary ? lintSummary[key] : 0}</span>
                </div>
              ))}
            </div>

            {lintIssues.length === 0 ? (
              <span className="muted" style={{ fontSize: 13 }}>
                {dict.promptForm.lintEmptyState}
              </span>
            ) : (
              <div className="col" style={{ gap: 8 }}>
                <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <strong style={{ fontSize: 13 }}>{dict.promptForm.lintIssueListLabel}</strong>
                  <Link
                    href={`/prompts/${promptRow.id}/edit?autoFix=true`}
                    className="btn-link"
                    style={{ fontSize: 12, padding: '4px 10px' }}
                  >
                    {dict.promptForm.lintFixGenerateButton}
                  </Link>
                </div>
                <div className="col" style={{ gap: 8 }}>
                  {lintIssues.map((issue, index) => {
                    const severity = issue.severity;
                    const color = severityColors[severity];
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
                            {dict.promptForm.lintSeverityLabels[severity]}
                          </span>
                          <span className="muted" style={{ fontSize: 12 }}>
                            {issue.code}
                          </span>
                        </div>
                        <span style={{ fontSize: 13 }}>{issue.message}</span>
                        {issue.fix_hint ? (
                          <span className="muted" style={{ fontSize: 12 }}>
                            {dict.promptForm.lintFixHintLabel}：{issue.fix_hint}
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <span className="muted" style={{ fontSize: 13 }}>
            {dict.promptForm.lintNoResultHint}
          </span>
        )}
      </div>

      <AutoLintRefresh
        promptId={promptRow.id}
        content={promptRow.content}
        locale={dict.locale}
        hasLintSnapshot={!!lintSnapshot}
      />
    </div>
  );
}
