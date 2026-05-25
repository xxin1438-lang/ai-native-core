# Hooks 实现合约

本文档定义自迭代 hooks 的完整实现规范：pending 队列机制、冷却实现、路径分桶、多 AI 工具配置格式。

---

## 一、三阶段管道模型

```
阶段 1 — 复盘提醒（Stop hook）
  studybook-reminder.sh
  └─ 触发条件: git dirty + 冷却期过
  └─ 输出: "[AI Native] 本次话题需要复盘。y/n？"
  └─ y → AI 调用 studybook-review skill → sub-agent 读 diff → 写踩坑记录
  └─ n → diff 摘要追加到 pending 队列

阶段 2 — 范式变更检测（Commit hook）
  paradigm-change-monitor.sh
  ├─ 踩坑路径 commit → 仅建议 ai-native sync
  └─ 范式路径 commit → 建议追加变更日志 + ai-native sync

阶段 3 — 记忆更新
  ai-native sync
  → 读踩坑记录 → known-pitfalls.md
  → 读范式文件 → 其余记忆文件
```

**职责分离**：Hook 负责检测和通知，Skill/CLI 负责更新。

---

## 二、Hook A：复盘提醒

### 实现合约

| 项目 | 规格 |
|------|------|
| 触发事件 | Stop（每次 AI 响应结束） |
| 条件 | `git status --porcelain` 非空 |
| 冷却 | `/tmp/.ai-native-last-reminder` 时间戳，默认 1200s |
| 输出 | 单行：`[AI Native] 本次话题需要复盘。回复 y 由 AI 完成，n 跳过（下次合并）` |
| y 行为 | AI 调用 studybook-review skill → 读 diff + 写记录 |
| n 行为 | diff 摘要追加到 `/tmp/.ai-native-studybook-pending` |

### 冷却机制

```bash
MARKER="/tmp/.ai-native-last-reminder"
COOLDOWN=1200

if [ -f "$MARKER" ]; then
  last=$(cat "$MARKER" 2>/dev/null || echo 0)
  now=$(date +%s)
  if (( now - last < COOLDOWN )); then exit 0; fi
fi
date +%s > "$MARKER"
```

### Pending 队列

跳过复盘时自动入队，下次提醒时合并：

```bash
PENDING="/tmp/.ai-native-studybook-pending"

# 入队（用户回 n 时）
{
  echo "## $(date '+%Y-%m-%d %H:%M') 待复盘"
  git diff --stat
  echo "---"
} >> "$PENDING"

# 提醒时检测 pending
if [ -f "$PENDING" ] && [ -s "$PENDING" ]; then
  echo "[AI Native] 还有 X 个待复盘话题（$PENDING）"
fi
```

---

## 三、Hook B：范式变更检测

### 实现合约

| 项目 | 规格 |
|------|------|
| 触发事件 | PostToolUse，matcher: "Bash" |
| 过滤 | stdin JSON → 提取 `tool_input.command`，仅处理 `git commit` |
| 路径分桶 | STUDY_FILES（踩坑路径）vs PARADIGM_FILES（范式路径） |
| STUDY 分支 | 仅建议 `ai-native sync` |
| PARADIGM 分支 | 建议追加变更日志 + `ai-native sync` |
| 缓存 | PARADIGM 匹配时写入 `/tmp/.ai-native-paradigm-pending` |

### 路径分桶逻辑

路径分类从 config.toml 读取：

```toml
[paradigm]
watch_paths = ["docs/architecture/", "design/", ".github/workflows/"]
studybook_path = "docs/decisions/"
```

分桶规则：
- 匹配 `studybook_path` → STUDY_FILES（仅建议 sync）
- 匹配 `watch_paths` → PARADIGM_FILES（建议变更日志 + sync）
- 混合 commit（两类都有）→ 按 PARADIGM 处理

### 输出格式

范式变更：
```
╔══════════════════════════════════════════╗
║  [AI Native 范式变更]                    ║
║  变更文件：                              ║
║    - docs/architecture/adr-003.md       ║
║  建议 ①：追加变更日志                   ║
║  建议 ②：运行 ai-native sync            ║
╚══════════════════════════════════════════╝
```

仅踩坑：
```
[AI Native 踩坑已提交] 建议运行 ai-native sync 提炼为记忆因子
```

---

## 四、多 AI 工具配置格式

### Claude Code

`.claude/settings.json`（合并到已有文件）：

```json
{
  "hooks": {
    "Stop": [{
      "hooks": [{
        "type": "command",
        "command": "bash <项目绝对路径>/.ai-native/hooks/studybook-reminder.sh",
        "timeout": 5
      }]
    }],
    "PostToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "bash <项目绝对路径>/.ai-native/hooks/paradigm-change-monitor.sh",
        "timeout": 5
      }]
    }]
  }
}
```

### Cursor

`.cursor/mcp.json`（或对应 hook 配置）：
```json
{
  "hooks": {
    "onStop": "bash .ai-native/hooks/studybook-reminder.sh",
    "onPostToolUse": "bash .ai-native/hooks/paradigm-change-monitor.sh"
  }
}
```

### GitHub Copilot

`.github/copilot-instructions.md` 中不直接写 hooks（Copilot 不支持 hook 机制），但可通过 instructions 提示 AI：
```markdown
## AI Native Hooks

After committing paradigm files, run: ai-native sync
When work session ends with dirty git, run: ai-native studybook
```

---

## 五、变更日志格式

`docs/self-update.md`（范式变更日志）：

```markdown
# AI Native 范式变更日志

## 2026-05-25

- **Commit**: a1b2c3d — 新增安全规则记忆因子
- **变更文件**: docs/security/overview.md, .github/workflows/ci.yml
- **影响**: 新增 security-rules 因子，CI 门禁更新
```

### 初始化模板

首次 `ai-native init` 时创建：
```markdown
# AI Native 范式变更日志

记录 AI Native 范式文件（docs/architecture/、design/ 等）的系统性变更。
每次 paradigm-change-monitor 提示后由 AI 追加。

---
```
