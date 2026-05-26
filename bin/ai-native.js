#!/usr/bin/env node

// ai-native — AI Native Core CLI

const commands = ['init', 'sync', 'accept', 'hooks', 'show'];
const args = process.argv.slice(2);
const command = args[0];
const { getLang, t } = require('../src/core/i18n');
const lang = getLang(args);

// --version / -v
if (command === '--version' || command === '-v') {
  console.log(require('../package.json').version);
  process.exit(0);
}

// --help / -h
if (!command || command === '--help' || command === '-h') {
  console.log(`
ai-native — AI Native Core CLI

Usage:
  ai-native                ${lang === 'zh' ? '一键启动（自动检测+初始化+蒸馏）' : 'One-shot (auto-detect + init + sync)'}
  ai-native --lang en      ${lang === 'zh' ? '切换英文' : 'Switch to Chinese'}
  ai-native <command> [options]

Commands:
  init    ${lang === 'zh' ? '初始化 AI Native' : 'Initialize AI Native'}
  sync    ${lang === 'zh' ? '蒸馏资产记忆因子' : 'Sync asset memory factors'}
  accept  ${lang === 'zh' ? '运行验收管道' : 'Run acceptance pipeline'}
  hooks   ${lang === 'zh' ? '管理自迭代 hooks' : 'Manage hooks'}
  show    ${lang === 'zh' ? '查看记忆因子' : 'Show memory factors'}

Examples:
  ai-native                          ${lang === 'zh' ? '# 一键启动' : '# One-shot'}
  ai-native init --stack backend-java
  ai-native sync --check
  ai-native show forbidden-patterns
  ai-native --lang en                ${lang === 'zh' ? '# 英文界面' : '# Chinese UI'}

Version: ${require('../package.json').version}
`);
  process.exit(0);
}

// route to command
if (command === 'show') {
  require('../src/commands/show').run(args.slice(1));
} else if (commands.includes(command)) {
  require(`../src/commands/${command}`).run(args.slice(1), lang);
} else {
  // One-shot mode: no recognized command → auto detect + init + sync
  require('../src/commands/oneshot').run(lang);
}
