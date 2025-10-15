import Link from 'next/link';
import { createClient } from '../lib/supabase/server';
import SignOutButton from './SignOutButton';

export default async function Header() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="container" style={{ paddingTop: 16, paddingBottom: 8 }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div className="row" style={{ gap: 12 }}>
          <Link href="/" style={{ fontWeight: 700 }}>Prompt Builder</Link>
          <span className="muted">MVP</span>
        </div>
        <div className="row" style={{ gap: 8 }}>
          {user ? (
            <>
              <Link href="/dashboard" className="btn" style={{ background: 'transparent', border: '1px solid #2a3142', color: 'var(--text)' }}>仪表盘</Link>
              <SignOutButton />
            </>
          ) : (
            <Link href="/" className="btn">登录</Link>
          )}
        </div>
      </div>
    </header>
  );
}

