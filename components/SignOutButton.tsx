'use client';
import { createClient } from '../lib/supabase/client';

export default function SignOutButton() {
  const supabase = createClient();
  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }
  return (
    <button onClick={signOut} className="btn" style={{ background: 'transparent', border: '1px solid #2a3142', color: 'var(--text)' }}>
      退出登录
    </button>
  );
}

