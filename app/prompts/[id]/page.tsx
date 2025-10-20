import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import CopyButton from '../../../components/CopyButton';
import DeletePromptButton from '../../../components/DeletePromptButton';
import OpenInChatGPTButton from '../../../components/OpenInChatGPTButton';
import { createRSCClient } from '../../../lib/supabase/server';
import { getDictionary } from '../../../lib/i18n';

type PageProps = {
  params: { id: string };
};

export default async function PromptDetailPage({ params }: PageProps) {
  const dict = await getDictionary();
  const supabase = createRSCClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: prompt, error } = await supabase
    .from('prompts')
    .select(
      `
        id,
        user_id,
        title,
        content,
        category_id,
        created_at,
        categories:category_id (name)
      `
    )
    .eq('id', params.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!prompt || prompt.user_id !== user.id) {
    notFound();
  }

  const rawCategory = (prompt as any)?.categories?.name as string | null;
  const categoryName = rawCategory
    ? dict.promptForm.categoryLabels?.[rawCategory] ?? rawCategory
    : dict.promptForm.uncategorized;

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="row" style={{ gap: 12, alignItems: 'center' }}>
          <Link href="/dashboard" className="btn-link">
            {dict.dashboard.title}
          </Link>
          <span className="muted">/</span>
          <Link href={`/prompts/${prompt.id}`} className="prompt-title-link">
            <h1 className="prompt-title" style={{ fontSize: 20 }}>{prompt.title}</h1>
          </Link>
        </div>
        <div className="row" style={{ gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <CopyButton
            text={prompt.content}
            label={dict.copy.copy}
            copiedLabel={dict.copy.copied}
            toastMessage={dict.copy.toast}
          />
          <OpenInChatGPTButton prompt={prompt.content} label={dict.packs.openChatGPT} />
          <Link href={`/prompts/${prompt.id}/edit`} className="btn-link">
            {dict.promptActions.edit}
          </Link>
          <DeletePromptButton
            id={prompt.id}
            confirmMessage={dict.deletePrompt.confirm}
            deleteLabel={dict.deletePrompt.delete}
            deletingLabel={dict.deletePrompt.deleting}
            errorLabel={dict.deletePrompt.error}
          />
        </div>
      </div>

      <div className="card col" style={{ gap: 12 }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="prompt-title" style={{ fontSize: 20 }}>{prompt.title}</h2>
          <span className="tag">{categoryName}</span>
        </div>
        <span className="muted" style={{ fontSize: 12 }}>
          {new Date(prompt.created_at as string).toLocaleString()}
        </span>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{prompt.content}</pre>
      </div>
    </div>
  );
}
