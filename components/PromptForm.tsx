'use client';
import { useState } from 'react';
import { createPrompt } from '../app/actions';

type Category = { id: string; name: string };

export default function PromptForm({ categories }: { categories: Category[] }) {
  const [goal, setGoal] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('neutral');
  const [language, setLanguage] = useState('zh');
  const [style, setStyle] = useState('');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, audience, tone, language, style }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || '生成失败');
      setTitle(json.title || '');
      setContent(json.content || '');
    } catch (e: any) {
      setError(e?.message || '生成失败');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="card col" style={{ gap: 12 }}>
        <h3>生成提示草稿</h3>
        <div className="col">
          <label>你的目标</label>
          <textarea className="textarea" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="例如：为 B2B SaaS 产品撰写冷邮件脚本" />
        </div>
        <div className="row" style={{ gap: 12 }}>
          <div className="col" style={{ flex: 1 }}>
            <label>目标用户</label>
            <input className="input" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="例如：采购经理 / 初级开发者" />
          </div>
          <div className="col" style={{ width: 180 }}>
            <label>语气</label>
            <select className="select" value={tone} onChange={(e) => setTone(e.target.value)}>
              <option value="neutral">中性</option>
              <option value="friendly">友好</option>
              <option value="professional">专业</option>
              <option value="concise">简洁</option>
            </select>
          </div>
          <div className="col" style={{ width: 180 }}>
            <label>语言</label>
            <select className="select" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="zh">中文</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </select>
          </div>
        </div>
        <div className="col">
          <label>风格/限制（可选）</label>
          <input className="input" value={style} onChange={(e) => setStyle(e.target.value)} placeholder="例如：输出 JSON，包含字段 A/B/C；长度 < 200 字" />
        </div>
        <div className="row">
          <button type="button" className="btn" onClick={generate} disabled={loading}>{loading ? '生成中…' : '生成草稿'}</button>
          {error ? <span className="muted" style={{ color: '#ef4444' }}>{error}</span> : null}
        </div>
      </div>

      <form action={createPrompt} className="card col" style={{ gap: 12 }}>
        <h3>编辑并保存</h3>
        <div className="col">
          <label>标题</label>
          <input className="input" name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="为你的提示词命名" required />
        </div>
        <div className="col">
          <label>内容</label>
          <textarea className="textarea" name="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="提示词正文" required />
        </div>
        <div className="col" style={{ maxWidth: 320 }}>
          <label>分类</label>
          <select className="select" name="category_id" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">未分类</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <button type="submit" className="btn">保存</button>
        </div>
      </form>
    </div>
  );
}

