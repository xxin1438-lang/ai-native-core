// ai-native show — display memory factor content

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getProjectRoot() {
  try { return execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim(); }
  catch { return process.cwd(); }
}

function run(args, lang) {
  const root = getProjectRoot();
  const memoryDir = path.join(root, '.ai-native', 'memory');
  const name = args[0];

  if (!name) {
    // List all factors
    if (!fs.existsSync(memoryDir)) {
      console.log(lang === 'zh' ? '记忆目录不存在。请先运行 ai-native sync' : 'Memory not found. Run ai-native sync first.');
      process.exit(1);
    }
    const files = fs.readdirSync(memoryDir).filter(f => f.endsWith('.md') && f !== 'SYNC-STATE.md');
    console.log(lang === 'zh' ? '\n记忆因子:' : '\nMemory factors:');
    files.forEach(f => {
      const content = fs.readFileSync(path.join(memoryDir, f), 'utf-8');
      const lines = content.split('\n').filter(l => l.startsWith('- '));
      console.log(`  ${f.replace('.md', '')} (${lines.length} ${lang === 'zh' ? '条' : 'items'})`);
    });
    console.log(`\n${lang === 'zh' ? '查看详情: ai-native show <因子名>' : 'Details: ai-native show <name>'}`);
    return;
  }

  // Show specific factor
  const fileName = name.endsWith('.md') ? name : `${name}.md`;
  const filePath = path.join(memoryDir, fileName);

  if (!fs.existsSync(filePath)) {
    console.log(`${lang === 'zh' ? '因子不存在' : 'Factor not found'}: ${name}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(l => l.startsWith('- '));

  console.log(`\n${fileName.replace('.md', '')} (${lines.length} ${lang === 'zh' ? '条' : 'items'}):`);
  lines.forEach((l, i) => console.log(`  ${i + 1}. ${l.replace('- ', '')}`));
  console.log('');
}

module.exports = { run };
