// ai-native sync

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { getProjectRoot, loadConfig, loadManifest } = require('../core/config');
const { loadAdapterRules } = require('../core/adapter');

function run(args, lang) {
  const isCheck = args.includes('--check');
  const isForce = args.includes('--force');
  const isDryRun = args.includes('--dry-run');
  const fi = args.indexOf('--factor');
  const targetFactor = fi >= 0 ? args[fi + 1] : null;

  const root = getProjectRoot();
  const config = loadConfig(root);
  const manifest = loadManifest(root);
  const memoryDir = path.join(root, '.ai-native', 'memory');
  const syncStatePath = path.join(memoryDir, 'SYNC-STATE.md');
  const watchPaths = config.paradigm?.watch_paths || [];

  // Get current hash
  let currentHash = 'unknown';
  try {
    currentHash = execSync(`git -C "${root}" log -1 --format=%H -- ${watchPaths.join(' ')}`, { encoding: 'utf-8' }).trim();
  } catch { currentHash = 'no-git'; }

  // Check if update needed
  if (!isForce && fs.existsSync(syncStatePath)) {
    const state = fs.readFileSync(syncStatePath, 'utf-8');
    const m = state.match(/Git hash.*?([0-9a-f]{10,40})/i);
    if (m && m[1].startsWith(currentHash.substring(0, 10))) {
      console.log(`[ai-native] 记忆已是最新 (${currentHash.substring(0, 8)})`);
      if (isCheck) process.exit(0);
      return;
    }
  }

  if (isCheck) {
    console.log(`[ai-native] 需要更新 (${currentHash.substring(0, 8)})`);
    process.exit(1);
  }

  if (isDryRun) {
    const factors = targetFactor ? manifest.factors.filter(f => f.name === targetFactor) : manifest.factors;
    console.log(`[ai-native] DRY RUN — ${factors.length} factors:`);
    factors.forEach(f => console.log(`  - ${f.name}`));
    return;
  }

  // Load rules: custom > adapter builtin
  const adapters = Array.isArray(config.stack?.adapter)
    ? config.stack.adapter
    : [config.stack?.adapter || 'react-spa'];

  let builtin = mergeAdapterRules(adapters);

  // Check for project-level custom rules (overrides adapter)
  const customPath = config.distiller?.custom_rules;
  if (customPath) {
    const fullCustomPath = path.join(root, customPath);
    if (fs.existsSync(fullCustomPath)) {
      const customRules = loadAdapterRules(fullCustomPath);
      if (Object.keys(customRules).length > 0) {
        console.log(`[ai-native] Using custom rules: ${customPath}`);
        builtin = customRules; // Override entirely
      }
    }
  }

  // Process
  const factors = targetFactor ? manifest.factors.filter(f => f.name === targetFactor) : manifest.factors;
  if (!fs.existsSync(memoryDir)) fs.mkdirSync(memoryDir, { recursive: true });

  const synced = [];

  for (const factor of factors) {
    const builtinContent = builtin[factor.name] || '';
    const content = buildFactor(factor, builtinContent, currentHash);
    const out = path.join(memoryDir, factor.output_file);
    fs.writeFileSync(out, content);
    console.log(`[ai-native] ${factor.name} → ${factor.output_file}`);
    synced.push(factor.name);
  }

  // SYNC-STATE
  const now = new Date().toISOString();
  fs.writeFileSync(syncStatePath, `---
name: sync-state
description: 资产记忆同步元数据
metadata:
  type: reference
---

# Asset Memory Sync State

- **Synced at**: ${now}
- **Git hash**: ${currentHash}
- **Monitored paths**: ${watchPaths.join(', ')}
- **Factors synced**: ${synced.join(', ')}
`);

  // Copy-back
  const tmplDir = path.join(root, 'docs', '.ai-native', 'memory');
  if (!fs.existsSync(tmplDir)) fs.mkdirSync(tmplDir, { recursive: true });
  for (const f of factors) {
    const s = path.join(memoryDir, f.output_file);
    const d = path.join(tmplDir, f.output_file);
    if (fs.existsSync(s)) fs.copyFileSync(s, d);
  }
  fs.copyFileSync(syncStatePath, path.join(tmplDir, 'SYNC-STATE.md'));

  console.log(`[ai-native] Done. hash: ${currentHash.substring(0, 8)}`);
  showFactorSummary(memoryDir, lang);
}

function buildFactor(factor, builtinContent, hash) {
  const now = new Date().toISOString();
  const title = factor.output_file.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return `---
name: ${factor.name}
description: ${factor.description}
metadata:
  type: project
  synced-from: ${hash}
  synced-at: ${now}
  source-files: []
---

# ${title}
${builtinContent || '\n- (蒸馏引擎将在完整实现中从源文件提取因子)\n'}
`;
}

function mergeAdapterRules(adapters) {
  const merged = {};
  for (const name of adapters) {
    const rules = loadAdapterRules(name);
    for (const [key, content] of Object.entries(rules)) {
      if (content) {
        merged[key] = (merged[key] || '') + '\n' + content;
      }
    }
  }
  return merged;
}

function showFactorSummary(memoryDir, lang) {
  const t = (k) => require('../core/i18n').t(k, lang || 'zh');
  const zh = (lang || 'zh') === 'zh';

  console.log(`\n${zh ? '━━━ AI 现在知道这些约束 ━━━' : '━━━ AI now knows ━━━'}`);
  const files = fs.readdirSync(memoryDir).filter(f => f.endsWith('.md') && f !== 'SYNC-STATE.md');
  files.forEach(f => {
    const content = fs.readFileSync(path.join(memoryDir, f), 'utf-8');
    const items = content.split('\n').filter(l => l.startsWith('- '));
    if (items.length > 0) {
      console.log(`\n${zh ? '✓' : '✓'} ${f.replace('.md', '')} (${items.length} ${zh ? '条' : 'items'})`);
      items.slice(0, 3).forEach(l => console.log(`  • ${l.replace('- ', '')}`));
      if (items.length > 3) console.log(`  ${zh ? '…' : '…'} ${zh ? `还有 ${items.length - 3} 条` : `+${items.length - 3} more`}`);
    }
  });
  console.log(`\n→ ${zh ? '下个 AI 会话自动生效。ai-native show <因子> 查看详情' : 'Effective next session. ai-native show <factor> for details'}\n`);
}

module.exports = { run };
