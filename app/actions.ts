'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createActionClient } from '../lib/supabase/server';
import { ensureCategory } from '../lib/categories';
import type { PromptLintSnapshot, PromptLintIssueRecord, PromptLintSummary } from '../lib/types/prompt';

type RawLintIssue = Record<string, unknown>;
type RawLintPayload = {
  issues?: RawLintIssue[];
  summary?: Record<string, unknown>;
  generated_at?: unknown;
  config_version?: unknown;
};

type PostgrestErrorLike = {
  code?: string;
  message?: string;
};

function normalizeSeverity(value: unknown): PromptLintIssueRecord['severity'] {
  return value === 'error' || value === 'warning' || value === 'info' ? value : 'info';
}

function sanitizeLintIssue(raw: RawLintIssue): PromptLintIssueRecord | null {
  const codeRaw = raw?.code;
  const messageRaw = raw?.message;
  const code = typeof codeRaw === 'string' && codeRaw.trim().length > 0 ? codeRaw.trim() : String(codeRaw ?? '').trim();
  const message =
    typeof messageRaw === 'string' && messageRaw.trim().length > 0 ? messageRaw.trim() : String(messageRaw ?? '').trim();
  if (!code || !message) {
    return null;
  }

  const severity = normalizeSeverity(raw?.severity);
  const fixHintRaw = raw?.fix_hint;
  const range = typeof raw?.range === 'object' && raw?.range !== null ? (raw.range as PromptLintIssueRecord['range']) : null;
  const tags = Array.isArray(raw?.tags) ? raw.tags.filter((tag) => typeof tag === 'string') : null;
  const metadata =
    raw?.metadata && typeof raw.metadata === 'object' && !Array.isArray(raw.metadata) ? (raw.metadata as Record<string, unknown>) : null;

  return {
    code,
    severity,
    message,
    range,
    fix_hint: typeof fixHintRaw === 'string' ? fixHintRaw : null,
    tags,
    metadata,
  };
}

function buildSummaryFromIssues(issues: PromptLintIssueRecord[]): PromptLintSummary {
  const summary = {
    totalIssues: issues.length,
    errors: 0,
    warnings: 0,
    infos: 0,
    successes: 0,
  };
  for (const issue of issues) {
    if (issue.severity === 'error') {
      summary.errors += 1;
    } else if (issue.severity === 'warning') {
      summary.warnings += 1;
    } else if (issue.severity === 'success') {
      summary.successes += 1;
    } else {
      summary.infos += 1;
    }
  }
  return summary;
}

function sanitizeSummary(raw: Record<string, unknown> | undefined, fallbackIssues: PromptLintIssueRecord[]): PromptLintSummary | null {
  if (!raw) {
    return fallbackIssues.length > 0 ? buildSummaryFromIssues(fallbackIssues) : null;
  }
  const summary = {
    totalIssues: typeof raw.totalIssues === 'number' ? raw.totalIssues : Number(raw.totalIssues ?? 0),
    errors: typeof raw.errors === 'number' ? raw.errors : Number(raw.errors ?? 0),
    warnings: typeof raw.warnings === 'number' ? raw.warnings : Number(raw.warnings ?? 0),
    infos: typeof raw.infos === 'number' ? raw.infos : Number(raw.infos ?? 0),
    successes: typeof raw.successes === 'number' ? raw.successes : Number(raw.successes ?? 0),
  };

  if (!Number.isFinite(summary.totalIssues) || summary.totalIssues < 0) {
    summary.totalIssues = fallbackIssues.length;
  }
  if (!Number.isFinite(summary.errors) || summary.errors < 0) {
    summary.errors = fallbackIssues.filter((issue) => issue.severity === 'error').length;
  }
  if (!Number.isFinite(summary.warnings) || summary.warnings < 0) {
    summary.warnings = fallbackIssues.filter((issue) => issue.severity === 'warning').length;
  }
  if (!Number.isFinite(summary.infos) || summary.infos < 0) {
    summary.infos = fallbackIssues.filter((issue) => issue.severity === 'info').length;
  }
  if (summary.totalIssues === 0 && summary.errors === 0 && summary.warnings === 0 && summary.infos === 0) {
    return fallbackIssues.length > 0 ? buildSummaryFromIssues(fallbackIssues) : summary;
  }
  return summary;
}

function parseLintPayload(rawValue: FormDataEntryValue | null): PromptLintSnapshot | null {
  if (!rawValue || typeof rawValue !== 'string') {
    return null;
  }
  const trimmed = rawValue.trim();
  if (!trimmed) {
    return null;
  }
  try {
    const parsed = JSON.parse(trimmed) as RawLintPayload;
    const rawIssues = Array.isArray(parsed?.issues) ? parsed.issues : [];
    const issues = rawIssues
      .map((issue) => sanitizeLintIssue(issue))
      .filter((issue): issue is PromptLintIssueRecord => Boolean(issue));

    const summary = sanitizeSummary(
      parsed?.summary && typeof parsed.summary === 'object' ? (parsed.summary as Record<string, unknown>) : undefined,
      issues
    );

    const generatedAt =
      typeof parsed?.generated_at === 'string' && parsed.generated_at.trim().length > 0 ? parsed.generated_at : null;
    const configVersion =
      typeof parsed?.config_version === 'string' && parsed.config_version.trim().length > 0
        ? parsed.config_version
        : null;

    return {
      issues,
      summary,
      generated_at: generatedAt,
      config_version: configVersion,
    };
  } catch (error) {
    console.error('Failed to parse lint payload', error);
    return null;
  }
}

function getDefaultLintSnapshot(): PromptLintSnapshot {
  return {
    issues: [],
    summary: {
      totalIssues: 0,
      errors: 0,
      warnings: 0,
      infos: 0,
      successes: 0,
    },
    generated_at: null,
    config_version: null,
  };
}

export type CreatePromptState = {
  success: boolean;
  error?: string;
};

export type PromptActionHandler = (
  prevState: CreatePromptState,
  formData: FormData
) => Promise<CreatePromptState>;

export async function createPrompt(
  _prevState: CreatePromptState,
  formData: FormData
): Promise<CreatePromptState> {
  const supabase = createActionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'NOT_AUTHENTICATED' };
  }

  const redirectTo = (formData.get('redirectTo') as string | null)?.trim() || '';
  let title = (formData.get('title') as string | null)?.trim() || '';
  const content = (formData.get('content') as string | null)?.trim() || '';
  const selectedCategoryId = (formData.get('category_id') as string | null)?.trim() || null;
  const customCategoryName = (formData.get('category_name') as string | null)?.trim() || '';

  if (!content) {
    return { success: false, error: 'CONTENT_REQUIRED' };
  }

  if (!title) {
    const fallback = content.split('\n').map((line) => line.trim()).filter(Boolean)[0] ?? '';
    if (!fallback) {
      return { success: false, error: 'TITLE_REQUIRED' };
    }
    title = fallback.slice(0, 80);
  }

  let categoryId = selectedCategoryId;
  if (customCategoryName) {
    try {
      categoryId = await ensureCategory(supabase, customCategoryName);
    } catch {
      return { success: false, error: 'CATEGORY_CREATE_FAILED' };
    }
  }

  const lintSnapshot = parseLintPayload(formData.get('lint_payload')) ?? getDefaultLintSnapshot();

  const { error: insertError } = await supabase
    .from('prompts')
    .insert({
      title,
      content,
      category_id: categoryId,
      user_id: user.id,
      lint_issues: lintSnapshot,
    })
    .select('id')
    .single();

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  revalidatePath('/');
  revalidatePath('/dashboard');

  if (redirectTo && redirectTo !== 'stay') {
    redirect(redirectTo);
  }

  return { success: true };
}

export async function updatePrompt(
  _prevState: CreatePromptState,
  formData: FormData
): Promise<CreatePromptState> {
  const supabase = createActionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'NOT_AUTHENTICATED' };
  }

  const promptId = (formData.get('prompt_id') as string | null)?.trim();
  if (!promptId) {
    return { success: false, error: 'MISSING_PROMPT_ID' };
  }

  const redirectTo = (formData.get('redirectTo') as string | null)?.trim() || '';
  let title = (formData.get('title') as string | null)?.trim() || '';
  const content = (formData.get('content') as string | null)?.trim() || '';
  const selectedCategoryId = (formData.get('category_id') as string | null)?.trim() || null;
  const customCategoryName = (formData.get('category_name') as string | null)?.trim() || '';

  if (!content) {
    return { success: false, error: 'CONTENT_REQUIRED' };
  }

  if (!title) {
    const fallback = content.split('\n').map((line) => line.trim()).filter(Boolean)[0] ?? '';
    if (!fallback) {
      return { success: false, error: 'TITLE_REQUIRED' };
    }
    title = fallback.slice(0, 80);
  }

  let categoryId = selectedCategoryId;
  if (customCategoryName) {
    try {
      categoryId = await ensureCategory(supabase, customCategoryName);
    } catch {
      return { success: false, error: 'CATEGORY_CREATE_FAILED' };
    }
  }

  const lintSnapshot = parseLintPayload(formData.get('lint_payload')) ?? getDefaultLintSnapshot();

  const { error: updateError } = await supabase
    .from('prompts')
    .update({
      title,
      content,
      category_id: categoryId,
      lint_issues: lintSnapshot,
    })
    .eq('id', promptId)
    .eq('user_id', user.id);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  revalidatePath('/');
  revalidatePath('/dashboard');
  revalidatePath(`/prompts/${promptId}`);

  if (redirectTo && redirectTo !== 'stay') {
    redirect(redirectTo);
  }

  return { success: true };
}

export async function importPackPrompt(formData: FormData) {
  const supabase = createActionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  let title = (formData.get('title') as string | null)?.trim() || '';
  const content = (formData.get('content') as string | null)?.trim() || '';
  const redirectTo = (formData.get('redirectTo') as string | null)?.trim() || '/';

  if (!content) {
    redirect(redirectTo || '/');
  }

  if (!title) {
    const fallback = content.split('\n').map((line) => line.trim()).filter(Boolean)[0] ?? '';
    title = fallback.slice(0, 80) || 'Imported prompt';
  }

  const { error: insertError } = await supabase
    .from('prompts')
    .insert({
      title,
      content,
      category_id: null,
      user_id: user.id,
    })
    .select('id')
    .single();

  if (insertError) {
    throw insertError;
  }

  revalidatePath('/');
  revalidatePath('/dashboard');
  redirect(redirectTo || '/');
}

export type ImportPackState = {
  success: boolean;
  count?: number;
  error?: string;
};

function extractPromptsFromPayload(payload: any) {
  const prompts: Array<{ title: string; content: string; category?: string | null }> = [];
  if (Array.isArray(payload?.prompts)) {
    for (const item of payload.prompts) {
      if (item && typeof item === 'object' && typeof item.title === 'string' && typeof item.content === 'string') {
        prompts.push({
          title: item.title,
          content: item.content,
          category: typeof item.category === 'string' ? item.category : null,
        });
      }
    }
  }
  if (Array.isArray(payload?.sections)) {
    for (const section of payload.sections) {
      const heading = typeof section?.heading === 'string' ? section.heading : null;
      if (!Array.isArray(section?.prompts)) continue;
      for (const item of section.prompts) {
        if (item && typeof item === 'object' && typeof item.prompt === 'string') {
          const title =
            typeof item.title === 'string'
              ? item.title
              : typeof item.useCase === 'string'
                ? item.useCase
                : 'Imported prompt';
          prompts.push({
            title,
            content: item.prompt,
            category: typeof item.category === 'string' ? item.category : heading,
          });
        }
      }
    }
  }
  return prompts;
}

export async function importPromptPack(
  _prev: ImportPackState,
  formData: FormData
): Promise<ImportPackState> {
  const supabase = createActionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'NOT_AUTHENTICATED' };
  }

  const raw = (formData.get('pack_json') as string | null)?.trim();
  if (!raw) {
    return { success: false, error: 'PACK_JSON_REQUIRED' };
  }

  let payload: any;
  try {
    payload = JSON.parse(raw);
  } catch (error) {
    return { success: false, error: 'PACK_JSON_INVALID' };
  }

  const prompts = extractPromptsFromPayload(payload);
  if (prompts.length === 0) {
    return { success: false, error: 'NO_PROMPTS_FOUND' };
  }

  const categoryCache = new Map<string, string>();
  const rows: Array<{
    title: string;
    content: string;
    category_id: string | null;
    user_id: string;
  }> = [];

  for (const item of prompts) {
    const title = item.title.trim().slice(0, 120) || 'Imported prompt';
    const content = item.content.trim();
    if (!content) continue;
    let categoryId: string | null = null;
    if (item.category && item.category.trim().length > 0) {
      const key = item.category.trim();
      if (categoryCache.has(key)) {
        categoryId = categoryCache.get(key)!;
      } else {
        try {
          categoryId = await ensureCategory(supabase, key);
          categoryCache.set(key, categoryId ?? '');
        } catch {
          categoryId = null;
        }
      }
    }
    rows.push({
      title,
      content,
      category_id: categoryId,
      user_id: user.id,
    });
  }

  if (rows.length === 0) {
    return { success: false, error: 'NO_VALID_PROMPTS' };
  }

  const { error } = await supabase.from('prompts').insert(rows);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard');
  console.info('pack_import:success', { userId: user.id, inserted: rows.length });
  return { success: true, count: rows.length };
}

export type ExportPackState = {
  success: boolean;
  error?: string;
  packJson?: string;
};

export async function exportPromptPack(
  _prev: ExportPackState,
  formData: FormData
): Promise<ExportPackState> {
  const supabase = createActionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'NOT_AUTHENTICATED' };
  }

  const ids = formData.getAll('prompt_ids').map((value) => String(value).trim()).filter(Boolean);
  if (ids.length === 0) {
    return { success: false, error: 'NO_PROMPTS_SELECTED' };
  }

  const packTitle = (formData.get('pack_title') as string | null)?.trim() || 'My Prompt Pack';
  const packSummary = (formData.get('pack_summary') as string | null)?.trim() || '';

  const { data: rows, error } = await supabase
    .from('prompts')
    .select(
      `
        id,
        title,
        content,
        categories:category_id (name)
      `
    )
    .in('id', ids)
    .eq('user_id', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  const sectionsMap = new Map<string, Array<{ useCase: string; prompt: string }>>();
  for (const row of rows ?? []) {
    const category = ((row as any)?.categories?.name as string | null) ?? 'General';
    if (!sectionsMap.has(category)) {
      sectionsMap.set(category, []);
    }
    sectionsMap.get(category)!.push({
      useCase: (row as any).title ?? 'Untitled',
      prompt: (row as any).content ?? '',
    });
  }

  const sections = Array.from(sectionsMap.entries()).map(([heading, prompts]) => ({
    heading,
    prompts,
  }));

  const packPayload = {
    title: packTitle,
    summary: packSummary,
    generated_at: new Date().toISOString(),
    sections,
  };

  console.info('pack_export:success', { userId: user.id, promptCount: rows?.length ?? 0 });

  return {
    success: true,
    packJson: JSON.stringify(packPayload, null, 2),
  };
}
