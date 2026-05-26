// ai-native i18n

const strings = {
  zh: {
    welcome: '✨ AI Native Core',
    detecting: '正在检测项目...',
    detected: '检测到',
    suggest: '建议适配器',
    confirm: '确认?',
    describe: '请用一两句话描述你的项目（或按回车跳过）：',
    chatExample: '例: Java 后端，Spring Boot 3，Maven，PostgreSQL',
    initDone: '初始化完成',
    syncDone: '蒸馏完成',
    aiKnows: 'AI 现在知道这些约束，下个会话自动生效',
    oneShotDone: '全部完成！AI 已就绪。',
    factorSummary: '条',
    projectType: '项目类型',
    frontendFramework: '前端框架',
    backendLanguage: '后端语言',
    packageManager: '包管理器',
    preview: '预览',
    cancelled: '已取消',
    describeHint: '描述你的项目，或按回车进行步骤式配置',
  },
  en: {
    welcome: '✨ AI Native Core',
    detecting: 'Detecting project...',
    detected: 'Detected',
    suggest: 'Suggested adapter',
    confirm: 'Confirm?',
    describe: 'Describe your project (or press Enter to skip):',
    chatExample: 'e.g. Java backend, Spring Boot 3, Maven, PostgreSQL',
    initDone: 'Initialization complete',
    syncDone: 'Sync complete',
    aiKnows: 'AI now knows these constraints. Effective next session.',
    oneShotDone: 'All done! AI is ready.',
    factorSummary: 'items',
    projectType: 'Project type',
    frontendFramework: 'Frontend framework',
    backendLanguage: 'Backend language',
    packageManager: 'Package manager',
    preview: 'Preview',
    cancelled: 'Cancelled',
    describeHint: 'Describe in natural language, or press Enter for step-by-step',
  }
};

function getLang(args) {
  const idx = args.indexOf('--lang');
  if (idx >= 0) return args[idx + 1] === 'en' ? 'en' : 'zh';
  if (process.env.LANG?.startsWith('zh')) return 'zh';
  return 'zh';
}

function t(key, lang) {
  return strings[lang]?.[key] || strings.zh[key] || key;
}

module.exports = { getLang, t };
