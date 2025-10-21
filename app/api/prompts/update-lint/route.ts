import { NextRequest, NextResponse } from 'next/server';
import { createActionClient } from '../../../../lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const supabase = createActionClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { promptId, lintIssues, summary, generatedAt, configVersion } = body;

    if (!promptId) {
      return NextResponse.json({ error: 'Missing promptId' }, { status: 400 });
    }

    // 构建 lint_issues 快照
    const lintSnapshot = {
      issues: lintIssues || [],
      summary: summary || {},
      generated_at: generatedAt || new Date().toISOString(),
      config_version: configVersion || '1.0',
    };

    // 更新数据库
    const { error } = await supabase
      .from('prompts')
      .update({ lint_issues: lintSnapshot })
      .eq('id', promptId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Update lint error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 重新验证详情页缓存
    revalidatePath(`/prompts/${promptId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update lint route error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
