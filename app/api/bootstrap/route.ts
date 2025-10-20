import { NextResponse } from 'next/server';

import { runChatCompletionWithUsage, persistOpenAIUsage } from '../../../lib/openai';
import { createActionClient } from '../../../lib/supabase/server';

type RequestPayload = {
  goal?: unknown;
  domain?: unknown;
  audience?: unknown;
  constraints?: unknown;
  locale?: unknown;
  model?: unknown;
};

type BootstrapResult = {
  title: string;
  content: string;
  suggestedCategory: string | null;
};

const SYSTEM_PROMPT_EN = `You are a prompt engineering expert. Generate a well-structured, production-ready prompt template based on the user's requirements. The output must include:

1. Clear role definition - specify who the AI should act as
2. Explicit task description - what needs to be accomplished
3. Execution constraints and guardrails - rules, limitations, safety considerations
4. Output format specification - structure of the expected response
5. Example input/output (if applicable) - demonstrate the expected behavior

The prompt should follow best practices:
- Use clear, unambiguous language
- Include specific success criteria
- Add relevant context variables as placeholders like {{variable_name}}
- Specify tone, style, and quality expectations
- Include safety guardrails where appropriate

Return JSON with the following structure:
{
  "title": "string (concise prompt title, 5-10 words)",
  "content": "string (the complete, production-ready prompt text)",
  "suggestedCategory": "string or null (suggested category name)"
}`;

const SYSTEM_PROMPT_ZH = `你是提示词工程专家。根据用户需求，生成结构完整、可直接使用的提示词模板。输出必须包含：

1. 明确的角色定义 - 说明 AI 应扮演的身份
2. 明确的任务描述 - 需要完成什么
3. 执行约束与规则 - 限制条件、安全考虑
4. 输出格式规范 - 期望响应的结构
5. 示例输入/输出（如适用）- 展示预期行为

提示词应遵循最佳实践：
- 使用清晰、明确的语言
- 包含具体的成功标准
- 用 {{变量名}} 格式添加相关上下文变量
- 指定语气、风格和质量期望
- 在适当位置添加安全规则

以 JSON 格式返回：
{
  "title": "string (简洁的提示词标题，5-10个字)",
  "content": "string (完整的、可直接使用的提示词文本)",
  "suggestedCategory": "string 或 null (建议的分类名称)"
}`;

function buildUserPrompt(params: {
  goal: string;
  domain: string;
  audience: string;
  constraints: string;
  locale: string;
}) {
  const { goal, domain, audience, constraints, locale } = params;

  if (locale === 'zh') {
    return [
      '请根据以下需求生成一个高质量的提示词模板：',
      '',
      `目标：${goal}`,
      domain ? `领域：${domain}` : null,
      audience ? `受众：${audience}` : null,
      constraints ? `约束条件：${constraints}` : null,
      '',
      '请确保生成的提示词：',
      '- 包含清晰的角色设定',
      '- 任务描述明确且可执行',
      '- 包含必要的约束和安全提示',
      '- 指定输出格式',
      '- 适当位置使用 {{变量名}} 作为占位符',
    ]
      .filter(Boolean)
      .join('\n');
  }

  return [
    'Generate a high-quality prompt template based on the following requirements:',
    '',
    `Goal: ${goal}`,
    domain ? `Domain: ${domain}` : null,
    audience ? `Audience: ${audience}` : null,
    constraints ? `Constraints: ${constraints}` : null,
    '',
    'Ensure the generated prompt:',
    '- Includes a clear role definition',
    '- Has an explicit and actionable task description',
    '- Contains necessary constraints and safety reminders',
    '- Specifies the output format',
    '- Uses {{variable_name}} placeholders where appropriate',
  ]
    .filter(Boolean)
    .join('\n');
}

function safeJsonParse(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    // Try to extract JSON from code blocks
    const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch {
        return null;
      }
    }
    // Try to find JSON object in text
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

function parseBootstrapResult(raw: unknown): BootstrapResult | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const data = raw as Record<string, unknown>;

  const title = typeof data.title === 'string' ? data.title.trim() : null;
  const content = typeof data.content === 'string' ? data.content.trim() : null;
  const suggestedCategory =
    typeof data.suggestedCategory === 'string' && data.suggestedCategory.trim().length > 0
      ? data.suggestedCategory.trim()
      : null;

  if (!title || !content) {
    return null;
  }

  return {
    title,
    content,
    suggestedCategory,
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
    const goal = typeof body.goal === 'string' ? body.goal.trim() : '';
    if (!goal) {
      return NextResponse.json({ error: 'Goal is required' }, { status: 400 });
    }

    const domain = typeof body.domain === 'string' ? body.domain.trim() : '';
    const audience = typeof body.audience === 'string' ? body.audience.trim() : '';
    const constraints = typeof body.constraints === 'string' ? body.constraints.trim() : '';
    const locale = body.locale === 'zh' ? 'zh' : 'en';
    const model = typeof body.model === 'string' ? body.model : undefined;

    const systemPrompt = locale === 'zh' ? SYSTEM_PROMPT_ZH : SYSTEM_PROMPT_EN;
    const userPrompt = buildUserPrompt({ goal, domain, audience, constraints, locale });

    console.info('bootstrap:requested', {
      userId: user.id,
      locale,
      goalLength: goal.length,
    });

    const { output, usage } = await runChatCompletionWithUsage({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model,
      onUsage: async (usageData) => {
        await persistOpenAIUsage(supabase, usageData, {
          userId: user.id,
          taskId: 'bootstrap',
          meta: {
            goal_length: goal.length,
            locale,
          },
        });
      },
    });

    const parsed = safeJsonParse(output);
    const result = parseBootstrapResult(parsed);

    if (!result) {
      return NextResponse.json(
        {
          error: 'Failed to parse bootstrap result',
          raw: output,
        },
        { status: 502 }
      );
    }

    console.info('bootstrap:success', {
      userId: user.id,
      titleLength: result.title.length,
      contentLength: result.content.length,
      usage,
    });

    return NextResponse.json({
      title: result.title,
      content: result.content,
      suggestedCategory: result.suggestedCategory,
      usage,
    });
  } catch (error: any) {
    console.error('Bootstrap API error', error);
    const status = typeof error?.status === 'number' ? error.status : 500;
    return NextResponse.json(
      { error: error?.message || 'Failed to generate prompt template' },
      { status }
    );
  }
}



