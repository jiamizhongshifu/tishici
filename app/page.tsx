import { createClient } from '../lib/supabase/server';
import Link from 'next/link';
import AuthForm from '../components/AuthForm';

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="col" style={{ gap: 24 }}>
      <div className="col" style={{ gap: 6 }}>
        <h1>Prompt Builder</h1>
        <p className="muted">生成并管理你的提示词（MVP）</p>
      </div>

      {!user ? (
        <div className="card">
          <h3>登录</h3>
          <AuthForm />
        </div>
      ) : (
        <div className="card">
          <p>你已登录，前往 <Link href="/dashboard">仪表盘</Link></p>
        </div>
      )}

      <div className="card">
        <h3>功能概览</h3>
        <ul>
          <li>邮箱魔法链接登录</li>
          <li>生成提示词草稿（OpenAI）并编辑保存</li>
          <li>按分类管理与筛选</li>
        </ul>
      </div>
    </div>
  );
}

