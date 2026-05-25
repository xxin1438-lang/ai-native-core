# 验收门禁规范

本文档定义 `ai-native accept` 的 fail gate、禁止通过条件、成员分流和报告格式。

---

## 一、Fail Gate 模型

验收管道不是"全通过才算成功"的简单模型。每个 check 有三种结果：

| 结果 | 含义 | 行为 |
|------|------|------|
| `pass` | 通过 | 继续下一个 check |
| `fail` | 失败（阻塞性） | **中断验收**，记录失败原因，后续 phase 不执行 |
| `warn` | 警告（非阻塞） | 继续执行，但报告中标记为 warning |

### Fail 触发条件

以下任一条件触发 `fail`（中断验收）：
- exec 类型 check 的 exit code ≠ 0
- expect.pattern 不匹配
- file-exists check 的任一文件不存在
- visual check 失败（且 `optional` 不为 true）

以下条件触发 `warn`（继续）：
- visual check 失败且 `optional: true`
- exec check 通过但 stdout 有异常迹象

---

## 二、禁止通过条件（Fail Gate）

验收不得标记成功，如果出现以下任一情况：

### 环境类
- Node.js 版本不满足配置的最低要求
- 包管理器不可用
- Git 不可用

### 记忆类
- `.ai-native/memory/SYNC-STATE.md` 不存在（资产记忆未初始化）
- 任一记忆因子文件缺失
- SYNC-STATE.md 不含有效 git hash
- `.claude/CLAUDE.md`（或对应 AI 工具入口文件）缺失或 @ 引用不完整
- 记忆文件行数远超标准（>50 行）且含原文粘贴迹象

### 代码质量类
- lint 失败
- typecheck 失败
- test 失败

### E2E 类
- 轨道 1（代码行为）E2E 失败
- 轨道 2（视觉走查）未完成且 visual check 为必选

### 构建类
- build 失败

### Hooks 类
- `.ai-native/hooks/` 脚本缺失
- AI 工具 hook 配置未激活
- `docs/self-update.md` 缺失

---

## 三、成员分流

根据本机状态选择不同验收路径：

| 状态 | 判断条件 | 起始 Phase |
|------|---------|-----------|
| **全新成员** | `.ai-native/memory/` 不存在 | Phase 0 → 1 → 2 → 3 → 4 |
| **已配置成员** | `.ai-native/memory/SYNC-STATE.md` 存在，hash 最新 | Phase 2 → 3 → 4 |
| **仅更新资产** | `.ai-native/memory/` 存在但 hash 过期 | 运行 `ai-native sync` → Phase 2 |

### 检测命令

```bash
# 判断成员状态
if [ ! -d ".ai-native/memory" ]; then
  echo "NEW"          # 全新成员
elif ! grep -q "Git hash" .ai-native/memory/SYNC-STATE.md; then
  echo "NEW"          # 视为全新
else
  CURRENT=$(git log -1 --format=%H)
  STORED=$(grep "Git hash" .ai-native/memory/SYNC-STATE.md | awk '{print $NF}')
  if [ "$CURRENT" = "$STORED" ]; then
    echo "CONFIGURED" # 已配置
  else
    echo "STALE"      # 需更新资产
  fi
fi
```

---

## 四、资源读取顺序验证

AI Agent 在 onboarding 时必须按特定顺序读取资源，以确保上下文建立正确。顺序由 config.toml 的 `onboarding.read_order` 定义：

```toml
[onboarding]
read_order = [
  ".ai-native/config.toml",
  "docs/architecture/",
  "design/",
  "README.md",
]
```

验收时检查：
- AI 是否按顺序读取了这些资源
- 如使用 openspec 等 SDD 工具，是否在 read_order 之前读取了其配置

---

## 五、Onboarding Report 格式

`ai-native accept` 输出结构化报告，格式如下：

```markdown
# AI Native Onboarding Report

**Date**: 2026-05-25T18:00:00+08:00
**Project**: my-project
**Status**: PASS / FAIL

## Summary

| Phase | Status | Checks Passed | Checks Failed |
|-------|--------|--------------|---------------|
| environment | PASS | 5/5 | 0 |
| code-quality | PASS | 3/3 | 0 |
| e2e | PASS | 2/2 | 0 |
| build | PASS | 1/1 | 0 |

## Member Status

- Type: NEW / CONFIGURED / STALE
- Started from phase: X

## Environment

- Node.js: v20.11.0 ✓
- pnpm: 9.1.0 ✓
- Git: 2.44.0 ✓
- Memory initialized: ✓
- Config exists: ✓

## Code Quality

- lint: ✓
- typecheck: ✓
- test: ✓ (42 passed)

## E2E

- Track 1 (Playwright): ✓ (5/5 specs passed)
- Track 2 (Visual): ✓ (3 screenshots captured)
  - Screenshot paths: .ai-native/reports/screenshots/

## Build

- build: ✓

## Hooks

- studybook-reminder.sh: ✓
- paradigm-change-monitor.sh: ✓
- AI tool config: ✓ (claude: settings.json hooks configured)

## Failures

(None / list of failed checks with error messages)

## Blocked Items

- chrome MCP: not installed (optional, visual track skipped)
```

### 报告存储

- 路径：`.ai-native/reports/acceptance-{YYYY-MM-DD}-{status}.md`
- PASS 和 FAIL 报告均保存
- 保留最近 10 份报告，旧报告自动归档
