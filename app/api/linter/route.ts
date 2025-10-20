import { NextResponse } from 'next/server';

import { lintPrompt } from '../../../lib/linter/engine';
import { createActionClient } from '../../../lib/supabase/server';

type LinterRequestPayload = {
  prompt?: unknown;
  locale?: unknown;
  model?: unknown;
};

export async function POST(req: Request) {
  try {
    const supabase = createActionClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as LinterRequestPayload;
    const prompt =
      typeof body.prompt === 'string'
        ? body.prompt
        : Array.isArray(body.prompt)
          ? body.prompt.join('\n\n')
          : '';
    if (!prompt.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const locale = typeof body.locale === 'string' ? body.locale : undefined;
    const result = await lintPrompt(prompt, { locale });

    console.info('linter:success', {
      userId: user.id,
      locale,
      issueCount: result.summary.totalIssues,
    });

    return NextResponse.json({
      lint_issues: result.issues.map((issue) => ({
        code: issue.code,
        severity: issue.severity,
        message: issue.message,
        range: issue.range ?? null,
        fix_hint: issue.fix?.hint ?? null,
        tags: issue.tags ?? null,
        metadata: issue.metadata ?? null,
      })),
      summary: result.summary,
      generated_at: result.generatedAt,
      config_version: result.configVersion ?? null,
    });
  } catch (error: any) {
    console.error('Linter API error', error);
    const status = typeof error?.status === 'number' ? error.status : 500;
    return NextResponse.json(
      { error: error?.message || 'Failed to lint prompt' },
      { status }
    );
  }
}
