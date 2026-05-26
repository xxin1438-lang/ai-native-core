// ai-native init — interactive mode when no --stack provided

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

function getProjectRoot() {
  try { return execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim(); }
  catch { return process.cwd(); }
}

const VALID_STACKS = ['react-spa', 'nextjs', 'vue', 'backend-go', 'backend-python', 'backend-java'];

function run(args) {
  const idx = args.indexOf('--stack');
  const isForce = args.includes('--force');

  if (idx >= 0) {
    const stackArg = args[idx + 1];
    const stacks = stackArg.split(',').map(s => s.trim());
    for (const s of stacks) {
      if (!VALID_STACKS.includes(s)) {
        console.error(`Invalid: ${s}. Valid: ${VALID_STACKS.join(', ')}`);
        process.exit(1);
      }
    }
    const answers = inferFromStacks(stacks);
    doInit(stacks, isForce, answers);
  } else {
    interactiveInit(isForce);
  }
}

function interactiveInit(isForce) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answers = {};
  const ask = (q, d) => new Promise(r => rl.question(`${q} [${d}]: `, a => r(a.trim() || d)));

  (async () => {
    console.log('\n✨ AI Native Core — 交互式初始化\n');

    const type = await ask('项目类型 (frontend/backend/fullstack/cli)', 'frontend');
    answers.type = type;
    const stacks = [];

    if (type === 'frontend' || type === 'fullstack') {
      const fw = await ask('前端框架 (react/vue/nextjs)', 'react');
      stacks.push({ react: 'react-spa', vue: 'vue', nextjs: 'nextjs' }[fw] || 'react-spa');
      answers.css = await ask('CSS (tailwind-v4/tailwind-v3/css-modules/none)', 'tailwind-v4');
      answers.ui = await ask('UI 组件库 (shadcn/radix/mui/antd/none)', 'shadcn');
      answers.ts = await ask('TypeScript? (yes/no)', 'yes');
    }
    if (type === 'backend' || type === 'fullstack') {
      const lang = await ask('后端语言 (java/go/python)', 'java');
      stacks.push({ java: 'backend-java', go: 'backend-go', python: 'backend-python' }[lang] || 'backend-java');
      if (type === 'backend') answers.ts = await ask('TypeScript? (yes/no)', 'no');
    }
    if (type === 'cli') answers.ts = await ask('TypeScript? (yes/no)', 'yes');

    if (type === 'backend' || type === 'fullstack') {
      const lang = stacks.find(s => s.startsWith('backend-'))?.replace('backend-', '') || 'java';
      const pmOpts = { java: 'maven/gradle', go: 'go mod', python: 'pip/poetry' };
      const pmDefault = { java: 'maven', go: 'go mod', python: 'pip' };
      if (type === 'fullstack') {
        answers.pm = await ask(`包管理器 (${pmOpts[lang] || 'maven'})`, pmDefault[lang] || 'maven');
      } else {
        answers.pm = pmDefault[lang] || 'maven';
      }
    }
    if (!answers.pm) {
      answers.pm = await ask('包管理器 (pnpm/npm/yarn)', 'pnpm');
    }

    if (type === 'backend') {
      const lang = stacks[0].replace('backend-', '');
      answers.test = { java: 'junit', go: 'go-test', python: 'pytest' }[lang];
    } else {
      answers.test = await ask('测试框架 (vitest/jest/junit)', 'vitest');
    }

    rl.close();

    console.log(`\n📋 预览:`);
    console.log(`  类型: ${type}  |  适配器: ${stacks.join(', ')}`);
    console.log(`  包管理: ${answers.pm}  |  测试: ${answers.test}  |  TS: ${answers.ts}`);
    if (answers.css) console.log(`  CSS: ${answers.css}  |  UI: ${answers.ui}`);

    const rl2 = readline.createInterface({ input: process.stdin, output: process.stdout });
    const confirm = await new Promise(r => rl2.question('\n确认? (yes/no) [yes]: ', a => { rl2.close(); r(a.trim() || 'yes'); }));
    if (confirm !== 'yes' && confirm !== 'y') { console.log('已取消'); process.exit(0); }

    doInit(stacks, isForce, answers);
  })();
}

function doInit(stacks, isForce, answers = {}) {
  const root = getProjectRoot();
  const dirs = ['.ai-native/memory', '.ai-native/hooks', '.ai-native/reports', 'docs/.ai-native/memory', 'docs/decisions'];

  console.log(`\n[ai-native] Initializing...\n`);
  dirs.forEach(d => {
    const full = path.join(root, d);
    if (!fs.existsSync(full)) { fs.mkdirSync(full, { recursive: true }); console.log(`  created: ${d}`); }
  });

  const copyFile = (srcRel, dstRel, transform) => {
    const src = path.join(__dirname, '..', '..', srcRel);
    const dst = path.join(root, dstRel);
    if (fs.existsSync(dst) && !isForce) { console.log(`  exists: ${dstRel} (skipped)`); return; }
    if (!fs.existsSync(src)) return;
    let c = fs.readFileSync(src, 'utf-8');
    if (transform) c = transform(c);
    fs.writeFileSync(dst, c);
    console.log(`  created: ${dstRel}`);
  };

  copyFile('config/ai-native.config.toml', '.ai-native/config.toml', c => {
    c = c.replace(/type = "frontend"/, `type = "${answers.type || 'frontend'}"`);
    if (answers.type) c = c.replace(/name = "my-project"/, `name = "${path.basename(root)}"`);
    c = c.replace(/adapter = "react-spa"/, stacks.length > 1
      ? `adapter = [${stacks.map(s => `"${s}"`).join(', ')}]`
      : `adapter = "${stacks[0]}"`);
    if (answers.pm) c = c.replace(/package_manager = "pnpm"/, `package_manager = "${answers.pm}"`);
    if (answers.css) c = c.replace(/css = "tailwind-v4"/, `css = "${answers.css}"`);
    if (answers.ui) c = c.replace(/ui_library = "shadcn"/, `ui_library = "${answers.ui}"`);
    if (answers.test) c = c.replace(/test_framework = "vitest"/, `test_framework = "${answers.test}"`);
    if (answers.ts !== undefined) c = c.replace(/typescript = true/, `typescript = ${answers.ts === 'yes'}`);
    return c;
  });

  copyFile('config/acceptance.yaml', '.ai-native/acceptance.yaml');
  copyFile('config/memory-manifest.yaml', '.ai-native/memory/MANIFEST.yaml');

  const su = path.join(root, 'docs', 'self-update.md');
  if (!fs.existsSync(su)) fs.writeFileSync(su, '# AI Native 范式变更日志\n\n记录范式文件的系统性变更。\n\n---\n');

  console.log('\n[ai-native] Done. Next:');
  console.log('  1. ai-native sync');
  console.log('  2. ai-native hooks install');
  console.log('  3. ai-native accept');
}

function inferFromStacks(stacks) {
  const answers = { pm: 'pnpm' };
  const frontendStacks = ['react-spa', 'nextjs', 'vue'];
  const backendStacks = ['backend-java', 'backend-go', 'backend-python'];
  const hasFrontend = stacks.some(s => frontendStacks.includes(s));
  const hasBackend = stacks.some(s => backendStacks.includes(s));

  if (hasFrontend && hasBackend) answers.type = 'fullstack';
  else if (hasBackend) answers.type = 'backend';
  else answers.type = 'frontend';

  if (hasBackend) {
    const lang = stacks.find(s => s.startsWith('backend-')).replace('backend-', '');
    answers.test = { java: 'junit', go: 'go-test', python: 'pytest' }[lang] || 'junit';
    answers.pm = { java: 'maven', go: 'go mod', python: 'pip' }[lang] || 'maven';
  } else {
    answers.test = 'vitest';
    answers.pm = 'pnpm';
  }

  if (hasFrontend) {
    answers.css = 'tailwind-v4';
    answers.ui = 'shadcn';
    answers.ts = 'yes';
  } else {
    answers.ts = 'no';
  }

  return answers;
}

function doDirectInit(stacks, isForce, answers, lang) {
  doInit(stacks, isForce, answers);
}
module.exports = { run, doDirectInit };
