import promptPacksData from '../data/promptPacks.json';
import { Locale } from './i18n';

// 多语言字符串类型
export type LocalizedString = {
  en: string;
  zh: string;
};

// 原始数据结构(从 JSON 文件读取)
export type PromptRowData = {
  useCase: string | LocalizedString;
  prompt: string | LocalizedString;
  url?: string | null;
};

export type PromptSectionData = {
  heading: string | LocalizedString;
  description?: string | LocalizedString;
  prompts: PromptRowData[];
};

export type PromptPackData = {
  title: string | LocalizedString;
  slug: string;
  summary: string | LocalizedString;
  coverUrl?: string;
  sections: PromptSectionData[];
};

// 本地化后的类型(用于前端展示)
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

// 辅助函数:获取本地化字符串
function getLocalizedString(value: string | LocalizedString, locale: Locale): string {
  if (typeof value === 'string') {
    return value; // 兼容旧的纯字符串格式
  }
  return value[locale] || value.en; // 优先使用指定语言,回退到英文
}

// 辅助函数:将 PromptPackData 转换为 PromptPack
function localizePromptPack(pack: PromptPackData, locale: Locale): PromptPack {
  return {
    title: getLocalizedString(pack.title, locale),
    slug: pack.slug,
    summary: getLocalizedString(pack.summary, locale),
    coverUrl: pack.coverUrl,
    sections: pack.sections.map(section => ({
      heading: getLocalizedString(section.heading, locale),
      description: section.description ? getLocalizedString(section.description, locale) : undefined,
      prompts: section.prompts.map(prompt => ({
        useCase: getLocalizedString(prompt.useCase, locale),
        prompt: getLocalizedString(prompt.prompt, locale),
        url: prompt.url
      }))
    }))
  };
}

const basePacks = promptPacksData as PromptPackData[];

const extraPacks: PromptPackData[] = [
  {
    title: { en: 'DanKoe Amplifier', zh: 'DanKoe 放大器' },
    slug: 'dankoe-amplifier',
    summary: {
      en: 'A five-step operator system popularized by Dan Koe. Validate an idea, mine raw context, assemble structure, remix drafts, and publish with clarity.',
      zh: '由 Dan Koe 推广的五步操作系统。验证创意、挖掘原始素材、组装结构、重组草稿,并清晰发布。'
    },
    coverUrl: 'https://images.unsplash.com/photo-1529336953121-4974dbffd7d0?auto=format&fit=crop&w=1200&q=80',
    sections: [
      {
        heading: { en: 'Idea Test', zh: '创意测试' },
        description: {
          en: 'Pressure-test the core problem, audience, and irresistible angle before investing energy.',
          zh: '在投入精力之前,对核心问题、受众和不可抗拒的角度进行压力测试。'
        },
        prompts: [
          {
            useCase: {
              en: 'Stress test a new product idea',
              zh: '对新产品创意进行压力测试'
            },
            prompt: {
              en: `You are a pragmatic growth strategist. Pressure-test the idea below.

Idea: [describe the product or service]
Audience: [ideal customer]

Deliver:
1. Problem clarity — rewrite the audience's burning pain in one sentence.
2. Value hook — propose three punchy promise statements (≤ 12 words each).
3. Market skepticism — list five objections an experienced buyer would raise.
4. Evidence checklist — suggest proof / assets needed to answer each objection.

Return the output as a table with columns: Section, Insight.`,
              zh: `你是一位务实的增长策略师。对以下创意进行压力测试。

创意:[描述产品或服务]
受众:[理想客户]

交付内容:
1. 问题清晰度 — 用一句话重写受众的痛点。
2. 价值钩子 — 提出三个有力的承诺陈述(每个 ≤ 12 个字)。
3. 市场质疑 — 列出有经验的买家会提出的五个反对意见。
4. 证据清单 — 建议回答每个反对意见所需的证明/资产。

以表格形式返回输出,列名为:部分、洞察。`
            },
            url: 'https://chatgpt.com/?prompt=You%20are%20a%20pragmatic%20growth%20strategist.%20Pressure-test%20the%20idea%20below.%5Cn%5CnIdea%3A%20%5Bdescribe%20the%20product%20or%20service%5D%5CnAudience%3A%20%5Bideal%20customer%5D%5Cn%5CnDeliver%3A%5Cn1.%20Problem%20clarity%20%E2%80%94%20rewrite%20the%20audience%27s%20burning%20pain%20in%20one%20sentence.%5Cn2.%20Value%20hook%20%E2%80%94%20propose%20three%20punchy%20promise%20statements%20(%E2%89%A4%2012%20words%20each).%5Cn3.%20Market%20skepticism%20%E2%80%94%20list%20five%20objections%20an%20experienced%20buyer%20would%20raise.%5Cn4.%20Evidence%20checklist%20%E2%80%94%20suggest%20proof%20/%20assets%20needed%20to%20answer%20each%20objection.%5Cn%5CnReturn%20the%20output%20as%20a%20table%20with%20columns%3A%20Section%2C%20Insight.'
          }
        ]
      },
      {
        heading: { en: 'Source Distill', zh: '资源提炼' },
        description: {
          en: 'Convert raw interviews, transcripts, and notes into clean knowledge packets.',
          zh: '将原始访谈、转录稿和笔记转换为清晰的知识包。'
        },
        prompts: [
          {
            useCase: {
              en: 'Distill messy research transcripts',
              zh: '提炼杂乱的研究转录稿'
            },
            prompt: {
              en: `You are acting as a research librarian. Clean and distill the transcript below into an actionable knowledge bank.

Transcript: [paste long transcript]

Steps:
- Extract core claims, pains, goals, and language patterns. Keep quotes.
- Tag each insight with a moment in the transcript (timestamp / paragraph index).
- Produce a "Voice of Customer" dictionary: keyword → sample quote.
- Output a summary table with columns: Theme, Evidence, Opportunity.

Return in Markdown.`,
              zh: `你是一名研究图书管理员。清理并提炼以下转录稿,转化为可操作的知识库。

转录稿:[粘贴长转录稿]

步骤:
- 提取核心主张、痛点、目标和语言模式。保留引用。
- 为每个洞察标注转录稿中的时间点(时间戳/段落索引)。
- 生成"客户之声"词典:关键词 → 样本引用。
- 输出摘要表,列名为:主题、证据、机会。

以 Markdown 格式返回。`
            },
            url: 'https://chatgpt.com/?prompt=You%20are%20acting%20as%20a%20research%20librarian.%20Clean%20and%20distill%20the%20transcript%20below%20into%20an%20actionable%20knowledge%20bank.%5Cn%5CnTranscript%3A%20%5Bpaste%20long%20transcript%5D%5Cn%5CnSteps%3A%5Cn-%20Extract%20core%20claims%2C%20pains%2C%20goals%2C%20and%20language%20patterns.%20Keep%20quotes.%5Cn-%20Tag%20each%20insight%20with%20a%20moment%20in%20the%20transcript%20(timestamp%20/%20paragraph%20index).%5Cn-%20Produce%20a%20%22Voice%20of%20Customer%22%20dictionary%3A%20keyword%20%E2%86%92%20sample%20quote.%5Cn-%20Output%20a%20summary%20table%20with%20columns%3A%20Theme%2C%20Evidence%2C%20Opportunity.%5Cn%5CnReturn%20in%20Markdown.'
          }
        ]
      },
      {
        heading: { en: 'Structure Mine', zh: '结构挖掘' },
        description: {
          en: 'Turn distilled insights into modular outlines, variables, and reusable building blocks.',
          zh: '将提炼的洞察转化为模块化大纲、变量和可重用的构建块。'
        },
        prompts: [
          {
            useCase: {
              en: 'Convert research into a prompt skeleton',
              zh: '将研究转换为提示框架'
            },
            prompt: {
              en: `You are a prompt engineer. Build a structured prompt skeleton using the insights below.

Inputs: [paste insights or notes]

Output must include:
1. Role & POV statement.
2. Required context variables (name + what the user must provide).
3. Step-by-step instructions (≤ 7 steps) referencing the variables.
4. Quality guardrails (success criteria, forbidden moves).

Return JSON with keys: role, variables[], steps[], guardrails[].`,
              zh: `你是一名提示工程师。使用以下洞察构建结构化的提示框架。

输入:[粘贴洞察或笔记]

输出必须包括:
1. 角色和观点声明。
2. 必需的上下文变量(名称 + 用户必须提供的内容)。
3. 分步说明(≤ 7 步),引用这些变量。
4. 质量护栏(成功标准、禁止的操作)。

返回 JSON,键名为:role、variables[]、steps[]、guardrails[]。`
            },
            url: 'https://chatgpt.com/?prompt=You%20are%20a%20prompt%20engineer.%20Build%20a%20structured%20prompt%20skeleton%20using%20the%20insights%20below.%5Cn%5CnInputs%3A%20%5Bpaste%20insights%20or%20notes%5D%5Cn%5CnOutput%20must%20include%3A%5Cn1.%20Role%20%26%20POV%20statement.%5Cn2.%20Required%20context%20variables%20(name%20%2B%20what%20the%20user%20must%20provide).%5Cn3.%20Step-by-step%20instructions%20(%E2%89%A4%207%20steps)%20referencing%20the%20variables.%5Cn4.%20Quality%20guardrails%20(success%20criteria%2C%20forbidden%20moves).%5Cn%5CnReturn%20JSON%20with%20keys%3A%20role%2C%20variables%5B%5D%2C%20steps%5B%5D%2C%20guardrails%5B%5D.'
          }
        ]
      },
      {
        heading: { en: 'Draft Mixer', zh: '草稿混合' },
        description: {
          en: 'Remix drafts with tone, story, and hook variations before finalizing.',
          zh: '在最终定稿之前,使用不同的语气、故事和钩子变体重新混合草稿。'
        },
        prompts: [
          {
            useCase: {
              en: 'Remix a long-form draft',
              zh: '重新混合长篇草稿'
            },
            prompt: {
              en: `You are an expert editor. Remix the draft below into three alternative versions.

Draft: [paste draft]

Produce:
- Version A: Empathetic storyteller (focus on origin story).
- Version B: Analytical strategist (focus on numbers & proof).
- Version C: Contrarian hot take (focus on reframing assumptions).

For each version include: headline, 3-section outline, CTA suggestion.
Return in Markdown.`,
              zh: `你是一位专业编辑。将以下草稿重新混合为三个替代版本。

草稿:[粘贴草稿]

生成:
- 版本 A:富有同理心的讲述者(聚焦于起源故事)。
- 版本 B:分析型策略师(聚焦于数据和证明)。
- 版本 C:逆向热点观点(聚焦于重构假设)。

每个版本包括:标题、3 节大纲、行动号召建议。
以 Markdown 格式返回。`
            },
            url: 'https://chatgpt.com/?prompt=You%20are%20an%20expert%20editor.%20Remix%20the%20draft%20below%20into%20three%20alternative%20versions.%5Cn%5CnDraft%3A%20%5Bpaste%20draft%5D%5Cn%5CnProduce%3A%5Cn-%20Version%20A%3A%20Empathetic%20storyteller%20(focus%20on%20origin%20story).%5Cn-%20Version%20B%3A%20Analytical%20strategist%20(focus%20on%20numbers%20%26%20proof).%5Cn-%20Version%20C%3A%20Contrarian%20hot%20take%20(focus%20on%20reframing%20assumptions).%5Cn%5CnFor%20each%20version%20include%3A%20headline%2C%203-section%20outline%2C%20CTA%20suggestion.%5CnReturn%20in%20Markdown.'
          }
        ]
      },
      {
        heading: { en: 'Publish Cutter', zh: '发布裁剪' },
        description: {
          en: 'Ship the final asset with distribution-ready snippets and guardrails.',
          zh: '发布最终资产,并提供可分发的片段和护栏。'
        },
        prompts: [
          {
            useCase: {
              en: 'Generate a publication-ready release',
              zh: '生成可发布的版本'
            },
            prompt: {
              en: `You are an editorial finishing coach. Turn the final prompt draft below into a publication-ready asset.

Prompt draft: [paste polished prompt]

Return:
1. Final prompt (polished, ≤ 400 tokens).
2. Usage checklist: prerequisites, recommended model settings, evaluation steps.
3. Social snippets: tweet, LinkedIn post, newsletter excerpt promoting the prompt.
4. Distribution tracking sheet (table with channel, metric, owner).

Use Markdown headings.`,
              zh: `你是一位编辑完稿教练。将以下最终提示草稿转化为可发布的资产。

提示草稿:[粘贴已润色的提示]

返回:
1. 最终提示(已润色,≤ 400 个标记)。
2. 使用清单:前置条件、推荐的模型设置、评估步骤。
3. 社交片段:推文、领英帖子、推广提示的新闻简报摘录。
4. 分发跟踪表(包含渠道、指标、负责人的表格)。

使用 Markdown 标题。`
            },
            url: 'https://chatgpt.com/?prompt=You%20are%20an%20editorial%20finishing%20coach.%20Turn%20the%20final%20prompt%20draft%20below%20into%20a%20publication-ready%20asset.%5Cn%5CnPrompt%20draft%3A%20%5Bpaste%20polished%20prompt%5D%5Cn%5CnReturn%3A%5Cn1.%20Final%20prompt%20(polished%2C%20%E2%89%A4%20400%20tokens).%5Cn2.%20Usage%20checklist%3A%20prerequisites%2C%20recommended%20model%20settings%2C%20evaluation%20steps.%5Cn3.%20Social%20snippets%3A%20tweet%2C%20LinkedIn%20post%2C%20newsletter%20excerpt%20promoting%20the%20prompt.%5Cn4.%20Distribution%20tracking%20sheet%20(table%20with%20channel%2C%20metric%2C%20owner).%5Cn%5CnUse%20Markdown%20headings.'
          }
        ]
      }
    ]
  },
  {
    title: { en: 'WX Foundational Elements', zh: 'WX 基础要素' },
    slug: 'wx-foundational-elements',
    summary: {
      en: 'A three-step method for WeChat Official Account / content operations teams: research first, refine topics, then proofread—making every article precise, accurate, and impactful.',
      zh: '适用于微信公众号 / 内容运营团队的三步法：先调研、再打磨、最后校稿，让每篇文章稳准狠。'
    },
    coverUrl: 'https://images.unsplash.com/photo-1587613862183-8d0d0f1d3cbb?auto=format&fit=crop&w=1200&q=80',
    sections: [
      {
        heading: { en: 'Information Retrieval', zh: '信息检索' },
        description: {
          en: 'Gather comprehensive materials first, mastering the latest facts, cases, and data.',
          zh: '先把资料拉满，掌握最新事实、案例与数据。'
        },
        prompts: [
          {
            useCase: {
              en: 'Compile topic materials and perspectives',
              zh: '汇总选题资料与视角'
            },
            prompt: {
              en: `You are an in-depth content writer for an official account. Conduct "information pre-research" for the topic below.

Topic keywords: {topic}
Target audience: {audience}

Output:
1. Data snapshot: Key statistics / new regulations / major industry events from the past 12 months (note sources and dates).
2. Perspective map: List core viewpoints from 3-4 thought leaders and summarize their disagreements.
3. Case materials: Collect 3 real-world cases (source, date, citable details).
4. Angle suggestions: Provide 3 "better storytelling" entry angles.

Present as a Markdown report.`,
              zh: `你是一名深度公众号作者，请为以下选题做"信息预研"。

选题关键词：{topic}
目标受众：{audience}

输出内容：
1. 数据速览：过去 12 个月的关键统计 / 新法规 / 行业重大事件（标注出处和时间）。
2. 观点地图：列出 3-4 位意见领袖的核心观点，并总结他们的分歧。
3. 案例素材：搜集 3 个真实案例（来源、时间、可引用的细节）。
4. 角度建议：给出 3 个"更好讲故事"的切入角度。

以 Markdown 报告形式呈现。`
            },
            url: 'https://chatgpt.com/?prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E5%90%8D%E6%B7%B1%E5%BA%A6%E5%85%AC%E4%BC%97%E5%8F%B7%E4%BD%9C%E8%80%85%EF%BC%8C%E8%AF%B7%E4%B8%BA%E4%BB%A5%E4%B8%8B%E9%80%89%E9%A2%98%E5%81%9A%E2%80%9C%E4%BF%A1%E6%81%AF%E9%A2%84%E7%A0%94%E2%80%9D%E3%80%82%5Cn%5Cn%E9%80%89%E9%A2%98%E5%85%B3%E9%94%AE%E8%AF%8D%EF%BC%9A%7Btopic%7D%5Cn%E7%9B%AE%E6%A0%87%E5%8F%97%E4%BC%97%EF%BC%9A%7Baudience%7D%5Cn%5Cn%E8%BE%93%E5%87%BA%E5%86%85%E5%AE%B9%EF%BC%9A%5Cn1.%20%E6%95%B0%E6%8D%AE%E9%80%9F%E8%A7%88%EF%BC%9A%E8%BF%87%E5%8E%BB%2012%20%E4%B8%AA%E6%9C%88%E7%9A%84%E5%85%B3%E9%94%AE%E7%BB%9F%E8%AE%A1%20/%20%E6%96%B0%E6%B3%95%E8%A7%84%20/%20%E8%A1%8C%E4%B8%9A%E9%87%8D%E5%A4%A7%E4%BA%8B%E4%BB%B6%EF%BC%88%E6%A0%87%E6%B3%A8%E5%87%BA%E5%A4%84%E5%92%8C%E6%97%B6%E9%97%B4%EF%BC%89%E3%80%82%5Cn2.%20%E8%A7%82%E7%82%B9%E5%9C%B0%E5%9B%BE%EF%BC%9A%E5%88%97%E5%87%BA%203-4%20%E4%BD%8D%E6%84%8F%E8%A7%81%E9%A2%86%E8%A2%96%E7%9A%84%E6%A0%B8%E5%BF%83%E8%A7%82%E7%82%B9%EF%BC%8C%E5%B9%B6%E6%80%BB%E7%BB%93%E4%BB%96%E4%BB%AC%E7%9A%84%E5%88%86%E6%AD%A7%E3%80%82%5Cn3.%20%E6%A1%88%E4%BE%8B%E7%B4%A0%E6%9D%90%EF%BC%9A%E6%90%9C%E9%9B%86%203%20%E4%B8%AA%E7%9C%9F%E5%AE%9E%E6%A1%88%E4%BE%8B%EF%BC%88%E6%9D%A5%E6%BA%90%E3%80%81%E6%97%B6%E9%97%B4%E3%80%81%E5%8F%AF%E5%BC%95%E7%94%A8%E7%9A%84%E7%BB%86%E8%8A%82%EF%BC%89%E3%80%82%5Cn4.%20%E8%A7%92%E5%BA%A6%E5%BB%BA%E8%AE%AE%EF%BC%9A%E7%BB%99%E5%87%BA%203%20%E4%B8%AA%E2%80%9C%E6%9B%B4%E5%A5%BD%E8%AE%B2%E6%95%85%E4%BA%8B%E2%80%9D%E7%9A%84%E5%88%87%E5%85%A5%E8%A7%92%E5%BA%A6%E3%80%82%5Cn%5Cn%E4%BB%A5%20Markdown%20%E6%8A%A5%E5%91%8A%E5%BD%A2%E5%BC%8F%E5%91%88%E7%8E%B0。'
          }
        ]
      },
      {
        heading: { en: 'Topic Refinement', zh: '选题打磨' },
        description: {
          en: 'Transform materials into compelling structural frameworks and writing variables.',
          zh: '将资料变成抓人的结构框架与写作变量。'
        },
        prompts: [
          {
            useCase: {
              en: 'Generate article structure and variable checklist',
              zh: '生成文章结构与变量清单'
            },
            prompt: {
              en: `You are an official account editor-in-chief. Based on the research notes below, output a writing outline.

Research notes: {notes}
Article goal: {goal}

Output:
- 3 headline drafts (with emotional or numerical hooks).
- Article skeleton: introduction, 3-4 body sections, conclusion (list key points for each section).
- Writing variable checklist: required data, cases, quotes, charts, etc. to supplement.
- Risk reminders: List 3 common pitfalls + avoidance strategies.

Use Markdown format.`,
              zh: `你是公众号主编，基于以下研究笔记输出写作提纲。

研究笔记：{notes}
文章目标：{goal}

请输出：
- 标题雏形 3 个（带情绪或数字钩子）。
- 文章骨架：引子、正文 3-4 节、结尾（每节列要点）。
- 写作变量清单：必须补充的数据、案例、金句、图表等。
- 风险提醒：列出 3 个易踩坑点 + 避免方式。

格式使用 Markdown。`
            },
            url: 'https://chatgpt.com/?prompt=%E4%BD%A0%E6%98%AF%E5%85%AC%E4%BC%97%E5%8F%B7%E4%B8%BB%E7%BC%96%EF%BC%8C%E5%9F%BA%E4%BA%8E%E4%BB%A5%E4%B8%8B%E7%A0%94%E7%A9%B6%E7%AC%94%E8%AE%B0%E8%BE%93%E5%87%BA%E5%86%99%E4%BD%9C%E6%8F%90%E7%BA%B2%E3%80%82%5Cn%5Cn%E7%A0%94%E7%A9%B6%E7%AC%94%E8%AE%B0%EF%BC%9A%7Bnotes%7D%5Cn%E6%96%87%E7%AB%A0%E7%9B%AE%E6%A0%87%EF%BC%9A%7Bgoal%7D%5Cn%5Cn%E8%AF%B7%E8%BE%93%E5%87%BA%EF%BC%9A%5Cn-%20%E6%A0%87%E9%A2%98%E9%9B%8F%E5%BD%A2%203%20%E4%B8%AA%EF%BC%88%E5%B8%A6%E6%83%85%E7%BB%AA%E6%88%96%E6%95%B0%E5%AD%97%E9%92%A9%E5%AD%90%EF%BC%89%E3%80%82%5Cn-%20%E6%96%87%E7%AB%A0%E9%AA%A8%E6%9E%B6%EF%BC%9A%E5%BC%95%E5%AD%90%E3%80%81%E6%AD%A3%E6%96%87%203-4%20%E8%8A%82%E3%80%81%E7%BB%93%E5%B0%BE%EF%BC%88%E6%AF%8F%E8%8A%82%E5%88%97%E8%A6%81%E7%82%B9%EF%BC%89%E3%80%82%5Cn-%20%E5%86%99%E4%BD%9C%E5%8F%98%E9%87%8F%E6%B8%85%E5%8D%95%EF%BC%9A%E5%BF%85%E9%A1%BB%E8%A1%A5%E5%85%85%E7%9A%84%E6%95%B0%E6%8D%AE%E3%80%81%E6%A1%88%E4%BE%8B%E3%80%81%E9%87%91%E5%8F%A5%E3%80%81%E5%9B%BE%E8%A1%A8%E7%AD%89%E3%80%82%5Cn-%20%E9%A3%8E%E9%99%A9%E6%8F%90%E9%86%92%EF%BC%9A%E5%88%97%E5%87%BA%203%20%E4%B8%AA%E6%98%93%E8%B8%A9%E5%9D%91%E7%82%B9%20+%20%E9%81%BF%E5%85%8D%E6%96%B9%E5%BC%8F%E3%80%82%5Cn%5Cn%E6%A0%BC%E5%BC%8F%E4%BD%BF%E7%94%A8%20Markdown。'
          }
        ]
      },
      {
        heading: { en: 'Three-pass Review', zh: '三遍审校' },
        description: {
          en: 'The final mile: fact-checking, tone polishing, and engagement enhancement.',
          zh: '最后一公里：事实校对、语气润色、互动提升。'
        },
        prompts: [
          {
            useCase: {
              en: 'Three-stage final proofreading',
              zh: '三段式终稿校对'
            },
            prompt: {
              en: `Conduct a "three-pass review" for the official account article below.

Article: {article}

Requirements:
- First pass: Fact-checking. Mark sentences that may be inaccurate or require source citations, and provide checking suggestions.
- Second pass: Language polishing. Optimize sentence rhythm, word consistency, and paragraph transitions. Provide only a list of revision suggestions.
- Third pass: Engagement design. Propose 3 engagement-enhancing elements (e.g., polls, comment topics, reader case call-outs).

Final output:
1. Proofreading checklist (table: issue type / original sentence / suggestion).
2. Recommended revised draft (preserve original paragraph structure, use Markdown).`,
              zh: `请对以下公众号正文做"三遍审校"。

正文：{article}

要求：
- 第一遍：事实核对。标出可能失实/需引用来源的句子，给出检查建议。
- 第二遍：语言润色。优化语句节奏、用词统一、段落过渡。请只给出修改建议清单。
- 第三遍：互动设计。提出 3 个增强互动的元素（如投票、评论话题、读者案例征集）。

最终输出：
1. 校对清单（表格：问题类型 / 原句 / 建议）。
2. 推荐修改稿（保留原段落结构，使用 Markdown）。`
            },
            url: 'https://chatgpt.com/?prompt=%E8%AF%B7%E5%AF%B9%E4%BB%A5%E4%B8%8B%E5%85%AC%E4%BC%97%E5%8F%B7%E6%AD%A3%E6%96%87%E5%81%9A%E2%80%9C%E4%B8%89%E9%81%8D%E5%AE%A1%E6%A0%A1%E2%80%9D%E3%80%82%5Cn%5Cn%E6%AD%A3%E6%96%87%EF%BC%9A%7Barticle%7D%5Cn%5Cn%E8%A6%81%E6%B1%82%EF%BC%9A%5Cn-%20%E7%AC%AC%E4%B8%80%E9%81%8D%EF%BC%9A%E4%BA%8B%E5%AE%9E%E6%A0%B8%E5%AF%B9%E3%80%82%E6%A0%87%E5%87%BA%E5%8F%AF%E8%83%BD%E5%A4%B1%E5%AE%9E/%E9%9C%80%E5%BC%95%E7%94%A8%E6%9D%A5%E6%BA%90%E7%9A%84%E5%8F%A5%E5%AD%90%EF%BC%8C%E7%BB%99%E5%87%BA%E6%A3%80%E6%9F%A5%E5%BB%BA%E8%AE%AE%E3%80%82%5Cn-%20%E7%AC%AC%E4%BA%8C%E9%81%8D%EF%BC%9A%E8%AF%AD%E8%A8%80%E6%B6%A6%E8%89%B2%E3%80%82%E4%BC%98%E5%8C%96%E8%AF%AD%E5%8F%A5%E8%8A%82%E5%A5%8F%E3%80%81%E7%94%A8%E8%AF%8D%E7%BB%9F%E4%B8%80%E3%80%81%E6%AE%B5%E8%90%BD%E8%BF%87%E6%B8%A1%E3%80%82%E8%AF%B7%E5%8F%AA%E7%BB%99%E5%87%BA%E4%BF%AE%E6%94%B9%E5%BB%BA%E8%AE%AE%E6%B8%85%E5%8D%95%E3%80%82%5Cn-%20%E7%AC%AC%E4%B8%89%E9%81%8D%EF%BC%9A%E4%BA%92%E5%8A%A8%E8%AE%BE%E8%AE%A1%E3%80%82%E6%8F%90%E5%87%BA%203%20%E4%B8%AA%E5%A2%9E%E5%BC%BA%E4%BA%92%E5%8A%A8%E7%9A%84%E5%85%83%E7%B4%A0%EF%BC%88%E5%A6%82%E6%8A%95%E7%A5%A8%E3%80%81%E8%AF%84%E8%AE%BA%E8%AF%9D%E9%A2%98%E3%80%81%E8%AF%BB%E8%80%85%E6%A1%88%E4%BE%8B%E5%BE%81%E9%9B%86%EF%BC%89%5Cn%5Cn%E6%9C%80%E7%BB%88%E8%BE%93%E5%87%BA%EF%BC%9A%5Cn1.%20%E6%A0%A1%E5%AF%B9%E6%B8%85%E5%8D%95%EF%BC%88%E8%A1%A8%E6%A0%BC%EF%BC%9A%E9%97%AE%E9%A2%98%E7%B1%BB%E5%9E%8B%20/%20%E5%8E%9F%E5%8F%A5%20/%20%E5%BB%BA%E8%AE%AE%EF%BC%89%5Cn2.%20%E6%8E%A8%E8%8D%90%E4%BF%AE%E6%94%B9%E7%A8%BF%EF%BC%88%E4%BF%9D%E7%95%99%E5%8E%9F%E6%AE%B5%E8%90%BD%E7%BB%93%E6%9E%84%EF%BC%8C%E4%BD%BF%E7%94%A8%20Markdown%EF%BC%89。'
          }
        ]
      }
    ]
  }
  ,
  {
    title: { en: 'Prompt Bootstrapper', zh: '提示引导器' },
    slug: 'prompt-bootstrapper',
    summary: {
      en: 'Bootstrap rewrite, critique, and evaluation workflows with focused operators for each stage.',
      zh: '通过针对每个阶段的专注操作符,引导重写、批评和评估工作流程。'
    },
    coverUrl: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&w=1200&q=80',
    sections: [
      {
        heading: { en: 'Rewrite Operators', zh: '重写操作符' },
        description: {
          en: 'Generate compressed or hardened prompt variants before creating a new version.',
          zh: '在创建新版本之前,生成压缩或强化的提示变体。'
        },
        prompts: [
          {
            useCase: {
              en: 'Produce a compressed rewrite that keeps the core workflow intact',
              zh: '生成保持核心工作流程完整的压缩重写'
            },
            prompt: {
              en: `You are a prompt compression specialist. Rewrite the following prompt to keep every critical step while removing filler language.

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
}`,
              zh: `你是提示压缩专家。重写以下提示,保留每个关键步骤的同时删除冗余语言。

输入:
- 标题: {title}
- 提示内容: {prompt}

指导原则:
- 最大长度 220 个 token。
- 保留步骤顺序、变量和防止失败的护栏。
- 精确突出必须保持为真的三个成功标准。
- 添加简短的注释数组,描述压缩引入的权衡。

返回 JSON:
{
  "title": "string",
  "content": "string",
  "successCriteria": ["string"],
  "notes": ["string"]
}`
            }
          },
          {
            useCase: {
              en: 'Expand a prompt into a robust, production-safe variant',
              zh: '将提示扩展为健壮的生产安全变体'
            },
            prompt: {
              en: `You are a prompt hardening engineer. Strengthen the prompt below so that it survives messy inputs and inconsistent agents.

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
}`,
              zh: `你是提示强化工程师。强化以下提示,使其能够应对混乱的输入和不一致的代理。

输入:
- 标题: {title}
- 提示内容: {prompt}

交付内容:
1. 添加明确的变量声明(名称、类型、验证提示)。
2. 记录成功标准和禁止的操作。
3. 为至少两种失败模式插入回退或错误处理指导。
4. 用编号步骤编写最终提示内容。

仅返回 JSON:
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
          }
        ]
      },
      {
        heading: { en: 'Critique & Discovery', zh: '批评与发现' },
        description: {
          en: 'Stress-test prompts and surface hidden assumptions before you rewrite.',
          zh: '在重写之前对提示进行压力测试并发现隐藏的假设。'
        },
        prompts: [
          {
            useCase: {
              en: 'Run a structured prompt critique with severity ratings',
              zh: '运行带有严重性评级的结构化提示批评'
            },
            prompt: {
              en: `Act as a ruthless prompt critic. Inspect the prompt below and report concrete risks.

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
}`,
              zh: `扮演一位严苛的提示批评者。检查以下提示并报告具体风险。

提示标题: {title}
提示内容:
{prompt}

如果团队提供了关注领域,在此列出: {focus_areas}

返回以下确切格式的 JSON:
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
            }
          },
          {
            useCase: {
              en: 'Discover missing variables and unstated assumptions',
              zh: '发现缺失的变量和未声明的假设'
            },
            prompt: {
              en: `You are a prompt discovery facilitator. Audit the prompt below and surface the context it silently depends on.

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
}`,
              zh: `你是提示发现引导者。审计以下提示,并揭示它默默依赖的上下文。

提示标题: {title}
提示内容:
{prompt}

任务:
1. 提取提示引用的每个明确变量。
2. 提议操作员应收集的额外变量。
3. 列出假设或前提条件,如果为假,将破坏工作流程。
4. 建议捕获新变量的用户问题。

返回 JSON:
{
  "existingVariables": ["string"],
  "recommendedVariables": [
    { "name": "string", "reason": "string", "example": "string" }
  ],
  "assumptions": ["string"],
  "followupQuestions": ["string"]
}`
            }
          }
        ]
      },
      {
        heading: { en: 'Evaluation Builders', zh: '评估构建器' },
        description: {
          en: 'Spin up lightweight eval suites and remove model lock-in.',
          zh: '快速创建轻量级评估套件并消除模型锁定。'
        },
        prompts: [
          {
            useCase: {
              en: 'Generate an evaluation suite with contains / regex / json_schema asserts',
              zh: '生成包含 contains / regex / json_schema 断言的评估套件'
            },
            prompt: {
              en: `You are an evaluation engineer. Build a small but meaningful eval suite for the prompt below.

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
}`,
              zh: `你是评估工程师。为以下提示构建一个小型但有意义的评估套件。

提示标题: {title}
提示内容:
{prompt}

约束条件:
- 生成 {min_cases} 到 {max_cases} 个测试用例。
- 涵盖成功、边缘和失败场景。
- 优先使用 "contains" 和 "regex" 断言;仅在严格需要时添加 "json_schema"。
- 每个用例必须包含输入、断言和可选注释。

返回 JSON:
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
            }
          },
          {
            useCase: {
              en: 'Strip model-specific instructions while keeping performance guardrails',
              zh: '在保持性能护栏的同时去除模型特定指令'
            },
            prompt: {
              en: `You are a model-agnostic rewrite assistant. Remove vendor-specific or proprietary references from the prompt and replace them with capability-based guidance.

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
- item`,
              zh: `你是模型无关的重写助手。从提示中删除供应商特定或专有的引用,并用基于能力的指导替换它们。

提示标题: {title}
提示内容:
{prompt}

步骤:
1. 识别绑定到一个提供商的具体模型名称、API 标志或系统提示。
2. 提出中立的能力要求(例如,"支持函数调用"、"JSON 模式")。
3. 使用占位符重写提示以适应特定部署设置。
4. 生成简短的交接说明,描述操作员必须手动配置的内容。

返回包含以下部分的 Markdown:
## 更新后的提示
<提示文本>

## 能力要求
- 项目

## 交接说明
- 项目`
            }
          }
        ]
      },
      {
        heading: { en: 'Voice & Budget', zh: '语气与预算' },
        description: {
          en: 'Keep prompts human-readable and inside the token envelope.',
          zh: '保持提示的可读性并控制在 token 预算范围内。'
        },
        prompts: [
          {
            useCase: {
              en: 'Remove AI jargon and make the prompt sound like a coach',
              zh: '去除 AI 术语并使提示听起来像教练'
            },
            prompt: {
              en: `You are an editor who specializes in removing AI voice. Rewrite the prompt so it sounds like a practical human coach.

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
- item`,
              zh: `你是专门去除 AI 语气的编辑。重写提示,使其听起来像一位实用的人类教练。

提示标题: {title}
提示内容:
{prompt}

规则:
- 用直接的行动动词替换抽象的 AI 短语(如 "leverage"、"delve"、"craft responses")。
- 保持分步结构完整。
- 用简单的语言阐明每个步骤背后的"原因"。
- 输出修订后的提示和差异对比的变更列表。

返回包含以下部分的 Markdown:
## 修订后的提示
<提示文本>

## 变更日志
- 项目`
            }
          },
          {
            useCase: {
              en: 'Enforce a strict token budget while preserving mandatory guardrails',
              zh: '在保留强制护栏的同时执行严格的 token 预算'
            },
            prompt: {
              en: `You are a token budgeter. Shorten the prompt below to fit within {token_budget} tokens without sacrificing must-keep guardrails.

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
- Risk → Mitigation`,
              zh: `你是 token 预算管理员。缩短以下提示以符合 {token_budget} 个 token 的限制,同时不牺牲必须保留的护栏。

提示标题: {title}
提示内容:
{prompt}

交付内容:
1. 估算当前 token 使用量(粗略估计可接受)。
2. 识别可以安全修剪或压缩的句子或部分。
3. 提供符合预算的修订后提示。
4. 列出裁剪引入的风险和缓解措施。

返回 Markdown:
## 估算
- 当前 token 数: ~N
- 目标 token 数: {token_budget}

## 建议的提示
<提示文本>

## 风险与缓解措施
- 风险 → 缓解措施`
            }
          }
        ]
      }
    ]
  }
];

const allPacksData: PromptPackData[] = [...basePacks, ...extraPacks];

// 导出函数:获取所有提示包(本地化版本)
export function getPromptPacks(locale: Locale = 'en'): PromptPack[] {
  return allPacksData.map(pack => localizePromptPack(pack, locale));
}

// 导出函数:根据 slug 获取单个提示包(本地化版本)
export function getPromptPack(slug: string, locale: Locale = 'en'): PromptPack | undefined {
  const packData = allPacksData.find((pack) => pack.slug === slug);
  return packData ? localizePromptPack(packData, locale) : undefined;
}

// 兼容旧代码:默认使用英文
export const promptPacks: PromptPack[] = getPromptPacks('en');

export type PromptPackVersion = {
  version: string;
  label: string;
  createdAt: string;
  pack: PromptPack;
};

type PromptIndexEntry = {
  section: string;
  prompt: PromptRow;
};

const packVersionHistory: Record<string, PromptPackVersion[]> = (() => {
  const history: Record<string, PromptPackVersion[]> = {};

  const chatGptRolePack = getPromptPack('chatgpt-for-any-role');
  if (chatGptRolePack) {
    const historicalPack: PromptPack = {
      ...chatGptRolePack,
      sections: chatGptRolePack.sections.map((section, index) => {
        const prompts =
          index === 0
            ? section.prompts.filter((_, idx) => idx <= 1)
            : index === 1
              ? section.prompts.slice(0, Math.max(0, section.prompts.length - 1))
              : section.prompts;
        return {
          ...section,
          prompts: prompts.map((prompt, idx) =>
            index === 0 && idx === 0
              ? {
                  ...prompt,
                  prompt:
                    'Write a concise email to [recipient] about [topic]. Aim for fewer than 120 words, use a clear subject line, and end with a short call to action.',
                }
              : prompt
          ),
        };
      }),
    };
    history['chatgpt-for-any-role'] = [
      {
        version: '2024-09',
        label: 'September 2024',
        createdAt: '2024-09-01',
        pack: historicalPack,
      },
    ];
  }

  return history;
})();

export function listPackVersions(slug: string): PromptPackVersion[] {
  return packVersionHistory[slug] ?? [];
}

export type PromptDiffStatus = 'added' | 'removed' | 'changed';

export type PromptPackDiffEntry = {
  status: PromptDiffStatus;
  key: string;
  fromSection?: string;
  toSection?: string;
  fromPrompt?: PromptRow;
  toPrompt?: PromptRow;
};

export type PromptPackDiffSummary = {
  totalAdded: number;
  totalRemoved: number;
  totalChanged: number;
  addedSections: string[];
  removedSections: string[];
};

export type PromptPackDiff = {
  entries: PromptPackDiffEntry[];
  summary: PromptPackDiffSummary;
};

function buildPromptIndex(pack: PromptPack): Record<string, PromptIndexEntry> {
  const index: Record<string, PromptIndexEntry> = {};
  for (const section of pack.sections) {
    for (const prompt of section.prompts) {
      const uniqueKey = `${section.heading}::${prompt.useCase}`.toLowerCase();
      index[uniqueKey] = {
        section: section.heading,
        prompt,
      };
    }
  }
  return index;
}

export function diffPromptPacks(fromPack: PromptPack, toPack: PromptPack): PromptPackDiff {
  const fromIndex = buildPromptIndex(fromPack);
  const toIndex = buildPromptIndex(toPack);

  const entries: PromptPackDiffEntry[] = [];

  for (const [key, value] of Object.entries(fromIndex)) {
    if (!toIndex[key]) {
      entries.push({
        status: 'removed',
        key,
        fromSection: value.section,
        fromPrompt: value.prompt,
      });
    }
  }

  for (const [key, value] of Object.entries(toIndex)) {
    if (!fromIndex[key]) {
      entries.push({
        status: 'added',
        key,
        toSection: value.section,
        toPrompt: value.prompt,
      });
    } else {
      const previous = fromIndex[key];
      if (
        previous.section !== value.section ||
        previous.prompt.prompt !== value.prompt.prompt ||
        (previous.prompt.url ?? '') !== (value.prompt.url ?? '')
      ) {
        entries.push({
          status: 'changed',
          key,
          fromSection: previous.section,
          toSection: value.section,
          fromPrompt: previous.prompt,
          toPrompt: value.prompt,
        });
      }
    }
  }

  const fromSections = new Set(fromPack.sections.map((section) => section.heading));
  const toSections = new Set(toPack.sections.map((section) => section.heading));

  const summary: PromptPackDiffSummary = {
    totalAdded: entries.filter((entry) => entry.status === 'added').length,
    totalRemoved: entries.filter((entry) => entry.status === 'removed').length,
    totalChanged: entries.filter((entry) => entry.status === 'changed').length,
    addedSections: Array.from(toSections).filter((heading) => !fromSections.has(heading)),
    removedSections: Array.from(fromSections).filter((heading) => !toSections.has(heading)),
  };

  entries.sort((a, b) => {
    const order = { added: 0, changed: 1, removed: 2 } as const;
    if (order[a.status] !== order[b.status]) {
      return order[a.status] - order[b.status];
    }
    return (a.toSection || a.fromSection || '').localeCompare(b.toSection || b.fromSection || '');
  });

  return {
    entries,
    summary,
  };
}

export function getPackVersion(slug: string, version: string): PromptPackVersion | undefined {
  return (packVersionHistory[slug] ?? []).find((item) => item.version === version);
}
