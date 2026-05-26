// ai-native oneshot — auto detect + init + sync

const fs = require('fs');
const path = require('path');
const { detect, parseChat } = require('../core/detect');
const { t } = require('../core/i18n');
const { execSync } = require('child_process');

function getProjectRoot() {
  try { return execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim(); }
  catch { return process.cwd(); }
}

function run(lang) {
  const root = getProjectRoot();
  console.log(`\n${t('welcome', lang)}\n`);

  // Check if already initialized
  const configExists = fs.existsSync(path.join(root, '.ai-native', 'config.toml'));
  if (configExists) {
    console.log(`${t('detecting', lang)} ${t('initExists', lang)}`);
    require('./sync').run(['--force'], lang);
    return;
  }

  // Auto-detect
  console.log(`${t('detecting', lang)}`);
  const detected = detect(root);

  if (detected) {
    console.log(`  ${t('detected', lang)}: ${detected.lang} | ${detected.framework || ''} | ${detected.build}`);
    console.log(`  ${t('suggest', lang)}: ${detected.stacks.join(', ')}\n`);

    const readline = require('readline');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(`${t('confirm', lang)} [Y/n]: `, ans => {
      rl.close();
      if (ans && ans.toLowerCase() !== 'y' && ans !== '') {
        console.log(t('cancelled', lang));
        process.exit(0);
      }
      doOneShot(detected.stacks, root, lang);
    });
  } else {
    // Chat mode fallback
    console.log(t('describeHint', lang));
    const readline = require('readline');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(`\n${t('describe', lang)}\n${t('chatExample', lang)}\n> `, input => {
      rl.close();
      if (!input.trim()) {
        // Fall back to interactive init
        require('./init').run(['--stack', 'react-spa'], lang);
        return;
      }
      const parsed = parseChat(input);
      if (parsed && parsed.stacks.length > 0) {
        console.log(`\n${t('detected', lang)}: ${parsed.stacks.join(', ')}`);
        const answers = { type: parsed.type, pm: parsed.pm || 'pnpm' };
        require('./init').doDirectInit(parsed.stacks, false, answers, lang);
      } else {
        console.log(`\n${lang === 'zh' ? '无法识别，进入步骤式配置' : 'Cannot parse, entering step-by-step'}\n`);
        require('./init').run([], lang);
      }
    });
  }
}

function doOneShot(stacks, root, lang) {
  require('./init').doDirectInit(stacks, false, {}, lang);
  console.log('');
  require('./sync').run(['--force'], lang);
  console.log(`\n${t('oneShotDone', lang)}`);
}

module.exports = { run };
