'use client';
import { useState } from 'react';
import { createClient } from '../lib/supabase/client';

export default function AuthForm() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signInWithEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const redirectTo = (process.env.NEXT_PUBLIC_SITE_URL || window.location.origin) + '/auth/callback';
      const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
      if (error) throw error;
      setSent(true);
    } catch (err: any) {
      setError(err?.message || '发送邮件失败');
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGithub() {
    const redirectTo = (process.env.NEXT_PUBLIC_SITE_URL || window.location.origin) + '/auth/callback';
    await supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo } });
  }

  if (sent) {
    return <p className="muted">验证邮件已发送至 {email}，请查收。</p>;
  }

  return (
    <form onSubmit={signInWithEmail} className="col" style={{ gap: 12 }}>
      <input
        className="input"
        type="email"
        placeholder="邮箱"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <div className="row" style={{ gap: 8 }}>
        <button type="submit" className="btn" disabled={loading}>{loading ? '发送中…' : '发送魔法链接'}</button>
        <button type="button" onClick={signInWithGithub} className="btn" style={{ background: '#0f172a', border: '1px solid #2a3142' }}>GitHub 登录</button>
      </div>
      {error ? <p className="muted" style={{ color: '#ef4444' }}>{error}</p> : null}
    </form>
  );
}

