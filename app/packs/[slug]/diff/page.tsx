import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getDictionary, type Dictionary } from '../../../../lib/i18n';
import {
  diffPromptPacks,
  getPackVersion,
  getPromptPack,
  listPackVersions,
  type PromptPackDiffEntry,
  type PromptPackVersion,
} from '../../../../lib/promptPacks';

type PageProps = {
  params: { slug: string };
  searchParams: { from?: string; to?: string };
};

const CURRENT_VERSION = 'current';

function resolveTargetPack(slug: string, version: string | undefined, locale: 'en' | 'zh') {
  if (!version || version === CURRENT_VERSION) {
    const pack = getPromptPack(slug, locale);
    if (!pack) return null;
    return {
      version: CURRENT_VERSION,
      label: 'Current',
      createdAt: new Date().toISOString(),
      pack,
    } satisfies PromptPackVersion;
  }
  const historical = getPackVersion(slug, version);
  if (!historical) {
    return null;
  }
  return historical;
}

export default async function PackDiffPage({ params, searchParams }: PageProps) {
  const dict = await getDictionary();
  const slug = params.slug;
  const versions = listPackVersions(slug);

  if (versions.length === 0 && !getPromptPack(slug, dict.locale)) {
    notFound();
  }

  const fromVersion = searchParams.from ?? versions.at(-1)?.version ?? CURRENT_VERSION;
  const toVersion = searchParams.to ?? CURRENT_VERSION;

  const fromPack = resolveTargetPack(slug, fromVersion, dict.locale);
  const toPack = resolveTargetPack(slug, toVersion, dict.locale);

  if (!fromPack || !toPack) {
    notFound();
  }

  const diff = diffPromptPacks(fromPack.pack, toPack.pack);

  const versionOptions = [
    ...versions.map((version) => ({
      value: version.version,
      label: `${version.label}`,
    })),
  ];

  const toOptions = [{ value: CURRENT_VERSION, label: 'Current' }, ...versionOptions];

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="row" style={{ gap: 8, alignItems: 'center' }}>
        <Link href="/packs" className="btn-link">
          {dict.dashboard.title}
        </Link>
        <span className="muted">/</span>
        <Link href={`/packs/${slug}`} className="btn-link">
          {slug}
        </Link>
        <span className="muted">/</span>
        <span style={{ fontWeight: 600 }}>Diff</span>
      </div>

      <form className="card row" style={{ gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div className="col" style={{ gap: 4 }}>
          <label htmlFor="from-version">{dict.packs.packDiff.fromVersion}</label>
          <select id="from-version" name="from" className="select" defaultValue={fromVersion}>
            <option value={CURRENT_VERSION}>{dict.packs.packDiff.currentVersion}</option>
            {versionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="col" style={{ gap: 4 }}>
          <label htmlFor="to-version">{dict.packs.packDiff.toVersion}</label>
          <select id="to-version" name="to" className="select" defaultValue={toVersion}>
            {toOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn">
          {dict.packs.packDiff.compareButton}
        </button>
      </form>

      <div className="card col" style={{ gap: 12 }}>
        <h2 style={{ margin: 0 }}>{dict.packs.packDiff.summaryTitle}</h2>
        <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
          <SummaryPill label={dict.packs.packDiff.addedPrompts} value={diff.summary.totalAdded} color="#22c55e" />
          <SummaryPill label={dict.packs.packDiff.changedPrompts} value={diff.summary.totalChanged} color="#facc15" />
          <SummaryPill label={dict.packs.packDiff.removedPrompts} value={diff.summary.totalRemoved} color="#ef4444" />
        </div>
        {diff.summary.addedSections.length > 0 || diff.summary.removedSections.length > 0 ? (
          <div className="col" style={{ gap: 8 }}>
            {diff.summary.addedSections.length > 0 ? (
              <div>
                <strong>{dict.packs.packDiff.newSections}</strong>
                <ul style={{ margin: 0, paddingInlineStart: 18 }}>
                  {diff.summary.addedSections.map((heading) => (
                    <li key={heading}>{heading}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {diff.summary.removedSections.length > 0 ? (
              <div>
                <strong>{dict.packs.packDiff.removedSections}</strong>
                <ul style={{ margin: 0, paddingInlineStart: 18 }}>
                  {diff.summary.removedSections.map((heading) => (
                    <li key={heading}>{heading}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="card col" style={{ gap: 12 }}>
        <h2 style={{ margin: 0 }}>{dict.packs.packDiff.promptChangesTitle}</h2>
        {diff.entries.length === 0 ? (
          <span className="muted" style={{ fontSize: 13 }}>
            {dict.packs.packDiff.noDifferences}
          </span>
        ) : (
          <div className="col" style={{ gap: 12 }}>
            {diff.entries.map((entry) => (
              <PromptDiffRow key={entry.key} entry={entry} dict={dict} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      className="row"
      style={{
        gap: 8,
        alignItems: 'center',
        padding: '6px 12px',
        borderRadius: 8,
        border: `1px solid ${color}33`,
        background: `${color}1a`,
        color,
        fontWeight: 600,
      }}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function PromptDiffRow({ entry, dict }: { entry: PromptPackDiffEntry; dict: Dictionary }) {
  const borderColor =
    entry.status === 'added' ? '#22c55e' : entry.status === 'changed' ? '#facc15' : '#ef4444';
  const label = entry.status === 'added' ? dict.packs.packDiff.added : entry.status === 'changed' ? dict.packs.packDiff.changed : dict.packs.packDiff.removed;

  return (
    <div
      className="col"
      style={{
        gap: 8,
        border: `1px solid ${borderColor}66`,
        borderRadius: 10,
        padding: 12,
        background: '#0f172a',
      }}
    >
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div className="row" style={{ gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span
            style={{
              background: `${borderColor}1a`,
              color: borderColor,
              borderRadius: 999,
              padding: '2px 10px',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {label}
          </span>
          <span style={{ fontSize: 13, fontWeight: 600 }}>
            {entry.toPrompt?.useCase ?? entry.fromPrompt?.useCase ?? 'Untitled'}
          </span>
        </div>
        <span className="muted" style={{ fontSize: 12 }}>
          {entry.toSection ?? entry.fromSection}
        </span>
      </div>
      <div className="row" style={{ gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {entry.fromPrompt ? (
          <div className="col" style={{ flex: 1, minWidth: 280, gap: 4 }}>
            <strong style={{ fontSize: 12 }}>{dict.packs.packDiff.previous}</strong>
            <PromptBlock prompt={entry.fromPrompt.prompt} url={entry.fromPrompt.url} dict={dict} />
          </div>
        ) : null}
        {entry.toPrompt ? (
          <div className="col" style={{ flex: 1, minWidth: 280, gap: 4 }}>
            <strong style={{ fontSize: 12 }}>{dict.packs.packDiff.current}</strong>
            <PromptBlock prompt={entry.toPrompt.prompt} url={entry.toPrompt.url} dict={dict} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function PromptBlock({ prompt, url, dict }: { prompt: string; url?: string | null; dict: Dictionary }) {
  return (
    <div className="col" style={{ gap: 6 }}>
      <pre
        style={{
          margin: 0,
          whiteSpace: 'pre-wrap',
          background: '#111827',
          borderRadius: 8,
          padding: 12,
          fontSize: 12,
        }}
      >
        {prompt}
      </pre>
      {url ? (
        <Link href={url} className="btn-link" target="_blank">
          {dict.packs.packDiff.openExample}
        </Link>
      ) : null}
    </div>
  );
}
