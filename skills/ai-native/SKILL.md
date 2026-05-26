---
name: ai-native
description: AI Native Core commands — 在对话中直接操作 ai-native（init/sync/accept/show/hooks）。当用户说 /ai-native 或提到初始化 AI 项目、蒸馏记忆因子、验收等时使用。
metadata:
  short-description: Operate ai-native-core from chat
---

# AI Native Core

在对话中直接执行 ai-native 命令。

## 命令

| 输入 | 终端命令 |
|------|---------|
| `/ai-native init` | `ai-native init` |
| `/ai-native sync` | `ai-native sync` |
| `/ai-native sync --check` | `ai-native sync --check` |
| `/ai-native sync --force` | `ai-native sync --force` |
| `/ai-native accept` | `ai-native accept` |
| `/ai-native show` | `ai-native show` |
| `/ai-native hooks install` | `ai-native hooks install` |
| `/ai-native hooks status` | `ai-native hooks status` |

## 规则

1. 在项目根目录执行（`git rev-parse --show-toplevel`）
2. sync 后读取 `.ai-native/memory/` 因子文件
3. accept 后读取 `.ai-native/reports/` 报告
4. init 后提示下一步：sync → hooks install → accept
