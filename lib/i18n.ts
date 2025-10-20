import { cookies } from 'next/headers';

export type Locale = 'zh' | 'en';

type ToneOption = { value: string; label: string };
type LanguageOption = { value: string; label: string };

export type Dictionary = {
  locale: Locale;
  header: {
    myPrompts: string;
    login: string;
    languageToggle: { label: string; zh: string; en: string };
  };
  home: {
    tagline: string;
    loginCardTitle: string;
    packsTitle: string;
    packsSubtitle: string;
    packCount: string;
    viewButton: string;
    newPromptButton: string;
    dashboardButton: string;
    recentTitle: string;
    recentEmpty: string;
    viewAll: string;
  };
  auth: {
    emailPlaceholder: string;
    sendMagicLink: string;
    sendingMagicLink: string;
    githubLogin: string;
    emailSent: string;
    errorGeneric: string;
  };
  promptForm: {
    generatorTitle: string;
    modeToggleManual: string;
    modeToggleGenerator: string;
    goalLabel: string;
    goalPlaceholder: string;
    audienceLabel: string;
    audiencePlaceholder: string;
    toneLabel: string;
    toneOptions: ToneOption[];
    languageLabel: string;
    languageOptions: LanguageOption[];
    styleLabel: string;
    stylePlaceholder: string;
    generateButton: string;
    generatingButton: string;
    generateError: string;
    titleLabel: string;
    titlePlaceholder: string;
    contentLabel: string;
    contentPlaceholder: string;
    categoryLabel: string;
    uncategorized: string;
    categoryLabels?: Record<string, string>;
    saveButton: string;
    savingButton: string;
    saveErrorContent: string;
    saveErrorTitle: string;
    saveErrorGeneric: string;
    customCategoryLabel: string;
    customCategoryPlaceholder: string;
    customCategoryHint?: string;
    lint: {
      heading: string;
      loading: string;
      empty: string;
      error: string;
      jumpToIssue: string;
      summaryHeading: string;
      wordCountLabel: string;
      lineCountLabel: string;
      charCountLabel: string;
      coverageOk: string;
      coverageMissing: string;
      severityLabels: { error: string; warning: string; info: string };
      sectionLabels: Record<string, string>;
    };
  };
  quickAdd: {
    title: string;
    saving: string;
    success: string;
    error: string;
    contentRequired: string;
    titleRequired: string;
  };
  dashboard: {
    title: string;
    newButton: string;
    emptyState: string;
    listHeading: string;
  };
  packs: {
    backHome: string;
    openChatGPT: string;
    promptsTag: string;
    importButton: string;
    tipsTitle: string;
    tips: string[];
  };
  newPrompt: {
    title: string;
    backHome: string;
  };
  editPrompt: {
    title: string;
    back: string;
  };
  deletePrompt: {
    confirm: string;
    delete: string;
    deleting: string;
    error: string;
  };
  toast: {
    default: string;
  };
  copy: {
    copy: string;
    copied: string;
    toast: string;
  };
  signOut: {
    button: string;
  };
  promptActions: {
    edit: string;
  };
};

const toneOptionsZh: ToneOption[] = [
  { value: 'neutral', label: '中性' },
  { value: 'friendly', label: '友好' },
  { value: 'professional', label: '专业' },
  { value: 'concise', label: '简洁' },
];

const toneOptionsEn: ToneOption[] = [
  { value: 'neutral', label: 'Neutral' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'professional', label: 'Professional' },
  { value: 'concise', label: 'Concise' },
];

const languageOptionsZh: LanguageOption[] = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: '英文' },
  { value: 'ja', label: '日文' },
];

const languageOptionsEn: LanguageOption[] = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
];

const dictionaries: Record<Locale, Dictionary> = {
  zh: {
    locale: 'zh',
    header: {
      myPrompts: '我的提示词',
      login: '登录',
      languageToggle: { label: '语言', zh: '中文', en: 'English' },
    },
    home: {
      tagline: '收藏与生成专属提示词的工具',
      loginCardTitle: '邮箱登录',
      packsTitle: '精选提示包',
      packsSubtitle: '来自公开社区的精选提示词，一键导入或复制。',
      packCount: '共 {count} 个提示包',
      viewButton: '查看',
      newPromptButton: '创建提示词',
      dashboardButton: '前往我的提示词',
      recentTitle: '最近保存',
      recentEmpty: '暂无提示词，先保存一个试试。',
      viewAll: '查看全部',
    },
    auth: {
      emailPlaceholder: '输入邮箱地址',
      sendMagicLink: '发送登录链接',
      sendingMagicLink: '发送中…',
      githubLogin: '使用 GitHub 登录',
      emailSent: '登录链接已发送到 {email}',
      errorGeneric: '发送邮件失败，请稍后再试',
    },
    promptForm: {
      generatorTitle: '我需要一个新的提示词',
      modeToggleManual: '手动输入',
      modeToggleGenerator: 'AI 生成',
      goalLabel: '目标 / 场景',
      goalPlaceholder: '例如：写一封 B2B SaaS 产品的冷启邮件',
      audienceLabel: '目标用户',
      audiencePlaceholder: '例如：市场负责人、产品经理…',
      toneLabel: '语气',
      toneOptions: toneOptionsZh,
      languageLabel: '输出语言',
      languageOptions: languageOptionsZh,
      styleLabel: '风格或限制条件',
      stylePlaceholder: '例如：输出 JSON，长度控制在 200 字内…',
      generateButton: '生成草稿',
      generatingButton: '生成中…',
      generateError: '生成失败，请稍后再试',
      titleLabel: '标题',
      titlePlaceholder: '为提示词取一个标题',
      contentLabel: '提示词内容',
      contentPlaceholder: '粘贴或编辑提示词正文',
      categoryLabel: '分类',
      uncategorized: '未分类',
      categoryLabels: {
        Brainstorming: '头脑风暴',
        Writing: '写作',
        Analysis: '分析',
        Coding: '编程',
        Data: '数据',
        Marketing: '营销',
        Design: '设计',
        Learning: '学习',
        Productivity: '效率',
        Communication: '沟通',
      },
      saveButton: '保存提示词',
      savingButton: '保存中…',
      saveErrorContent: '请先填写提示词内容',
      saveErrorTitle: '请为提示词填写标题',
      saveErrorGeneric: '保存失败，请稍后再试',
      customCategoryLabel: '自定义分类（选填）',
      customCategoryPlaceholder: '输入新的分类名称',
      customCategoryHint: '填写后将创建新的分类并保存到列表中。',
      lint: {
        heading: '结构检查',
        loading: '分析中…',
        empty: '未发现结构性问题。',
        error: '分析失败，请稍后再试。',
        jumpToIssue: '定位',
        summaryHeading: '提示结构概览',
        wordCountLabel: '字数',
        lineCountLabel: '行数',
        charCountLabel: '字符数',
        coverageOk: '已覆盖',
        coverageMissing: '缺失',
        severityLabels: { error: '错误', warning: '警告', info: '提示' },
        sectionLabels: {
          role: '角色设定',
          task: '任务目标',
          constraints: '约束 / 步骤',
          output: '输出格式',
          variables: '上下文变量',
          guardrails: '安全边界',
        },
      },
    },
    quickAdd: {
      title: '快速保存',
      saving: '保存中…',
      success: '已保存',
      error: '保存失败，请稍后再试',
      contentRequired: '请先填写提示词内容',
      titleRequired: '请为提示词填写标题',
    },
    dashboard: {
      title: '我的提示词',
      newButton: '创建提示词',
      emptyState: '暂无提示词，试着先保存一个吧。',
      listHeading: '全部提示词',
    },
    packs: {
      backHome: '返回首页',
      openChatGPT: '在 ChatGPT 打开',
      promptsTag: '{count} 条提示词',
      importButton: '导入到我的提示词',
      tipsTitle: '写好提示词的小贴士',
      tips: [
        'K – 先说明任务目标，给出成功标准。',
        'E – 补充背景，例如受众、已有素材。',
        'R – 指定 AI 扮演的角色或语气风格。',
        'N – 说明格式、长度、敏感词等限制。',
        'E –举例或提供参考输出结构。',
        'L – 如果有 token / 成本限制，也可在此注明。',
      ],
    },
    newPrompt: {
      title: '创建提示词',
      backHome: '返回首页',
    },
    editPrompt: {
      title: '编辑提示词',
      back: '返回详情页',
    },
    deletePrompt: {
      confirm: '确认要删除这条提示词吗？',
      delete: '删除',
      deleting: '删除中…',
      error: '删除失败，请稍后再试',
    },
    toast: {
      default: '操作已完成',
    },
    copy: {
      copy: '复制',
      copied: '已复制',
      toast: '内容已复制到剪贴板',
    },
    signOut: {
      button: '退出登录',
    },
    promptActions: {
      edit: '编辑',
    },
  },
  en: {
    locale: 'en',
    header: {
      myPrompts: 'My prompts',
      login: 'Sign in',
      languageToggle: { label: 'Language', zh: 'Chinese', en: 'English' },
    },
    home: {
      tagline: 'A focused tool to collect and craft your best prompts',
      loginCardTitle: 'Magic link sign-in',
      packsTitle: 'Featured prompt packs',
      packsSubtitle: 'Curated prompts from the community. Import or copy in one click.',
      packCount: '{count} packs available',
      viewButton: 'View',
      newPromptButton: 'Create prompt',
      dashboardButton: 'Go to my prompts',
      recentTitle: 'Recently saved',
      recentEmpty: 'No prompts yet. Save your first one to get started.',
      viewAll: 'View all',
    },
    auth: {
      emailPlaceholder: 'Enter your email address',
      sendMagicLink: 'Send login link',
      sendingMagicLink: 'Sending…',
      githubLogin: 'Continue with GitHub',
      emailSent: 'We sent a login link to {email}',
      errorGeneric: 'Failed to send email. Please try again.',
    },
    promptForm: {
      generatorTitle: 'Help me craft a new prompt',
      modeToggleManual: 'Manual input',
      modeToggleGenerator: 'AI assistant',
      goalLabel: 'Goal / scenario',
      goalPlaceholder: 'e.g. Write a cold email for a B2B SaaS product',
      audienceLabel: 'Target audience',
      audiencePlaceholder: 'e.g. Marketing lead, product manager…',
      toneLabel: 'Tone',
      toneOptions: toneOptionsEn,
      languageLabel: 'Output language',
      languageOptions: languageOptionsEn,
      styleLabel: 'Style or constraints',
      stylePlaceholder: 'e.g. Respond in JSON, keep under 200 words…',
      generateButton: 'Generate draft',
      generatingButton: 'Generating…',
      generateError: 'Generation failed. Please try again.',
      titleLabel: 'Title',
      titlePlaceholder: 'Give this prompt a name',
      contentLabel: 'Prompt content',
      contentPlaceholder: 'Paste or edit the prompt body',
      categoryLabel: 'Category',
      uncategorized: 'Uncategorized',
      categoryLabels: {
        Brainstorming: 'Brainstorming',
        Writing: 'Writing',
        Analysis: 'Analysis',
        Coding: 'Coding',
        Data: 'Data',
        Marketing: 'Marketing',
        Design: 'Design',
        Learning: 'Learning',
        Productivity: 'Productivity',
        Communication: 'Communication',
      },
      saveButton: 'Save prompt',
      savingButton: 'Saving…',
      saveErrorContent: 'Please add the prompt content first.',
      saveErrorTitle: 'Please provide a title for this prompt.',
      saveErrorGeneric: 'Failed to save prompt. Please try again.',
      customCategoryLabel: 'Custom category (optional)',
      customCategoryPlaceholder: 'Enter a new category name',
      customCategoryHint: 'We will create this category and add it to your list.',
      lint: {
        heading: 'Prompt check',
        loading: 'Analyzing…',
        empty: 'No structural issues detected.',
        error: 'Lint analysis failed. Please try again later.',
        jumpToIssue: 'Focus',
        summaryHeading: 'Structure overview',
        wordCountLabel: 'Words',
        lineCountLabel: 'Lines',
        charCountLabel: 'Characters',
        coverageOk: 'Covered',
        coverageMissing: 'Missing',
        severityLabels: { error: 'Error', warning: 'Warning', info: 'Info' },
        sectionLabels: {
          role: 'Role',
          task: 'Task',
          constraints: 'Constraints',
          output: 'Output format',
          variables: 'Variables',
          guardrails: 'Guardrails',
        },
      },
    },
    quickAdd: {
      title: 'Quick save',
      saving: 'Saving…',
      success: 'Saved',
      error: 'Failed to save prompt. Please try again.',
      contentRequired: 'Please add the prompt content first.',
      titleRequired: 'Please provide a title.',
    },
    dashboard: {
      title: 'My prompts',
      newButton: 'Create prompt',
      emptyState: 'No prompts yet. Save one to get started.',
      listHeading: 'All prompts',
    },
    packs: {
      backHome: 'Back to home',
      openChatGPT: 'Open in ChatGPT',
      promptsTag: '{count} prompts',
      importButton: 'Import to my prompts',
      tipsTitle: 'Prompt writing checklist',
      tips: [
        'K – State the key goal and success criteria.',
        'E – Provide essential background and context.',
        'R – Assign a role or tone to the assistant.',
        'N – Note any constraints such as format or length.',
        'E – Add examples or outline the expected structure.',
        'L – Mention limits like token budgets if relevant.',
      ],
    },
    newPrompt: {
      title: 'Create prompt',
      backHome: 'Back to home',
    },
    editPrompt: {
      title: 'Edit prompt',
      back: 'Back to details',
    },
    deletePrompt: {
      confirm: 'Delete this prompt?',
      delete: 'Delete',
      deleting: 'Deleting…',
      error: 'Failed to delete prompt. Please try again.',
    },
    toast: {
      default: 'Done',
    },
    copy: {
      copy: 'Copy',
      copied: 'Copied',
      toast: 'Copied to clipboard',
    },
    signOut: {
      button: 'Sign out',
    },
    promptActions: {
      edit: 'Edit',
    },
  },
};

export async function getDictionary(): Promise<Dictionary> {
  const cookieStore = cookies();
  const lang = cookieStore.get('lang')?.value as Locale | undefined;
  const locale: Locale = lang === 'en' ? 'en' : 'zh';
  return dictionaries[locale];
}
