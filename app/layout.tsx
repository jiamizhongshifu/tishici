import './globals.css';
import type { Metadata } from 'next';
import Header from '../components/Header';
import ToastContainer from '../components/ToastContainer';
import { getDictionary } from '../lib/i18n';

export const metadata: Metadata = {
  title: 'Prompt Builder MVP',
  description: 'Generate and manage your prompts with Supabase + Next.js',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const dict = await getDictionary();
  return (
    <html lang={dict.locale}>
      <body>
        <Header />
        <main className="container">{children}</main>
        <ToastContainer fallbackMessage={dict.toast.default} />
      </body>
    </html>
  );
}
