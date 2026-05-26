# 记忆因子文件格式规范

本文档定义 `ai-native sync` 输出的记忆因子文件的统一格式，以及 SYNC-STATE.md 的完整模板。

---

## 一、记忆文件 frontmatter 格式

每个记忆因子文件（`.ai-native/memory/*.md`）必须以如下 YAML frontmatter 开头：

```yaml
---
name: <slug>
description: <一行说明，用于 CLAUDE.md 索引>
metadata:
  type: project
  synced-from: <40-char git hash>
  synced-at: <ISO-8601 时间戳>
  source-files:
    - <源文件路径1>
    - <源文件路径2>
---
```

### 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `name` | 是 | 因子标识，与 MANIFEST.yaml 中 `factors[].name` 一致 |
| `description` | 是 | 一行中文描述，用于 AI 工具配置中的索引注释 |
| `metadata.type` | 是 | 固定值 `project` |
| `metadata.synced-from` | 是 | 40 字符完整 git commit hash，记录蒸馏时的代码版本 |
| `metadata.synced-at` | 是 | ISO-8601 格式时间戳，如 `2026-05-25T18:00:00+08:00` |
| `metadata.source-files` | 是 | 本次蒸馏实际读取的源文件路径列表（相对于项目根目录） |

### 示例

```yaml
---
name: design-foundation
description: UI 开发行为约束：组件优先级、token 用法、布局规则
metadata:
  type: project
  synced-from: 9cc4a9a59095202c59a76757a4737bcab197638d
  synced-at: 2026-05-25T18:00:00+08:00
  source-files:
    - design/tokens.css
    - docs/design-system/README.md
---
```

---

## 二、记忆文件内容格式

### 通用规则

- 每条因子一行，以 `- ` 开头
- 单条不超过 200 字符
- 禁止出现以下模式（说明蒸馏不彻底）：
  - `本文档`
  - `以下`
  - `详见`
  - `参考`
- 禁止复制源文件大段原文
- 同一约束不在两个记忆文件中重复

### 各因子内容模板

**design-foundation.md**：≤15 条，每条聚焦"怎么做"，非"有什么"。

**forbidden-patterns.md**：≤20 条，每条以"禁止"开头，标注来源。

**known-pitfalls.md**：≤15 条，格式 `症状：根因 → 解法`。

**available-resources.md**：≤20 条，格式 `名称 — 路径 — 用途`。

**architecture-paradigm.md**：≤15 条，每条一个架构决策点。

---

## 三、SYNC-STATE.md 完整模板

```markdown
---
name: sync-state
description: 资产记忆同步元数据
metadata:
  type: reference
---

# Asset Memory Sync State

- **Synced at**: 2026-05-25T18:00:00+08:00
- **Git hash**: 9cc4a9a59095202c59a76757a4737bcab197638d
- **Monitored paths**: docs/architecture/, design/, .github/workflows/
- **Files read**:
  - design/tokens.css
  - design/README.md
  - docs/architecture/decisions.md
  - docs/standards/coding-style.md
  - README.md
- **Factors synced**: design-foundation, forbidden-patterns, known-pitfalls, available-resources, architecture-paradigm
```

---

## 四、质量验证命令

蒸馏引擎在写入完成后应自动执行以下验证：

```bash
# 验证因子文件存在
ls .ai-native/memory/SYNC-STATE.md
ls .ai-native/memory/design-foundation.md
ls .ai-native/memory/forbidden-patterns.md
ls .ai-native/memory/known-pitfalls.md
ls .ai-native/memory/available-resources.md
ls .ai-native/memory/architecture-paradigm.md

# 验证 SYNC-STATE 包含有效 git hash
grep -qE "Git hash.*[0-9a-f]{10}" .ai-native/memory/SYNC-STATE.md \
  && echo "hash OK" || echo "MISSING HASH"

# 验证因子数量（非原文堆砌）
for f in .ai-native/memory/*.md; do
  lines=$(wc -l < "$f" | tr -d ' ')
  if [ "$lines" -gt 50 ]; then
    echo "WARNING: $f has $lines lines — possible bloat"
  fi
done

# 验证 frontmatter 存在
for f in .ai-native/memory/design-foundation.md \
         .ai-native/memory/forbidden-patterns.md \
         .ai-native/memory/known-pitfalls.md \
         .ai-native/memory/available-resources.md \
         .ai-native/memory/architecture-paradigm.md; do
  grep -q "^---$" "$f" && grep -q "^name:" "$f" \
    && echo "$(basename $f): frontmatter OK" \
    || echo "$(basename $f): MISSING frontmatter"
done
```

---

## 五、AI 工具入口文件格式

蒸馏引擎需生成/更新 AI 工具入口文件。

**Claude Code**（`.claude/CLAUDE.md`）：
```markdown
# Project Context

## 资产记忆因子

以下文件由 `ai-native sync` 生成，首次使用或范式变更后需重新同步。

@memory/design-foundation.md
@memory/forbidden-patterns.md
@memory/known-pitfalls.md
@memory/available-resources.md
@memory/architecture-paradigm.md
```

**Cursor**（`.cursor/rules/ai-native.md`）：
```markdown
# AI Native Memory Factors

Always apply these constraints:

@../.ai-native/memory/design-foundation.md
@../.ai-native/memory/forbidden-patterns.md
@../.ai-native/memory/known-pitfalls.md
@../.ai-native/memory/available-resources.md
@../.ai-native/memory/architecture-paradigm.md
```

**GitHub Copilot**（`.github/copilot-instructions.md`）：
```markdown
## Project Constraints

Read before generating code:
- .ai-native/memory/design-foundation.md
- .ai-native/memory/forbidden-patterns.md
- .ai-native/memory/known-pitfalls.md
- .ai-native/memory/available-resources.md
- .ai-native/memory/architecture-paradigm.md
```

**DeepSeek TUI**（`.deepseek/rules/ai-native.md`）：
```markdown
# AI Native Memory Factors

Always apply these constraints when generating code:

@memory/design-foundation.md
@memory/forbidden-patterns.md
@memory/known-pitfalls.md
@memory/available-resources.md
@memory/architecture-paradigm.md
```

**OpenAI Codex**（`.codex/rules/ai-native.md`）：格式同 DeepSeek TUI。

### 生成规则

- 文件已存在：检查 @ 引用是否 ≥ 因子数，缺失则补充
- 文件不存在：按模板创建
- 支持 5 种引擎：claude / cursor / copilot / deepseek / codex
- `engines = ["all"]` 一次生成全部
- `ai-native sync --check` 可只校验不写入
