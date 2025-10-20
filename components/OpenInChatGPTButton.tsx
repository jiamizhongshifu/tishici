'use client';

type Props = {
  prompt: string;
  label: string;
};

export default function OpenInChatGPTButton({ prompt, label }: Props) {
  const href = `https://chatgpt.com/?prompt=${encodeURIComponent(prompt)}`;
  return (
    <a
      className="btn-link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ whiteSpace: 'nowrap' }}
    >
      {label}
    </a>
  );
}
