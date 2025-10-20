import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createOpenAIClient, resolveModel, runChatCompletionWithUsage } from 'lib/openai';

const systemPrompt = {
  zh: '你是一名专业的 Prompt 工程师，只返回 JSON，包含 title 与 content 字段。',
  en: 'You are a helpful prompt engineer. Only return JSON with the keys: title and content.',
};

function buildUserPrompt(params: {
  goal: string;
  audience: string;
  tone: string;
  language: string;
  style: string;
}) {
  const { goal, audience, tone, language, style } = params;
  const isZh = language === 'zh';
  if (isZh) {
    return [
      '请根据以下信息生成一条高质量提示词，输出 JSON：{"title": string, "content": string}。',
      `需求：${goal || '（未提供）'}`,
      `目标用户：${audience || '（未提供）'}`,
      `语气：${tone}`,
      `输出语言：${language}`,
      `风格 / 限制：${style || '（未提供）'}`,
      '',
      '要求：',
      '- 标题简短有力；',
      '- 正文包含角色设定、任务目标、输入变量占位符、期望输出与格式要求；',
      `- 使用 ${language} 输出。`,
    ].join('\n');
  }

  return [
    'Generate a high-quality prompt based on the details below. Respond in JSON with keys {"title": string, "content": string}.',
    `Goal: ${goal || '(not provided)'}`,
    `Audience: ${audience || '(not provided)'}`,
    `Tone: ${tone}`,
    `Output language: ${language}`,
    `Style / constraints: ${style || '(not provided)'}`,
    '',
    'Guidelines:',
    '- Keep the title short and punchy.',
    '- The content should cover role framing, task objective, input placeholders, expected output, and formatting rules.',
    `- Write the prompt in ${language}.`,
  ].join('\n');
}

function fallbackContent(language: string) {
  return language === 'zh'
    ? { title: 'AI 生成标题', content: '请补充提示词内容。' }
    : { title: 'AI generated title', content: 'Please refine the generated prompt.' };
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing OPENAI_API_KEY' }, { status: 400 });
    }

    const body = await req.json();
    const {
      goal = '',
      audience = '',
      tone = 'neutral',
      language = 'zh',
      style = '',
      model,
    } = body || {};

    const locale = language === 'en' ? 'en' : 'zh';

    const client = createOpenAIClient();
    const resolvedModel = resolveModel(model);

    const { output } = await runChatCompletionWithUsage({
      client,
      model: resolvedModel,
      messages: [
        { role: 'system', content: systemPrompt[locale] },
        {
          role: 'user',
          content: buildUserPrompt({ goal, audience, tone, language, style }),
        },
      ],
      temperature: 0.7,
    });

    const text = output.trim();
    let json: any = {};
    try {
      json = JSON.parse(text);
    } catch {
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start >= 0 && end >= start) {
        json = JSON.parse(text.slice(start, end + 1));
      } else {
        json = fallbackContent(language);
        json.content = text || json.content;
      }
    }

    const fallback = fallbackContent(language);
    return NextResponse.json({
      title: typeof json.title === 'string' && json.title.trim() ? json.title : fallback.title,
      content: typeof json.content === 'string' && json.content.trim() ? json.content : fallback.content,
    });
  } catch (error) {
    console.error('Generate API error', error);
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        {
          error: error.message,
          type: error.type,
          code: error.code,
        },
        { status: error.status ?? 500 }
      );
    }
    const message = (error as Error)?.message || 'Generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
