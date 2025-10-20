'use client';

import { useEffect, useState } from 'react';

type ToastEvent = CustomEvent<string>;

type Props = {
  fallbackMessage: string;
};

export default function ToastContainer({ fallbackMessage }: Props) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    function handle(event: Event) {
      const detail = (event as ToastEvent).detail || fallbackMessage;
      setMessage(detail);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setMessage(null), 2000);
    }

    window.addEventListener('prompt-toast', handle);
    return () => {
      window.removeEventListener('prompt-toast', handle);
      if (timer) clearTimeout(timer);
    };
  }, [fallbackMessage]);

  if (!message) return null;

  return (
    <div className="toast-container">
      <div className="toast-message">{message}</div>
    </div>
  );
}
