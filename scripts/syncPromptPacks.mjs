import { writeFile } from 'node:fs/promises';

const TAG_URL = 'https://academy.openai.com/public/clubs/work-users-ynjqu/tags/prompt-packs-6849a0f98c613939acef841c';
const RESOURCE_BASE = 'https://academy.openai.com/public/clubs/work-users-ynjqu/resources';

/**
 * @param {string} url
 */
async function fetchNextData(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'prompt-mvp-sync/1.0',
      Accept: 'text/html,application/xhtml+xml,application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }

  const html = await res.text();
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">(?<json>[\s\S]*?)<\/script>/);
  if (!match?.groups?.json) {
    throw new Error(`__NEXT_DATA__ not found for ${url}`);
  }
  return JSON.parse(match.groups.json);
}

/**
 * @param {any} node
 * @returns {string}
 */
function flattenText(node) {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map((child) => flattenText(child)).join('');
  return (node.text ?? '') + flattenText(node.children);
}

/**
 * @param {any} node
 * @returns {string | undefined}
 */
function findFirstUrl(node) {
  if (!node) return undefined;
  if (Array.isArray(node)) {
    for (const child of node) {
      const url = findFirstUrl(child);
      if (url) return url;
    }
    return undefined;
  }
  if (typeof node === 'string') return undefined;
  if (node.url) return node.url;
  return findFirstUrl(node.children);
}

/**
 * @template T
 * @param {T | T[] | undefined} value
 * @returns {T[]}
 */
function toArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

/**
 * @param {any[]} content
 */
function parseSections(content) {
  /** @type {{ heading: string; description?: string; prompts: { useCase: string; prompt: string; url?: string; }[]; } | null} */
  let current = null;
  /** @type {typeof current[]} */
  const sections = [];

  const ensureSection = (heading = 'General prompts') => {
    if (!current) {
      current = { heading, prompts: [] };
      sections.push(current);
    }
  };

  for (const block of content) {
    const type = block?.type;
    if (type === 'h2' || type === 'h3') {
      const heading = flattenText(block.children).trim();
      current = { heading, prompts: [] };
      sections.push(current);
      continue;
    }

    if (type === 'p') {
      const text = flattenText(block.children).trim();
      if (!text) continue;
      ensureSection();
      current.description = current.description ? `${current.description}\n\n${text}` : text;
      continue;
    }

    if (type === 'table') {
      ensureSection();
      const rows = toArray(block.children).filter((row) => row && typeof row === 'object' && row.type === 'tr');
      for (const row of rows) {
        const cells = toArray(row.children).filter(
          (cell) => cell && typeof cell === 'object' && (cell.type === 'td' || cell.type === 'th')
        );
        if (!cells.length) continue;

        const cellTexts = cells.map((cell) => flattenText(cell.children).trim());

        if (cellTexts[0]?.match(/use\s*case/i)) {
          continue; // header row
        }

        const useCase = cellTexts[0] ?? '';
        const prompt = cellTexts[1] ?? '';
        const url = findFirstUrl(cells[2] ?? cells[1]);

        if (!useCase && !prompt) continue;

        current.prompts.push({ useCase, prompt, url });
      }
    }
  }

  return sections.filter((section) => section.prompts.length);
}

async function main() {
  const tagData = await fetchNextData(TAG_URL);
  const list = tagData?.props?.pageProps?.data?.contents;
  if (!list) throw new Error('Unexpected tag data shape');

  const records = [list.firstContent, ...(list.records ?? [])].filter(Boolean);

  /** @type {Array<{ title: string; slug: string; summary: string; coverUrl: string; sections: ReturnType<typeof parseSections>; }>} */
  const packs = [];

  for (const record of records) {
    const slug = record.slug;
    const title = record.title;
    const summary = record.summary ?? '';
    const coverUrl = record.coverUrl ?? '';

    const detailData = await fetchNextData(`${RESOURCE_BASE}/${slug}`);
    const resource = detailData?.props?.pageProps?.resource;
    if (!resource) {
      console.warn(`Skipping ${slug}, missing resource data`);
      continue;
    }

    let content = [];
    try {
      content = JSON.parse(resource.content ?? '[]');
    } catch (error) {
      console.warn(`Failed to parse content for ${slug}`);
    }

    const sections = parseSections(content);

    packs.push({
      title,
      slug,
      summary,
      coverUrl,
      sections,
    });
  }

  await writeFile('data/promptPacks.json', JSON.stringify(packs, null, 2), 'utf8');
  console.log(`Saved ${packs.length} prompt packs to data/promptPacks.json`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
