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

  // Warn if source docs are missing
  for (const factor of factors) {
    const hasBuiltin = builtin[factor.name];
    if (!hasBuiltin) {
      let found = false;
      for (const glob of (factor.source_globs || [])) {
        try {
          const base = glob.replace(/\*\*\/\*\.\w+$/, '').replace(/\/$/, '');
          const checkPath = path.join(root, base);
          if (fs.existsSync(checkPath) && fs.readdirSync(checkPath).length > 0) {
            found = true; break;
          }
        } catch {}
      }
      if (!found) {
        console.log(`[ai-native] ⚠ ${factor.name}: no source files matched (source_globs: ${(factor.source_globs || []).join(', ')})`);
      }
    }
  }

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

  // Generate AI tool configs
  generateAIConfigs(root, config, manifest);

  // Install skill to project
  installSkill(root);

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

function generateAIConfigs(root, config, manifest) {
  const memoryRefs = manifest.factors
    .map(f => `@memory/${f.output_file}`)
    .join('\n');

  const engines = config.ai_tools?.engines || ['claude'];

  const templates = {
    claude: { file: '.claude/CLAUDE.md', content: `# Project Context\n\n## 资产记忆因子\n\n以下文件由 \`ai-native sync\` 生成。\n\n${memoryRefs}\n` },
    cursor: { file: '.cursor/rules/ai-native.md', content: `# AI Native Memory Factors\n\nAlways apply these constraints:\n\n${memoryRefs}\n` },
    copilot: { file: '.github/copilot-instructions.md', content: `## Project Constraints\n\nRead before generating code:\n\n${memoryRefs}\n` },
    deepseek: { file: '.deepseek/rules/ai-native.md', content: `# AI Native Memory Factors\n\nAlways apply these constraints when generating code:\n\n${memoryRefs}\n` },
    codex: { file: '.codex/rules/ai-native.md', content: `# AI Native Memory Factors\n\nAlways apply these constraints:\n\n${memoryRefs}\n` },
  };

  const allEngines = engines.includes('all') ? Object.keys(templates) : engines;
  for (const engine of allEngines) {
    const t = templates[engine];
    if (!t) continue;
    const dir = path.dirname(path.join(root, t.file));
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(root, t.file), t.content);
  }
}

function installSkill(root) {
  const skillSrc = path.join(__dirname, '..', '..', 'skills', 'ai-native', 'SKILL.md');
  if (!fs.existsSync(skillSrc)) return;

  // Install to Claude, DeepSeek, Codex skill dirs
  const targets = ['.claude', '.deepseek', '.codex'];
  targets.forEach(dir => {
    const dstDir = path.join(root, dir, 'skills', 'ai-native');
    if (!fs.existsSync(dstDir)) fs.mkdirSync(dstDir, { recursive: true });
    fs.copyFileSync(skillSrc, path.join(dstDir, 'SKILL.md'));
  });
}

function showFactorSummary(memoryDir, lang) {
  const zh = (lang || 'zh') === 'zh';

  console.log(`\n${zh ? '━━━ AI 现在知道这些约束 ━━━' : '━━━ AI now knows ━━━'}`);
  const files = fs.readdirSync(memoryDir).filter(f => f.endsWith('.md') && f !== 'SYNC-STATE.md');

  let emptyCount = 0, thinCount = 0;
  const allItems = [];

  files.forEach(f => {
    const content = fs.readFileSync(path.join(memoryDir, f), 'utf-8');
    const items = content.split('\n').filter(l => l.startsWith('- '));
    const name = f.replace('.md', '');

    if (items.length === 0) {
      console.log(`\n  ⚠ ${name}: ${zh ? '空' : 'EMPTY'} — ${zh ? '源文档可能不存在' : 'source docs may be missing'}`);
      emptyCount++;
    } else if (items.length === 1 && items[0].includes('蒸馏引擎将在完整实现中')) {
      console.log(`\n  ⚠ ${name}: ${zh ? '占位符' : 'PLACEHOLDER'} — ${zh ? '源文档为空，仅有内置规则' : 'only built-in rules'}`);
      thinCount++;
    } else {
      const icon = items.length >= 5 ? '✓' : (items.length >= 3 ? '○' : '△');
      console.log(`\n  ${icon} ${name} (${items.length} ${zh ? '条' : 'items'})`);
      items.slice(0, 3).forEach(l => console.log(`    • ${l.replace('- ', '')}`));
      if (items.length > 3) console.log(`    ${zh ? '…' : '…'} +${items.length - 3}`);
      allItems.push(...items);
    }
  });

  // Quality checks
  if (emptyCount > 0) {
    console.log(`\n  ⚠ ${emptyCount} ${zh ? '个因子为空。请确认 source_globs 配置正确，项目文档存在。' : 'factors empty. Check source_globs and project docs.'}`);
  }
  if (thinCount > 0) {
    console.log(`  💡 ${zh ? '提示：运行 /ai-native sync 让 AI 从项目文档中真正蒸馏约束。' : 'Tip: run /ai-native sync in chat for real AI distillation.'}`);
  }

  // Duplicate check
  if (allItems.length > 10) {
    const seen = new Set();
    const dupes = allItems.filter(l => seen.has(l) || !seen.add(l));
    if (dupes.length > 0) {
      console.log(`\n  ⚠ ${dupes.length} ${zh ? '条约束在多个因子中重复' : 'items duplicated across factors'}`);
    }
  }

  console.log(`\n→ ${zh ? '下个 AI 会话自动生效。ai-native show <因子> 查看详情' : 'Effective next session. ai-native show <factor> for details'}\n`);
}

module.exports = { run };
