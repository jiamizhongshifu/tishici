import Link from 'next/link';
import { createClient } from '../../lib/supabase/server';
import { redirect } from 'next/navigation';
import { deletePrompt } from '../actions';

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: categories } = await supabase.from('categories').select('id, name').order('name', { ascending: true });
  const { data: prompts } = await supabase
    .from('prompts')
    .select('id, title, content, category_id, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const catMap = new Map((categories || []).map((c) => [c.id, c.name]));

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h2>我的提示词</h2>
        <Link href="/prompts/new" className="btn">新建提示词</Link>
      </div>

      <div className="list">
        {(prompts || []).map((p) => (
          <div key={p.id} className="card col" style={{ gap: 8 }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0 }}>{p.title}</h3>
              <form action={deletePrompt}>
                <input type="hidden" name="id" value={p.id} />
                <button className="btn btn-danger" type="submit">删除</button>
              </form>
            </div>
            <div>
              <span className="tag">{p.category_id ? catMap.get(p.category_id) : '未分类'}</span>
            </div>
            <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }} className="muted">{p.content.slice(0, 280)}</pre>
          </div>
        ))}
        {(!prompts || prompts.length === 0) && (
          <div className="card">
            <p className="muted">还没有提示词，点击右上角新建。</p>
          </div>
        )}
      </div>
    </div>
  );
}

