import { NextResponse } from 'next/server';
import { lintPrompt, ruleVersion } from '../../../lib/linter';
import { createActionClient } from '../../../lib/supabase/server';
import type { LintResponse } from '../../../types/lint';

export async function POST(req: Request) {
  try {
    const supabase = createActionClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error('Supabase auth error on /api/linter', authError);
    }

    if (!user) {
      return NextResponse.json({ error: 'NOT_AUTHENTICATED' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const prompt = typeof body?.prompt === 'string' ? body.prompt : typeof body?.content === 'string' ? body.content : '';

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: 'PROMPT_REQUIRED' },
        { status: 400 }
      );
    }

    const { issues, stats, version } = lintPrompt(prompt);

    const response: LintResponse = {
      lint_issues: issues,
      stats,
      rule_version: version || ruleVersion,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Linter API error', error);
    return NextResponse.json({ error: 'LINTER_FAILED' }, { status: 500 });
  }
}
