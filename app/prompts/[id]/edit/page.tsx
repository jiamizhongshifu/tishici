import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import PromptForm from '../../../../components/PromptForm';
import { createRSCClient } from '../../../../lib/supabase/server';
import { getDictionary } from '../../../../lib/i18n';
import { updatePrompt } from '../../../actions';
import { lintPrompt } from '../../../../lib/linter';

type PageProps = {
  params: { id: string };
};

export default async function EditPromptPage({ params }: PageProps) {
  const dict = await getDictionary();
  const supabase = createRSCClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const promptId = params.id;

  const { data: prompt, error } = await supabase
    .from('prompts')
    .select('id, user_id, title, content, category_id, lint_issues')
    .eq('id', promptId)
    .maybeSingle();

  if (error) throw error;
  if (!prompt || prompt.user_id !== user.id) {
    notFound();
  }

  const { data: categories } = await supabase.from('categories').select('id, name').order('name', { ascending: true });

  const lintSeed = lintPrompt(prompt.content ?? '');
  const initialLintIssues = Array.isArray((prompt as any)?.lint_issues)
    ? ((prompt as any).lint_issues as any[])
    : lintSeed.issues;

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="row" style={{ gap: 12, alignItems: 'center' }}>
        <Link href={`/prompts/${promptId}`} className="btn-link">
          {dict.editPrompt.back}
        </Link>
        <span className="muted">/</span>
        <span className="muted">{dict.editPrompt.title}</span>
      </div>
      <h2 style={{ margin: 0 }}>{dict.editPrompt.title}</h2>
      <PromptForm
        categories={categories ?? []}
        dict={dict.promptForm}
        locale={dict.locale}
        redirectTo={`/prompts/${promptId}`}
        initial={{
          id: prompt.id,
          title: prompt.title,
          content: prompt.content,
          categoryId: prompt.category_id ?? '',
          lintIssues: initialLintIssues,
          lintStats: lintSeed.stats,
        }}
        submitAction={updatePrompt}
      />
    </div>
  );
}
