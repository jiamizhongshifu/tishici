import { NextResponse } from 'next/server';

import { runChatCompletionWithUsage, persistOpenAIUsage } from '../../../../lib/openai';
import { createActionClient } from '../../../../lib/supabase/server';

type LintIssuePayload = {
  code?: unknown;
  severity?: unknown;
  message?: unknown;
  fix_hint?: unknown;
};

type RequestPayload = {
  prompt?: unknown;
  issues?: unknown;
  locale?: unknown;
  model?: unknown;
  config_version?: unknown;
};

type FixSuggestion = {
  revised_prompt: string;
  diff?: string | null;
  summary?: string | null;
  suggestions?: Array<{
    issue_code?: string | null;
    description?: string | null;
  }> | null;
};

const SYSTEM_PROMPT = `You are an expert prompt engineer. Given a prompt and a list of lint issues, generate a concise improvement plan.
Respond in strict JSON with the following shape:
{
  "summary": "string (short overview of the main changes)",
  "suggestions": [
    { "issue_code": "string", "description": "string" }
  ],
  "revised_prompt": "string (the improved prompt text)",
  "diff": "string (a unified diff or bullet list highlighting key edits)"
}
Ensure "revised_prompt" preserves the author's intent, resolves the issues, and keeps placeholders intact.
If an issue is already addressed or not applicable, still produce a balanced improvement.
Use the same language as the original prompt.`;

function sanitizeIssues(issues: unknown): LintIssuePayload[] {
  if (!Array.isArray(issues)) {
    return [];
  }
  return issues
    .filter((issue): issue is LintIssuePayload => typeof issue === 'object' && issue !== null)
    .map((issue) => ({
      code: issue.code,
      severity: issue.severity,
      message: issue.message,
      fix_hint: issue.fix_hint ?? (issue as any)?.fixHint,
    }));
}

function buildIssueList(issues: LintIssuePayload[], locale: string) {
  if (issues.length === 0) {
    return 'No issues provided.';
  }
  const header = locale === 'zh' ? '以下是检测到的问题：' : 'Here are the detected issues:';
  const body = issues
    .slice(0, 12)
    .map((issue, index) => {
      const code = typeof issue.code === 'string' ? issue.code : `ISSUE_${index + 1}`;
      const severity = typeof issue.severity === 'string' ? issue.severity : 'info';
      const message =
        typeof issue.message === 'string'
          ? issue.message
          : typeof issue.message === 'object' && issue.message !== null
            ? JSON.stringify(issue.message)
            : '';
      const fixHint = typeof issue.fix_hint === 'string' ? issue.fix_hint : '';
      return `- [${severity}] ${code}: ${message}${fixHint ? `\n  Fix hint: ${fixHint}` : ''}`;
    })
    .join('\n');
  return `${header}\n${body}`;
}

function parseFixSuggestion(raw: unknown): FixSuggestion | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const data = raw as Record<string, unknown>;
  const revisedPrompt = typeof data.revised_prompt === 'string' ? data.revised_prompt : null;
  if (!revisedPrompt) return null;
  const diff = typeof data.diff === 'string' ? data.diff : null;
  const summary = typeof data.summary === 'string' ? data.summary : null;
  const suggestions = Array.isArray(data.suggestions)
    ? data.suggestions
        .filter((item) => item && typeof item === 'object')
        .map((item) => {
          const entry = item as Record<string, unknown>;
          return {
            issue_code: typeof entry.issue_code === 'string' ? entry.issue_code : null,
            description: typeof entry.description === 'string' ? entry.description : null,
          };
        })
    : null;
  return {
    revised_prompt: revisedPrompt,
    diff,
    summary,
    suggestions,
  };
}

function safeJsonParse(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start >= 0 && end >= start) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createActionClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as RequestPayload;
    const prompt = typeof body.prompt === 'string' ? body.prompt : '';
    if (!prompt.trim()) {
      return NextResponse.json({ error: 'Prompt content is required' }, { status: 400 });
    }

    const issues = sanitizeIssues(body.issues);
    if (issues.length === 0) {
      return NextResponse.json({ error: 'At least one lint issue is required for fix generation' }, { status: 400 });
    }

    const locale = body.locale === 'en' ? 'en' : 'zh';
    const issueList = buildIssueList(issues, locale);
    console.info('linter_fix:requested', {
      userId: user.id,
      issuesCount: issues.length,
      locale,
      configVersion: typeof body.config_version === 'string' ? body.config_version : null,
    });

    const userPrompt =
      locale === 'zh'
        ? [
            '请根据下方原始提示词与问题，提供改进说明，并输出 JSON。',
            '字段要求：',
            '- summary：一句话概述改动重点；',
            '- suggestions：数组，逐项说明每个问题的改进方式；',
            '- revised_prompt：修改后的完整提示词；',
            '- diff：可读的差异描述（可使用 unified diff 或条目列表）。',
            '',
            '原始提示词：',
            '---',
            prompt,
            '---',
            '',
            issueList,
          ].join('\n')
        : [
            'Review the prompt and issues below. Produce an improved version and describe the key changes. Return JSON only with the required keys.',
            'Fields:',
            '- summary: brief overview of the main fixes;',
            '- suggestions: array describing how each issue is addressed;',
            '- revised_prompt: the improved prompt body;',
            '- diff: readable diff or bullet list highlighting updates.',
            '',
            'Original prompt:',
            '---',
            prompt,
            '---',
            '',
            issueList,
          ].join('\n');

    const { output, usage } = await runChatCompletionWithUsage({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      model: typeof body.model === 'string' ? body.model : undefined,
      onUsage: async (usageData) => {
        await persistOpenAIUsage(supabase, usageData, {
          userId: user.id,
          taskId: 'linter_fix',
          meta: {
            issues_count: issues.length,
            config_version: typeof body.config_version === 'string' ? body.config_version : null,
          },
        });
      },
    });

    const parsed = safeJsonParse(output);
    const suggestion = parseFixSuggestion(parsed);
    if (!suggestion) {
      return NextResponse.json(
        {
          error: 'Failed to parse fix suggestion',
          raw: output,
        },
        { status: 502 }
      );
    }

    console.info('linter_fix:success', {
      userId: user.id,
      issuesCount: issues.length,
      usage,
    });

    return NextResponse.json({
      summary: suggestion.summary ?? null,
      suggestions: suggestion.suggestions ?? null,
      revised_prompt: suggestion.revised_prompt,
      diff: suggestion.diff ?? null,
      usage,
    });
  } catch (error: any) {
    console.error('Linter fix API error', error);
    const status = typeof error?.status === 'number' ? error.status : 500;
    return NextResponse.json(
      { error: error?.message || 'Failed to generate fix suggestion' },
      { status }
    );
  }
}
