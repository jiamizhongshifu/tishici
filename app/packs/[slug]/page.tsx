import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPromptPack, getPromptPacks } from '../../../lib/promptPacks';
import CopyButton from '../../../components/CopyButton';
import { getDictionary } from '../../../lib/i18n';
import { importPackPrompt } from '../../actions';

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  // 使用英文版本生成静态路径(slug 是语言无关的)
  const promptPacks = getPromptPacks('en');
  return promptPacks.map((pack) => ({ slug: pack.slug }));
}

export default async function PromptPackPage({ params }: Props) {
  const dict = await getDictionary();
  const pack = getPromptPack(params.slug, dict.locale);
  if (!pack) {
    notFound();
  }

  return (
    <div className="col" style={{ gap: 24 }}>
      <Link href="/" className="btn-link" style={{ width: 'fit-content' }}>
        {dict.packs.backHome}
      </Link>
      <div className="col" style={{ gap: 12 }}>
        <h1 style={{ marginBottom: 0 }}>{pack.title}</h1>
        <p className="muted" style={{ maxWidth: 720 }}>{pack.summary}</p>
      </div>

      {dict.packs.tips?.length ? (
        <div className="card col" style={{ gap: 8, padding: 16 }}>
          <h3 style={{ margin: 0 }}>{dict.packs.tipsTitle}</h3>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.6 }}>
            {dict.packs.tips.map((tip, index) => (
              <li key={`tip-${index}`} className="muted">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {pack.sections.map((section) => (
        <section key={section.heading} className="col" style={{ gap: 16 }}>
          <div className="col" style={{ gap: 6 }}>
            <h2 style={{ marginBottom: 0 }}>{section.heading}</h2>
            {section.description ? (
              <p className="muted" style={{ maxWidth: 720 }}>{section.description}</p>
            ) : null}
          </div>
          <div className="col" style={{ gap: 12 }}>
            {section.prompts.map((prompt) => (
              <div key={`${prompt.useCase}-${prompt.prompt.slice(0, 40)}`} className="prompt-card">
                <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div className="col" style={{ gap: 4 }}>
                    <h4 style={{ margin: 0 }}>{prompt.useCase}</h4>
                  </div>
                  <div className="row" style={{ gap: 8 }}>
                    <form action={importPackPrompt} style={{ display: 'inline-flex' }}>
                      <input type="hidden" name="title" value={`${pack.title} · ${prompt.useCase}`} />
                      <input type="hidden" name="content" value={prompt.prompt} />
                      <input type="hidden" name="pack_title" value={pack.title} />
                      <input type="hidden" name="pack_slug" value={pack.slug} />
                      <input type="hidden" name="redirectTo" value="/" />
                      <button type="submit" className="btn">
                        {dict.packs.importButton}
                      </button>
                    </form>
                    {prompt.url ? (
                      <a className="btn-link" href={prompt.url} target="_blank" rel="noopener noreferrer">
                        {dict.packs.openChatGPT}
                      </a>
                    ) : null}
                    <CopyButton
                      text={prompt.prompt}
                      label={dict.copy.copy}
                      copiedLabel={dict.copy.copied}
                      toastMessage={dict.copy.toast}
                    />
                  </div>
                </div>
                <pre className="prompt-text">{prompt.prompt}</pre>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
