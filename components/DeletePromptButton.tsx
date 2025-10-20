'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  id: string;
  confirmMessage: string;
  deleteLabel: string;
  deletingLabel: string;
  errorLabel: string;
};

export default function DeletePromptButton({
  id,
  confirmMessage,
  deleteLabel,
  deletingLabel,
  errorLabel,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (loading) return;
    const ok = window.confirm(confirmMessage);
    if (!ok) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/prompts/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || errorLabel);
      }
      router.refresh();
    } catch (err: any) {
      console.error('Delete failed', err);
      setError(err?.message || errorLabel);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="col" style={{ alignItems: 'flex-end' }}>
      <button
        type="button"
        onClick={handleDelete}
        className="btn btn-danger"
        disabled={loading}
      >
        {loading ? deletingLabel : deleteLabel}
      </button>
      {error ? <span className="muted" style={{ color: '#ef4444', fontSize: 12 }}>{error}</span> : null}
    </div>
  );
}
