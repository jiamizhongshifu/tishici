import Link from 'next/link';
import { createRSCClient } from '../lib/supabase/server';
import SignOutButton from './SignOutButton';
import LanguageToggle from './LanguageToggle';
import { getDictionary } from '../lib/i18n';

export default async function Header() {
  const dict = await getDictionary();
  const supabase = createRSCClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="container" style={{ paddingTop: 16, paddingBottom: 8 }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="row" style={{ gap: 12, alignItems: 'center' }}>
          <Link href="/" style={{ fontWeight: 700 }}>Prompt Builder</Link>
          <span className="muted">MVP</span>
        </div>
        <div className="row" style={{ gap: 12, alignItems: 'center' }}>
          <LanguageToggle
            locale={dict.locale}
            label={dict.header.languageToggle.label}
            zhLabel={dict.header.languageToggle.zh}
            enLabel={dict.header.languageToggle.en}
          />
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="btn"
                style={{ background: 'transparent', border: '1px solid #2a3142', color: 'var(--text)' }}
              >
                {dict.header.myPrompts}
              </Link>
              <SignOutButton label={dict.signOut.button} />
            </>
          ) : (
            <Link href="/" className="btn">{dict.header.login}</Link>
          )}
          <Link href="/packs/io" className="btn-link">
            Packs
          </Link>
        </div>
      </div>
    </header>
  );
}
