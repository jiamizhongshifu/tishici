import { createClient } from '../../../lib/supabase/server';
import { redirect } from 'next/navigation';
import PromptForm from '../../../components/PromptForm';

export default async function NewPromptPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: categories } = await supabase.from('categories').select('id, name').order('name', { ascending: true });

  return (
    <div className="col" style={{ gap: 16 }}>
      <h2>新建提示词</h2>
      <PromptForm categories={categories || []} />
    </div>
  );
}

