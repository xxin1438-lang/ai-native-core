// ai-native init

const fs = require('fs');
const path = require('path');

const VALID_STACKS = ['react-spa', 'nextjs', 'vue', 'backend-go', 'backend-python', 'backend-java'];

function run(args) {
  const idx = args.indexOf('--stack');
  const stack = idx >= 0 ? args[idx + 1] : 'react-spa';

  if (!VALID_STACKS.includes(stack)) {
    console.error(`Invalid stack: ${stack}. Valid: ${VALID_STACKS.join(', ')}`);
    process.exit(1);
  }

  const root = process.cwd();
  const dirs = [
    '.ai-native/memory', '.ai-native/hooks', '.ai-native/reports',
    'docs/.ai-native/memory', 'docs/decisions'
  ];

  console.log(`[ai-native] Initializing with stack: ${stack}\n`);

  dirs.forEach(d => {
    const full = path.join(root, d);
    if (!fs.existsSync(full)) {
      fs.mkdirSync(full, { recursive: true });
      console.log(`  created: ${d}`);
    }
  });

  // Copy config
  const copyFile = (srcRel, dstRel, transform) => {
    const src = path.join(__dirname, '..', '..', srcRel);
    const dst = path.join(root, dstRel);
    if (fs.existsSync(dst)) { console.log(`  exists: ${dstRel} (skipped)`); return; }
    if (!fs.existsSync(src)) return;
    let content = fs.readFileSync(src, 'utf-8');
    if (transform) content = transform(content);
    fs.writeFileSync(dst, content);
    console.log(`  created: ${dstRel}`);
  };

  copyFile('config/ai-native.config.toml', '.ai-native/config.toml',
    c => c.replace(/adapter = "react-spa"/, `adapter = "${stack}"`));
  copyFile('config/acceptance.yaml', '.ai-native/acceptance.yaml');
  copyFile('config/memory-manifest.yaml', '.ai-native/memory/MANIFEST.yaml');

  const selfUpdate = path.join(root, 'docs', 'self-update.md');
  if (!fs.existsSync(selfUpdate)) {
    fs.writeFileSync(selfUpdate, '# AI Native 范式变更日志\n\n记录范式文件的系统性变更。\n每次范式变更检测后由 AI 追加。\n\n---\n');
    console.log('  created: docs/self-update.md');
  }

  console.log('\n[ai-native] Done. Next:');
  console.log('  1. Edit .ai-native/config.toml');
  console.log('  2. Run ai-native sync');
  console.log('  3. Run ai-native hooks install');
}

module.exports = { run };
