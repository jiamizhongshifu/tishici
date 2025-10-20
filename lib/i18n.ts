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
    modeToggleBootstrap: string;
    modeToggleTemplate: string;
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
    lintPanelTitle: string;
    lintLoading: string;
    lintUpdatedAt: string;
    lintRetryButton: string;
    lintEmptyState: string;
    lintErrorState: string;
    lintSummaryLabel: string;
    lintIssueListLabel: string;
    lintSeverityLabels: { error: string; warning: string; info: string; success: string };
    lintCountsLabel: { total: string; error: string; warning: string; info: string; success: string };
    lintFocusButton: string;
    lintFixHintLabel: string;
    lintFixGenerateButton: string;
    lintFixGeneratingButton: string;
    lintFixApplyButton: string;
    lintFixUndoButton: string;
    lintFixSummaryTitle: string;
    lintFixDiffTitle: string;
    lintFixSuggestionsTitle: string;
    lintFixRequiredIssues: string;
    lintFixError: string;
    lintFixAppliedNotice: string;
    bootstrapTitle: string;
    bootstrapDescription: string;
    bootstrapGoalLabel: string;
    bootstrapGoalPlaceholder: string;
    bootstrapDomainLabel: string;
    bootstrapDomainPlaceholder: string;
    bootstrapAudienceLabel: string;
    bootstrapAudiencePlaceholder: string;
    bootstrapConstraintsLabel: string;
    bootstrapConstraintsPlaceholder: string;
    bootstrapGenerateButton: string;
    bootstrapGeneratingButton: string;
    bootstrapError: string;
    templateTitle: string;
    templateDescription: string;
    templateSearchPlaceholder: string;
    templateSelectCategory: string;
    templateSelectTemplate: string;
    templateNoResults: string;
    templateFillVariables: string;
    templateFillVariablesHint: string;
    templateUseButton: string;
    templateCancelButton: string;
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
    packIO: {
      title: string;
      importTitle: string;
      importDescription: string;
      importFileLabel: string;
      importButton: string;
      importingButton: string;
      importSuccess: string;
      importError: string;
      exportTitle: string;
      exportDescription: string;
      exportPackTitleLabel: string;
      exportPackTitlePlaceholder: string;
      exportPackSummaryLabel: string;
      exportPackSummaryPlaceholder: string;
      exportSelectPrompts: string;
      exportButton: string;
      exportingButton: string;
      exportSuccess: string;
      exportError: string;
      downloadButton: string;
      noPromptsSelected: string;
      errorMessages: {
        NOT_AUTHENTICATED: string;
        PACK_JSON_REQUIRED: string;
        PACK_JSON_INVALID: string;
        NO_PROMPTS_FOUND: string;
        NO_VALID_PROMPTS: string;
        NO_PROMPTS_SELECTED: string;
      };
    };
    packDiff: {
      title: string;
      fromVersion: string;
      toVersion: string;
      currentVersion: string;
      compareButton: string;
      summaryTitle: string;
      addedPrompts: string;
      changedPrompts: string;
      removedPrompts: string;
      newSections: string;
      removedSections: string;
      promptChangesTitle: string;
      noDifferences: string;
      added: string;
      changed: string;
      removed: string;
      previous: string;
      current: string;
      openExample: string;
    };
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
  eval: {
    title: string;
    runButton: string;
    runningButton: string;
    lastRunLabel: string;
    errorLabel: string;
    emptyState: string;
    overallLabel: string;
    clarityLabel: string;
    constraintsLabel: string;
    reproducibilityLabel: string;
    costLabel: string;
    tokensLabel: string;
    usdLabel: string;
    strengthsLabel: string;
    improvementsLabel: string;
    notesLabel: string;
    improveButton: string;
    improveGeneratingButton: string;
    improveSummaryTitle: string;
    improvePromptTitle: string;
    improveDiffTitle: string;
    improveError: string;
  };
};

const toneOptionsZh: ToneOption[] = [
  { value: 'neutral', label: '中性' },
  { value: 'friendly', label: '友好' },
  { value: 'professional', label: '专业' },
  { value: 'concise', label: '简洁' },
  { value: 'casual', label: '随意' },
  { value: 'authoritative', label: '权威' },
  { value: 'persuasive', label: '有说服力' },
  { value: 'creative', label: '创意' },
];

const toneOptionsEn: ToneOption[] = [
  { value: 'neutral', label: 'Neutral' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'professional', label: 'Professional' },
  { value: 'concise', label: 'Concise' },
  { value: 'casual', label: 'Casual' },
  { value: 'authoritative', label: 'Authoritative' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'creative', label: 'Creative' },
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
      modeToggleBootstrap: '快速启动',
      modeToggleTemplate: '模板',
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
      lintPanelTitle: '提示体检',
      lintLoading: '正在检查...',
      lintUpdatedAt: '上次检查：{time}',
      lintRetryButton: '重新检查',
      lintEmptyState: '暂未发现问题，继续保持！',
      lintErrorState: '检查失败，请稍后重试。',
      lintSummaryLabel: '问题概览',
      lintIssueListLabel: '问题列表',
      lintSeverityLabels: { error: '错误', warning: '警告', info: '提示', success: '成功' },
      lintCountsLabel: { total: '总计', error: '错误', warning: '警告', info: '提示', success: '成功' },
      lintFocusButton: '定位到内容',
      lintFixHintLabel: '修复建议',
      lintFixGenerateButton: '生成修正建议',
      lintFixGeneratingButton: '生成中…',
      lintFixApplyButton: '应用修正',
      lintFixUndoButton: '撤销修正',
      lintFixSummaryTitle: '修正摘要',
      lintFixDiffTitle: '变更对比',
      lintFixSuggestionsTitle: '针对问题的处理',
      lintFixRequiredIssues: '请先运行检查并确保至少存在一个问题。',
      lintFixError: '生成修正失败，请稍后重试。',
      lintFixAppliedNotice: '已应用修正，可随时撤销恢复原始内容。',
      bootstrapTitle: '快速启动提示词模板',
      bootstrapDescription: '基于您的目标生成符合最佳实践的生产就绪提示词模板。',
      bootstrapGoalLabel: '目标 *',
      bootstrapGoalPlaceholder: '您希望提示词实现什么目标？',
      bootstrapDomainLabel: '领域（可选）',
      bootstrapDomainPlaceholder: '例如：营销、代码审查、数据分析',
      bootstrapAudienceLabel: '受众（可选）',
      bootstrapAudiencePlaceholder: '例如：开发者、营销团队、学生',
      bootstrapConstraintsLabel: '约束条件（可选）',
      bootstrapConstraintsPlaceholder: '任何特定的规则、限制或要求',
      bootstrapGenerateButton: '生成模板',
      bootstrapGeneratingButton: '生成中...',
      bootstrapError: '生成模板失败，请稍后重试。',
      templateTitle: '选择模板',
      templateDescription: '浏览我们精心策划的专业提示词模板集合',
      templateSearchPlaceholder: '搜索模板...',
      templateSelectCategory: '选择类别',
      templateSelectTemplate: '选择模板',
      templateNoResults: '未找到模板',
      templateFillVariables: '填写模板变量',
      templateFillVariablesHint: '通过填写下面的变量来自定义模板',
      templateUseButton: '使用此模板',
      templateCancelButton: '返回',
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
      // PackIO 模块翻译
      packIO: {
        title: 'Pack 导入/导出',
        importTitle: '导入 Prompt Pack',
        importDescription: '上传 JSON 格式的 Prompt Pack 文件，批量导入提示词到您的库中。',
        importFileLabel: '选择 JSON 文件',
        importButton: '导入',
        importingButton: '导入中...',
        importSuccess: '成功导入 {count} 个提示词',
        importError: '导入失败，请检查文件格式',
        exportTitle: '导出 Prompt Pack',
        exportDescription: '选择您的提示词，导出为 JSON 格式的 Pack 文件，方便分享和备份。',
        exportPackTitleLabel: 'Pack 标题',
        exportPackTitlePlaceholder: '为您的 Pack 取一个标题',
        exportPackSummaryLabel: 'Pack 描述',
        exportPackSummaryPlaceholder: '简要描述这个 Pack 的内容和用途',
        exportSelectPrompts: '选择要导出的提示词',
        exportButton: '导出',
        exportingButton: '导出中...',
        exportSuccess: '成功导出 {count} 个提示词',
        exportError: '导出失败，请稍后重试',
        downloadButton: '下载 JSON 文件',
        noPromptsSelected: '请至少选择一个提示词',
        errorMessages: {
          NOT_AUTHENTICATED: '请先登录',
          PACK_JSON_REQUIRED: '请选择 JSON 文件',
          PACK_JSON_INVALID: 'JSON 文件格式无效',
          NO_PROMPTS_FOUND: '未找到提示词',
          NO_VALID_PROMPTS: '没有有效的提示词',
          NO_PROMPTS_SELECTED: '请选择要导出的提示词',
        },
      },
      // Pack Diff 页面翻译
      packDiff: {
        title: 'Pack 版本对比',
        fromVersion: '起始版本',
        toVersion: '目标版本',
        currentVersion: '当前版本',
        compareButton: '对比',
        summaryTitle: '对比摘要',
        addedPrompts: '新增提示词',
        changedPrompts: '修改提示词',
        removedPrompts: '删除提示词',
        newSections: '新增章节',
        removedSections: '删除章节',
        promptChangesTitle: '提示词变更',
        noDifferences: '所选版本之间没有差异',
        added: '新增',
        changed: '修改',
        removed: '删除',
        previous: '之前',
        current: '当前',
        openExample: '打开示例',
      },
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
    eval: {
      title: '提示评测',
      runButton: '开始评测',
      runningButton: '评测中…',
      lastRunLabel: '上次评测：{time}',
      errorLabel: '评测失败，请稍后再试。',
      emptyState: '暂无评测结果，点击“开始评测”生成评分。',
      overallLabel: '综合评分',
      clarityLabel: '清晰度',
      constraintsLabel: '约束完备',
      reproducibilityLabel: '可复现性',
      costLabel: '成本估计',
      tokensLabel: 'Tokens',
      usdLabel: '美元',
      strengthsLabel: '亮点',
      improvementsLabel: '改进建议',
      notesLabel: '备注',
      improveButton: '根据改进建议生成新提示词',
      improveGeneratingButton: '生成中…',
      improveSummaryTitle: '改进摘要',
      improvePromptTitle: '改进后提示词',
      improveDiffTitle: '变更对比',
      improveError: '生成改进版提示词失败，请稍后再试。',
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
      modeToggleBootstrap: 'Bootstrap',
      modeToggleTemplate: 'Templates',
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
      lintPanelTitle: 'Prompt health check',
      lintLoading: 'Running lint...',
      lintUpdatedAt: 'Last checked: {time}',
      lintRetryButton: 'Retry lint',
      lintEmptyState: 'Looks great! No issues detected.',
      lintErrorState: 'Lint failed. Please try again.',
      lintSummaryLabel: 'Issue overview',
      lintIssueListLabel: 'Issue details',
      lintSeverityLabels: { error: 'Error', warning: 'Warning', info: 'Info', success: 'Success' },
      lintCountsLabel: { total: 'Total', error: 'Errors', warning: 'Warnings', info: 'Infos', success: 'Successes' },
      lintFocusButton: 'Focus prompt',
      lintFixHintLabel: 'Suggested fix',
      lintFixGenerateButton: 'Generate fix suggestions',
      lintFixGeneratingButton: 'Generating…',
      lintFixApplyButton: 'Apply fix',
      lintFixUndoButton: 'Undo',
      lintFixSummaryTitle: 'Fix summary',
      lintFixDiffTitle: 'Changes',
      lintFixSuggestionsTitle: 'How issues were addressed',
      lintFixRequiredIssues: 'Run lint and ensure there is at least one issue before requesting fixes.',
      lintFixError: 'Failed to generate fix suggestions. Please try again.',
      lintFixAppliedNotice: 'Fix applied. You can undo to restore the previous prompt.',
      bootstrapTitle: 'Bootstrap Prompt Template',
      bootstrapDescription: 'Generate a production-ready prompt template following best practices based on your goal.',
      bootstrapGoalLabel: 'Goal *',
      bootstrapGoalPlaceholder: 'What do you want the prompt to accomplish?',
      bootstrapDomainLabel: 'Domain (optional)',
      bootstrapDomainPlaceholder: 'e.g., Marketing, Code Review, Data Analysis',
      bootstrapAudienceLabel: 'Audience (optional)',
      bootstrapAudiencePlaceholder: 'e.g., Developers, Marketing team, Students',
      bootstrapConstraintsLabel: 'Constraints (optional)',
      bootstrapConstraintsPlaceholder: 'Any specific rules, limitations, or requirements',
      bootstrapGenerateButton: 'Generate Template',
      bootstrapGeneratingButton: 'Generating...',
      bootstrapError: 'Failed to generate template. Please try again.',
      templateTitle: 'Choose a Template',
      templateDescription: 'Browse our curated collection of professional prompt templates',
      templateSearchPlaceholder: 'Search templates...',
      templateSelectCategory: 'Select a category',
      templateSelectTemplate: 'Choose a template',
      templateNoResults: 'No templates found',
      templateFillVariables: 'Fill in template variables',
      templateFillVariablesHint: 'Customize the template by filling in the variables below',
      templateUseButton: 'Use This Template',
      templateCancelButton: 'Back',
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
      // PackIO module translations
      packIO: {
        title: 'Pack Import/Export',
        importTitle: 'Import Prompt Pack',
        importDescription: 'Upload a JSON-formatted Prompt Pack file to batch import prompts into your library.',
        importFileLabel: 'Select JSON file',
        importButton: 'Import',
        importingButton: 'Importing...',
        importSuccess: 'Successfully imported {count} prompts',
        importError: 'Import failed, please check file format',
        exportTitle: 'Export Prompt Pack',
        exportDescription: 'Select your prompts and export them as a JSON Pack file for sharing and backup.',
        exportPackTitleLabel: 'Pack Title',
        exportPackTitlePlaceholder: 'Give your pack a title',
        exportPackSummaryLabel: 'Pack Summary',
        exportPackSummaryPlaceholder: 'Briefly describe the content and purpose of this pack',
        exportSelectPrompts: 'Select prompts to export',
        exportButton: 'Export',
        exportingButton: 'Exporting...',
        exportSuccess: 'Successfully exported {count} prompts',
        exportError: 'Export failed, please try again',
        downloadButton: 'Download JSON file',
        noPromptsSelected: 'Please select at least one prompt',
        errorMessages: {
          NOT_AUTHENTICATED: 'Please log in first',
          PACK_JSON_REQUIRED: 'Please select a JSON file',
          PACK_JSON_INVALID: 'Invalid JSON file format',
          NO_PROMPTS_FOUND: 'No prompts found',
          NO_VALID_PROMPTS: 'No valid prompts',
          NO_PROMPTS_SELECTED: 'Please select prompts to export',
        },
      },
      // Pack Diff page translations
      packDiff: {
        title: 'Pack Version Comparison',
        fromVersion: 'From version',
        toVersion: 'To version',
        currentVersion: 'Current',
        compareButton: 'Compare',
        summaryTitle: 'Summary',
        addedPrompts: 'Added prompts',
        changedPrompts: 'Changed prompts',
        removedPrompts: 'Removed prompts',
        newSections: 'New sections',
        removedSections: 'Removed sections',
        promptChangesTitle: 'Prompt changes',
        noDifferences: 'No differences detected between the selected versions.',
        added: 'Added',
        changed: 'Changed',
        removed: 'Removed',
        previous: 'Previous',
        current: 'Current',
        openExample: 'Open example',
      },
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
    eval: {
      title: 'Prompt evaluation',
      runButton: 'Run evaluation',
      runningButton: 'Evaluating…',
      lastRunLabel: 'Last run: {time}',
      errorLabel: 'Evaluation failed. Please try again.',
      emptyState: 'No evaluation yet. Click “Run evaluation” to generate scores.',
      overallLabel: 'Overall',
      clarityLabel: 'Clarity',
      constraintsLabel: 'Constraints',
      reproducibilityLabel: 'Reproducibility',
      costLabel: 'Cost estimate',
      tokensLabel: 'Tokens',
      usdLabel: 'USD',
      strengthsLabel: 'Strengths',
      improvementsLabel: 'Improvements',
      notesLabel: 'Notes',
      improveButton: 'Generate improved prompt',
      improveGeneratingButton: 'Generating…',
      improveSummaryTitle: 'Improvement summary',
      improvePromptTitle: 'Improved prompt',
      improveDiffTitle: 'Changes',
      improveError: 'Failed to generate improved prompt. Please try again.',
    },
  },
};

export async function getDictionary(): Promise<Dictionary> {
  const cookieStore = cookies();
  const lang = cookieStore.get('lang')?.value as Locale | undefined;
  const locale: Locale = lang === 'en' ? 'en' : 'zh';
  return dictionaries[locale];
}
