import promptPacksData from '../data/promptPacks.json';

export type PromptRow = {
  useCase: string;
  prompt: string;
  url?: string | null;
};

export type PromptSection = {
  heading: string;
  description?: string;
  prompts: PromptRow[];
};

export type PromptPack = {
  title: string;
  slug: string;
  summary: string;
  coverUrl?: string;
  sections: PromptSection[];
};

const basePacks = promptPacksData as PromptPack[];

const extraPacks: PromptPack[] = [
  {
    title: 'DanKoe Amplifier',
    slug: 'dankoe-amplifier',
    summary:
      'A five-step operator system popularized by Dan Koe. Validate an idea, mine raw context, assemble structure, remix drafts, and publish with clarity.',
    coverUrl: 'https://images.unsplash.com/photo-1529336953121-4974dbffd7d0?auto=format&fit=crop&w=1200&q=80',
    sections: [
      {
        heading: 'Idea Test',
        description: 'Pressure-test the core problem, audience, and irresistible angle before investing energy.',
        prompts: [
          {
            useCase: 'Stress test a new product idea',
            prompt: `You are a pragmatic growth strategist. Pressure-test the idea below.

Idea: [describe the product or service]
Audience: [ideal customer]

Deliver:
1. Problem clarity — rewrite the audience's burning pain in one sentence.
2. Value hook — propose three punchy promise statements (≤ 12 words each).
3. Market skepticism — list five objections an experienced buyer would raise.
4. Evidence checklist — suggest proof / assets needed to answer each objection.

Return the output as a table with columns: Section, Insight.`,
            url: 'https://chatgpt.com/?prompt=You%20are%20a%20pragmatic%20growth%20strategist.%20Pressure-test%20the%20idea%20below.%5Cn%5CnIdea%3A%20%5Bdescribe%20the%20product%20or%20service%5D%5CnAudience%3A%20%5Bideal%20customer%5D%5Cn%5CnDeliver%3A%5Cn1.%20Problem%20clarity%20%E2%80%94%20rewrite%20the%20audience%27s%20burning%20pain%20in%20one%20sentence.%5Cn2.%20Value%20hook%20%E2%80%94%20propose%20three%20punchy%20promise%20statements%20(%E2%89%A4%2012%20words%20each).%5Cn3.%20Market%20skepticism%20%E2%80%94%20list%20five%20objections%20an%20experienced%20buyer%20would%20raise.%5Cn4.%20Evidence%20checklist%20%E2%80%94%20suggest%20proof%20/%20assets%20needed%20to%20answer%20each%20objection.%5Cn%5CnReturn%20the%20output%20as%20a%20table%20with%20columns%3A%20Section%2C%20Insight.'
          }
        ]
      },
      {
        heading: 'Source Distill',
        description: 'Convert raw interviews, transcripts, and notes into clean knowledge packets.',
        prompts: [
          {
            useCase: 'Distill messy research transcripts',
            prompt: `You are acting as a research librarian. Clean and distill the transcript below into an actionable knowledge bank.

Transcript: [paste long transcript]

Steps:
- Extract core claims, pains, goals, and language patterns. Keep quotes.
- Tag each insight with a moment in the transcript (timestamp / paragraph index).
- Produce a "Voice of Customer" dictionary: keyword → sample quote.
- Output a summary table with columns: Theme, Evidence, Opportunity.

Return in Markdown.`,
            url: 'https://chatgpt.com/?prompt=You%20are%20acting%20as%20a%20research%20librarian.%20Clean%20and%20distill%20the%20transcript%20below%20into%20an%20actionable%20knowledge%20bank.%5Cn%5CnTranscript%3A%20%5Bpaste%20long%20transcript%5D%5Cn%5CnSteps%3A%5Cn-%20Extract%20core%20claims%2C%20pains%2C%20goals%2C%20and%20language%20patterns.%20Keep%20quotes.%5Cn-%20Tag%20each%20insight%20with%20a%20moment%20in%20the%20transcript%20(timestamp%20/%20paragraph%20index).%5Cn-%20Produce%20a%20%22Voice%20of%20Customer%22%20dictionary%3A%20keyword%20%E2%86%92%20sample%20quote.%5Cn-%20Output%20a%20summary%20table%20with%20columns%3A%20Theme%2C%20Evidence%2C%20Opportunity.%5Cn%5CnReturn%20in%20Markdown.'
          }
        ]
      },
      {
        heading: 'Structure Mine',
        description: 'Turn distilled insights into modular outlines, variables, and reusable building blocks.',
        prompts: [
          {
            useCase: 'Convert research into a prompt skeleton',
            prompt: `You are a prompt engineer. Build a structured prompt skeleton using the insights below.

Inputs: [paste insights or notes]

Output must include:
1. Role & POV statement.
2. Required context variables (name + what the user must provide).
3. Step-by-step instructions (≤ 7 steps) referencing the variables.
4. Quality guardrails (success criteria, forbidden moves).

Return JSON with keys: role, variables[], steps[], guardrails[].`,
            url: 'https://chatgpt.com/?prompt=You%20are%20a%20prompt%20engineer.%20Build%20a%20structured%20prompt%20skeleton%20using%20the%20insights%20below.%5Cn%5CnInputs%3A%20%5Bpaste%20insights%20or%20notes%5D%5Cn%5CnOutput%20must%20include%3A%5Cn1.%20Role%20%26%20POV%20statement.%5Cn2.%20Required%20context%20variables%20(name%20%2B%20what%20the%20user%20must%20provide).%5Cn3.%20Step-by-step%20instructions%20(%E2%89%A4%207%20steps)%20referencing%20the%20variables.%5Cn4.%20Quality%20guardrails%20(success%20criteria%2C%20forbidden%20moves).%5Cn%5CnReturn%20JSON%20with%20keys%3A%20role%2C%20variables%5B%5D%2C%20steps%5B%5D%2C%20guardrails%5B%5D.'
          }
        ]
      },
      {
        heading: 'Draft Mixer',
        description: 'Remix drafts with tone, story, and hook variations before finalizing.',
        prompts: [
          {
            useCase: 'Remix a long-form draft',
            prompt: `You are an expert editor. Remix the draft below into three alternative versions.

Draft: [paste draft]

Produce:
- Version A: Empathetic storyteller (focus on origin story).
- Version B: Analytical strategist (focus on numbers & proof).
- Version C: Contrarian hot take (focus on reframing assumptions).

For each version include: headline, 3-section outline, CTA suggestion.
Return in Markdown.`,
            url: 'https://chatgpt.com/?prompt=You%20are%20an%20expert%20editor.%20Remix%20the%20draft%20below%20into%20three%20alternative%20versions.%5Cn%5CnDraft%3A%20%5Bpaste%20draft%5D%5Cn%5CnProduce%3A%5Cn-%20Version%20A%3A%20Empathetic%20storyteller%20(focus%20on%20origin%20story).%5Cn-%20Version%20B%3A%20Analytical%20strategist%20(focus%20on%20numbers%20%26%20proof).%5Cn-%20Version%20C%3A%20Contrarian%20hot%20take%20(focus%20on%20reframing%20assumptions).%5Cn%5CnFor%20each%20version%20include%3A%20headline%2C%203-section%20outline%2C%20CTA%20suggestion.%5CnReturn%20in%20Markdown.'
          }
        ]
      },
      {
        heading: 'Publish Cutter',
        description: 'Ship the final asset with distribution-ready snippets and guardrails.',
        prompts: [
          {
            useCase: 'Generate a publication-ready release',
            prompt: `You are an editorial finishing coach. Turn the final prompt draft below into a publication-ready asset.

Prompt draft: [paste polished prompt]

Return:
1. Final prompt (polished, ≤ 400 tokens).
2. Usage checklist: prerequisites, recommended model settings, evaluation steps.
3. Social snippets: tweet, LinkedIn post, newsletter excerpt promoting the prompt.
4. Distribution tracking sheet (table with channel, metric, owner).

Use Markdown headings.`,
            url: 'https://chatgpt.com/?prompt=You%20are%20an%20editorial%20finishing%20coach.%20Turn%20the%20final%20prompt%20draft%20below%20into%20a%20publication-ready%20asset.%5Cn%5CnPrompt%20draft%3A%20%5Bpaste%20polished%20prompt%5D%5Cn%5CnReturn%3A%5Cn1.%20Final%20prompt%20(polished%2C%20%E2%89%A4%20400%20tokens).%5Cn2.%20Usage%20checklist%3A%20prerequisites%2C%20recommended%20model%20settings%2C%20evaluation%20steps.%5Cn3.%20Social%20snippets%3A%20tweet%2C%20LinkedIn%20post%2C%20newsletter%20excerpt%20promoting%20the%20prompt.%5Cn4.%20Distribution%20tracking%20sheet%20(table%20with%20channel%2C%20metric%2C%20owner).%5Cn%5CnUse%20Markdown%20headings.'
          }
        ]
      }
    ]
  },
  {
    title: 'WX 基础要素',
    slug: 'wx-foundational-elements',
    summary: '适用于微信公众号 / 内容运营团队的三步法：先调研、再打磨、最后校稿，让每篇文章稳准狠。',
    coverUrl: 'https://images.unsplash.com/photo-1587613862183-8d0d0f1d3cbb?auto=format&fit=crop&w=1200&q=80',
    sections: [
      {
        heading: '信息检索',
        description: '先把资料拉满，掌握最新事实、案例与数据。',
        prompts: [
          {
            useCase: '汇总选题资料与视角',
            prompt: `你是一名深度公众号作者，请为以下选题做“信息预研”。

选题关键词：{topic}
目标受众：{audience}

输出内容：
1. 数据速览：过去 12 个月的关键统计 / 新法规 / 行业重大事件（标注出处和时间）。
2. 观点地图：列出 3-4 位意见领袖的核心观点，并总结他们的分歧。
3. 案例素材：搜集 3 个真实案例（来源、时间、可引用的细节）。
4. 角度建议：给出 3 个“更好讲故事”的切入角度。

以 Markdown 报告形式呈现。`,
            url: 'https://chatgpt.com/?prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E5%90%8D%E6%B7%B1%E5%BA%A6%E5%85%AC%E4%BC%97%E5%8F%B7%E4%BD%9C%E8%80%85%EF%BC%8C%E8%AF%B7%E4%B8%BA%E4%BB%A5%E4%B8%8B%E9%80%89%E9%A2%98%E5%81%9A%E2%80%9C%E4%BF%A1%E6%81%AF%E9%A2%84%E7%A0%94%E2%80%9D%E3%80%82%5Cn%5Cn%E9%80%89%E9%A2%98%E5%85%B3%E9%94%AE%E8%AF%8D%EF%BC%9A%7Btopic%7D%5Cn%E7%9B%AE%E6%A0%87%E5%8F%97%E4%BC%97%EF%BC%9A%7Baudience%7D%5Cn%5Cn%E8%BE%93%E5%87%BA%E5%86%85%E5%AE%B9%EF%BC%9A%5Cn1.%20%E6%95%B0%E6%8D%AE%E9%80%9F%E8%A7%88%EF%BC%9A%E8%BF%87%E5%8E%BB%2012%20%E4%B8%AA%E6%9C%88%E7%9A%84%E5%85%B3%E9%94%AE%E7%BB%9F%E8%AE%A1%20/%20%E6%96%B0%E6%B3%95%E8%A7%84%20/%20%E8%A1%8C%E4%B8%9A%E9%87%8D%E5%A4%A7%E4%BA%8B%E4%BB%B6%EF%BC%88%E6%A0%87%E6%B3%A8%E5%87%BA%E5%A4%84%E5%92%8C%E6%97%B6%E9%97%B4%EF%BC%89%E3%80%82%5Cn2.%20%E8%A7%82%E7%82%B9%E5%9C%B0%E5%9B%BE%EF%BC%9A%E5%88%97%E5%87%BA%203-4%20%E4%BD%8D%E6%84%8F%E8%A7%81%E9%A2%86%E8%A2%96%E7%9A%84%E6%A0%B8%E5%BF%83%E8%A7%82%E7%82%B9%EF%BC%8C%E5%B9%B6%E6%80%BB%E7%BB%93%E4%BB%96%E4%BB%AC%E7%9A%84%E5%88%86%E6%AD%A7%E3%80%82%5Cn3.%20%E6%A1%88%E4%BE%8B%E7%B4%A0%E6%9D%90%EF%BC%9A%E6%90%9C%E9%9B%86%203%20%E4%B8%AA%E7%9C%9F%E5%AE%9E%E6%A1%88%E4%BE%8B%EF%BC%88%E6%9D%A5%E6%BA%90%E3%80%81%E6%97%B6%E9%97%B4%E3%80%81%E5%8F%AF%E5%BC%95%E7%94%A8%E7%9A%84%E7%BB%86%E8%8A%82%EF%BC%89%E3%80%82%5Cn4.%20%E8%A7%92%E5%BA%A6%E5%BB%BA%E8%AE%AE%EF%BC%9A%E7%BB%99%E5%87%BA%203%20%E4%B8%AA%E2%80%9C%E6%9B%B4%E5%A5%BD%E8%AE%B2%E6%95%85%E4%BA%8B%E2%80%9D%E7%9A%84%E5%88%87%E5%85%A5%E8%A7%92%E5%BA%A6%E3%80%82%5Cn%5Cn%E4%BB%A5%20Markdown%20%E6%8A%A5%E5%91%8A%E5%BD%A2%E5%BC%8F%E5%91%88%E7%8E%B0。'
          }
        ]
      },
      {
        heading: '选题打磨',
        description: '将资料变成抓人的结构框架与写作变量。',
        prompts: [
          {
            useCase: '生成文章结构与变量清单',
            prompt: `你是公众号主编，基于以下研究笔记输出写作提纲。

研究笔记：{notes}
文章目标：{goal}

请输出：
- 标题雏形 3 个（带情绪或数字钩子）。
- 文章骨架：引子、正文 3-4 节、结尾（每节列要点）。
- 写作变量清单：必须补充的数据、案例、金句、图表等。
- 风险提醒：列出 3 个易踩坑点 + 避免方式。

格式使用 Markdown。`,
            url: 'https://chatgpt.com/?prompt=%E4%BD%A0%E6%98%AF%E5%85%AC%E4%BC%97%E5%8F%B7%E4%B8%BB%E7%BC%96%EF%BC%8C%E5%9F%BA%E4%BA%8E%E4%BB%A5%E4%B8%8B%E7%A0%94%E7%A9%B6%E7%AC%94%E8%AE%B0%E8%BE%93%E5%87%BA%E5%86%99%E4%BD%9C%E6%8F%90%E7%BA%B2%E3%80%82%5Cn%5Cn%E7%A0%94%E7%A9%B6%E7%AC%94%E8%AE%B0%EF%BC%9A%7Bnotes%7D%5Cn%E6%96%87%E7%AB%A0%E7%9B%AE%E6%A0%87%EF%BC%9A%7Bgoal%7D%5Cn%5Cn%E8%AF%B7%E8%BE%93%E5%87%BA%EF%BC%9A%5Cn-%20%E6%A0%87%E9%A2%98%E9%9B%8F%E5%BD%A2%203%20%E4%B8%AA%EF%BC%88%E5%B8%A6%E6%83%85%E7%BB%AA%E6%88%96%E6%95%B0%E5%AD%97%E9%92%A9%E5%AD%90%EF%BC%89%E3%80%82%5Cn-%20%E6%96%87%E7%AB%A0%E9%AA%A8%E6%9E%B6%EF%BC%9A%E5%BC%95%E5%AD%90%E3%80%81%E6%AD%A3%E6%96%87%203-4%20%E8%8A%82%E3%80%81%E7%BB%93%E5%B0%BE%EF%BC%88%E6%AF%8F%E8%8A%82%E5%88%97%E8%A6%81%E7%82%B9%EF%BC%89%E3%80%82%5Cn-%20%E5%86%99%E4%BD%9C%E5%8F%98%E9%87%8F%E6%B8%85%E5%8D%95%EF%BC%9A%E5%BF%85%E9%A1%BB%E8%A1%A5%E5%85%85%E7%9A%84%E6%95%B0%E6%8D%AE%E3%80%81%E6%A1%88%E4%BE%8B%E3%80%81%E9%87%91%E5%8F%A5%E3%80%81%E5%9B%BE%E8%A1%A8%E7%AD%89%E3%80%82%5Cn-%20%E9%A3%8E%E9%99%A9%E6%8F%90%E9%86%92%EF%BC%9A%E5%88%97%E5%87%BA%203%20%E4%B8%AA%E6%98%93%E8%B8%A9%E5%9D%91%E7%82%B9%20+%20%E9%81%BF%E5%85%8D%E6%96%B9%E5%BC%8F%E3%80%82%5Cn%5Cn%E6%A0%BC%E5%BC%8F%E4%BD%BF%E7%94%A8%20Markdown。'
          }
        ]
      },
      {
        heading: '三遍审校',
        description: '最后一公里：事实校对、语气润色、互动提升。',
        prompts: [
          {
            useCase: '三段式终稿校对',
            prompt: `请对以下公众号正文做“三遍审校”。

正文：{article}

要求：
- 第一遍：事实核对。标出可能失实/需引用来源的句子，给出检查建议。
- 第二遍：语言润色。优化语句节奏、用词统一、段落过渡。请只给出修改建议清单。
- 第三遍：互动设计。提出 3 个增强互动的元素（如投票、评论话题、读者案例征集）。

最终输出：
1. 校对清单（表格：问题类型 / 原句 / 建议）。
2. 推荐修改稿（保留原段落结构，使用 Markdown）。`,
            url: 'https://chatgpt.com/?prompt=%E8%AF%B7%E5%AF%B9%E4%BB%A5%E4%B8%8B%E5%85%AC%E4%BC%97%E5%8F%B7%E6%AD%A3%E6%96%87%E5%81%9A%E2%80%9C%E4%B8%89%E9%81%8D%E5%AE%A1%E6%A0%A1%E2%80%9D%E3%80%82%5Cn%5Cn%E6%AD%A3%E6%96%87%EF%BC%9A%7Barticle%7D%5Cn%5Cn%E8%A6%81%E6%B1%82%EF%BC%9A%5Cn-%20%E7%AC%AC%E4%B8%80%E9%81%8D%EF%BC%9A%E4%BA%8B%E5%AE%9E%E6%A0%B8%E5%AF%B9%E3%80%82%E6%A0%87%E5%87%BA%E5%8F%AF%E8%83%BD%E5%A4%B1%E5%AE%9E/%E9%9C%80%E5%BC%95%E7%94%A8%E6%9D%A5%E6%BA%90%E7%9A%84%E5%8F%A5%E5%AD%90%EF%BC%8C%E7%BB%99%E5%87%BA%E6%A3%80%E6%9F%A5%E5%BB%BA%E8%AE%AE%E3%80%82%5Cn-%20%E7%AC%AC%E4%BA%8C%E9%81%8D%EF%BC%9A%E8%AF%AD%E8%A8%80%E6%B6%A6%E8%89%B2%E3%80%82%E4%BC%98%E5%8C%96%E8%AF%AD%E5%8F%A5%E8%8A%82%E5%A5%8F%E3%80%81%E7%94%A8%E8%AF%8D%E7%BB%9F%E4%B8%80%E3%80%81%E6%AE%B5%E8%90%BD%E8%BF%87%E6%B8%A1%E3%80%82%E8%AF%B7%E5%8F%AA%E7%BB%99%E5%87%BA%E4%BF%AE%E6%94%B9%E5%BB%BA%E8%AE%AE%E6%B8%85%E5%8D%95%E3%80%82%5Cn-%20%E7%AC%AC%E4%B8%89%E9%81%8D%EF%BC%9A%E4%BA%92%E5%8A%A8%E8%AE%BE%E8%AE%A1%E3%80%82%E6%8F%90%E5%87%BA%203%20%E4%B8%AA%E5%A2%9E%E5%BC%BA%E4%BA%92%E5%8A%A8%E7%9A%84%E5%85%83%E7%B4%A0%EF%BC%88%E5%A6%82%E6%8A%95%E7%A5%A8%E3%80%81%E8%AF%84%E8%AE%BA%E8%AF%9D%E9%A2%98%E3%80%81%E8%AF%BB%E8%80%85%E6%A1%88%E4%BE%8B%E5%BE%81%E9%9B%86%EF%BC%89%5Cn%5Cn%E6%9C%80%E7%BB%88%E8%BE%93%E5%87%BA%EF%BC%9A%5Cn1.%20%E6%A0%A1%E5%AF%B9%E6%B8%85%E5%8D%95%EF%BC%88%E8%A1%A8%E6%A0%BC%EF%BC%9A%E9%97%AE%E9%A2%98%E7%B1%BB%E5%9E%8B%20/%20%E5%8E%9F%E5%8F%A5%20/%20%E5%BB%BA%E8%AE%AE%EF%BC%89%5Cn2.%20%E6%8E%A8%E8%8D%90%E4%BF%AE%E6%94%B9%E7%A8%BF%EF%BC%88%E4%BF%9D%E7%95%99%E5%8E%9F%E6%AE%B5%E8%90%BD%E7%BB%93%E6%9E%84%EF%BC%8C%E4%BD%BF%E7%94%A8%20Markdown%EF%BC%89。'
          }
        ]
      }
    ]
  }
  ,
  {
    title: 'Prompt Bootstrapper',
    slug: 'prompt-bootstrapper',
    summary: 'Bootstrap rewrite, critique, and evaluation workflows with focused operators for each stage.',
    coverUrl: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&w=1200&q=80',
    sections: [
      {
        heading: 'Rewrite Operators',
        description: 'Generate compressed or hardened prompt variants before creating a new version.',
        prompts: [
          {
            useCase: 'Produce a compressed rewrite that keeps the core workflow intact',
            prompt: `You are a prompt compression specialist. Rewrite the following prompt to keep every critical step while removing filler language.

Inputs:
- Title: {title}
- Prompt content: {prompt}

Guidelines:
- Maximum length 220 tokens.
- Preserve step order, variables, and guardrails that protect against failure.
- Highlight exactly three success criteria that must stay true.
- Add a short notes array describing trade-offs introduced by the compression.

Return JSON:
{
  "title": "string",
  "content": "string",
  "successCriteria": ["string"],
  "notes": ["string"]
}`
          },
          {
            useCase: 'Expand a prompt into a robust, production-safe variant',
            prompt: `You are a prompt hardening engineer. Strengthen the prompt below so that it survives messy inputs and inconsistent agents.

Inputs:
- Title: {title}
- Prompt content: {prompt}

Deliver:
1. Add explicit variable declarations (name, type, validation hint).
2. Document success criteria and forbidden moves.
3. Insert fallback or error-handling guidance for at least two failure modes.
4. Write the final prompt content with numbered steps.

Return JSON only:
{
  "title": "string",
  "content": "string",
  "variables": [
    { "name": "string", "type": "string", "validation": "string" }
  ],
  "successCriteria": ["string"],
  "guardrails": ["string"],
  "notes": ["string"]
}`
          }
        ]
      },
      {
        heading: 'Critique & Discovery',
        description: 'Stress-test prompts and surface hidden assumptions before you rewrite.',
        prompts: [
          {
            useCase: 'Run a structured prompt critique with severity ratings',
            prompt: `Act as a ruthless prompt critic. Inspect the prompt below and report concrete risks.

Prompt title: {title}
Prompt content:
{prompt}

If the team provided focus areas, list them here: {focus_areas}

Return JSON with this exact shape:
{
  "summary": "string",
  "issues": [
    {
      "title": "string",
      "severity": "info|warning|error",
      "details": "string",
      "suggestion": "string"
    }
  ],
  "checks": [
    {
      "item": "string",
      "status": "pass|fail|unknown",
      "note": "string"
    }
  ]
}`
          },
          {
            useCase: 'Discover missing variables and unstated assumptions',
            prompt: `You are a prompt discovery facilitator. Audit the prompt below and surface the context it silently depends on.

Prompt title: {title}
Prompt content:
{prompt}

Tasks:
1. Extract every explicit variable the prompt references.
2. Propose additional variables the operator should collect.
3. List assumptions or preconditions that, if false, would break the workflow.
4. Suggest user questions that capture the new variables.

Return JSON:
{
  "existingVariables": ["string"],
  "recommendedVariables": [
    { "name": "string", "reason": "string", "example": "string" }
  ],
  "assumptions": ["string"],
  "followupQuestions": ["string"]
}`
          }
        ]
      },
      {
        heading: 'Evaluation Builders',
        description: 'Spin up lightweight eval suites and remove model lock-in.',
        prompts: [
          {
            useCase: 'Generate an evaluation suite with contains / regex / json_schema asserts',
            prompt: `You are an evaluation engineer. Build a small but meaningful eval suite for the prompt below.

Prompt title: {title}
Prompt content:
{prompt}

Constraints:
- Produce between {min_cases} and {max_cases} cases.
- Cover success, edge, and failure scenarios.
- Prefer "contains" and "regex" assertions; add "json_schema" only if strictly required.
- Every case must include inputs, assertions, and optional notes.

Return JSON:
{
  "suite": {
    "title": "string",
    "description": "string",
    "cases": [
      {
        "id": "string",
        "title": "string",
        "inputs": { "string": "unknown" },
        "asserts": [
          { "type": "contains", "expected": "string", "ignoreCase": true },
          { "type": "regex", "pattern": "string", "flags": "i" },
          { "type": "json_schema", "schema": { "string": "unknown" } }
        ],
        "notes": "string"
      }
    ]
  }
}`
          },
          {
            useCase: 'Strip model-specific instructions while keeping performance guardrails',
            prompt: `You are a model-agnostic rewrite assistant. Remove vendor-specific or proprietary references from the prompt and replace them with capability-based guidance.

Prompt title: {title}
Prompt content:
{prompt}

Steps:
1. Identify concrete model names, API flags, or system prompts tied to one provider.
2. Propose neutral capability requirements instead (e.g., "support function calling", "JSON mode").
3. Rewrite the prompt with placeholders for deployment-specific settings.
4. Produce a short handover note describing what operators must configure manually.

Return Markdown with sections:
## Updated Prompt
<prompt text>

## Capability Requirements
- item

## Handover Notes
- item`
          }
        ]
      },
      {
        heading: 'Voice & Budget',
        description: 'Keep prompts human-readable and inside the token envelope.',
        prompts: [
          {
            useCase: 'Remove AI jargon and make the prompt sound like a coach',
            prompt: `You are an editor who specializes in removing AI voice. Rewrite the prompt so it sounds like a practical human coach.

Prompt title: {title}
Prompt content:
{prompt}

Rules:
- Replace abstract AI phrases ("leverage", "delve", "craft responses") with direct action verbs.
- Keep step-by-step structure intact.
- Surface the "why" behind each step in plain language.
- Output both the revised prompt and a diff-ready bullet list of changes.

Return Markdown with sections:
## Revised Prompt
<prompt text>

## Change Log
- item`
          },
          {
            useCase: 'Enforce a strict token budget while preserving mandatory guardrails',
            prompt: `You are a token budgeter. Shorten the prompt below to fit within {token_budget} tokens without sacrificing must-keep guardrails.

Prompt title: {title}
Prompt content:
{prompt}

Deliver:
1. Estimate current token usage (rough guess is acceptable).
2. Identify sentences or sections safe to trim or compress.
3. Provide the revised prompt within budget.
4. List risks introduced by the cuts and mitigation ideas.

Return Markdown:
## Estimate
- Current tokens: ~N
- Target tokens: {token_budget}

## Proposed Prompt
<prompt text>

## Risks & Mitigations
- Risk → Mitigation`
          }
        ]
      }
    ]
  }
];

export const promptPacks: PromptPack[] = [...basePacks, ...extraPacks];

export function getPromptPack(slug: string): PromptPack | undefined {
  return promptPacks.find((pack) => pack.slug === slug);
}
