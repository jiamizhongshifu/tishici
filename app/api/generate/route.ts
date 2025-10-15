import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      goal = '',
      audience = '',
      tone = 'neutral',
      language = 'zh',
      style = '',
      model = 'gpt-4o-mini',
    } = body || {};

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const system = `You are a helpful prompt engineer. Return JSON only with keys: title, content.`;
    const user = `请根据需求生成一条高质量提示词。输出 JSON：{"title": string, "content": string}。\n\n需求: ${goal}\n目标用户: ${audience}\n语气: ${tone}\n语言: ${language}\n风格/限制: ${style}\n\n要求:\n- 标题简短有力\n- 内容包含角色设定、目标、输入变量占位符、期望输出与格式约束\n- 用 ${language} 输出`;

    const resp = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.7,
    });

    const text = resp.choices?.[0]?.message?.content?.trim() || '';
    // Try parse JSON out of the model response
    let json: any = {};
    try {
      json = JSON.parse(text);
    } catch {
      // fallback: naive extraction between first and last braces
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start >= 0 && end >= start) {
        json = JSON.parse(text.slice(start, end + 1));
      } else {
        json = { title: 'AI 生成标题', content: text };
      }
    }

    return NextResponse.json({ title: json.title || '生成的提示', content: json.content || '' });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Generation failed' }, { status: 500 });
  }
}

