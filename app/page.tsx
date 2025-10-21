import Link from 'next/link';
import AuthForm from '../components/AuthForm';
import CopyButton from '../components/CopyButton';
import DeletePromptButton from '../components/DeletePromptButton';
import OpenInChatGPTButton from '../components/OpenInChatGPTButton';
import PromptQuickAddForm from '../components/PromptQuickAddForm';
import { getPromptPacks } from '../lib/promptPacks';
import { createRSCClient } from '../lib/supabase/server';
import { getDictionary } from '../lib/i18n';

function formatPreview(content: string) {
  const text = content.trim().replace(/\s+/g, ' ');
  return text.length > 160 ? `${text.slice(0, 160)}…` : text;
}

export default async function HomePage() {
  const dict = await getDictionary();
  const promptPacks = getPromptPacks(dict.locale);
  const supabase = createRSCClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const packCountLabel = dict.home.packCount.replace('{count}', String(promptPacks.length));

  let categories: Array<{ id: string; name: string }> = [];
  let prompts: Array<{
    id: string;
    title: string;
    content: string;
    createdAt: string;
    categoryName: string | null;
  }> = [];

  if (user) {
    const { data: categoryRows } = await supabase
      .from('categories')
      .select('id, name')
      .order('name', { ascending: true });
    categories = categoryRows ?? [];

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
      .order('created_at', { ascending: false })
      .limit(5);

    prompts =
      promptRows?.map((row) => ({
        id: row.id as string,
        title: row.title as string,
        content: row.content as string,
        createdAt: row.created_at as string,
        categoryName: (row as any)?.categories?.name ?? null,
      })) ?? [];
  }

  const formatCategory = (name: string | null) =>
    name ? dict.promptForm.categoryLabels?.[name] ?? name : dict.promptForm.uncategorized;

  return (
    <div className="col" style={{ gap: 24 }}>
      <div className="col" style={{ gap: 6 }}>
        <h1>Prompt Builder</h1>
        <p className="muted">{dict.home.tagline}</p>
      </div>

      {!user ? (
        <div className="card col" style={{ gap: 16 }}>
          <h3 style={{ margin: 0 }}>{dict.home.loginCardTitle}</h3>
          <AuthForm dict={dict.auth} />
        </div>
      ) : (
        <div className="col" style={{ gap: 16 }}>
          <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
            <Link href="/prompts/new" className="btn">
              {dict.home.newPromptButton}
            </Link>
            <Link href="/dashboard" className="btn">
              {dict.home.dashboardButton}
            </Link>
          </div>
          <PromptQuickAddForm categories={categories} formDict={dict.promptForm} quickDict={dict.quickAdd} />
          <div className="col" style={{ gap: 12 }}>
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>{dict.home.recentTitle}</h3>
              <Link href="/dashboard" className="btn-link">
                {dict.home.viewAll}
              </Link>
            </div>
            {prompts.length === 0 ? (
              <p className="muted" style={{ margin: 0 }}>
                {dict.home.recentEmpty}
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
                        <span className="tag">{formatCategory(prompt.categoryName)}</span>
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
      )}

      <div className="card col" style={{ gap: 16 }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className="col" style={{ gap: 4 }}>
            <h3>{dict.home.packsTitle}</h3>
            <p className="muted">{dict.home.packsSubtitle}</p>
          </div>
          <span className="tag">{packCountLabel}</span>
        </div>
        <div className="grid grid-packs">
          {promptPacks.map((pack) => {
            const promptCount = pack.sections.reduce((sum, section) => sum + section.prompts.length, 0);
            const promptCountLabel = dict.packs.promptsTag.replace('{count}', String(promptCount));
            return (
              <div key={pack.slug} className="pack-card">
                {pack.coverUrl ? (
                  <div className="pack-cover" style={{ backgroundImage: `url(${pack.coverUrl})` }} aria-hidden="true" />
                ) : null}
                <div className="col" style={{ gap: 8 }}>
                  <h4 style={{ margin: 0 }}>{pack.title}</h4>
                  <p className="muted" style={{ fontSize: 14, lineHeight: 1.4 }}>{pack.summary}</p>
                </div>
                <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span className="tag">{promptCountLabel}</span>
                  <Link href={`/packs/${pack.slug}`} className="btn" style={{ padding: '6px 10px' }}>
                    {dict.home.viewButton}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
