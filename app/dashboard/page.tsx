import Link from 'next/link';
import { redirect } from 'next/navigation';
import CopyButton from '../../components/CopyButton';
import DeletePromptButton from '../../components/DeletePromptButton';
import OpenInChatGPTButton from '../../components/OpenInChatGPTButton';
import PromptQuickAddForm from '../../components/PromptQuickAddForm';
import { createRSCClient } from '../../lib/supabase/server';
import { getDictionary } from '../../lib/i18n';

function formatPreview(content: string) {
  const text = content.trim().replace(/\s+/g, ' ');
  return text.length > 220 ? `${text.slice(0, 220)}…` : text;
}

export default async function DashboardPage() {
  const dict = await getDictionary();
  const supabase = createRSCClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: categoryRows } = await supabase
    .from('categories')
    .select('id, name')
    .order('name', { ascending: true });

  const { data: promptRows } = await supabase
    .from('prompts')
    .select(
      `
        id,
        title,
        content,
        created_at,
        categories:category_id (name)
      `
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const prompts = (promptRows ?? []).map((row) => ({
    id: row.id as string,
    title: row.title as string,
    content: row.content as string,
    createdAt: row.created_at as string,
    categoryName: (row as any)?.categories?.name ?? null,
  }));

  const formatCategory = (name: string | null) =>
    name ? dict.promptForm.categoryLabels?.[name] ?? name : dict.promptForm.uncategorized;

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>{dict.dashboard.title}</h2>
        <div className="row" style={{ gap: 8 }}>
          <Link href="/prompts/new" className="btn">
            {dict.dashboard.newButton}
          </Link>
        </div>
      </div>

      <PromptQuickAddForm
        categories={categoryRows ?? []}
        formDict={dict.promptForm}
        quickDict={dict.quickAdd}
      />

      <div className="col" style={{ gap: 12 }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>{dict.dashboard.listHeading}</h3>
          <Link href="/packs/io" className="btn-link">
            {dict.packs.packIO.title}
          </Link>
        </div>
        {prompts.length === 0 ? (
          <p className="muted" style={{ margin: 0 }}>
            {dict.dashboard.emptyState}
          </p>
        ) : (
          <div className="col" style={{ gap: 12 }}>
            {prompts.map((prompt) => (
              <div key={prompt.id} className="card col" style={{ gap: 8 }}>
                <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="col" style={{ gap: 4 }}>
                    <Link href={`/prompts/${prompt.id}`} className="prompt-title-link">
                      <h3 className="prompt-title">{prompt.title}</h3>
                    </Link>
                    <span className="muted" style={{ fontSize: 12 }}>
                      {new Date(prompt.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="row" style={{ gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span className="tag">
                      {formatCategory(prompt.categoryName)}
                    </span>
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
                <p className="muted" style={{ margin: 0 }}>{formatPreview(prompt.content)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
