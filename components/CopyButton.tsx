'use client';

import { useState } from 'react';

type Props = {
  text: string;
  label: string;
  copiedLabel: string;
  toastMessage: string;
};

export default function CopyButton({ text, label, copiedLabel, toastMessage }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      window.dispatchEvent(new CustomEvent('prompt-toast', { detail: toastMessage }));
    } catch (error) {
      console.error('Copy failed', error);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="btn"
      style={{ background: 'transparent', border: '1px solid #2a3142', color: 'var(--text)' }}
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
