import { cookies } from 'next/headers';

export type Locale = 'zh' | 'en';

type ToneOption = { value: string; label: string };
type LanguageOption = { value: string; label: string };

export type Dictionary = {
  locale: Locale;
  header: {
    myPrompts: string;
    login: string;
    signOut: string;
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
    manualTitle: string;
    manualDescription: string;
    manualClear: string;
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
    frameworkLabel: string;
    frameworkPlaceholder: string;
    successLabel: string;
    successPlaceholder: string;
    constraintsLabel: string;
    constraintsPlaceholder: string;
    variablesLabel: string;
    variablesPlaceholder: string;
    inputFormatLabel: string;
    inputFormatPlaceholder: string;
    modelPrefsLabel: string;
    modelPrefsPlaceholder: string;
    tokenBudgetLabel: string;
    tokenBudgetPlaceholder: string;
    bootstrapNotesLabel: string;
    bootstrapNotesPlaceholder: string;
    titleLabel: string;
    titlePlaceholder: string;
    contentLabel: string;
    contentPlaceholder: string;
    categoryLabel: string;
    uncategorized: string;
    categoryLabels?: Record<string, string>;
    saveButton: string;
  };
  dashboard: {
    title: string;
    newButton: string;
    emptyState: string;
    viewDetails: string;
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
  deletePrompt: {
    confirm: string;
    delete: string;
    deleting: string;
    error: string;
  };
  copy: {
    copy: string;
    copied: string;
    toast: string;
  };
  linter: {
    panelTitle: string;
    detail: string;
    copyAdvice: string;
    dismiss: string;
    noIssues: string;
    scoreLabel: string;
    run: string;
    running: string;
    focusField: string;
  };
  eval: {
    toggle: string;
    panelTitle: string;
    suiteLabel: string;
    suitePlaceholder: string;
    run: string;
    running: string;
    resultSummary: string;
    passed: string;
    failed: string;
    lastExecuted: string;
    lastRunLabel: string;
    noResults: string;
    parseError: string;
    copySuite: string;
    resetSuite: string;
    casePassed: string;
    caseFailed: string;
    error: string;
    defaultSuiteTitle: string;
    defaultContainsHint: string;
    savedSuitesLabel: string;
    savedSuitesPlaceholder: string;
    refreshSuites: string;
    saveSuite: string;
    saveSuiteAs: string;
    deleteSuite: string;
    deleteSuiteConfirm: string;
    suiteNamePrompt: string;
    suiteNameRequired: string;
    loadingSuites: string;
    savingSuite: string;
    deletingSuite: string;
    noSavedSuites: string;
  };
  bootstrap: {
    tabTitle: string;
    tabRewrite: string;
    tabCritique: string;
    tabEvals: string;
    rewriteTitle: string;
    rewriteDescription: string;
    critiqueTitle: string;
    critiqueDescription: string;
    evalsTitle: string;
    evalsDescription: string;
    instructionsLabel: string;
    instructionsPlaceholder: string;
    focusLabel: string;
    focusPlaceholder: string;
    minLabel: string;
    maxLabel: string;
    runAction: string;
    running: string;
    apply: string;
    saveAsVersion: string;
    applySuccess: string;
    saveAsVersionSuccess: string;
    lastUpdated: string;
    historyTitle: string;
    historyEmpty: string;
    error: string;
    tokensLabel: string;
    costLabel: string;
    modelLabel: string;
    latencyLabel: string;
    linterHeading: string;
    linterDescription: string;
    linterOptions: { id: string; label: string }[];
    readabilityBeforeLabel: string;
    readabilityAfterLabel: string;
    readabilityDeltaLabel: string;
    adoptedLabel: string;
  };
  versions: {
    panelTitle: string;
    createVersion: string;
    createVersionHint: string;
    versionLabel: string;
    notesLabel: string;
    compareLabel: string;
    currentLabel: string;
    targetLabel: string;
    diffTitle: string;
    noDiff: string;
    metadataDiff: string;
    contentDiff: string;
    createdAt: string;
    restore: string;
    restoring: string;
    creating: string;
    delete: string;
    deleting: string;
    deleteConfirm: string;
  };
  signOut: {
    button: string;
  };
};

const dictionaries: Record<Locale, Dictionary> = {
  zh: {
    locale: 'zh',
    header: {
      myPrompts: '我的提示词',
      login: '登录',
      signOut: '退出登录',
      languageToggle: { label: '语言', zh: '中文', en: 'English' },
    },
    home: {
      tagline: '生成并管理你的提示词（MVP）',
      loginCardTitle: '登录',
      packsTitle: '预设提示词合集',
      packsSubtitle: '来自 OpenAI Academy 的行业 / 岗位提示词，点击查看并引用。',
      packCount: '{count} 个角色',
      viewButton: '查看',
      newPromptButton: '新建提示词',
    },
    auth: {
      emailPlaceholder: '邮箱',
      sendMagicLink: '发送魔法链接',
      sendingMagicLink: '发送中…',
      githubLogin: 'GitHub 登录',
      emailSent: '验证邮件已发送至 {email}，请查收。',
      errorGeneric: '发送邮件失败',
    },
    promptForm: {
      generatorTitle: '定制生成提示词',
      manualTitle: '手动录入提示词',
      manualDescription: '直接填写你已经准备好的提示词，保存后即可在仪表盘中查看和使用。',
      manualClear: '清空',
      modeToggleManual: '手动录入',
      modeToggleGenerator: '定制生成',
      goalLabel: '你的目标',
      goalPlaceholder: '例如：为 B2B SaaS 产品撰写冷邮件脚本',
      audienceLabel: '目标用户',
      audiencePlaceholder: '例如：采购经理 / 初级开发者',
      toneLabel: '语气',
      toneOptions: [
        { value: 'neutral', label: '中性' },
        { value: 'friendly', label: '友好' },
        { value: 'professional', label: '专业' },
        { value: 'concise', label: '简洁' },
      ],
      languageLabel: '语言',
      languageOptions: [
        { value: 'zh', label: '中文' },
        { value: 'en', label: 'English' },
        { value: 'ja', label: '日本語' },
      ],
      styleLabel: '风格/限制（可选）',
      stylePlaceholder: '例如：输出 JSON，包含字段 A/B/C；长度 < 200 字',
      generateButton: '定制生成',
      generatingButton: '生成中…',
      generateError: '生成失败',
      frameworkLabel: '提示框架 / 模板',
      frameworkPlaceholder: '例如：GROW / FAB 框架，或角色扮演说明',
      successLabel: '成功标准',
      successPlaceholder: '列出 2-3 条衡量是否达标的标准（每行一条）',
      constraintsLabel: '约束条件',
      constraintsPlaceholder: '语气、风格、禁止项等约束（每行一条）',
      variablesLabel: '变量 / 输入项',
      variablesPlaceholder: '列出需要提供的变量名与说明（每行一条）',
      inputFormatLabel: '输入格式',
      inputFormatPlaceholder: '描述输入格式或提供 JSON / Markdown 示例',
      modelPrefsLabel: '模型偏好',
      modelPrefsPlaceholder: '模型建议、温度、top_p 等参数（支持 JSON）',
      tokenBudgetLabel: 'Token 预算',
      tokenBudgetPlaceholder: '例如：800',
      bootstrapNotesLabel: '启动提示 / 初始化备注',
      bootstrapNotesPlaceholder: '运行前需要的注意事项或准备步骤（每行一条）',
      titleLabel: '标题',
      titlePlaceholder: '为你的提示词命名',
      contentLabel: '内容',
      contentPlaceholder: '提示词正文',
      categoryLabel: '分类',
      uncategorized: '未分类',
      categoryLabels: {
        Brainstorming: '头脑风暴',
        Writing: '文案写作',
        Analysis: '分析',
        Coding: '编码',
        Data: '数据',
        Marketing: '市场营销',
        Design: '设计',
        Learning: '学习',
        Productivity: '效率提升',
        Communication: '沟通',
      },
      saveButton: '保存',
    },
    dashboard: {
      title: '我的提示词',
      newButton: '新建提示词',
      emptyState: '还没有提示词，点击右上角新建。',
      viewDetails: '查看详情',
    },
    packs: {
      backHome: '← 返回首页',
      openChatGPT: '打开 ChatGPT',
      promptsTag: '{count} 条提示',
      importButton: '导入到我的提示库',
      tipsTitle: '写好提示词的 6 个要点',
      tips: [
        'K · 明确目标：开头写清任务、受众与成功判断。',
        'E · 补足背景：列出必须提供的上下文 / 变量。',
        'R · 指定角色：说明语气、专业度与协作方式。',
        'N · 列出约束：限制禁做事项、格式与时效。',
        'E · 给出示例：展示理想输出或评分标准。',
        'L · 控制预算：提示 Token 上限与检查要点。',
      ],
    },
    newPrompt: {
      title: '新建提示词',
      backHome: '← 返回首页',
    },
    deletePrompt: {
      confirm: '确认删除这个提示词吗？',
      delete: '删除',
      deleting: '删除中…',
      error: '删除失败',
    },
    copy: {
      copy: '复制',
      copied: '已复制',
      toast: '提示词已复制',
    },
    linter: {
      panelTitle: '提示健康检查',
      detail: '详细说明',
      copyAdvice: '复制建议',
      focusField: '定位填写区域',
      dismiss: '忽略',
      noIssues: '没有检测到问题，继续保持！',
      scoreLabel: '健康分',
      run: '运行诊断',
      running: '诊断中…',
    },
    eval: {
      toggle: '评测',
      panelTitle: '提示评测',
      suiteLabel: '评测套件 JSON',
      suitePlaceholder: '在此编辑评测用例...',
      run: '运行评测',
      running: '评测中…',
      resultSummary: '评测结果',
      passed: '通过',
      failed: '失败',
      lastExecuted: '执行时间',
      lastRunLabel: '最近评测',
      noResults: '尚未运行评测',
      parseError: '评测套件 JSON 解析失败，请检查格式。',
      copySuite: '复制套件',
      resetSuite: '重置套件',
      casePassed: '通过',
      caseFailed: '未通过',
      error: '请求失败',
      defaultSuiteTitle: '快速健检',
      defaultContainsHint: '内容需包含关键字',
      savedSuitesLabel: '已保存的评测套件',
      savedSuitesPlaceholder: '选择评测套件',
      refreshSuites: '刷新',
      saveSuite: '保存套件',
      saveSuiteAs: '另存为套件',
      deleteSuite: '删除套件',
      deleteSuiteConfirm: '确认删除该评测套件？',
      suiteNamePrompt: '请输入评测套件名称',
      suiteNameRequired: '需要提供评测套件名称',
      loadingSuites: '加载中…',
      savingSuite: '保存中…',
      deletingSuite: '删除中…',
      noSavedSuites: '还没有保存的评测套件',
    },
    bootstrap: {
      tabTitle: '提示自举',
      tabRewrite: '改写',
      tabCritique: '评审',
      tabEvals: '断言',
      rewriteTitle: '提示改写',
      rewriteDescription: '生成压缩版或稳健版草稿，并对比当前提示。',
      critiqueTitle: '自我评审',
      critiqueDescription: '自动汇总风险、缺失项与修复建议。',
      evalsTitle: '生成断言',
      evalsDescription: '根据提示内容生成最小评测断言集合。',
      instructionsLabel: '补充说明（可选）',
      instructionsPlaceholder: '想要微调的语气、长度、变量等…',
      focusLabel: '关注点（逗号分隔，可选）',
      focusPlaceholder: '结构, 变量, 风险…',
      minLabel: '最少用例数',
      maxLabel: '最多用例数',
      runAction: '执行自举',
      running: '生成中…',
      apply: '回填到当前提示',
      saveAsVersion: '另存为新版本',
      applySuccess: '自举结果已应用',
      saveAsVersionSuccess: '新版本已保存',
      lastUpdated: '最近生成',
      historyTitle: '历史记录',
      historyEmpty: '还没有自举记录，先运行一次试试。',
      error: '自举请求失败，请稍后重试。',
      tokensLabel: 'Tokens',
      costLabel: '成本',
      modelLabel: '模型',
      latencyLabel: '耗时',
      linterHeading: 'Linter 问题处理',
      linterDescription: '选择已经通过自举修复的问题，Linter 将自动忽略对应规则。',
      linterOptions: [
        { id: 'LN-101', label: 'LN-101 · 目标缺失' },
        { id: 'LN-102', label: 'LN-102 · 成功标准缺失' },
        { id: 'LN-103', label: 'LN-103 · 时效/来源提醒' },
        { id: 'LN-104', label: 'LN-104 · 输入格式说明' },
        { id: 'LN-105', label: 'LN-105 · AI 自称' },
        { id: 'LN-106', label: 'LN-106 · 提示过长' },
      ],
      readabilityBeforeLabel: '改写前可读性',
      readabilityAfterLabel: '改写后可读性',
      readabilityDeltaLabel: '可读性变化',
      adoptedLabel: '已采纳',
    },
    versions: {
      panelTitle: '版本管理',
      createVersion: '创建版本',
      createVersionHint: '可填写版本备注，默认按补丁号递增。',
      versionLabel: '版本号（可选）',
      notesLabel: '版本备注',
      compareLabel: '版本对比',
      currentLabel: '当前版本',
      targetLabel: '对比版本',
      diffTitle: '差异对比',
      noDiff: '暂无差异',
      metadataDiff: '结构字段差异',
      contentDiff: '正文差异',
      createdAt: '创建时间',
      restore: '恢复该版本',
      restoring: '恢复中…',
      creating: '创建中…',
      delete: '删除版本',
      deleting: '删除中…',
      deleteConfirm: '确认删除该版本？此操作不可撤销。',
    },
    signOut: {
      button: '退出登录',
    },
  },
  en: {
    locale: 'en',
    header: {
      myPrompts: 'My Prompts',
      login: 'Sign in',
      signOut: 'Sign out',
      languageToggle: { label: 'Language', zh: '中文', en: 'English' },
    },
    home: {
      tagline: 'Create and manage your prompts (MVP)',
      loginCardTitle: 'Sign in',
      packsTitle: 'Prompt Packs',
      packsSubtitle: 'Curated OpenAI Academy prompt packs by role or industry. Review and reuse instantly.',
      packCount: '{count} roles',
      viewButton: 'View',
      newPromptButton: 'New prompt',
    },
    auth: {
      emailPlaceholder: 'Email',
      sendMagicLink: 'Send magic link',
      sendingMagicLink: 'Sending…',
      githubLogin: 'Continue with GitHub',
      emailSent: 'Verification email sent to {email}. Please check your inbox.',
      errorGeneric: 'Failed to send email',
    },
    promptForm: {
      generatorTitle: 'Custom prompt generation',
      manualTitle: 'Add prompt manually',
      manualDescription: 'Paste or type an existing prompt and save it for quick access later.',
      manualClear: 'Clear',
      modeToggleManual: 'Manual entry',
      modeToggleGenerator: 'Custom generate',
      goalLabel: 'Your goal',
      goalPlaceholder: 'e.g., write a cold email script for a B2B SaaS product',
      audienceLabel: 'Audience',
      audiencePlaceholder: 'e.g., procurement manager / junior developer',
      toneLabel: 'Tone',
      toneOptions: [
        { value: 'neutral', label: 'Neutral' },
        { value: 'friendly', label: 'Friendly' },
        { value: 'professional', label: 'Professional' },
        { value: 'concise', label: 'Concise' },
      ],
      languageLabel: 'Language',
      languageOptions: [
        { value: 'zh', label: '中文' },
        { value: 'en', label: 'English' },
        { value: 'ja', label: '日本語' },
      ],
      styleLabel: 'Style / constraints (optional)',
      stylePlaceholder: 'Example: output JSON with fields A/B/C; length < 200 characters',
      generateButton: 'Custom generate',
      generatingButton: 'Generating…',
      generateError: 'Generation failed',
      frameworkLabel: 'Prompt framework / template',
      frameworkPlaceholder: 'e.g., GROW / FAB framework or role-play instructions',
      successLabel: 'Success criteria',
      successPlaceholder: 'List 2-3 measurable success criteria (one per line)',
      constraintsLabel: 'Constraints',
      constraintsPlaceholder: 'Tone, style, prohibited content, etc. (one per line)',
      variablesLabel: 'Variables / inputs',
      variablesPlaceholder: 'List required variables and descriptions (one per line)',
      inputFormatLabel: 'Input format',
      inputFormatPlaceholder: 'Describe how users should format inputs, or provide JSON / Markdown samples',
      modelPrefsLabel: 'Model preferences',
      modelPrefsPlaceholder: 'Preferred model, temperature, top_p, etc. (JSON supported)',
      tokenBudgetLabel: 'Token budget',
      tokenBudgetPlaceholder: 'e.g., 800',
      bootstrapNotesLabel: 'Bootstrap notes / setup',
      bootstrapNotesPlaceholder: 'Any prep instructions or caveats before running (one per line)',
      titleLabel: 'Title',
      titlePlaceholder: 'Give your prompt a name',
      contentLabel: 'Content',
      contentPlaceholder: 'Prompt content',
      categoryLabel: 'Category',
      uncategorized: 'Uncategorized',
      categoryLabels: undefined,
      saveButton: 'Save',
    },
    dashboard: {
      title: 'My Prompts',
      newButton: 'New prompt',
      emptyState: 'No prompts yet. Use the button above to create one.',
      viewDetails: 'View details',
    },
    packs: {
      backHome: '← Back to home',
      openChatGPT: 'Open in ChatGPT',
      promptsTag: '{count} prompts',
      importButton: 'Save to my library',
      tipsTitle: 'Six essentials for strong prompts',
      tips: [
        'K · Know the outcome: state the task, audience, and success signal up front.',
        'E · Establish context: list the minimum variables or background you must collect.',
        'R · Role & voice: describe the assistant persona, tone, and collaboration style.',
        'N · Note constraints: spell out forbidden actions, format rules, and freshness needs.',
        'E · Example anchored: show a mini example or scoring guide for the ideal output.',
        'L · Limit & inspect: set token budget, checks, and when to stop or escalate.',
      ],
    },
    newPrompt: {
      title: 'New prompt',
      backHome: '← Back to home',
    },
    deletePrompt: {
      confirm: 'Delete this prompt?',
      delete: 'Delete',
      deleting: 'Deleting…',
      error: 'Failed to delete',
    },
    copy: {
      copy: 'Copy',
      copied: 'Copied',
      toast: 'Prompt copied',
    },
    linter: {
      panelTitle: 'Prompt health check',
      detail: 'Details',
      copyAdvice: 'Copy hint',
      focusField: 'Jump to field',
      dismiss: 'Dismiss',
      noIssues: 'No issues detected. Nice work!',
      scoreLabel: 'Score',
      run: 'Run check',
      running: 'Checking…',
    },
    eval: {
      toggle: 'Evaluate',
      panelTitle: 'Prompt evaluation',
      suiteLabel: 'Evaluation suite JSON',
      suitePlaceholder: 'Edit evaluation cases here...',
      run: 'Run evaluation',
      running: 'Evaluating…',
      resultSummary: 'Evaluation results',
      passed: 'Passed',
      failed: 'Failed',
      lastExecuted: 'Executed at',
      lastRunLabel: 'Last evaluation',
      noResults: 'No evaluations run yet',
      parseError: 'Unable to parse evaluation JSON. Please check the format.',
      copySuite: 'Copy suite',
      resetSuite: 'Reset suite',
      casePassed: 'Passed',
      caseFailed: 'Failed',
      error: 'Request failed',
      defaultSuiteTitle: 'Quick health check',
      defaultContainsHint: 'Expected keyword',
      savedSuitesLabel: 'Saved suites',
      savedSuitesPlaceholder: 'Select a suite',
      refreshSuites: 'Refresh',
      saveSuite: 'Save suite',
      saveSuiteAs: 'Save as new',
      deleteSuite: 'Delete suite',
      deleteSuiteConfirm: 'Delete this evaluation suite?',
      suiteNamePrompt: 'Enter a name for the suite',
      suiteNameRequired: 'Suite name is required',
      loadingSuites: 'Loading…',
      savingSuite: 'Saving…',
      deletingSuite: 'Deleting…',
      noSavedSuites: 'No saved suites yet',
    },
    bootstrap: {
      tabTitle: 'Bootstrap',
      tabRewrite: 'Rewrite',
      tabCritique: 'Critique',
      tabEvals: 'Evals',
      rewriteTitle: 'Rewrite assistant',
      rewriteDescription: 'Generate compressed and robust variants to compare with the current prompt.',
      critiqueTitle: 'Self critique',
      critiqueDescription: 'Highlight risks, missing pieces, and actionable fixes.',
      evalsTitle: 'Generate assertions',
      evalsDescription: 'Produce a minimal evaluation suite tailored to this prompt.',
      instructionsLabel: 'Additional guidance (optional)',
      instructionsPlaceholder: 'Tone, length, variables to emphasize…',
      focusLabel: 'Focus areas (comma separated, optional)',
      focusPlaceholder: 'Structure, variables, guardrails…',
      minLabel: 'Minimum cases',
      maxLabel: 'Maximum cases',
      runAction: 'Run bootstrap',
      running: 'Generating…',
      apply: 'Apply to current prompt',
      saveAsVersion: 'Save as new version',
      applySuccess: 'Bootstrap changes applied',
      saveAsVersionSuccess: 'New version saved',
      lastUpdated: 'Last generated',
      historyTitle: 'History',
      historyEmpty: 'No bootstrap records yet. Run one to get started.',
      error: 'Bootstrap request failed. Please try again.',
      tokensLabel: 'Tokens',
      costLabel: 'Cost',
      modelLabel: 'Model',
      latencyLabel: 'Latency',
      linterHeading: 'Resolve lint findings',
      linterDescription: 'Mark the lint rules you resolved via bootstrap to silence them in the checklist.',
      linterOptions: [
        { id: 'LN-101', label: 'LN-101 · Missing goal' },
        { id: 'LN-102', label: 'LN-102 · Missing success criteria' },
        { id: 'LN-103', label: 'LN-103 · Missing freshness/source' },
        { id: 'LN-104', label: 'LN-104 · Missing input format' },
        { id: 'LN-105', label: 'LN-105 · AI self reference' },
        { id: 'LN-106', label: 'LN-106 · Prompt too long' },
      ],
      readabilityBeforeLabel: 'Readability (before)',
      readabilityAfterLabel: 'Readability (after)',
      readabilityDeltaLabel: 'Readability delta',
      adoptedLabel: 'Adopted',
    },
    versions: {
      panelTitle: 'Version history',
      createVersion: 'Create version',
      createVersionHint: 'Optional note, defaults to incrementing the patch number.',
      versionLabel: 'Version (optional)',
      notesLabel: 'Notes',
      compareLabel: 'Compare versions',
      currentLabel: 'Current',
      targetLabel: 'Compare to',
      diffTitle: 'Diff overview',
      noDiff: 'No differences detected',
      metadataDiff: 'Structured field diff',
      contentDiff: 'Content diff',
      createdAt: 'Created at',
      restore: 'Restore this version',
      restoring: 'Restoring…',
      creating: 'Creating…',
      delete: 'Delete version',
      deleting: 'Deleting…',
      deleteConfirm: 'Delete this version? This action cannot be undone.',
    },
    signOut: {
      button: 'Sign out',
    },
  },
};

export async function getDictionary(): Promise<Dictionary> {
  const cookieStore = cookies();
  const lang = cookieStore.get('lang')?.value as Locale | undefined;
  const locale: Locale = lang === 'en' ? 'en' : 'zh';
  return dictionaries[locale];
}
