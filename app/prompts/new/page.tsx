import Link from 'next/link';
import { createRSCClient } from '../../../lib/supabase/server';
import { redirect } from 'next/navigation';
import PromptForm from '../../../components/PromptForm';
import { getDictionary } from '../../../lib/i18n';

export default async function NewPromptPage() {
  const dict = await getDictionary();
  const supabase = createRSCClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: categories } = await supabase.from('categories').select('id, name').order('name', { ascending: true });

  return (
    <div className="col" style={{ gap: 16 }}>
      <Link href="/" className="btn-link" style={{ width: 'fit-content' }}>
        {dict.newPrompt.backHome}
      </Link>
      <h2>{dict.newPrompt.title}</h2>
      <PromptForm categories={categories || []} dict={dict.promptForm} locale={dict.locale} redirectTo="/" />
    </div>
  );
}
