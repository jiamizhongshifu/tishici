import { NextResponse } from 'next/server';

import { runChatCompletionWithUsage } from '../../../../lib/openai';
import { createActionClient } from '../../../../lib/supabase/server';
import type { PromptEvalScore } from '../../../../lib/types/prompt';

type EvalPromptInput = {
  id?: unknown;
  title?: unknown;
  content?: unknown;
};

type RequestPayload = {
  prompts?: unknown;
  locale?: unknown;
  model?: unknown;
};

type EvalResult = {
  prompt_id: string | null;
  score: PromptEvalScore;
  usage: {
    model: string;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    costUsd: number;
    latencyMs: number;
  };
};

const SYSTEM_PROMPT = `You are an impartial evaluator for prompt engineering quality.
Assess the prompt across clarity, constraints, and reproducibility, each between 0 and 100.
Provide an overall score (0-100) and list key strengths and improvements.
The response must be valid JSON:
{
  "overall": number,
  "clarity": number,
  "constraints": number,
  "reproducibility": number,
  "strengths": ["string"],
  "improvements": ["string"],
  "notes": "string"
}
Use the same language as the original prompt where appropriate.`;

function sanitizePrompts(value: unknown): EvalPromptInput[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is EvalPromptInput => typeof item === 'object' && item !== null);
}

function buildUserPrompt(prompt: EvalPromptInput, locale: string) {
  const title = typeof prompt.title === 'string' ? prompt.title : '';
  const content = typeof prompt.content === 'string' ? prompt.content : '';
  const header =
    locale === 'zh'
      ? '请根据以下提示词内容进行打分，并提供亮点、改进建议以及备注。'
      : 'Evaluate the prompt below and provide scores plus strengths, improvements, and notes.';
  return [
    header,
    '',
    title ? `Title: ${title}` : null,
    'Prompt:',
    '---',
    content,
    '---',
  ]
    .filter(Boolean)
    .join('\n');
}

function safeParseEvaluation(text: string): PromptEvalScore | null {
  try {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object') return null;
    const data = parsed as Record<string, unknown>;

    const toScore = (value: unknown) => {
      const num = typeof value === 'number' ? value : Number(value);
      if (!Number.isFinite(num)) return null;
      return Math.max(0, Math.min(100, Math.round(num)));
    };

    const normalizeStringArray = (value: unknown) =>
      Array.isArray(value)
        ? value
            .map((item) => (typeof item === 'string' ? item.trim() : ''))
            .filter((item) => item.length > 0)
        : [];

    const clarity = toScore(data.clarity);
    const constraints = toScore(data.constraints);
    const reproducibility = toScore(data.reproducibility);
    const overall = toScore(data.overall) ?? Math.round(
      [clarity, constraints, reproducibility]
        .filter((num): num is number => typeof num === 'number')
        .reduce((sum, num, _, arr) => sum + num / arr.length, 0)
    );

    return {
      overall: overall ?? null,
      clarity: clarity ?? null,
      constraints: constraints ?? null,
      reproducibility: reproducibility ?? null,
      strengths: normalizeStringArray(data.strengths),
      improvements: normalizeStringArray(data.improvements),
      notes: typeof data.notes === 'string' ? data.notes.trim() : null,
    };
  } catch {
    return null;
  }
}

function enrichScore(score: PromptEvalScore, usage: any, model: string): PromptEvalScore {
  const now = new Date().toISOString();
  return {
    ...score,
    model,
    evaluatedAt: now,
    cost: {
      inputTokens: usage?.inputTokens ?? 0,
      outputTokens: usage?.outputTokens ?? 0,
      totalTokens: usage?.totalTokens ?? 0,
      estimatedUsd: usage?.costUsd ?? 0,
    },
  };
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
    const prompts = sanitizePrompts(body.prompts);
    if (prompts.length === 0) {
      return NextResponse.json({ error: 'At least one prompt is required' }, { status: 400 });
    }

    const locale = body.locale === 'zh' ? 'zh' : 'en';
    const model = typeof body.model === 'string' ? body.model : undefined;

    const results: EvalResult[] = [];
    console.info('eval_run:requested', {
      userId: user.id,
      promptCount: prompts.length,
      locale,
      model: model ?? 'default',
    });

    for (const prompt of prompts) {
      const content = typeof prompt.content === 'string' ? prompt.content : '';
      if (!content.trim()) {
        throw new Error('Prompt content is required for evaluation');
      }

      const userPrompt = buildUserPrompt(prompt, locale);
      const { output, usage } = await runChatCompletionWithUsage({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        model,
      });

      const score = safeParseEvaluation(output);
      if (!score) {
        throw new Error('Failed to parse evaluation result');
      }

      const enrichedScore = enrichScore(score, usage, usage.model);

      const promptId = typeof prompt.id === 'string' ? prompt.id : null;
      if (promptId) {
        const { error } = await supabase
          .from('prompts')
          .update({ eval_score: enrichedScore })
          .eq('id', promptId)
          .eq('user_id', user.id);
        if (error) {
          throw new Error(error.message);
        }
      }

      results.push({
        prompt_id: promptId,
        score: enrichedScore,
        usage,
      });
    }

    console.info('eval_run:success', {
      userId: user.id,
      results: results.length,
    });

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('Eval run API error', error);
    const status = typeof error?.status === 'number' ? error.status : 500;
    return NextResponse.json(
      { error: error?.message || 'Failed to run evaluation' },
      { status }
    );
  }
}
