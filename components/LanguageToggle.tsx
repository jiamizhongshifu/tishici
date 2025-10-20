'use client';

import { useState } from 'react';
import type { Locale } from '../lib/i18n';

type Props = {
  locale: Locale;
  label: string;
  zhLabel: string;
  enLabel: string;
};

export default function LanguageToggle({ locale, label, zhLabel, enLabel }: Props) {
  const [loading, setLoading] = useState(false);

  async function switchTo(lang: Locale) {
    if (loading || lang === locale) return;
    try {
      setLoading(true);
      await fetch('/api/language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang }),
      });
      window.location.reload();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="row" style={{ gap: 6, alignItems: 'center' }}>
      <span className="muted" style={{ fontSize: 12 }}>{label}</span>
      <div className="row" style={{ gap: 4 }}>
        <button
          type="button"
          onClick={() => switchTo('zh')}
          className="btn-link"
          style={{
            padding: '4px 8px',
            opacity: locale === 'zh' ? 1 : 0.6,
            pointerEvents: loading ? 'none' : 'auto',
          }}
        >
          {zhLabel}
        </button>
        <span className="muted" style={{ fontSize: 12 }}>/</span>
        <button
          type="button"
          onClick={() => switchTo('en')}
          className="btn-link"
          style={{
            padding: '4px 8px',
            opacity: locale === 'en' ? 1 : 0.6,
            pointerEvents: loading ? 'none' : 'auto',
          }}
        >
          {enLabel}
        </button>
      </div>
    </div>
  );
}
