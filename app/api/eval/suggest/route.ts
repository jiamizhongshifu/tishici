import { NextResponse } from 'next/server';

import { runChatCompletionWithUsage } from '../../../../lib/openai';
import { createActionClient } from '../../../../lib/supabase/server';

type RequestPayload = {
  prompt?: unknown;
  improvements?: unknown;
  strengths?: unknown;
  locale?: unknown;
  model?: unknown;
};

type ImprovementSuggestion = {
  summary: string | null;
  diff: string | null;
  revised_prompt: string;
};

const SYSTEM_PROMPT = `You are an expert prompt engineer.
Given a prompt and a list of evaluation insights, craft an improved version.
Return JSON:
{
  "summary": "string",
  "diff": "string",
  "revised_prompt": "string"
}
Keep placeholders intact, preserve successful aspects, and address the improvements provided. Use the same language as the input prompt.`;

function normalizeLines(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter((item) => item.length > 0)
      .slice(0, 12);
  }
  if (typeof value === 'string') {
    return value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .slice(0, 12);
  }
  return [];
}

function buildUserPrompt(prompt: string, improvements: string[], strengths: string[], locale: string) {
  const header =
    locale === 'zh'
      ? '请基于以下提示词与评测反馈生成改进版提示词。'
      : 'Generate an improved version of the prompt using the evaluation feedback below.';
  const improvementsHeader = locale === 'zh' ? '改进建议：' : 'Improvements:';
  const strengthsHeader = locale === 'zh' ? '保持优势：' : 'Keep strengths:';

  const body: string[] = [header, '', '--- Prompt ---', prompt.trim(), '---'];

  if (improvements.length > 0) {
    body.push('', improvementsHeader, ...improvements.map((item) => `- ${item}`));
  }

  if (strengths.length > 0) {
    body.push('', strengthsHeader, ...strengths.map((item) => `- ${item}`));
  }

  body.push(
    '',
    locale === 'zh'
      ? '输出要求：只返回 JSON，并确保 revised_prompt 为完整提示词，diff 可为要点或简化的 diff。'
      : 'Output requirements: return JSON only, ensure revised_prompt is the full prompt, diff can be bullet list or succinct diff.'
  );

  return body.join('\n');
}

function safeParseSuggestion(text: string): ImprovementSuggestion | null {
  try {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object') return null;
    const record = parsed as Record<string, unknown>;
    const revisedPrompt = typeof record.revised_prompt === 'string' ? record.revised_prompt : null;
    if (!revisedPrompt) return null;
    return {
      revised_prompt: revisedPrompt,
      summary: typeof record.summary === 'string' ? record.summary : null,
      diff: typeof record.diff === 'string' ? record.diff : null,
    };
  } catch {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start >= 0 && end >= start) {
      try {
        return safeParseSuggestion(text.slice(start, end + 1));
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
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const improvements = normalizeLines(body.improvements);
    if (improvements.length === 0) {
      return NextResponse.json({ error: 'Improvements list is required' }, { status: 400 });
    }
    const strengths = normalizeLines(body.strengths);
    const locale = body.locale === 'zh' ? 'zh' : 'en';

    const { output } = await runChatCompletionWithUsage({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: buildUserPrompt(prompt, improvements, strengths, locale),
        },
      ],
      model: typeof body.model === 'string' ? body.model : undefined,
    });

    const suggestion = safeParseSuggestion(output);
    if (!suggestion) {
      return NextResponse.json(
        { error: 'Failed to parse improvement suggestion', raw: output },
        { status: 502 }
      );
    }

    return NextResponse.json({
      summary: suggestion.summary,
      diff: suggestion.diff,
      revised_prompt: suggestion.revised_prompt,
    });
  } catch (error: any) {
    console.error('Eval suggest API error', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate improved prompt' },
      { status: error?.status || 500 }
    );
  }
}
