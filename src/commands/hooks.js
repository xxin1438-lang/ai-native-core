// ai-native hooks

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { getProjectRoot } = require('../core/config');

function run(args) {
  const sub = args[0];
  if (sub === 'status') return statusCmd();
  if (sub === 'install') return installCmd();
  console.log('Usage: ai-native hooks [install|status]');
  process.exit(1);
}

function statusCmd() {
  const root = getProjectRoot();
  const hooksDir = path.join(root, '.ai-native', 'hooks');
  console.log('[ai-native] Hooks status:\n');
  ['studybook-reminder.sh', 'paradigm-change-monitor.sh'].forEach(s => {
    const p = path.join(hooksDir, s);
    const ok = fs.existsSync(p);
    console.log(`  ${ok ? '✓' : '✗'} ${s}`);
    if (ok) {
      try { execSync(`bash -n "${p}"`, { encoding: 'utf-8' }); console.log('    syntax: OK'); }
      catch (e) { console.log(`    syntax: ERROR`); }
    }
  });
}

function installCmd() {
  const root = getProjectRoot();
  const hooksDir = path.join(root, '.ai-native', 'hooks');
  if (!fs.existsSync(hooksDir)) fs.mkdirSync(hooksDir, { recursive: true });

  const scripts = {
    'studybook-reminder.sh': `#!/usr/bin/env bash
REPO="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
MARKER="/tmp/.ai-native-last-reminder"
COOLDOWN=1200
if [ -f "$MARKER" ]; then
  last=$(cat "$MARKER" 2>/dev/null || echo 0)
  now=$(date +%s)
  if (( now - last < COOLDOWN )); then exit 0; fi
fi
if ! git -C "$REPO" status --porcelain 2>/dev/null | grep -q .; then exit 0; fi
date +%s > "$MARKER"
echo ""
echo "[AI Native] 本次话题需要复盘。回复 y 由 AI 完成，n 跳过（下次合并）"
echo ""
`,
    'paradigm-change-monitor.sh': `#!/usr/bin/env bash
REPO="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
INPUT=$(cat)
[ -z "$INPUT" ] && exit 0
CMD=$(echo "$INPUT" | python3 -c "import sys,json;print(json.load(sys.stdin).get('tool_input',{}).get('command',''))" 2>/dev/null)
echo "$CMD" | grep -qE 'git\\s+(-C\\s+\\S+\\s+)?commit' || exit 0
CHANGED=$(git -C "$REPO" log -1 --name-only --format="" 2>/dev/null)
[ -z "$CHANGED" ] && exit 0
MATCHED=""
while IFS= read -r f; do
  for p in "docs/architecture/" "design/" "docs/decisions/" ".github/workflows/"; do
    [[ "$f" == "$p"* ]] && MATCHED="$MATCHED\\n  - $f" && break
  done
done <<< "$CHANGED"
[ -z "$MATCHED" ] && exit 0
echo ""
echo "[AI Native 范式变更] 本次 commit 包含范式文件更新"
echo -e "  变更文件：$MATCHED"
echo "  建议：运行 ai-native sync"
echo ""
`
  };

  for (const [name, content] of Object.entries(scripts)) {
    const p = path.join(hooksDir, name);
    fs.writeFileSync(p, content);
    fs.chmodSync(p, 0o755);
    console.log(`  ✓ ${name}`);
  }
  console.log('[ai-native] Hooks installed');
}

module.exports = { run };
