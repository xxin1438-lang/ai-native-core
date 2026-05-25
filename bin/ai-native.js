#!/usr/bin/env node

// ai-native — AI Native Core CLI

const commands = ['init', 'sync', 'accept', 'hooks'];
const args = process.argv.slice(2);
const command = args[0];

if (!command || command === '--help' || command === '-h') {
  console.log(`
ai-native — AI Native Core CLI

Usage:
  ai-native <command> [options]

Commands:
  init    --stack <adapter>    初始化 AI Native 到当前项目
  sync    [--check|--force|--dry-run|--factor <name>]
                               蒸馏资产记忆因子
  accept  [--ci]               运行验收管道
  hooks   install|status       管理自迭代 hooks

Examples:
  ai-native init --stack react-spa
  ai-native sync --check
  ai-native accept --ci

Version: ${require('../package.json').version}
`);
  process.exit(0);
}

if (!commands.includes(command)) {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}

try {
  require(`../src/commands/${command}`).run(args.slice(1));
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}
