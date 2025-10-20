import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SUPPORTED = new Set(['zh', 'en']);

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const lang = typeof body?.lang === 'string' ? body.lang : null;
    if (!lang || !SUPPORTED.has(lang)) {
      return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });
    }
    const cookieStore = cookies();
    cookieStore.set({
      name: 'lang',
      value: lang,
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      path: '/',
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update language' }, { status: 500 });
  }
}
