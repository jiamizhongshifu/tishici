import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createActionClient } from '../../../lib/supabase/server';
import { getDictionary } from '../../../lib/i18n';
import PackIO from '../../../components/PackIO';

export default async function PackIOPage() {
  const supabase = createActionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const dict = await getDictionary();

  const { data: prompts } = await supabase
    .from('prompts')
    .select('id, title, content')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100);

  const packIODict = dict.packs.packIO;

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="row" style={{ gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <Link href="/dashboard" className="btn-link">
          {dict.home.dashboardButton}
        </Link>
        <span className="muted">/</span>
        <span style={{ fontWeight: 600 }}>{packIODict.title}</span>
      </div>

      <PackIO dict={packIODict} userPrompts={prompts ?? []} />
    </div>
  );
}
